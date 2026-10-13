import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import {
  catalogGroups,
  catalogHref,
  catalogIndex,
} from "../shared/catalog-index";
import { publicPath } from "../shared/public-path";
import { getCatalogDetail, type CatalogMeta } from "./catalog-content";
import CatalogImage, { catalogImageSource } from "./CatalogImage";

const pageSections = [
  ["technology", "Устройство"],
  ["variants", "Варианты"],
  ["applications", "Применение"],
  ["advantages", "Преимущества"],
  ["selection", "Как выбрать"],
  ["process", "Этапы"],
  ["questions", "Вопросы"],
];

type Props = {
  entry: CatalogMeta;
  whatsappHref: string;
  contact: { phone: string; email: string; location: string };
};

export default function CatalogPage({ entry, whatsappHref, contact }: Props) {
  const detail = getCatalogDetail(entry.slug);
  if (!detail) throw new Error(`Missing catalog content: ${entry.slug}`);
  const group = catalogGroups.find((group) => group.id === entry.group);
  const related = detail.related.flatMap((slug) => {
    const item = catalogIndex.find((candidate) => candidate.slug === slug);
    return item ? [item] : [];
  });
  const phoneHref = `tel:${contact.phone.replace(/[^\d+]/g, "")}`;

  return (
    <article className="catalog-page">
      <nav className="catalog-breadcrumbs" aria-label="Путь по сайту">
        <a href={publicPath("/")}>Главная</a>
        <span aria-hidden="true">/</span>
        <a href={publicPath("/catalog")}>Каталог</a>
        {group && (
          <>
            <span aria-hidden="true">/</span>
            <span>{group.title}</span>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span aria-current="page">{entry.title}</span>
      </nav>
      <header className="catalog-hero">
        <div className="catalog-hero-copy">
          <h1>{entry.title}</h1>
          <p className="catalog-lead">{entry.summary}</p>
          <a
            className="primary-button"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Рассчитать проект</span>
            <MessageCircle aria-hidden="true" />
          </a>
          <a className="catalog-back-link" href={publicPath("/#services")}>
            <ArrowLeft aria-hidden="true" />
            Вернуться к перечню работ
          </a>
        </div>
        <figure className={`catalog-hero-image is-${entry.imageKind}`}>
          <a
            href={catalogImageSource(entry).src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Рассмотреть изображение: ${entry.title}`}
          >
            <CatalogImage entry={entry} priority />
          </a>
          <figcaption>
            <span>{entry.imageCaption}</span>
            <span>
              Нажмите, чтобы рассмотреть <ArrowRight aria-hidden="true" />
            </span>
          </figcaption>
        </figure>
      </header>
      <div className="catalog-highlights" aria-label="Основные преимущества">
        {detail.advantages.map((item) => (
          <div key={item.title}>
            <CheckCircle2 aria-hidden="true" />
            <strong>{item.title}</strong>
          </div>
        ))}
      </div>
      <div className="catalog-reading-layout">
        <aside className="catalog-toc">
          <nav aria-label="Содержание страницы">
            <p>На этой странице</p>
            <ol>
              {pageSections.map(([id, label], index) => (
                <li key={id}>
                  <a href={`#${id}`}>
                    <span aria-hidden="true">0{index + 1}</span>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <a className="catalog-all-link" href={publicPath("/catalog")}>
            <ArrowLeft aria-hidden="true" />
            Весь каталог
          </a>
        </aside>
        <div className="catalog-article-body">
          <section id="technology" aria-labelledby="technology-title">
            <h2 id="technology-title">Как это устроено</h2>
            <div className="catalog-prose">
              {detail.technology.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="catalog-parts">
              <h3>Основные элементы</h3>
              <dl>
                {detail.parts.map((part) => (
                  <div key={part.title}>
                    <dt>{part.title}</dt>
                    <dd>{part.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
          <section id="variants" aria-labelledby="variants-title">
            <h2 id="variants-title">Варианты решения</h2>
            <div className="catalog-variants">
              {detail.variants.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <div>
                    <p>{item.text}</p>
                    <p className="catalog-suitable">
                      <strong>Подходит:</strong> {item.use}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section id="applications" aria-labelledby="applications-title">
            <h2 id="applications-title">Где применять</h2>
            <div className="catalog-applications">
              {detail.uses.map((item) => (
                <article key={item.title}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <strong className="catalog-benefit">
                      <CheckCircle2 aria-hidden="true" />
                      {item.benefit}
                    </strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section id="advantages" aria-labelledby="advantages-title">
            <h2 id="advantages-title">Преимущества</h2>
            <div className="catalog-advantages">
              {detail.advantages.map((item) => (
                <article key={item.title}>
                  <CheckCircle2 aria-hidden="true" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section id="selection" aria-labelledby="selection-title">
            <h2 id="selection-title">Что учесть при выборе</h2>
            <dl className="catalog-selection">
              {detail.choice.map((item) => (
                <div key={item.title}>
                  <dt>{item.title}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
            <p className="catalog-selection-note">
              Стоимость и срок зависят от размеров, материалов, комплектации и
              условий работы. Фото объекта и примерные размеры помогут
              подготовить предварительный расчёт.
            </p>
          </section>
          <section id="process" aria-labelledby="process-title">
            <h2 id="process-title">Этапы</h2>
            <ol className="catalog-process">
              {detail.process.map((item, index) => (
                <li key={item.title}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section id="questions" aria-labelledby="questions-title">
            <h2 id="questions-title">Частые вопросы</h2>
            <div className="catalog-questions">
              {detail.faq.map((item) => (
                <article key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
      <section
        className="catalog-project-cta"
        id="contact"
        aria-labelledby="catalog-contact-title"
      >
        <div>
          <h2 id="catalog-contact-title">
            Подберём решение
            <br />
            для вашего объекта
          </h2>
          <p>
            Отправьте фото места, примерные размеры и пожелания. Обсудим вариант
            исполнения, материалы и состав работ.
          </p>
        </div>
        <div className="catalog-cta-actions">
          <a
            className="primary-button"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Получить расчёт в WhatsApp</span>
            <ArrowRight aria-hidden="true" />
          </a>
          <a href={phoneHref}>
            <Phone aria-hidden="true" />
            {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`}>
            <Mail aria-hidden="true" />
            {contact.email}
          </a>
          <span>{contact.location}</span>
        </div>
      </section>
      <section className="catalog-related" aria-labelledby="related-title">
        <h2 id="related-title">Посмотрите также</h2>
        <ul>
          {related.map((item) => (
            <li key={item.slug}>
              <a href={publicPath(catalogHref(item.slug))}>
                <figure className="catalog-related-media">
                  <CatalogImage
                    entry={item}
                    sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1440px) 30vw, 440px"
                  />
                  <figcaption>
                    {item.imageKind === "project"
                      ? "Работа RPK.KZ"
                      : "Иллюстрация технологии"}
                  </figcaption>
                </figure>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <span>
                  Открыть страницу <ArrowRight aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a className="catalog-back-link" href={publicPath("/catalog")}>
          <ArrowLeft aria-hidden="true" />
          Все направления ({catalogIndex.length})
        </a>
      </section>
    </article>
  );
}
