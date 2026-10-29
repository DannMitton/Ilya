# Report: N.135 stage 2b r5, step 6, one check, `vowelsPerNote` (Code, cloud lane, 2026-10-29, r1)

Branch `cloud-lane-21`, on top of step 5 (`072e0d19`). One commit. It also corrects three line citations in the step 5 report (`underlay-seams.ts:57` and `:81`, `stamp.ts:47`), which I had written from memory of an earlier edit; the lines are now read.

## The answer first

1. **Built.** `vowelsPerNote(notes, { vowelCount })` in `apps/web/src/lib/omr/vowels-per-note.ts`. It takes the text on each note (`id`, `text`, `continuation`) and reports each note that is: `no-vowel` (letters, no vowel, not a continuation), `many-vowels` (two or more, continuation or not), or `mark-alone` (text with no letter that is not a joint). It reports and changes nothing. `isCyrillicVerse` says whether a verse holds a Cyrillic letter, so the caller can run the vowel count on Cyrillic verses and the mark check on every verse (amendment 4).
2. **No lone `#` is allowed.** A note whose text is `#`, `.`, or any mark alone is `mark-alone`; there is no allow-list parameter. `я #` (fused) has a letter and one vowel and is silent.
3. **Where it lives:** `omr/`, beside `VOWEL`, which it imports (`omr/underlay-units.ts:24`). `score/` may import it (`score/` already imports `omr/unread-bars`); the ratchet gate checks only the six modules, and `omr` is not one.
4. **Gates:** 1 291 passed (291). 2 248 passed (248). 3 found 0 errors and 12 warnings in 5 files. **4 3651 passed | 1 skipped (3652).** 5 775 passed | 5 skipped (780). 6 145 passed (145). 7 55 passed (55). 8 ratchets: OK.

## Tests (`omr/vowels-per-note.test.ts`, 11)

«в бью» one vowel (silent); «в» none (reported); «бью ж» one (silent); «мой» one and «й» alone none; «мгновенья» many; ѣ, і, ѵ counted; no text, `-`, `_`, and spaces not reported; a continuation with no vowel not reported while two vowels on one are; `#`, `.`, `#` reported as marks; `я #` silent; an IPA verse gets the mark check only.

**A correction to the brief:** it says «мгновенья» is four vowels. The word has three vowel letters (о, е, я: мгно-ве-нья). The test says three and carries the note.

## Which vowel set it uses (brief §7), each line read this session

The check uses `VOWEL` (`omr/underlay-units.ts:24`, `/[аеёиоуыэюяѣіѵ]/iu`), held equal to `CYRILLIC_VOWEL` (`score/vowel-resolver.ts:159`, the same letters) by `underlay-units.test.ts`. It adds none. The other copies of the question, with the letters each holds:

- With ѣ, і, ѵ, so equal to it: `VOWELS` (`omr/underlay-units.ts:25`), `HAS_VOWEL` (`score/phrase-ends.ts:30`).
- Without ѣ, і, ѵ, so equal to it on every letter but those three: `CYRILLIC_VOWELS` (`clitic-merge.ts:13-16`, used by `hasVowel`); `CYRILLIC_VOWEL` (`typed-hyphens.ts:43`, with capitals spelled out); `CY_VOWELS` (`syllable-utils.ts:22`); `vowels` (`score/pairings.ts:871`); `CY_VOWELS_DRAG` (`components/Drawer/InspectorPanel.svelte:534`) and `vowels` (`:921`); `vowels` (`components/Paper/WordStack.svelte:67`).

That is ten places, as amendment 14 says. I did not check that each of the without-letters copies is used as the vowel test at its site (I read the definitions, not their uses). No copy lists «й».

## NOT ESTABLISHED

Whether any of the listed copies is used where a ѣ, і, or ѵ would change a result in a real song.

## Files

`omr/vowels-per-note.ts` (new), `omr/vowels-per-note.test.ts` (new), `docs/sessions/report-code-n135-stage2b-r5-step5_r1_2026-10-29.md` (three citations), this report.
