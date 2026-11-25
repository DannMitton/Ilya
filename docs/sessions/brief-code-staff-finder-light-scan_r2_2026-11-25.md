# Brief: the staff finder on a light scan (Code, Mac lane), r2

Written by the desk 2026-11-25. r2 applies all nineteen amendments and both blockers from Fable's review of r1 (`review-fable-brief-staff-finder_r1_2026-11-25.md`, DO NOT SEND, 169,138 tokens, 18 tool uses, 5.3 min, cap 250k). r1 is superseded and is not to be sent. Every line citation below was read by the desk in this session from `Shane` at `63e5101b`.

**The ask this serves**, Dann 2026-11-25 02:56, transcribed as written: *"make the staff finder work on this page, which unblocks notes, metre, and words at once; and then the written-out verses on top of it."*

The written-out verses are a second brief and ride on top of this one. This brief is the staff finder alone.

**THIS IS A MAC LANE, and that is not a choice.** Every page the lane must measure is on Dann's Mac and untracked, and `CONTRACT.md:106` exception (b) rules that the scan reader stays on the Mac. The desk searched for a later ruling lifting that and found none. A cloud session has no bridge to the Mac (`docs/memory/ENVIRONMENT.md:6128-6132`), so on a cloud lane steps 0a, 0b, 0d, 2, and 3 cannot produce one figure. r1 said "cloud lane" and was wrong.

**The three pages, by full path on the Mac:**
- `~/Downloads/IMSLP952372-PMLP60466-Nightingale.pdf`, page 4 (the page that fails).
- `~/Downloads/_colleague-pages/run-2026-10-19/songs/song1.pdf`, page 1 (control).
- `~/Downloads/IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf`, page 5 (control).
- The measured report and its scripts: `~/Downloads/_desk-staffin-2026-11-25/`.

## What the singer meets, and the desk looked at it

**Looked at by the desk 2026-11-25 in Dann's Chrome, on `66dfb5f9` at `ilya-bj4qpusik-dannmittons-projects.vercel.app`, with the page already in his repertoire as `alyabyev-solovey-strophic-p4`.** This replaces r1's reasoning about what she meets, which was taken from the code alone.

**The music is drawn and the words are not there at all.** MELODY draws the staves, the notes, the clef, one flat, and 2/4. Under the notes there is nothing: no Cyrillic, no IPA, not one syllable. The title stands at its placeholder, "Aria or song title". The sixteen staves are drawn as one continuous song, bars numbered straight through, rather than as the seven labelled verses the page prints.

So the singer does not meet a poor read. She meets a legible page that came back as music with no words, from a published score she can read with her eyes.

The three roads out of the page run through one function, and they fail together:

- the metre reader counts the staff as unfound and never reaches `windowsOf` (`apps/web/src/lib/omr/metre-model.ts:137`, `:139`);
- the lyric band gets no placed staff, and `systemsOf` returns an empty list, which is zero systems (`apps/web/src/lib/omr/underlay-prepare.ts:215`, `:217`; `underlay-band.ts:129`);
- the OCR never runs, because it runs on rows cut from a band that does not exist.

This page is also the only real printed strophic Russian score the project holds, and it is the road into walks 4 and 5 of N.220, both of which carry a scan (`OPEN.md`, N.220, walks 4 and 5). Until the staves are found, neither walk can be taken.

## The cause, measured

Measured by a Sonnet helper 2026-11-25 with a Python port of the rule and two control pages: `~/Downloads/_desk-staffin-2026-11-25/report-sonnet-staffin-failure_r1_2026-11-25.md`, scripts beside it. Read in full by the desk.

`staffIn` asks whether a pixel is ink by one page-wide constant: `const INK = 140` (`apps/web/src/lib/omr/metre-windows.ts:44`), tested in `inkAt` at `:67-69`. A row counts as part of a line only where at least half the pixels across the strip are ink (`:208`, `:216`, `lineRows` `frac` 0.5).

On this page the staff rules measure a core grey of 173 to 184 against paper at 221 to 227. Between 9 and 15 per cent of the columns along a rule hold a pixel under 140, so no row of any strip reaches half, `fives` never finds five rows, `sp` stays empty, and `:210` returns null. Sixteen staves, sixteen nulls.

The port reproduces it: 0 of 16 at the shipped threshold across four resamplers and Poppler's own render; 16 of 16 at 195 and 200 on the one bilinear render the sweep ran on. Controls at the shipped threshold: song1 page 1, 12 of 12 found; Without Sun page 5, 9 of 9 found.

**Tilt, staff space, staff width, and strip width are all inside the rule and are not the cause.** The page tilts at most 0.17 degrees, against song1 page 1 at up to 0.90 degrees, which the finder handles.

