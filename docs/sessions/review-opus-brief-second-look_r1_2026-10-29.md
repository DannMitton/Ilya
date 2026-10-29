# Review: brief-n135-second-look_r1_2026-10-29 (Opus, standing in for Fable, 2026-10-29)

Read only. Code at `cloud-lane-21` `5ee29ec2`; rulings at Shane `1ee2c0aa`. Every line cited was read this session. My measures (`scratchpad/rev-sl/an.py`, `flag.py`, on `replay/confusion.json` and `replay/out-real/d6db949a/`) are crude estimates that Phase 0 replaces.

## Verdict

**REDESIGN** the rule. Phase 0 is cheap and worth running once amendments 2, 6, 7, and 8 rewrite it.

## Lead finding

The brief says "the same tiers, with no poem", but they are not the same tiers. Stage 3's tier 1 takes its target word from an independent source, the poem. Here the search generates the target, so a repair is only as right as the confusion table is calibrated, and the table counts errors without counting how often each read letter is right. On today's replay that turns the confusion-twin flag into a mark on 117 of 1,603 sewn words, 59 of them for т→г alone, where a read «т» is a printed «г» about 2 times in 100. The flag fails the brief's own gate and, in substance, `CONTRACT.md` §8.

## Spot-check of the brief against the tree and the evidence

Every file:line in sections 1, 6, and 9 and the dictionary bytes check out. `total.py` on `sc/d6db949a` reproduces 1,880 / 1,710 / 1,870 / 640 / 79 on 2,538 printed syllables, and 198 + 425 + 35 + 1,880 = 2,538. Section 3's counts match `confusion.json`.

Two notes:
- The figures are at `d6db949a`, not `5ee29ec2`. `git diff --stat` between them over `omr/`, `underlay-seams.ts`, and `pipeline.ts` is empty; say so.
- Dann's 16:12 words are not in `INBOX.md` at `1ee2c0aa`; cite the live file.

## Amendments

### 1. Section 2: name the premise instead of claiming identity

Evidence: OPEN.md stage 3 item 6, tier 1, requires "the poem's aligned word passes" and "the alignment is confident at that spot", and sends "A garble made only of real Cyrillic letters" to tier 3. With no poem, nothing about the target is independent of the read word. Ruling N.178 item 1 (15:22): *"Guessing is not a modality."*

Replace the heading and its first paragraph with:

> ## 2. The design: a narrower tier 1 with no poem
>
> When a poem is present, stage 3 governs and nothing here applies. With no poem, the target word is not given: the module proposes it from the read word, the confusion table, and the dictionary. That is weaker evidence than stage 3's tier 1, which has an independent target. So this design is narrower than tier 1: it repairs only where Phase 0 shows the proposal right at the gate's rate, held out (amendment 6), and it never marks a word the dictionary accepts (amendment 3).

### 2. Section 3: the table must be a calibrated channel, not an error list

Evidence, from `confusion.py` lines 20 to 31 and my `an.py` on `confusion.json`:
- (a) The table counts only syllables that were read wrong, so it has no base rate. Over the same one-to-one alignments, a read «т» is a printed «г» about 1 time in 50 (0.020), «н» for «и» 0.027, «е» for «с» 0.026, and «ъ» for «ь» 0.12 (correct reads counted from the same alignments).
- (b) 9 adjacent pairs (18 syllables) are syllable-boundary shifts: «ког|да» read «ко|гда» (6), «тос|кой», «дос|тью», «вес|тит», «ис|тра», «чувств|от». The word is read right and only the break moved. These shifts account for 6 of the 7 "г dropped" and 3 of the 5 "с dropped".
- (c) 70 of the 198 pairs are deletions or insertions only. Stage 3 rules that "the confusion list holds substitutions only, never deletions".
- (d) 19 pairs have an edit cost over 0.5 («ся»→«ом», «ко»→«ж», «я»→«зі»). These are alignment fillers, not misreads.
- (e) The 425 split or merged syllables are excluded, so the table samples the easier errors only.

The difflib count is sound for equal-length blocks. It records an unequal block as one pair (ы→ът), which is acceptable once (b) to (d) are removed.

Replace section 3's body with:

> From Phase 0, a JSON file of pairs, each with three counts: printed x read as y; y read where y is printed; and every y read. It is measured on one-to-one aligned syllables of the build songs, never on row 114. Excluded: adjacent pairs whose concatenations agree (a moved syllable break, not a misread); pairs whose edit is a deletion or insertion only (stage 3: substitutions only); and pairs whose alignment cost exceeds 0.5. The repair uses P(printed x | read y) = count(x as y) / count(read y), never the raw error count. A pair seen fewer than 3 times in the training songs is not used (DESK DEFAULT). The table is per reader version (row 105).

Strike "and г dropped 7" from today's counts.

### 3. Section 2, the flag: strike it from phases 1 to 3 until it is measured with a precision floor

