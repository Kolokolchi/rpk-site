import { afterEach, expect, test, vi } from "vitest";
import { createApiHandlers, createReportQuota } from "../src/server/api";
import { readBoundedBody } from "../src/server/body";
import { readRequestSecurityConfig } from "../src/server/config";
import { getPublicSnapshot } from "../src/server/content-service";
import { safeLogValue } from "../src/server/security";

afterEach(() => vi.restoreAllMocks());
const config = readRequestSecurityConfig({
  NODE_ENV: "test",
  PUBLIC_ORIGIN: "http://localhost:3000",
});
function request(
  pathname: string,
  method = "GET",
  body?: string,
  headers: Record<string, string> = {},
) {
  return new Request(`${config.publicOrigin}${pathname}`, {
    method,
    headers: { host: "localhost:3000", ...headers },
    ...(body === undefined ? {} : { body }),
  });
}

test("source-backed content reads preserve the existing snapshot/ETag contract and mutations cannot alter source", async () => {
  const handler = createApiHandlers({ config });
  const first = await handler("contentGet", request("/api/content"));
  const snapshot = await first.json();
  expect(first.status).toBe(200);
  expect(first.headers.get("etag")).toMatch(/^"sha256-[a-f0-9]{64}"$/);
  expect(snapshot.revision).toBe(first.headers.get("etag"));
  expect(snapshot.content.hero.title).toBeTruthy();
  const attempted = await handler(
    "contentPost",
    request("/api/content", "POST", "invalid-json", {
      "content-type": "application/json",
    }),
  );
  expect(attempted.status).toBe(405);
  expect(attempted.headers.get("allow")).toBe("GET, HEAD");
  const second = await handler("contentGet", request("/api/content"));
  expect(await second.json()).toEqual(snapshot);
  const head = await handler("contentGet", request("/api/content", "HEAD"));
  expect(head.status).toBe(200);
  expect(await head.text()).toBe("");
  expect(head.headers.get("etag")).toBe(snapshot.revision);
  expect(first.headers.get("cache-control")).toBe("no-store");
  expect(first.headers.get("x-content-type-options")).toBe("nosniff");
});

test("unknown admin/media/configuration API routes return 404 for every method", async () => {
  const handler = createApiHandlers({ config });
  for (const pathname of [
    "/api/admin/session",
    "/api/admin/login",
    "/api/admin/images",
    "/api/media/unknown.jpg",
    "/api/.env",
    "/api/server.js",
  ]) {
    for (const method of ["GET", "POST", "PUT", "DELETE"]) {
      const response = await handler("notFound", request(pathname, method));
      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: "not_found" });
    }
  }
});

test("source snapshots use stable revisions and independent content copies", async () => {
  const first = await getPublicSnapshot();
  const second = await getPublicSnapshot();
  expect(first.revision).toBe(second.revision);
  expect(first.repairedFallback).toBe(false);
  first.content.hero.title = "Local mutation";
  expect((await getPublicSnapshot()).content.hero.title).toBe(
    second.content.hero.title,
  );
});

test("Host allowlisting and production HTTPS redirects apply to read-only handlers", async () => {
  const handler = createApiHandlers({ config });
  expect(
    (
      await handler(
        "contentGet",
        request("/api/content", "GET", undefined, { host: "evil.example" }),
      )
    ).status,
  ).toBe(421);
  const production = readRequestSecurityConfig({
    NODE_ENV: "production",
    VERCEL: "1",
  });
  expect(production.publicOrigin).toBe("https://www.rpk.kz");
  const deployed = createApiHandlers({ config: production });
  const insecure = new Request("http://www.rpk.kz/api/content?test=1", {
    headers: { host: "www.rpk.kz", "x-forwarded-proto": "http" },
  });
  const redirect = await deployed("contentGet", insecure);
  expect(redirect.status).toBe(308);
  expect(redirect.headers.get("location")).toBe(
    "https://www.rpk.kz/api/content?test=1",
  );
  const secure = new Request("https://www.rpk.kz/api/content", {
    headers: { host: "www.rpk.kz", "x-forwarded-proto": "https" },
  });
  expect((await deployed("contentGet", secure)).status).toBe(200);
  const insecurePost = new Request(
    "http://www.rpk.kz/api/security/csp-report",
    {
      method: "POST",
      headers: { host: "www.rpk.kz", "x-forwarded-proto": "http" },
    },
  );
  expect((await deployed("cspReport", insecurePost)).status).toBe(400);
});

