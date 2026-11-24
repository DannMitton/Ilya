# Plan: the code audit and one refactoring pass (r7)

**r7, written by the desk (Opus 5) 2026-11-23 21:3x. r7 replaces r6.** Two things changed it.

**1. Dann's ruling of 2026-11-23 20:45.** r5 and r6 designed the framework before the code was read, and built elaborate machinery to survive designing early. He struck that, transcribed as written: *"isbn't this the purpose of the audit? Why do you need a paradiogm in mind right now at the outset? Why not let the content speak to its own organization? can't you accomplish the audit, then consider its shape, then contrast that with similar code that features various aspects of \"better\": until one makes sense for ILya, then implement it and make it work? Why are you presenting static bliockers when dynamic plasticity is ultimately responsive?"* **The shape is found after the read, not designed before it.** Phase 1a's provisional framework, its two pre-read drafters, its probe questions, and its provisional file table are struck. What survives of them moves to step 6, where the evidence is in.

**2. Dann's ruling of 2026-11-23 20:49**, that the field has well-worn approaches for a system in Ilya's state and they are to be used, transcribed as written: *"I'm sure the filed of computer science fully recognizes an app in the current state of ILya and has well-worn approaches that will help us. Use them. Reserach if you have to, that's valid."* The research is `research-n204-sources_r1_2026-11-23.md` (Sonnet, 240,258 tokens, 74 tool uses, 9.8 min; 3 sources read in full, 11 in part, 12 NOT OBTAINED). **Section 3a carries what it changed.**

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
- **Four tiers, each its own lane:** tier 1, proven-dead code, comments, renames inside a file; tier 2, moves across modules; tier 3, splitting the ratcheted hotspots; **tier 4, new in r3, the behaviour defects**, ordered by what a singer meets. **AMENDED IN r5, corrected in r6:** tiers 2 and 3 move and split toward the framework, which is provisional at phase 1a and settled at phase 1c. r4 had tier 3 splitting a file because its ratchet ceiling was full, which is size pressure rather than design, and a file split under size pressure lands wherever the knife fell.
- **The shape of the whole is designed, never derived. New in r5.** Dann 2026-11-23 20:22: *"N.204 needs to be us coming up for that air."* Sixteen local reads do not sum to a view of the whole, and aggregating them only tidies the shape accretion produced. So the framework is designed from Ilya's capabilities (phase 1a), the unit reads test it against real code (phase 1b), and phases 2, 3, and 4 are carried out against it.
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

## 5. The steps

**Ruled by Dann 2026-11-23 20:45: the shape is found after the read.** The order below is the desk's merge of his sequence of 20:49 and the literature's own recommended order (research report section 4), which were formed independently and agree on everything but where measurement sits.

### Step 1. Build the measuring instruments, and admit what they cannot do

Phase 0's owed half: the import graph, the keep-list of code no import points at (URL switches, `__ILYA_RECORDER__`, workers and assets reached by URL, glob reads, dynamic imports, `static/sw.js`'s precache list), whether `knip` runs on this workspace, the per-unit Sonnet packets, the behaviour baseline, and the performance baseline.

**THE TRAP, AND IT IS THE RESEARCH'S MOST USEFUL FINDING.** A dependency-derived modularity figure falls on its own as a system's file count rises, and this plan splits files. The authors of the propagation-cost measure needed paired comparisons for exactly this reason during the Mozilla redesign (17.35 per cent before, 2.78 after), and Pisch et al. 2024 argue the fall is partly mechanical. **So the file count, the edge count, and the density are reported beside the figure every time it is taken**, and a figure reported alone is not evidence. Absolute values carry no meaning across systems; only Ilya against Ilya over time does.

**Two independent measures are taken beside it**, because one instrument with a known bias is not enough: a Parnas change-scenario count (step 3), and a commit-log measure of how many components an average change touches.

