# Isometric catalog previews

Current browser evidence for the 27 individual catalog pages, captured on 2026-10-21. The homepage and catalog overview retain their navigation cards without models.

All scenes use equal-axis isometric projection: ground axes at 30° and 150°, vertical height, matching architecture, furniture, machinery and physical artwork faces. Each task has a distinct environment that stays visible throughout assembly. The four steps affect only the named product parts.

`facades-isometric.png`, `objects-isometric.png` and `production-isometric.png` collect all scenes. The `context-*.png` files are their full-size originals. From the repository root, `node artifacts/product-preview/build-isometric-review.mjs` rebuilds the contact sheets. `desktop-artwork-workspace.png` shows an uploaded SVG and its placement controls; `projecting-custom-artwork.png` shows rotation and round clipping. `neon-before-light.png` and `neon-after-light.png` confirm stable surroundings while illumination changes.

Artwork accepts PNG, JPG, WebP and SVG up to 8 MiB, 12,000px per side and 40 megapixels. Contain/cover, scaling, offsets, quarter-turn rotation and placement reset share the same helper across scene families. Files stay in browser memory. Invalid replacements preserve the existing image. SVG cleanup removes active content and external dependencies while preserving CSS color priorities. PDF/AI/CDR/EPS need an SVG or PNG export; this is an illustrative preview rather than a production-file submission.

Validation: TypeScript, ESLint, formatting, 26 unit tests, the production build and 23 browser regression tests passed. After final scene-margin adjustments, another seven browser tests passed, including every context and the five artwork tests. Exported SVG colors were checked as actual pixels. Earlier source snapshots and intermediate images remain in the local project archive.
