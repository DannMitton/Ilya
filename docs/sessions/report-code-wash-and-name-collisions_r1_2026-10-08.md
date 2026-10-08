# Report: a lighter wait squircle, and pitch names that never overlap (r1, 2026-10-08)

Answers `brief-code-wash-and-name-collisions_r1_2026-10-08.md` (QUEUE row 46). Written by Code (Sonnet), base `9cfcd17` plus rows 43 to 45 uncommitted. No git writes. **WRITTEN, not DONE: DONE is Dann's look on the alias.**

## Part 1: the wash

| Where | What |
|---|---|
| `apps/web/src/app.css:156-158` | `--sage-wash #E6E9E3`, `--lavender-wash #EAE7EC`, `--rose-wash #EEE5E5`: each family's band (`--sage #839275`, `--lavender #9585A2`, `--rose #AB7F7F`) at 20 percent over white, computed by script, not copied. They match the desk's drawing to the digit. Beside the desk tokens, with a comment. |
| `apps/web/src/lib/omr/wait.ts:68-72` | `waitColours` fill is the wash for each tab; ink stays `--sage-ink`, `--lavender-ink`, `--rose-ink`. `ReadingWait.svelte` reads `--wait-fill` and needed no change. |
| `apps/web/src/lib/omr/wait.test.ts` | The three pinned fills now name the wash tokens; one new test reads `app.css` and checks each wash is 20 percent of its band over white and each desk token is 40 percent, so the two cannot drift apart. |

Seen in the browser on each tab (squircle during a reader run of a test PDF): computed background `rgb(230, 233, 227)` on Text, `rgb(234, 231, 236)` on Markup, `rgb(238, 229, 229)` on Insights; ink unchanged. Screenshots: `docs/sessions/wait-shots/wait-text-wash.png`, `wait-markup-wash.png`, `wait-insights-wash.png`.

## Part 2: no two names overlap

**Cause.** A sharp spelled on a white key (E♯4 is F4's row, B♯4 is C5's) sits half a step from the next sharp, 5.5 px, while a name needs about 10. Row 43 put each name level with its row and checked Tchaikovsky only, whose rows are 11 px apart.

| Where | What |
|---|---|
| `apps/web/src/lib/insights/tessituragram-layout.ts:74` | `spreadApart`: positions as near their rows as possible yet at least `NAME_GAP = 10.5` apart (`:58`, ink 9.9 plus a hair), order kept, least squares by pooling adjacent violators. Pure, tested. Type size unchanged. |
| `tessituragram-layout.ts` (the names loop, was `:397`) | Each column (naturals left, accidentals right) is spread; a name that has moved more than 1 px from its row is joined to it by a leader: solid, **0.6 px, `--rose-ink`**, no arrowhead, from the name's right edge to the bar's start. These go in the same `leaders` list as row 42's. A song with room has no leaders. |
| `tessituragram-layout.ts:471` (`spansAround`) | Found while testing: a bar's label could sit on a **passaggio dashed line** (a bar label on the longest bar at the line's height). The dashed lines now break around bar labels, as the faint stave lines already did. This is the same rule ("no label touches a line"), not in the brief's text. |
| `tessituragram-layout.test.ts` | New block "no two names touch": `spreadApart`; a chromatic run E3 to G♯3 with E♯3 (leaders drawn, none overlapping, English and French); B♯4 with C♯5 above it in a treble clef; two octaves of every semitone with passaggi, tessitura, and the bracket (English and French); and Tchaikovsky unchanged (no leaders). The row-43 name tests now sort by height. |

**Real figure, Grechaninov.** The reader took 566 s on the desk's own WebAssembly run and did not finish in 25 minutes in my headless Chromium (no WebGPU adapter), so I could not read the PDF here. I rendered the figure from **the MusicXML that same reader produced from `grechaninov_op20-4_uznik.pdf` on 2026-10-07** (extracted from `heldout-out.tgz`, only that one member; no other scan was touched), dropped into the dev server with a typed test voice (mezzo, range G3 to A5, tessitura C4 to F5, primo E4, secondo A4). The figure is 570 by 390 (a G♯2 to G♯6 compass, because piano notes are read as voice). **No contact in English or French**, measured on the live render with ink boxes against every bar, line, and label. Screenshots: `docs/sessions/tessituragram-shots/grechaninov-{en,fr}-collisions-fig.png` and `grechaninov-{en,fr}-desk-collisions.png`. C♯5 and B♯4 now stand clear of each other, as do F♯4 and E♯4, and G♯3 and F♯3; C♯6 and B♯5 are spread too.

A thing to judge by eye: where a name moves only 2 to 5 px its leader is a very short, steep tick beside the name (visible beside F♯5, C♯6, B♯5, E♯4). It is correct by the rule but reads small. A longer leader would need the name to sit farther from the bars; say if you want that.

## Gates (one at a time)

| Gate | Result | Baseline |
|---|---|---|
| 1 phonology | 251 passed | 251 |
| 2 dictionary | 235 passed | 235 |
| 3 web-check | 0 errors, 12 warnings, 5 files | same |
| 4 web-test | **1997 passed** | 1991; **+6**: five in `tessituragram-layout.test.ts`, one in `wait.test.ts` |
| 5 score-parser | 650 passed, 5 skipped (655) | same |
| 6 blurb | 145 passed | 145 |
| 7 integration | 55 passed | 55 |
| 8 ratchets | OK | OK |

`ilya-ship.sh` line 79 needs 1997 for rows 44 to 46 (1979 → 1997: row 44 +7, row 45 +5, row 46 +6).

## Could not establish

- **The reader's reading of Grechaninov through the uploader in this environment** (above): the figure came from the desk's earlier reading of the same PDF, not a fresh read, and the notes may differ from what Dann's iMac produced a day later.
- **Whether the displaced names read well on paper:** no print was made. Part 2 is checked on the screen render; the screenshots are not print media.
- **Page fit with a 390 px figure.** The Grechaninov figure is far taller than Tchaikovsky's 217 px. I did not run the page-one fit on it; the page-one fit measures the live page, but I did not look.
- **A leader crossing the other column.** A name moved in the left column has its leader pass across the right column's x range. The contact check passed on every fixture and on Grechaninov, but the layout does not search for another place if a leader would cross a name; it would show as a contact in `contacts`. None did.
- **Two or more leaders from adjacent rows** can run close together in a very dense run; they did not cross in the fixtures, but nothing asserts they cannot.
- The dev server is still running on 5173 (`ilya-web`).
