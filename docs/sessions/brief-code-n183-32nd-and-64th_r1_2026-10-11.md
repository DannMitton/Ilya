# Brief for Code: N.183, the 32nd and the 64th in the editing controls, r1

Written by the desk (Opus) 2026-10-11 19:02. Ruled in by Dann 2026-10-11 18:59: *"yes, add Finale's other two digits: 2 for a 32nd and 1 for a 64th."* Offered by the desk. For the cloud lane or the Mac; Sonnet. QUEUE row 75.

## What the singer sees

A singer correcting a bar can choose a 32nd or a 64th, by key (2 and 1, as in Finale's Speedy Entry) and by the length buttons on touch. Found on Mussorgsky's «Гдѣ ты, звѣздочка?», where one printed bar needs both.

## What is there (read by the desk 19:00)

- Keys: `DIGIT_BASE` (`apps/web/src/lib/score/correction.ts:110-116`) maps 3 to 7 to sixteenth to whole. `durationFraction` already knows `32nd` and `64th` (`:126-127`).
- Touch: a separate table, `DURATIONS` (`apps/web/src/lib/score/CorrectionSurface.svelte:207-213`), five SMuFL glyphs with `correct.len*` labels. The desktop controls may hold a third list; find every place a length is offered.
- Strings: `correct.len16th` to `correct.lenWhole` (`apps/web/src/lib/i18n.ts:337-341`).

## The work

1. Add `'2': '32nd'` and `'1': '64th'` to `DIGIT_BASE`, and make the key handler accept them.
2. Add both to every list a singer chooses a length from, in order 64th, 32nd, 16th, … whole. Glyphs: SMuFL `metNote32ndUp` and `metNote64thUp` (the desk believes U+E1DB and U+E1DD; confirm against the SMuFL metadata in the tree and that Finale Maestro carries both, `FinaleMaestro.json` `glyphBBoxes`; if it does not, say so and use the word fallback the comment at `CorrectionSurface.svelte:200-206` describes).
3. Strings, RATIFIED in both languages by Dann 2026-10-11 19:00 (built from `correct.len16th` « Double croche »):
   - `correct.len32nd`: English "Thirty-second"; French « Triple croche »
   - `correct.len64th`: English "Sixty-fourth"; French « Quadruple croche »
4. Tests: the two digits, and the two buttons, beside the existing `DIGIT_BASE` tests (`correction.test.ts:186-190`).
5. Check the touch row still fits a phone width (375 px) with seven lengths; if it does not, report with a screenshot and do not redesign it.

## Done when

Both lengths can be entered by key and by touch, in both languages; all gates at baseline plus the new tests; seen rendered on a phone-width window. Report `docs/sessions/report-code-n183-32nd-and-64th_r1_2026-10-11.md` with "Could not establish". NOT ESTABLISHED beats a complete invented answer. Do not edit `docs/memory/`. Do not commit.
