# Brief for Code, N.201: the Drawer's order

r1, 2026-11-14, written by the desk (Opus 5.5). NOT YET REVIEWED (`CONTRACT.md` section 1 item 19). Branch: `cloud-lane-54`, cut from `Shane` at its tip after lane 53 merges. In the release of 2026-11-20, displacing nothing (Dann 2026-11-14 20:36).

## What the singer needs

Dann, 2026-11-14 07:57 (as written): *"Analysis (the Inspector) seems buried while the file list seems too prominent? We need to see those files once at the beginning but then they can recede."* Measured on the alias at `d85a54cf` in a phone window: a tap on a word raises the Drawer onto the poem box, with ANALYSIS closed and below the window's foot; the singer never sees the word they tapped. A word tap that opens ANALYSIS in view was ratified on 2026-10-31 and never built. His principle (2026-11-14 08:21): *"The WYSIWYG is the focus surface, the Drawer are necessary controls."*

## Read first, in full

`docs/memory/OPEN.md`, section "N.201. THE DRAWER'S ORDER" (every entry is binding; the newest wins); `docs/sessions/review-fable-n201-drawer-board_r1_2026-11-14.md` (its eight changes and its decided engineering points are binding); `docs/memory/PRODUCT.md` sections "The drawer grammar and the path" and "THE PAGE IS THE FOCUS SURFACE"; `apps/web/src/lib/components/Drawer/sections.svelte.ts`; `Drawer/Drawer.svelte`; `Drawer/RootPanel.svelte`; `Drawer/SongList.svelte`; `Drawer/AnalysisStation.svelte`; `Drawer/IntakePanel.svelte`; `routes/+page.svelte` at the word tap (`handleWordClick`), the Drawer's groups, and the boot `restore`. Every `path:line` in this brief and in the review is a lead: read the line before you rely on it.

## The order

Five bands, top to bottom: REPERTOIRE (cobalt, as PIECE; Dann 08:21), PIECE (cobalt), INPUT (sage), ANALYSIS (sage), VOICE (lavender). Band labels are the tree's: `songs.heading` « RÉPERTOIRE », `group.piece`, `group.input`, `console.placeholder` « ANALYSE » (read and confirm), `group.scoreMarkup`. No new hue.

- REPERTOIRE leaves PIECE and becomes the first band. EXPORT AND IMPORT goes with it, as a station inside it.
- ANALYSIS leaves INPUT and becomes its own band after INPUT. NOTATION is its first row, a station, closed on arrival, never stored open (as today).
- PIECE keeps its fields. INPUT keeps its boxes and receipts.

## Step 1. The bands and their ids

1. `repertoire` and `analysis` keep their stored strings and join the band tier; `binder` and `notation` stay stations. No version bump: a bump resets every singer's stored set (the review's decided point 1).
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

1. REPERTOIRE closed: the count of songs. ANALYSIS closed: the count of words labelled "verify" on the page, or no line at zero.
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

## What you could not establish

End the report with a section of this name. NOT ESTABLISHED beats a complete invented answer.

Handed to you as not established by the desk or the reviewer: how many rows a fresh library shows; any rendered height of the bands at 390 px; whether MELODY has word taps that reach `handleWordClick`.
