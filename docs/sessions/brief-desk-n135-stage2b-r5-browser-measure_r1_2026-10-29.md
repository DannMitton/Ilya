# Brief: the browser measure of N.135 stage 2b r5 at step 10, 18 build songs (desk helper, Sonnet, r1, 2026-10-29)

Measure only. You change nothing in the repository, commit nothing, push nothing. Never run a git command that writes (add, commit, push, checkout of a branch, reset, stash, clean); `git clone`, `git worktree add` in your own scratch folder, and read-only git are fine.

## Goal

Run the built app on the real page for the 18 build songs at `cloud-lane-21` `5ee29ec2` (stage 2b r5, steps 0 to 10), score it with A2's scorer, and say whether the real page gives what the page-half replay gave: read right 1,880 of 2,538 printed syllables, seating (b) 1,710 of 2,385 truth syllable notes, (a) 1,870, (c) 640, vowelless alone on a note 79. Step 3 (the piano's upper staff found in the ink) is a worker-half change the replay could not see, so B01 and B04 may hold or gain; any other difference is a finding.

## Inputs (absolute paths)

- Code: `git clone https://github.com/DannMitton/Ilya.git`, branch `cloud-lane-21`; check the head is `5ee29ec2`.
- PDFs, named by harness letter: `/mnt/user-data/uploads/Downloads/_desk-2026-10-28/a2-inputs/pdfs/{B01,B02,B03,B04,B06,B07,B08,B09,B10,K,M,P,S,T,U1,U4,U5,U6}.pdf`.
- The reader model: `/mnt/user-data/uploads/Downloads/_desk-2026-10-28/a2-inputs/rus_prereform_r2_29000.traineddata`.
- How the real page was measured before, read in full first: `/mnt/user-data/uploads/ilya-rewrite/docs/sessions/report-desk-n135-stage2b-real-page_r1_2026-10-28.md` (section 2 is the setup: `pnpm install --frozen-lockfile`, `fetch-omr-models.mjs`, `copy-underlay-model.mjs` with the model above, build, preview on port 4173) and its archive `/mnt/user-data/uploads/Downloads/_desk-2026-10-27/desk-n135-real-results_2026-10-28.tgz`.
- The A2 measure (the last real-page run, on `cloud-lane-19`): its brief `/mnt/user-data/uploads/ilya-rewrite/docs/sessions/brief-desk-n135-a2-measure_r1_2026-10-28.md`, its report `/mnt/user-data/uploads/ilya-rewrite/docs/sessions/report-desk-n135-a2-fixes-18-songs_r1_2026-10-28.md`, and its archive, already unpacked at `/tmp/claude-0/-home-claude/b9285be6-e479-58ba-9f33-c16a0e4318f7/scratchpad/replay/a2/a2/` (`runsong.sh`, `scorer/`, `scorer/score_app.py`, `scorer/lever2-f6/`). Read-only: copy what you need into your own folder.
- The measure script: `docs/sessions/measure-n135-stage2b_2026-10-27/measure.mjs` in the clone (A2's `runsong.sh` shows how it was called: `--pdfs`, `--out`, `--only <L>`, `--timeout-s 2400`, `--url http://localhost:4173`).
- The page-half replay at step 5, the figures you compare with: `/mnt/user-data/uploads/ilya-rewrite/docs/sessions/report-desk-n135-stage2b-r5-replay_r1_2026-10-29.md` (its per-song table is step 4's; step 5 adds +4 on K, +2 on S, +4 on T read right; the desk's replay of steps 5, 7, and 10's predecessors gave 1,880 / 1,710 / 1,870 / 640 / 79, and step 7's MusicXML was byte-identical to step 5's).

Work in your own folder: `/tmp/claude-0/-home-claude/b9285be6-e479-58ba-9f33-c16a0e4318f7/scratchpad/browser/`. HOME is `/root`. Chromium: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` if present; otherwise find the one that exists and say which.

## Steps

0. **Controls first, written to `controls-before-measure.md` before any run:** your expectation and your likeliest failure. Then a positive control of the scorer: score A2's own as-built captures with `score_app.py` the way the replay report's section 4 does and get 1,514 / 1,451 / 1,591 / 559. If it does not reproduce, stop and report.
1. **Setup** as the real-page report did, on `5ee29ec2`. Find out from `measure.mjs` and the code how the scan path turns stage 2b's reader on (a hidden switch: `apps/web/src/lib/omr/underlay-switch*`); run it the way A2's measure ran the built app, and say how you turned it on, with the file and line.
2. **Run** all 18 songs, one at a time, through the built app (A2's `runsong.sh` pattern, paths changed to yours). Keep each song's MusicXML, console, and times. If a song times out, run it once more and say so.
3. **Score** with `score_app.py`: read right of 2,538, (b), (a), (c) of 2,385, vowelless alone, per song and in total, and the number of systems with no Russian row, as A2 did. Put the totals beside the replay's 1,880 / 1,710 / 1,870 / 640 / 79, and, per song, beside the replay's figures.
4. **Every difference** of a song from the replay: say which pages and rows differ and why, from the console lines and the captured rows, as far as you can read it. Step 3 explains a difference only where the piano's upper staff box is in play; say so only with the line that shows it.
5. Also report from the console: the per-page time, the reader's new counts if the console prints them (`counted`: ownNote, manyVowels, breaches), and any error.

## Definition of done

`report-desk-n135-stage2b-r5-browser_r1_2026-10-29.md` in your folder: the answer first (the five totals against the replay, and whether it holds), then controls, setup, the per-song table, the differences, the times, then NOT ESTABLISHED. Pack your scripts, captures (MusicXML, console, times), and scores into `browser-measure_2026-10-29.tgz` in the same folder, without node_modules or the build.

## Constraints

- Measure only; the desk interprets. No change to the app's code. If something in the app must be edited to run at all, stop and report instead.
- Token budget: stop by 300k tokens. If you reach it, write the report with what you have.
- House style: Canadian spelling, no em dashes, sentence-case headings.
- NOT ESTABLISHED beats a complete invented answer.

## Return memo (your final reply, five lines at most)

The five totals against the replay; whether it holds; the largest difference by song; the report's path; the archive's path and size.
