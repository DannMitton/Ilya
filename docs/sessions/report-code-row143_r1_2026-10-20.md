# Report: row 143, one credit in all three footers

Branch `cloud-lane-12`, after row 142 (`954c14d`). Brief: batch A r2, row 143.

## The diff, by file

- `apps/web/src/lib/i18n.ts` (`footer.attribution`, about `:910-912`): the LiederNet clause is gone in both languages (English ", test text via <a ...>www.lieder.net</a>"; French ", textes d'essai via <a ...>www.lieder.net</a>", the apostrophe as the file has it, `’`). The period after the licence link now closes the sentence. Nothing else in the string changed; no French written.
- `apps/web/src/lib/insights/insights.ts`: `LIEDER_CLAUSE` and `strikeLiederClause` removed (21 lines).
- `apps/web/src/lib/insights/InsightsPane.svelte`: no `attribution` const, no import of `strikeLiederClause`, and its three `PageFooter` calls (about `:592`, `:605`, `:627` before) pass no `attribution`.
- `apps/web/src/lib/components/Paper/PageFooter.svelte`: the `attribution` prop, its destructuring, and its comment are removed; the footer prints `t('footer.attribution', language)` as it is.
- `apps/web/src/lib/insights/insights.test.ts`: the N.127 foot test and its import are deleted (the brief's item 5).
- `apps/web/src/lib/components/footer-credit.test.ts` (new, 3 tests): the string holds no "lieder.net" in either language and keeps "kaikki.org" and "4.0</a>). "; the sources of `PageFooter.svelte`, `InsightsPane.svelte`, `MarkupPane.svelte`, `TitlePage.svelte`, and `SubsequentPage.svelte` pass no `attribution` and name no `strikeLiederClause`; `GuideContent.svelte` still carries the LiederNet paragraph in both languages (the "Texts." paragraph at about `:585` and « Textes. » at about `:289`).

Each document's colour on the line is unchanged: the hairline accent is still each page's own prop (`hairlineAccent` on every `PageFooter` call); I changed nothing there.

## Gates

phonology 267, dictionary 248, blurb 145, integration 55, web-test 2892 (2892) (2890, one test deleted, three added), web-check 0 errors and 12 warnings, score-parser 775 passed and 5 skipped (780), ratchets OK.

## Shared numbers

Not a number change. One string, `footer.attribution`, now serves Text, Markup, and Insights. `TitlePage.svelte` and `SubsequentPage.svelte` (Text) already passed no override.

## Could not establish

- **That the Guide renders the LiederNet paragraph in both languages in the browser.** The test reads the source of `GuideContent.svelte`; I did not open the Guide.
- **No picture of the three footers.** The brief asked for none; I did not take one.
- **The footer's colour per document** is read from the code (each page's `hairlineAccent`), not measured on a render.
- `InsightsPane.svelte`'s ceiling in `scripts/ratchets.json` (1351) is far above its length (760); `pnpm ratchets` suggests tightening it. I did not change it.
