# Report: the printed tuplet number, read from the page (r1, 2026-10-08)

Code (Opus 5.5) on Dann's Mac, QUEUE row 54, brief `brief-code-the-printed-three_r1_2026-10-08.md`. Tree at `3a93f60` on `Shane`. No git command that writes was run. Nothing in `~/Downloads/_desk-2026-10-08/heldout2-scans/` or `heldout2-truth-r1/` was opened, listed, or run.

## The result

Gurilyov's «Раскаяние» now passes: 149 of 153 printed notes right, score 97.4, up from 138 and 90.2. Ilya looks at the page for a printed 3 wherever homr's reading of a voice bar runs longer than its metre. On the controls it found 24 of 62 printed triplet groups (27 of the 40 printed 3s it cut out) and gave **no false number** on 293 plain groups. Every other opened and build song reads byte for byte as before. The five unseen songs read exactly as in row 52. Over all 17 opened and build songs, the score goes from 94.9 to 95.4.

## The detector, and why

**What it reads:** a 3 only. A 5 or 6 is never reported (no control prints one).

**Where it looks:** only where homr's voice bar is in doubt. In a bar that reads longer than its metre, each run of three notes of one plain value (rule 3's run) is looked at. The page region around the run is read from the page image Ilya already rendered, using the place homr gives each note (`<!-- imgpos -->`).

**How, in the order a reader's eye goes** (`apps/web/src/lib/omr/tuplet-number.ts`):

1. The staff space, from the staff lines beside the group (`staffSpace`, `:62`).
2. A band seven spaces above and below the notes, with the thin long strokes taken out: staff lines, brackets, ledger lines, and extender lines (`numeralMarks`, `:108`; the thin-stroke test, `:140`). A numeral's stroke across a staff line is thicker, so the numeral survives whole.
3. The marks left that are the size of a numeral and stand over the middle note of the group (`:210`). A mark is not taken if it is a letter of a sung word: a mark of its height on its line beside it, or two within four spaces (`:224`).
4. The shape (`shapeOf`, `:244`; `notches`, `:302`; `isThree`, `:330`). A printed 3 is one mark, at least a staff space tall, that closes no loop, with two or more notches in its left edge and at most one in its right.
5. The answer is 3 only where exactly one mark reads as one (`lookForTupletNumber`, `:339`). Anything else is null, and the bar stays as it is today.

**Why not Tesseract.** Ilya already ships `tesseract.js` 7.0.0 for poems, so it was measured first, on the same marks, with digits only and single-character mode. It found 2 of the first 62 positive groups. It read most italic 3s as 2. It read the lyric letter «б» as **6 at confidence 93**, which is a false number. The shape rule replaced it.

**Why not a template.** Templates of the 3s, tested only against 3s from *other* engravings, found 6 to 12 of 40 before the first false mark. They do not carry across editions.

How the thresholds were chosen: on these controls, while looking at them. The one-space minimum height, the notch depths (0.12 of the width, with a 0.08 dip between notches), and the 0.22-space thin-stroke cut are JUDGEMENT, set where the opened controls separate. Every printed 3 measured stands 1.1 to 1.83 spaces tall. The one non-3 that passes the notch test without the height floor (a fragment in Kabalevsky 3 bar 32) is 0.78 spaces.

## The controls

From the truth files of the 17 opened and build songs, and of *Sunless* 2 and 3, which day 4 made build songs and which hold most of the printed voice triplets. Positive groups are the truth's triplet notes, mapped to homr's notes through the scorer's matches and split into threes. Negative groups are runs of three plain eighths or sixteenths in bars whose truth has no tuplet. The one truth triplet past the end of a scan (Kabalevsky 2 bar 68) is left out. Read on Ilya's own 400 dpi page renders, in Node, with the module that ships.

| Control | Groups | Found | Missed | False number |
|---|---|---|---|---|
| Gurilyov bar 25 (four printed 3s, one per group) | 4 | 3 (groups 1, 3, 4) | 1 (group 2) | 0 |
| Gurilyov bar 7 (no 3 printed), the run rule 3 would change | 1 | n/a | n/a | 0, and no mark the size of a numeral (0 candidates) |
| *Sunless* 5 bar 9 (3 printed in the staff over a rest) | 1 | 0 | 1 (a candidate, not read as 3) | 0 |
| *Sunless* 5 bar 1 | 1 | 0 | 1 | 0 |
| Varlamov bar 4 | 1 | 1 | 0 | 0 |
| *Sunless* 2, bars 3, 6, 7, 8, 9 | 9 | 6 | 3 | 0 |
| *Sunless* 3, bars 17 to 37 | 46 | 14 | 32 | 0 |
| **All positive groups** | **62** | **24** | **38** | **0** |
| **Negative groups (all of them, 15 songs)** | **293** | | | **0** |

