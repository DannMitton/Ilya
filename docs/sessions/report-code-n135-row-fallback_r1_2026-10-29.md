# Report, Code: N.135 row fallback (dictionary sewing), r1 (cloud lane, 2026-10-30)

## The answer

Built as the r3 "Phase 1 for Code" orders: DS only, in a new pure module `omr/underlay-fallback.ts`, wired into `seatPage`, `UNDERLAY_READER` raised to `underlay@3`. All eight gates pass. Two things the desk should know first: (1) the piano-only skip is not available at `seatPage` and was not invented (item 3); (2) of the two mutants named in item 7, the 3-word minimum is caught, and the "unknown join" mutant **survives**, because under my tie-break it changes no output (item 7).

Read at: branch `cloud-lane-22`, cut from `origin/Shane` `f0735616`, working tree clean before the work. `git diff d6db949a HEAD -- apps/web/src/lib/omr` was empty, so the prototype's base and this tree agree in `omr/`.

## Items

1. **Where.** `underlay-page.ts` `seatPage`: the rows of each system are read once up front (tokens, spans, words), then `rescue = free.length > 0 && no row passes rowLanguage ? fallbackRow(...) : null`; in the loop that row is treated as passing. The choice is in `underlay-fallback.ts`; `underlay-page.ts` grew by about 12 lines (ratchets OK).
2. **The rule.** `sewByDictionary`: DP over `words`, joins of 1 to 4, a join of 2 or more only where `wordKnown(joined) === true`, a piece scores its letter count where known, else 0. Tie-break (the brief does not say, I chose): on equal known letters, **more pieces**, so words are not joined for nothing. `fallbackRow`: first row, top to bottom, with at least 3 sewn words of 2+ letters and `rowLanguage(sewn) === 'russian'`. Sewing is for the test only; the row's tokens are seated as read. The prototype's tie-break is NOT ESTABLISHED (I did not have `run.mjs`).
3. **Piano-only.** `seatPage` receives a `PageLayout` and `Seams`; neither carries the page's XML, and `pianoAlonePages` takes XML strings. So no skip is made inside `seatPage`. Not invented. The downstream effect is already covered: `applyUnderlay` (`underlay-song.ts:75`, `:80`) skips a piano-only page for the banner and the syllable count, and the join strips its words (`join-pages.ts:530`). A noise row can therefore be seated in a piano-only page's stats but never reaches the singer or the banner. Passing the flag in would be a signature change; the desk decides.
4. **Banner.** No code change. Test: a fallback-seated system gives `written: true`, and `applyUnderlay` returns `unread: []` and `unreadBars: []` (`underlay-page.test.ts`, "leaves the banner").
5. **Console.** `underlay-reader.ts`: the page line now carries `; the dictionary-sewing fallback seated N system(s)` where N > 0 (`stats.fallback`, new). Not covered by a test of its own; the line is a string in a function that tests drive through a mocked reader, and I did not add one. NOT tested.
6. **Stamp.** `underlay@2` to `underlay@3` (`stamp.ts`, comment extended). Test in `underlay-switch.test.ts`: a reading kept as `underlay@2` is `isCurrent === false` and is read again. The old `underlay@1` test no longer asserts the constant.
7. **Tests** (`underlay-fallback.test.ts`, 7; `underlay-page.test.ts`, 5; `underlay-switch.test.ts`, 1). Sewing on the U5 row qualifies (stub dictionary: тейской, мелочи, незаглушимый, шопот); «і», «у», «т т ь» never qualify; a passing row is not changed (fallback 0, the row below it is not seated); no free notes is skipped; the first row wins.
   **Mutants, run by hand:**
   - Drop the 3-word minimum (`MIN_WORDS = 1`): **fails** "wants three words of two letters or more".
   - Allow a join that is not a known word (`here !== true` to `here === null`, and again with the guard deleted): **survives**, 33 of 33 pass. Cause: an unknown join scores 0, an unknown piece scores 0, and my tie-break prefers more pieces, so the DP never picks it. The guard is correct to the brief but redundant to the output under this tie-break. A tie-break of "fewer pieces" would make it matter, and would change which rows qualify. I did not change the rule to make a mutant die. Desk to rule.
   - Plus the flip side, not a named mutant: the unit tests cannot see the prototype's tie-break.
8. **Gates** (baseline, then now):

| gate | baseline | now |
|---|---|---|
| `pnpm test:phonology` | 291 | 291 |
| `pnpm test:dictionary` | 248 | 248 |
| `--filter @ilya/web check` | 0 errors, 12 warnings | 0 errors, 12 warnings |
| `--filter @ilya/web test` | 3705 passed, 1 skipped | **3718 passed, 1 skipped** (+13) |
| `--filter @ilya/score-parser test` | 775, 5 skipped | 775, 5 skipped |
| `pnpm test:blurb` | 145 | 145 |
| `pnpm test:integration` | 55 | 55 |
| `pnpm ratchets` | OK | OK |

Gate 4 moved by +13: 7 + 5 + 1. Ratchets printed three "can be lowered" lines (LearnContent, InsightsPane, Loupe); they are in files this change does not touch and print without it.

## NOT ESTABLISHED

- The replay on A2's captures (1,939 / 1,750 within 2): not run. The captures and `rows10.mjs` and `real7.mjs` are not in this workspace. The desk replays.
- That my tie-break matches the prototype's.
- The piano-only skip at `seatPage` (item 3).
- The console line, by test (item 5).
- Playwright: not part of the eight gates and not run.

Not done by order: `docs/memory/` untouched, brief not committed, no pull request.
