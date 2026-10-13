# Brief for Code on the Mac: the final test on held-out set 4, r2

Written by the desk (Opus) 2026-10-12 about 14:22. **r2, about 14:26: applies Fable's eight amendments** (`docs/sessions/review-fable-brief-row86_r1_2026-10-12.md`, SEND WITH AMENDMENTS); r1 superseded. QUEUE row 86. For Code on Dann's Mac, Sonnet, after row 85 reports. **Measures only: no app code changes, no scorer changes, and nothing in the working tree touched** (rows 78a to 85 sit there uncommitted; this row writes only three things: its own new harness folder, its report file in `docs/sessions/`, and one State line for row 86 in `docs/memory/QUEUE.md`, nothing else in `docs/memory/`). Same protocol as row 76 (`docs/sessions/brief-code-the-final-test-set3_r1_2026-10-11.md`, read whole, and its report `report-code-the-final-test-set3_r1_2026-10-11.md`, read whole), with the changes below. Dann said *"Sure, let's run the final test on set 4 as you recommend. Proceed"* (2026-10-12 14:20).

Displaces: nothing.

## Why

THE ONE THING: the reader reads at least 95 of every 100 printed notes on songs it has never seen, on the singer's path. Set 3 was spent when its four BELOW songs were opened (row 77). Set 4 is ten fresh pre-1918 romances chosen from IMSLP on 2026-10-12, three with the voice in bass clef; no reader has run on them. **The set gets one run.**

## What the desk checked before writing this (14:15 to 14:21, through the bridge, tsx)

- `final-line.ts` against each of the ten truth files' own `conv.py` round trips: 10 of 10 score 100.0, octave shift 0, every judged bar's metre as printed; total 1456 of 1456; 10 notes marked UNSURE, all accepted by the script.
- A planted control (one pitch up a semitone, one length doubled, one note removed, on one song): 67 of 70, missing 1, pitch misreads 1, length misreads 1.

## The run

1. Confirm, as row 76 did (Vercel `get_deployment` and `curl -I`), that the deployed alias `https://ilya-git-shane-dannmittons-projects.vercel.app` serves commit `9f9e896` on `Shane` (the tip of `origin/Shane` by `git ls-remote` at 2026-10-12 14:27; its `apps/web/package.json:24` depends on `homr-web-0.2.0-ilya.7.tgz`, read by the desk), READY, with `aliasError` null, and that `curl -I` returns 200 with no sign-in. If the commit differs, stop and report. Record the deployment ID.
2. **Rehearsal** on K and M, exactly as row 76 (its `drop.mjs`, `rehearse.py`, and `rehearsal-lines.txt` in `docs/sessions/measure-final-test-set3_2026-10-11/`, with `SITE` set to the alias): their lines must equal `rehearsal-lines.txt` (row 77 kept K and M's readings byte for byte, its report), and both readings must carry the reader stamp `homr-web@0.2.0-ilya.7/465`. If a line or the stamp differs, stop and report. No set 4 song is dropped before both checks pass.
3. **The ten.** Scans: `~/Downloads/_desk-heldout4-private/truth/*.pdf` (the cut single songs; **not** the whole files one folder up, nothing in `_reserve/`, and nothing in `rt/`). Truth: the `.truth.json` of the same stem beside each. Label them `4A` to `4J` in the order the glob returns them. **You do not open, view, list, or print any scan, truth, reading, or bar, and you do not print a file name.** Drop each through the singer's door on the alias as row 76's adapter did (headless Chrome, `channel: 'chrome'`, `--enable-unsafe-webgpu`, a fresh context per song, the file into `input[type="file"].hidden-input`), take the reading from the `ilya-library` IndexedDB `sources` store, run `conv.py`, then
   `tsx docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts song <label> webgpu <truth.json> <read.json> <private folder>/keep`
   The private folder is `~/Downloads/_desk-heldout4-private/run/`, outside the tree.
4. **A refusal** (the drop box refuses the song: the poem route, an error, or no score after ten minutes, as row 55's step 4 defines it) scores 0 with `final-line.ts refused`. **A load fault** (the page or a model file failed to load before the reader started, with no `[omr]` line) is not a reading: drop the song once more in a fresh context and say "second drop after a load fault" in the report; a second failure scores 0.
5. Then `final-line.ts total <private folder>/keep`.
5a. After the total, repeat step 1's `get_deployment` check and record the deployment ID and commit beside the first. Report both. Dann pushes nothing to `Shane` between the rehearsal and this check; if the deployment ID changed, say so in the first line of the report.
6. Keep the harness in a new folder `docs/sessions/measure-final-test-set4_2026-10-12/`: scripts (row 76's, copied) and the printed lines files only. Every scan copy, raw reading, `conv.py` output, `keep`, and all stderr from Playwright, `conv.py`, and `tsx` goes under `~/Downloads/_desk-heldout4-private/run/`, so that no path or stem reaches the terminal, the harness folder, or the report. No dev server is started; every drop is on the alias.

## Known before the run (so the report does not rediscover them)

- 10 notes are marked UNSURE across five songs; one song's truth also carries short pickup bars, and one carries a third verse printed on its own staves, kept in printed order.
- One song carries 6 grace notes in `graceNotes`, outside the scored events.
- Three of the ten print a second language under the Russian (one French, two German). Row 77 found extra notes from such lines in set 3; the truth records the Russian line only.
- The truth files are drafts by two Opus helpers, each bar checked for sums and a round trip, not proofed by Dann.

## What it prints, and then stop

The two rehearsal lines, the ten lines 4A to 4J, and the total, unedited. **Then stop.** Do not diagnose a BELOW song and do not open `keep`: opening a song is Dann's decision.

## Report

`docs/sessions/report-code-the-final-test-set4_r1_2026-10-12.md`: the commit and stamp checked and how, the deployment ID before and after, the adapter, the Google Chrome, Playwright, node, and `tsx` versions used, the rehearsal lines beside row 76's, the ten lines and the total verbatim, any refusal, and "Could not establish". NOT ESTABLISHED beats a complete invented answer. No git command that writes. Do not edit `docs/memory/` except row 86's State in `QUEUE.md`.
