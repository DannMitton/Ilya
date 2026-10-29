# Report: A1's two fixes measured on all 18 songs (helper, 2026-10-28, r1)

Measure only. Nothing was committed, pushed or published. Code under test: `/home/claude/a2/lane19`, branch `cloud-lane-19`, head `383187a`. I restored both edited source files from saved copies. Their md5s equal the originals: `underlay-reader.ts` `2e25e6c72b91f79b714081e45db3010e`, `underlay-song.ts` `d7f4f10c98b93823d55b0c957d5b42ab`. `git status` shows only the untracked `apps/web/omr-underlay/`, the model folder I made for the copy script.

## The answer first

1. **The share is the fix that holds; the dash limit is mixed.** `RUSSIAN_SHARE` 0.5 to 0.3 (`apps/web/src/lib/omr/underlay-language.ts:27`), with the dash limit left as built, raises every syllable measure over the 18 songs:
   - Read right goes 1,514 to 1,836 of 2,538.
   - (b) goes 1,451 to 1,671, (a) 1,591 to 1,848, (c) 559 to 638, of 2,385 truth notes.
   - Systems with no Russian row go 37 to 19 of 239.
   - Songs the gate would write go 5 to 9 of 18.
2. **Raising the dash limit (`apps/web/src/lib/omr/underlay-tokens.ts:50`) helps B04 and (c), and costs the other measures once the share is 0.3.**
   - At share 0.5, limit 1.0 adds 92 read right (1,606).
   - At share 0.3, it takes away 66 read right at limit 0.75 and 90 at 1.0 (1,770 and 1,746), and 48 to 49 of (b).
   - At share 0.3, it adds 187 of (c) at 0.75 and 231 at 1.0.
   - B01 stays at 132 in every cell.
3. **Cost at share 0.3 and limit 0.5:**
   - 115 rows are called Russian that the harness labels other or notext, or that no harness row covers (83 as built).
   - 11 of them are seated (17 as built).
   - No dash is fused.
   - Raising the limit fuses 2 to 7 printed word pairs, all seated.
4. **Recommendation: share 0.3, dash limit left at 0.5.** If the desk values word-exact text (c) over the syllable measures, take limit 0.75 with share 0.3. That gives (c) +187, read right −66, (b) −48, and 3 fused pairs.
5. **All controls passed.** My fresh 18-song capture reproduced the real-page report's gate-off figures song by song (1,514 / 1,451 / 1,591 / 559).

## 1. Controls

I wrote `controls-before-measure.md` before any run. Against it:
- Expectation 1 (A1's numbers on A1's capture) held.
- The likeliest failure I named, the fresh capture differing from the real-page figures, did not happen.
- Expectation 4 (a gain of 50 to 250 for limit 1.0 and share 0.3) failed on size. The gain is 232 at limit 1.0 and 322 at limit 0.5.
- Expectation 5 (few junk rows seated) held only partly. 11 to 17 were seated, and "few" was a guess.

| control | result |
|---|---|
| Replay of A1's captured B01 and B04 (`tools/cells.mjs`, `tools/rrstream.py`, scored by stream as A1's `rr.py` does): as built | B01 132, B04 50, A1's numbers |
| Same, limit 1.0 | 132, 96, A1's numbers |
| Same, limit 1.0 and share 0.3 | 132, 114, A1's numbers |
| Replay's `seatPage` against the clone's real `seatPage`, and its language call against the app's own call recorded in the capture, on every page as built | 1,032 checks over 18 songs, 0 mismatches |
| Scorer (`scorer/score_app.py`, paths repointed to `/home/claude/a2`) on the real-page gate-off MusicXML | read right 1,514, (b) 1,451, (a) 1,591, (c) 559; all 18 per-song read-right figures equal the real-page report's gate-off column |
| Scorer on my own fresh capture's MusicXML (`cap/<L>/<L>.musicxml`) | identical, song by song |
| Scorer on the MusicXML my replay writes for the as-built cell | identical again |

There are two read-right routes, and they differ.
- The tables use the MusicXML route, which is the real-page report's and ties to 1,514.
- A1's `rr.py` scores the word stream before the join. It agrees on B01 (132) and B04 as built (50).
- At limit 1.0 B04 is 98 by MusicXML and 96 by stream.
- As built over all 18 songs the stream route gives 1,540. Six songs differ: B03, B08, B09, P, T, U1.
- I did not trace why.

## 2. Per-cell totals (18 songs, gate off)

