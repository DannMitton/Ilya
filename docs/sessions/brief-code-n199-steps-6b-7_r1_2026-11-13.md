# Brief to Code: N.199, Steps 6b and 7: the finished drawings, the ratified words, and three fixes

r1, 2026-11-13, from the desk (Opus). For lane 51 (`cloud-lane-51`), after its Step 6 at `9c1c0698`. Continues brief r5 (`docs/sessions/brief-code-n199-calibrate-single-vowel_r5_2026-11-13.md`); everything there still binds unless this brief changes it. Not yet Fable-reviewed (CONTRACT §1 item 19): the review goes over this brief and the lane as built together.

No git writes outside your lane. Gates before and after every step. Canadian spelling, the Oxford comma, no em dashes. One commit and one report per step, `docs/sessions/report-code-n199-step<n>_r1_2026-11-13.md`.

**NOT ESTABLISHED beats a complete invented answer.**

First, merge `origin/Shane` into the lane: it carries this brief, the finished drawings, and the desk's notes. Report any conflict.

## Why this comes before Dann's walk

Brief r5 put the words after the walk. Dann has now ratified every string in r5 section 7, in English and French (2026-11-13 10:30 to 11:35, all homed in `docs/memory/OPEN.md`, section N.199, with his words). The drawings are finished. So he walks the screen with its real words and drawings, in both languages, and the walk can settle everything at once.

## Step 6b. The finished drawings, the credit, and two screen fixes

1. **The drawings.** Replace the ten interim PNGs in `apps/web/static/sagittal/` with the ten SVGs in `docs/sessions/n199-calibrate/drawings-r4/` (`sag-<name>.svg`, same names as the PNGs with `.svg`). Delete the PNGs. They are stroke-only, `stroke="currentColor"`, `viewBox="-24 -12 544 544"`, with no width or height. Draw them in the Voice lavender family's ink (choose the token; say which). Every file's `<g id="fixed">` is byte-identical, so the picture changes in place; keep the stacked-image crossfade, or inline the SVG if `currentColor` cannot reach an `<img>` (it cannot: an `<img>` does not inherit `color`). Report the bytes as shipped (the ten SVGs sum to about 56 KB) and update `drawings.test.ts`. Run `docs/sessions/n199-calibrate/drawings-r4/check.py` against the copies you ship and report its output.
   - The squircle stays its size unless the drawings read cramped in it (Dann 11:35: it may widen if needed). Say which you chose.
   - `drawings.ts:6-8`: the plate numbers are now checked by the desk against the handoff (`docs/sessions/handoff-calibrate-redesign_r1_2026-11-12.md` §7) and the drawing agent's registration: i 17, e 13, ɛ 10, a 3, ɑ 2, o 6, u 19, ɨ 15, ʌ 23, ɪ none. They match the file. Correct the comment.
2. **The credit line** (ratified 11:35). Replace `creditLine` (`drawings.ts:32`) with two strings, keys `capture.credit.plate` and `capture.credit.noPlate`:
   - "Drawing: Dann Mitton, after Bolla (1981), plate {n}." / « Dessin : Dann Mitton, d’après Bolla (1981), planche {n}. »
   - "Drawing: Dann Mitton. Bolla has no plate for this vowel." / « Dessin : Dann Mitton. Bolla ne donne pas de planche pour cette voyelle. »
   - The no-break space before « : » (U+00A0) and the typographic apostrophe (U+2019).
3. **The axis words on the capture chart** (DESK DEFAULT on Dann's 10:38 remark that the explain sentence "could even be profiled on the chart"). Draw the sheet's three axis words on `VowelChart`'s edges as `VowelSpaceSheet.svelte:62-68` does: `sheet.axis.front` on the front (left) edge, `sheet.axis.back` on the back (right) edge, `sheet.axis.open` down the fR1 axis. Small, in the grid's grey, never over a zone's symbol. Hidden in hidden mode with the chart.
4. **A label collision.** In `desktop-4-all-ten.png` (Step 6 pictures) the [ɪ] dot's symbol is drawn under [e]'s label and reads as "ɩ e". Place each symbol so no two overlap (a fixed offset per vowel is fine; say what you chose). Check it with all ten sung for a bass and for a soprano.

Gates and pictures after 6b: `desktop-4-all-ten.png` and `phone-1-idle.png` again, and one picture of each of [i], [ɑ], [u] selected so the drawing shows.

## Step 7. The ratified words into `i18n.ts`, English and French

1. Move every key in `voice/chart/draft-strings.ts` into `apps/web/src/lib/i18n.ts` with its English and French from `docs/memory/OPEN.md`, section N.199, entries dated 2026-11-13. **Copy the French exactly as recorded there**, including U+00A0 before « : » and U+2019 apostrophes. Delete `draft-strings.ts`; every `ds(...)` becomes `t(...)`.
2. **Three English strings changed after r5 and are recorded only in `OPEN.md`**, so take them from there, not from `draft-strings.ts`: `capture.hide` "Hide the chart and the readout while I sing"; `capture.hidden` "The chart and the readout are hidden while you sing. They return when this vowel is captured."; `sheet.legend.hull` "The outline surrounds your sung vowels. It is dashed until all ten are sung."; `sheet.legend.zones` ends "Where they cross, the colours blend."; `sheet.provenance` is corrected (baritones from Bozeman's "Levels of Acoustic Registration"; placeholders' fR1 from the zone centre, fR2 from Mitton Table 5.3 scaled). Diff `draft-strings.ts` against `OPEN.md` key by key and list every difference you applied.
3. **The pause line** (ratified 01:05 EN, 10:30 FR): `pacifier.pause` becomes "Stop singing, but maintain the shape of your vocal tract for that vowel." / « Arrêtez de chanter, mais gardez la forme de votre conduit vocal pour cette voyelle. » This key is live in today's wheel too, so it reaches every singer at the ship. `PAUSE_MS` (`voice/count-in.ts:18`) goes from 2000 to 3000 so the line can be read (DESK DEFAULT, recorded in `OPEN.md`). Every test that pins the timing moves with it; list them.
4. `pacifier.sampleUncertain` keeps its key and is no longer used by the new screen (`capture.uncertain` replaces it there); leave it for the wheel until Step 8.
5. `FrSym` takes small capitals (ruling 14 of r5) in its own commit, with a picture of the roster before and after.
6. Pin the new strings in a test the way `ratified-lines.test.ts` pins the Guide's (English and French), so a later edit cannot drift silently.

Gates and pictures after 7: the five desktop and five phone pictures again, in English and in French (`?lang=fr` or however the app switches; say how), and the printed sheet in both languages, each on one letter page.

## Out of scope

Step 8 (the handover to every singer and the deletion of the wheel), Step 9 ([ɨ] before its anchors), Phase 2, M0. The switch `?calibrate=new` stays.

## What the desk could not establish

- Whether inlining ten SVGs (about 56 KB) or loading them as files is better for the service worker's precache (`scripts/stamp-sw.mjs`, not read by the desk).
- Whether the axis words fit at 358 px without crowding the grid numbers.

## Reports

One per step, with `path:line`, gate counts, pictures, and "Could not establish".
