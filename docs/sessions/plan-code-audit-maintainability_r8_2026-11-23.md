# Plan: the code audit and one refactoring pass (r8)

**r8, written by the desk (Opus 5) 2026-11-23 21:4x. r8 replaces r6 and r7**, both superseded and kept. **It is built from r6, not from r7, deliberately.**

**Why r7 is abandoned rather than amended.** r7 applied Dann's ruling of 20:45 by replacing one section and leaving the rest of the document as r6 wrote it. Fable's review (`review-fable-plan-n204-r7_r1_2026-11-23.md`, ADOPT WITH AMENDMENTS, four blockers, twelve amendments, 174,607 tokens) established by line diff that r6 lines 4 to 99 and 216 to 331 were byte-identical in r7, so six sections still instructed the design he struck, and done-when item 11 named events that no longer existed. The same replacement deleted material that had nothing to do with his ruling and that five other sections cite. **Patching a document twice in one evening is what produced that, and r8 is rebuilt from the last internally consistent revision instead.**

**The three rulings r8 rests on, all Dann's, all 2026-11-23, all now in `../memory/INBOX.md`:**
- **20:45, the shape is found after the read**, transcribed as written: *"isbn't this the purpose of the audit? Why do you need a paradiogm in mind right now at the outset? Why not let the content speak to its own organization?> can't you accomplish the audit, then consider its shape, then contrast that with similar code that features various aspects of "better: until one makes sense for ILya, then implement it and make it work? Why are you presenting static bliockers when dynamic plasticity is ultimately responsive?"*
- **20:49, the field's established practice is used**, transcribed as written: *"I'm sure the filed of computer science fully recognizes an app in the current state of ILya and has well-worn approaches that will help us. Use them. Reserach if you have to, that's valid."*
- **21:27, the plan answers unexpected outcomes.** His question exposed that step 7 was a commitment point with no way back.

**What is the desk's, and his to strike:** the ten steps' order, which merges his sequence of 20:45 with the literature's own; every method choice inside them; and the model's grouping. **Fable's review of r7 is applied in full**, its four blockers and twelve amendments.

The r6 header, kept: r6 replaced r5 (`plan-code-audit-maintainability_r5_2026-11-23.md`, md5 `98deb02b`), which is superseded and kept. **r6 applies Fable's review of r5 in full:** four blockers and eleven amendments, `review-fable-plan-n204-r5_r1_2026-11-23.md` (md5 `5f681f2e`, Fable 5.2, 142,797 tokens, 13 tool uses, 4.8 min). Fable's verdict on r5 was ADOPT WITH AMENDMENTS, every blocker inside phase 1a and done-when item 11.

**What the blockers changed.** (1) The two framework drafts were not independent: both received the desk's grouping and `names.ts`, which carries the present tree, so agreement between them proved less than r5 claimed. (2) The capability list had no author, cost, grain, or completeness test, and none of its inputs was the product a singer meets. (3) Making every line of that list Dann's would have put him in front of an unbounded list and stalled eleven reads on his attention, against `CONTRACT.md` section 1 item 2 and section 5. (4) The cost constraint bound in neither direction, and item 11 could be satisfied by a mapping table while the tree never moved, which readmits by the back door the induction Dann struck at 20:26.

**A correction of the record, Fable's and the desk's agreeing.** r5 recorded Dann's words of 2026-11-23 20:26 as a ruling whose content was the desk's own method, which is the entrenchment `CONTRACT.md` section 5 warns against (*"A ratification is not an authorship"*; *"His examples are 'for example', not 'namely'"*). **The accurate record: Dann asked a question, the desk took it as direction, and the three steps and the two-draft method below are the desk's design, his to strike.**

The r5 header, kept: r5 replaced r4 (`plan-code-audit-maintainability_r4_2026-11-21.md`), which is superseded and kept. r5 answers Dann's ruling of 2026-11-23 20:22, that N.204 is where this project comes up for air, and his standard of the same minute, that he wants code he can be proud to share. **Three things change and everything else is r4:** the shape of Ilya becomes an output of phase 1 rather than a by-product of phase 2; the developer's documents are drafted as the target before the lanes instead of written as a report after them; and a reader who has never seen Ilya gives a verdict against his standard. Two repairs ride with them: the comment done-when becomes checkable, and the stale date is corrected.

**AMENDED IN PLACE 2026-11-23 20:3x, before any review and before this file went to anyone, on Dann's ruling of 20:26.** No r6 was cut, because a revision number records a decision somebody acted on and nobody had read r5. **What he changed:** r5's first draft built the target structure by synthesis from sixteen unit reads, which is induction over the decomposition Ilya already has. He ruled that the framework is designed from what Ilya does, and the code then tested against it (section 5, phase 1a). His words, transcribed as written: *"The architecture was written well after Ilya was vibecoded. Now might be the time to thoughtfully architect a well-organized framework that happily hosts our body of modular code?"*

The lineage, kept: written by the desk (Opus 5), 2026-11-19 15:0x. **r3 replaced r2** (`plan-code-audit-maintainability_r2_2026-11-16.md`), which is superseded and kept. r2 was built from Dann's words of 2026-11-16 alone; r3 adds his rulings of 2026-11-19 14:54 to 15:00, which widen the purpose, set the test a comment must pass, and grant the desk decision rights inside this work. Their home is `../memory/OPEN.md`, "N.204: ITS PURPOSE, ITS COMMENTS, AND THE DESK'S DECISION RIGHTS"; his words are in `../memory/INBOX.md` under those times.

Tree at r5: `Shane` `b2869772`, read 2026-11-23 20:0x. Phase 0's counting is DONE and its numbers are in section 5. **Five units of phase 1 are READ: a, b, d, g, h.** `docs/memory/SCHEDULE.md` r6 item 4. DESK DEFAULT number: N.204.

## 1. What Dann asked for, in his words

**2026-11-16 13:17:** *"a Fable audit of the code where you actually read the code in its entirety and housekeep: get rid of dead code, assess how the modules are organized and relate, make sure comments in the code are economical but helpful, delete redundant comments; basically prepare this code to encounter future developers who wish to improve it and make it easy for them to navigate the code and undestand how it works, why it is organizaed teh way it is, any relatiopnships between code segments that may noit seem apparent... Research that and adopt a schema that works for us then use it to refine Ilya's code."* And 13:25: *"yes to one planned pass for refactoring; I defer to your research"*.

**2026-11-19 14:54, the purpose in four parts:** *"The purpose of the refactoring and audit is to eliminate errors, resolve contradutions, consider how the code is organized, and suggest optimizations that we can implement to either reduce Ilya's footprint without sacrificing performance, or to improve its performance in ways that may or may not be apparent to the user."*

**2026-11-19 14:57, comments and the user:** *"We need concise commetns where the code doesn't obviously refelct its function and relationships. We don't need copious comments where the code is self-evident."* And: *"My onw ask is that you firmly retain the importance of the user. This app is meant to be used by other folks like myself who are not programmers, but rather and musicians, ewithert working professionals or students. So we need to prioritize the user experiecne while offering excellent and consistent inform ation."*

**2026-11-19 15:00, the test a comment must pass:** *"The purpose of comments in code is to curate the code for future developers."*

**2026-11-19 14:59, the desk's decision rights:** *"I believe you can resolve many contradictions just by applying the principles I just stated (the usr experience is paramount). I trust you to bring me what you cannot resvole on your opwn."*

**2026-11-18 22:47, how the read is done, never to be asked again:** Fable reads all of it, untiered, *"This is our last look at the code before we finalize the LEARN and GUIDE sections, so it has to be done thoroughly and properly."*

