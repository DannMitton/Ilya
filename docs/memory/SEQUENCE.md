# SEQUENCE — the build order for the open cardinals

**Invoke this by name.** It answers one question: what gets built next, and what
must be finished before it. **It is NOT the opening read.** Open it when an item
closes and the next one is being chosen, or when Dann asks to work through the
queue.

**It is maintained at every close, alongside `STATE.md`.** When an item closes,
strike it here. When Dann numbers one, place it here. **A sequence that has gone
stale is worse than none**, because it is quoted rather than checked.

*Created 2026-09-15 at Dann's request, from
`../sessions/sequence-open-items_r1_2026-09-15.md`, which is the dated original
and is not maintained.*

---

## The open cardinals, sequenced. First written 2026-09-15

**What this is.** A build order for the open numbered items, ordered so that
nothing is built against a moving part and nothing is built twice. Asked for by
Dann, 2026-09-15.

**What it is not.** A release cut. It says what order to build in, not where the
next public Ilya stops (Ilya has been public since January; see `PRODUCT.md`). That question is still his and is recorded separately in
`STATE.md` §RULINGS DANN OWES.

**Instrument.** `OPEN.md` read in full, `STATE.md` §THE TRACKER and §OWED read in
full, 2026-09-15. **The small and parked items are NOT sequenced** (N.45's
remainder, N.51, N.17, N.19, N.61, N.6, N.27, N.28, N.48, N.59 step 3, N.102-1c,
N.82, N.89): they are known only by their one-line entries and none of them
blocks another.

---

**RELEASE DATE, ruled by Dann 2026-09-16: Friday 2026-10-30.** The order below is read against it; what does not fit goes to FLAGGED or LATER (`STATE.md` §RULINGS DANN OWES).

---

## The six real dependencies. Everything else floats

**1. N.129 comes before every piece of horizontal spacing work.** It is a RULER
correction: `underlay-widths.ts:690` declares its table as Source Serif 4 metrics
and the page has drawn Source Sans 3 since the paginator began stripping the
serif root, so every syllable advance and every hyphen endpoint is computed from
metrics the glyphs never had, about 5% out on one measured word. `STATE.md` says
it of the hyphen work in its own words: *"A hyphen clearance tuned against a table
that is 5% out is tuned against a bad ruler."* **The same is true of N.139's
mid-system signature, of N.115's reflow, and of N.141's step 3 if it is ever
reached.** Build the ruler first or measure three more things against a bad one.

**2. N.132 comes before N.130 and N.131.** N.132 builds the ratified names,
`Text` / « Texte », `Markup` / « Annotation », `Insights` / « Aperçus », `Melody`
/ « Mélodie ». N.130 and N.131 translate about 122 entries. **Translating strings
that are about to be renamed is work done twice.**

**3. N.136 comes before N.119, and shrinks it.** N.119 asks which notation
toggles reach Score markup. The 2026-09-15 re-audit established that four of the
five claimed do reach the DRAWN text, traced to `staff-renderer.ts:2547`, and that
`openSyllabification` does not, which is N.136. **So N.136 is the live half.**
What remains of N.119 afterwards is two toggles that reach nothing at all:
`showStressDiacritics`, never passed to `VoiceProfilePane`, and `reconstitution`,
declared "Phase 3, not wired yet" at `engine.ts:35`.

**4. N.123 comes before N.124.** Stated in N.124's own spec: *"Needs: N.123."*
**N.124 also needs a multi-voice library, which is NOT ESTABLISHED as existing**,
and the singer's floor and ceiling from calibration, also NOT ESTABLISHED. Those
are prerequisites nobody has checked.

**5. The drawer grammar is ratified before N.120, N.122 and N.94.** Plate 1 of
`drawing-calibration-surface_r1_2026-09-10.html` is the drawer grammar with every
measure cited, and it goes into `PRODUCT.md` once Dann ratifies it. N.122 *"belongs
with N.120 as the drawer's surfaces"*, and N.94's transposition control is a
station inside the `Melody` band, sibling to Corrections. **All three want the
station grammar settled first.** This is a Dann action, not a build.

**6. N.130 is inside the release, N.131 is outside it.** `STATE.md`: the ruled
release sentence names Insights, and *"a document in the wrong language is wrong
rather than half-built."* N.131 is explicitly not release-blocking.

---

## The order

### Tier 0. The ruler, and the record

| item | why here |
|---|---|
| **N.129** | Brief written 2026-09-16, `../sessions/brief-n129-underlay-ruler_r1_2026-09-16.md`; runs after N.142 and the loupe French. Everything that spaces text measures against its table. Nothing else in the notation layer should be built first. |
| **N.136** | Cheap, and it settles the live half of N.119 before N.119 is briefed. |

### Tier 1. The notation layer

