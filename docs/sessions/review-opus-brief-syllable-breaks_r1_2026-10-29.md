# Review: brief-n135-syllable-breaks_r1_2026-10-29 (Opus, standing in for Fable, 2026-10-29)

Read only. Code at `cloud-lane-21` `5ee29ec2`; rulings at `wt-shane`. My scripts, `scratchpad/rev-sb/an.py` to `an9.py`, ran on `replay/out-real/d6db949a/` with A2's scorer; their figures are estimates. "Drift neighbourhood", "honest ceiling", and "false fold" are my coinages; "token", "fused unit", "vowelless alone", and "noise floor" are adopted.

## Verdict

**REDESIGN.** Phase 0 is worth running only after amendments 1 to 4 rewrite what it measures.

## Lead finding

Once the classification is checked, F1 to F3 together reach at most about 33 of the 425 syllables (about 1.3 points of 2,538), F4 rescores nothing because the scorer already credits a fused unit, and F1 is the rule the 2026-10-28 harness already measured as a net loss at every threshold. The 425 are mostly alignment drift and a missing syllable that the "close" test files as "run together", so the brief aims four fixes at the smallest part of the loss.

## Spot-check of the brief

Reproduced exactly: `splits2.py` gives the table's eight rows and 425; the per-song "matching neither" figures (P 41, B10 32, B06 32, and so on) match once its 2-to-1 and 1-to-2 entries are summed. 1,880 + 425 + 198 + 35 = 2,538 (`an9.py`). (b) 1,710, (a) 1,870, (c) 640 from `sc/d6db949a`.

Right: `cutUnits` at `underlay-units.ts:38`, the one-vowel pass at `:47`; `foldClitics` at `underlay-clitics.ts:87`; `cliticCalls` at `underlay-seams.ts:57`; `seatCliticFolds` at `+page.svelte:2868`; `UNDERLAY_READER` at `omr/stamp.ts:47`.

Wrong:
- `vowelsPerNote` is in `omr/vowels-per-note.ts:65`, not `omr/underlay-counts.ts` (imported at `underlay-page.ts:34`, called at `:223`).
- The switch is `omr/underlay-switch.ts`, not `underlay-switch.ts`; `underlayOn` is at about `:26`.
- `scripts/splits2.py` is at `/mnt/user-data/outputs/splits2.py`, not in any `scripts/`.
- `real7.mjs` is not in `replay-scripts_2026-10-29.tgz`'s list (`rs/replay-scripts/README.md`, "What is in here", names `real.mjs`). It is in `replay/scripts/`.
- The brief places the stand-in "between `seatPage` and `joinPages`". `applyUnderlay` sits between them (`real7.mjs:22-23`), and see amendment 6.

## Amendments

### 1. Section 1: the table misfiles a missing syllable as "run together"

Evidence: `splits2.py` tests `close(t, a+b)` before `close(t, a) or close(t, b)`. So a token that is one syllable alone, close to the pair only because it is long, lands in "a letter or two wrong". `an3.py`: of the 86 "run together, a letter or two wrong", 74 match one of the two syllables alone at a ratio of 0.75 or more («без|от» read «безъ», «на|чер» «чер», «враж|ды» «враж», «в|них» «них»). 28 are at least two letters shorter than the pair. Only 12 are true merges («то|бой» «тобсй», «гѣ|мір» «гѣмірс»). The brief's own example «на|чер», «чер» is a missing syllable.

Replace the table's second row and the sentence after the table with:

> | two syllables, one token close to both and to neither alone | 12 | U4: то\|бой, «тобсй»; P: гѣ\|мір, «гѣмірс» |
> | two syllables, one read (close to it alone), the other missing | 120 | U4: на\|чер, «чер»; U1: без\|от, «безъ»; U5: в\|них, «них» |
>
> The test order is: letters right; close to one syllable alone; close to both; neither. (Phase 0 re-derives these with that order.)

### 2. Section 1: the 202 "matching neither" are measurable now, and are mostly drift

