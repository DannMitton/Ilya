# Fable review of the row 91 brief (the reflexive -ся read hard), r1

Reviewer: Fable 5.1, 2026-10-15, independent of the drafting instance. Brief: `brief-code-row91-reflexive-sya_r1_2026-10-15.md`. Checked against a clone of `Shane` at `14e2ff8`, every `path:line` below read this session, and the two dictionary files `data/dictionary.86d83340-a.json` and `-b.json` counted with a Python script this session (943,106 entries, matching the brief).

## Verdict

SEND WITH AMENDMENTS. The engine reading is right in every line I checked, the reconstitution mechanism is as the brief says, and the counts for rules 1 and 3 reproduce. The brief's rule 2 does not do what the brief says it does, in two ways that would reach a singer, and the brief departs from the OWED record on моюся without naming the departure. Amendments 1 and 2 are the ones that matter; the rest are housekeeping.

## Finding that changes the brief

The brief believes rule 2 "excludes Вася (name)" and keeps every reflexive the dictionary knows; the dictionary shows that rule 2 as written marks the names Вася, Люся, Маруся, Ася, Зося, Стася, Нинся, and Роисся reflexive (their lemma is the capitalized name, which ends in -ся) and leaves 24 of the 56 -чься infinitives soft (беречься, увлечься, обжечься, зажечься, напрячься, and the rest, whose dictionary lemma is the bare -чь verb); amendment 1 rewrites the predicate so the count over the whole dictionary is 76,943 reflexive and 91 left soft, every one of the 91 a gerund, a noun, вся, or a name.

## Citations

| Citation | Status |
|---|---|
| `engine.ts:322-325` `reflexiveSuffixes` with the vowel inside the string | CONFIRMED (`:321-324`) |
| `engine.ts:566-578` `findSpecialClusters` matches the suffix at word end, spanning я | CONFIRMED (`:566-577`) |
| `engine.ts:1620-1642` one `cluster` log entry, no `vowel` entry for the я | CONFIRMED (`:1621-1641`) |
| `engine.ts:1823-1875` consonant branch; `isGenitiveG` at `:1838` | CONFIRMED (`:1823`; `isGenitiveG` defined `:1835`, tested `:1839`) |
| `engine.ts:829-839` `isPalatalized` softens с before я | CONFIRMED (`:831-840`) |
| `engine.ts:851-905` map, pass 1 then pass 2 inside the one function | CONFIRMED (`:853-905`); pass 2 runs inside `computeCompletePalatalizationMap`, so a delete after `:1571` is too late for нёсся. The brief's own conditional ("if it has, the delete must happen inside the map function") is the right one; amendment 4 settles it. |
| `engine.ts:1019-1022`, `:1026-1059` `protectedSuffixes`, `syllabify` | CONFIRMED (`:1021-1024`, `:1028`) |
| `engine.ts:1570` `lookupStress` inside `transcribe`; `:1571` the map call | CONFIRMED, with one correction: `:1570` calls `this.lookupStress(cleanWord)` inline as an argument to `lexicalSoftIndices`; no variable holds the result (amendment 3) |
| `engine.ts:1713-1716` `aya-suffix` exception, before `transcribeVowel` | CONFIRMED (`:1714-1717`; `transcribeVowel` at `:1810`) |
| `engine.ts:1650` `needsGlide` false for я after a consonant | CONFIRMED (`:1650-1651`) |
| `engine.ts:1893-1899` `syllableData` rebuilt after assimilation | CONFIRMED (`:1893-1900`) |
| `reconstitution.ts:49-52`, `:55-96`, `:98-114`, `:63` ʌ to ɑ | CONFIRMED (`:49-52`, `:56`, `:63`, `:98-114`); `IPA_VOWELS` holds ʌ (`:21-23`), so the positional walk lands on the new vowel |
| `lexical-palatalization.ts:210-216` `lemmasOf`, `LemmaLookup` | CONFIRMED (`:203-216`); note `LemmaLookup` carries no `pos`, and `StressLookupResult` (`engine.ts:40-50`) does |
| `scripts/ratchets.json:14` engine ceiling 2278; `wc -l` 2278 | CONFIRMED |
| `consonants-clusters.test.ts:401-435` block; local dictionary `:78-82` | CONFIRMED (`:404-435`; `:78-82`) |
| `reconstitution.test.ts:9-16` fixtures; `:22-30` stress table | CONFIRMED |
| `singer-supplement.json` пшют near 2176 | CONFIRMED (`:2172`) |
| Dictionary: 943,106 entries; 9,196 single-word -ться/-тся plus 15 proverbs | CONFIRMED (9,211 total, 15 with a space) |
| `OWED.md` items 2 and 3, `QUEUE.md` row 91, ruling 2026-10-12 20:33 | CONFIRMED (`OWED.md:150-151`, `QUEUE.md:15`) |
| No reader of `clusterChars` or `type === 'cluster'` in `apps/web/src` outside tests | CONFIRMED by grep this session |

