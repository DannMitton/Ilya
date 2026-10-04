# Commission: an appraisal of the whole approach to reading a printed song

**Written by:** the desk (Fable), 2026-10-04 about 13:45, at Dann's instruction, for the desk of the next thread. **This is THE ONE THING** (`../memory/STATE.md`). Dann set the next thread aside for it and switched the model to Fable Extra for it. Read this file whole before anything else on the subject. Nothing in it is a ruling unless it quotes Dann.

**In one paragraph.** For four days the desk designed the scan reader from logic and from this project's own measurements, brief by brief. On 2026-10-04 Dann asked whether anyone had looked at how the world solves this. Nobody had, beyond one survey of the field to 2011 and two outside engines run as closed boxes. He has paused the brief-by-brief work on the reader and asked for an appraisal first: who has tried this, whether and how they succeeded, how our approach compares, how we are falling short, and what we should change, reframe, or use that we already hold. The appraisal is written for him, in the chat, from sources the desk has read. Nothing in the plan changes until he rules.

---

## 1. What Dann asked, in his words

Each is transcribed as written.

- **2026-10-03 09:27:** *"Are we closer to code that works?"*
- **2026-10-04 13:16:** *"Are you solving the problem on your own through logic, or have you researched best practices and code that works out in the real world for this analogue in terms of pattern recognition?"*
- **13:23:** *"IN terms of reconceptualizing our design and development efforts to meet our goal of a working OCR and OMR that fall within our 95% veracity/accuracy target, why don't you tell me how we are falling short, and what work out in the real world can help us achieve our objective? This might include adopting paradigms we have not considered, reframing the objectives themselves, asking better questions, noticing adjacent assets and qualitis that we can harbness productively, etc."*
- **13:23, the specific question:** *"has somebody else tried to do what we are trying to do? If so, have they met with success? If so. how? I f not., how does our appraoch compare to theirs and what can we learn from those disparities?"*
- **13:28, the bar for the words:** *"I think we need some high bar for the actual text extraction from a score? At the moment it is myuinderstandnig that we rely on a text poem as our second witness. This will always be so, it is not the problem. OUr problem is our dependency on the second witness for the production of our \*correct\* extraction. Errors happen. But it is my sens ehtat current errors are failures of the software to respond to the demands of extraction, not simple oversights."*
- **13:28, the job:** *"SO yes: notes correct, and text underlay for those notes correct. We are essentially replicating input page data but enhancing it with semantic relationshjips past the flattened, printed page."*
- **13:38, on Ilya's history and old rulings:** *"IN the beginning, Ilya was simply meant to be the Text apparatus... Then I axpanded it to include the actual music (pitches and durations) and their intersections with the prescriptive vowels from Grayson's system. Then I expanded further to meticulously-cited pedagogical interventions... Sometimes we see legacy edicts that cause friction with Ilya's evolutionary growth. This is expected and we resolvethese points of friction as we become aware of them."*
- **13:38, on the number:** *"Ideally the number I want is perfection.l You originally suggested 95% and since you suggested it I assume it is workable?"*
- **13:38, on this commission:** *"Equip the Claude instance in the new thread with everything it needs in order to give us productive help. Point it to research and documents and the code! Offer help. Maybe this easier and more enjoyable both for yourself and for me while maintaining the rigour that will help us arrive at something functional and stable and accurate within reason."*

## 2. The consensus reached on 2026-10-04

The desk gave its reading at 13:24 and Dann amended one point at 13:28. This is what stands.

