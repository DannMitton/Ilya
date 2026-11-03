# Code brief r2 (desk, 2026-11-03 15:5x): a singer's edited gloss carries its language, stays in its song, and a filled gap can be reused in one tap

Ruling: `../memory/OPEN.md`, "A SINGER'S EDITED GLOSS" (Dann 2026-11-03 14:22 to 14:32, «vos» ruled). r2 applies Fable's review, from the singer's point of view, all 12 amendments (`review-fable-gloss-language-and-reuse_r1_2026-11-03.md`, verdict SEND WITH AMENDMENTS, 155k Fable tokens). r1 is superseded. Strings are desk drafts, not ratified.

## The singer's walk (this governs; the code serves it)

Marie-Ève, a mezzo in Montréal, works in French on her phone. She taps a word; the Inspector opens; she taps the dictionary button and the panel unfolds with the gloss field on top (`InspectorPanel.svelte:1028-1047`).

1. **She types a French gloss into a field the dictionary left empty in French.** Each keystroke saves to the song (`InspectorPanel.svelte:849-858`). When she pauses, the quiet **Enregistré** note appears under the field (`:1043` `use:settle`, `:1046`). In that same place, while her thumb is still on the keyboard, one line offers: **Utiliser pour ce mot dans vos autres chants**, with a quiet **Pas maintenant**.
2. **She taps it.** The line becomes **Utilisée dans vos autres chants**. If the device refuses storage (private browsing), the line says it could not be kept on this device, and the offer stays open.
3. **She notices a typo and fixes it** with the panel still open. The glossary entry follows the field. Once she closes the panel, the song's edit and the glossary entry part ways.
4. **She closes the panel or moves to another word without answering.** Nothing is spent. The offer returns the next time she opens the panel on that word, while the gap is still there.
5. **Later, in another song,** the word shows her French. In the Inspector, the line under the field says **De vos autres chants**, with **Ne plus utiliser**, which removes it from her glossary and leaves the song alone. Blanking the field there writes that song's own "no gloss here"; the glossary text does not come back.
6. **She switches to English.** She sees the English gloss (the dictionary's, or her English edit), never her French one, and the reverse.
7. **She corrects a gloss the dictionary supplied.** The correction stays in its song. No offer appears.
8. **She taps Reset on a word.** The word goes back to the way Ilya had it, in both languages.

## What the code does today (read 2026-11-03 by the desk and by Fable; re-read before you change anything)

- The row: `GlossRow = [key, gloss, anchorWord]` (`apps/web/src/lib/library/types.ts:48`), written at `library/library.ts:122-126`, `:142-144` from `glossOverrides` and `glossAnchors` (`library/document.svelte.ts:69-70`); the poem view has its own pair, `publishedGlosses` (`types.ts:210`, `document.svelte.ts:121-126`). Read and validated at `library.ts:79-84`, `:105-106`, `:206-215`, `:267-273`.
- The edit: `handleGlossOverride` (`routes/+page.svelte:2270-2287`) sets or deletes the key on every keystroke from `handleGlossInput` (`components/Drawer/InspectorPanel.svelte:848-858`; 20 characters at most; equal to the dictionary gloss or empty reverts, `:853-855`).
- The panel closes on any outside click (`:862-867`) and on a word change (`:833-836`); on a phone these are the same tap as leaving.
- The Inspector's full-entry path falls back from French to English (`:895-898`, `resolveFullGloss` at `:1060`, the `EN` chip at `:1065-1069`). Whether the short gloss `word.gloss` falls back the same way (`formatGlossForDisplay` in `@ilya/dictionary`, `pipeline.ts:27-28`, `:349-355`) is NOT ESTABLISHED. The raw per-language fields are `fullGlossEn` and `fullGlossFr` (`pipeline.ts:374-392`, `:470-471`); the short gloss's per-language value is `tw.wordData.gloss`, typed `string | BilingualGloss` (`pipeline.ts:73`).
- The dictionary entry: `lemma` on the word data (`lib/types.ts:120`, `pipeline.ts:464`; `''` when the lookup fails, `:731`).

## Steps (one commit and one report per step, on `cloud-lane-32` from `origin/Shane`, push after each)

0. **Measure, keep nothing.** Confirm every reader in the table in step 1 against the tree. Report: whether `formatGlossForDisplay` falls back across languages for the short gloss; whether `ReadingAid.svelte` and `Paper.svelte` choose a gloss themselves or only pass the map; whether a binder export carries `glosses` and `publishedGlosses` (`types.ts:257-259`; `binder.ts`); what `resetWord` (`$lib/word-reset`), `carryPoemEdit` (`$lib/text/witness-lines`), and `settle` (`settle-field`) do with a gloss.
1. **Language on the edit, and one resolution point.**
   - Per-language values nest under the existing `"lineIndex-wordIndex"` key (a value `{ en?: string; fr?: string }`, or a parallel pair of maps), never a composite key, so `rekeyByWord` (`+page.svelte:2039-2040`), `resetWord` (`:2298-2301`), `survivingGlosses` (`gloss-survival.ts:26-35`), and `carryPoemEdit` (`:2385`) keep working (amendment 11).
   - A stored row gains a fourth element, `'en'` or `'fr'`. `validateRecord` reads anything else there as absent, never as malformed. An older Ilya reads the row unchanged.
   - Legacy rows (no fourth element) read as `'en'` at load (`library.ts:81-84`) and are written tagged on the song's next ordinary save. Nothing more: no migration pass, no both-languages mode. Dann 2026-11-03 15:21: he typed them in English, and until release his own stored songs are exploration, not data to conserve.
   - One function, desk name `glossFor(word, language, songEdits, glossary)`, returns `{ text, source: 'song' | 'glossary' | 'dictionary' | 'none' }` (amendment 2). Every reader calls it or receives its result:

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
2. **The personal glossary.** Stored in localStorage under a versioned key, on `profileStore.ts`'s pattern (`:73`; a save that returns an `Outcome` and never throws, `:293-314`; an empty store when storage is refused), never in the song record and never on the network (amendment 10). Keyed by (lemma, language), with the word form by `glossAnchorForm` (`gloss-survival.ts:11-13`) when the lemma is empty. DESK DEFAULT: one glossary per device, not per named voice. It fills a gloss only where the dictionary's raw field for that language is empty and the song has no edit of its own; it never replaces a dictionary gloss. The fill reaches `WordStack` and the Inspector as its own value with `source: 'glossary'`, never through `glossOverride`, so `hasOverrides` (`InspectorPanel.svelte:377-379`) stays false and Reset does not appear for a word she did not edit; blanking the field on a filled word writes an explicit empty song edit (amendment 8).
3. **The offer, where her hand is** (walk items 1 to 5).
   - Condition: the field has a non-empty edit, and the dictionary's raw field in this language (`fullGlossFr` or `fullGlossEn`, or the matching side of `tw.wordData.gloss`) is empty. Never read `word.gloss` for this test, since it may hold an English fallback in French (amendment 2's evidence). Not shown for a correction of a dictionary gloss.
   - Moment and home: inside the dictionary panel's edit cell, under the field, beside or in place of the Saved note (`:1046`), when the field settles (`:1043`). It stays while the panel is open on this word (amendment 3).
   - Answers: the tap writes the glossary and the line becomes the confirmation; **Pas maintenant** / **Not now** records "offered" for (lemma, language). Closing the panel, blurring, or changing word records nothing.
   - The tap reports its `Outcome`: on `ok` it confirms; on `no-storage` or `quota-exceeded` the line says it could not be kept on this device, in the words family of `storage.none` (`i18n.ts:1580`), and the offer is not spent (amendment 7).
   - After a tap, while the panel stays open on this word, further edits update the glossary entry too (amendment 5).
   - Where the field shows a glossary fill, the line under it reads **From your other songs** with **Stop using**, which deletes the glossary entry and leaves the song untouched (amendment 6). No glossary page in this build.
