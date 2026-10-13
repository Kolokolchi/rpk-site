import { ArrowRight } from "lucide-react";
import type { SiteContent } from "../../shared/content-schema";
import { PublicText, PublicImage, SectionAtmosphere } from "./primitives";

export default function ClientsSection({ content }: { content: SiteContent }) {
  return (
    <section
      className="clients-section section-transition reveal-on-scroll"
      id="clients"
      aria-labelledby="clients-title"
    >
      <SectionAtmosphere theme="clients" />
      <div className="section-heading">
        <PublicText as="h2" id="clients-title" value={content.clientsTitle} />
      </div>

      <div
        className="client-grid"
        aria-label="Компании, для которых мы выполняли работы"
      >
        {content.clients.map((client) => (
          <article
            className={`client-logo-card ${client.logo ? "" : "client-name-only"}`}
            key={client.id}
          >
            {client.logo ? (
              <PublicImage
                alt={`Логотип ${client.name}`}
                className="client-logo-media"
                imageClassName="client-logo-image"
                sizes="240px"
                src={client.logo || ""}
              />
            ) : null}
            <PublicText
              as="strong"
              className="client-logo-name"
              value={client.name}
            />
          </article>
        ))}
      </div>
      <p className="clients-note">
        <a href="#portfolio">
          Посмотреть выполненные объекты <ArrowRight aria-hidden="true" />
        </a>
      </p>
    </section>
  );
}