Evidence, `an.py` and `an7.py`. Of the 182 two-to-one "matching neither", 166 sit in a drift neighbourhood (three or more of the six groups beside them are also not read right). 50 are tokens equal to a printed syllable within six places (the right syllable, paired with the wrong place). 62 are tokens of one letter or none after `norm`. 14 pair two printed syllables from different rows. So the brief's DESK INFERENCE is largely right, and is now partly measured: these belong to the letters and the row framing, not to syllable breaks. The brief's question, "are some two syllables, one token groups an unread syllable beside a read one, or drift?", has the answer yes to both: 120 (amendment 1) and at least 166.

Replace the last two sentences of section 1's closing paragraph with:

> Measured by the review (`an.py`, `an7.py`): 166 of the 182 lie in a drift neighbourhood (three or more of the six neighbouring groups also not read right), 50 are tokens equal to a printed syllable within six places, 62 are tokens of one letter or none, and 14 pair syllables across a row break. They go to the reader review (row 158) and the row framing. Phase 0 reports each figure per song.

### 3. Section 3: state the honest ceiling, and strike F4

Evidence for the ceiling. F1: of the 33 one-to-two groups with a vowelless piece, joining gives the printed syllable in 15 (`an4.py`); 5 of the 21 "letters right" are already one unit, not two tokens («С Я», «В се», «в новь,», `an.py`), which F1 cannot touch. F2: 4 syllables («бог|с», «тясь|в», `an2.py`). F3: 6 where the truth puts the pair on one note («в|ти», «въ|тре», «въ|гре»), plus 8 in T and K, whose poem gives no note. Total about 33 of 425, before any harm.

Evidence against F4. The read-right scorer splits every token at any run of non-letters between letters (`common2.py:137-139`, `split_internal`), U+00A0 included: `split_internal('в ти')` returns `['в', 'ти']` (run this session). On today's replay, 58 pieces of fused units already pair one-to-one and score right, and 3 score wrong (`an2.py`). The per-note score compares the joined letters of the note's units with the truth note's text (`score_app.py:83`, `credits.py`, `joined`), and the truth files fuse the clitic on one note: no truth note in the SEAT songs is a vowelless syllable alone (0 of 2,385, `sc/d6db949a`), and U4's «вти» already earns (b) (per note 60). So "today the scorer counts a fused clitic unit as a miss of two printed syllables" is false for both scorers. The truth files agree with §0.1's fused unit. Changing the scorer is legitimate in principle (`OPEN.md:2879`, *"it is there to align with our need and not vice versa"*), but here there is nothing to change. What the read-right scorer cannot see is a clitic fused to the wrong host, because it splits the unit before aligning; only the per-note score sees that.

Strike F4. Insert before F1:

> **Ceiling, measured by the review:** F1 at most 15 syllables, F2 at most 4, F3 at most 14: about 33 of the 425, 1.3 points of 2,538, before harm. Row 114's goal (9 of 10, `OPEN.md:2874`) needs about 400 more on these songs. These fixes are worth building only because they are cheap and follow §0.1, not for their yield.
>
> **No rescoring.** Both scorers already credit a fused unit: read right splits it at U+00A0 (`common2.py:137-139`), and the per-note score joins a note's units (`score_app.py:83`). Phase 0 reports, beside read right, the per-note (b) figure, which alone sees a clitic on the wrong host.

### 4. F1: drop it, or narrow it to the 15 and test it against the misread «и»

