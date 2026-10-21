import { test, expect } from "@playwright/test";
import { catalogGroups, catalogIndex } from "../src/shared/catalog-index";
import { solutionIndex } from "../src/shared/solution-index";
import sourceContent from "../src/shared/site-content.json" with { type: "json" };

test("homepage groups show one responsive row and expand independently", async ({
  page,
}) => {
  for (const [width, catalogColumns, objectColumns] of [
    [1440, 4, 4],
    [1100, 3, 2],
    [820, 2, 2],
    [600, 2, 1],
    [520, 1, 1],
    [390, 1, 1],
  ]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const catalog = page.locator(".catalog-index .expandable-grid");
    const objects = page.locator("#objects .expandable-grid");
    for (const [group, cards, columns] of [
      [catalog, ".catalog-card", catalogColumns],
      [objects, ".object-card", objectColumns],
    ] as const) {
      await expect(group.locator(`${cards}:visible`)).toHaveCount(columns);
      const toggle = group.getByRole("button", {
        name: "Показать всё",
        exact: true,
      });
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      const controlledId = await toggle.getAttribute("aria-controls");
      expect(controlledId).toBeTruthy();
      await expect(group.locator(`[id="${controlledId}"]`)).toHaveCount(1);
      const rowTops = await group
        .locator(`${cards}:visible`)
        .evaluateAll((entries) =>
          entries.map((entry) => Math.round(entry.getBoundingClientRect().top)),
        );
      expect(new Set(rowTops).size, `${width}px ${cards}: first row`).toBe(1);
    }

    const catalogToggle = catalog.locator(".grid-toggle");
    const objectsToggle = objects.locator(".grid-toggle");
    await catalogToggle.click();
    await expect(catalog.locator(".catalog-card:visible")).toHaveCount(
      catalogIndex.length,
    );
    await expect(catalogToggle).toHaveText("Свернуть");
    await expect(catalogToggle).toHaveAttribute("aria-expanded", "true");
    await expect(objects.locator(".object-card:visible")).toHaveCount(
      objectColumns,
    );
    await objectsToggle.click();
    await expect(objects.locator(".object-card:visible")).toHaveCount(
      solutionIndex.length,
    );
    await expect(objectsToggle).toHaveAttribute("aria-expanded", "true");
    await catalogToggle.click();
    await expect(catalog.locator(".catalog-card:visible")).toHaveCount(
      catalogColumns,
    );
    await expect(objects.locator(".object-card:visible")).toHaveCount(
      solutionIndex.length,
    );
    await objectsToggle.click();
    await expect(objects.locator(".object-card:visible")).toHaveCount(
      objectColumns,
    );
  }
});

test("catalog filters reset the homepage preview and overview pages stay complete", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const catalog = page.locator(".catalog-index");
  await catalog
    .getByRole("button", { name: "Показать всё", exact: true })
    .click();
  await catalog
    .getByRole("button", { name: catalogGroups[0].title, exact: true })
    .click();
  await expect(catalog.locator(".catalog-card:visible")).toHaveCount(4);
  await expect(catalog.locator(".grid-toggle")).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await catalog
    .getByRole("button", { name: "Показать всё", exact: true })
    .click();
  await expect(catalog.locator(".catalog-card:visible")).toHaveCount(
    catalogIndex.filter((entry) => entry.group === catalogGroups[0].id).length,
  );

  await page.goto("/catalog");
  await expect(page.locator(".catalog-card:visible")).toHaveCount(
    catalogIndex.length,
  );
  await expect(page.locator(".grid-toggle")).toHaveCount(0);
  await page.goto("/solutions");
  await expect(page.locator(".object-card:visible")).toHaveCount(
    solutionIndex.length,
  );
  await expect(page.locator(".grid-toggle")).toHaveCount(0);
});

test("all technology pages render content and metadata before JavaScript", async ({
  request,
}) => {
  for (const entry of catalogIndex) {
    const response = await request.get(`/catalog/${entry.slug}`);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain(entry.title);
    expect(html).toContain("application/ld+json");
    expect(html).toContain(`http://127.0.0.1:3100/catalog/${entry.slug}`);
  }
  expect((await request.get("/catalog/not-a-technology")).status()).toBe(404);
  expect((await request.get("/.env")).status()).toBe(404);
});
test("public browser, CSP, filters, images and keyboard menu", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  const response = await page.goto("/");
  expect(response?.headers()["content-security-policy"]).toContain("'nonce-");
  await expect(page.locator("h1")).toContainText("Больше");
  await expect(page.locator(".project-card")).toHaveCount(
    sourceContent.portfolio.length,
  );
  await page
    .locator(".project-filters button")
    .filter({ hasText: "Магазины" })
    .click();
  await expect(
    page.locator(".project-filters button").filter({ hasText: "Магазины" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(await page.locator(".project-card:visible").count()).toBeLessThan(
    sourceContent.portfolio.length,
  );
  await page.goto("/catalog");
  await expect(page.locator(".catalog-card")).toHaveCount(catalogIndex.length);
  await page.goto("/catalog/channel-letters");
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images)
        .filter((image) => image.loading !== "lazy")
        .map((image) => image.decode().catch(() => undefined)),
    );
  });
  expect(
    await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter((image) => image.getAttribute("loading") !== "lazy")
          .every(
            (image) =>
              image instanceof HTMLImageElement &&
              image.complete &&
              image.naturalWidth > 0,
          ),
      ),
  ).toBe(true);
  expect(errors).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".menu-toggle").click();
  await expect(page.locator(".site-header")).toBeVisible();
  await page.keyboard.press("Escape");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("public responsive evidence and editor removal", async ({
  page,
  request,
}) => {
  for (const width of [1440, 1100, 820, 600, 520, 390, 380]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  for (const width of process.env.RPK_CAPTURE_EVIDENCE === "true"
    ? [1440, 390]
    : [])
    for (const [name, url] of [
      ["home", "/"],
      ["catalog", "/catalog"],
      ["article", "/catalog/channel-letters"],
    ]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.goto(url);
      await page.evaluate(async () => {
        await document.fonts.ready;
        for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        await Promise.all(
          Array.from(document.images).map((image) =>
            image.decode().catch(() => undefined),
          ),
        );
        window.scrollTo(0, 0);
      });
      await page.screenshot({
        path: `artifacts/migration/after/${name}-${width}.png`,
        fullPage: true,
        animations: "disabled",
      });
    }
  await page.goto("/catalog/channel-letters?admin=1");
  await expect(page.locator("h1")).toContainText("Объёмные буквы");
  await expect(
    page.locator("[contenteditable],.admin-panel,.login-gate"),
  ).toHaveCount(0);
  for (const path of [
    "/admin",
    "/admin/preview",
    "/api/admin/session",
    "/api/admin/login",
    "/api/admin/images",
  ])
    expect((await request.get(path)).status()).toBe(404);
  expect(
    (
      await request.post("/api/content", {
        data: { hero: { title: "Cannot change the site" } },
      })
    ).status(),
  ).toBe(405);
});
