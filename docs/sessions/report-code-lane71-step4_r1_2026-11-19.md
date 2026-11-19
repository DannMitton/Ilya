# Report, lane 71, step 4: the borrowing line (brief 4.7)

2026-11-19. Branch `cloud-lane-71`, on `8a118007` (step 3) plus this step. Paths are under `apps/web/src/lib/`.

## 1. What was built

**`analysis/placeholder-line.ts`**: a new exported pure function `borrowingLine(voiceType: string | undefined, formants, language): string | null`, appended after the existing functions. `placeholderLine` and every other existing function in the file are untouched. The draw rule is the brief's, stated once in the function's comment: the declared Tier 1 id is contralto, countertenor, or bass-baritone (`isBorrowingType`, `voice/voiceTypes.ts`), **and** `!isPersonal(formants)` (`voice/engine/sung.ts:41`). It reads neither `AdaptedProfile.generic` nor the vowel list, so it draws with nothing sampled, with one to four core vowels sampled, and with no score.

**`i18n.ts`**: one key, `placeholder.borrowing`, EN and FR as ratified (ruling sections 3 and 5): "The field has not yet published resonance values for a {type}, so Ilya is using its {borrowed} values until you sample your own vowels in VOICE." and « La recherche n’a pas encore publié de valeurs de résonance pour un {type}. Ilya utilise donc ses valeurs de {borrowed} jusqu’à ce que vous échantillonniez vos propres voyelles dans VOIX. ». The French is written with `’`, the file's own escape. I put it above the "Placeholder vowels" comment block (`i18n.ts:~2051`), not inside it. The key index (`i18n.ts:19`, `:61`) moves with it: total 1,345 to 1,346, `placeholder.` 12 to 13.

**`{type}`** is `voiceTypePrint({ voiceType }, language)` on the Tier 1 id alone; **`{borrowed}`** is `borrowedStaffLabel`. Both are filled through `fillVoiceType` with the token name (Step 2).

**The two pages**, each with its own entry in the `note` array, in this order:
- `insights/InsightsPane.svelte` (`note={[...]}` at `:503`): `keyRuler?.header`, `genericLede`, **`borrowingLine(voiceType?.voiceType, formants, language)`**, `placeholderLine`.
- `markup/MarkupPane.svelte` (`:996`): `keyRuler?.header`, **`borrowingLine(voiceType, formants, language)`**, `placeholderNote`. `voiceType` there is the string id prop (`MarkupPane.svelte:146`), passed from `routes/+page.svelte:4397` as `voiceTypeChoice?.voiceType`.

The header renders on page 1 of INSIGHTS whenever `n === 0` (`InsightsPane.svelte:576-577`), with or without a score, so the no-score page names the borrowing.

## 2. Probe output, run once and not kept

A throwaway test, deleted. `borrowingLine(id, {}, language)`:

- EN contralto: "The field has not yet published resonance values for a contralto, so Ilya is using its mezzo-soprano values until you sample your own vowels in VOICE."
- EN countertenor: "... for a countertenor, so Ilya is using its mezzo and tenor values ..." EN bass-baritone: "... for a bass-baritone, so Ilya is using its bass values ..."
- FR: « ... pour un contralto. Ilya utilise donc ses valeurs de mezzo-soprano ... », « ... pour un contre-ténor. ... valeurs de mezzo et ténor ... », « ... pour un baryton-basse. ... valeurs de basse ... », each ending « dans VOIX. ».
- `null` for tenor, mezzo-soprano, `not-sure`, `undefined`, and `'zzz'`, in both languages.

I did not probe a voice with five stable core vowels; that is Step 7's test 7.

## 3. Ratchets: why the function sits in `placeholder-line.ts`

My first build put the function in a new file `analysis/borrowing-line.ts`. Gate 8 then failed: `InsightsPane.svelte is 678 lines, over its ceiling of 677` and `MarkupPane.svelte is 1352 lines, over its ceiling of 1349` (one extra import line each, plus a derived and a comment in MarkupPane). I did not raise a ceiling. I moved the function into `placeholder-line.ts`, so each pane adds a name to its existing `placeholder-line` import and nothing else; `pnpm run ratchets` then printed `ratchets: OK.` with no ceiling touched. Whether `placeholder-line.ts` has a ceiling of its own and how close it is: not read.

## 4. The link: NOT built, and why

The ruling says both lines "end with the link 'Why these values'" (« Pourquoi ces valeurs »), and brief section 6 lists the link as a ratified string. Brief 4.7 says nothing of how it draws, and brief 4.9 asks only that the link be given an anchor in the Guide. The header note is not a place that can hold a link: `components/Paper/TitleHeader.svelte:202-203` renders each `note` entry as a `<p class="header-note">` of plain text, splitting only `[ipa]` spans, and the page is a print page inside `PageFit`. A link there needs a new rendering path in `TitleHeader`, an owner for the click (the Guide lives in a different destination, `routes/+page.svelte`'s `handleHashNavigation`), and a decision about what the printed page shows. I found no existing link from a paper page to the Guide (`grep -rn "#guide-"` outside the Guide returns only the Drawer's contents list and `guide-anchors.ts`).

I did not invent that. What I did: the line is complete without the link (the ruling says the link "adds depth and does not hold the disclosure"), no key for the link text was added (an unused key would only be a dead string), and Step 5 gives the Guide passage its anchor and reports it, so the link has a target when Dann rules on how it draws. **This is the one ratified element of row 167 the lane does not put on the page. It is Dann's call, and a lane of its own if he wants it.**

## 5. Two remedy sentences

In the `generic` state the page now carries this line and `placeholder.line.many` (`i18n.ts`, "through the DRAWER on the left"), as brief 4.7's named cost says. `placeholder.line.many` and its siblings were not touched.

## 6. Gates

Gate 3: `svelte-check found 1 error and 12 warnings in 6 files`; the one error is still `voice-pane.test.ts:15:43` (`'typed-none'`), Step 7's. Gate 8: `ratchets: OK.`, no ceiling moved. Whole web suite: `6670 passed | 17 failed | 5 skipped (6692)`, the same seventeen as Step 3 (`adapter-golden` 1, `analyze-score-adapter.test` 1, `stand-ins-snapshot` 5, `identity.test` 1, `ratified-lines.test` 3, `voice-pane.test` 4, `resolve-values.test` 2). This step added no failure. `i18n-index.test.ts` passes with the updated index. Gates 1, 2, 5, 6, and 7 were not re-run.

## NOT ESTABLISHED

1. How the line looks on the page: its wrapping, its length under the title (it is two sentences in French), whether it pushes page 1's header into the body, and how it reads beside `placeholder.line.many`. Nothing was rendered in a browser; the Playwright suite was not run. A header taller by a line is the likely risk for INSIGHTS's pagination (`onheightchange`), not read.
2. That the line draws on INSIGHTS with no score. I read that the header renders at `n === 0`; I did not render the no-score page. Step 7's test 7 does.
3. Whether `placeholder-line.ts` has its own ceiling and its slack.
4. That `voiceType` at `MarkupPane.svelte:146` equals `voiceTypeChoice.voiceType` in every state; I read the call site at `routes/+page.svelte:4397`, not every route into the pane.
5. How Dann wants the link drawn (section 4).
