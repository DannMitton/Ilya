# The cut list for `staff-renderer.ts` (architecture audit, refactor phase)

Read at `/home/claude/ilya-eab`, branch `Shane`, HEAD `eab54f9` (confirmed:
`git log --oneline -1`, this session; read-only session, no writing git command
run). `packages/score-parser/src/staff-renderer.ts` is 3,534 lines
(`wc -l`, this session), matching the ceiling at `scripts/ratchets.json:10`
exactly.

This is a fresh map, not a re-derivation of an existing anatomy document: none
was found for this file (`find docs/sessions -iname "*staff-renderer*"` turned
up nothing but this file's own approval-test fixtures). Every span below was
read this session with `Read` or `grep -n`, at the line numbers given against
this HEAD.

## 1. The cut table

| # | Name | Destination | Lines removed (est.) | Risk |
|---|---|---|---|---|
| 1 | Public rendering constants | `packages/score-parser/src/render-constants.ts` | ~158 | Low |
| 2 | Accidental engraving state | `packages/score-parser/src/accidentals.ts` | ~170 | Low |
| 3 | Tacet-run detection | `packages/score-parser/src/tacet.ts` | ~103 | Low |
| 4 | Meter and system head | `packages/score-parser/src/meter.ts` | ~172 | Low-medium |
| 5 | Ink metrics and shared geometry constants | `packages/score-parser/src/ink-metrics.ts` | ~175 | Medium |
| 6 | Column layout and underlay geometry | `packages/score-parser/src/layout-columns.ts` | ~444 | Medium-high |

`renderAnalyzedStaff` itself (`:1871-3534`, 1,664 lines, essentially half the
file) is NOT in this table. See section 3 for why, and section 4 for what
inside it cannot move at all.

## 2. Each cut in detail

### Cut 1: Public rendering constants

**Job:** pure data the package's barrel (`index.ts`) already re-exports:
label geometry for the withheld-sigil mark, the IPA/Cyrillic label fonts, the
bar-number style, and one spacing constant.

**Exact spans, read this session:**
- `WITHHELD_SIGLA` `:78-120`, `WITHHELD_SIGLA_WIDTH_PX` `:121`
- `METER_RUN_IN_SP` `:169`
- `IPA_FONT_SIZE` `:1131`, `IPA_FONT_FAMILY` `:1132`, `CYR_FONT_SIZE` `:1137`,
  `CYR_FONT_FAMILY` `:1147`, `IPA_TO_CYR_BASELINE` `:1171`, `BAR_NUMBER`
  `:1193-1243`

**Call sites from outside the cut:** `packages/score-parser/src/index.ts:44-51`
re-exports all six barrel names (`WITHHELD_SIGLA`, `WITHHELD_SIGLA_WIDTH_PX`,
`BAR_NUMBER`, `CYR_FONT_SIZE`, `CYR_FONT_FAMILY`, `IPA_FONT_FAMILY`,
`IPA_FONT_SIZE`, `IPA_TO_CYR_BASELINE`, `METER_RUN_IN_SP`) from
`./staff-renderer`; only that one import line needs a new path.
`apps/web/src/lib/components/Paper/PageFooter.svelte:3,79`,
`apps/web/src/lib/markup/legend.test.ts:21,207-208` (`WITHHELD_SIGLA`), and
`apps/web/src/lib/score/selection-ring.ts:24,193,211,214,227,337`
(`CYR_FONT_SIZE`, `IPA_FONT_SIZE`, `IPA_FONT_FAMILY`, `IPA_TO_CYR_BASELINE`)
all reach these through `@ilya/score-parser`, never `staff-renderer.ts`
directly (grepped this session: no `apps/` file imports
`.../staff-renderer` by path), so none of them need to change.
`apps/web/src/lib/score/loupe.ts:15,369,437,479,490,503,522` uses
`METER_RUN_IN_SP` the same way. Inside the file itself, every constant is
read again later and needs an import added: `WITHHELD_SIGLA` at `:3396`,
`WITHHELD_SIGLA_WIDTH_PX` at `:1083`, `BAR_NUMBER` at `:2277,2291,2292,2306,
2654,2659`, `CYR_FONT_SIZE`/`CYR_FONT_FAMILY` at `:1081,3380,3434`,
`IPA_FONT_SIZE`/`IPA_FONT_FAMILY` at `:3390`, `IPA_TO_CYR_BASELINE` at
`:3378`, `METER_RUN_IN_SP` at `:794,1740,1752,1753,2534` (inside cuts 4 and
6, and inside `renderAnalyzedStaff`).

**Risk:** Low. Pure literal data and one derived constant
(`WITHHELD_SIGLA_WIDTH_PX = WITHHELD_SIGLA.diameterPx`), no functions, no
closures. The only edit outside this file is `index.ts`'s one import path.

**Tests that guard it today:** `packages/score-parser/src/underlay-widths.test.ts:21`
imports `CYR_FONT_FAMILY, CYR_FONT_SIZE` directly from `./staff-renderer`
(needs its import path updated, not new coverage). `staff-renderer.test.ts:38`
imports `CYR_FONT_SIZE` and `IPA_TO_CYR_BASELINE` the same way. The approval
suites (`packages/score-parser/src/approval/__approved__/*.svg` and
`apps/web/src/lib/approval/__approved__/sunless-01-engraved.primitive.svg`,
driven by `staff-renderer-real-fixture.approval.test.ts:113`) render text
using these fonts and sizes, so a byte-identical move that changes no value
keeps every approval file matching; getting a value wrong would show as a
diff there.

### Cut 2: Accidental engraving state

**Job:** the courtesy/required-accidental rule, its per-measure carry, and
the tables it reads (sharp/flat order, per-clef key-signature octave,
accidental glyphs).

**Exact spans, read this session:**
- `SHARP_ORDER`/`FLAT_ORDER` `:444-445`, `accidentalKey` `:452-454`,
  `keySignatureAlter` `:457-461`, `AccidentalMark` `:464`,
  `advanceAccidentalState` `:485-503`
- `accidentalStateAtEndOf` `:530-548`
- `ACCIDENTAL_GLYPH` `:550`, `ACCIDENTAL_SMUFL` `:553-559`
- `KS_OCTAVES` `:1012-1021`
- `AccidentalCarry` `:1460-1467`, `newAccidentalCarry` `:1478-1480`,
  `carryIntoMeasure` `:1493-1504`

**Call sites from outside the cut:** `page-layout.ts:24-31` imports
`accidentalStateAtEndOf` directly from `./staff-renderer` (needs its import
path updated); `page-layout.ts:199` names `advanceAccidentalState` in a
comment only (not a call). Inside the file: `advanceAccidentalState` is
called from `columnInk` (`:1566`) and `renderAnalyzedStaff` (`:2782`);
`accidentalKey` only from inside `advanceAccidentalState` itself (`:491`);
`newAccidentalCarry`/`carryIntoMeasure` from `columnInk` (`:1551`),
`layoutColumns` (`:1724`), and `renderAnalyzedStaff` (`:2388,2668`);
`ACCIDENTAL_GLYPH`/`ACCIDENTAL_SMUFL` from `inkMetrics` (`:1359,1364,1368,
1390,1397,1400`) and `renderAnalyzedStaff` (`:2253,2791,2794,2841,2880,3048,
3049`); `KS_OCTAVES` only from `renderAnalyzedStaff` (`:2254`). All are
internal, mechanical imports to add, none crossing a closure boundary: every
function here is pure (takes its state as an argument, mutates only the
`Record` it is handed).

**Risk:** Low. `staff-renderer.test.ts:30-56` already imports
`accidentalStateAtEndOf`, `columnAdvance` (a neighbour), and
`newAccidentalCarry` straight from `./staff-renderer` as a flat function
list, which is itself evidence these functions are already treated as
independent units, not entangled with the render closure.

**Tests that guard it today:** `staff-renderer.test.ts` (grepped this
session: `accidentalStateAtEndOf`, `newAccidentalCarry` both in its import
list at `:30-56`); I did not open the `describe` blocks that call them to
name which behaviours they pin, so exact coverage of `advanceAccidentalState`
and `carryIntoMeasure` by name is NOT ESTABLISHED beyond the import list.

### Cut 3: Tacet-run detection

**Job:** finding the measures the singer does not sing in and grouping them
into runs, plus the rest glyphs and the hand-tuned tacet-bar geometry table.

**Exact spans, read this session:**
- `REST_SMUFL` `:562-565`
- `TACET_REST` `:589-625` (with its provenance comment `:567-588`, Dann's
  ruling 2026-08-27 and 2026-08-29, read this session)
- `TacetRun` `:800-806`, `tacetRuns` `:819-837`

**Call sites from outside the cut:** none outside the package (not
barrel-exported: absent from `index.ts`'s export list, confirmed this
session). Inside the file: `tacetRuns` is called only from `layoutColumns`
(`:1700`, cut 6); `tacetRuns` itself calls `meterDeclaredAt` (`:829`, cut 4);
`TACET_REST` is read from `inkMetrics` (`:1699` is actually `layoutColumns`;
`TACET_REST.barInsetSp` at `:1752`) and from `renderAnalyzedStaff`'s draw
loop (`:2527-2631`, six reads); `REST_SMUFL` is read from `inkMetrics`
(`:1382`) and `renderAnalyzedStaff` (`:2718`).

**Risk:** Low. `tacetRuns` is a single pure function over `ParsedScore`; the
geometry table is data. The only entanglement is the cross-import of
`meterDeclaredAt` from cut 4, which is a plain function call, not a closure.

**Tests that guard it today:** `staff-renderer.test.ts:47` imports
`tacetRuns` directly. NOT ESTABLISHED whether any test exercises
`TACET_REST`'s specific numbers (`measureSp`, `barInsetSp`,
`numeralClearanceSp`, `numeralScale`) individually, or only through the
approval SVGs' pixel positions; I did not open the approval fixtures to
check for a tacet-bearing measure in the demo fixture this session.

