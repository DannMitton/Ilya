# Report: set 3's four songs below 95, opened and diagnosed (QUEUE row 77, r1)

Code (Opus 5.5) on Dann's Mac, 2026-10-11, brief `brief-code-set3-four-below_r1_2026-10-11.md`, read whole, with row 61's report and row 76's report. Tree at `7bb929a` on `Shane`. At the start, `docs/memory/QUEUE.md` was already modified and the brief was untracked. During the run, `docs/memory/OPEN.md` and `PRODUCT.md` were modified by someone other than me. No git command that writes was run. Nothing is staged, committed, or pushed.

**Q, R, U, W, Y, and Z were not opened.** For them, a script printed only "same" or "changed". Their scans, truth, and readings were not viewed, listed, or printed, and `keep` was not opened.

## The answer first

Two general fixes are kept, and one song now passes.

| Song | Before (row 76) | After | Against corrected truth |
|---|---|---|---|
| S Balakirev | 71.6 BELOW | **87.9 BELOW** (UNSURE set aside 88.9) | no truth fault found |
| T Borodin | 92.4 BELOW | 92.4 BELOW, unchanged | no truth fault found |
| V Mussorgsky | 94.6 BELOW | 94.6 BELOW, unchanged | no truth fault found |
| X Rimsky-Korsakov | 84.7 BELOW | **95.8 PASS** | **100.0 PASS** |

- **X passes.** Its 16 length misreads came from two printed 3/2 bars, twice, whose return to C the reader did not see. Its 6 pitch misreads are truth faults.
- **S loses 20 of its 32 extra notes.** On page 8, homr braced the voice to the piano's right hand on one system, and the right hand was read as the voice for four bars. The 12 extra notes left are the English and French lines.
- **T's 14 extra notes are all the French line.** No general fix was built.
- **V's 7 length misreads are a nested triplet and one group of mixed beams.** No general fix was built.
- **Every protected reading is byte for byte as before, 38 of 38.** That covers the 17 build songs, A, B, C, E, F, K, L, M, P, G, H, I, J, N, O, and the six sealed passes.
- **Gate 4 moves 2181 to 2182** (one new test). The other seven gates are at baseline.

Because fixes are kept, **set 3 is spent as a verdict** (brief section 6).

## The four

| Letter | Song | Edition, as printed |
|---|---|---|
| S | M. Balakirev, «Пѣсня золотой рыбки» (Song of the Goldfish), words from Lermontov's «Мцыри»; no opus number printed | Carl Fischer, New York, 1922, plate 22351-7; three underlays (English, Russian, French) |
| T | A. Borodin, «Спящая княжна» (La Princesse endormie), words by the composer; no opus number printed | P. Jurgenson, Moscow, plate 28391; Russian and French underlay |
| V | M. Mussorgsky, «Гдѣ ты, звѣздочка?», ed. V. Karatygin; no opus number printed | W. Bessel, St Petersburg, 1911; Russian and German underlay |
| X | N. Rimsky-Korsakov, «Ночь», op. 8 no. 2, words A. Pleshcheyev | plate 5916; publisher not printed on the pages |

The letters map to `~/Downloads/_desk-heldout3-private/truth/*.pdf` in glob order. A script resolved only S, T, V, and X (`measure-set3-four-below_2026-10-11/four.json`).

## How it was read

