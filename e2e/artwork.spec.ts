import { expect, test, type Locator, type Page } from "@playwright/test";
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";

const vector = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 120"><defs><style>.brand{fill:#ff8a00;stroke:#fff;stroke-width:3}</style></defs><path class="brand" d="M20 100V20H110V100ZM160 100V20H270V100Z"/></svg>`;
async function captureObjectUrls(page: Page) {
  await page.addInitScript(() => {
    const state = window as typeof window & { __testBlobs: Map<string, Blob> };
    state.__testBlobs = new Map();
    const create = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (blob) => {
      const url = create(blob);
      if (blob instanceof Blob) state.__testBlobs.set(url, blob);
      return url;
    };
  });
}
async function moveRange(preview: Locator, label: string, key: string) {
  const control = preview.getByRole("slider", {
    name: new RegExp(`^${label}`),
  });
  await control.focus();
  await control.press(key);
}

test("SVG artwork loads, keeps exported styles and supports fit, crop, placement and rotation", async ({
  page,
}, testInfo) => {
  await captureObjectUrls(page);
  await page.goto("/catalog/projecting-signs#interactive-preview");
  const preview = page.locator(".product-preview");
  await preview
    .getByLabel("Загрузить свой макет", { exact: true })
    .setInputFiles({
      name: "brand.svg",
      mimeType: "image/svg+xml",
      buffer: Buffer.from(vector),
    });
  await expect(
    preview.getByRole("button", { name: "Заменить изображение", exact: true }),
  ).toBeEnabled();
  await expect(preview.locator(".preview-artwork-summary")).toContainText(
    "SVG · 300 × 120 px",
  );
  const scene = preview.locator(".preview-scene");
  const image = scene.locator("[data-artwork-viewport] image").first();
  await expect(image).toHaveAttribute("preserveAspectRatio", "xMidYMid meet");
  const blobUrl = await image.getAttribute("href");
  const cleaned = await page.evaluate(
    async (url) =>
      (window as typeof window & { __testBlobs: Map<string, Blob> }).__testBlobs
        .get(url!)!
        .text(),
    blobUrl,
  );
  expect(cleaned).toMatch(/fill:\s*(?:#ff8a00|rgb\(255,\s*138,\s*0\))/i);
  await preview
    .getByRole("button", { name: "Заполнить поверхность", exact: true })
    .click();
  await expect(image).toHaveAttribute("preserveAspectRatio", "xMidYMid slice");
  const transform = scene.locator("[data-artwork-transform]").first();
  const initial = await transform.getAttribute("transform");
  await moveRange(preview, "Масштаб макета", "End");
  await expect(transform).toHaveAttribute("transform", /scale\(1.8\)/);
  await moveRange(preview, "Макет по горизонтали", "ArrowRight");
  await moveRange(preview, "Макет по вертикали", "ArrowLeft");
  expect(await transform.getAttribute("transform")).not.toBe(initial);
  await preview
    .getByRole("button", { name: "Повернуть 90°", exact: true })
    .click();
  await expect(transform).toHaveAttribute("transform", /rotate\(90\)/);
  await expect(
    scene.locator("[data-artwork-viewport] clipPath ellipse").first(),
  ).toBeAttached();
  await scene.screenshot({
    path: testInfo.outputPath("projecting-custom-artwork.png"),
  });
  await preview
    .getByRole("button", { name: "Сбросить размещение", exact: true })
    .click();
  await expect(transform).toHaveAttribute(
    "transform",
    /rotate\(0\) scale\(1\)/,
  );
  await expect(image).toHaveAttribute("preserveAspectRatio", "xMidYMid meet");
  await expect(image).toHaveAttribute("href", blobUrl!);
  await page.setViewportSize({ width: 1440, height: 1700 });
  await preview.screenshot({
    path: testInfo.outputPath("desktop-artwork-workspace.png"),
  });
});

test("SVG active content and external references are removed; bad design files leave existing artwork intact", async ({
  page,
}) => {
  await captureObjectUrls(page);
  await page.goto("/catalog/lightboxes#interactive-preview");
  const preview = page.locator(".product-preview");
  const upload = preview.getByLabel("Загрузить свой макет", { exact: true });
  const hostile = vector.replace(
    "<path ",
    '<script>window.__unsafeArtwork=true</script><foreignObject><div xmlns="http://www.w3.org/1999/xhtml">foreign</div></foreignObject><image href="https://invalid.example/private.png"/><path onclick="alert(1)" ',
  );
  await upload.setInputFiles({
    name: "logo.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from(hostile),
  });
  await expect(
    preview.getByRole("button", { name: "Заменить изображение", exact: true }),
  ).toBeEnabled();
  const image = preview.locator('.preview-scene image[href^="blob:"]').first();
  const url = await image.getAttribute("href");
  const clean = await page.evaluate(
    async (value) =>
      (window as typeof window & { __testBlobs: Map<string, Blob> }).__testBlobs
        .get(value!)!
        .text(),
    url,
  );
  expect(clean).not.toMatch(/<script|foreignObject|onclick|https:\/\/invalid/);
  await upload.setInputFiles({
    name: "source.cdr",
    mimeType: "application/octet-stream",
    buffer: Buffer.from("design-source"),
  });
  await expect(preview.getByRole("alert")).toContainText(
    "экспортируйте PDF, AI, CDR или EPS",
  );
  await expect(image).toHaveAttribute("href", url!);
  await upload.setInputFiles({
    name: "bad.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from('<svg><path d="oops"></svg>'),
  });
  await expect(preview.getByRole("alert")).toContainText(
    "Не удалось прочитать SVG",
  );
  await expect(image).toHaveAttribute("href", url!);
});

test("exported SVG colors preserve inline, selector and important priorities", async ({
  page,
}) => {
  await page.goto("/catalog/lightboxes#interactive-preview");
  const preview = page.locator(".product-preview");
  const palette = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><style>.brand{fill:#00ff00}rect{fill:#ff0000}.special{fill:#0000ff!important}</style><rect class="brand" style="fill:#0000ff" width="100" height="100"/><rect class="brand" x="100" width="100" height="100"/><rect class="special" style="fill:#00ff00" x="200" width="100" height="100"/></svg>`;
  await preview
    .getByLabel("Загрузить свой макет", { exact: true })
    .setInputFiles({
      name: "exported.svg",
      mimeType: "image/svg+xml",
      buffer: Buffer.from(palette),
    });
  await expect(
    preview.getByRole("button", { name: "Заменить изображение", exact: true }),
  ).toBeEnabled();
  const url = await preview
    .locator("[data-artwork-viewport] image")
    .first()
    .getAttribute("href");
  const pixels = await page.evaluate(async (href) => {
    const picture = new Image();
    picture.src = href!;
    await picture.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 100;
    const context = canvas.getContext("2d")!;
    context.drawImage(picture, 0, 0);
    return [50, 150, 250].map((x) =>
      Array.from(context.getImageData(x, 50, 1, 1).data),
    );
  }, url);
  expect(pixels).toEqual([
    [0, 0, 255, 255],
    [0, 255, 0, 255],
    [0, 0, 255, 255],
  ]);
});

test("uploaded compositions replace disabled text while print text stays editable", async ({
  page,
}) => {
  for (const slug of [
    "design-and-engineering",
    "vinyl-graphics",
    "banner-printing",
    "uv-printing",
  ]) {
    await page.goto(`/catalog/${slug}#interactive-preview`);
    const preview = page.locator(".product-preview");
    const text = preview.getByRole("textbox");
    await text.fill("ТЕСТ МАКЕТА");
    await preview
      .getByLabel("Загрузить свой макет", { exact: true })
      .setInputFiles({
        name: "composition.svg",
        mimeType: "image/svg+xml",
        buffer: Buffer.from(vector),
      });
    await expect(
      preview.getByRole("button", {
        name: "Заменить изображение",
        exact: true,
      }),
    ).toBeEnabled();
    const overlaidText = preview
      .locator(".preview-scene text")
      .filter({ hasText: "ТЕСТ МАКЕТА" });
    if (["banner-printing", "uv-printing"].includes(slug)) {
      await expect(text).toBeEnabled();
      await expect(overlaidText).toBeVisible();
    } else {
      await expect(text).toBeDisabled();
      await expect(overlaidText).toHaveCount(0);
    }
  }
});

test("a PNG upload and dropped SVG work without MIME labels and fit on a phone", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto("/catalog/lightboxes#interactive-preview");
  const preview = page.locator(".product-preview");
  await preview
    .getByLabel("Загрузить свой макет", { exact: true })
    .setInputFiles({
      name: "logo.png",
      mimeType: "",
      buffer: await readFile(resolve("public/assets/rpk-mark-transparent.png")),
    });
  await expect(
    preview.getByRole("button", { name: "Заменить изображение", exact: true }),
  ).toBeEnabled();
  await preview
    .getByRole("button", { name: "Удалить изображение", exact: true })
    .click();
  await preview.locator(".preview-upload").evaluate((node, svg) => {
    const transfer = new DataTransfer();
    transfer.items.add(new File([svg], "dropped.svg", { type: "" }));
    node.dispatchEvent(
      new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer: transfer,
      }),
    );
  }, vector);
  await expect(
    preview.getByRole("button", { name: "Заменить изображение", exact: true }),
  ).toBeEnabled();
  const overflow = await preview.evaluate((node) =>
    Array.from(node.querySelectorAll("button,input,fieldset,p,summary"))
      .filter((element) => {
        const r = element.getBoundingClientRect();
        return r.width > 0 && (r.left < 0 || r.right > innerWidth + 1);
      })
      .map((node) => node.tagName),
  );
  expect(overflow).toEqual([]);
  await preview.getByText("Как подготовить макет?", { exact: true }).click();
  await preview.locator("h2").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: testInfo.outputPath("mobile-artwork-controls.png"),
  });
});
