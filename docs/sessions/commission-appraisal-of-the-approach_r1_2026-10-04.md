# Commission: an appraisal of the whole approach to reading a printed song

**Written by:** the desk (Fable), 2026-10-04 about 13:45, at Dann's instruction, for the desk of the next thread. **Rewritten at about 14:00 the same day, after the closing desk read the July record; sections 3, 4, 6, 7, and 8 changed. The first version is in the tree at `f79c216`.** **This is THE ONE THING** (`../memory/STATE.md`). Dann set the next thread aside for it and switched the model to Fable Extra for it. Read this file whole before anything else on the subject. Nothing in it is a ruling unless it quotes Dann.

**In one paragraph.** For four days the October desk designed the scan reader from logic and from this project's own measurements, brief by brief. On 2026-10-04 Dann asked whether anyone had looked at how the world solves this. The desk told him nobody had, beyond one survey of the field to 2011. **That was wrong.** The project researched the question in July 2026, Dann ruled on it, and the record sits in project knowledge. The October desk had not read it. Read on 2026-10-04, it shows that the hand-built reader rests on a July measurement that October's measurement contradicts (section 4). Dann has paused the brief-by-brief work on the reader and asked for an appraisal first: who has tried this or its parts, whether and how they succeeded, how our approach compares, how we are falling short, and what we should change, reframe, or use that we already hold. The appraisal is written for him, in the chat, from sources the desk has read. Nothing in the plan changes until he rules.

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
- **13:48, on reading:** *"You miss necessary destails when you don't read. Read!"* and *"Assume the information exists to be helpful and is just waiting for you to read it to release its benefit."* (`../memory/CONTRACT.md`, posture 7.)
- **13:50, the frame for the appraisal:** *"Fine: "no system built to do what Ilya attempts" but what about systems that individually handle the pieces that Ilya unites? Can we learb from systems with a narrower scope to help our gr4eater scope?"*

## 2. The consensus reached on 2026-10-04

The desk gave its reading at 13:24 and Dann amended one point at 13:28. This is what stands.

1. **What "what we are trying to do" means.** In: a scan of a printed piano-vocal score, often a nineteenth-century Russian edition in the old spelling. Out: the vocal line only (pitch, length, rests, metre, tempo, dynamics), with the printed words read from the page and seated syllable by syllable under the notes, then transcribed by Ilya. Under constraints most readers do not carry: it runs in the browser, it is free and MIT-licensed, it never guesses silently, and the singer can correct it.
2. **The job, in Dann's terms:** a faithful copy of what the page prints on the voice staff, made richer than the page by its relationships (which syllable belongs to which note, which syllables make a word, which notes make a bar).
3. **The bar:** the notes correct, and the words under those notes correct, each from the page itself. The poem stays as a second witness that checks the reading. It must never be what makes the reading correct.
4. **The number.** Dann's ideal is perfection. The ruled measure of 2026-10-01 22:22 is 95 of every 100 notes right in pitch and length for each song, 9 of 10 syllables, and no confident non-word (`plan-scan-reader_r4_2026-10-01.md`, section 2). The desk's working figure for this appraisal is 95 for the notes and 95 for the words; that figure is the desk's and not his ruling. **Whether 95 is reachable by a cold, automatic read is NOT ESTABLISHED, and the desk told him so.** The record shows he ruled the measure in; it does not show what evidence the desk had for proposing it. Saying what is reachable, and by what route, is the appraisal's first duty.
5. **Old rulings are defaults.** `CONTRACT.md` tether 19 already says so; Dann said it again here about "legacy edicts". Plan r4's line "the note reader uses no trained model", the offline stance, the licence, and July's rulings (section 4) are all open to the appraisal, each with its reason stated and the evidence beside it.

## 3. What the appraisal must hand Dann

In the chat, rendered, never as a file to open (`CONTRACT.md` tether 20). In this order:

1. **Has anybody done this, or its parts, and does it work?** Each system or paper with what it does, how, and how well, from a source the desk read.
2. **How our approach compares,** and what each difference costs or buys.
3. **How we are falling short,** in the approach and in the process, as well as in the numbers.
4. **What is reachable:** for the notes, for the words, by a cold read and with the singer confirming.
5. **The reframings worth considering, ranked, with a recommendation** and the cost of each path.
6. **What could not be established.**

Rules for it: every claim about the outside world carries its source and how it was read (in full, in part, snippet only); no claim from memory presented as fact; attribution throughout, because Dann cites his sources; volume is a cost, so the appraisal is as short as its content allows and is given in parts he can absorb, one question at a time.

