SHIP AFTER AMENDMENTS

# Fable review of N.135 stage 2a as built (`cloud-lane-16` at `0bdba67`), r1

Reviewer: Fable 5.1, 2026-10-27. Read this session: the lane at `/root/lanes/l16` (the five modules, their tests, `stamp.ts`, Code's three reports, the measure folder); on `Shane` (`/root/lanes/shane`) the brief, the 2026-10-15 review, the three desk reports of today, the stage 1 harness (`score44.py`, `common2.py`, `rowsys.py`), `CONTRACT.md` §1 items 10, 18, 19, §3 tethers 1, 11, 15, 21, §4; the desk's recovered measure scripts at `/root/measures/` (`n135-row117/scripts/clean.py` whole, `n135-lever2/lever2.py` and `step1c.py` in part); and in the tree `score-seat.ts`, `vowel-resolver.ts`, `musicxml-parser.ts`, `scan.ts`. The six test files were run in a scratch copy (`/tmp/claude-0/-home-claude/1fb3a645-8f14-5f64-8fc1-7deb9dad61e8/scratchpad/l16copy`): 155 passed, which is Code's 23 + 55 + 32 + 13 + 29 + 3. Three probes were run there too (section 8). No file in either lane was changed and no git write command was run.

Two findings first, one sentence each (`CONTRACT.md:14`, item 9):

1. The step 3 report believes the surplus rule reproduces the desk's 1,836 and 1,601; the desk's measure (`/root/measures/n135-lever2/step1c.py:44`) seats on the free notes, every read note that is not a tie stop, while `seatTokens` seats `monotone` and `nearest` on every note it is handed, tie stops included (`underlay-seat.ts:155-156`, `:166`), and a test pins that (`underlay-seat.test.ts:72-78`, `monotone` seats «ка» on the note tied into), so stage 2b would seat syllables on tie stops, the error row 93's walk found.
2. The step 3 report says an unseated syllable is dropped by `sewWords` and the word joined across the gap; the probe shows «пе-», «чаль-», «ны-», «е» over three notes becomes one word «пе | чаль | е» with roles begin, middle, end (`underlay-words.ts:84`, `:92`, `:97`), a misspelt word that `seatScoreWords` seats with confidence because its vowel count (3) matches its slots (3) (`score-seat.ts:137`), where the print's whole word «печальные» would have been withheld; so the drop turns a read the reader could not place into a confident wrong word under the notes.

## Amendments

These become step 4 for Code. Each names the change, the place, the reason, and the test that proves it. "Must land" means before Dann merges `cloud-lane-16`; "can wait" means stage 2b, where the real page is.

### Must land

**1. `monotone` and `nearest` seat only on notes that sing a syllable.**
- Change: in `seatTokens`, build the candidate list for `monotone` and `nearest` from the notes that are not `tiedInto` and not `underExtender`, as `order` already does for its `sung` list (`underlay-seat.ts:182`). Keep `staff` (all notes, x sorted) for `bar` lookup; take `xs` from the candidates only (`:155-156`). The `by` and `shared` bookkeeping is unchanged. Where no note is a candidate, every syllable token is `unseated` with `by: null`.
- Why: the desk's measured configuration C1 and C2, the ones that justified the surplus rule (1,836 and 1,955 nucleus, 1,601 and 1,630 exact), seat on the free notes only (`/root/measures/n135-lever2/step1c.py:44`: `cn = [i for i in idx if (not ev[i]['tieStop'] if cands == 'free' else True)]`, with `cands='free'`). The harness's own `score44.py:47-51` seats rules 1 and 3 on every note, which is what Code cross-checked against (`xcheck-step1.txt`), so the cross-check holds and the measured rule does not. A singer meets this as a syllable under a tie's second note, the walk's "one note early" (`QUEUE-archive.md:188` as the brief quotes it).
- Test: change `underlay-seat.test.ts:72-78` so that with notes 100, 200, 300 (tied into), 400 and tokens at 100, 200, 310, `monotone` and `nearest` give `[10, 11, 13]`, and `order` still gives `[10, 11, 13]`. Add: all notes tied into, `monotone` returns every syllable `unseated: true`, `by: null`. The cross-check `xcheck_seat_gen.py` sets no flag, so `xcheck-step1.txt` must still print 0 differ.

**2. `sewWords` never drops a letter the reader read inside a word.**
- Change: (a) in `sewWords` (`underlay-words.ts:84`), a syllable seat with `note === null` whose word is open (`glue` is true, or the token starts with a hyphen) is merged into the open word's last syllable: its text, hyphens stripped, is appended to that syllable's `text`, and `glue` is set from the merged token as at `:97`. Where no word is open, hold the text and prepend it to the next syllable that opens a word only if that next token continues it (the held token ended in a hyphen); otherwise the held text is a whole unseated word and is left out, as today. (b) `oneToANote` (`:49-57`) keeps the nearer seat's `note` and joins the texts of all seats on that note in x order, instead of dropping the farther one.
- Why: the mixed default is the print's own words (`OPEN.md:2758-2765` as the brief and review cite it). A dropped syllable fabricates a word the print does not hold; `seatScoreWords` seats it with confidence when its vowel count happens to match (`score-seat.ts:137`), and the pipeline glosses it if it is a dictionary word (review amendment 5's own N.163 caveat). A merged syllable keeps the word whole; `collectScoreWords` gives that word one slot per `<lyric>` syllable (`vowel-resolver.ts:239-249`), so the word's slots (3) differ from its vowels (4) and `seatScoreWords` withholds the whole word (`score-seat.ts:137-139`): the singer sees the print in the Input and no seat on that word, which is the abstention section 1 of the brief describes. The harness's scorer joined the texts of every token on a note (`score44.py` as the step 2 report says, and `lever2.classify` in the desk's measure), so the measured numbers already count joined texts right. The desk's C1 dropped 142 tokens in 78 of 210 systems and C2 249 in 124 (`report-desk-n135-lever2-measure_r1_2026-10-27.md`, step 1c table), so this is not a corner: a third to a half of systems hold a surplus.
- Test: tokens «пе-» (100), «чаль-» (200), «ны-» (250), «е» (300) on notes 100, 200, 300 under `monotone` give one word of three syllables «пе», «чаль», «ные» on notes 1, 2, 3, roles begin, middle, end. Tokens «и» (150) unseated between two one-syllable words give two words, «и» absent. Two seats on one note under `nearest` give one syllable whose text is the two texts joined in x order. Extend the fixture test (`underlay-words.test.ts:287`) so a word written as «пе», «чаль», «ные» comes back from `collectScoreWords` with `raw` «печальные» and three slots.
- Do not merge a whole unseated word into a neighbour with a space: `scoreWordsText` would then put two words in the Input where `collectScoreWords` has one, and `align` returns null and withholds the whole seat (`score-seat.ts:31`, `:119`). A whole unseated word is stage 2b's to count (section 4 below).

**3. The closing kernel is a proportion of the staff space.**
- Change: `frameRow(crop, staffSpace, options)` takes the staff space as `cutRows` does (`underlay-rows.ts:147`). The kernel is the largest odd number not above `CLOSE_SHARE * staffSpace`, floored at 1 (1 means no closing), with `CLOSE_SHARE = 0.1`: 3 at the measured staff space of about 30 px (`report-code-n135-underlay-harness_r1_2026-10-15.md`, 4.4, "staff space about 30 px"). `filter3` becomes `filterK` with a centred window cut at the edges, which is OpenCV's default morphology border (`clean.py:48`, default anchor and border).
- Why: Dann's ruling (2026-10-27 14:27, relayed in the step 3 report §7): no absolute but the reader's letter height. Code's argument (`underlay-frame.ts:45-50`, step 3 report §7) is that a stroke's gap is a property of the print at the scan's resolution. That holds for a PDF, which Ilya rasters at 400 dpi (`page-pdf.ts:52`, `TARGET_DPI = 400`). It does not hold for a picture: the scan path takes "a PDF or a picture" (`scan.ts:4`, `toGreyscalePng` at `:15`), and a picture's pixels per staff space are whatever the camera gave, so 3 px is a different physical gap on every picture. The staff space is the one length Ilya knows on both paths. At 30 px the kernel is 3, so the measured configuration is unchanged. Whether 0.1 is the right share at other staff spaces is NOT ESTABLISHED (row 117 measured 2, 3, 4, 5 at one resolution only: +8, +38, +31, +32); DESK DEFAULT, stage 2b measures it.
- Test: at `staffSpace` 30 the closing tests (`underlay-frame.test.ts:142-157`) hold as written (2 px closes, 3 px does not); at 60 a 4 px gap closes and a 5 px gap does not; at 12 a 1 px gap stays open. The oracle `xcheck_frame.py` passes 30 and keeps its 3 by 3.

### Can wait for stage 2b

**4. A token splitter before `seatTokens`, and the engine's cut.**
- Change: a pure `splitTokens(tokens: Token[]): Token[]` that splits a token at an internal non-letter and shares its box among the parts by letter count, dropping a part with no letter, as `score44.tokens_of` does (`measure-n135-underlay-harness_2026-10-15/score44.py:21-30`); and a hook for the engine's cut of a part with two or more vowel letters, passed in as a function (`cut: (word: string) => string[]`) on the pattern of `isWord`, because `GraysonEngine.syllabify` lives in `packages/phonology` and whether `omr/` may import it is NOT ESTABLISHED against `scripts/ratchets.mjs` (not read this session).
- Why: every measured seating number is on split tokens (`SPLIT=1`; stage 1 report §1 finding 2: 1,391 to 1,761 for (a)), and the best configuration, C2, cuts two-vowel tokens with the engine (`/root/measures/n135-lever2/step1c.py:1`, `:82`; 1,955 nucleus). Stage 2a hands `seatTokens` whole tokens flagged `runTogether` (`underlay-seat.ts:213`); Code says so (step 1 report, departures, "Stage 2b will need a splitting step"). Without it stage 2b cannot reproduce any measured count.
- Test: «су-е» over two notes becomes «су» and «е» on two notes; the box of a 40 px token «бала,» stays one part; `xcheck_seat_gen.py` extended with the harness's `tokens_of` as oracle.

**5. The sweep in a cost proportional to the ink, not the crop.**
- Change: in `projectionVariance` (`underlay-frame.ts:147-182`), replace the dense bilinear turn of the padded mask with a pass over the ink pixels only: for each ink pixel `(x, y)` compute the turned row `sy = cy + dx * sin + dy * cos` and add its unit of ink to `sums[floor(sy)]` and `sums[floor(sy) + 1]` by the fraction (`sy - floor(sy)`). The row list of ink pixels is built once per crop; the 61 angles each cost one pass over it. Keep the padded height for the `sums` array.
- Why: the probe measured `skewAngle` at 1,320 ms of `frameRow`'s 1,312 ms on a 3,400 by 90 row with 10.6 percent ink (section 8), so the sweep is the whole cost; a page of 10 to 20 rows is 15 to 30 s before the reader starts, which a singer waits through even in a Worker. The ink share is about a tenth of the crop, and the padding (two more crop heights, `:131-141`) is all zeros, so this pass does about a thirtieth of the work. It computes the same quantity, the variance of the turned mask's row sums, by forward splatting instead of inverse sampling; the two differ in the bilinear fractions only. Cheaper than a coarse-to-fine sweep, and without its risk: Code found flat peaks where 0.1 to 0.5 degrees of angle turn on a variance gap of 2e-5 (`attrib-frame.txt`), where a coarse step can land on the wrong neighbour. Cutting the crop to the ink's x extent gains little on a text row, which spans most of the band.
- Test: the 29 frame tests as they stand; `xcheck_frame.py` reports the count of rows whose angle changes against the present code, expected 0 to 3 of 200 (the flat peaks). A timing line in the report: the 3,400 by 90 row under 100 ms.

**6. The sweep's mask padding is enough for any width.**
- Change: `sweepPad(h)` (`underlay-frame.ts:131-133`) becomes `h + ceil((w / 2) * sin(SWEEP_DEGREES))`, so that no angle within the sweep turns ink out of the mask on any crop.
- Why: the desk's harness padded 120 px (`clean.py:26`), an absolute the ruling removed; Code replaced it with the crop's height and showed on 300 rows no wider than 520 px that the angle did not change (`xcheck_frame.py:12`, widths 200 to 520). On a full-width row, 3,400 px, the far end rises `1,700 * sin(3 deg) = 89 px`, which leaves a mask padded by `h = 50`. Whether that moved any angle is NOT ESTABLISHED; the bound costs nothing and is derived from the crop, not fixed.
- Test: a 3,400 by 50 row of blocks tilted 2.8 degrees reports 2.8 within 0.1 (`skewAngle` is exported).

**7. A cap on the scale factor.**
- Change: `frameRow` caps `scale` at `inkHeight / (MIN_ROW * staffSpace)` (`MIN_ROW` from `underlay-rows.ts:66`), which is 32 / 12 at 30 px.
- Why: Code names the hole (step 3 report §4, "No cap on the scale factor"): an extent of one row scales 32 times, and a 3,400 by 90 crop becomes 108,800 by 2,880, 313 MB, in a browser. A row `cutRows` cut is at least `MIN_ROW` staff spaces of ink (`underlay-rows.ts:162`), so the cap never binds on a row from `cutRows` and only guards a caller who hands in something else. Derived from the staff space, no new absolute.
- Test: a 200 by 100 crop with a 1 px line of ink and `staffSpace` 30 comes back with `scale` 32 / 12, not 32.

**8. `PAPER_GRID` as a proportion.**
- Change: `cutRows` samples the paper tone on a grid of one staff space (`underlay-rows.ts:78`, `PAPER_GRID = 37`, used at `:90-91`), not 37 px.
- Why: the same ruling. It is a sampling stride, not a size, so it is the least of the absolutes; the harness's 37 was taken on the page (`GreyBandLike.paper` is the caller's, `:39-45`), and stage 2b passes `paper` from the page, so the band-level fallback is rarely used. Can wait.
- Test: `underlay-rows.test.ts:106` (even count of samples) re-keyed to the staff space; `xcheck_rows_gen.py` passes `paper` explicitly already (step 1 report §3), so it does not move.

