import assert from "node:assert/strict";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test } from "vitest";
import {
  solutionIndex,
  solutionHref,
  findSolutionEntry,
} from "../src/shared/solution-index";
import {
  businessSolutions,
  getBusinessSolution,
} from "../src/solutions/solution-content";
import { catalogIndex } from "../src/shared/catalog-index";
import { bundledCatalogImages } from "../src/assets/catalog-images";
import { bundledExpansionImages } from "../src/assets/expansion-images";
import SolutionPage from "../src/solutions/SolutionPage";
import BusinessSolutions from "../src/solutions/BusinessSolutions";
import content from "../src/shared/site-content.json";

test("all twelve business types have distinct complete descriptions and deployed illustrations", async () => {
  assert.equal(solutionIndex.length, 12);
  assert.equal(businessSolutions.length, solutionIndex.length);
  assert.equal(
    new Set(businessSolutions.map((entry) => entry.slug)).size,
    solutionIndex.length,
  );
  const images = new Set<string>();
  for (const entry of solutionIndex) {
    const detail = getBusinessSolution(entry.slug);
    assert.ok(detail, entry.slug);
    assert.equal(detail.title, entry.title);
    assert.equal(detail.image, entry.image);
    assert.ok(detail.problems.length >= 4, entry.slug + ": problems");
    assert.ok(detail.zones.length >= 4, entry.slug + ": zones");
    assert.ok(detail.brief.length >= 6, entry.slug + ": brief");
    assert.equal(detail.process.length, 4, entry.slug + ": process");
    assert.ok(detail.faq.length >= 3, entry.slug + ": questions");
    assert.ok(detail.productSlugs.length >= 4, entry.slug + ": products");
    for (const slug of detail.productSlugs)
      assert.ok(
        catalogIndex.some((product) => product.slug === slug),
        `${entry.slug}: unknown product ${slug}`,
      );
    for (const problem of detail.problems)
      assert.ok(
        problem.signs.length > 40 && problem.solution.length > 60,
        entry.slug + ": unexplained problem",
      );
    for (const zone of detail.zones) {
      assert.ok(zone.techniques.length >= 2, entry.slug + ": techniques");
      for (const technique of zone.techniques)
        assert.ok(
          technique.description.length > 60 &&
            technique.materials.length > 20 &&
            technique.considerations.length > 40,
          `${entry.slug}: incomplete technique ${technique.title}`,
        );
    }
    const image =
      bundledExpansionImages[entry.image] || bundledCatalogImages[entry.image];
    assert.ok(image, entry.slug + ": missing image");
    const bytes = await fs.readFile(
      new URL(`../public${image.src}`, import.meta.url),
    );
    const hash = crypto.createHash("sha256").update(bytes).digest("hex");
    assert.ok(!images.has(hash), entry.slug + ": repeated illustration");
    images.add(hash);
  }
});

test("business cards open their own routes and every detailed section is publicly rendered", () => {
  const overview = renderToStaticMarkup(createElement(BusinessSolutions));
  const escape = (text: string) =>
    text
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#x27;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  for (const entry of solutionIndex) {
    const href = solutionHref(entry.slug);
    assert.ok(overview.includes(`href="${href}"`));
    assert.equal(findSolutionEntry(href)?.slug, entry.slug);
    assert.equal(findSolutionEntry(href + "/")?.slug, entry.slug);
    const solution = getBusinessSolution(entry.slug)!;
    const html = renderToStaticMarkup(
      createElement(SolutionPage, {
        solution,
        contact: content.contact,
        portfolio: content.portfolio,
      }),
    );
    assert.ok(html.includes(`<h1>${escape(solution.title)}</h1>`));
    for (const id of [
      "overview",
      "problems",
      "zones",
      "products",
      "brief",
      "process",
      "questions",
      "contact",
    ])
      assert.ok(
        html.includes(`id="${id}"`),
        entry.slug + ": missing section " + id,
      );
    assert.ok(
      html.includes(escape(solution.lead)),
      entry.slug + ": missing full introduction",
    );
    for (const problem of solution.problems)
      assert.ok(
        html.includes(escape(problem.solution)),
        entry.slug + ": solution not visible",
      );
    for (const zone of solution.zones)
      for (const technique of zone.techniques) {
        for (const text of [
          technique.title,
          technique.description,
          technique.materials,
          technique.considerations,
        ])
          assert.ok(
            html.includes(escape(text)),
            `${entry.slug}: missing technique detail`,
          );
      }
    for (const slug of solution.productSlugs)
      assert.ok(html.includes(`href="/catalog/${slug}"`));
    const whatsappLinks = [
      ...html.matchAll(/href="(https:\/\/wa\.me\/[^"\s]+)"/g),
    ];
    assert.ok(whatsappLinks.length, entry.slug + ": missing WhatsApp links");
    for (const [, href] of whatsappLinks) {
      assert.equal(
        new URL(href.replaceAll("&amp;", "&")).searchParams.get("text"),
        "Здравствуйте! Нужен предварительный расчёт.",
        entry.slug + ": incorrect WhatsApp template",
      );
    }
  }
  for (const path of [
    "/solutions/unknown",
    "/solutions/retail/extra",
    "/catalog/retail",
    "/solutions/../retail",
  ])
    assert.equal(findSolutionEntry(path), undefined);
});
