# Report: the printed metre, round 6, run 3: the join and the 17 (QUEUE row 57)

Code (Opus), 2026-10-11, about 13:35 to 14:20, on the Mac, branch `Shane`, HEAD `8cc6202`. The working tree held the desk's uncommitted `docs/memory/` changes and an edited memo; I touched only row 57 of `QUEUE.md`. Brief: `brief-code-the-metre-seen-and-summed_r6-runs3-4_2026-10-11.md`, read whole, then r6 (sections 1.7, 1.8, 2.1 to 2.4, the constraints, "Done when"), the run 1 and run 2 reports, and `OPEN.md`'s "ROW 57 r6 SPLIT INTO FOUR RUNS". No git command that writes was run. Nothing whose name begins `heldout2` was opened. No song outside the 17 was read in this run.

## The answer first: wired, and the 17 meet every condition

- **29 signatures stated on the 17 songs, each at its printed bar with its printed figure. 0 false.** This was checked against row 37's table of printed places, bar by bar.
- **Notes: no song lower.** Every song's right notes are the same before and after.
- **The scorer's metre field: 666 → 674 of 721.** No song is lower. *Sunless* 4, Kabalevsky nos. 4, 6, 7, and 9 rise.
- **All 7 one-bar changes return** under the desk's exception. Under the exception, 0 of 173 wrong proposals of another length pass at those places, so the exception stays.
- **The reader runs in a Worker of its own.** It adds 1.8 to 12.6 seconds a song in the drop box (7.4 on average), because it reads each page while homr reads the next.
- **Gates:** all eight pass. Gate 4 moves **2167 → 2180** (+13 tests); the other seven are at baseline.
- **Hash:** `43be241e5e6dcb5ad38895484fd1e6af458073fd6b23a4a933acfd10fa98b662`.
- **One change I made that the brief did not name (DESK DEFAULT, section 2):** a bar the tuplet checks changed from homr's notes alone, under a proposal, is not counted for that proposal. Without this, a wrong signature two thirds as long as the page's would pass.

## 1. The 17, before and after

