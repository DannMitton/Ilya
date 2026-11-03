# Fable review: brief-code-gloss-language-and-reuse_r1 (2026-11-03)

Brief reviewed: `docs/sessions/brief-code-gloss-language-and-reuse_r1_2026-11-03.md`, read in full. Reviewed from the singer's position first (Dann's ruling of 2026-11-03: friendliness, intuitiveness, and ease drive the design), then as an engineer. Every code claim carries a file and line that I read in this session. The upload holds part of the tree; what I could not read is listed under NOT ESTABLISHED, and `OPEN.md` itself was not in the upload, so the ruling is known to me only as the brief quotes it.

## Verdict

**SEND WITH AMENDMENTS.** Twelve amendments. The data model (language on the edit, a device glossary that fills gaps only, song edit outranks glossary) is right and the code supports it. The offer's moment and home are designed from the code's events (blur, panel close) rather than from the singer's hand, and on a phone the offer can vanish in the same tap that was meant to show it. Three amendments are about safety (a wrong-language test, a lost legacy edit, a tap that confirms a save that failed); the rest make the walk shorter.

## The singer's walk (written first, since the brief has none)

Marie-Ève, a mezzo in Montréal, works in French on her phone. She has pasted a Rachmaninoff song. She taps a word on the Paper; the Inspector opens in the drawer (`routes/+page.svelte:4136-4154`). She taps the dictionary button; the sage panel unfolds with one text field on top and the full entry under it (`InspectorPanel.svelte:1028-1047`). The field shows the dictionary's gloss, or whatever French the dictionary has, or an English gloss with a small `EN` chip in the full entry when there is no French (`InspectorPanel.svelte:895-898`, `:1065-1069`).

1. **She types a French gloss into the empty field.** Every keystroke saves to the song (`InspectorPanel.svelte:849-858` calls `onglossoverride` on each `input` event; `+page.svelte:2270-2287` writes the map; the document autosaves). After a pause, the quiet note **Enregistré** appears under the field (`:1043` `use:settle`, `:1046` `SavedNote`). Her thumb is still on the keyboard.
2. **She wonders nothing yet.** This is the right moment for an offer: her attention is on this field, the keyboard is up, and a line under the field is in her eye line.
3. **She taps away**, to the next word on the Paper. Three things happen in that one tap: the field blurs; the click-outside listener closes the panel (`InspectorPanel.svelte:862-867`); and the selected word changes, which also closes the panel (`:833-836`) and re-renders the Inspector for the new word. Under the brief as written, the offer is "shown when the gloss field loses focus or the dictionary panel closes". At that instant there is no panel to show it in, and the Inspector now describes a different word. If the offer is drawn anywhere in the new word's Inspector, she reads a line about a word she has left. If it is not drawn, she never sees it, and if the brief's "a dismissal records that it was offered" counts that as a dismissal, she has lost it for this word in French for good.
4. **Later, in another song**, the same word shows her French. She did not ask for it, and the Inspector field shows it exactly as a dictionary gloss would (`InspectorPanel.svelte:841` reads `glossOverride ?? word.gloss`). She wonders: did the dictionary learn French? Did I type this here? If she deletes the field's text to blank it, `handleGlossInput` sends `null` (`:853-855`), the song's edit is removed, and the glossary text comes back. She cannot blank it, and nothing says why.
5. **She made a typo** in the first song and tapped the offer before noticing. She fixes the field. The glossary still holds the typo (the brief writes the glossary on the tap and offers once per lemma and language). Every future song shows the typo. There is no page where she can see or remove it. Her only recourse is to re-edit the word in every song.
6. **Dann's own songs.** A gloss he typed before this build has no language. The brief shows it in both languages until he edits it. He edits it in French. The untagged row, holding his English text, is replaced by the French (one value per language per key, and the untagged row is not a language). Switching to English now shows the dictionary's gloss, not his. Nothing told him.

The walk says: the offer belongs under the field, at the moment of **Enregistré**, and stays until she answers or leaves; an unanswered offer is not a spent one; a glossary fill says what it is; a typo can be fixed; and a legacy row is not silently lost.

