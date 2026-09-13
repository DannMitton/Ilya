# Memo: N.128, the beat a note thinks it is on

Return memo for `docs/sessions/brief-n128-stale-beat_r1_2026-09-12.md`, read in
full this session. Written by Claude Code, 2026-09-12. No git was run.

**Status: WRITTEN, observed in the Browser pane, not yet on Dann's page.** The
fix is in the tree, the new tests fail before it and pass after it, and the
five gates sit where the §7 table says. The pane observation used the same file
with the same two corrections, on the dev server. Dann's own page is a separate
browser with its own stored corrections, and nobody has looked at it since the
fix.

## 1. One correction to the brief's §2 first

The brief names `modification-engine.ts` as the duration-correction path. That
file is the vowel-modification engine (`packages/score-parser/src/modification-engine.ts:1-7`)
and has nothing to do with durations, so its zero hits proved nothing. The
duration path is `amend` in `apps/web/src/lib/shane/correction.ts:448`, reached
from `applyCorrections` (`correction.ts:305`). The brief's conclusion still
holds: before this fix, `amend` spread `...ev` and rebuilt only `duration`, so
nothing moved the onsets of the notes after a corrected one.

The fixture confirms what Dann's two corrections were. In the file, `тес` is a
quarter at 3.0 quarters and `на` is a quarter at 4.0 (parsed this session). On
his page `тес` draws as a dotted quarter and `на` as an eighth.

## 2. The choice from §3

**Chosen: option 1, recompute the onsets where the corrections are applied.**
The change is a new pass, `reflowOnsets`, that `applyCorrections` returns through
(`correction.ts:356`, pass at `correction.ts:382`).

"At the edit" cannot mean literally when a key is pressed. A correction is a diff
re-applied after every read, never an edited line (`correction.ts:8-18`), so the
corrected line exists only as the output of `applyCorrections`. That output is
where the onsets have to be true.

**How it moves an onset.** Each event's onset moves by the note values the
corrected line now holds before it in its measure, less the note values the
read held there. Three consequences follow, and a test pins each one:

- A measure with no correction moves by zero and keeps the reader's own event
  object (`correction.test.ts:470`).
- A gap the source wrote with `<forward>` survives, because the parser honours
  one (`packages/score-parser/src/musicxml-parser.ts:521-523`) and the shift is
  added to the reader's onset rather than counted from the barline
  (`correction.test.ts:463`).
- A deleted note closes its space, and a hand-entered entry opens space and sits
  at the end of its anchor as the anchor now stands.

**What option 1 costs.**

- One file of application code, about 70 lines, in `apps/web` only. The shared
  renderer is untouched.
- One more linear walk over the line whenever the correction map changes. The
  cost of this pass is not measured.
- Every consumer of the corrected line now reads the moved onset: the beam pass,
  the sustain test inside the analysis, the watch list, and the loupe. That is
  the point, and it is also the blast radius. §5 lists these consumers.

**What option 2 would have cost.** Option 2 derives the beat inside the
renderer's beam pass (`packages/score-parser/src/staff-renderer.ts:1611`).

- The renderer never sees the correction map, so it cannot tell a correction
  from a `<forward>` gap. It would have to count from the barline, which changes
  the beam groups on scores that nobody corrected, wherever a vocal part has a
  `<forward>`. That changes what the page draws beyond this defect.
- `sustain.ts` and `watchlist.ts` would keep reading the stale onsets.

**A third option, named and not taken.** Stop storing onsets and derive them
everywhere. That means changing `VocalLineEvent` or every consumer of the field,
which CONTRACT §6 forbids.

**Build neither.** The page would keep drawing new spacing with old beats. After
Dann's words in the brief, that is not defensible.

## 3. Files changed

- `apps/web/src/lib/shane/correction.ts`
  - `applyCorrections` returns through the new pass (`correction.ts:356`).
  - `reflowOnsets` (`correction.ts:382`), `ZERO` (`correction.ts:435`),
    `summable` (`correction.ts:438`), and `subtractFractions`
    (`correction.ts:547`) are new.
  - One sentence was added to the comment in `synthesize`
    (`correction.ts:511`): the entry's onset there is provisional, and the new
    pass replaces it.
