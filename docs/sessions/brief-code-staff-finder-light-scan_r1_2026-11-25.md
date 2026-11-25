# Brief: the staff finder on a light scan (Code, new cloud lane), r1

Written by the desk 2026-11-25. Every line citation below was read by the desk in this session from `Shane` at `63e5101b`.

**The ask this serves**, Dann 2026-11-25 02:56, transcribed as written: *"make the staff finder work on this page, which unblocks notes, metre, and words at once; and then the written-out verses on top of it."*

The written-out verses are a second brief and ride on top of this one. This brief is the staff finder alone.

## What the singer meets, and why this is first

She brings a published scan of a Russian song, Alyabyev's «Соловей» in Jurgenson's 1901 edition, and Ilya reads nothing from it: no metre, no lyric band, no words under the notes. It is not a poor read. It is no read at all, on a page that is legible to the eye.

The three roads out of the page all run through one function, so they fail together:

- the metre reader counts the staff as unfound and never reaches `windowsOf` (`apps/web/src/lib/omr/metre-model.ts:137`, `:139`);
- the lyric band gets no placed staff, and `systemsOf` returns an empty list, which is zero systems (`apps/web/src/lib/omr/underlay-prepare.ts:215`, `:217`; `underlay-band.ts:126`);
- the OCR never runs, because it runs on rows cut from a band that does not exist.

This page is also the only real printed strophic Russian score the project holds, and it is the road into walks 4 and 5 of N.220, both of which are scan walks. Until the staves are found, neither walk can be taken.

## The cause, measured

Measured by a Sonnet helper 2026-11-25 with a Python port of the rule and two control pages: `~/Downloads/_desk-staffin-2026-11-25/report-sonnet-staffin-failure_r1_2026-11-25.md`, scripts beside it. Read in full by the desk.

`staffIn` asks whether a pixel is ink by one page-wide constant: `const INK = 140` (`apps/web/src/lib/omr/metre-windows.ts:44`), tested at `:67-69`. A row counts as part of a line only where at least half the pixels across the strip are ink (`:208`, `:216`, `lineRows` `frac` 0.5).

On this page the staff rules measure a core grey of 173 to 184 against paper at 221 to 227. Between 9 and 15 per cent of the columns along a rule hold a pixel under 140, so no row of any strip reaches half, `fives` never finds five rows, `sp` stays empty, and `:210` returns null. Sixteen staves, sixteen nulls.

The port reproduces it: 0 of 16 at the shipped threshold, 16 of 16 at 195 to 200, across four resamplers and Poppler's own render. Controls at the shipped threshold: song1 page 1, 12 of 12 found; Without Sun page 5, 9 of 9 found.

**Tilt, staff space, staff width, and strip width are all inside the rule and are not the cause.** The page tilts at most 0.17 degrees, against song1 page 1 at up to 0.90 degrees, which the finder handles.

**A second rule is marginal, and it only shows once the first is relaxed.** The rules are 0.44 to 0.53 of a staff space thick, against the ceiling of `0.45 * s` at `:104-105`. In the port's sweep, found counts rise to 16 at 195 and fall away again above 205 as the thickening rules breach that ceiling. So the page sits inside a window about twenty grey levels wide, and a raised constant alone is a repair that holds by luck.

## What the desk saw on the page itself

The desk opened page 4 and looked at it (`CONTRACT.md` section 0.3).

**Only the staff rules are light.** The noteheads, stems, beams, barlines, the time signatures, the Cyrillic and German underlay, the verse labels, and the publisher's line all print dark. The five rules of each staff are the one class of ink on this page that sits near the paper.

This bounds the work. The other ink tests downstream act on glyph ink, not on rule lines, so they are not presumed broken by the same cause. Step 0 reports whether they hold rather than assuming it.

The page also carries sixteen staves in seven labelled verses, «Купл. 1.» to «Купл. 7.» with «Vers 1.» to «Vers 7.» beneath, two underlay lines per system, Russian above and German below. That is the second brief's material and nothing in this one touches it.

## What the tree already holds, and why none of it is the repair

