# MEMO. Two defects fixed, and N.142 step 2 builds nothing

**Claude Code, 2026-09-24, `Shane` at `5e22d03`, tree dirty. WRITTEN, not DONE.** Gates at baseline except web-test, **1402**: one new test. `ilya-ship.sh` still expects 1401.

## Defect 1. MNX refused

Before refusing JSON, `format-detection.ts` now parses the whole file and accepts a top-level `mnx` object. The fast path stays. The new test puts the key past 2,048 bytes. The real file: `5e22d03` refuses it; the fix accepts it. In the app, the receipt reads "Format: MNX (direct)", the poem fills (1 line, 12 words), and Markup draws five bars, 18 notes, and 4/4 once.

## Defect 2. Page one overprints

`InsightsPane.svelte`'s fit ran inside its `$effect`, before the DOM moved. Logged: `contentTop` 191 while the squircle's `style.top` read 64 px, then 291 against 191. The squircle's `top` updates in `PageFit`'s snippet, after this effect. So the fit read the old page, fitted, and nothing asked again. It now measures after `tick()` and also reads `contentTop`.

To show the difference, I held the vowel list at 60 px and grew the header by 100 px after the first render (injected CSS). `5e22d03` then overprinted by 79 px. The fix moved the list and cleared by 14 px. First render, fix only, headless Chromium, visible page:

| | English | French |
|---|---|---|
| Cupid | clears 111.8 px | 33.7 px |
| Sunless 1 | 114 px | 80.2 px |

## N.142 step 2. Every count is zero

Only the two Sunless 1 MusicXML songs hold placements, 96 each. Neither has a tie in its line. Cupid has 11 tie continuations and no placements. Step 2 builds nothing.

## NOT ESTABLISHED

- Dann's own case. My test voice and data never overflowed without the injected CSS.
- A hidden tab.
- The PDF read.
- Whether his live library matches the 2026-09-21 export.

**`git add`:** `format-detection.ts`, `format-detection.test.ts`, `InsightsPane.svelte`, this memo.
