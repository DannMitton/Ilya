# review-fable-plan-n204-r5_r1_2026-11-23

Review of `plan-code-audit-maintainability_r5_2026-11-23.md` (md5 `98deb02b`, confirmed by `md5sum` this session) against `plan-code-audit-maintainability_r4_2026-11-21.md`. Read by Fable 5.2, 2026-11-23, on the brief `brief-fable-review-plan-n204-r5_r1_2026-11-23.md`. Read-only: this file is the only thing written. No source file was opened.

Terms coined by this reviewer: "probe questions", "provisional framework", "stay count". Every other term is adopted from the plan.

## Verdict

**ADOPT WITH AMENDMENTS.** Four blockers and eleven amendments.

The direction of r5 is right and answers what Dann asked for at 20:19, 20:22, and 20:26: the shape of Ilya becomes something designed and then tested, and the documents become the target. The blockers are all in phase 1a and done-when item 11, they are repairs to wording and sequence, and none of them needs a new phase. Phase 1a is not ready to commission until the four are applied. Everything else in r5 can stand while they are.

### Blockers

1. **The two framework drafts are not independent as written, so their agreement proves less than step 2b says it does.** Three places leak the same prior into both drafts. (a) Step 1 says "The grouping is the desk's", and step 2 hands "the same capability list" to both drafters. A grouped list is already a first framework, so two drafters who keep the desk's groups agree because of the desk. (b) Section 7 costs the two sessions as reading "`names.ts`, the Names table, and the five filed reads", and `names.ts` by the plan's own account holds each part's "code name and folder today and after batch 3". Both drafters then see the present tree. (c) Step 2b's rule, "Where the two agree, the joint is in Ilya", treats agreement as evidence of Ilya. Two models from one maker, given one list, also agree on whatever any textbook layering says. **Repair, in three parts.** The list goes to the drafters ungrouped, in shuffled order, with no path, folder, or code name on it. Each drafter also answers a fixed set of probe questions that only an Ilya-specific framework can answer: the one home of each of the seventeen duplicated facts in section 5, where the composition code of `routes/+page.svelte` lives, and what a developer who arrives to improve Corrections opens. Step 2b's first rule is reworded: agreement on a probe question settles it; agreement on a generic layer settles nothing and is recorded as such; and the comparison also reports where both drafts match the present tree and where both depart from it, because the second is the finding with the most weight.

2. **Step 1 does not yet define the thing the whole design stands on.** The capability list has no stated author, no cost line in section 7, no grain, and no test of completeness. On grain: the plan's examples are decisions ("where Ilya decides which vowel a note takes"), while the glossary lines already filed in unit d are features ("Export and Import of a binder", unit d section 6). A framework jointed on one grain differs from one jointed on the other. On inputs: the list is "in a singer's words first", yet none of its three inputs is the product a singer meets, and all three describe the code. Units a and b, which hold the plan's own headline capabilities (the vowel a note takes, the held note, the hyphen), carry no glossary lines at all (`grep -c -i glossary` returns 0 for both filed reads; d, g, and h each have a section 6). **Repair.** Name the author and the cost. Fix the grain in one sentence with two worked lines. Add the product surface as an input: `docs/memory/PRODUCT.md`, and the headings of GUIDE and LEARN, which section 4 already permits to be read for structure. State the completeness test: every heading a singer can reach in GUIDE and LEARN maps to at least one line, and every line maps to at least one thing a singer can do or see.

3. **Done-when item 11 and step 1 make Dann the gate on every line of the list, which CONTRACT.md forbids.** Step 1: "The words on each line are Dann's and reach him as plain text, one at a time where a ruling is needed." Item 11: "the capability list is filed with Dann's words on every line". The list has no stated length. Unit d alone filed 23 lines for five files, so the whole tree plausibly runs to hundreds; that figure is this reviewer's inference from one unit, and the true count is NOT ESTABLISHED. `CONTRACT.md` section 1 item 2: "Do not make him the gate for reversible things." Section 5: "Volume is a cost you spend on his behalf" and "Do not manufacture decisions". A glossary line is reversible. Phase 1a also runs before the eleven remaining reads, so every read would wait on his attention, which the plan's own closing section names as a binding constraint. **Repair.** The desk words every line from the product's existing ratified vocabulary and marks the list DESK DEFAULT. A line reaches Dann only where two singer's terms compete and the choice is taste, or where the line is French. Item 11 reads "filed in a singer's words, with every term Dann ruled on marked as his". Phase 1a does not wait on him.

