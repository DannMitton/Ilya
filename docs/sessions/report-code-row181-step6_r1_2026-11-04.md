# Report: row 181, step 6 (the print waits at the bar), Code, r1, 2026-11-04

Branch `cloud-lane-34`, on top of step 5 (`e98c72fb`). The strings are the ratified ones of `strings-row181_r1_2026-11-04.md` (English and French, exactly; a test pins each). **None of this has been run in a browser.** The logic is unit tested and `svelte-check` is clean, but the strip, the pinch, the self-opening Loupe, the focus, and the phone layout have not been seen by anyone. They are WRITTEN, not DONE, and the walk is the desk's. No row 114 count is given (step 7 is the desk's). NOT ESTABLISHED marks what I could not establish.

## 1. What a singer meets (the code, item by item)

| Ruling | What the code does | Where |
|---|---|---|
| Item 8: bar numbers are links | The banner's bars are buttons; a tap opens the Loupe on that bar. A range has two links (its first and last bar); the bars between are reached with Next. The words and commas are the banner's own (`barPieces` prints exactly what `barsText` prints, tested in both languages) | `components/Drawer/ScanBanner.svelte`, `omr/banner-bars.ts`; one line in `+page.svelte` |
| Item 9 and 13: the print on every bar, always open | On a scan read with bands the strip is drawn on any bar, listed or not, with no fold control. A song that is not such a scan draws nothing | `score/LoupePrintStrip.svelte`, `score/loupe-print.svelte.ts` |
| Item 15: header, strip, drawn notes, syllables | The strip is the first thing under the LOUPE header, above the tag and the drawn notes; the syllables stay in the panel below as before | `score/Loupe.svelte` (one line) |
| Item 8 and 12: «m. 14 · to check, 1 of 3», Previous, Next | For a listed bar the Loupe's tag is the ratified string; a row under the strip has Previous and Next (drawn as arrows, the ratified strings are their labels). They stop at the ends; they do not wrap | `loupePrint.tagFor`, `LoupePrintStrip.svelte` |
| Item 11 and answer 2: a refused run draws nothing; its empty notes and the bar open the Loupe | Nothing is drawn on the page (step 4's offer). A tap on an empty note already opens the Loupe on its bar (`handlePageTap`, `+page.svelte`), which now has the strip; the banner's bar opens it too | existing tap path, banner link |
| Amendment 9: "Fill from the poem" | Shown only on a listed bar where the join has poem words for it. One tap inserts the poem's words between the run's two paired neighbours into Lyrics, marked; the reseat seats them on the open notes in order; words past the last open note stay in Lyrics unseated; the bar stays in the banner. The receipt and Revert cover it. It applies even where the count rule refused the run | `PoemJoin.fillBar`, `PoemJoin.canFill` |
| Item 14: one zoom on a desktop | The strip is drawn at a multiple of its window that follows the Loupe's minus and plus (`loupeZoom.factor`) | `stripScale` |
| Item 10: pinch | Two pointers on the strip are a pinch that enlarges the strip alone, in place, and it pans sideways. A trackpad pinch (a wheel with the control key) does the same instead of zooming the page. A tap enlarges it and a second tap returns it. It never goes past the scan's own pixels: it is drawn from the stored scan at its own resolution and not stretched past it | `LoupePrintStrip.svelte` |
| Item 12: the Loupe opens itself once | When a dropped scan has read and the banner lists bars, the Loupe opens on the first. Never on a restore (the call is made only for an upload), never again for that song in the session, never when nothing is listed or no scan is there to show | `loupePrint.arrived`; one call in `applyArrival` |

## 2. Fable's memo findings, as built

1. **The order that holds on a phone (finding 1).** `openAt`, the page's lend, does: return if the Markup wall is closed or the bar has no note; switch to Markup (`handleTabChange('markup')`); on a phone lower the drawer; set the cursor to the bar's first sung note; then open the Loupe. On a desktop the drawer stays. (`+page.svelte`, the `loupePrint.attach` call.) The first sung note is found by `firstNoteOfBar`: the measure whose number is the bar, else the bar-th measure. NOT ESTABLISHED: that every scan's measure numbers equal the song's bars (the banner's bars come from the join, `omr/join-pages.ts`).
2. **A pinch never reads as the dismiss swipe (finding 2).** I moved the swipe handling out of the page into `score/loupe-swipe.svelte.ts` and gave it a pointer count: while two pointers are down, and for the `pointerup` that ends either, the swipe test is skipped, and the "gesture began on the surface" flag stays up so a pinch that drifts onto the drawn notes cannot place a syllable by the click after it. Tested: a swipe, a short one, a sideways one, off the surface, on a desk, with the Loupe shut, a pinch, and a swipe after a pinch.
3. **The strip is a framed picture (finding 3).** A hairline frame; the bar's two ends are the frame's two ends; it is not cut per note and no alignment to the drawn notes is sought (Dann 14:18).
4. **Phone legibility (finding 4).** On a phone the strip opens at a width that keeps the print's letters at 18 px where it can (`MIN_LETTER_PX`, letter height taken as 0.8 of the staff space, `LETTER_OF_SPACE`), panning, with the pinch to refine. **Both numbers are JUDGEMENT**; the memo calls the 18 px a target to measure on row 114, and I have not measured it.
5. **The card (finding 5).** The strip sits in `.loupe-top` with the header (so the Loupe's own measure of that part includes it and leaves the panel less room), not in the scrolling panel. Item 15's desk default was "the strip begins the part that scrolls on a short screen"; I did not build that. On a landscape phone the strip and its row take height from the panel. NOT MEASURED, NOT FIT-TESTED (`OPEN.md:695` still asks whether the card fits a 390 px landscape phone).
6. **One counter (finding 6).** The tag for a listed bar is the ratified «m. 14 · to check, 1 of 3» in place of «m. 14 · system 1 of 2»; a listed bar therefore loses the system count in the tag. NOT ESTABLISHED: whether Dann wants both; the strings file gives one tag. A bar split across two systems is cut from the first system that holds it (`systemOfBar`); the memo's "two bands, possibly two pages" is not built.
7. **The button only where it can act (finding 7).** On a listed bar with poem words for it. After a fill the button is gone (no receipt string was ratified for the button; the Lyrics receipt line is the overview).
8. **"Once" survives a restore (finding 8).** The call is made only on an upload. The session set is in memory; after a reload a dropped scan is a new arrival only if dropped again.
9. **Focus and the screen reader (finding 9).** When the Loupe opens itself, a hidden twin of the tag takes focus and its text is the ratified tag; when the Loupe closes, focus goes back to where it was. The strip is an `img` with the ratified alt text, «Bar 14 as printed in your score». No new keys (the arrows are taken).
10. **Desktop pinch and tap (finding 10).** The strip grows in place, not in a lightbox.
11. **The banner's sentence (finding 11).** The ratified sentence replaces "Type the missing words…": «Choose a bar to see your score's print there and fill the missing words.» and «Choisissez une mesure…».

## 3. What changed

| File | What |
|---|---|
| `score/loupe-swipe.svelte.ts` (new) | the swipe and the pointer count, moved out of `+page.svelte` |
| `score/loupe-print.svelte.ts` (new) | `LoupePrint`: the list, the tag, the strip, arriving once, focus; `stripScale`; `firstNoteOfBar` |
| `score/LoupePrintStrip.svelte` (new) | the strip, the row, the pinch |
| `components/Drawer/ScanBanner.svelte` (new), `omr/banner-bars.ts` (new) | the banner with bar links |
| `omr/kept-bands.ts` | `BarExtent`, `barExtents`, `systemOfBar`, `stripRect`, the strip cap; `KeptSystem.barXs?` (additive) |
| `omr/underlay-page.ts`, `omr/underlay-song.ts` | each system keeps where each bar stands across the page, from its notes' x (the ink: `CONTRACT.md` §0.2), in the song's bar numbers |
| `text/poem-join.svelte.ts` | `canFill`, `fillable`, `fillBar`; the last plan is kept (reactive) |
| `i18n.ts` | `loupe.measureTagCheck`, `loupe.checkPrev`, `loupe.checkNext`, `loupe.fillFromPoem`, `loupe.printAlt`; the two banner keys revised; the key index line and totals (1,147 keys) |
| `score/Loupe.svelte` | **3011 before, 3012 after** (ceiling 3013, now lowered to 3012): one line added for the strip; the tag line edited in place; the two imports on an existing line |
| `routes/+page.svelte` | **5586 before, 5549 after** (ceiling lowered to 5549). 36 lines moved out (the swipe), one banner line replaced in place, the `loupePrint.attach` and the arrival calls on existing lines. Amendment 18 holds: the commit moves out more than it adds |
| `scripts/ratchets.json` | `+page.svelte` 5549, `Loupe.svelte` 3012 |

## 4. Departures and what is not built

1. **The bar's x-extent is kept at read time, in the stamp that is already `underlay@4`.** Cropping the strip "to the bar by its notes' x" needs the notes' x, which step 3 did not keep (only the band). I added `KeptSystem.barXs` (additive): each bar begins 1.5 staff spaces left of its first note, ends where the next begins, and the last ends 4 spaces right of its last note (`BAR_LEAD`, `BAR_TAIL`: JUDGEMENT, not measured). I did **not** move the stamp again: step 3 has not shipped to a singer. A reading kept under `underlay@4` before this commit has no `barXs`; its strip is the system's whole band width, which on a phone is unreadable until it is read again. The desk must read scans fresh (it must anyway, for steps 1 and 2).
2. **The strip is capped at five staff spaces tall** (`STRIP_MAX_SPACES`), because a band under the last system runs twenty. JUDGEMENT, not measured: a second verse may fall outside it.
3. **Item 15's "the strip begins the part that scrolls"** is not built (above, memo finding 5).
4. **The bar cut for a bar on two systems or two pages** is the first system's only.
5. **"Fill from the poem" is available only on a bar whose run the join knows** (the join ran for this Poem and Lyrics, with the dictionary loaded). Otherwise the button is absent, not disabled.
6. **The stored scan for a reopened song** is `restoreSource` (the bytes and the kept reading); for a dropped one, the file the drop read. NOT ESTABLISHED: a song reopened after a drop in the same session, before a reload, whose `restoreSource` is stale; the dropped file wins for the open song, which covers it.
7. **Phone and desktop differ only in the strip's opening scale, the pinch, and the dismiss rule** (the swipe is a phone's). The self-opening Loupe lowers the drawer only on a phone.
8. **The printed strip is never printed:** it is in the Loupe, not on the page, and the Loupe is not a print surface.

## 5. Tests

| Test file | New |
|---|---|
| `score/loupe-swipe.svelte.test.ts` (5) | the swipe and its refusals; a pinch is never a swipe; the surface flag; a cancelled gesture |
| `score/loupe-print.svelte.test.ts` (21) | the list and the ratified tag in both languages; the strip cut to the bar, capped, from the right page, once for the session; null where nothing can be cut; every bar of a scan; the dropped scan; the alt text; opening once; focus returned; `stripScale`; `firstNoteOfBar`; `barExtents`, `systemOfBar`, `stripRect`; every ratified string, character for character |
| `omr/banner-bars.test.ts` (3) | the pieces print what `barsText` prints, the links, the list of bars |
| `text/poem-join.svelte.test.ts` (+5) | a refused run draws nothing and changes nothing; the button on a bar of the run and not another; one tap inserts, marks, counts, and cannot be tapped twice; Revert takes it back; nothing when the Lyrics have moved or the song is read-only |

## 6. Gates (this sandbox, Linux)

| Gate | Result |
|---|---|
| web unit | **4354 passed, 1 skipped** (245 files). After step 5: 4318 passed plus the two index tests fixed there; +36 tests, +4 files in this step. The first run of this step had 5 failures in 2 files, `insights/ratified-lines.test.ts` and `score/scan-notice.test.ts`: they pinned the banner's middle sentence as ratified 2026-10-28 («Type the missing words…»), which Dann's ratification of 2026-11-04 14:33 replaces. I updated those pins to the new sentence (the first and last sentences are unchanged) and re-ran the whole suite |
| web-check (`svelte-check`) | 0 errors, 12 warnings (equal to baseline) |
| ratchets | OK, with `+page.svelte` 5549 and `Loupe.svelte` 3012 |
| build | `vite build` alone succeeds (adapter-static wrote the site): the new components compile for production. **The full `pnpm build` script was not run** (it fetches OMR models over the network first) |
| e2e, others | not run: the e2e suite needs the full build; nothing outside `apps/web` and `scripts/ratchets.json` changed |

## 7. Not established

Every browser behaviour listed at the head; the strip's real size and legibility on a phone; whether the Loupe's `.loupe-top` has the room for the strip on a short screen; the two scales (0.8 of the staff space for a letter, 18 px floor); the bar extents' margins; measure numbers equal to song bars on every scan; whether `drawerRaised = false` and the cursor order really keep the Loupe up on a phone (the memo reasoned it from `+page.svelte:1477-1479`, which I kept); the join on a real song; step 7 (the desk's).
