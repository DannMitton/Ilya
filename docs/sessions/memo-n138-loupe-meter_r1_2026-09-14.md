# Memo: N.138, the loupe supplies the meter for every measure it shows

Revision 1, 2026-09-14. Written by Claude Code, built to
`brief-n138-loupe-meter_r1_2026-09-14.md`. **Not committed and not staged.**

**Status: WRITTEN and walked in the dev server's browser pane at 390 px and at
1024 px, on both of the brief's scores. Not yet walked by Dann on a deploy.**

---

## 1. What changed, by file and line

Line numbers are as the files stand now, uncommitted.

### `apps/web/src/lib/shane/loupe.ts`, all additions

- `:368` `METER_RUN_IN_SP = 2.5`, the air from the meter to the music. Gould
  r240, the figure the renderer already uses after its key signature.
- `:378` `METER_LEAD_SP = 1`, the air from the key signature to the meter.
- `:381` `MeterDigit`, `:388` `MeterLayout`.
- `:441` `meterLayout(beats, beatType, digit, lineGap, staffTop, headAir, bodyAir)`.
  Lays the count over the unit from the font's own bounding boxes. Each side adds
  only the air its neighbouring crop lacks. It returns null for a signature no
  digit can spell.

### `apps/web/src/lib/shane/loupe.test.ts`

- `:521` `describe('the meter panel')`, six tests: baselines, ink width and
  centring, the full run-in, the partial run-in, the lead before the key
  signature, and the null cases. The digit boxes are synthetic, so the
  expectations do not borrow values from the metadata under test.

### `apps/web/src/lib/shane/Loupe.svelte`

- `:83` new optional prop `meter`, and `:110` its default of null.
- `:350` loads the notation face's metrics through the shared memoized loader,
  which hands back the promise the page already made.
- `:365` `DIGIT_GLYPHS`, `:371` `MeterPanel`, `:402` `Frame.meter`.
- `:693` to `:794`, in the frame effect: reads the page's clef `<text>` for the
  face, size and fill. Measures the head's trailing air and the body's opening
  air. Finds the five stave lines and the page's ground as drawn. Calls
  `meterLayout`. Draws nothing if the page is still in primitive shapes or in a
  face the loader did not hand back.
- `:796` `totalSpan` now includes `meterSpanUnits`, and `:802` derives
  `meterWidth`.
- **`:197` `FRAME_SIDES` and `:797` `fitWidth`: a fix outside the brief, see §5
  decision 3.** The fit and `windowScale` (`:950`) now take the window's inner
  width instead of the frame's outer width.
- **`:869`: the selection ring is clamped inside the body's crop in the clone.**
  This happens only while a meter panel draws. See §5 decision 4.
- `:976` the frame carries `meter`.
- `:1101` the panel's `<svg>`: the page's ground rectangle, then the five stave
  lines, then the digits.
- `:1282` `.loupe-meter` takes `pointer-events: none` with `.loupe-head`.

### `apps/web/src/routes/+page.svelte`

- `:770` `heldMeasure`, one lookup now shared by `heldFill` and the new
  `heldMeter` at `:783`.
- `:4940` `meter={heldMeter}` on `<Loupe>`.

### `apps/web/src/lib/shane/VoiceProfilePane.svelte`

- **`:374`: a fix outside the brief, see §5 decision 5.** The selection effect's
  two sweeps now run inside each `.fit-paper-container` instead of across the
  whole document.

---

## 2. Measurements

> **CORRECTION, 2026-09-14, added by the desk after this memo was written.**
> **Every number in this section was measured at `METER_RUN_IN_SP = 2.5`. The
> constant is now 2**, on Dann's ruling, per `OPEN.md` §N.138 and Gould rule 240's
> time-signature row. The panel is therefore **2.75 page units narrower** than the
> table records, half a stave space, and every capped measure recovers a little
> scale. **The table is left exactly as measured rather than re-estimated**, per
> the standing rule against printing a number nobody read off an instrument. The
> measurements to trust after the ship are the ones taken on the walk.


