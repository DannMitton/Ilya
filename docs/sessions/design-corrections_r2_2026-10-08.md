# Design return: the Loupe's Corrections, round 2 (2026-10-08)

For brief r3 (`docs/sessions/brief-design-corrections_r3_2026-10-08.md`). Read on branch `Shane` at `8f59ba6`, working tree clean apart from the files this return adds. Written by Claude (Opus). No app code is written. Nothing is committed.

- **The drawings:** `design-corrections_r2_2026-10-08.html`, 28 frames: the review path at both sizes, the reference states on a phone. The same 28 as images: `design-corrections_r2_2026-10-08-png/` (`01-paper1-desk.png` to `14-outside-phone.png`).
- **The same drawings on a canvas**, one board per state, with device and state as tweaks on the shared frame: the Artifact "Corrections, round 2" (private until Dann shares it).
- **How they were checked.** Every frame was rendered in headless Chromium and tested for text that overflows its box, any target under 44 px, buttons that overlap, and anything off the frame. All 28 pass. Label widths below are measured in that render, not read from CSS. These are mockups built from the tokens in `apps/web/src/app.css`; the live Loupe was not captured (see Could not establish).

## Which round 1 this builds on

The round 1 return in the tree (`design-corrections_r1_2026-10-08.md` and its 24 drawings) is the one the brief names, and this round builds on it. It is not the round 1 this session drafted; that draft was never placed. Where this return says "round 1" or "D1" to "D18", it means the tree's file.

## The one line per state

What the singer reads first, then what one tap does next.

| # | State | Reads first | One tap next |
|---|---|---|---|
| 01 | The Paper, with the offer | "⚑ Ilya flagged 5 bars to check." | Review opens bar 9 in the Loupe at "1 of 5". |
| 02 | Review, 1 of 5, one act | "⚑ Measure 9 does not add up to its time signature." | "Dot the half note" dots it and clears the flag. |
| 03 | After the act | "✓ Measure 9 now adds up. The flag is cleared." | "Next flag ›" goes to bar 14. |
| 04 | Two candidates | "⚑ Measure 14 does not add up …", with A and B bracketed over the notes | "A: notes 1 to 3" makes those three a triplet. |
| 05 | No offer, Right as read taken | "✓ Right as read. No note changed." | "Next flag ›" goes to bar 31. |
| 06 | Do the same there | "✓ Measure 14 now adds up. The flag is cleared." | "Do the same in m. 22" makes the same triplet there. |
| 07a | 5 of 5 | "⚑ Measure 31 does not add up …" with Done outlined | Done ends the review. |
| 07b | Paper after Done | "⚑ 1 bar is still flagged: m. 31." | Review reopens on bar 31. |
| 08 | Many flags | "Most bars of this scan do not add up (31 of 40) …" | "Not now" puts it away. |
| 09 | Rail states | Four chips side by side, labelled under each | (Reference, no act.) |
| 10a | Greyed button tapped | "Length changes one note at a time. Tap a note above to take it." | Tapping a note of the run takes it, and Length acts. |
| 10b | Open station that cannot act | "Pitch changes a note. Tap the note after this gap, or →." | → takes that note, and Pitch acts. |
| 11 | Tempo at the gap before a note | "Tempo at the gap before A♯3." | "Place here" puts ♩ = 66 at that gap. |
| 12 | Reach row | "Not the voice: this bar, 4 notes." / "Triplet over this beat: notes 1 to 3." | The primary button applies it. |
| 13 | Removal | The footer's first slot: "Remove note", "Remove dynamic", "Remove triplet" | That slot removes the thing in focus. |
| 14 | Flagged bar outside review | "⚑ Measure 9 does not add up …" on the Syllables pill | "Review the 5 flagged bars" starts the review. |

State 05 is drawn after the tap only. Before it, the bar shows the finding and one button, "Right as read"; its line is "⚑ Measure 27 does not add up …", then "Right as read clears the flag."

The states follow the brief's order, not the singer's. In one pass through this song (flags at bars 9, 14, 22, 27, 31), state 06 (2 of 5) comes before state 05 (4 of 5).

## The greying table

The rail as recommended has seven stations (see "Would seven serve"). With eight, Accidental takes Pitch's row exactly. Code builds from this table; the drawings follow it.

