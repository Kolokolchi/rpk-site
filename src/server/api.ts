import "server-only";
import crypto from "node:crypto";
import { isIP } from "node:net";
import { type ContentSnapshot } from "../shared/content-schema";
import { readJsonBody } from "./body";
import {
  readRequestSecurityConfig,
  type RequestSecurityConfig,
} from "./config";
import { getPublicSnapshot } from "./content-service";
import { HttpError, RuntimeConfigurationError } from "./errors";
import {
  apiSecurityHeaders,
  checkRequestSecurity,
  safeLogValue,
} from "./security";

export type ApiOperation =
  "contentGet" | "contentPost" | "cspReport" | "notFound";
export interface ReportQuota {
  consume(key: string): { allowed: boolean; retryAfterSeconds: number };
}
export function createReportQuota(now: () => number = Date.now): ReportQuota {
  const entries = new Map<string, { count: number; expiresAt: number }>();
  return {
    consume(key) {
      const timestamp = now();
      for (const [entryKey, entry] of entries)
        if (entry.expiresAt <= timestamp) entries.delete(entryKey);
      const current = entries.get(key);
      const entry =
        current && current.expiresAt > timestamp
          ? current
          : { count: 0, expiresAt: timestamp + 60_000 };
      if (!current && entries.size >= 1000)
        entries.delete(entries.keys().next().value!);
      entry.count++;
      entries.set(key, entry);
      return {
        allowed: entry.count <= 30,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((entry.expiresAt - timestamp) / 1000),
        ),
      };
    },
  };
}
export interface ApiDependencies {
  config: RequestSecurityConfig;
  snapshot?: () => Promise<ContentSnapshot>;
  quota?: ReportQuota;
  logReport?: (report: Record<string, string>) => void;
}
function objectBody(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
function safeReportSource(value: unknown): string {
  const text = safeLogValue(value, 160);
  try {
    const url = new URL(text);
    return safeLogValue(`${url.origin}${url.pathname}`, 160);
  } catch {
    return text.split(/[?#]/, 1)[0] || "";
  }
}
const reportKey = crypto.randomBytes(32);
export function createApiHandlers(dependencies: ApiDependencies) {
  const snapshot = dependencies.snapshot || getPublicSnapshot;
  const quota = dependencies.quota || createReportQuota();
  const logReport =
    dependencies.logReport ||
    ((report: Record<string, string>) =>
      console.info(
        `[security] ${JSON.stringify({ event: "csp_violation", ...report })}`,
      ));
  return async function handle(
    operation: ApiOperation,
    request: Request,
  ): Promise<Response> {
    const requestId = crypto.randomUUID();
    const headers = apiSecurityHeaders(requestId);
    const json = (body: unknown, status = 200) =>
      new Response(request.method === "HEAD" ? null : JSON.stringify(body), {
        status,
        headers: new Headers([
          ...headers,
          ["Content-Type", "application/json"],
        ]),
      });
    try {
      const redirect = checkRequestSecurity(request, dependencies.config);
      if (redirect) return redirect;
      if (operation === "notFound") return json({ error: "not_found" }, 404);
      if (
        operation === "contentPost" ||
        (operation === "contentGet" &&
          !["GET", "HEAD"].includes(request.method))
      ) {
        headers.set("Allow", "GET, HEAD");
        return json({ error: "method_not_allowed" }, 405);
      }
      if (operation === "contentGet") {
        const current = await snapshot();
        if (current.revision) headers.set("ETag", current.revision);
        return json({ content: current.content, revision: current.revision });
      }
      if (request.method !== "POST") {
        headers.set("Allow", "POST");
        return json({ error: "method_not_allowed" }, 405);
      }
      const identity = dependencies.config.vercel
        ? request.headers.get("x-vercel-forwarded-for")?.trim() || ""
        : "loopback";
      const key = crypto
        .createHmac("sha256", reportKey)
        .update(
          isIP(identity) || identity === "loopback" ? identity : "unknown",
        )
        .digest("hex");
      const allowed = quota.consume(key);
      if (!allowed.allowed) {
        headers.set("Retry-After", String(allowed.retryAfterSeconds));
        return json({ error: "too_many_requests" }, 429);
      }
      const input = await readJsonBody(request, 32 * 1024, false);
      const record = Array.isArray(input)
        ? objectBody(input[0])
        : objectBody(input);
      const report = objectBody(record.body || record["csp-report"] || record);
      logReport({
        requestId,
        directive: safeLogValue(
          report.effectiveDirective || report["effective-directive"],
          80,
        ),
        blocked: safeReportSource(report.blockedURL || report["blocked-uri"]),
        source: safeReportSource(report.sourceFile || report["source-file"]),
      });
      return new Response(null, { status: 204, headers });
    } catch (error) {
      if (error instanceof HttpError)
        return json({ error: error.code }, error.status);
      console.error(
        `[${requestId}] ${safeLogValue(error instanceof Error ? error.name : "Error", 60)}`,
      );
      return json(
        {
          error:
            error instanceof RuntimeConfigurationError
              ? "service_configuration_unavailable"
              : "server_error",
          requestId,
        },
        error instanceof RuntimeConfigurationError ? 503 : 500,
      );
    }
  };
}
const runtimeQuota = createReportQuota();
export async function apiHandler(
  operation: ApiOperation,
  request: Request,
): Promise<Response> {
  try {
    return await createApiHandlers({
      config: readRequestSecurityConfig(),
      quota: runtimeQuota,
    })(operation, request);
  } catch {
    return Response.json(
      { error: "service_configuration_unavailable" },
      { status: 503, headers: apiSecurityHeaders(crypto.randomUUID()) },
    );
  }
}
