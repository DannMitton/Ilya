# Report: row 181, step 0 (read, no change), Code, r1, 2026-11-04

Branch `cloud-lane-34`, made from `origin/Shane` at `9088d26c` (fetched first). Working tree clean at the start. The brief is `brief-code-row181-joining-poem-to-lyrics_r2_2026-11-04.md`, read in full with section 8 (21 amendments) and section 9; the review is `review-fable-brief-row181_r1_2026-11-04.md`. Every line below was read by me in this run, on this branch, in a Linux sandbox. Nothing in the tree was changed. NOT ESTABLISHED marks what I could not establish.

## 1. The control is the desk's, not mine

Row 114 first file, the 369 of 590 control (48, 136, 29, 82, 74), is **not measured here**. Its scans and its scorer (`~/Downloads/_desk-2026-11-02/m0/`) are on Dann's Mac and are not reachable from this sandbox. I report no count for row 114 in this step. Under amendment 19, any count taken elsewhere is unanchored; I take none.

A correction to the brief's control line: it says "`Shane` merged with `cloud-lane-31`". `origin/cloud-lane-31` (`8ce4d2ce`) is already an ancestor of `HEAD` (`git merge-base --is-ancestor origin/cloud-lane-31 HEAD` succeeds, and `git branch -r --contains` lists `origin/Shane`). So `Shane` at `9088d26c` already carries the poem build, and every `cloud-lane-31:` citation in the brief is now a plain `Shane` path. The desk needs no merge for the control. (The census read `a0772f8f`; the branch tip is `8ce4d2ce`. I did not diff the two.)

## 2. Section 2 lines re-read

Each of these held at the cited line unless marked MOVED.

| Claim | Where I read it | Result |
|---|---|---|
| Kept reading is `{ musicXml, stamp }` | `omr/stamp.ts:53-56`; `UNDERLAY_READER = 'underlay@3'` at `:50` | holds |
| Band in page pixels, page size known | `omr/underlay-band.ts:46-55` (`LyricBand`); `lyricBand` at `:94-104` takes `width`, `height` | holds |
| Crop, rows, frame | `omr/underlay-prepare.ts:167-194` (`prepareUnderlay`; the band crop at `:184`, `cutRows` at `:185`, `frameRow` at `:186`) | holds |
| `underExtender` declared and read, set nowhere | declared `omr/underlay-seat.ts:93`; read in `isContinuation` `:108-110`; `NotePlace` built without it at `underlay-prepare.ts:180` | holds. Repo grep for `underExtender` not repeated beyond these files |
| Ties and slur pairing | ties `underlay-prepare.ts:134`; `slurSpans` `:86-110` | holds |
| Token kinds | `kindOf` `underlay-seat.ts:147-153`; patterns `:142-145` | holds (amendment 21: `:147-153` is the function) |
| Long dash becomes an empty mark | `omr/underlay-tokens.ts:50-51` (`longDash ? '' : text`) | holds. `kindOf('')` is `'mark'` (`:149-152`: no letter, no hyphen, no underscore), and `sewWords` drops a mark (`omr/underlay-words.ts:105`). Amendment 3 is confirmed |
| Token page pixels | the brief's `underlay-tokens.ts:62-64` | **MOVED/wrong**: those lines are the proportional split of a run-together token. The token shape is `underlay-seat.ts:76-80`; page pixels come from `pageTokens`, `underlay-page.ts:156-163`. Amendment 21 confirmed |
| `seatPage` row choice | `omr/underlay-page.ts:207-213` | holds |
| `assertVowelPerNote` | called at `underlay-page.ts:240`; defined `omr/assert-vowel-per-note.ts:56-65` | holds |
| Slur gate | `underlay-page.ts:242-257`; the test at `:251` | holds. It sits after the `continue` at `:213`, so it runs only for a seated system (amendment 8 confirmed) |
| Sung notes to `vowelsPerNote` | `underlay-page.ts:266` (push), `:292` (call); `omr/vowels-per-note.ts:73-95` | holds |
| Unread system reports `'no Russian row'` | `underlay-page.ts:281-285`; the `why` expression is at `:284` | holds, and the `'no band'` case is separate (`hasBand` false) |
| `applyUnderlay` | `omr/underlay-song.ts:73-114` | **range differs**: the function is `:73-114`; `:69-71` is `barsWithNotes` (amendment 21 confirmed) |
| `markUnreadBars` call | `omr/homr-reader.ts:418`; defined `omr/unread-bars.ts:80` | holds |
| `comparePoem` word pairs | `text/poem-compare.ts:162-168`; `layOutLikePoem` `:232` | holds. The `align` header (the "earliest copy matches" note) is at `:118-125`, the function `:126-154`, not Fable's `:112-116`/`:117-153`: MOVED by about six lines |
| Library match returns a span and score, no letter map | `text/poem-match.ts:104-172` (`align`, returns `{ score, queryStart, queryEnd, poemStart, poemEnd }`) | holds in substance. It is on `Shane` now, not only on `cloud-lane-31`. The return carries query and poem spans, which is more than the census said ("a span and score"); there is still no letter-to-letter map |
| No writer of poem words into LYRICS | see section 4 below | **one writer found** |

