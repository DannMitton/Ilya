# Tool trials: dependency-cruiser and knip against Ilya

Both tools installed under `/tmp/audit-tools/{depcruise,knip}` via `npm i --no-save` in a scratch directory, never touching the repo's `package.json` or lockfile. Configs run from `/tmp`, pointed at `/home/claude/ilya`. Working configs saved alongside this memo: `.dependency-cruiser.cjs`, `knip.jsonc`.

## (a) dependency-cruiser

**Versions:** `dependency-cruiser@18.4.0` (`npx depcruise --version`, this session).

**Does it parse Svelte 5 `.svelte` files?** **No.** Its FAQ's caveat about Svelte 4 undersells the actual gap: it does not parse `.svelte` files of any version. Run against `apps/web/src` and `packages/*/src` with `.svelte` explicitly listed in both `options.extensions` and `enhancedResolveOptions.extensions`:

```
npx depcruise --config .dependency-cruiser.cjs --output-type json \
  /home/claude/ilya/apps/web/src /home/claude/ilya/packages/*/src
```

Result: **272 modules total, 0 of them `.svelte`.** The tree holds 43 `.svelte` files under `apps/web/src` (`find apps/web/src -name "*.svelte" | wc -l`, this session). Every one is invisible to the tool as a source module: dependency-cruiser's file-picker only recognizes a fixed set of JS/TS-family extensions as things it will parse for `import`/`require` statements, and `.svelte` is not in that set regardless of the `extensions` config, which only affects *resolution* of import targets, not which files are treated as parseable entry modules. So dependency-cruiser can tell you what a `.ts` file imports, including a `.svelte` file by path, but it can never tell you what a `.svelte` file itself imports, because it never opens one as a source.

**Module count:** 272 (all `.ts`/`.js`; none `.svelte`).

**Do `.svelte` imports resolve?** N/A in the sense above, but as import *targets* referenced from `.ts` files, alias-style imports (`$lib/...`) fail to resolve: 65 unresolved dependency edges, all of the form `$lib/<path>` (SvelteKit's path alias), because this session's config did not configure `enhancedResolveOptions` with SvelteKit's `$lib` alias (`tsConfig` alone did not propagate it into dependency-cruiser's own resolver). Example unresolved edges: `apps/web/src/lib/library/library.ts -> $lib/shane/pairings`, `apps/web/src/lib/shane/vowel-resolver.ts -> $lib/pipeline`. This is a config gap in this trial, not a tool limitation; a `tsConfig.compilerOptions.paths` entry for `$lib` combined with `enhancedResolveOptions.alias` would likely fix it in a later phase, but this session did not iterate further given the more fundamental `.svelte`-parsing gap above.

**Circular dependencies:** 2 pairs found (4 directed edges):
- `apps/web/src/lib/library/driver.ts` ↔ `apps/web/src/lib/library/library.ts`
- `packages/score-parser/src/phonation.ts` ↔ `packages/score-parser/src/tempo-seam.ts`

**Orphans:** 5 modules with no incoming or outgoing resolved dependency:
- `apps/web/src/app.d.ts`
- `apps/web/src/lib/gloss-resolve.ts`
- `apps/web/src/lib/shane/engine/vendor/webmscore.d.ts`
- `apps/web/src/lib/wall.ts`
- `apps/web/src/routes/+layout.ts`

Two of these (`gloss-resolve.ts`, `wall.ts`) are plausible false positives for "orphan" in the tool's sense: they may well be imported only from `.svelte` files, which this run cannot see at all (see above), so "orphan" here likely means "not imported by any `.ts` file," not "unreachable from the running app." This should be re-checked once `.svelte` parsing is solved or supplemented with a text-grep cross-check (this session's own grep for `wall.ts`'s export, `PUBLIC_INCLUDE_SHANE`, was not run separately to confirm or deny this).

