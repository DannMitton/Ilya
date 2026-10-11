# Report: placeholder vowels are labelled (QUEUE row 69, r1)

**QUEUE row 69, state: WRITTEN, pushed to `cloud-lane`. Markup and Insights now name every placeholder vowel the page uses, in the ratified words, and every finding that rests on one is drawn dashed or says so. Five new strings are PROPOSED in both languages and wait for Dann; they are listed in "For Dann".** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-11, for `docs/sessions/brief-code-placeholder-vowels-labelled_r1_2026-10-11.md`, on `cloud-lane` fast-forwarded to `origin/Shane` at `8cc62024`, clean tree before the first edit. Row 34 is not built yet, so this row is built against today's squircle. The dash survives row 34's reshaping because it is applied to whatever mark the renderer draws (`placeholderMark`), not to the old rectangle's geometry.

## Pictures

All in `docs/sessions/placeholder-shots/`, of *Without Sun*, no. 1 (`sunless-01-engraved.musicxml`), a bass voice with three vowels sampled. `before-*` is `8cc62024`; `after-*` is this commit. Desktop is 1440 px; phone is 390 px.

- **Voice A, [a], [o], and [u] sampled.** The song's one crossing falls on [i], a placeholder for this voice, so the red squircle draws dashed.
  - Markup page 1: `before-markup-{en,fr,en-phone,fr-phone}.png` and `after-markup-…` (the same four).
  - Insights pages 1 to 3: `before-insights-{en,fr}-p{1,2,3}.png`, phone pages 1 to 6, and the matching `after-…`.
- **Voice B, [i], [a], and [u] sampled.** Here a comment lands on a placeholder ([ɑ], bar 11), so the dashed comment shows.
  - Desktop: `after-iau-insights-en-p2.png`, `after-iau-insights-fr-p2.png`, and `after-iau-insights-en-p3.png` (the vowel figure).
  - Phone: `after-iau-insights-{en,fr}-phone-p4.png`.
- **Print** (Chromium print media, Letter, rendered back to images): `print-markup-en-{1,2,3}.png`, `print-insights-en-{1,…,4}.png` (voice A), and `print-iau-insights-en-2.png` (voice B, with the dashed comment).

Measured on the live page, counts of `[data-placeholder]` elements:

| Voice | Markup marks | Markup crossings dashed | Insights comments marked |
|---|---|---|---|
| A | 150 | 1 of 1 | 0 |
| B | 81 | 0 of 1 (the crossing is on sampled [i]) | 1 |

Under print media the line is visible on both pages, the dashed marks are visible (104 on Markup, 7 on Insights for voice A), and the dashed comment's rule computes as `dashed` (voice B).

## The changes

### The data

- `packages/score-parser/src/analysis-types.ts:212-218`: `AnalyzedEvent.placeholder?: true`. It means this note's vowel's fR1 is a placeholder.
- `packages/score-parser/src/overlay-engine.ts:231`: set when `profile.fR1Source[vowel] === 'surrogate'`. A `'derived'` vowel is not flagged, as the brief says.

### The line at the top (ratified words)

- `apps/web/src/lib/i18n.ts:1793-1794`: `placeholder.line.many` and `placeholder.line.one`.
  - English is RATIFIED.
  - The French plural is RATIFIED. The French singular is DESK-DERIVED, and the comment above the keys says so.
  - The apostrophes are typographic (U+2019): « jusqu’à », « l’échantillonniez ». The brief typed straight ones; the French spelling test requires these.
- `apps/web/src/lib/analysis/placeholder-line.ts` (new):
  - `placeholderVowels` names the placeholder vowels the page's notes use, in roster order.
  - `placeholderLine` builds the line, joining vowels with `profile.provisional.listSep*`.
