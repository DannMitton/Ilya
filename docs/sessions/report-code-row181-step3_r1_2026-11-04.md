# Report: row 181, step 3 (the band is kept as geometry; the picture is cut when asked for), Code, r1, 2026-11-04

Branch `cloud-lane-34`, on top of the step 2 commit (`839a67cb`). Fable's amendments 12 and 13 replace the brief's step 3, and Dann's taste answer 1 (section 9 of the brief: **every bar**, 2026-11-04 13:52) fixes the design as (a): the strip is cut from the stored scan when the Loupe opens, on any bar of a scanned song. **This is the last step I take. Step 4 waits for Dann's taste answer; step 6 waits for ratified strings.** Nothing here is a row 114 measure. NOT ESTABLISHED marks what I could not establish.

## 1. The line for Dann

**Every scan kept under the underlay switch (`?words=read`) before this commit is read again once, on its next opening, through the reading wait.** The stamp moves from `underlay@3` to `underlay@4` (`omr/stamp.ts:50`, doc comment above it). A singer who does not use the switch is not affected: her stamp is the reader's alone (`omr/underlay-switch.ts`, `scanStamp`). How long the one re-read takes per page is the desk's number (NOT MEASURED).

## 2. What is kept

| Piece | Where | What |
|---|---|---|
| `KeptSystem` | `omr/kept-bands.ts` | per voice system of each page: `page` (1-based, the **scan's** page, not the song's after a cover), `system` (1-based, top to bottom), `bars` (the song's first and last bar), `why` (`null`, `'no ink'`, `'no Russian row'`, `'no band'`), and `band` (`x0`, `x1`, `y0`, `y1` as fractions of the page's width and height, and `space`, the staff space as a fraction of the page's height) |
| `KeptReading.bands?` | `omr/stamp.ts` | an additive field beside `musicXml` and `stamp`; a reading without it reads as before (`isCurrent` still tests the stamp and the text only: `omr/restore.ts:40-42`) |
| the fractions | `omr/underlay-page.ts` (`SystemLayout.band` in page pixels, from `prepareUnderlay`; `SystemWords.band` in fractions, from `seatPage`) | five decimals (`kept-bands.ts`, `fixed`): under a fiftieth of a pixel on a page of 3,500 rows |
| the song's list | `omr/underlay-song.ts` (`applyUnderlay(xmls, pages, scanPages?)` returns `systems`) | one entry per system that holds a voice note; the song's bars are those the banner uses; `scanPages` carries the scan's page past a left-out cover |
| the flow | `omr/homr-reader.ts` (`scanPage` on each song page, `bands` on the result), `omr/scan.ts` (first read), `omr/restore.ts` (read again) | the reading is `{ musicXml, stamp, bands }` where the reader ran |

- **What this is not.** The band's picture is not kept (amendment 13). The scan is already kept byte for byte (`CONTRACT.md` §8, the exception for the reading of a scan, stated in `library/driver.ts:58-66`).
- **Size.** About 112 bytes of JSON for a written system and 124 for an unread one (one sample object, measured with `JSON.stringify`). Five systems on each of five pages is under 3 KB a song. This is the one storage cost of the step; there is no picture to count.
- **Reaches the stored record.** `SourceBytes.reading` is stored whole (`library/driver.ts:49-66`, the sources store at `:412`); a test (`omr/kept-bands.test.ts`, "the library keeps the bands beside the reading") round trips a source whose reading carries bands and one whose reading has none through the IndexedDB driver under `fake-indexeddb`. I did not check the memory driver's copy semantics beyond its use of `structuredClone` for records.
- **Amendment 12's fields are in:** `{ page, system, bars: [first, last], why }` beside the band geometry. The join (step 4, not started) is to read option C's inputs from `KeptReading.bands`, never from the banner's merged ranges. `isKeptSystems` (`omr/kept-bands.ts`) is the guard that reads a malformed list as no list; today the only caller is the measure below. It will have a second caller in step 4.
- **`why` in the list is the system's, not the page's.** A page the reader did not answer for, or answered with no system on it, keeps no entry; its bars stay in the banner as `page not read` or `no staff found` as before (`omr/underlay-song.ts`, `unread`). NOT ESTABLISHED: whether the join needs those pages in the list. Step 4 decides.

## 3. The measure the amendment asks for (a), (b), (c)

I cannot run it: it needs row 114's scans in a browser. I built it so the desk can, on the phone and the desktop, in one sitting (amendment 19).

- **Switch.** `?words=read&strips=measure`. Nothing changes for the singer without it. With it, after a scan is read (`omr/scan.ts`, `readScanAsScore`) or restored (`omr/restore.ts`, `restoreStoredScan`; this is the **reopen** case, which uses the stored bands), `omr/band-strip.ts` renders each page of the stored scan that has a band, once, cuts each band, and prints one console line: `[omr] band strips: page 1 render 812 ms (upper bound: pages 1 to 1 are rendered); … cut (page.system, w written or u unread): 1.1w 2480x310 31204 B 14 ms, …; (b) unread systems only (canvas PNG, an upper bound): page 1: … B, song … B; (c) every system: page 1: … B, song … B`.
- **(a) the seconds to render a page and cut one band.** The render time is per page; the cut time is per band. Two limits, both stated in the file header and in the console line:
  1. A PDF page is rendered by `rasterizePdf(file, page)` (`reader/page-pdf.ts:143`), which renders pages 1 to `page`; there is no single-page render. So the render time of page 3 includes pages 1 and 2: an **upper bound** for the single-page render the Loupe would want. I did not change `page-pdf.ts`. A single-page render is the change that would make (a) cheaper; whether it is worth making is the desk's call after the number.
  2. The Loupe does not exist in this step, so "when the Loupe opens" is represented by the render and the cut taken together. The in-memory cache for the session (the amendment's DESK DEFAULT) is part of step 6's Loupe and is not built.
- **(b) and (c) the bytes.** The strip is cut by `OffscreenCanvas.convertToBlob({ type: 'image/png' })`, which is an 8-bit RGB PNG with equal channels, not an 8-bit greyscale PNG. The bytes are an **upper bound** for the lossless greyscale crop the amendment names. (b) totals the systems that took no words, per page and over the song; (c) totals every system.
- **The amendment's DESK DEFAULT.** "Ship (a) where it is under one second on the phone, cached in memory for the session; else (b). (c) is Dann's call." Dann has since ruled every bar, so (c) is the shape and (a) is the design. What (a) costs on the phone decides whether the cache and the single-page render are needed. That is the number to bring.
- **The cut itself needs a browser.** `cutBandStrip` uses `createImageBitmap` and `OffscreenCanvas` and returns null where there are none (tested: a unit test is not a browser). I have not run it. It is WRITTEN, not DONE.

## 4. Tests

| Test file | New |
|---|---|
| `omr/kept-bands.test.ts` (new, 12) | fractions hold at any dpi; null for a page with no size; a rectangle inside the page; the guard; each seated system gets its band; the kept list with the scan's page after a cover, the song's bars, the reason, and the band; a later page's bars from the song; `'no ink'` for a silent system; the measure's totals; a page it cannot render and a band it cannot cut; it runs only with `?strips=measure`; the IndexedDB round trip |
| `omr/underlay-switch.test.ts` (+2) | a reading kept under `underlay@3` is read again once, with the stamp `underlay@4`; the bands travel with the reading, and a reading without them reads as before |
| `omr/underlay-integration.test.ts` (+1) | the reader hands the reading the kept systems of every page with the scan's page numbers, and none where no underlay reader ran |

## 5. Gates (this sandbox, Linux)

| Gate | Result |
|---|---|
| web unit | **4267 passed, 1 skipped** (239 files). After step 2: 4252. +15 tests, +1 file. Run after the last code edit (the five-decimal rounding and the guard in `maybeMeasureStrips`) |
| web-check (`svelte-check`) | 0 errors, 12 warnings (equal to baseline) |
| ratchets | OK. `+page.svelte` 5586 (not touched in this step), `pipeline.ts` 925, `pairings.ts` 1420 |
| score-parser, phonology, dictionary, blurb, integration, e2e | **not run in this step**: no file in them changed after step 1 (score-parser re-run after step 1's type edit: 785 passed, 5 skipped). I did not reproduce the desk's 407, 248, 148, 125 |

## 6. Departures from the brief or a ruling

- The brief's step 3 kept the band's picture, "greyscale, losslessly compressed". Amendment 13 replaces it with geometry and a cut on demand. I followed the amendment, and Dann's answer 1 fits it.
- Amendment 13's measure (a) is "when the Loupe opens". The Loupe is step 6, so I measure the render and the cut, not the open.
- The stamp moves now, in step 3, as the brief and amendment say. Steps 1 and 2 changed reader output without a stamp move (see their reports: the desk must read scans fresh for those measures). With this step the stamp protects the singer.

## 7. Not established

The one-time re-read cost per page; (a), (b), and (c) on the phone and the desktop; whether the join needs pages with no system in the list; the browser behaviour of `cutBandStrip` and of the second Worker request from step 2; row 114 (the desk's: the 369 control, both extender arms, the ink-share distributions, the looks).
