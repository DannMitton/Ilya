# Brief: N.160 step 3. The stored text, and the heal that writes

**This brief is the desk's. Do not edit, rename, or replace it.**

**Written 2026-09-21 by the desk. For Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**
**Tree state read this session: HEAD `2fb7516`.**

**This is a BUILD brief, and it is the first one that writes to a singer's stored work.** It is
`memo-n160b-the-approach_r1_2026-09-21.md` §2 step 3, your own plan. Build that.

Read `docs/memory/CONTRACT.md` in full before you start.

**Dann exported his library to a binder before this brief was written.** That backup exists.

---

## 1. What was observed

**The dry run you built ran on Dann's own library, read by the desk in his Chrome on the
branch alias at 04:10 on 2026-09-21:**

```
[Ilya] N.160 dry run: 96 seated = 77 address + 9 anchor + 5 joined + 1 rejected + 4 unfound. Nothing written.
```

- **The joined-run rule resolves «непроглядная» in the direction his library actually holds**:
  the seat was stored whole, the poem now has two words, and all five slots map across,
  `1-1.0` to `1-1.4` landing on `1-1.0` and `1-2.0` to `1-2.3`.
- **The nine anchor matches** are «Тень», the second «тень», «безответная» and «Дума».
- **The five that do not resolve are one word.** Four notes carry «о ди но ка» from address
  `0-38`, which belongs to a poem he no longer has, and note 96 «я.» is rejected only because
  the guard found it with no matched neighbour, its neighbours being those four.

**A second observation, and it is about the instrument rather than the singer.** At 03:40 the
N.159 count read `67 drawn live, 29 kept as stored`; at 04:10 it read `77 drawn live, 19 kept
as stored`. The only activity in between was the desk flipping switches and reloading. **What
moved those ten seats is NOT ESTABLISHED**, and section 3 asks you to settle it, because a
count that moves on its own cannot be the evidence that a repair worked.

---

## 2. What is established

**The desk's own read this session:** the console output quoted above, from Dann's library.
**The desk did not open the tree. Every `path:line` below is your own, from
`memo-n160b-the-approach_r1_2026-09-21.md` §1, and is a lead until you re-read it.**

- One optional string on `SongRecord` (`library/types.ts:70-97`), the length of the poem.
- Its default for older records goes in `validateRecord`, as `corrections` did
  (`library.ts:175-180`).
- One field on the document, one line in its snapshot (`document.svelte.ts:222`), and the two
  conversions at `library.ts:57` and `:86`.
- **No schema bump.** `validateRecord` copies only the fields it knows
  (`library.ts:136-212`), so an older Ilya importing a newer binder drops the field and loads.
- Written where the seats are re-seated, in `transcribeText` beside `:2428`.
- **Clear does not erase it** (the seats outlive the poem, so their text must too). It clears
  only where the seats clear, `:628` and `:3163`.
- The re-seat diffs the new poem against it rather than against the session's grid.
  `transcribedGrid` keeps its other job.

---

## 3. Measure before you change anything

Two things, reported before you write the heal's write path:

1. **Settle the moving count.** Establish what re-seats a frozen seat during an ordinary
   session, such that the count fell from 29 to 19 while the desk flipped switches and
   reloaded. If it is `transcribeText`'s own re-seat doing the right thing, say so and say
   under which action. **If a switch flip can silently rewrite a stored seat, that is a
   finding and it outranks the rest of this brief.**
2. **State the expected outcome on Dann's library before the walk**, from the dry run's
   numbers: 14 seats repaired, 5 left, all of them «одинокая».

---

## 4. The rulings this serves

- **THE SAFETY RULE, and it governs every step:** a seat Ilya cannot find keeps what it shows
  now, and it is counted. **It is never erased.**
- **Dann, 2026-09-21, 02:12:** *"I don't think the user cares about which syllable was seated
  in another poem? That is irrelevant to their need for accurate representation of the poem
  they arrive with now."*
- **`CONTRACT.md` §5: before you change state on Dann's machine, record what was there.** His
  binder export is that record. **The heal must also be legible after the fact:** its log says
  what it wrote, per song, so a repair can be told from a corruption without a diff.
- **THE RULING DANN OWES IS ASKED AFTER THIS STEP, NOT IN IT** (`OPEN.md` §N.160): what a note
  shows when its word has truly left the poem. **The dry run predicts five such notes on his
  song, so the question now has a real count behind it. Do not implement either answer.**

---

## 5. Constraints

### What it writes, and nothing else

- The stored seated text, as section 2 describes.
- **The heal writes once per song, only for seats whose address fails, and only under the
  guard.** A rejected or unfound seat is left exactly as it is.
- **Nothing else in the record changes.** Prove it with a field-by-field diff across the heal,
  the way you proved the dry run wrote nothing.

### What must not change in this ship

- **`refreshPairings`, `stressAcutedCyrillic`'s own lookup, `ownedByPoem`, and re-seat rules 1
  and 2 all stay.** `memo-n160b` retires the first two at step 1 and `ownedByPoem` at step 5;
  the desk is holding all of them back, DESK DEFAULT, so that the first ship that writes to a
  singer's stored work carries no refactor beside it. **They get their own commit after this
  one walks.** Dann can overturn this.
- `VocalLineEvent`, and anything in `apps/web/src/lib/shane/reconciliation/`.
- No new mark on the page and nothing new in the drawer. `CONTRACT.md` §6.
- N.159's drawing step and both instruments stay.

### Out of scope

- Steps 4 and 5, which wait until after 2026-10-30.
- N.157, N.156, and the «одинокая» truncation itself.
- The `updatedAt` write on every load, which you flagged separately. **Do not fix it here, and
  do not let the heal hide it:** your field-by-field diff has to keep telling it apart from a
  real write.

---

## 6. Done when

1. **The three freezing paths of `memo-n160b` §0 no longer freeze a seat** on the fixture:
   Clear then a new poem; a reload inside the 600 ms typing pause; an edit while the dictionary
   is loading. One test each, plus a browser walk of at least the first.
2. **On a frozen fixture, the heal repairs what the dry run said it would, and a reload then
   reports those seats as `address`.**
3. **A song with nothing to repair is not written at all**, and its record is byte-identical
   across a load, `updatedAt` aside.
4. **The log says what was written**, per song, in the dry run's own format.
5. An unfound or rejected seat still draws its stored text, unchanged.
6. All five gates run, with the new gate 4 number reported and stated before the run.

**Gates.** The script is the instrument: `~/Downloads/ilya-ship.sh:76-80` now holds phonology
`216`, dictionary `235`, web-check `0 errors and 12 warnings in 5 files`, web-test
`1368 passed (1368)`, score-parser `575 passed | 5 skipped (580)`. The desk moves the literal
with Dann's permission; do not `sed` it yourself.

**`WRITTEN` is not `DONE`.** This closes when Dann opens his own Sunless song and sees the
notes of «Тень», «непроглядная», «безответная» and «Дума» carrying the poem again, with acutes
where Transcription has them.

---

## 7. Report back

`docs/sessions/memo-n160-step3-stored-text-and-heal_r1_2026-09-21.md`: the results against
section 6, the answer to section 3's first question, the gate numbers, and what could not be
established.

**NOT ESTABLISHED beats a complete invented answer.**

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`, `restore`,
`clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`. To measure a before state, copy the
file aside and copy it back.** Tell Dann what to commit and let him do it.
