# The parts of the whole job, and the assembly of them

**Kept by the desk (Fable). Opened 2026-10-04 19:55. Last brought up to date 2026-10-04 21:50. A living list: update it whenever a part arrives, changes its number, or changes its source.**

**Why this file exists.** On 2026-10-04 at 15:13 Dann, after the desk wrote "Nobody has built the whole job in the open": *"It is your job to virtualkly build the job and keep track of its parts while they manifest."* (`../memory/CONTRACT.md`, posture 7.) So the desk put the whole job together from parts that already exist, ran it on one scan, and keeps this list of the parts.

**The job** (Dann, 2026-10-02 02:31): *"a scan in, a melody out, IPA seated under it and Russian seated under that."*

## The assembly, as it stands at 21:15

**The scan:** `~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf` (md5 `3d3d4684a1180bd4d4904ccbaca15bfb`), three pages, Poppler raster at 400 dpi. A build song. **The truth:** `truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json`, the desk's reading of 2026-10-02 (each head measured by a script against its own staff, lengths by eye, every bar checked to add up), a draft that Dann has not proofed; its words are in the old spelling as printed.

**What comes out, against that truth.** The first column is the 19:55 assembly (`assemble4.py`). The last is the assembly now (`assemble6.py`).

| | 19:55 | With "no glyph thrown away" (20:06) | With "how common a word is" (21:13) | Of |
|---|---|---|---|---|
| Bars read | 99 | 99 | 99 | 99 |
| Notes with the right pitch and the right length | 171 | 171 | 171 | 174 |
| Rests with the right length | 48 | 48 | 48 | 48 |
| Syllables seated under a note | 171 | 172 | 172 | 172 |
| The right vowel under the right note | 166 | 168 | 168 | 172 |
| The syllable's letters as printed | 152 | 157 | 159 | 172 |
| The syllable's whole word as printed | 145 | 148 | 152 | 172 |

**What it says about its own doubt, now.** Each word carries one of three states (plan r4, principle 8).

| State | Syllables | Of them, word right |
|---|---|---|
| Read: the dictionary knows the word as read | 77 | 76 |
| Deduced: the dictionary divided, repaired, or chose it | 89 | 75 |
| Unsure: left for the singer | 6 | 1 |

So 15 of 172 syllables sit in a word the assembly gives with confidence and has misread (17 at 19:55). Those matter most.

**It has been walked into Ilya (part 14).** The reading, written as a score file in modern spelling, was dropped on Ilya's own page in a test browser in the desk's workspace (the `Shane` branch at `b2106d09`, dev server, headless Chromium, 1,440 px wide). Ilya filled the poem box from the file's 172 cells of words, transcribed 100 words, and drew the notes with IPA and Russian under them. The picture: `assembly-a-scan-to-a-seated-song_r1_2026-10-04/ilya-markup-from-the-scan.png`. Dann has not yet seen it in his own browser.

**The record of each pass** is in `assembly-a-scan-to-a-seated-song_r1_2026-10-04/results.txt`. **The pictures:** `asm-v5-page1.png`, `-page2.png`, `-page3.png` (the scan, and under every system what the assembly read); `asm-v3-*` and `asm-v4-*` are the earlier passes.

## The parts

Each row: the part, where it comes from, its state in the assembly, its number on this scan, and what stands between it and Ilya.

