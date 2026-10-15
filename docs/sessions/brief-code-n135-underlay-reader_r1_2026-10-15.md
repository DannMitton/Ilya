# Brief: N.135, the page reader reads the text underlay, in stages (r1)

Desk (Fable 5.1), 2026-10-15. For Code, in the lanes named per stage. N.135 was ruled by Dann 2026-09-14 and ruled a priority 2026-10-14 02:44 (*"HOly shit. We need to buiold that."*, transcribed as written; `docs/memory/OPEN.md:2773`). It serves THE ONE THING (`docs/memory/CONTRACT.md:19`): *"a scan in, a melody out, IPA seated under it and Russian seated under that."* The text it builds to is `OPEN.md:2754-2767`, "THE TEXT UNDER THE NOTES: A MIXED DEFAULT". Every `path:line` in this brief was read in a clone of `Shane` at `14e2ff8` on 2026-10-15. Stage 1 measures only and keeps nothing, so under `CONTRACT.md:25` it may start while Fable's review runs; the review then goes over its report. Stages 2 and 3 wait for the review.

Before you start any stage, read whole: `docs/memory/CONTRACT.md`; `OPEN.md:2754-2783` (the mixed default, the limit of Ilya's changes, and both N.135 addenda); `OPEN.md:2347-2375` (N.163); `OPEN.md:3040-3046` (N.184); `docs/sessions/report-code-the-russian-line-by-its-underlay_r1_2026-10-11.md` (row 80); `docs/sessions/report-code-underlay-baseline_r1_2026-10-12.md` (row 81); `docs/sessions/report-code-trocr-teacher_r1_2026-10-12.md` (row 88); and `docs/memory/QUEUE-archive.md:188` (row 93, Dann's walk).

## 1. What the singer sees and gains

Today a singer drops a scanned song. The notes appear, and the banner tells her: "Ilya does not read the words printed in an image; type them into the Input field" (`apps/web/src/lib/i18n.ts:1021`, `upload.banner.reader`). She types the poem from memory or from a book. Ilya seats her typed poem one syllable per note. Then the page and the print part company, because the composer did not set the poem as the poet printed it. On «Средь шумного бала» Dann found, on one walk (`QUEUE-archive.md:188`): the print's comma after «суеты» in bar 16 was missing; «те-бя» is lower-case in the print and «Тебя» in the poem; Tchaikovsky repeats «грустно» in bars 77 to 78 and the poem does not, so from bar 78 every syllable sat two notes early; the print ends «звучитъ!», the poem «звучит.». He retyped the whole text to match the print before 172 of 172 notes seated.

After N.135, the words under the notes are the print's own words, as the print divides and repeats them, seated under the notes the engraver put them under, and the Input field holds that text with nothing to type. A pre-reform spelling reaches her modernized where the sound is unchanged, per Grayson (`OPEN.md:2771-2773`). Where Ilya cannot read a page's words, the banner stays as it is today and she types, as today (`OPEN.md:2777`, the condition for departing). She never sees a count, a confidence, or the reader's name. Where a word is read that Ilya cannot vouch for, she sees it as printed and the transcription abstains on it, the way the engine abstains on a word it does not know; she never sees a confident gloss on a misread word (N.163, `OPEN.md:2353-2359`).

The measure of done, from `docs/sessions/plan-scan-reader_r4_2026-10-01.md:47`, ruled by Dann 2026-10-01 22:22: **9 of every 10 syllables right and under the right note, per song, and no confident non-word.**

## 2. What is established, and what are leads

Established, read this session:

