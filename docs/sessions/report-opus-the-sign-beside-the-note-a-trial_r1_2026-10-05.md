# Report: the sign beside the note, a trial

> **Provenance, added by the desk (Fable), 2026-10-05 07:00.** `QUEUE.md` row 33. Brief: `brief-opus-the-sign-beside-the-note-a-trial_r1_2026-10-05.md`. An Opus subagent in the desk's cloud workspace, 05:53 to 06:47. Cost: 321,927 tokens, 131 tool uses, 55 minutes (the desk had named 650,000 and 110). It built nothing into Ilya. **The desk copied the helper's final message here from its transcript, as returned. Its claims are its own, and the desk checked none of them:** Dann geared the project down at 06:48, before the desk had opened the helper's tables or crops. **THE TRIAL DID NOT PASS.** The desk's line, on the two test songs, was at least 8 of the 12 sign misreads repaired and at most 2 notes broken. Run once: the shape rules repaired 2 and broke 5; the classifier repaired 5 and broke 12. Nothing of it enters Ilya, and under the plan of 06:55 (`STATE.md`) work on the reader's accuracy stops until Dann reopens it. The scripts, models, tables, and crop sheets are in `~/Downloads/_desk-2026-10-05/sign-trial_r1_2026-10-05.tgz`.

## Summary (test songs first)

1. **Test songs (Sunless 5 and 6), cautious mix, reader 1 (shape rules):** it repaired 2 of the 12 sign misreads and broke 5 notes that homr had read as printed. Sunless 5 had 2 repaired and 4 broken; Sunless 6 had 0 and 1 (`tables/e2e-summary.csv:8-9`). This does not meet the desk's line of at least 8 repaired and at most 2 broken.
2. **Test songs, cautious mix, reader 2 (classifier trained on computer-drawn signs):** it repaired 5 of 12 and broke 12. Sunless 5 had 4 and 6; Sunless 6 had 1 and 6 (`e2e-summary.csv:10-11`). This does not meet the line.
3. **Test songs, alteration by rule from the signs read, against homr's own:**
   - homr: Sunless 5 250 of 258, Sunless 6 156 of 161.
   - Reader 1: 237 of 258 and 153 of 161.
   - Reader 2: 248 of 258 and 143 of 161.
4. **Test songs, printed double sharps:** the rule expects 7 and 6 of them were located. Reader 1 read 0 of the 6 and reader 2 read 2 (`tables/signs-test-r1.csv`, `signs-test-r2.csv`, rows `dsharp`).
5. **Which reader is better on the test songs:** both lose notes overall. Net change for the cautious mix is minus 3 for reader 1 (2 repaired, 5 broken) and minus 7 for reader 2 (5 repaired, 12 broken).
6. **Development songs (Tchaikovsky, Sunless 1, Sunless 4), cautious mix:** both readers repaired 1 and broke 0 (`e2e-summary.csv:2-7`). The repaired note is Tchaikovsky bar 68, which lies under the misread key.
7. **Development songs, signs:** of 38 located notes with an expected sign:
   - Reader 1 read 37 right and put no sign where none is printed (`signs-dev-r1.csv`).
   - Reader 2 read 36 right and put a sign at 3 notes where none is printed: two barlines and one ledger line, seen in crops (`signs-dev-r2.csv`).
8. **Tuned on all five songs (labelled "tuned on the test songs"):** reader 1's cautious mix repaired 6 of 12 and broke 3 on the test songs. Its development figures did not change (`e2e-summary.csv:12-16`).
9. **Notes located (staff, head and window found):** 367 of 386 on the development songs and 417 of 448 on the test songs (`tables/dev-rerun.log`, `tables/test-run-once.log`).
10. **Hand check:** for 20 notes of Sunless 4, what I see printed matches the sign the rule expects in 20 of 20. Reader 1 agrees in 20 of 20 and reader 2 in 18 of 20 (`tables/handcheck-sun4.csv`).

## What I took from the field

