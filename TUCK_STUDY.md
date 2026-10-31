# Procedural tuck visualization

Supported K/T repeats use this geometry automatically in fabric swatch and garment views, on both faces. Every needle must knit at least once per repeat. Designs containing miss stitches or needles that never knit retain their existing rendering. Saved geometry flags, including explicit false values, do not choose the renderer. Stitch patterns, needle order, feeder colours and derived cam settings remain intact.

Rows are feeders and columns are needles. Cam-setting rows are tracks and columns are feeders. Identical full-repeat needle sequences share a track. The renderer does not change those sequences or certify machine compatibility.

## Geometry and references

The cyclic event graph follows held loops across repeat boundaries. A T collects a tuck bight without creating a new knit; the next K clears the held knit and accumulated tuck yarn. Neighbouring K/T feeder paths meet at their endpoints. No arbitrary three-tuck limit is imposed.

Plain jersey uses the separate finished 30 Ne, 100% cotton, 24G reference: 30 WPI × 42 CPI and 30 cm / 100 needles = 3.0 mm yarn path. Matching single-tuck piqué uses 35 WPI × 50 CPI and 27 cm / 100 needles = 2.7 mm mean path. Its repeat is:

| Feeder | N1 | N2 |
| --- | --- | --- |
| F1 | K | K |
| F2 | K | T |
| F3 | K | K |
| F4 | T | K |

Cyclic feeder shifts, needle swaps and exact tilings select the same piqué profile. The measured wale/course pitches stay fixed; a scalar loop-height fit holds the mean sampled path over the eight operations at 2.7 mm after relief changes. Interpreting the reported feed as a repeat-wide mean is an assumption because feeder-specific delivery was not supplied. Individual K/T lengths differ.

Other supported K/T designs use jersey spacing as an uncalibrated drawing scale, not a measured or predicted tuck density. Surface relief changes estimated yarn depth. Front and back project the same 3D paths; the swatch, magnifier and garment share each face texture. Yarn-detail and loop-structure views use the same tuck paths. All imagery is procedural; no photograph is pasted onto the design.

These are fitted visualizations, not validated physical simulations. Yarn contact, tension, mechanical relaxation, shrinkage, finishing, GSM, garment fit and drape are not solved. Actual knitted samples are still needed to validate shape and back appearance.

## Responsiveness and checks

One worker render runs at a time with one latest pending state. Cached textures are reused for pointer motion and garment rendering. Exact repeated stitch/feeder-colour motifs are tiled rather than rasterizing every duplicated editor cell; distinct feeder colours prevent incorrect reduction. Front/back tuck paths share a bounded cache. Browsers without worker Canvas support retain synchronous calculated rendering and can pause on large designs.

See README.md for the runnable validation commands. Geometry tests cover cyclic holds/releases, continuous yarn joins, measured pitches, phase rotations and fitted path lengths. Shared-texture tests verify the exact same face texture reaches swatch and garment, motif tiling preserves appearance, individual feeder colours survive, and both measured yarn-length constraints hold across the relief range. Browser tests cover legacy false flags, both faces, colours, relief, stitches, cam tables, save/load, exports, miss fallback, mobile layout and worker/fallback modes.
