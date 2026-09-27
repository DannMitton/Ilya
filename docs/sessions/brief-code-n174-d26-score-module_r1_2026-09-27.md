# Brief for Code, r1: N.174 slice D.2.6, the `score/` module, and `lib/shane/` ends

Written by the desk 2026-09-27 after D.2.5 shipped at `793fc7f`. Spec, plan, and module map
as in D.2.1's brief. Every `path:line` here was read by the desk at `793fc7f` this session.
If the tree has moved, the tree wins; say where.

**What the singer sees must not change.** The desk compares the 84 screenshots once you are
done. This slice moves the score itself: the seating of words on notes, correction, the
loupe, ingestion, and reconciliation.

**Scope, DESK DEFAULT.** The plan put six small renames in this slice as well (the
`shane-*` CSS classes, `data-fit-page`, `SHANE_T08_MNX`, the `fit-font-lab` route, the Guide
anchors, the `fit.witness.*` keys). **They move to D.3**, so this slice is a pure move and
its diff is easy to read. D.3's brief carries them.

## Before you start

Fetch `Shane` and confirm HEAD is `793fc7f` or a descendant. One writer on `Shane` at a time.
**Take the "before" reading first.** No `git stash`, `checkout`, `restore`, `worktree`, or
other git command that writes; read old code with `git show 793fc7f:<path>`. **Do not serve
a second copy of the app alongside the dev server:** in D.2.5 that rewrote Vite's shared
dependency cache and hung PDF reads on both servers. If you need the old code running,
stop the dev server first. Grep with `-a`.

## The move

All paths are under `apps/web/src/lib/` unless given in full.

1. `git mv shane score`. **Everything left in `shane/` moves, 66 files, with the same layout:** `ingestion/` (and its `fixtures/` and `__fixtures__/`) and `reconciliation/` stay subfolders. Relative imports inside the folder keep working because nothing changes depth, including `loupe-render.test.ts:10` and `clitic-seat.test.ts:20` (`../../../../../packages/…`) and `draw-pairings.test.ts:144` (`../../routes/+page.svelte`).
2. Then `git mv score/engine/notation-fonts.ts score/notation-fonts.ts`, so `score/engine/` goes (DESK DEFAULT: one file does not earn a folder). It has no relative imports of its own; its font files are fetched by URL at run time (`notation-fonts.ts:53`, `:56`), not imported.
3. The stray `ingestion/fixtures/sunless-01-engraved.musicxml.bak-before-ja-2026-09-20` moves with the folder. Deleting it is `OWED.md`'s question, not this slice's.

## Importers, `$lib/shane/…` to `$lib/score/…`

Every one of these, and anything `pnpm --filter @ilya/web check` finds that the desk missed:

- `routes/+page.svelte:31`, `:32`, `:33`, `:124`, `:125`, `:137`, `:138`, `:147`, `:153`, `:154`, `:155`, `:156`, `:157`, `:165`, `:186`, `:204`, `:206`, `:207`.
- `library/driver.ts:17`; `library/document.svelte.ts:26`, `:27`; `library/library.ts:23`, `:24`; `library/types.ts:19`, `:20`.
- `markup/MarkupPane.svelte:71`, `:72`, `:73`, `:84`, `:89`, `:90`, `:91`, `:92`.
- `analysis/diction-fold-live.test.ts:18`, `:19`, `:21`; `analysis/analyze-per-verse.ts:34`; `analysis/watchlist.ts:61`.
- `insights/Tessituragram.svelte:25`; `insights/InsightsPane.svelte:42`, `:56`, `:57`.
- `voice/NotePicker.svelte:33`; `voice/CalibrationWizard.svelte:58`.
- `approval/staff-renderer-real-fixture.approval.test.ts:60`.
- `routes/fit-font-lab/+page.svelte:14` (the route keeps its name in this slice).
- `tools/n168-frequency-run/frequency-run.run.ts:58`.
- Inside the moved files: `CorrectionSurface.svelte:37` and `Loupe.svelte:23` import `$lib/shane/engine/notation-fonts`; they become `$lib/score/notation-fonts`. Every other `$lib/shane/…` inside the folder becomes `$lib/score/…`.

Every `…/engine/notation-fonts` becomes `…/notation-fonts`.

## Paths in plain strings, which fail only at run time

1. `apps/web/e2e/singer-paths.test.ts:25` and `apps/web/e2e-phone/loupe-scan.test.ts:42`: `src/lib/shane/ingestion/fixtures/…` becomes `src/lib/score/ingestion/fixtures/…`.
2. `packages/score-parser/src/approval/musicxml-parser.approval.test.ts:140`: `…/apps/web/src/lib/shane/ingestion/fixtures/…` becomes `…/lib/score/…`.
3. `analysis/diction-fold-live.test.ts:25`: its `new URL('../shane/ingestion/fixtures/…')` from D.2.3 becomes `'../score/ingestion/fixtures/…'`.
4. `scripts/ratchets.json:11`, `:17`, `:19`, `:20`: the four keys (`Loupe.svelte`, `pairings.ts`, `ScoreUploader.svelte`, `CorrectionSurface.svelte`) become `apps/web/src/lib/score/…`. The ratchet fails if one is missed.
5. `scripts/ratchets.mjs:99`: `SHANE_FOLDER_IS_GONE` becomes `true`, and its comment says D.2.6 switched it on.

## Words in this slice

Only paths: comments naming `lib/shane/` files by path, in `apps`, `tools`, `packages`, and
`docs/memory` (not `docs/sessions/`), name `lib/score/`. `ARCHITECTURE.md:89`, "`src/lib/shane/`
is Fit. Inside it:", and the listing under it become the `src/lib/score/` entry, beside the
five other modules. Leave every other mention of Shane or Fit in prose for D.3.

## Done when

- `apps/web/src/lib/shane/` does not exist. `apps/web/src/lib/score/` holds 66 files, with `notation-fonts.ts` at its top level and no `engine/`.
- `node scripts/ratchets.mjs` passes with `SHANE_FOLDER_IS_GONE` on and no `MODULE` breach. **State your expectation first.** The desk expects none: no file in the folder imports `voice/`, `analysis/`, `markup/`, or `insights/` (desk grep at `793fc7f`), and `score/` may import `reader/`.
- **A positive control for the switched-on check:** create a scratch `apps/web/src/lib/shane/_probe.ts`, run the ratchet, see the `MODULE … is under lib/shane/` breach and exit 1, delete it, see OK.
- All eight gates pass, web-test still 1493. The score-parser gate still shows `615 passed | 5 skipped (620)`: if its approval test cannot find the fixture, it fails loudly, and a count that drops means a test went missing.
- Playwright desktop 28 and phone 2 stay green. The phone loupe scan reads the fixture from its new path.
- On localhost, before and after: open the e2e fixture, open Markup, tap a syllable so the loupe rises, make one correction, undo it. Same page, same loupe.
- A memo of fifteen lines or fewer in `docs/sessions/memo-code-n174-d26_r1_2026-09-27.md`: the move, the positive control, the gates, the loupe walk, and a section titled "NOT ESTABLISHED". **NOT ESTABLISHED beats a complete invented answer.**

## Do not

- Do not rename the CSS classes, the route, the Guide anchors, or any i18n key in this slice. They are D.3's.
- Do not delete the `.bak` fixture, `TextualWitnesses.svelte`, or `reconciliation/`.
- Do not change any string a singer sees.
- Do not use `git stash`, `checkout`, `restore`, `worktree`, or any other git command that writes. Do not commit. Dann ships with `ilya-ship.sh`; `git add` the new paths first.
