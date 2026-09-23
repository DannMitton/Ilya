# PROPOSAL. What to take from St-Pierre's grid, and what to refuse

**Written 2026-09-22 by the desk on Dann's instruction:** *"I want us to adapt useful bits
from her work that can authentically enhance the way that Ilya profiles pieces for the
user."* **With discernment, not wholesale.**

**WHAT WAS READ.** Her Chapter 3 in full (pp. 60-86: the literature review, the grid, and
every element definition), the abstract, the contents, and one complete song annotation from
Chapter 4 to establish its shape. **NOT READ: Chapters 1 and 2, the remaining twenty-one
song annotations, and the appendices.** Chapters 1 and 2 are a history of the repertoire.
**The sampled annotation established that Chapter 4 is poem, IPA, translation and historical
prose, not further instrument**, which is why the rest was not read.

**WHAT WAS READ IN THE TREE, 2026-09-22**, so that nothing below promises what Ilya cannot
compute: `packages/score-parser/src/types.ts`, the `VocalLineEvent`, `Pitch`,
`AccompanimentLine` and `ParsedScore` shapes.

---

## THE THESIS, IN ONE PARAGRAPH

**Her grid scores a piece against a general norm. Ilya measures a singer.** She asks *how
hard is this piece?*; Ilya asks *does this piece fit this voice?* **Those are not the same
question and her answers should not be imported as answers.** But several of her twenty-five
elements are about the voice's work rather than the pianist's or the reader's, and **Ilya can
score those against the singer in front of it, which she cannot.** A minor sixth leap is
"minimal" for everyone in her grid. A minor sixth leap landing two semitones above this
singer's secondo passaggio is not minimal for them. **That is the adaptation: take her
elements, refuse her scores, and score them personally.**

---

## ADOPT. Four, each with what Ilya adds that she could not

### 1. Interval leaps, scored by where they land

**Hers:** large interval leaps (a minor sixth or larger) and diminished or augmented
intervals; 2-3 judged minimal, 4-7 moderate, 8 or more extensive. **Her rationale is
vocal, not notational:** *"vocal fold coordination with ideal breath pressure may become
more difficult."*

**Computable today.** `VocalLineEvent.pitch` carries `step` and `octave` in MIDI convention
(`types.ts:494-499`), so the interval between consecutive sung events is arithmetic.

**WHAT ILYA ADDS.** She counts leaps across a whole piece. **Ilya knows where each one
lands** relative to this singer's measured passaggi and typed range. **A leap into the
passaggio, or onto a note already above the singer's range, is a different event from a leap
in the comfortable middle**, and only Ilya can tell them apart. **Her count is the weaker
half of her own idea.**

### 2. The phrase, not just the note

**Hers:** long phrases and long sustained notes, measured in seconds, weighted by the
dynamic and the piano texture against them. **Her rationale, quoting Vennard:** breath
management, and that long phrases are harder while a piece is still unfamiliar.

**Computable today, and the tree already intends it.** `VocalLineEvent.articulations`
carries breath marks and caesuras, and the type's own comment says *"v1 analysis primarily
attends to `'breath-mark'` and `'caesura'` for phrase boundary detection"*
(`types.ts:485-488`). Both parsers map them (`mnx-parser.ts:242-243`,
`musicxml-parser.ts:259`). **The data and the stated purpose are both already there and
nothing uses them.**

**WHAT ILYA ADDS.** She measures a phrase's length. **Ilya can measure a phrase's
tessitura**, and whether it crosses the passaggio, and whether it ends above the singer's
range. **A twelve-second phrase in the middle of the voice and a twelve-second phrase
sitting on the secondo passaggio are not the same demand**, and her grid cannot separate
them.

**This is the single largest gap between what Ilya measures and what a singer feels.** Every
finding Ilya makes today is about one note. **Breath is not a property of a note.**

### 3. Degree, not only direction

**Hers:** every element is minimal, moderate or extensive, and she is explicit about why:
*"a score that contains only one unprepared modulation will not receive the same number of
points than a score that contains multiple"*.

**Ilya's flag column says `Contained`, `Above`, `Below`, `Wider`, `No threshold`
(`i18n.ts:1479-1483`) and stops.** `Wider` does not say how much wider.

**Computable today with no new parsing whatever.** Ilya holds both the piece's compass and
the singer's typed range. **The distance between them is a subtraction.**

**This is the cheapest of the four and it needs no new data at all.** It is also the same
instinct Dann followed on 2026-09-22 when he replaced a bare ordering with *"by how much
time you spend singing it"*.

### 4. Melisma as a named demand

**Hers:** ornamentation, which she defines to include melismas, scaled by amount.

