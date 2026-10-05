# Brief: bring the browser port up to homr's newest build

**From the desk (Fable), 2026-10-05 about 01:00. For an Opus builder. Dann, 00:54: *"Please check to see if homr's new version is available in a format we can assimilate?"* The desk checked: it is not; the model files are published, the code is not ported. The desk decided to port it.**

You work alone. Do not spawn other agents. **Limits: about 900,000 tokens, and 85 minutes on the clock** (run `date` at the start and as you go). **At 70 minutes, stop changing code and hand back what you have, honestly described.** Partial progress that is measured is worth more than a claim.

## The need

Ilya (a free web app for classical singers) now reads a scanned song with **homr-web 0.2.0**, a TypeScript port of the music reader **homr 0.7.0** (transformer model `396`). homr's author has an unreleased newer build on his main branch (commit `560ca5c`, model `465`) that reads much better on our songs: of every 100 notes right in pitch and length, 98.3 against 93.1 on the Tchaikovsky, and 97.9 against 81.3 on *Sunless* 1. The newer model's ONNX files are published. Loading them into the port is not enough: a helper tried it tonight and got 91.95 on the Tchaikovsky, with page 1 equal to main's output and differences from page 2 on. The newer build's reading code differs from release 0.7.0 in 22 Python files (1,434 lines added, 547 removed). **Your job: bring into a copy of the port the code changes that the notes depend on, so that the port with model `465` gives the same notes as desktop homr main on our pages.**

## What is on this machine

