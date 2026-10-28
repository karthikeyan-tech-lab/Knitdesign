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
