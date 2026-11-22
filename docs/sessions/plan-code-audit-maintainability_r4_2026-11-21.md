# Plan: the code audit and one refactoring pass (r4)

Written by the desk (Opus 5), 2026-11-19 15:0x. **r3 replaces r2** (`plan-code-audit-maintainability_r2_2026-11-16.md`), which is superseded and kept. r2 was built from Dann's words of 2026-11-16 alone; r3 adds his rulings of 2026-11-19 14:54 to 15:00, which widen the purpose, set the test a comment must pass, and grant the desk decision rights inside this work. Their home is `../memory/OPEN.md`, "N.204: ITS PURPOSE, ITS COMMENTS, AND THE DESK'S DECISION RIGHTS"; his words are in `../memory/INBOX.md` under those times.

Tree read for r3: `Shane` `6c0bb4fc`. Phase 0's counting is DONE and its numbers are in section 5. Units a and b of phase 1 are READ. `docs/memory/SCHEDULE.md` r6 item 4. DESK DEFAULT number: N.204.

## 1. What Dann asked for, in his words

**2026-11-16 13:17:** *"a Fable audit of the code where you actually read the code in its entirety and housekeep: get rid of dead code, assess how the modules are organized and relate, make sure comments in the code are economical but helpful, delete redundant comments; basically prepare this code to encounter future developers who wish to improve it and make it easy for them to navigate the code and undestand how it works, why it is organizaed teh way it is, any relatiopnships between code segments that may noit seem apparent... Research that and adopt a schema that works for us then use it to refine Ilya's code."* And 13:25: *"yes to one planned pass for refactoring; I defer to your research"*.

**2026-11-19 14:54, the purpose in four parts:** *"The purpose of the refactoring and audit is to eliminate errors, resolve contradutions, consider how the code is organized, and suggest optimizations that we can implement to either reduce Ilya's footprint without sacrificing performance, or to improve its performance in ways that may or may not be apparent to the user."*

**2026-11-19 14:57, comments and the user:** *"We need concise commetns where the code doesn't obviously refelct its function and relationships. We don't need copious comments where the code is self-evident."* And: *"My onw ask is that you firmly retain the importance of the user. This app is meant to be used by other folks like myself who are not programmers, but rather and musicians, ewithert working professionals or students. So we need to prioritize the user experiecne while offering excellent and consistent inform ation."*

**2026-11-19 15:00, the test a comment must pass:** *"The purpose of comments in code is to curate the code for future developers."*

**2026-11-19 14:59, the desk's decision rights:** *"I believe you can resolve many contradictions just by applying the principles I just stated (the usr experience is paramount). I trust you to bring me what you cannot resvole on your opwn."*

**2026-11-18 22:47, how the read is done, never to be asked again:** Fable reads all of it, untiered, *"This is our last look at the code before we finalize the LEARN and GUIDE sections, so it has to be done thoroughly and properly."*

## 2. The outcome, from two chairs

**A developer who has never met Dann** clones the repository and, in one afternoon, can: find where any singer-visible behaviour lives, from `ARCHITECTURE.md` and one level of folder READMEs; read any module and see why it is shaped as it is; see the relationships no import shows, each pinned by a test or a ratchet where it can be; change a module with the tests telling them what they broke; and meet no dead code, no comment that restates the line below it, and no comment that is false.

**A singer**, who is a musician and not a programmer, meets an app that says fewer wrong things than it does today, never contradicts itself between two sentences on one page, and is no slower and no heavier. **This is new in r3.** r2 promised that nothing a singer sees would change; under Dann's 14:54 ruling, what a singer sees changes wherever it is wrong, and changes nowhere else.

## 3. The schema

- **The tree's own standards come first.** matklad's form for `ARCHITECTURE.md`, and Dann's `../house-style/code-conventions.md`, ratified 2026-11-01 22:35, whose section 5 already carries his comment rule.
- **The checklist: ISO/IEC 25010.** r2 took the maintainability characteristic alone: modularity, reusability, analysability, modifiability, testability. **r3 adds performance efficiency** (time behaviour, resource use, capacity), because Dann's fourth purpose asks for footprint and speed and maintainability does not test for either. Depth follows the hotspot ranking in section 5, not a flat pass.
- **The test a comment must pass: does it curate the code for a future developer?** The three purposes of `code-conventions.md` section 5 (purpose, function, consequence) are how that test is met, not a second standard beside it. A comment that curates nothing for a reader arriving cold comes out. A comment carrying one of Dann's rulings stays, with its date and words, because those are what a reader cannot reconstruct.
- **The method: refactoring in Fowler's sense** for everything that preserves behaviour, with characterization tests first where behaviour is unpinned (Feathers). **Behaviour changes are a separate class and are not called refactoring:** each gets its own lane, its own before-and-after, and a line saying what a singer reads differently.
- **Four tiers, each its own lane:** tier 1, proven-dead code, comments, renames inside a file; tier 2, moves across modules; tier 3, splitting the ratcheted hotspots; **tier 4, new in r3, the behaviour defects**, ordered by what a singer meets.
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

