# Report: strophic lane A, Step 4a (MELODY draws the passes: D5, D6, and the wiring)

Brief r5, Step 4a. Branch `cloud-lane-56`. Earlier: Steps 0 to 3 (`report-code-strophic-a-step0_` to `-step3_`). **Step 3 and the 4a extraction share one commit** (`d4a65439`); the brief asked for the extraction first, and the render score (Step 3) it feeds was already written, so I committed them together and say so.

## What changed

1. **The extraction (first commit, no change in output).** `paginateScore`'s call and its options moved out of `MarkupPane.svelte` into the new `apps/web/src/lib/markup/melody-pages.ts` (`paginateMelody`). `strophic-byte-baseline.test.ts` now takes its pages **through `paginateMelody`**, and all 207 baseline hashes hold. `MarkupPane.svelte` went from 1362 to 1352 lines.
2. **The wiring (second commit).** `MarkupPane.svelte` passes `verses: { profile, notationPrefs, openSyllabification }`, and the legend reads `paginated.analyzed` and `paginated.withheld`, which hold every verse. It is 1353 lines (ceiling lowered from 1364 to 1353 in `scripts/ratchets.json`; room had been 2). `paginateMelody` builds, for each later place: `verseView`, `buildUnderlayResolvers(view, 1)`, `analyzeScore` over `scoreInPerformanceOrder(view).score`, `resolveAdvice`, the IPA through `applyNotationPreferences`, the Cyrillic and withheld sets, all re-keyed to derived ids, then paginates `renderScoreOf(score).score` with one merged `AnalyzedScore` and the merged channels. No pairings, no blanks, no transcribed lines for later verses.
3. **The seam (D6).** `render-seam.ts` (new): renames `data-hit`, `data-event-id`, `data-of-event`, and `data-ipa-of` to `data-verse-hit`, `data-verse-event-id`, `data-verse-of-event`, and `data-verse-ipa-of` on any element naming a derived id, adds `data-verse="k"` to it, and gives the system wrapper `data-system="a-b"` (source indices of its non-later bars) or `data-verse-system="a-b"` (printed indices, later bars only). `paginateScore` takes it as the optional `seam` and applies it after both `renderSystemSlice` calls and for the wrapper. Absent, output is byte-identical (the baseline test shows it).
4. **Guards (D6, in the three files it allows).** `loupe-ink.ts`: `musicInk`, `restOrNoteInk`, and `pageMetrics` skip `rect[data-verse-hit]` and `[data-verse-label]` as ink, and the system head takes the leftmost `[data-hit], [data-verse-hit]`. `loupe.ts`: `MUSIC_MARK` also accepts the `data-verse-` names (a one-line change; the file stays at 990 lines). `selection-ring.ts`: `ipaBaselineOf` skips `[data-verse-label]`. Nothing in `Loupe.svelte`.

## Tests added

