# Ratified: the loupe's dot words, English and French (2026-10-19)

**Ratified by Dann 2026-10-19 23:41:** *"Yes and soupir. AYou are right"* (transcribed as written), answering the desk's question of 23:40: "Do you ratify both tables, with « doublement pointée » and the rest's name standing alone?"

**His ask:** `docs/memory/INBOX.md`, 2026-09-09: the loupe's second line says "dotted quarter" (and the double-dot form) instead of "Quarter · Dot"; French to be shown to him. Found at risk by the audit of 2026-10-19 (`audit-opus-unbuilt-requests_r1_2026-10-19.md`, section 2, item 1).

**Who offered what:** "Dotted quarter" is Dann's English (2026-09-09). "Double-dotted" is the desk's English for his "double-dot form". The French is the desk's draft, adopted from the sources below. Nothing coined.

## Notes

| Value (today, EN · FR) | Dotted, EN · FR | Double-dotted, EN · FR |
|---|---|---|
| Whole · Ronde | Dotted whole · Ronde pointée | Double-dotted whole · Ronde doublement pointée |
| Half · Blanche | Dotted half · Blanche pointée | Double-dotted half · Blanche doublement pointée |
| Quarter · Noire | Dotted quarter · Noire pointée | Double-dotted quarter · Noire doublement pointée |
| Eighth · Croche | Dotted eighth · Croche pointée | Double-dotted eighth · Croche doublement pointée |
| Sixteenth · Double croche | Dotted sixteenth · Double croche pointée | Double-dotted sixteenth · Double croche doublement pointée |
| Thirty-second · Triple croche | Dotted thirty-second · Triple croche pointée | Double-dotted thirty-second · Triple croche doublement pointée |
| Sixty-fourth · Quadruple croche | Dotted sixty-fourth · Quadruple croche pointée | Double-dotted sixty-fourth · Quadruple croche doublement pointée |

Example: « B♭3 · Noire · Point » becomes « B♭3 · Noire pointée »; "B♭3 · Quarter · Dot" becomes "B♭3 · Dotted quarter".

## Rests

English keeps the readout's rule that a rest leads with the word (`apps/web/src/routes/+page.svelte:1112-1119`): "Rest · Dotted eighth".

French names each rest by its own word, alone on the line, in place of « Silence · <value> » (today `loupe.rest` « Silence », `i18n.ts:510`, then the note's value name):

| Rest | Plain | Dotted | Double-dotted |
|---|---|---|---|
| Whole | Pause | Pause pointée | Pause doublement pointée |
| Half | Demi-pause | Demi-pause pointée | Demi-pause doublement pointée |
| Quarter | Soupir | Soupir pointé | Soupir doublement pointé |
| Eighth | Demi-soupir | Demi-soupir pointé | Demi-soupir doublement pointé |
| Sixteenth | Quart de soupir | Quart de soupir pointé | Quart de soupir doublement pointé |
| Thirty-second | Huitième de soupir | Huitième de soupir pointé | Huitième de soupir doublement pointé |
| Sixty-fourth | Seizième de soupir | Seizième de soupir pointé | Seizième de soupir doublement pointé |

## Agreement, checked against each referent

Notes: all seven value names are feminine (la ronde ... la quadruple croche), so « pointée ». Rests: la pause and la demi-pause take « pointée »; le soupir, le demi-soupir, and the three names whose head noun is masculine (le quart, le huitième, le seizième de soupir) take « pointé ».

## Where it shows

- The loupe's second line: `apps/web/src/routes/+page.svelte:1125-1126` and `:1182-1183` (today `correct.dot`, `i18n.ts:341`, and `loupe.doubleDot`, `:604`, appended after the value name, `:343-349`).
- A tempo chip's spoken beat name: `apps/web/src/lib/tempo/beat-glyph.ts:33`, pinned at `apps/web/src/lib/tempo/tempo.test.ts:186`. A beat is never a rest.
- Unchanged: the Corrections dot cell keeps "Dot" / « Point » (`apps/web/src/lib/score/CorrectionSurface.svelte:580`), a control, not the readout.

## Sources (read 2026-10-19 23:3x to 23:4x)

- « ronde pointée », « blanche pointée », « noire pointée », « croche pointée »; « pause pointée », « demi-pause pointée », « soupir pointé », « demi-soupir pointé »: *Figures de notes et point d'augmentation*, https://oziasleduc.cssp.gouv.qc.ca/files/2020/05/figures-de-notes-et-point-daugmentation-sec1.pdf
- « la noire doublement pointée »: *Signes de durée*, https://lewebpedagogique.com/enmusac/files/2011/07/signes-de-dur%C3%A9e.pdf
- The seven rest names with their articles: *Figures de silences*, https://lewebpedagogique.com/enmusac/files/2011/07/figures-de-silences.pdf
- Open choice settled by the ratification: « doublement pointée » over « double pointée » (seen in a MuseScore user's forum post title, https://musescore.org/fr/user/4499366).
