import type { SiteContent } from "../../shared/content-schema";
import { PublicText, SectionAtmosphere } from "./primitives";
import { catalogIndex } from "../../shared/catalog-index";
import CatalogIndex from "../../catalog/CatalogIndex";

export default function ServicesSection({ content }: { content: SiteContent }) {
  return (
    <section
      className="services-section section-transition reveal-on-scroll"
      id="services"
      aria-labelledby="services-title"
    >
      <SectionAtmosphere theme="services" />
      <div className="section-heading">
        <PublicText as="h2" id="services-title" value={content.servicesTitle} />
        <p className="section-description">
          {catalogIndex.length} направлений: от вывески и печати до оформления
          пространства. На странице каждого вида работ — интерактивный пример,
          технология, варианты применения и преимущества.
        </p>
      </div>

      <CatalogIndex preview />
    </section>
  );
}