### Cut 4: Meter and system head

**Job:** a time signature's drawn width and glyphs, whether one is declared
at a given measure, and the system-opening header (clef, key signature,
meter, and the x-position content may start at).

**Exact spans, read this session:**
- `DIGIT_SMUFL` `:628-631`, `NO_FONT_METER_DIGIT_SP` `:638`
- `MeterInk` `:641-660`, `meterInk` `:662-693`, `meterDeclaredAt` `:694-707`
- `HEAD_RUN_IN_SP` `:708`, `headMeterSignature` `:716-726`
- `SystemHead` `:727-768`, `systemHead` `:769-799`

**Call sites from outside the cut:** `page-layout.ts:24-31` imports
`headMeterSignature` and `systemHead` directly from `./staff-renderer`.
Inside the file: `meterInk` is called from `systemHead` itself (`:791`),
`layoutColumns` (`:1747`), and twice inside `renderAnalyzedStaff`
(`:2541,2675`); `meterDeclaredAt` from `tacetRuns` (`:829`, cut 3) and
`layoutColumns` (`:1746`); `headMeterSignature`/`systemHead` only from
`renderAnalyzedStaff` (`:1998,2003`).

**Risk:** Low-medium. Pure functions and one interface, but `systemHead` is
the one place `page-layout.ts` and `renderAnalyzedStaff` are documented
(`page-layout.ts:6-13`, read this session) to share "the same x-advance
arithmetic ... so the estimate and the rendering never disagree." That
comment is a lead, not evidence of a coupling this move would break (moving
the function does not change its body), but it means a mismatch here would
surface as the paginator's page breaks disagreeing with the renderer's own
output, not as a pixel diff inside one render.

