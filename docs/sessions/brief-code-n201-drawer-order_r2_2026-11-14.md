# Brief for Code, N.201: the Drawer's order

r2, 2026-11-14, written by the desk (Opus 5.5). Fable-reviewed at r1 (`docs/sessions/review-fable-brief-n201_r1_2026-11-14.md`: SEND WITH AMENDMENTS, three blockers and eleven amendments). Blockers 2 and 3 are applied in the steps below; blocker 1 is met by Dann's ship of the memory files before the lane is cut; the eleven amendments are in the section AMENDMENTS at the end, which is BINDING and wins where it disagrees with a step. Branch: `cloud-lane-54`, cut from `Shane` at its tip after lane 53 merges. In the release of 2026-11-20, displacing nothing (Dann 2026-11-14 20:36).

## What the singer needs

Dann, 2026-11-14 07:57 (as written): *"Analysis (the Inspector) seems buried while the file list seems too prominent? We need to see those files once at the beginning but then they can recede."* Measured on the alias at `d85a54cf` in a phone window: a tap on a word raises the Drawer onto the poem box, with ANALYSIS closed and below the window's foot; the singer never sees the word they tapped. A word tap that opens ANALYSIS in view was ratified on 2026-10-31 and never built. His principle (2026-11-14 08:21): *"The WYSIWYG is the focus surface, the Drawer are necessary controls."*

## Read first, in full

`docs/memory/OPEN.md`, section "N.201. THE DRAWER'S ORDER" (every entry is binding; the newest wins); `docs/sessions/review-fable-n201-drawer-board_r1_2026-11-14.md` (its eight changes and its decided engineering points are binding, except decided point 1, which blocker 2 below replaces); `docs/sessions/review-fable-brief-n201_r1_2026-11-14.md` (in full); `docs/memory/PRODUCT.md` sections "The drawer grammar and the path" and "THE PAGE IS THE FOCUS SURFACE"; `apps/web/src/lib/components/Drawer/sections.svelte.ts`; `Drawer/Drawer.svelte`; `Drawer/RootPanel.svelte`; `Drawer/SongList.svelte`; `Drawer/AnalysisStation.svelte`; `Drawer/IntakePanel.svelte`; `routes/+page.svelte` at the word tap (`handleWordClick`), the Drawer's groups, and the boot `restore`. Every `path:line` in this brief and in the review is a lead: read the line before you rely on it.

## The order

Five bands, top to bottom: REPERTOIRE (cobalt, as PIECE; Dann 08:21), PIECE (cobalt), INPUT (sage), ANALYSIS (sage), VOICE (lavender). Band labels are the tree's: `songs.heading` « RÉPERTOIRE », `group.piece`, `group.input`, `console.placeholder` « ANALYSE » (read and confirm), `group.scoreMarkup`. No new hue.

- REPERTOIRE leaves PIECE and becomes the first band. EXPORT AND IMPORT goes with it, as a station inside it.
- ANALYSIS leaves INPUT and becomes its own band after INPUT. NOTATION is its first row, a station, closed on arrival, never stored open (as today).
- PIECE keeps its fields. INPUT keeps its boxes and receipts.

## Step 1. The bands and their ids

