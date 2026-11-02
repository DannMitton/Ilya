# Report: consistency batch 2, step 2, the four legend files (Code, cloud lane, r1, 2026-11-02)

Read at: branch `cloud-lane-27`, parent `d7d7d1c1` (step 1), cut `9fa20430`. Working tree clean before the step. Every line below was found by its words, not its line number; the line numbers in parentheses are the cut's.

## Item 0: the score document says MELODY (« CHANT »), and the capitals sweep

| file (cut line) | was | now |
|---|---|---|
| `README.md` (11) | "Text is the transcription ... Markup lays a score ... Insights reads" | "TEXT ... MELODY lays a score ... INSIGHTS reads" |
| `README.md` (13) | "The LEARN module, opened from the link at the top of the page" | "LEARN, opened from its tab at the top of the page" (`DeskHead.svelte`: `linkIds = ['learn', 'guide']`, the head is `position: sticky`) |
| `README.md` (85) | "co-authoring the LEARN module content" | "co-authoring the LEARN content" |
| `README.md` (87) | "drafted Insights' English" | "drafted the English of INSIGHTS" (no possessive on a capitalized name, `interface-text.md` §3) |
| `CONTRIBUTING.md` (11) | "The guidance Insights offers" | "The guidance INSIGHTS offers" |
| `CONTRIBUTING.md` (62) | "LEARN content" | already capitalized; unchanged |
| `AGENTS.md` (11) | "**Markup** and **Insights**" | "**MELODY** (code name today: `markup/`) and **INSIGHTS**" |
| `AGENTS.md` (21) | "Three destinations (Studio, Learn, Guide) ... (Text, Markup, Insights)" | "(Studio, LEARN, GUIDE) ... (TEXT, MELODY, INSIGHTS)"; `markup/` is marked "(MELODY)" |
| `AGENTS.md` (70) | "**Text**, **Markup**, and **Insights**, in French « Texte », « Annotation », and « Aperçus »" | "**TEXT**, **MELODY**, and **INSIGHTS**, in French « TEXTE », « CHANT », and « APERÇUS »" |
| `ARCHITECTURE.md` (17) | "This is the Text document." | "TEXT document" |
| `ARCHITECTURE.md` (20-21) | "**Markup** (« Annotation ») and **Insights** (« Aperçus »)" | "**MELODY** (« CHANT ») and **INSIGHTS** (« APERÇUS »)" |
| `ARCHITECTURE.md` (84-85, 89, 92-93) | "Learn and Guide texts", "(Studio, Learn, Guide)", "(Text, Markup, Insights)" | LEARN, GUIDE, TEXT, MELODY, INSIGHTS |
| `ARCHITECTURE.md` (120) | "`src/lib/markup/` is the Markup document" | "is the MELODY document (`markup/` is its code name today; the screen says MELODY)" |
| `ARCHITECTURE.md` (123) | "is the Insights document" | "INSIGHTS document" |
| `ARCHITECTURE.md` (132, 135, 167) | "Markup and Insights" | "MELODY and INSIGHTS" |

Left as it was: `README.md` "a Learn feature that could analyze a singer's voice" (the 2016 course report's own Future Work, quoted); `README.md` "Introduction and Annotations" (Grayson's title); the lowercase identifiers `markup/`, `learn`, `'text'` in code font; "Studio" (no screen name). The Studio and drawer words ("the drawer") are not in the review's list and are unchanged.

## "The Paper GUI" becomes "the page" (Dann's ruling; review amendment 5)

`ARCHITECTURE.md` 23, 92, 161-164. Deviation from the review's exact text: it asked for "the page (`components/Paper/`; the Paper GUI in older notes)" at line 23 and said the guard then passes without an exception. It does not: the retired pattern `the Paper` (en, `names.ts`) matches "the Paper GUI". I wrote "the **page** (its folder is `components/Paper/`)" instead, so the guard in step 4 needs no exception for these lines.

## Item 1: README.md

- Node: "requires Node.js 20 or later: CI tests on Node.js 20 (`.github/workflows/ci.yml`), and Vercel builds the deployed app on Node.js 24." Read today: `ci.yml` `node-version: 20` (two jobs); the Vercel project `ilya` reads `nodeVersion: "24.x"` through the Vercel connector (read-only `get_project`, 2026-11-02). There is no `.npmrc` at the root or in `apps/web`, so `engine-strict` is not set and `engines` could change.
- `package.json` `engines.node` is now `>=20.0.0` (was `>=18.0.0`). `pnpm-lock.yaml` does not record it; the install ran cleanly with `--frozen-lockfile` before the change and the gates pass after it.
- The tree adds `apps/web/e2e-phone/` (nested under `apps/web/`), `docs/`, and `third_party/`, one line each. `e2e-phone` says "not yet in CI", which `ARCHITECTURE.md` (Cross-cutting concerns) already states.

## Item 2: CONTRIBUTING.md

