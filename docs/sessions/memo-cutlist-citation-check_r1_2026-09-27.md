# Citation check: the two 2026-09-27 cut lists

Read-only verification against `/home/claude/ilya-9eb`, branch `Shane`, HEAD `9ebfdc0`.
`git diff --stat eab54f9 9ebfdc0 -- apps/web/src/lib/score/Loupe.svelte
packages/score-parser/src/staff-renderer.ts` returned no output, confirming neither
target file changed between the cut lists' HEAD (`eab54f9`) and this HEAD. No git
command that writes was run.

Scope: every `path:line` citation and every line span in both documents, checked
against the file each cites. This memo judges accuracy only, not the design of
either cut list.

## Document 1: `docs/sessions/loupe-cutlist_r1_2026-09-27.md`

**Citations checked:** roughly 110, covering the script/markup/style split, all
three spans of cut 1 and their eight sub-item boundaries, cuts 2 through 5's spans
and interface citations, the `GUTTER`/`CHROME` shared-constant citations, section 4's
"must never move" citations, and section 5's two findings.

**Wrong:**

1. Section 5, "a dead prop": the doc cites `apps/web/src/routes/+page.svelte:5116`
   for `nextIds={nextMeasureIds}`. Line 5116 holds `const keys = await
   caches.keys();`, unrelated code. The actual call site is `+page.svelte:5078`.
2. Cut 1, "Exact spans": the doc claims "None of these names appear outside
   `Loupe.svelte`, confirmed by `grep -rn` across `apps/web/src` this session."
   `pageMetrics` does appear outside the file, in a doc comment at
   `apps/web/src/lib/score/loupe.ts:774` ("See `Loupe.svelte`'s `pageMetrics`.").
   It is a comment reference, not a call, so it does not change the interface
   conclusion, but the stated grep result is false as written.
3. Cut 4, "Interface": the doc cites `GUTTER` as read outside `attempt` "by
   `anchorTop`/`panelRoom` outside it (`:2389, 2396`)." Line 2389 does read
   `GUTTER` (inside `anchorTop`). Line 2396 does not: `panelRoom` (`:2393-2397`)
   never reads `GUTTER` directly, only through `anchorTop`'s return value. The
   citation should read `:2389` alone.

**Minor, not counted as wrong:** the "~24" estimate for the three pure helpers'
combined line count (cut 4, "Lines removed") sums to 20 by direct count
(`fingerprint` 696-700, `worstSeparation` 703-708, `offendingPairs` 711-719 = 5+6+9).
The document flags this whole figure as an estimate, so this is a rounding note,
not a citation error.

**Could not check:** the candidate sub-boundaries the document itself marks
NOT ESTABLISHED inside cut 4's 1,423-line `attempt` body (the three groupings at
roughly `:939-1424`, `:1450-1843`, `:1844-2196`); whether the phone Playwright
suite currently passes in CI, beyond the one `ARCHITECTURE.md` line quoted; the
full bodies of `loupe-rules.ts` and `loupe-probe.ts`; CSS attribution for cut 5.
The document already marks these NOT ESTABLISHED itself, correctly.

## Document 2: `docs/sessions/staff-renderer-cutlist_r1_2026-09-27.md`

**Citations checked:** roughly 140, covering both ratchet citations, all six cuts'
spans and call-site citations, the `index.ts` barrel-export citation, the test-file
import-list citations, and the "leftover helpers" spans in section 3.

**Wrong, one systematic pattern:** almost every multi-line span that is
immediately followed in the source by another declaration's leading JSDoc
comment is cited too long by some number of lines, because the span's stated end
is the closing `*/` of the *next* item's doc comment (or, in one case, the next
section's banner comment) rather than the cited item's own closing brace. Cuts 1
and 3, whose items are followed by plain code or by nothing, are unaffected. Every
instance found, with the correction:

| Item | Doc says | Actual | Off by |
|---|---|---|---|
| `MeterInk` | `:641-660` | `:641-646` | +14 |
| `meterInk` | `:662-693` | `:662-678` | +15 |
| `meterDeclaredAt` | `:694-707` | `:694-699` | +8 |
| `headMeterSignature` | `:716-726` | `:716-724` | +2 |
| `SystemHead` | `:727-768` | `:727-745` | +23 |
| `systemHead` | `:769-799` | `:769-797` | +2 |
| `staveSteps` | `:1304-1320` | `:1304-1306` | +14 |
| `InkMetrics` | `:1321-1340` | `:1321-1339` | +1 |
| `dotGeometry` | `:1413-1429` | `:1413-1422` | +7 |
| `sungRightEdge` | `:1430-1448` | `:1430-1440` | +8 |
| `turningUnitAt` | `:1449-1459` | `:1449-1457` | +2 |
| `Placed` | `:1034-1058` | `:1034-1041` | +17 |
| `joinsWord` | `:1059-1068` | `:1059-1067` | +1 |
| `underlayHalfWidth` | `:1069-1108` | `:1069-1086` | +22 |
| `ColumnInk` | `:1506-1542` | `:1506-1513` | +29 |
| `columnInk` | `:1543-1606` | `:1543-1605` | +1 |
| `columnAdvance` | `:1607-1659` | `:1607-1650` | +9 |
| `LayoutColumn` | `:1660-1690` | `:1660-1673` | +17 |
| `layoutColumns` | `:1691-1833` | `:1691-1825` | +8 |
| `arcOutline` | `:944-982` | `:944-959` | +23 |
| `analysisMark` | `:983-1002` | `:983-985` | +17 |
| `partOfEvent` | `:1003-1011` | `:1003-1005` | +6 |

`KS_OCTAVES` (`:1012-1021`), `TacetRun` (`:800-806`), `tacetRuns` (`:819-837`),
and every single-line constant citation checked correctly, so the pattern is
specific to multi-line spans, not universal.

**Other wrong citations, not part of that pattern:**

23. Section 3: "well above the ratchet's 1,000-line default for a new file
    (`scripts/ratchets.json:2`...)". `newFileMaxLines: 1000` is on line 3, not
    line 2 (line 1 is `_what`, line 2 is `newFileMaxLines`... actually line 2 is
    `"_what": "..."` and line 3 is `"newFileMaxLines": 1000,`). Corrected line: 3.
24. Cut 1, "Call sites": `packages/score-parser/src/index.ts:44-51` is cited as
    re-exporting "all six barrel names" and then nine are listed
    (`WITHHELD_SIGLA`, `WITHHELD_SIGLA_WIDTH_PX`, `BAR_NUMBER`, `CYR_FONT_SIZE`,
    `CYR_FONT_FAMILY`, `IPA_FONT_FAMILY`, `IPA_FONT_SIZE`, `IPA_TO_CYR_BASELINE`,
    `METER_RUN_IN_SP`), an internal contradiction (nine, not six). The cited span
    is also wrong: lines 44-46 are the tail of an unrelated `./tempo-terms`
    export, and the `./staff-renderer` export block (which does hold all nine
    names) actually runs `index.ts:47-58`.

**Consequence for the cut table:** because most of cuts 4, 5, and 6's spans are
inflated (several by 15-30 lines), the "Lines removed (est.)" figures for those
three rows, and the running-total table in section 3, are built on overstated
spans and are unreliable as stated. This memo does not recompute them; that is
design work, not a citation check.

**Could not check:** the exact call line of `layoutColumns` inside
`renderAnalyzedStaff` (the document itself marks this NOT ESTABLISHED); whether
`page-layout.test.ts` exercises `systemHead`/`headMeterSignature`/`layoutColumns`
directly; whether any test exercises `TACET_REST`'s individual numbers or whether
the demo fixture contains a tacet measure; full line-by-line coverage of
`renderAnalyzedStaff`'s internal sections beyond what section 4 names. All of
these are already marked NOT ESTABLISHED in the document itself, correctly.
