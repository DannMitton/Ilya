# Report: N.135 stage 2a, step 3 (monotone surplus, frameRow), r1

Code (Sonnet 5.5), cloud lane, 2026-10-27. Same branch (`cloud-lane-16`) and rules as steps 1 and 2: nothing under `docs/memory/`, no brief or review edited, no approval re-approved, nothing pushed to `Shane` or `main`, no pull request. Two items from the desk's harness measures of 2026-10-27, which are not in the tree; the numbers below that come from them are the desk's, not mine.

## 1. The answer first

- **Item A, done.** `monotone` no longer falls back to `nearest` when tokens outnumber notes. Every note takes one token (the in-order choice of least total distance) and each surplus token comes back as a `Seat` with `note: null`, `by: 'monotone'`, and `unseated: true`, with its index in `token`. On 1,500 seeded random rows, the 328 rows with more tokens than notes all seat exactly the notes' number of tokens, in order, at the brute-force least total distance; the other 1,172 seat as before (`xcheck-step1.txt`). The restored-fallback mutant and the dropped-surplus mutant are both killed.
- **Item B, done.** `underlay-frame.ts` holds `frameRow` and its transform back. On 200 seeded synthetic rows against an OpenCV oracle written from your text, 197 match: no row differs in size, and none in more than 0.5 percent of its pixels by more than 1 grey level. The 3 that differ chose a different deskew angle by 0.1 to 0.5 degrees, on variances equal to within 2.2e-5 (section 3). The five mutants you named are killed.
- **Tests:** `underlay-seat.test.ts` 55 (was 48, +7), `underlay-frame.test.ts` 29 (new); the web suite rises from 3,174 to 3,210, which is those 36.
- **One decision for the desk to look at:** the rotation centre is OpenCV's `(w/2, h/2)`, not the exact centre `((w-1)/2, (h-1)/2)`. It matters: the two differ on 3.7 percent of a row's pixels by more than 1 grey level (section 4).

## 2. The tree

- **Branch and commit:** `cloud-lane-16`, from step 2's `12864bf3`. The commit that carries this report is the head of the push.
- **Order of events, said plainly:** the desk's `seatTokens` amendment ("make it the first act of step 2") reached me after steps 1 and 2 were both committed and pushed. I applied it as a working-tree change, then your step 3 message restated it as Item A. It lands in this one commit, not in step 2; the addenda I appended to the step 1 and step 2 reports say so. I rewrote no history.
- **Not touched:** `docs/memory/`, the brief, its review, any approval file. `+page.svelte` 5,597 of 5,597, `pipeline.ts` 925 of 925, `musicxml-parser.ts` 1,167 of 1,167; no ceiling raised. No new string, no model file, nothing visible to a singer, no dependency added to the tree.
- **Outside the tree:** I installed `opencv-python-headless` 5.0.0 with pip, for the oracle only. It is in no lockfile.
- **Lines of the new or changed `omr/` files:** `underlay-frame.ts` 370, `underlay-seat.ts` 217, `underlay-rows.ts` 177 (one comment paragraph added); each under 1,000.

## 3. Each measurement

### Functions and tests

| File | Signature | Tests |
|---|---|---|
| `underlay-seat.ts` | `seatTokens(tokens, notes, rule): Seat[]`; `Seat` gains `unseated: boolean`; `by` is `'monotone'` for an unseated token | 55 (+7) |
| `underlay-frame.ts` | `frameRow(crop: GreyBandLike, options?: { inkHeight?: number; pad?: number }): { crop: FramedCrop; transform: FrameTransform }`; `unframePoint(t, x, y)`; `unframeBox(t, box)`; `skewAngle`, `inkExtent`, `paperTone` (exported for tests and callers) | 29 |

`FrameTransform` is `{ scale, pad, angle, width, height }`. `FramedCrop` is a `GreyBandLike` whose `data` is a `Uint8Array` and whose `paper` is the tone it was padded with.

### Gates, before and after (eight, run in this clone)

