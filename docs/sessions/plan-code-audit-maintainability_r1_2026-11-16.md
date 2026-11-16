# Plan: the maintainability audit and one refactoring pass (r1)

Written by the desk (Opus 5.5), 2026-11-16 13:3x, at Dann's request of 13:17 and 13:25 (`docs/memory/INBOX.md`). Tree read: `Shane` `a16c011c`. Status: DRAFT for Fable's review; nothing has run. Item 4 of `docs/memory/SCHEDULE.md` r6. DESK DEFAULT number: N.204.

## 1. What Dann asked for, in his words

*"a Fable audit of the code where you actually read the code in its entirety and housekeep: get rid of dead code, assess how the modules are organized and relate, make sure comments in the code are economical but helpful, delete redundant comments; basically prepare this code to encounter future developers who wish to improve it and make it easy for them to navigate the code and undestand how it works, why it is organizaed teh way it is, any relatiopnships between code segments that may noit seem apparent... Research that and adopt a schema that works for us then use it to refine Ilya's code."* (13:17). *"yes to one planned pass for refactoring; I defer to your research"* (13:25).

## 2. The outcome, from a future developer's chair

A developer who has never met Dann clones the repository and, in one afternoon, can:
1. find where any singer-visible behaviour lives, from `ARCHITECTURE.md` and one level of folder READMEs;
2. read any module and understand why it is shaped as it is, from its header comment and the decision records it points to;
3. see the relationships that are not visible in imports (shared numbers computed in two places, string keys read by tests, byte baselines, ratchets, the gates);
4. change a module with the tests telling them what they broke;
5. meet no dead code, no comment that restates the line below it, and no comment that is false.

What does not change: anything a singer sees, hears, prints, or stores. Every refactoring step is behaviour-preserving and proven so by the eight gates, the byte baselines, and the named Playwright suites.

## 3. The schema

Adopted by the desk from its research (Dann deferred the choice, 13:25):

- **What "maintainable" means: ISO/IEC 25010, the maintainability characteristic**, with its five sub-characteristics, each turned into questions the audit asks of every module:
  - *Modularity:* does a change here force changes elsewhere? Are the boundaries the codemap draws real (the packages never import the app; at runtime no package imports another)?
  - *Reusability:* is the same logic written twice? Is a number computed in more than one site (`CONTRACT.md` section 4 already requires naming such sites)?
  - *Analysability:* can a reader find and understand it? File size against the ratchets, function length, names, header comments, comments that restate code, comments that are stale or false.
  - *Modifiability:* can it be changed without breaking something unrelated? Hidden coupling: string keys, DOM attributes read by other components (`data-hit`, `data-verse-hit`), globals, module-level state.
  - *Testability:* are the behaviours pinned, and are the tests themselves readable? Tests that test nothing, duplicated fixtures, dead fixtures.
