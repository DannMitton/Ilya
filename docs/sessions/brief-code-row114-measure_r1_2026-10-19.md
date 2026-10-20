# Brief for Code on the Mac: the reader on the sealed set's proofed pages, row 114, r1

Written by the desk (Opus) 2026-10-19 19:15. QUEUE row 114. For Code on Dann's Mac, Sonnet. **Measures only:** no app code, no scorer, and nothing tracked in the tree is changed. You write two things: your report, `docs/sessions/report-code-row114-measure_r1_2026-10-19.md`, and the private files the scripts write under `~/Downloads/_colleague-pages/run-2026-10-19/run/`. You do not edit `docs/memory/`. No git command that writes (`CONTRACT.md` §4): `git ls-remote`, `git log`, `git show`, and `git diff` only, each as `git --no-optional-locks`.

Displaces: nothing. Review: `CONTRACT.md` §1 item 19 lets a brief that only measures start while its review runs; the desk has the review go over your report (DESK DEFAULT, sparing Fable's weekly limit).

## Why

THE ONE THING: Ilya's reader reads at least 95 of every 100 printed notes on unseen songs, on the singer's path. Row 114 is the sealed set Dann scanned in Notes on 2026-10-18 (the 1967 Mussorgsky collection, Muzyka, Moscow). Dann proofed 15 pages' truth on 2026-10-18 and 2026-10-19, and the desk added the voice staff's markings (slurs, accents, tenuti, fermatas). **No reader has run on this set. This is its first run.**

## What the desk built and checked (2026-10-19, through the bridge, tsx and python3)

- **Songs, cut whole from Dann's PDF** with `qpdf` (the decoded image of a page is identical to the source's, md5 checked): `~/Downloads/_colleague-pages/run-2026-10-19/songs/song1.pdf` to `song4.pdf` (2, 4, 6, and 5 pages).
- **Song truths, assembled from the page truths** by `docs/sessions/measure-row114_2026-10-19/assemble.py` into `.../run-2026-10-19/truth-song/`: 126, 197, 71, and 135 notes. Whole-bar rests and bars of one rest carry no event, as `conv.py` reads a reading; grace notes (4, all in song 1) are set apart in `graceNotes`, as in set 4. Song 3 includes printed pages 11 and 16, which Dann has not proofed: their 10 notes are marked `unsure`, so `final-line.ts`'s second score is the proofed pages alone.
- **Controls.** Each song's truth MusicXML, read back through `conv.py` and `final-line.ts`: songs 1, 3, and 4 score 100.0; song 2 scores 197 of 197 right with 6 extra, the ossia's lower option (bars 18 to 22 of printed page 10) written as a second voice. `ossia-line.py` finds those 6 in the ossia bars and gives 100.0 without them. A planted control (one pitch up a semitone, one length doubled, one note removed) gives 132 of 135, missing 1, pitch 1, length 1. Markings read back whole (all 110 of 110 kept on the scored notes); a planted markings control (one accent and one slur start removed, one tenuto added) gives exactly those three. `songs.py` itself was run end to end on these round trips.
- **Not scored:** the markings on whole-bar rests (5 fermatas, on bars of rest), and the metre (the truth files carry no printed figures).

## The run

1. **The deployment.** Confirm with Vercel `get_deployment` and `curl -I` that `https://ilya-git-shane-dannmittons-projects.vercel.app` is READY with `aliasError` null, returns 200 with no sign-in, and serves `Shane`. `git ls-remote origin refs/heads/Shane` should give `ba6f064`. If the deployed commit is not `ba6f064`, run `git diff --stat <deployed> ba6f064 -- apps packages third_party tools`: empty means the app is the same and you continue; anything else, stop and report. Record the deployment ID and commit.
2. **The rehearsal:** `caffeinate -i python3 docs/sessions/measure-row114_2026-10-19/rehearse.py` from the repository root. It drops K and M (held-out set 2) through the alias and prints their lines beside row 76's. **Stop only if a drop is refused or a stamp is not `homr-web@0.2.0-ilya.7/465`.** A line that differs from row 76's is reported, not a stop: the reader has changed since (row 89, `1ec2ef2`).
3. **The four songs:** `caffeinate -i python3 docs/sessions/measure-row114_2026-10-19/songs.py`. It drops each song whole through the singer's door on the alias (`drop.mjs`, unchanged from row 86: headless Google Chrome, `--enable-unsafe-webgpu`, a fresh context per song, the file into `input[type="file"].hidden-input`), takes the reading from the `ilya-library` IndexedDB `sources` store, and prints, per song: the drop line, the stamp, the note line (`final-line.ts`), the markings line (`marks-line.ts`), song 2's ossia line, then the total note line and the total markings line.
4. **A refusal or a load fault**, as row 86 defined them: a refusal scores 0 (the script does it). A load fault (no `[omr]` line, the page or a model failed to load) is not a reading: run `REDROP=1 caffeinate -i python3 .../songs.py` once more, and say "second drop after a load fault" in the report.
5. **The deployment again**, as step 1, after the totals. If the deployment ID changed, say so in the report's first line.

## What it prints, and then stop

Print every line the two scripts print, unedited, in the report. **Then stop.** Do not open `keep/`, a reading, or a scan, and do not diagnose a song: the desk opens them next.

## Report

`docs/sessions/report-code-row114-measure_r1_2026-10-19.md`: the deployment and commit before and after and how each was checked; Google Chrome, Playwright, node, and `tsx` versions; the rehearsal lines; every line of `songs.py`, verbatim; any refusal or load fault; and a section "Could not establish". NOT ESTABLISHED beats a complete invented answer.
