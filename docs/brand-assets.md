# RPK brand assets — 13 October 2026

The chosen visual system is the user's brand board at
`C:/Users/Kolok/.codex/attachments/4d6859d5-ef7c-4bcd-bec2-eaf9468cdac1/image-1.png`.
The `Doc` directory was empty when checked. No original AI, EPS, CDR or SVG logo
was supplied in the project.

The project preserves that board at `artifacts/rebrand/reference/brand-board.png`
and the later matte graphite stationery reference at
`artifacts/rebrand/reference/graphite-stationery-identity.png`. The latter
governs the folded inserts and restrained orange edges now applied by
`src/brand-graphite.css`. These inserts reuse the existing generated
`src/assets/brand/brand-material-{480,960,1600}.webp` asset family; they are not
new photographs. Its prompt/output history is in
`artifacts/rebrand/manifest-brand-scenes.json`. Native provenance remains
inside the shipping rasters; WebP also has the CLI compatibility sidecar.

## Logo reconstruction

The monogram follows the large logo in the top-left panel of the supplied board:
angular R/P forms, the K lower leg, and the long orange diagonal wedge. It is a
manual vector reconstruction of the supplied raster silhouette, rather than an
independently redesigned symbol. Raster resolution limits the precision of its
coordinates. An original vector can replace these assets without changing the
interface.

- `src/assets/brand/rpk-logo-light.svg`: white/orange mark for dark backgrounds.
- `src/assets/brand/rpk-logo-dark.svg`: black/orange mark for light backgrounds.
- `src/assets/brand/rpk-favicon.svg`: the white/orange mark on a black square.

Both main logos have a transparent background and the same `212 × 81` view box.
Their artwork contains paths only, so rendering does not depend on an installed
font. Use the mark at about 116–140 px wide in the navigation and preserve clear
space of at least 12 px. At small sizes, place the company descriptor as normal
HTML text in Montserrat, rather than embedding illegible text inside an image.
Recommended image alt: `РПК — рекламно-производственная компания`.

## Palette

| Role | Reference value |
| --- | --- |
| Black | `#000000` |
| Graphite | `#2A2A2A` |
| White | `#FFFFFF` |
| Orange | `#FF8A00` |

Orange with black text has a calculated WCAG contrast ratio of approximately
8.89:1; orange with white text has approximately 2.36:1. Use black text on orange
buttons. The diagonal wedge is the main graphic motif; keep it geometric and
use it sparingly so it does not obscure content.

## Montserrat

The board specifies Montserrat Regular, Semibold and Bold. Local variable WOFF2
subsets support weights 100–900. Use 400 for body text, 600 for controls and 700
for headings. `fonts.css` declares the internal family name `Montserrat`, normal
style, local URLs, `font-display: swap` and the subset Unicode ranges.

- `Montserrat-Variable-Cyrillic.woff2`: Russian Cyrillic and the numero sign.
- `Montserrat-Variable-CyrillicExt.woff2`: extended Cyrillic, including Kazakh letters.
- `Montserrat-Variable-Latin.woff2`: Latin, punctuation, digits and common symbols.
- `OFL-Montserrat.txt`: the complete SIL Open Font License 1.1 and copyright notice.

Import `./assets/brand/fonts.css` from `src/main.tsx` before the site stylesheet.
Use `font-family: 'Montserrat', Arial, sans-serif`. The three subsets total
88,152 bytes; no runtime Google Fonts request is needed.

For the predominantly Russian first screen, preload the Cyrillic subset in the
Vite HTML entry. Vite will replace its source URL with the emitted hashed asset:

```html
<link rel="preload" href="/src/assets/brand/Montserrat-Variable-Cyrillic.woff2" as="font" type="font/woff2" crossorigin>
```

### Official sources

Retrieved on 10 October 2026:

- [Montserrat source and licensing](https://github.com/google/fonts/tree/main/ofl/montserrat).
- [Google Fonts CSS API response](https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap), requested with a modern Chromium user agent.
- [Latin variable WOFF2](https://fonts.gstatic.com/s/montserrat/v31/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2).
- [Cyrillic variable WOFF2](https://fonts.gstatic.com/s/montserrat/v31/JTUSjIg1_i6t8kCHKm459W1hyzbi.woff2).
- [Cyrillic-ext variable WOFF2](https://fonts.gstatic.com/s/montserrat/v31/JTUSjIg1_i6t8kCHKm459WRhyzbi.woff2).
- [OFL copyright and license](https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/OFL.txt).

The installed Windows Montserrat TTF set was found at
`C:/Users/Kolok/AppData/Local/Microsoft/Windows/Fonts`, but the shipped web assets
were obtained from the official URLs above, alongside their license.

## Open Graph identity card

`public/og.svg` is a new self-contained 1200 × 630 vector identity card in the
same black/graphite/white/orange system. It reuses the existing paths directly
from `src/assets/brand/rpk-logo-light.svg`. It does not introduce a different mark
or embed a generated photograph. `public/og.png` is the exact Sharp raster export
of that SVG, also 1200 × 630.

The card contains the supplied message `БОЛЬШЕ / ЧЕМ РЕКЛАМА`, the descriptor
`Рекламно-производственная компания`, `Идеи / Материалы / Результат`, and `rpk.kz`.
Actual glyph outlines were extracted from the installed Montserrat TTF files
with [opentype.js](https://github.com/opentypejs/opentype.js) 1.3.4 (loaded in memory
from its documented jsDelivr CDN). The exported SVG has no live text/font or
bitmap dependencies; its typography is vector paths. Neither the browser nor
Sharp can substitute Arial during rendering.

The source TTF files are in
`C:/Users/Kolok/AppData/Local/Microsoft/Windows/Fonts`:

| Source file | Typeface role | Source SHA256 |
| --- | --- | --- |
| `Montserrat-Bold.ttf` | Headline, weight 700 | `98b1486810c2eccfaa17d4610a83c12794c0798ef5e9eb41aea038794292a187` |
| `Montserrat-SemiBold.ttf` | Brand principles and URL, weight 600 | `e23dc6d21070d45a1840c2b8217fc17ddd8a502a4db652748ec2f40d3603dc2d` |
| `Montserrat-Regular.ttf` | Company descriptor, weight 400 | `c3fb0280e4339f6c70cea42b8b432c6fb17fde130fbb12e9209c7cdfa79d976f` |

Validation: font family metadata and OS/2 weight classes checked; all required
characters present; outlines remain inside the composition's safe area; SVG
renders successfully; the PNG is byte-identical to a fresh Sharp SVG export;
PNG dimensions verified at 1200 × 630. The previous OG bitmap remains in the
verified pre-rebrand backup.
