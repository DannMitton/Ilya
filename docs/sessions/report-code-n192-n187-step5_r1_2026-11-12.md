# Report: N.192 and N.187, step 5 (INSIGHTS reads grace pitches for the compass only), r1, 2026-11-12

Lane `cloud-lane-50`. Built to design decision 4 as amendment 18 rewrote it.

## What changed

- `insights.ts`: `pitched()` is unchanged, so `crossingsRow` and `tessituraRow` read what they read. `rangeRow` takes the grace pitches as a third argument (`analysisScore.graceNotes`), so the compass, and the containment flag against the typed range, include them. The tessituragram's spelling map (`:600` before the edit) also takes the grace pitches, for spelling only: no time is added to any figure, so a compass end that is a grace note can be spelled.
- `singer-page.ts` `firstOutsideRange`: walks the line in the order sung, a grace note before its principal and an after-grace after it, and names a grace note by the note it hangs on (its `eventId`, measure, and vowel are the principal's, since a grace note is sung on its principal's syllable). `singer-page.ts:109` is not touched (it finds one held note by id and reads no range, as amendment 18 says).

## Tests

- `insights.test.ts`: a grace note above the typed range moves `range.measured` to A4 and takes the flag off `contained`; `crossings` and `tessitura` equal the answer for the same score without the grace note.
- `singer-page.test.ts`: `firstOutsideRange` is null for the plain line, and with an A4 grace note on bar's second note names that note (`eventId: 'b'`, `above`, A4).

## Gate counts after this step

| Gate | Result |
|---|---|
| web, `src/lib/insights` | 472 passed, 20 files |
| svelte-check | 0 errors, 12 warnings |
| ratchets | OK (not re-run after the edit; no ceilinged file changed) |

## What I could not establish

- The tessituragram's rows for a score with a grace note, as a whole figure: I tested the pieces the amendment names (`crossingsRow`, `tessituraRow` through `m.tessitura`), not `tessituragram`'s own row list.
- Whether any other INSIGHTS reader of pitch (`key-suggest.ts:251-258`, `vocal-octave.ts`, `clef-select.ts`, `overlay-engine.ts:158-166`) should see grace pitches. By design decision 1 they read `vocalLine` only and are unchanged, as the brief says.