**Tests that guard it today:** `staff-renderer.test.ts:42` imports
`meterDeclaredAt`. `page-layout.test.ts:10` imports `BAR_NUMBER` (cut 1, not
this cut) from `./staff-renderer`, confirming `page-layout.test.ts` exists
and exercises this module's consumer; I did not open it this session to
confirm it separately covers `systemHead`'s or `headMeterSignature`'s own
output versus only `paginateScore`'s page breaks. `meterInk` and `systemHead`
are not named in `staff-renderer.test.ts`'s own import list (`:30-56`, read
this session) so their direct unit coverage is NOT ESTABLISHED; they are
exercised indirectly through `renderAnalyzedStaff`'s approval SVGs.

### Cut 5: Ink metrics and shared geometry constants

**Job:** per-glyph horizontal ink (notehead half-width, accidental width,
courtesy-parenthesis width), the dot/turning-layer geometry helpers, and the
small pixel/space constants five other regions of the file read.

**Exact spans, read this session:**
- `BARLINE_ROOM` `:140`, `BARLINE_TO_COLUMN_PX` `:147`
- `INK_CLEAR_SP` `:1265`, `TURNING_TRAIL_SP` `:1288`, `ACC_GAP_PX` `:1291`,
  `TURNING_OFFSET_PX` `:1294`
