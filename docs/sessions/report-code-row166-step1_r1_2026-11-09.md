# Report: row 166, step 1, the placeholder profile (Code, cloud lane, r1, 2026-11-09)

Branch `cloud-lane-39`. Brief: `docs/sessions/brief-code-row166-generic-profiles_r2_2026-11-09.md`, step 1. Step 0 report: `report-code-row166-step0_r1_2026-11-09.md`.

## What changed

- `apps/web/src/lib/voice/engine/stand-ins.ts`: new `PLACEHOLDER_PROFILE_TYPES` (soprano, mezzo-soprano, tenor, baritone, bass) and `hasPlaceholderProfile(voiceType)`, matched as `standInBucket` matches (trimmed, lower-cased). Contralto, countertenor, bass-baritone, "Not sure", and no type are left out, the comment says row 167 lifts it, and flags it DESK DEFAULT.
- `apps/web/src/lib/analysis/analyze-score-adapter.ts`: `buildVoiceProfileSnapshot` calls `fillStandIns` when a vowel is sung (as before) **or** when none is sung and the type is one of the five. `AdaptedProfile.generic: boolean`, always set; its comment says it is a view of `standIns`, computed per snapshot and never stored (`CONTRACT.md` §8, "Do not store anything derived"). Range, tessitura, and passaggio are untouched (typed or absent).
- `apps/web/src/lib/analysis/stand-ins-snapshot.test.ts`: the old test "adds nothing to a voice with no sung vowel" used `'bass'`, which is now an eligible type, so it uses `'contralto'`. New describe "a declared voice type with nothing sung (row 166)".

## Tests added (all pass)

- Each of the five ids: `generic: true`, `completeness.formants` true, ten vowels, every `fR1Source` `'surrogate'`, the six Bozeman values equal the template's `f1` and `f2` for the id's bucket (soprano; mezzo and tenor share tenor-mezzo; baritone; bass), steps all `'template'` bar the four derived, `retake` empty.
- Contralto, countertenor, bass-baritone, "not-sure", an unknown string, and `undefined`: empty `fR1` and `fR1Source`, no `standIns`, `generic: false`, `completeness.formants` false.
- One sung vowel (baritone, [u] at 330 Hz): `generic: false`, [u] stays sung, [i] is a `'shift'` stand-in, today's fit.
- No typed range, tessitura, or passaggio: all absent, completeness `{formants: true, range: false, tessitura: false, passaggio: false}`.
- A voice whose only reading the guard fails (1063 Hz [i], bass): treated as nothing sung, takes the placeholders, `generic: true`, and the `retake` list carries `{vowel: 'i', reason: 'implausible'}`.

Run: `pnpm --filter @ilya/web exec vitest run src/lib/analysis src/lib/voice`: 22 files, 419 tests, pass. (That run took 427 s, almost all of it module import in this sandbox, not the tests.)

## Gates after step 1

Reported after the full run at the end of the step 2 commit; at this commit I ran the two touched directories above and the web type check (`pnpm --filter @ilya/web check`). See the step 2 report for all eight.

## What Code could not establish

- **A guard-failed voice is `generic: true`.** The brief says "where no vowel is sung". A voice whose every reading the plausibility guard rejects has no sung fR1, so by the brief's test it is generic. I chose to follow the brief's test and report the case. Whether Dann wants such a singer told "placeholder" (true: the numbers are placeholders) or left on the withheld page (today's behaviour) is his call.
- **Whether `generic` should be required or optional on `AdaptedProfile`.** I made it required; `MarkupPane` and `InsightsPane` are the only constructors' callers, and a literal elsewhere would fail the type check (reported in step 2).
