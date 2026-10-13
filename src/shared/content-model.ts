import {
  siteContentSchema,
  type PublishedContent,
  type SiteContent,
} from "./content-schema";
import sourceContent from "./site-content.json";

/** Preserve recorded identities and normalize legacy content that lacks unique IDs. */
export function normalizeContentIds(content: PublishedContent): SiteContent {
  const identify = <T extends { id?: string }>(
    items: T[],
    namespace: number,
  ): Array<T & { id: string }> => {
    const used = new Set<string>();
    const reserved = new Set(
      items.flatMap((item) => (item.id ? [item.id] : [])),
    );
    return items.map((item, index) => {
      let sequence = namespace + index;
      let replacement = `00000000-0000-4000-8000-${sequence.toString(16).padStart(12, "0")}`;
      while (reserved.has(replacement) || used.has(replacement))
        replacement = `00000000-0000-4000-8000-${(++sequence).toString(16).padStart(12, "0")}`;
      const id = item.id && !used.has(item.id) ? item.id : replacement;
      used.add(id);
      return { ...item, id };
    });
  };
  return {
    ...content,
    portfolio: identify(content.portfolio, 0),
    clients: identify(content.clients, 10_000),
  };
}

// This versioned source is authoritative for a deployment. Runtime code only reads it.
const publishedContent = normalizeContentIds(
  siteContentSchema.parse(sourceContent),
);

/** Return an independent copy of the validated, authoritative published source. */
export function getPublishedContent(): SiteContent {
  return structuredClone(publishedContent);
}
