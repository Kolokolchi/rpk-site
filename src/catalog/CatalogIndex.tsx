"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import {
  catalogGroups,
  catalogHref,
  catalogIndex,
} from "../shared/catalog-index";
import { publicPath } from "../shared/public-path";
import { readableHeading } from "../shared/typography";
import CatalogImage from "./CatalogImage";

export default function CatalogIndex({
  headingLevel = 3,
}: {
  headingLevel?: 2 | 3;
}) {
  const [activeGroup, setActiveGroup] = useState("all");
  const ItemHeading = headingLevel === 2 ? "h2" : "h3";
  const entries =
    activeGroup === "all"
      ? catalogIndex
      : catalogIndex.filter((entry) => entry.group === activeGroup);
  return (
    <div className="catalog-index">
      <nav
        className="catalog-group-nav"
        aria-label="Фильтр каталога по направлению"
      >
        <button
          type="button"
          aria-pressed={activeGroup === "all"}
          onClick={() => setActiveGroup("all")}
        >
          Все направления
        </button>
        {catalogGroups.map((group) => (
          <button
            key={group.id}
            type="button"
            aria-pressed={activeGroup === group.id}
            onClick={() => setActiveGroup(group.id)}
          >
            {group.title}
          </button>
        ))}
      </nav>
      <p className="catalog-result-count" role="status" aria-live="polite">
        {activeGroup === "all"
          ? "Все направления"
          : catalogGroups.find((group) => group.id === activeGroup)?.title}
        : {entries.length}
      </p>
      <ul className="catalog-card-grid">
        {entries.map((entry) => {
          const group = catalogGroups.find((group) => group.id === entry.group);
          return (
            <li key={entry.slug}>
              <a
                className="catalog-card"
                href={publicPath(catalogHref(entry.slug))}
              >
                <figure className="catalog-card-media">
                  <CatalogImage
                    entry={entry}
                    sizes="(max-width: 520px) calc(100vw - 40px), (max-width: 1100px) 45vw, 25vw"
                  />
                  <figcaption>
                    {entry.imageKind === "project"
                      ? "Работа RPK.KZ"
                      : "Иллюстрация технологии"}
                  </figcaption>
                </figure>
                <div className="catalog-card-body">
                  <ItemHeading>{readableHeading(entry.title)}</ItemHeading>
                  <p className="catalog-card-category">{group?.title}</p>
                  <p className="catalog-card-description">{entry.summary}</p>
                  <div className="catalog-card-footer">
                    <span>Применение и плюсы</span>
                    <strong>
                      Подробнее <ArrowRight aria-hidden="true" />
                    </strong>
                  </div>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