Not every positive group has a printed number of its own. The groups were cut from truth runs, and engravers often print the 3 only on the first groups of a run, so some groups are leftover notes with no 3 over them. To measure the detector on what is printed, every mark it cut from the positive groups was labelled by eye: **40 are printed 3s, and 27 of those read as 3.** No other mark reads as one: 0 of 51 other marks in the positive bands, and 0 of 87 marks in the negative bands. The printed 3s it misses fall into three kinds: those merged with a bracket stub or a staff-line remnant, those whose notches are too shallow, and four never cut out at all (*Sunless* 3 bars 24, 29, 33, 35, already marked by homr).

The tuning loop, each step on the same controls, so the history is visible:

| Step | Positive groups found | False numbers |
|---|---|---|
| Tesseract, digits only | 2 of 62, one printed 3 read as 6 (the letter б) | 1 |
| Shape rule, first form | 3 | 0 of 62 |
| Notch measure | 14 to 16 | 0 of 62 |
| Thin strokes only taken out; group span | 23 | 1 of 293 (the «з» of «за», Varlamov bar 15) |
| A letter beside the mark rules it out | 21 | 0 of 293 |
| Looser shape, one-space floor | 27 | 0 of 293 |
| The number over the middle note | 24 | 0 of 293 |

## The wiring, and why

