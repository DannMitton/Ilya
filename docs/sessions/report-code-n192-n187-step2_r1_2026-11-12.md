# Report: N.192 and N.187, step 2 (the parser keeps grace notes), r1, 2026-11-12

Lane `cloud-lane-50`. Built to the brief with Fable's amendments 1 to 4 and 20.

## What changed

New file `packages/score-parser/src/grace.ts` (the `GraceNote` type, and everything the parser needs to read one):
- `GraceNote = { id, principalId, after?: true, pitch, base, slash?, slurred? }` (amendments 1, 2). No measure index is stored: a grace note's bar is its principal's.
- `keepGrace` reads one `<note>` that carries `<grace/>`: the pitch, `base` from `<type>` (no `<duration>`, as homr writes them), `slash` from the attribute (`yes` true, `no` false, absent undefined), and `slurred: true` where a slur starts on it. It leaves the N.188 slur carry exactly as it was (a start goes to `slurCarry` for the next kept note, a stop to the last kept note before it), so `vocalLine` and `pairSlurs` see what they saw.
- `resolveGraces` gives each its principal and id (amendment 3): the next kept note (not a rest) in the same measure; with none, an after-grace of the last kept note in the measure (`after: true`, id `<principal>~a1`); with no kept note in the measure, the next note in the line; with none, the last note before; with no note at all, dropped with a warning. A supplied `<note id>` on a grace note is never honoured. Ids are `<principal>~g1`, `~g2`.
- `graceField` (the field the parser spreads onto the score; nothing where the file has no grace note, so a score with none is unchanged); `keepGraceNotes` (the slice's filter).
- `slash` is left undefined where the file does not say (amendment 5). The renderer will decide the default from the file's origin (step 4).

`musicxml-parser.ts` (1167 to 1164 lines; it was at its ceiling): the 12-line grace branch is now 4 lines (`keepGrace`, `return cursor`, so the cursor still does not advance and the bar-duration warning stays right). Three one-line additions carry the list (`graces` declared, passed to `readNote`, spread onto the score by `graceField`) and one import line. The "grace note skipped" warning is gone, since a grace note is no longer skipped. `resolveSuppliedIds` (`:941`) still skips grace notes; only its comment (`:930-932`) changed.

`types.ts` gains exactly one line: `graceNotes?: import('./grace').GraceNote[];` (now 1000 of 1000; the limit is inclusive). Optional, so MNX, `demo-fixture.ts`, and every test builder compile unchanged. `index.ts` exports `./grace`.

`page-layout.ts` `sliceScore`: keeps a grace note whose principal is in the slice. `transposition.ts`: `transposeScore` and `engraveInKey` move grace pitches (`engraveInKey` by the same `carrySpelling` and `fewerAccidentals` as a note); both return the same score object when nothing moves, so `graceNotes` keeps its identity (`transposition.test.ts:505` passes unchanged).

`performance-order.ts` is unchanged. A repeated bar reuses the same events by reference, and `graceNotes` is keyed by principal id, so a renderer that looks a grace note up by its principal draws it on both passes. The test for that belongs to step 4, where the renderer draws; it is listed there.

MNX (`mnx-parser.ts:862-867`) is unchanged, as the brief says (DESK DEFAULT): no singer path reads MNX grace notes today. An MNX file's grace group is still skipped with its warning.

The library fingerprint (`library/fingerprint.ts:41-50`) is unchanged (DESK DEFAULT): it hashes `vocalLine`, which grace notes do not enter, so a saved song's fingerprint is stable.

## Tests

- New `grace.test.ts` (16 tests): the fixture's eleven grace notes with their ids, the group's order, slash true and undefined, the after-grace, the lyric on a grace note (no syllable given to it or to the line), the tie across a grace note, `slurred` plus the unchanged carry onto `vocalLine` (both cases of `n188-markings.test.ts:127`), the accidental on a principal, id stability across a re-parse, no field on a file with no grace note, all four principal-rule fallbacks, a supplied id never honoured, `sliceScore`, `transposeScore`, `engraveInKey`.
- `n188-markings.test.ts:127-143` passes unchanged (amendment 1).
- `musicxml-parser.test.ts:891-897`: test renamed ("... neither becomes a vocal line event"), its assertion on `vocalLine` unchanged.
- `offers-for-a-bar.test.ts:147-156`: renamed, assertion unchanged.
- `n192-n187-fixtures.test.ts`: the grace test now asserts 11 grace notes and no bar-duration mismatch.

## Gate counts after this step

| Gate | Result |
|---|---|
| score-parser | 802 passed, 5 skipped (807), 37 files (from 785; +17) |
| web (the three directories this change can reach: `src/lib/score`, `omr`, `library`) | all pass after the two fixes below; the whole web suite runs at step 7 and each later step that touches the web |
| svelte-check | 0 errors, 12 warnings (baseline 0 and 12) |
| ratchets | OK |
| phonology, dictionary, blurb, integration | not run; no file they read changed |

Two faults of my own, found by the web run and fixed in this step: (1) a rename in `offers-for-a-bar.test.ts` that put an apostrophe inside a single-quoted string; (2) the head comment of `grace-notes.musicxml` contained literal `<grace/>` text, and `fixture-rule.test.ts` (which tracks every `*.musicxml` and detects the format from the first tag) took it for the root element. The comment now spells the elements in words. `key-changes.musicxml` was never affected.

Pre-existing, not mine: `tsc --noEmit -p packages/score-parser` reports one error at `row141-tacet-run.test.ts:80` (`{}` where `finalBarline` is required). svelte-check, which is the CI gate, does not check packages, and the file is untouched by this lane.

## What I could not establish

- Whether any other consumer reads `ParsedScore` by spread in a way that drops `graceNotes` (each consumer that does is on the brief's list: `sliceScore`, `transposeScore`, `engraveInKey`, `rebar`, `applyCorrections`; the last two are step 6).
- The browser. Nothing in this step draws.
