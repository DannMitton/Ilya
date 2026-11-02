# Report: consistency batch 1, step 2 (`names.ts`), r1, 2026-11-01

Branch `cloud-lane-24`, on top of step 1. Brief: `brief-code-consistency-1-screen-words_r2_2026-11-01.md`; shape from Fable's amendment 13 (`review-fable-brief-consistency-1_r1_2026-11-01.md`), copied verbatim.

## What changed, file by file

- `apps/web/src/lib/names.ts` (new, about 290 lines, under the 1000-line limit for an unlisted file): the types `Surface`, `Store`, `RetiredWord`, `Identifier`, `Persisted`, `Concept`, and `CONCEPTS`. A header comment says what the module is for, that nothing reads it yet (row 171's guard and batch 2's legend test will), and why every retired pattern says bare or phrase. 17 concepts: text, melody, insights, learn, guide, piece, input, voice, poem, lyrics, corrections, underlay, analysis, drawer, page, spotReduction, spotReconstitution.
- `apps/web/src/lib/names.test.ts` (new): every `nameKey` exists in English and French; no two concepts share an `id`; every `pattern` compiles with the `u` flag; every `bare` pattern begins and ends with `\b`; every pattern has a reason.

## Gates

| gate | result |
|---|---|
| web check | `svelte-check found 0 errors and 12 warnings in 5 files` |
| web test | `Tests  3789 passed \| 1 skipped (3790)` (baseline 3784 plus the 5 new) |
| `pnpm ratchets` | `ratchets: OK.` |

The other five gates are untouched by this step and were not re-run.

## Decisions I made, and where I departed from the review's example

1. **`scoreMarkup` sits under `voice`, not `melody`.** The review's example puts the `scoreMarkup` identifier and band id under the score document. `group.scoreMarkup` reads "Voice" / « Voix » (`i18n.ts`), and `BAND_IDS.scoreMarkup` is the Voice band's id (`sections.svelte.ts:106`). Filing it under MELODY would say the Voice band is renamed to melody. The `melody` record keeps `markup` → `melody` and `MarkupPane` → `MelodyPane`.
2. **The `page` concept reads `drawer.paper`** (today "Paper" / « Papier »). Its gender is written for the ruled target « la page » (f.), not today's « Papier » (m.); step 3 changes the value.
3. **The retired lists hold only patterns I could ground in a line I read.** `Transcribe and fit`, `click Transcribe`, `cliquez sur Transcrire`, `Transcription tab`, and `l'onglet Transcription` come from `input.transcribe` and `GuideContent.svelte` (EN `:437`, `:398`; FR `:98` to `:141` region). `Réduction ciblée` and `Reconstitution ciblée` are phrases because « ciblée » alone is ordinary (`LearnContent.svelte`, « attention ciblée », « annotations ciblées »). « poignée » is a phrase (`poignée du Tiroir`) so « une poignée d'échantillons » (`GuideContent.svelte:67`) passes.

## NOT ESTABLISHED

- **The LOUPE has no record.** No i18n key holds the word LOUPE as a name (a search for a value "Loupe" finds none), so a `nameKey` cannot be given. It needs a key before it can have a record; I did not invent one.
- **`insights` carries `\bFit\b`.** The sources say the document family was developed under the codename and shown as Fit until 2026-09, but I did not establish which of the two documents carried the word on screen (`DeskHead.svelte` says the document "was never called Fit"). The pattern is attached to `insights` as the safer home; a sentence-initial verb "Fit" would trip it.
- **The Guide's retired phrases at their exact current lines** were found by search, not by a full read of `GuideContent.svelte`; row 171 owns that census.
- **`retiredIdentifiers` is empty** everywhere, as the type's comment says, until batch 3.
- **`Store` values `indexedDB` and `localStorage` are not used by any record yet**; they are in the type as the review gave it.
