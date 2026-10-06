> Provenance, added by the desk (Opus): a Sonnet helper in the desk's cloud workspace, 2026-10-06 overnight, under `/home/claude/night/brief-night-2.md` (the held-out test, totals only), then build C on the desk's message. 136,889 tokens for builds A and B; build C's count was not returned. Its claims are its own; the desk saw totals only, and did not look at any held-out page.

# Night 2: the held-out test (Sonnet helper, 2026-10-06)

Totals only. No page image, crop, render, or note-by-note output of any of the ten songs was looked at or printed. Each build was run once per song (exceptions in "Run notes").

Builds: A = clean copy of bbe524b (homr-web 0.2.0-ilya.2), `/home/claude/night/ilyaA`. B = `/home/claude/night/ilya` as it stood (homr-web 0.2.0-ilya.3 and triplets.ts). Neither was modified. Instrument: night 1's reader in headless Chromium on WebAssembly via a copy of drive.mjs (`work/drive2.mjs`, only the song table and the port changed) and `work/score2.sh` (a copy of score.sh with the song table changed; conv.py and score.ts untouched).

## Per-song totals

Score = the scorer's headline. "Right" = notes right in pitch and length, of printed notes.

| Song | Build | Right / printed | Score | Missing | Extra | Pitch misread | Length misread | Bars read / truth | Shift | Read time | Triplet-changed bars |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Sunless 2 | A | 57 / 68 | 83.82 | 0 | 0 | 0 | 11 | 12 / 12 (9 all right) | 12 | 154.5 s | n/a |
| Sunless 2 | B | 57 / 68 | 83.82 | 0 | 0 | 0 | 11 | 12 / 12 (9 all right) | 12 | 156.1 s | 0 |
| Kabalevsky 1, 2, 3, 4, 6, 7, 8, 9, 10 | A and B | NOT READ | NOT ESTABLISHED | | | | | | | | |

Every Kabalevsky song failed to read, in both builds, on its first page: `engine_failed`, log `7079304` (a bare number, no message), after 8 to 10 s. Read, error and time per song are in `work/reads2-A/*.meta.json` and `work/reads2-B/*.meta.json`. Nothing was scored for them; scoring a failed read would be inventing a figure.

## Overall totals (ten songs)

| Build | Right / printed | Songs read | Songs failed |
|---|---|---|---|
| A | 57 of 68 printed notes in the one song read (83.82). The nine Kabalevsky songs' printed-note counts were not looked at (truth files only through the scorer), so a ten-song percentage is NOT ESTABLISHED. | 1 of 10 | 9 |
| B | 57 of 68 in the one song read (83.82). Same. | 1 of 10 | 9 |

So the 95-of-100 question is NOT ESTABLISHED on this held-out set: it is answered for one song (Sunless 2: 83.8, below 95, in both builds) and unanswered for nine.

## What was established

