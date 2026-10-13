import { ArrowRight, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import type { SiteContent } from "../../shared/content-schema";
import { PublicText, SectionAtmosphere } from "./primitives";
import { whatsappLink, phoneLink } from "./site-utils";

export default function ContactSection({ content }: { content: SiteContent }) {
  const whatsappHref = whatsappLink(content.contact.phone);
  const contactPhoneHref = phoneLink(content.contact.phone);
  return (
    <section
      className="contact-section section-transition reveal-on-scroll"
      id="contact"
      aria-labelledby="contact-title"
    >
      <SectionAtmosphere theme="contact" />
      <div className="contact-copy">
        <PublicText as="h2" id="contact-title" value={content.contact.title} />
        <PublicText
          as="p"
          className="section-context"
          value={content.contact.eyebrow}
        />
        <PublicText as="p" value={content.contact.text} />

        <div className="contact-links">
          <a href={`mailto:${content.contact.email}`}>
            <Mail aria-hidden="true" />
            <PublicText value={content.contact.email} />
          </a>
          <a href={contactPhoneHref}>
            <Phone aria-hidden="true" />
            <PublicText value={content.contact.phone} />
          </a>
          <span>
            <MapPin aria-hidden="true" />
            <PublicText value={content.contact.location} />
          </span>
        </div>
      </div>

      <div className="contact-form whatsapp-contact">
        <div className="whatsapp-card-header">
          <h3>Начните с фотографии объекта</h3>
        </div>

        <ul
          className="whatsapp-checklist"
          aria-label="Данные для предварительного расчёта"
        >
          <li>
            <CheckCircle2 aria-hidden="true" />
            <span>
              <strong>Фото объекта</strong>
              <small>Общий вид фасада или места установки</small>
            </span>
          </li>
          <li>
            <CheckCircle2 aria-hidden="true" />
            <span>
              <strong>Примерные размеры</strong>
              <small>Ширина и высота будущей конструкции</small>
            </span>
          </li>
          <li>
            <CheckCircle2 aria-hidden="true" />
            <span>
              <strong>Пожелания по оформлению</strong>
              <small>Пример, логотип или описание задачи</small>
            </span>
          </li>
        </ul>

        <a
          className="primary-button wide whatsapp-button"
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Отправить фото и получить расчёт</span>
          <ArrowRight aria-hidden="true" />
        </a>
        <p className="whatsapp-note">Откроется готовое сообщение в WhatsApp</p>
      </div>
    </section>
  );
}