**Any package importing from `apps/`?** **None.** Zero violations of the `packages-no-import-apps` rule written into the config; independently confirmed by a plain grep this session (`grep -rn "from ['\"].*apps" packages/*/src` returns nothing).

**Bottom line on dependency-cruiser for this repo:** usable for the `packages/*` and `apps/web/src` **TypeScript** layer's own import graph (272 modules, real circular-dependency and orphan detection there), but **blind to the Svelte component layer entirely**, which is most of the UI (`Drawer/`, `Paper/`, `shane/*.svelte`, `Reading/`). A dependency map claiming to describe "the architecture" from this tool alone would silently omit every Svelte-to-Svelte and Svelte-to-TS import edge that originates in a `.svelte` file's `<script>` block. A real Svelte-aware dependency graph would need a preprocessor (Svelte's own compiler can extract the `<script>` block's AST) feeding a custom resolver, which is more than a config change; not attempted this session.

## (b) knip

**Version:** `knip@6.38.0` (`npx knip --version`, this session).

**Config:** `knip.jsonc`, workspace-aware for the pnpm monorepo, one entry per package (`apps/web` entry points at `src/routes/**/+*.{ts,svelte}` plus `vite.config.ts`; each `packages/*` entry point at its own `src/index.ts`). Run from the repo root with `--config` pointed at a copy outside the repo:

```
node <knip-bin> --config /tmp/knip.jsonc --no-exit-code --reporter json
```

A one-line startup message appeared: `No Svelte config file found in /home/claude/ilya - using SvelteKit's default configuration without an adapter.` This is knip's own Svelte plugin auto-detecting the SvelteKit project and falling back gracefully; it did not stop analysis, and (unlike dependency-cruiser) knip's plugin architecture *does* have real Svelte-file support, since two of its findings are Svelte files (`apps/web/src/lib/shane/TextualWitnesses.svelte` flagged as an unused file).

**Counts:**
- **28 unused files.** Of these, 15 are pre-existing scratch/spike code outside any declared production surface (`tools/e16-harness/**`, `tools/n168-frequency-run/{comments-oracle.ts,frequency-run.run.ts,vitest.config.ts}`), 3 are build/data scripts at the repo root (`scripts/build-dictionary.ts`, `scripts/build-homographs.mjs`, `scripts/stage7b-french-coverage-check.mjs`), 2 are stray `.js` files under `docs/sessions/` (design-tool support scripts, not application code), and **1 is a real, in-tree production file: `apps/web/src/lib/shane/TextualWitnesses.svelte`**, independently confirmed dead by `memo-audit-code-catalogue-a_r1_2026-09-24.md §3` two days before this audit ("Empty grep, whole repository... No `.svelte` mounts it and no route or component imports it").
- **11 unused exports**, all named (see table below).
- **12 unused exported types.**
- **0 unused dependencies, 0 unlisted dependencies, 0 duplicate exports** (checked separately with `--include dependencies,unlisted,binaries`, result: `{"issues":[]}`).

**Suspected false positives, with reason:**
- The 15 `tools/e16-harness/**` and 3 `tools/n168-frequency-run/**`/`scripts/**` files are flagged "unused" only because this session's `knip.jsonc` declared workspaces for `apps/web` and `packages/*` alone, with no workspace entry for `tools/` or `scripts/`. Knip still walked those directories as part of its default project glob but had no declared entry point for them, so every file in them reads as unreachable. `memo-audit-code-catalogue-b_r1_2026-09-24.md` independently confirms most of these are real, wired-together tooling (the E.16 OMR-benchmarking harness has a genuine internal entry point, `run-harness.ts`, that imports the others) rather than truly dead code; they are unused *by knip's configured scope*, not unused by the product. A corrected config would add `tools/*/src/**` and `scripts/**` as their own workspace/entry declarations before trusting this count.
- The 2 `docs/sessions/*.js` files (`support.js`, `design-return-insights_r3_support.js`) are design-handoff artifacts explicitly noted elsewhere as superseded/not needed (`docs/sessions/INDEX.md:154`: "not needed by r2, per the design handoff README"); knip is technically correct that they are unused, but they are documentation-adjacent debris, not application dead code, so they do not belong in the same remediation bucket as `TextualWitnesses.svelte`.
- None of the 11 unused exports or 12 unused types look like false positives on inspection of their names and locations; they read as plausible real candidates for review (small, specific, named constants and types, e.g. `ROW_GAP`, `CLOSE_VOWELS`, `TUPLET_COUNTS`), though this session did not re-open each file to confirm no dynamic/string-based reference exists.

