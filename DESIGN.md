---
name: "RPK.KZ"
description: "Больше чем реклама — Идеи / Материалы / Результат"
colors:
  orange: "#ff8a00"
  action-hover: "#ffad48"
  catalog-action-hover: "#ffad47"
  black: "#000000"
  near-black: "#080808"
  surface: "#141414"
  panel: "#202020"
  graphite: "#2a2a2a"
  white: "#ffffff"
  muted: "#afafaf"
  line: "#353535"
  material-line: "#454545"
  control-line: "#666666"
  material-muted: "#c6c6c6"
typography:
  display:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "clamp(44px, 5.4vw, 80px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "clamp(30px, 3.2vw, 46px)"
    fontWeight: 700
    lineHeight: 1.22
    letterSpacing: "-0.025em"
  catalog-display:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "clamp(32px, 4vw, 64px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  catalog-headline:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "clamp(28px, 2.8vw, 42px)"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.025em"
  illustration-caption:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.6
  partner-headline:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "clamp(24px, 2.5vw, 36px)"
    fontWeight: 700
    lineHeight: 1.22
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  card-title:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "clamp(20px, 1.65vw, 25px)"
    fontWeight: 700
    lineHeight: 1.28
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.8
  reading-body:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.85
  label:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.5
  action:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.5
  catalog-action:
    fontFamily: "Montserrat, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.6
rounded:
  square: "0px"
spacing:
  gutter: "clamp(20px, 4vw, 64px)"
  control-gap: "10px"
  card-inset: "22px"
  block-inset: "24px"
  content-gap: "30px"
  section: "92px"
  section-mobile: "62px"
components:
  button-primary:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.black}"
    typography: "{typography.action}"
    rounded: "{rounded.square}"
    padding: "15px 22px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
    textColor: "{colors.black}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.square}"
    padding: "12px 22px"
  button-secondary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.orange}"
  button-catalog:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.black}"
    typography: "{typography.catalog-action}"
    rounded: "{rounded.square}"
    padding: "14px 22px"
  button-catalog-hover:
    backgroundColor: "{colors.catalog-action-hover}"
    textColor: "{colors.black}"
  navigation-link:
    textColor: "{colors.white}"
    rounded: "{rounded.square}"
  category-filter:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "11px 16px"
  category-filter-hover:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.white}"
  category-filter-selected:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.black}"
  catalog-card-body:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.white}"
    rounded: "{rounded.square}"
    padding: "24px 22px 20px"
  catalog-card-hover:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.white}"
  article-navigation:
    textColor: "{colors.white}"
    padding: "10px 0"
---

# Design System: RPK.KZ

## Overview

**Creative North Star: "Идеи / Материалы / Результат"**

«Больше чем реклама» is expressed through the supplied angular RPK mark, white Montserrat, black ground and deliberate orange cuts. The character is precise and material: matte graphite, folded dark planes and rectangular controls. The original brand board and later stationery reference are the visual authority; the former warm paper/condensed-type theme and rejected oversized rooftop block letters are superseded.

The shipped system gives physical graphite a visible place in selected identity inserts while keeping articles, operating controls and genuine project photographs clear. Dusk architecture and educational imagery remain labeled visualizations. The SVG mark is a reconstruction of the supplied raster silhouette, not an original vector master.

**Key Characteristics:**

- Neutral black and graphite with one orange accent.
- Montserrat Regular, Semibold and Bold.
- Angular mark, slash, folded inserts and square controls.
- Flat reading surfaces with restrained material depth.

## Colors

The palette follows the supplied black/graphite/white/orange identity. Frontmatter records reusable values from the applied CSS; secondary and tertiary accent families do not exist.

### Primary

- **Orange** (`orange`): primary actions, logo wedge, selected filters, meaningful icons and keyboard focus. The two lighter action colors are existing homepage and catalog hover treatments.

### Neutral

