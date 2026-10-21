import { expect, test, type Page } from "@playwright/test";
import { catalogHref, catalogIndex } from "../src/shared/catalog-index";
import { solutionHref, solutionIndex } from "../src/shared/solution-index";

const widths = [320, 390, 768, 1024, 1440];
const routes = [
  "/",
  "/catalog",
  "/solutions",
  ...catalogIndex.map((entry) => catalogHref(entry.slug)),
  ...solutionIndex.map((entry) => solutionHref(entry.slug)),
];

async function settleLayout(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}

async function expectContainedLayout(page: Page) {
  const failures = await page.evaluate(() => {
    const failures: string[] = [];
    const tolerance = 2;
    const label = (element: Element) =>
      `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${
        element.classList.length
          ? `.${Array.from(element.classList).slice(0, 2).join(".")}`
          : ""
      } (${element.textContent?.trim().slice(0, 65)})`;
    const isContent = (element: Element) => {
      const box = element.getBoundingClientRect();
      return (
        box.width > 1 &&
        box.height > 1 &&
        getComputedStyle(element).visibility !== "hidden" &&
        !element.closest(
          '[hidden], [aria-hidden="true"], .hero-art, .client-logo-track, .section-atmosphere, .sr-only, .visually-hidden',
        )
      );
    };

    // Body overflow:hidden must not hide a component that is wider than its
    // column or the viewport. Check physical boxes, including below the fold.
    const elements = document.querySelectorAll(
      "main :is(article, section, nav, aside, h1, h2, h3, h4, p, dl, dt, dd, figure, figcaption, a, button, input, textarea, select, li), .site-header, .site-header :is(a, button, nav, small), .site-footer, .site-footer :is(p, a), .catalog-card-body, .object-card-copy, .project-card-content, .intro-copy, .intro-aside, .hero-proof > div, .catalog-highlights > div, .client-marquee-viewport",
    );
    for (const element of elements) {
      if (!isContent(element)) continue;
      const box = element.getBoundingClientRect();
      if (box.left < -tolerance || box.right > innerWidth + tolerance) {
        failures.push(
          `${label(element)} outside viewport: ${box.left.toFixed(1)}..${box.right.toFixed(1)} of ${innerWidth}`,
        );
      }
      const parent = element.parentElement;
      if (parent && getComputedStyle(parent).display !== "contents") {
        const parentBox = parent.getBoundingClientRect();
        if (
          parentBox.width > 1 &&
          (box.left < parentBox.left - tolerance ||
            box.right > parentBox.right + tolerance)
        ) {
          failures.push(`${label(element)} outside ${label(parent)}`);
        }
      }
    }

    // A heading can have a correct box while a long word paints outside it.
    // Ranges measure the rendered text rather than the block's scrollWidth.
    for (const heading of document.querySelectorAll(
      "h1, h2, h3, h4, .site-header small, .header-cta > span",
    )) {
      if (!isContent(heading)) continue;
      const box = heading.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(heading);
      for (const textBox of range.getClientRects()) {
        if (
          textBox.width > 0 &&
          (textBox.left < box.left - tolerance ||
            textBox.right > box.right + tolerance)
        ) {
          failures.push(`${label(heading)} text overflows its element box`);
          break;
        }
      }
    }
    if (document.documentElement.scrollWidth > innerWidth + tolerance) {
      failures.push("document has horizontal scrolling");
    }
    return failures;
  });
  expect(failures, `Layout errors on ${page.url()}`).toEqual([]);
}

async function expectHeaderControls(page: Page) {
  const failures = await page.locator(".site-header").evaluate((header) => {
    const failures: string[] = [];
    const headerBox = header.getBoundingClientRect();
    const controls = Array.from(header.children)
      .filter((element) => {
        const box = element.getBoundingClientRect();
        return box.width > 0 && box.height > 0;
      })
      .map((element) => ({ element, box: element.getBoundingClientRect() }));
    for (const { element, box } of controls) {
      if (
        box.left < headerBox.left ||
        box.right > headerBox.right ||
        box.top < headerBox.top ||
        box.bottom > headerBox.bottom
      ) {
        failures.push(`${element.className} escapes header`);
      }
      if (element.matches(".header-cta, .menu-toggle")) {
        if (box.width < 44 || box.height < 44)
          failures.push(`${element.className} has a target smaller than 44px`);
        const hit = document.elementFromPoint(
          box.left + box.width / 2,
          box.top + box.height / 2,
        );
        if (!hit || !element.contains(hit))
          failures.push(`${element.className} is covered by another element`);
      }
    }
    for (let index = 1; index < controls.length; index++) {
      if (controls[index].box.left < controls[index - 1].box.right + 4)
        failures.push(
          "header controls overlap or have less than 4px between them",
        );
    }
    // The subtitle can paint over navigation even when the brand's own box fits.
    for (const element of header.querySelectorAll(
      ".brand small, .main-nav a, .header-cta span",
    )) {
      const box = element.getBoundingClientRect();
      if (!box.width || !box.height) continue;
      const range = document.createRange();
      range.selectNodeContents(element);
      for (const textBox of range.getClientRects()) {
        if (textBox.left < box.left - 2 || textBox.right > box.right + 2) {
          failures.push(
            `${element.textContent?.trim()} escapes its header label`,
          );
          break;
        }
      }
    }
    return failures;
  });
  expect(failures, `Header at ${page.viewportSize()?.width}px`).toEqual([]);
}

