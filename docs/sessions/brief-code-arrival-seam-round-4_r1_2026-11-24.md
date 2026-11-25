# Code: the arrival seam, round 4, on `cloud-lane-88`

Written by the desk 2026-11-24 23:1x from Fable's delta read of `92c03cca..9c21c74e`
(verdict MERGE WITH FIXES, no blocker). **Continue on the lane's own branch
`cloud-lane-88`. Do not cut a new branch. Do not push to `Shane`. Do not merge.**

Lane tip at briefing: `9c21c74e`. `Shane` is at `16644c42` and holds lane 89.

## What this round is for

Dann ratified the slur-evidence sentence at 21:43 and ruled the count gate at
21:23. The build follows both to the letter. **What Fable found is that the
sentence can fire where it is not true.** Round 4 makes his words true. It
changes no word he ratified, and it does not touch the gate's shape or its
whole-verse reach.

## Step 0: two probes, before any change

Fable reasoned items 1 and 2 from the lines and did not run them. Settle both
first, and report what you see.

**Probe A.** Through `ingestScoreFile`, a verse of four sung notes, a syllable on
every note, and one phrasing slur over two of them. Report: does the gate fail,
and is a `slur-evidence-unchecked` record written? Report the record's rendered
English sentence verbatim.

**Probe B.** Through `ingestScoreFile`, `n188-markings.musicxml`. Report, note by
note for the affected verse, which syllable the resolver seats on which note,
and which notes end with a sustained vowel and no syllable of their own.

**If a probe disproves its premise, build nothing for that item, say so, and stop
there for it.** NOT ESTABLISHED beats a complete invented answer.

## Step 1: the notice speaks only where there was something to name (Fable fix 1)

Today `ingest.ts:380` sends a verse to the record on `unchecked` alone, so a
clean verse with an ordinary phrasing slur gets a notice saying its slurs do not
account for a difference when there is no difference.

Restore the plain `count.damaged` test at `ingest.ts:380`, and at `ingest.ts:450`
write the record only for a failed verse that has something the per-note record
would have named (`v.unexplained.length > 0 || v.vacated.length > 0`). Apply the
same condition to the test at `round2.test.ts:220-229`, and add a kept test for
probe A's case asserting that no record is written.

## Step 2: the notes Ilya emptied keep their abstention (Fable fix 2)

In a failed verse the build writes no per-note abstention at all
(`ingest.ts:426`, asserted at `underlay-record.test.ts:77`). Where the song also
carries a fused vowelless token, the tail closes up, the emptied notes take a
sustained vowel no print supports, and the ratified sentence's clause "Ilya has
left the words where your score prints them" is false.

**In a failed verse, keep the abstention for `v.vacated`, the notes Ilya itself
emptied. Drop only `v.unexplained`.** `ingest.ts:426`. Update
`underlay-record.test.ts:77` to the new shape and add a kept test from probe B.

**DESK DEFAULT, Dann told and standing unless he objects.** It departs from a
desk default of the 2026-11-24 close, not from his 21:23 ruling: his ruling
settled that a failed verse is seated as `5594904b` seats it and is named by one
record, and it took knowingly the cost that Ilya cannot defend the seating note
by note. It did not rule that Ilya should sustain a vowel on a note it emptied
itself. `CONTRACT.md` section 0.1 keeps the close-up; this step keeps the page
honest about it.

## Step 3: one meaning for "sung notes" (Fable fix 4)

`ingest.ts:448` prints `v.sung`, which excludes pinned notes, while the ratified
line prints `v.notes`, which includes them, so one failed verse can read "5 sung
note(s)" in one record and "6 sung notes" in the other. Use `v.notes` at
`ingest.ts:448`.

## Step 4: comments, attribution, and dates (Fable fixes 3 and 5)

Text only. No behaviour changes.

- `melisma-evidence.ts:25`, `ingest.ts:398`, `ratified-slur-line.test.ts:27`: the
  phrase "the noteheads she counts" overstates `{m}`. Say what is counted: notes
  that can begin a syllable in the bars this verse shows. A note tied into the
  one before is not counted, and for a later verse only bars where that verse has
  words of its own are counted.
- `ratified-slur-line.test.ts:27`: the `{m}` ruling is credited to "(Dann,
  2026-11-25)". **It is a desk ruling and the date is wrong.** Credit the desk,
  dated 2026-11-24, until Dann rules it.
- Correct every 2026-11-25 date in this round's files and in
  `report-code-arrival-seam-round-3_r1_2026-11-24.md` to 2026-11-24.
- `ratified-slur-line.test.ts:29` says "Five noteheads" over a six-note score and
  the test asserts 6. Correct the comment.
- `melisma-evidence.ts:5-8` still says the base verse is counted over every sung
  note; fix A changed that at `:61-64`.
- The round-3 report's table cites the seam gate at `melisma-evidence.ts:49-57`,
  the round-2 position. Correct it to `:73-80`.

## Constraints

- **Change no word of the ratified strings** at `i18n.ts:1563` or their pins at
  `ratified-slur-line.test.ts:17` and `:23`. This round changes where the
  sentence fires, never what it says.
- **Do not touch the gate's formula or its whole-verse reach**
  (`melisma-evidence.ts:79`). Dann ruled both at 21:23.
- **Do not touch `scripts/ratchets.json`.** Eight ceilings are owed a drop after
  both tier 4 lanes land, and the desk holds that.
- **`packages/score-parser/src/types.ts` is at 1000 lines against a
  `newFileMaxLines` ceiling of 1000.** The next line added there breaches. Put
  nothing in it.
- `score/` imports nothing from `insights/`.
- House style: Canadian spelling, Oxford comma, no em dashes, no `simply`,
  `just`, `easy`, no exclamation marks.

## Done when

All eight gates run on the lane and reported with their figures. One commit per
step, each with its own message. A report at
`docs/sessions/report-code-arrival-seam-round-4_r1_2026-11-24.md` on the lane,
carrying: both probes' observed output verbatim; what each step changed with its
`path:line`; the gate figures; and a section for what could not be established.

**NOT ESTABLISHED beats a complete invented answer.**
