# Knit Loop Studio V1.3 — complete source handoff

A browser app for textile knitting design: paint Knit / Tuck / Miss actions, derive cam tracks, and view an approximate fabric illustration.

## Run it

No packages, API keys, build step or account are required for this exported copy.

1. Extract the ZIP.
2. Open a terminal in this folder.
3. Run `python -m http.server 8000 --directory dist` (or `python3` instead of `python`).
4. Open http://localhost:8000 in a browser.

You can also open dist/index.html directly. A local web server is recommended for consistent file handling and browser storage.

## What is included

- dist/index.html: layout, labels, CSS, and script loading.
- dist/app.js: design state, symbol brushes, grid sizing, painting, undo, persistence, cam grouping, controls, JSON save/load and PNG export.
- dist/renderer.js: procedural Canvas 2D yarn/loop renderer and front/back swatch illustration.
- CODEX_HANDOFF.md: ready-to-use task for the next Codex session.
- TECHNICAL_NOTES.md: structure, knitting rules, limitations and performance investigation.
- examples/: two saved design JSON examples.
- SOURCE_MANIFEST.json: source identity and SHA-256 checksums.

## Use

Set feeders and needles, then click Apply size. New custom design fills the current size with knit stitches. Select a brush and click/drag across cells. Symbols are this app's display convention: V = K (knit), arch = T (tuck), dash = M (miss). Rows are feeders, columns are needle positions. The grid supports 2–24 needles and 2–32 feeders.

Cam settings group needles whose entire feeder-action sequences match. Cam rows are tracks; columns are feeders. Track grouping is a logical compatibility check, not full machine validation. Select the number of machine tracks to see whether the sequence grouping exceeds the limit.

Fabric swatch, Yarn detail and Loop structure are three views. The swatch supports front/back selection, feeder yarn colours and a detail magnifier. Surface relief and feeder highlighting apply only to loop views.

Save design downloads a JSON; Load saved design restores it. Export PNG exports the active canvas. Current design/colours also save in browser localStorage on that origin. Existing saved designs in the hosted site are not inside this ZIP: use Save design on that site and load that JSON into the new app. Undo history is session-only and concerns the stitch grid, not every visual setting.

## Publish

Deploy the CONTENTS of dist/ to any static host, or set the host's publish directory to dist. There is no build command. For a packaged desktop/mobile/PWA app, let Codex select the packaging approach with you. The exported copy does not include the hosted site's ChatGPT sign-in gate. A new deployment's access settings must be configured separately.

## Status

This is a source snapshot of V1.3, not an optimized release. The user reports that the hosted site hangs. That symptom has not been profiled or fixed in this ZIP. Start with the performance work in CODEX_HANDOFF.md. The existing site was not changed by creating this export.