Searched by the desk this session across `apps/web/src/lib/omr/` and `packages/` (`CONTRACT.md` section 4, search before proposing to add anything). What came back:

1. **`stretchBand` (`apps/web/src/lib/omr/underlay-looks.ts:66-73`)** already stretches a band's own ink and paper tones to black and white, and is already the fourth look the underlay reader takes when a band's ink is too pale for the cut. **It does not repair this page.** It anchors the dark end on the grey at the 1st percentile (`INK_PERCENTILE`, `:28`), which on this page is the notehead ink, not the rules. A linear stretch between notehead ink and paper leaves the rules in the same place relative to the threshold. Arithmetic on the report's own figures: page ink at the 1st percentile 89, paper 224, a rule core of 175 maps to about 162, which is still above 140. Do not reach for this function.
2. **`paperTone` (`underlay-frame.ts:133-140`)**, the most frequent grey of a crop. Sound, cheap, and reusable as the paper anchor here.
3. **`INK_BELOW_PAPER = 60` with `paperOf` (`underlay-rows.ts:60`, `:85-94`)**, a page-relative ink rule that already exists for the lyric rows. **Its margin is too wide for this page:** paper 224 less 60 is 164, and the rules sit at 173 to 184, so lifting this constant across unchanged would still find nothing. The shape is right; the number is not.
4. **Row 117's image-cleaning measure** (`docs/sessions/report-desk-row117-image-cleaning_r1_2026-10-27.md`) measured Sauvola thresholding and found it changed nothing. **That finding does not transfer and must not be cited against this work.** Its own words: the crops it ran on were two-level, pixels only 0 and 255, so no threshold could act. This page is continuous grey. Row 117 says nothing about it.

So the mechanism to build is new, the tree holds the parts, and one existing function that looks like the answer is not.

## The rule to build

**The staff finder judges ink by the page it is reading, not by a constant.** The constant 140 becomes a special case of the page's own measurement.

The threshold is computed once per page, from the page's own greys, and passed into `staffIn` rather than read from module scope. The thickness ceiling at `:104-105` is re-derived at whatever threshold the measurement selects, because the two are entangled: raising the ink level thickens every run of rows, and a ceiling tuned at 140 does not hold at 195.

**Step 0 selects both numbers by measurement. The desk does not hand you either one.** What the desk fixes is the shape: page-relative, one computation, two constants chosen together, and no page-specific special case anywhere.

### Step 0: the sweep, and the real raster (measure only, keeps nothing)

0a. Save the greyscale page the browser actually produces. `rasterizePdf` (`apps/web/src/lib/omr/page-pdf.ts`) makes it; `greyscaleCanvasToPng` (`page-image.ts:139-155`) writes it. Save that PNG for page 4 of `~/Downloads/IMSLP952372-PMLP60466-Nightingale.pdf` and report its paper tone, its grey at the 1st percentile, and the rule core grey of three staves. The helper's measurements came from Python renders, not from pdf.js in Chrome, and that gap is the one thing in the cause that is not established on Ilya's own path.

0b. Sweep the ink threshold and the thickness ceiling together, as a grid, over every page of the fixture set plus these three: Nightingale page 4, song1 page 1, Without Sun page 5. Report, per page, the staves found against the staves present.

0c. Report whether the glyph-ink tests hold on this page once the staves are found: the metre digit profile and the mark test (`metre-reader.ts:348`, `:427`, both `< 128`), and the lyric band's own test (`underlay-frame.ts:122`, `INK_BELOW = 128`). The desk's reading from the page is that these act on dark ink and are unaffected. Confirm or refute it. Do not change them in this lane.

**Done when:** one table gives, for every page measured, the threshold rule and thickness ceiling at which it finds every staff it holds, and a second table names any page that loses a staff it finds today.

### Step 1: the page's own ink level

Compute the threshold from the page once, before any staff box is read, and pass it to `staffIn`, `lineRows`, and `fives`. Take the paper anchor from `paperTone`, which exists. Take the dark anchor and the rule that joins them from step 0's result.

