# Brief: Corrections slice 3, what the singer answered is kept with the song (Code, cloud, r2, 2026-11-05)

Written by the desk (Opus). r2 applies all seven amendments of Fable's review (`review-fable-brief-slice3-and-plan-r2_r1_2026-11-05.md`, SEND WITH AMENDMENTS), in the section "Amendments" at the end, which wins wherever it differs from the steps. **NOT ESTABLISHED beats a complete invented answer.**

## The singer's need

After a scan is read, Ilya asks the singer about the bars that do not add up in the metre (slice 1, `barsToConfirm`, `apps/web/src/lib/score/bars-to-confirm.ts:55`) and offers fixes (slice 2, `offersForABar`, `apps/web/src/lib/score/offers-for-a-bar.ts:119`). Whatever she answers must still be answered tomorrow: a bar she confirmed as printed is not asked again, a bar she changed is not asked again, and if she put the line away, it stays away for that song. Today nothing per bar is stored (`plan-corrections-build_r1_2026-10-08.md`, "What the tree has today", from Code's answers of 2026-10-08, item 7; to be re-read in step 0).

Plan: `../sessions/plan-corrections-build_r1_2026-10-08.md`, slice 3 (read in full). Rulings: `OPEN.md`, "THE CORRECTIONS REDESIGN" items 1 to 18 (read in full, item 18 included: "Add the missing rest" is an offer, Dann 2026-10-19). Slice 3 is PURE: no change to `+page.svelte`, `CorrectionSurface.svelte`, or `Loupe.svelte`; nothing the singer sees changes yet; slice 6 will read and write these answers.

## Steps

**Step 0, read and record (no code change).** Read and cite with lines on today's `Shane`: the song record (`apps/web/src/lib/library/library.ts`: the `SongRecord` fields, the copy at `:102-110`, the strip at `:125`, the write at `:140-150`, `validateRecord` at `:172` and its optional-field pattern, for example `seatedText` at `:236-237` and `poemSource` at `:282-291`); `barsToConfirm` and `BarToConfirm`; `offersForABar` and `BarOffers`; how a correction is stored per note (`correction.ts`). Answer: what identifies a bar stably across a reload and across later corrections (measure index alone, or with a fingerprint of the bar's events)? What happens to stored answers when the score is replaced (`applyArrival`, `+page.svelte:2849-2856`; corrections survive by id and `orphanIds` counts the ones that do not land, `correction.ts:738`)? The brief's design, keep the answers and let the fingerprint decide, follows that precedent. Report, then continue.

**Step 1, the record and the pure module.**
- One optional field on the song record, written only when non-empty, copied and validated as `seatedText` and `poemSource` are (a malformed field is `malformed()`, never silently dropped).
- Each answer: the bar (as step 0 decides), its kind (`matches-print`, the singer said "Matches my score"; `changed`, she applied an offer or edited the bar; the song-level `put-away`, she chose Not now for the line), and a fingerprint of the bar's events at the moment of the answer.
- A pure module (new file under `apps/web/src/lib/score/`) with: `answeredBars(record)`; `stillToConfirm(bars, answers, score)`, which returns slice 1's bars minus those answered whose fingerprint still matches; an answer whose bar's events have since changed is NOT honoured (the bar is asked again), because the singer answered about different notes. Each function's comment says what it checks, why, and what follows when it fails (Dann's comment rule, 2026-11-01).
- No string, no UI, no change to how a bar is computed. This brief changes no computation, so it names no other computing sites (`CONTRACT.md` §4 condition).

**Step 2, tests and report.** Unit tests: a reload keeps every answer (write, `validateRecord`, read); a malformed answer field is reported malformed; a bar answered `matches-print` is not asked again; the same bar after one of its notes changes is asked again; `put-away` hides the line and not the answers; a replaced score drops answers whose fingerprints no longer match. Gates: all eight at baseline, web unit up by the new tests only. Report `docs/sessions/report-code-corrections-slice3_r1_2026-11-05.md`: what was built with lines, the gates, and what you could not establish.

## Lane and rules

Cloud, Sonnet, branch `cloud-lane-35` cut from `Shane`; push that branch only, never `Shane` or `main`; no pull request. Commit no brief and nothing under `docs/memory/`. `+page.svelte` untouched.

## Done when

The record keeps the answers across a reload, `stillToConfirm` drops answered bars whose events are unchanged, all eight gates at baseline, and the report names what is NOT ESTABLISHED.

## Amendments (Fable's review, 2026-11-05; these win)

1. **One damaged answer never locks the song.** Validate the field as `publishedGlosses` is validated (`library.ts:273-279`): the field that is not an object is `malformed()`; inside it, an answer that is not well formed (unknown `kind`, missing or non-string fingerprint, bar not a whole number) is dropped and the rest kept. A dropped answer costs one bar asked again; `malformed()` costs the song its saves (`document.svelte.ts:202`, `:313`). Test both.
2. **Carry the field through the document, or autosave strips it.** The field is added in five places: `SongRecord` (`types.ts`), `SongFields` (`library.ts:47-77`), `fieldsFromRecord` (`:102-110`), the strip and write (`:125`, `:140-150`), and `SongDocument` (`document.svelte.ts:288-307` and `:340-363`). `document.svelte.ts` is in scope. Runes are inert under vitest (`library.ts:10-14`), so the round-trip test runs `fieldsFromRecord` → `recordFromFields` → `validateRecord`.
3. **`put-away` is kept in the shape but marked NOT WIRED**; plan r2 decides where Not now lives before slice 6R.
4. **The fingerprint is of the corrected line's events in the bar** (`applyCorrections`, `correction.ts:357`), in order: type (note or rest), base, dots, tuplet ratio if any, plus the metre in force (`Measure.timeSignature`). It excludes event ids (re-keyed by `migrateCorrectionIds`, `correction.ts:709`), onsets (reflowed, `:444`), and pitch (DESK DEFAULT: a pitch nudge does not change the arithmetic the answer was about; Dann may overrule). Test: Undo after an applied offer changes the fingerprint and the bar is asked again.
5. **Replacement path**: applied in step 0's text above.
6. **Stale answers are kept, not pruned**; slice 6 may count them.
7. **Shape, DESK DEFAULT:** one entry per bar, keyed by `String(measureIndex)` as `CorrectionMap` is (`correction.ts:109`), the last answer replacing; `{ bars: Record<string, { kind, fingerprint }>, putAway?: true }`. `answeredBars` takes the field, not the record, since page state lives on `doc`.