**Instrument.** Dev server, in-app browser pane, viewport emulated at 390 × 844,
phone modality, so magnification is the ruled 2.4. Each reading comes from the
rendered loupe's own `viewBox` and `width` attributes. "Shipped" and "meter
only" are computed from the same `head`, `meter` and `view` spans with the
shipped cap formula. "As built" is read off the drawn body's width divided by
its `viewBox` width. **The pane was hidden for part of the run.** The timer
throttle was lifted with the near-silent tone before the survey, and every
number below was re-read after the lift.

### My expectation, stated before the first measurement

> A sung 12/8 measure on Sunless 01 is about 20 stave spaces wide, and the head
> about 7. The panel for 12/8 is about 2.6 spaces of digit ink plus up to 2.5 of
> run-in. At 390 px I expect the frame to hit its width cap, so the measure
> shrinks by the ratio of old to new total span: about 15% smaller on a measure
> that opens a system and about 10% smaller mid-system. Likeliest failure: the
> staff-line search misses a line, so the stave looks broken at the panel's
> edges.

**Against it.** The expectation was wrong in its premise. **Not every measure
meets the cap.** On Sunless 01, 7 of 17 sung measures fit uncapped, and 4 of
those 7 did not shrink at all. Where the panel's cost lands, it is 7% to 8%,
not 10% to 15%. The staff-line search found five lines on every one of 84
measures. The failures I did not predict were three others, in §3.

### Engraved Without Sun song 1, all 17 sung measures, 390 px

Units are page units, 5.5 to a stave space. The stave-space columns are CSS
pixels. "Clipped" is how many pixels the shipped code drew beyond the loupe's
277 px window.

| m. | meter | head | panel | view | shipped | meter only | as built | clipped |
|---|---|---|---|---|---|---|---|---|
| 2 | 12/8 | 94.75 | 25.62 | 237.20 | 4.96 | 4.60 | 4.25 | 22.8 |
| 3 | 12/8 | 94.75 | 27.92 | 242.28 | 4.88 | 4.51 | 4.17 | 22.8 |
| 4 | 12/8 | 63.54 | 31.39 | 177.59 | 5.53 | 5.53 | 5.53 | 0 |
| 5 | 12/8 | 63.54 | 28.60 | 191.41 | 5.53 | 5.53 | 5.36 | 0 |
| 6 | 12/8 | 63.54 | 25.28 | 185.53 | 5.53 | 5.53 | 5.53 | 0 |
| 7 | 12/8 | 63.51 | 31.42 | 272.08 | 4.90 | 4.48 | 4.14 | 22.8 |
| 8 | 12/8 | 63.51 | 29.82 | 275.00 | 4.86 | 4.47 | 4.13 | 22.8 |
| 9 | 12/8 | 64.86 | 30.07 | 273.24 | 4.87 | 4.47 | 4.13 | 22.8 |
| 10 | 12/8 | 64.86 | 28.08 | 276.22 | 4.83 | 4.46 | 4.12 | 22.8 |
| 11 | 12/8 | 67.31 | 28.18 | 280.40 | 4.73 | 4.38 | 4.04 | 22.8 |
| 12 | 12/8 | 67.31 | 25.74 | 268.54 | 4.90 | 4.55 | 4.20 | 22.8 |
| 13 | 12/8 | 62.98 | 31.95 | 189.13 | 5.53 | 5.53 | 5.35 | 0 |
| 14 | 12/8 | 62.98 | 29.89 | 179.31 | 5.53 | 5.53 | 5.53 | 0 |
| 15 | 12/8 | 62.98 | 29.86 | 186.71 | 5.53 | 5.53 | 5.44 | 0 |
| 16 | 12/8 | 66.02 | 28.91 | 259.18 | 5.06 | 4.65 | 4.29 | 22.8 |
| 17 | 12/8 | 66.02 | 26.83 | 291.30 | 4.61 | 4.28 | 3.96 | 22.8 |
| 18 | 12/8 | 67.77 | 28.18 | 173.48 | 5.53 | 5.53 | 5.53 | 0 |

**Scale, the brief's representative measure, m. 4:** `scale` 1.0059 before and
after, and the stave space 5.53 px before and after, because m. 4 does not meet
the cap. **The worst measure is m. 17:** `scale` 0.8382 shipped, 0.7782 with the
meter, and 0.7200 as built. The stave space falls from 4.61 px to 3.96 px, 14%
smaller. About half of that loss is the meter panel, 4.61 to 4.28. The other
half is the clipping fix, 4.28 to 3.96, which buys back the 22.8 px the shipped
loupe was cutting off.