async function expectContentInsets(
  page: Page,
  selector: string,
  edges: ("left" | "right" | "top" | "bottom")[] = [
    "left",
    "right",
    "top",
    "bottom",
  ],
) {
  const insets = await page.locator(selector).evaluateAll((elements, edges) => {
    return elements.flatMap((element, index) => {
      const box = element.getBoundingClientRect();
      if (box.width < 1 || box.height < 1) return [];
      const children = Array.from(element.children)
        .filter((child) => !child.matches('[aria-hidden="true"]:not(svg)'))
        .map((child) => child.getBoundingClientRect())
        .filter((child) => child.width > 0 && child.height > 0);
      if (!children.length) return [];
      const gaps = {
        left: Math.min(...children.map((child) => child.left)) - box.left,
        right: box.right - Math.max(...children.map((child) => child.right)),
        top: Math.min(...children.map((child) => child.top)) - box.top,
        bottom: box.bottom - Math.max(...children.map((child) => child.bottom)),
      };
      return edges.map((edge) => ({ index, edge, gap: gaps[edge] }));
    });
  }, edges);
  expect(
    insets.length,
    `Missing visible content in ${selector}`,
  ).toBeGreaterThan(0);
  for (const { index, edge, gap } of insets) {
    expect(
      gap,
      `${selector}[${index}] content touches its ${edge} edge at ${page.viewportSize()?.width}px`,
    ).toBeGreaterThanOrEqual(15.5);
  }
}

