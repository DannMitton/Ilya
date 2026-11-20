# Code brief, lane 75: the pane stops repeating the picker, and Begin stays in reach

r1, 2026-11-19, by the desk (Opus 5). Branch: `cloud-lane-75`, cut from `Shane` at the commit this brief ships in. It serves QUEUE row 167 and closes what Dann's walk of lanes 71 and 74 ruled.

## 1. What these lines are for

A singer who calls herself a contralto is told two things, and Ilya owes her both exactly once. The first is the concession: the field has published no resonance values for her type, and she may either let Ilya start from the mezzo-soprano staff or record her own vowels. That belongs at the moment she chooses the name, which is the picker's note, ratified by Dann 2026-11-19 18:36 (`OPEN.md`, "ROW 167: THE CONCESSION IS MADE AT THE MOMENT OF CHOICE"). The second is the state of her profile: which staff Ilya is using until she records. That is the VOICE pane's sentence at rest.

Lane 74 made the pane say both. Dann walked it on 2026-11-19 at 22:42 and ruled, transcribed as written: *"Yes it reads a s asstutter, and yes please cut the pane sentence, not the note."* The two open with the same clause word for word and sit on one phone screen, which the desk confirmed in a browser on `c8ced58f`. So the reason lives in the note, on MELODY, and on INSIGHTS, and the pane returns to naming the staff.

The second line this lane serves is the wizard's Begin. A singer who has just chosen contralto reads the note and then needs the next action. With the note on the screen, Begin needs a window 765 px tall in English and 828 in French (`review-fable-lane74-as-built_r1_2026-11-19.md`, section 4 step 4), and an iPhone in Safari shows less. She has to hunt for the button that starts the thing she came to do.

## 2. Item 1: the VOICE pane's borrowing sentence comes out

All of this is in `apps/web/src/lib/components/Drawer/voice-pane.ts`, read 2026-11-19 22:5x at `ce9abfc9`.

- `borrowingSentence` (`:39-45`) and `borrowingFor` (`:47-49`) go, with their comments.
- In `paneSentence`'s `below-core` branch (`:75-79`), the call at `:77` and the prefix go: every type reads `belowCoreText('calib.pane.belowCore', i.core, language)` alone.
- In its `typed-generic` branch (`:86-92`), the call at `:88`, the test at `:89`, and the comment at `:87` go: every Tier 1 type with a placeholder profile reads `calib.pane.typedGeneric` filled with `borrowedStaffLabel` at `:91`, which is what the five published types read today.
- `isBorrowingType` is then imported and unused in this file. Remove the import, or gate 3 moves off its baseline. Check each other import of this file for the same.
- The file's header comment (`:1-38`) describes the sentence states. Any sentence of it that describes the borrowing line is repaired in the same commit, not left for a later reader.

**What does not change.** `analysis/placeholder-line.ts:108-118` and its callers on MELODY and INSIGHTS keep the borrowing line exactly as built. Both pickers keep the note. `calib.pane.typedGeneric`, `calib.pane.belowCore`, `calib.pane.notSure`, `calib.pane.none`, and `placeholder.borrowing` keep their text, and no string is added, removed, or retranslated by this lane.

### Tests, all in `components/Drawer/voice-pane.test.ts`

- `:184`, "nothing sampled: the three read the borrowing line, the five keep 'generic values', exactly": the three now read the same sentence as the five. Keep it exact, keep both languages, and keep the `EIGHT` list; the `BORROW_EN` and `BORROW_FR` branch goes, and the assertion that no sentence contains "The field has not yet published" now runs for all eight.
- `:200`, "three stable core vowels": every one of the eight reads `BELOW3_EN` and `BELOW3_FR` alone. Keep the no-double-space and no-newline assertions.
- `:220` and `:228`: both already assert that no borrowing line appears. Widen them to all eight Tier 1 ids plus `not-sure`, `undefined`, and `castrato`, so the pane can never grow one again.
- `:236`, "the pane takes the same words as the ratified line on the pages": this test pins what is being cut. It goes, and a test takes its place asserting that the pane's sentence for a contralto, a countertenor, and a bass-baritone does NOT contain the words of `placeholder.borrowing`, in both languages, with nothing sampled and with three core vowels.
- The comments at `:11`, `:27`, and `:93` describe the old behaviour. Repair each.
- `stand-in-borrowing.test.ts` tests MELODY's and INSIGHTS' panes, not this one, and is not touched. If any assertion there reads `components/Drawer/`, stop and report rather than editing it.

