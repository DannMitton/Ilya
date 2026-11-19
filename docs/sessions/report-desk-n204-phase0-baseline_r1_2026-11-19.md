# N.204 phase 0: the measured map, and the build's determinism

Measured by the desk (Opus 5), 2026-11-19 15:1x, in its own cloud container on a shallow clone of `Shane` `6c0bb4fc`. Node 22.23.5, pnpm 10.28.0. **numpy 2.5.3 and scipy 1.18.1 are present in this container**, so gate 4 here takes the Mac's baseline and not the Code sandbox's. Every figure below is from a command run in this session.

## 1. The tree, outside tests and docs

134,671 lines in 552 files: `apps/web/src/lib` 95,493 in 423; `packages/score-parser/src` 16,993 in 47; `tools` 9,442 in 53; `apps/web/src/routes` 5,775 in 5; `packages/phonology/src` 3,188 in 12; `packages/dictionary/src` 1,422 in 7; `packages/blurb/src` 1,021 in 4; `scripts` 1,337 in 1.

## 2. Comments, against Dann's test of 2026-11-19 15:00

**34,439 comment lines, one for every 3.9 lines of code.** Within them: **127 cite a line number**, which `../house-style/code-conventions.md` section 5 forbids, and which has grown from the 106 counted when he ratified that convention on 2026-11-01; **1,180 name an N. item**; **9 carry a prototype version tag**. **Zero TODO, FIXME, XXX, or HACK markers in the whole tree.**

**142 test files read source as text** (`readFileSync` or `readFile`), so a rename can break a test that never imports the renamed thing.

## 3. The hotspot ranking, churn since 2026-08-01 times current size

| file | lines | commits |
|---|---|---|
| `apps/web/src/routes/+page.svelte` | 5,532 | 212 |
| `apps/web/src/lib/i18n.ts` | 2,725 | 213 |
| `apps/web/src/lib/components/Drawer/Drawer.svelte` | 1,986 | 53 |
| `apps/web/src/lib/components/Reading/LearnContent.svelte` | 4,097 | 21 |
| `apps/web/src/lib/markup/MarkupPane.svelte` | 1,349 | 47 |
| `apps/web/src/lib/score/Loupe.svelte` | 3,008 | 17 |
| `apps/web/src/lib/components/Drawer/InspectorPanel.svelte` | 2,396 | 18 |
| `apps/web/src/lib/voice/CalibrationWizard.svelte` | 1,124 | 34 |
| `apps/web/src/lib/insights/InsightsPane.svelte` | 677 | 39 |
| `apps/web/src/lib/components/Reading/GuideContent.svelte` | 657 | 39 |

**Consequence for tier 3.** Plan r2 named `+page.svelte`, `Loupe.svelte`, and `InspectorPanel.svelte`. `Drawer.svelte` is edited three times as often as either of the last two and `MarkupPane.svelte` nearly three times. Change concentrates where churn is, so both join tier 3.

## 4. The ceilings are full

Thirteen of the sixteen ratcheted files sit within five lines of their ceiling. **Six are at it exactly:** `engine.ts` 2,048 of 2,048; `Loupe.svelte` 3,008 of 3,008; `MarkupPane.svelte` 1,349 of 1,349; `CorrectionSurface.svelte` 1,227 of 1,227; `InsightsPane.svelte` 677 of 677; `mnx-parser.ts` 1,170 of 1,170. `musicxml-parser.ts` has one line spare, `+page.svelte` two, `LearnContent.svelte` two.

So **no line can be added to the files that matter until a split makes room.** Fable's unit a read found the symptom from the inside: two imports joined onto one line and two statements joined onto one in `engine.ts`, to stay under the number. The GUIDE and LEARN rewrite meets the same wall at `LearnContent.svelte`, two lines from its ceiling.

## 5. The footprint, and it is not the code

Production build at `6c0bb4fc`, `PUBLIC_INCLUDE_MARKUP_INSIGHTS=true`: **458 MB in 218 files**, built in 21.2 s (29 s wall). `static/` is 258 MB.

