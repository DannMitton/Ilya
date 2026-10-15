# Report: QUEUE row 91, the reflexive -ся read hard, and its vowel [ʌ] reconstituting to [ɑ] (r1)

Code (cloud lane, Sonnet), 2026-10-15, branch `cloud-lane-10` cut from `origin/Shane` at `bf78ff6`. Brief: `brief-code-row91-reflexive-sya_r1_2026-10-15.md`, with every amendment of `review-fable-brief-row91-reflexive-sya_r1_2026-10-15.md` applied. Where the two disagree, the review won. Desk decision applied: amendment 2(b), the -юся rule; no supplement entry added.

## The answer in three lines

1. A reflexive -ся now reads a hard [s] and the vowel [ʌ], through a new predicate (`packages/phonology/src/reflexive.ts`) and four small engine changes. учился is `uˈtʃʲiɫsʌ`, смеялся `sʲmʲiˈjɑɫsʌ`, улыбнулся `uɫɨbˈnuɫsʌ`.
2. The я of every reflexive ending is now its own `vowel` log entry (`exception: 'reflexive'`), so `applyReconstitution` turns it to [ɑ] with no change to `reconstitution.ts`: купаться reads `ku ˈpɑ tːsɑ`, учился `u ˈtʃʲiɫ sɑ`.
3. вся, гуся, неся, Вася, and Дуся are unchanged. All eight gates pass. `engine.ts` is 13 lines over its old ceiling and the ceiling is raised by exactly 13 (see "The ceiling").

## The words, before and after

Both columns are what the engine printed in this clone: "before" at `bf78ff6` with no change, "after" with this row. "dict" is a local stress dictionary with `pos` and `lemma`; "none" is an empty dictionary (the engine then stresses the last syllable of an unknown word).

| word | dictionary | before | after |
|---|---|---|---|
| учился | dict | `uˈtʃʲiɫsʲɑ` | `uˈtʃʲiɫsʌ` |
| смеялся | dict | `sʲmʲiˈjɑɫsʲɑ` | `sʲmʲiˈjɑɫsʌ` |
| улыбнулся | dict | `uɫɨbˈnuɫsʲɑ` | `uɫɨbˈnuɫsʌ` |
| купаться | dict | `kuˈpɑtːsʌ` | `kuˈpɑtːsʌ` |
| беречься | dict (lemma беречь) | `bʲiˈrʲetʃʲsʲɑ` | `bʲiˈrʲetʃʲsʌ` |
| нёсся | dict (нестись) | `ˈɲosʲsʲɑ` | `ˈɲossʌ` |
| вся | dict (adv, весь) | `ˈfsʲɑ` | `ˈfsʲɑ` |
| гуся | dict (noun, гусь) | `ɡuˈsʲɑ` | `ɡuˈsʲɑ` |
| неся | dict (verb, нести) | `ɲiˈsʲɑ` | `ɲiˈsʲɑ` |
| вася | dict (name) | `ˈvɑsʲɑ` | `ˈvɑsʲɑ` |
| учился | none | `utʃʲiɫsʲɑ` | `utʃʲiɫsɑ` |
| моюся | none | `mojusʲɑ` | `mojusɑ` |
| дуся | none | `dusʲɑ` | `dusʲɑ` |
| вся, гуся, неся, вася | none | `ˈfsʲɑ`, `ɡusʲɑ`, `ɲesʲɑ`, `vɑsʲɑ` | unchanged |

Two things in the table the brief did not predict:

- **With no stress dictionary the я is [ɑ], not [ʌ].** An unknown word is stressed on its last syllable, so the я carries the stress and the engine applies the brief's DESK INFERENCE (a stressed reflexive я reads [ɑ]). That is why `учился` with no entry is `…sɑ`. The five brief words with a dictionary entry all read [ʌ].
- **нёсся** no longer carries the final с's softness back into the с before it (`ˈɲosʲsʲɑ` before, `ˈɲossʌ` after). The geminate prints as two [s], as the engine printed two [sʲ] before; this row did not touch geminate handling.

The brief's expected strings for the three verbs matched the engine's output exactly, so no word needed the "stop on that word" clause.

## The predicate and the dictionary counts

`packages/phonology/src/reflexive.ts` exports `reflexiveParticleAt(word, lookup)`, the index of the с (always `length - 2`) or -1. Its header carries the five clauses, Grayson's pp. 282 and 284 sentences as the brief quotes them, and the sentence that joining pp. 109 and 128 is the desk's reading, not Grayson's (review amendment 7). The clauses, in order:

1. Ends in -ться, -тся, or -чься: reflexive.
2. Known to the dictionary with a lemma: reflexive when any entry that is not a `name` has a lemma that, lowercased, ends in -ся, or ends in -сь with part of speech `verb`.
3. Unknown: reflexive when it ends in consonant + ся or ь + ся, except вся.
4. Unknown and ending in -юся: reflexive (amendment 2b).
5. Any other unknown vowel + ся (Дуся, Маруся, клянуся): not reflexive.

