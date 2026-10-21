import { expect, test } from "@playwright/test";
import { catalogIndex } from "../src/shared/catalog-index";

test("every task has a distinct environment that stays present through assembly", async ({
  page,
}, testInfo) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const backgrounds = new Map<string, string>();
  for (const entry of catalogIndex) {
    await page.goto(`/catalog/${entry.slug}#interactive-preview`);
    const preview = page.locator(".product-preview");
    const scene = preview.locator(".preview-scene");
    await expect(scene.locator('[data-projection="isometric"]')).toHaveCount(1);
    const context = scene.locator("[data-scene-context]");
    await expect(context).toHaveCount(1);
    await expect(context).toHaveAttribute("data-scene-context", entry.slug);
    await expect(context.locator(".preview-part")).toHaveCount(0);
    expect(
      await context.evaluate((node) => node.closest(".preview-part") === null),
      entry.slug,
    ).toBe(true);
    const initial = await context.innerHTML();
    expect(initial.length, entry.slug).toBeGreaterThan(200);
    const geometry = await context.evaluate((node) =>
      Array.from(
        node.querySelectorAll("path,rect,polygon,line,circle,ellipse"),
        (shape) =>
          `${shape.tagName}:${Array.from(shape.attributes)
            .filter(
              (attribute) =>
                !["id", "class"].includes(attribute.name) &&
                !attribute.name.startsWith("data-"),
            )
            .map((attribute) => `${attribute.name}=${attribute.value}`)
            .join(";")}`,
      ).join("\n"),
    );
    expect(
      Array.from(backgrounds.values()),
      `${entry.slug}: own background geometry`,
    ).not.toContain(geometry);
    backgrounds.set(entry.slug, geometry);

    const steps = preview.locator(".preview-steps button");
    for (let step = 0; step <= 3; step++) {
      await steps.nth(step).click();
      await expect(scene).toHaveAttribute("data-step", String(step));
      expect(
        await context.innerHTML(),
        `${entry.slug}: unchanged environment at step ${step + 1}`,
      ).toBe(initial);
      await expect(context).toBeVisible();
    }
    const light = preview.getByRole("checkbox", { name: "Включить подсветку" });
    if (await light.count()) {
      await light.uncheck();
      expect(
        await context.innerHTML(),
        `${entry.slug}: light affects the product only`,
      ).toBe(initial);
      await light.check();
    }
    await scene.screenshot({
      path: testInfo.outputPath(`context-${entry.slug}.png`),
    });
  }
  expect(backgrounds.size).toBe(27);
});

test("neon illumination adds light without introducing furniture or changing the room", async ({
  page,
}, testInfo) => {
  await page.goto("/catalog/neon-signs#interactive-preview");
  const preview = page.locator(".product-preview");
  const scene = preview.locator(".preview-scene");
  const context = scene.locator("[data-scene-context]");
  const steps = preview.locator(".preview-steps button");
  await steps.nth(2).click();
  const room = await context.innerHTML();
  const illumination = scene.locator('[data-stage-kind="illumination"]');
  expect(await illumination.count()).toBeGreaterThan(0);
  await expect
    .poll(async () =>
      illumination.evaluateAll((nodes) =>
        nodes.every((node) => Number(getComputedStyle(node).opacity) === 0),
      ),
    )
    .toBe(true);
  await scene.screenshot({
    path: testInfo.outputPath("neon-before-light.png"),
  });
  await steps.nth(3).click();
  expect(await context.innerHTML()).toBe(room);
  await expect
    .poll(async () =>
      illumination.evaluateAll((nodes) =>
        nodes.some((node) => Number(getComputedStyle(node).opacity) > 0.9),
      ),
    )
    .toBe(true);
  await scene.screenshot({ path: testInfo.outputPath("neon-after-light.png") });
  await preview.getByRole("checkbox", { name: "Включить подсветку" }).uncheck();
  await expect
    .poll(async () =>
      illumination.evaluateAll((nodes) =>
        nodes.every((node) => Number(getComputedStyle(node).opacity) === 0),
      ),
    )
    .toBe(true);
  expect(await context.innerHTML()).toBe(room);
});
