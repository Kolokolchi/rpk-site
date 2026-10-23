import { expect, test } from "@playwright/test";
import { resolve } from "node:path";

const proof = resolve("artifacts/product-preview/vehicle-surfaces-20261023");
const image = (name: string, color: string) => ({
  name,
  mimeType: "image/svg+xml",
  buffer: Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200"><rect width="600" height="200" fill="${color}"/><path d="M0 200 300 0H600L300 200Z" fill="#ff8a00"/><text x="300" y="125" text-anchor="middle" font-family="Arial" font-size="60" fill="white">${name.replace(".svg", "")}</text></svg>`,
  ),
});

test("vehicle side and hood retain independent artwork, placement and uploads", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto("/catalog/vehicle-branding#interactive-preview");
  const preview = page.locator(".product-preview");
  await preview.scrollIntoViewIfNeeded();
  const scene = preview.locator(".preview-scene");
  const side = scene.locator('[data-vehicle-surface="side"]');
  const hood = scene.locator('[data-vehicle-surface="hood"]');
  const field = preview.getByRole("textbox");
  const upload = preview.getByLabel("Загрузить свой макет", { exact: true });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await expect(
    preview.getByRole("button", { name: "Весь борт", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await field.fill("ҚАЗАҚСТАН");
  await expect(side).toContainText("ҚАЗАҚСТАН");
  await expect(side).toHaveAttribute("data-include-windows", "false");
  await preview
    .getByRole("checkbox", { name: "С окнами", exact: true })
    .check();
  await expect(side).toHaveAttribute("data-include-windows", "true");
  await preview.getByRole("button", { name: "Капот", exact: true }).click();
  await field.fill("АЛМАТЫ");
  await preview.getByRole("button", { name: "Синий", exact: true }).click();
  await expect(hood).toContainText("АЛМАТЫ");
  await expect(side).toContainText("ҚАЗАҚСТАН");
  await preview
    .getByRole("checkbox", { name: "Показывать на капоте" })
    .uncheck();
  await expect(hood.locator("text")).toHaveCount(0);
  await expect(side).toContainText("ҚАЗАҚСТАН");
  await preview.getByRole("checkbox", { name: "Показывать на капоте" }).check();
  await expect(hood).toContainText("АЛМАТЫ");
  await scene.screenshot({ path: resolve(proof, "both-text.png") });

  await upload.setInputFiles(image("HOOD.svg", "#173e56"));
  await expect(preview.locator(".preview-artwork-summary strong")).toHaveText(
    "HOOD.svg",
  );
  await expect(hood.locator("image").first()).toHaveAttribute("href", /^blob:/);
  const hoodUrl = await hood.locator("image").first().getAttribute("href");
  await preview
    .getByRole("slider", { name: /^Макет по горизонтали/ })
    .press("End");
  await preview.getByRole("button", { name: "Весь борт", exact: true }).click();
  await expect(field).toHaveValue("ҚАЗАҚСТАН");
  await expect(
    preview.getByRole("checkbox", { name: "С окнами", exact: true }),
  ).toBeChecked();
  await upload.setInputFiles(image("SIDE.svg", "#267c62"));
  await preview
    .getByRole("button", { name: "На всю поверхность", exact: true })
    .click();
  await expect(side.locator("image").first()).toHaveAttribute(
    "preserveAspectRatio",
    "xMidYMid slice",
  );
  await expect(hood.locator("image").first()).toHaveAttribute("href", hoodUrl!);
  const sideUrl = await side.locator("image").first().getAttribute("href");
  await scene.screenshot({ path: resolve(proof, "both-artwork.png") });

  await preview.getByRole("button", { name: "Капот", exact: true }).click();
  await expect(preview.locator(".preview-artwork-summary strong")).toHaveText(
    "HOOD.svg",
  );
  await expect(
    preview.getByRole("slider", { name: /^Макет по горизонтали/ }),
  ).toHaveValue("50");
  await preview
    .getByRole("button", { name: "На всю поверхность", exact: true })
    .click();
  await expect(
    preview.getByRole("slider", { name: /^Макет по горизонтали/ }),
  ).toHaveValue("0");
  await expect(hood.locator("image").first()).toHaveAttribute(
    "preserveAspectRatio",
    "xMidYMid slice",
  );
  await upload.setInputFiles(image("NEW-HOOD.svg", "#ca4969"));
  await expect(preview.locator(".preview-artwork-summary strong")).toHaveText(
    "NEW-HOOD.svg",
  );
  // Replacing the hood must leave the side's object URL usable, not just in the DOM.
  expect(
    await page.evaluate(async (url) => {
      const img = new Image();
      img.src = url!;
      await img.decode();
      return img.naturalWidth;
    }, sideUrl),
  ).toBeGreaterThan(0);
  await preview
    .getByRole("button", { name: "Удалить изображение", exact: true })
    .click();
  await expect(hood.locator("image")).toHaveCount(0);
  await expect(field).toHaveValue("АЛМАТЫ");
  await expect(side.locator("image").first()).toHaveAttribute("href", sideUrl!);
  await preview.getByRole("button", { name: "Весь борт", exact: true }).click();
  await expect(preview.locator(".preview-artwork-summary strong")).toHaveText(
    "SIDE.svg",
  );
  await preview
    .getByRole("button", { name: "Удалить изображение", exact: true })
    .click();
  await expect(field).toHaveValue("ҚАЗАҚСТАН");
  await preview.getByRole("button", { name: "Сбросить", exact: true }).click();
  await expect(
    preview.getByRole("checkbox", { name: "С окнами", exact: true }),
  ).not.toBeChecked();
  await expect(field).toHaveValue("ВАШ БРЕНД");
  await expect(hood).toContainText("ВАШ БРЕНД");
  await expect(side).toContainText("ВАШ БРЕНД");
  expect(errors).toEqual([]);
  await preview.screenshot({ path: resolve(proof, "desktop.png") });
});

test("vehicle surfaces can be configured on a narrow phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/catalog/vehicle-branding#interactive-preview");
  const preview = page.locator(".product-preview");
  await preview.scrollIntoViewIfNeeded();
  await preview.getByRole("button", { name: "Капот", exact: true }).click();
  await preview.getByRole("textbox").fill("АЛМАТЫ");
  await expect(preview.locator('[data-vehicle-surface="hood"]')).toContainText(
    "АЛМАТЫ",
  );
  await expect(
    preview.getByRole("button", { name: "На всю поверхность", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await preview.screenshot({ path: resolve(proof, "mobile.png") });
});
