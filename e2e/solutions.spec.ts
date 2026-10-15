import { expect, test } from "@playwright/test";
import { solutionHref, solutionIndex } from "../src/shared/solution-index";
import { extraCatalogIndex } from "../src/shared/catalog-extra-index";

test("all object cards open complete dedicated pages with metadata and no editor", async ({
  page,
  request,
}) => {
  await page.goto("/#objects");
  await expect(page.locator(".object-card")).toHaveCount(solutionIndex.length);
  for (const entry of solutionIndex) {
    await expect(
      page.locator(`.object-card[href="${solutionHref(entry.slug)}"]`),
    ).toHaveCount(1);
    const response = await request.get(solutionHref(entry.slug));
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(entry.title);
    expect(html).toContain('id="problems"');
    expect(html).toContain('id="zones"');
    expect(html).toContain("Материалы и исполнение");
    expect(html).toContain("Что учесть");
    expect(html).toContain(`http://127.0.0.1:3100${solutionHref(entry.slug)}`);
    expect(html).toContain("application/ld+json");
    expect(html).not.toContain("contenteditable");
  }
  await page.locator('.object-card[href="/solutions/retail"]').click();
  await expect(page).toHaveURL(/\/solutions\/retail$/);
  await expect(page.locator("h1")).toContainText("Магазины");
  await expect(page.locator(".solution-zone")).toHaveCount(4);
  await page.locator('#products a[href="/catalog/posm"]').click();
  await expect(page.locator("h1")).toContainText("POSM");
  for (const entry of extraCatalogIndex)
    expect((await request.get(`/catalog/${entry.slug}`)).status()).toBe(200);
  expect((await request.get("/solutions/unknown-object")).status()).toBe(404);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("/solutions/events");
  expect(await sitemap.text()).toContain("/catalog/posm");
});

test("expanded solutions work on desktop and phone without overflow or missing images", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/solutions",
      "/solutions/retail",
      "/solutions/healthcare",
      "/solutions/events",
      "/catalog/posm",
    ]) {
      await page.goto(route);
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (const image of document.images) image.loading = "eager";
        await Promise.all(
          Array.from(document.images).map((image) => image.decode()),
        );
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route + " overflow",
      ).toBe(true);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(
        await page
          .locator("img")
          .evaluateAll((images) =>
            images.every(
              (image) =>
                image instanceof HTMLImageElement &&
                image.complete &&
                image.naturalWidth > 0,
            ),
          ),
      ).toBe(true);
      if (route.startsWith("/solutions/")) {
        await expect(page.locator(".solution-techniques h4")).toHaveCount(8);
        await expect(page.locator(".solution-zone-nav a")).toHaveCount(4);
      }
    }
  }
  expect(errors).toEqual([]);
});
