import { ArrowRight, MessageCircle } from "lucide-react";
import type { SiteContent } from "../../shared/content-schema";
import { PublicText, PublicImage } from "./primitives";
import { logoMark, whatsappLink } from "./site-utils";

export default function HeroSection({ content }: { content: SiteContent }) {
  const heroProject = content.portfolio.find(
    (project) => project.image === content.hero.background,
  );
  const whatsappHref = whatsappLink(content.contact.phone);
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-layout">
        <div className="hero-content hero-entry">
          <PublicText
            as="h1"
            id="hero-title"
            emphasis="чем реклама"
            value={content.hero.title}
          />
          <PublicText as="p" className="eyebrow" value={content.hero.eyebrow} />
          <PublicText as="p" className="hero-lead" value={content.hero.lead} />
          <p className="hero-values">
            <span>Идеи</span>
            <span>Материалы</span>
            <span>Результат</span>
          </p>
          <div className="hero-actions">
            <a
              className="primary-button"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Оставить заявку</span>
              <MessageCircle aria-hidden="true" />
            </a>
            <a className="secondary-button" href="#portfolio">
              <span>Смотреть наши работы</span>
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>

        <figure className="hero-art hero-entry">
          <PublicImage
            alt={
              heroProject
                ? `Вывеска ${heroProject.title} — выполненная работа RPK.KZ`
                : "Концепт фирменного оформления современного коммерческого здания"
            }
            className="hero-media-shell"
            imageClassName="hero-bg"
            priority
            sizes="100vw"
            src={content.hero.background}
          />
          <div className="hero-brand-panel" aria-hidden="true">
            <img src={logoMark} alt="" width="212" height="81" />
            <p>Рекламно-производственная компания</p>
          </div>
          <figcaption>
            <span>
              {heroProject
                ? `Наша работа · ${heroProject.title}`
                : "Визуализация фирменного оформления"}
            </span>
            <span>Алматы, Казахстан</span>
          </figcaption>
        </figure>
      </div>

      <div className="hero-proof hero-entry" aria-label="Ключевые факты">
        {content.hero.stats.map((item, index) => (
          <div key={`hero-stat-${index}`}>
            <PublicText as="strong" value={item.value} />
            <PublicText value={item.label} />
          </div>
        ))}
      </div>
    </section>
  );
}
