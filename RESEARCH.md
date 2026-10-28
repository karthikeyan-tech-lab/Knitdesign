# Fabric visualization research and V1.6

Sources consulted on 28 October 2026:

- [CMU Textiles Lab knitout specification](https://github.com/textiles-lab/knitout/blob/master/knitout.html): knit draws new loops through held loops and drops the old loops; tuck adds a loop to those already held. The low-level miss operation moves carriers without forming a loop. Our K/T/M repeat is a simplified design chart, not a full knitout instruction stream.
- [Knitout Live Visualizer](https://github.com/textiles-lab/knitout-live-visualizer): demonstrates visualizing instructions and linking source operations with stitches. Its README describes an instruction visualizer, not a guarantee of photorealistic finished fabric. The older knitout-visualizer repository directs users to this successor.

## Decision

Preserve stitch-driven output and inexpensive cached textures. Improve appearance with broad contact shadows, a matte yarn body, softer directional highlights and short fine fiber glints along the calculated paths. Make small position variation periodic with the repeat to reduce tile-edge discontinuities. Correct aspect-ratio handling when fitting the swatch so source textures are not stretched when cropped. Fabric and garments share these textures and continue updating from edits. These are visual heuristics, not validated yarn mechanics.

## What is needed to match original fabric

A K/T/M chart alone is insufficient. Yarn material, count, twist/hairiness, machine gauge, stitch length, take-down/tension, relaxation and finishing affect surface appearance and dimensions. A future calibrated model should be compared against known stitch charts plus front/back macro photographs of actual swatches under consistent lighting and scale. A shared loop/topology model, depth ordering, yarn contact/relaxation and calibrated material shading are the recommended next steps. Double-bed structures, plating and transfers need additional machine/state inputs.

No claim is made that this release reproduces an exact swatch, measures CPI/WPI/GSM or certifies machine compatibility. Reference photographs and physical measurements are not included in this repository. No external renderer code or image texture was copied into the app.


## V1.7 supplied visual reference

The user supplied a grey/gold front/back rendering with magnified details. Used as an appearance reference only: prominent V-shaped face legs, separated back crowns, horizontal sinker/float elements and fine spun-yarn detail. The surface renderer now samples each Bezier centreline and adds two fine strands along its normals, retains contact shading, and draws clearer face legs and separated back crowns. Fabric, magnifier and garment use the same resulting texture. This surface geometry remains illustrative and is not a continuous-yarn topology solver; the technical loop diagram remains a separate approximation.

The image does not uniquely establish a K/T/M chart, gauge, yarn count or finished density. Its printed dimensions and stitch-density values were not imported as measurements, and the existing repeat was not overwritten. No pixels from the reference are used as a texture.
