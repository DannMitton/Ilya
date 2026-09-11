# Tessitura literature survey

Scope: how tessitura is defined and computed, and what related measures
locate a song's pitch mass and phonation demand. Every claim below is tied
to a source fetched this session, marked by reading depth.

## 1. Definitions, qualitative

- Merriam-Webster: "the general range of a melody or voice part;
  specifically: the part of the register in which most of the tones of a
  melody or voice part lie." (full)
- Wikipedia's tessitura article (tertiary, paraphrasing standard usage):
  tessitura is "the most acceptable and comfortable vocal range for a given
  singer," and "the range in which a given type of voice presents its
  best-sounding (or characteristic) timbre." Not the outer boundary but
  "the share of this total range which is most used," the "heart" of a
  range. Illustration: Siegfried spans C sharp 3 to C5, but tessitura is
  "high" because phrases sit C4 to A4. Also shaped by melodic contour,
  speed of pitch change, and direction of the line, not pitch alone. (full)
- Grove Music Online (403, paywalled), the Harvard Dictionary of Music
  entry, and Miller, Doscher, Vennard, McKinney, Bozeman, and Sundberg's
  The Science of the Singing Voice: NOT ESTABLISHED, no full text
  accessible online this session (catalogue and bookseller pages only).

All qualitative: "where most notes lie," no computable procedure. That gap
is what the quantitative literature tries to fill.

## 2. Quantitative methods

### 2.1 Pacheco 2013 (as already in hand)

Per Dann's own brief, not independently re-verified this session (searches
returned only unrelated tertiary hits, no accessible copy of the original):
Vieira Pacheco, "Angelica Catalani's Voice According to a Method of
Statistical Analysis," Journal of Singing 69 no. 5 (2013), p. 559. Histogram
of summed note duration per pitch, threshold at half the tallest bar,
tessitura from lowest to highest pitch whose bar clears it. Known failure
mode: keyed to one tallest bin, so a flat or bimodal distribution can
collapse the band or misjudge its width.

### 2.2 Rastall's pitch centre of gravity, via Barcan 2013

Barcan, L. J., "Tessitura Changes in Music Theatre Repertoire for the
Soprano Voice," Proceedings of the 8th International Congress of Voice
Teachers (Brisbane: NSW Chapter of ANATS, 2013), pp. 28-42, per a summary
page (scispace.com, full read of the summary, not the original proceedings
paper). A "pitch centre of gravity" (PCG), a duration-weighted mean pitch,
accounting for "not just the frequency of pitches, but also their
duration." Exact formula not recoverable (NOT ESTABLISHED); treat as a
duration-weighted mean f0 until the original Rastall source is found. Used
to confirm a "statistically significant lowering of tessitura in soprano
music theatre repertoire over time," 1920s-2000s. Strength: one centre
point, not sensitive to one bin. Failure mode: a single mean collapses
shape, saying nothing about spread or bimodality.

### 2.3 The tessituragram (Titze and Maxfield, 2021)

