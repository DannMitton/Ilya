# Report, Code: N.202 Step 2 (the sigil and the guard)

2026-11-15, lane `cloud-lane-58`, on top of Step 1 (`docs/sessions/report-code-n202-step1_r1_2026-11-15.md`). Pictures are in `report-code-n202-pictures/`, files named `step2-…`. Every picture below was looked at by me before this report was written.

## What was built

- `HeaderBar.svelte`: the `sigil-version` span and its whole rule are gone; `aria-label` is "Ilya"; `position: relative` is off `.sigil`. Comments made false were rewritten: the one at the jewel (it said the badge reads the jewel; only the language pill does), the one above `.header-bar.tab-markup`, the one above `.header-bar.tab-insights`, and the section heading, which now reads "The sigil: [Ilya] and nothing else (N.202)". The `--tab-jewel` variable stays: the language pill still reads it.
- `Paper/TitleHeader.svelte`: the `logo-version` span, the `versionAccent` prop (its doc comment, its default in the destructuring), and the whole `.logo-version` rule are gone; `position: relative` is off `.logo`. The `markAccent` doc comment now says "the sigil" and that it carries the name alone. Class names that say `logo` stay.
- Callers: `MarkupPane.svelte` loses the two `versionAccent=` lines and nothing else; `InsightsPane.svelte` loses one. `versionAccent` appears nowhere under `apps/web/src` (a test holds that).
- `colour-story.test.ts`: the test of the old badge's contrast and its helper `over` are removed (they tested the veil that no longer exists).
- New `components/sigil.test.ts` (3): the app bar's label is "Ilya" and neither component's markup holds a year and letter, nor the two class names; the page's sigil ends at the closing bracket; no file under `apps/web/src` names the retired prop.
- New `version-guard.test.ts` (8), D5: positive controls for the three forms found today (the attribute, the footer's string with its no-break space, the bare span), a control that any year and letter is caught (`2027c`, `2026z`), negative controls (`2026`, `v2026a`, `2026ab`, `2026a1`, `A2026a`, a plain citation year, an ISO date), a sweep of the string table by value in both languages, and a scan of every non-test text file under `apps/web/src` with `version.ts` aside. The allow list `ALLOWED` is empty. The guard's own limit is written in it and tested: the source scan cannot see ` 2026a` in `i18n.ts` (the `0` of the escape precedes the year), which is why the table is also swept by value.
- **The guard was shown to fail.** I put `<!-- 2027c -->` into `HeaderBar.svelte` and the old ` 2026a` back into the footer string, ran the tests, and three failed (the app-bar test, the string-table sweep naming `footer.attribution (en)`, and the source scan). Both files were restored from copies; the working tree was then clean of that change.

## Pictures, each looked at

1. **The app bar, five destinations, English only, 1440 x 900 and 390 x 844** (`step2-bars-1440-…png`, `step2-bars-390-…png`; before at left, after at right; TEXT sage, MELODY lavender, INSIGHTS rose, LEARN slate, GUIDE cobalt). Before: the sigil with a small "2026A" chip under the closing bracket. After: [Ilya] only, at the same left position (about 20 px from the edge) on all five bars. The bar is a fixed 48 px; the brackets and the name sit centred in it (brackets from about 14 to 34 px of 48). The language pill and the bar colours are unchanged.
2. **The head of page 1, TEXT, MELODY, INSIGHTS, English and French** (`step2-heads-en-…png`, `step2-heads-fr-…png`). The "2026A" under the sigil is gone on all six. The title, the byline, the rule, and the first system sit where they did. **A note on my own pictures:** my first MELODY head was covered by the "Voice line as written" clef popover (open by default in the harness, before and after alike). I retook MELODY with the popover dismissed, from a `git stash` for "before" and the working tree for "after", and the pictures in the report are those.
3. **The foot of page 1, TEXT, MELODY, INSIGHTS, English and French** (`step2-foots-en-after.png`, `step2-foots-fr-after.png`). All six read "ILYA 2026B" in the ratified sentence. MELODY and INSIGHTS print "PAGE 1 OF 2" in English and "PAGE 1 SUR 2" and "PAGE 1 SUR 3" in French; the page counts differ by language because the content does, and Step 2 changes no word of it (the string is the same length).
4. **A printed PDF of one TEXT page, letter** (`step2-print-text-after.pdf`, 612 by 792 pt, one page; `step2-print-text-page1-after.png`; `step2-print-sigil-before-left-after-right.png`, both rendered at 200 dpi). The printed sigil reads [Ilya] with no version; the title and byline stand where they did; the foot reads 2026B.

**Calm Authority, as the pictures read.** In the bar, with nothing under the name, the sigil reads centred and settled: I see nothing off-centre or loose. On the page, the empty 8 px margin under the sigil (`TitleHeader.svelte`, `.logo { margin-bottom: 8px }`, unchanged) leaves about 13 px of space between the sigil's baseline and the title's cap height at 1x (measured by eye on the 2x picture, not by script). It reads as a normal gap, not a loose one. I changed no spacing. Whether the 8 px was sized for the version is NOT ESTABLISHED. The desk decides if the gap above the title wants to tighten.

## Nothing else moved: the measure

The visible `.title-header` `offsetHeight` in the live render at 1440 px, before and after (`step2-title-header-heights-before.json`, `…-after.json`): TEXT 106 and 106, MELODY 155 and 155, INSIGHTS 128 and 128, in English and in French; the `.logo` box 67.31 by 27 px before and after. The four e2e files the brief names pass, run in the desktop project against `pnpm dev`: `markup-pages-lose-no-bars`, `pages-without-gaps`, `print-pages`, `insights-page` (37 tests, 11.0 minutes). Lane 57's returning-browser storage state is not in this tree, and the harness opened a fresh browser each time; the welcome sheet is not in this lane.

## Gates after Step 2

| Gate | After Step 1 | After Step 2 |
|---|---|---|
| 1 | 462 passed (462) | 462 passed (462) |
| 2 | 248 passed (248) | 248 passed (248) |
| 3 | 0 errors, 12 warnings, 5 files | found 0 errors and 12 warnings in 5 files (no unused-selector warning added) |
| 4 | 5826 passed, 1 skipped (5827) | **5836 passed, 1 skipped (5837)** (+3 sigil, +8 guard, −1 old badge test) |
| 5 | 842 passed, 5 skipped (847) | 842 passed, 5 skipped (847) |
| 6 | 178 | 178 passed (178) |
| 7 | 159 | 159 passed (159) |
| 8 | OK | ratchets: OK (`InsightsPane.svelte` now 743 of 744; `scripts/ratchets.json` untouched) |

## Not established

- Whether the 8 px under the page's sigil was sized for the version.
- The e2e suite's other files, and the phone project: they run at Step 5.
