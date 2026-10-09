Returned by an Opus helper, 2026-10-08, commissioned by the desk on Dann's yes of 18:54. Never ran a reader.

# Held-out set 2: two triplet songs found, truth written for six of ten

## Headline

- **Part 1 is done.** Two songs with printed voice triplets are cut into `scans/`: Khvoshchinsky Op. 4 No. 4 (two groups) and Artsybushev Op. 5 No. 1 (twelve groups).
- **Part 2 is six of ten.** Truth files exist for Catoire, Blumenfeld, Lyadov, Sokolov, Khvoshchinsky and Artsybushev. **Arensky, Ippolitov-Ivanov, Lyapunov and Zhitomirsky are NOT DONE**: the token budget ran out. Arensky is read only to bar 19 of its piano-and-voice score, and that partial reading is not written as a truth file.
- All six files pass the self-check: every bar sums to its metre, `onsetAbsolute` agrees with the bar lengths, ids are unique, and a MusicXML copy of each file goes through the scorer's `conv.py` and returns the same events, bars and lengths. A node script that repeats the loading lines of `score.ts` reads all six with no malformed event. `scan-scorer.ts` is not in the workspace, so `score.ts` itself was not run.
- Seven readings are UNSURE (in section 3). The worst is Khvoshchinsky bar 18, where the printed triplets do not fill the bar as written.

## How the work was done

- **Downloads** use the IMSLP mirror method of the first memo (`scripts/dl.sh`). The full source PDFs are in `sources/`. The cutting script is `scripts/assemble2.sh`.
- **Reading.** I rendered the voice staff of every system at 250 to 300 dpi with pale colour in the staff spaces. A small script I wrote (`scripts/heads.py`) labels each filled notehead it finds with its measured staff step. It is a measuring aid, like the desk's head measurements in the Tchaikovsky draft, and not a reader. It misses hollow heads, some flagged heads and the material before the key signature. Rhythm, rests, accidentals, ties and tuplets are read by eye, and doubtful bars are enlarged.
- **Files.** Each song has a source reading in `truth/src/<slug>.txt`, compiled by `scripts/gen_truth.py` and checked by `scripts/check_truth.py`. The log is `truth/selfcheck/selfcheck-log.txt`.
- **Schema.** The schema follows the Tchaikovsky r2 truth. That file has no tuplets, grace notes, pickups or printed accidentals, so the handling of those is my own choice (DESK DEFAULT), written out in each notes file:
  - A tuplet note carries its sounding length, as `conv.py` computes it.
  - A pickup bar is marked `short`, with its printed length.
  - A bar with a single rest has no event, as in `conv.py`.
  - Each note gets the extra fields `pitch` and `printedAccidental`.

## 1. The two new songs

### Identity and sources

| # | Composer | Title | Opus, no. | IMSLP page | Edition |
|---|---|---|---|---|---|
| 9 | Pyotr Khvoshchinsky | «Не можетъ быть» / Ne mozhet byt' (words: A. Maikov) | Op. 4 No. 4 | https://imslp.org/wiki/6_Romances,_Op.4_(Khvoshchinsky,_Pyotr) | A. Iogansen, St. Petersburg, n.d., plates 162 to 167 (IMSLP); 165 on the page |
| 10 | Nikolay Artsybushev | «Я пришелъ къ тебѣ съ привѣтомъ» / Ya prishel k tebe s privetom (words: A. Fet); French underlay «Aubade» | Op. 5 No. 1 | https://imslp.org/wiki/3_Romances,_Op.5_(Artsybushev,_Nikolay) | M. P. Belaieff, Leipzig, 1891 (IMSLP); plate NOT ESTABLISHED |

### Files

| # | Pages of music | File pages | Pages taken from the source PDF | File | md5 |
|---|---|---|---|---|---|
| 9 | 4 | 5 | 14 (cover of No. 4), 15 to 18 | `khvoshchinsky_op4_no4_ne_mozhet_byt.pdf` | 12b30708b5c83d781d29aaf75c3f6419 |
| 10 | 4 | 5 | 1 (set cover), 2 to 5 | `artsybushev_op5_no1_ya_prishel_k_tebe_s_privetom.pdf` | ab758ec536e186d9f9280e0e9d8a583d |

Source PDFs:

- `PMLP1069029-khvostchinsky_op.4.pdf`: 28 pages, md5 528d6e0b8c05d3034776212d6faadd76, mirror index 666153.
- `PMLP767638-Arts_Op.5.pdf`: 12 pages, md5 6a56c1b787e853528e647a09d14561a0, mirror index 472978.

### Voice triplets (bars as measureIndex, from 0)

