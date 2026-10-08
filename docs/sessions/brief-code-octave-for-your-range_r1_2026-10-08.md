# Brief for Code: the voice line read an octave up or down for the singer's range, said in one quiet line (r1, 2026-10-08)

Written by the desk (Opus) 2026-10-08 about 01:22. Model: Sonnet. For Code on the Mac. QUEUE row 47. Runs after row 46.

## What the singer sees, and why

A low voice browsing a high anthology, or a high voice browsing a low one, should see Insights and Markup describe the song as they would actually sing it: an octave down or up, note names unchanged, the printed score untouched. Today Ilya does half of this: `resolveVocalReadingOctave` (`packages/score-parser/src/vocal-octave.ts`) reads a **treble-clef** voice part an octave **down** when that fits the singer's typed range strictly better; Insights (`apps/web/src/lib/insights/InsightsPane.svelte:142`) and Markup (`apps/web/src/lib/markup/MarkupPane.svelte:540-548`) use it, and Markup shows a long notice (`profile.octaveNotice`, `i18n.ts:1316`).

Dann, 2026-10-08 01:11 to 01:20, on a mezzo who sang Mussorgsky's *Sunless* an octave up with great success: *"I think we should let it benefit high voices browsing low anthologies."* Drawing: `docs/sessions/drawing-octave-line_r1_2026-10-08.png` (the bars in it are placeholders).

## Ruled by Dann, 2026-10-08 01:17 to 01:20

Who offered what: the upward direction is Dann's; the quiet line, the one-tap return to "as written", the guard, and the circled 8 are the desk's, accepted by Dann (01:17: *"you should make it so"*; 01:20: *"let's implement this and see how it feels"*).

1. **Either direction, from any clef, by one octave at most.** Read the voice line as written, an octave down, and an octave up; keep the reading that fits the singer's typed range **strictly better** than as written. A line that fits as written is never moved. Never more than one octave. No typed range: no shift, as now.
2. **The explicit octave-clef branch is unchanged** (the treble-8vb handling and its measured notes at `vocal-octave.ts`, the `marked <= -1` block). Do not disturb it.
3. **One quiet line wherever the shift applies**, in Insights (under the phonation section's sentence, as drawn) and in Markup (replacing today's long `profile.octaveNotice` there, so both tabs say it the same way). A small circled 8 opens the line (Ilya's glyph-in-circle style), then the words, then a tap.
4. **One tap returns the song to "as written"**, and a tap there returns it to "for your range". The choice is the singer's, per song, remembered with the song (DESK DEFAULT: it is a preference, not a derived value). When the choice is "as written", every readout uses the written pitches.
5. Pure and non-destructive, as now: the shift is derived; the stored score is never altered.

## The strings, ratified by Dann 2026-10-08 01:20

| key (Code names them; suggested) | English | French |
|---|---|---|
| `octave.readLower` | Voice line read an octave lower, for your range | Ligne vocale lue une octave plus bas, pour votre ambitus |
| `octave.readHigher` | Voice line read an octave higher, for your range | Ligne vocale lue une octave plus haut, pour votre ambitus |
| `octave.asWrittenState` | Voice line as written | Ligne vocale telle qu’écrite |
| `octave.toAsWritten` | As written | Telle qu’écrite |
| `octave.toForRange` | Read for your range | Lire pour votre ambitus |

Typographic apostrophe in the French. The line reads: circled 8, the state sentence, a middle dot, the tap. In the "as written" state the line shows only when a shift would apply (so a song that fits as written shows no line at all). Leave `profile.octaveNotice` in `i18n.ts` with a comment that it is retired from Markup; do not delete it. No other new text; if one is needed, stop that part and report.

## Tests, checks, gates

- Unit tests in `vocal-octave` for: a treble line high for a bass (down, as now); a bass-clef line low for a mezzo (up, new); a line that fits as written (no shift); a line that fits neither better (no shift); the 8vb branch unchanged.
- Component checks: the line appears in both tabs only when a shift applies; the tap flips it and every readout follows; the choice survives a reload.
- Screenshots, English and French, of Insights and Markup in both states, into `docs/sessions/octave-shots/`. For the upward case, use any bass-clef song in the dev library with a temporary typed range for a mezzo (for example A3 to A5) and say which song.
- All eight gates. Gate 4 baseline: the number row 46 ships with (1991 if row 46 has not moved it; say which you started from). Name any number that moves.

## Report

`docs/sessions/report-code-octave-for-your-range_r1_2026-10-08.md`: changes with `path:line`, each gate, the screenshots, and a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer. WRITTEN is not DONE: DONE is Dann's look on the alias.

No git writes of any kind. Dann ships.