Other lines I checked that the amendments rely on:

- `pipeline.ts:225-227` `isKnownWord` = `GraysonEngine.lookupStress(word) !== null`: holds. `pipeline.ts` is 925 lines.
- `engine.ts:843` `syllabify`: holds (`packages/phonology/src/engine.ts:843`).
- `score/pairings.ts`: `SlotOrigin` `:79-100`, `Slot` `:111-119`, `Pairing` `:122-130` (`kind: 'syllable'` has `cyrillic`, `ipa`, `vowel`, `origin`; no provenance field; amendment 11 confirmed), `buildSlotQueue` `:203` with the clitic fold at `:213-228` and the vowelless-piece fold at `:231`, `syllableTargetIds` `:297-306`. File is 1420 lines.
- `score/slur-seat.ts`: `slurContinuationIds` `:41-53`, `observedTargets` `:62-70`, `withObservedMelismas` `:73-77` (it never writes over a note that already carries a decision, `:75`).
- `score/vowel-resolver.ts:159` `CYRILLIC_VOWEL`; `:270-276` a note with no syllable sustains and has no cell (amendment 1 confirmed).
- `omr/underlay-units.ts:24` `VOWEL`; `omr/underlay-counts.ts:43-45` `freeNoteXs` reads `isContinuation`.
- Ratchets: `scripts/ratchets.json` holds `+page.svelte` at 5586 (line 8), `pairings.ts` at 1422 (line 17), `pipeline.ts` at 925 (line 23). `+page.svelte` is 5586 lines on this branch now, so the file is at its ceiling exactly. The review said 5585 on `Shane` and 5586 on `cloud-lane-31`; on `9088d26c` it is 5586.
- `omr/underlay-rows.ts:60` `INK_BELOW_PAPER = 60`; `:62` `LINE_SHARE = 0.02`; `:98` ink is `paperOf(band, staffSpace) - INK_BELOW_PAPER`; `:149` `lineMin = LINE_SHARE * band.width`. All hold.

## 3. The step 0 reading questions

**3.1 From a MusicXML lyric to LYRICS' text and the stored seats.**
- The one seam every MusicXML passes is `score/ingestion/ingest.ts`; `withUnreadBars` is at `:135-140` and turns the `ilya-words-unread-bars` field into a `words-partly-read` warning (`omr/unread-bars.ts:31`, `:63-71`). `scanNotice` (`ingest.ts:103-109`) and `noticeText` (`:122-126`) turn the warning into the banner key and text.
- The parser reads no `<extend>`: I did not re-run the grep of `packages/score-parser/src/musicxml-parser.ts` in this run. NOT ESTABLISHED by me; Fable's no-hit grep is amendment 1's evidence. I will run it at the start of step 1, where it matters.
- `score/pairings.ts` and `score/score-seat.ts` carry the seats; I read `pairings.ts` (above) and did **not** read `score-seat.ts` or `ingest.ts` beyond `:100-175`. NOT ESTABLISHED: the full path from a parsed `<lyric>` to `doc.inputText`. Step 1 item 4 (the extender seam) must read it before it writes; I will, and report it in the step 1 report.

