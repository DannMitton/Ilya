# Brief: N.160 step 2. The dry run

**This brief is the desk's. Do not edit, rename, or replace it.**

**Written 2026-09-21 by the desk. For Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**
**Tree state read this session: HEAD `0687964`, working tree clean at the time of writing.**

**This is a BUILD brief, and what it builds writes nothing.** It is
`memo-n160b-the-approach_r1_2026-09-21.md` §2 step 2, your own plan. Build that. Do not
redesign it, and do not build step 3.

Read `docs/memory/CONTRACT.md` in full before you start.

---

## 1. What was observed

**On Dann's own library, 2026-09-21 at about 03:40, measured by the desk in his Chrome on the
branch alias**, the instrument N.159 shipped logged this once on load:

```
[Ilya] N.160 seats: 67 drawn live, 29 kept as stored, of 96 seated
```

**29 of his 96 seats hold text from an earlier poem.** Those notes keep what they were placed
with: the Notation switches do not reach them, and where one of them carries a stress, its
acute is withheld with nothing on the page to say so.

The singer's experience is that a quarter of one song stopped following the poem, silently,
and nothing they can do from the interface repairs it.

---

## 2. What is established

**The desk's own reads this session:** the console line above, read in Dann's Chrome; and
`docs/memory/` and `docs/sessions/`. **The desk did not open the tree. Every `path:line` below
is from your own memos and is a lead until you re-read it.**

From `memo-n160-the-work-and-its-views_r1_2026-09-21.md` §4.1, yours:

- **The anchor is the word's letters plus the syllable's ordinal**, with the address kept as a
  cache. `SlotOrigin.word` already is that anchor (`pairings.ts:81-93`).
- **Order is the tiebreak**, by longest common subsequence over word letters, which is
  `diffWordGrid`'s own algorithm (`text-diff.ts:161-221`). A seat whose address still holds is
  fixed first and bounds the search either side.
- **The joined-run rule:** an old word may match a run of adjacent current words whose letters
  join to the same thing, «непроглядная» against «не» + «проглядная».
- **Matching folds case and ё**, as the gloss guard does (`+page.svelte:2751-2753`).
- **The guard, your DESK DEFAULT:** accept a match only when it sits in a run of two or more
  matched words, or between two seats already fixed.

**The earlier audit's numbers, and they no longer add up.** It predicted **25** frozen seats,
15 matching a word still in the poem and 10 being the two words the engraver split. **The
instrument measured 29.** Where the other four come from is **NOT ESTABLISHED** and is the
first thing this dry run answers.

---

## 3. Measure before you change anything

Report these before writing the heal:

1. Re-run the count on the fixture and say what it reads there.
2. For Dann's 29, you cannot open his library. **Write the log so the desk can answer it from
   his browser**, which is how the 29 was found.

**State your expectation before each measurement and report against it.**

---

## 4. The rulings this serves

- **THE SAFETY RULE, and it governs every step** (`memo-n160b` §2, and `OPEN.md` §N.160):
  **a seat Ilya cannot find keeps what it shows now, and it is counted. It is never erased.**
- **Dann, 2026-09-21, 02:12:** *"I don't think the user cares about which syllable was seated
  in another poem? That is irrelevant to their need for accurate representation of the poem
  they arrive with now."* So the repair exists to make seats resolve, not to label them.
- **Dann's model**, `PRODUCT.md` §THE WORK, AND ITS TWO VIEWS.
- **THE RULING DANN OWES IS DELIBERATELY NOT ASKED YET** (`OPEN.md` §N.160): what a note
  shows when its word has truly left the poem. **It is asked after step 3, against this dry
  run's count. Do not implement either answer and do not raise it.**

---

## 5. Constraints

### It writes nothing. This is the whole point of the step

- **No write to `doc.pairings`, to the library, or to storage of any kind.** The heal is
  computed and logged.
- The log reports, for every seat: whether the address still holds; whether the anchor found
  the word; whether the joined-run rule found it; whether the guard rejected the match. **Each
  case carries its note id and its syllable**, so the desk can name a rejected seat to Dann.
- Totals must reconcile: every one of the seated notes appears in exactly one category.

### What must not change

- `VocalLineEvent`, and anything in `apps/web/src/lib/shane/reconciliation/`.
- No new field on a stored pairing. `library/types.ts:71` is schema 1 and there is no
  migration mechanism.
- No new mark on the page, and nothing new in the drawer. `CONTRACT.md` §6.
- **The stored text field of step 3 is NOT part of this step.** Do not add it.
- N.159's drawing step and its instrument stay as they are.

### Out of scope

- **Step 3 entirely:** the stored seated text, the heal's write path, and retiring
  `refreshPairings`, `ownedByPoem` and re-seat rules 1 and 2.
- Word repair, text curation, OCR, and line reconstruction.

---

## 6. Done when

1. The dry run logs every seated note in exactly one category, and the categories sum to the
   seated total on both the fixture and any library it is run against.
2. On the fixture, a case of each kind is exercised by a test: an address that still holds, an
   anchor match, a joined-run match, a guard rejection, and a seat nothing finds.
3. **The «тень» case has its own test.** Your memo names it as the likeliest failure: a word
   appearing twice whose two seats could resolve to the wrong occurrences. The order tiebreak
   is what should prevent it.
4. **Nothing is written.** Prove it: the stored pairing map is byte-identical after a load that
   runs the dry run, and the song's `updatedAt` is unchanged.
5. The log is readable from the console on a deployed build, because that is the only way it
   reaches Dann's own library.
6. All five gates run, with the new gate 4 number reported.

**Gates.** The script is the instrument: `~/Downloads/ilya-ship.sh:76-80` now holds phonology
`216`, dictionary `235`, web-check `0 errors and 12 warnings in 5 files`, web-test
`1360 passed (1360)`, score-parser `575 passed | 5 skipped (580)`. **Say your expected gate 4
number before you run.** The desk moves the literal with Dann's permission; do not `sed` it
yourself.

**`WRITTEN` is not `DONE`.** The dry run closes when the desk has read its log on Dann's own
library and named every unfound or rejected seat to him.

---

## 7. Report back

`docs/sessions/memo-n160-step2-dry-run_r1_2026-09-21.md`: the results against section 6, the
gate numbers, the exact console format the desk should look for, and what could not be
established.

**NOT ESTABLISHED beats a complete invented answer.**

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`, `restore`,
`clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`. To measure a before state, copy the
file aside and copy it back.** Tell Dann what to commit and let him do it.
