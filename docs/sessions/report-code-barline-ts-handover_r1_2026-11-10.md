# Handover: the barline and time signature lane stops after B5 (Code, cloud lane 43, r1, 2026-11-10)

Branch `cloud-lane-43`, pushed, head `2e7f11e` (B5). `origin/cloud-lane-38` is still `534d9981`, an ancestor of this branch: the merge the brief asks for before the final report is a no-op today. No pull request; Dann merges. `docs/memory/` untouched. I stopped at a step boundary because this session's context is spent, as the instructions allow.

## Done, each with its own commit and report in `docs/sessions/`

| step | commit | report |
|---|---|---|
| docs (the five attached files) | `a679d36` | none |
| B-1 baselines | `f06cc5b` | `report-code-barline-ts-stepB-1_r1_2026-11-10.md` |
| B0 fixtures | `3fad66f` | `…stepB0…` |
| B1 `rebar.ts`, two stored fields | `56d8f0c` (+ report fix) | `…stepB1…` |
| B2 page wiring | `a68c553` | `…stepB2…` |
| B3 Barline verb, all ratified strings | `ab4be22` | `…stepB3…` |
| T1 time signature card (pane and on-score tap) | `1230222` | `…stepT1…` |
| T2 Rebar the notes | `40e854c` | `…stepT2…` |
| B4 persistence | `75b3298` | `…stepB4…` |
| B5 head caret | `2e7f11e` | `…stepB5…` |

The eight gates pass at B5 (456; 248; 0 errors 12 warnings; 4796 + 1 skipped; 785 + 5 skipped; 168; 125; OK). Both Playwright projects fail only the baseline's own eleven tests (chromium 7, phone 4; baseline run of `534d9981` by me).

## NOT done: A1 and A2 (the one-tap offer)

Neither is started in code. What is settled, for whoever takes it:

- **A1, pure `bar-divide.ts`.** Reads the READING (never her corrections) and offers only for a reading bar whose corrected events still equal the read's (same ids and lengths), and which she has not yet divided. Count T of the bar against L of its signature, in whole notes. Offered only when T is at least 2L. Opening bar (first of the song): boundaries counted BACKWARD from its last note (remainder before the first barline is the pickup; `loupe.divideOfferOpening` when the remainder is not zero). Closing bar: counted FORWARD (remainder is a short final bar; `loupe.divideOfferClosing`). Interior bar: only when T is an exact multiple of L (`loupe.divideOffer`). `%k` is the count of full bars, `%m` the signature ("3/4"), computed with `measureFill`'s own arithmetic, never a second sum. Condition 5 ("kept by its neighbours", Fable finding 1): under the same signature at least two OTHER bars sum exactly to L, and they outnumber the bars that would be divided. A tuplet group crossing a boundary refuses the offer. A note crossing a boundary is tied (Dann 21:30). Tests per the brief: opening bar counts backward to a pickup; closing bar counts forward; an interior inexact bar gets no offer; a straddling note is tied; grech (4/8 over three quarters), the dropped-rest fixture, and a halved-metre fixture give none.
- **A2, the offer line and button.** Reuse the writer in `rebar-notes.ts`: refactor its write half (from `/* ── Write it.` to the end of `rebarNotes`) into an exported `writePlan(read, line, map, plan, start, stop)` taking a `Map<index, Part[]>`, so A2 builds its plan from boundaries and calls the same code that already writes barlines, splits, and ties. UI as `barlineUi` is done: a singleton `divideUi` attached by the page, one import and one line in `CorrectionSurface.svelte` (1223 of 1227), one attach line in `+page.svelte` (5526 of 5534), a new component for the line and the button. Undo key `loupe.undo.divided` and the strings are already in `i18n.ts`. For the opening bar, `rebar` should flag song bar 0 `isPickup` when it is a first piece of a divided reading bar holding less than its expected length (not yet done). Playwright on the fused fixture with Undo.
- **Cut order** (brief): A2 and A1 first. The desk's call whether to ship the share without them; B0 to B5, T1, and T2, which the brief says are never cut, are complete.

## Left undone inside finished steps

- **The banner's renumbering** (B2 report): after she divides or joins a bar the unread-bars banner still lists the PRINT's bars while the Loupe's tag shows hers. The first thing the brief lets go.
- Bar answers: no caller in the page, nothing to re-key (B2 report).
- The ratchet ceilings were not lowered (several could be; `pnpm ratchets` lists them).

## What I could not establish

- The metre-change survey (`survey-metre-change_r1_2026-11-09.md`) was not attached: five of the six files arrived. Finale's own dialog words were taken from the ratified strings, not from that survey.
- The reader's output on a real fused or misread-signature page: every fixture is synthetic, built to the shapes in Fable's review (B0 report).
- Fable's amendment 7 said the phonation seconds double when 4/8 is corrected to 3/4; measured, they halve (B1 report).
- Whether Dann wants the card's one button and its way out to keep the existing ratified strings I chose (`correct.tsChange`, `upload.ask.cancel`); a DESK DEFAULT, listed in the T1 report.
