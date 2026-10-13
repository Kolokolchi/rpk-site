import { bundledCatalogImages } from "../assets/catalog-images";
import { bundledProjectImages } from "../assets/project-images";
import type { CatalogMeta } from "./catalog-content";

export function catalogImageSource(entry: CatalogMeta) {
  return bundledCatalogImages[entry.image] || bundledProjectImages[entry.image] || {
    src: entry.image.startsWith("/src/assets/") ? entry.image.replace("/src/assets/", "/assets/") : entry.image,
    srcSet: undefined,
    width: 1536,
    height: 1024,
  };
}

export default function CatalogImage({ entry, priority = false, sizes = "(max-width: 820px) calc(100vw - 40px), 640px" }: { entry: CatalogMeta; priority?: boolean; sizes?: string }) {
  const image = catalogImageSource(entry);
  return <img src={image.src} srcSet={image.srcSet} sizes={image.srcSet ? sizes : undefined} width={image.width} height={image.height} alt={entry.imageAlt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding="async" />;
}
