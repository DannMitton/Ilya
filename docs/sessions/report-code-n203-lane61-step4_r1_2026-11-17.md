# Report: N.203 lane 61, Step 4 (links L4 and L6) and the lane's close

Branch `cloud-lane-61`. Pictures: `docs/sessions/report-code-n203-lane61-pictures/step4-*.png` (phone and desk, English and French: L1 and L4 on a full INSIGHTS page, L4's landing, the no-score page, L6's landing, and the printed INSIGHTS page `step4-desk-en-printed-insights-2.png`). I looked at the desk French notes, the phone French notes, the phone no-score page, the phone L6 landing, and the printed page. The other sizes and languages are the same layouts.

## What changed

- **L4.** `identity.ts`: `isGenericMethodKey(key)`, true for the three generic keys. `InsightsPane.svelte` keeps the key (`methodKey`) and derives `methodGeneric` from it (not from `adapted.generic` alone, so the `noScore.samples` line, which can have `generic` true, correctly draws no link); it passes `methodGeneric` to the block. `SingerBlock.svelte` draws the link beside L1 in `.notes-links` when the key is generic. Its words are the pane's own door for the voice's state (`recordDoorKey(usableReadingCount(...))`, passed by the page as `links.recordKey`). It calls `openVoice('record')`; over the capture screen the existing rule refuses it. Hidden in print with L1. `TitleHeader.svelte` is not touched.
- **L6.** In the notes-free silence block, the sentence `insights.silence.noScore` is drawn as three parts (before, a button with `group.input`, after), split on `t('group.input', language)` in `SingerBlock.svelte`, for that one line only. The key stays one string, character for character; `richParts` is not edited. The page's `openInput` goes through `leaveThen` (the Step 2 path): dropped over the capture screen, otherwise it leaves the takeover, raises the Drawer on a phone, reveals INPUT, and scrolls to `[data-band-head="input"]` by the link rule. In print the button loses its underline and colour (the existing `.offer-link` print rule), so the sentence prints as it did.
- `links.ts`: `InsightsLinks` gains `record`, `recordKey`, `input`.
- `InsightsPane.svelte` is 742 of 744 lines. The `methodLine` rewrite saved the lines the new code needed.
- `routes/+page.svelte` is 5,530 of 5,534. `scripts/ratchets.json`: the wizard's ceiling is lowered from 1,727 to 1,126, its count. No ceiling was raised.

## A finding that bears on L4's words

`adapted.generic` is `!anySung && hasPlaceholderProfile(voiceType)` (`resolve-values.ts:210`). A placeholder Method line therefore means no vowel is recorded, so in practice L4's words are always "Record your vowels" / « Capter vos voyelles »; "Carry on recording" and "Record a vowel again" can never be drawn there. The brief's worry (the page and the pane naming one door differently) does not arise. With any vowel recorded, the Method line rests on the samples and no L4 is drawn. The three-way key is kept, since it costs nothing and follows the pane if the rule ever changes.

## Tests

- `links.test.ts`: `isGenericMethodKey` against `methodLineKey` in all 16 combinations; L4 drawn beside L1 with each door key in both languages, absent when not generic, drawn alone when L1 is absent; L6 reads as the one string in both languages with the markup removed, only INPUT / ENTRÉE is a button, no button without the callback, other silence lines untouched.
- `e2e/insights-links.test.ts` (desk, 14): L1 (5), L4 (3: lands on Welcome, French words, absent with a recorded vowel), L6 (5: opens INPUT in view; French ENTRÉE; with the takeover up on the summary it leaves and opens INPUT; over the capture screen it is dropped and never answered later; prints as the plain sentence).
- `e2e-phone/insights-links.test.ts` (7): L1, L6 and L4 with the Drawer lowered and, for L1 and L6, open.
- **Two earlier tests broke and were test-side:** `voice-links` (desk) and `voice-stations` (phone) pressed `getByRole('button', {name: 'Record your vowels'})`, which now also matches L4 on the INSIGHTS page. They are scoped to `aside.drawer`.

## Gates, at the end of the lane

phonology 462 passed (462); dictionary 248 (248); svelte-check 0 errors, 12 warnings, 5 files; web 6513 passed, 1 skipped (6514); score-parser 904 passed, 5 skipped (909); blurb 178 (178); root 159 (159); ratchets OK.

Playwright, the final run on the code of commit `c1da420`: desktop (chromium) `calibrate-new`, `singer-paths`, `print-pages`, `pages-without-gaps`, `insights-no-score`, `insights-page`, `insights-key-lines`, `voice-pane`, `voice-stations`, `voice-links`, `insights-links`, `word-tap-opens-analysis`: 147 passed, 2 failed. Both failures were the strict-mode locator clash above; after the test fix `voice-links` is 6 of 6 and the phone `voice-stations` 4 of 4. Phone `voice-stations`, `insights-links`, `word-tap`: 9 passed, 1 failed (the same clash), fixed as above. I re-ran only the fixed files after the fix, not the whole 150.

## What I could not establish

- The whole Playwright set after the last test fix, in one run. The fix touched only test locators.
- Page fill on pieces other than Sunless and Tchaikovsky op. 38 no. 3.
- Whether `Drawer.svelte` still has headroom for a later scroll case: 1,986 of 1,990.

## The lane's list for the GUIDE and the keys

**GUIDE lines left untrue, for the GUIDE's rewrite** (not edited, not mine):
- `lib/components/Reading/GuideContent.svelte:389` (English): "entered from the profile summary in the drawer".
- `lib/components/Reading/GuideContent.svelte:85` (French): « saisies depuis le sommaire du profil dans le Tiroir ».

**Keys marked UNUSED, none deleted:**
- Marked by this lane (Step 2): `calib.characteristics.title`, `calib.characteristics.doneButton` ("UNUSED SINCE N.203 lane 61 Step 2").
- Already marked by lane 60: `calib.characteristics.editButton`, `calib.characteristics.addButton`, `calib.summary.savedLede`.
- `calib.characteristics.lede` stays in use (the Describe station's lede, a DESK DEFAULT; it still contains "simply" / « simplement », for Dann to keep, reword, or strike).

**Other things for Dann's eye, lane-wide:**
- `IntakeScale.svelte` is a third component the brief did not list (Step 1 report). One line of `i18n.ts` (the index at its head) changed to name the new files, because `i18n-index.test.ts` fails on a missing path; no string changed.
- `VoiceTypeIntake.svelte:147` still refers to a `.charx-heading` class that no longer exists.
- The Describe station is about 2,550 px tall on a 390 px phone in English (2,780 in French).
- No new English or French was written; no key was added.
