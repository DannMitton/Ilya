# Fable's review of the staff finder amendment r1 (2026-11-26)

Reviewed: `amendment-code-staff-finder-light-scan_r1_2026-11-26.md` (md5 `8c0e6a8545ae655c4ac1fddc2cc9c8dd`), section "The three decisions this lane runs under". Read in full: the amendment, brief r2, my review of brief r1, the staff finder paragraphs of `docs/memory/STATE.md` (`:24`, `:30`, `:32`), `apps/web/src/lib/omr/metre-windows.ts`, `underlay-below.ts`, `underlay-band.ts:40-142`, `metre-model.ts:89-159`, `metre.worker.ts:25-60`, `metre-witness.ts:50-140`, `underlay-prepare.ts:195-285`, and the three test files. Tree: branch `Shane` at `b14d94b3`. The tree is not clean: `QUEUE.md`, `SCHEDULE.md`, and `STATE.md` are modified and the amendment, a 0c report, and thirteen `step0c-*` harness files are untracked. No code file is touched. The `step0c-*` files carry today's times, so a lane was writing while I read.

## What I measured, and what I only read

**I re-ran part of 0d myself.** The stopped session left more than the harness folder: its rasters, homr boxes, saved grids, and its 0d output are on the Mac at `~/Downloads/_desk-staffin-2026-11-25/work/code-lane/` (the 0d output is `step0d_p1_085_065.txt`). I copied the harness's `scratch.ts` and `scratch-below.ts` to a temporary folder outside the repository, added one parameter so `extent` can take its own level, and ran song1 p1, song2 p1, Without Sun p5 and p6, and Nightingale p4 on the saved `.gray` rasters. Nothing was written to the repository or to Downloads. `apps/web/src/lib/omr/` has no change between `63e5101b` and `b14d94b3`, so the scratch copy still matches the tree.

- **Re-measured by me:** every figure in this review for song1 p1, song2 p1, Without Sun p5 and p6; 16 of 16 on Nightingale p4 at level 206 and ceiling 0.65; level 206 from paper 227 and 1st percentile 89.
- **Read from the session's saved file, not re-run:** song3, song4, Without Sun p4, Nightingale p2, p3, and p5.
- **Looked at:** the session's crop of song2 box 0's right end, a crop I cut of song1 box 2's left end, and Nightingale p5 whole.

Terms: "config B" is the harness's own name for decisions 2 and 3 together (`step0d.mts`, line 1). "Variant C" is mine: config B with `extent` held at 140.

## Verdicts

1. **Decision 1 (count voice boxes; piano boxes out of scope): STANDS WITH AMENDMENTS.** Counting voice boxes is right. "Out of scope" as written hides a piano staff that is found today and lost at the provisional pair, and "voice box" has no definition the lane can test against.
2. **Decision 2 (`strokes` and `meanInk` stay at 140): STANDS WITH AMENDMENTS.** The split is safe in the code. It does not hold the bar lines still, and nothing in the tests would catch the two levels being swapped.
3. **Decision 3 (`extent` takes the page level): STANDS WITH AMENDMENTS.** Build it, but not on the ground the desk gave. The song2 repair does not come from `extent`'s level. Decision 3 is needed for a different reason, and at the pair it leaves one control staff worse than shipped.

Nothing here is DO NOT BUILD. Step 1 can be written under the three decisions once the two blockers are answered, and both are answered by a look and a sentence, not by new code.

## Blockers

1. **A staff found today is lost at the provisional pair, and the record says none is.** `apps/web/src/lib/omr/underlay-prepare.ts:214-218` runs `staffIn` on every box homr gives, piano boxes included. On song2 p1, box 5 (a grand-staff box, 604 px tall) is found at 140 and 0.45 and is null at 229 and 0.65. My run and the session's own saved grid agree: `song2-p1.sweep2.json`, anchor p1, u 0.85, reads `111110` at every ceiling from 0.55 up, and `111111` only at 0.40 to 0.50. So the amendment's "No staff found today is lost at u 0.85" and "every page passes at ... ceiling 0.60 to 0.75" are false over homr's boxes, and true only over voice boxes. Brief r2 step 2 says "no held-out page loses a staff" and "a pair on any page's edge ... does not ship"; song2 is held out. **The amendment has to say in one sentence which it is:** the pair moves inside every page's all-box region, or a lost piano box is accepted and named. I measured the one consumer: `below` at `underlay-band.ts:136-138` becomes null for song2's third system, and `topLineBelow` (`underlay-below.ts:66-67`) returns 4473.0 with box 5 and 4473.0 with null. So acceptance is defensible on this page. It is not yet a decision anyone made.

