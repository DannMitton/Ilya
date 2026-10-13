# Brief for Code: N.86's remainder, the dead notation-only overlay (r2, 2026-10-12)

Written by the desk (Opus) 2026-10-12 about 01:47. **r2, about 01:49: applies Fable's amendments 6 to 11** (`docs/sessions/review-fable-briefs-83-84_r1_2026-10-12.md`, SEND WITH AMENDMENTS); r1 superseded. QUEUE row 84, N.86 (`docs/memory/SCHEDULE.md`, week 5). For the cloud lane, Sonnet, after row 83. Fable reviews this brief before Code gets it (`docs/memory/CONTRACT.md`, the paragraph of 2026-10-11 22:36).

## 1. What was observed

- `SCHEDULE.md` week 5 lists N.86's open candidates from the code audit of 2026-09-24: `notation-overlay.ts`, `optimalRegion`, the font lab route, and the `wall.ts` ruling (the line beginning "[CHECKED 2026-10-11 19:40 against git log").

## 2. What is established, each line carrying its `path:line`

Read by the desk 2026-10-12:

- `apps/web/src/lib/analysis/notation-overlay.ts:1-27`: `notationOnlyOverlay`, a stand-in for `analyzeScore` with no acoustic marks, "Replaced by a real `analyzeScore()` call when the two named follow-ups land".
- `apps/web/src/lib/markup/MarkupPane.svelte:535-536`: "This replaces notationOnlyOverlay"; `:721` calls `analyzeScore`.
- A search of `apps/` and `packages/` finds `notationOnlyOverlay` imported only by `apps/web/src/lib/analysis/notation-overlay.test.ts:11`.
- Two comments still send the reader to the removed helper: `MarkupPane.svelte:123-125` ("see notation-overlay.ts for why that is the engine's own semantics") and `:963-964` ("no acoustic marks; see notation-overlay.ts").
- Line numbers in `MarkupPane.svelte` were read after row 78a's edit (`:724-725`) and may move again; locate the two comments by their text: `see` followed by `notation-overlay.ts for why that is the engine's own semantics` (a `/** */` doc comment on the `ingested` prop), and `notation only for now (no` followed by `acoustic marks; see notation-overlay.ts)` (an HTML comment above `.markup-paper-container`).
- `MarkupPane.svelte:719-723`: `analyzed` is `resolveAdvice(analyzeScore(analysisScore, adapted.snapshot, vowelResolver))`, or `null` without a score or resolver. `:837-839`: `scorePages` is `paginateScore(readingScore, analyzed, ...)`. `:788`: `hasAcousticMarks` is true when `analyzed.events` has an entry. So the page draws acoustic marks whenever a vowel resolves against the profile, and the plain vocal line when none does (`:535-537`). Both comments' "no acoustic marks" is false today (read by Fable 2026-10-12).

## 3. Measure before you change anything

1. Run `git grep -n -e 'notation-overlay' -e 'notationOnlyOverlay' -- . ':!docs'` at the repository root and paste the output into the report. Expected: the two files being removed, and `MarkupPane.svelte` at the two comments and `:535`. Anything else (a dynamic `import()`, a ratchet or allow-list under `scripts/`, a `tsconfig` or vitest `include`, an e2e test, a README under `apps/`) is a finding: report it and stop before removing anything.
2. Read `MarkupPane.svelte:118-130` and `:955-970` and say what the page renders today, so the two comments can be rewritten to the truth.

## 4. The rulings this serves

- N.86, the dead-code audit (`SCHEDULE.md`, week 5).
- The 2026-07-13 slice-1 scope ruling the helper carried ("notation first") is superseded in the tree by `MarkupPane.svelte:535-536`; its reasoning (an empty events map draws the plain vocal line, which is the engine's own semantics) moves into the comment at `:535` if it is not already there.

## 5. Constraints

- Remove `apps/web/src/lib/analysis/notation-overlay.ts` and `notation-overlay.test.ts`. Rewrite the two comments in `MarkupPane.svelte` to say what the page does now, keeping the one sentence of reasoning from the helper's header that still holds (`notation-overlay.ts:9-13`). Draft wording, to be checked against section 2's lines before use. For the `ingested` prop: `When present, the envelope's content window carries the rendered score pages instead of the interim copy: real systems and underlay through paginateScore, with the acoustic marks analyzeScore resolves against the active profile (see the overlay block below). With no resolvable vowel or no fR1, analyzeScore omits every event and the plain vocal line renders; that is the engine's own semantics, not a bypass.` For the HTML comment: `The SVG pages come from paginateScore over the analysed score; marks appear only where a vowel resolved against the profile, and an empty events map draws the plain vocal line.` The comment at `:535-537` already carries the reasoning and needs no change.
- **Kept, DESK DEFAULT, do not touch:** `optimalRegion` (`packages/score-parser/src/tessitura.ts:196-215`, exported at `packages/score-parser/src/index.ts:182`). It is unused, but it is twenty tested lines encoding a cited idea (Pacheco, p. 559, the intersection of a repertoire's tessituras) that a library-wide view can use. **Kept:** the font lab route `apps/web/src/routes/notation-font-lab/`, a working dev tool; whether it ships publicly is part of the `wall.ts` question Dann owes, which this row does not touch.
- No other file changes. Gate 4 falls by 5 tests (`notation-overlay.test.ts:17, :21, :29, :38, :43`); report the new count, and report any other number as a finding.
- **Displaces:** nothing. **Sequencing (DESK DEFAULT):** this row starts only from a clone that holds rows 78a to 79's commits, because those rows edit `MarkupPane.svelte` in Code on Dann's Mac (`docs/memory/STATE.md`, handover of 2026-10-12 01:20) and are not yet shipped. The desk names that commit here before sending: `<sha>`. If the cloud lane must start earlier, do only the two file removals and the grep, leave `MarkupPane.svelte` untouched, and say so in the report; the desk then gives the two comment rewrites to the session that holds the file.

## 6. Done when

- No file in the tree names `notation-overlay` or `notationOnlyOverlay` except history in `docs/`.
- All eight gates pass; gate 4's new count is reported with the number of tests removed.
- `WRITTEN` on the code. Nothing for Dann to walk; the page is unchanged.

## 7. Report back

`docs/sessions/report-code-n86-notation-overlay_r1_2026-10-12.md`: the commit, section 6's results, the two rewritten comments quoted, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer.
