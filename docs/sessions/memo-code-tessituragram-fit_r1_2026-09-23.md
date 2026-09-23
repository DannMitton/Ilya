# MEMO. Page one fits by measurement, r1

**Claude Code, 2026-09-23, `Shane` at `1dfee32`, uncommitted. WRITTEN, not DONE.**

## Gates

Unchanged from the last build: 216, 235, 0 and 12, 1395, 583. No tests added.

## Files

- `InsightsPane.svelte:171` to `:234`: the fit loop; the old comment is gone. `:393`: `crossingsUncounted` only in the table.
- `i18n.ts`: the three `insights.phonation.zone*` strings are deleted. Nothing read them.

## Machinery

An effect reads the squircle's and foot's offsets after each render, plus `offsetHeight` bindings as `runningHeight` uses. Bindings alone failed: a hidden tab runs no ResizeObserver, and the bound height stayed at 60 against 731.

## Seen rendered, page one's end against the foot

- Sunless 1, English: 886 against 931. The vowel list stays on page one.
- Sunless 1, French: the vowel list moves, then 850 against 917.
- Page two prints for Sunless 1 only to name untrusted measure 17.
- Worst case, French, on Sunless 2, with qualifiers and third lines injected: finding 2 moved to page two as ②, with the remainder line. Page one still ends 107 px over (969 against 862), and the overflow was logged. The two qualifiers alone add 169 px.

## NOT ESTABLISHED

- What gives next when the French qualifiers overflow with one finding left: your call.
- The loop never steps back up within one view; a new score or language restarts it.
- The overflow line logs once per re-measure.
