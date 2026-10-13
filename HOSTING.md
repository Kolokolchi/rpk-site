# Размещение RPK.KZ на Vercel

Проект использует Next.js App Router, React 19.3 и Node.js 24.x. Редактор удалён полностью. Данные публикуются из файлов проекта; постоянное хранилище, GCS, Redis и административные секреты не нужны.

## Настройки проекта

- Framework preset: Next.js.
- Node.js version: 24.x.
- Install command: `npm ci`.
- Build command: `npm run typecheck && npm run lint && npm test && npm run build`.
- Output directory: стандартный Next.js (не задавать `dist`).
- Production `PUBLIC_ORIGIN`: `https://www.rpk.kz`.
- `ALLOWED_HOSTS`: только точные дополнительные имена, например `rpk.kz`.

Preview использует собственный HTTPS origin. При его настройке укажите точный origin/hostname размещения; канонические ссылки должны соответствовать этому окружению. Не включайте Preview origin в production без необходимости. `RPK_LOCAL_PREVIEW` предназначен только для localhost и запрещён на Vercel.

Next.js генерирует страницы динамически для CSP с уникальным nonce. HTML и `/api/content` имеют no-store; статические ресурсы Next.js используют штатное кэширование. HTTPS, HTTP parser, размеры заголовков и таймауты соединений контролирует платформа Vercel. Приложение не заявляет старые настройки Express как собственные гарантии.

## Обновление данных

1. Внести точечные изменения в `src/shared/site-content.json`, каталог, компоненты или публичные assets.
2. Выполнить `npm run verify` и `npm run security:check` перед выпуском.
3. Зафиксировать изменения в Git.
4. Создать размещение обычным способом в Vercel.

Runtime не записывает контент. `/admin`, административное API, загрузки и восстановление черновиков отсутствуют. Не переносите старые `ADMIN_*`, GCS или Redis secrets в новый проект.

## Проверка размещения

Проверить главную, каталог и прямой вход на все 24 технологии; canonical/OG/JSON-LD; отсутствие ошибок hydration/CSP; изображения и шрифты; настоящий 404 для неизвестных путей и `/admin`; 405 для POST `/api/content`; отказ чужого Host.

Смена рабочего домена и создание облачных ресурсов не выполнялись. Откат — предыдущий Git commit и предыдущий Deployment в Vercel; исходный проверенный файловый backup сохранён отдельно.

## GitHub Pages

Публичная версия: https://kolokolchi.github.io/rpk-site/
Исходники: https://github.com/Kolokolchi/rpk-site/tree/nextjs

`npm run build:pages` создаёт изолированную статическую сборку в `artifacts/migration/pages-build/out`. `npm run verify:pages` проверяет маршруты, assets, CSP, меню и фильтры. Ветка `gh-pages` содержит только эту готовую сборку; Pages публикует её корень. Для очередного обновления нужно собрать и проверить новый export, затем обновить ветку публикации.

Основная сборка `npm run build` по-прежнему использует SSR/Vercel. В export HTTP API и proxy отсутствуют; контент фиксируется при сборке. CSP для inline scripts устанавливается через SHA-256 hashes в HTML meta. GitHub Pages не позволяет задавать собственные HTTP security headers, поэтому framing controls из SSR-версии доступны только на серверном размещении. Админки и операций записи нет в обоих режимах.
