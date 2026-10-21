# Passenger minibus revision

The user supplied a white passenger-minibus reference on 2026-10-21. The interactive vehicle follows its soft body silhouette, long dark side windows, broad windshield, neutral white paint and small wheels. The garage environment and shared isometric projection remain in use. Text and uploaded artwork fit the white side panel below the windows and above the wheel arches.

`before/` contains the previous local source checkpoint. Final browser captures and the validation summary are retained alongside this file. The scene is authored as editable SVG geometry; the supplied reference images remain in the user's attachments.

The initial branding proportion is 240 × 50cm. Minimum/default/maximum geometry, custom artwork and long text were checked in the running browser. The branding surface stays in z86–118, below the windows at z120 and above the arches at z85. Each wheel has radius18 at z63 and meets the road at z45. Body and art planes retain the shared isometric axes.

Validation passed: production build and TypeScript, ESLint, Prettier, 26 unit tests, three browser tests covering every catalog model/context and its controls, plus the static GitHub Pages check of 42 routes, SVG upload, responsive layout, image URLs, canonical metadata and CSP. `after/` contains the default and extreme-size image captures. The final source hashes are recorded in `validation.json`.