4. **Step 3 does not bind, and item 11 does not test where the code ends up.** Step 3 has no unit of cost, no named judge, and no limit. At phase 1a, eleven of sixteen units are unread, so the cost of a move is unknown for most files and step 3 can only be honest for a, b, d, g, and h. The phase 0 import graph, which is what "what may depend on what" is drawn against, is still owed (section 5, "Still owed in phase 0"; `report-desk-n204-phase0-baseline_r1_2026-11-19.md:74`). The constraint also fails in the other direction: "the file stays where it is with its reason written down" has no ceiling, and item 11 accepts any number of written reasons, so a pass in which most files stay put with a sentence each meets item 11 in full. That is the induction Dann struck at 20:26, readmitted one reason at a time. Last, item 11's closing clauses ("every module's placement is either on the framework or carries a written reason", "no file is left unmapped") can be met by a table: a file mapped to a module in phase 1c's table and never moved is "mapped". **Repair.** (a) The framework of phase 1a is named provisional; its file table is filled for the five read units and marked NOT ESTABLISHED for the rest; phase 1c is where step 3 binds. (b) The import graph is sequenced before step 3. (c) Cost is counted in things the plan already measures: importers of the file, tests that read it as text (142 files do, section 5; ten pin `+page.svelte` alone, unit d section 3 item 1), paths fixed by `CONTRACT.md` section 8, and ratchet headroom. (d) The stay count is filed at 1c and again at close, as a number and a share of files, and reaches Dann in one line. (e) Item 11 gains a tree-state clause: at close, the generated module map of phase 4b equals the framework's table, checked by a test, and every dependency rule the framework states is a line in the layering ratchet that `scripts/ratchets.mjs` already carries. Section 3 already says "Relationships become checks before prose"; item 11 does not yet hold the framework to it.

### Amendments

1. **Widen the framework test by two questions.** As worded it asks whether the framework can host each capability. A framework of one module hosts everything, so hosting alone does not test organization. Add: which imports, shared class names, or shared constants in this unit cross a boundary the framework draws; and which files in this unit serve no capability on the list. Unit d shows why the second matters. `routes/+page.svelte` "owns no rule of its own by intent" and is 5,533 lines of joining; a framework jointed on capabilities has no line for it, and the test as written has no place to say so.

2. **Make the framework test a per-file table.** Phase 1c maps "every current file to its module" without reading source, so it can only map files the unit reports name. Unit d's section 6 names modules for about twenty lines and leaves many of the files it touched unplaced. The brief for each remaining unit asks for one row per file.

3. **Cost the back-fill for units a and b as more than a pass.** The plan says the five read units owe the framework test "as a pass over their own filed reads rather than a re-read". For d, g, and h that holds: each has glossary lines. For a and b there are none, so the pass has nothing to stand on. Name it as a short return to the source for those two packages, with its cost.

4. **Name the two settlements differently and hang each dependent from one of them.** Step 2b ends with "Dann reads the settled framework in words", and phase 1c is titled "THE FRAMEWORK SETTLED". Phase 4a drafts "from the settled framework" and item 7's tasks are written "before phase 4a". Which settlement each means is not stated. Suggested: provisional at 1a, settled at 1c; phase 4a and item 7 hang from 1c; Dann reads it once, at 1c.

5. **Let phase 1c gate tiers 2 and 3 only.** "It gates the lanes" and phase 4a's "Before any lane" hold tier 1 (dead code, comments, token migration) and tier 4 (the nineteen behaviour defects) behind the framework. Neither moves a file across modules. Dann ruled on 2026-11-22 19:11 that phases 2 and 3 land before the release, so an unneeded gate sits on the critical path.

6. **Put phases 1a, 1c, and 4a into section 6.** Section 6 is titled "The order" and carries none of them. It also says "Two units run at once, which is the ceiling", while phase 1a uses both helper slots for its two drafters. State that no unit read runs during step 2, and whether phase 1a waits for consistency batch 3, since the framework names modules that batch 3 renames.

