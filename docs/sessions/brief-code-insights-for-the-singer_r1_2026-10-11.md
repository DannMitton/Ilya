# Brief for Code: build Insights as Design round 2 drew it (r1, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 04:50. For Code in the cloud lane, Sonnet, **after QUEUE row 64 (one running head, one footer)**, whose shared components this page uses. QUEUE row 66.

## What the singer sees

A singer opens Insights to learn how this piece meets their voice in this key, and to decide later whether to sing it as written, work on it, try another key, or move on (the purpose ratified by Dann 2026-10-10 23:17, `docs/memory/OPEN.md`, "INSIGHTS, REVIEWED AS A PAGE FOR THE SINGER"). The page opens with Ilya's conclusion in plain type, then three boxes: the moments, the totals, the sources.

## The design and its rulings

- **The drawing, accepted by Dann 2026-10-11 03:50:** `https://claude.ai/artifact/LKANkyy67TcChk4hAkQfRW` (version 1791704797-463b, twelve boards: quiet case 3 pages, better key 3, unlikely 4, French page 1, phone page 1). Every value with a blue dotted underline is invented; every NOT BUILT tag marks what this row builds. **Read the boards with the Artifact tool, or ask the desk for the HTML.** Do not copy its fixed pixel positions; build the layout so nothing collides at any length (Dann's standing rule of 2026-10-11 03:42: *"collisions and overlaps are forbidden"*).
- **The structure, ratified 2026-10-11 03:53** (`docs/memory/PRODUCT.md`, "How an Insights page is organized"): the conclusion unboxed and first; squircle 1, the moments ("Where this piece meets your voice"); squircle 2, the totals ("The measures behind these reasons"); squircle 3, the sources ("More to explore, and why", printed as endnotes).
- **Dann's findings on the drawings, all in `OPEN.md`:** the verdict in body type, one paragraph; no "What practice changes" group unless something earns it; vowels in the order of Mitton (2020) Figure 4.2, `VOWELS` in `apps/web/src/lib/voice/engine/types.ts:26`; the cycle-dose sentence first, its bar low to high (under, within, above your tessitura) with a legend; the time-per-vowel ring and bars; squircles may break across a page; nothing clipped.
- **The teacher line, ruled 2026-10-11 00:12 to 00:21** (`OPEN.md`, THE TEACHER LINE): exact English and French there. Line A sits only on a comment that suggests an approach.
- **The French, ratified 2026-10-11 04:12 and 04:14:** `docs/sessions/french-insights-r2_r1_2026-10-11.md`, every row including the rulings at its foot. French pitches are solfège with the French octave index (`CONTRACT.md` §6: scientific A3 is la2); « plis vocaux », never « cordes vocales ». The key « la3 = 440 Hz » appears once, in the method line of a French printout whose prose names a pitch (DESK DEFAULT, `OPEN.md`).

## 1. What to build

1. **The conclusion block.** Heading "How this key sits for you" (existing `insights.verdict.heading`). The verdict is one body-type paragraph. Then the reasons in the ruled order: Range; What another key would change; What practice changes (only when it has a line). The reason sentences are the French table's rows 5 to 9 and their English.
2. **"Unlikely": when Ilya says it. DESK DEFAULT, tethered to the verdict that exists** (`apps/web/src/lib/insights/insights.ts:399-404`, `verdictOf`): the "unlikely" paragraph replaces today's verdict line when the verdict is `outside-range`, or `outside-tessitura` with the piece's tessitura band past the typed tessitura by more than a whole tone at either end. A milder `outside-tessitura` keeps today's line. Its reasons, each printed only when it exists: the share of phonation at or above the primo passaggio (from `phonationSection`'s zones, `insights.ts:528-537`); the longest note held above the secondo, with its bar, pitch, vowel, and seconds; a note outside the typed range, with its bar. It always ends with a way forward: a better key (item 3), or the plain statement that no key fits better, with the teacher line.
3. **"A key that fits better". DESK DEFAULT, built on the search that exists** (`packages/score-parser/src/transposition.ts:571`, `suggestTranspositions`, which searches only when a note is out of range). Add a second search, used when nothing is out of range: within the same window, a key qualifies when it keeps the range and the tessitura contained, adds no passaggio crossings (`countCrossings`), and lowers the share of phonation above the primo by at least 10 percentage points; among those, the largest drop wins, then the smaller move. When one qualifies, the verdict paragraph's second sentence names it, and the readout and "Try this key" follow, as on the better-key boards. The 10 points is JUDGEMENT, stated as a constant in one place, like the file's own.
4. **The moments (squircle 1).** The existing comments (`comments.ts`, `comment-text.ts`), unchanged in content, with teacher line A on each comment that suggests an approach and on no comment that only describes.
5. **The totals (squircle 2):** the cycle-dose sentence and its split bar (under, within, above the typed tessitura; new: split `cycleDose`, `insights/singing-measures.ts:117`, by the typed tessitura); the seconds-per-pitch chart (as built, without the grey clef or hairline leaders); the time-per-vowel ring (share of phonation past each vowel's turn) and one two-shade bar per vowel (before and past its turn, seconds printed, "turns about F3"), in `VOWELS` order. Each vowel's turn is fR1/2 from the singer's calibration, as `comments.ts:166` computes it. A vowel with no calibrated or derived fR1 gets its bar without a turn and says so.
6. **The sources (squircle 3).** The existing "More to explore, and why", with teacher line C first; printed as endnotes.
7. **The opening frame** (teacher line B) under the header, and the method line in the footer.
8. **Phone.** The page reflows at 390 px, as the phone board does; "Try this key" is a real button there.

## 2. Not in this row

The running head and footer (row 64). « plis vocaux » in Learn (row 65). Any change to the comments' own wording.

## Constraints

- No git command that writes, except the cloud lane's own branch rules in `CONTRACT.md` §5: commit and push the dedicated branch only, never `Shane` or `main`, no pull request; Dann merges.
- Every new string in both languages from the ratified table; any string not in it is set in English and marked `[FR: desk draft owed]`, and listed in the report.
- Before and after pictures of the three cases in English, the unlikely case in French, and the phone page, from the dev build, in `docs/sessions/insights-r2-shots/`. Check each for collisions before reporting.
- Tests: the unlikely gate (outside-range; outside-tessitura by more and by less than a whole tone), the better-key search (qualifies, does not qualify, the tie-break), the cycle-dose split, the vowel bars' order, teacher line A present only on approach comments.
- All eight gates; gate 4 is `2088` before row 64's change; say where each count lands.

## Report back

`docs/sessions/report-code-insights-for-the-singer_r1_2026-10-11.md`: each change with its `path:line`, the pictures, the tests, the gates, every string marked owed, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. `WRITTEN` on the code; `DONE` is Dann's look. Set QUEUE row 66 in one line and stop.
