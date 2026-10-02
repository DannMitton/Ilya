# Brief for Code: the baseline, song by song

**Written by:** the desk (Fable), 2026-10-02 about 09:25. **This is the whole brief for `QUEUE.md` row 22.** **Serves:** THE ONE THING in `docs/memory/STATE.md`: a scan in, a melody out, IPA seated under it and Russian seated under that. It is phase 0 of `plan-scan-reader_r4_2026-10-01.md`, which the desk skipped and Dann ordered started on 2026-10-02 at 08:50. **Runs on the tree after row 21 ships.** It changes no reader code and no product code.

**This brief follows `BRIEF-TEMPLATE.md`. It has no slot for a cause, and none is given.**

**What the singer gets from it.** Nothing on the page today. It tells Dann and the desk, for each song, how many printed notes Ilya has, at the right pitch, with the right length. The next reader brief is then chosen by the largest loss, and every later brief is scored against the same table.

---

## 1. What was observed

- **Every number so far is from one song,** the Tchaikovsky, against a count of heads by the desk's eye. Pitch and length have never been scored on a scan.
- **Truth now exists for the six *Sunless* songs,** taken from Dann's own engravings: every note's bar, pitch, written length, and syllable (`memo-desk-truth-from-finale_r1_2026-10-02.md`). The files are on the Mac at `tools/e16-harness/output/truth/`, git-ignored.
- **The scan is `~/Downloads/IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf`,** 23 pages, Russian over German. A lead, from the desk's look at every page at 40 dpi: song 1 is pages 1 to 2, song 2 pages 3 to 4, song 3 pages 5 to 8, song 4 pages 9 to 10, song 5 pages 11 to 17, song 6 pages 18 to 23. Each song starts a page.
- **Dann, 08:56:** *"whether each of your engravings matches its scan in key and in edition, I can't say. HUman error in data entry is possible :)"*
- **The harness's truth path failed under plain Node** in the desk's workspace (Node 22.22.0): `ERR_MODULE_NOT_FOUND ... packages/score-parser/src/pickup`, imported with no extension by `mnx-parser.ts`. It ran through `npx tsx`.
- Page 1 of the Tchaikovsky reads 9/8 for a printed 3/8 (`report-code-staves-traced-and-straightened_r1_2026-10-01.md`, item 4).

## 2. What is established, each line carrying its `path:line`

Read by the desk 2026-10-02.

- The harness's scorer matches a recognized note to a truth note by nearest onset within `ONSET_TOLERANCE = 0.2` whole notes (`tools/e16-harness/src/scorer.ts:41`, `:112-140`). It places the recognizer's onsets on the truth's own bar timeline and so assumes the two number their bars alike (`scorer.ts:27-33`).
- A truth note holds `measureIndex`, `onset`, `duration`, `midi`, `syllableText`, and `syllableType` (`tools/e16-harness/src/ground-truth.ts:28-49`).
- A reader event holds `id`, `type`, `measureIndex`, `onset`, `duration`, `midi`, `midiAssumedNatural`, and `abstain` (`apps/web/src/lib/reader/recognized.ts:29-50`). A reader bar holds its `metre` (`recognized.ts:52-62`).
- The app gives the reader the clef, the key, and the octave change, and no list of voice staves (`apps/web/src/lib/reader/page-reader.worker.ts:197-203`).
- Your own `measure-company_r1_2026-10-02/appworker.mjs` reads a PDF on the app's own path and returns the reader's events.
- What each truth file holds, read from the files:

| Song | Role | Clef in the file | Key | Bars | Notes | Rests |
|---|---|---|---|---|---|---|
| *Sunless* 1 | Build on | F4 | 2 sharps | 18 | 96 | 19 |
| *Sunless* 4 | Build on | G2 | 2 sharps | 29 | 116 | 29 |
| *Sunless* 5 | Build on | G2, an octave down | none | 61 | 258 | 48 |
| *Sunless* 6 | Build on | G2, an octave down | 7 sharps | 55 | 161 | 26 |
| *Sunless* 2 | Test only | G2, an octave down | 2 sharps | 12 | 68 | 13 |
| *Sunless* 3 | Test only | G2, an octave down | none | 41 | 222 | 40 |

## 3. Measure. This brief is all measurement

