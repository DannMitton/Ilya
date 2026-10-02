# Memo: an independent critique of the scan-reader plan, r2 (Fable subagent, 2026-10-01)

**Provenance.** Dann, 2026-10-01 22:06: *"have a Fable subagent who does not share your exposure read it and critique it for us. We need to ensure that this plan is an excellent approach before we embark on it."* The desk (Fable) spawned a Fable subagent at about 22:25 with the plan (`plan-scan-reader_r2_2026-10-01.md`), the evidence memos, the reader's code, and the Tchaikovsky page images, and with none of the conversation that produced the plan. Returned at about 22:33. Saved here verbatim. **Its claims are its own; the desk has not re-run its measurements.** Cost: 288,423 tokens, 39 tool uses, 7.8 minutes.

---

## 1. Verdict

Embark with changes, not as written. The staff tracing and the piano-barline vote rest on evidence I reproduced, so the geometry is worth building. The melody and words gates are not reachable by the plan's methods by 2026-10-30, and the plan's centrepiece (show the unsure spot, one tap fixes it) has no carrier in the code and no size. If it were mine (JUDGEMENT): keep the in-browser reader for staves, bars and pitch, make the known poem the main road for words, promise a checked first draft, and measure an outside engine in week 1 as a candidate.

## 2. The five most serious problems

**1. The melody gate is far from the measured start, and the hardest part is hidden in Phase 4.**
- **Evidence:** my rerun on page 1, straightened, found 18 of 27 barlines and 41 heads for 40 printed notes, about 34 right in pitch. The audit reports 22 of 41 lengths abstaining (not re-run). Length comes from ink area (`run_page2.py:340-352`), and nearly every voice note here is a separately flagged eighth (page images). Audiveris, a mature engine, got 55 of 58 pitch letters on one page, with rhythm warnings in 2 of 9 bars (`memo-n96:136,140`).
- **Cost:** the date slips, or the reader is tuned to six songs.
- **Instead:** restate the promise as a first draft now, and give "note lengths from shape" its own phase and gate.

