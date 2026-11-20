# Report, lane 75, item 2: the empty live region no longer costs a flex gap

r1, 2026-11-19 (session of 2026-11-20 UTC), by the cloud lane. Branch `cloud-lane-75`. Brief md5 `e254d48b34ba43c45d8f2a6d030faaf1`. Item 1 is commit `92f39c4`.

## What changed

Exactly the CSS the brief gives, in the `<style>` block of each picker, placed before the rule that follows `.vt-hint`:

```css
.vt-note:empty {
	margin-top: -0.3rem;
}
```

- `apps/web/src/lib/voice/VoiceTypeFirst.svelte` (before `.vt-choices`)
- `apps/web/src/lib/voice/VoiceTypeIntake.svelte` (before `.vt-option`)

Each carries a one-line comment saying the region stays in the page for the announcement pattern. The `<div class="vt-note" aria-live="polite">` markup is unchanged in both files, so the announcement pattern is untouched. No string changed.

## Measured, in a live browser (dev server, Chromium, with and without the change by stashing it)

The wizard's welcome screen, a voice with no type set, a tenor chosen, English, 390 by 844, touch emulation on (so `pointer: coarse` gives Begin its 44 px floor):

| | note region height | last choice bottom | Begin top | Begin bottom |
| --- | --- | --- | --- | --- |
| before | 0 | 568.6 | 587.4 | **631.4** |
| after | 0 | 568.6 | 582.6 | **626.6** |

626.6 is the figure the brief names, so the fix worked: 4.8 px (0.3rem) recovered. Without touch emulation Begin is 43 px tall and its bottom reads 625.6; the 626.6 reading needs the coarse pointer.

The VOICE pane's picker (`VoiceTypeIntake`), desk layout 1440 by 900, a tenor stored, the "Tenor" row opened: the gap from the last radio's bottom to the Clear button's top went from 11.2 px to 6.4 px, the same 4.8 px. The empty region's height is 0 in both.

## Gates

Gate 3, `found 0 errors and 12 warnings in 5 files` (baseline unchanged, so the new selector is not reported unused). Gate 8, `ratchets: OK.` Gates 1, 2, 4, 5, 6, and 7 were not re-run for this item: it changes two `<style>` blocks only and touches no test. All eight are run on the final tree and reported in item 4's report.

## Section 6 and section 8

No computation changed. NOT ESTABLISHED, as the brief asks: whether a screen reader announces the picker's note. Nobody has run one, and I did not.