- `apps/web/src/lib/components/Paper/TitleHeader.svelte:50`: `note` takes several lines.
- `TitleHeader.svelte:207-209`: each line prints under the title, with bracketed vowels in the IPA face. The key ruler's line, when there is one, comes first.
- `apps/web/src/lib/markup/MarkupPane.svelte:713`, `:980`: Markup page 1 prints the line.
- `apps/web/src/lib/insights/InsightsPane.svelte:162`, `:491`: Insights page 1 prints the line, as does the phone flow, which draws the same header.

### Markup: what is dashed

`packages/score-parser/src/placeholder-mark.ts` (new) holds the helper, because the renderer stands at its size ceiling. Every mark it touches carries `data-placeholder="true"`.

| Mark | How it shows | Where |
|---|---|---|
| Crossing squircle (`data-analysis="crossing"`) | Dashed stroke, `3 2` | `staff-renderer.ts:3125` |
| Turning notehead | Its own outline, dashed `2 1.2` at 1.2 px, in lavender (DESK DEFAULT) | `:3052`, `:3054` |
| Turning ledger lines | Dashed stroke | `:3036` |
| Turning accidental | Solid, tagged only (DESK DEFAULT) | `:3045`, `:3047` |
| "Places to watch" line on the notes page | Its own sentence after the line (proposed words) | `apps/web/src/lib/analysis/gates.ts:298-323`; `MarkupPane.svelte:859` |

- **Turning accidental.** A sharp drawn as a dashed outline was hard to read at stave size in the first pictures. The acceptance criterion puts legibility first, so the accidental stays solid and the dashed head beside it marks the turning note.
- **Watch lines.** A line is flagged only when its kinds are computed from fR1: crossing, cover, tracking, turnover, or timbre. Range, passaggio, and sustain lines are not flagged.

The renderer stays line-neutral: `staff-renderer.ts` is 3490 lines, under its 3494 ceiling.

### Insights: what says so

- **A comment whose firing reads a placeholder fR1:**
  - It carries its own sentence and a dashed rose rule at its left (`singer-blocks.ts:258-266`; `SingerBlock.svelte:47-53`, `:360-371`).
  - This also applies behind "more" (`SingerBlock.svelte:91`).
- **The comment's frame no longer says "sung" for a placeholder vowel.**
  - The ratified frame read "the first resonance of your sung [ɑ]", which is false for a placeholder.
  - For a placeholder vowel it now takes a variant without "sung" (« chanté »), PROPOSED (`i18n.ts:1836-1838`; `comment-text.ts:295-296`, `:341`, `:446-450`; `InsightsPane.svelte:233`).
- **The vowel figure:**
  - A row whose turn rests on a placeholder draws its bars as dashed outlines.
  - The figure carries one sentence naming those vowels (`singer-blocks.ts:341-352`; `SingerBlock.svelte:136`, `:140`, `:346-358`).

## Tests

- **Gate 5, +12, in `packages/score-parser/src/placeholder-mark.test.ts` (new):**
  - The helper's three styles.
  - The overlay engine flags `'surrogate'` and not `'derived'` or `'sung'`, and flags nothing without a source record.
  - The renderer, in primitive and in SMuFL glyphs:
    - the crossing on a placeholder vowel is dashed;
    - only that vowel's turning marks are dashed;
    - the accidental is never outlined;
    - a fully sung voice has no dash anywhere.
- **Gate 4, +14:**
  - `apps/web/src/lib/analysis/placeholder-line.test.ts` (new, 8). It pins all four line strings character for character, the roster order, and the pair join.
  - `singer-blocks.test.ts` (+4). A comment's sentence appears in English and in French. There is no sentence on a sampled vowel or on a comment that reads no resonance. The vowel figure dashes the right row and carries its sentence.
  - `comments.test.ts` (+1). No frame calls a placeholder vowel "sung", in either language.
  - `gates.test.ts` (+1). A timbre line on a placeholder gains the sentence; a passaggio line does not.
- No existing test changed.

## The eight gates

All pass. Baselines are `origin/Shane` at `8cc62024`.

