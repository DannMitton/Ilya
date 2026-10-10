# Brief for Code: the four sealed songs below 95, opened and diagnosed (r1, 2026-10-09)

Written by the desk (Opus) 2026-10-09 about 12:35. For Code on the Mac, Opus. QUEUE row 61. **Dann opened K, L, M, and P for diagnosis at 12:30:** *"Code may open K, L, M, and P to find out why they fail"*. The other six (G, H, I, J, N, O) stay unopened.

## Why

THE ONE THING (`docs/memory/STATE.md`) is not met. Row 55 (`report-code-the-final-test_r1_2026-10-08.md`) scored the ten sealed songs at 76.8 with the UNSURE notes set aside; six pass and four do not:

- K: 133 of 134 right, **107 extra**, bars 51 of 53, score 19.5
- L: 72 of 82 right, **116 extra**, pitch 4, length 6, bars 82 of 76, score -55.0
- M: 62 of 62 right, 7 extra, bars 35 of 26, score 88.7
- P: 89 of 116 right, **27 length misreads**, metre as printed 0 of 34 bars, score 77.9

Nobody has looked at why. The truth files are unproofed drafts, so each fault may be the reader's or the truth's.

## The work, in order

1. **Name the four.** Map K, L, M, P to their scan and truth files through the private folder row 55 used. Say each song's composer, title, and opus in the report; it is no longer sealed.
2. **Check the truth against the page first**, as row 53 did, for every bar the scorer marks extra, misread, or missing. Where the truth departs from the print, record the bar, what the page prints, and what the truth says. Do not edit a truth file silently: write corrected copies beside the originals (`*.truth.corrected.json`) and score each song against both.
3. **Diagnose the reader's faults bar by bar.** For each song, say where the extra notes come from (which staff, which system, which page), why the bars read differ from the bars printed, and, for P, why the lengths and the metre disagree with the print. Tie every cause to a file and line in `third_party/homr-web/` or `apps/web/src/lib/` read this session. If a cause is the same as a fault already fixed (row 49, a piano read as the voice; row 53, a title page read as music), say which rows and why the fix did not reach this page.
4. **Fix only what is general.** A fix stays only if (a) it is a rule about notation, not about these four songs; (b) the 17 opened and build songs and the five unseen A, B, C, E, F read byte for byte as before, or better, with any change listed; and (c) the six sealed passes G, H, I, J, N, O read byte for byte as before, checked by script without opening them (print only "same" or "changed" per song). A fix that fails any of the three is taken out and described instead.
5. **Score** each of the four again, before and after, against the original truth and the corrected truth, with `docs/sessions/measure-final-test_r1_2026-10-08/final-line.ts` as row 55 ran it (node with type stripping).

## Constraints

No git command that writes. Do not open G, H, I, J, N, or O. Do not change the scorer or `final-line.ts`. Any new file under `apps/` or `third_party/` is listed so Dann can `git add` it before the ship. If a fix touches homr-web, bump its version (`0.2.0-ilya.6`) and say so. Stop and report if a fix would need a change to `VocalLineEvent` or `apps/web/src/lib/score/reconciliation/` (CONTRACT §6).

## Report

`docs/sessions/report-code-the-four-below_r1_2026-10-09.md`: the four names; per song, the truth check (bars, print, truth), the causes with file and line, the fixes kept and taken out, the before and after lines against both truths; the regression checks (17 plus 5 opened, 6 sealed: same or changed); gate 4's new count if tests were added; and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Set QUEUE row 61's State, say so in one line, and stop.
