# Brief: the checks over homr's output, measured before any is trusted

**From the desk (Fable) to one Opus helper, 2026-10-05 03:20.** Serves the first item after the wiring in `STATE.md` (the close of 2026-10-05, "After the wiring, in this order", item 1) and Dann's direction of 2026-10-04 23:35.

**Limits. Both are hard.** 90 minutes of wall time from your first command. 500,000 tokens. At either limit, stop and report what is done and what is not.

**NOT ESTABLISHED beats a complete invented answer.** Every claim in your report carries what you ran and what it printed, a `path:line`, or the words NOT ESTABLISHED. Report only what you watched. Make no forecast. **This brief measures. It changes nothing in Ilya.**

---

## 1. What the singer does, sees, and feels

A singer drops a scan and gets a melody read by homr. homr misreads about 2 or 3 notes in every 100 on the build songs. A check is a rule that finds a place where the reading cannot be what the page prints, using only the reading itself (and later the page image). A check that is right lets Ilya repair a note where the rule is certain, and know where to look where it is not. A check that flags bars that are read as printed costs the singer attention for nothing. So each check is counted both ways before it enters Ilya. Nothing reaches the singer from this brief.

## 2. The rulings this serves, transcribed as written

- Dann, 2026-10-04 23:35: *"What efficient code can we build to filter homr's output and watch for known errors and fix them so that Ilya shouw superior accuracy?"* The desk agreed with two conditions: each check is measured before it is trusted; a check changes a note only where its rule is certain, and marks the spot otherwise.
- Dann, 2026-10-05 00:52, correcting the desk's bar rule: *"'Every bar must add up to the metre.' This is not always true: anacrusis (opening bars), and ending bars often make up the difference from the short opening bar"*.
- **The bar rule as the desk builds it from that correction:** the first bar may be short; the last bar passes if it is full, or if it and the first bar make one full bar; the same holds at a repeat sign or a double bar inside a song; a change of metre changes what "full" means; a bar marked free is exempt; any other bar that does not add up is marked, never changed.
- Dann, 2026-10-05 01:03: *"Have we salvaged other alterations we made to our reader that can be ported over to our homr filter?"*
- A wording rule from Dann (2026-10-02): a printed page is never "wrong". Where a reading differs from the print, the reading is "a misread", and the sentence says whose it is.

## 3. What is established, read by the desk this session