test.describe("responsive layout regression", () => {
  test.setTimeout(25_000);

  for (const width of widths) {
    test.describe(`${width}px`, () => {
      test.use({ viewport: { width, height: 900 } });

      for (const route of routes) {
        test(`${route} keeps content inside its viewport and columns`, async ({
          page,
        }) => {
          const response = await page.goto(route);
          expect(response?.status()).toBe(200);
          await expect(page.locator("h1")).toHaveCount(1);
          await settleLayout(page);
          await expectContainedLayout(page);
          await expectHeaderControls(page);
          if (route === "/") {
            await expectContentInsets(page, ".advantage-card");
            await expectContentInsets(page, ".intro-band");
            await expectContentInsets(page, ".hero-proof > div");
            await expectContentInsets(page, ".project-card-content");
            // Process rows have only a horizontal rule, so side padding is
            // intentionally unnecessary. Their text must clear that rule.
            await expectContentInsets(page, ".process-item", ["top", "bottom"]);
          } else if (route.startsWith("/catalog/")) {
            await expectContentInsets(page, ".catalog-highlights > div", [
              "left",
              "right",
            ]);
          }
          if (
            route.startsWith("/catalog/") ||
            route.startsWith("/solutions/")
          ) {
            await expectContentInsets(page, ".catalog-process > li", [
              "top",
              "bottom",
            ]);
          }
        });
      }

      test("a single filtered project preserves card padding", async ({
        page,
      }) => {
        await page.goto("/");
        await page.getByRole("button", { name: /^Магазины/ }).click();
        await expect(page.locator(".project-card:visible")).toHaveCount(1);
        await settleLayout(page);
        await expectContentInsets(
          page,
          ".project-card:visible .project-card-content",
        );
        await expectContainedLayout(page);
      });
    });
  }

  for (const { route, width } of [
    { route: "/", width: 390 },
    { route: "/", width: 768 },
    { route: "/", width: 1440 },
    { route: "/catalog/information-boards", width: 390 },
    { route: "/solutions/retail", width: 390 },
  ]) {
    test(`${route} reflows with 200% text at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await settleLayout(page);
      await page.evaluate(() => {
        // Capture before writing so nested elements are enlarged exactly once.
        // Unitless line-height follows the enlarged font automatically.
        const sizes = Array.from(document.body.querySelectorAll("*"))
          .filter(
            (element): element is HTMLElement => element instanceof HTMLElement,
          )
          .map((element) => ({
            element,
            size: parseFloat(getComputedStyle(element).fontSize),
          }));
        for (const { element, size } of sizes)
          element.style.fontSize = `${size * 2}px`;
      });
      await settleLayout(page);
      await expectContainedLayout(page);
      await expectHeaderControls(page);
    });
  }

  for (const viewport of [
    { width: 667, height: 320 },
    { width: 844, height: 390 },
  ]) {
    test(`all menu links are reachable by scrolling at ${viewport.width}×${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const toggle = page.locator(".menu-toggle");
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      const navigation = page.getByRole("navigation", {
        name: "Основная навигация",
      });
      await expect(navigation).toBeVisible();
      const menuBox = await navigation.boundingBox();
      expect(menuBox).not.toBeNull();
      expect(menuBox!.y + menuBox!.height).toBeLessThanOrEqual(
        viewport.height + 1,
      );
      const links = navigation.getByRole("link");
      await expect(links).toHaveCount(5);
      await expect(links.first()).toBeFocused();

      // With this short viewport the menu must scroll, without compressing or
      // clipping its final link below the browser's bottom edge.
      expect(
        await navigation.evaluate(
          (element) => element.scrollHeight > element.clientHeight,
        ),
      ).toBe(true);
      for (const link of await links.all()) {
        await link.scrollIntoViewIfNeeded();
        const reachable = await link.evaluate((element) => {
          const box = element.getBoundingClientRect();
          const menu = element.closest("nav")!.getBoundingClientRect();
          const x = box.left + box.width / 2;
          const y = box.top + box.height / 2;
          const hit = document.elementFromPoint(x, y);
          return (
            box.top >= menu.top - 1 &&
            box.bottom <= Math.min(menu.bottom, innerHeight) + 1 &&
            box.height >= 44 &&
            Boolean(hit && element.contains(hit))
          );
        });
        expect(
          reachable,
          `${await link.innerText()} must be fully reachable`,
        ).toBe(true);
      }
      expect(
        await navigation.evaluate((element) => element.scrollTop),
      ).toBeGreaterThan(0);
      await page.keyboard.press("Escape");
      await expect(navigation).toBeHidden();
      await expect(toggle).toBeFocused();
    });
  }
});

test("headings keep fitting words whole and break oversized words readably", async ({
  page,
}) => {
  for (const sample of [
    {
      route: "/catalog",
      width: 320,
      selector: '.catalog-card[href$="/catalog/channel-letters"] h2',
      word: "Объёмные",
      expectedLines: 1,
    },
    {
      route: "/catalog",
      width: 320,
      selector: '.catalog-card[href$="/catalog/information-boards"] h2',
      word: "Информационные",
      expectedLines: 2,
    },
    {
      route: "/catalog",
      width: 390,
      selector: '.catalog-card[href$="/catalog/information-boards"] h2',
      word: "Информационные",
      expectedLines: 1,
    },
    {
      route: "/catalog/metal-fabrication",
      width: 390,
      selector: "h1",
      word: "Металлоконструкции",
      expectedLines: 2,
    },
    {
      route: "/catalog/metal-fabrication",
      width: 768,
      selector: "h1",
      word: "Металлоконструкции",
      expectedLines: 1,
    },
  ]) {
    await page.setViewportSize({ width: sample.width, height: 900 });
    await page.goto(sample.route);
    await settleLayout(page);
    const lineCount = await page
      .locator(sample.selector)
      .evaluate((heading, word) => {
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          const text = node.textContent ?? "";
          for (const match of text.matchAll(/[\p{L}\u00ad]+/gu)) {
            if (match[0].replaceAll("\u00ad", "") !== word) continue;
            const lineTops = new Set<number>();
            for (
              let offset = match.index;
              offset < match.index + match[0].length;
              offset++
            ) {
              // A discretionary hyphen can share the next glyph's rectangle.
              // Measure the actual letters to count the word's rendered lines.
              if (text[offset] === "\u00ad") continue;
              const range = document.createRange();
              range.setStart(node, offset);
              range.setEnd(node, offset + 1);
              lineTops.add(Math.round(range.getBoundingClientRect().top));
            }
            return lineTops.size;
          }
        }
        return null;
      }, sample.word);
    expect(
      lineCount,
      `${sample.word} at ${sample.width}px on ${sample.route}`,
    ).toBe(sample.expectedLines);
  }
});
