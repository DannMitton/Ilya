# Brief: N.161 coverage sweep. Did anyone miss a site?

**This brief is the desk's. Do not edit, rename, or replace it.**

**Written 2026-09-21 by the desk. For a Sonnet agent spawned from the coordinating desk.**
**Target tree: `~/Desktop/ilya-rewrite`, branch `Shane`, HEAD `44c5830`.**

**READ-ONLY. You write nothing, anywhere.** No file in the repository, no git command of any
kind, no build, no preview server, no gate run. Your whole output is a report in chat.

---

## 0. The files are NOT in your own container

**They are on Dann's Mac, reachable only through `mcp__remote-devices__device_bash`, and the
repository is mounted at `$HOME/mnt/ilya-rewrite`.** Verify with this first:

```
ls $HOME/mnt/ilya-rewrite/apps/web/src/lib/shane | head
```

**If that tool is missing, or fails twice, STOP and report NOT ESTABLISHED.** Do not search
your own container, and do not answer from anything but the files you have opened.

Prefix any read-only git with `--no-optional-locks`, or simply do not run git at all, which is
preferred.

---

## 1. What you are looking for

A singer's placements live in `doc.pairings`, a map from a note's event id to what sits on that
note. **N.161 just established a rule:** placements may be rebuilt only where they are being
built from nothing. A site that can rewrite an existing placement on a load, on a reload, or on
an ordinary text edit is a defect, because the singer loses work with no act of their own.

**Your question: is there a site nobody has enumerated?**

---

## 2. What is already accounted for. Do not report these as findings

Report them only if you find that one of them behaves differently from this description.

| site | what it does | why it is accounted for |
|---|---|---|
| `seatCliticFolds` at `+page.svelte:642`, `:2563`, `:3263` | seats the vowelless clitic with its host | rebuild sites: the map is built from nothing |
| `seatCliticFolds` at the arrival path | same | now gated on the map holding no syllable seat |
| `seatCliticFolds` at `reseatAcross` | same | **removed by N.161** |
| `reseatByDiff` / `reseat.ts` | moves seats when the poem changes | Dann's ruled re-seat rules |
| `firstPass`, `placeSyllable` | write a placement | the singer's own act, or a fresh map |
| `seatScoreWords` | seats the score's own words | fills empty notes only |
| `mergeOnUpload` | merges an upload | returns the existing map untouched on a re-upload |
| `applyHeal` / `heal.ts` | N.160's one-time repair | writes once, only for seats whose address failed, under a guard, and logs what it wrote |
| `drawPairings` / N.159's drawing step | draws from the live poem | reads only, stores nothing |

---

## 3. Method

1. **Enumerate every assignment to `doc.pairings`** and every function that returns a
   `PairingMap` which is then stored. Search `apps/web/src` and `packages`.
2. **For each, establish when it runs**: an act of the singer's, an ingest, a text edit, a
   load, or a render.
3. **For each, establish what it can overwrite**: only empty notes, only notes it owns, or any
   note in a run.
4. **Read the call site, not only the function.** A safe function called from a load path is
   still a load-path write.

**Every line you write carries a `path:line` you opened in this session.** A claim without one
does not appear. Where you reason from a comment, say it is a comment.

---

## 4. What to return, in chat

A table: site, what it writes, when it runs, what it can overwrite, and a verdict of
**ACCOUNTED FOR** or **FINDING**, each row carrying its `path:line`.

Then, separately:

1. **Your single most likely candidate for a missed site**, even if you rate it low.
2. **What you could not establish.**

**NOT ESTABLISHED beats a complete invented answer.**

**Do not propose a fix, do not design anything, and do not estimate effort.** Finding the sites
is the whole job.
