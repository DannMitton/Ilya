# Report: Insights Further reading, step 0 (measure, change nothing) (r1)

Brief: `brief-code-insights-further-reading_r2_2026-11-03.md`, with the 11 amendments of `review-fable-insights-further-reading_r1_2026-11-03.md`.
Read from: branch `cloud-lane-33`, commit `ff41dd0442bd274e9b1820f6475c962f864ebefd`, working tree clean (`git status --porcelain` empty after `pnpm install --frozen-lockfile`). Nothing in the tree changed in this step except this report.

All paths are under `apps/web/src/lib/insights/` unless stated. Every line below was read this session.

## 1. Where `references` and `hidden` are built

- `RenderedComment` declares `visible`, `hidden`, `count`, `references`, `printedRows` at `comment-text.ts:303-318`.
- `orderSuggestions` splits the suggestions: `ordered = [lead, rest, alternatives, tapOnly]`, `visible = ordered.slice(0, n)`, `hidden = ordered.slice(n)` (`comment-text.ts:152-154`). `n` is `ordered.length` when `o.all` is set, else `min(visibleCount ?? 2, primaries.length)` (`:153`). `COMMENT_DEFAULTS.visibleSuggestions` is 2 (`comments.ts:38`).
- `renderComment` builds the row list: the consequence rows, then for every suggestion `[s.row, ...s.supportRows]`, deduplicated by `add` (`comment-text.ts:421-424`). `references` is that list through `rowReference` (`:434`). The list itself is not kept on the object (NOT exposed: amendment 4).
- `printedRows` is the consequence rows plus the rows of **visible** suggestions with `cite !== false` (`comment-text.ts:425-426`). Its only consumer is `comments.test.ts:392`; `grep -rn printedRows apps/web/src` finds no other use.
- `hidden` is `rendered.slice(order.visible.length)` (`:432`); `count` is "N more things to explore" from `comment.count.one` / `.many` (`:417-418`, strings at `i18n.ts:2061-2062`). `count` is not drawn by `SingerBlock.svelte` or `singer-blocks.ts` (grep over `*.svelte` in this folder and `singer-blocks.ts` finds only `comment-text.ts`). NOT ESTABLISHED for the rest of the app.
- `suggestionRuns` prints a short citation unless `s.cite === false` (`comment-text.ts:400-401`). Only `lean` carries `cite: false` (`:82`). It can land in `hidden` when a comment has three challenges (the cap is 2, `:153`).

## 2. How `endnote` and `comment` render

- `comment` snippet: `.tag`, `.body` with frame, consequence, and **visible** suggestions only, then the placeholder note, then the teacher line (`SingerBlock.svelte:56-64`; body at `:60`). Hidden suggestions are not drawn here.
- The `comment` block is drawn at `SingerBlock.svelte:94-96`; the same snippet is drawn again inside the screen-only `more` block at `:97-101`.
- `endnote` block: heading, teacher line C, tag, one `.body` paragraph per hidden suggestion, then an `<ol class="references">` of full references (`SingerBlock.svelte:161-170`). Styles at `:234-241` (`.teacher-c`) and `:510` onward (`.references`).
- The blocks are built in `singer-blocks.ts:381-389`: one `endnote` per observation in `i.comments` order that has hidden suggestions or references; tag is `tagOf(c) · [vowel]` (`:383`); the first carries the heading `comment.tap` and teacher line C (`:385-387`, `i18n.ts:2060`, `:1906`).
- Teacher line A rides on any comment with a visible suggestion (`singer-blocks.ts:276`; `suggestsApproach`, `singer-page.ts:308-310`).
- `i.comments` is `renderedComments.shown`, passed at `InsightsPane.svelte:384`; `shown` is "up to the budget, in performance order" (`comments.ts:436-437`, sorted at `:466`). The observations behind `more` are `InsightsPane.svelte:385` and are not in the endnotes.

## 3. The opener rotation, its page rule, and what hidden suggestions take today

- `OPENERS = [2, 3, 4, 7]` (`comment-text.ts:170`). English strings `i18n.ts:2033-2037`; opener 4 in French is « Une piste à explorer : » (`:2035`).
- `rotate` (`comment-text.ts:209-249`): per comment `k`, over `[...visible, ...hidden]`.
  - Closers: a suggestion with a fixed opener or any hidden one always prints its closer (`:221`); a visible rotated one drops a closer already used on the page (`:222-223`).
  - Openers: a suggestion with its own `opener` keeps it (`:229-232`). Otherwise the pool is `OPENERS` filtered by `openerFits` (`:234`); the start index is `seed + k` for the first and `seed + k + 3 + (j - 1)` for later ones (`:235`). The first pass is strict: no opener repeated within the comment (`:239`), and, for `j === 0` only, no lead opener already used on the page (`:240`, `usedLeads` at `:214`, added at `:242`). The second pass relaxes both (`:236-245`).