## 5. The phases

**Phase 0, the map. DONE for the counting half, 2026-11-19 15:0x, on `6c0bb4fc`.**

Measured by the desk, all by script:

- **Source outside tests and docs: 134,671 lines in 552 files.** `apps/web/src/lib` 95,493 in 423 files; `score-parser` 16,993 in 47; `tools` 9,442 in 53; `routes` 5,775 in 5; `phonology` 3,188 in 12; `dictionary` 1,422 in 7; `blurb` 1,021 in 4; `scripts` 1,337 in 1.
- **Comments: 34,439 lines**, one for every 3.9 lines of code. Of them, **127 cite a line number**, against 106 when the convention was ratified on 2026-11-01, so the practice the convention forbids is still growing; **1,180 name an N. item**; **9 carry a prototype version tag**. **Zero TODO, FIXME, XXX, or HACK markers in the tree.**
- **142 test files read source as text** (`readFileSync` or `readFile`), so a rename can break a test that never imports the renamed thing.
- **The hotspot ranking, churn since 2026-08-01 times current size:** `routes/+page.svelte` 5,532 lines over 212 commits; `i18n.ts` 2,725 over 213; `Drawer.svelte` 1,986 over 53; `LearnContent.svelte` 4,097 over 21; `markup/MarkupPane.svelte` 1,349 over 47; `score/Loupe.svelte` 3,008 over 17; `Drawer/InspectorPanel.svelte` 2,396 over 18; `CalibrationWizard.svelte` 1,124 over 34; `InsightsPane.svelte` 677 over 39; `GuideContent.svelte` 657 over 39.
- **The ceilings are full.** Thirteen of the sixteen ratcheted files sit within five lines of their ceiling, and six are at it exactly: `engine.ts` 2,048 of 2,048, `Loupe.svelte` 3,008 of 3,008, `MarkupPane.svelte` 1,349 of 1,349, `CorrectionSurface.svelte` 1,227 of 1,227, `InsightsPane.svelte` 677 of 677, `mnx-parser.ts` 1,170 of 1,170. `musicxml-parser.ts` has one line spare, `+page.svelte` two, `LearnContent.svelte` two. **So no line can be added to the files that matter until a split makes room**, and unit a found the symptom from the inside: imports and statements joined onto one line in `engine.ts` to stay under the number.

**THE DUPLICATION CENSUS, added 2026-11-19 15:2x on Dann's ruling.** `../house-style/code-conventions.md` section 6, ratified by him 2026-11-01, says logic needed in two places lives in one named module both import. The tree does not meet it: **Fable's two completed unit reads found seventeen facts with two or more homes** (unit a G1, G2, G3, G4, G5, G7, H3, F4, R7, R11, R14; unit b 2, 20, 21, 22, 23, 24, 26, 27, 29), in two units of fifteen. Phase 0 counts them across the whole tree and writes the number down; every unit read adds to it; every lane that gives a fact one home lowers it. **It becomes a guard, not a good intention:** `scripts/ratchets.mjs` already holds file size, layering, and package surface to numbers that may fall and never rise, and the census joins it, so a later change that gives a fact a second home fails the gates. Dann 15:29, on the convention's own sentence: *"Hallelujah, yes!!!"*

