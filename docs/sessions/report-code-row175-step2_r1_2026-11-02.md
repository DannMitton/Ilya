# Report, row 175, step 2 (r1), 2026-11-02: the truth set as a test

Lane: cloud-lane-26, on top of step 1 (689eba7a). Step 2 adds tests only. No source file changed, so **no pin changed** in this step: every pin that the rules moved was listed in the step 1 report.

## 1. What was added

| File | What |
|---|---|
| `packages/phonology/tests/truth-set-palatalization.test.ts` | 58 tests: 55 word rows in six groups, 2 lexical-exception rows, and 1 agreement gate. Each row carries its source and page. |
| `apps/web/src/lib/approval/ipa-corpus.approval.test.ts` | One new test, the agreement gate over the approval corpus (453 consonants of the 40 lines). The existing approval test and its golden master are unchanged in this step. |

Phonology: 332 to **390** tests (58 new). Web: one test added (the corpus gate).

## 2. The rows

Stress is written as an apostrophe after the stressed vowel, because the phonology tests run without a dictionary. Each row pins the softness of named consonants (letter, nth occurrence) and, where it helps the reader, the reason. Grayson's printed rows are also compared to Grayson's IPA by consonant skeleton (vowels, stress, spacing, and length stripped).

| Group | Rows | Source in the comment |
|---|---|---|
| Grayson, as printed | объедать, обедать, сесть, вест, подъём, объять (p. 194); смерть, терпеть, кирпич (p. 209 n. 277); стол, столь, мать, мять, большой, сестрёнка (p. 210); симметрический (p. 211); обвить, отчёт, оттенок, изменять (p. 250) | G, with the page |
| The hard sign, ruled soft over the p. 194 table | съесть, въезд, разъярять, съёмный; безъязычный (D&P p. 83) | R: Grayson p. 193 prose, p. 206 rule 2, p. 250; OPEN.md 2026-11-01 23:58 |
| D&P, agreeing with the ruling | первый, четверг, верх, зеркало (⟨р⟩ hard); персик, версия, первенец, мерси (⟨р⟩ soft); партия, армия (⟨р⟩ hard before a soft consonant); неподвижный, дверь, четверть, зверь (dental soft, p. 80); гулливая, эллин, иррегулярно (geminate, p. 80); лётчик, медлить (p. 81) | DP, with the page. The ⟨р⟩ rows say "ratified reformulation, OPEN.md 2026-11-01 23:53", so that a later reader does not "correct" the code back to D&P's wording. |
| Grayson over D&P | ветки, три | "Grayson p. 209/210 over D&P p. 79/80 n/c" |
| D&P 3R(c), lexical ⟨р⟩ | борщ, скорбь, церковь | DP p. 87 3R(c); desk default |
| Look-alike roots and prefixed words (ruling of 2026-11-02 00:50) | подвиг, подвижный, отчий (dental soft, reason `look-alike-root`); отвести, подвести, отлично (dental hard, reason `boundary-prefix`) | R; Grayson p. 249; D&P p. 79 (от/лично, под/бил n/c) |
| Exception words (addendum) | счастье, счастливая: ⟨а⟩ is [ɑ], `exception: 'lexical-exception'` | Grayson 2012, p. 287, ch. 6 section 5 |

Not in the list but added: зеркало (review amendment 2 asked for a second ⟨р⟩-before-a-hard-velar row beyond четверг).

## 3. The agreement gate

For every consonant entry, the softness in the IPA must equal the softness its reason implies (`softnessOfReason`): `palReason` carried out of the map, `soft` read from the sung IPA. It runs in two places.

- Over every row of the truth set (phonology test): passes; asserts more than 150 consonant entries were checked.
- Over the approval corpus (web test): passes on all **453** consonant entries.

The glide ⟨й⟩ is exempt in both, and the test comment says why: it is always soft by reason `always-soft`, and its IPA is the glide [j], which has no ʲ in Grayson's inventory. Step 1's whole-dictionary run (903,864 forms, 5,008,782 consonant entries) found no other disagreement; that run is the broader evidence, and it is not a test in the tree.

## 4. Results against the sources

All 55 word rows and the 2 exception rows pass on the built engine. Grayson's 20 printed rows have the same consonant skeleton as his IPA (his p. 194 print of съесть, въезд, and разъярять is not used as a skeleton, because the ruling overrides it; those rows are pinned by letter). The rows that used to fail on the engine of bf4a45ad (step 0, section 6) are: терпеть, кирпич, сестрёнка, симметрический, обвить among Grayson's, and 22 of the 30 letter expectations.

## 5. Gates

| Gate | Baseline | Got |
|---|---|---|
| phonology | 291 | 390 passed (291 + 41 in step 1 + 58 here) |
| dictionary | 248 | 248 passed |
| web check | 0 errors, 12 warnings | 0 errors, 12 warnings in 5 files |
| web test | 3789 passed, 1 skipped | 3803 passed, 1 skipped (217 files): step 1's 3802 + the corpus gate; the merge of `origin/Shane` brought the other 13 above 3789 |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 145 | 145 passed |
| integration | 55 | 55 passed |
| pnpm ratchets | OK | OK |

## 6. What I could not establish

- **The printed pages themselves.** The expectations for the D&P rows, the hard-sign rows, and the look-alike rows are hand-written from the brief, the truth set, the review, and the rulings. I could not re-read Grayson or D&P from here. The Grayson skeleton rows rest on the truth-set document's transcriptions, which the review says it checked against the images.
- **Voicing and vowel quality.** The skeleton comparison strips vowels and ignores length, and the rows check softness only. Voicing differences (the review's въезд note) are outside this brief.
- **Rows whose source is silent.** лётчик and медлить are D&P's (p. 81); Grayson is silent on ч as a trigger on his pages 193 to 211. The test comment says so. NOT ESTABLISHED for Grayson.
- **Whether the stress marks in the rows are the dictionary's.** The rows state the stress that the source implies for each ⟨р⟩ row. The dictionary's stress for these words was not checked row by row here.
- **A test of the 'modern' adjectival profile.** The guard for a velar kept hard applies to the 'stage' profile; no row pins the other.
