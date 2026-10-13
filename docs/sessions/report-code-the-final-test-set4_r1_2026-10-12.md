# Report: the final test on held-out set 4 (QUEUE row 86, r1)

**The deployment ID did not change: `dpl_GRvgpvziVLtFQwtcahVLbNh5tdsp`, commit `9f9e896`, before the rehearsal and after the total.**

Code (Opus 5.5) on Dann's Mac, 2026-10-12. The brief `brief-code-the-final-test-set4_r2_2026-10-12.md` was read whole, with row 76's brief and report, as it requires.

- **Measures only.** No app code, scorer, or working-tree file was changed. The tree holds rows 78a to 85 uncommitted, untouched by this row.
- **No git command that writes.** The only git commands run were `git ls-remote` and `git show` (both read only).
- **What this row wrote:** the harness folder, this report, and row 86's State line in `docs/memory/QUEUE.md`.

## The answer first

**The ten songs of set 4 score 97.5 PASS in total** (97.8 with the 10 UNSURE notes set aside).

- **Nine of ten pass.** One is below 95.0: **4F, 89.2 BELOW** (91.7 with its 6 UNSURE notes set aside).
- **No refusal and no load fault.** Every song was read on WebGPU and carries the reader stamp.
- **By the brief's stop rule,** 4F was not diagnosed, and `keep` was not opened.

## The commit and the stamp, and how they were checked (steps 1 and 5a)

| Check | Before the rehearsal | After the total |
|---|---|---|
| Vercel `get_deployment` of the alias | `dpl_GRvgpvziVLtFQwtcahVLbNh5tdsp` | `dpl_GRvgpvziVLtFQwtcahVLbNh5tdsp` |
| `githubCommitSha`, branch | `9f9e8966e3e3dd6d1dedfa2ab704ad31360616e5`, `Shane` | the same |
| State, `aliasError` | READY, null | READY, null |

- **The alias** `ilya-git-shane-dannmittons-projects.vercel.app` is listed on that deployment. `curl -I` returned HTTP/2 200 with no sign-in.
- **The remote:** `git ls-remote origin refs/heads/Shane` gave `9f9e8966…`, the tip.
- **The reader at that commit:** `git show 9f9e896:apps/web/package.json`, line 24, depends on `homr-web-0.2.0-ilya.7.tgz`.
- **The stamp:** every reading, the rehearsal's two and the ten, carries `homr-web@0.2.0-ilya.7/465`.

## The adapter and the versions

- **The adapter is row 76's,** with its `drop.mjs` copied unchanged: headless Google Chrome through Playwright (`channel: 'chrome'`, `--enable-unsafe-webgpu`), a fresh browser context per song, and the file into `input[type="file"].hidden-input` on the deployed alias.
- **From reading to score:** the reading from the `ilya-library` IndexedDB `sources` store, then `conv.py`, then `final-line.ts song`, then `final-line.ts total`. No dev server was started.
- **Versions:** Google Chrome 154.0.8037.98; Playwright 1.58.2; node v24.13.0; `tsx` v4.23.15.
- **The harness** is in `docs/sessions/measure-final-test-set4_2026-10-12/`: `drop.mjs`, `rehearse.py`, `ten.py`, `rehearsal-lines.txt`, and `ten-lines.txt`.
- **What stayed private.** Every scan copy, reading, `conv.py` output, `keep`, and all stderr went under `~/Downloads/_desk-heldout4-private/run/`. The terminal and the harness print only labels and score lines. The drivers' own stderr log is empty.
- **The changes from row 76's scripts:**
  - outputs moved to the private folder;
  - the load-fault second drop (step 4);
  - the rehearsal's stamp check, and its comparison with row 76's lines.

## Rehearsal: K and M beside row 76's (step 2)

This run:

```
K: read on webgpu, 1.24 min
K: stamp homr-web@0.2.0-ilya.7/465 (as required)
original: K: webgpu; 133 of 134 right; missing 0; extra 0; pitch misreads 0; length misreads 1; bars read 51 of 53; octave shift 0; metre as printed 33 of 33 bars (20 bars with no matched note or rest not judged); score 99.3 PASS; with 1 note marked UNSURE set aside 100.0 PASS
corrected: K: webgpu; 134 of 134 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 51 of 53; octave shift 0; metre as printed 33 of 33 bars (20 bars with no matched note or rest not judged); score 100.0 PASS; with 1 note marked UNSURE set aside 100.0 PASS
M: read on webgpu, 0.87 min
M: stamp homr-web@0.2.0-ilya.7/465 (as required)
original: M: webgpu; 62 of 62 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 26 of 26; octave shift 0; metre as printed 19 of 19 bars (7 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
corrected: M: webgpu; 62 of 62 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 26 of 26; octave shift 0; metre as printed 19 of 19 bars (7 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
rehearsal lines equal row 76: yes
```

Row 76's (`measure-final-test-set3_2026-10-11/rehearsal-lines.txt`):

```
K: read on webgpu, 1.18 min
original: K: webgpu; 133 of 134 right; missing 0; extra 0; pitch misreads 0; length misreads 1; bars read 51 of 53; octave shift 0; metre as printed 33 of 33 bars (20 bars with no matched note or rest not judged); score 99.3 PASS; with 1 note marked UNSURE set aside 100.0 PASS
corrected: K: webgpu; 134 of 134 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 51 of 53; octave shift 0; metre as printed 33 of 33 bars (20 bars with no matched note or rest not judged); score 100.0 PASS; with 1 note marked UNSURE set aside 100.0 PASS
M: read on webgpu, 0.76 min
original: M: webgpu; 62 of 62 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 26 of 26; octave shift 0; metre as printed 19 of 19 bars (7 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
corrected: M: webgpu; 62 of 62 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 26 of 26; octave shift 0; metre as printed 19 of 19 bars (7 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
```

