# review-fable-plan-n204-r8_r1_2026-11-23

Confirmation read of `plan-code-audit-maintainability_r8_2026-11-23.md` (md5 `0fb9e593`, confirmed by `md5sum` this session) against r6, r7, the two earlier reviews, the research report, and the memory files the brief names. Read by Fable 5.2, 2026-11-23, on the brief `brief-fable-confirm-plan-n204-r8_r1_2026-11-23.md`. Read-only: this file is the only thing written. No source file was opened. Destination in the tree: `docs/sessions/`.

The ten steps are not reviewed and no reordering is proposed. Line numbers are r8's unless another file is named.

Terms coined by this reviewer: "peak census" (the duplication count once every unit read has added to it) and "gross removal" (comment lines taken out, counted apart from comment lines added). Every other term is adopted from the plan, the two earlier reviews, or the brief.

## Verdict

**ADOPT WITH AMENDMENTS.** Two blockers and nineteen amendments.

The rebuild did what it set out to do. No section of r8's body instructs the design Dann struck at 20:45 as live work, the six sections the r7 review named are rewritten against the ten steps, and sections 5a, 5b, and 5d are byte-identical to r6. Both blockers are repairs of one to three sentences. Most of the amendments are lines r8 carried byte for byte from r6 that were already stale in r6.

### Blockers

1. **Done-when item 11's closing clause measures against two things that no step tells anyone to produce, so half of it can be reported met with nothing behind it.** Line 393 requires that step 10's generated module map "equals the framework's file table" and that "every dependency rule the framework states is a line in the layering ratchet". "File table" occurs once in r8, at line 393. Step 7 (lines 198 to 216) says who chooses, prices moves, and counts stays; it never says what a framework consists of. In r6 the file table came from phase 1a step 3 and phase 1c, both struck. The only dependency rules in r8 are the model's five (line 135), and line 135 forbids treating the model as the framework. So a framework that states no dependency rule satisfies the second half of line 393 vacuously, and a lane brief written from step 7 alone produces no table for the first half to test. **Repair, one sentence in step 7:** the framework is filed as its modules, a file table placing every current file, the dependency rules it states (with a verdict on each of the model's five: kept, changed, or dropped), and its version. This states the artifact item 11 already presumes; it changes no step.

2. **Four citations resolve to nothing in r8, or to the wrong step.**
   - **Line 408** (section 10): "How many lines the capability list holds ... the list's length is what decides whether step 1's cost estimate holds." Byte-identical to r6 line 307, which is r7 line 289, one of the two section 10 lines the r7 review's blocker 1 named. The capability list is struck. "Step 1" meant phase 1a step 1 in r6; in r8 it resolves to the frozen area map and tool trial, whose cost (line 347) has nothing to do with a list length. The item can never be closed as written. Strike it or re-aim it at the model.
   - **Line 354:** "r6 adds the scout of step 1 that r5 had left uncosted." Same collision: the scout was phase 1a's, and r8's step 1 also has a Sonnet session. Say "phase 1a step 1, since struck".
   - **Line 355:** "Phase 2: 0.3M to 0.4M." r8 defines no phase 2. Section 5c restored r6's paragraph with its label "Phase 2, the refactoring plan" changed to "The lane plan" (line 276). The cost line now prices a phase the plan does not contain. Lines 359, 431, and 441 name phases 2, 3, and 4 between them; phase 4 has no definition anywhere in r8.
   - **Line 230** (step 9): "the commit-log measure alongside". r7 line 116 defined it (a commit-log measure of how many components an average change touches) and named it as a second measure taken beside the graph. r8 dropped that sentence. No step defines the measure or takes it a first time; lines 230 and 420 only caveat it.
   **Repair.** One line each: strike or re-aim 408; qualify 354; add a sentence mapping phases 2, 3, and 4 to steps 8 to 10 (or relabel line 355 "the Fable review of the lane plan, section 5c"); and restore r7's defining sentence to step 1 with the unit "component" pinned to the frozen area map.

### Amendments

