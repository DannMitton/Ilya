# Brief: N.161 r2. Build it

**This brief is the desk's. Do not edit, rename, or replace it.**

**Written 2026-09-21 by the desk. For Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**
**Tree state read this session: HEAD `abfbbc3`, working tree clean.**

**This is a BUILD brief.** It builds the plan you and the desk agreed in
`brief-n161-the-load-path-should-not-write_r1_2026-09-21.md` and your answer to it, transcribed
into `docs/memory/OPEN.md` §N.161. **Build that. The design is settled; do not reopen it.**

Read `docs/memory/CONTRACT.md` in full before you start.

---

## 1. What was observed

**Dann, 2026-09-21**, on being told a plain reload could rewrite up to 60 of his stored seats:
*"My goodness! rewriting up to 60 stored seats doesn't sound very efficient."*

**What you measured the same day:** because one note's stored Cyrillic read «В бью» while the
fold's seat read «в бью», `seatCliticFolds` rewrote notes 37 to 96 into the score's own
coordinates, where no poem address holds. Step 3's case fold closes that case. **The mechanism
is still there.**

A singer opens a song they placed weeks ago and, before they touch anything, a quarter of their
placements are rewritten. No act of theirs, and nothing on screen.

---

## 2. What is established

**Read by the desk this session:** `clitic-seat.ts:398-420` and `:447-457`, and
`+page.svelte:470-487`, `:642`, `:2563`, `:2633`, `:3263`, `:3392-3404`.

**Read by you, in your r1 answer, and the desk is taking these as yours rather than re-deriving
them:** `clitic-seat.ts:1-180` and `:340-500`, `+page.svelte:440-500` and `:3375-3410`. In
particular the fold depends only on the score, never on the poem (`findCliticFolds`,
`clitic-seat.ts:145-165`), and it shifts every syllable from «в» to the end one note earlier
(`:79-85`).

---

## 3. Measure before you change anything

**One thing, and it decides whether the `:3404` gate can be dropped entirely rather than
gated.** State your expectation first.

**Does a stored song exist whose score has a fold, whose clitic note does not hold the fused
seat, and which nobody changed by hand?** You named this in r1 as the fact that would move you
to the per-song marker. You cannot read Dann's library; **say exactly what the desk should run
in his Chrome to answer it**, and the desk will run it before the walk.

---

## 4. The rulings this serves

- **Dann, 2026-09-04:** a lone vowelless clitic cannot exist on the page, and Ilya seats it with
  its host at ingest, with no proposal and no button (`+page.svelte:3392-3395`). **Keep that
  true.**
- **Dann, 2026-09-07**, the deletion rule: a deleted word vacates its notes rather than sliding
  the rest of the line along (`PRODUCT.md` §THE TEXT AND THE NOTES).
- **The freeze rule.** This is IN on both clauses, which is your reading and the desk agrees:
  a hand change on one note silently rewrites up to 60, and a deleted word comes back on the
  page.

---

## 5. Constraints

### Build

**`OPEN.md` §N.161, "The plan, agreed between the desk and Code".**

- Keep the fold at `+page.svelte:642`, `:2563` and `:3263`.
- **Gate it at `:3404`** on the map holding no syllable seat before the merge, the test
  `first-seat.ts` already makes.
- **Remove it from `:2633`.**
- **The gate is a pure predicate in a `.ts` file**, because vitest cannot reach `+page.svelte`.

### What must not change

- **The fold's own code.** `clitic-seat.test.ts` and `score-seat.test.ts` stay green and
  untouched, including their idempotency tests.
- `blankUnderlay` and `seatedCliticFolds` keep reading `isCliticSeated` (`+page.svelte:470-487`).
- N.159's drawing step, N.160's dry run, and the heal.
- No new field on a stored pairing, no schema change, nothing on the page or in the drawer.

### Out of scope, and each is recorded elsewhere

- **The per-song marker.** Held in reserve, and section 3 is what would call for it.
- **Retiring `refreshPairings`, `stressAcutedCyrillic`'s lookup, `ownedByPoem` and re-seat
  rules 1 and 2.** Owed as its own commit (`OWED.md`).
- **The `updatedAt` write on every load.** Owed and untraced (`OWED.md`). Do not fix it here,
  and keep your field-by-field diff able to tell it apart from a real write.

### What this work displaces

**N.141's last step, the squircle across a tie, moves from week 2 to week 3 beside N.132.**
DESK DEFAULT, recorded in `SCHEDULE.md`. The week-5 buffer is already spent. **Say if that
trade looks wrong from the code's side.**

---

## 6. Done when

1. **A hand change on note 37, then a reload, survives.** Browser walk on the fixture, with the
   prediction stated first and a record diff showing only `updatedAt` moving.
2. **Deleting the host word from the poem does not bring it back on the page**, and the seats
   after it do not freeze. Browser walk on the fixture.
3. **A first ingest still seats the fold**, and so does a whole-song replace.
4. **A re-upload onto placed work no longer folds**, which agrees with the merge rule.
5. The gate's predicate has its own tests: it refuses a map with placements, it accepts an
   empty map, and a control.
6. All five gates run, with the new gate 4 number reported and stated before the run.

**Gates.** The script is the instrument: `~/Downloads/ilya-ship.sh:76-80` now holds phonology
`216`, dictionary `235`, web-check `0 errors and 12 warnings in 5 files`, web-test
`1378 passed (1378)`, score-parser `575 passed | 5 skipped (580)`. The desk moves the literal
with Dann's permission; do not `sed` it yourself.

**`WRITTEN` is not `DONE`.** Dann walks it on his own library.

---

## 7. Report back

`docs/sessions/memo-n161-the-load-path_r1_2026-09-21.md`: the results against section 6, the
console or script the desk should run in his Chrome for section 3, the gate numbers, and what
could not be established.

**NOT ESTABLISHED beats a complete invented answer.**

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`, `restore`,
`clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`. To measure a before state, copy the
file aside and copy it back.** Tell Dann what to commit and let him do it.