**NOT ESTABLISHED and this step rests on it:** whether any tool extracts a trustworthy dependency graph from TypeScript and Svelte, and whether the 142 tests that read source as text are visible to it at all. If the graph cannot be trusted, this step changes shape and the Parnas count carries the weight alone.

### Step 2. The model of what Ilya does for a singer

**DRAFTED 2026-11-23 21:0x from Dann's own words** in `../memory/PRODUCT.md`, the GUIDE's contributors section, and his Builder's Note, then corrected by him at 21:18 and 21:22. Sixteen things Ilya has and shows, with his purpose line above them: **Ilya is about eliminating barriers to Cyrillic literacy, and barriers to accessing quality scholarly tools.**

It is the thing the code is compared against at step 5. **Its own test: if a real part of Ilya has no box, the model is wrong, not the code.** Awaiting his ruling; the drafting was the desk's, on his instruction of 21:07 that his words already animate the app.

### Step 3. What is likely to change about Ilya

**Parnas 1972, read in full, and the one source of the twenty-eight that carries real weight.** His criterion for whether a system is well divided needs no tooling: list the design decisions most likely to change, then count how many modules each change would touch. A good division means a likely change lands in one place.

This is better than any dependency metric for Ilya because it measures what matters to the person who will make the changes rather than what is convenient to count, and because it survives the file-count trap of step 1 entirely.

**Its input is Dann's and briefly his**, because he knows which changes are live and the desk does not: another transcription language, a different published reference for resonances, a new kind of notation, a replacement for the scan reader. The seventeen facts that currently have more than one home start the list.

### Step 4. Read everything

Unchanged, and it is his ruling of 2026-11-18 22:47: Fable reads all the source, whole and untiered, because this is the last look before GUIDE and LEARN are finalized. Five of sixteen areas are read.

**Each read also answers the same four questions, so that sixteen reports compose instead of standing as sixteen separate opinions:** what each file is for; which of the model's capabilities live here; which imports, shared class names, or shared constants cross a boundary; and which files serve no capability at all. The answer is a per-file table. Unit d shows why the last question is needed: `routes/+page.svelte` owns no rule of its own by intent and is 5,533 lines of joining.

### Step 5. Map the code onto the model

**This is a reflexion model** (Murphy and Notkin), the method the literature already has for exactly this: state a high-level model, map the source onto it, and read back where the code converges with the model, where it diverges, and what the model names that the code lacks.

**The research corrected the desk's picture of it in a way that saves real work: THE MAPPING MAY BE PARTIAL.** It does not need all 552 files mapped before it teaches anything. So it runs on the worst areas first and **stops when it stops surprising us**, rather than running to completeness.

**His full-read ruling and the partial mapping are different things and both hold.** The read is complete because it is the last look at the code. The mapping is partial because it earns its findings early and the rest is diminishing return.

Two limits the research established and the desk had not: the method is syntactic, so it finds structural divergence and never semantic error; and whoever states the model is responsible for the comparison being fair. The only solo precedent recorded anywhere is one Microsoft engineer on Excel, over four weeks, with a mapping of more than 1,600 entries.

### Step 6. The shape, and the contrast with better

Two readers, independently, build the shape from the completed reads and the mapping. **This is where the two-draft idea of r5 belongs**: at step 2 of r5 both drafters would have worked from the same prior and agreed because of it; here they work from the same full evidence and their disagreement is informative.

**Then Dann's own step, 2026-11-23 20:45:** how comparable projects organize themselves, what in that is actually better, and what is better only for somebody with a different problem. The research found one source that names Ilya's situation directly and supplies the strategy vocabulary: Foote and Yoder on software grown piecemeal under real use, including its warning that a rewrite is the last resort rather than the ambitious option.

### Step 7. Choose the framework, and say why

Every file lands in it or stays where it is with a written reason. **The stay count**, as a number and a share of all files, is filed here and again at close and reaches Dann in one line each time, so a pass that produces a fine document and moves nothing is visible as that.

