# Review, lane 75 as built: the pane cut and Begin

r1, 2026-11-20, by Fable. Branch `cloud-lane-75`, tip `203a7407`, four commits on `Shane` `3bff3358`, cloned from GitHub into a throwaway container and read there. Read in full this session: the brief r2 (md5 `e254d48b34ba43c45d8f2a6d030faaf1`, confirmed on the Mac), my review of r1, the lane's four reports, and `CONTRACT.md` sections 0, 0.1, 1, 3, 4, 5, and 6. Every figure in this report was rendered or run in this session unless it says otherwise. Browser: the tree's Playwright 1.58.2 with Chromium, touch emulation as the `phone` project sets it, on the branch's development server with the capture stub.

## Verdict

**MERGE WITH FIXES.**

Items 1, 2, and 4 are built as the brief asked and I found nothing to change in them. The ruling of 22:42 is enacted faithfully: the pane's borrowing sentence is gone, the picker's note stays, and no string moved.

Item 3 meets its four done-when conditions as they are written. It also does something the conditions did not guard: **on a short phone, a singer who taps Contralto no longer sees the note.** At 390 by 667 in English the note sits wholly past the fold after the tap (its first line starts at 631 px; the screen ends at 611). On `Shane` its first two lines were on screen there. The kept test does not catch this, because it puts the scroll back to the start before it measures. Fix 1 repairs it with three lines, and with it Begin, all nine choices, and the whole note are on screen together at all three sizes in both languages (measured).

## Blockers

None.

## Fixes

Fixes 1 and 2 are the condition of the verdict. Fixes 3 to 5 are small and may ride in the same commit. All five were trialled together in my clone: gate 3 stayed at `0 errors and 12 warnings in 5 files`, gate 8 at `ratchets: OK.`, the two unit files that read the picker's source passed (67 tests), and the kept phone test passed six of six. The clone was restored afterward; nothing was pushed.

### 1. The note comes into view when it arrives

`apps/web/src/lib/voice/VoiceTypeFirst.svelte`. After `:25` (`const borrowingNote = $derived(...)`), add:

```svelte
	/* The note is brought into view when it arrives: on a short phone it lands past the fold, and the concession belongs at the moment of choice (`OPEN.md`, ROW 167). */
	let noteEl: HTMLDivElement | undefined = $state();
	$effect(() => { if (borrowingNote) noteEl?.scrollIntoView({ block: 'nearest' }); });
```

Replace `:40` with:

```svelte
	<div class="vt-note" aria-live="polite" bind:this={noteEl}>
```

Measured after a real tap on Contralto, scroll untouched, with fixes 1 and 3 applied (px from the top of the window; the screen ends at 611, or 584 at 640 tall):

| size | language | Begin | nine choices whole | note | note whole |
| --- | --- | --- | --- | --- | --- |
| 390 by 667 | English | 280.1 to 324.1 | 9 of 9 | 534.4 to 611.1 | yes |
| 390 by 667 | French | 262.1 to 306.1 | 9 of 9 | 534.6 to 611.3 | yes |
| 375 by 667 | English | 279.6 to 323.6 | 9 of 9 | 533.9 to 610.6 | yes |
| 375 by 667 | French | 243.1 to 287.1 | 9 of 9 | 515.6 to 610.5 | yes |
| 360 by 640 | English | 252.6 to 296.6 | 9 of 9 | 506.9 to 583.6 | yes |
| 360 by 640 | French | 216.6 to 260.6 | 9 of 9 | 489.1 to 584.0 | yes |

Where the note is already on screen (a tall phone, a tablet, the desk) `block: 'nearest'` does nothing. This is a DESK DEFAULT for the desk to take or wave off; it adds behaviour the brief did not name, in service of the brief's own section 1 ("reads the note and then needs the next action").

### 2. The kept test measures where the singer's tap leaves the screen

`apps/web/e2e-phone/wizard-begin.test.ts`.

- `:64-66`: delete the scroll reset. Replace the three lines with:

```ts
				// The note is shown (it is what makes the screen too tall). The scroll is left where the singer's own tap put it: nothing is reset.
				await expect(page.locator('.vt-first .vt-note p')).toBeVisible();
				const g = await geometry(page);
```

- `:70` (`expect(g.scrollTop, 'at rest').toBe(0);`): delete.
- After `:78` (`expect(overlaps(g.begin, g.note), 'the note').toBe(false);`), add:

