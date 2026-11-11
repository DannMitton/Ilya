# Cursive letterforms for LEARN's Glyph Table, r4

Dann Mitton's own handwriting (template `ilya-cursive-template_r1_2026-11-09.pdf`, five pages, photographed 2026-11-10 as IMG_6590 to IMG_6594), redrawn by the desk the same evening. Ruled by Dann 2026-11-10 22:01: "Let's use mine with your alterations."

- 62 SVGs, one per letter and case, named `NN-<capital>-<upper|lower>.svg`. No capital Й, Ъ, Ы, or Ь (boxes left blank).
- Every file shares one vertical frame (viewBox y from -3, height 72, in template points); the baseline sits at y = 48.2, so letters align row to row when drawn at one height.
- Fill is `currentColor`; each file carries `role="img"` and an `aria-label` with the letter.
- 101,164 bytes in all (gzip about 35 to 50 KB).

How they were made (`scripts/`): `warp.py` straightens each photo on the template's four corner dots; `style.py` cleans each box (two-level ink threshold, guide lines removed), finds the centre line, joins pieces through crossings into pen strokes (`strokes.py`), fits each stroke as a smooth curve, and redraws it with thick strokes along the copybook slant (70 degrees), thin strokes across it, thin tight turns, and tapered ends; the result is traced to an outline with potrace. Settings for r4: `SPLS=1.1`, `HAIR=0.7`, `SHADE=1.8` (points).


Stroke order (Dann 2026-11-10 22:05): д begins at the bottom left, rises over the arc, retraces down to close the oval, descends, and ascends on a diagonal to the right for the join. So its lead-in and its rising exit are drawn as hairlines (`THIN` in `style.py`), and in д, з, and у the rising side of the descender loop is a hairline while the falling side carries the shade (`LOOPS`).
