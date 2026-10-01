# Report from Code: three rulings seated (QUEUE row 2f)

Code, 2026-09-30. Brief: `brief-code-seat-missing-rulings_r1_2026-09-30.md` (three sections, including §3 added at 22:16). Read on branch `Shane` at `93bc639`, working tree dirty with the uncommitted rows 2b to 2e. No git writes.

## Summary

- **The Insights heading** reads the ratified sentence in both languages and renders on one line at desktop and at phone width.
- **A leap is a minor sixth.** Both defaults are 8. On Dann's library, for Mitton's voice, **no comment and no watch-band line appears or disappears**, and no stake moves.
- **The two calibration strings** are seated verbatim. The pointer's caption now names the vowel.
- **Gates:** all eight at baseline before and after. Gate 4 stays at 1760: two gate tests were rewritten, none added.

## 1. The Insights heading

`apps/web/src/lib/i18n.ts:1497`, with a four-line comment above it carrying the history: English ruled 2026-09-22 (`OWED.md` "Rulings Dann owes" item 2), French desk-drafted and ratified 2026-09-30 21:30, « relevés » chosen over « mesures », and the strings it replaces.

- EN: "Ilya reads your compatibility from these three measurements."
- FR: « Ilya évalue votre compatibilité à partir de ces trois relevés. »

**Checked live** at `http://fitcheck.localhost:5173/` (a fresh origin, so no stored song was touched), with a seeded voice carrying Mitton's fR1, fR2, range, and passaggi, and Sunless 05 loaded. `InsightsPane.svelte:632` draws it as a `.section-head`.

| Width | Language | Lines | Overflow |
|---|---|---|---|
| 1024 | English | 1 | none (570 px of the squircle's 624) |
| 1024 | French | 1 | none (570 px) |
| 390 | English | 1 | none |
| 390 | French | 1 | none |

At 390 px the line does not rewrap: the whole sheet scales (`paper-scale`, factor 0.419), as every line of the Insights page does. So "wraps cleanly" holds in the sense that nothing wraps and nothing overflows.

**For Dann (taste), one line:** `.section-head` sets the heading in all small caps, letter-spaced, as a label. The heading is now a full sentence with a period, the only one among the page's section heads.

## 2. A leap is a minor sixth

| Where | Before | After |
|---|---|---|
| `insights/comments.ts:60` `COMMENT_DEFAULTS.leapSemitones` | 7, "build default" | 8, comment cites Dann 2026-09-23 00:27 and `method-leaps_r1_2026-09-22.md:254`, and says to change both together |
| `analysis/gates.ts:69` `GATE_DEFAULTS.leapSemitones` | 7 | 8, the same citation |
| `analysis/gates.ts:142` (doc comment on `leapsAcrossPassaggio`) | "a fifth" | "a minor sixth" |

**Tests that pinned 7** (`analysis/gates.test.ts`): the transition test now leaps a minor sixth (49 to 57) and expects stakes 4; the negative test now leaps a fifth (50 to 57) and expects no transition, so the ruling's boundary is pinned on both sides. The gate 2 fixture moved from 50 to 49 so its comment ("stakes 2 × 2 = 4") stays true. `insights/comments.test.ts` pins no leap of exactly 7 and passes unchanged.

### What changes on Dann's library

A scratch probe (not in the tree; moved to the scratchpad before the gates) ran every `.musx` in `~/Documents/Finale Files` through the app's chains, `MarkupPane.svelte`'s for the watch band, as `gates-trial.run.ts` does, then `noteFacts`, `noteComments`, and `selectComments` for Insights. Voice: Mitton (`gates-trial.run.ts:53`), no intake answered. Each song ran at 7 and at 8 through the `defaults` argument.

- **37 files read; 1 failed** (BWV 1007, denigma WASM abort, a cello suite with no text).
- **Watch band:** 5 lines printed at 7, 5 at 8, in 4 songs (Kabalevsky T03 and T07, Sunless 03 and 05). None appeared, none disappeared, no stake moved.
- **Insights comments:** 19 notes comment at 7 and 19 at 8. The leap clause rides on 4 of them at both (T01 three, T02 one). The budgeted set shown is identical in every song.
- **Why nothing moved:** 124 ascending approaches of exactly a fifth exist across the files (298 either way), but none of them lands on a note that comments or carries a passaggio watch line for this voice. The leap threshold only adds a clause or a demand to a note that already qualifies; it never makes a comment fire by itself (`comments.ts:317-318` decide whether a note comments; the leap is read after, at `:327`).

**NOT ESTABLISHED:** the effect for any other voice. The probe ran Mitton only; the six literature voices of `frequency-run.run.ts` were not run.

## 3. Two calibration strings

`apps/web/src/lib/i18n.ts:1157-1158`, verbatim, with a comment carrying the ratification (Dann 2026-09-30 22:16, drafted by Code in `report-code-sing-first-then-fry_r1_2026-09-30.md`).

- `pacifier.wheelAria` EN "Vowel calibration. Tap a vowel to begin, tap again to cancel, long-press to skip." FR « Calibration des voyelles. Touchez une voyelle pour commencer, touchez-la de nouveau pour annuler, appuyez longuement pour l’ignorer. »
- `pacifier.ready` (new) EN "Tap {v} to begin." FR « Touchez {v} pour commencer. »

`Pacifier.svelte:584`: `activateVowel()` now announces `say('pacifier.ready', g)`, which substitutes the spoken vowel for `{v}` (`Pacifier.svelte:105`), replacing the DESK DEFAULT `pacifier.tapToCapture`. That key stays in use as the wheel's opening caption (`Pacifier.svelte:259`).

**Not walked:** the caption was not seen live. Reaching the pointer needs the wizard's readiness phase and a microphone; the type check and gate 4 pass.

## Gates

Run from a scratch copy of `~/Downloads/ilya-ship.sh` that cannot stage. The "before" run started before the edits; gates 1 to 3 read the untouched tree, gates 4 to 8 overlapped the edits. The "after" run is clean.

| Gate | Before | After |
|---|---|---|
| 1 phonology | 251 passed (251) | 251 passed (251) |
| 2 dictionary | 235 passed (235) | 235 passed (235) |
| 3 web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files |
| 4 web-test | 1760 passed (1760) | 1760 passed (1760) |
| 5 score-parser | 636 passed, 5 skipped (641) | 636 passed, 5 skipped (641) |
| 6 blurb | 145 passed (145) | 145 passed (145) |
| 7 integration | 55 passed (55) | 55 passed (55) |
| 8 ratchets | OK | OK |

## Files changed

- `apps/web/src/lib/i18n.ts` (three keys, two comments)
- `apps/web/src/lib/insights/comments.ts`
- `apps/web/src/lib/analysis/gates.ts`
- `apps/web/src/lib/analysis/gates.test.ts`
- `apps/web/src/lib/voice/pacifier/Pacifier.svelte` (one line)