```ts
				// 3. The note and the nine choices are whole inside the scroll box at the moment of choice (half a pixel of tolerance for rounding).
				expect(g.note.top, 'the note starts inside the scroll box').toBeGreaterThanOrEqual(g.scroller.top);
				expect(g.note.bottom, 'the note ends inside the scroll box').toBeLessThanOrEqual(g.scroller.bottom + 0.5);
				for (const [k, c] of g.choices.entries()) expect(c.top >= g.scroller.top && c.bottom <= g.scroller.bottom + 0.5, `choice ${k + 1} is whole on screen`).toBe(true);
```

- In the test's title at `:61` and the header at `:2-3`, "at rest" becomes "at the moment of choice".

Positive control, run: this stricter test against the branch as built fails six of six. With fix 1 it passes six of six.

### 3. The rule stops reordering screens that had room

`apps/web/src/lib/voice/VoiceTypeFirst.svelte:83`. Replace

```css
	@media (max-height: 880px) and (pointer: coarse) {
```

with

```css
	@media (pointer: coarse) and (max-height: 741px), (pointer: coarse) and (max-height: 880px) and (max-width: 599px) {
```

As built, the rule moves the picker after Begin on every touch screen up to 880 px tall, at any width. On three screens I rendered, everything already fit before the lane (Begin whole, nine choices whole, note whole, contralto chosen, both languages) and the lane reorders them anyway: an iPad in landscape at 1024 by 768 and at 1180 by 820, and a touch laptop on the desk layout at 1440 by 800. The replacement leaves those three alone (measured at the two tablet sizes: `order` reads 0, Begin at 600.9 to 644.9 in English and 641.6 to 685.6 in French, inside a screen that ends at 712 or 764). The figures behind it: from 600 px wide upward the French screen with the note ends at 685.6 px and needs a window of 742; under 600 px wide it needs up to 868 (360 wide, French). In the comment at `:82`, add that sentence in place of "880 is measured: ..." or beside it.

A phone at 390 by 844 still takes the reordered layout although the screen fits there in a bare window (English needs 765, French 828). That is deliberate: Safari's own bars take the difference on a real phone.

### 4. Two comments carry the disputed figure

- `apps/web/src/lib/voice/VoiceTypeFirst.svelte:79`: "it sits 41 to 172 px below the fold" becomes "it sits 97 to 228 px past the fold".
- `apps/web/e2e-phone/wizard-begin.test.ts:4`: "Begin sat 41 to 172 px below the fold" becomes "Begin sat 97 to 228 px past the fold".

See "The disputed figure".

### 5. One stale special case in a test the lane was told to leave

`apps/web/src/lib/stand-in-borrowing.test.ts:250`. Replace

```ts
					if (key === 'borrowing line (4.7)' || key === 'VOICE pane (4.6)') rest = rest.split(TYPE_NAME[id][language]).join('');
```

with

```ts
					if (key === 'borrowing line (4.7)') rest = rest.split(TYPE_NAME[id][language]).join('');
```

The pane no longer holds the singer's own type name, so nothing is stripped for it, and with the special case gone this test would also catch the name coming back. Trialled: the file passes, 34 of 34. My r1 review asked for this; r2 told the lane not to touch the rest of the file, and the lane obeyed r2. Not the lane's fault.

## 1. What every singer reads in the VOICE pane

`paneSentence` was run on the branch for eleven voices (the eight Tier 1 ids, "Not sure", no type, and the unknown id `castrato`), in two states, in two languages: 22 readings per language, 44 in all. None is empty. None is false.

**Nothing sampled.**

