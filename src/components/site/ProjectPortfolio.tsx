"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import type { SiteContent } from "../../shared/content-schema";
import { bundledCatalogImages } from "../../assets/catalog-images";
import { PublicText, PublicImage, SectionAtmosphere } from "./primitives";
import { revealDelayClass } from "./site-utils";

const projectGroups = [
  {
    key: "retail",
    label: "Магазины",
    title: "Магазины и торговые точки",
    text: "Вывески, островки и оформление места продаж.",
    matches: /ритейл|торгов|магазин/i,
  },
  {
    key: "food",
    label: "Кафе и рестораны",
    title: "Кафе и рестораны",
    text: "Заметный фасад и узнаваемая входная группа.",
    matches: /horeca|общепит|ресторан|кафе/i,
  },
  {
    key: "interior",
    label: "Интерьеры",
    title: "Офисы и пространства",
    text: "Световые логотипы и брендирование интерьера.",
    matches: /интерьер|офис|пространств/i,
  },
  {
    key: "campus",
    label: "Кампусы",
    title: "Кампусы и учреждения",
    text: "Входные группы и навигация по территории.",
    matches: /кампус|университет|учрежден/i,
  },
] as const;

type ProjectFilter = "all" | (typeof projectGroups)[number]["key"];

export default function ProjectPortfolio({
  portfolio,
  title,
}: {
  portfolio: SiteContent["portfolio"];
  title: string;
}) {
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>("all");
  const availableProjectGroups = projectGroups.flatMap((group) => {
    const projects = portfolio.filter((project) =>
      group.matches.test(project.category),
    );
    return projects.length ? [{ ...group, projects }] : [];
  });
  const activeProjectGroup = availableProjectGroups.find(
    (group) => group.key === projectFilter,
  );
  const visibleProjectCount =
    activeProjectGroup?.projects.length ?? portfolio.length;
  return (
    <>
      {availableProjectGroups.length > 0 ? (
        <section
          className="objects-section section-transition reveal-on-scroll"
          id="objects"
          aria-labelledby="objects-title"
        >
          <div className="section-heading">
            <h2 id="objects-title">
              У каждого бизнеса
              <br />
              своя точка притяжения.
            </h2>
            <p className="section-description">
              Найдите свой тип объекта и посмотрите подходящие работы — от
              фасадной вывески до оформления пространства.
            </p>
          </div>
          <div className="object-grid">
            {availableProjectGroups.map((group) => {
              const image = bundledCatalogImages[`object-${group.key}`];
              return (
                <a
                  className="object-card"
                  key={group.key}
                  href="#portfolio"
                  onClick={() => setProjectFilter(group.key)}
                >
                  <div className="object-card-image">
                    <img
                      src={image?.src}
                      srcSet={image?.srcSet}
                      sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1100px) 45vw, 310px"
                      width={image?.width}
                      height={image?.height}
                      loading="lazy"
                      decoding="async"
                      alt={`Иллюстрация: ${group.title}`}
                    />
                    <small className="object-image-note">Иллюстрация</small>
                  </div>
                  <div className="object-card-copy">
                    <h3>{group.title}</h3>
                    <p>{group.text}</p>
                    <span className="object-card-action">
                      Смотреть работы <ArrowRight aria-hidden="true" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      ) : null}
      <section
        className="portfolio-section section-transition reveal-on-scroll"
        id="portfolio"
        tabIndex={-1}
        aria-labelledby="portfolio-title"
      >
        <SectionAtmosphere theme="portfolio" />
        <div className="section-heading">
          <PublicText as="h2" id="portfolio-title" value={title} />
          <p className="section-description">
            Реальные объекты, конструкции и материалы. Посмотрите, как наши
            решения выглядят после монтажа.
          </p>
        </div>

        {availableProjectGroups.length > 0 ? (
          <div
            className="project-filters"
            role="group"
            aria-label="Фильтр проектов по типу объекта"
          >
            <button
              type="button"
              aria-pressed={!activeProjectGroup}
              aria-controls="project-grid"
              onClick={() => setProjectFilter("all")}
            >
              Все работы <span>{portfolio.length}</span>
            </button>
            {availableProjectGroups.map((group) => (
              <button
                key={group.key}
                type="button"
                aria-pressed={activeProjectGroup?.key === group.key}
                aria-controls="project-grid"
                onClick={() => setProjectFilter(group.key)}
              >
                {group.label} <span>{group.projects.length}</span>
              </button>
            ))}
          </div>
        ) : null}
        <p className="project-count" role="status" aria-live="polite">
          Проектов: {visibleProjectCount} ·{" "}
          {activeProjectGroup?.label ?? "Все направления"}
        </p>

        <div
          className="portfolio-grid"
          id="project-grid"
          data-visible-count={visibleProjectCount}
        >
          {portfolio.map((project, index) => (
            <article
              className={`project-card reveal-on-scroll ${revealDelayClass(index)}`}
              key={project.id}
              hidden={Boolean(
                activeProjectGroup &&
                !activeProjectGroup.matches.test(project.category),
              )}
            >
              <PublicImage
                alt={project.title}
                className="project-media"
                sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1100px) 50vw, 620px"
                src={project.image}
              />
              <div className="project-card-content">
                <PublicText as="h3" value={project.title} />
                <PublicText as="p" value={project.category} />
                <PublicText as="span" value={project.text} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
