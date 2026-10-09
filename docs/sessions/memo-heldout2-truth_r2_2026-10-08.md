Returned by an Opus helper, 2026-10-08, commissioned by the desk on Dann's yes of 19:52. Never ran a reader.

# Held-out set 2: truth for the last four songs

## Headline

- All four truth files are written: Arensky, Ippolitov-Ivanov, Lyapunov and Zhitomirsky. With the six from r1, the set of ten is complete.
- All four pass the self-check: every bar sums to its metre, `onsetAbsolute` agrees with the bar lengths, ids are unique, and the `conv.py` round trip returns the same events and bars. The node loader that repeats the loading lines of `score.ts` finds no malformed event or bar. The log is in `truth/selfcheck/selfcheck-log.txt` (r2 section).
- Four readings are UNSURE (section 2). Two of them are bars that do not add up as printed (Ippolitov-Ivanov bar 32, Zhitomirsky bar 9).

## How the work was done

- **Same conventions as r1.** I used `gen_truth.py` and `check_truth.py` unchanged, with the same source format in `truth/src/<slug>.txt` and the same schema.
- **Two additions, both my choice:**
  - Bars with no voice staff printed are counted as empty bars, for interludes and postludes as well as introductions.
  - A small alternative (ossia) note printed beside a main note is not recorded (Lyapunov bars 51 and 53).
- **A new staff-line finder.** The old finder took a hairpin above the staff for the top line on Ippolitov-Ivanov page 2. That put my first reading of bar 3 a third low. `scripts/lines.py` now finds the five lines in each window separately and rejects thick or wedge-shaped lines. The skewed Arensky pages 3 and 5 needed no hand fixes with it.
- **New measuring aids.** None of these is a reader.
  - `scripts/staffcrop.py` crops one staff and marks every line and space with a named tick at both ends.
  - `scripts/heads_r2.py` is `heads.py` using the new finder.
  - `scripts/vsheet.sh` builds the sheets.
  - `scripts/tops.py` lists staff tops.
- **One limit of the ticks.** They can sit off the lines next to a hairpin. Wherever a tick and my eye disagreed, I counted the staff lines directly on an enlargement.

## 1. The four songs

| Song | Bars | Notes | Rest events | Tuplet groups | Bars checked | Corrections from the checks |
|---|---|---|---|---|---|---|
| Arensky Op. 44/3 | 63 (59 to 62 postlude, no voice staff) | 110 | 22 | 0 | 63 by script; enlarged 3, 6, 7, 9, 10, 12, 13, 21 to 23, 33 to 35, 43, 44, 49, 50 | 3 (bars 21, 35, 49) |
| Ippolitov-Ivanov Op. 28/4 | 53 (bar 0 a 1/4 pickup; 39 to 52 postlude, no voice staff) | 134 | 33 | 1 (triplet, bar 25) | 53 by script; enlarged 3, 26, 29 to 32, 35 | 2 (bar 32 by sum, UNSURE; page 2 re-read after the finder fix, bar 3 changed) |
| Lyapunov Op. 51/1 | 82 | 235 | 6 | 0 | 82 by script; enlarged 18 to 20, 22 to 24, 27, 33, 47, 50 to 54, 63, 77 | 3 (bars 18, 33, 77), plus the ossia notes found in bars 51 and 53 |
| Zhitomirsky Op. 6/2 | 48 (14, 15, 24 to 27 no voice staff) | 116 | 54 | 13 (all duplets) | 48 by script; enlarged 6, 9, 11, 16, 18, 20, 21, 29, 32 to 41, 44 | 3 (bars 6, 36; bar 9 by sum, UNSURE) |

**Metre and key, in brief:**

- **Arensky:** treble, 1 flat, 2/4 throughout.
- **Ippolitov-Ivanov:** treble, 3 flats, 4/4. It changes to 3/4 at bar 28 and back to 4/4 at bar 32.
- **Lyapunov:** treble, 2 flats, 3/4. It changes to 2/4 at bar 63 and back to 3/4 at bar 69.
- **Zhitomirsky:** treble, 1 flat, 12/8. It changes to 9/8 at bar 15 and back to 12/8 at bar 30.

There are no clef or key changes in any of the four. Every correction is listed in full in `truth/<slug>.notes.md`.

## 2. UNSURE items (bar = measureIndex, from 0)

- **Ippolitov-Ivanov, bar 32.** C5 («кро») is printed as a quarter, and the bar then sums to 9/8. It is recorded as an eighth, because only then does the dotted E5 fall on beat 3 with the piano's half notes.
- **Zhitomirsky, bar 9.** The first F5 has a head that looks filled (a dotted quarter), and the bar then sums to 9/8. It is recorded as a dotted half tied to the F5 quarter, which fills the bar and fits the spacing.
- **Zhitomirsky, bar 20.** The figure over the middle group is smudged (a '2' over what may be a '3'). The group holds two eighths, so it is recorded as a duplet.
- **Zhitomirsky, bar 34.** The first note is a hollow head on the top line with a flat: Fb5. It is recorded as printed, but an engraving slip for E5 or Eb5 cannot be ruled out from the page.

## 3. Could not establish

- **Whether `scan-scorer.ts` accepts the extra fields, the `short` bar flag, and empty bars for a postlude.** Its source is not in the workspace (as in r1).
- **How the Finale truth files show ties, tuplets, pickups, ossia notes and bars with no voice staff.** I did not look; the conventions are r1's and mine.
- **The r1 helper's partial Arensky reading (to bar 19).** I found no text of it in `outputs/heldout2` or in its old work folder, which holds only page images. My Arensky reading starts fresh and is not compared with it.
- **Whether the four printed anomalies are engraving errors.** These are Ippolitov-Ivanov bar 32, Zhitomirsky bars 9 and 34, and the small alternative notes in Lyapunov bars 51 and 53. Settling them needs another edition or Dann's ear.
- **The words.** They were not transcribed, by instruction.

## Files

- Truth files: `truth/arensky_op44_no3_odin_zvuk_imeni`, `truth/ippolitov-ivanov_op28_no4_nevolnik`, `truth/lyapunov_op51_no1_podblyudnaya_pesenka` and `truth/zhitomirsky_op6_no2_belaya_luna`. Each has a `.truth.json` and a `.notes.md`.
- Readings: `truth/src/<slug>.txt`.
- Round trips: `truth/selfcheck/<slug>.conv-roundtrip.json`.
- New scripts: `scripts/lines.py`, `scripts/staffcrop.py`, `scripts/heads_r2.py`, `scripts/vsheet.sh` and `scripts/tops.py`.
- Budget: this run used about 380k tokens, at the limit. All four songs were finished.
