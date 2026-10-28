# Task for Codex

I work in knit fabric sourcing. This ZIP is my existing Knit Loop Studio V1.3. Continue from this source and preserve its custom design, symbols, cam table and fabric views.

Main problem: the app hangs during use. First run it locally, reproduce/profile the slowdown, and fix responsiveness. Do not replace the computed preview with a generated image or a static picture. Read README.md and TECHNICAL_NOTES.md before changing it.

Required behaviour:
1. Feeders as design rows and needles as columns. Adjustable repeat size.
2. Knit / Tuck / Miss brushes with visible symbols and K/T/M letters, click/drag painting, Undo and fill.
3. Automatic grouping into needle tracks from complete action sequences. Cam table rows = tracks; columns = feeders. Explain a track-limit mismatch clearly.
4. Front/back swatch illustration, magnifier, yarn detail and loop structure. Colours by feeder, one-colour mode, zoom and PNG export.
5. JSON save/load and browser autosave. Preserve older saved designs where valid. Never silently discard a design on resize or refresh.
6. Responsive mobile/desktop layout, keyboard editing and clear plain-English labels.

Performance acceptance:
- Test typical 6×4 and maximum 24×32 repeats, plus all-knit, tuck, miss and mixed patterns.
- Measure paint, pointer magnifier, playback, resize and visual-control response before and after the changes on the same device/browser.
- Avoid unnecessary render, texture, DOM and storage work for each pointer event. Keep the interface responsive while expensive render work runs.
- Verify no renderer errors, no corrupt save/load roundtrip, correct track grouping and usable Undo after optimization.

Accuracy:
The current fabric views are approximate. Improve geometry gradually using known stitch charts and actual swatches. Do not claim SHIMA SEIKI accuracy, physical simulation, real CPI/WPI or machine compatibility without validation. Prefer one shared yarn/loop model for front/back and zoomed detail as the project develops.

Deliver a maintainable app and instructions to run/build it. Prepare the deployment and tell me the hosting/access choices before selecting a new public audience. My existing site is private; this source ZIP has no sign-in implementation. Do not overwrite or change the original site's audience unless I ask. Keep user-facing text simple.