## Findings against the four questions

### 1. The singer's confusion and burden

- **Moment.** Blur and panel close are the wrong trigger on a phone (walk step 3). The settle note at `InspectorPanel.svelte:1043-1046` already marks the moment her typing paused and the song saved. The offer belongs there.
- **Home.** The brief does not say where the offer line renders. The only place that is on screen while the gloss is in her hand is the dictionary panel's edit cell (`:1037-1047`).
- **Which gloss am I seeing.** Today the Paper gives no mark for a song edit (`WordStack.svelte:94-110`), and the Inspector only signals "something is overridden" through the reset button (`InspectorPanel.svelte:377-379`, `:999`). With a third source, the glossary fill needs one quiet word of provenance in the Inspector. The `gloss-lang-chip` pattern at `:1065-1069` is the house's existing way to say "this came from elsewhere".
- **Find, change, undo.** Not in this build as written. A one-tap write with no undo path is the kind of irreversible act the singer is not warned about. Amendment 6 gives the smallest path that closes it; a glossary page is not needed yet.
- **Reset.** The brief clears the current language's edit only. From her position, Reset means "put this word back the way Ilya had it". An edit she cannot see surviving a Reset is a later surprise with no cause she can find. Both languages clear (amendment 9).

### 2. The language defect: is the repair complete

Sites that decide which gloss a singer sees, from the tree:

| Site | File and line | In the brief's list |
|---|---|---|
| Paper word | `WordStack.svelte:96` | yes |
| Inspector field | `InspectorPanel.svelte:841` | yes |
| Inspector revert test | `InspectorPanel.svelte:853` (`value === word.gloss`) | no |
| Inspector "has overrides" | `InspectorPanel.svelte:378` | no |
| Page: shown glosses for either witness | `+page.svelte:465` (`shownGlosses`), `:4152`, `:4361` | partly (poem view) |
| Reading aid (portrait) | `+page.svelte:4390-4397` passes `glossOverrides={shownGlosses}` to `ReadingAid.svelte` (component not in the upload) | no |
| Print | `+page.svelte:2177-2179` calls `window.print()` on the same Paper; no separate gloss path | yes (same as Paper) |
| Export | the record's `glosses` field (`types.ts:103`) and `publishedGlosses` (`:210`); `types.ts:257-259` says the raw record is what a binder carries; `binder.ts` is not in the upload | NOT ESTABLISHED by the desk, same here |
| Write | `library.ts:122-126` and `:142-144` build rows from the maps | yes |
| Read and validate | `library.ts:79-84`, `:105-106`, `:206-215`, `:267-273` | no |
| Survival | `gloss-survival.ts:20-37`, called at `+page.svelte:2290-2293` for Lyrics only | yes |
| Re-key on a poem edit | `+page.svelte:2039-2040` (`rekeyByWord`), `:2385-2386` (`carryPoemEdit`, not in the upload) | no |
| Reset | `+page.svelte:2294-2311` through `resetWord` (`$lib/word-reset`, not in the upload) | yes |
| Clear | `+page.svelte:2123-2124` | no (clears both maps; unaffected) |

The repair is complete only if the language-resolved value is chosen at one point and every row of this table reads it. Amendment 2 names that point.

**Old stored songs.** `validateRecord` keeps a row when elements 0 to 2 are strings and the anchor is non-empty (`library.ts:206-214`); it does not check length, so a fourth element (the language) passes through an older Ilya unread, and an older Ilya shows the row in both languages. Additive, no schema bump, consistent with `seatedText`'s pattern (`types.ts:123-129`). Two rows with the same key (one per language) read by an older Ilya land in one map, last wins (`library.ts:81-84`); harmless.

### 3. Unsafe

