---
version: 1
slug: "src-app-tsx"
primary_target: "src/components/site/HomePage.tsx"
related_targets: ["src/catalog/CatalogPage.tsx","src/catalog/CatalogIndex.tsx"]
---

# Full RPK rebrand

Mode: Persuade for the homepage, Experience for project evidence, Read for the catalog and technical pages.

## Direction contract

THESIS: RPK's visual identity comes from the supplied brand board: production competence expressed through an angular monogram, graphite materials and a precise orange diagonal.

OWN-WORLD: Black and graphite are the page ground; white Montserrat carries the hierarchy; #FF8A00 carries actions and deliberate diagonal accents. The new identity replaces the paper/condensed-type world throughout every route and state.

MATERIAL: The later user-pinned stationery image at `artifacts/rebrand/reference/graphite-stationery-identity.png` makes matte graphite, folded inserts and restrained orange edges explicit. The existing physical graphite plate appears on selected logo, proof/highlight, intro, contact/CTA and footer surfaces; long article text, project evidence and operating controls retain clear fields. This extends OWN-WORLD without changing its palette or typography.

STORY: A visitor recognizes the company, chooses a technology or object, understands application and advantages, sees real work and prepares a context-specific request. No added price or production promises.

FIRST VIEWPORT: A full-width dusk architectural visual, white two-line «Больше / чем реклама», an immediately usable orange calculation action and the exact angular brand mark. The service description makes the offer and Almaty context explicit.

FORM: User-selected brand board, source key `pinned-user-reference-4d6859d5`. The supplied identity is the confirmed direction; original product requirements and subsequent image corrections remain binding.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Coverage includes all homepage sections, catalog cards and filters, all 24 explanatory pages and related images, header/footer, contact controls, loading, errors, metadata and responsive/keyboard/reduced-motion states. Old and new asset versions remain in verified backups.

## Current implementation constraint

Next.js App Router serves public pages. The user removed the editor entirely: do not recreate an admin route, login, browser drafts, uploads or content mutation API. Apply targeted changes to repository JSON/TypeScript/assets and publish by deployment.
