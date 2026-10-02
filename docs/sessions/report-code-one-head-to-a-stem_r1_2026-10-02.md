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


---

# Build against brief r3 (2026-10-02)

**Written by:** Code (Sonnet 5.5). **Brief:** `brief-code-a-head-sits-at-the-end-of-its-stem_r3_2026-10-02.md`, the whole brief for `QUEUE.md` row 20. **Status: WRITTEN**, uncommitted. All eight gates are at baseline. **Item 1 of section 6 is not met** (85 of 99 bars equal, 156 heads; it asks 95 and 170 to 178); items 2 to 7 are met, so, as the brief says, the code is left WRITTEN and each unequal bar is reported with what stands in it. The two earlier sections of this file answer the brief's earlier versions and are superseded by this one.

## Provenance

The app's own raster of the Tchaikovsky PDF (pdf.js, 400 dpi) and the repository's PNGs, read in the pinned Pyodide v0.26.4 (cv2 4.9.0, numpy 1.26.4) in headless Chromium under Playwright, on the tree as row 19 left it. The desk's per-bar count is draft. Scripts and raw results: `measure-heads_r1_2026-10-02/` (`f1` to `f4` the measurements, `g1` to `g3` the build's checks, `h1` the unequal bars).

## Section 3, step 3.1: the 83 hollow detections on the scan pages, and the 68 on the renders