1. **What "what we are trying to do" means.** In: a scan of a printed piano-vocal score, often a nineteenth-century Russian edition in the old spelling. Out: the vocal line only (pitch, length, rests, metre, tempo, dynamics), with the printed words read from the page and seated syllable by syllable under the notes, then transcribed by Ilya. Under constraints most readers do not carry: it runs in the browser, it is free and MIT-licensed, it never guesses silently, and the singer can correct it.
2. **The job, in Dann's terms:** a faithful copy of what the page prints on the voice staff, made richer than the page by its relationships (which syllable belongs to which note, which syllables make a word, which notes make a bar).
3. **The bar:** the notes correct, and the words under those notes correct, each from the page itself. The poem stays as a second witness that checks the reading. It must never be what makes the reading correct.
4. **The number.** Dann's ideal is perfection. The ruled measure of 2026-10-01 22:22 is 95 of every 100 notes right in pitch and length for each song, 9 of 10 syllables, and no confident non-word (`plan-scan-reader_r4_2026-10-01.md`, section 2). The desk's working figure for this appraisal is 95 for the notes and 95 for the words; that figure is the desk's and not his ruling. **Whether 95 is reachable by a cold, automatic read is NOT ESTABLISHED, and the desk told him so.** The record shows he ruled the measure in; it does not show what evidence the desk had for proposing it. Saying what is reachable, and by what route, is the appraisal's first duty.
5. **Old rulings are defaults.** `CONTRACT.md` tether 19 already says so; Dann said it again here about "legacy edicts". Plan r4's line "the note reader uses no trained model", the offline stance, and the licence are all open to the appraisal, each with its reason stated and the evidence beside it.

## 3. What the appraisal must hand Dann

In the chat, rendered, never as a file to open (`CONTRACT.md` tether 20). In this order:

1. **Has anybody done this, or its parts, and does it work?** Each system or paper with what it does, how, and how well, from a source the desk read.
2. **How our approach compares,** and what each difference costs or buys.
3. **How we are falling short,** in the approach and in the process, as well as in the numbers.
4. **What is reachable:** for the notes, for the words, by a cold read and with the singer confirming.
5. **The reframings worth considering, ranked, with a recommendation** and the cost of each path.
6. **What could not be established.**

Rules for it: every claim about the outside world carries its source and how it was read (in full, in part, snippet only); no claim from memory presented as fact; attribution throughout, because Dann cites his sources; volume is a cost, so the appraisal is as short as its content allows and is given in parts he can absorb, one question at a time.

## 4. Where the reader stands, by measurement

On the app's own path, by `tools/e16-harness/src/scan-scorer.ts`. Of every 100 printed notes, present with the right pitch and the right length:

| Song | 2026-10-02 09:43 | 15:35, shipped `29a0a10` | homr 0.7.0 |
|---|---|---|---|
| Tchaikovsky Op. 38 No. 3 | 13.2 | 73.0 | 93.1 |
| *Sunless* 1 | 36.5 | 64.6 | 81.3 |
| *Sunless* 4 | 37.1 | 69.8 | 97.4 |
| *Sunless* 5 | 11.6 | 46.1 | 86.8 (an upper bound) |
| *Sunless* 6 | 23.0 | 41.0 | 94.4 |
| *Sunless* 2, test only | 16.2 | 23.5 | 66.2 |
| *Sunless* 3, test only | 20.7 | 32.0 | 69.8 (an upper bound) |

- **Built and shipped, none walked by Dann:** staves traced on tilted scans, bars confirmed by the system, heads, lengths from shape (`../memory/QUEUE.md` rows 18 to 23).
- **Not read or misread today:** accidentals (the largest pitch loss; `brief-code-the-sign-beside-the-note_r1_2026-10-03.md`, section 1), rests (0 to 10 found where 13 to 48 are printed), the metre (9/8 read for 3/8), hollow heads, ties and slurs, tempo words and dynamics.
- **Words: nothing is read from a scan.** The app tells the singer to type them (`upload.banner.reader` in `apps/web/src/lib/i18n.ts`). Ilya ships tesseract.js for photographed text on the Text tab; plan r4 says its model lacks ѣ, і, ѳ, and ѵ.
- **Friday's trial did not pass** (`../memory/QUEUE.md` row 24; `report-code-fitted-shapes-and-the-round-trip_r1_2026-10-02.md`). What held: fitted forms place a head to 0.036 staff spaces on pages of known geometry, and a page's clear cases are a sound source for its own values. What did not: reading a note by drawing it alone, because the area around it holds other marks' ink.
- **A process fault the desk owns:** that trial was commissioned whole, for about three hours of Code, without a test on twenty notes by hand and without a look at how working readers do it.

