# Report: the eight unseen songs read through the drop box (r1, 2026-10-08)

Code (Opus 5.5) on Dann's Mac, QUEUE row 52, brief `brief-code-eight-unseen-through-the-drop_r1_2026-10-08.md`. Measures only: no app code was changed, so the gates were not run. No git command that writes was run.

## The result

On the deployed site at `8f59ba6`, through the score drop box, on WebGPU, the eight songs read 935 of 960 printed notes right, with 2 extra notes, for a score of 97.2. Seven songs pass at 95.0 or above. One unseen song, D, is below at 89.5, from 15 length misreads. No song was refused.

## The build, and how it was checked

- **Address:** `https://ilya-git-shane-dannmittons-projects.vercel.app`.
- **Commit:** Vercel's record of the deployment behind that alias (`get_deployment`, with its Git details) names `githubCommitSha` `8f59ba67d856df3c74b318a45052a5f6e975ffa7` on `Shane`, state `READY`, deployment `dpl_Af8KecxBC6bo8qJ2QFeZWYTjHLuW`.
- **Stamp:** every reading the app kept is stamped `homr-web@0.2.0-ilya.5/465`.

## The path

- **Browser:** Google Chrome on this Mac, headless, launched by Playwright 1.58.2 (`channel: 'chrome'`, `--enable-unsafe-webgpu`). **Adapter:** `apple metal-3`, with `shader-f16`. Every song took the `webgpu` path, as the app's own console line says (`[omr] homr read … on webgpu`).
- **The door:** each PDF went into the intake's file picker (`input[type="file"].hidden-input`, `apps/web/src/lib/components/Drawer/IntakePanel.svelte:497` to `:503`) with Playwright's `setInputFiles`, as the e2e test of a dropped score does (`apps/web/e2e/singer-paths.test.ts:26`). `readScanPages` and `readScan` were not called.
- **Empty library:** each song had a fresh browser context, so its IndexedDB, Cache Storage, and HTTP cache started empty. The model files were downloaded again for each song.
- **Done when:** the app's `[omr] homr read` line appeared, the score's receipt (`.receipt-score`) became visible, and the library held the reading.
- **The reading scored:** the reading the app keeps with the song, `reading.musicXml` from the `sources` store of the `ilya-library` IndexedDB, scored with the same `conv.py` and `score.ts` as row 49 (`docs/sessions/measure-checks_r1_2026-10-05/scripts/scorer/`, unchanged).
- **Score:** (right − extra) ÷ printed × 100, to one decimal; `PASS` at 95.0 or above.

## The lines, unedited

```
Grechaninov: webgpu; 153 of 154 right; missing 0; extra 0; pitch misreads 1; length misreads 0; bars read 58 of 58; score 99.4 PASS
Varlamov: webgpu; 61 of 63 right; missing 0; extra 1; pitch misreads 0; length misreads 2; bars read 26 of 26; score 95.2 PASS
A: webgpu; 67 of 69 right; missing 0; extra 0; pitch misreads 2; length misreads 0; bars read 12 of 12; score 97.1 PASS
B: webgpu; 79 of 79 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 16 of 16; score 100.0 PASS
C: webgpu; 126 of 126 right; missing 0; extra 0; pitch misreads 0; length misreads 0; bars read 17 of 17; score 100.0 PASS
D: webgpu; 138 of 153 right; missing 0; extra 1; pitch misreads 0; length misreads 15; bars read 33 of 31; score 89.5 BELOW
E: webgpu; 230 of 231 right; missing 0; extra 0; pitch misreads 1; length misreads 0; bars read 50 of 50; score 99.6 PASS
F: webgpu; 81 of 85 right; missing 0; extra 0; pitch misreads 4; length misreads 0; bars read 20 of 20; score 95.3 PASS
Total: webgpu; 935 of 960 right; missing 0; extra 2; pitch misreads 8; length misreads 17; bars read 232 of 230; score 97.2 PASS
Adapter: {"f16": true, "info": "apple metal-3"}
Stamps: homr-web@0.2.0-ilya.5/465
```

Grechaninov and Varlamov equal row 49's reads through `readScanPages` in every count.

## Refusals

None. Every song reached homr, was read, showed its score receipt, and left a stamped reading in the library.

## How the six stayed unseen

`eight.sh` in the scratchpad globbed the scan folder, left out the two opened songs, and copied the other six, in glob order, as `A.pdf` to `F.pdf` into a private folder that was never opened. The browser, the console logs, and every printed line saw only those letters. The six songs' scans, readings, truth, and bars were not opened, viewed, listed, or printed; the only output read was the block of lines quoted earlier. `heldout-out.tgz` was not opened.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **That the staff itself was drawn.** "Drawn" was taken as the score's receipt visible and the reading kept. The rendered staff was not measured or looked at, because looking would show the unseen songs.
- **Why D reads 15 length misreads and two bars more than printed.** Not looked at, by the brief's limits. The cloud read of 2026-10-07 found 12 of its kind at a 3 to 2 ratio in one song, read longer with no triplet marked, and inferred missed triplets; that is the cloud helper's inference, not checked here.
- **The same reads on Dann's iMac, in a headed window, or on WebAssembly.** All eight ran in headless Chrome on this Mac's WebGPU, one read each, so there is no spread.
- **Truth.** The eight truth files are the cloud helper's drafts by eye, not proofed by Dann.
- **How unseen the labels are.** A to F follow the glob's order, which is alphabetical by file name, and `report-heldout-blind-read_r1_2026-10-07.md` lists the same six songs alphabetically with their per-song counts. A reader holding both can match letters to titles. No such match was made here.
