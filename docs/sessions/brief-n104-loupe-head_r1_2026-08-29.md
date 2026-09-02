# Brief: N.104 reopens. The loupe's head swallows the tacet rest

**For the Claude Code session already holding N.104, or a fresh one pointed at
`~/Desktop/ilya-rewrite`, branch `Shane`.** Written by the desk 2026-08-29,
after Dann's walk of `e347311` on the branch alias.

**N.104 IS REOPENED, ruled by Dann 2026-08-29.** It stays open until the loupe
is right and he has walked it. The page verification it passed still stands:
the paper is correct and nothing shipped draws a wrong bar.

---

## 1. What Dann saw

On the engraved Without Sun song 1, system 1, he raised the loupe on the
second drawn bar and then the third. **Both loupes showed a clef, a key
signature, a whole rest, and then the held measure's notes.** The rest is not
in either measure. Screenshots are in the 2026-08-29 thread.

**His second observation is the one that names the mechanism: measures in
later systems do not carry the unwanted rest.**

## 2. The cause, established by the desk this session

`Loupe.svelte:528`:

```
const headWidthUnits = allHits.length > 0 ? Math.max(0, Math.min(...allHits)) : 0;
```

`allHits` is the `x` of every `[data-hit]` in the system. The comment above it
(`:521-524`) states the reasoning: the renderer tiles the system with hit
rectangles from the midpoint before each note, so the smallest of them bounds
everything drawn before the music starts, which the head assumes is clef and
key.

**A tacet mark carries no hit rectangle.** The tacet pass emits
`<g data-tacet="..." data-tacet-count="...">` and zero `data-hit`
(`staff-renderer.ts:1238`, and no `data-hit` anywhere in the pass at
`:1214-1340`). So on a system that OPENS with a tacet run, the smallest hit x
belongs to the first note after the run, and the head crop runs past the rest
and picks it up.

Only system 1 of this document opens with a run, which is exactly why later
systems are clean.

**N.104 exposed this rather than caused it.** Slice 4 built the head. Before
N.104 the first measure drew nothing, so the head crop caught empty space and
the assumption held silently. This is the same shape as the augmentation dot:
ink appeared where the page had none, and an existing rule that assumed
nothing was there became visible.

## 3. The fix, DESK INFERENCE. Measure it, do not take my word

Bound the head at the leftmost of the first `data-hit` and the first
`data-tacet` mark's own left edge, using the handle N.104 already puts on the
page. **Measure the tacet group's actual left edge off the DOM rather than
computing it from `TACET_REST`**, in the same register as the boundary-barline
search directly above it, which the file's own comment insists is found as
drawn rather than computed.

If a better bound presents itself while you are in the file, take it and say
why. What must be true is in §4.

**Look for siblings of the same assumption while you are there.** Anything
else in `Loupe.svelte` or `loupe.ts` that treats "before the first
`data-hit`" as "clef and key", or that walks hit rectangles to find the
system's ink, has the same hole. Report what you find even if you do not
change it.

## 4. What must be true afterwards

State your expectation and your likeliest failure mode before each
measurement, then report against both.

1. **The observed case.** Engraved Without Sun song 1, system 1, loupe on the
   second drawn bar and on the third. The head shows clef and key and **no
   rest**, and the held measure is unchanged.
2. **The head still exists.** It must not collapse to zero on that system. A
   musician cannot read the stave without the clef and key, which is Dann's
   ruling of 2026-08-27 and the reason the head was built.
3. **Later systems do not move.** Systems 2 to 7 of the same document render
   the same loupe they render today, head width included. Measure one and say
   which.
4. **A run that is not at the system head.** Build a document whose tacet run
   sits mid-system, raise the loupe on a measure before it and one after, and
   report the head in both.
5. **A system that is entirely tacet.** `allHits.length === 0` today gives a
   head of 0. Say what it gives after the change. Do not build a behaviour
   for it unless the change breaks it.
6. **Phone and desk.** The head is shared, so check one measurement at
   430 x 932 as well as 1400 x 900.

## 5. Gates and the ship

Five gates at baseline. `loupe.test.ts` is in `apps/web`, so any test you add
moves **gate 4**, currently `900 passed (900)`.

**Do not edit `~/Downloads/ilya-ship.sh`.** Report the new gate 4 count in
your memo and stop; the desk edits line 79 over the bridge before the ship,
and its md5 is `f90fae3ebe70e5db6b95eacac1b7d58b` as it stands now.

Untracked files still needing `git add` before any ship, plus whatever you
add:

- `docs/sessions/drawing-bar-numbers_r1_2026-08-29.html`
- `docs/sessions/brief-n104-loupe-head_r1_2026-08-29.md`
- your return memo

The commit message is `N.104: the loupe's head carries clef and key only`.

## 6. The return memo

`docs/sessions/memo-n104-loupe-head_r1_2026-08-29.md`: what changed with its
`path:line`, §4's six measurements each with the expectation you stated first,
any sibling of the assumption you found, gates expected against got, and
**NOT ESTABLISHED** as its own section.

## 7. Constraints

- **NOT ESTABLISHED beats a complete invented answer.**
- Every claim carries a `path:line`, a run, or "not established". No fourth
  form.
- **Verify the rendered result, not the source.**
- Do not change `VocalLineEvent` and do not touch
  `apps/web/src/lib/shane/reconciliation/`.
- Do not change the renderer. The page is correct; this is the loupe's fault.
- Coin no French and add no user-facing string.
- House style: Google's developer documentation style guide, Canadian
  spelling, no em dashes.
- **The walk is Dann's.** Report the build as WRITTEN.

---

## 8. AMENDMENT, ruled by Dann 2026-08-29 after the first pass

**§4.3 IS WAIVED.** It said later systems must keep today's head width. It was
written by the desk before anyone knew that today's head width is wrong on six
of the seven systems, and it turned into a rule protecting a defect. Later
systems SHOULD move.

**Dann rules the one-rule fix in.** Bound the head at the leftmost drawn ink of
the music rather than at a hit rectangle. Your own measurement: 95.37 on system
1, which is what `headBound` already returns, and 72.50 on the other six,
clearing the key signature by 11.25 units.

### What must be true, replacing §4.3

1. **The key signature is whole.** On all seven systems of the engraved
   Without Sun song 1, the loupe's head paints the clef and **both** sharps.
   Look at it at nine times and say so, per system.
2. **System 1 still carries no rest in its head**, and its head stays 95.37.
3. **The held measure's window does not move** on any of the seven.
4. §4's other cases stand as you measured them: the mid-system run, the
   entirely tacet system (still unreachable, build nothing for it), and one
   phone measurement at 430 x 932.

### Two things to name rather than build

- **Name the discriminator.** Say in the memo exactly how the rule tells the
  music's ink from the head's ink, and where that decision lives. "Leftmost
  drawn ink of the music" is a sentence, not an implementation, and the next
  session will need the implementation.
- **The printed time signature.** A system that prints a time signature at its
  head, which the corpus does have on metre changes, is the case this rule was
  not derived from. Musically it belongs with the clef and key. **Report what
  your rule does with it. Do not build for it** unless it falls out for free,
  and if it lands on the wrong side, say so and leave it for Dann to number.

### Ship

Commit message becomes:

```
N.104: the loupe's head carries the whole clef and key
```

**Report gate 4's final count and do not edit `ilya-ship.sh`.** The desk edits
line 79 over the bridge once the count is final. `memo-n104-ship_r1_2026-08-29.md`
is modified and uncommitted and rides along.
