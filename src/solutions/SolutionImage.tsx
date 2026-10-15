import { bundledCatalogImages } from "../assets/catalog-images";
import { bundledExpansionImages } from "../assets/expansion-images";

export default function SolutionImage({
  image,
  title,
  priority = false,
}: {
  image: string;
  title: string;
  priority?: boolean;
}) {
  const source = bundledExpansionImages[image] || bundledCatalogImages[image];
  if (!source) throw new Error(`Missing solution image: ${image}`);
  return (
    <img
      src={source.src}
      srcSet={source.srcSet}
      sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1100px) 45vw, 640px"
      width={source.width}
      height={source.height}
      alt={title.startsWith("Иллюстрация") ? title : `Иллюстрация: ${title}`}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