**A second rule is marginal, and it only shows once the first is relaxed.** The rules are 0.44 to 0.53 of a staff space thick, against the ceiling of `0.45 * s` at `:104-105`. In the port's sweep the found count is 15 of 16 at 190, 16 at 195 and 200, 13 at 205, and 0 at 215 (report line 75). So the page passes inside a window no wider than fifteen grey levels, sampled every five, and the 0.45 ceiling's margin above the working level is five to ten grey levels. A raised constant alone is a repair that holds by luck.

## What the desk saw on the page itself

The desk opened page 4 and looked at it (`CONTRACT.md` section 0.3).

**Only the staff rules are light.** The noteheads, stems, beams, barlines, the time signatures, the Cyrillic and German underlay, the verse labels, and the publisher's line all print dark. The five rules of each staff are the one class of ink on this page that sits near the paper.

**That bounds the work, but it does not clear every other ink test, and r1 said it did.** Three of the four other ink sites act on glyph ink. The fourth does not: `tuplet-number.ts:83`, inside `staffSpace` (`:72-99`), measures the staff space as "the commonest distance between thin black runs" (module doc `:13-14`) at the same `INK = 140`, and `:149` removes staff lines at the same constant. Those thin black runs are the rules. It is live (`homr-reader.ts:38`), and it is presumed to fail on this page for the same cause. Step 0c measures it rather than presuming either way.

The page also carries sixteen staves in seven labelled verses, «Купл. 1.» to «Купл. 7.» with «Vers 1.» to «Vers 7.» beneath, two underlay lines per system, Russian above and German below. That is the second brief's material and nothing in this one touches it.

## What the tree already holds, and why none of it is the repair

Searched by the desk this session across `apps/web/src/lib/omr/`, `apps/web/src/lib/reader/`, and `packages/` (`CONTRACT.md` section 4, search before proposing to add anything). What came back:

1. **`stretchBand` (`apps/web/src/lib/omr/underlay-looks.ts:64-73`)** already stretches a band's own ink and paper tones to black and white, and is already the fourth look the underlay reader takes when a band's ink is too pale for the cut. **It does not repair this page.** It anchors the dark end on the grey at the 1st percentile (`INK_PERCENTILE`, `:29`), which on this page is 89, far darker than the rules. The stretch is therefore the same as a raw threshold of 89 + 140 × 135 / 255 = 163, and the port found 0 of 16 at 170 with the thickness rule switched off (report line 74). Do not reach for this function.
2. **`paperTone` (`underlay-frame.ts:133-140`)**, the most frequent grey of a crop. Sound, cheap, and reusable as the paper anchor here.
3. **`INK_BELOW_PAPER = 60` with `paperOf` (`underlay-rows.ts:60`, `:85-94`)**, a page-relative ink rule that already exists for the lyric rows. **Its margin is too wide for this page:** paper 224 less 60 is 164, and the rules sit at 173 to 184, so lifting this constant across unchanged would still find nothing. The shape is right; the number is not.
4. **Row 117's image-cleaning measure** (`docs/sessions/report-desk-row117-image-cleaning_r1_2026-10-27.md`) measured Sauvola thresholding and found it changed nothing. **That finding does not transfer and must not be cited against this work.** Its own line 8: the crops were two-level, pixels only 0 and 255, so no threshold could act. This page is continuous grey. Row 117 says nothing about it.

So the mechanism to build is new, the tree holds the parts, and one existing function that looks like the answer is not.

## The rule to build

**The staff finder judges ink by the page it is reading, not by a constant.**

The level is computed once per page, from the page's own greys, by one function called at both entry points (`metre-model.ts:137` through `metre.worker.ts:42`; `underlay-prepare.ts:215` through `underlay.worker.ts:77`), so "computed once" does not become two implementations. It is passed in rather than read from module scope. The thickness ceiling at `:104-105` is re-derived at whatever level the measurement selects, because the two are entangled: a row's thickness is the count of consecutive rows at or over half ink at the level (`:79-86`), tested at `:105`, so a higher level can only add ink.

**The rule is one closed-form expression of quantities measured on the page.** No branch, clamp, floor, fallback, or lookup keyed on paper tone, contrast, percentile, or any other measured grey. That includes `max(140, …)` and "else 140". If one expression cannot serve all the pages in the sweep, stop and report rather than making it piecewise.

**Step 0 selects the level and the ceiling by measurement. The desk does not hand you either one.** What the desk fixes is the shape above.

### Step 0: the sweep (measure only, keeps nothing)

