# Fable's review of row 87's brief (r1, 2026-10-12)

Reviewed by Fable, 2026-10-12. Inputs read whole: `docs/sessions/brief-code-doubled-hard-sign_r1_2026-10-12.md`, `docs/sessions/memo-yat-dictionary-correction_r1_2026-10-12.md`, `packages/dictionary/src/pre-reform-normalizer.ts`, `docs/sessions/report-code-underlay-baseline_r1_2026-10-12.md`, and `docs/sessions/BRIEF-TEMPLATE.md`. Nothing was run; every trace of the regular expression below is by hand and is marked so.

**Verdict: SEND WITH AMENDMENTS.** The change is right and small. The brief leaves the regular expression to Code without saying that the capture class must exclude the hard sign, and one of its seven tests («ъЪ» alone unchanged) contradicts what the code does today, so Code would either fail that test or widen the change on its own. Amendments 1 and 2 close that. The rest are citation and hedging fixes.

## 1. Claims checked against the files

| Brief | Says | Finding |
|---|---|---|
| §1 bullet 1 | Row 81 section 5: Tesseract often reads word-final ъ as «спитъЪ»; counts 19 (ъЪ 17, ъЪъ 1, ълЪ 1), 12 (ъЪ 11, ълЪ 1), 2 | Counts match `report-code-underlay-baseline_r1:126`. The quoted sentence and «спитъЪ» are in section 3, `:69`, not section 5. |
| §1 bullet 2 | Row 81 section 3: the normaliser drops only the last one | `report:69`. Correct. |
| §1 bullet 3 | Memo: 297 to 304, 310 to 315, 317 to 318 | Memo `:11-15`: table "after" 304, 315, 318; "with the collapse off, c 317, a 297, b 310". Correct as read. The memo calls itself "measured by a Sonnet helper for the desk" (`:3`), not the desk's own measure. |
| §1 bullet 3 | "the collapse inserted no false letter" | Not in the memo. The memo's "words broken 0" (`:9-13`) is for the whole method, and its false-ѣ counts are the ѣ rule's. A deletion cannot insert a letter, so the claim is sound, but it is the desk's reasoning, not the memo's finding. |
| §1 bullet 3 | The collapse alone was not measured | Correct: the memo gives ѣ-rule-on with collapse on and off (`:11-15`), nothing with the ѣ rule off. |
| §1, unstated | The memo's collapse covered any order of the two signs | It did not. Memo `:7`: "a word-final ъЪ collapsed to ъ", one order. The brief's "any mix" is the desk's extension. The memo supports it: its false ѣ «СпитЪъ to Спитѣъ» (`:16`) is a Ъъ token the one-order collapse missed. |
| §2 | `:185` regex text, class contains ъ and Ъ | `pre-reform-normalizer.ts:185` reads exactly as quoted. ъ is U+044A, inside а U+0430 to я U+044F; Ъ is U+042A, inside А U+0410 to Я U+042F. Correct. |
| §2 | In «тъЪ» the first ъ is kept and only Ъ dropped | Traced by hand: at т the lookahead sees Ъ, a class member, and fails; at ъ the capture is ъ, the sign is Ъ, the lookahead sees end, and the match gives «тъ». Correct. |
| §2 | `:273`, comment at `:167-173` | Both correct (`:273`, `:167-173`). |
| §2 | `:153-184` medial rule, lone token | Medial at `:180-183`; lone token at `:175-178` and again at `:197-198`. Correct. |
| §4 | Leave the lone-hard-sign token exactly as it is | The lone token the code protects is a single «ъ» (`:175-178`). A token «ъЪ» is not protected today: by the same trace as «тъЪ», the capture is ъ, the sign Ъ, and the result is «ъ». So the test "«ъЪ» alone unchanged" is NEW behaviour, not today's. Hand trace, not run. |
| §4 | "No Russian word, old or new, ends in two hard signs" | No source in any input. Fable's knowledge, not verified. Row 81's own count gives a measured anchor: of 101 printed word-final ъ, none is doubled on the page (`report:126`, the doublings are all readings). |
| §5 | Change only the normaliser and its test file | Contradicts §7, which asks for `docs/sessions/report-code-doubled-hard-sign_r1_2026-10-12.md` in the same commit. |
| §5 | On `cloud-lane-2` after row 83's commit | Row 83's commit is in no input. NOT ESTABLISHED. Code cannot check it is on the right tip without a hash. |
| §3 | Gates 1, 2, and 5; "all eight gates" in §6 | The gate list is in no input. NOT ESTABLISHED here; Code presumably reads it from the tree. |
| §4 test 5 | «объѣхать» → «объехать» unchanged as today | The comment at `:268-270` names an existing test of that case in `tests/pre-reform-normalizer.test.ts`. The test file was not an input, so its existence is the comment's word. |
| Template | Section 4 "The rulings this serves" | The brief has no rulings section. The rulings are in the file: never touch ь, word-final only (`:39-44`, 2026-07-16); modernise at intake (`:46-48`, 2026-08-08). |

## 2. The regular expression

The brief describes the rule and leaves the expression to Code. Two expressions satisfy §4's first sentence and they differ on the sixth test.