- **homr, both versions, in one clone (READ ONLY):** `/home/claude/liebharc/homr`. `HEAD` is main at `560ca5c`; the tag `v0.7.0` is fetched. `git diff --stat v0.7.0 HEAD -- homr/` lists the 22 files; `git diff v0.7.0 HEAD -- homr/<file>` shows each change. Read-only git only.
- **The port (AGPL-3.0):** `/home/claude/jymen/homr-web` at `cb333a5` (version 0.2.0, ports homr 0.7.0). It is the desk's reference copy: leave it as it is. **Make your working copy with `cp -r /home/claude/jymen/homr-web /home/claude/homr-web-main`** and work there. It has `src/` (TypeScript, mirroring homr's modules: `cv`, `dewarp`, `geometry`, `image`, `model`, `musicxml`, `pipeline`, `segmentation`, `transformer`, `golden`), `test/`, `bench/`, `tools/`, `docs/`, a `vitest` setup, and `node_modules` already installed. Read its README and `docs/` first: its author built it by matching the Python output exactly, stage by stage, and left the tools and notes for doing so. Use that method.
- **A helper's small patch that makes the port load model `465`** (vocabulary, two new position tokens, two model records): `/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/part15/homr-web-465.patch`, with its notes in `/mnt/user-data/outputs/memo-sonnet-homr-in-a-browser_r1_2026-10-04.md` (section on model 465) and its scripts in `/mnt/user-data/outputs/measure-homr-in-a-browser_r1_2026-10-04/` (`measure.mjs` runs the port on a page in headless Chromium; `c14n.py` compares two MusicXML files ignoring attribute order). Start from that patch.
- **Model files, hash-named as the port expects:** `.../scratchpad/part15/final-test/models/<sha256>/<file>` holds the `396` and `465` files (fp32 and fp16) and the segmentation model.
- **Desktop homr main, to produce the reference at any stage:** `.../scratchpad/homrmain-venv/bin/homr <page.png>` (about 30 seconds a page; it writes `<page>.musicxml`; `--write-staff-positions` and its debug flags give intermediate results; you may import its modules in that venv's Python to dump any intermediate value you need to match).
- **Test pages with main's own MusicXML beside them:**
  - Tchaikovsky Op. 38 No. 3, three pages: `.../scratchpad/asm/tch-1.png`, `tch-2.png`, `tch-3.png`; main's output `.../scratchpad/asm/main/tch-1.musicxml` to `tch-3.musicxml`.
  - Musorgsky *Sunless*, build songs only, 17 pages: `.../scratchpad/part22/work/homr/sun-01.png` to `sun-17.png`, each with main's `sun-NN.musicxml` beside it. Pages 01 to 02 are song 1, 03 to 04 song 4, 05 to 11 song 5, 12 to 17 song 6.
- **The scorer and truths, for the final numbers:** `.../scratchpad/part22/work/conv.py`, `score.ts`, `scan-scorer.ts` (use unchanged), truths in `.../scratchpad/part22/in/truth/`. Main's scores: Tchaikovsky 98.3; *Sunless* 1, 4, 5, 6 at 97.9, 100.0, 96.1, 96.9.
- **Speed:** two CPU cores, no graphics chip. The port reads a page in about 55 seconds under Node on one WebAssembly thread and 100 to 150 seconds in headless Chromium, so choose a small set to iterate on (the three Tchaikovsky pages and `sun-01`, `sun-02`), prefer the port's Node harness, and compare intermediate stages (staff rectangles, dewarped staff images, token sequences) rather than waiting for whole pages where you can. Playwright's Chromium, if needed: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, started with no proxy for localhost.

## What to do

1. **Find which changes the notes depend on.** Of the 22 files, some serve things Ilya does not use: title and chord text (`title_detection.py`), reading a PDF (`pdf_utils.py`), joining pages (`relieur.py`), command-line options in `main.py`. Others change what notes come out: `staff_detection.py`, `staff_parsing.py`, `staff_dewarping.py`, `brace_dot_detection.py`, `bounding_boxes.py`, `autocrop.py`, `constants.py`, `model.py`, `segmentation/inference_segnet.py`, `transformer/*`, and `music_xml_generator.py`. Read each diff and say, with the evidence, whether it can change the notes. Write that table first; it is useful even if the rest runs out of time.
2. **Port the changes that can, in dependency order,** mirroring the port's existing structure and style, and checking each stage against the Python build's own intermediate values where the port's tools allow it.
3. **Notes first.** The newer build also writes each note's place on the page (`point_mapping.py`, the `imgpos` comment in the MusicXML). Ilya wants that later. Port it only after the notes match, and only if time remains.
4. **Prove it.** For each test page you ran: is the port's MusicXML equal to main's, ignoring attribute order and the `imgpos` comments? Where it is not, give the first difference. Then the scores through the scorer for every song whose pages you all ran, beside main's.
5. **Keep the old model working.** With model `396` the port must still give what 0.2.0 gives; run the port's own tests (`npx vitest run` in your copy) before and after and report both.
6. **Package it** so Ilya can use it: `npm pack` in your copy to a tarball, with the version set to something that cannot be mistaken for the author's (for example `0.2.0-ilya.1`), the README's "homr release" line corrected, and every file you changed carrying a one-line notice at its head that it was changed, by whom (Ilya project), and when, as the AGPL asks. Keep the LICENSE and NOTICE files. Write `CHANGES-ilya.md` at the root listing each file changed and the homr commit it follows.

## Rules

- homr and homr-web are AGPL-3.0. Your copy of the port stays AGPL-3.0 and will be published. **Nothing of theirs is written into `/home/claude/ilya` or `/home/claude/ilya-build`;** do not touch either. Do not modify `/home/claude/liebharc/homr` or `/home/claude/jymen/homr-web`.
- Never write with git anywhere (your working copy is a plain copy; do not commit in it).
- Use only the pages named above. Do not open any file whose name contains `sunless-02`, `sunless-03`, `sun2`, `sun3`, `song2`, `song3`, `op38-2`, or `test-private`. (`sun-02.png` and `sun-03.png` in the `part22/work/homr` folder are pages of build songs 1 and 4 and are allowed; the forbidden names are different.)
- Plain words in comments and in the report: say what the code does. No figures of speech. Canadian spelling, the Oxford comma, no em dashes, no "simply", "just", or "easy".
- Every claim in your report comes from something you ran or read. Do not say a page matches unless you compared it. What you could not establish, mark NOT ESTABLISHED.

## Hand back

1. `/mnt/user-data/outputs/homr-web-main/`: the tarball from `npm pack`, `CHANGES-ilya.md`, and a patch (`diff -ruN` of `src/` between the reference copy and yours).
2. Your report as your final message to the desk (do not try to write a report file; the desk saves it). First a summary of at most ten lines: how many test pages match main exactly, of how many run; the scores beside main's; whether model `396` still matches; what is not ported and why; what stopped you if something did. Then the table from step 1; what you ported, file by file; the vitest results before and after; what could not be established; the tokens and minutes used.