## 5. What is on file to read

### The project's own memory and plan
- `../memory/README.md` and its read order; `../memory/CONTRACT.md` (tethers 14, 16, 17, 19, 21, 22 bear hardest on this work).
- `plan-scan-reader_r4_2026-10-01.md`: the plan, its principles, its phases, its standing pivots, and the checkpoint of Friday 2026-10-09, where the numbers go to Dann with three options.
- `../memory/OPEN.md`, "N.178 AND THE SCAN READER": Dann's rulings and design directions, items 1 to 20.
- `../memory/OWED.md`: "A design to measure next" (his directions of 2026-10-02, the voice zones among them), "After row 24", "Phase 1 of plan r4".

### Research already on file
- `precis-rebelo-2012_r1_2026-10-01.md` and its claims table: the one survey read, the classical tradition to 2011. Its own text says it predates the learned readers.
- `memo-sonnet-working-music-readers_r1_2026-10-04.md`: **new today, a Sonnet agent's sweep of the systems people have built, about 5,300 words with 33 sources. No desk has read it in full.** Its claims are leads until the desk opens the sources that matter. Its summary is in section 6.
- `memo-desk-yardstick-homr-on-seven-songs_r1_2026-10-02.md` and `report-code-the-yardstick_r1_2026-10-02.md`: homr and oemer run on our songs.
- `memo-fable-independent-critique-of-plan-r2_r1_2026-10-01.md`: an outside reviewer's forecast, which called the full measure across six editions "not believable" for 2026-10-30.
- `memo-fable-reader-audit-against-the-guide-model_r1_2026-10-01.md` and `memo-fable-code-reading_r1_2026-10-01.md`: the reader and the app read firsthand.
- `draft-gould-expectations-for-the-scan-reader_r1_2026-10-02.md` and `memo-gould-dimensional-priors_r1_2026-08-24.md`: Gould turned toward reading.
- **In project knowledge, not read by this desk:** the July landscape scan, `claude/e16-phase0-options-memo_2026-07-22.md` and `claude/sonnet-memo-e16-notehead-localization-survey_2026-07-23.md`. Read them before commissioning anything, so nothing is researched twice. For the old spelling: `claude/e33-the-string-that-feeds-the-ipa_2026-08-08.md` and the census beside it.

