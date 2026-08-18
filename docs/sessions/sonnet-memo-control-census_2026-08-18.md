# Sonnet memo: control and surface census, 2026-08-18, tree 6ba87e1

**Farmed to Sonnet by Fable in the GUI session, on Dann's "Proceed."
COST, stated honestly: bounded in advance at 1 agent, ~120k tokens worst case;
actual spend 329,561 tokens over 58 tool uses, 2.7 times the bound. The bound
was wrong; the ceiling of two agents was not exceeded.
Memo filed verbatim below the rule; nothing edited except this header.**

---

# Control and surface census, 2026-08-18, tree 6ba87e1

Method note: files were staged from the device via `mcp__remote-devices__device_stage_files` and read from the staged copies at `/mnt/user-data/uploads/ilya-rewrite/apps/web/src/...`, which mirror the repo paths under `apps/web/src/...`. Every path:line below refers to the repo path (the staged mirror uses the identical relative path). Beyond the 11 named files, I staged and read every `.svelte` import that renders a control, listed at the end of each surface's row in Section 1. TOC and other long, structurally-identical repeats are reported as one row with an exact count and line range rather than individually, and this is noted at each such row — the count itself was verified by `grep -c`, not estimated.

## 1. Surfaces

| Surface | path:line | Tabs today | Disposition | Rule |
|---|---|---|---|---|
| App bar (HeaderBar.svelte) | `lib/components/HeaderBar.svelte:27-60` | all | DISPOSITION NOT ESTABLISHED — no rule states what happens to the sigil/language-toggle bar or its per-tab colour keying once tab identity changes to Studio/Learn/Guide | R9 |
| TabBar, desktop in-drawer mount | `lib/components/Drawer/Drawer.svelte:436-438` | all | DELETED | R1 |
| TabBar, mobile bottom-bar mount | `routes/+page.svelte:2021-2025` | all | DELETED | R1 |
| Drawer (Transcription root panel) | `lib/components/Drawer/Drawer.svelte:163-164` rendering `RootPanel.svelte` | transcription | MERGES into Studio drawer | R2 |
| Drawer (Fit/Shane panel) | `routes/+page.svelte:1743-1915` (`shanePanel` snippet) | shane | MERGES into Studio drawer | R2 |
| Learn TOC nav | `lib/components/Drawer/Drawer.svelte:166-334` | learn | KEEPS (TOC drawer) | R6 |
| Guide TOC nav | `lib/components/Drawer/Drawer.svelte:336-421` | guide | KEEPS (TOC drawer) | R6 |
| NOTATION anchor (bottom-pinned today) | `lib/components/Drawer/Drawer.svelte:431-435`, rendered by `routes/+page.svelte:1917-1952` | transcription, shane | MOVES to top anchor, pinned with Piece | R2 |
| Desktop drawer lip (pull) | `lib/components/Drawer/Drawer.svelte:441-454` | all (desktop) | DISPOSITION NOT ESTABLISHED — no rule states what the pull becomes under the merged drawer | R9 |
| Mobile drawer top handle (pull) | `lib/components/Drawer/Drawer.svelte:138-150` | all (mobile) | DISPOSITION NOT ESTABLISHED | R9 |
| Mobile "paper handle" re-open control | `routes/+page.svelte:2006-2019` | all (mobile) | DISPOSITION NOT ESTABLISHED | R9 |
| InspectorPanel | `lib/components/Drawer/InspectorPanel.svelte:968-1401` | transcription | MOVES into ANALYSIS station, stays resident | R2 |
| MetadataFields, Transcription instance | `lib/components/Drawer/MetadataFields.svelte`, mounted at `lib/components/Drawer/RootPanel.svelte:141` | transcription | DUPLICATE — DELETED, merged with the Fit instance | R3 |
| MetadataFields, Fit instance | same component, mounted at `routes/+page.svelte:1751-1757` | shane | DUPLICATE — DELETED, merged with the Transcription instance | R3 |
| MetadataFields (merged survivor) | n/a (post-merge) | — | MOVES to top anchor, pinned as Piece | R2 |
| SongList (library door) | `lib/components/Drawer/SongList.svelte`, mounted at `lib/components/Drawer/RootPanel.svelte:245-256` | transcription only (no Fit duplicate) | MOVES into SONGS station | R2 |
| ScoreUploader (score drop zone) | `lib/shane/ScoreUploader.svelte:496-676`, mounted at `routes/+page.svelte:1776-1783` | shane | MERGES into SOURCE station, alongside the textarea and Transcribe | R2 |
| RootPanel textarea + OCR | `lib/components/Drawer/RootPanel.svelte:144-187` | transcription | MERGES into SOURCE station | R2 |
| RootPanel button row (Clear/Print/Transcribe) | `lib/components/Drawer/RootPanel.svelte:211-232` | transcription | Clear/Transcribe MERGE into SOURCE station; Print is a DUPLICATE, see Section 2 | R2, R3 |
| RootPanel binder row (Export/Import) | `lib/components/Drawer/RootPanel.svelte:236-239` | transcription | DUPLICATE of the Fit binder row — MERGES into OUTPUT station | R2 |
| Fit print control | `routes/+page.svelte:1875-1883` | shane | DUPLICATE of RootPanel's Print — DELETED, merged into one OUTPUT Print | R3 |
| Fit binder row (Export/Import) | `routes/+page.svelte:1887-1894` | shane | DUPLICATE of RootPanel's binder row — MERGES into one OUTPUT Export/Import | R2 |
| SyllableStation | `lib/shane/SyllableStation.svelte:106-129`, mounted at `routes/+page.svelte:1791-1798` | shane | MERGES into Studio drawer; which named station (SOURCE, ANALYSIS, or a new one) is DISPOSITION NOT ESTABLISHED | R2, R9 |
| ShiftLyricsControl | `lib/shane/ShiftLyricsControl.svelte:40-80`, mounted at `routes/+page.svelte:1799` | shane | MERGES into Studio drawer; station placement NOT ESTABLISHED | R2, R9 |
| "Start over" placement-rebuild control | `routes/+page.svelte:1819-1821` | shane | MERGES into Studio drawer; station placement NOT ESTABLISHED | R9 |
| CalibrationWizard (all phases) | `lib/shane/CalibrationWizard.svelte:1261-1607`, mounted at `routes/+page.svelte:1895-1913` | shane | MOVES to the one calibration takeover | R4 |
| ProfileSwitcher — first-launch naming (no voices) | `lib/shane/ProfileSwitcher.svelte:161-189` | shane | "inline profile-name + Start controls" — LEAVES the scroll, moves into the takeover | R4 |
| ProfileSwitcher — header + accordion panel (voices exist) | `lib/shane/ProfileSwitcher.svelte:191-276`, mounted at `CalibrationWizard.svelte:1299-1310` | shane | The header collapses to the bottom-pinned voice line; the accordion body (list/new/duplicate/rename/delete) MOVES into the takeover | R2, R4 |
| Pacifier (vowel wheel) | `lib/shane/pacifier/Pacifier.svelte:748-854`, mounted at `CalibrationWizard.svelte:1402-1413` | shane | MOVES with CalibrationWizard into the takeover | R4 |
| NotePicker ×6 (voice characteristics) | `lib/shane/NotePicker.svelte:150-288`, mounted at `CalibrationWizard.svelte:1539-1597` | shane | MOVES with CalibrationWizard into the takeover | R4 |
| VoiceProfilePane (score/envelope pages) | `lib/shane/VoiceProfilePane.svelte:689-858` | shane | Candidate for the "Marked score" document under the new segmented pair; exact mapping DISPOSITION NOT ESTABLISHED | R1, R9 |
| Paper (Transcription document) | `lib/components/Paper/Paper.svelte:60-99` | transcription | Candidate for the "Transcription" document under the new segmented pair; stays non-interactive except word click | R1, R7 |
| WordStack (per word on Paper) | `lib/components/Paper/WordStack.svelte:133-196` | transcription | KEEPS (already-ruled word-selection interaction) | R7 |
| ReadingPaper + LearnContent | `lib/components/Paper/ReadingPaper.svelte:13-17`, `lib/components/Reading/LearnContent.svelte` (no interactive controls found) | learn | KEEPS | R6 |
| ReadingPaper + GuideContent | same, `lib/components/Reading/GuideContent.svelte` (external links only) | guide | KEEPS | R6 |
| Mobile "designed for desktop" interstitial | `routes/+page.svelte:1588-1604` | all (mobile) | DELETED | R5 |
| Replace/recognize confirmation `<dialog>` (song-arrival takeover) | `routes/+page.svelte:1637-1667` | transcription/shane | DISPOSITION NOT ESTABLISHED — tension with R4's "ONE takeover": unclear whether this second, unrelated takeover survives, is folded in, or is simply outside R4's scope | R9 |
| Update-available toast | `routes/+page.svelte:2026-2049` | all | DISPOSITION NOT ESTABLISHED | R9 |
| InstallPrompt | `lib/components/InstallPrompt.svelte:82-95`, mounted at `routes/+page.svelte:1669` | all | DISPOSITION NOT ESTABLISHED | R9 |
| Fit "arranger provenance" note, "no lyrics" notice, storage-failure notices | `routes/+page.svelte:1758-1843` (non-interactive text, not controls) | shane | n/a — no controls, listed for completeness | — |