**Organize part 1 by piece. That is Dann's frame of 13:50.** No system was found that does the whole job. Systems exist for each piece of it. What the closing desk holds for each piece, and how it was read:

| The piece | Who does it | How the closing desk knows |
|---|---|---|
| 1. Find the staves and systems; straighten one staff | homr (a trained segmenter marks staff lines, heads, and stems; each staff is then straightened and read alone); oemer; muskew, MIT, for straightening | homr's README, read in full. muskew: July landscape scan, which its own commissioner flags as unverified |
| 2. Pick the voice staff | None found. July's charter makes it ours: the staff with words under it | The charter, read in full |
| 3. Read the notes of one staff | homr's transformer (built on Polyphonic-TrOMR, Apache-2.0); SMT (MIT); the Zeus solo-staff models; work on single-line reading (Camera-PrIMuS 2018; a 2023 paper on camera scenes) | The October systems sweep, read in full, its sources mostly unopened. July landscape scan, unverified |
| 4. Read printed words in a score | Audiveris, through Tesseract; closed products (Opuscan names Cyrillic lyrics) | The October systems sweep |
| 5. Read old Russian print | Tesseract's stock models: the desk's test, section 5. Transkribus, Kraken, and others: not looked at | The desk's own test. **The sweep for this piece is unwritten** |
| 6. Seat each syllable under its note | AMNLT (2024), on chant only; Audiveris; July's own design, by position on the page (D2) | July landscape scan, unverified. July decisions log, read in full |
| 7. Say what is unsure and ask the singer | Soundslice (confidence, then asks the user); plan r4 phase 1 is ours | The October systems sweep |
| 8. Check a reading by the music's own rules | July found no paper that enforces bar sums. Transcoda (2026) constrains its output by a grammar. The reader's validators are ours | July landscape scan, unverified |

## 4. What July decided, and what October's measurement does to it

**Read in full by the closing desk on 2026-10-04, all in project knowledge:** `claude/e16-phase0-options-memo_2026-07-22.md`, `claude/e16-decisions-log_2026-07-22.md`, `claude/sonnet-memo-e16-notehead-localization-survey_2026-07-23.md`, `claude/sonnet-memo-e16-modern-omr-landscape-scan_2026-07-23.md`, `claude/sonnet-memo-e16-base-licence-and-adoption-cost_2026-07-23.md`, `claude/sonnet-memo-e16-note-engine-bakeoff-v2_2026-07-23.md`, and `claude/fable-ruling-e16-pitch-reader_2026-07-23.md` (the charter).

**Read in part (a search excerpt only):** `claude/sonnet-memo-e16-homr-octave-corrected-score_2026-07-23.md`.

**Named by those and NOT read by the closing desk. Read them before relying on this section:** `claude/fable-ruling-e16-glyph-reading_2026-07-23.md`; `claude/e16-build-vs-adopt-decision-brief_2026-07-23.md`; `claude/sonnet-memo-e16-oemer-architecture-teardown_2026-07-23.md`; `claude/e16-pitch-reader-design-draft_2026-07-23.md`; `claude/e16-fable-orientation-and-brief_2026-07-23.md`; the two PrIMuS scoring memos the charter cites (search project knowledge for their paths); the newest `claude/e16-handover_v*`; and everything in the E.16 series after 2026-07-23, including whether the clean-page spike reached its 0.95.

### The record, in order

1. **July asked Dann's question and answered part of it.** The options memo found no permissively licensed reader that gives lyrics; Audiveris (AGPL) does, through Tesseract. Dann ruled a split pipeline (D1): a note engine, plus a layer of Ilya's own that finds where each syllable begins on the page (D2). **It read no words, on purpose:** the decisions log says the layer "does NOT read or segment the syllable text", because the singer's typed text was the source of the words. Ratified 2026-07-23: adopt and layer, "do NOT build perception from scratch".
2. **A gate then measured the engines on rendered pages:** Dann's six *Sunless* engravings through Verovio at 300 dpi, 22 pages. The bake-off memo gives homr 0.6.2 a pitch F1 of 0.150 (macro) and a rhythm F1 of 0.761, with 1,260 notes recognized against 921 printed. On three of the six songs the mean pitch shift is close to twelve semitones (+14.42, -12.08, +11.48). Four of the six truth files carry a treble clef that sounds an octave down. The adapter took homr's staff 1 as the voice. oemer did not run in that bake-off (a 45-second limit in that sandbox). The decisions log calls the pitch figure "almost certainly an ARTIFACT (JUDGEMENT, Opus)", the sign of "a clef/octave mismatch".
3. **A second memo tested that judgement and did not confirm it.** With twelve semitones taken off the four octave-clef songs, homr's pitch F1 rose only to about 0.20 (micro) and 0.23 (macro): one song was made worse by the correction, and another was an octave out with no clef to explain it. (Read in part.)
4. **On those figures the charter reopened "do not build".** Its stated premise: "no engine reads pitch on this corpus". It authorized a hand-built deterministic reader on the voice staff only, under six tripwires. T3: "Any proposal to train or fine-tune any model, of any size. Automatic stop." Its scope puts "all text of any kind" out. It made homr "benchmark, not base" and "a possible fallback tier if the classical path fails its numbers".
5. **The charter also said what scans would decide.** It called the clean-page test "necessary and NOT sufficient", said photographs are "exactly where classical methods break", and said the scan number decides "whether the photo tier needs a small permissive learned segmenter in front of the classical spine", which it names "a legitimate pre-authorized outcome". Adopting a pre-trained permissive model for one named stage is permitted "only when a harness number shows the classical stage cannot carry the target tier".
6. **October measured the scans** (section 5): the hand-built reader gets 41 to 73 of 100 notes right on the build songs; homr 0.7.0 gets 81 to 97 on the same songs.