- `staveSteps` `:1304-1320`
- `InkMetrics` `:1321-1340`, `inkMetrics` `:1341-1412`
- `dotGeometry` `:1413-1429`, `sungRightEdge` `:1430-1448`, `turningUnitAt`
  `:1449-1459`

**Call sites from outside the cut:** none outside the package (none of
these names appear in `index.ts`'s export list). Inside the file,
`inkMetrics` is called from `columnInk` (`:1550`) and `layoutColumns`
(`:1730`); `ACC_GAP_PX` also appears directly inside `renderAnalyzedStaff`'s
draw loop at `:2789,2864,3052`, not only through `inkMetrics`;
`BARLINE_ROOM`/`BARLINE_TO_COLUMN_PX` are read from `columnAdvance`
(`:1657-1680`, cut 6) and `renderAnalyzedStaff` (`:2534,2535,2672`);
`TURNING_TRAIL_SP`/`INK_CLEAR_SP` from `layoutColumns` (`:1647`).

**Risk:** Medium. The functions themselves are pure, but the constants
(`ACC_GAP_PX`, `BARLINE_ROOM`, `BARLINE_TO_COLUMN_PX`) are read directly
inside `renderAnalyzedStaff`'s 1,664-line body as well as inside cut 6, so
this cut's real interface is wider than its own five functions: three
plain-number imports have to land correctly in two other files, and a
transcription slip in a shared spacing constant would move ink without
throwing a type error.

**Tests that guard it today:** `staff-renderer.test.ts:30-56` imports
`inkMetrics` directly. `dotGeometry`, `sungRightEdge`, `turningUnitAt`, and
`staveSteps` do not appear in that import list (checked this session), so
their direct unit coverage is NOT ESTABLISHED; they are reached only through
`columnInk`/`layoutColumns` and the approval SVGs.

### Cut 6: Column layout and underlay geometry

**Job:** placing one event's underlay (Cyrillic and IPA text) and the ink it
occupies, computing each column's horizontal ink footprint, the advance
between adjacent columns, and the pass that walks the whole vocal line into
one `LayoutColumn` per event, which is what `paginateScore` (cut 4's
neighbour) uses to estimate where the page breaks.

**Exact spans, read this session:**
- `Placed` `:1034-1058`, `joinsWord` `:1059-1068`, `underlayHalfWidth`
  `:1069-1108`
- `HYPHEN_HALF` `:1109`, `HYPHEN_PAD` `:1111`, `HYPHEN_GAP_PX` `:1120`,
  `LINE_END_HYPHEN_OFFSET_PX` `:1128`, `clampHyphenX` `:1244-1264`
- `ColumnInk` `:1506-1542`, `columnInk` `:1543-1606`
- `columnAdvance` `:1607-1659`
- `LayoutColumn` `:1660-1690`, `layoutColumns` `:1691-1833`

**Call sites from outside the cut:** `page-layout.ts:24-31` imports
`layoutColumns` directly from `./staff-renderer`; `page-layout.test.ts:10`
and `staff-renderer.test.ts:30-56` (`layoutColumns`, `columnAdvance`,
`clampHyphenX`, `HYPHEN_GAP_PX`, `HYPHEN_PAD`, `LINE_END_HYPHEN_OFFSET_PX`,
`HYPHEN_HALF`, `columnInk`, `INK_CLEAR_SP`) both import from it too. Inside
the file, `layoutColumns`'s own output (`LayoutColumn[]`) is read by
`renderAnalyzedStaff` to build the draw pass (the function call itself is
inside `renderAnalyzedStaff`'s body; I did not this session pin the exact
call-site line, so that one line number is NOT ESTABLISHED, though
`layoutColumns` is read this session to run at `:2014-2071`'s "Layout"
section per the earlier structural pass).

**Risk:** Medium-high, for two reasons found this session. First, size:
these six pieces total roughly 444 lines, the largest cut proposed here
after `renderAnalyzedStaff` itself, so it carries the most surface for a
transcription slip. Second, `page-layout.ts:6-13`'s own comment (read this
session) states the paginator "packs measures into systems ... using the
same x-advance arithmetic as the renderer, so the estimate and the rendering
never disagree": `layoutColumns` is that shared arithmetic, called by both
`page-layout.ts` and `renderAnalyzedStaff`, so any mistake in the move
(not in the logic, which does not change) that desynchronises the two
callers would show up as a page-break estimate that stops matching the
actual render, not as a wrong pixel in one render.

