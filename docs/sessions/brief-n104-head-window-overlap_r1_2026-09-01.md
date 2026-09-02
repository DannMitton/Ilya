# Brief: N.104's loupe head and window overlap, and the key signature doubles

**For a fresh Claude Code session pointed at `~/Desktop/ilya-rewrite`, branch
`Shane`.** Written by the desk 2026-09-01, after Dann's walk of `510a280`.

**N.104 STAYS OPEN.** The head fix of `510a280` is correct and stays. It
introduced a second, separate fault, and this brief closes only that.

---

## 1. What Dann saw

On the engraved Without Sun song 1, raising the loupe on **m. 4** and on
**m. 7**, the head painted **three sharps: F sharp, C sharp, and a second
C sharp.** The key signature has two. His words: "this is weird and should not
be possible. Why is there a second c# in the key signature?"

Walked and confirmed on m. 4 (system 2 of 7) and m. 7 (system 3 of 7).
Screenshots are in the 2026-09-01 thread.

## 2. The cause, established by the desk this session

Two quantities that used to be one.

**The window's left edge is the leftmost HIT RECTANGLE of the held measure**,
`apps/web/src/lib/shane/loupe.ts:79`:

```
const left = Math.max(0, Math.min(...own.map((r) => r.x)));
```

**The head's bound is now the leftmost MUSIC INK**, `loupe.ts:338` (`headBound`)
fed by the `MUSIC_MARK` walk at `Loupe.svelte:563-580`, which `510a280`
introduced.

Before `510a280` the head was ALSO bounded on hit rectangles
(`Math.min(...allHits)`), so the head's right edge and the window's left edge
were the same number by construction and could not overlap. **That coupling was
never written down, and `510a280` broke it without noticing.**

Hit rectangles tile a system from the midpoint before each note, so on a measure
that OPENS a system the leftmost hit rectangle is at **56**, left of the key
signature. The head now runs past it.

| system | head bound | window left | overlap | second sharp's ink |
|---|---|---|---|---|
| 2 | 63.53 | 56 | 7.53 | 56.01 to 61.25 |
| 3 | 64.98 | 56 | 8.98 | 56.01 to 61.25 |
| 4 | 66.38 | 56 | 10.38 | 56.01 to 61.25 |
| 5 | 69.33 | 56 | 13.33 | 56.01 to 61.25 |
| 6 | 70.77 | 56 | 14.77 | 56.01 to 61.25 |
| 7 | 69.14 | 56 | 13.14 | 56.01 to 61.25 |

The second sharp sits entirely inside the overlap on every one, so the head
draws it and the window draws it again. The first sharp ends at 55.02, below 56,
so it is drawn once. Head bounds are `memo-n104-loupe-head_r1_2026-08-29.md`
§3.1; the window left of 56 is that memo's §3.3 row for m. 18; the sharps' ink
is its §3.1 closing paragraph.

**Scope: the first measure of systems 2 through 7**, that is source measures 4,
7, 10, 13, 16, 18. System 1's opening measure is the tacet bar, which carries no
hit rectangle, so `measureWindow` returns null and no loupe rises there.

## 3. How it got past every instrument

**Both numbers were already in the memo, in two tables, and nobody subtracted
one from the other.** §3.3 tested the window on m. 2, 3, 5, 8, 11, 14, 17 and
18. Every one of those is the second or third measure of its system except m. 18,
which opens system 7; its window was measured at 56 and never compared to that
system's head of 69.14.

Five gates passed. This is the class the walk exists for.

## 4. What to build

**Direction, not a ruling.** Measure first, then propose, then build.

**Clip the window's left to the head's right edge when they overlap**, so the
loupe paints each unit of the system once. On the affected measures this
discards 7.53 to 14.77 units from the window's left, and **what is discarded is
key-signature ink that the head is already drawing**, so nothing the singer
needs is lost. Verify that claim by measurement rather than accepting it.

**Do NOT solve it by lowering the head back onto hit rectangles.** That is the
defect `510a280` fixed: at 56 the head cuts the second sharp, which is what
Dann's §8 amendment ruled out.

**The alternative worth costing before you choose:** bring `measureWindow` onto
the same `MUSIC_MARK` basis as the head, so the two are one quantity again.
`memo-n104-loupe-head_r1_2026-08-29.md` §4 records that changing the sibling at
`Loupe.svelte:275-276` resizes the loupe's window on every system of the page,
so this route is larger than it looks. Cost it, state the cost, and let Dann
rule if it is not clearly the smaller change.

**Whichever route, leave a comment naming the coupling**, so the next change to
either quantity has to read that the two must not overlap.

## 5. Definition of done

1. On the engraved Without Sun song 1, the loupe on **m. 4, 7, 10, 13, 16 and
   18** paints the clef and **exactly two** sharps. Report all six as measured
   readings, not as four measured and two assumed.
2. The loupe on a second-or-later measure of any system is **unchanged**. Give
   before and after for m. 2, m. 3, and m. 5 at minimum.
3. **The held measure's window is unchanged in what it shows of the music.**
   Report its left, right and width before and after for every measure in §5.1,
   and state explicitly what ink, if any, the clip removed.
4. Five gates at baseline: phonology 216, dictionary 235, web-check 0 errors and
   7 warnings in 4 files, web-test **908**, score-parser 481 passed and 5
   skipped. **If you add a test, say so and give the new number; moving a gate
   baseline needs Dann's permission and `~/Downloads/ilya-ship.sh:79` holds
   gate 4's literal.**
5. A test that pins the coupling, so head and window cannot silently diverge
   again. `headBound`'s arithmetic is already pinned eight ways in
   `loupe.test.ts` under `describe('the head's bound')`; add the overlap case
   beside it.

## 6. Constraints

- **You do not run git. No agent commits, ever.** Dann ships with
  `sh ~/Downloads/ilya-ship.sh "N.104: ..."`. It refuses on untracked files
  anywhere in the repository, so tell him what to `git add`.
- **Do not touch the renderer.** `packages/score-parser/src/staff-renderer.ts`
  draws the key signature once, correctly, at `:1017` and `:1066-1069`. The
  source declares `<fifths>2</fifths>` and nothing else. **The fault is entirely
  in the loupe.**
- Every claim carries a `path:line`, a run, or "not established". No fourth form.
- State your expectation and the likeliest failure mode BEFORE each measurement,
  in the message, not afterwards in the memo.
- The build is WRITTEN until Dann has walked it on a deploy.

## 7. Return format

A memo at `docs/sessions/memo-n104-head-window-overlap_r1_2026-09-01.md`:
what changed with the exact lines, the six measurements of §5.1, the before and
after of §5.2 and §5.3, the gate table, what you looked at with your own eyes,
and a NOT ESTABLISHED list. Name the commit message for Dann to paste.
