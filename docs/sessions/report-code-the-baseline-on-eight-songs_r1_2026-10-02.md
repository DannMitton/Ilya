# Report: the baseline on eight songs (QUEUE row 22)

**Written by:** Code (Sonnet 5.5), 2026-10-02. **Brief:** `brief-code-the-baseline-on-eight-songs_r1_2026-10-02.md`, the whole brief. **Status: WRITTEN, all measurement.** No reader code and no product code changed; the new code is three files in `tools/e16-harness/src/` and one folder, `docs/sessions/measure-baseline_r1_2026-10-02/`. All eight gates are at baseline (gate 4 `1824 passed (1824)`, gate 5 `644 passed | 5 skipped (649)`; run from a scratch copy of `ilya-ship.sh` that cannot stage). The tree is at `887931f` plus untracked files. The two test-only songs (*Sunless* 2 and 3) are reported by totals only: I did not open their pages, their crops, or their note-by-note output, and tuned nothing on them.

## Provenance

The scan is `~/Downloads/IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf` (23 pages). Every read is on the app's own path: `rasterizePdf` (pdf.js, 400 dpi) then the `WorkerPageReader` in the dev server's Worker, one call per song, in headless Chromium under Playwright (pinned Pyodide v0.26.4, cv2 4.9.0, numpy 1.26.4), on the tree as row 21 shipped. The truth files are `tools/e16-harness/output/truth/*.truth.json`, git-ignored and not committed; nothing of theirs is copied into the repository except what the build songs' mismatch tables below quote. Scripts and results: `measure-baseline_r1_2026-10-02/` (`read-songs.mjs` the reads; `geom.py` the bar geometry; `mismatches.py` and `tables.py` the lists and crops; `reads/` the reader's events for the build songs as JSON; `scores/` the scores; `crops.files/` and `images.files/` the crops and the straightened pages, git-ignored). The test-only songs' reads were written to the scratchpad directory, outside the repository, and are read by the scorer only.

## What I gave the reader

