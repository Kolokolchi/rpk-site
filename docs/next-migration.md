# Next.js migration — 13 October 2026

The final scope incorporates the user's explicit removal of the entire browser editor. The result is a public Next.js 16.4 / React 19.3 site with strict TypeScript and source-managed content. It has no administrator route, account/session code, drafts, runtime content writes or uploads. GCS/Redis and the old Express/Vite runtime were removed.

## Architecture

- `src/app`: App Router pages, metadata, real 404s and read-only HTTP routes.
- `src/components/site`: reusable server-rendered sections, with client boundaries for the menu, catalog filters and project filters.
- `src/shared/site-content.json`: authoritative homepage/contact/project content, with recorded stable identities. Catalog metadata and detail copy remain typed source files.
- `src/server`: read-only content service, stable revision, bounded CSP reports and request security configuration. No cloud clients or writes.
- `src/styles`: preserved cascade organized into base, layout, catalog, fonts and identity.
- `public/assets`: unchanged asset payloads and provenance. Legacy logical source URLs resolve to public assets.

Technology details render in server HTML and are absent from the ordinary homepage client dependency graph. Production rendering uses a nonce per request; HTML/content API are no-store. Platform-level HTTP parsing/TLS/connection controls belong to Vercel.

## Verification

- Strict types, ESLint and Prettier pass.
- 20 Vitest tests and 3 Playwright production browser tests pass.
- All 24 technology routes return server-rendered content with canonical metadata and JSON-LD.
- Unknown routes, private files and administrative routes return 404; POST content returns 405.
- Menu/filter interactions work with production CSP; no hydration or browser console errors were observed.
- Responsive overflow checks cover 1440, 1100, 820, 600, 520, 390 and 380px.
- Six before/after screenshots have matching dimensions. Desktop home/catalog are pixel-identical; remaining differing-pixel fractions are below 0.04%.
- Dependency audit reports zero vulnerabilities; all 207 auditable packages have verified registry signatures, 92 have attestations.

The mechanical design detector reports inherited base-layer/token advisories. Independent review confirmed that the flagged legacy side border, radii/colors and atmosphere effects are superseded or hidden by the final identity cascade. They do not introduce a visual regression. The pinned identity was preserved.

Detailed screenshots, comparison metrics and validation artifacts are retained locally under `artifacts/migration/` and excluded from shipping/Git. The pre-migration backup contains 509 SHA-256-verified files; the original source is also preserved in the initial local Git commit. No deployment, hosting resources or working domains were changed.
