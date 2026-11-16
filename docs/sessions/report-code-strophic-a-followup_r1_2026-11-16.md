# Report: strophic lane A, the desk's follow-up of 2026-11-16

Branch `cloud-lane-56`. `Shane` was merged first at `b32b6989`: clean, no conflict. Five fixes, each its own commit, each with its test written first. Nothing under `docs/memory/` changed and no brief was edited. I wrote no English or French: the only words on screen in the pictures are the lane's existing strings and the app's own.

| Fix | Commit |
| --- | --- |
| 1. The tacet sliver everywhere | `59d994d4` |
| 2. The Loupe counts every system | `aeb21163` |
| 3. The time-signature control binds the source bar | `c15bed4c` |
| 4. The second ending is live; a later-pass tap picks its source bar | `405e71c2` |
| 5. `open-extract.test.ts` gets 20 s | the last commit before this report |

## Fix 1: the tacet sliver everywhere

**Test first** (`packages/score-parser/src/tacet-adjacent-runs.test.ts`): for each of the eight tracked measure fixtures, a tacet column that follows another must advance by at least one tacet bar's width. All eight failed. I removed the `options.breakRunsAt ?` guard at `staff-renderer.ts:1631`; all eight pass. `staff-renderer.ts` stays at 3414 of 3414.

**The eight re-baselined** (only these eight hashes changed in `strophic-byte-baseline.json`; the other 199 hold). Page and system counts, at the baseline geometry (624 by 727 px), before and after:

| Fixture (under `docs/sessions/`) | Bars | Pages before | Pages after | Systems before | Systems after |
| --- | --- | --- | --- | --- | --- |
| `measure-final-test-set3_2026-10-11/ten/drops/S.musicxml` | 86 | 3 | 3 | 16 | 16 |
| `measure-m-p-r74_2026-10-11/step1/drops/L.musicxml` | 76 | 2 | 2 | 7 | 7 |
| `measure-m-p-r74_2026-10-11/step2/drops/I.musicxml` | 31 | 2 | 2 | 9 | 9 |
| `measure-m-p-r74_2026-10-11/step3on/drops/L.musicxml` | 76 | 2 | 2 | 7 | 7 |
| `measure-set3-four-below_2026-10-11/after/drops/L.musicxml` | 76 | 2 | 2 | 7 | 7 |
| `measure-set3-four-below_2026-10-11/after/drops/S.musicxml` | 86 | 3 | 3 | 15 | 15 |
| `measure-set3-four-below_2026-10-11/before/drops/S.musicxml` | 86 | 3 | 3 | 16 | 16 |
| `measure-set3-four-below_2026-10-11/superseded/after-first-ilya7/drops/S.musicxml` | 86 | 3 | 3 | 15 | 15 |

No page or system count moved; what changed is the width inside the system that holds the sliver (the pictures below show it).

**Pictures** (`strophic-a-followup-shots_2026-11-16/`, looked at): `fix1-before-desktop-en-p1.png` and `fix1-after-desktop-en-p1.png`, the first fixture in MELODY. Before, the leading rest of the first system is a jammed sliver with the bar-count "5" and the bracketed "[6]" printed on top of each other. After, it is a full multibar rest marked 5, the key change follows, then the next rest marked 2. The after page also re-breaks the later systems (system 2 opens at bar 12 instead of 13), which is the freed width. `fix1-tacet-phone-en.png`, the tacet fixture at 390 px: two full rests and "Verse 2" over the second. Not opened: `fix1-before-desktop-en-p2.png` and `-p3`, `fix1-after-desktop-en-p2.png` and `-p3`. The "before" pictures were taken with the guard put back by hand for one run and then removed again (the diff shows only the one-line removal).

## Fix 2: the Loupe's system count

**Test first:** the Playwright check on the ending bar failed with `Expected pattern: /(system|système) 6 (of|sur) 6/`, received `m. 10 · system 4 of 4`. **The fix:** a new `page-systems.ts` (`pageSystemRanges`) turns every system on the page into a range, giving a later-pass-only system (`data-verse-system`) the range -1 to -1 that no measure falls in; `Loupe.svelte` calls it in place of its own loop. `loupe.ts` was at 990 lines, so the helper could not live there (the limit for an unlisted file is 1000) and I put it in its own file with its own four unit tests (`page-systems.test.ts`). `Loupe.svelte` is 3008 lines (ceiling lowered from 3012 to 3008). **Result:** "m. 10 · system 6 of 6", « mes. 10 · système 6 sur 6 ».

**Pictures, looked at:** `fix2-loupe-desktop-fr.png` (« système 6 sur 6 », the ending's last bar held, the page's last system ringed) and `fix2-loupe-phone-en.png` ("system 6 of 6"). Not opened: `fix2-loupe-desktop-en.png`, `fix2-loupe-phone-fr.png` (the same tag in the other language, printed by the script as "m. 10 · system 6 of 6" and « mes. 10 · système 6 sur 6 »).

## Fix 3: the time-signature control