| Gate | After step 2 | After step 3 |
|---|---|---|
| `pnpm test:phonology` | 291 passed (291) | 291 passed (291) |
| `pnpm test:dictionary` | 248 passed (248) | 248 passed (248) |
| `pnpm --filter @ilya/web check` | 0 errors, 12 warnings, 5 files | 0 errors, 12 warnings, 5 files |
| `pnpm --filter @ilya/web test` | 3174 passed (3174) | 3210 passed (3210): +7 seat, +29 frame |
| `pnpm --filter @ilya/score-parser test` | 775 passed, 5 skipped (780) | 775 passed, 5 skipped (780) |
| `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| `pnpm ratchets` | OK | OK |

The type check found 7 errors on the way (a missing `unseated` in my hand-made `Seat` helper in `underlay-words.test.ts`, and `ArrayLike.map` in the frame tests); vitest does not type-check, so they were invisible to it. All fixed before the commit.

### Item A: the surplus case

Expectation (the desk's, from its harness): seating the least-cost in-order subset beats the fallback. I did not measure that; the desk's 1,836 against 1,762 (vowel test) and 1,601 against 1,552 (exact test) are not reproduced here, as I have no scans. Likeliest failure of my part: a surplus token left over in the middle of a row folded onto a neighbour, or dropped from the result.

Result: the tests seat the in-order subset of least cost for a surplus at the end, in the middle, and at the start of the row; equal counts are unchanged; no note holds two tokens; a hyphen, an extender, or a mark is never marked `unseated`.

Cross-check (`xcheck.sh`, `xcheck-step1.txt`): for rule 3 with `n <= m` the result is the same as `score44.py`'s, as before; for `n > m` the harness's code no longer applies, so the check is a brute force over every in-order choice of `m` tokens: the count seated is `m`, the notes taken rise with the tokens, every unseated seat is flagged, and the total distance equals the brute-force minimum. 4,500 seatings, 328 of them surplus, 0 differ.

Mutants (`spec-seat.json`, `mutants-seattokens.txt`), 31 in all, all killed. The two you asked for: the fallback to `nearest` restored for `monotone` (killed by 7 tests), and the surplus tokens dropped from the result (killed by 10). Also killed: tokens not skipped, surplus seating ignoring distance, a left-over token folded onto its nearest note, a left-over token not flagged, and a hyphen flagged unseated. The last of those took a test change: with the hyphen farthest from every note, counting it as a syllable changed nothing, so the first version of the "non-syllables do not count" test let that mutant live. The test now puts the hyphen on a head.

### Item B: the four steps

Expectation (written before the run, in your message): the oracle and `frameRow` agree. Likeliest failure of that: the rotation, whose convention a text description leaves open (centre, interpolation, fixed point).

First run against the oracle: the angle differed on 79 of 200 rows and 150 rows differed in pixels. Two causes, found and removed by measuring, not by guessing:

1. **The oracle's mask.** I had turned a 0/1 `uint8` mask with `warpAffine`, which rounds every turned pixel back to 0 or 1 and so binarizes the projection. With a 0/255 mask the angle differed on 5 rows. (That is the oracle's fix, and a thing the desk's harness may have done either way: see section 5.)
2. **The centre.** With the angle equal, the remaining pixel differences came from the rotation centre. `attrib_frame.py` (`attrib-frame.txt`), 192 rows with ink, turned by 1.3 degrees: OpenCV about `(w/2, h/2)` against OpenCV about `((w-1)/2, (h-1)/2)` differ by more than 1 grey level on 3.74 percent of pixels (median; 9.3 percent at most). OpenCV about the exact centre against my first float turn: 0.0000. `cv2.resize` with `INTER_CUBIC` against my bicubic: 0.0000. So the turn and the resize are the same arithmetic as OpenCV's, and the only difference was the centre. A shift of 0.014 px moves a steep glyph edge by 3 to 4 grey levels. I changed `frameRow` to turn about `(w/2, h/2)`, which is what `cv2.getRotationMatrix2D((w/2, h/2), ...)` takes.

Result after that (`xcheck_frame.py`, `xcheck-frame.txt`): 200 rows, 8 with no ink. Angle differs on 3, size on 0, pixels (more than 1 grey level in more than 0.5 percent of pixels) on the same 3. The 3 rows, explained by `attrib-frame.txt`:

| Row | Oracle angle | `frameRow` angle | Variance gap at the two angles |
|---|---|---|---|
| 139 | 1.7 | 1.6 | oracle ahead by 2.18e-05 (OpenCV mask), `frameRow` ahead by 1.53e-06 (float) |
| 181 | 0.5 | 0.0 | 2.76e-06 and 1.20e-05 |
| 188 | 1.0 | 1.1 | 2.04e-05 and 1.71e-06 |

Each is a flat peak of the projection variance. OpenCV turns a `uint8` mask and rounds every pixel to an integer; `frameRow` keeps the fraction. The two pick different neighbours of the same peak, and the 0.1 to 0.5 degree difference makes the rest of the row differ. The remaining 197 rows agree.

Mutants (`spec-frame.json`, `mutants-frame.txt`), 21, 19 killed. The five you named are killed: drop the deskew (3 tests), flip the angle's sign (2), closing kernel 1 by 1 (2), scale to 48 (5), pad with white on grey paper (4). Also killed: default pad, sweep range, sweep ties to the larger angle, black border, ink threshold, extent from 5 percent, extent from the first ink row, paper tone on a tie, dilate without erode, scaling a crop with no ink, three `unframe` mutants, and resizing the width only. Survivors:

- **Sweep tries the negative angle first on a tie.** It only matters where the variances at +k and −k are equal to the last bit. I built no input that does that, and a test that depended on it would test the floating-point rounding. The rule (the positive angle on an exact tie) is my choice and is in the header.
- **`SWEEP_PAD` 120 to 0** (superseded by the amendment below: the padding is now the crop's own height; the finding stands for it). I found no input where the padding changes the angle: 300 rows, 100 of them tilted rows that fill a crop 28 to 40 rows high, gave the same angle with and without it (`/scratchpad` run, not kept in the tree). At the best angle the turned row stays inside the frame, so padding only changes angles that lose anyway. The padding is the desk's, and I kept it.

### Timing

`frameRow` on a 3,400 by 90 crop took 1,461 ms in Node on this machine, and 1,665 ms at 3,400 by 140 (a row of 90 glyph blocks); 61 turns of a mask 240 rows taller than the crop are almost all of it. Per page, that is that figure times the number of rows. Not measured in a browser, and not in a Worker.

## 4. Departures from the brief and from your message

| Departure | Reason | Reversible |
|---|---|---|
| Rotation centre `(w/2, h/2)` in pixel indices, not the exact `((w-1)/2, (h-1)/2)` | Section 3. OpenCV's idiom; most probably the configuration the desk measured. Said in the header; the exact centre is a two-line change | Yes |
| The paper tone is taken once, from the crop as given, for the rotation border and the padding | Your text defines it as "the most frequent grey of the crop" and uses it in steps 1 and 4. After scaling, the mode could differ by a grey level or two | Yes |
| The sweep rotates the mask with a float bilinear and keeps the fraction | OpenCV on a `uint8` mask rounds; the oracle shows the effect (3 rows) | Yes |
| The ink extent is compared with integers (`sum * 50 >= total`, `sum * 50 >= 49 * total`) | `0.02 * total` in floating point can round the wrong way at an exact boundary | Yes |
| Output size is `Math.round(w * factor)`; OpenCV rounds half to even | Differs only at an exact .5; no row hit it in 200 | Yes |
| `unframePoint` turns a point back exactly; `unframeBox` returns the bounding box of the four turned corners | You asked for exact scale and padding and approximate angle. A point is exact (a test shows 1.5 px on the last glyph of a tilted row, resampling included); a box is the approximation | Yes |
| No cap on the scale factor | Your text gives none. A crop whose 2-to-98-percent extent is 1 row would be scaled 32 times. A row from `cutRows` is at least 0.4 staff space of ink, so the factor stays near 1 to 3, but the module does not enforce it | Yes |
| The unseated seat has `by: 'monotone'`, as you wrote, and `offset: null` | As specified. (My first version of the desk's amendment set `by` to null; changed.) | Yes |
| The surplus is one least-cost alignment with exactly `min(n, m)` pairs, written as a transposed table when `n > m`, not a skip cost on the token | Same result as a table where a token may be skipped at a cost never lower than seating it, for the choice of subset: every note is taken. Cross-checked by brute force | Yes |
| New scripts and outputs in `docs/sessions/measure-n135-stage2a_2026-10-27/` | Every number in a report comes from a script | Yes |

## 5. What I could not establish

NOT ESTABLISHED beats a complete invented answer.

- **That the framing does what the desk measured.** I have no scans. The 2,086 against 1,875 of 2,538 syllables (and 1,026 against 860 on the photocopies), and the 1,836 against 1,762 and 1,601 against 1,552 for the surplus case, are the desk's numbers. Nothing in this step reproduces them.
- **The harness's rotation centre, mask interpolation, and where it took the paper tone.** The text does not say. I chose OpenCV's centre and the input crop's tone. If the harness used another, `frameRow` differs from it by up to 3.7 percent of pixels by more than 1 grey level; whether that moves the syllable count is unmeasured.
- **The padding claim.** That 0.3 staff space cuts through ink on 207 of 208 photocopy crops and 376 of 381 others is the desk's measure, quoted in `cutRows`' header as asked. I did not check it.
- **Browser cost.** 1.5 s a full-width row in Node. A browser, a Worker, and a crop cut to the row's x extent were not tried.
- **Whether a reader reads the framed crop better than the raw one** is the desk's measure and not mine.
- **Two surviving mutants** (section 3), neither killable on any input I built.
- **`sewWords` and unseated tokens.** An unseated syllable is reported in the seat list and then dropped by `sewWords`, as any syllable with no note is. A word with a dropped syllable in the middle is joined across the gap. Whether the caller should treat a row with unseated tokens differently is the desk's.

## 6. The files

New under `apps/web/src/lib/omr/`: `underlay-frame.ts`, `underlay-frame.test.ts`. Changed: `underlay-seat.ts` (monotone, `unseated`), `underlay-seat.test.ts`, `underlay-rows.ts` (one comment paragraph), `underlay-words.test.ts` (the `Seat` helper gains `unseated`).

Under `docs/sessions/measure-n135-stage2a_2026-10-27/`: `spec-seat.json` and `mutants-seattokens.txt` (31 mutants); `spec-frame.json`, `mutants-frame.txt`; `xcheck_seat_gen.py`, `xcheck_seat.mjs`, `xcheck-step1.txt` (surplus check added); `xcheck_frame.py`, `xcheck_frame.mjs`, `xcheck-frame.txt`; `attrib_frame.py`, `attrib-frame.txt`.

Addenda appended to `report-code-n135-stage2a-step1_r1_2026-10-27.md` and `report-code-n135-stage2a-step2_r1_2026-10-27.md`, pointing here.

Stopping, as asked.

## 7. Amendment of 2026-10-27, after the commit above: proportion, never a pixel count

Dann's ruling at 14:27, relayed by the desk: `frameRow` takes no absolute pixel value except `inkHeight`, which is the reader's own preferred letter size in reader pixels and the one legitimate absolute. Applied in a second commit on `cloud-lane-16`.

- **The measured 16 px is now 0.5 of the ink height.** The option `pad` (px) is now `padRatio`, a fraction of `inkHeight`, default `DEFAULT_PAD_RATIO = 0.5`, applied after the scale. The padding in pixels is `Math.round(padRatio * inkHeight)`: 16 at the default 32, so the measured configuration is unchanged in effect, and 32 at `inkHeight` 64. `FrameTransform.pad` is still in framed pixels, because that is what `unframePoint` subtracts.
- **The sweep's mask padding is the crop's own height** above and below (was 120 px), through one function, `sweepPad(h)`. `SWEEP_PAD` is gone.
- **The closing stays 3 by 3**, and the header now says why it is the one step whose size is in page pixels: it runs before the scale, on the page's own pixels, and a broken stroke's gap is a property of the print, measured at the scan's resolution; a later row may make the kernel proportional to the staff space, which the caller knows and this module does not.
- **Other numbers left alone, and why:** `inkHeight` 32 is the reader's own size. The ink threshold 128 is a grey level, not a length. The sweep's 3.0 degrees and 0.1 steps are angles. The 2-to-98-percent extent is a share.
- **Tests:** the same 29. Updated for the renaming: the `pad: 0` options became `padRatio: 0`; the default-padding test now reads `DEFAULT_PAD_RATIO * DEFAULT_INK_HEIGHT` and asserts 16; the explicit-pad test now checks a ratio of 0.25 (8 px at 32, 16 px at 64, 16 more pixels of width and height at 32 and 32 more at 64). No test removed.
- **Oracle:** kept. Its padding is now `round(0.5 * 32)` and its sweep mask padding is the crop's height. Result unchanged: 200 rows, angle differs on 3 (the same rows, 139, 181, 188), size on 0, pixels on the same 3.
- **Mutants:** 23, of which 21 killed; the same 2 survive (the negative angle first on a tie; the sweep padding, now "120 px, not the crop's own height", still unkillable on the 300 rows tried). Two added and killed: padding an absolute 16 px with the ratio ignored (5 tests), and padding a fraction of the crop's height instead of the ink height (3). The five required mutants remain killed; `default pad 16 -> 8` became `default pad ratio 0.5 -> 0.25`, killed.
- **Gates:** unchanged from section 3's table: web 3210 passed (3210), check 0 errors and 12 warnings in 5 files, the other six at their baselines, ratchets OK. `underlay-frame.ts` is 392 lines.
- **Not established, added:** whether `Math.round(padRatio * inkHeight)` is the rounding the desk wants for an `inkHeight` that makes a half pixel. At 32 and 0.5 it is exact.