| voice | English | French |
| --- | --- | --- |
| soprano | Ilya is using generic values for a soprano voice until you record your own. | Ilya utilise des valeurs par défaut pour une voix type de soprano jusqu’à ce que vous captiez les vôtres. |
| mezzo-soprano | ... for a mezzo-soprano voice ... | ... une voix type de mezzo-soprano ... |
| contralto | ... for a mezzo-soprano voice ... | ... une voix type de mezzo-soprano ... |
| countertenor | ... for a mezzo and tenor voice ... | ... une voix type de mezzo et ténor ... |
| tenor | ... for a tenor voice ... | ... une voix type de ténor ... |
| baritone | ... for a baritone voice ... | ... une voix type de baryton ... |
| bass-baritone | ... for a bass voice ... | ... une voix type de basse ... |
| bass | ... for a bass voice ... | ... une voix type de basse ... |
| "Not sure" | Not knowing is a fine answer. Record your vowels in vocal fry and Ilya works from your own voice, which also gives you evidence in your own search. Or choose a voice type, and Ilya starts from published values for it. | Ne pas savoir est une réponse valable. Captez vos voyelles en friture vocale et Ilya travaille à partir de votre propre voix, ce qui vous donne aussi des indices dans votre propre recherche. Ou choisissez un type de voix, et Ilya part de valeurs publiées pour celui-ci. |
| no type | Record your ten vowels, and Ilya builds your resonance profile. Or choose a voice type, and Ilya starts from generic values for now. | Captez vos dix voyelles, et Ilya établit votre profil de résonances. Ou choisissez un type de voix, et Ilya part de valeurs par défaut pour l’instant. |
| unknown id | the same as no type | the same as no type |

**Three stable core vowels ([i], [e], [ɛ]).** All eleven read one sentence per language, character for character:

- "You have sampled 3 of the 6 core vowels so far ([i], [e], and [ɛ]). To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 2 more, unsampled vowels are assigned placeholder values."
- « Vous avez échantillonné 3 des 6 voyelles de base jusqu’ici ([i], [e] et [ɛ]). Pour compléter votre espace vocalique personnel, Ilya a besoin d’au moins 5 échantillons stables en friture vocale. D’ici à ce que vous en fournissiez 2 de plus, les voyelles non échantillonnées reçoivent des valeurs par défaut. »

Two notes, neither a fault of this lane and neither a reason to hold it. The "Not sure" sentence ends "Ilya starts from published values for it", which is not so for three of the eight types; the lane did not touch that string and the picker's note corrects it at the moment of choice. A countertenor reads "a mezzo and tenor voice", which is true of the staff and is lane 71's wording restored.

**No string moved.** `git diff 3bff3358 203a7407 -- apps/web/src/lib/i18n.ts` is empty. The same diff is empty for `analysis/`, `markup/`, `insights/`, `scripts/ratchets.json`, and `e2e/insights-no-score.test.ts`.

## 2. The tests

Every change the brief's section 2 names was made, read in the diff:

| file | named change | made |
| --- | --- | --- |
| `Drawer/voice-pane.test.ts` | the three `cases` rows take the `typedGeneric` sentence, rows kept | yes, exact `toBe` in both languages |
| | the `BORROWING` record, `lead()`, and the comment go; seven types stay in the loop | yes |
| | the `describe` retitled | yes |
| | "nothing sampled": all eight exact, both languages, no "The field has not yet published" for all eight | yes, and the French twin is asserted too |
| | "three stable core vowels": all eight read the count sentence alone; no double space, no newline | yes |
| | the two no-borrowing tests widened to eight ids plus `not-sure`, `undefined`, `castrato` | yes |
| | the "same words" test replaced by the "none of the pieces" test, as the brief defines the pieces | yes, and it also asserts the whole written-out line is absent |
| | the two comments repaired | yes |
| `stand-in-borrowing.test.ts` | the pane joins the list that must not hold the singer's own type name; the two assertions and the comment go | yes |
| `e2e/voice-pane.test.ts` | the contralto pin becomes the `typedGeneric` sentence; comment repaired | yes |
| `e2e/insights-no-score.test.ts` | unchanged and passing | yes: not in the diff, and 8 of 8 passed here, the contralto case in both languages among them |
| `e2e-phone/` | nothing to change | confirmed |

**Nothing weakened.** Every `toBe` that was a `toBe` is still one. No test was deleted beyond the one the brief replaces. The count is 6,744 before and after.

**No surviving pin of the pane's borrowing sentence.** I searched `apps`, `packages`, and `tests` for "not yet published", "pas encore publié", `paneSentence`, `vp-sentence`, `borrowingSentence`, and `borrowingFor`. What remains pins other things and is right to remain: the pages' line (`e2e/insights-no-score.test.ts:71-72`, `e2e/borrowing-with-score.test.ts:16-17`), the string itself (`insights/ratified-lines.test.ts:451-452`), the picker's note (`stand-in-borrowing.test.ts:281-288`), and the pane's negative pins (`voice-pane.test.ts`). `borrowingSentence` and `borrowingFor` appear nowhere.

