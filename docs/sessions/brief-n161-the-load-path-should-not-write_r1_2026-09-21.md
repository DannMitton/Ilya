# Brief: N.161. Should the load path write at all?

**This brief is the desk's. Do not edit, rename, or replace it.**

**Written 2026-09-21 by the desk. For Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**
**Tree read for this brief at `2fb7516` plus your unshipped step 3 changes.**

**THIS IS READ-ONLY. PROPOSE, DO NOT BUILD.** Your step 3 work is built and not yet shipped,
and this must not disturb it.

- **Write nothing inside the repository.** Scratch goes in `/tmp`.
- **No git command of any kind**, no build, no preview server, and **no gate run**.
- **Return your answer in chat**, not as a file. The desk transcribes it.

Read `docs/memory/CONTRACT.md` in full before you start.

**Numbered N.161, and the number is a DESK DEFAULT.**

---

## 1. What was observed

**Dann asked the question, on being told that a plain reload could rewrite up to 60 of his
stored seats:** *"Can we streamline that or eliminate it in favour of a better solution?"*

**What you measured 2026-09-21:** on a plain reload, because one note's stored Cyrillic read
«В бью» while the fold's seat read «в бью», `seatCliticFolds` rewrote notes 37 to 96 into the
score's own coordinates, where no poem address holds. That is how the desk reads it; you
found it and the account is yours.

**It is the second time the same comparison has drifted, and the file records both.** The
comment at `clitic-seat.ts:402-408` describes N.118 adding trailing punctuation to what the
test must ignore, for exactly the same reason and with exactly the same consequence. Your
step 3 change adds case and ё at `:409-416`.

---

## 2. What is established, read by the desk this session

- **`isCliticSeated` decides by comparing two strings** (`clitic-seat.ts:398-420`), after
  stripping trailing punctuation, lowercasing, and folding ё to е.
- **`seatCliticFolds` rewrites a fold's whole run when that test says unseated**
  (`:447-457`).
- **It runs on the boot restore** (`+page.svelte:3404`), and its own comment at `:3392-3403`
  states the premise that failed: *"IT RUNS ON A RESTORE TOO. The restored map already
  carries the seat, so this is a no-op there."*
- Its other call sites are `+page.svelte:642`, `:2563`, `:2633` and `:3263`.
- `isCliticSeated` is also read by `seatedCliticFolds` (`:477`), which drives what the
  underlay blanks. **A change to the test therefore reaches the page as well as the store.**

---

## 3. The question, and it is the whole brief

**Judge it from the singer's seat first.** A singer opens a song they placed weeks ago and,
before they touch anything, a quarter of their placements are rewritten into coordinates that
lose the link to the poem. No act of theirs, nothing on screen.

**Which of these is right, or what fifth thing would you do instead?**

1. **The load path stops writing.** `seatCliticFolds` runs at ingest and at the acts that
   rebuild placements, not on the boot restore. The legacy song that `:3404` exists for is
   seated once through N.160's heal, which already runs once per song on load and logs what
   it wrote.
2. **The test becomes structural, not textual.** A pairing records that it IS a clitic seat
   and the test reads that mark, so text drift cannot trigger a rewrite.
3. **Keep the text test and bound the damage.** Seat only notes still undecided; never
   overwrite a note carrying a poem address.
4. **Build neither.** Your step 3 fold closes the live case.

**The desk's own recommendation, for you to agree with or refute: 1 with 3 inside it.** Say so
plainly if it is wrong.

---

## 4. The rulings this sits under

- **Dann, 2026-09-04:** a lone vowelless clitic cannot exist on the page, and Ilya seats it
  with its host at ingest, with no proposal and no button (`+page.svelte:3392-3395`).
  **Whatever you propose keeps that true.**
- **N.160's safety rule:** a seat Ilya cannot resolve keeps what it shows and is counted. It
  is never erased.
- **The freeze rule** (`OWED.md` §RULINGS DANN OWES): a new finding joins this release only if
  Ilya would otherwise tell a singer something false or lose a singer's work. **Say where you
  think this lands now that step 3's fold has shipped the live fix.**

---

## 5. Constraints on what you may propose

- **Schema 1 is the only schema ever shipped** (`library/types.ts:71`) and there is no
  migration mechanism. A proposal that needs a required field is refused; an optional field
  with explicit `undefined` handling is the house pattern.
- **No mark on the page**, and nothing new in the drawer. `CONTRACT.md` §6.
- Do not propose changing `VocalLineEvent` or anything in `reconciliation/`.
- **Do not propose work for this week without saying what it displaces.**

---

## 6. What to return, in chat

**Dann has asked for consensus between you and the desk before anything is built.** So this is
not a request for approval of the desk's option 1. **If you think it is wrong, say so and say
why, in the code's terms.** Where you and the desk disagree, name the fact that would settle
it, and the desk either converges on your reading or puts the disagreement to Dann as two
positions rather than one recommendation. **A plan neither of us can fault is what he is
paying for here.**


1. Your recommendation, with the one thing that would change your mind.
2. What it costs: the call sites it touches, the tests it moves, and what it could break.
3. Where you think it lands against the freeze rule, and what it displaces if it is IN.
4. **What you could not establish. NOT ESTABLISHED beats a complete invented answer.**

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`, `restore`,
`clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`.** In this brief, no git command at
all.
