# Report: the final test, the ten sealed songs through the drop box (r1, 2026-10-09)

Code (Sonnet 5.5) on Dann's Mac, QUEUE row 55, brief `brief-code-the-final-test_r2_2026-10-08.md`. Measures only: no app code, no scorer change, no git command that writes. (The file name keeps the brief's date; the run was 2026-10-09.)

## The commit, and how it was checked

- Alias `ilya-git-shane-dannmittons-projects.vercel.app` points (Vercel `get_alias`) at deployment `dpl_F4D64PwcxJBLiv5LYWXVhcxJAPwV`, state `READY`.
- `get_deployment` with Git details names `githubCommitSha` `16e6a9a3ebd242ac41ebe80c58545a9121cf7afe` on `Shane`. **The alias serves 16e6a9a**, which is HEAD. 16e6a9a changes only `docs/`; the app is as at 472ed96.
- Every reading is stamped `homr-web@0.2.0-ilya.5/465`.

## The adapter

Google Chrome, headless, launched by Playwright 1.58.2 (`channel: 'chrome'`, `--enable-unsafe-webgpu`), a fresh browser context per song, the file into `input[type="file"].hidden-input`, the reading taken from the `sources` store of the `ilya-library` IndexedDB, `conv.py` (`measure-checks_r1_2026-10-05/scripts/scorer/`), then `final-line.ts song`. WebGPU adapter `apple metal-3`, `shader-f16` true. All twelve songs took the `webgpu` path. `drop.cjs` is row 52's, copied unchanged.

One difference from the brief's wording: `tsx` is not installed in this tree, so `final-line.ts` ran under `node` 24.13.0 with type stripping (`node final-line.ts ...`). Node prints a "reparsing as ES module" warning; the lines are unaffected.

## Rehearsal

Equal to row 49's "after" in every count (right, missing, extra, pitch, length, bars read), so the ten went on.

```
Grechaninov: webgpu; 153 of 154 right; missing 0; extra 0; pitch misreads 1; length misreads 0; bars read 58 of 58; octave shift 0; metre as printed NOT SCORED (the truth carries no figures); score 99.4 PASS; no note marked UNSURE
Varlamov: webgpu; 61 of 63 right; missing 0; extra 1; pitch misreads 0; length misreads 2; bars read 26 of 26; octave shift 0; metre as printed NOT SCORED (the truth carries no figures); score 95.2 PASS; no note marked UNSURE
```

Beside row 49's: Grechaninov 153 of 154, missing 0, extra 0, pitch 1, length 0, bars 58. Varlamov 61 of 63, missing 0, extra 1, pitch 0, length 2, bars 26.

## The ten and the total, unedited

```
G: webgpu; 110 of 110 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 59 of 63; octave shift 0; metre as printed 46 of 46 bars (17 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
H: webgpu; 136 of 144 right; missing 0; extra 0; pitch misreads 1; length misreads 7; bars read 61 of 61; octave shift 0; metre as printed 45 of 45 bars (16 bars with no matched note or rest not judged); score 94.4 BELOW; with 3 notes marked UNSURE set aside 95.7 PASS
I: webgpu; 123 of 127 right; missing 0; extra 1; pitch misreads 1; length misreads 3; bars read 31 of 28; octave shift 0; metre as printed 24 of 24 bars (4 bars with no matched note or rest not judged); score 96.1 PASS; no note marked UNSURE
J: webgpu; 91 of 91 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 49 of 49; octave shift 0; metre as printed 30 of 30 bars (19 bars with no matched note or rest not judged); score 100.0 PASS; no note marked UNSURE
K: webgpu; 133 of 134 right; missing 0; extra 107; pitch misreads 0; length misreads 1; bars read 51 of 53; octave shift 0; metre as printed 29 of 33 bars (20 bars with no matched note or rest not judged); score 19.4 BELOW; with 1 note marked UNSURE set aside 19.5 BELOW
L: webgpu; 72 of 82 right; missing 0; extra 116; pitch misreads 4; length misreads 6; bars read 82 of 76; octave shift 0; metre as printed 39 of 42 bars (34 bars with no matched note or rest not judged); score -53.7 BELOW; with 2 notes marked UNSURE set aside -55.0 BELOW
M: webgpu; 62 of 62 right; missing 0; extra 7; pitch misreads 0; length misreads 0; bars read 35 of 26; octave shift 0; metre as printed 19 of 19 bars (7 bars with no matched note or rest not judged); score 88.7 BELOW; no note marked UNSURE
N: webgpu; 226 of 235 right; missing 9; extra 2; pitch misreads 0; length misreads 0; bars read 82 of 82; octave shift 0; metre as printed 63 of 63 bars (19 bars with no matched note or rest not judged); score 95.3 PASS; no note marked UNSURE
O: webgpu; 155 of 160 right; missing 0; extra 0; pitch misreads 5; length misreads 0; bars read 37 of 37; octave shift 0; metre as printed 37 of 37 bars (0 bars with no matched note or rest not judged); score 96.9 PASS; no note marked UNSURE
P: webgpu; 89 of 116 right; missing 0; extra 0; pitch misreads 0; length misreads 27; bars read 46 of 48; octave shift 0; metre as printed 0 of 34 bars (14 bars with no matched note or rest not judged); score 76.7 BELOW; with 3 notes marked UNSURE set aside 77.9 BELOW
Total of 10 songs: webgpu; 1197 of 1261 right; missing 9; extra 233; pitch misreads 11; length misreads 44; bars read 533 of 523; metre as printed 332 of 373 bars in 10 songs; score 76.4 BELOW; with 9 notes marked UNSURE set aside 76.8 BELOW; songs below 95.0 with UNSURE set aside: 4 of 10
```

On the verdict score (UNSURE set aside): six songs pass (G, H, I, J, N, O) and four are below (K, L, M, P). By the other score, H is also below.

## Refusals

None. All ten songs reached homr, were read, and left a stamped reading in the library (per-song `meta.json`: outcome `read`, 36 to 80 seconds each). No second drop.

## How the ten stayed sealed

A bash script (`ten.sh`, scratchpad) globbed the scan folder, copied the ten scans as `G.pdf` to `P.pdf` in glob order into a private folder, dropped them, and ran `final-line.ts` for each; only its output lines were read. No scan, truth, reading, bar, or `keep` file was opened, viewed, listed, or printed. No song was diagnosed.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **That the truth files are right.** They are unproofed drafts. A low score may be a truth fault, not a reader fault; K and L (extra 107 and 116) especially could be either, and nothing here tells which.
- **Why any song is below.** Not looked at, by the brief.
- **That the staff itself was drawn.** "Read" was taken as the app's own `[omr] homr read` line, the keep of a stamped reading, and the score receipt waited for (wait times out silently in `drop.cjs`, so the receipt's appearance is not separately recorded in these lines).
- **Reads on the iMac, in a headed window, or on WebAssembly.** One headless WebGPU read per song, so no spread.
- **That `final-line.ts` under `tsx` prints the same as under `node` 24 type stripping.** The rehearsal matched row 49 under `node`, so under `node` it is established; under `tsx` it was not run.
- **How unseen the letters are.** G to P follow glob order, which is alphabetical by file name; no match to titles was made here.
