# Brief for Code: the printed metre, round 4: a trained classifier, judged by signature (r4, 2026-10-10)

Written by the desk (Opus) 2026-10-10 about 03:10; revised 03:20 after an independent review by Fable (findings 1 to 11, all taken), and again 03:30 after Fable's second review (three should-fix and three minor findings, all taken). For Code on the Mac, Opus. QUEUE row 57. **r4 replaces r3's sections 2 and 3.** r2's sections on the singer, the rulings, section 4 (the rule and the join's order), the constraints, and "Done when" stand, **except the lines amended at the end of this brief.**

## Why

Rounds 2 and 3 used template matching: ten open fonts rendered with degradations, then these editions' own figures. Neither met "0 false figures" (`report-code-the-metre-seen-and-summed_r1_2026-10-09.md`, `_r2_`). Two things were never tried:

1. **A trained classifier** in place of nearest-template matching.
2. **Judging by whole signature.** In round 3, the configurations with 0 false signatures on rendered and real pages read 2 and 4 of 32 printed signatures (report r2, lines 82 to 83 and 149). The best recall, 6 of 32, came with 19 false signatures on the rendered set, so it is not the baseline. **The baseline under this round's bar is 4 of 32.**

## The ruling

Dann, 2026-10-10 03:02, asked whether row 57 is judged by signature rather than figure by figure: *"Whatever works reliably."* **The desk reads this as: the bar moves to signature level (a DESK DEFAULT, reversible).**

## Dann's design, 2026-10-10 02:49 to 03:08

- **Placement.** A metre sits immediately right of the clef and key signature at a system's start, or immediately right of a barline mid-piece. Look only there.
- **Courtesy metres** are recognised and set aside; the next system restates them. Gould places them *"at the end of the first system, after the last barline"* (p. 152, `claude/opus-memo-e16-gould-metre-tuplets-verified_2026-07-27.md` §A, in the claude.ai Project). Front 3a decision 1 already specifies this window, and that the start print wins on disagreement (`claude/fable-spec-e16-front3a_2026-07-27.md`).
- **The reading model** (Dann, 03:11): *"Perception plus semiotics plus expectation plus logic plus corroborating evidence in the rhythmic structures that follow."* Five witnesses, applied in this order (the order and the tie-breaker are a DESK DEFAULT):
  1. **Perception** sees the mark: the classifier.
  2. **Semiotics** says what the mark means: heavy upright figures filling the window are metre; italic figures are tuplet numerals (Gould pp. 152, 193). Together, 1 and 2 **propose** a reading.
  3. **Expectation** filters it: placement and persistence until a change. Common metres are **a weight, never a gate** (r2's ruling; `OPEN.md:2761`): report how often an uncommon metre was stated, but never reject one for being uncommon.
  4. **Logic** rejects what cannot be true: a lower figure outside 1, 2, 4, 8, 16, 32; a top of 0.
  5. **Corroboration** from the bars that follow confirms: bar sums first, **summed after the tuplet checks run under the proposed metre**, with r2's bar-rule exceptions (r2 section 4's order; report r1, lines 168 to 173), so a bar of triplets homr dropped never vetoes a right figure. **Beaming counts as a weak witness only, never a deciding one:** Gould notes Classical and Romantic music often uses the "wrong" 3/4 beaming (verified memo, header; p. 153 per `plan-scan-reader_r4_2026-10-01.md:93`).
  - **Tie-breaker.** A metre is stated only when the proposal survives 3 and 4 and is not contradicted by 5. Any disagreement left is reported as unsure in the console and the report only (r2: no mark, flag, or word on the page or the Loupe this round), never resolved by guessing. Bar sums inherit homr's dropped triplets, so 5 alone never states a metre.
  - Section 2.3 measures this model against the glyph alone.
- **Staves may disagree** in some 20th-century songs. **This round reads the voice staff only.** Do not build cross-staff agreement.

## 1. The training set

**The unit.** The classifier labels one mark: a figure 0 to 9, C, cut C, or not a figure. A signature is two figures stacked in one window (top over bottom), or one C or cut C. Two-digit tops (10 to 16) are two figure marks side by side above the bottom figure. A lower figure outside 1, 2, 4, 8, 16, 32 is no answer (r2, "Done when").