- **Black / near-black** (`black`, `near-black`): page ground and header.
- **Graphite / panel / surface** (`graphite`, `panel`, `surface`): brand stock, selected inserts, inputs and card fields. The material raster contains its own neutral tonal variation.
- **White / muted / material-muted** (`white`, `muted`, `material-muted`): hierarchy, supporting copy and supporting text on graphite inserts.
- **Line / material-line / control-line** (`line`, `material-line`, `control-line`): article dividers, inserted plate boundaries and control strokes.

**The Orange Action Rule.** Orange-filled controls carry black text. Orange outlines and icons can sit on dark grounds; white text on an orange fill is not the action treatment.

## Typography

**Display and body font:** Montserrat, with Arial and sans-serif fallback. Local variable WOFF2 subsets cover Cyrillic, extended Cyrillic and Latin under SIL OFL 1.1; the normal build imports no Oswald face.

**Character:** broad, clear geometric lettering. Bold headings carry the identity; regular text explains the work; semibold labels support selection and operation. There is no mathematical type scale: the observed roles are independently sized for their surfaces.

### Hierarchy

- **Display:** homepage slogan, uppercase; `display` is the desktop role. At 1100/820/600px maximum widths it becomes `clamp(44px,6.2vw,68px)`, `clamp(42px,7.5vw,64px)` and `clamp(36px,10.2vw,54px)` respectively.
- **Headline:** homepage section headings; at 600px maximum width use `clamp(28px,7.3vw,36px)` with 1.25 leading.
- **Catalog display / headline:** article and overview titles versus section headings. At 600px maximum width they become `clamp(28px,7.3vw,42px)`/1.14 and `clamp(25px,6.5vw,32px)`/1.25.
- **Title / card title:** compact section and card headings. Catalog card headings remain uppercase; categories beneath them are ordinary sentence case.
- **Body / reading body:** common supporting text and article prose. Reading measure is at most 70ch; the article lead is 18px/1.8, reducing to 16px on phones. Initial article prose is 18px/1.8, reducing to 17px on phones.
- **Label / action / catalog action:** filters and two implemented action variants. Header navigation uses 600 weight at 10px with .04em tracking; this compact header setting is not a body-text role.

**The Three Weights Rule.** Use 400 for body copy, 600 for controls and 700 for headings. Do not restore the discarded condensed display face or introduce an extra-heavy catalog voice.

## Layout

Content is bounded by a 1320px maximum with the frontmatter gutter on both sides. The full-width hero uses that same inner alignment. Detail articles use a 1320px content area plus outer gutters; prose is independently limited to 70ch.

Homepage section padding is `section` through tablet widths and `section-mobile` at 600px maximum width. Desktop catalog grids have four columns with 24px row/20px column gaps; at 1100px they have three columns and 20px/18px gaps, at 820px two columns, and at 520px one column with 22px gaps. Related articles have three columns and become one at 600px.

The article reading grid is 216px navigation plus a flexible text column, with `clamp(36px,6vw,84px)` gap. At 1100px it uses 180px/36px; at 820px the navigation becomes a static wrapping list above the article. Header navigation becomes a menu at 1100px. The header is 92px on desktop; its 76px phone height retains the older 78px minimum at 521–600px and resolves to 76px at 520px and below. The 380px rule only reduces header inset and mark width.

Phone actions stack and fill their available width. Meaningful process and table-of-contents numbers preserve sequence/navigation; arbitrary card numbers are absent.

## Elevation & Depth

Cards, article sections and buttons use no box shadow. Depth comes from neutral tonal boundaries, the real graphite raster, orange edge cuts, clipped folds and the architectural image overlay. Selected inserts use the existing `brand-material-960.webp` through the last stylesheet in the cascade; ordinary reading fields remain flat.

The floating contact control has a soft `0 8px 24px rgba(0,0,0,.25)` shadow. This separates the fixed contact control from content and does not establish a general card-shadow style.

**The Material Insert Rule.** Use physical graphite on selected identity, proof, intro, contact/CTA and footer inserts. Preserve clear text fields and photographic evidence beside it.

The hero mark has the existing .7s `cubic-bezier(.16,1,.3,1)` entrance from 22px horizontal offset and .85 opacity. Controls use .18s ease; catalog states use .2s ease, with a 3px arrow shift. Reduced-motion rules remove the entrance, transitions and relevant transforms; content never relies on scroll reveals to become visible.