- **A wrong "empty" test.** The Inspector's French path falls back to English for the full entry (`InspectorPanel.svelte:895-898`; `resolveFullGloss` returns a `fallback` flag, `:1060-1069`). Whether the short gloss `word.gloss` falls back the same way is decided in `formatGlossForDisplay` in `@ilya/dictionary` (`pipeline.ts:27-28`, `:349-355`), which is not in the upload: NOT ESTABLISHED. If it does, "the dictionary gloss for this word in this language was empty" read from `word.gloss` is false when the field shows an English fallback in French mode, and the French user, the one the ruling is for, never gets the offer. The test must read the raw language field. The word data carries `fullGlossEn` and `fullGlossFr` from the entry's `E`/`e` and `F`/`f` fields (`pipeline.ts:374-392`, `:470-471`); the short gloss's per-language value is in `tw.wordData.gloss` typed `string | BilingualGloss` (`pipeline.ts:73`).
- **A legacy edit lost on first edit** (walk step 6). Amendment 4.
- **A tap that confirms a save that failed.** `profileStore.ts:293-314` returns an `Outcome` and never throws; a `no-storage` or `quota-exceeded` outcome is a normal case on a phone in private browsing (`i18n.ts:1580` already has words for it). If the offer line says "used" regardless, she believes a thing that is not so. Amendment 7.
- **Keystroke saves and the offer.** Each keystroke writes the song (`InspectorPanel.svelte:849-858`). The glossary must be written only on the tap, never on keystroke, and the once-per-word record only on an answer. With amendment 3 the offer appears on settle, after the keystrokes, so the two do not race. The one remaining interaction is the typo case (walk step 5), closed by amendment 5.
- **The glossary fill counted as a song edit.** If the fill is passed through the same `glossOverride` prop, `hasOverrides` turns true (`InspectorPanel.svelte:378`), Reset appears, and Reset removes nothing. Amendment 8.

### 4. Designed from the code's point of view

- Blur and panel close are DOM events; **Enregistré** is the singer's event. Amendment 3.
- "Once per (lemma, language), a dismissal records it" treats any vanishing of the offer as her answer. Only her answer is her answer. Amendment 3.
- "Beside the songs" and "beside the voice profiles" name two different stores: songs are in IndexedDB (`types.ts:6-7`), voices in localStorage (`profileStore.ts:73`). Amendment 10 picks one in words.
- Lemma as the key is the owner's ruling and right; it still fills every form of the lemma with a gloss she wrote for one form (`formatGlossForDisplay` takes `cleanWord` as a parameter, `pipeline.ts:349-355`, which suggests the dictionary adapts a lemma gloss to the form; NOT ESTABLISHED). Not a change to the brief; the agent's report records it so the owner can see it in use (amendment 12).

## Amendments

1. **Add the singer's walk to the brief.** Change: paste the walk from this review, or a shorter one, before "Steps", and make "the singer sees the offer under the field after Enregistré, before her thumb leaves" the done state for step 3. Reason: the agent builds to the walk, not to the events; the ruling says the walk drives the design. Evidence: the brief's "What the singer sees" names what she sees but not when or where, and the events named in step 3 are the panel's DOM lifecycle (`InspectorPanel.svelte:833-836`, `:862-867`).

2. **One resolution point, every reader named.** Change: step 1 adds a function (desk name: `glossFor(word, language, songEdits, glossary)` returning `{ text, source: 'song' | 'glossary' | 'dictionary' | 'none' }`), and lists every reader in the table in this review as a site that must call it or receive its result: `WordStack.svelte:96`, `InspectorPanel.svelte:841`, `:853`, `:378`, `+page.svelte:465`, `:4152`, `:4361`, `:4396` (`ReadingAid.svelte`), and the poem witness. Reason: five readers each choosing a gloss is how the language defect arose; a sixth source (the glossary) multiplies it. Evidence: the table in finding 2; the brief's own "Other sites" section names four of ten.

3. **The offer's moment and home.** Change step 3 to: the offer line renders inside the dictionary panel's edit cell, under the field, beside or in place of the **Saved** note (`InspectorPanel.svelte:1046`), when the field settles (`:1043`, `use:settle`) with a non-empty edit and an empty dictionary gloss in this language. It stays while the panel is open on this word. Tapping it writes the glossary and the line becomes the confirmation. A small dismiss (a second quiet control, or a swipe-free "No" link) records "offered". Closing the panel, blurring, or changing word with the offer unanswered records nothing; the offer returns the next time she opens the panel on that word while the condition holds. Reason: on a phone the blur and the panel close are the same tap as leaving (walk step 3), so the brief's trigger shows the offer in a panel that has closed or in another word's Inspector. Evidence: `InspectorPanel.svelte:833-836` closes the panel on word change; `:862-867` closes it on any outside click; `:1028` renders the panel only while `dictPanelOpen`.

