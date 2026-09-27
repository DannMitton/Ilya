# Brief for Code, r1: N.174 slice D.2.2, the `insights/` module

Written by the desk 2026-09-27 after D.2.1 shipped at `0aa3b2b`. Spec, plan, and module map
as in D.2.1's brief (`docs/sessions/brief-code-n174-d21-markup-module_r1_2026-09-27.md`).
Every `path:line` here was read by the desk at `0aa3b2b` this session. If the tree has
moved, the tree wins; say where.

**What the singer sees must not change.** No shown string changes. The desk compares the 84
screenshots once you are done.

## Before you start

Fetch `Shane` and confirm HEAD is `0aa3b2b` or a descendant. One writer on `Shane` at a time.

## Part 1. Tie the withheld line to one constant (from D.2.1's NOT ESTABLISHED)

`markup/legend.ts:159` emits `type: 'markup-withheld'` and `components/Paper/PageFooter.svelte:70`
tests `item.type === 'markup-withheld'` by a second copy of the string. Export one constant
from `markup/legend.ts`, `MARKUP_WITHHELD_TYPE = 'markup-withheld'`, use it at `:159`, and
import it in `PageFooter.svelte` for the comparison. Add one assertion to
`markup/legend.test.ts` that the built withheld item's `type` equals the constant.
DESK DEFAULT. `PageFooter` sits in `components/`, outside the six modules, so check 4 allows it.

## Part 2. Move `insights/` (D.2.2)

All paths are under `apps/web/src/lib/` unless given in full. Use `git mv`.

1. Move these ten files from `shane/` to `insights/`, names unchanged: `InsightsPane.svelte`, `Tessituragram.svelte`, `comment-sources.ts`, `comment-text.ts`, `comments.ts`, `comments.test.ts`, `insights.ts`, `insights.test.ts`, `range-offer-decline.ts`, `range-offer-decline.test.ts`.
2. **`InsightsIntake.svelte` stays in `shane/`.** It moves with `voice/` in D.2.4, because the calibration wizard mounts it (`shane/CalibrationWizard.svelte:48`).
3. Importers outside the folder: `routes/+page.svelte:123`; `tools/n168-frequency-run/frequency-run.run.ts:63`; `tools/n168-frequency-run/comments-oracle.ts:25-26`. Their prose mentions of `$lib/shane/comments.ts` (`frequency-run.run.ts:592`, `comments-oracle.ts:5`, `:120`) follow.
4. Imports inside the moved files, `$lib/shane/…` to `$lib/insights/…` where the target moved: `InsightsPane.svelte:35`, `:53-55`, `:76-77`; `Tessituragram.svelte:27`.
5. **Relative imports that break because their target did not move.** Rewrite each to `$lib/shane/…`: `comment-text.ts:22` (`./note-picker`); `insights.ts:43` (`./watchlist`) and `:44` (`./engine/types`); `insights.test.ts:44` (`./watchlist`) and `:45` (`./advice-resolver`). Relative imports between two moved files (`comment-text.ts:23-24`, `comments.test.ts:22`, `:36-37`, `insights.test.ts:43`, `range-offer-decline.test.ts:15-16`) stay as they are. Run `pnpm --filter @ilya/web check` before anything else; it lists any the desk missed.
6. `scripts/ratchets.json:18`: the key becomes `apps/web/src/lib/insights/InsightsPane.svelte`, ceiling unchanged. The ratchet now fails if you forget.
7. **Unchanged on purpose:** the stored key `'ilya:rangeOfferDeclined'` (`range-offer-decline.ts:20`); the i18n keys `insights.fit.*` and `insights.verdict.fit`, where "fit" is the ordinary noun (module map, section 10); the CSS classes `insights-*`.
8. Comments that name these files by their old path (`grep -rn "shane/\(InsightsPane\|Tessituragram\|comment-sources\|comment-text\|comments\|insights\|range-offer-decline\)" apps tools packages docs/memory`, excluding `docs/sessions/`) name the new path. A comment citing a line number keeps it only if it is still true.
9. `ARCHITECTURE.md`: add a `src/lib/insights/` entry beside the `src/lib/markup/` one that D.2.1 added, and remove these files from the `lib/shane/` listing.

## Done when

- `apps/web/src/lib/insights/` holds exactly the ten files.
- `node scripts/ratchets.mjs` passes with no `MODULE` breach. **State your expectation first.** The desk expects none: the ten files import nothing from `markup/` (grep of their imports at `0aa3b2b`), and `shane/` is not one of the six modules.
- All eight gates pass. State the web-test count; Part 1 adds one assertion, not one test, so the count should not move. If it moves, say why.
- Playwright desktop 28 and phone 2 stay green.
- The tool's two runs still work, since their imports changed. Run them as their headers say (`frequency-run.run.ts:9`, `comments-oracle.ts`, with `--config tools/n168-frequency-run/vitest.config.ts`), and confirm each regenerates its output in `tools/n168-frequency-run/out/` byte-identical to the committed copy. If a run needs data that is not in the tree, say so and skip it.
- On localhost, with a score and a calibrated voice, Insights shows the phonation time, the tessituragram, the fit table, and the comments, as before the move.
- A memo of fifteen lines or fewer in `docs/sessions/memo-code-n174-d22_r1_2026-09-27.md`: what moved, the constant, the gates, the tool's run, and a section titled "NOT ESTABLISHED". **NOT ESTABLISHED beats a complete invented answer.**

## Do not

- Do not move `InsightsIntake.svelte`, or any analysis file (`watchlist.ts`, `advice-resolver.ts`, `analyze-score-adapter.ts`, `score-metrics.ts`). Those move in D.2.3 and D.2.4.
- Do not rename an i18n key or a stored key.
- Do not change any string a singer sees.
- Do not commit. Dann ships with `ilya-ship.sh`; `git add` the new paths first.
