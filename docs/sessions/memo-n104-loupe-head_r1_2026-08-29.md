# Memo: the loupe's head carries the whole clef and key

Written 2026-08-29 against
[brief-n104-loupe-head_r1_2026-08-29.md](brief-n104-loupe-head_r1_2026-08-29.md),
including its §8 amendment. Floor: `e347311`, "N.104: the page shows every bar
the singer counts".

**This memo replaces the one I wrote before the amendment.** The first pass
bounded the head at the leftmost of the hit rectangles and the tacet marks,
which fixed the rest Dann saw and left the key signature cut on six of the seven
systems. §8 waived §4.3, ruled the one-rule fix in, and this is that build.

The head now ends at the leftmost ink the music draws. On all seven systems of
the engraved Without Sun song 1 it paints the clef and **both** sharps and
nothing else. **Gate 4 moves from `900 passed (900)` to `908 passed (908)`**,
from eight tests I added; §7 has the line for the desk to change.

The build is WRITTEN. The walk is yours.

---

## 1. The discriminator, named

The amendment asked for this in as many words: how the rule tells the music's
ink from the head's, and where that decision lives.

**It lives in one exported constant, `loupe.ts:283-324`.**

```ts
export const MUSIC_MARK = '[data-event-id] > :not([data-hit]), [data-of-event], [data-tacet]';
```

**It is paint order, gated by a handle.** The renderer emits a system in one
fixed order: the staff lines, the clef (`staff-renderer.ts:1034`), the octave
`8` (`:1058`), the key signature (`:1077`), and only then the tacet pass
(`:1214`), the note loop (`:1360`) and the underlay (`:1778`). Everything before
the first element carrying a music handle is the head's furniture. Everything
from that element onward is not.

`MUSIC_MARK` is the gate, and the three handles are the renderer's own:

| handle | what it marks | why it is in the gate |
|---|---|---|
| `[data-event-id] > :not([data-hit])` | a notehead with its stem, flag and ledger lines (`:1467`) | the group itself is deliberately unmatched: its own box contains the hit rectangle |
| `[data-of-event]` | an accidental (`:1383`) or an augmentation dot (`:1444`), drawn outside the group because it precedes it in paint order | an accidental sits LEFT of its notehead, and MEASURED it is the leftmost music ink on one of the seven systems, 66.38 against a notehead at 72.5 |
| `[data-tacet]` | N.104's consolidated multibar rest (`:1214-1340`) | it carries no hit rectangle at all, which is the fault Dann walked |

**Why a gate and not a list, which is the part I got wrong first.** The underlay
carries no handle (`:1778`, `:1783`) and it is drawn wider than the note it sits
under: MEASURED, the first syllable begins left of the first notehead on six of
the seven systems. A head bounded on the marked music alone painted «тень» in
the head, which is a word where a clef and key belong. I saw it on the first
reading after the change and rebuilt the rule around paint order, which catches
the underlay without asking the renderer for a new handle.

**What the head keeps.** Anything the renderer draws before the gate and leaves
unmarked lands inside the head. That is the right side for a clef, a key
signature and the octave `8`. §5 takes up the time signature.

---

## 2. What changed

Three files, all under `apps/web/src/lib/shane/`. **The renderer is untouched**,
`VocalLineEvent` is unchanged, and nothing under
`apps/web/src/lib/shane/reconciliation/` was read or changed.

### `loupe.ts:283-342`

`MUSIC_MARK` with the comment §1 summarizes, and `headBound`, which is now the
minimum of one list rather than of two:

```ts
export function headBound(inkXs: readonly number[]): number {
	const all = inkXs.filter((n) => Number.isFinite(n));
	if (all.length === 0) return 0;
	return Math.max(0, Math.min(...all));
}
```

### `Loupe.svelte:522-580`

The comment records both failures of the old rule, that N.104 exposed the first
rather than causing it, and that the second was there the whole time. The walk:

```ts
const nodes = [...sysEl.querySelectorAll('*')];
const gate = nodes.findIndex((el) => el.matches(MUSIC_MARK));
const inkXs: number[] = [];
for (let i = gate; i >= 0 && i < nodes.length; i++) {
	const el = nodes[i];
	if (el.hasAttribute('data-hit') || el.hasAttribute('data-event-id')) continue;
	if (el.hasAttribute('data-selection-ring')) continue;
	if (el.closest('[data-analysis]') || el.closest('[data-held-measure]')) continue;
	const tacet = el.closest('[data-tacet]');
	if (tacet && tacet !== el) continue;
	let b: DOMRect;
	try {
		b = (el as SVGGraphicsElement).getBBox();
	} catch {
		continue;
	}
	if (b && (b.width || b.height)) inkXs.push(b.x);
}
const headWidthUnits = headBound(inkXs);
```

**Four skips, and three of them are `pageMetrics`' own list at `:231-234`**, for
its own stated reason: what the loupe does not draw cannot set its frame. A hit
rectangle is a touch target and not ink. An `[data-event-id]` group's box
contains one, so the group is skipped and its children carry it. A descendant of
`[data-tacet]` is skipped because the composed H-bar's body sits inside a
`scale()` and `getBBox()` on it returns local coordinates, x = 0; the group's own
box is the drawn one. The analysis layer, the page's held rectangle and the
selection ring are stripped from the clone at `:646` and after.

**That transform detail cost me a wrong reading in the first pass**, where I
reported a rest in a head that had none because I measured a glyph instead of its
group. Every reading below is taken from painted client rects rather than from
declared coordinates.

### `loupe.test.ts:422-470`, eight tests

The leftmost ink where the music opens with a note, the tacet mark where a run
opens the system, the first syllable where the underlay reaches left of the note,
an accidental left of its own notehead, the least of several, zero where there is
no music, a non-finite candidate ignored, and no negative bound. Every number in
them is a measured one from §3.

---

## 3. The amendment's four requirements

Each states its expectation and its likeliest failure first. Desk readings at
1400 × 900 on the engraved Without Sun song 1, the loupe raised by a real click
on a note, read off the live DOM.

### 1. The key signature is whole, on all seven

**Expectation:** every head moves from 56 to the leftmost music ink, which the
survey put between 63.53 and 72.50, and the key signature ends at 61.25, so both
sharps land inside on every system.
**Likeliest failure:** on the tightest system the bound falls below 61.25 and the
new rule cuts the key signature the old one cut, by a different route.

| system | head before | head after | what set the new bound | sharps painted |
|---|---|---|---|---|
| `0-2` | 133.49 | **95.37** | the tacet mark `0-0` | **2 of 2** |
| `3-5` | 56 | **63.53** | «тень», the first syllable | **2 of 2** |
| `6-8` | 56 | **64.98** | «pʲesʲ», the first IPA gloss | **2 of 2** |
| `9-11` | 56 | **66.38** | a note's own accidental | **2 of 2** |
| `12-14` | 56 | **69.33** | «на», the first syllable | **2 of 2** |
| `15-16` | 56 | **70.77** | «jɑ», the first IPA gloss | **2 of 2** |
| `17-17` | 56 | **69.14** | «ди», the first syllable | **2 of 2** |

**The expectation holds and the failure does not occur.** The key signature's
sharps are drawn at 49.78 to 55.02 and 56.01 to 61.25, and the narrowest head is
63.53, which clears the second sharp by **2.28 units**. Every head also holds the
clef, whose ink runs 27.75 to 43.33.

**Looked at at nine times, per system, as the amendment asks.** Seven looks,
system by system: bass clef, sharp, sharp, then blank staff to the crop's edge.
No rest, no notehead, no word, no fragment of one. The heads at 9× are 858, 572,
585, 597, 624, 637 and 622 px wide.

