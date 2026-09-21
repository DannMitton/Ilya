# Memo: N.161b r1. The waiting seat

**Written 2026-09-21 by Claude Code, answering `brief-n161b-the-waiting-seat_r1_2026-09-21.md`.**
**Tree: HEAD `44c5830` plus one modified file and two new ones, uncommitted. Status: WRITTEN.**

---

## Section 3: the window can be reached. REPRODUCED on `44c5830`

**Expectation, stated before the measurement:** reachable, because `slotQueue` falls back to
the score's own words while the dictionary loads (`+page.svelte`, `slotQueue`), so the loupe's
syllable row has something to tap.

**The instrument.** On the dev server a fresh origin loads the dictionary in about 1.6 s, which is
too short to act in from a script. I added one line to a copy of `loader.ts` that holds the load
until a `localStorage` flag is set, and copied the original back afterwards. `git status`
confirms `loader.ts` is unchanged. The line only stretched the window; everything I did inside
it was the ordinary loupe.

**What happened, on `44c5830`, Sunless fixture, fresh origin:**

1. With the dictionary held, the upload filled the box and stored 60 placements: the fold's run,
   note 37 «в бью». Notes 1 to 36 were empty and the seat was waiting.
2. The loupe rose on note 37. Its **Syllables** row drew all 96 of the score's syllables.
3. I selected note 37 and tapped «щем». The record held «щем» on note 37.
4. I released the dictionary. Notes 1 to 36 were seated, and **note 37 went back to «в бью».**

**How long the window lasts for a real singer: NOT ESTABLISHED.** It is the dictionary load. The
two main files are 47 MB and 49 MB (`static/data/dictionary.86d83340-a.json`, `-b.json`), plus
two gloss files of 37 MB and 38 MB. On a first visit over a real network that is seconds at the
least; on a return visit, with the dictionary cached, it measured about 1.6 s here on the dev
server. The brief's "wrong by the rule but harmless in practice" does not hold: the loupe works
in the window, however short it is.

---

## The shape, and why neither of the brief's two

**What the brief did not have: the fold has already run by the time the waiting seat is spent.**
The seat waits only where `mergeOnUpload` returned an empty map (`applyArrival`, the
`scoreSeatWaiting = ingested` line), which means the map was empty before the merge, so
`shouldFoldOnArrival` said yes and the fold wrote its whole run at arrival. Step 1 of the
reproduction shows it: 60 placements before the dictionary lands.

- **Shape 1, gated like its siblings, would refuse every score with a fold,** touched or not,
  because the map always holds the fold's run by then. Notes 1 to 36 of Sunless would stay
  empty on every first ingest made while the dictionary loads. That is far more than "a single
  hand placement costs the rest of the seat".
- **Shape 2 as written, a partial fold, is still a broken run.** My r1 answer stands.

**What I built:** `seatWaitingScore` in `apps/web/src/lib/shane/waiting-seat.ts`. When the waiting
seat is spent, it:

1. runs the fold **only if the map holds no syllable**, the same test as N.161's three sites
   (`shouldFoldOnArrival`), and then first, in the order `applyArrival` measured;
2. then runs `seatScoreWords`, which fills empty notes only and never seats a slot twice.

The fold is never partial: it ran whole at arrival, or it runs whole here from nothing.
`transcribeText` calls this in place of `seatFilledPoem` for the waiting block only.
`seatFilledPoem` and its other three callers are unchanged, and its doc comment now says the
waiting path no longer comes through it. The N.145 comment that named the waiting block as a
first-placement event is corrected.

**What a singer loses:** nothing that the old spend gave them, except the rewrite. If the singer
undoes the fold by hand in the window, the undo stands, as it would after the dictionary loads.

---

## Results against section 6

1. **The window is answered.** Reproduced, as in section 3.
2. **`+page.svelte`'s waiting block obeys `first-seat.ts`'s rule.** The fold runs there only when
   the map holds no syllable.
3. **A hand placement made in the window survives. PASSED, browser.** On the build, with the same
   steps and the same hold: note 37 held «щем» before the release and still held «щем» after.
   Notes 1 to 36 were seated (note 1 «Ком», note 36 «я;»), 96 placements in all, and the score
   no longer draws «в бью».
4. **The N.134 and N.145 cases still seat. PASSED, browser, for N.134's waiting path.** On the
   build, untouched: 60 placements while held, then 96 of 96 after the release, note 1 «Ком»,
   note 37 «в бью». N.145's site (`shouldSeatFirstTranscription`) is not touched by this change.
5. **The five gates. PASSED.** Stated before the run: 1, 2, 3, and 5 at baseline, gate 4 from
   1381 to 1385.

| Gate | Result |
|---|---|
| 1 phonology | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` |
| 3 web-check | `svelte-check found 0 errors and 12 warnings in 5 files` |
| 4 web-test | `1385 passed (1385)` |
| 5 score-parser | `575 passed \| 5 skipped (580)` |

The gates ran on the tree without the loader hold. **Gate 4's literal must move from `1381` to
`1385`**, the desk's to move with Dann's permission.

**The four new tests** (`waiting-seat.test.ts`, on the Sunless fixture):

- on an untouched arrival map, the result equals the old spend's exactly, every slot once;
- a hand placement on the clitic note is kept, and the notes before the run are still seated;
- control: the old spend rewrites that same hand placement with the fused seat;
- on a map with no syllable, it folds first and then seats, equal to the arrival's own order.

---

## NOT ESTABLISHED

- **The window's length on Dann's devices**, first visit or return. Section 3 gives the file
  sizes and one dev-server reading only.
- **N.145's case in the browser.** Its code did not change; I did not walk it.
- **`#onRemoteWrite`'s race.** Out of scope, as the brief says.

---

## What Dann commits

Five files are untracked: the two new source files, the desk's two briefs, and this memo. From
the repository root:

```bash
cd ~/Desktop/ilya-rewrite
```

```bash
git add apps/web/src/lib/shane/waiting-seat.ts apps/web/src/lib/shane/waiting-seat.test.ts docs/sessions/brief-n161-coverage-sweep_r1_2026-09-21.md docs/sessions/brief-n161b-the-waiting-seat_r1_2026-09-21.md docs/sessions/memo-n161b-the-waiting-seat_r1_2026-09-21.md
```

Then, once the desk has moved gate 4's literal to `1385`:

```bash
sh ~/Downloads/ilya-ship.sh "N.161b: the waiting seat fills empty notes only and folds only from nothing, so a hand placement made while the dictionary loads survives it"
```

NOT ESTABLISHED beats a complete invented answer.