**2026-11-23 20:19, the three words this plan is tested by** (transcribed as written): *"We are in the process of housecleaning this code for future developers whjo can improve it. I hope they imnprove Corrections in particular? But eiotgher way we need the code legible, navigable, and thoughtfully prganized."* **Legible, navigable, and thoughtfully organized are his words.**

**2026-11-23 20:22, the ambition and the standard** (transcribed as written, answering the desk's finding that r4 read bottom-up and never came up for air): *"N.204 needs to be us coming up for that air. The time is now to plan an effective audit and refactoring. I want code I can be proud to share"*.

**What the desk had told him at 20:2x, and r5 is the repair.** r4 delivered two of his three words and not the third. Navigable was its strongest claim, carried by done-when item 7. Legible was carried by the comment census, the dead-code pass, and section 4a. **Thoughtfully organized was not tested by anything in r4's done-when**, and r4's tier 3 split a file because its size ceiling was full rather than because its responsibilities belonged apart. Nothing in r4 asked what Ilya's module structure ought to be, so the answer would have been assembled by accident from whatever sixteen local reads happened to notice. **His note about Corrections is the same gap seen from a developer's chair:** `CorrectionSurface.svelte` is 1,227 lines against a ratchet ceiling of 1,227, so a developer arriving to improve Corrections cannot add one line to that file until a split makes room (section 5, the ceilings).

## 2. The outcome, from two chairs

**A developer who has never met Dann** clones the repository and, in one afternoon, can: find where any singer-visible behaviour lives, from `ARCHITECTURE.md` and one level of folder READMEs; read any module and see why it is shaped as it is; see the relationships no import shows, each pinned by a test or a ratchet where it can be; change a module with the tests telling them what they broke; and meet no dead code, no comment that restates the line below it, and no comment that is false.

**A singer**, who is a musician and not a programmer, meets an app that says fewer wrong things than it does today, never contradicts itself between two sentences on one page, and is no slower and no heavier. **This is new in r3.** r2 promised that nothing a singer sees would change; under Dann's 14:54 ruling, what a singer sees changes wherever it is wrong, and changes nowhere else.

## 3. The schema

- **The tree's own standards come first.** matklad's form for `ARCHITECTURE.md`, and Dann's `../house-style/code-conventions.md`, ratified 2026-11-01 22:35, whose section 5 already carries his comment rule.
- **The checklist: ISO/IEC 25010.** r2 took the maintainability characteristic alone: modularity, reusability, analysability, modifiability, testability. **r3 adds performance efficiency** (time behaviour, resource use, capacity), because Dann's fourth purpose asks for footprint and speed and maintainability does not test for either. Depth follows the hotspot ranking in section 5, not a flat pass.
- **The test a comment must pass: does it curate the code for a future developer?** The three purposes of `code-conventions.md` section 5 (purpose, function, consequence) are how that test is met, not a second standard beside it. A comment that curates nothing for a reader arriving cold comes out. A comment carrying one of Dann's rulings stays, with its date and words, because those are what a reader cannot reconstruct.
- **The method: refactoring in Fowler's sense** for everything that preserves behaviour, with characterization tests first where behaviour is unpinned (Feathers). **Behaviour changes are a separate class and are not called refactoring:** each gets its own lane, its own before-and-after, and a line saying what a singer reads differently.
- **Four tiers, each its own lane:** tier 1, proven-dead code, comments, renames inside a file; tier 2, moves across modules; tier 3, splitting the ratcheted hotspots; **tier 4, new in r3, the behaviour defects**, ordered by what a singer meets. **AMENDED IN r5, corrected in r8:** tiers 2 and 3 move and split toward the framework chosen at step 7. r4 had tier 3 splitting a file because its ratchet ceiling was full, which is size pressure rather than design. r4 had tier 3 splitting a file because its ratchet ceiling was full, which is size pressure rather than design, and a file split under size pressure lands wherever the knife fell.
- **The shape of the whole is a deliverable, and it is FOUND AFTER THE READ. Ruled by Dann 2026-11-23 20:45; r5 and r6 had it the other way round and he struck that.** Sixteen local reads do not sum to a view of the whole, so something must build one: that is step 6, working from completed reads rather than from a prior guess. Steps 7 to 10 are carried out against what step 6 finds.
- **Relationships become checks before prose:** a test or a ratchet line first; then a comment; then a decision record in `docs/decisions/`, at most about a dozen.
- **Tools give candidates, a reader gives the verdict.** No deletion rests on a tool alone.

## 4. Scope, and what is fixed

**Read and refactored:** `apps/web/src/lib`, `apps/web/src/routes`, the four packages, `scripts/`, and the tests.

**Read for structure only:** `LearnContent.svelte`, `GuideContent.svelte`, and `i18n.ts`. Their words belong to the GUIDE and LEARN rewrite that follows this pass.

**Read for boundaries only:** `third_party/homr-web` (vendored). **Classified only:** `tools/`.

**Fixed by Dann's rulings, unchanged by this pass** (`../memory/CONTRACT.md` section 8): `VocalLineEvent`; anything under `score/reconciliation/`; `analyzePerVerse`; `underlay-donor.ts` is not made the alignment engine; no second silent save site while N.27 is open; nothing derived stored; nothing into `static/` without its byte count told to Dann; no hand-rolled phonological predicate; no stored-format change; no i18n key deleted; no ratchet ceiling raised. **ONE VOWEL PER NOTE** (`CONTRACT.md` 0.1) governs every path this pass touches.

**What r2 excluded and r3 includes.** r2 section 2: *"What does not change: anything a singer sees, hears, prints, or stores."* That sentence is withdrawn for errors and contradictions, on Dann's 14:54 ruling. The nineteen behaviour defects already found (unit a D1 to D6, unit b D1 to D13) become tier 4. A ratified string still changes only as `CONTRACT.md` section 1 item 11a allows: the desk changes the text and its pin together and lists what changed.

## 4a. THE TOKEN CENSUS AND MIGRATION. Added 2026-11-21 on Dann's instruction of 20:43

**His words, transcribed as written:** *"One of my expectations in our audit/refactoring is the recitifcation of this. Can we articulated this to the thread that executes them?"* The "this" is the desk's finding of 20:4x that several hundred places in Ilya write a colour out as a literal instead of asking for the token that names it.

**Why it is in this pass and not a feature lane.** It is a pure analysability and modifiability defect, which is two of ISO/IEC 25010's maintainability sub-characteristics and already section 3's checklist. It also blocks a whole product direction: Ilya cannot carry user-selectable skins, a dark mode, or a high-contrast mode while a literal can ignore the token that is supposed to govern it. A literal is a note with its dynamic painted into the notehead: the key signature changes and the note does not follow.

**THE COUNTS, taken by the desk 2026-11-21 on `ac4bc6d8`. CORRECTED 20:4x; read the correction before using any figure.**

**The desk's first figure of 688 was wrong, and the instrument was the fault.** A grep for `#rgb` and `#rrggbb` counts `&#160;` as the colour `#160`. `&#160;` is the no-break space the French GUIDE and LEARN text puts before a colon under OQLF typography, and `LearnContent.svelte` alone holds 221 of them. **Every figure below comes from `census-colour-tokens.mjs` in this folder, which strips HTML numeric entities before matching, and which any unit re-runs rather than trusting this page.**

- **299 colour literals**, outside `apps/web/src/app.css`, in `.svelte` and `.ts`, not tests, across **52 files**.
- **177 of them, 59 percent, are exactly a value an existing token already holds.** They are mechanical: `--ink-primary` 65, `--ink-secondary` 34, `--paper-cream` 23, `--ink-tertiary` 17, `--paper-light` 12, `--stone-300` 12, `--stone-500` 7, `--ink-stave` 3, `--drawer-bg` 2, `--desk-surface` 2.
- **122 need a judgement.** They sit mostly in three files: `routes/+page.svelte` 21, `components/Drawer/InspectorPanel.svelte` 18, `voice/engine/capture-file.ts` 16. The rest are in ones and twos across 30 files. The most repeated unmatched value is `#fff`, 29 times.
- **25 hard-coded `font-family` declarations** outside `app.css`, not tests, not reading a custom property. **8 of them name `'Lato IPA'`**, across 10 files, so the IPA face cannot be changed from one place.
- `app.css` holds **67 custom-property definitions, 66 unique names**; 48 of them carry a hex value.

**THE CENSUS IS A SCRIPT, NOT A TABLE** (Dann 2026-11-21 20:47, transcribed as written: *"This is going to change with the refactoring, right?: 'every literal, where it is, and whether a token already holds that exact value.'"* He is right.) A table of file and line goes stale the moment a refactor moves a line. So: `census-colour-tokens.mjs` is seated into `scripts/` by the first unit that lands, it is re-run at every close, and **its total enters `scripts/ratchets.mjs` at 299 so the count can fall and cannot rise**, the same mechanism section 9 item 8 uses for duplication. Any point-in-time table is for planning only and is never the source of a figure.

**WHAT EACH READING UNIT NOW OWES, in its packet.** One table, every literal in its files, each classified into exactly one of three:

1. **MIGRATE.** A token already exists that means this. Give the literal, its `path:line`, and the token it becomes. These are tier 1 and travel in the unit's own lane.
2. **NEEDS A TOKEN.** The value is thematic but no token names it. Propose the name and say which of the five hue families or ink tiers it belongs to. **Do not invent a sixth hue family.** A proposed name is the desk's to approve.
3. **LOCAL BY RIGHT.** The value is genuinely not thematic: a test expectation, a print-only value, a one-off mark whose colour carries no idea. **Each one carries its reason in the table.** A literal with no reason is not in this class.

**THE RULE THE MIGRATION MUST NOT BREAK** (`apps/web/src/app.css:33-41`, ratified 2026-10-30): a hue names one idea. sage the words (TEXT, INPUT); lavender the melody (MELODY, VOICE, the Loupe, the turning noteheads); rose your voice (INSIGHTS); cobalt information (GUIDE, and PIECE's drawer header); slate the book (LEARN). **A migration never moves a value to a hue that names a different idea in order to tidy the table.** Where a literal does not fit any of the five, it is class 2 or class 3, never a forced fit. `docs/memory/PRODUCT.md:1233` still quotes an older comment saying "umber the book"; the tree is current and that line is stale.

**ALSO IN SCOPE, because a skin cannot work without them:** every hard-coded `font-family`, by the same three classes, with the IPA face treated as one token and not eight; and the absence of a focus-ring token, which the desk found has no name at all although `--sage` is used for the ring in several places.

**NOT IN SCOPE for this pass:** building the switch, writing any skin, and the `data-skin` attribute. This pass makes a skin possible; it does not make one.

**BACK-FILL, owed and named.** Units a and b were read on 2026-11-19, before this section existed. They owe this table and nothing else of it, which is a grep and a classification rather than a re-read. Their packets are amended in place.

**THE RATCHET.** The literal count enters `scripts/ratchets.mjs` at its measured figure the first time a unit lands, so it can fall and cannot rise, the same mechanism section 9 item 8 uses for duplication.

## 5. The ten steps

**Ruled by Dann 2026-11-23 20:45: the shape is found after the read, never designed before it and never derived from the folder tree.** The order merges his sequence with the literature's own recommended order, which were formed independently and agree everywhere but on where measurement sits.

**Nothing in steps 1 to 5 waits on Dann** (Fable amendment 5). The model at its current draft is what the reads use; his ruling improves it and does not gate it.

### Step 1. Fix the units, build the instruments, and admit what they cannot do

**THE FROZEN AREA MAP COMES FIRST, and without it no measure means anything** (Fable blocker 4). Every measure in this plan counts something per module, component, or area, and this plan splits files, so a unit that moves invalidates its own before and after. So: **a map of base commit `b2869772`, file to top-level area, where any file created by a later split inherits its parent's area.** Every measure is then reported at two grains, the file and the frozen area. The research asks for this in its own words, hold the unit of analysis fixed.

**Then phase 0's owed half** (section 5a lists what phase 0 already measured and what it still owes): the import graph, the keep-list, whether `knip` runs here, the per-unit Sonnet packets, the behaviour baseline, and the performance baseline, the last two defined in section 5a.

**THE FILE-COUNT TRAP.** A dependency-derived modularity figure can fall as a system's file count changes, and this plan splits files. **So the file count, the edge count, and the density are reported beside the figure every time it is taken, and a figure reported alone is not evidence.** Absolute values carry no meaning across systems; only Ilya against Ilya, at a fixed unit, does. Provenance, because r7 overstated it: the authors of the propagation-cost measure noted that a fall in clustered cost came partly from fewer files, and their figures of 17.35 and 2.78 per cent are from a working paper whose published version was not obtained; the general size sensitivity is from Pisch et al. 2024, read in part; **the application to file splits is the researcher's inference and the desk's, not a published finding.**

**THE TEST OF TRUST FOR THE GRAPH** (Fable amendment 2), because "trustworthy" is otherwise undecidable: run the tool over the files of units d, g, and h, and compare its edges against the imports and the hidden relationships those three filed reads already record. File the result with the known blind spots beside it: the 142 tests that read source as text, and every entry on the keep-list.

**WHAT HAPPENS IF THE GRAPH CANNOT BE TRUSTED.** Not "the Parnas count carries the weight alone", which was r7's sentence and does not hold. What survives is: step 4's hand-made table of boundary crossings, the Parnas count at the frozen grain, the duplication census, the stay count, and the stranger's verdict taken twice. **That is enough to run the audit and to show a before and an after. It is not enough to report a modularity figure, and in that case none is reported.**

**NOT ESTABLISHED, and more than this step rests on it:** whether any tool extracts a trustworthy dependency graph from TypeScript and Svelte. Step 5 needs a source model, done-when item 4 needs `knip`, and item 11's closing clause needs the layering ratchet to carry dependency rules.

### Step 2. The model of what Ilya does for a singer

**FILED at `../memory/OPEN.md`, "WHAT ILYA DOES FOR A SINGER: THE MODEL".** Drafted by the desk 2026-11-23 21:0x on Dann's instruction of 21:07, from his own words in `../memory/PRODUCT.md`, the GUIDE's contributors section, and his Builder's Note; corrected by him at 21:18 and 21:22. Sixteen things Ilya has and shows, with his purpose line above them: **eliminating barriers to Cyrillic literacy, and barriers to accessing quality scholarly tools.**

**IT IS A HYPOTHESIS TO BE TESTED, NEVER A TARGET TO BE BUILT** (Fable amendment 6). It carries five dependency rules written before the read. As the thing step 5 compares the code against, that is exactly what the method asks for. **As an answer at step 7 it would be the design-before-the-read that Dann struck, so a framework at step 7 that simply reproduces the model's boxes is flagged for a second look rather than accepted.**

**Its completeness test runs from both sides:** if a real part of Ilya has no box, the model is wrong rather than the code; and every heading a singer can reach in GUIDE and LEARN maps to at least one box.

### Step 3. What is likely to change about Ilya

**Parnas 1972, read in full.** His criterion needs no tooling: list the design decisions most likely to change, then count how many units each change would touch. A good division means a likely change lands in one place.

**Its value here, and this is the desk's assessment rather than the paper's claim:** it measures what matters to whoever will make the changes rather than what is convenient to count, and it needs no dependency graph. **It does not escape the unit problem**, which is why step 1 fixes the grain first; r7 claimed it "survives the file-count trap entirely" and that was wrong. The paper's own limits: one small example, and the author's own description of the judgement as subjective.

**THE SCENARIO LIST IS FROZEN AT THIS STEP** and every later count is taken against the frozen list.

**Who writes it.** The desk drafts it from the seventeen duplicated facts of section 5a and from `PRODUCT.md`. **Dann sees it once, as one message, to strike or add**, because he knows which changes are live and the desk does not. Four candidates, offered by the desk and not yet his: another transcription language, a different published reference for resonances, a new kind of notation, a replacement for the scan reader.

**The first count is taken on the base commit after step 4**, with a path per scenario as its evidence, because where a decision lives is unknown for the eleven unread units. The last is taken at close by the same protocol.

### Step 4. Read everything

**Unchanged, and it is Dann's ruling of 2026-11-18 22:47:** Fable reads all the source, whole and untiered, because this is the last look before GUIDE and LEARN are finalized. Five of sixteen areas are read. **What a unit read returns is in section 5b**, unchanged from r6.

**Each read also answers the same four questions, so sixteen reports compose rather than standing as sixteen opinions:**
1. What each file is for.
2. Which of the model's boxes each file's capabilities belong to. **The answer is a per-file table, one row per file.**
3. Which imports, shared class names, or shared constants cross a boundary. **The boundaries are the model's sixteen boxes and its five dependency rules, plus the present top-level folders** (Fable amendment 7); no framework exists during the read.
4. Which files serve no box at all, **and which boxes this area has no good home for.** Unit d shows why both halves are needed: `routes/+page.svelte` owns no rule of its own by intent and is 5,533 lines of joining.

**The back-fill for the five read units:** d, g, and h answer from their filed reads; **a and b need a short return to the source**, since neither filed a glossary section, and it is costed as such.

### Step 5. Map the code onto the model

**This is a reflexion model** (Murphy and Notkin; both sources read in part, not in full): state a high-level model, map the source onto it, and read back convergence, divergence, and absence.

**WHAT IS PARTIAL, PRECISELY** (Fable amendment 3). Step 4's second question already maps every file to a box, so **the file-to-box map is complete by the end of step 4 and step 5 never leaves a file unplaced.** What is partial is the reading of ARCS: convergence, divergence, and absence against the model's five dependency rules.

**THE STOPPING RULE, which "stops when it stops surprising us" was not:**
1. The order is fixed in advance: the hotspot ranking of section 5a, then every area holding a decision on step 3's frozen list.
2. Before each area, the mapper writes one line predicting what the arcs will show.
3. The mapping stops when **two consecutive areas produce no divergence of a kind not already listed, and no change to the list of likely changes**, and never before the ranked hotspots and the listed decisions are covered.
4. The stop is filed with the areas left unread for arcs, and either reader at step 6 may call for one of them.

The figure of two is Fable's suggestion and has no source.

**IF THERE IS NO GRAPH** (Fable amendment 1): the method needs a source model extracted from the code. The fallback is already in the plan, step 4's third question, which yields a hand-made table of crossings. A hand-made source model finds only what a reader noticed, and the report says so.

**Two limits of the method:** it is syntactic, so it finds structural divergence and never semantic error; and whoever states the model is responsible for the comparison being fair. The only solo precedent in the literature the research reached is one Microsoft engineer on Excel over four weeks, with a mapping of more than 1,600 entries; the report names a second, weaker one, and both are read in part.

### Step 6. The two shapes, and the contrast with better

**Two readers, independently, build a candidate shape from the completed reads and the mapping.** This is r6's two-draft idea, moved to where it earns its cost: both readers now work from the full evidence rather than from a shared prior guess.

**WHAT EACH RECEIVES, AND WHY AGREEMENT MUST BE READ CAREFULLY** (Fable blocker 3). Both hold the model, whose grouping is the desk's by its own account, and the mapping made against it, and both have read reports organized by the present tree. **So two readers can agree because of what they were given, and can return the present tree tidied.** The comparison rule below is written before either shape is opened:
- **Agreement on a generic layer settles nothing** and is recorded as such. A core, a domain layer, and an interface layer is a statement about software, not about Ilya.
- **Agreement that reproduces the model's own boxes is recorded as agreement with a shared input**, not as evidence about Ilya.
- **A shared departure from BOTH the present tree and the model is the finding with the most weight in the phase.**
- The comparison reports separately where both shapes match the present tree.
- **Each shape is scored by the Parnas count on the frozen list** of step 3, which is the one test that does not depend on what either reader was given.

**Each reader also answers the four probe questions**, which are worth more after the read than before it because they can now be answered from evidence: the one home of each of the seventeen duplicated facts; where the composition code of `routes/+page.svelte` lives; what a developer arriving to improve Corrections opens, and in what order; and whether the shape admits a capability belonging to no module.

**THE CONTRAST WITH BETTER, Dann's own step of 20:45.** How comparable projects organize themselves, what in that is actually better, and what is better only for somebody with a different problem. **The test of "better" is the plan's own instrument: an organization seen elsewhere is better for Ilya when it lowers Ilya's Parnas count on the frozen list.** The research obtained no source arguing feature against layer and studied no comparable project, so this is a fresh reading and it is costed as one pass, with a second only if the first returns a candidate worth testing. Foote and Yoder is cited for the sections the research actually read: Shearing Layers, Sweeping It Under the Rug, and Reconstruction, and its warning that a rewrite is the last resort rather than the ambitious option.

**One Fable read reviews the desk's judgements between the two shapes before step 7 binds** (`CONTRACT.md` section 1 item 19; this is r5's amendment 10, which r7 lost).

### Step 7. Choose the framework, and say why

**The desk chooses, on the comparison and the Fable read of it. Dann reads it in words and does not choose between file trees** (`CONTRACT.md` section 1 items 3 and 4).

**EVERY MOVE IS PRICED** (Fable blocker 3, restoring r5's blocker 4): in importers of the file; in how many of the 142 tests that read source as text name it; in whether `CONTRACT.md` section 8 fixes it in place; and in ratchet headroom.

**THE STAY COUNT.** Every file that stays where it is with a reason is counted. The count and its share of all files are filed here and again at close and reach Dann in one line each time, so a pass that produces a fine document and moves nothing is visible as that.

**THE REVERSAL CONDITION, repaired.** Added 2026-11-23 21:27 on Dann's question of whether the plan can answer unexpected outcomes; r7's version settled by declaration what needs a judgement, and counted three of anything.

**Every stop report names its class, and the desk classifies it, never the lane:**
1. **The framework contradicts itself or the code**: a placement that forces a cycle, a file that serves two modules.
2. **A prerequisite is missing.** Step 8's whole discipline makes this the expected first result of an attempt.
3. **The move is blocked by cost**: a path fixed by `CONTRACT.md` section 8, a text-reading test, or ratchet headroom.
4. **The lane's own error.**

**What each does.** One class 1 report reopens step 7 **for the module it names**. Class 2 is recorded as a prerequisite and reopens nothing. Class 3 becomes a stay with its reason and raises the stay count. **Three unresolved reports of any class against one module reopen that module**, as a backstop. **A second trigger sits at step 9:** a Parnas count on the frozen list that has not fallen after a module's tier 2 lanes reopens that module, which catches a framework every lane can carry out and that improves nothing.

**The framework's version is named in every lane brief**, so what a lane was built against is never in doubt. **A reopening costs one Fable session plus the cost of moving the already-moved files again**, and it is ordinary rather than a defeat, because every lane leaves Ilya working.

### Step 8. The lanes, as a chain of prerequisites

**Four tiers, and the lane rules are in section 5c**, unchanged from r6, including that Fable reviews the lane plan before any lane starts and reads each lane as built.

**Tier 1 (dead code, comments, the colour migration) and tier 4 (the behaviour defects a singer meets as wrong today) do not wait for the framework**, since neither moves a file across a boundary. **They do wait for the behaviour baseline of step 1**, which done-when item 3 holds every lane to; r7 said they waited for nothing and that was wrong (Fable amendment 11). Tiers 2 and 3 wait for step 7.

**The ordering discipline:** attempt the change, discover what it demands, record the prerequisite, work from the leaves inward, in steps small enough that Ilya is working at the end of each. **The 5,533-line page gets a boundary drawn round it first and is taken apart behind that boundary.** An attempt that fails is reverted and its prerequisite recorded; nothing half-moved is left in the tree.

**Provenance, stated because it matters:** the desk named the Mikado method to Dann for this discipline. **The research could not obtain it, so the name is withdrawn, and no source read this session supports the four clauses above.** They are the desk's own description and are marked as such.

### Step 9. Re-measure

After each group of lanes, at the frozen grain of step 1, every figure with its file count, edge count, and density beside it, and the Parnas count and the commit-log measure alongside. **The commit-log measure is thin:** the research read only its source's abstract, and whether Ilya's commit history supports a per-commit count of components touched is NOT ESTABLISHED.

A module whose Parnas count has not fallen after its tier 2 lanes reopens step 7 for that module.

### Step 10. The documents

`ARCHITECTURE.md`, the in-house glossary of section 5d, a short README per area, written from the chosen framework; then `CONTRIBUTING.md`, the decision records, the generated module map, and the header-comment test. **Every sentence not yet true of the tree is marked NOT YET TRUE and carries the lane that makes it true**, and the marks are cleared or carry a reason at close; r7 dropped the marks without saying so.

**A stranger's verdict, taken twice.** A fresh reader given nothing but the repository, five tasks with a pass mark written by someone other than the documents' author, and the question of whether this is a codebase they would be glad to inherit. **One of the five is Dann's own example:** a developer arriving to extend Corrections, where `CorrectionSurface.svelte` sits at 1,227 lines against a ceiling of 1,227. **The first reading is pinned to commit `b2869772`** and is commissioned before any tier 1 lane merges, so the second has something to compare with.

---

## 5a. THE MEASURED BASELINE, AND WHAT PHASE 0 STILL OWES

**Restored verbatim from r6, which r7 deleted while replacing a section about something else.** The five citations elsewhere in this plan that read "section 5" for these numbers point here.

**Phase 0, the map. DONE for the counting half, 2026-11-19 15:0x, on `6c0bb4fc`.**

Measured by the desk, all by script:

- **Source outside tests and docs: 134,671 lines in 552 files.** `apps/web/src/lib` 95,493 in 423 files; `score-parser` 16,993 in 47; `tools` 9,442 in 53; `routes` 5,775 in 5; `phonology` 3,188 in 12; `dictionary` 1,422 in 7; `blurb` 1,021 in 4; `scripts` 1,337 in 1.
- **Comments: 34,439 lines**, one for every 3.9 lines of code. Of them, **127 cite a line number**, against 106 when the convention was ratified on 2026-11-01, so the practice the convention forbids is still growing; **1,180 name an N. item**; **9 carry a prototype version tag**. **Zero TODO, FIXME, XXX, or HACK markers in the tree.**
- **142 test files read source as text** (`readFileSync` or `readFile`), so a rename can break a test that never imports the renamed thing.
- **The hotspot ranking, churn since 2026-08-01 times current size:** `routes/+page.svelte` 5,532 lines over 212 commits; `i18n.ts` 2,725 over 213; `Drawer.svelte` 1,986 over 53; `LearnContent.svelte` 4,097 over 21; `markup/MarkupPane.svelte` 1,349 over 47; `score/Loupe.svelte` 3,008 over 17; `Drawer/InspectorPanel.svelte` 2,396 over 18; `CalibrationWizard.svelte` 1,124 over 34; `InsightsPane.svelte` 677 over 39; `GuideContent.svelte` 657 over 39.
- **The ceilings are full.** Thirteen of the sixteen ratcheted files sit within five lines of their ceiling, and six are at it exactly: `engine.ts` 2,048 of 2,048, `Loupe.svelte` 3,008 of 3,008, `MarkupPane.svelte` 1,349 of 1,349, `CorrectionSurface.svelte` 1,227 of 1,227, `InsightsPane.svelte` 677 of 677, `mnx-parser.ts` 1,170 of 1,170. `musicxml-parser.ts` has one line spare, `+page.svelte` two, `LearnContent.svelte` two. **So no line can be added to the files that matter until a split makes room**, and unit a found the symptom from the inside: imports and statements joined onto one line in `engine.ts` to stay under the number.

**THE DUPLICATION CENSUS, added 2026-11-19 15:2x on Dann's ruling.** `../house-style/code-conventions.md` section 6, ratified by him 2026-11-01, says logic needed in two places lives in one named module both import. The tree does not meet it: **Fable's two completed unit reads found seventeen facts with two or more homes** (unit a G1, G2, G3, G4, G5, G7, H3, F4, R7, R11, R14; unit b 2, 20, 21, 22, 23, 24, 26, 27, 29), in two units of fifteen. Phase 0 counts them across the whole tree and writes the number down; every unit read adds to it; every lane that gives a fact one home lowers it. **It becomes a guard, not a good intention:** `scripts/ratchets.mjs` already holds file size, layering, and package surface to numbers that may fall and never rise, and the census joins it, so a later change that gives a fact a second home fails the gates. Dann 15:29, on the convention's own sentence: *"Hallelujah, yes!!!"*

**Still owed in phase 0:** the import graph and whether `knip` runs on this workspace; the keep-list of paths no import shows (URL switches, `__ILYA_RECORDER__`, workers and assets reached by URL, glob reads, dynamic imports, `static/sw.js`'s precache list, old-shape readers, `routes/notation-font-lab/`); **the behaviour baseline**, built at the base commit and run twice to prove it deterministic (MELODY SVG per page per fixture, TEXT for the IPA corpus, INSIGHTS figures and comments in both languages, print pages, an exported `.ilya` binder and saved-voice JSON, one hash of the sorted i18n table, the production build's file list and sizes, the `sw.js` precache list, the `static/` byte count, both Playwright projects); **a performance baseline, new in r3** (cold load, time to first drawn page, the reader's wall clock on one fixture scan, bundle and `static/` bytes); and the per-unit Sonnet packets.


---

## 5b. WHAT A UNIT READ RETURNS

Restored verbatim from r6. Done-when item 5 depends on the per-unit comment census named here.

**Phase 1b, the judgement read.** One unit at a time, Fable, all source read whole. Each finding carries the name it anchors to, the smell, the refactoring by name, its tier, the risk, and the test or baseline that proves behaviour unchanged. Each unit also returns the paragraph a developer needs, the hidden relationships, and now **the comment census for its files** against section 3's test. **A unit read may run code to settle a claim it cannot settle by reading, and marks each such claim "ran"**; both completed units did this and it is what produced unit a's behaviour defects with real words attached. Permit it in the brief in advance. **Every subagent brief says: create no `.bak` file, the bridge cannot delete one; and check with `ls` before naming a report path, because lane numbers are not unique across subjects.**


---

## 5c. THE LANES AND THEIR REVIEWS

Restored verbatim from r6, as step 8's rules. Section 7 costs the as-built reviews named here.

**The lane plan.** Findings become lanes by tier, **ordered against the framework chosen at step 7** so a tier 2 move goes where the structure says rather than where one unit's finding happened to suggest, and so no file is edited by two lanes at once. Fable reviews the plan before any lane starts. Dann reads it in words.

**Phase 3, the lanes.** Tiers 1, 2, and 4 in the cloud; tier 3 on the Mac. Fable as built on each; Dann's merge paste. A tier 1, 2, or 3 step that would change behaviour is stopped and reported; a tier 4 lane changes behaviour on purpose and says what a singer reads differently.


---

## 5d. THE IN-HOUSE GLOSSARY

Restored verbatim from r6. Step 10 names the glossary; this defines it.

**THE IN-HOUSE GLOSSARY. Dann's own idea, 2026-11-19 15:31** (transcribed as written: *"I feel like an in-house glossary can help future developers locate the part sof code that do what they want to enhance and work there, instead of straight up developing a new graft on Ilay? Likewise with us..."*). The term "in-house glossary" is his; the desk adopted it.

**What already exists, read 2026-11-19 15:3x.** `apps/web/src/lib/names.ts` (308 lines, consistency batch 1 step 2) holds one record per named part of Ilya: the i18n key of its screen name, its English and French, its code name and folder today and after batch 3, the stored values carrying a name, and the retired words a singer must never read again. `ARCHITECTURE.md`'s "Names" table is that record for people, pinned to the module by `names-table.test.ts`. `ARCHITECTURE.md`'s "Where to start" holds six task-shaped entries, including "to find the code behind something on screen, search `i18n.ts` for the words and follow the key".

**The gap his idea fills.** Those cover the parts a singer can point at: TEXT, MELODY, the bands. They do not cover the capabilities underneath, which is what a developer arrives wanting to change: where Ilya decides which vowel a note takes, where it decides a note is held, where it decides a tempo, where it places a hyphen at a line end, where it chooses a clef. **Those are also, exactly, where the duplication lives**: every one of the seventeen is a capability with more than one home.

**So the glossary and the census are one piece of work seen from two sides.** A glossary cannot say "the one home of X" while X has three homes; and giving X one home is worth little if nobody can find it. The audit does both in the same pass: each lane that gives a fact one home writes that fact's glossary line in the same commit, and the census drops by one. **The glossary line is the proof the lane finished**, and `ratchets.mjs` holds the count so a later second home fails the gates.

**Its shape, DESK DEFAULT:** one line per capability, in a singer's words first and the code's second, naming the module and nothing finer, because a line number goes stale and a module does not. It lives beside the Names table in `ARCHITECTURE.md` and is checked by a test, as the Names table already is.


---

## 5e. WHAT THE RESEARCH CHANGED, AND WHAT IT COULD NOT SETTLE

**Report:** `research-n204-sources_r1_2026-11-23.md` (Sonnet, 240,258 tokens, 74 tool uses, 9.8 min). **Its weakness stated first: 3 sources read in full, 11 in part, 12 NOT OBTAINED**, mostly paywalled. By Dann's full-read rule of 2026-11-16 most of it is a lead. **Parnas 1972 is read in full. The reflexion-model sources are read in part**, which r7's section 3a obscured.

**Earned their place:** reflexion models (step 5), the modularity measure under the conditions of step 1, Parnas 1972 (step 3), and Foote and Yoder for the three sections the research read (step 6).

**Did not:** architecture reconstruction as a tool to run, since automatic recovery has no validated ground truth; it survives as vocabulary. **The Mikado method, NOT OBTAINED, name withdrawn.** "Core size" appears in nothing read and is NOT ESTABLISHED.

**Thin but kept:** the in-house glossary. The 2025 systematic review reports communication benefits and little empirical evaluation. It is cheap, and it is Dann's own idea.

**The caveat over all of it: no source tests any of these methods on a project with one developer.** The study linking modularity to maintenance burden used projects with at least twenty committing developers. **Also unknown: the cost of keeping a mapping current.**

**Sources saved:** 18 files in `~/Downloads/_desk-2026-11-23/n204-sources/`. Filing them into Dann's library needs a folder grant and a computer-science subfolder rather than the author folders; a desk proposal, his to change.

## 6. The order, and the reading units

**THE ORDER, rewritten in r8 against the ten steps of section 5.** Step 1's frozen area map, then the import graph and the tool trial, then the baselines; step 2 is already drafted and filed; step 3's frozen scenario list, drafted by the desk and seen once by Dann; step 4's nine remaining Fable units and two Sonnet units, two at a time; step 5's mapping on the fixed order of its stopping rule; **step 6's two readers, which take both helper slots, so no unit read runs beside them**; the Fable read of the desk's judgements; step 7; then steps 8 to 10. **Tier 1 and tier 4 lanes run from the moment the behaviour baseline exists and wait for no later step.**

**Consistency batch 3 and unit l, CORRECTED IN r6.** r5 carried the 2026-11-19 position, that batch 3 had not run and that `melody/` did not exist. **Its first slice shipped as N.211 in `ac06d520` on 2026-11-23**, so `apps/web/src/lib/melody/` exists, `markup/` does not, and the folder gate on unit l is cleared. **DESK DEFAULT: unit l may be read now.** The four renames that remain in batch 3 are identifiers, the stored tab id, the `guide-markup-*` anchors, and `tab.markedScore`, none of which moves a file, so a unit read notes them as tier 1 work rather than waiting on them. The three parts of the comment convention that waited on batch 3 (the generated module map, the header-comment test, and the line-number sweep) are now free.

| unit | what | source | state |
|---|---|---|---|
| a | `packages/phonology`, `dictionary`, `blurb` | 71k | **READ** 2026-11-19, 62 findings, 0 blockers, 6 behaviour defects |
| b | `score-parser`: parsers and analysis | 112k | **READ** 2026-11-19, 35 findings, 6 blockers, 13 behaviour defects |
| c | `score-parser`: renderer and layout | about 110k | after lane 56's second follow-up merges |
| d | `apps/web/src/routes` | **about 265k**, corrected in r6 from 75k by the filed read | **READ** 2026-11-22, `read-fable-n204-unit-d_r1_2026-11-22.md` |
| e | `score/`: Loupe and correction | about 140k | ready |
| f | `score/`: the rest | about 140k | ready |
| g | `components/Drawer/` | 109k | **READ** 2026-11-22, `read-fable-n204-unit-g_r1_2026-11-22.md` |
| h | `Paper/`, `Welcome/`, `Field/`, loose components | about 85k | **READ** 2026-11-22, `read-fable-n204-unit-h_r1_2026-11-22.md`, 49 of 49 files whole |
| i | `voice/engine`, `voice/chart` | about 90k | after N.200 settles |
| j | `voice/`, the rest | about 45k | ready |
| k | `omr/` | 113k | ready |
| l | `insights/`, `analysis/`, `melody/`, `tempo/` | about 140k | ready; the folder gate cleared by N.211 |
| m | `library/`, `text/` | about 100k | ready |
| n | `reader/` and the top-level `lib/*.ts` | about 140k | ready |
| o | `tools/`, `scripts/` | 107k | any time, Sonnet |
| t | the tests | about 1.1M | Sonnet with a dead-fixture script; Fable samples what Sonnet flags |

**Two units run at once**, which is the ceiling and halves the wall clock without changing the cost. **No unit runs during step 6's two readers**, who take both slots.

## 7. Cost, from actuals

**The two completed reads are the rates.** Unit a: 300,258 Fable tokens for 71k of source, 4.2 times. Unit b: 367,358 for 112k, 3.3 times. Both complete, every file read whole.

- **Step 4, the NINE Fable units remaining** (corrected in r6 from r4's twelve; five units are read and two of the remainder are Sonnet's): about 1,018k of source at 3.3 to 4 times gives **3.4M to 4.1M**. With five units already spent, **step 4 totals about 4.9M to 5.3M Fable tokens.** **The per-unit sizes other than d's are NOT ESTABLISHED**; d's column entry was wrong by about 3.5 times, so the others are not trusted until checked. **r2 estimated 2.6M to 3.4M for all of phase 1, so r2 was low by about half again.**
- **Phase 0's remainder:** the Sonnet packets, 1.6M to 2.8M Sonnet.
- **Step 1's tool trial and frozen area map:** one Sonnet session, **0.15M to 0.25M**, first of its kind.
- **Step 3's scenario list:** desk work, drafted from section 5a's seventeen facts and `PRODUCT.md`. No helper.
- **Step 5's mapping:** one Fable session over the completed reads and the model, not over source again, **0.30M to 0.37M**, quoted at a unit read's measured range and capped at the top of it.
- **Step 6's two readers:** one Fable and one Opus, independent, **0.30M to 0.37M** each. **Only the Fable half draws on the weekly Fable allowance.** Plus the contrast with comparable projects, one Sonnet research pass, **0.25M to 0.35M**, quoted from the 2026-11-23 research actual of 0.24M, and a second pass only if the first returns a candidate worth testing.
- **The Fable read of the desk's judgements, before step 7 binds:** **0.15M to 0.19M**, quoted from this evening's two plan reviews, 0.14M and 0.17M actual.
- **The stranger's verdict, taken twice:** one Sonnet session each, **0.1M to 0.2M**, first of its kind.
- **A reopening at step 7:** one Fable session at the step 6 rate, **plus the cost of moving the already-moved files a second time**, which is not quotable until a framework exists.
- **THE TOTAL OUTSIDE THE READS.** The sessions above come to about **1.45M to 1.9M**, of which **0.75M to 0.93M touches Fable's weekly allowance**. Against step 4's 4.9M to 5.3M that is **27 to 39 per cent**, and the Fable share alone is 14 to 19 per cent. **Every figure here is first-of-its-kind except the two quoted from this evening's actuals, and `CONTRACT.md` section 4 requires each to be marked as such.** **r5 said "about four per cent", and this desk told Dann "about three per cent" and then "about four per cent" in chat on 2026-11-23. All three were wrong and they are the desk's error. The figure also rose between r5 and r6, because r6 adds the scout of step 1 that r5 had left uncosted.** The design is still worth buying at the true price, and the true price is what goes in the record.
- **Phase 2:** 0.3M to 0.4M. **Phase 3:** 0.3M to 0.4M a Fable as-built review per lane, over perhaps eight to twelve lanes now that tier 4 exists.
- **Against the allowance:** Fable's weekly allowance measures near 7M (`../memory/ENVIRONMENT.md`, LEARNED BY THE 2026-11-19 DESK; a desk inference from two points). **Phase 1 alone is most of one week**, and the release lanes need Fable reviews from the same pool.
- Never more than two helpers at once. Every farm-out states its worst case first.

**The date. NOT SET, and naming it is the desk's debt.** r4 carried Friday 2026-11-27 here, which was two dates stale: it moved to Friday 2026-12-19 on 2026-11-22 at 04:2x, and that date was struck the same evening at 19:2x when Dann ruled that phases 2, 3, and 4 land before the release (`../memory/SCHEDULE.md`). No date has been named since, and by that file's own rule one date is named, never a range, now that he has ruled the whole after-release list. `CONTRACT.md` section 1 item 7: the date never sizes the work, and when they disagree the date moves. **DESK DEFAULT: plan the audit at its full size and let the date fall where it falls.** Dann's to overrule, and his alone.

## 8. The desk's decision rights inside this work

Ruled by Dann 2026-11-19 14:59. **The desk resolves a contradiction itself by applying "the user experience is paramount", and brings Dann only what that principle cannot resolve.**

**Resolved by the desk, no question asked:** which of two inconsistent sentences a singer reads; which of two disagreeing comments is true; naming; presentation; a page that says the same thing twice; a row that shows a raw mapping where a sentence belongs; every tier 1, 2, and 3 finding; the amendment of `code-conventions.md` where a rule is not serving a reader, with a list of what changed.

**Brought to Dann, one at a time:** a question of fact about sung Russian, where a singer's experience cannot decide what is correct (unit a D1, the soft velar's voicing; D3's vowel before a stage-hard velar, ruled 13:58); French, under `CONTRACT.md` section 7; anything irreversible, costing money, or going out under his name, under section 1 item 4; and a merge paste per lane.

## 9. Done when

1. Every unit has a filed packet and a filed read.
2. Every finding is applied, declined with a reason, or put to Dann.
3. After every lane: the eight gates at baseline with every count change said; the behaviour baseline equal byte for byte except the listed intended differences, **and for a tier 4 lane the differences are the point and each is named in singer's words**; both Playwright projects pass; every ratchet ceiling at or below its start; bundle and `static/` sizes reported against the performance baseline.
4. `knip` reports nothing unused outside the keep-list.
5. No comment cites a line number; the header-comment test exists and passes; **the comment census falls by at least the sum of the unit censuses** rather than merely below 34,439, which a single deleted line would satisfy. **CHANGED IN r5, REPAIRED IN r6 on Fable's amendment 7 and its arithmetic.** r4 required that every remaining comment pass section 3's test, a judgement on roughly 34,000 lines that nothing made checkable. r5 made it a sample of 200 and hung a per-unit consequence on it, which does not work: 200 across sixteen units is about twelve each, and a unit whose comments truly pass at 90 per cent shows two or more failures in twelve about one time in three, so the consequence would fire on chance. So:
   - **The tree-wide rate:** one sample of 200 comment blocks, filed with its interval. At a true rate of 90 per cent the standard error is about 2.1 points, so the figure is good to about 4 points either way and supports a claim of about nine in ten.
   - **The per-unit consequence:** a separate sample of **thirty blocks per Fable unit**, and a unit goes back at **seven or more failures**. A unit truly at 90 per cent then goes back about 3 times in 100 and a unit truly at 70 per cent passes about 16 times in 100. **The script prints the table so nobody trusts this page for it.**
   - **The sampled thing is a comment block, not a line**, drawn by a seeded script seated in `scripts/` so a draw can be repeated. **The frame excludes** `LearnContent.svelte`, `GuideContent.svelte`, and `i18n.ts`, which section 4 reads for structure only, and the vendored `third_party/homr-web`.
   - **A false comment sends its unit back whatever the rate.** Section 2 promises no comment that is false, unit d found thirteen in one file, and after the change above no other done-when carries that promise.
   - **The rater is named in the brief**, is a reader who did not write the comments, and is instructed to open the code under each one, since the test is whether the comment tells a cold reader something the code does not.
6. `ARCHITECTURE.md`, `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, and `NOTICES.md` are true of the tree, shown by a filed table of claim, file, and verdict made by a reader who did not write them.
7. Five developer tasks and their pass mark, written after step 7 and before step 10, by an agent other than the documents' author; a fresh Sonnet agent given only the repository finds the right files for each. **ONE OF THE FIVE IS DANN'S OWN EXAMPLE** (Fable's amendment 8): a developer who arrives to extend Corrections finds what to open and can add to it. Section 1 records his hope for Corrections and section 5 records `CorrectionSurface.svelte` at 1,227 lines against a ceiling of 1,227, so the task is where the hope becomes testable. **What a ratchet ceiling becomes after a split is NOT ESTABLISHED** and is settled before the first tier 3 lane: a ceiling re-pinned to the new file's exact size leaves it full again the day the lane lands. **WIDENED IN r5, against Dann's standard of 2026-11-23 20:22, and TAKEN TWICE in r6 on Fable's amendment 9.** The same fresh reader, having never seen Ilya, also answers whether this is a codebase they would be glad to inherit, and names what stopped them. **The reading is taken once on the tree as it stands now, before any of this work, and again at close**, because one reading of it has nothing to be compared with and the difference is what Dann reads. Pride in sharing is a judgement someone makes on first contact, so the instrument is someone making it on first contact. The answer is filed whatever it says. **It is a verdict and not a gate:** one reader's taste never blocks a release; what it does is tell Dann what a stranger sees.
8. The duplication census is lower than its phase 0 figure, every remaining duplication is named with a reason, and the count is ratcheted in `scripts/ratchets.mjs` so it cannot rise.
9. **New in r3:** no singer-visible sentence contradicts another on the same page, and the nineteen behaviour defects are each fixed, declined with a reason, or ruled by Dann.

10. **New in r4:** every unit has filed its token table; every class 1 literal is migrated; every class 2 has a token or a ruling; every class 3 carries its reason; the IPA face is one token; a focus-ring token exists; and the literal count is ratcheted below its starting figure of 299, measured by `census-colour-tokens.mjs`.

11. **New in r5; rewritten in r8 on Fable's blocker 1, because r7's version named events that no longer exist and was therefore unmeetable.**
    - The model is filed with every term Dann ruled on marked as his, and the rest marked DESK DEFAULT. He is not the gate on any line of it.
    - **The two shapes of step 6 and their comparison are filed**, with agreement on a generic layer and agreement reproducing the model recorded as settling nothing, and the shared departures from both the tree and the model named.
    - **The framework of step 7 names its version and names the Fable read that reviewed the desk's judgements before it bound.**
    - Every current file is placed on it or stays where it is with a written reason and a priced cost, and **the stay count is filed at step 7 and at close, as a number and a share.**
    - **THE TREE MATCHES THE TARGET, not only the table.** At close, step 10's generated module map equals the framework's file table, checked by a test, and every dependency rule the framework states is a line in the layering ratchet `scripts/ratchets.mjs` already carries. Section 3 says relationships become checks before prose; this is where the framework is held to it. Without this clause the whole of item 11 is satisfiable while nothing in the tree moves.

## 10. NOT ESTABLISHED

**Closed since r2:** the status of consistency batch 3 (it has not run); what the token figures are as a share of Dann's weekly Fable limit (phase 1 is about 70 to 76 percent of one week); the hotspot ranking (measured, section 5); the comment counts (measured, section 5).

**Still open:**
- Whether `knip` runs on this workspace.
- The token-per-byte ratio for the unread units, so their token figures are estimates from two actuals.
- Whether a fixture binder from a released build exists, to test old stored data.
- Whether any test hears sound (`voice/count-in.ts`).
- Whether the performance baseline can be taken reproducibly in the cloud workspace, whose timings are not the Mac's.
- The twenty-odd NOT ESTABLISHED items the completed unit reads each filed, listed at the end of their own reports.

**Added in r6, from Fable's review of r5, nine items:**
- How many lines the capability list holds. Unit d filed 23 for five files; the whole-tree figure is not known, and the list's length is what decides whether step 1's cost estimate holds.
- Whether any Sonnet packet exists for an unread unit. Only the phase 0 report's "still owed" line has been read.
- How `scripts/ratchets.mjs` sets a ceiling after a file shrinks, which done-when item 7 now needs before the first tier 3 lane.
- Whether the layering ratchet can express the dependency rules a framework would state, which item 11's closing clause rests on.
- Whether `INBOX.md` at 2026-11-23 20:26 carries more than the one sentence this plan quotes.
- Whether units g and h carry per-file placements beyond their glossary sections.
- The true size of every unit other than d, whose column entry was wrong by about 3.5 times. The closing section's "about 452k of roughly 2,677k" rests on the uncorrected column and is not trusted.
- Whether the 34,439 comment lines include `LearnContent.svelte`, `GuideContent.svelte`, and `i18n.ts`. The frame in done-when item 5 excludes them; whether the baseline did is unknown, so the two figures may not be comparable.
- Whether the model can be checked against the seven unread areas (`voice/`, `omr/`, `reader/`, `insights/`, `library/`, `text/`, and all of `score/`) before step 4 reaches them.

**Added in r8, from Fable's review of r7:**
- Whether any tool extracts a trustworthy dependency graph from TypeScript and Svelte. Step 1's test of trust is what settles it, and steps 1, 5, and done-when items 4 and 11 all rest on the answer.
- Whether Ilya's commit history supports a per-commit count of components touched. The research read only the abstract of that measure's source.
- Whether the model's sixteen boxes and five dependency rules are fit for a reflexion comparison. It has been read once and never reviewed.
- Which comparable projects step 6 would read, and whether any exists for a solo, bilingual, browser-based tool of this kind.
- Whether the generated module map and the layering ratchet can carry item 11's tree-state clause. Carried from the r5 review, still open.
- The arithmetic of step 5's stopping rule (two consecutive areas) and step 7's backstop (three reports). Both figures are Fable's suggestions with no source.
- The cost of keeping a mapping current, which the research names and no source answers.

---

## Phase 1 progress, ticked by the desk 2026-11-22 21:4x

**Five of sixteen units read: a, b, d, g, h.** The table above was stale for d, g, and h, which were read on 2026-11-22 and filed; corrected in the same pass. Phases 2, 3, and 4 have not started.

By the table's own size column, about 452k of roughly 2,677k is read, so **under a fifth of phase 1 by volume**. Of the remainder, unit t (the tests, about 1.1M) and unit o (107k) go to Sonnet; the Fable-side remainder across c, e, f, i, j, k, l, m, n is about 1,018k.

**Three units are gated, and two of those gates moved on 2026-11-22.** `c` waits on lane 56's second follow-up merging. `i` waits on N.200 settling, which moved a long way that night with Dann's 31 takes and the reference diagnosis. `l` waits on consistency batch 3, which is first in the desk's Track 1 order, so it clears early.

**Eight units are ready and ungated: e, f, j, k, m, n, o, t.**

**r8 adds one back-fill to these five:** step 4's four questions (section 5). For d, g, and h it is a pass over their filed reads; **for a and b it is a short return to the source**, because neither filed a glossary section for the pass to stand on.

**Dann ruled 2026-11-22 19:11 that phases 2 and 3, the refactoring itself, land BEFORE the release**, so this plan is on the critical path rather than beside it. No date is set and the desk makes no forecast. The binding constraints are Fable's weekly allowance for the judgement reads and Dann's attention for the rulings they produce.