| # | Part | Source | State | Number on this scan | Between it and Ilya |
|---|---|---|---|---|---|
| 1 | Staves and systems; each staff straightened | homr, AGPL-3.0, main at `560ca5c` (2026-10-04) | Runs | 11 of 11 systems | The licence. Ilya's own traced staves read 99 of 99 bars here (`../memory/QUEUE.md` rows 18, 19) and are MIT |
| 2 | The voice staff | homr marks a lone staff apart from a braced pair; the desk adds: a line of words stands under it | Runs | 11 of 11 | Dann's brace rule of 2026-08-12 is the same idea, and Ilya's reader already chooses the voice by it (`reader.py:991-1048`, the Opus memo's citation) |
| 3 | Notes: pitch, length, rests, bars, key | homr's transformer, model `465` | Runs | 171 of 174; 48 of 48 rests; both ties; two sharps | The licence. All three misreads are accidentals, checked on the page by the desk at 20:10: bar 40 prints a natural that homr gives as a sharp (`bar40-the-natural-sign.png`); bars 36 and 68 print no sign and homr gives a sharp |
| 4 | Where each note stands on the page | homr main writes a rough place for each note | Runs | Enough to seat 172 of 172 | Ilya's own head finder gives 173 of 174 heads with exact places (`QUEUE.md` row 21) |
| 5 | The line of words | The desk: the row under the voice staff where letter-sized shapes are densest | Runs | 11 of 11 lines | Untested on two lines of words (Lamm prints Russian over German) |
| 6 | Letters | Tesseract 5.3.4, three models: `orus` (old spelling, Apache-2.0), and the stock `Cyrillic` and `rus` | Runs | Alone, syllables as printed: `orus` 125, `Cyrillic` 132, `rus` 112, of 172 | tesseract.js 7 is in the app (`apps/web/package.json:25`) with the `rus` model (`ScoreUploader.svelte:443`). Whether it loads `orus` is NOT ESTABLISHED |
| 7 | Words from letters | The desk: printed hyphens sew syllables, across a system break too; Ilya's dictionary (943,106 forms), after Ilya's own modernising rule and the 1918 endings, divides a run printed with no spaces and repairs a letter | Runs | See the table above | A Python copy of the rule, for the trial. In Ilya the same steps exist in `packages/dictionary` and `apps/web/src/lib/pipeline.ts` |
| 8 | The count of notes over a word | The desk, after plan r4, principle 10 | Runs | Part 7 without it: 121 to 125 words right. With it: 145 | Nothing |
| 9 | Each syllable under its note | The desk: one vowel to one note, by place across the page, in order | Runs | 172 seated; 168 with the right vowel | Nothing |
| 10 | Read, deduced, unsure | The desk, from parts 7 to 9 and 17 to 18 | Runs | 76 of 77; 75 of 89; 6 unsure | A carrier into Ilya. Today the converter counts an unsure note and does not mark it, by the E.47 ruling (`apps/web/src/lib/score/ingestion/recognized-to-musicxml.ts:15-31`, read). Plan r4 reopens it; the mark is drawn and waits for Dann (`../memory/OWED.md`) |
| 11 | Checks by the music's own rules | Ilya's validators (`tools/e16-harness/reader/`) | NOT IN YET | n/a | homr gives 3/8 on page 1 and 1/4 on pages 2 and 3, which print no metre. The score file of part 14 carries page 1's metre to the end by hand. A rule to add: a sharp must have a source (a sign, the key, or an earlier note in the bar); it bears on all three of homr's misreads |
| 12 | The poem as a second witness | The singer's paste; LiederNet by hand | NOT IN YET, on purpose | n/a | It would settle «понравился» against «но нравился», which the dictionary cannot. Dann, 13:28: it checks and never authors |
| 13 | Tempo words and dynamics | On this page: "Moderato", "con tristezza", hairpins | NOT IN YET | n/a | homr's README says it neglects dynamics. The letter reader of part 6 can read the words above the staff |
| 14 | Into Ilya | A score file with words fills the poem box and seats the words (`apps/web/src/routes/+page.svelte:3235-3238`, read) | DONE AS A TRIAL, modern spelling | 172 cells of words in; 100 words transcribed; 174 notes drawn | (a) The file as printed, in the old spelling, is written and not yet walked. Ilya's intake tests for a vowel with `/[аеёиоуыэюя]/` (`apps/web/src/lib/score/vowel-resolver.ts:156`, read), which has no ѣ, і, or ѵ, so a cell such as «гѣ» would count as having no vowel. What Ilya then does is NOT ESTABLISHED. (b) In the desk's test browser each sheet shows its first three systems and the rest lie below the edge of the score's window; Dann's own fixture does the same there, so it is not this file. Whether a singer's browser does it is NOT ESTABLISHED |
| 15 | In the browser | homr-web (third party, AGPL-3.0, model `396`, 134 to 189 MB); tesseract.js | NOT TRIED | n/a | Whether homr-web runs model `465`, and how long a page takes on Dann's iMac |
| 16 | The singer's fix | Ilya's Corrections and the loupe | NOT CONNECTED | n/a | Part 10's states need a carrier into Markup (plan r4, phase 3) |
| 17 | No glyph is thrown away | Dann, 20:06: *"when glyphs are detected within the termini established for lyrics, then there must be a value delivered."* Built by the desk in `assemble5.py` | Runs | A ledger of the 559 glyphs the letter reader boxed on the 11 lines: 442 letters, 102 hyphens and stops, 1 kept as an unknown letter (the ѣ of «Мнѣ», which the reader had called "%"), 14 set aside with a reason (12 left of the first note, 2 not standing on the line) | With it came three rules of the old spelling itself: і stands only before a vowel or й, and in «міръ»; ъ never follows a vowel; no word begins with ъ, ь, or ы. And one letter of a long word may differ from a dictionary word. The desk's refinement, put to Dann at 20:10: a value or a visible doubt, never a forced guess |
| 18 | How common a word is | Dann, 20:15 and 20:22. A Sonnet helper's prototype: bands 0 to 9 for 812,365 of the 943,106 forms, from hermitdave FrequencyWords and wordfreq (both CC BY-SA 4.0), Google Books Ngrams (CC BY 3.0), and a count of 6,485 poems by authors born 1780 to 1850 from Russian Wikisource (`memo-sonnet-russian-word-frequency-resources_r1_2026-10-04.md`; `freq-prototype_r1_2026-10-04/`) | Runs, as a tie-breaker only: a lead of two bands or more settles a tie (`assemble6.py`) | «мнѣ» (8) over «мни» (2); «засыпаю» (3) over «зазываю» (1). Words right 148 to 152; unsure syllables 11 to 6 | The dictionary holds no such figure (entry shape `s`, `e`, `f`, `p`, `l`). The helper's estimate: a field of one digit adds about 295 KB gzipped. It misleads by its nature on poetic words («была» 7 outranks «бала» 4), so it never overrules a clear reading. The helper's test on 15,000 words of poetry, poets held out: a lead of two bands or more is right 96 to 99.6 in 100; under one band, about half. Leipzig's licence is NOT ESTABLISHED; Lyashevskaya and Sharov's list has no licence grant and stays out |

## What the code review adds (Opus helper, back at 20:40; `memo-opus-homr-code-against-ilyas-reader_r1_2026-10-04.md`)

Asked by Dann at 20:22: *"Have we taken a critical look at homr's code, the way it is conceived, structured, and written, and what can we learn about that versus what we have as Ilya's reader's code base?"* The memo is the helper's reading; the desk read it in full and spot-checked four of its citations (`reader/README.md:7`; the shipped `manifest.json`; `homr/transformer/decoder_inference.py:110-124`; `homr/circle_of_fifths.py:178-188`). Its lessons are candidate parts, none built:

| # | Candidate part | State | What it needs |
|---|---|---|---|
| 19 | Labelled practice pages made by computer: renders in several fonts, roughened on purpose, with the answer taken from the renderer | NOT BUILT | Ilya has Verovio, four fonts, and `oracle.py`. Days of work |
| 20 | Small checkers on fixed windows that sort the kinds of ink: "is this a notehead?", "what stands at the stem's end?", then "which sign is printed?", rests last | NOT BUILT | Dann's ruling on charter tripwire T3, "no machine learning anywhere" (`tools/e16-harness/reader/README.md:7`). The helper's correction of the desk's 20:19 proposal: Ilya loses more at finding and separating ink than at naming it |
| 21 | A map back to the scan for every step that moves pixels | NOT BUILT | Hours. Ilya's straightening discards its displacement (`reader.py:695`, `:702`, the helper's citation) |
| 22 | Two measurements that need no training and no ruling: the share of misses by cause on the reader as shipped; and the most each fix could gain, found by putting the truth in place of one decision at a time | RUN, 21:21 to 21:43 (`memo-sonnet-misses-by-cause-and-ceilings_r1_2026-10-04.md`; `measure-misses-by-cause_r1_2026-10-04/`) | Of 805 printed notes on the five build songs, Ilya's reader as shipped: 455 right, 69 not found, 120 pitch only misread, 120 length only misread, 41 both, 27 extra; 14 of 170 rests. Ceilings, one perfect fix at a time, from 56.5: every length 71.4; every pitch 71.4; every not-found note 65.1; every accidental 63.2; lengths and accidentals together 80.0. As the converter draws it (a quarter for every note after a length abstention in its bar, `recognized-to-musicxml.ts:175-183`): 402 of 805. **homr main on the same scans, same scorer: 785 of 805 right, none not found, 169 of 170 rests** (97.9, 100.0, 96.1, 96.9, 98.3 by song) |

