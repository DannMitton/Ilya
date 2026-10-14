# Amendment 1 to row 93's fix (r1, 2026-10-14 about 01:10, desk)

Amends `brief-code-row93-seats-under-old-names_r2_2026-10-13.md` after Code's report `report-code-row93-seats-under-old-names_r1_2026-10-13.md` (168 of 170 moved; «ви» and «чит.» left; «лю!» probably one note late). The desk's rulings on the report's three decisions, each a DESK DEFAULT:

1. **Corrections not re-keyed: ACCEPTED.** Code's reason stands: a correction fixes the old reader's reading, and moved by position onto homr's it could delete a real note. No song in Dann's library holds one. Record the departure in the module's header comment.
2. **`N.185` as the console label: ACCEPTED.** The desk numbers N.185 "a stored scan's seats filed under the old reader's note names find their notes again".
3. **Bar 90 and «ви»: add a raw-position rule, ahead of the bar-relative rule.**
   - After the in-order pass, compute over every seat placed in order the difference between the old key's `x` and the placed note's `imgpos` x. When the median is 20 px or less and the 95th percentile 40 px or less (this song: 9 and 30), the song's two readers share a scale.
   - In that case, in every bar whose counts disagree, pair each old seat with the target whose `imgpos` x is nearest in absolute pixels, accepting the pairing only when it is one-to-one and the distance is 60 px or less. Only bars this rule leaves go to the bar-relative rule, and then to "left under old names".
   - When the scale test fails, behave exactly as now.
   - Expected on this song: «ви» placed, «лю!» on the second eighth (x 1251), «чит.» still left (its note is a tie continuation under homr, so it is not a target). Console `169 seats moved, 1 left under old names, 1 bar left`; Markup 338 / 338.
   - Tests: a song that passes the scale test and places a lone seat; a song that fails it and falls through unchanged; a pairing beyond 60 px refused.
4. **«чит.» stays left.** Whether bar index 56 to 57 is tied in print is for the desk to read off the PDF; nothing to build here.

Done when: the reproduction gives the expected counts above on two reloads; gates pass with gate 4 at 2460 plus the new tests; the report gains a section "Amendment 1" in the same file, with the scale figures and the per-bar table's changed rows. No git command that writes; nothing in `docs/memory/`.

Fable review: not commissioned. This amends a reviewed brief inside its own method, and the change is a pairing rule with a measured basis on this song (DESK DEFAULT under `CONTRACT.md` §1 item 19; Dann may ask for one).

## Amendment 1b (2026-10-14 about 01:15, desk), on Code's open decision

**The scale test requires at least 20 seats placed in order** (DESK DEFAULT). Below 20, it fails and the old path runs. This song has 166. Add one test: 19 in-order seats with tiny differences fail the test. Report gate 4's new count in the report's Amendment 1 section.