**The number is derived, never a table of pages.** No branch anywhere names a file, an edition, a publisher, or a pixel size.

**Done when:** `metre-windows.ts` holds no page-wide ink constant, the threshold arrives as an argument, and the existing tests in `metre-windows.test.ts` pass unchanged, because their synthetic pages are black on white and the derived threshold on them lands where 140 did.

### Step 2: the thickness ceiling at the chosen level

Re-derive `0.45 * s` (`:104-105`) at the threshold step 1 selects, from step 0's grid. The comment at that line says what it is for; replace it with one that says what the number now is and which measurement set it.

**Done when:** on the sweep's grid, the chosen pair finds 16 of 16 on Nightingale page 4, 12 of 12 on song1 page 1, and 9 of 9 on Without Sun page 5, and no fixture page loses a staff.

### Step 3: the three roads out

With the staves found, run the page end to end and report what the metre reader, the lyric band, and the OCR return on it. **This is a report, not a repair.** If a road fails for a new reason, name it and stop; it becomes its own row.

**Done when:** the report names, for Nightingale page 4, the metre read per system, the number of systems the band found, and the number of rows the OCR cut.

## Every other site that computes this number

`CONTRACT.md` section 4: a brief that changes how a number is computed names every other site that computes the same number and says what depended on them agreeing.

| site | rule | changed here |
|---|---|---|
| `omr/metre-windows.ts:44`, `:67-69` | `INK = 140` | **yes, this lane** |
| `omr/tuplet-number.ts:69`, `:83`, `:149` | `INK = 140` | no |
| `omr/metre-reader.ts:348`, `:427` | `< 128` | no |
| `omr/underlay-frame.ts:122` | `INK_BELOW = 128` | no |
| `omr/underlay-rows.ts:60`, `:85-94` | paper tone less 60 | no |

**What depended on them agreeing.** The metre reader reads its digits inside the window the staff finder located, on the same raster, and the lyric band is cut from the same page by the staff the finder returned. Today all of them see the same two-level page, because 140 and 128 are close and both pages they were tuned on are high-contrast. After this lane the staff finder sees a page the other four may not. **That is the reason step 0c exists and reports before anything else moves.** The desk's reading, from looking at this page, is that the other four act on dark ink and hold; if step 0c refutes it, each becomes its own row and none is changed inside this lane.

## Constraints

- No file outside `apps/web/src/lib/omr/` and its tests changes in this lane.
- One vowel per note (`CONTRACT.md` section 0.1) is untouched by this work and must stay untouched: nothing here writes text to notes.
- Positions come from evidence, never from an arbitrary rule (`CONTRACT.md` section 0.2). The threshold is derived from the page's ink; it is not a proportion chosen for convenience.
- All eight gates at baseline. No baseline moves without saying which and why.
- No `git add`, `commit`, `push`, `checkout`, `reset`, `merge`, or `rebase` on `Shane` or `main`. This lane runs on its own branch and Dann merges.
- Every figure in the return memo names the file it was printed from.

## NOT ESTABLISHED

**NOT ESTABLISHED beats a complete invented answer.**

- What pdf.js and Chrome produce for this JPEG. Step 0a settles it.
- Whether a changed threshold is safe on every fixture page. Step 0b settles it.
- homr's actual staff boxes for this page. The helper built its own; sixteen boxes all missing the staff is unlikely given homr reported sixteen staves, but that is an inference, not a measurement.
- Whether the three roads work on this page once the staves are found. Step 3 reports it and repairs nothing.
- What a singer sees on screen today when this page is read. The desk did not open Ilya with it. Say what she saw if your run shows it.

## Return memo

One file at `docs/sessions/report-code-staff-finder-light-scan_r1_2026-11-25.md`:

1. Step 0's two tables, with the file each figure was printed from.
2. The threshold rule and the thickness ceiling chosen, and the measurement that chose them.
3. Staves found against staves present, for every page measured, before and after.
4. Step 3's three figures for Nightingale page 4.
5. Step 0c's answer on the four other ink tests.
6. What you could not establish.
