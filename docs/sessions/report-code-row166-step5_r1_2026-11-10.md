# Report: row 166, step 5, the ring says placeholder (Code, cloud lane, r1, 2026-11-10)

Branch `cloud-lane-39`. From Fable 5.2's as-built review, amendment 39-2. `origin/cloud-lane-38` was fetched at the start and is already merged (no change since `534d998`).

## The fault, as reviewed

For a placeholder voice the vowels block printed a solid "17% of your singing lies past the turn" (generic baritone, song 1), though the page's key says findings that rest on a placeholder are drawn dashed. `vowelTurns` sums `profile.fR1`, surrogates included (`singer-page.ts:186-203`), and the ring carried no placeholder mark where the rows did. Confirmed before the change, on the lines named.

## What changed

- `insights/singer-blocks.ts`: the `vowels` block type gains `ringPlaceholder?: true`; it is set when any row has `placeholder` (a row has it only where it has a turn and its vowel is a placeholder, so this is "any row with a turn is a placeholder").
- `insights/SingerBlock.svelte`: the `ring-past` circle takes `class:dashed` and `data-placeholder="true"` from that flag, as the row tracks do. A circle's stroke cannot take the rows' CSS dashed border, so the dashes come from the arc's own `stroke-dasharray` (`arcDash`: 4 on, 3 off along the same arc length, then the gap to the end of the circle). The printed percentage, its text, and the arc's length are unchanged. No CSS rule was added; the class is the hook.
- No new string. `insights/placeholder-profile-pages.test.ts`: two tests on song 1, run through the real chain into `singerBlocks`: a generic baritone's vowels block has a ring and `ringPlaceholder` true; a voice with ten sung vowels (declared bass) has a ring and no flag.

## Screenshot

`docs/sessions/row166-screens_2026-11-09/baritone-ring-en.png`: the generic baritone, English, from a first visit with no stored data, as in step 4. The ring reads 17% and its past arc is drawn in dashes, as the rows beside it are. The live element had `class="ring-past ... dashed"`, `data-placeholder="true"`, `stroke-dasharray="4 3 4 3 4 3 4 3 4 201.06..."`.

## Gates, against the start of step 5 (the end of step 4)

| Gate | Result |
| --- | --- |
| 1 phonology | 456 passed, as before |
| 2 dictionary | 248 passed, as before |
| 3 web check | 0 errors, 12 warnings, as before |
| 4 web tests | 257 files, 4735 passed, 1 skipped (was 4733: my two new tests) |
| 5 score-parser | 785 passed, 5 skipped, as before |
| 6 blurb | 168 passed, as before |
| 7 integration | 125 passed, as before |
| 8 ratchets | OK; no ceiling touched |

Playwright was not run for this step; the brief did not ask for it.

## What Code could not establish

- **How the dashed arc reads at print size or on the phone.** I looked at the desk layout only. At a 12-unit stroke, 4-on 3-off dashes read clearly at 80 px; the thinner phone and print renderings are not seen.
- **Whether dashes on the arc alone are the look Dann wants**, beside rows drawn as outlines. It is the only dashed form a stroked arc allows without redrawing the ring; an outlined arc would be a drawing change.
- **The legend swatches** ("before the turn", "past the turn") stay solid for a placeholder voice. Not in the brief; unchanged.