Every song: clef **G on line 2**, octave change **0**, and the key **printed on the scan**. I looked at the first system of each build song's opening page: *Sunless* 1 (page 1) a treble clef, 2 sharps, 6/4; *Sunless* 4 (page 9) a treble clef, 2 sharps, common time; *Sunless* 5 (page 11) a treble clef, no signature, common time; *Sunless* 6 (page 18) a treble clef, 7 sharps, common time. **No build song prints an 8 under its clef.** For *Sunless* 1 the file has an F clef (a bass's line); the scan has a G clef, so I gave G, and the song's octave shift absorbs the difference. For the two test-only songs I did not look at the pages: I gave G2 and the key the truth file holds (2 sharps for *Sunless* 2, none for *Sunless* 3), which I took as the scan's key, and **that they are the scan's keys is NOT ESTABLISHED**. Pages per song, from the desk's lead: 1: pages 1 to 2; 2: 3 to 4; 3: 5 to 8; 4: 9 to 10; 5: 11 to 17; 6: 18 to 23. I confirmed by looking that pages 1, 9, 11, and 18 open songs 1, 4, 5, and 6. **That pages 3 to 4 are song 2 and pages 5 to 8 song 3 is NOT ESTABLISHED** (I did not open them); the bar counts the reader returns (12 and 43, against the file's 12 and 41) are consistent with it.

## The scorer, as built (`tools/e16-harness/src/scan-scorer.ts`)

`scorer.ts` is untouched. The new scorer does not match by bar number or by onset.

- **Alignment.** The reader's events and the truth's events are two sequences in order. A dynamic program maximizes the total of the match scores and lets any event on either side stay unmatched at no cost, so a missing event and an extra event are allowed. Only like types match (a note with a note, a rest with a rest). A note-to-note match scores 1, plus 2 if the pitch is equal under the song's shift, plus 1 if the length is the same fraction; a rest-to-rest match scores 1, plus 1 for the same length. Ties go to the match.
- **Pitch** is right when the reader's MIDI number minus the shift equals the file's. **The shift is one number for the song**, chosen from -24, -12, 0, +12, +24 as the one with the most equal pitches (then the most matches); the count at every shift is in `scores/` (`shiftCounts`). A note whose pitch abstained is counted apart (neither right nor wrong), and the report says how often `midiAssumedNatural`, under the same shift, would have been right.
- **Length** is right when the written length is the same fraction. No tolerance. A length that abstained is counted apart.
- **The headline:** of every 100 printed notes (the file's notes), how many are present with the right pitch and the right length.
- **Bars.** A file bar is "all right" when every event in it is matched, with the right pitch (notes) and the right length, in one reader bar that holds nothing else. A moved barline, a missing or an extra event, a wrong pitch, and a wrong length each spoil exactly the bars they touch.
- **Per song it reports:** bars in the file and bars read; notes (file, read, matched, missing, extra); of the matched, pitch right, pitch wrong, pitch abstained, length right, length wrong, length abstained, and both right; rests (file, read, matched, length right); abstentions by kind (pitch, duration, onset, and on bars, metre and sum); the reader's metre for each bar beside the file's bar length (`barMetres` in `scores/`); the bars in which every event is right; and every difference in sequence order (`differences`).
- **Syllables are not scored.** The reader carries none.
- **The proof (`scan-scorer-selftest.ts`, run by `node tools/e16-harness/src/scan-scorer-selftest.ts`, all checks pass).** A perfect echo scores 100, every bar right, no difference. A dropped note scores as exactly one missing note and one bar spoiled (headline 90). An extra note scores as exactly one extra note and one bar spoiled, and does not lower the notes present (headline 100). A wrong pitch scores as exactly one wrong pitch; a wrong length as exactly one wrong length; a wrong rest length as one wrong rest and no note; and each spoils exactly its bar. **A moved barline leaves every note right (headline 100) and spoils exactly two bars.** An echo shifted by 12, -12, 24, or -24 semitones scores 100 under the shift it reports. An abstained pitch is counted apart and `midiAssumedNatural` is checked against the file.
- `scan-baseline.ts` scores the six songs against their files. **For a test-only song it writes and prints totals only.**

## The table: the build songs, then the test-only songs' totals

Bars are file / read. Rests are file / read / matched (a matched rest is a rest the reader emitted and the aligner paired). **The headline is notes present with the right pitch and the right length, of every 100 printed notes.** The shift is the reader's octave over the file's.

| Song | Bars | Notes in the file | Notes read | Matched | Missing | Extra | Pitch right | Pitch wrong | Pitch abstained | Length right | Length wrong | Length abstained | Both right | Rests | **Headline** | Shift |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| *Sunless* 1 | 18 / 18 | 96 | 101 | 96 | 0 | 5 | 72 | 21 | 3 | 42 | 21 | 33 | 35 | 19 / 0 / 0 | **36.5** | +12 |
| *Sunless* 4 | 29 / 29 | 116 | 115 | 115 | 1 | 0 | 92 | 21 | 2 | 50 | 52 | 13 | 43 | 29 / 2 / 2 | **37.1** | +0 |
| *Sunless* 5 | 61 / 60 | 258 | 230 | 212 | 46 | 18 | 152 | 56 | 4 | 35 | 118 | 59 | 30 | 48 / 0 / 0 | **11.6** | +12 |
| *Sunless* 6 | 55 / 53 | 161 | 144 | 137 | 24 | 7 | 98 | 37 | 2 | 57 | 70 | 10 | 37 | 26 / 2 / 2 | **23.0** | +12 |

**Pooled over the four build songs** (the ruling is per song; this is for the eye only): 631 notes in the file, 590 read, 560 matched, 71 missing, 30 extra; **145 both right, 23.0 of every 100**. Dann's bar (95 of every 100, per song) is not near on any song: the best is *Sunless* 4 at 37.1.

**The test-only songs (totals only):**

| Song | Bars file / read | Notes in the file | Notes read | Matched | Missing | Extra | Pitch right | Length right | Both right | Rests file / read / matched | Headline | Shift |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| *Sunless* 2 | 12 / 12 | 68 | 73 | 67 | 1 | 6 | 48 | 19 | 11 | 13 / 0 / 0 | **16.2** | +12 |
| *Sunless* 3 | 41 / 43 | 222 | 225 | 197 | 25 | 28 | 136 | 54 | 46 | 40 / 1 / 1 | **20.7** | +12 |

**Do the build songs' figures hold on songs nobody studied? As far as these two totals show, yes: the same size of loss.** The test-only headlines (16.2 and 20.7) sit in the build songs' range (11.6 to 37.1), the shift is the same +12 as on three of the four, and the same classes of loss show in the totals: the reader emits 0 and 1 rests against 13 and 40 in the files, and most of the matched notes' lengths are wrong or abstain (48 of 67 on *Sunless* 2, 143 of 197 on *Sunless* 3). I have no basis, from totals, to say more.

## Reading the table

- **Bars all right: 0 of 18, 29, 61, and 55** on the build songs (and 0 and 2 on the test-only songs). Every bar holds at least one printed rest the reader does not emit, or a length it gets wrong, so this number says little until lengths and rests move. Bars read against bars in the file: 18 / 18, 29 / 29, **60 / 61 on *Sunless* 5 and 53 / 55 on *Sunless* 6**.
- **Pitch is the best of the three:** pitch right of the notes matched is 75 percent (72 of 96) on *Sunless* 1, 80 percent (92 of 115) on 4, 72 percent (152 of 212) on 5, and 72 percent (98 of 137) on 6, under a shift of one octave. **Length is the worst:** of the matched notes, 42, 50, 35, and 57 are right in length, and 33, 13, 59, and 10 abstain. (Pitch abstentions are rare: 3, 2, 4, and 2; `midiAssumedNatural` would have been right on 0 of 3, 2 of 2, 0 of 4, and 2 of 2.)
- **Rests: the reader emits almost none.** The files have 19, 29, 48, and 26 rests; the reader emits 0, 2, 0, and 2.
- **The octave shift is +12 on *Sunless* 1, 5, and 6 and 0 on 4.** The reader reads a bass line in a treble clef without the octave change, as I gave it. The shift is not an error of the reader's; it is what the clef I gave implies. The brief's rule (one shift per song) holds: at no song does a second shift give more than a few percent of the winning count (`shiftCounts`: *Sunless* 5, shift 0: 5 right, +24: 9, +12: 152).
- **Metre, bar by bar** (`barMetres` in `scores/`). *Sunless* 1: 6/4 on all 18 bars, the same length as the file's bar on 17 (the first has no truth bar to compare). ***Sunless* 4 (common time in the file): `2/4` on 8 bars, no metre on 21;** of the 8 that read a metre, 7 are not the file's bar length. ***Sunless* 5 (common time): `1/4` on 28 bars, no metre on 32;** 25 of the 28 that can be compared are not the file's bar length. ***Sunless* 6 (common time): no metre on any of 53 bars.** The common-time sign is not read as 4/4, and a printed metre that is read is wrong on *Sunless* 4 and 5. **The reader's metre is the largest structural loss on three of the four build songs**, and it is why the metre brief matters: a bar whose metre abstains (`sum` or `metre` abstention) loses the check on its own length.
- **Page 12 of *Sunless* 5 is not read.** The reader raises on it (`walk S2: snap exhausted at row 4069 on page ... within half the rule spacing (16 px); no row satisfies membership against staff extent 2993`), the Worker isolates it as `failedPages: [2]`, and the page contributes no notes. This is most of why *Sunless* 5 is missing 46 notes and one bar. I did not look into why.
- **The hollow half notes of *Sunless* 6 are not read** (differences 1, 4, 7, and 14 below are four of them). **Row 20's report said no scan page holds a genuine hollow head; this song is a scan page with them.** I did not look for why the reader drops them (a hollow head with a stem on a ledger line, or set aside as a hook): **NOT ESTABLISHED.**

## The first twenty differences on each build song

Each is the first twenty in the sequence order of the alignment, for every kind of difference (missing, extra, pitch, length, abstained). Each has a crop one bar wide in `crops.files/`: the reader's bar, with a mark at the head of each of the reader's notes and a red number for the difference's note; the file's notes and the reader's notes for the bar are printed under the staff (the reader's pitches after the song's shift). Where several differences fall in one bar they share one crop. **Where the scan and the file differ, the scan decides.**

**My call for every one of the 80 is a reader error, by looking at the scan,** with these provisos:
- **The file agrees with the scan in every bar I looked at (22 bars, the bars of the lists):** the count and order of notes and rests, and the written lengths. **The one difference is a spelling: in *Sunless* 1 bar 1 the scan prints B♭ where the file has A♯3** (the same MIDI number, so the scorer counts it right).
- **Differences 4 to 6 on *Sunless* 5 are one reader error shown three ways,** by an alignment shift the scorer could not avoid: the reader's pickup note and the file's first full-bar note are both read as D3, and the aligner pairs them.
- The scan has a number of notes I did not need to read to judge: **what I looked at is the printed value; the crops are there for the desk to check each call.** I did not look at any difference beyond the twentieth.

### *Sunless* 1 (the reader gives the file's octave +12)

| # | difference | scan page, system | bar (file, reader) | the file says | the reader says | my call | crop |
|---|---|---|---|---|---|---|---|
| 1 | length abstained | p. 1, system 1 | 1, 1 | A3 1/4 | A3 abstained | reader error: quarter note, length abstained (`beam_scale_ink_no_beam`) | `crops.files/song1-bar1.png` |
| 2 | pitch abstained + length wrong | p. 1, system 1 | 1, 1 | A#3 1/4 | abstained (B3 assumed) 3/8 | reader error: B♭ with its flat, pitch abstained, and the quarter read as a dotted quarter. The scan spells it B♭ and the file A♯3: the same sound, a different spelling | `crops.files/song1-bar1.png` |
| 3 | pitch wrong + length abstained | p. 1, system 1 | 1, 1 | F3 1/4 | F#3 abstained | reader error: the natural sign before F is not read (read F♯), and the length abstained | `crops.files/song1-bar1.png` |
| 4 | pitch wrong + length abstained | p. 1, system 1 | 1, 1 | F3 1/8 | F#3 abstained | reader error: an eighth F♮ read as F♯, length abstained | `crops.files/song1-bar1.png` |
| 5 | missing | p. 1, system 1 | 1, 1 | rest 1/8 | nothing | reader error: the printed eighth rest is not emitted | `crops.files/song1-bar1.png` |
| 6 | pitch wrong | p. 1, system 1 | 2, 2 | B3 1/4 | C4 1/4 | reader error: B on the middle line read as C | `crops.files/song1-bar2.png` |
| 7 | length wrong | p. 1, system 1 | 2, 2 | G3 1/4 | G3 3/8 | reader error: a quarter read as a dotted quarter | `crops.files/song1-bar2.png` |
| 8 | length wrong | p. 1, system 1 | 2, 2 | G3 1/8 | G3 3/16 | reader error: an eighth read as a dotted eighth | `crops.files/song1-bar2.png` |
| 9 | missing | p. 1, system 1 | 2, 2 | rest 1/8 | nothing | reader error: the printed eighth rest is not emitted | `crops.files/song1-bar2.png` |
| 10 | length abstained | p. 1, system 1 | 2, 2 | A3 1/8 | A3 abstained | reader error: an eighth, length abstained | `crops.files/song1-bar2.png` |
| 11 | length abstained | p. 1, system 1 | 2, 2 | A3 1/8 | A3 abstained | reader error: an eighth, length abstained | `crops.files/song1-bar2.png` |
| 12 | missing | p. 1, system 1 | 2, 2 | rest 1/8 | nothing | reader error: the printed eighth rest is not emitted | `crops.files/song1-bar2.png` |
| 13 | length wrong | p. 1, system 2 | 3, 3 | A#3 1/4 | A#3 3/8 | reader error: a quarter read as a dotted quarter | `crops.files/song1-bar3.png` |
| 14 | length wrong | p. 1, system 2 | 3, 3 | E3 1/4 | E3 3/8 | reader error: a quarter read as a dotted quarter | `crops.files/song1-bar3.png` |
| 15 | pitch wrong + length abstained | p. 1, system 2 | 4, 4 | F3 3/8 | F#3 abstained | reader error: a dotted quarter F♮ read as F♯, length abstained | `crops.files/song1-bar4.png` |
| 16 | length abstained | p. 1, system 2 | 4, 4 | D3 1/8 | D3 abstained | reader error: an eighth, length abstained | `crops.files/song1-bar4.png` |
| 17 | length wrong | p. 1, system 2 | 4, 4 | D3 1/8 | D3 3/16 | reader error: an eighth read as a dotted eighth | `crops.files/song1-bar4.png` |
| 18 | missing | p. 1, system 2 | 4, 4 | rest 1/8 | nothing | reader error: the printed eighth rest is not emitted | `crops.files/song1-bar4.png` |
| 19 | length wrong | p. 1, system 2 | 5, 5 | A3 1/4 | A3 1/8 | reader error: a quarter read as an eighth | `crops.files/song1-bar5.png` |
| 20 | pitch wrong + length abstained | p. 1, system 2 | 5, 5 | F#3 1/8 | D#3 abstained | reader error: an F♯ eighth read as D♯, length abstained | `crops.files/song1-bar5.png` |

### *Sunless* 4 (the reader gives the file's octave +0)

| # | difference | scan page, system | bar (file, reader) | the file says | the reader says | my call | crop |
|---|---|---|---|---|---|---|---|
| 1 | missing | p. 9, system 1 | 1, 1 | rest 1/8 | nothing | reader error: the printed eighth rest is not emitted | `crops.files/song4-bar1.png` |
| 2 | length abstained | p. 9, system 1 | 1, 1 | E4 1/4 | E4 abstained | reader error: a quarter, length abstained | `crops.files/song4-bar1.png` |
| 3 | length abstained | p. 9, system 1 | 1, 1 | E4 1/8 | E4 abstained | reader error: an eighth, length abstained | `crops.files/song4-bar1.png` |
| 4 | missing | p. 9, system 1 | 1, 1 | rest 1/8 | nothing | reader error: the printed eighth rest is not emitted | `crops.files/song4-bar1.png` |
| 5 | missing | p. 9, system 1 | 2, 1 | rest 1/8 | nothing | reader error: the eighth rest that opens bar 2 is not emitted | `crops.files/song4-bar1.png` |
| 6 | length abstained | p. 9, system 1 | 2, 2 | F#4 1/8 | F#4 abstained | reader error: an eighth, length abstained | `crops.files/song4-bar2.png` |
| 7 | length wrong | p. 9, system 1 | 2, 2 | F#4 1/8 | F#4 1/16 | reader error: an eighth read as a sixteenth | `crops.files/song4-bar2.png` |
| 8 | length abstained | p. 9, system 1 | 2, 2 | F#4 1/8 | F#4 abstained | reader error: an eighth, length abstained | `crops.files/song4-bar2.png` |
| 9 | length wrong | p. 9, system 1 | 3, 3 | F#4 1/4 | F#4 1/8 | reader error: a quarter read as an eighth | `crops.files/song4-bar3.png` |
| 10 | missing | p. 9, system 1 | 3, 3 | rest 1/8 | nothing | reader error: the printed eighth rest is not emitted | `crops.files/song4-bar3.png` |
| 11 | missing | p. 9, system 1 | 3, 3 | rest 1/4 | nothing | reader error: the printed quarter rest is not emitted | `crops.files/song4-bar3.png` |
| 12 | length wrong | p. 9, system 1 | 3, 3 | F#4 1/4 | F#4 3/16 | reader error: a quarter read as a dotted eighth | `crops.files/song4-bar3.png` |
| 13 | length wrong | p. 9, system 2 | 4, 4 | D#5 1/8 | D#5 3/16 | reader error: an eighth read as a dotted eighth | `crops.files/song4-bar4.png` |
| 14 | length wrong | p. 9, system 2 | 4, 4 | G#4 1/8 | G#4 3/16 | reader error: an eighth read as a dotted eighth | `crops.files/song4-bar4.png` |
| 15 | length wrong | p. 9, system 2 | 4, 4 | B4 1/8 | B4 1/4 | reader error: an eighth read as a quarter | `crops.files/song4-bar4.png` |
| 16 | pitch wrong | p. 9, system 2 | 5, 5 | A#4 1/8 | G4 1/8 | reader error: A♯4 (sharp sign) read as G4 | `crops.files/song4-bar5.png` |
| 17 | missing | p. 9, system 2 | 5, 5 | rest 1/8 | nothing | reader error: the printed eighth rest is not emitted | `crops.files/song4-bar5.png` |
| 18 | pitch wrong | p. 9, system 2 | 5, 5 | A#4 1/4 | G4 1/4 | reader error: A♯4 (the sharp carries through the bar) read as G4 | `crops.files/song4-bar5.png` |
| 19 | length wrong | p. 9, system 2 | 6, 6 | F#4 1/8 | F#4 3/16 | reader error: an eighth read as a dotted eighth | `crops.files/song4-bar6.png` |
| 20 | pitch abstained + length wrong | p. 9, system 2 | 6, 6 | A4 1/4 | abstained (A4 assumed) 3/8 | reader error: A♮ (natural sign) pitch abstained, and a quarter read as a dotted quarter | `crops.files/song4-bar6.png` |

### *Sunless* 5 (the reader gives the file's octave +12)

| # | difference | scan page, system | bar (file, reader) | the file says | the reader says | my call | crop |
|---|---|---|---|---|---|---|---|
| 1 | missing | p. 11, system 1 | 0, 0 | rest 1/2 | nothing | reader error: the half rest of the opening bar is not emitted | `crops.files/song5-bar0.png` |
| 2 | missing | p. 11, system 1 | 0, 0 | rest 1/4 | nothing | reader error: the quarter rest of the opening bar is not emitted | `crops.files/song5-bar0.png` |
| 3 | missing | p. 11, system 1 | 0, 0 | rest 1/12 | nothing | reader error: the eighth-triplet rest of the opening bar is not emitted | `crops.files/song5-bar0.png` |
| 4 | missing | p. 11, system 1 | 0, 0 | D#3 1/6 | nothing | reader error, and an alignment shift with #5 and #6: the reader's one note in bar 0 is the printed D♯3 triplet eighth, read as D3 with length 1/16 (sharp and triplet unread). The aligner pairs it with the next bar's first note, which leaves this note missing | `crops.files/song5-bar0.png` |
| 5 | length wrong | p. 11, system 1 | 1, 0 | D3 1/4 | D3 1/16 | see #4: the reader's D3 1/16 of bar 0 stands for the printed pickup note, not for this one | `crops.files/song5-bar0.png` |
| 6 | extra | p. 11, system 1 | -, 1 | - | C3 1/16 | see #4: the reader's C3 1/16 is the printed first note of bar 1, a C with a double sharp (D3), read as C3 with the double sharp unread | `crops.files/song5-bar1.png` |
| 7 | pitch wrong + length abstained | p. 11, system 1 | 1, 1 | D3 1/8 | C3 abstained | reader error: an eighth with the double sharp carried through the bar, read as C3, length abstained | `crops.files/song5-bar1.png` |
| 8 | missing | p. 11, system 1 | 1, 1 | rest 1/8 | nothing | reader error: the printed eighth rest is not emitted | `crops.files/song5-bar1.png` |
| 9 | length wrong | p. 11, system 1 | 1, 1 | D3 3/8 | D3 3/16 | reader error: a dotted quarter D♮ read as a dotted eighth | `crops.files/song5-bar1.png` |
| 10 | length abstained | p. 11, system 1 | 1, 1 | D3 1/8 | D3 abstained | reader error: an eighth, length abstained | `crops.files/song5-bar1.png` |
| 11 | length wrong | p. 11, system 2 | 2, 2 | E3 1/4 | E3 1/8 | reader error: a quarter read as an eighth | `crops.files/song5-bar2.png` |
| 12 | length wrong | p. 11, system 2 | 2, 2 | E3 1/8 | E3 1/16 | reader error: an eighth read as a sixteenth | `crops.files/song5-bar2.png` |
| 13 | missing | p. 11, system 2 | 2, 2 | rest 1/8 | nothing | reader error: the printed eighth rest is not emitted | `crops.files/song5-bar2.png` |
| 14 | missing | p. 11, system 2 | 2, 2 | rest 1/4 | nothing | reader error: the printed quarter rest is not emitted | `crops.files/song5-bar2.png` |
| 15 | missing | p. 11, system 2 | 2, 2 | rest 1/8 | nothing | reader error: the printed eighth rest is not emitted | `crops.files/song5-bar2.png` |
| 16 | length wrong | p. 11, system 2 | 2, 2 | E3 1/8 | E3 1/16 | reader error: an eighth read as a sixteenth | `crops.files/song5-bar2.png` |
| 17 | length wrong | p. 11, system 2 | 3, 3 | E3 3/16 | E3 1/16 | reader error: a dotted eighth read as a sixteenth | `crops.files/song5-bar3.png` |
| 18 | length abstained | p. 11, system 2 | 3, 3 | G#3 1/16 | G#3 abstained | reader error: a sixteenth G♯, length abstained | `crops.files/song5-bar3.png` |
| 19 | length abstained | p. 11, system 2 | 3, 3 | D#3 1/8 | D#3 abstained | reader error: an eighth D♯, length abstained | `crops.files/song5-bar3.png` |
| 20 | length wrong | p. 11, system 2 | 3, 3 | E3 1/8 | E3 1/16 | reader error: an eighth read as a sixteenth | `crops.files/song5-bar3.png` |

### *Sunless* 6 (the reader gives the file's octave +12)

| # | difference | scan page, system | bar (file, reader) | the file says | the reader says | my call | crop |
|---|---|---|---|---|---|---|---|
| 1 | missing | p. 18, system 1 | 1, 1 | C#3 1/2 | nothing | reader error: the hollow half note C♯3 (on a ledger line) is not read | `crops.files/song6-bar1.png` |
| 2 | length wrong | p. 18, system 1 | 1, 1 | D#3 1/4 | D#3 1/8 | reader error: a quarter read as an eighth | `crops.files/song6-bar1.png` |
| 3 | length wrong | p. 18, system 1 | 1, 1 | F3 1/4 | F3 1/8 | reader error: a quarter read as an eighth | `crops.files/song6-bar1.png` |
| 4 | missing | p. 18, system 1 | 2, 1 | F#3 1/2 | nothing | reader error: the hollow half note F♯3 is not read | `crops.files/song6-bar1.png` |
| 5 | length wrong | p. 18, system 1 | 2, 2 | D#3 1/4 | D#3 3/16 | reader error: a quarter read as a dotted eighth | `crops.files/song6-bar2.png` |
| 6 | length wrong | p. 18, system 1 | 2, 2 | F#3 1/4 | F#3 1/8 | reader error: a quarter read as an eighth | `crops.files/song6-bar2.png` |
| 7 | missing | p. 18, system 1 | 3, 2 | G#3 1/2 | nothing | reader error: the hollow half note G♯3 is not read | `crops.files/song6-bar2.png` |
| 8 | pitch wrong + length wrong | p. 18, system 2 | 3, 3 | A3 1/4 | A#3 3/32 | reader error: A with a natural sign read as A♯, and a quarter read as a dotted thirty-second | `crops.files/song6-bar3.png` |
| 9 | length wrong | p. 18, system 2 | 3, 3 | G#3 1/4 | G#3 1/8 | reader error: a quarter read as an eighth | `crops.files/song6-bar3.png` |
| 10 | length wrong | p. 18, system 2 | 4, 4 | C#4 3/8 | C#4 3/16 | reader error: a dotted quarter read as a dotted eighth | `crops.files/song6-bar4.png` |
| 11 | length wrong | p. 18, system 2 | 4, 4 | F#3 1/8 | F#3 1/16 | reader error: an eighth read as a sixteenth | `crops.files/song6-bar4.png` |
| 12 | length wrong | p. 18, system 2 | 4, 4 | F#3 1/4 | F#3 3/16 | reader error: a quarter read as a dotted eighth | `crops.files/song6-bar4.png` |
| 13 | missing | p. 18, system 2 | 4, 4 | rest 1/4 | nothing | reader error: the printed quarter rest is not emitted | `crops.files/song6-bar4.png` |
| 14 | missing | p. 18, system 2 | 5, 4 | A3 1/2 | nothing | reader error: the hollow half note A♮ is not read | `crops.files/song6-bar4.png` |
| 15 | missing | p. 18, system 2 | 5, 4 | E3 1/4 | nothing | reader error: the quarter E♮ (natural sign) is not read | `crops.files/song6-bar4.png` |
| 16 | length wrong | p. 18, system 2 | 5, 5 | F#3 1/4 | F#3 1/8 | reader error: a quarter read as an eighth | `crops.files/song6-bar5.png` |
| 17 | pitch wrong | p. 18, system 3 | 6, 6 | A3 1/2 | B3 1/2 | reader error: the hollow half note A♮ is read as B (the natural sign and the position) | `crops.files/song6-bar6.png` |
| 18 | pitch wrong + length wrong | p. 18, system 3 | 6, 6 | E3 1/8 | D3 1/16 | reader error: an eighth E♮ read as D, and as a sixteenth | `crops.files/song6-bar6.png` |
| 19 | missing | p. 18, system 3 | 6, 6 | rest 1/8 | nothing | reader error: the printed eighth rest is not emitted | `crops.files/song6-bar6.png` |
| 20 | length wrong | p. 18, system 3 | 6, 6 | F#3 1/4 | F#3 1/2 | reader error: a quarter read as a half note | `crops.files/song6-bar6.png` |

## Read times, on the app's Worker

Wall seconds for one call to read the song's pages, headless and unthrottled; the per-page times are each page read alone, in the same Worker, in the same session. The Worker's own `readSeconds` is within 2 s of the wall time in every case.

| Song | Pages | Whole song (s) | Per page, read alone (s) |
|---|---|---|---|
| *Sunless* 1 | 1 to 2 | 19.7 | p. 1: 8.6; p. 2: 10.5 |
| *Sunless* 2 (test only) | 3 to 4 | 15.1 | p. 3: 7.2; p. 4: 7.7 |
| *Sunless* 3 (test only) | 5 to 8 | 47.8 | p. 5: 8.8; p. 6: 14.1; p. 7: 11.4; p. 8: 13.8 |
| *Sunless* 4 | 9 to 10 | 20.2 | p. 9: 8.3; p. 10: 11.8 |
| *Sunless* 5 | 11 to 17 | 57.8 | p. 11: 7.4; **p. 12: 0.9 (raises, not read)**; p. 13: 9.2; p. 14: 7.5; p. 15: 8.7; p. 16: 12.7; p. 17: 11.4 |
| *Sunless* 6 | 18 to 23 | 50.1 | p. 18: 7.6; p. 19: 9.9; p. 20: 8.7; p. 21: 8.5; p. 22: 8.4; p. 23: 6.0 |
| Tchaikovsky Op. 38 No. 3 | 1 to 3 | 32.5 (then 32.1) | not measured per page (row 21: 32.9 then 32.3) |

A page takes 6 to 14 seconds; a song of 6 or 7 pages takes about a minute.

## The Tchaikovsky song, as row 21 reported it

Truth for heads in each bar only. On the app's Worker today, on the tree as row 21 shipped: **99 bars read and 183 events (173 heads and 10 rests)**, re-read this session (`measure-company_r1_2026-10-02/appworker.json`), the same as row 21. The per-bar head counts are row 21's, not re-measured today: **98 of the desk's 99 bars equal, no bar wrong by more than one head, no hollow head emitted.** Pitch and length are not scored: there is no truth for them.

## The truth path

**`extractGroundTruth` does not run under plain Node on the Mac** (Node v24.13.0, run from the repository root): importing `tools/e16-harness/src/ground-truth.ts` fails with `ERR_MODULE_NOT_FOUND: Cannot find module '.../packages/score-parser/src/pickup' imported from .../packages/score-parser/src/mnx-parser.ts` (the import has no file extension). **It runs through `npx tsx`.** The call that works, from the repository root, is a script (a `.mts` file, or a `.ts` file in a package of `"type": "module"`, because tsx treats a bare `.ts` outside one as CommonJS and refuses its top-level `await`):

```
import { musxToMnxJson } from './tools/e16-harness/src/denigma-convert.ts';
import { extractGroundTruth } from './tools/e16-harness/src/ground-truth.ts';
const p = process.env.HOME + '/Documents/Finale Files/Mussorgsky - Sunless 01 - Within four walls.musx';
const gt = await extractGroundTruth('sunless-01', p, await musxToMnxJson(p));
```

run as `npx tsx that-file.mts`. For *Sunless* 1 it returns 115 events in verse 1 (96 notes, 19 rests) and 18 bars, the same as the truth file. **Note the argument order of `extractGroundTruth`: `(pieceId, sourceMusxPath, mnxJsonText)`.** `npx` fetched `tsx` on first use; it is not a dependency of the workspace. No product code was edited. The scorer itself (`scan-scorer.ts`, its self-test, and `scan-baseline.ts`) runs under plain Node 24 and needs no tsx, because it reads the JSON truth files and imports nothing from the product.

## Section 6, line by line

1. **The scan scorer and its proof are in the tree; the proof passes: MET** (`scan-scorer.ts`, `scan-scorer-selftest.ts`, `scan-baseline.ts`, untracked).
2. **One table holds the build songs: MET** (above): bars, notes present, pitch right, length right, both right, rests, the headline. (The brief says five build songs and the plan names four *Sunless* songs and the Tchaikovsky; the Tchaikovsky has heads only, so it is reported as row 21 reported it.)
3. **The two test-only songs' totals are in the report and nothing else of theirs: MET.** Their read output is in the scratchpad directory and was not opened.
4. **Each build song's first twenty mismatches, with crops and a call: MET.**
5. **Read times for each song: MET.**
6. **Gates: at baseline,** no number moved. Gate 4 `1824 passed (1824)`; gate 5 `644 passed | 5 skipped (649)`; gate 1 `251`; gate 2 `235`; gate 3 `found 0 errors and 12 warnings in 5 files`; gate 6 `145`; gate 7 `55`; gate 8 `ratchets: OK.` The new files are untracked (the real `ilya-ship.sh` will refuse until they are committed).

## What could not be established

- **That the scan's edition is Dann's engraving in every bar.** I compared the 22 bars of the first-twenty lists, and they agree with the file in every note and rest and written length (one spelling aside). Whether the other bars do is NOT ESTABLISHED, and so is whether the file and the scan agree in key on the test-only songs.
- **Pages 3 to 8**: which belong to *Sunless* 2 and which to 3.
- **Why the hollow half notes of *Sunless* 6 are dropped**, and **why page 12 of *Sunless* 5 raises.**
- **The scorer's alignment on a song where the reader is badly off:** a mismatch list is only as good as the pairing, and the pickup of *Sunless* 5 shows the aligner pairing the wrong two notes when it can. I did not try a different weighting.
- **Whether the headline would be much higher if the reader's rests, metre, and lengths were right:** the abstentions suggest so, but I have not scored an oracle.
- **Syllables:** not scored.
- **A stale folder:** `measure-baseline_r1_2026-10-02/mismatches.files/` holds the first set of crops, one per difference, which I replaced with `crops.files/` (one per bar) and could not delete (the delete was refused by a safety check). It is git-ignored. Delete it by hand.