**Tests that guard it today:** `staff-renderer.test.ts`'s import list
(`:30-56`, read this session) names `layoutColumns`, `columnAdvance`,
`columnInk`, `clampHyphenX`, `HYPHEN_GAP_PX`, `HYPHEN_PAD`,
`LINE_END_HYPHEN_OFFSET_PX`, and `HYPHEN_HALF` outright, so direct unit
coverage of most of this cut exists by name; `Placed`, `joinsWord`, and
`underlayHalfWidth` are not in that list (not exported: confirmed absent
from `index.ts` and grepped as internal-only), so their coverage is only
indirect, through the functions that call them. `page-layout.test.ts` (read
this session only for its `layoutColumns`/`BAR_NUMBER` imports, not its
bodies) plausibly covers the pagination-estimate side; NOT ESTABLISHED
without opening its `describe` blocks.

## 3. Order, running total, and target size

**Order, lowest risk first**, per the rule this task set:

1. Public rendering constants (cut 1): pure data, one import path to fix
   outside this file.
2. Accidental engraving state (cut 2): pure functions taking their state as
   arguments, already imported as a flat list by the test file.
3. Tacet-run detection (cut 3): one pure function and one data table, single
   internal caller.
4. Meter and system head (cut 4): pure functions, but `systemHead` is a real
   external call site (`page-layout.ts`) whose own comment claims a
   never-disagree relationship with the renderer, worth doing once the
   smaller, more mechanical cuts have proven the pattern.
5. Ink metrics and shared geometry constants (cut 5): functions are pure,
   but three of its constants are also read directly inside
   `renderAnalyzedStaff`'s body, widening the real interface.
6. Column layout and underlay geometry (cut 6): the largest of the six, and
   the one cut whose function (`layoutColumns`) another package file
   (`page-layout.ts`) depends on for an estimate that must keep agreeing
   with the render it estimates.

**Running total (estimates, each row already carrying every cut above it):**

| After cut | Lines remaining (est.) |
|---|---|
| (start) | 3,534 |
| 1. Public constants | ~3,376 |
| 2. Accidental state | ~3,206 |
| 3. Tacet runs | ~3,103 |
| 4. Meter/system head | ~2,931 |
| 5. Ink metrics/geometry | ~2,756 |
| 6. Column layout | ~2,312 |

**What is left at ~2,312 lines:** the `StaffRenderOptions` interface
(`:217-397`, 181 lines, read this session), `DEFAULTS`/`DIATONIC`/
`MIDDLE_LINE` (`:398-420`), a handful of small pure helpers not assigned to
any cut above (`diatonicNumber`, `esc`, `round2px`, `headNameOf` `:421-441`;
`arcOutline` `:944-982`; `analysisMark` `:983-1002`; `partOfEvent`
`:1003-1011`; `flagCount` `:1023-1032`; roughly 90 lines total), and
`renderAnalyzedStaff` itself at 1,664 lines (`:1871-3534`), which this
session did not find a way to cut without rewriting it. **A sensible target
size for this file, given what this session found, is roughly 1,900 to
2,100 lines**: the six cuts above plus tidying the leftover small helpers
into one of the new files, leaving `StaffRenderOptions`, the defaults, and
`renderAnalyzedStaff` as the file's remaining content. This is well above
the ratchet's 1,000-line default for a new file
(`scripts/ratchets.json:2`, read this session), and this session did not
find a safe way to close that gap: doing so would mean splitting
`renderAnalyzedStaff`'s single closure into a layout pass and a draw pass
that hand a data structure between them, which is a rewrite of the
function's shape, not a move, and is out of scope for this cut list as
instructed. **This is an estimate**, not a re-derivation from a full line
count of the leftover helpers.

