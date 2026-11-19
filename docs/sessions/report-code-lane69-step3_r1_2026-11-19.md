# Report, lane 69, Step 3: the page seen, `vercel.json`, the end gates

## 1. The test that would have caught this

New: `apps/web/e2e/melody-no-score-count.test.ts` (desktop, 1440 wide, soprano, no score, MELODY tab, every reading `confidence: 'high'`). Two cases, both pass:

- one core vowel ([i]): the first `.profile-status` reads "You have sampled 1 of the 6 core vowels so far ([i]). To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 4 more, unsampled vowels are assigned placeholder values."
- five stable core vowels ([i], [e], [ɛ], [ɑ], [o]): "Your profile is now set with five vowels measured."

Positive control: I put the pre-lane `MarkupPane.svelte` and `profile-status.ts` (from `4b594b9`) back and ran it. Both cases failed. The page read "Your profile is now set with ten vowels measured." in each. I then restored the lane's files; `git status` showed them unmodified.

## 2. Pictures (`docs/sessions/pictures-lane69/`, eight files)

Soprano, voice seeded in `localStorage`, no score, MELODY tab. Desktop 1440 by 900 and phone 390 by 844, both at 2x. English and French. I looked at each of the eight. The lines read, in order (lede, status line, DRAWER line):

- `1core` (only [i] sampled), all four: the lede; "You have sampled 1 of the 6 core vowels so far ([i]). To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 4 more, unsampled vowels are assigned placeholder values." (French: "Vous avez échantillonné 1 des 6 voyelles de base jusqu’ici ([i]). ... D’ici à ce que vous en fournissiez 4 de plus, ..."); the DRAWER line.
- `5core`, all four: the lede; "Your profile is now set with five vowels measured." (French: "Votre profil est maintenant établi, avec cinq voyelles mesurées."); the DRAWER line.

**Does the below-five sentence sit whole on the phone?** Yes. It is three lines in English and four in French, inside the sheet, with nothing clipped or overlapping. The page is a scaled letter sheet on a phone, so the text is small, but it is complete. I measured nothing in pixels; this is from looking.

## 3. `vercel.json`

Names `cloud-lane-69` alone, at `:3` and `:47`.

## 4. End gates (Linux sandbox, no Python scientific stack)

| Gate | Measured | Baseline (Mac) |
|---|---|---|
| phonology | 462 passed (462) | 462 |
| dictionary | 248 passed (248) | 248 |
| web-check | 0 errors, 12 warnings, 5 files | 0 errors, 12 warnings, 5 files |
| web-test | 6687 passed, 5 skipped (6692) | 6682 passed, 5 skipped (6687) without Python |
| score-parser | 904 passed, 5 skipped (909) | same |
| blurb | 178 passed (178) | same |
| integration | 159 passed (159) | same |
| ratchets | OK | OK |

Gate 4 moved by +5 passed: `profile-status.test.ts` went from 4 to 9 tests (the new behaviour, the singular pin, the zero case kept, and the wiring guard). That is the only change in any count. The skipped count is unchanged.

## 5. Playwright

Desktop (`--project=chromium`, `voice-pane`, `voice-links`, `insights-links`, `calibrate-new`, `melody-no-score-count`, run together): 83 passed (16.3 minutes, `calibrate-new` alone 11.2).
Phone (`--project=phone`), each file three times:

| File | Run 1 | Run 2 | Run 3 |
|---|---|---|---|
| `voice-stations` | 6 passed | 6 passed | 6 passed |
| `insights-links` | 5 passed | 5 passed | 5 passed |

No expectation was changed. No test was edited for a flake. `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium`, `--trace off`.

## 6. The phone flake

At `737228cb` the two files flaked 2 of 3 runs, and 3 of 3 after lane 68, by lane 68's own runs. Here neither flaked in three runs each. Cause: NOT ESTABLISHED. This sandbox differs from the Mac (Linux, Chromium from `/opt/pw-browsers`), so three clean runs here do not say the Mac's flake is gone.

## 7. Things I did not do or could not establish

- Dann's own words for the section B.2 ruling: NOT ESTABLISHED (unchanged; the comment cites `cfcd0ba6` and the paraphrase only).
- Whether "measured" was ever ratified: NOT ESTABLISHED. The "DRAFT copy, flagged for Dann (§B.2)" marker stays.
- Whether the app can store a key outside the ten vowels: NOT ESTABLISHED (Step 0 report, section 4).
- No string added to or changed in `i18n.ts`; Step 2 moved one comment only. No English or French written for a singer to read.
- Nothing under `docs/memory/` and no brief touched. No pull request.