**9. A long dash is a mark, not a joint.**
- Change: `kindOf` (`underlay-seat.ts:87`, `:92-98`) and `sewWords` (`underlay-words.ts:41-43`) class a lone token of `–` or `—` whose box is wider than half the row's ink height as `mark`; a narrow one stays `joint`. The ink height is the caller's (`frameRow` knows it).
- Why: a printed dash between words («бала — и») would today join two words into one. The build songs show none: 0 em or en dashes in P's truth draft (172 syllables) and 0 in row 81's transcription (`poem-r81.txt`), counted this session, so this is a lead, not a finding, and the harness's `HY = '-–—‐'` (`common2.py:10`) has the same behaviour. NOT ESTABLISHED for the Sunless and Kabalevsky prints.
- Test: a lone «—» token 40 px wide between «бала,» and «и» at ink height 32 leaves two words; a lone «-» 8 px wide joins.

## 2. Does `frameRow` reproduce the configuration that read 2,086?

Read from the recovered script, not inferred: `/root/measures/n135-row117/scripts/clean.py`, the step 6 pipeline `deskew,close:3,height:32,padpaper:16:16` (`report-desk-row117-image-cleaning_r1_2026-10-27.md:463`, `clean.py:91-103` applies the steps in order).

| Choice | The harness (`clean.py`) | `frameRow` | Verdict |
|---|---|---|---|
| Rotation centre | `(w / 2, h / 2)` for the mask (`:27`, `:29`) and the grey (`:38`) | `(w / 2, h / 2)` (`underlay-frame.ts:155-156`, `:208-209`) | MATCH. Code's guess was right |
| Sweep mask | `(grey < 128).astype(float32)`, `warpAffine` bilinear, border 0, fraction kept (`:26`, `:30`) | float bilinear, fraction kept (`:147-174`) | MATCH. The oracle's rounded uint8 mask was the oracle's error, not the harness's |
| Sweep range and step | −3.0 to 3.0 by 0.1 (`:21`) | the same (`:114-116`) | MATCH |
| Sweep padding | 120 px above and below (`:26`) | the crop's height (`:131-133`) | DIFFERS, by the ruling; see amendment 6 |
| Tie on the variance | within 1e-12 relative, smaller absolute angle, and on equal absolute the negative first (`:33`, `sorted(..., key=abs)` is stable over a sweep that runs −3.0 to 3.0) | exact tie, smaller absolute angle, positive first (`:190-197`) | DIFFERS on an exact tie only. Code's surviving mutant 1 is the harness's own order |
| Angle taken on | the original crop (`:92`, `g0`) | the input crop (`:346`) | MATCH |
| Deskew of the grey | bilinear, same size, border 255 white (`:38-39`) | bilinear, same size, border the paper tone (`:347`, `:211`) | DIFFERS on grey paper only (M, and the grey-paper clean songs); identical where paper is 255 (the photocopies and P) |
| Closing | inverted grey, 3 by 3 ones, dilate then erode, default anchor and border (`:45-49`) | the same, window cut at the edges (`:229-258`) | MATCH |
| Ink extent | first row where the cumulative ink reaches 2 and 98 percent, `searchsorted` (`:53-58`), on the deskewed and closed crop | the same, in integers (`:261-278`), on `closed` (`:352`) | MATCH (an exact float boundary aside, Code's departure) |
| Scale | `cv2.resize` `INTER_CUBIC`, `round(w * f)` half to even (`:63-68`) | Keys a = −0.75, `Math.round` (`:290-324`); Code's `attrib-frame.txt` shows 0.0000 against `cv2` | MATCH (an exact .5 aside) |
| Paper tone for the padding | mode of the crop AFTER deskew, closing, and scaling (`:102`, computed on `g` at that step) | mode of the input crop (`:344`) | DIFFERS in source; equal where the paper is two-level (255), which is every photocopy and P (row 117 report §2 item 1) |
| Padding | 16 px on all four sides of that tone (`:102`) | `round(0.5 * 32) = 16` of the input's tone (`:341`, `:358`) | MATCH in size |
| Order | deskew, close, height, pad | the same (`:346-358`) | MATCH |

So of the four choices Code named: the centre, the float mask, and the 2-to-98 extent match the measure; the paper tone taken once from the input does not match it in source, and the rotation's border fill is white in the measure, not the paper tone. Both differences touch only crops whose paper is not 255: M (46 to 47 of 53 syllables) and the grey-paper clean songs. On the photocopies and P, which hold 1,249 + 177 of the 2,538 syllables, `frameRow` is the measured configuration to within the sweep padding and the exact-tie order.

What stage 2b must check before trusting the 2,086 to carry over, in this order and each cheap:

1. **The angles.** Run `skewAngle` on the 589 crops of `/root/n135work/crops2/` (on the desk's machine; not here) and compare with `/root/measures/n135-row117/results/angles.json` (`correction_deg` per crop). Expect equality on all but exact ties and crops wider than the sweep padding bound (amendment 6). No reader needed.
2. **The pixels.** Run `frameRow` on the same crops and compare with the harness's `crops-f6-h32-B/` (not in `/root/measures/`, so on the desk's machine if kept, else re-made by `clean.py`): count crops differing by more than 1 grey level in more than 0.5 percent of pixels, as `xcheck_frame.py` counts. Expect 0 on the two-level crops.
3. **The count.** Read the framed crops with the same reader (`read-dfloat-chrome.mjs`) and score with `score117.py`: 2,086 within the noise floor the desk measured, +6 and +19 on a nine-song total (`report-desk-row117...md:136-137`), so about 20 on the whole 18.
4. **The app's own crop.** The desk said it: "The frame the app gives its reader is not the row crop of this harness" (`:368`). `cutRows` on the real bands must reproduce `rows2/*.jsonl` (step 1 report §5, NOT ESTABLISHED on real rasters) before any of the above carries into Ilya.

## 3. Absolutes the proportion ruling forbids

- The 3 by 3 closing in page pixels (`underlay-frame.ts:45-50`, `:229-258`). Code's argument fails on the picture path (`scan.ts:4`, `:15`): amendment 3.
- `PAPER_GRID = 37` px in `cutRows` (`underlay-rows.ts:78`): a sampling stride, amendment 8, can wait.
- The sweep padding is now the crop's height (`:131-133`), proportional but not sufficient on a full-width row: amendment 6.
- Not absolutes, rightly left: `INK_BELOW = 128` and `INK_BELOW_PAPER = 60` are grey levels (`underlay-frame.ts:112`, `underlay-rows.ts:60`); the sweep's 3.0 degrees and 0.1 step are angles; the 2-to-98 extent is a share; `inkHeight = 32` is the ruled absolute (`:109`); the padding is 0.5 of it (`:110`, `:341`).
- Judgement on Code's argument (step 3 report §7, `underlay-frame.ts:45-50`): right that the gap is the print's and not the letter's, so it must not scale with `inkHeight`; wrong that the page pixel is fixed, because only the PDF path fixes it at 400 dpi (`page-pdf.ts:52`). The staff space is the length Ilya knows on both paths, which is why `cutRows` already takes it (`underlay-rows.ts:147`).

## 4. The unseated surplus and `sewWords`

A defect a singer would meet: yes. Finding 2 above, with the probe in section 8. The desk's own measure says how often: C1 left 142 tokens unseated in 78 of 210 systems, C2 249 in 124 (`report-desk-n135-lever2-measure_r1_2026-10-27.md`, step 1c table). Every one of those inside a word becomes, under `sewWords` as built, a shorter word the print does not hold, seated with confidence where its vowels happen to match its notes (`score-seat.ts:137`). Amendment 2 is the remedy for a syllable inside a word: no letter is dropped, and `seatScoreWords` withholds the word by its own count rule, which is the abstention the brief's section 1 describes.

What stage 2b does with the rest:

- A whole word unseated (a one-syllable word, or a word all of whose syllables are surplus) cannot be merged (`align` returns null on a word-count mismatch, `score-seat.ts:31`, `:119`). Stage 2b counts them per page from the seat list (`unseated: true` with no open word) and feeds the count into the brief's section 5 threshold, which already withholds a page on the dictionary witness; DESK DEFAULT, a page with more unseated whole words than one per system keeps the typed-poem path. The number is a placeholder until the real page prints it.
- A note left with no token at a row's end, and a tokens-to-notes mismatch that the splitter (amendment 4) would have removed, are measured on the real page before any rule is written for them.
- MusicXML's `<elision>` (two syllables on one note as one lyric) is a lead for a whole unseated word; whether the mini-dom parser reads it is NOT ESTABLISHED (not read this session).

## 5. Tests and mutants

- **Mutant 1, the negative angle first on an exact tie:** harmless, and the harness's own choice (`clean.py:33`). It changes the sign of a 0.1-degree turn on a variance tie to the last bit; either neighbour is as level. No amendment.
- **Mutant 2, the sweep padding 120 against the crop's height:** harmless on the rows Code built, which are at most 520 px wide (`xcheck_frame.py:12`); NOT ESTABLISHED on a full-width row, where the far end rises 89 px at 3 degrees. Amendment 6 makes the question go away with a derived bound.
- **Tests that assert the wrong behaviour rather than the implementation:** `underlay-seat.test.ts:72-78` asserts that `monotone` seats on the note tied into ("where nearest and monotone cannot"), which amendment 1 reverses; `underlay-words.test.ts:89` and `:96` assert the drop of an unseated syllable and of the farther of two tokens, which amendment 2 reverses. Pins of configuration, acceptable: `transform.pad` 16 and `DEFAULT_INK_HEIGHT` 32 (`underlay-frame.test.ts:221-225`, `:261`). The frame oracle (`xcheck_frame.py`) was written from the desk's task text, so its 197 of 200 proves that two readings of one text agree, not that the code matches `clean.py`; now that `clean.py` is recovered, step 4 should point the oracle at `clean.py`'s own functions (white border, 120 px sweep pad, mode after scaling) and report how many of the 200 rows move, so the differences in the table above have a count.
- **Important and untested:** `frameRow` on a full-width row (only timed, never asserted); `writeLyrics` on a joined multi-page file (Code says not run, step 2 report §5); `cutRows` on a real raster (step 1 report §5); closing on grey strokes (the closing tests use ink 0, `underlay-frame.test.ts:133-136`, so grey morphology is only exercised by the oracle); an unseated syllable inside a word (no test; the behaviour is in the report only); `rowLanguage` against the real `isKnownWord` (step 2 report §5; the desk's witness report then showed `lookupStress` agrees with the folded key set on 1,041 words with 0 disagreements, `report-desk-n135-note-witness_r1_2026-10-27.md`, Setup, which closes the question for stage 2b's wiring).

## 6. Cost

A problem for stage 2b, not a blocker for the merge. The probe (section 8) puts 1,320 ms of `frameRow`'s 1,312 ms in `skewAngle` on a 3,400 by 90 row with 10.6 percent ink: 61 bilinear turns of a mask three crop heights tall (`underlay-frame.ts:136-141`, `:185-200`). A page of 10 to 20 rows is 15 to 30 s before the reader reads a letter; in a Worker it does not freeze the page, but the singer waits for the words. Cheapest sound fix, ranked: (1) amendment 5, the sweep over the ink pixels only, the same quantity at about a thirtieth of the cost and no change to which angles are tried; (2) a Worker regardless, which stage 2b builds on the `metre-client.ts` pattern for the pure steps while `tesseract.js` makes its own (review amendment 6); (3) cutting to the ink's x extent, which on a text row that spans the band saves little; (4) coarse to fine last, because Code's flat peaks (`attrib-frame.txt`, three rows turning on 2e-5) are where a coarse step picks the wrong neighbour.

## 7. Other sites that compute the same numbers

`CONTRACT.md` §4, the cross-site line. The brief changed no existing computation, and stage 2a adds new sites beside these:

**Row cutting.**
- `measure-underlay-baseline_2026-10-12/rows.py:2-4` (row 81's R1), `measure-n135-underlay-harness_2026-10-15/rowsys.py` (R1) and `rowsys2.py` (R2), and the desk's `crops2/` cut from them (row 117 report, Setup). `cutRows` matches `rowsys.py` and `rowsys2.py` on 400 synthetic bands (`xcheck-step1.txt`) and is NOT ESTABLISHED on a real raster. What depends on agreement: every measured count (2,086 and the seating figures) was taken on the harness's rows; a row cut differently is read differently (the row 117 noise floor: one pixel of vertical shift moves a nine-song total by 6 to 19).
- No other site in the app cuts text rows: `grep` for `staffSpace` and `paper tone` outside `underlay-*` finds library, reader worker, and tuplet code, none of which cuts a band.

**Seating.**
- `score44.py:32-61` (rules 1, 2, 3; rule 3 with the nearest fallback; every note a candidate), `lever2.py:84-108` (`drop_dp`, the surplus rule; `seat_row`), `step1c.py:44-50` (free notes, C1 and C2). `seatTokens` matches `score44.py` with no flags set and the brute-force surplus (`xcheck-step1.txt`), and differs from `step1c.py` on tie stops (amendment 1).
- In the app: `old-reader-seats.ts:165-175` (the order rule on old seats, not boxes; the same idea, a different input, no number shared); `score-seat.ts:107-160` (`seatScoreWords`, which seats the Input's slots on the `<lyric>` notes `writeLyrics` wrote and withholds a word whose slots and vowels disagree, `:137`); `pairings.ts` `buildSlotQueue` (one slot per vowel; cited by the desk's lever 2 report at `:212`, not read this session). What depends on agreement: `writeLyrics` writes one syllable per note with `syllabic` roles (`underlay-words.ts:143-168`); `collectScoreWords` rebuilds words from those roles (`vowel-resolver.ts:224-313`); `seatScoreWords` requires each word's slot count to equal its vowel count. Amendment 2 relies on that last rule to withhold a merged word.

**Word sewing.**
- `common2.py:88-101` (row 81's `sew`: a lone hyphen or underscore is a joint, a leading hyphen joins, `HY = '-–—‐'`), `lever2.py:19-33` (`sew2`: a leading hyphen does not join, a token with no letter is dropped, words carry extents), `sewWords` (`underlay-words.ts:70-106`: a lone underscore is an extender, a leading hyphen joins, U+2011 added). Three rules on two points (the lone underscore, the leading hyphen). What depends on agreement: the dictionary witness counts (54 of 55 rows, decision 1) and the note-count witness (`k` per sewn word, `report-desk-n135-note-witness_r1_2026-10-27.md`, Setup) were taken on `sew` and `sew2`; `rowLanguage` will be fed `sewWords`' words. Stage 2b measures `rowLanguage` over `sewWords` on the real rows before trusting 54 of 55 to carry.
- Token splitting: `score44.py:21-30` (`tokens_of`), `score42.py:63` (`split_internal` under `SPLIT=1`), `step1c.py` (the engine cut of two-vowel parts). No site in stage 2a (amendment 4).

## 8. The probes (run in the scratch copy, deleted after)

A vitest file with three cases, output copied from the assertion message:

- P1: `seatTokens` of «пе-» 100, «чаль-» 200, «ны-» 250, «е» 300 on notes 100, 200, 300, `monotone`: `[["пе-",1,false],["чаль-",2,false],["ны-",null,true],["е",3,false]]`; `sewWords` of that: `[[["пе",1,"begin"],["чаль",2,"middle"],["е",3,"end"]]]`.
- P2: notes 100, 200, 300 (tied into), 400; tokens 100, 200, 310: `monotone [10,11,12]`, `nearest [10,11,12]`.
- P3: a 3,400 by 90 row, ink share 0.106: `skewAngle 1320 ms`, `frameRow 1312 ms` (the two timings are separate calls; the sweep is the whole cost).

## What I could not establish

NOT ESTABLISHED beats a complete invented answer.

- Whether `cutRows` reproduces the harness's rows on the real rasters (the rasters are on the Mac and the desk's machine; step 1 report §5 says the same).
- Whether the rotation's white border (`clean.py:39`) against `frameRow`'s paper-tone border, and the paper tone taken after scaling against before, move any syllable on M or the grey-paper songs: the crops are not here, and no reader ran in this review.
- Whether the sweep padding (120 px against the crop's height) changes any angle on a full-width row; Code's 300 rows were at most 520 px wide.
- Whether `omr/` may import `GraysonEngine.syllabify` from `packages/phonology` under `scripts/ratchets.mjs` (not read); amendment 4 passes the cut in as a function so that it does not matter.
- Whether the mini-dom parser reads `<elision>` (lead for a whole unseated word).
- Whether a long dash is printed in any build song's underlay beyond P and S, T, K, M (0 found in P's truth and row 81's transcription).
- Whether 0.1 of the staff space is the right closing share at a staff space other than about 30 px.
- The browser's timing: 1.3 s is Node on this machine; a Worker and a phone are unmeasured.
- The exact order of the surplus merge in amendment 2 where a word's first syllable is the unseated one and the next token does not continue it; the amendment leaves such a word out, as today, and stage 2b counts it.

Terms: "surplus", "unseated", "free notes", "two-level", and "noise floor" are adopted from Code's and the desk's reports; "within-word merge", "sparse sweep", and "sweep padding bound" are mine.
