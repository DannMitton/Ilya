# Report: step 9, the arias corrected to the aria proper (Code, cloud-lane-41, 2026-11-11)

From Fable's as-built review and Dann's ruling of 2026-11-10 20:46 ("just the aria"; title is the first line exactly as printed, 22:13). Data: `arias-corrected_r5_2026-11-10.json`, md5 `71d5ca1bf727d8a76e47e142a2e70354` (checked), removed from the tree in the same commit.

## What changed

- **Merge.** `origin/Shane` is `b7030de1` (it was force-updated: lanes 40, 44, and 39). The merge conflicted in one place only, the key index at the head of `i18n.ts` (the total and the `insights.`, `inspector.`, `intake.` counts). Resolved to Shane's counts plus this lane's two keys: 1,200 keys, `intake.` 51; `i18n-index.test.ts` passes. The tree also holds `tools/poems/poems-harvest-for-library_r2_2026-11-10.json` from Shane; I did not touch or merge it.
- **`tools/poems/library.json`.** The 89 libretto entries matched by id; `title`, `incipit`, `textModern`, `textEdition`, and `provenance.correction` copied from r5; no other field changed (the check found no other provenance difference in r5). In provenance, `opera_en` "Yevgenij Onegin" became "Eugene Onegin" and every "Tatjana" "Tatyana" (DESK DEFAULT, 7 entries); none is left in the library.
- **Build.** `correction` joins `PROVENANCE_KEYS`. **One new rule, decided here:** the build refused entry `67580c48a1` (Robert's aria, Иоланта) for a Latin letter. The corrected text quotes «benedicite» and «amen» as printed. The Latin-letter rule exists to catch a homoglyph inside a Russian word, so for a libretto it is now a Latin letter touching a Cyrillic one (`GLUED_LATIN`, `textFault(text, latinWordsAllowed)`); a poem keeps the strict rule. Two tests pin both sides. Reversible; it is one argument.
- **Poem file.** `dictionary.poems.a7c468a0.json` written, `dictionary.poems.b3cc2f7e.json` removed, `git add -f` (the poem file has no `.gitignore` exception). The manifest's dictionary hash is unchanged.

## Size

| | before (`b3cc2f7e`) | after (`a7c468a0`) |
|---|---|---|
| bytes | 526,109 | **552,855** |
| gzip -9 | 115,690 | **119,950** |
| brotli q11 | 83,562 | **86,527** |
| matcher letters | 71,041 | 75,252 |

## The matcher fixtures, before and after

`reference_sw_match.py` was re-run over the corrected library. **Its output is byte-identical to `expected_r2.txt`**, so no new expected file was made (a copy of the same bytes would only duplicate it). Matcher run in Node, before = the previous poem file, after = this one (top work score | second work score | margin | fill):

| fixture | before | after | |
|---|---|---|---|
| P | 21568f1c 0.293 / f1a88510 0.074 / 0.219, fills | same | same |
| S | c1964bc3 0.862 / 4f94e1a3 0.042 / 0.819, fills | same | same |
| T | 36f13ef5 0.681 / 04cc9462 0.030 / 0.651, fills | same | same |
| U1 | 2ba9040d 0.921 / a7b12193 0.045 / 0.876, fills | same | same |
| U4 | b655d8eb 0.050 / **7e59d67a 0.038** / **0.012**, refuses | b655d8eb 0.050 / **bb52aaf5 0.040** / **0.010**, refuses | second and margin moved |
| U5 | 7e59d67a 0.019 / a78be89a 0.018 / 0.001, refuses | same | same |
| U6 | 7b9b662a 0.708 / 00e3244d 0.035 / 0.673, fills | same | same |
| r114-song1 | eb5d3101 0.056 / 3e714e57 0.056 / 0.000, refuses | same | same |
| r114-song2 | 0127a63f 0.431 / a78be89a 0.023 / 0.408, fills | same | same |
| r114-song3 | 307359f1 0.447 / b655d8eb 0.088 / 0.358, fills | same | same |
| r114-song4 | 87376c17 0.441 / 04cc9462 0.045 / 0.396, fills | same | same |
| r114-song5 | f1a88510 0.271 / b655d8eb 0.044 / 0.227, fills | same | same |

Only U4 moved. Its matcher second was a different work from the reference's at step 6 (the shortlist did not hold it); now the shortlist holds the reference's second (bb52aaf5, 0.040), so **all twelve rows agree with the reference on top, second, and margin**, and the step 6 exception for U4 is removed from `poem-match.test.ts`. U4 refuses either way.

**Arias:** a Lyrics made from each aria's own text still fills its own entry for 89 of 89; the lowest margin is 0.948 (`e04061d4b4`, «Ах ты, доля-долюшка,»), from 0.944.

## Pins moved

- `tests/build-poem-library.test.ts`: the clean-library check passes `libretto` to `textFault`; `correction` is in the allowed provenance; +1 test (Latin words in a libretto). Gate 7: 151.
- `poem-offer-metadata.test.ts`: the three titles are read from the entries (they now carry their printed punctuation: «Еще одно, последнее сказанье —», «Ужель та самая Татьяна,»), not typed in the test. The Slippers aria's text and title changed («Слышит ли, девица, сердце твоё»); its Poet (Polonsky) is unchanged. Poets still fill for 5 of 89.
- `poem-source.test.ts`: stanza starts stay 166 (each aria is one stanza). **I read the capitals again**: 32 now, every aria one an ordinary word opening a verse line; «Марта», the proper noun the first reading found, left with the correction.
- `poem-match.test.ts`: `SECOND_DIFFERS` is empty (above). `poem-arias.test.ts` needed no change.

## Gates on the merged tip

| gate | result |
|---|---|
| 1 phonology | 456 |
| 2 dictionary | 248 |
| 3 web check | 0 errors, 12 warnings |
| 4 web test | 4,855 passed, 1 skipped (264 files) |
| 5 score-parser | 785 passed, 5 skipped |
| 6 blurb | 168 |
| 7 integration | 151 |
| 8 ratchets | OK |

Playwright: `e2e/poem-library.test.ts` passes alone, 21 of 21 (a first run, made while the gates ran, failed one test under load). I did not re-run the full desk and phone suites; the 11 baseline failures reported at step 8 are in files this step does not touch.

## For Dann

- **The Title now carries the first line's punctuation**, as ruled: a filled Title can read «Еще одно, последнее сказанье —» or end in a comma. If that reads badly in the field, trimming trailing punctuation on the fill is one line in `poem-metadata.ts`; I did not do it.
- **What I could not establish:** Varlaam `9ea4bc0f8a`'s line-count exception and the three entries marked NOT ESTABLISHED in `provenance.correction` were taken from r5 as shipped, not re-read against their pages. Whether the corrected texts match the pinned pages: not checked here (Fable's review did that).