- `apps/web/src/lib/shane/correction.test.ts`
  - Imports for the fixture and the renderer (`correction.test.ts:9-21`).
  - New block `N.128 a corrected duration moves the notes after it in its
    measure` (`correction.test.ts:421`), seven tests. The last renders
    measures 1 and 2 of the real fixture through `renderAnalyzedStaff` with
    Dann's two corrections and expects two beams (`correction.test.ts:483`).
- `apps/web/src/lib/shane/entry.ts`, comments only, required by CONTRACT §5
  because my edit shifted lines that the comments cited by number.
  - `entry.ts:141` cited `correction.ts:354`, which was already stale. It now
    names the `parts.length` test.
  - `entry.ts:533-547`, the `beatOfEntry` note, cited `correction.ts:371` as
    the stale-onset defect. It now says N.128 fixed that defect and why the
    loupe keeps its own sum. The code is unchanged.

Before the fix, six of the seven new tests failed. The page test failed with
`expected 1 to be 2`: one beam in measures 1 and 2, which matches the single
beam Dann measured in system 1. The seventh, the untouched-measure test, passed
before and after, as a test of "nothing else moves" should.

## 4. Gates

The five commands in `~/Downloads/ilya-ship.sh:76-80` were run directly rather
than through the script, because the script calls `git`.

| Gate | Baseline | After |
|---|---|---|
| 1 phonology | 216 passed (216) | 216 passed (216) |
| 2 dictionary | 235 passed (235) | 235 passed (235) |
| 3 web-check | 0 errors and 7 warnings in 4 files | 0 errors and 7 warnings in 4 files |
| 4 web-test | 1105 passed (1105) | **1112 passed (1112)** |
| 5 score-parser | 547 passed, 5 skipped (552) | 547 passed, 5 skipped (552) |

**Gate 4 moved by seven, and the ship script has NOT been updated.** The
permission classifier refused my edit to `~/Downloads/ilya-ship.sh`. Line 79
still reads `"1105 passed (1105)"`, so the script refuses at gate 4 until the
line changes. This command changes it:

```bash
sed -i '' 's/"1105 passed (1105)"/"1112 passed (1112)"/' ~/Downloads/ilya-ship.sh
```

This memo is a new file, so it needs `git add` before the ship.

## 5. The observation in the Browser pane

Dev server, the engraved fixture, `Score markup`. The pane's stored copy of the
song had `corrections: {}` before I touched it.

1. I selected `тес`. The loupe read `B♭3 · beat 3 · Quarter`. I pressed `.` and
   it read `… · Dot`.
2. I stepped to `на`. The loupe read `F3 · beat 4 · Quarter`. I pressed `4`.
3. The loupe drew `на–я` beamed. On the page, system 1 carried two beams, at
   x 310.45 to 331.26 over `на–я` and at x 557.39 to 584.13 over `ла–я`.
4. I pressed Cmd-Z twice. The store read `corrections: {}` again. I deleted the
   staged copy in `apps/web/static/reader/` and stopped the server.

These x values come from a 1024 px pane and do not compare with Dann's
measurements.

## 6. The rule, for the Guide (N.84)

A paragraph a singer can read, correcting the desk's reading in the brief:

> Ilya joins two or more eighth notes, or shorter notes, with a beam when they
> stand next to each other in the same bar, inside the same beat, with the same
> timbre. In 6/8, 9/8, and 12/8 the beat is a dotted quarter. In every other
> metre the beat is the note value the time signature's lower number names, so
> in 4/4 the beat is a quarter, and in 3/8 each eighth is a beat of its own and
> no two eighths are ever beamed. A beam stops at a rest, at a quarter note or
> anything longer, at a barline, where a new beat starts, and where the timbre
> changes between open and close, because an open note's stem points down and a
> close note's stem points up. A note Ilya has not analyzed has no timbre, so it
> beams with other unanalyzed notes and never with an analyzed one. Ilya finds
> the beat by counting the note values before a note in its bar, with every
> correction you have made included.

