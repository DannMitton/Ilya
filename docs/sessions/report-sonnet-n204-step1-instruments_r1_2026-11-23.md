# Report: N.204 step 1, the instruments (Sonnet)

Read-only analysis of the tree at base commit `b2869772`, unpacked from `n204-step1-source.tgz` into `/tmp/src` (1,200 files). Tools installed into my own container from npm: madge 8.0.0, dependency-cruiser 18.9.0, knip 6.48.0, on node 22.23.5. Nothing in the tree was executed. No `.bak` file was created. The tree itself holds one file with `.bak` in its name, a fixture under `score/ingestion/fixtures/` that arrived in the tarball.

## The five deliverables

| # | Deliverable | Status | One line |
|---|---|---|---|
| 1 | Frozen area map | ESTABLISHED, with open desk choices | 1,098 of 1,200 files placed to one of sixteen areas; 102 listed as unplaced with reasons. Six unit splits are my DESK DEFAULTS (section 1). |
| 2 | Graph trial and test of trust | PARTIAL | Both tools run and reach 1,031 of 1,031 source files. dependency-cruiser agrees with a text scan on 2,949 of 2,958 edges but drops every type-only import in a `.svelte` file. madge reads no `.svelte` file's imports at all. Neither is trustworthy as shipped. |
| 3 | Keep-list | PARTIAL | Twelve kinds with paths. `static/` is not in the tarball, so the `sw.js` precache list and the targets of every URL-fetched asset are NOT ESTABLISHED. |
| 4 | Does `knip` run here | ESTABLISHED: yes-with-caveats | Runs in about 2 seconds without an install, only with the config-loading plugins off and `$lib` supplied by hand. Its result is wrong without both. |
| 5 | Commit-log measure | ESTABLISHED as a number; what it means is NOT ESTABLISHED | 837 commits, mean 2.79 areas, median 2. The mean falls to 2.38 if tests stay with their unit. |

## 1. The frozen area map

**Files.** `/mnt/user-data/outputs/n204-area-map_b2869772_r1.json` (the map) and `/mnt/user-data/outputs/n204-area-map_r1_2026-11-23.py` (the script). The JSON holds `map` (path to area), `rules` (the rule that placed each path), `unplaced_files` (path to reason), and `ambiguous_placements`. The script reads file names only, in standard library Python, and places each path by its path alone, so the same rules place a path that appears in the git log but is gone from the tree.

```
cd /tmp
python3 -I /mnt/user-data/outputs/n204-area-map_r1_2026-11-23.py map TREE_DIR OUT.json
```

**Result.** Files per area, tests in `t`:

| a | b | c | d | e | f | g | h | i | j | k | l | m | n | o | t |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 23 | 28 | 18 | 5 | 24 | 67 | 24 | 32 | 54 | 29 | 48 | 55 | 45 | 55 | 15 | 576 |

**Check against the three filed reads (ran).** Unit g: 24 non-test files plus 9 tests in `Drawer/` is the 33 files the read reports. Unit h: 32 plus the 17 tests in `Paper/`, `Welcome/`, `Field/`, and the loose files is 49, the read's number. Unit d: 5 of 5. The plan's unit sizes are therefore non-test source; the filed reads counted each unit's colocated tests as well.

**Decisions I made, all reversible, each in one line of the script.**

