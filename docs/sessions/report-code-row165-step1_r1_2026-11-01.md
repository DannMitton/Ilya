# Report: row 165, step 1, the tokens (r1, 2026-11-01)

Branch `cloud-lane-23`. Files changed: `apps/web/src/app.css`, `apps/web/src/lib/omr/wait.test.ts`, `apps/web/src/lib/voice/pacifier/contrast.ts`, `apps/web/src/lib/voice/pacifier/contrast.test.ts`, `scripts/ratchets.json`.

## What changed

- `app.css` now holds all 30 ratified family tokens (five families times band, desk, head, wash, jewel, ink), copied from `docs/sessions/palette-ratified_2026-10-30.css`. The old family-band, desk, wash, chip, and ink blocks, and the stale comments over them, are deleted. `--umber*` is renamed `--slate*` (the review's DESK DEFAULT from Dann's 2026-11-01 12:00 ruling): **the rename is done in the tokens; consumers move in step 2.**
- `--terracotta` is deleted (no consumer).
- **Retired names kept as aliases for this one commit only**, so the tree stays green and screens stay consistent while step 2 moves the sites: `--sage-deep` (to `--sage-jewel`), `--sage-gloss` (to `--sage-ink`), the five `--*-chip` (to `--*-jewel`), and `--umber`, `--umber-desk`, `--umber-ink`, `--umber-chip` (to the `--slate` steps). Step 2 deletes every alias after its last consumer moves. This is a sequencing choice of mine, not in the brief; the alternative was a red tree between commits.
- Consequence to know: because the aliases exist, every `var(--umber, #A38669)` style fallback is now dead code and the old hex only survives as literal text until step 2.

## Test pins re-pinned in this commit (CONTRACT §1 item 11a)

| Test | Old | New |
|---|---|---|
| `wait.test.ts` wash and desk | arithmetic (wash = band at 20 percent, desk = band at 40 percent over white) and `E6E9E3`, `EAE7EC`, `EEE5E5` | arithmetic dropped; washes `ECF0EA`, `F1EDF5`, `F3EDEE`; desks `D8E2D6`, `E2DAEB`, `E7DADD` (sage, lavender, rose) |
| `contrast.ts:126` `PALETTE.lavender` | `#9585A2` | `#9F85BC` (must equal `--lavender`; `contrast.test.ts:405-437` enforces it) |
| `contrast.test.ts:198-200` captured outline ratio | 2.28:1 | **2.14:1** |

**Worth Dann's eye:** the Pacifier's captured outline gets slightly *worse* against its band with the lighter lavender, 2.28 to 2.14. It was already an owned sub-3:1 exception (the inner edge against the white interior, 3.74:1, carries legibility, per the note at `contrast.ts:284`). That note still says "2.50:1", which was stale before this row; I left it, since it is outside the colour change. `--surround-voice #D8D0E0` is untouched, as the review asked.

## Ratchets

`InsightsPane.svelte` ceiling lowered 1351 to 760 (the audit's finding; the file is 760 lines). No ceiling raised. `pnpm ratchets` also prints that `LearnContent.svelte` (4099 to 4086) and `Loupe.svelte` (3013 to 3012) could be lowered; I did not, because steps 2 and 3 touch both and may need those lines.

## Gates after step 1

- web test: 3718 passed, 1 skipped (3719), 208 files
- web check: found 0 errors and 12 warnings in 5 files
- `pnpm ratchets`: ratchets: OK.
- The other five package suites do not read `app.css`; not re-run in this step.

## Report to the desk

- Rename `--umber` to `--slate`: done here, as the review's default said.
- Not established: whether the Pacifier's `lavender` should be the band or `--lavender-jewel` for its outline. The review and the brief do not say; I used the band (the token's own value) since the test requires `PALETTE.lavender` to equal `--lavender`.

No French changes.
