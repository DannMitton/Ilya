# Report, lane 71, step 1: the gate widens to eight, and the stale comments are repaired

2026-11-19. Branch `cloud-lane-71`, on `79e0ed28` (step 0) plus this step. Brief section 2. Paths are under `apps/web/src/lib/`.

## 1. The change

**`voice/engine/stand-ins.ts:64-73`.** `PLACEHOLDER_PROFILE_TYPES` is now, in the order of `TIER1` (`voiceTypes.ts:19-29`) without `not-sure`: `soprano`, `mezzo-soprano`, `contralto`, `countertenor`, `tenor`, `baritone`, `bass-baritone`, `bass`. Eight. `not-sure` and no type stay out. The comment above it now cites sections 1 and 8 of `docs/sessions/ratified-voice-type-stand-ins_2026-11-19.md` in place of row 167's absence, says the three borrow, says "Not sure" and no type take no starting profile because an average of five staves corresponds to no vocal tract, and says the five-staff average stays in `template('middle')` as the chart's drawing ground and the partly sampled fill (brief preamble, Dann's 13:58 ruling). `hasPlaceholderProfile` (`:76` before, now a few lines lower) is untouched, and no second gate was added anywhere.

**Comments repaired, each in this commit** (brief section 2's list, every one):

| Site | Now says |
| --- | --- |
| `voice/engine/resolve-values.ts:14-18` | eight types have a placeholder profile; "Not sure" and no type keep the page that says nothing was measured; cites rows 166 and 167 and sections 1 and 8 |
| `voice/engine/resolve-values.ts:148-152` | the same, with the three borrowing a neighbour's staff and the pages saying so |
| `analysis/analyze-score-adapter.ts:66-71` | `generic` is false for "Not sure" and no type; the eight declared types have a profile |
| `insights/identity.ts:55` (`placeholderLabel`) | "Not sure" and no type never reach it, because `generic` is false for them |
| `insights/identity.ts:63-64` | `generic` is the eight declared types' placeholder values; "neither" is "Not sure", no type, or an id this build does not know. The brief's "three move now, not four" is carried by the list, which no longer names contralto, countertenor, or bass-baritone as "neither" |
| `insights/singer-blocks.ts:116` | `undefined` for any voice not on placeholders, and for "Not sure" and no type |
| `components/Drawer/voice-pane.ts:77-79` | the door opens for a stored reading or any of the eight; shut for "Not sure" and no type; cites brief r4 section 4.6 |
| `i18n.ts:1894` | "one of eight types" (was "one of five types") |
| `i18n.ts:1903` | "no placeholder profile ("Not sure" or no type)" (was "no generic values") |
| `voice/chart/screen-logic.ts:29` | no longer says the placeholder "says 'your voice type'"; says `hasDeclaredType` is not the test for "undeclared". **It also says `borrowedStaffLabel` now chooses the capture hint, which is true only after Step 6** (brief 4.10). I wrote the comment for the end state; at this commit the sentence runs ahead of the code |
| `voice/chart/zones.ts:21-23` | the chart shows a placeholder for every voice, including the two cases the adapter withholds ("Not sure", no type) |
| `voice/engine/stand-ins.ts:64-72` | as above |

No string a singer reads changed. The only `i18n.ts` edits are two comments. No `bucketFor` change (`plausibility.ts` untouched), no formula change, and `template` is untouched.

## 2. What broke, as brief section 7 expected

Run from `apps/web`: `pnpm exec vitest run --reporter=json --outputFile=...` (5 minutes of the whole suite).

`6675 passed | 12 failed | 5 skipped (6692)`. The twelve, by file:

- `analysis/adapter-golden.test.ts`: 1 (the golden, byte for byte). Step 7 regenerates it on purpose.
- `analysis/stand-ins-snapshot.test.ts`: 5 (the three "today's empty profile, generic false" rows for contralto, countertenor, bass-baritone; "a sung value off the shape adds nothing to a voice with no sung vowel and no placeholder type"; "one to four stable core vowels sampled")
- `insights/identity.test.ts`: 1 ("the three states, from real profiles")
- `components/Drawer/voice-pane.test.ts`: 3 ("a type with none"; "elides « de » before a vowel in French"; "the doors ... for a stored reading or a type with generic values")
- `voice/engine/resolve-values.test.ts`: 2 ("withholds stand-ins from a voice that has sung nothing and is n..."; "always gives every voice ... and still says generic only for the fi...")

Every one of those files is named in brief section 7's list. **Brief section 7 names more files than failed:** `insights/ratified-lines.test.ts:422-438`, `analysis/analyze-score-adapter.test.ts:467-468`, `voice/chart/screen-logic.test.ts:45`, `voice/chart/ratified-strings.test.ts`, `e2e/*`, and `insights/identity.test.ts:68` and `:96` did not fail in this run (e2e is Playwright and was not run). Whether they pin the old behaviour, or pin the old text that Steps 3 to 6 change, is not read here. Step 7 reads each. The tree is red between Step 1 and Step 7 by the brief's order.

## 3. Gates at this step

Run: gate 3 (`svelte-check found 0 errors and 12 warnings in 5 files`, equal to the Step 0 baseline), gate 4 as above, gate 8 (`ratchets: OK.`, the same nine "could be lowered" notices as Step 0, none for a file this step touched; no ratchet moved). Gates 1, 2, 5, 6, and 7 were not re-run: this step changes no file they read (`git diff --stat` lists only files under `apps/web/src/lib/`; gate 7 reading `apps/web` is NOT ESTABLISHED).

## NOT ESTABLISHED

1. Whether any unit test outside `apps/web` or any Playwright test reads `PLACEHOLDER_PROFILE_TYPES` or `hasPlaceholderProfile` (the Playwright suite was not run; gate 7 was not re-run).
2. Whether `knip` or another tool flags anything because of this step. None was run.
3. That the list of comments in brief section 2 is complete. I repaired the ones it names; `grep` for other statements of "five types" or the withheld list was not run in this step.
4. Which of the seven section-7 test sites that did not fail pin old behaviour. Step 7 reads each.