- Sunless 2: build B equals build A on every figure. The triplet check changed 0 bars (counted by comparing time-modification elements per bar of homr's raw voice part against the joined output; the same count on build A is 0, as it must be).
- All 11 Sunless 2 errors are length misreads; no pitch errors, no missing or extra notes, all 12 bars present (3 bars not all right).
- Page sizes (numbers only, from the PNG headers Ilya's `rasterizePdf` makes at its 400 dpi): Sunless 2 pages are 3699 x 4920 px (PDF page 665.76 x 885.6 pt). Every Kabalevsky page is 10333 x 14611 px (PDF page 1860 x 2630 pt), about 8 times the pixels. The Kabalevsky pages are the same size in all nine files.

## NOT ESTABLISHED

- Why the Kabalevsky reads fail. The error is an unlabelled number out of the WebAssembly engine. The page size above is a fact; that it is the cause is not established (I did not test it, and testing would mean changing the pipeline or the input, which rule 2 forbids). Nothing here says whether the same files would read on Dann's iMac or with WebGPU, or if rendered at a lower dpi.
- Any Kabalevsky figure, any ten-song total, and whether the triplet fix helps or hurts on unseen music (Sunless 2 has no triplet bars it changed, so it is silent on that).
- Edition or bar-count differences between truth and scan: no bar-count mismatch appeared (12 of 12), so none flagged.

## Run notes (disclosure)

1. First attempt, build A: all ten songs in one browser process. Sunless 2 read; Kabalevsky 1 failed as above (record kept in `work/reads2-A/kab01.attempt1-shared-process.meta.json`); the process then hung on Kabalevsky 2 and was killed. I then ran each remaining song in its own fresh Chromium process (`work/run2.sh`): Kabalevsky 1 to 10 for A (Kabalevsky 1 a second time, same failure) and all ten for B. Sunless 2 in A is the first attempt's read, not rerun. This was a harness fix for a hang, made before any score was seen; no Ilya or scorer code changed.
2. Read times are from the page's own clock, headless Chromium on this sandbox, WebAssembly, no threads (no cross-origin isolation); not comparable with Dann's iMac.
3. Files: report `/home/claude/night/out/report-night-2.md`; reads in `/home/claude/night/work/reads2-A/` and `reads2-B/`; cut inputs in `work/in2/`.

---

# Build C (appended)

Build C = `/home/claude/night/ilya` as it stood (night 1's fix plus night 3's change to `apps/web/src/lib/reader/page-pdf.ts`: pages claiming more than 11 x 17 in render at tabloid size, at most 4400 x 6800 px). Same driver and scorer as builds A and B (`work/drive2.mjs`, `work/score2.sh`), unchanged; one fresh Chromium per song, each song once; `work/run3.sh`; reads in `work/reads2-C/`. No image or note-by-note output was looked at. Triplet-changed bars counted as for build B (time-modification elements per bar, homr's raw voice part against the joined output).

| Song | Right / printed | Score | Missing | Extra | Pitch misread | Length misread | Bars read / truth (all right) | Shift | Read time | Triplet-changed bars |
|---|---|---|---|---|---|---|---|---|---|---|
| Sunless 2 | 57 / 68 | 83.82 | 0 | 0 | 0 | 11 | 12 / 12 (9) | 12 | 156.0 s | 0 |
| Kabalevsky 1 | 150 / 152 | 98.68 | 0 | 0 | 1 | 1 | 67 / 67 (59) | 0 | 385.7 s | 0 |
| Kabalevsky 2 | 93 / 157 | 59.24 | 64 | 0 | 0 | 0 | 41 / 70 (35) | 0 | 235.1 s | 0 |
| Kabalevsky 3 | 157 / 157 | 100.00 | 0 | 0 | 0 | 0 | 52 / 52 (44) | 0 | 405.9 s | 0 |
| Kabalevsky 4 | 150 / 151 | 99.34 | 0 | 38 | 1 | 0 | 39 / 39 (31) | 0 | 396.0 s | 0 |
| Kabalevsky 6 | 153 / 153 | 100.00 | 0 | 0 | 0 | 0 | 37 / 37 (34) | 0 | 388.7 s | 0 |
| Kabalevsky 7 | 160 / 163 | 98.16 | 0 | 116 | 0 | 3 | 53 / 53 (35) | 0 | 548.2 s | 0 |
| Kabalevsky 8 | 154 / 154 | 100.00 | 0 | 0 | 0 | 0 | 32 / 32 (31) | 0 | 337.1 s | 0 |
| Kabalevsky 9 | FAILED | NOT ESTABLISHED | | | | | | | 450.7 s | not available |
| Kabalevsky 10 | 154 / 156 | 98.72 | 0 | 0 | 2 | 0 | 83 / 83 (62) | 0 | 335.6 s | 0 |

Read failure: Kabalevsky 9, `engine_failed`, log `MusicXmlError: AssertionError: a rest group lasts 0 (night-1 driver: WebAssembly asked for)`, after all four pages were recognised (homr's four raw page files exist) and the failure came in writing or joining the MusicXML. No joined output, so not scored. Cause not investigated.

## Overall totals, build C

- Nine songs scored (Sunless 2 and Kabalevsky 1, 2, 3, 4, 6, 7, 8, 10): 1228 of 1311 printed notes right, 93.7 percent. Missing 64, extra 154, pitch misread 4, length misread 15 (1228 + 64 + 4 + 15 = 1311). Bars read 416 of 445 truth bars.
- Kabalevsky only, eight songs read: 1171 of 1243, 94.2 percent.
- Without Kabalevsky 2 (the one song with a large bar shortfall): 1135 of 1154, 98.4 percent. This is a subtraction of a bad result, shown only for information; the honest total is the first line.
- Ten songs: one failed (Kabalevsky 9, whose printed-note count was not read), so a ten-song total is NOT ESTABLISHED.
- Triplet-changed bars: 0 in every song read.

## Flags and NOT ESTABLISHED

- Kabalevsky 2: 41 bars read of 70 truth bars, 64 notes missing. A large bar-count mismatch. It may be an edition difference between the Finale truth and the scan, or a reading failure (for example, bars or systems lost); I may not look to find out. NOT ESTABLISHED.
- Kabalevsky 4 (38 extra notes) and Kabalevsky 7 (116 extra notes) have all truth bars read, yet extra notes. What the extras are (an edition difference, a second voice read as the first, notes read in bars the truth treats otherwise) is NOT ESTABLISHED.
- Whether the triplet fix helps on this music: it changed 0 bars in all nine songs read, so these runs are silent on it.
- Kabalevsky 9's failure cause (above).
- Builds A and B read none of the Kabalevsky songs (all `engine_failed`, page size 10333 x 14611 px), and build C reads eight of nine. That the tabloid-size render is what removed that failure is consistent with the runs but was not tested separately.
- Read times: headless Chromium on WebAssembly without threads in this sandbox; not comparable with the iMac.
