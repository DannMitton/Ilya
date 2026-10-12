# Report: N.183, the 32nd and the 64th in the editing controls (QUEUE row 75, r1)

**QUEUE row 75, state: WRITTEN, pushed to `cloud-lane`. A singer can enter a 32nd and a 64th, by key (2 and 1, as in Finale's Speedy Entry) and by touch, in both languages. At 375 px the seven lengths no longer fit one row; the row wraps, as the picture shows, and is not redesigned.** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-12, for `docs/sessions/brief-code-n183-32nd-and-64th_r1_2026-10-11.md` with its amendments of 2026-10-11 19:30, on `cloud-lane` after row 68 (`5c471214`), clean tree before the first edit.

The brief says "Do not commit"; its amendment says that on the cloud lane the row is committed and pushed to `cloud-lane`. So it is.

## Every place a length is offered

1. **Keys:** `DIGIT_BASE` (`apps/web/src/lib/score/correction.ts`). The key handler in `+page.svelte` (`:1275`) reads it, so it accepts every digit in the table with no change.
2. **Touch:** the surface's length cells (`CorrectionSurface.svelte`, formerly an inline `DURATIONS` table).
3. **The word for a length:** `DURATION_KEY` (`apps/web/src/routes/+page.svelte:880`), which feeds the undo label and the status line, as the amendments name.
4. **The tuplet value cycler, `TUPLET_VALUES`** (`apps/web/src/lib/score/entry.ts:313`). This chooses a tuplet's unit, not a note's length. **Left at its five values (DESK DEFAULT).** Adding the 32nd and 64th would change how the value cycles; see "For Dann".

No other list was found: `correct.len16th` and `'16th'` were searched across `apps/web/src`.

## The changes

- **`apps/web/src/lib/score/correction.ts:110`:** `DIGIT_BASE` gains `'1': '64th'` and `'2': '32nd'`. Its comment names N.183. No other key handler in the app claims 1 or 2.
- **`apps/web/src/lib/score/correction.ts:129`:** `LENGTH_CELLS` (new, exported). It is the touch row's table, moved out of `CorrectionSurface.svelte` so a unit test can read it: seven cells, 64th to whole, each with its base, glyph, and word key.
  - Glyphs: `metNote64thUp` U+E1DD and `metNote32ndUp` U+E1DB.
  - The tree holds no SMuFL `glyphnames.json`, so the codepoints follow SMuFL's sequence, which the five glyphs before them already follow (`metNote16thUp` U+E1D9, `metNote8thUp` U+E1D7). That is INFERENCE.
  - Finale Maestro carries both, in `FinaleMaestro.json` `glyphBBoxes`, as Fable checked and this session confirmed. Both draw in the pictures, so the word fallback is not needed.
- **`apps/web/src/lib/score/CorrectionSurface.svelte:41`, `:207`:** the surface reads `LENGTH_CELLS`.
- **`CorrectionSurface.svelte:414`:** the tuplet value's glyph is now found by its length (`DURATIONS.find((d) => d.base === base)`), not by its position in `TUPLET_VALUES`. That position lookup would have drawn the wrong glyph once two cells stood ahead of the 16th. The now-unused `TUPLET_VALUES` import is removed.
- **`apps/web/src/routes/+page.svelte:881`:** `DURATION_KEY` gains the 64th and the 32nd, on an existing line, so the file stays at 6003, its ceiling.
- **`apps/web/src/lib/i18n.ts`, by key, beside `correct.len16th`:**
  - `correct.len64th`: "Sixty-fourth" / « Quadruple croche »
  - `correct.len32nd`: "Thirty-second" / « Triple croche »
  - Both RATIFIED by Dann 2026-10-11 19:00, as the comment says.

## Tests (`apps/web/src/lib/score/correction.test.ts`, +2)

- **"maps 2 to a 32nd and 1 to a 64th, as Finale does (N.183)":** also checks that the table holds exactly the digits 1 to 7.
- **"offers seven lengths on touch, 64th to whole, each a digit's length with its word (N.183)":** asserts:
  - the order, and that each cell is the length of digits 1 to 7 in turn;
  - the two new glyphs and keys;
  - all seven words exist in both languages;
  - the four new strings word for word;
  - the 32nd's and dotted 64th's fractions.

## Seen at phone width

Measured on the live page at 375 px, Without Sun no. 1, a note taken, Corrections open. Pictures: `docs/sessions/n183-shots/phone-375-en.png` and `phone-375-fr.png`.

- **Each cell is at least 50 × 44 px.**
- **First line:** 64th, 32nd, 16th, eighth, and quarter.
- **Second line:** half and whole, then the dot and Tuplet.
- **Nothing overflows:** the page's scroll width stays 375.
- **French:** the same, with « Quadruple croche » and « Triple croche » as the accessible names.

**It does not fit one row.** Before this row the five lengths filled one line. Now Half and Whole have moved onto the dot and Tuplet's line. Per the brief, this is reported with the pictures and not redesigned.

## The eight gates

All pass.

1. `pnpm test:phonology`: 251 passed (251)
2. `pnpm test:dictionary`: 242 passed (242)
3. `pnpm --filter @ilya/web check`: 0 errors and 12 warnings in 5 files
4. `pnpm --filter @ilya/web test`: 2341 → **2343** passed (+2)
5. `pnpm --filter @ilya/score-parser test`: 663 passed, 5 skipped (668)
6. `pnpm test:blurb`: 145 passed (145)
7. `pnpm test:integration`: 55 passed (55)
8. `pnpm ratchets`: OK

## For Dann

1. **The touch row wraps at 375 px** (`phone-375-en.png`). Half and Whole now sit beside the dot and Tuplet. A layout for seven lengths is a design question.
2. **Tuplet values stay at five** (16th to whole). Should a 32nd or 64th be a tuplet's unit too?

## Could not establish

- **The codepoints from the SMuFL specification itself.** They are inferred from its sequence and confirmed by the glyphs drawing in the picture.
- **Entering the two lengths by key on a real keyboard in the browser.** The handler reads the same table the test checks; no key press was simulated.
