# Brief: Ilya's reader as shipped, its misses by cause, and the most each fix could gain

**From the desk (Fable), 2026-10-04 about 21:25, on Dann's "Proceed" of 21:18. For a Sonnet helper. Part 22 of `parts-a-scan-to-a-seated-song_r1_2026-10-04.md`, and measurements 1 to 3 of the Opus code review (`memo-opus-homr-code-against-ilyas-reader_r1_2026-10-04.md`, section 7).**

You work alone. Do not spawn other agents. **Limits: about 400,000 tokens, and 35 minutes on the clock.** When you near either, stop and report what you have; a partial table with its gaps named is worth more than a late one.

## Why

Ilya is a free web app for classical singers. Its page reader reads the voice line from a scanned song. On scans of five songs it gets 41 to 73 notes of every 100 right in pitch and length; an outside reader, homr, gets 81 to 97. Before anyone designs a fix, the desk needs two facts about Ilya's reader as it is shipped today: **where its misses come from, counted by cause**, and **the most each kind of fix could gain if that fix were perfect**. No training and no change to the app is involved.

## What is on this machine

- **Ilya's tree, READ ONLY:** `/home/claude/ilya` (branch `Shane`, commit `b2106d09`; the reader is as shipped at `29a0a10` and unchanged since). Packages are installed (`pnpm install` has run). The reader is `tools/e16-harness/reader/`; it runs in a browser under Pyodide through `apps/web/src/lib/reader/`.
- **How it was last measured on the app's own path:** `docs/sessions/measure-baseline_r1_2026-10-02/read-songs.mjs` (starts from a PDF, uses the app's `rasterizePdf` and `WorkerPageReader` in a headless browser against the dev server, with clef and key given per song), with `docs/sessions/report-code-the-baseline-on-eight-songs_r1_2026-10-02.md` and `docs/sessions/report-code-the-yardstick_r1_2026-10-02.md` describing it. Later reports that changed the reader: `docs/sessions/report-code-*_2026-10-02.md`. Read what you need of them to run the reader the same way; adapt `read-songs.mjs` in your own work folder (it has Mac paths in it).
- **To run the app here:** in `/home/claude/ilya/apps/web`, `pnpm dev` in the background serves `http://localhost:5173`. Playwright's Chromium is at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (pass it as `executablePath`; never run `playwright install`). A Playwright script must sit inside `/home/claude/ilya/apps/web` to resolve `@playwright/test`: put it there under a name beginning `_desk_`, and delete it when you finish, so the tree stays clean. To stop the server, find it with `pgrep -f "vite/bin/vite.js"` and kill by number; `pkill -f "vite dev"` kills your own shell.
- **Your inputs, prepared by the desk:** `/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/part22/in/`
  - `sunless-build-pages.pdf`: 17 pages of the Lamm 1931 scan of Musorgsky's *Sunless*, holding ONLY the four build songs. Pages 1 to 2 are song 1; pages 3 to 4 are song 4; pages 5 to 11 are song 5; pages 12 to 17 are song 6. Take each song's key and clef settings from `read-songs.mjs`, lines 12 to 17 and the `cfg` it builds: song 1 `key: 2`, song 4 `key: 2`, song 5 `key: 0`, song 6 `key: 7`. In the full scan those songs sat on pages 1 to 2, 9 to 10, 11 to 17, and 18 to 23, which is what that script's page lists say.
  - `tchaikovsky-op38-3.pdf`: Tchaikovsky Op. 38 No. 3, Jurgenson 1878, 3 pages (key two sharps, treble clef, metre 3/8).
  - `truth/`: the truth file for each of the five songs. The four *Sunless* files are from Dann's own engraving. The Tchaikovsky file is the desk's draft, not proofed by Dann.
  - `tools/score.ts` and `tools/conv.py`: the desk's caller of the scorer, and its converter from homr's MusicXML to the scorer's read format. The scorer itself is `/home/claude/ilya/tools/e16-harness/src/scan-scorer.ts`; use it UNCHANGED (copy it beside `score.ts` to run it).
- **homr**, for step C only: a working install of homr main (`560ca5c`) at `/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/homrmain-venv` (run `homrmain-venv/bin/homr <page.png>`; about 30 seconds a page on this machine; rasterize pages with `pdftoppm -r 400 -png`). homr's reads of the Tchaikovsky pages already exist at `scratchpad/asm/main/tch-1.musicxml` to `tch-3.musicxml`.
- **Work only in** `/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/part22/work/`.

## Step 0, the control. Do this first, and stop if it fails

