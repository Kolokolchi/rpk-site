import fs from "node:fs/promises";
import { test } from "vitest";
import assert from "node:assert/strict";

import {
  isSafeImageSource,
  siteContentSchema,
} from "../src/shared/content-schema";

test("the checked-in site content matches the runtime schema", async () => {
  const content = JSON.parse(
    await fs.readFile(
      new URL("../src/shared/site-content.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(siteContentSchema.safeParse(content).success, true);
});

test("malformed nested source entries are rejected", async () => {
  const content = JSON.parse(
    await fs.readFile(
      new URL("../src/shared/site-content.json", import.meta.url),
      "utf8",
    ),
  );
  content.advantages = [{}];
  const result = siteContentSchema.safeParse(content);
  assert.equal(result.success, false);
  assert.equal(
    result.error.issues.some(
      (issue) => issue.path.join(".") === "advantages.0.icon",
    ),
    true,
  );
});

test("published media cannot reference external, executable or inline payloads", async () => {
  const content = JSON.parse(
    await fs.readFile(
      new URL("../src/shared/site-content.json", import.meta.url),
      "utf8",
    ),
  );
  const rejectedSources = [
    "https://attacker.example/payload.jpg",
    "//attacker.example/payload.jpg",
    "javascript:alert(1)",
    "data:image/svg+xml,<svg onload=alert(1)>",
    "/api/media/../payload.jpg",
    "/api/media/ABCDEF.jpg",
  ];

  for (const source of rejectedSources) {
    const candidate = structuredClone(content);
    candidate.hero.background = source;
    assert.equal(siteContentSchema.safeParse(candidate).success, false, source);
    assert.equal(isSafeImageSource(source), false, source);
  }

  const managed = structuredClone(content);
  managed.hero.background = `/api/media/${"a".repeat(64)}.jpg`;
  assert.equal(siteContentSchema.safeParse(managed).success, false);
});

test("dangerous control characters and untrusted footer destinations are rejected", async () => {
  const content = JSON.parse(
    await fs.readFile(
      new URL("../src/shared/site-content.json", import.meta.url),
      "utf8",
    ),
  );
  content.hero.title = "Trusted\u202Egpj.exe";
  assert.equal(siteContentSchema.safeParse(content).success, false);

  const c1Control = JSON.parse(
    await fs.readFile(
      new URL("../src/shared/site-content.json", import.meta.url),
      "utf8",
    ),
  );
  c1Control.hero.title = "Trusted\u0085forged";
  assert.equal(siteContentSchema.safeParse(c1Control).success, false);

  const malformedUnicode = JSON.parse(
    await fs.readFile(
      new URL("../src/shared/site-content.json", import.meta.url),
      "utf8",
    ),
  );
  malformedUnicode.clients[0].name = "Broken \uD800 name";
  assert.equal(siteContentSchema.safeParse(malformedUnicode).success, false);

  const phoneWithTrailingControl = JSON.parse(
    await fs.readFile(
      new URL("../src/shared/site-content.json", import.meta.url),
      "utf8",
    ),
  );
  phoneWithTrailingControl.contact.phone = "+7 747 600 09 32\n";
  assert.equal(
    siteContentSchema.safeParse(phoneWithTrailingControl).success,
    false,
  );

  const externalFooter = JSON.parse(
    await fs.readFile(
      new URL("../src/shared/site-content.json", import.meta.url),
      "utf8",
    ),
  );
  externalFooter.footer.url = "https://attacker.example/rpk.kz";
  assert.equal(siteContentSchema.safeParse(externalFooter).success, false);
});
