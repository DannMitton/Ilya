# N.59 tier 2 — the decider moves from coverage to the substrate (r1, 2026-08-17)

**Authority.** Fable's tier 2, *"model-based staff-line localization"*
(`claude/e16-layered-synthesis-architecture_2026-07-24.md` §4), whose trigger
was *"the photo probe."* The probe fired 2026-08-17. Tier 2 was unauthorized
until Dann ratified Fable's T3 fence and the T4 third precedent class; **he
ratified both on 2026-08-17.**

**Written by:** the coordinating desk, from measurements taken this session and
from four documents read in full. **Code may improve on this; see §8.**

**THIS DOCUMENT PROPOSES NO FIX BEFORE §5.** §§1 to 4 are findings and prior
art. §5 is a measurement. §6 is the change that measurement gates.

---

## 1. What broke, measured 2026-08-17

`~/Downloads/score-page32-deskewed.png`, a photograph of Kabalevsky p. 32 from
a third-generation photocopy, bound book, already deskewed.

**It fails at `reader.py:376`, `RuntimeError("no staff lines")`, from the
empty-`checked` guard** added at E.58. Not from the top-of-function raise, not
from the `_plausible_s` raise, and not from the contaminated-group raise.

The path: gate 0.919965 → **one row passes**, y = 3735 → one grouped line →
`diffs` empty → `med` NaN → `intra` empty → `s` NaN → `_plausible_s` fails →
`staff_space_from_runs` returns **19.0**, which *is* plausible, so the second
raise does not fire → the single group has size 1 → discarded by the
`len(st) <= 2` spurious branch → `checked == []` → raise.

**y = 3735 is the bottom scan border, not music.**

**The staff lines are present and perfectly regular.** Rows 2044-47, 2063-66,
2082-85, 2101-04, 2120-23. **Spacing exactly 19 px**, confirmed independently
by `staff_space_from_runs` returning 19.0 from a different method entirely.

**The page is straight.** Skew swept −3.0° to +3.0° at 0.1°; frame excluded,
both `max(rowfrac)` and `var(rowfrac)` peak at **+0.1°**. `detect_staves` was
called at all 61 angles and **succeeds at none**. Rotation is not the cause and
an angle search alone does not rescue it.

**There is no facing page.** Column ink profile is continuous music from
x ≈ 20 to x ≈ 2570, no interior spine, no second block. A 16 px dark strip at
x = 0 to 15 and a blank right margin from x ≥ 2580 are the only frame
artifacts. Whether the left strip is a book edge, a gutter, or a scanner
border is **NOT ESTABLISHED**.

**The threshold is roughly right.** Otsu picks 118 against the hardcoded 128;
ink fraction moves 0.1216 to 0.1111.

---

## 2. The actual mechanism, and it is not the border

Cropping the frame does **not** fix it. Measured: on the interior box
(rows 100-3690, cols 20-2580) the gate lands at **0.897266** and **one row
still passes**.

The reason is in the segment structure. `_derive_rowfrac_gate` splits the
page's sorted per-row coverage wherever consecutive values differ by more than
`floor = 0.015`, accepts the highest segment unconditionally, then walks down
accepting further segments only if **tight** (span < 0.0137) **and populous**
(≥ 5 members).

| page | top-segment behaviour |
|---|---|
| `ilya-voice-page.png` (Verovio render) | 13 rows spanning **0.941 to 0.961**, span **0.019**. One tight population |
| `score-page32-deskewed.png` (photograph) | the rows of **one physical staff line** spread **0.71 to 0.91**, shattered into four singleton segments |

On the photograph the walk accepts one singleton (row 2046, 0.9102), then
stops at the next singleton (row 2065, 0.8844) for having fewer than five
members. It never reaches the five-member segment at 0.7355 to 0.7617, which
**is** staff-line rows, and which would have failed anyway: its span is
0.026172 against the 0.0137 bound, nearly twice over.

**The interior segment structure in full, measured:**