1. **Rendered.** The ten fonts round 2 used, from `/Library/Fonts`: Bravura, Leland, Finale Maestro, Finale Engraver, Finale Broadway, Finale Ash, Finale Jazz, Finale Legacy, Petaluma, Sebastian. Licences as read in report r1, lines 62 to 65; Petaluma and Sebastian taken as given there. Codepoints `timeSig0` to `timeSigCutCommon`, U+E080 to U+E08B. Render each class on a five-line staff, in context: clef, key, signature, first notes, and mid-bar after a barline. Apply round 2's degradations, plus scale, stroke weight, and shape jitter aimed at these editions. **Set the jitter ranges inside each fold, from that fold's training songs only.** **The missing figures 0, 1, 5, 7, and 9 come from here.**
2. **Negatives.** Round 2's 2,051 seated scan marks, round 3's 2,609 labelled non-figures (clefs, key signatures, accidentals, notes, rests, unsplit pairs, C halves; report r2, line 41), and rendered tuplet numerals. Gould calls tuplet numerals italic (p. 193) and time-signature figures *"a unique heavy font"* (p. 152). These editions' figures are about 1.5 spaces tall (report r1, line 146), the same as tuplet numerals, so height alone cannot separate them. Mixed-metre forms (Gould p. 179, + or hyphen) are negatives only: the join holds one metre (report r1, line 166).
3. **These editions' figures.** Round 3's labelled crops: 39 printed signature pairs and 16 signs, 94 figure marks (report r2, lines 39 to 43).
4. **Not used:** anything whose name begins `heldout2`, opened or not. A, B, C, E, and F are not opened or run this round.

## 2. The classifier and the measurement

1. Small enough to run in the singer's browser. The app already runs onnxruntime-web (`homr-reader.ts`); an ONNX model is acceptable. Your choice of method; say what and why. Report its byte size. **Above 1 MB, stop and report before wiring** (a DESK DEFAULT).
2. **Held out song by song.** Each of the 17 songs is read by a model that never saw that song's figure crops or its non-figure marks. **The confidence cut that turns a score into a stated signature is also set inside each fold**, never from all 17 songs' results.
3. **Two configurations, both measured:**
   - **Configuration 1: witnesses 1 to 4.** The classifier reads each allowed window, with placement, persistence, and the lower-figure rule.
   - **Configuration 2: witnesses 1 to 5.** Configuration 1 plus corroboration. Report the count of proposals witness 5 rejected, and of those, how many were right on the page. Report how often beaming agreed or disagreed with the stated metre (measured, not used to decide). Row 61 tried "a metre from sounding bars" and took it out because it changed sealed song I; this configuration states nothing the glyph does not confirm, and it is measured on the 17 songs only.
4. **Grechaninov** caps recall at 30 of 32, since no staff is found on its grey scan (report r2, line 117). Do not spend time there.

## 3. The bar

**0 false signatures anywhere:** rendered (configuration 1 only, since rendered examples have no following bars to sum), the 32 printed places, and every other bar start on the 17 songs. False single figures are reported but do not fail the round. Recall: signatures right out of 32, by song and by configuration.

## 4. Then

- **If either configuration gives 0 false signatures and at least 16 of 32** (a DESK DEFAULT: half the printed signatures, four times the baseline): build r2's section 4 on the better one and meet r2's "Done when" as amended below. Stop before the ship.
- **If 0 false signatures and between 5 and 15 of 32:** stop and report. The desk and Dann decide whether it is worth wiring.
- **Otherwise:** stop and report. Nothing wired.

## Constraints

As r2. **Never open, read, list, or run anything whose name begins `heldout2`.** No git command that writes. Inside each fold, the jitter ranges and the confidence cut may be tuned on one fixed random split of that fold's training songs. If training and tuning together would take more than about two hours on the Mac, stop and report the estimate first (a DESK DEFAULT, not a measured limit).

## r2 lines amended by this round

- r2 section 6, "The templates load as `tuplet-digit-templates.json` does … Nothing goes into `static/`": **amended.** The model loads only when a bar is in doubt or a signature place is read. It may live beside homr's models under `/omr/models/` if that is how onnxruntime-web loads it; say where and why.
- r2 "Done when", "with 0 false figures": **amended to 0 false signatures.**
- r2 "Done when", "A, B, C, E, F once": **struck for this round.**
- r2 "Done when", the test "a lower figure outside 1, 2, 4, 8, 16, 32 is no answer": stands.

## Report back

`docs/sessions/report-code-the-metre-seen-and-summed_r3_2026-10-10.md`: the training set by class and source, the method, section 3's tables by configuration first, then what was built or why not, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set QUEUE row 57, say so in one line, and stop.
