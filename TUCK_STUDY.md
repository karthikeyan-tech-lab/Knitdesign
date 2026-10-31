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
- The 30 Ne cotton jersey's 30 WPI / 42 CPI spacing is only an initial drawing scale for this tuck study. It is not a measured or predicted tuck density. The stretched and tucked paths are not constrained to 3 mm yarn length. No contact/collision, yarn tension, relaxation, shrinkage or finished GSM prediction is claimed.
- Model validation against an actual K/T + K/K knitted swatch is still required. Do not treat the illustration as a production feasibility check.

## Validation

`node tests/tuck.cjs` checks cyclic held state, release of the old loop plus all tuck yarn, rotated repeat boundaries, multiple tucks, unsupported-pattern fallback, K/T feeder endpoint continuity, held-loop span, swatch/garment cache invalidation and distinct front/back projection. The 32×24 K/T stress render completed in approximately 2.3 seconds in the development Canvas runtime; this is not a mobile benchmark.

`node tests/jersey.cjs` and `node tests/colour-order.cjs` pass. The plain-jersey swatch PNG is byte-identical before/after the shared renderer refactor. JavaScript syntax checks pass. All 28 Chrome browser checks passed on the managed development preview, including loading the tuck example, F1/F2 explanations, all three tuck views, JSON roundtrip, miss fallback and Undo recovery. Responsive widths 390px/1280px and the existing synchronous renderer fallback checks also pass. Native mobile performance was not measured. HTTPS/offline installation remains outside the HTTP preview checks.

Research context: KnitScape (Twigg-Smith, Whiting and Peek, CHI 2024) builds yarn topology from operation repeats and simulates deformation. This implementation uses an independently written periodic event graph and heuristic geometry; it does not embed KnitScape code or claim its simulation capabilities. https://depts.washington.edu/machines/projects/knitscape/