"Songs that would write words" applies the gate as built to each cell. The brief's 12-cell by 18-song matrices are in the folder: `t-matrix-rr.md`, `t-matrix-b.md`, `t-matrix-a.md`, `t-matrix-c.md`, `t-matrix-nor.md`, with raw scores in `cell-scores.json`.

| cell (dash limit x ink height / share) | read right | (b) | (a) | (c) | systems with no Russian row (of 239) | songs written | rows called Russian | junk rows called Russian (other, notext, no harness row) | junk seated | real rows called Russian (of 255) | fused pairs |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.5 / 0.5 (as built) | 1,514 | 1,451 | 1,591 | 559 | 37 | 5 | 270 | 83 (32, 3, 48) | 17 | 187 | 0 |
| 0.5 / 0.4 | 1,736 | 1,605 | 1,773 | 625 | 26 | 7 | 297 | 91 (38, 4, 49) | 10 | 206 | 0 |
| **0.5 / 0.3** | **1,836** | **1,671** | **1,848** | 638 | 19 | 9 | 331 | 115 (55, 5, 55) | 11 | 216 | 0 |
| 0.75 / 0.5 | 1,578 | 1,507 | 1,649 | 772 | 36 | 5 | 270 | 81 (30, 3, 48) | 16 | 189 | 2 |
| 0.75 / 0.4 | 1,674 | 1,567 | 1,720 | 804 | 29 | 8 | 285 | 88 (34, 4, 50) | 15 | 197 | 2 |
| 0.75 / 0.3 | 1,770 | 1,623 | 1,788 | 825 | 21 | 9 | 313 | 105 (44, 5, 56) | 15 | 208 | 3 |
| 1 / 0.5 | 1,606 | 1,543 | 1,688 | 837 | 34 | 6 | 271 | 80 (29, 3, 48) | 16 | 191 | 4 |
| 1 / 0.4 | 1,673 | 1,580 | 1,734 | 857 | 30 | 6 | 283 | 87 (33, 4, 50) | 15 | 196 | 4 |
| 1 / 0.3 | 1,746 | 1,622 | 1,785 | 869 | 24 | 7 | 311 | 105 (44, 5, 56) | 14 | 206 | 4 |
| 1.25 / 0.5 | 1,614 | 1,548 | 1,692 | 838 | 35 | 6 | 272 | 81 (28, 4, 49) | 14 | 191 | 7 |
| 1.25 / 0.4 | 1,681 | 1,585 | 1,738 | 858 | 31 | 6 | 284 | 88 (32, 5, 51) | 13 | 196 | 7 |
| 1.25 / 0.3 | 1,754 | 1,627 | 1,789 | 866 | 25 | 7 | 312 | 106 (43, 6, 57) | 12 | 206 | 7 |

Read right per song and cell (printed syllables in the second column; cell labels are limit/share):

| song | printed | 0.5/0.5 | 0.5/0.4 | 0.5/0.3 | 0.75/0.5 | 0.75/0.4 | 0.75/0.3 | 1/0.5 | 1/0.4 | 1/0.3 | 1.25/0.5 | 1.25/0.4 | 1.25/0.3 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| B01 | 147 | 132 | 132 | 132 | 132 | 132 | 132 | 132 | 132 | 132 | 132 | 132 | 132 |
| B02 | 86 | 69 | 69 | 68 | 47 | 47 | 55 | 69 | 69 | 69 | 69 | 69 | 69 |
| B03 | 147 | 83 | 118 | 118 | 105 | 118 | 118 | 104 | 117 | 117 | 104 | 117 | 117 |
| B04 | 148 | 50 | 98 | 98 | 98 | 98 | 116 | 98 | 98 | 116 | 98 | 98 | 116 |
| B06 | 142 | 58 | 74 | 77 | 58 | 74 | 77 | 58 | 74 | 77 | 58 | 74 | 77 |
| B07 | 151 | 71 | 81 | 90 | 57 | 67 | 90 | 57 | 67 | 90 | 57 | 67 | 90 |
| B08 | 141 | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| B09 | 139 | 103 | 103 | 101 | 103 | 103 | 101 | 103 | 103 | 101 | 103 | 103 | 101 |
| B10 | 148 | 84 | 84 | 84 | 79 | 79 | 84 | 74 | 74 | 79 | 74 | 74 | 79 |
| K | 131 | 49 | 79 | 97 | 73 | 86 | 97 | 69 | 86 | 97 | 69 | 86 | 97 |
| M | 53 | 50 | 50 | 50 | 33 | 50 | 50 | 33 | 33 | 33 | 33 | 33 | 33 |
| P | 177 | 4 | 30 | 91 | 18 | 18 | 49 | 18 | 18 | 34 | 18 | 18 | 34 |
| S | 109 | 87 | 98 | 92 | 98 | 98 | 92 | 98 | 98 | 92 | 100 | 100 | 94 |
| T | 200 | 118 | 147 | 165 | 136 | 152 | 152 | 152 | 152 | 152 | 165 | 165 | 165 |
| U1 | 97 | 89 | 89 | 89 | 89 | 89 | 89 | 89 | 89 | 89 | 89 | 89 | 89 |
| U4 | 112 | 75 | 86 | 86 | 75 | 86 | 86 | 75 | 86 | 86 | 75 | 86 | 86 |
| U5 | 258 | 185 | 185 | 185 | 182 | 182 | 182 | 182 | 182 | 182 | 182 | 182 | 182 |
| U6 | 152 | 107 | 113 | 113 | 95 | 95 | 100 | 95 | 95 | 100 | 88 | 88 | 93 |
| ALL | 2,538 | 1,514 | 1,736 | 1,836 | 1,578 | 1,674 | 1,770 | 1,606 | 1,673 | 1,746 | 1,614 | 1,681 | 1,754 |

