# Fable review of brief N.201 r1 (the Drawer's order)

2026-11-14 20:4x to 20:5x. Commissioned by the desk (Opus 5.5) at Dann's "Proceed" of 20:42. Filed by the desk whole. Tree `d85a54cf`; paths under `apps/web/src/` unless they start with `docs/`.

**Verdict: SEND WITH AMENDMENTS.** Three blockers, then eleven amendments. No answer from Dann is needed before sending.

## Blockers

1. **Code cannot read three "Read first" files.** At `d85a54cf`, `docs/memory/OPEN.md` has no "N.201", `docs/memory/PRODUCT.md` has no "FOCUS SURFACE" section, and `docs/sessions/` holds no `review-fable-n201-*` file. They must be on `Shane` before lane 54 is cut.
2. **Step 1.1 changes stored Drawers silently.** Today `repertoire` and `analysis` are stations drawn only inside an open band (`Drawer/Drawer.svelte:517`, `:540`; `Drawer/IntakePanel.svelte:523-524`), so a stored id can be invisible. As bands they become visible. Dann's own set, `["repertoire","scoreMarkup"]`, on a phone keeps the first band only (`Drawer/sections.svelte.ts:202-204`): REPERTOIRE opens with every row and VOICE shuts, which Step 3.2 forbids. The file's own argument applies: "Once" needs a mark (`sections.svelte.ts:221-228`), and `:96-101` warns a reused id is safe only under a version. **Decided:** version 4, with a carry step for version 3 in `restore` (no reset): keep `repertoire` only if `piece` was stored, keep `analysis` only if `input` was stored. This departs from the board review's decided point 1; its reason (a bump resets, `:443-445`) holds only for the current branch.
3. **Step 4.1 drops offer (c).** The board review said yes to (c) and its change 8 covers the no-word case only. With a word chosen, the closed ANALYSIS line shows the word and its IPA. The brief draws the verify count in every case.

| Stored set | Brief as written, desktop | Brief as written, phone | With blocker 2's carry |
|---|---|---|---|
| `["repertoire","scoreMarkup"]` | both; REPERTOIRE newly visible | `["repertoire"]` | `["scoreMarkup"]` on both |
| `["input"]` | unchanged | unchanged | unchanged |
| `["piece","analysis"]` | both; ANALYSIS newly visible | `["piece"]` | `["piece"]` on both |
| `["piece","repertoire","binder"]` | all three | `["piece","binder"]` | the same; `binder` is hidden in a closed band |

## Amendments

