# Report: a doubled word-final hard sign from OCR is read as one (QUEUE row 87)

Branch `cloud-lane-2`, started from `e7acf7f` (row 83), clean working tree, 2026-10-12. Brief: desk (Opus), Fable-reviewed r2, as given in the task message. No pull request opened. Nothing under `docs/memory/` touched.

## What changed

Three files: `packages/dictionary/src/pre-reform-normalizer.ts`, `packages/dictionary/tests/pre-reform-normalizer.test.ts`, and this report.

The expression at `pre-reform-normalizer.ts:185`.

Before:

```
const PART_FINAL_HARD_SIGN = /([а-яА-ЯёЁ])[ъЪ](?![а-яА-ЯёЁ])/g;
```

After:

```
const PART_FINAL_HARD_SIGN = /([а-щы-яА-ЩЫ-ЯёЁ])[ъЪ]+(?![а-яА-ЯёЁ])/g;
```

The capture class omits ъ U+044A and Ъ U+042A and nothing else. The lookahead class is unchanged. The call-site order at `:273` is unchanged. The comment above the expression gains one paragraph (the OCR misread, the unverified claim about Russian words, the row 81 count, and the medial case).

## Behaviour, measured on the old expression and on the new

Old expression, run with `node` on `String.replace(…, '$1')`: спитъЪ → спитъ, спитЪъ → спитЪ, спитъЪъ → спитъЪ, изъЪ-подъ → изъ-под, ъЪ → ъ, съЪесть unchanged.

New expression, through `modernisePreReform`: спитъЪ → спит, спитЪъ → спит, спитъЪъ → спит, изъЪ-подъ → из-под, ъЪ → null, съЪесть → null.

## Tests

Six new tests, each named for its case, in the `modernisePreReform` block: спитъЪ, спитЪъ, спитъЪъ, изъЪ-подъ, ъЪ alone (null), and съЪесть (not collapsed; the name says a doubled medial hard sign is out of scope). The existing объѣхать test is kept, not duplicated. No existing test asserted the old ъЪ → ъ result, so none was edited. All existing normaliser tests pass unchanged: the file went from 40 to 46 tests.

The съЪесть test is a control, not a red-to-green test: the old expression also left it alone. The other five fail on the old expression.

## The eight gates

Before (at `e7acf7f`) and after:

| # | Gate | Before | After |
|---|------|--------|-------|
| 1 | `pnpm test:phonology` | 251 passed (251) | 251 passed (251) |
| 2 | `pnpm test:dictionary` | 242 passed (242) | **248** passed (248) |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| 4 | `pnpm --filter @ilya/web test` | 2402 passed (2402) | 2402 passed (2402) |
| 5 | `pnpm --filter @ilya/score-parser test` | 663 passed, 5 skipped (668) | 663 passed, 5 skipped (668) |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| 8 | `pnpm ratchets` | OK | OK |

The only count that moved is gate 2, by the six new tests. The Playwright suite is not one of the eight and was not run.

## Could not establish

- **That no Russian word ends in two hard signs.** The brief says "not verified against a source", and I did not verify it either. The code comment says the same.
- **Row 81's counts.** The 19, 12, and 2 doubled hard signs of 101, and "none is doubled on the page", come from the brief. Row 81's data is not on this branch's checkout, and I did not open it.
- **The effect on real OCR text.** I ran no OCR and no dictionary lookup on a doubled form. The change is shown only on the six strings above. Whether спит then hits the dictionary was not tested.
- **ълЪ and other OCR confusions.** Out of scope per the brief, not examined.
- **A doubled medial hard sign.** Left alone by design (съЪесть stays null). Whether OCR produces these in practice is unknown.
