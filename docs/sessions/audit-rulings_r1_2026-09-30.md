# Audit: rulings recorded but not in the code

Tree: `/home/claude/tree/` (uncommitted work). Sources: `docs/memory/OPEN.md`, `PRODUCT.md`, `CONTRACT.md` §6, `OWED.md`, `STATE.md`. Excluded: QUEUE rows 1 to 13, audits A and B findings already reported, deferred items, DESK PROPOSAL items, and the 2026-09-29/30 distillation rulings. I did not run the app or the tests. All verdicts are from reading and grep.

## A. NOT IN TREE (10)

1. **Corrections FLIP tween.** Recorded: OPEN.md clause 14, ruled 2026-09-18, refined by two-modes ruling 3 (2026-09-19/20). Four parts: notes and rests move while carets fade 0 to 0.32; perimeter moves on the same curve (about 220 ms in, 150 ms out); toggle locked during the tween; Escape, swipe and chevron stay live. Evidence: `grep -n -i "flip\|reduced-motion\|transition" score/Loupe.svelte` finds only an unrelated 150 ms width transition (`:2754`, `:2949`). Only keyframes are `loupe-rise` (`:2738-2741`). Carets are created with static opacity 0.32 (`Loupe.svelte:1764`). `loupe-panel.svelte.ts` has no lock. It was "deliberately unnumbered, waits on N.149"; N.149 has closed, so the blocker is gone.
2. **Meter run-in 1 sp in the loupe (page keeps 2).** Recorded: OPEN.md clause 16 and two-modes ruling 7, ruled 2026-09-20, marked "NOT BUILT" 2026-09-21. Evidence: `staff-renderer.ts:169` `METER_RUN_IN_SP = 2`; `loupe-render.ts:55-79` passes no run-in override.
3. **Tie runs into the loupe's run-on with a tapered end.** Recorded: clause 16 and two-modes ruling 9, 2026-09-20. Evidence: `grep -i taper` in `Loupe.svelte`, `loupe.ts`, `loupe-render.ts` is empty; the tail panel draws only `<line>` elements. The stave run-on itself exists (`loupe.ts:611` `EXCERPT_TAIL_SP = 1`, used at `Loupe.svelte:907`).
4. **Squircle spans a tie** (and the barline and system-break treatments). Recorded: OPEN.md N.141 "A LATER INCREMENT", ruled 2026-09-15. Evidence: `selection-ring.ts` has no tie logic. Borderline: the heading says "later increment", and N.142 step 1 has shipped (`c868540`), so it may count as deferred. Flagged for Dann.
5. **Tempo control and station.** Recorded: OPEN.md N.120 (2026-09-10 late), "tempo anywhere" (2026-09-17), control lives in the loupe (2026-09-23). Evidence: `MarkupPane.svelte:728` ("No tempo override is passed, because the singer has no way to set one yet"); `i18n.ts:1565-1569` `insights.phonation.tempoPointer` is "WRITTEN, NOT SHOWN".
6. **Edited score comes back out as an edited copy.** Recorded: PRODUCT.md "WHAT THE SINGER MAY DO TO A SCORE" item 3; OPEN.md N.151, 2026-09-17. Evidence: grep "edited copy" empty; no score-export code. Hedged ("Ideally"); consequence clauses are DESK DEFAULT.
7. **`insights.fit.heading` English.** Ruled 2026-09-22 (OWED.md "Rulings Dann owes" item 2): "Ilya reads your compatibility from these three measurements". Tree still reads "The fit, in its terms" / « La correspondance, terme par terme » (`i18n.ts:1480`, used `InsightsPane.svelte:632-633`). `grep compatib i18n.ts` is empty. The "compatibility" versus "fit" term question is unanswered.
8. **N.122 capture surface as a landmark.** Ruled 2026-09-10, status UNPLACED. `CalibrationWizard.svelte:1283-1507` still uses mutually exclusive `{#if phase === ...}` phases.
9. **Backlog items UNPLACED, not date-deferred** (reported separately; not counted as drift in the headline): N.115 Finale-style measure-to-system layout control (2026-09-06, 2026-09-14; `grep systemBreak|forceBreak|pushMeasure|moveMeasure` empty); N.117 progress bar on load (2026-09-07; `input.transcribeLoading` is a text string; only `progressbar` role is in the wizard).
10. **Delete or clear poem text says how many placed syllables it will free.** PRODUCT.md "THE TEXT AND THE NOTES", under a heading ruled 2026-09-17, but the sentence reads as desk wording. `IntakePanel.svelte:463` calls `onclear` with no confirm; no matching string in `i18n.ts`. Scope disputed.

## B. PARTLY (4)

1. **"Insights forecasts, it does not declare" (2026-09-27).** Headings done (`GuideContent.svelte:58`, `:335`). Body still says `<em>Fit</em> forecasts; it does not declare` (en `:336`, fr `:60`), "Fit's analysed score" (`:350`, `:73`), "Transcription, Fit, Learn, and Guide" (`:370`, fr `:93`), "Transcription tab" (`:122`, `:399`). This contradicts audit B's claim that no stale "Transcription tab" text remains. Unclear whether these captions belong to N.84 or N.154.
2. **Cycle dose (N.123, 2026-09-10).** Falsetto caveat "one line on the screen" is computed (`analysis/score-metrics.ts:126` `foldCycles`) but never rendered. Half-mass band and centre of gravity absent (formulas NOT ESTABLISHED, "coined wording").
3. **Page flag for an over-full measure left unattended (N.151, 2026-09-17).** Loupe fill line exists (`i18n.ts:526` `loupe.fill.over`). No page mark found. The mark is a DESK DEFAULT; STATE.md lists it open under N.92.
4. **French punctuation (2026-08-21).** Colon rule clean (script: 0 violations). But eight French voiceIntake strings carry U+202F before `?` (`i18n.ts:1668, 1674, 1680, 1686, 1692, 1700, 1706, 1714`), ratified 2026-09-25 and 2026-09-29 00:07, against the 2026-08-21 "no space before `?`" ruling. Elsewhere no space (`:666`, `:688`, `:1047`). The 2026-09-28 note says the `?`/`!` pairing was "not yet brought to Dann".

