# Report, row 175, step 0 (r1), 2026-11-02: regressive palatalization against Grayson (2012), measured only

Lane: cloud-lane-26, cut from `origin/Shane` at bf4a45ad89661361fbbb9c3335c64a2ad0876779 (working tree clean at the start). Nothing from this measurement is kept in the source tree: the temporary patch and harness were reverted before this report was added (`git status` showed only this file). Step 1 has not been started. Nothing under `docs/memory/` was touched, and neither `Shane` nor `main` was pushed.

## 1. Read, and baseline gates

Read in full, in the order given: the brief r2 (52 lines), Fable's review r1 (116 lines), OPEN.md from its section "REGRESSIVE PALATALIZATION FOLLOWS GRAYSON p. 209; THE RULE FOR ⟨р⟩" to the end of the file (lines 3340 to 3352), the truth set r1, and the ratified comments EN and FR.

**The brief has no addendum.** You asked me to read "its addendum at the end". The file ends at line 52 with "What you could not establish". If an addendum exists, it is not in this file at bf4a45ad.

| Gate | Expected | Got |
|---|---|---|
| phonology | 291 | 291 passed |
| dictionary | 248 | 248 passed |
| web check | 0 errors, 12 warnings | 0 errors, 12 warnings in 5 files |
| web test | 3789 passed, 1 skipped | 3789 passed, 1 skipped |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 145 | 145 passed |
| integration | 55 | 55 passed |
| pnpm ratchets | OK | OK (it lists five ceilings that could be lowered; none is `engine.ts`) |

`pnpm install --frozen-lockfile` succeeded. All eight match, so I went on.

## 2. What the numbers mean, and how they were made

Method. I added flags to `engine.ts` (diff in appendix A) and ran the same text through the engine at cumulative stages, then reverted. The stages, in order: **s0** today; **s1** rule 5, blocker removal; **s2** rule 4, the ratified ⟨р⟩ rule (pass 3 and the `transcribeConsonant` branch retired); **s3** rule 4's lexical set (борщ, скорбь, церковь, keyed by dictionary lemma); **s4** rule 1, в/с/з before ъ followed by е ё ю я; **s5** rule 3, т д с з before any soft consonant, with ч щ й counted as triggers; **s6** a stage the brief does not have (finding 1 below); **s7** rule 1, the prefix list (the brief's DESK DEFAULT, checked at word start).

Rule 2 (limits) needed no stage: л, н, velars, and labials (м included) are already in `canRegressivelyPalatalize` as the brief states them. The only rule-2 change is the removal of the dental-before-м special case, which s5 subsumes. A word can change at more than one stage, so stage counts overlap and do not sum to the net.

Inputs. (a) The approval corpus: 40 lines, 185 word occurrences, through `processText` with the full dictionary loaded. (b) Every fixture in the tree that carries a lyric: four files (sections 5 and 9). (c) The truth set plus the rows of brief step 2 plus extra probes of mine (marked). (d) **Supplementary, not asked for:** every pure-Cyrillic form in the dictionary (903,864 of 943,106 entries), through `transcribeWord`, so the size of each rule is visible. It counts dictionary forms, not sung words: no frequency weighting, and it includes rare, archaic, and coarse forms.

## 3. Findings for the desk, most important first

1. **Rule 3 as written breaks every -ский / -цкий / -ткий adjective, and the brief does not know it.** The map softens к before и (pass 1). The IPA stage then forces that к hard in -кий / -гий / -хий (`checkVelarAdjectival`, `engine.ts:640`, used at `:1892-1903`). Today the dental chain ignores the soft к, so с stays hard. Under "dentals before any soft consonant", the с of ческий becomes soft while the к beside it is sung hard. Grayson prints симметрический /tʃʲɪ skɨj/ (p. 211), с hard. Measured: s5 gives `tʃʲesʲ kɨj` for симметрический, and **1677 dictionary forms** are affected (тайский, украинский, семантический, пассажирский, вселенский, господский). Stage s6 is my test fix: a velar that the IPA stage forces hard does not trigger the chain. It brings Grayson's row back. This is review amendment 9(d) in the flesh: the map and the output disagree. Step 1 needs this rule, or Dann's ruling on a different one.
2. **Rule 3 is the large change: 86,352 of 903,864 dictionary forms (9.6%).** In the approval corpus it moves 5 words in 5 of 40 lines (тревожит, тревогах, свищет, светлей, Трели). It makes initial тр-, св-, дв-, зв-, ст-, сл- clusters soft wherever the next consonant is soft, which is what Grayson p. 210 (сестрёнка) and p. 211 print and what Dann ruled. I report it so the size is seen before step 1 is kept, not as a defect.
3. **The prefix list repairs Grayson's printed rows and breaks others.** It undoes 16,430 of the s5 changes (1.8% of forms). Net after everything (s0 against s7): **94,115 forms (10.4%)**. The list has no morphology, so it also blocks where the consonant is root-initial. Evidence in the data: **неподвижный is soft (д) and подвижный is hard**, because не- is not on the list but под- is. Dictionary forms in the по-двиг-, по-движ-, по-двин- family that the list now blocks: 297 (подвиг, подвиги, подвинут). The family подвиз- adds 55, and отч- words (отчим and others) 21. That по-двиг- and отч- are not prefix + root is my reading of Russian morphology (двигать, отец); no file in this repository states it. The review (amendment 1) names подвиг as the known failure and states that неподвижный's д is root-initial. Section 7 lists what the list touched.
4. **The suffix boundary is not covered.** Grayson p. 249, as the review quotes it, names the prefix/suffix boundary. The brief's list handles consonant-final prefixes only. I did not build or measure anything for suffixes.
5. **The lexical ⟨р⟩ set, keyed by lemma, reaches 29 forms.** That includes скорбей, церквам, церквями, борщу. D&P p. 87 name the three words; the review reports Panov's view that церковь alone is still sung with рь. Whether the exception covers the case forms is a ruling, not a measurement. Keyed by the nominative singular only, it would be 3 forms.
6. **Rule 5 (blocker removal) fixes 2,943 forms, and in the 14 I sampled every one is a doubled л or р** (эллин, андорре, коррелировавшая). I did not inspect all 2,943.
7. **Labial м: no change.** м is already in the labial set, so nothing moved. As a counterfactual (м not a trigger for б п в ф) the approval corpus, the fixtures, and the truth set change in 0 words. Not run dictionary-wide.
8. **ч and щ as triggers: small in the corpora, not measured dictionary-wide.** Counterfactual "ч, щ are not triggers for т д с з": 1 word differs (лётчик, D&P p. 81). Counterfactual "ч, щ also trigger н": 1 word (кончать, D&P p. 81, today kɑn ˈtʃʲatʲ, would become kɑɲ ˈtʃʲatʲ). `й` as trigger: 0 words.
9. **Cross-word palatalization does not exist.** `applyCrossWordAssimilation` (`engine.ts:2160` at bf4a45ad) does voicing and sibilant mergers. A search of that region and of `voicing-rule2.ts` for palatalization found only the sʲ/zʲ + ʃ/ʒ merger table. I did not read the whole function line by line. I did not build anything for it.

## 4. Counts by rule

Approval corpus (40 lines, 185 occurrences, 145 distinct words): net 5 occurrences changed, all rule 3. Fixtures and the truth set are in section 5.

Dictionary-wide supplement (903,864 forms; run took 348 s):