- **oemer** (GitHub `BreezeWhite/oemer` at dbe2a93): a sign region is resized to a fixed small box and given to a pickled scikit-learn model on raw pixels (`oemer/inference.py:128-139`; `oemer/classifier.py:112` uses `svm.SVC()`). The sign is joined to the note found by scanning right from the box's right edge, at its centre row, for one staff space (`oemer/symbol_extraction.py:373-383`).
- **homr** (`liebharc/homr` at 560ca5c): each note carries a separate "lift" token from {nonote, empty, #, ##, N, b, bb} (`homr/transformer/vocabulary.py:88-90`). Its training truth is rewritten so that a sign carries to the end of the bar (`homr/circle_of_fifths.py:129-170`).
- **Audiveris:** NOT ESTABLISHED; I did not read it in the time.
- **What I took:** classify a small window of fixed size, resampled to the staff space, placed by position left of the head at the head's row. Keep the sign and the carry rule as separate steps.

## The method as frozen

Frozen at 06:31:14, before any note of the test songs was read. `models/FROZEN.txt` holds the md5 of every script and model. After the test run, `tail -n +3 FROZEN.txt | md5sum -c` passed.

**Notes and expected sign** (`scripts/notes.py`):
- There is one row per pitched voice note of the joined reading.
- The expected sign comes from the truth MIDI on homr's step: first the truth key, then the carry within homr's bar on that step and octave. A note tied over from the same step and octave expects no sign.

**From `imgpos` to the head and the window** (`scripts/geom.py`):
- **Staff lines:** in a band from 110 px left to 110 px right of `imgpos` x and 260 px above to 260 px below it, I search 41 slopes from -0.10 to 0.10 for the sharpest row profile. I keep five evenly spaced lines, skipping beams between them, each at least 0.5 strong. I choose the five lines whose head row for homr's step, octave and clef lies nearest `imgpos` y plus 0.6 staff spaces.
- **Head:** on the levelled row band of plus or minus 0.42 staff spaces, with staff-line rows left out, I look for runs of "head-like" columns. A head-like column has ink across at least 30% of the band, and does not have ink across 45% or more both 0.6 to 1.4 staff spaces above and the same distance below. I take the run nearest `imgpos` x plus 0.27 staff spaces. Its right edge is the head's right edge, and the head's left edge is 1.3 staff spaces to the left of that.
- **Window:** from 2.6 staff spaces left of the head's left edge up to that edge, and from 2.2 staff spaces above the head row to 2.0 below it, levelled.
- **`imgpos` against the head centre** (development songs): x is off by a median of -7.8 px (5th to 95th percentile: -36.3 to 8.2); y by a median of -18.4 px (-48.6 to 9.8). The test songs are similar.
- **What else the window holds:** in the hand check, 15 of 20 windows hold something that is not this note's sign: the note before, a rest, a barline, a slur or a dot (`sheets/handcheck-sun4.png`, by my look).
- **Notes not located:**

  | Songs | No head | No staff | Head row far from `imgpos` |
  |---|---|---|---|
  | Development | 10 | 8 | 1 |
  | Test | 24 | 4 | 3 |

  A note that is not located keeps homr's alteration.

**Reader 1, shape rules in staff spaces** (`scripts/rules.py`):
- The window is resampled at 20 px per staff space. Staff lines are taken out where no ink crosses them. A stem hanging from the head at the window's right edge is erased.
- The sign is the component nearest the head that ends within 0.8 staff spaces of the head. Strokes are vertical runs of at least 1.0 staff space, measured with the lines kept.
- The classes:
  - **Flat:** a tall left stroke with a top 1.3 staff spaces or more above the head, and a short right side.
  - **Natural:** the right stroke starts and ends at least 0.35 staff spaces lower than the left one.
  - **Sharp:** both stroke ends within 0.15 staff spaces of each other, or the right one higher.
  - **Double sharp:** 0.55 to 1.35 staff spaces each way, no strokes, centred on the head, fill at least 0.45.
- Sureness: 0.85 for a clear sharp or natural, 0.9 for "none" with nothing in the zone, 0.6 when unsure.
- Its only size comes from the page's staff space. I did not build a calibration from the key-signature sharps.

**Reader 2, classifier** (`synth_v1.py`, `synth.py`, `train.py`, `read_clf.py`):
- **Training set:** 9,600 windows per model, drawn from six SMuFL fonts (`@vexflow-fonts` Bravura, Petaluma, Leland, Gonville, Sebastian, Finale Ash). Each window has staff and ledger lines, a head, sometimes a stem, and things that sit before a note: heads, stems, barlines, rests, dots, slurs and letters. Each is then blurred, noised, thresholded, thinned or thickened, and for the second model also slanted and widened.
- **Model:** two scikit-learn networks of 1092-96-6, with their probabilities averaged. The held-out synthetic accuracy is 0.9906 and 0.974 (`train.py` output). Nothing in the training comes from any page.

**The rule and the cautious mix** (`scripts/e2e.py`):
- **Key:** the song's majority key in homr's reading. This was 2 sharps for every development song, 0 for Sunless 5 and 7 for Sunless 6.
- **Rule:** a sign read sets the alteration and carries to the end of homr's bar.
- **Mix:** keeps homr's alteration unless the rule disagrees and every sign read that decides it has a sureness of at least 0.8.

## Development songs

**Signs read against signs expected** (`tables/signs-dev-r1.csv`, `signs-dev-r2.csv`):
- **Reader 1:**
  - Sharp: 18 of 18 located.
  - Flat: 10 of 10.
  - Natural: 9 of 10; the miss, Sunless 4 bar 23 C5, was read as none.
  - Expected none: 325 read none. 4 were read as natural, and all 4 are printed courtesy naturals by my look (`tables/dev-courtesy.csv`, `sheets/dev-courtesy-naturals.png`).
- **Reader 2:**
  - Sharp: 17 of 18; one was read as a double flat.
  - Flat: 10 of 10.
  - Natural: 9 of 10; one was read as a sharp.
  - Expected none: 322 read none. Of the 7 read as a sign, 4 are the courtesy naturals: 2 read as natural, 1 as a sharp and 1 as a flat. The other 3 have nothing printed (tch-2 bar 57 and tch-3 bar 93 are barlines; Sunless 4 bar 13 C4 is a ledger line).

**End to end** (`e2e-summary.csv:2-7`):

| Song | homr | Reader 1 rule | Reader 1 mix | Reader 2 rule | Reader 2 mix |
|---|---|---|---|---|---|
| Tchaikovsky | 172/174 | 173 (repaired 1, broken 0) | 173 (1, 0) | 173 (1, 0) | 173 (1, 0) |
| Sunless 1 | 96/96 | 96 | 96 | 96 | 96 |
| Sunless 4 | 116/116 | 115 (broken 1) | 116 | 108 (broken 8) | 116 |

- The mix broke no note with either reader.
- The rule's broken notes are listed with crops in `sheets/dev-r1-rule_broken.png` (Sunless 4 bar 23 C5) and `sheets/dev-r2-rule_broken.png` (8 notes on sun-03 and sun-04).
- Tchaikovsky bar 36 D4 (a sharp where none is printed) was not located: the staff on tch-2 is faint and broken. homr's alteration stays for that note.

**Repeatability:** `run_dev.sh` run a second time gave byte-equal outputs (`tables/dev-before.md5`). `synth_v1.py` with seed 11 rebuilt its training set exactly.

## Test songs, as run once

Output as run is in `tables/test-run-once.log`.

**Signs** (located notes; `tables/signs-test-r1.csv`, `signs-test-r2.csv`):
- **Notes with an expected sign:** 132 were located.
  - Reader 1 read 106 as expected. It missed 6 double sharps (all read as none), read 14 sharps as none or natural, read 2 flats as none, and read 4 naturals as none or sharp.
  - Reader 2 read 113 as expected. It read 13 naturals as sharps (9 of them in Sunless 6), missed 4 double sharps, and read 2 sharps as none.
- **Notes expected to have no sign:** 285 were located.
  - Reader 1 read a sign at 16. By my look (`sheets/test-signs-not-expected.png`), 14 of those have a sign printed (courtesy) and 2 have none: sun-11 bar 59 is a rest and bar 60 F4 is the previous note's flag.
  - Reader 2 read a sign at 19. By my look, 18 have a sign printed and 1 has none (sun-11 bar 60 F4). Two of the 18, sun-05 bars 8 and 11, are small and faint, so that look is less sure.

**End to end** (`e2e-summary.csv:8-11`):

| Song | homr | Reader 1 rule | Reader 1 mix | Reader 2 rule | Reader 2 mix |
|---|---|---|---|---|---|
| Sunless 5 | 250/258 | 237 (repaired 4, broken 17) | 248 (repaired 2, broken 4) | 248 (5, 7) | 248 (4, 6) |
| Sunless 6 | 156/161 | 153 (1, 4) | 155 (0, 1) | 143 (1, 14) | 151 (1, 6) |

**The 12 sign misreads, against the desk's line, cautious mix:**
- **Reader 1 repaired 2:** sun-07 bar 23 G4 and sun-10 bar 42 G4, both printed naturals.
- **Reader 2 repaired 5:** sun-05 bar 2 C4 (a double sharp) and its carried note, sun-09 bar 38 G4 (a double sharp), sun-10 bar 42 G4, and sun-15 bar 36 B4 (carried).
- **Reader 1 broke 5:**
  - sun-11 bar 60 F4: a double sharp read from the previous note's flag, plus its carried note.
  - sun-11 bar 67 F4: a printed sharp read as a natural, plus its carried note.
  - sun-14 bar 28 A4: a printed natural read as a sharp.
- **Reader 2 broke 12:** in 10 of them a heavy printed natural was read as a sharp, or a note carried from one. These are sun-08 bar 30, sun-11 bar 52, sun-12 bars 4 and 7, sun-13 bar 10 (twice), sun-16 bar 43 and sun-17 bar 48. The other 2 are sun-11 bar 60 F4 and its carried note. Crops are in `sheets/test-r1-mix_broken.png` and `sheets/test-r2-mix_broken.png`; repaired notes are in `test-r*-mix_repaired.png`.
- **The 13th pitch difference** (sun-11 bar 60 E4): a sharp is printed beside the E (seen in `sheets/test-r1-homr_wrong.png`). Reader 1 missed that sharp, so its rule result agrees with the truth file there. That accounts for 1 of the 4 rule repairs in Sunless 5; the mix does not count it as repaired.

**Why the double sharps were missed, by looking at the crops:**
- **Reader 1's shape rule turned them down.** The X's arms make vertical runs of about 1.1 staff spaces, and these counted as strokes. For notes 1 and 172 the program printed height 1.2 and 1.3, width 1.3, fill 0.73 and 0.74, and two strokes from -0.5 to 0.6.
- **The head finder took the double sharp for the head.** This happened at sun-14 bars 22 and 23 and sun-16 bar 44.
- **One was not located:** sun-14 bar 21.

## Tuned on all five songs: tuned on the test songs

There are two changes, marked in `scripts_tuned/geom.py` and `scripts_tuned/rules.py`:
1. A head-like run with another one within 0.6 staff spaces to its right is a sign, and the head is the right-hand run.
2. A double sharp may have short arm runs centred on the head, up to 1.5 staff spaces, with a fill of at least 0.6.

Results (`e2e-summary.csv:12-21`):
- **Reader 1, cautious mix:** Sunless 5 253 of 258 (repaired 5, broken 2); Sunless 6 156 of 161 (repaired 1, broken 1). Development songs unchanged: 173, 96, 116.
- **Reader 1, rule:** 242 of 258 and 154 of 161.
- **Reader 2, cautious mix:** 248 of 258 and 152 of 161.
- **On the 12 misreads:** reader 1's mix repaired 6, with 3 broken. That is still under the desk's line.
- **Still missed:** sun-09 bar 35 C4, sun-14 bars 21 and 22, and sun-16 bar 44 (double sharps), plus 2 carried naturals whose source sign was read with a sureness under 0.8. Crops are in `sheets/tuned-on-test-songs-r1-*.png`.

## What a browser would need

- **Image operations:** a threshold; row sums over a 220-column band under 41 shears; an affine resample with area averaging (OpenCV `warpAffine` with `INTER_AREA`); column run lengths; and, for reader 1, 8-connected components in a window of about 52 by 84 px.
- **Model sizes:**
  - Reader 1: no model.
  - Reader 2: two networks of 105,510 parameters each, 211,020 in all. That is 844 KB as float32; the pickles are 1.27 MB each.
- **Time per page here,** from the test run (13 pages): locating took 5.6 s per page, reader 1 4.9 s and reader 2 3.1 s. This was Python with per-pixel loops, on 2 cores shared with another helper at a load average of about 8 (`README.txt`, TIMES).

## NOT ESTABLISHED

- How Audiveris names and attaches an accidental.
- Reader 1 calibrated on the page's key-signature sharps: not built. Its only page size is the staff space.
- Any reading of a printed double flat: none appears in the expected signs of these five songs.
- Time in a browser.
- Whether the sharps printed beside E, A and B in Sunless 6, under a 7-sharp key (truth and homr agree on 7), are courtesy signs or something else on the page.
- Why one test note was located on a staff space of 15.9 px (half spacing).
- A hand check on the test songs beyond the crops named above.

## Deliverables (`/mnt/user-data/outputs/sign-trial/`, md5)

```
b17320eddcd3bb1b80739eba3b0f4100 README.txt
e5e91fa7796f5030791afee795e96b2d models/FROZEN.txt
8b9dc1be917af4c26288b9b914cf1b49 models/clf.pkl
6b00f3cfba1038417ea80b3fbd5a8697 models/clf2.pkl
bc5db4283e4c106782b4265525bffa63 scripts/crops.py
b75d7bfd7686a8108c7a62d557265e07 scripts/ctx.py
4cb6059f338dedebca4d816b042dff60 scripts/e2e.py
778af53f0243b8555dc03606a8e6d3d3 scripts/evalrules.py
b4604d9b9f987cb1bcecba5cf3e9fbd9 scripts/geom.py
5420cc68795e8791e6fe89d40ae09f31 scripts/geomcheck.py
1a13d0044cbf6a800bc147eba6c4d361 scripts/lib.py
54083eb6792edfd67c75f99503638675 scripts/locate_all.py
eeacecff5a88b67f4d4c62f90e6bdc6e scripts/notes.py
88462545a4968ea7dbf83942b053ee7d scripts/read_clf.py
0e79ea77d481bec6f8bf92736cf48bfa scripts/read_rules.py
7d66d4bc192c70cd0c9eb0f039463900 scripts/rules.py
7646187ebb5815e6f8eb09981a34fdf4 scripts/run_dev.sh
79a22f39a68be8075c5196f7b78d3a8c scripts/run_test.sh
b6b084877a2801dfd19281d860659d00 scripts/sheet.py
5b57fc2bbf7e150393a27f7f5140ffab scripts/synth.py
6e00942f896f4ac79055e9453e6fb489 scripts/synth_v1.py
24229046b0ebaaf5b21a55cd3ea0a9cc scripts/tables.py   (added after the freeze; it only counts)
fa6b9564709f9d2e5b2b9f7cdae0226d scripts/train.py
dff31cb94f0a08ec28f6f309b68834b9 scripts/train_all.sh
cdf4a7ca4df044262d1ff82ba2728a87 scripts_tuned/geom.py
d37260cd0506c9cc16cad2a8e9e9582d scripts_tuned/rules.py
fe89c43bd029a1a4af3f1aa000f4eaa4 scripts_tuned/run_tuned.sh
  (the other files in scripts_tuned/ have the same md5 as in scripts/)
6ae5ff2cc18508952e083e479d768aa7 tables/e2e-summary.csv
cce492e35a1d24c3bf9ce1096ee2f870 tables/signs-dev-r1.csv
866f6cfae2aecec89544fff88f9aeefa tables/signs-dev-r2.csv
0c066c7d7b4a2693705f0ef39cddfa61 tables/signs-test-r1.csv
0671ebb1fe736574d56c2e71fac09002 tables/signs-test-r2.csv
73e8f32c62af823f464f2dade0c6665e tables/signs-tuned-on-test-songs-r1.csv
914772592450f8f4909faec8c462db43 tables/signs-tuned-on-test-songs-r2.csv
251d4ca6ef0615da56ef5c7e07c0bcdb tables/dev-r1-e2e.csv
3f476d06ffc31ab846de0d258c1a423f tables/dev-r2-e2e.csv
c4a27604be02f2bbea1324df0a305dfc tables/test-r1-e2e.csv
2b3baed6518b6ac95b3b131a8727a804 tables/test-r2-e2e.csv
690d1e16dcc1d6e11dd91ac810a43b86 tables/tuned-r1-e2e.csv
ece585102a39750b9d3ba3991397d3d6 tables/tuned-r2-e2e.csv
274eadba7e41e2a0b408cc1c65279f20 tables/handcheck-sun4.csv
3250ba42025e6ed532893455d191c13e tables/dev-courtesy.csv
efc84f191cd2594cdfced9a638ef2b8a tables/test-run-once.log
c087fe7fcd09a99e2f53c83065aad8b2 tables/tuned-run.log
f91cd857497625622776026ffcd64fb9 tables/dev-rerun.log
c90ffe552faa584bb26fbbb5482b77f5 tables/dev-before.md5
```

`sheets/` holds 37 PNGs:
- `dev-class-{sharp,flat,natural,none}.png`, `dev-windows-signs.png`, `dev-windows-none-sample.png`
- `handcheck-sun4.png`, `dev-courtesy-naturals.png`, `test-signs-not-expected.png`
- `{dev,test,tuned-on-test-songs}-r{1,2}-{rule_repaired,rule_broken,mix_repaired,mix_broken,homr_wrong}.png`, where a set has notes of that kind

The full list of 97 files with md5 is in `/home/claude/signs/deliverables.md5`.

## Wall time and tokens

From 05:53:23 to 06:47:11 EDT: 54 minutes, about 315,000 tokens. No git writes, no subagents.
