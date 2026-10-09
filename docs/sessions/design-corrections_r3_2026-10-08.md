# Design return: the Loupe's Corrections, round 3 (2026-10-08)

For brief r4 of 2026-10-08, which arrived as an attachment and is not in the tree. Code was read on branch `Shane` at `6b7c3de` (`origin/Shane`), by `git show`, so the working tree was not touched. Written by Claude (Opus). No app code is written. Nothing is committed.

- **The drawings:** `design-corrections_r3_2026-10-08.html`, 72 frames, each state in English and in French. The review path and the scan strip are drawn at both sizes, and the reference states on a phone.
- **The same as images:** `design-corrections_r3_2026-10-08-png/`, named `{section}-{state}-{device}-{language}.png`, for example `02-rev1-phone-fr.png`.
- **How they were checked.** Every frame was rendered in headless Chromium and tested for overflowing text, any target under 44 px, overlapping buttons, and anything off the frame. All 72 pass. Every width below is measured in that render.
- **Weights changed from round 2.** The app loads Source Sans 3 at 400 and 600 only (`apps/web/src/app.html:17`). Round 2 drew 500 and 700, which the app cannot show. These drawings use 400 and 600.
- **No canvas this round.** The brief asks for HTML and images.

## The one line per state

What the singer reads first, then what one tap does next. The English is shown; the French frames carry the same strings in French.

| § | State | Reads first | One tap next |
|---|---|---|---|
| 01 | The Paper with the line | "⚑ 5 bars may not match your score." | Compare opens bar 9 at "1 of 5". |
| 02 | One act | "⚑ Measure 9 reads as only 3 beats in 4/4." | "Dot the half note" dots it. |
| 03 | The result | "✓ Half note dotted." | "Next bar ›" goes to bar 14. |
| 04 | Two candidates | "⚑ Measure 14 reads as 3½ beats in 3/4.", with A and B bracketed | "A: notes 1 to 3" makes those three a triplet. |
| 05a | No offer | "⚑ Measure 27 reads as only 3 beats in 4/4." | "Matches my score" keeps it as printed. |
| 05b | Kept | "✓ Kept as printed." | "Next bar ›" goes to bar 31. |
| 06 | Same in m. 22 | "Triplet over this beat: notes 1 to 3." | "Same in m. 22" makes the same triplet there. |
| 07a | The last bar | "The last bar to compare.", with Done outlined | Done ends the review. |
| 07b | After Done | "⚑ 1 bar left to compare: m. 31." | Compare reopens bar 31. |
| 08 | Most of the scan unclear | "Ilya could not read most of this scan clearly (31 of 40 bars) …" | "Not now" puts it away. |
| 09 | The scan strip | The printed bar, above Ilya's reading of it | The same as 02 and 04. |
| 11a | A greyed button tapped | "Length works on one note. For a triplet, use Tuplet." | "Triplet over these 3 notes" makes the run a triplet. |
| 11b | An open station that cannot act | "Pitch works on one note. Tap a note, or →." | → takes A♯3, and Pitch acts. |
| 12 | Tempo from a note | "Tempo at A♯3." | "Place here" puts ♩ = 66 there. |
| 13 | The Tuplet reach | "Triplet over this beat: notes 1 to 3." | "Triplet over these 3 notes" applies it. |
| 14a | Remove, armed | "Remove 2 notes", filled, with the reach above it | The button removes notes 3 and 4. |
| 14b, 14c | After the removal | The bar with rests, or the bar short | Undo restores both notes. |
| 14d | Removing a mark | "Your *mf* at A♯3." | "Remove dynamic" removes it. |
| 14e | Removing a triplet | "E3 is inside a triplet, notes 1 to 3." | "Remove triplet" removes the triplet; the notes stay. |
| 15 | Outside the review | "⚑ Measure 9 reads as only 3 beats in 4/4." on Syllables | "Compare 5 bars with your score" starts the review. |

05a has no focus sentence: the brief has no string for a bar with no offer, and the finding and the button carry it.

## The greying table, six stations

Code builds from this table, and the drawings follow it. "Ready" means the station acts on the focus or, for the three marks, at the note's own place (the caret before it, as round 2 drew).