Evidence: my `flag.py`, which applies the brief's flag rule to every sewn word of `out-real/d6db949a`, with the ≥3 pairs, at most two swaps, the dictionary plus `singer-supplement.json`, and a candidate vowel count equal to the word's note count. It gives 117 flags on 1,603 words (7.3 percent), over the brief's one in twenty. The commonest flags are «то» (19), «ни» (8), «со» and «та» (6 each), and «том» (5). 59 of the 117 are explained by т→г alone, which is right about 1 time in 50 (amendment 2). `CONTRACT.md` §8: "a mark that appears on everything says nothing". This is my estimate (my own fold and modern form); Phase 0 measures it.

Replace the **Flag** bullet with:

> - **Flag: not built in phases 1 to 3.** A word the dictionary accepts is left as read. Phase 0 item 3 measures the flag. It returns to the design only if Phase 0 shows, on held-out songs, a rule under which a flagged word is truly wrong at least 1 time in 3 (DESK DEFAULT, Dann's to change) and the flag rate is under 1 word in 20 per song. Candidate evidence, measured and not assumed: P(printed x | read y) above a threshold, and the same printed word read two ways in one song. Dann's "flagged by its context" is answered by the poem where one exists (stage 3 tier 3); with no poem, the only context claimed is the song itself.

Where both the read word and the candidate fail, the tie ("two or more candidates tie") is left as read and counted, not flagged.

### 4. Section 2, the repair: never on fragments or short pieces

Evidence: the same run makes 61 unique-candidate repairs. 30 of them yield a word printed in the same song, and 31 do not, including «ва»→«за» (3), «оо»→«об» (2), «ско»→«окб» (2), «тель»→«гель» (2), «бовъ»→«бозъ» (2), and «еменъ»→«смены». DESK INFERENCE: most are fragments of split words («бовъ» from «любовь»), which reach the module as words because it runs after `sewWords` (`underlay-page.ts:221`). The whole-word check undercounts correct fragment repairs, so the true split is NOT ESTABLISHED.

Add to the **Repair** bullet:

> The read word has at least 3 letters (as `ocr-guard.ts:37`), and every syllable of it was seated on a note. Phase 0 reports repairs on words of 1 and 2 letters apart, and whether a repaired word lies beside a split or merged alignment.

### 5. Section 2, evidence 3, and section 6: repair letters in place; never re-cut

Evidence: THE LIMIT keeps "where words break into syllables". `writeLyrics` writes the print unmodernised (`underlay-words.ts:13-17`); `makeSeams` uses the modern form for lookup only (`underlay-seams.ts:36`). A folded clitic joins its host with U+00A0 (`underlay-clitics.ts:10-11`; §0.1), and `lookupStress` strips punctuation, not spaces (`engine.ts:703`), so a fused unit fails the dictionary whole. An и/й swap changes the vowel count (§0.1, «й» a consonant).

Replace evidence 3 with:

> 3. **Notes, per syllable.** Swaps are applied inside each seated syllable's own text. A swap never crosses a syllable break, the break stays where the reader put it, and `syllabify` is never called on the result. Each repaired syllable holds exactly one vowel letter (`CONTRACT.md` §0.1, «й» a consonant), or the candidate is dropped. The dictionary test splits a fused unit at its U+00A0 and tests the host alone; the clitic and the no-break space are carried through unchanged. The test uses `seams.isWord`; the syllable keeps the print's pre-reform letters, punctuation, and capitals. A ь↔ъ swap changes the sound (a soft consonant against a silent sign), so it falls under THE LIMIT's condition: it repairs only where Phase 0 shows it right at the gate's rate.

### 6. Section 5: hold the songs out, or the yield is fitted

Evidence: with the ≥3 pairs and at most two swaps, the in-sample table reaches 71 of the 198 misread syllables. Built leave-one-song-out, it reaches 50. B01 to B10 may share one printed source (brief §10).

Add to section 5, before item 1:

> **Held out.** Every yield, repair, and flag count is measured leave-one-song-out: the table for song L is built from the other 17 songs, then applied to L. B01 to B10 are also run as one group held out together, in case they share a source. The in-sample figure is reported beside it, for comparison only, and never decides the gate. Row 114's sealed songs are the final test, after Dann's yes to Phase 1 and before it ships.

### 7. Section 5, the gate: in Dann's units, with every denominator named

Evidence: the 2026-10-27 witness made 138 replacements. 72 could be judged (40 right, 32 wrong, 7 of those overwriting a right word) and 66 could not (`report-desk-n135-note-witness_r1_2026-10-27.md`, D1k outcomes row). "Under one in ten" leaves the 66 undefined and does not count Dann's unit, necessary corrections. A quiet wrong repair costs more than a word left wrong, because the underline says it was fixed.

Replace the decision gate with:

> **Decision gate for Dann after Phase 0, all figures held out:** necessary corrections = printed syllables not read right after the second look. A repair that changes a right syllable counts twice (DESK DEFAULT): the correction, and the trust it spends. Build Phase 1 only if (a) necessary corrections fall by at least 20 over the build songs (above the noise floor of +6 to +19 recorded in the stage 2b review, amendment 8); (b) of the repairs that can be judged, fewer than 1 in 10 is wrong; (c) unjudgeable repairs are under a third of all repairs, or are sampled by hand to 30 and reported; and (d) no repair changes a syllable's vowel count. Each threshold is a DESK DEFAULT and his to change.

### 8. Section 5, items 5 and 6, and the paths: not runnable from what the helper has

Evidence: the captures (`a2/a2/app/<song>/p<n>/`) hold only `data.json` (`layout`, `staves`, `reads`, `langs`) and `musicxml.xml`, and `find` returns no image file under `a2/`. Item 5 needs the page's pixels, and item 6 needs eyes on the print. The `~/Downloads/` paths are on Dann's Mac. Items 1 to 4 are runnable: `real7.mjs` loads the real dictionary in Node (`setStressDictionary` and `setSingerSupplement`, lines 5 to 9) and calls `seatPage` then `applyUnderlay` (lines 22 to 23), so a `secondLook` stand-in can rewrite `res[i].words` between those two calls, and `score_app.py` then scores the result.

Replace item 5's opening with:

> 5. **Letter-check feasibility: a desk task, not the helper's.** It needs the 18 build PDFs rendered at the reader's resolution and each row's `transform`. The captures hold neither.

Make item 6 a desk task with the same reason. Replace every `~/Downloads/...` path with the cloud paths of the unpacked archives, as in `rs/replay-scripts/README.md`'s variables, plus one sentence: insert `secondLook` between `seatPage` and `applyUnderlay` in a copy of `real7.mjs`; never edit the tree.

### 9. Section 6: answer the precondition question the brief left open

Evidence: no hand-or-not fact exists (`pairings.ts:119-128`). The stamp bump is right: `isCurrent` compares by equality (`restore.ts:40-41`) against `READER_STAMP+UNDERLAY_READER` with the switch on (`underlay-switch.ts:36`). Stage 3's departing condition re-tests hand words when the reader changes and "offers, never applies". Where a mark would be stored is unsaid, and `CONTRACT.md` §8 allows only R8's glyph and the stamped reading.

Replace the last sentence of section 6 with:

> Phase 1 does not wait on stage 3's precondition (a), because it marks nothing: behind the switch, it writes the repaired text into the reading (which is stamped and stored as the scan's reading is, `CONTRACT.md` §8) and reports counts on the reader's console line only. The dotted underline, the receipt-line count, and any per-word Revert wait on precondition (a), and are built with stage 3's tier 1 surface, not before. `from` and `evidence` are never stored; a mark recomputes them.

