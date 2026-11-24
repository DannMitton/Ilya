# review-fable-plan-n204-r7_r1_2026-11-23

Review of `plan-code-audit-maintainability_r7_2026-11-23.md` (md5 `4d9b7088`, confirmed by `md5sum` this session) against r6, the research report, and this reviewer's own review of r5. Read by Fable 5.2, 2026-11-23, on the brief `brief-fable-review-plan-n204-r7_r1_2026-11-23.md`. Read-only: this file is the only thing written. No source file was opened.

Terms coined by this reviewer: "stop report class", "frozen area map". Every other term is adopted from the plan, the research report, or the r5 review.

## Verdict

**ADOPT WITH AMENDMENTS.** Four blockers and twelve amendments.

The sequence of r7 (instruments, model, likely changes, read, map, shape, choose, lanes, re-measure, documents) is sound and this review does not reorder it. The blockers are about the document, not the sequence. r7 replaced section 5 and the header and left every other section as r6 wrote it, so the plan now carries the struck design and the new one side by side, and the replacement of section 5 removed things that had nothing to do with what Dann struck.

### Blockers

1. **Six sections of r7 still instruct the machinery that Dann struck at 20:45, and done-when item 11 cannot be met.** By line diff, r6 lines 4 to 99 equal r7 lines 10 to 105, and r6 lines 216 to 331 equal r7 lines 198 to 313, byte for byte. Only the header and section 5 changed. What that leaves in a plan that `STATE.md` says governs:
   - Section 3, r7 line 56: "**The shape of the whole is designed, never derived.**" followed by "the framework is designed from Ilya's capabilities (phase 1a), the unit reads test it against real code (phase 1b)". That is the opposite of the ruling in r7's own header. Line 55 has tiers 2 and 3 moving toward a framework "provisional at phase 1a and settled at phase 1c".
   - Section 6, line 201: the order of phases 1a step 1, step 2, step 2b, step 3, 1b, 1c, 4a. Line 224: "No unit runs during phase 1a step 2".
   - Section 7, lines 232 to 235: cost lines for the scout, the two pre-read drafts, and phase 1c, and a design total built from them.
   - Section 9 item 7, line 263: tasks written "before phase 4a and after phase 1c".
   - Section 9 item 11, lines 270 to 274: requires that "the framework was drafted twice independently, from an ungrouped list carrying no paths or code names", that "every judgement the desk made at step 2b was reviewed at phase 1c", and that the stay count is "filed at phase 1c". None of those events exists in r7, so item 11 is unmeetable as written.
   - Section 10, lines 289 and 297, and the closing section, line 311 ("the framework test of phase 1b (section 5)").
   `CONTRACT.md` section 8: "Do not write a step into a brief that permits what Dann asked to be rid of." A desk or a helper that reads section 3, 6, or 7 without the header meets the struck design as live instruction. **Repair.** Rewrite each of the six against the ten steps. Item 11 becomes: the model is filed with his words marked as his; the two shapes of step 6 and their comparison are filed; the framework of step 7 names its version and its reviewer; every file is placed or stays with a reason; the stay count is filed at step 7 and at close; and the tree-state clause stands as it is, pointed at step 10's generated module map.

2. **Replacing section 5 removed the measured baseline and the working rules that the rest of the plan still cites.** All of this was in r6 lines 100 to 215 and none of it concerns designing before reading:
   - **Phase 0's numbers.** 134,671 lines in 552 files, 34,439 comment lines, 127 citing a line number, 142 tests that read source as text, the hotspot ranking, and the ceilings. r7 cites them as "section 5" at lines 21, 41, 52, 263, and 278, and section 5 no longer holds them.
   - **The duplication census.** The seventeen facts by finding number, the ratchet that holds the count, and Dann's ruling of 2026-11-19 15:2x. Done-when item 8 measures against "its phase 0 figure" and step 3 starts its list from "the seventeen facts", with no place in r7 that lists them.
   - **The baselines defined.** r6 named what the behaviour baseline contains, that it is built at the base commit and run twice to prove it deterministic, and what the performance baseline measures. Step 1 keeps the two names and drops both definitions. Done-when item 3 rests on them. Two keep-list entries also fell out: old-shape readers and `routes/notation-font-lab/`.
   - **What a unit read returns.** The shape of a finding (anchor name, smell, refactoring by name, tier, risk, proving test), the paragraph a developer needs, the hidden relationships, the comment census per unit, the permission to run code and mark the claim "ran", and the two rules for every subagent brief. Done-when item 5 needs "the sum of the unit censuses". Step 4 says "Unchanged" and then states none of it.
   - **Phases 2 and 3.** Findings become lanes ordered so no file is edited by two lanes at once; Fable reviews the lane plan before any lane starts; Fable reads each lane as built; tier 3 runs on the Mac; a tier 1, 2, or 3 step that would change behaviour is stopped and reported. Section 7 line 236 still costs the as-built reviews that no step now asks for.
   - **The in-house glossary.** Dann's words of 2026-11-19 15:31, what `names.ts` and the Names table already cover, the rule that a lane giving a fact one home writes its glossary line in the same commit, and the test that pins the glossary. Step 10 names the glossary and nothing defines it.
   **Repair.** Restore these as a section of their own, unchanged in content, and repoint the five "section 5" citations. A deliberate removal is named as one in the header.