## 3. Per-song table: as built and recommended (0.5 / 0.3)

K and M have no syllable truth, so their (b), (a), (c) are 0. Their read right is scored against the poem text as in the real-page report.

| song | printed | AS BUILT: read right | (b) | (a) | (c) | no-Russian systems | writes | 0.5/0.3: read right | (b) | (a) | (c) | no-Russian systems | writes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| B01 | 147 | 132 | 132 | 141 | 67 | 0 | yes | 132 | 132 | 141 | 67 | 0 | yes |
| B02 | 86 | 69 | 66 | 74 | 23 | 1 | no | 68 | 74 | 82 | 22 | 0 | yes |
| B03 | 147 | 83 | 97 | 104 | 26 | 1 | no | 118 | 124 | 134 | 34 | 0 | yes |
| B04 | 148 | 50 | 65 | 73 | 21 | 3 | no | 98 | 102 | 112 | 40 | 1 | no |
| B06 | 142 | 58 | 73 | 87 | 36 | 3 | no | 77 | 84 | 101 | 42 | 1 | no |
| B07 | 151 | 71 | 68 | 86 | 17 | 4 | no | 90 | 87 | 108 | 18 | 2 | no |
| B08 | 141 | 100 | 104 | 116 | 49 | 0 | yes | 100 | 104 | 116 | 49 | 0 | yes |
| B09 | 139 | 103 | 95 | 105 | 38 | 3 | no | 101 | 96 | 107 | 38 | 2 | no |
| B10 | 148 | 84 | 85 | 92 | 27 | 3 | no | 84 | 85 | 92 | 27 | 3 | no |
| K | 131 | 49 | 0 | 0 | 0 | 7 | no | 97 | 0 | 0 | 0 | 5 | no |
| M | 53 | 50 | 0 | 0 | 0 | 0 | yes | 50 | 0 | 0 | 0 | 0 | yes |
| P | 177 | 4 | 34 | 37 | 3 | 5 | no | 91 | 104 | 123 | 27 | 1 | no |
| S | 109 | 87 | 85 | 86 | 57 | 1 | no | 92 | 87 | 88 | 57 | 0 | yes |
| T | 200 | 118 | 126 | 136 | 39 | 2 | no | 165 | 156 | 167 | 52 | 0 | yes |
| U1 | 97 | 89 | 90 | 91 | 19 | 0 | yes | 89 | 90 | 91 | 19 | 0 | yes |
| U4 | 112 | 75 | 75 | 79 | 34 | 0 | yes | 86 | 84 | 93 | 42 | 0 | yes |
| U5 | 258 | 185 | 169 | 187 | 68 | 3 | no | 185 | 169 | 187 | 68 | 3 | no |
| U6 | 152 | 107 | 87 | 97 | 35 | 1 | no | 113 | 93 | 106 | 36 | 1 | no |
| ALL | 2,538 | 1,514 | 1,451 | 1,591 | 559 | 37 | 5 of 18 | 1,836 | 1,671 | 1,848 | 638 | 19 | 9 of 18 |

