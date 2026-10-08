# Brief for Design: the tessituragram, refined for a first-time reader (r1, 2026-10-07)

Written by the desk (Opus) 2026-10-07 about 21:00, at Dann's request. For Claude Design, with the repository `DannMitton/Ilya` connected on branch `Shane`. Everything this brief cites is in the repository; nothing depends on project knowledge.

## Who reads this figure, and what they should feel

A classical singer opens Insights for a song and meets this figure first. Many have never seen a tessituragram. In a few seconds they should understand where the song spends its time in their voice, and whether that sits comfortably against their own passaggi and tessitura. The figure is part of a printed page, so it must read on paper at letter size as well as on screen. Ilya's design idea is **Calm Authority**: helpful, quiet, exact, and tethered to its sources. Nothing in this figure is clickable.

Dann, 2026-10-07 20:45, on the figure as built: *"The elements of the tessituragram are promising. I'm considering edits to make it more welcoming to a new viewer."*

## The figure today

Source: `apps/web/src/lib/insights/Tessituragram.svelte` (one SVG, 570 units wide). A screenshot of the Tchaikovsky song (*Средь шумного бала*) on the alias is attached by Dann. Read the component's header comment (lines 1 to 20) for its colour roles.

Elements, ranked by what the singer needs most. **The ranking is the desk's proposal**, offered for Design to challenge:

1. **The bars.** One horizontal bar per sounding pitch, length is time spent singing that pitch (in quavers, or seconds when the score states a tempo). `--rose`; a bar carrying a finding is `--rose-ink` (`:378-381`). This is the figure's data.
2. **The tessitura band.** A shaded band from the piece's tessitura low to high (Pacheco's method; footnote on the page), now running the full width of the figure at 22 percent `--rose` (`:316`), labelled "tessitura" beside the stave (`:317`).
3. **The passaggi.** Two dashed lines in `--rose-chip`, the singer's primo and secondo passaggio as they typed them (`:369-374`), labelled "primo" and "secondo" in italics (`:406-408`), with three shares at the right edge: "above · 2%", "between · 57%", "below · 41%" (`:410-414`).
4. **Half the singing.** A bracket beside the bars spanning the pitches that hold half the singing time, with a tick at the centre of gravity and a two-line label ("centre", "A3") (`:419-435`).
5. **Pitch names.** Two columns: stave-line names in tertiary ink, weight 400 (`:386`); names of sung pitches that fall between lines (accidentals), `--rose-ink` at weight 600 (`:390`).
6. **The compass.** The lowest and highest sung notes on the stave left of a barline, with "Compass B2 to E4" under them (`:340-366`).
7. **Bar labels.** Text after a bar's end (for example "20%"), weight 600 when the bar carries a finding (`:395-403`).
8. **The stave.** Clef and five lines, solid to the barline and faint under the bars; ledger lines above or below the stave continue under the bars as dotted lines (`:320-330`).
9. **The title.** "PHONATION PER PITCH, IN QUAVERS" (`:437`).

Every label sits on a "halo", a stroke of paper colour behind the glyphs so lines do not cross the text (`:383`, `:460-462`). All labels are 7.5 or 8 units.

## What Dann has ruled tonight (2026-10-07, 20:45 to 20:52)

Who offered what is marked. Each is a default with its reason, not an edict.

1. **No halos.** *"I dislike the white halos: we will try to arrive at solutions that obviate them."* (Dann.) Reason: they patch contrast instead of solving it.
2. **Leader lines, where a label cannot sit beside its element: solid hairlines, no arrowheads, as long as the distance needs.** (Dann's idea; "no arrowheads" was the desk's wording, and he confirmed it, striking "short".) Reason: the figure already has three line languages (solid stave, dotted ledger continuation, dashed passaggio); a leader must not read as a fourth pitch line.
3. **One typeface treatment for both pitch-name columns.** (Dann.) The desk's suggestion: one weight, with colour alone telling a sung pitch from a line name.
4. **The tessitura band is trimmed.** (Dann's idea.) Its right end stops just after the longest bar, so the zone shares and other labels sit on clean paper. Its left end: Dann suggested starting at the first sung pitch on the stave; the desk suggested starting where the bars begin and marking the tessitura on the stave with a slim bracket labelled "tessitura", echoing the half-the-singing bracket. **Open for Design.**
5. **The ink is too small.** (Dann: *"The ink is already tiny."*) The trim and the leaders should free room for larger labels on paper.

## Open questions for Design

- **A legend or key.** Dann asked whether a legend would help, for example the primo and secondo passaggi shown as a 1 and a 2 in circles, which Ilya's visual language already uses. **The desk's view:** two short words that appear once each read faster in place than through a legend; a small key under the figure that explains the four line languages and the band once (band, dashed, dotted, dark bar) may help a first-time reader more. Design decides, with drawings of both.
- **Where each label lives** once the band is trimmed, and which labels need a leader.
- **Sizes on paper.** The smallest label size that reads in print at letter size, and whether the figure's height can grow to allow it.

## Constraints

- Colours: existing tokens only (`apps/web/src/app.css`): `--rose`, `--rose-ink`, `--rose-chip`, `--ink-tertiary`, `--ink-stave`, the paper colour. Every label clears contrast on the paper without a halo.
- Both languages: every label exists in English and French (`apps/web/src/lib/i18n.ts`, keys `insights.figure.*`). French runs longer; design for it. Write no new French: list any new label in English, and the desk drafts the French for Dann.
- It must survive the extremes: a song with one or two pitches, a song spanning two octaves, no passaggi typed (no dashed lines, no shares), no tessitura, a tempo (seconds) versus none (quavers).
- The figure is a document: no hover, no controls.

## Return

Drawings at letter size, on screen and as printed, for the Tchaikovsky song and for one extreme of your choosing, with each ruled item above visibly met, and a short note per decision on what it costs. Write the return into `docs/sessions/` as `design-tessituragram-refined_r1_2026-10-07.*`. List anything you could not establish. NOT ESTABLISHED beats a complete invented answer.
