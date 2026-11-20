# Report, lane 74, step 4: item 1, the VOICE pane at rest gives its reason

Brief section 3. Paths without a directory are under `apps/web/src/lib/`.

## The verification the brief asks for first

The brief says to confirm that the `core` handed to `paneSentence` comes from `stableCore`, and to stop rather than widen the input if it does not. Read in this session:

- `components/Drawer/VoicePane.svelte:43-44`: `/** \`stableCore(voiceFormants)\`: the core vowels sampled and stable, in roster order (lane 68). */ core: readonly Vowel[];`
- `components/Drawer/VoicePane.svelte:59`: `const sentence = $derived(paneSentence({ usable, core, voiceType: voiceType?.voiceType, restWorkedOut }, language));`, so the prop goes straight in.
- `routes/+page.svelte:4187`, the only `<VoicePane` in `apps/web/src` (grep): `<VoicePane {language} seam={voiceSeam} voiceType={voiceTypeChoice} usable={usableReadingCount(voiceFormants)} core={stableCore(voiceFormants)}`.
- `voice/engine/sung.ts:33` and `:41`: `coreCount = stableCore(formants).length` and `isPersonal = coreCount(formants) >= PERSONAL_CORE_MIN`.

**Found: the value is `stableCore(voiceFormants)`, so `i.core.length >= PERSONAL_CORE_MIN` is `isPersonal(voiceFormants)`.** The input shape and `paneSentence`'s signature are unchanged.

## What changed (`components/Drawer/voice-pane.ts`)

1. A local `borrowingSentence(voiceType, language)` builds the ratified `placeholder.borrowing` from the string directly, as `borrowingLine` does (`analysis/placeholder-line.ts:108-118`, read): `{type}` from `voiceTypePrint({ voiceType })` on the Tier 1 id, `{borrowed}` from `borrowedStaffLabel`, filled with `fillVoiceType` and the tokens `type` and `borrowed`. It returns `null` unless `isBorrowingType`. It does not call `borrowingLine`, and it does not manufacture formants.
2. `borrowingFor(i, language)` returns that sentence unless `i.core.length >= PERSONAL_CORE_MIN`.
3. `typed-generic`, nothing sampled: a contralto, countertenor, or bass-baritone gets the borrowing line **in place of** `calib.pane.typedGeneric`. The five published types fall through to `calib.pane.typedGeneric`, unchanged.
4. `below-core`: for the three, the sentence is `` `${borrowing} ${below}` ``, borrowing line first, one space, one paragraph. `paneSentence` still returns a string. For the five published types it returns `belowCoreText(...)` alone, as before.
5. `none` and `not-sure` are untouched. No string was written or edited: `placeholder.borrowing`, `calib.pane.typedGeneric`, `calib.pane.notSure`, `calib.pane.belowCore`, and `calib.pane.none` are unchanged (`git diff` on `i18n.ts` shows only step 2's comment and step 3's new key).
6. Two comments updated: the file's header gains a paragraph for this item, and the comment inside the `typed-generic` branch no longer says the three types reach `borrowedStaffLabel` there.

## The order, read in the pages

The brief says MELODY and INSIGHTS draw the borrowing line first in the below-core state. Read in this session:

- `markup/MarkupPane.svelte:996`: `note={[keyRuler?.header(language), borrowingLine(voiceType, formants, language), placeholderNote]}`. The borrowing line comes before `placeholderNote`.
- `insights/InsightsPane.svelte:503`: `note={[keyRuler?.header(language), genericLede(...), borrowingLine(voiceType?.voiceType, formants, language), placeholderLine(...)]}`. The borrowing line comes before `placeholderLine`.
- `stand-in-borrowing.test.ts:171-172` pins both orders with regular expressions on those two lines.

The pages hold the two sentences as separate array entries; the pane's sentence is one string, so the pane joins them with one space (the brief's DESK DEFAULT, Dann's to overrule). The pin of the pane's own order, with `toBe` on the exact concatenation, is in step 5.

## What turned red

`vitest run components/Drawer/voice-pane.test.ts`: 4 failed, 24 passed. The four are the contralto, countertenor, and bass-baritone `typed-generic` cases (the brief's `:16-18`) and the below-core "for every type" case (the brief's `:81-86`). Those are exactly the two the brief's section 6 names. Step 5 updates them to the new behaviour.

## Rendered height at 390 px

This is the brief's NOT ESTABLISHED item and step 6 measures it: the pane's sentence block for a contralto with nothing sampled, and with three stable core vowels, in English and French, with pixel heights and pictures. Nothing in this step claims how the longer sentence sits.
