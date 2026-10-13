# Brief for Code: a doubled word-final hard sign from OCR is read as one (r1, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 14:40. QUEUE row 87, N.184 (`docs/memory/OPEN.md`, section "N.184"). For the cloud lane, Sonnet, on branch `cloud-lane-2` after row 83's commit. Fable reviews this brief before Code gets it (`docs/memory/CONTRACT.md`, the paragraph of 2026-10-11 22:36). **Small: one regular expression and its tests.**

Displaces: nothing.

## 1. What was observed

- Row 81 (`docs/sessions/report-code-underlay-baseline_r1_2026-10-12.md`, section 5): Tesseract often reads the heavy pre-reform word-final ъ as two glyphs, «спитъЪ». Doubled, of 101 word-final ъ: model (a) 19 (ъЪ 17, ъЪъ 1, ълЪ 1), (b) 12 (ъЪ 11, ълЪ 1), (c) 2.
- Row 81, section 3: `modernisePreReform` drops only the last one («спитъ»), so the word misses the dictionary.
- The desk's measure of 2026-10-12 (`docs/sessions/memo-yat-dictionary-correction_r1_2026-10-12.md`): with the ѣ rule on, adding the collapse of a word-final «ъЪ» to «ъ» lifts syllables read right (of 493) from 297 to 304 for model (a), 310 to 315 for (b), and 317 to 318 for (c), and the collapse inserted no false letter. The collapse alone, without the ѣ rule, was not measured.

## 2. What is established, each line carrying its `path:line`

Read by the desk 2026-10-12 about 14:39:

- `packages/dictionary/src/pre-reform-normalizer.ts:185`: `PART_FINAL_HARD_SIGN = /([а-яА-ЯёЁ])[ъЪ](?![а-яА-ЯёЁ])/g`. The class `[а-яА-ЯёЁ]` contains ъ and Ъ themselves, so in «тъЪ» the first ъ is followed by a letter and is kept, and only Ъ is dropped.
- `:273`: `const dropped = mapped.replace(PART_FINAL_HARD_SIGN, '$1');`, run on the letter-mapped string (the comment at `:167-173` says the order is load-bearing).
- `:153-184`: the comment's rules: a medial hard sign is never touched; a token that is only a hard sign is returned unchanged.

## 3. Measure before you change anything

Run gates 1, 2, and 5 and record their counts. Find the normaliser's tests and list the hard-sign cases they hold.

## 4. The change

A run of two or more hard signs (ъ or Ъ, any mix) that ends a word or a compound part, after a letter that is not itself a hard sign, is treated as one word-final hard sign and dropped. No Russian word, old or new, ends in two hard signs, so the run can only be a misread. Leave the medial rule, the order at `:273`, and the lone-hard-sign token exactly as they are. Update the comment at `:153-184` in one or two sentences to say why, citing row 81.

Tests, each named for its case: «спитъЪ» → «спит»; «спитЪъ» → «спит»; «спитъЪъ» → «спит»; «изъЪ-подъ» → «из-под»; «объѣхать» unchanged as today (→ «объехать»); «ъЪ» alone unchanged; a medial «съЪесть» is NOT collapsed (a doubled hard sign between letters is out of scope; say so in the test name).

## 5. Constraints

- Change only `packages/dictionary/src/pre-reform-normalizer.ts` and its test file.
- On `cloud-lane-2`, after row 83's commit; commit and push only `cloud-lane-2`. Never push `Shane`, `main`, or `cloud-lane`; no pull request; nothing under `docs/memory/`.

## 6. Done when

- The seven tests pass, and every existing normaliser test passes unchanged.
- All eight gates pass; the counts that move are reported with the tests added.
- `WRITTEN` on the code. Nothing for Dann to walk until N.135 reads underlays in the app.

## 7. Report back

`docs/sessions/report-code-doubled-hard-sign_r1_2026-10-12.md` in the same commit: the commit, the gates before and after, the regular expression before and after, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer.
