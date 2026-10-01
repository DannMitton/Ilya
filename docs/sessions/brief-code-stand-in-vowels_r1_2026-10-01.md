# Brief to Code: no vowel left blank. Stand-in values from Bozeman's staff, fitted to the singer

From the desk, 2026-10-01 03:30. No git writes. Gates before and after. **Runs after `QUEUE.md` row 12** (the snapshot's per-vowel provenance), which this brief writes into.

## The rulings
- Dann, 2026-09-16 (`docs/memory/PRODUCT.md`, "Ten vowels, Grayson's, and no others"; `docs/memory/INBOX.md`, "complete set of Grayson's ten"): no vowel is ever blank; a gap is filled from Bozeman, flagged, until the singer sings it.
- Dann, 2026-10-01 02:56 (`docs/memory/OPEN.md`, "THE STAND-IN VOWEL VALUES"): the method below, with the voice-type mapping. It amends the 2026-09-16 clause that voice type plays no part in choosing values.

## What the desk established tonight
- **Bozeman's five staves** ("Approximate First Formant Locations", *Practical Vocal Acoustics*, 2013; PDF from kenbozeman.com, embedded scan 2550 × 3300 px, copy at `~/Downloads/bozeman-1st-formant-locations.pdf`). The desk measured every turning-pitch notehead's staff position by script and read the accidentals by eye: **the Mezzo Soprano and Tenor staves agree in staff position on all seven vowels, and differ in accidentals only on [ɔ]** (flat on the tenor staff, none on the mezzo). Ilya does not use [ɔ] (`plausibility.ts:42-45`). So Ilya's merged `'tenor-mezzo'` bucket (`plausibility.ts:61`) is faithful to the 2013 page for Ilya's vowels; do not split it.
- **Bozeman charts fR1 only.** There is no fR2 in Ilya's Bozeman data (`plausibility.ts:50-91`; overnight memo A14). The fR2 template below is a DESK DEFAULT, flagged.
- **The shape, read in the primary source.** Mitton 2020, Table 5.3 (p. 81) and Fig. 5.2 (p. 82), photographed pages sent by Dann 2026-10-01 03:06 and read by the desk. In his close-to-open order [i] [e] [ɪ] [ɨ] [ɛ] [a] [ɑ] [ʌ] [o] [u], fR1 runs 296, 381, 393, 404, 577, 711, 617, 616, 489, 346 Hz (the arc, peaking at [a]); fR2 runs 1705, 1532, 1600, 1100, 1311, 1113, 1013, 1167, 826, 804 Hz (the descending diagonal). **[ɨ] breaks the diagonal** (fR2 1100, below [ɛ]'s 1311), as Dann said; [ɪ] and [ʌ] also sit a little off it (1600 above [e]'s 1532; 1167 above [ɑ]'s 1013). p. 83: [ɪ], [ɨ], [a], [ʌ] "make no appearance in Bozeman's work". `derivations.ts` already derives those four from anchors; keep that.
- **The 2013 page is the source Dann's thesis used.** His Fig. 5.4 (p. 83), "Bozeman's bass pitches of turning", carries the same accidentals as the 2013 page's Bass staff ([ɛ] double flat, [ɑ] natural-flat, [ɔ] natural, [o] double flat), read by the desk on both.

## The work
1. **Starting staff (fR1).** A new function, not `bucketFor` (the guard keeps its own routing): Soprano → `soprano`; Mezzo-soprano, Contralto, Tenor, Countertenor → `tenor-mezzo`; Baritone → `baritone`; Bass, Bass-baritone → `bass`; Not sure or none → the geometric middle of the four. Template value per Bozeman vowel = the geometric centre of that bucket's `CORE_BANDS` band. Countertenor's mapping is DESK INFERENCE (by the tract); comment it so.
2. **Starting shape (fR2), DESK DEFAULT.** Mitton 2020 Table 5.3's fR2 for the six Bozeman vowels, scaled into the chosen bucket by the ratio of that bucket's fR1 template to the bass bucket's, vowel-wise geometric mean (uniform scaling, below). Flag as `surrogate`, with the method in the doc comment.
3. **One or two sung vowels:** shift every unsung template value by the mean log offset of the sung vowels from their templates, per resonance (fR1 offsets move fR1, fR2 offsets move fR2). Source: uniform scaling, Anikin, Barreda & Reby 2024, *Behavior Research Methods* 56(6): 5588-5604.
4. **Three or more sung vowels spanning the arc** (at least one of [i] or [e], one of [ɛ] or [ɑ], one of [o] or [u]): also fit a spread factor per resonance (the arc's height for fR1, the diagonal's slope for fR2) by least squares in log frequency about the mean. Comment it as the desk's extension, ruled in by Dann 2026-10-01 02:56.
5. **A sung value is never replaced.** Sung beats derived beats surrogate. Every stand-in writes `'surrogate'` into row 12's provenance map.
6. **Off-shape readings:** after the fit, a sung vowel more than 3 semitones from its fitted value is reported, not absorbed: exclude it from the fit and expose it to the calibration summary as a retake candidate. Do not change any stored reading. The threshold is a DESK DEFAULT matching the guard's floor margin (`plausibility.ts:125`).
7. **Derived vowels** ([ɨ], [ɪ], [ʌ], [a]) derive from the best available anchors, sung or surrogate; a derivation from a surrogate anchor is itself `surrogate`.
8. Computed at snapshot time, never stored (`CONTRACT.md` §6: do not store anything derived).

## Not in this brief
The interface flag for a stand-in (what Markup and Insights show). That is a design question for Dann once values exist.

## Tests
Each voice type picks its bucket; no vowel blank with zero, one, two, and five sung vowels; sung values untouched; a 1063 Hz [i] is excluded and reported; derived-from-surrogate is flagged `surrogate`; the two-vowel shift equals the mean log offset; the three-vowel fit reproduces a synthetic profile built from known shift and spread.

**Report:** `docs/sessions/report-code-stand-in-vowels_r1_2026-10-01.md`.
