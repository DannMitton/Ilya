# Brief: QUEUE row 91, the reflexive -ся read hard, and its vowel reconstituting to [ɑ] (r1)

Desk (Fable 5.1 drafting for Opus), 2026-10-15. For Code (cloud lane, Sonnet), on branch `cloud-lane-8` cut from `origin/Shane` at `14e2ff8` or later. Row 1 of 5 in this lane. Ruled by Dann 2026-10-12 20:33: *"I defer to Grayson"* (`docs/memory/OWED.md`, section "New from Code's report of 2026-09-26 evening. Engine defects", items 2 and 3; QUEUE row 91). Every `path:line` in this brief was read in a clone of `Shane` at `14e2ff8` on 2026-10-15.

## What the singer sees and gains

A singer who types учился, смеялся, or улыбнулся reads an IPA line that ends in a hard [s] and the vowel [ʌ], the way Grayson prints the reflexive particle, instead of the soft [sʲɑ] Ilya prints today. With reconstitution on (the Paper's slow-and-sustained setting), the final vowel of купаться, боится, and учился reads [ɑ], the same way every other reduced /ɑ/ in the word reads. The Phoneme Ribbon shows the я of a reflexive ending as its own tile, with its own vowel, instead of hiding it inside the -ться tile. Nothing else on the page moves.

## The ruling, and what Grayson says

Grayson's words, as the desk read them in `~/Downloads/Grayson - 2012 - Russian Lyric Diction.pdf` on 2026-10-12 and recorded in `OWED.md`:

- p. 282: "when singing Russian, the ending -ся is read as /sʌ/, based upon Old Muscovite tradition".
- p. 284: "whenever the combination -ся is specifically a reflexive particle, it is read as /sɑ/ or /sʌ/, in Russian lyric diction (from the Old Muscovite tradition)".
- p. 109: я, "only when part of the reflexive verbal ending (suffix) -ться or -тся", is listed under [ʌ]; "the allophone [ʌ] is a reduced /ɑ/"; "it is perfectly acceptable for the singer to modify the vowel back toward /ɑ/".
- p. 128, Section 8: "[ʌ] reverts to /ɑ/".

**Joining p. 109 and p. 128 is the desk's reading, not one sentence of Grayson's:** the reflexive's [ʌ] reconstitutes to [ɑ]. Put that sentence in the engine comment and in the report, so nobody later reads it as Grayson's.

Two things follow for the engine. The с of a reflexive particle is hard, whatever letter precedes it. The я of a reflexive particle is [ʌ] when unstressed and, DESK INFERENCE from p. 284's "/sɑ/ or /sʌ/", [ɑ] when the particle carries the stress (взялся́ in some editions). Rounding is never restored; this vowel has none to restore.

## What the engine does today

- `packages/phonology/src/engine.ts:322-325`: `reflexiveSuffixes` maps `'ться'` and `'тся'` to `'tːsʌ'`. The vowel is inside the cluster string.
- `engine.ts:566-578`: `findSpecialClusters` matches those two suffixes at word end and records one cluster spanning the whole suffix, я included.
- `engine.ts:1620-1642`: in `transcribe`, a character inside a cluster emits the cluster's IPA once and logs ONE entry with `features.type: 'cluster'`. No entry with `features.type: 'vowel'` is written for the я of -ться or -тся.
- `engine.ts:1823-1875`: a consonant outside a cluster goes through `transcribeConsonant` (`engine.ts:1248`), which palatalizes с before я (`isPalatalized`, `engine.ts:829-839`). That is why учился comes out `utʃʲiɫsʲɑ`.
- `engine.ts:851-905`: `computeCompletePalatalizationMap` pass 1 marks every consonant before an indicator letter soft, so the с of -ся is in `softIndices`, and pass 2 can carry that softness back into a dental before it (нёсся).
- `engine.ts:1019-1022` and `:1026-1059`: `protectedSuffixes` keeps -ться and -тся in the final syllable at syllabification. Leave this as it is; the syllable count does not change.
- `apps/web/src/lib/reconstitution.ts:49-52`: `applyReconstitution` takes only log entries with `features.type === 'vowel'`, maps each (`:55-96`), and walks the word's IPA replacing vowels positionally (`:98-114`). `:63` already maps `ʌ` to `ɑ`. So the reflexive vowel never reconstitutes for one reason only: it has no vowel entry.

The desk's run tonight, with no stress dictionary loaded: учился → `utʃʲiɫsʲɑ`, моюся → `mojusʲɑ`, смеялся → `sʲmʲejɑɫsʲɑ`, улыбнулся → `uɫɨbnuɫsʲɑ`, купаться → `kupɑtːsʌ`.

## How the engine must see the reflexive vowel

The whole change for reconstitution is this: the я of every reflexive ending is logged as its own entry, `{ char: 'я', ipa: 'ʌ' (or 'ɑ' when stressed), features: { type: 'vowel', position, exception: 'reflexive', interpalatal: false, afterHard: false } }`, at its own `position` in the word, and it is no longer part of the cluster entry. Once that entry exists, `reconstitution.ts:63` reconstitutes it with no change to that file. Do not add a reflexive rule to `reconstitution.ts`.

## Which -ся is a reflexive particle

Grayson's rule is morphological ("specifically a reflexive particle"), and the engine has no morphology. The dictionary has part of speech and lemma (`engine.ts:698-760`, `lookupStress`; the engine already calls it inside `transcribe` at `:1570`). The desk counted every dictionary word ending in -ся on 2026-10-15 (943,106 entries in `data/dictionary.86d83340-a.json` and `-b.json`, read as NDJSON). The rule that fits the count, in order:

1. A word ending in **-ться** or **-тся** is reflexive. 9,196 dictionary words; the only exceptions are 15 multi-word proverbs. The dictionary's lemma cannot serve here: купаться's lemma is купать and учиться's is учить.
2. A word whose dictionary entry exists: reflexive when any of its lemmas ends in **-ся**, or ends in **-сь** and the entry's part of speech is `verb`. This keeps учился (lemma учиться), смеялся, улыбнулся, бойся, мойся, нёсся (verb, нестись), and the participial adjectives (невзрывающееся, lemma невзрывающийся). It excludes гуся (noun, гусь), лося, карася, Вася (name), вся (lemma весь), and the gerunds неся, нося, тряся, вися, пася, крася, глася (verb, lemma нести and so on, where -я is the gerund ending and the с is the stem). Use `lemmasOf` from `packages/phonology/src/lexical-palatalization.ts:210-216` for the homograph case; `isHomograph` entries carry `allEntries`.
3. A word the dictionary does not know: reflexive when it ends in a **consonant + ся** or **ь + ся** (past tense -лся, -кся, -гся, -рся, -бся, -зся, -пся, -сся; 1st plural -мся; genitive plural participles -хся; imperative and participle -йся; 2nd singular -шься; infinitive -чься), **except вся**. In the dictionary every such word is reflexive bar вся and two foreign names (Нинся, Роисся). A word ending in **vowel + ся** that the dictionary does not know is NOT treated as reflexive: the archaic first person (моюся, боюся, клянуся) and the diminutive names (Маруся, Люся, Дуся) share that shape and nothing in the word tells them apart.

So the desk's example моюся stays soft after this row. It is not in the dictionary (`STRESS_DICTIONARY['моюся']` is undefined; моюсь and мыться are present with `p: 'verb', l: 'мыться'`). The road to a hard моюся is a singer-supplement entry (`apps/web/static/data/singer-supplement.json`; entries carry `gloss.en` and `gloss.fr`, see the `пшют` entry near line 2176), and the French gloss is Dann's to ratify. Put моюся in the report under owed; do not add it.

Put the predicate in a new module, `packages/phonology/src/reflexive.ts`, exporting `reflexiveParticleAt(word: string, lookup: LemmaLookup | null): number` that returns the index of the particle's с (always `length - 2`) or -1. Model its header on `lexical-palatalization.ts:1-60`: the rule, Grayson's pages, the counts, and the words left out, by name. `engine.ts` is at its ratchet ceiling (`scripts/ratchets.json:14`, 2278 lines; `wc -l` gives 2278), so the engine takes only the calls.

## The engine change

In `transcribe` (`engine.ts:1510`), after `lookupStress` at `:1570`, compute `const reflexiveS = reflexiveParticleAt(cleanWord, lookup)` once (reuse the lookup; do not call `lookupStress` twice).

1. **The cluster shrinks to the consonants.** `reflexiveSuffixes` becomes `'тьс': 'tːs'` and `'тс': 'tːs'`, matched at `:567-578` only when the word ends in that key followed by я (`cleanWord.endsWith(suffix + 'я')`), spanning `length - 1 - suffix.length` to `length - 2`. The IPA string for купаться is unchanged, `kuˈpɑtːsʌ`, because the я now contributes the ʌ itself. The log entry for the cluster now says `тьс` or `тс`, not `ться`.
2. **The с is hard.** In the consonant branch (`:1823`), where `isGenitiveG` is tested (`:1838`), add the case `globalIndex === reflexiveS`: `consonantIpa = this.inventory.consonants['с']` (the plain `s`), `soft: false`, `softTrigger: null`, and a feature `reflexive: true`. This branch runs for -ся without т; for -ться and -тся the с is inside the cluster and already hard.
3. **The vowel is [ʌ].** In the vowel branch, beside the `aya-suffix` exception (`:1713-1716`), add: when `reflexiveS >= 0 && globalIndex === cleanWord.length - 1`, `vowelIpa = position === 'stressed' ? 'ɑ' : 'ʌ'` and `vowelFeatures.exception = 'reflexive'`. This runs before `transcribeVowel`, so no glide, interpalatal, or after-hard logic touches it; `needsGlide` at `:1650` is false for я after с.
4. **The palatalization map.** After `computeCompletePalatalizationMap` at `:1571`, `softIndices.delete(reflexiveS)` when `reflexiveS >= 0`, so the hard с is not a palatalizing trigger for the consonant before it. Check that pass 2 (`:886-905`) has not already carried the softness back before you delete: if it has, the delete must happen inside the map function, before pass 2. Read `:851-905` and say which you did.
5. **The syllable's IPA.** `syllableData` is rebuilt from the assimilated word at `:1893-1899`; confirm the final syllable still reads `sʌ` or `tːsʌ` with no stray mark.

Line budget: engine.ts may not grow past 2278 without raising the ceiling in `scripts/ratchets.json` in the same commit with the reason in the commit message, which `ratchets.json:2` permits. Prefer paying for the added lines by tightening comments you touch; if you raise the ceiling, raise it by the exact count and say so in the report.

## Tests

Phonology, in `packages/phonology/tests/consonants-clusters.test.ts` (the reflexive block at `:401-435`, whose local dictionary is at `:78-82`; add the new words to that dictionary with `pos` and `lemma` as the real dictionary has them):

- учился → `uˈtʃʲiɫsʌ` (dictionary: `stress: 1, pos: 'verb', lemma: 'учиться'`).
- смеялся → `sʲmʲiˈjɑɫsʌ` (`stress: 1, lemma: 'смеяться'`; the с before мʲ stays soft as the existing смеяться test at `:413` has it).
- улыбнулся → `uɫɨbˈnuɫsʌ` (`stress: 2, lemma: 'улыбнуться'`).
- купаться, боится, кажется, улыбнуться: the five existing tests at `:407-433` pass unchanged.
- The controls that must NOT change: вся → soft `fsʲa` (lemma весь, pos adv); гуся → soft (noun, гусь); неся → soft (verb, lemma нести). Add each to the local dictionary and pin each.
- моюся with no dictionary entry → the soft form it gives today, pinned with a comment that names it as owed (the supplement route).
- The log: for купаться and учился, assert the last entry has `features.type === 'vowel'`, `char === 'я'`, `ipa === 'ʌ'`, `features.exception === 'reflexive'`; for купаться assert the cluster entry's `char` is `'тьс'`.
- `syllabify('учился')` and `syllabify('купаться')` give the same arrays as before the change (pin them).

The expected strings are the desk's, derived from the engine's own output tonight with only the particle changed. If the engine's output after your change differs from an expected string anywhere other than the last two sounds, do not bend the test: stop on that word, put both strings in the report, and move on.

Web, in `apps/web/src/lib/reconstitution.test.ts` (its fixtures are the engine's own logs, `:9-16`; its local stress table is at `:22-30`): with reconstitution applied, купаться reads `kuˈpɑtːsɑ` and учился reads `uˈtʃʲiɫsɑ`. Add `lemma` and `pos` to the local table entries so the predicate sees them.

Then grep the web app for readers of the cluster entry's `char` or `clusterChars` (`apps/web/src/lib`, `.ts` and `.svelte`): the desk's grep for `clusterChars` and `type === 'cluster'` outside tests found nothing, so the Ribbon takes the new entry as any other vowel; confirm, and name any reader you find.

## Done when

1. The five words transcribe as the tests say, with no dictionary for the controls and with the local dictionary for the verbs.
2. The reflexive я has its own `vowel` log entry and `applyReconstitution` turns it to [ɑ] with no change to `reconstitution.ts`.
3. вся, гуся, неся, and моюся are unchanged.
4. All eight gates pass; gate 1 and gate 4 rise only by the tests you added, each named in the report.
5. `engine.ts` is within its ceiling, or the ceiling is raised by the exact count with the reason in the commit message.

## Gates

Run the eight commands in `docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh:78-117` from the clone. Baselines after row 98: phonology 251, dictionary 248, web-check 0 errors 12 warnings, web-test 2512, score-parser 675 passed 5 skipped, blurb 145, integration 55, ratchets OK. Cloud-clone notes: `docs/memory/ENVIRONMENT.md`, section "THE GATES RUN IN A CLOUD CLONE" (`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; remove any `allowBuilds` lines pnpm writes into `pnpm-workspace.yaml` before committing).

## Constraints

- Commit to `cloud-lane-8` only; push that branch only; no pull request. Do not edit `docs/memory/`. The brief is in the prompt and is not committed.
- Do not change `reconstitution.ts`. Do not add a supplement entry (French is Dann's). Do not change `protectedSuffixes` or the syllable count.
- Every claim in the report about the tree carries a `path:line` you read.

## Report

`docs/sessions/report-code-row91-reflexive-sya_r1_2026-10-15.md`: the answer in three lines; the five words before and after, as the engine printed them; the predicate's rule and the dictionary counts you re-ran (how many -ся words each rule claims, and the words it leaves soft); the engine lines changed; which pass of the palatalization map you cut the с from; the test counts; the ceiling; what you could not establish.

## What you could not establish

List here anything the brief asserts that you could not confirm in the tree or the dictionary, any word whose reading you could not settle from Grayson's quoted pages, and whether any display reads the cluster entry's `char`. NOT ESTABLISHED beats a complete invented answer.
