# Report: N.135 stage 2b r5, step 10, browser measure on 18 songs (helper, 2026-10-29, r1)

Measure only. Nothing was committed or pushed; no app code changed. Code: `cloud-lane-21` head `5ee29ec248c69395681f941ec8e97e2a4a653b4f` (checked), cloned at `/tmp/claude-0/-home-claude/b9285be6-e479-58ba-9f33-c16a0e4318f7/scratchpad/browser/ilya`. The only addition to the clone is the untracked model folder `apps/web/omr-underlay/`, as in the 2026-10-28 real-page run.

## The answer first

| measure | replay (step 5) | browser, step 10 | difference |
|---|---|---|---|
| read right, of 2,538 | 1,880 | **1,914** | +34 |
| (b) exact, of 2,385 | 1,710 | **1,737** | +27 |
| (a) nucleus | 1,870 | **1,906** | +36 |
| (c) word-exact | 640 | **640** | 0 |
| vowelless alone on a note | 79 | **81** | +2 |

Whether it holds: the real page gives at least what the replay gave on every measure but (c), which is equal, and vowelless alone is 2 higher. The gain is not spread out. Of 18 songs, 13 match the replay's read right exactly, and 5 differ: B10 +33, P +5, B07 +2, T -1, B06 -5. B10 alone is 33 of the 34. B01 (134) and B04 (100) equal the replay, so they held and did not gain on read right; their (b) also equals the replay's (133, 106).

## 1. Controls

Written before any run: `controls-before-measure.md`.

