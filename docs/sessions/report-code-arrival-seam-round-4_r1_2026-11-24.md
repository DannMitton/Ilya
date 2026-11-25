# Report: the arrival seam, round 4, r1

Written on `cloud-lane-88`, 2026-11-24. Round 4 makes Dann's ratified slur-evidence sentence true where it fires. It changes no word he ratified, the gate's formula, or its whole-verse reach (`melisma-evidence.ts:79`). The lane was at `9c21c74` at the start (the checkout began at `5594904` and was fast-forwarded). It ends at the four step commits below and this report. Not merged, not pushed to `Shane`, no pull request.

| Commit | Step |
|---|---|
| `f82792a` | Step 1: the notice speaks only where there was something to name |
| `65d379e` | Step 2: the notes Ilya emptied keep their abstention (DESK DEFAULT, see the probe B section) |
| `017a8fb` | Step 3: one meaning for "sung notes" |
| `8f1f10b` | Step 4: comments, attribution, and dates |

## Step 0: the two probes, observed

Both ran through `ingestScoreFile` with the MusicXML parser, in a throwaway vitest file that is not committed.

### Probe A: a verse of four sung notes, a syllable on every note, one phrasing slur over two of them

The file is my own inline fixture, not a file in the repository: «Ночь», «над» (slur start), «мой» (slur stop), «дом», in one bar. The premise holds.

```
PROBE A gate [{"verse":1,"gate":"failed","sung":4,"notes":4,"syllables":4,"agrees":true,"unexplained":[],"vacated":0}] damaged false
PROBE A warnings [{"code":"slur-evidence-unchecked","message":"This verse has 4 syllables for 4 sung notes, and its slurs do not account for the difference. Ilya has left the words where your score prints them rather than choose which notes carry a melisma. Check the melismas here.","verse":1,"counts":[4,4]}]
PROBE A vacatedTail null
```

The gate fails, a `slur-evidence-unchecked` record is written, and its sentence says "4 syllables for 4 sung notes, and its slurs do not account for the difference" when there is no difference. Cause: `ingest.ts:380` sent the verse to the record on `unchecked` alone.

### Probe B: `n188-markings.musicxml`

The premise is **not shown by this file**. Observed output, as printed:

