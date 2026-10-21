import { extraCatalogIndex } from "./catalog-extra-index";

// Shared, small catalog metadata. Detailed page content loads only on a catalog page.
export const catalogGroups = [
  { id: "signs", title: "Вывески и свет", description: "Название и логотип, которые помогают найти ваш бизнес." },
  { id: "structures", title: "Рекламные конструкции", description: "Заметные ориентиры на здании и территории." },
  { id: "print", title: "Печать и плёнки", description: "Изображения и графика для улицы, стекла и транспорта." },
  { id: "spaces", title: "Оформление пространств", description: "Единый стиль фасада, интерьера и места продаж." },
  { id: "production", title: "Проект и производство", description: "Подготовка, изготовление деталей и установка." },
];

export const catalogIndex = [
  { slug: "channel-letters", group: "signs", title: "Объёмные буквы", summary: "Лицевое свечение, контражур и несветовое исполнение. Для фасада и интерьера.", image: "letter-cutaway", imageAlt: "Разрез объёмной буквы: акриловая лицевая панель, корпус, LED-модули и блок питания", imageCaption: "Иллюстрация типовой конструкции объёмной буквы", imageKind: "illustration" },
  { slug: "lightboxes", group: "signs", title: "Световые короба", summary: "Лайтбоксы с акрилом или натяжным лицом. Подсветка всей рекламной поверхности.", image: "lightbox", imageAlt: "Световой короб в разборе с лицевой панелью и внутренними светодиодами", imageCaption: "Иллюстрация устройства светового короба", imageKind: "illustration" },
  { slug: "projecting-signs", group: "signs", title: "Панель-кронштейны", summary: "Двусторонние вывески поперёк фасада. Видны вдоль улицы и торгового ряда.", image: "projecting-panel", imageAlt: "Круглая двусторонняя вывеска на металлических кронштейнах", imageCaption: "Иллюстрация круглого панель-кронштейна", imageKind: "illustration" },
  { slug: "neon-signs", group: "signs", title: "Неоновые вывески", summary: "Гибкий LED-неон и стеклянный неон. Световые линии, надписи и акценты.", image: "neon", imageAlt: "Гибкий светодиодный неон на акриловой основе с разрезом рассеивателя", imageCaption: "Иллюстрация конструкции гибкого LED-неона", imageKind: "illustration" },
  { slug: "non-illuminated-signs", group: "signs", title: "Несветовые вывески", summary: "Плоские буквы, панели и металлические логотипы. Чёткое оформление без внутренней подсветки.", image: "flat-metal-letters", imageAlt: "Плоские металлические буквы без подсветки и скрытые крепления", imageCaption: "Иллюстрация несветового металлического знака", imageKind: "illustration" },
  { slug: "roof-signs", group: "structures", title: "Крышные установки", summary: "Крупные буквы и логотипы на отдельном каркасе. Ориентир на уровне крыши.", image: "roof-sign", imageAlt: "Угловой световой логотип на крыше современного здания", imageCaption: "Визуализация крышной установки с фирменным логотипом", imageKind: "illustration" },
  { slug: "pylons", group: "structures", title: "Стелы и пилоны", summary: "Отдельно стоящие конструкции. Название объекта, арендаторы и направление въезда.", image: "pylon", imageAlt: "Пилон в разрезе: облицовка, металлический каркас и основание", imageCaption: "Иллюстрация устройства рекламного пилона", imageKind: "illustration" },
  { slug: "billboards", group: "structures", title: "Щиты и баннерные рамы", summary: "Крупные рекламные поверхности со сменным изображением. Для дорог и территории.", image: "banner-frame", imageAlt: "Рекламный щит с баннером, рамой, люверсами и натяжением", imageCaption: "Иллюстрация щита с баннерным полотном", imageKind: "illustration" },
  { slug: "city-formats", group: "structures", title: "Сити-форматы и остановки", summary: "Реклама и информация рядом с пешеходом. Сменные постеры и оформление остановочных комплексов.", image: "city-light", imageAlt: "Сити-лайт со сменным постером за защитной панелью", imageCaption: "Иллюстрация устройства сити-формата", imageKind: "illustration" },
  { slug: "pavement-signs", group: "structures", title: "Штендеры", summary: "Переносные двусторонние панели. Меню, акции и обозначение входа рядом с посетителем.", image: "a-frame", imageAlt: "Складной двусторонний штендер с рамой, панелями и ограничителем раскрытия", imageCaption: "Иллюстрация устройства складного штендера", imageKind: "illustration" },
  { slug: "banner-printing", group: "print", title: "Баннерная печать", summary: "Баннер, сетка и материалы для подсветки. Крупная графика с обработкой краёв.", image: "banner-materials", imageAlt: "Рулон баннера с печатью, усиленный край с люверсами и рекламная сетка", imageCaption: "Иллюстрация материалов для баннерной печати", imageKind: "illustration" },
  { slug: "vinyl-graphics", group: "print", title: "Плёнки и плоттерная резка", summary: "Цветные надписи, логотипы и печатные наклейки. Для гладких поверхностей и вывесок.", image: "vinyl-cutting", imageAlt: "Плоттерная резка плёнки, выборка лишнего материала и монтажный слой", imageCaption: "Иллюстрация изготовления плёночной графики", imageKind: "illustration" },
  { slug: "window-graphics", group: "print", title: "Оформление витрин", summary: "Рекламная, матовая и перфорированная плёнка. Графика с нужной прозрачностью.", image: "window-film", imageAlt: "Витринное стекло с цветной, матовой и перфорированной плёнкой", imageCaption: "Иллюстрация вариантов оформления стекла", imageKind: "illustration" },
  { slug: "uv-printing", group: "print", title: "УФ-печать", summary: "Изображение прямо на жёстком материале. Таблички, панели и рекламные элементы.", image: "uv-printing", imageAlt: "УФ-принтер наносит изображение на жёсткую панель", imageCaption: "Иллюстрация прямой УФ-печати", imageKind: "illustration" },
  { slug: "vehicle-branding", group: "print", title: "Брендирование транспорта", summary: "От логотипа на двери до полной оклейки. Фирменная графика на кузове.", image: "vehicle-wrap", imageAlt: "Фургон с частичной оклейкой и видимым краем виниловой плёнки", imageCaption: "Иллюстрация брендирования автомобиля", imageKind: "illustration" },
  { slug: "facades-and-entrances", group: "spaces", title: "Фасады и входные группы", summary: "Порталы, козырьки, облицовка и свет. Вход в едином стиле с вывеской.", image: "entrance-portal", imageAlt: "Входной портал с облицовкой, козырьком и световой линией", imageCaption: "Иллюстрация оформления входной группы", imageKind: "illustration" },
  { slug: "wayfinding", group: "spaces", title: "Навигация и таблички", summary: "Указатели, адресные таблички и информационные стенды. Понятные маршруты внутри и снаружи.", image: "wayfinding-system", imageAlt: "Указатели, подвесная панель и табличка в единой визуальной системе", imageCaption: "Иллюстрация навигационной системы", imageKind: "illustration" },
  { slug: "interior-branding", group: "spaces", title: "Интерьерное брендирование", summary: "Логотипы, стены, световые панели и оформление зон. Бренд внутри пространства.", image: "interior-logo", imageAlt: "Интерьерный металлический логотип с контражурной подсветкой за ресепшеном", imageCaption: "Иллюстрация интерьерного брендирования", imageKind: "illustration" },
  { slug: "retail-and-pos", group: "spaces", title: "Торговые островки и POS", summary: "Островки, дисплеи, стойки и рекламные элементы. Оформление места продажи.", image: "retail-island", imageAlt: "Графитовый торговый островок с витриной, POS-стойкой и оранжевыми рекламными панелями", imageCaption: "Иллюстрация торгового островка и оформления места продажи", imageKind: "illustration" },
  { slug: "exhibition-stands", group: "spaces", title: "Стенды и промостойки", summary: "Модульные стенды, roll-up, пресс-воллы и стойки. Для выставок и событий.", image: "exhibition-stand", imageAlt: "Модульный выставочный стенд с тканевой графикой и стойкой", imageCaption: "Иллюстрация модульного выставочного стенда", imageKind: "illustration" },
  { slug: "design-and-engineering", group: "production", title: "Дизайн и проектирование", summary: "Макет на объекте, материалы и конструкция. Подготовка решения к производству.", image: "design-workbench", imageAlt: "Чертежи вывески, образцы материалов и инструменты на проектном столе", imageCaption: "Иллюстрация подготовки рекламного проекта", imageKind: "illustration" },
  { slug: "cnc-and-laser", group: "production", title: "Фрезеровка и лазерная резка", summary: "Буквы, панели, детали и гравировка. Точная обработка по цифровому контуру.", image: "cnc-laser", imageAlt: "Фрезерная обработка панели и готовые акриловые детали", imageCaption: "Иллюстрация обработки рекламных деталей", imageKind: "illustration" },
  { slug: "metal-fabrication", group: "production", title: "Металлоконструкции", summary: "Каркасы, рамы, опоры и кронштейны. Несущая основа рекламного изделия.", image: "steel-frame", imageAlt: "Металлический каркас рекламной конструкции с раскосами и монтажными пластинами", imageCaption: "Иллюстрация изготовления несущего каркаса", imageKind: "illustration" },
  { slug: "installation-and-service", group: "production", title: "Монтаж и обслуживание", summary: "Установка, проверка, ремонт и обновление графики. Работа с готовой конструкцией.", image: "sign-installation", imageAlt: "Монтажник закрепляет вывеску на подготовленной металлической системе", imageCaption: "Иллюстрация монтажа рекламного изделия", imageKind: "illustration" },
  ...extraCatalogIndex,
];

export function catalogHref(slug: string) {
  return `/catalog/${slug}`;
}

export function findCatalogEntry(pathname = "") {
  const match = /^\/catalog\/([a-z0-9-]+)\/?$/.exec(pathname);
  return match ? catalogIndex.find((entry) => entry.slug === match[1]) : undefined;
}

export type CatalogEntry = (typeof catalogIndex)[number];
