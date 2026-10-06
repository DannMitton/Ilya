# Runbook for Code on Dann's Mac: the reader to 95 (r1, 2026-10-05)

Written and kept by the desk (Opus). Dann authorized this way of working on 2026-10-05 at 16:17: the desk works without asking each step, at most two helpers at once, Code on his Mac left running, and Dann runs the ship command himself.

## How you work

1. Read this file. Do the first step whose State is `READY`. Do nothing marked `WAIT`.
2. When a step is done, write its report where the step says, then change that step's State to `DONE <time>` in this file, and nothing else in this file.
3. Then read this file again. The desk adds and releases steps here. If no step is `READY`, wait 3 minutes and read it again. Keep doing that for up to 3 hours, then stop and say so.
4. Stay on Sonnet. Never commit, stage, push, or run `~/Downloads/ilya-ship.sh`. Dann ships.
5. Before you start a server, list what is listening (`lsof -nP -iTCP -sTCP:LISTEN | grep node`). Never stop a process you did not start.
6. Every report has a section for what you could not establish. NOT ESTABLISHED beats a complete invented answer.
7. Do not message Dann for decisions. Write the question at the top of your report and set the step's State to `BLOCKED`; the desk answers here.

## Steps

### Step 1. State: DONE 16:22 (report read by the desk)
Carry out `docs/sessions/brief-code-webgpu-against-wasm-on-the-imac_r1_2026-10-05.md`, Part A and, if its condition is met, Part B. Report where the brief says.

### Step 2. State: DONE 23:46
**A stored scan is restored through Ilya's old reader, not homr. Fix it.** Step 1 found both homr paths read 98.28 on this iMac, so Dann's 9/8 came from elsewhere. The desk read the code: on load, a stored song is restored by `onMount` calling `handleFile(file, restore.answers)` (`apps/web/src/lib/score/ScoreUploader.svelte:780-785`), which goes to `ingestScoreFile` with `readPages` (`:577`, `:628`), the old reader. Only `take()` (`:260-285`) sends a scan to homr (`readScanAsScore`). Dann's song «3. Средь шумного бала» (id `5bac11c4-0b61-4dde-b7bb-b4eec724e100`) was stored on 2026-10-01 and was the active song when he opened the alias. Whether his 15:08 screen came from that restore or from a fresh drop is NOT ESTABLISHED; the path is wrong either way.

1. Measure first, with your step 1 driver: in a fresh profile, drop the Tchaikovsky PDF (score it), then reload the page so the song is restored (score that). Report both scores and the restored reading's metre.
2. Build: a restored scan (PDF or picture) is read by homr, the same path `take()` uses, never by the old reader. Then keep the reading, as Dann ruled 2026-10-01 23:18 ("read once and keep both the scan and the reading", `docs/memory/CONTRACT.md` §6; `docs/sessions/plan-scan-reader_r4_2026-10-01.md` section 4): store homr's joined MusicXML with the song, stamped with the reader's version (`homr-web` package version and model `465`). On restore, use the stored reading when its stamp equals the current reader's; otherwise read again with homr and store the new reading. A song stored before today, with no reading, is read once by homr and then kept. The old reader stays reachable only through `?reader=ilya`.
3. Tests for: restore uses homr; restore uses the kept reading and does not read again; a changed stamp reads again.
4. Measure again: drop, reload, score both. Both must be 98.28 with the metre 3/8. Time the reload from navigation to the score drawn.
5. Run the eight gates; name any number that moved and the tests that moved it.

Report: `docs/sessions/report-code-restore-reads-with-homr_r1_2026-10-05.md`.

Ruled by Dann 2026-10-05 22:54 on the desk's three options (keep the old reader; re-read with homr on every open; read once with homr and keep the reading): *"I choose your option 3"*. Who offered it: the desk.

### Step 3. State: READY (released by the desk 2026-10-05 at 23:55)
The desk counted the saved scan songs with corrections in Dann's Chrome at 23:52, read only: on the alias, 3 scan songs, 0 corrections each; on `ilya.dannmitton.com`, no songs store. So no song is orphaned. The two ratchet raises in step 2 stand (DESK DEFAULT). Read on the path Ilya chooses (WebGPU on this iMac).
The baseline on the singer's path. Read every page of the five build songs (Tchaikovsky and *Sunless* 1, 4, 5, 6) through Ilya in Dann's installed Chrome, on the path step 1 leaves Ilya using, and score each song with the pipeline in `docs/sessions/measure-checks_r1_2026-10-05/` (`README.txt` lists the commands: `scripts/join.mts`, `scripts/scorer/conv.py`, `scripts/scorer/score.ts`, `scripts/baseline.py`). The page images and truth files are in `~/Downloads/_desk-2026-10-05/resume-kit.tgz` (`kit/pages/tch-1.png` to `tch-3.png`, `sun-01.png` to `sun-17.png`; `kit/truth/`; the song-to-page map is in `measure-checks_r1_2026-10-05/README.txt`, INPUTS); unpack it under the session home, never into the repository. Report per song: notes read with pitch and length as printed, of printed notes, and every difference with its cause. Do not run the test-only songs (*Sunless* 2 and 3). Report: `docs/sessions/report-code-baseline-on-the-singers-path_r1_2026-10-05.md`.