1. **Repoint the "section 5" citations at their source.** Lines 26, 46, 57, 382, and 397 (twice) still read "section 5" for numbers that live in 5a. Line 244 tells a reader who has already reached 5a that they point there. The r7 review's repair was "repoint the five citations".
2. **Settle when the five tasks exist for the first stranger's reading.** Item 7 (line 382) has the tasks "written after step 7 and before step 10". Step 10 (line 238) makes the tasks part of a verdict "taken twice", with the first reading "commissioned before any tier 1 lane merges". Tier 1 lanes run from the moment the behaviour baseline exists (lines 222 and 316), which is long before step 7. Since the first reading is pinned to commit `b2869772`, it can be commissioned on a checkout of that commit once the tasks exist; say so and drop "before any tier 1 lane merges", or say the first reading carries the inheritance question alone.
3. **Say when step 10's documents are first drafted.** Line 236 restores the NOT YET TRUE marks, and section 6 (line 316) runs steps 8 to 10 in order, so the documents are written after the lanes that would have made each marked sentence true. In r6 the drafting came after the framework and before any tier 2 or tier 3 lane. As sequenced, the restored marks have nothing to mark.
4. **Correct section 7's total.** Line 354 gives 1.45M to 1.9M for "the sessions above". Lines 347 to 352 sum to 1.55M to 2.10M if the stranger's 0.1M to 0.2M covers both readings, and 1.65M to 2.30M if it is each, as "one Sonnet session each" reads. Against 4.9M to 5.3M that is 29 to 43 per cent, or 31 to 47. The Fable share (0.75M to 0.93M, 14 to 19 per cent) checks. Also: three lines quote an actual, not two (349, 350, 351); step 4's own range implies 1.2M to 1.5M for the five units spent, a range that runs backwards, and the actuals for d, g, and h are not in r8; and the back-fill that line 161 calls "costed as such" has no cost line.
5. **Give done-when item 8 a baseline that exists.** "Lower than its phase 0 figure" (line 383): 5a says phase 0 "counts them across the whole tree and writes the number down", and that count is in neither the DONE list nor the "still owed" list (lines 246 to 258), nor in step 1's list of what phase 0 owes (line 121). The only figure is seventeen, from two units, and "every unit read adds to it". Take the baseline as the peak census, after step 4, as line 149 already does for the Parnas count.
6. **Fix the unit and the direction of the comment census in item 5.** The baseline is 34,439 lines; unit d's census counted blocks (441 in 2,526 lines, per the r5 review); r8 does not say which a unit census sums. The header-comment test and the comments of step 10 add comment lines, so a net fall can miss the target while every marked comment came out. Count gross removals, in lines, and settle line 415's open frame question before the first subtraction.
7. **Name an instrument for item 9.** "No singer-visible sentence contradicts another on the same page" (line 384) has no reader, no page list, and no artifact. "Nineteen" is units a and b alone; d, g, and h are read and eleven units are to come.
8. **Give items 2 and 4 what they need to be counted.** Item 2 needs a named ledger and its denominator. Item 4 needs a fallback, because whether `knip` runs is NOT ESTABLISHED (line 400) and the item has no other instrument.
9. **No done-when holds steps 1, 3, 5, or 9.** Section 9 never mentions the frozen area map, the frozen scenario list, the first and last Parnas counts, the mapping's stop record, or the re-measure. A pass can close with every item met and no before-and-after figure filed. One added item would do it: the frozen map, the frozen list, and the first and last counts are filed.
10. **Say what "nothing in steps 1 to 5 waits on Dann" means at step 3, and whether the reads wait on steps 1 and 3.** Line 115 says nothing waits; line 147 has him see the list once "to strike or add"; line 145 freezes the list at that step. State that the freeze does not wait for his reply, and what a later strike does to a count already taken. r6 said in a sentence of its own that the reads never wait (r6 line 193); the r7 review listed that sentence as lost; r8 has no equivalent, and line 316 reads as a strict sequence that would hold nine reads behind the baselines.
11. **Step 6: restore two comparison bullets or say why they went, and finish three half-applied repairs.** r6's rule had five bullets; r8 carries three and adds two. Gone without a note: "Agreement on a probe question settles it" (r6 line 153) and "Where one names a capability the other missed, the list was incomplete" (r6 line 157), which the r5 review called the strongest part of the instrument. Also: the two readers are named only in section 7 (line 350, one Fable and one Opus), not in step 6; line 196 says the Fable read "reviews" the desk's judgements and no longer says it may overturn them (r6 lines 156 and 187); and the r7 review's amendment 6 asked for the model-is-not-the-framework sentence in step 7 as well as step 2, and step 7 does not carry it.
12. **Define a module's Parnas count.** Lines 214 and 232 reopen "a module" whose Parnas count "has not fallen". The count is per scenario (how many units a change touches), not per module. Say which scenarios belong to a module. The wording came from this reviewer's r7 review.
13. **Clear the stale lines carried byte for byte from r6.** Line 397: batch 3 "has not run", against line 318 (its first slice shipped as N.211). Lines 435 and 437: unit l still gated and missing from the ready list, against lines 318 and 333. Line 16: "the induction Dann struck at 20:26", two lines before the correction saying he asked a question at 20:26; the r7 review named this residue and it is unchanged. Line 22: the struck design stated as his ruling, with a pointer to "(section 5, phase 1a)", unmarked as superseded. Line 60: one sentence printed twice. Lines 411 and 423: one open item listed twice. Lines 159 and 224 say 5,533 lines; line 253 says 5,532.
14. **Qualify "verbatim" for section 5c.** Line 274 says "Restored verbatim from r6". Line 276 differs from r6 line 195 in two places: the label, and "settled at phase 1c" became "chosen at step 7". Both changes are correct; the word is not. Lines 153 and 220 say "unchanged from r6" and the same applies to 220.
15. **Say which review a "Fable amendment" number belongs to.** Lines 115, 119, 125, 135, 158, 167, 177, 185, 202, 222, and 388 cite the r7 review; lines 375 and 382 cite the r5 review; "amendment 7" means two different things at lines 158 and 375.
16. **Check the source of three fixed items in section 4.** Line 73 attributes eleven items to `CONTRACT.md` section 8. Eight are there. "No stored-format change", "no i18n key deleted", and "no ratchet ceiling raised" are not in section 8, and a search of the whole staged `CONTRACT.md` for "i18n key", "stored format", "format change", and "ratchet" returns nothing. They may be ruled elsewhere; as cited, they are unsupported. The r7 review reported this list as consistent and was wrong to.
17. **Bring the record round r8 up to r8.** Not faults in the plan, and each sends a desk to r7. `STATE.md` line 19 tells the next desk to read r7 "before you write one word" about N.204, four lines before line 23 says "read r8, not r7"; lines 26, 31, 33, and 43 point at r7's header, steps, and section 3a; line 41 gives the design's cost as 23 to 28 per cent, which is r6's figure. `OPEN.md` line 4533 says the model is compared "at r7's step 5" and links r7. `INBOX.md` lines 1002, 1007, and 1008 home the rulings in r7.
18. **File four more of his quotations.** `INBOX.md` holds seven lines dated 2026-11-23, the earliest at 20:45. His words of 20:19, 20:22, and 20:26 are in r8 (lines 42, 44, and 22) and in no staged memory file. His question of 20:29 (*"Did you consult anybody else for your schematics for the framework design? A secdon set of eyes always helps <3"*), which is the occasion of the two-reader idea, is in r5 line 116 and r6 line 138 and nowhere else staged: r8 dropped it and line 183 credits the idea to r6. This is a different set of times from the closed finding.
19. **Two items of the earlier reviews that r8 names nowhere.** The r7 review's blocker 2 ended "A deliberate removal is named as one in the header"; r8's header says r5 and r6 "had it the other way round and he struck that" (line 61) and lists nothing removed; the list exists only in `INBOX.md` line 1002. The r5 review's amendment 11 item 7 asked whether the two Sonnet units (o and t) owe the per-unit questions and what that means for a test file; line 155 says "sixteen reports" and does not answer.

