# Fable review: N.199 lane 51 as built (Steps 0 to 6) and brief r1 for Steps 6b and 7

2026-11-13. Filed by the desk (Opus) from the reviewer's hand-back, condensed: the verdicts and every amendment are kept with their sites and fixes; the reviewer's prose around them is shortened. 303,893 tokens (harness count), cap 400k, 49 tool uses, 11 min. Read in the desk's clone at `desk-merge-51` (lane tip `9c1c0698` merged with `Shane` `658e5e76`).

## Verdicts

- A, as built: MERGE WITH AMENDMENTS (five; A1 to A3 before Dann's walk).
- B, brief r1: SEND WITH AMENDMENTS (eleven; B1 and B2 would stop the lane; B3 and B4 would produce invented French or a broken Step 7).

## What the reviewer ran

- The golden claim, independently: the base commit's adapter (`649fe492`) and engine folder, run against the lane's 144-case grid, match `adapter-snapshots.json` byte for byte. The adapter's output is unchanged.
- 23 of the lane's vitest files (344 tests) pass. Ratchets OK, wizard 2118 of 2124.
- A probe of `computeZones` over 12 voice types and 11 sung sets.
- Not run: a production build, Playwright, a real microphone.

## Found sound

`windowFor` and `anchorF1sFor` faithful; `resolve-values.ts` moved whole, one added condition (`:212`); `tour.ts`, `geometry.ts`, `model.ts` correct on every traced case; the ritual's take ids and phase checks hold against the real `LiveCaptureSession` (a late `CANCELLED` fires synchronously inside `session.cancel`, `live.ts:278-298`, after the id bump); `commitReading` (`CalibrationWizard.svelte:812-827`) a faithful extraction; the wheel path unchanged in behaviour without the switch; the stub switch cannot turn on in production (`stub-switch.ts:14`); Step 5 records hold no guard field, Start over clears them (`:1038-1039`), duplicate copies formants only (`:522-526`), about 95 KB at the 500-record cap (estimate); no "goal" or "target"; capture reads no plausibility field.

## Amendments to A

- **A1** `voice/chart/zones.ts:105` (before the walk): a personal vowel's zone centres its fR2 on the singer's own sung value, so it moves on every re-take, against ruling 5. Fix: `ground.fR2[vowel]` for all ten, with a test.
- **A2** `VowelCapture.svelte:158-161` (before the walk): after a cancel or an error the rest effect ends the 400 ms move out in the same flush (`view-motion.ts:42-46`); the chart snaps. Fix: act only when `model.full` changes, or skip while moving.
- **A3** `VowelCapture.svelte:345` with `:207-210` (before the walk): the hide checkbox stays live during a take while the record's visibility is fixed at the tap. Fix: disable it during a take.
- **A4** `drawings.ts:32-35` and `static/sagittal/*.png` (before any merge to a deploying branch): the interim credit and panels are reachable with `?calibrate=new`. Fix: land 6b first.
- **A5** `e2e/calibrate-new.test.ts` with `.github/workflows/ci.yml:134` (before the merge): the file is in CI; run the whole chromium project once and report its duration.

Noted, no action: an implausible [i] (1063 Hz) moves [ɨ]'s zone above the extractor's 1200 Hz ceiling; [ɨ] before its anchors (Step 9); the low-confidence ring unbuilt; nothing under `static/` is precached (`sw.js:23-28`, `:129-143`).

## Amendments to B

- **B1** 6b item 1: static files and inlining cannot both hold; an `<img>` takes no `currentColor`. Fix: SVGs in `src` via `import.meta.glob` `?raw` (as `CursiveGlyph.svelte:14`), one `<svg>`, the fixed group once, moving groups stacked, ids stripped; delete `static/sagittal/`.
- **B2** check.py takes no path, writes previews beside itself, needs numpy and cv2. Fix: run it in place; prove shipped files byte-identical in `drawings.test.ts`; port its first three checks.
- **B3** `t(key, lang)` takes no variables (`i18n.ts:2539-2543`); `ds` takes no language (`draft-strings.ts:70`); `hintText` (`screen-logic.ts:74`), `mainButton` (`:79`), `countWord` (`:32`), `VowelChart.svelte` lack a language. Fix: a fill helper over `t()` and the language threaded.
- **B4** keys not in r5 section 7 (`capture.vowels`, `sheet.print`, `sheet.chartAlt`) and the English count words (`screen-logic.ts:30`). Fix: no French without a ratification; list and leave in English.
- **B5** what moves with `PAUSE_MS` and the pause line: `count-in.test.ts:10`; `capture-ritual.test.ts:12-13`; comments `capture-ritual.svelte.ts:12`, `count-in.ts:17`; `screen-logic.test.ts:87`; `e2e/calibrate-new.test.ts:4`, `:92` (the 5150 ms cancel lands in the pause at a 6 s count-in), `:170`. `PAUSE_MS` reaches the wheel, so every singer's count-in becomes six seconds.
- **B6** the pause line wraps to three lines (EN) or about four (FR) on a phone (`VowelCapture.svelte:507-519`, `:520-523`), moving the buttons. Fix: full width during a take, fixed row height; phone picture in the pause, both languages.
- **B7** label collision exists already with three sung (`phone-1-idle.png`); a fixed offset cannot hold ([ʌ] and [ɑ] 1 Hz apart for a bass). Fix: a pure placement function with a test, `ChartLayers.svelte:114`, `:122`.
- **B8** 6b's credit keys need Step 7's i18n path. Fix: run 7 before 6b.
- **B9** stroke 4 in a 544 box is about 0.7 px in the phone's squircle. Fix: report rendered stroke; widen the squircle if under 1 px.
- **B10** the axis words add height to a sticky group that already overflows the phone. Fix: measure; do not ship if it grows.
- **B11** `scripts/stamp-sw.mjs` is `apps/web/scripts/stamp-sw.mjs`; carry `draft-strings.test.ts`'s copy rules into the pin test; `VowelCapture.test.ts:116` must change; `FrSym` small capitals reach every singer (say whether true or synthesized); `drawings-r4` must be on `origin/Shane` before the brief is sent.

## Questions the reviewer marked as Dann's

1. French: the count words ("Seven to go") spelled as words agree in gender in French; digits in both languages, or his French word list?
2. French, only if `OPEN.md` lacks them: `capture.vowels`, `sheet.print`, `sheet.chartAlt`. (Desk: all three RATIFIED 2026-11-13 10:38 to 10:48; settled.)
3. Taste: [ɪ ɨ a ʌ] share one lavender, also the dots' and outline's colour, where ruling 4 says one colour per vowel.

## Could not establish

A real microphone; the landing's motion in a browser; Safari's `afterprint`; today's `OPEN.md` (stale in the clone); the plate numbers against Bolla; A2, B6, B9 are from reading and arithmetic.
