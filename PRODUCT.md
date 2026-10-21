# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

RPK.KZ is the company website for advertising production and object branding in Almaty. The user requested a comprehensive technology catalog, separate explanatory pages and a complete rebrand using the supplied black/graphite/orange brand board.

## Capabilities and Constraints

- Next.js App Router website with 27 technology/product pages, a catalog overview and 12 detailed business-solution pages. Catalog entries must stay within advertising production, print, cut materials, light and frame construction; no inventory, certification or performance promise is inferred.
- Visitors can choose a technology, read its construction, use cases and benefits, view genuine completed projects and prepare a calculation request in WhatsApp.
- Each of the 27 individual catalog pages has its own interactive axonometric application scene with staged assembly, an exploded view and relevant text, local image, color, proportion and light controls. Each task has a distinct application environment; furniture, landscape and surrounding architecture remain visible from the first stage. The final stage changes only the product according to its label, such as switching on neon illumination. The homepage and catalog overview retain their navigation cards without configurators. Uploaded images stay in browser memory; no files are sent to a server or saved as site content.
- Artwork preview accepts PNG, JPG, WebP and SVG up to 8 MiB (12,000px per side, 40 megapixels). Visitors can fit or crop, scale, move and rotate the artwork on its physical product face. Preparation guidance explains transparent backgrounds, outlined SVG fonts and exporting PDF/AI/CDR/EPS as SVG or PNG; production originals are agreed separately. Invalid replacements retain the existing artwork. Every model uses a shared equal-axis isometric projection with vertical height and ground axes at 30°/150°, following the user's architectural cutaway references.
- Visitors can also choose their business type and read problems, solutions and concrete techniques for every relevant object zone. Product links connect those tasks to the current catalog technologies. Each type has its own stable `/solutions/<slug>` page.
- Contact phone and email and portfolio evidence are preserved. The user explicitly removed the editor entirely: no administrator UI, authentication, browser drafts, content mutation or upload API may be exposed.
- Content and structure are changed directly in versioned JSON, TypeScript and public assets. Next.js deployments publish these changes; GCS and Redis are no longer required.
- User explicitly requires backup versions and distinct content images. Related previews use their corresponding technology images and exclude the current item.
- The user approved generated educational illustrations when suitable images are unavailable. They must remain distinct from genuine completed work.
- Exact equipment inventory, prices, warranties and delivery promises are not newly established by the rebrand.

## Brand Commitments

The user-provided board at `C:\Users\Kolok\.codex\attachments\4d6859d5-ef7c-4bcd-bec2-eaf9468cdac1\image-1.png` governs the new visual identity. It specifies an angular RPK monogram, the phrase «Больше чем реклама», and «Идеи / Материалы / Результат». The user rejected a generic oversized rooftop RPK letter model and requested a more coherent architectural illustration of real-scale rooftop letters or a logo.

The later stationery identity at `artifacts/rebrand/reference/graphite-stationery-identity.png` commits matte graphite stock, folded inserts and restrained orange edges. Selected brand, proof, intro, contact/CTA and footer surfaces carry that material; explanatory text, editor controls and genuine project photographs remain clear. This extends the same pinned identity.

## Evidence on Hand

- Published content: `src/shared/site-content.json`; `data/site-content.json` is an unused legacy local copy.
- Genuine portfolio photographs: `public/assets/projects/`; the earlier source rasters remain archived in `src/assets/projects/`.
- Technology descriptions: `src/catalog/catalog-content.ts`.
- Existing image provenance and originals: `artifacts/catalog/`.
- Retail/POS replacement illustration, original, exact prompt and responsive asset hashes: `artifacts/catalog/retail-pos-20261021/`. The catalog uses this illustration in place of its former project-photo card.
- Current rebrand originals and generation manifests: `artifacts/rebrand/`.
- Expansion illustrations and exact generation prompts: `artifacts/solutions/`; their 14 standalone scenes are explicitly illustrative, distinct from the portfolio. Prior source versions are preserved in `artifacts/solutions/before-expansion/` with SHA-256 manifest.
- No original vector logo file was supplied; the new SVG is reconstructed from the user's raster board.

## Product Principles

Preserve the visitor's working route to a calculation request. Explain technologies concretely. Use factual project evidence. Label generated visualizations honestly. Retain reversible checkpoints before replacing the visual system.