| Focus | Not voice | Triplet | Pitch | Length | Tempo | Dynamic | Hairpin |
|---|---|---|---|---|---|---|---|
| A note | ready | ready | ready | ready | ready, at the gap before the note | ready, same | ready, starts at the same gap |
| A caret (a gap) | ready, from the note after the gap | ready, same | **greyed** (1) | ready: enters a note or rest | ready | ready | ready |
| A run | ready, over the run | ready, over the run | **greyed** (2) | **greyed** (3) | ready, at the gap before the run | ready, same | ready, starts at the same gap |
| A mark | ready, from the note after the mark | ready, same | **greyed** (1) | ready: enters a note or rest | ready | ready | ready |
| Nothing | see below | | | | | | |

Reason sentences, each shown in the focus sentence when the open station cannot act, and again on a tap:

1. "Pitch changes a note. Tap the note after this gap, or →."
2. "Pitch changes one note at a time. Tap a note above to take it."
3. "Length changes one note at a time. Tap a note above to take it." The tapped form adds a second line where it helps: "For a run that reads too long, Triplet makes it fit." (drawn, state 10a).

**Nothing in focus.** DESK DEFAULT: when Corrections opens on a bar with nothing taken, it takes the bar's first note, as the review drawings show. Then "nothing" never stands while Corrections is open, and the row needs no greying. The tree's cursor starts empty (`apps/web/src/lib/score/correction-cursor.svelte.ts:40-41`); whether opening the Loupe sets it, I did not trace. If Code keeps an empty focus, the fallback row greys every station except Not voice ("This bar" needs no start), with one reason for all six: "Take a note above, or →." Six greyed chips is the cost the default avoids.

**Could each greyed cell act on the nearest valid focus instead?**

- (1) Pitch at a gap could act on the note after it. Cost: the singer sees a note change that was not in focus, and a gap is also where Length enters a new note, so a Pitch tap there is ambiguous. The tree already greys Pitch at a gap: "the PITCH station's greying" (`apps/web/src/routes/+page.svelte:736-737`). Kept greyed, with → one tap away.
- (2) and (3): Pitch or Length over a run could act on every note of it. Cost: one tap changes notes the singer did not look at one by one, and a uniform length over a run is rarely the repair (12 of the 17 length misreads of the unseen set are at a 3/2 ratio, `report-heldout-blind-read_r1_2026-10-07.md`, which Triplet covers). Kept greyed.

**Controls inside the panel that the tree already greys**, kept as the tree has them:

- Restore: only on a read note that carries a correction (`+page.svelte:1005-1010`). Round 1's drawings showed it ready on uncorrected notes; these do not. Reason on tap: "Restore returns a corrected note to how it was read."
- Remove at a bare gap: nothing stands there. Reason on tap: "Nothing stands at this gap to remove."
- Tie: only where `canTie` allows (`+page.svelte:1108-1111`). Triplet's act: only where a run fits (`+page.svelte:1142-1144`). Their reasons are Code's to word from those conditions; NOT ESTABLISHED here.

**A greyed control still answers.** DESK DEFAULT for Code: `aria-disabled="true"`, never `disabled`, so it stays in the keyboard's focus order and answers a tap; the focus sentence is a polite live region and the greyed control's `aria-describedby`, so its reason reaches a screen reader on focus and on tap.

## The four rail states

Drawn side by side in state 09, each told apart without colour:

| State | Drawn as | Label contrast (measured from tokens) |
|---|---|---|
| Ready | White fill, 1 px stone border, medium weight | ink on white |
| Open | Lavender-desk fill, 2 px lavender-chip border, bold | lavender-ink on lavender-desk, 5.62:1 |
| Greyed | No fill, 1 px dashed border, regular weight | ink-tertiary on paper-light, 5.12:1 |
| Suggested | Paper-light fill, 2 px rose-chip border, semibold, ⚑ before the label | rose-ink on paper-light, 7.73:1 |

An open station that cannot act is filled and dashed: lavender-ink on lavender-wash, 7.05:1. The four differ by fill, border style, weight, and the flag glyph, so none depends on hue.

## Decisions, each with its cost