1. **A found number makes those notes a tuplet** (`apps/web/src/lib/omr/triplets.ts:255` to `:270`). In a bar longer than its metre, each run of three with a printed 3 over it becomes a triplet, unless that would leave the bar shorter than its metre. It acts in a bar with grace notes, which the three rules leave alone, because the printed 3 itself is the evidence. If the bar is still too long, rules 2 and 3 run on what is left.
2. **Rule 3 defers to the page where nothing is there** (`triplets.ts:290` to `:296`). Where the page was looked at over every run rule 3 would change and shows **no mark the size of a numeral** (zero candidates), rule 3 does not act. That repairs Gurilyov bar 7 in the reading's terms: the bar is left as homr wrote it, with one note read long, instead of three notes and a rest turned into a triplet the page does not print. Where a mark stands there but is not read as a 3, as in *Sunless* 5 bar 9, rule 3 acts as before. **Why this and not "no 3 found":** the detector misses about a third of printed 3s, so "no 3 found" would stop rule 3 in bars where it is right. *Sunless* 5 bar 9 is that case, and in row 53 it lost 2 notes from exactly that.
3. **Where Ilya looks** (`apps/web/src/lib/omr/homr-reader.ts:162`, `joinLookingAtPages`). The join runs once to collect the runs it would ask about. The reader then decodes only a region of each needed page image (the group plus 640 pixels on each side, `:154`; `decodeRegionInBrowser`, `:131`, through `createImageBitmap` and an `OffscreenCanvas`). The join then runs again with the answers, at most three times. The console says how many groups were looked at and how many showed a 3. Without a `decode` (the unit tests' fakes, or a browser with no `OffscreenCanvas`), the join reads homr's output alone, as before.

### Every change

| Where | What |
|---|---|
| `apps/web/src/lib/omr/tuplet-number.ts` (new, 348 lines) | the detector |
| `apps/web/src/lib/omr/triplets.ts:48` to `:66` | the header: the page step, rule 3's deference, grace notes |
| `triplets.ts:128`, `:195`, `:206`, `:231` to `:236`, `:244` to `:300`, `:311` | the `page` rule, `isRunOfThree`, `PageLook`, the `look` argument, grace notes kept out of the timing, the page step, rule 3's deference, grace notes passed through unchanged |
| `apps/web/src/lib/omr/join-pages.ts:189`, `:241`, `:333` to `:366` | `look` passed to each bar with its page; `placeOf` reads `imgpos`; `LookAtPage`; `joinPages(pages, look?)` |
| `apps/web/src/lib/omr/homr-reader.ts:90`, `:113` to `:197`, `:205`, `:271`, `:330` to `:345`, `:366` | `ReaderDeps.decode`; `withoutCovers` made generic; `Region`, `DecodeRegion`, `decodeRegionInBrowser`, `LOOK_MARGIN`, `joinLookingAtPages`; each page's image index; the join looks at the pages and logs; the app's reader is given `decode` |
| `apps/web/src/lib/omr/tuplet-number.test.ts` (new) | 8 tests |
| `triplets.test.ts:98`, `:114`; `join-pages.test.ts:222`; `homr-reader.test.ts:255` | 4 tests |

The port does not change, so there is no version bump and no packed `.tgz`. The stamp stays `homr-web@0.2.0-ilya.5/465`, so a reading kept with a song before this change is not read again; a stored «Раскаяние» keeps its old bar 25 until it is dropped again.

## Tests

- `tuplet-number.test.ts`, 8. These use real marks cut from the opened pages and kept as text pictures: a Jurgenson 3 and a Mussorgsky 3 (read as 3); two lyric letters and a bracket end (not read); a 3 under a staff space tall; a mirrored 3. Then a drawn staff: a 3 under the middle note (found); nothing printed (null, no candidates); a 3 over the neighbouring group (not taken); a 3-shaped mark beside a letter (not taken).
- `triplets.test.ts`, 2: Gurilyov bar 25's shape, with grace notes and four printed groups (the 12 notes become triplets, and nothing changes without the page); Gurilyov bar 7 (rule 3 stands down over a bare page, and still acts where a mark stands, or where the page cannot be read).
- `join-pages.test.ts`, 1: the join asks about a bar too long, with its page and places, and applies the answer; `placeOf`.
- `homr-reader.test.ts`, 1: the two-pass join reads the region around the asked group, and joins exactly as before when the region cannot be read.

## Gates

From the copy of `ilya-ship.sh` that cannot stage. Seven at baseline; **gate 4 moved 2000 to 2012** (the 12 tests).

| Gate | Result |
|---|---|
| 1 phonology | 251 passed (251) |
| 2 dictionary | 235 passed (235) |
| 3 web-check | 0 errors and 12 warnings in 5 files |
| 4 web-test | **2012 passed (2012)**, baseline 2000 |
| 5 score-parser | 650 passed, 5 skipped (655) |
| 6 blurb | 145 passed (145) |
| 7 integration | 55 passed (55) |
| 8 ratchets | OK |

## Before and after

Through the score drop box, a fresh browser context per song, the reading taken from the app's library, scored with row 49's `conv.py` and `score.ts`; headless Chrome, adapter `apple metal-3`, every read on `webgpu`. **Before:** the deployed site, Vercel's deployment of `3a93f60` (row 53). **After:** the local dev server with this change. Files as in row 53.

Before, unedited:

```
tch: webgpu; 171 of 174 right; missing 0; extra 0; pitch misreads 3; length misreads 0; bars read 99 of 99; score 98.3 PASS
sun1: webgpu; 94 of 96 right; missing 0; extra 0; pitch misreads 0; length misreads 2; bars read 18 of 18; score 97.9 PASS
sun4: webgpu; 116 of 116 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 29 of 29; score 100.0 PASS
sun5: webgpu; 246 of 258 right; missing 1; extra 10; pitch misreads 9; length misreads 2; bars read 64 of 61; score 91.5 BELOW
sun6: webgpu; 155 of 161 right; missing 0; extra 0; pitch misreads 6; length misreads 0; bars read 55 of 55; score 96.3 PASS
k01: webgpu; 150 of 152 right; missing 0; extra 0; pitch misreads 1; length misreads 1; bars read 67 of 67; score 98.7 PASS
k02: webgpu; 93 of 157 right; missing 64; extra 0; pitch misreads 0; length misreads 0; bars read 41 of 70; score 59.2 BELOW
k03: webgpu; 157 of 157 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 52 of 52; score 100.0 PASS
k04: webgpu; 150 of 151 right; missing 0; extra 0; pitch misreads 1; length misreads 0; bars read 39 of 39; score 99.3 PASS
k06: webgpu; 153 of 153 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 37 of 37; score 100.0 PASS
k07: webgpu; 160 of 163 right; missing 0; extra 0; pitch misreads 0; length misreads 3; bars read 53 of 53; score 98.2 PASS
k08: webgpu; 154 of 154 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 32 of 32; score 100.0 PASS
k09: webgpu; 143 of 149 right; missing 0; extra 0; pitch misreads 6; length misreads 0; bars read 39 of 39; score 96.0 PASS
k10: webgpu; 154 of 156 right; missing 0; extra 0; pitch misreads 2; length misreads 0; bars read 83 of 83; score 98.7 PASS
gur: webgpu; 138 of 153 right; missing 0; extra 0; pitch misreads 0; length misreads 15; bars read 31 of 31; score 90.2 BELOW
grech: webgpu; 153 of 154 right; missing 0; extra 0; pitch misreads 1; length misreads 0; bars read 58 of 58; score 99.4 PASS
varl: webgpu; 61 of 63 right; missing 0; extra 1; pitch misreads 0; length misreads 2; bars read 26 of 26; score 95.2 PASS
Total: 2448 of 2567 right; missing 65; extra 11; pitch misreads 29; length misreads 25; bars read 823 of 849; score 94.9
```

After: every line is the same except these two, unedited:

```
gur: webgpu; 149 of 153 right; missing 0; extra 0; pitch misreads 0; length misreads 4; bars read 31 of 31; score 97.4 PASS
Total: 2459 of 2567 right; missing 65; extra 11; pitch misreads 29; length misreads 14; bars read 823 of 849; score 95.4
```

Every other song's reading after is byte for byte its reading before (`cmp`, 16 of 16). The page was looked at in three songs: Grechaninov (10 groups, no 3, nothing changed), «Раскаяние» (15 groups, a 3 over 3), and *Sunless* 5 (1 group, no 3, nothing changed). «Раскаяние»'s 4 remaining misreads: bar 7's B4 read as a quarter (the page prints an eighth, now the only error in that bar), and bar 25's second group (the 3 the detector misses).

## The five unseen songs

Read once, after the fix was final, on the local build, through the drop box, by `five.sh` (row 53's script; the files are row 52's letter copies, and the readings went into a private folder that was never opened). Unedited:

```
A: webgpu; 67 of 69 right; missing 0; extra 0; pitch misreads 2; length misreads 0; bars read 12 of 12; score 97.1 PASS
B: webgpu; 79 of 79 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 16 of 16; score 100.0 PASS
C: webgpu; 126 of 126 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 17 of 17; score 100.0 PASS
E: webgpu; 230 of 231 right; missing 0; extra 0; pitch misreads 1; length misreads 0; bars read 50 of 50; score 99.6 PASS
F: webgpu; 81 of 85 right; missing 0; extra 0; pitch misreads 4; length misreads 0; bars read 20 of 20; score 95.3 PASS
Total: 583 of 590 right; missing 0; extra 0; pitch misreads 7; length misreads 0; bars read 115 of 115; score 98.8
```

Equal to row 52's in every count. A script that printed only totals across the five says the page was looked at in one of them: 10 groups, with a 3 found over 3. A checksum comparison that names no song says none of the five readings changed from row 52's. So wherever those 3s were found, the page step left the bar as it was (for example, because marking them would have made the bar shorter than its metre). Whether they are printed 3s is not established, because looking would open the song.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **How the detector does on engravings it has not seen.** Its thresholds were set on three engravings (Mussorgsky's, Jurgenson's, Gresser's), looking at them. The new unseen set is the test of that, and it was not touched.
- **Whether the three 3s found in one unseen song are printed.** The reading did not change, so no note moved, but the marks were not looked at.
- **A false number in the wild.** 0 of 293 plain groups and 0 of 138 non-3 marks here. The lyric letter «з» standing alone, or «э», has the 3's shape; only the letter test keeps it out, and a single-letter word printed with no neighbour on its line would pass it. No such word was among the controls.
- **5 and 6.** Not read; no control prints one.
- **Every printed 3 on the controls.** The 40 counted are those the detector cut out; 3s it never cut out are counted only where seen in the group images (four, in *Sunless* 3).
- **The cost in the browser.** A region of about 1,400 by 1,300 pixels is decoded per group looked at. It was not timed. The app's own read times (which include the join) were lower after than before in every song looked at («Раскаяние» 35.5 s to 33.0 s, Grechaninov 59.5 s to 57.7 s, *Sunless* 5 92.7 s to 89.7 s), but before is the deployed build and after the dev server, so the difference says nothing about the look's cost.
- **The deployed build of this change.** "After" is the local dev server; the change is uncommitted.
- **Truth.** «Раскаяние»'s truth is the cloud helper's draft, checked against the page only in bars 7 and 25 (row 53).

## Housekeeping

Tesseract's Node measurement wrote `apps/web/eng.traineddata` (5,199,098 bytes, a language file it downloads). It was removed. The scratch scripts and the labelled controls are in the session's scratchpad, not in the tree.
