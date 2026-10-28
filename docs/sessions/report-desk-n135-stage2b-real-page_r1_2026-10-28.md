# Report: N.135 stage 2b on the real page, 18 build songs (helper, 2026-10-28, r1)

Measure only. Nothing in the clone was committed, and no git write command was run. The one source edit I made (a supplemental run, section 3) was reverted by restoring the original file; `git status` shows only the untracked `apps/web/omr-underlay/` folder I created to hold the model for the copy script. No artifact was published. Code under test: `/root/lane19`, branch `cloud-lane-19`, head `383187a`.

## The answer first

1. **As shipped, the page reader writes words on 5 of 18 songs.** B01, B08, M, U1, and U4 pass the song gate; the other 13 songs get no `<lyric>` at all, because one page of each has a system in which no row is classed Russian ("system N has no Russian row"). On the 5 written songs the app reads 446 of 550 printed syllables right (harness, same 5 songs: 470), seats 401 of 490 syllable notes exactly (b) (harness: 426), 427 under (a) (harness: 456), and 169 under (c) (harness: 234).
2. **Over all 18 songs as shipped:** read right 446 of 2,538 (baseline 2,086); (b) 401 of 2,385 (baseline 1,831); (a) 427 (baseline 2,032); (c) 169 (baseline 1,166).
3. **With the gate bypassed (supplemental run, section 3):** read right 1,514 of 2,538 (baseline 2,086, minus 572); (b) 1,451 (baseline 1,831, minus 380); (a) 1,591 (baseline 2,032, minus 441); (c) 559 (baseline 1,166, minus 607). Of the 2,385 truth syllable notes, 1,451 are right, 410 carry the wrong text, 438 were mapped to an app note with no lyric, and 86 could not be mapped.
4. **The control 1 expectation failed** (read right within 20 of 2,086; (b) within 40 of 1,831). The likeliest failure I named, `cutRows` cutting rows differently from `rows2/`, is not established as the cause (section 2).
5. **Time:** 10,180 s from drop to MusicXML for the 73 pages, 139 s a page; homr alone was 136 s a page (9,929 s for 73 pages); the words reader's own work was 9.6 s a page on average (72 page reads, median 9.0 s, longest 23.1 s: about 4.8 s in the Worker and 4.7 s in the reader). The brief expected homr near 96 s a page.

## 1. Controls

Written before the build and before any song (`controls-before-measure.md`, 2026-10-28T12:10Z).

**Control 2, positive control of the scorer, passed.**

