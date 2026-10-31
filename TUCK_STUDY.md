# K/T + K/K tuck formation study

This experimental branch adds an optional K/T geometric study. The main app is not changed until this branch is explicitly merged.

## Try it

Choose **Try K/T + K/K** in Tuck formation study. This loads the user's two-feeder, two-needle example and enables the study. Undo restores the previous stitch pattern. Switch Fabric swatch between front/back, or choose Yarn detail / Loop structure. These views share the same generated tuck paths. Use Feeder highlight to read the formation explanation for F1 and F2. Colour by feeder can distinguish the deposited yarns.

For the example:

| Feeder | Needle 1 | Needle 2 |
|---|---|---|
| F1 | K | T |
| F2 | K | K |

At F1, N2 retains the knit from F2 of the previous repeat and collects tuck yarn. At F2, N2 forms a new knit through the held loop and collected tuck bight. No new knit is created at a T action. The periodic event graph looks backward and forward across repeat boundaries; it does not assume an empty needle at the top of the swatch.

## Scope and limits

- K/T repeats are supported when every needle has at least one K in the repeat. Miss stitches and needles that never knit use the original preview. These are renderer scope limits, not imposed machine knitting limits; input designs are preserved.
- Multiple tuck actions are retained in the event graph until a K clears them. No three-tuck knitting limit is imposed.
- Held knit paths span intervening tuck passes. Tuck bights are additional continuous feeder paths. A small continuous displacement field illustrates neighbouring-loop pull; it is a geometric assumption, not a force calculation.
- Front/back, garment, magnifier and detail views use the shared paths. The normal jersey renderer remains byte-identical for the reference test after its texture renderer was generalized.
- For unmatched K/T structures, the 30 Ne cotton jersey's 30 WPI / 42 CPI spacing is only an initial drawing scale, not measured or predicted tuck density. Their stretched and tucked paths are not constrained to 3 mm yarn length. Matching single-tuck piqué repeats instead use the separately measured profile described below. No contact/collision, yarn tension, relaxation, shrinkage or finished GSM prediction is claimed.
- Model validation against an actual K/T + K/K knitted swatch is still required. Do not treat the illustration as a production feasibility check.

## Validation

`node tests/tuck.cjs` checks cyclic held state, release of the old loop plus all tuck yarn, rotated repeat boundaries, multiple tucks, unsupported-pattern fallback, K/T feeder endpoint continuity, held-loop span, swatch/garment cache invalidation and distinct front/back projection. The 32×24 K/T stress render completed in approximately 2.3 seconds in the development Canvas runtime; this is not a mobile benchmark.

`node tests/jersey.cjs` and `node tests/colour-order.cjs` pass. The plain-jersey swatch PNG is byte-identical before/after the shared renderer refactor. JavaScript syntax checks pass. All 28 Chrome browser checks passed on the managed development preview, including loading the tuck example, F1/F2 explanations, all three tuck views, JSON roundtrip, miss fallback and Undo recovery. Responsive widths 390px/1280px and the existing synchronous renderer fallback checks also pass. Native mobile performance was not measured. HTTPS/offline installation remains outside the HTTP preview checks.

Research context: KnitScape (Twigg-Smith, Whiting and Peek, CHI 2024) builds yarn topology from operation repeats and simulates deformation. This implementation uses an independently written periodic event graph and heuristic geometry; it does not embed KnitScape code or claim its simulation capabilities. https://depts.washington.edu/machines/projects/knitscape/

## Measured single-tuck piqué reference

The user supplied front/back piqué photos and confirmed: 30 Ne, 100% cotton, 24G, finished fabric, 35 WPI, 50 CPI and 27 cm yarn per 100 needles. The reference repeat is F1 K/K, F2 K/T, F3 K/K, F4 T/K. Wale pitch is 25.4/35 = 0.725714 mm; course pitch is 25.4/50 = 0.508 mm.

**Try single-tuck piqué** loads that exact repeat. The measured profile is applied only to this repeating operation structure, including cyclic feeder shifts, needle swaps and exact tiling. Other tuck structures retain the uncalibrated study. Plain jersey keeps its separate 30 WPI / 42 CPI / 3 mm reference. No yarn colours are changed by the preset.

For the matching piqué, a scalar height fit holds the measured grid pitches fixed and adjusts loop proportions so the mean sampled yarn path across the eight operations is 2.7 mm. Interpreting the single reported yarn length as a repeat-wide mean is a modelling assumption: feeder-specific K/T yarn delivery was not supplied. Individual K and T paths can have different lengths. This is geometric fitting to supplied measurements, not a tension, shrinkage, collision or finishing simulation. The supplied photos guide qualitative comparison; no pixel-registered or numerical image-match accuracy is claimed.

`tests/pique.cjs` verifies measured pitches, the mean 2.7 mm constraint, all eight phase/needle rotations, continuous yarn joins, cyclic releases and separate profile scope. The held-loop graph is unchanged. The real sample is still required to validate loop shape, local deformation, fibre coverage and back appearance.

The extended Chrome browser suite passes all 32 checks, including the exact measured piqué preset, automatic reference selection, alternating needle tuck positions and JSON restoration of the matching profile. The original plain-jersey swatch remains byte-identical.

## Piqué surface refinement

Matching piqué paths now include staggered tuck-centred depressions, raised surrounding yarn and compacted held-loop proportions, guided qualitatively by the supplied front/back swatches. Surface relief controls this estimated depth from 0 to 1. Yarn shading follows the three-dimensional tangent for these paths; exposed gaps receive deeper shading. This is procedural geometry, with no photographic texture.

The 35 WPI / 50 CPI grid stays fixed and the 2.7 mm mean-path fit is recomputed after deformation. Tests check that constraint at relief 0, 0.6 and 1. Relief is saved/restored in design JSON and included in worker, fabric and garment cache keys. Other structures retain their existing rendering. Plain-jersey regression output remains byte-identical. The appearance is an approximation pending swatch comparison, not a validated fabric prediction.

All 34 Chrome browser checks pass, including relief changes updating both fabric and garment and JSON restoration. Unit geometry, colour-order and plain-jersey regression checks pass.

## Default views
Improved jersey and supported K/T geometry are enabled by default in the initial Fabric swatch and in the garment preview. Legacy designs without explicit study preferences inherit the enabled defaults; explicitly saved false preferences remain respected. Miss-containing repeats retain the existing fallback until float geometry is implemented.

## Automatic normal rendering
The study switches are removed from the visible interface. Swatch and garment renders automatically select improved jersey or supported K/T geometry. Legacy false study flags are migrated to enabled on import/restore; stitch patterns and yarn colours remain intact. Miss repeats still use their existing fallback. This supersedes the earlier opt-out behavior.