### What follows from it. The closing desk's reading, and not a ruling

- **The premise is contradicted, and why is NOT ESTABLISHED.** July: homr reads pitch at 0.15 to 0.23 on renders of *Sunless*. October: homr gets about nine notes in ten right in pitch and length on scans of *Sunless*. Three things differ and any could be the cause: the homr version (0.6.2, then 0.7.0); the input (Verovio renders of Dann's engravings, then real scans of a printed edition, whose clefs may differ from his engravings'); the adapter and scorer (July's `tools/e16-harness/src/adapters/homr-adapter.ts` and `scorer.ts`, then October's `scan-scorer.ts`). **Establishing which is cheap and comes before anything else:** run homr 0.7.0 on the July render pages under October's scorer. If July's figure belonged to the harness or to the renders and not to homr, the reason the reader was built by hand is gone.
- **By the charter's own words, October's number is the one that decides the scan tier,** and the charter's answer for a classical stage that cannot carry it is a learned stage in front, or homr as the fallback. Plan r4's "no trained model" matches T3, which forbids this project to train. The charter did not forbid adopting.
- **The words are a legacy edict of the kind Dann named at 13:38.** July ruled that the page's words are not read (D1, D2, and the charter's scope). His bar of 13:28 requires them read from the page. So nothing built since July reads a word from a scan, and that is by design and not by neglect.
- **The licence was thought through in July.** Dann's principle, from the decisions log: adopt where the licence is compatible, build clean-room where it is not, and trained weights can only be replaced, retrained, or accepted as a risk. The licence memo: homr is AGPL-3.0; Polyphonic-TrOMR is Apache-2.0 with weights of undocumented origin; SMT's code and its `smt-grandstaff` weights are MIT on MIT data (81.6 MB, no browser path found, notes only); one of oemer's two models was trained on non-commercial data. An earlier July ruling put homr "behind an AGPL boundary"; read the decisions log for its terms.
- **Two sources disagree and need checking:** July's scan gives the Zeus weights as CC BY-SA; October's sweep gives its solo-staff models as CC BY-NC-SA.

## 5. Where the reader stands, by measurement

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
- **Words: nothing is read from a scan** (section 4 says why). The app tells the singer to type them (`upload.banner.reader` in `apps/web/src/lib/i18n.ts`). Ilya ships tesseract.js for photographed text and starts it with the modern Russian model (`apps/web/src/lib/components/ScoreUploader.svelte:442-443`, `createWorker('rus')`).
- **The desk's test of the words, 2026-10-04.** Tesseract 5.3.4 with the `tessdata_best` models `rus`, `ukr`, and `script/Cyrillic`, one line at a time (`--psm 7`), on three lyric lines cut from page 1 of the Jurgenson Tchaikovsky at 400 dpi. The best of the three, `script/Cyrillic`, read about 36 of 41 syllables as printed. It reads і. It misread ѣ every time. No model exists under the names `chu` or `rus_old`. Three lines of one page is a probe and not a measurement. The crops and outputs stayed in the closing desk's workspace and are not in the repository; the test takes ten minutes to repeat.
- **Friday's trial did not pass** (`../memory/QUEUE.md` row 24; `report-code-fitted-shapes-and-the-round-trip_r1_2026-10-02.md`). What held: fitted forms place a head to 0.036 staff spaces on pages of known geometry, and a page's clear cases are a sound source for its own values. What did not: reading a note by drawing it alone, because the area around it holds other marks' ink.
- **Process faults the closing desk owns.** That trial was commissioned whole, for about three hours of Code, without a test on twenty notes by hand and without a look at how working readers do it. The desk told Dann the project held one survey of the field, without searching project knowledge. It filed a research memo before reading it. Each cost Dann a correction (`../memory/CONTRACT.md`, posture 7).

