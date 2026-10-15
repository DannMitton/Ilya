# Fable review of the row 5 brief (Correction Station, slices 4 to 6, plus cause 1c), r1

Reviewer: Fable 5.1, 2026-10-15. Brief: `docs/sessions/brief-code-audit-correction-station_r2_2026-09-27.md` (r2, 2026-09-27), slices 4 to 6 of `docs/sessions/code-audit-correction-station-map_r1_2026-09-27.md` §4, plus cause 1c from `docs/sessions/report-code-calm-loupe_r1_2026-09-28.md` §4 item 1. Checked against a fresh clone of `Shane` at `14e2ff8`. Every `path:line` below was read this session at that commit. Lane: a Claude Code cloud session (Sonnet) on branch `cloud-lane-9`, first of rows 5, 47, 48, 13.

## Verdict

SEND WITH AMENDMENTS (1 to 11). The seam the map chose is built and the station's remaining code sits where the map said, so slices 4 to 6 are executable. The brief's lane, gates, and "done when" are eighteen days old and name a Mac that the cloud session does not have; cause 1c is named by the queue but has no design in any brief; and the brief's test counts are stale. Nothing in it is unsound.

## Citations checked

| Citation | Status at `14e2ff8` |
|---|---|
| `+page.svelte` 6,224 lines, ceiling 6,224 (`ratchets.json:8`) | MOVED. `wc -l` gives 6,003; `scripts/ratchets.json:8` holds 6003. |
| Station symbols `:710` to `:1332` (brief §2) | MOVED, all present. Slices 1 to 3 are in: `undoHistory` `+page.svelte:862-878`, `stationCursor` and `loupePanel` `:758-764`, `createPressAndHold` `:1127`. |
| Slice 4, the tuplet row: `tupletOpen`, `tupletDef`, `tupletBase`, `tupletFits`, three functions | CONFIRMED at `:1139`, `:1141`, `:1142`, `:1144`, `openTuplet :1148`, `closeTuplet :1153`, `applyTupletDefinition :1158`. `tupletBase` is a plain `let` (`:1142`), as the map says. |
| Slice 5, the verbs and the `selected*` deriveds | CONFIRMED: `correct :895`, `handleStep :901`, `handleOctave :910`, `spellingContextFor :930`, `handleSemitone :940`, `handleAccidental :952`, `handleBase :967`, `handleDot :976`, `handleDeleteNote :984`, `restoreAvailable :1007`, `handleRestoreNote :1014`, `handleDurationCell :1039`, `handleDotCell :1065`, `handleRest :1088`, `handleTie :1103`, `tieAvailable :1111`, `selectedIsRest :1115`, `selectedTied :1118`; `selectedEvent :787`, `armedBase :796`, `armedDots :797`, `arrival :806`, `gapAnchor :811`, `selectedLabel :841`, `selectedBase :848`, `selectedDots :851`, `selectedDotted :854`, `durationWord :890`, `DURATION_KEY :881`. |
| Slice 6, `handleCorrectionKey` | CONFIRMED at `:1193-1283`. It calls every slice: `handleRedo`/`handleUndo` (`:1224`, `:1229`), `loupePanel.musicKeys` (`:1238`), the pitch verbs, `handleMove` (`:1260`, `:1263`), `handleDotCell` (`:1266`), `handleDeleteNote` (`:1271`), `dismissLoupe` (`:1274`), `handleDurationCell` (`:1277`). |
| `heldMeasureIndex` from `gapAnchor?.measureIndex` (cause 1c, report `+page.svelte:1461` at `9ebfdc0`) | CONFIRMED, now `+page.svelte:1363-1369`. |
| `measureIndex = anchor ? anchor.measureIndex : 0` (cause 1c, report `correction.ts:513` at `9ebfdc0`) | CONFIRMED, now `apps/web/src/lib/score/correction.ts:556` in `synthesize`. |
| `Cursor` gap carries only `after` | CONFIRMED: `apps/web/src/lib/score/entry.ts:35`. `enterEntry` (`entry.ts:214-229`) writes `entered: { after }` and no measure. |
| `NoteCorrection.entered` is `{ after: string \| null }` | CONFIRMED: `correction.ts:76`. The field list says every addition is additive (`:54-64`). |
| Playwright "28 of 28" | STALE. `apps/web/e2e/*.test.ts` hold 35 `test(` calls by grep; some are parametrized (`markup-pages-lose-no-bars.test.ts:16` loops two fixtures). The run count is NOT ESTABLISHED here. |
| "The desk compares the 84 screenshots" (`ENVIRONMENT.md` §SCREENSHOT COMPARE) | CONFIRMED at `docs/memory/ENVIRONMENT.md:4457-4467`. The harness is `docs/sessions/n174-c2/capture.test.ts`, `voiced.test.ts`, `playwright.baseline.config.ts`; the fixture outside the tree (md5 `8341a301…`) is byte-identical to the tracked `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`. No comparator script is in the tree. |
| "No git command that writes" (brief §5) | SUPERSEDED for this lane by `CONTRACT.md:75` (the cloud lane commits to and pushes one branch). |

