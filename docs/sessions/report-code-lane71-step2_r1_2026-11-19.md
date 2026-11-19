# Report, lane 71, step 2: `borrowedStaffLabel`, and `fillVoiceType` takes the token name

2026-11-19. Branch `cloud-lane-71`, on `10e545a7` (step 1) plus this step. Brief section 3. Paths are under `apps/web/src/lib/`.

## 1. What was added

**`voice/voiceTypes.ts`**

- `BORROWED_STAFF`: contralto to `voiceType.staff.mezzo-soprano`, bass-baritone to `voiceType.staff.bass`, countertenor to `voiceType.staff.mezzo-tenor`. It mirrors `standInBucket` (`voice/engine/stand-ins.ts:58`, `:60`).
- `isBorrowingType(id)`: whether an id is one of the three. Added so the draw rule of brief 4.7 (Step 4) and the three-type tests have one test to call, not a copy of the list.
- `borrowedStaffLabel(voiceType: string | undefined, language: Language): string | undefined`, beside `voiceTypePrint`. Its four clauses, as brief section 3 states them:
  1. the three return the fixed staff label whatever Tier 2 or Other holds (it takes the Tier 1 id alone, so Other's text cannot reach it);
  2. the five published types return `voiceTypePrint({ voiceType }, language)` on the Tier 1 id;
  3. `not-sure` returns `undefined` (the test `!isTier1(voiceType) || voiceType === 'not-sure'` runs before `voiceTypePrint` is called, which is what stops `voiceTypePrint:86-89` returning Other's text first);
  4. no type and any id that is not Tier 1 return `undefined`.
- `fillVoiceType(template, label, language, token = 'voiceType')`. The French elision rule (« de » to « d’ » before a vowel letter) and the single-helper purpose are kept. The `{token}` is replaced through a function, so a `$` in Other's text is not read as a replacement pattern (before this step `'$&x'` would have been mangled; I read that from the code, I did not run the old function).

**`i18n.ts`**: three keys after `voiceType.type.not-sure` (`:2267`): `voiceType.staff.mezzo-soprano` (EN `mezzo-soprano`, FR `mezzo-soprano`), `voiceType.staff.bass` (EN `bass`, FR `basse`), `voiceType.staff.mezzo-tenor` (EN `mezzo and tenor`, FR `mezzo et ténor`). The ratified fills of brief section 3, character for character; none contains an apostrophe or a colon. The key index at the head of the file (`i18n.ts:19`, `:88`) moves with them: total 1,342 to 1,345, prefix `voiceType.` 42 to 45. `i18n-index.test.ts` failed on the first (two assertions) and passes now.

## 2. A probe, run once and not kept

A throwaway `vitest` file, deleted before the commit (`git status -s` shows only `i18n.ts` and `voiceTypes.ts`). Output, read from the run:

- EN: soprano `soprano`, mezzo-soprano `mezzo-soprano`, contralto `mezzo-soprano`, countertenor `mezzo and tenor`, tenor `tenor`, baritone `baritone`, bass-baritone `bass`, bass `bass`; `not-sure`, `undefined`, and `'zzz'` all `null` (undefined).
- FR: soprano, mezzo-soprano, contralto `mezzo-soprano`, countertenor `mezzo et ténor`, tenor `ténor`, baritone `baryton`, bass-baritone `basse`, bass `basse`; the same three `null`.
- `fillVoiceType('valeurs de {borrowed}', 'basse', 'fr', 'borrowed')` gives `valeurs de basse`; `fillVoiceType('valeurs de {voiceType}', 'octaviste', 'fr')` gives `valeurs d’octaviste`; `fillVoiceType('a {voiceType}', '$&x', 'en')` gives `a $&x`.

The tests that keep these facts are Step 7's.

## 3. A conflict in the brief that Step 3 must settle, decided here and said now

Brief 4.1, 4.2, and 4.3 say "the fill is `borrowedStaffLabel`". `borrowedStaffLabel` takes the Tier 1 id, so for a singer on one of the five published types it would print the Tier 1 label and drop a Tier 2 label or Other's text from the subtitle, lede, and chart caption. Brief section 9 item 6 says the opposite for those five: "a singer on one of the five published types who typed Other text reads that text in `{voiceType}` today. This lane keeps that behaviour." The elision rule itself exists for Tier 2 labels (`fillVoiceType`'s comment: « d’octaviste »), so printing them is ratified behaviour (desk default 2026-11-11).

**Decision (reversible, Dann's to overrule):** at 4.1, 4.2, and 4.3 the three borrowing types print `borrowedStaffLabel` (the principle of the ruling, section 6), and the five published types keep `voiceTypePrint` on the whole choice, as today. I take 9.6 as the later and more specific word, and the ruling's principle is about borrowed values, which the five do not have. "Not sure" and no type never reach these sites, because `generic` is false for them. `borrowedStaffLabel` itself keeps clause 2 as the brief states it, for the sites that do want the Tier 1 id (4.6, 4.10). Step 3's report says how it was built.

## 4. Gates at this step

Gate 3: `svelte-check found 0 errors and 12 warnings in 5 files`. Gate 8: `ratchets: OK.`, no ratchet moved (`scripts/ratchets.json:5` lists `apps/web/src/lib/i18n.ts` with the text "The bilingual string table. It is data, and it grows with every ruled string.", which I read as an exemption note and not a ceiling). `voice/voiceTypes.test.ts` and the `i18n` tests: 40 passed (40). The full suite was not run at this step; Step 1 left twelve known failures that Step 7 repairs.

## NOT ESTABLISHED

1. Whether `scripts/ratchets.json:5` is an exemption and not a ceiling. I read its text, not the part of `scripts/ratchets.mjs` that consumes that section.
2. That `borrowedStaffLabel` is right for a Tier 1 id with an uppercase or padded spelling: `isTier1` is an exact match, so `' Contralto'` returns `undefined` there, where `hasPlaceholderProfile` and `standInBucket` trim and lower-case. Whether a stored id can ever carry that spelling is not read.
3. That the old `fillVoiceType` mangled `$&` in a label. Read from `String.replace` semantics, not run.
4. How the French reads in a sentence: nothing uses the keys yet.