**1. The rail never moves.** Seven stations in one place at both sizes, review included. No state changes the open station on its own: state 02 keeps Pitch open on a bar whose act is a dot. *Cost:* the singer may land on a bar with the "wrong" station open. The suggested highlight and the offer row carry the way out, so no tap on the rail is needed to act.

**2. Marks act at the gap before the note in focus** (brief item 3, drawn in state 11). Tempo, Dynamic, and Hairpin are ready with a note in focus; the focus sentence names the gap ("Tempo at the gap before A♯3."). *Cost:* a mark meant for the gap after a note needs → first. I found nothing against the desk's default.

**3. Fewer greyed cells than round 1.** Round 1's drawing 03 greys four of eight at a caret. This table greys one: Not voice and Triplet start from the note after the gap. *Cost:* a run that starts at a gap starts at the next note, which is the only note it could start at.

**4. The focus is said once.** The Loupe's top line names it ("D3 · beat 1 · Half"; at a gap, "Gap before A♯3 · beat 3"). The focus sentence carries one message, in the brief's order: the answer to a tap, then the offer, then what the open station will do. It fits two lines in 246 px on a phone (the sentence sits between ← and →). *Cost:* the sentence loses 96 px to the step buttons.

**5. The readout line is shortened** (brief item 11). The brief kept round 1's "Dynamics are kept and drawn. They do not yet change any readout." It overflows the second line at 246 px when the first line names the mark. Drawn instead: "Kept and drawn. No readout uses it yet.", for Tempo (state 11) and Dynamic (state 13). *Cost:* this departs from a DESK DEFAULT, and the word "Dynamics" goes, since the first line names the mark. The desk rules on it.

**6. The flagged bar.** The finding sits in the top line in the tree's words, "Measure 9 does not add up to its time signature." (`apps/web/src/lib/i18n.ts:1681-1682`, without the clause about counting). The offer row sits under the focus sentence and is reserved on every bar, so the detail rows never move. One act is one rose-outlined button; two candidates are two buttons with A and B bracketed over their notes before either is applied; no offer leaves the finding and "Right as read". The station that holds the manual controls carries the suggested state only when the check names it (Length in 02, Triplet in 04). *Cost:* the reserved row is empty space on an unflagged bar, 50 px of the panel.

**7. The review strip.** "‹ Previous flag", "x of y", "Next flag ›", and Done sit in a layer under the Loupe, never printed (contract section 6, `docs/memory/CONTRACT.md:725-731`). The flag steps use ‹ › and the word "flag"; the note steps use ← → and live in the focus row, so they cannot be taken for each other. Previous is greyed at 1, Next at the last, and Done takes the outlined style at the last. *Cost:* the strip covers 66 px of the Paper under the card.

**8. Nothing advances on its own.** After an act the bar redraws, the top line says the flag is cleared, the sentence says what changed, and the singer taps Next. *Cost:* one tap per bar that an auto-advance would save.

**9. "Do the same there" as one offer.** After the first alike bar, one button names the bar ("Do the same in m. 22"), with "Measure 22 has the same shape." under the result. For more than two bars: "Do the same in {n} bars", with the bars named in the sentence. Those bars stay in the review, marked changed; one Undo reverses the lot ("Undo: same in 1 bar", state 07a). *Cost:* the singer changes bars before looking at them, and looks after. I did not draw every bar of a group at 390 px: the music window is 110 px tall, so the panel holds about three bars without scrolling, and a group of more cannot fit. I would ship the one-offer form.

**10. The end.** At 5 of 5 Done is outlined. After Done the offer line names what remains, once ("⚑ 1 bar is still flagged: m. 31."), with Review and Not now; with every flag cleared it is gone. The flags on the Paper stay until cleared. Put away with "Not now", the review is found again by any flag on the Paper or by the link in the Loupe's top line (state 14).

**11. Many flags.** No flag on the Paper; one sentence about the scan with "Review all 31" and "Not now". The figures (31 of 40) are an example; the threshold is Code's and the desk's. *Cost:* the singer loses the bar-by-bar map on a poor scan; the sentence offers it on request.

**12. Outside the review** (state 14). A flagged bar opened from the Paper opens on Syllables, as always, with the finding in the top line and "Review the 5 flagged bars" under it (44 px tall). The note in the panel of that drawing ("The Loupe opens on Syllables …") is an annotation, not app copy.

