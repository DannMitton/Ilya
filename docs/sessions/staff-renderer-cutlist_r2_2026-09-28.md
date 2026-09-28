# r2, 2026-09-28: citations corrected against 9ebfdc0; supersedes r1

Read-only re-audit of `docs/sessions/staff-renderer-cutlist_r1_2026-09-27.md`
against `/home/claude/ilya-night`, branch `Shane`, HEAD `9ebfdc0` (confirmed
this session with `git log --oneline -1`; no git command that writes was
run; no repository file was changed). Target file:
`packages/score-parser/src/staff-renderer.ts`, still 3,534 lines
(confirmed `wc -l`, matching `scripts/ratchets.json:10`'s ceiling exactly,
unchanged from r1's HEAD).

Starting point: `/mnt/user-data/outputs/memo-cutlist-citation-check_r1_2026-09-27.md`,
which found 24 wrong citations in r1's Document 2. This session re-read
every span in r1 independently rather than only applying that memo's
corrections, and found four more wrong citations the memo did not catch,
all the same pattern: `WITHHELD_SIGLA`, `BAR_NUMBER`, `inkMetrics` (the
function, not the `InkMetrics` interface), and `clampHyphenX`. Every
correction below carries the line range read this session.

## What changed from r1

1. All 24 citations the citation-check memo listed as wrong are corrected
   below (mostly cuts 4 to 6, plus the `index.ts` barrel span and the
   `ratchets.json` line number).
2. Four further wrong citations found this session, same pattern (a span's
   stated end is the next item's leading comment, not the item's own
   closing brace): `WITHHELD_SIGLA` (cut 1), `BAR_NUMBER` (cut 1),
   `inkMetrics` (cut 5), `clampHyphenX` (cut 6). This means the
   citation-check memo's claim that "cuts 1 and 3 ... are unaffected" is
   wrong for cut 1: two of its nine items were miscited.
3. Every "lines removed (est.)" figure and the running-total table are
   recomputed from the corrected spans. The new six-cut total is
   substantially lower than r1's: roughly 751 lines against r1's roughly
   1,222. See "On the recomputation" below for why the two numbers cannot
   be reconciled line for line.
4. Four of r1's six "what I could not establish" items are now answered:
   the `layoutColumns` call site inside `renderAnalyzedStaff` (`:1987`),
   `page-layout.test.ts`'s coverage of `systemHead`/`headMeterSignature`/
   `layoutColumns` (indirect only), whether any test exercises `TACET_REST`
   directly (no), and whether the demo fixture has a tacet measure (no).
5. Cut 4's risk stays low-medium; cut 6's stays medium-high. The
   corrections shrink several spans a great deal, but none of them changes
   which functions are shared with `page-layout.ts` or which constants leak
   into `renderAnalyzedStaff`, which is what r1's risk ratings were about.
   No cut's order or destination changes.

## On the recomputation

r1's per-cut "lines removed" figures do not reproduce from summing its own
"Exact spans" bullets (checked this session by direct addition), so this
session cannot recompute them on r1's own terms; only the underlying
methodology it used is not stated. This recomputation instead sums, per
cut, the corrected `start` to `end` of each item exactly as bulleted under
"Exact spans" (inclusive, `end - start + 1`), the same convention r1 used
for the span itself. It does **not** add each item's own leading comment
(which would also move with the code in a real cut), because r1's spans
consistently excluded that comment too (confirmed by re-reading every
item's boundary this session), so this keeps the recomputation on the same
basis as the citations it corrects. **The true post-cut line count that
`git diff --stat` would show, once the leading comments move as well, is
higher than every figure below**, and this session did not attempt that
separate count: reconstructing it is a redesign question about what goes
in each cut, not a citation fix.

## 1. The cut table (recomputed)

| # | Name | Destination | Lines removed (recomputed) | r1 said | Risk |
|---|---|---|---|---|---|
| 1 | Public rendering constants | `render-constants.ts` | 71 | ~158 | Low |
| 2 | Accidental engraving state | `accidentals.ts` | 90 | ~170 | Low |
| 3 | Tacet-run detection | `tacet.ts` | 67 | ~103 | Low |
| 4 | Meter and system head | `meter.ts` | 92 | ~172 | Low-medium |
| 5 | Ink metrics and shared geometry constants | `ink-metrics.ts` | 124 | ~175 | Medium |
| 6 | Column layout and underlay geometry | `layout-columns.ts` | 307 | ~444 | Medium-high |
| | **Total** | | **751** | **~1,222** | |

`renderAnalyzedStaff` itself is `:1871-3534`, 1,664 lines (`3534-1871+1`),
unchanged from r1 and not miscited.

## 2. Corrected spans, by cut

Every row: item, r1's citation, the corrected citation (this session's
`Read`), and the correction's size. Unlisted items in each cut (mostly
single-line constants) were re-read this session and matched r1 exactly.