## What the dictionary shows about the three rules

Counted this session over every single-word key ending in -ся (77,034):

- Rule 1 (-ться, -тся): 9,196 words, all reflexive. Holds.
- Rule 3's shape over known words: consonant or ь + ся, 33,255 words; the only non-reflexives are вся, the names Нинся and Роисся, and six slang gerunds of -сить verbs (ляпся, ворся, парся, рамся, флекся, форся). Holds for the words a singer sings.
- Rule 2 as written ("any lemma ends in -ся, or -сь with pos verb"): marks eight names reflexive (lemma `Вася` ends in ся) and leaves 24 -чься infinitives soft (lemma беречь, увлечь, обжечь). Does not hold.
- Vowel + ся among known words: 34,583, of which 34,507 are reflexive by lemma; the rest are gerunds (неся, нося, тряся, гася), nouns (гуся, лося, карася), and names. By the vowel: -юся 8,624 words, 8,623 reflexive, the one exception the name Люся; -еся 8,653, 8,625 reflexive; -ися 4,317, 4,315.

## Amendments

### 1. Rewrite "Which -ся is a reflexive particle", rules 2 and 3

Replace rules 2 and 3 with:

> 2. A word ending in **-чься** is reflexive (беречься, увлечься, обжечься: 56 dictionary words; 24 of them carry the bare -чь verb as lemma, so the lemma cannot decide them).
> 3. A word the dictionary knows: reflexive when any of its entries whose part of speech is not `name` has a lemma that, lowercased, ends in **-ся**, or ends in **-сь** with part of speech `verb`. Compare the lemma lowercased: the names Вася, Люся, Маруся, Ася, Зося, Стася, Нинся, and Роисся carry their capitalized form as lemma, which ends in -ся, and the `name` exclusion is what keeps them soft. This keeps учился (учиться), смеялся, улыбнулся, бойся, мойся, нёсся (verb, нестись), and the participial adjectives. It leaves soft: гуся, лося, карася (nouns), вся (lemma весь), the gerunds неся, нося, тряся, вися, пася, крася, глася, гася, and six slang gerunds of -сить verbs (ляпся, ворся, парся, рамся, флекся, форся).
> 4. A word the dictionary does not know: reflexive when it ends in a **consonant + ся** or **ь + ся**, except вся. A word ending in **vowel + ся** that the dictionary does not know is not treated as reflexive (see the next paragraph).
>
> Over the whole dictionary these rules mark 76,943 of the 77,034 single-word -ся keys reflexive and leave 91 soft; re-run the count and put both numbers and the 91 words in the report. Use `pos` from the lookup (`StressLookupResult.pos`, `engine.ts:43`; for a homograph read each of `allEntries`, whose keys are `p` and `l`), and `lemmasOf` from `lexical-palatalization.ts:210-216` for the lemma list. Widen `LemmaLookup` (`:203-207`) with an optional `pos?: string` and `allEntries` entries with `p?: string` rather than importing `StressLookupResult` into the new module.

Reason: counted this session; the brief's rule 2 fails on two word classes, one of which (the -чься infinitives) is common in sung poetry.

### 2. моюся and the archaic first person: name the departure, and the desk's choice

The OWED record the brief cites says, of Dann's ruling, "So учился and моюся take a hard /s/" (`OWED.md:150`). The brief leaves моюся soft and does not say it departs from that line. Add to the paragraph "So the desk's example моюся stays soft after this row":

> This departs from `OWED.md:150`, which applied the ruling to моюся; the reason is that моюся is not in the dictionary and the desk found no shape rule that tells it from Дуся. Say so in the report under owed, in those words.

Then one of the following, the desk's call (reversible, DESK DEFAULT either way):

> (a) Keep the brief's rule: unknown vowel + ся stays soft; моюся, боюся, молюся, клянуся reach a hard с only through a supplement entry, and the French gloss of each is Dann's.
>
> (b) DESK INFERENCE from the count: an unknown word ending in **-юся** is reflexive. In the dictionary 8,623 of 8,624 -юся words are reflexive and the one exception, Люся, is a known name that rule 3 already keeps soft; the archaic first person singular (боюся, молюся, томлюся, стремлюся, клянуся, моюся) is this shape and is common in the poetry Ilya's singers sing. Other unknown vowel + ся words stay soft. Pin моюся → hard with no dictionary entry, and pin Дуся (unknown, -уся) → soft.

Reviewer's recommendation: (b). Cost of (a): every archaic -юся form waits on a supplement entry and a French gloss each. Cost of (b): an unknown diminutive name in -юся, if one exists, reads hard; I found none in the dictionary.

### 3. The engine change, opening sentence

