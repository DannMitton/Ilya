# Report, lane 75, item 1: the VOICE pane's borrowing sentence comes out

r1, 2026-11-19 (session of 2026-11-20 UTC), by the cloud lane. Branch `cloud-lane-75`, cut from `Shane` at `3bff3358` as the first action. Brief read in full: `brief-code-lane75-pane-cut-and-begin_r2_2026-11-19.md`, md5 `e254d48b34ba43c45d8f2a6d030faaf1` (checked before any change). Working tree was clean at the cut. Environment: Linux, node 22.23.5, fresh `pnpm install --frozen-lockfile`; numpy and scipy are NOT installed.

## What changed

`apps/web/src/lib/components/Drawer/voice-pane.ts`:

- `borrowingSentence` and `borrowingFor` removed, with their comments.
- `below-core` branch: reads `belowCoreText('calib.pane.belowCore', i.core, language)` alone, for every type.
- `typed-generic` branch: reads `calib.pane.typedGeneric` filled with `borrowedStaffLabel`, for every Tier 1 type with a placeholder profile. The comment now says so.
- The header paragraph "A CONTRALTO, COUNTERTENOR, OR BASS-BARITONE WITH FEWER THAN FIVE STABLE CORE VOWELS" removed.
- `isBorrowingType` import removed (the one import left unused). `PERSONAL_CORE_MIN`, `t`, and `fillVoiceType` are still used.

Not touched: `analysis/placeholder-line.ts`, `markup/MarkupPane.svelte`, `insights/InsightsPane.svelte`, both pickers, `i18n.ts`. No string added, removed, or retranslated.

## Tests, the five files of section 2

- `voice-pane.test.ts`: the three borrowing rows of `cases` now read the `calib.pane.typedGeneric` sentence for mezzo-soprano, "mezzo and tenor", and bass, in both languages (rows kept). The `BORROWING` record, the `lead()` prefix, and the comment above it are gone; all seven types stay in the loop. The `describe` is retitled "lane 75, item 1: the pane names the staff and gives no reason...". "Nothing sampled" now pins all eight exactly in both languages, and the "no 'The field has not yet published'" assertion (and its French twin) runs for all eight. "Three stable core vowels" pins all eight to `BELOW3_EN` and `BELOW3_FR` alone, with the no-double-space and no-newline assertions kept. The two no-borrowing tests are widened to all eight Tier 1 ids plus `not-sure`, `undefined`, and `castrato`. The "same words as the ratified line" test is replaced by one asserting the words of `placeholder.borrowing` (template split on `{type}` and `{borrowed}`, each piece trimmed, each of three characters or more) appear nowhere in `paneSentence` for a contralto, a countertenor, and a bass-baritone, nothing sampled and three stable core vowels, in both languages. It also asserts the whole written-out line is absent. The `BORROW_EN` and `BORROW_FR` constants stay, now used only as that negative pin, and their comment is repaired. The comment at the old `:27` is repaired.
- `stand-in-borrowing.test.ts`: `'VOICE pane (4.6)'` joins the four-key (in the file, five-key) not-contain-own-name list; the three assertions that pinned the pane to the borrowing line (own name present, `toBe` the line, and the lane 74 comment) are removed. The staff assertion for the pane stays in the first loop. Nothing else in the file touched.
- `e2e/voice-pane.test.ts`: the contralto assertion now reads "Ilya is using generic values for a mezzo-soprano voice until you record your own." Comment repaired.
- `e2e/insights-no-score.test.ts`: NOT edited, and passes (see below).

Search for any other pin of the pane's borrowing sentence outside those files (`paneSentence`, `borrowingSentence`, `borrowingFor`, and both languages' opening words, across `apps`, `packages`, `tests`): the only other hits are `VoicePane.svelte` (calls `paneSentence`, no pin), `i18n.ts` (the string), `insights/ratified-lines.test.ts:451` (pins the template string itself, unaffected), and `e2e/insights-no-score.test.ts` (INSIGHTS, must stay). No test outside the list failed.

## Gates (all eight at baseline)

| gate | result |
| --- | --- |
| 1 phonology | `462 passed (462)` |
| 2 dictionary | `248 passed (248)` |
| 3 web-check | `found 0 errors and 12 warnings in 5 files` |
| 4 web-test | `6739 passed | 5 skipped (6744)`. This is the WITHOUT numpy and scipy figure (neither is installed here). |
| 5 score-parser | `904 passed | 5 skipped (909)` |
| 6 blurb | `178 passed (178)` |
| 7 integration | `159 passed (159)` |
| 8 ratchets | `ratchets: OK.` |

Gate 4 arithmetic: this item adds 0 tests and removes 0 net. One test ("the pane takes the same words...") was replaced by one ("the pane carries none of the words..."), and every other edited test keeps its count. 6744 total before and after.

I ran the gates with the package commands directly, since `~/Downloads/ilya-ship.sh` is the maintainer's and is not in this container. Gate 3 is `pnpm --filter @ilya/web check`, gate 4 is `pnpm --filter @ilya/web exec vitest run`.

## Playwright (not a gate; run by me)

`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium pnpm exec playwright test --project=chromium e2e/voice-pane.test.ts e2e/insights-no-score.test.ts --trace off`: **32 passed (4.0m)**. That includes `voice-pane.test.ts:86` (the edited contralto assertion) and `insights-no-score.test.ts:65` for contralto in English and French, unchanged and passing: the pages still carry the borrowing line.

## Section 6 and section 8

This item changes no computation. Nothing in section 8 arose for this item.

Side note, not acted on: `scripts/ratchets.mjs` prints that `packages/score-parser/src/musicxml-parser.ts` could drop its ceiling from 1167 to 1166. That file is not this lane's.
