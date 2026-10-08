# Design return: the tessituragram, refined for a first-time reader (r1, 2026-10-07)

Answers `docs/sessions/brief-design-tessituragram-refined_r1_2026-10-07.md`. Written by Claude (Opus 5.5) in Claude Design, 2026-10-07 about 21:30, on branch `Shane` at `21dbd8f` (a fresh shallow clone, clean tree). Nothing here is committed.

## What came back

- **The drawings**: `design-tessituragram-refined_r1_2026-10-07.html` in this folder, eight letter-size pages. Open it in a browser, or print it: each figure prints on its own page.
- **The same drawings on a Design canvas**, "Tessituragram refined", six artboards, private to you until you share it.
- **These notes**: one decision per section, each with its cost.

The drawings were made by a generator, not by hand. It reads the score, runs the half-the-singing and centre-of-gravity code from `singing-measures.ts` (`:32-47`, `:85-99`) in Python, measures every label in Source Sans 3, outlines the clef and noteheads from the repository's `FinaleMaestro.otf`, and checks every label against every line, bar, and other label. All eight figures report no contacts, in English and in French.

## The data

**Tchaikovsky, Op. 38 No. 3.** The voice part in `docs/sessions/measure-phase1_r1_2026-10-02/tchaikovsky-op38-3-voice.musicxml`, set an octave down, as the alias shows it. Summed quavers per pitch reproduce the screenshot: above 2.0 percent, between 57.3, below 40.8, and F♯3 the longest at 19.9. Half the singing is F♯3 to B3, and the centre is A3, which matches the screenshot's "centre A3". The tessitura (F♯3 to C♯4) is taken from the screenshot's table; I did not rerun Pacheco's method.

**The extreme case is synthetic.** No score in the repository spans two octaves or states a tempo (I checked the Sunless and Tchaikovsky files), so I invented one: a bass song from F2 to F4, crotchet = 60 (so the figure is in seconds), passaggi A3 and E♭4, **no tessitura**, and one pitch (F4) carrying two findings. It tests four extremes at once: the widest span, seconds, a missing tessitura, and a dark bar with stacked labels. It is labelled synthetic on every drawing.

## Ruling 1: no halos (met)

No label in any drawing sits on a line, a bar, or the band. Four moves do it:

1. The band no longer reaches any label (ruling 4).
2. The stave lines stop at the barline and resume under the bars. Each line's name sits in the gap, so the line and its name never meet.
3. The faint stave and ledger lines end just after the longest bar, and break around any bar label that would sit on them.
4. Each passaggio line ends at its own name ("‑ ‑ ‑ secondo"), and the zone shares sit in their zones, in the same right-hand column.

**Cost.** The faint lines no longer run to the right edge, so a reader cannot trace a pitch line across to the shares. The dashed passaggio lines carry that job alone. The line names now sit with the bars, not on the solid stave: a reader reads "A3" against the faint line it names, not against the clef.

## Ruling 2: leaders (met as a rule; none was needed)

The leader is a solid hairline, 0.6 px, `--rose-ink`, no arrowhead, as long as the distance needs. In these eight drawings, every label found a clear place beside its element, so no leader is drawn.

The generator tries each bracket label in a fixed order of places and takes the first clear one. "half the singing" tries above the bracket, then beside its top, then below it. "centre A3" tries level with the tick, then just above, then just below. Only if all three fail does it move to a free slot and draw a leader to the tick.

**Cost.** The leader form is untested on paper, because no case triggered it. My first fallback ran parallel to the bracket and read as a second bracket; I replaced it with a short diagonal, and that version has not been seen in a drawing. If you want one drawing that forces a leader, say so and I will make it.

## Ruling 3: one treatment for both pitch-name columns (met)

Both columns are Source Sans 3 Medium (500) at 10 px. Colour and column tell them apart: line names in `--ink-tertiary`, sung pitches in `--rose-ink`. The two inks also differ in lightness (contrast 4.85 against 7.33 on cream), so the difference survives greyscale printing.

**Cost.** The sung names lose the weight cue (600 today). Column position, colour, and lightness carry it.

## Ruling 4: the tessitura band, trimmed (met; the open left end decided)

The band runs from the bars' baseline to 4 px past the longest bar. On the stave side, a slim bracket beside the barline spans the same pitches, labelled "tessitura". This is the desk's option.

**Why not start the band at the first sung pitch on the stave (your option).** A band that starts on the stave also covers the line-name column. On the band, `--ink-tertiary` falls to 3.95:1 on cream, under the 4.5:1 that text needs. Without a halo, the names would fail.

**Cost.** The stave no longer shows the tessitura as shading. The reader joins the bracket to the band by height alone, across the name columns.

## Ruling 5: larger ink (met)

At letter size the figure is 570 units across the card's inner width, so one unit is one CSS px (the component's comment at `Tessituragram.svelte:59`; the screenshot's proportions agree). Today's 7.5 and 8 px labels print at 5.6 and 6 pt.

| Element | Today | Drawn | In print |
|---|---|---|---|
| Every label | 7.5 or 8 px | 10 px | 7.5 pt |
| Title | 8 px caps | 9.5 px caps, 0.06 em tracking | 7.1 pt |
| Stave step (one diatonic step) | 7 px | 11 px | |
| Bar, and thin bar beside a half-step neighbour | 4.4, 3 px | 6, 4.5 px | |
| Figure height, Tchaikovsky | about 147 px (estimated from the screenshot) | 228 px | 2.4 in |
| Figure height, synthetic two octaves | | 239 px | 2.5 in |