2. **`topLineBelow` moves 78.8 px on a control page and the record omits it.** `underlay-below.ts:52` and `:75`. On song2 box 0 the top line of the staff under the voice goes from 1607.5 to 1528.8 at config B, which lifts the lyric band's lower edge by 2.7 staff spaces (`underlay-band.ts:101`). Per strip, the piano's true top line runs 1616 to 1589 across the span; two strips now return 1529, three spaces higher, and two strips agreeing is all the guard at `:52` asks. This is the ledger-line fault the module's own doc names (`underlay-below.ts:22-25`), back at the new level. It needs both changes: the shipped staff at level 229 gives 1607.5, and the new staff at level 140 gives 1606.5. Brief r2's 0d done-when requires every such move to be named against a stated tolerance. **Before step 1 builds: look at song2's first system and report the lyric rows `cutRows` returns before and after.** Whether a row of words is lost is NOT ESTABLISHED.

## Amendments

1. **State decision 3's real ground** (`metre-windows.ts:181-182`, `:207-208`, `:214-216`). At the page level `staffIn` keeps fewer strips on the clean pages and its first and last samples move: song1 box 0, 69 samples to 63, first sample 959.5 to 1049.5; song1 box 2, 72 to 64, 678.5 to 794.5; song2 box 0's last sample moves out, 3787.5 to 3916. `extent` walks from those samples. On song2 box 0, variant C (extent at 140) already ends at 3933, so the 133 px repair comes from `lineRows`'s level, not from `extent`'s. On song1, variant C is worse than shipped: box 0 ends at 3668 against 4017, box 2 starts at 681 against 525. **`extent` takes the page level because, once `lineRows` does, holding it at 140 breaks song1.** That is a stronger reason than the one given, and it is the true one.

2. **Name the staff decision 3 leaves worse** (`metre-windows.ts:181`). song1 box 2: `x0` goes from 525 to 572 at config B. I looked: the rules start at the system line at about x 527, and 572 is inside the treble clef. Shipped was right; the pair is 47 px (1.6 spaces) short. The start window (`:359`) and the opening-line test (`:348`) both shift with it. On this staff the shift does no harm I can find. The amendment's sentence "the page-relative level corrects an error that has been shipping" is true of song2 box 0 and song1 box 0 and false of this one.

3. **The song2 repair is real, and it is checkable on the Mac, not in the tree.** I looked at the session's crop: the five rules run on to the final bar line. My run gives 609 to 3802 shipped and 605 to 3935 at config B, with the bar line found at 3932. Row 218 and the amendment both point at "the lane's report", which does not exist; the figures live in Downloads. Copy `step0d_p1_085_065.txt` into `docs/sessions/measure-staff-finder-light-scan_2026-11-25/` so the record is in the tree.

4. **Rewrite 0d's done-when with the expected moves named.** Every consumer of `x0` and `x1`, and what 89 to 133 px (3.0 to 4.6 spaces) does to each:
   - `metre-windows.ts:284`, the columns `strokes` scans. The final bar line comes into range: one more bar line on song1 box 0 (4102), song2 box 0 (3932), and song2 box 4 (3950).
   - `:348`, the opening-line test at `x0 + 1.5` spaces. Moves with `x0`: 2 to 6 px on most staves, 47 px on song1 box 2.
   - `:359`, the start window, `x0` to `x0 + 15` spaces. Same shift.
   - `:367` and `:369`, the last window's right edge and `tail`, read at `:377` by `isCourtesyPlace` and carried through `metre-model.ts:155` and `metre.worker.ts:52`. Each newly reached final bar line adds a window about half a space wide, three places, flagged courtesy. I computed the old last bars' tails on those three staves (12.8, 7.8, and 43 spaces): none was a courtesy place before, so no flag flips.
   - `:426`, `bandOf`'s centre column. It moves 44 to 66 px, about one pixel of height at song1's 0.9 degree tilt, which can move the band's first row and so the resampling the metre net sees.
   - `underlay-band.ts:59`, `centreOf`, read at `:69` and `:96-98`. Same one pixel, on the lyric band's upper edge.
   - `underlay-below.ts:69-71`, the span `topLineBelow` searches. See blocker 2.
   - `metre.worker.ts:44-46` and `metre-witness.ts:134-136`, the window's `x0` in `barOfWindow`. No effect found.
   No consumer exists outside `apps/web/src/lib/omr/`. **The done-when reads:** `x1` may grow where the shipped walk stopped short of a bar line, with one more bar line there; any other move over a stated tolerance is named and looked at.