### 10. Section 9: three more sites, all before the repair

Evidence: `rowLanguage` and the known share (`underlay-page.ts:181-188`), `foldClitics` (`:195`), and `vowelsPerNote` (`:223`) all run before `secondLook` would.

Append to section 9:

> - **`rowLanguage` and the known share** (`underlay-page.ts:181-188`) judge the row before repair. A repair never changes which rows are Russian, and the console's known share is reported before and after the repair.
> - **`foldClitics`** (`:195`) ran on the unrepaired letters, so a repaired clitic is not folded again. Phase 0 counts how many repairs touch a vowelless word.
> - **`vowelsPerNote`** (`:223`) counted breaches before the repair. It is run again after the repair, and any new breach drops that repair (amendment 5).

### 11. Section 8 and the order of work: Phase 0 goes stale when the split row lands

Evidence: 425 of the 658 misses are splits and merges (brief §0), and amendment 4 shows that the repair's worst cases are fragments those splits leave behind.

Append to section 8's first bullet:

> Phase 0 runs now because it is cheap, and runs again on the reader that results after the split row lands, before any Phase 1 brief.

## Better design, ranked

1. **Recommended:** amendments 1 to 11. That leaves a repair only: words that fail the dictionary, are 3 letters or more, and are seated whole, swapped in place, calibrated, gated held out, and console-only in Phase 1. Cost: no flag for now, and a likely yield of tens of syllables (reach is 71 in-sample and 50 held out, before the dictionary filter).
2. **As drafted:** cost: about 7 percent of words flagged, mostly wrongly.
3. **The split row first:** cost: no repair now, but it attacks the larger loss and removes the fragments that make repair risky.

DESK INFERENCE: trigrams rank candidates and cannot supply the missing base rate. Phase 0 item 4 decides.

## NOT ESTABLISHED

- The true repair and flag precision: my figures are a whole-word check and a letter-level base rate.
- Whether a re-read under a new `UNDERLAY_READER` replaces Lyrics text the singer edited by hand.
- Whether B01 to B10 share one printed source.
- How often a word read differently in two repeats of one song is a misread, the candidate context signal in amendment 3.
- Dann's 15:56, 16:01, 16:08, and 16:12 words, which are not in INBOX at `1ee2c0aa`.
- The trigram table's size.

NOT ESTABLISHED beats a complete invented answer.