| Stage | Rule | Forms whose IPA changes |
|---|---|---|
| s1 | blocker removal (rule 5) | 2,943 |
| s2 | ⟨р⟩ rule (rule 4) | 10,626 |
| s3 | ⟨р⟩ lexical set (rule 4, desk default) | 29 |
| s4 | в, с, з before ъ (rule 1) | 2,220 |
| s5 | dentals before any soft consonant (rule 3) | 86,352 |
| s6 | velar-adjectival side effect (not in the brief) | 1,677 |
| s7 | prefix list (rule 1) | 16,430 |
| net | s0 against s7 | 94,115 |

Sampled forms (evenly spaced through the changed list, not chosen). Vowel symbols can change beside a softness change, because the engine reads palatal surroundings for vowel quality; I report whole-IPA changes.

**s1, blocker removal**

| Form | Before | After |
|---|---|---|
| андорре | ɑnˈdorrʲɪ | ɑnˈdorʲrʲɪ |
| аллилуйю | ʌɫlʲiˈɫuju | ʌlʲlʲiˈɫuju |
| параллельными | pʌrɑɫˈlʲelʲnɨmʲi | pʌrɑlʲˈlʲelʲnɨmʲi |
| фаллическою | fɑɫˈlʲitʃʲɪskʌju | fɑlʲˈlʲitʃʲɪskʌju |
| спеллинга | ˈspʲɛɫlʲinɡʌ | ˈspʲelʲlʲinɡʌ |
| корректировка | kʌrrʲɪktʲiˈrofkɑ | kʌrʲrʲɪktʲiˈrofkɑ |
| иллюминаторы | iɫlʲumʲiˈnɑtʌrɨ | ilʲlʲumʲiˈnɑtʌrɨ |
| интеллигентскою | iɲtʲɪɫlʲiˈɡʲɛntskʌju | iɲtʲilʲlʲiˈɡʲɛntskʌju |
| апеллирующем | ʌpʲɪɫˈlʲirujuʃʲʃʲɪm | ʌpʲilʲˈlʲirujuʃʲʃʲɪm |
| кристаллизовавший | krʲistʌɫlʲizɑˈvɑfʃɨj | krʲistʌlʲlʲizɑˈvɑfʃɨj |

**s2, ⟨р⟩ rule**

| Form | Before | After |
|---|---|---|
| беркут | ˈbʲerʲkut | ˈbʲɛrkut |
| поверхностными | pɑˈvʲerʲxnʌstnɨmʲi | pɑˈvʲɛrxnʌstnɨmʲi |
| ущерба | uˈʃʲʃʲerʲbɑ | uˈʃʲʃʲɛrbɑ |
| артаксерксу | ʌrtɑkˈsʲerʲksu | ʌrtɑkˈsʲɛrksu |
| грузопассажирское | ɡruzʌpʌssɑˈʒɨrʲskʌjɪ | ɡruzʌpʌssɑˈʒɨrskʌjɪ |
| экспертное | ɪksˈpʲerʲtnʌjɪ | ɪksˈpʲɛrtnʌjɪ |
| самоотверженный | sʌmʌɑtˈvʲerʲʒɨnnɨj | sʌmʌɑtˈvʲɛrʒɨnnɨj |
| удерживаемо | uˈdʲerʲʒɨvʌjɪmʌ | uˈdʲɛrʒɨvʌjɪmʌ |
| сдерживавшеюся | ˈzʲdʲerʲʒɨvʌfʃɨjusʌ | ˈzʲdʲɛrʒɨvʌfʃɨjusʌ |
| отвердевших | ʌtvʲɪrˈdʲɛfʃɨx | ʌtvʲirʲˈdʲɛfʃɨx |

**s3, ⟨р⟩ lexical set**

| Form | Before | After |
|---|---|---|
| борщ | ˈborʃʲʃʲ | ˈborʲʃʲʃʲ |
| борща | bɑrˈʃʲʃʲɑ | bɑrʲˈʃʲʃʲɑ |
| борщу | bɑrˈʃʲʃʲu | bɑrʲˈʃʲʃʲu |
| борщом | bɑrˈʃʲʃʲom | bɑrʲˈʃʲʃʲom |
| борще | bɑrˈʃʲʃʲɛ | bɑrʲˈʃʲʃʲɛ |
| церковь | ˈtsɛrkʌfʲ | ˈtserʲkʌfʲ |
| церквей | tsɨrkˈvʲej | tsɨrʲkˈvʲej |
| церквам | tsɨrkˈvɑm | tsɨrʲkˈvɑm |
| церквями | tsɨrkˈvʲamʲi | tsɨrʲkˈvʲamʲi |
| церквях | tsɨrkˈvʲɑx | tsɨrʲkˈvʲɑx |
| скорбь | ˈskorpʲ | ˈskorʲpʲ |
| скорбей | skɑrˈbʲej | skɑrʲˈbʲej |
| скорбью | ˈskorbʲju | ˈskorʲbʲju |
| скорбях | skɑrˈbʲɑx | skɑrʲˈbʲɑx |

**s4, ъ**

| Form | Before | After |
|---|---|---|
| изъясниться | izjisʲˈɲitːsʌ | izʲjisʲˈɲitːsʌ |
| разъединит | rʌzjidʲiˈɲit | rʌzʲjidʲiˈɲit |
| съедай | sjɪˈdɑj | sʲjɪˈdɑj |
| съезжай | sjɪʒːˈɑj | sʲjɪʒːˈɑj |
| разъяривший | rʌzjiˈrʲifʃɨj | rʌzʲjiˈrʲifʃɨj |
| разъяснившими | rʌzjisʲˈɲifʃɨmʲi | rʌzʲjisʲˈɲifʃɨmʲi |
| разъезжавшие | rʌzjɪʒːˈɑfʃɨjɪ | rʌzʲjɪʒːˈɑfʃɨjɪ |
| изъедающее | izjɪˈdɑjuʃʲʃʲijɪ | izʲjɪˈdɑjuʃʲʃʲijɪ |
| разъединённое | rʌzjidʲiˈɲonnʌjɪ | rʌzʲjidʲiˈɲonnʌjɪ |
| съязвившее | sjɪzˈvʲifʃɨjɪ | sʲjɪzˈvʲifʃɨjɪ |

**s5, dentals**

| Form | Before | After |
|---|---|---|
| баские | bɑsˈkʲijɪ | bɑsʲˈkʲijɪ |
| сестрин | ˈsʲɛstrʲin | ˈsʲesʲtʲrʲin |
| тривиальны | trʲivʲiˈɑlʲnɨ | tʲrʲivʲiˈɑlʲnɨ |
| звереете | zvʲiˈrʲejitʲɪ | zʲvʲiˈrʲejitʲɪ |
| отыскивала | ɑˈtɨskʲivʌɫʌ | ɑˈtɨsʲkʲivʌɫʌ |
| помыслю | pɑˈmɨslʲu | pɑˈmɨsʲlʲu |
| сдвинута | ˈzdvʲinutʌ | ˈzʲdʲvʲinutʌ |
| специализировавшемуся | spʲɪtsɨʌlʲiˈzʲirʌvʌfʃɨmusʌ | sʲpʲɪtsɨʌlʲiˈzʲirʌvʌfʃɨmusʌ |
| отпершею | ˈotpʲɪrʃɨju | ˈotʲpʲɪrʃɨju |
| отвердевшей | ʌtvʲirʲˈdʲɛfʃɨj | ʌtʲvʲirʲˈdʲɛfʃɨj |

