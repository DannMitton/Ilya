# Report: a quadruplet and a double flat in set 4's 4F (QUEUE row 89, r1)

Code (Opus 5.5) on Dann's Mac, 2026-10-12, brief `brief-code-4f-quadruplet-and-double-flat_r2_2026-10-12.md` (r2), read whole. Tree at `72b564f` on `Shane`.

- **At the start,** `docs/memory/CONTRACT.md`, `OWED.md`, `QUEUE.md`, and `brief-code-n86-notation-overlay_r2_2026-10-12.md` were already modified. During the run, someone other than me modified `docs/memory/OPEN.md`, `README.md`, and `SCHEDULE.md` and added several untracked files under `docs/`. I did not touch any of them.
- **In `docs/memory/`, I changed only row 89's State cell in `QUEUE.md`.**
- **No git command that writes was run.** The only git commands were `git status`, `git diff`, `git rev-parse`, and `git show HEAD:<path>` (see "A slip in the order").
- **4F was the only set 4 song opened.** The other nine and set 3's six were compared by script, which printed only the label and "same" or "changed".

## The answer first

One general fix is kept, and 4F now passes.

| 4F, on the local dev server | Original truth | Corrected truth |
|---|---|---|
| Before (tree at `72b564f`) | 89.2 BELOW | 94.1 BELOW |
| After (the fix) | 93.1 BELOW (95.8 PASS with UNSURE set aside) | **98.0 PASS** |

- **m. 24 is fixed.** The page look read the printed 4. The reader had no space for a 4 in 3/4, so it passed over the number, and rule 3 then made the first three quarters a triplet. The fix: a number printed alone, with no space by convention, fills the space that leaves the bar exactly full. The four quarters are now 4:3, 3/16 each.
- **m. 22 is not fixed.** homr's model gave both notes the lift `b` (one flat), not `bb`. homr's vocabulary does have a double flat, and Ilya passes `<alter>` through unchanged. Ilya cannot correct the model's choice without reading the accidental from the page, which no part of Ilya does. See "Not built, and why".
- **Protected readings:** 38 of 38 same. **Sealed set 4:** 9 of 9 same.
- **Gates:** all eight pass. **Gate 4 moves 2433 to 2436** (three new tests).

## 4F's six misreads, before and after

From `misreads.py` on the same dev server, against the corrected truth. Measure numbers count the opening bar as m. 1, so file index 21 is m. 22.

| File index | Syllable | Truth | Before | After |
|---|---|---|---|---|
| 21 | «го?..» | B𝄫4 (midi 69), 1/2 | B♭4 (midi 70), 1/2 | B♭4 (midi 70), 1/2: **not fixed** |
| 21 | «Все» | B𝄫4 (midi 69), 1/4 | B♭4 (midi 70), 1/4 | B♭4 (midi 70), 1/4: **not fixed** |
| 23 | «все» | D♭5, 3/16 (4:3) | D♭5, 1/6 | D♭5, 3/16 |
| 23 | «ю» | D♭5, 3/16 (4:3) | D♭5, 1/6 | D♭5, 3/16 |
| 23 | «пол» | E♭5, 3/16 (4:3) | E♭5, 1/6 | E♭5, 3/16 |
| 23 | «но» | E♭5, 3/16 (4:3) | E♭5, 1/4 | E♭5, 3/16 |

Before, there were exactly section 1's six misreads and no others. After, two remain.

## 4F's lines, unedited

