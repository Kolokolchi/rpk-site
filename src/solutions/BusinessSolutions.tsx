import { ArrowRight } from "lucide-react";
import { solutionHref, solutionIndex } from "../shared/solution-index";
import { publicPath } from "../shared/public-path";
import SolutionImage from "./SolutionImage";
import ExpandableGrid from "../components/site/ExpandableGrid";

export default function BusinessSolutions({
  overview = false,
}: {
  overview?: boolean;
}) {
  const Heading = overview ? "h1" : "h2";
  return (
    <section
      className="objects-section section-transition reveal-on-scroll"
      id="objects"
      aria-labelledby="objects-title"
    >
      {overview ? (
        <nav className="catalog-breadcrumbs" aria-label="Путь по сайту">
          <a href={publicPath("/")}>Главная</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Для вашего объекта</span>
        </nav>
      ) : null}
      <div className="section-heading">
        <Heading id="objects-title">
          У каждого бизнеса
          <br />
          своя точка притяжения.
        </Heading>
        <p className="section-description">
          Выберите свой тип объекта. Внутри — разбор фасада, входа, интерьера и
          места продаж: какие проблемы возникают, чем их решить и какие
          материалы и приёмы подойдут.
        </p>
      </div>
      <ExpandableGrid className="object-grid" preview={!overview}>
        {solutionIndex.map((entry) => (
          <a
            className="object-card"
            key={entry.slug}
            href={publicPath(solutionHref(entry.slug))}
          >
            <div className="object-card-image">
              <SolutionImage image={entry.image} title={entry.title} />
              <small className="object-image-note">Иллюстрация</small>
            </div>
            <div className="object-card-copy">
              <h3>{entry.title}</h3>
              <p>{entry.summary}</p>
              <span className="object-card-action">
                Решения для объекта <ArrowRight aria-hidden="true" />
              </span>
            </div>
          </a>
        ))}
      </ExpandableGrid>
    </section>
  );
}
