# Brief for Code: the tessituragram, refined (r1, 2026-10-07)

Written by the desk (Opus) 2026-10-07 about 22:55. Model: Sonnet. For Code on the Mac. QUEUE row 42.

## What the singer sees, and why

A singer opens Insights and meets the tessituragram first. Many have never seen one. Today its labels are 7.5 to 8 px on white halos, the tessitura band runs under every label, and the bars fail contrast. After this brief: the labels are larger and need no halos, the band sits only behind the bars, a slim bracket marks the tessitura on the stave, the bars pass contrast, and one quiet line under the figure explains its three marks.

**The design to build is Design's return**, read in full by the desk: `docs/sessions/design-tessituragram-refined_r1_2026-10-07.md` (the notes; read all of it, especially "For the code, if you rule this in" and the table under Ruling 5) and `design-tessituragram-refined_r1_2026-10-07.html` (eight drawings; drawing 1 is the Tchaikovsky figure on screen, drawing 2 as printed, drawing 7 the key). Build drawing 1, with the changes ruled below.

## Ruled by Dann, 2026-10-07 20:45 to 22:48

Who offered what is marked. Each is a default with its reason.

1. **No halos.** (Dann.) Remove the `.halo` class and its paper stroke (`apps/web/src/lib/insights/Tessituragram.svelte:383` onward, `:460-462`). Labels find clear places instead, as Design's notes section "Ruling 1" describes.
2. **Leaders, only where a label cannot sit beside its element:** a solid hairline (0.6 px, `--rose-ink`), no arrowhead, as long as the distance needs. (Dann.) Follow Design's fallback order for "half the singing" and "centre A3" (notes, "Ruling 2"). Design's diagonal fallback leader has never been seen drawn; add a unit case that forces it and screenshot it.
3. **One treatment for both pitch-name columns:** same face, same weight (Design: 500 at 10 px); line names in `--ink-tertiary`, sung pitches in `--rose-ink`. (Dann; the weight is Design's.)
4. **The band from the bars' baseline to 4 px past the longest bar; a slim bracket beside the barline labelled "tessitura".** (Dann's trim; the bracket is the desk's option, chosen by Design because Dann's left end would put the grey names on the band at 3.95:1; accepted by the desk as a DESK DEFAULT.)
5. **Larger ink:** labels 10 px, title 9.5 px caps with 0.06 em tracking, stave step 11, bars 6 and 4.5 (Design's table under Ruling 5; all JUDGEMENT). (Dann asked; the values are Design's.)
6. **Bar colours, for contrast:** normal bars `--rose-chip` (about 4.6:1 on cream; `--rose` is about 2.9:1, under the 3:1 a graphic needs); a bar with a finding stays `--rose-ink` and keeps its label in weight 600; the passaggio dashed lines move to `--rose-ink`. (The desk's recommendation; Dann, 22:37: *"I agree to your recommendation."*) Update the colour-roles comment at the top of the component (`:15-17`).
7. **A one-line key directly under the figure**, left-aligned with the bars, inside the card (not at the card's bottom: the card also holds the compatibility table). Each entry is its mark drawn small, then its words. It lists only what this figure draws: no tessitura, no tessitura entry; no passaggi typed, no dashed entry; no ledger line under the bars, no dotted entry. (Dann wanted the key on one line; the placement under the figure and the words below are the desk's, ratified 22:48.)

## The key's strings, ratified by Dann 2026-10-07 22:48

| key (Code names them; suggested) | English | French |
|---|---|---|
| `insights.figure.key.tessitura` | tessitura | tessiture |
| `insights.figure.key.passaggi` | your passaggi | vos *passaggi* |
| `insights.figure.key.ledger` | ledger line | ligne supplémentaire |

The asterisks mark italics, as in the existing `insights.figure.primo` (`i18n.ts:1696`); render them with the same `italicRuns` the component already uses. No other new text. If a string is needed that is not here, stop that part and report; write no French.

## Desk defaults inside this brief (reversible; Dann may wave any off)

- **One bar scale for both languages.** Design found the French right-hand column shortens the longest bar (152 px in English against 137 in French). Take the length from the longer language so English and French pages draw the same bars. (Design's recommendation.)
- **Zone shares always sum to 100.** Design's synthetic song printed 4, 34, and 63. Round by largest remainder. First check whether the live code already normalizes (`insights.ts`, the zone shares); report what it did.
- **The ♯ and ♭ in pitch names come from one face.** Source Sans 3 has no ♯ or ♭ (Design), so names mix faces today. Use the face Ilya already uses for accidentals in prose elsewhere (find it; `pitchLabel` in `apps/web/src/lib/voice/note-picker.ts` is the place to start), and say which.
- **Not in this brief:** naming a sung natural on a space (Design's finding 3, the unnamed E3). Leave it as it is and list it in the report.

## Things to check

- **Page fitting.** The figure grows about 55 percent (Design: about 147 px to 228 for the Tchaikovsky song). The page-fitting estimates near `insights.ts:781` assume today's height. Check them and correct them, so Insights still paginates as before or better. Report what moved.
- **The extremes**, each in a unit test or a screenshot: one or two pitches; two octaves; no passaggi; no tessitura; seconds (a stated tempo) and quavers; a bar with two findings.

## Tests, screenshots, gates

- Screenshots, English and French, at desk 1440 x 900 and as printed (white paper, the print override in `app.css`), of the Tchaikovsky song from Dann's library or the Tchaikovsky PDF; put them in `docs/sessions/tessituragram-shots/`. Compare drawing 1 and drawing 2 of Design's HTML beside them.
- All eight gates. Name any number that moves and the tests that move it. Gate 4 baseline `1955`. Ratchet ceilings: if `Tessituragram.svelte` or `insights.ts` passes its ceiling, say by how much and why.

## Report

`docs/sessions/report-code-tessituragram-refined_r1_2026-10-07.md`: every change with `path:line`, each gate, the screenshots, what the share-rounding check found, which face carries ♯, what moved in page fitting, and a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer. WRITTEN is not DONE: DONE is Dann's look on the alias and a printed page.

No git writes of any kind. Dann ships.
