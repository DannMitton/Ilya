# Report: row 165, step 2, every site moves to a token (r1, 2026-11-01)

Branch `cloud-lane-23`. 41 files changed (see `git show --stat`), plus this report. Every site in the step 0 table is either moved to a token, left on purpose (listed below), or deferred to step 3 (the renderer). Re-grep after this commit, by the step 0 command: the only old values left in non-test source are the three renderer lines (`staff-renderer.ts:31,93,890`) and `--surround-voice #D8D0E0` (`app.css:177`, `contrast.ts:127`), which the review said to leave.

## What moved

- **Tokens, aliases deleted.** The one-commit aliases from step 1 are gone: no `--*-chip`, `--umber*`, `--sage-deep`, `--sage-gloss`, or `--terracotta` remains anywhere (grep, `apps` and `packages`).
- **Fallback literals.** Every `var(--x, #old)` is now `var(--x)` or the right step.
- **`rgba()` forms (24 sites in 9 files, plus `ScoreUploader` and `FitTable`).** Each is `color-mix(in srgb, var(--family) N%, transparent)` with the same percentage as before.
- **Coloured text on paper uses the ink step**, the 15:24 ruling. That covers the census sites and a set the hex census cannot see (below).
- **Learn and Guide headings.** `+page.svelte` "Tab-scoped heading colours" now paint `--slate-ink` and `--cobalt-ink`; the stale pointer in `ReadingPaper.svelte` ("`+page.svelte:3051-3061`") is repaired by naming that rule, as CONTRACT §4 asks. The h3 rule for Guide stays the band (`--cobalt`).
- **`.band-deck`** is upright, 18.7px, weight 700, white (`ReadingPaper.svelte`). The chapter title keeps `#fdfbf6`, which measures 3.27 on cobalt, so it still passes as large text; chapter bands exist only on Learn (slate) and Guide (cobalt).
- **Drawer section headers (Piece, Input, Voice)** take `--F-head` with the label in `--F-ink` (Piece cobalt head `#B9CBEB`). Voice's header is `.group-score .group-band` and also `.takeover-band` (found in step 0). The band's focus rings and the takeover Back button were white-on-band and would have vanished on a light head, so they now use `currentColor` and `inherit`.
- **Language pill** (`HeaderBar.svelte`): one rule on `--tab-jewel`, white text. Each bar sets its band and its jewel once.
- **Running headers and titles** (`MarkupPane`, `InsightsPane`, `TitleHeader` defaults): text props take the ink (`var(--lavender-ink)`, `var(--rose-ink)`, `var(--sage-ink)`); rule and hairline props take the band token. The pin in `one-head-one-foot.test.ts` follows.
- **Theme colour.** `app.html:9` and `manifest.webmanifest:8-9` (`background_color` and `theme_color`) are `#7D9D76`, equal to `--sage`. (Step 4's guard will assert they agree.)
- **INSIGHTS bars** (`Tessituragram`, `PitchSeconds`) take `--rose-jewel`, per Dann's ruling 1; passaggio lines stay `--rose-ink`.
- **INPUT's active Poem | Lyrics side** (ruling 3): not touched; row 163 builds it.

## The 2026A badge: Dann's ruling cannot be met as written (needs his eye)

His ruling (2026-11-01 12:45): veil at 22 percent of the family's jewel, white text, at least 4.5:1 on all five. **Those two numbers contradict.** White text on the band with a 22 percent jewel veil, computed (WCAG 2.2, sRGB):

| Family | Veil at 22 percent | Veil at 57 percent (shipped) | Composite at 57 percent |
|---|---|---|---|
| sage (TEXT) | 3.49 | **4.53** | `#5D7F55` |
| lavender (MELODY) | 3.73 | 4.86 | `#8265A1` |
| rose (INSIGHTS) | 3.73 | 4.82 | `#926670` |
| cobalt (GUIDE) | 3.97 | 5.21 | `#4B6CAB` |
| slate (LEARN) | 6.11 | 7.76 | `#3D556A` |

I shipped **57 percent**, the smallest whole percent that clears 4.5 on all five (sage is the limit). It is one number in `HeaderBar.svelte` (`.sigil-version`). The cost is that the pill is a clearly darker chip rather than a faint veil, which is not what he saw on 2026-10-30. His call: keep 57 and the 4.5 floor, or return to 22 and accept 3.49 to 3.97 on four bars. The badge text is now full white (was 0.8 alpha), and the five per-tab rules (three of them literals) are one rule.

Also true and not changed: the 22px weight-400 sigil name is white on the band at 3.02 (sage), 3.20, 3.20, 3.36, and 5.27 (slate), so it fails AA as non-large text on four bars (review amendment 1.7). He ratified it by eye; step 5 will show the table.

## Sites the hex census could not see, and what I did about them

A hex grep misses `color: var(--sage)` and `background: var(--sage)` with no fallback. Those would have left words in a band colour on paper, which is the exact defect (2.79 to 2.91:1) the ruling fixes, so I moved them in the same step. This goes beyond the step 0 table; it is the ruling's own scope.

- Text colour to ink: `TitleHeader.svelte` (`.logo`, `.logo-version`, and the `versionAccent`/`markAccent` defaults), `AnalysisStation.svelte:134`, `ProfileSwitcher.svelte:472`, `CalibrationWizard.svelte:1692,1772,1950,2084`, `OutsideNote.svelte:86`, `WordStack.svelte:298` (the gloss line, was `--sage-gloss`) and `:309`, and the `InspectorPanel`/`SearchableSelect` rules that were already in the census files.
- White-text fills to jewel: `InspectorPanel.svelte` (`.dict-button`, `.yo-sigla.is-yo`, `.stress-circle.is-stressed`), `IntakePanel.svelte:849`, `ProfileSwitcher.svelte:521`, `CalibrationWizard.svelte:1758,1866`, `VoiceAnchor.svelte:114`, `TranspositionDock.svelte:330,413`, `TranspositionRuler.svelte:230,281`, `InstallPrompt.svelte` (primary button), `TempoControl` and `ClefControls` (active states).
- Left as the band (not text, not carrying words): dots, bars, progress fills, borders, outlines, and rules, for example `VoiceAnchor.svelte:77`, `AnalysisStation.svelte:189`, `InspectorPanel` lips, `CalibrationWizard.svelte:1825`. **Not ruled, so not changed:** focus outlines stay on the band token (`outline: 2px solid var(--lavender)` and the sage ones). They measure about 2.6:1 on cream, as the old values did (about 2.7); I did not invent a jewel focus ring.

## Judgement calls (DESK DEFAULT, each reversible)

- `SingerBlock` rose bar: BEFORE `--rose-head`, UNDER `--rose-wash` with a `--rose` ring, WITHIN `--rose`, ABOVE and PAST stay `--rose-ink`. The GUIDE highlight pair is `--rose-desk` with a `--rose` edge in both the cell and its legend swatch.
- Dictionary button: base `--sage-jewel`, hover and expanded both `--sage-ink` (they were two different darker steps before; the ratified palette has only the one step left).
- `ScoreUploader` denigma banner (`#7c6bb0`, commented "lavender"): now the `--lavender` band.
- Not touched, flagged: `#ebeee8` (`.gt-cursive` cell background in `+page.svelte`) is a sage tint not on any list.

## Things the measurement found that Dann should see

1. **INSIGHTS bars lose their "finding" cue.** `--rose-jewel #7C4E59` and `--rose-ink #73414E` are 1.19:1 apart. `Tessituragram.svelte:154` draws a bar with a finding in ink and the rest in the bar colour; with the ruling-1 jewel the two read as the same colour. Jewel on cream is 5.71 (passes as a graphic), but the distinction is gone. I did not invent a replacement. Options for him: a different cue (outline, pattern), or the ink for ordinary bars and a lighter step for findings.
2. The Pacifier's captured outline went from 2.28 to 2.14 against its band (step 1).

## Gates after step 2

- web test: 3718 passed, 1 skipped (3719). web check: 0 errors, 12 warnings in 5 files. `pnpm ratchets`: OK.
- **Ratchet counts, before and after, for the zero-slack files:** all unchanged at ceiling or below: `Drawer.svelte` 1990 to 1975, `CalibrationWizard.svelte` 2124 to 2112 (both can be lowered; I did not), the rest unchanged. No ceiling raised.
- French: no change.

## Not established

- Whether the PNG icons should move to the new sage (step 0).
- Which of `--lavender-ink` or `--lavender` the WITHHELD sigla should use: step 3.
