# Memo: Ilya's reader as shipped, its misses by cause, and the most each fix could gain

**To:** the desk (Fable). **From:** Sonnet helper, 2026-10-04. **Brief:** `brief-sonnet-misses-by-cause-and-ceilings_r1_2026-10-04.md` (part 22). Nothing in Ilya's tree was changed. Every number below comes from a run I made today, on the five build songs; the scripts and reads are in `measure-misses-by-cause_r1_2026-10-04/`.

## Summary

1. **Control passed.** The reader scores 64.6, 69.8, 46.1, 41.0, and 73.0, identical to `STATE.md:58`; over all 805 printed notes, 56.5.
2. **The 805 notes:** 455 right, 69 not found, 120 pitch only misread, 120 length only misread, 41 both; 27 extra notes read that are not printed.
3. **Largest cause:** length abstained, 87 notes (31 of them `stroke_count_ambiguous`).
4. **Second:** printed sign, 74 to 97 notes (62 to 85 misread, 12 abstained; the range is the spelling, section 2). **Third:** staff position, 63 to 86 notes. Next: not found 69, flag or beam count 48.
5. **Largest ceilings, one fix at a time:** lengths 71.4, not-found notes put in 65.1, accidentals 63.2 (65.8 lenient). Accidentals and lengths together 80.0. Extras out gains 0.0 by construction. All together 100.0 (the method control passes).
6. **Surprise:** the app's converter draws a quarter after a length abstention, so 92 notes read with the right length are drawn wrong; the score as drawn is **49.9, not 56.5**.
7. **Surprise:** in *Sunless* 6, 17 of the 24 not-found notes are half notes. In *Sunless* 5, 32 of the 43 are in printed bars 4 to 10, where the reader reports a failed page.
8. **Surprise:** the reader found 14 of 170 printed rests.
9. **Surprise:** homr main (`560ca5c`) scores 97.9, 100.0, 96.1, 96.9, and 98.3 on the same songs, **above the 81 to 97 the brief quotes** (section 4).

## 1. Step 0, the control

| Song | Expected (`STATE.md:58`) | Got | Difference |
| --- | --- | --- | --- |
| Sunless 1 | 64.6 | 64.6 | 0.0 |
| Sunless 4 | 69.8 | 69.8 | 0.0 |
| Sunless 5 | 46.1 | 46.1 | 0.0 |
| Sunless 6 | 41.0 | 41.0 | 0.0 |
| Tchaikovsky | 73.0 | 73.0 | 0.0 |

The octave shift the scorer chose was +12 for *Sunless* 1, 5, and 6, and 0 for *Sunless* 4 and the Tchaikovsky, as before. The reader's own counts also match the earlier baseline (101, 117, 230, 146 notes; 18, 29, 60, 53 bars; *Sunless* 5 page 2 of 7 reported as failed, as in the baseline). Nothing is NOT REPRODUCED.

## 2. Step A, misses by cause

How to read these tables. A printed note goes into exactly one of classes 1 to 5 (section A1). Classes 3 and 4 hold notes with one kind of fault; class 5 holds notes with both, so the cause tables are given twice, once for the single-fault classes (as the brief asks) and once over every note that carries that fault. A note whose pitch or length abstained counts as not right, as the scorer does.

**A limit on the pitch causes.** The truth files hold MIDI numbers, not spellings, and the reader's output holds MIDI numbers, not letters. So "printed sign" against "staff position" cannot be read off directly. I spelled both pitches with sharps for the black keys (every key here has sharps or none) and called a miss a sign miss when the letter and octave then agree. I also ran flat spelling, and a lenient rule (a sign miss if either spelling agrees). The split moves a good deal between them (table A2c). So the **sign and staff-position counts are two ranges that overlap, and I cannot narrow them**. The 12 abstained notes are not affected, because the reader reports their letter and octave (`midiAssumedNatural`).

### A1. Every printed note in one class

{{ilya:A1}}

### A2. Pitch faults by cause

{{ilya:A2}}

The octave cause is near zero because the scorer's one octave shift per song already removes the whole-song octave offset. The one octave miss (in *Sunless* 5) also has a length fault, so it is in class 5.

