# Memo: anchors for the path pass, increment 2

Read-only, Sonnet, `~/Desktop/ilya-rewrite`, branch `Shane`, HEAD `0f7e89d53c51e139de3a67f7b6691e5f84582093`. Answers `docs/sessions/brief-anchors-path-pass-inc2_r1_2026-09-10.md`. Prior memo's line numbers no longer match (`Drawer.svelte` now 1966 lines, `+page.svelte` 5803) and are not reused.

## F1. Square corners on a closed band

Rounding is only the parent's clip: `.group` — `border-radius: 20px; overflow: hidden` ([Drawer.svelte:1026-1030](apps/web/src/lib/components/Drawer/Drawer.svelte:1026)). `.band-toggle` ([:1115-1131](apps/web/src/lib/components/Drawer/Drawer.svelte:1115)) and `.band-state` ([:1167-1178](apps/web/src/lib/components/Drawer/Drawer.svelte:1167)) have no radius. The only thing moving on a state change is `.band-body`'s entrance keyframe, `transform: translateY(-4px)` under `animation: bodyIn var(--motion) both` ([:1297-1309](apps/web/src/lib/components/Drawer/Drawer.svelte:1297)) — a child transform can promote a layer under `.group`'s clip, the one candidate for a paint that misses the radius until reload repaints it.

## F2. TEXT folds into INPUT

Four `<section class="group group-*">`: Piece [:1039](apps/web/src/lib/components/Drawer/Drawer.svelte:1039), Input [:1047](apps/web/src/lib/components/Drawer/Drawer.svelte:1047), Text [:1055](apps/web/src/lib/components/Drawer/Drawer.svelte:1055), Score markup [:1059](apps/web/src/lib/components/Drawer/Drawer.svelte:1059), one shared `bandHead` snippet [:1024-1038](apps/web/src/lib/components/Drawer/Drawer.svelte:1024). `BAND_IDS`: [sections.svelte.ts:93-99](apps/web/src/lib/components/Drawer/sections.svelte.ts:93). TEXT's contents: `textGroup` [+page.svelte:4512-4606](apps/web/src/routes/+page.svelte:4512) (`NotationFields` [:4547-4559](apps/web/src/routes/+page.svelte:4547), `AnalysisStation` [:4560-4605](apps/web/src/routes/+page.svelte:4560)). INPUT's contents: `inputGroup` [+page.svelte:4148-4246](apps/web/src/routes/+page.svelte:4148), sole child `IntakePanel` (poem box inside it; internal layout not read further).

Files to touch: `Drawer.svelte` (drop `group-text`/its `bandHead` call [:1055-1058](apps/web/src/lib/components/Drawer/Drawer.svelte:1055); `textGroup` prop [:83](apps/web/src/lib/components/Drawer/Drawer.svelte:83) needs a new render site inside `band-input`); `+page.svelte` (move `textGroup`'s body [:4512-4606](apps/web/src/routes/+page.svelte:4512) inside `inputGroup` [:4148-4246](apps/web/src/routes/+page.svelte:4148), under the poem box, closed by default); `sections.svelte.ts` (`BAND_IDS.text` drops [:93-99](apps/web/src/lib/components/Drawer/sections.svelte.ts:93); a new station id is needed — `STATION_IDS`'s declaration not opened); `bandState.ts` (`textStateLine` [:138-150](apps/web/src/lib/components/Drawer/bandState.ts:138), caller [+page.svelte:2121](apps/web/src/routes/+page.svelte:2121), becomes station-level or drops, per F3). `NotationFields.svelte`/`AnalysisStation.svelte` not opened; nothing found requires a change to either.

## F3. TEXT's default state line

Already implemented. `text.state.default` = `Grayson defaults` [i18n.ts:68](apps/web/src/lib/i18n.ts:68); `text.state.changed` = `%s of %s changed` [i18n.ts:69](apps/web/src/lib/i18n.ts:69). Count: `notationDepartures()` [bandState.ts:119-128](apps/web/src/lib/components/Drawer/bandState.ts:119) over the seven `NotationToggleState` fields [:110-117](apps/web/src/lib/components/Drawer/bandState.ts:110); `textStateLine` [:145-151](apps/web/src/lib/components/Drawer/bandState.ts:145) picks default vs. counted phrase; called at [+page.svelte:2121](apps/web/src/routes/+page.svelte:2121). Per F2 this line's home may not survive TEXT's fold; the fold has not happened in this tree.

## F4. Bands open themselves on score arrival

The only call sites of `BAND_IDS.piece`/`.text` anywhere are their own `bandHead` render/`sections.has()` guard ([Drawer.svelte:1040-1041, 1056-1057](apps/web/src/lib/components/Drawer/Drawer.svelte:1040)), gated on the singer's `sections.toggle(id)` in `bandHead` [:1029](apps/web/src/lib/components/Drawer/Drawer.svelte:1029). Neither `handleArrival` [+page.svelte:2861-2960](apps/web/src/routes/+page.svelte:2861) nor `applyArrival` [+page.svelte:2977-3037](apps/web/src/routes/+page.svelte:2977) call `sections.toggle`/`.open` or touch a band id. The only `sections.open(...)` call anywhere is the table-of-contents' own separate `SectionSet` [Drawer.svelte:312](apps/web/src/lib/components/Drawer/Drawer.svelte:312), unrelated to bands. `FIRST_RUN_STATIONS` is `['input']` only [sections.svelte.ts:53](apps/web/src/lib/components/Drawer/sections.svelte.ts:53); a fresh restore ([:397-408](apps/web/src/lib/components/Drawer/sections.svelte.ts:397)) opens Input alone. No site opens Piece or Text on arrival or on the analysis tab — contradicts the walk.

