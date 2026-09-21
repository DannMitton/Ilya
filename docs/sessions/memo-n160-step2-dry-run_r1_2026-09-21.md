# Memo: N.160 step 2 r1, the dry run

**Written 2026-09-21 by Claude Code, answering `brief-n160-step2-dry-run_r1_2026-09-21.md`.
Tree at `0687964`, branch `Shane`, plus this build in the working tree, uncommitted.**

**Status: WRITTEN, not DONE.** Every browser number here comes from the Sunless fixture on a
local production build (`ilya-prod`, port 4173) on a fresh origin, `n160dry.localhost:4173`, in
the browser pane. Your library was not opened. The dry run is DONE when the desk has read its
log on your library and named every unfound or rejected seat to you (brief §6).

**Instruments.** I read these in full this session: `CONTRACT.md`, the brief,
`memo-n160b-the-approach_r1_2026-09-21.md`, `memo-n160-the-work-and-its-views_r1_2026-09-21.md`,
and `memo-n159-build_r1_2026-09-21.md`. I read these ranges:

- `pairings.ts:60-260`, `:420-500`, and `:900-1060`;
- `text-diff.ts:1-60` and `:140-260`;
- `+page.svelte:370-440`, `:1695-1710`, `:2290-2380`, `:2455-2475`, `:2570-2610`,
  `:2780-2825`, `:3225-3240`, and `:3590-3615`;
- `document.svelte.ts:130-235`;
- `draw-pairings.test.ts:1-110`;
- `brief-n160-the-work-and-its-views_r1_2026-09-21.md:80-105`.

**Words.** *The heal*, *dry run*, and *the joined-run rule* are adopted from the N.160 memos.
*Outcome* (one of the five categories) and *seated word* (consecutive seats, in note order,
placed from one old word) are mine, coined here. `planHeal`, `dryRunLog`, `HealPlan`, and
`HealCase` are new identifiers.

---

## 1. The measurements, each against its stated expectation

| Measure | Expected, stated before | Measured |
|---|---|---|
| N.159's count, fixture as loaded | `97 drawn live, 0 kept as stored, of 97 seated` | the same |
| Dry run, fixture as loaded | `97 address`, every other outcome 0 | `97 seated = 97 address + 0 anchor + 0 joined + 0 rejected + 0 unfound` |
| N.159's count, fixture frozen (§1.1) | 12 drawn live | `12 drawn live, 85 kept as stored, of 97 seated` |
| Dry run, fixture frozen | `12 address + 74 anchor + 0 joined + 1 rejected + 10 unfound` | **exactly that** |
| Stored pairing map across a load that runs the dry run | byte-identical | **identical**, 13,639 bytes, string-equal |
| `updatedAt` across the same load | unchanged | **moved.** See §3 item 4: the control build moves it too |

### 1.1 How the fixture was frozen

This is memo N.160b §0, path 1: Clear, then a new poem.

1. I loaded the fixture. Its poem box fills with the score's own words on one line, the engraver's
   split «не проглядная» and «без ответная» included, and 97 seats are placed from it.
2. I pressed the poem's **Clear**. The seats survived: same 13,639 bytes, same hash.
3. I pasted the same poem as a singer types it: eight lines, with «непроглядная» and
   «безответная» whole. The pairing map was unchanged afterwards, so no re-seat ran. That is the
   freeze.
4. I reloaded, and the dry run ran on load.

**This is the mirror of your case, not your case.** Here the seats were placed from the split
words and the poem has them whole. The joined-run rule joins words of the CURRENT poem to match
one OLD word, so it cannot rejoin «не» + «проглядная» into «непроглядная». Those 10 seats are
unfound, as predicted. Your direction, seats placed from the whole words and a poem that now has
them split, is the one the rule covers. The tests exercise your direction (§2.2), not this
browser run.

**The one rejection is a correct match refused.** The second «тень» (note 19) matched the second
«тень» of the poem. Both its neighbours in the music, «проглядная» and «без», are unfound, so it
is not in a run of two, and the guard refused it. The seat keeps what it shows now, which the
safety rule requires. It is the guard erring the way memo N.160b §5 says it should. I record it
because the same shape can occur on your library if a split word sits on both sides of a word.

---

## 2. What was built

### 2.1 `heal.ts`, new

- **`planHeal(map, lines, noteOrder)`** (`heal.ts:147`) returns one outcome per seat. It reads
  the map and the lines and writes neither. The rules are N.160 §4.1's, in this order:
  1. **The address.** A seat whose `(line, word, slot)` still holds a slot of the same word is
     `address`. This is `drawPairings`' own test, so the count equals N.159's "drawn live". It
     did on both fixture runs.
  2. **The anchor.** The seated words, in note order, are aligned by a longest common subsequence
     against the poem's words, with case and ё folded (`foldLetters`, `heal.ts:108`, which is
     `glossAnchorForm`'s fold). A whole-word match is `anchor`.
  3. **Order is the tiebreak, and fixed seats bound the search.** Each run of unfixed seated words
     is aligned only against the words strictly between the fixed seats on either side.
  4. **The joined-run rule.** One old word may match 2 to 4 adjacent current words whose letters
     join to it (`JOIN_MAX`, `heal.ts:138`). Its syllables map across by ordinal. That is `joined`.
  5. **The guard** (`heal.ts:271`). A match is refused unless it sits in a run of two matched
     words, or it is the only unfixed seated word between two fixed seats. Refused is `rejected`,
     and the log says which rule found the match and where it would have gone.
  6. Everything else is `unfound`, with a reason.