One addition of mine, flagged: a known word that carries no lemma at all (a bare supplement entry) falls to clauses 3 to 5, because the dictionary then says nothing about it. Without this, a supplement entry with no lemma would force the word soft whatever its shape.

**Re-run count.** Instrument: a throwaway vitest file (removed after the run) that read both `data/dictionary.86d83340-a.json` and `-b.json` as NDJSON, grouped by key (a key seen twice was passed as a homograph with `allEntries`), kept the keys ending in -ся without a space, and called `reflexiveParticleAt` with each key's entry.

| | count |
|---|---|
| -ся keys counted (no space) | 77,035 |
| marked reflexive | 76,944 |
| left soft | 91 |
| by clause: -ться/-тся | 9,196 |
| by clause: -чься | 56 |
| by clause: lemma (clause 2) | 67,692 |

The review counted 77,034 keys and 76,943 reflexive; mine is one higher on both and the soft count (91) agrees. The extra key is among the four of length three or less that the dictionary holds (`вся`, `ася`, `-ся`, `ся`); the review's filter may have dropped `-ся` or `ся`. NOT ESTABLISHED which one, and it does not move the 91.

**The 91 left soft** (read from the run): вся авося лося лосося гуся нося изнеся неся пася принеся вынеся крася карася принося глася произнеся вися донеся тряся перенеся перенося сося спася беся кося прося вынося произнося донося завися относя нинся веся морося внеся внося унеся унося отнеся понеся понося нанеся бася плодонося нанося пронося преподнеся превознося превознеся занеся занося поднеся поднося колбася снеся снося гася пронеся разнеся разнося меся вознеся вознося преподнося труся обнеся обнося привнеся привнося соотнеся соотнося вася люся зося голося квася ляпся колеся стася ворся роисся парся пылесося ася маруся туся рамся флекся форся гундося кудеся.

They are gerunds, nouns, вся, the names, and the six slang gerunds the review listed. Four I did not expect from the review's list and did not investigate: авося, лосося, голося, кудеся (nouns or particles; none is a reflexive verb on its face, which is why I take them as correctly soft, but I did not look up their entries).

**Shape rule over unknown words.** Run with each key's entry withheld, clauses 3 and 4 alone mark 51,074 of the 77,035 keys reflexive, and 8,624 of those are -юся. This is a measure of how much the dictionary's own entries carry beyond the shape rule, not of an error rate.

## The engine lines changed

All in `packages/phonology/src/engine.ts` at the post-change line numbers.