5. **Add the metre verdict to 0d.** No column in 0d shows what the net reads. Bar-line columns also shift 1 to 3 px at config B (song1 box 4: 4025 to 4027; song2 box 2: 3930 to 3932), which shifts every window after them. Run `readPageMetres` on the twenty control staves before and after and print `lab` per window. The 0c harness already does this for page 4 (`step0c-metre.mjs`). Whether any verdict flips is NOT ESTABLISHED.

6. **Decision 2 does not mean "bar lines hold".** `strokes` (`metre-windows.ts:284-300`) reads its top and bottom rows from the staff's lines, and those come from `lineRows` at the page level. Without Sun p6 box 6 loses its final bar line at config B (2439 and 3515 shipped; 2439 alone after) with `x0` and `x1` unchanged. Over the twenty control staves config B gives sixteen unchanged, three with one more, and one with one fewer. The amendment states neither.

7. **Guard the two levels against a swap** (`metre-windows.ts:67-69`, `:78`, `:163`, `:263`, `:294`). No function compares a count made at one level with a count made at the other, and no binarized image is cached, so the split is safe. Every live path mixes them by design: `staffIn` (`metre-model.ts:137`) builds the staff at the page level and `windowsOf` (`:151`) reads bar lines on it at 140. The risk is two bare numbers passed in neighbouring positions. Pass one object with two named fields. Add one test page with mid-grey ink (rules near 180, a bar line near 60, paper near 230), because every existing test page is two-tone and passes with the levels swapped.

8. **Amend brief r2 step 1's done-when.** It reads "`metre-windows.ts` holds no page-wide ink constant". Under decision 2 the constant stays for two readers. Say so: it stays, renamed for what it reads, with a comment naming row 218.

9. **Define "voice box" by the tree** (`metre-model.ts:93-111`). The harness calls a box a voice box when it is under 300 px tall (`step0d.mts`, `stepbars.mts`, `step0c-sites.mts:116`). The tree's rule is `voiceBoxes`, the boxes nearest the first part's notes, and it needs homr's MusicXML, which the harness saved for page 4 only. The underlay path has a third rule, `staffOfNotes` over the placed staves (`underlay-band.ts:73-86`).

10. **The done-when, in numbers.** Step 2's first clause reads: **16 of 16 voice boxes on Nightingale p4, 4 of 4 on song1 p1, and 3 of 3 on Without Sun p5, counted by `voiceBoxes`, with homr's box total (16, 8, and 6) and the lane's own count from the page printed beside each.** Then: no voice box found today is lost on any swept page; every box of either kind whose found state changes is listed with its direction; and the margins N and M are measured on the voice-box regions and say so. Known today, from my run: song2 p1 box 5 lost; Without Sun p5 box 3 and p6 box 7 gained. Brief r2's "9 of 9 on Without Sun page 5" never counted anything `staffIn` returns: by boxes the shipped finder gets 4 of 6 there, and the pair 5 of 6.

11. **The test claim in brief r2 step 1 is wrong in one place and holds in outcome.** "Their pages hold only 0 or 20 against 255" is false at `underlay-prepare.test.ts:263`, which paints the words 215. That page is 3.4 per cent grey 20, so the pair gives level 220 and the pale words become ink to `lineRows` and `extent`. By my reading the assertions at `:264-265` still pass, because the same row is already ink at grey 20 in every other test on that page and the five lines `topLineBelow` finds are still the staff at 500. I did not run it, and the margin is five grey levels: at u 0.83 or lower the words fall on the paper side.

