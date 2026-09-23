# MEMO. The tessituragram (N.123 part 1, N.127 increment 2), r1

**Claude Code, 2026-09-23, `Shane` at `1dfee32`. WRITTEN, not DONE.**

## Gates

Gates 1 to 3 are at baseline. Gate 4 is 1395, up 3 (`insights.test.ts:242`). Gate 5 is 578 plus 5 skipped (583), up 2 (`clef-select.test.ts:86`).

## Files

- `packages/score-parser/src/clef-select.ts:76`, `index.ts:60`: `chooseClefForSpan`. `chooseClef` is unchanged in behaviour.
- `apps/web/src/lib/shane/insights.ts:166`, `:189`, `:509`, `:524`, `:674`
- `apps/web/src/lib/shane/Tessituragram.svelte`, new. It and this memo need `git add`.
- `InsightsPane.svelte:178`, `:315`, `:346`, `:415`
- `i18n.ts:1527`, `:1533`, `:1543` to `:1554`

## Observed, stand-in voices, Sunless fixtures

- **Page one, Sunless 1.** English ends at 813.3 with the foot at 930.7. French ended 5.2 px over, so the vowel list moved to page two (your DESK DEFAULT). French now ends at 850.8 with the foot at 916.9. The unit is 235.3 px against the 190 px reserve.
- **Worst case: 213.9 px over** (1075.7 against 861.8), or 190.4 without the remainder line. Built by injecting content into the live page. I stopped there and shrank nothing.
- **Page two** now prints on every score with a vowel list.
- **Tempo:** point, Sunless 2, longest bar "3 s". Range, Sunless 1, "9 s to 15 s". None, Sunless 6, "15%" with the quaver caption.
- **No passaggi:** no lines, no shares. `crossingsUncounted` prints in the unit and in the table.
- **No findings:** half opacity, no numbers, caption drops its second half.
- **Shared steps, seen rendered:** Sunless 1 splits four steps, including B♭3 and B3.
- **Clef:** bass range G2 to F4 gives bass. Soprano range C4 to A5 gives treble, Sunless 6 on ledger lines far below.

## NOT ESTABLISHED

- What leaves page one next: your call.
- Whether the clef should follow the singer when the song sits far under the stave. Taste.
- The heuristic never returns treble-8vb, so a tenor gets plain treble.
- A passaggio line through a split step is written but not seen.
- The field and band opacities (0.45 and 0.26) come from the redraw. JUDGEMENT.
- The old `insights.phonation.zone*` strings are unrendered, still in the file.
