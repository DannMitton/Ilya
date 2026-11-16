# Report, Code, N.203 lane 59, Step 4 (the screen, in order)

r1, 2026-11-16. Branch `cloud-lane-59`. Brief r3 Step 4 with amendments 16 and 17. Per the desk's change of 02:4x, this step ran only the files it touched; the browser suites are rewritten here and run at the end of Step 8.

## What changed

- `voice/VowelCapture.svelte`: the order is now the head and count; the vowel's row (symbol circle, name, credit, the two resonances, side view); the take line; the cue alone; the first-time explanation until a take has begun; the ten buttons; Start and the second button (and See your vowel space at ten); the vowel space chart; then the hint, the sentence on the dots, the folded readings, the hide toggle, and the quiet foot link. The sticky `.stage` and its `flows` state are gone. The readout moved from the cue row into the vowel's row (under the credit). The cue is two lines tall at the most (`min-height: 2.5em`); a longer notice (a rolled-back take, an error) grows the row by a line.
- Sizes (amendment 16, a target, not a rule): the circle is `min(6rem, 20cqw)` (64 px phone, 90 px desk); the side view `min(13.75rem, 43cqw)` (138 px phone, 194 px desk), not the 155 and 220 of plan r4, because the row on a 390 px phone is 322 px wide inside the Drawer (not 358) and the name, credit, and readout need about 97 px beside a 64 px circle and a 138 px drawing. I chose legibility of the words in the row over the larger drawing. Both widths come from the row's own container width, so any Drawer width follows.
- `voice/chart/SagittalDrawing.svelte`: the line holds one weight on screen at any size (1.3 px solid, 1.1 px dotted), computed from the rendered width, because the built 7 and 6 units would thicken with the larger squircle.
- The chart rests on the focused vowel and glides on every change of focus (80 ms to 800 ms, a jump under reduced motion). That rule went in at Step 3.
- `e2e/calibrate-new.test.ts` rewritten for the new behaviour and order: the full tour ends on Re-take and See your vowel space; a new glide test; a new tap-focuses-and-Start-records test (a tap during a take, of the same or another vowel, does nothing); the cancel test cancels with Stop at 0.5, 4.5, 7, 8.2, and 10.5 s; the hidden-mode and readings-list tests start with Start; the sheet-width test keeps 484 px centred and checks the buttons and both actions are in view with nothing scrolled; the old sticky-stage suite is replaced by an order and in-view test in both languages, first visit and after, on a 390 by 844 phone and a 1440 by 900 desk, which also asserts that nothing scrolls by itself during a take. **Not run yet**: the desk's change puts the Playwright suites at the end of Step 8.

## Tests run

`VowelCapture.test.ts` (20 passed; two new: the order, and the readout in the vowel's row, not the cue's). The rest of this step's changes are covered by Step 3's files, which I ran before this step's edits to the component (129 passed), and I did not re-run them after.

## Measurements (Playwright, the stub session, `?capture=stub`, device scale 2; heights in CSS px, from the top of the viewport)

| | Phone 390 by 844, English, first visit | Phone, French, first visit | Phone, English, after (three recorded) | Desk 1440 by 900, English, first visit |
|---|---|---|---|---|
| Row (symbol, name, readout, side view): top to bottom | 198 to 336 (138) | 198 to 336 | 198 to 336 | 246 to 440 (194) |
| Take line | 346 to 373 | 346 to 373 | 346 to 373 | 450 to 477 |
| Cue | 382 to 430 | 382 to 430 | 382 to 430 | 486 to 534 |
| First-time explanation | 439 to 512 (73) | 439 to 530 (91) | none | 543 to 598 |
| Ten buttons | 522 to 618 | 540 to 636 | 439 to 535 | 607 to 703 |
| **Bottom of the Start row** | **671** | **689** | **589** | **757** |
| Chart | 681 to 867 | 699 to 885 | 598 to 785 | 767 to 1028 |
| Bottom of the takeover's scroll area (the Drawer's visible end) | 788 | 788 | 788 | 888 |
| Chart in view at rest | 107 of 186 px (57%) | 89 of 186 (48%) | 190 of 186: whole | 121 of 261 (46%) |

So on the phone the distance from the top of the viewport to the bottom of the Start row is 671 px (689 in French), against a 844 px Playwright viewport and a 788 px Drawer end; I do not know the visible height on a phone with its browser bars up, so the number is above for the desk to judge against that. The scroll position of the takeover is 0 in all four, and nothing scrolled during a take in the pictures. On the desk the Start row ends at 757 against the Drawer's end at 888. **With the first-time explanation showing (the worst case: a first visit), everything down to the Start row fits on both.**

How the chart frame takes the built view: I kept the built frame, 484 by 280 (wide), full width below the buttons. It reads clearly in the pictures and a taller frame would push the Start row out of view for the sake of a chart that is mostly below the fold at rest anyway. Your call if you want it taller or square.

## Pictures (`docs/sessions/report-code-n203-lane59-pictures/step4-*.png`)

Phone English (rest, breathe, sing, shape, fry, sweep, dwell), phone French (rest, breathe, shape, dwell), desk English (the same seven): 18, all opened and looked at. What I saw: the order is as ruled; the first take no longer scrolls the screen; the readout sits under the credit at the dwell and the cue is alone; French labels whole, with « Respiration » and « Chant » about 4 px apart (as in Step 3); the French Shape cue wraps to two lines and the buttons below do not move; the side view's line is light and even at both sizes. On the phone at rest only the top of the chart shows below Start; on the desk about half.

## What needs Dann's eye

- On a phone the chart is below the fold at rest and during a take, so the dot lands unseen unless the singer scrolls (Fable's review, section 3). It follows from the 00:32 order; this is the "walk note" so it does not read as a defect.
- The hint under the chart still says "Stop, or a second tap on [i], ends this take": Step 7's.
- The stale "Tap the [i] cardinal-i vowel to begin" explanation: Step 7's (sheet line 17).

## What I could not establish

- The visible height of a real phone browser with its bars up.
- Playwright results for the rewritten suite.