Run Ilya's reader on the five songs on the app's own path and score each with the scorer. The headline (notes of every 100 right in pitch and length) should come out near: Tchaikovsky 73.0; *Sunless* 1, 4, 5, 6 at 64.6, 69.8, 46.1, 41.0 (`docs/memory/STATE.md:58`). Report what you get beside those. If a song differs by more than 2, say so plainly and try once to find why (raster size, key or clef setting, the page list); if you cannot, carry on and mark that song's rows as NOT REPRODUCED.

## Step A. Misses by cause

For each song and in total, from the scorer's aligned pairs and difference list and from the reader's own output (each note's `abstain` object and its reasons), count every truth note into exactly one of these, and every other fault separately:

1. **Right** in pitch and length.
2. **Not found:** a printed note with no matched read note.
3. **Pitch only wrong,** split by cause: (a) the printed sign: the read pitch is the truth's letter and octave with a different accidental, or the reader abstained on the accidental (give its reason codes); (b) the staff position: a different letter; (c) the octave.
4. **Length only wrong,** split by cause: (a) the reader abstained (give its reason codes, counted); (b) a dot: the two lengths are in the ratio 3 to 2; (c) the count of flags or beams: a ratio of 2 or 4; (d) other. Also count how many of these are a note that the converter would draw as a quarter only because an EARLIER note in its bar abstained.
5. **Both wrong.**

And separately: **extra notes** (read, not printed); **rests** printed, found, and right; **bars** printed and read, and how many songs or pages have a different bar count. Where it takes little effort, say what the extras and the not-found notes have in common (for example, look at five crops of each on the build pages and describe them in a line each). These are build songs: you may look at their pages.

## Step B. The most each fix could gain

Work on the reader's OUTPUT, not inside the reader. Starting from each song's read and the scorer's alignment, put the truth in place of ONE kind of decision at a time, rescore with the unchanged scorer, and report the new headline:

- B1: every matched note's accidental made right (letter and octave left as read).
- B2: every matched note's staff position and octave made right (accidental as read where that is meaningful; say how you handled it).
- B3: every matched note's length made right.
- B4: every not-found note put in, right.
- B5: every extra note taken out.
- B6: B1 and B3 together. B7: B4 and B5 together. B8: all of them (this must score 100; it is your control on the method).

Give a table: one row per fix, one column per song, plus the total over all five songs weighted by notes. State plainly that these are upper bounds, and that a fix inside the reader could gain less or more than its row because decisions depend on each other (a missed barline changes which accidentals carry). If you can count how many accidental misses follow from a bar boundary the reader missed or added, do; if not, write NOT ESTABLISHED.

## Step C, only if time and tokens remain. homr's misses by field on the same songs

Run homr main on the 17 *Sunless* build pages (about 9 minutes), convert each song with `conv.py` unchanged, score with the same scorer, and give homr's row for step A's five classes and its not-found, extra, pitch-only (split a, b, c), and length-only counts, per song and in total, with the Tchaikovsky from the reads that already exist. If you skip this step, say so.

## Rules

- **Read only** under `/home/claude/ilya` except the one `_desk_` script in `apps/web`, which you delete at the end. Never write with git. Confirm at the end that `git --no-optional-locks status --porcelain` in `/home/claude/ilya` prints nothing.
- **The held-out songs.** *Sunless* 2 and 3 and Tchaikovsky Op. 38 No. 2 are test songs that nobody building may look at. Your inputs do not contain them. Do not open any file whose name contains `sunless-02`, `sunless-03`, `sunless_02`, `sunless_03`, `sun2`, `sun3`, `song2`, `song3`, `raw2`, `raw3`, `old2`, `old3`, `rep2`, `rep3`, `op38-2`, or `test-private`, anywhere on this machine, and do not use the full Lamm PDF in `/mnt/user-data/uploads/Downloads/`.
- Every number comes from a run you made; say how to repeat it. What you could not establish, mark NOT ESTABLISHED. Do not explain a number by a cause you did not observe.
- The page is never "wrong"; a reader "misreads".

## Hand back

1. A memo at `/mnt/user-data/outputs/memo-sonnet-misses-by-cause-and-ceilings_r1_2026-10-04.md`. House style: Canadian spelling, the Oxford comma, NO em dashes, plain words, no "simply", "just", or "easy". Open with a summary of at most ten lines that the owner can read alone: the control; the three largest causes with their counts; the three largest ceilings; what surprised you. Then the tables. Then how it was run, what could not be established, and how to repeat it.
2. Your scripts and the per-song reads and scores for the five build songs copied to `/mnt/user-data/outputs/measure-misses-by-cause_r1_2026-10-04/` (no page images over 2 MB each; at most ten crops).
3. Your final message to the desk: the memo's path, the summary, the tokens and minutes you used, and the output of the `git status` check.