- **Before:** row 76's readings from the deployed alias at `8e74f39`. All four, dropped again on the local dev server at `7bb929a` before any change, are byte for byte the same (`run.py cmp before r76`: same, 4 of 4). Local and deployed therefore read these songs alike.
- **After:** the local dev server on port 5173 with both fixes, through the drop box: Playwright, headless Google Chrome, a fresh context per song, and the reading taken from IndexedDB. Every reading is on WebGPU and stamped `homr-web@0.2.0-ilya.7/465`.
- **Scoring:** `conv.py`, then `final-line.ts` under `tsx`. Neither was touched.
- **Layout trace:** a scratch copy of the port under Node on WebAssembly, run on the page rendered at 400 dpi grey (the app's `TARGET_DPI`), with a `globalThis` hook in `parseStaffs` and one in `selectGrandstaffs`. The hooks are not in the tree. Copies are in `measure-set3-four-below_2026-10-11/port/`.
- **Truth check:** every bar the scorer marks was looked at on a 300 dpi render of the scan (`diff.ts` and `bars.py` print truth and reading side by side).
- **Two load faults.** The first drop after each dev-server start or test run timed out at 10 minutes with no `[omr]` line, because the page reloaded under it (`.svelte-kit/generated` rewritten; preview logs 19:53 and 20:08). Each was dropped once more and read. The stalled records are in `stalled/`.

## Truth checked against the page

| Song, truth bar | The page | The truth (draft) | Corrected copy |
|---|---|---|---|
| X, bar 13 (page 1, system 4, bar 3) | «чи» C♯5 (third space, key signature), dotted eighth; «на» D5, sixteenth | B4, B4 | C♯5, D5 |
| X, bar 14 (page 2, system 1, bar 1) | «ме» A♯4 (a sharp before the second space), quarter; «ли» A♯4, eighth | G♯4, G♯4 | A♯4, A♯4 |
| X, bar 16 (page 2, system 2, bar 1) | «ды» C5 with a natural (third space), dotted eighth; «жур» C5, sixteenth | B4 (with `printedAccidental: natural`), B4 | C5, C5 |

In each of these bars, the draft has the head one staff step low. In bar 16, a natural can only cancel the key's C♯, not a B.

Corrected copy: `~/Downloads/_desk-heldout3-private/truth/rimsky-korsakov_op8_no2_noch.truth.corrected.json` (md5 `912b251f11a8ff436272f41bb7cdb05b`). Its `corrections` list names the six notes. The original was not edited.

**Left as the draft has them:**

- **X, bar 20.** The page prints an eighth rest before the half rest. The truth has it and the reading does not. Rests are not in the score.
- **S, bars 49 and 69 to 72; T, bars 21, 22, 41, 43, and 73 to 76.** These are the language splits the drafts mark UNSURE. The draft records the Russian line, and the page agrees with it in each bar looked at. That includes T's bar 22, where «мчал» prints a dotted quarter.
- **V, bars 4 and 5.** The page agrees with the truth (see V below).

S, T, and V have no corrected copy and are scored against their originals twice.

## The causes

Line numbers are at `7bb929a` unless marked "now".

### X: two bars of 3/2, and a return to C the reader did not see (16 length misreads, metre 25 of 29)

- **The page.** Bars 4 and 5 (truth bars 3 and 4) are printed in 3/2 inside C. Bar 6 returns to C with a printed C. Bars 30 to 32 repeat the pattern.
- **What the reader saw.** The time-signature reader saw both 3/2s and neither C. From the console:
  - `bar 4 (page 1): 3/2 not stated: bar 6 holds 4/1 quarters, not 6/1`
  - `bar 30 (page 3): 3/2 not stated: bar 32 holds 4/1 quarters, not 6/1`
- **Why the 3/2 was refused.** Witness 5 (`apps/web/src/lib/omr/metre-witness.ts:212`, the check at `:229`) sums the first four countable bars from the 3/2 to the next signature it was shown. The unseen C left bar 6 inside that span, and bar 6 holds four quarters, so the proposal failed.
- **Why the notes came out wrong.** homr's metre then stayed in force. Its writer stated 16/16 at bar 4, a bar of four quarters. Bar 4 states a time, so the tuplet rules leave it alone (`triplets.ts:295`). Bar 5 states none, holds six quarters (one and a half times the metre), has no dot and no marked tuplet, and so rule 1 read it as triplets throughout (`triplets.ts:352`). That is 8 notes and a rest at two thirds of their length, twice: 16 length misreads. The 4 metre misses are bars 4, 5, 30, and 31.
- **Earlier work.** This is the same family as L's bars 45 and 47 in row 61, where a printed 3/4 went unread and rule 1 then made the bar triplets. Row 57's witness is the fix for a seen signature that sums. Its one-bar exception (the desk, 2026-10-11) covers a change whose return is seen. Neither reaches a change whose return is not seen.

### X: three bars of the truth (6 pitch misreads)

These are truth faults (see the truth check). The reader reads all six notes as printed.

### S: the piano's right hand braced to the voice on page 8 (20 extra notes)

- **The page.** Page 8 (scan page 6), last system: the voice, then the piano's grand staff. The trace shows homr's staffs on that page:

  ```
  detected: [v, g] [v, g] [g, v]    (v single staff, g grand staff, one bracket per system)
  ```

- **Why the system came out wrong.** The system's three staffs were scored against every brace candidate (`third_party/homr-web/src/geometry/braces.ts:207`, `selectGrandstaffs`).
  - The piano's brace on that system was not among the candidates.
  - A box at the left edge, from the voice's staff down to the top of the right hand's, scored 0.599 with the pair (voice, right hand).
  - The pair (right hand, left hand) scored 0 against every candidate.
  - So homr made the voice and the right hand one grand staff and left the left hand single. The voice's part read that grand staff, and the right hand's notes came into the voice for four bars (reader bars 67 to 70; imgpos y 3001 to 4016 in one bar, where the voice's staff is at about 3050).
- **Earlier work.** This is the same family as rows 49 and 61 (the piano read as the voice). Row 49's `joinUnbracedPianos` acts only on a system with no grand staff (`parse-staffs.ts:190` to `:239`), and this system has one.

### S: the English and French lines (12 extra notes, 2 length misreads, after the fix)

- **Bar 49 (page 7, system 1, bar 3).** Two rhythms are printed on one staff: English, a dotted quarter, eighth, and quarter; Russian, a half and a quarter. homr read both, which gives 3 extra notes.
- **Bars 69 to 73.** The voice divides. The upper line is English and Russian, and the lower line, stems down and partly in small or parenthesised heads, is French. homr wrote the lower line as more voices on the same staff. `conv.py` takes every voice on staff 1 (`conv.py:19` filters only by staff and chord), so the lower line counts as extra: 9 extra notes.
- **The 2 length misreads.** Both are UNSURE notes in these split bars: bar 69's tied E5 and bar 72's «ю». The scorer's alignment paired each with a French note beside it.
- **DESK DEFAULT applied (brief section 3.3):** the song is the Russian underlay's line, so these notes are not the song.
- **No rule built.** homr's MusicXML gives no stem direction and no cue size (`<stem>` occurs 0 times in T's reading). Its voice numbers do not follow the line: in T's bar 21, the Russian half is voice 2, and the French quarters are voice 1. Keeping voice 1 alone would drop Russian notes.

### T: the French line (14 extra notes) and one dot (1 length misread)

- **The 14 extra notes.** In bars 21, 22, 41, 43, and 73 to 76, the French text splits a Russian note into smaller notes printed beside it (stems opposite, small heads). homr read them as further notes on the staff:
  - bar 21: 2
  - bar 22: 1
  - bar 41: 2
  - bar 43: 2
  - bar 73: 2
  - bar 74: 3
  - bar 75: 1
  - bar 76: 1

  The cause, and why no rule was built, are as for S.
- **Bar 22, «мчал».** The page prints a dotted quarter. homr wrote a plain quarter (`<type>quarter</type>`, no `<dot/>`), in the bar where the two small French eighths stand beside «про». The bar is not too long, so no rule acts. **Why homr's model left out the dot is NOT ESTABLISHED.**

### V: a nested triplet and one group of mixed beams (7 length misreads)

- **Bar 4, 5 notes.** The page prints a 3 over a bracket of seven sixteenths (two, then three under a second, smaller 3, then two), filling two eighths. The truth is 1/24, 1/24, 1/36 three times, 1/24, 1/24.
  - homr marked the first five as one triplet (1/24 each) and wrote the last two as plain sixteenths. The bar comes to 13/12 of the metre.
  - Rule 2 cannot fill the bar: the marked notes plus the rest at two thirds give 19/24 (`triplets.ts:360`).
  - Rule 3 finds no runs that make the bar exactly full (`triplets.ts:370`).
  - The page look read no number: "looked over 2 bars, read 0". Even read, a number is matched only to a run of n notes of one plain value (`isRun`, `triplets.ts:209`). A 3 over seven notes, with a tuplet inside it, has no such run.
  - **Why the page look read neither 3 is NOT ESTABLISHED.**
- **Bar 5, 2 notes.** The second group's beams taper: 64th, 64th, 32nd, sixteenth (four beams, then three, then two). homr wrote all four as 64ths. The bar is then short, and the rules act only on a bar too long (`triplets.ts:309`). **Why homr's model read four beams for all four notes is NOT ESTABLISHED.**
- **The metre.** Witness 5 refused C for the same bar: `bar 5 holds 13/3 quarters, not 4/1`. homr's 4/4 stays, and the metre as printed is 20 of 20.

## The fixes

### Kept

1. **A return the reader did not see** (`apps/web/src/lib/omr/metre-witness.ts`, the header item, `Verdict.until`, and now `:229` to `:236`; `join-pages.ts`, now `:573`).
   - **The rule:** where the first countable bars, two or more, add up to a seen signature, and the next countable bar adds up to the metre in force before it, the signature is stated for those bars, and homr's metre takes over again at that bar.
   - **A rule about notation:** a bar cannot add up to two metres of different lengths, so the bar names the return the page printed and the reader missed.
   - **Effect on the four:** X reads 3/2 at bars 4 and 30 and C again at 6 and 32 (`3/2 stated: 2 bars add up to 3/2; bar 6 holds 4/1 quarters, the metre before it: a return not seen`). It goes from 16 length misreads to 0, and its metre from 25 to 29 of 29.
   - **Test:** one new test in `metre-witness.test.ts` covers the «Ночь» shape, one bar of change (not stated), and a bar of a third length (not a return).
2. **homr-web `0.2.0-ilya.7`: a voice braced to the piano's upper staff is regrouped** (`third_party/homr-web/src/geometry/braces.ts`, `pianoBracedAtTheBottom`, called from `findBracesBracketsAndGrandStaffLines`).
   - **The rule (model 465 only):** on a page where a system holds a single staff directly above a grand staff, a system of three staffs that homr made a grand staff of its top two, with its bottom one single, is made its top staff single and its bottom two the grand staff.
   - **A rule about notation:** a piano's brace joins its two staffs below the voice. A voice's staff is never braced to the piano's upper staff while the lower stands alone.
   - **Effect on the four:** S's page 8 traces as `[v, g] [v, g] [v, g]`, and S loses the 20 notes of the right hand.
   - **A guard added during the work.** The first form looked for "a single staff above a grand staff" across systems, as `joinUnbracedPianos` does. The port test showed that a page made only of this fault would then pass the check against itself. The check is now within one system. The readings measured below are all from the final form.

### Not built, and why

- **The other language's line (S and T).** homr's output carries nothing that tells the Russian line from the French or English one: no stem direction, no cue size, and voice numbers that do not follow the line. A rule that keeps one voice drops Russian notes in T's bar 21.
- **V's nested triplet and mixed beams.** These are faults in homr's model. A bar's own arithmetic cannot recover them, and the page look's matching rule cannot express a tuplet inside a tuplet.
- **T's lost dot.** The bar is not too long, and a single missing dot leaves no arithmetic for a rule to act on.

None of the brief's leads needed a change to `VocalLineEvent` or `apps/web/src/lib/score/reconciliation/`. Neither was touched.

### The version and the package

- **Version:** homr-web `0.2.0-ilya.7` in:
  - `third_party/homr-web/package.json`, `README.md`, `README-ilya.md`, and `CHANGES-ilya.md` (a new section, 0.2.0-ilya.7, and two rows in the file table)
  - `apps/web/package.json`
  - `apps/web/src/lib/omr/stamp.ts` (`HOMR_WEB_VERSION`, so readings stamped ilya.6 are read again)
  - the comment at `homr-reader.ts:5` to `:6`
  - `NOTICES.md` ("six places")
- **The package:** `third_party/homr-web/homr-web-0.2.0-ilya.7.tgz`, **new and untracked**, md5 `cf4b95db538887512fef2fe575d6fc67`, 289,380 bytes.
  - Built as row 61 built ilya.6: the worktree from `~/Downloads/_desk-2026-10-05/homr-web-main-worktree.tgz` with `src/` and the package files replaced by the tree's, then `npm ci`, `npm run build`, and `npm pack`.
  - Its contents differ from the ilya.6 package's only in `dist/geometry/braces.js`, `dist/geometry/braces.d.ts`, `package.json`, `README.md`, and `CHANGES-ilya.md`.
- **The lockfile:** `pnpm-lock.yaml` changes 6 lines: the file name, the integrity, and the version. pnpm added no `libc:` lines this time. The pre-change lockfile is kept at `measure-set3-four-below_2026-10-11/pnpm-lock.before.yaml`.
- **The ilya.2 to ilya.6 packages** stay where they are.

**Before shipping, Dann adds `third_party/homr-web/homr-web-0.2.0-ilya.7.tgz` with `git add`.** No other new file is under `apps/` or `third_party/`.

## Tests

- **Ilya:** one new test in `apps/web/src/lib/omr/metre-witness.test.ts`. The omr suite passes, 146 of 146, before the gates.
- **The port:** `piano-braced-ilya7.test.ts`, 3 tests, all pass:
  - the regroup on S's page shape;
  - a page with no voice over a piano, including a page made only of the fault;
  - model 396 unchanged.

  It is kept outside the tree, as rows 49 and 61 kept theirs: `measure-set3-four-below_2026-10-11/port/piano-braced-ilya7.test.ts`, md5 `a89e436ae8ce448c9b5ebe5d5172e793`.
- **The port's whole suite in that worktree** (models absent, so the model tests skip): 917 passed, 1 failed, 42 skipped, run twice with the same result. The failure is `vocabulary-cleanup.test.ts`, the float16 test: it timed out after about 600 s. Rows 49 and 61 recorded this same failure on this Mac before any change. I did not run the suite on the ilya.6 source this session, so the count is not compared with row 61's 926.

## Gates

From row 74's copy of `ilya-ship.sh` that cannot stage (`measure-m-p-r74_2026-10-11/gates-scratch.sh`; its gate 4 line expects 2181). Seven are at baseline. **Gate 4 moves 2181 to 2182** (the new witness test).

| Gate | Result |
|---|---|
| 1 phonology | 251 passed (251) |
| 2 dictionary | 242 passed (242) |
| 3 web-check | found 0 errors and 12 warnings in 5 files |
| 4 web-test | **2182 passed (2182)**, baseline 2181 |
| 5 score-parser | 653 passed, 5 skipped (658) |
| 6 blurb | 145 passed (145) |
| 7 integration | 55 passed (55) |
| 8 ratchets | ratchets: OK. |

The ship script's gate 4 line is the desk's to move.

## Before and after, against both truths

`final-line.ts` lines, unedited. "Before" is the local drop at `7bb929a`, which is byte for byte row 76's reading. "After" is the local build with both fixes.

**Before**

```
original: S: webgpu; 115 of 116 right; missing 0; extra 32; pitch misreads 0; length misreads 1; bars read 86 of 86; octave shift 0; metre as printed 64 of 64 bars (22 bars with no matched note or rest not judged); score 71.6 BELOW; with 8 notes marked UNSURE set aside 70.4 BELOW
corrected: S: webgpu; 115 of 116 right; missing 0; extra 32; pitch misreads 0; length misreads 1; bars read 86 of 86; octave shift 0; metre as printed 64 of 64 bars (22 bars with no matched note or rest not judged); score 71.6 BELOW; with 8 notes marked UNSURE set aside 70.4 BELOW
original: T: webgpu; 196 of 197 right; missing 0; extra 14; pitch misreads 0; length misreads 1; bars read 80 of 80; octave shift 0; metre as printed 61 of 61 bars (19 bars with no matched note or rest not judged); score 92.4 BELOW; with 8 notes marked UNSURE set aside 92.1 BELOW
corrected: T: webgpu; 196 of 197 right; missing 0; extra 14; pitch misreads 0; length misreads 1; bars read 80 of 80; octave shift 0; metre as printed 61 of 61 bars (19 bars with no matched note or rest not judged); score 92.4 BELOW; with 8 notes marked UNSURE set aside 92.1 BELOW
original: V: webgpu; 123 of 130 right; missing 0; extra 0; pitch misreads 0; length misreads 7; bars read 31 of 31; octave shift 0; metre as printed 20 of 20 bars (11 bars with no matched note or rest not judged); score 94.6 BELOW; with 1 note marked UNSURE set aside 94.6 BELOW
corrected: V: webgpu; 123 of 130 right; missing 0; extra 0; pitch misreads 0; length misreads 7; bars read 31 of 31; octave shift 0; metre as printed 20 of 20 bars (11 bars with no matched note or rest not judged); score 94.6 BELOW; with 1 note marked UNSURE set aside 94.6 BELOW
original: X: webgpu; 122 of 144 right; missing 0; extra 0; pitch misreads 6; length misreads 16; bars read 35 of 35; octave shift 0; metre as printed 25 of 29 bars (6 bars with no matched note or rest not judged); score 84.7 BELOW; no note marked UNSURE
corrected: X: webgpu; 128 of 144 right; missing 0; extra 0; pitch misreads 0; length misreads 16; bars read 35 of 35; octave shift 0; metre as printed 25 of 29 bars (6 bars with no matched note or rest not judged); score 88.9 BELOW; no note marked UNSURE
```

**After**

```
original: S: webgpu; 114 of 116 right; missing 0; extra 12; pitch misreads 0; length misreads 2; bars read 86 of 86; octave shift 0; metre as printed 64 of 64 bars (22 bars with no matched note or rest not judged); score 87.9 BELOW; with 8 notes marked UNSURE set aside 88.9 BELOW
corrected: S: webgpu; 114 of 116 right; missing 0; extra 12; pitch misreads 0; length misreads 2; bars read 86 of 86; octave shift 0; metre as printed 64 of 64 bars (22 bars with no matched note or rest not judged); score 87.9 BELOW; with 8 notes marked UNSURE set aside 88.9 BELOW
original: T: webgpu; 196 of 197 right; missing 0; extra 14; pitch misreads 0; length misreads 1; bars read 80 of 80; octave shift 0; metre as printed 61 of 61 bars (19 bars with no matched note or rest not judged); score 92.4 BELOW; with 8 notes marked UNSURE set aside 92.1 BELOW
corrected: T: webgpu; 196 of 197 right; missing 0; extra 14; pitch misreads 0; length misreads 1; bars read 80 of 80; octave shift 0; metre as printed 61 of 61 bars (19 bars with no matched note or rest not judged); score 92.4 BELOW; with 8 notes marked UNSURE set aside 92.1 BELOW
original: V: webgpu; 123 of 130 right; missing 0; extra 0; pitch misreads 0; length misreads 7; bars read 31 of 31; octave shift 0; metre as printed 20 of 20 bars (11 bars with no matched note or rest not judged); score 94.6 BELOW; with 1 note marked UNSURE set aside 94.6 BELOW
corrected: V: webgpu; 123 of 130 right; missing 0; extra 0; pitch misreads 0; length misreads 7; bars read 31 of 31; octave shift 0; metre as printed 20 of 20 bars (11 bars with no matched note or rest not judged); score 94.6 BELOW; with 1 note marked UNSURE set aside 94.6 BELOW
original: X: webgpu; 138 of 144 right; missing 0; extra 0; pitch misreads 6; length misreads 0; bars read 35 of 35; octave shift 0; metre as printed 29 of 29 bars (6 bars with no matched note or rest not judged); score 95.8 PASS; no note marked UNSURE
corrected: X: webgpu; 144 of 144 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 35 of 35; octave shift 0; metre as printed 29 of 29 bars (6 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
```

**One count went the wrong way: S's length misreads, 1 to 2.** With the piano gone, the alignment pairs bar 69's UNSURE E5 (a tied quarter) with the French E5 eighth beside it. Its notes are not changed, and with UNSURE set aside S rises from 70.4 to 88.9.

## The regression checks

Through the drop box on the local build, with both fixes. Every song was read (no refusal), and each reading was compared by `cmp` (`run.py cmp`, `regression-cmp.txt`):

- **The 17 build songs and A, B, C, E, F** against row 74's rule-on readings. The code under `apps/` and `third_party/` did not change from `232c5a7` to `7bb929a`.
- **K, L, M, P and G, H, I, J, N, O** against row 74's step 3 readings.
- **Q, R, U, W, Y, Z** against row 76's readings. Only "same" or "changed" was printed.

```
A same
B same
C same
E same
F same
grech same
gur same
k01 same
k02 same
k03 same
k04 same
k06 same
k07 same
k08 same
k09 same
k10 same
sun1 same
sun4 same
sun5 same
sun6 same
tch same
varl same
K same
L same
M same
P same
G same
H same
I same
J same
N same
O same
Q same
R same
U same
W same
Y same
Z same
```

**38 of 38 same.** Because K to P and G to O read byte for byte as before, their lines equal row 74's (`after-lines.txt`):

```
original: K: webgpu; 133 of 134 right; missing 0; extra 0; pitch misreads 0; length misreads 1; bars read 51 of 53; octave shift 0; metre as printed 33 of 33 bars (20 bars with no matched note or rest not judged); score 99.3 PASS; with 1 note marked UNSURE set aside 100.0 PASS
corrected: K: webgpu; 134 of 134 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 51 of 53; octave shift 0; metre as printed 33 of 33 bars (20 bars with no matched note or rest not judged); score 100.0 PASS; with 1 note marked UNSURE set aside 100.0 PASS
original: L: webgpu; 75 of 82 right; missing 0; extra 0; pitch misreads 4; length misreads 3; bars read 76 of 76; octave shift 0; metre as printed 42 of 42 bars (34 bars with no matched note or rest not judged); score 91.5 BELOW; with 2 notes marked UNSURE set aside 93.8 BELOW
corrected: L: webgpu; 79 of 82 right; missing 0; extra 0; pitch misreads 0; length misreads 3; bars read 76 of 76; octave shift 0; metre as printed 42 of 42 bars (34 bars with no matched note or rest not judged); score 96.3 PASS; with 2 notes marked UNSURE set aside 98.8 PASS
original: M: webgpu; 62 of 62 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 26 of 26; octave shift 0; metre as printed 19 of 19 bars (7 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
corrected: M: webgpu; 62 of 62 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 26 of 26; octave shift 0; metre as printed 19 of 19 bars (7 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
original: P: webgpu; 89 of 116 right; missing 0; extra 0; pitch misreads 0; length misreads 27; bars read 46 of 48; octave shift 0; metre as printed 0 of 34 bars (14 bars with no matched note or rest not judged); score 76.7 BELOW; with 3 notes marked UNSURE set aside 77.9 BELOW
corrected: P: webgpu; 90 of 116 right; missing 0; extra 0; pitch misreads 0; length misreads 26; bars read 46 of 48; octave shift 0; metre as printed 0 of 34 bars (14 bars with no matched note or rest not judged); score 77.6 BELOW; with 3 notes marked UNSURE set aside 77.9 BELOW
original: G: webgpu; 110 of 110 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 59 of 63; octave shift 0; metre as printed 46 of 46 bars (17 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
original: H: webgpu; 136 of 144 right; missing 0; extra 0; pitch misreads 1; length misreads 7; bars read 61 of 61; octave shift 0; metre as printed 45 of 45 bars (16 bars with no matched note or rest not judged); score 94.4 BELOW; with 3 notes marked UNSURE set aside 95.7 PASS
original: I: webgpu; 123 of 127 right; missing 0; extra 0; pitch misreads 1; length misreads 3; bars read 28 of 28; octave shift 0; metre as printed 24 of 24 bars (4 bars with no matched note or rest not judged); score 96.9 PASS; no note marked UNSURE
original: J: webgpu; 91 of 91 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 49 of 49; octave shift 0; metre as printed 30 of 30 bars (19 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
original: N: webgpu; 226 of 235 right; missing 9; extra 2; pitch misreads 0; length misreads 0; bars read 82 of 82; octave shift 0; metre as printed 63 of 63 bars (19 bars with no matched note or rest not judged); score 95.3 PASS; no note marked UNSURE
original: O: webgpu; 155 of 160 right; missing 0; extra 0; pitch misreads 5; length misreads 0; bars read 37 of 37; octave shift 0; metre as printed 37 of 37 bars (0 bars with no matched note or rest not judged); score 96.9 PASS; no note marked UNSURE
```

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **That either fix acts on any song outside these 42.** Neither changed a byte of the 38 protected readings, so none of them has a 3/2-style change with an unseen return, or a voice braced to the right hand. How often a real score has either is not known.
- **Why homr's model read four beams on V's tapering group, left out the dot of T's «мчал», and left out X's eighth rest in bar 20.** These are inside homr's model.
- **Why the page look read neither 3 in V's bar 4.** Even if it had, the matching rule cannot express a tuplet inside a tuplet.
- **Why the brace of S's page 8, last system, was not among homr's candidates,** and what the box that scored with voice and right hand is on the page. It spans from the voice's staff to the top of the right hand's, at the left edge.
- **A general rule for the other language's line.** One would need stem direction or note size, which homr's MusicXML does not carry. Whether homr's own symbols (before the writer) carry either was not looked at.
- **That the WebAssembly trace shows the same staffs as WebGPU.** The trace was under Node, on WebAssembly, at 400 dpi from `pdftoppm`, not from pdf.js. The WebGPU readings fit it (the 20 notes went where the trace said), but the layout was not dumped from WebGPU.
- **Truth.** The four truth files are unproofed drafts. Only the bars listed above were checked against the page. The corrected X copy is my reading of the print, not Dann's.
- **The deployed build of this change.** "After" is the local dev server. The change is not committed or deployed.
- **Reads on Dann's iMac, in a headed window, or on WebAssembly.** One WebGPU read per song, on this Mac.

## What was looked at, and a slip carried from row 76

- **Opened:** S, T, V, and X: scans (rendered in the session scratchpad, not kept), readings, truth, and their `notes.md`.
- **Readings opened when they changed:** none of the 38 protected readings changed.
- **Q, R, U, W, Y, and Z:** only "same" or "changed" was printed. Their readings sit in `measure-set3-four-below_2026-10-11/after/drops/`, unopened.
- **Carried from row 76:** in that session I listed the truth folder once with `ls`, which printed the ten file names. I saw the sealed titles then, not in this session.

## The files

- **Changed:**
  - `apps/web/src/lib/omr/metre-witness.ts`, `metre-witness.test.ts`, `join-pages.ts`, `stamp.ts`, and `homr-reader.ts` (comment), plus `apps/web/package.json`
  - `third_party/homr-web/src/geometry/braces.ts`, `package.json`, `README.md`, `README-ilya.md`, and `CHANGES-ilya.md`
  - `NOTICES.md` and `pnpm-lock.yaml`
- **New, untracked:** `third_party/homr-web/homr-web-0.2.0-ilya.7.tgz` (to `git add`). Everything else new is under `docs/sessions/`.
- **The harness, in `docs/sessions/measure-set3-four-below_2026-10-11/`:**
  - scripts: `run.py`, `drop.mjs` (row 76's), `diff.ts`, `bars.py`, `meas.py`, `where.py`, and `four.json`
  - readings: `before/`, `after/`, `fixA/` (fix 1 alone, X only), and `superseded/` (the first form of fix 2)
  - `stalled/`, the lines files, and `regression-cmp.txt`
  - `port/`: the port test, the run script, and the hooked `parse-staffs.ts`
