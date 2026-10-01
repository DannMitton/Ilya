# Brief to Code: N.123 part 2. The half of the singing, its centre, and the cycle dose

From the desk, 2026-09-30 22:10. No git writes. Gates before and after. Canadian spelling, no em dashes.

## What Dann approved, 2026-09-30 21:52 to 22:04

The drawing `n123-part2-A-dashed_r2_2026-09-30.png` (`docs/sessions/drawing-n123-part2_r2_2026-09-30.png`; its four caption lines are struck), with every caption removed (Dann 22:00: the commentary belongs to Insights, not the figure), plus one line (22:03 to 22:04).

1. **A bracket beside the bars** of the tessituragram (`insights/Tessituragram.svelte`, model in `insights/insights.ts:207-236`, `:539`), spanning the **half-mass band**, labelled "half the singing".
2. **A centre tick** on the bracket at the **centre of gravity**, labelled with the nearest pitch name.
3. **The passaggio lines dashed**, still running past the bars (amends the 2026-09-23 design, which drew them solid).
4. **The cycle-dose line, always shown, directly under the figure. RATIFIED by Dann 22:03 to 22:04; caveat struck 22:04** (*"Strike the caveat"*, amending his 2026-09-10 caveat ruling):
   - EN: "Cycle dose: about {cycles} (number of fold collisions in this piece)" (the parenthetical is Dann's words)
   - FR: « Dose de cycles : environ {cycles} (nombre de collisions des cordes vocales dans cette pièce) » (desk-drafted; no-break space before « : »)
   - `{cycles}` rounds to two significant figures (DESK DEFAULT) and formats per language: "14,000"; « 14 000 » with a no-break space (U+00A0).

## The measures (pure functions in `insights.ts`, tested)

- **Half-mass band:** the narrowest contiguous run of sounding pitches whose summed sung duration is at least half the total; ties go to the run holding more. Sources: `docs/memory/OPEN.md` §N.123 (DESK DEFAULT fraction one half, ruled wording "half the singing").
- **Centre of gravity:** Rastall's PCG via Barcan 2013 p. 37 note vii: each semitone numbered in sequence, p = Σ(n·dn) / Σdn over sounding duration; shown as the nearest sounding pitch the piece sings (DESK DEFAULT: nearest semitone; if the nearest is not sung, the nearest semitone's name anyway, with its accidental spelled as the piece spells its neighbours).
- **Cycle dose:** Σ over sung notes of f0 × seconds, rests out (Dann's ruling, `OPEN.md` §N.123; Titze, Švec, and Popolo 2003, *JSLHR* 46(4), pp. 919-932, the VLI after Rantala and Vilkman 1999). Use the seconds the phonation-time section already computes, at the transposed key if a transposition is chosen.
- **When seconds are a range** (the inferred tempo, `insights.phonation.headlineInferred`): print "about {low} to {high}" (DESK DEFAULT; French « environ {low} à {high} »). **When there are no seconds** (tempo state `none`): omit the line (DESK DEFAULT: a count without time is not a count); report how often this happens on Dann's library.

## Look

No new colour. The bracket, tick, and labels use the figure's existing ink tokens at the weight of its stave lines (DESK DEFAULT; the lavender in the drawing was a placeholder, and lavender is ruled for the marked score). Prints with the page. Seen at phone width and in print, both languages.

## Not in this brief

The half-mass and centre sentences become candidate Insights comments under N.168 and N.173 (`OPEN.md`), gated like every other comment.

## Report

`docs/sessions/report-code-n123-part2_r1_2026-09-30.md`, with screenshots of two songs from Dann's library or the fixtures. NOT ESTABLISHED beats a complete invented answer.
