# Plain single jersey reference study

User reference, 31 October 2026: plain single jersey; yarn marked 30's; machine 24G; yarn length 30 cm for 100 needles. This gives 30 × 10 / 100 = 3.0 mm per stitch, assuming that yarn-length reading covers 100 formed stitches. Gauge is machine needle spacing, not measured finished WPI.

Two supplied front/back photographs guide visual review only. They are not stored in the app or repository and are not used as image textures. Neither photograph includes a dimensional scale. No CPI, WPI, yarn diameter, fibre composition, finishing condition, or yarn count system was inferred.

## Try the study

Choose **Plain jersey · all knit** in Starting design. Enable **Use plain jersey geometry study**. Select **One yarn colour** and choose a light colour to compare with the reference. Swatch and garment views use the new geometry; Yarn detail and Loop structure retain their existing renderer.

The study is optional and defaults off. Adding T or M automatically uses the original preview without changing or removing the design. The checkbox is included in JSON and autosave; older JSON files load with it off. The offline shell includes jersey.js and has a new cache version.

## What changed

jersey.js defines a continuous, periodic three-dimensional yarn centreline, normalized to a sampled length of 3 mm per stitch. Adjacent needles have matching course endpoints. Front and back project the same coordinates from opposite sides, with depth-ordered yarn strokes. The existing magnifier and garment use these computed textures. Bounded tiles keep rendering work independent of the visible swatch size.

This is an initial geometric study, not a physically relaxed, collision-validated knitted model. Loop proportions, depth, yarn thickness and course spacing are illustrative. Normalizing centreline length does not predict finished density. The 30's and 24G values are reference metadata; they do not silently determine yarn diameter or fabric CPI/WPI. The current image is not yet a validated visual match to the photographs.

## Validation

Run `node tests/jersey.cjs` with the development dependency @napi-rs/canvas available. Tests check the 3 mm conversion, invalid inputs, sampled path length, matching course endpoints, all-knit gating, distinct faces, garment cache invalidation, mixed-pattern fallback and maximum 32 × 24 repeats. All passed in the development environment. All application JavaScript passed `node --check`. A generated swatch was visually inspected.

Browser end-to-end tests were not run: the environment has Playwright but no browser executable. Existing `tests/pwa.cjs` and `tests/editor.cjs` must still run before release; add browser coverage for checkbox save/load, worker/main-thread parity, switching K/T/M designs and offline update. No production deployment or merge was performed.

## Next calibration inputs

Confirm the yarn count system (Ne or other), fibre composition, ply and whether the photographed sample is greige, relaxed, washed or finished. Obtain measured CPI and WPI in that same condition, with front/back close-ups next to a ruler. Those measurements are calibration observations, not values predicted by this version.