- So today a hidden suggestion takes a rotated opener (unless it has a fixed one: `jaw`, `closePosture`, `lean` do, `:78-79`, `:82`), always with its closer, and the page rule does not apply to it. The page rule in `docs/memory/PRODUCT.md:1041` ("no two comments on one page share an opener, closer, or frame shape") is implemented for lead openers and closers only.
- A second-paragraph opener is outside `OPENERS` and outside `rotate`; nothing covers it today (Fable finding 2). The desk's path (b) adds a `usedParagraphOpeners` set beside `usedLeads`.

## 4. "All of them", and the `more` block (both stay)

- `o.all` is declared at `comment-text.ts:107`, read at `:153`, set at `InsightsPane.svelte:251` from `intake?.suggestions === 'all'`.
- `more` is built at `singer-blocks.ts:290-301`, `screenOnly: true`, drawing the same `moment` object (`:273-278`, `:297`).
- Consequence for step 1: the second paragraph, added to the shared `comment` snippet, appears inside `more` as well. That is intended (Fable amendment 9).

## 5. How pages are filled for Insights

- `BREAKS = {comment, prose, endnote, note, notes, more}` at `InsightsPane.svelte:423`; break offsets are measured per block at `:443` through `lineBoxes` and `breakOffsets` (`line-breaks.ts`: break at the top of a line leaving at least two lines each side, `breakOffsets(lines, min = 2)`).
- `paginate` puts a block's first part on the page "up to the lowest break that fits"; a block of a kind with no break offsets that is taller than a page is the one allowed overflow (`paginate.ts` header comment, lines 45-60 region). There is no rule to keep a block whole. The brief's "keep each resource's block whole" is therefore replaced by amendment 6 (one block per work, kind `endnote`, stays in `BREAKS`).
- `more` is measured open (`open={measuring || moreOpen}`, `InsightsPane.svelte` snippet `blockAt`; `moreOpen` at `:457`), so the second paragraph's height inside it is counted.
- E2E: `apps/web/e2e/pages-without-gaps.test.ts` measures every page but the last, in both fixtures and both languages for Text, Markup, and Insights, at 15 percent empty (`LIMIT = 0.15`). It is Playwright and, per `docs/house-style/code-conventions.md:33`, outside the eight gates. It reads blocks by DOM position, not by kind.

## 6. Things the brief or review did not know that bear on steps 1 to 3

1. **`InsightsPane.svelte` is at its ratchet ceiling.** `wc -l` gives 760; `scripts/ratchets.json` lists `apps/web/src/lib/insights/InsightsPane.svelte: 760`. Amendment 5 asks for a `pitchOf` input fed from the pane. Any line added there must be paid for by a line removed in the same commit, or the ratchets gate fails. Plan: write `commentPitch` by reusing the lookup already in `commentTag` (`InsightsPane.svelte:263`, `:294`) and drop duplicated lines in `commentTag`, so net lines stay at or below 760. Raising the ceiling is allowed by `ratchets.json` only on purpose; I will not do that.
2. `ENVIRONMENT.md:36` and `:95` are index rows. The gate text is the sections `THE GATES RUN IN A CLOUD CLONE` (`ENVIRONMENT.md:4433`) and `THE CLOUD LANE` (`:4602`). The eight gates are those named in `brief-code-input-two-views_r2_2026-10-16.md:29`: phonology, dictionary, web-check, web-test, score-parser, blurb, integration, ratchets.
3. The brief cites `comment-text.ts:309-313` for where `references` and `hidden` are built; those lines are the type declaration. The construction is `:411-434`.

## 7. The eight gates at baseline (`ff41dd0`, fresh clone, Linux)

| Gate | Command | Result |
|---|---|---|
| phonology | `pnpm --filter @ilya/phonology test` | 407 passed (13 files) |
| dictionary | `pnpm --filter @ilya/dictionary test` | 248 passed (4 files) |
| web-check | `svelte-check --tsconfig ./tsconfig.json --output machine` in `apps/web` | 0 errors, 12 warnings, 5 files with problems (975 files) |
| web-test | `pnpm test` in `apps/web` | 3927 passed, 1 skipped (222 files) |
| score-parser | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped (35 files) |
| blurb | `pnpm --filter @ilya/blurb test` | 148 passed (2 files) |
| integration | `pnpm test:integration` | 98 passed (6 files) |
| ratchets | `node scripts/ratchets.mjs` | OK (two files report a ceiling that can fall by one: `+page.svelte` 5586 to 5585, `staff-renderer.ts` 3427 to 3426; not mine to touch) |

Playwright is not among the eight and was not run in step 0. I will try the Insights page-fill test at step 4 and report whether this sandbox can run it (`playwright.config.ts` starts `pnpm dev`, which runs `fetch-omr-models.mjs`; NOT ESTABLISHED whether that host is reachable here).

## NOT ESTABLISHED

- Whether any consumer outside `apps/web/src` reads `printedRows` or `RenderedComment.references`.
- Whether `comment.count` is drawn anywhere in the app.
- How often two or more observations on one fixture page carry hidden suggestions (step 4 can measure it).
- Playwright's runnability in this sandbox.
