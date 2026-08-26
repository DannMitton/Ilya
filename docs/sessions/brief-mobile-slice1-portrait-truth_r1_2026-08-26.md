# Brief: mobile slice 1, portrait renders the true page

For Claude Code, pointed at `~/Desktop/ilya-rewrite`. Serves the mobile
correction track (N.92 and N.93 territory), first of five ruled slices.
Written by the desk 2026-08-26. Floor: `98bba71`.

## The ruling this builds

Dann, 2026-08-25, recorded in `docs/memory/STATE.md` (the mobile design
session block) and in `docs/sessions/design-mobile-correction_r2_2026-08-25.html`:
the phone's paper is the whole true page, an oversized thumbnail at full
engraving resolution. Portrait and landscape are both valid; neither is a
felt concession. Systems are never re-broken.

The legibility bet behind it was walked by Dann 2026-08-26 on his iPhone:
a real engraved page whole on screen at roughly 390 x 505 CSS points reads
with plenty of detail.

## What to build, and nothing more

1. **The score document renders in portrait on a phone.** Today it does
   not (observed 2026-08-25: a full-height sheet carrying only furniture
   around an empty body). The whole page renders fitted to the viewport
   width, engraved at full resolution, shadowed, owning its header block
   and colophon, exactly as the desktop page is, smaller.
2. **The sideways hint dies** ("Turn your device sideways to read the
   marked-up score", `i18n.ts`, and its centred-placement INBOX line dies
   with it). A page that renders needs no apology.
3. **Pagination stays honest**: `PAGE 1 OF n` describes what is rendered.
4. **The transcription document in portrait is out of scope.** Its
   reading-aid treatment stands as ruled until Dann amends it; touch
   nothing there.
5. **No loupe, no dock, no gesture work.** Tap behaviour on the portrait
   page stays exactly what it is today; slice 2 takes the loupe. Browser
   pinch keeps working; do not add a custom gesture layer, and do not cap
   zoom in the viewport tag (WCAG 1.4.4).

## Constraints

- Same Paper components, CSS only where possible. There is no second
  renderer, and Dann's N.45 ruling keeps it that way
  (`docs/memory/ENVIRONMENT.md` §the renderer). Systems are NEVER
  re-broken to the viewport.
- Drawer manipulates, page displays and prints. Nothing lands on the
  paper.
- Print output must be byte-identical in behaviour: the print artifact is
  the WYSIWYG page and must not change under any of this.
- Five gates at baseline before handing back. Do not edit `ilya-ship.sh`
  silently; if a legitimate test addition moves a baseline, say so in the
  memo.
- No commits, no ship. Dann ships after his own walk.

## Verification, before the memo

Look at the rendered result at 430 x 932 (portrait) with a loaded score:
the whole engraved page visible, systems intact, furniture in place, no
collision between the legend and the last system (the N.83 fix must
survive; footer is measured, `VoiceProfilePane.svelte`). Then 932 x 430:
landscape unchanged from today. Then print preview: unchanged.

## Return memo format

Short memo to `docs/sessions/memo-mobile-slice1_r1_2026-08-26.md`: what
changed with `path:line`, what you looked at with your own eyes (viewport,
document, print preview), gate results, and a section titled
"Not established". NOT ESTABLISHED beats a complete invented answer.
