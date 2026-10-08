# Brief for Code: every song gets a tempo, estimated when none is printed, and the singer can change it (r1, 2026-10-08)

Written by the desk (Opus) 2026-10-08 about 01:45. Model: Sonnet. For Code on the Mac. QUEUE row 48. Runs after rows 46 and 47.

## What the singer sees, and why

Today a score with no tempo prints *"This score states no tempo, so phonation time cannot be given in seconds."* (`insights.phonation.noTempo`, `apps/web/src/lib/i18n.ts:1665`), and every scanned song is such a score: homr emits no tempo (`third_party/homr-web/src/musicxml/generate-main.ts`), and Ilya's text recognition is off (`apps/web/src/lib/omr/homr-reader.ts:158`). The singer has no way to set one (`apps/web/src/lib/markup/MarkupPane.svelte:725-727`; N.120 unbuilt).

Dann, 2026-10-08 01:28 to 01:40: *"Failing all three, it returns something, and this something can be edited easily by the user."* After this brief: Ilya always gives a tempo. When none is printed it estimates one from the metre, says so, and shows a range; one tap opens a small control where the singer sets their own. Drawing: `docs/sessions/drawing-tempo-estimate_r1_2026-10-08.png` (its times are placeholders; its dotted-quarter glyph gap is the drawing's font).

## Ruled by Dann, 2026-10-08 01:28 to 01:40

Who offered what: the estimate, the editable value, and the receipt at Input in place of a question are Dann's ideas or his choices among the desk's offers; the metre rule, the range, the control's shape, and the ≈ sigil are the desk's, accepted by Dann.

1. **Precedence** (`packages/score-parser/src/tempo-seam.ts`, `resolveTempo` at `:387`): the singer's tempo, then a printed metronome mark, then a printed tempo word (Quantz's tiers, `tempo-terms.ts`, and the five-language lexicon, `tempo-lexicon.ts`, both as now; research of 2026-07-17, `claude/fit-tempo-tier-default-design_2026-07-17.md`), then **the metre estimate** (new). This replaces rung 4, "Nothing at all: abstain. Never a default bpm" (`tempo-seam.ts:12-19`, the 2026-07-17 design); update that comment to say what replaced it, when, and why: the estimate is labelled and editable, so it is never passed off as the composer's.
2. **The metre estimate** (DESK DEFAULT values, JUDGEMENT, editable by the singer). **Reuse `feltBeat` (`tempo-seam.ts:243`) and Dann's ruling inside it (2026-07-31: a number a singer cannot dial straight into a metronome fails).** Set the felt beat at a walking pace, **60 to 72 felt beats a minute**, as a range. Two departures, for the estimate only, from Dann's gravity reasoning of 2026-10-08 01:28 (the felt beat is the step a body takes): **3/8 takes the dotted quarter** (one to the bar), with the eighth as its `alternative`, where `feltBeat` with no tier defaults to the eighth; and **6/4, 9/4, 12/4 take the dotted half**, where `feltBeat` gives the quarter. Do not change `feltBeat` itself or the word path; wrap it for the estimate, and say in a comment why. No metre at all: the quarter at 60 to 72, "a walking pace". Where the metre changes, use the metre that holds the most bars (one tempo per song in this brief).
3. **A range, not a point**, carried through as the word band already is (`insights.ts:502`, `headlineInferred`): phonation time low to high.
4. **The singer's tempo**, song-wide, chosen in a small floating control that never prints: the beat unit and a number, with − and + and a typed value. **The beat unit is a row of note chips, and flexibility is the point** (Dann, 2026-10-08 01:44: *"3/8 is not always felt in one, but it often is. Sometimes it can feel like a sprightly 3/4. we need to allow flexiblity"*): where `feltBeat` returns an `alternative` (3/8 today; extend the same to 6/8, 9/8, 12/8, whose eighth is a fair second reading), both chips show, the active one marked, and one tap switches the unit **while keeping the speed** (♩. = 60 becomes ♪ = 180); the singer then sets the number as they feel it. Other metres show their felt beat and the next smaller note value as the second chip. No new words: the chips are glyphs from the notation font, with the existing note-value names as their accessible labels if they exist (report if they do not); "Use Ilya's estimate" returns to the estimate. Remembered per song with the song (a preference, not a derived value). Every readout that uses tempo follows at once (phonation time, cycle dose, the held-note flags, comments).
5. **Where it opens:** the "Change the tempo" link in Insights' phonation sentence, and the "Change" link in a new **TEMPO** receipt row in the Input band (under the SCORE row), which reads the tempo and its source: printed, estimated, or the singer's.
6. **Sigils** (`apps/web/src/lib/provenance.ts`): a printed tempo shows none (normal operation, `:5-6`); the singer's tempo uses the existing torso (`user-override`); Ilya's estimate uses a new sigil, **≈**, a text character like `ё`. Each printed sigil is decoded in the legend (Dann, 2026-08-21). The Insights sentence says "estimates" in words and carries no sigil.

