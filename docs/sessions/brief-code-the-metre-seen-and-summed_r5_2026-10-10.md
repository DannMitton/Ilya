# Brief for Code: the printed metre, round 5: a reader that abstains on a shape it does not know (r5, 2026-10-10)

Written by the desk (Opus) 2026-10-10 about 23:58, after reading `report-code-the-metre-seen-and-summed_r3_2026-10-10.md` (round 4's report) whole. **Revised 2026-10-11 about 00:10 after an independent review by Fable (four must-fix, six should-fix, and four minor findings, all taken).** For Code on the Mac, Opus. QUEUE row 57. **r5 builds on round 4's harness, kept at `docs/sessions/measure-metre-r57-r4_2026-10-10/`.** r4's sections "Dann's design", 1, and "Constraints", and r2's sections 4 to 7 as amended by r4, stand except where this brief amends them. Every amendment is listed in the last section but one.

## Why

Round 4's reader read 24 of 32 printed signatures and stated nothing false at any of the 814 bar starts on the 17 songs. It failed on renders of fonts it never saw: 43 false signatures in 5,100 staves, 38 of them in Finale Ash, Finale Broadway, and Finale Jazz (report, section 3). In each case it met an unfamiliar figure, or lost or added a digit, and stated a signature with confidence (Ash's thin 1 lost from 13/4; Broadway's 8 read as 2; Jazz's 7 read as 1; a stray 1 added to 3/4). A singer's edition set in an unfamiliar face meets the same fault. **This round's work: when the reader has not seen a shape, it says nothing.**

## 1. What to build and train

Round 4's models and render pool are gone (report, "Files"). **Train two networks once each, both with the added fonts of 1.2, and measure every other variant at decode time.** Include the pool rebuild in the time estimate.

