# Brief for Code: Markup's pages lose no bars (QUEUE row 72, r1, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 14:55. For Code, cloud lane, Sonnet. **Runs before rows 70 and 71**: Ilya is hiding music a singer needs.

## What the singer sees today

Found by the cloud lane on row 25 (`docs/sessions/report-code-old-spelling-endings-and-the-notes_r1_2026-10-02.md`, "Found, not in this brief"), and seen by the desk in its picture `report-code-old-spelling-endings-and-the-notes_r1_2026-10-02.files/after-markup-p1.png`: on the Tchaikovsky song (op. 38 no. 3, the tree's fixture `apps/web/src/lib/score/ingestion/fixtures/tchaikovsky-op38-3-voice.musicxml`), Markup's page 1 opens with a tall empty band under the header, draws three systems, then a fourth system's staff (bar 26) cut by the footer with no underlay (neither IPA nor Russian); page 2 opens at bar 48. **Bars 26 to 47 are drawn nowhere a reader can see,** on screen and in print. Before row 25 the lost span was bars 25 to 38, so the fault predates row 25; row 64 (one running head, one footer) is the first suspect, NOT ESTABLISHED.

## The work

1. Find the cause, with its `path:line`, before changing anything. Say whether row 64 introduced it.
2. Fix it in general, not for this song: **every bar of the score appears on exactly one page, whole, with its full underlay (the IPA line and the syllabified Russian under it)**, on screen and in print, on Markup and on Text. No system is cut by the footer; no tall empty band precedes the first system unless the layout rule calls for one (say which rule).
3. A test that fails today: for each tree fixture with a score, the set of bars drawn across Markup's pages equals the score's bars, each once. Run it on every fixture, and report any other song that loses bars.
4. Pictures before and after: Tchaikovsky pages 1 and 2, desktop and print preview.
5. All eight gates. Commit and push to `cloud-lane` only; never `Shane` or `main`; no edits in `docs/memory/`. NOT ESTABLISHED beats a complete invented answer.

## Report

`docs/sessions/report-code-markup-pages-lose-no-bars_r1_2026-10-11.md`: the answer first (the cause); the test; pictures; changes with `path:line`; gates; **Could not establish**.