## 4. What must never move out of the file

- **`renderAnalyzedStaff` itself** (`:1871-3534`). It is one JavaScript
  closure sharing mutable state across its own passes: `highestInk`,
  declared at `:1893` and reassigned at `:2306,2354,2659,2306` and again in
  the tuplet, tie, slur, and beam passes read this session
  (`:3232-3423,3352,3357-3358`), is read and written by every one of those
  passes in sequence. Splitting the function without threading that state
  explicitly between the new pieces would be a rewrite, and this session was
  told to propose moves, not rewrites.
- **The barrel export order and names in `index.ts:44-59`.** Consumers
  (confirmed this session: `PageFooter.svelte`, `selection-ring.ts`,
  `loupe.ts`, `Loupe.svelte`, `loupe-render.ts`,
  `notation-font-lab/+page.svelte`, `correction.test.ts`, and the approval
  test) reach every symbol this file exports only through `@ilya/score-parser`
  (Invariant 2, `ARCHITECTURE.md`, read this session; confirmed by grep: no
  app file imports `.../staff-renderer` by relative or package-internal
  path). Moving a symbol's home file is safe only if `index.ts`'s own import
  line is updated in the same change; the exported name and shape must not
  change.
- **`VocalLineEvent`'s shape** (`docs/memory/CONTRACT.md:632-633`, read this
  session: "Do not change `VocalLineEvent`, and do not rebuild anything in
  `apps/web/src/lib/score/reconciliation/`"). `staff-renderer.ts` reads this
  type throughout but does not define it (`packages/score-parser/src/types.ts`
  does); no cut here touches its definition, and none should.

## 5. Anything else found

- **`docs/memory/OPEN.md:25-34,52-62`** (read this session) carries N.125,
  "SLURS AS TAPERED OBJECTS," logged 2026-09-11 as UNPLACED and describing
  the slur as `fill="none" stroke-width="1.3"` at (its own citation)
  `staff-renderer.ts:2822`. Reading the current file at the slur draw site
  (`:3351`, this session) shows `fill="#1a1612"` with no stroke, the same
  filled-lens style the tie uses at `:3289`, and a comment at `:3327-3341`
  dated 2026-09-16 recording that the slur now shares the tie's `arcOutline`
  call by ruling. **`OPEN.md`'s entry appears to describe a state the code no
  longer has**; the fix seems to have landed after the entry was written, but
  `OPEN.md` still lists it open. This is a staleness finding about the
  memory record, not a code bug, and it is reported here rather than fixed,
  per this task's instructions. Anyone doing cut 6 or touching the ties/slurs
  region (`:3232-3423`, inside `renderAnalyzedStaff`, not proposed for a cut
  in this document) should re-check `OPEN.md` against the code before relying
  on either.
- No anatomy or cutlist document for this file existed before this session
  (checked `docs/sessions/` this session), unlike `+page.svelte`, which had
  one. This document is a first pass, not a revision.

## 6. What I could not establish

- The exact line of the call to `layoutColumns` inside `renderAnalyzedStaff`
  (cut 6's detail names the section it falls in, `:2014-2071`, but not the
  single call line).
- Whether `page-layout.test.ts` exercises `systemHead`, `headMeterSignature`,
  or `layoutColumns` directly, versus only `paginateScore`'s page-break
  behaviour; I read its import line only, not its `describe` bodies.
- Whether any test exercises `TACET_REST`'s individual numbers, or the demo
  fixture (`demo-fixture.ts`) contains a tacet measure at all; not checked
  this session.
- Full line-by-line coverage of `renderAnalyzedStaff`'s own internal
  sections beyond the ones named in section 4 (the beam pass, tuplet pass,
  and header-geometry sections were located by line but not read function
  by function this session for further leads on splitting them).
- The precise byte count the leftover ~2,312-line estimate would actually
  measure to; it is a sum of read spans, not a `wc -l` on a real post-cut
  file.