- `:14` import of `reflexiveParticleAt`.
- `:323-326` `reflexiveSuffixes` becomes `'тьс': 'tːs'` and `'тс': 'tːs'`.
- `:568-575` `findSpecialClusters` matches `suffix + 'я'` and spans the consonants only (`length - 1 - suffix.length` to `length - 2`). The cluster log entry now says `тьс` or `тс`.
- `:853` `computeCompletePalatalizationMap` takes an optional `lexicalHard`; `:879` pass 1 skips any index in it.
- `:1572-1575` `transcribe` hoists `const lookup = this.lookupStress(cleanWord)` (review amendment 3), passes it to `lexicalSoftIndices` and to `reflexiveParticleAt`, and passes `new Set([reflexiveS])` to the map.
- `:1722-1726` the vowel branch: `vowelIpa = position === 'stressed' ? 'ɑ' : 'ʌ'` and `exception = 'reflexive'`, before `transcribeVowel`, so no glide, interpalatal, or after-hard logic touches it.
- `:1851-1852` the consonant branch: `globalIndex === reflexiveS` takes the plain `s` from the inventory.
- `:1883-1884` the consonant log entry carries `reflexive: true` for that с only (a spread, so every other consonant's keys are unchanged).

## Which pass of the palatalization map the с was cut from

Pass 1, by the `lexicalHard` parameter (review amendment 4), not after the call. Pass 2 runs inside the same function (`engine.ts:889` onward), so a delete after the call at the old `:1571` would have been too late: for нёсся pass 1 marks the final с soft and pass 2 carries that to the с before it. The нёсся line above (`ˈɲossʌ`) is the proof the cut reached pass 2. The existing смеяться test (`consonants-clusters.test.ts`, the `-ться` block) still reads `sʲmʲiˈjɑtːsʌ`: its first с stays soft before мʲ, as the review required.

## Syllables

`syllabify` is untouched. Its output was read from a run with the engine changes stashed and again after: `учился` gives `['у', 'чил', 'ся']` and `купаться` gives `['ку', 'па', 'ться']` both times. The brief and my first draft of the pin guessed `['у','чи','лся']`; the run said otherwise and the pin follows the run. In the web fixture the reduced IPA reads `u ˈtʃʲiɫ sʌ` for the same reason. `protectedSuffixes` was not touched.

## Tests

| gate | baseline | now | added by |
|---|---|---|---|
| 1 phonology | 251 | 267 | +16, all in `packages/phonology/tests/consonants-clusters.test.ts` (new block "reflexive -ся: hard с, vowel [ʌ] (row 91)") |
| 4 web-test | 2512 | 2514 | +2, `apps/web/src/lib/reconstitution.test.ts` (купаться and учился reconstitute to [ɑ]) |

The 16 phonology tests: учился, смеялся, улыбнулся, беречься, нёсся, a stressed reflexive reads [ɑ], the я log entry of учился, the я log entry and `тьс` cluster of купаться, the syllabify pin, four controls (вся, гуся, неся, вася) each pinned with and without an entry, беречься without an entry, моюся without an entry, and Дуся without an entry.

One existing test changed: `packages/phonology/tests/engine.test.ts`, "finds reflexive suffix -ться", looked for a cluster named `ться` with IPA `tːsʌ`; by the brief's design it now finds `тьс` with `tːs`. This is the only test whose expected value moved. The five existing reflexive tests in `consonants-clusters.test.ts` pass unchanged.

The моюся test is pinned hard (`mojusɑ`), not soft. That follows the desk decision for amendment 2(b); the brief's original soft pin is superseded.

## Does any display read the cluster entry?

No. `grep -rn` for `clusterChars`, `type === 'cluster'`, and `.cluster` (as a log field) over `apps/web/src`, `.ts` and `.svelte`, outside tests, found nothing. The Learn text mentions -тся and -ться in prose (`LearnContent.svelte`, English and French) and reads no log. The Ribbon therefore takes the new я entry as any other vowel. I did not run the Ribbon; that is a reading of the grep, not a render. No web code reads `exception === 'reflexive'` (nor `aya-suffix`).

## The ceiling

`packages/phonology/src/engine.ts` was 2278 lines (the ceiling at `scripts/ratchets.json`). It is 2291 now, 13 over. I did not find 13 comment lines I touched that could go without losing the Grayson citations, so I raised the ceiling by exactly 13, 2278 to 2291, in `scripts/ratchets.json`, with the reason in the commit message. `ratchets.json:2` permits this.

## Owed, not done

- **моюся and the supplement.** The OWED record (`OWED.md:150`) applied Dann's ruling to моюся. The first draft of the brief left it soft; the desk then chose the -юся rule (amendment 2b), which gives моюся a hard с with no dictionary entry and no supplement entry. This departs from nothing in `OWED.md:150`; it carries it out. No supplement entry is added and no French gloss is owed for it.
- **клянуся and the -уся archaic forms.** The review names клянуся among the archaic forms, but the 2(b) rule covers -юся only. An unknown клянуся (if the dictionary lacks it) reads soft, as does an unknown Дуся. I did not check whether клянуся is in the dictionary. NOT ESTABLISHED.

## What I could not establish

- **Grayson's pages.** I did not open the book; the quotes of pp. 282, 284, 109, and 128 are the brief's, from the desk's reading, and I carried them as such. The [ɑ]-under-stress rule is the desk's inference from p. 284's "/sɑ/ or /sʌ/", not Grayson's sentence.
- **The Ribbon and the Paper, rendered.** Not run; this box has no way to judge the page by eye. The tile for the я is expected to appear because the log entry is an ordinary vowel entry. Not seen.
- **The extra key** in the dictionary count (77,035 against the review's 77,034), above.
- **The four unexpected soft words** (авося, лосося, голося, кудеся), above.
- **Any word whose pre-change reading was already wrong** and that the new rule might disturb, outside the 77,035 -ся keys and the words I ran. The approval suites and the full unit suite pass, which is the evidence the rest of the engine did not move; it is not proof for every Russian word.

## Gates

| # | gate | baseline | result |
|---|---|---|---|
| 1 | phonology | 251 | 267 passed |
| 2 | dictionary | 248 | 248 passed |
| 3 | web-check | 0 errors, 12 warnings, 5 files | 0 errors, 12 warnings, 5 files |
| 4 | web-test | 2512 | 2514 passed (2512 plus the 2 added) |
| 5 | score-parser | 675 passed, 5 skipped | 675 passed, 5 skipped |
| 6 | blurb | 145 | 145 passed |
| 7 | integration | 55 | 55 passed |
| 8 | ratchets | OK | OK (455 source files; engine.ts at its raised ceiling of 2291) |

`gates-scratch.sh:111` still carries a stale gate 4 string (2433); I did not edit the script and compared against 2512 plus what this row added.
