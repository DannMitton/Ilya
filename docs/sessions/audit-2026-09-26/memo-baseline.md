# Phase 0 baseline audit — memo

Repo: `/home/claude/ilya`, branch `Shane`, HEAD `b7c2fc6`. Read-only: no
tracked file was edited, no writing git command was run. Outputs in
`/home/claude/audit/phase0/`: `hotspots.csv`, `page-anatomy.md`,
`e2e-coverage-map.md`, this memo.

## 1. Hotspot table

Method: every non-test `.ts`/`.svelte` file under `packages/*/src` and
`apps/web/src` (194 files, via `find` + exclusion of `.test.`/`.spec.`
and test directories). Lines via `wc -l`. Commits via
`git log --follow --oneline [--since=<6mo>] -- <file>`. Complexity: for
`.ts` files, real cyclomatic complexity via ESLint 8 + `@typescript-eslint`
(rule `complexity: ["error", 1]`, so every function is flagged with its own
number), run from a scratch project in `/tmp/cxwork` against copies of the
repo files (nothing written to the repo). For `.svelte` files: the `<script>`
block extracted by regex and run through the same ESLint complexity rule
(method noted per-row in `hotspots.csv`'s `method` column as
`script-block-eslint-complexity`); I did not use the whitespace/indentation
method, since the script-block extraction let the same real tool run on both
file types. All 194 files parsed cleanly (0 ESLint fatal/parse errors).
Ranked by `commits_6mo × complexity_sum`.

Top 25 (full table, all 194 rows, in `hotspots.csv`):

| Rank | File | Lines | Commits (6mo/all) | Complexity sum/max |
|---|---|---|---|---|
| 1 | `apps/web/src/routes/+page.svelte` | 6225 | 130/209 | 469/37 |
| 2 | `packages/score-parser/src/staff-renderer.ts` | 3534 | 63/63 | 497/244 |
| 3 | `apps/web/src/lib/shane/Loupe.svelte` | 3054 | 52/52 | 381/141 |
| 4 | `apps/web/src/lib/shane/CalibrationWizard.svelte` | 2124 | 38/38 | 120/10 |
| 5 | `apps/web/src/lib/shane/ScoreUploader.svelte` | 1340 | 30/30 | 136/26 |
| 6 | `apps/web/src/lib/shane/pairings.ts` | 1423 | 18/18 | 218/27 |
| 7 | `packages/score-parser/src/musicxml-parser.ts` | 1168 | 11/11 | 331/132 |
| 8 | `apps/web/src/lib/shane/VoiceProfilePane.svelte` | 1490 | 62/62 | 54/10 |
| 9 | `packages/score-parser/src/mnx-parser.ts` | 1170 | 12/12 | 272/133 |
| 10 | `apps/web/src/lib/components/Drawer/InspectorPanel.svelte` | 2432 | 11/40 | 227/23 |
| 11 | `apps/web/src/lib/components/Drawer/Drawer.svelte` | 1990 | 46/87 | 51/11 |
| 12 | `apps/web/src/lib/pipeline.ts` | 1064 | 9/25 | 195/47 |
| 13 | `apps/web/src/lib/shane/loupe.ts` | 905 | 16/16 | 88/14 |
| 14 | `apps/web/src/lib/i18n.ts` | 1739 | 105/130 | 13/10 |
| 15 | `apps/web/src/lib/library/library.ts` | 532 | 11/11 | 103/37 |
| 16 | `apps/web/src/lib/shane/vowel-resolver.ts` | 634 | 13/13 | 79/37 |
| 17 | `apps/web/src/lib/shane/watchlist.ts` | 591 | 9/9 | 102/37 |
| 18 | `apps/web/src/lib/shane/insights.ts` | 777 | 6/6 | 136/19 |
| 19 | `apps/web/src/lib/shane/correction.ts` | 670 | 6/6 | 123/14 |
| 20 | `apps/web/src/lib/shane/InsightsPane.svelte` | 1350 | 11/11 | 63/11 |
| 21 | `apps/web/src/lib/shane/engine/live.ts` | 749 | 5/5 | 123/17 |
| 22 | `packages/score-parser/src/page-layout.ts` | 426 | 15/15 | 41/16 |
| 23 | `apps/web/src/lib/shane/entry.ts` | 602 | 5/5 | 108/13 |
| 24 | `apps/web/src/lib/components/Drawer/IntakePanel.svelte` | 998 | 46/69 | 11/4 |
| 25 | `apps/web/src/lib/library/driver.ts` | 480 | 6/6 | 80/24 |

`+page.svelte` and `staff-renderer.ts` dominate by a wide margin: `+page.svelte`
by raw churn (130 commits in 6 months alone), `staff-renderer.ts` by raw
complexity (a single function with cyclomatic complexity 244).

## 2. End-to-end coverage map

Full detail in `e2e-coverage-map.md`. Summary: `e2e/core-loop.test.ts` has 21
tests, all exercising the Transcription tab's core paste-to-IPA loop, word
selection/Inspector, EN/FR switching, and clitic/notation display.
`e2e-phone/loupe-scan.test.ts` has 3 tests, all on the phone-width Loupe
engraving-tap-target mechanism, driven by uploading one MusicXML fixture.

Coverage against the singer paths enumerated from `+page.svelte` and
`ScoreUploader.svelte`: paste-and-transcribe and EN/FR switching are
covered; MusicXML upload is partly covered (only via the phone loupe test,
not the upload UI itself); MNX, `.mxl`, `.musx`, `.mscz`, PDF and photo
upload, voice calibration, the Fit tab, the Insights tab, Learn, Guide,
print, correcting a word, and library save/reopen are **not covered** by
either test file.

