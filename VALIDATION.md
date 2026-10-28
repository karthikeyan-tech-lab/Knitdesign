# Validation

Headless Chromium on this cloud environment, 28 October 2026. Desktop viewport 1440 × 1000 and mobile layout viewport 390 × 844. Measurements are observations on this machine, not a guarantee for other devices.

The same browser executable measured original V1.3 and the PWA with 6-needle × 4-feeder and maximum 24-needle × 32-feeder repeats, all-knit, all-tuck, all-miss and mixed patterns.

| Measurement | V1.3 | PWA |
| --- | --- | --- |
| Repeat update: UI ready | 173–1012 ms (synchronous render) | 6–72 ms (preview continues in worker) |
| Preview complete | 173–1012 ms | 140–905 ms |
| Burst of 20 magnifier pointer events | 26–43 ms | 0.8–5.8 ms |

Worker rendering primarily removes work from the UI thread; it does not eliminate the cost of procedural texture generation. Updating a maximum-size editor still creates 768 cell buttons and can exceed a frame budget. Original output geometry is retained. Physical fabric accuracy has not been validated.

Browser tests cover service-worker control and offline reload, PNG icon sizes and manifest, example JSON import, K/T/M painting, Undo, keyboard navigation, complete-sequence track grouping, all three rendered views, PNG export, JSON download/reimport, autosave recovery, no page errors, and mobile document width. Additional checks cover synchronous renderer fallback, corrupt browser-storage preservation, shrink confirmation/Undo and playback.

Not validated: native installation on iOS/Android, private hosting gateways, a deployed HTTPS origin, and speed on physical mobile devices. No public site has been deployed.


## V1.5 garment and renderer repair

Replaced the feeder playback/statistics panels with a stitch-textured T-shirt or sweater illustration, with front/back selection and PNG export. Kept the never-knit warning near the garment, and feeder highlighting in the loop controls.

The old preview bridge had an unguarded Worker constructor and no timeout. Tests now simulate a constructor exception, worker runtime failure, and a worker that never replies. Each recovers to calculated Canvas output; tests verify nonuniform image pixels and subsequent garment updates. These reproduce failure classes, not a diagnosis captured on the user's actual phone.

The renderer draws a single repeat and tiles it across fabric and garment views, with a shared per-face cache. At the same tested repeat sizes and K/T/M/mixed patterns, local Chromium measured 36–51 ms for 6 × 4 previews and 108–194 ms for 24 × 32 previews, including the garment. UI updates measured 5–69 ms. Previous PWA preview completion was 140–905 ms without a garment. These are machine-specific observations, not physical-device performance guarantees.

22 browser checks passed, including garment texture changes after editing, garment shape/back switching, garment PNG export, removal of old panels, all worker failure recovery paths, latest queued design matching the garment texture, offline reload and saved-design recovery. Both worker and main-thread fallback still draw the procedural stitch model. No actual Android/iOS device or live Vercel deployment was verified. Offline shell cache bumped from v2 to v3; users with the older copy must accept the update.


## V1.6 full-repeat navigation and appearance

Existing 22 PWA/rendering checks passed after the changes. A separate mobile-emulation test at 390 × 844 verifies 12-feeder × 8-needle and 32-feeder × 24-needle repeats: fit has no horizontal/vertical inner overflow, expanded view opens/closes, both scroll axes move in large-cell mode, Move does not paint, and the bottom-right cell can be painted. Tests use Chromium touch/mobile emulation, not a physical phone. The full editor hides unrelated controls. The shell cache is v4. Appearance improvements are documented in RESEARCH.md; no physical fabric accuracy claim is made.


## V1.7 reference study

The reference image guided face-loop and back-crown appearance, with centreline-following fiber strands. Verified calculated front/back output by visual inspection and reran the 22 PWA checks. The supplied reference is not treated as a verified stitch chart or physical density measurement. Cache version is v5.