- The scan path reads with homr's OCR off: `apps/web/src/lib/omr/homr-reader.ts:305`, `ocr: false`. The pass runs a second reader beside homr per page, the time-signature reader, as a dependency: `deps.metres(images[i], result.musicXml, result.staves)` (`homr-reader.ts:312`), typed at `:94`, run in a Worker (`apps/web/src/lib/omr/metre-client.ts:1-9`). That is the seam an underlay reader takes.
- homr writes each note's place on the page as `<!-- imgpos: x, y -->`, and Ilya reads it with `placeOf` (`apps/web/src/lib/omr/join-pages.ts:435-439`). Row 80 found those places in the frame of Ilya's own 400 dpi raster, identity mapping (row 80 report, section 1).
- A score file whose notes carry `<lyric>` is seated from its own words: the parser finds the lyric part (`packages/score-parser/src/musicxml-parser.ts:335-345`) and fires `no-lyrics-found` only when none carries lyrics (`:343`); on upload with an empty Input, the page fills the Input from the score's words (`apps/web/src/routes/+page.svelte:3240-3243`, `scoreWordsText(collectScoreWords(...))`); `seatScoreWords` seats each word's vowel-bearing syllables on the notes the file engraved them under (`apps/web/src/lib/score/score-seat.ts:78-124`), and carries the file's own punctuation (`:114`). **So a reading that writes `<lyric>` into homr's MusicXML needs no new seating code.** `collectScoreWords` is at `apps/web/src/lib/score/vowel-resolver.ts:243`; `CYRILLIC_VOWEL` at `:157` already holds ѣ, і, and ѵ.
- A scan's banner key is chosen by provenance: `noLyricsNoticeKey` (`apps/web/src/lib/score/ingestion/ingest.ts:85-86`) gives `upload.banner.noLyricsScan` (`i18n.ts:1359`) for `via === 'reader'`.
- The kept reading is stamped `homr-web@0.2.0-ilya.7/465` (`apps/web/src/lib/omr/stamp.ts:18-23`); a reading with another stamp is read again (`stamp.ts:7-9`). The reading is the second allowed derived store (`CONTRACT.md:124`).
- Pre-reform spelling is modernized by `modernisePreReform` (`packages/dictionary/src/pre-reform-normalizer.ts:244`; row 81's brief cited `:237`, the tree has moved).
- The scorer does not score syllables: `tools/e16-harness/src/scan-scorer.ts:59`, "NOT SCORED: syllables (the reader carries none)". Its alignment of truth notes to read notes is `align` (`:111`). Truth files carry `syllableText` and `syllableType` per note (`tools/e16-harness/src/ground-truth.ts:46-48`).
- The truth files live in `tools/e16-harness/output/truth/`, git-ignored and on the Mac only (`docs/memory/ENVIRONMENT.md:4567`; `tools/e16-harness/.gitignore:2`). The scans are in `~/Downloads` and `~/Documents` (`OPEN.md:2806-2808`).
- Three underlay readers have been measured on the four opened songs S, T, K, and M (the letters rows 80, 81, and 88 use; 493 printed syllables, 55 Russian rows): Tesseract `rus` best_int 295 syllables right letter for letter, `rus` best 309, `Cyrillic` best 315 (row 81 report, section 5); `taiga75/ru-trocr-1700s` read in ink-gap chunks 385, and 390 with a Latin-i map, ѣ 21 of 21 (row 88 report, "The answer first"). The float Tesseract models abort on the core tesseract.js picks under Node and probably in the browser, NOT ESTABLISHED in the browser (row 81, section 2). The TrOCR model is 1,339,228,897 bytes in float32 on disk and ran on the Mac's MPS at 0.40 s a chunk (row 88, sections 1 and 6).
- Deciding a row's language by whole words of a poem fails (5 of 55 rows); by whole printed syllables it calls 54 of 55 with 2 false calls (row 81, section 4). Row 80: with English and French loaded, 10 of 33 Russian syllables came back as Latin look-alikes (section 2).
- Row 82 (`QUEUE.md:13`), a fine-tuned `Cyrillic` model, is READY and unrun. When it lands, it is one more reader for this harness.
- The port carries its own OCR, three RapidOCR models of about 32 MB, loaded unless `ocr: false` (`third_party/homr-web/README.md:101-105`, `:170-172`), used for chord and title strips (`:202`).

Leads, not read this session (close each before you rely on it, or write NOT ESTABLISHED):

- Which character set the port's RapidOCR recognizer (`PP-OCRv6_rec_small.onnx`) carries, and whether it holds Cyrillic at all.
- `pipeline.ts:266` and `:544-571` as the place the Transcription pipeline abstains on an unknown word (plan r4, `plan-scan-reader_r4_2026-10-01.md:99`).
- Row 93's `bars.md` and `repro.mjs` (`docs/sessions/row93-rekey_2026-10-13/`) as the way to drive a scan through the real page in headless Chrome.
- Whether Dann's own Finale engravings behind the *Sunless* and Kabalevsky truths match the scans in key and edition (Dann 2026-10-02 08:56, `OPEN.md:2806`: where they differ, the scan decides).

## 3. The stages, and the lane of each

| Stage | What it does | Keeps anything that ships | Lane | Why that lane |
|---|---|---|---|---|
| 1 | A harness that measures candidate underlay readers on the build songs: syllables right, language of row, and seating against the truth | No | The Mac | The truth files, the scans, and the MPS the teacher needs are on the Mac only (`ENVIRONMENT.md:4567`, `:4624`) |
| 2a | The pure modules: rows cut from a band, syllable boxes seated to `imgpos`, words sewn and written as `<lyric>`; unit tests on synthetic rows | Yes, behind nothing visible yet | The cloud lane, one dedicated branch | Needs no truth file and no scan; tests run on fixtures in the tree; the credit is free to spend until 2026-11-05 (`CONTRACT.md:75`) |
| 2b | The reader wired into the scan path behind the mixed default, measured on the real page in the browser | Yes | The Mac | *"The scan reader stays on the Mac"* (`CONTRACT.md:75`); the browser measure needs the scans |
| 3 | The poem as second witness, and lines restored | Yes | Not briefed here | Its design is Dann's (section 9) |

Stage 1 does not wait for anything. Stage 2a may start on the cloud lane as soon as Fable's review of this brief is applied, in parallel with stage 1, because its interfaces are fixed in section 6 and its tests need no measured number. Stage 2b waits for stage 1's report and the reader decision in section 5.

## 4. Stage 1: the harness. Measure only; nothing ships

**Folder:** `docs/sessions/measure-n135-underlay-harness_<date>/`. Every number in the report comes from a script in that folder, and the report names the script.

**Songs.** The build songs that have syllable truth, and the four opened songs the baselines were taken on. Never open a held-out song or folder: read `~/Downloads/_desk-heldout-exclusions_2026-10-12.md` first and obey its rule; do not open `~/Downloads/_desk-heldout3-private/` beyond the four files `four.json` names for S and T, and no `heldout4` folder. The report names no song outside this table.

| Letter | Song | Scan | Truth with syllables | Underlay languages printed |
|---|---|---|---|---|
| U1, U3, U4, U5, U6 | *Sunless* 1, 3, 4, 5, 6 | `~/Downloads/IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf`, pages per `docs/sessions/memo-desk-truth-from-finale_r1_2026-10-02.md:36` | `tools/e16-harness/output/truth/` (Dann's engravings) | Russian over German |
| B1 to B10 | Kabalevsky op. 52, 1 to 10 | `~/Documents/Repertoire & Scores/Scores - vocal/Kabalevsky op52 - 01.pdf` to `- 10.pdf` | `tools/e16-harness/output/truth/kabalevsky_shakespeare_t01...t10.truth.json` | Russian only, modern spelling, generational photocopies |
| P | Tchaikovsky op. 38 no. 3 | `~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf` | None with syllables (`docs/sessions/truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json` holds 0 `syllable` fields; read this session) | Russian only, pre-reform |
| S, T, K, M | as rows 80, 81, and 88 resolve them (`docs/sessions/measure-set3-four-below_2026-10-11/run.py:12-14`, `:55-57`) | the same | S and T carry syllables; K and M do not (row 81, "Could not establish") | S three languages; T two; K and M one |

Cut a build-only PDF for *Sunless* with `qpdf`, as `ENVIRONMENT.md:4624` shows, so song 2's pages are never rendered. For every song, the raster is Ilya's own: row 81's `raster.mjs` (`rasterizePdf` in headless Chrome against the dev server). Before starting the dev server, say what is already running on the Mac (`CONTRACT.md:51`).

**The notes.** For S, T, K, and M, row 80's `*.notes.jsonl` and `*.status.json`, unchanged. For the other songs, run homr once per song on Ilya's path and keep each note's page, bar, `imgpos`, pitch, and type in the same shape; run the scorer (`scan-scorer.ts:209`) once per song and keep each note's verdict. Do not tune homr. The notes are the fixed frame; the harness measures words against them.

**The readers.** Each reader is one function from a row crop (or a band crop, where the reader cuts its own rows) to a list of tokens, each with its box in page pixels and a confidence or null, written in row 81's `ocr/<L>-<model>.json` shape so row 81's `step5.py` and row 88's `misread.py` score them unchanged. Add a reader by name; the harness takes the list from one file.

| Name | Reader | Where it runs | Why it is in |
|---|---|---|---|
| (a) | Tesseract `rus` 4.0.0_best_int, tesseract.js 7.0.0, PSM 7 | Node, default core | The only model Ilya can load today (row 81, section 2) |
| (c) | Tesseract `Cyrillic` from `tessdata_best`, PSM 7 | Node, row 81's scratch tesseract.js on the SIMD LSTM core | Best Tesseract baseline (row 81) |
| (t-imap) | `taiga75/ru-trocr-1700s`, revision `d5563063e42e4f10104e967eca6644ae17714878`, ink-gap chunks, Latin i mapped to і | Python, MPS, `~/Downloads/_desk-trocr/` | Best reader measured (row 88); the ceiling for this generation, not a browser candidate |
| (p) | The port's RapidOCR, by `readTextStrips` or `recognizePage` with `ocr: true`, on the band | Node or headless Chrome | Already shipped in the model set, 32 MB, cached; its Cyrillic is a lead |
| (d) | Row 82's `rus_prereform`, when it lands | Node, on the core Ilya uses | The browser candidate for pre-reform print |

Keep every model outside the tree. Record each file's size and md5. Download only what row 81 and row 88 already downloaded; a new model needs Dann's yes (`CONTRACT.md:10`, money and the irreversible; a download that costs nothing still goes in the report).

### 4.1 Rows and bands

Reuse row 81's `rows.py` rule (`report-code-underlay-baseline_r1_2026-10-12.md:24`). Report rows per system for every song, and check by eye two systems per song, drawn on the band.

Control rule, before running: the desk expects every Russian row of U1 to U6 and B1 to B10 to become exactly one row, as it did for S, T, K, and M (row 81, section 1). The likeliest failure is B1 to B10: generational photocopies with grey paper, where the ink threshold of paper tone less 60 may split a row or swallow the piano's upper reach. Report against both.

### 4.2 Syllables read right, per reader and per song

Type each song's Russian underlay from Ilya's raster as row 81's `poem.txt` was typed (one line per row, as printed, pre-reform kept, hyphen-ending syllables marked), mark it as your transcription, and check it against the truth's `syllableText` in order where a truth exists; report any syllable that does not occur.

Score with row 81's `step5.py`: right letter for letter, and right in sound after `modernisePreReform`, per song and reader, in one table. Keep the pre-reform letter table (ѣ, і, ѳ, ѵ, word-final ъ) for the pre-reform songs (U1 to U6, P, S, T, K, M).

Control rule: the desk expects (t-imap) above 75 of 100 on every pre-reform song and (a) between 55 and 70, in line with rows 81 and 88; on B1 to B10, modern spelling, the desk expects (a) and (c) to close most of the gap to (t-imap). Likeliest failure: the photocopies' broken strokes cost (a) and (c) far more than the clean engravings did, and the gap widens instead.

### 4.3 The language of a row, without a poem

The singer gives no poem (Dann 2026-10-01 23:06, `OPEN.md:2794`). Row 81's best separator used the poem. Measure these no-poem decisions, each per reader, against the row labels in your transcription (Russian, other language, not text):

1. **Dictionary witness.** Sew the row's tokens (a token ending in a hyphen joins the next; a lone hyphen joins its neighbours, row 81's `joint` rule); modernize each word with `modernisePreReform`; a row is Russian where at least half of its sewn words of two or more letters are entries of `packages/dictionary` (whole-word, lower-cased, ё folded).
2. **Two readings, by dictionary count.** Read each row twice, Russian only and English plus French; the row goes to the reading whose sewn words the matching dictionary holds more of. For English and French, the harness has no dictionary in the tree: use a word list you name and keep outside the tree, and say so. (Row 80's form D decided by confidence and failed; this decides by words.)
3. **Position.** The first text row under the voice staff is Russian. Expected to fail on S (English first) and to hold on U1 to U6 (Russian first; `memo-desk-truth-from-finale_r1_2026-10-02.md:36`); measured so the cost of the cheap rule is on record.
4. **Dictionary witness with the poem,** row 81's `syll` variant, as the ceiling when a poem is given.

Report, per song, reader, and decision: Russian rows called Russian, other rows called Russian, Russian rows missed. A row of one or two words is reported apart, because chance matches live there (row 81, section 4, "These are short syllables").

Control rule: the desk expects decision 1 with (t-imap) to call at least 50 of the 55 rows of S, T, K, and M and every Russian row of U1 to U6, with false calls only on short rows; the likeliest failure is Russian rows of two or three syllable-tokens where one misread letter makes every sewn word a non-word, so the row goes uncalled, and the second likeliest is German rows on U1 to U6 whose look-alike letters (а, е, о, р, с) read as Cyrillic words of two letters.

### 4.4 Seating: each syllable under its note

This is the measure N.135 is judged by. For each Russian row and reader, seat each token on a note of the same system by these candidate rules, then score against the truth:

1. **Nearest head.** The token's box centre in x to the nearest `imgpos` x among the voice notes of that system (Gould: a syllable centres under its note, plan r4 §4 step 1).
2. **Order within the bar.** Where a bar's tokens, sorted by x, equal in number the bar's sung notes that the truth would give a syllable (notes not tied into and not under an extender), pair them in order; otherwise rule 1 (row 93's order rule, `apps/web/src/lib/score/old-reader-seats.ts:102`, applied to boxes instead of old seats).
3. **Monotone alignment.** One pass of least-cost alignment per system, each token to one note, order kept, cost the x distance, a note allowed no token (melisma or tie), a token never without a note.

Scoring: align the truth's notes to homr's with the scorer's `align` (`scan-scorer.ts:111`); over the truth notes that matched a read note and carry `syllableText`, count those whose seated token equals the truth syllable letter for letter (case folded, hyphen removed) and in sound after `modernisePreReform`. Report, per song, reader, and rule: syllables right under the right note, of the truth's syllable-bearing notes; and apart, the truth syllables whose note homr did not read (not the seating's fault, counted so the two causes stay separate). Also report, for every song, tokens seated on a note the truth gives no syllable (a tie's second note, a melisma continuation), because that is the error a singer sees as a syllable one note early, the row 93 walk's own finding.

On P, where no syllable truth exists, score seating against a transcription keyed by bar that you type from the print, and say that the truth is yours. Check the four findings of Dann's walk by name: the comma after «суеты» (bar 16) kept; «те-бя» lower-case; «грустно» twice in bars 77 to 78; «звучитъ!» with its mark.

Control rule: the desk expects rule 3 to beat rule 1 wherever a row holds a melisma, and rule 1 to be within 2 syllables of rule 3 on B1 to B10; it expects 9 of 10 on B1 to B10 with (t-imap) and below 9 of 10 on U1 to U6, where the German row sits a few pixels under the Russian one. The likeliest failure is the one row 81 could not separate (section 7, `diag7.txt`): the token's box is offset from `imgpos` by more than a head, so nearest-head seats it one note over; the second is a chunk that holds two syllables run together (row 88: 50 of 69 misreads share a token), which no seating rule can split.

### 4.5 What a reading costs

For each reader: seconds per page on the Mac, the bytes it would need in the browser, and whether it loads on the core tesseract.js picks in Chrome (run (a), (c), and (d) once each in headless Chrome through the real `createWorker`; report the error text where one fails). (t-imap) is reported as the teacher: its bytes on disk and the fact that it is not a browser candidate.

### 4.6 Stage 1 gates

- `git --no-optional-locks status --short -- apps packages third_party static` is empty at the end.
- Every number in the report is printed by a script in the measurement folder.
- No held-out song is named, rendered, or opened; the exclusions file was read first and the report says so.
- No model file is in the tree; sizes and md5s are in the report.
- Each measurement's report line states the expectation and the likeliest failure that were written before it ran, then the result.

### 4.7 Stage 1 done when

The report (`docs/sessions/report-code-n135-underlay-harness_r1_<date>.md`) holds, for every song in the table and every reader in the list: syllables right (4.2), rows called (4.3, four decisions), syllables under the right note (4.4, three rules), and cost (4.5); plus the four walk checks on P; plus a "Could not establish" section. From it the desk can answer, with a count and a place, two questions: which reader, and which seating rule, reach 9 of 10 on which songs today.

## 5. The reader decision, after stage 1

The desk decides from the report, and says so in one line under `CONTRACT.md:9` (he says what; the desk decides how). The decision is not Dann's unless it costs money or a held-out song. The shape of the decision, so stage 2 can be written against it:

- **Browser reader:** the best reader that loads on Ilya's own path in Chrome. Today that is (a) by default and (d) if row 82 lands and loads; (c) only if it loads (NOT ESTABLISHED).
- **Teacher:** (t-imap) is not shipped. If stage 1 shows the browser reader below 9 of 10 on the build songs and (t-imap) above it, the desk brings Dann the one question that is his: whether a server-side read (money, and his name on a service) is on the table. Nothing in stage 2 assumes it.
- **Seating rule:** the rule that wins 4.4 on most songs; ties go to the one with fewer tokens seated on a note that carries no syllable.
- **The "cannot read" threshold** of the mixed default's condition (`OPEN.md:2777`): DESK DEFAULT, a page's underlay is used only where decision 1 of 4.3 calls at least one Russian row per system of the page and at least half of the sewn words of those rows pass the dictionary; otherwise that page keeps the typed-poem path and the banner. Stage 1 reports how many pages of each song pass this threshold with each reader, so the default is a number before it is a rule.

## 6. Stage 2a: the pure modules. Cloud lane, Sonnet

Branch cut from `origin/Shane` at `14e2ff8` or later; one dedicated branch; no pull request; Dann merges (`CONTRACT.md:75`). Nothing in `+page.svelte`. No new string.

New files under `apps/web/src/lib/omr/`, each with its test file:

1. `underlay-rows.ts`: `cutRows(band: GreyBandLike, staffSpace: number): RowBox[]`, row 81's rule as code (ink below paper tone less 60; a row's lines exceed 2 percent of the band width; gaps under 0.3 space merge; rows under 0.4 space drop; 0.3 space padding). Tests on synthetic bands: one row, two rows a hyphen's height apart, a melisma extender alone, a piano head reaching into the band.
2. `underlay-seat.ts`: `seatTokens(tokens: Token[], notes: NotePlace[], rule: 'nearest' | 'order' | 'monotone'): Seat[]`, the three rules of 4.4, pure, no DOM. Tests: equal counts; one melisma; a token offset by a head and a half; two tokens run together (reported, not split).
3. `underlay-words.ts`: `sewWords(seats: Seat[]): Word[]` by hyphen and extender (a token ending in a hyphen continues; a lone hyphen joins neighbours; an extender marks a held syllable), giving each syllable its `syllabic` value (`single`, `begin`, `middle`, `end`); and `writeLyrics(musicXml: string, words: Word[]): string`, which adds one `<lyric number="1">` with `<syllabic>` and `<text>` to each seated voice `<note>` of homr's MusicXML and leaves everything else byte for byte. Test on `apps/web/src/lib/omr/fixtures/tch-3.musicxml` (read this session: a two-part homr reading with no lyrics) with a hand-made seat list: the parser then finds the lyric part (`musicxml-parser.ts:335-345`), `no-lyrics-found` does not fire, and `collectScoreWords` (`vowel-resolver.ts:243`) returns the words you seated, in order.
4. `underlay-language.ts`: `rowLanguage(words: string[], isWord: (w: string) => boolean): 'russian' | 'other'`, decision 1 of 4.3, with the dictionary passed in. Tests with a stub dictionary.
5. `underlay-stamp`: a constant `UNDERLAY_READER` in `stamp.ts`, not yet joined to `READER_STAMP`; stage 2b joins it. `stamp.test.ts` keeps passing.

Gates: `pnpm -C apps/web test` green; `tsc` clean; the eight gates named in `QUEUE.md` as every row runs them; `+page.svelte` untouched at its ceiling (row 93 report: 6003 lines). Done when the five modules and their tests are on the branch and the report lists each function's signature and test count.

## 7. Stage 2b: the reader in the scan path, behind the mixed default. The Mac, Opus

Waits for stage 1's report and section 5's decision. Scope:

1. **The dependency.** `ReaderDeps` gains `underlay?: ReadUnderlay` beside `metres` (`homr-reader.ts:87-96`), run per page in `pass` the way `deps.metres` is (`:312`), in its own Worker on the pattern of `metre-client.ts`. It takes the page image, homr's page MusicXML, and `result.staves`; it returns the page's seated words or null. A page that answers null is joined as today. The band is cut under each voice staff from `staves` and `imgpos`; rows by stage 2a's `cutRows`; the reader is the browser reader of section 5, loaded through `tesseract.js`'s `createWorker` with its language data served from Ilya's own origin under `static/` (tell Dann the byte count before anything lands in `static/`, `CONTRACT.md:130`); language by `rowLanguage` with `packages/dictionary`; seating by `seatTokens` with the winning rule; words by `sewWords`.
2. **The join.** After `joinLookingAtPages` (`homr-reader.ts:379`), `writeLyrics` adds the words to the joined MusicXML where the page passed section 5's threshold. The kept reading then carries the words, and `READER_STAMP` (`stamp.ts:23`) gains the underlay reader's version, so every stored scan reading is read again once, silently where the song has no hand work (`plan-scan-reader_r4_2026-10-01.md:87`). Say in the report how many of Dann's songs that touches; he has one scan song in his library (`QUEUE-archive.md:188`, "The only song so affected").
3. **The seating.** Nothing new. `+page.svelte:3240-3243` fills the Input; `seatScoreWords` seats. Confirm on the real page that the Input holds the print's words and the seats match stage 1's count for that song, in headless Chrome on row 93's harness pattern.
4. **The mixed default** (`OPEN.md:2758-2765`): with no poem given, every element is the print's, spelling modernized by `modernisePreReform` only where it returns a form (sound unchanged); where it returns null the letters stay as read. Capitals and word breaks as read. Punctuation as read. The poet's punctuation and the composer's repeat are stage 3, because they need the poem beside the print.
5. **N.163.** A sewn word the dictionary does not hold, after modernizing, is still seated as read, and the transcription takes the path it takes for any unknown word today; before building, read `pipeline.ts` at the lines plan r4 names and report what that path does. Where it would print a gloss, stop and report; do not invent a mark (`CONTRACT.md:121`).
6. **The banner.** On a page that passed the threshold, `upload.banner.noLyricsScan` does not apply (the score now carries words, so `no-lyrics-found` does not fire). `upload.banner.reader`'s last sentence becomes false on that page; section 8 lists the string as owed. Until Dann ratifies the new text, the reader ships with the feature behind a flag the singer cannot see (DESK DEFAULT: an address query, as `?reader=ilya` is, `apps/web/src/lib/omr/scan.ts:25-27`), so nothing false reaches a singer.

Gates: the eight gates; the scan reader's own scores on the build songs do not move (run the scorer before and after on U1 to U6 and B1 to B10: the notes are untouched by this work, so any change is a defect); stage 1's seating count for each build song is reproduced on the real page within 2 syllables; no held-out song is opened; `static/` byte count reported before it lands.

Done when: on the real page in headless Chrome, with the flag on, each build song drops in, the Input holds the print's words, Markup draws them under the notes, and the count of syllables under the right note per song matches stage 1's report for the chosen reader within 2; and the report says, per song, the count and where it was taken (`CONTRACT.md:17`, `:24`). WRITTEN until Dann sees it; DONE is his look.

## 8. Strings owed to Dann

No new string ships in stages 1 or 2a. Stage 2b changes what is true, so these are owed to Dann before the flag comes off. French is his; the desk drafts, he rules (`CONTRACT.md:97`).

| Key | Today | What becomes false | Desk draft, English | Desk draft, French |
|---|---|---|---|---|
| `upload.banner.reader` (`i18n.ts:1021`), last sentence | "Ilya does not read the words printed in an image; type them into the Input field." | On a page whose words were read | "Ilya read the words printed under the notes; check them against your own paper, and type any Ilya left out into the Input field." | « Ilya a lu les paroles imprimées sous les notes; vérifiez-les sur votre propre partition, et saisissez dans le champ Entrée celles qu'Ilya aurait omises. » |
| `upload.banner.noLyricsScan` (`i18n.ts:1359`) | "Ilya does not read the words printed in an image. ..." | Only where the page failed the threshold; the sentence stays true there | No change proposed | No change proposed |

French words adopted from the file: « paroles imprimées », « vérifiez-les sur votre propre partition », « champ Entrée » (all at `i18n.ts:1021`). Coined by the desk: « qu'Ilya aurait omises ». Agreement checked: « celles » and « omises » agree with « paroles », feminine plural. The conditional « aurait » is the desk's choice for a hedge and is flagged for his ruling; the plain « a omises » is the alternative.

## 9. What is Dann's, and when it is brought

- **Stage 3's design:** how a read underlay and a typed poem reconcile (the poet's punctuation against the score's commas, `OPEN.md:2760-2761`; composer's repeats shown as differences, plan r4 §4, "The poem, when the singer has one"). `OPEN.md:2783` already names this as a design question for him. Brought one question at a time when stage 2b is WRITTEN, with a drawing.
- **A server-side read,** only if section 5's condition arises (money, his name).
- **The two strings** of section 8.
- Nothing else. Reader choice, seating rule, the threshold, the flag, and the stamp are the desk's, each marked DESK DEFAULT in the report.

## 10. The riskiest assumption

That a browser-loadable reader exists that reaches 9 of 10 syllables on real scans. The evidence today points the other way: the only model Ilya can load, (a), read 295 of 493 syllables on four clean engravings (row 81), the best Tesseract model does not load on Ilya's core (row 81, section 2), and the one reader that read well is 1.3 GB and runs on a GPU (row 88). Row 82's model is the open bet. Stage 1 measures all of them on the same frame, so the report says which of three outcomes we are in: a browser reader suffices; it suffices for modern print (B1 to B10) and not pre-reform; or none does, and the question of a server goes to Dann.

## 11. Report shape, every stage

1. The answer first: one sentence per question the stage asked, with the count and where it was taken.
2. The tree: branch, commit, what the working tree held that you did not make.
3. Each measurement: expectation written before, likeliest failure written before, result, and the script that printed it.
4. Departures from the brief, each with its reason and whether it is reversible.
5. Could not establish (section 12's rule).
6. The files.

## 12. What you could not establish

NOT ESTABLISHED beats a complete invented answer.

Write every gap here, with what you tried. Known at briefing, for the first report to close or carry:

- Whether the port's RapidOCR recognizer carries Cyrillic (section 2, leads).
- Whether `Cyrillic` best, or any float model, loads on tesseract.js's core in Chrome (row 81, section 2).
- Whether Dann's engravings match the *Sunless* and Kabalevsky scans in key and edition; where they differ, the scan decides (`OPEN.md:2806`).
- How far `imgpos` sits from the printed head over a whole song (row 80, "Could not establish").
- What the Transcription pipeline does with a word the dictionary does not hold (plan r4 names `pipeline.ts:266`, `:544-571`; not read for this brief).
- Whether a chunk holding two syllables run together can be split by a cut at a hyphen (row 88, last item).
- Which pages of each build song pass the threshold of section 5 with each reader; the number this brief calls a DESK DEFAULT is a placeholder until stage 1 prints it.
