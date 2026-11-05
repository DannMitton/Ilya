# Brief: Corrections slice 3, what the singer answered is kept with the song (Code, cloud, r1, 2026-11-05)

Written by the desk (Opus). For Fable's review before Code (`CONTRACT.md` §1 item 19). **NOT ESTABLISHED beats a complete invented answer.**

## The singer's need

After a scan is read, Ilya asks the singer about the bars that do not add up in the metre (slice 1, `barsToConfirm`, `apps/web/src/lib/score/bars-to-confirm.ts:55`) and offers fixes (slice 2, `offersForABar`, `apps/web/src/lib/score/offers-for-a-bar.ts:119`). Whatever she answers must still be answered tomorrow: a bar she confirmed as printed is not asked again, a bar she changed is not asked again, and if she put the line away, it stays away for that song. Today nothing per bar is stored (`plan-corrections-build_r1_2026-10-08.md`, "What the tree has today", from Code's answers of 2026-10-08, item 7; to be re-read in step 0).

Plan: `../sessions/plan-corrections-build_r1_2026-10-08.md`, slice 3 (read in full). Rulings: `OPEN.md`, "THE CORRECTIONS REDESIGN" items 1 to 18 (read in full, item 18 included: "Add the missing rest" is an offer, Dann 2026-10-19). Slice 3 is PURE: no change to `+page.svelte`, `CorrectionSurface.svelte`, or `Loupe.svelte`; nothing the singer sees changes yet; slice 6 will read and write these answers.

## Steps

**Step 0, read and record (no code change).** Read and cite with lines on today's `Shane`: the song record (`apps/web/src/lib/library/library.ts`: the `SongRecord` fields, the copy at `:102-110`, the strip at `:125`, the write at `:140-150`, `validateRecord` at `:172` and its optional-field pattern, for example `seatedText` at `:236-237` and `poemSource` at `:282-291`); `barsToConfirm` and `BarToConfirm`; `offersForABar` and `BarOffers`; how a correction is stored per note (`correction.ts`). Answer: what identifies a bar stably across a reload and across later corrections (measure index alone, or with a fingerprint of the bar's events)? What happens to stored answers when the score is replaced (N.157, `refreshPairings`)? Report, then continue.

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
