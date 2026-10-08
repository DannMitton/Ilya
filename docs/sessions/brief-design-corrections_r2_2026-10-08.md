# Brief for Design: the Loupe's Corrections, round 2 (r2, 2026-10-08)

Written by the desk (Opus) 2026-10-08 about 13:05. For Claude Design, with the repository `DannMitton/Ilya` connected on branch `Shane`. **It builds on your return of round 1** (`docs/sessions/design-corrections_r1_2026-10-08.md` and its drawings) and on round 1's brief (`docs/sessions/brief-design-corrections_r1_2026-10-08.md`), which still hold except where this brief says otherwise. Read both whole first.

## The singer, first

A classical singer has dropped a scanned song. Ilya's reader has drawn the vocal line, and it gets some bars wrong. The singer wants to fix those bars quickly, with the feeling that Ilya is a careful assistant who knows where it might have slipped, not a pile of tools to learn. Later the same singer marks their own performance: a tempo, a dynamic, a hairpin.

Two things must hold for that singer, in Dann's words of 2026-10-08:

1. **Consistency.** 12:50: *"I think users rely on consistency."* A control is found where it was last time.
2. **Helpful curation, never onerous curation.** 12:59: *"I think helpful curation is helpful. Onerous curation is not helpful, ultimately."*

## What the survey found (read the four memos; they carry every source)

`docs/sessions/memo-sonnet-omr-correction-apps_r1_2026-10-08.md`, `memo-sonnet-marking-apps-and-touch-editors_r1_2026-10-08.md`, `memo-sonnet-engravers-selection-ui_r1_2026-10-08.md`, and `memo-sonnet-soundslice-phones-greying_r1_2026-10-08.md`: 21 apps and the platform guidance.

- **Fixed beats moving.** A static menu was "significantly faster than the adaptive menu" (Findlater and McGrenere, CHI 2004); controls that move "are not often faster" (Findlater et al., CHI 2009). Office's Ribbon: "Nothing ever 'disappears' at any level, it just shows as disabled" (Harris, 2006). Sibelius's Keypad keeps fixed layouts and lights the selected note's properties; tapping a lit button removes that property.
- **A greyed control must say why.** Named as the failure by Nielsen (2025), Friedman (2024), and a reader of the Ribbon post.
- **Detail may change; the primary row may not.** Sibelius's Inspector and MuseScore's Properties panel change with the selection, and both are secondary panels.
- **Asking is done once, as a batch, after the scan.** Soundslice asks yes-or-no questions about the marks it was unsure of before the editor opens, and groups alike questions so the user can "click the ones that are wrong". It does not interrupt editing.
- **Flags are per bar, from bar arithmetic, and the usual cause is a triplet** (ScanScore, SmartScore, PhotoScore). ScanScore: select the three notes, press tuplet, the flag clears.
- **No app removes "this staff is not the voice" in one act.** Ilya's would be the first.
- **Singers' marking apps (forScore, Henle, Newzik) pin marks to the page image.** Ilya's caret pins them to the music, which is what feeds the readouts. Keep the caret.

## What changes from your round 1

1. **The rail stays fixed** (your D1 and D2, confirmed). Every primary button always shows, always in the same place, on desk and phone. A button that cannot act on the focus is greyed; **a tap on a greyed button says why in the focus sentence** (for example, "Triplet needs two or more notes. Take a run with From here to…"). Draw one such state. Drop D2's "if the open one cannot act, the panel moves to Length": nothing moves on its own.
2. **The rows under the rail are the detail and may change with the focus**, as in round 1.
3. **A flagged bar highlights; it does not rearrange** (replaces D5's "Not voice open"). On a flagged bar the button Ilya suggests carries a quiet highlight, and the focus sentence says what Ilya found and what it suggests, with the suggested act as the first button ("These 3 notes overfill the bar by half a beat. Make them a triplet?"). The singer may ignore it.
4. **A short review, offered and never imposed** (new; Dann's 12:59 ruling, the desk's shape). When a read finishes with flagged bars, one quiet line appears with the score: "Ilya is unsure of {n} bars. Review them". One tap opens the Loupe on the first flagged bar; **Next** and **Previous** step through the flagged bars only; **Done** or closing the Loupe ends it at any point. Alike flags are grouped where one act fixes them all ("3 bars look like triplets. Make all 3 triplets?", with each bar shown and any one untickable). The flags stay on the Paper, so a singer who skips the review can find them later. No modal, nothing that blocks the score, no count that nags. Draw: the line on the Paper; the first flagged bar in review; a grouped flag; the last bar with Done.
5. **Not voice keeps its place for now.** Its rank came from 61 extra notes that Code is fixing at the source today (QUEUE row 49). Draw the rail so reordering it later costs nothing; the desk sends the order once row 49 is measured.
6. **The phone keeps two rows of four.** Apple suggests about five segments for a segmented control on an iPhone; your rail is a grid of buttons, not a segmented control, and Sibelius's Keypad holds six layouts. Say in your notes whether eight still reads calmly at 390 px, and if not, what you would do.

## What stays from your round 1

The fixed panel size and no scrolling; the caret as the only attachment point; gradual tempo changes by termini (D11); hairpins between two carets (D13); no new taps on the notation (N.162); keys on the desk (D17); provenance sigils (D16); metre, key, clef, and barline left out of the Loupe (D18).

## Questions the desk is settling with Code, not you

How a range removal is stored (D4), how an accidental's carry is stored (D7), whether the Loupe knows a system's end (D3), and whether Syllables has room for Melisma (D14). Draw as if each works; the desk reports back before anyone builds.

## Return

Drawings at desk (1440 by 900) and phone (390 by 844), using existing colour tokens (`apps/web/src/app.css`): the panel at rest; a greyed button tapped, with its reason; a flagged bar with the suggestion highlighted; the review line on the Paper; review at the first flagged bar; a grouped flag; review's last bar with Done. Redraw any round 1 state these changes touch. A short note per decision with its cost, the new English labels (write no French), and a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Write the return into `docs/sessions/` as `design-corrections_r2_2026-10-08.*`.

Who offered what: consistency and helpful curation are Dann's (12:50, 12:59). The fixed rail and its stations are Design's (round 1). Greyed-with-a-reason, highlight-not-rearrange, and the offered review's shape are the desk's, drawn from the four memos.