- Control 2, positive control of the scorer: `score_app.py` on A2's as-built cells (`replay/a2/a2/cells/d0.5_s0.5`), scorer copied into `scorer/` with paths repointed: **1,514 / 1,451 / 1,591 / 559** of 2,538 / 2,385, reproduced (`ctl-scores/`).
- Expectation: totals near the replay, B01 and B04 hold or gain, other songs within about 5 of the replay. It held for 13 songs and failed for B10 (+33). My named likeliest failure (different page layouts from step 3's worker change) is what the console rows show for B10 (section 4).

## 2. Setup

- `git clone --branch cloud-lane-21`; head 5ee29ec2. `pnpm install --frozen-lockfile` exit 0. Model copied from `a2-inputs/` (md5 2ff2af3e33461cd64e7d2015ef21d10d) into `apps/web/omr-underlay/`, `node scripts/copy-underlay-model.mjs` (writes the three files to `static/omr/models/underlay/`). `fetch-omr-models.mjs` ran inside `pnpm --filter @ilya/web build` (exit 0). Preview: `vite preview --port 4173`; the model is served (200, 7,827,478 bytes).
- Chromium: `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` (exists, used).
- **How the reader was turned on:** the hidden switch is the address query `?words=read`: `apps/web/src/lib/omr/underlay-switch.ts` lines 20 to 27 (`WORDS_QUERY`, `WORDS_ON`, `underlayOn`); `measure.mjs` line 77 opens `${url}/?words=read` unless `--off`. Every console has `[omr] underlay:` lines.
- One song at a time (`runsong.sh`, flock), `--timeout-s 2400`. The machine ran one song at a time with the scorer idle. No song timed out.

## 3. Per song

Replay columns are the replay report's step-4 prototype V4 (step 4 build plus K +4, S +2, T +4, which is its step 5). "Systems no Russian row" counts the systems named in the song's final `syllables written` line.

| song | printed | read right | replay | diff | (b) | replay (b) | diff | (a) | (c) | vowelless | systems no Russian row | s, drop to MusicXML |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| B01 | 147 | 134 | 134 | +0 | 133 | 133 | +0 | 141 | 67 | 3 | 0 | 464 |
| B02 | 86 | 77 | 77 | +0 | 80 | 80 | +0 | 86 | 19 | 2 | 0 | 311 |
| B03 | 147 | 121 | 121 | +0 | 128 | 128 | +0 | 138 | 34 | 3 | 0 | 497 |
| B04 | 148 | 100 | 100 | +0 | 106 | 106 | +0 | 115 | 38 | 10 | 1 | 473 |
| B06 | 142 | 72 | 77 | -5 | 86 | 86 | +0 | 102 | 42 | 2 | 3 | 449 |
| B07 | 151 | 95 | 93 | +2 | 86 | 86 | +0 | 107 | 19 | 8 | 1 | 658 |
| B08 | 141 | 101 | 101 | +0 | 108 | 108 | +0 | 117 | 51 | 5 | 0 | 466 |
| B09 | 139 | 102 | 102 | +0 | 98 | 98 | +0 | 115 | 35 | 8 | 1 | 554 |
| B10 | 148 | 117 | 84 | +33 | 114 | 87 | +27 | 122 | 30 | 3 | 1 | 436 |
| K | 131 | 101 | 101 | +0 | n/a | n/a | n/a | n/a | n/a | 3 | 0 | 546 |
| M | 53 | 50 | 50 | +0 | n/a | n/a | n/a | n/a | n/a | 0 | 0 | 332 |
| P | 177 | 96 | 91 | +5 | 104 | 104 | +0 | 124 | 27 | 21 | 0 | 414 |
| S | 109 | 94 | 94 | +0 | 88 | 88 | +0 | 89 | 58 | 0 | 0 | 718 |
| T | 200 | 168 | 169 | -1 | 159 | 159 | +0 | 167 | 52 | 1 | 1 | 642 |
| U1 | 97 | 90 | 90 | +0 | 90 | 90 | +0 | 91 | 19 | 1 | 0 | 202 |
| U4 | 112 | 88 | 88 | +0 | 86 | 86 | +0 | 95 | 42 | 3 | 0 | 237 |
| U5 | 258 | 189 | 189 | +0 | 171 | 171 | +0 | 190 | 73 | 6 | 3 | 742 |
| U6 | 152 | 119 | 119 | +0 | 100 | 100 | +0 | 107 | 34 | 2 | 1 | 589 |
| total | 2,538 | 1,914 | 1,880 | +34 | 1,737 | 1,710 | +27 | 1,906 | 640 | 81 | 12 | 8,731 |

(b), (a), (c) are of 2,385; K and M have no syllable truth. Total of systems with no Russian row: 12 over 8 songs (B04 1, B06 3, B07 1, B09 1, B10 1, T 1, U5 3, U6 1). The song gate does not hold any song back: all 18 wrote words (`<lyric>` tags 146, 89, 146, 131, 116, 145, 140, 145, 140, 134, 54, 163, 111, 195, 96, 107, 234, 143).

## 4. Differences from the replay

The consoles do not print the piano's upper staff box, so no line shows it directly. What the lines show, against A2's as-built console for the same pages:

- **B10 (+33 read right, +27 (b))**: page 1 had `10 rows in 4 systems, 8 syllables seated ... does not pass (system 1, 2, 4 have no Russian row)` in A2's capture, and here `8 rows in 4 systems, 38 syllables seated`. Page 2 went from 17 rows to 7, page 3 from 14 to 5, with the same syllables seated (61, 41). Only system 4 of page 1 has no Russian row now. The rows the page reads fell on every page while the seated syllables rose or held; that fits fewer non-lyric rows reaching the classifier, which is the effect step 3 aims at, but I have no line that names the upper staff box as the cause. NOT ESTABLISHED as the cause.
- **P (+5)**: page 2 went from `8 rows, 0 syllables seated, none Russian` to `6 rows in 4 systems, 61 syllables seated`; page 3 from 11 rows to 7. Same pattern. P's vowelless is 21 against the replay's contribution of 19 (the replay's total of 79 needs P at 19).
- **B07 (+2)**, **B06 (-5)**, **T (-1)**: B06 has three systems with no Russian row (page 2 system 3, page 3 systems 3 and 4) where A2's capture had page 2 systems 2 and 3 and page 3 system 3; seated syllables on its pages 2 and 3 are 53 and 20 here against 36 and 22. The read-right loss is a difference in which system is unseated; I did not trace the five syllables. T: page 6 system 4 has no Russian row here; not traced.
- The other 13 songs equal the replay's read right and (b).

## 5. Times and the reader's counts

- Drop to MusicXML: 8,731 s over 73 pages, 120 s a page (replay-era real-page run: 139 s). Homr is most of it (for example B01 450.8 s of 464.3 s). U1's 202 s is the re-run (below).
- The underlay read, per page (72 pages): mean 4.9 s, median 4.9 s, longest 9.1 s (A2's real page: 9.6 s mean, 23.1 s longest).
- `counted` (summed from the consoles' page lines): clitics with a note of their own 7; units of two vowels or more uncut 16; notes breaking one vowel per note 136 (the line also prints "merged on one note": 0 on every page I read).
- Errors: no `pageerror` line. B10's console has five `error:` lines ("Total count=0", "Min=0.00 Really=0" and similar statistics text at 155.3 s) that look like a library's printed statistics; I did not trace them. The Chromium stderr lines in `run.log` (socket and GCM) are browser noise.
- U1: the first attempt gave `no MusicXML` because the background limit killed the preview and the runner during U1 (after T); the preview and runner were restarted, U1 re-run once and scored. All other songs ran once.

## 6. NOT ESTABLISHED

- That step 3 caused B10's and P's gain: no console line prints the staff box. A run of the same build with step 3 reverted would show it; I did not make one (it needs a code change).
- The cause of B06's loss of 5 and T's of 1.
- Whether the 12 systems-with-no-Russian-row count is exact: I counted the names in each song's final line; the line may be cut for long lists (U5 shows four).
- The B10 `error:` lines.
- Run-to-run variation of homr on this machine: each song ran once.

## Files

`/tmp/claude-0/-home-claude/b9285be6-e479-58ba-9f33-c16a0e4318f7/scratchpad/browser/`: `controls-before-measure.md`, `cap/<L>/` (MusicXML, lyrics, console, requests, times.json), `out/`, `sc/<L>.json` (scores), `score.log`, `ctl-scores/`, `scorer/`, `run.log`, `runsong.sh`, `runall.sh`, `startpreview.sh`, `total.py`, `rows.md`.
