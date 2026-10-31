# Plain single jersey reference study

User reference, 31 October 2026: plain single jersey; 30 Ne, 100% cotton, finished fabric (confirmed by the user); machine 24G; yarn length 30 cm for 100 needles. This gives 30 × 10 / 100 = 3.0 mm per stitch, assuming that yarn-length reading covers 100 formed stitches. Gauge is machine needle spacing, not measured finished WPI.

Two supplied front/back photographs guide visual review only. They are not stored in the app or repository and are not used as image textures. Neither photograph includes a dimensional scale. The user confirmed finished density as 30 WPI and 42 CPI: wale spacing = 25.4 / 30 = 0.8467 mm; course spacing = 25.4 / 42 = 0.6048 mm. No yarn diameter was inferred. Yarn count system, composition and finished condition were explicitly confirmed by the user; the exact finishing process remains unrecorded.

## Try the study

Choose **Plain jersey · all knit** in Starting design. Enable **Use plain jersey geometry study**. Select **One yarn colour** and choose a light colour to compare with the reference. Swatch and garment views use the new geometry; Yarn detail and Loop structure retain their existing renderer.

The study is optional and starts on with an all-knit, single-colour light cotton preview for a fresh browser. Existing saved designs restore their original settings; older JSON designs restore with the study off. Adding T or M automatically uses the original preview without changing or removing the design. Rendering is deterministic and uses bounded repeat tiles. The checkbox is included in JSON and autosave; older JSON files load with it off. The offline shell includes jersey.js and has a new cache version.

## What changed

jersey.js defines a continuous, periodic three-dimensional yarn centreline, fitted to a sampled length of 3 mm per stitch while keeping wale pitch 25.4/30 mm and course pitch 25.4/42 mm fixed. A bounded binary search adjusts head height; it rejects loop lengths too short for this curve family. Adjacent needles have matching course endpoints. Front and back project the same coordinates from opposite sides, using a depth buffer and rounded tube surface shading, soft contact shadows, procedural strand variation and fine surface fibres. The existing magnifier and garment use these computed textures. Bounded tiles keep rendering work independent of the visible swatch size.

This is an initial geometric study, not a physically relaxed, collision-validated knitted model. Depth and effective yarn diameter remain appearance estimates. Measured centreline pitches and sampled arc length are fitted constraints, not independently predicted values. Course spacing is fixed while the jersey study is active. Normalizing centreline length does not predict finished density. The 30 Ne and 24G values are reference metadata; they do not silently determine yarn diameter or fabric CPI/WPI. The current image is not yet a validated visual match to the photographs.

## Validation

Run `node tests/jersey.cjs` with the development dependency @napi-rs/canvas available. Tests check the 3 mm conversion, invalid inputs, sampled path length, matching course endpoints, all-knit gating, distinct faces, garment cache invalidation, mixed-pattern fallback and maximum 32 × 24 repeats. All passed in the development environment. All application JavaScript passed `node --check`. A generated swatch was visually inspected.

Browser end-to-end tests were not run: the environment has Playwright but no browser executable. Existing `tests/pwa.cjs` and `tests/editor.cjs` must still run before release; add browser coverage for checkbox save/load, worker/main-thread parity, switching K/T/M designs and offline update. No production deployment or merge was performed.

## Next calibration inputs

Yarn count system (Ne), composition (100% cotton) and condition (finished) are confirmed. Record ply and the finishing process. Finished 30 WPI and 42 CPI are now recorded as calibration targets. The geometry now fits measured spacing and 3 mm sampled arc length jointly. Mechanical relaxation, contact validation, true yarn diameter and objective photographic matching remain outstanding. Obtain front/back close-ups next to a ruler. Those measurements are calibration observations, not values predicted by this version.