**What it did.** `TimeSignatureControls.svelte` bound each drawn meter to the nearest live `[data-hit]` to its right. At a later-pass bar that note is a `[data-verse-hit]`, which it did not see, so the control bound a wrong note further along, or none. **Fixture:** `strophic-repeat-meter.musicxml` (fixture 1 with 2/2 from bar 7, so a meter is drawn in each pass and again where each later pass returns to 4/4; added to the lane's list in the byte baseline test). **Test first** (Playwright): for each meter whose nearest note to the right is a later-pass copy, a control must be bound to that note's source id. It failed with `a control for the meter before m3-1-4~v2: Expected value "m3-1-4", Received array ["m1-0-1", "m6-1-4"]`. **The fix:** the control reads `[data-hit], [data-verse-hit]` and names the source id. After it, the page carries six controls, `m1-0-1 m6-1-4 m3-1-4 m6-1-4 m3-1-4 m6-1-4`, which are the source bars 1, 6, 3, 6, 3, 6, with no `~v` id among them.

**Pictures, looked at:** `fix3-card-desktop-fr.png` (the card « Chiffrage de mesure » open on the control that sits where pass 2 returns to 4/4: the 4/4 chip lit, 4 beats of 4) and `fix3-card-phone-en.png` ("Time signature" as a sheet, 4/4 lit). A picture cannot show which bar a control is bound to; the Playwright test is the evidence for that. Not opened: `fix3-card-desktop-en.png`, `fix3-card-phone-fr.png`.

**Same pattern, not changed:** `ClefControls.svelte:66` reads only `[data-hit]` the same way. It was not on your list and I left it; the same one-line change would apply. I have not looked for a failing case there.

## Fix 4: the second ending, and a tap on a later-pass copy

**Test first** (`e2e/strophic-melody-taps.test.ts`, on `strophic-volta.musicxml`): the second ending (source bar 4, printed only in pass 2) must have live `data-hit` handles, a tap on it must open the Loupe on printed bar 5, and a tap on a later-pass copy of bar 1 must open bar 1, not nothing. It failed with `the second ending has a live copy: Expected: 1, Received: 0`.

**The fix, three parts.** (a) `render-score.ts`: a later-pass bar whose source bar is printed nowhere else is `live` (`RenderBar.live`, `RenderScore.liveIds`). (b) `render-seam.ts`: for the events of a live bar the four lookup handles keep their names and lose the `~v` suffix, so they are the same live handles verse 1 has; a system's `data-system` range counts a live bar as its own, so the Loupe finds the held bar by its source index. (c) The taps: `MarkupPane.svelte`'s click handler and `+page.svelte`'s tap-band handler now read `[data-hit], [data-verse-hit]` and name the source note, so a tap on a later-pass copy picks its source bar (the Loupe then opens on the source bar, anchored on its live copy). Unit tests in `render-seam-review.test.ts` pin (a) and (b).

**Two things I found on the way.** My first (b) had a one-word bug (`renameLaterPassAttributes` returned the original tag when only live attributes changed), found by the Playwright test, fixed. And the first tap check opened bar 5 for a tap on bar 2's later copy until `+page.svelte`'s tap-band handler was fixed: that handler, not `MarkupPane`'s, opens the Loupe. The dev server also cached the workspace package between runs, so I restarted it after each package edit.

**Pictures, looked at:** `fix4-ending2-desktop-en.png` (the Loupe on the second ending's first note, "m. 5 · system 2 of 3", «Вот и ко-нец» under it, the ending ringed on the page) and `fix4-latercopy-phone-fr.png` (a tap on bar 2's later copy; « mes. 2 · système 1 sur 3 »). Not opened: `fix4-ending2-desktop-fr.png`, `fix4-ending2-phone-en.png`, `fix4-ending2-phone-fr.png`, `fix4-latercopy-desktop-en.png`.

**Not established.** That a correction made on a live second-ending bar then reads correctly on the page (the bar's words are verse 1's one-line words, drawn under verse 2's derived ids; I opened the Loupe but made no correction). That Playwright's `crossing-ring` and the Loupe's own page lookups (`hitsFor`, `nearestTarget`) behave on a later-pass tap beyond the cases above: they key on source ids, which these taps now give them, but I ran no test of each. That a tap on a later-pass copy whose source bar is on another page scrolls well.

## Fix 5: `open-extract.test.ts`

Two cases (ten captures and nine captures in one test each) took 4.5 to 6.1 s here and failed on the 5 s default under load. They now carry a 20 s limit through one constant, `SLOW_CASE_MS`, with a comment saying why. The file passes (9 of 9; the slowest case measured 4.5 s on this run).

## Gates and suites (once, at the end)

| Gate | Baseline | Measured |
| --- | --- | --- |
| phonology | 462 | 462 passed (462) |
| dictionary | 248 | 248 passed (248) |
| svelte-check | 0 errors, 12 warnings, 5 files | found 0 errors and 12 warnings in 5 files |
| web unit | 6352 passed, 1 skipped (6353) | 6357 passed, 1 skipped (6358) |
| score-parser | 894 passed, 5 skipped (899) | 903 passed, 5 skipped (908) |
| blurb | 178 | 178 passed (178) |
| root integration | 159 | 159 passed (159) |
| ratchets | OK | OK (`Loupe.svelte` 3008 of 3008, `staff-renderer.ts` 3414 of 3414) |

Playwright, the strophic suites: desktop 6 passed (the three strophic tests, fix 3, fix 4's taps, and `key-change-melody`), phone 2 passed (strophic and `key-change-melody`). I also ran `time-signature-card`, which my `TimeSignatureControls` change touches: desktop 7 passed, phone 1 passed. I did not run the whole Playwright suite.

## What I could not establish

- Whether the live second ending behaves under correction (above).
- `ClefControls` in a mixed system (above).
- The Loupe frame's growth from renamed hit rectangles, and the printed order of a long unfolded song, are unchanged from the Step 5 report.