## 6. What is on file to read

### The project's own memory and plan
- `../memory/README.md` and its read order; `../memory/CONTRACT.md` (posture 7 and tethers 14, 16, 17, 19, 21, 22 bear hardest on this work).
- `plan-scan-reader_r4_2026-10-01.md`: the plan, its principles, its phases, its standing pivots, and the checkpoint of Friday 2026-10-09, where the numbers go to Dann with three options.
- `../memory/OPEN.md`, "N.178 AND THE SCAN READER": Dann's rulings and design directions, items 1 to 21.
- `../memory/OWED.md`: "A design to measure next" (his directions of 2026-10-02, the voice zones among them), "After row 24", "Phase 1 of plan r4".

### Research already on file
- **July's record, in project knowledge:** section 4 lists what is read and what is not.
- `memo-sonnet-working-music-readers_r1_2026-10-04.md`: a Sonnet agent's sweep of the systems people have built, about 5,300 words with 33 sources. **The closing desk read it in full. Of its sources the desk opened one, homr's README.** The rest of its claims are leads until the next desk opens the sources that matter.
- `precis-rebelo-2012_r1_2026-10-01.md` and its claims table: the classical tradition to 2011. Its own text says it predates the learned readers.
- `memo-desk-yardstick-homr-on-seven-songs_r1_2026-10-02.md` and `report-code-the-yardstick_r1_2026-10-02.md`: homr and oemer run on our songs in October.
- `memo-fable-independent-critique-of-plan-r2_r1_2026-10-01.md`: an outside reviewer's forecast, which called the full measure across six editions "not believable" for 2026-10-30.
- `memo-fable-reader-audit-against-the-guide-model_r1_2026-10-01.md` and `memo-fable-code-reading_r1_2026-10-01.md`: the reader and the app read firsthand.
- `draft-gould-expectations-for-the-scan-reader_r1_2026-10-02.md` and `memo-gould-dimensional-priors_r1_2026-08-24.md`: Gould turned toward reading.
- For the old spelling, in project knowledge and not read by the closing desk: `claude/e33-the-string-that-feeds-the-ipa_2026-08-08.md` and the census beside it.

