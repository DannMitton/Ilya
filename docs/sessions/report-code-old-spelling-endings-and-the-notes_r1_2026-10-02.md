# Report: the old spelling's endings, and the old spelling under the notes (r1)

**QUEUE row 25, state: WRITTEN, pushed to `cloud-lane`. DONE is Dann's walk.** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-11, for `docs/sessions/brief-code-old-spelling-endings-and-the-notes_r1_2026-10-02.md`. The brief ran on `c601192`; this ran on `cloud-lane` at `18b3b760` (row 50), clean tree before the first edit. The brief asks for one commit for the measurements and one per part; this session made **one commit for the row** (DESK DEFAULT: the measurements are in this report, and the parts share one test file). Nothing pushed to `Shane` or `main`, no pull request, `tools/e16-harness/` untouched.

## Section 3: measured before anything changed

### 3.1 The song

The score file of section 1 (`docs/sessions/measure-phase1_r1_2026-10-02/tchaikovsky-op38-3-voice.musicxml`), 90 score words, which the pipeline reads as 95 words (each «въ» or «съ» elided onto the next syllable is a word of its own). Measured with the real dictionary through `processText`, as Markup's resolver calls it.

- **Old features:** 36 words carry one: an abolished letter or a final hard sign (34), **-аго** (1, «шумнаго»), **-ыя** (1, «печальныя»). No -яго, -ія, онѣ, однѣ, ея, or нея occurs in this song.
- **Before:** 34 of the 36 were already modernised at intake (letter map and hard sign, then the dictionary gate). The two that were not: «шумнаго», displayed as printed, stress inferred (VERIFY), IPA `ʃum nɑ ɡo`; and «печальныя», the same, `pʲe tʃʲalʲ nɨ jɑ`.
- **After:** «шумнаго» displays «шумного», stress from the dictionary, `ˈʃum nʌ vʌ`; «печальныя» displays as printed, stress from «печальные», `pʲi ˈtʃʲalʲ nɨ jɪ`. The other 93 words are byte-identical before and after.

### 3.2 The endings against the dictionary

Every headword of the dictionary (both shards and the homograph tier), letter map applied first:

| Rule | Headwords it applies to | Proposed form known | Lemma agrees | Lemma differs (false matches) |
|---|---|---|---|---|
| -аго → -ого (-его after ж, ц, ч, ш, щ) | 284 | 273 | 270 | 3 |
| -яго → -его | 7 | 6 | 6 | 0 |
| -ыя → -ые | 225 | 224 | 220 | 4 |
| -ія → -ие | 179 | 73 | 73 | 0 |

The false matches, all rejected by the lemma check: «большаго» → «большего» (lemma «больший», not «большой»), «самаго» → «самого» (lemma «сам»), the suffix headword «-наго»; «данныя» → «данные» (lemma «данные»), «-ныя», «пыточныя» → «пыточные» (lemma «пыточная»), «коломыя» → «коломые» (a place name).

**Order:** the letter map runs first, then the ending rule. For -ія the two orders find the same 73 forms; letter-map-first is required for -яго in «послѣдняго» (the ending sits after a ѣ), and is what the code does. «большаго» shows why both endings are proposed after a hushing consonant: the reform wrote -его there only where the ending was unstressed (хорошаго → хорошего), and «большого» is the form whose lemma agrees.

### 3.3 Modern words that must not move

Every headword ending in -аго or -яго whose lemma is not an old-spelling adjective: «благо», «саго», «Чикаго», «Сантьяго», «Тринидад и Тобаго», «во благо», «имаго». None of their proposed forms («блого», «сого», …) is in the dictionary, so none moves. «млекопитающаго», «животнаго», «мороженаго», «нашаго», «вашаго» are old spellings of adjectival nouns and determiners, and do change («животнаго» → «животного»), lemma agreeing.

### 3.4 The notes

Before: Markup withheld **81 of the song's 90 score words**, from «въ тревогѣ» (bar 11) to the end. Two causes, measured:

1. **The comparison** (`vowel-resolver.ts`, the pairing): the score's cleaned word «вътревогѣ» was compared with the pipeline's modern «втревоге». They differ, the walk lost sync, and the latch (`localLost`) withheld every word after it, old spelling or not.
2. **The syllable count:** the score-side vowel pattern lacked ѣ, і, and ѵ, so «гѣ» and «мір» counted as vowelless and their words had one slot too few against the engine's count.

After: **0 withheld.**

## Section 6, line by line

1. **HOLDS.** «шумнаго» displays «шумного», no VERIFY box, IPA `ˈʃum nʌ vʌ`, which is exactly what «шумного» gives, stress from the dictionary, `preReformSource` «шумнаго». Test `1. «шумнаго» reads as «шумного» …` in `apps/web/src/lib/old-spelling.test.ts`.
2. **HOLDS.** -яго: «синяго» → «синего» (`ˈsʲi ɲɪ vʌ`, was `ˈsʲi ɲɑ ɡʌ`). -аго after a hushing consonant: «хорошаго» → «хорошего» (`xɑ ˈro ʃɨ vʌ`, was `xɑ ˈro ʃɑ ɡʌ`); and «большаго» → «большого», the lemma choosing -ого. Test `2. …`.
3. **HOLDS.** «благо», «саго», «Чикаго», «Сантьяго», «имаго» give today's result to the byte: display, stress, stress source, and IPA pinned from the tree before this row (`18b3b760`). Test `3. …`.
4. **HOLDS, with a DESK DEFAULT on -ія.** «печальныя» takes stress 1 and its gloss from «печальные»; display and IPA letters as printed: `pʲi ˈtʃʲalʲ nɨ jɪ` (before: `pʲe tʃʲalʲ nɨ jɑ`, stress inferred). «большія» takes stress 1 from «большие» and displays as printed; its IPA is `bɑlʲ ˈʃɨ jɑ` (before: `bolʲʃ ɑ`, because the engine deletes a letter it does not know, `engine.ts:232-233`). **DESK DEFAULT:** for a word still carrying an abolished letter, "the letters that feed the IPA" are read as the letter-mapped ones («большия»), the reform's own homophone pairs, since the printed і cannot reach the engine at all. Tests `4. …`.
5. **HOLDS.** Every note of the song whose word Text transcribes carries its IPA; the Cyrillic under the notes is Text's modern spelling divided as the score divides it. Bar 9 reads «шум-но-го» over `ˈʃum nʌ vʌ`. No word is withheld. Test `5. …` (the score file is now a tracked fixture, `apps/web/src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml`: Tchaikovsky and A. K. Tolstoy, 1878, public domain).
6. **HOLDS.** The *Sunless* 1 fixture: Text's words (display, stress, source, IPA) and Markup's notes (Cyrillic and IPA under every onset) are byte-identical before and after, measured by running the same probe on the old and new code. Test `6. …` pins that nothing is respelled and nothing withheld.
7. **HOLDS.** All eight gates pass; see the table.
8. **DONE.** `docs/sessions/report-code-old-spelling-endings-and-the-notes_r1_2026-10-02.files/`: `before-` and `after-` Text page 1 and Markup pages 1 to 4, from the dev build. The "before" pictures were taken with the four changed app files swapped back to `18b3b760`.

## The changes

