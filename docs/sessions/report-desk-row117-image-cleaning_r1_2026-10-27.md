# Report: QUEUE row 117, cleaning the image before the reader sees it (desk helper, 2026-10-27, r1)

Measure only. Nothing under `/home/claude/ilya/` was written, and every file is under `/home/claude/n135-row117/`. No git write command was run. The one git command was `git branch --show-current`, printed into `versions.txt`. The other helper's folder was not read, written, or listed. No path containing the held-out name was opened. Every number names the file it was printed from. Each control rule was written to `control-rules.txt` with a timestamp before the run it governs.

## The answer in three lines

1. **Baseline, nine photocopies (B01 to B10 without B05):** 860 of 1,249 printed syllables right (68.9 percent), reproduced from the stored readings. The whole 18 reproduce 1,875 of 2,538.
2. **Best variant:** `sauvola+deskew+close` (deskew, Sauvola window 25 with k 0.2, closing 3 by 3) reads 934 of 1,249 (74.8 percent), +74. Sauvola does nothing on these crops because they are two-level (pixels only 0 and 255). The gain is deskew (+31 alone) and 3 by 3 closing (+38 alone). Shifting the crops one pixel vertically, which changes nothing in the print, moves the total by +6 and +19.
3. **Other nine songs (S, T, K, M, U1, U4, U5, U6, P):** the best variant loses 26 (989 of 1,289 against 1,015). Deskew then closing 3 by 3 without Sauvola, an extra run of mine, gains 65 on the photocopies (925) and changes the clean songs by 0 (1,015).

## Setup