## C. NOT VERIFIABLE BY GREP (3)

- **N.167 French waiting line.** Templates call `T()` per render (`ScoreUploader.svelte:536, 562`); whether the language arrives late is runtime.
- **"Paper GUI" as umbrella term (2026-09-28 21:14).** `grep "Paper GUI"` in `lib` and `routes` is empty; unclear if it applies to user-facing copy.
- **Sung/derived/generic origin marks (ratified 2026-09-23 17:15).** Only `comment-text.ts:72` ("Vowels whose fR1 the singer sang, rather than derived"). Whether origin shows on screen is unanswered.

## D. Full table of in-scope rulings checked

| Ruling | Verdict | Evidence |
|---|---|---|
| Tab names Text, Markup, Insights, Learn, Guide (EN/FR) | IN TREE | `i18n.ts:104-106, 115, 119` |
| Band label Voice / Voix; no Melody | IN TREE | `i18n.ts:57`; no "Melody"/« Mélodie » anywhere |
| Tab padding | IN TREE | `DeskHead.svelte:202` |
| "Transcribe and fit", "Continue to analysis" buttons removed | IN TREE | no consumers; dead keys `input.transcribe` (`:173`, French is English) and `upload.continue` (`:899`) remain, unused |
| Intake placeholder and caption | IN TREE | `i18n.ts:629, 641` |
| `intake.placed` « placées », « Retirer », French singulars | IN TREE | `:653, :657` |
| « Calibrer » | IN TREE | `:1000` |
| `loupe.syllables` « Syllabes » | IN TREE | `:402` |
| Loupe French: « syllabe placée », « mélisme défini/effacé », `temps %b`, redo | IN TREE | `:381, 391-392, 363-364` |
| Undo start-over « placement recommencé » | IN TREE | `:384`, `+page.svelte:677` |
| Undo/redo placement (2026-09-09/10) | IN TREE (superseded) | moved to loupe bar by N.115 inc. 3 and two-modes ruling 1 |
| N.164 offer strings | IN TREE | `:1514-1517` |
| Seconds of phonation per vowel; vowel order | IN TREE | `:1550`; `voice/engine/types.ts:26`; `insights.ts:632-644` |
| Squircle: no fill, lavender stroke | IN TREE | `MarkupPane.svelte:1112-1118` |
| Print hides loupe and ruler | IN TREE | `Loupe.svelte:3036`, `TranspositionRuler.svelte:289`, `TranspositionDock.svelte:417` |
| Second press on filled mode pill closes; loupe opens on Syllables | IN TREE | `loupe-panel.svelte.ts` |
| Carets 0.32 opacity | IN TREE | `Loupe.svelte:1764` |
| Rests get a hit rectangle | IN TREE | `staff-renderer.ts:2715` |
| Bar numbers italic, bracket rules | IN TREE | `staff-renderer.ts:1173-1221` |
| Hyphens never dropped | IN TREE | `:3447-3458` |
| Cyrillic underlay Source Serif 4 | IN TREE | `:1147, :3380` |
| Slurs tapered filled objects | IN TREE | `:3351` |
| Stress acute rules (no acute on clitics, inferred, ё) | IN TREE | `WordStack.svelte:55-77` |
| Reconstitution rules | IN TREE | `reconstitution.ts:60-100` |
| Insights "Sources cited" squircle | IN TREE | `InsightsPane.svelte:821-832` |
| Full and row references | IN TREE | `comment-sources.ts:220-239` |
| Comment rotation; performance order | IN TREE | `comment-text.ts:122-200`; `comments.ts:454-458` |
| Intake: acoustics question, topics, "How comments appear" | IN TREE | intake components |
| Voice type list | IN TREE | intake components |
| Insights footer strikes lieder clause | IN TREE | `InsightsPane.svelte:359` |
| N.94 strings | IN TREE | `i18n.ts:1823-1854` |
| Binder export/import order | IN TREE | `RootPanel.svelte:173-176` |
| Voice station has no chevron; METADATA label struck | IN TREE | components |
| Punctuation-in-slot rule | IN TREE | `pairings.ts:186-239` |
| Guillemets on `profile.subtitleNamed` kept | IN TREE | `i18n.ts:1174` |
| No "phonation mass", "fault", "diagnos"; no stale "held" | IN TREE (clean) | grep empty |
| `a11y.paper` is Text | IN TREE | `i18n.ts` |
| `#` mark, Latin | IN TREE | covered by audit B |
| Items A1 to A10, B1 to B4, C | see sections above | |

Excluded or superseded: 2026-09-10 French table rows "2 notes corrected" and "Voice: Dann · 10 of 10" (Corrections left the drawer); opener wording 2026-09-25 (superseded by no-try ruling); N.124, N.152 (LATER); N.163 (defect, no ruled fix).

## What I could not establish

- Any browser-only behaviour (motion, focus, scroll, print output). I did not run the app or the tests.
- N.167 at runtime; the scope of "Paper GUI"; whether origin marks reach the screen.
- Whether item A4 (squircle across a tie) counts as deferred under "later increment".
- Whether the Guide captions in B1 belong to N.84 or N.154.
- Whether the colon and `?` spacing rulings of French are meant to be Dann's final word given the 2026-09-25 and 2026-09-29 ratifications.
- Whether A10 is a ruling or desk wording.
