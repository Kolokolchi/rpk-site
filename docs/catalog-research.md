# RPK catalog research — 9 October 2026

The catalog covers 24 directions of signage and advertising production in five groups, following the company's confirmed service scope. It describes typical technology, decision criteria and use cases. It does not establish that RPK owns every listed machine, stocks specific manufacturers' materials or provides manufacturers' certifications and warranties. No prices, service-life promises or production deadlines were inferred from these sources.

The technology descriptions were written in Russian for this website, with original scenario explanations. They are not translations or copies of competitors' catalog text. Product-specific dimensions and warranty claims were not transferred to RPK.

## Primary references

- [International Sign Association: identification of sign types](https://signs.org/resources-training/signs101/identification-of-sign-types/) — building-mounted, projecting, roof, freestanding, digital and interior sign categories.
- [Gemini: fabricated metal face-lit overview](https://hub.geminimade.com/knowledge/fabricated-metal-face-lit-overview) — metal bodies, acrylic light-diffusing faces and LED face illumination.
- [Gemini: illuminated letters and logos](https://geminimade.com/signage/letters-logos/lit-signage/) — face, halo and other lit letter families.
- [Gemini: lit acrylic](https://geminimade.com/signage/letters-logos/lit-signage/lit-acrylic/) — indoor and outdoor options, face, side and halo effects.
- [PLEXIGLAS: LED sheet materials](https://www.plexiglas.de/en/products/plexiglas/plexiglas-led) — light transmission and diffusion for illuminated signage.
- [SloanLED: FlexiBRITE24](https://sloanled.com/collection/architectural/border-tubing-accent/flexibrite24-architectural/) — flexible LED tubing as a distinct neon-like technology.
- [3M: graphics and signage](https://www.3m.com/3M/en_US/graphics-signage-us/) — vehicle, wall, window and sign graphics applications.
- [3M: windows and glass](https://www.3m.com/3M/en_US/graphics-signage-us/applications/windows-and-glass/) — transparent and perforated window graphic options.
- [3M: vehicle-film support](https://www.3m.com/3M/en_US/car-personalization-us/support/) — selection, care and application considerations for automotive film systems.
- [ORAFOL: window graphics](https://www.orafol.com/en/americas/products/category/graphic-innovations-plotter-films-window-graphics) — cut-film and window graphic product families.
- [Roland DG: signmaking](https://www.rolanddga.com/en/applications/signmaking) — sign, banner, print-and-cut, retail display and trade-show applications.
- [Roland DG: UV printing](https://www.rolanddg.com/industry/uv-printing-for-industry) — direct decoration of compatible materials using UV printing.
- [Mimaki: media by application](https://mimaki.com/supply/media/) — banner, backlit and other sign/display media families.
- [Trotec: acrylic processing](https://www.troteclaser.com/en/laserable-materials/laser-cutting-acrylic) — acrylic cutting and engraving for signs and displays.
- [Trotec: unsuitable laser materials](https://www.troteclaser.com/en-ca/resources/faqs/unsuitable-materials-laser-processing) — PVC is unsuitable for this laser processing, rather than a universally laser-compatible advertising plastic.
- [ALUCOBOND: routing and folding](https://media.alucobond.com/pdf/alucobond/processing/alucobond-processing-ti-en.pdf) — CNC routing and fabrication of compatible composite panels.
- [Display Wizard: display systems](https://www.displaywizard.co.uk/) — roll-up banners, modular displays and exhibition stands.

Engineering decisions for foundations, rooftop systems, supports and electrical installation are described as project-specific. Catalog illustrations explain composition, not dimensioned construction or installation instructions.

- [Display Wizard: pavement signs](https://www.displaywizard.co.uk/pavement-signs/) — portable panels, frames and replaceable graphics.

## Images

The existing RPK portfolio supplies genuine project photographs. The current workspace contains 27 generic illustrations generated with the built-in `image_gen` tool: 23 distinct technology images and four distinct object-type illustrations. Each generated illustration is captioned as an illustration. The catalog has 24 unique images (23 illustrations and the existing Needstop photograph).

The listing follows the user's supplied four-column image-card reference. Every work card opens its own detail page. Group buttons filter the list. The same technology illustration appears on its card and corresponding detail page, while different work cards use different images. Homepage photos and illustrations are distinct across the hero, catalog, object types, introduction, production and portfolio. Repeated brand logos are separate from this image audit.

- Optimized responsive deliverables: `src/assets/catalog/` (480, 960 and 1536 px WebP).
- Original generated PNGs: `artifacts/catalog/originals/`.
- Exact final prompts, source paths and mode: `artifacts/catalog/generated-assets-v2.json`.
- Rebuild responsive assets from saved originals/source files with `node scripts/prepare-catalog-images.js`.

## Content and routes

- `catalog-index.js`: groups, summaries, image metadata and stable URL slugs.
- `src/catalog/catalog-content.ts`: 24 complete descriptions and related technologies.
- `src/catalog/CatalogPage.tsx`: consistent detail-page structure.
- `catalog-html.js`: route-specific production HTML metadata and root asset resolution.
- Every work link opens `/catalog/<slug>` using normal browser navigation. `/catalog` is the full overview.
- Unknown catalog slugs return HTTP 404 in production. Existing private API and source paths retain their security controls.
- `src/catalog/catalog-cards.css`: the image-card grid and its 4 / 3 / 2 / 1-column responsive layouts.

## Version checkpoints

- Before the expanded catalog: `D:\Anti-Gravity\RPK-backups\RPK-before-technology-catalog-2026-10-09_18-22-41` (107 verified files).
- Before converting the grouped listing into the requested image-card grid: `D:\Anti-Gravity\RPK-backups\RPK-before-catalog-cards-2026-10-09_19-40-40` (208 verified files, including the earlier tested build and original illustrations).

Browser proof, responsive checks and the image audit are saved in `artifacts/catalog/`. Catalog metadata uniqueness and image bytes are also checked by the test suite.

Every detail page also shows the three corresponding images in its related-solutions section. Related slugs are unique and exclude the current technology, so the hero image does not repeat in that section.

The existing homepage title and contact details still use the authenticated inline editor. The expanded technology catalog is maintained in the files above, outside the original four-card CMS schema.