## What the lane change touches

The brief was written for Code on Dann's Mac under the audit ruling of 2026-09-26 00:25 (`CONTRACT.md:75`, exception (a): *hotspot refactors stay with Code on his Mac*). The reason recorded there is that Dann walks each step. Dann moved the row to the cloud lane tonight; under `CONTRACT.md:62` (tether 19) that older decision is a default with a reason, and the desk's line that it departs from it is amendment 1. DONE stays his walk.

Nothing in slices 4 to 6 needs the Mac. The station is pure page state over `correction.ts` and `entry.ts`, both unit-tested, and the gates run in a cloud clone (`ENVIRONMENT.md:4383-4400`). Two Mac dependencies in the brief are replaced below: the 84-capture compare (amendment 4) and the Mac dev server rule (amendment 3).

## Amendments

### 1. Replace the brief's header lane and §5 git lines with the cloud lane

Replace the r2 header line and §5's bullets "No git command that writes …" and "The desk compares the 84 screenshots … leave the slice uncommitted" with:

> Lane: a Claude Code cloud session (Sonnet) on branch `cloud-lane-9`, cut from `origin/Shane` at `14e2ff8` or later, the first of four rows in this session. Commit once per slice (slices 4, 5, 6, then cause 1c), each with `+page.svelte`'s line count before and after and the ceiling in `scripts/ratchets.json` lowered to the new count in the same commit (`scripts/ratchets.json:2` is the rule). Push only `cloud-lane-9`; never `Shane` or `main`; no pull request; never edit `docs/memory/`; do not commit this brief. This departs from the 2026-09-26 00:25 ruling that hotspot refactors run on the Mac (`docs/memory/CONTRACT.md:75`), by Dann's word of 2026-10-14; its reason, his walk, is kept as DONE.

### 2. §2: re-cite the station at `14e2ff8`

Replace §2's first bullet with:

> `apps/web/src/routes/+page.svelte` is 6,003 lines at `14e2ff8`, ceiling 6003 (`scripts/ratchets.json:8`). Slices 1 to 3 are in: `UndoHistory` at `:862-878` (`$lib/score/undo-history.svelte.ts`), `CorrectionCursor` and `LoupePanel` at `:758-764` (`correction-cursor.svelte.ts`, `loupe-panel.svelte.ts`), `createPressAndHold` at `:1127`. What remains of the station: the tuplet row `:1139-1168`; the verbs and selection readings `:787-854` and `:890-1120`; the keyboard `:1193-1283`. Writers from outside the station today: `undoHistory`'s write-back sets `stationCursor.selectedEventId` and `gapAfter` (`:874-875`), and `handleDeleteNote` sets `stationCursor.selectedEventId` (`:995`). Map everything else yourself before moving code, as §3 says; the map of 2026-09-27 (`code-audit-correction-station-map_r1_2026-09-27.md` §2) is a lead whose line numbers have all moved.

### 3. §5: drop the Mac dev-server rule, keep the git-read rule

Replace "Do not serve a second copy of the app beside the dev server (…)" with:

> Read old code with `git show <sha>:<path>`; take every "before" reading before the first edit. `stash`, `checkout`, `restore`, `reset`, and `worktree` are not used (`docs/memory/ENVIRONMENT.md:4453-4455`, "CODE RAN git stash"). Commits and the push of `cloud-lane-9` are the lane's own and are allowed.

### 4. §5 and §6: the screenshot compare runs in your own container, or is reported NOT RUN

Replace "The desk compares the 84 screenshots after each slice" with:

> Behaviour does not change, and the proof is the 84-capture compare (`docs/memory/ENVIRONMENT.md:4457-4467`). Run it yourself, in this container, for the baseline (the commit before slice 4) and after slice 6: copy `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml` to `/home/claude/n174-baseline/fixture.musicxml` (it is the harness's fixture, md5 `8341a301d78abcba62098cbcee764b62`), put `docs/sessions/n174-c2/capture.test.ts` and `voiced.test.ts` under `apps/web/e2e-baseline/` and `playwright.baseline.config.ts` beside `apps/web/playwright.config.ts`, set its `executablePath` to the Chromium you have (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome` if `/opt/pw-browsers/chromium` is absent), and run it with `--config playwright.baseline.config.ts`. No comparator is in the tree: compare the PNGs byte for byte, and treat a difference confined to pixel (1423, 24) on the voiced Markup mid-scroll captures as the known noise (`ENVIRONMENT.md:4463`). Both captures must come from this container (`:4460`). If the harness will not run here, say so in the report under "Could not establish", commit anyway, and the desk runs the compare on the branch; do not hold the commits for it.

### 5. §6: the gates and their baselines, by name

Replace §6's first three bullets with:

> After each slice, all eight gates: phonology 251, dictionary 248, web-check 0 errors 12 warnings, web-test 2512, score-parser 675 passed 5 skipped, blurb 145, integration 55, ratchets OK (names and commands: `docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh:78-117`; cloud-clone notes, `PW_CHROMIUM_PATH` and pnpm 12's `allowBuilds` lines: `docs/memory/ENVIRONMENT.md:4383-4400`). Gate 4 rises by the new modules' tests; name every number that moves. Also run `pnpm exec playwright test --project=chromium` in `apps/web` with `PW_CHROMIUM_PATH` set and report passed and total; the brief's "28 of 28" is from 2026-09-27 and the suite has grown (`apps/web/e2e/` holds seven files). The ratchets script also checks layering and the six-module import table (`scripts/ratchets.mjs:9-21`): a new `.svelte.ts` under `apps/web/src/lib/score/` obeys that table as `correction-cursor.svelte.ts` does.

### 6. §6: the unit tests each slice owes

Append to §6:

> Slice 4: tests for the tuplet row's one-undo rule (`+page.svelte:1134-1138`, `tupletBase` captured once per open and the stack pushed once however many nudges). Slice 5: the verbs through the class with a fake `doc`, at least `handleStep` at the C1 and C7 bounds (`stepAllowed`), `handleAccidental` returning early on a capped click (`:962`), `handleDurationCell` in a gap entering at `arrival` and on an entry re-timing, `handleRest` both ways, `restoreAvailable`'s four conditions (`:1007-1012`). Slice 6: the keyboard's field guard first (`:1198`), Undo and Redo with no cursor (`:1219-1233`), the music keys standing down when `loupePanel.musicKeys` is false (`:1238`), and that an unclaimed key is not prevented (`:1278`). Under vitest the runes are inert (`code-audit-correction-station-map_r1_2026-09-27.md` §3), so each class is tested as a plain class.

### 7. Cause 1c: the design, which no brief holds

The queue names cause 1c (an entered note that knows its measure) and the calm-loupe report describes the symptom and the trap, but no brief says what to build. Add a section "Slice 7, cause 1c" after slice 6:

> **What the singer sees today.** With the loupe on measure k, Left from its first entry onto the head caret re-raises measure k−1, with different music (`report-code-calm-loupe_r1_2026-09-28.md` §1 item 1c, MEASURED). Cause: a gap has no measure of its own; `heldMeasureIndex` takes the anchor's (`+page.svelte:1363-1369`), and the head gap of k is the tail gap of k−1. Holding k instead would strand an entry: `synthesize` seats a hand-entered note in its anchor's measure (`apps/web/src/lib/score/correction.ts:556`), so a digit typed at k's head caret would put the note at the end of k−1 while the loupe showed k (report §4 item 1).
>
> **Build, in this order.** (a) `NoteCorrection.entered` gains an optional `measureIndex` (`correction.ts:76`), additive like every field in that block (`:54-64`): a record without it reads as today. (b) `Cursor`'s gap form gains an optional `measureIndex` (`entry.ts:35`): the measure whose caret run the bar stands in, set by `positionsInMeasure` for the held measure's carets (`+page.svelte:1406-1408`) and by the stepper when it steps into a gap from an entry of measure k. `sameCursor` (`entry.ts:38-42`) ignores it. (c) `enterEntry` (`entry.ts:214-229`) copies the gap's `measureIndex` into `entered`. (d) `synthesize` (`correction.ts:539-567`) uses `c.entered.measureIndex ?? anchor.measureIndex`; the onset stays the anchor's end. (e) `heldMeasureIndex` (`+page.svelte:1363-1369`) prefers the gap's own `measureIndex` over the anchor's. (f) The measure tag's arithmetic (`heldFill`, `+page.svelte:826-829`, `measureFill`) counts an entered note in the measure it now names; check `reflowOnsets` (`correction.ts:425`) and the renderer's barline keying (`:549-551`) still agree. Behaviour that changes, and is meant to: the loupe stays on k at k's head caret, and a note entered there lands at the start of k. Everything else is unchanged.
>
> **Tests.** `enterEntry` at a head gap with and without `measureIndex`; `synthesize` placing the note in the gap's measure; `applyCorrections` on a line where measure k's head gap takes an entry and measure k−1's last event is unchanged. A browser check in Playwright: load `apps/web/src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml` (99 measures, 3/8), raise the loupe on a measure after the first, press Left from its first entry, and assert the tag still names that measure.
>
> **A stored record written by this slice carries `entered.measureIndex`.** Say so in the report with the line, so the desk knows a song saved after this slice reads back differently on a build before it (it reads the field as absent and seats the note in the anchor's measure, which is today's behaviour).

### 8. §5: the constraint on behaviour, made exact for slice 7

Replace "**Behaviour does not change.** Not one pixel …" with:

> **Behaviour does not change in slices 4 to 6.** Not one pixel, word, or keystroke a singer sees. If you find a bug, report it and leave it. Slice 7 (cause 1c) changes one thing on purpose, named in its section, and nothing else.

### 9. §7: the report file and its shape

Replace §7 with:

> `docs/sessions/report-code-correction-station-slices-4-7_r1_<date>.md`: per slice the commit, `+page.svelte`'s line count before and after, the new module and its line count, each gate with its number, the Playwright count, the screenshot compare's result or NOT RUN, and a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer. WRITTEN on the code; DONE is Dann's walk: open a score, select a note, change its pitch, undo, redo, add a rest, tie two notes, define a tuplet, type a digit at a head caret.

### 10. Order against rows 47 and 48 in the same session

Append to §5:

> Rows 47 and 48 follow in this session and each adds props at the two pane call sites (`+page.svelte:4826-4842` `InsightsPane`, `:4854-4874` `MarkupPane`). Finish and commit every slice of this row before row 47 starts; lower the ceiling to this row's final count, and leave the two call sites untouched here.

### 11. The ratchet after this row

Append to §6:

> DESK DEFAULT: rows 47 and 48 may raise the `+page.svelte` ceiling by exactly the lines their props add, in their own commits, with the count in the commit message, as `scripts/ratchets.json:2` allows. This row lowers it as far as it goes first.

## What the brief forbids or invites, checked

- `VocalLineEvent` and `apps/web/src/lib/score/reconciliation/` are not touched by slices 4 to 7 (`CONTRACT.md:125`). Slice 7 changes `NoteCorrection` and `Cursor`, which are not on that list, and the change is additive.
- `__approved__/` and `vitest -u` stay forbidden.
- "Do not add a second silent save site while N.27 is open" (`CONTRACT.md:125`): slice 7 writes through `doc.corrections`, the one existing diff (`correction.ts:61-64`); no new save site.

## What I could not establish

- The Playwright chromium count at `14e2ff8` (not run here).
- Whether `/opt/pw-browsers/chromium` exists in the cloud session's box; `playwright.baseline.config.ts:3` hard-codes it. Amendment 4 names the fallback path.
- Whether the stepper (`CorrectionCursor.move`, `correction-cursor.svelte.ts`) can tell a head gap of k from a tail gap of k−1 without a measure on the cursor; slice 7 (b) gives it one, and its test will show whether the stepping rule needs a second condition.
- Whether any stored song already carries a hand-entered note at a head gap whose measure the new field would move. Nothing in the tree reads such a record differently until it is re-entered, so the risk is to new entries only; stated under "Could not establish" so Dann hears it once.