**3.2 Where a kept reading is stored.**
- Type: `omr/stamp.ts:53-56`. Written with the source record: `library/driver.ts:50-66` (`SourceBytes.reading?: KeptReading`, "OPTIONAL AND ADDITIVE"), via `library/document.svelte.ts:410-411` (`keepReading`). The store is IndexedDB (`library/idb.ts`; I located the file, I did not read it).
- Read back: `omr/restore.ts:40-42` (`isCurrent`: stamp equal and `musicXml` non-empty) and `:44-62` (`restoreScan`: a current kept reading is used as is, `from: 'kept'`; otherwise the scan is read once and a new reading is returned to keep). `+page.svelte:3288` passes `source.reading ?? null`; `:3352` stores `reading: scan.reading` with the bytes; `:4031` is the `onreading` hook that keeps a fresh reading.
- Consequence for step 3: moving the stamp to `underlay@4` makes `isCurrent` false for every `underlay@3` record, so each is read again once on next opening (`restore.ts:52-53`). That is the line Dann gets in the step 3 report.

**3.3 The Loupe and how it opens on a note.**
- The component is `lib/score/Loupe.svelte`, with `LoupeHeader.svelte`, `LoupeSyllables.svelte`, `LoupePlacementRow.svelte`, `CorrectionSurface.svelte` beside it. Its pure arithmetic is `score/loupe.ts` (`parseSystemRange`, `nearestTarget`, `hitsFor`). It is mounted once, at `routes/+page.svelte:4571`, with `open={loupeOpen}` (`:996`), `measureIndex={heldMeasureIndex}` (`:1025`), `ownIds`, `selectedEventId`, `slots`, `pairings={shownPairings}`, `onpick={handleLoupePick}`.
- It is "a VIEW TRANSFORM over the page that is already on screen" that clones the held measure out of the rendered system (`score/loupe.ts:1-13`). It has no picture of the print today.
- NOT ESTABLISHED: the exact handler that sets `loupeOpen` and `heldMeasureIndex` from a note tap. I read the prop block and the mount, not the opening handler. Step 6 (not started) needs it.

**3.4 Where the partly-read banner is drawn, and its strings.**
- Drawn in the Drawer, in `+page.svelte` at `:4036-4043`: `{#if noLyricsFile}<p>{noticeText(noLyricsKey, language, noLyricsFile)}</p>{/if}`, "Unstyled on purpose for the first walk" (comment `:4037-4041`). `noLyricsKey` and `noLyricsFile` are set at `:2790` from `scanNotice(...)`.
- Strings: `lib/i18n.ts:1528` (`upload.banner.wordsPartlyRead`, with `{bars}`) and `:1529` (`upload.banner.wordsPartlyReadOne`, with `{bar}`). **Fable's `i18n.ts:1494-1495` has moved to `:1528-1529`.** The banner reads the merged bar ranges (`barsText`, `ingest.ts:112-119`), not `why`.
- It is a plain `<p>` of text today. A bar number as a link (step 6) is a new element in a file that is at its ceiling (amendment 18).

**3.5 `sewWords` beyond `omr/underlay-words.ts:80`, and what `sustained` does.**
- `sewWords` (`:92`) reads seats through `oneToANote` (`:61-71`, the second token on a note becomes unseated). A `mark` is dropped (`:105`). A `joint` glues (`:106-110`). An `extender` sets `open[open.length - 1].sustained = true` (`:111-114`) and does nothing else.
- `sustained` is declared `:33-34`, "An extender follows the syllable: the print sustains it. Not written to the lyric." `writeLyrics` (`:199`) writes `<syllabic>` and `<text>` only (`lyricFor`, `:174-178`). I read `:25-125` and `:165-215`; I did not read `:125-164`. So `sustained` is a runtime flag that dies at `writeLyrics`: amendment 1 confirmed.

