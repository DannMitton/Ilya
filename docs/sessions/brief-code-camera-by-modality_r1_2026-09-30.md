# Brief to Code: the camera glyph answers to touch, not to width

From the desk, 2026-09-30 23:50. No git writes. Gates before and after.

**The ruling:** Dann, 2026-08-10 (E.36, ruling 4's sixth clause, wording proposed by Opus and adopted: *"I want the sixth clause."*): **"Control geometry answers to input modality, not to form factor or brand."** The hook is `@media (pointer: coarse)` (or `matchMedia('(pointer: coarse)')`), not a width query. Source: claude.ai project doc `claude/e36-RULED-touch-geometry_2026-08-10.md` §0; now homed in `docs/memory/OPEN.md` §RULINGS HOMED, PART 3.

**The fault, the desk's own:** the 2026-09-30 camera brief said to show the glyph "only when `isMobile` is true". `isMobile` reaches `IntakePanel` as `isPhone` (`routes/+page.svelte:4418`), which is width-based (`:4065`, `isDeskLayout(window.innerWidth)`). So an iPad in landscape or a touchscreen laptop gets no camera, and a narrow desktop window gets one.

**The work:** show `IntakeCamera` when the primary pointer is coarse, and react to a change. Leave `isMobile` and N.70's `acceptList` alone. Test both directions with a mocked `matchMedia`.

**Report:** `docs/sessions/report-code-camera-by-modality_r1_2026-09-30.md`.