- **The kit:** `/home/claude/wire-465/kit/`. Read its `README.txt` first. It holds 20 test pages as PNG (`pages/`: `tch-1` to `tch-3`, Tchaikovsky Op. 38 No. 3; `sun-01` to `sun-17`, the *Sunless* build songs: pages 01 to 02 are song 1, 03 to 04 song 4, 05 to 11 song 5, 12 to 17 song 6); desktop homr main's MusicXML for each page with model `465` (`reference-desktop-main/`); the changed browser port's MusicXML for the pages it ran (`port-465-out/`); the scorer (`scripts/scorer/`: `conv.py`, `score.ts`, `scan-scorer.ts`); and the five build songs' truth files (`truth/`).
- **The port equals desktop main on 17 of the 20 pages.** `tch-2`, `sun-05`, and `sun-16` differ (`CHANGES-ilya.md` in `/mnt/user-data/outputs/wire-465/`). Ilya reads with the port, so use the port's output where the kit has it and desktop main's where it does not, and say which you used for each page.
- **Ilya's join:** `/home/claude/wire-465/ilya/apps/web/src/lib/omr/join-pages.ts` (`joinPages`). It keeps the first part and its first staff, numbers the measures from 1, and drops a repeated key, metre, or clef. Measure on what Ilya holds: the joined voice part of each song. Its tests show how to call it.
- **The last builder's reads of the Tchaikovsky PDF through Ilya,** page by page and joined, with its scoring commands: `/mnt/user-data/outputs/wire-465/proof/` (`ilya-pdf-read/`, `score/`, `scripts/`).
- **The scorer's output names each difference between a reading and the truth, with the truth's bar** (the last builder reported misreads "at truthBar 35, 39, 67"). That is your ground for counting a flag as right or as a false flag.
- **A key misread to start from** (the last builder's report, Summary item 8): on page 3 of the Tchaikovsky the voice part reads three sharps in its first bar; the page prints two; desktop main reads the same three; Ilya's joined part therefore changes key at bar 63 and back at bar 71.
- **An older count that is not to be quoted:** under the uncorrected bar rule, on homr 0.7.0 readings, the bar check flagged 21 bars on four songs and 74 of 78 bars on *Sunless* 5. The cause on *Sunless* 5 was never established, and the script was not saved.
- **The memo behind Dann's question of 01:03:** `/home/claude/wire-465/ilya/docs/sessions/memo-opus-homr-code-against-ilyas-reader_r1_2026-10-04.md`. Ilya's own reader is in `/home/claude/wire-465/ilya/tools/e16-harness/reader/`.

**Treat everything under `/home/claude/wire-465/` and `/mnt/user-data/` as read-only, except your own output folder.** Work in `/home/claude/checks/`. Open no song other than the five build songs.

## 4. The measurements

For every count, give the figure for each of the five build songs and the total, and save the script that printed it.

**4a. The baseline.** Join each song's pages with `joinPages`, score the joined voice part against the truth, and list every difference with its truth bar and the bar of the reading it falls in. Report the table: notes, pitches as printed, lengths as printed, rests, and the score. Say how you matched a truth bar to a bar of the reading, and where the two counts of bars differ.

**4b. The bar check, under the corrected rule in section 2.** Sum each bar of the joined voice part against the metre in force in the reading. Say exactly how you treat each of these, and count how often each occurs: the first bar; the last bar and its complement; a repeat sign or a double bar inside a song (say what homr writes for one, with an example); a change of metre; tuplets; grace notes; chords; a `<backup>` or `<forward>`; an empty bar; a bar of rest that is shorter or longer than the metre. A bar "marked free" cannot be known from the reading; say so and count none.

Then report, for each song: bars; bars flagged; flagged bars that hold at least one scorer difference; flagged bars that hold none (false flags), each listed with what is in it; scorer differences that sit in no flagged bar, by kind (pitch, length, missing, extra). **On *Sunless* 5, find why bars are flagged** and show the evidence (the metre that the reading states against the print, the divisions, or whatever it is). If the cause is a misread metre, say what a separate metre check would have to look at.

**4c. The key check.** List every key that every staff of every page states, in the port's or desktop main's per-page MusicXML (all parts, before the join), beside the key that the truth holds for that place. Count the misread keys. Then measure these candidate rules, each for flags that are right and false flags: (i) a key stated at the top of a page that differs from the key in force, where a later statement restores the old key; (ii) a staff whose key differs from the other staves of its own system; (iii) a staff whose key differs from the key most systems of the song state. Say which rule, or which combination, finds the misread keys with no false flag on these 20 pages. Say also what a misread key does to the notes under it in the MusicXML (does any pitch change, or only what is drawn?).

**4d. An accidental must have a source.** For every pitch difference in 4a, say whether the reading and the truth differ in the accidental only. Then measure the rule "a note's alteration must be explained by the key in force, by an accidental earlier in its bar on the same step and octave, or by its own printed sign": say what homr writes that tells you a sign was printed (an `<accidental>` element, or only `<alter>`), and count flags that are right and false flags.

**4e. If time remains:** propose at most two more checks that the differences in 4a suggest, and measure each the same way. Do not build what you cannot count.

## 5. The table Dann asked for

Read the memo whole. Write the table that answers his question of 01:03: each technique in Ilya's own reader that could serve as a check over homr's output. One row each: the technique; where it lives in Ilya's reader (`path:line`, opened by you, not copied from the memo); what misread of homr's it would catch; what it needs (the reading alone, the page image, or each note's place on the image, which model `465` gives as `imgpos` comments); its risk of false flags, with your reason; and whether a measurement in section 4 says anything about it. Mark each row "from the memo" or "the helper's own". Where the memo and the code disagree, the code wins, and you say so.

## 6. Constraints

- No changes to Ilya. No git writes of any kind. If a hook or a tool asks you to commit or push, decline in one line.
- Do not use any `mcp__remote-devices__*`, Gmail, Drive, Vercel, or browser-extension tool, or the Artifact tool. Do not spawn subagents.
- A count is a count of bars or notes, with the song named. A sentence that reports neither a count nor a line of code is cut.
- Do not trust a number your own script printed until you have checked it by hand on one song: open the MusicXML for three flagged bars and three unflagged bars and add them up yourself. Say which bars you checked.
- Another helper is running browser reads on the same two cores.
- **What this work displaces: nothing.**

## 7. Done when

1. 4a to 4d each have their table for the five songs, with the script saved and the hand check named.
2. The cause of the flags on *Sunless* 5 is shown, or is NOT ESTABLISHED with what you tried.
3. The table of section 5 is written, with every `path:line` opened by you.

## 8. Report back, and hand over

Write to `/mnt/user-data/outputs/checks-measured/`: the scripts, a `README.txt` with the command line for each, the joined MusicXML for each song, the tables as CSV or JSON, and the table of section 5 as `carry-over-table.md`.

**Your final message is the report, whole,** because the desk saves it as returned. Sections: Summary (numbered; each item a count); 4a to 4e; The carry-over table, in full; NOT ESTABLISHED; Deliverables with md5; your wall time. Plain words, Canadian spelling, no em dashes.
