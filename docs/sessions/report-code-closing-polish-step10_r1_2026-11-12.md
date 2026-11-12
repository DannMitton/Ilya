# Report: closing polish lane, step 10, the audit for contributors (L58) (Code, cloud-lane-48, r1, 2026-11-12)

Report only. Nothing was deleted. The tables are the ones the step asks for; the full export table is in `report-code-closing-polish-step10-appendix_r1_2026-11-12.md`. The method is a script of mine (name-based, over `apps/web/src`, the four packages' `src`, `scripts`, `apps/web/scripts`, `tests`, and `apps/web/e2e*`, comments stripped), so every row is a lead for a person to confirm, not a proof.

## 1. Files nothing imports (11 found; 2 are real leads)

| path | line | what it is |
|---|---|---|
| `apps/web/src/lib/insights/FitTable.svelte` | 1 | Real. Nothing imports it (the `i18n.ts` index says so too: "which nothing imports"). Reads `insights.fit.*`. |
| `apps/web/src/lib/insights/Tessituragram.svelte` | 1 | Real lead: no import of it found; `insights.ts`, `tessituragram-layout.ts`, and `i18n.ts` mention the name. |
| `apps/web/src/lib/library/index.ts` | 1 | Probably false: reached by `'$lib/library'`, a directory import my basename test does not resolve. Confirm by hand. |
| `packages/{blurb,dictionary,phonology,score-parser}/src/index.ts` | 1 | False: each package's entry, imported by its package name. |
| `scripts/build-dictionary.ts`, `scripts/build-homographs.mjs`, `scripts/ratchets.mjs`, `scripts/stage7b-french-coverage-check.mjs` | 1 | False: command-line scripts (`pnpm ratchets` runs the third; the others are run by hand). |

SvelteKit route files, `*.test.ts`, `*.worker.ts`, config, and `e2e/` files were not treated as candidates.

## 2. Exported symbols nothing imports (444 found)

Counted as "nothing imports" when no other file, tests included, names the symbol. Of the 444:

- **20 are not used at all, not even in their own file** (listed in full in the appendix, section A). Two are not leads: `ssr` and `prerender` in `routes/+layout.ts:3-4` are SvelteKit conventions SvelteKit reads. The rest to confirm: `ROW_GAP` (`page-config.ts:87`), `stressSourceLabel` (`i18n.ts:2468`), `PAGE_DIMENSIONS` (`types.ts:192`), `VoiceProfile` (`voice/engine/types.ts:98`), `CaptureErrorCode` (`voice/engine/errors.ts:23`), `FixtureMember` (`reader/zip-fixture.ts:21`), `pieceIdFor` (`reader/page-image.ts:39`), `DenigmaErrorCode` and `ResourceErrorCode` (`reader/errors.ts:38`, `:57`), `omrStarted` (`omr/homr-reader.ts:464`), `savePairings` and `loadPairings` (`score/pairings.ts:708`, `:726`), `TUPLET_COUNTS` (`score/entry.ts:321`), `minGapFor` (`score/engraving.ts:48`), `PAGE_ONE_FINDINGS` (`insights/insights.ts:806`), `wordOf` (`insights/text-parts.ts:11`), `CLOSE_VOWELS` (`insights/comments.ts:82`), `TS_SUFFIX_NORMAL` (`packages/phonology/src/lexical-palatalization.ts:175`).
- **424 are used inside their own file only**: the `export` can be dropped. Appendix section B.
- A further **395 exported symbols are named only by test files** (not listed; they are exported for a test to reach, which is a decision for the desk, not a finding).

## 3. Packages in a `package.json` that nothing imports

None found. All dependencies and devDependencies of the root, `apps/web`, and the four packages are named in a source file, a script, a config file, or the CI workflow (matched as a quoted module name or subpath). `@tesseract.js-data/rus` is named by `scripts/copy-underlay-model.mjs` (`require.resolve`), and `homr-web` by a `file:` tarball that the reader imports.

## What I could not establish

- The method is name-based: a symbol that shares a name with an unrelated symbol in another file looks used (false negatives); a symbol reached by a dynamic or barrel import, or a SvelteKit convention, can look unused (false positives, as `ssr` and `prerender`).
- Exports inside `.svelte` files (indented `<script module>` code) were not scanned.
- Whether any listed symbol is part of a public surface the desk wants to keep (the packages' `index.ts` surfaces are guarded by `ratchets`).
