# Report: consistency batch 2, step 4, the guard (Code, cloud lane, r1, 2026-11-02)

Read at: branch `cloud-lane-27`, parent `d8fdba31` (step 3). Working tree clean before the step.

## What changed, file by file

- `apps/web/src/lib/no-fit-name.test.ts` became `apps/web/src/lib/retired-names.test.ts` with `git mv`, then was rewritten (20 tests). Row 171 has not run, so this batch lands first, as review amendment 8 asks; the desk amends row 171's brief.
  - It reads every record's `retired` patterns from `names.ts` (17 records, 17 patterns) and fails on any of them on three surfaces: every `i18n.ts` value (a pattern applies to its own language's values); `LearnContent.svelte`, each language branch alone with comments stripped (same rule); and the four legend files (every pattern, because they are English but quote French). A pattern that sets `surfaces` is read only on those; none does today.
  - The GUIDE is read for one pattern only, `\bFit\b`, under the constant `GUIDE_UNTIL_ROW_171`, with today's two figcaption exceptions (`KNOWN_FIGCAPTIONS`, `stripFigcaptions`, and the figcaption test all stay). The comment says row 171 deletes the constant and reads every pattern. The GUIDE has 36 hits across 16 patterns (review, section 1), so the full surface is row 171's.
  - `EXEMPT_KEYS` is now a record of key and reason: `input.transcribe`, `input.transcribeLoading`, `meta.heading`, each with one clause (unread; batch 4 removes the keys and the entries together). A test says the keys still exist.
  - The legend exception list is keyed by file and a substring the line contains, never a line number, each with a reason. It holds three: `AGENTS.md` and `ARCHITECTURE.md` "shown on screen as Fit until 2026-09" (history), and `AGENTS.md` "paraphrase-then-*Fit:*" (the Gould extraction's own label). A test fails if a substring matches no line or more than one; another pins the list's length at three.
  - The Names table in `ARCHITECTURE.md` quotes retired words on purpose, so the guard blanks the final (`retired`) cell of that table's rows before scanning. `names-table.test.ts` keeps that cell equal to `names.ts`, so it cannot grow quietly. This is a structural exception the review did not foresee; it is in the test's comment.
  - The in-test control: a bare and a phrase pattern against a string that must match and one that must not (`Fit` against "a good fit for you" and "Fitzgerald, Profit"; `the Paper` against "a paper document, the page"), the `surfaces` rule, and the table-cell blanking.
  - Not-vacuous checks: i18n English over 5,000 characters and naming INSIGHTS, French naming APERÇUS; LEARN each branch over 5,000 characters and naming Grayson (LEARN never names INSIGHTS, so the review's wording does not fit it); GUIDE branches over 5,000 characters and naming Insights and Aperçus; each legend file over 5,000 characters and naming INSIGHTS or APERÇUS.
- `apps/web/src/lib/insights/ratified-lines.test.ts`: the ratified pins moved here, which already pins Guide prose from source. Moved as they stood: the forecast-heading pin, the thirteen A, B, and C passage pins, the French-colon check, and the struck-attribution check (16 tests). The three literal U+00A0 characters in the colon check became the escape ` `. One comment now names `retired-names.test.ts`. The Guide still says "What Insights forecasts" and "Ce que prévoient les Aperçus", so the pin stays as it was; row 171 changes the heading and the pin together.

## Positive control: three plants, one per code path, each removed

Each was run against the real file and restored from git (`git status` clean afterwards; 20 of 20 pass).

1. `i18n.ts`: `'tab.learn'` English changed to `'LEARN Fit'`. Failed: `no i18n.ts value says a retired en name`, with `tab.learn [insights: \bFit\b]`.
2. `LearnContent.svelte`: "The Paper shows Markup. " planted at the start of the first English paragraph. Failed: `LEARN, en branch ... says no retired name`, with `23 [melody: \bMarkup\b]`. (The phrase `the Paper` is lower case in the pattern, so "The Paper" was not caught and "Markup" was.)
3. `README.md`: "The Paper is Markup. " planted at the start of a paragraph. Failed: `README.md says no retired name`, with `README.md:9 [melody: \bMarkup\b]`. (The in-test control also failed, as it must, because the planted file already had a hit.)

Not planted: a stale legend exception (a substring that matches no line). Its test is two lines and I did not exercise it.

## What the guard found on the cut

Nothing remained in `i18n.ts` values beyond the two unread keys (exempt), none in LEARN, and none in the legend after step 2, apart from the three excepted lines. I checked the `\bFit\b` pattern's own caveat (a sentence-initial verb "Fit" would trip it): no such sentence exists on the three surfaces.

## Exempt keys and why, for batch 4

`input.transcribe` and `input.transcribeLoading` (unread; N.145; `IntakePanel.svelte` records it), and `meta.heading` (unread; audit A.3). Batch 4 removes each key and its entry in `EXEMPT_KEYS` together.

## Elsewhere

`docs/memory/QUEUE.md` rows 97 and 171 still name `no-fit-name.test.ts`. I did not touch `docs/memory/`; the desk should update them.

## The eight gates

Phonology `Tests  407 passed (407)`; dictionary `248 passed (248)`; web-check `svelte-check found 0 errors and 12 warnings in 5 files`; web-test `Tests  3838 passed | 1 skipped (3839)` (3826, minus the 24 old guard tests, plus 20 new and 16 moved); score-parser `785 passed | 5 skipped (790)`; blurb `148 passed (148)`; integration `98 passed (98)` (after `svelte-kit sync`); `ratchets: OK.`

## Not established

Nothing new in this step.
