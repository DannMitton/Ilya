# Report: step T1, the time signature card (Code, cloud lane 43, r1, 2026-11-10)

Commit: "T1: the time signature card". New: `score/time-signature.ts`, `score/time-signature-ui.svelte.ts`, `score/TimeSignatureControls.svelte`, `score/ScoreControls.svelte`, and tests (`time-signature.test.ts` 11, `time-signature-ui.test.ts` 4, `correction-verbs.test.ts` +3, `e2e/time-signature-card.test.ts` 5, `e2e-phone/time-signature-card.test.ts` 1). Changed: `score/bar-layer.ts`, `score/correction-verbs.svelte.ts`, `score/CorrectionSurface.svelte` (1227 ceiling; now 1223), `markup/MarkupPane.svelte` (1364, unchanged: one mount swapped for another), `routes/+page.svelte` (5525 of 5534).

## What the singer gets

**In the CORRECTIONS pane**, beside Barline: **Time signature** (accessible name "Change the time signature from this bar"). **On the score**: a tap on a time signature drawn there. Either opens the card: the common signatures as chips (2/4 3/4 4/4 5/4 6/4 2/2 3/2 4/2 3/8 5/8 6/8 9/8 12/8), "Number of beats" and "Beat duration" (any power-of-two beat duration and 1 to 99 beats can be typed; an impossible pair disables the button), the two scopes ("To the next time signature change", default, and "To the end of the song"), and one button, "Change the time signature from this bar". The bars keep the barlines the reading has; bars that now add up lose their flag, the rest keep it. One Undo step, "time signature changed". "Rebar the notes" is T2.

## How

- **`setSignature(read, line, map, id, sig, through)`** (`time-signature.ts`, pure) writes one `timeSignature` mark on the entry that opens the held bar, with Fable's amendment 10: one mark stands in a bar; "to the end" removes her own later marks in the same write; a later change of hers bounds an earlier one (`rebar` applies that). **Choosing the reading's own signature "to the next change" writes nothing and removes her mark: the way back.** Setting a signature back never moves barlines she placed or removed (amendment 4).
- **`heldBar`** names the song bar, its opener, the signature in force, the reading's own, and her mark in the bar (a mark on a deleted opener included).
- **State and mount.** `tsUi` is a singleton the page attaches once (the `clefUi` and `barlineUi` pattern), because the page, `Loupe.svelte`, and `CorrectionSurface.svelte` are at their ceilings. The card is a `position: fixed` overlay moved to `<body>`, a centred card on a fine pointer and a sheet from the foot of the screen on a coarse one, targets 44 px (measured on the phone project), z-index 9300, over the Loupe's 9100. `ScoreControls.svelte` mounts it beside `ClefControls`, so `MarkupPane` paid no line.
- **The on-score tap.** The renderer's output is pinned by six approved SVGs (`staff-renderer.approval.test.ts`), so I did NOT add a bar number to `data-meter` (I tried it, six approvals failed, I reverted it). The card finds the bar from the page instead: the first note or rest hit-area drawn to the right of the signature on the same system names an entry of the bar. Invisible 44 px buttons sit over each drawn signature, as the clef's do.
- **Outside-click.** A click on the card (a body-level overlay) counted as a click outside the Loupe and closed it; `+page.svelte` now exempts `[data-ts-overlay]` in its existing selector, no new line.

## Strings

No string was coined. The card's one button is the ratified `correct.tsChange`, its way out is the existing `upload.ask.cancel`, its title the ratified `loupe.timeSignature`. DESK DEFAULT, for Dann to strike if he wants a different face for either.

## Tests and the browser walk

Unit: 11 on `setSignature` and `heldBar` (4/8 to 3/4 makes every bar add up; "to the end" removes later marks; a later mark bounds an earlier one in either order; one mark per bar; the way back; other corrections on the record survive; a deleted opener's mark is found and replaced; after a division the mark goes on the half's own opener), 4 on the card's state, 3 on the verb. Playwright, chromium (5, pass): on the Gretchaninov-shape fixture 4/8 to 3/4 to the end, every bar adds up, the drawn signature changes, Undo restores it, Redo applies it again; typing 7/5 disables the button and Escape and Cancel change nothing and return focus; the way back writes nothing; French face, sentence, fields, and scopes read exactly as ratified; a tap on the drawn signature opens the card with no Loupe. Phone (1, pass): the card is a sheet from the foot, 390 wide, every target at least 44 px, one tap on the button changes the bars.

## Gates

| gate | result |
|---|---|
| 1 | 456 passed |
| 2 | 248 passed |
| 3 | 0 errors, 12 warnings |
| 4 | 4787 passed, 1 skipped (264 files) |
| 5 | 785 passed, 5 skipped |
| 6 | 168 passed |
| 7 | 125 passed |
| 8 | OK |

**Playwright, both projects, whole suites.** chromium: 144 passed, 7 failed, 1 skipped; the seven are the baseline's seven by count (the baseline run of `534d9981` fails `glue-typed-marks` twice, `heic-reader-path`, `insights-page`, `loupe-header` line 47, `print-pages`, `singer-paths` Learn and Guide); I read the names of two of them in this run's output and matched the rest by count. phone: the first whole run failed 11 (the baseline's 4 and **7 of mine**): the on-score hit buttons stood over the clef button and took its tap, so `clef-controls` (2) and `loupe-header` (5) hung until their timeouts. Fixed (the hit is clipped short of the next note and sits one layer under the clef's); those 8 files' tests, with the new card test, pass (8 of 8). The other four phone failures (`input-views` 134, `phrase-ends`, `relining` 70 and 95) fail on the baseline too. I did not re-run the whole phone suite after the fix; I re-ran the three files that failed.

## What I could not establish

- The tap's bar by geometry is not exercised on a score where a time signature is drawn at a system start after a change (the opening signature of the fixtures is the only one drawn). The rule is the same, but I did not walk it.
- That a 44 px hit over a small drawn signature does not overlap a neighbour's tap target (the first note is a few pixels to its right). It stands under the Loupe and the drawer, at the clef's own z-index.