Titze, I. R., and Maxfield, L., "Adapting the Voice Range Profile for
Singers to Include Duration of Voicing," Journal of Singing 77 no. 5
(May/June 2021), pp. 653-661 (full PDF, vocology.utah.edu). Two proposals:
an adapted Voice Range Profile where each point is a circle sized by how
long the singer sustained phonation there (stopwatch-timed "as long as
possible" sustains, soft and loud, across the range); and, applied to a
song (Mozart's "Il mio tesoro intanto"), a "tessituragram" combining three
histograms over pitch (note occurrence, accumulated duration, vocal fold
cycles) laid over the duration-encoded VRP. Case study: a 74-year-old
bari-tenor "barely capable of sustaining" the durations demanded on F4, a
mismatch invisible to a plain range or single-threshold figure. Strength:
demand versus capacity on one axis, three distributions, not one band.
Cost: needs per-singer sustain data for the VRP half; the song-side
histograms alone (duration and cycles per pitch) work without it.

### 2.4 Cycle-dose tessituragrams (Schloneger, Hunter, and Maxfield)

Schloneger, M., Hunter, E. J., and Maxfield, L., "Quantifying Vocal
Repertoire Tessituras Through Real-Time Measures," NATS national
conference, Las Vegas, 2018 (nats.org conference PDF, full read). A related
J Voice (2021) article's abstract page returned a CAPTCHA wall this
session (NOT ESTABLISHED beyond the conference PDF and a podcast
interview, Every Sing episode ES048, full read). Method: a neck-worn
dosimeter (Sonovox VoxLog) plus 44.1 kHz audio capture "cycle dose" and
"dose time" per pitch during a performance, producing a "score-based
tessituragram" overlaid on the singer's own VRP. Quoted: "tessitura,
however, is something that has until recently remained unquantified by
scientific methods." The podcast measures "how much time on each pitch"
and "how many vibratory cycles on each pitch," naming Titze (2008) and
Thurmer (1988) as antecedents (2008 source not independently verified).
Strength: grounds the histogram in measured cycle exposure, compatible with
cycle-dose framing (section 3). Cost: needs a dosimeter and a live or
recorded performance, not just a score.

### 2.5 Two leads not recoverable this session

Thurmer, S., "The tessiturogram," Journal of Voice, vol. 2 (1988), pp.
327-329 (snippet only, Google Scholar lookup; ScienceDirect abstract did
not load), treated by later authors above as the term's origin, and "Tessa:
A Novel MATLAB Program for Automated Tessitura Analysis," Journal of Voice
(2020), author possibly Christopher Apfelbach (snippet only; PubMed,
ScienceDirect, and ResearchGate all refused the fetch). Both worth a
follow-up fetch; NOT ESTABLISHED beyond title and venue.

### 2.6 MIR pitch histograms (contrast case)

Tzanetakis, G., Ermolinskyi, A., and Cook, P., "Pitch Histograms in Audio
and Symbolic Music Information Retrieval," IRCAM/ISMIR, 2002 (full PDF,
cs.cmu.edu). For MIDI input, the histogram increments a per-note-number
counter on each Note-On event; duration is not used as a weight, only
occurrence count. Used for genre classification, not tessitura. Relevance:
the standard MIR baseline is occurrence-weighted, unlike Pacheco, Rastall's
PCG, and the tessituragram work, all weighted by duration because vocal
load tracks time on a pitch, not attack count.

## 3. Vocal dose and cycle counting

Primary source: Titze, I. R., Švec, J. G., and Popolo, P. S., "Vocal Dose
Measures: Quantifying Accumulated Vibration Exposure in Vocal Fold
Tissues," J Speech Lang Hear Res 46 no. 4 (2003). ASHA and PubMed both
blocked this session; definitions and formulas below come from a Scielo
integrative review reproducing this paper's formulas (full PDF,
scielo.br), cross-checked against an NCVS explainer (full, ncvs.org, 2023,
author Ana Flavia Zuim).

Three dose measures, defined as integrals over phonation time t, with kv a
voicing indicator (1 during voiced phonation, 0 otherwise):

- **Time dose (Dt)**: integral of kv dt, in seconds. "The accumulated time
  of vocal folds vibration."
- **Cycle dose (Dc)**: integral of kv times F0 dt, in (thousands of)
  cycles. The count of glottal cycles, "one cycle representing the
  movement that occurs from the beginning of the open phase till the
  conclusion of the closed phase." This is f0 times seconds, summed over
  the voiced signal, exactly the figure Dann is planning per song, summed
  per note rather than integrated continuously. Name and cite it as cycle
  dose, Titze, Švec, and Popolo (2003).
- **Distance dose (Dd)**: 4 times the integral of kv times amplitude times
  F0 dt, in metres. Linear distance travelled by a vocal-fold tissue
  particle, folding amplitude (SPL) in on top of cycle count. NCVS calls
  it the most complete, capturing displacement, not just contact; needs a
  per-note intensity estimate Dann does not yet have, a design decision.

## 4. Repertoire-to-voice and difficulty studies

- Barcan 2013 (2.2): duration-weighted PCG detected a real historical
  lowering of tessitura in soprano musical theatre repertoire, evidence a
  duration-weighted statistic can surface a repertoire-level trend.