1. **A scorer that fits a scan.** Add it beside the present one, in `tools/e16-harness/src/`, and leave `scorer.ts` as it is.
   - It lines up the reader's events and the truth's events as two sequences in order, and allows a missing event and an extra event. It does not match by bar number or by onset, because on a scan both can be wrong.
   - **Pitch is right** when the MIDI numbers are equal after one octave shift for the whole song. Choose the shift (0, 12, or 24 semitones, up or down) that gives the most equal pitches, and report it. Count a note whose pitch abstained apart, and say how often `midiAssumedNatural` would have been right.
   - **Length is right** when the written length is the same fraction. No tolerance.
   - For each song it reports: bars in the truth and bars read; truth notes, notes read, matched, missing, and extra; of the matched, pitch right, length right, and both right; rests in the truth, read, and matched; abstentions by kind; the metre the reader gives each bar beside the truth's bar length; and the bars in which every event is right.
   - **The headline, in the plan's own terms:** of every 100 printed notes, how many are present with the right pitch and the right length.
   - Syllables are not scored yet. The reader carries none.
   - Prove it the way `self-test.ts` proves the present scorer: a perfect echo scores 100, and a dropped note, an extra note, a wrong pitch, a wrong length, and a moved barline each score as exactly that and nothing more.
2. **The four *Sunless* build songs** (1, 4, 5, 6). Read each song's pages on the app's own path, with the clef and key printed on the scan, and say which you gave. Keep the reader's events as JSON in the measurement folder. Score each against its truth file.
3. **The Tchaikovsky song** has truth for heads in each bar only. Report it as row 21 did.
4. **The two test-only songs** (*Sunless* 2 and 3). Read and score them by the same script. **Report their totals only. Do not open their pages, their crops, or their note-by-note output,** and tune nothing on them. They exist to show whether a rule fitted to the build songs holds on a song nobody has studied.
5. **Where a truth file and the scan disagree.** A mismatch is either the reader's error or a difference between Dann's engraving and this edition. For each build song, list the first twenty places where the two sequences differ: page, system, bar, what the truth says, what the reader says, and a crop one bar wide. Say which you judge each to be, by looking. The desk looks at the ones you cannot call. Where the scan and the file differ, the scan decides.
6. **The wait.** Read time for each page of each song, on the app's Worker, as in row 21.
7. **The truth path.** Say whether `extractGroundTruth` runs under plain Node on the Mac, and give the command that works. Do not edit product code to make it run.

## 4. The rulings this serves

- **Dann, 2026-10-01 22:22, the measure:** 95 of every 100 notes right in pitch and length, and 9 of every 10 syllables right and under the right note; per song, not pooled; at least 98 of 100 bars; measured on the app's own path (plan r4, section 2).
- **Dann, 2026-10-01 23:06, on the scorer:** *"it is there to align with our need and not vice versa."*
- **Plan r4, principle 9:** truth before measuring, measuring before building, and no new fixed number without a check on songs the builders have not seen.
- **Dann, 2026-10-02 09:00, the test set:** eight songs. Built on: Tchaikovsky Op. 38 No. 3, and *Sunless* 1, 4, 5, and 6. Test only: *Sunless* 2, *Sunless* 3, and Tchaikovsky Op. 38 No. 2, whose truth is not made yet (`docs/memory/OPEN.md`, "N.178 AND THE SCAN READER", item 16).
- **Dann, 2026-10-02 08:50:** the foundations are part of the plan and the desk starts them.

## 5. Constraints

- **Change no reader code and no product code.** New code goes in `tools/e16-harness/src/` and in `docs/sessions/measure-baseline_r1_2026-10-02/`.
- **The truth files stay in `tools/e16-harness/output/truth/`** and are never committed. The Kabalevsky files are not part of this brief.
- **Crops go in a `.files` folder,** which `.gitignore` keeps out of the repository.
- **The pins hold:** Pyodide v0.26.4, cv2 4.9.0, numpy 1.26.4.
- **Fix nothing you find.** Report it.
- **No agent writes with git.**
- **What this displaces:** the metre brief, by one step. The baseline says whether the metre is the next largest loss.

## 6. Done when

1. The scan scorer and its proof are in the tree, and the proof passes.
2. One table holds the five build songs: bars, notes present, pitch right, length right, both right, rests, and the headline.
3. The two test-only songs' totals are in the report, and nothing else of theirs is.
4. Each build song's first twenty mismatches are listed with crops and your call on each.
5. Read times are reported for each song.
6. All gates at baseline: gate 4 is `1824 passed (1824)` and gate 5 is `644 passed | 5 skipped (649)`. Name any number you move and the tests that move it.

## 7. Report back

A new file, `docs/sessions/report-code-the-baseline-on-eight-songs_r1_2026-10-02.md`: the scorer's rules as built, the table, the mismatch lists, the read times, and **what could not be established. NOT ESTABLISHED beats a complete invented answer.**
