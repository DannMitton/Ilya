# Handoff: the mobile correction interface

Claude Design, 2026-08-25. Prepared for the desk.

## Deliverables, r2

- `design-mobile-correction_r2_2026-08-25.html` — the schematic. Self-contained
  single file, opens in any browser with nothing beside it. This is the file the
  desk files.
- `note-desktop-adaptation_r2_2026-08-25.md` — the desktop note.

## Superseded, kept as record

- `design-mobile-correction_r1_2026-08-25.dc.html` — r1's page treatment, a window
  onto the page at readable zoom. Superseded 2026-08-25 by the whole-page
  thumbnail plus loupe. Needs `support.js` beside it to open.
- `note-desktop-adaptation_r1_2026-08-25.md` — the r1 note, which argued from r1's
  cropped page.
- `support.js` — runtime for the r1 working copy only. The r2 deliverable does not
  need it.

## Two rulings owed before Code starts

Both are in the schematic's NOT ESTABLISHED section. Neither is the designer's to
close.

1. **Legibility at thumbnail scale.** The treatment's load-bearing assumption is
   that a singer can pick the right measure by eye on a page drawn at 372 x 480 px.
   Six systems of eight notes with underlay works on the drawing. Twelve dense
   systems is the case that would break it. A phone walk with a real study edition
   settles it. If it fails, the loupe's premise needs rework before any code exists.
2. **The notation face.** Every notehead, stem, barline, and duration glyph in the
   schematic is a geometry stand-in built from ellipses and rectangles. The
   operational spec names three type voices and none of them is notation, so the
   face carrying most of this interface is unnamed in the slate. The page glyphs and
   the surface's duration glyphs must come from the same font. The Fable ruling of
   2026-08-18 already requires the stand-ins to be re-verified against `app.css`.

## Amendments the desk made this session, recorded in the schematic

- Ruled ground item 1: the phone's paper is an oversized thumbnail at excellent
  resolution, not the true page at readable zoom. The loupe supplies the readable
  zoom.
- The Calm Authority shape rule: nothing floats over the paper, except the loupe.
  Named, singular, does not generalize.

## Every measurement in the schematic is CSS geometry

True scale in a fine-pointer browser. The 44 px touch floor is verifiable on the
drawing and unverified on glass.