| seg | min | max | span | members | tight | ≥5 |
|---|---|---|---|---|---|---|
| 5 | 0.910156 | 0.910156 | 0.000000 | **1** | yes | no | ← top, accepted unconditionally |
| 4 | 0.884375 | 0.884375 | 0.000000 | **1** | yes | **no** | ← walk stops here |
| 3 | 0.840625 | 0.840625 | 0.000000 | 1 | yes | no |
| 2 | 0.817578 | 0.817578 | 0.000000 | 1 | yes | no |
| 1 | 0.735547 | 0.761719 | 0.026172 | 5 | **no** | yes |
| 0 | 0.005078 | 0.711719 | 0.706641 | 966 | no | yes |

**39 interior rows exceed 0.6 and they carry 36 distinct coverage values.**
The same physical line reads a different coverage on every row it occupies.

| threshold | rows above |
|---|---|
| gate (0.897266) | 1 |
| 0.90 · gate | 4 |
| 0.75 · gate | 20 |
| 0.60 · gate | 65 |

Against the control, whose top segment holds **13 members spanning 0.9057 to
0.9242** — forty staff lines' worth of rows agreeing on their coverage to
within two percent, above a gulf of 0.50 in the distribution.

**A's staff lines vote as a population. B's vote individually and are
outvoted by the derivation's own quorum rule.**

**The premise that fails is not "nothing else on a page is that dark." It is
"a real staff line's rows form a tight population."**

**Replicated across two environments.** Measured independently on the desktop
(python 3.14.3, numpy 2.4.3, cv2 4.11.0) and on the Linux bridge VM (3.10.12,
2.2.6, cv2 5.0.0). The gate agrees to six decimal places and the segment
structure is identical. The finding is not an artifact of one toolchain.

---

## 3. This was already struck once, in July, on a different axis

`claude/sonnet-brief-e16-uniformity-exemplar-procurement_2026-07-27.md`:

> **That form has been struck as a sufficient classifier.** SOURCED: on legacy
> sunless-05 p5 a genuine staff-line population has span **0.0177**, which is
> *wider* than a ratified must-reject contamination segment at **0.0145161**,
> and a 2,664-point parameter sweep confirmed no triple separates them.
>
> **The diagnosis, ratified:** coverage conflates *"is this row a staff line"*
> with *"how wide is this system"*.

**The photograph is the same defect reached from a second direction.** There
coverage conflated line-ness with system width; here it conflates line-ness
with print quality. Both are the same error: coverage is not a measurement of
what a staff line *is*.

**The ratified replacement was run structure**, and it was built.

---

## 4. `substrate.py` exists, is ratified, and is wired in as a sentinel only

Ratified by Fable 2026-07-28, *"the bridged-run substrate, and call site 1's
extent conjunct"*, R-1, as amended by R-1' and the annihilation-lemma ruling.

It defines, per row: raw runs; **bridged runs** (raw runs whose every internal
gap is ≤ `g`); **extent** (last x − first x + 1, bridged gaps included);
**mass** (dark pixels, gaps excluded); **principal** (greatest mass, ties by
extent then leftmost); **concentration** (principal mass / row total dark).

**Three things about it are load-bearing here.**

**4.1 Concentration alone cannot decide, and Fable proved it.** From the
module's own ruling comment:

> Bridged concentration is principal mass over total mass, so ANY row whose ink
> is a single run sits at exactly 1.0000 regardless of mass: one stem crossing,
> one barline, one speck. Measured 2026-07-28: 5,584 non-band rows at exactly
> 1.0000 against a keep minimum of 0.9737. The two extremes COINCIDE, the
> separation interval is empty, and no threshold exists.

**Do not propose concentration as the decider. It has been measured and it is
not one.** The discriminator named in the ruling's own title is **the extent
conjunct**: a speck is concentrated and *short*; a rule is concentrated and
*long*.

