# Report, row 175, step 4 (r1), 2026-11-02: Fable's amendments

Lane: cloud-lane-26, on top of step 3 (dca679cb). One commit. Nothing pushed to `Shane` or `main`; nothing under `docs/memory/` touched. The French colons are unchanged (item 6). `svelte-kit sync` was run before the gates, so the integration gate loads `tests/gloss-resolve.test.ts`.

## 1. What was done, item by item

**Item 1: the clusters of Grayson p. 236.** `ссч`, `стч`, `здч`, and `жч` are now read as /ʃʲʃʲ/, with `сч` and `зч`, and no dental sound stands before them. The six live in a new module, `shcha-clusters.ts`, in the order longest first, and the engine spreads that table at the head of `specialClusters`; `findSpecialClusters` takes them in that order and skips covered indices, so ссч is read whole. (I first wrote the table and its comment inline. It added 8 lines to `engine.ts` and the ratchet failed, correctly: the engine may only shrink. The module keeps `engine.ts` at 2051, equal to its ceiling.) Results on the words of p. 236:

| Word | Before | Now |
|---|---|---|
| рассчитать | rʌsʲʃʲʃʲiˈtɑtʲ (step 1) | rʌʃʲʃʲiˈtɑtʲ |
| мужчина | muʃˈtʃʲinɑ | muʃʲʃʲˈinɑ |
| жёстче | ˈʒosʲtʲtʃʲɪ | ˈʒoʃʲʃʲɪ |
| громоздче | ɡrɑˈmosʲtʲtʃʲɪ | …mo + ʃʲʃʲ + the vowel |

