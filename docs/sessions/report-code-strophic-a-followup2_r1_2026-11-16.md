# Report: strophic lane A, the desk's follow-up 2 of 2026-11-16

Branch `cloud-lane-56`. `origin/Shane` was fetched and merged first (`b7f64990`): clean. Nothing under `docs/memory/` changed against `origin/Shane` and no brief was edited. I wrote no English or French. Each fix is its own commit, its test written first and run on the old code.

| Fix | Commit | Test, on the old code |
| --- | --- | --- |
| 1. Only the first later-pass-only copy is live | `c05aeebc` | `render-seam-review.test.ts`, "2, 3" ending: failed, `expected [false, false, false, false, ...] to deeply equal [...]` (both copies of the ending were live) |
| 2. A tap on a later-pass grace note | `6885b481` | Playwright `strophic-melody-taps`: failed, `locator.waitFor: Timeout 10000ms exceeded` (no Loupe opened) |
| 3. A live second ending draws from verse 1's channels | `b0e6b3b0` | Playwright: failed, `the corrected note no longer draws its old word, Expected: 0, Received: 1` |
| 4. The clef's tap box | `0b73002e` | phone Playwright: failed, `the box ends before the first note at 76.49..., Expected: <= 76.53, Received: 86.49` |
| 5. The ranges pinned | `c8af9508` | see below |

## Fix 1: one live copy

**Fixture:** `strophic-volta-23.musicxml` (the volta fixture with a third verse on bars 1 to 3, the second ending numbered "2,3", and a backward repeat closing it, so that ending is sung on passes 2 and 3 and nothing is printed after it until the last bar). My first version had no repeat on the ending and unfolded to two passes; that was my fixture, not the code, and I fixed the fixture. **The fix** (`render-score.ts`): a later-pass bar with no pass-1 copy is live only the first time its source bar is printed. **Result:** bars `[0,1,2,3, 0,1,2,4, 0,1,2,4, 5]`, live flags true only at the first ending, one `data-hit` per ending note, and the pass-3 copy inert (`data-verse-hit="…~v3"`).

## Fix 2: the grace note

**Fixture:** `strophic-repeat-grace.musicxml` (fixture 1 with a grace note before the first note of bar 5). The tap's id on a later-pass grace note is `m4-0-1~v2~g1`, and the three strips ended with `$`, so they left it unchanged. They now strip `~v<k>` anywhere, as `render-seam.ts` does (`MarkupPane.svelte`, `+page.svelte`, `TimeSignatureControls.svelte`). **One slip of mine:** my first fixture's head comment contained `<id>`, which the app's format check read as the root element ("This XML file is not MusicXML. The root element is id."); I reworded the comment.

## Fix 3: a correction reaches the page

`render-score.ts` now reports `liveVerse1Ids`: the derived ids of live bars whose words are verse 1's own one-line words. `melody-pages.ts` draws those from verse 1's channels under the bare ids (`ipaPreview`, `cyrPreview`, `sylTypePreview`, `melismaPreview`, and the withheld set), dropping the later verse's own values for them. **Test:** in the live app, hold the second ending's first note, open SYLLABLES, place the score's own «Всё» on it, close; the page no longer draws «Вот» there and draws one more «Всё». A unit test in `melody-pages.test.ts` does the same through the channels (a spelling and an IPA given for the bare id show under the ending, no other bar changes). **Picture** `fix3-corrected-desktop-en.png` (looked at): «Всё и ко-нец» under the second ending, with its IPA following the correction (fs ʲo).

## Fix 4: the clef box

`ClefControls.svelte:66` reads `[data-hit], [data-verse-hit]`. The test (phone) checks that every clef's tap box, after its clip, ends before the first note's hit area, and that the fixture has a system of later-pass bars only. **Picture** `fix4-clef-boxes-phone-en.png` (looked at): the clef boxes outlined in red and the hit rectangles in blue; in the systems that open on later-pass bars the red box ends before the first blue rectangle.

## Fix 5: the ranges pinned

`render-seam-review.test.ts` now states the volta fixture's five systems and the "2, 3" fixture's seven in full (for example `[6, 7, 'data-system="4-4"']`), and `melody-pages.test.ts` states fixture 1's six systems (`'data-system="0-3"', 'data-system="4-7"', 'data-system="8-8"', 'data-verse-system="12-14"', 'data-verse-system="15-18"', 'data-system="9-10"'`) with the arithmetic that gives them in a comment. I checked each literal against the printed bars by hand before writing it. **What a test-first run could show:** the old assertions were weaker, not wrong, so they pass on the old code; there is no failing run of the old text. What I ran instead is a mutation: with the seam changed so a live bar is not counted as its system's own, the new `render-seam-review` tests fail (2 failures); restored, they pass. I did not run a second mutation (a wrong `Math.max`) to show that the old prefix-only check missed it; that is argued from the old text, not run.

## Gates and suites

| Gate | Baseline | Measured |
| --- | --- | --- |
| phonology | 462 | 462 passed (462) |
| dictionary | 248 | 248 passed (248) |
| svelte-check | 0 errors, 12 warnings, 5 files | found 0 errors and 12 warnings in 5 files |
| web unit | 6357 passed, 1 skipped (6358) | 6360 passed, 1 skipped (6361) |
| score-parser | 903 passed, 5 skipped (908) | 904 passed, 5 skipped (909) |
| blurb | 178 | 178 passed (178) |
| root integration | 159 | 159 passed (159) |
| ratchets | OK | OK |

Playwright, with the strophic suites and the specs these fixes touch (`strophic-melody`, `strophic-melody-taps`, `key-change-melody`, `clef-controls`, `time-signature-card`): phone 6 passed. Desktop: 16 passed and 1 failed on the first run, then 17 of 17 on each of two further runs. **The one failure** was `strophic-melody` "the Loupe on a bar after the passage". I did not capture its error text, and it passed alone and in both reruns, so I cannot say what it was. NOT ESTABLISHED. (It is the test that opens the Loupe, and the Loupe tests in this suite have been timing-sensitive on this machine before.)

## Pictures taken and looked at (`strophic-a-followup2-shots_2026-11-16/`)

`fix1-volta23-desktop-en.png` (the "2, 3" ending drawn after verse 2 and again after verse 3, the bar after it once), `fix2-grace-tap-phone-fr.png` (a tap on the later-pass grace note: « mes. 5 · système 2 sur 6 », the grace note's own line B3 « Croche » held), `fix3-corrected-desktop-en.png`, `fix4-clef-boxes-phone-en.png`. Not opened: `fix1-volta23-phone-fr.png`, `fix2-grace-tap-desktop-en.png`, `fix3-corrected-phone-fr.png`.

## What I could not establish

- The one desktop Playwright failure above.
- Fix 3 for a bar that is verse 1's one-line words AND carries a hand pairing made on another pass's copy: I placed a syllable on the live ending only. Fix 3 also changes the live bar's analysis not at all (its marks still come from the later verse's derived id, since the analysis for verse 1 does not cover it): a bar whose verse-1 vowel differs from the vowel drawn under it would show marks for the vowel of the later verse's view. For a one-line bar the two are the same words, so I expect no difference, but I did not compare them.
- Fix 4's box on desktop widths (the test and the picture are phone; the clip applies there).
