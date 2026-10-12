# Audit: memory files against git log, r1

Sonnet helper, 2026-10-11 19:20 to 19:34, read-only, 206,760 tokens. Commissioned by the desk (Opus).

The three files hold 28 lines that are not current. Evidence comes from `git log` since 2026-09-15 on `Shane` (`origin/Shane` is at `8e74f39`), the QUEUE rows' own cells, and OPEN.md. Rows 50, 51, 58-60, 63-66, N.168, N.172 and N.123 part 2 are left out, as you said.

Only the first 20 rows of QUEUE.md's State column and the single QUEUE row I could not read in full (row 5) were checked from truncated text. Where a cell starts "READY" but ends "SHIPPED", I treated the end as the state.

## SCHEDULE.md

| Line | File says | Evidence | Class | Replacement status |
|---|---|---|---|---|
| Header, "Rules in force": checkpoint Friday 2026-10-09, design row not in Code moves to LATER | The checkpoint rule is in force. | The Week 4 line "Friday 2026-10-09, the checkpoint. DROPPED by the desk (Opus) 2026-10-09 01:10". | SUPERSEDED | "The 2026-10-09 checkpoint was dropped on 2026-10-09 01:10; nothing moves to LATER." |
| Header, "ONE HARD DEPENDENCY"; Week 6 N.84, "BLOCKED ON N.154" | N.84 cannot start until N.154 and N.130/N.131 are closed and the French is walked. | The file's own Week 5 line: N.154 "walked in French 16:03; shipped `8127e01`". N.130 `2f955e6` and N.131 `1987157` (STATE tracker `[x]`). | SHIPPED | "The gate is met: N.154 (`8127e01`), N.130 (`2f955e6`) and N.131 (`1987157`) are closed; N.84 is started with four English drafts." |
| Week 2, `[ ]` "Fixes from week 1" | Open: whatever the format walk and CHECK rows turned up. | The CHECK rows and format walk closed 2026-09-24 (Week 1 lines); fixes shipped `d1cc2d3` (MNX past 2 KB, Insights re-measure) and `190cc74` (photo messages). | SHIPPED | "Closed 2026-09-24; the findings shipped as `d1cc2d3` and `190cc74`." |
| Week 2, "Two parts of the 2026-09-20 loupe spacing ruling are NOT BUILT" | The meter run-in at 1 sp and the tie taper are not built. | `757f002` (run-in 1 stave space) and `07f535a` (tie taper), merged with QUEUE row 8 (`841aae5`). | SHIPPED | "Both shipped: `757f002` and `07f535a`, in QUEUE row 8; Dann's walk of them is not recorded." |
| Week 3, `[~]` scan reader | Rows 27, 29 and 30 are "in the tree, not shipped" or "WRITTEN, uncommitted". Staves, bars and heads are "Not walked by Dann". | `0976735` (2026-10-05 15:02); QUEUE rows 27, 29, 30: "DONE: walked by Dann on the alias 2026-10-05 15:08 to 15:11". Later ships: `bbe524b`, `c785b7f`, `5c0f557`. | SHIPPED / WALKED | "Rows 27, 29 and 30 shipped `0976735` and were walked by Dann 2026-10-05; later ships `bbe524b`, `c785b7f`, `5c0f557`." |
| Week 4, `[~]` 2026-10-09 00:30, (b) | Row 56 is "built by Code and neither accepted nor shipped". | `53035bd` (2026-10-09 00:46), QUEUE row 56. | SHIPPED | "Row 56 shipped `53035bd`." |
| Same line, (d) | Eleven queued rows are not built: 9, 11, 12, 13, 17, 25, 34, 36, 47, 48, 50. | Rows 11, 12, 17, 25, 36 and 50 are `e9dd86d`, `92c2ba1`, `ef9dcb0`, `e3e2c33`, `9fc8f92`, `18b3b76`, merged in `4bc9bcd`. | SHIPPED | "Rows 9, 13, 34, 47 and 48 remain unbuilt; rows 11, 12, 17, 25, 36 and 50 shipped in `4bc9bcd`." |
| Same line, (e) | "Weeks 5 to 7 show no ticked line." | Week 5 now carries ticks (How the release goes out, N.85, N.154). | SUPERSEDED | "Week 5 has three ticked lines; weeks 6 and 7 have none." |
| Week 4, `[~]` 2026-10-09 afternoon | Row 61 is "built, uncommitted: K and L fixed, M and P not". | `a7161ce` (2026-10-10 20:42, QUEUE row 61 "SHIPPED"). M later reached 100.0 under row 74 (`232c5a7`). P is still 77.6 (QUEUE row 74). | SHIPPED | "Row 61 shipped `a7161ce`; M passes under row 74 (`232c5a7`); P is still 77.6." |
| Week 4, `[~]` 2026-10-10 23:45 to 2026-10-11 04:40 | Row 57 r6 "split into four runs"; "briefs for rows 63 to 66 written". | Runs 1-2 shipped `4bc9bcd`; runs 3-4 `4f7421e`. Rows 63-66 shipped (`11e72ea`, `eec57e0`, `ba20d7e`, `88529f8`). | SHIPPED | "Row 57 runs 1-4 are committed (`4bc9bcd`, `4f7421e`); rows 63 to 66 shipped in `4bc9bcd`." |
| Week 4, `[~]` 2026-10-11 15:03, "Row 74 built" | Built, no commit named. | `232c5a7` carries `homr-reader.ts` and its test. | SHIPPED | "Row 74 is committed as `232c5a7`; deployment is not established." |
| Week 5, `[ ]` N.86 | The dead-code audit is not done. | QUEUE row 3: `TextualWitnesses.svelte` and `renderer-output.ts` gone; `_rhythm_spike/` kept. `git ls-tree Shane` still lists `analysis/notation-overlay.ts`, `optimalRegion` and `lib/wall.ts`. No path named `fit-font-lab` remains. | SHIPPED in part | "Two of the listed candidates are removed and `_rhythm_spike/` is kept; `notation-overlay.ts`, `optimalRegion` and the `wall.ts` ruling remain." |

