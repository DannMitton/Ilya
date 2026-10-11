# Report: no vowel left blank, stand-in values from Bozeman's staff fitted to the singer (r1)

**QUEUE row 17, state: WRITTEN, pushed to `cloud-lane`. Markup and Insights now compute on stand-ins for every vowel a singer has not sung; Dann should know that before he next opens a partly calibrated voice.** The "after Dann reads it" gate on this row was dropped by the desk (2026-10-11). The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-11, for `docs/sessions/brief-code-stand-in-vowels_r1_2026-10-01.md`, after row 12 as it requires, clean tree before the first edit. One commit on `cloud-lane`, under Dann's instruction for this session; nothing pushed to `Shane` or `main`, no pull request.

## What it does

`apps/web/src/lib/voice/engine/stand-ins.ts` (new), Dann's ruling of 2026-10-01 02:56 step by step:

1. **Starting staff** (`standInBucket`, a function of its own; the guard's `bucketFor` is untouched): Soprano → soprano; Mezzo-soprano, Contralto, Tenor, Countertenor → tenor-mezzo (countertenor commented as DESK INFERENCE, by the tract, as the ruling flags it); Baritone → baritone; Bass, Bass-baritone → bass; Not sure or none → the middle. **Template fR1** per Bozeman vowel: the geometric centre of the bucket's `CORE_BANDS` band.
2. **Template fR2, DESK DEFAULT, flagged:** Mitton (2020) Table 5.3's fR2 for the six Bozeman vowels (1705, 1532, 1311, 1013, 826, 804 Hz), scaled into the bucket by the geometric mean of the bucket's fR1 template over the bass bucket's.
3. **One or two sung vowels:** every unsung value slides by the mean log offset of the sung ones from their templates, per resonance (uniform scaling; Anikin, Barreda & Reby 2024).
4. **Three or more spanning the arc** (one of [i] or [e], one of [ɛ] or [ɑ], one of [o] or [u]): a spread is also fitted per resonance, the least-squares slope in log frequency about the means. Commented as the desk's extension, ruled in 2026-10-01 02:56.
5. **A sung value is never replaced.** Sung beats derived beats surrogate; every stand-in writes `'surrogate'` into row 12's `fR1Source` and `fR2Source`, and the step that made it (`template`, `shift`, `shift-and-spread`, or `derived`) into the report's `steps`.
6. **Off the shape:** after a fit with three or more sung vowels, the worst sung vowel more than 3 semitones (the guard's floor margin) from its fitted value leaves the fit, which runs again until none is. It is reported as a retake candidate; its stored reading and its sung value stand.
7. **Derived vowels** ([ɨ], [ɪ], [ʌ], [a]) derive from whatever anchors stand once the gaps are filled; one built on a stand-in anchor is `'surrogate'`.
8. **Computed per snapshot, never stored.**

`apps/web/src/lib/analysis/analyze-score-adapter.ts`: `buildVoiceProfileSnapshot` takes the declared voice type (a new last parameter) and calls `fillStandIns` after the sung and derived loops. Its result carries `standIns` (the bucket, the steps, and `retake`: the off-shape vowels and the vowels the guard failed). `MarkupPane.svelte` gains a `voiceType` prop and `+page.svelte` passes it (on an existing line; `+page.svelte` stays at 6,002 lines); `InsightsPane.svelte` passes the voice type it already had. `plausibility.ts` now exports `CORE_BANDS` and `BozemanVowel`, unchanged.

## DESK DEFAULTS taken

- **A voice with no sung vowel gets no stand-ins in its snapshot.** The function fills all ten from nothing (tested), but the snapshot calls it only once a vowel is sung, so a singer who has not calibrated keeps the page that says nothing was measured. Filling a blank voice with Bozeman's norms would print findings about nobody.
- **"Not sure" is the middle of all five staves**, as Dann's ruling words it, with the tenor-mezzo set counted for Mezzo and for Tenor. The brief wrote "the four"; the two differ slightly.
- **With exactly two sung vowels nothing is excluded as off the shape:** two points cannot say which of them is wrong.
- **Off-shape is judged on fR1 only.**
- **The retake list is data only.** The brief says to expose it to the calibration summary; drawing it needs words and a design, which the brief puts out of scope ("the interface flag ... is a design question for Dann"). `standIns.retake` is there for that step.

## Tests

- `apps/web/src/lib/voice/engine/stand-ins.test.ts` (new, 8): each voice type picks its staff; the templates are the bands' geometric centres and Mitton's fR2 scaled; all ten vowels filled from zero, one, two, and five sung; sung values untouched; a derivation on a stand-in anchor is a stand-in; the two-vowel shift equals the mean log offset; three vowels across the arc recover a synthetic profile built from a known shift and spread (1.3); three that do not span use a shift alone.
- `apps/web/src/lib/analysis/stand-ins-snapshot.test.ts` (new, 3): an unjudged 1063 Hz [i] (row 11's case) is failed by the guard, replaced by a stand-in, and reported for a retake; a KEPT 1063 Hz [i] stays sung, leaves the fit, and is reported off the shape by more than 3 semitones; a voice with nothing sung gets nothing. These live in `analysis/` because the module map forbids `voice/` to import from it.
- **Existing tests changed: 13**, all in `analyze-score-adapter.test.ts`, and all for one reason: they asserted that an unsung vowel stays blank, which the ruling ends. Each now reads the sung and derived values alone (two helpers, `own` and `own2`), so what it tests is unchanged: an implausible reading is excluded, a derivation is gated on its anchors, an absent f2 contributes nothing. One of row 12's tests, "writes no surrogate", became "writes a surrogate only where nothing was sung or derived".

## The eight gates

All pass. Gate 4: 2139 → **2150** (+11, the two new files). The rest as row 12 left them: 251; 242; 0 errors and 12 warnings in 5 files; 653 passed and 5 skipped (658); 145; 55; ratchets OK.

## For Dann

**This changes what Markup and Insights compute** for any singer who has sung some vowels and not all ten: the missing vowels now carry stand-in numbers, and the analysis draws marks and comments on them. Nothing on the page says which are stand-ins yet; that flag is the design question the brief leaves to you. A singer who has sung all ten, as every voice in this lane's pictures has, sees no change.

## Could not establish

- **Bozeman's 2013 page itself.** The bands are `plausibility.ts`'s, which the desk compared with the 2013 page on 2026-10-01; this session has not seen the page or Mitton's Table 5.3, and carries the brief's figures.
- **Whether the fitted values are good for real voices.** No singer's data was run. The method's numbers are the ruling's; their accuracy on Dann's voice is NOT ESTABLISHED.
- **The [ɨ] exception.** The ruling keeps the existing derivations pending the desk's reading of the dissertation on velar-i; nothing here models [ɨ]'s break from the diagonal.