### Cut 1: Public rendering constants

| Item | r1 | Corrected | Off by |
|---|---|---|---|
| `WITHHELD_SIGLA` | `:78-120` | `:78-111` | +9 (new finding) |
| `BAR_NUMBER` | `:1193-1243` | `:1193-1222` | +21 (new finding) |

Unchanged, re-verified: `WITHHELD_SIGLA_WIDTH_PX` `:121`, `METER_RUN_IN_SP`
`:169`, `IPA_FONT_SIZE` `:1131`, `IPA_FONT_FAMILY` `:1132`, `CYR_FONT_SIZE`
`:1137`, `CYR_FONT_FAMILY` `:1147`, `IPA_TO_CYR_BASELINE` `:1171`.

**Call sites, corrected:** the barrel re-export block is
`packages/score-parser/src/index.ts:47-59` (`export { ... } from
'./staff-renderer';`), not `:44-51`: lines 44-46 are the tail of the
unrelated `./tempo-terms` export. The block re-exports eleven names in
total (`renderAnalyzedStaff`, the nine cut-1 constants, and `type
StaffRenderOptions`); the nine cut-1 names sit on `index.ts:49-57`. Every
other call-site citation in this section (`PageFooter.svelte`,
`legend.test.ts`, `selection-ring.ts`, `loupe.ts`, and the in-file re-reads
at `:3396,3390,3380,3434,3378,794,1740,1752,1753,2534` etc.) was not
re-verified this session beyond the citation-check memo's pass; treat
those as carried over from r1, not re-audited here.

**Lines removed, recomputed:** 34 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 30 = **71**
(`WITHHELD_SIGLA` 34, `WITHHELD_SIGLA_WIDTH_PX` 1, `METER_RUN_IN_SP` 1,
`IPA_FONT_SIZE` 1, `IPA_FONT_FAMILY` 1, `CYR_FONT_SIZE` 1,
`CYR_FONT_FAMILY` 1, `IPA_TO_CYR_BASELINE` 1, `BAR_NUMBER` 30).

### Cut 2: Accidental engraving state

No wrong citations found, this session or the citation-check memo. All
spans re-read and confirmed: `SHARP_ORDER`/`FLAT_ORDER` `:444-445`,
`accidentalKey` `:452-454`, `keySignatureAlter` `:457-461`,
`AccidentalMark` `:464`, `advanceAccidentalState` `:485-503`,
`accidentalStateAtEndOf` `:530-548`, `ACCIDENTAL_GLYPH` `:550`,
`ACCIDENTAL_SMUFL` `:553-559`, `KS_OCTAVES` `:1012-1021`, `AccidentalCarry`
`:1460-1467`, `newAccidentalCarry` `:1478-1480`, `carryIntoMeasure`
`:1493-1504`.

**Lines removed, recomputed:** 1+1+3+5+1+19+19+1+7+10+8+3+12 = **90**.

### Cut 3: Tacet-run detection

No wrong citations, confirmed both by the memo and this session:
`REST_SMUFL` `:562-565`, `TACET_REST` `:589-625` (provenance comment
`:567-588`), `TacetRun` `:800-806`, `tacetRuns` `:819-837`.

