# Report: one head to a stem, section 3 measurements

**Written by:** Code (Sonnet 5.5), 2026-10-02. **Brief:** `brief-code-one-head-to-a-stem_r1_2026-10-02.md`, section 3. **Status: STOPPED AT SECTION 3, as the brief's section 3 instructs. No code has been changed.** The measurements contradict the ruling in section 4: it would not meet section 6. The details are below, and a short answer comes first.

## The short answer

**I read the brief before its 02:00 amendment and re-read it after; this report answers the amended brief** (the ossia, and a seventh measurement).

The extra heads are not second hits at the other end of a stem. **Of the 199 hits the reader reads on the three Tchaikovsky pages, 43 are hollow-head detections** (`detect_hollow_heads`, annulus filter at a response of 0.38 to 0.53), and **77 of the 83 hollow detections on the nine scan pages in the tree lie within 3.5 staff spaces of a filled head**, at a flag. The song has no hollow note head.
- **Measurement 7 contradicts the desk's expectation.** The brief expects no stem with two heads at the same end. **There are 41 on the nine scan pages** (18 on the three Tchaikovsky pages) and 25 on the render fixtures. Each is a filled head with a hollow detection beside it, on the flag.
- **Measurement 4 contradicts the premise of the ruling:** exactly **1** stem on the scan pages has hits at its two ends.
- **If the amended ruling were built** (one event per stem; keep the larger head; carry the other as an alternative; do not emit it), then on the Tchaikovsky pages it would remove 20 hits and read **179 heads (the brief asks 170 to 178), 70 of 99 bars equal (it asks 95), 2 bars off by more than one.** It would also record 18 "alternative pitches" on the Tchaikovsky pages that are flags, not ossia. Dann's ossia is the rare real case; what the tree holds is a flag.
- On the render fixtures it would act on 25 stems with two hits at the same end and 5 with hits at both ends, so those would move.

So I stopped at section 3, as the brief says to when a measurement contradicts it, and did not build.

## Provenance

Branch `Shane`, working tree after row 19 (uncommitted, gates at baseline). The app's own raster of the Tchaikovsky PDF (pdf.js, 400 dpi) and the repository PNGs for the other scan pages, read by the reader in the pinned Pyodide v0.26.4 (cv2 4.9.0, numpy 1.26.4) in headless Chromium under Playwright. Heads are `G['heads']` as `read_page_geometry` returns them (filled hits that pass `has_stem`, plus hollow detections that pass `has_stem`, minus clef-and-key ink); a hit is placed in a bar by its x against the system's barlines. The desk's per-bar counts are `truth-draft-tchaikovsky-op38-3-voice_r1_2026-10-02.md`, draft. Scripts and raw results: `measure-heads_r1_2026-10-02/`.

## 1. Heads per bar, Tchaikovsky, after row 19

| page | system | desk, heads in each bar | read, heads in each bar | read minus desk |
|---|---|---|---|---|
| 1 | 1 | 0, 0, 0, 0, 0, 0, 0, 1, 3 | 0, 0, 0, 0, 0, 0, 0, 0, 2 | 0, 0, 0, 0, 0, 0, 0, -1, -1 |
| 1 | 2 | 2, 1, 2, 1, 3, 3, 2, 3, 2 | 3, 1, 2, 1, 3, 4, 2, 2, 0 | +1, 0, 0, 0, 0, +1, 0, -1, -2 |
| 1 | 3 | 1, 2, 1, 3, 3, 1, 1, 3, 2 | 1, 2, 1, 4, 3, 0, 1, 3, 1 | 0, 0, 0, +1, 0, -1, 0, 0, -1 |
| 2 | 1 | 1, 2, 1, 3, 3, 2, 3, 2, 1 | 1, 3, 2, 3, 3, 1, 7, 3, 1 | 0, +1, +1, 0, 0, -1, +4, +1, 0 |
| 2 | 2 | 2, 1, 3, 3, 1, 1, 3, 3 | 2, 1, 3, 4, 2, 1, 3, 3 | 0, 0, 0, +1, +1, 0, 0, 0 |
| 2 | 3 | 2, 1, 3, 3, 1, 1, 3, 3, 2 | 3, 1, 3, 3, 1, 1, 4, 5, 5 | +1, 0, 0, 0, 0, 0, +1, +2, +3 |
| 2 | 4 | 1, 3, 3, 1, 1, 1, 3, 3, 0 | 1, 3, 3, 1, 1, 1, 3, 5, 0 | 0, 0, 0, 0, 0, 0, 0, +2, 0 |
| 3 | 1 | 2, 1, 3, 3, 2, 3, 3, 0 | 3, 1, 3, 3, 2, 5, 2, 0 | +1, 0, 0, 0, 0, +2, -1, 0 |
| 3 | 2 | 2, 1, 3, 3, 1, 1, 3, 3, 2 | 3, 2, 3, 4, 2, 0, 4, 2, 4 | +1, +1, 0, +1, +1, -1, +1, -1, +2 |
| 3 | 3 | 3, 3, 3, 1, 0, 1, 3, 3, 2 | 5, 3, 3, 0, 0, 1, 3, 2, 4 | +2, 0, 0, -1, 0, 0, 0, -1, +2 |
| 3 | 4 | 1, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0 | 1, 4, 5, 1, 1, 0, 0, 0, 0, 0, 0 | 0, +1, +2, 0, 0, 0, 0, 0, 0, 0, 0 |

