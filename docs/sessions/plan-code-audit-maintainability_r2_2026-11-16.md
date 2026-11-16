# Plan: the maintainability audit and one refactoring pass (r2)

Written by the desk (Opus 5.5), 2026-11-16 14:1x. r2 applies Fable's review of r1 (`review-fable-plan-code-audit_r1_2026-11-16.md`, ADOPT WITH AMENDMENTS: three blockers, thirteen amendments, all applied; marked **[r2]**). r1 is superseded and kept. Tree read: `Shane` `a16c011c`. Status: reviewed; one question to Dann (section 7). Nothing has run. `docs/memory/SCHEDULE.md` r6 item 4. DESK DEFAULT number: N.204.

## 1. What Dann asked for, in his words

*"a Fable audit of the code where you actually read the code in its entirety and housekeep: get rid of dead code, assess how the modules are organized and relate, make sure comments in the code are economical but helpful, delete redundant comments; basically prepare this code to encounter future developers who wish to improve it and make it easy for them to navigate the code and undestand how it works, why it is organizaed teh way it is, any relatiopnships between code segments that may noit seem apparent... Research that and adopt a schema that works for us then use it to refine Ilya's code."* (13:17). *"yes to one planned pass for refactoring; I defer to your research"* (13:25).

## 2. The outcome, from a future developer's chair

A developer who has never met Dann clones the repository and, in one afternoon, can:
1. find where any singer-visible behaviour lives, from `ARCHITECTURE.md` and one level of folder READMEs;
2. read any module and see why it is shaped as it is, from its header comment and the decision record it points to;
3. see the relationships no import shows (one number computed in two places, attributes read across components, files reached by URL or glob, tests that read source as text), each pinned by a test or a ratchet where it can be;
4. change a module with the tests telling them what they broke;
5. meet no dead code, no comment that restates the line below it, and no comment that is false.

What does not change: anything a singer sees, hears, prints, or stores. Section 5's behaviour baseline is the proof.

## 3. The schema

