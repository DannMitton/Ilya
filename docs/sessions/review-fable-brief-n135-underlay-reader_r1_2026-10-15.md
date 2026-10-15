# Fable review of the N.135 underlay reader brief, r1

Reviewer: Fable 5.1, 2026-10-15. Brief: `/mnt/user-data/outputs/briefs/brief-code-n135-underlay-reader_r1_2026-10-15.md`. Checked against the clone of `Shane` at `14e2ff8` (clean working tree), the rapidocr 3.9.2 wheel fetched from PyPI this session (27,275,208 bytes, read for one file), and one request to `ilya.dannmitton.com`. No held-out song was opened; nothing on the Mac was touched.

## Verdict

SEND WITH AMENDMENTS. The brief's shape is right: stage 1 measures and keeps nothing that ships, the control rule is on four of its five measurements, the lanes match `CONTRACT.md:75`, no string ships before Dann rules, and the definitions of done are counts with places. Two findings change what stage 1 measures, and both are the kind that cost Code a day if sent as written: reader (p) cannot read Cyrillic at all and is not in Ilya's model set, and song P already has syllable truth in the tree. One finding changes stage 2b: joining the underlay stamp while the flag is on would spend the one silent re-read every saved scan gets, with no words to show for it. The rest is citation repair and one closed lead.

Two findings first, each one sentence, per `CONTRACT.md:15`:

1. The brief believes the port's RapidOCR recognizer is a shipped, cached, 32 MB browser candidate whose Cyrillic is a lead; it is now known that `PP-OCRv6_rec_small.onnx` (sha256 `6f327246…`, matching `third_party/homr-web/src/models/manifest.ts:1053`) carries an alphabet of 18,708 entries with zero Cyrillic code points (52 Latin letters, 15,565 CJK), and that Ilya never fetches the three OCR models (`apps/web/scripts/fetch-omr-models.mjs:18-19`: *"The OCR models are not fetched, because the reader always reads with OCR off"*; `https://ilya.dannmitton.com/omr/models/6f3272…/PP-OCRv6_rec_small.onnx` answered 404 this session), so reader (p) leaves stage 1 and section 12's first lead closes.
2. The brief believes P has no syllable truth (`truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json` "holds 0 `syllable` fields; read this session"); the file holds 172 `syllableText` and 172 `syllableType` fields, in the print's pre-reform spelling with its punctuation (19 syllables carry a mark; 35 carry ѣ, і, or ъ), including all four of Dann's walk findings («су», «е», «ты,»; «те», «бя» lower-case; «груст», «но», «я,», «груст», «но»; «зву», «читъ!»), so stage 1 scores P against that draft and Code types nothing for it.

## Citations

