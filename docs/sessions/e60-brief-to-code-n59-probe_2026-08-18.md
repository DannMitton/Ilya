# BRIEF — N.59 tier 2, THE SLICE PROBE

**Paste this whole file into a fresh Opus Claude Code session pointed at
`~/Desktop/ilya-rewrite`.**

Written by the coordinating desk, 2026-08-18, against `58d7888`.
Downstream of `docs/sessions/e60-memo-n59-phase0_2026-08-18.md`, which killed the
substrate-decider design and is the reason this brief exists.

**NOT ESTABLISHED beats a complete invented answer.**

---

## 0. The substitution, stated first because it is a change of instrument

Dann authorized **"deskew per system, then run the existing decider."** This
brief tests something cheaper and upstream of it, and he has been told.

**Deskewing per system requires first knowing where the systems are, and that is
the thing that fails.** Phase 0's step −1 found all twelve bands and all sixty
lines on the failing page **without deskewing anything**, by projecting inside
200 px vertical slices and matching five-line combs across them. A 200 px slice
moves a line 3.5 px where the full page moves it 61.

So the question is not "can we flatten the page." It is **"can we stop assuming
it is flat."** If slicing alone is enough, no dewarp is needed and the change is
small. If slicing is not enough, the dewarp question comes back with better
evidence than it has now, and this brief tells you to report that rather than
build it.

**The instrument has already passed both controls, by accident, inside Phase 0:**

- On `score-page32-deskewed.png`, where `detect_staves` fails, it found
  **12 bands of 12 and all 60 lines.**
- On `ilya-voice-page.png`, where `detect_staves` succeeds, it returned **the
  same 8 staves and the same 40 line positions to within 0.5 px on every one**,
  run blind.

That is a negative and a positive control already met. This brief asks whether it
survives being promoted from diagnosis to decider.

---

## 1. What you are doing, and what you are NOT doing

You are answering **five questions in order** and writing **one memo**. Stop at
the first NO and report it. A cheap honest stop is the good outcome.

**THE REPOSITORY STAYS CLEAN. Do not modify any file under
`~/Desktop/ilya-rewrite`.** Work in `/tmp/probe/`: import the reader's own
modules and inject a patched `detect_staves` by rebinding, so every number you
report comes from the real code with one function swapped. If injection turns out
to be infeasible for the fixture harness, **stop and say so** rather than editing
the tree.

**YOU DO NOT RUN GIT.** No commits, no adds, no branches, no stashes.

---

## 2. Read first, in this order

1. `docs/sessions/e60-memo-n59-phase0_2026-08-18.md` — **in full.** It is the
   measurement this brief stands on, including the tracker's own parameters and
   the twelve-staff table.
2. `docs/sessions/e59-design-substrate-decider_r1_2026-08-17.md` — **§3, §4, §6,
   and §9 only.** §3 is the July strike, §4.1 and §4.2 are ruled measurements you
   may not re-derive, §6 carries the regression gates this brief reuses, §9 is
   Pyodide.
3. `tools/e16-harness/reader/reader.py` lines 15 to 30 and 284 to 380. The gate
   you are replacing and the whole path downstream of it.

Verified at `58d7888` by the coordinating desk: `reader.py:15` is
`_derive_rowfrac_gate`, `:284` is `detect_staves`, `:376` is the empty-`checked`
raise, `:378-379` is the `page_substrate` / `sentinel` wiring. **If the tree
disagrees, the tree wins** — say so and carry on.

---

## 3. The tracker, as Phase 0 built it

Rebuild it from the memo if the Phase 0 scratch is gone. Its stated parameters:

- **200 px vertical slices**, 13 of them across x = 0…2583
- per-row ink coverage inside each slice
- peak threshold **0.45 coverage**, prominence **0.12**, radius **7**
- peaks matched across slices as whole **five-line combs**, never as individual
  lines, so a tracker cannot slide onto a neighbouring line
- vertical dark runs longer than **6 px** excluded, because measured line
  thickness is median 4 px with 83 % at 3–5 px, and a longer run is a stem or a
  notehead merging with the line

**Slice count and width are hardcoded to one page's dimensions.** Deriving them
from page width is part of the work; see §6.

---

## 4. THE FIVE QUESTIONS, IN ORDER. Stop at the first NO

### Q1. Does it read the photograph, END TO END?

Inject the tracker as the candidate-row generator inside `detect_staves`, keeping
**everything downstream unchanged**: grouping into lines, grouping into staves,
five-line validation, the spurious `len(st) <= 2` branch, the sentinel.

Run `detect_staves` on `~/Downloads/score-page32-deskewed.png` and report **what
it returns**, not what the candidate stage produced.

**Take the smallest change that can work.** Have the tracker emit candidate
**rows** — the union of its comb rows — and let the existing grouping consume
them. **Do not have it emit staves directly.** That would bypass five-line
validation and move the sentinel's binding point, and both are ruled.

**The failure this is most likely to hit, so recognize it rather than patch
around it:** on staff 12 a single staff line occupies **71 page rows** against 12
on staff 7. Proximity grouping may merge two lines into one, or one line into
two, or fail five-line validation. **If that happens, report exactly which staves
and exactly how the grouping went wrong, and STOP.** That is the finding that
brings the dewarp back, and it is worth more than a patched grouping rule.

**The sentinel will raise.** Phase 0 measured 59 of 60 correct rows below
`K_S = 0.9737` on this page. Expect `SentinelRaise`. **Bypass it for this probe
only, note that you did, and report the concentrations.** Do not change `K_S`,
do not change `substrate.py`, and do not propose a new value. That `K_S` is
calibrated to Verovio renders and to nothing else is now an established finding
and it is Dann's to rule on separately.

