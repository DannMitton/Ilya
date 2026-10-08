# Brief for Code: a piano staff is never read as the voice (r1, 2026-10-08)

Written by the desk (Opus) 2026-10-08 about 02:05. Model: **Opus** (a diagnosis in the port's staff grouping; Sonnet if Dann prefers the cheaper pool). For Code on the Mac. QUEUE row 49. Runs after row 48. Adapted from the desk's cloud brief of 2026-10-07 (the cloud helper could not run: the workspace restarts end it).

## What the singer sees, and why

On eight songs Ilya had never seen, the reader read 935 of 960 printed notes right but drew **61 notes that are not on the page**: 38 in Grechaninov Op. 20 No. 4, 22 in Varlamov «Скажи, зачем?» (`docs/sessions/report-heldout-blind-read_r1_2026-10-07.md`). Dann saw it on his iMac 2026-10-08 01:02: Grechaninov's compass reads G♯1 to G♯5, and its tessituragram has bars for piano notes. A singer would have to find and delete every one by hand.

Dann opened these two songs for diagnosis 2026-10-07 19:47. **The other six songs of that set stay unseen** (see "Strict limits").

## The desk's diagnosis so far (2026-10-07 21:25, by comparing bars; start here)

- **Varlamov (22 extra):** Ilya's bars 25 to 29 are the piano right hand of page 3's FIRST system, and bars 30 to 34 its left hand (octaves such as A♭2 with A♭1); that system's voice staff is lost. Bars 35 and 36 are the voice of page 3's second system, correct. Page 3's second system ends at a final barline with EMPTY staves running on to the right margin.
- **Grechaninov (38 extra, 12 extra bars):** Ilya's bars 1 to 4 = truth 1 to 4; bars 5 to 8 are piano (chords such as G♯3+E3+C♯4) INSERTED after them; bars 9 to 13 = truth 5 to 9; bars 14 to 18 piano INSERTED; bars 19 to 65 = truth 10 to 56; 66 and 67 = truth 57 and 58 (whole rests); bars 68 to 70 are the piano postlude read as the voice.
- **The pattern:** a system's piano staff, or staves, is emitted as ADDITIONAL measures of the voice part, after (Grechaninov) or instead of (Varlamov) that system's voice measures. Look first at the port's regrouping and part assignment: `third_party/homr-web/src/pipeline/staff-image.ts` around `regroupingCutsASystem`, and `parse-staffs.ts` around "voices from the largest system" (both changed in `0.2.0-ilya.3` and `ilya.4`), and at how `apps/web/src/lib/omr/join-pages.ts` takes part 1. The postlude bars are the fault day 4 left open: a system with only the piano at the end is read as the voice (`docs/sessions/report-day-4_r1_2026-10-06.md`, "Not established").

## Strict limits on what you may look at

- You may open and view: `~/Downloads/_desk-2026-10-07/heldout-scans/grechaninov_op20-4_uznik.pdf` and `varlamov_no-op_skazhi-zachem.pdf` (Varlamov is 10.6 MB), and their truth and notes in `~/Downloads/_desk-2026-10-07/heldout-truth/` (those two slugs only).
- **Never open, view, list, or print anything about the other six songs** in those folders, and do not open `~/Downloads/_desk-2026-10-07/heldout-out.tgz` again (it holds the six songs' readings). When you rerun the six at the end, a script reads them and prints one total line only.

## The job

1. Read both songs on the singer's path as they stand, and confirm the diagnosis bar by bar, looking at the page images. Account also for each song's other misreads (Varlamov: 2 lengths; Grechaninov: 1 pitch).
2. **State the cause with `path:line`** before changing anything.
3. Fix it with a rule a musician would accept, for example: the voice is the staff that carries the words; a staff of chords and octaves with no words is piano; a system's voice staff keeps its place from system to system; empty staves after a final barline are not music. A fix tuned to these two songs alone is not acceptable. If no general fix exists, say so and change nothing.
4. If you change the port, bump it to `0.2.0-ilya.5` everywhere `ilya.4` is named (day 4's list, including `stamp.ts`, so readings stamped ilya.4 are read again), pack it, and install it as day 4 did. Tests for each rule.

## Prove it

- Before and after, notes right of printed, missing, extra, pitch and length misreads, for the two songs and for the build songs you measured on 2026-10-05 (`docs/sessions/report-code-baseline-on-the-singers-path_r1_2026-10-05.md`: the Tchaikovsky and the *Sunless* songs). No build song may get worse.
- Then the six unseen songs, once, after the fix is final: one total line only, computed by a script that prints no per-song or per-bar detail. Before (cloud, WebAssembly): 721 of 743 right, 1 extra, 7 pitch, 15 length.
- All eight gates. Gate 4 baseline: the number row 48 ships with. Name any number that moves.

## Report

`docs/sessions/report-code-piano-is-not-the-voice_r1_2026-10-08.md`: the cause with `path:line`, every change with `path:line`, tests, gates, the before and after lines, the six-song total, md5 of any packed `.tgz`, and a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer.

No git writes of any kind. Dann ships.