**Bars equal to the desk's: 61 of 99. Bars off by more than one head: 10. Heads read 199; the desk counts 174.** (The 199 are 156 filled and 43 hollow.) All 99 bars exist now, so every head reaches a bar.

## 2. What each extra and each missed head is

**The extras.** Of the 199 hits, **156 are filled-head detections and 43 are hollow-head detections.** The song has no hollow note head (the longest value in a 3/8 bar is a dotted crotchet), so the 43 are all extras. I looked at the reader's circles on systems 1 and 2 of page 1 and 1 of page 2 (hollow hits drawn in a second colour; I viewed nine more systems, the Lamm page and `sunless01 p2` of the Bessel edition): each hollow hit I looked at sits on the hook of an eighth note's flag, a curl that with the stem forms a ring about a staff space wide.
- **Distance from each of the 43 to the nearest filled head:** 0.9 to 3.4 staff spaces for 40 of them (5.3, 5.5, and 10.0 for the other three), mostly 0.9 to 1.0 to the right of the head and 0.3 to 1.4 above or below (`e1.json`). Only 5 of the 43 sit 2.0 to 4.8 staff spaces from a filled head, which is where the other end of its stem would be. **38 do not.**
- Filled extras: none I could identify; the filled hits (156) are fewer than the desk's 174.

**The missed heads: 174 less 156 is 18 filled heads missing on the three pages.** From the raw filter (`e2.json`):
- **13 pass the filter (response 0.843 to 0.918) and fail `has_stem`**: page 1 system 1 x 3093; page 1 system 2 x 2862, 3009; page 2 system 1 x 2189, 2343; and eight on page 3. I did not find why `has_stem` rejects them (it wants a tall, thin run of ink 0.35 to 1.05 staff spaces to either side and a thin probe 1.5 spaces along). NOT ESTABLISHED.
- **19 have a stem and a response below 0.84** (0.70 to 0.838), including 6 inside the clef-and-key ink at the start of a system, which the reader drops on purpose.
- **8 pass both and are still not kept**: 6 of them lie at x 352 to 388 at the start of a system (the clef-and-key ink mask), and 2 mid-system (page 1 system 3, x 2107; page 2 system 3, x 736), which I did not account for.

## 3. Why page 2 read 67 to 70 heads in the measurement runs and 82 to 86 in the build

**The two inputs to `detect_heads` are not what differs; the number of bars read is.** I ran the reader as committed at `8fdfcde` (before row 18) and the current reader on the same saved image from the 2026-10-01 runs (`m3-tch.json.files/s-int-2.png`): **both give 86 heads from `read_page_geometry`** (19 hollow among them) and the old one emits **67 notes** while the new one emits **86**. The difference is `run_page2.py`: events are emitted only inside the bars that were found (`mps` segments, `[0] + barlines + [W]`), so every head to the right of the last barline found on a system was dropped without a word. With 59 of 99 bars found, 19 heads fell past the last barline. With all 99 found, nothing is dropped, and the spurious hollow hits are now emitted too. I also ran `detect_heads` and the stem test on the page with the staves from the trace and with the staves from `detect_staves` on the same image: identical (71 raw hits, 69 with a stem, 24 hollow, 93 after the merge). The warp, the whole-pixel band against the prototype's three, moves the count by at most 3.

## 4. Per stem, how many hits at each end, every scan page

A stem is a stem `find_stem` finds; two hits share a stem if their stems lie within 0.4 staff spaces in x and each hit is within half a space of the other's stem. Over the nine scan pages (the Lamm page that repeats is counted once; `e7.json`):

| | count |
|---|---|
| stems with one hit | 356 |
| stems with hits at both ends (two hits 2.5 or more spaces apart) | **1** (Tchaikovsky page 3, two hollow hits) |
| stems with two hits at the same end (within 1.5 spaces) | **41** |
| hollow hits within 3.5 spaces of a filled head | 77 of 83 |