3. **Steps 6 and 7 keep the name of the two-draft method and none of the conditions that made it informative, and nobody is named to choose or to review the framework.** Detail under question 1. In short: both readers of step 6 receive the model and the mapping, and the model's grouping into has, shows, and depends is the desk's by its own account (`OPEN.md`, "WHAT ILYA DOES FOR A SINGER: THE MODEL", "What is the desk's inside this"). That is the shared prior of r5 blocker 1 in a new place. Step 6 states no comparison rule, so agreement between the two shapes can again be read as evidence. Step 7 says "Choose the framework" with no chooser, and no Fable read of a design the desk derives, which `CONTRACT.md` section 1 item 19 requires before it ships. Step 7 prices no move, so r5 blocker 4 part (c) is gone. **Repair.** (a) Name the two readers and what each receives. (b) Carry the comparison rule forward, written before either shape is opened: agreement on a generic layer settles nothing; agreement that reproduces the model's own boxes is recorded as agreement with a shared input; a shared departure from both the present tree and the model is the finding with the most weight. (c) Each reader answers the four probe questions of r6, which need no change to be asked after the read. (d) The desk judges differences with reasons, and one Fable read reviews those judgements before step 7 binds. (e) A move's cost is counted in the four things r6 named: importers, tests that read the file as text, `CONTRACT.md` section 8, and ratchet headroom.

4. **The fallback of step 1 does not hold, because none of the three measures has a fixed unit.** Step 1 says that if the graph cannot be trusted, "the Parnas count carries the weight alone". Three faults. (a) The Parnas count is "how many modules each change would touch", and r7 never says what a module is. If it is a file, the count rises when files are split. If it is a module of the framework, the unit differs between the first count and the last. So line 130's claim that it "survives the file-count trap of step 1 entirely" is not supported; the research says only that it is independent of a dependency graph (report 2.9). (b) The commit-log measure counts "components", also undefined, and needs no graph, so the fallback sentence contradicts the paragraph above it. (c) The count cannot be taken at step 3, because where a decision lives is unknown for the eleven unread units. **Repair.** Before any measure is taken, fix the unit for all three: a frozen area map of the base commit `b2869772`, file to top-level area, where a file made by a later split inherits its parent's area. Report every measure at two grains, the file and the frozen area. Freeze the scenario list at step 3. Take the first Parnas count on the base commit after step 4, with a path per scenario as evidence, and the last at close by the same protocol. The research asks for this in its own words: "hold the unit of analysis fixed" (report section 3, lead 3), which r7 dropped.

### Amendments

