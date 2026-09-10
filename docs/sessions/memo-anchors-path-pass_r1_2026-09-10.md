# Memo: anchors for the drawer path pass

Read-only session. Sonnet, `~/Desktop/ilya-rewrite`, branch `Shane`, 2026-09-10. Answers `docs/sessions/brief-anchors-path-pass_r1_2026-09-10.md`.

## 1. Empty drawer opens Input alone

| what | path:line | owner component | i18n keys | test |
|---|---|---|---|---|
| Piece, Input, Text, Score markup bands render unconditionally, no band-level open/closed state | [Drawer.svelte:435-489](apps/web/src/lib/components/Drawer/Drawer.svelte:435) | `Drawer.svelte` | `group.piece`/`group.input`/`group.text`/`group.scoreMarkup`, en=fr in every case, e.g. `{ en: 'Piece', fr: 'Piece' }` | NOT ESTABLISHED — no test |
| Only sub-stations toggle; nothing opens by default | [sections.svelte.ts:54](apps/web/src/lib/components/Drawer/sections.svelte.ts:54) `FIRST_RUN_STATIONS = []` | `sections.svelte.ts` (`SectionSet`) | none (mechanism, not string) | [sections.test.ts:113-116](apps/web/src/lib/components/Drawer/sections.test.ts:113) "opens nothing on a first run" |
| Piece's fields (`metadataBody`) toggle via `metadataOpen`/`onmetadatatoggle`, default closed | [Drawer.svelte:101](apps/web/src/lib/components/Drawer/Drawer.svelte:101), [:140](apps/web/src/lib/components/Drawer/Drawer.svelte:140) `metadataOpen = false`, [:448-460](apps/web/src/lib/components/Drawer/Drawer.svelte:448) | `Drawer.svelte`; body is `MetadataFields.svelte` | `meta.heading`: `{ en: 'Metadata', fr: 'Métadonnées' }` ([i18n.ts:168](apps/web/src/lib/i18n.ts:168)) | NOT ESTABLISHED |
| Repertoire and Export/import stations inside Piece are separate toggles, independent of Piece's own band; nothing collapses Piece to one state line today | [RootPanel.svelte:113-127](apps/web/src/lib/components/Drawer/RootPanel.svelte:113) (Repertoire), [:148-180](apps/web/src/lib/components/Drawer/RootPanel.svelte:148) (Export/import) | `RootPanel.svelte` | `binder.heading`: `{ en: 'Export and import', fr: 'Export and import' }` ([i18n.ts:66](apps/web/src/lib/i18n.ts:66)) | NOT ESTABLISHED |
| Input has no station row at all and is never closed (by design, N.108-5) | [Drawer.svelte:475-478](apps/web/src/lib/components/Drawer/Drawer.svelte:475) | `IntakePanel.svelte` (always mounted) | `group.input` (above) | NOT ESTABLISHED |
| Score markup has no open state either. Corrections toggles (closed by default, gated on `ingestedScore`); Voice cannot close and its body renders whenever `INCLUDE_SHANE` is on, regardless of whether a song/score exists | [+page.svelte:4193-4260](apps/web/src/routes/+page.svelte:4193) (Corrections, gated), [:4261-4307](apps/web/src/routes/+page.svelte:4261) (Voice, ungated beyond `INCLUDE_SHANE`), [sections.svelte.ts:85-89](apps/web/src/lib/components/Drawer/sections.svelte.ts:85) (comment: voice left `STATION_IDS` at N.114a, cannot collapse) | `StationHeader.svelte` draws no chevron when given no `ontoggle` ([+page.svelte:4295](apps/web/src/routes/+page.svelte:4295)) | `voice.heading`: `{ en: 'Voice', fr: 'Voice' }` ([i18n.ts:80](apps/web/src/lib/i18n.ts:80)), `loupe.station.corrections`: `{ en: 'Corrections', fr: 'Corrections' }` ([i18n.ts:460](apps/web/src/lib/i18n.ts:460)) | [sections.test.ts:205](apps/web/src/lib/components/Drawer/sections.test.ts:205) "drops `voice`, whose station N.114a stopped collapsing" |
| The flag gating Score markup's whole group | [wall.ts:6-7](apps/web/src/lib/wall.ts:6) `INCLUDE_SHANE` | `wall.ts` | — | NOT ESTABLISHED |

## 2. A closed band shows one state line under it

