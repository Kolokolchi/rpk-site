import BusinessSolutions from "../../../solutions/BusinessSolutions";
import { solutionHref, solutionIndex } from "../../../shared/solution-index";
import { pageMetadata, siteUrl, StructuredData } from "../../metadata-utils";

export function generateMetadata() {
  return pageMetadata(
    "Оформление объектов для бизнеса — решения по зонам | RPK.KZ",
    "12 типов объектов: проблемы, способы решения, материалы и приёмы оформления. От фасада и входа до интерьера, навигации и места продаж.",
    "/solutions",
  );
}
export default function SolutionsOverview() {
  return (
    <>
      <BusinessSolutions overview />
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Решения для вашего объекта",
          url: siteUrl("/solutions"),
          hasPart: solutionIndex.map((entry) => ({
            "@type": "WebPage",
            name: entry.title,
            url: siteUrl(solutionHref(entry.slug)),
          })),
        }}
      />
    </>
  );
}