1. **DESK DEFAULT: every test file, fixture, approved file, and e2e file is `t`.** This reads "t for the tests" literally and matches the plan's size of about 1.1M for `t` (the tree holds 4.2 MB across 503 `*.test.ts` files). The filed reads for g and h counted colocated tests inside their own units. If the desk wants that grain, `--tests unit` re-runs the map, and the commit measure below is reported both ways.
2. **DESK DEFAULT: four non-test files that only tests reference go to `t`** (`syntactic-break.support.ts`, `score/row108.support.ts`, `score/phrase-ends.today.json`, `melody/strophic-byte-baseline.json`). Evidence: a grep of each basename found only test files referencing it. Other modules referenced only by tests stay in their unit (section 3, kind 11).
3. **DESK DEFAULT: the b and c split of `packages/score-parser/src`.** The plan says "parsers and analysis" and "renderer and layout" without a file list. I placed by name: 28 files in `b`, 18 in `c`, lists `B_FILES` and `C_FILES`. Ten placements are judgement calls, listed under `ambiguous_placements` (for example `clef-select.ts`, `tacet-run.ts`, `tempo-seam.ts`). Sizes: `b` is 422 KB and `c` is 341 KB against the plan's 112k and about 110k.
4. **DESK DEFAULT: the e and f split of `lib/score/`.** `e` is every file whose name starts with `loupe` or `correction` (24 files, 436 KB); `f` is the rest (67 files, 540 KB). The plan gives about 140k to each, so `e` is the light side. Pattern `E_PATTERN`.
5. **DESK DEFAULT: `i` is `voice/engine/` and `voice/chart/`; `j` is the rest of `voice/`.** `n` is `reader/` plus the top-level `lib/*.ts`. `l` is `insights/`, `analysis/`, `melody/`, `tempo/`. `m` is `library/` and `text/`. `h` is `Paper/`, `Welcome/`, `Field/`, and the files loose in `components/`. `o` is `scripts/` plus `apps/web/scripts/`.
6. **The map does not match the plan's sizes for three units.** `n` is 236k tokens at four characters a token against the plan's 140k; `k` is 174k against 113k; `o` is 36k against 107k. The last is explained below. These are my arithmetic, not a measured token count.

**Unplaced (102 files), reasons.** Full list in `unplaced_files`.

- **`components/Reading/`, 66 files: no unit names it.** `CursiveGlyph.svelte`, `GuideContent.svelte`, `GuideSources.svelte`, `LearnContent.svelte`, and 62 SVGs. Unit h's read notes it as a further 585,156 bytes "structure only". This is a hole in the plan's unit table, not in my rule, and it matters: `LearnContent.svelte` is on the plan's hotspot list. The desk must give it a unit. Its three tests are in `t`.
- **`tools/` is not in the tarball.** The plan's phase 0 counts 53 files under `tools`, and unit o is "`tools/`, `scripts/`". Only `scripts/` and `apps/web/scripts/` were staged, so `o` covers the smaller half.
- **`apps/web/static/` is not in the tarball either**, although the git log shows 75 distinct tracked paths there since 2026-08-01 (fonts, `sw.js`, `manifest.webmanifest`, 10 `sagittal/*.png`).
- Build and package config (17 files), `src/app.css`, `app.d.ts`, `app.html`, `omr-metre/` model reference data (2), `.DS_Store` and `.tsbuildinfo` files (11), two `.env` files (named, never opened), `test-results/`, and two empty Finder duplicates (`lib 2`, `fixtures 2`).

**Not placed by rule, found in the log.** `lib/shane/` (97 distinct file touches resolved by name, others not) became `lib/score/` and others on 2026-09-27 (commit `7f5b8e8`, "N.174 D.2.6"). `lib/markup/` became `lib/melody/` on 2026-11-23. The map is of the base tree, so a historic path is placed by section 5's rule, not by this one. The 63 Cyrillic SVG names caused no failure in either tool or in my script; the tarball holds 62 SVGs in `Reading/cursive/`, not 63. I did not find the missing one.

## 2. The graph trial and the test of trust

### What ran

Both tools needed `$lib` and `@ilya/*` supplied by hand: `apps/web/.svelte-kit/tsconfig.json` (where `$lib` comes from) is not in the tarball and there is no `node_modules`, so workspace packages do not resolve. I wrote a `tsconfig.paths.json` mapping `$lib`, `$lib/*`, and the four `@ilya/*` packages to their `src/index.ts`. The kit is in `/mnt/user-data/outputs/n204-graph-trial-kit_r1_2026-11-23.tgz` (configs and the comparison scripts; paths inside are absolute to my container).

| | madge 8.0.0 | dependency-cruiser 18.9.0 |
|---|---|---|
| Runs at all | Yes, 7 seconds | Yes, 6 seconds |
| Source files reached (of 1,031 `.ts`, `.svelte`, `.js`, `.mjs`) | 1,031 | 1,031 |
| Resolves `$lib` and `@ilya/*` | Yes in `.ts` files, with my tsconfig | Yes, with my tsconfig |
| Reads imports inside `.svelte` | **No.** All 92 `.svelte` files appear as nodes with zero edges | Yes, by compiling them |
| Internal edges | 2,417 | 2,958 |
| `new Worker(new URL(...))`, `import.meta.glob`, `?raw` | Not followed | Not followed |
| Cyrillic file names | No error | No error |

