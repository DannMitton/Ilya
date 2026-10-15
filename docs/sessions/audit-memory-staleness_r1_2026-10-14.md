# Audit: memory working files against git and the tree, r1

Sonnet helper, 2026-10-14, read-only, on the snapshot at `/home/claude/audit` (branch `Shane`, HEAD `dbe41af`, plus uncommitted docs/memory edits). Evidence is a commit hash from `gitlog.txt`, a path:line in the snapshot, or a line in another working file. 46 of the 60 findings have a machine-checked edit in `edits.json` (each `old` string occurs exactly once in its file); the rest are CONFLICT or NOT ESTABLISHED and carry no edit. The CURRENT rows are checks with no change and are not counted.

Did the 2026-10-11 audit's fixes hold? Yes for the lines it named: the SCHEDULE, QUEUE, STATE tracker and OWED lines were rewritten, and OWED carries `[CHECKED 2026-10-11 19:40]` prefixes. Three of its patterns recurred in new form: a row left "uncommitted" or "waiting for Dann's merge" after the ship (rows 78a, 78b, 78c, 83, 84, 87), a "NOT BUILT" line in OPEN.md that a cloud-lane commit later built (loupe run-in and tie taper), and `path:line` citations that drifted (STATE, QUEUE, SEQUENCE, OWED).

Note on the column "Class": SHIPPED, MOVED (path or line), NEXT STEP TAKEN, SUPERSEDED, CONFLICT, NOT ESTABLISHED, DATE PASSED (none found), CURRENT (checked, no change).

## STATE.md

