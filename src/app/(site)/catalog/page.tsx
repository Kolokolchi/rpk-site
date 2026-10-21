import CatalogOverview from "../../../components/site/CatalogOverview";
import { catalogIndex, catalogHref } from "../../../shared/catalog-index";
import { pageMetadata, StructuredData, siteUrl } from "../../metadata-utils";
export async function generateMetadata() {
  return pageMetadata(
    "Каталог наружной рекламы и оформления | RPK.KZ",
    `Направления наружной рекламы (${catalogIndex.length}): вывески, конструкции, печать, оформление и производство. Технологии, варианты применения и преимущества.`,
    "/catalog",
  );
}
export default function Catalog() {
  return (
    <>
      <CatalogOverview />
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Каталог наружной рекламы",
          url: siteUrl("/catalog"),
          hasPart: catalogIndex.map((item) => ({
            "@type": "WebPage",
            name: item.title,
            url: siteUrl(catalogHref(item.slug)),
          })),
        }}
      />
    </>
  );
}
