import { expect, test, type Locator, type Page } from "@playwright/test";

const viewportSelector = ".client-marquee-viewport";
const trackSelector = ".client-logo-track";

async function openPartners(page: Page, reducedMotion = false) {
  await page.emulateMedia({
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
  });
  await page.goto("/");
  const viewport = page.locator(viewportSelector);
  await viewport.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await expect(viewport).toBeInViewport();
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(
        document.querySelectorAll<HTMLImageElement>(".client-logo-track img"),
      )
        .filter((image) => image.complete)
        .map((image) => image.decode().catch(() => undefined)),
    );
  });
  return viewport;
}

async function bounds(viewport: Locator) {
  const box = await viewport.boundingBox();
  expect(box).not.toBeNull();
  return box!;
}

async function settleAnimation(page: Page) {
  await page.locator(trackSelector).evaluate(async (track) => {
    await Promise.all(
      track.getAnimations().map((animation) => animation.ready),
    );
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}

async function trackPosition(page: Page) {
  return page.locator(trackSelector).evaluate((track) => {
    const viewport = track.parentElement!;
    return track.getBoundingClientRect().x - viewport.getBoundingClientRect().x;
  });
}

async function dragMouse(page: Page, viewport: Locator, distance: number) {
  const box = await bounds(viewport);
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await settleAnimation(page);
  await page.mouse.down();
  await page.mouse.move(x + distance, y, { steps: 8 });
  await page.mouse.up();
  await settleAnimation(page);
}

test("mouse dragging works in both directions across the loop and autoplay resumes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const viewport = await openPartners(page);
  const box = await bounds(viewport);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await settleAnimation(page);

  const before = await trackPosition(page);
  await dragMouse(page, viewport, -130);
  const left = await trackPosition(page);
  expect(left).toBeLessThan(before - 100);
  await dragMouse(page, viewport, 70);
  expect(await trackPosition(page)).toBeGreaterThan(left + 50);

  // Start at the repeat boundary, then pull the preceding logos into view.
  await page.locator(trackSelector).evaluate(async (track) => {
    for (const animation of track.getAnimations()) {
      await animation.ready;
      animation.currentTime = 0;
    }
  });
  await settleAnimation(page);
  const firstLogo = await page
    .locator('.client-logo-group:not([aria-hidden="true"]) img')
    .first()
    .getAttribute("alt");
  expect(firstLogo).toBeTruthy();
  const originalLogoPosition = await page
    .getByAltText(firstLogo!, { exact: true })
    .first()
    .evaluate((image) => image.getBoundingClientRect().x);
  await dragMouse(page, viewport, 120);
  const visibleLogoPosition = await page
    .getByAltText(firstLogo!, { exact: true })
    .evaluateAll((images) => {
      const viewport = document
        .querySelector(".client-marquee-viewport")!
        .getBoundingClientRect();
      return images
        .map((image) => image.getBoundingClientRect())
        .find(
          (image) => image.right > viewport.left && image.left < viewport.right,
        )?.x;
    });
  expect(visibleLogoPosition).toBeDefined();
  expect(visibleLogoPosition! - originalLogoPosition).toBeGreaterThan(100);
  expect(visibleLogoPosition! - originalLogoPosition).toBeLessThan(140);

  const afterDrag = await trackPosition(page);
  await page.mouse.move(2, 2);
  await expect.poll(() => trackPosition(page)).toBeLessThan(afterDrag - 2);
});

test("dragging preserves an explicit pause after the pointer leaves", async ({
  page,
}) => {
  const viewport = await openPartners(page);
  await page
    .getByRole("button", { name: "Приостановить движение логотипов" })
    .click();
  await settleAnimation(page);
  const before = await trackPosition(page);
  await dragMouse(page, viewport, -100);
  expect(await trackPosition(page)).toBeLessThan(before - 80);
  await page.mouse.move(2, 2);
  await settleAnimation(page);
  const after = await trackPosition(page);
  await page.waitForTimeout(250);
  expect(Math.abs((await trackPosition(page)) - after)).toBeLessThan(1);
  await expect(
    page.getByRole("button", { name: "Продолжить движение логотипов" }),
  ).toBeVisible();
});

test("horizontal wheel input moves logos while vertical wheel input scrolls the page", async ({
  page,
}) => {
  const viewport = await openPartners(page);
  const box = await bounds(viewport);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await settleAnimation(page);
  const before = await trackPosition(page);
  await page.mouse.wheel(140, 0);
  await expect.poll(() => trackPosition(page)).toBeLessThan(before - 100);

  const scrollY = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 160);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(scrollY + 80);
});

test("reduced motion keeps native scrolling available and supports mouse dragging", async ({
  page,
}) => {
  const viewport = await openPartners(page, true);
  await expect(
    page.getByRole("button", { name: "Приостановить движение логотипов" }),
  ).toBeHidden();
  const before = await viewport.evaluate((element) => element.scrollLeft);
  await dragMouse(page, viewport, -180);
  const left = await viewport.evaluate((element) => element.scrollLeft);
  expect(left).toBeGreaterThan(before + 140);
  await dragMouse(page, viewport, 90);
  expect(await viewport.evaluate((element) => element.scrollLeft)).toBeLessThan(
    left - 60,
  );
});

test.describe("touch gestures", () => {
  test.use({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });

  test("a horizontal swipe moves logos and a vertical swipe scrolls the page", async ({
    page,
    context,
  }) => {
    const viewport = await openPartners(page);
    const session = await context.newCDPSession(page);
    const box = await bounds(viewport);
    const x = box.x + box.width * 0.75;
    const y = box.y + box.height / 2;

    async function swipe(deltaX: number, deltaY: number) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x, y, id: 1 }],
      });
      for (let step = 1; step <= 8; step++) {
        await session.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [
            { x: x + (deltaX * step) / 8, y: y + (deltaY * step) / 8, id: 1 },
          ],
        });
        await page.waitForTimeout(16);
      }
      await session.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
    }

    const before = await trackPosition(page);
    const initialScrollY = await page.evaluate(() => window.scrollY);
    await swipe(-150, 1);
    expect(await trackPosition(page)).toBeLessThan(before - 110);
    expect(
      Math.abs((await page.evaluate(() => window.scrollY)) - initialScrollY),
    ).toBeLessThan(5);

    await swipe(1, -160);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(initialScrollY + 60);
    await session.detach();
  });
});