- *Seating credits.* The harness's own seated data is step1c configuration 2 (hybrid cut, free notes, drop) on the `f6-h32-B` readings with boxes mapped back to page pixels. I rebuilt that: the harness copy plus `map_boxes.py`'s arithmetic done from `crop-geometry.json` (the crops are not in this container; `scorer/map_f6.py`). The harness reproduced its numbers exactly: (b) 1,831, (a) 2,032, (c) 1,166 of 2,385 (`scorer/log-step1c-f6m.txt`, second table). I then passed that seated data to my own credit functions (`scorer/credits.py`, written from `lever2.py` and `step1b.py`) and they gave n 2,385, (b) 1,831, (a) 2,032, (c) 1,166: **REPRODUCED** (`scorer/ctl-seating-output.txt`). My first (c) gave 1,232, 66 too many, because I had left out the check that the seated word is the one-to-one aligned instance of the truth word (`step1b.c_new`'s `WA` test); with it, 1,166.
- *Read right.* `score117.py` unchanged on `ocr2-f6-h32-B` gives 2,086 of 2,538. My read-right function aligns the whole song's printed syllables with the whole song's tokens (the app has no rows), where the harness aligns row by row. On the harness's own tokens, per song, mine gives **2,072** against 2,086: a bias of minus 14 (0.6 percent) from the coarser alignment, in the app's disfavour (`scorer/ctl_readright.py`).
- *Note mapping.* The mapper (`scorer/mapper.py`) matches truth notes to a reading's notes by pitch class and order, with a bar-offset bonus. Run on the earlier homr reading's notes (`notes/<L>.json`), it mapped 2,609 of 2,706 truth notes, and 2,567 of those agree with the harness's own `match`; 41 disagree (repeated pitches, mostly T 16, S 6, B10 6). Pitch is compared modulo 12 because the U songs' reading is an octave away from the truth. This is the part of my scorer with no exact reproduction: agreement is 98.4 percent of mapped notes.

**Control 1, the expectation, failed.** I expected read right within 20 of 2,086 and (b) within 40 of 1,831. I got 446 and 401 as shipped, and 1,514 and 1,451 with the gate bypassed. The likeliest failure I named was `cutRows` cutting lyric rows differently from `rows2/`. What I can show about it: the app reports about twice the rows the harness has (B01: 36 rows in 12 systems against 18 rows in `rows2/`; B08 38 against 15; U1 29 against 18), but those counts are not comparable like for like (the app's count may include rows the harness drops), and B01, with the larger row count, scores the same (b) as the harness (132). So I do not establish `cutRows` as the cause. What the evidence does show is in section 4.

## 2. Setup and how the measure ran

- Install: `pnpm install --frozen-lockfile`; `fetch-omr-models.mjs` fetched homr's models; the three underlay files went to `apps/web/static/omr/models/underlay/` by `copy-underlay-model.mjs` (model md5 2ff2af3e33461cd64e7d2015ef21d10d, 7,827,478 bytes; core 3,899,472; worker 111,307: the byte counts the code report gives). Build: `pnpm --filter @ilya/web build`, exit 0. The driver ran on `vite preview` of that build, headless Chromium 153 (`/opt/pw-browsers/chromium-1243`, via `PW_CHROMIUM_PATH`), one song at a time, `--timeout-s 2400`, outputs kept per song in `out/<L>/`.
- All 73 pages were read by homr (`homr read N of N pages` on every song). 72 of the 73 pages have an underlay line; K has six pages and five lines (the missing one is not diagnosed).
- The machine has 2 cores and 7 GB. My scorer work ran on the second core during some songs, so the times carry that contention; I did not separate it.

## 3. Per-song table

"Shipped" is the main run, the app as built (gate on). "Gate off" is the supplemental run described below. For the 5 written songs the two runs are the same file. (b), (a), (c) are counts of the truth syllable notes that were mapped and carry a lyric match; unmapped notes count as wrong, the denominator is 2,385 (K and M have no syllable truth). Harness columns are the baselines from the brief, per song, from the reproduction in section 1.

| song | pages | s, drop to MusicXML | s per page | song gate (as shipped) | lyric tags shipped / gate off | read right shipped / gate off (of printed) | harness read right | syllable notes mapped (of truth) | (b) shipped / gate off | (a) shipped / gate off | (c) shipped / gate off | harness (b) / (a) / (c) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| B01 | 3 | 608 | 203 | written | 146 / 146 | 132 / 132 of 147 | 133 | 145 of 146 | 132 / 132 | 141 / 141 | 67 / 67 | 132 / 142 / 97 |
| B02 | 2 | 360 | 180 | page 2 does not pass (system 4 has no Russian row) | 0 / 80 | 0 / 69 of 86 | 81 | 89 of 146 | 0 / 66 | 0 / 74 | 0 / 23 | 67 / 71 / 56 |
| B03 | 4 | 580 | 145 | page 3 does not pass (system 2 has no Russian row) | 0 / 123 | 0 / 83 of 147 | 129 | 146 of 146 | 0 / 97 | 0 / 104 | 0 / 26 | 126 / 137 / 93 |
| B04 | 3 | 514 | 171 | page 1 does not pass (system 2 has no Russian row) | 0 / 94 | 0 / 50 of 148 | 122 | 145 of 146 | 0 / 65 | 0 / 73 | 0 / 21 | 113 / 128 / 59 |
| B06 | 3 | 498 | 166 | page 2 does not pass (system 2 has no Russian row; system 3 has no Russian row) | 0 / 101 | 0 / 58 of 142 | 105 | 140 of 140 | 0 / 73 | 0 / 87 | 0 / 36 | 93 / 117 / 50 |
| B07 | 5 | 756 | 151 | page 1 does not pass (system 2 has no Russian row) | 0 / 115 | 0 / 71 of 151 | 113 | 148 of 148 | 0 / 68 | 0 / 86 | 0 / 17 | 101 / 122 / 45 |
| B08 | 3 | 473 | 158 | written | 140 / 140 | 100 / 100 of 141 | 124 | 140 of 140 | 104 / 104 | 116 / 116 | 49 / 49 | 111 / 121 / 65 |
| B09 | 4 | 614 | 153 | page 1 does not pass (system 1 has no Russian row) | 0 / 128 | 0 / 103 of 139 | 120 | 140 of 146 | 0 / 95 | 0 / 105 | 0 / 38 | 111 / 126 / 88 |
| B10 | 3 | 503 | 168 | page 1 does not pass (system 1 has no Russian row; system 2 has no Russian row; system 4 has no Russian row) | 0 / 110 | 0 / 84 of 148 | 99 | 144 of 146 | 0 / 85 | 0 / 92 | 0 / 27 | 95 / 107 / 60 |
| K | 6 | 625 | 104 | page 1 does not pass (system 1 has no Russian row) | 0 / 94 | 0 / 49 of 131 | 119 | no syllable truth | n/a | n/a | n/a | n/a |
| M | 4 | 392 | 98 | written | 54 / 54 | 50 / 50 of 53 | 47 | no syllable truth | n/a | n/a | n/a | n/a |
| P | 3 | 458 | 153 | page 2 does not pass (system 1 has no Russian row; system 2 has no Russian row; system 3 has no Russian row; system 4 has no Russian row) | 0 / 54 | 0 / 4 of 177 | 109 | 169 of 172 | 0 / 34 | 0 / 37 | 0 / 3 | 127 / 153 / 67 |
| S | 7 | 844 | 121 | page 4 does not pass (system 2 has no Russian row) | 0 / 105 | 0 / 87 of 109 | 102 | 114 of 114 | 0 / 85 | 0 / 86 | 0 / 57 | 96 / 99 / 90 |
| T | 6 | 799 | 133 | page 1 does not pass (system 2 has no Russian row) | 0 / 165 | 0 / 118 of 200 | 176 | 196 of 196 | 0 / 126 | 0 / 136 | 0 / 39 | 165 / 176 / 116 |
| U1 | 2 | 260 | 130 | written | 96 / 96 | 89 / 89 of 97 | 92 | 96 of 96 | 90 / 90 | 91 / 91 | 19 / 19 | 93 / 94 / 32 |
| U4 | 2 | 309 | 155 | written | 100 / 100 | 75 / 75 of 112 | 74 | 108 of 108 | 75 / 75 | 79 / 79 | 34 / 34 | 90 / 99 / 40 |
| U5 | 7 | 893 | 128 | page 1 does not pass (system 3 has no Russian row) | 0 / 234 | 0 / 185 of 258 | 216 | 239 of 251 | 0 / 169 | 0 / 187 | 0 / 68 | 216 / 231 / 149 |
| U6 | 6 | 693 | 115 | page 3 does not pass (system 3 has no Russian row) | 0 / 141 | 0 / 107 of 152 | 125 | 140 of 144 | 0 / 87 | 0 / 97 | 0 / 35 | 95 / 109 / 59 |
| ALL | 73 | 10180 | 139 | 5 of 18 written | | 446 / 1514 of 2538 | 2086 | 2299 of 2385 | 401 / 1451 | 427 / 1591 | 169 / 559 | 1831 / 2032 / 1166 |

**Supplemental run, a departure (section 7).** The song gate wrote words on 5 songs, which leaves too little to measure the read. I made a one-line edit in my clone (`applyUnderlay`, `const below = -1`, saved as `nogate.patch`), rebuilt, and re-ran the 13 songs the gate held back, into `out-nogate/`. Under that edit a page whose systems have no Russian row still gets words on the systems that do. Then I restored the file. These numbers are not what the app does today.

Mapping: 2,299 of the 2,385 truth syllable notes were mapped to a note of the app's MusicXML (96.4 percent); scores above count the unmapped 86 as wrong. Scored on mapped notes only, gate off: (b) 1,451 of 2,299 (63.1 percent), (a) 1,591 (69.2 percent), (c) 559 (24.3 percent). The harness baselines are 76.8, 85.2, and 48.9 percent of 2,385.

### Totals against the baselines

| measure | baseline | as shipped (5 songs written) | gate off (all 18) |
|---|---|---|---|
| read right, of 2,538 printed | 2,086 | 446 | 1,514 |
| seating (b) exact, of 2,385 | 1,831 | 401 | 1,451 |
| seating (a) nucleus, of 2,385 | 2,032 | 427 | 1,591 |
| seating (c) word-exact, of 2,385 | 1,166 (Mac 1,168) | 169 | 559 |

On the 5 written songs only: read right 446 of 550 (harness 470), (b) 401 (harness 426), (a) 427 (456), (c) 169 (234), of 490 syllable notes (M has none).

**What "read right" means here.** The app's lyric text is the engine's division of the words, not the print's. Read right aligns the printed syllables with the app's lyric syllables one to one and credits equal text after the harness's normalisation (`norm`: modernisePreReform, then fold). Where the engine cuts a word differently from the print (14.4 percent of multi-syllable words, per the code report), the printed syllables are not credited. A word-level count (a printed word credited when the app's whole word matches) gives 457 of 1,407 words, 639 of 2,538 syllables; it is low mainly because the app keeps `Те` and `бе` as separate words where the print joins them with a hyphen, which is also why (c) is low (`scorer/wordlevel.py`).

## 4. What the evidence says about the shortfall

- **The gate.** 27 of 72 read pages and 37 of 239 systems have a system with no row classed Russian (counted from the console lines). Under the shipped gate this holds back 13 songs.
- **With the gate off,** of 2,385 truth syllable notes: 1,451 right, 410 wrong text, 438 mapped with no lyric, 86 unmapped. The 438 are the systems the classifier did not seat, plus notes the seating left empty; the code does not tell me which, and I did not split them.
- **The text is worse than the harness's.** Sample of the app's Lyrics field for B04: `Когла на люго,у тратът все при ходят мне ум`. P's page 2 seated 0 syllables, and P reads 4 of 177. I did not establish why the same model gives weaker text here than in the harness; the app's preprocessing differs from the harness's `f6-h32-B` (deskew, 3x3 closing, ink height 32, paper padding), and I did not test that.
- **Unseated units:** 142 over the 72 page reads.

## 5. Vowelless lyric alone on a note

Notes where the app wrote a lyric with no vowel letter (а е ё и о у ы э ю я ѣ і ѵ) alone on a note, counted on the MusicXML as captured. **This MusicXML is captured before Ilya's arrival fold (`clitic-seat.ts`) joins these to their host after ingest, so the fold would take some of them; I did not run the fold.** Total **86 notes**: 15 on the 5 shipped songs, 71 on the 13 gate-off songs. Many are single consonants (в, т, к) the reader cut off a word, plus noise (`>РР`, `^ч`).

- B01 (3): «льй.», «Тът», «дъ!»
- B02 (5, gate off): «в», «К», «в», «к», «ньтх»
- B03 (9, gate off): «г"», «т», «т», «л», «т», «в», «в», «ь», «с»
- B04 (9, gate off): «тът», «д», «зъ:», «в», «дъ», «м», «л», «вс», «ст»
- B06 (3, gate off): «мъ,», «в», «т»
- B07 (8, gate off): «Тъ!», «м», «т», «ъ», «т», «т», «в», «д»
- B08 (6): «б», «мр», «в», «т», «т», «с»
- B09 (5, gate off): «в», «д», «в», «г», «т»
- B10 (4, gate off): «зътт», «т», «в», «В»
- K (1, gate off): «двтмъ»
- P (8, gate off): «н», «чн», «вн», «й», «т», «Т», «лм», «л!»
- S (1, gate off): «Въ»
- T (4, gate off): «м.», «дьь», «въ», «>РР»
- U1 (1): «Тнь»
- U4 (5): «дгв», «С», «^ч», «л», «Р»
- U5 (7, gate off): «мслв», «кз», «всж», «В», «Б», «в», «в»
- U6 (7, gate off): «С», «в», «в», «к», «З», «Б», «б»

## 6. Songs where the read failed or wrote no `<lyric>`

None failed to read: every song produced a MusicXML. 13 songs wrote no `<lyric>` in the shipped run; the console line is `[omr] underlay: page N does not pass (...), so the words are not written`:

- B02: page 2 (system 4 has no Russian row)
- B03: page 3 (system 2)
- B04: page 1 (system 2)
- B06: page 2 (systems 2 and 3)
- B07: page 1 (system 2)
- B09: page 1 (system 1)
- B10: page 1 (systems 1, 2, and 4)
- K: page 1 (system 1)
- P: page 2 (systems 1 to 4)
- S: page 4 (system 2)
- T: page 1 (system 2)
- U5: page 1 (system 3)
- U6: page 3 (system 3)

(The line names the first page that failed; other pages of the same song may also fail. The full lines are in `out/<L>/<L>.console.txt`.)

## 7. Departures from the brief

1. **Supplemental gate-off run** (section 3), not asked for. Reversible: one line, restored from a saved copy, patch kept. The shipped numbers are from the unpatched build, built first.
2. **The harness's reproduction needed a rebuild.** The crops are absent, so I mapped the `f6-h32-B` boxes back with `crop-geometry.json` (`map_f6.py`) and pointed the harness copy at `/root/lane19` for the normaliser and the engine cut. The reproduction was exact, so I take the rebuild as sound; the scripts changed are in `scorer/lever2*/`.
3. **Read right is song-level, not row-level** (section 1, minus 14 on harness data). **(c) uses a song-level alignment** for the word-instance check, where the harness aligns per row; the control reproduced 1,166 with the harness's per-row alignment, and I have no control for the song-level one.
4. **Mapping by pitch class,** because of the U octave difference; a wrong-pitched app note is unmapped, and its lyric is not scored.
5. **Background tasks are killed after their time limit** (30 minutes, then 2 hours). That killed the preview server and the runner twice: B04 (first attempt `no MusicXML`, re-run), U5 in the main run (first attempt `no MusicXML`, kept in `out/U5-first-attempt-no-musicxml/`, re-run), and U5 in the gate-off run (same, `out-nogate/U5-first-attempt-no-musicxml/`). The re-runs are the reported ones. The scored runs of those songs are whole.
6. **I started the preview server once with `&`** inside a subshell, in the first minute, before the work rule's wording sank in; I killed it and restarted it with `run_in_background`. No song ran on it.
7. **Timing carries contention** (section 2).
8. **`apps/web/omr-underlay/`** (the model, for the copy script) is an untracked folder in the clone; `static/omr/` is git-ignored.

## 8. What I could not establish

- **Why the read is weaker than the harness's.** I did not diff the app's crops against `rows2/`, so the `cutRows` hypothesis is neither shown nor ruled out.
- **Which of the 438 empty notes are unclassified systems and which are seating gaps.**
- **The effect of the arrival fold** on (b) and (a), and on the 86 vowelless notes.
- **Why K's sixth page has no underlay line.**
- **Whether the 98.4 percent mapper agreement hides errors in the app scoring** (the 41 disagreements on the harness's own data suggest a few repeated-pitch notes are credited to a neighbour; the effect on totals is not measured).
- **Whether homr's 136 s a page here, against 96 s in the code report, is the machine or the build.**
- **The harness's baselines on exactly the 2,299 mapped notes;** I compare counts out of 2,385, with unmapped counted wrong, which favours the baseline slightly.

## Files

`/root/n135-real/`: `controls-before-measure.md`; `out/<L>/` (shipped run: `.musicxml`, `.lyrics.txt`, `.console.txt`, `.requests.txt`, `times.json`); `out-nogate/<L>/` (supplemental); `scores/`, `scores-nogate/` (per-song JSON with per-note credits); `scorer/` (credits, mapper, controls and logs, `baseline-per-song.json`); `run.log`, `run-nogate.log`; `nogate.patch`; `underlay-song.ts.orig`.
