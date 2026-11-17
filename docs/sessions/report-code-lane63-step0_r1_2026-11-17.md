# Report: lane 63, Step 0 (read and report, nothing changed)

2026-11-17. Branch `cloud-lane-63`, cut from `Shane` at `240fe5ab185ec5c5122f5e7d0610777c963c7589` (read from `git rev-parse origin/Shane`, then `HEAD` after the branch). Working tree clean after `pnpm install --frozen-lockfile` (`git status --short` printed nothing). Brief read: `docs/sessions/brief-code-lane63-cleanups_r2_2026-11-17.md`.

## The gates

Not run in this step. The desk rule of 2026-11-16 (`docs/memory/ENVIRONMENT.md`, "LEARNED BY THE 2026-11-16 OPUS DESK") and the prompt for this lane say: after each step, only the tests of the files that step changed; all eight gates and the named Playwright suites once, at the end. The baseline below is the one the brief and the prompt give. I did not measure it.

- Gate 4 baseline at `240fe5ab`: 6544 passed, 1 skipped (6545) with Python, numpy, and scipy; 6540 passed, 5 skipped without them.
- This container has Python 3 and numpy, but **no scipy** (`ModuleNotFoundError: No module named 'scipy'`). `havePython` (`tools/n200-score/burg-fixtures.ts:18`) is therefore false here. The count to expect at the end is **6540 passed, 5 skipped**.

## Every cited line, re-read on this tip

| Brief's citation | Found | Matches |
|---|---|---|
| `voice/NotePicker.svelte:122` | `let clef = $derived(value ? clefFor(value, voiceType) : 'treble');` | yes |
| `voice/NotePicker.svelte:68` | `let stagedOctave = $state(4);` | yes |
| `voice/NotePicker.svelte:97-105` | `clear()` sets `stagedAlter` and `stagedOctave` from the held value, then `onchange(undefined)`; `setOctave` (`:93-96`) sets `stagedOctave` | yes |
| `voice/note-picker.ts:54` | `export function clefForVoiceType(voiceType?: string): PickerClef \| null` (the declaration is at `:54`) | yes |
| `voice/note-picker.ts:35` | `bass: 3 * 7 + DIATONIC.D, // D3` | yes |
| `voice/DescribeVoice.svelte:62`, `:67` | `<NotePicker` at `:62`; `{voiceType}` passed at `:67` | yes |
| `voice/VoiceTypeIntake.svelte:10`, `:129`, `:147` | `InsightsIntake.svelte` named at `:10` and `:129`; `.charx-heading` named at `:147` | yes |
| `voice/VoiceTypeIntake.svelte:65`, `:88` | `.vt-legend` used on both | yes (the rule at `:148` is live) |
| `voice/intake-symbols.ts:5` | names `InsightsIntake.svelte` | yes |
| `components/Drawer/Drawer.svelte:406`, `:407` | `if (restoreQueued) restoreYields = true;` then `const head = el.querySelector(...)` | yes |
| `components/Drawer/Drawer.svelte` size | 1,986 lines; ceiling 1,990 (`scripts/ratchets.json:15`) | yes, 4 free |
| `tools/n200-score/vitest.config.ts:7`, `:32` | unfiltered command at `:7` (the filtered one at `:9`); `include` at `:32` lists all eight files | yes |
| `burg-fixtures.ts:18` | `havePython` | yes |

## One mount of `NotePicker`

Confirmed. `grep -rn NotePicker --include=*.svelte` finds `NotePicker` mounted once, `voice/DescribeVoice.svelte:62`, inside the `picker` snippet. The snippet is rendered six times (`:76`, `:77`, `:85`, `:86`, `:94`, `:95`). The only other file naming it is `components/Drawer/IntakePanel.svelte:834`, in a comment.

## Established for Step 3

The config does see the file filter on the command line. With a scratch config (outside the repository) that printed `process.argv`, `vitest run --config <file> score.run.ts` printed `["run","--config","<file>","score.run.ts"]`. So `vitest.config.ts` can read `process.argv` for a `*.run.ts` name. I ran vitest through `apps/web/node_modules/.bin/vitest`, not `pnpm exec`, per `ENVIRONMENT.md` ("VITEST THROUGH PNPM HANGS IN A CLOUD WORKSPACE"). Whether `pnpm --filter @ilya/web exec vitest` passes argv the same way is NOT ESTABLISHED; I did not run it.

## Could not establish

- The gate counts on this tip, as measured here (not run, by the desk rule).
- Whether `pnpm exec vitest` hangs in this container (not run).
