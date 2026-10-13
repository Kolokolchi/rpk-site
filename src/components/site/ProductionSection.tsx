import { ShieldCheck } from "lucide-react";
import type { SiteContent } from "../../shared/content-schema";
import { PublicText, PublicImage, SectionAtmosphere } from "./primitives";
import { revealDelayClass, iconMap } from "./site-utils";

export default function ProductionSection({
  content,
}: {
  content: SiteContent;
}) {
  return (
    <section
      className="production-section section-transition reveal-on-scroll"
      id="production"
      aria-labelledby="production-title"
    >
      <SectionAtmosphere theme="production" />
      <figure className="production-figure">
        <PublicImage
          alt={content.production.imageAlt}
          className="production-image"
          sizes="(max-width: 1100px) calc(100vw - 40px), 520px"
          src={content.production.image}
        />
        <figcaption>
          Пример готовой работы: {content.production.imageAlt}.
        </figcaption>
      </figure>

      <div className="production-copy">
        <PublicText
          as="h2"
          id="production-title"
          value={content.production.title}
        />
        <PublicText
          as="p"
          className="section-context"
          value={content.production.kicker}
        />
        <PublicText as="p" value={content.production.text} />

        <div className="process-list">
          {content.process.map((item, index) => {
            const Icon = iconMap[item.icon] || ShieldCheck;
            return (
              <article
                className={`process-item reveal-on-scroll ${revealDelayClass(index)}`}
                key={`process-${index}`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon aria-hidden="true" />
                <div>
                  <PublicText as="h3" value={item.title} />
                  <PublicText as="p" value={item.text} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