| # | Bars with voice triplets | Seen on the pages |
|---|---|---|
| 9 | 18 (two groups in one bar, page 3, system 1) | Treble; 1 flat; metre changes between 3/4 and 2/4; 12-bar piano introduction with no voice staff |
| 10 | 8, 10, 13, 14, 15, 17, 18, 20, 39, 47, 49, 50 (one group each) | Treble; 3 sharps; cut time; quarter triplets, several starting with a quarter rest; Russian and French underlay |

Neither composer is in the set or on the exclusion list. Both are lesser-known by my judgement, not as an established fact.

**Found along the way (not used):** Derviz «Глазки» (Bernard, 1873, IMSLP index 583721) and Derviz's 4 Romances (Jurgenson, 1885 to 1887) print **two verses stacked under the notes**. That is the other variety point the first memo left unmet. Bakaleynikov «Если зналъ бы ты, другъ» (Gutheil, A. 2119 G) also does.

## 2. All ten songs

"Bars checked" means bars checked by script (sum, onset, `conv.py` round trip), plus bars enlarged and looked at again.

| Song | Bars | Notes | Rest events | Tuplet groups | Bars checked | Corrections from the checks |
|---|---|---|---|---|---|---|
| Catoire Op. 1/1 | 49 | 91 | 8 | 0 | 49; 6 enlarged (6, 10, 34, 36, 40, 41) | 0 by sum; bar 41 UNSURE removed by head check |
| Ippolitov-Ivanov Op. 28/4 | NOT DONE | | | | | |
| Blumenfeld Op. 42/2 | 28 | 127 | 17 | 2 (duplets, bar 15) | 28; 6 enlarged (2, 3, 14, 15, 16, 19) | 3 (bars 2, 15, 16) |
| Arensky Op. 44/3 | NOT DONE (read to bar 19 only) | | | | | |
| Lyapunov Op. 51/1 | NOT DONE | | | | | |
| Zhitomirsky Op. 6/2 | NOT DONE | | | | | |
| Lyadov Op. 22/1 | 26 | 62 | 2 | 0 | 26 | 3 pitches set by head check (bars 6, 7, 8) |
| Sokolov Op. 27/1 | 37 (bar 0 a one-eighth pickup) | 160 | 30 | 0 | 37; bars 16, 34 measured | 2 (bars 16, 34 fermata note G5) |
| Khvoshchinsky Op. 4/4 | 76 (0 to 11 piano introduction) | 82 | 37 | 2 (bar 18) | 76; bars 16, 18, 23 enlarged | 2 (bar 16 Bb3; bar 18 recast, UNSURE) |
| Artsybushev Op. 5/1 | 61 | 144 | 17 | 12 | 61; bars 11-12, 15, 20, 32 enlarged | 5 (bars 8, 12, 15, 20, 32) |

The corrections are listed in full in each `truth/<slug>.notes.md`.

## 3. UNSURE items (bar = measureIndex, from 0)

- **Sokolov, bars 16 and 34.** The rest after the first eighth is recorded as a sixteenth rest because only that fills the bar. Its glyph was not enlarged.
- **Khvoshchinsky, bar 18 (bar 19 counting from 1).**
  - The first '3' bracket prints an eighth rest and an eighth D4. That fills only two thirds of a beat, so D4 is recorded as a quarter inside the triplet.
  - The second bracket covers F4, E4 and F4, with a dot between E4 and F4. It is recorded as dotted eighth, sixteenth and eighth.
  - Both are my decisions. The page does not settle them.
- **Artsybushev, bars 15 and 20.** B4 («нул») and A4 («сен») are recorded as dotted quarters. The dots are faint specks, and without them each bar sums to 7/8.
- **Artsybushev, bar 32.** The first half note is recorded as B4; C#5 is possible.

## 4. Could not establish

- **Truth for Arensky, Ippolitov-Ivanov, Lyapunov and Zhitomirsky.** NOT DONE because the budget ran out. For Arensky, the staff detection needs per-system hand fixes on the skewed pages 3 and 5.
- **Whether `scan-scorer.ts` accepts the extra fields and the `short` bar flag.** Its source is not in the workspace.
- **How the Finale truth files show ties, tuplets and pickups.** I did not look; the conventions here are my own.
- **The plate number of the Artsybushev edition.** It was not read from the page, and IMSLP gives none.
- **Khvoshchinsky bar 0.** It is counted as a full 3/4 bar of the piano introduction: the left hand prints a half rest and a quarter chord.
- **The words.** They were not transcribed, by instruction.
- **Dann's knowledge of the songs.** Whether Dann knows any of these songs is NOT ESTABLISHED.
