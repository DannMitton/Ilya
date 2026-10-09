# Plan: building the Corrections redesign, in slices (r1, 2026-10-08)

The desk (Fable), 2026-10-08 about 22:41. **A dated draft, the desk's own: none of the slicing is Dann's ruling.** It turns Design's round 2 into pieces Code can build and Dann can walk one at a time. Each slice gets its own brief on `BRIEF-TEMPLATE.md` when its turn comes; this plan is the map, not a brief.

Read by the desk for it, whole, tonight: `brief-design-corrections_r3_2026-10-08.md`; `design-corrections_r1_2026-10-08.md` and `_r2_`; `memo-sonnet-corrections-code-questions_r1_2026-10-08.md`; `report-corrections-inventory_r1_2026-10-07.md`; `brief-code-corrections-fixed-panel_r1_2026-09-28.md`; `docs/memory/OPEN.md`, "THE CORRECTIONS REDESIGN", items 1 to 8. Read in part: `code-audit-correction-station-map_r1_2026-09-27.md` (sections 3 to 5). **The desk has read no Corrections source file tonight:** every `path:line` here is a lead from those documents, to be read again when its slice's brief is written.

## What the singer gets, in the order they meet it

1. **A line on the Paper after a read:** « 5 mesures à confirmer d’après votre partition. » with Compare and Not now, and a filled squircle in Markup's wash behind each of those bars (Dann, 2026-10-08 23:15; `OPEN.md`, Corrections item 10; no flag anywhere). The mark and the line never print.
2. **A review, bar by bar, "1 of 5":** what Ilya reads in the bar, in notation ("Measure 9 reads as only 3 beats in 4/4."), then a question the score answers ("Is the half note dotted in your score?"), with one tap for yes and one for "Matches my score".
3. **A Corrections panel that keeps one size and one layout:** six stations in a fixed rail (Tuplet, Pitch, Length, Tempo, Dynamic, Hairpin). A station that cannot act is greyed and says why.
4. **Removing more than one note in one act**, with one Undo. An accidental that holds through the bar.
5. **Their own marks:** a tempo at a note, a dynamic, a hairpin, kept and drawn.

## What is settled, and where

- The rulings: `OPEN.md`, "THE CORRECTIONS REDESIGN", items 1 to 8 (consistency; curation offered, never imposed; "x of y"; less mental energy; the page is the authority; seven stations on the phone, then six with no "Not voice"; the French).
- The strings: `draft-corrections-wording_r1_2026-10-08.md` (English, accepted) and `draft-corrections-french_r1_2026-10-08.md` (French, ratified 22:31 and 22:34). The rest: `draft-corrections-remaining-labels_r1_2026-10-08.md`, English and French, ratified 22:40.
- The drawings and the greying table: Design's round 2. Its table has seven stations; the six-station table is the same table with the "Not voice" column removed.
- The panel's size: 344 px tall on a phone and 296 px at the desk, no scrolling, no target under 44 px (round 2, "Where each addition lives on the phone"). This supersedes QUEUE row 6's shape and keeps its point (Dann, 2026-09-28 16:37: one fixed size).

## What the tree has today (leads from Code's answers and the inventory)

- Four stacked stations: Duration, Pitch, Accidental · Entry, Lyric; 39 controls, all working; the panel resizes with the measure and scrolls at the desk (inventory, "Plan against tree" items 1 and 5).
- A correction is one record per note; removing n notes is n undo steps; the tuplet is the one existing act that undoes as a whole (code answers, 2).
- An accidental's carry exists in the drawing only (code answers, 3).
- The Loupe opens with a note taken; choosing Corrections does not move the cursor (code answers, 5).
- Three bar checks exist: the fill tag in the Loupe (`measureFill`), "does not add up" in Insights, and the triplet rules at read time, which keep neither their rule nor a second candidate (code answers, 6).
- Nothing is stored per bar; a new optional field follows the `seatedText` pattern and must be copied in `validateRecord` (code answers, 7).
- No comparator for "the same rhythm" exists (code answers, 8). No bare letter key is claimed (code answers, 9).
- The scan's printed systems are not kept, so "To end of system" is not offered (code answers, 1).

## The slices

Each is small enough to walk. "Pure" means new modules with tests and no change to `+page.svelte`, `CorrectionSurface.svelte`, or `Loupe.svelte`, so it can run in a second lane beside the reader work.