## 2. Controls

Grouped, repeated rows (TOC links, dictionary entries, per-syllable/per-vowel/per-song row actions) are counted exactly (via `grep -c`) and reported as one row rather than individually, noted in the "kind" column.

| # | Control | path:line | Kind | Surface today | Tabs | Desktop/mobile notes | Disposition | Rule |
|---|---|---|---|---|---|---|---|---|
| 1 | English/Français toggle (2 spans, role=button) | `lib/components/HeaderBar.svelte:39-59` | clickable text, keyboard-operable | App bar | all | none seen | NOT ESTABLISHED | R9 |
| 2 | Tab buttons (3 or 4, `INCLUDE_SHANE`-gated) | `lib/components/Drawer/TabBar.svelte:69-83` | tab (role=tab) | TabBar, both mounts | all | mobile mount hides desktop's internal TabBar (`Drawer.svelte:1000-1003`); mobile fixed footer used instead | DELETED | R1 |
| 3 | Learn TOC: 58 heading-link buttons + 7 section chevrons (65 total, verified by grep) | `lib/components/Drawer/Drawer.svelte:170-333` | button (nav link / disclosure) | Learn TOC | learn | chevrons widen to 44×44px under `max-width:767px` (`Drawer.svelte:1024-1027`) | KEEPS | R6 |
| 4 | Guide TOC: 27 heading-link buttons + 5 section chevrons (32 total, verified by grep) | `lib/components/Drawer/Drawer.svelte:341-419` | button (nav link / disclosure) | Guide TOC | guide | same mobile chevron rule | KEEPS | R6 |
| 5 | Desktop drawer lip (collapse/expand) | `lib/components/Drawer/Drawer.svelte:441-454` | button | Drawer | all | `display:none` under `max-width:767px` (`:975-977`) — mobile uses control #6 instead | NOT ESTABLISHED | R9 |
| 6 | Mobile drawer top handle (collapse) | `lib/components/Drawer/Drawer.svelte:139-149` | button | Drawer | all | only rendered when `isMobile` (`Drawer.svelte:138`) | NOT ESTABLISHED | R9 |
| 7 | Mobile paper-handle (re-open drawer) | `routes/+page.svelte:2007-2018` | button | main content | all | only when `isMobile && drawerCollapsed` | NOT ESTABLISHED | R9 |
| 8 | Metadata: Title input | `lib/components/Drawer/MetadataFields.svelte:65-71` | text input | Transcription + Fit drawers (×2) | transcription, shane | none seen | MERGE (R3) then MOVE to Piece anchor (R2) | R2, R3 |
| 9 | Metadata: Opus input | `MetadataFields.svelte:75-84` | text input | same ×2 | transcription, shane | none seen | MERGE, MOVE | R2, R3 |
| 10 | Metadata: Composer searchable select | `MetadataFields.svelte:87-96`, dropdown at `lib/components/Drawer/SearchableSelect.svelte:159-234` | combobox (trigger button + text input + option buttons) | same ×2 | transcription, shane | none seen | MERGE, MOVE | R2, R3 |
| 11 | Metadata: Poet searchable select | `MetadataFields.svelte:99-108` | combobox | same ×2 | transcription, shane | none seen | MERGE, MOVE | R2, R3 |
| 12 | Metadata: Translator searchable select | `MetadataFields.svelte:111-120` | combobox | same ×2 | transcription, shane | none seen | MERGE, MOVE | R2, R3 |
| 13 | Metadata: "Revert to score header" | `MetadataFields.svelte:123-126` | button, conditional | Fit drawer instance only | shane | passed only from `+page.svelte:1756` | MERGE, MOVE | R2, R3 |
| 14 | Metadata: Reset | `MetadataFields.svelte:128-134` | button | same ×2 | transcription, shane | none seen | MERGE, MOVE | R2, R3 |
| 15 | Textarea (transcription input) | `lib/components/Drawer/RootPanel.svelte:145-153` | textarea | RootPanel | transcription | `max(1rem,16px)` font floor at `pointer:coarse` (`app.css:270-276`) | MERGES into SOURCE | R2 |
| 16 | OCR scan button | `RootPanel.svelte:156-177` | button | RootPanel | transcription | none seen | MERGES into SOURCE | R2 |
| 17 | Hidden OCR file input | `RootPanel.svelte:180-186` | file input | RootPanel | transcription | none seen | MERGES into SOURCE | R2 |
| 18 | Clear | `RootPanel.svelte:212-217` | button | RootPanel | transcription | none seen | MERGES into SOURCE | R2 |
| 19 | Print (Transcription instance) | `RootPanel.svelte:218-224` | button | RootPanel | transcription | no `:disabled` style, unlike Fit's twin (comment at `+page.svelte:2080-2084`) | DUPLICATE — MERGES into one OUTPUT Print | R3 |
| 20 | Transcribe | `RootPanel.svelte:225-231` | button | RootPanel | transcription | none seen | MERGES into SOURCE | R2 |
| 21 | Export (binder), Transcription instance | `RootPanel.svelte:237` | button | RootPanel | transcription | none seen | DUPLICATE — MERGES into OUTPUT | R2 |
| 22 | Import (binder), Transcription instance | `RootPanel.svelte:238` | button | RootPanel | transcription | clicks the shared hidden input at `+page.svelte:1624-1635` | DUPLICATE — MERGES into OUTPUT | R2 |
| 23 | SongList: Open (per song, dynamic count) | `lib/components/Drawer/SongList.svelte:104-112` | button | RootPanel | transcription | none seen | MOVES into SONGS | R2 |
| 24 | SongList: Rename (per song) | `SongList.svelte:113-115` | button | RootPanel | transcription | none seen | MOVES into SONGS | R2 |
| 25 | SongList: rename text input + Save + Cancel | `SongList.svelte:90-102` | text input + 2 buttons, conditional on rename mode | RootPanel | transcription | none seen | MOVES into SONGS | R2 |
| 26 | SongList: Delete (per song, withheld on legacy driver or last song) | `SongList.svelte:116-120` | button, conditional | RootPanel | transcription | none seen | MOVES into SONGS | R2 |
| 27 | SongList: New song (withheld when not plural) | `SongList.svelte:133-135` | button, conditional | RootPanel | transcription | none seen | MOVES into SONGS | R2 |
| 28 | NOTATION disclosure toggle | `lib/components/Drawer/NotationFields.svelte:86-94` | button (accordion header) | Drawer anchor | transcription, shane | 44px floor at `pointer:coarse` (`:268-272`) | MOVES to top Piece+NOTATION anchor; default `expanded=true` today (`+page.svelte:137`) vs. ruled "collapsed by default" | R2 |
| 29 | NOTATION: 7 toggle switches (stress acutes, reduced vowel, palatal nasal, geminates, shcha, reconstitution, open syllabification) | `NotationFields.svelte:100-194` | switch (role=switch) ×7 | Drawer anchor | transcription, shane | none seen | MOVES with #28 | R2 |
| 30 | InspectorPanel: Dictionary toggle | `lib/components/Drawer/InspectorPanel.svelte:984-991` | button | InspectorPanel | transcription | none seen | MOVES into ANALYSIS | R2 |
| 31 | InspectorPanel: per-word Reset (conditional) | `InspectorPanel.svelte:995-1001` | button | InspectorPanel | transcription | none seen | MOVES into ANALYSIS | R2 |
| 32 | InspectorPanel: spot reconstitution checkbox | `InspectorPanel.svelte:1010-1015` | checkbox, conditional | InspectorPanel | transcription | none seen | MOVES into ANALYSIS | R2 |
| 33 | InspectorPanel: dictionary gloss text input | `InspectorPanel.svelte:1033-1040` | text input, in expansion panel | InspectorPanel | transcription | none seen | MOVES into ANALYSIS | R2 |
| 34 | InspectorPanel: dictionary entry choice buttons (dynamic per word, only rendered when selectable) | `InspectorPanel.svelte:1071-1091` | button, dynamic | InspectorPanel | transcription | none seen | MOVES into ANALYSIS | R2 |
| 35 | InspectorPanel: ribbon atom buttons (dynamic per character; drag-eligible subset also carry pointer drag handlers) | `InspectorPanel.svelte:1162-1200`, drag handlers `:701-819` | button + drag handle, dynamic | InspectorPanel | transcription | pointer-based drag; 20px commit threshold | MOVES into ANALYSIS | R2 |
| 36 | InspectorPanel: clitic-arrow atom buttons (enclitic/proclitic) | `InspectorPanel.svelte:1117-1127`, `1266-1276` | button, conditional | InspectorPanel | transcription | none seen | MOVES into ANALYSIS | R2 |
| 37 | InspectorPanel: stress-circle buttons (per syllable) | `InspectorPanel.svelte:1215-1228` | button, dynamic | InspectorPanel | transcription | none seen | MOVES into ANALYSIS | R2 |
| 38 | InspectorPanel: ё sigil toggle (per candidate character) | `InspectorPanel.svelte:1184-1198` | span, role=button, dynamic | InspectorPanel | transcription | none seen | MOVES into ANALYSIS | R2 |
| 39 | InspectorPanel: ё provenance chooser (3 buttons, conditional) | `InspectorPanel.svelte:1306-1314` | button ×3 | InspectorPanel | transcription | none seen | MOVES into ANALYSIS | R2 |
| 40 | InspectorPanel: stress provenance chooser (3-4 buttons, conditional) | `InspectorPanel.svelte:1326-1338` | button ×3-4 | InspectorPanel | transcription | none seen | MOVES into ANALYSIS | R2 |
| 41 | ScoreUploader: dropzone (click + drag/drop) | `lib/shane/ScoreUploader.svelte:499-516` | button, drop zone | ScoreUploader | shane | `accept` list dropped on mobile (N.70, `:79-103`) | MERGES into SOURCE | R2 |
| 42 | ScoreUploader: scan icon (visual only, not yet wired) | `ScoreUploader.svelte:520-534` | button | ScoreUploader | shane | none seen | MERGES into SOURCE | R2 |
| 43 | ScoreUploader: hidden file input | `ScoreUploader.svelte:651-657` | file input | ScoreUploader | shane | `accept` dropped on mobile | MERGES into SOURCE | R2 |
| 44 | ScoreUploader: clef select ("asking" state) | `ScoreUploader.svelte:546-550` | select | ScoreUploader | shane | 44px min-height (`:1014-1025`) | MERGES into SOURCE | R2 |
| 45 | ScoreUploader: key/fifths select | `ScoreUploader.svelte:552-559` | select | ScoreUploader | shane | 44px min-height | MERGES into SOURCE | R2 |
| 46 | ScoreUploader: Cancel / Read this page | `ScoreUploader.svelte:561-563` | button ×2 | ScoreUploader | shane | none seen | MERGES into SOURCE | R2 |
| 47 | ScoreUploader: banner dismiss (fidelity notice) | `ScoreUploader.svelte:578-580` | button, conditional | ScoreUploader | shane | none seen | MERGES into SOURCE | R2 |
| 48 | ScoreUploader: Try another / Continue to analysis | `ScoreUploader.svelte:634-636` | button ×2 | ScoreUploader | shane | none seen | MERGES into SOURCE | R2 |
| 49 | ScoreUploader: Try another (soon/error states) | `ScoreUploader.svelte:641`, `646` | button | ScoreUploader | shane | none seen | MERGES into SOURCE | R2 |
| 50 | ScoreUploader: older-Finale-file help disclosure | `ScoreUploader.svelte:662-665` | button (accordion) | ScoreUploader | shane | none seen | MERGES into SOURCE | R2 |
| 51 | SyllableStation: cursor/slot buttons (per syllable, dynamic) | `lib/shane/SyllableStation.svelte:119-126` | button, dynamic | SyllableStation | shane | 44px floor on the cursor only (`:195-206`) | MERGES into Studio drawer; station NOT ESTABLISHED | R9 |
| 52 | ShiftLyricsControl: 4 direction buttons (to-end back/forward, to-next-open back/forward) | `lib/shane/ShiftLyricsControl.svelte:45-77` | button ×4 | ShiftLyricsControl | shane | 44×44px floor (`:113-116`) | MERGES into Studio drawer; station NOT ESTABLISHED | R9 |
| 53 | "Start over" (destroy all placements) | `routes/+page.svelte:1819-1821` | button, conditional | Fit panel | shane | none seen | MERGES into Studio drawer; station NOT ESTABLISHED | R9 |
| 54 | Fit Print | `routes/+page.svelte:1876-1882` | button | Fit panel | shane | carries a `:disabled` style, unlike its Transcription twin | DUPLICATE — MERGES into one OUTPUT Print | R3 |
| 55 | Fit Export (binder) | `routes/+page.svelte:1888-1890` | button | Fit panel | shane | none seen | DUPLICATE — MERGES into OUTPUT | R2 |
| 56 | Fit Import (binder) | `routes/+page.svelte:1891-1893` | button | Fit panel | shane | clicks shared hidden input | DUPLICATE — MERGES into OUTPUT | R2 |
| 57 | ProfileSwitcher: first-launch name input | `lib/shane/ProfileSwitcher.svelte:176-186` | text input | CalibrationWizard | shane | auto-select on focus (`use:selectAll`) | LEAVES scroll, MOVES into takeover | R4 |
| 58 | ProfileSwitcher: first-launch Start | `ProfileSwitcher.svelte:187` | button | CalibrationWizard | shane | none seen | LEAVES scroll, MOVES into takeover | R4 |
| 59 | ProfileSwitcher: header toggle ("<voice>, options") | `ProfileSwitcher.svelte:196-215` | button | CalibrationWizard | shane | none seen | becomes the bottom-pinned voice line's entry point | R2 |
| 60 | ProfileSwitcher: voice list buttons (dynamic per voice) | `ProfileSwitcher.svelte:222-230` | button, dynamic | CalibrationWizard | shane | none seen | MOVES into takeover | R4 |
| 61 | ProfileSwitcher: New / Duplicate / Rename / Delete | `ProfileSwitcher.svelte:245-249` | button ×3-4 | CalibrationWizard | shane | none seen | MOVES into takeover | R4 |
| 62 | ProfileSwitcher: delete confirm / keep | `ProfileSwitcher.svelte:239-240` | button ×2, conditional | CalibrationWizard | shane | none seen | MOVES into takeover | R4 |
| 63 | ProfileSwitcher: name input + Save + Cancel (new/duplicate/rename) | `ProfileSwitcher.svelte:260-273` | text input + button ×2 | CalibrationWizard | shane | none seen | MOVES into takeover | R4 |
| 64 | Pacifier: 10 vowel nodes | `lib/shane/pacifier/Pacifier.svelte:781-850` | SVG `<g role="button">`, pointer + keyboard | CalibrationWizard | shane | long-press (500ms) skip; `pointer:coarse`-safe | MOVES into takeover | R4 |
| 65 | CalibrationWizard: compact-header collapse toggle | `lib/shane/CalibrationWizard.svelte:1280-1290` | button, conditional on `scoreRenders>0` | Fit panel | shane | none seen | this toggle is the "voice line…with Calibrate" candidate; MOVES/re-scopes to the bottom anchor | R2 |
| 66 | CalibrationWizard: fry-question disclosure | `CalibrationWizard.svelte:1321-1329` | `<details>/<summary>` | CalibrationWizard, welcome phase | shane | none seen | MOVES into takeover | R4 |
| 67 | CalibrationWizard: Begin (welcome) | `CalibrationWizard.svelte:1330` | button | CalibrationWizard | shane | none seen | MOVES into takeover | R4 |
| 68 | CalibrationWizard: Continue (readiness, 2 sites) | `CalibrationWizard.svelte:1377`, `1385` | button | CalibrationWizard | shane | none seen | MOVES into takeover | R4 |
| 69 | CalibrationWizard: Resume (paused capture) | `CalibrationWizard.svelte:1431` | button, conditional | CalibrationWizard | shane | none seen | MOVES into takeover | R4 |
| 70 | CalibrationWizard: hold-banner Continue / Retake | `CalibrationWizard.svelte:1451-1452` | button ×2, conditional | CalibrationWizard | shane | none seen | MOVES into takeover | R4 |
| 71 | CalibrationWizard: Pause | `CalibrationWizard.svelte:1460` | button | CalibrationWizard | shane | none seen | MOVES into takeover | R4 |
| 72 | CalibrationWizard: Return to summary (escape hatch) | `CalibrationWizard.svelte:1465-1467` | button, conditional | CalibrationWizard | shane | none seen | MOVES into takeover | R4 |
| 73 | CalibrationWizard: capture toast dismiss | `CalibrationWizard.svelte:1476-1481` | button, conditional | CalibrationWizard | shane | none seen | MOVES into takeover | R4 |
| 74 | CalibrationWizard: roster ⓘ info glyph ([o] only, summary only) | `CalibrationWizard.svelte:1196-1201` | button, conditional | CalibrationWizard summary | shane | none seen | MOVES into takeover | R4 |
| 75 | CalibrationWizard: roster Retake (per vowel, dynamic, summary only) | `CalibrationWizard.svelte:1251` | button, dynamic | CalibrationWizard summary | shane | none seen | MOVES into takeover | R4 |
| 76 | CalibrationWizard: Finish | `CalibrationWizard.svelte:1506` | button, conditional | CalibrationWizard summary | shane | none seen | MOVES into takeover | R4 |
| 77 | CalibrationWizard: challenging-vowels invite | `CalibrationWizard.svelte:1153` | button, conditional | CalibrationWizard summary | shane | none seen | MOVES into takeover | R4 |
| 78 | CalibrationWizard: Add/Edit voice characteristics | `CalibrationWizard.svelte:1168` | button | CalibrationWizard summary | shane | none seen | MOVES into takeover | R4 |
| 79 | CalibrationWizard: Start over / confirm / keep | `CalibrationWizard.svelte:1512-1519` | button ×2-3 | CalibrationWizard summary | shane | none seen | MOVES into takeover | R4 |
| 80 | CalibrationWizard: characteristics Done | `CalibrationWizard.svelte:1599-1601` | button | CalibrationWizard characteristics phase | shane | none seen | MOVES into takeover | R4 |
| 81 | NotePicker ×6: letter/accidental/octave selects, Clear | `lib/shane/NotePicker.svelte:154-184`, `281` | select ×3 + button, ×6 instances | CalibrationWizard characteristics phase | shane | none seen | MOVES into takeover | R4 |
| 82 | VoiceProfilePane: delegated note-click on the score SVG (`[data-hit]`) | `lib/shane/VoiceProfilePane.svelte:199-209` | click-delegated, dynamic | VoiceProfilePane | shane | none seen | KEEPS as an already-ruled note-click interaction (N.55b R4), analogous to R7's word/syllable click carve-out | R9 (analogous to R7, not literally covered) |
| 83 | Word click on Paper (per word, dynamic) | `lib/components/Paper/WordStack.svelte:133-142` | button (role) | Paper | transcription | click/Enter/Space | KEEPS | R7 |
| 84 | PageFooter attribution link (dannmitton.com) | `lib/components/Paper/PageFooter.svelte:79` | external `<a>` | Paper, every page footer | transcription, shane | `target="_blank"` | KEEPS | R7 |
| 85 | GuideContent external links (dannmitton.com ×2, kaikki.org ×2, CC BY-SA 4.0 ×2, LiederNet ×2) | `lib/components/Reading/GuideContent.svelte:222,266,268,485,529,531` | external `<a>` ×8 | GuideContent | guide | none seen | KEEPS | R6 |
| 86 | Mobile interstitial: Continue | `routes/+page.svelte:1596-1598` | button | mobile interstitial | all (mobile) | only rendered pre-`mobileDismissed` | DELETED | R5 |
| 87 | Import file input (shared, both drawers) | `routes/+page.svelte:1624-1635` | hidden file input | app root | transcription, shane | `accept` dropped on mobile | MERGES into OUTPUT | R2 |
| 88 | Replace/recognize dialog: destructive + safe-answer buttons (dynamic, typically 2) | `routes/+page.svelte:1651-1663` | button, dynamic, inside native `<dialog>` | app root | transcription, shane | safe answer focused programmatically on open | NOT ESTABLISHED | R9 |
| 89 | Update-toast: reload action | `routes/+page.svelte:2034-2046` | button | update toast | all | none seen | NOT ESTABLISHED | R9 |
| 90 | Update-toast: dismiss (×) | `routes/+page.svelte:2048` | button | update toast | all | none seen | NOT ESTABLISHED | R9 |
| 91 | InstallPrompt: Install | `lib/components/InstallPrompt.svelte:89` | button, conditional (non-iOS) | InstallPrompt | all | none seen | NOT ESTABLISHED | R9 |
| 92 | InstallPrompt: Not now / Got it | `InstallPrompt.svelte:91` | button | InstallPrompt | all | none seen | NOT ESTABLISHED | R9 |

