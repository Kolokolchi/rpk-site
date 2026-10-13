import assert from "node:assert/strict";
import { test } from "vitest";
import {
  normalizeContentIds,
  getPublishedContent,
} from "../src/shared/content-model";
import {
  siteContentSchema,
  type PublishedContent,
} from "../src/shared/content-schema";
import sourceContent from "../src/shared/site-content.json";

test("published content comes from the versioned source with recorded stable identities", () => {
  const content = getPublishedContent();
  assert.equal(siteContentSchema.safeParse(content).success, true);
  assert.deepEqual(content, sourceContent);
  for (const collection of ["portfolio", "clients"] as const) {
    const ids = sourceContent[collection].map((item) => item.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const id of ids)
      assert.match(
        id,
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
  }
});

test("published snapshots are independent deep copies of authoritative content", () => {
  const first = getPublishedContent();
  const second = getPublishedContent();
  assert.notEqual(first, second);
  assert.deepEqual(first, second);
  first.hero.title = "Changed local copy";
  first.portfolio[0].title = "Changed project";
  first.clients[0].name = "Changed client";
  first.ecosystem.zones[0].text = "Changed nested zone";
  assert.deepEqual(second, sourceContent);
  assert.deepEqual(getPublishedContent(), sourceContent);
});

test("legacy identity normalization fills missing IDs and repairs duplicates without changing facts", () => {
  const legacy: PublishedContent = getPublishedContent();
  const existingPortfolioId = legacy.portfolio[0].id;
  const existingClientId = legacy.clients[0].id;
  delete legacy.portfolio[1].id;
  legacy.clients[1].id = existingClientId;
  const normalized = normalizeContentIds(legacy);
  assert.deepEqual(normalizeContentIds(legacy), normalized);
  assert.equal(normalized.portfolio[0].id, existingPortfolioId);
  assert.equal(normalized.clients[0].id, existingClientId);
  assert.ok(normalized.portfolio[1].id);
  assert.notEqual(normalized.clients[1].id, existingClientId);
  assert.equal(legacy.portfolio[1].id, undefined);
  assert.equal(legacy.clients[1].id, existingClientId);
  for (const collection of ["portfolio", "clients"] as const) {
    assert.equal(
      new Set(normalized[collection].map((item) => item.id)).size,
      normalized[collection].length,
    );
    const facts = normalized[collection].map((item) => {
      const { id: identity, ...fields } = item;
      assert.ok(identity);
      return fields;
    });
    const originalFacts = legacy[collection].map((item) => {
      const fields = { ...item };
      delete fields.id;
      return fields;
    });
    assert.deepEqual(facts, originalFacts);
  }
  assert.equal(siteContentSchema.safeParse(normalized).success, true);
});

test("server-rendered identities survive JSON hydration without regenerating IDs", () => {
  const serverContent = getPublishedContent();
  const hydrated = siteContentSchema.parse(
    JSON.parse(JSON.stringify(serverContent)),
  );
  const clientContent = normalizeContentIds(hydrated);
  assert.deepEqual(clientContent, serverContent);
  for (const collection of ["portfolio", "clients"] as const) {
    assert.deepEqual(
      clientContent[collection].map((item) => item.id),
      sourceContent[collection].map((item) => item.id),
    );
  }
});
