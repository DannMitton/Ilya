# Report: N.135 stage 2a, step 4 (Fable's three amendments, and the harness reading of the frame oracle), r1

Code (Sonnet 5.5), cloud lane, 2026-10-27. Same branch (`cloud-lane-16`) and rules as steps 1 to 3: nothing under `docs/memory/`, no brief committed, no git write but commit and push to this branch, no pull request. The three amendments are Fable's review of stage 2a as built (SHIP AFTER AMENDMENTS); the six that wait for stage 2b are not in this step. The `/root/measures` paths are the desk's recovered harness, which I cannot read; what Fable quotes from them is taken as given.

## 1. The answer first

**A finding that changes a decision: with `CLOSE_SHARE = 0.1` and "the largest odd number not above" the share, the closing kernel is 1 (no closing) on 90 of the 234 systems the stage 1 harness measured, because their staff space is under 30.0, while the measured configuration closed every system with 3 by 3.** `kernel-by-staff-space.txt`, from the `space` of each system in the harness's `systems/*.jsonl`: staff space runs from 16.0 to 32.1 with a median of 30.6; the kernel is 3 on 144 systems and 1 on 90, among them S 18, T 19, K 12, M 6, P 9, U5 17, U1 5, U6 3, B09 1. S, T, K, and M (the four songs that rows 80 to 88 measured) sit at 26.8 to 29.4, so **none of the four would be closed.** The step 4 text says "3 at the measured staff space of about 30 px, so the measured configuration is unchanged"; that holds only from 30.0 up. A rule that takes the nearest odd number of a tenth of the staff space gives 3 on 233 of the 234 (the one exception is U5's 16.0). I built the rule as written, with the share in one constant, and did not choose between them; the choice is the desk's.

The rest, one sentence each:

- **Amendment 1 (free notes only), done.** `monotone` and `nearest` (and `order`'s fallback) seat on notes that are not `tiedInto` and not `underExtender`; with no such note every syllable token is `unseated` with `by: null`. The cross-check holds in both readings: 0 differ from `score44.py` with no flag passed, and 0 differ from the harness rules run on the free notes with the flags passed (`xcheck-step1.txt`).
- **Amendment 2 (never drop a letter inside a word), done.** `sewWords` merges an unseated syllable into its word, and two seats on one note become one syllable with their texts joined in x order. One departure from Fable's wording, which I took from Fable's own test: section 4.
- **Amendment 3 (closing kernel from the staff space), done.** `frameRow(crop, staffSpace, options)`; kernel 3 at 30, 5 at 60, 1 at 12; section 1's finding above.
- **The harness reading of the frame oracle: 143 of 200 rows differ** between `frameRow` and an oracle with a white rotation border, a 120 px sweep pad, and the paper tone taken after the scale (against 3 of 200 for the text reading). By setting: the white border alone accounts for 102 rows (6 of them in size), the paper tone after the scale alone for 73, the 120 px sweep pad alone for 3 (the same 3 as the text reading, angle ties). `frameRow` is unchanged for them.
- **Tests:** `underlay-seat.test.ts` 59 (+4), `underlay-words.test.ts` 42 (+10), `underlay-frame.test.ts` 33 (+4); the web suite rises from 3,210 to 3,228, which is those 18.

## 2. The tree

- **Branch and commit:** `cloud-lane-16`, from step 3's amendment commit `0bdba67b`; the commit that carries this report is the head of the push. At the start `git status` was clean and `HEAD` equalled `origin/cloud-lane-16`. Several tool notices said files had "changed on disk"; I checked and nothing differed, so I took them as noise.
- **Not touched:** `docs/memory/`, the brief, its review, any approval file. `+page.svelte` 5,597 of 5,597, `pipeline.ts` 925 of 925, `musicxml-parser.ts` 1,167 of 1,167; no ceiling raised. No new string, no model file, nothing visible to a singer.
- **Outside the tree:** `opencv-python-headless` 5.0.0, installed in step 3, for the oracle only.
- **Lines:** `underlay-frame.ts` 410, `underlay-words.ts` 233, `underlay-seat.ts` 225; each under 1,000.

## 3. Each measurement

### Functions and tests

| File | Signature | Tests |
|---|---|---|
| `underlay-seat.ts` | `seatTokens(tokens, notes, rule): Seat[]` (unchanged signature; every rule seats on free notes) | 59 (+4) |
| `underlay-words.ts` | `sewWords(seats): Word[]`; `writeLyrics` unchanged | 42 (+10) |
| `underlay-frame.ts` | `frameRow(crop: GreyBandLike, staffSpace: number, options?: FrameOptions)`; new `closingKernel(staffSpace): number`, `CLOSE_SHARE = 0.1` | 33 (+4) |

### Gates, before and after (eight, run in this clone)

| Gate | After step 3 (and its amendment) | After step 4 |
|---|---|---|
| `pnpm test:phonology` | 291 passed (291) | 291 passed (291) |
| `pnpm test:dictionary` | 248 passed (248) | 248 passed (248) |
| `pnpm --filter @ilya/web check` | 0 errors, 12 warnings, 5 files | 0 errors, 12 warnings, 5 files |
| `pnpm --filter @ilya/web test` | 3210 passed (3210) | 3228 passed (3228): +4 seat, +10 words, +4 frame |
| `pnpm --filter @ilya/score-parser test` | 775 passed, 5 skipped (780) | 775 passed, 5 skipped (780) |
| `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| `pnpm ratchets` | OK | OK |

### Amendment 1: free notes

Expectation (written before the run): only the tests that encode "a tied note takes a token" fail, and the cross-check holds. Likeliest failure: `order`, whose grouping looks up the bar of each token's nearest note, changes its grouping when `nearest` changes.

Result: exactly two tests failed (the drifted-token test of lines 72 to 78 and the all-tied test), both updated as Fable wrote: notes 100, 200, 300 (tied into), 400 with tokens at 100, 200, 310 give `[10, 11, 13]` under `nearest`, `monotone`, and `order`; all notes tied into gives every syllable `unseated` with `by: null` under all three rules. I added: a note under an extender is left alone by `nearest` and `monotone`; and a case where `order` pairs tokens that `nearest` crowds onto one head, which only passes if the tie and the extender are counted out of the bar before pairing.

The likeliest failure did not occur, because I kept `order`'s bar lookup on the nearest of ALL notes (`staff`, as Fable said) and only its fallback and its sung list use the free notes. That is a choice Fable's text does not state (section 4).

Cross-check (`xcheck.sh`, `xcheck-step1.txt`), 1,500 seeded rows, 4,500 seatings in each of two modes:

- **plain** (no `tiedInto` passed, so every note sings): 0 differ from `score44.py` unchanged. Fable's claim that "the cross-check sets no flag, so it must still print 0 differ" holds for this mode.
- **free** (the flags passed): 0 differ from the harness's rules on the free notes only (`xcheck_seat_gen.py` has a copy of `step1c.py`'s `cands='free'`, with rule 2's bar grouping from all notes). My generator does set the flags, in the old run, for rule 2; so a single run would not have printed 0, and I split it into the two modes. Rule 3 with more tokens than free notes is checked against a brute force of the least total distance; 478 of the 1,500 rows are that case, and 39 tokens in the rest are unseated because no note sings.

Mutants (`spec-seat.json`, `mutants-seattokens.txt`): 36, all killed. The new ones: a tied note a candidate for every rule; a note under an extender a candidate; `xs` taken from all notes; monotone on all notes; no free note and the syllables seated anyway; `by` not null with no free note; `order` counting a tied note, or an extender note, as sung. Two of those survived the first run (`order` counting a tie or an extender as sung) because every test fell back to `nearest` on free notes and got the same answer; the crowded-head test above kills them.

### Amendment 2: no letter dropped inside a word

Expectation: Fable's three tests pass as written. Likeliest failure: the unseated token's text goes to the wrong syllable (section 4).

Result: «пе-» (100), «чаль-» (200), «ны-» (250), «е» (300) on notes 1, 2, 3 under `monotone` give one word, «пе» begin, «чаль» middle, «ные» end, on notes 1, 2, 3, and «ны-» is the one `unseated` token. «и» (150) unseated between two one-syllable words gives two words and no «и». Two seats on one note under `nearest` give one syllable of the two texts in x order («суе»). The fixture test: a word written «пе», «чаль», «ные» comes back from `collectScoreWords` with `raw` «печальные» and three slots, though it holds four vowels. More tests: an unseated token that ends a word goes into the last syllable («куха»); an unseated token that opens a word and ends in a hyphen is held and put before the syllable that continues it («ные»); a whole unseated word is merged into neither neighbour; a held token nothing continues is left out; a lone hyphen between two tokens on one note stays inside the syllable and does not glue the next word; pending text at the end of the seats goes into the last syllable.

Mutants (`spec-words-language.json`, `mutants-words-language.txt`): 37 (29 for `sewWords` and `writeLyrics`, 8 for `rowLanguage`), all killed. First run: `oneToANote`'s choice of the nearer seat survived because it is dead code (below), and "pending text not flushed at the end" survived for want of a test; I removed the first and added the test.

### Amendment 3: the closing kernel

Expectation: at 30 the closing tests hold as written; at 60 a 4 px gap closes and a 5 px one does not; at 12 a 1 px gap stays open. Likeliest failure: the float `0.1 * 30` reads as 2.999... and gives kernel 1 at the measured staff space.

Result: all three hold. `0.1 * 30` is 3.0000000000000004 in floating point, so the plain rule would have worked at 30, but not by design: I add `1e-9` before the floor so that no exact multiple of 10 can fall under its tenth. `closingKernel` is exported and tested at 0, 5, 12, 19.9, 20, 29, 30, 31, 40, 49.9, 50, 60, 100 (kernels 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 5, 5, 9) and for NaN, Infinity, and a negative value (all 1). `filter3` is now `filterK`, a centred window cut at the edges; a test shows ink against the left and top edges stays ink and paper beside it does not turn to ink. The oracle passes a staff space of 30 and keeps its 3 by 3.

Mutants (`spec-frame.json`, `mutants-frame.txt`): 29, 27 killed. The new ones, all killed: a fixed kernel of 3, the share 0.2, an even kernel, no floor of 1, rounding up to the next odd, and a window whose outside counts as the opposite value (my first version of this mutant ignored the outside, which is OpenCV's rule and so equivalent; I corrected it). The two survivors are the same as in step 3: the sweep's negative angle first on an exact tie, and the sweep's 120 px padding against the crop's height, neither killable on any input I built.

### The harness reading of the frame oracle

Fable found the oracle was written from the desk's text and not from the harness's code. The recovered `clean.py` is not readable here; I took its three settings as the task states them. They are an option set in `xcheck_frame.py`; `frameRow` is not changed for them.

Expectation: the harness reading differs from `frameRow` on rows whose paper is not white (the border) and on rows with noisy paper (the padding's grey). Likeliest failure: a difference I did not anticipate.

Result (`xcheck-frame.txt`, `attrib-frame-harness.txt`), 200 seeded synthetic rows, 8 with no ink, paper tones 176, 200, 240, 255 and noise of 0 to 8 grey levels:

| Reading | Rows differing in size, or by more than 1 grey level in more than 0.5% of pixels | Of those, size | Angle differs |
|---|---|---|---|
| the text reading (as step 3) | 3 | 0 | 3 |
| the harness reading, all three settings | **143** | 6 | 3 |
| rotation border white only | 102 | 6 | 3 |
| sweep padded 120 px only | 3 | 0 | 3 |
| paper tone after the scale only | 73 | 0 | 3 |

The 3 in the first row are the angle ties of step 3. The white border differs wherever the paper is not white and the rotation uncovers a corner: `frameRow` fills it with the paper tone, the harness with 255. The 120 px sweep padding changes nothing, as in step 3. The paper tone after the scale differs from the tone before it by a few grey levels on noisy paper, which is the colour of the padding.

**The 6 size mismatches are a finding about the paper tone, not about the harness.** On those rows the most frequent grey of the crop is the solid ink, 0, because the synthetic paper is noisy and spread over many grey values; `frameRow` then fills the rotated corners black, which counts as ink, and the ink extent and the scale come out wrong (a 64 by 95 framed crop where the white-border reading gives 152 by 267). A white border does not have this failure. Whether a real scan's paper is ever less frequent than its ink at the 256-bin level is NOT ESTABLISHED; the synthetic noise is mine. It is worth a look in 2b, as is the choice of border.

## 4. Departures from Fable's text

| Departure | Reason | Reversible |
|---|---|---|
| Amendment 2(a): an unseated token inside an open word is merged into the NEXT syllable of the word when its hyphen says the word goes on, and into the LAST syllable only when the word ends at it. Fable's text says it is merged into the open word's last syllable | Fable's own test expects «пе», «чаль», «ные» on notes 1, 2, 3, which needs the forward merge («ны» into «е»); merging into the last syllable would give «чальны». The word's `raw` is «печальные» either way | Yes: one branch in `sewWords` |
| Amendment 2(b): `oneToANote` does not "keep the nearer seat's note" | Every seat in a group has the same note by construction, and `sewWords` reads no offset, so the choice was dead code (a mutant proved it). It joins the texts and keeps the first seat's fields | Yes |
| `order`'s grouping still takes each token's bar from the nearest of ALL notes | Fable says keep `staff` for the `bar` lookup. Its fallback and its sung list use the free notes | Yes |
| The seat cross-check has two modes (plain, free) | One run could not both match `score44.py` and the free-note rule | Yes |
| `closingKernel` adds `1e-9` before the floor; a non-finite or non-positive staff space gives 1 | Exact multiples of 10 must not read as 2.999...; a caller's bad value must not throw | Yes |
| `frameRow`'s signature gains `staffSpace` as the second argument, a breaking change | As Fable wrote. There is no other caller in the tree | Yes |
| An unseated syllable that opens a word and ends in a hyphen is held for the next syllable (and left out if nothing continues it) | Fable's "hold the text and prepend it to the next syllable that opens a word only if that next token continues it" | Yes |

## 5. What I could not establish

NOT ESTABLISHED beats a complete invented answer.

- **That 0.1 is the right share.** Row 117 (kernels 2, 3, 4, 5 at one resolution: +8, +38, +31, +32) is Fable's number, quoted; I did not check it. The finding in section 1 says what the rule does at the harness's own staff spaces; whether kernel 1 at 27 to 29 px costs syllables is unmeasured.
- **The harness's real `clean.py`.** I cannot read `/root/measures`. The harness reading is the task's three settings; whether `clean.py` also differs in the rotation centre, the mask interpolation, or the closing border is NOT ESTABLISHED, as in step 3.
- **That the free-notes rule reproduces the desk's 1,836 and 1,955 nucleus counts.** I have no scans; I checked the rule against the harness's rules on synthetic rows.
- **How often a whole unseated word occurs on real pages.** Section 1 of Fable's text leaves it to 2b; `sewWords` drops it without a count, and the seat list holds it as `unseated`.
- **What `seatScoreWords` does with a merged syllable.** I proved `collectScoreWords` (three slots, four vowels, one raw word). I did not run `seatScoreWords` or the page, so the withholding that Fable describes at `score-seat.ts:137-139` is read from Fable's text, not run.
- **The paper-tone failure on real scans** (section 3).
- **Rounding of the 2 and 98 percent extents against the harness's floating-point comparison,** as in step 3.

## 6. The files

Changed under `apps/web/src/lib/omr/`: `underlay-seat.ts`, `underlay-seat.test.ts`, `underlay-words.ts`, `underlay-words.test.ts`, `underlay-frame.ts`, `underlay-frame.test.ts`.

Under `docs/sessions/measure-n135-stage2a_2026-10-27/`: `xcheck_seat_gen.py`, `xcheck_seat.mjs`, `xcheck-step1.txt` (the two modes); `xcheck_frame.py`, `xcheck_frame.mjs`, `xcheck-frame.txt` (the text and harness readings); new `attrib_frame_harness.py`, `attrib-frame-harness.txt`; new `kernel_by_staff_space.py`, `kernel-by-staff-space.txt`; `spec-seat.json`, `spec-frame.json`, `spec-words-language.json` and `mutants-seattokens.txt`, `mutants-frame.txt`, `mutants-words-language.txt`, `mutants-cutrows.txt` (re-run, 25 of 25 killed).

Stopping, as asked.