## The five questions

### 1. Does any part of r8 still instruct the design Dann struck at 20:45?

**No section instructs it as live work. Three places still name it.**

Read without the header, sections 3, 4, 4a, 5 (steps 1 to 10), 5a to 5e, 6, 7, 8, and 9 carry none of: a framework chosen before the read, the two pre-read drafters, probe questions asked before the read, the provisional file table, or a shape taken from the folder tree. The phase names 1c, 2b, 4a, and 4b do not occur in r8. "Phase 1a" occurs twice, both in the header (lines 14 and 22). "Phase 1b" survives once, as the label of the unit read in 5b (line 267), and carries none of the struck machinery: r6's "framework test" that followed it is replaced by step 4's four questions.

What remains:
- **Line 408**, section 10, the capability list. Blocker 2.
- **Line 354**, section 7, "the scout of step 1". Blocker 2.
- **Lines 16, 18, and 22**, the kept headers. Line 22 reads "He ruled that the framework is designed from what Ilya does, and the code then tested against it (section 5, phase 1a)". Line 18 says "the three steps and the two-draft method below", and neither is in r8. These are marked as kept history at lines 14 and 20, except line 22's paragraph, which carries no such mark. Amendment 13.

Two things that are not the struck design, checked because they sit near it. The model (step 2) has five dependency rules written before the read; line 135 marks it a hypothesis and flags a framework that reproduces it. The probe questions and the two readers (step 6) run after the read, which `INBOX.md` line 1002 leaves open: what it records as struck is "the two pre-read drafters" and the questions of phase 1a.

