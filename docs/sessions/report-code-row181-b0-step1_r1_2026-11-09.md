# Report: row 181 B0 and B0g, step 1 (the reader's letter boxes reach the tokens) (Code, cloud lane 40, r1, 2026-11-09)

Changed: `underlay-recognize.ts` (`TesseractBlock`'s word gains `symbols?`; `wordsOf` carries them, in the word's own `{text,x0,y0,x1,y1}` form, and gives a word without them no `symbols` key), `underlay-page.ts` (`WordBox.symbols?`; `pageTokens` unframes each letter box as the word's box is: `unframeBox(row.transform, …)` plus `row.offsetX`), `underlay-seat.ts` (`Token.syms?: { c, x0, x1 }[]`).

Tests: `underlay-recognize.test.ts` (symbols round-trip to the word; a word without them has no `symbols` key) and `underlay-page.test.ts` (the letter boxes reach the token in page pixels, with a crop offset and scale 2; a word without symbols gives a token without `syms`). Both files pass (55 tests); `svelte-check` 0 errors, 12 warnings (the baseline's).

Nothing reads `syms` yet. Behaviour is unchanged until step 3.

The call already asks for `{ blocks: true }` (`underlay-recognize.ts:74`). I re-read the typings as the brief asks: `node_modules/tesseract.js` is 7.0.0 and `src/index.d.ts:192-211` declares `Symbol { text, confidence, bbox, … }` and `Word { symbols: Symbol[]; text; bbox; … }`, so a word's letter boxes are in the answer. That the real model returns them for a framed row (symbols present for every word) is the desk's measure (symbol fallbacks 0 on 590 syllables); I did not run the reader.
