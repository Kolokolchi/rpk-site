# Vehicle side and hood artwork

The vehicle preview now has two independent editing zones: the entire side and the curved hood. Each retains its own text, color, uploaded file, sizing, fit, position and rotation. “На всю поверхность” restores full coverage. The side’s “С окнами” checkbox includes or excludes both side glazing shapes; wheel arches, lamps and mirrors keep their physical silhouettes. Transparent image areas preserve the underlying glazing.

The hood uses one continuous inclined artwork viewport clipped to the exact curved hood outline. The garage and road stay unchanged during assembly and editing. Uploads remain local to the browser, and replacing/removing one zone’s file preserves the other zone’s object URL.

Validation: production build and static Pages export; ESLint; 26 unit tests; four Playwright scenarios covering all 27 catalog scenes, stable contexts, independent vehicle editing/uploads/reset, window coverage and a 390px phone. Pages verification checks routes, assets, sitemap, canonical URLs, CSP and client controls.

The build and npm audit also reported existing Next.js 16.4.0 advisories, with 16.4.2 offered as a patched version. Dependency upgrading is a separate maintenance item. The static export was finalized using the repository’s existing CSP/export logic after retrying the underlying build without recreating its staging directory.

Visual evidence: `both-text.png`, `both-artwork.png`, `desktop.png`, `mobile.png`. The live published result is captured separately after deployment.