### 2. Does r8 cite anything that is not in r8?

**Internal citations that resolve:** sections 1, 2, 3, 4, 4a, 5a, 5b, 5c, 5d, 7, and 9 item 8, wherever cited; steps 1 to 10, wherever cited by number; done-when items 3, 4, 5, 7, and 11 and "item 11's closing clause"; "the behaviour baseline of step 1" and "the performance baseline" (defined at line 258); "step 3's frozen list"; "step 6's two readers"; "the Fable read" before step 7 (line 196); "step 10's generated module map" (line 236); the three token classes of item 10 (lines 97 to 99).

**That do not resolve, or resolve to the wrong place:**

| Line | Citation | Target in r8 |
|---|---|---|
| 393 | "the framework's file table"; "every dependency rule the framework states" | None. Blocker 1 |
| 408 | "the capability list"; "step 1's cost estimate" | None; wrong step. Blocker 2 |
| 354 | "the scout of step 1" | Wrong step. Blocker 2 |
| 355, 359, 431, 441 | Phase 2; phases 2, 3, and 4 | Phase 3 only (line 278). Blocker 2 |
| 230 | "the commit-log measure" | No definition. Blocker 2 |
| 26, 46, 57, 382, 397 | "section 5" for phase 0's numbers | 5a, by way of a note at 5a. Amendment 1 |
| 383 | "its phase 0 figure" | No figure. Amendment 5 |
| 22 | "(section 5, phase 1a)" | None; header history |
| 18 | "the three steps and the two-draft method below" | None; header history |
| 161 | "costed as such" | No cost line. Amendment 4 |
| 214, 232 | a module's "Parnas count" | Undefined per module. Amendment 12 |
| 26, 345, 356, 397, 433 | "phase 1" | No definition; reads as steps 2 to 7 or as step 4 depending on the line |
| 373 | "the eight gates" | Not defined in r8; `STATE.md` line 21 uses the same term |

**External paths.** Confirmed in the staged files: plan r5 and both reviews; the research report; `OPEN.md`, "WHAT ILYA DOES FOR A SINGER: THE MODEL" (line 4531, sixteen boxes, five dependency rules, as lines 133 to 135 say); `INBOX.md` lines 1002 to 1008; `CONTRACT.md` section 0.1, section 1 items 2, 3, 4, 7, 11a, and 19, and sections 4, 5, 6, and 8, each read whole and each saying what r8 says it says, with the exception in amendment 16; section 7 (French) exists and was confirmed by its heading only. Not staged, so NOT ESTABLISHED: `PRODUCT.md`, `SCHEDULE.md`, `ENVIRONMENT.md`, `code-conventions.md`, `census-colour-tokens.mjs`, plans r2 to r4, the three unit reads, `scripts/ratchets.mjs`.

