# Report: strophic lane A, Step 5 (close) and the final report

Brief r5, Step 5. Branch `cloud-lane-56`, cut from `origin/Shane` at `fb9d829e`, and merged with `origin/Shane` at `2c07ab75` (documents, `NOTICES.md`, and `README.md` only; the merge was clean). No pull request. Nothing under `docs/memory/` changed and no brief was edited.

## The counts (after the merge)

| Gate | Count |
| --- | --- |
| phonology | 462 passed (462) |
| dictionary | 248 passed (248) |
| svelte-check | found 0 errors and 12 warnings in 5 files |
| web unit | 6048 passed, 2 failed, 1 skipped (6051) |
| score-parser | 890 passed, 5 skipped (895) |
| blurb | 178 passed (178) |
| root integration | 159 passed (159) |
| ratchets | OK |
| `pnpm build` | exit 0 |
| Playwright, `chromium` and `phone` together | PW_RESULT |

Against the baseline you gave, phonology, dictionary, blurb, root integration, `svelte-check`, and ratchets are unchanged. Web went from 5817 to 6051 and score-parser from 842 to 890; the additions are this lane's own tests (the 208-case byte baseline is most of the web rise, and the six fixtures also run through `fixture-rule.test.ts`).

**The two web failures are both in `voice/engine/open-extract.test.ts`**, and both are 5000 ms timeouts (5.0 and 5.1 s). The file is CPU-bound, I was taking screenshots while the run went, and rerun alone with the dev server up it still measured 5.7 s on one case. It passed on the first untouched run, in the Step 2 and 4b runs, and alone twice; it has failed or passed with and without this lane's files in the tree, so it is not this lane's. I did not touch it. It will pass or fail on CI by machine.

## What the lane does (the brief's own words, checked)

- MELODY prints a strophic song in the order it is sung, one continuous line: seen (pictures below).
- Bars outside the passage print once; the passage prints once per verse; each pass starts wherever the last ended (mid-system, or as a system's last bar).
- A refrain bar appears in every pass with its words (verse 1's), seen in the fixture's last two passage bars.
- "Verse 2" stands above the bar where it begins; every bar keeps its printed number, with the tag at later-pass system starts.
- The repeat that bounds the passage is not drawn (the renderer draws none today; the markers are gone from the render score). A repeat whose words do not vary stays notated and the score is returned by reference.
- A one-verse song is byte-identical: 207 hashes, through `paginateMelody`.
- Later verses are printed and inert.

## Interim limits, said once

- A later verse's IPA comes from the score's words through the fallback pipeline, with the singer's spelling settings and without Lyrics edits or hand pairings; a refrain's IPA in a later pass can differ from pass 1's where the singer edited verse 1.
- Lyrics shows verse 1 only; INSIGHTS, the watch list, and phonation totals read as today (lane C); MELODY can print three passes where INSIGHTS, the transposition ruler, and the tessitura band count two.
- Repeat signs, voltas, and jump marks that stay notated are not drawn (lane D).
- Stress acutes show in verse 1 only; later verses cannot be tapped (lane B).
- On the stacked path, a one-line stretch after the passage prints once, after the last verse (ruled 2026-11-15 02:44).

## Things for Dann (found in the build; not in the brief)

1. **The Loupe's system count is wrong by the number of later-only systems.** On the repeat fixture the Loupe says "system 4 of 4" on the ending; the page has six systems. Only `Loupe.svelte` can fix it, which this lane may not touch. (Step 4a report.)
2. **The label's band is mine.** It lifts each labelled system by 1.4 type sizes and, in the repeat fixture, pushes the song onto a second sheet (the page and the print are two sheets; the second also carries the commentary). A different band, or a label that shares the system's top margin, is a taste ruling.
3. **A new prefix in the i18n index.** `i18n-index.test.ts` requires a line per prefix, so I added `markup.  2  lib/markup/melody-pages.ts` and raised the stated total to 1,272. The line is a file path; I wrote no other words.
4. **Three verses and two endings print two passes.** `unfold` takes the pass count from the endings, not the verses, so verse 3 is not printed. I invented no rule for it.
5. **A seventh fixture.** Step 5 asked for a picture of a key change at a pass boundary and none of the six fixtures had one, so I added `strophic-repeat-key.musicxml` (the repeat fixture with F major from bar 7). It is in the byte baseline's list of the lane's fixtures.
6. **Fixture 1's introduction is three bars,** not two, so pass 2 starts mid-system in the live layout (Step 4a).

## Pictures (all in `docs/sessions/strophic-a-shots_2026-11-15/`; I looked at each one I list as seen)

Seen, with what I saw:
- `step4a-repeat-desktop-en.png`, `step4a-repeat-phone-en.png`: the continuous line before the label and tag (Step 4a report).
- `step4b-repeat-desktop-en-p1.png`, `step4b-repeat-phone-fr-p1.png`, `step4b-tacet-desktop-en.png`: labels over their bars; tags "7 · verse 2" and "5 · verse 3" (« 7 · couplet 2 », « 5 · couplet 3 ») flush left inside the page edge; the tacet fixture's two rests kept apart with a barline between.
- `step5-volta-desktop-en.png`, `step5-volta-phone-fr.png`: ending 1 in pass 1 («Всё тих но ей»), ending 2 in pass 2 («Вот и ко-нец», one line, verse 1's words), the bar after the second ending once at the end; "Verse 2" / « Couplet 2 » over the first bar of the second pass, which opens its system, so no tag there and the plain "1".
- `step5-key-boundary-desktop-en-p1.png`: the key-change picture the brief asked for. The flat appears at bar 7 in pass 1; the system closes with a courtesy flat; pass 2 begins with a natural cancelling it, under "Verse 2"; pass 3 does the same under "Verse 3"; the next system opens in C with no flat in its head. **The key-change drawing reads per-bar snapshots at the pass seam and draws correctly.**
- `step5-repeat-print-letter.pdf` and its pages `step5-repeat-print-1.png`, `-2.png`: Chromium's print at letter, `preferCSSPageSize`, two pages (`MediaBox 612 x 792`), the count Ilya numbers. Page 1 holds the introduction, the passes with their labels and tags, and the footer; page 2 opens on "9 · verse 3" (pass 3's last bar and the ending, with the final barline), then the commentary box.

Taken, not opened by me: `step5-volta-desktop-fr.png`, `step5-volta-phone-en.png`, `step5-volta-from-top-desktop-en.png`, `step4b-repeat-*-p2.png` and the remaining English and French combinations of the 4b set. They run the same code with the other fixture or language.

## What I could not establish

- Whether the browser breaks a long unfolded song across printed sheets as the screen does for a song longer than two sheets (the PDF here is two sheets; no longer song was printed).
- Acoustic marks (stems, turning heads, crossings) on the passes: this sandbox has no calibrated profile, so every picture and the `pageMetrics` measurement are notation, Cyrillic, and IPA only.
- The Loupe frame's growth from renamed hit rectangles (`Loupe.svelte:952`), `ClefControls` and `TimeSignatureControls` in a mixed system, and a jump (da capo) with two verses.
- Whether homr's output carries `<repeat>`, and whether any real strophic score reaches Ilya with marks, stacked, or both.
- How the French tags fit against the English by measurement (all four are anchored at x = 0 by the estimate).
- Fable's own warning stands: the desk's review ran no code; the failure modes it named are now observed or not as listed above.
- Sizing: this ran as one long session rather than three or four.
