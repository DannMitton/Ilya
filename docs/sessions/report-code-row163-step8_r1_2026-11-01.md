# Report: row 163, step 8 (Learn opens as Guide does) and the final gates

2026-11-01, Code (Sonnet), branch `mac-row163`, on `f20d0b8e`. Review amendment 20 applied.

## What changed

`apps/web/src/lib/components/Reading/LearnContent.svelte`, both languages, modelled on `GuideContent.svelte:313-318` (EN) and `:17-22` (FR): `<h1>Learn</h1>` (FR `<h1>Leçons</h1>`, the tab's name, `i18n.ts:187`), then `<div class="chapter-band band-learn">` holding the existing title as `<h2 id="learn-title">` and a `<div class="band-deck">`. The decks are the ratified words, verbatim: EN "Grayson's rules for Russian lyric diction, taught so you can access Russian vocal literature on your own." (14:59); FR « Les règles de Grayson pour la diction lyrique russe, enseignées pour que vous puissiez aborder par vous-même le répertoire vocal russe. » (15:00). No colour was written: the band takes `.band-learn` and the deck `.band-learn > .band-deck` (`ReadingPaper.svelte:132-134`, `:303`), so row 165's slate lands through the token. The file is 4096 lines against a ceiling of 4099 (it had 13 lines of headroom; the change adds 10).

## Readers of `learn-title` (the id stays, now on the `h2`, once per language)

- `Drawer.svelte:563`: the table of contents (`data-heading-id="learn-title"`, `isActive('learn-title')`).
- `+page.svelte` (the scroll-spy near `:3557`): observes every element whose id starts with `learn-` or `guide-`, so the `h2` inside the band is still observed.
- No test and no link read the id before this step (grep over `src`); `learn-opening.test.ts` now does.

## Tests

`learn-opening.test.ts` (5, new): server-renders Learn and Guide. For each language, `<h1>`, a `band-learn`, the `h2#learn-title` with the old title, and the ratified deck; the opening has Guide's shape; one `learn-title` per language; the Drawer and scroll-spy still reach it through that id.

## French beyond the ratified strings

The only new French is the ratified deck and « Leçons » (the tab's own name, `i18n.ts:187`, unchanged). Nothing else. Row: English "Learn" and the deck above; old French: none (a new heading and deck); new French: « Leçons » and the ratified deck.

## Open for Dann (taste)

The `<h1>` reads "Learn" / « Leçons » in title case, as Guide's reads "Guide". The 2026-11-01 ruling writes a singer-facing mention of a tab in capitals inside a string (LEARN, LEÇONS); I read a page's own heading as not a mention in prose and followed Guide. His to say if the heading should be capitals.

## Final gates, in the worktree, all eight

| Gate | Baseline | Final |
|---|---|---|
| 1 phonology | 291 passed (291) | 291 passed (291) |
| 2 dictionary | 248 passed (248) | 248 passed (248) |
| 3 web check | found 0 errors and 12 warnings in 5 files | same |
| 4 web test | 3718 passed, 1 skipped (3719) | **3759 passed, 1 skipped (3760)** |
| 5 score-parser | 775 passed, 5 skipped (780) | **784 passed, 5 skipped (789)** |
| 6 blurb | 145 passed (145) | 145 passed (145) |
| 7 integration | 55 passed (55) | 55 passed (55) |
| 8 ratchets | ratchets: OK. | ratchets: OK. |

Gate 4 moved +41: step 1 +8 (`sw-shell.test.ts`), step 2 +6 (`word-stack-break` 3, `syntactic-break` 3), step 3 +7 (30 new, 23 retired), step 4 +6, step 5 +4, step 7 +5, step 8 +5. Gate 5 moved +9 (`break-mark.test.ts`, step 2). `staff-renderer.ts` is 3427 lines against a ceiling I lowered from 3429 to 3427; no ceiling was raised and no file passed one. `ilya-ship.sh` needs gate 4 at `3759 passed | 1 skipped (3760)` and gate 5 at `784 passed | 5 skipped (789)` once this lands (the desk's to move).

## What was not done or not seen

Nothing here was seen on a Vercel build, on the live app in a browser, on a touch phone, or under the Playwright suite; each step's report says what was proved and how. Step 1 is not DONE (amendment 1).