## Not in this brief

Tempo marks at points (at carets in the Loupe), ritardando and accelerando spans, reading tempo words from scans, and phonation time across tempo changes (`phonation.ts:437-444` assumes one tempo). Those come with the Corrections design.

## The strings, ratified by Dann 2026-10-08 01:40

| key (Code names them; suggested) | English | French |
|---|---|---|
| `insights.phonation.estimatedMetre` | This score states no tempo. Ilya estimates {beat} = {low} to {high} from its {metre} metre, so you phonate for about {t1} to {t2}. | Cette partition n’indique aucun tempo. Ilya l’estime à {beat} = {low} à {high} d’après sa mesure à {metre}; votre phonation occupe donc environ {t1} à {t2}. |
| `insights.phonation.estimatedWalking` | This score states no tempo or metre. Ilya estimates {beat} = {low} to {high}, a walking pace, so you phonate for about {t1} to {t2}. | Cette partition n’indique ni tempo ni mesure. Ilya l’estime à {beat} = {low} à {high}, l’allure de la marche; votre phonation occupe donc environ {t1} à {t2}. |
| `insights.phonation.headlineYours` | You phonate for about {phonation} of this {length} piece, at {tempo}, your tempo. | Votre phonation occupe environ {phonation} des {length} de la pièce, à {tempo}, votre tempo. |
| `tempo.change` | Change the tempo | Modifier le tempo |
| `tempo.hint` | Your tempo. Every figure follows. | Votre tempo. Tous les résultats en tiennent compte. |
| `tempo.useEstimate` | Use Ilya's estimate | Utiliser l’estimation d’Ilya |
| `intake.tempo.label` | TEMPO | TEMPO |
| `intake.tempo.estimated` | estimated | estimé |
| `intake.tempo.printed` | printed | imprimé |
| `intake.tempo.yours` | your tempo | votre tempo |
| `legend.tempo-estimated` | tempo estimated by Ilya | tempo estimé par Ilya |

Typographic apostrophes in the French; no space before « ; » (the tree's French typography rule and its drift test). The receipt's "Change" link reuses an existing "Change" string if one exists; if none does, stop that part and report. Extend the torso's existing legend entry to cover a tempo only if its current words already fit; otherwise report it and leave it. `insights.phonation.noTempo` stays in `i18n.ts` with a comment that nothing shows it now; do not delete it. Write no other new text.

The beat glyph: draw it from the notation font Ilya already loads (SMuFL metronome note glyphs), not from a text font.

## Tests, checks, gates

- Unit tests: the precedence order; the felt beat for each metre listed and for an unlisted metre and no metre; the range carried to phonation time; the singer's tempo overriding a printed mark; reset to the estimate; the choice surviving a reload.
- Browser checks, English and French, desk and phone: the Tchaikovsky song (no printed tempo, 3/8) shows the estimate sentence with the dotted quarter at 60 to 72 and a range; set a tempo in the control and see the sentence, the receipt, and the cycle dose follow; reset. Screenshots in `docs/sessions/tempo-shots/`.
- All eight gates. Gate 4 baseline: the number rows 46 and 47 ship with (say which you started from). Name any number that moves.

## Report

`docs/sessions/report-code-tempo-estimate-and-control_r1_2026-10-08.md`: changes with `path:line`, each gate, the screenshots, and a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer. WRITTEN is not DONE: DONE is Dann's look on the alias.

No git writes of any kind. Dann ships.
