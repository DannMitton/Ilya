# Report: N.135 stage 2a, step 1 (cutRows and seatTokens), r1

Code (Sonnet 5.5), cloud lane, 2026-10-27. Brief `brief-code-n135-underlay-reader_r1_2026-10-15.md` section 6, as amended by `review-fable-brief-n135-underlay-reader_r1_2026-10-15.md`; stage 1's report `report-code-n135-underlay-harness_r1_2026-10-15.md` sections 4.1 and 4.4 read for the rules as measured; `docs/memory/CONTRACT.md` read whole. This is step 1 of two: modules 1 and 2. Steps 2b and 3 are not mine.

Why the cloud lane may write under `apps/web/src/lib/omr/`: the modules are pure and run on synthetic input and in-tree fixtures; the reason `CONTRACT.md` §4 keeps the scan reader on the Mac (WebGPU, scans, truth files) does not touch them.

## 1. The answer first

- **`cutRows` is built and agrees with the harness's own code.** On 400 seeded random bands (429 rows, 129 bands with two or more rows, 23 row-81 runs split by the R2 valley rule), 0 bands differ from stage 1's `rowsys.py` rule and `rowsys2.py` `split` (`xcheck-step1.txt`). Not established on real rasters (section 5).
- **`seatTokens` is built and agrees with the harness's own code.** On 1,500 seeded random rows, 4,500 seatings (3 rules), 0 differ from `score44.py`'s `rule1`, `rule3`, and `seat` (`xcheck-step1.txt`).
- **Tests:** `underlay-rows.test.ts` 23, `underlay-seat.test.ts` 48; the web suite rises from 3,057 to 3,128, which is those 71.
- **Mutants:** 25 on `cutRows`, 25 on `seatTokens`; all 50 are killed by at least one test (`mutants-cutrows.txt`, `mutants-seattokens.txt`). The first run left 6 alive; section 3 says what each was and what I did.
- **The eight gates** are at their baselines, with the one rise above (section 3).

## 2. The tree