| what | path:line | owner component | i18n keys | test |
|---|---|---|---|---|
| No band renders anything today while its content is toggled off — the four group bands have no closed-state line at all; only the "from score" tag and the numbers below exist as raw state | see §1 rows above | — | — | NOT ESTABLISHED |
| "from score" tag, existing component and class | [MetadataFields.svelte:99,110,122,134,146](apps/web/src/lib/components/Drawer/MetadataFields.svelte:99) `.meta-from-score` / `.meta-from-score-select` | `MetadataFields.svelte` | `meta.fromScore`: `{ en: 'from score', fr: 'de la partition' }` ([i18n.ts:704](apps/web/src/lib/i18n.ts:704)) | NOT ESTABLISHED |
| Line count | [IntakePanel.svelte:157](apps/web/src/lib/components/Drawer/IntakePanel.svelte:157) `lineCount`, rendered [:423](apps/web/src/lib/components/Drawer/IntakePanel.svelte:423) | `IntakePanel.svelte` | `intake.lines`: `{ en: '%s lines', fr: '%s lines' }` ([i18n.ts:572](apps/web/src/lib/i18n.ts:572)) | NOT ESTABLISHED |
| Word count | [+page.svelte:2073](apps/web/src/routes/+page.svelte:2073) `wordCount`, passed to `IntakePanel` as a prop | `+page.svelte` → `IntakePanel.svelte` | NOT ESTABLISHED — no dedicated key found for a bare word count | NOT ESTABLISHED |
| Placed count | [+page.svelte:386](apps/web/src/routes/+page.svelte:386) `placedSlotCount`, `slotQueue.length` is the total | `+page.svelte` | none (bare, see item 7) | NOT ESTABLISHED |
| Corrected-note count | [+page.svelte:655](apps/web/src/routes/+page.svelte:655) `correctedCount` | `+page.svelte` | `correct.count`/`correct.countOne` (rendered [:4250-4256](apps/web/src/routes/+page.svelte:4250)), NOT ESTABLISHED exact en/fr text (not opened) | NOT ESTABLISHED |
| Sampled-vowel count ("10 of 10") | [CalibrationWizard.svelte:315](apps/web/src/lib/shane/CalibrationWizard.svelte:315) `capturedCount`, denominator `ALL_VOWELS.length` rendered [:1429](apps/web/src/lib/shane/CalibrationWizard.svelte:1429) — this is the wizard's summary screen, not today's drawer Voice station | `CalibrationWizard.svelte` | `calib.summary.progressLedeSuffix`: "...vowels sampled..." ([i18n.ts:1035](apps/web/src/lib/i18n.ts:1035)), not "Voice: Dann · 10 of 10" | NOT ESTABLISHED |
| Notation departures from default (the "7" in "2 of 7 changed") | 5 fields in `NotationPreferences` ([engine.ts:25-36](packages/phonology/src/engine.ts:25), all false = Grayson default) + `showStressDiacritics` ([+page.svelte:1918](apps/web/src/routes/+page.svelte:1918), default false) + `doc.openSyllabification` ([+page.svelte:1919,2435](apps/web/src/routes/+page.svelte:1919)) = 7 toggles total, rendered in [NotationFields.svelte:110-207](apps/web/src/lib/components/Drawer/NotationFields.svelte:110) | `NotationFields.svelte` | closest existing string is `inspector.notationDefault`: `{ en: 'Notation: default (Grayson)', fr: 'Notation : par défaut (Grayson)' }` ([i18n.ts:495](apps/web/src/lib/i18n.ts:495)) — NOT "Grayson defaults" | NOT ESTABLISHED — no function found that counts departures from default |

## 3. One filled pill per surface

| what | path:line | owner component | i18n keys | test |
|---|---|---|---|---|
| Transcribe and fit — the only filled button in Piece/Input | [IntakePanel.svelte:565](apps/web/src/lib/components/Drawer/IntakePanel.svelte:565) `.action-btn.btn-primary`, handler `ontranscribe` | `IntakePanel.svelte` | `input.transcribe`/`input.transcribeLoading` (rendered [:569](apps/web/src/lib/components/Drawer/IntakePanel.svelte:569)), verbatim text NOT ESTABLISHED (not opened in i18n.ts) | NOT ESTABLISHED |
| Whether Transcribe and fit still changes anything after N.112 | [+page.svelte:2287-2299](apps/web/src/routes/+page.svelte:2287) `handleTranscribe` | `+page.svelte` | — | NOT ESTABLISHED |
| Calibrate / Re-calibrate — the only filled button in Score markup | [VoiceAnchor.svelte:44-46](apps/web/src/lib/components/Drawer/VoiceAnchor.svelte:44) (derivation), [:55](apps/web/src/lib/components/Drawer/VoiceAnchor.svelte:55) (render), `.voice-action` fill rule [:107-119](apps/web/src/lib/components/Drawer/VoiceAnchor.svelte:107) | `VoiceAnchor.svelte` | `calib.anchor.calibrate`: `{ en: 'Calibrate', fr: 'Calibrer' }`, `calib.anchor.recalibrate`: `{ en: 'Re-calibrate', fr: 'Recalibrer' }` ([i18n.ts:903-904](apps/web/src/lib/i18n.ts:903)) | NOT ESTABLISHED |
| No other `.btn-primary` / filled pill found on the front side (`RootPanel.svelte`, `MetadataFields.svelte`, `SongList.svelte` all use `.btn-ghost` / outlined pills only) | grepped, not individually opened beyond files cited above | — | — | NOT ESTABLISHED |