**Run here.** `e2e/voice-pane.test.ts`: 24 passed. `e2e/insights-no-score.test.ts` and `e2e/borrowing-with-score.test.ts`: 10 passed. `e2e-phone/wizard-begin.test.ts`: 6 passed. `e2e-phone` `insights-links`, `voice-stations`, and `welcome-sheet`: 13 passed, 1 failed. The failure is `voice-stations.test.ts:62`, "Drawer raised", by 0.09 px (received -0.09375, expected 0 or more): the sub-pixel failure the brief lists as known on an untouched tree.

## 3. The disputed figure

**The brief is right: 97 px in English and 160 px in French at 390 by 667. The lane's 41 and 104 are measured against the wrong edge.**

Both read the same thing. With the lane's reordering switched off, contralto chosen, at 390 by 667, Begin's lower edge is at 708.1 px in English and 771.3 px in French, which is the lane's own figure and the lane 74 review's. The difference is what it is subtracted from. The lane subtracted the window's height, 667. But the last 56 px of the window is the drawer's bar ("THE PAGE"), and the screen the singer can read ends at 611 px. The lane's own item 3 report says so two paragraphs earlier ("the scroll box's bottom edge reads 611 at 667 high"). 708.1 less 611 is 97; 771.3 less 611 is 160. At Begin's centre the browser reports another element on top of it, which confirms it is off the readable screen and not merely near the edge.

Before the lane, measured against the screen's real end:

| size | English | French |
| --- | --- | --- |
| 390 by 667 | 97 px past | 160 px past |
| 375 by 667 | 120 px past | 179 px past |
| 360 by 640 | 147 px past | 228 px past |

**Is item 3's done-when met?** By its words, yes, at all three sizes in both languages with contralto chosen, and also where the singer's tap leaves the scroll (not only at the start):

| size | language | Begin after a real tap | whole on screen | covered | covers a choice or the note |
| --- | --- | --- | --- | --- | --- |
| 390 by 667 | English | 377.1 to 421.1 | yes | no | no |
| 390 by 667 | French | 327.1 to 371.1 | yes | no | no |
| 375 by 667 | English | 399.6 to 443.6 | yes | no | no |
| 375 by 667 | French | 327.1 to 371.1 | yes | no | no |
| 360 by 640 | English | 318.6 to 362.6 | yes | no | no |
| 360 by 640 | French | 300.6 to 344.6 | yes | no | no |

Begin also stays whole on screen at the end of the scroll in all six (the table under fix 1 is taken there). Condition 4, the kept test, exists and passes; its weakness is fix 2.

**What the conditions did not guard, as built.** Counted on the same six renders:

| size | language | choices whole on screen before any scroll | note after the tap |
| --- | --- | --- | --- |
| 390 by 667 | English | 8 of 9 | wholly past the fold (631.4 to 708.1; `Shane`: 573.4 to 650.1, two lines showing) |
| 390 by 667 | French | 2 of 9 | about 11 px showing (`Shane`: wholly past the fold) |
| 375 by 667 | English | 6 of 9 | wholly past the fold (`Shane`: 15 px showing) |
| 375 by 667 | French | 2 of 9 | about 11 px showing (`Shane`: wholly past the fold) |
| 360 by 640 | English | 4 of 9 | about 11 px showing |
| 360 by 640 | French | 0 of 9 | about 11 px showing |

The "`Shane`" readings are the branch with the lane's reordering switched off, which is `Shane`'s layout for a chosen contralto. So the lane trades one for the other in English: Begin comes on screen and the note leaves it. In French the note was already off screen on `Shane`. Fix 1 ends the trade.

## 4. Item 3's scope

**Scoped correctly.** The rule selects `.vt-first`, which only `VoiceTypeFirst.svelte` renders, and that component is mounted in one place, the welcome phase (`CalibrationWizard.svelte:810`). `.wizard-primary` is not touched; `CalibrationWizard.svelte` is not in the diff.

Every phase rendered at 390 by 667, English, touch, on the stub, once as built and once with the lane's two style rules switched off. I drove the stub's readiness outcomes (`window.__ilyaStubReadiness`), so the three screens the lane read only from source were rendered here.

