# Report, row 179, step 0: measure, keep nothing (cloud-lane-44, 2026-11-10)

Read on `cloud-lane-44` at `534d998` (three line ranges corrected in the step 1 commit after a re-count) (`origin/cloud-lane-38`), working tree clean, `pnpm install --frozen-lockfile` from a fresh checkout. Brief: `brief-code-gloss-language-and-reuse_r3_2026-11-03.md`. No code changed in this step.

## Baseline

All eight gates pass on the tip before any change (run together, 6 minutes 15 seconds): `test:phonology`, `test:dictionary`, `@ilya/web check`, `@ilya/web test`, `@ilya/score-parser test`, `test:blurb`, `test:integration`, `ratchets`.

`scripts/ratchets.json` holds `+page.svelte` at 5534 and `InspectorPanel.svelte` at 2432. Both files are at those numbers now, so neither can take a net line. Every step moves code out into a new module before it adds anything to either file. `i18n.ts` is exempt.

## The brief's citations, re-read on this tip

| thing | brief said | now |
|---|---|---|
| `GlossRow` | `types.ts:48` | `types.ts:49` |
| row written | `library.ts:122-126`, `:142-144` | `library.ts:142-146` (`glosses`), `:162-164` (`publishedGlosses`) |
| row read | `library.ts:79-84`, `:105-106` | `library.ts:85-90`, `:111-112` |
| row validated | `library.ts:206-215`, `:267-273` | `library.ts:230-239`, `:291-297`; the legacy driver has its own copy at `driver.ts:255-261` |
| `SongFields` pair | `library.ts:72-73` | `library.ts:52-53`, and `:74-75` for the poem pair |
| `glossOverrides`, `glossAnchors` | `document.svelte.ts:69-70` | `:71-72`; poem pair `:126-127` |
| `publishedGlosses` | `types.ts:210` | `types.ts:211` |
| `shownGlosses` | `+page.svelte:465` | `:466` |
| `handleGlossOverride` | `+page.svelte:2270-2287` | `:2239-2255` |
| `handleReset` | `:2294-2311` | `:2266-2280` |
| survival call | `:2290-2293` | `:2259-2262` |
| re-key | `:2039-2040` | `:2008-2009` |
| clear | `:2123-2124` | `:2092-2093` |
| `carryPoemEdit` call | `:2385` | `:2354` |
| Inspector, `<InspectorPanel>` props | `:4152` | `:4101-4102` |
| Paper | `:4361` | `:4310` |
| ReadingAid | `:4390-4397` | `:4335-4346` |
| `InspectorPanel` field, revert test, `hasOverrides` | `:841`, `:853`, `:378` | unchanged: `:841`, `:853`, `:378` |
| Inspector outside-click, word change | `:862-867`, `:833-836` | `:862-868`, `:833-836` |
| edit cell | `:1037-1047` | `:1036-1046` |
| `WordStack` gloss read | `:96` | `:104` (`glossOverride ?? word.gloss`); the pronoun strip is `:98-114` |
| `Paper` prop | `Paper.svelte:21` | `Paper.svelte:27` |
| `ReadingAid`, `VerseLine` prop | `:29`, `:13` | unchanged |
| `gloss-survival.ts` | `:21`, `:25`, `:20-37` | `:21`, `:25`, `:20-37` |
| `carryPoemEdit` signature | `witness-lines.ts:133-135` | `:133-135` |
| `resetWord` | `word-reset.ts:22-23`, `:31-32`, `:51`, `:57-58` | same numbers |
| `settle` on blur only | `settle-field.ts:44-48` | `:44-48` (`onBlur`; Enter blurs) |
| `storage.none` | `i18n.ts:1580` | `i18n.ts:1630` |
| `inspector.editGlossAria` | `i18n.ts:2374` | `i18n.ts:2480` |
| `formatGlossForDisplay` | `gloss.ts:105`, `:111`, `:113`, `:409-414`, `:430`, `:437-460` | same numbers |
| `lemma` | `lib/types.ts:120`, `pipeline.ts:464`, `:731` | `lib/types.ts:120`, `pipeline.ts:465`, `:732` |
| `profileStore.ts` | `:73`, `:293-314` | `saveStore` `:293-297`, `write` `:299-314`; `storage()` `:191-199`; empty store `:201-203` |

