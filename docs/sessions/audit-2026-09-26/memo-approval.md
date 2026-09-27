# Approval test suite: memo

Branch `audit`, commit `f9493d3` at start, working tree clean throughout
except the new paths listed at the end (`git status --porcelain` checked
before and after). All commands run from `/home/claude/ilya`.

## What each suite covers

**`packages/score-parser/src/approval/staff-renderer.approval.test.ts`**
(target 1). `renderAnalyzedStaff` against `demo-fixture.ts`'s shared
four-measure fixture (also used by `staff-renderer.test.ts`'s 174
string-assertion tests): 3 variants (`renderDemo`, `renderDemoDotted`,
`renderDemoUnmeasured`) x 2 modes (primitive, SMuFL via
`syntheticSmuflFont()`) = 6 approved SVGs. `npx vitest run
src/approval/staff-renderer.approval.test.ts` → 6/6 passed; first run
"Snapshots 6 written", second run 0 written.

**`apps/web/src/lib/approval/staff-renderer-real-fixture.approval.test.ts`**
(target 1, real fixture). Parses the repo's one real, committed score,
`apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml`
(5,024 lines, Mussorgsky), with `MusicXmlScoreParser` via
`$lib/shane/ingestion/mini-dom.ts`'s `parseXml` (the app's existing
no-DOM-in-node fix, already used by 7 other test files), then renders it
through `renderAnalyzedStaff`. 1 approved SVG (1,036 lines). Its vowel
resolver reads the fixture's own verse-2 IPA directly
(`SyllableInfo.verses[1]`), not `buildVowelResolver`/`processText`; see
the file header for why (avoids cross-file dictionary state coupling with
`ipa-corpus.approval.test.ts`).

**`packages/score-parser/src/approval/musicxml-parser.approval.test.ts`**
(target 2). Parses the same real fixture, approves the `ParsedScore` as
stable sorted-key JSON (18 measures, 116 `vocalLine` events,
5,405-line file) and the `warnings` array (1 warning, see below).

**`packages/score-parser/src/approval/mnx-parser.approval.test.ts`**
(target 2). No real, committed `.mnx` fixture exists anywhere in the repo
(`find . -iname '*.mnx'`, excluding `node_modules`, is empty; the one MNX
integration fixture in `mnx-parser.test.ts` needs `SHANE_T08_MNX`, unset
here, and is not committed since it derives from a copyrighted score).
This suite reproduces `mnx-parser.test.ts:42-193`'s own `mainFixture()`
verbatim (cited in the file header) and approves `MnxScoreParser`'s
`ParsedScore` and `warnings` (empty) for it.

**`apps/web/src/lib/approval/ipa-corpus.approval.test.ts`** (target 3).
Loads the real, committed dictionary
(`apps/web/static/data/dictionary.86d83340-{a,b}.json`, 943,106 entries)
off disk with `node:fs`, mirroring `loader.ts`'s entry mapping (cited
inline; the helper is not exported), then runs `processText`
(`$lib/pipeline.ts`) on 40 lines from 6 public-domain poems (Pushkin x2,
Lermontov, Tyutchev x2, Fet) exercising stress, ё-restoration, clitics,
voicing assimilation, palatalization, and reduction. Approves one text
file whose first line is `Dictionary entries loaded: 943106`, per the
brief's silent-partial-dictionary gate. The 8 "Я вас любил" lines are the
app's own existing test text (`reading-aid.test.ts:88-95`); the other 32
were added per the citation rule (see "What I could not establish").

**Target 4** (`shane/pairings.ts`, `shane/watchlist.ts`): not attempted;
no time remained after targets 1-3 and their two-run proof.

## What was normalized, and why

Both parsers' `syllableId()` (musicxml-parser.ts:268-276,
mnx-parser.ts:251-259) call `crypto.randomUUID()` when a syllable has no
source id, true for every syllable in both fixtures used here. Proved
with a same-input, two-parse comparison in both parser approval files:
ids differ between calls, non-empty. Normalized by replacing each unique
`syllable.id`, in first-encountered order over `vocalLine`, with
`SYL_0`, `SYL_1`, ... before snapshotting. `staff-renderer.ts` never reads
`syllable.id` (`grep -n "syllable.id\|data-syllable" staff-renderer.ts` →
no output), so the two renderer-SVG approvals need no normalization.
`analyzeScore`'s only other non-determinism, `generatedAt` defaulting to
`new Date().toISOString()` (overlay-engine.ts:243), is avoided by always
passing a fixed `generatedAt`.

