import CatalogIndex from "../../catalog/CatalogIndex";

export default function CatalogOverview() {
  return (
    <section
      className="catalog-overview"
      id="services"
      aria-labelledby="catalog-overview-title"
    >
      <nav className="catalog-breadcrumbs" aria-label="Путь по сайту">
        <a href="/">Главная</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Каталог</span>
      </nav>
      <div className="section-heading">
        <h1 id="catalog-overview-title">
          Наружная реклама
          <br />и оформление объектов
        </h1>
        <p className="section-description">
          Выберите вид работ. На каждой странице — устройство, варианты
          исполнения, применение и преимущества.
        </p>
      </div>
      <CatalogIndex headingLevel={2} />
    </section>
  );
}