- `packages/dictionary/src/pre-reform-normalizer.ts`: `oldEndingCandidates` (-аго → -ого, or -его then -ого after ж, ц, ч, ш, щ; -яго → -его) and `lookupOnlyTwin` (the closed table онѣ → они, однѣ → одни, однѣхъ → одних, однѣмъ → одним, однѣми → одними, ея → её, нея → неё; -ыя → -ые; -ія → -ие), exported from `index.ts`. The header's stale note on the rhyme conflict is replaced by what is built and what is lookup only. Tests in `tests/pre-reform-normalizer.test.ts` (+7).
- `apps/web/src/lib/old-spelling.ts` (new): `adoptOldEnding` and `lookupOnlyTwinFor`, both adopting a form only when the dictionary knows it and its lemma agrees with the printed word's (lemmas compared in modern spelling, so «нашъ» and «наш» agree). **DESK DEFAULT:** where the printed word is not in the dictionary, there is no lemma to compare, and the twin must at least decline like an adjective, determiner, pronoun, numeral, or participle.
- `apps/web/src/lib/pipeline.ts`: intake adopts an old ending before the letter-map form; a lookup-only twin replaces the lookup; the transcription reads the twin's letter-mapped form when one is given; `preReformSource` now reaches `WordStackData`. The file stays at 1,064 lines, under its ceiling of 1,065; **no ceiling rose**.
- `apps/web/src/lib/types.ts`: `WordStackData.preReformSource` (optional).
- `apps/web/src/lib/score/vowel-resolver.ts`: a score word pairs with the pipeline's when its modern, printed, or displayed spelling matches (`spellsAs`, `printedSpelling`); the vowel pattern includes ѣ, і, and ѵ; a new `cyrillic` resolver gives the modern syllables (`modernSyllables`) for words intake modernised. `VocalLineEvent` is unchanged and nothing in `reconciliation/` was touched.
- `apps/web/src/lib/markup/MarkupPane.svelte`: the modern syllables join `cyrPreview` beneath the singer's pairings, which still win.

No new string for the singer.

## The eight gates

| # | Gate | Before (row 50) | After row 25 |
|---|---|---|---|
| 1 | `pnpm test:phonology` | 251 passed (251) | 251 passed (251) |
| 2 | `pnpm test:dictionary` | 235 passed (235) | **242 passed (242)** |
| 3 | `pnpm --filter @ilya/web check` | 0 errors and 12 warnings in 5 files | same |
| 4 | `pnpm --filter @ilya/web test` | 2125 passed (2125) | **2133 passed (2133)** |
| 5 | `pnpm --filter @ilya/score-parser test` | 653 passed, 5 skipped (658) | same |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| 8 | `pnpm ratchets` | OK | OK |

Gate 2 +7: the new `oldEndingCandidates` and `lookupOnlyTwin` tests. Gate 4 +8: `old-spelling.test.ts`. The brief's baselines (1870 and 650) are older; the counts here are from this lane's last run.

## Found, not in this brief

**Markup's page 1 for this song hides systems below its footer, before and after this row.** Before: page 1 shows bars 1 to 24 in three systems, under a tall empty band, and page 2 opens at bar 39, so **bars 25 to 38 are drawn nowhere a reader can see**. After: page 1 shows a fourth system's staff (bar 26) cut by the footer, and page 2 opens at bar 48, so bars 26 to 47 are lost. This row changes which bars fall off (the withheld-word legend left the header, and the underlay changed), not that they do. The pictures in the `.files` folder show both. The cause is NOT ESTABLISHED; the page opens with a run of 7 silent bars, and the empty band above the first system is present on both sides. This is the desk's to brief.

## Could not establish

- **How -ыя, -ія, онѣ, ея, нея are sung.** The brief keeps them lookup only because that is Dann's to say. The IPA here reads the printed (letter-mapped) letters.
- **The glosses of the pronoun twins.** «онѣ» and «нея» now take the dictionary's gloss for «они» and «неё», which the kaikki data files under the lemma «я» with the gloss "I". Before, they showed "they" (from «оне») and "alternative" (from «нея»). «ея» now shows the supplement's "her/hers". The rule follows the brief; the gloss data is the dictionary's, and NOT ESTABLISHED as right.
- **«самаго».** Its genitive of «самый» is «самого», but the dictionary files «самого» under «сам», so the lemma check keeps «самаго» as printed, as today.
- **Dann's library.** Only this one song in the old spelling was measured.