**2. The words cannot reach 9 of 10 by the plan's method.**
- **Evidence:** I unpacked the OCR model the app ships: 125 symbols, with no ѣ, і, ѳ or ѵ. My run of it on all 11 lyric lines read about 130 of 172 syllables (76%, hand-counted on 200 dpi crops). All 16 syllables with ѣ or і were wrong, so the pre-reform normalizer never sees an old letter. The page prints words with no spaces or hyphens («какъзвонъот-да-лен-ной», page 2), so neither hyphens nor a dictionary can split them. Tchaikovsky also repeats «грустно» against the poem (page 3).
- **Cost:** wrong words under right notes, which is the N.163 risk.
- **Instead:** make poem alignment the main path, split syllables by notehead position, and test `orus` (named in the plan's own research memo, absent from the plan).

**3. "Unsure" has nowhere to live and no honest measure.**
- **Evidence:** the converter says substitutions are "counted, never marked" and cites E.47 striking the uncertainty mark (`recognized-to-musicxml.ts:20-30`). The plan keeps `VocalLineEvent` unchanged. Event ids carry only bar and x (`run_page2.py:454`). The Phase 3 gate demands every error flagged, with no limit on false flags, before Phases 4 and 5 exist to make errors. Confident wrong answers are on record (`README.md:113`).
- **Cost:** step 4 of the experience is unbuilt, and sits in week 6.
- **Instead:** define the side channel (state, page, box) in Phase 0, gate on flags caught and flags per page, and list E.47 in section 8.

**4. The test set is also the tuning set, and results move with the raster.**
- **Evidence:** page 1 gives 9 staves on the desk's raster, 4 in the app (brief Part 3), and 2 on mine. At 200 dpi the prototype picked a piano staff as the voice on three systems of page 2 (my run). The reader holds 41 named constants and 12 "re-derive when the corpus changes" notes (my count).
- **Cost:** it passes six songs and fails the singer's seventh on launch day.
- **Instead:** hold out songs the builders never see, resize every page to one staff size, and make the app-path test harness a named Phase 0 deliverable.

**5. The model omits things these pages print, and "the page teaches its glyphs" is circular.**
- **Evidence:** there are ties across barlines (page 2 bottom, page 3 last system) and hairpins over the voice (all three pages). The reader has no tie, slur or tuplet code (grep). `_rest_template` needs seed positions handed to it (`reader.py:1327-1337`). A song prints one "3" and one "8". Common time has no reader (grep of `timesig.py`).
- **Cost:** a tie shifts every later syllable, and an unread triplet makes bar arithmetic "deduce" a wrong length with authority.
- **Instead:** add ties and slurs to Phase 4, bar arithmetic only in bars with no abstentions, and a small multi-edition exemplar set.

## 3. Smaller problems

- "Nothing to configure" ignores that the real IMSLP file is 27 pages and six songs; the desk cut it with `qpdf` (brief Part 3).
- Phase 5 needs the notes, not "only the geometry".
- "No build phase starts until the gate before it" contradicts phases running side by side.
- Gates that say "every" fail on one miss, then trigger the two-strikes rule.
- Straightening halts pages 2 and 3 at the sentinel (reproduced), and the metre turned 9/8 (audit, not re-run). The plan still makes it principle 1.
- The straightening step builds about four full-page arrays, near 290 MB at 400 dpi (`proto:67-70`, my arithmetic). Tablet behaviour is NOT ESTABLISHED.
- Pyodide loads from a CDN (`page-reader.worker.ts:92`).
- Phase 1 draws the fix before anyone knows whether there are 3 or 40 unsure spots.
- The plan does not say which spelling the singer gets back.
- **Contingencies:**
  - Phase 2's (mark the first system) does not recover bars.
  - Phase 3's accepts silent errors.
  - Phase 4's works only as a top-up, not from half the lengths missing.
  - Phase 5's is real, and should be the plan.
  - Phase 6's is real and cheap.
  - Phase 7 has none.
  - No answer exists for confident errors, for the seventh song, or for Dann's own hours.

## 4. What the plan gets right

- Tracing staves: I reproduced 9, 12 and 12 staves, the right voice staff on all 11 systems, and 59 px of drift on page 2.
- Using the piano's long barlines to confirm the voice's.
- Truth before building, measured on the app's own path.
- Saying plainly that phase sizes and reachability are not established.

## 5. What I would change

1. Rewrite section 2 as a first-draft promise, with a floor per song, not a pooled average.
2. Phase 0: three truth songs, three held out, the app-path harness, and Audiveris plus one permissively licensed engine scored on the same pages.
3. Define the page model's fields, coordinates and the route past MusicXML before Phase 2.
4. Make words poem-first, with OCR to match and to place.
5. Split Phase 4 into rests and bars, then lengths, ties and slurs.
6. Cut dynamics to tempo words for release.
7. Add gates for wait time, memory, and multi-song PDFs.
8. Add a rule: no new constant without a held-out check.
9. Record whether Dann re-ruled the no-ML line (brief Part 5 left it open).

## 6. What can be true by 2026-10-30

- **Likely:** every staff, system and voice staff on clean 400 dpi scans; most barlines; pitch near 85 to 90 of 100; tempo words; words seated from a pasted poem.
- **Possible, low confidence:** lengths good enough that flags feel like help.
- **Not believable (high confidence):** 95 of 100 in pitch and length across six editions, 9 of 10 syllables from OCR alone, every dynamic, degraded copies, and the full bilingual experience plus the Guide.

`SCHEDULE.md:27` assumes four evenings a week, and `:166-169` says the buffer is spent.

## 7. What I checked, and what I could not establish

- **Held:**
  - Audit E1, E2, E3, E5 and E6 at the cited lines.
  - Rests limited to three kinds (`run_page2.py:108`).
  - Leipzig templates (`rest_templates.py:4-6`).
  - The 18 of 27 bars, the 41 heads, and the sentinel halts.
  - 19 printed rests on page 1 (image count).
  - Raw OCR near 32 of 40 on page 1 (I got 31).
- **Qualified:** the "page-learned glyph matcher" needs seeds.
- **My instrument:** 200 dpi crops stitched and doubled, OpenCV 5.0.0, Tesseract 5.3.4. This is not the app's path.
- **NOT ESTABLISHED:**
  - Duration, rest and metre figures (the font caches are not in the upload).
  - Anything in `ScoreUploader`, the normalizer or the tempo vocabulary (not in the upload).
  - What E.47 says in full.
  - `orus` accuracy on music type.
  - Any outside engine on this song.
  - OCR speed in the browser.
  - The AGPL position: an unmodified engine behind a server is my JUDGEMENT, not advice.
