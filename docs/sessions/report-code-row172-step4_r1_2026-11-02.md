# Report: row 172, step 4, the GUIDE and LEARN (Code, r1, 2026-11-02)

Branch `cloud-lane-29`, on `5628f27` (step 3) plus this step.

## What changed

`apps/web/src/lib/components/Reading/GuideContent.svelte`, English, now `:334` (the brief's `:333`; one line moved by the French comment above it). The last two sentences of the paragraph read:

> To review the authoritative poem itself anytime, choose POEM in INPUT: TEXT then shows the whole poem as published, including any words the composer has left out, and says so in a line above the page. Choose LYRICS in INPUT to return.

Before: "To review the authoritative poem itself anytime, choose Poem in Text: you will see that Ilya has transcribed the whole poem as published, including any words the composer has left out." The capitals are the ones the file uses for the named places (it already writes MELODY and INSIGHTS) and Dann's ruling of 2026-11-01 13:26. "Input" earlier in the same paragraph still reads in mixed case; that is row 171's, not this step's.

French, now `:39` (the brief's `:38`; the comment is `:38`): the sentence « Pour consulter à tout moment le poème qui fait autorité, choisissez Poème dans l’onglet Texte : ... » is **unchanged**, and an HTML comment above the paragraph marks it `TODO-FR (row 172)`. The comment compiles away; it never reaches a singer. **Consequence to know:** until Dann rules the French, a French singer reads an instruction the app no longer offers (there is no Poème pill on TEXT). That is the brief's order (nothing French reaches `Shane` before he rules), so I followed it; the desk may prefer to hold the French edit and this step together.

`LearnContent.svelte`: no sentence on the witness. `git grep -i "poème\|witness\|témoin"` in it returns nothing (and no "poem" in the sense of the choice).

## For row 171, by number

- `apps/web/src/lib/components/Reading/GuideContent.svelte:334` (EN), the sentences above.
- `apps/web/src/lib/components/Reading/GuideContent.svelte:39` (FR), the stale sentence, with its `TODO-FR` comment at `:38`.

## Gates, after step 4

| # | Result |
|---|---|
| 1 phonology | 407 passed |
| 2 dictionary | 248 passed |
| 3 check | 0 errors, 12 warnings |
| 4 web unit | 3846 passed, 1 skipped (3847) |
| 5 root integration | 98 passed |
| 6 blurb | 148 passed |
| 7 score-parser | 785 passed, 5 skipped (790) |
| 8 ratchets | OK, nothing offered |

`GuideContent.svelte` has no ceiling in `scripts/ratchets.json`.

## The row, as left

Open for Dann, in order of weight:

1. `relining.test.ts:95` (phone) is red because of the ruling (step 2's report, "Decision for Dann").
2. The French: `text.source.lyrics`, `text.source.poem`, and `GuideContent.svelte:39` await his ruling.
3. Pre-existing red on the untouched cut `f9797acb`, not this row's: desk `glue-typed-marks` (2), `insights-page`, `loupe-header`, `print-pages`, `singer-paths:169`; phone `input-views:134`. `heic-reader-path` (desk) not checked on the untouched cut.
4. Existing phone and desk specs that find the drawer pull by `/paper/i` (nine locators) look stale since the label became "the page"; not touched, not all run individually.
5. Row 163's `ViewPair` change landed before the cut (step 0).