4. **Tests, gates, and the report.** The eight gates; a test for each walk item 1 to 8; no change to any song's seating, IPA, or text. The report adds one line on how a lemma-keyed fill reads on an inflected form the singer did not write it for (amendment 12).

## Strings (desk drafts for Dann; not ratified)

| key | English | French (draft) |
|---|---|---|
| `inspector.glossOffer` | Use for this word in your other songs | Utiliser pour ce mot dans vos autres chants (ruled 14:32) |
| `inspector.glossOfferDismiss` | Not now | Pas maintenant |
| `inspector.glossOfferDone` | Used in your other songs | Utilisée dans vos autres chants |
| `inspector.glossOfferFailed` | Could not be kept on this device | Impossible de la conserver sur cet appareil |
| `inspector.glossFromGlossary` | From your other songs | De vos autres chants |
| `inspector.glossStopUsing` | Stop using | Ne plus utiliser |

French adopted from `lib/i18n.ts`: « chant » (`:1577`, `:1580`). Coined (Fable, desk adopting): « Pas maintenant », « Utilisée dans », « Impossible de la conserver sur cet appareil », « De vos autres chants », « Ne plus utiliser ». Open choice for Dann: « Utilisée » and « la » agree with « glose » (feminine); NOT ESTABLISHED which word the French interface uses for a gloss. Aria text follows `inspector.editGlossAria` (`i18n.ts:2374`).

## Recorded for Dann, not in this build

`WordStack.svelte:98-108` strips a leading English pronoun from any gloss, a singer's own edit included ("I love you" prints as "love you"). Whether a binder export carries the personal glossary, so a singer moving devices keeps her French.

## What you could not establish

Report it. NOT ESTABLISHED beats a complete invented answer.