Where the helper found Ilya's design the better one, to keep: seeing kept apart from reasoning (the printed sign by rule, the key and the bar's carry in code); doubt stated note by note with its reason; the voice staff chosen by engraving rules; key and metre carried across pages; loud failure; 20 KB to run against about 157 MB.

## How it was run

- **In the desk's cloud workspace.** Nothing was installed on the Mac and nothing of homr's is in the repository. Python 3.12 and 3.13, onnxruntime 1.30.0, OpenCV 5.0.0, Tesseract 5.3.4. homr took 25 to 29 seconds a page on two CPU cores; each line of words under a second a model.
- **The scripts** are in `assembly-a-scan-to-a-seated-song_r1_2026-10-04/`: `assemble6.py` (the assembly now; its header lists the parts), `assemble5.py` and `assemble4.py` (the earlier passes, kept as the record), `assemble.py` (shared steps), `lyricline.py`, `ocrline.py`, `score_words.py`, `draw2.py`, `to_musicxml.py` (the reading as a score file), `walk.mjs` (the walk into Ilya). They are a trial, written by the desk in one day. They are not app code.
- **The score files:** `tch-op38-3-from-scan_modern.musicxml` (walked) and `tch-op38-3-from-scan_as-printed.musicxml` (not yet walked). One voice part; a word with no vowel shares the cell of the syllable it leans on, as a correctly engraved score does (`apps/web/src/lib/score/clitic-seat.ts:172-176`, read).
- **Scoring.** Notes: `tools/e16-harness/src/scan-scorer.ts`, unchanged. Words: `score_words.py`. A syllable's word counts as right when its letters, after Ilya's modernising rule on both sides, equal the truth's word.
- **To repeat it:** homr from `https://github.com/liebharc/homr` at `560ca5c`, run with `--write-staff-positions`; `orus.traineddata` from `https://github.com/AButon-8/iskra_ocr` (md5 `753d5da27813c0a7e9fce820242108db`); `Cyrillic` and `rus` from `tessdata_best`; the word list from `data/dictionary.86d83340-a.json` and `-b.json`; the bands from `freq-prototype_r1_2026-10-04/prototype.tsv.gz` (md5 `5ddfd9a1ed587fba2a6fb5d5a1bd7a3c`).