1. **State what step 5 does when there is no graph.** A reflexion model needs a source model extracted from code (report 2.1, "Input needed"). r7 gives a fallback for step 1 and none for step 5. The honest fallback is already in the plan: step 4's third question yields a hand-made table of crossings, and the mapping runs on that. Say so, and say that a hand-made source model finds only what a reader noticed.
2. **Give the trust test for the graph.** "Trustworthy" has no test in r7. Suggested: run the tool on the files of units d, g, and h, and compare its edges with the imports and hidden relationships those three filed reads record. List the known blind spots beside the result: the 142 text-reading tests and every entry on the keep-list.
3. **Say what step 5 adds to step 4, and give its stopping rule a meaning.** Detail under question 3.
4. **Repair the reversal condition.** Detail under question 4: classes for a stop report, a judge other than the lane, a defined "part", one report sufficing when it shows a contradiction, and a second trigger from step 9.
5. **Say that nothing waits on Dann at steps 2 and 3.** The model is "Awaiting his ruling" and step 3's input is "Dann's and briefly his". r7 does not say whether the eleven remaining reads wait. State: the model at its current draft is what the reads use; the desk drafts the list of likely changes from the seventeen facts and `PRODUCT.md`; he sees it once, as one message, to strike or add. The four examples in step 3 carry no attribution; mark whose they are.
6. **Name the model as a hypothesis and give its path.** r7 says the model was drafted from `PRODUCT.md` and does not say it is filed in `OPEN.md` (line 4531 at this reading). The model holds five dependency rules ("What may depend on what") written before the read. As the thing step 5 tests, that is what the method asks for. As the target of step 7 it would be the design before the read that he struck. One sentence in step 2 and one in step 7: the model is compared against, never implemented, and a framework at step 7 that equals the model is flagged for a second look.
7. **Define the boundary in step 4's third question, and settle the back-fill.** "Which imports ... cross a boundary" had a referent in r6, the framework's boundaries. In r7 no framework exists during the read. Name it: the model's boxes and its five rules, and the present top-level folders. Say whether units a, b, d, g, and h owe the four questions, at what cost, and that a and b need a short return to the source, as r6 established.
8. **Correct the claims that outrun the research.** Detail under question 5: eight items.
9. **Cost the new steps and strike the dead ones in section 7.** No line prices step 1's tool trial, step 5's mapping, step 6's two readers, the look at comparable projects, the review that step 7 needs, or the stranger's verdict taken twice. "What it costs is one Fable session" for a reopening is not quoted from an actual and omits the cost of moving files a second time. `CONTRACT.md` section 4: estimates come from actuals, and a first of its kind is marked as one.
10. **Give "the contrast with better" a method.** Step 6 names Dann's own step and gives it no projects, no reader, no cost, and no test of "better". The research obtained no source that argues feature against layer and studied no comparable project (report section 8, item 11). Suggested test, from the plan's own instrument: an organization seen elsewhere is better for Ilya when it lowers Ilya's Parnas count on the frozen list. His words were "until one makes sense for ILya", which describes more than one pass; say how many are costed.
11. **Tier 1 and tier 4 do not "wait for none of this".** Done-when item 3 holds every lane to the behaviour baseline, which step 1 still owes. They wait for that baseline and for nothing else. The first stranger's reading is "on the tree as it stands on 2026-11-23", and tier 1 lanes may merge before it is commissioned; pin it to commit `b2869772`.
12. **File his words of 2026-11-23.** A grep of `docs/memory/` for distinctive strings from the 20:45 and 20:49 quotations returns nothing, and `INBOX.md` has no line dated 2026-11-23. On that evidence the rulings r7 rests on are recorded only in r7's header. `CONTRACT.md` section 1 item 20 asks for `INBOX.md` at the least. Two smaller points of record: step 5's opening refers to "his sequence of 20:49" and the sequence is in the 20:45 quotation; and step 9 says "after each phase" in a plan that no longer has phases.

## The seven questions

### 1. Did anything the four r5 blockers protected get lost?

Yes, from blockers 1 and 4, and one thing from amendment 10. Blockers 2 and 3 are carried, with one gap each.

**Blocker 1 protected the meaning of agreement between two drafts. Lost.** r7 step 6 says the two readers "work from the same full evidence and their disagreement is informative". That is true of disagreement and was never in question. What blocker 1 protected is that agreement is read correctly, and r7 has dropped all three guards.
- The shared input is back. Both readers hold the model, whose grouping the desk names as its own, and the mapping made against it. Two readers who return the model's boxes as modules have agreed with the desk.
- The comparison rule is gone. r6 step 2b scored the drafts against a rule written before either was opened. r7 has no rule.
- The probe questions are gone. The header says "what survives of them moves to step 6" and step 6 does not state them. They are worth more after the read than before it, because a reader can now answer them from evidence.
- A new exposure that r5 did not have: both readers have read reports organized by the present tree, so both may return the present tree, tidied. The 20:45 ruling accepts reading first, and nothing in this review reopens that. The counterweights are the ones r7 already holds, and they need to be pointed at step 6: the Parnas count on each candidate shape, the comparison's separate report of where both shapes match the present tree, and the stay count.