**Lines removed, recomputed:** 4 + 37 + 7 + 19 = **67** (declarations only;
`TACET_REST`'s 22-line provenance comment is not folded in, matching this
document's convention throughout).

### Cut 4: Meter and system head

| Item | r1 | Corrected | Off by |
|---|---|---|---|
| `MeterInk` | `:641-660` | `:641-646` | +14 |
| `meterInk` | `:662-693` | `:662-678` | +15 |
| `meterDeclaredAt` | `:694-707` | `:694-699` | +8 |
| `headMeterSignature` | `:716-726` | `:716-724` | +2 |
| `SystemHead` | `:727-768` | `:727-745` | +23 |
| `systemHead` | `:769-799` | `:769-797` | +2 |

Unchanged: `DIGIT_SMUFL` `:628-631`, `NO_FONT_METER_DIGIT_SP` `:638`,
`HEAD_RUN_IN_SP` `:708`.

**Lines removed, recomputed:** 4+1+6+17+6+1+9+19+29 = **92**.

### Cut 5: Ink metrics and shared geometry constants

| Item | r1 | Corrected | Off by |
|---|---|---|---|
| `staveSteps` | `:1304-1320` | `:1304-1306` | +14 |
| `InkMetrics` | `:1321-1340` | `:1321-1339` | +1 |
| `inkMetrics` (function) | `:1341-1412` | `:1341-1406` | +6 (new finding) |
| `dotGeometry` | `:1413-1429` | `:1413-1422` | +7 |
| `sungRightEdge` | `:1430-1448` | `:1430-1440` | +8 |
| `turningUnitAt` | `:1449-1459` | `:1449-1457` | +2 |

Unchanged: `BARLINE_ROOM` `:140`, `BARLINE_TO_COLUMN_PX` `:147`,
`INK_CLEAR_SP` `:1265`, `TURNING_TRAIL_SP` `:1288`, `ACC_GAP_PX` `:1291`,
`TURNING_OFFSET_PX` `:1294`.

**Lines removed, recomputed:**
1+1+1+1+1+1+3+19+66+10+11+9 = **124**.

### Cut 6: Column layout and underlay geometry

| Item | r1 | Corrected | Off by |
|---|---|---|---|
| `Placed` | `:1034-1058` | `:1034-1041` | +17 |
| `joinsWord` | `:1059-1068` | `:1059-1067` | +1 |
| `underlayHalfWidth` | `:1069-1108` | `:1069-1086` | +22 |
| `clampHyphenX` | `:1244-1264` | `:1244-1247` | +17 (new finding) |
| `ColumnInk` | `:1506-1542` | `:1506-1513` | +29 |
| `columnInk` | `:1543-1606` | `:1543-1605` | +1 |
| `columnAdvance` | `:1607-1659` | `:1607-1650` | +9 |
| `LayoutColumn` | `:1660-1690` | `:1660-1673` | +17 |
| `layoutColumns` | `:1691-1833` | `:1691-1825` | +8 |

Unchanged: `HYPHEN_HALF` `:1109`, `HYPHEN_PAD` `:1111`, `HYPHEN_GAP_PX`
`:1120`, `LINE_END_HYPHEN_OFFSET_PX` `:1128`.

**Call site, now established:** `layoutColumns` is called inside
`renderAnalyzedStaff` at `:1987` (`const { columns: steps, trailing } =
layoutColumns(`), inside the "Layout" section r1 already placed at
`:2014-2071`'s neighbourhood (the call precedes that section's line
numbers; r1's own structural-pass line range for "Layout" was for a
different sub-block, not a contradiction).

**Lines removed, recomputed:**
8+9+18+1+1+1+1+4+8+63+44+14+135 = **307**.

## 3. Leftover helpers (not in any cut) — sizes corrected

r1's section 3 named these as not assigned to a cut. Three of their spans
were also miscited by the same pattern:

| Item | r1 | Corrected | Off by |
|---|---|---|---|
| `arcOutline` | `:944-982` | `:944-959` | +23 |
| `analysisMark` | `:983-1002` | `:983-985` | +17 |
| `partOfEvent` | `:1003-1011` | `:1003-1005` | +6 |

Unchanged: `diatonicNumber`/`esc`/`round2px`/`headNameOf` `:421-441`,
`flagCount` `:1023-1032`, `KS_OCTAVES` (cut 2, listed above).

**Leftover total, recomputed:** 16 + 3 + 3 + 21 + 10 = **53** lines
(`arcOutline` 16, `analysisMark` 3, `partOfEvent` 3, the four small
helpers 21, `flagCount` 10), against r1's "roughly 90 lines total".

## 4. Running total and target size (recomputed)

| After cut | Lines remaining |
|---|---|
| (start) | 3,534 |
| 1. Public constants | 3,463 |
| 2. Accidental state | 3,373 |
| 3. Tacet runs | 3,306 |
| 4. Meter/system head | 3,214 |
| 5. Ink metrics/geometry | 3,090 |
| 6. Column layout | 2,783 |