**s6, velar-adjectival side effect**

| Form | Before | After |
|---|---|---|
| тайский | ˈtɑjsʲkɨj | ˈtɑjskɨj |
| украинский | ukrɑˈiɲsʲkɨj | ukrɑˈinskɨj |
| семантический | sʲɪmɑɲˈtʲitʃʲisʲkɨj | sʲɪmɑɲˈtʲitʃʲɪskɨj |
| алтайский | ɑɫˈtɑjsʲkɨj | ɑɫˈtɑjskɨj |
| пассажирский | pʌssɑˈʒɨrʲsʲkɨj | pʌssɑˈʒɨrskɨj |
| постсоветский | pʌstsɑˈvʲetʲsʲkɨj | pʌstsɑˈvʲɛtskɨj |
| вселенский | fsʲiˈlʲeɲsʲkɨj | fsʲiˈlʲɛnskɨj |
| лимфатический | lʲimfɑˈtʲitʃʲisʲkɨj | lʲimfɑˈtʲitʃʲɪskɨj |
| ностальгический | nʌstɑlʲˈɡʲitʃʲisʲkɨj | nʌstɑlʲˈɡʲitʃʲɪskɨj |
| гималайский | ɡʲimɑˈɫɑjsʲkɨj | ɡʲimɑˈɫɑjskɨj |

## 5. Every changed word in the corpora, grouped by rule

"Before" is today (or the previous stage); "After" is the next stage. A stage with no row changed nothing in that source. The poems and fixtures changed only at s5 (dentals), s2 (терпения), s6 (none), and s7 (ответная). Fixture lyric extraction: the two Sunless files use verse 1 only (verse 2 holds IPA text); n188-markings has no syllabic flags, so its 19 tokens include fragments (раду, бо, ду); Tchaikovsky is pre-1918 spelling, which `processText` modernises at intake. The `tools/e16-harness` and `omr/fixtures` files have no lyric elements. I did not scan `docs/sessions/*.musicxml` (session debris, not fixtures).


#### approval corpus (185 word occurrences)

**s4 to s5: dentals before any soft consonant, ч щ й as triggers (rule 3):** 5 occurrences, 5 distinct (word, before, after)

| Word | Before | After | n |
|---|---|---|---|
| тревожит | ɲɪ trʲɪ ˈvo ʒɨt | ɲɪ tʲrʲɪ ˈvo ʒɨt | 1 |
| тревогах | ftrʲɪ ˈvo ɡɑx | ftʲrʲɪ ˈvo ɡɑx | 1 |
| свищет | ˈsvʲi ʃʲʃʲɪt | ˈsʲvʲi ʃʲʃʲɪt | 1 |
| светлей | svʲɪt ˈlʲej | sʲvʲitʲ ˈlʲej | 1 |
| Трели | ˈtrʲe lʲi | ˈtʲrʲe lʲi | 1 |

**Net s0 to s7:** 5 occurrences, 5 distinct.


#### fixture n188-markings.musicxml (19 word occurrences)

**Net s0 to s7:** 0 occurrences, 0 distinct.


#### fixture sunless-01-finale-lone-v.musicxml (39 word occurrences)

**s1 to s2: р rule (rule 4):** 1 occurrences, 1 distinct (word, before, after)

| Word | Before | After | n |
|---|---|---|---|
| терпения | tʲɪr ˈpʲe ɲi jɪ | tʲirʲ ˈpʲe ɲi jɪ | 1 |

**s4 to s5: dentals before any soft consonant, ч щ й as triggers (rule 3):** 2 occurrences, 2 distinct (word, before, after)

| Word | Before | After | n |
|---|---|---|---|
| ответная | bʲɪz ɑt ˈvʲɛt nɑ jɑ | bʲɪz ɑtʲ ˈvʲɛt nɑ jɑ | 1 |
| неподвижный | ɲɪ pɑd ˈvʲiʒ nɨj | ɲɪ pɑdʲ ˈvʲiʒ nɨj | 1 |

**s6 to s7: prefix list (rule 1):** 1 occurrences, 1 distinct (word, before, after)

| Word | Before | After | n |
|---|---|---|---|
| ответная | bʲɪz ɑtʲ ˈvʲɛt nɑ jɑ | bʲɪz ɑt ˈvʲɛt nɑ jɑ | 1 |

**Net s0 to s7:** 2 occurrences, 2 distinct.


#### fixture tchaikovsky-op38-3-voice.musicxml (95 word occurrences)

**s4 to s5: dentals before any soft consonant, ч щ й as triggers (rule 3):** 3 occurrences, 3 distinct (word, before, after)

| Word | Before | After | n |
|---|---|---|---|
| Средь | ˈsrʲetʲ | ˈsʲrʲetʲ | 1 |
| тревоге | ftrʲɪ ˈvo ɡʲɪ | ftʲrʲɪ ˈvo ɡʲɪ | 1 |
| свирели | svʲi ˈrʲe lʲi | sʲvʲi ˈrʲe lʲi | 1 |

**Net s0 to s7:** 3 occurrences, 3 distinct.


#### fixture sunless-01-engraved.musicxml (39 word occurrences)

**s1 to s2: р rule (rule 4):** 1 occurrences, 1 distinct (word, before, after)

| Word | Before | After | n |
|---|---|---|---|
| терпения | tʲɪr ˈpʲe ɲi jɪ | tʲirʲ ˈpʲe ɲi jɪ | 1 |

**s4 to s5: dentals before any soft consonant, ч щ й as triggers (rule 3):** 2 occurrences, 2 distinct (word, before, after)

| Word | Before | After | n |
|---|---|---|---|
| ответная | bʲɪz ɑt ˈvʲɛt nɑ jɑ | bʲɪz ɑtʲ ˈvʲɛt nɑ jɑ | 1 |
| неподвижный | ɲɪ pɑd ˈvʲiʒ nɨj | ɲɪ pɑdʲ ˈvʲiʒ nɨj | 1 |

**s6 to s7: prefix list (rule 1):** 1 occurrences, 1 distinct (word, before, after)

| Word | Before | After | n |
|---|---|---|---|
| ответная | bʲɪz ɑtʲ ˈvʲɛt nɑ jɑ | bʲɪz ɑt ˈvʲɛt nɑ jɑ | 1 |

**Net s0 to s7:** 2 occurrences, 2 distinct.


#### truth set + extra probes (64 word occurrences)

**s0 to s1: blocker removal (rule 5):** 2 occurrences, 2 distinct (word, before, after)

| Word | Before | After | n |
|---|---|---|---|
| гулливая | ɡuɫ lʲi vɑ jɑ | ɡulʲ lʲi vɑ jɑ | 1 |
| эллин | ˈɛɫ lʲin | ˈelʲ lʲin | 1 |

**s1 to s2: р rule (rule 4):** 8 occurrences, 8 distinct (word, before, after)