**Still owed in phase 0:** the import graph and whether `knip` runs on this workspace; the keep-list of paths no import shows (URL switches, `__ILYA_RECORDER__`, workers and assets reached by URL, glob reads, dynamic imports, `static/sw.js`'s precache list, old-shape readers, `routes/notation-font-lab/`); **the behaviour baseline**, built at the base commit and run twice to prove it deterministic (MELODY SVG per page per fixture, TEXT for the IPA corpus, INSIGHTS figures and comments in both languages, print pages, an exported `.ilya` binder and saved-voice JSON, one hash of the sorted i18n table, the production build's file list and sizes, the `sw.js` precache list, the `static/` byte count, both Playwright projects); **a performance baseline, new in r3** (cold load, time to first drawn page, the reader's wall clock on one fixture scan, bundle and `static/` bytes); and the per-unit Sonnet packets.

**Phase 1, the judgement read.** One unit at a time, Fable, all source read whole. Each finding carries the name it anchors to, the smell, the refactoring by name, its tier, the risk, and the test or baseline that proves behaviour unchanged. Each unit also returns the paragraph a developer needs, the hidden relationships, and now **the comment census for its files** against section 3's test. **A unit read may run code to settle a claim it cannot settle by reading, and marks each such claim "ran"**; both completed units did this and it is what produced unit a's behaviour defects with real words attached. Permit it in the brief in advance. **Every subagent brief says: create no `.bak` file, the bridge cannot delete one; and check with `ls` before naming a report path, because lane numbers are not unique across subjects.**

**Phase 2, the refactoring plan.** Findings become lanes by tier, ordered so no file is edited by two lanes at once. Fable reviews the plan before any lane starts. Dann reads it in words.

**Phase 3, the lanes.** Tiers 1, 2, and 4 in the cloud; tier 3 on the Mac. Fable as built on each; Dann's merge paste. A tier 1, 2, or 3 step that would change behaviour is stopped and reported; a tier 4 lane changes behaviour on purpose and says what a singer reads differently.

**THE IN-HOUSE GLOSSARY. Dann's own idea, 2026-11-19 15:31** (transcribed as written: *"I feel like an in-house glossary can help future developers locate the part sof code that do what they want to enhance and work there, instead of straight up developing a new graft on Ilay? Likewise with us..."*). The term "in-house glossary" is his; the desk adopted it.

**What already exists, read 2026-11-19 15:3x.** `apps/web/src/lib/names.ts` (308 lines, consistency batch 1 step 2) holds one record per named part of Ilya: the i18n key of its screen name, its English and French, its code name and folder today and after batch 3, the stored values carrying a name, and the retired words a singer must never read again. `ARCHITECTURE.md`'s "Names" table is that record for people, pinned to the module by `names-table.test.ts`. `ARCHITECTURE.md`'s "Where to start" holds six task-shaped entries, including "to find the code behind something on screen, search `i18n.ts` for the words and follow the key".

**The gap his idea fills.** Those cover the parts a singer can point at: TEXT, MELODY, the bands. They do not cover the capabilities underneath, which is what a developer arrives wanting to change: where Ilya decides which vowel a note takes, where it decides a note is held, where it decides a tempo, where it places a hyphen at a line end, where it chooses a clef. **Those are also, exactly, where the duplication lives**: every one of the seventeen is a capability with more than one home.

**So the glossary and the census are one piece of work seen from two sides.** A glossary cannot say "the one home of X" while X has three homes; and giving X one home is worth little if nobody can find it. The audit does both in the same pass: each lane that gives a fact one home writes that fact's glossary line in the same commit, and the census drops by one. **The glossary line is the proof the lane finished**, and `ratchets.mjs` holds the count so a later second home fails the gates.

**Its shape, DESK DEFAULT:** one line per capability, in a singer's words first and the code's second, naming the module and nothing finer, because a line number goes stale and a module does not. It lives beside the Names table in `ARCHITECTURE.md` and is checked by a test, as the Names table already is.

**Phase 4, the developer's documents.** `ARCHITECTURE.md` brought true; a short README per area; the decision records; `CONTRIBUTING.md`; the generated module map and the header-comment test that `code-conventions.md` section 5 specifies and the tree does not yet have.

## 6. The order, and the reading units

**Consistency batch 3 runs first, before any unit read that touches `markup/`.** Established by the desk 2026-11-19 14:5x: batch 3 has NOT run (`apps/web/src/lib/markup/` exists, `melody/` does not), and three parts of the comment convention wait on it: the generated module map, the header-comment test, and the line-number sweep. Reading a folder that is about to be renamed wastes the read. Batch 3 waits for lane 71 to merge, because both touch `markup/`.

| unit | what | source | state |
|---|---|---|---|
| a | `packages/phonology`, `dictionary`, `blurb` | 71k | **READ** 2026-11-19, 62 findings, 0 blockers, 6 behaviour defects |
| b | `score-parser`: parsers and analysis | 112k | **READ** 2026-11-19, 35 findings, 6 blockers, 13 behaviour defects |
| c | `score-parser`: renderer and layout | about 110k | after lane 56's second follow-up merges |
| d | `apps/web/src/routes` | 75k | ready |
| e | `score/`: Loupe and correction | about 140k | ready |
| f | `score/`: the rest | about 140k | ready |
| g | `components/Drawer/` | 109k | ready |
| h | `Paper/`, `Welcome/`, `Field/`, loose components | about 85k | ready |
| i | `voice/engine`, `voice/chart` | about 90k | after N.200 settles |
| j | `voice/`, the rest | about 45k | ready |
| k | `omr/` | 113k | ready |
| l | `insights/`, `analysis/`, `markup/`, `tempo/` | about 140k | **after batch 3** |
| m | `library/`, `text/` | about 100k | ready |
| n | `reader/` and the top-level `lib/*.ts` | about 140k | ready |
| o | `tools/`, `scripts/` | 107k | any time, Sonnet |
| t | the tests | about 1.1M | Sonnet with a dead-fixture script; Fable samples what Sonnet flags |

**Two units run at once**, which is the ceiling and halves the wall clock without changing the cost.

## 7. Cost, from actuals

**The two completed reads are the rates.** Unit a: 300,258 Fable tokens for 71k of source, 4.2 times. Unit b: 367,358 for 112k, 3.3 times. Both complete, every file read whole.

- **Phase 1, the twelve Fable units remaining:** about 1,287k of source at 3.3 to 4 times gives **4.2M to 4.6M**. With units a and b already spent, **phase 1 totals about 4.9M to 5.3M Fable tokens.** **r2 estimated 2.6M to 3.4M for all of phase 1, so r2 was low by about half again.**
- **Phase 0's remainder:** the Sonnet packets, 1.6M to 2.8M Sonnet.
- **Phase 2:** 0.3M to 0.4M. **Phase 3:** 0.3M to 0.4M a Fable as-built review per lane, over perhaps eight to twelve lanes now that tier 4 exists.
- **Against the allowance:** Fable's weekly allowance measures near 7M (`../memory/ENVIRONMENT.md`, LEARNED BY THE 2026-11-19 DESK; a desk inference from two points). **Phase 1 alone is most of one week**, and the release lanes need Fable reviews from the same pool.
- Never more than two helpers at once. Every farm-out states its worst case first.

**The date.** The working date is Friday 2026-11-27, freeze Thursday the 26th at noon (`../memory/SCHEDULE.md`). **N.204 as scoped in r3 does not fit inside it.** `CONTRACT.md` section 1 item 7: the date never sizes the work, and when they disagree the date moves. **DESK DEFAULT: plan the audit at its full size and let the date fall where it falls.** Dann's to overrule, and his alone.

## 8. The desk's decision rights inside this work

Ruled by Dann 2026-11-19 14:59. **The desk resolves a contradiction itself by applying "the user experience is paramount", and brings Dann only what that principle cannot resolve.**

**Resolved by the desk, no question asked:** which of two inconsistent sentences a singer reads; which of two disagreeing comments is true; naming; presentation; a page that says the same thing twice; a row that shows a raw mapping where a sentence belongs; every tier 1, 2, and 3 finding; the amendment of `code-conventions.md` where a rule is not serving a reader, with a list of what changed.

**Brought to Dann, one at a time:** a question of fact about sung Russian, where a singer's experience cannot decide what is correct (unit a D1, the soft velar's voicing; D3's vowel before a stage-hard velar, ruled 13:58); French, under `CONTRACT.md` section 7; anything irreversible, costing money, or going out under his name, under section 1 item 4; and a merge paste per lane.

## 9. Done when

1. Every unit has a filed packet and a filed read.
2. Every finding is applied, declined with a reason, or put to Dann.
3. After every lane: the eight gates at baseline with every count change said; the behaviour baseline equal byte for byte except the listed intended differences, **and for a tier 4 lane the differences are the point and each is named in singer's words**; both Playwright projects pass; every ratchet ceiling at or below its start; bundle and `static/` sizes reported against the performance baseline.
4. `knip` reports nothing unused outside the keep-list.
5. No comment cites a line number; the header-comment test exists and passes; the comment census is lower than 34,439 lines and every remaining comment passes section 3's test.
6. `ARCHITECTURE.md`, `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, and `NOTICES.md` are true of the tree, shown by a filed table of claim, file, and verdict made by a reader who did not write them.
7. Five developer tasks and their pass mark, written before phase 4 by an agent other than the documents' author; a fresh Sonnet agent given only the repository finds the right files for each.
8. The duplication census is lower than its phase 0 figure, every remaining duplication is named with a reason, and the count is ratcheted in `scripts/ratchets.mjs` so it cannot rise.
9. **New in r3:** no singer-visible sentence contradicts another on the same page, and the nineteen behaviour defects are each fixed, declined with a reason, or ruled by Dann.

10. **New in r4:** every unit has filed its token table; every class 1 literal is migrated; every class 2 has a token or a ruling; every class 3 carries its reason; the IPA face is one token; a focus-ring token exists; and the literal count is ratcheted below its starting figure of 299, measured by `census-colour-tokens.mjs`.

## 10. NOT ESTABLISHED

**Closed since r2:** the status of consistency batch 3 (it has not run); what the token figures are as a share of Dann's weekly Fable limit (phase 1 is about 70 to 76 percent of one week); the hotspot ranking (measured, section 5); the comment counts (measured, section 5).

**Still open:**
- Whether `knip` runs on this workspace.
- The token-per-byte ratio for the unread units, so their token figures are estimates from two actuals.
- Whether a fixture binder from a released build exists, to test old stored data.
- Whether any test hears sound (`voice/count-in.ts`).
- Whether the performance baseline can be taken reproducibly in the cloud workspace, whose timings are not the Mac's.
- The twenty-odd NOT ESTABLISHED items the two completed unit reads each filed, listed at the end of their own reports.
