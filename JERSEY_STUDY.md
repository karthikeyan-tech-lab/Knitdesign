# Plain single jersey reference study

User reference, 31 October 2026: plain single jersey; 30 Ne, 100% cotton, finished fabric (confirmed by the user); machine 24G; yarn length 30 cm for 100 needles. This gives 30 × 10 / 100 = 3.0 mm per stitch, assuming that yarn-length reading covers 100 formed stitches. Gauge is machine needle spacing, not measured finished WPI.

Two supplied front/back photographs guide visual review only. They are not stored in the app or repository and are not used as image textures. Neither photograph includes a dimensional scale. The user confirmed finished density as 30 WPI and 42 CPI: wale spacing = 25.4 / 30 = 0.8467 mm; course spacing = 25.4 / 42 = 0.6048 mm. No yarn diameter was inferred. Yarn count system, composition and finished condition were explicitly confirmed by the user; the exact finishing process remains unrecorded.

## Try the study

Choose **Plain jersey · all knit** in Starting design. Enable **Use plain jersey geometry study**. Select **One yarn colour** and choose a light colour to compare with the reference. Swatch and garment views use the new geometry; Yarn detail and Loop structure retain their existing renderer.

The study is optional and starts on with an all-knit, single-colour light cotton preview for a fresh browser. Existing saved designs restore their original settings; older JSON designs restore with the study off. Adding T or M automatically uses the original preview without changing or removing the design. Rendering is deterministic and uses bounded repeat tiles. The checkbox is included in JSON and autosave; older JSON files load with it off. The offline shell includes jersey.js and has a new cache version.

## What changed

jersey.js defines a continuous, periodic three-dimensional yarn centreline, fitted to a sampled length of 3 mm per stitch while keeping wale pitch 25.4/30 mm and course pitch 25.4/42 mm fixed. A bounded binary search adjusts head height; it rejects loop lengths too short for this curve family. Adjacent needles have matching course endpoints and aligned tangent directions. Narrower crowns and raised legs put the V-shaped legs in front of the crown on the technical face; the same geometry exposes the crowns and sinker connections on the back. Course-wide periodic micro displacement replaces per-needle jitter, so neighbouring yarn endpoints are not pulled apart in the render. Front and back project the same coordinates from opposite sides, using a depth buffer and rounded tube surface shading, soft contact shadows, procedural strand variation and fine surface fibres. The existing magnifier and garment use these computed textures. Bounded tiles keep rendering work independent of the visible swatch size.

This is an initial geometric study, not a physically relaxed, collision-validated knitted model. Depth and effective yarn diameter remain appearance estimates. Measured centreline pitches and sampled arc length are fitted constraints, not independently predicted values. Course spacing is fixed while the jersey study is active. Normalizing centreline length does not predict finished density. The 30 Ne and 24G values are reference metadata; they do not silently determine yarn diameter or fabric CPI/WPI. The current image is not yet a validated visual match to the photographs.

## Validation

Run `node tests/jersey.cjs` with the development dependency @napi-rs/canvas available. Tests check the 3 mm conversion, invalid inputs, sampled path length, matching course endpoints and tangent alignment, deterministic texture output, all-knit gating, distinct faces, garment cache invalidation, mixed-pattern fallback and maximum 32 × 24 repeats. All passed in the development environment. All application JavaScript passed `node --check`. A generated swatch was visually inspected.

Browser validation completed on 31 October 2026 using the managed development preview in Chrome. All 21 checks in `tests/browser.html` passed: fresh measured-study state, 390px layout, canvas rendering, colour-order balance in both renderers, front/back and zoom, tuck fallback, Undo, miss cam grouping, autosave reload, JSON export/import, PNG export, garment reverse, all view modes, maximum 32×24 repeat, maximum-repeat narrow layout, 1280px layout, and synchronous fallback. The tests verify download data, not native file dialogs. The narrow frame checks responsive layout, not performance on an actual phone. The HTTP development preview does not support service-worker installation; HTTPS/offline behavior and the existing Playwright PWA/editor suites remain unverified. No production merge or access change was performed. Vercel has automatically created a protected PR preview.

## Next calibration inputs

Yarn count system (Ne), composition (100% cotton) and condition (finished) are confirmed. Record ply and the finishing process. Finished 30 WPI and 42 CPI are now recorded as calibration targets. The geometry now fits measured spacing and 3 mm sampled arc length jointly. Mechanical relaxation, contact validation, true yarn diameter and objective photographic matching remain outstanding. Obtain front/back close-ups next to a ruler. Those measurements are calibration observations, not values predicted by this version.

## Loop-shape refinement

The supplied front and back photos were visually reviewed again. The revised geometry reduces the triangular mesh appearance and emphasizes vertical V-shaped wales on the face and curved bumps on the reverse. This is a qualitative comparison: the photos have no ruler and are not registered to matching stitch counts, so no numerical image-match accuracy is claimed. The measured pitches and 3 mm sampled length remain constrained. Depth, diameter, contact ordering and finishing effects still need physical validation.

To repeat the browser checks, copy `tests/browser.html` into `dist/tests/browser.html`, serve `dist/`, then open `/tests/browser.html`. The harness uses temporary designs on the test origin and restores its previous autosave in its final cleanup. Do not run it on an origin containing important production designs.

## Colour order correction

Both renderers previously filled the space behind the loops using the first feeder colour, making an alternating two-colour jersey change overall colour balance when the order was swapped. The underlay now uses the mean of all active feeder colours, with feeder multiplicity retained. The collar uses the separate main/collar colour rather than the first feeder. Regression tests cover sky-blue/white and white/sky-blue on both faces and both renderers. The interior colour balance remains within one RGB level; exact edge pixels differ because the repeat begins on the other course.