| Word | Before | After | n |
|---|---|---|---|
| терпеть | tʲɪr ˈpʲetʲ | tʲirʲ ˈpʲetʲ | 1 |
| кирпич | kʲir ˈpʲitʃʲ | kʲirʲ ˈpʲitʃʲ | 1 |
| первый | ˈpʲerʲ vɨj | ˈpʲɛr vɨj | 1 |
| четверг | tʃʲɪt ˈvʲerʲk | tʃʲɪt ˈvʲɛrk | 1 |
| верх | ˈvʲerʲx | ˈvʲɛrx | 1 |
| мерси | mʲɪr ˈsʲi | mʲirʲ ˈsʲi | 1 |
| церковь | ˈtserʲ kʌfʲ | ˈtsɛr kʌfʲ | 1 |
| зеркало | ˈzʲerʲ kɑ ɫʌ | ˈzʲɛr kɑ ɫʌ | 1 |

**s2 to s3: р lexical exceptions (rule 4, desk default):** 3 occurrences, 3 distinct (word, before, after)

| Word | Before | After | n |
|---|---|---|---|
| борщ | ˈborʃʲʃʲ | ˈborʲʃʲʃʲ | 1 |
| скорбь | ˈskorpʲ | ˈskorʲpʲ | 1 |
| церковь | ˈtsɛr kʌfʲ | ˈtserʲ kʌfʲ | 1 |

**s3 to s4: в, с, з before ъ (rule 1):** 5 occurrences, 5 distinct (word, before, after)

| Word | Before | After | n |
|---|---|---|---|
| съесть | ˈsjesʲtʲ | ˈsʲjesʲtʲ | 1 |
| въезд | ˈvjɛzt | ˈvʲjɛzt | 1 |
| разъярять | rʌ zji ˈrʲatʲ | rʌ zʲji ˈrʲatʲ | 1 |
| съёмный | ˈsjom nɨj | ˈsʲjom nɨj | 1 |
| безъязычный | bʲɛ zjɑ zɨtʃʲ nɨj | bʲe zʲjɑ zɨtʃʲ nɨj | 1 |

**s4 to s5: dentals before any soft consonant, ч щ й as triggers (rule 3):** 20 occurrences, 20 distinct (word, before, after)

| Word | Before | After | n |
|---|---|---|---|
| сестрёнка | sʲɪst ˈrʲon kɑ | sʲisʲtʲ ˈrʲon kɑ | 1 |
| симметрический | sʲimʲ mʲɛt rʲi tʃʲɛs kɨj | sʲimʲ mʲetʲ rʲi tʃʲesʲ kɨj | 1 |
| отчёт | ɑt ˈtʃʲot | ɑtʲ ˈtʃʲot | 1 |
| четверг | tʃʲɪt ˈvʲɛrk | tʃʲitʲ ˈvʲɛrk | 1 |
| неподвижный | ɲɪ pɑd ˈvʲiʒ nɨj | ɲɪ pɑdʲ ˈvʲiʒ nɨj | 1 |
| дверь | ˈdvʲerʲ | ˈdʲvʲerʲ | 1 |
| четверть | ˈtʃʲɛt vʲɪrtʲ | ˈtʃʲetʲ vʲɪrtʲ | 1 |
| зверь | ˈzvʲerʲ | ˈzʲvʲerʲ | 1 |
| лётчик | ˈlʲot tʃʲik | ˈlʲotʲ tʃʲik | 1 |
| медлить | ˈmʲɛd lʲitʲ | ˈmʲedʲ lʲitʲ | 1 |
| ветки | ˈvʲɛt kʲi | ˈvʲetʲ kʲi | 1 |
| три | ˈtrʲi | ˈtʲrʲi | 1 |
| после | ˈpos lʲɪ | ˈposʲ lʲɪ | 1 |
| если | ˈjɛs lʲi | ˈjesʲ lʲi | 1 |
| подвиг | ˈpod vʲik | ˈpodʲ vʲik | 1 |
| подвижный | pɑd ˈvʲiʒ nɨj | pɑdʲ ˈvʲiʒ nɨj | 1 |
| отлично | ɑt ˈlʲitʃʲ nʌ | ɑtʲ ˈlʲitʃʲ nʌ | 1 |
| отвести | ʌt vʲisʲ ˈtʲi | ʌtʲ vʲisʲ ˈtʲi | 1 |
| подвести | pʌd vʲisʲ ˈtʲi | pʌdʲ vʲisʲ ˈtʲi | 1 |
| отчий | ˈot tʃʲij | ˈotʲ tʃʲij | 1 |

**s5 to s6: velar-adjectival side effect (not in the brief):** 1 occurrences, 1 distinct (word, before, after)

| Word | Before | After | n |
|---|---|---|---|
| симметрический | sʲimʲ mʲetʲ rʲi tʃʲesʲ kɨj | sʲimʲ mʲetʲ rʲi tʃʲɛs kɨj | 1 |

**s6 to s7: prefix list (rule 1):** 8 occurrences, 8 distinct (word, before, after)

| Word | Before | After | n |
|---|---|---|---|
| обвить | ɑbʲ ˈvʲitʲ | ɑb ˈvʲitʲ | 1 |
| отчёт | ɑtʲ ˈtʃʲot | ɑt ˈtʃʲot | 1 |
| подвиг | ˈpodʲ vʲik | ˈpod vʲik | 1 |
| подвижный | pɑdʲ ˈvʲiʒ nɨj | pɑd ˈvʲiʒ nɨj | 1 |
| отлично | ɑtʲ ˈlʲitʃʲ nʌ | ɑt ˈlʲitʃʲ nʌ | 1 |
| отвести | ʌtʲ vʲisʲ ˈtʲi | ʌt vʲisʲ ˈtʲi | 1 |
| подвести | pʌdʲ vʲisʲ ˈtʲi | pʌd vʲisʲ ˈtʲi | 1 |
| отчий | ˈotʲ tʃʲij | ˈot tʃʲij | 1 |

**Net s0 to s7:** 29 occurrences, 29 distinct.

*Counterfactual c_noCh (ч, щ not triggers for т д с з), differs from s7 in:*

| Word | s7 | counterfactual | n |
|---|---|---|---|
| лётчик | ˈlʲotʲ tʃʲik | ˈlʲot tʃʲik | 1 |

*Counterfactual c_nCh (ч, щ also triggers for н), differs from s7 in:*

| Word | s7 | counterfactual | n |
|---|---|---|---|
| кончать | kɑn ˈtʃʲatʲ | kɑɲ ˈtʃʲatʲ | 1 |


## 6. Truth set and the rows of brief step 2

Grayson's printed rows compared by consonant skeleton (vowels, stress, and spacing stripped). The second table's expectations are hand-written by me from the brief, the truth set, and the review; I could not re-read the Grayson or D&P pages from here.