**0a. Save the greyscale page the browser actually produces, and homr's boxes with it.** `rasterizePdf` (`apps/web/src/lib/reader/page-pdf.ts:143`) makes it; `greyscaleCanvasToPng` (`reader/page-image.ts:139-156`) writes it. Save that PNG for page 4 of the Nightingale PDF and report its md5, its `paperTone`, its grey at the 1st percentile, and the rule core grey of three staves. Report `paperTone` of the whole page beside the local paper of those three staves: the rasteriser paints the canvas white before the page (`reader/page-pdf.ts:210-211`), so on a scan that does not fill its PDF page the mode could be the margin rather than the paper. **Save homr's own staff boxes for that page from the same run.** The helper's measurements came from Python renders with boxes it built itself, and both gaps are settled here.
**Done when:** the PNG's md5 and those figures are printed, and homr's sixteen boxes are on file.

**0b. Sweep the level and the ceiling together, as a grid.** Run the tree's own `lineRows`, `fives`, and `staffIn`, on the pdf.js raster from 0a, with homr's own boxes. Axes: the level expressed in the candidate rule's own units (for example the share of the way from the dark anchor to `paperTone`), and the ceiling. Pages: the three named above, **plus held-out pages that take no part in choosing the pair**: Nightingale's other pages, song2 to song4 beside song1, and two further Without Sun pages.
**Done when:** one table gives, per page, the region of the grid in which `staffIn` returns a staff for every box homr gave, with homr's box count as "present" and the desk's own count from the page beside it; and a second table names any page that loses a staff it finds today.

**0c. Report what the four other ink sites return on this page**, with no change to any of them: the seat-row column ink `profiles` (`metre-reader.ts:333`, ink at `:348`); `cutRatio` (`metre-reader.ts:416`, ink at `:427`); `staffSpace` (`tuplet-number.ts:72-99`, ink at `:83`) and the staff-line removal at `:149`; `inkProfile` (`underlay-rows.ts:97-102`); and `hasStaves` through `darkThreshold` (`apps/web/src/lib/reader/staff-detect.ts:33`, used at `score/ScoreUploader.svelte:67`). The desk's reading is that the metre reader's two act on dark glyph ink and hold, and that `staffSpace` does not. Confirm or refute each.
**Done when:** for each site, the count or value it returns on page 4 stands beside the count a look at the page gives.