### Q2. GATE 1. Do all 23 fixture pages stay byte-identical?

Run it **second, not last.** This is where the probe most likely dies, and
finding that out early is cheap.

**DO NOT TUNE THE CONSTANTS TO PASS THIS GATE.** If 0.45, 0.12, 7, the slice
width, or the slice count would need to move to keep the corpus identical, that
is parameter fitting against the test set. Fable's T3 fence permits fitting a
hand-specified model behind **four conditions**, and **this desk has not read
those four conditions**, so this brief cannot authorize it. Report what would
need to be derived and from what, and stop.

If pages move, report **which** and **by how much** — a diff of the read output,
not just a pass or fail count.

### Q3. GATE 2. Do the three 1.000 pages re-score 1.000?

Fable's tier-1 gate. Run through the harness.

**Gate 3, the five ship gates, is NOT APPLICABLE to this probe** and you should
not spend time on it: phonology, dictionary, web-check, web-test, and
score-parser are TypeScript and web gates, and a probe that modifies no
repository file cannot move them. They become applicable when the change is
actually made, which is a later session.

### Q4. What single `s` does it return on a page that has no single `s`?

`detect_staves` returns one `s`. This page's `s` runs **17.00 at staff 1 to 21.00
at staff 12, monotone.** Downstream consumes that single value —
`beams.py`'s `int(1.7 * s)` among others.

Report what value comes out, how it was derived, and **what the read looks like
on the staves furthest from it.** A page that returns staves and then reads them
against an `s` that is 20 % wrong on a third of the page has not been rescued;
`ENVIRONMENT.md:639-642` already records that the same music reads differently at
different spacings, 78 notes at s = 21 against 79 at s = 29.

**This may be the finding that ends the photograph path even if Q1 to Q3 all
pass. Report it plainly; do not solve it.**

### Q5. What does it cost per page?

Against the recorded envelope: **`envelope.run` 1.96 to 2.36 s per page**, load
3.36 s, floor 2.9 s / 0.867 s per page. Thirteen sliced projections with peak
finding on a 3,735-row page is more work than one full-width projection.

Report the multiple, on both the photograph and the control. **A singer on a
phone pays this.** If it is more than roughly two times the current cost, say so
loudly.

---

## 5. NEGATIVE CONTROL, MANDATORY

Per the design's §6. Restore the stock `detect_staves`, show the photograph still
failing at `reader.py:376`. Restore the injected one, show it passing. **A pass
with no demonstrated failure mode is not evidence.**

---

## 6. Where improvement is likely, and its limits

You may improve on this. Four conditions, which are the project's existing rules:

1. **Say what you substituted and why, in the same message as the result.** A
   silent deviation is the defect, not the deviation.
2. **Cite the authority.** A stage may cite a named pre-deep-learning classical
   CV method with real provenance. Name it. "It seemed better" is not a citation.
3. **Meet Q2 and Q3 unchanged.** A better mechanism that moves the fixture corpus
   is not better.
4. **Do not re-derive what is ruled.** The design's §4.1 annihilation lemma,
   §4.2's "downstream of every decision, upstream of none", and §3's strike of
   coverage-as-classifier are measured results, not opinions.

Most likely places: deriving slice width and count from page width and from the
detected `s` rather than hardcoding 200 and 13; whether comb matching should
tolerate four-of-five on a faded staff; and whether the 6 px run cap should be
derived from measured line thickness per page.

---

## 7. What you may NOT do

- **Do not change `substrate.py`, `K_S`, or `g`.**
- **Do not put the sentinel on the candidate stream.** Downstream of every
  decision, upstream of none. Ruled.
- **Do not propose concentration as a decider.** Measured 2026-07-28: the
  separation interval is empty.
- **Do not report anything about Pyodide.** Every number will be desktop. The
  browser is cv2 4.9.0, numpy 1.26.4, 32-bit, `np.intp` = int32. Whether any of
  this survives there is NOT ESTABLISHED, no gate reaches it, and a clean desktop
  run must not be allowed to imply a clean browser run.
- **Do not trust a number your own script printed** without a control that would
  have caught it being wrong.
- **Do not build the dewarp.** If Q1 fails on grouping, that is the trigger for a
  design, not for code.

---

## 8. Definition of done

The memo answers Q1 through Q5 or says which one it stopped at and why, the
negative control is reported, the repository is unmodified, and no dewarp has
been built.

---

## 9. RETURN MEMO FORMAT

```
N.59 SLICE PROBE — MEMO
tree:        <sha>, clean and unmodified | MODIFIED, and here is what

Q1 END TO END:   YES, <n> staves, s = <n> | NO, stopped at <stage>, <how>
Q2 GATE 1:       23/23 byte-identical | <n>/23, and here are the diffs
Q3 GATE 2:       1.000 / 1.000 / 1.000 | <values>
Q4 THE SINGLE s: <value>, derived <how>. On staff 1 (s=17) and staff 12 (s=21)
                 the read is <what>
Q5 COST:         <n>x current, photograph. <n>x, control. Phone impact: <what>

NEGATIVE CONTROL: stock fails at :376 <yes/no>. Injected passes <yes/no>
SENTINEL:         bypassed for the probe. Concentrations: <range>

SUBSTITUTIONS:    <each, and why>
COULD NOT ESTABLISH: <every one. Never empty without a reason>
```