**4.2 `K_S = 0.9737` is a tripwire, not a classifier.** Raise semantics only,
bound to **ruled acceptances only**, never to candidate generation. Its own
binding rule: *"Downstream of every decision, upstream of none."* Any design
that puts the sentinel on the candidate stream breaks a ratified rule.

**4.3 `g = 1 px` is a corpus measurement and the corpus has changed.** From the
module docstring:

> THE DERIVATION IS RATIFIED; THE NUMBER IS NOT. Anything downstream that
> quotes 1 px rather than the derivation is a defect, and **g is to be
> re-derived whenever the corpus changes.**

`g = 1` was derived from **this renderer's measure-join widths** across 47
Verovio pages. A photocopied, photographed staff line breaks for reasons that
have nothing to do with measure joins. **Re-deriving `g` for the photograph
class is not a workaround; it is what the module's own ruling requires.**

**Current wiring:** `reader.py:377-379` calls `page_substrate` and `sentinel`
**after** the five-line validation. The decider is still coverage. **The
substrate checks the answer; it does not produce it.**

---

## 5. PHASE 0 — the measurement that gates everything

**Nothing in §6 may be built before this is reported.** It is cheap and it can
kill the whole design.

On `~/Downloads/score-page32-deskewed.png`, for **g in {0, 1, 2, 3, 5, 8, 13,
21}**, compute `page_substrate` and report, for each g:

**5.1 The true staff rows.** For every row in 2044-2123 already known to carry
staff-line ink: `conc`, `extent`, `mass`, `total_dark`. Report the min, median,
and max of `conc` and of `extent` across that set.

**5.2 The border row.** Row 3735: the same four quantities.

**5.3 A contamination sample.** Fifty rows drawn from the interior that are
**not** in any known staff band, reported as a distribution, not a list.

**5.4 The separation question, stated as a yes or no.** *At any g, is there an
extent value that admits the true staff rows and excludes the contamination
sample?* Give the value and the margin, or say there is none.

**5.5 The system width.** The measured x-extent of the music on this page, so
`extent` can be read as a fraction of a system rather than as a bare pixel
count. Extent must be reported in **stave-spaces** (`extent / s`, s = 19) as
well as in pixels, per Fable's unit-bearing condition.

**5.6 K_S against the truth.** How many of the true staff rows fall below
`K_S = 0.9737` at each g. **If most true rows fall below K_S at every g, the
existing sentinel would raise on a correct answer**, and that is a finding
about the sentinel that must be reported before anything is built.

**Positive control, mandatory.** Run all of 5.1 to 5.6 on
`~/Downloads/ilya-voice-page.png` using its own known staff rows. Its numbers
must sit comfortably inside the corpus envelope. If they do not, the
instrument is wrong and nothing measured on the photograph means anything.

---

## 6. PHASE 1 — the change, if and only if §5.4 answers yes

**Replace the decider, keep the architecture.**

`detect_staves` keeps its shape: candidate rows → lines → staves → five-line
validation → sentinel. **Only the candidate test changes**, from

    rowfrac > _derive_rowfrac_gate(rowfrac)

to the substrate's conjunct: a row is a candidate when its **bridged
concentration is high** and its **bridged extent** clears the value §5.4
returns, with `g` derived for the page's class rather than quoted.

**Why this is small.** `page_substrate` is **already computed once per page**
for the sentinel. Promoting it to decider adds **no new computation**.

**Why the border stops mattering.** A scan border is one long concentrated run,
so it will be admitted as a candidate line. It will then sit alone, and the
existing `len(st) <= 2` spurious branch discards it — exactly as it does today.
**The border never needed to be cropped. It needed company.** Once the real
lines are admitted the border is one spurious line among forty real ones and
falls out of the machinery that already exists.

**Regression gates, all three mandatory, none negotiable.**

1. **All 23 fixture pages byte-identical.** The Cardoso and Rebelo fallback set
   this precedent at E.58 and met it. This must too.
2. **The three 1.000 pages re-score 1.000** through the harness. Fable's own
   tier-1 gate, applied here.