Edges from `.svelte` files are 664 of the 3,081 edges my text scan found, 21.6 percent of the graph. madge has none of them. Unresolved in dependency-cruiser: external packages (not installed), `$app/*`, and one relative path into the absent `tools/` folder. All `$lib` and `@ilya` specifiers resolved.

### The comparator, and its limit

The tools were compared with (a) a text scan I wrote (`edges.py` in the kit: regex over `import`, `export from`, and `import('...')` with a string, script blocks only for `.svelte`) and (b) 37 relationship claims taken by hand from the hidden-relationship lists of the three filed reads. The text scan is my instrument, not a ground truth; it agrees with dependency-cruiser on 2,949 edges, and every disagreement was classified by hand below. Where I say "invented" I mean an edge a tool reports that my scan and a read of the file do not support.

### Test one: edges, over the files of units d, g, and h (ran)

Unit membership is by folder, tests included, as the reads counted. Edges are those whose source file is in the unit.

| Unit | Text edges | dependency-cruiser agrees | Missed by dependency-cruiser | madge agrees | Missed by madge | Invented (either tool) |
|---|---|---|---|---|---|---|
| d (5 files) | 129 | 126 | 3 | 1 | 128 | 0 |
| g (33 files) | 111 | 93 | 18 | 26 | 85 | 0 |
| h (49 files) | 153 | 112 | 41 | 38 | 115 | 0 |

- **Every one of the 62 edges dependency-cruiser missed is a type-only import in a `.svelte` file** (`import type {...}`), checked statement by statement. Svelte's compiler erases them before dependency-cruiser sees them. Whole tree: 131 of 132 misses are the same cause; the remaining one is an inline `import('$lib/...')` in a type position. The loss is 2 percent of unit d's edges, 16 percent of g's, and 27 percent of h's.
- **Every miss by madge is an edge from a `.svelte` file.** No `.ts`-sourced edge in d, g, or h was missed by either tool.
- **Dependency-cruiser found two edges my script scan missed**: `+page.svelte` to `Reading/LearnContent.svelte` and `GuideContent.svelte`, written as `{#await import('$lib/...')}` in the markup, which only a whole-file read sees. Across the whole tree it also found seven edges from `e2e*/` tests to `lib` files through string paths like `'/src/lib/voice/engine/fry-synth.ts'` inside `page.evaluate`. These are real runtime relationships; my scan missed them and knip reports them unresolved.
- **Invented edges: none in d, g, or h.** Whole tree: madge one (`reader/mscz-converter.ts` to `vendor/webmscore.d.ts`; the specifier `./vendor/webmscore` also names a `.js`, so this is a resolution choice, not an invention).

### Test two: the filed reads' recorded relationships (read, then looked up)

I took 37 file-pair claims from the three reads' hidden-relationship lists and findings (d section 3 and D1, g section 3, h section 3). Fourteen imply an import edge; twenty-three say the files are coupled in a way no import carries. The pairs are in `claims.py` in the kit.

| | Claims | text scan | dependency-cruiser | madge |
|---|---|---|---|---|
| An import edge is implied (for example `IntakePanel` and `IntakeViews` to `IntakeCamera`; `+page.svelte` to `Drawer.svelte`, `poem-offer.svelte.ts`, `witness-lines.ts`, `library/document.svelte.ts`) | 14 | 14 | 13 | 0 |
| The read says the coupling is not an import (class names, repeated constants, breakpoints, source-text pins by tests, string shapes) | 23 | 3 edges exist | 3 | 2 |

- The one edge-implied claim dependency-cruiser misses is `Paper/BlankState.svelte` to `page-config.ts`, a type-only import (read 3.7, `BLANK_ANCHOR`).
- **Twenty of the twenty-three hidden relationships have no edge in any tool's output.** That is by construction: a graph cannot show that `Drawer.svelte` styles `.station` markup written by `SongList.svelte`, that `layout.ts` copies three numbers it "cannot import", or that `blank-states.test.ts` pins five files by their text. The other three have an edge for an unrelated reason: `bandState.ts` imports `i18n.ts`, `scan-banner.test.ts` also renders `ScanBanner`, `InsightsPane.svelte` imports `BlankState.svelte`. The edge there says the files meet; it does not say how they are coupled.
- Of the 44 numbered hidden relationships in the three reads (d 10, g 16, h 18), I did not look up the ones internal to one file. I looked up only the 37 pairs I could name from the text.