**THE REVERSAL CONDITION, added 2026-11-23 21:27 on Dann's question of whether the plan can respond to unexpected outcomes. It could not, here, and this is the repair.** Step 7 is the plan's one commitment point, and r7's earlier draft said nothing about what happens if the framework proves wrong after lanes have started moving files against it. So:

- **A tier 2 or tier 3 lane that cannot be carried out as the framework says is a finding about the framework, not a failure of the lane.** It stops, reports, and does not improvise a placement.
- **Three such reports reopen step 7** for the part of the framework they touch, with the reasons on the page, before any further lane in that part runs.
- **The framework's version is named in every lane's brief**, so what a lane was built against is never in doubt.
- Reopening is ordinary and is not a defeat. What it costs is one Fable session and the lanes already merged keep standing, because every lane leaves Ilya working (step 8).

### Step 8. The lanes, as a chain of prerequisites

Four tiers as before. **Tier 1 (dead code, comments, the colour migration) and tier 4 (the behaviour defects a singer meets as wrong today) start immediately and wait for none of this**, because neither moves a file across a module boundary. Tiers 2 and 3 wait for step 7.

**The ordering discipline:** attempt the change, discover what it demands, record the prerequisite, and work from the leaves inward, in steps small enough that Ilya is working at the end of each one. **The 5,533-line page gets a boundary drawn round it first and is taken apart behind that boundary.** The desk named the Mikado method to Dann for this; **the research could not obtain it (NOT OBTAINED), so the name is withdrawn and the discipline stands on its own description.**

### Step 9. Re-measure after each phase

Every figure with its file count, its edge count, and its density beside it, and the Parnas count and the commit-log measure alongside, as step 1 requires.

### Step 10. The documents

`ARCHITECTURE.md`, the in-house glossary, a short README per area, written from the chosen framework and brought true at the end. Then `CONTRIBUTING.md`, the decision records, the generated module map, and the header-comment test.

**A stranger's verdict, taken twice.** A fresh reader given nothing but the repository, five tasks with a pass mark written by someone other than the documents' author, and the question of whether this is a codebase they would be glad to inherit. **One of the five tasks is extending Corrections**, which is Dann's own example; `CorrectionSurface.svelte` sits at 1,227 lines against a ceiling of 1,227. The reading is taken on the tree as it stands on 2026-11-23 as well as at close, so the second has something to be compared with.

---

## 3a. WHAT THE RESEARCH CHANGED, AND WHAT IT COULD NOT SETTLE

**Report:** `research-n204-sources_r1_2026-11-23.md`. **Its own weakness, stated first:** 3 sources read in full, 11 in part, 12 NOT OBTAINED, mostly paywalled. By Dann's full-read rule of 2026-11-16 most of it is a lead. The two that carry the weight, Parnas 1972 and the MacCormack working paper, are among the three read whole.

**Earned their place:** reflexion models (step 5), the modularity measure with conditions (step 1), Parnas 1972 (step 3), and Foote and Yoder on piecemeal growth (step 6).

**Did not:** architecture reconstruction as a tool to run, since automatic recovery has no validated ground truth; it survives as vocabulary. The Mikado method, NOT OBTAINED. "Core size" appears in nothing that was read and is NOT ESTABLISHED.

**Thin but kept:** the in-house glossary. The 2025 systematic review reports communication benefits and little empirical evaluation. It is cheap and it is Dann's own idea.

**The caveat over all of it: no source tests any of these methods on a project with one developer.** The study linking modularity to maintenance burden used projects with at least twenty committing developers.

**Sources saved:** 18 files in `~/Downloads/_desk-2026-11-23/n204-sources/`. Filing them into Dann's library needs a folder grant and a computer-science subfolder rather than the author folders; that is a desk proposal, his to change.

## 6. The order, and the reading units