- **The tree's own standards come first [r2]:** matklad's form for `ARCHITECTURE.md` (its own lines 3 to 5) and Dann's comment standard in `docs/house-style/code-conventions.md` section 5 (a header comment per file; three permitted purposes; cite a name, never a line number; a generated module map checked by `pnpm ratchets`; a header-comment test; the sweep of line-number comments).
- **The checklist: ISO/IEC 25010, maintainability,** its five qualities as questions: modularity (does a change here force changes elsewhere; are the codemap's boundaries real), reusability (one logic written twice; one number computed in two sites), analysability (size against the ratchets, names, header comments, comments that restate or mislead), modifiability (hidden coupling through string keys, DOM attributes, module state), testability (behaviour pinned; tests readable; dead fixtures). Depth follows the hotspot ranking (section 5, phase 0), not a flat pass.
- **The method: refactoring in Fowler's sense** (*Refactoring*, 2nd ed., 2018): named, behaviour-preserving steps, tested. **Characterization tests before a hotspot is split [r2]** (Feathers, *Working Effectively with Legacy Code*, 2004): where behaviour is not pinned, a test pins today's behaviour first.
- **One planned period, in three tiers [r2]:** tier 1, proven-dead code deleted, comments, renames inside a file; tier 2, moves across modules; tier 3, splitting the ratcheted hotspots (`+page.svelte`, `Loupe.svelte`, `InspectorPanel.svelte`). Each tier its own lane, so a regression names its cause. Dann ruled one pass, 13:25; the study of 315 refactoring commits (Szőke et al., 2017) is context, read as an abstract only.
- **History in comments [r2]:** about 2,764 comment lines in `apps/web/src/lib` cite an N. number, a row, a lane, a date, or a person. The rule: a comment keeps purpose, function, and consequence, in the present tense; the history moves to a decision record when it explains a design, and otherwise stays in git. A comment that carries one of Dann's rulings keeps a pointer to where the ruling lives.
- **Relationships become checks before prose [r2]:** a test or a ratchet line first; then a comment under `code-conventions.md` section 5; then a decision record. At most about a dozen decision records, in `docs/decisions/`, each pointing to the ruling's home in `docs/memory/`.
- **Tools give candidates, a reader gives the verdict.** No deletion rests on a tool alone.

## 4. Scope, and what is fixed

**Read and refactored:** `apps/web/src/lib`, `apps/web/src/routes`, the four packages, `scripts/`, and the tests (for readability and dead fixtures).

**Read for structure only [r2]:** `LearnContent.svelte`, `GuideContent.svelte`, and `i18n.ts` (about 213k tokens of prose and strings). Their words are the GUIDE and LEARN rewrite's, after the freeze.

**Read for boundaries only:** `third_party/homr-web` (vendored).

**Classified only:** `tools/` (live, archive, or remove; a tool Dann used is never removed without his word). Whether `CONTRACT.md` section 8's "Do not propose another project prune" reaches this is read before phase 0 touches `tools/` **[r2]**.

**Fixed by Dann's rulings, never changed by this pass** (`CONTRACT.md` section 8): `VocalLineEvent`; anything under `score/reconciliation/`; `analyzePerVerse`; `underlay-donor.ts` is not made the alignment engine; no second silent save site while N.27 is open; nothing derived stored; nothing into `static/` without its byte count told to Dann; no hand-rolled phonological predicate (bears on any merge near `vowel-resolver.ts`) **[r2]**; no stored-format change; no ratified string changed; no i18n key deleted (key removal is its own script and lane after lane 61, if ever) **[r2]**; no ratchet ceiling raised.

**Work already ruled that meets this pass [r2]:** consistency batch 3 (the `markup` code renamed to melody, `CONTRACT.md` section 1 item 6a; the stored key `shane.profiles.v2` renamed, `code-conventions.md:41`), batch 4 (the dead-code batch named in `ARCHITECTURE.md`), and QUEUE row 174 (split `+page.svelte`, ruled a Mac lane after the consistency batches). Their status today is NOT ESTABLISHED. DESK DEFAULT: phase 0 establishes it; batch 3 runs before any read of `markup/` and before phase 4, as its own lane, with the stored-key rename the one stored change this work makes, on Dann's standing word; batch 4 and row 174 fold into this pass as tier 1 and tier 3.

**A claim made in Dann's name, CONFIRMED false by the review [r2]:** `README.md:17` (the public first page), `ARCHITECTURE.md:26-29`, and `AGENTS.md:9` say Ilya uses no machine learning and no neural model. The scan path uses three trained models beyond tesseract: homr's `.onnx` models (`apps/web/scripts/fetch-omr-models.mjs:13-20`), the metre network (`omr/metre-model.ts:1-7`), and the fine-tuned underlay model (`omr/underlay-recognize.ts:2-6`). The transcription engine's claim, rule-based and deterministic, stands. The desk drafts true wording; it goes to Dann first, before the audit, because it speaks for him. Whether the GUIDE or LEARN repeat the claim is checked in the same draft.

## 5. The phases

**Phase 0, the map, mostly scripts [r2].**
1. Scripts (near zero model cost): file sizes against the ratchets; the import graph; `knip` and the compiler's unused checks (whether `knip` runs on this workspace is the first thing established); every `TODO`, `FIXME`, `UNUSED`; every line-number comment; every history-citing comment; every test that reads source as text (144 files call `readFile`), with its file and pattern; the hotspot ranking (churn times size, from `git log`).
2. The keep-list of paths no import shows, before any deletion: URL switches (`?harness`, `?sung`, `?strips`, `?looks`, `?extender`, the stub and measure switches); the `__ILYA_RECORDER__` code and its pinned shape (`capture-file.test.ts:108-114`); workers and assets reached by URL; files read by glob; dynamic imports; `static/sw.js`'s precache list and bypass; the copy and fetch scripts in `apps/web/package.json`; old-shape readers (`shane.profile.v1`, `restoreSurface`, the migration tests); `routes/notation-font-lab/`; the partly live `Tessituragram`.
3. **The behaviour baseline, built at the base commit and run twice to prove it is deterministic [r2]:** MELODY SVG per page for every fixture; TEXT for the IPA corpus; INSIGHTS figures and comments in both languages; print pages; an exported `.ilya` binder and the saved-voice JSON for fixture songs; one hash of the sorted i18n table; the production build's file list and sizes, the `sw.js` precache list, and the `static/` byte count; a capture of each destination in both languages on both Playwright projects; both Playwright projects run once against `vite preview`. Every lane diffs against it; every intended difference is listed.
4. The files each open lane touches (56, 59, 60, 61); those wait.
5. Sonnet packets per reading unit (section 6), with every line cited.

**Phase 1, the judgement read (section 7 holds the one question).** One reading unit at a time. Each finding: the name it anchors to (never a line number), the smell, the refactoring by name, its tier, the risk, the test or baseline that proves behaviour unchanged. Each unit also gets the paragraph a developer needs and the hidden relationships found, each proposed as a check. Findings are re-checked at each lane's base commit **[r2]**.

**Phase 2, the refactoring plan.** The findings become lanes by tier, ordered so no file is edited by two lanes at once; each brief carries the gates, the baseline diff, both Playwright projects, the ratchet mechanics (extracted code in new files under 1,000 lines, each shrunk ceiling lowered in the same lane, a moved file's key moved with it, invariant 13's module order), the "other sites computing the same number" line or "no computation changes", and "NOT ESTABLISHED beats a complete invented answer" verbatim **[r2]**. Fable reviews the plan before any lane starts. Dann reads it in words.

**Phase 3, the lanes.** Tier 1 and 2 lanes in the cloud; tier 3 (hotspot splits, row 174 among them) on the Mac, as `CONTRACT.md` section 4 and row 174 rule **[r2]**. Fable as built on each; Dann's merge paste. A step that would change behaviour is stopped and reported.

**Phase 4, the developer's documents.** `ARCHITECTURE.md` brought true; a short README per area; the decision records; `CONTRIBUTING.md` documents the gates as they are, the build, both Playwright projects, the ratchets, and the baseline. `names-table.test.ts` and `retired-names.test.ts` run on every edit, and new documents join their list **[r2]**. Dann ratifies anything that speaks for the project.

## 6. Reading units, and order [r2]

At most about 120k to 150k tokens of source each (sizes from the review's byte counts, 3.5 bytes a token, the ratio NOT ESTABLISHED):

| unit | what | about | when |
|---|---|---|---|
| a | `packages/phonology`, `dictionary`, `blurb` | 71k | now |
| b | `score-parser`: parsers and analysis | about 110k | now |
| c | `score-parser`: renderer and layout | about 110k | after lane 56's second follow-up merges |
| d | `apps/web/src/routes` | 75k | after lane 61 merges |
| e | `score/`: Loupe and correction | about 140k | now, less lane-touched files |
| f | `score/`: the rest | about 140k | now, less lane-touched files |
| g | `components/Drawer/` | 109k | after lane 61 merges |
| h | `Paper/`, `Welcome/`, `Field/`, loose components | about 85k | now |
| i | `voice/engine`, `voice/chart` | about 90k | after lane 61 and N.200 settle |
| j | `voice/`, the rest | about 45k | after lane 61 merges |
| k | `omr/` | 113k | now |
| l | `insights/`, `analysis/`, `markup/`, `tempo/` | about 140k | after batch 3 and lane 61 |
| m | `library/`, `text/` | about 100k | now |
| n | `reader/` and the top-level `lib/*.ts` | about 140k | now |
| o | `tools/`, `scripts/` | 107k | any time (Sonnet) |
| t | the tests, about 1.1M tokens | | Sonnet with a dead-fixture script; Fable samples what Sonnet flags |

Unit sizes marked "about" are the desk's division of the review's measured areas; phase 0 measures each.

All refactoring lanes merge before Dann's walks and before the GUIDE's pictures. The freeze waits for the pass, by Dann's rule of 13:17. Tier 3 lands nearest the walks and is the riskiest work, so it gets the characterization tests and runs first among the tiers once its units are read.

## 7. Cost, and the one question for Dann

- Phase 0: scripts, plus fourteen Sonnet packets, 1.6M to 2.8M Sonnet tokens.
- Phase 1, as Dann asked (Fable reads all source whole): **2.6M to 3.4M Fable tokens** (the review's estimate, first of its kind).
- Phase 1, tiered (Sonnet reads everything against the checklist; Fable reads every hotspot, every cross-module edge, and everything flagged): about **0.9M to 1.2M Fable tokens**, plus about 1.5M Sonnet. It changes what he asked for.
- Phase 2: 0.3M to 0.4M. Phase 3: 0.3M to 0.4M a lane for the Fable as-built review, five to eight lanes.
- Never more than two helpers at once.

**The question:** Fable reads all of it, as asked, or the tiered read. The desk's recommendation: all of it, spread across the days, the desk reading his usage screenshots to place each unit (`CONTRACT.md` section 4: usage does not determine the work). What the token figure is as a share of his weekly Fable limit is NOT ESTABLISHED.

## 8. Done when

1. Every unit has a filed packet and a filed read.
2. Every finding is applied, declined with a reason, or put to Dann.
3. After every lane: the eight gates pass at baseline with every count change said; the behaviour baseline is equal byte for byte except the listed intended differences; both Playwright projects pass on the built app; every ratchet ceiling is at or below its start; bundle and `static/` sizes reported **[r2]**.
4. `knip` reports nothing unused outside the keep-list.
5. No comment cites a line number; the header-comment test exists and passes **[r2]**.
6. `ARCHITECTURE.md`, `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, and `NOTICES.md` are true of the tree, shown by a filed table of claim, file, and verdict made by a reader who did not write them **[r2]**.
7. Five developer tasks and their pass mark, written before phase 4 by an agent other than the documents' author; a fresh Sonnet agent given only the repository finds the right files for each **[r2]**.

## 9. NOT ESTABLISHED

- Whether `knip` runs on this workspace.
- The status of consistency batches 3 and 4.
- The token-per-byte ratio, and so every token figure.
- Whether a fixture binder from a released build exists, to test old stored data.
- Whether any test hears sound (`voice/count-in.ts`).
- What the token figures are as a share of Dann's weekly Fable limit.
