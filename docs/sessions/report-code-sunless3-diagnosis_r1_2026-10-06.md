# Report: why *Sunless* 3 reads as it does (r1, written 2026-10-06)

Code (Sonnet 5.5), runbook step 5. Nothing in Ilya was changed. Tree at `bbe524b`, clean outside `docs/` (`docs/memory/OPEN.md` shows as modified; I did not touch it). Crops and data: `docs/sessions/sunless3-diagnosis_r1_2026-10-06/` (`c1` to `c9` are the crops; `reads/` holds both reads, their scores, and the per-page XML).

## The answer first: the 5 missing bars and the 22 missing notes

**The reader never read the last system of the last page.** PDF page 8 (the book's page 9) prints three systems. homr's output for that page holds two: the first with 2 bars (read bars 33 and 34), the second with 1 bar (read bar 35, the 3/2 bar). The third system, 5 bars in common time ending on the final barline, is absent from homr's output on both paths. Evidence:

- The notes' places on the page (`imgpos`, in the 400 dpi raster) for page 8 run from y = 364 to y = 2018. The third system sits at about y = 3500. No note, rest, or bar of it exists in the read (`reads/bar-boxes-by-imgpos.json`).
- The truth has 41 bars, 36 of them before that system and 5 in it (truth bars 36 to 40). Those 5 bars hold exactly 22 notes and 9 rests. The scorer reports 22 notes and 9 rests missing, and 5 bars short (36 read of 41). Crop `c1-page8-last-system-not-read.png` shows the system.
- Why homr did not find the system is NOT ESTABLISHED. The output holds no trace of it (no error, no empty part). Both paths agree, so it is the model's output, not a WebGPU fault.

**A scoring artefact moves 2 of the 22 notes.** The scorer's alignment pairs the read's last two notes (the last two of bar 35, read as eighths, C and G) with truth bar 39's C and G eighths, because those match perfectly, and lists the truth's last two notes of bar 35 (twelfths) as missing. Read events 231 and 232 go to truth events 253 and 256 (`gpu.score.json`, `matches`, last two rows). So the listing shows 20 missing notes in bars 36 to 40 and 2 in bar 35; the true position is 22 in bars 36 to 40. Paired with their own bar, those two notes have the right pitch and the wrong length: step 4's "143 of 222 right" becomes 141 of 222, and "56 length wrong" becomes 58. I ran the scorer unchanged and corrected nothing; this is arithmetic on its own output.

## The two reads

| | WebGPU | WebAssembly |
|---|---|---|
| Path asked for and taken | `webgpu` (apple metal-3) | `wasm`, asked for by Ilya's own rule |
| How WebAssembly was forced | | Chrome launched with `--disable-gpu`: `requestAdapter()` answers null, so `path-choice.ts` chooses `wasm-threads`, and homr-web steps down to `wasm` (no SharedArrayBuffer). Ilya's code is as it was. |
| Time, 4 pages | 45.6 to 48.1 s | 136.7 s |
| Score | 64.41 | 64.41 |
| Notes right | 143 of 222 (141 by the pairing above) | the same |

**The two reads are the same read.** Every one of the 233 events and 36 bars is equal (`conv.py` output compared as JSON). The per-page MusicXML differs only in the `imgpos` coordinates (a few pixels), nothing else. So this diagnosis holds for both paths, and the tuplet and system faults are the model's.

Chrome was in front (`visibilityState` visible) for every read. The WebGPU read also reproduced step 4's byte for byte (`cmp`), twice more.

## Every difference, by cause, largest first

The scorer lists 96 differences: 56 length wrong, 31 missing, 6 rest length, 2 extra, 1 pitch wrong. Of 41 truth bars, 21 are all right; the 20 that are not are the 5 unread bars and 15 bars with one of the causes below.

| # | Cause | Differences | Bars (truth) | On a build song? |
|---|---|---|---|---|
| 1 | **A tuplet of half-note and quarter-note size is not read as a tuplet.** The page prints a bracket and a 3 over each group (half and quarter, or the like). homr writes the notes at their printed values with no time-modification, so a 1/3 is read as a half, a 1/6 as a quarter, and the bar sums to 3/2. Crops `c4`, `c5`, `c6`, `c7`. | 45 (length wrong and rest length) | 16 to 23, 27, 28 | In part. *Sunless* 5 bar 0 has a tuplet that was misread (step 3: 5 tuplet events, 3 read right). No build song has any other tuplet. |
| 2 | **The last system of page 8 is not read.** Above. | 31 (22 notes, 9 rests) | 36 to 40 | No. Every build song reads at least as many bars as the truth has. *Sunless* 5 reads 8 more bars than it has, the footnote, which is the opposite fault. |
| 3 | **A tuplet of eighth-note size is read only in part.** Bars 31 to 35 (Andante cantabile) are eighth-note triplets. homr writes the time-modification on 44 of the 62 triplet events and not on the other 18, which are read at 1/8 for 1/12 and 1/4 for 1/6. Crops `c8`, `c9`. Why some groups and not others is NOT ESTABLISHED. | 16 by the scorer, 18 with the pairing corrected | 31, 33, 34, 35 | Same family as 1, same exception (*Sunless* 5 bar 0). |
| 4 | **The numeral 3 of a tuplet read as a whole note.** A whole note D5 at page 6, x 1634, y 2554, and F5 at x 2646, y 2512. Both positions are on the printed "3" of a bracket, none on a note (crop `c5`). The scorer calls them extra notes. | 2 | 19, 20 (read bars) | No extra notes of this kind in the build songs' tables. *Sunless* 5's 28 extra notes are the footnote and one ossia note. |
| 5 | **A note read a semitone low, and a sixteenth read as a thirty-second.** Page 6, system 1, last bar (crop `c3`). Pitch: B read as B flat (59 for 58 under the shift, so -1 semitone) where the page prints a natural sign on that note. Length: a sixteenth G read as a thirty-second. Whether the natural sign was missed or a flat added is NOT ESTABLISHED. | 2 | 14 | Yes, as accidentals: the build songs' pitch differences are the same kind (step 3: Tchaikovsky 2, *Sunless* 6 all 5, *Sunless* 5 several). |

45 + 31 + 16 + 2 + 2 = 96.

## A fault the scorer does not count: bar 35's metre

The page prints 3/2 at the start of system 2 of page 8 and a common time sign at its end (crop `c2`). The read gives bar 35 a metre of 2/2. In homr's page-8 output the only metres are a 5/4 that the writer supplies by itself on the first bar (Ilya's `joinPages` drops it, as designed) and a 2/2 on the third bar; the printed 3/2 is not in the output. The scorer counts events, so this spoils no bar of its own. It matters to a singer's staff: the bar would print 2/2 with 3/2 of notes. Whether the same fault touches a build song: *Sunless* 4's two bars that are "not all right" with no note difference (step 3: cause not established) are the 2/4 bars of the truth, and the read gives 4/4 everywhere. That fits, and I did not check it bar by bar.