- As built, the gate writes B01, B08, M, U1 and U4. These are the real-page report's five.
- At 0.5/0.3 it writes B01, B02, B03, B08, M, S, T, U1 and U4.
- Nine songs still have a system with no Russian row: B04, B06, B07, B09, B10, K, P, U5, U6.
- Those are 19 systems in all. The largest counts are K 5, B10 3, U5 3, B07 2 and B09 2.
- The gain comes mostly from B03, B04, K, P, T, B06, B07 and U4 (+11 to +87 read right each).
- B09 loses 2 read right and B02 loses 1.

## 4. Cost of each cell

**Junk rows called Russian.**
- A row is junk when the app calls it Russian and the harness labels the row it overlaps `other` or `notext`. `labels2/` gives those labels, paired by overlap on the y axis as A1 did.
- A row is also junk when no harness row overlaps it ("no harness row": the piano area and the like).
- The totals and the split by kind are in section 2.
- A seated junk row is the first Russian row of its system, so it takes that system's notes.

As built, 17 junk rows were seated:
- B03 p1 s3 and p2 s3
- B04 p3 s2
- B06 p3 s4
- B07 p3 s1
- B10 p1 s3
- K p2 s2
- P p1 s2 and p3 s2
- S p1 s1 and p7 s1
- T p4 s2 and p6 s4
- U4 p2 s4
- U5 p1 s1
- U6 p2 s3 and p5 s3

At 0.5/0.3, 11 were seated:
- B02 p2 s4
- B06 p3 s3 and p3 s4
- B09 p2 s4
- B10 p1 s3
- S p1 s1, p2 s3 and p7 s1
- T p6 s4
- U5 p1 s1
- U6 p2 s3

Between those two cells, 7 are common, 4 are new at 0.3 (B02 p2 s4, B06 p3 s3, B09 p2 s4, S p2 s3), and 10 dropped. The 10 dropped because the real row above them is now called Russian and is seated first. The text read in each junk row is in `cost.json` (`junk_list`). I did not measure per note whether seating a junk row costs a syllable. The read-right and (b) totals include it.

**Real dashes fused.** A word counts as fused when it appears in a cell but not as built, and its folded letters equal two or three consecutive printed words joined (`tools/fused.py`, `fused-true.json`). This catches only fusions that match the print exactly. A fusion with a misread letter is not counted.

| limit | share | fused words (all seated) |
|---|---|---|
| 0.5 | any | none |
| 0.75 | 0.5 | B01 p2 s3 `памятниквосторженный`; B04 p1 s4 `снова.Из` |
| 0.75 | 0.3 | those two, and P p3 s3 `незнаю,;` |
| 1.0 | any | B01 `памятниквосторженный`; B04 `снова.Из`; U5 p4 s2 `нопотерянных,`; U6 p2 s1 `Молчасмотрю` |
| 1.25 | 0.3 | those four, and B03 p1 s1 `Люблю,но`; M p4 s4 `бай,бай!`; U6 p2 s1 `Молчасмотрюя`; U6 p6 s1 `глубьли` |

Whether `памятниквосторженный` is a real dash in the print is NOT ESTABLISHED. B01 gains or loses no syllable in any cell.

**One mechanism I traced.**
- B02 p2 s2 row 2 is `бе до то гой пи ли грима. и, не смы ка я`, 15 syllables. It is called Russian and seated as built.
- At limit 0.75 with share 0.5 it is not called Russian, and its 15 syllables leave the stream. B02 read right goes 69 to 47.
- I did not trace why row by row. The cause is inferred from the row's flag changing.
- Other losses from a higher limit (B10, M, U5, U6, B07 at share 0.5) are not traced.

## 5. Recommendation

**Set `RUSSIAN_SHARE` to 0.3 (`underlay-language.ts:27`) and leave the dash limit at 0.5 (`underlay-tokens.ts:50`).**

- **Against as built:**
  - Read right +322, (b) +220, (a) +257, (c) +79.
  - Systems with no Russian row 37 to 19.
  - Songs written 5 to 9.
  - No fused words.
  - Seated junk 17 to 11.
- **Against the dash fix alone (1.0 / 0.5):**
  - Read right 1,836 against 1,606, (b) 1,671 against 1,543, (a) 1,848 against 1,688.
  - (c) 638 against 837.
  - Songs written 9 against 6.
- **Cost:** 115 rows called Russian that are not text rows (83 as built), 11 of them seated.
- **Alternative, if word-exact (c) is the goal:** limit 0.75 with share 0.3.
  - It gives (c) 825, which is +187 over 638.
  - Read right is −66, (b) −48, (a) −60.
  - 21 systems lack a Russian row against 19, and 3 words are fused.
