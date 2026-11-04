# Memo: the print strip in the Loupe (Fable, r1, 2026-11-04)

Critique from the singer's position of `OPEN.md` JOINING POEM TO LYRICS ON A SCAN items 8 to 12. Lines cited were read on `Shane` this session. Written in passes; findings are appended as they are reached, so a later finding may refine an earlier one. NOT ESTABLISHED beats a complete invented answer.

## Verdict

The design holds: the print in the Loupe, on every bar, with a pinch, is the right place for the scan to live and keeps the page clean. Two defects block item 12 as written (the phone closes the self-opened Loupe before she sees it, finding 1; a pinch can dismiss, finding 2), one wording defect will mislead her if left (the strip and the drawn notes cannot line up, finding 3), and the rest are fixes a step 6 brief can carry. Nothing here reopens a ruling.

## Findings

### 1. On a phone, the Loupe that opens itself on arrival is closed again before she sees it (defect, blocks item 12)

Case. Marina drops the scan from the INPUT group, which is in the drawer; on a phone the drawer covers the screen. The reading arrives, Ilya opens the Loupe, and the page's own rule closes it in the same flush.

Code read. `+page.svelte:1477-1479`: `if (isPhone && drawerRaised && loupeOpen) dismissLoupe();` (ruled by Dann 2026-08-26, "one surface at a time"). The banner itself is rendered inside the drawer under the uploader, `+page.svelte:4036-4042`. The Loupe also needs the Markup tab: `loupeAvailable` is `destination === 'studio' && studioDocument === 'markup' && !!ingestedScore`, `+page.svelte:1013-1018`, and the frame renders only under `{#if loupeAvailable && loupeOpen && cursor}`, `+page.svelte:4570`.

Change. The arrival path, and the banner's bar link, must first (a) switch to Markup (`handleTabChange('markup')`, `+page.svelte:3460`), (b) on a phone lower the drawer, (c) set the cursor to the bar's first sung note, and only then set `loupeOpen`. Say so in step 6 of the brief as a numbered sequence, because the order is the whole fix. On a phone the singer then sees the page with the Loupe over it, which is where she can act; on a desktop the drawer is a side panel and stays.

### 2. A pinch on the strip can read as the dismiss swipe (defect, item 10)

Case. She puts two fingers on the strip and spreads them. The second finger's pointerdown overwrites where the gesture began, its pointerup lands 60 px lower, and the Loupe closes under her hand.

Code read. `+page.svelte:1417-1437`: `swipeFrom` is set on every pointerdown that starts on `.loupe` or `.dock` and read on pointerup; `isDismissSwipe(dx, dy)` is `dy >= SWIPE_DISMISS_PX && dy > Math.abs(dx)` (`loupe.ts:205-207`, 56 px). Nothing counts pointers. The frame takes `touch-action: none` (`Loupe.svelte:2596`), so the browser will not zoom for her either; the pinch must be Ilya's own code.

Change. Count active pointers on the frame; while two are down, and for the pointerup that ends either, the swipe test is skipped. The strip's own handler reads the two pointers' distance. Also: a pinch that starts on the strip and drifts onto the drawn notes must not place a syllable (the window's click handler at `Loupe.svelte:2142-2148` fires on the synthesised click after a tap); a two-pointer gesture sets the same `gestureBeganOnSurface`-style flag that already shields the page.

### 3. The strip cannot line up with the drawn notes, and the design needs to say so rather than imply it (defect in the walk's wording, not in the ruling)

Case. She reads «те-бя» in the strip and looks for the note under «бя». The Loupe re-spaces the bar (`deriveMinGap`, `loupe-render.ts:193-197`, a 44 px tap floor between carets, `TAP_FLOOR_PX`) and draws it at 2.4 times the page thumbnail (`Loupe.svelte:231`), while the strip is one rectangle cut from the scan at whatever scale fits the window. The syllables in the strip sit at the print's spacing; the notes below sit at Ilya's. In a bar where the print is tight and the Loupe is wide, the strip's second word sits over the fourth note.

Change. Three designs, ranked. (a) Present the strip as a picture of the print with its own hairline frame and its two bar ends aligned to the window's two ends, nothing more; she compares by eye, as she does with paper. Cost: nothing new. (b) Cut the strip at each note's x in page pixels (the reader has them, `underlay-band.ts:40-43` `NotePoint`) and lay the pieces under the drawn notes' x: syllables land under their notes but a word straddling two notes is cut in two and the picture stops being a picture. (c) Draw a short tick on the strip's lower edge at each note's page x, so the eye can count ticks against notes. Recommendation: (a) now, (c) if a walk shows her counting. Never (b).

### 4. The strip's scale on a phone is too small to read without the pinch, so the pinch is the primary path there, not the courtesy (finding, item 10)

Case. A phone's Loupe window is about 277 px wide inside a 299 px card (`Loupe.svelte:281-291`, measured in `report-code-row164-step0_r1_2026-11-01.md:27`). A bar on a 2,480 px wide scan is roughly 300 to 500 px of print; fitted to 277 px, the print's lyric letters (about 20 to 30 px tall on the scan) come down to 12 to 20 px. Readable for a clean print, not for the smudged bar that put it in the banner, which is exactly the bar she is there to check.

Change. On a phone, open the strip at a scale that keeps the print's letters at or above about 18 px (derive from the band's staff space, which the kept geometry has, amendment 13) and let it pan sideways inside its own row, the way the dense measure already pans (`Loupe.svelte:2698-2706`, `touch-action: pan-x`). The pinch then refines. The brief's step 6 names a minimum letter height to measure on row 114 f1 rather than leaving it to the fit.