**13. Fixed slots inside the detail rows.**

- *Reach chips* in one order in every station: This beat · This bar · From here to…. Round 1's "To end of system" is not drawn, because whether the Loupe knows a system's end is open with Code (D3). If it survives, it needs a fourth slot; a fourth chip leaves about 82 px, and I did not measure the label against that.
- *Removal* has one home: the footer's first slot, named "Remove {thing}" ("Remove note", "Remove 4 notes", "Remove dynamic", "Remove tempo", "Remove triplet"). The tree's visible word today is "Delete" (`i18n.ts:506`), and its accessible name is "Remove this note" (`i18n.ts:333`); its undo already says "note removed" (`i18n.ts:450`). *Cost:* a visible label changes from "Delete" to "Remove note".
- *Restore* is the second slot; the station's own act (Pitch "● Carries in bar", Tempo "Move here", Hairpin "Move end here") is the third.
- *← and →* are drawn in every Corrections state, in the focus row, with the tree's names "Previous note" and "Next note" (`CorrectionSurface.svelte:495-509`).

**14. Pitch follows Dann's ruling of 2026-09-17 in order, not in layout.** The ruling: "the PITCH station's grid of six reads column by distance (semitone, step, octave) and row by direction" (`i18n.ts:510-512`). These drawings keep semitone before step before octave, but in one row, so direction alternates inside each pair. On the phone the octave cells are gone (see the next section). **This reverses part of a ruling, and it is Dann's to accept or refuse.**

## Would seven serve

Yes, at one cost Dann has to weigh.

- **Rows by meaning.** Row 1 repairs the reading: Not voice, Triplet, Pitch, Length. Row 2 marks the performance: Tempo, Dynamic, Hairpin. The desk groups the same seven 2 | 2 | 3: repair a run, repair a note, mark the performance.
- **Accidental joins Pitch.** The accidentals become Pitch's first row of five.
- **The evidence is against ranking Pitch last.** Of the 8 pitch misreads on the unseen set, 6 are two semitones and 2 are one (`report-heldout-blind-read_r1_2026-10-07.md`). Pitch repairs these directly, so it is a station the reader needs.
- **The cost.** With the accidentals in Pitch's first row, the phone's second row holds four cells, and the octave pair goes. That is the reversal in decision 14.
- **Eight stations, rows by meaning, measured.** Five repairs over three marks does not fit at 13 px: "Accidental" is 57.4 px against 54 px inside its chip. At 12 px it fits with about 1 px spare, which leaves nothing for French. Round 1's 4 over 4 fits, but splits Pitch from Length across the rows.
- **Keeping the octave pair.** Eight stations would keep it, with Accidental as its own station and the grid of six intact.

**Not voice and row 49.** The piano-is-not-the-voice report takes extra notes from 38 to 0 (Grechaninov) and from 22 to 1 (Varlamov). The one remaining Varlamov extra is a voice misread in bar 16, and the other six unseen songs are unchanged (`report-code-piano-is-not-the-voice_r1_2026-10-08.md`). By the brief's own reasoning, Not voice's rank is now open. It keeps its place in these drawings. The rail is one ordered list per size in the drawing code, so a new order costs nothing to draw. The desk can now send the order.

## The longest chip label, and the spare

Measured in the render, at 13 px, with 6 px of padding at each side.

| Label (state) | Label width | Room inside the chip | Spare |
|---|---|---|---|
| "⚑ Length" (suggested, semibold) | 53.2 px | 67 px | 13.8 px |
| "Not voice" (open, bold) | 51.9 px | 67 px | 15.1 px |
| "Not voice" (ready, medium) | 51.2 px | 69 px | 17.8 px |

The phone and the desk give the chips the same room (about 82 to 83 px wide), so these figures hold at both sizes. The binding case is a suggested label, because the flag adds about 15 px. **Not drawn and worth knowing:** "⚑ Not voice", if a check ever suggests it, comes to about 67 px against 67 px, with nothing spare. That estimate is the flag's measured width plus the label's; it was not rendered. If it occurs, cutting the chip's padding to 4 px gives 4 px back. For French, the test is each label plus the flag within 67 px at 13 px semibold.

