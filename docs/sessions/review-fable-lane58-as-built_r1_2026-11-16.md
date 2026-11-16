# Review of lane 58, as built

Filed verbatim by the desk (Opus 5.5), 2026-11-16 03:2x. Reviewer F4 (Fable 5.2), cap told 250k. The report follows exactly as returned.

Reviewer F4, 2026-11-16. Read only: nothing was pushed, and no branch was changed. Tips confirmed by `git ls-remote`: `Shane` df61c283, `cloud-lane-58` 98d2d6a2, no difference from the brief. Merge base 16922501. The trial merge and the test runs happened in a scratch copy of the merged tree (`/home/claude/f4/merged`, tree 6f9dbbbe). Line numbers are the lane's, which are also the merged tree's for every file cited.

NOT ESTABLISHED beats a complete invented answer.

## 1. Verdict (MERGE, MERGE WITH FIXES, HOLD) and blockers

**MERGE WITH FIXES. No blockers.** Both fixes are to paper and a test title, and either can land on the desk after the merge.

What the singer gets, checked:

- **The sigil reads [Ilya] alone.** App bar: `HeaderBar.svelte:51-52` (`aria-label="Ilya"`, three spans, no version). Page: `Paper/TitleHeader.svelte:157`. The `.sigil-version` and `.logo-version` rules and the `versionAccent` prop are gone, and its three callers stopped passing it (diff of `MarkupPane.svelte`, two lines; `InsightsPane.svelte`, one line). Picture `step2-bars-1440-before-left-after-right.png`, viewed: five bars, [Ilya] only, same position.
- **One constant.** `lib/version.ts:10` holds `'2026b'`, and it is the only typed version outside tests and `CITATION.cff`.
  - Footer: `PageFooter.svelte:58` fills `{version}` through `tv`; `i18n.ts:1048` onward holds one `{version}` per language, every other character unchanged in the diff. It is the key's only reader outside tests (grep of the merged tree).
  - Binder: `+page.svelte:2926-2927` passes `ILYA_VERSION` and `ILYA_BUILD`; `exchange.ts:54`, `:124`; `binder.ts:38`, `:132`, `:145`, `:150`. Schema stays 1 (`binder-build.test.ts`, first test).
  - `CITATION.cff:8` is typed, and `citation.test.ts:17-19` holds it equal to the constant.
  - GUIDE: `GuideContent.svelte:4` imports all three values; none is typed in the entries.