The step grows because the sung names sit one step apart (F♯3, G♯3, A♯3): at 10 px type, 7 px between baselines makes them touch. All sizes are JUDGEMENT.

**Cost.** The figure is about 55 percent taller, which pushes every later section down the page. The page-fitting estimates near `insights.ts:781` assume today's height; I did not check them. The longest bar shrinks from 196 px to 152 (English) or 137 (French), to leave room for the right-hand column. **The bar scale then differs between the languages.** I recommend the code take one length from the longer language, so a printed English page and a printed French page draw the same bars.

## Open question: a legend or key

**Recommendation: no key (the main drawing).** Every element is already named where it sits: the line names, the ledger-line names, "primo" and "secondo", "tessitura", "half the singing", and "centre A3". A dark bar is named by its own label.

- **A key beneath** (artboard "Option: a key beneath") is the better of the two alternatives. It explains the shading, the dashed lines, and the dotted lines once. It repeats what the figure already says, and it costs about 40 px of height.
- **Circled 1 and 2** (artboard "Option: circled 1 and 2") saves no width. The right-hand column's width is set by the zone shares ("between · 57%"), not by "primo" and "secondo". The numerals add a lookup and save nothing.

**Cost of no key.** Nothing tells a first-time reader why some lines are dotted. If you want help for that reader, choose the key beneath.

Any key lists only what its figure draws. The Tchaikovsky song has no findings, so its key has no dark-bar entry.

## Open question: where each label lives

| Label | Place | Leader |
|---|---|---|
| Line names (G2 to E4) | In the gap between the barline and the bars, level with their line | No |
| Sung accidentals (C♯3, F♯3) | The next column right, level with their row | No |
| "tessitura" | Right of the slim bracket, centred on it | No |
| "secondo", "primo" | At the right end of their dashed line | No |
| Zone shares | Right-hand column: above the secondo line, under it, and under the primo line | No |
| "half the singing" | Above the bracket (first clear place) | Only as a fallback |
| "centre A3" | Beside the tick, or just above or below it | Only as a fallback |
| Bar labels ("20%", findings) | After the bar's end; stacked 12.5 px apart when there are two | No |
| Title | Over the bars, left-aligned with them | No |
| Compass | Under the stave, centred on the two notes | No |

In the Tchaikovsky song the centre (A3) sits right on the primo line, so "centre A3" takes its second place, just above the tick.

## Open question: sizes on paper

10 px (7.5 pt) is my proposal for the smallest label. **NOT ESTABLISHED** that it reads at letter size: I could not print. A test print of page 2 of the HTML file at 100 percent would settle it.

## New and changed copy (English only; the desk drafts the French)

- "centre A3" is now one line: the existing key `insights.figure.centre` and the pitch, joined by a space. No new words.
- Key beneath (only if chosen): "shaded: the tessitura of the piece", "dashed: your passaggi", "dotted: a ledger line", "dark bar: a pitch with a finding".
- Circled numerals (only if chosen): "primo passaggio", "secondo passaggio".
- French layout: "la moitié du temps chanté" breaks after "du" to fit. This is a line break in existing copy, not new copy.

## Findings outside the brief

1. **The bars fail contrast today, and the band makes it worse.** `--rose` bars on cream are 2.91:1, under the 3:1 a graphic needs (WCAG 1.4.11). On the band they fall to 2.37:1 on cream and 2.75:1 on white. I kept the bars and the band at today's values. Two ways out: draw the band at 12 percent (bars 2.61 on cream, 3.06 on white), or draw the bars in a darker existing token. The second collides with `--rose-chip`'s role for the passaggi. This is your call.
2. **Source Sans 3 has no ♯ or ♭.** Every sung-pitch name takes its accidental from a fallback face, so "C♯4" mixes two typefaces. **NOT ESTABLISHED** which face the browser picks.
3. **Sung naturals on spaces have no name.** In the Tchaikovsky song, the E3 bar has no label, because only accidentals and stave lines are named. A first-time reader may not know which pitch it is. I did not change this.
4. **Zone shares can round to 101 percent.** The synthetic song shows 4, 34, and 63. **NOT ESTABLISHED** whether the live figure normalizes this.

## Not established

- The live render. Nothing here was measured in the running app, and the canvas was not opened in a browser to check it. The sizes rest on the component's stated width and the screenshot's proportions.
- Which score file is on the alias. The two Tchaikovsky voice files differ by a quaver or two on G♯3, G3, D♯3, and D4. Both give the same shares to the percent; I drew from the measure-phase1 file.
- The tessitura bounds, taken from the screenshot, not recomputed.
- The card's border colour, approximated as `--rose`.
- The section's sentence when a tempo is stated, so the synthetic pages omit it.
- Where Ilya already draws a circled 1 and 2. I did not find it in `markup/` or `score/`, so the numerals are drawn plainly.
- That 7.5 pt reads on paper.

## For the code, if you rule this in

The constants are JUDGEMENT throughout: stave step 11, bars 6 and 4.5, labels 10, title 9.5, barline at 150, tessitura bracket at 160, line names ending at 226, sung names ending at 254, bars from 260. The bar length is computed: what is left after the right-hand column, the bracket, and its labels.