Arithmetic: `3534 - 71 - 90 - 67 - 92 - 124 - 307 = 2783`.

**Target size.** r1 gave "roughly 1,900 to 2,100 lines" as the sensible
floor after the six cuts plus tidying the ~90 leftover lines into a new
file. On this session's corrected arithmetic the six cuts alone leave
2,783 lines, and tidying the corrected 53 leftover lines away leaves
roughly **2,730 lines**, not 1,900 to 2,100. r1's own running total
(ending at ~2,312, already lower than 2,783 minus the leftover helpers)
does not reconcile with 1,900-2,100 either on its own numbers, so that
range was already an extrapolation beyond the six cuts' own arithmetic,
not a re-derivation; this session cannot say more without the same
comment-inclusion accounting flagged in "On the recomputation" above.
`renderAnalyzedStaff` (1,664 lines) and the `StaffRenderOptions` interface
(`:217-397`, 181 lines, re-read this session, unchanged) still make up
most of whatever total remains and were not proposed for a cut in r1 or
here.

**Ratchet citation, corrected:** the 1,000-line ceiling for a new file is
`scripts/ratchets.json:3` (`"newFileMaxLines": 1000,`), not `:2` (line 2 is
the `_what` explanatory string).

## 5. What r1 could not establish, now answered

- **The `layoutColumns` call site inside `renderAnalyzedStaff`**: `:1987`
  (see cut 6 above).
- **Whether `page-layout.test.ts` exercises `systemHead`,
  `headMeterSignature`, or `layoutColumns` directly**: no. Its only direct
  import from `./staff-renderer` is `BAR_NUMBER` (`:10`), confirmed by
  `grep` this session. Its `describe` blocks (read this session:
  `:20,35,106,211,353`) test `paginateScore`'s output (measure numbers,
  slicing, page packing, and "the ink term reaches pagination"), which
  exercises `layoutColumns` only indirectly, through consistency checks
  such as `:431`'s "agrees with the render: sliceWidth equals an
  unstretched system's width". `systemHead` and `headMeterSignature` are
  not named anywhere in the file.
- **Whether any test exercises `TACET_REST`'s own numbers**: no direct
  reference to `TACET_REST.` appears in any `.test.ts` file this session
  grepped. Coverage is indirect only, through the approval SVGs, as r1
  suspected.
- **Whether the demo fixture has a tacet measure**: no.
  `staff-renderer.test.ts:1653` asserts `tacetRuns(demoScore())` equals
  `[]`, and `demoScore` comes from `demo-fixture.ts` (`staff-renderer.test.ts:23`).

Still not established, same as r1: full line-by-line coverage of
`renderAnalyzedStaff`'s internal sections beyond what r1's section 4
already named, and the exact byte count a real post-cut file would
measure to (see "On the recomputation").

## 6. What must never move (re-verified, one citation corrected)

- `renderAnalyzedStaff` itself, `:1871-3534`. Unchanged; re-verified this
  session (`export function renderAnalyzedStaff(` at `:1871`, closing `}`
  at `:3534`).
- **The barrel export order and names**, corrected to
  `index.ts:47-59` (r1 said `:44-59`, which reached one line into the
  unrelated `./tempo-terms` export at `:44-46`; see cut 1 above).
- `VocalLineEvent`'s shape (`docs/memory/CONTRACT.md:632-633`), unchanged,
  not re-read this session beyond the citation-check memo's pass.

## 7. Anything else found this session

- The systematic pattern (a span's stated end taken from the next item's
  leading comment rather than the item's own closing brace) recurs in
  places the citation-check memo did not flag: `WITHHELD_SIGLA` and
  `BAR_NUMBER` in cut 1, `inkMetrics` in cut 5, and `clampHyphenX` in cut
  6. All four are corrected above. This session did not re-check every
  call-site line list (the `apps/web` file:line citations under each
  cut's "Call sites") beyond what the citation-check memo covered; those
  should be treated as carried over from r1, not independently re-audited
  here, per the "not re-verified this session" notes above.
- r1's section 5 finding about `docs/memory/OPEN.md`'s stale N.125 entry
  and its slur-drawing citation (`:2822` in the entry, `:3351` in the
  current file) was not re-checked this session; it concerns a line inside
  `renderAnalyzedStaff`, not one of the six cuts' spans, and is outside
  this citation-correction pass's scope.