1. **Network A** as round 4's (32 by 32 crop at 10 pixels a space). **Network B takes a different input** (12 pixels a space, or a 40 by 40 crop; your choice, stated), so its errors are less tied to A's. The two together may reach 1.5 MB (this amends r4 section 2.1's 1 MB line, a DESK DEFAULT).
2. **More shapes in training.** Add **every** font with an SIL Open Font License file found under `/Library/Fonts`, `~/Library/Fonts`, the Homebrew font casks, and `apps/web/static/fonts`, never a selection. Read each licence file and list it in the report. Use the boldest upright weight and lining figures. Text fonts add digits only, as training variety (r2 section 3.1's "no text font" is amended for training only; its reason stands, so the rendered test stays on music fonts). Say how the folds hold out more than ten fonts, and report the original ten fonts' counts in their own table.
3. **Training renders stay as round 4's.** The test renders change (section 2.3).

## 2. The witnesses at decode time

1. **Agreement.** A reading is one decoder run at a grid offset of −0.1, 0, or +0.1 of a space, and a scale of 0.95, 1, or 1.05: nine readings a network. **A signature is stated only when every reading names it. A reading of nothing is disagreement.** State the inference cost per window.
2. **Three cheaper checks, each set inside the fold:**
   - **Unfamiliar shape.** A mark whose penultimate-layer features lie farther from the training crops than the tuning set's chosen quantile is no answer.
   - **Uncovered ink.** Ink in the signature's rows within 1.6 spaces that the stated marks do not cover voids the statement (catches 13/4 read 3/4, and 3/4 read 13/4).
   - **C against cut C** is decided by a column ink profile through the glyph's middle; when unsure, nothing is stated.
3. **Witness 5, the bars that follow. The rule, a DESK DEFAULT, the same on songs and renders:** a proposal is stated only when at least one governed bar is countable under r2's bar rule (after the tuplet checks run under the proposed metre) and every countable bar sums to it. A proposal with no countable bar is not stated.
   - **The songs.** Read the 17 songs through the drop box on the dev server, current build (homr-web `0.2.0-ilya.6`), keeping each page's reading so a signature's page place matches homr's note places (`placeOf`, `join-pages.ts`). A scratch script that imports the pipeline is allowed; nothing in `apps/` changes for it. State the minutes per song. Then measure configuration 2 as r4 section 2.3 asked: proposals witness 5 rejected, how many were right on the page, and beaming's agreement (measured, never used to decide).
   - **Witness 5's measured power.** At each of the 814 real bar starts, propose each wrong metre from the rendered false list and count how often the real bars reject it. Report it as witness 5's power on real pages.
   - **The renders, SIMULATED.** Render each test staff, with or without a signature, followed by bars in the metre in force. Damage each bar by drawing from the per-bar distribution of homr's sum over the printed length measured on the fold's training songs, with the share of bars the bar rule leaves out, and draw the number of governed bars from those songs (1 and up). **Label every such count SIMULATED.** Count false by window, not by staff.
   - **Swaps of the same length.** Bar sums cannot tell C from 4/4 from 2/2 from cut C, 3/4 from 6/8, 2/4 from 4/8, 3/2 from 6/4, or 6/4 from 12/8. **Under configuration 2, each such swap counts as false by construction.** C stated for a printed 4/4, or the reverse, is false: a stated sign is the printed sign.

## 3. The bar

- **The songs: 0 false signatures** at the 814 bar starts and the 32 printed places, under the configuration you would wire.
- **The renders: 0 false under configuration 1.** Or, if configuration 1 cannot reach 0: **0 false under configuration 2 SIMULATED, and configuration 1 at or under 10 false with no font above 3** (a DESK DEFAULT; configuration 2 counts on renders because a singer's page always has bars after its signature, and round 4's renders had none).
- Recall: right out of 32, by song and configuration. False single figures are reported and do not fail the round.

## 4. Keep the measurement honest

- **Choose the variant on tuning data and the earlier seeds, and write the choice down before the final count.** The variants are decode-time only: A alone, A with shifts, A and B with shifts, each with and without the checks of 2.2 and witness 5. Change 1.2 without change 1.1, or the reverse, is not measured.
- **Then draw fresh render seeds once.** Report every variant on them; only the written choice counts. **A fresh count other than 0 ends the round. No second draw.**
- Every change made after looking at a result is listed, as round 4 listed them.
- Cuts, tolerances, quantiles, and damage distributions are set inside each fold, from its tuning songs and tuning renders only (r4 section 2.2).
- Grechaninov stays out of reach (no staff on its grey scan). Do not spend time there.

## 5. Then

As r4 section 4, with section 3's bar:

- **0 false and at least 16 of 32:** build r2's section 4 on the written choice, with section 2.3's rule for witness 5, and meet r2's "Done when" as amended by r4. Gate 4 is now `2088` (`~/Downloads/ilya-ship.sh`). Stop before the ship.
- **0 false and 5 to 15 of 32:** stop and report.
- **Otherwise:** stop and report. Nothing wired.

## Constraints

- **Never open, read, list, or run anything whose name begins `heldout2`.** Songs A, B, C, E, and F are not opened or run.
- **No git command that writes:** not `add`, `commit`, `stash`, `checkout`, `restore`, `reset`, `worktree`, or any other. To read old code, use `git show <sha>:<path>`.
- **Keep the scratch where it survives:** page images, the render pool, crop sets, models, and probability files go in `~/Downloads/_code-metre-r5/`, never in `/private/tmp`. Round 4 lost round 3's labels that way. Nothing large goes in the tree; the harness, labels, and per-fold results go in `docs/sessions/measure-metre-r57-r5_2026-10-10/`.
- If training, tuning, the pool rebuild, and the drop-box reads together would take more than about three hours on the Mac, stop and report the estimate first (a DESK DEFAULT).
- Nothing in `apps/` changes unless section 5's first case holds.

## Earlier lines amended by this round

- r4 section 2.1, "Above 1 MB, stop": 1.5 MB for both networks together.
- r4 section 2.3, configuration 2 "measured on the 17 songs only": also measured on renders, SIMULATED.
- r4 section 3, renders counted under configuration 1 only: section 3 of this brief.
- r4 "Dann's design", tie-breaker, "not contradicted by 5": replaced by section 2.3's rule.
- r4 "Constraints", about two hours: about three hours.
- r2 section 3.1, "no text font": text-font digits allowed in training only.

## Report back

`docs/sessions/report-code-the-metre-seen-and-summed_r4_2026-10-10.md`: the answer first; the written choice; every variant on the fresh seeds, by configuration, songs then renders, with SIMULATED on its face where it applies; witness 5's measured power; the fonts added and their licences; what was built or why not; and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set QUEUE row 57 in one line ahead of its earlier state, say so in one line, and stop.
