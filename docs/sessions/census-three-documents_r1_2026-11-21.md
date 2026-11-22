# Census: how TEXT, MELODY, and INSIGHTS differ

r1, 2026-11-21 22:0x. Gathered by a Sonnet helper commissioned by the Opus desk (155,794 tokens of a 250k cap, 20 tool uses), read from `Shane` at `e0ca61bf` with `git show`, never from the working tree, because lane 79 was editing it at the time. Every value in it carries a file and a line. **The desk has not re-read every citation; lane 80's brief re-checks each line it uses, per the alpha rule.** No recommendation in it is the helper's: it was told to report and not to judge.

## What the three share by construction

All three draw the same `TitleHeader`, `RunningHeader`, and `PageFooter` (`TitlePage.svelte:106-107`, `MarkupPane.svelte:971-972`, `InsightsPane.svelte:485-486`; footer at `TitlePage.svelte:147`, `MarkupPane.svelte:1000`, `InsightsPane.svelte:581`). Sheet 816 by 1056, margins 48 and 96, title 28 px serif, sigil 24 px, running-header and footer type, sheet colour `#F0EBE0`, shadow, and the 2 rem between sheets are identical on all three.

## The differences, as measured from source

| # | Thing | TEXT | MELODY | INSIGHTS | Size of the difference |
|---|---|---|---|---|---|
| 1 | Content's left edge and width | 92, width 628 (`page-config.ts:108`, `TitlePage.svelte:120`) | 96, width 624 (`MarkupPane.svelte:1168-1169`, `:510`) | 96, width 624 (`InsightsPane.svelte:609-610`, `:373`) | 4 px, and the column 4 px wider |
| 2 | Clear space above the footer | 8 plus the slack under the 80 px floor (`Paper.svelte:88-89`) | same (`MarkupPane.svelte:491-493`) | 40, no floor (`InsightsPane.svelte:450`, `:378`) | INSIGHTS ends higher; exact px NOT ESTABLISHED until a footer is measured |
| 3 | Gap under the title rule, page 1 | 16 (`Paper.svelte:90`, `page-config.ts:41`) | 18, a local constant (`MarkupPane.svelte:469`, `:471`) | 16 (`InsightsPane.svelte:286`) | 2 px |
| 4 | Pages after the first | 48 + measured header + 16 (`Paper.svelte:90`) | a fixed 93: 48 + `HEADER_HEIGHTS.subsequent` 37 + `GAP` 8 (`MarkupPane.svelte:511`) | 48 + measured header + 16 (`InsightsPane.svelte:288`) | 0 if the running header measures 29, 4.4 if it measures 24.6; NOT ESTABLISHED |
| 5 | Footer contents | a per-page provenance legend above the hairline (`Paper.svelte:172`, `TitlePage.svelte:150`) | no legend, an optional broad note (`MarkupPane.svelte:1000`) | neither (`InsightsPane.svelte:581`) | content, not geometry; see the note under the table |
| 6 | Paper size | letter and A4 in code | letter and A4 in code (`MarkupPane.svelte:280`, `:419`) | letter only, hard-coded (`InsightsPane.svelte:162`) | A4 is wrong on INSIGHTS alone |
| 7 | The main face | 1 rem serif over 1 rem sans IPA (`WordStack.svelte:273-286`) | 12.5 serif over 12 Lato IPA (`staff-renderer.ts:1012-1028`) | 14 serif prose (`SingerBlock.svelte:231-235`) | the IPA is 16 against 12; a musician's question, not a geometry one |

**On item 5, CORRECTED by Dann 2026-11-21 22:12.** His rule: the footer, meaning the divider and the credit row, is identical on all three and sits at one fixed height; only the legend band above the divider changes with the page's content. **The mechanism in this sentence was wrong and is corrected 2026-11-21 22:2x:** the footer grows upward from its pinned bottom edge (`PageFooter.svelte:107-109`), so the band above the hairline leaves the hairline where it was. The divider moves with the credit row beneath it: the Richter credit on a Latin page, the longer French sentence, and the page-count label's width. That is geometry and it is lane 80's. The paragraph that follows was the desk's reading before his correction, and it is wrong where it says the difference needs no work.

**The desk's superseded reading.** His ruling of 2026-10-20 03:08, with the correction of 03:2x, makes the three footers identical in the credit sentence and the hairline, the line keeping each document's colour (`OPEN.md`, ONE FOOTER FOR ALL THREE DOCUMENTS). The provenance legend is not the credit; it explains marks that exist in TEXT alone. So item 5 is content that varies by document and is not a departure from that ruling. What it does change is the footer's height, and therefore where content ends, which is item 2's business.

**Hard-coded numbers that `page-config.ts` already defines:** `TitleHeader.svelte:211-214`, `RunningHeader.svelte:64-67`, `PageFooter.svelte:108-111` each repeat 48, 96, 96 as literals and read `MARGINS` not at all; `MarkupPane.svelte:1168-1169` and `InsightsPane.svelte:609-610` repeat 96; `BlankState.svelte:46` repeats it again. `InsightsPane.svelte:378`'s `CLEAR = 40` has no counterpart in `page-config.ts`.

## What a browser must settle before lane 80 is built

1. The running header's height (`.running-header` offsetHeight): 24.6 by the CSS arithmetic, 29 by a comment of 2026-08-15 written before the component was rewritten on 2026-10-11.
2. The plain footer's height (`.page-footer` offsetHeight) on each of the three.
3. The first ink under the title rule on MELODY and INSIGHTS, which no source number gives.
4. The root font size behind TEXT's 1 rem rows.
5. The compass slot's width on INSIGHTS, which narrows its title.
