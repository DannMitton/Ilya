# Code brief r3 (desk, 2026-11-03 21:1x): a singer's edited gloss carries its language, stays in its song, and a filled gap can be reused in one tap

Ruling: `../memory/OPEN.md`, "A SINGER'S EDITED GLOSS" (Dann 2026-11-03 14:22 to 14:32, «vos» ruled). r2 applied Fable's first review (12 amendments, `review-fable-gloss-language-and-reuse_r1_2026-11-03.md`). r3 applies Fable's review of r2, all 9 amendments (`review-fable-gloss-language-and-reuse_r2_2026-11-03.md`, SEND WITH AMENDMENTS, 146k Fable tokens), including two corrections Fable owned to its own r1. r1 and r2 are superseded. Strings RATIFIED by Dann 2026-11-03 20:21.

## The singer's walk (this governs; the code serves it)

Marie-Ève, a mezzo in Montréal, works in French on her phone. She taps a word; the Inspector opens; she taps the dictionary button and the panel unfolds with the gloss field on top (`InspectorPanel.svelte:1028-1047`).

1. **She types a French gloss into a field that showed nothing in French.** Each keystroke saves to the song (`InspectorPanel.svelte:849-858`). As she types, with the keyboard up, one line appears under the field: **Utiliser pour ce mot dans vos autres chants**, with a quiet **Pas maintenant**. It stays through **Enregistré** (which appears on blur, `settle-field.ts:44-48`) and is there again whenever she reopens the panel on this word while the gap remains.
2. **She taps it.** The line becomes **Utilisée dans vos autres chants**. If the device refuses storage (private browsing), the line says it could not be kept on this device, and the offer stays open.
3. **She notices a typo and fixes it** with the panel still open. The glossary entry follows the field. Once she closes the panel, the song's edit and the glossary entry part ways.
4. **She closes the panel or moves to another word without answering.** Nothing is spent. The offer returns the next time she opens the panel on that word, while the gap is still there. **Pas maintenant** hides it for this word in this song for the session; in another song where she fills the same gap, it offers again.
5. **Later, in another song,** the word shows her French. In the Inspector, the line under the field says **De vos autres chants**, with **Ne plus utiliser**, which removes it from her glossary and leaves the song alone. Blanking the field there writes that song's own "no gloss here"; the glossary text does not come back. After **Ne plus utiliser**, a fresh edit of that word can bring the offer back.
6. **She switches to English.** She sees the English gloss (the dictionary's, or her English edit), never her French one, and the reverse.
7. **She corrects a gloss the dictionary supplied.** The correction stays in its song. No offer appears.
8. **She taps Reset on a word.** The word goes back to the way Ilya had it, in both languages.

## What the code does today (read 2026-11-03 by the desk and by Fable; re-read before you change anything)

- The row: `GlossRow = [key, gloss, anchorWord]` (`apps/web/src/lib/library/types.ts:48`), written at `library/library.ts:122-126`, `:142-144` from `glossOverrides` and `glossAnchors` (`library/document.svelte.ts:69-70`); the poem view has its own pair, `publishedGlosses` (`types.ts:210`, `document.svelte.ts:121-126`). Read and validated at `library.ts:79-84`, `:105-106`, `:206-215`, `:267-273`.
- The edit: `handleGlossOverride` (`routes/+page.svelte:2270-2287`) sets or deletes the key on every keystroke from `handleGlossInput` (`components/Drawer/InspectorPanel.svelte:848-858`; 20 characters at most; equal to the dictionary gloss or empty reverts, `:853-855`).
- The panel closes on any outside click (`:862-867`) and on a word change (`:833-836`); on a phone these are the same tap as leaving.
- The Inspector's full-entry path falls back from French to English (`:895-898`, `resolveFullGloss` at `:1060`, the `EN` chip at `:1065-1069`). The short gloss `word.gloss` (`formatGlossForDisplay`, `packages/dictionary/src/gloss.ts`, read by Fable) never falls back from French to English (`:105`, `:111`), only from English to French (`:113`); it fills from curated glosses (`:409-414`) and from the lemma (`:430`, `:483-517`) when the raw field is empty, and blanks a grammatical raw gloss (`:437-460`). So the raw fields do not predict what the field shows; the field's own value does.
- The dictionary entry: `lemma` on the word data (`lib/types.ts:120`, `pipeline.ts:464`; `''` when the lookup fails, `:731`).

## Steps (one commit and one report per step, on `cloud-lane-32` from `origin/Shane`, push after each)

0. **Measure, keep nothing.** Confirm every reader in the table in step 1 against the tree. Report: whether `formatGlossForDisplay` falls back across languages for the short gloss; whether `ReadingAid.svelte` and `Paper.svelte` choose a gloss themselves or only pass the map; whether a binder export carries `glosses` and `publishedGlosses` (`types.ts:257-259`; `binder.ts`); what `resetWord` (`$lib/word-reset`), `carryPoemEdit` (`$lib/text/witness-lines`), and `settle` (`settle-field`) do with a gloss.
1. **Language on the edit, and one resolution point.**
   - Per-language values nest under the existing `"lineIndex-wordIndex"` key as one value `{ en?: string; fr?: string }` (no parallel maps; Fable r2 amendment 4), never a composite key, so `resetWord` deletes both languages at once (`word-reset.ts:51`, `:57-58`). The types that change from `Map<string, string>`: `library.ts:72-73` and the `SongFields` pair, `word-reset.ts:22-23`, `:31-32`, `gloss-survival.ts:21`, `:25`, `witness-lines.ts:133-135`; the pass-through props `Paper.svelte:21`, `ReadingAid.svelte:29`, `VerseLine.svelte:13` carry the resolved map instead. Keys stay `line-word`, so `rekeyByWord` (`+page.svelte:2039-2040`), `resetWord` (`:2298-2301`), `survivingGlosses` (`gloss-survival.ts:26-35`), and `carryPoemEdit` (`:2385`) keep working (amendment 11).
   - A stored row gains a fourth element, `'en'` or `'fr'`. `validateRecord` reads anything else there as absent, never as malformed. An older Ilya reads the row unchanged.
   - Legacy rows (no fourth element, or one that is not `'en'` or `'fr'`) read as `'en'` at load (`library.ts:81-84`, `:105-106`) and are written tagged on the song's next ordinary save. Nothing more: no migration pass, no both-languages mode. Dann 2026-11-03 15:21: he typed them in English, and until release his own stored songs are exploration, not data to conserve.
   - One function, desk name `glossFor(word, language, songEdits, glossary)`, returns `{ text, source: 'song' | 'glossary' | 'dictionary' | 'none' }`. The page resolves `shownGlosses` (`+page.svelte:465`) into a `Map<string, { text, source }>` once for the current language, hands it to `Paper` (`:4361`) and `ReadingAid` (`:4396`), which pass it through to `WordStack.svelte:96` unchanged, and hands the selected word's entry to the Inspector (`:4152`) for `:841`, `:853`, and `:378` (Fable r2 amendment 5). Every reader below receives that result:

     | reader | file and line |
     |---|---|
     | Paper word | `WordStack.svelte:96` |
     | Inspector field | `InspectorPanel.svelte:841` |
     | Inspector revert test | `InspectorPanel.svelte:853` |
     | Inspector "has overrides" | `InspectorPanel.svelte:378` |
     | Page, shown glosses for either witness | `+page.svelte:465`, `:4152`, `:4361` |
     | Reading aid (portrait) | `+page.svelte:4390-4397` |
     | Print | the Paper (`+page.svelte:2177-2179`) |
     | Write, read, validate | `library.ts:79-84`, `:105-106`, `:122-126`, `:142-144`, `:206-215`, `:267-273` |
     | Survival, re-key, reset, clear | `gloss-survival.ts:20-37` via `+page.svelte:2290-2293`; `:2039-2040`; `:2294-2311`; `:2123-2124` |

   - Reset clears the word's edit in both languages (amendment 9).
   - Tests: an English edit does not show in French and the reverse; Reset clears both; a legacy row shows in English and not in French.
2. **The personal glossary.** Stored in localStorage under a versioned key, on `profileStore.ts`'s pattern (`:73`; a save that returns an `Outcome` and never throws, `:293-314`; an empty store when storage is refused), never in the song record and never on the network (amendment 10). Keyed by (lemma, language), with the word form by `glossAnchorForm` (`gloss-survival.ts:11-13`) when the lemma is empty. DESK DEFAULT: one glossary per device, not per named voice. It fills a gloss only where the dictionary's displayed gloss for that language is empty (`word.gloss` as the pipeline computes it) and the song has no edit of its own; it never replaces a dictionary gloss. The fill reaches `WordStack` and the Inspector as its own value with `source: 'glossary'`, never through `glossOverride`, so `hasOverrides` (`InspectorPanel.svelte:377-379`) stays false and Reset does not appear for a word she did not edit; blanking the field on a filled word writes an explicit empty song edit (amendment 8).
3. **The offer, where her hand is** (walk items 1 to 5).
   - **The offer is a state of the field, not an event** (Fable r2 amendment 1). It renders in the dictionary panel's edit cell under the field (`InspectorPanel.svelte:1037-1047`) whenever all of these hold: the panel is open on this word; the song has a non-empty edit in this language; the dictionary's displayed gloss in this language is empty (`glossFor(...).source` would be `'none'` with the song edit and glossary set aside; the dictionary value is `word.gloss`, rerun on `language` at `+page.svelte:439-446`); there is no glossary entry for (lemma, language); and she has not said Not now for this word in this song. `settle` fires on blur only (`settle-field.ts:44-48`), so it is not the trigger.
   - Answers: the tap writes the glossary and the line becomes the confirmation. **Pas maintenant** / **Not now** hides the offer for this word in this song, keyed by the song's `"lineIndex-wordIndex"`, session state, never stored (DESK DEFAULT after Fable r2 amendment 7; the words say what the act does). Closing the panel, blurring, or changing word records nothing.
   - The tap reports its `Outcome`: on `ok` it confirms; on any other outcome (`no-storage`, `quota-exceeded`, `write-failed`, `profileStore.ts:299-313`) the line says it could not be kept on this device, in the words family of `storage.none` (`i18n.ts:1580`), and the offer is not spent.
   - After a tap, while the panel stays open on this word, further edits update the glossary entry too (amendment 5).
   - Where the field shows a glossary fill, the line under it reads **From your other songs** with **Stop using**, which deletes the glossary entry and leaves the song untouched (amendment 6). No glossary page in this build.
4. **Tests, gates, and the report.** The eight gates; a test for each walk item 1 to 8; a test that the offer is present on reopening the panel on an unanswered word; a test that Reset on an explicit empty edit over a glossary fill shows the fill again (`hasOverrides` is true for `''`, `InspectorPanel.svelte:377-379`); no change to any song's seating, IPA, or text. The report adds, from a phone-width run, whether the edit cell and the offer stay in view with the keyboard up. The report adds one line on how a lemma-keyed fill reads on an inflected form the singer did not write it for (amendment 12).

## Strings (RATIFIED by Dann 2026-11-03 20:21)

| key | English | French |
|---|---|---|
| `inspector.glossOffer` | Use for this word in your other songs | Utiliser pour ce mot dans vos autres chants |
| `inspector.glossOfferDismiss` | Not now | Pas maintenant |
| `inspector.glossOfferDone` | Used in your other songs | Utilisée dans vos autres chants |
| `inspector.glossOfferFailed` | Could not be kept on this device | Impossible de la conserver sur cet appareil |
| `inspector.glossFromGlossary` | From your other songs | De vos autres chants |
| `inspector.glossStopUsing` | Stop using | Ne plus utiliser |

French adopted from `lib/i18n.ts`: « chant » (`:1577`, `:1580`). Coined (Fable, desk adopting): « Pas maintenant », « Utilisée dans », « Impossible de la conserver sur cet appareil », « De vos autres chants », « Ne plus utiliser ». « Utilisée » and « la » agree with « glose », the interface's word (`i18n.ts:731`, `:2374`). Aria text follows `inspector.editGlossAria` (`i18n.ts:2374`).

## Recorded for Dann, not in this build

In English the short gloss falls back to French when an entry has only French (`gloss.ts:113`), unmarked. `WordStack.svelte:98-108` strips a leading English pronoun from any gloss, a singer's own edit included ("I love you" prints as "love you"). Whether a binder export carries the personal glossary, so a singer moving devices keeps her French.

## What you could not establish

Report it. NOT ESTABLISHED beats a complete invented answer.
