# Memo: mobile slice 2, r2, the five rulings applied

For Dann. Branch `Shane`, floor `bcab673`. Beside
`memo-mobile-slice2_r1_2026-08-26.md`, which stands: r1 records what was built
and walked, and this records what your rulings of 2026-08-26 changed on top of
it. No commits, no ship. `docs/memory/INBOX.md` was already modified when I
arrived and I have not touched it.

Your sixth item, the one you sent while I was working, is §6.

## 1. The five rulings, and where each one landed

### Ruling 1. On phone widths the page tap navigates only

`+page.svelte:389` is a new `placeArmedSyllable`, N.55b's placement rule
lifted out of `handleNotePick` unchanged, advance and all. Two callers now
share it and neither owns it.

- `:420` `handleNotePick`, which is still what VoiceProfilePane's delegated
  listener calls. It selects, and on a phone it returns there. **Off a phone
  it places exactly as shipped.**
- `:427` `handleLoupePick`, the new one: it takes the entry and places.

**The test is `isPhone`, the same smallest-side test that decides whether the
loupe exists at all.** I chose that over a bare width test deliberately, and it
is worth your eye: the rule has to follow the surface rather than the frame,
because a phone in landscape is 932 px wide and still a phone, and if the page
kept placing there the ruling would hold in portrait and lapse on rotation.

**Placement now happens inside the loupe**, `Loupe.svelte:364`, at 2.4 times,
where the entry under the finger is legible. The loupe resolves a tap to the
NEAREST entry rather than requiring a direct hit, the same rule the page tap
uses, so a tap between two entries still resolves and always the same way.

One mechanism was needed to keep the two grammars apart. `Loupe.svelte:225`
renames the hit rectangles in the clone: the page keeps `data-hit` and the
loupe owns `data-loupe-hit`. VoiceProfilePane's listener matches `[data-hit]`
anywhere in the document, so a clone carrying that name would have put the
page's meaning on a tap inside the loupe. Renamed, each listener sees only its
own, and I verified the loupe now carries 18 `data-loupe-hit` rectangles and
zero `data-hit`.

### Ruling 2. Anchor the lyric verbs to the taken entry

`+page.svelte:814-833`: `dockShiftAnchor`, `dockShiftDisabled`, and
`handleDockShift`. The anchor is the taken entry, so the cells are live
whenever an entry is taken and the singer never leaves the dock to make them
work.

**The drawer's own verbs are untouched.** `shiftAnchorEventId` and
`shiftDisabled` (`:325`, `:343`) still drive `ShiftLyricsControl` from the
station cursor, which is the anchor you confirmed on 2026-08-14, and desktop
is not in this slice. So two surfaces now carry two anchors, and each says on
its face which note it acts from: the drawer through the station cursor it sits
beside, the dock through the entry in the loupe above it. **If you would rather
they were one rule, that is a desktop edit and its own ship.**

`shiftToEndOfLyric` does not require its anchor to carry a syllable
(`pairings.ts:608`), so a taken entry with no syllable still shifts the run
after it. Nothing needed to change there.

### Ruling 3. Redraw the insertion bar to the schematic

`Loupe.svelte:231-290` draws it, and `loupe.ts:159` is the geometry, pure and
tested. A thin vertical bar bisecting the notehead, spanning the staff with one
line gap of air at each end, an inward triangle capping each terminus, in sage.
The magnified selection capsule is gone: the clone drops the page's
`data-note-selected` and nothing replaces it but the bar.

Every number is in line gaps, so the bar scales with the engraving rather than
with the screen. Measured on the walk: thickness 1.21 user units against a
5.5 unit line gap, height 33 units against a 22 unit staff.

**Finding the notehead took two goes, and the second one is the honest one.**
SMuFL fixes the three notehead codepoints, so the notehead is the one thing in
a note's group that names itself (`Loupe.svelte:102`). For its column I take
`getBBox().x + width / 2`, which is exact, because the renderer centres the
glyph on its column by advance width and `getBBox` on an SVG `<text>` returns
that same advance box.

**I first took the note's vertical position from the same box, and it was
wrong.** That box is the font's own ascent and descent, not the ink: it
measured 95 user units against a staff of 22, and the bar ran from above the
staff down through the IPA line. I saw it in the screenshot. The renderer
already writes the note's staff position into the element's `y` attribute, so
`:270` reads it instead of measuring it, and a notehead is one stave space
tall. **Read, not measured, and this is the second place today where an SVG
`getBBox` meant something other than what it looks like it means.** The other
is §6.

### Ruling 4. The strings table is ratified

Nothing to do, and nothing changed: every string in r1's table is in the tree
verbatim, `Nolet` included.

### Ruling 5. Both containers take Controls / Commandes

