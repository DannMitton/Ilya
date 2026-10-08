# Brief for Design: the Loupe's Corrections, round 2 (r3, 2026-10-08)

Written by the desk (Fable) 2026-10-08 about 13:20, as the last filter on r2 (the Opus desk, about 13:05), which was not sent. **This brief replaces r2. Read this one, not r2.** For Claude Design, with the repository `DannMitton/Ilya` connected on branch `Shane`. It builds on your return of round 1 (`docs/sessions/design-corrections_r1_2026-10-08.md` and its 24 drawings) and on round 1's brief (`docs/sessions/brief-design-corrections_r1_2026-10-08.md`), which hold except where this brief says otherwise. Read both whole first, then the four memos named in the evidence section.

## The singer, first

A classical singer has dropped a scanned song. Ilya's reader has drawn the vocal line and gets some bars wrong. The singer wants to fix those bars quickly, on a phone or at a desk, and to feel that Ilya is a careful assistant that knows where it may have slipped. Later the same singer marks a performance: a tempo, a dynamic, a hairpin. Design for that singer's ease and confidence before anything else. Ilya's design idea is Calm Authority: helpful, quiet, exact, and tethered to its sources.

Four rulings by Dann today, 2026-10-08, govern this round:

1. **12:50, consistency.** *"I think users rely on consistency."* The row of buttons never moves.
2. **12:59, helpful curation, never onerous curation.** *"I think helpful curation is helpful. Onerous curation is not helpful, ultimately."*
3. **13:01, the review shows "x of y"**, to establish navigation and set expectations.
4. **13:06, less mental energy is a principle.** The phrase is Soundslice's (its blog of 26 Jan 2023). Cognitive load is a real cost, and every singer benefits from less of it.

A test for every state you draw (the desk's, not Dann's): say in one line what the singer reads first and what one tap does next. A state that needs more than one line is carrying too much.

## What the evidence supports, and how far

The four memos carry every source: `docs/sessions/memo-sonnet-omr-correction-apps_r1_2026-10-08.md` (the OMR memo), `memo-sonnet-marking-apps-and-touch-editors_r1_2026-10-08.md` (the marking memo), `memo-sonnet-engravers-selection-ui_r1_2026-10-08.md` (the engravers memo), and `memo-sonnet-soundslice-phones-greying_r1_2026-10-08.md` (the greying memo): 21 apps and the platform guidance. The greying memo's quotations came through a summarising fetch tool and were not checked against the raw pages (its own method note).

- **A fixed layout is supported, and it is not proven for a phone.** A static menu was "significantly faster than the adaptive menu" (Findlater and McGrenere, CHI 2004). In the same study most participants preferred the "adaptable" menu (15 of 27; 4 chose the static one), and the menus were desktop menus. A 2009 survey reports larger gains from adaptation on a small screen and for novices (Findlater and Gajos). No source tests fixed and greyed controls on a phone (greying memo, pattern 4 and "Could not establish"). Dann's 12:50 ruling settles the rail. The evidence asks you to report plainly how the fixed rail reads at 390 px.
- **A highlight in place has a precedent, and it depends on being right.** "Ephemeral adaptation maintains spatial consistency", and "higher adaptive accuracy results in faster performance and higher user satisfaction" (Findlater et al., CHI 2009). A suggestion that is often wrong costs more than no suggestion.
- **A greyed control that gives no reason is a known failure**: Nielsen (2025), Friedman (2024), and a commenter on Harris's Ribbon post (2006). This is expert opinion, not experiment.
- **The engravers memo found no documentation of greying by selection** in Sibelius, MuseScore, or Frescobaldi. Sibelius and MuseScore keep the primary surface fixed and live and let the selection decide the effect; only their secondary panels (Inspector, Properties) change (pattern 2). Sibelius's Keypad lights the selected note's properties, and a tap on a lit button removes that property.
- **Five editors place a tempo, a dynamic, or a hairpin from a selected note or item**: Soundslice, MuseScore, and Dorico (all three marks), and Sibelius and Flat (the hairpin). Sources: OMR memo, Soundslice notes; engravers memo, the two tables; marking memo, Group B.
- **Soundslice asks in a batch before its editor opens**, and groups questions that share a guessed answer so the user can "click the ones that are *wrong*", which "takes up a lot less space and less mental energy" (blog, 26 Jan 2023). The grouping covers text questions only. Whether a question can be skipped is NOT ESTABLISHED. That it never asks during editing is the memo's inference from finding no such case.
- **Desktop readers flag by bar, from bar arithmetic** (ScanScore, SmartScore, PhotoScore). In ScanScore's and SmartScore's examples the cause was a missed triplet. ScanScore's example comes from a sponsored review of 2020.
- **None of the apps in the OMR memo documents removing a wrongly read staff in one act** (pattern 6). r2 said Ilya's "would be the first"; the survey cannot show that.
- **Performers' marking apps place marks on the page.** Whether any binds a mark to a bar or a beat is NOT ESTABLISHED for all five (marking memo, pattern 1). The caret stays (Dann's decision, round 1's brief).
- **Apple's guidance**: "no more than about five segments on iPhone" for a segmented control, and "Keep consistent groupings and placement across platforms" for toolbars (marking memo, Group C; greying memo, Part 3).