**Blocker 2 protected the definition of the list everything stands on. Carried, in a better form, with the grain split in two.** The model has an author (the desk, from his words), inputs from the product, his corrections marked as his, and a completeness test. The decision grain that blocker 2 asked for now lives in step 3's list of likely changes, and the feature grain lives in the model. That is a sound division. Two gaps: the completeness test now runs from the code side only ("if a real part of Ilya has no box"), where r6 also tested from the singer's side against GUIDE and LEARN headings; and the glossary, which in r6 was the capability list, now has no stated grain (blocker 2 above restores its section).

**Blocker 3 protected Dann from being the gate. Carried in `STATE.md`, not stated in r7.** `STATE.md` records the rule among the four things struck that night. r7 step 2 ends "Awaiting his ruling" and does not say the reads proceed. Amendment 5.

**Blocker 4 protected two things: that the framework is priced, and that the tree is tested, not the table.**
- The stay count is carried, at step 7 and at close.
- The tree-state clause survives in done-when item 11, inside an item that cannot be met as a whole (blocker 1 above).
- The import graph now comes first, at step 1.
- **The cost of a move is lost.** Step 7 places every file "or stays where it is with a written reason" and counts nothing. The reversal condition catches a move that cannot be made; it does not catch a framework chosen without knowing what its moves cost.
- The other direction, a framework the code cannot be moved into, is handled better in r7 than in r6, by the reversal condition.

**Amendment 10 of the r5 review is lost.** r6 had phase 1c, a Fable read that could overturn the desk's judgements. r7 has no review between the two shapes and the binding choice.

### 2. Does step 1 survive its own NOT ESTABLISHED?

In part. The step is right to admit the gap and right to carry measures that fail differently. What r7 says it does if the graph cannot be extracted is one sentence, and that sentence does not hold, for the reasons in blocker 4. Three further points.

- **More than step 1 rests on the graph.** Step 5 needs a source model (amendment 1). Done-when item 4 needs `knip`. Item 11's closing clause needs the layering ratchet to express dependency rules, which section 10 already lists as NOT ESTABLISHED.
- **There is no test of trust** (amendment 2). Without one, the plan cannot tell a graph that failed from one that passed.
- **The commit-log measure is thin.** The research read the abstract of its source only and says "Do not rely on this entry for more than the existence of the measure", and that whether Ilya's commit history is clean enough is NOT ESTABLISHED (report 2.6). r7 names the measure and carries neither caveat.

What survives if the graph fails outright: step 4's hand-made crossings, the Parnas count once its unit is fixed, the duplication census, the stay count, and the stranger's verdict taken twice. That is enough to run the audit and to show a before and an after. It is not enough to report a modularity figure, and r7 would say so in step 1.

### 3. Is the partial mapping sound, and does the stopping rule mean anything?

**The partial mapping is faithful to the method.** The research reports that a map may cover only the parts of interest (2.1) and that the one long use left inconsistency uninvestigated where it did not bear on the task (2.2). r7 is also right that the full read and the partial mapping are different things.

**Two problems with it as written.**
- **Step 4 already maps every file.** Its second question asks, per file, "which of the model's capabilities live here", and the answer is a per-file table. The model's own header says "every one of the 552 source files lands in one of these boxes or lands nowhere". So the map from file to box is complete by the end of step 4, and what is partial in step 5 can only be the reading of arcs: convergence, divergence, and absence against the model's five rules. r7 does not say this, and a reader could take step 5 as permission to leave files unplaced, which step 7 then forbids.
- **Sufficiency in the source is relative to a task.** The task here is choosing a framework for the whole tree. "Stops when it stops surprising us" names no task, no expectation, and no person who decides.

**"Stops when it stops surprising us" is not operable as written.** Surprise needs a prior on the page. A rule that does the same work and can be checked:
1. The order is fixed in advance: the hotspot ranking, then every area that holds a decision on step 3's list.
2. Before each area, the mapper writes one line predicting what the arcs will show.
3. The mapping stops when two consecutive areas produce no divergence of a kind not already listed and no change to the list of likely changes, and never before the ranked hotspots and the listed decisions are covered.
4. The stop is filed with the areas left unread for arcs, and either reader at step 6 may ask for one of them.
The figure of two is this reviewer's suggestion and has no source.

### 4. Is the reversal condition real?

**The mechanism is real and the threshold is arbitrary.** A commitment point with a stated way back is a true repair, and naming the framework's version in every lane brief does work. The count of three has no source and no denominator.