**What each is, by looking.** I looked at every one of the 83 scan-page detections (eight to a row, with the finder's centre marked) and every one of the 68 on the render fixtures.
- **Scan pages, 83: none is a genuine hollow head**, on the Tchaikovsky pages and also on the Lamm and Bessel pages. Most sit on the hook of a flag. A few are other ink beside a head: the neighbourhood of an augmentation dot, the corner where a beam meets a stem, a sharp, a letter of the lyric. I did not count those apart. **The desk expected a few genuine hollow heads on the Lamm and Bessel pages; none of the finder's detections there is one.** (Whether such pages hold a hollow head the finder does not detect is NOT ESTABLISHED.)
- **Render fixtures, 68: all genuine** (Verovio's half notes, single and in two- and three-note chords). **So the genuine group has 68 members, all from one engraver at one resolution.** It does not rest on a handful, and it does rest on one font.

**The measures** (`f1.json`; stem runs and core dimensions in staff spaces, taken on each page's own staff space; hooks = the 83, genuine = the 68):

| measure | hooks | genuine | separates? |
|---|---|---|---|
| stem run in the shorter direction, `min(up, down)` | 0.0 to 2.0 | 0.0 to 3.48 | no: the ranges overlap (a chord's stem runs on both ways) |
| stem run in the longer direction | 1.97 to 3.93 | 2.48 to 7.95 | no |
| core closed, **line-free image** | **5 closed, 78 open** | **67 closed, 1 open** | **yes, with 6 exceptions** |
| core closed, image with the staff lines | 52 closed, 31 open | 67 closed, 1 open | no: a staff line closes a hook |
| of the closed cores, **area** (square staff spaces) | **0.61 to 0.894** | **0.422 to 0.458** | **yes: gap 0.458 to 0.61** |
| of the closed cores, height | 1.0 to 1.7 | 0.76 to 0.81 | yes: gap 0.81 to 1.0 |
| of the closed cores, width | 0.77 to 0.93 | 0.95 to 1.0 | overlaps by 0.02 (no) |
| a straight wall (the narrowest left or right wall spread over the middle 70 percent of the core's rows, and the share of rows within a pixel of the median) | 0.0 to 1.24; 0.52 to 1.0 | 0.0 to 0.43; 0.17 to 1.0 | no: a tilted ellipse's wall is as straight as a stem's over so few rows |

**Which image the test should use: the line-free one.** On the image with the lines, 52 of 83 hooks have a closed core (a staff line through the hook closes it), where in the line-free image 78 are open. On the genuine heads both images give the same (67 closed). No genuine head on a scan sits on a line in this tree, so the opposite case, a line cutting a genuine core in two, is NOT ESTABLISHED on a scan; on the renders a head on a line has a closed core in both images.

**The measures that separate:** the closed core (line-free) alone separates all but 6; with the core's area among the closed ones, it separates all of the 83 hooks from 67 of the 68 genuine heads. The stem does not separate them, alone or with the others. The core's height separates the closed ones too and agrees with the area.

**Every detection on which the measures disagree:**
- **Closed hooks (5):** `tch-2` x 2397, y 563; `tch-2` x 2888, y 3680; `tch-3` x 842, y 523; `lamm-1` x 1241, y 3635; `RK-Bessel sunless04 p3` x 2577, y 1960. Core areas 0.61, 0.67, 0.71, 0.83, 0.894; core heights 1.0 to 1.7. The closed test passes them and the area test rejects them.
- **The genuine head with an open core (1):** `R_sunless-06` page 3 near x 967, y 2164 (response 0.38): a hollow head in a chord whose stem runs 5.9 staff spaces, the core joined to the white around it. The closed test would reject it. It is on a render, where the rule does not act.

**The bound.** `HOOK_CORE_AREA_MAX = 0.534` square staff spaces, the midpoint of the gap between the largest closed genuine core (0.458; `R_sunless-06` page 1, x 514, y 2324) and the smallest closed hook (0.61; `RK-Bessel sunless04 p3`, x 2577, y 1960). **A caveat the desk should hold:** the genuine side of that gap is Verovio's half note. No scan page holds a genuine hollow head that the finder detected, so a printed half note whose core is larger than 0.534 would be set aside as a hook. I could not test that.

## Step 3.2: the 18 printed filled heads that are not read

Found by the desk's per-bar count (`h1.json`; each is the raw finder's candidate at a response of 0.70 or more in a bar short of its printed heads). **The causes, in the order the tests run:**

| cause | heads | which |
|---|---|---|
| **response under 0.84** | 4 | `tch-1` x 2883 (0.838, by 0.002); `tch-1` x 3176 (0.832); `tch-1` x 3167 (0.821, and a stem run of 1.04); `tch-3` x 2821 (0.829). All four have a stem. |
| **`has_stem`, the run under 2.0 staff spaces** | 5 | `tch-1` x 3093 (1.61), x 2862 (0.61), x 3009 (0.75); `tch-3` x 2204 (1.75), x 2677 (1.14). A reach to either side exists for each; the stem is short or broken. |
| **`has_stem`, the thin probe at 1.5 staff spaces** | 8 | runs of 3.46 to 3.75 staff spaces (so the stem is there) and a probe 0.64 to 1.61 wide (the limit is 0.42): `tch-2` x 2189 (0.83), x 2343 (0.76); `tch-3` x 2909 (1.61), x 1684 (1.29), x 2883 (0.79), x 2797 (0.93), x 1023 (0.82), x 1153 (0.64). |
| **the clef-and-key mask** | 0 of the 18 | six candidates at x 350 to 390 are inside the mask, correctly (clef and key ink), and are not printed heads. |
| **not accounted for** | 1 | `tch-1` x 2107, y 3517: response 0.856, a stem, outside the mask, and not kept. I did not find why. |

## What I built, and what I tried and took out

**Built, on a system with a braced pair only** (so the render fixtures, which have none, are byte-identical by construction; `braced_sys` in `read_page_geometry`):
1. **A hollow detection is a head only if its white core is closed in the line-free image and its area is at most 0.534 square staff spaces** (`white_core`, `HOOK_CORE_AREA_MAX`). Otherwise it is a hook: it is not emitted, and its position, response, and core are in `G['hooks']`. This departs from N.95, which left a hook standing as an event with its length withheld (`run_page2.py:305-339`): on a braced system the hook is no longer an event, because it shifts every later syllable by one note.
2. **Two heads of one kind on one stem at its head end are one event** (`merge_ossia`; `G['alternatives']`). The larger head is the note and the other is its alternative, never emitted; two heads of the same size keep both pitches, emit the upper, and are marked `sameSize`. Size is the width of the ink run through the head's centre in the line-free image; two within a pixel are the same. **No size number is sourced and none is a head dimension.**

**Tried and taken out: probing the stem at five places instead of one.** It admits exactly the 8 probe-failing heads on the three Tchaikovsky pages, and nothing else on them (all 8 fall in bars short of heads). On the four other scan pages it admits 15 more, and I looked at them: **about 6 are not heads** (a dynamic's ink, the sharps of a 7-sharp key signature on `sunless06 p21`, a clef fragment). On the renders it admits 161. The brief says to fix a cause only where the change separates cleanly from what it would admit, counted on every scan page and every render page. It did not, so the code is back to the single probe, and `has_stem` is as it was. **Lowering the response bound is not clean either:** at 0.82 it admits two hits at x 3288 and 3290 on the thick closing barline of `tch-3`. The run bound at 1.5 admits 2 on the Tchaikovsky pages (both in short bars) and 8 elsewhere, which I did not look at; I did not adopt it.

## Section 6, line by line

**1. Tchaikovsky: NOT MET.** **85 of 99 bars equal** (the brief asks 95), **4 bars wrong by more than one** (it asks none), **156 heads** (it asks 170 to 178), **no hollow head emitted** (met). Before: 61 bars, 199 heads, 10 bars off by more than one. The 14 unequal bars, with what stands in each:

| page | system | bar | desk | read | what stands there |
|---|---|---|---|---|---|
| 1 | 1 | 8 | 1 | 0 | x2883 y1179: response 0.838 under 0.84 |
| 1 | 1 | 9 | 3 | 2 | x3093 y1140: stem run 1.61 under 2.0 |
| 1 | 2 | 8 | 3 | 2 | x2862 y2335: stem run 0.61 under 2.0 |
| 1 | 2 | 9 | 2 | 0 | x3009 y2277: stem run 0.75 under 2.0<br>x3167 y2350: response 0.821 under 0.84; stem run 1.04 under 2.0 |
| 1 | 3 | 6 | 1 | 0 | x2107 y3517: passes every test, not kept (unaccounted) |
| 1 | 3 | 9 | 2 | 1 | x3176 y3466: response 0.832 under 0.84 |
| 2 | 1 | 6 | 2 | 0 | x2189 y622: stem run 3.59, probe 0.83 wide at 1.5<br>x2343 y623: stem run 3.72, probe 0.76 wide at 1.5 |
| 3 | 1 | 7 | 3 | 1 | x2909 y572: stem run 3.57, probe 1.61 wide at 1.5<br>x2821 y573: response 0.829 under 0.84 |
| 3 | 2 | 6 | 1 | 0 | x2204 y1555: stem run 1.75 under 2.0 |
| 3 | 2 | 8 | 3 | 2 | x2677 y1491: stem run 1.14 under 2.0 |
| 3 | 3 | 4 | 1 | 0 | x1684 y2604: stem run 3.61, probe 1.29 wide at 1.5 |
| 3 | 3 | 8 | 3 | 1 | x2883 y2580: stem run 3.71, probe 0.79 wide at 1.5<br>x2797 y2546: stem run 3.46, probe 0.93 wide at 1.5<br>x2752 y2534: response 0.730 under 0.84<br>x2753 y2564: response 0.704 under 0.84 |
| 3 | 4 | 2 | 3 | 2 | x1023 y3572: stem run 3.71, probe 0.82 wide at 1.5 |
| 3 | 4 | 3 | 3 | 2 | x1153 y3573: stem run 3.75, probe 0.64 wide at 1.5 |

The five bars that were equal before and are not now (`tch-1` system 3 bar 6, `tch-2` system 1 bar 6, `tch-3` system 3 bars 4 and 8, `tch-3` system 4 bars 2 and 3 in part) were equal because a hook stood in for a head the filled finder missed; the hook sat at the flag, not the head, so its pitch was wrong. Removing the hooks shows the missing head.

**2. The other scan pages: MET.** No hook is emitted on any of the nine (hollow heads kept: 0 on each), and the genuine hollow heads the finder detected on them number 0, so none can have been lost. Hooks set aside per page: Lamm page 1 12, page 2 16; RK-Bessel `sunless01 p2` 8, `sunless04 p3` 11, `sunless05 p3` 23, and `sunless06 p21` 3 (the Lamm `Kalmus` page, a repeat of Lamm page 1, is not counted twice). **The desk owes head counts for these pages, from crops one bar wide.** I could not count heads to the head at the size I looked at.

**3. Two heads of one kind are one event: MET at the function, NOT at the finder.** I made the fixture by adding a second filled head to one stem of a Tchaikovsky voice bar (`tch-2`, system 2, the head at x 1154, y 1611, a B in the fourth octave, stem down), drawn as an ellipse on the line-free image one and a fifth staff spaces along the stem, at three sizes against the printed head, and handed the page's real heads plus the added one to `merge_ossia` (`g3.py`). The bar reads **68 events before and 68 after** in all three cases, the alternative is kept in `G['alternatives']` with its letter and octave, and the measured widths were 32 against 23 (a smaller second head: the original is the note), 32 against 30 (the original is the note, two pixels narrower), and 32 against 32 (the same size: both kept, the upper emitted). **The finder itself did not see a second head I drew on the scan:** I drew one at four distances and two sizes (`g2b.py`), and the reader's head count stayed at 68 or fell to 65 with no alternative recorded, so a real ossia reaches this logic only if the filled finder fires on both heads. Why it does not is NOT ESTABLISHED (a head fused to another one is a taller blob than the 1.35 by 0.92 ellipse).

**4. Each hook's position is in the geometry dict: MET.** `G['hooks']`; counts per page in item 2. They count every detection the rule set aside, including some that `merge_heads` would have dropped as within 0.9 staff spaces of a filled head.

**5. Render fixtures: MET.** All 23 give the same `envelope.run` output (a sha256 over the whole canonical `ro`, ids included) as before.

**6. Read time.** The app's Worker, headless, unthrottled, two reads in one Worker: **29.1 s then 28.2 s** for the three Tchaikovsky pages (`tch-worker4.json`), beside row 19's 29.1 and 28.6 s. The three pages read 99 measures and 166 events (156 heads and 10 rests).

**7. Gates: MET.** 1 phonology 251, 2 dictionary 235, 3 web-check 0 errors and 12 warnings in 5 files, 4 web-test 1784, 5 score-parser 636 and 5 skipped, 6 blurb 145, 7 integration 55, 8 ratchets OK. `ilya-ship.sh` not run (untracked files).

## What could not be established

- Whether the area bound holds on a printed hollow head: the scan pages hold none the finder detected, so the upper side of the gap is five hooks and the lower side is Verovio's half note.
- Whether the Lamm and Bessel pages hold hollow heads the finder does not detect.
- The truth heads per bar on the other scan pages (the desk owes them).
- Why one filled head (`tch-1` x 2107, y 3517) passes every test and is not kept.
- Why the finder does not fire on a second head drawn on a stem.
- The 15 heads the five-place probe would admit on the other scan pages: I looked at them and judged about 6 not heads; the rest I took to be heads and cannot count.
- Whether the closed-core test misjudges a genuine head with a core that opens to the white around it (the one such case is on a render, where the rule does not act).

## State

Code is `WRITTEN`, uncommitted. Changes: `tools/e16-harness/reader/reader.py` only (`white_core`, `HOOK_CORE_AREA_MAX`, `merge_ossia`, `_row_span`, and the hook and ossia steps in `read_page_geometry`; `has_stem` and `hollow.py` untouched). New files to `git add`: this report, and the new files in `measure-heads_r1_2026-10-02/`. My staging under `apps/web/.svelte-kit/fx/` is removed. The dev server is running on port 5173.
