# Brief to Code: the snapshot says where each vowel's number came from

From the desk, 2026-10-01. No git writes. Gates before and after.

**The ruling:** Dann, 2026-09-16 (`docs/memory/INBOX.md:179`, unplaced): Ilya operates on a complete set of Grayson's ten sung vowels; any gap is filled from Bozeman's values, FLAGGED, and placed on a continuum; the profile is a hybrid of sung, derived, and surrogate values. The surrogate values themselves wait on Dann (see `memo-overnight-A11-A14_r1_2026-10-01.md`, A14). This brief builds only the flag's channel, which every later step needs and which no ruling constrains.

**What is built today, read 2026-10-01:**
- The snapshot carries `fR1: Record<string, number>` and optional `fR2`, with no per-vowel provenance (`packages/score-parser/src/analysis-types.ts:39-56`).
- `buildVoiceProfileSnapshot` fills fR1 from measured readings (`apps/web/src/lib/analysis/analyze-score-adapter.ts:131-138`) and then from `deriveFrom` for the four derivable vowels (`:190-199`). A vowel with neither is omitted; the comment at `:107-109` calls the omission honest. Nothing downstream can tell a sung number from a derived one.
- `'bozeman-table'` exists as a `CalibratedFormant.source` (`apps/web/src/lib/voice/engine/types.ts:93`) and nothing writes or reads it.

**The work:**
- Add `fR1Source?: Record<string, 'sung' | 'derived' | 'surrogate'>` to `VoiceProfileSnapshot`, beside `fR1`, with a doc comment naming the 2026-09-16 ruling. Optional, so no caller changes.
- Fill it in `buildVoiceProfileSnapshot`: `'sung'` from the measured loop, `'derived'` from the `deriveFrom` loop. Write `'surrogate'` nowhere yet; the value is the only thing that would be surrogate and it is not ruled.
- Mirror the two existing cases into `fR2Source?` only if it costs no new branch; otherwise leave fR2 alone and say so in the report.

**Tests** (`apps/web/src/lib/analysis/analyze-score-adapter.test.ts`): every key of `fR1` has a key in `fR1Source`, and no key of `fR1Source` lacks one in `fR1`; a sung [ɨ] reads `'sung'` and displaces no derived one; a derived [ɨ] reads `'derived'`. `pnpm -C apps/web test` and `pnpm -C apps/web check` clean before and after (`apps/web/package.json:13-14`); run the score-parser package tests too (`package.json:7`).

**Report:** `docs/sessions/report-code-snapshot-vowel-provenance_r1_2026-10-01.md`.
