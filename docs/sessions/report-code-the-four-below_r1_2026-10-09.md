# Report: the four sealed songs below 95, opened and diagnosed (r1, 2026-10-09)

Code (Opus 5.5) on Dann's Mac, QUEUE row 61, brief `brief-code-the-four-below_r1_2026-10-09.md`. Tree at `16e6a9a` on `Shane`, clean at the start. No git command that writes was run. Nothing is staged or committed. G, H, I, J, N, and O were not opened.

## The result

Two general fixes stay, and one song now passes:

- **K passes.** It reads 133 of 134 against the original truth (99.3), and 134 of 134 against the corrected truth (100.0). Its 107 extra notes came from a page of the piano alone, read as the voice.
- **L's extras are gone.** All 116 extra notes went: they were the piano's introduction and one system's piano. L stays below on the score (87.8 original, 92.7 corrected). With the UNSURE notes set aside, it reaches 95.0 against the corrected truth and stays below against the original (90.0).
- **M and P are not fixed.** M stays at 88.7 and P at 77.6 (corrected truth); their causes are described below.

Four other fixes worked on the four songs but were taken out, because each moved a song the brief protects:

- **M's two covers left out:** this changed sealed I.
- **K's lost piano-alone system kept:** this changed sealed G.
- **A metre from the bars that hold notes** (which also set P's 12/8): this changed sealed I.
- **Duplets read in a short compound bar:** this made Kabalevsky no. 7 worse.

With what stays, every one of the 17 opened and build songs, A, B, C, E, F, and the six sealed passes reads byte for byte as before.

## The four

| Letter | Song | Edition |
|---|---|---|
| K | M. Ippolitov-Ivanov, «Невольникъ», op. 28 no. 4 (words A. Maikov) | P. Jurgenson, Moscow, 1899, plate 24819 |
| L | P. Khvoshchinsky, «Не можетъ быть», romance, op. 4 no. 4 (words A. Maikov) | A. Iogansen, St Petersburg, page number 165 |
| M | A. Lyadov, «Колыбельная», op. 22 no. 1 (*6 Children's Songs*) | M. P. Belaieff, Leipzig, 1898, plate 203 |
| P | A. Zhitomirsky, «Бѣлая луна», op. 6 no. 2 (words Verlaine) | P. Jurgenson, Moscow, plate 37102 |

The letters map through row 55's `labels.txt` in its private folder (the scans in glob order).

## How it was read

- **Before:** row 55's own readings, from the deployed site at `16e6a9a`, which serves the app as at `472ed96`.
- **After:** the local dev server on port 5173 with this change, through the drop box (Playwright, headless Google Chrome, `setInputFiles` on the intake's file input, a fresh browser context per song), and the reading the app keeps in IndexedDB. The adapter on every read is `apple metal-3` with `shader-f16`, on WebGPU, stamped `homr-web@0.2.0-ilya.6/465`.
- **Instrument check:** the reader called from the page on the dev server (`readScanPages`, before any change) gave all four of row 55's readings byte for byte.
- **Scoring:** `conv.py`, then `final-line.ts` under node 24.13 with type stripping, as row 55 ran it. The scorer and `final-line.ts` were not touched.
- **Layout traces:** a copy of the port under Node on WebAssembly, with row 49's two `globalThis` hooks in `parseStaffs`, run on the PNGs the app rasterized. Its MusicXML differs from WebGPU's in places, but the systems it reports explain every bar below. The hooks are not in the tree.

## Truth checked against the page

Every bar the scorer marks as extra, misread, or missing was looked at on the app's own render of the page. The extra notes of K, L, and M are bars the truth has no voice in (piano and covers), so their truth stands. The bars where the truth departs from the print:

| Song, truth bar | The page | The truth (draft) | Corrected copy |
|---|---|---|---|
| K, bar 32 (page 5) | C5, the second note, a quarter with no flag (the bar sums to 9/8) | C5 an eighth, marked UNSURE | the print: a quarter |
| L, bar 16 (page 2, system 4, bar 5) | three heads just under the bottom line, D4 (as bars 12 and 14, with no ledger line) | B♭3 three times (the draft's head check said −3.2 steps) | D4 three times |
| L, bar 17 | one head in the bottom space, F4 | D4 | F4 |
| P, bar 9 (page 3, system 2, bar 2) | F5 a dotted quarter, tied to F5 a quarter (the bar sums to 9/8 in 12/8) | F5 a dotted half, marked UNSURE | the print: a dotted quarter |

Left as the draft has them:

- **L, bar 18.** The first bracketed 3 covers only an eighth rest and an eighth. The page does not settle the rhythm, and the draft marks the bar UNSURE.
- **P's duplets.** In every bar the scorer marks, the 2 is printed over two eighths: bars 1, 6, 8, 11, 19, 20, and 33 (bar 20's figure is smudged, UNSURE in the draft).

**M:** no bar in the voice disagrees.

The corrected copies are beside the originals in `~/Downloads/_desk-2026-10-08/heldout2-truth-r2/truth/`, each with a `corrections` list naming every note changed:

- `ippolitov-ivanov_op28_no4_nevolnik.truth.corrected.json` (md5 `4affb3b78bfcffbc895c104d68376327`)
- `khvoshchinsky_op4_no4_ne_mozhet_byt.truth.corrected.json` (`a03d60b890482ad43ed9782973e27e61`)
- `zhitomirsky_op6_no2_belaya_luna.truth.corrected.json` (`4b95f1287ad3bae1d9dab7cf8e0c5831`)

M has no corrected copy; it is scored against its original twice. The originals were not edited.

## The causes

Line numbers are at `16e6a9a` unless marked "now".

### K: a page of the piano alone, read as the voice (107 extra notes)

- **Page 6 is the postlude, five systems of the piano's grand staff, and no voice.** homr detected five grand staffs and made them one part. Ilya keeps homr's first part as the sung line (`apps/web/src/lib/omr/join-pages.ts:145` `firstPart`, called at `:394`), so the piano's right hand became 12 bars of voice notes (reader bars 39 to 50).
- **The same fault as row 49 (a piano read as the voice), but in a place row 49's fix cannot reach.** Row 49's `joinUnbracedPianos` and day 4's `systemOffsets` work within one page, on a page that also prints the voice (`third_party/homr-web/src/pipeline/parse-staffs.ts:145` to `:166`, `layout` at `:153`). Page 6 prints no voice, so no rule on the page can know the piano is not the voice. Row 49's report names this case as open: "a page that holds only the piano".
- **Page 5 also lost its last system, the piano alone (three bars).** homr detected `vg, vg, v, g, g` (v a single staff, g a grand staff, commas between detected systems). The flags F T F T F T T give homr main's `findPeriodicCore` the period 2 with the last staff trimmed. `ensureSameNumberOfStaffsMain` keeps only the trimmed core (`third_party/homr-web/src/pipeline/staff-image.ts:187` to `:198`), so that system never reaches `systemOffsets`. No note is lost, because the voice rests there. The bars are lost: 51 read of 53.
- **K, bar 32:** a length "misread" that is the truth's (see the truth check).

### L: the introduction and one system's piano, read as the voice (116 extra notes)

- **Page 2 prints the 12-bar piano introduction on three systems of the piano alone, then the voice's first system over the piano.** homr detected `g, g, g, vg`. The flags T T T F T have no period. homr main's fallback breaks every system into single staffs (`staff-image.ts:202` to `:204`), and one voice took every staff. The voice became the introduction (reader bars 0 to 11), its own six bars, and that system's piano (reader bars 18 to 23).
- **The same family as row 49 (a piano read as the voice).** Row 49's `joinUnbracedPianos` merges single staffs into a grand staff; here homr found every brace, and the systems were split afterwards.
- **Bars 16 and 17, 4 pitch "misreads":** truth faults (see the truth check).
- **Bar 18, 3 lengths and a rest:** the UNSURE triplets.
- **Bars 45 and 47, 3 lengths and 3 rests.** The page prints 3/4 at bar 45 (bar 46 counting from 1) on the voice staff, and homr did not read it. With 2/4 in force, each 3/4 bar is half as long again as its metre. Rule 1 of `triplets.ts` read the bar's plain quarters as triplets (`apps/web/src/lib/omr/triplets.ts:351`).

### M: two covers read as music (7 extra notes, 9 extra bars)

- **Pages 1 and 2 are the collection's cover and its decorative title page.** homr found 4 and 3 "staves" in their borders and lettering, so neither answered `not_music`. Their staff boxes are 0.60, 0.03, 0.03, and 0.04 of the page wide, and 0.13, 0.02, and 0.32. Every staff of music on the four songs is 0.69 to 0.90 of the page wide.
- **The same fault as row 53 (a title page read as music), but row 53's rule did not reach these pages.** That rule (`apps/web/src/lib/omr/homr-reader.ts:114` to `:118`, `withoutCovers`) leaves out a page before the first page with two staves or more only where homr found exactly one staff on it. The count it uses is every staff homr found (`homr-reader.ts:284`), and page 1 has 4, so the song is taken to start on page 1.
- **The cost:** 9 bars (reader bars 0 to 8) and 7 notes.

### P: duplets and the metre (27 length misreads, metre 0 of 34)

All of it is in homr's own output for the voice. No join rule changes it.

- **The duplets.** The song is in 12/8, and every duplet is two eighths under a 2 in the time of three. homr's model writes them three ways:
  - as triplet eighths, 1/12 each (page 2, bar 1, four notes);
  - as quintuplet quarters, 1/5 each (bar 8, four notes);
  - as plain eighths (bars 6, 11, 19, 20, and 33).
- **The page look reads few of the 2s.** It read 2 numbers in 31 bars (row 55's console: "looked over 31 bars, read 1 (2)"; after this change, 28 bars and 2).
- **Why `triplets.ts` cannot repair them:**
  - A run that homr already marked with another number is not a run (`isRun`, `triplets.ts:209` to `:215`).
  - The rules act only on a bar too long (`:308` to `:309`), and a missed duplet leaves the bar short.
- **The metre.** homr read no time signature on page 2. homr main's writer then writes a metre of its own from the median length of the page's bars in the voice (`third_party/homr-web/src/musicxml/generate-main.ts:131` to `:164`, used at `:1091`). Two whole-bar rests count there as a whole note each, and the duplet bars are short, so the median came to 5/4. The join keeps it as the song's metre, and it is read as 10/8. homr reads only a time signature's lower figure, so the 9/8 at bar 15 and the 12/8 at bar 30 are not seen (row 57's open problem).
- **Bars read 46 of 48:** two bars of the piano alone were trimmed, as on K's page 5.
- **P, bar 9:** a truth fault (see the truth check).

## The fixes

### Kept

1. **A page of the piano alone is the voice resting** (`apps/web/src/lib/omr/join-pages.ts`, now `:332` to `:390`, used at `:455` and `:460`).
   - **The rule:** where every part homr read on a page is on two staves (a grand staff), in a song where another page gives the voice a part of its own on one staff above a part on two, the page's bars stay bars of the song and hold no note for the voice.
   - **The guard:** a part that states two staves counts as on two only where every bar holding a note has a note on the lower staff. A part in which homr ran the voice's single staff on after a grand staff therefore counts as on one.
   - **A rule about notation:** a musician reads a page of the piano alone, in a song for voice and piano, as the voice resting.
   - **Effect on the four:** K loses its 107 extra notes; L's page 2 now reads as the voice resting there.
2. **homr-web `0.2.0-ilya.6`: with no period, a page that prints the voice above the piano keeps its systems as detected** (`third_party/homr-web/src/pipeline/staff-image.ts`, now `voiceOverPiano` at `:186`, used at `:233`).
   - **The rule:** where a detected system holds a single staff directly above a grand staff, and the flags have no period, the systems are kept as detected instead of being broken into single staffs.
   - **A rule about notation:** a printed system is never split. That is ilya.3's own rule for a regrouping that would cut a system.
   - **Effect on the four:** `systemOffsets` then gives the voice rests in L's three systems of the piano alone. L reads `g, g, g, vg`, its 116 extra notes go, and its bars read 76 of 76.

### Taken out, and why

| Fix | What it did on the four | Why it was taken out |
|---|---|---|
| A cover is a page with fewer than two staves at least half the page wide (`withoutCovers`, counting by width) | M: 7 extra notes and 9 bars gone, M 100.0 | It changed sealed I, alone of the six (found by switching it on and off with everything else fixed). Not tuned further: tuning a threshold until a sealed song stops moving would be fitting the sealed set. |
| Keep a grand staff that the periodic trim drops at an end of the page, where every staff trimmed there is a piano alone | K: page 5's three bars back, 53 of 53 | It changed sealed G, alone of the six. A first form also kept a trimmed grand staff above a trimmed single staff, which added 4 empty bars to *Sunless* 5 (page 1, under the last system); it was narrowed before G was found. |
| The writer's metre from the median of the bars that hold a note, so a whole-bar rest does not set it (in the port) | P read as 12/8 to bar 31 (metre as printed 0 to 10 of 34); L's metre as printed stayed at 39 of 42 | It changed sealed I. With the app changes on, it looked neutral, because the cover rule changed I as well; it showed once the cover rule was out. |
| Rule 3 on a bar too short in compound metre, with the duplet | P: bars 6 and 11 read right, 89 to 97 of 116 | It made Kabalevsky op. 52 no. 7 worse (160 to 158). Bar 37 is short because homr dropped a sixteenth, and the rule made two sixteenths a duplet to fill it. |
| Rule 1 stands down where the page shows no numeral-sized mark over the bar's notes | none | It did not stop rule 1 on L's bars 45 and 47. The page look searches seven staff spaces above and below the notes (`tuplet-number.ts:15`), so the lyric's letters count as numeral-sized marks over the notes. |

### The version and the package

- **Version:** homr-web `0.2.0-ilya.6` in `third_party/homr-web/package.json`, `README.md`, `README-ilya.md`, and `CHANGES-ilya.md` (a section 0.2.0-ilya.6 that also records the two port changes taken out).
- **The app:** `apps/web/package.json`, `apps/web/src/lib/omr/stamp.ts` (`HOMR_WEB_VERSION`, so readings stamped ilya.5 are read again), the comment at `homr-reader.ts:5` to `:6`, and `NOTICES.md`.
- **The package:** `third_party/homr-web/homr-web-0.2.0-ilya.6.tgz`, **new and untracked**, md5 `588995755eddb1cf61914184ae8d9f3e`, 287,425 bytes.
  - Built as row 49 built ilya.5: the worktree from `~/Downloads/_desk-2026-10-05/homr-web-main-worktree.tgz`, with `src/` and the package files replaced by the tree's, then `npm ci`, `npm run build`, `npm pack`.
  - Its contents differ from the ilya.5 package's only in `dist/pipeline/staff-image.js`, `package.json`, `README.md`, and `CHANGES-ilya.md`.
- **The lockfile:** `pnpm-lock.yaml` changes 12 lines, the homr-web file name, integrity, and version. pnpm also added 18 `libc:` lines for Linux packages; they were taken out, as in row 49. `pnpm install --frozen-lockfile` accepts the result. md5 `5e1eee997f0714a323ad3dce09aa5813`.
- **The ilya.2 to ilya.5 packages** stay where they are.

**Before shipping, Dann adds `third_party/homr-web/homr-web-0.2.0-ilya.6.tgz` with `git add`.** No other new file is under `apps/` or `third_party/`.

`VocalLineEvent` and `apps/web/src/lib/score/reconciliation/` were not touched.

## Tests

- **Ilya:** one new test in `join-pages.test.ts`. It covers:
  - the piano-alone page, with the voice silent and the bars kept;
  - a song with no page of voice over piano, read as before;
  - a part that runs a single staff on, which is not the piano alone.
- **The port:** `test/pianos-alone-ilya6.test.ts`, 4 tests:
  - L's page 2 layout and its offsets;
  - a page whose flags have a period, trim included (K's page 5 and *Sunless* 5's page 1), read as homr main reads it;
  - a page with no voice above a grand staff;
  - model 396 unchanged.

  The file is kept outside the tree, as rows 40 and 49 kept theirs: `~/Downloads/_desk-2026-10-08/pianos-alone-ilya6.test.ts`, md5 `0fead237e48bcbbccf3f809d5ddc07dd`.
- **The port's whole suite in that worktree:**

  | Source | Passed | Failed | Skipped | The failures |
  |---|---|---|---|---|
  | ilya.6 | 926 | 1 | 42 | `vocabulary-cleanup.test.ts`, the float16 test |
  | HEAD's ilya.5 | 925 | 2 | 42 | the new L test, and the float16 test |

  The float16 failure is the same one row 49 recorded on this Mac before any change.

## Gates

From a copy of `ilya-ship.sh` that cannot stage. Seven at baseline; **gate 4 moves 2087 to 2088** (the join test).

| Gate | Result |
|---|---|
| 1 phonology | 251 passed (251) |
| 2 dictionary | 235 passed (235) |
| 3 web-check | found 0 errors and 12 warnings in 5 files |
| 4 web-test | **2088 passed (2088)**, baseline 2087 |
| 5 score-parser | 650 passed, 5 skipped (655) |
| 6 blurb | 145 passed (145) |
| 7 integration | 55 passed (55) |
| 8 ratchets | ratchets: OK. |

The ship script's gate 4 line is the desk's to move.

## Before and after, against both truths

`final-line.ts` lines, unedited. Before is row 55's readings; after is the local build with the kept fixes only.

**Before**

```
original:  K: webgpu; 133 of 134 right; missing 0; extra 107; pitch misreads 0; length misreads 1; bars read 51 of 53; octave shift 0; metre as printed 29 of 33 bars (20 bars with no matched note or rest not judged); score 19.4 BELOW; with 1 note marked UNSURE set aside 19.5 BELOW
corrected: K: webgpu; 134 of 134 right; missing 0; extra 107; pitch misreads 0; length misreads 0; bars read 51 of 53; octave shift 0; metre as printed 29 of 33 bars (20 bars with no matched note or rest not judged); score 20.1 BELOW; with 1 note marked UNSURE set aside 19.5 BELOW
original:  L: webgpu; 72 of 82 right; missing 0; extra 116; pitch misreads 4; length misreads 6; bars read 82 of 76; octave shift 0; metre as printed 39 of 42 bars (34 bars with no matched note or rest not judged); score -53.7 BELOW; with 2 notes marked UNSURE set aside -55.0 BELOW
corrected: L: webgpu; 76 of 82 right; missing 0; extra 116; pitch misreads 0; length misreads 6; bars read 82 of 76; octave shift 0; metre as printed 39 of 42 bars (34 bars with no matched note or rest not judged); score -48.8 BELOW; with 2 notes marked UNSURE set aside -50.0 BELOW
original:  M: webgpu; 62 of 62 right; missing 0; extra 7; pitch misreads 0; length misreads 0; bars read 35 of 26; octave shift 0; metre as printed 19 of 19 bars (7 bars with no matched note or rest not judged); score 88.7 BELOW; no note marked UNSURE
corrected: M: webgpu; 62 of 62 right; missing 0; extra 7; pitch misreads 0; length misreads 0; bars read 35 of 26; octave shift 0; metre as printed 19 of 19 bars (7 bars with no matched note or rest not judged); score 88.7 BELOW; no note marked UNSURE
original:  P: webgpu; 89 of 116 right; missing 0; extra 0; pitch misreads 0; length misreads 27; bars read 46 of 48; octave shift 0; metre as printed 0 of 34 bars (14 bars with no matched note or rest not judged); score 76.7 BELOW; with 3 notes marked UNSURE set aside 77.9 BELOW
corrected: P: webgpu; 90 of 116 right; missing 0; extra 0; pitch misreads 0; length misreads 26; bars read 46 of 48; octave shift 0; metre as printed 0 of 34 bars (14 bars with no matched note or rest not judged); score 77.6 BELOW; with 3 notes marked UNSURE set aside 77.9 BELOW
```

**After**

```
original:  K: webgpu; 133 of 134 right; missing 0; extra 0; pitch misreads 0; length misreads 1; bars read 51 of 53; octave shift 0; metre as printed 29 of 33 bars (20 bars with no matched note or rest not judged); score 99.3 PASS; with 1 note marked UNSURE set aside 100.0 PASS
corrected: K: webgpu; 134 of 134 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 51 of 53; octave shift 0; metre as printed 29 of 33 bars (20 bars with no matched note or rest not judged); score 100.0 PASS; with 1 note marked UNSURE set aside 100.0 PASS
original:  L: webgpu; 72 of 82 right; missing 0; extra 0; pitch misreads 4; length misreads 6; bars read 76 of 76; octave shift 0; metre as printed 12 of 42 bars (34 bars with no matched note or rest not judged); score 87.8 BELOW; with 2 notes marked UNSURE set aside 90.0 BELOW
corrected: L: webgpu; 76 of 82 right; missing 0; extra 0; pitch misreads 0; length misreads 6; bars read 76 of 76; octave shift 0; metre as printed 12 of 42 bars (34 bars with no matched note or rest not judged); score 92.7 BELOW; with 2 notes marked UNSURE set aside 95.0 PASS
original:  M: webgpu; 62 of 62 right; missing 0; extra 7; pitch misreads 0; length misreads 0; bars read 35 of 26; octave shift 0; metre as printed 19 of 19 bars (7 bars with no matched note or rest not judged); score 88.7 BELOW; no note marked UNSURE
corrected: M: webgpu; 62 of 62 right; missing 0; extra 7; pitch misreads 0; length misreads 0; bars read 35 of 26; octave shift 0; metre as printed 19 of 19 bars (7 bars with no matched note or rest not judged); score 88.7 BELOW; no note marked UNSURE
original:  P: webgpu; 89 of 116 right; missing 0; extra 0; pitch misreads 0; length misreads 27; bars read 46 of 48; octave shift 0; metre as printed 0 of 34 bars (14 bars with no matched note or rest not judged); score 76.7 BELOW; with 3 notes marked UNSURE set aside 77.9 BELOW
corrected: P: webgpu; 90 of 116 right; missing 0; extra 0; pitch misreads 0; length misreads 26; bars read 46 of 48; octave shift 0; metre as printed 0 of 34 bars (14 bars with no matched note or rest not judged); score 77.6 BELOW; with 3 notes marked UNSURE set aside 77.9 BELOW
```

**One thing worse: L's metre as printed falls from 39 to 12 of 42.** The voice's part on page 2 now opens with twelve bars of rests. Their lengths come from homr's reading of the piano's bars, which is not 3/4. The writer's own metre, the median of the page's bars, then comes out 4/4, and the join keeps it in force until homr states another. The notes are not affected. The port change that cured it (the median of the bars that hold a note) was taken out because it changed sealed I.

## The regression checks

Through the drop box on the local build, with the kept fixes only. Every song was read (no refusal), and each reading was compared with its reading before:

- **The 17 opened and build songs:** the "before" is a drop on the deployed site, today. Tchaikovsky op. 38 no. 3, *Sunless* 1, 4, 5, and 6, Kabalevsky op. 52 nos. 1, 2, 3, 4, 6, 7, 8, 9, and 10, Gurilyov, Grechaninov, and Varlamov: **same** (17 of 17).
- **The unseen A, B, C, E, and F:** the "before" is the same drop on the deployed site. **Same** (5 of 5). Nothing of theirs was printed but "same".
- **The six sealed passes:** the "before" is row 55's readings. Checked by `cmp` alone; only "same" or "changed" was printed.

```
G same (read)
H same (read)
I same (read)
J same (read)
N same (read)
O same (read)
```

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **What the cover rule and the median change did to I, and what the kept trim end did to G.** Each changed the sealed reading; whether for better or worse was not looked at, by the brief.
  - I's row 55 line (1 extra note, 31 bars read of 28) is the kind a cover read as music gives, but that is inference from its counts, not a finding.
  - Opening I and G is Dann's decision. If he opens them, the three fixes can be measured on them, and kept if they help.
- **A general fix for P's duplets.** homr's model writes them as three different values, and the page look reads few of this edition's 2s. A rule to make the printed number win over homr's (n of the page over n of homr) was not tried, because the 2s are not read.
- **Why homr's model reads a printed 2 as a triplet or a quintuplet,** and why the page look misses most of these 2s.
- **The metre of L, P, and every song where homr reads no time signature.** It stays homr's median (row 57's open problem).
- **A general rule for L's bars 45 and 47 (the 3/4 that homr did not read).** The page look cannot tell a printed 3 from the lyric.
- **That the WebAssembly traces show the same systems as WebGPU.** They were taken under Node, on WebAssembly; the WebGPU readings fit them bar for bar, but the layouts were not dumped from WebGPU.
- **Truth.** The four truth files are unproofed drafts. Only the bars listed above were checked against the page; the corrected copies are Code's reading of the print, not Dann's.
- **The deployed build of this change.** "After" is the local dev server. The change is not committed or deployed.
- **Reads on Dann's iMac, in a headed window, or on WebAssembly.** One WebGPU read per song, on this Mac.

## What was looked at

- **Opened:** K, L, M, and P (scans, page renders, readings, truth, and notes); the 17 opened and build songs' readings, where they changed during the work (*Sunless* 5 and Kabalevsky no. 7).
- **A, B, C, E, F and G, H, I, J, N, O:** only "same" or "changed" was printed, and whether each was read.

The working tree also holds edits this session did not make: `docs/memory/CONTRACT.md`, `INBOX.md`, `OPEN.md`, and `STATE.md`, and three untracked briefs in `docs/sessions/`.
