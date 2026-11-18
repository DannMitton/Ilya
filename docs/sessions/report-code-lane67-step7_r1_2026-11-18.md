# Report: lane 67, Step 7 (the far-off [ɨ] choice)

2026-11-18, Code (cloud session), branch `cloud-lane-67`. Paths under `apps/web/src/lib/` unless they begin with `docs/`. The ruling: 2026-11-13 15:13, message ratified 15:29 (`docs/memory/OPEN.md:3800-3801`); the spec: `docs/sessions/brief-code-n200-voice-as-it-is_r3_2026-11-14.md:97`, with this lane's changes.

## What was done

- **The trigger**, a pure function in `voice/outside.ts`: `farOffIgh(profile)` calls `applyIghDivergence` (`voice/engine/divergence.ts`) on a clone and returns `isDivergent === true`. Only for a personal voice (`isPersonal`), a sung [ɨ] (`isSung`), and not kept (`plausibilityOverride`). The wizard's strip of `isDivergent` (`CalibrationWizard.svelte:272`) is untouched, and `divergence.ts` is not edited. The stored profile is not touched (tested).
- **The note**: `voice/OutsideNote.svelte` takes `kind` (`'unstable'`, the default, or `'igh'`) and `onuseestimate`. For `'igh'` it prints `calib.summary.outsideIgh` (ratified, unchanged) and three buttons: `calib.summary.keepOne` ("Keep it"), Re-take (`calib.common.retake`), and `calib.summary.useEstimate` ("Use Ilya's estimate for now"). `outsideNote(kind)` picks the key.
- **The mark**: `useEstimate?: true` on `CalibratedFormant` (`voice/engine/types.ts`, with its comment). `isSung` (`voice/engine/sung.ts`) returns false for a marked reading, so the count, the chart, INSIGHTS, MELODY, and the resolution all show Ilya's estimate (derived from [i] and [u]). The reading stays stored and in the take record. `markUseEstimate(profile)` in `outside.ts` returns the new profile.
- **One note per vowel**: an [ɨ] both unstable and far-off appears in the [ɨ] note only (`outsideVowels` leaves it out when `farOffIgh`).
- **What quiets the note**: Keep (`plausibilityOverride`), the mark (the reading is then not sung), or a fresh take, which replaces the reading object (`CalibrationWizard.svelte`, `commitReading`) and so carries no mark. A re-take that is less clear does not replace the reading (`i18n.ts`, the "as clear" caption), so the mark stays; this is stated in the comment on the field and pinned in a test at the pure level.
- **The wizard** (wiring only, three lines net: 1121 to 1124 of 1126): the import line widened, `farIgh` derived, `useIghEstimate()` (one line, `markUseEstimate` then `persist`), and one `<OutsideNote kind="igh" ...>` line above the unstable note. `withPlausibility` is not edited.
- **Strings**: `calib.summary.keepOne` and `calib.summary.useEstimate` as brief section 6 writes them (the English apostrophe in "Ilya's" is straight, as the table writes it). The comment on `calib.summary.outsideIgh` that said "NO READER YET" now says who reads it. The index line and the `calib.` count: 1,335 and 127.

## Tests

`voice/outside-igh.test.ts` (new, 16 tests): near and far (the 50 Hz and 100 Hz tolerances), no [ɨ], an [i] that cannot place it, below five core vowels (four core vowels: no; five: yes), purity; what quiets it (Keep, the mark, a fresh take, a less clear re-take); the mark (`isSung` false, the count drops by one, the reading stays stored, the resolution derives [ɨ] from [i] and [u]); one note per vowel (unstable and far-off in the [ɨ] note only; an unstable [u] stays in its own note beside a far-off [ɨ]); the component renders the ratified sentence and three buttons in English and French, and the unstable note keeps two buttons and its tags. `svelte-check`: 0 errors, 12 warnings.

## Comments corrected

`voice/engine/sung.ts` (the header says the mark), `i18n.ts` (the `outsideIgh` comment), `voice/outside.ts` (header and `outsideVowels`).

## What could not be established

- How often the far-off note will fire (`divergence.ts` tolerances are 50 Hz and 100 Hz; the earlier review found no count). The picture of the note with a far-off [ɨ] is made at Step 8.
- The wizard's "less clear re-take does not replace the reading" path is pinned at the pure level only; the wizard component is not mounted in a unit test here.
