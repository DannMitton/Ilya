# Brief: row 172, finish and bring onto today's Shane (Code, cloud, r2, 2026-11-05)

Written by the desk (Opus). r2 applies all eight amendments of Fable's review (`review-fable-two-briefs_r1_2026-11-05.md`, Brief A), in the section "Amendments" at the end, which wins wherever it differs from the steps. Row 172 (TEXT follows INPUT's Poem | Lyrics pill) was built on `cloud-lane-29`, steps 0 to 4, commits `c4584256` to `89357814`, from brief r2 `docs/sessions/brief-code-row172-text-follows-input-pill_r2_2026-11-02.md`. That lane also carries rows 71 and 157, which are NOT part of this brief. **NOT ESTABLISHED beats a complete invented answer.**

## The singer's need

When she taps POEM or LYRICS in INPUT, TEXT transcribes that text, and a quiet line above the sheet names it. Typing a poem must not make TEXT stall by rebuilding on every key.

## Steps

**Step 0, the branch.** Create `cloud-lane-36` from `origin/Shane` (tip `2e3803da` or later). Cherry-pick row 172's five commits in order: `c4584256`, `3c7a93a`, `e359832`, `5628f27`, `89357814`. Resolve conflicts:
- `apps/web/src/routes/+page.svelte` (the desk's evaluation found it near `:4361-4367` on the merge): keep the lane's source line (`TextSourceLine`) AND Shane's `witness={shown}`. Read both sides and say in the report what each line does.
- `apps/web/src/lib/i18n.ts`: count lines and neighbouring keys; keep both sides' keys.
Run the eight gates (as step 0 of the original row recorded them) and both Playwright projects; record every red test and say whether it was red on `Shane` before the cherry-pick.

**Step 1, the quiet pause for POEM.** The phone test `apps/web/e2e/relining.test.ts:95` ("bb") fails because TEXT now transcribes the poem on every key (report `report-code-row172-step2_r1_2026-11-02.md`, "Decision for Dann"). The desk has decided, DESK DEFAULT: option 1. Give the poem witness the same quiet pause before TEXT transcribes it that LYRICS has (find where LYRICS's pause is applied and reuse it; do not write a second timer). The test passes unchanged. Name every other place that times a rebuild of TEXT and say whether it now agrees.

**Step 2, the stale tests.** `apps/web/e2e/text-header.test.ts:56` and `:59` point at the pair the row removed (desk evaluation 2026-11-05 01:3x). Change them to follow INPUT's pill, as step 2 of the row did for the other tests. Change no assertion about the TEXT: POEM / TEXT: LYRICS page header; that header and the quiet line both stay (DESK DEFAULT: the Guide sentence Dann ratified 2026-11-05 08:10 names "a line above the page").

**Step 3, the ratified French.** Seat exactly, with their pins in a test:
- `text.source.lyrics` FR « D’après PAROLES »; `text.source.poem` FR « D’après POÈME » (typographic apostrophe U+2019).
- `GuideContent.svelte`, the poem-and-lyrics paragraph, the last two sentences, EN and FR, replacing what the row wrote and the stale French with its `TODO-FR` comment:
  - EN: To review the authoritative poem itself anytime, choose POEM in INPUT: TEXT then transcribes the whole poem as published, including any words the composer has left out, and says so in a line above the page. Choose LYRICS in INPUT to return.
  - FR: Pour consulter à tout moment le poème qui fait autorité, choisissez POÈME dans ENTRÉE : TEXTE transcrit alors le poème entier tel que publié, y compris les mots que le compositeur a laissés de côté, et le signale par une ligne au-dessus de la page. Choisissez PAROLES dans ENTRÉE pour revenir.
  The FR space before the colon is U+00A0 (OQLF). Source: `docs/memory/OPEN.md`, the two sections "ROW 172" dated 2026-11-05 (on `Shane` after Dann's next commit; the text above is authoritative if they are absent).

**Step 4, gates and report.** Eight gates and both Playwright projects; every red test named with whether it is this row's.

## Rules

Push only `cloud-lane-36`; never `Shane` or `main`; no pull request; Dann merges. Commit and push after each step. One report per step: `docs/sessions/report-code-row172-finish-stepN_r1_2026-11-05.md`, with every claim about code carrying a file and line read.

## Amendments (Fable review, Brief A; these win)

**A1. The conflicts, exactly.** The pick stops twice. At `e3598327` (step 2), `+page.svelte` (conflicted lines about 4360-4365): delete the `TextWitnessPair` line, keep `<Paper … witness={shown} …/>`. At `5628f270` (step 3), `+page.svelte` (about 4361-4366): keep the `{#if witnessDiffer}<TextSourceLine {language} witness={shown} />{/if}` line first, then `<Paper … witness={shown} …/>`; `apps/web/src/lib/i18n.ts` header total: `This file holds 1,141 keys.` (1,139 + the two `text.source.*` keys; `i18n-index.test.ts:52-57` pins it).

**A2. Ratchets.** The pick brings lane 29's lowered ceilings; set `"apps/web/src/routes/+page.svelte": 5586` in `scripts/ratchets.json` (Shane's value) and say so; gate 8 is red otherwise.

**A3. The "bb" test** is `apps/web/e2e-phone/relining.test.ts:95`, not `apps/web/e2e/`.

**A4. Step 1, the poem's quiet pause, concretely.** The one timer is `quietTimer` (`+page.svelte:2512`), scheduled only in `joinText` (`:2533-2561`) off `doc.inputText`; `poemLines` (`:467-469`) is a `$derived` of `doc.publishedPoem` with no timer. Add `let settledPoem = $state('')`; derive `poemLines` from `settledPoem`; in `handlePoemEdit` (`:2384-2391`) set `settledPoem = text` at once unless `how === 'typing'`, and for typing schedule through the SAME `quietTimer` and `QUIET_MS`, with a callback that sets `settledPoem = doc.publishedPoem` and re-asks the join as `:2548-2556` does. Set `settledPoem` wherever `doc.publishedPoem` is restored or reset (song switch near `:3140-3160`; boot restore, find it; `handleClear` `:2113-2122` if it clears the poem). Keep `witnessDiffer` (`:462`) and the source line on the live `doc.publishedPoem`. Name the other rebuild timings: `adoptPoemLines` (`:2373-2376`), `poemOffer.onPoemEdit` (`text/poem-offer.svelte.ts:134`), the dictionary-ready effect (`:2585-2586`), `transcribeText` (`:1915-1921`). Report the one-pause blank on the first differing key; do not fix it.

**A5. Step 2.** `apps/web/e2e/text-header.test.ts:56`: `#intake-tab-poem`; `:59`: `#text-source` count 0. State 4 (`:43`) goes red under the ruling because `put` taps the pill; add `await p.locator('#intake-tab-lyrics').click()` after the poem in its `setup`. Change no header assertion.

**A6. French bytes.** The colon in the FR Guide sentence above now carries U+00A0 in this file; seat it as bytes, as the file's other 42 colons are.

**A7. The pins.** Extend `src/lib/insights/ratified-lines.test.ts`'s row 123 block (`:149-171`) with the two new sentences EN and FR (U+00A0 and U+2019 as literal bytes); add to `src/lib/components/text-source-line.test.ts` a `language: 'fr'` case expecting « D’après PAROLES » and « D’après POÈME ». Remove the `TODO-FR` comments at `GuideContent.svelte:38` and `i18n.ts:831-832`.

**A8. Which words.** Dann ratified "transcribes" / « transcrit » at 08:10 (his own edit of the desk's "shows"). The sentences in step 3 are the ratified ones. `docs/memory/OPEN.md` carries them from Dann's next commit.

Playwright, as the lane ran it: `PW_CHROMIUM_PATH=<your chromium> pnpm exec playwright test --project=<chromium|phone>`; say which Chromium you used.