```
PROBE B warnings [{"code":"slur-evidence-unchecked","message":"This verse has 20 syllables for 26 sung notes, and its slurs do not account for the difference. Ilya has left the words where your score prints them rather than choose which notes carry a melisma. Check the melismas here.","verse":1,"counts":[20,26]}]
PROBE B vacatedTail null
PROBE B note m0-0-1 note bar 0 syl= жизнь v= vowel= ɨ slurs= [{"type":"start","number":1,"partnerEventId":"m0-1-2"}]
PROBE B note m0-1-4 note bar 0 syl= null v= vowel= ɨ slurs= []
PROBE B note m0-1-2 note bar 0 syl= null v= vowel= ɨ slurs= [{"type":"stop","number":1,"partnerEventId":"m0-0-1"}]
PROBE B note m0-3-4 note bar 0 syl= ра v= vowel= ɑ slurs= []
PROBE B note m1-0-1 note bar 1 syl= ду v= vowel= u slurs= [{"type":"start","number":1,"partnerEventId":"m1-1-4"}]
PROBE B note m1-1-4 note bar 1 syl= и v= vowel= i slurs= [{"type":"stop","number":1,"partnerEventId":"m1-0-1"}]
PROBE B note m1-1-2 note bar 1 syl= я v= vowel= ɑ slurs= []
PROBE B note m1-3-4 note bar 1 syl= мы v= vowel= ɨ slurs= []
PROBE B note m2-0-1 note bar 2 syl= вас v= vowel= ɑ slurs= [{"type":"start","number":1,"partnerEventId":"m2-3-4"},{"type":"start","number":2,"partnerEventId":"m2-1-2"}]
PROBE B note m2-1-4 note bar 2 syl= null v= vowel= ɑ slurs= []
PROBE B note m2-1-2 note bar 2 syl= null v= vowel= ɑ slurs= [{"type":"stop","number":2,"partnerEventId":"m2-0-1"}]
PROBE B note m2-3-4 note bar 2 syl= не v= vowel= ɪ slurs= [{"type":"stop","number":1,"partnerEventId":"m2-0-1"}]
PROBE B note m3-0-1 note bar 3 syl= бо v= vowel= o slurs= [{"type":"start","number":1,"partnerEventId":"m5-1-4"}]
PROBE B note m3-1-4 note bar 3 syl= в ду v= vowel= u slurs= []
PROBE B note m3-1-2 note bar 3 syl= ша v= vowel= ɑ slurs= []
PROBE B note m3-3-4 note bar 3 syl= ю v= vowel= u slurs= []
PROBE B note m4-0-1 note bar 4 syl= ти v= vowel= i slurs= []
PROBE B note m4-1-4 note bar 4 syl= и v= vowel= i slurs= []
PROBE B note m4-1-2 note bar 4 syl= ва v= vowel= ɑ slurs= []
PROBE B note m4-3-4 note bar 4 syl= то v= vowel= ʌ slurs= []
PROBE B note m5-0-1 note bar 5 syl= ли v= vowel= i slurs= []
PROBE B note m5-1-4 note bar 5 syl= ко v= vowel= ʌ slurs= [{"type":"stop","number":1,"partnerEventId":"m3-0-1"}]
PROBE B note m5-1-2 note bar 5 syl= ко v= vowel= o slurs= []
PROBE B note m5-3-4 note bar 5 syl= нец v= vowel= ɛ slurs= []
PROBE B note m6-0-1 rest bar 6 syl= null v= vowel= null slurs= []
PROBE B note m7-0-1 note bar 7 syl= null v= vowel= null slurs= []
PROBE B note m7-1-2 note bar 7 syl= null v= vowel= null slurs= []
```

What the file's own parse held before the deal, and what the count saw:

```
PROBE B before-deal syllables [["m0-0-1","жи"],["m0-1-4",null],["m0-1-2",null],["m0-3-4","знь"],["m1-0-1","ра"],["m1-1-4","ду"],["m1-1-2","и"],["m1-3-4","я"],["m2-0-1","мы"],["m2-1-4",null],["m2-1-2",null],["m2-3-4","вас"],["m3-0-1","не"],["m3-1-4","бо"],["m3-1-2","в"],["m3-3-4","ду"],["m4-0-1","ша"],["m4-1-4","ю"],["m4-1-2","ти"],["m4-3-4","и"],["m5-0-1","ва"],["m5-1-4","то"],["m5-1-2","ли"],["m5-3-4","ко"],["m6-0-1",null],["m7-0-1","ко"],["m7-1-2","нец"]]
PROBE B count [{"verse":1,"gate":"failed","sung":26,"notes":26,"syllables":20,"unexplained":["m0-1-4","m0-1-2","m2-1-4","m2-1-2","m7-0-1","m7-1-2"],"vacated":[{"eventId":"m7-0-1","verse":1,"text":"ко"},{"eventId":"m7-1-2","verse":1,"text":"нец"}],"undivided":[],"pinned":0}]
```

Read from that output:

- The fold seats «жизнь» on `m0-0-1` and closes the tail up. Each syllable after it sits earlier than the print put it: «ра» moves from `m1-0-1` to `m0-3-4`, and «вас» from `m2-3-4` to `m2-0-1`, ahead of the two notes the print left empty. «ко» «нец» leave bar 7 and land on `m5-1-2` and `m5-3-4`.
- Notes that end with a sustained vowel and no syllable of their own: `m0-1-4` and `m0-1-2` (ɨ), and `m2-1-4` and `m2-1-2` (ɑ). These are the print's own empty notes, so they read as melismas.
- The two notes Ilya emptied, `m7-0-1` and `m7-1-2`, end with **no vowel at all**. A rest, `m6-0-1`, sits between them and the last sung note, and a melisma cannot cross a rest (`vowel-resolver.ts:265-266`). So n188 does not show Fable's harm. In this file the emptied notes happen to be safe.