- **`dryRunLog(plan)`** (`heal.ts:428`) formats the log (§4).

**DESK DEFAULTS in how the guard is read, each reversible:**

- A fixed seat counts as a matched word, so a match right beside a fixed seat is in a run of two.
- "Between two fixed seats" means the only unfixed seated word between them, landing between
  their words. A wider reading accepts any match in a bounded window, which is no guard.
- Adjacency counts only words that own a note. A vowelless clitic owns none and never breaks a
  run.
- A join is capped at 4 words. An alignment past 360,000 cells (`ALIGN_CELLS`, `heal.ts:133`)
  leaves its seats unfound rather than guessing. Nothing on the fixture comes near either cap.

### 2.2 `heal.test.ts`, new: 8 tests

| Brief §6 | Test | Line |
|---|---|---|
| An address that holds | an unchanged poem | `heal.test.ts:64` |
| An anchor match, and a joined-run match | Dann's case: the fixture's first four lines typed over four lines, then engraved on one | `:73` |
| **The «тень» case** | «тень» twice | `:104` |
| A guard rejection, and a seat nothing finds | a whole-poem replacement | `:139` |
| The guard's second clause, with a control | the only seat between two fixed seats | `:161` |
| Seats with no anchor, or on no note | a legacy seat and a stray seat | `:177` |
| Nothing written | the map and the lines deep-frozen, then compared as JSON | `:207` |
| The log | the totals line, and every seat listed exactly once | `:227` |

**In Dann's case, every seat lands**, with 0 rejected and 0 unfound. «непроглядная» maps
syllable by syllable onto `не.0`, `проглядная.0`, `проглядная.1`, `проглядная.2`, and
`проглядная.3`.

**The «тень» test.** Both seats were stored on line 1, which no longer exists. The first
«тень» the music sings goes to the first «тень» of the poem, and the second to the second. The
control swaps the two notes' order, and the two seats swap occurrences, so note order decides
it, not letters alone.

**Each test was checked for the ability to fail.** I made each mutation on a copy of `heal.ts`
and restored the file byte for byte afterwards.

| Mutation | Tests that fail |
|---|---|
| Joins off (`JOIN_MAX = 1`) | Dann's case, and «тень» |
| Guard off | the rejection, the guard's second clause, and the log |
| Seats ordered by stored address instead of by note | «тень» |

### 2.3 `+page.svelte`, 21 lines added