**3.6 `omr/underlay-recognize.ts`.**
- `makeRecognizer` (`:60-76`) holds one tesseract.js worker for the session, sets `tessedit_pageseg_mode: '7'` (one line) and `preserve_interword_spaces: '1'` (`:65`), and returns `wordsOf` the recognition's blocks: `{ text, x0, y0, x1, y1 }` per word (`:55-57`). Model `rus_prereform_r2_29000`, core `tesseract-core-simd-lstm.wasm.js` (`:30-33`). It runs in the page's thread, not in the Worker (`:17-20`).
- Nothing in it filters by character, so an underscore line **can** appear as a word box if tesseract emits one. Whether tesseract emits it at PSM 7 is NOT ESTABLISHED (needs a run on a real row; step 1).

**3.7 Does `parts.prepare` keep the page image? (amendment 14)**
- No. `UnderlayParts.prepare` returns `{ layout, rows, ms }` (`omr/underlay-reader.ts:22`). The Worker decodes the Blob to a greyscale buffer, frames rows, and posts back only `layout`, `rows: Blob[]`, `ms` (`omr/underlay.worker.ts:44-58`); the page buffer is discarded when the handler returns. The caller (`makeUnderlayReader`, `underlay-reader.ts:73-77`) holds `image: Blob` for the call, and `underlay-client.ts:38-49` posts it to the Worker each time. So a second look in `makeUnderlayReader` has the original Blob and **must ask the Worker again** (a new `prepareSystem` message), unless step 2 changes the Worker to keep the decoded page. That choice is the desk's; I will ask the Worker again in step 2 unless told otherwise.
- The three stages in `makeUnderlayReader` are at `:77` (prepare), `:82` (recognize), `:87` (`seatPage`). The function ends at `:97`, not `:99`.