7. **Repair the comment audit so the sample matches its consequence** (question 5, below). One sample of 200 across the tree supports one tree-wide rate. It cannot support "sends the unit back".

8. **Give Dann's own example a done-when.** Section 1 quotes him on Corrections and notes that `CorrectionSurface.svelte` sits at 1,227 of 1,227. Nothing in section 9 checks that a developer can extend Corrections after the pass. Add it as one of item 7's five tasks. State also what happens to a ceiling after a split: if the ceiling follows the file down to its new size, the file is full again the day the lane lands. How `scripts/ratchets.mjs` re-pins a ceiling is NOT ESTABLISHED here.

9. **Take the stranger's verdict twice.** Item 7's "would you be glad to inherit this" is a sound instrument, and one reading of it has nothing to be compared with. Run the same fresh Sonnet reader on the tree as it stands now, file the answer, and run it again at close. The difference is what Dann reads.

10. **Have phase 1c review the desk's judgements of step 2b, and say so.** `CONTRACT.md` section 1 item 19, as widened 2026-10-27, puts "a design the desk derives" in front of Fable before it ships. In r5 the desk (Opus) rules every difference between the drafts, and eleven unit reads are then spent against that ruling. Phase 1c is already a Fable read over the framework; one sentence makes the desk's judged differences part of what it may overturn. This also keeps the framework's verdict with Fable, which is the spirit of "N.204: FABLE READS ALL THE CODE", although that ruling's letter covers the read and r5 does not trim the read.

11. **Clear the residue of the in-place amendments** (question 6, below): seven items.

## The seven questions

### 1. Does r5 now test "thoughtfully organized"?

In part. Phases 1a and 1c supply what r4 lacked: a stated target that the tree can be compared against. Item 11 then tests that the target was produced by the stated process: filed, drafted twice, compared, tested, settled, mapped. It does not yet test that the tree matches the target at close, and it places no limit on files that stay off it with a reason. So r4's gap survives in a new shape. In r4 nothing asked what the structure ought to be. In r5 something asks, and nothing checks that the answer was carried out. Blocker 4, parts (d) and (e), closes it. Amendment 1 closes a second, smaller form of the same gap: the unit reads test whether the framework can hold the code, which is a test of capacity and not of order.

Item 7's widened verdict is the only place a person other than the authors judges the organization. It is correctly a verdict and not a gate. Amendment 9 gives it a reference point.

### 2. Is the two-draft comparison sound, or theatre?

The idea is sound and r5 as written does not yet get the informative version. Blocker 1 carries the detail.

What makes it informative: the drafters receive nothing that carries the present decomposition or the desk's grouping; each draft has to commit on questions that have a wrong answer for Ilya; and the comparison is scored against a rule written before either draft is opened. What makes it a ritual: a shared grouped input, a comparison of module names, and a rule under which agreement counts as confirmation. Different models reduce shared taste and do not remove shared training; two drafts that both propose a core, a domain layer, and an interface layer have told you about software in general.

Step 2b's third rule, that a capability one draft names and the other misses shows the list was incomplete, is the strongest part of the design and needs no change. Disagreement and omission are where this comparison earns its cost.

### 3. Is the order workable?

For the capability list, yes, with a different input. What Ilya does for a singer is knowable without the eleven unread units, but it is knowable from the product and not from `names.ts`. With `PRODUCT.md` and the GUIDE and LEARN headings added (blocker 2), the list is not written in the dark.

For the framework's file table and its dependency rules, no. Five units read is under a fifth of the source by the plan's own closing section, and `voice/`, `omr/`, `reader/`, `insights/`, `library/`, `text/`, and all of `score/` are unread. **The minimum is what phase 0 already owes:** the import graph, the keep-list, and the per-unit Sonnet packets for the unread units. With those in hand before step 3, the provisional framework can place the unread files by what they import and export, marked provisional, and the unit reads then confirm or refute. Whether any packet exists for an unread unit is NOT ESTABLISHED; the phase 0 report lists the packets as still owed at line 74.