- An import (`+page.svelte:32`).
- One `$effect` beside N.159's instrument (`+page.svelte:2356-2376`). It uses N.159's gate
  (`lines` is this poem's) and adds one condition: the score's notes are present (`eventIds`,
  `:1707`). `switchSong` drops the score with the lines (`:3606-3608`), so one song's seats are
  never set against another song's notes.
- It runs once per song per load, on the STORED map, `doc.pairings`. It reads the stored map and
  not `shownPairings` because the stored map is what step 3 would write.
- Nothing is drawn on the page and nothing is put in the drawer.

**Held as the brief says.**

- There is no write to `doc.pairings`, to the library, or to storage.
- `VocalLineEvent` and `reconciliation/` are untouched.
- There is no new field on a pairing or a record.
- The stored seated text of step 3 is not added.
- N.159's drawing step and instrument are unchanged.

---

## 3. Results against brief §6

1. **Every seat in exactly one outcome, summing to the total.** On the fixture: 97 = 97 on
   load, and 97 = 12 + 74 + 0 + 1 + 10 frozen. Every test asserts the reconciliation
   (`expectReconciles`, `heal.test.ts:52`). For any other library, `planHeal` builds one case per
   syllable seat before assigning outcomes, so a seat cannot be dropped or counted twice.
2. **A case of each kind, by test.** Each kind has a test: address, anchor, joined, rejected, and
   unfound (§2.2).
3. **The «тень» case has its own test**, with the swapped-order control (`heal.test.ts:104`).
4. **Nothing written: half proved, and the other half is not the dry run's.**
   - **The pairing map is byte-identical** across a load that runs the dry run: 13,639 bytes,
     string-equal. So is every other field of the record except `updatedAt`.
   - **`updatedAt` moved**, about 7 seconds after load, from `08:02:09.630Z` to `08:03:05.942Z`.
   - **The control:** a build with the dry run removed, on the same origin and the same record,
     moved `updatedAt` on every load too, with only `updatedAt` differing. So the dry run is not
     what saves.
   - **What does save is NOT ESTABLISHED.** The document schedules a save whenever any tracked
     field is assigned, even with the same content (`document.svelte.ts:147-181`).
     `transcribeText` calls `keepSurvivingGlosses()` (`+page.svelte:2545`), which assigns two
     fresh maps to `doc.glossOverrides` and `doc.glossAnchors`. That is the likeliest trigger.
     **DESK INFERENCE, not traced.** I did not change it: it is outside this step.
5. **Readable on a deployed build.** Measured on a local production build. The log is ordinary
   `console.info` strings. The Vite config does not strip consoles. N.159's line reached the desk
   from your Chrome by the same route.
6. **Gates.** Each number was stated before the run.

| Gate | Script literal | Measured |
|---|---|---|
| 1 phonology | `216 passed (216)` | the same |
| 2 dictionary | `235 passed (235)` | the same |
| 3 web-check | `found 0 errors and 12 warnings in 5 files` | the same |
| 4 web-test | `1360 passed (1360)` | **`1368 passed (1368)`**, as predicted: 8 new tests |
| 5 score-parser | `575 passed \| 5 skipped (580)` | the same |

**Gate 4's literal must move to `1368 passed (1368)` before the ship.** That edit is the desk's,
with your permission. I did not touch the script.

---

## 4. What the desk looks for in the console

Search the console for `N.160 dry run`. On load, after N.159's `N.160 seats` line, it prints:

```
[Ilya] N.160 dry run: <n> seated = <n> address + <n> anchor + <n> joined + <n> rejected + <n> unfound. Nothing written.
[Ilya] N.160 dry run, address (<n>): <seat> | <seat> | ...
[Ilya] N.160 dry run, anchor (<n>): ...
[Ilya] N.160 dry run, joined (<n>): ...
[Ilya] N.160 dry run, rejected (<n>): ...
[Ilya] N.160 dry run, unfound (<n>): ...
```

A line for an outcome with no seats is omitted. Each `<seat>` reads:

```
note <k> <event id> «<what the note shows now>» of «<the word it was placed from>» <old line>-<old word>.<syllable> [-> <new line>-<new word>.<syllable>] [by anchor|joined] [(<reason>)]
```

Two real examples from the frozen fixture:

```
note 19 m4-0-1 «тень» of «тень» 0-7.0 -> 1-2.0 by anchor (the guard: alone, with no matched neighbour)
note 14 m3-1-4 «не» of «не» 0-5.0 (no word in the poem matches it here)
```

`note <k>` is the note's position among the score's syllable-bearing notes, counted from 1. It is
what the desk can name to you. The old address also answers the first question in brief §2,
which is §5.

**If the tab buffers only its recent messages** (the pane dropped earlier ones this session), the
totals line comes first, so read the console as soon as the song has loaded.

---

## 5. The four seats the earlier audit did not predict

**NOT ESTABLISHED from here, and the log answers it on your library.** One thing I can tether:
the earlier audit counted seats with a **dead `lineIndex`**
(`brief-n160-the-work-and-its-views_r1_2026-09-21.md:92-93`, "25 with a dead `lineIndex`"). N.159's
instrument counts any seat whose word fails, which includes a seat on a line that still exists at
a word index that now holds a different word. **So the likeliest reading of 29 − 25 is four seats
on line 0 whose word moved. DESK INFERENCE.** In the log they show as `0-<w>.<s>` addresses under
anything but `address`.

---

## 6. What could not be established

- **Your library: NOT OPENED.** The 29, and what the heal finds for each of them, are the desk's
  read.
- **What saves on every load** (§3 item 4). A control rules out the dry run. The trigger is
  inferred, not traced.
- **Whether `updatedAt` moving on load is what the brief meant to forbid**, or whether the brief
  assumed it did not move. Either way the dry run does not cause it.
- **A word removed where the music sings it twice.** If the poem loses one of two «тень» and
  keeps the other, the alignment gives the survivor to the earlier seat, because the earliest
  occurrence wins ties. That can be the wrong seat. It is N.160 §4.1's case 1. No test pins it,
  because neither answer is established as right.
- **Clitic seats in the score's own coordinates** (memo N.160b §2, step 3). The log prints every
  seat's old address, but nothing marks a clitic seat as such. On the fixture, every seat
  resolved without that distinction.
- **Paint and timing on a phone: not measured.** On the fixture the dry run is one pass over 97
  seats. I did not time it.

NOT ESTABLISHED beats a complete invented answer.

---

## 7. For you to commit

The two new files need adding before `ilya-ship.sh` accepts the tree:

```
cd ~/Desktop/ilya-rewrite
```

```
git add apps/web/src/lib/shane/heal.ts apps/web/src/lib/shane/heal.test.ts docs/sessions/brief-n160-step2-dry-run_r1_2026-09-21.md docs/sessions/memo-n160-step2-dry-run_r1_2026-09-21.md
```

After gate 4's literal reads `1368 passed (1368)`:

```
sh ~/Downloads/ilya-ship.sh "N.160 step 2: the heal's dry run, logged seat by seat on load, nothing written"
```