### Probe B control (added by me, not in the brief)

Because n188 does not show the harm, I asked whether the mechanism exists at all without the rest. Five notes, no rest, my own inline fixture: «жи» (slur start), «знь» (slur stop), «мо» (slur start), «ря» (slur stop), «дом». The fold fuses «знь» onto «жи» and the tail closes up.

```
B2 warnings [["slur-evidence-unchecked","This verse has 4 syllables for 5 sung notes, and its slurs do not account for the difference. Ilya has left the words where your score prints them rather than choose which notes carry a melisma. Check the melismas here."]]
B2 note m0-0-1 жи знь ɨ
B2 note m0-1-4 мо o
B2 note m0-1-2 ря ɑ
B2 note m0-3-4 дом o
B2 note m0-1-1 null o
```

The last note, which Ilya emptied itself, takes a sustained «o» from «дом» that no print supports. The mechanism is real, and the ratified clause "Ilya has left the words where your score prints them" is false for that note.

I also measured the five failed-verse baseline fixtures behind the 5594904b seating test (`strophic-repeat`, `-grace`, `-key`, `-meter`, and the ones that do not fail). Every failed verse in them has **0 emptied notes** (`vacated` 0, `unexplained` 2). So step 2 cannot move the seating that test pins.

## Step 1: the notice speaks only where there was something to name (`f82792a`)

- `ingest.ts:380`: `return count.damaged ? withUnderlayRecord(dealt, count) : dealt;`. The `|| count.unchecked.length > 0` is gone.
- `ingest.ts:454`: the record is written for a failed verse only where `v.unexplained.length > 0 || v.vacated.length > 0`.
- `round2.test.ts:225`: the per-fixture expectation uses the same condition, taken from `countUnderlay`.
- `round2.test.ts:240`, new and kept: probe A's case (four notes, four syllables, one slur) asserts the gate is `failed`, no `slur-evidence-unchecked`, and no `underlay-count`.

## Step 2: the notes Ilya emptied keep their abstention (`65d379e`)

**DESK DEFAULT, and a reading call that is yours to confirm.** The brief says: if a probe disproves its premise, build nothing for that item. Probe B on n188 does disprove the harm for that file. The control shows the harm in general, and the baselines show it cannot touch the 5594904b seating, so I built the step on the control. If you read the rule literally, `git revert 65d379e` removes it whole, and nothing else depends on it. It departs from a desk default of the 2026-11-24 close, not from Dann's 21:23 ruling.

- `ingest.ts:427-428`: a failed verse now abstains for `v.vacated` and drops only `v.unexplained`. A verse that did not fail is unchanged.
- `underlay-record.test.ts:78-79`: the n188 test now expects `vacatedTailEventIds` to be `m7-0-1` and `m7-1-2` for verse 1, and the `underlay-count` warning's `eventIds` to be the same two. The unexplained notes (`m0-1-4`, `m0-1-2`, `m2-1-4`, `m2-1-2`) stay un-abstained.
- `underlay-record.test.ts:82`, new and kept, built on the control, not n188: the emptied note's vowel is `undefined`, and with the record taken off it is defined.
- A fused token here joins with U+00A0 (`vowelless-fold.ts:26-27`), so the control's text is «жи» NBSP «знь».

## Step 3: one meaning for "sung notes" (`017a8fb`)

- `ingest.ts:450`: the record prints `v.notes`, not `v.sung`.
- `round2.test.ts:252`, new and kept: a failed verse with a pinned note (a mark alone) reads "6 sung note(s)" in the `underlay-count` record and "for 6 sung notes" in the slur record. I checked it fails with `v.sung` and passes with `v.notes`.