4. **Legacy rows: ask Dann one question, then tag.** Change step 1's DESK DEFAULT to: before the build, Dann answers one question, "Were the glosses you typed in your stored songs written in English?" If yes, an untagged row reads as `'en'` at load (`library.ts:81-84` is the one place), and the record is written back tagged the next time the song saves for its own reason, the same pattern as `migrateCorrectionIds` (`library.ts:93-98`). If no or mixed, keep the brief's both-languages default but on the first edit in language L, move the untagged text to the other language's slot rather than discarding it, and say so in the report. Reason: the brief's default replaces his English text with his first French edit (walk step 6), which is the data loss the brief says it avoids ("nothing he typed vanishes"). Evidence: step 1 says the maps hold one value per language per key, and an untagged row has no language slot to keep.

5. **The glossary entry follows the field until she leaves.** Change step 3: after a tap, while the panel stays open on this word, further edits to the field update the glossary entry too, and the confirmation line stays. Once the panel closes, the song's edit and the glossary entry part ways, as the ruling says (edits stay with their song). Reason: she taps before she sees the typo (walk step 5); without this, the typo is permanent and invisible. Evidence: `handleGlossInput` writes on every keystroke (`InspectorPanel.svelte:849-858`), so the field value after the tap is already different from the glossary's.

6. **One undo path in this build.** Change: add to step 3 that where the Inspector field shows a glossary fill (source `'glossary'` from amendment 2), the line under the field reads "From your other songs" with one action, "Stop using", which deletes the glossary entry for (lemma, language) and leaves the song untouched. No glossary page in this build. Reason: a one-tap write to every future song with no way back is the irreversible act the singer was not warned about; this is the smallest path that closes it and it sits where she already is. Evidence: the brief gives the glossary no reader but the fill; nothing in the tree lists or edits it.

7. **The tap reports the outcome.** Change step 3: the tap calls a save that returns `Outcome` (`profileStore.ts:293-314` is the pattern); on `ok` the line confirms; on `no-storage` or `quota-exceeded` the line says it could not be kept on this device, in the same words family as `storage.none` (`i18n.ts:1580`), and the offer is not recorded as spent. Reason: a confirmation of a write that did not happen is a lie in the interface. Evidence: the profile store's `write` returns the two failure reasons it can meet (`profileStore.ts:299-313`).