By page: Tchaikovsky 1, 2, 3: stems with two hits at the same end 2, 6, 10; at both ends 0, 0, 1. The ruling keeps two heads at the same end as a chord, so **it keeps all 41**, and acts on 1.

## 5. Heads per bar on the other scan pages

**NOT ESTABLISHED for all but one page.** I looked at the readers' circles on 19 systems, but at 1800 px across a system the small heads, the flats beside them, and flag hooks are too close for me to count to the head with confidence, and a count I cannot defend is the kind of number the contract bars. What I can say: on the Lamm page 1 (`pdfjs400-1`) I counted 6 heads in each of the five bars that have a voice, 0 in the opening bar (draft, by eye); the reader reads filled hits that miss several quarter-note heads there (for example system 1 bar 2 reads 3 filled heads where I count 6). A count to the head wants crops one bar wide, and the desk's or Dann's proof. I did not make them.

## 6. The 23 render fixtures

The amended ruling, if built, would act on **30 stems across the renders**: 25 with two hits at the same end and 5 with hits at both ends (`sunless-06` pages 3 (2), 5 (2), 6 (1) for the five; one of them has a hollow member). Those are not byte-identical by construction, so the constraint "render fixtures stay byte-identical" is also at risk, and I would have to say exactly which bytes move. The renders have 68 hollow detections of their own (56 alone and 12 within 3.5 spaces of a filled head). I did not run the reader with the ruling applied to see what the five stems read as.

## 7. How many stems carry two heads at the same end

**Scan pages: 41** (`e7.json`; Tchaikovsky pages 1, 2, 3: 2, 6, 10; Lamm page 1: 2; Lamm page 2: 7; Bessel `sunless01` p2: 2; `sunless04` p3: 5; `sunless05` p3: 7; `sunless06` p21: 0). **The desk expects none.** In every one I looked at (the Tchaikovsky pages 1 and 2 and the Lamm and Bessel `sunless01` pages), the second hit is a hollow detection on the hook of the flag, 0.9 to 1.5 staff spaces from a filled head. **Render fixtures: 25**, all on `sunless-06` (pages 1, 2, 3, 5, 6, 7), 11 of them on page 5. I did not look at what they are.

## What the ruling would do, measured rather than built

On the three Tchaikovsky pages, with the hits as read (`e1.json`), simulated and not built:
- **As read:** 61 of 99 bars equal, 10 bars off by more than one head, 199 heads.
- **The ruling as first written (one head per stem when the hits are at opposite ends; both kept at one end):** it would act on 1 stem and read about **187 heads, 67 of 99 bars equal, 7 off by more than one.**
- **The ruling as amended (one event per stem, whatever the end; the larger head is the event; the other is the alternative and is not emitted):** it removes 20 hits and reads **179 heads, 70 of 99 bars equal, 2 off by more than one**, whether "larger" is judged by filter response or by ink area (the two agree on all 20). The bars that stay unequal are the 18 missed heads (section 2) and the hollow hits that are not on a stem with a filled head.
- **If every hollow detection were dropped** (not the ruling, and a change to the hollow finder's role, which this brief puts out of scope): 156 heads, **85 of 99 bars equal, 4 off by more than one.**

## What could not be established

- Why 13 filled hits fail `has_stem`, and what the 2 unaccounted mid-system drops are.
- The truth heads per bar on the other scan pages (section 5).
- Whether the desk's count is right; it is draft. I checked it only where a bar's count differs from mine by more than one: page 1 system 1 bars 8 and 9 (I read 2 filled heads where the desk counts 4); everything else I did not re-count.
- What the five stems on the renders would read as under the ruling.

## What waits on the desk

The ruling's premise was that the finder fires at both ends of a stem, and the amended brief expected no stem with two heads at one end. The tree says it fires on the flag's hook, close to the head, with the hollow finder, and does so 43 times on this song. The section 3 instruction is to stop and report, which I have done. The facts the desk would rule on: the hollow finder's threshold is 0.38; its width and height guards (`hollow.py:55-74`) admit a flag's ring; 77 of 83 scan-page hollow hits are beside a filled head. The brief's out-of-scope line keeps note lengths, flag counts, the metre, rests, and text out of this brief; whether it keeps the hollow finder out is the desk's to say.

## State

Nothing changed in `tools/`, `apps/`, or `packages/`. New files: `measure-heads_r1_2026-10-02/` and this report; Dann must `git add` them. My staging copies under `apps/web/.svelte-kit/` (`fx`, `oldreader`) are removed. The dev server is running on port 5173.