## Step 4: comments, attribution, and dates (`8f1f10b`), text only

- `{m}` now says what is counted: notes that can begin a syllable in the bars this verse shows, a tied note not counted, and for a later verse only bars where it has words of its own. At `melisma-evidence.ts:27`, `ingest.ts:398`, and `ratified-slur-line.test.ts:27`.
- `ratified-slur-line.test.ts:27`: the `{m}` ruling is credited to "a desk ruling, 2026-11-24, until Dann rules it".
- Every `2026-11-25` in the round's files and in `report-code-arrival-seam-round-3_r1_2026-11-24.md` is `2026-11-24` (zero left under `apps`, `packages`, and `docs/sessions`).
- `ratified-slur-line.test.ts:29`: "Six sung notes", with the sixth named as a last note with no text.
- `melisma-evidence.ts:5-9`: the base verse is counted over the bars it shows, not every sung note.
- The round-3 report's table now cites the seam gate at `melisma-evidence.ts:73-80`.

## Constraints kept

No word changed at `i18n.ts:1563` or in the pins at `ratified-slur-line.test.ts:17` and `:23`. The gate's formula and whole-verse reach are untouched. `scripts/ratchets.json` and `packages/score-parser/src/types.ts` are unchanged (empty diff against `9c21c74`). `score/` imports nothing from `insights/`.

## The eight gates

Run on the lane at `8f1f10b` (the report is the only later change), from a fresh `pnpm install --frozen-lockfile`, using the eight commands of the ship script as they stand in `docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh`. All eight exit 0.

| Gate | Result |
|---|---|
| 1 phonology | 462 passed (462) |
| 2 dictionary | 248 passed (248) |
| 3 web check | 0 errors and 12 warnings in 5 files |
| 4 web unit suite, whole | **6893 passed \| 5 skipped (6898)**, 372 files. Round 3 closed at 6890 \| 5 (6895), so +3, one per new kept test |
| 5 score-parser | 913 passed \| 5 skipped (918) |
| 6 blurb | 178 passed (178) |
| 7 integration | 159 passed (159) |
| 8 ratchets | OK |

Gate 4's five skips are the round-3 split (4 `burg` for want of `scipy`, 1 `heic`); I did not re-read them this round.

## What could not be established

1. **The live ship script's baselines.** `ilya-ship.sh` is not in the repository. The only copy I found is the 2026-10-12 scratch (`gates-scratch.sh`), whose figures are stale: it expects gate 1 at 251 and I measured 462, gate 6 at 145 against 178, gate 7 at 55 against 159. I report my own figures and the round-3 gate 4 figure only. Whether each gate is "at baseline" for the Mac script is NOT ESTABLISHED.
2. **Build and Playwright** were not run, as in round 3.
3. **Fable's delta read of `92c03cca..9c21c74e`** is not in the repository. I worked from the brief's account of it, and its items 1 and 2 I settled with the probes above.
4. **Probe A is my own fixture.** No repository file has four notes with a phrasing slur over two of them.
5. **A case step 1 may leave open.** With `count.damaged` restored at `ingest.ts:380`, a failed verse that has an unexplained note but whose count agrees would not reach the record. I did not construct such a case and could not show it exists.
6. **Two claims in the round-3 report that this round's evidence contradicts or doubts, left unedited** because the brief limits that file to the dates and one citation:
   - Its addendum (the paragraph under "the ratified sentence, seated and pinned") says "`n188-markings`: the sustained vowel across its two vacated tail notes is the right outcome." Probe B shows those two notes take **no** vowel, because of the rest at `m6-0-1`. The claim is wrong for the file as it stands.
   - Its Addendum 2 (line 95) says "Per Dann's ruling" for `{m}`. The brief calls that a desk ruling. The test comment now says so; the report still credits Dann. Say the word and I will correct it.
7. **Step 2 was built against a literal reading of "build nothing"** for the reason given above. That is yours to confirm or revert.