### Research not yet done
- **The literature and the data since 2012.** A brief for a Sonnet agent is written and ready: `brief-sonnet-sweep-omr-research-since-2012_r1_2026-10-04.md`. It was started at 13:30 and stopped by Dann at 13:38 when he chose the new thread, so it produced no memo. Amended at 14:00 so the agent knows what July's landscape scan named and verifies it.
- **Reading old Russian print, and songs that already exist in digital form.** No brief is written. It should cover: models and results for pre-1918 Cyrillic (Tesseract's own files, Transkribus, Kraken, commercial engines); lyrics set small, hyphenated, under a staff; and corpora of encoded art song a tool could match against.
- **Whoever commissions a sweep reads its memo whole before reporting on it or filing it.**

### The reports and the code
- Code's reports for rows 22, 23, and 24, and the cloud lane's for row 8, all in this folder.
- **The reader:** `tools/e16-harness/reader/` (`reader.py`, `run_page2.py`, `shape.py`, `fitted.py`, `beams.py`, `timesig.py`, `metre.py`, `rest_templates.py`, `clefkey.py`). It is hand-written image processing with no trained model.
- **The harness and the scorers:** `tools/e16-harness/src/scan-scorer.ts`, `scan-baseline.ts` (October); `tools/e16-harness/src/adapters/` and `scorer.ts` (July's homr adapter and scorecard, as the bake-off memo names them; the closing desk did not open them).
- **The app's side of the seam:** `apps/web/src/lib/reader/` (`recognized.ts`, `page-pdf.ts`), `apps/web/src/lib/score/ingestion/recognized-to-musicxml.ts`.
- **The words:** `apps/web/src/lib/pipeline.ts`, `packages/dictionary/src/pre-reform-normalizer.ts`, `packages/phonology/src/engine.ts`, `apps/web/src/lib/score/vowel-resolver.ts`.

### The assets
- **Sixteen of Dann's own Finale engravings** in `~/Documents/Finale Files`: the six *Sunless* songs and Kabalevsky's ten Shakespeare sonnets. Truth files made from them are in `tools/e16-harness/output/truth/`, git-ignored, on the Mac only.
- **Render pages with their own geometry:** `tools/e16-harness/output/<song>/repaired/pageN_300dpi.png`, each with a Verovio SVG that tags every notehead, stem, flag, and dot.
- **The scans:** `~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf` and `~/Downloads/IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf`. The Tchaikovsky truth draft is `truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json`.
- **Folders the next thread needs:** the repository, `~/Downloads`, `~/Documents/Voice Pedagogy Library`, `~/Documents/Finale Files`.

## 7. Leads the closing desk holds. Verify each; none is a finding

**From the October systems sweep, read in full:**
- It found no system whose stated purpose is the vocal line with its words from a piano-vocal score, and none aimed at Russian or Cyrillic song.
- The two art-song benchmarks it found remove or mask the vocal staff. Lyrics are read by closed products (vendor claims only) and by Audiveris through Tesseract.
- The best open readers are trained, crop and straighten a staff or system before reading it, and read text with a separate engine. **homr reads one straightened staff at a time. That is Dann's voice-zone idea of 2026-10-02 17:03, arrived at independently.**
- A third party has ported homr to the browser (onnxruntime-web; 134 to 189 MB of models; AGPL-3.0). So a trained reader running offline in a browser is shown to be possible, at that size and under that licence.
- It found no note-level accuracy on real nineteenth-century scans for any system, and no test of Russian lyrics or the old spelling anywhere.

**From July's landscape scan, which its own commissioner flags as unverified:** SMT and SMT++ (MIT, with weights); Legato (2025); Transcoda (2026: 59 million parameters, trained on synthetic pages, output constrained by a grammar, figures on historical Polish scans; its licence unconfirmed); AMNLT (2024: notes, words, and their alignment together, on chant); general vision-language models fail at exact reading.

**Candidates the closing desk thought of. Test or discard each; do not adopt one because it is listed here:**
- **Adopt a trained reader for the notes of one staff, and keep what is ours around it:** the voice-staff choice, the bars and the checks, the three states for every fact, the singer's correction. July ruled this once (adopt and layer). The licence decides which reader.
- **A small trained classifier for the symbols,** trained on pages we can label for free (the renders and their SVG), with the hand-built geometry kept for staves and bars. It crosses T3 and needs Dann's ruling.
- **Read the words with a text engine on the lyric band alone,** with an old-spelling model or a correction step for ѣ, and Ilya's dictionary and the poem as witnesses that check and never author.
- **The singer confirms.** If no cold read reaches the bar, "perfection" may be a read plus a fast, well-aimed correction. Phase 1 of plan r4 is the design of that, and drawing 1 exists (`drawing-phase1-unsure-note_r1_2026-10-02.png`).
- **Match, do not read.** Where a song already exists in a clean digital encoding, the task may become finding and checking it.
- **The constraints as choices.** The browser, the offline stance, and the licence each have a reason. The appraisal may show what each costs.

## 8. A suggested first hour. The next desk may order it otherwise

1. Read this file. Then read, whole, the three July documents the hand-built reader rests on: the charter, the bake-off memo, and the octave-corrected memo. Then the newest `claude/e16-handover_v*`.
2. **Settle why July and October disagree about homr** (section 4). It is one run for Code on the Mac, or a reading of July's adapter and scorer. Everything else in the appraisal leans on the answer.
3. Run the literature sweep from its brief, and write and run the third (old Russian print; existing encodings). Two agents at once at most, cost stated first, each memo read whole by the desk.
4. Open the sources that carry the most weight yourself: homr's method, Audiveris's handling of lyrics, and the results tables of the papers the sweeps rank highest.
5. Give Dann part 1 of the appraisal, by piece (section 3), and stop for his response before the next part.

## 9. What waits, so the appraisal does not lose it

- **Held for the appraisal:** `QUEUE.md` row 26, the pitch brief for Code. Row 25, the old-spelling brief for the cloud lane, does not depend on the appraisal and can run when Dann says.
- **With Dann, unanswered:** the mark for an unsure note, A, B, or C (drawing 1); three questions of taste from row 8 (`../memory/OWED.md`, "After row 24"); his walk of rows 18 to 24 and row 8, none of which is DONE.
- **Found and not fixed:** the loupe opens 2,135 px tall and empty on the Tchaikovsky score file in the desk's headless run, while the *Sunless* 1 fixture opens properly (`../memory/OWED.md`, "Phase 1 of plan r4").
- **The checkpoint:** Friday 2026-10-09 (plan r4, section 5). The appraisal is what Dann will rule from on that day, or sooner.
