# Review of lane 57's amendment, as built

Filed verbatim by the desk (Opus 5.5), 2026-11-16 02:1x. Reviewer: Fable 5.2, cap told 200k. The report follows exactly as returned.

Reviewed: `git diff 70449563 419ce634 -- apps/`, read in full, on a fresh clone at `419ce634`. Paths below are relative to `apps/web/` unless they start with `docs/` or `scripts/`. I ran the Welcome unit tests (4 files, 44 passed) and `scripts/ratchets.mjs` (OK). I did not run Playwright or a browser.

NOT ESTABLISHED beats a complete invented answer.

## 1. Verdict (MERGE, MERGE WITH FIXES, HOLD) and blockers

**MERGE WITH FIXES.** No blockers. The five changes do what the amendment asked, and none breaks the focus trap, Escape, keyboard scroll, reduced motion, the inert cleanup, print, or the French layout. One fix is a matter of truth in the code's own record (fix 1); the rest are small.

Per item:

1. **Focus after Begin: correct.**
   - `begin()` sets `open = false`, awaits `tick()`, then focuses (`src/lib/components/Welcome/WelcomeSheet.svelte:148-153`).
   - The inert effect's cleanup removes `inert` on that flush (`WelcomeSheet.svelte:79-84`), and the trap's cleanup removes the `focusin` listener (`WelcomeSheet.svelte:126-129`), so focus is not pulled back.
   - The header holds exactly one control, the language pill (`src/lib/components/HeaderBar.svelte:42-59`), and the header is inside `.app-shell` (`src/routes/+layout.svelte:7-9`).
   - The reduced-motion path takes the same `done()` (`WelcomeSheet.svelte:154`).
   - The Playwright check exists (`e2e/welcome-sheet.test.ts:69-82`).
2. **`noteX()` returns 134: correct** (`src/lib/components/Welcome/welcome-plate.ts:116-118`), and the test reads the prototype's own element (`src/lib/components/Welcome/welcome-plate.test.ts:109-115`). I measured the notehead in the font file: it spans 0 to 317 font units at the baseline, so its centre is at 149.9 of 300.
3. **Shadow: correct as instructed.**
   - The sheet uses `box-shadow: var(--float-shadow)` (`WelcomeSheet.svelte:240`).
   - The token sits in `:root` (`src/app.css:150-153`; the block opens at `src/app.css:21`), so the portalled sheet inherits it.
   - The swap drops the prototype's 1 px ring and lightens the deepest layer from 0.16 to 0.07 (`docs/sessions/welcome-sheet/ilya-welcome-draft-17.html:26`). See section 3.
4. **Scrim 260 ms: correct.**
   - `LEAVE_MS = 260` and `SHEET_LEAVE_MS = 180` (`src/lib/components/Welcome/welcome-motion.ts:26`, `:28`).
   - The scrim spends `--leave` and the sheet `--leave-sheet` (`WelcomeSheet.svelte:162`, `:226`, `:241-243`), matching the prototype (`ilya-welcome-draft-17.html:24`).
   - The unmount timer uses the longer value (`WelcomeSheet.svelte:156`), so the sheet is not cut off mid-fade.
   - Reduced motion still has no transition (`WelcomeSheet.svelte:478-484`).
5. **Finale Maestro: correct in the render, wrong in the record.**
   - Family and URL match the score renderer's spec exactly (`src/lib/components/Welcome/WelcomePlate.svelte:74-78`; `src/lib/score/notation-fonts.ts:39`).
   - I read the OTF's cmap with fontTools: U+E1D7 is present.
   - The lane's contact sheet shows a correct eighth note with its head on the middle line.
   - The pinned bounding box is the wrong glyph's (fix 1).

Other checks:

- **Tests pinning old values:** none remain. The e2e suites hold no 180, shadow, or Bravura literals (grep of `e2e/welcome-sheet.test.ts` and `e2e-phone/welcome-sheet.test.ts`).
- **Key count:** unchanged. The amendment touches no i18n file (diff stat).
- **Line ceilings:**
  - `WelcomeSheet.svelte` is 491 lines and the new `welcome-sheet.test.ts` is 39, against a new-file limit of 1000 (`scripts/ratchets.json:3`).
  - The amendment touches no ratcheted file.
  - The ratchet run offers lower ceilings for three files the amendment did not touch (for example `+page.svelte` 5534 to 5511).

## 2. Fixes, numbered, each with file:line

