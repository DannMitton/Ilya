# MEMO. The tessituragram, r2

**Claude Code, 2026-09-23, `Shane` at `0ccda31`, uncommitted. WRITTEN, not DONE.**

## Gates

All five at baseline (216, 235, 0 and 12, 1395, 583). Three tests rewritten, none added.

## Files

- `insights.ts:170`, `:512`: one row per MIDI number; time from `byPitch`, names from the performance-order vocal line's spellings. `:580`: `formatSecondsFine`.
- `Tessituragram.svelte`: rewritten.
- `InsightsPane.svelte:337`, `:381`, `:410`: numbers gone, vowel chart in.
- `i18n.ts:1521`: the new heading.

## Seen rendered, both languages

- **Accidentals:** Sunless 1 shows C♯3, F♯3, A♭3, B♭3, and C♯4 in rose. Sunless 2 shows C♯2, F♯2, A♭2, B♭2, C♯3, and E♭3. Ledger lines are named, for example E2, C2, and A1.
- **None:** `b2-tuplets` (e16 harness): every bar 4.4 px, no rose names, no lyrics so no chart.
- **Dark bars:** "m. 16 · [o]" on Sunless 1, and "m. 11 · [i]" and "m. 9 · [i]" on Sunless 2 ("mes." in French).
- **Chart order:** [i] [e] [ɪ] [ɨ] [ɛ] [ɑ] [ʌ] [o] [u]. [a] is unsung, so it does not print. Sunless 2 prints "0.5 s" and « 0,5 s ».
- **Sunless 1, page one:** 803 against 931 (English), 820 against 917 (French). The taller chart moved to page two by measurement in both.

## Chromatic threshold

Half a step must clear a 3 px bar plus 1 px, so where such a pair is sung the stave step grows from 7 to 8 px. Sunless 1 and 2 both do.

## NOT ESTABLISHED

- Two findings on one pitch: no fixture has it; unit-tested, not seen.
- An enharmonic row name such as "A♯3 / B♭3" may collide with the neighbouring line name. Not seen.
- Without a tempo, the chart prints percentages under a heading that says "Seconds".
