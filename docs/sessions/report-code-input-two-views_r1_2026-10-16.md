# Report: Input gets two views, Poem and Lyrics (r1, 2026-10-16)

Lane: a Claude Code cloud session on `cloud-lane-11`, started at `78bfb39` (the desk's commit on top of `01b638a`). The code is commit `c50e66a`; this report is the commit after it. Brief: `brief-code-input-two-views_r2_2026-10-16.md`, with the review `review-fable-brief-input-two-views_r1_2026-10-16.md` winning where they differ. Ruling: `docs/memory/OPEN.md`, "N.135 STAGE 3: TWO VIEWS OF INPUT, POEM AND LYRICS". No pull request. Nothing under `docs/memory/` was touched. Every measurement below was taken in headless Chromium 141.0.7390.37 on Linux (`/opt/pw-browsers/chromium`), against `pnpm dev` on this branch's working tree, unless a line says otherwise.

**A finding that changes a decision, first and alone: the poem's line breaks (ruling default 4) are built and tested but not wired into Lyrics, because `seatScoreWords` refuses any text that is not one line (`apps/web/src/lib/score/score-seat.ts:85`), so a laid-out Lyrics would silently turn off Place from here (`+page.svelte:627`), the arrival's first seat (`+page.svelte:2773`), and the N.157 replacement re-seat (`replace-seat.ts:76`); measured on «Within Four Walls»: 96 seats from the one-line fill, 0 from the same words in six lines (`apps/web/src/lib/text/lay-out-seat.test.ts`), so default 4 waits for a row that teaches `seatScoreWords` and `align` (`clitic-seat.ts:182`, keyed on `wordIndex` alone) several lines.**

The brief expected four string comparisons to be the only gates (section 5, amendment 3). This is a fifth, of a different kind: the helper that ignores whitespace would have kept the four comparisons true and the seat would still have refused. I did not widen the brief into `score-seat.ts`. `layOutLikePoem` (`apps/web/src/lib/text/poem-compare.ts`) and `sameWords` (`apps/web/src/lib/text/same-words.ts`) are written and tested and have no caller, so the four comparisons in `+page.svelte` (`:403`, `:626`, `:1997`, `:2022`) are as they were. Report item, not a ruling: "how many seats moved when the breaks were applied" is NOT MEASURED, because the breaks were not applied; the 96 and 0 above is what I measured instead.

WRITTEN on the code. DONE is Dann's look on his phone and the alias.

## 1. What the singer sees

Above the field's top right corner sits the pair **Poem | Lyrics**, `DeskHead.svelte`'s own markup and styles (`IntakeViews.svelte`, the pair; `DeskHead.svelte:113-128`, `:179-226`). Under it one line says which view this is. Lyrics is the sung text and is what seats, transcribes, and prints, exactly as the one field always was. Poem is the poet's published text, empty until it is pasted, typed, or read from a poem page, and it seats and transcribes nothing. In Lyrics, each word the poem does not carry is sage (`--sage-ink`); in Poem, each word the song does not set is grey (`--ink-tertiary`). A file dropped on the field goes where its content belongs whichever view shows, and the line says where it went. Text and Markup draw from Lyrics as they drew from the one field.

### The three measures of the done-when

All three on «Within Four Walls» (`apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`), phone viewport 390 x 844 with touch emulation (2x in my scripts, 3x in the committed test, the `phone` project's own), `pnpm dev`, headless Chromium 141. The scripts were throwaway and are not committed; what is committed is `apps/web/e2e-phone/input-views.test.ts` (4 tests, pass: `pnpm --filter @ilya/web exec playwright test --project=phone input-views`, `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`), which repeats the pair, the colour layer, the 44 px strip, and the seat count.

1. **The pair shows, each view holds its text, colours and greys fall where the alignment says.** After the score file was set on the picker: Lyrics selected, the line read "Your score's sung words are in Lyrics. Paste or type the published poem here, whole.", Lyrics held 39 words, the receipt read `LYRICS | 1 line | 39 words | from score | Clear | Replace`, Poem held `""`. A test poem built from the file's own words (a test text, not a published poem: the last 6 words left out and the 11th replaced by «ИЗМЕНЁННОЕ») gave 7 coloured ranges in Lyrics, `["дума","Вот","она,","ночь","моя,","ночь","одинокая."]` (the altered word and the 6 the poem lacks), and 1 grey range in Poem («ИЗМЕНЁННОЕ»). Lyrics text was unchanged by the Poem edit (276 characters before and after).
2. **A poem page dropped while Lyrics shows lands in Poem.** A one-page PDF with a text layer (made by Chromium itself) was dropped on the textarea as a `DataTransfer` file: the Poem field took the PDF's text, the line read "This page read as a poem and is in Poem. The sung words in Lyrics may differ from it.", the view stayed on Lyrics, Lyrics and its 97 seats were unchanged. A second poem page, with Poem already holding text, opened the page's one dialog first ("Replace the poem?", buttons `Replace the poem`, `Keep the poem`, the safe answer last); Keep changed nothing, Replace replaced. **Caveat that is the lane's, not the change's:** `pdfjs-dist` 6.2.108 calls `Map.prototype.getOrInsertComputed` and `Math.sumPrecise`, which this Chromium lacks, so with no polyfill the PDF is refused as "could not open that PDF" (console: `getOrInsertComputed is not a function`, on the page's unmodified path). I measured with both polyfilled in the page (`addInitScript`), and the worker still logs `Math.sumPrecise is not a function` as a warning. The poem-page routing (Poem field, no view change, the question first) is pinned without a browser in `apps/web/src/lib/text/input-views.test.ts`; a score's words landing in Lyrics is one line (`+page.svelte:2880`) and was observed in the browser only (measure 1).
3. **The seats do not move when the poem is pasted.** `pairings` read back from IndexedDB (`ilya-library`, store `songs`) before and after typing the test poem into Poem: 97 seats, 97 seats, every key and every value equal, `poem` (the Lyrics) equal, `publishedPoem` stored. Committed as an assertion in `e2e-phone/input-views.test.ts`.

**The Lamm scan is NOT ESTABLISHED in this lane.** `tools/e16-harness/scans/sunless-01-v-chetyryokh-stenakh_lamm-scan.pdf` loaded (the homr models downloaded, the reader started, the status read "Reading your score · page 2 of 2" at 280 s), and in a second run no score receipt had appeared after 1500 s, so no seats were made and no count was taken. The renderer sat at about 12 percent CPU, so I cannot tell slow from stuck. Dann's Mac takes this measure. The PDF is two score pages (I looked at page 1: no poem page).

**A multi-page PDF with the poem printed before the score**, what it does today, from code and not measured on a file (none is in the tree): `take()` rasterizes only the first page and routes the whole file on it (`ScoreUploader.svelte:280-299`); a first page with no staves goes to `readPdfAsPoem`, which reads the text layer of every page (`page-pdf.ts:299`) into one poem, so the score pages' words would come with it and the staves would not be read; a first page with staves goes to the score reader and a later poem page is never read. That is ruling default 13's job (the region rule), not this brief's.

## 2. The data model as built

`SongRecord.publishedPoem?: string` (`apps/web/src/lib/library/types.ts:188`, documented in the type's comment, which says the English words are inverted against the fields on purpose). `poem` stays the text that seats, which the singer sees as Lyrics. Named `publishedPoem` because `origin` is taken (a pairing's slot, `pairings.ts:341`; an arrival's source, per the brief, `+page.svelte` `applyArrival`'s `origin`).

- Stored only while not empty (`library.ts:132`), accepted as a string and marked malformed otherwise (`:249-250`), `SongFields.publishedPoem` and `doc.publishedPoem` (`document.svelte.ts:114`, snapshot `:284`, apply `:336`). No schema bump, nothing derived stored.
- Existing songs change nothing: their text is `poem`, Poem starts empty (`library.test.ts`, "an existing song keeps its text as the sung text and starts with an empty Poem").
- A binder carries it whole; a record without it imports with Poem empty (`exchange.test.ts`, "carries the poet's published text through a binder…").
- DESK DEFAULT, from the review: `proposeName` prefers it when non-empty (`songs.ts:52`, `songs.test.ts`), and a poem pasted into Poem names an unnamed song (`+page.svelte:2445`, `nameIfUnnamed`).
- DESK DEFAULT: the last view is remembered for the session, per song id, in `apps/web/src/lib/text/input-views.svelte.ts`, and not stored. First open: Lyrics, and Poem where Lyrics is empty and Poem is not (tested, and measured after a reload: Lyrics empty, Poem full opened Poem).

## 3. What moved out of `+page.svelte`, and the line counts

| File | Before | After | Ceiling |
|---|---|---|---|
| `apps/web/src/routes/+page.svelte` | 5651 | 5648 | 5652 (`scripts/ratchets.json`, untouched; headroom 4) |
| `apps/web/src/lib/components/Drawer/IntakePanel.svelte` | 1000 | 888 | 1000 for an unlisted file |
| `apps/web/src/lib/components/Drawer/IntakeViews.svelte` (new) | none | 548 | 1000 |

Added to `+page.svelte`: three imports, `handlePoemEdit` and `handlePoemPage` with their comment (`:2438-2458`), four props on `IntakePanel` (`:4027-4030`), `inputViews.land('lyrics')` on the fill (`:2880`), `onpoem={handlePoemPage}` (`:4085`). **Moved out to pay for it:** `handleReset`'s 45-line body, now `resetWord` in `apps/web/src/lib/word-reset.ts` (61 lines, 6 tests) and 12 lines in the page (`:2367-2378`). It builds the maps with that word's overrides removed and returns `null` for a map the word was not in, so the page assigns only what changed, as it did. `ScoreUploader.svelte` and `pipeline.ts` were not touched. The IntakePanel loses the textarea, the camera block, `arrivalOf`, `WHOLE`, and Cmd+Enter (all moved into `IntakeViews.svelte` word for word), and its `.text-input` rules, which moved with their rulings quoted.

The camera stays where it was against the field: `IntakeCamera` is `position: absolute` at 6 px inside its positioned ancestor, which was the frame, so `IntakeViews` renders it in a zero-size anchor at the frame's corner (`.corner`, `top: -12px; right: -12px`).

## 4. The render technique, and what it cost on a phone

**Built: a layer behind the textarea, painted with the CSS Custom Highlight API where the browser has it and with spans where it does not.** The layer is a `div` with the textarea's own face (font, size, line height, padding, border, wrapping), holding one text node; the textarea's glyphs are transparent over it and its caret is inked. The textarea stays a plain textarea, so typing, caret, selection, paste, undo, IME, and drop are native.

What I measured, in order, because the first build failed one test and the second passed it:

- **With a span around each coloured word (the fallback path), the layer re-wrapped one word onto another line than the textarea's in 2 of 120 random cases at phone width** (field 200 to 300 px, 40-word texts with random repeats and alterations), against 0 of 120 for a plain clone (on the desk at 1440 px, 0 of 120 for both). A span's edges shift sub-pixel widths at a break, which would put colour a line off the caret. That is why the highlight API is the primary path.
- **With the highlight API: pixel-identical.** For the layer shown and the textarea hidden, against the textarea's own text shown and the layer hidden (colours forced to ink in both, since the textarea draws no colour), 0 differing pixels in 28 of 28 hand samples at 390 px, 28 of 28 at 360 x 640, 28 of 28 at 1440 with classic scrollbars (`--hide-scrollbars` off), and in 120 of 120 random cases on the phone and 120 of 120 on the desk (14,765,904 and 5,728,932 pixels compared). The samples cover short and 14-line text, an unbroken 70-letter token, a trailing newline, blank lines with tabs, hyphenated syllables with « » and a dash, scrolled to the bottom and not, with and without a Poem. The spans path read 0.35 percent (phone) and 1.41 percent (desk) of pixels different, which is sub-pixel glyph edges.
- **Positive control for the instrument:** the same test with the layer's padding +1 px, its font +0.5 px, or its letter spacing +0.1 px reads 11,229, 13,821, and 9,503 differing pixels. With no change it reads 0.
- **Typing, caret, paste, undo, drop on the phone viewport (touch emulation):** a tap on the middle of four different words put the caret inside that word each time; keyboard typing, Backspace, and `insertText` landed at the caret; a paste (Ctrl+V of clipboard text) replaced the text and the word transcribed within 250 ms (the paste path, `insertFromPaste`); Ctrl+Z undid it; Ctrl+Enter added no newline; selection draws correctly over the layer (screenshot with `setSelectionRange`); a file drop on the textarea reached `onfile` (section 1, measure 2). The IME sequence (`Input.imeSetComposition`, then `insertText`) gives «привет» in the plain textarea.
- **Contenteditable, the other technique, spiked in a throwaway page at the same viewport:** typing with the caret restored by hand works; the same IME sequence with a re-render on each input event gives «прприпривет», and re-rendering only after composition ends gives «привет» but with the colour lagging during composition. It needs hand-written caret and composition handling that the textarea gives free, so I did not build it. This is a spike, not a measurement of a built field.
- **NOT ESTABLISHED:** WebKit (iOS Safari) and Firefox, which I cannot run here; which versions of Safari and Firefox have `CSS.highlights` (where they do not, the spans path runs and its 2-in-120 re-wrap applies); touch word-selection gestures: a double tap and a long press (`Input.synthesizeTapGesture`, raw touch events) select nothing in this Chromium on a plain textarea either, so the control gives the same empty result and I cannot say the layer costs or spares them. The fallback in section 12 of the brief (no colour, a count in the line) was not needed on Chromium; it is the answer for any phone where Dann's look finds the layer costs one of the five.

## 5. The gates, before and after

Before: run on the branch head before any change, 2026-10-16 about 16:28 to 16:39, all eight at the brief's numbers. After: run on the working tree that was then committed.

| Gate | Before | After |
|---|---|---|
| phonology | 267 | 267 passed |
| dictionary | 248 | 248 passed |
| web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| web-test | 2657 | 2726 passed (2657 + 69 new) |
| score-parser | 709 passed, 5 skipped | 709 passed, 5 skipped |
| blurb | 145 | 145 passed |
| integration | 55 | 55 passed |
| ratchets | OK | OK (`+page.svelte` 5648 of 5652) |

New web tests, counted: 69 (2657 to 2726). `library.test.ts` 5, `exchange.test.ts` 1, `songs.test.ts` 1, `ratified-lines.test.ts` 11 (the strings, section 6), `poem-compare.test.ts` 31, `input-views.test.ts` 13, `word-reset.test.ts` 6, `lay-out-seat.test.ts` 1. Changed, not added: `i18n.test.ts`'s two French sweeps now skip a key whose French is owed (`hasString`), since `t` returns `[MISSING: key]` for it, which is not French prose. Playwright, outside the eight gates, on the final tree (`pnpm dev`, `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`):

- `--project=phone`, the new `e2e-phone/input-views.test.ts`: 4 passed.
- `--project=chromium`, the whole suite: **70 passed, 2 failed, of 72.** The two are `e2e/insights-page.test.ts:95` (order check reads `[-1,503,1003]`) and `e2e/singer-paths.test.ts:169` (Learn's French title is « … pour chanteuses et chanteurs », the test expects « … pour chanteurs »). They are the same two files, lines, and messages that `report-code-row5_r1_2026-10-15.md` recorded as failing identically on a pristine `14e2ff8`; I did not re-run them on a pristine tree here, so "pre-existing" rests on that report and on the failure text, which names nothing this change touches.
- **Three existing selectors had to change, and they are in this commit.** `e2e/octave-line.test.ts:78` and `:140` and `e2e/tempo.test.ts:51` took `page.getByRole('tab').nth(1)` or `.nth(2)` for Markup and Insights. The new pair is `role="tab"` (the brief asks for DeskHead's pair exactly), and the drawer comes before the desk head in the DOM, so those indices named Lyrics and Text. They are `page.locator('.desk-head').getByRole('tab')` now, still language-independent. Before the change, `octave-line` failed 4 of its first 4 tests in my first run (one of them for 4.0 minutes).

One failure on the way, fixed: `approval/i18n-keys.test.ts` held the literal `t('intake.placeholderLyrics', …)` to both languages, as it should. The field now reads that one key through `tIfPresent` (`i18n.ts`), which returns the empty string for an absent language, so the guard keeps meaning what it says.

## 6. The strings as built

Section 8's table, character for character, in `apps/web/src/lib/i18n.ts` (`intake.view.*`, `input.watermarkLyrics`), pinned in both languages in `apps/web/src/lib/insights/ratified-lines.test.ts` ("ratified Input view lines (N.135 stage 3)"), with the French colon carrying ` `. The key names are the desk's and I kept them. `intake.placeholder` is unchanged and pinned. `no-fit-name.test.ts` passes on every new string.

- **`intake.placeholderLyrics`:** English is the review's: "Your score's sung words appear here. You can also paste or type them." **No French.** The slot is empty and the field draws no placeholder in French until Dann rules; the French of `intake.placeholder` is not reused.
- **Owed, new, not in the brief:** the question before a poem page replaces a Poem needs four strings, and none was ratified. `intake.poemReplace.title`, `.body`, `.replace`, `.keep` are DESK DRAFT in English ("Replace the poem?", "This page read as a poem, and Poem already holds one. Replacing it cannot be undone.", "Replace the poem", "Keep the poem") with the French empty, and the dialog reads them through `tOrEnglish`, so a French singer sees the English until he rules. Not French he has not seen in the tree. DRAFT FOR DANN, not in the tree: « Remplacer le poème? », « Cette page a été lue comme un poème, et le champ Poème en contient déjà un. Ilya ne peut pas annuler cette action. », « Remplacer le poème », « Conserver le poème ». Adopted from the file: « Ilya ne peut pas annuler cette action » (`replace.body`), « Conserver » (`replace.keep`), « Remplacer » (`replace.replace`), « le champ Entrée ». Coined: « le champ Poème ».
- **The two French flags from the review stand, Dann's to rule before the merge, not changed:** `lyricsLine` « les place » against `omittedLine` « mis en musique »; the bare label after « dans » (« dans Paroles », « dans Poème »).
- **One lead, from this build:** the ratified English uses a straight apostrophe (« Your score's »), where the Insights strings use the typographic one (`ratified-lines.test.ts`, the frame line). I built the straight one, as ratified.

## 7. N.147, brought as a case

Lyrics adds no placing control: it is the source text this band has always shown, edited in place; placing stays in Markup and the loupe (`IntakePanel.svelte:116-123` is the note, still true). The one new thing in the band is colour on the words that differ from the poem, in a layer behind the one textarea, not a second copy. Dann sees the Lyrics view on a phone before the flag of this row comes off.

## 8. Decisions that were Code's, each a DESK DEFAULT

- The field is `publishedPoem`, and the Poem receipt shows the line count only (the word count is the transcription's, and the transcription is of Lyrics).
- The highlight API with a span fallback; `.layer` as the textarea's twin; `font-size: max(1rem, 16px)` on the layer on a coarse pointer, to match `app.css`'s N.23 rule for textareas (otherwise the layer wraps at 14.4 px under a textarea at 16 px).
- The 44 px touch strip is a transparent `::after` on each member, 44 px tall, centred, on a coarse pointer; the drawn pair is 24.6 px tall (measured). `.pair` loses DeskHead's `overflow: hidden`, which would clip the strip, and the members round their own outer corners at 3 px instead (the border's 4 px less its own 1 px), so the active fill is shaped as it was.
- The comparison (`poem-compare.ts`): earliest copy matches, so a composer's repeat is what is coloured; `oldEndingCandidates` is applied as a pair test, so a print's «шумнаго» matches a poem's «шумного» without a dictionary gate (the brief named `modernisePreReform` only, which returns null for -аго); the table cap is 4,000,000 cells (2000 by 2000 words) and past it the field shows no colour.
- A drop does not change the view; the line says where the content went. A score's words arriving while Poem shows and is empty does not switch the view (the first-open rule is the only rule that picks one).
- The tablist's label is `source.heading` (the intake's existing accessible name), because no ratified string names the pair.

- **A consequence of ruling default 9 that Dann should hear, and which I did not soften:** a singer with no score and an empty Lyrics who drops a photograph or a PDF of a poem now gets it in Poem, and Text stays empty, because Text transcribes Lyrics (default 7) and a poem page goes to Poem (default 9). The line says where it went and does not say Text is empty. Pasting into Lyrics, the default view, works as it always did. If poem-only singers should still get IPA from a dropped poem, the cheap rule is that a poem page also fills an empty Lyrics when no score is attached; it is a change to the ruling, so it is Dann's.

## 14. What I could not establish

- The Lamm scan's seats before and after a poem: the reader did not finish in 1500 s here (section 1).
- Whether any browser but this Chromium wraps the layer as the textarea does; WebKit and Firefox are not run here.
- Touch word-selection gestures on the layered field (section 4).
- How many seats move when the poem's breaks are applied: they were not applied (the finding above).
- A PDF page dropped on the field without polyfilling `pdfjs-dist`'s two newer built-ins: it fails here on the unmodified path; whether it fails in Dann's browser is NOT ESTABLISHED, and I expect not (his Chrome is newer), which is an expectation, not a measurement.
- Which `--sage-ink` on the cream field is the sage Dann meant at 00:32: he sees it on the walk. In the screenshots it reads as a dark olive against the ink, visible but not loud.
- The multi-page PDF with the poem before the score: not measured on a file (none in the tree); the paragraph above is read from code.