1. **The pinned box is for a different glyph.**
   - U+E1D7 is SMuFL `note8thUp`, not `metNote8thUp`. I adopted both names from `FinaleMaestro.json`.
   - The OTF's outline for U+E1D7 is (0, -132) to (562, 894) in 1000 units per em, which is 2.248 by 3.576 staff spaces with a descent of 0.528. That equals the JSON's `note8thUp` box exactly.
   - `metNote8thUp`'s box (2.264, 3.04, -0.548) matches U+ECA7's outline instead.
   - `NOTE_BBOX` therefore pins a glyph the plate does not draw (`src/lib/components/Welcome/welcome-plate.ts:108`), and the test holds it to the wrong key (`src/lib/components/Welcome/welcome-plate.test.ts:80-85`).
   - The render is unaffected: `WelcomePlate.svelte:11` does not import `NOTE_BBOX`.
   - Fix: repin to `glyphBBoxes.note8thUp` (`sw: [0.0, -0.528], ne: [2.248, 3.576]`) and rename in the comments at `welcome-plate.ts:98`, `welcome-plate.ts:104`, `WelcomePlate.svelte:33`, and `welcome-plate.test.ts:80`. Deleting the constant and its test is the alternative, since nothing renders from it.
   - The misnaming starts outside the lane at `src/lib/score/correction.ts:201`; that line is a note for the desk, not a lane fix.
2. **Glyph shows as a fallback box while the font loads.**
   - The face is `font-display: swap` (`WelcomePlate.svelte:77`) and `.smufl` has no fallback family (`WelcomePlate.svelte:123`).
   - If the 281 KB OTF has not arrived when the note's turn comes (about 2 s in, from `welcome-motion.ts:11-16`), the browser draws its fallback for a private-use code point. What that fallback looks like is NOT ESTABLISHED.
   - Fix: `font-display: block`, so the staff stands empty until the note arrives.
   - This predates the amendment (Bravura had the same line), but the lane rewrote this block.
3. **A test comment claims more than the test does.** `e2e/welcome-sheet.test.ts:80` says Tab moves on from the pill, but line 81 only checks the class. Either press Tab and assert focus is still inside `.app-shell` and off the pill, or cut the comment.
4. **A doc comment says "tab order".** `WelcomeSheet.svelte:135` says so, but `querySelector` gives document order and does not test visibility (`WelcomeSheet.svelte:140`). With one control in the header this is moot today; change the wording to "document order".
5. **The report's claim "the browser reuses one file" needs narrowing** (`WelcomePlate.svelte:70-71`, and the report's item 5).
   - Same family and URL is true.
   - There are two face objects: the CSS one, and the renderer's `new FontFace` (`src/lib/score/notation-fonts.ts:53-55`).
   - `vercel.json` (repo root) sets no `Cache-Control` for `/fonts`.
   - The service worker refetches in the background on every hit (`static/sw.js:129-141`).
   - So "one file, at most one download plus revalidations" is what the code supports; "one fetch" is not shown.
   - A side effect to record: Svelte does not scope `@font-face`, so every element that already names `'Finale Maestro'` (for example `src/lib/tempo/TempoControl.svelte:256`) can now load the face without `loadNotationFont()`. I see no harm in it.

## 3. For Dann's eye, if anything (taste only), or "none"

1. **The sheet's edge.**
   - The token gives a lighter far shadow (0.07 against the prototype's 0.16) and no 1 px ring.
   - In `docs/sessions/report-code-welcome-sheet-pictures/desktop-en-final.png` the sheet still separates cleanly from the scrim; the lift is softer than draft 17.
   - Either is defensible: the ratified words say "the app's float shadow", and the ratified picture had the heavier one.
2. **Where focus lands.**
   - It lands on the language pill, as the amendment specified.
   - For a keyboard singer the next Enter or Space switches the language.
   - The alternative is the text box, which is the task, but it is disabled until the dictionary loads (`e2e/welcome-sheet.test.ts:66`) and raises the keyboard on a phone.
   - I would keep the pill.

## 4. What I could not establish

- **Playwright:** not run. The focus test's pass, and the 17 and 3 counts, are the lane's report, not mine.
- **Network behaviour of the font:** no network log read. Whether the plate and the score renderer cost one download in practice is NOT ESTABLISHED.
- **Focus ring on the pill after a mouse click on Begin:** depends on each browser's `:focus-visible` heuristic. NOT ESTABLISHED, in particular for Safari.
- **Timing of the 260 ms fade in a browser:** not measured. The lane did not measure it either.
- **`docs/sessions/review-fable-lane57-welcome-sheet_r1_2026-11-15.md`:** not in this clone, so I could not check this review against the earlier one.
- **The eight gates:** I ran only the Welcome unit tests and the ratchets. The gate 4 count of 5872 is the lane's.

Nothing in this review drew on memory. Nothing new for memory beyond fix 1's finding (U+E1D7 is `note8thUp`; learned from `static/fonts/finale-maestro/FinaleMaestro.otf` and `FinaleMaestro.json` in this review), which may merit a line in `docs/memory/ENVIRONMENT.md`.