**Whether 3.96 px is a readable stave is NOT ESTABLISHED.** No source in the
tree sets a floor. For scale, the page thumbnail at 390 px draws 2.30 px, so the
worst loupe is still 1.72 times the page. I did not stop the build on it,
because I cannot say it crossed a line nobody has drawn. **This is yours to
judge on the walk.**

### Kabalevsky T05, all 67 sung measures, 390 px

Every measure draws 2/4 with five stave lines. **No T05 measure meets the cap,**
so the meter panel costs no scale anywhere in it. The stave space reads 5.53 to
5.59 px as built against 5.57 shipped. That spread comes from the instrument,
not the panel: the reading takes `lineGap` from the page's first hit, and no
measure's `scale` changed. Panel widths run 9.88 to 26.01 units.

### Desktop, 1024 px

One observation only, T05 m. 15: head 155.7 px, panel 23.4 px, body 188.6 px, in
a 692 px window. It draws 2/4 on one unbroken stave. No survey was run at this
width.

---

## 3. What the walk found, in order

1. **The meter touched the key signature.** The first build added no air on the
   left, because I assumed the head already ended 2.5 spaces after the key
   signature. **That assumption was wrong.** On m. 4 the head ends on the first
   note's flat, 0.42 of a space after the second sharp. The fix measures the
   head's trailing air and adds `METER_LEAD_SP` less what is already there.
2. **The selection ring tore in two.** The ring is the one mark the head's bound
   skips on purpose, so on m. 4 it opened at 62.38 with the head ending at
   63.54. With the crops flush the halves met. With the panel between them, the
   ring's left side stood alone in the head. The fix clamps the ring inside the
   body, in the clone only. **The first fix clamped by half a stroke, and it
   failed:** the stroke's outer edge then sat on the head's edge, and the head
   painted a grey hairline the height of the ring. I tethered the hairline to
   the ring by its height and position, then clamped by a whole stroke. The
   hairline is gone on the next observation.
3. **The panel showed as a pale strip.** The renderer still paints a cream
   ground behind each system, and the panel had none. The panel now repeats the
   page's ground rectangle, found as drawn. When N.133 removes that ground, the
   panel finds nothing and paints nothing.
4. **Capped measures were clipped, before this change.** See §5 decision 3.
5. **The loupe leaked a full system clone on every step, before this change.**
   See §5 decision 5. It showed on T05 m. 90 as a notch in the ground above
   the panel.

---

## 4. Gates

| gate | result | baseline | moved |
|---|---|---|---|
| 1 phonology | 216 passed (216) | 216 | no |
| 2 dictionary | 235 passed (235) | 235 | no |
| 3 web-check | 0 errors and 7 warnings in 4 files | same | no |
| 4 web-test | **1150 passed (1150)** | 1144 | **+6**, the six `meterLayout` tests |
| 5 score-parser | 547 passed, 5 skipped (552) | same | no |

**`~/Downloads/ilya-ship.sh:79` still reads `1144 passed (1144)`, so the script
will refuse the ship until that line moves to 1150.** I did not edit it: it is
outside the repository, and §THE DESK MOVES THE GATE LINE gives that job to the
desk.

---

## 5. Decisions the brief did not settle. All mine, all reversible

1. **The lead before the meter is one stave space**, `METER_LEAD_SP`. The source
   is the renderer's own clef-to-key separation (Gould r236), borrowed. Gould's
   figure for key to meter was not read, because the book is not on this machine.
2. **On a mid-system measure the meter sits beside the music, not beside the key
   signature.** The head is the system's own left edge up to its first music
   ink, and on m. 2 and m. 3 that edge carries about 8 spaces of air after the
   key signature. The panel cannot sit inside the head without moving
   `headBound`, which the brief forbids. So the loupe reads clef, key signature,
   air, 12/8, music. **This is a taste question about how the loupe looks, and
   I did not decide it for you.** A drawing would settle it faster than prose.