`loupe.dockAria` is struck from `i18n.ts`, and the comment at `:193` records
why it went rather than leaving a gap someone re-fills later. The dock takes
`a11y.drawer` at `CorrectionDock.svelte:272`, which is `Controls` /
« Commandes », ratified 2026-08-23 under N.62 and asserted by `i18n.test.ts`
against your table.

**Zero desktop edits.** No desktop string moved, N.62's ratified table is
untouched, its test still passes unmodified, and `Tiroir` remains what
`drawer.collapse` calls the drawer in its own sentence. The strings block is
now 20 keys, `i18n.ts:175-238`.

## 2. One defect the rulings surfaced, found and fixed

**A tap on the open drawer raised the loupe.** r1 resolved the page tap by
testing the point against each sheet's box, which asks only whether the sheet
is under the finger and never whether anything is on top of it. On a phone the
drawer covers the whole screen while the sheet keeps its box behind it, so
every tap on a drawer control also raised the loupe. I measured it happening.

`+page.svelte:869` asks the document what is actually topmost
(`elementFromPoint`), which fixes it without reintroducing the `e.target`
problem that the box test existed to solve, because it re-queries live rather
than holding an element that a re-render has detached. Verified both ways on
the walk: a tap on an open drawer control leaves the loupe down, and a tap on
the sheet still raises it.

## 3. What I looked at with my own eyes

Same harness as r1: headless Chromium through Playwright, 430 by 932 and 932
by 430, touch emulation on, your engraved
`Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`. This time
the walk transcribes `Комнатка тесная тихая милая` first, so there are twelve
syllables armed and the lyric leg is real rather than described.

- **The drawer arrives collapsed** on a phone, confirmed rather than assumed.
- **A tap on an open drawer control does not raise the loupe.**
- **Ruling 1.** A page tap on entry `m8-1-4` raised the loupe and left the
  page's text **byte-identical**, so nothing was placed. The readout named
  `C♯3 · Quarter`.
- **Ruling 1b.** A tap inside the loupe on `m8-3-4` took that entry and placed
  the armed syllable: the readout became `A3 · Quarter · Dot · Ком`, and `Ком`
  appears under the note on the page behind and in the loupe above it.
- **Ruling 2.** All four lyric cells read enabled with no visit to the drawer.
  A forward shift moved the syllable off the taken entry, the readout dropped
  to `A3 · Quarter · Dot`, the pill read `↰ Undo: syllables shifted`, and one
  tap of the pill put `Ком` back.
- **Ruling 3.** One `[data-insertion-bar]` in the loupe, two triangle caps,
  fill `rgb(139, 154, 125)`, and **zero `[data-loupe-selected]`**: the capsule
  is gone. I looked at a magnified crop of the loupe window, twice, once with
  the bar wrong and once with it right.
- **Ruling 5.** The dock's accessible name reads `Controls`.
- **Landscape.** The dock is 380 by 430 on the left edge and measures 430
  against a 430 px screen, so nothing scrolls, with the Undo pill present.
- **Print.** Loupe `none`, dock `none`, held-measure mark `none`, page opacity
  `1`.
- **Desktop, 1400 by 900.** No loupe, no dock, no insertion bar, no held mark,
  full ink, drawer name `Controls`, the correction station intact with both
  semitone verbs, and **a click on a note still places the armed syllable**,
  which is ruling 1's "desktop unchanged" verified rather than asserted.

## 4. Gate results, run just now

| gate | baseline | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `800 passed (800)` | **`822 passed (822)`** |
| 5 score-parser | `461 passed \| 5 skipped (466)` | same |

**Gate 4 is 822, up from r1's 814 and the shipped baseline of 800.** All 22 are
`loupe.test.ts`, and the eight added since r1 cover the two new pure functions:
four on the insertion bar's geometry and four on the glyph boxes of §6. No
existing test was edited. `~/Downloads/ilya-ship.sh:79` still says 800 and
**I have not touched it**; it needs to say 822.

## 5. Files

New since the floor, four: `loupe.ts` (221 lines), `loupe.test.ts` (198),
`Loupe.svelte` (525), `CorrectionDock.svelte` (676).

Modified, two: `i18n.ts` and `routes/+page.svelte`.

Untouched, and re-verified after this round: `VocalLineEvent`, everything in
`reconciliation/`, `correction.ts`, `pairings.ts`, `CorrectionControls.svelte`,
`ShiftLyricsControl.svelte`, `Drawer.svelte` and the E.36 §1.4 anchors,
`PageFit.svelte`, `staff-renderer.ts`, `smufl-metadata.ts`, `page-layout.ts`,
and `app.html`'s viewport tag.

## 6. Your note about the buttons, and what was actually wrong

You wrote: the noteheads look centred and the notes do not, as though the heads
were centred and the stems drawn outward, so the centroid reads off; and at the
least there should be a consistent margin inside the squircle.

