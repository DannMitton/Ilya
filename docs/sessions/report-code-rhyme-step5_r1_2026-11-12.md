# Report: rhyme matcher, step 5 (the set-aside) (Code, cloud lane 49, r1, 2026-11-12)

## What changed

- **The match rides on the word (Amendment 4).** `WordStackData.rhymePartner?: string` (`types.ts`) holds the partner for every line end the matcher finds, ticked or not. `ProcessTextOptions.rhymeSetAside` (`types.ts`, Amendment 5) takes `{ has(key) }` (a Map or Set of word keys). In `processText` the match is computed first; a matched word reads `'literary'` unless its key is set aside, and a set-aside trigger still links its group (the match is found by the probe regardless). `pipeline.ts` 896 of 901.
- **The mark.** `WordMarks.rhyme` (Map of `true`) beside `spot`, in `load`, `maps`, `clear`, `carry`, with `toggleRhyme`. New `MarkKind` `'rhyme'` in `library/types.ts` and `MARK_KINDS`; `validValue` accepts only `true`; `rowsFromMaps` writes `rhyme` rows after the others and carries them over an edit; `mapsFromRows` now names `spot` (`else if (kind === 'spot')`) and gives `rhyme` its own branch, with no catch-all (Amendment 6). `markMapsEmpty` counts it. The per-word reset (`lib/word-reset.ts`) clears it and asks for the transcription again.
- **The three calls (Amendment 5).** `+page.svelte` derived poem and Lyrics `runPipeline` pass `rhymeSetAside: lyricsMarks.rhyme`; `witness-lines.ts` (`WitnessMarks` gains `rhyme`) passes it for Poem. A new handler `handleRhymeToggle` mirrors the stress handlers (claims a derived poem, toggles, re-runs). `+page.svelte` 5528 of 5534.
- **The Inspector (Amendment 7).** The slot's markup and its CSS moved to a new `components/Drawer/ReadingBoxes.svelte`, which takes the boxes to draw. `InspectorPanel.svelte` went from 2431 to 2396 lines. Spot first, then "Stage reading" / « Prononciation scénique » (`inspector.rhyme.stage`, i18n key coined here), drawn on every word with `word.rhymePartner` (so a set-aside word still shows it, ticked). The spot input keeps its class `spot-checkbox`, so `e2e/word-marks-saved.test.ts` still finds it; the new one is `rhyme-checkbox`. `hasOverrides` includes the set-aside, so the reset button shows. The i18n key index (head of `i18n.ts`) is updated: `inspector.` 43, total 1,223.

## Tests

- Unit: `rhyme-reading.pipeline.test.ts` (tick gives [kɨj] with the partner still set and the exception `velar-adjectival`; untick returns [kʌj]; a set-aside trigger still links the far one; a word with no match carries no partner; another word's set-aside leaves this one; Poem through `witnessLines`); `word-mark-rows.test.ts` (row of its own kind, never read into `spot`, ordering, value must be `true`, carried over an edit, an unknown kind dropped alone by "an older build" with the rest kept, round trip through the record); `word-marks.test.ts` (toggle, load/maps/clear, carry); `word-reset.test.ts`; `reading-boxes.test.ts` (both labels pinned; the Inspector tests the match, spot first).
- **Browser** (`e2e/rhyme-set-aside.test.ts`, new; desk width; run here with Playwright against `pnpm dev` using the pre-installed Chromium): typed «глубокой / высокий» reads [kʌj]; tapping the ⟨и⟩ shows "rhymes with «глубокой»" and "(Grayson, p. 302)"; two boxes, spot first; tick gives [kɨj] with the box still drawn and ticked; untick returns [kʌj]; **the set-aside is saved and shown after a reload** (the save is debounced, so the test waits 3 s, as `word-marks-saved` does). Passed, with `word-marks-saved` (2 tests) also green.

## Captures for the desk (Amendment 7)

`docs/sessions/captures-rhyme-step5/inspector-{desktop,phone}-{en,fr}.png`: the Inspector for «высокий» with both boxes, at 1440 px (desktop width) and 390 px (touch, 2x), English and French. Labels read: "Spot reconstitution" / "Stage reading" and « Reconstitution ponctuelle » / « Prononciation scénique ». At 390 px the boxes stack, right-aligned under the card, and the second sits just above the ribbon with no overlap. I viewed the French desktop and phone captures; I did not measure anything against a design.

## Gates

phonology 462, blurb 178, integration 155, web-test 5252 passed and 1 skipped (was 5231; +21), web-check 0 errors and 12 warnings, ratchets OK (pipeline 896, +page 5528, Inspector 2396).

## What I could not establish

- Whether an older Ilya build really drops a `rhyme` row and keeps the rest on a real downgrade: tested with an unknown kind, which exercises the same `validRow` branch.
- The full Playwright suite (step 6 runs it) and the phone project's own tests.
- The Poem witness's box in a browser (unit-tested through `witnessLines`; the browser test used Lyrics).
- Whether an INSIGHTS or MELODY surface should show that a word's rhyme was set aside; nothing was built for it.