### A2c. How much the split depends on spelling (non-abstained pitch misreads, a/b/c = sign / staff position / octave)

{{ilya:A2c}}

### A3. The 12 pitch abstentions
All 12 carry one reason code, `accidental_unresolved`. Compared with the truth: 7 have the right letter and octave and a missing sign (3 in *Sunless* 1, 4 in *Sunless* 5); 4 (2 in *Sunless* 4, 2 in *Sunless* 6) have an assumed natural that **equals the printed pitch**, so they are right if drawn as engraved but count as not right in the headline; 1 (*Sunless* 5) has a wrong letter. The Tchaikovsky has none.

### A4. Length faults by cause

{{ilya:A4}}

### A5. Length abstentions by reason code (all matched notes with a length abstention)

{{ilya:A5}}

### A6. Notes the converter draws as a quarter because of an earlier abstention
The converter's rule is at `apps/web/src/lib/score/ingestion/recognized-to-musicxml.ts:175-183`: a note whose length abstained, or whose onset is lost (`abstain.onset`, which follows a length abstention earlier in its bar), is drawn as a quarter. The scorer reads the reader's own length, not the drawn one, so the headline does not see this.

{{ilya:A6}}

Plain reading. Of the 58 class 4 notes whose own length was read but misread, 7 also have a lost onset, so the converter draws a quarter for them whatever they were. **Separately, 130 notes whose own read length is right have a lost onset, and 92 of those are not printed as quarters, so the converter draws them wrong.** Rescoring with every length abstention and every lost onset set to a quarter (scorer unchanged) gives the row "Today, as the converter draws it" in section 3: 49.9 over all five songs against 56.5.

### A7. Rests and bars

{{ilya:A7}}

The reader found 14 of 170 printed rests (all 14 right in length) and read no extra rests. The reader reads the right number of bars in 3 of the 5 songs; *Sunless* 5 is one bar short (60 of 61) and *Sunless* 6 is two short (53 of 55). Bar counts by page are NOT ESTABLISHED: the reader's `printedAt.page` is empty on most bars, and the truth files carry no page. Only 33 of 262 printed bars are "all right" under the scorer's rule, 29 of them in the Tchaikovsky.

### A8. What the not-found notes and the extras have in common
From counts only. **I did not look at crops**: the reader's ids carry an x position and no system, so I could not place a note on a page without more work than the brief allows. Crops: NOT DONE.

{{ilya:A8}}

- Not found, *Sunless* 6: 17 of 24 are printed half notes, and 18 of 24 are the first note of their bar.
- Not found, *Sunless* 5: 32 of 43 fall in printed bars 4 to 10 (35 printed notes there, 3 found). The reader reports page 2 of 7 as failed (`failedPages [2]`). That these seven bars are the failed page is NOT ESTABLISHED (no page-to-bar map). The other 11 not-found notes are spread over 10 other bars.
- Not found, the other three songs: *Sunless* 1 none; *Sunless* 4 one (a quarter, first in its bar); the Tchaikovsky one (an eighth).
- Extras: 18 of 27 have an abstained length (1 of 5, 12 of 15, 5 of 7); the rest are read quarters (6), eighths (2), and a sixteenth (1). I did not find out what in the page they are.

### A9. Accidental misses against the bars (the bar-boundary question)

{{ilya:A9}}

Over all five songs, 25 of the 74 sign misses (the 12 abstained included) sit in a bar where the printed bar and the read bar do not line up (the note count differs, or the bar's notes are split over reader bars); 49 sit in a bar that lines up. This is a co-occurrence count. **How many follow from a barline the reader missed or added is NOT ESTABLISHED**: a sign carries through its bar, and I did not trace which earlier sign each miss depended on.

## 3. Step B, the most each fix could gain

Method. For each song I took the reader's output and the scorer's alignment, replaced one kind of decision by the truth's, and rescored with the scorer unchanged. The table gives the headline (notes of every 100 printed that are right in pitch and length).

**These are upper bounds, for a perfect fix applied to the reader's output.** A fix inside the reader could gain less or more than its row, because decisions depend on each other (a missed barline changes which signs carry; a note found changes the neighbours' lengths in its bar).