- **A1.** Name the tests Step 1 rewrites: `Drawer/sections.test.ts:66-72`, `:75-78`, `:85-96`, `:134-141`, `:276-282`, `:286-288`. Why: each pins today's tiers, and `:75-78` fails unless the two ids move from `STATION_IDS` to `BAND_IDS` (consumers: `Drawer/RootPanel.svelte:125-126`, `routes/+page.svelte:4055-4056`).
- **A2.** State that the band head replaces the station header in `SongList.svelte` and `AnalysisStation.svelte`, and that `Drawer.svelte` takes two new group snippets and two new state props. Why: both components draw their own `StationHeader` (`SongList.svelte`, the `StationHeader` call; `AnalysisStation.svelte:66-71`), so the name would be drawn twice. EXPORT AND IMPORT moves cleanly: it is a self-contained station at `RootPanel.svelte:148-156`.
- **A3.** Add a second method, "fold" (the reviewer's term): closes an id if open, writes through `#write`. Why: `SectionSet` has only `toggle`, `open`, and `restore`; a fold written in `+page.svelte` breaks the brief's own last constraint.
- **A4.** Put the fold in the two handlers at `routes/+page.svelte:3233-3234`, never in `switchSong`. Why: `switchSong` is also called by Delete (`:3214`), `recognize.open` (`:2626`), and New song (`:3160`); it returns early at `:3106`. Fold on New song only after `created.ok` (`:3153-3157`): the error line is inside REPERTOIRE's body.
- **A5.** Step 3.1 reads `opened?.pointer.songCount` (`lib/library/index.ts:207`; legacy `:139`). Why: `songs` is empty at `restore`; `refreshSongs()` is not awaited (`+page.svelte:3540`, restore at `:3621`).
- **A6.** REPERTOIRE's count reads `songRows.length` (`+page.svelte:3071`), with no line at zero. Why (CONTRACT section 4): the other sites are `songs` (`:3063`), `pointer.songCount`, `RootPanel.svelte:172`, and `SongList`'s `canDelete`; `listSongs` returns `[]` on the legacy driver (`lib/library/songs.ts:191-198`), and French takes the singular at 0 (`Drawer/bandState.ts:82-90`), which the ratified `.one` string cannot draw.
- **A7.** The verify count is a new number with one existing predicate, `Paper/WordStack.svelte:132` (`stressSource === 'inferred'`, not clitic, not Latin; clitic at `:120`). Move it to a plain TypeScript function used by `WordStack` and the count, over `effectiveLines` (`+page.svelte:1740`, drawn at `:4300`). Why: one definition, testable in vitest. State that the count follows the shown witness and is the same on MELODY.
- **A8.** The mark. No selected state reaches `Paper` (its only word prop is `onwordclick`, `Paper/Paper.svelte:31`). The focus outline is real: `WordStack.svelte:244-247`, 2 px `var(--sage)`, `:focus-visible` only, so a pointer tap never shows it. Do not reuse `:274-280`: it hides the dashed VERIFY box, Ted's case. **Decided:** a `selected` class keyed on `selectedWord`, the same outline (offset 5 px on `.is-inferred`, box kept), off in `@media print` (`:416-427` has no outline rule), off under `probe`.
- **A9.** Scroll. "Phone" is `isMobile` (`+page.svelte:3568-3569`), not `isPhone` (`:3570`). Phone target `scrollTop = 0`; run it on every tap, after `tick`. Desktop: compare the head's rectangle with `drawerContentEl`'s, as `Drawer.svelte:342-346` does, and align the head to the window's top. The request travels as a counter prop, the `calibrationRequest` shape (`+page.svelte:1666-1668`). Skip while `takeoverActive` (`Drawer.svelte:394-401` holds `scrollTop`). Two comments carry the rule: `:362-366` and `:970-975`, the latter reading "the drawer never scrolls itself, except once, on entry to the calibration takeover ... A station opens IN PLACE. Do not add a scroll here."
- **A10.** Keys. No collision. `analysis.` is the broad-analysis note's prefix (`lib/i18n.ts:27`); ANALYSIS's own are `console.` (`:35`) and `verify.` (`:84`). **Decided:** keep the recorded keys; update the index (`analysis.` 5 to 7, `songs.` 13 to 15, the total of 1,271 at `:19`), which `lib/i18n-index.test.ts` enforces. Fill with `tv` (`i18n.ts:2604`). Step 4.3: "171ms" is in the body, `AnalysisStation.svelte:75-81`, not the head.
- **A11.** "Done when" names no test. Add: the `sections` tests for "reveal", "fold", and the four stored sets; the verify-count function; e2e, phone and desktop viewports, a word tap gives `aria-expanded="true"` on ANALYSIS; a print check that no mark prints. Ten e2e files call `expandStation(page, 'Analysis')` or `'Repertoire'` (`e2e/helpers.ts:50-58`, `e2e/singer-paths.test.ts:135-136`). Add pictures: one verify word and zero; the open row with Rename and Delete; a marked VERIFY word; a phone arrival from `["repertoire","scoreMarkup"]`.

## Citation table

| Brief or review claim | Result |
|---|---|
| `handleWordClick`; raise; switch | CONFIRMED `+page.svelte:2138`, `:2145`, `:2146-2155` |
| `restore` at boot | CONFIRMED `:3621` |
| `songs.heading`, `console.placeholder`, `group.*` | CONFIRMED `i18n.ts:1767`, `:990`, `:157`, `:166`, `:161` |
| `select.resultCount.one/.many` | CONFIRMED `:2533-2534` |
| "the drawer never scrolls itself" | MOVED `Drawer.svelte:970-975` (board review: 971-976); second copy `:362-366` |
| Empty state line draws nothing | CONFIRMED `Drawer.svelte:497` |
| New song label | CONFIRMED `i18n.ts:1768`; drawn only when `plural` |
| Lane 53 does not collide | CONFIRMED: `lib/voice/`, `e2e/calibrate-new.test.ts`, `docs/sessions/` only |
| MELODY word taps | ESTABLISHED: one caller, `+page.svelte:4300` |
| `PRODUCT.md:520`, `:526`, `:528`, `:1231`; `CONTRACT.md:145`, `:147` | CONFIRMED |

## Outside the Drawer

Print: the mark only (A8). Learn and Guide use their own set. Guide lines stale, `Reading/GuideContent.svelte`: `:101-102` and `:397-398` ("three sections: Metadata, Analysis, and Notation"; stale before N.201); `:130` and `:426` ("Metadata section"); `:185` and `:481` ("The Notation section of the Drawer"; N.201 makes this worse). `:152-153`, `:448-449`, and `:351` stay true. No Guide line names REPERTOIRE. The pictures `guide-step-01`, `-13`, `-18`, `-20`, `-25`, `-32` show the old Drawer.

## Questions that are Dann's (for his walk, none before sending)

- The look of the mark (A8 is the default).
- Whether IPA on the closed ANALYSIS line reads well in the state line's sans face.
- Whether desktop arrival opens REPERTOIRE on every visit (the board review's taste item 3).
- A row that cannot be read keeps Rename and Delete today, by a recorded reason in `SongList.svelte`. Default: it keeps them.

## What the reviewer could not establish

- Whether a song that cannot be read can be opened, and so deleted under offer (d).
- Whether the e2e suite is one of the eight gates.
- "Digits in both languages (Dann 2026-11-13 11:52)": not opened.
- Whether N.200 edits `i18n.ts` (the key total at `:19` would collide).
- Any rendered height; nothing was run.
- Whether an open NOTATION row pushes the word below the window on a phone.

Terms: "fold" and "carry step" are the reviewer's; "reveal" is the board reviewer's.