Replace "after `lookupStress` at `:1570`, compute ... (reuse the lookup; do not call `lookupStress` twice)" with:

> `:1570` calls `this.lookupStress(cleanWord)` inline as an argument to `lexicalSoftIndices`. Hoist it: `const lookup = this.lookupStress(cleanWord);` on the line before, pass `lookup` to `lexicalSoftIndices`, and compute `const reflexiveS = reflexiveParticleAt(cleanWord, lookup)` from the same value.

Reason: there is no variable to reuse at `:1570`.

### 4. Step 4, the palatalization map: settle the pass

Replace step 4 with:

> 4. **The palatalization map.** Pass 2 (`engine.ts:886-905`) runs inside `computeCompletePalatalizationMap`, right after pass 1, so a delete after the call at `:1571` is too late: for нёсся pass 1 marks the final с soft and pass 2 may already have carried that softness into the с before it. Add an optional parameter `lexicalHard: ReadonlySet<number> = new Set()` beside `lexicalSoft` (`:853`), skip any index in it during pass 1 (`:880-884`), and pass `new Set([reflexiveS])` when `reflexiveS >= 0`. Report what the existing test смеяться (`consonants-clusters.test.ts:413`) prints after the change: its first с must stay soft before мʲ, which is unrelated to the particle and must not move.

Reason: the brief's conditional is resolvable from `:853-905` now; Code need not read it twice.

### 5. Tests, the controls: pin what the engine prints, both ways

Replace "The controls that must NOT change: вся → soft `fsʲa` (lemma весь, pos adv); гуся → soft (noun, гусь); неся → soft (verb, lemma нести). Add each to the local dictionary and pin each." with:

> The controls that must NOT change: вся, гуся, неся, and one -чься infinitive, беречься (`stress: 1, pos: 'verb', lemma: 'беречь'`, which the dictionary carries as the bare verb), and one name, Вася (`stress: 0, pos: 'name', lemma: 'Вася'`). For вся, гуся, and неся, pin the string the engine prints before your change, read from a run, not from this brief, and pin each twice: once with the word in the local dictionary (rule 3's path) and once with the dictionary cleared (rule 4's path). беречься → hard `s` before ʌ; Вася → soft, unchanged.

Reason: the brief's `fsʲa` is a guess at the engine's vowel and palatalization output; "Done when" item 1 says "no dictionary for the controls" while "Tests" says to add them, and both paths are worth a pin.

### 6. Branch and lane

Replace every `cloud-lane-8` with `cloud-lane-10`, and "Row 1 of 5 in this lane" stands.

Reason: the session runs on `cloud-lane-10`.

### 7. The reflexive predicate's header: Grayson's pages as the brief quotes them

Add to "Put the predicate in a new module": "Quote Grayson's pp. 282 and 284 sentences from this brief; do not quote p. 109 or p. 128 as saying the reflexive reconstitutes, and write the brief's sentence that joining them is the desk's reading."

Reason: the brief asks for it in the engine comment and the report; the new module is where the rule lives and the one place a later reader will look.

### 8. Gate baselines

The brief's gate 4 baseline 2512 matches `report-code-row98-one-engine-and-two-branches_r1_2026-10-14.md:89`; `gates-scratch.sh:111` still reads 2433. Add: "`gates-scratch.sh`'s expected string for gate 4 is stale (2433); do not edit the script, compare against 2512 plus what this lane adds."

## Executability

Every mechanism the brief names exists. The new module needs only `lemmasOf` and the lookup. The reconstitution test's stress table (`reconstitution.test.ts:22-30`) feeds `setStressDictionary`, which the phonology tests also use with `pos` and `lemma` keys (`consonants-clusters.test.ts:78-82`), so adding those two fields is enough. Nothing needs a browser, a Mac file, or a held-out song.

## Strings

No new user-facing string in either language. The моюся supplement entry, if the desk keeps choice (a) of amendment 2, is owed to Dann with its French gloss.

## Collision with cloud-lane-9

None found. Rows 5, 47, and 13 cite no file under `packages/phonology/` and `scripts/ratchets.json:14` is the engine's line, not `+page.svelte`'s (`:8`); a raise of the engine ceiling merges cleanly unless lane 9 also edits that line, which its briefs do not ask for. The lane-9 branch is not in this clone, so its actual diff is NOT ESTABLISHED.

## What I could not establish

- The engine's output for вся, гуся, неся, and the new verbs after the change; I ran no build. Amendment 5 pins from a run.
- Whether an unknown diminutive name in -юся exists in Dann's repertoire; none is in the dictionary.
- Whether `lexicalSoftIndices` tolerates a hoisted lookup variable without a type change; `:1570` passes the call's result directly, so it takes `StressLookupResult | null` already.
- What cloud-lane-9 has changed; the branch is not in this clone.
