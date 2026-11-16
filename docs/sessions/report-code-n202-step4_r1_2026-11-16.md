# Report, Code: N.202 Step 4 (the GUIDE's two entries)

2026-11-16, lane `cloud-lane-58`. The desk's message of 02:2x met both conditions: lanes 56 and 57 were merged into `Shane` (tip `16922501`), and Dann ratified the words on 2026-11-15 at 14:18 (`docs/memory/OPEN.md`, N.202, "THE GUIDE'S TWO ENTRIES"). I wrote no English or French of my own: every word of both entries and both contents labels is the ratified text.

## The merge

`git merge origin/Shane` into the lane produced no conflict (commit `10034870`). The key count at the head of `apps/web/src/lib/i18n.ts` read 1,280 after the merge and I raised it to 1,282 with the two new keys (`toc.` 83 to 85); `i18n-index.test.ts` passes.

## What was built

- `GuideContent.svelte`: both entries, in both halves, directly after the paragraph of `guide-future` and before the forecast entry, with ids `guide-version` and `guide-cite`, each an `h4` and a paragraph. The version, the year, and the build are `{ILYA_VERSION}`, `{ILYA_VERSION_YEAR}`, and `{ILYA_BUILD}`, imported from `lib/version.ts`; none is typed. No `{:else}` stands inside the French half. A no-break space (U+00A0) stands before each of the three French colons, as the OQLF and `i18n.test.ts` require; the ratified entry in `OPEN.md` writes plain spaces there.
- `Drawer.svelte` (1,983 of 1,990 lines): two list items after the `guide-future` item, and both ids among the children of `guide-how`.
- `i18n.ts`: `toc.guide.version` and `toc.guide.cite`, each label the ratified heading word for word, in both languages; the index counts updated (1,282 keys).
- Tests: eight pins in `insights/ratified-lines.test.ts` (the headings and bodies in both languages, typed from `OPEN.md`, plus order, no typed year, and no `{:else}`); new `components/guide-version-entries.test.ts` (both ids stand in both halves and in the Drawer's list and parent list; each label equals its heading in both languages).

## Pictures, each looked at before this report

Files in `report-code-n202-pictures/`:

1. `step4-guide-entries-desktop-en.png` and `…-fr.png` (1440 x 900): both entries under the sticky tab bar, then the forecast heading. The contents list stands at left with the two new labels between "Where is Ilya headed?" and "Insights forecasts, it does not declare" (French between « Où va Ilya? » and « Les Aperçus prévoient, ils ne déclarent pas »), each on one line.
2. `step4-guide-entries-phone-en.png` and `…-fr.png` (390 x 844): both entries read in full; the French « compilation : » keeps its colon and wraps the build number to the next line.
3. `step4-guide-contents-open-phone-en.png` and `…-fr.png`: the Drawer's contents list with "How Ilya Works" opened by tapping it. The French label « De quelle version d’Ilya s’agit-il? » fits on one line.

The rendered paragraphs, read from the page, match the ratified words: "This is Ilya 2026b. … include the build as well: 10034870." and "… Mitton, Dann. Ilya 2026b. 2026. https://ilya.dannmitton.com."; and the French « Vous utilisez Ilya 2026b. … la compilation : 10034870. » and « … MITTON, Dann. Ilya 2026b, 2026. https://ilya.dannmitton.com. ». The build `10034870` is the merge commit the bundle was built from.

## Gates at this step's tip (`98d2d6a`)

| Gate | Result |
|---|---|
| 1 | 462 passed (462) |
| 2 | 248 passed (248) |
| 3 | found 0 errors and 12 warnings in 5 files |
| 4 | one clean run: 6351 passed, 1 skipped (6352); two other runs failed one timeout in `voice/engine/open-extract.test.ts` (see the final report) |
| 5 | 894 passed, 5 skipped (899) (the merged lanes grew it from 842) |
| 6 | 178 passed (178) |
| 7 | 159 passed (159) |
| 8 | ratchets: OK |

## Not established

- Whether the sentence "The footer of every page you print carries the same name" holds for the GUIDE page it is printed on (printed GUIDE and LEARN pages carry no footer: Step 1 report). The words are ratified; Fable's as-built review raises it for Dann.
