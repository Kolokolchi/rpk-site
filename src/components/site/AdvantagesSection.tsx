import { ShieldCheck } from "lucide-react";
import type { SiteContent } from "../../shared/content-schema";
import { PublicText, SectionAtmosphere } from "./primitives";
import { revealDelayClass, iconMap } from "./site-utils";

export default function AdvantagesSection({
  content,
}: {
  content: SiteContent;
}) {
  return (
    <section
      className="advantages-section section-transition reveal-on-scroll"
      aria-labelledby="advantages-title"
    >
      <SectionAtmosphere theme="advantages" />
      <div className="section-heading compact">
        <PublicText
          as="h2"
          id="advantages-title"
          value={content.advantagesTitle}
        />
      </div>

      <div className="advantage-grid">
        {content.advantages.map((item, index) => {
          const Icon = iconMap[item.icon] || ShieldCheck;
          return (
            <article
              className={`advantage-card reveal-on-scroll ${revealDelayClass(index)}`}
              key={`advantage-${index}`}
            >
              <Icon aria-hidden="true" />
              <PublicText as="h3" value={item.title} />
              <PublicText as="p" value={item.text} />
            </article>
          );
        })}
      </div>
    </section>
  );
}