3. **The fit now uses the window's inner width.** `FRAME_SIDES = 2 * (10 + 1.4)`,
   read from `.loupe`'s padding and border. The shipped fit capped the drawing
   at the frame's outer width, 299.25 px, while the window inside is 277 px. So
   10 of Sunless 01's 17 sung measures were drawn 22.8 px too wide and cut about
   11 px at each edge, before N.138. I observed it on m. 3: the stave's left end
   and the closing eighth rest were cut. The meter panel pushed m. 5 into the
   same fault. The fit's own comment says a measure is shown whole rather than
   clipped, so this makes the arithmetic agree with it. **Cost: capped measures
   draw about 7% smaller than the shipped loupe drew them.** Reverting means
   restoring `width` at `Loupe.svelte:797` and `:950`.
4. **The ring is clamped in the loupe's clone only**, and only while a meter
   panel draws. The page's own ring is not touched.
5. **`VoiceProfilePane.svelte:374` now sweeps rings only inside the page.** The
   selection effect removed every `[data-selection-ring]` in the document. The
   loupe's clone carries that ring as the first node of its `{@html}` range, and
   Svelte removes a replaced range by walking `nextSibling` from that first node
   (`node_modules/svelte/src/internal/client/reactivity/effects.js:548`,
   `remove_effect_dom`). A detached node has no sibling, so each old clone
   stayed.
   - **Measured on the shipped `Loupe.svelte`,** restored temporarily from
     `HEAD` and then put back: 14 stacked clones in each crop after 30 steps.
   - **Measured before the fix:** 152 clones and 18,805 nodes in each crop after
     one pass over T05.
   - **Measured after the fix:** one clone per crop after 60 steps.
   - **Consequences, and the second is the serious one.** Every stale clone
     carries its own `[data-loupe-hit]` rectangles, and `handleTap` searches
     every one of them. The loupe's own ring also lost its `data-note-selected`
     to the same sweep, and the pane's stylesheet hides a ring without it.
   - **Whether a tap ever picked a stale measure's entry is NOT ESTABLISHED.**
     I did not test it.
6. **Digits always**, and the other three desk defaults, as the brief ruled.

---

## 6. NOT ESTABLISHED

NOT ESTABLISHED beats a complete invented answer.

- **Measure 1 of Sunless 01 shows no meter, because no loupe rises on it.** It
  holds no vocal events, so `ownIds` is empty and the loupe returns early. The
  brief's walk says the loupe must show 6/8 on m. 1. That cannot happen without
  raising the loupe on a tacet measure, which is the open tacet ruling in
  `STATE.md`. **The 6/8 was therefore never observed. Every measure the loupe
  can raise on shows 12/8.**
- ~~**Whether 3.96 px is a readable stave.**~~ **SETTLED 2026-09-14 BY DANN, and
  it is no longer open.** He was shown all five scales drawn at true CSS pixel
  size in `drawing-loupe-stave-scales_r1_2026-09-14.html`, with the Cyrillic and
  IPA sizes computed from `engraving.ts:31` and `staff-renderer.ts:2697`,
  `:2702`. **His words: they are all legible, and everything reads well.** He
  also noted that the 390 px page thumbnail reads as a reference thumbnail and
  nothing else, which is what it is for. **So the clipping fix of §5 decision 3
  stands, the meter panel stands, and nothing is reverted.**
- **Whether the stacked hit targets ever misdirected a tap** before the §5
  decision 5 fix.
- **Bravura and Leland were not walked.** The page only loads Finale Maestro
  outside the font lab, and the panel draws nothing for a face whose metrics the
  loader did not return.
- **The printed page is untouched.** The panel lives in the loupe, which prints
  nothing. No print preview was taken.
- **No production build was walked.** Every observation is from `vite dev`.
- **A measure with a common-time or cut-time symbol was not walked.** Neither
  score carries one.
- **Why the pane's screenshots twice showed a frame older than the DOM** during
  fast stepping. I re-took each screenshot after a wait and trusted the DOM
  readings over the pictures.
- **`docs/sessions/brief-n119-toggles-reach-score-markup_r1_2026-09-12.md`
  changed during this session**, along with two new untracked files,
  `brief-n139-page-meter-signature_r1_2026-09-14.md` and
  `spec-loupe-french_r1_2026-09-14.md`. None of them is mine.