- **The GUIDE's two entries match the ratified words** (`OPEN.md:3877-3880`), compared by script, character for character: English headings and bodies exact (`GuideContent.svelte:366`, `:368`, `:370`, `:372`); French headings exact (`:63`, `:67`); French bodies exact but for U+00A0 before each of the three colons (`:65`, `:69`), where `OPEN.md` holds plain spaces. That is the OQLF spacing the brief orders (D7). U+2019 apostrophes throughout; no space before « ? », as the tree's other questions have it.
- **Contents labels equal the headings:** `i18n.ts:2438-2439`; `Drawer.svelte:750-751` (the two items) and `:281` (both ids among `guide-how`'s children). Pictures `step4-guide-entries-desktop-fr.png` and `step4-guide-contents-open-phone-fr.png`, viewed: both entries sit after « Où va Ilya? » and before the forecast entry; the page reads « Ilya 2026b », « compilation : 10034870 », and « MITTON, Dann. Ilya 2026b, 2026. »
- **Nothing else changed by accident.** The diff from the merge base over `apps`, `packages`, and `CITATION.cff` was read in full: 22 files, all N.202's. `packages` is untouched. `binder.ts` shows as binary to git because of control bytes in a regex at `:77` that were there before the lane; with `--text` its diff is the four `build` lines only.
- **The guard** (`version-guard.test.ts`): sweeps the string table by value in both languages and scans every non-test file under `apps/web/src`, `version.ts` aside, for any year and letter; six positive and negative controls. It passes on the merged tree.
- **The merge of Shane into the lane** (10034870, parents 0b4b5517 and 16922501): the welcome sheet's files and the strophic code are not in the lane's diff. `MarkupPane.svelte` loses the two `versionAccent=` lines and nothing else; `HeaderBar.svelte` changes only at the sigil and its comments; `ratified-lines.test.ts` gains a block after the strophic block (`:477` onward) and changes nothing above it.
- **Tests that pinned removed strings:** the old contrast test and its helper `over` are deleted from `colour-story.test.ts`; `footer-credit.test.ts:25-39` moved its pin to the placeholder and the filled sentence. A grep of the merged tree outside `docs` for `sigil-version`, `logo-version`, `versionAccent`, and "Ilya 2026" finds them only inside the lane's own tests. No file under `apps/web/e2e` finds the sigil or the footer sentence by text.
- **Line ceilings:** `node scripts/ratchets.mjs` on the merged tree prints "ratchets: OK" (862 files). `Drawer.svelte` 1,983 of 1,990; `+page.svelte` 5,512 of 5,534; `InsightsPane.svelte` 743 of 744; `MarkupPane.svelte` 1,351 of 1,353. `scripts/ratchets.json` is untouched, as the brief orders.
- **Run by me on the merged tree:** `apps/web` vitest, 6,352 passed and 1 skipped. That is Shane's 6,314 plus the lane's 38. It came in two runs: 5,697 in the first, then 655 from three files that shell out to git and failed to load until the scratch copy was made a git repository (an artefact of my copy, not of the lane). `pnpm check`: 0 errors, 12 warnings in 5 files, the baseline the lane's reports give.

## 2. Fixes, numbered, each with file:line

1. **The lane's paper stops at Step 3.** `docs/sessions/report-code-n202-name-and-version_r1_2026-11-16.md:3` says Step 4 "is NOT built", and its close says lanes 56 and 57 "had not landed" and that the merge of Shane was a no-op. Both are false at 98d2d6a2. No Step 4 report exists on the branch (four reports, none for Step 4), so no gate counts after the merge and after Step 4 are on record, and no statement that the six Step 4 pictures were looked at. Fix: a Step 4 report or an r2 of the final report, with the eight gates and the Playwright result at the tip. The counts in section 1 above are mine and cover gates 3, 4, and 8 only.
2. **A stale date in a test title.** `apps/web/src/lib/version.test.ts:10` reads "is the release of 2026-11-20". Shane's tip commit (df61c283) says the schedule moved to 2026-11-27. Fix: drop the date from the title; the version is what the test holds.
3. **Optional, the guard's reach** (`apps/web/src/lib/version-guard.test.ts:20`, `:68-81`). Three things it cannot see: an upper-case letter ("2026B", which the old small-caps chip displayed but never typed); an escape (` 2026a`) in any source file other than the string table, which the test's own control at `:54` admits; and anything outside `apps/web/src`, such as `apps/web/static`. None holds a version today (grep of the merged tree outside `docs`: the only other hits are test fixtures in `library/binder.test.ts:109` to `:340`, a URL in `README.md:80`, and dictionary glosses). DESK DEFAULT: leave as built.

## 3. For Dann's eye (taste only), or "none"

One item, and it is a question of fact about ratified words, not taste; I am placing it here because only Dann can reopen them.

- **"The footer of every page you print carries the same name"** (`GuideContent.svelte:368`; French `:65`). The lane's own Step 0 measured that printed GUIDE and LEARN pages carry no footer (`report-code-n202-step1_r1_2026-11-15.md:35`), and that the vowel-space sheet prints with no footer and no version (`:32`). My grep agrees: `Paper/ReadingPaper.svelte`, `voice/chart/VowelSpaceSheet.svelte`, and `voice/chart/print-sheet.ts` name no `PageFooter` and no `ILYA_VERSION`. So the sentence holds for TEXT, MELODY, and INSIGHTS pages and not for the GUIDE page it is printed on. Paths: leave it (cost: one sentence that a singer printing the GUIDE can catch out); narrow the words, for example to the pages of a song (cost: a re-ratification in both languages and one edit to the pins at `ratified-lines.test.ts:484`, `:488`); or give those pages a footer (cost: a new lane). Recommendation: narrow the words after the merge; it does not hold the merge.

For the desk, not for Dann: the Step 0 report says 13 GUIDE pictures in `apps/web/static/guide/` show the sigil with "2026A" (`report-code-n202-step1_r1_2026-11-15.md:31`). After this merge the GUIDE says "This is Ilya 2026b" beside pictures of the old sigil. The brief put the pictures outside this lane. I did not view them.

## 4. Merge: conflicts, and the key count after merging

- `git merge-tree --write-tree origin/Shane origin/cloud-lane-58` exits 0 with tree 6f9dbbbe: **no conflicts, no conflicting file or hunk.** Shane's seven commits since the merge base touch five welcome-sheet files (`e2e/welcome-sheet.test.ts`, `Welcome/WelcomePlate.svelte`, `Welcome/WelcomeSheet.svelte`, `Welcome/welcome-plate.test.ts`, `Welcome/welcome-plate.ts`); the lane touches none of them.
- **Key count after merging: 1,282** (counted by script in the merged `i18n.ts`, 1,282 keys, all unique; the header at `i18n.ts:19` states 1,282; `toc.` is 85, stated at `:81`). Shane did not touch `i18n.ts` after the merge base. `i18n-index.test.ts` passes on the merged tree.

## 5. What I could not establish

- The Playwright suite, desktop and phone, on the merged tree or at the lane's tip: not run by me, and not reported by the lane after Step 3.
- Gates 1, 2, 5, 6, and 7 (the packages' and the root's suites) on the merged tree: not run. The lane changes no file under `packages`.
- Pictures: I viewed three (French desktop entries, French phone contents, the 1440 bars). The English Step 4 pictures, the page heads and feet, the 390 bars, and the printed PDF were not viewed by me. Whether the page's sigil sits well above the title with nothing under it is therefore not judged here; the Step 2 report calls the gap normal.
- Whether GitHub's "Cite this repository" accepts `CITATION.cff`; `cffconvert` was not run, by the lane or by me.
- The brief's review (`review-fable-brief-n202_r1_2026-11-15.md`) was read by its headings and its seventeen amendment leads, not in full; the brief r2 was read in full. The Step 1 and Step 3 reports were read in part.
- Whether the release date is in fact 2026-11-27: read from the subject line of commit df61c283 only, not from `SCHEDULE` or `STATE.md`.
- What `ILYA_BUILD` reads on a Vercel production build. `vite.config.ts:13-20` takes the first eight characters of `VERCEL_GIT_COMMIT_SHA`, else `git rev-parse`, else "unknown"; no deployed build was opened.
- Nothing in this review came from memory files; the house-style rules shaped the wording only.