**0d. Report what else moves when the level moves.** `inkAt` has four readers inside the module, not one: `lineRows` (`:78`), `extent` (`:163`, the staff's left and right ends), `meanInk` (`:263`, the notehead and overshoot tests behind `isBar`), and `strokes` (`:294`, the bar-line columns). At the pair 0b selects, report per staff, on every page in the sweep: `x0` and `x1` from `extent`, the bar lines `barLines` returns, and `topLineBelow`'s result per system (`underlay-below.ts:75`, which calls `lineRows` and `fives` on the same page and so takes the same level and ceiling), each beside the same figure at the shipped constants for every page found today.
**Done when:** a table shows that no control or held-out page's `x0`, `x1`, bar-line count, or `topLineBelow` moved by more than a tolerance you state, or names each one that did.

### Step 1: the page's own ink level

Compute the level once per page, before any staff box is read, and pass it to every reader of `inkAt` (`metre-windows.ts:67-69`): `lineRows` (`:78`), `extent` (`:163`), `meanInk` (`:263`), and `strokes` (`:294`), and so through `staffIn`, `barLines`, and `windowsOf`. `fives` (`:94-111`) reads no pixel; it takes the thickness ceiling. `topLineBelow` (`underlay-below.ts:75`) calls `lineRows` and `fives` on the same page and takes the same level and ceiling. Take the paper anchor from `paperTone`, which exists. Take the dark anchor and the rule joining them from step 0b.

**Whether `extent`, `strokes`, and `meanInk` take that level or a darker one is decided by step 0d, never assumed.**

**Done when:** `metre-windows.ts` holds no page-wide ink constant; the level arrives as an argument; and every assertion in `metre-windows.test.ts`, `underlay-below.test.ts`, and `underlay-prepare.test.ts` passes with its expected values unchanged. Their pages hold only 0 or 20 against 255, so any level above 20 and at most 255 gives the same ink, and the derived level need not be 140. Where a call gains an argument (`staffIn` at `metre-windows.test.ts:33`, `:46`, `:60`; `barLines` `:47`; `windowsOf` `:48`, `:64`; `staffIn` at `underlay-below.test.ts:39`, `:71`), the call changes and the diff shows only that. State the level the rule gives on a blank page (`underlay-prepare.test.ts:186`, all 255) and on a page with under one per cent ink; neither may be NaN.

### Step 2: the thickness ceiling at the chosen level

Re-derive `0.45 * s` (`:104-105`) at the level step 1 selects, from step 0b's grid. **No comment stands at `:104-105`, and none at its source (`docs/sessions/measure-metre-r57-r6_2026-10-11/staff.py:44`): what the ceiling was set to reject is NOT ESTABLISHED in the tree.** Before changing it, report from 0b which candidates it rejects on the control pages at the shipped constants. Then add a comment saying what the number is and which measurement set it. The ceiling lives in the shared `fives`, so `topLineBelow` moves with it; 0d covers that.

**Done when:** the chosen pair finds 16 of 16 on Nightingale page 4, 12 of 12 on song1 page 1, and 9 of 9 on Without Sun page 5; no held-out page loses a staff; and the pair sits at least N rule-units and M ceiling-units inside every page's passing region, with N and M reported. **A pair on any page's edge is reported as not robust and does not ship.**

### Step 3: the three roads out

With the staves found, run the page end to end and report what the reader returns on it. **This is a report, not a repair.** If a road fails for a new reason, name it and stop; it becomes its own row.

**Done when:** the report names, for Nightingale page 4, the number of voice notes `systemsOf` assigns to a staff, the metre read per system, the number of systems the band found, and the number of rows the OCR cut.

## Every other site that decides what ink is

`CONTRACT.md` section 4: a brief that changes how a number is computed names every other site that computes the same number and says what depended on them agreeing.

| site | rule | changed here |
|---|---|---|
| `omr/metre-windows.ts:44`, `:67-69`, through `lineRows` `:78` | `INK = 140` | **yes, this lane** |
| `omr/metre-windows.ts:163` (`extent`), `:263` (`meanInk`), `:294` (`strokes`) | the same `INK` | **yes; step 0d decides at which level** |
| `omr/underlay-below.ts:75` (`topLineBelow`) | `lineRows` and `fives` on the same page | **yes, by the shared functions** |
| `omr/tuplet-number.ts:69`, `:83` (`staffSpace`), `:149` | `INK = 140`, measured off the rules themselves | no; step 0c reports it |
| `omr/metre-reader.ts:348` (`profiles`), `:427` (`cutRatio`) | `< 128` | no; step 0c reports it |
| `omr/underlay-frame.ts:122`, used `:192`, `:196`, `:299` | `INK_BELOW = 128` | no |
| `omr/underlay-rows.ts:60`, `:85-94`, `:97-102` | paper tone less 60 | no; step 0c reports it |
| `omr/underlay-looks.ts:27`, `:29` | 1st percentile to paper tone, per band | no |
| `reader/staff-detect.ts:33` (`darkThreshold`), used at `score/ScoreUploader.svelte:67` | `< 128` | no; step 0c reports it |

**What depended on them agreeing.** The metre reader reads inside the window the staff finder located, on the same raster; the lyric band is cut from the same page by the staff the finder returned; and the tuplet reader measures its own staff space off the same rules. Today they all see the same two-level page, because 140 and 128 are close and the pages they were tuned on are high-contrast. After this lane the staff finder sees a page three of them may not. **That is why 0c reports before anything else moves.** If 0c refutes the desk's reading, each becomes its own row and none is changed inside this lane.

## Constraints

- No file outside `apps/web/src/lib/omr/` and its tests changes in this lane.
- One vowel per note (`CONTRACT.md` section 0.1) is untouched by this work and must stay untouched: nothing here writes text to notes.
- Positions come from evidence, never from an arbitrary rule (`CONTRACT.md` section 0.2). Where the rule holds a proportion, the proportion is set by step 0's measurement and the comment names it.
- All eight gates at baseline. No baseline moves without saying which and why.
- No `git add`, `commit`, `push`, `checkout`, `reset`, `merge`, or `rebase` on `Shane` or `main`. This lane runs on its own branch and Dann merges.
- Every figure in the return memo names the file it was printed from.

## NOT ESTABLISHED

**NOT ESTABLISHED beats a complete invented answer.**

- What the 0.45 ceiling was set to reject. No comment in `metre-windows.ts` or in `staff.py`. Step 2 reports it rather than guessing.
- What `extent`, `strokes`, `staffSpace`, and `hasStaves` return on Nightingale page 4. Steps 0c and 0d settle them.
- Whether `paperTone` on a page whose scan does not fill it returns the paper or the margin. Step 0a reports both.
- Whether Nightingale page 4 carries a tuplet number or a piano staff. The desk looked at the page and saw a voice staff alone in every system, and no tuplet; confirm from the ink rather than from that look.

## Return memo

One file at `docs/sessions/report-code-staff-finder-light-scan_r1_2026-11-25.md`:

1. Step 0a's figures and the md5, and homr's box count.
2. Step 0b's two tables, with the file each figure was printed from.
3. Step 0c's answers for the five other sites.
4. Step 0d's table, before and after.
5. The level rule and the thickness ceiling chosen, the measurement that chose them, and the margins N and M.
6. Staves found against staves present, for every page measured, before and after.
7. Step 3's four figures for Nightingale page 4.
8. What you could not establish.