12. **The single-staff test pages put the level at 255.** `underlay-below.test.ts:59-92` draws one staff or none on 1,200,000 pixels: 0.83 per cent ink, so the 1st percentile is the paper and the level is 255. A strict less-than still splits 0 from 255, and a blank page gives 255, not NaN. Keep the comparison strict and say so in the comment. The pinned values, all immune on two-tone pages by reading: `metre-windows.test.ts:38-39` (`x0` 100, `x1` 1499, the only direct pins on `extent`), `:47`, `:49-53`, and `:65`; `underlay-prepare.test.ts:130-140`, `:158-159`, `:252-253`; `note-kinds.test.ts:89`. `underlay-below.test.ts:30-31` builds its staff by hand and pins nothing `extent` returns.

13. **Add a sparse page to the held-out set.** The 1st percentile measures how much of the page is ink as much as how dark the ink is. I blanked song1 p1 under its first system with its own paper: ink under 140 fell from 6.65 to 0.72 per cent and the level rose from 229 to 242. On Nightingale p4 cut to one staff the level rose from 206 to 220. Both still found their staves, so this is a caution and not a fault. A last page with one or two systems belongs in the sweep before the pair is called robust.

## What these decisions silently contradict

- **Brief r2, 0b and step 2:** "for every box homr gave" and "no held-out page loses a staff". Decision 1 narrows both to voice boxes without saying it changes the pair's pass. See blocker 1.
- **Brief r2, step 1:** "holds no page-wide ink constant" and "pass it to every reader of `inkAt`". Decision 2 keeps the constant for two of the four. See amendment 8.
- **Brief r2, 0d:** every move named against a stated tolerance. The amendment names two moves and no tolerance, and omits the moves in blocker 2 and amendments 2, 4, and 6.
- **My review of r1, blocker 2:** a regression in bar lines or staff ends "would have passed every stated test". The measurements now exist and the regressions still did not reach the record.
- **My review of r1, amendment 16:** the pair sits inside every page's region or does not ship. Over all boxes it does not sit inside song2's.
- **Dann's ruling of 2026-11-25 02:56:** "unblocks notes, metre, and words at once". Decision 2 moves the metre on a light scan to row 218. `STATE.md:24` says so plainly. Whether Dann has been told that his ask now arrives in two lanes is NOT ESTABLISHED from the files I read; it is one line to him. The metre is not wholly lost: the lane's 0c output shows the start windows read 2/4 on six of the seven verse starts on page 4.

## What I could not establish

- **That the saved rasters are what the browser produces.** Step 0a's md5 `5bb97b1e`, the 4400 by 5500 size, and homr's boxes are the stopped session's. I measured on its `.gray` files and did not rasterize. Every figure I re-measured rests on this.
- **The 0b window as a whole** (u 0.76 to 0.93, ceilings 0.60 to 0.75). I read only the u 0.85 rows of three saved grids, and over all boxes they contradict it for song2.
- **"14 of 20 control staves" lost at a page-relative glyph level, and "8 true bars" on page 4 box 1.** Not re-measured. Decision 2's reason for not building the glyph level here rests on the first. My finding that the split is safe does not.
- **Whether config B's bar lines on page 4 include false ones.** Truth exists for box 1 only, where config B finds three true and none false.
- **Whether the 78.8 px move costs song2 a row of words** (blocker 2), and **whether any metre verdict flips on a control page** (amendment 5).
- **Why song1's sample count falls at the page level.** I report the counts; I did not trace the cause inside `fives`.
- **song3, song4, Without Sun p4, and Nightingale p2, p3, and p5:** read from the session's saved 0d file only. Nightingale p5 shows `x0` 4 and `x1` 4315; I looked, and it is a handwritten page whose staves run to the paper's edge, so that reading is plausible and not a runaway.
- **The voice-box counts 4 and 3 by `voiceBoxes`.** They are by the harness's height rule.
- **Any test result.** I ran no test; no change exists to run them against. Every statement about the tests is from reading.
- **The 0c report** (`report-code-staff-finder-light-scan-0c_r1_2026-11-26.md`): I searched it for the terms of this review and did not read it through.
