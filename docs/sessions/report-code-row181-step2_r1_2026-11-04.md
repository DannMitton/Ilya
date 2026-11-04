# Report: row 181, step 2 (the second look), Code, r1, 2026-11-04

Branch `cloud-lane-34`, on top of the step 1 commit (`23cbd751`). Fable's amendment 14 applies. **Nothing here is a row 114 count.** Whether any look rescues any system on row 114, what each costs in seconds, and the f1 count are the desk's, taken on one machine in one sitting after the 369 control (amendment 19). I built the loop, made each look measurable, and say below what the desk reads. NOT ESTABLISHED marks what I could not establish.

## 1. What changed

| File | What | Lines |
|---|---|---|
| `omr/underlay-looks.ts` (new) | the four looks and their geometry in staff spaces: `LOOKS`, `lookWindow`, `stretchBand` | whole file |
| `omr/underlay-choose.ts` (new) | `scoreLook`, `chooseLook`: which look to keep | whole file |
| `omr/underlay-prepare.ts` | `prepareSystem(page, musicXml, staves, system, look)` as the brief names it, `prepareSystemIn`, `prepareLooks` (a batch, systems found once); `prepareUnderlay` now takes its staves and systems from a shared `systemsOfPage` and is otherwise the same | `:168-247` (`systemsOfPage` `:168`, `prepareUnderlay` `:182`, `prepareSystem` `:218`, `prepareSystemIn` `:224`, `prepareLooks` `:244`) |
| `omr/underlay.worker.ts` | a request with `wants` answers with the looks' framed rows; a request without it is the page, as before | `UnderlayRequest` `:17`, `LookRows` `:27`, the `wants` branch `:69` |
| `omr/underlay-client.ts` | `ask` carries both kinds of request; `looksInWorker`; `looks` joins the reader's parts | `ask` `:40`, `prepareInWorker` `:53`, `looksInWorker` `:60`, parts `:72` |
| `omr/underlay-reader.ts` | the loop in `makeUnderlayReader`, a new optional part `looks`, the console line for the looks | `looksLine` `:82`, the loop from `:115` |
| `omr/underlay-page.ts` | `UnderlayPage.looks` (`LookReport`) and `ms.look` | end of the file |

## 2. How it works

- **Where it lives.** In `makeUnderlayReader`, after the first `seatPage` (amendment 14). For every system whose `why` is `'no Russian row'` and which has a band, the loop asks the Worker once for all failing systems of the page, each with the four looks. It reads each look's rows with the same recognizer, scores them (`underlay-choose.ts`), and keeps one per system or none.
- **The looks (all in staff spaces, none in fixed pixels, per Dann 10:26 and `CONTRACT.md` §0.2).** `down` and `up`: the band shifted by `SHIFT` = 0.5 of the system's staff space. `wide`: widened by `WIDEN` = 1 space each way. `stretch`: the same band with its own ink tone (the grey at the darkest 1% of its pixels) sent to black and its own paper tone (`paperTone`, the most frequent grey) sent to white; a band whose ink and paper are closer than 32 grey levels is left alone. The numbers 0.5, 1, 1%, and 32 are the brief's (the first two) and mine (the last two): **JUDGEMENT**, unmeasured. The brief said "contrast stretched to the band's own ink and paper tones" and gave no percentile or floor.
- **Why `wide`, `down` and `up` cannot reach the next staff.** The first band stops `MARGIN` = 1.5 staff spaces above the next staff's top line and starts 1.5 below the voice staff's bottom line (`omr/underlay-band.ts:27`, `lyricBand` `:94-104`), so each look stays at least half a space clear of a staff line on both sides. Where no staff lies below, the band runs 20 spaces (`BELOW`, `:31`) and every look is clamped to the page. I read that arithmetic; I did not see it on a page.
- **Which look is kept.** A look passes where one of its rows is Russian by `rowLanguage`, the test the first look had to pass. Of those that pass, the one whose first Russian row holds the most dictionary words is kept; a tie goes to the earlier look. The first Russian row, because `seatPage` seats a system from that row; scoring a later row would keep a look for a row that is not seated. None passes: the system stays unread, with its first look's bars in the banner, as before.
- **The limit.** Four further looks per system at most: `LOOKS` has four entries, each used once, and no look is looked at again. The limit is stated at the loop in `underlay-reader.ts` and in the header of `underlay-looks.ts` (the 2026-11-01 comment rule).
- **Where a rescued system's words go.** The kept look's rows are numbered after the first look's, the layout's system takes them, and `seatPage` runs over the whole page once more. That keeps the sewing of a word across a system break exactly as it always is.

## 3. Your questions from the brief and the review

