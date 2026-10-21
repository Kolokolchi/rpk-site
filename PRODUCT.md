# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

RPK.KZ is the company website for advertising production and object branding in Almaty. The user requested a comprehensive technology catalog, separate explanatory pages and a complete rebrand using the supplied black/graphite/orange brand board.

## Capabilities and Constraints

- Next.js App Router website with 27 technology/product pages, a catalog overview and 12 detailed business-solution pages. Catalog entries must stay within advertising production, print, cut materials, light and frame construction; no inventory, certification or performance promise is inferred.
- Visitors can choose a technology, read its construction, use cases and benefits, view genuine completed projects and prepare a calculation request in WhatsApp.
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
- Current rebrand originals and generation manifests: `artifacts/rebrand/`.
- Expansion illustrations and exact generation prompts: `artifacts/solutions/`; their 14 standalone scenes are explicitly illustrative, distinct from the portfolio. Prior source versions are preserved in `artifacts/solutions/before-expansion/` with SHA-256 manifest.
- No original vector logo file was supplied; the new SVG is reconstructed from the user's raster board.

## Product Principles

Preserve the visitor's working route to a calculation request. Explain technologies concretely. Use factual project evidence. Label generated visualizations honestly. Retain reversible checkpoints before replacing the visual system.
