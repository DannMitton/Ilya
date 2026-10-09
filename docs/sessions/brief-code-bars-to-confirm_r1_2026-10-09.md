# Brief for Code: which bars to confirm (Corrections slice 1, r1, 2026-10-09)

Written by the desk (Opus) 2026-10-09 about 01:05. **For the cloud lane** (a Claude Code cloud session on branch `cloud-lane`), Sonnet, beside Code on the Mac, which is on QUEUE row 57. Slice 1 of `plan-corrections-build_r1_2026-10-08.md`; QUEUE row 51 is slices 1 and 2. It is pure: a new module with tests, and no change to `+page.svelte`, `CorrectionSurface.svelte`, `Loupe.svelte`, or anything in `apps/web/src/lib/omr/` or `tools/e16-harness/`.

## What the singer will get from it (not in this slice)

After a scan is read, a line on the Paper says how many bars to confirm against the singer's own score, and each such bar carries a quiet wash in Markup. The review then walks them, "1 of 5". **This slice builds only the list of bars and what each reads as.** Nothing on screen changes.

## 1. What was observed

- Row 37, measured by Code on the Mac (`docs/sessions/report-code-bars-against-the-printed-metre_r1_2026-10-08.md`): on the 17 opened and build songs, 10 of 723 bars that hold an event do not fit the printed metre, and 9 of those hold a real misread. Against homr's own metre, 65 do not fit, and 47 of those are Grechaninov's, where homr states the printed 6/8 as 4/8.
- Dann, 2026-10-05 00:52 (`docs/memory/OPEN.md`, N.178, item 22): *"'Every bar must add up to the metre.' This is not always true: anacrusis (opening bars), and ending bars often make up the difference from the short opening bar"*. The same holds at a repeat sign or a double bar inside a song.

## 2. What is established (read by the desk 2026-10-09 00:58 to 01:04)

- `measureFill(line, measureIndex, signature)` (`apps/web/src/lib/score/entry.ts:412`) returns `{ actual, expected }` in the signature's own beat unit where a bar's events disagree with its signature, else null. It knows nothing of pickups or a completing last bar. The Loupe's bar tag uses it (lead, from the plan).
- `metrePerMeasure` (`packages/score-parser/src/phonation.ts:277`) takes each measure's length from `expectedDuration`, else `timeSignature`, and sets aside a measure marked `isPickup`.
- `aggregatePhonation` (`phonation.ts:306` onward) names a bar `untrusted` only where its two readings of length disagree and neither fits the metre (`phonation.ts:327-346`). A bar whose readings agree and that does not fit is `agreed`. That is the narrower check behind the Insights words "does not add up" (`apps/web/src/lib/i18n.ts:1616`, `:1681`; `apps/web/src/lib/insights/insights.ts:359-362`, `:511-512`).
- `VocalLineEvent` does not change, and nothing in `apps/web/src/lib/score/reconciliation/` is rebuilt (`docs/memory/CONTRACT.md`, section 6).

## 3. Measure before you change anything

1. What a parsed score carries that the bar rule needs: the pickup mark, the final bar, repeat signs, double bars, and a metre change. Name each field with its `path:line`, and say which the parser drops.
2. Run `measureFill` and `aggregatePhonation`'s verdicts over every tracked `.musicxml` fixture in the repository (`git ls-files '*.musicxml'`; 58 at `53035bd`). Count, per file, the bars each one names. Report the table before you write the new module.

## 4. What to build

One function, in a new file of your naming under `apps/web/src/lib/score/`: given a parsed score, the bars a singer is asked to confirm, in order, each with its measure number as printed and what it reads as against its metre, in the signature's beat unit (as `measureFill` says it: "3 of 4").

- A bar is named where its written length differs from the metre in force.
- **Not named, by the bar rule:** a first bar shorter than its metre; a last bar that, with the first, makes a whole bar; and the same pair either side of a repeat sign or a double bar. Where the parser does not carry a repeat or a double bar, say so, apply the rule where it can, and do not guess one.
- It changes no note and stores nothing.
- DESK DEFAULT, reversible: use `measureFill`'s arithmetic rather than a second copy of it.

## 5. The rulings this serves

- **The page is the authority, not the arithmetic. Dann, 2026-10-08 15:50** (`OPEN.md`, "THE CORRECTIONS REDESIGN", item 5). So the list asks the singer; it never repairs.
- **Curation offered, never imposed** (`OPEN.md`, THE CORRECTIONS REDESIGN, items 1 to 4).
- **The bar rule, Dann 2026-10-05 00:52**, quoted in section 1.

## 6. Constraints

- No string a singer sees is added; the strings are ruled elsewhere and seated in slice 6.
- Do not change `measureFill`'s behaviour or the Insights check; this function sits beside them.
- Commit and push to `cloud-lane` only, by Dann's ruling of 2026-10-02 02:37 (`CONTRACT.md`, section 5). Never `Shane` or `main`. No pull request. Dann merges.
- **What this displaces:** nothing. It runs in the second lane beside row 57.

## 7. Done when

- The table of section 3.
- Tests: a bar short by a beat is named with "3 of 4"; a pickup is not; a pickup and the last bar that completes it are not; a bar too long is named; a metre change mid-song is honoured; a bar that fits is not named.
- The same function's list over the 58 fixtures, beside `measureFill`'s count, with every difference explained by the bar rule.
- All eight gates, against: 1 `251 passed (251)`; 2 `235 passed (235)`; 3 `found 0 errors and 12 warnings in 5 files`; 4 `2035 passed (2035)` plus your new tests, named; 5 `650 passed | 5 skipped (655)`; 6 `145 passed (145)`; 7 `55 passed (55)`; 8 `ratchets: OK.`

`WRITTEN` on the code. Its run on the 17 song readings is for Code on the Mac after row 57, because those readings are not in the repository.

## 8. Report back

`docs/sessions/report-code-bars-to-confirm_r1_2026-10-09.md`: section 3's answers and table first; then the change with its `path:line`, the tests, the gates, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Push, and stop.