I ran both projects rather than only reading them, working around a real
version mismatch between the environment's preinstalled Chromium (revision
1194 at `/opt/pw-browsers`) and what the repo's `@playwright/test@1.58.2`
requires (revision 1208), via a standalone config outside the repo
(`/tmp/cxwork/pwrun/`) that reuses the installed browser's executable and a
`pnpm dev` server I started on port 5199. No repo file was touched to do this.

- **`chromium` project: 21/21 fail**, and cannot currently pass as written.
  Root cause established from source: the shared `waitForDictionary()`
  helper waits on `.status-ok`, a class deleted from the app at commit
  `5f6a2f3` ("N.108-5"); the test file's last real edit (`0e5ed6e`, "N.73")
  predates that removal. Every test times out 45 seconds into `beforeEach`,
  before any of its own assertions run. The app itself loads fine (confirmed
  via a Playwright page snapshot at timeout showing the full working UI).
- **`phone` project**: test 1 of 3 ran to completion and printed a real
  engraving report showing two genuine rule violations (a 44.00px tap-floor
  measurement right at the 44px floor in measure 10, and a 4.46px
  off-centre caret in measure 17). This is product signal, not infra
  failure. My run was cut off by my own time budget before the pass/fail
  verdict and before tests 2 and 3 ran, so I cannot give a final count for
  this file.

## 3. `+page.svelte` anatomy

Full section map in `page-anatomy.md`. Confirmed: 6,225 lines total,
`<script>` runs lines 1–4370, 77 `import` statements, ~65 top-level `$state`
declarations, ~80 `$derived`/`$derived.by` declarations, and exactly 10
`$effect` blocks (lines 1540, 2017, 2040, 2128, 2410, 2432, 3233, 3565, 4190,
4196). Six of those ten write `$state` fields directly (the Svelte-docs
"escape hatch" pattern), two write a plain non-reactive `let` (log-once
guards for console diagnostics), and one writes only a DOM attribute
(`document.documentElement.lang`).

The script divides into fairly legible, named regions by comment banners and
state clustering: boot/dictionary/language/song-document setup; a large
poem/score slot-queue derivation cluster; a ~750-line **Correction Station**
(cursor, undo/redo, pitch/duration/tuplet editing); the **Loupe** (magnifier)
and its phone/desktop gesture handling; portrait/reading-view toggling;
**calibration** entry/exit; the transcription **pipeline**; a tangled
**text-arrival** pipeline (paste/drop/score-upload reconciliation, replace
confirmation, correction carry-over across text diffs); **library/binder**
CRUD; metadata/language handlers; and tab/reading navigation plus the boot
`onMount`.

Ranked extraction candidates (JUDGEMENT, not sourced from any repo doc I
found): the Correction Station is the lowest-risk seam (self-contained state,
already delegates hard logic to `$lib/shane/entry.ts` and `correction.ts`);
the Loupe orchestration and the library/binder CRUD are medium risk; the
text-arrival pipeline is the highest-risk region to extract, since it reaches
into pipeline, correction, and loupe state simultaneously rather than owning
a clean slice of its own.

## What I could not establish

- The `phone` Playwright project's pass/fail verdict for test 1, and any
  result at all for tests 2–3 (`real clicks resolve...`, `real clicks on a
  measure that did not converge`) — my run was cut off by my own time
  budget before they completed.
- Whether the two near-duplicate `$effect` blocks at `+page.svelte` lines
  4190 and 4196 (both IntersectionObserver-based heading tracking) are both
  live, or one is dead code left behind a refactor — would need a closer
  diff read to confirm.
- A full markup-only (post-`</script>`) section map of `+page.svelte`
  (lines 4371–6225) by tab/`destination` branch — only coarsely located
  (`HeaderBar` at 4413, `app-content` wrapper at 4508, `<main>` at 4983) in
  the time available; the task's own emphasis was the script portion.
- Whether `apps/web/src/lib/components/Drawer/InspectorPanel.svelte`'s low
  6-month churn against its all-time 40 commits reflects a genuinely
  stabilized file, or a gap in when this repo's history was captured; not
  investigated further.

## Surprises

- **The entire desktop e2e suite (21 tests) has been unable to pass since
  commit `5f6a2f3`**, because its shared setup helper waits on a CSS class
  the app itself documents removing, in a comment, at the removal site. This
  is not a flaky test or an environment quirk: it is a suite that has quietly
  stopped testing anything, on a branch with 130 commits to `+page.svelte`
  in the last 6 months alone. Whether `pnpm test` is run as a gate before
  merges, and whether it was green through this, is worth asking Dann or
  checking CI configuration (out of this audit's scope).
- **The sandboxed Playwright browsers don't match the repo's pinned
  Playwright version** (1194 installed vs. 1208 required). This blocks
  anyone from running the documented `pnpm --filter @ilya/web exec
  playwright test` command in this environment as-is; I worked around it for
  this audit's purposes only, without touching the repo.
- **`staff-renderer.ts` (packages/score-parser) carries a single function at
  cyclomatic complexity 244** — by far the highest of any function found in
  either file type across the whole codebase — yet it has no churn-driven
  reason to be risky (63 commits, all 6 months old, meaning it's a
  relatively young, actively-developed file rather than old and stable). It
  ranked #2 in this audit's hotspot table purely on the strength of that one
  number.
- `+page.svelte`'s `$effect` count (10) is much lower than its line count
  and churn would suggest; the file's complexity is concentrated in imperative
  event handlers and `$derived` chains, not in effects. Only 6 of the 10
  effects write reactive state at all.

## `git status --porcelain`

Ran at the end of the session: empty output (nothing changed in the working
tree).
