# Report: N.192 and N.187, step 3 (the renderer draws key changes), r1, 2026-11-12

Lane `cloud-lane-50`. Built to the brief with amendments 11 to 13 and 20.

## What changed

**Ratchet room first.** The accidental rule and its carry (`keySignatureAlter`, `advanceAccidentalState`, `accidentalStateAtEndOf`, `AccidentalCarry`, `newAccidentalCarry`, `carryIntoMeasure`, `SHARP_ORDER`, `FLAT_ORDER`) moved as they were out of `staff-renderer.ts` into new `accidental-carry.ts`; `staff-renderer.ts` re-exports every name it used to export, so the package surface is unchanged. `staff-renderer.ts` is 3336 of its ceiling 3427 after the step (it was 3426). No ceiling is raised or moved; I left `ratchets.json` alone, and the desk may lower `staff-renderer.ts` to 3336 and `musicxml-parser.ts` to 1164.

**The key in force, per bar** (`accidental-carry.ts`): `keyInForce(parsed, m)` reads `Measure.keySignature`; `keyDeclaredAt` is true where a bar's key differs from the bar before it (never on a slice's first bar); `outgoingKeyAfter` reads the bar after a slice from the whole score. `AccidentalCarry` takes an optional `fifthsAt(measure)`; `carryIntoMeasure` swaps `carry.fifths` at a change and clears `prevMeasureAcc`, so nothing carries across it and no courtesy accidental fires from the old key's bar. Every site that took one `fifths` takes the carry's: `columnInk`'s two reads, the draw loop's note and turning-note reads, `layoutColumns`, `accidentalStateAtEndOf`, `renderSystemSlice` (`incomingAccidentals` is empty where the slice's first bar declares a key), and `doubleAccidentalsDrawn` (`transposition.ts`; the brief's `doubleAccidentalCount` is the type, the function is `doubleAccidentalsDrawn`).

**Drawing** (new `key-change.ts`, called from `staff-renderer.ts`): at a bar that declares a key mid-system, a light double barline, then the signature, with cancelling naturals first where the new key gives up accidentals of the old (all of them across sharps and flats or to no accidentals; none for a longer key of the same kind), then `METER_KEY_CLEAR_SP` and the meter where the bar changes time too (the head's order). The room goes into `LayoutColumn.meterRoom` through `meterRoomFor`, so `sliceWidth` and the render agree; a key change with no meter takes the head's run-in (`HEAD_RUN_IN_SP`, 2.5). `tacetRuns` breaks a run at a change of key, as at a meter change. At a change that falls at a system break, `renderSystemSlice` and `sliceWidth` pass `outgoingKeySignature` (the key of bar `toMeasure + 1`); the system draws its closing double barline, the courtesy signature (naturals included), and stave lines to the courtesy's right edge, inside its width: the columns justify to the target width less the courtesy's room (`keyCourtesyRoom`, added by `sliceWidth`).

**The handle.** Every mid-system and courtesy signature sits in one `<g data-key-change="from>to">`, never `data-key-signature`. The Loupe treats `data-key-change` where it treats `data-meter`: `loupe-ink.ts` (the two ink walks) and the clone strip at `Loupe.svelte:1108` (a same-length line edit; `Loupe.svelte` stays 3012 of 3012).

**The Loupe's head** needed no new code, as step 0 found: the Loupe renders the held bar as its own one-bar slice, whose head takes the key from that bar. Its one-bar slice is not at a system end, so `renderLoupeMeasure` passes the new `courtesy: false` and draws no courtesy.

## DEPARTURE FROM A RULING, as the amendment asks the report to say

At a system that ends before a change of key, the system no longer "ends AT its barline" (Dann's ruling of 2026-08-06): it carries the courtesy signature past its closing barline, per N.192's own spec. Every other system is unchanged, shown by the byte-identity tests below.

## Tests

- New `key-change.test.ts` (24 tests): the glyph sets and positions for every case; `keyDeclaredAt`, `keyInForce`, `outgoingKeyAfter` on the fixture; no carry across a change; the mid-system group, the courtesy, and the head count on explicit measure ranges; no accidental on F natural and B flat in F major, one on B natural; F sharp unmarked and F natural marked after the return; key and meter together in the head's order at bar 11; `sliceWidth` equals the drawn width for six ranges, with and without a courtesy; a justified width holds the courtesy; the Loupe's `courtesy: false`; a held bar shows one flat at bar 6 and two sharps at bar 2; a rest run breaks at a key; `engraveInKey` moves every signature.
- **Byte identity**: six fixtures with no key change (`n188-markings`, `row126-song1-bars-9-10`, `tch-1`, `tch-2`, `barline-clean-4-4`, `sun3-2`), every system sliced three bars at a time at natural and justified width, plus `sliceWidth`: the md5 taken on `b1234cf4` (read with `git archive` into a scratch folder, not by touching this tree) equals the md5 on this tree for all six, and the test pins them.
- Pass unchanged, as the amendment expected: `page-layout.test.ts:115`, `staff-renderer.test.ts` (`:702`, `:1883`, `:2359`), `transposition.test.ts:489-505`, `rebar.test.ts:147`, `rebar-notes.test.ts:183-193`.
- Playwright, new, both pass: `e2e/key-change-melody.test.ts` (1440 wide) and `e2e-phone/key-change-melody.test.ts` (390 wide): the page draws three changes (`2>-1`, `-1>2`, `2>3`) and five head glyphs; with bar 2 then bar 6 held, the Loupe head shows half the glyphs (one flat against two sharps), no `data-key-change`, and its clef sits at the same x as for bar 2 (head bound).

## Gate counts after this step

| Gate | Result |
|---|---|
| score-parser | 826 passed, 5 skipped (831), 38 files (from 802) |
| web, `src/lib/score`, `markup`, `omr`, `insights` | 2742 passed, 143 files |
| svelte-check | 0 errors, 12 warnings |
| ratchets | OK |
| Playwright | the new test, desktop and phone, passes; the whole suite runs at step 7 |

## Screenshots

`docs/sessions/shots-n192-n187-step3_2026-11-12/`: MELODY at 1440 and 390 px, English and French, for `key-changes.musicxml` (`key-changes-desktop-en.png`, `-desktop-fr`, `-390-en`, `-390-fr`) and `tch-3.musicxml` (`tch3-desktop-en`, `tch3-390-fr`). Seen: the courtesy at the end of systems 1 and 2 (natural, natural, flat; then natural, sharp, sharp), the light double barlines, F major's one flat after bar 5, the natural before B at bar 6, the courtesy flat in bar 7 that the existing r121 rule gives after bar 6's B natural, bar 9 opening on D major, and bar 11's three sharps before 3/4. A clef question popover from the app overlays the top of the page in the shots; it is the app's, not this step's.

## What I could not establish

- Gould's rule for the barline at a key change, and for the gap between naturals and the new signature (p. 152 is not in the tree): the double barline's half-space gap, the one-space clearance, and no gap after the naturals are JUDGEMENT, tagged in `key-change.ts`.
- A tacet rest at the end of a system that closes with a double barline measures its right bound to the first stroke's position, within about half a stave-space. Not drawn in the fixture; unmeasured.
- `tch-3.musicxml` at bar 9 (three sharps to two): drawn, seen, but whether the print changes key there is NOT ESTABLISHED.
- The whole web unit suite and the phone suite: run at step 7.