- **A lane cannot tell a framework fault from its own, and r7 removes the question instead of answering it.** "A lane that cannot be carried out as the framework says is a finding about the framework, not a failure of the lane" settles by declaration what needs a judgement. There are at least four causes, here called stop report classes: (1) the framework contradicts itself or the code, for example a placement that forces a cycle or a file that serves two modules; (2) a prerequisite is missing; (3) the move is blocked by cost: a path fixed by `CONTRACT.md` section 8, a text-reading test, or ratchet headroom; (4) the lane's own error.
- **Step 8 makes class 2 the expected first result of every attempt.** Its discipline is "attempt the change, discover what it demands, record the prerequisite". Under step 7 as written, three ordinary prerequisite discoveries reopen the framework.
- **"The part of the framework they touch" is undefined.** Three reports across three modules and three in one module are different evidence.
- **Three can be too many.** One class 1 report that shows a contradiction is enough to reopen.
- **Only infeasibility triggers it.** A framework that every lane can carry out and that improves nothing is not caught. Step 9 re-measures and attaches no consequence.

**Repair (amendment 4).** Every stop report names its class and its evidence. The desk classifies, not the lane. One class 1 report reopens step 7 for the module it names. Class 2 is recorded as a prerequisite and reopens nothing. Class 3 becomes a stay with its reason and raises the stay count. Three unresolved reports of any class against one module reopen it, which keeps r7's number where it does work, as a backstop. A second trigger sits at step 9: a Parnas count on the frozen list that has not fallen after the tier 2 lanes of a module reopens that module. The cost line for a reopening includes the files already moved.

### 5. Is r7 faithful to the research?

Mostly, and it is candid about depth in section 3a. Eight places claim more than the report supports.

1. **Step 1, the Mozilla sentence.** r7: the authors "needed paired comparisons for exactly this reason", the reason being that a figure falls as file count rises. The report (2.3) says the authors noted that the fall in clustered cost came partly from fewer files. The measure is clustered cost and the file count fell. The size sensitivity r7 describes is from Pisch et al. (2.4, read in part), and its application to file splits is marked as the researcher's inference (section 3, "Where it bites Ilya (inference)").
2. **Step 1, "THE RESEARCH'S MOST USEFUL FINDING".** The report's section 6 does call it that. Its parts are an authors' caveat plus an inference; r7 presents the whole as a finding.
3. **Step 1, the figures 17.35 and 2.78.** From the working paper. The report warns the published article may differ and was not obtained.
4. **Step 3, "the one source of the twenty-eight that carries real weight".** The report's limits for Parnas: one small example and the author's "subjective judgment". The weight is the desk's assessment and the sentence would say so. "Better than any dependency metric for Ilya" and "survives the file-count trap ... entirely" are also the desk's, and the second is wrong as it stands (blocker 4).
5. **Step 5, "the only solo precedent recorded anywhere".** The report says the only one in this set of literature, and names a second, weaker one. Its source is a technical report, not peer-reviewed as filed, read in part.
6. **Section 3a, "the two that carry the weight ... are among the three read whole".** Step 5 is the method the report calls the best fit, and both of its sources were read in part. The sentence gives a firmer picture of the reading than the report does.
7. **Section 3a and step 6, Foote and Yoder "on piecemeal growth".** The report says it did not read the Piecemeal Growth or Keep It Working sections in full. What it read is Shearing Layers, Sweeping It Under the Rug, and Reconstruction. Cite those.
8. **Step 8, the discipline kept after the Mikado name is withdrawn.** Withdrawing the name is correct. The four clauses that remain are the ones the report labels "Desk knowledge, unverified" and asks not to be cited as read. r7 presents them as the desk's own description, which is acceptable; add that no source read this session supports them, and say what happens to an attempt that fails.

Dropped from the report and worth restoring: holding the unit of analysis fixed (blocker 4), and the report's caveat that the cost of keeping a mapping current is unknown.

### 6. What in r6 was lost by accident?

Method: `diff` of the two files, then a segment comparison. r6 line 3 became the r7 header, with the r6 header kept inside it. r6 lines 4 to 99 and 216 to 331 are identical in r7. Everything that differs is r6 lines 100 to 215, section 5, replaced by r7 lines 106 to 197.

**Struck on purpose, per the header:** phase 1a step 1 (the scout and the list), step 2 (two pre-read drafts and what each receives), the probe questions, step 2b, step 3's provisional file table, phase 1c as the settlement of a provisional framework, and phase 4a's drafting before the lanes with its NOT YET TRUE marks.