**THE ORDER OF THE PHASES, added in r6 on Fable's amendment 6**, since section 6 is titled "The order" and carried none of the new phases. Phase 1a step 1 (the scout, then the desk words the list); **phase 1a step 2, during which no unit read runs, because its two drafters are both helper slots**; step 2b; the phase 0 import graph; step 3; then phase 1b's nine remaining Fable units and the two Sonnet units, two at a time; then phase 1c; then phase 4a; then phase 2 and the lanes. **Tier 1 and tier 4 lanes may run throughout and do not wait for phase 1c.**

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

**Two units run at once**, which is the ceiling and halves the wall clock without changing the cost. **No unit runs during phase 1a step 2**, whose two drafters take both slots.

## 7. Cost, from actuals

**The two completed reads are the rates.** Unit a: 300,258 Fable tokens for 71k of source, 4.2 times. Unit b: 367,358 for 112k, 3.3 times. Both complete, every file read whole.

- **Phase 1b, the NINE Fable units remaining** (corrected in r6 from r4's twelve; five units are read and two of the remainder are Sonnet's): about 1,018k of source at 3.3 to 4 times gives **3.4M to 4.1M**. With five units already spent, **phase 1b totals about 4.9M to 5.3M Fable tokens.** **The per-unit sizes other than d's are NOT ESTABLISHED**; d's column entry was wrong by about 3.5 times, so the others are not trusted until checked. **r2 estimated 2.6M to 3.4M for all of phase 1, so r2 was low by about half again.**
- **Phase 0's remainder:** the Sonnet packets, 1.6M to 2.8M Sonnet.
- **Phase 1a step 1, the capability list. Added in r6 on Fable's blocker 2:** one Sonnet scout over `PRODUCT.md`, the GUIDE and LEARN headings, `names.ts`, the Names table, and the five filed reads, cap **0.25M**, first of its kind. The desk words the lines. No Fable.
- **Phase 1a step 2, the two framework drafts:** one Fable session and one Opus session, independent, each quoted at a unit read's measured range, **0.30M to 0.37M**, each capped at the top of it (`CONTRACT.md` section 4, estimates come from actuals). **Only the Fable half draws on the weekly Fable allowance.**
- **Phase 1c, the framework settled. New in r5:** one Fable session over the framework and the framework tests, not over source. Same range, **0.30M to 0.37M**.
- **THE DESIGN'S TOTAL, CORRECTED IN r6.** The four sessions come to about **1.15M to 1.35M**, of which **0.6M to 0.74M touches Fable's weekly allowance**. Against phase 1b's 4.9M to 5.3M that is **23 to 28 per cent**, and the Fable share alone is 11 to 15 per cent. **r5 said "about four per cent", and this desk told Dann "about three per cent" and then "about four per cent" in chat on 2026-11-23. All three were wrong and they are the desk's error. The figure also rose between r5 and r6, because r6 adds the scout of step 1 that r5 had left uncosted.** The design is still worth buying at the true price, and the true price is what goes in the record.
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
7. Five developer tasks and their pass mark, written before phase 4a and after phase 1c, by an agent other than the documents' author; a fresh Sonnet agent given only the repository finds the right files for each. **ONE OF THE FIVE IS DANN'S OWN EXAMPLE** (Fable's amendment 8): a developer who arrives to extend Corrections finds what to open and can add to it. Section 1 records his hope for Corrections and section 5 records `CorrectionSurface.svelte` at 1,227 lines against a ceiling of 1,227, so the task is where the hope becomes testable. **What a ratchet ceiling becomes after a split is NOT ESTABLISHED** and is settled before the first tier 3 lane: a ceiling re-pinned to the new file's exact size leaves it full again the day the lane lands. **WIDENED IN r5, against Dann's standard of 2026-11-23 20:22, and TAKEN TWICE in r6 on Fable's amendment 9.** The same fresh reader, having never seen Ilya, also answers whether this is a codebase they would be glad to inherit, and names what stopped them. **The reading is taken once on the tree as it stands now, before any of this work, and again at close**, because one reading of it has nothing to be compared with and the difference is what Dann reads. Pride in sharing is a judgement someone makes on first contact, so the instrument is someone making it on first contact. The answer is filed whatever it says. **It is a verdict and not a gate:** one reader's taste never blocks a release; what it does is tell Dann what a stranger sees.
8. The duplication census is lower than its phase 0 figure, every remaining duplication is named with a reason, and the count is ratcheted in `scripts/ratchets.mjs` so it cannot rise.
9. **New in r3:** no singer-visible sentence contradicts another on the same page, and the nineteen behaviour defects are each fixed, declined with a reason, or ruled by Dann.

10. **New in r4:** every unit has filed its token table; every class 1 literal is migrated; every class 2 has a token or a ruling; every class 3 carries its reason; the IPA face is one token; a focus-ring token exists; and the literal count is ratcheted below its starting figure of 299, measured by `census-colour-tokens.mjs`.

11. **New in r5, repaired in r6 on Fable's blockers 3 and 4.**
    - The capability list is filed **in a singer's words, with every term Dann ruled on marked as his** and the rest marked DESK DEFAULT. It is not filed with his word on every line, which would have made him the gate on a list of unstated length.
    - The framework was drafted twice independently, from an ungrouped list carrying no paths or code names, and **the comparison is filed**: what the two agreed on at a probe question, what they agreed on generically and so settles nothing, where both departed from the present tree, what the desk judged and why, and what either draft missed.
    - Every judgement the desk made at step 2b was reviewed at phase 1c.
    - Every current file is mapped to a module or to "already right", and **the stay count is filed at phase 1c and at close, as a number and a share.**
    - **THE TREE MATCHES THE TARGET, not only the table.** At close, phase 4b's generated module map equals the framework's file table, checked by a test, and **every dependency rule the framework states is a line in the layering ratchet `scripts/ratchets.mjs` already carries**. Section 3 says relationships become checks before prose; this is where the framework is held to it. Without this clause the whole of item 11 is satisfiable by a mapping table while nothing in the tree moves.

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
- Whether phase 1a's capability list can be written from the product alone for the seven unread areas (`voice/`, `omr/`, `reader/`, `insights/`, `library/`, `text/`, and all of `score/`).

---

## Phase 1 progress, ticked by the desk 2026-11-22 21:4x

**Five of sixteen units read: a, b, d, g, h.** The table above was stale for d, g, and h, which were read on 2026-11-22 and filed; corrected in the same pass. Phases 2, 3, and 4 have not started.

By the table's own size column, about 452k of roughly 2,677k is read, so **under a fifth of phase 1 by volume**. Of the remainder, unit t (the tests, about 1.1M) and unit o (107k) go to Sonnet; the Fable-side remainder across c, e, f, i, j, k, l, m, n is about 1,018k.

**Three units are gated, and two of those gates moved on 2026-11-22.** `c` waits on lane 56's second follow-up merging. `i` waits on N.200 settling, which moved a long way that night with Dann's 31 takes and the reference diagnosis. `l` waits on consistency batch 3, which is first in the desk's Track 1 order, so it clears early.

**Eight units are ready and ungated: e, f, j, k, m, n, o, t.**

**r6 adds one back-fill to these five:** the framework test of phase 1b (section 5). For d, g, and h it is a pass over their filed reads; **for a and b it is a short return to the source**, because neither filed a glossary section for the pass to stand on.

**Dann ruled 2026-11-22 19:11 that phases 2 and 3, the refactoring itself, land BEFORE the release**, so this plan is on the critical path rather than beside it. No date is set and the desk makes no forecast. The binding constraints are Fable's weekly allowance for the judgement reads and Dann's attention for the rulings they produce.