## Where each addition lives on the phone

The panel runs from the top of the rail to the bottom of the footer.

| Addition | Where | What it displaced |
|---|---|---|
| ← and → | The focus row, either side of the sentence | 96 px of the sentence's width; no height |
| The offer row and "Right as read" | A reserved 44 px row under the focus sentence | 50 px of panel height |
| The finding | The Loupe's top line, under the focus name | Height above the music, not the panel |
| The review strip | A layer under the card, 10 px below it | 66 px of the Paper below the Loupe |
| The octave pair | Gone from the phone (decision 14) | |

**The panel's height.** The additions do not fit 316 px. The fixed height that holds them is **344 px on the phone** and **296 px on the desk** (round 1: 268 px). The whole Loupe card is 664 px tall on the phone. With the review strip it ends 786 px down a 844 px screen, so nothing scrolls. No target in the 28 frames is under 44 px.

## New English labels

Coined in this round unless marked. "Right as read" and "Now a triplet. The measure adds up." are the desk's. "dot added" and "tuplet defined" are the tree's (`i18n.ts:451`, `i18n.ts:587`).

- **Offer and Paper:**
  - "⚑ Ilya flagged 5 bars to check." · Review · Not now
  - "⚑ 1 bar is still flagged: m. 31."
  - "Most bars of this scan do not add up (31 of 40), so Ilya has not flagged them one by one. A clearer scan may read better." · Review all 31
- **Review strip:** ‹ Previous flag · {x} of {y} · Next flag › · Done
- **The link outside review:** Review the {n} flagged bars
- **Offers:**
  - Dot the half note
  - A: notes 1 to 3 · B: notes 3 to 5
  - Right as read
  - Do the same in m. {x} · Do the same in {n} bars
- **Top line:**
  - m. {x} · flagged · m. {x} · cleared
  - "✓ Measure {x} now adds up. The flag is cleared."
  - "✓ Right as read. No note changed."
- **Focus sentences:**
  - "Ilya found one note that would make the bar add up: the half note, dotted."
  - "Two triplets would make it add up. A and B above show their notes."
  - "Dotted half note. The measure adds up." · "Next flag › when you are ready."
  - "Flag cleared. The notes stay as read."
  - "Measure {x} has the same shape."
  - "The last flagged bar. Two triplets would make it add up."
  - "Tempo at the gap before {pitch}." · "Your mezzo forte at the gap before {pitch}."
  - "Kept and drawn. No readout uses it yet."
  - "Not the voice: this bar, {n} notes." · "Rests keep the bar its length."
  - "Triplet over this beat: notes 1 to 3." · "{pitch} is inside a triplet, notes 1 to 3."
  - The reason sentences in the greying table, and "Take a note above, or →."
- **Detail rows and footer:**
  - This beat
  - Rests in their place · Triplet over these {n} notes · Other…
  - Remove note · Remove {n} notes · Remove dynamic · Remove tempo · Remove triplet · Remove
  - Carries in bar
- **Undo pills:** Undo: right as read · Undo: same in {n} bars · Undo: tempo placed · Undo: dynamic placed

"Ilya flagged" and "Ilya found" name the app in the third person, as the brief's own example does. They are not first person, but Dann may still want them agentless.

## Could not establish

- **The live Loupe.** Not captured. Every figure here is measured in these mockups, not in the app.
- **When the Loupe takes a note on opening.** The cursor starts empty (`correction-cursor.svelte.ts:40-41`); I did not trace whether opening sets it. The "nothing" row depends on it.
- **What each check can name** (one act, candidates, or none). Open with Code. The drawn offers assume a dot check and `triplets.ts`'s two-fit case.
- **Which bars count as the same shape**, and whether "Right as read" and a put-away offer are stored with the song. Open with Code.
- **Whether D17's letters collide.** The desk's key hint draws V T P L · M D H. Open with Code (brief, "Open with Code").
- **The many-flags threshold.** Not set here.
- **"To end of system".** Its fit in a fourth Reach slot is not measured.
- **French.** Not written. The spare widths above are the test.
- **Restore's, Tie's, and the triplet act's reason wording.** Left to Code, from the tree's own conditions.