- **Not examined:**
  - Share below 0.3.
  - A limit between 0.5 and 0.75.
  - A different fix for B04's remaining system without a Russian row. A1's alternative is to take the first text-sized row as Russian when a system has none.

## 6. Departures

1. **Container restart.**
   - It happened at about 16:45 container time and killed the preview server and every background run.
   - B01, B02, B03, B04 and B06 were complete before it.
   - B07 had no MusicXML. I moved that folder to `cap-B07-failed-first-attempt/` and re-ran it once; it completed.
   - The other 12 songs ran after the restart.
   - On resume I checked that the `[diag]` edit and the gate-off patch were still in the source (each marker found once, two files modified) and that the build was still the patched build.
   - Then I restarted `vite preview` with `run_in_background`.
2. **Serialisation.**
   - Each song was its own `run_in_background` command.
   - A `flock` in `runsong.sh` let one run at a time. `ps` showed one `measure.mjs` at a time.
   - Order was the lock's order, not alphabetical.
3. **`pkill -f "vite preview"` ended my own shell** after the capture. The brief warns of this. I had restored the sources first, and I repeated the later steps in the next call.
4. **The build is still the patched build** (diag edit plus gate off). I restored the source but did not rebuild. `apps/web/build/` is git-ignored.
5. **The 12 cells are a replay, not app runs.**
   - Each cell runs the clone's own `underlay-language.ts`, `underlay-tokens.ts`, `underlay-units.ts`, `underlay-seat.ts`, `underlay-words.ts`, `underlay-page.ts` and `join-pages.ts` on the captured reads (`tools/cells.mjs`).
   - The dash limit is passed as `inkHeight` scaled from 0.5.
   - The share is replaced in a local copy of the language test, as A1's `seatvar.mjs` did.
   - The as-built cell equals the app's own output on all 18 songs.
6. **Page matching for the cost section.**
   - The app's page numbers count the pages it read; the harness's do not (M: app pages 3 and 4 are harness pages 1 and 2).
   - `cost.py` matches an app page to a harness page by the number of rows whose top and bottom agree within 4 px, with identity on a tie (`pagemap.json`).
   - My first version matched by overlap and was wrong, so I replaced it.
   - The match for K page 5 (to harness page 1) was not checked by eye.
7. **Fusion is measured only against exact print matches** (section 4), not by looking at crops.
8. **Scoring route:** section 1 explains the two read-right routes. The tables use the MusicXML route.
9. **Files outside the brief's list:** `tools/` (scripts); `scorer/` (a copy of the real-page scorer with `/root/...` paths changed to `/home/claude/a2/...`, and no other change); `measures/` and `n135work/` (wordlist copies for those paths).
10. **Token count:** I have no count of tokens used.

## 7. What I could not establish

- Why the two read-right routes differ on B03, B08, B09, P, T and U1 as built, when the replay's MusicXML equals the app's.
- Why a higher dash limit removes whole rows from the Russian set on B10, M, U5, U6 and B07. I traced only B02 p2 s2.
- Whether seated junk rows cost syllables, note by note.
- Whether the page match for K page 5 is right. The "no harness row" class, which includes piano-area rows, was not checked by eye.
- Whether `памятниквосторженный` is a real dash in the print.
- Anything about camera pictures or other scan sizes, or about share values below 0.3.
- Which fix would pass the nine songs still held by the gate at 0.5/0.3.
- A1's third item (homr omitting the piano's upper staff box, `underlay-band.ts:97-99`). It was out of scope and is unchanged.

## Files

- Report: not written (see the top). The tarball holds everything in the folder except the clone and the unpacked inputs.
- `/home/claude/a2/controls-before-measure.md`
- `/home/claude/a2/cap/` (the 18 captures) and `/home/claude/a2/cap-B07-failed-first-attempt/`
- `/home/claude/a2/cells/` (replay output and the 12 cell MusicXML per song)
- `/home/claude/a2/cell-scores.json`, `cost.json`, `fused-true.json`, `pagemap.json`
- `/home/claude/a2/t-totals.md`, `t-matrix-*.md`, `t-persong.md`
- `/home/claude/a2/tools/`
- `/home/claude/a2/orig/` (the saved original source files)

For the main session to save: the container restart cost about 30 minutes, and `pkill` ends the helper's own shell.