Where each clause comes from:

- Two or more: `staff-renderer.ts:1597`.
- Eighth or shorter, rest, and quarter or longer: `staff-renderer.ts:1604-1605`.
  The group flushes when a note has no pitch or no flag.
- Bar, beat, and timbre: the group key at `staff-renderer.ts:1611`.
- The beat's length: `staff-renderer.ts:1382-1385`. A metre is compound only
  when its lower number is 8 or more and its upper number is a multiple of 3
  greater than 3, so 3/8 is not.
- Stem direction by timbre: `staff-renderer.ts:1627-1630`.
- The count includes corrections: this fix.

**Two corrections to the desk's reading.**

- "Breaks at an unanalysed note" is not quite right. An unanalyzed note breaks
  a group only against an analyzed neighbour, and two unanalyzed notes in one
  beat beam together (`staff-renderer.ts:1607-1611`).
- "Flagged notes" should include the stop at any unflagged note, which is a
  quarter or longer (`staff-renderer.ts:1605`).

The 3/8 consequence is stated because it is what the rule does. Nothing here
changes it.

## 7. The §6 answer: sustain and the watch list

**Yes. Before this fix, a corrected duration could assign a note the wrong tempo
marking in both places.**

- Both `activeTempoAt` functions pick the latest tempo marking whose position is
  at or before the note's `(measureIndex, rhythmicPosition)`
  (`packages/score-parser/src/sustain.ts:61-85`,
  `apps/web/src/lib/shane/watchlist.ts:229-246`).
- Both receive the corrected line:
  - The page hands `correctedScore` to the pane (`+page.svelte:4703`), which
    becomes `parsed` (`VoiceProfilePane.svelte:656`) and then `readingScore`
    (`:720-721`).
  - `performanceOrder` passes the same event objects through with their onsets
    (`performance-order.ts:86`, `:99`) into `analysisScore`
    (`VoiceProfilePane.svelte:736`).
  - `analysisScore` feeds the analysis (`:855-857`), where `overlay-engine.ts:222`
    calls `isLongSustain`, and `buildWatchList` (`:873`).
- The fault needs three things at once: a tempo marking partway through a
  measure, a duration correction, deletion, or entry earlier in that measure,
  and a later note whose stale onset and true onset fall on opposite sides of
  the marking. That note's seconds were then computed at the wrong tempo, which
  can flip the 2.5 s sustain flag.

**After this fix, both read the moved onset. Neither file was changed.** The
fix reaches them because they already read the corrected line, not because
anything in them was edited. The tempo markings' own positions come from the
source (`musicxml-parser.ts:492`), and no correction can move them, which is
correct.

## 8. Words

- **Coined this session:** `reflowOnsets`, the pass's name, and "shift" for its
  method in this memo.
- **Adopted:** onset, beat, beam, timbre, gap, entry, and anchor, all from the
  tree (`correction.ts`, `entry.ts`, `staff-renderer.ts`).

## 9. What I could not establish

**NOT ESTABLISHED beats a complete invented answer.**

- **Dann's own page after the fix.** I have not seen it. His stored corrections
  live in his browser, and I reproduced them from the brief's description and
  the fixture, not from his store. DONE waits for him to see system 1 with
  both pairs beamed.
- **That his corrections are exactly `тес` dotted and `на` eighth.** This is
  inferred from the fixture against the brief's measurements, and it is
  consistent with both. His store was not read.
- **Whether Sunless no. 1 has a tempo marking partway through a measure.** So
  whether §7's fault ever touched this song is not established.
- **The cost of the new pass** on a long line. Not timed.
- **Whether any vocal part in the library carries a `<forward>` or `<backup>`.**
  Where one does, the loupe's `beatOfEntry`, which counts from the barline
  (`entry.ts:548`), and the stored onset, which keeps the gap, disagree. That
  disagreement predates N.128, this fix does not change it, and I did not look
  for such a file.
- **Whether a rebuilt `reader` line with an abstained duration** reaches
  `applyCorrections`. `summable` leaves the rest of such a measure where it
  stood, but no test exercises a real abstention.