1. `repertoire` and `analysis` keep their stored strings, move from `STATION_IDS` to `BAND_IDS`, and join the band tier; `binder` and `notation` stay stations. **`OPEN_STATIONS_VERSION` goes to 4, with a carry step for a version 3 set in `restore` that resets nothing:** keep `repertoire` only if `piece` was stored, keep `analysis` only if `input` was stored, keep every other id as today. Why: today the two ids can be stored while invisible inside a closed band; as bands they would open by themselves (the brief review's blocker 2, with its table of four stored sets). Versions below 3 land on the first-run default, as today.
2. On a phone, the one-open-per-tier rule now applies to five bands.
3. Tests: `tierOf`, `migrateOpenStations`, and `restore` with stored sets written by today's build (`["repertoire","scoreMarkup"]`, `["input"]`, `["piece","analysis"]`) land where a singer expects; say what each lands on.

## Step 2. A word tap opens ANALYSIS in view

1. One new method on `SectionSet` (the review's "reveal"): opens an id if closed, shuts the same tier when `exclusive`, does nothing if open, and writes through the one save site.
2. **Phone:** a word tap raises the Drawer, reveals ANALYSIS (so INPUT and any other open band close to their state lines), and scrolls the Drawer to the top. A second word tap leaves ANALYSIS open.
3. **Desktop:** a word tap reveals ANALYSIS, shuts nothing, and brings ANALYSIS's head into view only when it is outside the Drawer's window. This departs from the Drawer's no-scroll rule (`Drawer.svelte`, the comment "the drawer never scrolls itself"); the departure is the review's change 2 and answers the singer's own tap. Rewrite that comment to say so.
4. The tapped word is marked on the page, on screen only, never printed. The look of the mark: draw it as the word's existing focus outline in the band's sage; Dann rules its look on his walk. One word at a time; no word is marked until the singer taps one.
5. The tap's switch to the Text document is unchanged.

## Step 3. REPERTOIRE recedes

1. **Desktop arrival:** after `restore`, REPERTOIRE opens when the library holds two or more songs. With fewer, the stored set stands (a first run opens INPUT alone, as today).
2. **Phone arrival:** REPERTOIRE does not open by itself; the stored set stands.
3. REPERTOIRE folds on exactly three events: picking a song (including the song already open), New song, and its own chevron. Nothing else folds it.
4. New song folds REPERTOIRE and opens INPUT.
5. On a phone, after a pick the Drawer stays raised, REPERTOIRE folded, PIECE's line showing the new title.
6. Rename and Delete show on the row of the song that is open only. Other rows read as titles.

## Step 4. Closed bands say what they hold

1. REPERTOIRE closed: the count of songs, or no line at zero. ANALYSIS closed, with a word chosen: that word and its IPA, as the word stack shows them (no new string). ANALYSIS closed, with no word chosen: the count of words labelled "verify" on the page, or no line at zero.
2. **The four strings, RATIFIED by Dann 2026-11-14 20:38, English and French** (*"Yes I ratify the English and French."*): `songs.count.one` "1 song" « 1 chant »; `songs.count.many` "{n} songs" « {n} chants »; `analysis.verifyCount.one` "1 to verify" « 1 à vérifier »; `analysis.verifyCount.many` "{n} to verify" « {n} à vérifier ». Seat them under these keys, character for character, with a comment naming the ratification. Digits in both languages (Dann 2026-11-13 11:52). Two keys per count, as `select.resultCount.one` and `.many` do.
3. "171ms" leaves ANALYSIS's head.

## Step 5. Pictures and walk

Pictures, English and French, phone 390 by 844 and desktop at 1440: arrival with 16 songs; arrival with one song; after a pick; after New song; a word tap with INPUT open (phone and desktop); a second word tap; ANALYSIS closed with verify words. Look at each yourself before you report it.

## Done when

All eight gates pass on the tip, with gate 4's count before and after; the pictures in `docs/sessions/report-code-n201-pictures/`; one report `docs/sessions/report-code-n201-drawer-order_r1_2026-11-14.md`; the branch pushed.

## Constraints

- No new English or French beyond Step 4's four drafts. If a word proves necessary, stop that step and report it.
- Do not touch the Calibrate screen (`VowelCapture.svelte`, `voice/chart/`): lanes 53 and N.200 own it.
- No second silent save site: every write to `ilya:openStations` goes through `SectionSet`'s one writer.
- Every computation of which bands are open lives in `sections.svelte.ts`; name any other site you find that decides it, and what depended on them agreeing.

## AMENDMENTS, BINDING (from the brief review, A1 to A11; read the review for each one's reason and lines)

- **A1.** Step 1 rewrites `Drawer/sections.test.ts:66-72`, `:75-78`, `:85-96`, `:134-141`, `:276-282`, `:286-288`; the two ids' consumers are `Drawer/RootPanel.svelte:125-126` and `routes/+page.svelte:4055-4056`.
- **A2.** The band head replaces the station header in `SongList.svelte` and `AnalysisStation.svelte` (no name drawn twice); `Drawer.svelte` takes two new group snippets and two new state props. EXPORT AND IMPORT (`RootPanel.svelte:148-156`) moves into REPERTOIRE's body as a station.
- **A3.** `SectionSet` gains a second method, "fold": closes an id if open, writes through `#write`. No open state is changed outside `sections.svelte.ts`.
- **A4.** The fold sits in the two pick handlers at `routes/+page.svelte:3233-3234`, never in `switchSong` (also called by Delete, `recognize.open`, and New song; early return at `:3106`). New song folds only after `created.ok` (`:3153-3157`).
- **A5.** Step 3.1's count at arrival reads `opened?.pointer.songCount` (`lib/library/index.ts:207`; legacy `:139`): `songs` is empty when `restore` runs.
- **A6.** REPERTOIRE's closed line reads `songRows.length` (`+page.svelte:3071`), no line at zero; the other sites that count songs are `songs` (`:3063`), `pointer.songCount`, `RootPanel.svelte:172`, and `SongList`'s `canDelete`: say what depended on them agreeing.
- **A7.** The verify count gets one definition: move the predicate at `Paper/WordStack.svelte:132` (with the clitic test at `:120`) into a plain TypeScript function that `WordStack` and the count both call, over `effectiveLines` (`+page.svelte:1740`). The count follows the shown witness and is the same on MELODY.
- **A8.** The mark: a `selected` class on the word keyed on `selectedWord`, drawn as the existing focus outline (`WordStack.svelte:244-247`, 2 px `var(--sage)`), offset 5 px on `.is-inferred` so the dashed VERIFY box stays visible; never the rule at `:274-280`; off in `@media print`; off under `probe`. Dann rules its look on his walk. This replaces Step 2.4's description.
- **A9.** Scroll: "phone" is `isMobile` (`+page.svelte:3568-3569`). Phone: `scrollTop = 0` on every tap, after `tick`. Desktop: compare the ANALYSIS head's rectangle with `drawerContentEl`'s, as `Drawer.svelte:342-346` does, and align the head to the window's top only when it is outside. The request travels as a counter prop, the `calibrationRequest` shape (`+page.svelte:1666-1668`). Skip while `takeoverActive`. Rewrite both comments that carry the no-scroll rule, `Drawer.svelte:362-366` and `:970-975`, to name this one exception and its reason.
- **A10.** Keys: no collision; keep `songs.count.one`, `songs.count.many`, `analysis.verifyCount.one`, `analysis.verifyCount.many`; update the key index at `lib/i18n.ts:19` and its prefix counts, which `lib/i18n-index.test.ts` enforces; fill with `tv`. "171ms" is in ANALYSIS's body, `AnalysisStation.svelte:75-81`: remove it there.
- **A11.** Done when also names: `sections` tests for "reveal", "fold", and the four stored sets of the review's table; tests for the verify-count function; an e2e test at phone and desktop viewports that a word tap leaves `aria-expanded="true"` on ANALYSIS; a print check that no mark prints. Update the ten e2e files that call `expandStation(page, 'Analysis')` or `'Repertoire'` (`e2e/helpers.ts:50-58`). Add pictures: one verify word and zero; the open row with Rename and Delete; a marked VERIFY word; a phone arrival from `["repertoire","scoreMarkup"]`.
- **Not in this brief:** the Guide lines this makes stale (`Reading/GuideContent.svelte:101-102`, `:130`, `:185`, `:397-398`, `:426`, `:481`, and the pictures `guide-step-01`, `-13`, `-18`, `-20`, `-25`, `-32`) belong to the GUIDE rewrite; do not edit them here.
- **Defaults, for Dann's walk:** a row that cannot be read keeps Rename and Delete (the recorded reason in `SongList.svelte`); desktop arrival opens REPERTOIRE at two or more songs on every visit.

## What you could not establish

End the report with a section of this name. NOT ESTABLISHED beats a complete invented answer.

Handed to you as not established by the desk or the reviewer: how many rows a fresh library shows; any rendered height of the bands at 390 px; whether MELODY has word taps that reach `handleWordClick`.
