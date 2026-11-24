# Brief: Corrections keeps what the singer did (Code, cloud lane), r1

Written by the desk (Opus 5), 2026-11-24 02:2x, from `read-fable-n204-unit-e_r1_2026-11-24.md` findings D1 to D4 and `read-fable-n204-unit-f_r1_2026-11-24.md` finding F4-2. **Tier 4: this lane changes behaviour on purpose.** It does not start until `cloud-lane-86`'s behaviour baseline is committed (plan r9 step 8).

**Five defects, every one of them a thing a singer does and loses.** Three were proved by running code, two by reading. One commit each, in this order.

## 1. A second tuplet erases the first, and everything done between them

**What she meets.** She opens the tuplet row on a note and sets a triplet. With the row still open she steps to a later note and nudges. The first triplet is gone, every pitch or length she corrected since is gone, and one Undo takes back all of it.

**Why.** `TupletRow.apply` keeps `#base`, the map as it stood before the row first applied, so that many nudges make one undo step (`score/tuplet-row.svelte.ts:14-18`, `:76-80`). `#base` is cleared only by `openRow` and `close` (`:60-68`), and the page calls `close` only from `dismissLoupe` and the row's back chevron (`routes/+page.svelte:1405`, `:4508`). Moving the selection clears nothing. **Ran by the read:** tuplet on `n0`, a pitch correction on `n5`, selection to `n3`, apply; the map then held `n3, n4, n5` with the tuplet only, in one undo entry.

**Repair.** Key `#base` to the taken entry; a new entry starts a fresh base and a fresh undo step. **Proof:** a case beside "the base is the map as it stood at the first apply" in `score/tuplet-row.test.ts`.

## 2. A note added after a grace note vanishes when the main note is deleted

**What she meets.** She adds a note at the caret after a grace note, then deletes the main note the grace note leaned on. Her note is no longer drawn, and Ilya does not count it among the corrections that failed to land.

**Why.** An entry made after a read grace note is anchored to the grace note's id and is emitted only through the principal's branch (`score/correction.ts:483-491`, `:544`, `:550`, `:564`). The branch for a principal that no longer stands emits what hangs on the principal and nothing hung on its grace notes (`:553-560`). `orphanIds` treats a grace id as live, so nothing is reported (`:889-905`). **Ran:** before, `a, hand:1, b, c`; after, `a, c`, no orphan.

**Repair.** Carry the grace-anchored entries forward with the grace notes, as `carried` already does for a grace note made a full note (`score/correction.ts:469`, `:545`). **Risk: medium**, `applyCorrections` is the centre of the model, so this commit carries a characterization test of today's result first. **Proof:** a case in `score/correction.test.ts`, with `score/grace-layer.test.ts` as the guard.

## 3. Deleting a hand-added note leaves the cursor nowhere

**What she meets.** She deletes a note she entered herself and the Loupe closes under her hand; she taps the bar again to carry on.

**Why.** `handleDeleteNote` looks for the neighbour in the line as the READER read it, unless the entry is a grace note (`score/correction-verbs.svelte.ts:352-362`). A hand-added note is not in that line, so `neighbourId` answers null both ways (`score/correction.ts:809-811`). The page then sets the selection to null (`routes/+page.svelte:898`), and the Loupe draws only while there is a cursor (`:4514`). The code's own comment states the intent it misses: "so the singer is left somewhere rather than nowhere" (`correction-verbs.svelte.ts:352-354`).

**Repair.** Look in the DRAWN line, for every entry. **Proof:** extend the delete case at `score/correction-verbs.test.ts:235-241` with an entered id. **The closing of the Loupe is established by reading, not by running: confirm it on the page before and after.**

## 4. A press that changes nothing still leaves a correction behind

**What she meets.** She turns a tie on and off again, or presses the length a note already has. Restore lights for that note as though she had corrected it, and in the second case there is no Undo step for what was written.

**Why.** `toggleTie` and `toggleRest` write into the map and never prune (`score/entry.ts:256-276`, `:307-310`), while every other verb goes through `withCorrection`, which removes a record that says nothing (`score/correction.ts:368-399`). **Ran:** tie on then off left `{"a":{"tied":"none"}}`. `handleBase` pushes an undo entry only where the length differs but writes the length regardless (`correction-verbs.svelte.ts:332-339`). Restore reads any such record as a correction (`correction.ts:426-430`, `correction-verbs.svelte.ts:214-217`), and the page's test for "no corrections at all" counts keys (`+page.svelte:827`, `:983`).

**Repair.** Compare against the read before writing. **Proof:** cases in `score/entry.test.ts` and `score/correction-verbs.test.ts`.

## 5. A key change is lost when the bar's first note is deleted, where a time signature is kept

**What she meets.** She sets three sharps from bar 9, then deletes the wrong note that opens bar 9. The key change disappears. Had she set 6/8 there, it would have stayed.

**Why.** `marksIn` skips a record that is deleted (`score/key-signature.ts:49`) and one whose entry is not in the line (`:50-51`). The time signature layer carries a deleted entry's mark to the next entry standing (`score/rebar.ts:156-166`) on a stated principle: "the singer deleted a note, not the bar" (`:28-29`). `key-signature.ts:4` calls itself the sibling of `time-signature.ts`. `key-signature.test.ts` holds no line containing "deleted" (the read ran that grep).

**Repair.** Make the key layer carry the mark as the time signature layer does. **Proof:** a characterization test of today's result first, then the lane's before and after.

## Done when

- Each of the five is proved changed by its own test, and each commit carries the characterization test of today's behaviour where one is named above.
- The eight gates at their baselines except gate 4, which rises; name the new figure.
- No ratchet ceiling raised. No string a singer reads is changed: **if one is needed, stop and report it.**
- **The behaviour baseline's families 1 and 4 are re-captured and the differences listed**, since Corrections changes what MELODY draws and prints.

## What this lane must not do

Refactor. Split a file. Touch `score/reconciliation/`, `VocalLineEvent`, or `analyzePerVerse`. Delete the `dock` variant or anything else the unit read calls dead: that is a separate tier 1 lane, and a deletion made beside a behaviour change cannot be told apart from it in the baseline.

## Cost and conduct

Sonnet. **Cap 350,000 tokens.** One commit per defect. Push to its own branch only. Stage by explicit path. No `.bak`. No subagents. `ls docs/sessions/` before naming the report.

**NOT ESTABLISHED beats a complete invented answer.**

## Style

Canadian spelling, the Oxford comma, no em dashes, sentence case headings, no `simply`, `just`, `easy`, and no exclamation marks.