**Does `parts.prepare` keep the page image? (amendment 14, step 0 asked)** No. It returns `{ layout, rows, ms }` (`omr/underlay-reader.ts:22`) and the Worker drops the decoded page when its handler returns (`omr/underlay.worker.ts`). The loop holds the original `image` Blob. So the Worker is asked again. **Cost:** one more decode of the page and one more `systemsOf` for each page that has a failing system, not for each look, because all the failing systems and all four looks go in one message. NOT MEASURED: that cost in seconds. If the desk would rather have the Worker keep the decoded page for the session, that is a memory trade (a full-page greyscale buffer per page) and is the desk's call.

**Seconds each look adds per page.** NOT MEASURED. The console line now prints it: after the page's reading stats, `; second look: system 3 down 812 ms (not Russian), up 790 ms (not Russian), wide 903 ms (Russian, 6 words, kept), stretch 840 ms (not Russian) (4.2 s)`. Each look's `ms` is its framed rows read by tesseract; the parenthesised total at the end also holds the Worker's second decode and cut. `UnderlayPage.ms.look` carries the total, and `seat` no longer includes it.

**The row 114 f1 count.** The desk's. After the 369 control on this branch's first look, the gain from step 2 is the same scorer's count with the looks on.

## 4. A departure from amendment 14, and why

Amendment 14 says to split a `seatSystem` out of `seatPage` (`underlay-page.ts:191-287` is the per-system body) "no behaviour change, with the gate's tests still passing". **I did not extract it.** The loop seats the whole page again with the kept look's rows in place of that system's first-look rows (above). Reasons:
1. The per-system body is not separable at the knife edge the amendment wants: it closes over the page's accumulators (`stats`, `seats`, `sung`, `systems`) and the page-level `sewWords` runs after the loop on all systems' seats together. Calling it for one system alone would leave a word that carries across a system break unsewn, or I would carry the accumulators as a context object through a ~90-line extraction with no test that sees the seam.
2. The whole-page re-seat is the same function the gate's tests already cover, and it is pure and takes milliseconds.
3. The price is that `seatPage` runs twice on a page with a rescued system, and its `stats` and console counts describe the second run. NOT MEASURED in seconds; synchronous and pure.

If the desk wants `seatSystem` extracted anyway, say so and it is a separate commit with no behaviour change. I would then run the existing `underlay-page.test.ts` (it has all the gate's cases) unchanged against it.

## 5. What the desk reads on row 114

1. Take the 369 control first on this branch's first look, then read the same pages with the looks on. The looks are on whenever `?words=read` is: the client always supplies `looks`.
2. The `second look:` part of the console line, per page: which systems were looked at again, each look's seconds, whether any was Russian and with how many dictionary words, which was kept.
3. The `ink bands` part from step 1 shows which looked-at bands were hairpins and slurs only. Until `NO_INK_SHARE_MAX` is set from those distributions it is `0`, so any band with a speck of ink counts as having ink, and a system whose band holds only a hairpin gets all four looks for nothing. That is wasted seconds, not a wrong word: a look that finds no Russian row keeps nothing.
4. NOT ESTABLISHED: whether any look rescues a system on real scans. A synthetic page shows `wide` recovering row padding the first look clipped (the first look's row starts at page row 265; the widened look's starts at 261) and `stretch` finding a row of ink too pale for the first look; a real scan has not been through it.

## 6. Tests

| Test file | New |
|---|---|
| `omr/underlay-looks.test.ts` (new, 11) | the four-look limit; each look's geometry in staff spaces and its clamp to the page; the stretch maps ink to 0 and paper to 255 and leaves a flat band alone; `chooseLook` picks the most dictionary words, none passes, a tie, and the first Russian row |
| `omr/underlay-prepare.test.ts` (+4) | the widened band's row reaches the row padding the first band clips; the shifted band; a too-pale row found only after the stretch; null for a system the page lacks; one result for each wanted look of each wanted system |
| `omr/underlay-reader.test.ts` (+4) | the Worker is asked once for the four looks; the page is seated again from the look kept; no look passes, the system stays unread; nothing is asked where every system was written or the parts have no looks; the second look throws and the page answers null with one console line |

## 7. Gates (this sandbox, Linux)

| Gate | Result |
|---|---|
| web unit | **4252 passed, 1 skipped** (238 files). After step 1: 4233. +19 tests, +1 file |
| web-check (`svelte-check`) | 0 errors, 12 warnings (equal to baseline) |
| ratchets | OK. `+page.svelte` 5586 (untouched in this step), `pipeline.ts` 925, `pairings.ts` 1420, none of the new files is near 1,000 |
| score-parser, phonology, dictionary, blurb, integration, e2e | **not run in this step**: no file in them changed after step 1 (score-parser was re-run after its type edit in step 1: 785 passed, 5 skipped). I did not reproduce the desk's 407, 248, 148, 125 |

## 8. Not established

Whether any look rescues a system on real scans; the seconds each look adds; the Worker's second-decode cost; the f1 count; the two JUDGEMENT numbers (the 1% ink percentile, the 32-level floor); the browser behaviour of the Worker's second request (a unit test drives the loop with fakes, the Worker message is typed and built but not run in a browser: **WRITTEN, not DONE**).