**Before** (the tree at `72b564f`, no change made; the reading is byte for byte row 86's, `run.py cmp before r86 4F`: same):

```
original: 4F: webgpu; 91 of 102 right; missing 0; extra 0; pitch misreads 7; length misreads 4; bars read 40 of 40; octave shift 0; metre as printed 38 of 38 bars (2 bars with no matched note or rest not judged); score 89.2 BELOW; with 6 notes marked UNSURE set aside 91.7 BELOW
corrected: 4F: webgpu; 96 of 102 right; missing 0; extra 0; pitch misreads 2; length misreads 4; bars read 40 of 40; octave shift 0; metre as printed 38 of 38 bars (2 bars with no matched note or rest not judged); score 94.1 BELOW; with 1 note marked UNSURE set aside 94.1 BELOW
```

These equal row 86's 89.2 and the desk's 94.1.

**After:**

```
original: 4F: webgpu; 95 of 102 right; missing 0; extra 0; pitch misreads 7; length misreads 0; bars read 40 of 40; octave shift 0; metre as printed 38 of 38 bars (2 bars with no matched note or rest not judged); score 93.1 BELOW; with 6 notes marked UNSURE set aside 95.8 PASS
corrected: 4F: webgpu; 100 of 102 right; missing 0; extra 0; pitch misreads 2; length misreads 0; bars read 40 of 40; octave shift 0; metre as printed 38 of 38 bars (2 bars with no matched note or rest not judged); score 98.0 PASS; with 1 note marked UNSURE set aside 98.0 PASS
```

## How it was read

- **The server:** the local dev server (`.claude/launch.json`, `ilya-web`, port 5173). Each song was dropped through the drop box by row 77's `drop.mjs` (Playwright, headless Google Chrome, WebGPU, a fresh context per song), and the reading was taken from the `ilya-library` `sources` store. Every reading was on WebGPU.
- **Scoring:** `conv.py`, then `final-line.ts` under `tsx`. Neither was touched.
- **The trace for section 3 (`diag.mjs`):** one more drop of 4F, with `page.route` patching the served `homr-reader.ts` and `triplets.ts` inside the browser only. It logs homr's own MusicXML for each page, each `lookOverNotes` answer, and each `completeTriplets` call with its rule. The tree was not changed for it. That drop's reading is byte for byte the plain drop's.
- **Load faults:** the first 4F drop after each dev-server start or edit timed out with no `[omr]` line, because the page reloaded under it, as rows 77 and 86 recorded. Each was dropped once more and read. None of the 94 drops of the 47 songs had a fault.
- **Where things are:**
  - In `docs/sessions/measure-4f-quadruplet_2026-10-12/`: the harness (`run.py`, `diag.mjs`, `misreads.py`, `gates-scratch.sh`), the protected readings (`before/`, `after/`), P's trace (`diag/`), the logs, and the fix as kept (`fix/`).
  - Kept privately in `~/Downloads/_desk-heldout4-private/run/` (`r89-before`, `r89-after`, `r89-diag`): every set 4 reading, 4F's scores, and its trace.

## Section 3: the bar at each step

### m. 24 (file index 23), 3/4, page 3 of the scan, bar 6 on it

**(a) homr's own MusicXML** (divisions 2). There is no `<dot/>` and no `<time-modification>`:

| Note | `<type>` | `<duration>` | imgpos |
|---|---|---|---|
| D♭5 | quarter | 2 | 451, 2158 |
| D♭5 | quarter | 2 | 704, 2197 |
| E♭5 | quarter | 2 | 871, 2199 |
| E♭5 | quarter | 2 | 1068, 2201 |

These are four plain quarters: 4/4 in a bar of 3/4, so the bar is too long.

**(b) The page.** The join asked the page over this bar, and over no other bar (`homr-reader.ts:199-208`). `lookOverNotes` answered:

```
numbers: [{ n: 4, m: null, x: 783.5, y: 644 }]   centres: [783.5, 881, 1077]   space: 24
```

The join placed the 4 at 1.476 notes, over the middle of all four (1.5). The console line: `[omr] printed tuplet numbers: looked over 1 bars, read 1 (4)`.

**(c) `completeTriplets`.**
- It took the 4 and asked `conventionalSpace(4, 3/4)`, which answers null for a power of two in simple metre (`triplets.ts:201-206` at `72b564f`). So the number was passed over (`triplets.ts:316-317` at `72b564f`).
- The bar was still too long. Rule 3 (`triplets.ts:365-378` at `72b564f`) found exactly one choice of 3:2 runs that fills it: notes 1 to 3, a mark standing within 0.6 of their middle (the 4 at 1.476).
- **Rule 3**: 3:2, 3:2, 3:2, then a plain quarter. That makes 1/2 + 1/4 = 3/4, so the bar check (`:384-385`) kept it. The bar was written in divisions 6: durations 4, 4, 4, 6.

**(d) Stored and scored.** The stored reading has `<attributes><divisions>6</divisions></attributes>`, then three quarters at 3:2 (duration 4) and one plain quarter (duration 6). `conv.py` lists 1/6, 1/6, 1/6, and 1/4.

### m. 22 (file index 21)

| Step | «го?..» | «Все» |
|---|---|---|
| homr's `<pitch>` | `<step>B</step><octave>4</octave><alter>-1</alter>` | the same |
| homr's `<accidental>` | none | none |
| The stored reading | B, 4, alter -1, no `<accidental>` | the same |
| `conv.py`'s midi | 70 | 70 |
| The truth's midi | 69 (B𝄫4) | 69 (B𝄫4) |

- **The join and the tuplet check leave the bar alone.** It adds up to 3/4, so `completeTriplets` returns null and asks no page.
- **No code in Ilya's reader reads or writes `<alter>` or `<accidental>`.** A search of `apps/web/src/lib/omr/` for "alter" finds only comments about accidentals in `tuplet-number.ts`.

### homr's vocabulary holds a double flat and a double sharp

- `third_party/homr-web/src/transformer/vocabulary.ts:363`: `LIFT_TOKENS = [".", "_", "#", "##", "N", "b", "bb"]`.
- `third_party/homr-web/src/musicxml/generate-main.ts:272-278`: `LIFT_TO_ALTER` maps `"##"` to 2 and `bb` to -2. `:455-461` writes that number as `<alter>`. `generate.ts:290` (model 396's writer) has the same map.
- `third_party/homr-web/src/transformer/decoder.ts:130`: the lift is the decoder's top choice from `out_lifts` (7 columns). Between that choice and the writer, nothing in homr-web reads or changes a lift.
- homr writes no `<accidental>` element.
- `CHANGES-ilya.md` mentions no double accidental, so Ilya's copy changed none of this.
- Ilya's own parser reads `<alter>` as an integer (`packages/score-parser/src/musicxml-parser.ts:765-767`), so a -2 from homr would reach the singer's path.

## The causes

- **m. 24:** a printed number with no conventional space was passed over (`triplets.ts:316-317` at `72b564f`, via `conventionalSpace`, `:201-206`). Rule 3 then filled the bar with a 3:2 run (`:365-378`), which also adds up.
- **m. 22:** homr's model chose the lift `b`, not `bb`, for both notes (`third_party/homr-web/src/transformer/decoder.ts:130`). The writer wrote `<alter>-1</alter>` (`generate-main.ts:455-461`), and Ilya passes it through as written.

## The fix

**A printed number with no space by convention takes the space that fills the bar** (`apps/web/src/lib/omr/triplets.ts`, now `:318-360`; the header, `:55-58`).

- **The rule:**
  - The page step does as before for every number it can give a space: the printed m, or else `conventionalSpace`.
  - A number with no space, such as a 4 in 3/4 or a 2 in 3/8, is kept aside.
  - Where it is the bar's only such number, its n notes are found as before (`runUnder`, the old matching code made a function).
  - They are made n in the space of m, where m is how many notes of their value leave the bar exactly full, the bar's other notes as they stand.
  - The bar check (now `:410-411`, unchanged) still keeps the result only where the bar then fits.
- **A rule about notation:** the printed number names the notes, and the bar names their time.
- **JUDGEMENT** (design taste, unsourced; not checked against Gould, whose Table 2 `conventionalSpace` already defers to): m must lie strictly between n/2 and 2n, and must not be n. Two such numbers in one bar are not read, because the bar names only their combined time.
- **What it does not touch:**
  - The page-free rules (`ruleRatios`, `triplets.ts:276-279` at `72b564f`) are not widened. Without the page, the four quarters still come out as rule 3's triplet (tested).
  - A number that already has a space, printed or conventional, is handled exactly as before.
- **Effect:** 4F's m. 24 is stored as four quarters at 4:3, duration 3 in divisions 4. The next bar restores divisions 2.

### The second case

No opened song shows a second printed number with no conventional space.

- **The search:** the console lines of every kept drop under `docs/sessions/` for `printed tuplet numbers`. The only numbers read other than 3 are P's two 2s, `read 2 (2, 2)`.
- **P, traced** (one `diag.mjs` drop on the unchanged tree; reading byte for byte row 77's): both 2s are in 12/8. In compound metre `conventionalSpace` already gives a 2 the space of 3, so the fix cannot reach them. P's reading is unchanged after the fix (below).

So the second cases are tests in `apps/web/src/lib/omr/triplets.test.ts`, run in gate 4:

1. `:177`: 4F's bar shape. Four quarters in 3/4, a 4 read at 1.476: rule `page`, four notes at 4:3, divisions 4, durations 3, 3, 3, 3. With no page, rule 3 still gives its triplet.
2. `:191`: a duplet in 3/8. Two eighths under a 2: 2:3, durations 3 and 3.
3. `:201`: three refusals. A 4 whose bar would need the space of 2 (n/2); a 4 whose bar leaves it no space at all; and two 4s in one bar. Each leaves the bar as homr wrote it.

All three pass. Before the gates, `triplets.test.ts` ran 23 of 23.

## Not built, and why

- **The double flat (m. 22).** homr's vocabulary carries `bb` and `##`, and both homr's writer and Ilya's parser carry a -2 or a 2 through. The fault is the model's choice of lift, and homr's output says nothing that a rule could correct: no `<accidental>` element, and the same `<alter>-1</alter>` a plain B♭ in this key would have.
  - Recovering it would mean reading the accidental's glyph from the page beside each note, as `tuplet-number.ts` reads numbers.
  - That is a new page reader, with its own false readings to guard against ("A false number is worse than a missed one", `tuplet-number.ts:40`). It is a decision for the desk, not a fix inside this row. Nothing was built.

## A slip in the order, and how it was put right

The brief asks for the protected readings to be dropped before any change. I wrote the fix and its tests before dropping the 47.

1. I copied both files aside (`fix/`).
2. I wrote back their committed text with `git show HEAD:<path> > <path>`, a read-only git command and a file write.
3. I confirmed that `git status` showed no change under `apps/`.
4. I dropped the 47 on that tree, then copied the fix back.

4F's before drop came before any edit. The after files are byte for byte the ones in `fix/`.

## The protected readings

All 47 songs were dropped on the dev server before the change and again after, and compared by `cmp` (`run.py cmp`).

- **The 38 of row 77** (A, B, C, E, F; the 17 build songs; K, L, M, P, G, H, I, J, N, O; Q, R, U, W, Y, Z):
  - before against row 77's readings: **38 of 38 same**, so none differed before the change (`cmp-before-r77.txt`);
  - after against before: **38 of 38 same**;
  - after against row 77: **38 of 38 same** (`after.log`).
- **The nine sealed set 4 songs** (4A to 4E and 4G to 4J), against row 86's readings in `~/Downloads/_desk-heldout4-private/run/ten/drops/`:
  - before: 9 of 9 same (`cmp-before-r86.txt`);
  - after against before: **9 of 9 same**.

  No line of theirs was printed.

## Gates

These were run from a copy of `~/Downloads/ilya-ship.sh` that cannot stage (`gates-scratch.sh`: the untracked check and everything from the commit step on are cut; no `git add`, `commit`, or `push` in it).

| Gate | Before (`72b564f`) | After |
|---|---|---|
| 1 phonology | 251 passed (251) | 251 passed (251) |
| 2 dictionary | 248 passed (248) | 248 passed (248) |
| 3 web-check | 0 errors and 12 warnings in 5 files | 0 errors and 12 warnings in 5 files |
| 4 web-test | 2433 passed (2433) | **2436 passed (2436)** |
| 5 score-parser | 675 passed, 5 skipped (680) | 675 passed, 5 skipped (680) |
| 6 blurb | 145 passed (145) | 145 passed (145) |
| 7 integration | 55 passed (55) | 55 passed (55) |
| 8 ratchets | ratchets: OK. | ratchets: OK. |

**Gate 4 moves 2433 to 2436** (the three new tests). The ship script's gate 4 line is the desk's to move.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **Why homr's model chose `b` over `bb` at m. 22,** and whether `bb` was its second choice. The decoder keeps only the top choice; the scores of the other six columns were not logged.
- **How often the fix acts outside these 48 songs.** It changed nothing in the 47 others. No opened song other than 4F prints a number that has no conventional space.
- **That the space rule matches Gould.** `conventionalSpace` is itself a desk default "to be checked against Gould's Table 2 (p. 203)". The n/2 to 2n bound is JUDGEMENT. Neither was checked against `gould-vocal-engraving-rules_v6`.
- **The page itself.** I did not view 4F's scan. The page's 4 at m. 24 is known only from the page reader's answer and the corrected truth. The double flat is known from the truth and Dann's reading at 20:05.
- **The deployed build.** "After" is the local dev server. Nothing is committed or deployed.
- **Other paths:** WebAssembly, the iMac, and a headed window. There was one headless WebGPU read per song, on this Mac.

## The files

- **Changed:** `apps/web/src/lib/omr/triplets.ts` and `triplets.test.ts`. No package, lockfile, or homr-web file was changed.
- **New, under `docs/sessions/`:** this report and `measure-4f-quadruplet_2026-10-12/`.
- **In `docs/memory/`:** row 89's State cell in `QUEUE.md`.

The code is WRITTEN. DONE is Dann's walk.
