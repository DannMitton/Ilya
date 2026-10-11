# Report: the printed metre, round 6, run 1: Python only (QUEUE row 57)

Code (Opus), 2026-10-11, 04:45 to 05:35, on the Mac, branch `Shane`, HEAD `9ad4082`. The working tree held the desk's uncommitted `docs/memory/QUEUE.md` and `STATE.md` and the untracked runs 1 and 2 brief; none was touched except row 57 of `QUEUE.md`. Brief: `brief-code-the-metre-seen-and-summed_r6-runs1-2_2026-10-11.md`, read whole, then r6, the r5 estimate, and `OPEN.md`'s "ROW 57 r6 SPLIT INTO FOUR RUNS". No git command that writes was run. Nothing whose name begins `heldout2` was opened, read, listed, or run. Songs A, B, C, E, F, and G to P were not run. Nothing in `apps/` changed.

## The answer first: step 0 passes, run 2 goes ahead

- **Step 0, the render stop: 0 same-length false signatures in 5,100** fresh renders (seeds 29000 + *f*). The reader without the guard states 2; the guard removes both.
- **4 false reads of another length remain**, all witness 5's to catch: Finale Legacy 1/1 read 1/4 and 6/16 read 8/16, Sebastian 5/4 read 6/4, Finale Ash 11/4 read 1/4.
- **The bounded span accepts 0 of 15,307 wrong proposals of another length** on real pages (round 5's rule accepted 2).
- **All 7 right signatures that round 5's witness 5 rejected return** under the bounded span. **It costs 7 others:** a printed change that lasts one bar governs one countable bar, and the rule asks for two (section 6).
- **The "before" read is round 5's byte for byte** on the 16 songs both read, and the scorer's metre field reads 666 of 721 bars, as row 37 measured.

## 1. The 17's "before" table

Read through the drop box on the dev build at `9ad4082`, before any other step: `dropread6.mjs` (round 5's `dropread.mjs`, also keeping each page's staff boxes and page images for run 2), headless Chrome on WebGPU, stamped `homr-web@0.2.0-ilya.6/465`, 14.3 minutes for the 17. Scored with `conv.py` and `final-line.ts`, unchanged. Each reading's MusicXML equals round 5's, page by page and joined, on the 16 songs round 5 read; Grechaninov is new.

"In force" is the metre Ilya's reading carries at the bar the place maps to. homr writes a printed C as 4/4, with no `symbol` attribute in any reading.

| Song | Notes right | Score | Scorer's metre (by length) | Printed places: printed → in force |
|---|---|---|---|---|
| Tchaikovsky op. 38 no. 3 | 171 of 174 | 98.3 | 83 of 83 | 3/8 → 3/8 |
| *Sunless* 1 | 94 of 96 | 97.9 | 17 of 17 | 6/4 → 6/4 |
| *Sunless* 4 | 116 of 116 | 100.0 | 26 of 27 | C → 4/4; 2/4 → **4/4**; C → 4/4 |
| *Sunless* 5 | 246 of 258 | 91.5 | 58 of 58 | C → 4/4 |
| *Sunless* 6 | 155 of 161 | 96.3 | 48 of 48 | C → 4/4; **2/2 stated at bar 44, where nothing is printed** |
| Kabalevsky no. 1 | 150 of 152 | 98.7 | 61 of 61 | 3/4 → 3/4 |
| no. 2 | 93 of 157 | 59.2 | 37 of 37 | 2/4 → 2/4 |
| no. 3 | 157 of 157 | 100.0 | 44 of 44 | 4/8 → 4/8 |
| no. 4 | 150 of 151 | 99.3 | 29 of 32 | 4/4 → 4/4; 3/4 → **4/4**; 4/4 → 4/4; 2/4 → **4/4**; 4/4 → 4/4 |
| no. 6 | 153 of 153 | 100.0 | 32 of 34 | 4/4 → 4/4; 2/4 → **4/4**; 4/4 → 4/4; 2/4 → **4/4**; 4/4 → 4/4 (and a courtesy 4/4) |
| no. 7 | 160 of 163 | 98.2 | 38 of 39 | 6/8 → 6/8; 9/8 → **6/8**; 6/8 → 6/8 |
| no. 8 | 154 of 154 | 100.0 | 31 of 31 | 4/4 → 4/4 |
| no. 9 | 143 of 149 | 96.0 | 30 of 31 | 4/4 → 4/4; 3/2 → **4/4**; 4/4 → 4/4 (and a courtesy 3/2) |
| no. 10 | 154 of 156 | 98.7 | 70 of 70 | 3/4 → 3/4 |
| Gurilyov | 152 of 153 | 99.3 | 29 of 29 | C → 4/4 |
| Grechaninov | 153 of 154 | 99.4 | 9 of 56 | 2/4 → 2/4; 6/8 → **4/8** (from homr's `<time>`; no staff is found on its grey scan, so no window) |
| Varlamov | 61 of 63 | 95.2 | 24 of 24 | 3/8 → 3/8 |
| **Total** | | | **666 of 721** | **19 of 32 by figure, 24 of 32 by length** |

- **Every other bar start (782 windows):** 595 carry nothing new; 1 states a metre where nothing is printed (*Sunless* 6, 2/2); 186 map to no bar of homr's, so they are not judged.
- **Kabalevsky no. 2 reads 59.2** (64 notes missing, 41 of 70 bars). This is today's state, and round 5's reading is the same byte for byte; it is not this row's.
- Lines: `measure-metre-r57-r6_2026-10-11/run1/before-lines.txt`; table: `run1/before-signatures.json`.

## 2. The split and the network

- **Seed 57 drew the 4 tuning songs from the 16 that have windows:** Tchaikovsky op. 38 no. 3, and Kabalevsky nos. 3, 6, and 9. They hold 10 printed places and both courtesies.
- **The 13 training songs:** *Sunless* 1, 4, 5, and 6, Kabalevsky nos. 1, 2, 4, 7, 8, and 10, Gurilyov, Grechaninov, and Varlamov. *Sunless* 2 and 3 are trained on too, as in rounds 4 and 5.
- **DESK DEFAULT:** Grechaninov counts among the 13. It has no window, so it gives no crop to train on and nothing to tune on, either way.
- **Network A trained once:** 786,868 crops (250,000 figure and 350,000 other render crops of all ten music fonts and all 16 text faces, at signature scales 0.72 to 1.10 of the training songs, plus the training songs' own crops). 3 epochs, 175 seconds on the GPU.

## 3. The settings, set on the 4

Round 5's tuning rule, unchanged: for each centring tolerance and check setting, the lowest cut with 0 false on the 4 tuning songs and 300 tuning renders of the ten fonts (seed 5057), with witness 5 bounded (on renders SIMULATED from the 4 songs' bar sums); then the setting with most right.

| Setting | Value |
|---|---|
| Cut | 0.5 |
| Centring tolerance | 0.4 space |
| Unfamiliar shape | distance 7.54 (the 0.99 quantile of the tuning set's right marks) |
| Uncovered ink | 0.6 |
| C against cut C | a C with ink ratio above 0.10 is void; a cut C is never voided (the tuning set's least cut C ratio is 0.0) |
| Right there | 6 of the tuning songs' 10 printed places; 83 of 300 tuning renders |

- **The cut is the lowest on the list.** With witness 5 in the tuning, no lower cut admits a false statement on the tuning sets. The same reader tuned without witness 5 takes cut 0.8 and reads 10 of 10; it is reported for comparison only and does not ship.
- **Unfamiliar shape ships.** Round 5's reference (3,000 crops a class, 6,912,000 bytes) does not fit section 1.3's 200 KB. **DESK DEFAULT:** a reference of 80 crops a class, drawn by seed 57: 184,320 bytes of float16 features and 960 bytes of classes. The network's second output, its 96 penultimate features, adds 339 bytes to the ONNX file (689,387 against round 5's 689,048). **185,619 bytes beyond the model.** The setting above was tuned with this reference.

## 4. The same-length margin: 0.80

- **Rivals (DESK DEFAULT):** signatures of the same bar length whose marks stand in the same seats: C against cut C; and figures with as many digits in each seat (4/4 with 2/2 and 1/1; 2/4 with 4/8 and 1/2; 3/4 with 6/8; 3/2 with 6/4). C against 4/4 needs other marks in other seats, so it is not a rival here.
- **The margin of a statement** is the least, over the nine readings and every rival, of the stated class's probability less the rival's, at each mark where the two differ.
- **On the tuning sets at the tuned settings** (the 4 songs, the 300 tuning renders, and 3,000 more tuning renders, seed 6057), without witness 5:
  - One same-length false: a cut C read as C, margin 0.72.
  - One cut C stated where nothing is printed, margin 0.76.
  - Right statements with a rival: 1,085; the least margin 0.13, the 1 percent quantile 0.71.
- **DESK DEFAULT: 0.80, the smallest step of 0.05 above every false statement on the tuning sets that has a rival.** It costs 19 of 1,599 right render statements with a rival, and none of the tuning songs' 9.

## 5. Step 0, the render stop

Round 5's fresh renders (seeds 29000 + *f*, 300 a fold, 5,100), read by the shipped network in nine readings, with the checks and the guard, without witness 5.

| | Count |
|---|---|
| Found | 2,385 |
| Missed | 690 |
| Nothing printed, nothing stated | 2,021 |
| **False, same length** | **0** (2 without the guard) |
| False, another length | 4 |

The 4, by kind, each witness 5's to catch:

- Finale Legacy: 1/1 read 1/4 (a lost figure's length), and 6/16 read 8/16.
- Sebastian: 5/4 read 6/4.
- Finale Ash: 11/4 read 1/4 (a lost 1).

By the brief's design, this network saw all ten fonts in training. Step 0 tests same-length swaps on fonts it has seen, not on fonts it has not.

## 6. Witness 5 with the bounded span

`w5power6.py` repeats round 5's power test on the "before" bars: at each of the 814 bar starts, each of the 27 wrong metres from round 4's rendered false list is proposed in place of the metre in force, over the bars to the next printed place.

**DESK DEFAULT, the bounded rule as read:** take the countable bars the proposal governs, in order; keep the first four; state only if at least two remain and every one sums to the proposal.

| Proposal | Rule | Accepted | Rejected | Too few countable bars |
|---|---|---|---|---|
| Another length (15,307) | round 5's | 2 | 15,202 | 103 |
| Another length (15,307) | **bounded** | **0** | 14,566 | 741 |
| Same length (1,021) | round 5's | 807 | 214 | |
| Same length (1,021) | bounded | 930 | 44 | 47 |

- **A fault in round 5's `w5.py`, fixed here:** it counted cut C as two quarters. Cut C is 2/2, four quarters. So 2 metres move between rows: round 5's 15,494 and 834 become 15,307 and 1,021 here. Round 5's other-length acceptances are unchanged at 2.
- **The 7 returns.** Proposed with their own printed label over the span to the next printed place, all 7 right signatures round 5 rejected are accepted by the bounded span: bar 1 of *Sunless* 1, 4, and 5, Kabalevsky nos. 1, 6, and 7, and Gurilyov. In each, the first four countable bars all sum to the printed length.
- **With this run's reader stating them** (configuration 2 on the 16 songs, `run1/songs.json`): 6 of the 7 are stated and kept. Kabalevsky no. 7, bar 1, is not stated by this network at all.
- **What the bounded span costs.** A printed change that lasts one bar governs one countable bar, and the rule asks for two. With this run's reader, witness 5 now rejects 7 right signatures:
  - *Sunless* 4, bar 22 (2/4);
  - Kabalevsky no. 4, bar 35 (2/4);
  - Kabalevsky no. 6, bars 20, 21, and 22 (2/4, 4/4, 2/4);
  - Kabalevsky no. 7, bar 47 (9/8);
  - Kabalevsky no. 9, bar 30 (3/2).

  The 2 courtesies are rejected too; they are set aside either way. This is the brief's rule as written, so I kept it. Whether a one-bar change should pass on one countable bar is the desk's call. The power test shows the cost of one bar: round 5's rule, which accepts one, let 2 wrong proposals through.

**The Python reader on the 16 songs**, this run's network and settings (a wiring reference for run 2, not unseen reading: the network trained on 12 of them):

- The reader alone states 29 of the 30 readable printed places. It misses Kabalevsky no. 7, bar 1.
- With the bounded witness 5, it states 22.
- It states **0 false at all 814 bar starts**, in both configurations.

## 7. Servers

- **Before I began:** nothing listened on 5173 or 4173 (`lsof`: only Ollama, on 11434 and 50813).
- **I started one:** `ilya-web` on 5173, through the preview tool, used for the "before" read. It stays up for run 2, and I stop it when I stop.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **Same-length swaps on fonts the network has not seen.** Step 0's fonts are all in training (the brief's design). Round 5's one same-length false (Sebastian cut C read C) was on a held-out font.
- **The margin rests on one same-length example** on the tuning sets (and one near one). How it generalises is NOT ESTABLISHED.
- **The C against cut C check never voids a cut C** at these settings, because one tuning render's cut C had no ink above or below the staff. Whether the check would hold on a real cut C is NOT ESTABLISHED: no opened song prints one.
- **Witness 5's verdicts with the tuplet checks run again under each proposal.** The bars summed are the join's, as in round 5. That change is run 3's.
- **Witness 5 on renders is SIMULATED**, as in round 5.
- **Whether Kabalevsky no. 7, bar 1, fails in the readings or the checks.** Not traced.

## Files

| Path | What |
|---|---|
| `docs/sessions/report-code-the-metre-seen-and-summed_r6-run1_2026-10-11.md` | this report |
| `docs/sessions/measure-metre-r57-r6_2026-10-11/` (new, untracked) | the run's scripts (`dropread6.mjs`, `score17.py`, `train6.py`, `eval6.py`, `w5power6.py`, `before_table.py`, `export6.py`, and round 5's `w5.py` and `w5map.py` as changed); `run1/`: the "before" lines, signatures, read log, and HEAD; the tuning, margin, step 0, songs, and power results |
| `~/Downloads/_code-metre-r6/` (outside the tree) | the "before" readings and page images, the network (`run1/A.pt`, `metre-a.onnx`), the references, and the readings |
| `docs/memory/QUEUE.md`, row 57 only | status |