1. `pnpm test:phonology`: 251 passed (251)
2. `pnpm test:dictionary`: 242 passed (242)
3. `pnpm --filter @ilya/web check`: 0 errors and 12 warnings in 5 files. This needed `pnpm install --frozen-lockfile` first, since Shane added `onnxruntime-web`.
4. `pnpm --filter @ilya/web test`: 2167 → **2181** passed (+14)
5. `pnpm --filter @ilya/score-parser test`: 653 → **665** passed, 5 skipped (670) (+12)
6. `pnpm test:blurb`: 145 passed (145)
7. `pnpm test:integration`: 55 passed (55)
8. `pnpm ratchets`: OK

## DESK DEFAULTS taken

- **Placeholder is judged on fR1 alone.** Every Markup mark and every Insights comment is computed from fR1.
  - Row 17 can also fill a stand-in fR2 for a vowel whose fR1 was sung.
  - The line does not name such a vowel: "until you sample it" would be false for a vowel already sampled.
- **The line names only the vowels this page's notes use.** A placeholder vowel the song never sings is not named.
- **The turning notehead becomes a dashed outline** and the turning accidental stays solid, for the legibility reason given in "Markup: what is dashed".
- **The stems are not dashed.** Stem direction states timbre, which is computed from fR1, but a stem is engraving ink, and a dashed stem would read as a damaged score. The dashed turning head on the same note already marks it. Listed for Dann.
- **Three things carry no mark of their own:**
  - Insights' ring ("45% of your singing lies past the turn"), whose total includes placeholder rows.
  - The conclusion's line "One note meets a vowel's first resonance".
  - Markup's turning layer as a whole (only its marks are dashed).

  Their placeholder content is marked where it appears in full: the vowel figure's sentence, and the comment it points to.
- **No italics** for the new Insights sentences. They print in the rose ink at 13 px, to avoid the English-italics question still open from row 66.

## For Dann

1. **Five PROPOSED strings, both languages, [FR: desk draft for Dann]**:
   - `placeholder.comment`: "This finding rests on a placeholder value for [ɑ]." / « Ce constat repose sur une valeur par défaut pour la voyelle [ɑ]. »
   - `placeholder.turns.one`: "The turn of [ɛ] rests on a placeholder value, so its bar is drawn dashed." / « Le changement de timbre de la voyelle [ɛ] repose sur une valeur par défaut : sa barre est tracée en pointillé. »
   - `placeholder.turns.many`: "The turns of [e], [ɪ], and [o] rest on placeholder values, so their bars are drawn dashed." / « Les changements de timbre des voyelles … reposent sur des valeurs par défaut : leurs barres sont tracées en pointillé. »
   - `comment.working.where.abovePlaceholder` and `…underPlaceholder`: the ratified frame with "sung" (« chanté ») removed, "of your [ɑ]" / « de votre [ɑ] ». This changes ratified wording for a placeholder vowel only; the sung case is unchanged.
2. **The French singular of the line** is the desk's derivation from your ratified plural.
3. **Taste:**
   - Whether a dashed outline is the right look for a turning notehead. It resembles an open head; the pictures show it.
   - Whether the turning accidental should also change.
   - Whether stems should carry any mark.
4. **With few vowels sampled, much of the page is dashed.** Voice A shows 150 dashed marks on Markup. That is the honest state of such a voice, and the line says how to end it.

## Found, not fixed

- **A large gap on Markup page 1.** The first system sits low, with blank space under the title. It is in the `before-markup-*` pictures too, so it predates this row.

## Could not establish

- **Dann's own voice.** His profile is in his browser. The pictures use two built voices with three vowels sampled each.
- **A real print dialogue.** Print was checked with Chromium's print media and `page.pdf`, not a printer or Safari's dialogue.
- **Whether row 34's squircle keeps the dash.** Not yet built. The dash rides on the mark the renderer emits, so it should, and row 34's report will check it.
