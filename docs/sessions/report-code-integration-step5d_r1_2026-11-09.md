# Report: integration step 5d, LEARN's letter-name IPA is the engine's, 2026-11-09

Branch `cloud-lane-38`, commit `b409a1d0`. Found by Dann 2026-11-09 12:18: row 11, «и краткое», printed `[ˈkrɑt kʌ jɛ]`, missing the first word. Nothing pushed to `Shane` or `main`; no pull request; `docs/memory/` untouched. **Playwright not run** (it runs once more, after step 7).

## How the engine was run

`processText` from `apps/web/src/lib/pipeline.ts`, the pipeline TEXT uses, with the real dictionary and singer supplement loaded as `voicing-rule2.pipeline.test.ts` loads them, on each letter name; the output is each word's `ipaDisplay`, merge arrows dropped. Table rows are read from both copies in `LearnContent.svelte` (French lines 74 to 110, English 2115 to 2151): 37 rows each.

## The engine's answer for row 11

`[ˈi ˈkrɑt kʌ jɪ]`. **It is not the desk's expected `[i ˈkrɑt kʌ jɛ]`**: the engine stresses «и» as a word of its own (`ˈi`), and it reads the final «е» of «краткое» as [ɪ], not [ɛ]. I seated the engine's, in both rows. I did not hand-write any IPA.

## Every row against the engine

All 37 names, both languages. The only difference common to many rows is that the engine marks the stress of a one-word, one-syllable name («а» gives [ˈɑ]); the table prints such a name bare. **Decision (DESK DEFAULT, reversible, for Dann):** the comparison removes that one leading ˈ on a one-word, one-syllable name and nothing else, so the 26 rows that differ only by it are left as printed. If the table should show the engine's ˈ on those names, 26 rows change and the test's `asPrinted` goes. «у»: the engine gives no IPA for a lone «у» (a clitic, merged into its neighbour), so it is exempt, and a test shows the engine's output is empty.

Rows that differed otherwise, with both forms, now seated as the engine's (French and English copies both):

| Name | Printed before | Engine's output (now printed) |
|---|---|---|
| гэ | `[gɛ]` (ASCII g, U+0067) | `[ɡɛ]` (U+0261, the inventory's character) |
| и краткое | `[ˈkrɑt kʌ jɛ]` | `[ˈi ˈkrɑt kʌ jɪ]` |
| эл | `[ɛl]` | `[ɛɫ]` |
| ща | `[ʃtʃʲɑ]` | `[ʃʲʃʲɑ]` |
| твёрдый знак | `[ˈtvʲor dɨj znɑk]` | `[ˈtʲvʲor dɨj ˈznɑk]` |
| мягкий знак | `[mʲɑxʲ kʲij znɑk]` | `[ˈmʲɑk kɨj ˈznɑk]` |
| ять | `[jɑtʲ]` | `[jatʲ]` (the engine's «a», where the table had «ɑ») |
| фита | `[fʲitɑ]` | `[fʲi ˈtɑ]` |
| и десятеричное | French `[i dʲɪ sʲɪ tʲɪ ˈrʲitʃʲ nɑ jɪ]`; **English `[dʲɪ sʲɪ tʲɪ ˈrʲitʃʲ nɑ jɪ]`, missing the first «и»** | `[ˈi dʲi sʲi tʲi ˈrʲitʃʲ nʌ jɪ]` (both) |
| ижица | `[ˈi ʒɨ tsɑ]` | `[ˈi ʒɨ tsʌ]` |

That is 10 names, 20 changes (two copies each). **Two found missing words:** «и краткое» (both copies) and «и десятеричное» (English copy). The two copies of the table also differed from each other on «и десятеричное»; they now agree, and a test pins that both copies print the same IPA.

**To check with a phonetician's eye, not mine:** «мягкий знак» now reads `[ˈmʲɑk kɨj ˈznɑk]`. That is the engine's output, but «ки» as `kɨj`, and «мягкий» as `mʲɑk`, look wrong to me against Grayson (the table had `kʲij` and `mʲɑxʲ`). I seated it because the brief says to seat the engine's output, and I report it. «твёрдый знак» (`tʲvʲor`) and «ща» (`ʃʲʃʲɑ`, which the Anchor column already shows) are the other two where the engine departs from the printed form in a consonant.

## The pin

`apps/web/src/lib/learn-letter-names.test.ts` (+75 tests): the 37 rows exist in both copies; both copies print the same IPA; each row's printed IPA equals the engine's output for its name (French and English, «у» exempt, with the one-syllable convention above). Its comment says what it checks, why, what follows when it fails, and how it relates. If the engine changes, this test goes red and the table must follow.

## Gates (baseline, then this commit; clean worktree)

| Gate | Baseline | Now | Move |
|---|---|---|---|
| 1 | 407 | 435 | +28 (row 157) |
| 2 | 248 | 248 | none |
| 3 | 0 errors, 12 warnings | same | none |
| 4 | 4198, 1 skipped | 4679, 1 skipped (4680) | +481: 406 before, +75 now |
| 5 | 785, 5 skipped | same | none |
| 6 | 148 | 164 | +16 |
| 7 | 125 | 125 | none |
| 8 | OK. | OK. | none |

## What a singer would now see

LEARN's glyph table shows the first word of «и краткое» and of «и десятеричное», the inventory's ɡ for «гэ», and the engine's form for the nine other names above, in English and French.

## What I could not establish

- **Whether the engine is right** on «мягкий знак», «твёрдый знак», and «ять», only that the table now equals it.
- **The table's other columns** (the Anchor column, e.g. `[l] / [ɫ]`, `[ʃʲʃʲ]`) and the Notes text: not compared.
- **Other tables** (the transliteration tables at lines 167, 1023, 2208, 3064) have no IPA of names and were not touched.
- **Whether the page renders** the new strings as expected: not seen.
