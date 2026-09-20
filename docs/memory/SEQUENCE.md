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
`OWED.md` §RULINGS DANN OWES.

**Instrument.** `OPEN.md` read in full, `STATE.md` §THE TRACKER and §OWED read in
full, 2026-09-15. **§OWED moved to `OWED.md` on 2026-09-20; the
reading above was of `STATE.md` as it stood that night.** **The small and parked items are NOT sequenced** (N.45's
remainder, N.51, N.17, N.19, N.61, N.6, N.27, N.28, N.48, N.59 step 3, N.102-1c,
N.82, N.89): they are known only by their one-line entries and none of them
blocks another.

---

**RELEASE DATE, ruled by Dann 2026-09-16: Friday 2026-10-30.** The order below is read against it; what does not fit goes to FLAGGED or LATER (`OWED.md` §RULINGS DANN OWES).

---

## The six real dependencies. Everything else floats

**1. N.129 comes before every piece of horizontal spacing work.** It is a RULER
correction: `underlay-widths.ts:690` declares its table as Source Serif 4 metrics
and the page has drawn Source Sans 3 since the paginator began stripping the
serif root, so every syllable advance and every hyphen endpoint is computed from
metrics the glyphs never had, about 12.2% out on one measured word (**corrected 2026-09-20 from "about 5%"; the old figure rested on a 27.72 px serif measurement that the table does not give and no browser draws. The table gives 29.98 px for « ночь » and the browser draws 29.80. See `OPEN.md` §N.129**). `STATE.md` says
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

**7. N.153 comes before any further caret work, and nothing comes before N.153.**
Added 2026-09-18. Three passes on 2026-09-17 and 2026-09-18 each relocated the
caret collisions rather than removing them, because a crop of the page cannot give
a measure wider relative spacing and the collisions are scale-invariant. **Any
further attempt to place carets inside the crop is work that N.153 throws away.**
N.153 itself depends on nothing else open: its five stages are internal to
`Loupe.svelte`, `VoiceProfilePane.svelte` and `loupe.ts`.

**6. N.130 is inside the release, N.131 is outside it.** `STATE.md`: the ruled
release sentence names Insights, and *"a document in the wrong language is wrong
rather than half-built."* N.131 is explicitly not release-blocking.

---

## The order

### Tier 0. The ruler, and the record

| item | why here |
|---|---|
| ~~**N.129**~~ **CLOSED 2026-09-20**, `e75d6f3` and `7bd3d04`, both walked | The ruler. **r1's direction was WRONG and r2 reversed it:** Dann ruled the underlay draws in Source Serif 4, the face the table already measures, rather than the table being remeasured into Source Sans 3. Brief `../sessions/brief-n129-underlay-ruler_r2_2026-09-20.md`. **Dependency 1 is now discharged and every horizontal spacing item behind it is free.** |
| **N.136** | Cheap, and it settles the live half of N.119 before N.119 is briefed. |

### Tier 1. The notation layer

| item | why here |
|---|---|
| ~~**N.139**~~ DONE 2026-09-16, `eb7d220` | Brief written and inherits the 2-space run-in Dann ruled. Its mid-system signature adds to a column advance, so it wants N.129's table. |
| ~~**N.126**~~ DONE 2026-09-15, `76b24a3` | Measure numbers. Vertical, so N.129 does not bind it. Can run any time. |
| ~~**N.125**~~ DONE 2026-09-16, `34b143c`, `570d76f` | Slurs. Its own Code thread, `staff-renderer.ts` only, off the drawer path. Brief written. Independent. |
| ~~**N.143**~~ DONE 2026-09-16, `7abb5ae` | A `.musx` score fills the input field and takes its file's name. Placed 2026-09-16. |
| ~~**N.144**~~ DONE, `ceeb214` | Start placement over keeps the score's layout, and can be undone. **This row read NEXT BUILD until 2026-09-20, when `OWED.md:131` was found already recording it as shipped. A sequence that has gone stale is worse than none.** |
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
numbering stops, which is the ask recorded in `OWED.md` §RULINGS DANN OWES and is
deliberately not raised here.


