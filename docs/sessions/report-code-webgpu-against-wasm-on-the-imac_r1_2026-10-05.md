# Report: the WebGPU read against the WebAssembly read on the iMac (r1, 2026-10-05)

Code (Sonnet 5.5), 2026-10-05. Brief: `brief-code-webgpu-against-wasm-on-the-imac_r1_2026-10-05.md`, QUEUE row 35. Part A only. Nothing in Ilya was changed; nothing was committed or staged.

Read at `0976735` on `Shane`. `git status` for `apps/`, `packages/`, and `third_party/` showed no changed file, so the app read is the committed app. The working tree is dirty only in `docs/` (the desk's records and briefs), plus the new folder named below.

**The answer: WebGPU did not read worse. The two reads gave the same MusicXML, note for note and length for length, and both are 3/8. The 9/8 that Dann saw did not reproduce on this machine.** Part B did not run, and `path-choice.ts` is unchanged.

## What was run

- Dann's installed Google Chrome, headed, fresh profile (Playwright `channel: 'chrome'`, `launchPersistentContext` on an empty temp directory), 1440 x 900.
- Ilya's own dev server (`vite dev`) from `apps/web`, on port 5199, started by me and stopped by me. Before starting it, `lsof` listed no node process listening on any port.
- The file `~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf`, put through the intake's own file input (`input[type="file"].hidden-input`), so the read ran the whole real path: `scan.ts`, `homr-reader.ts`, `path-choice.ts`, `join-pages.ts`, then ingestion.
- Run 1, path as Ilya chooses it. Run 2, the forced WebAssembly path. The force is in the driver script only: an init script makes `navigator.gpu.requestAdapter()` answer `null`, so `choosePath` returns `wasm-threads`. No file of Ilya's was touched.
- Capture: an init script wraps `File` (to keep the joined MusicXML Ilya ingests) and `Worker` (to keep each page's MusicXML as homr-web's worker sent it).

**The adapter, read in the page** (`navigator.gpu.requestAdapter()`): vendor `apple`, architecture `metal-3`, `shader-f16` present (`webgpu.meta.json` holds the full feature list). The same adapter was granted in the WebAssembly run; only Ilya's view of it was hidden.

## Part A: the table

Scored with `tools/e16-harness/src/scan-scorer.ts` against `docs/sessions/truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json`, as `scan-baseline.ts` does for song 7. The scorer's two inputs (events and bars) were made from the joined MusicXML by `score-joined.ts` in the results folder (below), not by `scan-baseline.ts` itself, which reads `ro` JSON from the older reader.

| | WebGPU | WebAssembly |
|---|---|---|
| Console line | `[omr] homr read 3 of 3 pages of Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf in 43091 ms on webgpu` | `[omr] homr read 3 of 3 pages of Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf in 121324 ms on wasm (no WebGPU adapter (the browser granted no adapter))` |
| Read time (the line's figure) | 43.1 s | 121.3 s |
| Time from the drop to the score on the page | 45.7 s | 124.0 s |
| Metre on page 1 (voice part, as homr wrote it) | writer's 1/4, then printed 3/8 | the same |
| Metre on page 2 | writer's 1/4 only | the same |
| Metre on page 3 | writer's 1/4 only | the same |
| Metre of the joined part | 3/8, once | 3/8, once |
| Voice-part bars (page 1, 2, 3; joined) | 27, 35, 37; 99 | 27, 35, 37; 99 |
| Bars whose written lengths add up to 3/8 | 83 of 99 (the other 16 are empty) | 83 of 99 (the same 16) |
| Bars all right (every event matched, pitch and length right) | 80 of 99 | 80 of 99 |
| Notes with pitch and length as printed | 171 of 174 | 171 of 174 |
| Notes misread | 3 (pitch wrong; length right) | 3, the same |
| Notes missing, extra | 0, 0 | 0, 0 |
| Rests read with the right length | 48 of 48 | 48 of 48 |
| Score (of every 100 printed notes, right pitch and length) | 98.28 | 98.28 |
| Where the misreads are (truth bar) | 35, 39, 67 | 35, 39, 67 |

- The truth has 99 bars, 174 notes, 48 rests. Both reads have 99 bars, 174 notes, 48 rests, and the scorer picked octave shift 0 for both.
- The 16 empty bars: bars 1 to 7, 62, 70, 84, and 94 to 99 hold no event, as the truth holds none. "Written lengths" means each note's `<type>` and dots; the next section says why not `<duration>`.
- 98.28, 80 of 99 bars, and misreads at bars 35, 39, 67 are the figures row 29's builder reported for the WebAssembly read in the desk's cloud workspace (QUEUE row 29). So the iMac's WebAssembly read matches the cloud's.

### How the two reads differ

`webgpu.joined.musicxml` and `wasm.joined.musicxml` differ in 185 lines. Every one is an `<!-- imgpos: x, y -->` comment (the note's place on the page image), and the difference is 1 to 4 pixels (for example `2768, 1118` against `2768, 1120`). With `imgpos` lines removed, the two joined files are identical (`diff` returned nothing). The three per-page files differ the same way and in no other. So fp16 on Metal and fp32 on WebAssembly gave the same notes, and moved the printed positions by a few pixels.

### The read time, which the singer waits for

On this iMac: WebGPU 43.1 s, WebAssembly 121.3 s, for three pages, one run each. One run each is not a spread. The earlier figure for WebAssembly in the cloud workspace, `tch-1.png` alone, was 108,980 ms (row 29's report), so the two are not comparable.

## The two pictures

Markup, first page, after each read: `webgpu.markup.png` and `wasm.markup.png`, in the folder below. Both show the voice part in 3/8, two sharps, seven silent bars collapsed to one rest with a 7, then bars that read as the page prints them. The two pictures are the same by eye. I did not run a pixel comparison.

## What this says about the 9/8

This run does not reproduce Dann's 9/8, and nothing in it shows that the WebGPU path is the cause. Row 35's inference (item 4 of the brief's "What is known") is **not supported**: WebGPU on this adapter read this PDF the same as WebAssembly.

What else is on file that bears on it:

1. **homr's `<duration>` does not agree with its `<type>`.** In the joined part, 141 notes are typed `eighth` with `<duration>2` (at `<divisions>2`, which is a quarter), and 45 are `eighth` with `<duration>1`. Summed by `<duration>`, 63 non-empty bars come to 6/8 and 20 to 3/8; summed by `<type>` and dots, all 83 come to 3/8. Anything that adds up `<duration>` and not `<type>` would see most bars as double length. The picture shows Ilya's parser drew them as printed, so it reads `<type>`. I did not read the parser to confirm which it uses, and I did not test a read where `<duration>` rules.
2. **homr's own metre.** Its writer gave pages 2 and 3 a metre of 1/4 and page 1 a 1/4 followed by the printed 3/8. `join-pages.ts` drops the writer's one, so the joined file states 3/8 once. If a page's printed metre were not seen, the fallback is homr's median bar length, as the brief says; nothing here exercised that.

## NOT ESTABLISHED

- **Why Dann's drop at 15:08 drew 9/8.** Not reproduced. Candidate differences I did not test, listed as candidates and nothing more: (a) the deployed alias against my dev server (the production build, its service worker, its served model files); (b) Dann's Chrome profile (a cached older build or older model files from his 2026-10-04 walk, which used model 396); (c) a different file under the same name in his Downloads (mine is the file at that path, md5 not recorded); (d) a read that differs run to run on his machine (I ran each path once). Cheap next steps, in order of cost: ask Dann for the console line from his 15:08 drop (it names the backend and the time); run the same drive against `pnpm build` then `vite preview`; run each path three times for a spread.
- **Whether the 9/8 came from the reader or from the drawing.** I did not have his MusicXML.
- **Whether `<duration>` against `<type>` plays any part.** Item 1 above is a measured oddity in homr's output, with no link to the symptom shown.
- **The WebAssembly time on the iMac is one run**, and the dev server serves unminified code. A production build may differ.
- **Per-page truth.** The truth is one list of 99 bars for the joined part, so the per-page columns above are metre and bar counts only, not scores.
- **The scorer's input.** The events were built by `score-joined.ts` from the MusicXML. It reproduces the desk's 98.28, 80 of 99, and bars 35, 39, 67 exactly, which is the check I have that it agrees with row 29's kit scorer; I did not run that kit.

## Part B

Not run. WebGPU was not worse on bars that add up (83 against 83) or on notes read as printed (171 against 171). `path-choice.ts` and `path-choice.test.ts` are unchanged, and no gate was run. The brief says, in that case, that the cause is elsewhere: the two reads first differ from the truth at bar 35, and the only differences are three pitch misreads, one each in bars 35, 39, and 67, the same on both paths. Every length is right.

## Where everything is

Folder `docs/sessions/webgpu-against-wasm_r1_2026-10-05/`:

- `webgpu.markup.png`, `wasm.markup.png`: the two pictures.
- `webgpu.joined.musicxml`, `wasm.joined.musicxml`: what Ilya ingested; `*.page1..3.musicxml`: each page as homr-web's worker sent it.
- `webgpu.score.json`, `wasm.score.json`: the scorer's totals and every difference.
- `webgpu.console.log`, `wasm.console.log`: the browser consoles; `webgpu.meta.json`, `wasm.meta.json`: adapter and timings.
- `drive-chrome.cjs` (the driver; `node drive-chrome.cjs webgpu|wasm`, with a dev server on 5199) and `score-joined.ts` (MusicXML to scorer). Both are scratch tools: they import by absolute path and carry no test. They are not part of Ilya.

Cost: not measured; well under the 400,000 stop.
