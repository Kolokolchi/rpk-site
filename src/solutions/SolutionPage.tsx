import {
  ArrowLeft,
  ArrowRight,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import type { SiteContent } from "../shared/content-schema";
import { catalogHref, catalogIndex } from "../shared/catalog-index";
import { solutionHref, solutionIndex } from "../shared/solution-index";
import { publicPath } from "../shared/public-path";
import { readableHeading } from "../shared/typography";
import { whatsappLink } from "../components/site/site-utils";
import { PublicImage } from "../components/site/primitives";
import CatalogImage from "../catalog/CatalogImage";
import SolutionImage from "./SolutionImage";
import type { BusinessSolution } from "./solution-types";

const sections = [
  ["overview", "Задачи объекта"],
  ["problems", "Проблемы и решения"],
  ["zones", "Зоны и приёмы"],
  ["products", "Подходящие продукты"],
  ["brief", "Подготовка к проекту"],
  ["process", "Этапы работы"],
  ["questions", "Частые вопросы"],
];

export default function SolutionPage({
  solution,
  contact,
  portfolio,
}: {
  solution: BusinessSolution;
  contact: SiteContent["contact"];
  portfolio: SiteContent["portfolio"];
}) {
  const products = solution.productSlugs.flatMap((slug) => {
    const product = catalogIndex.find((entry) => entry.slug === slug);
    return product ? [product] : [];
  });
  const related = solutionIndex
    .filter((entry) => entry.slug !== solution.slug)
    .slice(0, 3);
  const projects = solution.portfolioPattern
    ? portfolio.filter((project) =>
        new RegExp(solution.portfolioPattern!, "i").test(
          `${project.category} ${project.title}`,
        ),
      )
    : [];
  const whatsappHref = whatsappLink(contact.phone, solution.title);
  return (
    <article className="catalog-page solution-page">
      <nav className="catalog-breadcrumbs" aria-label="Путь по сайту">
        <a href={publicPath("/")}>Главная</a>
        <span aria-hidden="true">/</span>
        <a href={publicPath("/solutions")}>Для вашего объекта</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{solution.title}</span>
      </nav>
      <header className="catalog-hero">
        <div className="catalog-hero-copy">
          <h1>{solution.title}</h1>
          <p className="catalog-lead">{solution.summary}</p>
          <a
            className="primary-button"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Обсудить оформление объекта</span>
            <MessageCircle aria-hidden="true" />
          </a>
        </div>
        <figure className="catalog-hero-image solution-hero-image">
          <SolutionImage
            image={solution.image}
            title={solution.imageAlt}
            sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 820px) 92vw, (max-width: 1100px) 45vw, 640px"
            priority
          />
          <figcaption>Иллюстрация возможного оформления объекта</figcaption>
        </figure>
      </header>
      <div className="catalog-reading-layout">
        <aside className="catalog-toc">
          <nav aria-label="Содержание страницы">
            <ol>
              {sections.map(([id, title]) => (
                <li key={id}>
                  <a href={`#${id}`}>{title}</a>
                </li>
              ))}
            </ol>
          </nav>
          <a className="catalog-all-link" href={publicPath("/solutions")}>
            <ArrowLeft aria-hidden="true" />
            Все типы объектов
          </a>
        </aside>
        <div className="catalog-article-body">
          <section id="overview" aria-labelledby="overview-title">
            <h2 id="overview-title">Задачи оформления</h2>
            <div className="catalog-prose">
              <p>{solution.lead}</p>
            </div>
          </section>
          <section id="problems" aria-labelledby="problems-title">
            <h2 id="problems-title">Проблемы и способы решения</h2>
            <div className="solution-problems">
              {solution.problems.map((problem) => (
                <article key={problem.title}>
                  <h3>{problem.title}</h3>
                  <p>
                    <strong>Как проявляется.</strong> {problem.signs}
                  </p>
                  <p>
                    <strong>Что можно сделать.</strong> {problem.solution}
                  </p>
                </article>
              ))}
            </div>
          </section>
          <section id="zones" aria-labelledby="zones-title">
            <h2 id="zones-title">Оформление по зонам</h2>
            <p className="solution-section-intro">
              Разберите путь посетителя или сотрудника по участкам. Для каждого
              участка — конкретные приёмы, материалы и условия, которые влияют
              на выбор решения.
            </p>
            <nav className="solution-zone-nav" aria-label="Участки объекта">
              {solution.zones.map((zone, index) => (
                <a href={`#zone-${index + 1}`} key={zone.title}>
                  {zone.title}
                  <ArrowRight aria-hidden="true" />
                </a>
              ))}
            </nav>
            {solution.zones.map((zone, index) => (
              <article
                className="solution-zone"
                id={`zone-${index + 1}`}
                key={zone.title}
              >
                <h3>{zone.title}</h3>
                <p className="solution-zone-lead">{zone.description}</p>
                <div className="solution-techniques">
                  {zone.techniques.map((technique) => (
                    <section key={technique.title}>
                      <h4>{technique.title}</h4>
                      <p>{technique.description}</p>
                      <dl>
                        <div>
                          <dt>Материалы и исполнение</dt>
                          <dd>{technique.materials}</dd>
                        </div>
                        <div>
                          <dt>Что учесть</dt>
                          <dd>{technique.considerations}</dd>
                        </div>
                      </dl>
                    </section>
                  ))}
                </div>
              </article>
            ))}
          </section>
          <section id="products" aria-labelledby="products-title">
            <h2 id="products-title">Подходящие продукты и технологии</h2>
            <p className="solution-section-intro">
              Откройте продукт, чтобы подробнее изучить его устройство, варианты
              исполнения, применение и подготовку к изготовлению.
            </p>
            <ul className="solution-products">
              {products.map((entry) => (
                <li key={entry.slug}>
                  <a href={publicPath(catalogHref(entry.slug))}>
                    <figure>
                      <CatalogImage entry={entry} />
                      <figcaption>
                        {entry.imageKind === "project"
                          ? "Выполненная работа RPK.KZ"
                          : "Иллюстрация технологии"}
                      </figcaption>
                    </figure>
                    <h3>{readableHeading(entry.title)}</h3>
                    <p>{entry.summary}</p>
                    <span>
                      Открыть описание <ArrowRight aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <section id="brief" aria-labelledby="brief-title">
            <h2 id="brief-title">Что подготовить перед обсуждением</h2>
            <p className="solution-section-intro">
              Эти материалы помогут перейти от общей идеи к конкретному составу
              работ. Точные размеры, основания, крепления и доступ к
              коммуникациям уточняют на объекте.
            </p>
            <ul className="solution-brief">
              {solution.brief.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section id="process" aria-labelledby="process-title">
            <h2 id="process-title">Как выстроить работу</h2>
            <ol className="catalog-process">
              {solution.process.map((step, index) => (
                <li key={step.title}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section id="questions" aria-labelledby="questions-title">
            <h2 id="questions-title">Частые вопросы</h2>
            <div className="catalog-questions">
              {solution.faq.map((item) => (
                <article key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
      {projects.length ? (
        <section
          className="solution-projects"
          aria-labelledby="solution-projects-title"
        >
          <h2 id="solution-projects-title">Примеры выполненных работ</h2>
          <div className="solution-project-grid">
            {projects.map((project) => (
              <article key={project.id}>
                <PublicImage src={project.image} alt={project.title} />
                <h3>{project.title}</h3>
                <p>{project.text}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      <section
        className="catalog-project-cta"
        id="contact"
        aria-labelledby="solution-contact-title"
      >
        <div>
          <h2 id="solution-contact-title">
            Соберём решение для вашего объекта
          </h2>
          <p>
            Пришлите фото, план и задачи из списка выше. Обсудим приоритетные
            зоны, материалы, графику и состав проекта.
          </p>
        </div>
        <div className="catalog-cta-actions">
          <a
            className="primary-button"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Обсудить проект в WhatsApp</span>
            <ArrowRight aria-hidden="true" />
          </a>
          <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}>
            <Phone aria-hidden="true" />
            {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`}>
            <Mail aria-hidden="true" />
            {contact.email}
          </a>
          <a href={publicPath("/#portfolio")}>Все выполненные работы</a>
        </div>
      </section>
      <section
        className="catalog-related"
        aria-labelledby="solution-related-title"
      >
        <h2 id="solution-related-title">Другие типы объектов</h2>
        <ul>
          {related.map((entry) => (
            <li key={entry.slug}>
              <a href={publicPath(solutionHref(entry.slug))}>
                <figure className="catalog-related-media">
                  <SolutionImage image={entry.image} title={entry.title} />
                  <figcaption>Иллюстрация</figcaption>
                </figure>
                <h3>{entry.title}</h3>
                <p>{entry.summary}</p>
                <span>
                  Решения для объекта <ArrowRight aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a className="catalog-back-link" href={publicPath("/solutions")}>
          <ArrowLeft aria-hidden="true" />
          Все типы объектов
        </a>
      </section>
    </article>
  );
}
