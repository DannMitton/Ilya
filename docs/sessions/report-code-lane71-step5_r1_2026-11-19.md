# Report, lane 71, step 5: the Guide passage, whole, in both languages (brief 4.9)

2026-11-19. Branch `cloud-lane-71`, on `4955291c` (step 4) plus this step.

## 1. What was placed

`apps/web/src/lib/components/Reading/GuideContent.svelte`: two paragraphs, one after each MELODY notation paragraph.
- French: `:93`, after the paragraph at `:91` (under the heading at `:89`, « Les conventions de notation utilisées par le CHANT »).
- English: `:399`, after the paragraph at `:395` (under the heading at `:393`, "The notation conventions used by MELODY").

Each is `<p id="guide-markup-stand-ins">` and carries the ratified passage **whole, nothing struck**, the "If you have not named a type, Ilya starts from the middle of its five staves." sentence included (brief 4.9: the strike r2 proposed is withdrawn on Dann's 13:58 ruling).

**The text was not retyped.** A script read the two blockquotes out of `docs/sessions/ratified-voice-type-stand-ins_2026-11-19.md` (section 4 English; section 5 French, with the outer « » removed, which are that document's quotation marks) and joined their lines with single spaces. The only change to the words is the file's own convention of setting the name in italics: `Ilya` is written `<em>Ilya</em>` in both paragraphs (`Tant qu’<em>Ilya</em> n’a pas ...`, as `:91` and `:395` write it). Its text content is the ruling's.

Characters, checked on the placed French line with `grep`: every apostrophe is U+2019 (a count of straight `'` on `:93` is 0), and `fois` is followed by U+00A0 and then the colon (`grep -c $'fois\xc2\xa0:'` returns 1). The English line has no straight apostrophe.

## 2. The anchor id: **`guide-markup-stand-ins`**

It is an `id` on the paragraph, not a heading: `guide-anchors.ts` (18 lines) holds renamed anchors only, so nothing is added there. A paragraph id adds no Guide contents entry and no heading. The id is the same in both languages, as `guide-markup-notation` already is (`:89` and `:393`).

The link "Why these values" / « Pourquoi ces valeurs » is not drawn anywhere (step 4's report, section 4), so nothing on a page points at this id yet. When it does, the address is `#guide-markup-stand-ins`.

## 3. Gates

Gate 3: `svelte-check found 1 error and 12 warnings in 6 files`, the one error still `voice-pane.test.ts:15:43`, Step 7's. Gate 8: `ratchets: OK.` Tests in `src/lib/guide*` and `src/lib/components/Reading`: 4 files, 210 passed. The whole suite was not re-run in this step; no test reads the new paragraph, and Step 7 adds the one that does (brief test 15). Gates 1, 2, 5, 6, and 7 not re-run.

## NOT ESTABLISHED

1. That `#guide-markup-stand-ins` scrolls and highlights correctly. `routes/+page.svelte:3583-3588` (`handleHashNavigation`) passes any hash to `scrollToAnchor`; I did not read `scrollToAnchor`, and `Drawer.svelte:282`'s table that maps a Guide id to its parent chapter does not list the new id (I read that line, I did not run the Drawer's contents highlight with the new id).
2. How the passage reads on the page: no render in a browser, no print preview.
3. That the Guide's two sentences about an undeclared singer ("If you have not named a type, Ilya starts from the middle of its five staves") stay true. Dann's 13:58 ruling (brief preamble) keeps the average on the chart's ground and the partly sampled fill, and the brief says the sentence is true of what Ilya does. But after this lane a singer with no type and nothing sampled still takes **no** starting profile (`hasPlaceholderProfile` is false for no type), so for that singer the pages withhold, which the sentence does not say. I placed it whole as instructed and did not weigh it.
4. Whether `GuideContent.svelte` is under a ratchet ceiling with little slack. `ratchets: OK.` printed; I did not read the file's entry.
