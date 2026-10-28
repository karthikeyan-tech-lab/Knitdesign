# Knit Loop Studio PWA

An installable, offline knit design editor based on the supplied V1.3 source. Paint Knit / Tuck / Miss repeats, group needle action sequences into cam tracks, and inspect calculated fabric, yarn-detail and loop views.

## Run

No application dependencies or build step are needed. From this repository:

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory dist
```

Open `http://localhost:8000`. Offline installation needs HTTPS in production; localhost works for development. Use the Install app button when your browser offers installation. On iPhone/iPad, open in Safari and use Share → Add to Home Screen. Actual native installation has not been tested on mobile devices.

After the first successful online load, the app works offline. Designs autosave to this browser and origin; use **Save design** for portable JSON backups. An installed app is not a cloud backup. Import older valid JSON designs with **Load saved design**. Arrow keys navigate cells; K/T/M paint the focused cell; Enter/Space use the selected brush. Shrinking a repeat asks for confirmation; Undo can restore its stitches during the session.

## Architecture

- `dist/app.js`: state, editor, validation, cam grouping and debounced persistence.
- `dist/renderer.js`: original procedural Canvas fabric and loop geometry, with lazy face textures.
- `dist/preview.js` and `dist/render-worker.js`: worker rendering with one active render and one latest pending state; synchronous fallback on unsupported browsers. No static fabric images replace computed previews.
- `dist/manifest.webmanifest`, `dist/sw.js`, `dist/pwa.js`: installation, versioned offline shell, network status and explicit update activation. Bump the cache version in `sw.js` for each release. Update saves the current design before reloading.
- `SOURCE_README.md`, `TECHNICAL_NOTES.md`, `CODEX_HANDOFF.md`, `SOURCE_MANIFEST.json`: original archive context. The source manifest hashes refer to the imported V1.3 files, not the modified PWA.

UI updates use animation frames; pointer motion no longer rebuilds statistics; autosave waits 250 ms and flushes when the page hides. Canvas exports wait for the latest rendering job. Browsers without worker Canvas support keep the calculated renderer but may pause during expensive rendering.

## Validate

With the local server running and Node.js, Playwright and Chromium available:

```sh
node tests/pwa.cjs
```

Set `CHROMIUM_PATH` if Chromium is elsewhere. The test uses Playwright from the development environment; it is not an application runtime dependency. See [VALIDATION.md](VALIDATION.md) for measurements and coverage.

## Deploy and access

Deploy the contents of `dist/` to an HTTPS static host. No build command or API key is required; publish directory is `dist`. Relative URLs support deployment under a subdirectory. Serve `sw.js` with revalidation (`Cache-Control: no-cache`), JavaScript MIME type, and no redirect to a login HTML page.

Choose access before deploying: public static hosting (such as GitHub Pages) makes the app available to visitors; private hosting needs an authentication gateway/access controls configured by the host. This source has no sign-in or server-side authorization. Offline cached copies remain usable on a device after online access is revoked. For confidential designs, use trusted devices and an appropriate private-host policy. No deployment or changes to the existing private site have been made.

The fabric views are approximate illustrations, not physical simulation or verified machine instructions. Cam grouping compares complete needle sequences; it does not certify knitting safety or machine compatibility.
