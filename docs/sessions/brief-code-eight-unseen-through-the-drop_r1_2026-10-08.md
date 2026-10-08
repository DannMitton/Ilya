# Brief for Code: the eight unseen songs read through the drop box, scored song by song (r1, 2026-10-08)

Written by the desk (Opus) 2026-10-08 about 15:25. For Code on the Mac, in the window that built QUEUE row 49, so its harness and scorer are already at hand. QUEUE row 52. **Measures only: no app code changes.**

## Why

THE ONE THING (`docs/memory/STATE.md`): the scan reader reads at least 95 of every 100 printed notes, with pitch and length as printed, on songs it has never seen, **on the singer's path**. Row 49's reads went through `readScanPages` in headless Chrome. A singer drops a PDF into Ilya's score box on the deployed site. That door has already failed once: on 2026-10-08 00:31 it refused Grechaninov as a poem before the reader ever ran (QUEUE rows 44 and 45). This run reads all eight songs through that door.

## The path

1. **The deployed site, not the dev server:** `https://ilya-git-shane-dannmittons-projects.vercel.app`. First confirm it serves `8f59ba6` (for example, that the reading is stamped `0.2.0-ilya.5`). If Vercel has not finished building it, wait and check again; do not read an older build.
2. **Chrome on this Mac, on WebGPU**, as for row 49. Report the adapter and the path each read took (`webgpu` or `wasm`).
3. **Each song goes in through the score drop box as a singer's file does** (the intake's file input, for example Playwright's `setInputFiles` on it), not through `readScanPages` or `readScan` directly. Start each song from an empty library, so no stored reading is reused.
4. Wait until the score is drawn, then take the reading the app holds and score it with the same `conv.py` and `score.ts` you used for row 49.

If the drop box refuses a song (poem route, an error, or no score after ten minutes), that song scores 0 and the line says why. Do not work around it.

## Strict limits (as row 49)

- Grechaninov op. 20 no. 4 and Varlamov «Скажи, зачем?» are opened; name them.
- **The other six stay unseen.** Never open, view, list, or print their scans, readings, truth, or bars. A script globs them, reads and scores each, and prints **one line per song**, labelled A to F in the order the glob returns them, with no title and no bar detail.

## What each line carries

Song label; path taken (`webgpu` or `wasm`); right of printed; missing; extra; pitch misreads; length misreads; bars read of printed; and **the song's score, (right − extra) ÷ printed × 100, to one decimal**, with `PASS` at 95.0 or above and `BELOW` under it. Then one total line in the same form. **Print them unedited in the report.**

## Report

`docs/sessions/report-code-eight-unseen-through-the-drop_r1_2026-10-08.md`: the build checked and how; the adapter; the eight lines and the total, verbatim; any refusal and its words; the gates are not needed, because no code changes. A section **Could not establish**. NOT ESTABLISHED beats a complete invented answer.

No git command that writes. When the report is written, set QUEUE row 52's State to MEASURED with the report's name, say so in one line, and stop.