## 3. Item 2: the empty live region costs every singer a flex gap

Fable measured 4.8 px at 390 px wide in the wizard, and at 390 by 700 it is what makes the body scroll at all. Both pickers keep an empty `<div class="vt-note" aria-live="polite">` in the page, and both fieldsets are flex columns with `gap: 0.3rem`: `voice/VoiceTypeFirst.svelte:39-41` and `voice/VoiceTypeIntake.svelte:81-83`, read at `ce9abfc9`. Add to the `<style>` block of each:

```css
	.vt-note:empty {
		margin-top: -0.3rem;
	}
```

The region stays in the page, so the announcement pattern is untouched. Verify by reading Begin's bottom edge for a tenor at 390 by 844 in English with no note: 626.6 px means it worked.

## 4. Item 3: Begin stays in reach on a short phone

**Done when:** on the wizard's welcome screen at 390 by 667, with contralto chosen, in English and in French, the whole of Begin is on screen without the singer scrolling, and nothing of the note is cut off from being readable by scrolling. The same holds at 375 by 667 and 360 by 640.

The guard this restores is already written at `voice/VoiceTypeFirst.svelte:45-46`, which says the two-column grid exists so the nine choices do not push Begin off a phone screen. It stopped holding before lane 74: Begin needed 683 px in English and 746 in French even then.

The mechanism is yours. The desk's suggestion, not a requirement: keep the wizard's primary action in view at the foot of `.wizard-body` (`voice/CalibrationWizard.svelte:788`, with the button at `:810`) rather than letting it flow past the fold. If that harms any other phase of the wizard, say so in the report and take the smallest change that meets the done-when instead.

Read every phase of the wizard before you change the button's placement, and name in the report each phase you rendered.

## 5. Item 4: one kept browser test

Fable asked for it and the desk rules it in: one Playwright case, kept in the tree, that renders a contralto with a score on MELODY and on INSIGHTS, in English and in French, and asserts the borrowing line is on both pages. No kept test renders either page for a borrowing type today (`review-fable-lane71-voice-type-as-built_r1_2026-11-19.md`, section 6).

## 6. This brief changes no computation

No number Ilya computes moves, so the rule of `CONTRACT.md` section 4 on naming every site that computes the same number does not apply here. Say so in your report if you find otherwise, and stop.

## 7. Gates

All eight at baseline, from `~/Downloads/ilya-ship.sh:90-92`, `:182-184`, `:188-190`, read 2026-11-19 23:0x:

| gate | baseline |
| --- | --- |
| 1 phonology | `462 passed (462)` |
| 2 dictionary | `248 passed (248)` |
| 3 web-check | `found 0 errors and 12 warnings in 5 files` |
| 4 web-test | `6743 passed | 1 skipped (6744)` with numpy and scipy, `6739 passed | 5 skipped (6744)` without |
| 5 score-parser | `904 passed | 5 skipped (909)` |
| 6 blurb | `178 passed (178)` |
| 7 integration | `159 passed (159)` |
| 8 ratchets | `ratchets: OK.` |

Gate 4 moves by this lane's own arithmetic: say in the report how many tests you added and removed and what the new figure is. None of the files this lane touches is in `scripts/ratchets.json`.

Two phone tests are known to fail on an untouched tree and are not yours: `e2e-phone/insights-links.test.ts:32` and `e2e-phone/voice-stations.test.ts:62`, both sub-pixel. `e2e/time-signature-card.test.ts` hangs under load and passes on an idle machine.

## 8. What you could not establish

**NOT ESTABLISHED beats a complete invented answer.**

Report, do not guess: anything the done-when of item 3 cannot be met without changing a string or a ratified sentence; any phase of the wizard the button change harms; whether a screen reader announces the picker's note, which nobody has run; and any assertion you find pinning the pane's borrowing sentence outside the files named here.

## 9. One commit per item, one report per item

Four commits, four reports in `docs/sessions/`, named `report-code-lane75-item<n>_r1_2026-11-19.md`. Write nothing under `docs/memory/`.