### Research not yet done
- **The literature and the data since 2012.** A brief for a Sonnet agent is written and ready: `brief-sonnet-sweep-omr-research-since-2012_r1_2026-10-04.md`. Its run was started at 13:30 and stopped by Dann at 13:38 when he chose the new thread, so it produced no memo.
- **Reading old Russian print, and songs that already exist in digital form.** No brief is written. It should cover: models and results for pre-1918 Cyrillic (Tesseract's own files, Transkribus, Kraken, commercial engines); lyrics set small, hyphenated, under a staff; and corpora of encoded art song a tool could match against.

### The reports and the code
- Code's reports for rows 22, 23, and 24, and the cloud lane's for row 8, all in this folder.
- **The reader:** `tools/e16-harness/reader/` (`reader.py`, `run_page2.py`, `shape.py`, `fitted.py`, `beams.py`, `timesig.py`, `metre.py`, `rest_templates.py`, `clefkey.py`). It is hand-written image processing with no trained model.
- **The harness and the scorer:** `tools/e16-harness/src/scan-scorer.ts`, `scan-baseline.ts`.
- **The app's side of the seam:** `apps/web/src/lib/reader/` (`recognized.ts`, `page-pdf.ts`), `apps/web/src/lib/score/ingestion/recognized-to-musicxml.ts`.
- **The words:** `apps/web/src/lib/pipeline.ts`, `packages/dictionary/src/pre-reform-normalizer.ts`, `packages/phonology/src/engine.ts`, `apps/web/src/lib/score/vowel-resolver.ts`.

### The assets
- **Sixteen of Dann's own Finale engravings** in `~/Documents/Finale Files`: the six *Sunless* songs and Kabalevsky's ten Shakespeare sonnets. Truth files made from them are in `tools/e16-harness/output/truth/`, git-ignored, on the Mac only.
- **Render pages with their own geometry:** `tools/e16-harness/output/<song>/repaired/pageN_300dpi.png`, each with a Verovio SVG that tags every notehead, stem, flag, and dot.
- **The scans:** `~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf` and `~/Downloads/IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf`. The Tchaikovsky truth draft is `truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json`.
- **Folders the next thread needs:** the repository, `~/Downloads`, `~/Documents/Voice Pedagogy Library`, `~/Documents/Finale Files`.

## 6. Leads the closing desk holds. Verify each; none is a finding

**From the systems sweep's own summary and its sections 4 to 6, read by the desk; its body is unread:**
- It found no system whose stated purpose is the vocal line with its words from a piano-vocal score, and none aimed at Russian or Cyrillic song.
- The two art-song benchmarks it found remove or mask the vocal staff. Lyrics are read by closed products (vendor claims only) and by Audiveris through Tesseract.
- The best open readers are trained, crop and normalize a staff or system before reading it, and read text with a separate engine.
- The one browser-capable reader it could document is a third-party port of homr: 134 to 189 MB of models, AGPL-3.0.
- It found no note-level accuracy on real nineteenth-century scans for any system, and no test of Russian lyrics or the old spelling anywhere.

**Candidates the closing desk thought of. Test or discard each; do not adopt one because it is listed here:**
- **A small trained classifier for the symbols,** trained on pages we can label for free (the renders and their SVG), with the hand-built geometry kept for staves and bars.
- **The singer confirms.** If no cold read reaches the bar, "perfection" may be a read plus a fast, well-aimed correction. Phase 1 of plan r4 is the design of that, and drawing 1 exists (`drawing-phase1-unsure-note_r1_2026-10-02.png`).
- **Match, do not read.** Where a song already exists in a clean digital encoding, the task may become finding and checking it.
- **The language as a witness for the words:** Ilya's dictionary, its phonology, and the poem's metre and rhyme (plan r4, principle 10).
- **The constraints as choices.** The browser, the offline stance, and the licence each have a reason. The appraisal may show what each costs.
- **Voice zones** (Dann, 2026-10-02 17:03): read the whole page for structure, then read only the voice staff finely, with the piano as a landmark.

## 7. A suggested first hour. The next desk may order it otherwise

1. Read this file, then the July landscape scan in project knowledge.
2. Read the systems sweep in full and open its most load-bearing sources yourself: homr's and Audiveris's own documentation of method, the Zeus and Legato papers' results tables.
3. Run the literature sweep from its brief, and write and run the third (old Russian print; existing encodings). Two agents at once at most, cost stated first.
4. Read the one or two surveys the sweep ranks highest, yourself.
5. Give Dann part 1 of the appraisal (has anybody done this, and does it work?) and stop for his response before the next part.

## 8. What waits, so the appraisal does not lose it

- **Held for the appraisal:** `QUEUE.md` row 26, the pitch brief for Code. Row 25, the old-spelling brief for the cloud lane, does not depend on the appraisal and can run when Dann says.
- **With Dann, unanswered:** the mark for an unsure note, A, B, or C (drawing 1); three questions of taste from row 8 (`../memory/OWED.md`, "After row 24"); his walk of rows 18 to 24 and row 8, none of which is DONE.
- **Found and not fixed:** the loupe opens 2,135 px tall and empty on the Tchaikovsky score file in the desk's headless run, while the *Sunless* 1 fixture opens properly (`../memory/OWED.md`, "Phase 1 of plan r4").
- **The checkpoint:** Friday 2026-10-09 (plan r4, section 5). The appraisal is what Dann will rule from on that day, or sooner.