**3.8 Does a POEM edit run through the 600 ms pause? (Fable's "could not establish")**
- Not by itself. `handlePoemEdit` (`+page.svelte:2384-2391`) writes `doc.publishedPoem`, calls `poemOffer.onPoemEdit`, and then either hands the text to Lyrics (`lyricsTakesPoem`) or runs `nameIfUnnamed(); adoptPoemLines(...); if (quietTimer) joinText(how);`. The comment says "a Poem key keeps a pending pause waiting". `quietTimer` is set only in the Lyrics input path (`:2548`, `QUIET_MS`, 600 ms per the comment at `:2487`). So a POEM edit with no pending Lyrics pause starts **no** pause. For the join to re-run on a POEM edit it needs its own hook beside `poemOffer.onPoemEdit`, in a commit that moves at least as many lines out of `+page.svelte` (amendment 18).

**3.9 `HAS_VOWEL` against `VOWEL`.**
- `score/phrase-ends.ts:30` `HAS_VOWEL = /[аеёиоуыэюяѣіѵ]/i` and `omr/underlay-units.ts:24` `VOWEL = /[аеёиоуыэюяѣіѵ]/iu` and `score/vowel-resolver.ts:159` `CYRILLIC_VOWEL = /[аеёиоуыэюяѣіѵ]/iu`: **the letters are equal in all three** (only the `u` flag differs). `HAS_VOWEL` is used once, at `phrase-ends.ts:72`. No test holds `HAS_VOWEL` equal to the other two (`grep HAS_VOWEL` finds the definition and the one use only). Equal today, unguarded.

## 4. Grep: any writer of poem words into LYRICS or under a note

Repo-wide, `apps/web/src/lib` and `apps/web/src/routes`, non-test files. **One writer exists**, and the brief's "none found" does not hold repo-wide:

- `lyricsTakesPoem` (`text/witness-lines.ts:153-155`), called at `routes/+page.svelte:2389`: where the score is wordless (a scan with `noLyricsFile`), Lyrics is empty, and no note has a placement, a poem arriving whole is written into Lyrics (`handleInput(text, 'paste')`). It writes the **whole poem** into an **empty** Lyrics, not a word into a note. It does not touch a Lyrics that holds words. The join does not collide with it, but the join must know it exists.
- `poemOffer` `put` and `setLyrics` (`+page.svelte:2372`; `text/poem-offer.svelte.ts:49-54`): `put` writes the library's poem into POEM; `setLyrics` restores Lyrics to its pre-fill text on a decline. The header says the fill "only ever changes Lyrics' line breaks" (`poem-offer.svelte.ts:27-28`), through `lyricsInPoemLines` (`text/relining.ts:36`). I read `poem-offer.svelte.ts:1-60` only; `:60-244` NOT ESTABLISHED by me.
- No code writes a poem's syllable under a note. That claim is limited to the two files above plus a keyword grep; it is not an exhaustive proof.

## 5. Ceilings, and the sites section (CONTRACT §4)

- `pipeline.ts` 925 of 925; `+page.svelte` 5586 of 5586; `pairings.ts` 1420 of 1422. All confirmed above. Step 4 puts the join in new files. Any `+page.svelte` hook ships only with a commit that moves out at least as many lines (amendment 18).
- Amendment 16's seven added sites are confirmed to exist at their lines: `freeNoteXs` (`omr/underlay-counts.ts:43-45`), `observedTargets` (`slur-seat.ts:62-70`), the sustain at `vowel-resolver.ts:270-276`, `withUnreadBars` (`ingest.ts:135-140`), `VOWEL` (`underlay-units.ts:24`), `HAS_VOWEL` (`phrase-ends.ts:30`, section 3.9). I did not re-read `fixture-rule.test.ts:83-95` (`noSyllableCount`) or `underlay-reader.ts:67`; the second is the `tookNone` console line at `underlay-reader.ts:66-69`, which I did read.

## 6. Gates in this sandbox

`pnpm install --frozen-lockfile` ran clean in 8.5 s (Linux, pnpm 10.28.0). The baseline unit run for `apps/web` was started in the background; at the time of writing it had not finished, so **I report no baseline count in this step**. The step 1 report will give the counts I measured. The brief's baselines (phonology 407, dictionary 248, web-check 0 errors and 12 warnings, web unit 4198 passed and 1 skipped, score-parser 785 and 5, blurb 148, integration 125) are the desk's numbers; I have not reproduced them.

## 7. What the desk needs to run row 114

Nothing is built in this step. For steps 1 to 3, the desk will need, on the Mac in one sitting with one browser build (amendment 19): the 369 control first; then the extender arms (a) and (b) with the per-song counts of `extender`, `joint`, and long-dash tokens that the reader emitted; the band ink-share distributions (amendment 15). Step 1 will build the counters so the console line carries them. I will say in the step 1 report exactly which console line to read.

## 8. Departures, and what I could not establish

- **Departure from the brief's control wording:** the `cloud-lane-31` merge is already in `Shane` (section 1).
- **Departure from the brief's claim of no writer:** `lyricsTakesPoem` (section 4).
- **Citation repairs:** `applyUnderlay` is `:73-114`; the `underlay-tokens.ts:62-64` cite is wrong; `i18n.ts:1494-1495` is `:1528-1529`; the `poem-compare.ts` header is `:118-125`; `makeUnderlayReader` ends at `:97`.
- **NOT ESTABLISHED:** whether tesseract emits an underscore token at PSM 7; whether the parser reads `<extend>` (not re-grepped); the full MusicXML-lyric-to-LYRICS path through `score-seat.ts`; the handler that opens the Loupe on a note; `poem-offer.svelte.ts:60-244`; the baseline test counts on this sandbox; the 369 control (the desk's).
