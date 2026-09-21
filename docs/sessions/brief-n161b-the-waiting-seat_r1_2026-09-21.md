# Brief: N.161b. The fourth call site

**This brief is the desk's. Do not edit, rename, or replace it.**

**Written 2026-09-21 by the desk. For Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**
**Tree state read this session: HEAD `44c5830`.**

**This is N.161's second pass, not a new item.** A read-only Sonnet sweep, commissioned by
Dann after N.161 shipped, found a fourth call site that the rule does not yet reach. Its brief
is `brief-n161-coverage-sweep_r1_2026-09-21.md`.

Read `docs/memory/CONTRACT.md` in full before you start.

---

## 1. What was observed

**`seatFilledPoem` has four call sites. Three are gated on the map holding no syllable. One is
not.**

- `+page.svelte:636`: the map is cleared at `:635` immediately before the call.
- `+page.svelte:2553`: gated by `shouldSeatFirstTranscription(doc.pairings, true)` at `:2550`.
- `+page.svelte:3424`: gated by `Object.keys(merged.map).length === 0` at `:3422`.
- **`+page.svelte:2535`**, inside the `scoreSeatWaiting` block at `:2527-2537`: gated only on
  `waiting === ingestedScore`, `lines.length > 0`, and the input text still being the score's
  own words verbatim. **It never asks whether a syllable is already placed.**

`seatFilledPoem` (`:3260-3263`) runs `seatScoreWords`, which fills empty notes only, and then
`seatCliticFolds`, which writes every event id in a fold's run unconditionally
(`clitic-seat.ts:374-386`).

**The comment at `:2538-2549` shows the assumption.** It says the guard on the block below
"refuses once any note already carries a syllable, by hand, **by the `scoreSeatWaiting` block
just above**, or by `reseatAcross` itself". So the waiting block is treated as a
first-placement event without being gated as one.

**NOT ESTABLISHED: a reproduction.** The path to harm, read and not run: a score arrives
carrying words and fills the poem box; the dictionary is still loading, so `slotQueue` falls
back to `scoreTextQueue` (`:372-390`) and the singer can place by hand through the loupe; the
dictionary then finishes, `transcribeText` runs, and this block seats the fold over the run.

---

## 2. What is established

Read by the desk this session: `+page.svelte:2525-2556`, `:3255-3263`, and
`first-seat.ts:36-66`, whose own comment states the rule this brief applies: **"THE FOLD RUNS
ONLY WHERE PLACEMENTS ARE BUILT FROM NOTHING"** (`first-seat.ts:47`).

The sweep's other rows came back ACCOUNTED FOR, including `document.svelte.ts:283`'s
`#onRemoteWrite`, which it read as guarded by `isPending()` at `:303`. **It flagged that guard
as the one thing it did not verify to the same standard.** That is out of scope here and is
recorded in section 5.

---

## 3. Measure before you change anything

**State your expectation first, then answer this: can the window be reached at all?**

Can a singer place a syllable by hand while `scoreSeatWaiting` is pending? If the loupe cannot
be reached before the dictionary loads, the site is still wrong by the rule but harmless in
practice, and you should say so plainly rather than building against a hypothesis.

---

## 4. The rulings this serves

- **`first-seat.ts:38-64`, N.161's own rule**, quoted above.
- **Dann, 2026-09-04:** a lone vowelless clitic cannot exist on the page. **Whatever you do
  keeps that true**, which is the reason this site exists at all: it is what seats a score's
  own words once the poem finally arrives (N.134, N.145).
- **The freeze rule:** this joins the release on the same clause as N.161, losing a singer's
  work.

---

## 5. Constraints

### The trade you have to weigh, and it is the whole decision

**Gating `:2535` the way its three siblings are gated has a cost:** if the singer has placed a
single syllable by hand during that window, the score's own seat never runs, and the rest of
the piece stays unplaced. That is the case N.134 and N.145 exist to serve.

**So there are two shapes, and you choose:**

1. **Gate it like its siblings.** Simple, consistent, and it can leave a song mostly unseated.
2. **Seat only what is empty.** `seatScoreWords` already does this; the unconditional part is
   `seatCliticFolds`. Running the fold only when the clitic's own note is unplaced, or
   skipping notes that already carry a placement, would keep the seat and protect the hand
   placement. **Your own r1 answer said a partial fold is a broken run**, so if that still
   holds, say so and take shape 1.

**Recommend one and build it.** If you take shape 1, say in the memo what a singer loses.

### Out of scope

- `#onRemoteWrite`'s race (`document.svelte.ts:300-312`). Recorded in `OWED.md`, not fixed
  here.
- Everything the sweep marked ACCOUNTED FOR.
- The `updatedAt` write on every load.

### What this work displaces

**Nothing.** It is a second pass on an item already in week 2.

---

## 6. Done when

1. The window in section 3 is answered, either reproduced or shown unreachable.
2. `+page.svelte:2535` obeys `first-seat.ts:47`'s rule, by whichever shape you chose.
3. **A hand placement made while `scoreSeatWaiting` is pending survives the dictionary
   finishing**, or, if you took shape 1 and it cannot survive, the song is left unseated rather
   than rewritten, and the memo says so.
4. The N.134 and N.145 cases still seat: a score whose words fill the box gets its seat when
   the poem arrives.
5. All five gates run, with the new gate 4 number stated before the run.

**Gates.** `~/Downloads/ilya-ship.sh:76-80` now holds `216`, `235`,
`0 errors and 12 warnings in 5 files`, `1381 passed (1381)`, `575 passed | 5 skipped (580)`.
The desk moves the literal with Dann's permission.

---

## 7. Report back

`docs/sessions/memo-n161b-the-waiting-seat_r1_2026-09-21.md`: the answer to section 3, which
shape you took and why, the results against section 6, the gate numbers, and what could not be
established.

**NOT ESTABLISHED beats a complete invented answer.**

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`, `restore`,
`clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`. To measure a before state, copy the
file aside and copy it back.** Tell Dann what to commit and let him do it.