- **Branch and commit:** `cloud-lane-16`, cut from `origin/Shane` at `0d42e658` (the tip when I fetched), pushed with `-u` before any edit. The commit that carries this report is the head of the push.
- **What the working tree held that I did not make:** nothing. `git status --short` was empty at the cut. I ran `pnpm install --frozen-lockfile` (no `node_modules` in the clone); it changes no tracked file.
- **Not touched:** `docs/memory/`, the brief, its review, any approval file, `+page.svelte` (5,597 lines, ceiling 5,597), `pipeline.ts` (925 of 925), `musicxml-parser.ts` (1,167 of 1,167 in `scripts/ratchets.json`; the brief says 1,168, so the file is one line shorter than the brief's number).
- **No pull request** opened. Nothing pushed to `Shane` or `main`.

## 3. Each measurement

### Functions

| File | Signature | Tests |
|---|---|---|
| `underlay-rows.ts` (173 lines) | `cutRows(band: GreyBandLike, staffSpace: number): RowBox[]` | 23 |
| `underlay-seat.ts` (199 lines) | `seatTokens(tokens: Token[], notes: NotePlace[], rule: 'nearest' \| 'order' \| 'monotone'): Seat[]`; `kindOf(text: string): SeatKind` (exported because `sewWords` reads the same classes) | 48 |

Types: `GreyBandLike { width, height, data: ArrayLike<number>, paper? }`, `RowBox { y0, y1, core: [first, last] }` (`y1` exclusive, `core` inclusive, band rows from 0); `Token { text, x0, x1 }`, `NotePlace { id, x, bar, tiedInto?, underExtender? }`, `Seat { token, kind, text, x, note, offset, by, runTogether, shared }`.

### Gates, before and after (eight, run in this clone)

| Gate | Baseline in the task | Measured before any edit | After step 1 |
|---|---|---|---|
| `pnpm test:phonology` | 291 passed (291) | 291 passed (291) | 291 passed (291) |
| `pnpm test:dictionary` | 248 passed (248) | 248 passed (248) | 248 passed (248) |
| `pnpm --filter @ilya/web check` | 0 errors, 12 warnings, 5 files | 0 errors, 12 warnings, 5 files | 0 errors, 12 warnings, 5 files |
| `pnpm --filter @ilya/web test` | 3057 passed (3057) | 3057 passed (3057) | 3128 passed (3128): +23 rows, +48 seat |
| `pnpm --filter @ilya/score-parser test` | 775 passed, 5 skipped (780) | 775 passed, 5 skipped (780) | 775 passed, 5 skipped (780) |
| `pnpm test:blurb` | 145 passed (145) | 145 passed (145) | 145 passed (145) |
| `pnpm test:integration` | 55 passed (55) | 55 passed (55) | 55 passed (55) |
| `pnpm ratchets` | OK | OK | OK |

No baseline differed. `pnpm ratchets` prints a list of ceilings that "can be lowered" (for example `InsightsPane.svelte` 1,351 to 760); that list is the same before and after and none of it is mine.

### Mutants (`mutate.py`; one change at a time, run the file, restore, `cmp` against a backup)

Expectation, formed before the run and recorded only now (I did not write it to a file first): every mutant is killed. Likeliest failure of that expectation: a boundary (`<` against `<=`) or a margin with no test on it, and a condition that another condition already implies.

First run: 22 of 25 `cutRows` mutants killed, 3 alive; 23 of 26 `seatTokens` mutants killed, 3 alive.

| Alive in the first run | What it was | What I did |
|---|---|---|
| `cutRows`: valley margin 0.7 to 0 | no test had a dip inside the first 0.7 space of a core | added a test (a 4 px sliver above a row stays in its core) |
| `cutRows`: paper median of an even count taken as the lower middle | no test had an even count with two different middles | added a test (half the sampled lines at 200, half at 230, paper 215) |
| `cutRows`: ink test `<=` for `<` | no test sat a pixel exactly at paper less 60 | added a test (140 is not ink on paper 200, 139 is) |
| `seatTokens`: drop `sung.length === 0` in `order` | equivalent: a bar in the map has at least one token, so the count check already refuses an empty `sung` | removed the redundant clause |
| `seatTokens`: do not sort a bar's tokens by x in `order` | equivalent: the syllable tokens are already in x order | removed the sort, left a one-line comment |
| `seatTokens`: "fallback tokens still marked order" | my mutant changed nothing (a comment appended) | dropped it; the real mutant for that line (fallback tokens report the rule asked for) is in the final set and is killed by 5 tests |

Final set, 25 and 25, all killed. Tests that fail on each are listed in the two `mutants-*.txt` files. A sample, to show the spread: removing R2 (`SPLIT_ABOVE` to 1000) fails 3 tests; removing the merge gap fails 21 of 23; removing the `tiedInto` filter from `order` fails 1; removing the equal-count condition in `order` fails 3; removing the `n > m` fallback in `monotone` fails 1; `monotone` taking a tie on skip instead of take fails 1.

### Cross-check against the harness (`xcheck.sh`)

Expectation: no difference. Likeliest failure: numpy's `convolve(..., 'same')` against my moving mean at the ends of a core, or Python's `int()` against `Math.trunc`, on a rare size.

Result: 0 of 400 bands and 0 of 4,500 seatings differ. The Python side is the harness's code copied (R1 from `rowsys.py`, `split` from `rowsys2.py`, `rule1`, `rule3`, and `seat` from `score44.py`), on seeded inputs, so the numbers reproduce. The bands use an explicit `paper`, as the harness measured paper on the page.

## 4. Departures from the brief

| Departure | Reason | Reversible |
|---|---|---|
| `cutRows` includes R2, the split at ink valleys for a core taller than 1.6 staff spaces | Brief section 6 item 1 states R1 only; the stage 1 report (4.1, finding 1) says "Stage 2a's `cutRows` has to do this", and the task named 4.1's R2 | Yes: `SPLIT_ABOVE` to a large number turns it off |
| `GreyBandLike.paper?` | The harness measured paper on the whole page; a band alone reads dark where it is mostly ink (a test shows this). The caller can pass the page's tone; without it, the band's own median is used | Yes |
| `seatTokens` returns one `Seat` per token, including a lone hyphen, an extender, and a mark, with `note: null` | `sewWords` (step 2) must read hyphens and extenders, and a seat list that dropped them would hide them from it | Yes |
| `NotePlace` carries `id`, `bar`, `tiedInto?`, and `underExtender?`; the brief did not define it | Rule `order` needs the bar and which notes sing a syllable. `underExtender` follows the brief's wording in 4.4; the harness could not observe an extender and ignored it. With the flag absent the rule is the harness's, which is the case the cross-check runs | Yes |
| A token holding two syllables run together is seated whole on one note and flagged `runTogether`; `seatTokens` does not split it | The task says "reported, not split". The harness split such tokens at an internal non-letter before seating, and that raised (a) from 1,391 to 1,761 of 2,538 syllables read right (stage 1 report, section 1, finding 2). Stage 2b will need a splitting step before `seatTokens`; I did not build one | Yes |
| A lone underscore token is classed `extender` by `kindOf` | Brief item 3 says an extender marks a sustained syllable. The harness's `sew` treated a lone `_` as a hyphen (`common2.py`: `t.strip(HY + '_') == ''`). Text cannot tell a syllable divider from an extender; box width could. Step 2's `sewWords` reads this class and I will say there what it does | Yes |
| Hyphen class adds U+2011 to the harness's `-–—‐` | A non-breaking hyphen is a hyphen | Yes |
| Tie on distance goes to the leftmost note | The harness takes `min` over notes in x order | Yes |
| An extra folder `docs/sessions/measure-n135-stage2a_2026-10-27/` | Brief section 4 and `CONTRACT.md` tether 11: every number in a report comes from a script. It holds the mutation runner, its two specs, the cross-check scripts, and their outputs. No model and no data file | Yes |

## 5. What I could not establish

NOT ESTABLISHED beats a complete invented answer.

- **`cutRows` on real pages.** The rasters are on the Mac (`~/Downloads/_desk-n135/`); the harness's `rows2/*.jsonl` is in the tree but without the pixels. I checked the code against the harness's code on synthetic bands, not against its rows on S, T, K, M, the Sunless, Kabalevsky, or P pages. The harness's 1 Sunless Russian row left merged (U5) is therefore not reproduced here.
- **Paper tone on a real band.** The default (the band's own median of a 37 px grid) was never compared with the page-level median the harness used. Stage 2b should pass `paper`.
- **Where `tiedInto` and `underExtender` come from.** A caller builds them from homr's MusicXML (`<tie type="stop">`) and from the extender tokens' boxes. I did not read how homr writes ties on a scan and did not build the extraction; in the fixture `tch-3.musicxml`, 2 of the 88 voice notes carry a `<tie` or `<tied` element.
- **Whether "two tokens run together" meant one token holding two syllables or two tokens with touching boxes.** I read it as the first (stage 1's finding) and tested both: `su-e` seated whole on one note and flagged, and two overlapping boxes seated on two notes by `monotone` with neither flagged.
- **A stray mark** (a comma read as its own token) is returned as `kind: 'mark'` and, in the harness, was dropped. Whether it should attach to the syllable before it is unmeasured.
- **Bars that span two systems:** `order` pairs within the notes it is handed. A bar cut by a system break gets only the notes of this system; the caller decides which.

## 6. The files

New, all under `apps/web/src/lib/omr/`: `underlay-rows.ts`, `underlay-rows.test.ts`, `underlay-seat.ts`, `underlay-seat.test.ts`.

Under `docs/sessions/measure-n135-stage2a_2026-10-27/`: `mutate.py`, `spec-rows.json`, `spec-seat.json`, `mutants-cutrows.txt`, `mutants-seattokens.txt`, `xcheck.sh`, `xcheck_rows_gen.py`, `xcheck_rows.mjs`, `xcheck_seat_gen.py`, `xcheck_seat.mjs`, `xcheck-step1.txt`.

Cites that moved since the brief (re-located by name, `0d42e658`):

| Brief cite | Now |
|---|---|
| `old-reader-seats.ts:165-175` (pass 1, `settle(..., 'order', ...)`) | unchanged, `:165` and `:175`; the header's order paragraph is at `:18-29` |
| `join-pages.ts:435-439` `placeOf` | `:439` (`export function placeOf`) |
| `ocr-guard.ts:59` `unknownWordShare` | unchanged, `:59` |
| `pipeline.ts:264-266` `isKnownWord` | `:225-227` |
| `musicxml-parser.ts:335-345`, `:343` (lyric part, `no-lyrics-found`) | `:321-337`, `:329` (read in step 2) |
| `vowel-resolver.ts:243` `collectScoreWords`, `:157` `CYRILLIC_VOWEL` | `:224`, `:159` (read in step 2) |

Step 2 (modules 3, 4, and 5) follows in its own commit and report.