`handleTranscribe` in one sentence, from the code: it always calls `transcribeText()` and `uploaderEl?.acceptWaiting()` and, when lines exist, triggers a breath-in animation and a console log — it never short-circuits on unchanged text, per the 2026-09-07 ruling quoted at [+page.svelte:2291](apps/web/src/routes/+page.svelte:2291) ("the button keeps its explicit act"); re-seating an already-attached score on a poem edit is out of scope for it and is N.112, per the comment at [+page.svelte:2282-2285](apps/web/src/routes/+page.svelte:2282).

## 4. "Calibrate" as the first-time verb

| what | path:line | owner component | i18n keys | test |
|---|---|---|---|---|
| Re-calibrate's render site and i18n key | [VoiceAnchor.svelte:55](apps/web/src/lib/components/Drawer/VoiceAnchor.svelte:55) | `VoiceAnchor.svelte` | `calib.anchor.recalibrate` (see §3) | NOT ESTABLISHED |
| How the component knows a voice profile exists | `calibrated` prop, derived [+page.svelte:2060](apps/web/src/routes/+page.svelte:2060) `const voiceCalibrated = $derived(hasAnyReadings(shaneFormants))`, passed [:4302](apps/web/src/routes/+page.svelte:4302); predicate itself at [profileStore.ts:119](apps/web/src/lib/shane/profileStore.ts:119) `hasAnyReadings` | `+page.svelte` / `profileStore.ts` | — | NOT ESTABLISHED |

## 5. The METADATA word on the Piece band is struck

| what | path:line | owner component | i18n keys | test |
|---|---|---|---|---|
| The button carrying METADATA, confirmed at the cited lines | [Drawer.svelte:448-456](apps/web/src/lib/components/Drawer/Drawer.svelte:448) `.band-link`, `onclick={() => onmetadatatoggle?.()}` | `Drawer.svelte` | `meta.heading` (see §1) | NOT ESTABLISHED |
| What it toggles | `metadataOpen` boolean prop, gates `metadataBody` render at [Drawer.svelte:458-460](apps/web/src/lib/components/Drawer/Drawer.svelte:458) | `Drawer.svelte` | — | NOT ESTABLISHED |
| Whether Piece has a separate open state from the metadata body's | Confirmed separate: Piece's band itself never closes (§1); Repertoire and Export/import are their own `sections.has(STATION_IDS.repertoire\|binder)` toggles ([RootPanel.svelte:125-126](apps/web/src/lib/components/Drawer/RootPanel.svelte:125), [:151-152](apps/web/src/lib/components/Drawer/RootPanel.svelte:151)); metadata is the fourth, independent state (`metadataOpen`) | `Drawer.svelte`, `RootPanel.svelte`, `sections.svelte.ts` | — | NOT ESTABLISHED |

## 6. The empty field's placeholder and the caption under it