**Top 20 findings** (28 unused files + 11 unused exports = 39 total items; showing all unused files first since there were fewer than 20, then the exports/types up to 20 total):

1. `apps/web/src/lib/shane/TextualWitnesses.svelte` — unused file (real finding, confirmed by independent source)
2. `scripts/build-dictionary.ts` — unused file (likely false positive: build-time script, no declared entry point)
3. `scripts/build-homographs.mjs` — unused file (same)
4. `scripts/stage7b-french-coverage-check.mjs` — unused file (same)
5. `docs/sessions/support.js` — unused file (documentation debris, not application code)
6. `docs/sessions/n127-design-pack/design-return-insights_r3_support.js` — unused file (same)
7–19. `tools/e16-harness/**` (13 files) and `tools/n168-frequency-run/**` (3 files) — unused files (likely false positives: no declared workspace/entry point in this session's config; independently shown wired together internally by `memo-audit-code-catalogue-b_r1_2026-09-24.md`)
20. `apps/web/src/lib/composers-poets.ts :: extractSurname` (line 198) — unused export

**Full unused-export list** (11): `composers-poets.ts::extractSurname`, `i18n.ts::stressSourceLabel`, `pipeline.ts::applyNotationPreferences`, `shane/pairings.ts::savePairings`, `shane/pairings.ts::loadPairings`, `shane/engraving.ts::minGapFor`, `shane/entry.ts::TUPLET_COUNTS`, `shane/comments.ts::CLOSE_VOWELS`, `page-config.ts::ROW_GAP`, `provenance.ts::showProvenance`, `shane/engine/extract.ts::ltasFormants`.

**`analyzePerVerse`:** **Not flagged by knip anywhere** in the files or exports lists (checked by direct string search of the parsed JSON result this session). The project forbids deleting it (`docs/memory/CONTRACT.md §6`); knip's silence here is consistent with the function being reachable by knip's own static analysis, which is reassuring but is not the same as proof of a live runtime caller. `memo-audit-code-catalogue-a_r1_2026-09-24.md` separately flags `analyze-per-verse.ts`'s **module** (not the specific `analyzePerVerse` export) as "suspect, not confirmed" dead, because a whole-tree text grep for the identifier found only its own definition and its own test file. Knip not flagging it despite that grep result likely means knip is crediting the file's own test file as a "use," or crediting some re-export path the text grep missed; this session did not reconcile the two tools' disagreement further. Either way, **the file was not flagged as a target for deletion by either tool, and this audit does not recommend deleting it.**

**Bottom line on knip for this repo:** functional out of the box for a pnpm+SvelteKit workspace, correctly Svelte-aware (catches `TextualWitnesses.svelte`), and reports zero unused/unlisted dependencies, which is a clean result worth taking at face value given knip's dependency-checking does not depend on the workspace-declaration gap that affected the file-level findings. The file-level "unused" count is inflated by this session's config not declaring `tools/` and `scripts/` as their own workspaces; a corrected run would very likely shrink the 28 down to roughly 13 (`TextualWitnesses.svelte` plus the design-handoff `.js` debris), with the `tools/e16-harness`/`n168-frequency-run` cluster moved to "not analyzed" rather than "unused."