- `melody-pages.test.ts` (web, 8): the drawn Cyrillic equals the render score's syllables in order; the first bar of each pass differs as the file has it; each later pass's analysis comes from its own vowel (verse 1 «ре», 2 «Лес», 3 «Дол», timbre and turning pitch equal to an independent analysis of that verse's view); no live `data-hit`, `data-event-id`, `data-of-event`, or `data-ipa-of` names a `~v` id, 48 `data-verse-hit` exist (12 later bars of 4 notes); later-only systems carry `data-verse-system` and a mixed system's `data-system` is in source indices; every notated bar sits in exactly one `data-system` range; only the last system draws the final barline (two strokes at the right edge, the others one); the re-rendered last system has no live hit for a later-pass event; a one-verse score is returned by reference with no `data-verse` anywhere.
- `e2e/strophic-melody.test.ts` and `e2e-phone/strophic-melody.test.ts` (Playwright, live app): each later pass starts mid-system at 1440 px and at 390 px (something stands to its left in its own system; pass 3 begins as the last bar of a system, which the 13:40 ruling allows); the page has no live handle for a later-pass event; a mixed system and a later-only system both occur; `pageMetrics`; the Loupe.

I lengthened fixture 1's introduction from two bars to three, as the brief's Step 1 said to do if the mid-system assertion needed it. At two bars, pass 2 began at a system start in the live layout. Tests and the generator were updated; the layout is the same at 1440 and 390 px (the page is one letter sheet scaled), so one fixture satisfies both.

## The checks the brief names

- **`pageMetrics`, three verses against a copy with lyric lines 2 and 3 removed, in Chromium on the live page:** `above` 9.5 and `below` 74 for both; `minTotalSpan` 137.53 for both. **No difference.** Limits: this sandbox has no calibrated voice profile, so no acoustic mark (stems, turning heads, crossings) is drawn in either; the measurement covers notation, Cyrillic, and IPA only. **I did not measure what the unguarded `pageMetrics` would give**, so I cannot say the guard changed the number. **NOT ESTABLISHED:** the same comparison with marks on.
- **The Loupe on a bar after the passage.** On printed bar 10 (the first of the ending), the Loupe's tag reads **"m. 10 · system 4 of 4"**, and the page has **six systems**: the ending's system is the sixth. The Loupe counts only `[data-system]` ranges (`Loupe.svelte:1055-1058`, `:1996`), and the two later-only systems carry `data-verse-system`, so they drop out of its count and the mixed system and the ending are numbered 3 and 4. **This is wrong by two on this page, and fixing it needs a change in `Loupe.svelte`, which this lane may not make.** It belongs to lane B, or Dann can rule otherwise. The Loupe finds the held bar correctly (it opened on the right bar).
- **How large is the effect of renamed hit rectangles on the Loupe's own frame (`Loupe.svelte:952`, an unguarded walk).** **NOT ESTABLISHED.** I did not open the Loupe on a bar in a mixed system and compare its frame to a pure system's.
- **`ClefControls` and `TimeSignatureControls` in a mixed system:** NOT ESTABLISHED (not exercised).

## Observations the brief does not state

- **Only handle-bearing elements carry `data-verse`.** The Cyrillic underlay `<text>` elements carry no id attribute at all, so the seam cannot attribute them to a pass; they are inert because no reader finds them by id. D6 says "every element drawn for a later-pass event carries `data-verse`"; as built, that holds for every element that names the event.
- **Page 2 of 2.** The live page shows "PAGE 1 OF 2"; the second sheet is the commentary page, not score.

## Gates (after Step 4a)

| Gate | Count |
| --- | --- |
| phonology | 462 passed (462) |
| dictionary | 248 passed (248) |
| svelte-check | found 0 errors and 12 warnings in 5 files (the first run found 5 errors, all one use of `paginated` before its declaration in `MarkupPane.svelte`; the legend lines now sit below it) |
| web unit | 6042 passed, 1 failed, 1 skipped (6044). The failure is `open-extract.test.ts` "gives the same reading whichever vowel is asked", a 5000 ms timeout that measured 5.0 to 6.1 s here; it passes alone and is not this lane's (see the Step 1 report). The full run preceded the legend move, which changes no test; `src/lib/markup` and `loupe.test.ts` were rerun after it and pass (563). |
| score-parser | 890 passed, 5 skipped (895) |
| blurb | 178 passed (178) |
| root integration | 159 passed (159) |
| ratchets | OK |

Also run, not among the eight: Playwright `strophic-melody` desktop (3 passed) and phone (1 passed), and `key-change-melody` desktop (1 passed). In this sandbox `voice/engine/analyze.test.ts` spends about 400 s in its import (synthetic audio built at collection), so a full web run takes about 10 minutes.

## Pictures (looked at)

`strophic-a-shots_2026-11-15/step4a-repeat-desktop-en.png` (1440 px) and `step4a-repeat-phone-en.png` (390 px), the repeat fixture in MELODY. Seen: one continuous line of music. Bars 1 to 3 are the introduction's rests; bar 4 opens with the first verse's words; the passage's six bars run through system 2 and into system 3, where pass 1's last bar «Спи мой милый» is followed on the same system by pass 2's first bars «День те-пел за»; pass 3 begins as the last bar of system 4 («Мгла низка на»). Each pass carries its own Cyrillic and IPA (verse 2 «Лес ___ ти-хо», verse 3 «Дол ___ ти-хо»), bars keep their printed numbers (the systems open on 5, 9, 7, 5, and 9), one slur per pass, the ending once, and the final barline only at the very end. **Not yet drawn, as the brief orders for 4b:** the "Verse 2" and "Verse 3" labels and the tag on the bar numbers (system 4 opens on a plain "7"). A first screenshot of mine cut the last system off because my viewport was too short; the page itself fits (every system inside its window: bottoms 729 of 749), and I retook the pictures at a tall viewport.

## What I could not establish

See the checks above, and: whether Finale, Sibelius, MuseScore, or Dorico files shape up like these fixtures; how the browser breaks a long unfolded song when printed (Step 5).