- The voice: "Blurb content follows the register described under 'What Will Not Be Merged' below and the words rule in `docs/house-style/interface-text.md`, section 5." `docs/house-style/SKILL.md` is the style for writing to the maintainer, so it is not cited. NOT ESTABLISHED: a fuller document of the singer's register. None exists in the tree, so the pointer is to what does.
- New section "Naming" (five lines): the five names in capitals with their French; `apps/web/src/lib/names.ts` is the list; `retired-names.test.ts` fails on a retired name (it exists from step 4's commit); the two house-style files are the rules.

## Item 3: AGENTS.md

- Node 18+ is now Node 20+.
- Line 13 is history and stays: "shown on screen as Fit until 2026-09. N.174 (2026-09-27) renamed the code to Text, Markup, and Insights", with "; the screen says TEXT, MELODY, and INSIGHTS since 2026-11-01" added.
- `SHANE_ILYA_SOURCE_INDEX.md`: `git fetch --unshallow` ran in step 0; `git log --all -- SHANE_ILYA_SOURCE_INDEX.md` returns nothing, and `git ls-files` finds no file of that name or of `phonation-tool-handover*` or `gould-vocal-engraving-rules*`. The item is removed and the list renumbered (Grayson is now 4).
- The handover (`phonation-tool-handover_vN`) and the Gould extraction (`gould-vocal-engraving-rules_v6`) are also outside the tree, so they stay, and one sentence heads "Source hierarchy": they "live in the maintainer's project knowledge, not in this repository. Inside the repository the order is `ARCHITECTURE.md`, then `docs/memory/`, then `docs/sessions/`".
- Roles: "the sole writer of code" now carries "(as of 2026-09; `README.md`, Design and Attribution, has the current division)".
- Line 60 "paraphrase-then-*Fit:* shape" stays: it is the Gould extraction's own label, not the document.

## Item 4: ARCHITECTURE.md

- `Tessituragram.svelte`: the INSIGHTS bullet no longer says it draws the page. It says the file is not drawn today, that nothing imports it (checked: the only references are the type `TessituragramModel`, its layout module, and a doc comment; `SingerBlock.svelte` line 19 imports `PitchSeconds`), and that batch 4 holds it.
- The wall variable names `apps/web/.env`, which is tracked (`git ls-files`) and holds `PUBLIC_INCLUDE_MARKUP_INSIGHTS=true`.
- The dated memo pointer is removed; "Where decisions are recorded" already covers `docs/sessions/`.
- Modules added to the codemap, each from reading the files' own headers: `components/Field/`, `text/` (the review's addition), `omr/`, `tempo/`, `approval/`.
- Lines 7-8 are history and now sit on one line, so the guard's exception can key on one substring.

## Item 5

`kimi-brief-cosmetic-critique-deferred_2026-07-13.md` moved to `docs/sessions/` with `git mv` (shown as a rename). Nothing else in the tree cites it by its root path.

## Item 6: the two house-style files (amendment 14)

- `interface-text.md`: the spot keys (`inspector.spot.reduction`, `inspector.spot.reconstitution`); the 117 choices (now 24 in 14 files, per `report-code-consistency-1-step1_r1_2026-11-01.md`); the guard (`retired-names.test.ts`, what it reads, the GUIDE's `Fit` check until row 171); "Not yet true" re-dated to `9fa20430`. The row at line 20 ("to be `tab.melody`") and the "Until consistency batch 1 creates `names.ts`" sentence are left for step 3, which fixes the table and tests it.
- `code-conventions.md`: the index is hand-written and checked by `i18n-index.test.ts`; the header test, the module map, and the citation sweep come after batch 3. The rules did not change, only the statements of fact.
- Both files are ratified; they change with their facts under CONTRACT §1 item 11a.

## Legend lines whose truth depends on batch 3

- `ARCHITECTURE.md`: the `src/lib/markup/` and `MarkupPane.svelte` bullet; invariant 13's module list; the voice bullet's `shane.profiles.v2` "by invariant 10" (plan r2 item 1 ruled no carry-over read before release, so that clause is true today and dated after batch 3).
- `AGENTS.md`: "code name today: `markup/`" and "`markup/` (MELODY)".
- `scripts/ratchets.mjs` shares the module list (not touched).
- The forward references to `retired-names.test.ts` (step 4) and `i18n-index.test.ts` (step 5) are true at the end of the batch, not at this commit.

## The eight gates

Phonology `Tests  407 passed (407)`; dictionary `248 passed (248)`; web-check `svelte-check found 0 errors and 12 warnings in 5 files`; web-test `3803 passed | 1 skipped (3804)`; score-parser `785 passed | 5 skipped (790)`; blurb `148 passed (148)`; integration `98 passed (98)` (after `svelte-kit sync`); `ratchets: OK.`

## Not established, and noticed

- How Dann commits today: `AGENTS.md` ("Dann reviews and commits by hand via GitHub Desktop") against CONTRACT §4 (the cloud lane). Not edited.
- The repository's GitHub name: `README.md` clones `git@github.com:DannMitton/Ilya.git`; this session's repository is `dannmitton/ilya` (case-insensitive on GitHub). Not edited.
- Two licences: `README.md` says MIT (and the AGPL-3.0 for the whole), `package.json` says MIT. Not this batch's to settle.
- The LEARN sentence says the tab is "at the top of the page"; I read the tab's code, not a rendered page.