## 3. New controls required by the schema

From **R5** (mobile portrait arrival):
- A **Read** control on the fitted page, entering the reading aid. No existing control matches this; NEW.
- A **back control ("The page")** inside the reading aid, returning to the fitted page. NEW.
- A **labelled drawer pull** on the reading aid itself (distinct from today's Drawer.svelte pulls, which belong to the Studio drawer). NEW.

From **R2** (merged Studio drawer):
- A **boxed segmented pair ("Transcription | Marked score")** choosing the document within Studio. No existing control does this; today's TabBar (deleted under R1) is the closest analogue but is a 3/4-way tab set, not a 2-way document toggle. NEW.
- **Set-apart Learn and Guide links**, replacing their TabBar tab-button form. The TOC drawers they lead to already exist (Section 1), but the entry links themselves, outside a tab bar, are a new form. NEW.
- The **bottom-pinned "voice line" with Calibrate**, as a persistent (non-scrolling) element. Today's ProfileSwitcher header toggle (`ProfileSwitcher.svelte:196-215`) opens an inline accordion, not a takeover, and is not pinned outside the scroll — so its ruled successor is new in form even though it reuses today's voice name display. NEW (in form).

## 4. The token read

### Colours (`apps/web/src/app.css`)

| Custom property | Hex / value | path:line |
|---|---|---|
| `--ink-primary` | `#1a1612` | `app.css:28` |
| `--ink-secondary` | `#4a4540` | `app.css:29` |
| `--ink-tertiary` | `#6A655F` | `app.css:30` |
| `--sage` | `#8B9A7D` | `app.css:33` |
| `--light-sage` | `#A8B5A0` | `app.css:34` |
| `--deeper-sage` | `#7A8A6C` | `app.css:35` |
| `--dusty-rose` | `#A67B7B` | `app.css:38` |
| `--terracotta` (alias of `--dusty-rose`) | `var(--dusty-rose)` | `app.css:39` |
| `--quiet-cobalt` | `#5C739E` | `app.css:42` |
| `--stone-300` | `#d6d3d1` | `app.css:45` |
| `--stone-500` | `#78716c` | `app.css:46` |
| `--stone-700` | `#44403c` | `app.css:47` |
| `--paper-cream` | `#F0EBE0` (`#ffffff` under `@media print`, `app.css:136`) | `app.css:50` |
| `--paper-light` | `#F5F1E8` | `app.css:51` |
| `--drawer-bg` | `#FAF8F5` | `app.css:52` |
| `--desk-surface` | `#D8D4C8` | `app.css:53` |
| `--app-bg` (alias) | `var(--desk-surface)` | `app.css:54` |
| `--surround-transcription` | `#6B6560` | `app.css:57` |
| `--surround-learn` | `#A8A39B` | `app.css:58` |
| `--surround-guide` | `#E5E1D6` | `app.css:59` |
| `--surround-shane` | `#D8D0E0` | `app.css:66` |
| `--muted-lavender` | `#A89BB5` | `app.css:67` |
| `--light-lavender` | `#C4BACF` | `app.css:68` |
| `--deeper-lavender` | `#8E7E9B` | `app.css:69` |
| `--arc-green` | `#1DB954` | `app.css:70` |
| `--signal-red` | `#A32D2D` | `app.css:71` |
| `--prep-amber` | `#BC7E08` | `app.css:72` |
| `--color-text`, `--color-text-muted`, `--color-accent`, `--color-border`, `--color-paper`, `--color-bg` (backward-compatible aliases, not new hexes) | see targets | `app.css:77-82` |

Not in `app.css` but hand-computed and used inline as hex literals, worth flagging as shadow tokens: `#8E7E9B`/`#8e7e9b` (VoiceProfilePane's `versionAccent`/`markAccent`/`ruleAccent`, e.g. `lib/shane/VoiceProfilePane.svelte:722-724`; withheld/watch-band borders, `:995`, `:1045`); `#74677F` (Drawer's collapsed-Shane hover shade, `Drawer.svelte:669`); `#8F6A6A`, `#4D6387` (HeaderBar's inactive-language-toggle backgrounds for Learn/Guide, `HeaderBar.svelte:142,146`).

### Fonts

| Stack | path:line |
|---|---|
| `--font-serif: 'Source Serif 4', Georgia, 'Times New Roman', serif` | `app.css:23` |
| `--font-sans: 'Source Sans 3', system-ui, -apple-system, 'Segoe UI', sans-serif` | `app.css:24` |
| `--font-mono: 'Menlo', 'Consolas', monospace` | `app.css:25` |
| `@font-face 'Lato IPA'` (self-hosted subset, `/fonts/lato-ipa.woff2`) | `app.css:13-19` |
| `'Lato IPA', sans-serif` (Pacifier glyph text, inline) | `lib/shane/pacifier/Pacifier.svelte:831` |
| `'Lato IPA', sans-serif` (VoiceProfilePane IPA glyphs) | `lib/shane/VoiceProfilePane.svelte:920` |
| `'Lato', sans-serif` (Pacifier achievement-badge sigil text — plain Lato, not the IPA subset) | `lib/shane/pacifier/Pacifier.svelte:844` |
| `'Courier New', Courier, monospace` (HeaderBar sigil brackets) | `lib/components/HeaderBar.svelte:107` |
| `'Courier New', Courier, monospace` (TitleHeader logo brackets) | `lib/components/Paper/TitleHeader.svelte:123` |
| Google Fonts import: Noto Sans + Noto Serif | `routes/+page.svelte:1586` |
| `.gt-serif`/`.gt-sans`/`.gt-serif-it`/`.gt-sans-obl` classes using `'Noto Serif'/'Noto Sans', 'DejaVu Serif'/'DejaVu Sans'` | `routes/+page.svelte:2325-2328` |

## 5. Wall sites

`lib/wall.ts` exports `INCLUDE_SHANE`. Every consumer, found by grepping the whole `apps/web/src` tree:

- `lib/components/Drawer/TabBar.svelte:7` (import), `:38-40` (gates whether `'shane'` is in `tabIds`) — MOVES: the TabBar itself is deleted (R1), so this consumption site is deleted with it.
- `routes/+page.svelte:60` (import), `:1545` (gates restoring a saved `'shane'` tab from localStorage) — DISPOSITION NOT ESTABLISHED: depends on how tab/document restoration works under the new segmented-pair model.
- `routes/+page.svelte:1744` (`{#if INCLUDE_SHANE}` gating the entire Fit panel body) — MOVES: gates the content that merges into Studio (R2) and the takeover (R4); the gate itself presumably persists in some form but its exact new site is not stated by any rule.

No other consumer exists in the censused tree.

## 6. Counts

Counting method: each row in Section 2 is one control **template**. Dynamic/per-item controls (TOC entries — counted exactly; per-word, per-vowel, per-syllable, per-song rows) count as one template each regardless of runtime instance count, except the TOC rows (#3, #4), which are exact totals since the TOC content is static, not data-driven.

- **Total control templates catalogued:** 92 (Section 2, rows 1-92; note rows 3-4 each bundle an exact multi-control count: 65 and 32 respectively)
- **DELETED:** 3 (TabBar ×2 mounts as row #2; mobile interstitial Continue, row #86) — plus every other control inside the deleted TabBar/mobile-interstitial surfaces that has no independent row (they die with the surface)
- **DUPLICATE → MERGED (one survivor):** 10 rows explicitly marked DUPLICATE (rows 8-14 metadata ×2 sets counted once each = 7 fields/controls ×2 instances, rows 19/54 Print ×2, rows 21-22/55-56 Export+Import ×2)
- **MOVED (surface changes, control substantially survives):** 61 rows (ANALYSIS: rows 30-40; SOURCE: rows 15-18, 20, 41-50; SONGS: rows 23-27; OUTPUT survivors: rows 21/56 post-merge; NOTATION/Piece anchor: rows 8-14, 28-29; takeover: rows 57-81; drawer-scroll-with-unresolved-station: rows 51-53)
- **KEPT (no disposition change under the stated rules):** 7 (rows 3, 4, 82, 83, 84, 85, and the Learn/Guide reading surfaces in Section 1)
- **NEW:** 6 (Section 3: Read control, back control, reading-aid drawer pull, segmented Transcription/Marked-score pair, set-apart Learn/Guide links, pinned voice-line-with-Calibrate)
- **DISPOSITION NOT ESTABLISHED:** 14 rows (1, 5, 6, 7, 51, 52, 53, 82 [analogy-only], 88, 89, 90, 91, 92, plus the VoiceProfilePane/Marked-score mapping in Section 1)

## 7. NOT ESTABLISHED

- **HeaderBar's fate** (`lib/components/HeaderBar.svelte:27-60`). No rule states what happens to the app bar, its per-tab colour keying (`class:tab-transcription` etc., keyed to the old four-tab `TabId`), or the language toggle once TabBar is deleted and tab identity becomes Studio/Learn/Guide plus a document pair. Settled by: a ruling on what the app bar shows once "tab" is no longer the four old values.
- **Desktop drawer lip, mobile drawer top handle, mobile paper-handle** (`Drawer.svelte:139-149`, `:441-454`; `+page.svelte:2007-2018`). R2 merges the drawer's *content* but never states what becomes of its *pull* mechanisms. Settled by: a ruling on the merged Studio drawer's open/collapse affordance(s), separate from R5's new reading-aid drawer pull.
- **SyllableStation and ShiftLyricsControl's station** (`lib/shane/SyllableStation.svelte`, `lib/shane/ShiftLyricsControl.svelte`). R2 names SOURCE, ANALYSIS, OUTPUT, SONGS as the scrolling stations; nothing places lyric-to-note pairing there. Settled by: a ruling naming a station for pairing work, or folding it into ANALYSIS or SOURCE by name.
- **"Start over" (placement rebuild)** (`+page.svelte:1819-1821`). Same gap as above.
- **VoiceProfilePane's exact mapping to "Marked score"** (`lib/shane/VoiceProfilePane.svelte`). R1 names a Transcription/Marked-score segmented pair; VoiceProfilePane is the only existing score-rendering surface and so is the obvious candidate, but no rule states it explicitly, nor whether its drawer-side dependents (ScoreUploader, SyllableStation, CalibrationWizard) reorganize around that identity. Settled by: a ruling confirming VoiceProfilePane is "Marked score" and specifying how its drawer inputs attach to the merged Studio drawer.
- **The replace/recognize confirmation `<dialog>`** (`+page.svelte:1637-1667`). R4 calls calibration "the app's ONE takeover." This existing native `<dialog>` for song-replacement confirmation is a second, unrelated takeover already in the app. Settled by: a ruling clarifying whether "ONE takeover" is scoped to calibration specifically (in which case this dialog is untouched) or is a whole-app constraint (in which case this dialog needs its own disposition).
- **Update-toast, InstallPrompt** (`+page.svelte:2026-2049`; `lib/components/InstallPrompt.svelte`). Neither is named in R1-R8 and neither maps cleanly onto "surface" or "control" in the ruled schema's vocabulary. Settled by: an explicit ruling, or a statement that they are out of scope for this redesign.
- **`INCLUDE_SHANE` at `+page.svelte:1545`** (tab-restoration gate). Depends on how document/tab state is persisted and restored under the new model, which is not specified. Settled by: a ruling on how the segmented pair's state (and Learn/Guide's, if they remain restorable) is persisted.
- **Whether the top Piece anchor's NOTATION sub-section keeps `notationExpanded` defaulting to `true`** (`+page.svelte:137`) against the ruled "collapsed by default." This is a fact about current behaviour, not a disposition gap, but it is a live discrepancy between code and the ruling text that a ruling should either confirm (change the default) or explain (the ruling was aspirational and not yet implemented).
- **VoiceProfilePane's delegated note-click** (`VoiceProfilePane.svelte:199-209`) and **word-click on Paper** (`WordStack.svelte:133-142`). R7 explicitly covers "existing ruled interactions (word selection, syllable/note click)" for the Paper; VoiceProfilePane's note-click is the same *kind* of interaction (N.55b R4) but sits on a different surface (the score SVG, not the Paper), so R7's letter does not literally reach it even though its spirit plainly does. Settled by: confirming R7 extends to the Marked-score surface, or stating a separate rule for it.

**Files staged and read in full (path:line references above are load-bearing against these):** `routes/+page.svelte`, `lib/components/Drawer/Drawer.svelte`, `lib/components/Drawer/TabBar.svelte`, `lib/components/Drawer/RootPanel.svelte`, `lib/components/Drawer/InspectorPanel.svelte`, `lib/components/Drawer/MetadataFields.svelte`, `lib/components/Drawer/NotationFields.svelte`, `lib/components/Drawer/SongList.svelte`, `lib/components/Drawer/SearchableSelect.svelte`, `lib/components/HeaderBar.svelte`, `lib/components/InstallPrompt.svelte`, `lib/components/Paper/Paper.svelte`, `lib/components/Paper/WordStack.svelte`, `lib/components/Paper/TitlePage.svelte`, `lib/components/Paper/SubsequentPage.svelte`, `lib/components/Paper/TitleHeader.svelte`, `lib/components/Paper/RunningHeader.svelte`, `lib/components/Paper/PageFooter.svelte`, `lib/components/Paper/VerseLine.svelte`, `lib/components/Paper/ReadingPaper.svelte`, `lib/components/Reading/GuideContent.svelte` (grepped for controls, not read as prose), `lib/components/Reading/LearnContent.svelte` (grepped, no controls found), `lib/shane/VoiceProfilePane.svelte`, `lib/shane/ScoreUploader.svelte`, `lib/shane/SyllableStation.svelte`, `lib/shane/ShiftLyricsControl.svelte`, `lib/shane/CalibrationWizard.svelte`, `lib/shane/ProfileSwitcher.svelte`, `lib/shane/NotePicker.svelte`, `lib/shane/pacifier/Pacifier.svelte`, `app.css`, `lib/wall.ts`. `+page.ts` and `+layout.svelte`/`+layout.ts` were not part of the census scope and were not staged.
