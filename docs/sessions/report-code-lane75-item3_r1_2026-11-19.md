# Report, lane 75, item 3: Begin stays in reach on a short phone

r1, 2026-11-19 (session of 2026-11-20 UTC), by the cloud lane. Branch `cloud-lane-75`. Brief md5 `e254d48b34ba43c45d8f2a6d030faaf1`. Items 1 and 2 are commits `92f39c4` and `a5caa3b`.

## The mechanism, and the one thing in it that is Dann's to rule

**On a short touch screen the picker is laid after Begin.** The rule is in `apps/web/src/lib/voice/VoiceTypeFirst.svelte`:

```css
@media (max-height: 880px) and (pointer: coarse) {
	.vt-first {
		order: 1;
	}
}
```

`.vt-first` is a flex item of the wizard's `.wizard-phase`, which is a flex column, so `order: 1` puts the picker (heading, hint, nine choices, note) after Begin and nothing else moves. The source order is unchanged: a keyboard or a screen reader still meets the picker before Begin. No file besides `VoiceTypeFirst.svelte` changed for the layout, so `CalibrationWizard.svelte` is still 1,124 lines against 1,126, `Drawer.svelte` 1,986 against 1,990, and `routes/+page.svelte` 5,532 against 5,534. No ceiling was touched.

**What this costs, which is a design question and not mine to settle.** On a short phone the singer now sees Begin first and the picker below it. A singer who taps Begin without choosing skips the picker. The type is scaffolding and "Not sure" is a valid answer (`calib.voiceTypeFirst.hint`), and the VOICE pane keeps its own type row, so nothing is lost for good, but the order on screen is no longer the order the wizard was designed in. A desk window, and any phone tall enough to fit the screen (above 880 px), keeps the picker first. The brief names "placing it ahead of the picker" as a mechanism; the choice of the media condition is mine.

Why not pin Begin at the bottom: at 390 by 667 the scroll box is 555 px and Begin sits 41 to 172 px below the fold, so a pinned Begin would lie on top of the note or the last rows of choices at rest. That fails done-when 2. Why not spacing: the screen's gaps are 56 px in all, and the overflow is more than that in five of the six cases.

**Where the 880 and `pointer: coarse` come from, measured.** The drawer's bottom bar ("LA PAGE") takes the last 56 px of the window: the scroll box's bottom edge reads 611 at 667 high and 584 at 640. The tallest case is French at 360 wide with the note shown: Begin's bottom is 812, so it needs 868. At 360 by 900 (unflipped) Begin's bottom is 812 against a limit of 844, and at 360 by 844 and 360 by 880 the layout flips and Begin is at 488.6. I first wrote 820 and measured it wrong for that case (812 plus the bar is more than 820), then corrected it. `pointer: coarse` limits the flip to the devices where tab order barely matters.

## Before and after, measured in a live browser (Chromium on the stub, touch emulation, contralto chosen, scroll at rest)

Begin's bottom edge against the viewport, before the change (the note shown, after item 2):

| viewport | English | French |
| --- | --- | --- |
| 390 by 667 | 708.1 (41 past) | 771.3 (104 past) |
| 375 by 667 | 730.6 (64 past) | 789.5 (123 past) |
| 360 by 640 | 730.6 (91 past) | 812.0 (172 past) |

After, Begin's top and bottom: 390 by 667 EN 377.1 to 421.1, FR 422.1 to 466.1; 375 by 667 EN 399.6 to 443.6, FR 422.1 to 466.1; 360 by 640 EN 399.6 to 443.6, FR 444.6 to 488.6. All six inside the scroll box (limit 611 or 584) and the window. The nine choices now start below Begin (519.7 at 390 by 667 EN, 605.3 at 360 by 640 FR) and the last rows and the note are below the fold: the singer scrolls to reach them. Nothing is covered at rest or scrolled, because Begin is in the flow. Brief figures differ from mine (97 and 160 px past the fold, against my 41 and 104 at 390 by 667): the brief's were read at a different scroll position, before item 2's 4.8 px, or both. I do not know which. NOT ESTABLISHED.

## The four done-when conditions

1. Whole Begin on screen at 390 by 667, contralto, English and French: yes (kept test, and the figures above).
2. Nine choices and the note not covered by Begin at any height tested: yes, no overlap in any of the six cases (kept test).
3. Same at 375 by 667 and 360 by 640: yes.
4. A kept test: `apps/web/e2e-phone/wizard-begin.test.ts`, six cases (three sizes, two languages). It asserts Begin is inside the scroll box and the window with the scroll at rest, that `elementFromPoint` at Begin's centre is Begin, that the note is shown, that there are nine choices, and that Begin's box overlaps none of the nine or the note. It asserts no wording. **Proved to bite:** with the `order` rule set back to 0, all six fail (Begin's bottom 708 to 812 against limits of 611 and 584); with it, all six pass.

## Every phase of the wizard, and what its buttons are

Rendered at 390 by 667 on the stub (screenshots and button lists read from the live page, English), after the change:

- **welcome**: "What is vocal fry?" (a disclosure), the picker's nine radios, and **Begin** (`wizard-primary`). This is the only phase changed.
- **readiness, before**: heading "Getting ready", **Start** (`wizard-primary`).
- **readiness, fry running**: no button; the cue and the take line.
- **capture**: ten vowel buttons, **Start [i]** (`.main`), **Start over**, and the "Your readings" disclosure. The capture screen has its own controls, not `.wizard-primary`.
- **summary**: "About the sung [o] vowel" (a row button), **Print this sheet**, **Finish** (`wizard-primary`), **Back to the ten vowels** and **Start over** (`wizard-secondary`).

Read from source, not rendered (they need a microphone refusal, no microphone, or a finished fry that the stub did not produce in my run): readiness "unmeasured" (**Continue**), "refused" (**Try again**, then **Continue**), and "complete" (**Continue**, with the marginal guidance). None of the three is a welcome screen and none sits in `.vt-first`'s flex container, so the rule cannot reach them.

No phase other than welcome is changed, and the rule is selected by `.vt-first`, which only the welcome phase renders.

## Gates and other tests

Gate 3 `found 0 errors and 12 warnings in 5 files`; gate 8 `ratchets: OK.`. This item adds no unit test, so gate 4's count is unchanged from item 1. All eight are run on the final tree in item 4's report.

Playwright, run by me: `e2e-phone/wizard-begin.test.ts` 6 passed; `e2e-phone/voice-stations` and `e2e-phone/welcome-sheet`, which also drive the wizard or a Begin, 9 passed. (`voice-stations.test.ts:62`, which the brief lists as failing sub-pixel on an untouched tree, passed here, both cases. I did not investigate why.)

## Section 6 and section 8

No computation changed. NOT ESTABLISHED: whether a screen reader announces the picker's note (not run). Whether a real iPhone in Safari shows the window height the media condition assumes (not run: I used Chromium's emulation; Safari's address bar changes the visible height). Whether a long-press or a scrolled start state changes any of the six figures (I measured at rest and, for the kept test, put the scroll back to rest after the radio's own scroll-into-view).
