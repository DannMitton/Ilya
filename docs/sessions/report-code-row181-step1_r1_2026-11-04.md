# Report: row 181, step 1 (the band says whether it held ink; extender lines are read), Code, r1, 2026-11-04

Branch `cloud-lane-34`, on top of the step 0 commit. Built in a Linux sandbox from a fresh `pnpm install --frozen-lockfile`. Fable's 21 amendments override the brief where they differ; I applied amendments 1, 2, 3, 4, 15, 16 (the parts that fall in step 1), and 17.

**Nothing in this report is a row 114 count.** The control (369 of 590), arms (a) and (b), and the ink-share distributions all need row 114's scans and the desk's scorer, which are on Dann's Mac. I built what makes them measurable and say below what the desk reads. Every claim about code carries a file and line I read; NOT ESTABLISHED marks what I could not establish.

## 1. What changed

| File | What | Lines |
|---|---|---|
| `omr/underlay-rows.ts` | `bandInk(band, space)`: the ink share and the count of text-line candidates, from the same `paperOf` and `inkProfile` that `cutRows` uses | `:106-124` |
| `omr/underlay-tokens.ts` | a long dash is now an `extender` token (`text: '_'`, box unchanged, `longDash: true`), not an empty mark | `:51-54`, header `:22-26` |
| `omr/underlay-seat.ts` | `Token.longDash?: boolean` (counted, never read by a rule) | `:76-83` |
| `omr/underlay-extender.ts` (new) | `markExtenderNotes`: sets `underExtender` from the token's own box, by geometry, no seat consulted; arms `a` and `b` | whole file |
| `omr/underlay-page.ts` | rows read before `tiesOnly` and `free`; `SystemLayout.inkShare` and `.textLines`; `NO_INK_SHARE_MAX`; `bandHeldNoInk`; `why` is `'no ink'` or `'no Russian row'`; `SystemWords.silent`; `stats.extenders` and `stats.inkBands`; `seatPage(…, { extenderArm })` | `:61-90`, `:106-120`, `:225-246`, loop tail |
| `omr/underlay-prepare.ts` | `prepareUnderlay` fills `inkShare` and `textLines` for each banded system | `:178-194` |
| `omr/underlay-song.ts` | a `silent` system is left out of `unread` | `:95` |
| `omr/underlay-reader.ts`, `omr/underlay-client.ts`, `omr/underlay-switch.ts` | the arm (`?extender=b`, default `a`) reaches `seatPage`; one console line carries the counts the desk reads | see §4 |
| `omr/underlay-words.ts` | `writeLyrics` writes `<extend type="start"/>` inside the `<lyric>` of a `sustained` syllable | `:166-187` |
| `omr/extend-convention.ts` (new) | `markExtenders` (writer of the file's field), `hasExtenders`, `extenderMelismaIds` (reader) | whole file |
| `omr/unread-bars.ts` | `setMiscField` split out of `markUnreadBars` so two conventions share the `<identification>` slot; `markUnreadBars` behaves as before | `:73-101` |
| `omr/homr-reader.ts` | `markExtenders(markUnreadBars(...))` at the join | `:419` |
| `score/ingestion/ingest.ts` | `withExtenders` beside `withUnreadBars`, at the same seam | `:142-155`, call at `:309` |
| `score/slur-seat.ts` | `withExtenderMelismas(map, warnings)` | end of file |
| `routes/+page.svelte` | two lines edited in place: the import (`:202`) and the merge line (`:2853`) | line count 5586 before and after |
| `packages/score-parser/src/types.ts` | type only: `ParseWarning.eventIds`, warning code `'extender-notes'` | `:945`, `:990` |

## 2. Item by item

**Item 1: `SystemLayout` gains the ink share; `why` tells `'no ink'` from `'no Russian row'`.**
- The share is the ink pixels over all the band's pixels, with ink as `cutRows` has it (`INK_BELOW_PAPER`, `underlay-rows.ts:60`). `bandInk` also returns `lines`, the count of band lines over `LINE_SHARE` of the width (`:149` rule), counted before `cutRows` drops short or merged runs. A band with any such line is never `'no ink'` (amendment 15, last sentence). I used `lines`, not `cutRows(...).length`, because `cutRows` also drops a run under `MIN_ROW` (`underlay-rows.ts:158`), which would call a faint band empty.
- **The threshold is NOT MEASURED.** `NO_INK_SHARE_MAX = 0` (`underlay-page.ts`, with the reason in its comment): a band is `'no ink'` only if it holds no text-line candidate and no ink pixel at all. A band with a hairpin, slur, stem, or speck is not `'no ink'`, so a wrong threshold cannot make a system silent. On a real scan, noise means `0` will almost never fire, so item 3's effect is inert on row 114 until the desk sets the number. I did not invent one. Amendment 15 asks for both distributions and the misclassified counts; they need row 114's bands (see §4 for the line that prints them).
- Sites that read `why`, per amendment 17: `omr/underlay-song.ts:95` (into `Unread.why`) and `:104` (the console line), `omr/underlay-reader.ts:67`, and the test files it lists. A new value `'no ink'` flows through those unchanged. I did not re-read each cited test line; the full web unit suite passes (§5).

**Item 2: extenders, two arms.** `markExtenderNotes` (`omr/underlay-extender.ts`) takes each `extender` token standing after a `syllable` token on the same row and sets `underExtender` on every note of the system whose x lies in the token's own `x0..x1`, except the note nearest the syllable token's centre (`nearestOf`, `underlay-seat.ts:156`). Arm `b` adds a `joint` token whose own box spans a free note's x. In both arms the evidence is the token's box, never the distance between two seats; a hyphen that spans no note marks nothing; a hyphen over a note already tied into does not count as spanning a free one. Tested in `omr/underlay-extender.test.ts`.
- **The default is arm `a`.** I chose no winner because nothing here can score one. The arm is chosen by `?extender=b` in the address (`underlay-switch.ts`, `extenderArm`), read in the page's thread; it is a measurement switch, not a singer's.
- **NOT ESTABLISHED:** that tesseract at PSM 7 with `rus_prereform_r2_29000` emits an underscore line as a token at all. `makeRecognizer` filters nothing (`omr/underlay-recognize.ts:55-57`, `:65`), so it can; whether it does needs a run. If the desk's counts show `0 underscore` and `0 long-dash token(s)`, both arms are moot and `joint` alone is left to arm `b`.

**Item 3 (amendment 3): the long dash is kept.** `splitTokens` now keeps a hyphen-only box wider than half the ink height as `{ text: '_', longDash: true }` with its box unchanged. `kindOf('_')` is `'extender'` (`underlay-seat.ts:151`), so `sewWords` marks the syllable before it `sustained` (`underlay-words.ts:111-113`). Tested: `underlay-tokens.test.ts` (kind and box), `underlay-extender.test.ts` (`seatPage` gives `sustained: true` and counts it as `longDash`), and `underlay-page.test.ts` (a 20 px dash at scale 1 and 2 is `_`; at scale 0.5 it is a hyphen). **This changes behaviour on every scan:** a long dash used to be dropped (an empty mark); now it can sustain a syllable and mark notes. NOT ESTABLISHED: how many long dashes row 114 f1 has, and whether any sit between two syllables of one word (needs the scans; the console line gives the first count).

**Item 4 (amendment 4): the order.** In `seatPage` the rows are read first, then `markExtenderNotes`, then `tiesOnly` and `free` are made from the marked notes (`underlay-page.ts:225-246`). `tiesOnly` spreads every field, so both copies carry the flag and `isContinuation` stays the only reader (`underlay-seat.ts:108-110`). Tested: with the line, three notes and one syllable give `free: 1` and no `no-syllable` breach; without it, two `no-syllable` breaches.

**Item 5 (original 1.3): a system with no ink whose every sung note is a continuation is not unread.** `silent` is set only where the band held no ink by `bandHeldNoInk` and every note of the system is tied into (`n.tiedInto === true`), strictly ties, not slurs: a slurred melisma's first note still needs a syllable. `applyUnderlay` skips a `silent` system (`underlay-song.ts:95`). Tested with a written system, a silent one, and an unread one with ink: only the last reaches `unread`. With the threshold at nought this is inert on real scans (above).

## 3. Amendment 1: the extender rides with the reading

- **Writer.** `writeLyrics` writes `<extend type="start"/>` after `<text>` in the `<lyric>` of a `sustained` syllable. Taking the `<lyric>` blocks out still gives the input byte for byte (tested). `markExtenders` adds `<miscellaneous-field name="ilya-extenders">1</miscellaneous-field>` to `<identification>`, beside the unread bars, only when an `<extend>` sits inside a `<lyric>`. Written at the join, `homr-reader.ts:419`.
- **Why a field and not `<extend>` alone.** Authored scores carry `<extend>` of their own. Without the field, the seam would write melisma decisions on every authored score with an extender, a behaviour change nobody has measured. With it, only a file Ilya made is read. Tested: an authored file with `<extend>` and no field gives no warning.
- **Reader.** `withExtenders` (`ingest.ts:142-155`, called at `:309`) runs at the same seam as `withUnreadBars`. It names the sung notes after a lyric with `<extend>`, up to the next lyric, not across a rest (the typed path ends a sustain at a rest: `score/vowel-resolver.ts:265-267`), and not a note a tie already continues. It reports them in an `extender-notes` warning with `eventIds`. Notes are matched to events bar by bar as `notePositions` does (`score/old-reader-seats.ts`): a bar is read only where its notes line up one for one with its events and holds no `<backup>` or `<forward>`. A bar holding an extender that does not line up marks nothing and is counted in the warning's message, so the loss is reported and never silent. NOT ESTABLISHED on row 114: how many bars that is.
- **The typed path.** `withExtenderMelismas` (`score/slur-seat.ts`, end of file) turns the ids into `{ kind: 'melisma' }` pairings through `withObservedMelismas`, which never writes over a note that already carries a decision (`slur-seat.ts:73-77`). The page calls it at the merge on arrival (`+page.svelte:2853`, an in-place edit of the line `doc.pairings = merged.map;`). A map holding only melismas still counts as having no syllable for the first-transcription seat and for the clitic fold (`score/first-seat.ts:38-40`, `:62-64`; the header says so in terms), so those paths behave as before.
- **Tests.** `extend-convention.test.ts` (12): the writer, the field, a scan read with an extender, stored, reopened (twice ingested, same ids), the rest stop, the tie, the unaligned bar, and the typed pairings. `underlay-integration.test.ts` carries the same song through `makeReader`, `restoreScan` with a kept reading, and a reopen. The brief asked for "the extender notes are continuations on both paths and the join proposes nothing on them": the join does not exist yet (step 4); both continuations are proved here and the "proposes nothing" half waits for step 4.
- **`noSyllableCount`** (`score/ingestion/fixture-rule.test.ts:84`) is widened to count a note under Ilya's line as a continuation, only in a file with the field (amendment 16), so its count agrees with the join's.
- **The cost of the parser path** (the cleaner alternative, which the amendment asks me to name): reading `<extend>` in `musicxml-parser.ts` and carrying it on `VocalLineEvent`, which is a field in a published type and the parser's own tests. I did not take it. What I did change in the package is type-only: one optional field and one warning code, 4 lines of a file now at 999 of 1000 (the ratchets script flagged 1004 before I compacted it).
- **NOT verified in a browser.** Nothing here has been run in the app: it is WRITTEN, not DONE. The risk to look at on the first walk is a scan with an extender, reopened: the notes under the line should stay wordless on the page and nothing should be flagged.

## 4. What the desk needs to run on row 114 (one machine, one browser build, one sitting, per amendment 19)

1. **Clear the kept readings of the test songs first.** I did not move the stamp (that is step 3's `underlay@4`). A reading kept under `underlay@3` before this commit was made by the old tokens and has no `<extend>`; reopening it would use that reading and the arms would not move. The desk must read the scans fresh, not reopen kept ones.
2. The 369 control on this branch.
3. Arm `a` (default), then arm `b` with `?words=read&extender=b`. Per page, the console line now ends its reading stats with, for example: `; extenders (arm a): <n> underscore, <n> hyphen, <n> long-dash token(s), <n> note(s) marked under one; ink bands (system, w written or u not: ink share/text-line candidates): 1w:0.0123/4 2u:0.0004/0 …`. The first four numbers are the per-song token counts amendment 2 asks for (add the pages of a song). The ink-band list is the two distributions amendment 15 asks for: the `w` bands are those whose system was written, the `u` bands those that were not.
4. The existing `counted:` part of the same line already gives the two-vowel (`many-vowels`) and `no-syllable` breach counts; I did not change it.
5. Set `NO_INK_SHARE_MAX` (`omr/underlay-page.ts`) from the two distributions, only once the desk has them.
6. Which artefact the scorer reads is amendment 20's question for step 7; I do not know what `score114.py` reads (NOT ESTABLISHED).

## 5. Gates (this sandbox, Linux, fresh install)

| Gate | Result |
|---|---|
| web unit | **4233 passed, 1 skipped** (237 files). Baseline in this sandbox before my change: 4198 passed, 1 skipped (235 files), equal to the desk's. +35 tests, +2 files |
| web-check (`svelte-check`) | 0 errors, 12 warnings (equal to baseline) |
| score-parser | 785 passed, 5 skipped (equal to baseline) |
| ratchets | OK (after compacting `types.ts` to 999 lines) |
| phonology, dictionary, blurb, integration, e2e | **not run**: no file in those packages or in `tests/` changed. Say so plainly; I did not reproduce the desk's 407, 248, 148, 125 |

Order, stated plainly: the full web unit run (4233) finished before I compacted two comment lines in `types.ts`. After that edit I re-ran `svelte-check` (0 errors, 12 warnings), the score-parser suite (785 passed, 5 skipped), and the ratchets script (OK). I did not re-run the full web unit suite after the edit; the edit changes no behaviour.

## 6. Departures from the brief or a ruling

- The `'no ink'` threshold is `0`, not measured (amendment 15 asks for a measured one). Reason: row 114's bands are not reachable here.
- The distributions, the misclassification counts, and the arms' counts are the desk's.
- `+page.svelte` is held at 5586: two lines were edited in place and none added, so amendment 18's "move out as many as you add" did not arise.
- The package change is type-only and not the parser path (above).

## 7. Not established

Tesseract's emission of an underscore; the long-dash count and whether any sit inside a word; the unaligned-bar count; the threshold; the arms; the browser behaviour of the reopened song; `score114.py`'s input; the e2e suite.