| phase | buttons, as rendered | against the lane's rules switched off |
| --- | --- | --- |
| welcome, no type | "What is vocal fry?", Begin (primary) 377.1 to 421.1 | **differs**, as intended: Begin was 587.4 to 631.4 |
| welcome, a bass already chosen (no picker) | "What is vocal fry?", Begin 377.1 to 421.1 | identical |
| readiness, before | Start (primary) 252.1 to 296.1 | identical |
| readiness, fry running | none | identical |
| readiness, complete | Continue (primary) 207.1 to 251.1 | identical |
| readiness, complete with the marginal guidance | Continue 266.1 to 310.1 | identical |
| readiness, no microphone | Continue 229.6 to 273.6 | identical |
| readiness, no fry heard | Try again (secondary) 229.6 to 273.6, then Continue 287.6 to 331.6 | identical |
| capture | ten vowel buttons, Start [i], Start over, "Your readings" | identical |
| summary | the sheet's row button, Print this sheet, Finish (primary), Back to the ten vowels, Start over | identical |

No button outside the welcome screen moved, and none is covered. On the welcome screen Begin is in the flow, so it cannot cover a choice or the note; its measured box overlaps no choice and not the note at any of the eleven window sizes I rendered (the three of the brief, 390 by 664, 390 by 745, 390 by 844, 414 by 896, 1024 by 768, 1180 by 820, 1440 by 800, and 844 by 390).

**What moved that the brief did not ask for** is fix 3: the reordering reaches tablets and a touch laptop where the screen had room.

## 5. Ratchets

Gate 8: `ratchets: OK.`

| file | lines | ceiling |
| --- | --- | --- |
| `voice/CalibrationWizard.svelte` | 1,124 (not touched) | 1,126 |
| `components/Drawer/Drawer.svelte` | 1,986 (not touched) | 1,990 |
| `routes/+page.svelte` | 5,532 (not touched) | 5,534 |
| `voice/VoiceTypeFirst.svelte` | 109 (was 96) | none listed; 1,000 for an unlisted file |
| `voice/VoiceTypeIntake.svelte` | 223 (was 219) | none listed; 1,000 |
| `components/Drawer/voice-pane.ts` | 92 (was 115) | none listed; 1,000 |

Test files are exempt from the size ratchet (`scripts/ratchets.mjs`, `IS_TEST`). `scripts/ratchets.json` is not in the diff. With fixes 1 and 3, `VoiceTypeFirst.svelte` is 112 lines.

## 6. Item 2's rule, rendered

**It works in both pickers, and raises no warning.**

- The empty region matches `:empty` in the browser: its only child is a comment node (node type 8), no text node. Its computed `margin-top` is -4.8 px, its height 0.
- Wizard, 390 by 844, English, a tenor chosen, the reordering switched off so Begin follows the picker as it did on item 2's own commit: Begin's lower edge is **626.6 px** with the rule and 631.4 px without. That is the brief's figure.
- Choosing contralto fills the region: `:empty` stops matching, the margin reads 0, and the note takes its 0.3rem gap. Choosing tenor again empties it and the margin returns. So the rule follows the note in both directions.
- VOICE pane picker, phone (390 by 844) and desk (1440 by 900): with a tenor stored, the space from the last choice to the Clear button is 6.4 px with the rule and 11.2 px without. With no type, the fieldset ends flush with the last choice (0 px) with the rule and 4.8 px past it without.
- No console warning or error in any of those renders. Gate 3 is unchanged at 12 warnings, so the compiler does not report the selector as unused.

## 7. The gates, run here on `203a7407`

| gate | baseline | measured |
| --- | --- | --- |
| 3 web-check | `found 0 errors and 12 warnings in 5 files` | `svelte-check found 0 errors and 12 warnings in 5 files` |
| 4 web-test | `6743 passed | 1 skipped (6744)` with numpy and scipy | `Tests  6743 passed | 1 skipped (6744)`, `Test Files  363 passed (363)` |
| 8 ratchets | `ratchets: OK.` | `ratchets: OK.` |

My container has numpy and scipy (`python3 -c "import numpy, scipy"` succeeds), so gate 4 matches the **with** baseline, the one the Mac's ship script uses. The lane's container had neither and reported `6739 passed | 5 skipped (6744)`; the two agree. Gate 4 does not move: no change to `ilya-ship.sh` is needed for this lane. Gates 1, 2, 5, 6, and 7 were not asked of me and I did not run them; the lane reports all five at baseline and the lane touches no package.

## What the lane's reports say that the render does not bear out