## What the tree already does

Read by the desk today, each with its file and line.

- **Ilya already makes a triplet itself where bar arithmetic allows exactly one choice.** By its own header, "When two choices both fit ... such a bar is left as homr wrote it", and so is a bar with a chord, a grace note, or a second voice (`apps/web/src/lib/omr/triplets.ts:1-50`; called at `apps/web/src/lib/omr/join-pages.ts:241`; the desk did not trace the call further). So a bar that still fails to add up is one these rules did not settle. Why the 12 length misreads of the unseen set escaped the rules is NOT ESTABLISHED: the blind-read report infers missed triplets and says the score file does not confirm it (`docs/sessions/report-heldout-blind-read_r1_2026-10-07.md:50`).
- **Ilya already names the measures that do not add up, in Insights**: "Measure {measures} does not add up to its time signature, so its notes are counted as written." (`apps/web/src/lib/i18n.ts:1681-1682`, shown at `apps/web/src/lib/insights/InsightsPane.svelte:764`). It is the only finding of this kind the desk found in the app. The three checks in round 1's brief (a span over two octaves, a chord in the voice, a leap beyond an octave) are the desk's proposal; the desk found no row for them in `docs/memory/QUEUE.md`.
- **The Corrections panel already has step buttons**, ← and →, labelled "Previous note" and "Next note", on either side of the readout (`apps/web/src/lib/score/CorrectionSurface.svelte:495-509`; `i18n.ts:331-332`). Round 1's drawings leave them out, and D3 depends on them.
- **Taking a caret on a phone is the least forgiving tap in the Loupe.** A caret's hit centre sits 15.6 to 21.4 px from the nearest note's, and the catchment around a caret is about eight to ten pixels (N.162, open, `docs/memory/STATE.md:172-177`).
- **No readout reads a dynamic** (`apps/web/src/lib/analysis/gates.ts:90-92`), **and seconds use the score's first stated tempo and ignore any later change** (`packages/score-parser/src/phonation.ts:449-450`). Your D10 and D12 said as much. r2 said the caret "feeds the readouts"; for these marks that is not true today.
- **The contract, section 6**: "Do not put a mark on the page to say Ilya is unsure. A mark that appears on everything says nothing." And: "No control is part of the printed page. Passing layers ... float above it and never print", unless Dann rules a layer in by name (`docs/memory/CONTRACT.md:725-731`).
- **The Loupe opens on Syllables.** Whether it opens on the mode last used is Dann's to consider, and he has not ruled (`docs/memory/OPEN.md:2181-2182`).