**Four of the seven set their bound on the underlay rather than on a note**,
which is the finding that rebuilt the rule and is the reason `MUSIC_MARK` gates
on paint order.

### 2. System 1 carries no rest, and its head stays 95.37

**Expectation:** unchanged from the first pass. The tacet mark is the leftmost
music ink there, at 95.37, so the bound lands exactly where the rest begins.
**Likeliest failure:** the gate finds the tacet group's transformed child first
and returns a local coordinate, collapsing the head.

| the loupe on | head | what it paints | tacet in the head |
|---|---|---|---|
| m. 2, system 1 | **95.37** | clef, two sharps | **none** |
| m. 3, system 1 | **95.37** | clef, two sharps | **none** |

The whole rest's ink runs 95.37 to 102.37, so the crop ends exactly where the
rest begins. Looked at at 9×: clef, both sharps, blank staff. Dann's defect is
gone and the head is 34.12 units wider than the key signature needs.

### 3. The held measure's window does not move, on any of the seven

**Expectation:** nothing in the window's arithmetic reads the head, so every
window is identical to what it was before either pass.
**Likeliest failure:** the head feeds `totalSpan`, which feeds `scale`, so a
changed head could move the window's drawn width even with its viewBox fixed.

| the loupe on | window before | window after |
|---|---|---|
| m. 2 | 138.24, width 236.35 | **identical** |
| m. 3 | 378.04, width 245.96 | **identical** |
| m. 5 | 247.42, width 191.23 | **identical** |
| m. 8 | 248.38, width 186.98 | **identical** |
| m. 11 | 245.30, width 193.82 | **identical** |
| m. 14 | 248.70, width 180.53 | **identical** |
| m. 17 | 328.55, width 295.45 | **identical** |
| m. 18 | 56, width 189.03 | **identical** |

All eight unchanged. The head does share the fit, so the drawn scale moves with
it; the window's own crop does not.

### 4. §4's other cases

**A run that is not at the system head.** The same file with the vocal notes
stripped from source measures 5 to 9 and 14, which puts a five-bar run at
measures 4 to 8 inside system `3-9`, drawn at x 309.44 to 373.20.

**Expectation:** the head is now the leftmost music ink rather than 56, so it
moves to 63.53 like every other system, and the run is far right of it.
**Likeliest failure:** the gate lands on the run rather than on the first note,
because a tacet group is a music mark, and the head swallows the first measure.

| the loupe on | head | what it paints | tacet in the head | tacet in the window |
|---|---|---|---|---|
| m. 4, the measure before the run | **63.53** | clef, two sharps | none | **`4-8`** |
| m. 10, the measure after it | **63.53** | clef, two sharps | none | none |

The gate is the first mark in paint order, which on that system is the first
note's accidental and not the run. The run still shows in the WINDOW for m. 4,
which memo §7 of `memo-n104-tacet_r1_2026-08-27.md` measured on 2026-08-27; that
is `measureWindow`'s business and neither brief reaches it.

**A system that is entirely tacet.** The same file with source measures 16 to 18
stripped, leaving system `17-17` at 120 units with no notes: `hitCount` 0, one
tacet mark drawn at 87.63 to 94.63.

**Expectation:** the gate finds the tacet group, the walk yields 87.63, and the
value is never used because the loupe cannot rise there.
**Likeliest failure:** it can rise there after all, and a head of 87.63 shows a
stretch of empty staff for a measure with nothing in it.

The gate lands at node index 10, the `<g data-tacet="17-17">`; the walk yields
87.63, 114.51 and 118.63, so the head would be **87.63**. A click at the centre
of that system **raises no loupe**, as `Loupe.svelte:359` returns before the
frame is built when the held measure carries no event ids. Unchanged from the
first pass, still unreachable, and **I built nothing for it**.

**Phone and desk**, one measurement at 430 × 932, on m. 5, system 2, which is the
tightest head on the page:

| | 1400 × 900 | 430 × 932 portrait |
|---|---|---|
| head, in units | 63.53 | **63.53** |
| what it paints | clef, both sharps | **identical** |
| window | 247.42, width 191.23 | 247.42, width 191.23 |
| head, drawn | 138.61 px | 83.35 px |

Looked at on the portrait sheet with the drawer collapsed: clef, two sharps, the
separator, then the held measure.

---

## 4. Siblings of the assumption

Two remain, both reported in the first pass, both still unchanged, and the third
is now fixed by this build.

**`Loupe.svelte:275-276`, the same walk inside `pageMetrics`.** It bounds a
`head` on hit rectangles to open the measure walk that produces `minTotalSpan`,
which sizes the loupe's window through `windowScale` (`loupe.ts:411`). **Not
changed.** It is a different question from the head's crop: `minTotalSpan` asks
how wide the widest drawing on the page can be, and the module documents its
estimate as deliberately understated. Bringing it onto `MUSIC_MARK` would make
system 1's tacet measure a candidate measure and resize the loupe's window on
every system of the page. Worth its own number.

**`Loupe.svelte:217`, a system with no notes contributes no ink.** `const hit =
sys.querySelector('[data-hit]'); if (!hit) continue;` skips a whole system from
the page's ink survey, so a system of nothing but a tacet run draws a numeral
above the staff that the survey never sees. **Not changed, and it cannot bite on
this document**, where every system carrying a run also carries notes.

---

## 5. The printed time signature

**The case does not exist, and that is a fact about the renderer rather than
about my rule.** Ilya draws no time signature anywhere on the page.
`staff-renderer.ts:964` reads `parsed.measures[...].timeSignature` to space the
measure rhythmically, and nothing emits it as a glyph: the only use of the SMuFL
time-signature digits in the file is `DIGIT_SMUFL` at `:356-359`, which N.104
uses for the tacet count. Grepped across `packages/score-parser/src` and
`apps/web/src/lib/shane`: `timeSignature` reaches the parsers, the spacing, and
`notation-overlay.ts:74`, which composes a readout string. No drawing path.

**Where it would land if it were ever drawn.** It would be emitted with the clef
and the key signature, before the first music mark, and it carries no handle, so
the gate would put it **inside the head**, which is where it musically belongs.
That falls out for free and I built nothing for it. **If it is ever drawn AFTER
the first music mark**, which a metre change mid-system would require, the gate
would put it on the wrong side. Left for you to number.

---

## 6. One thing I found and did not build

**The loupe renders the singer's words in a different typeface than the page
does.** MEASURED on the same `<text>` element, «тень» on system 2:

| | computed font | `getBBox()` x | width |
|---|---|---|---|
| on the page | `"Source Sans 3", system-ui, …` | 63.531 | 24.938 |
| in the loupe's clone | `"Source Serif 4", Georgia, serif` | 61.541 | 28.919 |

`Loupe.svelte:905` and `:918` declare `'Source Serif 4', Georgia, serif` on the
loupe's two viewports, which is what the renderer writes on the page's own root
svg at `staff-renderer.ts:1908`. On the page that attribute loses to an inherited
`Source Sans 3` from the score container. So the loupe shows the renderer's
intent and the page shows something else, and the two have disagreed since before
this change.

**It bears on this fix, which is why it is here rather than in a note.** The head
bound is measured on the page and applied to the clone, so where text sets the
bound the clone lays that text out **1.99 units further left** than the bound
allows. Four systems are in that position: 2, 5, 6 and 7. **Looked at at nine
times on all four: no ink enters the head.** The overlap falls inside the first
letter's left side bearing. That is a measured near-miss and not a guarantee: a
syllable beginning with a letter of smaller bearing would put ink in the head.

**I did not fix it**, because the fix is either to change what typeface the loupe
draws words in, which is your eye and not mine, or to measure the bound on the
clone, which needs the frame computed in two passes. Both are bigger than this
brief and neither is needed for the amendment's four requirements, which are met.