(The "Before" column for мужчина, жёстче, and громоздче is the desk's, from the amendment; I measured only the "Now" column and рассчитать.)

The four merged breakdowns are in `cluster-breakdowns.ts` in the shape of сч (their members spell the key). подсчитать stays as built: the д is `boundary-prefix` (p. 249), and the сч after it is /ʃʲʃʲ/; a row and a test pin both.

**Item 2: ч and щ trigger н.** Added to `N_TRIGGERS` (`palatalization.ts`), with the comment "D&P 1980, p. 81 кончать; Grayson p. 209 silent". Reason `regressive-n`. кончать is pinned with н soft. **This is wider than кончать suggests:** it changes 3,676 dictionary forms (section 3).

**Item 3: the look-alike list at both ends.** Truth-set rows: отчим and отчизна soft (`look-alike-root`); отчитать hard (`boundary-prefix`).

**Item 4: `soft: true` on the с and з members of the сч and зч breakdowns** (the entries at `:80` and `:88`) is dropped. It changed no rendered output and no test: nothing in `apps/web/src` or `packages/blurb/src` reads `features.soft` of a cluster member (searched both). The four new breakdowns are built the same way; every ч member keeps `soft: true` (it is always soft). A test pins both. The file header therefore needs no "display-only" note.

**Item 5: the 16 orphaned implications are deleted** from `data/blurb-composer.json` (`soft:*`, 15, and `hard:л`). 41 implications remain. The count pin in `french-parity.test.ts` moves from 197 to 181.

**Item 7: gates.** Section 5.

## 2. Every changed pin

| Pin | Was | Now | Source |
|---|---|---|---|
| `consonants-clusters.test.ts`, рассчитать | rʌsʲʃʲʃʲiˈtɑtʲ (step 1; rʌsʃʲʃʲiˈtɑtʲ before row 175) | rʌʃʲʃʲiˈtɑtʲ | Grayson p. 236, the ССЧ row: рассчитывать /ra ˈʃʲʃʲi tɨ vatʲ/. The "NOT ESTABLISHED" note is struck. |
| `blurb.test.ts`, `CLUSTER_BREAKDOWNS` has exactly | 12 entries (and 12 expected keys) | 16 (ссч, стч, здч, жч added) | Grayson p. 236 |
| `french-parity.test.ts`, template count | 197 | 181 | the 16 implications deleted (item 5) |

No web test changed (section 5). Tests added: `shcha-clusters.test.ts` (6), `blurb.test.ts` (2), the truth-set rows (11: рассчитывать, мужчина, жёстче, громоздче, резче, счастье as printed on p. 236; кончать; отчим, отчизна, отчитать; подсчитать), and one integration test for the deleted implications.

## 3. Whole-dictionary check (903,864 pure-Cyrillic forms, the real dictionary, a temporary harness, removed)

- **The agreement gate:** 0 disagreements over 4,896,323 consonant entries (й exempt, as before). The entry count falls from step 1's 5,008,782 less 112,140 й, because the absorbed letters of the clusters no longer have entries.
- **The clusters:** 244 forms, every one read as a single /ʃʲʃʲ/ cluster entry: ссч 184 (рассчитывать and its family), стч 4 (жёстче, похлестче, хлёстче, хлестче), здч 11 (объездчик and its forms), жч 45 (мужчина and its forms). 
- **н before ч or щ:** 3,676 forms, every one now `regressive-n` and soft: 3,195 with нч (-нчив- 541, -нчавш- 214, -нченн- 199, чуланчик, анчоусы) and 481 with нщ (женщина and its family, -нщик-, банщица). женщина, a very common word, is now [ˈʒeɲʃʲʃʲinʌ]. D&P p. 81 prints only кончать; Grayson is silent. This is the desk default as ruled. **For Dann to see:** it moves a common word, and it is as sourced as the ч-as-dental-trigger rule, which is to say on D&P alone.
- **объездчик (здч) crosses a suffix boundary** (объезд-чик), as Grayson's own мужчина (муж-чина) does. I take that as support for applying the cluster at a suffix boundary. Whether Grayson means every ЗДЧ across a boundary is NOT ESTABLISHED.

## 4. Two things I noticed

- **The merged clusters have no identity in the data**, so the panel's cluster row shows the bare mapping (ссч → ʃʲʃʲ), as сч and зч already do. I read this in the code (`lookupBlurb` for the cluster; no `identities` entry for any of the six) and did not run the panel. I wrote no new comment prose: that is Dann's.
- **резче.** The desk's quotation of p. 236 prints /ˈre ʃʲʃʲɪ/, with the р unmarked. Ilya's р is [rʲ] before е by Grayson's own p. 206 rule, and his p. 209 n. 277 prints sʲmʲerʲtʲ with the marks. The row asserts the cluster and the soft р by letter and does not compare a skeleton. Whether the print omits the ʲ is NOT ESTABLISHED: I could not read the page.

## 5. Gates

| Gate | Baseline or step 3 | Got |
|---|---|---|
| phonology | 291 (step 3: 390) | 407 passed |
| dictionary | 248 | 248 passed |
| web check | 0 errors, 12 warnings | 0 errors, 12 warnings in 5 files |
| web test | 3789 passed, 1 skipped (step 3: 3803) | 3803 passed, 1 skipped (217 files); no web test changed, and the approval golden master is unchanged in this step |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 145 (step 3: 146) | 148 passed |
| integration | 55 (step 3: 97) | **98 passed** in 6 files, after `svelte-kit sync`: step 3's 97 plus the one new test. `gloss-resolve.test.ts` is among the six. |
| pnpm ratchets | OK | OK; `engine.ts` 2051 of 2051 |

## 6. What I could not establish

- **The page itself.** Every p. 236 string above is the desk's quotation of the page; I did not read it. The skeleton comparisons for рассчитывать, мужчина, жёстче, громоздче, and счастье rest on that quotation.
- **резче's р** (section 4).
- **Whether ч and щ should trigger н for Grayson** (item 2): D&P only. NOT ESTABLISHED for him.
- **Whether ЗДЧ, СТЧ, and ССЧ apply across a suffix boundary** (объездчик).
- **That a merged-cluster row shows the bare mapping in the panel** (section 4): from the code, not a run.
- **The French colons:** untouched, by item 6.
- **The suffix boundary of p. 249:** not built, as before.