**Lost with no stated reason:** the six groups in blocker 2 (phase 0's numbers; the duplication census; the two baseline definitions and two keep-list entries; what a unit read returns; phases 2 and 3; the glossary section), and the four things under question 1 (the comparison rule, the probe questions, the cost of a move, and the Fable review of the desk's judgements). Also: r6's first framework-test question, which asked each unit to "report every capability the framework has no good home for"; r7's four questions keep its mirror, files that serve no capability, and drop it. And the sentence that the reads never wait for the framework.

**Changed in meaning without a note:** the NOT YET TRUE marks and the tripwire of phase 4a. Step 10's "written from the chosen framework and brought true at the end" compresses both. The reversal condition replaces the tripwire with something stronger. Whether dropping the marks is intended is NOT ESTABLISHED.

### 7. Does r7 contradict a standing ruling?

- **`CONTRACT.md` section 8, "Do not write a step into a brief that permits what Dann asked to be rid of".** Yes, in sections 3, 6, 7, 9, and 10 as carried from r6. Blocker 1.
- **Section 1 item 19, Fable reviews a design the desk derives.** Not met at step 7. Blocker 3.
- **Section 1 items 2 and 3, and section 5.** No contradiction in what r7 does; a gap in what it says. Amendment 5.
- **Section 1 item 6a and "N.204: FABLE READS ALL THE CODE".** Consistent. Step 4 keeps the full read, and the partial mapping trims no read.
- **Section 1 item 20.** His words of 20:45, 20:49, and 21:27 were not found under `docs/memory/`. Amendment 12.
- **Section 4, the cost of a farm-out and estimates from actuals.** The new steps carry no cost lines. Amendment 9. The ceiling of two helpers is respected wherever r7 states a count; step 6's two readers take both slots, and r7 does not say that no read runs beside them.
- **Section 5, "A ratification is not an authorship".** r7 is careful here: the order is "the desk's merge", the grouping is named as the desk's, and the r6 correction of record is kept. One residue at line 11: "the induction Dann struck at 20:26", two lines above the correction saying he asked a question at 20:26.
- **Section 8, the fixed list.** Carried unchanged in section 4 of the plan. Consistent.
- **`STATE.md`, "DO NOT REDESIGN ITS SEQUENCE".** Not on the reading list, met while locating the model. This review keeps the sequence.

## What I could not establish

1. Whether any tool extracts a trustworthy dependency graph from TypeScript and Svelte. The research did not establish it and this review opened no source.
2. Whether Dann's words of 2026-11-23 20:45, 20:49, 21:07, 21:18, 21:22, and 21:27 are recorded anywhere outside r7, `OPEN.md`, and `STATE.md`. Two greps of `docs/memory/` returned nothing for the 20:45 and 20:49 quotations; no other folder was searched. The quotations in r7 could not be checked against a primary record.
3. Whether the four examples of likely change in step 3 are his or the desk's.
4. Whether the model's sixteen boxes and five rules are fit for a reflexion comparison. It was read once, in `OPEN.md`, to answer question 1; it was not reviewed.
5. Which comparable projects step 6 would read, and whether any exists for a solo, bilingual, browser-based tool of this kind.
6. Whether Ilya's commit history supports a per-commit count of components touched.
7. Whether dropping the NOT YET TRUE marks was intended.
8. Whether the generated module map and the layering ratchet can carry item 11's tree-state clause. Carried over from the r5 review, still open.
9. The arithmetic of the stopping rule and of the reopening threshold. The figures two and three in this report are suggestions with no source.
10. Reading limits. `CONTRACT.md` sections 1, 4, 5, and 8 were read through `cut` at 2,600 characters a line, and the last bullet of section 8 was truncated; no quotation here comes from a truncated tail. r6 section 5 was read at 6,000 characters a line. Sections 0 to 0.3 of `CONTRACT.md` were not read.

## Files read

Whole: the brief; plan r7; the research report; the r5 review; plan r6 by line diff against r7, with its section 5 (lines 100 to 215) read in full.

In part: `CONTRACT.md` sections 1, 4, 5, and 8; `OPEN.md` lines 4531 to 4600 (the model); `STATE.md` lines 19 to 31; `grep` of `INBOX.md`, `OPEN.md`, `STATE.md`, and `PRODUCT.md` for the date and for two quoted strings.
