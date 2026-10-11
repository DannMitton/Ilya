# Report: the printed metre, round 6, run 4: the unseen songs, once (QUEUE row 57)

Code (Opus), 2026-10-11, about 14:20 to 14:50, on the Mac, branch `Shane`, HEAD `8cc6202`, with run 3's uncommitted change (hash `43be241e5e6dcb5ad38895484fd1e6af458073fd6b23a4a933acfd10fa98b662`). Brief: `brief-code-the-metre-seen-and-summed_r6-runs3-4_2026-10-11.md`, run 4, and r6 sections 2.3 and 2.4. No git command that writes was run.

**The unseen songs were never opened.** A script globbed each folder, lettered the scans in glob order, copied them under their letters into a private folder, dropped them, and scored them into a `keep` folder. I read only the lines below. No scan, truth, reading, bar, or `keep` file was opened, viewed, listed, or printed. Nothing was changed because of what the lines show.

## The answer first: 0 false signatures on the 11 unseen songs

| Set | Stated | Agreeing | False |
|---|---|---|---|
| A, B, C, E, F | 4 | 4 (by length: these truths carry no figures) | **0** |
| G, H, I, J, N, O | 7 | 7 (by figure) | **0** |

- **No refusal.** Every song read on WebGPU in 0.57 to 1.53 minutes.
- **The six sealed songs' counts equal row 55's lines exactly.** Right, missing, extra, pitch and length misreads, bars read, and the "metre as printed" field are all the same. So the metre reader changed no note on them, and the metre-as-printed field was already full on them.
- **The hash after this run:** `43be241e5e6dcb5ad38895484fd1e6af458073fd6b23a4a933acfd10fa98b662`, the same as run 3's. Nothing in `apps/` changed after it.
- **Done when** (r6, as amended):
  - step 0: 0 same-length false (run 1);
  - steps 3 and 4: 0 false;
  - the 17: no song's notes lower after than before, and the metre field 674 of 721, above 666 (run 3).
  - **Every condition is met. I stop before the ship, as the brief says.**

## 1. A, B, C, E, F (r6 section 2.3)

- **The letters:** row 52's. The eight scans of `~/Downloads/_desk-2026-10-07/heldout-scans/` in glob order, less Grechaninov and Varlamov, are A to F. The script checked that D is the opened Gurilyov ("yes"). D was not run again: it is among the 17.
- **The truth:** each scan's truth was found under the same name in `heldout-truth/`.
- **The path:** each song was dropped into the intake on the dev build with this change, in a fresh browser context, headless Chrome on WebGPU. The reading the app kept was taken from its library, then scored with `conv.py` and `final-line.ts` into the private `keep`.
- **The stated line** (`stated.py`):
  - It takes the app's own console lines (`[omr] metre: bar N ... stated`).
  - It pairs each stated bar with the truth bar whose matched events that bar holds most of.
  - It judges by figure where the truth carries figures, else by the truth bar's length.

The lines, unedited:

```
scans 8, unseen six 6, truths 6; D is the opened Gurilyov: yes
A: truth paired by name
A: read on webgpu, 0.57 min
A: stated 0, agreeing 0 (by length); false 0
B: truth paired by name
B: read on webgpu, 0.60 min
B: stated 1, agreeing 1 (by length); false 0
C: truth paired by name
C: read on webgpu, 0.64 min
C: stated 0, agreeing 0 (by length); false 0
E: truth paired by name
E: read on webgpu, 1.36 min
E: stated 2, agreeing 2 (by length); false 0
F: truth paired by name
F: read on webgpu, 0.59 min
F: stated 1, agreeing 1 (by length); false 0
A to F: false signatures 0
```

## 2. G, H, I, J, N, O (r6 section 2.4)

- **The letters:** row 55's. The scans of the sealed folder in glob order are G to P. K, L, M, and P are opened and were not run.
- **The truth:** each scan's truth was found under the same name in the sealed truth folder (`*.truth.json`; the corrected copies were not used).
- **The path:** row 55's procedure (steps 3 and 4) on the dev build: the intake, the library's reading, `conv.py`, and `final-line.ts song`, with the stated line beside each.

The lines, unedited:

```
scans 10, truths 10
G: truth paired by name
G: read on webgpu, 1.02 min
G: webgpu; 110 of 110 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 59 of 63; octave shift 0; metre as printed 46 of 46 bars (17 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
G: stated 1, agreeing 1 (by figure); false 0
H: truth paired by name
H: read on webgpu, 1.23 min
H: webgpu; 136 of 144 right; missing 0; extra 0; pitch misreads 1; length misreads 7; bars read 61 of 61; octave shift 0; metre as printed 45 of 45 bars (16 bars with no matched note or rest not judged); score 94.4 BELOW; with 3 notes marked UNSURE set aside 95.7 PASS
H: stated 1, agreeing 1 (by figure); false 0
I: truth paired by name
I: read on webgpu, 0.89 min
I: webgpu; 123 of 127 right; missing 0; extra 1; pitch misreads 1; length misreads 3; bars read 31 of 28; octave shift 0; metre as printed 24 of 24 bars (4 bars with no matched note or rest not judged); score 96.1 PASS; no note marked UNSURE
I: stated 1, agreeing 1 (by figure); false 0
J: truth paired by name
J: read on webgpu, 1.12 min
J: webgpu; 91 of 91 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 49 of 49; octave shift 0; metre as printed 30 of 30 bars (19 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
J: stated 1, agreeing 1 (by figure); false 0
N: truth paired by name
N: read on webgpu, 1.53 min
N: webgpu; 226 of 235 right; missing 9; extra 2; pitch misreads 0; length misreads 0; bars read 82 of 82; octave shift 0; metre as printed 63 of 63 bars (19 bars with no matched note or rest not judged); score 95.3 PASS; no note marked UNSURE
N: stated 2, agreeing 2 (by figure); false 0
O: truth paired by name
O: read on webgpu, 0.90 min
O: webgpu; 155 of 160 right; missing 0; extra 0; pitch misreads 5; length misreads 0; bars read 37 of 37; octave shift 0; metre as printed 37 of 37 bars (0 bars with no matched note or rest not judged); score 96.9 PASS; no note marked UNSURE
O: stated 1, agreeing 1 (by figure); false 0
```

Row 55's lines for the same six (`report-code-the-final-test_r1_2026-10-08.md`) carry the same counts, song by song.

## 3. The rehearsal, and one change to the script before the unseen songs

Before any unseen song, the whole script ran on Grechaninov, Varlamov, and Kabalevsky no. 4, as row 55's step 2 asks. Their counts equal run 3's "after" lines exactly.

- **The first version of `stated.py` was wrong.** It counted a signature stated on a bar where the voice rests as not agreeing: Varlamov and Kabalevsky no. 4, bar 1, which the join empties, so no event is matched there.
- **The fix (DESK DEFAULT):** such a bar is paired through the next reader bar that has matches, counting back bar for bar.
- **The check:** run over all 17 "after" readings, the fixed script gives 29 stated, 29 agreeing, 0 false, as the hand check of run 3 does. The rehearsal was then repeated with the fixed scorer: 0 false.
- **After that, the script did not change.**

## 4. The desk's ruling 3: the extra bar windows on the unseen songs

**NOT ESTABLISHED as asked.** The 45 extra windows were found by matching the app's windows to round 4's Python windows on the 17 songs. The unseen songs have no Python windows, so a statement cannot be called "from an extra window" without opening them. What can be said: of the 11 statements on the 11 unseen songs, none is false.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **How many of the 11 statements came from system starts and how many from windows after a bar line.** The lines do not say, and the songs were not opened.
- **How many printed signatures the unseen songs carry, and so the reader's recall there.** Only "stated" and "agreeing" are printed.
- **The figure on A to F.** Their truths carry bar lengths only, so a same-length swap (C for 2/2, 3/4 for 6/8) there would agree by length. On G to O the truths carry figures, and all 7 agree by figure.
- **Reads off this Mac, on WebAssembly, or on a phone.**

## Servers

I started one `ilya-web` dev server on 5173 for runs 3 and 4 (nothing was listening before) and stopped it at the end. Nothing listens on 5173 or 4173 now.

## Files

| Path | What |
|---|---|
| `docs/sessions/report-code-the-metre-seen-and-summed_r6-run4_2026-10-11.md` | this report |
| `docs/sessions/measure-metre-r57-r6_2026-10-11/run4/` | `run4.py`, `drop.mjs`, `stated.py`, and the two blocks of lines above (copied after the hash; `docs/` only, outside the hash) |
| `~/Downloads/_code-metre-r6/run4/private-*` (outside the tree) | the lettered scans, drops, and `keep` folders: never opened |
| `docs/memory/QUEUE.md`, row 57 only | status |