| Focus | Tuplet | Pitch | Length | Tempo | Dynamic | Hairpin |
|---|---|---|---|---|---|---|
| A note | ready, from the note | ready | ready | ready, at the note | ready, at the note | ready, starts at the note |
| A caret | ready, from the note after it | **greyed** (1) | ready: enters a note or rest | ready | ready | ready |
| A run | ready, over the run | **greyed** (2) | **greyed** (3) | ready, at the run's first note | ready, same | ready, starts there |
| A mark | ready, from the note after it | **greyed** (1) | ready: enters a note or rest | ready | ready | ready |

Reasons, as worded in the brief:

1. "Pitch works on one note. Tap a note, or →." The tree already greys Pitch at a gap (`+page.svelte:736-737`, read in round 2).
2. "Pitch works on one note. Tap one of these notes."
3. "Length works on one note. For a triplet, use Tuplet." (drawn tapped, state 11a)

**Nothing in focus never stands, so the table needs no row for it.** Opening the Loupe sets the cursor to the tapped note (`apps/web/src/routes/+page.svelte:1756-1757` at `6b7c3de`). The Loupe closes when the cursor is empty (`:1812`). This settles round 2's open item. "Tap a note, or →." stays as the reason for any future case of an empty focus.

**Footer controls** keep the tree's conditions:

- Restore is live only on a corrected read note (`+page.svelte:1005-1010`, read in round 2). Its reason: "Restore puts a corrected note back as Ilya read it."
- Remove at a bare caret has nothing to act on. Its reason: "Nothing to remove here."

**A greyed control still answers.** As in round 2: `aria-disabled`, never `disabled`; the focus sentence is its description and a polite live region.

## Decisions, each with its cost

**1. The Paper line at 390 px** (§01, §07b). Both languages wrap to two lines in a 194 px column beside the two buttons, and the card keeps its 56 px height. The French takes two full lines; the English leaves "score." alone on its second line.
- *Cost:* the narrow column, and little spare in the buttons: "Plus tard" has 5.6 px and "Comparer" 14.4 px. A longer French verb would push the buttons onto a second row and add 48 px to the card.

**2. The rail of six: three over three on the phone** (§10). The rows mean what the desk's groups mean: Tuplet, Pitch, Length over Tempo, Dynamic, Hairpin. The desk keeps one row grouped 1 | 2 | 3 (repair a run, repair a note, mark the performance), with the octave pair in Pitch.
- *Cost:* one row of six does not fit at 390 px. Its chips leave 37.7 px inside, and four labels overrun that: Dynamic by 11.2 px, Hauteur by 8.0, Soufflet by 6.5, and Nuance by 4.3.
- **Recommendation: three over three.**

**3. The mark.** JUDGEMENT throughout.
- *The Paper and the top line:* ⚑ still reads as "look here", which is what "to compare" asks. It is kept on both.
- *The suggested chip:* ⚑ is dropped there. A suggested station is not a thing to confirm. The flag made the station itself look questioned, and it cost about 15 px of every label.
- *What replaces it:* a dot in the chip's top-right corner, 7 px across, in rose-chip. The suggested state still differs from open without colour: open is filled, and suggested is unfilled with a dot. The dot sits above the label's line, so it costs no width.

**4. Removal in its one home, with a reach** (§14a). The first tap on "Remove note" arms it. The button fills, and the reserved offer row shows the same three reach chips Tuplet uses, in the same order: This beat · This bar · From here to…. The button counts as the reach changes ("Remove 2 notes"). A second tap removes the notes, and one Undo restores them ("Undo: 2 notes removed").
- *Cost:* two taps to remove one note where the tree takes one (`+page.svelte:991-992`, per the code-questions memo, section 2).
- *Cost:* on a bar where an offer stands, arming takes the offer row until the singer removes or taps elsewhere. That state is not drawn.
- *Dropped:* the brief's "this note" chip. The armed button already names it ("Remove note"), and the chip would need a new string.
- *Code:* today a removal is one record and one Undo step per note (memo, section 2). Tuplet's single Undo for a run (`+page.svelte:1131-1135`, per the memo) is the pattern to copy.