---

## 7. Gates

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | `found 0 errors and 7 warnings in 4 files` |
| 4 web-test | `900 passed (900)` | **`908 passed (908)`** |
| 5 score-parser | `481 passed \| 5 skipped (486)` | `481 passed \| 5 skipped (486)` |

**Gate 4 moved, and it is disclosed rather than slipped.** Eight tests, all added
by me, all in `apps/web/src/lib/shane/loupe.test.ts` under `describe('the head’s
bound')`. No existing test changed and none was deleted: the package went from
900 to 908.

**`~/Downloads/ilya-ship.sh` needs one line changed, by the desk.** Line 79:

```
gate 4 web-test     "900 passed (900)"                          pnpm -C "$REPO" --filter @ilya/web test
```

becomes

```
gate 4 web-test     "908 passed (908)"                          pnpm -C "$REPO" --filter @ilya/web test
```

Line 80 stays at `481 passed | 5 skipped (486)`. **I read the file and did not
edit it**; its md5 is `f90fae3ebe70e5db6b95eacac1b7d58b`, which is the md5 the
brief records.

The commit message is `N.104: the loupe's head carries the whole clef and key`.

---

## 8. Housekeeping

- Nothing was committed and nothing was shipped.
- Untracked files needing `git add` before the ship:
  `docs/sessions/drawing-bar-numbers_r1_2026-08-29.html`,
  `docs/sessions/brief-n104-loupe-head_r1_2026-08-29.md`, and this memo.
  **`docs/sessions/memo-n104-ship_r1_2026-08-29.md` is modified and uncommitted
  and rides along**: its §7, the bar-numbers drawing's report, was written after
  `e347311` had already shipped.
- The engraved MusicXML and the two hand-built copies I staged under
  `apps/web/static/reader/` are deleted. That directory is gitignored, and
  `pnpm --filter @ilya/web dev` empties and regenerates it through
  `copy-reader.mjs`, so anything staged there must be staged after the server
  starts.
- No new user-facing string and **no French coined**. `MUSIC_MARK` and
  `headBound` are code identifiers.

---

## 9. NOT ESTABLISHED

- **That the head bound is exact wherever text sets it.** §6 measures a 1.99-unit
  disagreement between the page's layout and the clone's, and four looks at nine
  times that find no ink in the head. That is a measured near-miss, not a proof.
- **What the loupe should draw the underlay in.** §6 measures that the page and
  the loupe disagree. Neither is ruled.
- **That `MUSIC_MARK` names every handle the renderer will ever put on the
  music.** It names the three that exist today, read out of `staff-renderer.ts`.
  A fourth kind of mark drawn before the first of these, and left unmarked, would
  land in the head.
- **The selector itself is not pinned by a test.** `headBound`'s arithmetic is,
  eight ways. `apps/web`'s vitest has no DOM environment configured, so
  `querySelectorAll(MUSIC_MARK)` cannot be exercised in a unit test without
  adding one, which is more than this brief asks for.
- **Whether paint order holds for a renderer change.** The gate assumes the head
  furniture is emitted before the first music mark, which `staff-renderer.ts`
  does today at `:1034`, `:1058` and `:1077` against `:1214` and `:1360`. Nothing
  pins that order.
- **What the loupe should show over a tacet run in the WINDOW.** §3.4 measures
  that the window for the measure before a run reaches into it. Memo §7 of
  `memo-n104-tacet_r1_2026-08-27.md` proposed three answers on 2026-08-27. Still
  yours.
- **Whether a tacet-only system should ever hold the loupe.** Unreachable by tap
  and by stepper, measured twice. Nothing built for it.
- **`pageMetrics`' two siblings**, §4. Both read from the code and left alone.
- **The time signature after a mid-system metre change**, §5. No document in this
  project draws a time signature at all, so there is nothing to measure.