## What this does not establish

- **One song, and a build song.** Every choice in parts 5 to 10, 17, and 18 was made while looking at this song's results. Five passes have now been fitted on it. The numbers are a reading of what the assembly can do, and they flatter it. The honest test is a song the desk has not looked at, run once.
- **The truth is a draft.** Dann has not proofed it. The desk checked it against the page tonight only at the three notes where homr differs, and it held at all three.
- **The misreads that remain** (20 syllables whose word is not as printed): «свирѣли» (divided by a system break, unsure); «понравился» read as «но нравился»; «одинокіе» read as «о и некіе»; «люблю ли» read as «любя бди»; «не знаю» read as «познаю»; the last «люблю» (unsure).
- **Nothing about the browser,** the wait, or the download.
- **Nothing about other editions,** two lines of words, a voice staff under the piano, or a damaged copy.
- **The licence.** The note reader in this assembly is AGPL-3.0 and Ilya is MIT. July's ruling was to run homr at arm's length (`claude/e16-decisions-log_2026-07-22.md`, the base-engine ruling of 2026-07-23, superseded the same week on a measurement now known to be of faulty pages). A DESK DEFAULT, Dann's to overrule: the desk treats that ruling as live again for trials in its own workspace. Nothing ships on it without his ruling. Dann at 20:07 named the path he favours, in the desk's words that he quoted back: *"homr as the teacher that shows Ilya's own reader where it misreads"*. The desk recorded it as a preference and not as a ruling.

## Next, in order

1. Part 15, now first: whether homr's newest build runs in a browser on Dann's iMac, and the wait. The desk's recommendation of 21:45, put to Dann and not yet answered: homr makes the first reading and Ilya's own reader checks it. The licence ruling follows that measurement.
2. Run the assembly, unchanged, on the *Sunless* build scans (Lamm, two lines of words), and once on a held-out song.
3. Part 14: walk the file as printed, and establish what Ilya's intake does with ѣ, і, and ѵ.
4. Part 12: the poem as a second witness, marking only where it and the page disagree.
5. Part 15: homr-web and `orus` in a browser on Dann's iMac.
6. Parts 19 to 21, in the order the measurements of part 22 give, after Dann's ruling on T3 where one is needed.

## At the close of the thread, 2026-10-05 about 02:15

The list above stood at 21:50 on 2026-10-04. What moved after it, each with who watched it:

- **Dann ruled at 21:47** that homr makes the first reading and Ilya's own reader checks it (`../memory/OPEN.md`, "N.178 AND THE SCAN READER", item 22).
- **The notes, in a browser, with homr 0.7.0: answered.** homr's browser port read one page on Dann's iMac in 10.9 seconds at 22:30 (his screenshot). Inside Ilya it read the three Tchaikovsky pages in about 25 seconds at 23:24 (his words). The code is in his tree, uncommitted (`report-opus-homr-reader-into-ilya_r1_2026-10-04.md`).
- **The notes, with homr's newest build (model `465`): a changed port exists and is not in Ilya.** Under Node its output equals desktop homr main on 17 of 20 pages (`report-opus-bring-the-port-up-to-homr-main_r1_2026-10-05.md`). Not run in a browser.
- **Silent bars collapse** in what Ilya draws from a scan (`apps/web/src/lib/omr/join-pages.ts`); watched by the desk, not yet seen by Dann.
- **The words from the scan are still at the bench only** (`assemble6.py` in the assembly folder). Nothing of them is in Ilya.
- **The checks over homr's output are not built.** Dann corrected the bar rule at 00:52.

"Next, in order" is now kept in `../memory/STATE.md`, the close of 2026-10-05. The list under that heading above is superseded.