**5. After a run is removed: rests in the notes' places** (§14b against §14c).
- *Why rests:* a printed vocal line shows a rest wherever the voice is silent, so a singer comparing with the page expects rests. With nothing in their place, the bar reads short, and Ilya shows a bar the score does not have. This follows Dann's 15:50 ruling: the page is the authority.
- *Cost:* where the removed notes were extras inside a bar that was already full, rests make the bar too long, and the singer then has to remove the rests. Which case is more common is NOT ESTABLISHED.
- *Focus after removal:* the note before the run (DESK DEFAULT).
- *Round 2's label:* "Rests keep the bar its length." is not drawn; the rests say it.

**6. The footer in French** (§14d). Every French remove label overruns the 97 px slot, so each wraps to two lines in 44 px:

| Label | Width | Over |
|---|---|---|
| Supprimer la note | 97.6 px | 0.6 px |
| Supprimer 3 notes | 99.6 px | 2.6 px |
| Supprimer 2 notes | 102.3 px | 5.3 px |
| Supprimer le triolet | 106.0 px | 9.0 px |
| Supprimer le tempo | 108.6 px | 11.6 px |
| Supprimer la nuance | 112.9 px | 15.9 px |

« Supprimer » alone is 57.9 px, with 39.1 spare; the fallback is drawn beside the full form.
- **Recommendation: the full name in two lines.** It says what goes. In the fallback, the name sits only in the top line and the focus sentence. JUDGEMENT; the choice is Dann's.

