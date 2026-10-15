/* global document, getComputedStyle, innerWidth */
import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const phase = process.argv[2] || "before";
const origin = process.env.RPK_AUDIT_ORIGIN || "http://127.0.0.1:3100";
const output = `test-results/responsive/${phase}`;
await mkdir(output, { recursive: true });
const slugs = async (file) =>
  [...(await readFile(file, "utf8")).matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map(
    (match) => match[1],
  );
const routes = [
  "/",
  "/catalog",
  "/solutions",
  ...[
    ...(await slugs("src/shared/catalog-index.ts")),
    ...(await slugs("src/shared/catalog-extra-index.ts")),
  ].map((slug) => `/catalog/${slug}`),
  ...(await slugs("src/shared/solution-index.ts")).map(
    (slug) => `/solutions/${slug}`,
  ),
  "/missing-page",
];
const widths = [
  320, 360, 390, 520, 600, 768, 820, 1024, 1100, 1280, 1440, 1920,
];
const browser = await chromium.launch({ headless: true });
const report = [];
const failures = [];
try {
  const contexts = await Promise.all(
    [0, 1, 2].map(() => browser.newContext({ reducedMotion: "reduce" })),
  );
  let cursor = 0;
  await Promise.all(
    contexts.map(async (context) => {
      const page = await context.newPage();
      while (cursor < routes.length) {
        const route = routes[cursor++];
        try {
          await page.goto(origin + route, { waitUntil: "load" });
          await page.evaluate(() => document.fonts.ready);
          for (const width of widths) {
            await page.setViewportSize({
              width,
              height: width < 600 ? 844 : 900,
            });
            const result = await page.evaluate(() => {
              const visible = (el) =>
                el.getClientRects().length &&
                getComputedStyle(el).visibility !== "hidden";
              const describe = (el) =>
                `${el.tagName.toLowerCase()}.${String(el.className).trim().replace(/\s+/g, ".")}`;
              const nodes = [
                ...document.querySelectorAll(
                  "main :is(h1,h2,h3,h4,p,li,dt,dd,a,button,input,textarea,article,nav), .site-header > *, .site-footer > *",
                ),
              ]
                .filter(visible)
                .filter((el) => !el.closest(".client-marquee, .sr-only"));
              const overflow = nodes.flatMap((el) => {
                const r = el.getBoundingClientRect();
                if (
                  r.left < -1 ||
                  r.right > innerWidth + 1 ||
                  (el.clientWidth && el.scrollWidth > el.clientWidth + 2)
                )
                  return [
                    {
                      selector: describe(el),
                      text: el.textContent?.trim().slice(0, 90),
                      x: Math.round(r.x),
                      width: Math.round(r.width),
                      scroll: el.scrollWidth,
                      client: el.clientWidth,
                    },
                  ];
                return [];
              });
              const insets = [
                ...document.querySelectorAll(
                  ".advantage-card, .fact-card, .process-item, .intro-band, .hero-proof > div, .catalog-highlights > div, .contact-form",
                ),
              ]
                .filter(visible)
                .map((el) => {
                  const s = getComputedStyle(el);
                  return {
                    selector: describe(el),
                    left: s.paddingLeft,
                    right: s.paddingRight,
                    top: s.paddingTop,
                    bottom: s.paddingBottom,
                  };
                });
              return {
                overflow,
                insets,
                documentOverflow:
                  document.documentElement.scrollWidth > innerWidth,
              };
            });
            report.push({ route, width, ...result });
            if (
              [1440, 390].includes(width) &&
              [
                "/",
                "/catalog",
                "/catalog/channel-letters",
                "/solutions",
                "/solutions/retail",
                "/missing-page",
              ].includes(route)
            ) {
              await page.evaluate(async () => {
                for (const img of document.images) img.loading = "eager";
                await Promise.all(
                  [...document.images].map((img) =>
                    img.decode().catch(() => undefined),
                  ),
                );
              });
              await page.screenshot({
                path: `${output}/${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}-${width}.png`,
                fullPage: true,
                animations: "disabled",
              });
            }
          }
          process.stdout.write(`Checked ${route}\n`);
        } catch (error) {
          failures.push({ route, error: error.message });
        }
      }
      await context.close();
    }),
  );
} finally {
  await browser.close();
}
await writeFile(
  `${output}/report.json`,
  JSON.stringify({ origin, routes, widths, report, failures }, null, 2),
);
const problems = report.filter(
  (row) => row.overflow.length || row.documentOverflow,
);
const unique = new Map();
for (const row of problems)
  for (const issue of row.overflow) {
    const key = `${issue.selector}|${row.width}`;
    const previous = unique.get(key);
    if (previous) previous.routes.push(row.route);
    else unique.set(key, { ...issue, width: row.width, routes: [row.route] });
  }
await writeFile(
  `${output}/issues.json`,
  JSON.stringify(
    { failures, problems: problems.length, unique: [...unique.values()] },
    null,
    2,
  ),
);
console.log(
  JSON.stringify({
    routes: routes.length,
    widths: widths.length,
    checks: report.length,
    problematicChecks: problems.length,
    uniqueIssues: unique.size,
    failures,
  }),
);
