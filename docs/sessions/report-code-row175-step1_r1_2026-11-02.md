# Report, row 175, step 1 (r1), 2026-11-02: the engine

Lane: cloud-lane-26, after `git merge --no-edit origin/Shane` (05ac925a, carrying 3a52f05e with the brief's addendum). Nothing pushed to `Shane` or `main`; nothing under `docs/memory/` touched. Brief r2 re-read to its end after the merge, addendum included.

## 1. What was built

Four new modules in `packages/phonology/src/`, each with tests, and `engine.ts` reduced to calling them.

| File | Lines | What it holds |
|---|---|---|
| `palatalization.ts` | 284 | `computePalatalization`: for every consonant, `{soft, reason}` (plus `look`, `root` for `look-alike-root`). `annotatePalatalization`: fills `trigger`, `baseIpa`, `word` on the log. `softnessOfReason`. |
| `prefix-boundary.ts` | 97 | The stop prefixes, the в/с/з family, and the look-alike roots, with their known limits in the header. |
| `lexical-r.ts` | 31 | The ⟨р⟩ lexical exceptions (борщ, скорбь, церковь), keyed by lemma. |
| `lexical-exception.ts` | 27 | The счаст- stem (addendum). |
| `tests/palatalization-map.test.ts`, `tests/prefix-boundary.test.ts` | 108, 78 | One row per reason id; the lists; the boundary in the engine. |

`engine.ts` went from 2291 to **2051 lines**; the ceiling in `scripts/ratchets.json` is lowered to 2051. Removed from the engine: `computeCompletePalatalizationMap` and its three passes, `analyzeRegressivePalatalization`, `canRegressivelyPalatalize`, `isConsonantPalatalized`, `regressivePalatalizationBlockers`, the `velars`, `labials`, and `dentals` sets, `transcribeConsonant`'s own ⟨р⟩ branch, the `softTrigger` inference, and the IPA-stage velar override. No caller of any of them exists outside `engine.ts` (searched `packages/` and `apps/`). `transcribeConsonant` is now `(consonant, soft)`: the map is its only source of softness.

## 2. The rules, as implemented

Rules 1 to 5 of brief r2 and the four rulings of this row, in `palatalization.ts` and `prefix-boundary.ts`, each with its page in the comment.

- **Prefix boundary (ruling 1).** Stop prefixes: от под над пред об обо ото подо надо предо. They block a consonant at the prefix end from softening before a *different* consonant (same consonant allowed: оттенок). The в/с/з family never blocks (Grayson p. 249 exception ii). The look-alike roots are checked first: по-двиг-, по-движ-, по-двин-, по-двиз-, and four отч- stems. Reason `boundary-prefix` where the stop list blocks.
- **`look-alike-root` (ratified 2026-11-02 00:53).** Recorded only where the prefix list alone would have kept the consonant hard (подвиг, подвижный, подвинуть, подвизаться, отчий and their families); everywhere else the existing reasons stand. The map carries `look` and `root`; the log carries `word`, `look`, `root`, and `trigger`.
- **The velar guard (ruling 2).** A к, г, х that the stage profile keeps hard in -кий/-гий/-хий gets reason `adjectival-stage-hard` and softens nothing before it. I chose that existing id over `no-soft-follower` because the velar itself is hard for a stated reason, and it names the cause. The consonant before it gets `no-soft-follower`. симметрический keeps с hard (Grayson p. 211). The profile test is `config.adjectival === 'stage'`; the 'modern' profile is not guarded.
- **Lexical ⟨р⟩ (ruling 3).** борщ, скорбь, церковь keep soft р in every case form, keyed by lemma (a word the dictionary lacks stands for its own lemma). Reason `lexical-soft`.
- **Suffix boundary (ruling 4).** Not built. Listed in section 9.

Sources quoted in code: Grayson 2012 pp. 193, 206 to 211, 249, 250, 287, 301 to 303; D&P 1980 pp. 76 to 87. The email is cited as "Grayson, personal communication, February 2026", with its sentence, and no day.

## 3. Eight gates

| Gate | Baseline | Got |
|---|---|---|
| phonology | 291 | 332 passed (291 + 41 new) |
| dictionary | 248 | 248 passed |
| web check | 0 errors, 12 warnings | 0 errors, 12 warnings in 5 files |
| web test | 3789 passed, 1 skipped | 3802 passed, 1 skipped (217 files). The 13 extra are the tests that the merge of `origin/Shane` brought (row 164: loupe); I added no web test in this step. |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 145 | 145 passed |
| integration | 55 | 55 passed |
| pnpm ratchets | OK | OK (`engine.ts` at its new ceiling, 2051) |

## 4. Every changed pin

All changes are to values the rules give. None is a re-approval to the engine's own output without a rule.

| Pin | Was | Now | Rule and source |
|---|---|---|---|
| `consonants-clusters.test.ts` дверь (two tests) | ˈdvʲerʲ | ˈdʲvʲerʲ | dental before any soft consonant (Grayson p. 209, pp. 210 to 211; D&P p. 80 зьвьерь); reason `regressive-dental` |
| `consonants-clusters.test.ts` цирк | ˈtsɨrʲk | ˈtsɨrk | ⟨р⟩ before a hard consonant stays hard; Grayson p. 167 prints /tsɨrk/; `no-soft-follower` |
| `consonants-clusters.test.ts` известный | izˈvʲɛsnɨj | izʲˈvʲɛsnɨj | з of из- before a palatalizing root (Grayson p. 249 exception ii; изменять p. 250) |
| `consonants-clusters.test.ts` рассчитать | rʌsʃʲʃʲiˈtɑtʲ | rʌsʲʃʲʃʲiˈtɑtʲ | dental rule before the soft sound that сч becomes. **NOT ESTABLISHED against Grayson** (pp. 230 to 231 do not print the word). For the desk. |
| `lexical-palatalization.test.ts` цирк | ˈtsɨrʲk | ˈtsɨrk | as above |
| `lexical-palatalization.test.ts` цвет log | `softTrigger: 'lexical'` | `palReason: 'lexical-soft'` | the inference is replaced by the reason |
| `stress-vowels.test.ts` свечи | svʲiˈtʃʲi | sʲvʲiˈtʃʲi | dental before the soft вʲ; `regressive-dental` |
| `stress-vowels.test.ts`, `notation-edge-cases.test.ts` счастье | exception `word-override` | `lexical-exception` | addendum item 1 (three assertions) |
| `score/phrase-ends.today.json` (the snapshot of today's IPA; five strings, each twice; five tests read it) | неподвижный ɲɪ pɑd ˈvʲiʒ nɨj; терпения tʲɪr ˈpʲe ɲi jɪ; Средь ˈsrʲetʲ; свирели svʲi ˈrʲe lʲi; тревоге ftrʲɪ ˈvo ɡʲɪ | …pɑdʲ…; tʲirʲ…; ˈsʲrʲetʲ; sʲvʲi…; ftʲrʲɪ… | неподвижный д: dental rule (D&P p. 80); терпения: ⟨р⟩ after е with the stress on the next vowel (Grayson n. 277); the other three: dental before a soft consonant |
| `voicing-rule2.pipeline.test.ts` средь нас; без встречи | ˈsrʲedʲ; bʲɪs ˈfstrʲe tʃʲi | ˈsʲrʲedʲ; bʲɪs ˈfsʲtʲrʲe tʃʲi | dental before the soft рʲ (Grayson p. 210 сестрёнка); the voicing assertions of those tests are unchanged |
| `ipa-corpus.txt` (approval golden master) | 7 lines | see below | each line below |

The seven golden-master lines (five dental, two for the stem счаст-):

| Line | Was | Now | Rule |
|---|---|---|---|
| Но пусть она вас больше не тревожит; | …trʲɪ ˈvo ʒɨt | …tʲrʲɪ ˈvo ʒɨt | `regressive-dental-dp-differs` (т before рʲ) |
| В тревогах шумной суеты, | ftrʲɪ ˈvo ɡɑx | ftʲrʲɪ ˈvo ɡɑx | same |
| Играют волны, ветер свищет, | ˈsvʲi ʃʲʃʲɪt | ˈsʲvʲi ʃʲʃʲɪt | `regressive-dental` |
| Под ним струя светлей лазури, | svʲɪt ˈlʲej | sʲvʲitʲ ˈlʲej | `regressive-dental` (с before вʲ; т before лʲ) |
| Трели соловья, | ˈtrʲe lʲi | ˈtʲrʲe lʲi | `regressive-dental-dp-differs` |
| Увы, он счастия не ищет | ʃʲʃʲasʲ tʲi jɑ | ʃʲʃʲɑsʲ tʲi jɑ | `lexical-exception`, stem счаст- (addendum) |
| И не от счастия бежит! | ʃʲʃʲasʲ tʲi jɑ | ʃʲʃʲɑsʲ tʲi jɑ | same |

## 5. What the look-alike list returns to soft

Counted by running the real engine over every pure-Cyrillic dictionary form (903,864). **386 forms** get reason `look-alike-root`, which is every form the stems match:

| Family | Forms | Examples |
|---|---|---|
| по-двиг- | 173 | подвиг, подвигать, подвигнуть |
| по-движ- | 53 | подвижный, подвижник, подвижка |
| по-двин- | 71 | подвинуть, подвинься, подвинут |
| по-двиз- | 55 | подвизаться, подвизать |
| отч- (four stems) | 34 | отчий 1, отчим 11, отчизна 13, отчество 9 |

**Forms the list catches that are not of those families:** none that I can see. I read the first seven letters of every matched form: подвигать and подвигнуть are по-двигать, подвинуть is по-двинуть, and no подвинт- or подвинч- form exists in the dictionary. That is my reading of Russian, not a sourced check.

**The отч- ruling, narrowed.** The ruling names "отч-" with the examples отчий and отчим. A bare отч- stem catches 724 dictionary forms, among them отчёт, which Grayson prints hard as ɑt ˈtʃʲot (p. 250) and which the truth set pins. отчитать, отчислить, отчаяние, отчалить, and отчуждение are prefix + root. So the stems are отчий, отчим, отчизн, отчеств, the four отч- families of the root of отец that the dictionary holds. **For Dann to confirm.** If he meant a bare отч-, отчёт would go soft against Grayson's print.

## 6. Whole-dictionary verification of the built engine

903,864 forms through `transcribeWord`, 5,008,782 consonant log entries:

- **The agreement gate, over every form:** the softness in the IPA agrees with the softness the reason implies in every entry except **one letter, й: 112,140 entries**. й is always soft by reason `always-soft`, and its IPA is the glide [j], which has no ʲ in Grayson's inventory. The step 2 gate exempts й and says so.
- **Against the measurement of step 0.** Of the 105,225 forms that step 0 recorded as changed, the built engine differs from step 0's final column in 394: the 386 look-alike forms, and 8 forms of the stem счаст-. Nothing else differs. The built engine is the measured one plus the two rulings of this row.
- **Reason counts** (consonant log entries):

| Reason | Entries |
|---|---|
| no-soft-follower | 2,841,602 |
| agent-vowel | 1,001,223 |
| always-hard | 316,694 |
| always-soft | 308,823 |
| blocked-class | 152,605 |
| regressive-dental | 110,339 |
| agent-soft-sign | 75,969 |
| reflexive-hard | 67,666 |
| regressive-dental-dp-differs | 36,088 |
| blocked-r | 17,221 |
| regressive-n | 16,567 |
| boundary-prefix | 16,044 |
| boundary-hard-sign | 8,728 |
| blocked-n | 7,061 |
| regressive-homorganic | 6,582 |
| r-front-stressed | 6,377 |
| lexical-soft | 6,250 |
| blocked-l | 5,362 |
| geminate | 2,946 |
| hard-sign-vzs | 2,220 |
| adjectival-stage-hard | 2,029 |
| look-alike-root | 386 |

## 7. The addendum: «счастье» and its derivatives

`exceptionWords` no longer lists four forms; the stem счаст- (`lexical-exception.ts`) covers the family, matched anywhere in the word so that prefixed derivatives are covered. Every override records `exception: 'lexical-exception'` and `word`. The code citation is now "Grayson 2012, p. 287, ch. 6 section 5" (it said "Appendix F"). The comment string and the step 2 rows are for steps 2 and 3.

The dictionary holds **177 keys that contain счаст** (161 single words exercised by the engine; the rest are multi-word keys such as «к счастью» and «письмо счастья»). Prefixes before the stem: не, о, по, зло. **Non-derivatives: none.** Every form is счастье, счастлив, счастливый, несчастный, злосчастный, посчастливиться, осчастливить, or an inflection of one. All 177:

счастливый счастливое счастливая счастливые счастливого счастливой счастливых счастливому счастливым счастливую счастливою счастливыми счастливом счастлив счастливо счастлива счастливы счастливыя счастливаго счастливыхъ счастливымъ счастливомъ счастливъ счастье счастья счастий счастью счастьям счастьем счастьями счастьях счастьямъ счастьемъ счастьѣ счастьяхъ несчастный несчастное несчастная несчастные несчастного несчастной несчастных несчастному несчастным несчастную несчастною несчастными несчастном несчастен несчастно несчастна несчастны счастливого пути счастливого рождества несчастье несчастья несчастий несчастью несчастьям несчастьем несчастьями несчастьях несчастный случай к счастью счастливец счастливцы счастливца счастливцев счастливцу счастливцам счастливцем счастливцами счастливце счастливцах счастливчик счастливчики счастливчика счастливчиков счастливчику счастливчикам счастливчиком счастливчиками счастливчике счастливчиках посчастливиться посчастливится посчастливилось несчастного случая несчастные случаи несчастных случаев несчастному случаю несчастным случаем несчастном случае несчастным случаям несчастными случаями несчастных случаях осчастливить осчастлививший осчастливленный осчастливив осчастлививши осчастливлю осчастливишь осчастливит осчастливим осчастливите осчастливят осчастливь осчастливьте осчастливил осчастливили осчастливила осчастливило злосчастный злосчастное злосчастная злосчастные злосчастного злосчастной злосчастных злосчастному злосчастным злосчастную злосчастною злосчастными злосчастном злосчастен злосчастно злосчастна злосчастны несчастливый несчастливое несчастливая несчастливые несчастливого несчастливой несчастливых несчастливому несчастливым несчастливую несчастливою несчастливыми несчастливом несчастлив несчастливо несчастлива несчастливы осчастливившее осчастливившая осчастливившие осчастливившего осчастливившей осчастлививших осчастливившему осчастливившим осчастливившую осчастливившею осчастливившими осчастливившем осчастливленное осчастливленная осчастливленные осчастливленного осчастливленной осчастливленных осчастливленному осчастливленным осчастливленную осчастливленною осчастливленными осчастливленном осчастливлен осчастливлено осчастливлена осчастливлены письмо счастья счастливый билет

## 8. Other sites (CONTRACT section 4)

- `cliticData`: one string regenerated, **для `dlʲɑ` to `dʲlʲɑ`**. без, при, через, перед, and the rest keep their consonant softness (step 0, section 8).
- The isolated-clitic path (vowelless clitics) now gives the log entry `soft` and `palReason` from the map.
- `softTrigger` is gone; no other file read it (one test did, updated above).
- ъ: the j-glide logging (`source: 'after-sign'`) is untouched; the consonant before ъ carries `hard-sign-vzs`.
- Cross-word palatalization does not exist, as step 0 reported. Not built.
- `cluster-breakdowns.ts` (blurb package): step 3.
- The vowel-context tests (interpalatal) still read `isPalatalized` as a fallback beside the map (`|| this.isPalatalized(...)`), unchanged, so that vowel quality after a reflexive с or an adjectival velar does not change in this step.
- `consonants-clusters.test.ts:154` still carries the comment "Feb 26 2026" for the email; I did not touch the date.

## 9. What I could not establish

- **The suffix boundary** of Grayson p. 249 ("the prefix/suffix boundary"): not built, by ruling 4. Not measured.
- **рассчитать** (the pin above): whether Grayson sings the first с soft. NOT ESTABLISHED.
- **Whether Dann's "отч-" means exactly the four stems** (section 5).
- **That по-двиг- and отч- are as I read them.** My morphology; no file here states it.
- **Words whose stress the dictionary lacks.** The ⟨р⟩ rule reads stress; with none, ⟨р⟩ softens only when doubled or lexical. I did not count those words.
- **Words with two boundaries or a boundary inside the word** (не-под-вижный is correct by accident, since не- is not listed). The list sees the word start only.
- **The 'modern' adjectival profile.** The velar guard applies to 'stage' only, as the stage profile is where the velar is kept hard. Not tested under 'modern'.
- **That the ъ rule needs an iotated vowel after ъ.** It does (е ё ю я); a ъ before another letter does not soften в, с, з. I did not look for such words.
