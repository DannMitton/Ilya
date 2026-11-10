# Report: step B2, the layer wired into the page (Code, cloud lane 43, r1, 2026-11-10)

Commit: "B2: the page reads the barline and time signature layer". Files: `routes/+page.svelte` (5534 → 5519 lines, a ceiling that was at its limit), `score/Loupe.svelte` (one line changed, 3012 unchanged), `score/loupe-print.svelte.ts`, `score/loupe-print-wiring.ts`, `score/bar-layer.ts`, and tests (`bar-layer.test.ts` +2, `loupe-print.svelte.test.ts` +1).

## What changed, site by site (Fable's table, review §4, and the amendment 8 rows)

| site | before | now |
|---|---|---|
| `correctedLine` (`+page.svelte:804`) | `applyCorrections(readLine, corrections)` | `layer.line`: the same call, then `rebar` (`BarLayer`, memoised) |
| `correctedScore` (`:948`) | the ingested score with `vocalLine: correctedLine` | `layer.score`: line, `measures`, and every list keyed by bar rebuilt (`keySignatures`, `clefs`, `timeSignatures`, `tempoMarkings`, `tempoWords`, `metricModulations`) |
| `heldMeasure` (`:829-833`) | `ingestedScore…measures.find(index)` | `layer.measureAt` (song bars) |
| `keyOf` of the verbs (`:873-874`) | same | `layer.measureAt(…)?.keySignature` |
| `heldMeasureLabel` (`:1043-1047`) | same | `layer.labelOf` |
| `selectedSignature` (`:1127-1132`) | same | `layer.measureAt(…)?.timeSignature` |
| the print strip, tag, Previous, Next | keyed to the Loupe's own label | the Loupe's label is converted to the PRINT's bar (`loupePrint.readingLabelOf`, from `BarLayer.readingLabelOfLabel`): both halves of a divided bar show the one strip; the list is the print's, the number shown is the singer's |
| `firstNoteOfBar` / `openAt` (`:2340`) | `line: () => correctedLine` | `line: () => layer.preLine`: the corrected line BEFORE the layer, so the print's measures and the line agree on reading bars (Fable §4, "lend the line before `rebar`") |
| `scoreClef` (`:816-819`) | the ingested first clef | unchanged: the first bar is the first bar in both coordinates |
| MELODY, INSIGHTS, tempo and clef controls, the Transposition ruler | handed `correctedScore` (`:970-977`, `:4368`, `:4403`, `:4359-4368`, read) | unchanged lines; they now receive song bars with rebuilt lists, so MELODY's numbers and INSIGHTS' bars agree with the Loupe's |

**Sites that read the reading and stay on it, by line read:** `musicPhraseEnds` (`phrase-ends.ts:42-79`) walks `parsed.vocalLine` by array index and event id and reads no bar, so it needs no conversion (the review listed `:2457`; it is safe as it stands). The poem join (`loupe-print-wiring.ts:51-55`) hands the ingested line and the warning's bars, both reading coordinates. The unread-bars banner's numbers are written at reading time (below).

## Budget

`+page.svelte` is at 5519 against a ceiling of 5534: the swap freed 15 lines and took none. `Loupe.svelte` is unchanged in length. I did not lower the ceilings.

## What is NOT done in this step (and why)

- **The banner's renumbering** (the review's cut-order item): the banner still lists the PRINT's bars («m. 14 · to check») after the singer divides or joins one, while the Loupe's tag for a listed bar shows the singer's number. Until it is renumbered the two can differ by the number of bars divided before that bar. Called out here, left for the end of the lane, because it is the first thing the brief lets go.
- **`entered.measureIndex` in reading bars** (Fable finding 11): B5.
- **The bar answers** (`bar-answers.ts`, fingerprint-keyed by bar): the review marks them DEGRADES SAFELY; `bars-to-confirm.ts` and `offers-for-a-bar.ts` have no caller in the page (grep of `+page.svelte`, no match), so there is nothing to wire.

## Tests

`bar-layer.test.ts` (6): on the fused fixture one barline gives the song 8 bars, numbered 1 to 8; the Loupe's bars 4 and 5 both read print bar 4, bar 6 reads 5, bar 8 reads 7; with no mark every label is itself. `loupe-print.svelte.test.ts` (+1): the tag and the list follow the print's number while the tag shows the singer's. 

## Gates at this commit

| gate | result |
|---|---|
| 1 `pnpm test:phonology` | 456 passed |
| 2 `pnpm test:dictionary` | 248 passed |
| 3 `pnpm --filter @ilya/web check` | 0 errors, 12 warnings |
| 4 `pnpm --filter @ilya/web test` | 4747 passed, 1 skipped (260 files; the baseline's 4707 + 40 new) |
| 5 `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped |
| 6 `pnpm test:blurb` | 168 passed |
| 7 `pnpm test:integration` | 125 passed |
| 8 `pnpm ratchets` | OK |

## What I could not establish

- A walk of the page in a browser: nothing here was drawn. The Playwright projects run at B3, the first step with a control to press.
- Whether the Loupe's own bar number can ever fail to equal `Measure.number` in the song (`BarLayer.labelOf` takes the number text, the index+1 being the fallback, as the page did).