3. **The five ship gates at baseline**: phonology 216, dictionary 235,
   web-check 0 errors / 7 warnings / 4 files, web-test 555, score-parser 444
   passed / 5 skipped. New tests move web-test with Dann's permission only.

**Negative control, mandatory.** Show the new decider failing on input it
should fail on. Restore the old decider temporarily and show the photograph
still failing, then restore the new one and show it passing. A pass with no
demonstrated failure mode is not evidence.

---

## 7. PHASE 2 — periodicity, and only if Phase 1 leaves it necessary

If Phase 1 admits the true rows but grouping still does not produce five-line
staves, the next instrument is **periodicity**: five candidate rows at equal
spacing `s`, repeated down the page. On this photograph the spacing is exactly
19 px, five times, and the run-length estimator found 19 independently.

**Do not build Phase 2 speculatively.** The measured evidence today is that the
grouping machinery works once the right rows reach it.

---

## 8. Leeway for Code, and its limits

**Dann's instruction, 2026-08-17: Code may improve on this design.** That is
granted, under four conditions, which are the project's existing rules and not
new ones.

1. **Say what you substituted and why**, in the same message as the result. A
   silent deviation is the defect, not the deviation.
2. **Cite the authority.** Under the T4 amendment Dann ratified today, a stage
   may cite a named pre-deep-learning classical CV method with real provenance.
   Name it. "It seemed better" is not a citation.
3. **Meet §6's three regression gates unchanged.** A better mechanism that
   moves the fixture corpus is not better.
4. **Do not re-derive what is already ruled.** §4.1's annihilation lemma,
   §4.2's binding rule, and §3's strike are measured results, not opinions.
   Improving on them requires overturning a measurement, which means new
   measurement, not argument.

**Where improvement is most likely to be found:** the exact form of the extent
conjunct; whether `g` should be derived per page rather than per class; and
whether the run structure wants a second conjunct that this desk has not
thought of. §5's numbers will suggest things this document does not.

---

## 9. Pyodide, which no measurement here reaches

Every number in this document was taken on a **desktop or a Linux VM**, at
numpy 2.2 to 2.4 and cv2 4.11 to 5.0. **Pyodide runs cv2 4.9.0, numpy 1.26.4,
and is 32-bit, where `np.intp` is int32.**

E.58's lesson stands: `np.bincount` on an int64 array passed every local run
and threw in the browser, on the very page the code existed to rescue.
`principal_per_row` uses `np.add.at`, `np.maximum.at`, and `np.lexsort` with
explicit `int64` dtypes. **Whether those behave under Pyodide is NOT
ESTABLISHED and must be observed in a real browser before this is called
done.** The gates cannot reach it. Drive Playwright.

---

## 10. What this document does not establish

- Whether the substrate can separate staff lines from contamination on a
  photograph at any `g`. That is §5 and it is unanswered.
- Whether `K_S` holds on photographed input.
- The cause of the 16 px left strip.
- Whether the 19 px spacing holds across the whole page or only the measured
  system. `ENVIRONMENT.md:634-638` records a hand measurement of 17.0 for this
  page; the probe measured the line rows at exactly 19. **One of the two is
  wrong and this document does not say which.**
- Anything at all about a second photograph. **n = 1.** Every conclusion here
  rests on one page, and the next page may break it.

---
*Coordinating desk, 2026-08-17. Sources read in full this session:
`e16-layered-synthesis-architecture_2026-07-24.md`,
`e16-glyph-topology-architecture_2026-07-24.md`,
`fable-ruling-e16-layered-synthesis_2026-07-24.md`,
`gould-vocal-engraving-rules_v7_2026-08-05.md`, `substrate.py`,
`reader.py:15-395`. Snippet only:
`sonnet-brief-e16-uniformity-exemplar-procurement_2026-07-27.md`,
`sonnet-memo-e16-notehead-localization-survey_2026-07-23.md`.*