| what | path:line | owner component | i18n keys (verbatim) | test |
|---|---|---|---|---|
| Placeholder string and render site | [IntakePanel.svelte:372](apps/web/src/lib/components/Drawer/IntakePanel.svelte:372) `placeholder={t('intake.placeholder', language)}` | `IntakePanel.svelte` | `intake.placeholder`: `{ en: 'Paste or type the poem here. A score or a photograph dropped here is read as what it is.', fr: 'Paste or type the poem here. A score or a photograph dropped here is read as what it is.' }` ([i18n.ts:570](apps/web/src/lib/i18n.ts:570)) — fr is currently an untranslated copy of en | NOT ESTABLISHED |
| Choose a file pill and its key | [IntakePanel.svelte:531-535](apps/web/src/lib/components/Drawer/IntakePanel.svelte:531) `.action-btn.btn-ghost`, always drawn per the comment at [:526-530](apps/web/src/lib/components/Drawer/IntakePanel.svelte:526) | `IntakePanel.svelte` | `intake.choose`: `{ en: 'Choose a file', fr: 'Choose a file' }` ([i18n.ts:579](apps/web/src/lib/i18n.ts:579)) — fr untranslated | NOT ESTABLISHED |
| Intake hint under the field and its key | [IntakePanel.svelte:406-408](apps/web/src/lib/components/Drawer/IntakePanel.svelte:406), gated `{#if !sourceIsEmpty \|\| score}` — today it is hidden while the field is empty, the opposite of Plate A's caption which shows only when empty | `IntakePanel.svelte` | `intake.dropHint`: `{ en: 'Drop the other kind here, or a new file of the same kind to replace it.', fr: 'Drop the other kind here, or a new file of the same kind to replace it.' }` ([i18n.ts:580](apps/web/src/lib/i18n.ts:580)) — fr untranslated, and this string is not the Plate A caption string ("A score or a photograph can go here too...") | NOT ESTABLISHED |
| Drop handler, for the caption's "choose a file" link | `chooseFile()` at [IntakePanel.svelte:199](apps/web/src/lib/components/Drawer/IntakePanel.svelte:199) (opens the picker; wired to the same `fileInputEl` the drop path uses); drop itself via `ondrop={onDrop}` [:353](apps/web/src/lib/components/Drawer/IntakePanel.svelte:353) | `IntakePanel.svelte` | — | NOT ESTABLISHED |

## 7. "37 / 94 placed" on the syllable line's row

| what | path:line | owner component | i18n keys | test |
|---|---|---|---|---|
| Where the count renders today | [IntakePanel.svelte:500](apps/web/src/lib/components/Drawer/IntakePanel.svelte:500) (open row) and [:513](apps/web/src/lib/components/Drawer/IntakePanel.svelte:513) (closed row), both `.syl-count`, `{syllablesPlaced} / {syllablesTotal}` | `IntakePanel.svelte` | Bare — no i18n key. No "placed" word is rendered in either span. | NOT ESTABLISHED |

## NOT ESTABLISHED

- Word count's i18n key, if any, was not found under an obvious name; not confirmed either way — grep only, not read against every key in `i18n.ts`.
- Verbatim en/fr text for `input.transcribe`, `input.transcribeLoading`, `correct.count`, `correct.countOne` — found by name, not opened in `i18n.ts`.
- Whether any function already computes "N of 7 changed" (a diff of the seven notation toggles against default) — none found under an obvious name; the 7 fields themselves are confirmed (§2).
- Whether `doc.openSyllabification`'s default is `false` — inferred from its role as a toggle with a Grayson-default posture, not read at its declaration site.
- The exact denominator/count backing "Voice: Dann · 10 of 10" on the front-side Voice station — no such number is computed outside the calibration wizard's own summary screen (`CalibrationWizard.svelte`); whether the drawer's Voice station reads the same `hasAnyReadings`/`ALL_VOWELS` pair was not traced further.
- Whether `RootPanel.svelte`, `MetadataFields.svelte`, and `SongList.svelte` contain any filled pill beyond what grep surfaced — confirmed by pattern search (`btn-primary`, `pill fill`) across the Drawer component directory, not by opening every line of each file.

## What I noticed but was not asked

- `group.piece`, `group.input`, `group.text`, `group.scoreMarkup`, `binder.heading`, `voice.heading`, and `loupe.station.corrections` all carry identical English and French strings in `i18n.ts` — the four band names and two station names are untranslated.
- `intake.placeholder`, `intake.choose`, and `intake.dropHint` are also untranslated (fr equals en verbatim), which bears on the French table's ratified strings for the same surface.
- Voice's block in `+page.svelte` (`:4294-4307`) renders unconditionally under `INCLUDE_SHANE`, with no gate on `ingestedScore` or on the song being empty — so today's Score markup group is not "band and nothing under it" on an empty song; it already shows the Voice line.
- `IntakePanel.svelte`'s drop-hint guard (`!sourceIsEmpty || score`) is inverted relative to Plate A's caption, which is drawn only in the empty state.
- No Svelte component test exists for `IntakePanel.svelte`, `MetadataFields.svelte`, `VoiceAnchor.svelte`, `RootPanel.svelte`, or `Drawer.svelte`; the only Drawer-directory tests are `sections.test.ts`, `gesture.test.ts`, and `layout.test.ts`.
