# N.204 step 3: what is likely to change about Ilya, r2

Drafted by the desk (Opus 5), 2026-11-24 01:1x; **r2 at 01:3x applies Dann's six answers of 01:26, and r1 is superseded and kept in git**. Written under under `plan-code-audit-maintainability_r9_2026-11-23.md` (md5 `6d0cd1e1`) step 3. **FROZEN AT THIS REVISION.** Every later count is taken against this list. Dann strikes or adds; a strike or an addition is applied by re-taking the affected count at the frozen grain and filing both, never by discarding work (r8 review, amendment 10).

## What this is for

Parnas 1972, read in full by the research: list the design decisions most likely to change, then count how many units each change would touch. A good division means a likely change lands in one place. **The counts are not here.** They are taken on the base commit after step 4, because where a decision lives is unknown for the eleven unread units. What is here is the list of changes, and the evidence of where each one already lives.

## How the evidence was taken

Every path and line below was read from the tree by the desk on `50315f2e`, this session, by grep and by opening the file. **No figure in this document comes from a unit read, a report, or a memory file.** Where a unit read found something and the desk's own grep found more, the desk's number stands and the difference is named.

## The scenarios

### 1. Another transcription language

Ilya transcribes Russian by Grayson's rules. **Dann 2026-11-24 01:26, transcribed as written:** *"We will not be adding another language to Ilya for this release, but I want the finished structure to accept the IPA rules engine for additional languages (i.e. English, French, Italian, German)"*. So no language ships, and the arrangement step 7 chooses is judged by whether it accepts one.

**Where the decision lives today.** `packages/phonology/src/engine.ts`, 2,048 lines and at its ratchet ceiling. **The Cyrillic letter classes stand in eight files**, each with its own copy: `packages/phonology/src/palatalization.ts:122`, `packages/phonology/src/reflexive.ts:64`, `apps/web/src/lib/omr/underlay-units.ts:25`, `apps/web/src/lib/omr/vowels-per-note.ts:41`, `apps/web/src/lib/omr/underlay-counts.ts:22`, `apps/web/src/lib/score/vowel-resolver.ts:159`, `apps/web/src/lib/typed-hyphens.ts:43`, and the IPA inventory at `apps/web/src/lib/voice/engine/types.ts:26`. **Unit a's finding R14 said five; the desk's grep on `50315f2e` finds eight.**

### 2. A different published reference for the resonances

**CORRECTED at r2; r1's sentence here was wrong and Dann caught it.** All ten vowels can be measured: the wizard asks for seven (`CalibrationWizard.svelte:103`, [i e ɛ a ɑ o u]), offers three more as challenging (`:104`, [ɨ ɪ ʌ]), and a singer may sample all ten (`:105`). A sung reading always wins (`resolve-values.ts:2-4`). What rests on the reference is the FILL: four vowels can be derived when they are not sung, from six constants fitted to one voice (`derivations.ts:23-39`: 1.365, 1.0315, 1.15, 0.67, 0.39, 0.52), and every vowel still unfilled takes Bozeman's staff scaled to the singer (`stand-ins.ts`). A change of reference changes those numbers, the plausibility bands, and every sentence that names a source.

**One thing the tree still carries from a struck design.** [a] is in the seven the wizard asks for and is also one of the four derivable vowels (`derivations.ts:4-6`). That is the remains of the six-and-four set Dann struck on 2026-11-21 at 01:27; the repair is QUEUE row 200, lane 77, brief at r4, READY and never run.

**Where else it lives.** `CORE_BANDS` is read by `voice/engine/stand-ins.ts` and `voice/engine/plausibility.ts`.

### 3. A different reader for a printed page

**Dann asked at 01:26 why this is likely, and the answer is that it has already happened twice.** homr is an outside project Ilya does not control. N.184 put a second trained model into the reading path (`rus_prereform_r2_29000.traineddata`, run at `underlay-recognize.ts:31`), and QUEUE row 105 measured a replacement model for the same job. The scenario is not a plan to replace the reader; it is the test of whether the reading path is arranged so that changing the part that reads ink touches one place. **His to strike if he judges it settled.**

**Where.** `apps/web/src/lib/omr/`, 92 files, and `apps/web/src/lib/reader/`, 20 files.

### 4. A new kind of notation the page must draw

Already named and not built: an ossia kept whole (N.191), dynamics as a layer (N.177), tempo words and dynamics read from a scan (N.178), the accidentals as the print prints them (N.190). **Its condition, Dann 2026-11-24 01:26, transcribed as written:** *"new notation will be later when Corrections gains additional robust command over score elements"*.

**Where.** `packages/score-parser/src/staff-renderer.ts`, 3,413 lines.

### 5. A new way a score arrives

A file format Ilya does not read today, or one of the two it does changing shape.