## QUEUE.md

| Row | File says | Evidence | Class | Replacement status |
|---|---|---|---|---|
| 11, 12, 17, 25, 36 | "SENT to the cloud lane 2026-10-11 05:10". | `e9dd86d`, `92c2ba1`, `ef9dcb0`, `e3e2c33`, `9fc8f92`, all in `4bc9bcd`. | SHIPPED | "SHIPPED `<hash>`, merged in `4bc9bcd`; DONE is Dann's walk." (use each row's own hash) |
| 18, 19 | The State cell opens "READY." | The same cells end "SHIPPED a7fd740" and "SHIPPED `004ffe4`". | SHIPPED | "SHIPPED `a7fd740` (row 18) and `004ffe4` (row 19); DONE is Dann's walk." |
| 28 | "BUILT AS A PACKAGE, NOT IN ILYA". | Row 29 wired the port (0.2.0-ilya.2, model 465) into `0976735`. | SUPERSEDED | "Superseded by row 29: the port is installed and shipped in `0976735`." |
| 37 | Part B "NOT built"; r2 "READY after row 54". | Row 54 shipped `6b7c3de`. Row 57 says it "Takes up row 37's Part B", and row 57 runs 3-4 are `4f7421e`. | SUPERSEDED | "Part B was taken up by row 57 (`4f7421e`); part A's scorer field stays uncommitted-or-unknown (see below)." |
| 57 | Run 3 "WRITTEN, uncommitted"; run 4 "stopped before the ship". | `4f7421e` (2026-10-11 15:04) carries `metre-witness.ts`, `metre-client.ts`, `metre.worker.ts`, `join-pages.ts`. | SHIPPED | "Runs 1 to 4 are committed (`4bc9bcd`, `4f7421e`) and on `origin/Shane`; deployment is not established." |
| 74 | "BUILT ... uncommitted. Ships with this thread's docs." | `232c5a7` carries `homr-reader.ts` and `homr-reader.test.ts`. | SHIPPED | "SHIPPED `232c5a7`; M 100.0, P still 77.6." |
| 67 | "READY after row 57 run 2 reports." | Run 2 reported and shipped in `4bc9bcd`. | CURRENT, condition met | "READY: row 57 run 2 reported (`4bc9bcd`); not built." |
| 68 | "READY after row 66 ships and row 57 run 2 reports." | Row 66 `88529f8` and run 2 `4bc9bcd`, both shipped. | CURRENT, condition met | "READY: both conditions met; not built." |
| 13 | READY: measure where a stored scan's minute goes. | Row 38 / `bbe524b`: a saved scan reopens through homr; "first reload 44 s, later 0.4 s". No commit names N.166 or row 13. | SUPERSEDED in part | "Partly overtaken by `bbe524b`; first-reload time (44 s) is still unmeasured by this brief." |
| "Open work, not truant", N.123 | "Half-mass band is not built." | `14e4cb5` built it; later closed as superseded (OPEN.md, end). | SUPERSEDED | "Half-mass band built in `14e4cb5`, then dropped by Design round 2 (OPEN.md, 2026-10-11 19:15)." |

## STATE.md tracker

| Item | File says | Evidence | Class | Replacement status |
|---|---|---|---|---|
| N.181 | `[ ]`, ruled. | `d0b65a9` (row 59 part 4), in `472ed96`. | SHIPPED | "Shipped `d0b65a9`; Dann's walk is not recorded." |
| N.12 inc. 2 | `[ ]`, "never built". | `e3e2c33` (row 25), in `4bc9bcd`. | SHIPPED | "Shipped `e3e2c33`; DONE is Dann's walk." |
| N.179 | `[ ]`, row 14. | `a3dde11` in `622f35f`; row 14: walked in part 2026-10-09 01:17 ("this measure", Undo). | WALKED in part | "Shipped `a3dde11`; 'this measure' and Undo walked 2026-10-09; 'to the end', 'whole piece' and Place from here are not walked." |
| N.176 | `[ ]`, "French PROPOSED, awaiting his ruling". | `a3b239e` in `622f35f`; row 10: walked 2026-10-09 01:24 and amended (OPEN.md "Walked by Dann 2026-10-09 13:13"). | WALKED | "Shipped `a3b239e`, walked 2026-10-09, legend moved to the header line." |
| N.167 | `[ ]`, open. | `350a2e5` (2026-09-22) "N.167: a French singer can sit through the whole reader wait reading English"; also folded into row 41 (`21dbd8f`). | SHIPPED | "Shipped `350a2e5`; whether Dann saw it in French is not established." |
| N.164 | `[ ]`, "compass and the empty region remain". | OPEN.md: the "INSIGHTS, REVIEWED AS A PAGE" item "absorbs ... N.164's remainder"; the page was rearranged (`dfad53d`, `2ef68c9`, `88529f8`). | SUPERSEDED | "Remainder absorbed by the Insights page review (OPEN.md) and rebuilt in `dfad53d` and `88529f8`." |
| N.166 | `[ ]`, "NOT FIXED". | `bbe524b`: later reloads 0.4 s; first reload 44 s. | SUPERSEDED in part | "Reloads are fast after the first (`bbe524b`); the first-reload cost remains." |
| N.156 | `[ ]`, fixture missing its final syllable. | `b53a6df` and `9801308` (2026-09-20); the STATE floor lists `9801308` among closed floors. | SHIPPED | "Shipped `b53a6df` and `9801308`; whether the lyric-line disagreement defect is fixed is not established." |
| N.141 | `[ ]`, "squircle across a tie waits on N.142". | N.142 step 2 closed 2026-09-24 as zero (SCHEDULE, `d1cc2d3`). | SUPERSEDED (dependency) | "The tie crossing no longer waits on N.142 (counted zero 2026-09-24); no week carries it." |
| N.178 | `[ ]`, "a research item, measured ... After N.177". | The scan reader, homr, and the final test are N.178 work (SCHEDULE Week 3; `0976735`, `a7161ce`). | SUPERSEDED (scope) | "Widened to the scan reader; first reading by homr shipped `0976735`; tempo words and dynamics from scans are unbuilt." |

## OWED.md (open lines)

| Line | File says | Evidence | Class | Replacement status |
|---|---|---|---|---|
| 963 | Desk owes a song where the "lean toward [ʊ]" comment fires. | OPEN.md 2893: Dann walked "row 8c's [ʊ] comment" on *Without Sun* m. 6, 2026-10-09 13:10. | WALKED | "Walked by Dann 2026-10-09 13:10." |
| 965, 987 | Cloud-lane rows (`622f35f`) "none of it seen" / still desk-walked only. | OWED:964 and QUEUE rows 7, 10, 14, 15: walked by Dann 2026-10-09. | WALKED in part | "Rows 7, 10, 14 (in part) and 15 walked 2026-10-09; rows 8c (page) and 16 are not." |
| 986, 955 | One walk of the Tchaikovsky PDF owed. | QUEUE row 27: walked by Dann 2026-10-05 15:08 to 15:11. | WALKED | "Walked 2026-10-05." |
| 941, 942, 944 | Phase 0 "skipped"; scorer to be made exact; truth "still to start". | OWED:948 and QUEUE rows 22, 23: `389d4db`, `29a0a10`. | SHIPPED | "Scorer and baseline shipped `389d4db`." |
| Register N.22, N.46, N.51 | Fit drawer, Fit mobile presentation, and the Fit accent are `WRITTEN` / `PART DONE` / `OPEN`. | `c2a01b3` "tab.fit deleted"; SCHEDULE: Fit "folded into Voice and Score Markup". | SUPERSEDED (likely) | "The Fit surface was removed in `c2a01b3`; this row is moot unless the accent applies elsewhere." |

## Could not establish

- Whether any change deployed. I checked commits and `origin/Shane` only, not Vercel.
- QUEUE rows 34 and 69: "SENT to the cloud lane 2026-10-11 13:27". `origin/cloud-lane` is at `f8d8ca3` (12:34), an ancestor of `Shane`, with no later commit. A running session is not visible to git.
- QUEUE row 5 (slices 4 to 6) against row 6's folding into `plan-corrections-build` slice 5: no commit names either.
- Rows 47, 48, 62 and N.183: no commit or string found. They look CURRENT.
- SCHEDULE "Desk housekeeping" (COLOUR-7, INBOX-17, INBOX-31): none of the three names appears in PRODUCT.md, OWED.md, STATE.md or INBOX.md.
- OWED register N.19, N.32a, N.37, N.49 and N.17: the file's evidence is of 13 August. N.19 now has "calibrated {date}" in `i18n.ts:1590`; N.32a text was not found by grep.
- OWED lines 940, 951, 966, 1008, 1010 (Tchaikovsky truth proofing, ossia, French tempo roman, drawing 1, 2,135 px loupe): nothing since 2026-10-02 settles them.
- STATE.md tracker items N.177, N.175, N.173, N.170, N.163, N.162, N.160, N.157, N.151, N.92, N.140 and N.135: no later evidence either way. They look CURRENT.
- STATE.md's "FLOOR" paragraph names `9d1baa6` and, further down, `f6d2184`. It is outside the audit scope, but it will not match the tree.