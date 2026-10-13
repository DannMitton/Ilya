# Brief for Code: a doubled word-final hard sign from OCR is read as one (r2, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 14:40. **r2, about 14:44: applies Fable's nine amendments** (`docs/sessions/review-fable-brief-row87_r1_2026-10-12.md`, SEND WITH AMENDMENTS); r1 superseded. QUEUE row 87, N.184 (`docs/memory/OPEN.md`, section "N.184"). For the cloud lane, Sonnet, on branch `cloud-lane-2` after row 83's commit. Fable reviews this brief before Code gets it (`docs/memory/CONTRACT.md`, the paragraph of 2026-10-11 22:36). **Small: one regular expression and its tests.**

Displaces: nothing.

## 1. What was observed

- Row 81 (`docs/sessions/report-code-underlay-baseline_r1_2026-10-12.md`, section 3 (the finding) and section 5 (the counts)): Tesseract often reads the heavy pre-reform word-final ъ as two glyphs, «спитъЪ». Doubled, of 101 word-final ъ: model (a) 19 (ъЪ 17, ъЪъ 1, ълЪ 1), (b) 12 (ъЪ 11, ълЪ 1), (c) 2.
- Row 81, section 3: `modernisePreReform` drops only the last one («спитъ»), so the word misses the dictionary.
- A Sonnet helper's measure for the desk, 2026-10-12 (`docs/sessions/memo-yat-dictionary-correction_r1_2026-10-12.md`): with the ѣ rule on, adding the collapse of a word-final «ъЪ» to «ъ» lifts syllables read right (of 493) from 297 to 304 for model (a), 310 to 315 for (b), and 317 to 318 for (c), the memo attributes every false ѣ to the ѣ rule; its collapse handled only the order ъЪ (memo, Method), and the Ъъ order below is the desk's extension, supported by the memo's own false ѣ «СпитЪъ → Спитѣъ». The collapse alone, without the ѣ rule, was not measured.

## 2. What is established, each line carrying its `path:line`

Read by the desk 2026-10-12 about 14:39:

- `packages/dictionary/src/pre-reform-normalizer.ts:185`: `PART_FINAL_HARD_SIGN = /([а-яА-ЯёЁ])[ъЪ](?![а-яА-ЯёЁ])/g`. The class `[а-яА-ЯёЁ]` contains ъ and Ъ themselves, so in «тъЪ» the first ъ is followed by a letter and is kept, and only Ъ is dropped.
- `:273`: `const dropped = mapped.replace(PART_FINAL_HARD_SIGN, '$1');`, run on the letter-mapped string (the comment at `:167-173` says the order is load-bearing).
- `:153-184`: the comment's rules: a medial hard sign is never touched; a token that is only a hard sign is returned unchanged.

## 3. Measure before you change anything

Run gates 1, 2, and 5 and record their counts. Find the normaliser's tests and list the hard-sign cases they hold.

## 4. The change

A run of two or more hard signs (ъ or Ъ, any mix) that ends a word or a compound part, after a letter that is not itself a hard sign, is treated as one word-final hard sign and dropped. The expression is `/([а-щы-яА-ЩЫ-ЯёЁ])[ъЪ]+(?![а-яА-ЯёЁ])/g`. The capture class omits ъ U+044A and Ъ U+042A and nothing else; the lookahead class is unchanged, and must stay unchanged, because removing a hard sign from it would collapse a medial run («съЪесть»). The desk knows no Russian word, old or new, that ends in two hard signs (not verified against a source), and of row 81's 101 printed word-final hard signs none is doubled on the page (section 5), so the run is read as a misread. Leave the medial rule, the order at `:273`, and the lone-hard-sign token exactly as they are. Update the comment at `:153-184` in one or two sentences to say why, citing row 81.

Tests, each named for its case: «спитъЪ» → «спит»; «спитЪъ» → «спит»; «спитъЪъ» → «спит»; «изъЪ-подъ» → «из-под»; «объѣхать» unchanged as today (→ «объехать»); «ъЪ» alone returns `null` (unchanged); note this is new: today's expression reduces «ъЪ» to «ъ», by the desk's reading of `:185`, not run, and if an existing test asserts the old result, stop and report rather than edit it; a medial «съЪесть» is NOT collapsed: assert `modernisePreReform('съЪесть')` returns `null` (a doubled hard sign between letters is out of scope; say so in the test name). The «объѣхать» case is the existing test at `:268-270`, kept, not duplicated. «ълЪ» (row 81, section 5) is not a run of hard signs and is out of scope.

## 4b. The rulings this serves

Dann, 2026-07-16: never touch ь; word-final only, never medial (`pre-reform-normalizer.ts:39-44`). Dann, 2026-08-08: modernise at intake (`:46-48`). This change widens word-final from one sign to a run and touches nothing else.

## 5. Constraints

- Change only `packages/dictionary/src/pre-reform-normalizer.ts`, its test file (`tests/pre-reform-normalizer.test.ts`, named at `:270`), and the report in section 7.
- On `cloud-lane-2`, after row 83's commit `e7acf7f`: confirm `git log -1 origin/cloud-lane-2` shows it before starting; commit and push only `cloud-lane-2`. Never push `Shane`, `main`, or `cloud-lane`; no pull request; nothing under `docs/memory/`.

## 6. Done when

- The seven tests pass, and every existing normaliser test passes unchanged.
- All eight gates pass; the counts that move are reported with the tests added.
- `WRITTEN` on the code. Nothing for Dann to walk until N.135 reads underlays in the app.

## 7. Report back

`docs/sessions/report-code-doubled-hard-sign_r1_2026-10-12.md` in the same commit: the commit, the gates before and after, the regular expression before and after, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer.