| Line or row | File says | Evidence | Class | Replacement |
|---|---|---|---|---|
| L19 | set 4 is sealed and its final test is READY (row 86) | QUEUE.md:18; QUEUE.md:24; 1ec2ef2 | NEXT STEP TAKEN | set 4 was measured 2026-10-12 at 97.5, PASS (row 86), and song 4F then read 98.0 after row 89 (`1ec2ef2`) |
| L27 | Next step: the Fable review (FARM-OUT put to Dann 03:41, "Not now" 03:42; ask again at the open), then Code on the Mac. | QUEUE.md:28; sessions-list.txt:146-147,998 | NEXT STEP TAKEN | Taken since: the Fable review ran and r2 applies its seven amendments (`../sessions/review-fable-brief-row96_r1_2026-10-14.md`, `../sessions/brief-code-row96-nothing-over-the-footer_r2_2026-10-14.md`) |
| L76 | the `language` value in play (`ScoreUploader.svelte:134`) and never re-translated | apps/web/src/lib/score/ScoreUploader.svelte:134,978; 350a2e5 | MOVED | the `language` value in play (at the time of Code's reading; `ScoreUploader.svelte:134` is now a comment, and the tree draws the line at `:978` through `readingWait.line(language)`) and never re-trans |
| L78 | `ScoreUploader.svelte:771-776` restores by calling | apps/web/src/lib/score/ScoreUploader.svelte:802 | MOVED | `ScoreUploader.svelte:802` restores by calling |
| L101 | sits at `OPEN.md:1250` inside this spec | docs/memory/OPEN.md:1396 | MOVED | sits at `OPEN.md:1396` inside this spec |
| L55 | `packages/dictionary/src/pre-reform-normalizer.ts:92-93` records it | packages/dictionary/src/pre-reform-normalizer.ts:90 | MOVED | `packages/dictionary/src/pre-reform-normalizer.ts:90` records it |
| L108 | (`profileStore.ts:217-225`) | apps/web/src/lib/voice/profileStore.ts:281-289 | MOVED | (`profileStore.ts:281-289`) |
| L134 | What moved, and where, is in `CHANGELOG_r1.md`. | ls-files.txt:3743 | MOVED | What moved, and where, is in `../sessions/tidy-r1_2026-10-12/CHANGELOG_r1.md`. |
| - | Tracker N.179: "'to the end', 'whole piece', and Place from here are not walked" | QUEUE.md:55 (row 14): "whole piece" and Place from here walked 2026-10-14 01:49, ratified 02:56; only "to the end" not walked | CONFLICT | not edited: STATE.md N.179 against QUEUE.md row 14 |
| - | Intro: "Every row below was checked against git log on 2026-10-11 19:40" | Rows have been edited since (N.135, N.184, N.12 lines carry 2026-10-14 text); the stamp no longer describes the whole tracker | NOT ESTABLISHED | NOT ESTABLISHED: which tracker rows were last checked against git log after 2026-10-11 |
| - | Footer: "pre-tidy originals are in `_pre-tidy-2026-10-12/` and in git" | no path `_pre-tidy-2026-10-12` in ls-files.txt or sessions-list.txt | NOT ESTABLISHED | NOT ESTABLISHED: whether the folder exists on the Mac untracked; `ls ~/Desktop/ilya-rewrite/docs/` would settle it |

## QUEUE.md

| Line or row | File says | Evidence | Class | Replacement |
|---|---|---|---|---|
| L3 | is in `QUEUE-archive_r1-draft.md`. | ls-files.txt:513; ls-files.txt:3746 | MOVED | is in `QUEUE-archive.md`. |
| L13 | WRITTEN by Code (Opus) on the Mac 2026-10-12, on `Shane`, uncommitted; report `../sessions/report-code-row78a_r1 | 72b564f | SHIPPED | WRITTEN by Code (Opus) on the Mac 2026-10-12; SHIPPED `72b564f` 2026-10-12 20:34; report `../sessions/report-code-row78a_r1 |
| L14 | WRITTEN by Code (Opus) on the Mac 2026-10-12, uncommitted; report `../sessions/report-code-row78b_r1 | 72b564f; packages/score-parser/src/placeholder-mark.ts:44 (still 0.198) | SHIPPED | WRITTEN by Code (Opus) on the Mac 2026-10-12; SHIPPED `72b564f` 2026-10-12 20:34; report `../sessions/report-code-row78b_r1 |
| L15 | WRITTEN by Code (Opus) on the Mac 2026-10-12, uncommitted; report `../sessions/report-code-row78c_r1 | 72b564f; packages/score-parser/src/ring-geometry.ts (added in 72b564f) | SHIPPED | WRITTEN by Code (Opus) on the Mac 2026-10-12; SHIPPED `72b564f` 2026-10-12 20:34; report `../sessions/report-code-row78c_r1 |
| L20 | Waits for Dann's merge with the ship after row 86; the ship script's gate 4 line moves then | ad99ed4; e7acf7f | SHIPPED | MERGED in `ad99ed4` ("Merge cloud-lane-2: QUEUE rows 83 and 87", 2026-10-12 20:24), ten minutes before `72b564f` |
| L22 | all eight gates pass. Waits for Dann's merge with the ship | ad99ed4; aac1949 | SHIPPED | all eight gates pass. MERGED in `ad99ed4` with row 83 |
| L21 | Waits for Dann's merge with the next ship; the ship script's gate 4 moves to 2428 then. | 1ec2ef2; 9e1af16 | SHIPPED | MERGED: `1ec2ef2` (its subject: "rows 84 (N.86) and 51 slice 2 merged"). |
| L19 | For Code on the Mac, Opus, after the ship; it reads | 72b564f | NEXT STEP TAKEN | For Code on the Mac, Opus; the ship it waited for went as `72b564f`. It reads |
| L25 | NOT WRITTEN. The desk writes the brief after the ship; Fable reviews it \| Row 67 | 72b564f; sessions-list.txt (no brief-code-row90 file) | NEXT STEP TAKEN | NOT WRITTEN (no row 90 brief in `sessions-list.txt`, 2026-10-14). The ship it waited for went as `72b564f`; the desk writes the brief, Fable reviews it \| Row 67 |
| L48 | `apps/web/src/lib/i18n.ts:1200`, `:1823`) | apps/web/src/lib/i18n.ts:1205,1928 | MOVED | `apps/web/src/lib/i18n.ts:1205`, `:1928`) |
| L38 | In the tree, untracked. Row 33's trial | f79c2165; ls-files.txt:764 | SHIPPED | The brief is committed (`f79c216`). Row 33's trial |
| L65 | is uncommitted-or-unknown. | 53035bd (M tools/e16-harness/src/scan-scorer.ts) | SHIPPED | was changed in `53035bd` (subject: "Rows 56 and 37 ... scorer change"); that the change is the metre field is not checked. |
| L89 | `cloud-lane-2` holds row 83 at `e7acf7f`, for his merge. | ad99ed4; 1ec2ef2; QUEUE.md:28 | SHIPPED | `cloud-lane-2` is merged (`ad99ed4`, `1ec2ef2`); `cloud-lane-3` holds row 96, running (row 96's cell). |
| L95 | (`GuideContent.svelte:60`, `:73`, `:93`, `:122`, and English `:336`, `:350`, `:370`, `:399`) | apps/web/src/lib/components/Reading/GuideContent.svelte:61,74,94,123,347,361,381,410 | MOVED | (`GuideContent.svelte:61`, `:74`, `:94`, `:123`, and English `:347`, `:361`, `:381`, `:410`) |
| L95 | beside `guide-markup-characteristics` (`GuideContent.svelte:345`) | apps/web/src/lib/components/Reading/GuideContent.svelte:66,353 | MOVED | beside `guide-markup-characteristics` (`GuideContent.svelte:353` English, `:66` French) |
| L96 | (`MarkupPane.svelte:728`; `insights.phonation.tempoPointer` | apps/web/src/lib/markup/MarkupPane.svelte:759-761 | MOVED | (`MarkupPane.svelte:759-761`; `insights.phonation.tempoPointer` |
| L101 | (`IntakePanel.svelte:463`) | apps/web/src/lib/components/Drawer/IntakePanel.svelte:461 | MOVED | (`IntakePanel.svelte:461`) |
| - | Row 78b: "stroke 0.198 sp ... One-constant change owed to Code" | packages/score-parser/src/placeholder-mark.ts:44 still reads 0.198 | CURRENT | no change; the owed constant is still owed |
| - | N.123: "the falsetto caveat is computed (`score-metrics.ts:126`) and never shown" | score-metrics.ts:126 is `foldCycles = totalFoldCycles(...)`; the word falsetto appears in no .ts or .svelte file of the snapshot | NOT ESTABLISHED | NOT ESTABLISHED: where the caveat is computed; a grep of `FoldCycleResult` consumers in phonation.ts would settle it |
| - | Row 89 cites `decoder.ts:130`; row 26 cites `reader.py:1618-1648`, `:2004-2027` | third_party/homr-web is not in the snapshot; reader.py is tracked (ls-files.txt:4170) but outside the source trees given | NOT ESTABLISHED | NOT ESTABLISHED: line positions in files outside the snapshot |
| - | Row 5: "READY. Slices 1 to 3 shipped" | no commit names slices 4 to 6; SCHEDULE.md:25 agrees (slice 4 not started) | CURRENT | no change |

## SCHEDULE.md

| Line or row | File says | Evidence | Class | Replacement |
|---|---|---|---|---|
| L9 | a Claude Code cloud session the desk starts in Dann's Chrome, on `cloud-lane-2`; | ad99ed4; QUEUE.md:28 | SUPERSEDED | a Claude Code cloud session the desk starts in Dann's Chrome, on a fresh branch per row (`cloud-lane-2` is merged; row 96 runs on `cloud-lane-3`); |
| L25 | no visible change. After row 93's fix. | 6c69161; SCHEDULE.md:23 | NEXT STEP TAKEN | no visible change. Row 93's fix has shipped (`6c69161`); this is not started. |
| L35 | rows 84, 89 (when walked by the desk), and the cloud rows that land. | 1ec2ef2; 6c69161 | NEXT STEP TAKEN | rows 84 and 89 went out in `1ec2ef2`; this ship carries `6c69161` and the cloud rows that land (row 96). |
| L37 | **Row 96 FIRST at the next session**: | QUEUE.md:28 | NEXT STEP TAKEN | **Row 96, RUNNING in the cloud lane on `cloud-lane-3` (QUEUE row 96); its report comes FIRST at the next session**: |
| L52 | once row 93's fix and Corrections slice 6 are walked. | 6c69161; SCHEDULE.md:23 | NEXT STEP TAKEN | once Corrections slice 6 is walked (row 93's fix, `6c69161`, was ratified by Dann 2026-10-14 02:56). |
| - | Line 74: "set 4 measured at 97.5 and corrected to 97.9" | QUEUE.md:18 (row 86) gives 97.5 PASS and 97.8 with 10 UNSURE set aside; no record of 97.9 found in the working files | CONFLICT | not edited: SCHEDULE.md:74 against QUEUE.md:18 |
| - | Line 3: "Floor: `72b564f`" | STATE.md:7 names floor `6c69161`. SCHEDULE.md:3 says it was checked 2026-10-12, so it is dated, not wrong | CONFLICT | not edited; the two floors answer different questions |
| - | Line 17: "Shipped and not walked by Dann: about 40 rows" | QUEUE.md lines 46-85 hold 40 table rows | CURRENT | no change |

## SEQUENCE.md

| Line or row | File says | Evidence | Class | Replacement |
|---|---|---|---|---|
| L64 | **So N.136 is the live half.** | 1d18514; SEQUENCE.md:102 | SHIPPED | **So N.136 was the live half; it closed 2026-09-21 (`1d18514`) and this dependency is discharged.** |
| L70 | (`insights.ts:115-116`) | apps/web/src/lib/insights/insights.ts:268 | MOVED | (`insights.ts:268`) |
| L132 | wired at `watchlist.ts:476` | apps/web/src/lib/analysis/watchlist.ts:507 | MOVED | wired at `watchlist.ts:507` |
| L122 | \| **N.130** \| Insights' French, about 58 entries. Release-blocking. \| | 2f955e6 | SHIPPED | \| ~~**N.130**~~ SHIPPED `2f955e6` 2026-09-24 \| Insights' French, about 58 entries. Release-blocking. \| |
| L148 | The last (a tie spanning the squircle) waits on N.142. \| | c868540; SEQUENCE.md:113 | SHIPPED | The last (a tie spanning the squircle) no longer waits on N.142 (shipped `c868540`). \| |
| - | Tier 2: "N.131 ... about 64 entries ... real size NOT ESTABLISHED" | `1987157` (N.131: four rulings restored) and `9dfdab8` are shipped; N.131 is absent from the STATE tracker; OPEN.md:568 still heads it UNPLACED | NOT ESTABLISHED | NOT ESTABLISHED: whether N.131 is closed or only part shipped; Dann's or the 2026-09-24 close record would settle it |
| - | Tier 4: "N.124 ... two prerequisites NOT ESTABLISHED" | SEQUENCE.md:70-72 (dependency 4, amended 2026-09-23): the multi-voice library exists | CONFLICT | not edited: SEQUENCE.md:142 against SEQUENCE.md:70-72 |
| - | Dependency 3: "`staff-renderer.ts:2547`"; Tier-0 "bits-ui" removal | staff-renderer.ts:2547 is a bare `</g>`; apps/web/package.json is not in the snapshot | NOT ESTABLISHED | NOT ESTABLISHED: what 2547 held on 2026-09-15; whether bits-ui is still in package.json |

## OWED.md

| Line or row | File says | Evidence | Class | Replacement |
|---|---|---|---|---|
| L174 | `OPEN.md:1250`, inside N.141 | docs/memory/OPEN.md:1396 | MOVED | `OPEN.md:1396`, inside N.141 |
| L908 | The i18n key `tab.fit` (`i18n.ts:108`): no caller (desk grep, 2026-09-26). | apps/web/src/lib/i18n.ts (no match) | MOVED | The i18n key `tab.fit` is gone: `apps/web/src/lib/i18n.ts` holds no `tab.fit` (snapshot grep, 2026-10-14); the removing commit is not identified. |
| L1032 | Fix: one sentence in `AGENTS.md` naming the exception, to ride with QUEUE row 84. Desk, Opus. | 9e1af16; AGENTS.md "Two exceptions" | SHIPPED | DONE: `9e1af16` added the sentence to `AGENTS.md` (shipped in `1ec2ef2` with row 84). Desk, Opus. |
| - | Whole file | 111 KB; read lines 894-1032 and the grep hits for uncommitted/WRITTEN/READY/cloud lane. The 10-11 audit's fixes are applied there as [CHECKED 2026-10-11 19:40] prefixes (lines 700, 944-950, 963, 965, 986-987) and hold | NOT ESTABLISHED | NOT ESTABLISHED: status of OWED lines 20-500 (ruled-but-not-done) against git |

## OPEN.md

| Line or row | File says | Evidence | Class | Replacement |
|---|---|---|---|---|
| L34 | Brief WRITTEN, UNTRACKED: | ls-files.txt:830; 34b143c | SHIPPED | Brief WRITTEN, now tracked (modified in `34b143c`): |
| L88 | - **N.142**, the tie predicate itself, which is not built. | c868540 | SHIPPED | - **N.142**, the tie predicate itself, which shipped as `c868540` (2026-09-16). |
| L1008 | predicate, and N.142 is not built. | c868540 | SHIPPED | predicate, and N.142 shipped as `c868540` (2026-09-16). |
| L2148 | \| **1 sp in the loupe; the page keeps 2** \| **NOT BUILT** \| | 757f002; apps/web/src/lib/score/loupe.ts:394 | SHIPPED | \| **1 sp in the loupe; the page keeps 2** \| **BUILT, `757f002` (2026-10-02), `LOUPE_METER_RUN_IN_SP = 1` at `loupe.ts:394`** \| |
| L2153 | - **The meter run-in is NOT BUILT.** `METER_RUN_IN_SP = 2` | 757f002; loupe.ts:394 | SHIPPED | - **The meter run-in is BUILT since `757f002` (2026-10-02); the text below is the 2026-09-21 reading.** `METER_RUN_IN_SP = 2` |
| L2160 | shown. **NOT BUILT.** No `taper` appears | 07f535a | SHIPPED | shown. **BUILT since `07f535a` (2026-10-02); the text below is the 2026-09-21 reading.** No `taper` appeared |
| L522 | ## N.130. INSIGHTS HAS NO FRENCH. Numbered by Dann 2026-09-13. UNPLACED. | 2f955e6 | SHIPPED | ## N.130. INSIGHTS HAS NO FRENCH. Numbered by Dann 2026-09-13. SHIPPED `2f955e6` 2026-09-24 (was UNPLACED). |
| L700 | **Not built, and no brief is written** (`QUEUE.md` row 34). | 01551e2; fd1c86a; QUEUE.md:63 | SHIPPED | **Built: QUEUE row 34 shipped `fd1c86a` (2026-10-11), built in `01551e2`.** |
| - | Heading N.131 "UNPLACED" (line 568); heading N.140 "UNPLACED" (627), N.141 (698) | N.131 as above; N.140 and N.141 are on the STATE tracker as open, so UNPLACED is not contradicted | NOT ESTABLISHED | NOT ESTABLISHED for N.131 (see SEQUENCE); no change for N.140 and N.141 |
| - | Whole file | 344 KB; only lines matching UNTRACKED, not built, NOT BUILT, WRITTEN and the section headings were checked. Status words inside the 2026-09-30 to 2026-10-11 rulings blocks were not read line by line | NOT ESTABLISHED | NOT ESTABLISHED: any status line in OPEN.md outside those matches |

## README.md

| Line or row | File says | Evidence | Class | Replacement |
|---|---|---|---|---|
| - | Whole file | read in full; no stale status, path or count found. Step 0 records the 10-11 audit and still stands | CURRENT | no change |

## ENVIRONMENT.md

| Line or row | File says | Evidence | Class | Replacement |
|---|---|---|---|---|
| - | Whole file | 331 KB; only a grep for notation-overlay, cloud-lane-2 and gate 4 baselines. cloud-lane-2 line (4747) is a dated record and not stale | NOT ESTABLISHED | NOT ESTABLISHED: any path or baseline line elsewhere in the file |

## Counts

| File | SHIPPED | MOVED | NEXT STEP TAKEN | SUPERSEDED | CONFLICT | NOT ESTABLISHED | Total |
|---|---|---|---|---|---|---|---|
| STATE.md | 0 | 6 | 2 | 0 | 1 | 2 | 11 |
| QUEUE.md | 9 | 6 | 2 | 0 | 0 | 2 | 19 |
| SCHEDULE.md | 0 | 0 | 4 | 1 | 2 | 0 | 7 |
| SEQUENCE.md | 3 | 2 | 0 | 0 | 1 | 2 | 8 |
| OWED.md | 1 | 2 | 0 | 0 | 0 | 1 | 4 |
| OPEN.md | 8 | 0 | 0 | 0 | 0 | 2 | 10 |
| ENVIRONMENT.md | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| All | | | | | | | 60 |

## What I could not establish

- Whether anything deployed. I read commits and the tree only, not Vercel.
- Row 96: that it is running on `cloud-lane-3`. No such branch is visible in a git log of `Shane`; the state comes from QUEUE.md:28 and from the audit brief's statement of today's state.
- Whether the 0.098 stroke constant is still owed: placeholder-mark.ts:44 reads 0.198, so it is owed as the file says.
- Dann's walks after 2026-10-11 other than those the working files record (the N.179 conflict above depends on this).
- Files outside the snapshot: `third_party/homr-web`, `apps/web/package.json`, `scripts/`, `tools/e16-harness/reader/` (listed in ls-files.txt, not provided).
- The `_pre-tidy-2026-10-12/` folder named in STATE.md and the removing commit for `tab.fit`.
- Whether N.131 is closed (see SEQUENCE).
- INBOX, archives, CONTRACT, PRODUCT rulings were not audited, as instructed.