Evidence: F1 is the rule of the 2026-10-28 report's Simulation 2 (join a one-consonant box to a near neighbour), which loses at every threshold: net -5 at 0.5 up to -25 at 1.25 (`report-desk-n135-token-splitting_r1_2026-10-28.md`, section 5). Simulation 1 shows why a gap threshold fails: boxes of separate printed syllables touch or overlap ("B02 p1s3r1"). The brief also aims F1 at "much of the 79 vowelless alone". `an5.py` says otherwise: 36 of the 79 pair one-to-one with a printed syllable that has a vowel («тень» read «тнь», «дев» «дгв», «ли» «лн»). They are whole syllables with a misread vowel, on their own note. Joining them to a neighbour empties a printed note and puts two syllables under one note, the error §0.1 names. Eight of the 79 are a lone «н», «п», or «ц»; DESK INFERENCE, to check on the crops: several are the one-letter vowel word «и» misread, and F1 would fuse a real word. Three of the 79 are real clitics printed alone («в», «б»), which step 4 left because the transcription did not call them, and three have no printed syllable.

Replace F1's text with:

> **F1. A one-letter piece of a split syllable rejoins it (narrow, and last).** Only where all hold: the piece has no vowel letter; it and its neighbour came from one reader word box, or their boxes overlap; and the joined text, sewn into its word, passes `seams.isWord` where the piece alone does not. Never for a piece whose own box pairs with a note no other unit takes (it may be a misread vowel, «н» for «и»), and never across a row. Phase 0 counts F1's changes on the 36 vowelless-alone units that are misread vowelled syllables, and F1 goes no further if any of them is joined. Ceiling 15 syllables. The 79 vowelless alone are not F1's target.

### 5. F2 and F3: one rule, keyed on the sewn word and the dictionary, with the pre-reform clitics

Evidence:
- F2's guard cannot be met as written. `cliticCalls` returns one call per row word, found by the word's whole letters (`underlay-seams.ts:57` onward, `lettersOf(h.cleanWord) === own`). The «с» inside the token «богс» is not a word, so the transcription never calls it.
- F3 names no guard, and its trigger is common. 132 syllables read right on today's replay start with «в», «к», or «с» and a consonant («взор», «сто», «ску», «вда», «сквозь», `an8.py`). 55 read right end in one («как», «прав», «лик»).
- The printed vowelless syllables include «въ» (10), «съ» (5), and «ль» (1) beside «в» (30), «с» (6), «к» (3), and «б» (2) (`an6.py`, 57 in all). F2 and F3 name «в», «с», «к» only.
- §0.1: enclitics never line-initial and only a terminal syllable's partner. «ж» and «б» must never move forward.

Replace F2 and F3 with one fix:

> **F2. A clitic glued into a syllable is cut out and fused to its host (§0.1).** On a sewn word that fails `seams.isWord`: where its first letters are «в», «к», or «с», with or without «ъ», and the rest of the word passes, write the clitic and the first syllable as the fused unit (clitic, U+00A0, syllable) on the same note («вти» → «в ти»). Where its last letters are one of those and the next word on the same row passes with the clitic in front, move the clitic to the next word's first unit with U+00A0 («богс то» → «бог», «с то»). Never «ж» or «б» forward; never across a row; never on a word the dictionary accepts. No note changes: the unit keeps its note, and the moved clitic joins a unit that already has one. Every unit still has exactly one vowel letter (`underlay-units.ts:24`, «й» a consonant), or the change is dropped. Ceiling 18 syllables.

THE LIMIT (`OPEN.md:2853`) keeps "where words break into syllables" as printed. The print has a word break here that the reader lost, so this restores the print. Say so in the brief.

### 6. Section 4: Phase 0 cannot run as a word rewrite after `seatPage`

Evidence: `real7.mjs:22` calls `seatPage`, which seats inside itself: `cutUnits` at `underlay-page.ts:191`, `foldClitics` at `:195`, `seatTokens` at `:207`, `sewWords` at `:221`. F1 and F2 change units before seating. A rewrite of `res[i].words` afterwards would have to re-seat by hand. `real7.mjs` imports `underlay-page.ts` by path (`:13`), so a copy works.

Replace item 2's "as a stand-in between `seatPage` and `joinPages` in a copy of `real7.mjs`" with:

> as a stand-in inside a copy of `omr/underlay-page.ts`, between `foldClitics` (`:195`) and `seatTokens` (`:207`), with a copy of `real7.mjs` importing that copy (`real7.mjs:13`); the tree is never edited. Positive control first: the copy with no fix reproduces 1,880 / 1,710 / 1,870 / 640 / 79.

