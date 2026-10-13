import type { SiteContent } from "../../shared/content-schema";
import { PublicText, SectionAtmosphere } from "./primitives";
import { revealDelayClass } from "./site-utils";

export default function EcosystemSection({
  content,
}: {
  content: SiteContent;
}) {
  return (
    <section
      className="ecosystem-section section-transition reveal-on-scroll"
      aria-labelledby="ecosystem-title"
    >
      <SectionAtmosphere theme="ecosystem" />
      <div className="ecosystem-copy">
        <PublicText
          as="h2"
          id="ecosystem-title"
          value={content.ecosystem.title}
        />
        <PublicText
          as="p"
          className="section-context"
          value={content.ecosystem.kicker}
        />
        <PublicText as="p" value={content.ecosystem.text} />
      </div>

      <div className="ecosystem-map" aria-label="Зоны брендирования объекта">
        {content.ecosystem.zones.map((zone, index) => (
          <article
            className={`reveal-on-scroll ${revealDelayClass(index)}`}
            key={`zone-${index}`}
          >
            <PublicText as="h3" value={zone.title} />
            <PublicText as="p" value={zone.text} />
          </article>
        ))}
      </div>
    </section>
  );
}