## What changes from your round 1

1. **The rail never moves** (your D1 and D2, confirmed; Dann, 12:50). Every station shows, in the same place, at both sizes, in every state, review included. Nothing changes station on its own: drop D2's "the panel moves to Length". When the open station cannot act on the focus, it stays open, its controls stay in place and greyed, and the focus sentence says why and what to take instead, without waiting for a tap.

2. **One table decides the greying.** Round 1's drawings disagree with each other. With one note in focus, Tempo, Dynamic, and Hairpin are ready (drawing 02); with three notes in focus they are greyed (drawing 06). At a caret, Not voice and Triplet are greyed (drawing 03), and D3 arms a range "at the taken note or caret". Return a table: each kind of focus (nothing, a note, a caret, a run, a mark) against each station, ready or greyed, with the reason sentence for every greyed cell. Code builds from that table.

3. **Grey as little as the table allows.** At a caret, four of the eight stations are greyed in drawing 03. Each greyed button is something to read and step around. For every greyed cell, say whether the station could act on the nearest valid focus instead, and what that costs. One case the evidence supports, so draw it: **with a note in focus, Tempo, Dynamic, and Hairpin act at the caret before that note**, and the focus sentence says so (for example, "Tempo at the gap before A♯3"). The caret stays the only attachment point; the singer no longer has to hit it to place a mark. Sources: the five editors that place marks from a selected note, and N.162's catchment of eight to ten pixels. DESK DEFAULT. If you find it wrong, say why and draw your alternative.

4. **A tap on a greyed button says why, and what to do next.** The reason appears in the focus sentence, names something the singer can reach at that moment, and gives way to the next act. r2's example sent the singer to "From here to…", a chip inside the station they could not open, and Triplet is ready with one note in focus in your drawing 02. Use an example true to your table (for example, at a caret, on Pitch: "Pitch changes a note. Take a note in the bar."). A greyed button still answers a tap, so its label stays readable (state the contrast ratio you drew), it stays in the keyboard's focus order, and its reason reaches a screen reader.

5. **Inside the detail rows, a control keeps its slot.** The rows may change with the open station, as in round 1. What recurs does not move. (a) The Reach chips keep one order across stations: drawing 05 puts "This bar" first and drawing 06 puts it second. The row holds whether or not "To end of system" survives D3. (b) Removing the thing in focus has one home and one pattern of name in every station: round 1 has "Delete" and "Remove mark" in the footer, and "Remove" in the second row for Tempo and Hairpin. (c) The existing ← and → step buttons are drawn, in one place, in every state.

