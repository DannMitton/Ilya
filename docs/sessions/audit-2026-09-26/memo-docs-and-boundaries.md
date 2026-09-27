# Phase 0 baseline audit: memo

Read-only work against `/home/claude/ilya`, branch `Shane`, HEAD `b7c2fc6`. Outputs: `inventory.md`, `codemap-draft.md`, `invariants.md`, `tool-trials.md`, all under `/home/claude/audit/phase0-docs/`, plus the two working tool configs, `.dependency-cruiser.cjs` and `knip.jsonc`, saved alongside them.

## Task 1: inventory of existing architecture documentation

Read in full: `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `docs/french-gloss-pipeline.md`, `docs/memory/README.md`, `docs/memory/CONTRACT.md`, and `docs/memory/PRODUCT.md`'s headings and its one structural section, "Where the code lives." From `docs/sessions/` (374+ files, no full index), read five files judged most relevant to structure/storage/architecture by name: the two-part save-function design (`e52-fable-save-design_r1`, `e52-fable-save-socket_r1`, both 2026-08-16), and three 2026-09-24 audit memos (`memo-audit-code-catalogue-a`, `-b`, `memo-audit-rulings-vs-tree`). Skipped, and why: `e52-fable-save-retention_r1` (numbers superseded by save-design §6, which was read), `e52-brief-to-fable_r1` and the two `brief-audit-*` files (briefs are instructions, not findings). No file in `docs/sessions/` is actually named or described as a structural map; an earlier scan of a very long `find` listing led to a wrong assumption about this, corrected before writing anything down.

The top-level onboarding docs (`README.md`, `CONTRIBUTING.md`) describe a three-package shape of the repository that predates `packages/score-parser`, `apps/web/src/lib/shane/`, and `apps/web/src/lib/library/`, none of which they mention, despite all three being large and load-bearing. The project's own internal memory document, `docs/memory/PRODUCT.md`, states the app's single route file is 1,948 lines; it is actually 6,225 lines (`wc -l`, this session), a threefold understatement. This is not a new finding: `docs/sessions/memo-audit-code-catalogue-b_r1_2026-09-24.md`, written two days before this audit's HEAD, independently caught the same drift at 6,206 lines and flagged `PRODUCT.md` as stale. The most current and reliable architectural documents in the whole repository are not the ones `docs/memory/README.md`'s own read order names for architecture (`PRODUCT.md`); they are the two 2026-09-24 code-catalogue memos, which read the tree directly rather than relying on an older written account of it.

## Task 2: draft codemap

Built directly from the tree: every package (`@ilya/phonology`, `@ilya/dictionary`, `@ilya/blurb`, `@ilya/score-parser`), every directory under `apps/web/src/lib` and `apps/web/src/routes` including `lib/shane` and its four subdirectories (`engine/`, `reconciliation/`, `pacifier/`, `ingestion/`). No package imports from `apps/` (confirmed by grep and by dependency-cruiser). The one clear "god file" is `apps/web/src/routes/+page.svelte` at 6,225 lines, importing across nearly every other area; a size ratchet on it would have caught the drift task 1 found. `apps/web/src/lib/` (top level) and `apps/web/src/lib/shane/` import from each other in both directions, so "Fit's code is at `shane/`" is a location claim, not a one-way dependency boundary. `library/driver.ts` and `library/library.ts` form a confirmed circular dependency.

## Task 3: invariant candidates

Extracted 15 architectural rules from `CONTRACT.md`, `PRODUCT.md`, and `AGENTS.md` (copy/process/taste rules excluded). Most are mechanically enforceable in principle (fixed-vowel-set tests, a package-boundary dependency-cruiser rule, canary import tests for `analyzePerVerse`, a file-size ratchet on `+page.svelte`) but this session found **no evidence any of them are currently enforced by a test, lint, or CI gate** beyond the package-boundary rule, which holds today only by convention. The clearest concrete case of a stated architectural constraint with no enforcement, now violated, is rule 13: the save-socket design's explicit "`+page.svelte` must shrink or hold, never grow" (2026-08-16, when the file was 2,095 lines), against today's 6,225.

## Task 4: tool trials

**(a) dependency-cruiser 18.4.0** parses the repo's TypeScript layer fine (272 modules across `apps/web/src` and `packages/*/src`) but **does not parse `.svelte` files at all**, in any Svelte version, contrary to what its FAQ's Svelte-4-only caveat implies: 43 `.svelte` files exist in the tree and zero appear as modules in the run. This makes it blind to the entire component layer's import graph. Found: 2 circular-dependency pairs (`library/driver.ts` ↔ `library/library.ts`; `score-parser/phonation.ts` ↔ `score-parser/tempo-seam.ts`), 5 orphans (two of which, `gloss-resolve.ts` and `wall.ts`, are plausible false positives caused by the `.svelte`-blindness above), 65 unresolved `$lib/...` alias imports (a config gap in this trial, not fixed this session), and zero packages importing from `apps/`.

**(b) knip 6.38.0** is genuinely Svelte-aware (it correctly flagged one real dead `.svelte` file) and reported zero unused/unlisted dependencies. Its file-level "28 unused files" count is inflated: 21 of those are `tools/`/`scripts/` files this session's config never declared as their own workspace, so they read as unreachable by construction rather than by evidence; a corrected config would likely shrink real findings to about 13. `analyzePerVerse`, which the project forbids deleting, was not flagged by either tool as unused or dead. Working configs for both tools are saved in this output directory.

## What I could not establish

- Whether the phonology package's determinism (the project's central "not AI" claim) has any dedicated test; not verified because `packages/phonology/src/engine.ts` (2,276 lines) was not read line-by-line.
- Whether `apps/web/src/lib/shane/reconciliation/` or `VocalLineEvent` (both under an explicit "do not touch" rule) were changed or rebuilt at any point; the type was not located by name in this session's scan.
- The true magnitude of dependency-cruiser's orphan/unresolved-import findings once `.svelte` parsing and the `$lib` alias are both fixed; this session did not iterate on the config beyond the FAQ question asked.
- Whether `packages/score-parser`'s several confirmed-unwired exports (`foldDictionMarks`, `renderer-output.ts`, `optimalRegion`) are dead code or mid-flight features; `memo-audit-code-catalogue-b_r1_2026-09-24.md` frames at least one (`foldDictionMarks`) as a deliberate, ruled, two-step rollout still on its first step, not a defect.
- Whether any CI workflow (`.github/`, seen to exist but not opened this session) already runs any of the invariant checks named in `invariants.md`.

## Surprises

- The single largest, most confidently stated architectural fact in the project's own memory file (`PRODUCT.md`'s route-file line count) was wrong by a factor of three, and the project's own audit process had already caught this two days before HEAD without anyone updating the source document. The doc-drift problem CONTRACT.md's tether 17 warns about repeatedly, in prose, is directly visible in the numbers here.
- dependency-cruiser's Svelte gap is more severe than its own FAQ suggests: this is not "Svelte 4 support is imperfect," it is "zero `.svelte` files are ever treated as source modules," in the current Svelte 5 tree.
- knip, despite needing no SvelteKit-specific config beyond a `svelte.config.js` it politely worked around, independently corroborated a dead-code finding (`TextualWitnesses.svelte`) that a previous human/agent audit had already made by hand two days earlier, from a completely different method (static export analysis vs. whole-tree grep). Two independent methods agreeing is the strongest single-file finding in this whole trial.
- `analyzePerVerse`, the one function under an explicit standing deletion prohibition, is also the one function flagged by the *other* audit method (the 2026-09-24 code catalogue's text grep) as a suspected orphan. Neither this session's tools nor that memo could fully resolve whether it has a live caller; this is worth a dedicated look before any future cleanup pass touches it, given the standing rule against deleting it.

## `git status --porcelain`, confirmed clean at close

```
(no output)
```

HEAD unchanged at `b7c2fc6924df85bc465040d2613c307f701ad4d7` throughout. Only read-only git commands were run this session (`status`, `rev-parse`, `branch --show-current`).