| item | why here |
|---|---|
| ~~**N.139**~~ DONE 2026-09-16, `eb7d220` | Brief written and inherits the 2-space run-in Dann ruled. Its mid-system signature adds to a column advance, so it wants N.129's table. |
| ~~**N.126**~~ DONE 2026-09-15, `76b24a3` | Measure numbers. Vertical, so N.129 does not bind it. Can run any time. |
| ~~**N.125**~~ DONE 2026-09-16, `34b143c`, `570d76f` | Slurs. Its own Code thread, `staff-renderer.ts` only, off the drawer path. Brief written. Independent. |
| ~~**N.143**~~ DONE 2026-09-16, `7abb5ae` | A `.musx` score fills the input field and takes its file's name. Placed 2026-09-16. |
| **N.144** | Start placement over keeps the score's layout, and can be undone. Placed 2026-09-16, NEXT BUILD, brief `../sessions/brief-n144-start-over-keeps-the-score_r1_2026-09-16.md`. |
| ~~**N.142**~~ DONE 2026-09-16, `c868540` | Ties are prolongation. Placed 2026-09-16, brief `../sessions/brief-n142-tie-is-prolongation_r1_2026-09-16.md`. Unblocks N.141's last step. Independent of N.129: it changes which notes take syllables, not their spacing. |
| ~~*(loupe French)*~~ SHIPPED `c868540` | Not numbered. All ruled 2026-09-14 and 2026-09-16; brief `../sessions/brief-loupe-french-build_r1_2026-09-16.md`, runs after N.142. |
| **N.115** | The singer moves a measure between systems. **Last in this tier**: it reflows whole systems, so it wants the ruler and the meter already in place, or its reflow is judged against content that is about to change. |

### Tier 2. Names, then language

| item | why here |
|---|---|
| **N.132** | The ratified names. Also carries the ruled 0.5 rem tab padding nobody has seen on screen. |
| **N.130** | Insights' French, about 58 entries. Release-blocking. |
| **N.131** | The rest, about 64 entries. **Its real size is NOT ESTABLISHED** until a triage separates the genuinely untranslated from words identical in French on purpose. The loupe's share of that triage is already done in `spec-loupe-french_r1_2026-09-14.md`. |

### Tier 3. The drawer

| item | why here |
|---|---|
| *(ratify the drawer grammar)* | Dann's, not a build. Unblocks the three below. |
| **N.120** + the Tempo station | The station grammar itself. |
| **N.122** | The capture surface as a landmark. Drawn r1, belongs with N.120. |
| **N.94** | The transposition control. **The engine already ships** (`transposition.ts`, wired at `watchlist.ts:476`); only the control is missing. Re-read `e31-late-rulings` first, it is 37 days old. |
| **N.121** (c) and (d) | Both wait on rulings from Dann, not on code: the pill's fate, and the undo clause for Start placement over. |
| **N.117** | The progress bar. Independent and small. What it measures is NOT ESTABLISHED. |

### Tier 4. Analysis

| item | why here |
|---|---|
| **N.123** | The aggregation layer under four figures. Feeds everything below it. |
| **N.127**'s later increments | Insights. Increment 1 is built and its five decisions are unreviewed. |
| **N.124** | Repertoire for a studio. Needs N.123, plus two prerequisites NOT ESTABLISHED. |

### Tier 5. The loupe's remainder

| item | why here |
|---|---|
| **N.141** | Two increments shipped. The last (a tie spanning the squircle) waits on N.142. |
| **N.140** | The stave-space floor. **Insurance rather than an improvement**: on today's scores the scroll would never fire, and landscape already answers the mobile case. Lowest priority of anything numbered. |

### Tier 6. The reader

| item | why here |
|---|---|
| **N.135** | The page reader reads the text underlay. Independent of everything above. Cost measured in its own memo. |
| **N.110** | The `[i]` extractor harness. Set aside by Dann, briefed, not built. |

### Tier 7. The book and the release

| item | why here |
|---|---|
| **N.116** | Learn as the book. Step 1 done; step 2 needs Grayson chapters 1, 8 and 9 read. |
| **N.84** | Guide and Learn. Carries the tessituragram paragraph already drafted for N.123. |
| **N.83**, **N.85** to **N.88**, **N.89** | The release sequence. **See the contradiction below.** |

---

## THE ONE THING IN THIS SEQUENCE THE DESK CANNOT DECIDE

**Dann's two orderings contradict each other and both are his.**

- **2026-08-24:** N.83, N.84, N.85, N.86, N.87, N.88, with walkthrough prep first.
- **2026-09-06:** the release order N.85 to N.88, then N.84, then N.83, which
  reverses both ends.

Per tether 17 the later ruling stands. **But N.83 is the item that produces the
first honest end-to-end reader accuracy datum, and nothing else in the tree
produces one.** Putting it last means the release is cut without that number.
**One question, whichever order he wants.**

---

## What this sequence does not change

**The queue grows faster than it drains.** Fifteen numbers arrived in the seven
days to 2026-09-13 while nine closed; 2026-09-14 into 2026-09-15 closed two and
numbered three. **No build order fixes that.** The release date is set by when the
numbering stops, which is the ask recorded in `STATE.md` §RULINGS DANN OWES and is
deliberately not raised here.
