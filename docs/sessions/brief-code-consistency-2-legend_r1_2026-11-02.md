# Brief: consistency batch 2, the contributors' legend (Code, cloud lane, r1, 2026-11-02)

Written by the desk (Opus) from the consistency audit (`report-desk-consistency-audit_r1_2026-11-01.md`, sections B, C.6, F.4 lines on the legend, E item 2) and the plan (`plan-desk-consistency_r2_2026-11-01.md`, "r2: Fable's review applied", items 2, 4, 5, 6). Dann's aim (2026-11-01 11:55): code that "leaves no loose ends and that I will be proud to release to the coding community". NOT Fable-reviewed until its review file sits beside it.

## Lane

Model Sonnet. Branch `cloud-lane-27`, cut from `Shane` at its tip (at or after `ce5dc96f`, row 175's ship). Push only `cloud-lane-27`; never push `Shane` or `main`; open no pull request. Commit no file under `docs/memory/` and no `brief-*` or `review-*` file. One commit per step, each with its report at `docs/sessions/report-code-consistency-2-step<n>_r1_2026-11-02.md`.

## What this batch is, and is not

It makes what a contributor reads first true: `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `ARCHITECTURE.md`, the key index at the top of `apps/web/src/lib/i18n.ts`, and the guard that keeps retired names out. It does NOT rename code identifiers, folders, or stored keys (batch 3), delete dead code (batch 4), or write the comment sweep and module map (after batch 3, so comments name current terms; DESK DEFAULT, plan step 3a). Where the legend names a thing batch 3 renames (`lib/markup/`, `MarkupPane.svelte`, `ARCHITECTURE.md`'s module list and invariant 13, `scripts/ratchets.mjs`), it keeps today's code name and says the screen calls it MELODY.

## Rulings this batch carries

- Names on screen are TEXT, MELODY, INSIGHTS, LEARN, GUIDE; TEXTE, CHANT, APERÇUS, LEÇONS, GUIDE. In the legend, comments, and test descriptions these are written in capitals when they mean the document or tab; identifiers, files, and folders stay lower case (Dann 2026-11-01 12:28; plan r2 item 9).
- Ratified text changes with its pin (`docs/memory/CONTRACT.md` §1 item 11a).
- **The French colon** (Dann 2026-11-02 09:02, OQLF: « Une espace insécable » before the deux-points): the seventeen palatalization comments in `data/blurb-composer.json` take U+00A0 before every colon, as the ratified file `docs/sessions/ratified-palatalization-comments-fr_2026-11-02.md` now does (read it; it is the source). Their copy in `tests/palatalization-comments.test.ts` changes with them, and the header comment there that says the colon has an ordinary space is corrected. No word changes.

## Steps

**Step 0, baselines.** All eight gates on the cut: phonology "407 passed (407)", dictionary "248 passed (248)", web-check "found 0 errors and 12 warnings in 5 files", web-test "3803 passed | 1 skipped (3804)", score-parser "785 passed | 5 skipped (790)", blurb "148 passed (148)", integration "98 passed (98)" (run `pnpm -C apps/web exec svelte-kit sync` first, as row 175 step 4 did), `pnpm ratchets` "ratchets: OK.". A difference is reported before step 1.

**Step 1, the French colon.** As ruled above. Done when every colon in the seventeen French templates is preceded by U+00A0, the test copy matches the ratified file byte for byte, and gates 6 and 7 pass.

**Step 2, the four legend files.** Each item names the file and the words found by the desk on `Shane` `6263686a` (2026-11-02 09:1x); re-find each by its words, not its line.
1. `README.md`: "The LEARN module" (about `:13`) names LEARN as the screen does, in capitals, and says where it opens today; "requires Node.js v18 or later" (about `:33`) states the version CI tests (`.github/workflows/ci.yml`, `node-version: 20`) and that Vercel builds on a later one; the root `package.json` `engines.node` says the same. If `.npmrc` sets `engine-strict`, stop and report instead of changing `engines`. The project tree (about `:56-68`) adds `docs/`, `third_party/`, and `apps/web/e2e-phone/`, each with one line of what it is.
2. `CONTRIBUTING.md`: "the voice and register documented in the project's voice instruction" (about `:38`) names the file that holds that voice in the tree (read `docs/house-style/` first; if none holds it, say the house style and name its file). "LEARN module" (about `:62`) as above. Add a section "Naming" of at most five lines: the five names in capitals; `apps/web/src/lib/names.ts` is the list; the guard in step 4 fails on a retired name; `docs/house-style/interface-text.md` and `code-conventions.md` are the rules.
3. `AGENTS.md`: the three documents shown "as **Text**, **Markup**, and **Insights**, in French « Texte », « Annotation », and « Aperçus »" (about `:70`) and the matching lines about `:11`, `:13`, `:21` say TEXT, MELODY, INSIGHTS / TEXTE, CHANT, APERÇUS; a line that records history ("shown on screen as Fit until 2026-09") stays as history with today's name added. `SHANE_ILYA_SOURCE_INDEX.md` (about `:51`) is not in the tree: remove the item and renumber, or point it at what replaced it if `git log --all -- SHANE_ILYA_SOURCE_INDEX.md` shows a successor. "Node 18+" (about `:19`) as in item 1.
4. `ARCHITECTURE.md`: the INSIGHTS line naming `Tessituragram.svelte` as drawing the page (about `:123`) says it is not drawn today (nothing imports it; `SingerBlock.svelte` mounts `PitchSeconds`) and is held for the dead-code batch; the wall variable `PUBLIC_INCLUDE_MARKUP_INSIGHTS` (about `:133`) names the tracked file that sets it, `apps/web/.env`; the pointer to a dated memo for newcomers (about `:220`) is replaced by the current material it stood for, or removed if `:231-233` already covers it. Add the modules the codemap omits: `lib/components/Field/`, `lib/tempo/`, `lib/approval/`, `lib/omr/`, one line each from reading their files.
5. The repository root carries `kimi-brief-cosmetic-critique-deferred_2026-07-13.md`, a dated brief. Move it to `docs/sessions/` with `git mv` (DESK DEFAULT: history kept, root cleared).

**Step 3, the names table and its test.** `ARCHITECTURE.md` gains a table "Names": one row per record in `apps/web/src/lib/names.ts`, with the concept, the English and French screen names (read through `t()`), the code identifier and folder today, and any retired screen words. A test (`apps/web/src/lib/names-table.test.ts`) parses that table and fails if it and `names.ts` disagree in either direction. Correct the header of `names.ts` ("What reads it") to name both readers.

**Step 4, the guard.** `apps/web/src/lib/no-fit-name.test.ts` becomes `retired-names.test.ts` (with `git mv`). It reads every record's `retired` patterns from `names.ts` and fails on any of them in: every `i18n.ts` value, both languages; LEARN (`LearnContent.svelte`, both language branches, comments stripped); and the four legend files outside lines that state history (an explicit, commented exception list that cannot grow quietly). The GUIDE is NOT added here: row 171 cleans it and adds it. Keep the three ratified-passage pins the old file holds (move them to `ratified-lines.test.ts` if that is where such pins live) and drop `KNOWN_FIGCAPTIONS`, `stripFigcaptions`, and the figcaption test only if the GUIDE no longer needs them; otherwise keep them for row 171 and say so. Prove the guard with a positive control: plant one retired word in a copy, see the test fail, remove it.

**Step 5, the key index.** Regenerate the index at the top of `i18n.ts` (about `:7-85`) from the keys as they are: each prefix, its count, and its live consumers. `Tessituragram.svelte` is not a consumer (C.6). The total is counted, not typed (the audit parsed 1,023 against a stated 881). If the index can be produced by a script, add the script under `scripts/` with zero new dependencies and a ratchet-style check that fails when the committed index differs; if not, say why and leave it hand-written and correct.

## Every other site (CONTRACT §4)

Not a computation. The same names are drawn on screen (batch 1) and in the GUIDE (row 171); this batch must not contradict either. List any legend line whose truth depends on batch 3's renames.

## Ratchets

`i18n.ts` is exempt (`scripts/ratchets.json`). No source file here should grow past its ceiling; if one would, stop and report.

## Report, each step

What changed, file by file; the gate lines; the positive control for the guard; every line kept as history and why; what you could not establish. NOT ESTABLISHED beats a complete invented answer.
