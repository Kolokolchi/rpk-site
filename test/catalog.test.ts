import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import { test } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as catalog from "../src/shared/catalog-index";
import {
  getCatalogDetail,
  type ExplainedItem,
} from "../src/catalog/catalog-content";
import CatalogPage from "../src/catalog/CatalogPage";
import { catalogImageSource } from "../src/catalog/CatalogImage";
import CatalogOverview from "../src/components/site/CatalogOverview";

test("every advertised catalog technology has complete content and valid related destinations", async () => {
  const content = { getCatalogDetail };
  const slugs = new Set(catalog.catalogIndex.map((entry) => entry.slug));
  assert.equal(slugs.size, 30);
  assert.equal(
    new Set(catalog.catalogIndex.map((entry) => entry.image)).size,
    catalog.catalogIndex.length,
    "Catalog cards must not repeat images",
  );

  const imageDigests = new Set<string>();
  for (const entry of catalog.catalogIndex) {
    const image = catalogImageSource(entry);
    assert.ok(
      image.src.startsWith("/assets/"),
      `Image is not rooted publicly for ${entry.slug}`,
    );
    const imagePath = `../public${image.src}`;
    const digest = crypto
      .createHash("sha256")
      .update(await fs.readFile(new URL(imagePath, import.meta.url)))
      .digest("hex");
    assert.ok(
      !imageDigests.has(digest),
      `Repeated image bytes for ${entry.slug}`,
    );
    imageDigests.add(digest);
    assert.ok(catalog.catalogGroups.some((group) => group.id === entry.group));
    const detail = content.getCatalogDetail(entry.slug);
    assert.ok(detail, `Missing detail for ${entry.slug}`);
    for (const section of [
      "technology",
      "parts",
      "variants",
      "uses",
      "advantages",
      "choice",
      "faq",
    ] as const) {
      assert.ok(
        detail[section].length >= 2,
        `${entry.slug}: missing ${section}`,
      );
    }
    assert.equal(
      detail.process.length,
      4,
      `${entry.slug}: expected four process steps`,
    );
    assert.equal(
      new Set(detail.process.map((step) => step.title)).size,
      4,
      `${entry.slug}: repeated process step`,
    );
    for (const step of detail.process) {
      assert.ok(
        typeof step.title === "string" && step.title.trim().length > 0,
        `${entry.slug}: missing step title`,
      );
      assert.ok(
        typeof step.text === "string" && step.text.trim().length > 0,
        `${entry.slug}: missing step explanation`,
      );
    }
    for (const slug of detail.related)
      assert.ok(slugs.has(slug), `${entry.slug}: broken related link ${slug}`);
    assert.equal(
      new Set(detail.related).size,
      detail.related.length,
      `${entry.slug}: repeated related work`,
    );
    assert.ok(
      !detail.related.includes(entry.slug),
      `${entry.slug}: main image repeated in related work`,
    );
    assert.ok(entry.imageAlt && entry.imageCaption);
  }
});