## Shapes

The reusable corner value is square. Strokes are usually one pixel; orange fold corners are clipped triangles. The hero mark plate uses `polygon(13% 0,100% 0,100% 100%,0 100%)`, with a separate orange diagonal edge. Graphite fold geometry is decorative and cannot cover text or intercept pointer input.

**The Angular Mark Rule.** Reuse the reconstructed SVG silhouette and its orange wedge. Do not replace it with ordinary RPK letters or a different symbol.

## Components

### Buttons

Direct and rectangular. Homepage primary actions use the frontmatter padding, a 52px minimum height and black text on orange; catalog actions use 54px minimum height, their separate padding and 600-weight type. Secondary actions use a one-pixel control stroke, white text, a retained underline beneath the label and orange hover text/stroke. Primary press moves one pixel down; reduced motion suppresses the catalog press movement.

Interactive controls generally use a 3px orange focus outline with 4px offset. Homepage buttons transition for .18s; catalog buttons for .2s. Hover never lifts the button or adds a shadow.

### Chips / filters

Category buttons are square surface-colored controls with 46px minimum height. Hover changes the boundary to orange and field to panel; `aria-pressed="true"` uses orange with black text. At 600px maximum width category padding becomes 10px 13px and type becomes 12px. Project filters use the same selected-color language.

### Cards / containers

Catalog cards combine a 1.5-ratio image, honest image caption, body and separated action line. Their body uses frontmatter padding and a desktop 306px minimum height. Hover/focus changes surface to panel and the stroke to orange while retaining white titles; supporting text brightens slightly. The action arrow moves 3px on hover. At 520px maximum width the body minimum height is removed and padding becomes 26px 22px 22px. Project photographs keep their genuine-evidence role.

### Navigation

Header links are compact white semibold labels, at least 44px tall, with orange hover and the common keyboard outline. The mobile menu has a near-black field and visible stroke. Article navigation has 46px minimum link height, 13px semibold labels and quiet tabular section numbers; it reflows above the article at 820px.

### Partner logos

The homepage client strip uses the 24 companies supplied in `Doc/партнеры.cdr.zip`, replacing the earlier text-only list at the user's request. Original brand shapes and colors are retained. The 22 vector marks and Energo University's vector/raster composite are optimized SVGs; the supplied Family Park bitmap is a 640px WebP. Assets and provenance are recorded in `artifacts/partners/manifest.json`.

At the user's request, partners occupy one compact row instead of a grid. Each 188 × 92px logo field has a 14px inset and a fixed 64px-high image with `object-fit: contain`. Fields are white except the supplied white-letter Actual Optic, Herbalife, МИРТЕК and AlinEX variants, which use the existing #141414 graphite. Image alt text identifies each company without repeated visible captions. Section padding is 54px per side, or 38px on phones; the heading uses `clamp(24px, 2.5vw, 36px)`.

Two identical flex groups, each with 16px gaps and trailing inset, create a seamless right-to-left CSS transform loop. The 240s linear cycle moves the 24 logos at 20.4px/s on both desktop and phones. Hover on a fine pointer, visible keyboard focus in the viewport, or the explicit pause button stops the track without resetting its position. Only the first group is exposed to assistive technology; the duplicate is inert. With reduced motion, the duplicate/control is hidden and the original row supports manual horizontal scrolling. No motion library or per-frame JavaScript is used for automatic movement.

Mouse and touch dragging seek the existing CSS animation playhead in either direction. A 6px horizontal-intent threshold separates dragging from vertical page panning. Pointer capture retains the gesture beyond the row, and release/cancellation restores the prior animation playback rate while preserving explicit pause. Positive modulo wraps the animation phase without a blank edge or reset. Horizontal trackpad input, Shift + wheel and keyboard arrows also move the row; ordinary vertical wheel input scrolls the page. `touch-action: pan-y pinch-zoom` preserves vertical scrolling and zoom; reduced motion uses native touch scrolling plus mouse-dragged `scrollLeft`. The surface uses grab/grabbing cursors and suppresses native image dragging. An IntersectionObserver loads all 24 unique logo URLs when the row comes within 300px of the viewport so backward dragging can reveal any logo immediately.

