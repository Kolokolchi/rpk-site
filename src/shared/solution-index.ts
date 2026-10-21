export const solutionIndex = [
  {
    slug: "retail",
    title: "Магазины и торговые точки",
    summary:
      "Фасад, витрина и навигация торгового зала: поможем заметить магазин, найти нужный отдел и сориентироваться.",
    image: "object-retail",
  },
  {
    slug: "food",
    title: "Кафе и рестораны",
    summary:
      "Вывеска, вход, меню и интерьер: единый образ заведения на каждом шаге гостя.",
    image: "object-food",
  },
  {
    slug: "interior",
    title: "Офисы и бизнес-центры",
    summary:
      "Логотипы, ресепшен, переговорные и навигация: понятное деловое пространство.",
    image: "object-interior",
  },
  {
    slug: "campus",
    title: "Кампусы и учреждения",
    summary:
      "От въезда до нужного кабинета: система ориентиров, указателей и информационных стендов.",
    image: "object-campus",
  },
  {
    slug: "healthcare",
    title: "Клиники и аптеки",
    summary:
      "Заметный вход, понятные маршруты, приватность стекла и спокойное оформление зоны ожидания.",
    image: "object-healthcare",
  },
  {
    slug: "hospitality",
    title: "Отели и апарт-отели",
    summary:
      "Встреча гостя, ресепшен, этажи и сервисные зоны в согласованной системе оформления.",
    image: "object-hospitality",
  },
  {
    slug: "fitness",
    title: "Фитнес и спортивные клубы",
    summary:
      "Узнаваемый фасад, маршруты к тренировочным зонам, графика и оформление стойки продаж.",
    image: "object-fitness",
  },
  {
    slug: "beauty",
    title: "Салоны и студии услуг",
    summary:
      "Вывеска, витрина, рабочие зоны и выкладка: аккуратная идентичность без визуального шума.",
    image: "object-beauty",
  },
  {
    slug: "automotive",
    title: "АЗС и автосервисы",
    summary:
      "Ориентиры на подъезде, обозначение постов, информационные панели и оформление сервиса.",
    image: "object-automotive",
  },
  {
    slug: "industrial",
    title: "Производство и склады",
    summary:
      "Фасадная идентификация, въезд, погрузочные зоны, таблички и маркировка маршрутов.",
    image: "object-industrial",
  },
  {
    slug: "residential",
    title: "Жилые комплексы и девелопмент",
    summary:
      "Адресные знаки, навигация двора, оформление входов и коммуникация в офисе продаж.",
    image: "object-residential",
  },
  {
    slug: "events",
    title: "Выставки и мероприятия",
    summary:
      "Стенды, регистрация, бренд-зоны и временная навигация для целостного события.",
    image: "object-events",
  },
] as const;

export type SolutionMeta = (typeof solutionIndex)[number];
export function solutionHref(slug: string) {
  return `/solutions/${slug}`;
}
export function findSolutionEntry(pathname: string) {
  const match = /^\/solutions\/([a-z0-9-]+)\/?$/.exec(pathname);
  return match
    ? solutionIndex.find((entry) => entry.slug === match[1])
    : undefined;
}
