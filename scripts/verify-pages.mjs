/* global fetch, document, window */
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const root = path.resolve("artifacts/migration/pages-build/out");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/rpk-site";
const publicOrigin =
  process.env.PUBLIC_ORIGIN || "https://kolokolchi.github.io";
const publicUrl = (route) => new URL(basePath + route, publicOrigin).href;
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};
const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    if (pathname !== basePath && !pathname.startsWith(basePath + "/")) {
      response.writeHead(404);
      response.end();
      return;
    }
    const relative = pathname.slice(basePath.length).replace(/^\/+/, "");
    let target = path.resolve(root, relative || "index.html");
    if (path.relative(root, target).startsWith("..")) {
      response.writeHead(404);
      response.end();
      return;
    }
    const stat = await fs.stat(target).catch(() => null);
    if (stat?.isDirectory()) target = path.join(target, "index.html");
    const content = await fs.readFile(target).catch(() => null);
    if (!content) {
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(await fs.readFile(path.join(root, "404.html")));
      return;
    }
    response.writeHead(200, {
      "Content-Type": mime[path.extname(target)] || "application/octet-stream",
    });
    response.end(content);
  } catch {
    response.writeHead(500);
    response.end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const url = (route) => origin + basePath + route;
const [catalogSources, solutionSource] = await Promise.all([
  Promise.all(
    ["src/shared/catalog-index.ts", "src/shared/catalog-extra-index.ts"].map(
      (filename) => fs.readFile(filename, "utf8"),
    ),
  ),
  fs.readFile("src/shared/solution-index.ts", "utf8"),
]);
const sourceSlugs = (source) =>
  [...source.matchAll(/\bslug:\s*["']([a-z0-9-]+)["']/g)].map(
    (match) => match[1],
  );
const slugs = catalogSources.flatMap(sourceSlugs);
const solutionSlugs = sourceSlugs(solutionSource);
assert.equal(
  slugs.length,
  27,
  "Expected all catalog metadata, including extras",
);
assert.equal(new Set(slugs).size, slugs.length, "Duplicate catalog slug");
assert.equal(solutionSlugs.length, 12, "Expected all business solutions");
assert.equal(
  new Set(solutionSlugs).size,
  solutionSlugs.length,
  "Duplicate solution slug",
);
const routes = [
  "/",
  "/catalog/",
  "/solutions/",
  ...slugs.map((slug) => `/catalog/${slug}/`),
  ...solutionSlugs.map((slug) => `/solutions/${slug}/`),
];
const browser = await chromium.launch({ headless: true });
const proof = { routes: [], browser: [] };
try {
  for (const route of routes) {
    const response = await fetch(url(route));
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.ok(
      html.includes('<meta http-equiv="Content-Security-Policy"'),
      route,
    );
    assert.ok(
      !html.includes("'unsafe-inline'") && !html.includes("'unsafe-eval'"),
      route,
    );
    const unprefixed = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)]
      .map((match) => match[1])
      .filter(
        (resource) =>
          resource.startsWith("/") &&
          !resource.startsWith("//") &&
          resource !== basePath &&
          !resource.startsWith(basePath + "/"),
      );
    assert.deepEqual(unprefixed, [], route + ": unprefixed resource URL");
    proof.routes.push({ route, status: response.status });
  }
  for (const route of [
    "/admin/",
    "/api/content/",
    "/catalog/not-a-service/",
    "/catalog/posm/",
    "/catalog/menu-boards/",
    "/catalog/acrylic-displays/",
    "/solutions/not-an-object/",
  ])
    assert.equal((await fetch(url(route))).status, 404, route);
  const sitemapResponse = await fetch(url("/sitemap.xml"));
  assert.equal(sitemapResponse.status, 200, "sitemap.xml");
  const sitemap = await sitemapResponse.text();
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  assert.equal(sitemapUrls.length, routes.length, "Sitemap route count");
  assert.deepEqual(
    sitemapUrls.toSorted(),
    routes.map(publicUrl).toSorted(),
    "Sitemap must list every overview and all 39 detail pages with the base path",
  );
  proof.sitemap = { status: sitemapResponse.status, urls: sitemapUrls.length };
  for (const [route, viewport] of [
    ["/", { width: 390, height: 844 }],
    ["/catalog/", { width: 1440, height: 900 }],
    ["/catalog/channel-letters/", { width: 1440, height: 900 }],
    ["/catalog/information-boards/", { width: 1440, height: 900 }],
    ["/catalog/information-boards/", { width: 390, height: 844 }],
    ["/solutions/", { width: 1440, height: 900 }],
    ["/solutions/retail/", { width: 1440, height: 900 }],
    ["/solutions/retail/", { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(url(route), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const height = await page.evaluate(
      () => document.documentElement.scrollHeight,
    );
    for (let top = 0; top < height; top += viewport.height) {
      await page.evaluate((value) => window.scrollTo(0, value), top);
      await page.waitForTimeout(25);
    }
    await page.waitForFunction(() =>
      [...document.images].every((image) => image.complete),
    );
    const broken = await page.evaluate(() =>
      [...document.images]
        .filter((image) => !image.naturalWidth)
        .map((image) => image.src),
    );
    assert.deepEqual(broken, [], route + ": broken images");
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
      false,
      route + ": horizontal overflow",
    );
    if (route === "/") {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.locator(".menu-toggle").click();
      assert.equal(
        await page.locator(".menu-toggle").getAttribute("aria-expanded"),
        "true",
      );
      await page.keyboard.press("Escape");
      assert.equal(
        await page.locator(".menu-toggle").getAttribute("aria-expanded"),
        "false",
      );
      await page.locator(".project-filters button").nth(1).click();
      assert.equal(
        await page
          .locator(".project-filters button")
          .nth(1)
          .getAttribute("aria-pressed"),
        "true",
      );
    }
    if (route === "/catalog/") {
      assert.equal(await page.locator(".catalog-card").count(), slugs.length);
      await page.locator(".catalog-group-nav button").nth(1).click();
      const filteredCount = await page.locator(".catalog-card").count();
      assert.ok(filteredCount > 0 && filteredCount < slugs.length);
    }
    if (route === "/" || route === "/solutions/") {
      assert.equal(
        await page.locator(".object-card").count(),
        solutionSlugs.length,
      );
      for (const slug of solutionSlugs) {
        assert.equal(
          await page
            .locator(`.object-card[href="${basePath}/solutions/${slug}"]`)
            .count(),
          1,
          route + ": missing solution link " + slug,
        );
      }
    }
    if (route === "/solutions/retail/") {
      for (const section of [
        "problems",
        "zones",
        "products",
        "brief",
        "process",
        "questions",
      ]) {
        assert.equal(await page.locator(`#${section} h2`).count(), 1);
      }
      assert.ok(
        (await page.locator(".solution-problems article").count()) >= 3,
      );
      assert.ok((await page.locator(".solution-zone").count()) >= 3);
      assert.ok(
        (await page.locator(".solution-techniques section").count()) >= 6,
      );
      assert.ok(
        (await page
          .locator(
            `.solution-products a[href="${basePath}/catalog/information-boards"]`,
          )
          .count()) > 0,
        "Retail solution must link to the information board description",
      );
    }
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    assert.equal(canonical, publicUrl(route), route + ": canonical URL");
    assert.deepEqual(errors, [], route + ": browser/hydration/CSP errors");
    proof.browser.push({
      route,
      viewport,
      brokenImages: broken.length,
      errors,
      canonical,
    });
    await page.close();
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
await fs.writeFile(
  "artifacts/migration/pages-build/verification.json",
  JSON.stringify(proof, null, 2) + "\n",
);
console.log(JSON.stringify(proof, null, 2));