**You had diagnosed it exactly.** A SMuFL duration glyph's origin IS its
notehead, and the stem and flag hang off the character outside its advance
width. Measured in Finale Maestro at 100 px, `noteQuarterUp` inks from 88.9
above the baseline to 13.2 below it: the head sits at the origin and the stem
is all of the rest. Laid out as text, the five cells lined their noteheads up
and left every note hanging off its own centre by a different amount, and the
whole note, which has no stem, was the only one that looked right.

**The cells draw the ink now, centred, at one scale per row.**
`CorrectionDock.svelte:127-250`. Each glyph is measured once, the widest and
tallest ink in a set becomes one box, and every glyph in that set is drawn
through a viewBox of that size with its own ink centred inside it. One box per
set gives one scale per set and the same margin inside every cell of the row.

Three sets, not one, because they are three sizes of thing: a sharp is not as
tall as a sixteenth and an augmentation dot is not as tall as either. Notes
draw at 26 px, accidentals at 22, the dot at 10.

Measured off the rendered cells afterwards, portrait:

| row | drawing | margin top / bottom | margin left / right |
|---|---|---|---|
| the five durations and the dot's row | 14.9 by 26 | 9 / 9 | 18.9 / 18.9 |
| the dot | 10.3 by 10 | 17 / 17 | 18.9 / 18.9 |
| the three accidentals | 6.9 by 22 | 11 / 11 | 24.7 / 24.7 |

Every cell in a row is now identical on all four sides, and identical to its
neighbours.

**A first attempt measured the wrong thing, and it is worth recording because
it is the same trap as ruling 3's.** I reached for `getBBox` on an SVG
`<text>`, which returns the LAYOUT box: all nine glyphs measured 402 units tall
at 100 px, which is the em box, and the cells came out 3.8 px wide slivers.
Canvas `measureText`'s `actualBoundingBox*` are the inked bounds, relative to
the same origin and baseline an SVG `<text x="0" y="0">` uses, so they carry
across without conversion. That is what `measureGlyphs` uses
(`CorrectionDock.svelte:201`).

**Measured rather than declared, on purpose.** The numbers are also in
`FinaleMaestro.json`'s `glyphBBoxes`, and reading them there would be right for
exactly one face and would cost a second parse of a 386 KB file on a phone.
Measuring what the browser drew is right for whichever face is loaded,
including the day someone chooses Bravura or Leland.

**One consequence you should look at before you accept it.** At one scale per
row, the whole note draws as a small oval, 10.6 by 6.7 px, because a whole note
IS a notehead with no stem while a sixteenth is four stave spaces of ink. That
is engraving-true and it is what makes the row read as one system. The
alternative is to fit each glyph to its own cell, which gives every duration
the same visual weight the way Finale's own palette does, at the cost of
drawing a whole note as tall as a sixteenth. **I chose true. Say the word and
it is one number.**

A second thing broke on the way and is fixed: making the cell a flex box so a
drawing could centre on both axes swallowed the space in `▲ step`, which came
out `▲step`. `CorrectionDock.svelte:601` puts it back as a gap.

## 7. Not established

Carried forward from r1, unchanged, and still true:

- **The right ink step between the page's two states.** 0.78 is a first
  reading, not a derivation.
- **Whether 2.4 should multiply the thumbnail or the engraved page.** Portrait
  gives 1.12 times the engraved page; landscape, where the page is not fitted,
  gives 2.4 times it.
- **Coarse-pointer behaviour.** Every number is CSS geometry in a fine-pointer
  browser with touch emulation on. The 44 px floor is verified in the DOM and
  unverified on glass.
- **The dense-page case**, and **thumb reach for a left-anchored dock in
  landscape**.
- **iOS Safari specifically.** Everything here is Chromium. Two things a real
  Safari should settle: whether `pointerup` gives the swipe the same numbers,
  and how a fixed dock behaves under Safari's collapsing toolbars. **A third
  joins them now**: `measureText`'s inked bounds are supported there, but the
  glyph boxes on your phone are unmeasured, and if they came back zero every
  cell would draw its word instead of its glyph, which is the fallback and not
  a failure.
- **A long Undo sentence in landscape.** The dock fits 430 px exactly with a
  short pill.
- **Whether the semitone verbs are meant to be retired everywhere.** The
  desktop drawer still carries them and desktop was out of scope.

New with this round:

- **Whether the two lyric anchors should stay two.** Ruling 2 changed the dock
  and left the drawer, because the drawer is desktop. They now disagree on
  purpose.
- **Whether a whole note should draw true or draw to fit**, §6.
- **The insertion bar has no pitch crossbar.** The schematic pairs the bar with
  a horizontal crossbar stating the pitch. You ruled the bar; I did not add the
  crossbar, because you did not name it and the readout already states the
  pitch in words.

## 8. Housekeeping

The dev server on port 5174 is stopped. Nothing was copied into the
repository's static directories. Walk scripts and screenshots are in this
session's scratchpad, outside the tree.