**7. The scan strip** (§09; not ruled; the desk's proposal).
- *Where:* inside the Loupe's music window, above Ilya's reading of the same bar, so the eye moves straight down between the two. It is a crop of the scanned page around the bar's notes, from each note's `imgpos` (`apps/web/src/lib/omr/join-pages.ts:21-24`). The crops drawn are stand-ins, labelled as such.
- *What it displaced:* the window grows by 58 px on the phone and 76 px at the desk. The panel and its rows do not move.
- *Phone cost:* the card and the review strip move down. With the strip, the review strip ends 2 px above the bottom of an 844 px screen, which leaves no margin for a home indicator.
- *Desk cost:* the review strip still ends 126 px above the bottom.
- *A wide bar* (§09b): the crop keeps its proportions, shrinks to the window's width, and centres in the band. It is drawn at 62 percent of the band's height. Below some size a printed bar is unreadable. A floor at about 4 px of staff space is JUDGEMENT, not measured. Past it, the crop could show the part around the note in focus; that is not drawn.
- *Without it:* §02 and §04 are the same bars, so the two forms compare directly.
- **Recommendation: the strip in the review only.** It makes the comparison the brief describes possible without the paper score. JUDGEMENT on the value. The limits are under Could not establish.

**8. Weights.** Ready labels at 400 and open, suggested, and primary labels at 600, the two the app loads. The greyed state differs from ready by its dashed border and ink-tertiary label (5.12:1 on paper-light), so the shared weight costs no distinction.

## French label widths, measured in the render

Measured at 13 px, semibold (600) unless the row says otherwise. Room is the inside of the chip after padding and border.

| Label (EN / FR) | EN | FR | FR with ⚑ (the 67 px test) | Spare, phone 3/3 (95.3 px) | Spare, desk (82.7 px) |
|---|---|---|---|---|---|
| Tuplet / Nolet | 35.8 | 30.4 | 44.6, 22.4 spare | 64.9 | 52.3 |
| Pitch / Hauteur | 28.7 | 45.7 | 60.0, 7.0 spare | 49.6 | 37.0 |
| Length / Durée | 38.9 | 33.3 | 47.5, 19.5 spare | 62.0 | 49.4 |
| Tempo / Tempo | 38.2 | 38.2 | 52.5, 14.5 spare | 57.1 | 44.5 |
| Dynamic / Nuance | 48.9 | 42.0 | 56.3, 10.7 spare | 53.3 | 40.7 |
| Hairpin / Soufflet | 41.6 | 44.2 | 58.4, 8.6 spare | 51.1 | 38.5 |

Every label passes the 67 px test with ⚑, the tightest being Hauteur at 7.0 px spare (in English, Dynamic at 3.8). With the dot in place of ⚑ (decision 3), the flag's width no longer applies.

**Other French labels in the render, phone,** where spare is under 15 px or a label wraps:
- *Review strip:* "‹ Mesure précédente" wraps to two lines (7.1 px over 94). "Mesure suivante ›" has 3.4 px spare, and "Terminé" 3.4.
- *Paper line buttons:* "Comparer" has 14.4 px spare, and "Plus tard" 5.6.
- *Offers:* "Correspond à ma partition" fits on one line beside one act (12.0 spare) and wraps to two among three.
- *Undo:* « Annuler : conservée telle qu’imprimée » wraps to two lines in the 196 px pill (7.8 over).
- *Footer and steps:* "● Toute la mesure" has 7.5 spare, and "▼ demi-ton" 13.5.

The two-line labels are legible within 44 px, and none overflows.

**Focus sentence.** In French, three states take three lines in the 46 px row: the last bar, Tempo, and the *mf* line. They fit only after the row's own type was set to 12 px, so that 16 px line spacing does not inflate each line. That is the row's limit: a fourth line would not fit.

## Strings I had to add, marked

Everything else on the frames is Dann's final string, or the tree's own with its file and line.

| What | English | French | Source |
|---|---|---|---|
| Findings for m. 27 and m. 31 | "Measure 27 reads as only 3 beats in 4/4." · "Measure 31 reads as 5 beats in 4/4." | « Ilya ne lit que 3 temps dans la mesure 27, en 4/4. » · « Ilya lit 5 temps dans la mesure 31, en 4/4. » | Instantiated from his two finding patterns; no new words |
| The top line for a note | "D3 · beat 1 · Half" | « D3 · temps 1 · Blanche » | The tree's words: `i18n.ts:338-340`, `:445` |
| The top line for a dotted half | "Dotted half" | « Blanche pointée » | **MINE** in English; the French is from his "✓ Blanche pointée." |
| The top line for a run | "Notes 1 to 3 · beat 1" | « Notes 1 à 3 · temps 1 » | **MINE**, built from his "A: notes 1 to 3" |
| Tempo's first chip | "Steady" | « Stable » | English from round 1 (D10). French **DRAFT, MINE**, built from `voiceIntake.sustained.3` (`i18n.ts:1843`, « stables »). Open: whether « Stable » names a held tempo to a singer |
| Undo after a dot, and after a tuplet | "Undo: dot added" · "Undo: tuplet defined" | « Annuler : point ajouté » · « Annuler : nolet défini » | Tree, `i18n.ts:451`, `:587`, with his "Undo:" prefix |
| Length's second row | Dot · Rest · Tie | Point · Silence · Liaison | Tree, `i18n.ts:336`, `:502-503` |
| The step names | Previous note · Next note | Note précédente · Note suivante | Tree, `i18n.ts:331-332` |
| Drawing annotations | "STAND-IN CROP"; the rails board's captions | English in both | Annotations, not app copy |

**Not drawn, because no string exists:** a focus sentence after a removal, and one while Remove is armed. Hairpin's detail rows are not drawn either; their strings are not in the final list.

## Could not establish

- **The live Loupe.** Not captured. Every figure is measured in these mockups.
- **The scan strip's data:**
  - Whether songs read before model 465 carry `imgpos`: the header says the comment arrives "with model 465" (`join-pages.ts:21-24`).
  - Whether the scan's bytes are kept for every song (the code-questions memo, section 7, says a `sources` store holds them; I did not read `driver.ts`).
  - Whether a bar's notes alone bound a useful crop, since Ilya does not keep the printed barlines or system breaks (memo, section 1).
  - The floor below which a wide crop is unreadable.
- **The phone's bottom safe area.** With the scan strip, the review strip ends 2 px from the bottom. Whether 844 px is the space the PWA gets after the home indicator is not established.
- **Which removal is more common:** whole runs where the voice rests, or extras inside a full bar. Decision 5 depends on it.
- **Arming Remove on a bar where an offer stands.** Described, not drawn.
- **« Stable ».** A marked draft. The French term for a steady tempo is Dann's.
- **The desk's keys.** D17's letters are left out: with six stations and two languages, the letters are open with Code, as in round 2.