1. Item 3's report and item 4's report both say the difference from the brief's 97 and 160 is NOT ESTABLISHED. It is established, from the lane's own numbers (section 3).
2. Item 3's report says the unmeasured, refused, and complete readiness screens could not be rendered on the stub. They can (`voice/chart/stub-switch.ts`, `__ilyaStubReadiness`), and were, here.
3. Item 3's report says nothing is harmed. Its own after-figures show the note past the fold ("the last rows and the note are below the fold: the singer scrolls to reach them"); it reports that as a cost of the order and not as the loss of the note at the moment of choice.

The reports are otherwise accurate where I checked them: the 626.6 figure, the pane picker's 11.2 to 6.4, every Playwright count I re-ran, and the candid statement that the on-screen order is Dann's to rule.

## WHAT YOU COULD NOT ESTABLISH

NOT ESTABLISHED beats a complete invented answer.

1. **A real phone.** Everything here is Chromium's touch emulation. Safari on an iPhone changes the visible height as its bars show and hide, and I did not run it. Whether the `max-height` condition reads the height Safari shows at each moment is not established.
2. **A screen reader.** On a touch screen VoiceOver and TalkBack swipe in page order, which is still picker, then Begin, while the screen now shows Begin first. Whether that mismatch confuses a blind singer, and whether the note is announced when it arrives, were not run by the lane or by me.
3. **`Shane` as its own build.** For the phases and for the "before" figures I rendered the branch with the lane's two style rules switched off, not a second build of `3bff3358`. That is exact for layout, because the only non-test source the lane changed is those two style blocks and `voice-pane.ts` (`git diff --stat`), but it is a derivation and I name it as one.
4. **A phone held sideways.** At 844 by 390 the readable screen is 278 px tall and the welcome screen does not fit in either order. With fix 1, choosing contralto there scrolls Begin off the top of the screen. The brief names no landscape size and I did not design for it.
5. **The whole browser suite.** I ran the six files named in section 2. I did not run the rest of `e2e` (`time-signature-card` among them) or the rest of `e2e-phone`; a first attempt at the full phone project ran out of time and gave no result.
6. **Fix 1 on the full gate 4.** With the fixes applied I ran gate 3, gate 8, the two unit files that read the picker's source, and the phone test. I did not re-run all 6,744 unit tests on the fixed tree.
7. **The Mac's copy of the branch.** The Mac's repository holds no `origin/cloud-lane-75` yet and I may not fetch, so the branch was read from GitHub at `203a7407`. The Mac's working tree showed ` M docs/memory/INBOX.md`, ` M docs/memory/OPEN.md`, and two untracked session files that are not mine; this report is a third untracked file, and the ship script refuses on untracked files.
8. **Outside this lane, seen in passing and identical with and without it:** on the capture screen at 390 by 667, "Start [i]" sits at 620.2 to 664.2, past the screen's end at 611, before any scroll. Not measured further.

## FOR DANN'S EYE

Each of these wants a phone in the hand, in Safari, on a voice that has no type yet. VOICE, then "Record your vowels".

1. **Begin now comes before the voice-type question on a phone.** Stand on the welcome screen and do not scroll. Look for: Begin under "What is vocal fry?", and "YOUR VOICE TYPE" under Begin. On a small phone in French you may see none of the nine choices until you scroll. This is the one taste question in the lane: whether a singer may meet Begin before the question. A singer who taps Begin without choosing skips the question; the VOICE pane still asks it later.
2. **Tap Contralto and watch for the note.** As built, in English on a small phone, nothing visible changes when you tap: the note has arrived off screen. With fix 1 the screen moves by itself so that Begin, the nine choices, and the whole note are on screen together. Look for: the note's last line fully readable, and Begin still in view over it.
3. **The pane no longer stutters.** Choose Contralto, go Back to the VOICE pane. Look for: one sentence, "Ilya is using generic values for a mezzo-soprano voice until you record your own.", and no "The field has not yet published" in the pane. Open the "Contralto" row: the note is there, once.
4. **MELODY and INSIGHTS still give the reason.** With a score loaded and contralto chosen, open each. Look for the line that begins "The field has not yet published resonance values for a contralto".
5. **A countertenor's pane.** Choose Countertenor and read the pane: "generic values for a mezzo and tenor voice". True, and restored from lane 71; yours to judge by ear.

## Terms

Adopted from the briefs, the lane's reports, and my r1 review: "borrowing line", "picker's note", "the fold", "the cut", "kept test". Coined here: "the reordering" (item 3's rule that lays the picker after Begin), and "the screen's end" (the lower edge of the box that scrolls, 56 px short of the window on the phone layout).
