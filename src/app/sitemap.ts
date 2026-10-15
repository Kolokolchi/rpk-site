import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { catalogHref, catalogIndex } from "../shared/catalog-index";
import { solutionHref, solutionIndex } from "../shared/solution-index";
import { siteUrl } from "./metadata-utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.RPK_STATIC_EXPORT !== "true") await connection();
  return [
    "/",
    "/catalog",
    "/solutions",
    ...catalogIndex.map((entry) => catalogHref(entry.slug)),
    ...solutionIndex.map((entry) => solutionHref(entry.slug)),
  ].map((pathname) => ({ url: siteUrl(pathname) }));
}