---

## THE AUTONOMOUS RUN. Set 2026-09-20, on Dann's instruction

**His instruction:** the desk and Code take the items below without him, and he stays
available for permissions and for questions of taste. **He still walks everything.
`WRITTEN` is not `DONE`.**

**What made this possible:** N.129 closed, which discharges dependency 1, and Dann
asked for a profile of what could run without his rulings.

### The rule for this run

1. **The desk writes the brief, Code builds, the desk walks it in Dann's Chrome and
   sends him shots to rule on.** That walk method is `ENVIRONMENT.md`
   §`THE DESK DRIVES HIS CHROME AND HE RULES ON SHOTS`.
2. **Take the app's own update toast before measuring anything**
   (`ENVIRONMENT.md` §`THE APP TELLS YOU WHICH BUILD IT IS ON`). Three readings were
   reported off stale builds on 2026-09-20.
3. **Name the artefact a defect was seen in before briefing a fix**
   (`ENVIRONMENT.md` §`THE PAGE RENDERS HIS LIBRARY, NOT YOUR FIXTURE`).
4. **Ask Dann only for: a gate baseline move, a `git add`, a ship, a walk verdict, and
   anything that is taste, irreversible or French.** Nothing else.
5. **An unresolved detail is the desk's to hold, not his to carry** (`CONTRACT.md` §3,
   ruled 2026-09-20). A worry with no consequence yet is a line in `ENVIRONMENT.md` or
   a note for the walk, never a question and never a menu of options.

### The order, largest value first

| item | what it is, and what it needs from Dann |
|---|---|
| **N.153 stages 2 to 5** | The loupe re-engraves the held measure at its own spacing. Stage 1 shipped `0028266`; stage 2's brief is written, `../sessions/brief-n153-s2-data-channel_r1_2026-09-20.md`. **Depends on nothing and nothing comes before it** (dependency 7). It closes the 27 scale-invariant caret collisions and is what makes the insert reach usable on a phone. **Dann: the walk.** |
| **N.132** | The ratified names, `Text` / « Texte », `Markup` / « Annotation », `Insights` / « Aperçus », `Melody` / « Mélodie », ruled 2026-09-13 in both languages and still unbuilt. Carries the ruled 0.5 rem tab padding nobody has seen. **Must precede N.130 and N.131** (dependency 2). **Dann: the walk, and his eye on 0.5 rem.** |
| **N.136** | Open syllabification never reaches Score markup's drawn text. Small, traced, and it shrinks N.119 before N.119 is briefed (dependency 3). **Dann: the walk.** |
| **N.141, last step** | The squircle across a tie. Was gated on N.142, which shipped `c868540`. **Its other two questions stay Dann's and are NOT in this run.** |
| **N.135** | The page reader reads the text underlay. Ruled 2026-09-14, cost measured in `../sessions/memo-n135-ocr-measurement_r1_2026-09-14.md`. Independent. **Dann: the walk.** |
| **N.142 step 2** | Was blocked on a count only Dann's browser holds. **No longer: the desk read his library through Chrome three times on 2026-09-20 and takes the count itself.** Build only if the count is not zero. |

### Absorbed alongside, no brief needed

- **N.128's two other consumers.** One question: do `sustain.ts:61-84` and
  `watchlist.ts:229-244` read the corrected line or the reader's events? Pure code
  reading. `OWED.md` §OWED.
- **Remove `bits-ui`** from `apps/web/package.json`. Ruled 2026-08-16, lockfile only,
  on its own commit.
- **The reading half of N.86's dead-code audit.** What the Shane switch does at release
  stays Dann's.

**FARM-OUT NOTE, usage read from Dann's screenshot 2026-09-20 15:25:** all-models
weekly at 8%, Fable at 0%. **The shared pool is wide open**, so the audits and the
code-reads go to Sonnet agents rather than inline. State the cost before each.

### NOT in this run, because they are his

The drawer grammar ratification, which gates N.120, N.122 and N.94. N.140's two
numbers. N.141's other two questions. N.154's and N.131's French. The N.83 ordering
contradiction. The release cut.