The four score lines are equal, byte for byte, and both stamps are as required. Only the drop times differ. So the ten were dropped.

## The ten and the total, unedited (labels 4A to 4J in glob order)

```
4A: read on webgpu, 1.54 min
4A: stamp homr-web@0.2.0-ilya.7/465
4A: webgpu; 142 of 148 right; missing 0; extra 0; pitch misreads 3; length misreads 3; bars read 57 of 54; octave shift 0; metre as printed 32 of 37 bars (17 bars with no matched note or rest not judged); score 95.9 PASS; no note marked UNSURE
4B: read on webgpu, 1.10 min
4B: stamp homr-web@0.2.0-ilya.7/465
4B: webgpu; 165 of 165 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 44 of 44; octave shift 0; metre as printed 44 of 44 bars (0 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
4C: read on webgpu, 0.83 min
4C: stamp homr-web@0.2.0-ilya.7/465
4C: webgpu; 105 of 105 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 39 of 39; octave shift 0; metre as printed 32 of 32 bars (7 bars with no matched note or rest not judged); score 100.0 PASS; with 1 note marked UNSURE set aside 100.0 PASS
4D: read on webgpu, 0.72 min
4D: stamp homr-web@0.2.0-ilya.7/465
4D: webgpu; 69 of 70 right; missing 0; extra 2; pitch misreads 0; length misreads 1; bars read 32 of 49; octave shift 0; metre as printed 0 of 24 bars (25 bars with no matched note or rest not judged); score 95.7 PASS; no note marked UNSURE
4E: read on webgpu, 0.92 min
4E: stamp homr-web@0.2.0-ilya.7/465
4E: webgpu; 159 of 161 right; missing 0; extra 0; pitch misreads 0; length misreads 2; bars read 45 of 42; octave shift 0; metre as printed 17 of 35 bars (7 bars with no matched note or rest not judged); score 98.8 PASS; with 2 notes marked UNSURE set aside 99.4 PASS
4F: read on webgpu, 1.24 min
4F: stamp homr-web@0.2.0-ilya.7/465
4F: webgpu; 91 of 102 right; missing 0; extra 0; pitch misreads 7; length misreads 4; bars read 40 of 40; octave shift 0; metre as printed 38 of 38 bars (2 bars with no matched note or rest not judged); score 89.2 BELOW; with 6 notes marked UNSURE set aside 91.7 BELOW
4G: read on webgpu, 0.94 min
4G: stamp homr-web@0.2.0-ilya.7/465
4G: webgpu; 100 of 104 right; missing 0; extra 0; pitch misreads 2; length misreads 2; bars read 28 of 33; octave shift 0; metre as printed 26 of 26 bars (7 bars with no matched note or rest not judged); score 96.2 PASS; with 1 note marked UNSURE set aside 96.1 PASS
4H: read on webgpu, 1.28 min
4H: stamp homr-web@0.2.0-ilya.7/465
4H: webgpu; 184 of 189 right; missing 0; extra 0; pitch misreads 1; length misreads 4; bars read 96 of 104; octave shift 0; metre as printed 69 of 69 bars (35 bars with no matched note or rest not judged); score 97.4 PASS; no note marked UNSURE
4I: read on webgpu, 1.77 min
4I: stamp homr-web@0.2.0-ilya.7/465
4I: webgpu; 270 of 275 right; missing 0; extra 0; pitch misreads 5; length misreads 0; bars read 66 of 66; octave shift 0; metre as printed 47 of 47 bars (19 bars with no matched note or rest not judged); score 98.2 PASS; no note marked UNSURE
4J: read on webgpu, 1.11 min
4J: stamp homr-web@0.2.0-ilya.7/465
4J: webgpu; 137 of 137 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 57 of 57; octave shift 0; metre as printed 23 of 42 bars (15 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
Total of 10 songs: webgpu; 1422 of 1456 right; missing 0; extra 2; pitch misreads 18; length misreads 16; bars read 504 of 528; metre as printed 328 of 394 bars in 10 songs; score 97.5 PASS; with 10 notes marked UNSURE set aside 97.8 PASS; songs below 95.0 with UNSURE set aside: 1 of 10
```

- **The truth total is 1456** and the UNSURE count 10, as the brief's pre-check said.
- **Drop times:** 0.72 to 1.77 minutes. No song needed a second drop.

## Refusals

None. Every song reached homr, was read, and left a stamped reading.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **That the truth files are right.** They are drafts by two Opus helpers, not proofed by Dann. 4F's pitch and length misreads (7 and 4) could be the reader's or the truth's; nothing here says which.
- **Why 4F is below.** It was not diagnosed, by the brief.
- **What some lines' bar counts mean.** Some lines read more bars than the truth holds ("bars read 57 of 54" in 4A, "45 of 42" in 4E). In others the metre is judged as printed in fewer than all bars ("0 of 24" in 4D, "23 of 42" in 4J). These are the scorer's figures, printed as they came. Whether they come from the pickup bars, the third verse on its own staves, or the reader, I did not look; that would mean opening a song.
- **The grace notes.** How the scorer treats the 6 grace notes in the one song that carries them was not checked.
- **That the alias served `9f9e896` at every moment between the two checks.** It did at both checks, with the same deployment ID.
- **Other paths:** WebAssembly, the iMac, a headed window, or any spread. There was one headless WebGPU read per song, on this Mac.

**Names were kept unseen.** No scan, truth, reading, bar, or file name was opened, viewed, listed, or printed. The scripts glob the files and print labels only. One command counted the entries in the private `run` folder, which did not yet exist, and printed only "0".