6. **Say the focus once.** Round 1 names the focus in the Loupe's top line and again in the focus sentence, in a different order ("A♯3 · beat 3 · Quarter" and "A♯3 · quarter · beat 3 · m. 9", drawing 02), and the phone drops the quiet second line wherever the desk has one. This round gives the focus sentence more to carry. So the top line names the focus, and the focus sentence carries one message at a time, in this order: the answer to the singer's own tap (a greyed button's reason, or what an act changed); then the offer on a flagged bar; then what the open station will do. It fits two lines at 390 px without changing the panel's height. Nothing the singer needs is said at the desk only.

7. **A flagged bar: what Ilya found, then what it can offer.** This replaces D5's "Not voice open" and r2's item 3. The rail does not rearrange, and the open station does not change. The finding sits in the Loupe's top line, where drawing 04 has it, so it shows on either pill; it uses the words Ilya already uses (for the finding that exists: "Measure 9 does not add up to its time signature."). The offer comes in three forms, and you draw all three:
   - **One act**, where the check itself names it: one button, one tap, whichever station is open. The station that holds the manual controls carries a quiet highlight.
   - **Two or three candidate acts**, where the check finds more than one fit (the triplet case, by `triplets.ts`): each candidate is a button, and the Loupe shows which notes it means before it is applied.
   - **No offer**: the finding alone. A station is highlighted only if the check supports one.

   Every flagged bar also carries **"Right as read"** (the desk's label, yours to improve): one tap, the flag clears, and no note changes. A check will fire on some bars that are right, and without this such a flag can never be closed. The rail now has four states (ready, open, greyed, suggested). Draw the four side by side once, each readable without colour alone.

   A flagged bar that the singer opens outside the review opens on the pill the Loupe always opens on, with the finding in the top line. DESK DEFAULT, from the 12:50 ruling. D5's arrival on Corrections is set aside, and the question stays Dann's.

8. **The review: offered, never imposed** (Dann, 12:59 and 13:01; the Opus desk's shape, amended).
   - **The offer.** When a read finishes with flagged bars, one quiet line floats over the score as a layer that never prints (contract, section 6): for example, "Ilya flagged 5 bars to check. Review". The singer can put it away with one tap; say where they find the review again. Use one word for the thing everywhere. Round 1 has "flagged" and "Check:"; r2 added "unsure", which section 6 argues against.
   - **The flag on the Paper.** Draw it at both sizes (round 1 did not): a layer over the Paper, not a control, and it does not print. A singer who skips the review finds the flagged bars by it.
   - **x of y.** In review the Loupe shows "2 of 5" on every step. y is the number of flagged bars when the pass begins; it matches the offer's number and stays fixed for the pass. x is the bar in view. A cleared bar stays in the sequence, shown as cleared, so Previous can return to it.
   - **Stepping.** Previous and Next move between flagged bars only, sit in one place on every step, and are named and drawn so that they cannot be taken for the note steps (← and →, "Previous note" and "Next note"). Done, or closing the Loupe, ends the review at any step. Entering review moves nothing in the panel.
   - **After an act, the result shows, and nothing advances on its own.** The Loupe redraws the bar, and the focus sentence says what changed and that the flag is cleared (for example, "Now a triplet. The measure adds up."). The singer taps Next.
   - **Alike bars, after the first.** r2 asked for one grouped question "with each bar shown". A large group cannot fit a fixed panel with no scrolling, and it changes bars the singer has not seen. DESK DEFAULT: when the singer has resolved one bar and others carry the same finding in the same shape, Ilya offers once to do the same there (for example, "2 more bars have the same shape: m. 14, m. 22. Do the same there?"). Those bars stay in the review, marked as changed, so the singer can look. One Undo reverses the lot. If you can show every bar of a group at 390 px without scrolling, draw that form as well and say which you would ship.
   - **The end.** The last bar shows "5 of 5" and Done. After Done the offer line is gone if every flag is cleared; otherwise it says how many remain, once, with no badge and no repeat.
   - **Many flags.** A mark that appears on everything says nothing (contract, section 6), and a review of thirty bars is onerous (12:59). Draw what the singer sees when most bars are flagged: one sentence about the scan, not thirty flags. Where that line falls is for Code and the desk. Draw the state.

9. **Not voice keeps its place for now.** Its rank came from 61 extra notes that Code is fixing at the source today (QUEUE row 49). Draw the rail so that reordering it later costs nothing; the desk sends the order once row 49 is measured.

10. **The phone's two rows mean what the desk's groups mean.** r2 argued that the rail is a grid of buttons and not a segmented control. The rail chooses one of eight and changes the view under it, which is the use Apple's guidance describes, and that guidance says about five on an iPhone. Sibelius's six Keypad layouts are six, and the memo does not say how the phone presents them. Two fixed rows, always visible, stay (12:50). What changes: the desk groups the rail 3 | 2 | 3 (repair a run, repair a note, mark the performance), and the phone lays the same eight out 4 over 4, which splits Length from Pitch, one group on the desk, across the two rows (drawing 01). Draw the phone's rows so that each row means one thing, and the desk to match. Say whether seven stations would serve: your own ranking puts Pitch eighth of eight (D9), and seven would fall as 4 repairs over 3 marks. Give the longest English label on a chip and the pixels to spare, so the desk can test the French against it.

11. **Say what a mark does today.** A tempo at a point, a dynamic, and a hairpin are kept and drawn, and they change no readout yet. Your line "Dynamics are kept and drawn. They do not yet change any readout." stays, at both sizes, and Tempo at a caret and Hairpin say the same of themselves. DESK DEFAULT: round 1 left the line for the desk to strike, and the phone drawing drops it. A singer who marks a crescendo and sees no figure move needs to have been told.

## What stays from your round 1

The fixed panel and no scrolling; the caret as the only attachment point; gradual tempo changes by termini (D11); hairpins between two carets (D13); no new taps on the notation (N.162); keys on the desk (D17); provenance sigils (D16); metre, key, clef, and barline left out of the Loupe (D18).

The panel's height is yours to set again. Round 1's phone panel is full (drawing 04), and this round adds the step buttons, the offer, "Right as read", and the review's controls. Say where each lives and what it displaced. If they do not fit 316 px without scrolling, say so and give the fixed height that holds them. No target goes under 44 px.

## Open with Code; draw as if each works

The desk is settling four storage questions with Code, not with you: whether the Loupe knows a system's end (D3), how a range removal is stored (D4), how an accidental's carry is stored (D7), and whether Syllables has room for Melisma (D14).

This brief raises four more for Code, also open: what each check can name (one act, several candidates, or none); whether "Right as read" and a put-away offer are stored with the song; which flagged bars count as the same shape; and whether D17's letters collide (the Corrections key handler claims no letter, `apps/web/src/routes/+page.svelte:1238-1277`; other handlers were not read).

## Return

Phone (390 by 844) for every state. Desk (1440 by 900) for the review path, and wherever the desk's layout differs in more than width. Existing colour tokens (`apps/web/src/app.css`). The review path comes first, because it tells the story.

The review path:

1. The flag on the Paper, with the offer line.
2. Review at the first flagged bar, "1 of 5", with one offered act.
3. The same bar after the act: the result shown, the flag cleared.
4. A bar with two candidate acts.
5. A bar with no offer, and "Right as read" taken.
6. "Do the same there", offered after the first of several alike bars.
7. The last bar, "5 of 5", with Done; and the Paper after Done.
8. Many flags.

Reference:

9. The four rail states side by side.
10. A greyed button tapped, with its reason; and an open station that cannot act, with its reason shown untapped.
11. A note in focus with Tempo open, acting at the caret before the note.
12. The Reach row in Not voice and in Triplet, chips in one order.
13. Removal in its one home, for a note, a mark, and a triplet.
14. A flagged bar opened outside the review, on the usual pill.
15. The phone rail with rows by meaning, and the seven-station form if you support it.

Redraw any round 1 state these changes touch.

With the drawings: the greying table; a short note per decision with its cost; for each state, its one line (what the singer reads first, what one tap does next); where each addition lives on the phone and what it displaced; the new English labels (write no French); and a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Write the return into `docs/sessions/` as `design-corrections_r2_2026-10-08.*`. Write no app code.

## Who offered what

Consistency, helpful curation, "x of y", and less mental energy as a principle are Dann's rulings (12:50, 12:59, 13:01, 13:06). The phrase "less mental energy" is Soundslice's. The fixed rail and its stations are Design's (round 1). Greyed with a reason, highlight without rearranging, and the offered review are the Opus desk's (r2), drawn from the four memos.

This desk (r3) added: the greying table; marks placed from a note in focus; the three forms of offer; "Right as read"; "Do the same there" after the first; fixed slots inside the detail rows; saying the focus once; the many-flags state; rows by meaning on the phone; the readout line at both sizes; and the one-line test. Coined here: "greying table", "Right as read", "Do the same there", and "the review path". The other terms are adopted from Design or from the earlier desk. None of this desk's additions is Dann's ruling until he rules on it.
