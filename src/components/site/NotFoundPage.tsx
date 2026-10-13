import { ArrowRight } from "lucide-react";
import { publicPath } from "../../shared/public-path";

export default function NotFoundPage() {
  return (
    <section className="brand-not-found" aria-labelledby="not-found-title">
      <span className="error-number" aria-hidden="true">
        404
      </span>
      <h1 id="not-found-title">Страница не найдена</h1>
      <p>
        Возможно, ссылка изменилась. Выберите нужную технологию в каталоге или
        вернитесь на главную.
      </p>
      <a className="primary-button" href={publicPath("/catalog")}>
        <span>Открыть каталог</span>
        <ArrowRight aria-hidden="true" />
      </a>
    </section>
  );
}
