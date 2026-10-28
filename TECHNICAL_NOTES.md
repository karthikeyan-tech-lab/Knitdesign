# Technical and domain notes

## Source snapshot

Original site: https://karthi-knit-loop-studio.wholeheron2048.chatgpt.site
Source commit: e1276d025aff1f60e18e2bed1029694e4accf29a
Version: V1.3
No backend, database, npm dependencies, external fonts or image texture assets are needed. The visual output is procedural Canvas 2D. Original reference images and company workbooks are not runtime dependencies and are not included. Git history, authentication tokens and provider-specific deployment identity are excluded.

## State

pattern is a rectangular array of K/T/M strings: pattern[feeder][needle]. yarns is an array of feeder colours. Main colour is used in solid-colour mode. Data JSON version 3 includes pattern, yarns, colourMode and color. Browser state key: knit-custom-v3; legacy knit-v1 contains a pattern array. JSON validation restricts size and accepted actions. Some view preferences are not part of saved JSON.

## Domain meaning

K: form a new loop through the loop(s) currently held.
T: retain the old loop and collect tuck yarn.
M: retain the old loop; the feeding yarn floats past that needle.
An established loop at every needle is assumed at the start. There is no cast-on simulation. Track groups are calculated from complete vertical needle action signatures. Identical signatures can share a track. This does not validate sinker actions, needle/cam mechanics, take-down, yarn tension or safe tuck/float limits.

## Renderers

renderSwatch: yarn detail or symbolic loop view. sequence tracks prior knit rows, accumulated tucks and next knit rows. Paths use Bezier samples, geometric elongation and layered strokes. This is not a verified yarn topology/contact solver.

renderFabricSheet: front/back swatch panels, pinked edges and circular magnifiers. makeTexture produces offscreen front/back canvases and caches the most recent texture pair using pattern, yarns, main colour, thickness and spacing. Magnifiers sample those calculated textures. The back is an illustrative construction, not a validated reverse view of a physically simulated fabric. The swatch uses different simplified geometry from Yarn detail; these two render paths should eventually share a consistent geometry model.

## Known visual limits

No physical relaxation, shrinkage, drape or actual yarn mechanics. Course spacing, thickness, zoom and relief are visual controls, not calibrated gauge/CPI/WPI/yarn-count/GSM inputs. Pattern repeats are cropped into the visible sample. No cylinder/dial double-bed model, transfer/racking, plating model, independent jacquard colour selection or machine-file generation. A fabric photo alone cannot establish its exact stitch instructions. The two-track origin of this demo does not make arbitrary custom designs knittable on two tracks.

## Reported hanging — investigation, not confirmed diagnosis

The user reports site hanging. No browser performance trace or device profile has been collected. Code paths worth profiling:

- Canvas pointermove calls draw() for every move over the magnifier, with no requestAnimationFrame scheduling.
- draw() also rewrites explanation/statistics/status DOM even for visual-only pointer changes.
- Drag painting calls camUI(), draw() and localStorage writes for each changed cell.
- Each pattern change invalidates the complete front/back swatch texture pair, generated synchronously on the main thread.
- Yarn-detail rendering reconstructs geometry and repeatedly strokes sampled paths on every draw; higher feeder counts increase the work.
- Both swatch faces are generated even for a single-face view.
- Playback uses setInterval to redraw; it does not pause when the page becomes hidden.

Suggested order: profile first; coalesce input via requestAnimationFrame; separate geometry/texture rebuilds from presentation-only redraws; debounce persistence; avoid DOM rebuilds on pointer motion; cache geometry and per-face render results; measure maximum-size patterns on mobile; consider OffscreenCanvas/Web Worker with a supported fallback if measurements justify it. Preserve smooth painting and immediate feedback. Do not claim a speedup until measured.

## Validation completed before export

Original V1.3 was checked for JS syntax, custom widths 2/6/24, swatch face modes, signature grouping and malformed patterns. Browser checks covered six-needle/four-feeder size application, K/T/M painting, undo and a 3-required-track vs 2-available warning. These checks did not establish high-load performance or physical knitting accuracy. Re-run and add tests after optimization.