- `/([а-яА-ЯёЁ])[ъЪ]+(?![а-яА-ЯёЁ])/g` (add `+` only): «спитъЪ» → «спит», «изъЪ-подъ» → «из-под», «съЪесть» unchanged, but «ъЪ» alone → «ъ», which fails test 6.
- `/([а-щы-яА-ЩЫ-ЯёЁ])[ъЪ]+(?![а-яА-ЯёЁ])/g` (capture excludes the hard sign, as §4's "after a letter that is not itself a hard sign" asks): all seven tests pass by hand trace. The ranges `а-щ` (U+0430 to U+0449) and `ы-я` (U+044B to U+044F) omit exactly ъ U+044A; `А-Щ` and `Ы-Я` omit exactly Ъ U+042A. ё and Ё stay listed because they lie outside а to я.

Hand traces on the second expression (not run):

- «спитъЪ», «спитЪъ», «спитъЪъ»: capture т, `[ъЪ]+` takes the whole run, lookahead sees end → «спит».
- «изъЪ-подъ»: capture з, run ъЪ, lookahead sees «-» → «из»; then capture д, ъ, end → «из-под».
- «объѣхать»: mapped first to «объехать» (`:243-251`), then capture б, ъ, lookahead sees е → no match → «объехать».
- «ъЪ» alone: no capture candidate → no match → `modernisePreReform` returns `null`.
- «съЪесть»: at с the run ъЪ is followed by е, backtracking to ъ leaves Ъ in the lookahead class, both fail; at ъ no capture; → no match, returns `null`.
- Guillemets, comma, full stop, capitals: the lookahead rejects none of them as letters, so «СПИТЪЪ», «спитъЪ», and «спитъЪ,» all collapse.

The lookahead class must keep ъ and Ъ. If a hard sign were removed from it, the backtracked single ъ in «съЪесть» would see Ъ as a non-letter and the medial run would collapse, which §4 rules out.

«ълЪ» (`report:126`, one each in models a and b) is not a run of hard signs and the rule does not reach it; «спитълЪ» would become «спитъл» and miss the dictionary, as today. Harmless, and out of scope. The brief does not say so.

## 3. Amendments

1. §4, after the first sentence, add: "The expression is `/([а-щы-яА-ЩЫ-ЯёЁ])[ъЪ]+(?![а-яА-ЯёЁ])/g`. The capture class omits ъ U+044A and Ъ U+042A and nothing else; the lookahead class is unchanged, and must stay unchanged, because removing a hard sign from it would collapse a medial run («съЪесть»)." Reason: without it, the simpler `+`-only expression satisfies the prose and fails test 6.
2. §4, replace "«ъЪ» alone unchanged" with: "«ъЪ» alone returns `null` (unchanged). Note this is new: today's expression reduces «ъЪ» to «ъ», by the desk's reading of `:185`, not run. If an existing test asserts the old result, stop and report rather than edit it." Reason: Code will otherwise meet a contradiction between the brief and the code and resolve it alone.
3. §4, replace "No Russian word, old or new, ends in two hard signs, so the run can only be a misread." with: "The desk knows no Russian word, old or new, that ends in two hard signs (not verified against a source), and of row 81's 101 printed word-final hard signs none is doubled on the page (section 5), so the run is read as a misread." Reason: rule 1, a claim without a source is marked.
4. §1 bullet 3, replace "and the collapse inserted no false letter" with "the memo attributes every false ѣ to the ѣ rule; its collapse handled only the order ъЪ (memo, Method), and the Ъъ order below is the desk's extension, supported by the memo's own false ѣ «СпитЪъ → Спитѣъ»." Reason: the memo does not say what the brief says, and the extension is unmeasured.
5. §1 bullet 1, change "section 5" to "section 3 (the finding) and section 5 (the counts)"; §1 bullet 3, change "The desk's measure" to "A Sonnet helper's measure for the desk". Reason: both are what the files say.
6. §5 first bullet, replace with: "Change only `packages/dictionary/src/pre-reform-normalizer.ts`, its test file (`tests/pre-reform-normalizer.test.ts`, named at `:270`), and the report in §7." Reason: §5 and §7 contradict each other.
7. §5 second bullet, after "after row 83's commit", add its hash, or "its hash is in `docs/memory/QUEUE.md` row 83; confirm `git log -1 cloud-lane-2` matches before starting". Reason: Code cannot verify the tip without one.
8. Insert a section "The rulings this serves" before Constraints: "Dann, 2026-07-16: never touch ь; word-final only, never medial (`pre-reform-normalizer.ts:39-44`). Dann, 2026-08-08: modernise at intake (`:46-48`). This change widens word-final from one sign to a run and touches nothing else." Reason: the template requires it and the rulings bound the change.
9. §4 tests, add: "Test 7 asserts `modernisePreReform('съЪесть')` returns `null`. Test 5 is the existing test at `:268-270`, kept, not duplicated. «ълЪ» (row 81, section 5) is not a run of hard signs and is out of scope." Reason: each test needs an exact assertion, and Code should not chase «ълЪ».

## 4. What the brief gets right

- The order at `:273` is untouched; the mapped string still feeds the rule, so «объѣхать» stays safe.
- Hyphenated compounds, trailing punctuation, guillemets, and capitals all fall to the existing lookahead; nothing new is needed for them.
- The medial rule survives because the run must end at a non-letter.
- Scope and branch discipline match the cloud-lane shape (no PR, nothing under `docs/memory/`).

## Could not establish

- Row 83's commit hash and the current tip of `cloud-lane-2`: in no input.
- The gate list (gates 1, 2, 5, and "all eight"): in no input.
- The test file `tests/pre-reform-normalizer.test.ts` and its existing hard-sign cases: not an input; known only from the comment at `:268-270`.
- Every regular-expression result above is a hand trace, not a run.
- Whether any Russian word, old or new, ends in two hard signs: no source read this session.
- Whether the Ъъ order occurs in models (a) and (b): row 81 reports only ъЪ, ъЪъ, and ълЪ for them (`report:126`); the Ъъ case is from model (c) in the memo (`:16`).