**Against the research report.** Line 123 (clustered cost, the working paper, Pisch et al. read in part, the inference marked), line 143 (Parnas's limits), line 179 (Excel, four weeks, more than 1,600 entries, a second weaker precedent), lines 194 and 304 (the three Foote and Yoder sections read), line 226 (no source supports the four clauses), line 302 (3 in full, 11 in part, 12 not obtained), and line 310 (twenty committing developers; map upkeep unknown) all match the report. Two small departures: line 230 says the research read "only its source's abstract" where the report's entry 2.6 says abstract and introduction, an error that came from this reviewer's r7 review; and line 194's "rather than the ambitious option" is the desk's gloss on a report that says reconstruction comes last.

### 3. Is every item of both reviews present and applied?

**The r7 review.**

| Item | r8 line | Verdict |
|---|---|---|
| Blocker 1, section 3 | 60, 61 | APPLIED |
| Blocker 1, section 6 | 316, 339 | APPLIED |
| Blocker 1, section 7 | 345 to 354 | APPLIED; line 355's phase 2 untouched |
| Blocker 1, item 7 | 382 | APPLIED |
| Blocker 1, item 11 | 388 to 393 | APPLIED as the review worded it; see blocker 1 here |
| Blocker 1, section 10, first line named | 408 | **ABSENT** (byte-identical) |
| Blocker 1, section 10, second line named | 416 | APPLIED |
| Blocker 1, closing section | 439 | APPLIED |
| Blocker 2, phase 0's numbers | 246 to 254 | APPLIED |
| Blocker 2, duplication census | 256 | APPLIED |
| Blocker 2, baselines and keep-list entries | 258 | APPLIED |
| Blocker 2, what a unit read returns | 267 | APPLIED |
| Blocker 2, phases 2 and 3 | 276, 278 | APPLIED; label dropped |
| Blocker 2, glossary | 287 to 295 | APPLIED |
| Blocker 2, repoint the five citations | 244 | **NAMED BUT NOT APPLIED** |
| Blocker 2, name deliberate removals in the header | none | **ABSENT** |
| Blocker 3 (a), readers and what each receives | 185, 350 | APPLIED; readers named in section 7 only |
| Blocker 3 (b), comparison rule | 185 to 190 | APPLIED |
| Blocker 3 (c), probe questions | 192 | APPLIED, all four |
| Blocker 3 (d), desk judges, Fable reviews, chooser named | 196, 200 | APPLIED; "may overturn" not carried |
| Blocker 3 (e), cost of a move | 202 | APPLIED |
| Blocker 4, frozen area map, two grains, frozen list, count after step 4 | 119, 145, 149 | APPLIED |
| Blocker 4, the fallback sentence | 127 | APPLIED |
| Amendment 1 | 177 | APPLIED |
| Amendment 2 | 125 | APPLIED |
| Amendment 3 | 167 to 175 | APPLIED |
| Amendment 4 | 206 to 216, 232 | APPLIED; "and its evidence" not carried |
| Amendment 5 | 115, 147 | APPLIED; amendment 10 here |
| Amendment 6 | 133, 135 | APPLIED in step 2; **ABSENT** from step 7 |
| Amendment 7 | 158, 161 | APPLIED |
| Amendment 8, items 1 to 8 | 123, 143, 179, 194, 226, 302, 304 | APPLIED, all eight |
| Amendment 9 | 347 to 353 | APPLIED; the total does not sum |
| Amendment 10 | 194, 350 | APPLIED |
| Amendment 11 | 222, 238, 316 | APPLIED; amendment 2 here |
| Amendment 12 | `INBOX.md` 1002 to 1008 | CLOSED, checked; two small points APPLIED at 12 and 230 |
| Question 1, completeness test from the singer's side | 137 | APPLIED |
| Question 2, commit-log caveats | 230, 420 | APPLIED |
| Question 6, "no good home" half of the question | 159 | APPLIED |
| Question 6, the reads never wait | none | **ABSENT** |
| Question 6, NOT YET TRUE marks | 236 | NAMED; inert as sequenced (amendment 3) |
| Question 7, "struck at 20:26" residue | 16 | **ABSENT** (unchanged) |
| Question 7, no read beside the two readers | 316, 339 | APPLIED |
| Unestablished items carried to section 10 | 419 to 425 | APPLIED |

"Thirty-one items" is the brief's count; r8's header says "four blockers and twelve amendments" (line 12). How thirty-one was reached is NOT ESTABLISHED; the table covers the sixteen numbered items and every sub-item found in the review's body.

**The r5 items the r7 review reported lost.**

| Item | r8 line | Verdict |
|---|---|---|
| Amendment 10, the Fable read before step 7 binds | 196; costed 351; ordered 316; in done-when 391 | APPLIED |
| Blocker 4 part (c), the cost of a move | 202; in done-when 392 | APPLIED |
| The comparison rule | 185 to 190 | APPLIED for three of r6's five bullets; two **ABSENT** (amendment 11) |
| The probe questions | 192 | APPLIED |

**Other r5 items, checked through r6.** Amendments 1, 2, 5, 6, 7, 8, and 9 and blocker 4 parts (b), (d), and (e) are present (lines 155 to 159, 222, 316, 375 to 380, 382, 119 to 121, 204, 393). Amendment 3 is named and has no cost line. Amendment 4 is moot, since nothing is provisional. Amendment 11 item 7 is absent (amendment 19).

### 4. Is every done-when item measurable as written?

| Item | What is measured, with what | Settled by | Met while the tree stands still? |
|---|---|---|---|
| 1 | Packets and reads on file, by `ls` | 16 and 16 | Yes, by its nature |
| 2 | Disposition of every finding | A ledger r8 does not name; no denominator | Yes: "declined with a reason" has no limit |
| 3 | Gates, baseline diff, Playwright, ratchets, sizes, per lane | Each lane's report | Yes, if no lane runs |
| 4 | `knip` output against the keep-list | Zero unused | No. No instrument if `knip` does not run |
| 5 | (a) line-number citations by script, 127 to 0; (b) the header-comment test; (c) the census fall; the two samples by seeded script | (a), (b), and the per-unit rule are settled by a number; (c) is not: unit and direction unfixed | No for (a) and (b) |
| 6 | Claim, file, verdict table by a second reader | The table | Yes |
| 7 | Five tasks against a pass mark, a fresh Sonnet reader; the inheritance question twice | The task results; the verdict is filed, not gated | Yes |
| 8 | Duplication census against a baseline; the ratchet | No baseline figure exists | No |
| 9 | Contradictions on a page; nineteen defects | No instrument for the first clause | Yes |
| 10 | `census-colour-tokens.mjs`; the token tables | Below 299, with all 177 exact matches migrated | No |
| 11 | Five filed artifacts and one test | See the text that follows | Yes |

**Item 5's arithmetic checks.** 200 over sixteen units is 12.5. Two or more failures in twelve at a true 90 per cent: 0.341. Standard error at 200 and 90 per cent: 2.12 points; 1.96 times that is 4.2. Seven or more failures in thirty at a true 90 per cent: 0.026. Six or fewer in thirty at a true 70 per cent: 0.160. All as line 375 to 377 state. The tree-wide sample has no pass mark; it is a filed rate. The per-unit sample covers the fourteen Fable units only.

**Item 7 carries no computation.** Its figures are five tasks, one of them Dann's, and 1,227 of 1,227, which matches line 254. Its fault is timing (amendment 2). If the brief meant section 7, that arithmetic is in amendment 4.

**Item 11, rewritten in r8.** It no longer names an event that does not exist: step 6, step 7, the Fable read, close, and step 10's module map are all in r8. Each bullet is settled by an artifact. Three things remain.
- Bullet 1 asks that the model's desk-authored parts be "marked DESK DEFAULT". The model in `OPEN.md` marks his wording line by line and lists the desk's parts under "What is the desk's inside this, and his to strike"; the string DESK DEFAULT does not occur in lines 4531 to 4586. As written, bullet 1 is not met today.
- Bullet 4's "every current file" has no stated commit or frame (552 files at `6c0bb4fc` excludes tests and docs).
- Bullet 5 is blocker 1.

**The item can be met while nothing moves.** A framework whose file table equals the present tree, every file a priced stay, meets all five bullets. Line 393's last sentence says otherwise. What r8 holds against that outcome is the stay count reaching Dann in one line (line 204) and step 9's trigger (line 232), and neither is a done-when. Nothing in section 9 requires a file to cross a boundary. This matches the r5 review's blocker 4 part (d), which asked for the count and no ceiling.

### 5. Was anything in r6 lost in the rebuild without a stated reason?

Method: a line-level sequence comparison of r6 against r8, then every differing r6 line read in full, then the same against r7 for what r7 added.

**Byte-identical.** r6 lines 4 to 48 are r8 lines 15 to 59; r6 lines 51 to 99 are r8 lines 62 to 110; r6 lines 216 to 218, 220 to 241, 243 to 247, 249, 254 to 280, 282 to 286, 293 to 314, 316 to 328, and 330 to 331 are carried unchanged. That is why the stale lines of amendment 13 survived.

**The word "verbatim".** 5a (lines 246 to 258) equals r6 lines 102 to 114. 5b (line 267) equals r6 line 168. 5d (lines 287 to 295) equals r6 lines 199 to 207. 5c's second paragraph (line 278) equals r6 line 197; its first (line 276) does not equal r6 line 195 (amendment 14). 5e is not from r6; it is r7's section 3a, amended.

**Struck on purpose and consistent with the ruling:** phase 1a steps 1 to 3 and step 2b (r6 lines 116 to 166, less the parts restored at steps 6 and 7), the framework test as a test of a prior framework (170 to 178), phase 1c (182 to 193), the split of phase 4 and the tripwire (209 to 215). r8 does not list these in its header (amendment 19).

**Did not survive, with no reason given:**
- Dann's question of 20:29 and the reason for two models (r6 line 138). Amendment 18.
- "Agreement on a probe question settles it" and "where one names a capability the other missed" (r6 lines 153 and 157). Amendment 11.
- "Where two units' reports conflict, phase 1c names the winner and the reason" (r6 line 189). No step in r8 settles a conflict between two unit reads.
- "It never gates the reads" (r6 line 193). Amendment 10.
- When the documents are first drafted (r6 line 211). Amendment 3.
- The grain of a glossary line fixed by two worked examples (r6 line 122). 5d keeps "one line per capability" and his own examples, which may be enough.
- "Ten pin `routes/+page.svelte` alone" from the cost of a move (r6 line 165). A detail.
- "The header-comment test that `code-conventions.md` section 5 specifies and the tree does not yet have" (r6 line 213); line 236 keeps the test and drops where it is specified.

**From r7, not carried:** the defining sentence of the commit-log measure (r7 line 116; blocker 2). Everything else r7 added is in r8, rewritten, or withdrawn with a note (lines 123, 127, 143, 206, 222, 226, 236).

## What I could not establish

1. Whether the generated module map and a file table are comparable by a test, and whether the layering ratchet can express a dependency rule. Open since the r5 review; blocker 1's repair does not settle it.
2. Whether a whole-tree duplication count was ever taken in phase 0. r8 says phase 0 counts and records it, and records no number.
3. Whether "no stored-format change", "no i18n key deleted", and "no ratchet ceiling raised" are his rulings recorded outside `CONTRACT.md`. Sections 2, 3, 7, and 9 of that file were searched and not read.
4. Whether Dann's words of 20:19, 20:22, 20:26, and 20:29 are recorded in a memory file that was not staged (`PRODUCT.md`, `SCHEDULE.md`, `QUEUE.md`).
5. Whether a findings ledger, a packet for any unit, or the token actuals of units d, g, and h exist. None was staged.
6. How "thirty-one items" was counted.
7. The brief says lines of `CONTRACT.md` run past 11,000 characters. The longest line in the staged file is 5,565 characters (5,577 bytes). Whether the staged copy is the current one is not established; its md5 begins `4cc4692f`.
8. One line on a step, as the brief permits: step 6 scores a candidate shape by the Parnas count (line 190), and a count taken on a shape that exists only on paper is a prediction made by the reader who drew it. Whether that is the independent test line 190 says it is, I could not establish.
9. Token spend. No meter is available to this reviewer. The figure in the hand-off message is an estimate from the size of what was read.

## Files read

**Whole, by a method that does not truncate a line:** the brief; plan r8; the r7 review; the r5 review; `CONTRACT.md` sections 0, 0.1, 0.2, 0.3, 1, 4, 5, 6, and 8 (section 8's lines 177 to 181 were read in a second pass after an output viewer cut the first at line 177; nothing here rests on a cut line); `OPEN.md` lines 4050 to 4059, 4126 to 4143, 4474 to 4483, and 4531 to 4586; `INBOX.md` lines 1000 to 1008; `STATE.md` lines 19 to 48.

**By line diff, with every differing line read in full:** plan r6 against r8 (r6 lines 3, 49, 50, 100 to 219, 242, 248 to 253, 281, 287 to 292, 315, and 329).

**In part:** plan r7, by diff against r6 and r8, the first 330 characters of each of its 44 lines that are in neither; the research report, its headings, entry 2.6, and targeted searches for about twenty strings; `CONTRACT.md` sections 2, 3, 7, and 9, by search only; `INBOX.md`, `OPEN.md`, `STATE.md`, and every staged plan and review, by search for eight quoted strings.

**Not opened:** anything under `apps/`, `packages/`, or `scripts/`. No `.bak` file was created.
