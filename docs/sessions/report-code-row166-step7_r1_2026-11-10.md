# Report: row 166, step 7, the subtitle wraps; the merge of Shane (Code, cloud lane, r1, 2026-11-10)

Branch `cloud-lane-39`.

## (1) The subtitle wraps

Change: `apps/web/src/lib/components/Paper/TitleHeader.svelte`, the `.metadata-line` rule only. `white-space: nowrap; overflow: hidden; text-overflow: ellipsis` became `white-space: normal; overflow-wrap: break-word`. Nothing else in the file moved, and no string changed. The rule is the one every subtitle form uses (named subtitle, "your voice" subtitle, the placeholder subtitle, and the same class on the composer and attribution lines), so no form is cut with an ellipsis; a line that fits is unchanged.

Measured on the live page (generic baritone, a stored voice with a declared type and no samples, song 1): the French subtitle is 2 lines at 1440 wide and 1 line at 390, computed `text-overflow` is not `ellipsis`, and the line is not clipped (`scrollWidth` is not over `clientWidth`). The English subtitle is 1 line at both. The legend stays inside the header's box at both widths and both languages (its right edge equals the header's).

Screenshots, in `docs/sessions/row166-screens_2026-11-09/`, of the header element only:
`baritone-melody-header-en-1440.png`, `baritone-melody-header-fr-1440.png`, `baritone-melody-header-en-390.png`, `baritone-melody-header-fr-390.png`. The French at 1440 reads « PROFIL DE FORMANTS : VALEURS PAR DÉFAUT POUR LE TYPE GÉNÉRIQUE BARYTON, PAS ENCORE VOS PROPRES / RÉSONANCES. », whole, on two lines, with the legend under it.

## (2) The merge

`git merge origin/Shane` (tip `6b13309`, "Desk close 2026-11-09"). One conflict, as expected: add/add on `docs/sessions/brief-code-row166-generic-profiles_r2_2026-11-09.md`. I kept Shane's copy (`git checkout --theirs`); its md5 is `a1f83b5080b8bb71d9cc8a7449c65cdc`, equal to `origin/Shane`'s blob, and starts a1f83b50 as you said. The merge brought no source files into the build (nothing outside `docs/` changed between my step 7 commit and the merge).

Merge commit: `cf4c963` "Merge origin/Shane into cloud-lane-39". Step 7's layout commit: `f102599`.

## The eight gates, on the merged tip `cf4c963`

| Gate | Result |
| --- | --- |
| 1 phonology | 14 files, 456 passed |
| 2 dictionary | 4 files, 248 passed |
| 3 web check | 0 errors, 12 warnings |
| 4 web tests | 258 files, 4741 passed, 1 skipped |
| 5 score-parser | 785 passed, 5 skipped |
| 6 blurb | 168 passed |
| 7 integration | 125 passed |
| 8 ratchets | OK, no ceiling touched |

All equal to the end of step 6. Playwright was not run (not asked).

## What Code could not establish

- **Other pages' headers.** The rule also governs the composer and attribution lines on TEXT, MELODY, and INSIGHTS pages, so a long composer name now wraps where it used to be cut. I looked only at the MELODY header; the print-pages and header Playwright tests were not run, and a header that grows by a line moves the page's content down by that line (the header's height is measured, so pagination follows).
- **Other widths and print.** 1440 and 390 only.
