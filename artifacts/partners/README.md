# Partner logos

Installed on 2026-10-15 in the homepage `#clients` section.

The user's follow-ups replace the tall grid with one 92px-high logo row and add manual mouse/touch dragging. The strip moves continuously right-to-left at 20.4px/s, with a 240s seamless loop over the 24 brands. It pauses on fine-pointer hover, visible keyboard focus, its pause button, or a drag. Manual dragging seeks the current animation phase in either direction; releasing resumes from the new position while preserving an explicit pause. Horizontal wheel input, Shift + wheel and keyboard arrows are supported. Vertical page scrolling and pinch zoom remain available. The repeated visual group is hidden from assistive technology and inert. Reduced-motion users receive native touch scrolling and mouse dragging. There are no repeated visible captions; each original image retains its accessible brand name. On phones the pause control keeps its accessible name and 44px touch target while showing only its icon. All unique logo images load when the row approaches the viewport to avoid blank logos during reverse dragging.

The user supplied `Doc/партнеры.cdr.zip` and confirmed replacing the previous eight company names with the 24 brands in that document. `previous-clients.json` preserves the earlier list; Energo University's UUID was retained. `manifest.json` records every deployed file, dimensions, size and SHA-256, plus the original archive's checksum. The original archive was not edited.

## Conversion and optimization

The archive is itself a ZIP-based CorelDRAW 27 document, rather than a ZIP containing a CDR. Installed CorelDRAW 26 could not open it directly. A disposable copy was opened after changing only its `content/root.dat` version identifiers from CDRU/2700/27 to CDRT/2600/26. The page geometry and embedded image streams were unchanged. Individual complete logo selections were exported through CorelDRAW's native SVG filter. The results were compared against the archive's embedded thumbnail; an independent visual review found all 24 marks intact.

- 22 logos remain entirely vector SVG, with outlined lettering and no font dependency.
- Energo University remains SVG with original vector lettering and its original embedded gradient image, resized from 960px to 640px and compressed as palette PNG.
- Family Park was a bitmap placed inside the source document. Its visible crop was extracted from the 12992 × 18898px embedded PNG, resized to 640 × 331px and encoded as WebP (22,256 bytes). No approximate vector was substituted.
- SVG metadata/editor namespaces were removed and coordinates optimized with SVGO 4.0.0. Line Brew's intricate crest remains vector.
- Total deployed assets: 687,330 bytes; approximately 307,110 bytes if individually gzip-compressed. Transfer compression depends on hosting.
- All SVG resources are self-contained; no scripts, remote references, or external fonts are required.

Actual Optic, Herbalife, МИРТЕК and AlinEX have white fills in the supplied source. Their site panels use graphite; all other logo panels are white. This preserves the supplied variants without recoloring. Original and optimized versions were compared on the appropriate background.

## Name and identity checks

All 24 logos were matched to the original thumbnail. Ambiguous identities were also checked against official sources:

- [МИРТЕК](https://mirtekgroup.kz/ru): the first angled stroke belongs to its stylized М; the name is not «ИМИРТЕК».
- [Ankor](https://ankor.life/): matching leaf/drop mark; the supplied outline variant is retained.
- [IMC](https://imcalmaty.kz/): matching International Medical Center emblem; the supplied blue stacked variant is retained.
- [I'm](https://im.kz/): matching yellow wordmark with red heart.
- [Fawori / Alina Group](https://alina.kz/brends/): verified brand spelling.
- [Basilic](https://basilic.kz/offer), [Cosmart](https://cosmart.kz/), [Compass](https://compass.express/ru), [Actual Optic](https://actualoptic.kz/): verified names.

The supplied variants remain the source of visual truth; this check does not assert that every mark is the newest brand revision.

## Verification

- TypeScript, ESLint and production build passed. All 8 browser tests passed, including 5 new gesture tests in `e2e/partner-marquee.spec.ts`. The unchanged unit suite's 22 tests passed during asset integration.
- Desktop (1440px) and phone (390px): all logo images decode, exactly 24 original items are exposed to assistive technology, all marks remain in one 92px-high row, no horizontal page overflow, and no browser errors.
- Runtime checks confirm slow leftward movement, hover/button/keyboard pause and resume, identical 4896px repeat groups, a seamless loop boundary, and keyboard scrolling with reduced motion.
- Gesture tests verify mouse dragging in both directions, reverse wrapping at the cycle boundary, resumed autoplay, retained explicit pause, horizontal wheel input, vertical page scrolling and reduced-motion mouse dragging. Chromium CDP touch emulation checks horizontal swipes and vertical page panning; physical phone feel has not been measured.
- `clients-1440.png` / `clients-390.png` show the final site section; `contact-sheet.png` shows all assets; `thumbnail.png` is the supplied document preview.
- The Impeccable detector was run once for each implementation. The compact heading's new size role is recorded in `DESIGN.md`; other warnings concern existing typography/design-system values elsewhere in `identity.css`.

Temporary Corel copies, raw exports and external comparison files are ignored locally. They are not deployed.
