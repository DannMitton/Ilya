# Brief for Code, r1: N.174 slice D.2.3, the `analysis/` module

Written by the desk 2026-09-27 after D.2.2 shipped at `687da7c`. Spec, plan, and module map
as in D.2.1's brief. `analysis/` is the sixth module the module map proposed (section 0):
the four files both documents read. Every `path:line` here was read by the desk at
`687da7c` this session. If the tree has moved, the tree wins; say where.

**What the singer sees must not change.** No shown string changes. The desk compares the 84
screenshots once you are done.

## Before you start

Fetch `Shane` and confirm HEAD is `687da7c` or a descendant. One writer on `Shane` at a time.

**No `git stash`, and no other git command that writes** (`CONTRACT.md` §5). In D.2.2 the
"before" reading was taken by stashing the slice; that is forbidden. **Take the "before"
reading first, before you edit anything.** If you need the old code again mid-slice, read
it with `git show 687da7c:<path>`, or build it in a copy made with
`git worktree`… no: `worktree add` writes too. Use `git archive 687da7c | tar -x -C <scratch dir>`
under your session's scratch folder, which reads only.

## The move

All paths are under `apps/web/src/lib/` unless given in full. Use `git mv`.

1. Move these fourteen files from `shane/` to `analysis/`, names unchanged: `advice-resolver.ts`, `advice-resolver.test.ts`, `analyze-per-verse.ts`, `analyze-per-verse.test.ts`, `analyze-score-adapter.ts`, `analyze-score-adapter.test.ts`, `diction-fold-live.test.ts`, `notation-overlay.ts`, `notation-overlay.test.ts`, `performance-order-seam.test.ts`, `score-metrics.ts`, `score-metrics.test.ts`, `watchlist.ts`, `watchlist.test.ts`.
2. **`analyzePerVerse` moves; it is not deleted** (`CONTRACT.md` §6: "N.20 is built on it"). `notation-overlay.ts` also moves as it is: whether it is dead code is an `OWED.md` question, not this slice's.
3. Importers by `$lib/shane/…`, rewritten to `$lib/analysis/…`: `markup/MarkupPane.svelte:87`, `:88`, `:93`, `:94`; `insights/insights.ts:43`; `insights/insights.test.ts:44`, `:45`; `insights/InsightsPane.svelte:58`, `:59`, `:60`; `tools/n168-frequency-run/frequency-run.run.ts:59`, `:64`, `:65`.
4. **Relative imports that break because their target stays in `shane/`.** Rewrite each to `$lib/shane/…`: `analyze-per-verse.ts:34` (`./vowel-resolver`); `analyze-score-adapter.ts:36` (`./engine/types`), `:37` (`./engine/derivations`); `analyze-score-adapter.test.ts:21` (`./engine/types`); `watchlist.ts:61` (`./vowel-resolver`); `diction-fold-live.test.ts:18` (`./ingestion/mini-dom`), `:19` (`./ingestion/ingest`), `:20` (`./engine/score-reader`), `:21` (`./vowel-resolver`).
5. **The fixture URL, which fails only at run time:** `diction-fold-live.test.ts:25` reads `new URL('./ingestion/fixtures/sunless-01-engraved.musicxml', import.meta.url)`. From `analysis/` it becomes `'../shane/ingestion/fixtures/sunless-01-engraved.musicxml'`. It moves again with `score/` in D.2.6. Confirm the test runs and passes after the move, not only that it compiles.
6. Relative imports between two moved files (`advice-resolver.test.ts:20`, `analyze-per-verse.test.ts:21`, `analyze-score-adapter.test.ts:20`, `diction-fold-live.test.ts:22`, `notation-overlay.test.ts:11`, `performance-order-seam.test.ts:29`, `score-metrics.test.ts:26`, `watchlist.test.ts:24`, `:25`) stay as they are. Run `pnpm --filter @ilya/web check` before anything else; it lists any the desk missed.
7. **The i18n keys `fit.broad.*` become `analysis.broad.*`** (plan D.2.3): `i18n.ts:745-748`, the four keys `body`, `itemRange`, `itemPassaggio`, `join`. Their English and French values do not change by one character. Readers: `analyze-score-adapter.ts:253`, `:254`, `:257`, `:258`; the comment at `markup/MarkupPane.svelte:800`. The approval test `lib/approval/i18n-keys.test.ts` must still pass.
8. No ceiling in `scripts/ratchets.json` names these files; confirm with a grep.
9. Comments naming these files by their old path, in `apps`, `tools`, `packages`, and `docs/memory` (not `docs/sessions/`), name the new path. A cited line number stays only if it is still true.
10. `ARCHITECTURE.md`: a `src/lib/analysis/` entry beside `markup/` and `insights/`, and these files leave the `lib/shane/` listing.

## Done when

- `apps/web/src/lib/analysis/` holds exactly the fourteen files.
- `node scripts/ratchets.mjs` passes with no `MODULE` breach. **State your expectation first.** The desk expects none: `markup/` and `insights/` may import `analysis/`, and `analysis/` imports only `shane/`, packages, and shared files such as `$lib/i18n`.
- All eight gates pass, web-test still 1493 (a moved test is the same test).
- Playwright desktop 28 and phone 2 stay green.
- The N.168 frequency run still resolves its imports (command at `tools/n168-frequency-run/vitest.config.ts:14-15`). `tools/n168-frequency-run/out/` stays as committed: if the run rewrites it, restore it with `git checkout`… no, that writes: copy the committed files back from `git show HEAD:<path>`.
- On localhost with a score and a calibrated voice whose characteristics are **blank**, the Markup footer's broad-analysis note reads exactly as before, in English and in French. That note is the one thing the key rename can break at run time.
- A memo of fifteen lines or fewer in `docs/sessions/memo-code-n174-d23_r1_2026-09-27.md`: what moved, the keys, the fixture test's run, the gates, and a section titled "NOT ESTABLISHED". **NOT ESTABLISHED beats a complete invented answer.**

## Do not

- Do not move `vowel-resolver.ts` or anything under `engine/` or `ingestion/`. They belong to `score/` and `voice/`, later.
- Do not change any string a singer sees.
- Do not use `git stash`, `git checkout`, `git restore`, `git worktree`, or any other git command that writes. Do not commit. Dann ships with `ilya-ship.sh`; `git add` the new paths first.