Replace item 5 as the 2026-10-29 second-look review did (its amendment 8): the captures hold `data.json` and `musicxml.xml` only (`a2/a2/app/U4/p1/`, listed this session), and `~/Downloads/...` is on Dann's Mac. Item 5 is the desk's, with the PDFs it renders itself.

### 7. Section 4: the held-out design and the gate do not fit 33 syllables

Evidence: F2's ceiling is 4 syllables over 18 songs. Halved, a held-out half sees about 2. F1 has one threshold, and amendment 4 removes it. "Under one in ten of its changes" is decided by one harm in a dozen. The noise floor of +6 to +19 recorded in the stage 2b review is a reading noise floor; the replay is deterministic, so a gain of 3 is real but small.

Replace the decision gate with:

> **Decision gate for Dann:** a fix goes to Phase 1 only if, over all 18 songs, its changes that made a syllable worse are none, or are each listed with song and bar and accepted by Dann one by one; its changes that made a right syllable wrong are none (a right syllable spoiled costs more than a wrong one left); and it creates no vowelless unit on its own note and no unit with two vowel letters (`vowelsPerNote`, `vowels-per-note.ts:65`, run after the fix). Gains are reported in syllables and per song. No held-out split: the fixes have no threshold left to fit, and the samples are too small to split. Row 114's sealed songs remain the final test before shipping.

### 8. Section 4: measure the existing false fold, which the brief does not name

Evidence: 8 of the 56 one-to-two groups are a single unit the reader split and step 4 then fused as a clitic: «С Я» for «ся», «В се» for «всё», «хо ж.» for «хож», «в в "ѣ» for «чат» (`an.py`). A fragment the transcription took for a clitic gets a no-break space it should not have, against §0.1's fused unit.

Add to item 2:

> Also count step 4's false folds: units holding U+00A0 whose joined letters equal one printed syllable with no clitic in it. Report them per song; their repair (join without U+00A0) is part of F1.

### 9. Section 6: correct the cross-site list

Replace "`vowelsPerNote` and step 7's counts (`omr/underlay-counts.ts`)" with:

> `vowelsPerNote` (`omr/vowels-per-note.ts:65`, called at `underlay-page.ts:223`) and step 7's counts (`omr/underlay-counts.ts`, `manyVowelsInUnits` `:47`, `manyVowelsMerged` `:52`)

and add `seatTokens` (`omr/underlay-seat.ts:156`), which seats the changed units.

## Better design, ranked

1. **Recommended: measure first, fix one narrow rule.** Amendments 1 and 2 as a desk measure tonight (no helper; the scripts exist). Then F2 as amendment 5 rewrites it, with amendment 8's count, through Phase 0 as amendment 6 sets it. Cost: about 18 syllables, the clitics shown as §0.1 wants. The loss stays with the reader review.
2. **As drafted:** cost: four fixes for at most 33 syllables; F1 lost on 2026-10-28; F4 rests on a false premise.
3. **Drift first:** a look at the 166 drift-neighbourhood syllables and the 120 missing ones. They are the largest share of the 425, and they are the reader's. Cost: no change to seating now.

DESK INFERENCE, not measured: under option 3, most of the drift starts at a single missed or extra token and spreads across a row, so repairing one token can bring back several syllables.

## NOT ESTABLISHED

- Whether the lone «н», «п», «ц» are misread «и» (amendment 4): the crops decide.
- Whether «вти» on one note and «в ти» on one note give different IPA. If not, F2's head half changes what the Text view and the scorer see, not what the singer sings.
- How many of the 120 "one missing" are a syllable never read and how many are a token placed on the wrong row.
- Whether the truth files of T and K fuse clitics as the SEAT songs do: they carry no per-note truth here.
- Whether an `isWord` check on sewn fragments of a misread word lets F2 fire wrongly; Phase 0's harm list decides.
