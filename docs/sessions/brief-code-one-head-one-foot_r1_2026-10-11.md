# Brief for Code: one running head and one footer for Text, Markup, and Insights (r1, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 03:25. For Code, Sonnet; the cloud lane or the Mac. QUEUE row 64.

## What the singer sees

A singer prints pages from Text, Markup, and Insights and stacks them. Today each tab heads and foots its pages differently, and only Insights names its tab, so a loose sheet does not say where it came from. After this row, every page from page 2 on names its piece on the left and its tab on the right, and every page ends with the same footer.

The drawing Dann ruled on is `docs/sessions/headers-footers_r1_2026-10-11.png` (its credit line is shortened with "…" to fit the drawing; the app prints the full credit).

## The rulings

- **Footer, Dann 2026-10-11 03:22:** *"the Footer, proposed for all three is perfect! I like how you preserved the negative space above the page count, that helps the user to visually notice it better."*
- **Running head, Dann 2026-10-11 03:23:** *"yes"* to the desk's proposal: "Composer | Poet — Title" on the left, the tab's name on the right, the rule in the tab's colour.
- Both are recorded in `docs/memory/OPEN.md`, "ONE FOOTER FOR ALL THREE TABS". Offered by the desk; ruled in by Dann.

## As built (read by the desk 2026-10-11)

- **Text and Markup** share `apps/web/src/lib/components/Paper/PageFooter.svelte`: legend or note above a 0.5 px line in the tab's colour (`hairlineAccent`, sage by default, `#9585A2` from `markup/MarkupPane.svelte:978`); below it, the credits left and "Page n of N" right, bottom-aligned.
- **Insights** draws its own footer (`apps/web/src/lib/insights/InsightsPane.svelte:583-599`, styles from `:1071`): footnote, method line, AND credits above a 1 px rose line; only the page count below.
- **Running heads:** Text uses `RunningHeader.svelte` with `formatRunningHeader(composer, title, poet)` (`components/Paper/Paper.svelte:52-54`, `page-config.ts:186`); Markup uses the same component with the title alone (`MarkupPane.svelte:907`); Insights draws its own (`InsightsPane.svelte:505-507`, `:703`, `:748`) as title plus identity line. `RunningHeader.svelte` fixes its rule to `var(--sage)`, so Markup's rule is sage under a lavender footer.

## What to do

1. **Footer.** Insights uses `PageFooter.svelte`. Its footnote and method line go in the region above the line (extend `PageFooter`'s props for footnotes and a method line, or a slot; your choice, stated). The credits move below the line beside the page count. The line is 0.5 px in rose (`var(--rose)`). Full credit on every page, as built. Keep Insights' measured-height logic (`footHeights`, `footEls`) working: the page must still reserve exactly the footer's height.
2. **Running head.** One component for all three tabs: `formatRunningHeader(composer, title, poet)` on the left, the tab's name on the right (`t('tab.text')`, `t('tab.markedScore')`, `t('tab.insights')`: « Texte », « Annotation », « Aperçus » in French, existing strings), the rule in the tab's colour (sage, lavender, rose). Same type as `RunningHeader.svelte` today. Insights' identity line ("Insights for Dann · Bass · calibrated …") leaves the running head; it stays on page 1.
3. **Page 1 names its tab too. Dann 2026-10-11 03:24:** *"Yes page 1 should name its tab"*. Where: the tab's name alone, right-aligned at the top margin, in the running head's type and the tab's colour, with no rule, above the title block (a DESK DEFAULT; on Insights it sits above the floating compass, which keeps its place). Add page 1 of each tab to the pictures.

## Before and after

Take the "before" pictures first, before any edit: pages 1 and 2 of *Without Sun*, no. 1 in each of the three tabs, English and French, from the dev build. Then the same twelve "after". Put them in `docs/sessions/head-foot-shots/`.

## Constraints

- No git command that writes, including `add`, `commit`, `stash`, `checkout`, `restore`, `reset`, and `worktree`. To read old code, `git show <sha>:<path>`. On the cloud lane, `CONTRACT.md` §5's branch rules apply.
- No new French string. If one turns out to be needed, set the English and mark the French `[FR: desk draft owed]`.
- All eight gates, against gate 4 `2088` and the rest as in `~/Downloads/ilya-ship.sh`; say if a count moves.

## Report back

`docs/sessions/report-code-one-head-one-foot_r1_2026-10-11.md`: each change with its `path:line`, the twenty-four pictures, the gates, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. `WRITTEN` on the code; `DONE` is Dann's look. Set QUEUE row 64 in one line and stop.