## Two-run proof

Full `pnpm test` (root script), twice: run 1 `real 0m47.152s`, run 2
`real 0m46.653s`, both clean (score-parser 615 passed | 5 skipped;
apps/web 1,470 passed; root `tests/` 55 passed). `git status --porcelain`
before run 1 and after run 2 showed only the two new, untracked approval
directories; no existing file touched. `md5sum` over all 12 approved
files after run 1, checked with `md5sum -c` after run 2: all 12 `OK`. I
also ran each new suite alone twice, and the whole `apps/web` suite (74
files, 1,470 tests) twice back to back specifically to rule out
`GraysonEngine`'s module-level dictionary state leaking between
`ipa-corpus.approval.test.ts` and the real-fixture renderer test in the
same worker: checksums identical across both runs.

## Added test time

By vitest's own reported durations: the three score-parser suites ~30 ms,
~150-190 ms, ~30-40 ms (that package's full 25-file suite runs in ~9.5s
either way); the real-fixture renderer test ~65-85 ms; the IPA corpus
test ~4.2-4.4s, almost all one-time dictionary load (3.6s measured
standalone with plain `node -e`, outside vitest). Total added: roughly
4.5-4.7s, against the ~20s budget.

## Looks wrong, recorded as is

`sunless-01-engraved.musicxml`, measure 16: the parser emits
`{"code":"measure-duration-mismatch","message":"Measure 16 content lasts
7/4 whole notes against an expected 3/2."}`. This is the parser's own
non-fatal warning, not this suite's judgement; the fixture still parses
and renders, and the approved output reflects whatever the parser
actually did. Not investigated or fixed, per the brief.

## What I could not establish

- Whether `buildVowelResolver`'s real production output on this fixture
  (which runs the Cyrillic verse through `processText` with the real
  dictionary) matches the verse-2-IPA-only resolver used instead here.
  NOT ESTABLISHED; the substitution and its reason are in the file
  header.
- The exact orthography of the 32 added corpus lines against a critical
  edition; transcribed from each poem's standard, widely reprinted text,
  not copied from a repo source file, and not checked against a primary
  source. Only the 8 Pushkin lines are a verified exact match to existing
  repo text.
- Whether any other real score fixture exists beyond
  `sunless-01-engraved.musicxml`. Searched `find . -iname '*.musicxml' -o
  -iname '*.mxl' -o -iname '*.mnx'` (excluding `node_modules`). Found four
  more `.musicxml` files under `tools/e16-harness/`, a separate
  non-package harness not wired to any test runner; not used.
- Target 4: not started.

## Files created

- `packages/score-parser/src/approval/staff-renderer.approval.test.ts`
- `packages/score-parser/src/approval/musicxml-parser.approval.test.ts`
- `packages/score-parser/src/approval/mnx-parser.approval.test.ts`
- `packages/score-parser/src/approval/__approved__/README.md`
- `packages/score-parser/src/approval/__approved__/renderDemo.primitive.svg`
- `packages/score-parser/src/approval/__approved__/renderDemo.smufl.svg`
- `packages/score-parser/src/approval/__approved__/renderDemoDotted.primitive.svg`
- `packages/score-parser/src/approval/__approved__/renderDemoDotted.smufl.svg`
- `packages/score-parser/src/approval/__approved__/renderDemoUnmeasured.primitive.svg`
- `packages/score-parser/src/approval/__approved__/renderDemoUnmeasured.smufl.svg`
- `packages/score-parser/src/approval/__approved__/sunless-01-engraved.parsed-score.json`
- `packages/score-parser/src/approval/__approved__/sunless-01-engraved.warnings.json`
- `packages/score-parser/src/approval/__approved__/mnx-main-fixture.parsed-score.json`
- `packages/score-parser/src/approval/__approved__/mnx-main-fixture.warnings.json`
- `apps/web/src/lib/approval/staff-renderer-real-fixture.approval.test.ts`
- `apps/web/src/lib/approval/ipa-corpus.approval.test.ts`
- `apps/web/src/lib/approval/__approved__/README.md`
- `apps/web/src/lib/approval/__approved__/sunless-01-engraved.primitive.svg`
- `apps/web/src/lib/approval/__approved__/ipa-corpus.txt`

No file outside these paths was created, edited, or committed. No git
command that writes was run.