| folder | size | share |
|---|---|---|
| `build/omr/` (scan-reader models and the ONNX runtime) | 245 MB | 53% |
| `build/data/` (the dictionary, four JSON files) | 167 MB | 36% |
| `build/_app/` (all of Ilya's own code) | 34 MB | 7% |
| fonts, pdfjs-wasm, heif, guide, images, icons | about 9 MB | 2% |

The five largest single files are four ONNX models (56.0, 51.6, 46.2, 28.0 MB) and the dictionary's four shards (47.8, 46.4, 37.1, 36.0 MB).

**What a singer downloads to see the first page: 10 JavaScript modules totalling 73.8 kB, plus a 3.6 kB `index.html`.** That is the whole critical path.

**What this means for Dann's fourth purpose.** "Reduce Ilya's footprint without sacrificing performance" is almost entirely a question about the models and the dictionary, not about the code. Ilya's own code is 7 percent of the build and its first paint costs 77 kB. **NOT ESTABLISHED, and it is the footprint question worth answering:** how much of the 245 MB of models and the 167 MB of dictionary a singer actually fetches, and under which backend. The models ship in full and fp16 variants and the loader chooses; the dictionary is shard
ed in four. Units k (`omr/`) and n (`reader/` and the top-level `lib/*.ts`) read the code that decides it, so the audit answers it rather than guessing now.

## 6. THE BUILD IS NOT BYTE-DETERMINISTIC, and the behaviour baseline cannot be taken until it is

**Measured:** two consecutive `pnpm build` runs on an unchanged tree produced **15 differing files** of the 53 under `build/_app`, `build/sw.js`, and `build/index.html`.

**The mechanism, read and confirmed.** `apps/web/svelte.config.js:18-22` sets `version.pollInterval: 0` and **does not set `version.name`**, so SvelteKit falls back to `Date.now()`. Run 2 wrote `build/_app/version.json` as `{"version":"1795119137727"}`, and that same timestamp is inlined into `build/_app/immutable/chunks/DRnOjjl3.js`. Changing that chunk changes its content hash, which renames it, which rewrites every entry chunk and `index.html` that reference it. `build/sw.js` separately stamps `CACHE_VERSION` with its own build time.

**Why it matters to this audit.** Plan r3's phase 0 requires a behaviour baseline run twice to prove it deterministic, and every lane diffs against it. Against this build, every lane would show 15 differences that mean nothing. **The baseline must normalize `version.json`, `sw.js`'s `CACHE_VERSION`, and the content-hashed file names, or the build must be made deterministic first.**

**CORRECTED 2026-11-19 15:2x, on Dann's question, and the correction shrinks the repair.** There are two version labels in this tree and the desk first wrote as though there were one. (1) `apps/web/src/lib/version.ts:10`, `ILYA_VERSION = '2026b'`: the version a singer reads, in the footer, a binder's manifest, and the citation; its letter advances when `main` moves and at no other time (N.202, ruled by Dann 2026-11-15 13:31; pinned by `version.test.ts:11`). It is not involved here and does not change. (2) SvelteKit's own `version.name`, which no singer sees and which the browser uses to notice a new deploy. **The two cannot be merged:** a deploy happens on every push to `Shane` and the letter advances only at a release, so a browser keyed to the letter would see every push between releases as unchanged, which is exactly the N.72 failure.

**And the commit marker already exists.** `apps/web/vite.config.ts:13-18`, `buildId()`, returns the 8-character commit from `VERCEL_GIT_COMMIT_SHA` or `git rev-parse --short=8 HEAD`, exposed as `__ILYA_BUILD__` and read at `version.ts:16` as `ILYA_BUILD`, where its comment says it is "the commit the bundle was built from", stamped into every recording. **So the repair is not to add a commit marker; it is to point `kit.version.name` at the `buildId()` this tree already computes.**

**The repair, and it keeps N.72 intact.** Set `kit.version.name` from `buildId()`. `build/sw.js`'s own header records why the stamp exists: under N.72 (Dann 2026-08-16) a byte-identical service worker was never installed by the browser, so a tester kept the first version forever. A commit SHA still differs on every real deploy, so N.72's guarantee holds exactly, and two builds of one commit become identical. A singer notices nothing. **This closes `kit.version.name`, which QUEUE row 151 filed as NOT ESTABLISHED and nothing has settled since.**

**Second finding from the same measurement, for a singer rather than a developer:** because the stamp is inlined into a chunk, every deploy renames the entry chunks even when no source line changed, so a returning singer re-downloads them. At 73.8 kB the cost is small, and it is a cost paid for nothing.

## 7. What phase 0 still owes

The import graph and whether `knip` runs here; the keep-list of paths no import shows; the behaviour baseline itself, which needs the determinism question settled first and a Playwright-driven harness that does not yet exist; the performance baseline beyond the build figures above (cold load, time to first drawn page, the reader's wall clock on one fixture scan); and the per-unit Sonnet packets.

## 8. NOT ESTABLISHED

- How much of `build/omr/` and `build/data/` a singer fetches, and under which backend.
- Whether the four dictionary shards are all fetched or chosen between.
- Whether this container's timings are usable as a performance baseline at all, since they are not the Mac's and not a singer's device.
- Whether `knip` runs on this workspace.
- Everything the two completed unit reads filed as NOT ESTABLISHED in their own reports.
