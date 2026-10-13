import CatalogOverview from "../../../components/site/CatalogOverview";
import { catalogIndex, catalogHref } from "../../../shared/catalog-index";
import { pageMetadata, StructuredData } from "../../metadata-utils";
import { readRequestSecurityConfig } from "../../../server/config";
export async function generateMetadata() {
  return pageMetadata(
    "Каталог наружной рекламы и оформления | RPK.KZ",
    `${catalogIndex.length} направления наружной рекламы: вывески, конструкции, печать, оформление и производство. Технологии, варианты применения и преимущества.`,
    "/catalog",
  );
}
export default function Catalog() {
  const origin = readRequestSecurityConfig().publicOrigin;
  return (
    <>
      <CatalogOverview />
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Каталог наружной рекламы",
          url: new URL("/catalog", origin).href,
          hasPart: catalogIndex.map((item) => ({
            "@type": "WebPage",
            name: item.title,
            url: new URL(catalogHref(item.slug), origin).href,
          })),
        }}
      />
    </>
  );
}
