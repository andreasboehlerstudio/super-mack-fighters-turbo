# Arena spectator grounding — 2026-09-07

The previous renderer used y=404 for every spectator and y=402 for every shadow. Pavement, quays and terraces begin at different heights in the 42 arena paintings, so several crowds appeared to stand on walls or water.

`game/arena-crowd-layout.ts` now gives every backdrop its own two ground positions. The full arena ID determines placement even when multiple backdrops share crowd artwork. Spectators retain the native 160-pixel sprite cells and the authored sole anchor at 154; no animation frames are rescaled. Shadows and feet use the same integer camera translation, with the shadow centered one pixel below the sole.

Visual review: composited the actual crowd sprites against all 21 themed areas, 14 coaster backdrops and 7 special stages. Revised heights and horizontal positions where shoes overlapped facades, fences, water, planters or props. Germany now uses the paved plaza clear of the lamps. Russia uses the new Euro-Mir forecourt. Checked both arenas in a running local production build with animated spectators and no browser console errors.

Validation: 86 tests passed, TypeScript check passed, GitHub Pages production build passed. The regression covers all 42 layout entries, separate horizons for shared crowd art, integer camera movement and contact-shadow placement. Actual suitability of a standing point remains a visual check whenever a backdrop changes.
