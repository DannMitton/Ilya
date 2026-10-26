# Fable review: brief for Code, row 122, r1 (2026-10-25)

Brief reviewed: `docs/sessions/brief-code-row122-scan-receipt-format_r1_2026-10-22.md`, md5 `53cef588613537ea03cabb3656272b4e` (checked in the clone at `e0f4ad9`, 2026-10-25). Every `path:line` below was read by Fable this session; nothing was run. NOT ESTABLISHED beats a complete invented answer.

## Verdict: SEND WITH AMENDMENTS

The diagnosis holds against the tree. Two amendments change what Code builds (1 and 2); one closes the brief's NOT READ lead so step 0 shrinks to a confirmation (3); the rest correct a cite, fix a test claim that cannot be true as written, and name a wall the row exposes but does not cause.

## Amendments, ranked

### 1. The restore path draws no receipt, so there is nothing for it to know

Evidence. `ScoreUploader.svelte:786-816` (`onMount`): a restored scan is rebuilt as a `File` from `restore.bytes` (`:788`), sniffed by `readableKind` (`:789`), and read by `restoreStoredScan` (`:792-797`), so the kind is known there. But the path then calls `oningested(ui.ingested, ui.file, 'restore')` and `reset()` (`:811-812`), which sets `ui` to `idle` (`:818-822`). The comment at `:614-617` states it: "this file's `arrived` summary is not shown for it." The format label is drawn only inside `{:else if ui.kind === 'arrived'}` (`:980`, `:989`). The `restore.bytes` are the scan itself, not the reading: `+page.svelte:3342-3344` substitutes `scan.file` for the ingested file before `attachSource` (`:3361-3362`), and the reading travels beside it as `reading`.

Cost if not amended. Code spends step 0 and part of step 2 on a path that never shows the string, and the brief's "handle the restore path as step 0 allows" invites code that no singer can see.

Replace section 2's last bullet with:

> The restore path shows no receipt: `onMount` (`ScoreUploader.svelte:786-816`) calls `oningested` with origin `'restore'` and then `reset()` (`:811-812`), so `ui` is `idle` and the format label at `:989` is never drawn for a restore (the comment at `:614-617` says so on purpose). `restore.bytes` are the scan, not the reading (`+page.svelte:3342-3344`, `:3361-3362`). Nothing in this row touches the restore path.

Replace step 0's first sentence with: "Confirm by reading that the restore path draws no `arrived` receipt (`ScoreUploader.svelte:811-812`, `:980`, `:989`); report the lines."

### 2. Carry the kind on the `arrived` state, not as a second piece of component state

Evidence. `UiState` is a discriminated union (`ScoreUploader.svelte:162-179`) and the arrived variant is `{ kind: 'arrived'; ingested: IngestedScore; file: File }` (`:177`). `handleFile` sets it at `:598`. The scan route's `ingest` hook (`:289`) awaits `handleFile(xml)` and still holds `kind` in its closure (`take()`'s `kind` from `:268`). The receipt clears when `ui` leaves `arrived`: `reset()` (`:818-822`) and every other `ui =` assignment (`:275`, `:278`, `:540`, `:546`, `:561`, `:590`). A separate `scanKind` variable would need its own clearing at each of those, and the brief's "clear it with the receipt" names no line.

The brief's DESK DEFAULT (a pure function in a new file) stands. Only the state's home changes.

Replace in section 3 "the component keeps one new piece of state, the scan's kind, set where `take()` holds it and cleared where the receipt clears" with:

> the `arrived` variant of `UiState` (`ScoreUploader.svelte:177`) gains an optional `scanKind?: 'image' | 'pdf'`; the scan route's `ingest` hook (`:289`) sets it after `handleFile(xml)` succeeds (`if (ui.kind === 'arrived') ui = { ...ui, scanKind: kind }`), and nothing clears it, because it leaves with the state. The draw at `:989` passes `ui.ingested.provenance`, `ui.ingested.result.score.source.origin`, and `ui.scanKind`.

Fact for Code, not a design: `pendingPoemFallback` already holds `kind` from `:285` through arrival and is cleared only by `reset()` (`:309`, `:821`). Do not read it for the receipt; its name and comment say what it is for.

Replace step 2's "set the scan kind in `take()` at the `readScanAsScore` call, clear it with the receipt, and handle the restore path as step 0 allows" with "set `scanKind` in the `ingest` hook at `:289` as section 3 says; the restore path is untouched (amendment 1)."

### 3. Step 3's "which fail before step 2" cannot be true as written; say what the tests prove

Evidence. Step 1 creates `format-label.ts`; step 3's tests exercise that function. They pass the moment step 1 is done, whether or not step 2 wires the component. Before step 1 they do not compile. Neither state is "fails before step 2 and passes after". The wiring (`:989`) is in a component that vitest does not render (the brief says so itself in section 3), and the only end-to-end route to a homr receipt runs homr, which did not finish in the lane within 1500 s (QUEUE row 104).

Cost if not amended. Code either reports a false before-and-after or spends tokens hunting for a test that cannot exist in the lane.

Replace step 3 with:

> **Step 3.** Tests in `apps/web/src/lib/score/format-label.test.ts` for every case in step 1. One case feeds the real parser: ingest `apps/web/src/lib/omr/fixtures/tch-1.musicxml` through `ingestScoreFile` with the mini DOM, as `no-lyrics-notice.test.ts:36-48` does, and pass its `result.score.source.origin` to the function with each kind, so the origin signal is the parser's (`packages/score-parser/src/musicxml-parser.ts:1101`) and not a string literal. The tests do not compile before step 1 and pass after it; say so. The wiring at `:989` is proved by reading, and the desk walks it on the alias with a scan; write NOT ESTABLISHED for the drawn receipt in the report.

### 4. The parser cite points at a comment

Evidence. `ingest.ts:83-86` is the doc comment on `noLyricsNoticeKey`. The parser's stamp reading is `packages/score-parser/src/musicxml-parser.ts:1101` (`if (software.includes('homr')) return { origin: 'homr-musicxml-from-image', fidelity: 'medium' }`), the constant is `READ_SCAN_ORIGIN` at `packages/score-parser/src/printed-marks.ts:15`, and the type at `packages/score-parser/src/types.ts:225`.

Replace "(`ingest.ts:83-86`)" in section 2 with "(`packages/score-parser/src/musicxml-parser.ts:1101`; the constant `READ_SCAN_ORIGIN`, `packages/score-parser/src/printed-marks.ts:15`; `ingest.ts:83-86` describes it)". `fidelityBanner` is `ingest.ts:67-71`, not `:68`.

### 5. Step 0's second task is closed here; make it a confirmation

Evidence. Grep of `apps/web/src` and `packages` for `upload.format.` and `formatLabel` this session: `ScoreUploader.svelte:826-836` (the function) and `:989` (the draw) are the only readers outside `i18n.ts`. No print footer, no Insights line, and `apps/web/src/lib/provenance.ts` read the format nowhere (grep for `format`, `via`, `sourceFormat`: none). The one other format label a singer can read is `+page.svelte:3454-3462`, `PROVENANCE_FORMAT_LABELS`, which reads `provenance.format` alone (MusicXML or MNX) for the arranger line and is unaffected by this row.

Replace step 0's second sentence with: "Confirm by grep that `upload.format.*` and `formatLabel` are read only at `ScoreUploader.svelte:826-836` and `:989`, and that `+page.svelte:3454-3462` reads `provenance.format` alone; report the result."

### 6. A wall the row exposes and does not cause: the drawer's receipt names the scan `song.musicxml`

Evidence. `readingFile` renames the scan to `${stem}.musicxml` (`scan.ts:114-117`), and `ingestScoreFile` records that name as `ingested.fileName` (`ingest.ts:323`). The drawer's score receipt shows `ingestedScore.fileName` (`+page.svelte:4000`, `IntakePanel.svelte:459-461`), and the wordless notice names the same file (`+page.svelte:2800`). So a singer who dropped `song.pdf` reads "song.musicxml" on the receipt beside the format line this row corrects, while the library stores the scan under its own name (`+page.svelte:3344`, `:3362`). Row 122 does not change this.

Add to section 5: "Report, do not change: the drawer receipt and the wordless notice show the reading's name (`song.musicxml`), not the scan's (`scan.ts:114-117`, `ingest.ts:323`, `+page.svelte:2800`, `:4000`). The desk opens a row."

### 7. Small cites

- Section 2 bullet 3: the handoff is `scan.ts:102` (`hooks.ingest(readingFile(...))`) and `:114-117`; `:77-79` is the signature. `ScoreUploader.svelte:289` is the `ingest` hook; `:287-290` reads as stated.
- Section 2 bullet 5: `take()` holds `kind` from `:268`; `readScanAsScore(file, kind, ...)` is `:287`. Right.
- `i18n.ts:1070-1071` and `:1094-1095`: as stated. QUEUE row 122's own cell cites `i18n.ts:1056-1057`, which is stale; the desk corrects it when filing.
- `scripts/ratchets.json:19` records 1358 and `wc -l` gives 1358: at ceiling, as stated. Removing `:826-836` (eleven lines) pays for the import and the two-line state change.

## Checks that passed

- The diagnosis: the scan route ingests a `.musicxml` file (`scan.ts:114-117`) through `handleFile` (`ScoreUploader.svelte:289`), which lands `via: 'direct'` with no kind (`ingest.ts:50-57`; `formatLabel` `:826-829`). Right.
- The two reader strings exist in both languages and are the ones to reuse; no new string and no French. Right.
- The provenance type is untouched, and `fidelityBanner` (`ingest.ts:67-71`) and `noLyricsNoticeKey` (`:89-90`) keep reading as today under the brief's design. Right.
- The `?reader=ilya` route already labels PDF and photograph by `sourceFormat` (`:831-833`); a homr-stamped `.musicxml` dropped directly keeps `musicxmlDirect` under step 1's "no known kind" rule. Right, and that rule is needed.
- Cross-site line: present and, with amendment 5, complete.

## Where would this wall a singer in

- Before the row: a singer who dropped a photograph reads "Format: MusicXML (direct)". After: the right line. No new wall from the change itself.
- Amendment 6: the same receipt still names a file the singer never had.
- A restore shows no receipt at all (amendment 1); that is the existing design (`:614-617`), not a wall this row opens.

## Questions for Dann

None. The file-name finding (amendment 6) is a desk default when its row is written.

## What I could not establish

- Whether `format-label.test.ts` with the parser-fed case runs green in the lane (read, not run).
- What the receipt reads on the alias after the change (the desk's walk with a real scan).
- The eight gate baselines at Code's start.
