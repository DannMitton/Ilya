# Brief for Design: Insights, laid out for the singer (r1, 2026-10-09)

Written by the desk (Opus) 2026-10-09 about 13:25. For Claude Design, with the repository `DannMitton/Ilya` connected on branch `Shane`. The record of this item is `docs/memory/OPEN.md`, "INSIGHTS, REVIEWED AS A PAGE FOR THE SINGER".

## The singer, first

A classical singer has given Ilya a song, a calibration of their voice, and their range. They open **Insights** to decide whether to sing this song in this key. They ask four things, in this order (the desk's frame, endorsed by Dann 2026-10-09 12:49: *"I love your four sequential user questions"*):

1. **Does this key suit me?**
2. **Where will it give me trouble?**
3. **Why does Ilya think so?**
4. **How much singing is in it?**

Dann, 12:41: *"I feel like we pad information that could be communicated more succinctly."* And 12:49: the design answers the four questions *"with clear visual cues (graphics, ultra clear prose, typeface, and placement)"*. **"Demote the evidence rather than delete it"** (Dann, 12:49): the readers are singers, teachers, and scholars who will want to see how Ilya reached its verdict.

A test for every element you place (the desk's): say which of the four questions it answers. An element that answers none is frame or it goes.

## The page as built (`472ed96` and later; *Without Sun*, no. 1, Dann's voice, read by the desk 2026-10-09 13:15)

**Page 1:** compass stave, top right, with "Compass C♯3 to D4"; title and composer; "Insights for Dann · Seriöserbaß · calibrated 2026-09-27"; the histogram "Phonation per pitch, in quavers" (C♯3 to D4, the tessitura band and bracket, "half the singing", "centre G3", the passaggi dashed, "above 0% · between 39% · below 61%"); "Phonation time: Your phonation takes about 50 s to 1 min 25 s of this piece, at the speed Andante tranquillo usually means."; "Ilya reads your compatibility from these three measurements." and a table (Range containment, Passaggio crossings, Tessitura containment; measured, your references, flag); "How this key sits for you: This key seems like a good fit for you. Nothing in this piece is flagged for your voice."; "Cycle dose: about 9,800 to 17,000 (number of fold collisions in this piece)"; a tessitura footnote; the method line; the colophon; "Page 1 of 3".
**Page 2:** "Phonation time"; "Measure 17 does not add up to its time signature, so its notes are counted as written."; "Seconds of phonation per vowel", ten rows ([i] 4 s to 7 s … [u] 2 s to 4 s); the foot.
**Page 3:** the comments (one on this song: "m. 6 · A3 · [u]", a paragraph with cited suggestions, and "More to explore, and why", which opens more suggestions and references on screen and does not print); "Sources cited"; the foot.

Code: `apps/web/src/lib/insights/InsightsPane.svelte`, `Tessituragram.svelte`, `CompassStave.svelte`, `FitTable.svelte`, `cycle-dose.ts`. A busier song for the comments: Kabalevsky, Shakespeare sonnets, T01, which draws four comments for Dann's voice (`tools/n168-frequency-run/out/comments-oracle.md`, "Kabalevsky T01, Mitton, default intake, as the page renders it").

**What the desk's sort found:** the verdict (question 1) sits fifth on page 1 and the comments (question 2) on page 3; question 4 is split over three places, and page 2 holds one bar warning and a ten-row list; the range appears three times (compass, histogram labels, table row 1).

## The order, ruled by Dann 2026-10-09 13:17 (*"yes"*, to the desk's proposal)

1. The frame (title, identity line).
2. **The verdict**, first and largest.
3. **"Where this piece meets your voice"**: the comments.
4. The evidence: the figure and the table, demoted, not deleted.
5. One block for how much singing: phonation time, the vowels, the cycle dose.
6. Bar warnings (what Ilya could not read as printed).
7. Endnotes, sources cited, the method line.

This is an order of priority. Where it falls on pages is yours to propose.

## Already ruled; design within these

- **The comments' heading:** "Where this piece meets your voice" / « Là où cette pièce rencontre votre voix » (Dann, 13:03 and 13:10).
- **"More to explore, and why" prints as endnotes** (Dann, 13:03): each comment prints as it reads; a closing section of that name gathers every comment's further suggestions and references, keyed by bar and note. On screen the expanding control stays.
- **The compass stays floating in the top-right corner, with no squircle** (Dann's design 2026-10-09 01:38, *"like a signature placement"*; the desk advised no squircle 13:17, because the squircle's purpose is to arrest focus, `docs/memory/PRODUCT.md` "The squircle", and here the verdict must take the eye first). **Condition:** if your drawing shows the compass stranded once the verdict leads, anchor it with spacing or a hairline before any squircle, and show us.
- **Squircles may run across a page break** to save negative space and tell a reader who does not expect several pages that the page continues (Dann, 2026-10-09 12:59, for this review). Show how.
- **No control is part of the printed page** (`docs/memory/CONTRACT.md` §6). Insights is a document: letter pages, screen and print alike.
- **Rose is Insights' colour** (`PRODUCT.md`). Both languages, start to finish: French runs about 15 percent longer.
- **The cycle dose's unit is cycles** (Titze, Švec, and Popolo 2003: "the total number of vocal-fold oscillatory periods"). "Fold collisions" claims more than that paper says. A dose means little without a point of comparison; propose how to give one or how to place it quietly.

## What we ask for

1. The quiet case (*Without Sun*, no. 1: good fit, nothing flagged, one comment) and the busy case (T01: four comments), each as the full printed set, English. One French page for the longest strings.
2. For each element: which question it answers, where it went, and what was cut or merged and why.
3. Where the table, the compass, and the histogram's range labels overlap, propose one place for the range, or say why three earn their room.
4. The phone width (390 px) for page 1.

Say what you could not establish. NOT ESTABLISHED beats a complete invented answer.
