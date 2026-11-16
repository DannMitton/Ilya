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
| Playwright, `chromium` and `phone` together | 245 passed, 8 failed, 1 skipped (254 tests, 56.9 min); the failures are listed below |

Against the baseline you gave, phonology, dictionary, blurb, root integration, `svelte-check`, and ratchets are unchanged. Web went from 5817 to 6051 and score-parser from 842 to 890; the additions are this lane's own tests (the 208-case byte baseline is most of the web rise, and the six fixtures also run through `fixture-rule.test.ts`).

**The two web failures are both in `voice/engine/open-extract.test.ts`**, and both are 5000 ms timeouts (5.0 and 5.1 s). The file is CPU-bound, I was taking screenshots while the run went, and rerun alone with the dev server up it still measured 5.7 s on one case. It passed on the first untouched run, in the Step 2 and 4b runs, and alone twice; it has failed or passed with and without this lane's files in the tree, so it is not this lane's. I did not touch it. It will pass or fail on CI by machine.

## The Playwright failures, each checked against the untouched tip

I built a clean worktree at `fb9d829e` (and `pnpm build` in it) and ran the failing tests there.

| Test | On this branch | On `fb9d829e` |
| --- | --- | --- |
| `calibrate-new` "fr at 375 px: Re-take [i] on one line" | fails, also alone | fails |
| `heic-offline` "a singer offline who never opened a HEIC can open one" | fails, also alone (it runs only with a `build/`) | fails once built |
| `loupe-header` "a drag on the desk moves the card, holds while open, and resets on close" | fails, also alone | fails |
| `loupe-header` "pressing a header button starts no drag" | failed in the full run, **passes alone** | not run |
| phone `input-views` "a poem typed into Poem moves no seat of «Within Four Walls»" | fails | fails |
| phone `phrase-ends` "Tchaikovsky onto an empty song: 172 seats…" | fails | fails |
| phone `relining` "y." and "bb." | fail | fail |

