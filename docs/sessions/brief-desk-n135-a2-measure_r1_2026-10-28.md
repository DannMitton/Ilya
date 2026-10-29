# Brief: A1's fixes measured on all 18 build songs (desk helper, Sonnet, r1, 2026-10-28)

Measure only. Keep nothing in any repository: no git `add`, `commit`, `push`, `checkout`, `reset`, `restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`. Do not publish an artifact. NOT ESTABLISHED beats a complete invented answer.

## Why

N.135 stage 2b reads the words from a scan. Read both reports in full first: A1, `/mnt/user-data/uploads/ilya-rewrite/docs/sessions/report-desk-n135-app-vs-harness-rows_r1_2026-10-28.md`, and the real-page measure, `/mnt/user-data/uploads/ilya-rewrite/docs/sessions/report-desk-n135-stage2b-real-page_r1_2026-10-28.md`. A1 found on two songs, B01 and B04, that the app loses syllables at the call "is this row Russian?":

1. `apps/web/src/lib/omr/underlay-tokens.ts:50`: a lone hyphen wider than `0.5 * options.inkHeight` is treated as a dash, so words are not sewn. Limit 0.75 or 1.0 recovered 46 syllables on B04 and cost nothing on B01; removing the rule cost B01 18.
2. `apps/web/src/lib/omr/underlay-language.ts:27`, `RUSSIAN_SHARE` 0.5: at 0.3 B04 recovered 18 more.
3. The band runs into the piano because homr omits the piano's upper staff box (`underlay-band.ts:97-99`). Not part of this measure.

The question now: do fixes 1 and 2 hold on all 18 songs, and what do they cost (junk rows called Russian, real dashes fused)?

## Inputs (already staged in your container)

- PDFs, named by harness letter: `/mnt/user-data/uploads/Downloads/_desk-2026-10-28/a2-inputs/pdfs/{B01,B02,B03,B04,B06,B07,B08,B09,B10,K,M,P,S,T,U1,U4,U5,U6}.pdf` (73 pages).
- Model: `/mnt/user-data/uploads/Downloads/_desk-2026-10-28/a2-inputs/rus_prereform_r2_29000.traineddata` (md5 `2ff2af3e33461cd64e7d2015ef21d10d`).
- A1's archive: `/mnt/user-data/uploads/Downloads/_desk-2026-10-27/desk-n135-diag_2026-10-28.tgz` (`n135-diag/`: `tools/` holds `replay.mjs`, `langcheck.mjs`, `variants.mjs`, `seatvar.mjs`, `thrrows.mjs`, `hnorm.mjs`, `read-dir.mjs`; `underlay-reader.ts.orig`; `model/` with the tesseract core and worker; and the `[diag]` capture of B01 and B04). Read `n135-diag/tables.md` and the tools before writing anything new.
- The real-page measure's archive: `/mnt/user-data/uploads/Downloads/_desk-2026-10-27/desk-n135-real-results_2026-10-28.tgz` (`n135-real/`: the report, `scorer/` with `readright_streams`, the credit functions, the mapper, `baseline-per-song.json`, and `scorer/ctl117/` with `score117.py` and `labels2/`; `out/` and `out-nogate/` per song).
- Harness scripts if needed: `/mnt/user-data/uploads/Downloads/_desk-2026-10-27/desk-measure-scripts_2026-10-27.tgz` and `desk-measure-scripts-2_2026-10-27.tgz`.
- Code: clone `https://github.com/DannMitton/Ilya.git`, branch `cloud-lane-19`, head `383187a` (check the head). Setup as the real-page report section 2 did: `pnpm install --frozen-lockfile`, `fetch-omr-models.mjs`, `copy-underlay-model.mjs` with the model above, `pnpm --filter @ilya/web build`, `vite preview`, headless Chromium, the stage 2b driver `docs/sessions/measure-n135-stage2b_2026-10-27/measure.mjs` with `?words=read`.

Work in `/home/claude/a2/`. Write intermediate files there, never in `/tmp`.

## What to do

0. **Controls first, written to `controls-before-measure.md` before any run**: your expectation and your likeliest failure. Positive controls before use: your replay of B01 and B04 must give A1's numbers (as built: B01 132, B04 50; limit 1.0: 132, 96; limit 1.0 and share 0.3: 132, 114). Your read-right scorer on the real-page report's gate-off streams must give its per-song figures (total 1,514).
1. **Capture.** Apply A1's measurement-only `[diag]` edit to `underlay-reader.ts` (reconstruct it from A1's report section 2 and its tools; save the original first), build, and run all 18 songs once through the app, gate off (the real-page report's `nogate.patch`, `applyUnderlay`, `const below = -1`). Run each song as its own `run_in_background` command; never start anything with `&`; never `pkill` broadly (it kills your own shell). About 140 s a page; about 3 hours in all. Restore both source files from the saved copies afterwards and check `git status`.
2. **Replay offline** on the capture, changing one constant at a time with the clone's own modules, as A1's `variants.mjs` and `seatvar.mjs` do:
   - dash limit {0.5 as built, 0.75, 1.0, 1.25} times the ink height;
   - `RUSSIAN_SHARE` {0.5 as built, 0.4, 0.3};
   - the grid of both (12 cells).
3. **Score each cell, per song and in total**: read right of 2,538 printed syllables (the real-page report's song-level scorer), seating (b), (a), (c) of 2,385 truth syllable notes, and the number of systems with no Russian row. Report the gate as built too: how many songs would write words.
4. **Cost of each cell**: rows called Russian that the harness labels other or notext (`labels2/`, by overlap as A1 paired them), and whether any of them was seated; any real dash fused into a word (list the words).
5. **One recommendation** for the two constants, with the numbers behind it.

## Done when

The table of 12 cells by 18 songs exists, every control passed or its failure is stated, the sources are restored, and the results are delivered.

## Deliver

- A report, `/mnt/user-data/outputs/report-desk-n135-a2-fixes-18-songs_r1_2026-10-28.md`, in this order: the answer first (five lines at most), controls, the per-cell totals table, the per-song table for the as-built cell and the recommended cell, costs, departures, and a section **What I could not establish**.
- One tarball of your whole folder, `/mnt/user-data/outputs/desk-n135-a2_2026-10-28.tgz`.
- Every claim about code carries `path:line`. No figure of speech stands in for a count.

## Budget and conduct

- Worst case 300k tokens. Wait for long runs with a polling loop that prints one line, not with repeated reads of logs. Read logs with `tail`, never whole.
- If a run dies, re-run that song once; a second failure is reported, not retried.
- If you cannot get past setup within 45 minutes of trying, stop and report what stopped you.