### 5. The card grows past a landscape phone (defect, items 8 to 12 together)

Case. Phone card today: 299 by 280 px (report row164 step 0). The strip row (finding 4, about 60 px with its frame) plus the bar row (counter, Previous, Next, Fill; 44 px minimum on a phone, `report-code-row164-step1_r1_2026-11-01.md:8`) adds about 100 px. Portrait: fine. Landscape on a 390 px tall phone (`OPEN.md:695` already asks whether the card fits): the fixed part alone is near the screen, and `panelRoom` (`loupe-edge.ts:49-60`) leaves Syllables no room.

Change. Make the strip row part of the panel region that already scrolls (`.loupe-panel`, `Loupe.svelte:2560`, `max-height: panelRoom`), not part of the fixed `.loupe-top`. In landscape it scrolls with the rest; in portrait it shows whole. The music stays the anchor (Dann 2026-09-20, option B, `Loupe.svelte:2195-2210`).

### 6. Two bar counters in one head (finding, item 8 wording)

Case. The tag already reads "m. 14 · system 1 of 2" (`loupe.measureTag`, `i18n.ts:457`; systems computed at `Loupe.svelte:1996-1997`). Add "Bar 14, 1 of 3" and she reads the bar number twice and two different "of" counts in one line.

Change. Keep the measure tag as it is. The new row reads "1 of 3 to check", with Previous and Next, and no bar number. For a bar split across systems, Previous and Next step bars, never parts; the Loupe's own system handling shows the part under the cursor, and the strip is cut from that part's band only (two bands, possibly two pages, for one bar).

### 7. "Fill from the poem" with nothing to fill, and no poem (defect)

Case. Item 9 puts the strip on every bar. A bar with every syllable placed shows "Fill from the poem" that does nothing, or worse, overwrites. A scanned song where POEM is empty (row 114 song 1 has no library text, brief step 7) offers a fill from nothing.

Change. The button appears only on a bar the banner lists, and only when POEM has a line that option C can propose; otherwise the row holds the counter alone. After a fill, the button becomes its receipt, "Filled from the poem", and Undo in the header is the way back (the Loupe already carries Undo, `LoupeHeader.svelte:1-17`). The LYRICS receipt line (walk item 6) stays the overview.

### 8. "Once" must survive reopening, and the stamp change will re-read every song (defect, item 12)

Case. Item 12 says the Loupe never opens itself again for that song. Reopening a stored scan whose reading is current gives the kept reading (`restore.ts:40-52`, `restore.ts:88-91`); a reading kept under an older stamp is read again on its next opening, and amendment 13 moves the stamp to `underlay@4`, so every scanned song in her library is read again once. If "arrives" means any reading, every song she opens that week opens its Loupe at her.

Change. Define arrival as a drop (origin `'upload'`, `handleArrival`, `+page.svelte:2591-2598`), never a restore. Keep a `shown` flag with the reading so a re-read on restore stays quiet; the banner carries the bars.

### 9. Focus and the screen reader when the Loupe opens by itself (defect, item 12)