## F5. `from score` missing on one arrival

Confirmed, no run needed — differs by format, by design. `pieceFromScore` = `doc.fromScoreFields.has('title')` [+page.svelte:4055](apps/web/src/routes/+page.svelte:4055); set by `onScoreIngested(state, wm)` [metadata-provenance.ts:164-171](apps/web/src/lib/metadata-provenance.ts:164), called [+page.svelte:3037-3039](apps/web/src/routes/+page.svelte:3037) with `wm = ingested.result.score.workMetadata`; `wm` undefined returns `clearScoreFilled(state)`, empty `fromScore` [:143-149, 163-171](apps/web/src/lib/metadata-provenance.ts:143). MNX (all `.musx` arrivals) never sets `workMetadata` — "the MNX format defines no work-title or creator fields anywhere in its document model" [mnx-parser.ts:743-746](packages/score-parser/src/mnx-parser.ts:743), key omitted [:748-755](packages/score-parser/src/mnx-parser.ts:748). MusicXML's `readWorkMetadata` [musicxml-parser.ts:1057-1075](packages/score-parser/src/musicxml-parser.ts:1057) returns undefined only when the header has nothing. A `.musx` arrival can never carry the tag; a `.musicxml` arrival carries it whenever its header has a title — the Kabalevsky/Mussorgsky difference seen.

## F6. INPUT's line short on Score markup after reload

`inputStateLine` drops a part on its own zero [bandState.ts:67-79](apps/web/src/lib/components/Drawer/bandState.ts:67); caller passes `hasResults ? wordCount : 0`, `ingestedScore !== null` [+page.svelte:2109-2117](apps/web/src/routes/+page.svelte:2109). `hasResults` = `lines.length > 0` [:2048](apps/web/src/routes/+page.svelte:2048); `lines` = `$state<LineData[]>([])` [:246](apps/web/src/routes/+page.svelte:246), filled only once transcription runs; an effect waits on the dictionary loader then runs `joinText('paste')` [:2851-2858](apps/web/src/routes/+page.svelte:2851). Neither that nor `flushText` [:2842-2845](apps/web/src/routes/+page.svelte:2842) reads `activeTab`; `IntakePanel` mounts unconditionally under Studio (N.73 S2), not per tab. Parts: line count (`poemLineCount > 0`), word count (`lines.length > 0`), placed count (`lines.length > 0` + `ingestedScore !== null`). No tab-conditioned code found; reads as a timing race against the dictionary-ready effect.

## F7. Two filled buttons in INPUT after a drop

`Transcribe and fit`: [IntakePanel.svelte:613-618](apps/web/src/lib/components/Drawer/IntakePanel.svelte:613), `transcribeActs` = `$derived(canTranscribe && (doc.inputText !== transcribedText || uploaderEl?.hasWaitingScore() === true))` [+page.svelte:3485-3487](apps/web/src/routes/+page.svelte:3485). `Continue to analysis`: [ScoreUploader.svelte:879](apps/web/src/lib/shane/ScoreUploader.svelte:879), only inside `ui.kind === 'done'` [:804](apps/web/src/lib/shane/ScoreUploader.svelte:804); `Try another file`: [:878](apps/web/src/lib/shane/ScoreUploader.svelte:878). `hasWaitingScore()` = `ui.kind === 'done'` [:546-548](apps/web/src/lib/shane/ScoreUploader.svelte:546). Both pills fill from one fact — a read score waiting, unaccepted — since `transcribeActs`'s second disjunct is exactly `hasWaitingScore() === true`.

`handleTranscribe` today ([+page.svelte:2361-2394](apps/web/src/routes/+page.svelte:2361)): (1) returns if `!canTranscribe`; (2) `transcribeText()` unconditionally — 2026-09-07 ruling [:2365-2367](apps/web/src/routes/+page.svelte:2365), "the button keeps its explicit act"; (3) `uploaderEl?.acceptWaiting()`, accepting the waiting score exactly when `ui.kind === 'done'` ([ScoreUploader.svelte:552-559](apps/web/src/lib/shane/ScoreUploader.svelte:552)), same `accept()` Continue calls; (4) if `lines.length > 0`, breath-in, per-word console log, focus first word stack next frame [+page.svelte:2369-2393](apps/web/src/routes/+page.svelte:2369).

## NOT ESTABLISHED

- F1: causation, only correlation from the CSS. Needs a browser run with
the layer/paint inspector open.
- F2: `STATION_IDS`'s declaration site not opened, only call sites.
`IntakePanel.svelte`'s internal layout (where "under the poem box" lands) not read.
- F4: no code site opens Piece or Text on arrival/analysis-tab choice,
contradicting the walk. Needs a fresh-incognito run with `localStorage` checked before/after the drop, or Dann confirming the profile was truly first-run.
- F6: read as a timing race against the dictionary-ready effect, not a
tab-conditioned path; needs a run with the dictionary load slowed/logged.
- Whether `IntakePanel.svelte`'s poem box is one element or a structured
region (F2) not read past confirming `inputGroup` renders it as sole child.