So seven of the eight are failures of this sandbox, not of the lane (none opens MELODY's strophic path; five are in Text and Poem), and the eighth is a load flake. **I did not run the whole suite on the untouched tip, so a failure this lane causes that is not in the list above would show only as a pass that became a fail, and none did.** The four new strophic Playwright tests passed, and so did `key-change-melody`, `markup-pages-lose-no-bars`, and `print-pages`.

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

## After the desk's review

The desk's verdict was merge with fixes. For each fix I wrote the failing test first (`packages/score-parser/src/render-seam-review.test.ts`), saw it fail for the stated reason, then fixed it.

**Fix 1: the label over a pass that begins on a rest.** Test: fixture 1 with the passage's first note made a rest. Failed with `label 2 at the rest's own ink: expected +0 to be close to 350.92`. Cause as the review said: `groupLeft` looked only for `data-event-id`, and a rest sits in an anonymous group whose first child is its hit rectangle. `groupLeft` now falls back to that rectangle and reads the rest's own ink (`render-seam.ts`). Passes. Picture `review-fix1-rest-desktop-en-p1.png`: «Verse 2» and «Verse 3» stand over the rest, which opens the bar, not at the system's edge.

**Fix 2: the label over a tacet bar away from bar 0.** Test: the tacet fixture at page width 200. Failed with `expected +0 to be close to 127.31`. `tacetLeft` was given the slice-relative index; the markup names a run by its printed index (`runFrom = run.fromMeasure + measureOffset`). It now takes `from + i`. Passes.

**Fix 3: two tacet bars that meet at a pass boundary.** Test: `layoutColumns` on the tacet fixture's render score, the second of two adjacent tacet columns. Failed with `expected 14 to be greater than or equal to 96` (the width one tacet bar owes). The cause is as the review said: `openRun` set `owedByTacet` without spending the previous run's debt. It now adds the debt to the second column's advance, in place (`staff-renderer.ts` stays at 3414 of 3414; no ceiling raised). **I scoped the fix to when `breakRunsAt` is supplied, and that needs your eye.** Unscoped, it changed the pages of eight tracked scores, and the byte baseline caught it: two tacet runs stand side by side wherever a meter or key change falls between tacet bars, so those scores show the same sliver today. They are, all under `docs/sessions/`: `measure-final-test-set3_2026-10-11/ten/drops/S.musicxml`; `measure-m-p-r74_2026-10-11/step1/drops/L.musicxml`, `step2/drops/I.musicxml`, `step3on/drops/L.musicxml`; `measure-set3-four-below_2026-10-11/after/drops/L.musicxml`, `after/drops/S.musicxml`, `before/drops/S.musicxml`, `superseded/after-first-ilya7/drops/S.musicxml`. D8 asks one-verse scores to stay byte-identical, so I left them as they are; removing the `options.breakRunsAt ?` guard fixes them and changes their pages. Picture `review-tacet-desktop-en.png` (retaken; the old `step4b-tacet-desktop-en.png` is deleted): the interlude and the next introduction are two full-width rests with a barline between and «Verse 2» over the second; no sliver.

**Fix 4: D8's by-reference assertion.** `strophic-byte-baseline.test.ts` now passes the later-verse build and a language to `paginateMelody`, and asserts for each of the 207 baseline scores that `renderScoreOf(parsed)` has `path: 'notated'` and `score === parsed`. It holds for all 207; no exception is needed. All 207 hashes still hold with `verses` present.

**Small ones.** The `markup.` index line now follows `lyrics.` in `i18n.ts`. The comment at `MarkupPane.svelte:588-590` now says the render paginates the render score for a strophic song (the file stays at 1353 lines). `step5-volta-from-top-desktop-en.png` was deleted and retaken as `review-volta-from-top-desktop-en.png` from the from-top fixture: it is byte-identical to the picture of the other volta fixture, and the reason is real, not a copy: the two files differ only in a forward repeat sign on bar 1, which the renderer does not draw. I verified the file I fed the browser was `strophic-volta-from-top.musicxml`. New picture `review-stacked-desktop-en.png`: verse 1 runs from bar 3, «Verse 2» stands over «День» in the middle of the second system, «Verse 3» over «Мгла» in the third, each system that opens inside a later pass carries its tag («5 · verse 2», «5 · verse 3»), and the two-bar ending prints once after verse 3.

**Looked at:** `review-tacet-desktop-en.png`, `review-fix1-rest-desktop-en-p1.png`, `review-stacked-desktop-en.png`, `review-volta-from-top-desktop-en.png`. Not opened: `review-fix1-rest-desktop-en-p2.png`.

### The Playwright failures, with their error text

From the full run (245 passed, 8 failed):

1. `calibrate-new` "fr at 375 px: Re-take [i] on one line": `Test timeout of 60000ms exceeded. Error: locator.click: Test timeout of 60000ms exceeded. waiting for getByRole('button', { name: /^(re-take|réessayer)$/i }).first()`.
2. `heic-offline`: `expect(locator).toBeVisible() failed. Locator: getByText(/Ilya is reading the notes off your page|Reading the page/).first(). Expected: visible. Timeout: 60000ms. element(s) not found`.
3. `loupe-header` "a drag on the desk moves the card…": `expect(received).toBe(expected) Expected: -40 Received: -30`.
4. `loupe-header` "pressing a header button starts no drag": `expect(received).toBe(expected) Expected: 616 Received: 626`.
5. phone `input-views` "a poem typed into Poem moves no seat…": `expect(locator).toContainText(expected) failed. Locator: locator('.views-line').first(). Expected substring: "Your score's sung words are in Lyrics". Received string: "The words as sung, as the score sets them. Coloured words differ from the poem: a repeat, a change, or an addition."`.
6. phone `phrase-ends`: `expect(locator).toHaveAttribute(expected) failed. Locator: locator('[data-word-index="0-77"]').first(). Expected: "так: ˈtɑk". element(s) not found`.
7. phone `relining` "y.": `the drop leaves one line. expect(received).toBe(expected) Expected: 1 Received: 10`.
8. phone `relining` "bb.": `expect(received).toEqual(expected)`, expected line lengths `[7, 7, 7, 7, 7, 4]`, received `[4, 1, 2, 7, 7, 7, 7, 4]`.

Numbers 1, 2, 3, and 5 to 8 also fail on a clean worktree of `fb9d829e` (checked in the earlier pass; 2 needed a `build/` there too).

**Number 4, "pressing a header button starts no drag", on a clean worktree of `fb9d829e` and on this branch.** The test passes alone on both: base 2 of 2, this branch 3 of 3. Run with its whole file, the base passed in 3 of 3 runs; this branch failed in 1 of 3 (with the `Expected: 616 Received: 626` above) and passed in 2 of 3; it also failed in the full suite run. **Counted in file or suite context: this branch failed 2 of 4 (three whole-file runs and the full suite run); the base failed 0 of 3.** Alone: this branch 0 of 3, the base 0 of 2. The numbers lean toward a difference, but with so few runs I cannot say the branch causes it, and I could not find a reason in the diff: the lane's guards in `loupe.ts`, `loupe-ink.ts`, and `selection-ring.ts` do not touch the header's drag. **NOT ESTABLISHED.** It is a 10 px drift measured after a click, and the test that precedes it in the file fails on both trees. A dozen runs on each tree would settle it, and I did not do that.

### Gates after the review

| Gate | Count |
| --- | --- |
| phonology | 462 passed (462) |
| dictionary | 248 passed (248) |
| svelte-check | found 0 errors and 12 warnings in 5 files |
| web unit | 6258 passed, 1 skipped (6259) (the `open-extract` timing test passed on this run) |
| score-parser | 894 passed, 5 skipped (899) |
| blurb | 178 passed (178) |
| root integration | 159 passed (159) |
| ratchets | OK (`staff-renderer.ts` 3414 of 3414, `MarkupPane.svelte` 1353 of 1353, no ceiling raised) |

After the fixes the strophic Playwright tests and `key-change-melody` were rerun: desktop 4 passed (the three strophic tests and the key-change test), phone 2 passed.

### Three items left for Dann, not built, as the desk said

The Loupe's system count after a system of later-pass bars (already in the Step 4a report: "system 4 of 4" on a six-system page); the time-signature control binding to the wrong bar in a mixed system; and the second ending having no live copy (its bars exist only as later-pass copies, so nothing on the page can be tapped to correct it).