The filed unit d read answers the other half of this question. The framework test fits the work a unit does: a unit that can write section 6's glossary lines can name capabilities and place them. What the instrument misses is the unit's most architectural output, section 3's hidden relationships, most of whose ten items are couplings across what any framework would draw as a boundary (window listeners that depend on class names owned by another component; module-scope singletons whose order matters; ten tests that pin the file's text). Amendment 1 lets the test carry them.

### 4. Does step 3's cost constraint bind?

No, in both directions. See blocker 4. A framework can still be drawn that the code cannot be moved into, because at phase 1a nobody has the facts to price a move for four fifths of the tree and step 3 names no unit to price it in. And a framework can be drawn that the code is never moved into, because every stay is admissible with a sentence. The repair moves the binding point to phase 1c, prices moves in counts the plan already holds, and reports the stay count.

### 5. Is the sampled comment audit sound?

The change from a universal claim to a sample is right, and the tree-wide number does real work. The unit-level consequence does not.

- **Tree-wide.** With 200 comments and a true pass rate of 90 per cent, the standard error is about 2.1 points, so the filed rate is good to about 4 points either way (this reviewer's arithmetic, normal approximation). That is enough to say "about nine in ten".
- **Per unit.** 200 spread over sixteen units is about twelve each. A unit whose comments truly pass at 90 per cent shows two or more failures in twelve about one time in three (0.34, binomial). A unit truly at 70 per cent shows one failure or none about one time in twelve (0.085). So "sends the unit back" would fire on chance. A larger per-unit sample with the same 90 per cent line has the same fault, because a unit sitting on the line is sent back about as often as not.
- **Repair.** Keep the 200 for the tree-wide rate and file it with its interval. For the consequence, sample thirty per Fable unit and send a unit back at seven or more failures. A unit truly at 90 per cent is then sent back about 3 times in 100, and a unit truly at 70 per cent passes about 16 times in 100 (this reviewer's arithmetic; have the script print the table so nobody trusts this page).
- **Define the sampled thing.** Section 5 counts 34,439 comment lines; unit d counts 441 blocks in 2,526 lines. Sample blocks, by a seeded script seated in `scripts/`, so the draw can be repeated. Say whether `LearnContent.svelte`, `GuideContent.svelte`, `i18n.ts`, and the vendored code are in the frame.
- **Separate false from redundant.** Section 2 promises "no comment that is false". A false comment in the sample sends its unit back whatever the rate; unit d found thirteen in one file.
- **Name the rater.** "A reader who did not write them" needs a model and the instruction that the reader opens the code under each comment, since the test is whether the comment tells a cold reader something the code does not.
- **The census threshold.** "Lower than 34,439 lines" passes at 34,438. Each unit's census in phase 1b already marks what comes out; item 2 covers applying it. A line here saying the expected fall is the sum of the unit censuses would make the figure mean something.

### 6. What did r4 carry that r5 lost?

Method: a line diff of the two files. Nine r4 lines are absent from r5: the title, the lineage line, the tree line, the tiers bullet, phase 1, phase 2, phase 4, the date paragraph, and done-when items 5 and 7. Each is replaced by a rewritten r5 line that keeps the r4 content, with two deliberate removals: item 5's universal comment requirement, and the 2026-11-27 date. **No r4 content is lost by accident.**

One consequence of a deliberate removal: section 2 still promises "no comment that restates the line below it, and no comment that is false", and after the change to item 5 no done-when equals that promise.

What the in-place amendments left behind (amendment 11):

1. Section 3, the tiers bullet: "toward the target structure of phase 1b". The target is phase 1a's, settled at 1c. The same section's next bullet has it right.
2. The closing section: "r5 adds one back-fill to these five: the placement answer of phase 1". The placement answer is what Dann struck; section 5 now calls it the framework test.
3. Section 7: "the twelve Fable units remaining: about 1,287k". Five units are read, eleven remain, and two of those are Sonnet's, so nine Fable units remain; the plan's own closing section gives about 1,018k.
4. Section 7: "With units a and b already spent". Five are spent.
5. Section 7: "The whole design costs about four per cent". 0.9M to 1.1M against 4.9M to 5.3M is 17 to 22 per cent. The claim may have meant something else; as written the arithmetic does not hold.
6. Section 6's table gives unit d as 75k. The filed read corrects it to 265,173 bytes, and the closing section's "about 452k of roughly 2,677k" rests on the uncorrected column.
7. Phase 1c counts "sixteen framework tests". Two of the sixteen units are `tools/`, `scripts/`, and the tests, read by Sonnet. Say whether those owe the test and what it means for a test file.

### 7. Does r5 contradict a standing ruling?

- **`CONTRACT.md` section 1, items 2 and 3, and section 5.** Yes, at step 1 and item 11: Dann as the gate on every capability line. Blocker 3.
- **`CONTRACT.md` section 1, item 19.** Not met for the framework the desk rules at step 2b. Amendment 10.
- **`CONTRACT.md` section 4.** Consistent. Two helpers at once, never more; the phase 1a estimate is marked first of its kind and capped at the top of the neighbouring range. One gap: step 1 has no cost line (blocker 2).
- **`CONTRACT.md` section 5, "His examples are 'for example', not 'namely'" and "A ratification is not an authorship".** r5 calls Dann's 20:26 sentence a ruling more than once (the header paragraph and phase 1a's title). The sentence as quoted ends in a question mark and opens with "Now might be the time". Reading it as direction is reasonable; recording it as his ruling, with phase 1a's method as its content, is the entrenchment that bullet warns about. The two-draft method and the three steps are the desk's design. Suggested record: asked by Dann as a question, taken by the desk as direction, method offered by the desk. This is a reading of punctuation in the plan's quotation; `INBOX.md` was not opened.
- **`CONTRACT.md` section 8.** The fixed list is carried into section 4 unchanged. One near miss: "Do not write a step into a brief that permits what Dann asked to be rid of." Step 3's unlimited stay clause permits the accreted shape he asked to rise above. Blocker 4.
- **`OPEN.md`, "N.204: FABLE READS ALL THE CODE".** Consistent. Units o and t on Sonnet are inherited from r2 section 7, which the ruling names as its description (r2 lines 83 and 84). The Opus draft is a second design and trims no read. Phase 1c reads reports and not source, in addition to the full read, not in place of it.
- **`OPEN.md`, "N.204: ITS PURPOSE, ITS COMMENTS, AND THE DESK'S DECISION RIGHTS".** Consistent. Section 8 of the plan repeats the rights as ruled.
- **`OPEN.md`, "N.204 STAYS ABOUT CODE" (2026-11-22 21:48),** not on the reading list and met while locating the others. Consistent: everything r5 adds concerns code or the documents that ship with it.

## What I could not establish

1. How many lines the capability list will hold. The figure in blocker 3 is an inference from unit d's 23 lines.
2. Whether a Sonnet packet exists for any unread unit. Only the phase 0 report's "still owed" line was read.
3. How `scripts/ratchets.mjs` sets a ceiling after a file shrinks. The source tree was out of bounds for this review.
4. Whether the layering ratchet can express the dependency rules a framework would state. Same reason.
5. Whether `INBOX.md` at 2026-11-23 20:26 carries more than the one sentence r5 quotes. Not on the reading list.
6. Whether units g and h carry per-file placements beyond their glossary sections. Only their headings were listed.
7. The true size of units other than d. Unit d's column entry was wrong by a factor of about 3.5; the others were not checked.
8. Whether the 34,439 comment lines include `LearnContent.svelte`, `GuideContent.svelte`, and `i18n.ts`. The ratio in section 5 shows tests are excluded; nothing read says more.
9. The `OPEN.md` sections and the unit d read were read through `cut` at 2,500 to 4,000 and 1,500 characters a line, so the longest lines were truncated. No quotation in this report comes from a truncated tail.

## Files read

Whole: the brief; plan r5; plan r4 (by line diff against r5, every differing line read); `read-fable-n204-unit-d_r1_2026-11-22.md`; `CONTRACT.md` sections 1, 4, 5, and 8; `OPEN.md`, the two named N.204 sections and "N.204 STAYS ABOUT CODE".

In part, to settle one claim each: plan r2 (`grep` for Sonnet, lines 83, 84, 94, 104); `report-desk-n204-phase0-baseline_r1_2026-11-19.md` (line 74); the headings and a `grep -c -i glossary` of the unit a, b, g, and h reads.
