import { expect, test, type Locator, type Page } from "@playwright/test";
import { resolve } from "node:path";
import { catalogIndex } from "../src/shared/catalog-index";

const imagePath = resolve("public/assets/rpk-mark-transparent.png");

async function openPreview(page: Page, path = "/catalog/channel-letters") {
  await page.goto(path);
  const preview = page.locator(".product-preview");
  await expect(preview).toBeVisible();
  await preview.scrollIntoViewIfNeeded();
  return preview;
}

async function paintedGeometry(scene: Locator) {
  return scene.evaluate((element) =>
    Array.from(
      element.querySelectorAll(
        "path, rect, polygon, line, circle, ellipse, image, text, g, stop",
      ),
      (shape) =>
        `${shape.tagName}:${Array.from(shape.attributes, (attribute) => `${attribute.name}=${attribute.value}`).join(";")}`,
    ).join("\n"),
  );
}

async function setRange(preview: Locator, name: string, key: string) {
  const range = preview.getByRole("slider", { name: new RegExp(`^${name}`) });
  await range.focus();
  await range.press(key);
  return range;
}

test("every catalog direction has a usable contextual model and its own controls", async ({
  page,
}, testInfo) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const clientErrors: string[] = [];
  page.on("pageerror", (error) => clientErrors.push(error.message));
  for (const path of ["/", "/catalog"]) {
    await page.goto(path);
    await expect(page.locator(".product-preview")).toHaveCount(0);
  }
  const visited = new Set<string>();

  for (const entry of catalogIndex) {
    const preview = await openPreview(page, `/catalog/${entry.slug}`);
    await expect(preview).toHaveAttribute("data-slug", entry.slug);
    await expect(preview.getByRole("combobox")).toHaveCount(0);
    const scene = preview.locator(".preview-scene");
    await expect(
      preview.locator(".preview-scene-caption > span").first(),
    ).toHaveText(entry.title);
    await expect(scene).toHaveAccessibleName(
      new RegExp(entry.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
    await expect(preview.locator(".preview-steps button")).toHaveCount(4);
    expect(
      await scene.locator("path, rect, polygon").count(),
      entry.slug,
    ).toBeGreaterThan(10);
    expect(
      await scene.locator(".preview-part").count(),
      entry.slug,
    ).toBeGreaterThanOrEqual(3);
    await expect(preview.getByRole("slider")).toHaveCount(2);
    await scene.screenshot({
      path: testInfo.outputPath(`scene-${entry.slug}.png`),
    });
    // Check the controls on every technology, including the less common ones.
    // A label/value changing alone is insufficient: the painted object must change.
    for (const dimension of ["Ширина", "Высота"] as const) {
      const before = await paintedGeometry(scene);
      await setRange(preview, dimension, "Home");
      const smallest = await paintedGeometry(scene);
      expect(smallest, `${entry.slug}: ${dimension} minimum`).not.toBe(before);
      await setRange(preview, dimension, "End");
      expect(
        await paintedGeometry(scene),
        `${entry.slug}: ${dimension} maximum`,
      ).not.toBe(smallest);
    }
    const textField = preview.getByRole("textbox");
    if (await textField.count()) {
      await textField.fill("ҚАЗАҚ БРЕНД");
      if (entry.slug === "vinyl-graphics") {
        await expect(scene.locator('[data-vinyl-glyphs="contour"]')).toHaveText(
          "ҚАЗАҚ БРЕНД",
        );
        await expect(
          scene.locator('[data-vinyl-glyphs="separate"]'),
        ).toHaveText("ҚАЗАҚ БРЕНД");
      } else {
        expect(
          await scene.locator("text").allTextContents(),
          `${entry.slug}: custom text`,
        ).toContain("ҚАЗАҚ БРЕНД");
      }
    }
    const beforeColor = await paintedGeometry(scene);
    await preview.getByRole("button", { name: "Синий", exact: true }).click();
    expect(
      await paintedGeometry(scene),
      `${entry.slug}: chosen color`,
    ).not.toBe(beforeColor);
    const light = preview.getByRole("checkbox", { name: "Включить подсветку" });
    if (await light.count()) {
      const beforeLight = await paintedGeometry(scene);
      await light.uncheck();
      expect(
        await paintedGeometry(scene),
        `${entry.slug}: illumination`,
      ).not.toBe(beforeLight);
    }
    const upload = preview.getByLabel("Загрузить свой макет", { exact: true });
    if (await upload.count()) {
      await upload.setInputFiles(imagePath);
      await expect(
        preview.getByRole("button", {
          name: "Заменить изображение",
          exact: true,
        }),
      ).toBeEnabled();
      expect(
        await scene.locator('image[href^="blob:"]').count(),
        `${entry.slug}: uploaded artwork`,
      ).toBeGreaterThan(0);
      const art = scene.locator("[data-artwork-transform]").first();
      await expect(art).toBeAttached();
      await preview
        .getByRole("button", { name: "Заполнить поверхность", exact: true })
        .click();
      await expect(
        scene.locator('image[href^="blob:"]').first(),
      ).toHaveAttribute("preserveAspectRatio", "xMidYMid slice");
      await setRange(preview, "Масштаб макета", "End");
      await expect(art).toHaveAttribute("transform", /scale\(1.8\)/);
      await preview
        .getByRole("button", { name: "Сбросить размещение", exact: true })
        .click();
    }
    visited.add((await preview.getAttribute("data-slug"))!);
  }

  expect(visited.size).toBe(27);
  expect(clientErrors).toEqual([]);
  const preview = await openPreview(page);
  await preview.screenshot({
    path: testInfo.outputPath("preview-desktop-1440.png"),
  });
});

test("the actual sign reflects Unicode, blank and long visitor text", async ({
  page,
}) => {
  const preview = await openPreview(page);
  const field = preview.getByRole("textbox", { name: /Ваша надпись/ });
  const scene = preview.locator(".preview-scene");
  const unicode = "ҚАЗАҚ ӘЛЕМІ 🌿";
  await field.fill(unicode);
  await expect(field).toHaveValue(unicode);
  await expect(scene).toHaveAccessibleName(new RegExp(unicode));
  expect(await scene.locator("text").allTextContents()).toContain(unicode);

  await field.fill("");
  await expect(scene).toHaveAccessibleName(/без надписи/);
  expect(
    (await scene.locator("text").allTextContents()).join(""),
  ).not.toContain("ВАШ БРЕНД");

  await field.fill("Ә".repeat(40));
  const bounded = "Ә".repeat(24);
  await expect(field).toHaveValue(bounded);
  expect(await scene.locator("text").allTextContents()).toContain(bounded);
  const escapedText = "<script>ЖАРНАМА</script>";
  await field.fill(escapedText);
  expect(await scene.locator("script").count()).toBe(0);
  expect(await scene.locator("text").allTextContents()).toContain(escapedText);
});

test("sizes, color, light, manufacturing steps and exploded layers change the product", async ({
  page,
}) => {
  const preview = await openPreview(page, "/catalog/lightboxes");
  const scene = preview.locator(".preview-scene");
  const beforeWidth = await paintedGeometry(scene);
  const width = await setRange(preview, "Ширина", "End");
  await expect(width).toHaveValue("360");
  await expect(width).toHaveAttribute("aria-valuetext", "360 сантиметров");
  expect(await paintedGeometry(scene)).not.toBe(beforeWidth);
  const beforeHeight = await paintedGeometry(scene);
  const height = await setRange(preview, "Высота", "Home");
  await expect(height).toHaveValue("50");
  expect(await paintedGeometry(scene)).not.toBe(beforeHeight);

  const beforeColor = await paintedGeometry(scene);
  await preview.getByRole("button", { name: "Синий", exact: true }).click();
  await expect(
    preview.getByRole("button", { name: "Синий", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(await paintedGeometry(scene)).not.toBe(beforeColor);
  const beforeLight = await paintedGeometry(scene);
  await preview.getByRole("checkbox", { name: "Включить подсветку" }).uncheck();
  expect(await paintedGeometry(scene)).not.toBe(beforeLight);

  const steps = preview.locator(".preview-steps button");
  await steps.nth(0).click();
  await expect(scene).toHaveAttribute("data-step", "0");
  await expect(scene.locator('.preview-part[data-visible="true"]')).toHaveCount(
    0,
  );
  await steps.nth(2).click();
  await expect(steps.nth(2)).toHaveAttribute("aria-current", "step");
  expect(
    await scene.locator('.preview-part[data-visible="true"]').count(),
  ).toBeGreaterThan(0);
  expect(
    await scene.locator('.preview-part[data-visible="false"]').count(),
  ).toBeGreaterThan(0);
  await preview.getByRole("button", { name: "По слоям", exact: true }).click();
  await expect(scene).toHaveAttribute("data-step", "3");
  await expect(scene).toHaveAttribute("data-exploded", "true");
  await expect(
    preview.getByRole("button", { name: "Собрать изделие", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await preview
    .getByRole("button", { name: "Собрать изделие", exact: true })
    .click();
  await expect(scene).toHaveAttribute("data-exploded", "false");
});

test("local image upload renders on the product, validates bad files and can be removed", async ({
  page,
}) => {
  const preview = await openPreview(page, "/catalog/lightboxes");
  const upload = preview.getByLabel("Загрузить свой макет", { exact: true });
  await upload.setInputFiles(imagePath);
  await expect(
    preview.getByRole("button", { name: "Заменить изображение", exact: true }),
  ).toBeEnabled();
  const productImage = preview
    .locator('.preview-scene image[href^="blob:"]')
    .first();
  await expect(productImage).toBeAttached();
  const objectUrl = await productImage.getAttribute("href");
  expect(
    await page.evaluate(async (url) => {
      const image = new Image();
      image.src = url!;
      await image.decode();
      return image.naturalWidth > 0;
    }, objectUrl),
  ).toBe(true);

  await upload.setInputFiles({
    name: "not-an-image.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("not a picture"),
  });
  await expect(preview.getByRole("alert")).toContainText(
    "Выберите изображение PNG, JPG, WebP или SVG.",
  );
  await expect(productImage).toHaveAttribute("href", objectUrl!);
  await upload.setInputFiles({
    name: "oversized.png",
    mimeType: "image/png",
    buffer: Buffer.alloc(8 * 1024 * 1024 + 1),
  });
  await expect(preview.getByRole("alert")).toContainText("Файл больше 8 МБ");
  await upload.setInputFiles({
    name: "broken.png",
    mimeType: "image/png",
    buffer: Buffer.from("not a valid PNG"),
  });
  await expect(preview.getByRole("alert")).toContainText(
    "Не удалось прочитать изображение",
  );
  await expect(productImage).toHaveAttribute("href", objectUrl!);

  await preview
    .getByRole("button", { name: "Удалить изображение", exact: true })
    .click();
  await expect(
    preview.locator('.preview-scene image[href^="blob:"]'),
  ).toHaveCount(0);
  await expect(
    preview.getByRole("button", { name: "Загрузить свой макет", exact: true }),
  ).toBeVisible();
});

test("view changes retain the chosen artwork and reset restores the initial product", async ({
  page,
}) => {
  const preview = await openPreview(page, "/catalog/lightboxes");
  await preview.getByRole("textbox", { name: /Ваша надпись/ }).fill("БІРІНШІ");
  await setRange(preview, "Ширина", "End");
  await preview.getByRole("button", { name: "Зелёный", exact: true }).click();
  await preview.getByRole("checkbox", { name: "Включить подсветку" }).uncheck();
  await preview
    .getByLabel("Загрузить свой макет", { exact: true })
    .setInputFiles(imagePath);
  const image = preview.locator('.preview-scene image[href^="blob:"]').first();
  await expect(image).toBeAttached();
  const imageUrl = await image.getAttribute("href");
  await expect(
    preview.getByRole("textbox", { name: /Ваша надпись/ }),
  ).toBeDisabled();

  await preview.getByRole("button", { name: "По слоям", exact: true }).click();
  await preview.locator(".preview-steps button").nth(1).click();
  await preview.locator(".preview-steps button").nth(3).click();
  await expect(preview.getByRole("slider", { name: /^Ширина/ })).toHaveValue(
    "360",
  );
  await expect(
    preview.getByRole("button", { name: "Зелёный", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    preview.getByRole("checkbox", { name: "Включить подсветку" }),
  ).not.toBeChecked();
  await expect(image).toHaveAttribute("href", imageUrl!);

  await preview.getByRole("button", { name: "Сбросить", exact: true }).click();
  await expect(
    preview.getByRole("textbox", { name: /Ваша надпись/ }),
  ).toBeEnabled();
  await expect(
    preview.getByRole("textbox", { name: /Ваша надпись/ }),
  ).toHaveValue("КОФЕ");
  await expect(preview.getByRole("slider", { name: /^Ширина/ })).toHaveValue(
    "240",
  );
  await expect(preview.getByRole("slider", { name: /^Высота/ })).toHaveValue(
    "100",
  );
  await expect(
    preview.getByRole("button", { name: "Оранжевый", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    preview.getByRole("checkbox", { name: "Включить подсветку" }),
  ).toBeChecked();
  await expect(
    preview.locator('.preview-scene image[href^="blob:"]'),
  ).toHaveCount(0);
  await expect(preview.locator(".preview-scene")).toHaveAttribute(
    "data-exploded",
    "false",
  );
});

test("reduced motion starts assembled and individual technology pages keep their model", async ({
  page,
}) => {
  const preview = await openPreview(page, "/catalog/facades-and-entrances");
  await expect(preview).toHaveAttribute("data-slug", "facades-and-entrances");
  await expect(preview.getByRole("combobox")).toHaveCount(0);
  const scene = preview.locator(".preview-scene");
  await expect(scene).toHaveAttribute("data-step", "3");
  // Wait beyond the autoplay delay and one assembly interval to catch unwanted motion.
  await page.waitForTimeout(1100);
  await expect(scene).toHaveAttribute("data-step", "3");
  await expect(
    preview.getByRole("button", { name: "Повторить сборку", exact: true }),
  ).toBeVisible();
  await expect(
    scene.locator('.preview-part[data-visible="false"]'),
  ).toHaveCount(0);
});

test("printing reveals successive passes, moves the head and separates static layers with reduced motion", async ({
  page,
}) => {
  for (const slug of ["banner-printing", "uv-printing"]) {
    const preview = await openPreview(page, `/catalog/${slug}`);
    const mask = preview.locator(".preview-print-mask");
    const head = preview.locator(".preview-printhead");
    const steps = preview.locator(".preview-steps button");
    await steps.nth(1).click();
    await expect(mask).toHaveAttribute("transform", "scale(0 1)");
    const initialHead = await head.getAttribute("transform");
    await steps.nth(2).click();
    await expect(mask).toHaveAttribute("transform", "scale(0.52 1)");
    const intermediateHead = await head.getAttribute("transform");
    expect(intermediateHead).not.toBe(initialHead);
    await steps.nth(3).click();
    await expect(mask).toHaveAttribute("transform", "scale(1 1)");
    expect(await head.getAttribute("transform")).not.toBe(intermediateHead);
    await preview
      .getByRole("button", { name: "По слоям", exact: true })
      .click();
    const translations = await preview
      .locator('.preview-part[data-visible="true"]')
      .evaluateAll((layers) =>
        layers.map((layer) => getComputedStyle(layer).translate),
      );
    expect(
      new Set(translations).size,
      `${slug}: separated material / print / finish`,
    ).toBeGreaterThanOrEqual(3);
    expect(translations).not.toContain("none");
  }
});

test.describe("normal motion playback", () => {
  test.use({ reducedMotion: "no-preference" });

  test("assembly pauses, resumes and waits while the scene is offscreen", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    const preview = await openPreview(page);
    const scene = preview.locator(".preview-scene");
    await preview.locator(".preview-steps button").first().click();
    await preview
      .getByRole("button", { name: "Продолжить сборку", exact: true })
      .click();
    await preview
      .getByRole("button", { name: "Приостановить сборку", exact: true })
      .click();
    const pausedStep = await scene.getAttribute("data-step");
    await page.waitForTimeout(1000);
    await expect(scene).toHaveAttribute("data-step", pausedStep!);
    await preview
      .getByRole("button", { name: "Продолжить сборку", exact: true })
      .click();
    await page.locator(".site-footer").scrollIntoViewIfNeeded();
    const offscreenStep = await scene.getAttribute("data-step");
    await page.waitForTimeout(1000);
    await expect(scene).toHaveAttribute("data-step", offscreenStep!);
    await preview.scrollIntoViewIfNeeded();
    await expect(scene).toHaveAttribute("data-step", "3", { timeout: 5000 });
    await expect(
      preview.getByRole("button", { name: "Повторить сборку", exact: true }),
    ).toBeVisible();
  });
});

test("preview controls remain contained at phone, tablet and desktop widths", async ({
  page,
}, testInfo) => {
  test.setTimeout(60_000);
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const slug of [
      "channel-letters",
      "city-formats",
      "information-boards",
      "stencils-and-marking",
    ]) {
      const preview = await openPreview(page, `/catalog/${slug}`);
      const failures = await preview.evaluate((element) => {
        const outside: string[] = [];
        for (const child of element.querySelectorAll(
          "button, input, select, label, output, p, h2, .preview-workspace, .preview-controls, .preview-scene, .preview-steps",
        )) {
          const box = child.getBoundingClientRect();
          if (box.width === 0 || box.height === 0) continue;
          if (box.left < -1 || box.right > innerWidth + 1)
            outside.push(`${child.tagName}: ${box.left}..${box.right}`);
        }
        if (document.documentElement.scrollWidth > innerWidth + 1)
          outside.push("horizontal document overflow");
        return outside;
      });
      expect(failures, `${width}px ${slug}`).toEqual([]);
    }
    if (width === 390) {
      const preview = await openPreview(page, "/catalog/lightboxes");
      await preview.screenshot({
        path: testInfo.outputPath("preview-mobile-390.png"),
      });
    }
  }
});
