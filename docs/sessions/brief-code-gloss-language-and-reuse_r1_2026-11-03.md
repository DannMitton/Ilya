# Code brief r1 (desk, 2026-11-03 14:3x): a singer's edited gloss carries its language, stays in its song, and a filled gap can be reused in one tap

Ruling: `../memory/OPEN.md`, last section, "A SINGER'S EDITED GLOSS" (Dann 2026-11-03 14:22 to 14:25). Read it first. This brief is reviewed by Fable before you get it (`CONTRACT.md` §1 item 19).

## What the singer sees

- She edits a gloss in English; switching to French shows the French gloss (the dictionary's, or her French edit), never her English one; and the reverse.
- She fills a gloss the dictionary lacked (most often in French). When she leaves the gloss field, one quiet line offers: "Use for this word in your other songs". One tap and the word's empty gloss fills in her other songs, in that language. She can ignore it; it is offered once per word and language.
- A correction of a gloss the dictionary supplied stays in its song. No offer appears.

## What the code does today (read 2026-11-03 by the desk; re-read before you change anything)

- The row: `GlossRow = [key, gloss, anchorWord]` (`apps/web/src/lib/library/types.ts:48`), written at `library/library.ts:122` from `glossOverrides` and `glossAnchors` (`library/document.svelte.ts:69-70`); the poem view has its own pair, `publishedGlosses` (`types.ts:210`, `document.svelte.ts:121-126`).
- The edit: `handleGlossOverride` (`routes/+page.svelte:2270`) sets or deletes the key on every keystroke from `handleGlossInput` (`components/Drawer/InspectorPanel.svelte:848-858`; 20 characters at most; equal to the dictionary gloss or empty reverts).
- The display: `glossOverride ?? word.gloss` (`components/Paper/WordStack.svelte:96`); the Inspector field shows the same (`InspectorPanel.svelte:841`). `word.gloss` is already resolved to the current language by the pipeline (`lib/pipeline.ts:336-352`, `extractGloss`, `formatGlossForDisplay`).
- Survival: `text/gloss-survival.ts` drops an edit whose anchor word no longer stands at its key.
- The dictionary entry: `lemma` on the word data (`lib/types.ts:120`, `pipeline.ts:464`, `:731`).

## Steps

0. **Measure, keep nothing.** List every site that reads or writes a gloss edit, both views (Lyrics and Poem), print, export, reset (`resetWord`), and survival. Report whether an export carries gloss edits today (NOT ESTABLISHED by the desk).
1. **Language on the edit.** A row gains its language (`'en' | 'fr'`); the edit maps hold one value per language per key. Display and the Inspector field read the edit for the current language only. A stored row with no language (only Dann holds data; `OPEN.md` 2026-11-01: no carry-over read needed) is DESK DEFAULT read as showing in both languages, as today, until the singer edits it, so nothing he typed vanishes. Survival, reset, and the poem view follow the same shape. Tests: an English edit does not show in French and the reverse; reset clears the current language's edit only (say in the report if you think both should clear, and why).
2. **The personal glossary.** A store on the device beside the songs, keyed by (lemma, language), with the word form when the lemma is empty. It fills a word's gloss only where the dictionary gloss in that language is empty and the song has no edit of its own. It never replaces a dictionary gloss. It sits beside the voice profiles (Dann 2026-11-03 14:25: *"personal glosses kept on the device will be right at home nerxt to the user's formant profile"*), on the same pattern as `apps/web/src/lib/voice/profileStore.ts` (localStorage under a versioned key like `shane.profiles.v2` at `:73`; a save that reports an `Outcome` and never throws; an empty store when storage is refused). DESK DEFAULT: one glossary per device, not per named voice: a gloss is the singer's reading of a word, not a property of a voice. Never to the network.
3. **The offer.** Shown when the gloss field loses focus or the dictionary panel closes, only if the dictionary gloss for this word in this language was empty and the singer's edit is not empty; not shown for a correction. Once per (lemma, language): a dismissal or a tap records that it was offered. The tap adds the gloss to the personal glossary and confirms in the same line. Strings: `TODO-FR` for the French; the desk drafts it for Dann (`OPEN.md` draft: « Utiliser pour ce mot dans vos autres chants »).
4. **Tests and gates.** The eight gates; tests for steps 1 to 3; no change to any song's seating, IPA, or text.

## Other sites that compute the same thing

Every site that decides which gloss a singer sees must agree after this: `WordStack.svelte:96`, `InspectorPanel.svelte:841`, the poem view's gloss path, print, and export. Step 0 lists them; the review checks this line against the tree.

## What you could not establish

Report it. NOT ESTABLISHED beats a complete invented answer.