**Computable today.** **Melismas are already encoded in the parse**, by the absence of a
syllable on continuing notes (`types.ts:470-478`), which is how Ilya draws them.

**WHAT ILYA ADDS.** She counts ornaments. **Ilya knows which melismas sit across the
passaggio or above the range**, which is the only thing about a melisma that bears on
whether this piece suits this voice.

---

## REFUSE, and why. This is the part that matters

### The summed grade. Refused on your own ruling, and on hers

Her twenty-five scores sum to **elementary, intermediate or advanced**. **`PRODUCT.md`
requires Insights to forecast and never declare**, and a piece labelled "advanced" is exactly
the pronouncement this page refuses.

**She names the flaw herself:** *"a piece with a score of 16 may not be as challenging to
perform as a piece with a score of 24; however, both pieces are categorized as intermediate
level."* Her cure is to print the raw number in parentheses beside the word. **If the number
carries the information and the word misleads, Ilya should print neither and show the rows.**
Which is what it already does.

### Her tessitura thresholds. Refused because Ilya's are better

She defines high and low tessitura **per voice type**, against McKinney's ideal ranges: for a
soprano, around the secondo passaggio and above; for a baritone, around the primo and above.

**Ilya defines them against the singer's own measurements**, and Dann's ruling of 2026-09-16
forbids fach from playing any part: *"a declared voice type plays NO part in choosing values,
because fach is bound up with identity."* **Her version is a norm; Ilya's is a measurement.
Adopting hers would be a regression.**

### Harmony. Refused as out of scope and out of subject

Unprepared modulations, chromaticism, modality, atonality. **Ilya performs no harmonic
analysis**, and these measure a musician's difficulty in learning the piece, not a voice's
fit for singing it.

### Text difficulty. Refused as a pronouncement about the singer

Mature or comical subject, dialect, archaic language, metaphor density. **These require a
human reader**, and grading a poem as beyond a singer's experience is a judgement about the
singer, not about the piece. **Arneson's line that she quotes gives the game away:**
*"Selecting a song that is outside the realm of experience for the student."* **Ilya makes
no pronouncements on who the singer is.**

### Dynamics and articulation counts. Refused, and one of them is not even possible

**The parsed score carries NO dynamics at all.** A grep of
`packages/score-parser/src/types.ts` for "dynamic" on 2026-09-22 returns nothing. Her
extended-dynamics element is therefore not computable without new parsing.

Articulations ARE kept, but **counting articulation markings measures the engraver's
diligence, not the voice's work.** A carefully marked edition would score as harder than a
plain one of the same music.

### Piano texture, virtuosity, prelude length. Refused as the pianist's difficulty

**Ilya does keep the accompaniment** (`AccompanimentLine`, `types.ts:791-800`, chord-capable),
so these are not impossible. **They are simply not about the voice.**

### Extended vocal technique. Refused as near-absent

Sprechgesang, multiphonics, ululation. **Not a feature of the repertoire Ilya serves.**

---

## ONE BORDERLINE, FLAGGED AND NOT DECIDED

**"The piano does not play the entrance note of the vocal line."** She scores this under
piano accompaniment, but **it is the singer's problem, not the pianist's**: finding your
first pitch with no help. **It is computable** — the accompaniment is parsed with
chord-capable events — and it is the only one of her five piano elements that is about the
person singing.

**Dann's call whether that earns its place.**

---

## WHAT IS NOT ESTABLISHED, and the hardest of it is first

1. **WHERE A COMPUTED THRESHOLD COMES FROM.** Her degrees are a teacher's judgement reading
   a score: *"a range of just above one octave and a half was judged minimal."* **Judged by
   whom, against what, is a human's answer.** Ilya would have to compute the boundary
   between minimal and extensive, and **nothing in her work says how.** This is the real
   obstacle to all four adoptions above, and this proposal does not solve it.
2. **Whether any of this belongs in Insights at all**, or wants its own surface. Insights
   is one page and already carries three rows, a verdict, and a findings list.
3. **The twenty-one unread annotations**, which may contain applied judgements that bear on
   thresholds.
4. **Whether phrase boundaries actually survive Ilya's real scores.** The parse keeps breath
   marks and caesuras, but **no one has checked how many of Dann's scores carry them.** A
   phrase element resting on marks that are usually absent would be a wasted build.

---

## WHAT THE DESK WOULD DO NEXT, IF ASKED

**Not a build. A measurement.** Item 4 above is cheap and decides whether item 2 of the
adoptions is worth anything: **count breath marks and caesuras across Dann's own library and
the fixtures.** If they are rare, the phrase idea dies there. If they are common, the
largest gap between Ilya and a singer's experience is addressable.

**And nothing here is numbered.** Per `CONTRACT.md` §3.1, nothing enters the tracker unless
Dann rules it in.
