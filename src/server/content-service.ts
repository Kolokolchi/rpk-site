import "server-only";
import crypto from "node:crypto";
import { getPublishedContent } from "../shared/content-model";
import { type ContentSnapshot } from "../shared/content-schema";

// Sort object keys, preserving array order; whitespace and key order do not alter source revisions.
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}
const sourceRevision = `"sha256-${crypto.createHash("sha256").update(canonicalJson(getPublishedContent())).digest("hex")}"`;
export async function getPublicSnapshot(): Promise<ContentSnapshot> {
  return {
    content: getPublishedContent(),
    revision: sourceRevision,
    repairedFallback: false,
  };
}