- Schloneger, Hunter, and Maxfield (2.4): song-side tessituragram overlaid
  on a singer's dosimetry-based VRP, framed as a repertoire-selection tool
  ("Score-based tessituragrams aligned with singer VRPs show promise in
  repertoire selection," per the NATS conference PDF).
- Titze and Maxfield 2021 (2.3): the Mozart case study checks one aria
  against one singer's measured sustain capacity, locating the mismatch at
  a specific pitch (F4), not just "the song is too high."
- Titles found but not fetched, NOT ESTABLISHED beyond title/venue, worth a
  follow-up: "The Vocal Score Profile in Verdi's Characters" (ScienceDirect,
  400 error); "Quantitative Analysis of Tessitura and Density in ... Die
  schone Muellerin" (Journal of Voice, 403 error).

## 5. Synthesis: options against the Pacheco reservations

Options, not a recommendation, each with its cost.

- **Add a duration-weighted mean pitch beside Pacheco's band** (Rastall
  PCG, 2.2). Cost: one extra number, cheap from data already summed; a mean
  far from the band is itself a bimodality signal.
- **Report the full duration histogram, not just the two threshold notes**
  (2.3-2.4). Cost: more visual surface to read; directly answers flat
  versus bimodal, which a single band cannot.
- **Switch "half the tallest bar" to a duration-weighted percentile band**
  (for example the middle 50-80 percent of summed duration). Cost: Dann's
  own design and validation decision; no published percentile-band method
  was found (section 7), so an extension of Pacheco, not a citation.
- **Add cycle dose as a second axis next to any tessitura figure** (section
  3). Cost: near free, reuses the same f0-times-duration data; answers "how
  much phonation," which tessitura alone does not.
- **Keep Pacheco as is, document its failure modes**, pointing to the
  wider literature. Cost: no engineering work; the flat/bimodal case stays
  unresolved for the user.

## 6. Sources, with reading depth

Full: Merriam-Webster, "tessitura" (merriam-webster.com); Wikipedia,
"Tessitura" (tertiary); Titze and Maxfield (2021), J Singing 77(5), 653-661
(vocology.utah.edu PDF); Zuim (2023) vocal dose explainer (ncvs.org); the
vocal dose integrative review reproducing Titze/Svec/Popolo 2003 formulas
(scielo.br/j/rcefac PDF); Schloneger, Hunter, and Maxfield NATS 2018
conference PDF (nats.org); the Every Sing podcast, episode ES048 (secondary,
spoken description); Barcan (2013) summary page (scispace.com, summary,
not the original proceedings paper); Tzanetakis, Ermolinskyi, and Cook
(2002) (cs.cmu.edu PDF).

Snippet only: Thurmer (1988), "The tessiturogram," J Voice 2, 327-329
(Google Scholar lookup); "Tessa" MATLAB tessitura program, J Voice (2020);
"The Vocal Score Profile in Verdi's Characters," ScienceDirect (400 error
on fetch); "Quantitative Analysis of Tessitura and Density in ... Die
schone Muellerin," J Voice 2024 (403 error on fetch).

Not fetched: Pacheco (2013), J Singing 69(5), p. 559, restated only from
Dann's own prior brief.

## 7. NOT ESTABLISHED

- Grove Music Online (403), the Harvard Dictionary of Music entry, and any
  wording from Miller, Doscher, Vennard, McKinney, Bozeman, or Sundberg's
  The Science of the Singing Voice: no full text accessible.
- The exact mathematical form of Rastall's pitch centre of gravity (only
  the concept, duration-weighted mean pitch, was recoverable).
- A published, duration-weighted percentile-band method for tessitura.
- The published J Voice abstract for Schloneger, Hunter, and Maxfield
  (2021) beyond the conference PDF and podcast (CAPTCHA wall on the page).
- The original Titze, Švec, and Popolo (2003) text itself (ASHA and PubMed
  both blocked); formulas here are from a citing review, not the primary.
- Any Titze (2008) tessitura source named by the Every Sing podcast; not
  independently located.
- The algorithm, authorship, and findings of "Tessa" (2020) beyond title
  and venue.
- The content of "The Vocal Score Profile in Verdi's Characters" and
  "Quantitative Analysis of Tessitura and Density in ... Die schone
  Muellerin" beyond their titles.