- **B1.** Each matched note's accidental is the truth's; letter and octave are left as read (for an abstained note, its `midiAssumedNatural`). It needs a spelling, so two rows: sharp spelling, and the lenient rule (right if either spelling gives the same letter and octave).
- **B2.** Each matched note's letter and octave are the truth's; the accidental is kept as read, as an offset from the key signature (an explicit sign stays explicit and is applied to the new letter; a note read without a sign takes the key signature's value for the new letter). A note whose pitch abstained stays abstained, so stays not right.
- **B3.** Each matched note's length is the truth's, abstentions included. **B4.** Each not-found note is put in with the truth's pitch and length, at its place in the truth's order. **B5.** Each unmatched read note is taken out. **B6** = B1 and B3 (sharp spelling). **B7** = B4 and B5. **B8** = every matched note's pitch and length is the truth's, every not-found note is put in, every extra is taken out.
- **B1+B2** is added: every matched note's pitch is the truth's, lengths as read.

{{ilya:B}}

Reading the table.

- **B8 is 100.0 on every song: the control on the method passes.** Reaching it through the B1 and B2 spelling rules alone gives 95.7 to 100.0 (98.3 overall; the row marked diagnostic), which is the cost of the spelling convention in those two rows.
- **B5 is 0.0 on every song by construction.** The headline counts printed notes present and right; an extra note never lowers it. Extras still spoil bars and would shift syllable pairing, and the headline does not measure either.
- **B3 and B1+B2 are both 71.4 over all five songs by coincidence:** class 3 and class 4 each hold 120 notes.
- **The largest single gain is lengths on *Sunless* 1 (+10.4), *Sunless* 6 (+19.9), and the Tchaikovsky (+20.7); not-found notes on *Sunless* 5 (+16.7); *Sunless* 4 ties accidentals and lengths (+9.5).**
- The row "Today, as the converter draws it" is not a fix. It is the same reader scored after the app's own converter has set a quarter for every length abstention and lost onset: 49.9 over all five songs, down from 56.5, and down in every song.

## 4. Step C, homr main on the same songs

homr main (`560ca5c`), Poppler 400 dpi rasters of the 17 *Sunless* build pages, `conv.py` and the scorer unchanged; the Tchaikovsky from the existing reads (`scratchpad/asm/main/tch-1.musicxml` to `tch-3.musicxml`). It ran about 9 minutes on the 17 pages.

{{homr:C}}

- homr's headline: 97.9, 100.0, 96.1, 96.9, 98.3, and 97.5 over all 805 notes. **These are higher than the figures on file for homr (81.3, 97.4, 86.8, 94.4 for *Sunless* 1, 4, 5, 6 and 93.1 for the Tchaikovsky).** I did not find out why; the build or the raster of the earlier run may differ, and the earlier build is NOT ESTABLISHED to me. I made no run of the earlier build.
- homr has no not-found notes, and its converted output carries no abstentions. It finds 169 of 170 rests (168 right in length). Its 20 misreads are 6 sign, 10 staff position, 4 length.
- homr's only extras are in *Sunless* 5: 28 notes, 7 extra rests, and 8 extra bars (69 read against 61 printed). I did not look at why.
- homr's own rows B1 to B8 are in `tables_homr.md` (section B). Its single-fix ceilings are 98.0 to 98.4 over all five songs, and 99.5 with every pitch right; not-found notes and extras move nothing, because it has no not-found notes.

## 5. How it was run, what is NOT ESTABLISHED, how to repeat

**How it was run.**

- **Reader:** the dev server (`pnpm dev` in `apps/web`, port 5173), headless Chromium driven by Playwright, the app's own `rasterizePdf` (pdf.js, 400 dpi) and `WorkerPageReader` (pinned Pyodide v0.26.4 from `cdn.jsdelivr.net`, through the agent proxy), one call per song, clef G on line 2, no octave change, key 2, 2, 0, 7 for *Sunless* 1, 4, 5, 6 and 2 for the Tchaikovsky, on the desk's two PDFs (pages 1 to 2, 3 to 4, 5 to 11, 12 to 17 of the build PDF; pages 1 to 3 of the Tchaikovsky). I dropped the baseline script's second, per-page read, which only timed pages.
- **Two differences from the Mac run. The control reproduces to the decimal, so neither moved a score.** The Chromium here is 141 (`/opt/pw-browsers/chromium-1194`), and pdf.js needs `Map.prototype.getOrInsertComputed`, which that build lacks, so `read-songs.mjs` adds a small polyfill (`getOrInsert`, `getOrInsertComputed` on `Map` and `WeakMap`) before the page loads. Chromium also had to be started with `--proxy-server` and `--proxy-bypass-list=localhost;127.0.0.1` on the command line, because Playwright's `proxy` option sent localhost through the proxy.
- **Scoring:** `score.ts` and `scan-scorer.ts` from the desk, unchanged (md5 of my copy of the scorer equals the one in the tree, `f7a7f9c24edfdeb88b57aee5c2398e5f`; `score.ts` equals the desk's, `b4d53a3f68711f6a6b4e4e69848dfbe7`), under Node 22.22. The reader's events are `ro.verses[0].notes` and its bars `ro.measures`.
- **Step A and B:** `analyze.ts` (built on `scoreScan`'s `matches`). Spelling for the sign and staff-position split is by midi, as set out in section 2.
- **The tree:** nothing in `/home/claude/ilya` was written. I made no `_desk_` script (my Playwright script sits in the work folder and finds `@playwright/test` through `createRequire` on `apps/web/package.json`). I started the dev server and stopped it. The `git status` check is at the foot of my message to you.
- **Held-out songs:** I opened no file named in the brief's list, and did not use the full Lamm PDF.

**NOT ESTABLISHED.**

- The split of pitch misreads into printed sign and staff position, to better than the ranges in A2c (the truth files carry no spelling).
- How many accidental misses follow from a barline the reader missed or added (only the co-occurrence count in A9).
- Bar counts by page, and whether *Sunless* 5's bars 4 to 10 are the failed page.
- What the not-found and extra notes look like on the page (crops NOT DONE).
- Why homr main reads better here than the figures on file.
- Whether a fix inside the reader gains the amount of its row (the rows are upper bounds from output edits).

**How to repeat.** All paths are the desk's scratchpad (`.../scratchpad/part22/`); the scripts keep the input paths as constants at the top.

```
cd /home/claude/ilya/apps/web && (pnpm dev > /dev/null 2>&1 &)
cd /tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/part22/work && node read-songs.mjs reads
cd /tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/part22/work && python3 mkread.py reads
cd /tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/part22/work && node score.ts ../in/truth/mussorgsky_sunless-01_within-four-walls.truth.json reads/song1.read.json full
cd /tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/part22/work && node analyze.ts reads results.json && python3 tables.py results.json
```

The read takes about 8 minutes on this two-core machine. For homr: `run_homr.sh` (after `pdftoppm -r 400 -png ../in/sunless-build-pages.pdf sun` in `work/homr`), then `conv.py` on each song's pages (pages `sun-01` and `sun-02` for *Sunless* 1, `sun-03` and `sun-04` for 4, `sun-05` to `sun-11` for 5, `sun-12` to `sun-17` for 6, in that order), `score.ts`, and `analyze.ts homr_reads results_homr.json`. Stop the server by number, from `pgrep -f "[v]ite/bin/vite.js"`, not with `pkill`.

**Files** (in `measure-misses-by-cause_r1_2026-10-04/`): `read-songs.mjs`, `mkread.py`, `analyze.ts`, `tables.py`, `score.ts`, `conv.py`, `scan-scorer.ts` (unchanged copy), `run_homr.sh`, `memo_template.md` and `build_memo.py` (they build this memo from the tables), `reads/` (reader output, scorer-format read, and full score for each of the five songs), `homr_reads/`, `results.json`, `results_homr.json`, `tables_ilya.md`, `tables_homr.md`. No images.