test("development and production preview are confined to explicitly configured loopback origins", () => {
  expect(() =>
    readRequestSecurityConfig({
      NODE_ENV: "production",
      PUBLIC_ORIGIN: "http://localhost:3000",
    }),
  ).toThrow();
  const preview = readRequestSecurityConfig({
    NODE_ENV: "production",
    RPK_LOCAL_PREVIEW: "true",
    PUBLIC_ORIGIN: "http://127.0.0.1:3000",
  });
  expect(preview.localPreview).toBe(true);
  expect(() =>
    readRequestSecurityConfig({
      NODE_ENV: "production",
      RPK_LOCAL_PREVIEW: "true",
      VERCEL: "1",
      PUBLIC_ORIGIN: "http://localhost:3000",
    }),
  ).toThrow();
  expect(() =>
    readRequestSecurityConfig({
      NODE_ENV: "production",
      VERCEL: "1",
      ALLOWED_HOSTS: "*",
    }),
  ).toThrow();
  expect(() =>
    readRequestSecurityConfig({
      NODE_ENV: "test",
      PUBLIC_ORIGIN: "http://remote.example",
    }),
  ).toThrow();
  const vercel = readRequestSecurityConfig({
    NODE_ENV: "production",
    VERCEL: "1",
    VERCEL_URL: "rpk-preview.vercel.app",
  });
  expect(vercel.allowedHosts.has("rpk-preview.vercel.app")).toBe(true);
});

test("CSP reports are bounded, log only sanitized fields and enforce an expiring process quota", async () => {
  let now = 0;
  const quota = createReportQuota(() => now);
  const reports: Record<string, string>[] = [];
  const handler = createApiHandlers({
    config,
    quota,
    logReport: (report) => reports.push(report),
  });
  const payload = JSON.stringify({
    "csp-report": {
      "effective-directive": "script-src\n\u202E",
      "blocked-uri":
        "https://user:secret@evil.example/script?token=private#hash",
      "source-file": "https://www.rpk.kz/?credential=hidden",
    },
  });
  const post = () =>
    request("/api/security/csp-report", "POST", payload, {
      "content-type": "application/csp-report",
    });
  expect((await handler("cspReport", post())).status).toBe(204);
  expect(reports[0]).toMatchObject({
    directive: "script-src",
    blocked: "https://evil.example/script",
    source: "https://www.rpk.kz/",
  });
  for (let index = 1; index < 30; index++)
    expect((await handler("cspReport", post())).status).toBe(204);
  const blocked = await handler("cspReport", post());
  expect(blocked.status).toBe(429);
  expect(blocked.headers.get("retry-after")).toBe("60");
  now = 60_000;
  expect((await handler("cspReport", post())).status).toBe(204);
  expect(
    (
      await handler(
        "cspReport",
        request("/api/security/csp-report", "POST", "{", {
          "content-type": "application/json",
        }),
      )
    ).status,
  ).toBe(400);
  expect(
    (
      await handler(
        "cspReport",
        request("/api/security/csp-report", "POST", "x".repeat(32 * 1024 + 1), {
          "content-type": "application/json",
        }),
      )
    ).status,
  ).toBe(413);
  expect(safeLogValue("safe\n\u009B31m\u202Ename")).toBe("safe31mname");
});

test("streaming body limits do not trust Content-Length and encoded input is rejected", async () => {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array(8));
      controller.enqueue(new Uint8Array(8));
      controller.close();
    },
  });
  const streamed = new Request("http://localhost/", {
    method: "POST",
    body,
    duplex: "half",
  } as RequestInit);
  await expect(readBoundedBody(streamed, 15)).rejects.toMatchObject({
    status: 413,
    code: "request_too_large",
  });
  await expect(
    readBoundedBody(
      request("/api/security/csp-report", "POST", "small", {
        "content-encoding": "gzip",
      }),
      100,
    ),
  ).rejects.toMatchObject({ status: 415 });
});

test("unexpected failures expose only a request ID and never provider/source details", async () => {
  const logs = vi.spyOn(console, "error").mockImplementation(() => {});
  const handler = createApiHandlers({
    config,
    snapshot: async () => {
      throw new Error("private-provider-secret");
    },
  });
  const response = await handler("contentGet", request("/api/content"));
  expect(response.status).toBe(500);
  const error = await response.json();
  expect(error.requestId).toBe(response.headers.get("x-request-id"));
  expect(JSON.stringify(error)).not.toContain("private-provider-secret");
  expect(logs.mock.calls.flat().join(" ")).not.toContain(
    "private-provider-secret",
  );
});