- **Environment:** clone `/home/claude/ilya`, branch `measure-n194`. Python 3.13.17, OpenCV 5.0.0, scikit-image 0.26.0, numpy 2.5.3, PIL 12.3.0, node v22.23.4 (`versions.txt`).
- **Model:** `/root/n135work/models/rus_prereform.traineddata`, 7,827,478 bytes, md5 `2ff2af3e33461cd64e7d2015ef21d10d` (`versions.txt`).
- **Reader:** `scripts/read-dfloat-chrome.mjs`, a copy of the original with three changes.
  - `REPO` set to `/home/claude/ilya`.
  - Chromium set to `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.
  - An `OUT` environment variable added for the output folder.
- **Reader unchanged:** the SIMD core, `gzip: false`, and PSM 7. It printed `chromium 153.0.8010.12` (`versions.txt`, `logs/deskew.txt`).
- **Stored baseline readings:** made in Chromium 141 (`harness/ocr2/B06-dfloat.time.json`, printed in `versions.txt`).
- **Harness:** a copy at `harness/` with the 36 float readings and the patched `common2.py` and `norm.ts`. `REPO`, `WORK`, and the `norm.ts` import point at this workspace.
- **Departure from the brief:** `common2.py` called `npx --no-install tsx`. I changed it to `/home/claude/.npm-global/bin/tsx`.
- **Scoring:** `score42.py` is unchanged for step 0. For the variants I use `harness/score117.py`, which copies `score42.py`'s loop for reader dfloat (sound, split) and adds each syllable's stage.
- **Ledger script:** row 115's `ledger115_116.py` is not in the repository (I grepped `docs/` and searched the file system). I wrote the stage counter into `score117.py` and checked it against `docs/sessions/measure-rows115-116_2026-10-19/ledger-F.csv`.
- **Terms:** the stage names are adopted from row 115. "Two-level", "noise floor", and "stage counter" are mine.
- **Crops:** 589 RGBA PNGs in `/root/n135work/crops2/`. The nine photocopy songs hold 208 and the other nine hold 381. Variants are greyscale PNGs of the same pixel size, and `clean.py` asserts the shape.

## Step 0: the baseline reproduced

**Rule, written first (17:04:14Z):** the whole 18 reproduce 1,875 of 2,538, and the photocopies reproduce row 115's per-song figures. The likeliest failure is an environment difference.

**Result:** the rule held (`log-step0-score42-R2-split.txt`, copied to `step0-score42-R2-split.txt`). `diff` against the float folder's `score42-R2-split.txt` and `.json` shows them identical.

| song | right | printed | row 115 |
|---|---|---|---|
| B01 | 106 | 147 | 106/147 |
| B02 | 73 | 86 | 73/86 |
| B03 | 106 | 147 | 106/147 |
| B04 | 114 | 148 | 114/148 |
| B05 | not in the readings | | |
| B06 | 85 | 142 | 85/142 |
| B07 | 94 | 151 | 94/151 |
| B08 | 102 | 141 | 102/141 |
| B09 | 89 | 139 | 89/139 |
| B10 | 91 | 148 | 91/148 |
| nine photocopies | 860 | 1,249 | sum of the rows |
| U1, U4, U5, U6, P | 93, 79, 206, 119, 101 | 97, 112, 258, 152, 177 | same |
| S, T, K, M | 91, 164, 116, 46 | 109, 200, 131, 53 | same |
| whole 18 | **1,875** | **2,538** | 1,875/2,538 |

The other nine songs total 1,015 of 1,289 (`results/baseline-stored-all18.json`, summed by `tables117.py`).

**Stage counter:**
- It reproduces row 115's ledger over the 18 songs: 345 letter recognition, 298 token splitting, 3 unattributed, 17 row cutting (the one hand entry, B10 p1s2r2). Source: `log-step0-score117-baseline-all18-tail.txt`.
- Per syllable it agrees with `ledger-F.csv` on all 2,538. This was a command in this session that printed `syllables compared 2538 differences 0`.
- On the nine photocopies the baseline has letter recognition 202, token splitting 170, and row cutting 17 (`log-step0-score117-baseline-B9.txt`).

**B06 re-read:**
- **Rule (17:04:40Z):** within 2 syllables of 85.
- **Result:** 85 of 142, and the reading JSON is byte-identical to the stored one (`log-step0-reread-B06.txt`, `log-step0-score117-reread-B06.txt`).
- **Wider check:** I then re-read the uncleaned crops of the other nine songs (`log-step0-reread-clean9.txt`). I also compared the Sauvola readings, whose crops are pixel-identical to the originals, with the stored ones for the nine photocopies. All 18 readings are byte-identical to the stored ones.
- **Consequence:** Chromium 153 against 141 changes nothing here, and the stop condition did not arise.

## Control rules and what became of each

The brief's rules come first. Where the brief leaves a word loose, I fixed a number before reading any cleaned crop. The full text, with timestamps, is in `control-rules.txt`.

| rule (written before) | outcome |
|---|---|
| Sauvola helps B06 and B09 by a visible margin (mine: at least +5 each) and hurts nothing badly (mine: no song loses more than 5) | **First half not met:** B06 +0 and B09 +0, because the crops are unchanged (`logs/sauvola-w25.txt`). The second half held trivially. |
| Closing 2 by 2 helps a little (mine: total +1 to +10) | Held: +8 (`logs/close-k2.txt`). |
| Closing 3 by 3 hurts (mine: total under 860) | **Failed:** +38 (`logs/close-k3.txt`). |
| Deskew matters only on crops over about 0.5 degrees (mine: songs with no such crop change by no more than 2) | **Partly failed:** B01, whose largest angle is 0.5, moved +3 (`logs/deskew.txt`, `results/angles.csv`). |
| Likeliest failure: thresholding erases thin strokes on the faintest crops | **Did not arise.** The crops are two-level, so nothing was thresholded away. |
| Mine, added after the first deskew number: the wrong-way rotation reverses the gain | Held: 777, −83 (`logs/deskew-flip.txt`). |
| Mine: rotating only crops over 0.5 degrees reproduces at least 20 of the +31 | **Failed:** +16 (`logs/deskew-gt05.txt`). |
| `sauvola+close` equals `close-k3`; `sauvola+deskew` within ±10 of 891 | Both held: 898 with pixel-identical crops, and 899. |
| Extra: closing 4 by 4 and 5 by 5 fall away from 3 by 3 | Partly held: 891 and 892 are both under 898, but 5 by 5 is 1 over 4 by 4. |
| Extra: deskew then closing without Sauvola within ±15 of 934, and over 989 on the clean nine | Held: 925 and 1,015. |
| Noise floor: a one-pixel shift moves every song by no more than 4 and a total by no more than 12 | **Failed on songs** (B03 +11, B10 −10, B07 +7 in `logs/shift11.txt`). **Failed once on a total** (+19 in `logs/up1.txt`). |
| Step 3: Sauvola alone changes the clean nine by −15 to 0, and closing alone loses | Held: −13 (`logs/sauvola-clean9.txt`) and −3 (`logs/close3-clean9.txt`). |
| Step 3: the best variant, which contains closing, loses on the clean nine | Held: −26. |

## The nine photocopies

Cells are syllables right in sound, split, with the change against the stored baseline in parentheses. Stage columns are counts over the nine songs, and the 17 row-cutting syllables are in every row. Printed: B01 147, B02 86, B03 147, B04 148, B06 142, B07 151, B08 141, B09 139, B10 148, total 1,249. Source: `tables117.md`, built by `scripts/tables117.py` from `results/<variant>.json`. Each of those was printed by `score117.py` into `logs/<variant>.txt`.

| variant | B01 | B02 | B03 | B04 | B06 | B07 | B08 | B09 | B10 | total | delta | letter rec. | token split. | unattrib. |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| baseline (stored) | 106 | 73 | 106 | 114 | 85 | 94 | 102 | 89 | 91 | 860 | | 202 | 170 | 0 |
| sauvola window 25, k 0.2 | 106 (+0) | 73 (+0) | 106 (+0) | 114 (+0) | 85 (+0) | 94 (+0) | 102 (+0) | 89 (+0) | 91 (+0) | 860 | +0 | 202 | 170 | 0 |
| sauvola window 41, k 0.2 | 106 (+0) | 73 (+0) | 106 (+0) | 114 (+0) | 85 (+0) | 94 (+0) | 102 (+0) | 89 (+0) | 91 (+0) | 860 | +0 | 202 | 170 | 0 |
| deskew | 109 (+3) | 72 (-1) | 111 (+5) | 111 (-3) | 100 (+15) | 90 (-4) | 112 (+10) | 96 (+7) | 90 (-1) | 891 | +31 | 182 | 153 | 6 |
| close 2x2 | 105 (-1) | 71 (-2) | 109 (+3) | 115 (+1) | 85 (+0) | 98 (+4) | 103 (+1) | 91 (+2) | 91 (+0) | 868 | +8 | 200 | 162 | 2 |
| close 3x3 | 111 (+5) | 70 (-3) | 109 (+3) | 115 (+1) | 90 (+5) | 107 (+13) | 106 (+4) | 95 (+6) | 95 (+4) | 898 | +38 | 177 | 153 | 4 |
| sauvola+deskew | 106 (+0) | 70 (-3) | 108 (+2) | 116 (+2) | 99 (+14) | 101 (+7) | 110 (+8) | 97 (+8) | 92 (+1) | 899 | +39 | 177 | 150 | 6 |
| sauvola+close (3x3) | 111 (+5) | 70 (-3) | 109 (+3) | 115 (+1) | 90 (+5) | 107 (+13) | 106 (+4) | 95 (+6) | 95 (+4) | 898 | +38 | 177 | 153 | 4 |
| **sauvola+deskew+close (3x3)** | 120 (+14) | 70 (-3) | 111 (+5) | 116 (+2) | 101 (+16) | 103 (+9) | 113 (+11) | 103 (+14) | 97 (+6) | **934** | **+74** | 157 | 133 | 8 |
| extra: close 4x4 | 108 (+2) | 67 (-6) | 114 (+8) | 113 (-1) | 85 (+0) | 108 (+14) | 106 (+4) | 95 (+6) | 95 (+4) | 891 | +31 | 177 | 162 | 2 |
| extra: close 5x5 | 110 (+4) | 69 (-4) | 115 (+9) | 110 (-4) | 84 (-1) | 100 (+6) | 108 (+6) | 99 (+10) | 97 (+6) | 892 | +32 | 164 | 174 | 2 |
| extra: deskew+close 3x3, no Sauvola | 121 (+15) | 68 (-5) | 112 (+6) | 116 (+2) | 103 (+18) | 96 (+2) | 112 (+10) | 99 (+10) | 98 (+7) | 925 | +65 | 152 | 151 | 4 |
| control: deskew the wrong way | 105 (-1) | 71 (-2) | 104 (-2) | 107 (-7) | 60 (-25) | 82 (-12) | 85 (-17) | 80 (-9) | 83 (-8) | 777 | -83 | 195 | 232 | 28 |
| control: deskew only crops over 0.5 degrees | 106 (+0) | 73 (+0) | 106 (+0) | 114 (+0) | 100 (+15) | 86 (-8) | 108 (+6) | 93 (+4) | 90 (-1) | 876 | +16 | 199 | 151 | 6 |
| noise floor: shift 1 px down (equals shift 1 px right and down) | 109 (+3) | 69 (-4) | 117 (+11) | 114 (+0) | 83 (-2) | 101 (+7) | 100 (-2) | 92 (+3) | 81 (-10) | 866 | +6 | 194 | 169 | 3 |
| noise floor: shift 1 px up | 104 (-2) | 70 (-3) | 109 (+3) | 116 (+2) | 87 (+2) | 99 (+5) | 108 (+6) | 99 (+10) | 87 (-4) | 879 | +19 | 194 | 153 | 6 |
| noise floor: shift 2 px right | 106 (+0) | 73 (+0) | 106 (+0) | 114 (+0) | 85 (+0) | 94 (+0) | 102 (+0) | 89 (+0) | 91 (+0) | 860 | +0 | 202 | 170 | 0 |

**Parameters chosen:**
- The Sauvola windows 25 and 41 tie on B06 at 85, so the combinations use the smaller, 25 (DESK DEFAULT).
- The closing kernel in the combinations is 3 by 3, the better of the brief's two by nine-song total (898 against 868).

**What the table shows:**

1. **Sauvola changes nothing on these crops.**
   - **Grey levels:** B01 to B10 and P hold two grey levels only. S, T, K, M, U1, U4, U5, and U6 hold 230 to 256 (`log-binary-check.txt`).
   - **Why it is an identity (my algebra):** skimage's threshold is `m (1 + k (s / r - 1))`. On a 0 and 255 image with k 0.2 it is under 255 everywhere and not under 0, so white stays white and black stays black.
   - **Measured:** 0 differing pixels over the 208 crops, for window 25 and for window 41. The readings equal the stored ones.
   - **Consequence:** the brief's question about thresholding low-contrast photocopies was not put to the reader. What made the crops two-level is NOT ESTABLISHED.
2. **Deskew moves the count by +31, and the direction is right.**
   - **Angles:** 36 of 208 crops are rotated by more than 0.5 degrees, 80 by 0.0, and 1 sits at the sweep edge of 3.0 (a B07 crop). Source: `results/angles.csv`, from the projection-profile sweep in `clean.py`.
   - **B10 page 1:** five of its seven crops sit at 2.0 to 2.4 degrees, which agrees with the brief's note that the page is rotated.
   - **Wrong-way control:** it gives 777 (−83), so the gain comes from levelling and not from resampling alone.
   - **By angle (`log-analysis.txt`, 105 Russian rows):** deskew gains +19 over the 14 rows on crops over 1.0 degree (1.4 a row). It gains +15 over the 89 rows on crops of 0.5 or less (0.17 a row).
   - **Ink loss:** the crop keeps its size, so rotated crops lose ink at the ends of the row. The loss is 13.7 percent of ink mass on the 0.6 to 1.0 group and 11.3 percent over 1.0 (`log-analysis.txt`).
   - **Largest loss of the best variant:** B07 p5s1r1 (11 of 12 read before, 2 after, angle −1.4).
3. **Closing 3 by 3 gains more than 2 by 2, against the desk's expectation:** +38 against +8. The count plateaus at 4 by 4 and 5 by 5 (+31, +32). B02 loses under every closing kernel (−2, −3, −6, −4).
4. **The three parts add up.**
   - Deskew, Sauvola (a re-binarisation after deskew's grey edge pixels), and closing give +74, against +31 and +38 alone.
   - Letter recognition falls from 202 to 157 (−45) and token splitting from 170 to 133 (−37). Unattributed rises from 0 to 8, all on B10. Row cutting by eye stays at 17 (`tables117.md`).
   - Per row, 52 of the 105 Russian rows read more, 15 read fewer, and 38 are unchanged (`log-analysis.txt`).
5. **Read shares.**
   - **Best variant:** the per-song median goes from 72.1 to 75.5 percent. The low goes from B06 at 59.9 to B10 at 65.5.
   - **Deskew then closing without Sauvola:** median 76.2, low B07 at 63.6.
   - **Source:** this session's last summary command over `results/*.json`. It reproduces row 115's baseline figures of 72.1 and B06 59.9.
6. **The noise floor is not small.**
   - **Vertical shifts:** a one-pixel vertical shift moves a song by up to +11 and −10. It moves the nine-song total by +6 (down) and +19 (up). Source: `logs/shift11.txt`, `logs/down1.txt`, `logs/up1.txt`.
   - **Horizontal shift:** a two-pixel horizontal shift moves nothing (`logs/shift20.txt`). The reader is blind to horizontal offsets and sensitive to vertical ones.
   - **Reading the deltas against it:** the single cleanings are about twice the larger total shift, and the combination is about four times. Per song, B01 +14, B06 +16, B08 +11, and B09 +14 exceed the largest per-song shift of +11. B02, which loses in every variant, is inside it.
   - **Limits:** three vertical offsets are a small sample, and I did not repeat any variant on a second set of crops.

## The best cleaning on the other nine songs

**Rule, written first:** a small loss or none with Sauvola alone, and a loss with closing. Printed: S 109, T 200, K 131, M 53, U1 97, U4 112, U5 258, U6 152, P 177, total 1,289. P's crops are two-level like the photocopies'. The other eight songs' crops carry grey. Source: `tables117.md`.

| variant | S | T | K | M | U1 | U4 | U5 | U6 | P | total | delta | letter rec. | token split. | unattrib. |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| baseline (stored) | 91 | 164 | 116 | 46 | 93 | 79 | 206 | 119 | 101 | 1015 | | 143 | 128 | 3 |
| sauvola 25, k 0.2 | 91 (+0) | 161 (-3) | 113 (-3) | 46 (+0) | 92 (-1) | 76 (-3) | 207 (+1) | 115 (-4) | 101 (+0) | 1002 | -13 | 154 | 130 | 3 |
| close 3x3 | 90 (-1) | 166 (+2) | 114 (-2) | 47 (+1) | 93 (+0) | 82 (+3) | 208 (+2) | 117 (-2) | 95 (-6) | 1012 | -3 | 144 | 132 | 1 |
| deskew | 94 (+3) | 166 (+2) | 117 (+1) | 45 (-1) | 93 (+0) | 79 (+0) | 204 (-2) | 120 (+1) | 102 (+1) | 1020 | +5 | 133 | 133 | 3 |
| **best: deskew+sauvola+close (3x3)** | 95 (+4) | 165 (+1) | 105 (-11) | 40 (-6) | 90 (-3) | 79 (+0) | 208 (+2) | 118 (-1) | 89 (-12) | 989 | **-26** | 151 | 146 | 3 |
| extra: deskew+close 3x3, no Sauvola | 89 (-2) | 169 (+5) | 115 (-1) | 48 (+2) | 93 (+0) | 80 (+1) | 206 (+0) | 118 (-1) | 97 (-4) | 1015 | +0 | 133 | 136 | 5 |
| noise floor: shift 1 px down | 96 (+5) | 164 (+0) | 118 (+2) | 48 (+2) | 93 (+0) | 77 (-2) | 210 (+4) | 118 (-1) | 94 (-7) | 1018 | +3 | 134 | 134 | 3 |
| noise floor: shift 1 px up | 92 (+1) | 162 (-2) | 115 (-1) | 48 (+2) | 92 (-1) | 81 (+2) | 209 (+3) | 120 (+1) | 96 (-5) | 1015 | +0 | 131 | 140 | 3 |

The shift 2 px right row is identical to baseline on every song. The shift 1 px right and down row is identical to shift 1 px down. Both are in `tables117.md`.

**Reading:**
- **Best variant hurts the clean songs:** 76.7 against 78.7 percent (−26, 2.6 percent of 1,289). It loses on K (−11), M (−6), P (−12), and U1 (−3). The noise floor on the total here is +3 and 0, with P down to −7.
- **Sauvola is the cost.**
  - Sauvola alone is −13, on T, K, U1, U4, and U6.
  - The best variant and "deskew then closing without Sauvola" differ only by the Sauvola step, and they read −26 and 0. Sauvola costs 26 in that combination.
  - Why it costs more in combination than alone is not tested.
- **Closing 3 by 3 alone:** −3, inside the noise.
- **Deskew alone:** +5.
- **Variant without Sauvola:** it changes the clean nine by 0 in total, with songs from −4 (P) to +5 (T), and gains 65 on the photocopies. On this measure it needs no switch between photocopy and clean scan. The brief's best variant does need one.
- **P:** the one two-level song outside the photocopy set loses under the best variant (−12) while the photocopies gain. Two-level input is therefore not a safe detector for it. P is one song.

## What the measure cannot tell

- **Whether Sauvola helps greyscale photocopies.**
  - The B and P crops are already two-level (`log-binary-check.txt`), so the question put to Sauvola was never put to the reader.
  - What made them two-level, a one-bit scan in the PDF or a threshold in the rasteriser, is NOT ESTABLISHED.
  - The source page images are not in this workspace. I did not look beyond `crops2/` and the repository's reader code.
  - I read only the header line of the rasteriser, which says it returns "greyscale ink" (`apps/web/src/lib/reader/page-pdf.ts:2`). I did not trace it.
- **The reader's training.**
  - The brief states the model was trained on clean renders. I did not check it.
  - If it holds, a cleaning that moves a photocopy crop toward a clean render may help for a reason other than letter skill. This measure does not separate the two.
- **Vertical sensitivity.** A one-pixel vertical offset moves the nine-song total by +6 and +19 and single songs by 10 or 11. Deskew and closing both shift ink vertically. The +74 stands over that noise. The single parts, and song-level deltas under about 10, do not stand over it with confidence.
- **Rotation inside a fixed frame.** The brief fixes the crop size, so rotated crops lose 11 to 14 percent of their ink mass at the ends of the row. The measure shows the gain despite that loss. It does not show what a padded canvas would give.
- **Generalisation.** Nine songs, 105 Russian rows scored, one reader, one model, and one scorer (sound, split). Seating under the right note was not run (`score44.py` was not run on any variant).
- **Stage counts.** They are mine. They reproduce row 115's ledger on the baseline and carry its limit: whether a syllable counted under letter recognition is a recognition fault or a shifted alignment, `align_syl` cannot show.

## What I could not establish

- Why the B and P crops are two-level, and so the effect of Sauvola on a greyscale scan of the photocopies (NOT ESTABLISHED).
- Chrome 155 on the Mac and Safari on the iPhone (NOT ESTABLISHED). The reader ran in headless Chromium 153.0.8010.12.
- B05: it is not in the readings and was not measured.
- Whether a larger closing kernel, a rotation on a padded canvas, or deskew by shear would beat 934. Not run.
- Row 117's use for row 105. The measure shows deskew and 3 by 3 closing each move the count and the combination moves it most. Whether that fixes the lever row 105 trains at is the desk's call.

## Scripts and files

All paths are under `/home/claude/n135-row117/`.

- `scripts/clean.py`
  - Writes cleaned crops, same names and size, from `/root/n135work/crops2/`.
  - Steps: `deskew`, `sauvola:<window>:<k>`, `close:<k>`.
  - Controls: `deskewflip`, `deskewgt05`, `shift11`, `shift20`, `down1`, `up1`.
  - Caches angles in `results/angles.json`. `--angles-csv` writes `results/angles.csv`.
  - The 2 by 2 closing uses anchors (0,0) and (1,1), because OpenCV's default anchor gave a closing that lost ink pixels of the input (tested).
- `scripts/read-dfloat-chrome.mjs`: the patched reader (paths and `OUT`). It writes `ocr2-<variant>/<L>-dfloat.json`.
- `scripts/variant.sh`: runs clean, read, and score for one variant. It writes `crops-<variant>/`, `ocr2-<variant>/`, `results/<variant>.json`, and `logs/<variant>.txt`.
- `harness/score117.py`: scores a folder of readings with `score42.py`'s loop and the row 115 stages. `harness/common2.py` and `harness/norm.ts` are the patched copies.
- `scripts/tables117.py`: builds `tables117.md` from `results/`.
- `scripts/analysis117.py`: the rows-by-angle table, the ink lost by rotation, and the largest row changes. Its output is `log-analysis.txt`.
- Records:
  - `control-rules.txt`
  - `versions.txt`
  - `log-binary-check.txt`
  - `log-step0-*.txt`
  - `step0-score42-R2-split.txt`
  - `logs/*.txt`
  - `log-analysis.txt`
  - `tables117.md`
  - `results/angles.csv`
- `crops-*/` and `ocr2-*/` hold the cleaned crops and readings of every variant (91 MB in all). `ocr2-orig/` holds the uncleaned re-reads of B06 and of the other nine songs.

## Step 5, the row's frame

Added on the coordinator's second message. The noise-floor finding (a one-pixel vertical shift moves the nine-song total by +6 and +19, a two-pixel horizontal shift by 0) says the reader is sensitive to how a row sits in its frame. This step measures the frame on the nine photocopies and on the other nine songs, with the stored reader path and no other cleaning (path A), and then with deskew then closing 3 by 3 without Sauvola applied first (path B). Same reader, same scorer (`score117.py`, sound, split), same baseline (860 of 1,249; 1,015 of 1,289). Seating (`score44.py`) was not run: padding and scaling move the word boxes out of the harness's page frame, and `score117.py` uses only the left-to-right order of the boxes.

### Definitions and the control rule, written first

The rule was written to `control-rules.txt` at the time stamped there, before any framed crop was read. Source of the print size: `results/inkheights.txt`.

- **Ink height (my definition):** ink is grey under 128. The ink height of a crop is the 98th minus the 2nd percentile of the ink pixels' row coordinates, plus 1 (the first row where the cumulative ink count reaches 2 and 98 percent).
- **PAD 8, 16, 24:** 8 px of white above and below; 16 px on all four sides; 24 px above and below. The crop is otherwise unchanged.
- **HEIGHT H (24, 32, 40, 48):** the crop scaled bicubic with aspect kept so that its ink height is H, then 16 px of white above and below.
- **CENTRE:** the crop shifted vertically (white fill, no scaling, the frame keeps its height) so that the ink centroid, the mean ink row, sits at the frame's centre; then 16 px of white above and below.
- **Expectations, with my numbers for the loose words:**
  1. PAD 16 gains a few syllables on both sets (mine: +1 to +10 on each nine-song total, path A).
  2. The HEIGHT totals peak at 40 or 48 px, within one step of the present median of 48, and the 24 px total is under the stored baseline.
  3. CENTRE gains on the photocopies only (mine: photocopies +1 or more, clean nine +2 or less, path A).
  4. Likeliest failure: scaling blurs broken strokes on the photocopies and loses more than the framing gains (mine: a HEIGHT total on the photocopies lower than the baseline by more than PAD 16 gains).
- **Noise to read it against:** the photocopy total moved by +6 and +19 under a one-pixel vertical shift, the clean nine by +3 and 0.

### The print size today

Ink height in px of the original crops, all crops of a song (`results/inkheights.txt`). The median is 48 on the nine photocopies' crops (range 23 to 418) and 48 on the other nine songs' (range 18 to 275). The large maxima are crops that carry more than the Russian line (piano reach or a merged row), so a HEIGHT variant scales those crops by a small factor.

| song | crops | median | min | max |
|---|---|---|---|---|
| B01 | 18 | 43 | 32 | 51 |
| B02 | 10 | 41 | 36 | 53 |
| B03 | 34 | 44 | 23 | 263 |
| B04 | 24 | 44 | 33 | 89 |
| B06 | 18 | 50 | 31 | 151 |
| B07 | 35 | 51 | 30 | 394 |
| B08 | 15 | 50 | 37 | 108 |
| B09 | 35 | 50 | 27 | 287 |
| B10 | 19 | 47 | 39 | 418 |
| S | 82 | 42 | 18 | 141 |
| T | 40 | 43 | 30 | 263 |
| K | 23 | 45 | 24 | 174 |
| M | 16 | 40 | 26 | 105 |
| U1 | 18 | 50 | 27 | 72 |
| U4 | 23 | 54 | 34 | 275 |
| U5 | 84 | 52 | 28 | 196 |
| U6 | 75 | 55 | 29 | 156 |
| P | 20 | 38 | 22 | 65 |
| B9 all crops | 208 | 48 | 23 | 418 |
| C9 all crops | 381 | 48 | 18 | 275 |

### The measurements

Every row is printed by `score117.py` into `logs/f-<variant>-<path>-<set>.txt` (`<set>` is b9 for the photocopies, c9 for the other nine), tabulated by `scripts/tables5.py` into `tables5.md`. Delta is against the stored baseline in each cell. The reference rows are the unframed deskew then closing 3 by 3 of step 3 (`results/deskew+close3.json`, `results/deskew+close3-clean9.json`).

NINE PHOTOCOPIES: syllables right (sound, split), change against the stored baseline (860 of 1249) in parentheses; stage counts over the nine songs.
| variant | B01 | B02 | B03 | B04 | B06 | B07 | B08 | B09 | B10 | total | delta | letter rec. | token split. | unattrib. |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| baseline (stored) | 106 | 73 | 106 | 114 | 85 | 94 | 102 | 89 | 91 | 860 | | 202 | 170 | 0 |
| PAD 8 (8 px above and below), stored crops | 129 (+23) | 80 (+7) | 125 (+19) | 117 (+3) | 85 (+0) | 114 (+20) | 112 (+10) | 102 (+13) | 101 (+10) | 965 | +105 | 123 | 140 | 4 |
| PAD 16 (16 px on all four sides), stored crops | 131 (+25) | 80 (+7) | 123 (+17) | 117 (+3) | 86 (+1) | 109 (+15) | 116 (+14) | 103 (+14) | 97 (+6) | 962 | +102 | 119 | 143 | 8 |
| PAD 24 (24 px above and below), stored crops | 130 (+24) | 80 (+7) | 123 (+17) | 117 (+3) | 86 (+1) | 109 (+15) | 115 (+13) | 104 (+15) | 97 (+6) | 961 | +101 | 120 | 145 | 6 |
| HEIGHT 24 then pad 16, stored crops | 133 (+27) | 81 (+8) | 128 (+22) | 116 (+2) | 75 (-10) | 120 (+26) | 109 (+7) | 100 (+11) | 92 (+1) | 954 | +94 | 116 | 95 | 67 |
| HEIGHT 32 then pad 16, stored crops | 132 (+26) | 82 (+9) | 129 (+23) | 120 (+6) | 92 (+7) | 114 (+20) | 116 (+14) | 108 (+19) | 93 (+2) | 986 | +126 | 111 | 133 | 2 |
| HEIGHT 40 then pad 16, stored crops | 132 (+26) | 77 (+4) | 129 (+23) | 121 (+7) | 91 (+6) | 120 (+26) | 117 (+15) | 105 (+16) | 99 (+8) | 991 | +131 | 118 | 117 | 6 |
| HEIGHT 48 then pad 16, stored crops | 131 (+25) | 79 (+6) | 125 (+19) | 116 (+2) | 88 (+3) | 119 (+25) | 118 (+16) | 106 (+17) | 99 (+8) | 981 | +121 | 127 | 117 | 7 |
| CENTRE then pad 16, stored crops | 128 (+22) | 80 (+7) | 124 (+18) | 117 (+3) | 95 (+10) | 114 (+20) | 115 (+13) | 99 (+10) | 100 (+9) | 972 | +112 | 116 | 138 | 6 |
| reference: deskew then close 3x3 first, unframed | 121 (+15) | 68 (-5) | 112 (+6) | 116 (+2) | 103 (+18) | 96 (+2) | 112 (+10) | 99 (+10) | 98 (+7) | 925 | +65 | 152 | 151 | 4 |
| PAD 8 (8 px above and below), deskew then close 3x3 first | 132 (+26) | 78 (+5) | 129 (+23) | 113 (-1) | 103 (+18) | 112 (+18) | 120 (+18) | 115 (+26) | 98 (+7) | 1000 | +140 | 107 | 119 | 6 |
| PAD 16 (16 px on all four sides), deskew then close 3x3 first | 131 (+25) | 78 (+5) | 129 (+23) | 113 (-1) | 104 (+19) | 110 (+16) | 120 (+18) | 116 (+27) | 100 (+9) | 1001 | +141 | 108 | 121 | 2 |
| PAD 24 (24 px above and below), deskew then close 3x3 first | 131 (+25) | 78 (+5) | 129 (+23) | 113 (-1) | 104 (+19) | 111 (+17) | 121 (+19) | 116 (+27) | 98 (+7) | 1001 | +141 | 107 | 122 | 2 |
| HEIGHT 24 then pad 16, deskew then close 3x3 first | 134 (+28) | 79 (+6) | 127 (+21) | 121 (+7) | 92 (+7) | 119 (+25) | 120 (+18) | 118 (+29) | 93 (+2) | 1003 | +143 | 102 | 97 | 30 |
| HEIGHT 32 then pad 16, deskew then close 3x3 first | 133 (+27) | 81 (+8) | 129 (+23) | 122 (+8) | 105 (+20) | 113 (+19) | 124 (+22) | 120 (+31) | 99 (+8) | 1026 | +166 | 103 | 93 | 10 |
| HEIGHT 40 then pad 16, deskew then close 3x3 first | 131 (+25) | 78 (+5) | 129 (+23) | 118 (+4) | 99 (+14) | 112 (+18) | 123 (+21) | 115 (+26) | 103 (+12) | 1008 | +148 | 108 | 110 | 6 |
| HEIGHT 48 then pad 16, deskew then close 3x3 first | 134 (+28) | 79 (+6) | 126 (+20) | 116 (+2) | 104 (+19) | 109 (+15) | 124 (+22) | 119 (+30) | 100 (+9) | 1011 | +151 | 103 | 110 | 8 |
| CENTRE then pad 16, deskew then close 3x3 first | 131 (+25) | 80 (+7) | 128 (+22) | 117 (+3) | 105 (+20) | 107 (+13) | 120 (+18) | 111 (+22) | 103 (+12) | 1002 | +142 | 106 | 124 | 0 |

NINE OTHER SONGS: syllables right (sound, split), change against the stored baseline (1015 of 1289) in parentheses; stage counts over the nine songs.
| variant | S | T | K | M | U1 | U4 | U5 | U6 | P | total | delta | letter rec. | token split. | unattrib. |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| baseline (stored) | 91 | 164 | 116 | 46 | 93 | 79 | 206 | 119 | 101 | 1015 | | 143 | 128 | 3 |
| PAD 8 (8 px above and below), stored crops | 102 (+11) | 181 (+17) | 119 (+3) | 0 (-46) | 93 (+0) | 85 (+6) | 213 (+7) | 128 (+9) | 105 (+4) | 1026 | +11 | 87 | 152 | 24 |
| PAD 16 (16 px on all four sides), stored crops | 101 (+10) | 182 (+18) | 120 (+4) | 28 (-18) | 93 (+0) | 85 (+6) | 213 (+7) | 130 (+11) | 105 (+4) | 1057 | +42 | 99 | 130 | 3 |
| PAD 24 (24 px above and below), stored crops | 102 (+11) | 182 (+18) | 120 (+4) | 0 (-46) | 93 (+0) | 85 (+6) | 215 (+9) | 127 (+8) | 102 (+1) | 1026 | +11 | 83 | 124 | 56 |
| HEIGHT 24 then pad 16, stored crops | 102 (+11) | 177 (+13) | 111 (-5) | 10 (-36) | 94 (+1) | 68 (-11) | 207 (+1) | 126 (+7) | 103 (+2) | 998 | -17 | 90 | 167 | 34 |
| HEIGHT 32 then pad 16, stored crops | 103 (+12) | 180 (+16) | 122 (+6) | 0 (-46) | 93 (+0) | 74 (-5) | 211 (+5) | 125 (+6) | 97 (-4) | 1005 | -10 | 84 | 154 | 46 |
| HEIGHT 40 then pad 16, stored crops | 102 (+11) | 181 (+17) | 119 (+3) | 0 (-46) | 93 (+0) | 73 (-6) | 216 (+10) | 128 (+9) | 96 (-5) | 1008 | -7 | 93 | 132 | 56 |
| HEIGHT 48 then pad 16, stored crops | 99 (+8) | 179 (+15) | 119 (+3) | 0 (-46) | 92 (-1) | 76 (-3) | 212 (+6) | 125 (+6) | 95 (-6) | 997 | -18 | 91 | 145 | 56 |
| CENTRE then pad 16, stored crops | 102 (+11) | 178 (+14) | 120 (+4) | 0 (-46) | 93 (+0) | 82 (+3) | 224 (+18) | 125 (+6) | 101 (+0) | 1025 | +10 | 85 | 123 | 56 |
| reference: deskew then close 3x3 first, unframed | 89 (-2) | 169 (+5) | 115 (-1) | 48 (+2) | 93 (+0) | 80 (+1) | 206 (+0) | 118 (-1) | 97 (-4) | 1015 | +0 | 133 | 136 | 5 |
| PAD 8 (8 px above and below), deskew then close 3x3 first | 101 (+10) | 175 (+11) | 116 (+0) | 0 (-46) | 94 (+1) | 80 (+1) | 214 (+8) | 129 (+10) | 101 (+0) | 1010 | -5 | 100 | 174 | 5 |
| PAD 16 (16 px on all four sides), deskew then close 3x3 first | 101 (+10) | 175 (+11) | 117 (+1) | 29 (-17) | 94 (+1) | 80 (+1) | 215 (+9) | 130 (+11) | 102 (+1) | 1043 | +28 | 115 | 126 | 5 |
| PAD 24 (24 px above and below), deskew then close 3x3 first | 100 (+9) | 175 (+11) | 116 (+0) | 7 (-39) | 94 (+1) | 80 (+1) | 215 (+9) | 127 (+8) | 102 (+1) | 1016 | +1 | 97 | 127 | 49 |
| HEIGHT 24 then pad 16, deskew then close 3x3 first | 101 (+10) | 173 (+9) | 111 (-5) | 20 (-26) | 93 (+0) | 70 (-9) | 209 (+3) | 124 (+5) | 98 (-3) | 999 | -16 | 103 | 173 | 14 |
| HEIGHT 32 then pad 16, deskew then close 3x3 first | 101 (+10) | 176 (+12) | 119 (+3) | 5 (-41) | 92 (-1) | 74 (-5) | 214 (+8) | 125 (+6) | 109 (+8) | 1015 | +0 | 85 | 143 | 46 |
| HEIGHT 40 then pad 16, deskew then close 3x3 first | 102 (+11) | 179 (+15) | 118 (+2) | 8 (-38) | 94 (+1) | 76 (-3) | 221 (+15) | 130 (+11) | 102 (+1) | 1030 | +15 | 87 | 126 | 46 |
| HEIGHT 48 then pad 16, deskew then close 3x3 first | 101 (+10) | 178 (+14) | 113 (-3) | 0 (-46) | 95 (+2) | 75 (-4) | 212 (+6) | 125 (+6) | 99 (-2) | 998 | -17 | 96 | 143 | 52 |
| CENTRE then pad 16, deskew then close 3x3 first | 99 (+8) | 181 (+17) | 115 (-1) | 0 (-46) | 94 (+1) | 83 (+4) | 219 (+13) | 126 (+7) | 100 (-1) | 1017 | +2 | 91 | 123 | 58 |

BEST TOTALS in step 5: photocopies (1026, ('h32', 'B', 'b9')); clean nine (1057, ('pad16', 'A', 'c9')); best photocopy total among framings with no loss on the clean nine (clean total >= 1015): (1026, ('h32', 'B')). Unframed references: deskew+close3 925 and 1015.
f-centre-A-b9: ink pixels (grey<128) original 5221070 variant 5151769 (-1.3 percent); share of pixels neither 0 nor 255: 0.00 percent
f-h32-A-b9: ink pixels (grey<128) original 5221070 variant 1391586 (-73.3 percent); share of pixels neither 0 nor 255: 1.35 percent
f-h24-A-b9: ink pixels (grey<128) original 5221070 variant 781223 (-85.0 percent); share of pixels neither 0 nor 255: 1.19 percent
f-h48-A-b9: ink pixels (grey<128) original 5221070 variant 3137454 (-39.9 percent); share of pixels neither 0 nor 255: 1.49 percent
f-centre-A-c9: ink pixels (grey<128) original 6590508 variant 6498595 (-1.4 percent); share of pixels neither 0 nor 255: 9.15 percent
f-h32-A-c9: ink pixels (grey<128) original 6590508 variant 2478748 (-62.4 percent); share of pixels neither 0 nor 255: 10.67 percent
f-h24-A-c9: ink pixels (grey<128) original 6590508 variant 1394868 (-78.8 percent); share of pixels neither 0 nor 255: 9.32 percent
f-h48-A-c9: ink pixels (grey<128) original 6590508 variant 5576218 (-15.4 percent); share of pixels neither 0 nor 255: 12.43 percent
EXTRA (mine): PAD 16 on all four sides with each crop's own commonest grey, the nine other songs (the photocopies' commonest grey is 255 in every crop, so their PAD 16 rows are unchanged).
| variant | S | T | K | M | U1 | U4 | U5 | U6 | P | total | delta | letter rec. | token split. | unattrib. |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PAD 16 paper tone, stored crops | 101 (+10) | 182 (+18) | 120 (+4) | 51 (+5) | 93 (+0) | 85 (+6) | 213 (+7) | 130 (+11) | 105 (+4) | 1080 | +65 | 87 | 119 | 3 |
| PAD 16 paper tone, deskew then close 3x3 first | 101 (+10) | 175 (+11) | 117 (+1) | 51 (+5) | 94 (+1) | 80 (+1) | 215 (+9) | 130 (+11) | 102 (+1) | 1065 | +50 | 98 | 121 | 5 |


Clean nine without M (the eight songs whose paper is white), white padding as specified, from `results/step5-exM.txt` (printed from `results/f-*-c9.json`). Stored baseline for the eight: 969 of 1,236.

| variant | path A eight-song total | path A, M | path B eight-song total | path B, M |
|---|---|---|---|---|
| PAD 8 | 1026 (+57) | 0 | 1010 (+41) | 0 |
| PAD 16 | 1029 (+60) | 28 | 1014 (+45) | 29 |
| PAD 24 | 1026 (+57) | 0 | 1009 (+40) | 7 |
| HEIGHT 24 | 988 (+19) | 10 | 979 (+10) | 20 |
| HEIGHT 32 | 1005 (+36) | 0 | 1010 (+41) | 5 |
| HEIGHT 40 | 1008 (+39) | 0 | 1022 (+53) | 8 |
| HEIGHT 48 | 997 (+28) | 0 | 998 (+29) | 0 |
| CENTRE | 1025 (+56) | 0 | 1017 (+48) | 0 |

M stored: 46 of 53.

### What the step shows

1. **The frame matters far more than the cleanings.** PAD 8, 16, and 24 give +105, +102, and +101 on the photocopies with no other change (path A), against +74 for the best cleaning of step 2 and +6 and +19 for the noise floor. The three pad sizes are within 4 of each other, so the first 8 px carry the effect. Measured cause of a candidate: ink (grey under 128) sits on the top row of 207 of the 208 photocopy crops and on the bottom row of 207; on the other nine, 362 and 363 of 381 (`results/edge-ink.txt`). The crops are cut through ink at the frame's edge. That padding helps because the reader no longer meets ink at the edge is my inference; no run isolates it.
2. **Song M is a padding artefact on white.** M's crops are grey paper (commonest grey 172 to 182 in every crop; every other song's is 252 to 255, measured this session), so a white frame is a hard edge on M alone. M reads 0 of 53 at PAD 8 and PAD 24 and 28 at PAD 16, with 21 of its syllables unattributed at PAD 8 and all 53 at PAD 24 (`logs/f-pad8-A-c9.txt`, `logs/f-pad24-A-c9.txt`). That dominates every clean-nine total in the white-padded rows. My extra run pads with each crop's own commonest grey: M reads 51 (stored 46) and the clean nine reach 1,080 (+65) on path A and 1,065 (+50) on path B (`logs/f-padpaper16-A-c9.txt`, `logs/f-padpaper16-B-c9.txt`; the control rule for it is in `control-rules.txt`). For the photocopies and P the commonest grey is 255 in every crop, so paper-tone padding equals white padding there. The HEIGHT and CENTRE variants were not re-run with paper-tone padding, so their clean-nine totals carry M's loss.
3. **Expectation 1 (PAD 16 gains a few syllables on both sets): direction right, size wrong.** +102 on the photocopies and +42 on the clean nine (white; +65 with paper tone), against my +1 to +10.
4. **Expectation 2 (HEIGHT peaks at 40 or 48, loses at 24): partly held.** The peak is at 40 on the photocopies (991) and on the clean nine (1,008) on path A, at 32 on the photocopies (1,026) on path B, and at 40 on the clean nine (1,030) on path B. The 24 px total is under the baseline on the clean nine on both paths (998, 999) and well over it on the photocopies (+94, +143). The HEIGHT totals differ by at most 37 on the photocopies on path A (954 to 991), which is larger than the noise floor but smaller than the padding alone gives (962).
5. **Expectation 3 (CENTRE gains on the photocopies only): failed on "only", and adds little.** CENTRE then pad 16 gains +112 and +142 on the photocopies (paths A and B) and +10 and +2 on the clean nine; without M the clean eight gain +56 and +48. Against PAD 16 alone, CENTRE adds +10 (972 against 962) on path A and +1 (1,002 against 1,001) on path B, which the noise floor can produce. Centring loses 1.3 and 1.4 percent of the ink pixels off the frame (`tables5.md`).
6. **The likeliest failure did not arise on the photocopies.** The scaled HEIGHT variants gain +94 to +131 on path A, and the weakest, HEIGHT 24, is 8 under PAD 16. Scaling cuts the ink pixel count by 40 to 85 percent on the photocopies, and 1.2 to 1.5 percent of their pixels become grey (`tables5.md`). On the clean nine the white-padded HEIGHT rows fall under the baseline (−7 to −18) because of M; without M they gain +19 to +39 on path A, under the +60 of PAD 16 alone.
7. **Path B (deskew and closing first) adds on the photocopies and not on the clean nine.** PAD 16 on path B reads 1,001 (+141) against 962 on path A, and HEIGHT 32 on path B reads 1,026 (+166), the best photocopy total of the step. On the clean nine, path B reads below path A in every white-padded PAD row (1,010, 1,043, 1,016 against 1,026, 1,057, 1,026) and in the paper-tone rows (1,065 against 1,080).

### The three best totals

From `tables5.md` (printed by `scripts/tables5.py`) and `results/step5-exM.txt`:

1. **Photocopies:** 1,026 of 1,249, HEIGHT 32 then pad 16 after deskew and closing (path B), +166 against 860 (`logs/f-h32-B-b9.txt`).
2. **Clean nine:** 1,057 of 1,289 with white padding as specified, PAD 16 on the stored crops, +42 (`logs/f-pad16-A-c9.txt`); 1,080, +65, with paper-tone padding (`logs/f-padpaper16-A-c9.txt`).
3. **Best photocopy total among variants that lose nothing on the clean nine:** 1,026 with HEIGHT 32 on path B, clean nine 1,015 (+0; `logs/f-h32-B-c9.txt`). That zero hides M at 5 of 53 (−41) against +41 on the other eight, so it is a white-padding result and not a flat one. With the paper-tone fix the pair I measured is PAD 16 on the stored crops: photocopies 962 (+102), clean nine 1,080 (+65). HEIGHT 32 on path B with paper-tone padding on the clean nine was not run: NOT ESTABLISHED.

### What this step cannot tell

- **Why padding helps.** Ink at the frame's edge in nearly every crop (`results/edge-ink.txt`) is a measured fact; that it causes the gain is an inference.
- **The combination of paper-tone padding with HEIGHT, CENTRE, and path B.** Only PAD 16 was run with paper tone, on the clean nine.
- **Noise.** The totals of the framing variants are each one reading. The photocopy and clean-nine totals of PAD 8, 16, and 24 agree within 4 and 31 (the 31 is M's artefact), so the padding result stands over the noise floor of +6 and +19; differences of 10 or less between framing variants (CENTRE against PAD 16, PAD 8 against PAD 24 on the photocopies) do not.
- **Rows scored.** The ink heights are of all crops, scored and not scored. The 105 scored Russian rows were not measured separately for height.
- **Real use.** The frame the app gives its reader is not the row crop of this harness. Whether the app's own crop is cut through ink in the same way is NOT ESTABLISHED here.

### Step 5 scripts and files

- `scripts/clean.py` gained the steps `pad:<top and bottom>:<left and right>`, `padpaper:<top and bottom>:<left and right>`, `height:<H>`, and `centre`, with helpers `ink_rows_extent`, `pad_white`, `scale_to_ink_height`, `centre_ink`; the shape assertion is skipped for the size-changing steps.
- `scripts/step5.py`: the 32 framing runs, two at a time, through `scripts/variant.sh` (which now takes a file lock around the scorer, because two scorers write `harness/norm-cache.json`).
- `scripts/tables5.py`: `tables5.md` and the best totals.
- `results/inkheights.txt`, `results/step5-exM.txt`, `results/edge-ink.txt`, `results/f-*.json`, `logs/f-*.txt`, `crops-f-*/`, `ocr2-f-*/`.

## Step 6, the frame with paper-tone padding

Added on the coordinator's third message. One pass over all 18 songs, so the whole-18 total is one number, all on path B (deskew, then closing 3 by 3, no Sauvola), then: HEIGHT 32 and, separately, HEIGHT 40, each followed by 16 px of the crop's own commonest grey on all four sides (step 5's definition of paper tone, `padpaper` in `scripts/clean.py`); and PAD 16 in paper tone alone, no scaling. Same reader, scorer (`score117.py`, sound, split), and baseline (1,875 of 2,538 for the whole 18). Seating was not run, for the reason given in step 5.

### Control rule, written first

Written to `control-rules.txt` at the time stamped there, before any step 6 crop was read, with my numbers for the loose words:

- HEIGHT 32 with paper-tone padding keeps the photocopies near 1,026 (mine: 1,016 to 1,036).
- It lifts the clean nine above 1,057 with M near 51 (mine: M 46 to 56).
- The whole-18 total is above 2,050.
- Likeliest failure: the scaling that helps the photocopies hurts the clean songs whose ink already sits near 48 px (mine: HEIGHT 32 reads fewer on the clean nine than PAD 16 in paper tone alone on path B, 1,065 in step 5).

### The measurements

Each variant was run once, on 18 songs, by `scripts/variant.sh` into `logs/f6-<variant>-B.txt` and `results/f6-<variant>-B.json`; the tables are built by `scripts/tables6.py` into `tables6.md`, printed here from that file. The cross-check at the end of the file shows this pass's PAD 16 in paper tone equals step 5's (1,001 on the photocopies, 1,065 on the clean nine; separate runs of the same crops).

Per song, syllables right (sound, split) of the printed; the change against the stored baseline in parentheses. Ink height = median (min to max) in px of the song's original crops (`results/inkheights.txt`). All three variants are path B: deskew, then closing 3 by 3, then the framing named.

| song | printed | ink height before scaling | baseline | PAD 16 paper tone, no scaling | HEIGHT 32 then pad 16 paper tone | HEIGHT 40 then pad 16 paper tone |
|---|---|---|---|---|---|---|
| B01 | 147 | 43 (32 to 51) | 106 | 131 (+25) | 133 (+27) | 131 (+25) |
| B02 | 86 | 41 (36 to 53) | 73 | 78 (+5) | 81 (+8) | 78 (+5) |
| B03 | 147 | 44 (23 to 263) | 106 | 129 (+23) | 129 (+23) | 129 (+23) |
| B04 | 148 | 44 (33 to 89) | 114 | 113 (-1) | 122 (+8) | 118 (+4) |
| B06 | 142 | 50 (31 to 151) | 85 | 104 (+19) | 105 (+20) | 99 (+14) |
| B07 | 151 | 51 (30 to 394) | 94 | 110 (+16) | 113 (+19) | 112 (+18) |
| B08 | 141 | 50 (37 to 108) | 102 | 120 (+18) | 124 (+22) | 123 (+21) |
| B09 | 139 | 50 (27 to 287) | 89 | 116 (+27) | 120 (+31) | 115 (+26) |
| B10 | 148 | 47 (39 to 418) | 91 | 100 (+9) | 99 (+8) | 103 (+12) |
| S | 109 | 42 (18 to 141) | 91 | 101 (+10) | 102 (+11) | 102 (+11) |
| T | 200 | 43 (30 to 263) | 164 | 175 (+11) | 176 (+12) | 179 (+15) |
| K | 131 | 45 (24 to 174) | 116 | 117 (+1) | 119 (+3) | 118 (+2) |
| M | 53 | 40 (26 to 105) | 46 | 51 (+5) | 47 (+1) | 50 (+4) |
| U1 | 97 | 50 (27 to 72) | 93 | 94 (+1) | 92 (-1) | 94 (+1) |
| U4 | 112 | 54 (34 to 275) | 79 | 80 (+1) | 74 (-5) | 76 (-3) |
| U5 | 258 | 52 (28 to 196) | 206 | 215 (+9) | 216 (+10) | 221 (+15) |
| U6 | 152 | 55 (29 to 156) | 119 | 130 (+11) | 125 (+6) | 130 (+11) |
| P | 177 | 38 (22 to 65) | 101 | 102 (+1) | 109 (+8) | 102 (+1) |

| set | printed | baseline | PAD 16 paper tone, no scaling | HEIGHT 32 then pad 16 paper tone | HEIGHT 40 then pad 16 paper tone |
|---|---|---|---|---|---|
| nine photocopies | 1249 | 860 | 1001 (+141) | 1026 (+166) | 1008 (+148) |
| other nine | 1289 | 1015 | 1065 (+50) | 1060 (+45) | 1072 (+57) |
| whole 18 | 2538 | 1875 | 2066 (+191) | 2086 (+211) | 2080 (+205) |

Stage counts over the whole 18 (row cutting by eye, 17, is in every column; baseline from `results/baseline-stored-all18.json`).

| stage | baseline | PAD 16 paper tone, no scaling | HEIGHT 32 then pad 16 paper tone | HEIGHT 40 then pad 16 paper tone |
|---|---|---|---|---|
| read | 1875 | 2066 | 2086 | 2080 |
| letter recognition | 345 | 206 | 190 | 195 |
| token splitting | 298 | 242 | 232 | 237 |
| row cutting | 17 | 17 | 17 | 17 |
| unattributed | 3 | 7 | 13 | 9 |

Stage counts by set (letter recognition / token splitting / unattributed):

- nine photocopies: baseline 202 / 170 / 0; PAD 16 paper tone, no scaling 108 / 121 / 2; HEIGHT 32 then pad 16 paper tone 103 / 93 / 10; HEIGHT 40 then pad 16 paper tone 108 / 110 / 6
- other nine: baseline 143 / 128 / 3; PAD 16 paper tone, no scaling 98 / 121 / 5; HEIGHT 32 then pad 16 paper tone 87 / 139 / 3; HEIGHT 40 then pad 16 paper tone 87 / 127 / 3

BEST whole-18: HEIGHT 32 then pad 16 paper tone (results/f6-h32-B.json) 2086 of 2538 against 1875 (+211)
CHECK against step 5 (same crops, separate runs): PAD 16 path B photocopies 1001 (step 5) against 1001 (step 6); clean nine 1065 against 1065.

### What step 6 shows

1. **The best configuration of the whole 18 is HEIGHT 32 then pad 16 in paper tone, on path B: 2,086 of 2,538 (82.2 percent), +211 against 1,875 (73.9 percent)** (`results/f6-h32-B.json`). HEIGHT 40 reads 2,080 and PAD 16 alone 2,066. The 6 between HEIGHT 32 and HEIGHT 40 is inside the noise floor of step 2 (+6 and +19 on a nine-song total), so the two heights are not separated by this measure; both beat PAD 16 alone by 14 to 20.
2. **The control rule held on every number and failed on none, by thin margins.**
   - **Photocopies near 1,026:** held, 1,026 (the same as step 5's white-padded pair, as expected for crops whose paper is white).
   - **Clean nine above 1,057:** held by 3 (1,060), which is inside the noise floor. HEIGHT 40 reads 1,072 on the clean nine.
   - **M near 51:** held at 47 (HEIGHT 32), and 50 (HEIGHT 40) and 51 (PAD 16). M is no longer a collapse, but HEIGHT 32 costs it 4 against PAD 16 alone.
   - **Whole-18 above 2,050:** held, 2,086.
3. **The likeliest failure arose on the clean songs, as I defined it, by 5.** HEIGHT 32 reads 1,060 on the clean nine against 1,065 for PAD 16 alone. The loss is on the songs whose ink is 50 px or more: U1 −2, U4 −6, U6 −5, U5 +1 against PAD 16 alone, net −12 (ink heights 50, 54, 55, 52); the five clean songs with ink under 50 px (S, T, K, M, P) gain a net +7, with M −4 and P +7. On the photocopies the same idea does not hold: B06, B07, B08, and B09 have ink heights of 50 or 51 and each reads 1 to 4 more under HEIGHT 32 than under PAD 16 alone. Every difference of this size is of the order of the noise floor, so I read this as a lead and not as a finding.
4. **Stages, whole 18:** letter recognition falls from 345 to 190 (−155) and token splitting from 298 to 232 (−66) under HEIGHT 32; unattributed rises from 3 to 13 and row cutting by eye stays at 17. By set, the photocopies go from 202 / 170 / 0 to 103 / 93 / 10 (letter recognition, token splitting, unattributed), and the clean nine from 143 / 128 / 3 to 87 / 139 / 3: on the clean nine token splitting rises by 11 while letter recognition falls by 56.
5. **Per song against the stored baseline,** under HEIGHT 32 only two songs read fewer than they did: B-set none, clean set U1 (−1) and U4 (−5). Every photocopy song gains (+8 on B02, B04, and B10; +31 on B09).

### What step 6 cannot tell

- Whether HEIGHT 32 and HEIGHT 40 differ: one run each, a gap of 6 on the whole 18, inside the noise floor.
- Why scaling helps the photocopies and not the clean songs of ink height 50 or more: only the per-song pattern above, which is a small sample (four songs).
- The effect in the app. The app's own crop and frame were not measured here, as in step 5. Seating under the right note was not run on any step 5 or step 6 variant.
- Heights other than 32 and 40, and padding other than 16 px with paper tone, on path B: not run.
- Whether the angle sweep, the closing kernel, the height, and the pad interact: the variants are one path with three framings, not a grid.

### Step 6 scripts and files

- `scripts/variant.sh` (unchanged), run three times over the 18 songs with the steps `deskew,close:3,height:32,padpaper:16:16`, `deskew,close:3,height:40,padpaper:16:16`, and `deskew,close:3,padpaper:16:16`.
- `scripts/tables6.py`: builds `tables6.md`.
- `results/f6-h32-B.json`, `results/f6-h40-B.json`, `results/f6-pad16-B.json`, `logs/f6-*.txt`, `crops-f6-*/`, `ocr2-f6-*/`, `tables6.md`.