| # | Slice | What Dann sees when it lands | Needs | Kind |
|---|---|---|---|---|
| 1 | **Which bars to confirm.** One function over the corrected line: the bars that do not fit the metre in force, under Dann's bar rule of 2026-10-05 00:52 (a short first bar, a last bar that completes it, the same at a repeat or a double bar). Returns the bars and what each reads as ("3 beats in 4/4"). | Nothing yet; a table of the bars it names on the 17 opened songs, beside row 37's count (10 of 723). | Nothing. Better after row 57, because a misstated metre names bars the page does not (Grechaninov: 47). | Pure |
| 2 | **What Ilya can offer for a bar.** One note whose dot, or whose next length, would fill the bar (the question "Is the half note dotted in your score?"); two tuplet candidates A and B where two fit; else nothing. It names; it changes no note. | A table: for each bar slice 1 names on the opened songs, the offer, and whether the truth agrees. | Slice 1. The tuplet candidates wait for row 56, which is rewriting `triplets.ts`. | Pure |
| 3 | **What the singer answered is kept.** A per-bar record with the song: confirmed as printed, changed, or the line put away. | Nothing yet; a reload test. | Nothing. | Pure |
| 4 | **The station code leaves the page** (QUEUE row 5, slices 4 to 6: the tuplet row, the verbs, the keyboard). No change the singer sees. | The same panel, unchanged; gates and captures equal. | Code on the Mac, by the ruling of 2026-09-26 on hotspot files. | Mac |
| 5 | **The rail and the fixed panel.** Six stations (three until slice 8 lands), four states, the greying table with its reasons, the focus said once, ← and →, fixed footer slots, accidentals inside Pitch, Length holding dot, rest, and tie, Melisma and the lyric shifts moved to Syllables. | The new panel on any score, phone and desk. | Slice 4. Whether Syllables has room for Melisma is to be measured first. | Mac |
| 6 | **The mark, the line, and the review.** The mark over each bar to confirm and the line on the Paper, as layers that never print; the review strip; the three kinds of offer; "Matches my score"; the result lines; the many-bars sentence. | The whole review on a scanned song. | Slices 1, 2, 3, and 5. The strings are ruled. | Mac |
| 7 | **Removal over a reach, and "Through the bar".** This note, this bar, from here to a bar the singer picks; one Undo for the act. | Both on any score. | Slice 5. A removed note leaves nothing, as today, and Rest stays the way to make a rest (Dann, 2026-10-08 23:33, `OPEN.md` Corrections item 14); the two "Rests …" labels are dropped. | Mac |
| 8 | **The singer's marks.** Tempo at a note, Dynamic, Hairpin: kept, drawn, and removed; "Ilya's timings do not use it yet." | The three stations. | N.120 (QUEUE row 48, the song-wide tempo) and N.177 (dynamics as a layer). | Mac |
| 9 | **"Same in m. 22".** A comparator for the same rhythm; one Undo for the lot. | The offer after a first alike bar. | Slices 2 and 6. | Pure, then Mac |
| 10 | **Keys at the desk.** T, P, L, M, D, H. | Hints at the footer's edge. | Slice 5. | Mac |
| 11 | **The scan strip** (ruled in by Dann 2026-10-08 23:21). In the review, a crop of the singer's scan around the bar's notes, over Ilya's reading. No strip where a song has no note places. | The printed bar over the reading, on a scanned song. | Slice 6. To measure first: whether a bar's note places bound a crop that keeps the dot, the tuplet number, and the accidentals; whether the scan's bytes are kept for every song; the phone's bottom margin. | Mac |

## Order, and what it displaces

- **Nothing here moves THE ONE THING.** Code on the Mac stays on rows 56, 57, and 55, then 47, 48, 50.
- Slices 1 and 3 can start beside that work in a second lane; slice 2 follows row 56. They touch no file the reader work touches.
- Slices 4 to 10 take the Mac after row 50. QUEUE row 51 (the bar checks) is slices 1 and 2 of this plan. QUEUE row 6 is folded into slice 5.
- The scan strip is slice 11 (Design drew it in round 3; Dann ruled it in at 23:21, `OPEN.md` Corrections item 12). Slice 6 leaves room for it and does not depend on it.
- In the review strip, the French pair « Mesure précédente » and « Mesure suivante » both stand on two lines (Dann, 23:21, item 13).

## Design's round 3, returned 2026-10-08 23:07

`design-corrections_r3_2026-10-08.md` and `.html` (72 frames, English and French), filed in `docs/sessions/` with fourteen of the frames as images. It gives the six-station greying table, the French widths, removal with a reach (arm, then remove), rests after a removed run, and the scan strip. Ruled so far by Dann: the mark (item 10) and the ring (item 11). Also ruled: the scan strip, in (item 12), and sibling buttons wrap together (item 13). Settled as nothing new: what a removed note leaves (item 14). Still his: the French remove labels on two lines or « Supprimer » alone; « Stable » for Tempo's first chip. The desk's, to settle in the slice briefs: Design's rose accents in the review against the lavender mark.

## Not established

- Any `path:line` in today's Corrections code, by the desk's own reading.
- Whether the three more checks the desk proposed on 2026-10-08 (a span over two octaves, a chord in the voice, a leap beyond an octave) name bars a singer would agree with. They are in no slice until measured on the opened songs.
- The many-bars threshold.
- Whether the French fits: the station chips (67 px for a label with its mark) and the footer's remove labels.
- What the Paper's mark looks like at print size and on a phone beyond Design's two frames.
