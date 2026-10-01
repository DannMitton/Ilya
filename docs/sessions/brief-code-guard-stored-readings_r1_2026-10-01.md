# Brief to Code: a stored reading the guard never judged gets its verdict before it anchors anything

From the desk, 2026-10-01. No git writes. Gates before and after.

**The reason:** INBOX "I.N.110 candidate" (desk, 2026-09-02). Dann's own profile carried an [i] fR1 of 1063 Hz marked Provisional with no plausibility verdict. It passed the snapshot's gate and every [i]-anchored derivation ([ɨ], [ɪ]) inherited it, so Markup drew [i] turning heads near B4. The §B.4 ruling (Dann, 2026-07-15) says Markup will not build acoustic marks on a number the engine has already decided cannot be that vowel. Today the engine only decides that at capture.

**The fault, read 2026-10-01:**
- The guard runs once, in the wizard, on a just-captured reading: `apps/web/src/lib/voice/CalibrationWizard.svelte:308` (`withPlausibility`), called from `:786`. No other caller of `checkPlausibility` exists outside tests.
- The snapshot's gate is `isUsable` (`apps/web/src/lib/voice/engine/plausibility.ts:275-277`): it fails a reading only when `plausibility === 'implausible'`. A reading with `plausibility` undefined passes (`apps/web/src/lib/analysis/analyze-score-adapter.ts:131-138`, comment at `:126-128` calls this "unchecked is kept").
- The derivation gate is the same test, inlined (`apps/web/src/lib/voice/engine/derivations.ts:77-86`, `usableAnchor`), so an unjudged anchor also feeds `deriveFrom` (`analyze-score-adapter.ts:190-199`).
- The E.26 note at `CalibrationWizard.svelte:831-838` records a build (b6d2828) in which every stored reading had `plausibility` undefined. Profiles from that era may still be in singers' browsers.

**The work:** in `buildVoiceProfileSnapshot`, before the fR1 and fR2 loops, compute a verdict for every measured reading whose `plausibility` is undefined, and use the judged copy for the loops and for `deriveFrom`. Computed per snapshot, never written to the stored profile (the standing rule, `analyze-score-adapter.ts:174-178`).
- Call `checkPlausibility(f.f1, vowel, undefined, anchorF1s)` with NO voice type, so the union bands apply. Dann ruled 2026-09-16 (INBOX `:179`) that a declared voice type plays no part in choosing values; the union bands are the widest window and still fail 1063 Hz for [i] (union [i] ceiling is 440 Hz, `plausibility.ts:96-108` over `CORE_BANDS`, plus the ceiling margin at `:127`).
- Build `anchorF1s` from the readings that already carry a verdict other than implausible, Bozeman vowels first, so an anchor-derived window for [ɨ], [ɪ], [a], [ʌ] never rests on an unjudged anchor. Two passes: judge the six Bozeman vowels, then the four anchor-derived ones.
- A reading with `plausibilityOverride === true` keeps its stored state and is not re-judged (`plausibility.ts:285-287`, "Keep my reading").
- Put the judging in one exported helper in `analyze-score-adapter.ts` (suggested name `judgeUnchecked`) so the test can reach it. Do not touch the wizard, `outside.ts`, or the roster; their stored-verdict reads are a separate question.

**Tests** (`apps/web/src/lib/analysis/analyze-score-adapter.test.ts`):
- Rewrite the case at `:131` ("keeps readings the guard never judged"): an unjudged reading INSIDE the union window is kept; an unjudged [i] at 1063 Hz is dropped from fR1 and fR2.
- An unjudged [i] at 1063 Hz yields no derived [ɨ] or [ɪ].
- An unjudged reading with `plausibilityOverride: true` is kept unchanged.
- The stored `formants` object handed in is not mutated.
- `pnpm -C apps/web test` and `pnpm -C apps/web check` clean before and after (`apps/web/package.json:13-14`).

**Report:** `docs/sessions/report-code-guard-stored-readings_r1_2026-10-01.md`. Say how many existing tests changed and why.
