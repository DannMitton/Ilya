# Brief: N.155, a word broken across a system takes a hyphen at the line end

Revision 1, 2026-09-20. Written at the desk. Build in Claude Code.

**Item:** N.155. Spec: `docs/memory/OPEN.md`, the section headed "N.155. A WORD BROKEN
ACROSS A SYSTEM TAKES A HYPHEN AT THE LINE END". **Read it in full.** It records which
parts are Dann's ruling, which are the desk's proposal, and which are NOT ESTABLISHED.

---

## The ruling and its source

**Dann's ruling of 2026-09-14, which this finishes:** *"I don't want Ilya dropping
hyphens. Instead, I want the note spacing to shift to permit the appearance of hyphens
properly."*

N.129 step 2 closed every case inside a system, shipped `7bd3d04` and walked the same
day. **A word broken across a system break is the last place Ilya still drops one.**

**The design is the desk's proposal and Dann ruled it in on 2026-09-20 at 14:07**,
choosing it over leaving the behaviour as it is. Those are two separate facts; do not
write it up as his invention.

---

## The goal, in the singer's words

You sing to the end of the line. The last syllable under the last note is `неп`, and
nothing on the page tells you the word continues. Your eye moves to the next line and
you have to work out whether you just sang a word or a fragment.

---

## What the desk read in the tree, 2026-09-20, at HEAD `7bd3d04`

- `staff-renderer.ts:506-508`: *"`paginateScore` renders every system through its own
  `renderAnalyzedStaff` call on a rebased slice"*. **This is why the hyphen loop at
  `:3434` never sees a pair that straddles a break**, and why removing the omission in
  step 2 drew no stray hyphen across the page.
- `staff-renderer.ts:2404` declares the underlay entry, which carries
  `sylType?: 'whole' | 'start' | 'middle' | 'end'`.
- `staff-renderer.ts:3396` is the hyphen loop's own join predicate, which treats
  `start` and `middle` as "a syllable follows".
- `HYPHEN_HALF` (`:1106`) and `HYPHEN_PAD` (`:1108`) are the in-system hyphen's geometry,
  both added or confirmed by N.129 step 2.

---

## Build in this order

### STEP 1. CONFIRM THE CHEAP READING BEFORE BUILDING ON IT

**DESK READING, not a run, and it is the whole shape of this build:** `start` or `middle`
on a slice's LAST underlay entry already means a further syllable exists, and it can only
be on the next system. If that holds, this item is local to `renderAnalyzedStaff` and the
paginator is not touched at all.

**Confirm or refute it against the tree and say which.** If it is refuted, fall back to
the `incomingAccidentals` precedent at `staff-renderer.ts:506-510`, where the paginator
computes what a slice cannot know and hands it in, and say in the memo that you did.

### STEP 2. DRAW THE HYPHEN

1. When the slice's last underlay entry has `sylType` of `start` or `middle`, draw one
   hyphen after it, using `HYPHEN_HALF` and `HYPHEN_PAD` so it is the same mark as every
   other hyphen, on the same `hyphenY`.
2. **DESK DEFAULT on the horizontal position, and Dann rules on it at the walk:** place
   it immediately after the last syllable, at the same offset an in-system hyphen would
   take. **Do not push it to the right margin.** The reasoning is that it is the same
   mark and should read as one; the alternative is a real practice and Dann may prefer
   it, so make the position one value that is easy to change, not arithmetic spread
   through the function.
3. Give it the same `data-hyphen` attribute shape as the others, so a count or a
   selector cannot tell the two apart.
4. **Do not touch melisma extenders crossing a break.** Out of scope, named in the spec
   as unresolved.
5. Say what happens when the continuation never arrives, for instance on malformed
   underlay where a `start` is the last syllable in the score. A spurious hyphen there is
   acceptable; a crash is not.

### STEP 3. GATES

Run the five gates. **Report every test whose expected number moved and why.** Read the
baselines from `docs/memory/ENVIRONMENT.md`, section `Gate baselines`. **As of
2026-09-20 they are phonology 216, dictionary 235, web-check 0 errors and 12 warnings in
5 files, web-test 1263, score-parser 572 passed and 5 skipped.** Do not edit an expected
value without saying why the new one is right, and do not edit `~/Downloads/ilya-ship.sh`.

---

## State your expectation before you measure

Per the control rule, write down what you expect before each measurement and report
against it. **The desk's expectation, and it is falsifiable:** seven new hyphens appear
on the engraved Without Sun no. 1, no existing hyphen moves, and no column moves,
because this draws a mark and reserves no space. **The desk's likeliest failure mode:** a
snapshot or golden-SVG test counts hyphens or `data-hyphen` nodes and fails for a reason
that is not a defect.

---

## What NOT to do

- **Do not reserve horizontal space for this hyphen.** It sits in the margin after the
  last syllable, where there is already room. If it turns out there is not, stop and say
  so rather than widening the system.
- Do not change `VocalLineEvent`.
- Do not touch the in-system hyphen logic that shipped in `7bd3d04`.
- Do not cite Gould. Rules 26 to 40 are unread and the book is not on this machine.
- **No git command that writes:** no `add`, `commit`, `push`, `checkout`, `reset`,
  `restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`.

---

## Definition of done

1. A word broken across a system draws a hyphen at the end of that system.
2. The mark is identical to an in-system hyphen in geometry and in its attributes.
3. Nothing else on the page moves. Show this, do not assert it.
4. All five gates green, with any baseline movement named.
5. Walked in a browser by Dann, and in print. **WRITTEN is not DONE.**

---

## What to return

A memo at `docs/sessions/memo-n155-line-end-hyphen_r1_<date>.md`:

1. Whether the cheap reading in step 1 held, and what you read to decide.
2. What you changed, by file and line.
3. Your expectation before each measurement, and the measurement.
4. The gate results, with any baseline movement named.
5. **A section listing what you could not establish. NOT ESTABLISHED beats a complete
   invented answer.**
6. Any decision this brief did not settle, marked as yours and reversible.

If you create a new file, name it in the memo so Dann can `git add` it before he ships.