**Where.** Two parsers that share a copied core: `musicxml-parser.ts`, 1,166 lines, and `mnx-parser.ts`, 1,170 lines and at its ceiling. Each carries its own `gcd` (`:198` and `:170`) and its own articulation table (`mnx-parser.ts:236` against `notations.ts:27`), so a repair to one has to be made twice to be made at all.

### 6. The arithmetic under the notes

How Ilya counts time in a bar, and how it names a pitch. It moves whenever a tuplet, a grace note, an extender, or a fused measure is handled differently.

**Where.** `gcd`, one function, has **ten homes** on `50315f2e`: `score-parser/phonation.ts:55`, `mnx-parser.ts:170`, `musicxml-parser.ts:198`, `omr/triplets.ts:98`, `omr/metre-witness.ts:83`, `score/correction.ts:227`, `score/entry.ts:475`, `score/offers-for-a-bar.ts:84`, `score/rebar-notes.ts:31`, `score/rebar.ts:86`. **Unit b's finding 20 counted four, because it counted inside one unit.** Pitch arithmetic stands in at least five places: `overlay-engine.ts:66`, `phonation.ts:262`, `transposition.ts:65`, and a `PITCH_STEPS` set written twice (`mnx-parser.ts:249`, `musicxml-parser.ts:254`).

### 7. The seating rule

Which syllable sings on which note: what fuses to what, how a melisma is read, how a clitic joins its host.

**Where.** `apps/web/src/lib/score/pairings.ts`, 1,421 lines. The verse-selection rule inside it stands in three files: `score-parser/verses.ts:47`, `score-parser/diction-marks.ts:129`, and `apps/web/src/lib/score/ingestion/vowelless-fold.ts:49`.

### 8. A third language on the page

**This is Ilya's own interface, not a sung text. Dann asked at 01:26 whether it meant the Latin in The Seminarian; it does not, and a sung language other than Russian belongs to scenario 1.** Ilya speaks English and French start to finish, and a third interface language would meet one table of 2,729 lines holding both as literal halves: `apps/web/src/lib/i18n.ts`. **His to strike**, since nothing on the record asks for a third.

### 9. What Ilya asks of a voice

Which vowels are asked for, how many stable samples make the profile the singer's own, which vowels are filled and how they are marked, and what a borrowed profile says on the page. It has moved four times since 2026-11-13.

**What "how many are enough" means, since the phrase was opaque: `PERSONAL_CORE_MIN = 5` (`sung.ts:40`).** Five stable core vowels make the profile the singer's own. Below five, every vowel she has sung is still used as sung, and the vowels she has not sung take her declared type's values unscaled. That number has been 5 and 6 within the past week.

**Where.** `apps/web/src/lib/voice/engine/`.

### 10. What INSIGHTS says, and when it says it

The curation rules are a living draft by Dann's own ruling (N.173), so this one is certain to move rather than merely likely.

**Where.** `apps/web/src/lib/insights/`, 52 files.

### 11. The look

A skin, a new colour story, a typeface. `app.css` holds 67 definitions; **688 hex literals stand outside it across 53 files** (the token census of plan section 4a, taken on `ac4bc6d8`, and the one figure here the desk did not re-take today).

### 12. What a saved voice and a saved binder hold

A new field, a renamed field, or a migration of what is already on a singer's disk. This is the one scenario where a change reaches work a singer has already done.

**Where.** `apps/web/src/lib/library.ts` and `apps/web/src/lib/voice/profileStore.ts`.

### 14. A teacher with several singers

**Dann 2026-11-24 01:26, transcribed as written:** *"\"what a borrowed profile says.\" should be identified as a teacher in a multi-studetn studio optoin"*. A studio where one teacher holds several singers' profiles, and a borrowed profile is named as the teacher's own rather than as a published type. **New at r2, and his.** Today a voice is one profile store on one device (`voice/profileStore.ts`), so this scenario reaches storage, naming, and every page that says whose values are on it.

### 13. The paper, and what prints

The sheet a singer chooses (QUEUE row 203, A4 for Europe), and the standing rule that no control is ever on the page.

## What the desk is not claiming

- **No counts.** They are step 4's, and taking one now would be a guess at eleven unread units.
- **No ranking.** Parnas's method does not rank the scenarios; it counts them against the division. Scenario 10 is marked certain because Dann ruled it a living draft, which is a fact about the ruling and not a judgement about the code.
- **The four candidates named in r9 are scenarios 1, 2, 3, and 4 here.** Scenarios 5 to 13 were new in r1, scenario 14 is Dann's own of 01:26, and they were derived from the duplication census and `PRODUCT.md`, as r9 instructs.

## What this draft found on the way, and it is a finding about the census

**The duplication census undercounts, because each unit read counted inside its own unit.** Two of the seventeen facts were re-counted today against the whole tree: `gcd` is ten homes and not four, and the Cyrillic letter class is eight and not five. **The census number is therefore a floor, not a measure**, until it is re-taken tree-wide. Plan section 5a says phase 0 counts them across the whole tree; that count is still owed, and this is the first evidence of its size.
