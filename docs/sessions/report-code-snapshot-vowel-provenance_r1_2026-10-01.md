# Report: the snapshot says where each vowel's number came from (r1)

**QUEUE row 12, state: WRITTEN, pushed to `cloud-lane`.** The "after Dann reads it" gate on this row was dropped by the desk (2026-10-11). The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-11, for `docs/sessions/brief-code-snapshot-vowel-provenance_r1_2026-10-01.md`, on `cloud-lane` after row 11, clean tree before the first edit. One commit on `cloud-lane`, under Dann's instruction for this session; nothing pushed to `Shane` or `main`, no pull request.

## The change

- `packages/score-parser/src/analysis-types.ts`: `VoiceProfileSnapshot` gains `fR1Source?` and `fR2Source?`, each `Record<string, 'sung' | 'derived' | 'surrogate'>`, beside `fR1` and `fR2`, with a doc comment naming Dann's ruling of 2026-09-16 (`INBOX.md:179`). Optional, so no caller changes.
- `apps/web/src/lib/analysis/analyze-score-adapter.ts`, `buildVoiceProfileSnapshot`: `'sung'` is written in the measured loops, `'derived'` in the `deriveFrom` loop, at the same line that writes each number. `'surrogate'` is written nowhere: the surrogate values are not ruled.
- **fR2 mirrored.** It cost no new branch: each source is set inside the branch that already writes the number. `fR2Source` travels with `fR2` and is absent when `fR2` is.

Since row 11, the measured loops read the judged copy (`judgeUnchecked`), so "sung" means a reading the singer sang that the guard did not fail.

## Tests (`apps/web/src/lib/analysis/analyze-score-adapter.test.ts`, +4)

- Every key of `fR1` has one in `fR1Source` and none is extra; the same for `fR2` and `fR2Source`.
- A derived [ɨ] reads `'derived'` in both; the sung anchors read `'sung'`.
- A sung [ɨ] reads `'sung'`, and its number is the sung one (360), not a derived one.
- No source reads `'surrogate'`.

No existing test changed.

## The eight gates

All pass. Gate 4: 2135 → **2139** (+4). Gate 5 (score-parser, the type's package): 653 passed and 5 skipped (658), unchanged. The rest as row 11 left them.

## Could not establish

- **Who reads it.** Nothing downstream reads `fR1Source` yet; the flag's display waits on the surrogate ruling (`memo-overnight-A11-A14_r1_2026-10-01.md`, A14).
