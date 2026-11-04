# Report: poem library build 1, step 8, part 4, the French card's guillemets (Code cloud lane, r1, 2026-11-04)

Brief: step 8 r2, Part 4 (`CONTRACT.md` §7: Ilya's French follows the OQLF on typography). Branch `cloud-lane-31`, after part 3.

## What changed

`PoemLibraryCard.svelte` (line 45): the French marks are `['« ', ' »']`, a no-break space inside each mark, as the French strings under POEM already have them (`i18n.ts`, `intake.view.libraryPoem` and `libraryPoemEdited`). English is unchanged (“ ”). No word changes. The pin moved with it: `e2e/poem-library.test.ts` (the French walk) now reads the card's title line and first-line line as the exact characters, `« Весёлый час »` and `« Дайте бокалы! »`. I read `textContent` and compare it exactly, because Playwright's `toContainText` folds a no-break space into a plain one and would have passed on the old text; **control:** with the old marks the French browser test fails. A unit test in `poem-library-strings.test.ts` pins the component's marks.

(The passage line in French already had its no-break spaces, as an i18n string.)

## Gates

web unit 4160 passed + 1 skipped (+1), svelte-check unchanged (0 errors, 12 warnings), full browser suite after part 5.

## NOT ESTABLISHED

- The French card's other typography beyond the two marks (the strings are the ratified ones and the OQLF table test covers them).
