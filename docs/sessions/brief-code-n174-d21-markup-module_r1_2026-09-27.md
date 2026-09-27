# Brief for Code, r1: N.174 slice D.2.1, the `markup/` module and the module ratchet

Written by the desk 2026-09-27 after D.1 shipped at `c2a01b3`. Spec:
`docs/sessions/spec-n174-text-markup-insights_r1_2026-09-26.md`. Plan:
`docs/sessions/plan-n174-change-list_r1_2026-09-27.md`, D.2.0 and D.2.1. Module map:
`docs/sessions/n174-B-module-map_r1_2026-09-27.md`. Every `path:line` here was read by the
desk at `c2a01b3` this session. If the tree has moved, the tree wins; say where.

**What the singer sees must not change.** No shown string changes. The desk compares 84
screenshots from before and after, 24 of them with a calibrated voice, once you are done.

## Before you start

Fetch `Shane` and confirm HEAD is `c2a01b3` or a descendant. One writer on `Shane` at a time.
Feature work on `lib/shane/` pauses while D.2 runs (spec, "Order").

## Part 1. The module ratchet (D.2.0)

In `scripts/ratchets.mjs`, add check "4. MODULES" inside the existing import loop, as B's
section 8 describes:

1. A table of the six modules under `apps/web/src/lib/` and what each may import: `reader: {}`, `score: {reader}`, `voice: {reader, score}`, `analysis: {reader, score, voice}`, `markup: {reader, score, voice, analysis}`, `insights: {reader, score, voice, analysis}`.
2. For a file under `apps/web/src/lib/<m>/` with `<m>` in the table, resolve each import to a module: `$lib/<n>/…` gives `<n>`; a relative import gives the module of the resolved path. An import that resolves outside the six is ignored by this check.
3. If `<n>` is one of the six, differs from `<m>`, and is not in `<m>`'s set, push `MODULE <file> imports "<spec>". <m>/ may not import <n>/.`
4. Check 4 applies to test files too (today's loop skips them at `ratchets.mjs:72`; keep that skip for checks 2 and 3 only).
5. Add a second pattern for `new URL('…', import.meta.url)` to check 4, so a Worker import is seen.
6. Write, but leave switched off, the check that any file still under `apps/web/src/lib/shane/` is a breach. A comment says slice D.2.6 switches it on.
7. **Make a stale ceiling a breach.** Today a ceiling whose file no longer exists only prints "can be lowered" (`ratchets.mjs:65-67`), so a moved file loses its ceiling silently. Push it to `breaches` instead, with the message `SIZE <file> has a ceiling in scripts/ratchets.json but no longer exists. Move the key with the file.` DESK DEFAULT.

Until a module folder exists, check 4 finds nothing, so it becomes live as each module appears.

## Part 2. Move `markup/` (D.2.1)

All paths are under `apps/web/src/lib/` unless given in full. Use `git mv` so history follows.

1. `shane/VoiceProfilePane.svelte` becomes `markup/MarkupPane.svelte` (DESK DEFAULT, the twin of `InsightsPane`). Its importer: `routes/+page.svelte:122` (the import) and `:5076` (the element).
2. `shane/fit-legend.ts` becomes `markup/legend.ts`, and `shane/fit-legend.test.ts` becomes `markup/legend.test.ts`. The importer is `MarkupPane.svelte` (today `VoiceProfilePane.svelte:62`).
3. In `legend.ts`, rename the identifiers: `FIT_LEGEND_ORDER` to `MARKUP_LEGEND_ORDER`, `FitLegendType` to `MarkupLegendType`, `FIT_LEGEND_COPY` to `MARKUP_LEGEND_COPY`, `fitLegendTypes` to `markupLegendTypes`, `buildFitLegend` to `buildMarkupLegend`, `FIT_WITHHELD_COPY` to `MARKUP_WITHHELD_COPY`. In `MarkupPane.svelte`, the variable `fitLegend` (`:700`, read at `:1027`, `:1156`) becomes `markupLegend`.
4. **The legend's type strings, which the compiler does not check.** `'fit-captured'`, `'fit-provisional'`, `'fit-estimated'`, `'fit-unmeasured'` (`fit-legend.ts:52-55`, `:62-74`, `:123-127`) and `'fit-withheld'` (`:159`) become `'markup-captured'` and so on. `LegendItem.type` is a plain `string` (`provenance.ts:17`), so **`components/Paper/PageFooter.svelte:70` must change in the same edit**, or the withheld line vanishes from the footer with every gate green. Update the test's expectations to match.
5. **The CSS class `.fit-paper-container`**, also unchecked: it becomes `.markup-paper-container` at `MarkupPane.svelte` (today `VoiceProfilePane.svelte:318`, `:989`, `:1091`, `:1303`) and at the two `document.querySelector` calls in `shane/Loupe.svelte:527`, `:739`. Search all of `apps/web` for any other reader of the old class.
6. `MarkupPane.svelte` keeps its imports from `$lib/shane/…` for the files that have not moved yet. Only paths to the two moved files change.
7. `scripts/ratchets.json:16`: the key becomes `apps/web/src/lib/markup/MarkupPane.svelte`, ceiling unchanged.
8. Comments that name `VoiceProfilePane` or `fit-legend` by file (the full list: `grep -rn "VoiceProfilePane\|fit-legend" apps packages`) become the new names. A comment that cites `VoiceProfilePane.svelte:<line>` as a record keeps its line only if it is still true; otherwise it names the thing instead of a number (`CONTRACT.md` §5, edit by anchor).

## Done when

- `apps/web/src/lib/markup/` holds exactly `MarkupPane.svelte`, `legend.ts`, `legend.test.ts`.
- A search of `apps/web` for `fit-paper-container`, `'fit-captured'`, `'fit-withheld'`, `buildFitLegend`, and `VoiceProfilePane` as a live import finds nothing.
- **A positive control for check 4:** add a throwaway import of `$lib/markup/legend` to any file under a folder named in the table that may not import `markup/`. If none exists yet, create a scratch file `apps/web/src/lib/score/_probe.ts`. Run `node scripts/ratchets.mjs`; it must print a `MODULE` breach and exit 1. Remove the probe and run it again: OK. **State your expectation before each run** (CONTRACT §5, THE CONTROL RULE).
- **A positive control for the stale ceiling:** rename a ceiling key to a path that does not exist, run the ratchet, see the breach, and restore it.
- All eight gates pass. State the web-test count if it moved.
- Playwright desktop 28 and phone 2 stay green.
- On localhost, open Markup with a score and a calibrated voice: the footer legend shows the same entries as before. If the fixture has a withheld syllable, the withheld line is still there.
- A memo of fifteen lines or fewer in `docs/sessions/memo-code-n174-d21_r1_2026-09-27.md`: what moved, the two controls, the gates, and a section titled "NOT ESTABLISHED". **NOT ESTABLISHED beats a complete invented answer.**

## Do not

- Do not move any other file out of `lib/shane/`. The analysis files `MarkupPane` imports move in D.2.3.
- Do not rename an i18n key in this slice.
- Do not change any string a singer sees.
- Do not commit. Dann ships with `ilya-ship.sh`; `git add` the new paths first.