## What changed since the brief, and how I adapt

1. **The language re-run moved.** The brief cited `+page.svelte:439-446` for the pipeline re-running on `language`. On this tip the Lyrics lines are rebuilt by `handleLanguageChange` (`:3340-3358`, calling `runPipeline()`), and the Poem's lines are a `$derived` on `language` (`poemLines`, `:471-473`, `witnessLines(…, language, poemMarks)`). So `word.gloss` on either witness is in the current language by the time the page resolves a gloss. No scope change.
2. **There are two `survivingGlosses`.** `text/gloss-survival.ts:20-37` takes the line list; `text/witness-lines.ts:87-107` takes the text and is the one `carryPoemEdit` calls. The brief names only the first for the type change. Both change.
3. **`carryPoemEdit` and the song's `rekeyByWord`** are generic over the map's value (`rekeyByWord<T>`, `text-diff.ts:238`), so nesting the language pair under the key needs no change there.
4. **The Inspector prop is now `glossOverride?: string`** at `InspectorPanel.svelte:37`, as in the brief.
5. **`+page.svelte` now carries the print, Loupe-print, and poem-join wiring** (`:2237` onward) that did not exist at r3. None of it reads a gloss. There is no separate print path for glosses: the print is the Paper (checked by search, no other reader of `glossOverrides`, `publishedGlosses`, or `.gloss` outside the seven files in the table below).

## Questions the brief set for step 0

1. **Does `formatGlossForDisplay` fall back across languages for the short gloss?** French never falls back to English: `extractGloss` returns `''` for a plain English string in French (`gloss.ts:105`) and `g.fr || ''` for a bilingual object (`:111`). English falls back to French for a bilingual object with only French (`:113`, `g.en || g.fr || ''`). The lemma fallback (`attemptLemmaFallback`, `:483-517`) resolves in the same language. Same as the brief said.
2. **Do `ReadingAid.svelte` and `Paper.svelte` choose a gloss themselves?** No. `ReadingAid.svelte:29,40,73`, `Paper.svelte:27,46,96,157,178,201`, `TitlePage.svelte:29,58,119`, `SubsequentPage.svelte:25,52,88`, and `TextFitProbe.svelte:38,42,101` only pass the map down to `VerseLine.svelte:81` (`glossOverrides?.get(wordKey)`), which hands one entry to `WordStack`. The brief named three of these; there are five components between the page and `VerseLine`. One extra: `Paper.svelte:96` builds a redraw key with `JSON.stringify([…glossOverrides])`, so a map whose values are objects still stringifies, and a change of source or text changes the key.
3. **Does a binder export carry `glosses` and `publishedGlosses`?** Yes, whole. A binder holds each `SongRecord` as it is (`exchange.test.ts:104-112` pins `publishedGlosses`; `binder.test.ts:30,118` pins `glosses`), so a fourth element on a row travels with it and an older Ilya's reader keeps the song. `binder.ts` contains no gloss logic of its own (the file reads as binary to `grep`; searched with `-a`). The legacy `localStorage` driver (`driver.ts:246-261,314`) writes `record.glosses` back as it stands.
4. **What do `resetWord`, `carryPoemEdit`, and `settle` do with a gloss?**
   - `resetWord` (`word-reset.ts:43-61`) deletes the word's key from the gloss map and from the anchor map, and returns `null` for either where the key was absent.
   - `carryPoemEdit` (`witness-lines.ts:129-143`) re-keys both maps by the word diff, then drops any gloss whose anchor no longer stands there (`survivingGlosses` in the same file).
   - `settle` (`settle-field.ts:44-48`) calls `onsettle` on blur when the value differs from the last settled one. It never touches a gloss; it only flips the "Saved" note.

## Strings

All six strings the brief marks as RATIFIED are seated exactly. The brief marks none as a draft, so none is held behind a failing test. The brief gives no aria text of its own ("follows `inspector.editGlossAria`"), so the offer and the confirmation take their visible words as their accessible names and add no new string.

## What I could not establish

- Whether the brief's "poem view ⇒ `publishedGlosses`" and "Lyrics ⇒ `glossOverrides`" split should share one glossary entry. The brief says one glossary per device; I read that as yes, shared.
- How a phone keyboard moves the edit cell. That needs the phone-width run in the last step; nothing here measures it.