- **How it is changed: refactoring in Fowler's sense** (*Refactoring*, 2nd ed., 2018): small behaviour-preserving transformations, each named (extract function, move module, inline, delete dead code, rename), each followed by the tests. Code smells are the finding vocabulary (long function, large module, duplicated code, shotgun surgery, feature envy, speculative generality, dead code, comments that excuse code).
- **One planned period, not scattered changes.** An empirical study of 315 refactoring commits in six large systems found single refactorings make little difference and can lower maintainability, while a whole refactoring period raises it (Szőke et al., *Journal of Systems and Software*, 2017; read as abstract only). Dann ruled one planned pass, 13:25.
- **Where the reasons live: decision records.** A short "why" belongs beside the code it explains (a header comment), and a decision that spans modules gets a decision record in `docs/decisions/` (Nygard's form: context, decision, consequences), pointed to from the code. Rulings already in `docs/memory/` are cited by section, not copied.
- **Measured, not felt.** Every finding carries a file and line. Tools give the candidates, a reader gives the verdict: `knip` (unused files, exports, dependencies) and the TypeScript compiler's unused checks list dead-code candidates; nothing is deleted on a tool's word alone.

## 4. What is in scope, and what is not

In scope (lines of source outside tests, desk count at `a16c011c`): `apps/web/src/lib` 95,068; `apps/web/src/routes` 5,755; `packages/score-parser` 16,995; `packages/phonology` 3,188; `packages/dictionary` 1,422; `packages/blurb` 1,021; the tests (about 82,900 lines) for readability and dead fixtures; `scripts/`; `ARCHITECTURE.md`, `AGENTS.md`, `CONTRIBUTING.md`, `README.md`.

Read for boundaries only, not refactored: `third_party/homr-web` (24,912 lines, vendored). Its edges with Ilya are audited; its insides are another project's.

`tools/` (about 18,000 lines, mostly `tools/e16-harness`): each tool is classified as live (a gate, a build step, or a measure still used), archive (kept, marked, out of the way), or remove. Dann decides nothing here unless a tool he used is proposed for removal.

Fixed by Dann's rulings and never touched by the audit (`CONTRACT.md` section 8): `VocalLineEvent`; anything under `apps/web/src/lib/score/reconciliation/`; `analyzePerVerse`; `underlay-donor.ts` is not turned into the alignment engine; no stored-format change (a saved song, a binder, a voice) without a migration and Dann's word; no ratified string changed; no ceiling raised in `scripts/ratchets.json`. A finding that touches one of these goes to Dann as a finding, never as a change.

A lead the audit settles first: `ARCHITECTURE.md` and `AGENTS.md` say no part of Ilya's analysis is learned and the music reader has no trained model, while the scan path reads with homr and the underlay with a trained `rus_prereform` model (`CONTRACT.md` section 1 item 12 records the charter tripwire T3 dropped 2026-10-04). If the documents are false, the true wording goes to Dann, because it is a claim made under his name.

## 5. The phases

**Phase 0, the map (Sonnet, read only).** For each area: the files, their sizes against the ratchets, the import graph, `knip` and `tsc --noUnusedLocals --noUnusedParameters` output, every comment block over ten lines, every `TODO`, `FIXME`, `UNUSED`, and every comment that names a ruling. Output: one packet per area, every line cited. Sonnet, about 150k to 250k tokens an area, six areas.

**Phase 1, the judgement read (Fable, read only).** Fable reads every source file in an area in full, with its packet, and writes findings against section 3's questions: each finding a file and line, the smell, the proposed refactoring by name, the risk, and the test that proves behaviour unchanged. It also writes, for the area, the paragraph a future developer needs and the hidden relationships it found. Areas run one at a time. About 250k to 400k Fable tokens an area.

**Phase 2, the refactoring plan (desk, then Fable review).** The findings become lanes: ordered so that files edited by one lane are not edited by another at the same time; each lane a Code brief with the gates once at the end, the byte baselines, and the named Playwright suites. Fable reviews the plan before any lane starts (`CONTRACT.md` section 1 item 19). Dann sees the plan in words: what changes for a developer, that nothing changes for a singer, and the cost.

**Phase 3, the refactoring lanes (Code, cloud).** One lane per area or pair of areas. Each step behaviour-preserving, tested at the end; Fable as built on each lane; Dann's merge paste. A refactoring that would change behaviour is stopped and reported, never folded in.

**Phase 4, the developer's documents.** `ARCHITECTURE.md` brought to the tree as it stands after phase 3; a short README per area; decision records for the cross-module decisions; `CONTRIBUTING.md` gains how to run the gates, the ratchets, and the byte baselines. Dann ratifies anything that speaks for the project (the README's first page, claims about AI).

## 6. Order, against the work already running

The areas, and when each is read and changed (DESK DEFAULT, the reasoning in one clause each):

1. `packages/phonology`, `packages/dictionary`, `packages/blurb`: read now; no lane touches them.
2. `packages/score-parser`: read once lane 56's second follow-up merges, since it edits `render-score.ts` and `render-seam.ts`.
3. `apps/web/src/lib` outside `voice/`, `components/Drawer/`, `insights/`, and `routes/`: read now; change after lane 61 merges, since the VOICE lanes share `i18n.ts` and `+page.svelte`.
4. `apps/web/src/lib/voice/`, `components/Drawer/`, `insights/`, `apps/web/src/routes/`: read and change after lane 61 merges; these files are moving today.
5. `tools/` and `scripts/`: read any time.
6. The documents of phase 4: last, after phase 3.

All refactoring lanes merge before Dann's walks and before the GUIDE's pictures, so the walks see the code that ships. The freeze waits for the audit, by Dann's rule of 13:17 that the date serves the work.

## 7. Cost, stated before it starts

- Phase 0: six Sonnet packets, 0.9M to 1.5M tokens in all.
- Phase 1: six Fable reads, 1.5M to 2.4M tokens in all.
- Phase 2: the plan and its Fable review, 0.3M to 0.4M.
- Phase 3: Code lanes (cloud sessions) and one Fable as-built review each, 0.3M to 0.4M a lane, three to five lanes.
- In all, about 3.9M to 6.3M tokens, about half of it Fable. A range, first of its kind (`docs/memory/ENVIRONMENT.md`, ESTIMATES BY KIND OF JOB). Dann said yes to the farm-out at 13:25 on the desk's earlier figure of 2M to 3.5M for phases 0 and 1; this plan's figure for those two phases is 2.4M to 3.9M, and the overrun is told to him.
- Never more than two helpers at once.

## 8. Done when

1. Every area has a filed packet and a filed Fable read.
2. Every finding is applied, declined with a reason, or put to Dann.
3. The eight gates, the byte baselines, and the named Playwright suites pass at baseline after every lane, with the gate counts changing only by tests added or removed on purpose and said.
4. `knip` reports no unused file or export that is not on a named, reasoned keep-list.
5. `ARCHITECTURE.md` is true of the tree, line by line, checked by a reader who did not write it.
6. A fresh Sonnet agent, given only the repository and five tasks a developer might have, finds the right files for each from the documents alone.

## 9. NOT ESTABLISHED

- Whether `knip` runs cleanly on this workspace (SvelteKit, `$lib`, Svelte 5 runes).
- How many findings there will be, and so how many lanes.
- Whether any dead code is reached only on a path no test exercises (the reason no deletion rests on a tool alone).
- The study of section 3 was read as its abstract only.