Case. The Loupe's music surface is `aria-hidden` (`Loupe.svelte:2301`, `:2140`), the keyboard path to notes is the window-level stepper (`correction-keys.ts:129-132`, ArrowLeft and ArrowRight), and nothing in `Loupe.svelte` or `LoupeHeader.svelte` declares a dialog role, a live region, or moves focus (grep this session: none). When the card rises by itself, a keyboard user's focus is still on the uploader in the drawer; a screen reader says nothing.

Change. When Ilya opens the Loupe by itself, move focus to the new row's counter (a `tabindex="-1"` element with a sentence as its accessible name: "Bar 14, the first of 3 bars to check against your scan"), and return focus to where it was on dismissal. Previous, Next, and Fill are buttons, so Tab reaches them; no new keys, because the arrows are taken. The strip is an `img` with alt text that says what it is and does not pretend to read it: "Your scan at bar 14, the words under the notes". The reader's own letters are visible text already (walk item 1), so the alt does not repeat them.

### 10. Desktop: the trackpad pinch and the "tap opens it larger" need a home that is not a second floating thing (finding, item 10)

Case. A trackpad pinch arrives as a wheel event with `ctrlKey`; left alone it zooms the whole page. "A tap opens it larger" invites a lightbox, and the Loupe is the named singular floating exception (`Loupe.svelte:3-7`).

Change. The strip grows in place inside its row, up to the panel's room, and pans sideways; the Loupe's existing minus and plus (`Loupe.svelte:2529-2530`, `loupeZoom`) are the desk's buttons for it. Whether those buttons scale the strip and the notation together or the strip alone is taste question 2.

### 11. The banner's sentence tells her to type, and the new path says tap (defect, strings)

Case. `upload.banner.wordsPartlyRead` (`i18n.ts:1528`) reads "Type the missing words into LYRICS exactly where they fall in the song." Item 8 makes the bar numbers links to the Loupe. Two instructions for one moment.

Change. The strings file the brief owes (`strings-row181_r1_2026-11-04.md`) replaces the sentence: name the bars as links, say the Loupe shows the print, and keep "Check every word against your score." Not "error", as item 8 says.

### 12. A tap on an empty note already opens the Loupe, so item 11 costs only the strip and the button (finding, confirms the ruling)

`handlePageTap` opens the Loupe on the nearest entry on any page tap (`+page.svelte:1397-1402`). Nothing new is needed on the page for item 11, and nothing is drawn there (WYSIWYG, `PRODUCT.md:751-756`).

### 13. Desktop: a click in the drawer keeps the Loupe up, which is the right behaviour and worth stating (finding)

Only a click on a sheet dismisses on a desk (`+page.svelte:1294-1334`, the `.score-page` box test). So she can read the strip in the Loupe and type into LYRICS at the same time. Item 12's "a click outside dismisses it" means a click on the page; on a phone there is no outside click (ruled 2026-08-27), so the swipe and Close are the way out there, and the walk needs to say so.

## Taste questions for Dann

1. The strip's row on every bar, always open, or as a disclosure like SYLLABLES (open by default on a bar in the banner, closed elsewhere, one tap away). Dann ruled every bar; a disclosure still gives every bar. Open always costs height (finding 5); a disclosure costs one tap on the bars she did not come to check. Recommendation: always open on a listed bar, a disclosure elsewhere.
2. One zoom or two on a desk: the Loupe's minus and plus scale the strip with the notation, or the strip alone. Together is one grammar; alone keeps the notation readable while the print grows. Recommendation: together, and measure.
3. The strip above the notes (ruled wording) or below the notes, above the IPA. Above matches a singer reading down from the print to Ilya's answer; below keeps the music as the first thing in the window, which N.149 made the anchor. Recommendation: above, as ruled, since the music's y does not move either way if the strip is in the panel region.

## Could not establish

- The print's letter height on row 114 f1 in page pixels, so finding 4's 18 px floor is a target to measure, not a number read.
- Whether the Loupe fits a 390 px tall landscape phone today (`OPEN.md:695`, still open).
- Whether anything in Ilya pinch-zooms today: no `gesturestart`, `GestureEvent`, or two-pointer handler found by grep in `apps/web/src/lib/score`; the brief's step 0 reports it.
- How a two-page bar's two band cuts are stored and joined (amendment 13 keeps geometry per system, not per bar).