### Business solutions and expanded products

The existing «У каждого бизнеса своя точка притяжения» image-card block now covers 12 business types. Preserve its four/two/one-column responsive grid, graphite bodies, clear image area, uppercase 20px card headings and orange action line. Every complete card links directly to its `/solutions/<slug>` page; it no longer acts as a portfolio-filter shortcut. The separate genuine portfolio retains its working filters.

Business pages use the established reading layout: breadcrumb, two-column hero, sticky contents on desktop and a single reading column on phones. Each page contains four problem/solution explanations, four object zones with at least eight concrete techniques (the combined AЗС/autoservice page has a fifth fuel-station zone), material and selection notes, relevant product links, a six-item brief, four work stages and FAQ. Plain editorial rows and dividers organize the details; do not put nested cards around every paragraph. Technique subheadings use 18px/1.4 semibold Montserrat, and explanatory copy stays within 70ch.

The product catalog expands from 24 to 30 entries with POSM, menu boards, acrylic displays, brand/photo zones, information boards and stencils/marking. Each has its own image and full technology page. Four incumbent object illustrations remain; eight new object scenes and six new product images are separate standalone generations, optimized into 480/960/1536px WebP variants. All are labeled as illustrations and their exact prompts, original files and hashes are retained under `artifacts/solutions/`. Genuine project photographs are never relabeled as examples of unverified projects.

### Error fallback

The fatal-error fallback sits outside the branded shell and therefore has explicit Montserrat, black/white colors, zero button radius, orange hover and its own 3px/4px keyboard outline.

## Do's and Don'ts

### Do:

- **Do** keep the supplied black/graphite/white/orange identity and local Montserrat.
- **Do** use black text on orange actions and preserve visible keyboard focus.
- **Do** reuse the angular mark, physical graphite asset and restrained folded inserts.
- **Do** preserve measured reading widths and distinct catalog/route imagery.
- **Do** retain honest visualization labels and genuine project evidence.

### Don't:

- **Don't** restore the superseded warm paper theme or condensed display typography.
- **Don't** replace the mark with generic oversized rooftop block letters.
- **Don't** cover long-form copy or operating controls with decorative material.
- **Don't** turn ornamental kickers or arbitrary card indices into reusable system rules.
- **Don't** treat reconstructed SVGs as original masters or generated scenes as completed projects.

## Implementation after Next.js migration

The public design is preserved. Styles now load from `src/styles/base.css`, `layout.css`, `catalog.css`, `fonts.css`, then `identity.css`. The browser editor, login and all editing states have been removed at the user’s explicit request. Public content and structure are maintained directly in versioned source files.

## Responsive layout safeguards

Advantage cards have equal 29px insets on desktop and 25px insets at 820px and below, including the first card. Project descriptions retain their 27px inset when a filter leaves one project. Production image captions have 18px side and bottom insets.

The header has a 92px minimum height, reducing to 76px on phones; it can grow with enlarged text. Its mobile menu starts below the header and scrolls within the remaining viewport height. Decorative hero-panel copy is hidden at 820px and below, where the panel is partially outside the viewport.

Text can wrap long words, grid children can shrink within their columns, and process numbers do not shrink into the following text. Stacked production, contact, FAQ and ecosystem sections use zero-minimum grid tracks. The ecosystem map retains one column at 820px and below. Solution hero images declare their full single-column width at 601–820px so the browser selects a suitably sharp source.

`e2e/responsive.spec.ts` checks real element and text bounds, card insets, single-project filtering, short landscape menus, and simulated 200% text enlargement. `node scripts/audit-responsive.mjs` captures the 46-route, 12-width matrix under `test-results/responsive/`. The detector's generic font warnings are intentional exceptions: Montserrat is mandated by the pinned brand reference; Arial is the fallback in the inherited structural layer.