| Citation | Status |
|---|---|
| `OPEN.md:2773` "HOly shit" | CONFIRMED |
| `OPEN.md:2754-2767`, `:2758-2765`, `:2760-2761`, `:2771-2773`, `:2777`, `:2783` | CONFIRMED (2777 is the 2026-10-14 addendum's "Condition for departing" sentence) |
| `OPEN.md:2347-2375` (N.163), `:2353-2359` | CONFIRMED |
| `OPEN.md:3040-3046` (N.184) | CONFIRMED |
| `OPEN.md:2794` (no poem, 23:06), `:2806-2808` | CONFIRMED, and `:2810` matters (amendment 3) |
| `CONTRACT.md:9`, `:10`, `:15`, `:17`, `:19`, `:24`, `:25`, `:51`, `:75`, `:97`, `:121`, `:124`, `:130` | CONFIRMED |
| `homr-reader.ts:305` `ocr: false`; `:312` `deps.metres(...)`; `:94`; `:87-96`; `:379` `joinLookingAtPages` | CONFIRMED (file is 434 lines) |
| `metre-client.ts:1-9` Worker | CONFIRMED (`new Worker` at `:23`) |
| `join-pages.ts:435-439` `placeOf` | CONFIRMED |
| `musicxml-parser.ts:335-345`, `:343` `no-lyrics-found` | CONFIRMED |
| `+page.svelte:3240-3243` fills the Input | CONFIRMED; the condition is `origin === 'upload' && !noLyrics && doc.inputText.trim() === ''` |
| `score-seat.ts:78-124`, `:114` punctuation | CONFIRMED |
| `vowel-resolver.ts:243` `collectScoreWords`; `:157` `CYRILLIC_VOWEL` with ѣіѵ | CONFIRMED |
| `ingest.ts:85-86` `noLyricsNoticeKey` | CONFIRMED |
| `i18n.ts:1021` `upload.banner.reader`; `:1359` `upload.banner.noLyricsScan` | CONFIRMED, English and French as quoted; « champ Entrée » occurs once in the file, at 1021 |
| `stamp.ts:18-23`, `:7-9`, `:23` | CONFIRMED |
| `pre-reform-normalizer.ts:244` | CONFIRMED |
| `scan-scorer.ts:59`, `:111` `align`, `:209` `scoreScan` | CONFIRMED |
| `ground-truth.ts:46-48` | CONFIRMED |
| `ENVIRONMENT.md:4567` truth files Mac only; `:4624` qpdf cut | CONFIRMED; the cut at 4624 is `1-2,9-23` for songs 1, 4, 5, 6 and predates the openings of *Sunless* 3 and 2 |
| `tools/e16-harness/.gitignore:2` `output/` | CONFIRMED |
| `third_party/homr-web/README.md:101-105`, `:170-172`, `:202` | CONFIRMED; the three OCR files sum to 31,749,509 bytes |
| `scan.ts:25-27` `useIlyaReader` | CONFIRMED |
| `old-reader-seats.ts:102` as the order rule | WRONG: line 102 is `export const RAW_REACH = 60;`. The order rule is pass 1 at `:165-175` (`settle(bar, seats, targets.length, 'order', ...)` at `:175`), described in the header at `:19-29` |
| `QUEUE-archive.md:188` (row 93, the walk, "The only song so affected", 172 of 172) | CONFIRMED, all four walk findings as the brief states them |
| `QUEUE.md:13` row 82 r3 | CONFIRMED |
| `plan-scan-reader_r4_2026-10-01.md:47`, `:87`, `:99` | CONFIRMED; the "no confident non-word" clause is `OPEN.md:2796` and plan r4 section 2, not line 47 |
| `measure-set3-four-below_2026-10-11/run.py:12-14`, `:55-57` | CONFIRMED |
| row 81 report `:24` rows rule; sections 1, 2, 4, 5, 7; 295, 309, 315 of 493; 54 of 55 with 2 false; 5 of 55; `diag7.txt` | CONFIRMED |
| row 88 report: 385, 390, ѣ 21 of 21, revision `d5563063…`, 1,339,228,897 bytes, 0.40 s a chunk, 50 of 69 share a token | CONFIRMED |
| `memo-desk-truth-from-finale_r1_2026-10-02.md:36` page map | CONFIRMED (song 2 pages 3 to 4, song 3 pages 5 to 8) |
| `truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json` holds 0 syllable fields | WRONG: 172 `syllableText`, 172 `syllableType` (finding 2) |
| `apps/web/src/lib/omr/fixtures/tch-3.musicxml`, two parts, no lyrics | CONFIRMED (2 `<part `, 0 `<lyric`, 344 `imgpos`) |
| `docs/sessions/row93-rekey_2026-10-13/` `bars.md` and `repro.mjs` | `repro.mjs` is at the folder root; `bars.md` is at `out/bars.md` |
| `pipeline.ts:266`, `:544-571` (lead) | CLOSED this session: `isKnownWord` is `:264-266`; the modernization gate is `:544-571` (amendment 5) |
| `pipeline.ts` the unknown-word path (lead) | CLOSED: no stress data gives `-2`, all vowels cardinal (`:670`); the gloss is `''` where the lookup misses (`:734`) |
| RapidOCR's Cyrillic (lead) | CLOSED: none (finding 1) |
| `+page.svelte` 6003 lines, ceiling 6003 | CONFIRMED (`scripts/ratchets.json:8`) |

## Lanes and start conditions

| Stage | Lane in the brief | Review | Start condition |
|---|---|---|---|
| 1 | Mac | Right. Truth files (`ENVIRONMENT.md:4567`), scans, the P draft in the tree, and MPS for (t-imap) | May start now under `CONTRACT.md:25`, with amendment 12's split: every CPU part now; the (t-imap) run after row 82 releases MPS, or on CPU with its seconds reported |
| 2a | Cloud lane, Sonnet | Right under `CONTRACT.md:75` (one dedicated branch, no PR, Dann merges, credit free until 2026-11-05). It writes under `apps/web/src/lib/omr/`, the scan reader's folder; the ruling's reason (WebGPU, scans, truth on the Mac) is untouched by pure modules on fixtures. The report says so in one line | After this review is applied |
| 2b | Mac, Opus | Right. Needs the scans, the real page, and Dann's Mac for `static/` bytes | After stage 1's report and section 5's decision |
| 3 | Not briefed | Right; `OPEN.md:2783` names it Dann's | Dann |

No held-out song is named: S, T, K, and M are letters resolved by `run.py:12-14`, and the exclusions file is read first. The brief names `~/Downloads/_desk-heldout3-private/` only to forbid it beyond `four.json`'s four files.

**Row 82 and the Mac.** Row 82's training holds MPS. Stage 1 needs MPS for one reader, (t-imap), and for nothing else: (a), (c), and (d) run on Node's CPU core, the rows and seating are Python, and the raster is headless Chrome against the dev server. So stage 1 can share the Mac now for everything but (t-imap), and the brief says so nowhere. Two things to add: Code asks what is running before starting the dev server (the brief has this, `CONTRACT.md:51`) and before starting any Python that imports `torch`, because a second MPS process beside the training is the one way stage 1 can slow or break row 82; and (t-imap) either waits for the training to end or runs with `device='cpu'` and reports its seconds a chunk beside row 88's 0.40 (NOT ESTABLISHED what CPU costs on 1.3 GB float32; row 88 measured MPS only). Amendment 12 writes it.

## Stage 1 is measure-only

Yes. It writes a folder under `docs/sessions/`, as row 81 did, and nothing under `apps`, `packages`, `third_party`, or `static`; the gate at 4.6 checks that. It runs homr on Ilya's path without tuning it. The one thing it changes on the Mac is model files outside the tree, each with size and md5 in the report, and no new download without Dann's yes. Under `CONTRACT.md:25` it may start while this review runs; amendment 12 says which parts.

## The control rule

Present at 4.1, 4.2, 4.3, and 4.4, each with an expectation and a likeliest failure written before the run. Absent at 4.5 (amendment 8).

## The mixed default and the 2026-10-14 addendum

Stage 2b item 4 follows the table at `OPEN.md:2758-2765` for capitals, word breaks, punctuation, and which words, and defers the poet's punctuation and the composer's repeat to stage 3 with the reason (they need the poem). One departure: it has the reader modernize spelling by `modernisePreReform` alone, where the tree's rule is stricter and already built. `pipeline.ts:544-571` modernizes at intake only when the modernized form is a word Ilya knows (Dann 2026-08-08, quoted at `:548-552`), keeps the engraver's form in `preReformSource` (`:570`), and abstains on a form still carrying an abolished letter (`:572-579`). A reader that writes a modernized `<lyric>` would hand the pipeline a word it cannot see as pre-reform, and the Input would hold text the print does not. Amendment 5 writes `<lyric>` as printed and leaves modernization where it is. That also keeps the kept reading as the print, which the 2026-10-14 addendum's default is.

## Strings and French

No new string in stages 1 or 2a. Stage 2b ships behind an address flag with no string. Section 8 lists one string owed to Dann with an English and a French draft, French built from the file's own words at `i18n.ts:1021` (the three adopted phrases are there, verbatim) and one coined phrase named, agreement checked against « paroles ». Nothing French is written into the tree. Right.

## Gates and ratchets

The brief names "the eight gates" without numbers. At `14e2ff8` they are: phonology 251, dictionary 248, web-check 0 errors and 12 warnings, web-test 2512 (`report-code-rows90-94_r1_2026-10-14.md:61`; `gates-scratch.sh:78` still says 2433 and is stale), score-parser 675 passed and 5 skipped, blurb 145, integration 55, ratchets OK. Amendment 11 writes them in.

Ratchets that this work touches (`scripts/ratchets.json`, `scripts/ratchets.mjs:9-10`): `+page.svelte` 6003 of 6003 lines, zero headroom, and the brief touches it in no stage; `pipeline.ts` 1064 of 1065, one line of headroom, and stage 2b item 5 reads it only; `musicxml-parser.ts` 1168 of 1168, zero headroom, and `writeLyrics` lives in `omr/`, not the parser; `homr-reader.ts` has no ceiling (434 lines; the 1000-line limit for unlisted files applies), so stage 2b's `underlay?:` dependency fits. New `omr/` files are under 1000 lines each or they breach. `omr/` is not one of the six modules at `ratchets.mjs:78-85`, so the module table does not bind it; the `SURFACE` check does, so a new file imports `@ilya/dictionary` by package name or, better, takes `isKnownWord` as a function (amendment 6).

## Amendments

### 1. Section 2 and 4: strike reader (p); close the lead

Replace the last bullet of "Established" in section 2 with:

> - The port carries its own OCR, three RapidOCR models of 31,749,509 bytes (`third_party/homr-web/README.md:170-172`), loaded unless `ocr: false` (`:101-105`), used for chord and title strips (`:202`). Ilya does not fetch them (`apps/web/scripts/fetch-omr-models.mjs:18-19`: "The OCR models are not fetched, because the reader always reads with OCR off"), and the recognizer, `PP-OCRv6_rec_small.onnx` (sha256 `6f327246b50388f3c176ae304bd95767ea6dc0c9ae92153ef8cbe210b3c14884`, `manifest.ts:1053`), carries an alphabet of 18,708 entries with no Cyrillic letter: 52 Latin letters, 15,565 CJK, read from the model's `character` metadata (`third_party/homr-web/src/ocr/ctc.ts:13-17` names the key) in the rapidocr 3.9.2 wheel on 2026-10-15. It is not a reader for this item.

Delete the first lead in section 2 ("Which character set the port's RapidOCR recognizer...").

Delete row (p) from the readers table in section 4, and delete the first bullet of section 12 ("Whether the port's RapidOCR recognizer carries Cyrillic").

### 2. Section 4, the songs table: P has syllable truth

Replace P's row with:

> | P | Tchaikovsky op. 38 no. 3 | `~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf` (md5 `3d3d4684a1180bd4d4904ccbaca15bfb`, the draft's own `sourcePdfMd5`) | `docs/sessions/truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json`, in the tree: 172 notes with `syllableText` and `syllableType`, in the print's pre-reform spelling with its punctuation; status "DRAFT r2, read by the desk by eye from the scan; not proofed by Dann" | Russian only, pre-reform |

In 4.4, replace the paragraph beginning "On P, where no syllable truth exists" with:

> On P, score against the draft above and say in every P line that the truth is the desk's draft, not proofed by Dann. The draft already holds the four findings of Dann's walk: «су», «е», «ты,» (the comma after «суеты», bar 16); «те», «бя» lower-case; «груст», «но», «я,», «груст», «но» (bars 77 to 78); «зву», «читъ!». Report each of the four by name: the reader's token, the seated note, and whether both match the draft. Where the reader and the draft disagree, look at the print and say which is right; a draft error goes to the report's "Could not establish" with the bar.

In 4.7, "plus the four walk checks on P" stays.

### 3. Section 4: *Sunless* 2 is a build song

`OPEN.md:2810`: Dann 2026-10-06 19:26, *"yes"* to opening *Sunless* 2; *"They are build songs from that minute."* The brief's U1, U3 to U6 and its "so song 2's pages are never rendered" rest on `ENVIRONMENT.md:4624`, whose cut (`1-2,9-23`) predates both openings. Replace the *Sunless* row's letter cell with `U1 to U6` and its scan cell's page note with "all 23 pages, per `memo-desk-truth-from-finale_r1_2026-10-02.md:36`", and replace the sentence "Cut a build-only PDF for *Sunless* with `qpdf`, as `ENVIRONMENT.md:4624` shows, so song 2's pages are never rendered." with:

> Every *Sunless* song is a build song (`OPEN.md:2807`, `:2810`). Read `~/Downloads/_desk-heldout-exclusions_2026-10-12.md` first; if it lists any *Sunless* song, cut it out with `qpdf` as `ENVIRONMENT.md:4624` shows and say so in the report. The held-out set today is set 4 (`OPEN.md:2810`, last bullet): IMSLP songs Dann does not know, in `~/Downloads/_desk-heldout4-private/`, which you do not open.

### 4. 4.4 rule 2: the citation

Replace "(row 93's order rule, `apps/web/src/lib/score/old-reader-seats.ts:102`, applied to boxes instead of old seats)" with "(row 93's order rule, pass 1 at `apps/web/src/lib/score/old-reader-seats.ts:165-175`, described at `:19-29`, applied to boxes instead of old seats)".

### 5. Stage 2b item 4: write the print; modernization stays in the pipeline

Replace item 4 with:

> 4. **The mixed default** (`OPEN.md:2758-2765`): with no poem given, every element is the print's. `writeLyrics` writes each syllable as read, pre-reform letters and all; it does not modernize. Modernization is already built where the dictionary disposes: `pipeline.ts:544-571` adopts `modernisePreReform`'s form only when that form is a word Ilya knows (Dann 2026-08-08, quoted at `:548-552`), keeps the engraver's form as `preReformSource` (`:570`), and abstains on a form that still carries an abolished letter (`:572-579`). So the Input holds the print, the page shows the modern form where Ilya knows it, and the syllable count holds because `CYRILLIC_VOWEL` counts ѣ, і, and ѵ (`vowel-resolver.ts:157`). Capitals, word breaks, and punctuation as read. The poet's punctuation and the composer's repeat are stage 3, because they need the poem beside the print.

Replace item 5 with:

> 5. **N.163.** A sewn word the dictionary does not hold is still seated as read. The pipeline's path for it, read 2026-10-15: no stress data gives stress `-2` and every vowel cardinal (`pipeline.ts:670`), and the gloss is empty (`:734`). So an unknown word reaches the singer without a gloss, which is the abstention section 1 describes. A misread that lands on a word the dictionary holds is not caught by anything in the tree (N.163's own finding, `OPEN.md:2367-2368`: "A majority test cannot catch a single wrong word"); the harness's "no confident non-word" count in stage 1 does not cover it, and the report says so in one line. Do not invent a mark (`CONTRACT.md:121`).

In section 1, replace "Where a word is read that Ilya cannot vouch for, she sees it as printed and the transcription abstains on it, the way the engine abstains on a word it does not know; she never sees a confident gloss on a misread word (N.163, `OPEN.md:2353-2359`)." with:

> Where a word is read that the dictionary does not hold, she sees it as printed, with no gloss and no stress mark (`pipeline.ts:670`, `:734`). A misread that is itself a dictionary word reaches her with that word's gloss; nothing in the tree catches it today (N.163, `OPEN.md:2353-2368`), and stage 1 counts how often each reader produces one.

### 6. Stage 2b item 1: the dictionary seam, and the Worker

In item 1, replace "language by `rowLanguage` with `packages/dictionary`" with "language by `rowLanguage` with `isKnownWord` from `pipeline.ts:264-266` passed in as the function, on the pattern of `ocr-guard.ts:59` (`unknownWordShare(text, isKnownWord)`); `pipeline.ts:9-11` names itself the only importer of `@ilya/dictionary`, and `scripts/ratchets.mjs` breaches a relative import into `packages/`".

Append to item 1:

> `tesseract.js`'s `createWorker` makes its own Worker. Do not nest it inside a second Worker on `metre-client.ts`'s pattern unless you have measured that the nested form loads in Chrome; say which form you built and why. The band cutting and seating are pure and can run anywhere.

### 7. Stage 2b item 2: the stamp waits for the flag

Replace "and `READER_STAMP` (`stamp.ts:23`) gains the underlay reader's version, so every stored scan reading is read again once, silently where the song has no hand work (`plan-scan-reader_r4_2026-10-01.md:87`)." with:

> `READER_STAMP` (`stamp.ts:23`) does not change while the feature is behind the flag: a stamp change spends the one silent re-read every stored scan gets (`stamp.ts:7-9`; `plan-scan-reader_r4_2026-10-01.md:87`), and with the flag off that re-read would carry no words and never come again. `UNDERLAY_READER` joins `READER_STAMP` in the commit that removes the flag, after Dann's ruling on section 8's string. Say in the report which commit that will be and how many of Dann's songs it re-reads.

### 8. 4.5: the control rule, and section 10's wording

Append to 4.5:

> Control rule: the desk expects (a) to load through `createWorker` in headless Chrome as it does on Ilya's poem path today (`ScoreUploader.svelte`, the OCR path), and (c) to fail in Chrome as it failed under Node (`Aborted(missing function: _ZN9tesseract13DotProductSSEEPKfS1_i)`, row 81, section 2), because tesseract.js 7.0.0 picks the same relaxed-SIMD core where the browser offers it; the likeliest failure of the expectation is that Chrome's core choice differs from Node's and (c) loads, which would change section 5's browser reader. Report the core each run picked, by its file name.

In section 10, replace "the best Tesseract model does not load on Ilya's core (row 81, section 2)" with "the best Tesseract model aborts on the core tesseract.js picks under Node, and the browser is NOT ESTABLISHED until 4.5 runs (row 81, section 2)".

### 9. 4.2: build the transcription from the truth, then correct it to the print

Replace the first paragraph of 4.2 with:

> For each song with a truth, write the transcription from the truth's `syllableText` in note order (U1 to U6 and B1 to B10 from `tools/e16-harness/output/truth/`; P from the draft; S and T from row 81's `poem.txt`), then correct it to the print from Ilya's raster: the row breaks, the hyphens as printed, capitals, punctuation, and the pre-reform letters where the truth's spelling is modern (whether Dann's engravings are in modern or pre-reform spelling is NOT ESTABLISHED in the tree; say what you found, per song). Mark every correction, so the report can say how many syllables differ between the truth and the print and where. For K and M, which have no syllable truth, row 81's `poem.txt` stands as the transcription.

In the songs table, change B1 to B10's last cell to "NOT ESTABLISHED: the desk has not opened their pages (`OPEN.md:2808`); report the languages printed", and add to 4.1's control rule: "The desk has not opened B1 to B10's pages; if an English row is printed beside the Russian, 4.3's decisions measure it."

### 10. Section 2, leads: paths

Replace "Row 93's `bars.md` and `repro.mjs` (`docs/sessions/row93-rekey_2026-10-13/`)" with "Row 93's `docs/sessions/row93-rekey_2026-10-13/repro.mjs` and `out/bars.md`".

### 11. Gates and ratchets, by number

Replace, in section 6, "the eight gates named in `QUEUE.md` as every row runs them; `+page.svelte` untouched at its ceiling (row 93 report: 6003 lines)" with:

> the eight gates at their `14e2ff8` numbers: phonology 251, dictionary 248, web-check 0 errors and 12 warnings, web-test 2512 (`report-code-rows90-94_r1_2026-10-14.md:61`), score-parser 675 passed and 5 skipped, blurb 145, integration 55, ratchets OK; a web-test rise is the new tests, counted in the report. Ratchets (`scripts/ratchets.json`): `+page.svelte` is at its ceiling of 6003 and is not touched; `pipeline.ts` is at 1064 of 1065 and is not touched; `musicxml-parser.ts` is at its ceiling of 1168 and is not touched (`writeLyrics` lives in `omr/`); each new `omr/` file stays under 1000 lines (`ratchets.mjs:9-10`); `homr-reader.ts` (434 lines) has no ceiling.

In section 7's gates line, replace "the eight gates" with "the eight gates at the numbers in section 6, plus whatever stage 2a added".

### 12. Section 3: stage 1 beside row 82

Replace "Stage 1 does not wait for anything." with:

> Stage 1 starts now, beside row 82's training on the Mac, for everything that does not touch MPS: the raster, rows, transcription, readers (a), (c), and (d), the language decisions, the seating, and the cost run in headless Chrome. Before starting the dev server or any Python that imports `torch`, say what is running on the Mac (`CONTRACT.md:51`) and leave row 82's process alone. The (t-imap) run waits until row 82's training releases MPS, or runs on `device='cpu'` with its seconds a chunk reported beside row 88's 0.40 on MPS; say which. Nothing in stage 1 writes where row 82 writes.

## What the brief forbids or invites, checked

- No new string ships in stage 1 or 2a; stage 2b's flag is an address query with no string. The one owed string is in section 8 with its French draft, built from `i18n.ts:1021`, and nothing French reaches the tree. Right.
- No model goes into the tree; stage 2b tells Dann the `static/` byte count before language data lands (`CONTRACT.md:130`). Right.
- No git by agents beyond the cloud lane's one branch. Right.
- Dann hears three things: stage 3's design, a server-side read if section 5's condition arises, and the string. Reader, rule, threshold, flag, and stamp are DESK DEFAULT. Right under `CONTRACT.md:9-10`.

## What I could not establish

- What CPU inference on `taiga75/ru-trocr-1700s` (1.3 GB float32) costs a chunk on Dann's Mac. Row 88 measured MPS only.
- Whether Dann's *Sunless* and Kabalevsky engravings are in modern or pre-reform spelling. The truth files are on the Mac only; amendment 9 has Code report it.
- Whether Kabalevsky op. 52's scans print English beside the Russian. The desk has not opened them (`OPEN.md:2808`).
- Whether tesseract.js 7.0.0 in Chrome picks the relaxed-SIMD core that aborts (c), or another. 4.5 measures it.
- Whether `createWorker` runs inside a dedicated Worker. Amendment 6 has Code say which form it built.
- Whether `~/Downloads/_desk-heldout-exclusions_2026-10-12.md` lists any *Sunless* song. It is on the Mac; amendment 3 has Code read it first.
- Whether `GraysonEngine.lookupStress` folds ё; `pipeline.ts:562` says it strips punctuation and lowercases. Stage 2a's `rowLanguage` takes the function as given.