## A defect found on the way, not in the score

`joinPages` writes a stray `</measure>` after an empty bar. `apps/web/src/lib/omr/join-pages.ts:207-208`: `rewriteMeasure` takes the opening tag of the measure and always appends `</measure>`. For homr's `<measure number="3" />` (an empty bar, self-closing) the opening tag already ends in `/>`, so the output reads `<measure number="3" /></measure>`, which is not well-formed XML.

- It did not touch any read above. In every read through Ilya's own `readScanPages` (step 4, the two runs here, the per-page runs), homr's first part is the voice, and that part has no empty bar on page 1.
- It reproduces on the raw pages in `reads/join-repro-raw-page1.musicxml` to `4`. These came from a read I made by calling homr-web directly (`import('/@id/homr-web')`) instead of through the app; there, homr's first part for pages 1 and 2 was a two-staff "Piano" part with an empty bar 3, and `joinPages` kept it. `reads/join-repro.mts` runs the join on them (set its paths) and prints `stray close: true`.
- Why the direct call and the app's call give different first parts for the same page images is NOT ESTABLISHED. The app's own reader never gave the Piano-first output in five reads of these pages.
- Not changed. Whether to guard `joinPages` against a self-closing measure is the desk's.

## NOT ESTABLISHED

- **Why homr did not read the last system of page 8.** The output has no trace of it.
- **Why homr reads the tuplet in some groups and not others** (bars 16 to 23, 27, 28 not at all; bars 31 to 35 in part; bar 19, where 4 of 6 triplet events are right, and which is also a bar where the numeral was read as a note).
- **Whether the natural sign in bar 14 was missed or a flat was added**, and why the sixteenth became a thirty-second.
- **Whether the 4/4 reads of *Sunless* 4's 2/4 bars are its two spoilt bars.** Plausible, not checked.
- **What the pages would read as with the fault fixed.** Nothing was changed, so no after-reading exists. The scores above are the unchanged reader's.
- **The truth file against the page.** I compared the truth's bar count, bar lengths, and the triplet groups with the page in crops `c1`, `c2`, `c4` to `c9`; they agree. I did not check every pitch of the 36 bars read right against the page.
- **Repeat spread on WebAssembly:** one read.