8. **The fill is not an edit.** Change step 2: the glossary fill reaches `WordStack` and the Inspector as its own value (or as the `source` of amendment 2), never through `glossOverride`. `hasOverrides` (`InspectorPanel.svelte:377-379`) stays false for a fill, and the revert test at `:853` compares against the fill as well as `word.gloss`, so blanking the field on a filled word writes an explicit empty song edit (the song's own "no gloss here") rather than deleting the edit and letting the fill return. Reason: walk step 4; and Reset appearing for a word she did not edit. Evidence: `:378` tests `glossOverride !== undefined`; `:853-855` sends `null` for an empty value.

9. **Reset clears both languages.** Change step 1's test to: reset clears the word's edit in both languages. Reason: Reset is "clear all overrides for the selected word" (`+page.svelte:2294`); the other marks it clears (stress, ё, syllables, spot) have no language; an edit she cannot see surviving Reset surfaces later with no cause she can find. Evidence: `+page.svelte:2294-2311`; the brief asks for this opinion.

10. **Name the store.** Change step 2's first sentence from "A store on the device beside the songs" to "localStorage under a versioned key, on `profileStore.ts`'s pattern (`:73`), never in the song record". Reason: songs are in IndexedDB (`types.ts:6-7`) and the two phrases in the step point at two stores. Evidence: as cited.

11. **Key shape that leaves the key-based sites alone.** Change step 1: the per-language values nest under the existing `"lineIndex-wordIndex"` key (a value of `{ en?: string; fr?: string }` or a parallel pair of maps), not a composite key. Reason: `rekeyByWord` (`+page.svelte:2039-2040`), `resetWord` (`:2298-2301`), `survivingGlosses` (`gloss-survival.ts:26-35`), and `carryPoemEdit` (`+page.svelte:2385`) all split or match the key as `line-word`; a composite key breaks each. Also: `validateRecord` accepts a fourth element only as `'en'`, `'fr'`, or absent, and reads anything else as absent, never as `malformed` (`library.ts:206-214`, `:267-273`). Evidence: as cited.

12. **Report lines.** Add to step 0 and step 4's report: whether `formatGlossForDisplay` in `@ilya/dictionary` falls back across languages for the short gloss; whether `ReadingAid.svelte` and `Paper.svelte` choose a gloss themselves or only pass the map; whether the binder carries `glosses`; the normalization used for the word-form key when the lemma is empty (recommend `glossAnchorForm`, `gloss-survival.ts:11-13`, since the dictionary is keyed lowercase and yo-folded); and one line on how a lemma-keyed fill reads on an inflected form the singer did not write it for. Reason: each is NOT ESTABLISHED from the upload and each changes a test. Evidence: `pipeline.ts:27-28`, `:731` (lemma is `''` when the lookup fails).

Not an amendment, recorded for the owner: `WordStack.svelte:98-108` strips a leading English pronoun from any gloss, including a singer's own edit ("I love you" prints as "love you"). It predates this brief and touches the question "does she understand which gloss she is seeing". Out of scope here.

Not an amendment, a later question for the owner: whether a binder export carries the personal glossary, so a singer moving devices keeps her French. The ruling places the glossary on the device; the brief is right to leave it there now.

## Strings

House terms: "song" is «chant» in the French interface (`i18n.ts:1577`, `:1580`), which the ruling's draft already uses. The key names are the desk's to choose; the `inspector.` prefix matches the panel's existing keys (`i18n.ts:730-733`, `:2374`).

| Key | English | French (suggestion for Dann) |
|---|---|---|
| `inspector.glossOffer` | Use for this word in your other songs | Utiliser pour ce mot dans vos autres chants (the ruling's draft, unchanged) |
| `inspector.glossOfferDismiss` | Not now | Pas maintenant |
| `inspector.glossOfferDone` | Used in your other songs | Utilisée dans vos autres chants (feminine, agreeing with «glose»; Dann decides) |
| `inspector.glossOfferFailed` | Could not be kept on this device | Impossible de la conserver sur cet appareil |
| `inspector.glossFromGlossary` | From your other songs | De vos autres chants |
| `inspector.glossStopUsing` | Stop using | Ne plus utiliser |

Aria text for the offer control and the dismiss follows the panel's pattern (`inspector.editGlossAria`, `i18n.ts:2374`). All six French lines are suggestions for the owner; none is ratified.

## NOT ESTABLISHED

- `docs/memory/OPEN.md` is not in the upload; the ruling is known here only as the brief quotes it.
- Whether `formatGlossForDisplay` (`@ilya/dictionary`, imported at `pipeline.ts:27-28`) falls back from French to English for the short gloss. The Inspector's full-entry path does (`InspectorPanel.svelte:895-898`, `resolveFullGloss` at `:1060`, from `$lib/gloss-resolve`, not in the upload).
- Whether a binder export carries `glosses` and `publishedGlosses`. `types.ts:257-259` says the raw record is what a binder carries, and the record holds both fields (`types.ts:103`, `:210`); `binder.ts` is not in the upload.
- `ReadingAid.svelte`, `Paper.svelte`, `word-reset.ts`, `witness-lines.ts` (`carryPoemEdit`), and `settle-field.ts` are not in the upload; their gloss handling is inferred from how the page calls them.
- Whether the dictionary's short gloss is per lemma or per form, and how `formatGlossForDisplay` uses `cleanWord` (`pipeline.ts:349-355`).
- Which language Dann typed his stored glosses in (amendment 4 asks him).
