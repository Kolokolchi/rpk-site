# RPK.KZ

Company website on Next.js 16.4 App Router, React 19.3 and Node.js 24.x. Application code uses strict TypeScript. The public black/graphite/orange identity, local Montserrat and genuine portfolio photographs are preserved. The catalog contains 30 product/technology pages; 12 business-solution pages explain object zones, problems, practical techniques, materials and product choices.

## Content and structure

The browser editor has been completely removed. `/admin` and `/api/admin/*` return 404; `/api/content` is read-only. Old `?admin=1` links display the ordinary public page. The application has no login, browser drafts, content mutation endpoint or image upload endpoint.

Make targeted changes in:

- `src/shared/site-content.json`: homepage text, contacts, portfolio, clients and footer. Keep the recorded UUIDs; add a new UUID for a new portfolio/client item.
- `src/shared/catalog-index.ts`: catalog names, summaries, groups and image metadata.
- `src/catalog/catalog-content.ts`: explanatory technology pages.
- `src/catalog/catalog-extra.ts` and `src/shared/catalog-extra-index.ts`: POSM and five additional product directions.
- `src/shared/solution-index.ts`, `src/solutions/solutions-a.ts`, `src/solutions/solutions-b.ts`: object cards and detailed business solutions.
- `src/solutions/`: server-rendered object overview, zone descriptions and cross-links to product pages.
- `src/components/site/`: page structure and public interactions.
- `src/styles/`: base, layout, catalog, fonts and identity layers, in that import order.
- `public/assets/`: deployed images, fonts and logos. URL manifests live in `src/assets/*.ts`.

Content is validated with a shared Zod schema and published as part of each build. Changes take effect on the next deployment. GCS, Redis, database accounts and editor secrets are not required. `data/site-content.json` is retained only as a legacy local copy and is not read by the application.

Legacy logical image references such as `/src/assets/projects/*.jpg` are resolved to deployed `/assets/...` URLs. The original `src/assets` binaries and historical `artifacts/` records remain as development archives. Do not re-encode shipping images without restoring their provenance metadata afterwards.

New solution/product illustrations are recorded in `artifacts/solutions/generated-images.json`, with saved originals and responsive 480/960/1536px WebP assets under `public/assets/solutions/`. `node scripts/prepare-solution-images.mjs` regenerates this set. Each image is labeled as an illustration in the interface. See `docs/object-solutions.md` for scope and `docs/catalog-expansion-research.md` for primary references. `/sitemap.xml` lists every public overview and detail page.

## Development

```text
npm ci
npm run dev
```

Open `http://localhost:3000`. Copy `.env.example` to `.env.local` only if origin settings need to be changed. Existing `ADMIN_*` and `CONTENT_STORAGE` variables have no effect; remove them from hosting configuration when preparing a new deployment.

To inspect a production build locally:

```text
npm run build
npm run preview
```

`preview` binds to 127.0.0.1, sets a guarded local origin and does not publish anything.

## Validation

```text
npm run typecheck
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm run verify` runs all code/browser checks. `npm run security:check` also runs production dependency auditing and registry signature checks. Browser tests use a separate local production server on port 3100.

## Hosting and rollback

See `HOSTING.md` for Vercel configuration and `SECURITY.md` for the current read-only security model. No cloud resources or domains were changed by this migration.

The verified pre-migration backup is `D:\Anti-Gravity\RPK-backups\RPK-before-next-migration-2026-10-13` (509 files, SHA-256 manifest). Local Git preserves the original application and migration checkpoints. Credentials, dependencies, builds and logs are excluded from the backup. Source content and media were preserved separately from the previously ignored runtime data.
