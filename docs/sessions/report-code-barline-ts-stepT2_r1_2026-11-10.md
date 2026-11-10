# Report: step T2, "Rebar the notes" (Code, cloud lane 43, r1, 2026-11-10)

Ruled by Dann 2026-11-09 22:06: "completed fully for the release, never cut. Quality over speed." Commit: "T2: Rebar the notes". New: `score/rebar-notes.ts`, `score/rebar-notes.test.ts` (9 tests). Changed: `score/bar-layer.ts`, `score/correction-verbs.svelte.ts`, `score/time-signature-ui.svelte.ts`, `score/TimeSignatureControls.svelte`, `routes/+page.svelte` (5525; two lambdas widened in place), tests (`bar-layer.test.ts` +1, `correction-verbs.test.ts` +1, `e2e/time-signature-card.test.ts` +2, the phone test's target list +1).

## What the singer gets

In the card, a checkbox **Rebar the notes** (off, and off again every time the card opens) with its one-line help ("Moves notes across barlines to fill bars of the new time signature, tying any note that crosses one."), in French « Redistribuer les notes » and its line, exactly as ratified. Checked, the button does what T1 does and then re-bars: from the held bar, the notes are walked forward and bars of the new signature are filled; a note that crosses a boundary is tied across it (Dann 21:30). With the signature already in force, ticking it again re-bars from the held bar: the fix for a misread length inside the scope, which froze every later barline off by that length (review amendment 5).

## How (Fable's amendments 3, 4, 5, 10)

It is NOT a stored mode. `rebarNotes(read, line, map, id, sig, through)` computes the barlines and splits and writes them as **ordinary records** in the one map, so every path ends in the same few stored fields, one Undo step ("time signature changed") takes the lot, and a reload keeps them (and shows no memory of where they came from: amendment 4).

- **Stops.** The scope ends where Finale's Rebar Options end: at the next change of signature (reading's or hers, for "to next"), at a key or clef change, at a repeat, an ending, a jump, a rehearsal mark (`rebar.ts` `mergeBlocked`: the same test the Barline verb uses, so the layer honours what this writes), at a gap of bars, and at a **tuplet group that cannot be counted whole into the bar it falls in** (amendment 3). The last bar before a stop may be short; no rest is invented; it stays flagged as not adding up.
- **A tie is a note split in the data** (amendment 3): the read note takes the shorter length and `tied: 'start'`; each remainder is a hand-entered entry anchored to the part before, the same pitch; every remainder but the last is `tied: 'start'`; the last carries the tie the read note had. A **rest** that crosses is split with no tie. A length no single value holds (five sixteenths) is a chain of tied values (`notatable`: 5/16 = quarter + 16th; 3/2 = dotted whole). The syllable stays on the first part (a note after a tie start takes no syllable, `pairings.ts`).
- **It replaces the barlines in its scope, hers included** (the Dorico pitfall in the survey: a rebar that silently overwrites manual barlines). The scope is the one she chose, and Undo restores them: nothing here mutates the old map, which is the whole of Undo.

## Tests

Unit (`rebar-notes.test.ts`): a 3/4 song laid out in six bars of four under a stated 4/4, rebarred to 3/4 to the end: **eight bars, every bar adds up, every read note still present, total length unchanged, exactly four entered remainders** (the notes at quarters 2-4, 8-10, 14-16, 20-22), each tied from the part before, the same pitch, and opening its bar. The input map is not mutated; her barlines inside the scope are replaced; a crossing rest splits with no tie; a tuplet group that cannot be counted whole ends the rebar before it and the short bar reads `1 of 3`; "to next" ends at the reading's own next change of signature and leaves the bars after it exactly as read; ticking it again after a length was fixed fills every bar but the last; an impossible pair and an absent entry are refused. Playwright, chromium (2, pass): in the real page a 3/4 song read as six bars of four becomes eight bars, walked to bar 8 by the keyboard, one Undo restores the reading's six and the drawn 4/4, Redo does it again; the checkbox is off every time the card opens and French reads as ratified.

## Gates

| gate | result |
|---|---|
| 1 | 456 passed |
| 2 | 248 passed |
| 3 | 0 errors, 12 warnings |
| 4 | 4789 passed, 1 skipped (264 files) |
| 5 | 785 passed, 5 skipped |
| 6 | 168 passed |
| 7 | 125 passed |
| 8 | OK |

**Playwright, both whole suites.** chromium: 146 passed, 7 failed, 1 skipped; phone: 25 passed, 4 failed, 1 skipped. The failures are the baseline's own (`534d9981`, run by me): chromium `glue-typed-marks` (2), `heic-reader-path`, `insights-page`, `loupe-header` line 47, `print-pages`, `singer-paths` Learn and Guide (7); phone `input-views` 134, `phrase-ends`, `relining` 70 and 95 (4). Nothing new fails.

## What I could not establish

- **Fused bars on the real reader's output.** The brief asks for the walk "on a fused fixture, rebar and the bars come right with ties". My fixtures are synthetic: the song with four-quarter bars in a 3/4 song is the case where a note crosses a boundary and gets tied; the fused fixture (`barline-fused`) is 4/4 and needs no signature change, only a barline (B3). No stored reading of a real scan was available on this lane.
- **A rebar that crosses a hand-entered note's own anchor chain** (her entry inside the scope, split in turn) is covered only through the shared `entered.after` chain; no test splits an entered note.
- **Beaming and tie drawing after a rebar** were not inspected on a drawn page beyond the bar numbers; the tie data is tested and the renderer draws what `tied` says.
