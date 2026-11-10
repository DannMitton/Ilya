# Report: row 166, step 8, from Fable 5.2's review of steps 5 to 7 (Code, cloud lane, r1, 2026-11-10)

Branch `cloud-lane-39`. Merge of `origin/Shane` at `31a3f55` (lane 40): merge commit `b3c79e4`, no conflict. Step 8's code is `eeafca8`.

## (a) One gentle pointer per page

For a voice that is `adapted.generic`, a finding keeps its dashed rule and its placeholder sentence, less the remedy sentence. New key `placeholder.comment.generic`: EN "This finding rests on a placeholder value for {vowel}." FR "Ce constat repose sur une valeur par défaut pour la voyelle {vowel}." That is `placeholder.comment` character for character, less its last sentence in each language; the comment in `i18n.ts` says so, and I wrote no new words. The i18n index is 1,192 keys, `placeholder.` 8.
- `placeholderCommentSentence(vowel, language, generic = false)` picks the key.
- Both printers take the flag: INSIGHTS' comments (`singer-blocks.ts`, new `BlockInputs.generic`, passed by `InsightsPane` on the existing `placeholders,` line so the pane stays at 744) and MELODY's watch-list lines (`gatedLines`, new fourth parameter, passed `adapted.generic` by `MarkupPane`). You named only INSIGHTS in the sentence, but cited `gates.ts:320-322`, which is MELODY's printer, so I did both.
- Tests: `singer-blocks.test.ts` (generic: the sentence less its remedy, EN and FR, no "sample" or "échantillonn" in either; a non-generic voice with a placeholder vowel: the whole sentence, "sample [u] in vocal fry."), and `gates.test.ts` (the same for the watch-list line).
- Not touched: `placeholder.turns.*` (no remedy in it) and `placeholder.line.*` (the pointer that stays).

## (b) The lede needs a model

`InsightsPane.svelte`: `genericLede(adapted.generic && !!model, ...)`. A generic voice on a page with no score, where there are no findings, prints no lede.

## (c) Two stale comments

`insights/identity.ts` (method line key) and `analysis/analyze-score-adapter.ts` (`composeBroadNote`) now say RATIFIED by Dann 2026-11-10. No other "unratified" remains in `apps/web/src` of mine.

## (d) The placeholder-voice page test

`e2e/pages-without-gaps.test.ts`, last test: a stored voice with `voiceType: 'baritone'` and no formants, French, song 1, MELODY then INSIGHTS. Asserts the page is drawn from placeholder values (the text matches "valeurs par défaut"), nothing reaches a footer on screen and in print (`overlaps`), and printed pages equal sheets on screen.

**It is red here, on INSIGHTS only, and I did not weaken it.** MELODY passes all three assertions. INSIGHTS: nothing reaches a footer, but `page.pdf()` prints **1 page against 2 sheets on screen**. I then measured it directly (dev server, 1440 wide): the placeholder baritone, French and English, and a **calibrated** voice (ten sung vowels, bass, French) all print INSIGHTS as 1 page against 2 sheets, so it is not specific to a placeholder voice. The same measurement printed 3 pages for MELODY of the calibrated voice against 2 sheets (the known `print-pages` red, expected 2, received 3), and toggling the print media emulation changes the count again (1 for every case). So `page.pdf()`'s page count is not stable in this sandbox. Whether this is Chromium 1243 (the build here, not the 1208 the repository expects) or a real print defect on multi-page INSIGHTS is NOT ESTABLISHED. It needs the same test on CI's Chromium.

## (e) Corrections and screenshots

- `report-code-row166-step7_r1_2026-11-10.md` now says the French subtitle is **2 lines at 390** (its picture shows two). My script's height-over-line-height count said 1 there; why it miscounted is not established. The correction is marked in the report.
- The four full-page MELODY screenshots from step 6 (`baritone-melody-en.png`, `-fr.png`, `baritone-melody-raw-en.png`, `-raw-fr.png`) are replaced with new ones from this build (generic baritone, first visit, no stored data). The French one shows the subtitle wrapped whole on two lines, the legend without a filled head, and the broad note with its ratified last sentence. The INSIGHTS pair was re-taken by the same script.

## (f) The eight gates, on the merged tip `b3c79e4`

| Gate | Result |
| --- | --- |
| 1 phonology | 456 passed |
| 2 dictionary | 248 passed |
| 3 web check | 0 errors, 12 warnings |
| 4 web tests | 4772 passed, 1 skipped (the merge brought lane 40's tests; mine add three) |
| 5 score-parser | 785 passed, 5 skipped |
| 6 blurb | 168 passed |
| 7 integration | 125 passed |
| 8 ratchets | OK, no ceiling touched |

## Playwright, the files you named

Chromium: `pages-without-gaps`, `print-pages`, `markup-pages-lose-no-bars`, `insights-page`, `text-header`, `clef-controls`, `singer-paths`, `insights-key-lines`; phone: `e2e-phone/clef-controls`. Run with `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`, `--trace off`: **73 passed, 4 failed** (18.3 minutes).

| Red | Known? |
| --- | --- |
| `insights-page.test.ts:95` the page runs the frame... (`order` `[-1,503,886]`) | Yes: one of the 11 red at the start of the lane and at the end of step 4 |
| `print-pages.test.ts:20` (markup expected 2, received 3) | Yes, the same |
| `singer-paths.test.ts:169` Learn and Guide | Yes, the same |
| `pages-without-gaps.test.ts:227` my new placeholder-voice test (INSIGHTS print count) | **No: new, mine**, see (d) |

"Known" is against the 11 reds I recorded on this lane at the start (step 4's table). I did not run Shane's own list. `clef-controls` (both projects), `text-header`, `markup-pages-lose-no-bars`, `insights-key-lines`, and every other test in `pages-without-gaps` passed.

## What Code could not establish

- Whether the INSIGHTS print count (1 for 2 sheets) is Chromium 1243 or a defect (see (d)).
- The 11-reds comparison above is against my own start list, not Shane's.
- The new generic-sentence wording on a rendered finding: song 1 fires no comment without a typed passaggio (step 2), so no screenshot shows the shortened sentence; it is pinned by the block-level tests.
