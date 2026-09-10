# Memo: N.114b items 6, 7, 8 and 9. r3, 2026-09-10

r1 covers the item 1 correction and item 3; r2 covers items 4 and 5. Items 1 to
5 were not touched. Branch `Shane`, nothing committed, six files touched, none
new, no new string. All five gates at baseline and none moved: `216 (216)`,
`235 (235)`, `0 errors and 7 warnings in 4 files`, `1076 (1076)`,
`547 | 5 skipped (552)`. `ilya-ship.sh` needs no edit.

## Item 6: one gap, three rows

`--intake-row-gap: 8px` is declared on `.intake` and spent by one rule covering
`.syl-head`, `.syl-open` and `.intake-actions`. It was a literal `8px` in two
separate rules before and the open box had none at all. The open box carries a
new `syl-open` class so the rule can reach it: `.syl-box` is worn by both the
open box and the collapsed row, and the collapsed row keeps its place under the
score receipt, which this ship does not move.

## Item 7: the binder's order

`RootPanel.svelte`. Export all songs leads, then Export this song, then Import a
song. Reorder only: three handlers, three strings and the ghost pill untouched,
and Export all songs keeps the `songs.length > 1` guard it has always had, now
in the first cell rather than the third.

## Item 8: the wizard's collapse is gone

**Read first, as asked: `CalibrationWizard` is mounted in ONE place**,
`+page.svelte`'s `voiceTakeover` snippet. No second surface where the fold still
had a job, so nothing needed scoping and the whole mechanism went: the compact
row, the `{#if !collapsed}` gate, the `collapsed` binding, the `scoreRenders`
prop, the two effects that collapsed on a fresh render and deferred that
mid-capture, the compact label pair, and three rules.

**The page side went with it.** `scoreRenders`, `wizardCollapsed`,
`renderCountedFor` and `handleScoreRendered` existed only to drive it, and the
`onrendered={handleScoreRendered}` binding with them. **`VoiceProfilePane`'s
`onrendered` PROP STAYS**: it is that component's own optional report and
removing it is a wider ship than this ruling asks for. Nothing binds it now.
`calib.compact.vowelsSampled` is marked UNUSED in place with its ratified
French, the way `upload.scanTooltip` and `underlay.heading` are.

## Item 9: three pills in a column

`Start over` was `.wizard-pause`, the underlined text link; it is
`.wizard-secondary` now, the same recipe as Add voice characteristics. The two
capture-phase links (Pause, and the return to summary) keep `.wizard-pause`.
**Finish also moved**: it stood after the characteristics button, so the column
read ghost, filled, link. It leads now, which is the ruled order. Same handlers,
same strings.

**One thing I added that was not named.** The ruled 44 px was not being met:
`.wizard-primary` and `.wizard-secondary` measure **43.5 px** (`0.625rem` twice
plus a `0.9375rem` line), and the ruling puts a third action in that column. They
take `min-height: 44px` under `@media (pointer: coarse)` now, twinned on
`StationHeader`'s disclosure. It reaches Finish and Add voice characteristics
too, by half a pixel each.

## The walk

Production build on 4173. Entry `app.czQtz2Yo.js` for items 6 and 7 at 1400,
`app.B8afK5NA.js` for items 8 and 9 and the whole 390 px pass, which is the
shipping build.

1. **Item 6.** Expected header row bottom to box top to equal box bottom to
   Choose a file top. **Observed 8 and 8** at 1400, and **8 and 8** at 390. The
   token reads `8px` and all three rules compute `margin-top: 8px`.
2. **Item 7.** Expected the three left to right in the ruled order. **Observed**
   at 1400, one row at y 313: Export all songs x 34, Export this song x 187,
   Import a song x 339. At 390, one row at y 147: x 34, x 143, x 253, no wrap. I
   had to make a second song for the third button to appear at all.
3. **Item 8.** Expected the surface to open with no collapse row and the body
   present, with a score rendered. **Observed** zero `.wizard-compact-toggle` and
   zero `.wizard-compact-chevron` nodes, `.wizard-body` present, and the surface
   opening straight onto `Profile summary` with 96 hit targets on the page
   behind it.
4. **Item 9.** Expected three pills in a column in the ruled order. **Observed**
   at 390 with `matchMedia('(pointer: coarse)')` true: `wizard-primary` Finish at
   y 991, `wizard-secondary` Add voice characteristics at y 1049,
   `wizard-secondary` Start over at y 1107, **all three 44.00 px**. On the desk
   the same three read 43.5 px, which is the fine-pointer height and unchanged.

## What I could not establish

- **I seeded a voice to reach the summary phase.** Both `shane.profiles.v2` and
  `shane.profile.v1` were **null** before the walk; I wrote a 7-of-10 store to
  reach `Profile summary` without running the capture ritual and **removed it
  afterwards**, leaving both null. I did not walk a real capture, so I did not
  see the mid-capture deferral path I deleted actually not happen.
- **I made a second song** so `Export all songs` would render, and left it in
  the library. It is `Untitled, 2026-09-10` in the browser pane's own storage,
  not yours.
- **No real phone.** 390 x 844 with the pane's coarse-pointer emulation is what
  I measured.
- **No French walk**, **no walk with the wall up**, and **no returning-singer
  walk**.
- **`--intake-row-gap` has no test**, like `--band-inset` and `--drawer-gutter`:
  a change is caught by a walk, not a gate.
- **This memo is r3**, because the brief names one path and r1 and r2 are on
  disk; a new revision number is the tree's habit.
- **It is 103 lines**, against the brief's 70. Cutting further drops a
  measurement or a caveat.

`WRITTEN`, not `DONE`. Dann's walk on the alias makes it `DONE`.
