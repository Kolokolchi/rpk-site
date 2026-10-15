import { ArrowRight } from "lucide-react";
import type { SiteContent } from "../../shared/content-schema";
import { PublicText, PublicImage, SectionAtmosphere } from "./primitives";
import ClientLogoMarquee from "./ClientLogoMarquee";

// These supplied variants have white lettering and need a dark surface.
const darkLogoSources = new Set([
  "/assets/partners/actual-optic.svg",
  "/assets/partners/herbalife.svg",
  "/assets/partners/mirtek.svg",
  "/assets/partners/alinex.svg",
]);

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

      <ClientLogoMarquee
        moreLink={
          <p className="clients-note">
            <a href="#portfolio">
              Посмотреть выполненные объекты <ArrowRight aria-hidden="true" />
            </a>
          </p>
        }
      >
        {[false, true].map((duplicate) => (
          <div
            className="client-logo-group"
            role="list"
            aria-hidden={duplicate || undefined}
            inert={duplicate}
            key={String(duplicate)}
          >
            {content.clients.map((client) => (
              <div
                className={`client-logo-card ${client.logo ? "" : "client-name-only"}`}
                role="listitem"
                key={client.id}
              >
                {client.logo ? (
                  <PublicImage
                    alt={`Логотип ${client.name}`}
                    className={`client-logo-media${darkLogoSources.has(client.logo) ? " client-logo-media-dark" : ""}`}
                    imageClassName="client-logo-image"
                    sizes="188px"
                    src={client.logo}
                  />
                ) : (
                  <PublicText
                    as="strong"
                    className="client-logo-name"
                    value={client.name}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </ClientLogoMarquee>
    </section>
  );
}