Before: run 1's read at `9ad4082`. Only the metre reader's own files changed in `apps/` since then, and the 16 songs read then matched round 5 byte for byte. After: the same drop-box path (`dropread7.mjs`: `rasterizePdf`, `makeReader` with the app's own dependencies, now including the metre Worker, and `joinLookingAtPages`), headless Chrome on WebGPU, on the dev build with this change.

| Song | Notes right, before → after | Scorer's metre, before → after | Stated (bar: figure) | Seconds added |
|---|---|---|---|---|
| Tchaikovsky op. 38 no. 3 | 171 → 171 of 174 | 83 → 83 of 83 | 1: 3/8 | 9.6 |
| *Sunless* 1 | 94 → 94 of 96 | 17 → 17 of 17 | 1: 6/4 | 4.2 |
| *Sunless* 4 | 116 → 116 of 116 | 26 → **27** of 27 | 1: C; 22: 2/4; 23: C | 6.6 |
| *Sunless* 5 | 246 → 246 of 258 | 58 → 58 of 58 | 1: C | 9.0 |
| *Sunless* 6 | 155 → 155 of 161 | 48 → 48 of 48 | 1: C | 6.0 |
| Kabalevsky no. 1 | 150 → 150 of 152 | 61 → 61 of 61 | 1: 3/4 | 9.0 |
| no. 2 | 93 → 93 of 157 | 37 → 37 of 37 | 1: 2/4 | 8.4 |
| no. 3 | 157 → 157 of 157 | 44 → 44 of 44 | 1: 4/8 | 9.0 |
| no. 4 | 150 → 150 of 151 | 29 → **32** of 32 | 1: 4/4; 14: 3/4; 16: 4/4; 35: 2/4; 36: 4/4 | 6.6 |
| no. 6 | 153 → 153 of 153 | 32 → **34** of 34 | 1: 4/4; 20: 2/4; 21: 4/4; 22: 2/4; 23: 4/4 (courtesy 4/4 set aside) | 7.8 |
| no. 7 | 160 → 160 of 163 | 38 → **39** of 39 | 47: 9/8; 48: 6/8 (bar 1 not read: section 4) | 9.0 |
| no. 8 | 154 → 154 of 154 | 31 → 31 of 31 | 1: 4/4 | 7.2 |
| no. 9 | 143 → 143 of 149 | 30 → **31** of 31 | 1: 4/4; 30: 3/2; 31: 4/4 (courtesy 3/2 set aside) | 8.4 |
| no. 10 | 154 → 154 of 156 | 70 → 70 of 70 | 1: 3/4 | 12.6 |
| Gurilyov | 152 → 152 of 153 | 29 → 29 of 29 | 1: C | 7.8 |
| Grechaninov | 153 → 153 of 154 | 9 → 9 of 56 | nothing: no voice staff is found on its grey scan (14 voice boxes, none found), as in every round | 1.8 |
| Varlamov | 61 → 61 of 63 | 24 → 24 of 24 | 1: 3/8 | 3.6 |
| **Total** | **no song lower** | **666 → 674 of 721** | **29 of 32 printed places; 0 false** | **mean 7.4; 14.3 → 16.4 min for the 17** |

- **Every other bar start: nothing new is stated.** The join stated nothing anywhere but the 29 places above. Each statement is listed with its reason in `run3/after-metre-logs.json`.
- **The 3 printed places not stated** are Kabalevsky no. 7, bar 1, and Grechaninov's two (bar 1, 2/4, and bar 10, 6/8). Kabalevsky no. 7, bar 1, and Grechaninov bar 1 already carry the printed figure from homr. Grechaninov bar 10 stays 4/8, so its 47 bars stay wrong in the scorer's field.
- **"Does not add up"** (`aggregatePhonation`'s untrusted bars, the count behind `insights.phonation.untrustedOne` and `insights.fit.withheldOne`): **0 before and 0 after** on all 17. This was measured by parsing each joined reading with the score parser in the browser (`addup.mjs`); it was not read off the Insights page.
- **The two pictures,** from the dev build's Markup, each with the printed bars beside it (`docs/sessions/metre-shots/`):
  - **Kabalevsky no. 4:** 3/4 at bar 14 and 4/4 at bar 16, as printed.
  - **Grechaninov:** 4/8 at bar 10, where the page prints 6/8. This is unchanged by this row.

## 2. The join

How each piece works:

- **Where a signature belongs.** A window's statement is placed on a bar through homr's note places (`barOfWindow`, `metre-witness.ts:116`). After a bar line, the bar whose leftmost note on that staff stands furthest left, at or right of the window, as round 5 placed it.
  - **DESK DEFAULT, at a system start:** the first bar in order with a note or rest on that staff. homr places a whole rest anywhere in its bar: Kabalevsky no. 6, bar 1's rest stands right of bar 2's, so the round-5 rule put that 4/4 on bar 2.
- **Courtesies** (after a staff's last bar line, with under six spaces left) are set aside, and the console says so (`proposalsOf`, `join-pages.ts:495`).
- **Witness 5, bounded,** with the desk's one-bar exception (`witness`, `metre-witness.ts:201`):
  - The first four countable bars the proposal governs; at least two of them, every one adding up.
  - A proposal governs to the reader's next statement.
  - The exception: one bar, where the next bar prints a signature of the same length as the metre before. That one bar must be countable and add up.
- **The tuplet checks run under each proposal.** Each proposal is tried in a full join with the signatures already stated plus itself (`joinPages`, `join-pages.ts:524` to `:572`). In the bars it governs, `completeTriplets` runs under the proposed metre, and the sums are taken from that join's own bars. Under a stated signature the checks run in its first bar too, because the metre is no longer homr's guess (`join-pages.ts:275`).
- **DESK DEFAULT, not named by the brief: a bar the tuplet checks changed from homr's notes alone (rules 1 to 3) is not counted for or against the proposal** (`join-pages.ts:556`, `metre-witness.ts:201`). A bar changed because a printed number was read still counts.
  - Why: run under a signature two thirds as long as the page's (2/4 over bars of 3/4, C over 6/4), rule 1 reads every bar as triplets, the bars then add up, and the wrong signature passes. A test caught it.
  - On the 17 this costs nothing: every printed place is stated.
  - It also keeps r2's aim: a bar of triplets homr dropped never vetoes a right figure. Such a bar is simply not counted.
- **Persistence (DESK DEFAULT, how to read r6 section 1.8).**
  - A stated signature holds until the reader's next statement. homr's own `<time>` statements in between are left out, and homr's metre is tracked apart (`InForce.homrTime`, `join-pages.ts:328`).
  - Where the reader's next statement is not stated, homr's metre in force there is written back (`join-pages.ts:255`).
  - Where the reader saw nothing at all, the join is exactly as before (a test checks this byte for byte).
- **C and cut C** are written as `<time symbol="common">` and `<time symbol="cut">`, which the score parser reads (`packages/score-parser/src/musicxml-parser.ts:454`).
- **The console:**
  - each proposal with its verdict and reason: `[omr] metre: bar 14 (page 1): 3/4 stated: 2 bars add up to 3/4`;
  - each courtesy set aside;
  - each page's reading time and the voice staves not found.
- **No mark, flag, or word on the page or the Loupe.** `i18n.ts` is untouched.

## 3. Off the page's thread (the desk's ruling 2)

`metre.worker.ts` is a module Worker that decodes the page image and runs the network on WebAssembly. `metre-client.ts` starts it on the first page and keeps it.

- **When it reads:** `homr-reader.ts` asks for each page's metres as soon as homr answers that page (`:300`). The reading overlaps homr's work on the next page, and the join waits for all of them (`:366`).
- **What it costs:** 1.8 to 12.6 seconds a song in the drop box, 7.4 on average. The 17 took 14.3 minutes before and 16.4 after.
- **What it needs:** it is used only where the browser has `Worker` and `OffscreenCanvas` (`:398`).
- **When it fails:** a page or a Worker that fails answers null, the console says why, and that page joins as before.

## 4. The desk's rulings 3 and 4

- **The 45 extra bar windows** stay as built. How many state anything on A to F and G to O is run 4's to report.
- **Kabalevsky no. 7, bar 1, traced.** Seven of the nine readings state 6/8 with confidence 0.99. In the two readings at scale 0.95 (offsets −0.1 and +0.1), the 6's own upright stroke peaks separately as a "1" at 0.35, exactly 0.8 space left of the 6. 0.8 is the edge of the peak rule's merging distance (`GAP`, `decode5.py`, `metre-reader.ts`). Those two readings say "16/8", below the cut, so the nine do not agree and nothing is stated.
  - **Not fixed:** a fix changes the peak rule for every window and every reading, and would need step 0 measured again. It is not a general fix of the kind the ruling allows without that.

## 5. Each change, with its place

| Path | What |
|---|---|
| `apps/web/src/lib/omr/metre-witness.ts` (new, 221 lines) | `MetreSeen`, `barOfWindow` (`:116`), `barFacts` (`:148`), `countable` (`:174`), `witness` (`:201`), `lengthOf`, `timeElement`, `labelOf` |
| `apps/web/src/lib/omr/metre-witness.test.ts` (new) | 13 tests: the sums and the bar rule; seen and summed is stated; seen and not summed is not (including a proposal made to fit only by guessed triplets); bars adding up to another metre with nothing seen change nothing; C and cut C; the one-bar exception, and a one-bar change with no return; a courtesy set aside; persistence over homr's own change; homr's metre given back; the tuplet checks under the stated signature; a system start's bar |
| `apps/web/src/lib/omr/join-pages.ts` | header (the new item); `Plan` (`:202`); stating and resuming in `rewriteMeasure` (`:213` to `:258`); the tuplet checks under a stated signature (`:275`); homr's `<time>` tracked apart (`:328`); `SeenMetres` and `proposalsOf` (`:489`, `:495`); `joinPages` builds trials and states what witness 5 confirms (`:524` to `:572`) |
| `apps/web/src/lib/omr/homr-reader.ts` | `ReaderDeps.metres` (`:95`); each page's metres asked for as homr answers it (`:300`); passed to the join, and the join's metre lines logged (`:366` to `:372`); the app's reader uses the Worker (`:398`) |
| `apps/web/src/lib/omr/metre.worker.ts` (new, 60 lines) | the Worker |
| `apps/web/src/lib/omr/metre-client.ts` (new, 59 lines) | the Worker's client, which never rejects |
| `docs/sessions/metre-shots/` (new) | the two pictures |

Unchanged in this run: `metre-reader.ts`, `metre-windows.ts`, `metre-model.ts`, the model files, `triplets.ts`, the score parser, and `i18n.ts`.

**The stamp:** `READER_STAMP` is not changed (DESK DEFAULT, as for rows 54, 56, and 61, which also changed the join). A reading kept before this change is used again as it was. Only a new drop, or a stamp change, reads a song with the metre reader.

## 6. Tests, gates, and the hash

All eight gates were run from a scratch copy of `~/Downloads/ilya-ship.sh` that cannot stage (`run3/gates-scratch3.sh`):

| Gate | Baseline | Now |
|---|---|---|
| 1 phonology | 251 | 251 |
| 2 dictionary | 242 | 242 |
| 3 web check | 0 errors, 12 warnings in 5 files | the same |
| 4 web tests | 2167 | **2180** (+13, `metre-witness.test.ts`) |
| 5 score-parser | 653, 5 skipped | the same |
| 6 blurb | 145 | 145 |
| 7 integration | 55 | 55 |
| 8 ratchets | OK | OK |

**Hash:** `43be241e5e6dcb5ad38895484fd1e6af458073fd6b23a4a933acfd10fa98b662`. It is the SHA-256 of `git diff HEAD -- apps pnpm-lock.yaml`, followed by each untracked file under `apps/` with its SHA-256 (`run3/hash-input-run3.txt`). Read-only git only.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **The exception's safety beyond the 17.** 0 of 173 wrong proposals passed at the 7 one-bar places. Unseen songs are run 4's.
- **Whether leaving guessed-triplet bars uncounted costs right signatures elsewhere.** It cost none on the 17.
- **The seconds added on WebAssembly-only browsers, phones, or the iMac.** All reads ran on this Mac.
- **The persistence reading of r6 section 1.8.** "Until the reader's next statement" is my reading; another reading would keep homr's later changes.
- **Kabalevsky no. 7, bar 1:** not fixed (section 4).

## Files

| Path | What |
|---|---|
| `docs/sessions/report-code-the-metre-seen-and-summed_r6-run3_2026-10-11.md` | this report |
| `docs/sessions/measure-metre-r57-r6_2026-10-11/run3/` | `dropread7.mjs`, `addup.mjs`, `shot.mjs`, the gates script, the hash input, the "after" read log and lines, the metre lines and seconds added, and the "does not add up" counts |
| `docs/sessions/metre-shots/` | the two pictures |
| `~/Downloads/_code-metre-r6/after/` (outside the tree) | the "after" readings |
| `docs/memory/QUEUE.md`, row 57 only | status |