test("catalog processes follow the scope of design, service, processing and portable products", async () => {
  const content = { getCatalogDetail };
  const processFor = (slug: string) => {
    const detail = content.getCatalogDetail(slug);
    assert.ok(detail);
    return detail.process;
  };
  const combined = (steps: ExplainedItem[]) =>
    steps.map((step) => `${step.title} ${step.text}`).join(" ");
  const design = processFor("design-and-engineering");
  assert.match(design[0].text, /исходн|логотип|требования/);
  assert.match(design[1].title, /визуализация/);
  assert.match(design[2].text, /инженерную разработку/);
  assert.match(design[3].text, /передаём согласованный комплект/);
  assert.doesNotMatch(
    combined(design),
    /изготавливаем|монтируем|доставляем/i,
    "Design service should finish with project preparation",
  );

  const service = processFor("installation-and-service");
  assert.match(service[0].text, /готового изделия/);
  assert.match(service[0].text, /причину неисправности до выбора замен/);
  assert.match(service[1].text, /ремонт.*обновление.*демонтаж/);
  assert.match(service[2].text, /крепление.*замену.*обновление.*снятие/);
  assert.doesNotMatch(
    combined(service),
    /изготавливаем|макет/i,
    "Service should work with the existing structure",
  );

  const cutting = processFor("cnc-and-laser");
  assert.match(cutting[0].text, /состав.*совместимый/);
  assert.match(cutting[1].text, /векторный файл/);
  assert.match(cutting[3].text, /передаём детали/i);
  assert.doesNotMatch(
    combined(cutting),
    /свет|монтаж/i,
    "Cutting should return processed parts without promising assembly or lighting",
  );

  const uv = processFor("uv-printing");
  assert.match(uv[0].text, /образец.*сцепления/);
  assert.match(uv[1].text, /при подходящей комплектации/);
  assert.match(uv[3].text, /отдельной задаче/);
  assert.doesNotMatch(
    combined(uv),
    /проверяем.*свет/i,
    "Printing should not promise a lighting assembly check",
  );

  const banner = processFor("banner-printing");
  assert.match(banner[0].text, /крепления|люверсы|карманы/);
  assert.match(banner[2].text, /печатаем.*обрезаем/i);
  assert.match(banner[3].text, /при согласованном монтаже/);

  for (const slug of ["pavement-signs", "exhibition-stands"]) {
    assert.match(
      processFor(slug)[3].text,
      /передаём/i,
      `${slug}: portable products need a handover path`,
    );
    assert.doesNotMatch(
      combined(processFor(slug)),
      /световых элементов|подключение/i,
      `${slug}: no irrelevant electrical work`,
    );
  }
  assert.match(
    combined(processFor("vehicle-branding")),
    /покрыти.*кузов|кузов.*покрыти/i,
  );
  assert.match(
    processFor("wayfinding")[3].text,
    /последовательность направлений/,
  );
});

test("each catalog page server renders its four process steps before client JavaScript", () => {
  const signatures = new Set<string>();
  for (const entry of catalog.catalogIndex) {
    const detail = getCatalogDetail(entry.slug);
    assert.ok(detail);
    const html = renderToStaticMarkup(
      createElement(CatalogPage, {
        entry,
        whatsappHref: "https://wa.me/77000000000",
        contact: {
          phone: "+7 700 000 00 00",
          email: "test@example.com",
          location: "Алматы",
        },
      }),
    );
    const processSection = html.match(
      /<section id="process"[^>]*>(.*?)<\/section>/s,
    )?.[1];
    assert.ok(processSection, entry.slug + ": missing process section");
    assert.equal(
      (processSection.match(/<li>/g) || []).length,
      4,
      entry.slug + ": expected four visible steps",
    );
    for (const step of detail.process) {
      assert.ok(
        processSection.includes("<h3>" + step.title + "</h3>"),
        entry.slug + ": missing process title",
      );
      assert.ok(
        processSection.includes("<p>" + step.text + "</p>"),
        entry.slug + ": missing process explanation",
      );
    }
    assert.ok(html.includes("<h1>" + entry.title + "</h1>"));
    for (const section of [
      "technology",
      "variants",
      "applications",
      "advantages",
      "selection",
      "questions",
      "contact",
    ]) {
      assert.ok(
        html.includes('id="' + section + '"'),
        entry.slug + ": missing visible " + section,
      );
    }
    assert.ok(
      html.includes('src="/assets/'),
      entry.slug + ": missing rooted image URL",
    );
    assert.ok(
      !html.includes('src="/src/assets/') && !html.includes('src="./assets/'),
      entry.slug + ": legacy source leaked into HTML",
    );
    const signature = JSON.stringify(detail.process);
    assert.ok(
      !signatures.has(signature),
      entry.slug + ": unrelated routes share a complete process",
    );
    signatures.add(signature);
  }
});

test("canonical catalog destinations accept direct URLs and reject unknown or nested paths", () => {
  const overview = renderToStaticMarkup(createElement(CatalogOverview));
  for (const entry of catalog.catalogIndex) {
    const url = catalog.catalogHref(entry.slug);
    assert.equal(url, "/catalog/" + entry.slug);
    assert.equal(catalog.findCatalogEntry(url)?.slug, entry.slug);
    assert.equal(catalog.findCatalogEntry(url + "/")?.slug, entry.slug);
    assert.ok(overview.includes('href="' + url + '"'));
  }
  for (const url of [
    "/catalog/not-a-service",
    "/catalog/server.js",
    "/catalog/channel-letters/extra",
    "/server.js",
  ]) {
    assert.equal(catalog.findCatalogEntry(url), undefined, url);
  }
});