| Word | Grayson page | Grayson as printed | Ilya today (s0) | Ilya after rules (s7) | Consonants vs Grayson: today | after |
|---|---|---|---|---|---|---|
| объедать | 194 | ɑb jɪ ˈdɑtʲ | ʌ bjɪ ˈdɑtʲ | ʌ bjɪ ˈdɑtʲ | agree | agree |
| обедать | 194 | ɑ ˈbʲɛ dɑtʲ | ɑ ˈbʲɛ dɑtʲ | ɑ ˈbʲɛ dɑtʲ | agree | agree |
| сесть | 194 | sʲesʲtʲ | ˈsʲesʲtʲ | ˈsʲesʲtʲ | agree | agree |
| вест | 194 | vʲɛst | ˈvʲɛst | ˈvʲɛst | agree | agree |
| подъём | 194 | pɑd ˈjom | pɑ ˈdjom | pɑ ˈdjom | agree | agree |
| объять | 194 | ɑb ˈjatʲ | ɑ ˈbjatʲ | ɑ ˈbjatʲ | agree | agree |
| смерть | 209 n. 277 | sʲmʲerʲtʲ | ˈsʲmʲerʲtʲ | ˈsʲmʲerʲtʲ | agree | agree |
| терпеть | 209 n. 277 | tʲirʲ ˈpʲetʲ | tʲɪr ˈpʲetʲ | tʲirʲ ˈpʲetʲ | DIFFER | agree |
| кирпич | 209 n. 277 | kʲirʲ ˈpʲitʃʲ | kʲir ˈpʲitʃʲ | kʲirʲ ˈpʲitʃʲ | DIFFER | agree |
| стол | 210 | stoɫ | ˈstoɫ | ˈstoɫ | agree | agree |
| столь | 210 | stolʲ | ˈstolʲ | ˈstolʲ | agree | agree |
| мать | 210 | mɑtʲ | ˈmɑtʲ | ˈmɑtʲ | agree | agree |
| мять | 210 | mʲatʲ | ˈmʲatʲ | ˈmʲatʲ | agree | agree |
| большой | 210 | bɑlʲ ˈʃoj | bɑlʲ ˈʃoj | bɑlʲ ˈʃoj | agree | agree |
| сестрёнка | 210 | sʲi ˈsʲtʲrʲon kɑ | sʲɪst ˈrʲon kɑ | sʲisʲtʲ ˈrʲon kɑ | DIFFER | agree |
| симметрический | 211 | sʲi mʲmʲi ˈtʲrʲi tʃʲɪ skɨj | sʲimʲ mʲɛt rʲi tʃʲɛs kɨj | sʲimʲ mʲetʲ rʲi tʃʲɛs kɨj | DIFFER | agree |
| обвить | 250 | ɑb ˈvʲitʲ | ɑbʲ ˈvʲitʲ | ɑb ˈvʲitʲ | DIFFER | agree |
| отчёт | 250 | ɑt ˈtʃʲot | ɑt ˈtʃʲot | ɑt ˈtʃʲot | agree | agree |
| оттенок | 250 | ɑtʲ ˈtʲɛ nʌk | ɑtʲ ˈtʲɛ nʌk | ɑtʲ ˈtʲɛ nʌk | agree | agree |
| изменять | 250 | izʲ mʲi ˈɲatʲ | izʲ mʲi ˈɲatʲ | izʲ mʲi ˈɲatʲ | agree | agree |

Grayson rows with identical consonant skeleton: today 15 of 20; after rules 20 of 20.