### Known blind spots, filed beside the result

**The tests that read source as text.** My count: **155** test files mention `readFileSync` or `readFile`; the plan says 142 at `6c0bb4fc`. I cannot reconcile the two from here and do not know the plan's pattern. 97 of the 155 name a resolvable file in a string literal. That gives **149 (test, source file) pairs**. **108 of the 149 have no edge in madge or in my text scan, and 106 have none in dependency-cruiser**; the rest have an edge only because the test also imports the file. A rename of any of the 108 breaks a test the graph never connected. This is a regex estimate (`hidden_reads.py`); a path built by `join` from several pieces is missed.

**The keep-list of section 3.** Every entry in it is invisible to import edges by definition. In particular, the three workers show a graph edge only through `import type` from the client file (`metre-client.ts:11`, `underlay-client.ts:15`, `score-reader.ts:29`), so the graph connects them for the wrong reason and a layering rule counts them as type coupling.

### Is there a trustworthy graph?

No tool, as shipped. The nearest is dependency-cruiser with my path config, and it is trustworthy for value imports, not for type imports from `.svelte` files, which it drops silently (up to 27 percent of unit h's edges). madge is not usable on this project for any figure that includes components, because it has no edges from `.svelte` files. Nothing here establishes that dependency-cruiser's edge set, patched for the type-only case, is trustworthy over all 1,031 files; I tested three units and the whole-tree agreement with my own scan. The plan's rule for an untrusted graph applies in full if the desk judges that the type-only loss is disqualifying; whether the loss disqualifies is the desk's call, not mine. A modularity figure also needs the edge, file, and density counts beside it, which I did not compute.

## 3. The keep-list

Paths that no import shows, or shows only for the wrong reason. Each kind says how I found it. "In tarball" means I read or grepped the file.

1. **URL switches.** Files whose live branches depend on a query value: `voice/chart/measure-switch.ts` (`?measure`), `voice/chart/stub-switch.ts` (`?capture=stub`, development only), `voice/engine/capture-file.ts` (`?harness=1`, `?sung`, `?measure`), `omr/band-strip.ts` (`?strips=measure`), `omr/underlay-switch.ts` (`?looks`, `?extender`). Found by grep for `URLSearchParams` and `location.search`. These files have importers; the switch values and the code they gate are what a tool cannot see. Also `location.hash` in `routes/+page.svelte:3586` and `guide-anchors.ts`.
2. **`__ILYA_RECORDER__` and its sibling `__ILYA_BUILD__`.** Defined in `apps/web/vite.config.ts` (`define`), declared in `src/app.d.ts`, described in `apps/web/build-id.js`. Used in `voice/engine/capture-file.ts`, `voice/engine/live.ts`, `voice/chart/stub-switch.ts`; `capture-file.test.ts` pins that every use sits behind `__ILYA_RECORDER__ &&`. `__ILYA_BUILD__` is read in `lib/version.ts`. In a production build the flag is false and the guarded code is removed by the bundler, so a dead-code tool sees live imports of code the shipped build never runs.
3. **Workers started by URL.** `reader/score-reader.worker.ts` (spawned at `reader/score-reader.ts:125`), `omr/metre.worker.ts` (`omr/metre-client.ts:23`), `omr/underlay.worker.ts` (`omr/underlay-client.ts:23`). Each is `new Worker(new URL('./x.worker.ts', import.meta.url))`. Knip, as run, listed `reader/score-reader.worker.ts` and `score-reader.ts` as unused files in its first run (section 4).
4. **Assets and scripts reached by URL or by build step.** `apps/web/scripts/copy-*.mjs`, `fetch-omr-models.mjs`, `stamp-sw.mjs` (no importer; named in `apps/web/package.json` scripts); `apps/web/omr-metre/metre-a-r6-ref.{cls,f16}` (read by `copy-metre-model.mjs`); `apps/web/omr-underlay/` (empty in the tarball; `copy-underlay-model.mjs` expects `rus_prereform_r2_29000.traineddata`). These write into `static/` (`omr/models/`, `omr/ort/`, `pdfjs-wasm/`, `heif/`). `?url` imports: `pdfjs-dist/build/pdf.worker.mjs?url` (`reader/page-pdf.ts:155,278`) and three `webmscore/*?url` in `reader/vendor/webmscore.js`. URL roots written in source (non-test) and not resolvable here because `static/` is absent: `/data/${glossFiles[i]}` (`loader.ts:564`), `/fonts/finale-maestro/FinaleMaestro.otf` (`Welcome/WelcomePlate.svelte:78`), about 30 `/guide/guide-step-NN.webp` in `Reading/GuideContent.svelte`, `/fonts/*`, `/mpe/`, `/assets/`.
5. **Glob reads.** `voice/chart/SagittalDrawing.svelte:22` reads `./sagittal/*.svg` (10 files in `voice/chart/sagittal/`); `Reading/CursiveGlyph.svelte:14` reads `./cursive/*.svg` (62 files, Cyrillic names). No tool made an edge to any SVG.
6. **Dynamic imports with a string specifier.** `reader/page-image.ts:111` (`./heic-decode`), `reader/mscz-converter.ts:98` (`./vendor/webmscore`), `omr/tuplet-digits.ts:237` (`./tuplet-digit-templates.json`), `omr/underlay-client.ts:67` (`../underlay-seams`), `omr/homr-reader.ts:447-459` (`homr-web`, `metre-client`, `underlay-client`), `omr/scan.ts:35,43`, `omr/band-strip.ts:57,60`, `score/ScoreUploader.svelte:287,321,370`, `score/ingestion/first-staved-page.ts:101`, and in markup `routes/+page.svelte:4413,4418` (`LearnContent`, `GuideContent`). Dependency-cruiser and my scan resolve the TypeScript ones; only dependency-cruiser sees the two in markup. A tool that skips dynamic imports would call all of these unused. No import with a non-literal specifier exists outside vendored code (grep).
7. **`static/sw.js` and its precache list: NOT ESTABLISHED.** `static/` is not in the tarball. What I can name: `apps/web/scripts/stamp-sw.mjs` replaces `__BUILD_VERSION__` and `/*__HEIF_CHUNKS__*/` in the built `sw.js` and fails the build if either is missing; `src/lib/sw-shell.test.ts` reads `static/sw.js` as text; the git log shows `apps/web/static/sw.js` changed in 4 commits and `manifest.webmanifest` in 2. The precache contents themselves I have not seen.
8. **Old-shape readers.** `score/old-reader-seats.ts` (files seats stored under the old reader's `r{measure}-{x}` note names; header read), `library/migration.ts` (moves six per-song `localStorage` keys into the vault; header read), `library/document.svelte.ts` (`LEGACY_SONG_ID`, `readLegacySync`; grep). A further 18 files match "legacy", "old shape", or "migrat" by grep and I did not read them (`voice/profileStore.ts`, `Drawer/sections.svelte.ts`, `library/driver.ts`, `loader.ts`, `i18n.ts`, and others); treat that tail as unconfirmed.
9. **`routes/notation-font-lab/+page.svelte`.** No file imports it; the only mention in the tree is a comment at `score/notation-fonts.ts:7`. Reached only by typing its address.
10. **SvelteKit convention files and tool configs.** `routes/+layout.svelte`, `+layout.ts`, `+page.ts`, `+page.svelte`; `apps/web/vite.config.ts`, `svelte.config.js` (imported only by a test), `playwright.config.ts`, `build-id.js`; `scripts/ratchets.mjs` (run by `pnpm ratchets`, reads `scripts/ratchets.json`), `scripts/build-*.mjs`. Three scripts have no reference anywhere in the tree: `scripts/frwikt-enrich-transform.mjs`, `scripts/stage7b-french-coverage-check.mjs`, `scripts/tier2-transform.mjs`. They look like one-off tools; whether any is still run by hand is NOT ESTABLISHED.
11. **Modules only tests import** (graph result, 11 non-test files): `analysis/adapter-grid.ts`, `analysis/analyze-per-verse.ts`, `insights/cycle-dose.ts`, `names.ts`, `reader/zip-fixture.ts`, `score/offers-for-a-bar.ts`, `score/reconciliation/witnesses.ts`, `score/row108.support.ts`, `syntactic-break.support.ts`, `voice/engine/fry-synth.ts`, and `svelte.config.js`. A dead-code tool that counts tests as entry points calls them used; one that does not calls them unused. `names.ts` has hundreds of textual mentions of its name in other files, so I do not trust the graph's "only tests import it" for that one without a check.
12. **Further kinds I found.**
    - **Ambient type files:** `app.d.ts`, `reader/libheif-js.d.ts`, `reader/vendor/webmscore.d.ts` (knip flagged the last as an unused file).
    - **Files read by tests as data:** `approval/__approved__/*`, `packages/score-parser/src/approval/__approved__/*`, `analysis/__golden__/adapter-snapshots.json`, the `fixtures/` folders, `reader/fixtures/*.heic`. All sit in `t`.
    - **Strings that act as keys:** keys in `i18n.ts` looked up by string, CSS class names styled across files (`.station`, g section 3), `data-*` attributes queried by selector. A dead key or dead selector is invisible to every tool here.
    - **Browser-side imports in e2e tests:** seven tests import `/src/lib/...` paths inside `page.evaluate`.
    - **`webmscore` is listed as an unused dependency by knip** while `reader/vendor/webmscore.js` loads its `.wasm` and `.data` by `?url` import.

**Two components no tool connects, which are candidates for dead code rather than keep-list entries:** `insights/FitTable.svelte` and `insights/Tessituragram.svelte` have no importer in the dependency-cruiser edges, my text scan, or knip (with `.svelte` parsing on). `i18n.ts:105` names `FitTable.svelte` in a comment. Whether either is live through some route I have not found is NOT ESTABLISHED.

## 4. Does knip run here?

**Yes, with caveats.** It runs in about 2 seconds against the unpacked tree with no install, but only after I switched off every plugin that loads a config from the tree and supplied `$lib` by hand. Its default behaviour on this tree executes `vite.config.ts` and `svelte.config.js` (which imports `build-id.js`), so I did not run it that way: the brief says the tree is data. Knip's behaviour with the tree's own config and a real install is therefore NOT ESTABLISHED.

Command, run from `/tmp/work` with the kit's configs:

```
export PATH=/tmp/tools/npm/node_modules/.bin:$PATH
cd /tmp/work
knip --directory /tmp/src --config /tmp/work/knip3.json --no-progress
```

`knip3.json` sets `vite`, `vitest`, `sveltekit`, `playwright`, and `typescript` plugins to false; keeps the `svelte` plugin on with a config path that does not exist (so the compiler parses `.svelte` and no tree code is loaded); sets `paths` for `$lib`; and names entries by hand.

What each step cost, in the order I ran them:

| Run | Unused files | Unresolved imports | What was wrong |
|---|---|---|---|
| Plugins off, no `$lib` path | 18 | 539 (530 are `$lib`) | `$lib` comes from the absent `.svelte-kit/tsconfig.json`; most "unused" files are only imported through `$lib` |
| Plus `$lib` path | 9 | 9 | 8 of the 9 are imported only by `.svelte` files, which knip was not parsing |
| Plus `.svelte` parsing | **3** | 11 | `FitTable.svelte`, `Tessituragram.svelte` (both agree with the graph), and `webmscore.d.ts` (ambient types for a vendored file) |

The final run also reports 224 unused exports, 100 unused types, 5 unused devDependencies, 1 unused dependency (`webmscore`), and 10 unlisted binaries (`vite`, `vitest`, `playwright`, `svelte-kit`, `svelte-check`; noise from the missing install). Unresolved: seven e2e `/src/lib/...` strings, three `$app/*` virtual modules, and `tools/n200-score/burg-fixtures`. **I did not verify the exports result.** A name search found no reference to the symbol outside its own file for 240 of the 324 export and type findings, and a textual hit elsewhere for 84 (73 in non-test files); a textual hit is not proof that the export is used, so the 84 are unresolved either way. The plan's fallback for knip stays in force for the export count.

## 5. The first commit-log measure, at the frozen grain

**Source.** `n204-step1-gitlog.txt`, 6,919 lines, 904 commits from 2026-08-02 to 2026-11-23. 37 commits list no files (merges, presumably; not checked). The script's `commits` command produced `/mnt/user-data/outputs/n204-commit-measure_r1.json`.

```
cd /tmp
python3 -I /mnt/user-data/outputs/n204-area-map_r1_2026-11-23.py commits GITLOG.txt TREE_DIR --json OUT.json
```

**How a path is placed.** The unit is the frozen area. Git quotes non-ASCII paths, so the script decodes the Cyrillic names first. Order: a test is `t`; a path in the base tree uses its own placement; a path absent from the base tree takes the area of the one base-tree file with the same name, if exactly one exists; otherwise the path rules are tried on the old path. Of 5,148 (commit, file) touches: 2,842 in the base tree, 1,660 tests, 392 placed by unique name, 64 by rule on the old path, 190 unplaced. The 392 are the reorganisations of 2026-09-27 and 2026-11-23, and a name match can be wrong; I did not sample them.

**Primary result.** Tests in `t`, unplaced files ignored. 837 commits measured (30 more touched only unplaced files).

| Areas touched | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|
| Commits | 180 | 254 | 169 | 128 | 49 | 36 | 7 | 9 | 3 | 2 |

Mean **2.79**, median 2, 75th percentile 4, 90th 5, 95th 6, maximum 11. For contrast at the file grain over the same commits: mean 6.1 files, median 4, maximum 87.

**Variants, each with its own commit count.**

| Variant | Commits | Mean | Median | 90th | Max |
|---|---|---|---|---|---|
| Primary | 837 | 2.79 | 2 | 5 | 11 |
| Unplaced files counted as one extra area | 867 | 2.90 | 3 | 5 | 12 |
| **Tests kept with their unit, not in `t`** | 830 | **2.38** | 2 | 5 | 11 |
| Commits of 30 or more files removed (14 removed) | 824 | 2.73 | 2 | 5 | 11 |

No commit has 100 or more files; the largest has 87.

**What the history supports and what it does not.**

- It supports computing the number. The log is complete for the three paths and the unit is fixed.
- **The test grain moves the answer by 0.4.** A commit that changes a module and its test touches two areas by construction when tests are `t`. The plan must pick the grain before step 9 and keep it.
- **`t` is one area of 576 files** while `d` is 5 files. Areas are not comparable in size, so a mean over areas does not mean a mean over equal parts.
- No rename detection was in the log, and about a tenth of the touches predate two folder moves. Pre-move commits were resolved heuristically.
- Whether this number measures coupling or how the lanes batch their commits is NOT ESTABLISHED. The plan's own note says the research read only the source's abstract. I have not read it.

## What I could not establish

1. **The `sw.js` precache list, and every asset reached by URL.** `apps/web/static/` is not in the tarball. The brief names three paths; `static/` sits under `apps/`, so the tarball was cut narrower than "apps".
2. **Whether `tools/` exists in the tree.** Unit o and the plan's phase 0 name it; it is not in the staged source.
3. **Knip with the project's own config and a real install.** Not run, to avoid executing tree code.
4. **Whether dependency-cruiser patched for type-only `.svelte` imports is trustworthy over the whole tree.** I tested three units and the whole-tree agreement with my own scan; I did not build the patch.
5. **The plan's count of 142 source-reading tests.** I count 155 mentions and 97 with a resolvable source path.
6. **The 63rd cursive SVG.** I found 62.
7. **The 18 unread "legacy" and "migrat" grep matches** in keep-list kind 8.
8. **Whether the 11 test-only modules, the three scripts with no reference, `FitTable.svelte`, and `Tessituragram.svelte` are dead.** I report what the instruments show.
9. **Edge, file, and density counts for a modularity figure.** Not computed; the plan asks for them beside any such figure.
10. **Token spend.** I cannot read my own counter. My estimate from the length of this session is about 200,000 tokens, under the 300,000 cap. That figure is an estimate.

## Files written

- `/mnt/user-data/outputs/report-sonnet-n204-step1-instruments_r1_2026-11-23.md` (this report)
- `/mnt/user-data/outputs/n204-area-map_b2869772_r1.json`
- `/mnt/user-data/outputs/n204-area-map_r1_2026-11-23.py`
- `/mnt/user-data/outputs/n204-commit-measure_r1.json`
- `/mnt/user-data/outputs/n204-graph-trial-kit_r1_2026-11-23.tgz`