| Word | Consonant | Expected | Source | Today (s0) | After rules (s7) |
|---|---|---|---|---|---|
| первый | р | hard | D&P p. 87 | soft (X) | hard |
| четверг | р | hard | D&P p. 87 | soft (X) | hard |
| верх | р | hard | D&P p. 87 | soft (X) | hard |
| зеркало | р | hard | review amendment 2 (second р-before-hard-velar row) | soft (X) | hard |
| персик | р | soft | D&P p. 86 | soft | soft |
| версия | р | soft | D&P p. 86 | soft | soft |
| первенец | р | soft | D&P p. 86 | soft | soft |
| мерси | р | soft | D&P p. 86 (ratified reformulation) | hard (X) | soft |
| партия | р | hard | D&P p. 86 | hard | hard |
| армия | р | hard | D&P p. 86 | hard | hard |
| неподвижный | д | soft | D&P p. 80 | hard (X) | soft |
| дверь | д | soft | D&P p. 80 | hard (X) | soft |
| четверть | т | soft | D&P p. 80 | hard (X) | soft |
| зверь | з | soft | D&P p. 80 | hard (X) | soft |
| гулливая | л | soft | D&P p. 80 (geminate) | hard (X) | soft |
| гулливая | л (#2) | soft | D&P p. 80 (geminate) | soft | soft |
| эллин | л | soft | D&P p. 80 (geminate) | hard (X) | soft |
| иррегулярно | р | soft | D&P p. 80 (geminate) | soft | soft |
| лётчик | т | soft | D&P p. 81 | hard (X) | soft |
| медлить | д | soft | D&P p. 81 | hard (X) | soft |
| ветки | т | soft | Grayson p. 209/210 over D&P p. 79/80 n/c | hard (X) | soft |
| три | т | soft | Grayson p. 209/210 over D&P p. 79 n/c | hard (X) | soft |
| борщ | р | soft | D&P 3R(c), p. 87 (lexical) | hard (X) | soft |
| скорбь | р | soft | D&P 3R(c), p. 87 (lexical) | hard (X) | soft |
| церковь | р | soft | D&P 3R(c), p. 87 (lexical) | soft | soft |
| съесть | с | soft | ruled 2026-11-01 23:58; Grayson p. 193, 250 | hard (X) | soft |
| въезд | в | soft | ruled 23:58; Grayson p. 193; D&P p. 81 | hard (X) | soft |
| разъярять | з | soft | ruled 23:58; Grayson p. 193 | hard (X) | soft |
| съёмный | с | soft | ruled 23:58 (p. 194 prints hard) | hard (X) | soft |
| безъязычный | з | soft | D&P p. 83 | hard (X) | soft |

Letter expectations met: today 8 of 30; after rules 30 of 30.

## 7. The prefix list: every word it touched

**In the corpora and probes.** The list blocked (s6 to s7), in order of the table in section 5: обвить, отчёт, подвиг, подвижный, отлично, отвести, подвести, отчий (all probes in the truth-set run, rows I added or took from the brief), and **ответная** (the Sunless fixtures, in both files). Not one poem-corpus word was touched.

| Word | Source | Event | Before list | After list | Verdict |
|---|---|---|---|---|---|
| обвить | Grayson p. 250 | stop blocked (об) | ɑbʲ ˈvʲitʲ | ɑb ˈvʲitʲ | matches Grayson |
| отчёт | Grayson p. 250 | stop blocked (от) | ɑtʲ ˈtʃʲot | ɑt ˈtʃʲot | matches Grayson |
| ответная | Sunless fixtures | stop blocked (от) | ɑtʲ ˈvʲɛt nɑ jɑ | ɑt ˈvʲɛt nɑ jɑ | от-ветная, a true prefix |
| отлично | probe (review) | stop blocked (от) | ɑtʲ ˈlʲitʃʲ nʌ | ɑt ˈlʲitʃʲ nʌ | true prefix |
| отвести | probe (review) | stop blocked (от) | ʌtʲ vʲisʲ ˈtʲi | ʌt vʲisʲ ˈtʲi | true prefix |
| подвести | probe (review) | stop blocked (под) | pʌdʲ vʲisʲ ˈtʲi | pʌd vʲisʲ ˈtʲi | true prefix |
| подвиг | probe (review) | stop blocked (под) | ˈpodʲ vʲik | ˈpod vʲik | likely wrong (по-двиг-, my reading) |
| подвижный | probe (mine) | stop blocked (под) | pɑdʲ ˈvʲiʒ nɨj | pɑd ˈvʲiʒ nɨj | likely wrong; contradicts неподвижный |
| отчий | probe (mine) | stop blocked (от) | ˈotʲ tʃʲij | ˈot tʃʲij | likely wrong (отч- from отец, my reading); NOT ESTABLISHED |
| оттенок | Grayson p. 250 | same consonant, allowed | ɑtʲ ˈtʲɛ nʌk | unchanged | matches Grayson (exception i) |

The в/с/з-family prefixes (exception ii) matched without changing any output: снились, свищет, счастия, светлей, счастье, средь, свирели, смех, смерть, измерить, изменять. They are all words with initial с- or из-. Because `с` and `в` are on the list as one-letter prefixes, they match every word that begins with them, so this family is a no-op by construction.

**Dictionary-wide (supplementary).** The list changed 16,430 forms: от- 8,549, под- 5,473, об- 1,210, пред- 814, над- 384. Words that match a prefix but where nothing would have softened are not counted. I did not inspect all 16,430 for false positives; of the sample below, by eye, none is wrong except as noted for по-двиг-.

**от-**

| Form | Before list | After list |
|---|---|---|
| отсюда | ɑtʲˈsʲudɑ | ɑtˈsʲudɑ |
| отчет | ʌtʲtʃʲɪt | ʌttʃʲɪt |
| отличиться | ʌtʲlʲiˈtʃʲitːsʌ | ʌtlʲiˈtʃʲitːsʌ |
| отмежевайся | ʌtʲmʲɪʒɨˈvɑjsʌ | ʌtmʲɪʒɨˈvɑjsʌ |
| отряхиваемый | ɑtʲˈrʲaxʲivʌjɪmɨj | ɑtˈrʲaxʲivʌjɪmɨj |
| отличительное | ʌtʲlʲiˈtʃʲitʲilʲnʌjɪ | ʌtlʲiˈtʃʲitʲilʲnʌjɪ |
| отсчитывать | ɑtʲʃʲʃʲˈitɨvʌtʲ | ɑtʃʲʃʲˈitɨvʌtʲ |
| отрезом | ɑtʲˈrʲɛzʌm | ɑtˈrʲɛzʌm |

**под-**

| Form | Before list | After list |
|---|---|---|
| подле | ˈpodʲlʲɪ | ˈpodlʲɪ |
| подлизами | pɑdʲˈlʲizɑmʲi | pɑdˈlʲizɑmʲi |
| подписывать | pɑtʲˈpʲisɨvʌtʲ | pɑtˈpʲisɨvʌtʲ |
| подстрелил | pʌtʲsʲtʲrʲiˈlʲiɫ | pʌtsʲtʲrʲiˈlʲiɫ |
| подлежал | pʌdʲlʲɪˈʒɑɫ | pʌdlʲɪˈʒɑɫ |
| подчинявши | pʌtʲtʃʲiˈɲɑfʃɨ | pʌttʃʲiˈɲɑfʃɨ |
| подтягиваемый | pɑtʲˈtʲaɡʲivʌjɪmɨj | pɑtˈtʲaɡʲivʌjɪmɨj |
| подвёртывать | pɑdʲˈvʲortɨvʌtʲ | pɑdˈvʲortɨvʌtʲ |

**об-**

| Form | Before list | After list |
|---|---|---|
| обвинять | ʌbʲvʲiˈɲatʲ | ʌbvʲiˈɲatʲ |
| обвинению | ʌbʲvʲiˈɲeɲiju | ʌbvʲiˈɲeɲiju |
| обмерять | ɑbʲˈmʲerʲɑtʲ | ɑbˈmʲerʲɑtʲ |
| обвивающий | ʌbʲvʲiˈvɑjuʃʲʃʲij | ʌbvʲiˈvɑjuʃʲʃʲij |
| обменивай | ɑbʲˈmʲeɲivʌj | ɑbˈmʲeɲivʌj |
| обменивались | ɑbʲˈmʲeɲivʌlʲisʲ | ɑbˈmʲeɲivʌlʲisʲ |
| обмякали | ʌbʲmʲɪˈkɑlʲi | ʌbmʲɪˈkɑlʲi |
| обвенчали | ʌbʲvʲɪnˈtʃʲalʲi | ʌbvʲɪnˈtʃʲalʲi |

**пред-**

| Form | Before list | After list |
|---|---|---|
| предмет | prʲidʲˈmʲɛt | prʲɪdˈmʲɛt |
| предвидящий | prʲidʲˈvʲidʲɑʃʲʃʲij | prʲɪdˈvʲidʲɑʃʲʃʲij |
| предписаниям | prʲitʲpʲiˈsɑɲijɪm | prʲɪtpʲiˈsɑɲijɪm |
| предвещало | prʲidʲvʲiˈʃʲʃʲɑɫʌ | prʲɪdvʲiˈʃʲʃʲɑɫʌ |
| предметной | prʲidʲˈmʲɛtnʌj | prʲɪdˈmʲɛtnʌj |
| предписываемый | prʲitʲˈpʲisɨvʌjɪmɨj | prʲɪtˈpʲisɨvʌjɪmɨj |
| предчувствовал | prʲitʲˈtʃʲufstvʌvʌɫ | prʲɪtˈtʃʲufstvʌvʌɫ |
| предрекай | prʲidʲrʲɪˈkɑj | prʲɪdrʲɪˈkɑj |

**над-**

| Form | Before list | After list |
|---|---|---|
| надменный | nɑdʲˈmʲɛnnɨj | nɑdˈmʲɛnnɨj |
| надменна | nɑdʲˈmʲɛnnɑ | nɑdˈmʲɛnnɑ |
| надзиратели | nʌdʲzʲiˈrɑtʲilʲi | nʌdzʲiˈrɑtʲilʲi |
| надпилов | nɑtʲˈpʲiɫʌf | nɑtˈpʲiɫʌf |
| надлежащим | nʌdʲlʲɪˈʒɑʃʲʃʲim | nʌdlʲɪˈʒɑʃʲʃʲim |
| надвигаешься | nʌdʲvʲiˈɡɑjɪʃsʌ | nʌdvʲiˈɡɑjɪʃsʌ |
| надвинешься | nɑdʲˈvʲiɲɪʃsʌ | nɑdˈvʲiɲɪʃsʌ |
| надвинувши | nɑdʲˈvʲinufʃɨ | nɑdˈvʲinufʃɨ |

## 8. Clitic strings (`cliticData`, `engine.ts:247-288`)

I ran each of the 41 clitic keys through the word path (stress on the single vowel) and compared consonant softness with its canonical string. **One consonant string changes: для, canonical `dlʲɑ`, word path today `ˈdlʲɑ`, after the rules `ˈdʲlʲɑ`.** без `bʲɪz`, при `prʲi`, через `tʃʲɪrʲɪz`, перед `pʲɪrʲɪt`, передо, ли, ль, and the rest keep their consonant softness. The vowelless clitics reach the isolated-clitic path (`:1540-1548`) and none of their strings changes.

## 9. Sites checked against the brief (line numbers at bf4a45ad)

Confirmed as the brief describes: `computeCompletePalatalizationMap` at `:855` (passes at `:879`, `:888`, `:920`); the blocker set at `:299` and its check at `:902-905`, before `canRegressivelyPalatalize` at `:908`; the dental-before-м line at `:1003-1005`; the labial set with м at `:305`; `transcribeConsonant`'s own р branch at `:1267-1282`; ъ handled nowhere (s4 changed 2,220 forms from nothing). The Grayson email date in `engine.ts:1000` is "Feb 26, 2026"; I did not change or choose a date.

## 10. What I could not establish

- **Whether the brief has an addendum.** The file ends at line 52 without one.
- **Whether any of the 16,430 prefix-list changes beyond my samples is wrong.** NOT ESTABLISHED. Nor whether по-двиг- and отч- are as I read them: that is my own morphology, not sourced in this repository.
- **The suffix boundary.** Not built, not measured.
- **The dictionary-wide size of the three counterfactuals** (ч щ as dental triggers, ч щ as н triggers, м as labial trigger). I ran them on the corpora and the truth set only.
- **How many forms have unknown stress.** The ratified ⟨р⟩ rule needs stress; with none, ⟨р⟩ softens only when doubled or in the lexical set. Not counted.
- **Whether the hand-written letter expectations in section 6 match the printed pages.** I could not see the pages. The Grayson skeleton rows rest on the truth-set transcriptions, which the review says it checked against the images.
- **Whether my stand-in for the rules matches what step 1 will write.** The flags are a measuring device, not the implementation. Differences are possible: the ъ rule fires only before е ё ю я; the р rule reads stress through `isInStressedSyllable` and the next vowel after р; the prefix list checks the word start only.
- **Whether the fixtures' reconstructed words are the right words.** n188-markings is fragmentary.
- **The Grayson email date** (Feb 25 or 26), left alone as instructed.
- **Voicing in въезд** (the review's INBOX note): untouched and outside this brief.

## Appendix A: the temporary engine patch (reverted; not committed)

```diff
diff --git a/packages/phonology/src/engine.ts b/packages/phonology/src/engine.ts
index 5e462bd..0efba44 100644
--- a/packages/phonology/src/engine.ts
+++ b/packages/phonology/src/engine.ts
@@ -855,6 +855,7 @@ export const GraysonEngine = {
   computeCompletePalatalizationMap(word: string, syllables: string[], stressIndex: number, lexicalSoft: ReadonlySet<number> = new Set(), lexicalHard: ReadonlySet<number> = new Set()): Map<number, boolean> {
     const chars = [...word.toLowerCase()];
     const softIndices = new Map<number, boolean>([...lexicalSoft].map((i) => [i, true])); // index -> true if palatalized; seeded with lexical ц, ш (Grayson pp. 163, 168, 283-284)
+    const F: any = (globalThis as any).__PAL ?? {}; // STEP0-TEMP
 
     // Compute syllable boundaries: which char indices are in each syllable
     const syllableBoundaries: Array<{ start: number; end: number; isStressed: boolean }> = [];
@@ -885,6 +886,41 @@ export const GraysonEngine = {
       }
     }
 
+    if (F.hardSign) { // STEP0-TEMP: в, с, з before ъ + е ё ю я
+      for (let i = 0; i + 2 < chars.length; i++) {
+        if ((chars[i] === 'в' || chars[i] === 'с' || chars[i] === 'з') && chars[i + 1] === 'ъ' && ['е', 'ё', 'ю', 'я'].includes(chars[i + 2]) && !lexicalHard.has(i)) softIndices.set(i, true);
+      }
+    }
+    const rFront = (i: number): boolean => { // STEP0-TEMP: ratified р rule
+      const pv = chars[i - 1];
+      if (!(pv === 'и' || pv === 'е' || pv === 'э')) return false;
+      if (isInStressedSyllable(i - 1)) return true;
+      for (let j = i + 1; j < chars.length; j++) if (this.isVowel(chars[j])) return isInStressedSyllable(j);
+      return false;
+    };
+    const canNew = (i: number, c: string, tc: string): boolean => { // STEP0-TEMP
+      if (this.alwaysHard.has(c)) return false;
+      if (F.velAdjFix && this.checkVelarAdjectival(lw, i + 1).charRole === 'velar') return false; // STEP0-TEMP
+      if (c === 'л') return tc === 'л';
+      if (c === 'р') return tc === 'р' || (!!F.rRule && rFront(i));
+      if (c === 'н') return tc === 'н' || this.dentals.has(tc) || (!!F.nCh && (tc === 'ч' || tc === 'щ'));
+      if (this.velars.has(c)) return this.velars.has(tc);
+      if (this.labials.has(c)) return (F.dropM && tc === 'м' && c !== 'м') ? false : this.labials.has(tc);
+      if (c === 'т' || c === 'д' || c === 'с' || c === 'з') {
+        if (F.dentalAny) { if (F.noCh && (tc === 'ч' || tc === 'щ')) return false; if (F.noJ && tc === 'й') return false; return true; }
+        return this.dentals.has(tc) || tc === 'м';
+      }
+      return true;
+    };
+    const STOPS = ['от', 'под', 'над', 'пред', 'об', 'обо', 'ото', 'подо', 'надо', 'предо'];
+    const FAM = ['в', 'с', 'из', 'раз', 'без', 'воз', 'вз', 'низ', 'роз', 'чрез', 'через'];
+    const lw = word.toLowerCase();
+    const prefixAt = (i: number): { kind: string; prefix: string } | null => { // STEP0-TEMP
+      for (const pf of STOPS) if (lw.startsWith(pf) && i === pf.length - 1) return { kind: chars[i] === chars[i + 1] ? 'stop-same-consonant-allowed' : 'stop-blocked', prefix: pf };
+      for (const pf of FAM) if (lw.startsWith(pf) && i === pf.length - 1) return { kind: 'vzs-exception', prefix: pf };
+      return null;
+    };
+
     // PASS 2: Process regressive palatalization right-to-left through clusters
     // Working backwards, check if palatalization can step through
     for (let i = chars.length - 2; i >= 0; i--) {
@@ -900,18 +936,25 @@ export const GraysonEngine = {
 
       // Check for blockers (Grayson p. 209; D&P pp. 85-87)
       // р and л block regressive palatalization (confirmed by D&P)
-      if (this.regressivePalatalizationBlockers.has(nextChar)) {
+      if (!F.noBlocker && this.regressivePalatalizationBlockers.has(nextChar)) {
         continue; // Blocked - don't palatalize through р or л
       }
 
       // Check categorical restrictions (Grayson p. 209)
-      if (!this.canRegressivelyPalatalize(char, nextChar)) {
+      if (F.any ? !canNew(i, char, nextChar) : !this.canRegressivelyPalatalize(char, nextChar)) {
         continue; // Categorical mismatch
       }
 
       // Check for boundaries
       if (this.alwaysHard.has(char)) continue; // ж, ш, ц never palatalize
       if (chars[i + 1] === 'ъ') continue; // Hard sign blocks (except в, с, з - handled separately)
+      if (F.prefix) { // STEP0-TEMP
+        const pe = prefixAt(i);
+        if (pe) {
+          const lg = (globalThis as any).__PALLOG; if (lg) lg.push({ word: lw, ...pe, ch: char, next: nextChar });
+          if (pe.kind === 'stop-blocked') continue;
+        }
+      }
 
       // This consonant can be regressively palatalized
       softIndices.set(i, true);
@@ -925,7 +968,13 @@ export const GraysonEngine = {
     // Word-final р after front vowel does NOT palatalize: мир /mʲir/ not /mʲirʲ/
     const progressiveFrontVowels = new Set(['и', 'е', 'э']);
 
+    if (F.rLex) { // STEP0-TEMP
+      const lk: any = this.lookupStress(word.toLowerCase());
+      const lem = (lk?.lemma ?? lw);
+      if (lem === 'борщ' || lem === 'скорбь' || lem === 'церковь') { const ri = chars.indexOf('р'); if (ri >= 0) softIndices.set(ri, true); }
+    }
     for (let i = 0; i < chars.length; i++) {
+      if (F.rRule) break; // STEP0-TEMP: pass 3 retired
       if (chars[i] !== 'р') continue;
       if (softIndices.has(i)) continue; // Already soft from Pass 1 or 2
       if (!isInStressedSyllable(i)) continue; // Must be in stressed syllable
@@ -1271,7 +1320,7 @@ export const GraysonEngine = {
     // NOTE: This applies only when р is IN A CLUSTER (followed by consonant)
     // Word-final р after front vowel does NOT palatalize: мир /mʲir/ not /mʲirʲ/
     // v5.11.21: Use nextCharInWord to check across syllable boundaries
-    if (consonant === 'р' && isStressedSyllable) {
+    if (consonant === 'р' && isStressedSyllable && !(globalThis as any).__PAL?.rRule) {
       const frontVowels = ['и', 'е', 'э'];
       // Check both syllable-local nextChar AND word-level nextCharInWord
       const effectiveNextChar = nextChar || nextCharInWord;

```

## Appendix B: the measurement harness (a vitest file placed under `apps/web/src/lib/approval/`, run, then deleted)

Its inputs were `fixture-words.json` (lyric words extracted from the four fixtures by verse 1) and `truth-words.json` (the 64 truth-set words and probes), both kept in my scratchpad, not in the repository.

```ts
// TEMPORARY step-0 measurement harness. Lives in the source tree only while it runs; deleted before commit.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, it } from 'vitest';
import { setStressDictionary, setSingerSupplement, transcribeWord, GraysonEngine } from '@ilya/phonology';
import { setGlossDictionary } from '@ilya/dictionary';
import { processText } from '$lib/pipeline';

const SCR = '/tmp/claude-0/-home-user-Ilya/e3e278af-1c13-5cc6-896a-ca12d538beff/scratchpad/h/';
const DATA_DIR = join(__dirname, '../../../static/data');
const DICTIONARY_FILES = ['dictionary.86d83340-a.json', 'dictionary.86d83340-b.json'];
let dictKeys: string[] = [];

beforeAll(() => {
	const dictionary: Record<string, any> = {};
	for (const file of DICTIONARY_FILES) {
		const text = readFileSync(join(DATA_DIR, file), 'utf8');
		for (const line of text.split(/\r?\n/)) {
			if (!line.trim()) continue;
			try {
				const [word, entry] = JSON.parse(line);
				if (entry.e !== undefined || entry.f !== undefined) entry.g = { en: entry.e || '', fr: entry.f || '' };
				dictionary[word] = entry;
			} catch {}
		}
	}
	dictKeys = Object.keys(dictionary);
	setStressDictionary(dictionary);
	setGlossDictionary(dictionary);
	setSingerSupplement(JSON.parse(readFileSync(join(DATA_DIR, 'singer-supplement.json'), 'utf8')));
}, 60_000);

const S1 = { any: 1, noBlocker: 1 };
const S2 = { ...S1, rRule: 1 };
const S3 = { ...S2, rLex: 1 };
const S4 = { ...S3, hardSign: 1 };
const S5 = { ...S4, dentalAny: 1 };
const S6 = { ...S5, velAdjFix: 1 };
const S7 = { ...S6, prefix: 1 };
const CFG: Record<string, any> = {
	s0: {}, s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7,
	c_noCh: { ...S7, noCh: 1 }, c_noJ: { ...S7, noJ: 1 }, c_nCh: { ...S7, nCh: 1 }, c_dropM: { ...S7, dropM: 1 },
};
const ORDER = Object.keys(CFG);
const setCfg = (k: string) => { (globalThis as any).__PAL = CFG[k]; };

function runLines(lines: string[]) {
	// returns per config: array (per line) of array of {cyr, ipa, log}
	const out: Record<string, any[]> = {};
	for (const k of ORDER) {
		setCfg(k);
		out[k] = lines.map((l) => {
			const res = processText(l);
			return (res[0]?.words ?? []).map((w: any) => ({
				cyr: w.cyrillic, clean: w.cleanWord, ipa: w.ipaDisplay,
				log: (w.result?.transcriptionLog ?? []).filter((e: any) => e.features?.type === 'consonant').map((e: any) => [e.char, e.ipa]),
			}));
		});
	}
	return out;
}

describe('step 0 measurement', () => {
	it('measures', () => {
		const result: any = { order: ORDER };
		// 1. approval corpus lines
		const src = readFileSync(join(__dirname, 'ipa-corpus.approval.test.ts'), 'utf8');
		const body = src.slice(src.indexOf('const CORPUS: Poem[] = ['), src.indexOf('function renderCorpus'));
		const corpus = new Function(body.replace('const CORPUS: Poem[] =', 'return').replace(/;\s*$/, ''))() as Array<{ title: string; lines: string[] }>;
		const approvalLines = corpus.flatMap((p) => p.lines);
		result.approval = { lines: approvalLines, byCfg: runLines(approvalLines) };
		// 2. fixtures
		const fx = JSON.parse(readFileSync(SCR + 'fixture-words.json', 'utf8'));
		result.fixtures = {};
		for (const [f, v] of Object.entries<any>(fx)) {
			const line = v.words.join(' ');
			(globalThis as any).__PALLOG = [];
			result.fixtures[f] = { lines: [line], byCfg: runLines([line]) };
		}
		// 3. truth set + brief rows
		const truth = JSON.parse(readFileSync(SCR + 'truth-words.json', 'utf8'));
		result.truth = { words: truth, byCfg: runLines(truth) };
		// prefix event log for the corpora (s7 only)
		(globalThis as any).__PALLOG = [];
		setCfg('s7');
		for (const l of approvalLines) processText(l);
		for (const v of Object.values<any>(fx)) processText(v.words.join(' '));
		for (const w of truth) processText(w);
		result.prefixLog = (globalThis as any).__PALLOG;
		(globalThis as any).__PALLOG = undefined;
		// 4. clitics
		result.clitics = {};
		for (const [key, ent] of GraysonEngine.cliticData.entries()) {
			result.clitics[key] = { canonical: (ent as any).canonicalIpa };
			for (const k of ['s0', 's7']) {
				setCfg(k);
				try { result.clitics[key][k] = GraysonEngine.transcribe(key, 0, false).ipa; } catch (e) { result.clitics[key][k] = 'ERR'; }
			}
		}
		(globalThis as any).__PAL = undefined;
		writeFileSync(SCR + 'out-corpora.json', JSON.stringify(result));
	}, 600_000);

	it('dictionary-wide (supplementary)', () => {
		const keys = dictKeys.filter((w) => /^[а-яё]{2,}$/.test(w));
		const limit = Number(process.env.STEP0_DICT_LIMIT || keys.length);
		const sel = keys.slice(0, limit);
		const cfgs = ['s0', 's1', 's2', 's3', 's4', 's5', 's6', 's7'];
		const rows: any[] = [];
		const counts: Record<string, number> = {};
		const t0 = Date.now();
		for (const w of sel) {
			const ipas: string[] = [];
			for (const k of cfgs) {
				setCfg(k);
				try { ipas.push(transcribeWord(w).ipa); } catch { ipas.push('ERR'); }
			}
			if (ipas.some((x) => x !== ipas[0])) rows.push([w, ...ipas]);
		}
		(globalThis as any).__PAL = undefined;
		writeFileSync(SCR + 'out-dict.json', JSON.stringify({ total: sel.length, ms: Date.now() - t0, cfgs, rows }));
	}, 3_600_000);
});

```
