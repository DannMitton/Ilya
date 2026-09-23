# Literature search: has anyone built a sung-legato phrase-length intake test?

Research question for Dann Mitton (Ilya project). Question: has anyone designed software or a
published protocol that has a singer perform a fixed legato sung pattern and times continuous
phonation to the first spontaneous breath, as a way of calibrating phrase length to that singer?

Search date: 2026-09-23. Method: web search (Google-style queries via WebSearch) plus WebFetch of
abstracts, PDFs and article pages. No paywalled full texts were purchased or accessed through an
institutional login; where a source could not be opened, this is stated. Nothing here is filled in
from memory. Where a source only gave a snippet or an AI-summarised fetch of a page (rather than
the primary text), this is flagged.

Confidence note on method: most "abstracts" below were obtained by fetching a page URL with an
AI web-fetch tool, which itself summarises the page rather than returning raw text verbatim in
most cases. Where I say "quoted" I mean the fetch tool reported that exact string as appearing in
the source. This is a step removed from reading the primary document myself, and is marked as
"snippet/summarised" rather than "read in full" throughout.

---

## 1. Maximum phonation time (MPT): the base task, and critiques

### 1.1 Classic MPT protocol
- **Source**: University of Iowa, Iowa Head and Neck Protocols, "Voice Clinic" page
  (https://iowaprotocols.medicine.uiowa.edu/protocols/voice-clinic). Clinical protocol page, not a
  peer-reviewed study.
- **Task**: sustained phonation of the vowel "ah". Fetch-tool summary: "The maximum amount of time
  a person can sustain phonation of 'ah' is timed." No exact patient-facing script was recoverable
  from the page as fetched (no loudness, pitch or breath-in instruction captured).
- **What it measures**: duration of sustained phonation in seconds, as a proxy for laryngeal and
  respiratory function.
- **Automated**: no, stopwatch/clinician-timed.
- **Norms given**: adult females 15-25 s, adult males 25-35 s (clinical rule-of-thumb, not cited to
  a specific study on this page).
- **Read as**: page summary only (fetched via tool, not read directly by me).

- **Source (protocol form)**: PhenX Toolkit, "Voice Impairments: Maximum Phonation Time" measure
  document (phenxtoolkit.org). Could not open (403 error on repeated attempts). NOT READ. Listed
  here only because it exists and is the kind of document that would carry a standardised MPT
  script; I could not confirm its exact wording.

### 1.2 s/z ratio and MPT in speech-language pathology (background, not singing-specific)
- **Salturk, Z. et al. or similar** - "Maximum Phonation Time and s/z Ratio in a Large Child
  Cohort", *Journal of Voice* (ScienceDirect/PubMed listing found; author names and full citation
  not confirmed from a full read - link only:
  https://www.jvoice.org/article/S0892-1997(12)00035-5/abstract). NOT READ beyond the search
  snippet. Relevant only as the standard s/z-ratio MPT design (sustain /s/, then /z/, each on one
  breath, compare durations) that Eckel and Boone's original s/z ratio idea is built on. I could
  not obtain or confirm the original Eckel & Boone citation itself (search returned only citing/
  derivative papers, not the primary 1981 paper); this is NOT ESTABLISHED as sourced here.

- **"Revisiting Sustained Phonation Time of /s/, /z/, and /a/"**, *Journal of Voice*, published
  online ~2020 (jvoice.org / ScienceDirect record: S0892-1997(20)30104-1; a PubMed ID search for
  32711946 returned a 429 error and could not be confirmed as the right ID). I was **not able to
  open the abstract** (repeated 429 errors from ScienceDirect, PubMed and ResearchGate). Title and
  existence only are established; content NOT READ. Flagging this as a likely relevant critique/
  re-examination of MPT-type sustained-phonation tasks, but I cannot report what it actually
  concludes.

- **"Maximum Duration of Sustained /s/ and /z/ and the s/z Ratio With Controlled Intensity"**,
  ScienceDirect record S0892-1997(05)00061-5. Title only, NOT READ (not opened this session).

### 1.3 Phonation quotient extended to connected speech (closest published critique of the
sustained-vowel task's ecological validity for anything other than isolated held tones)
- **Full citation**: Curtis JA, Jimenez LE, Aberin-Angulo IM, Seidman AY. "Development and Initial
  Validation of Phonation Quotient for Connected Speech: A Low-Cost, Indirect Aerodynamic Measure
  of Phonatory Airflow." *Folia Phoniatrica et Logopaedica*, published online 5 May 2026.
  doi:10.1159/000552368. PMID 42085334.
- **Read as**: abstract and body sections retrieved via WebFetch of the PMC page
  (https://pmc.ncbi.nlm.nih.gov/articles/PMC13331465/); this is closer to a full read than most
  entries here, but still tool-summarised rather than my own read of the PDF.
- **Quoted framing**: "The phonation quotient derived from a sustained vowel (PQ-SV) is a valid,
  low-cost estimate of phonatory airflow but may not reflect the aerodynamic demands of connected
  speech." This is the clearest explicit statement found in this search that a single sustained
  vowel token does not generalise to connected/phrase-level vocal behaviour - directly relevant to
  Dann's design question, though about speech, not singing.
- **Task (their new measure, PQ-CS)**: maximum duration of continuous, uninterrupted repetition of
  the sentence "We were away a year ago" after maximal inhalation, spoken in the person's typical
  voice. PQ-CS = vital capacity (L) / that duration (s).
- **What it measures**: estimated mean airflow rate during connected speech (an indirect,
  low-cost stand-in for spirometric airflow).
- **Automated**: no. Needs a stopwatch/recorder for timing and a handheld spirometer (or a proxy
  such as a balloon) for vital capacity.
- **Reliability/validity found**: PQ-CS vs directly measured mean airflow, r = 0.57 (large effect)
  for the maximal task, r = 0.41 (moderate) for a comfortable-effort version; vital capacity to
  phonation volume r = 0.62; task duration to flow rate r = -0.37. PQ-CS correlated better with
  connected-speech airflow than the traditional sustained-vowel PQ did; the sustained-vowel version
  remained better specifically for maximal isolated-vowel phonation. Validated in N = 30 healthy
  adults only; not yet tested in singers or in voice-disordered speakers.
- **Not singing**: this is speech pathology, not singing pedagogy, and not sung. Included because
  it is the closest thing found to a stated critique-plus-alternative for "sustained vowel doesn't
  capture connected-utterance breath behaviour," which is structurally the same critique that would
  apply to Dann's proposed test relative to a plain MPT.

### 1.4 "Toward Improved Ecological Validity..." (voice-quality acoustics, not phonation time)
- ScienceDirect record S0892-1997(09)00003-4, title "Toward Improved Ecological Validity in the
  Acoustic Measurement of Overall Voice Quality: Combining Continuous Speech and Sustained Vowels."
  NOT READ (429 error on fetch). Noted only because the title itself argues for combining sustained
  vowel and connected-speech tasks rather than relying on either alone, which is again adjacent to
  Dann's question, but I could not confirm content.

---

## 2. Singers and maximum phonation time / breathing under performance load

### 2.1 Musical theatre performers, MPT under combined singing+dance load
- **Full citation**: Sliiden T, Beck S, MacDonald I. "An Evaluation of the Breathing Strategies and
  Maximum Phonation Time in Musical Theater Performers During Controlled Performance Tasks."
  *Journal of Voice*, 31(2), 253.e1-253.e11, 2017. doi:10.1016/j.jvoice.2016.06.025.
- **Read as**: abstract-level summary via WebFetch of the ScienceDirect abstract page. NOT the full
  text.
- **Task**: 20 professional musical theatre performers monitored (telemetric respiration/HR) across
  three conditions: singing alone, dancing alone, singing while dancing. MPT ("ability to sustain
  unbroken notes") measured immediately before and after each task.
- **What it measures**: MPT (seconds), oxygen uptake, heart rate, as physiological load indicators.
- **Automated**: not stated as automated; appears to be manually timed alongside telemetric
  monitoring equipment.
- **Finding quoted by the fetch summary**: "MPT reduced by 65.2% for singing while dancing,"
  dropping from about 20.4 s (rest) to about 7.1 s (after singing while dancing).
- **Gap**: the fetch could not recover the exact vowel, pitch, tempo or dynamic used for the
  "unbroken notes" MPT probe, or any reliability statistic. This is exactly the kind of exact
  pattern Dann is asking about, and it is NOT ESTABLISHED here what pattern they used - the
  citation is real, the number is real, the pattern is not confirmed.

### 2.2 Watson & Hixon, classical (opera) singers - foundational respiratory kinematics
- **Full citation**: Watson PJ, Hixon TJ. "Respiratory Kinematics in Classical (Opera) Singers."
  *Journal of Speech and Hearing Research*, 28(1), 104-122, 1985. doi:10.1044/jshr.2801.104.
- **Read as**: abstract/summary via WebFetch. NOT full text.
- **Task**: six adult male baritones with extensive classical training. Rib cage and abdominal
  anteroposterior diameter measured during quiet breathing, speaking and singing "activities." The
  fetch summary states no specific song or exercise was named in what was retrieved - singers
  performed unspecified singing tasks, not a standardised fixed pattern. NOT ESTABLISHED whether
  the original paper specifies an exact piece; I could only confirm that the retrieved summary did
  not contain one.
- **What it measures**: lung volume and rib-cage/abdomen volume displacement, to infer which
  structures drive inspiration vs expiratory pressure regulation during singing.
- **Automated**: no (kinematic instrumentation of the era, magnetometers/strain gauges, not audio).
- **Key finding quoted**: "Subjects' descriptions of how they thought they breathed during singing
  bore little correspondence to how they actually breathed" - relevant to Dann only as a caution
  that self-report about breath habits is unreliable, supporting an objective/software-timed
  measure over asking singers to self-rate their phrase capacity.

### 2.3 Sundberg (and Leanderson & Sundberg) - breathing during singing, with named exercises
- **Source A**: Sundberg J. "Breathing behavior during singing." STL-QPSR (KTH Dept. of Speech,
  Music and Hearing, Quarterly Progress and Status Report), 33(1), 49-64, 1992. PDF:
  https://www.speech.kth.se/qpsr/1992/1992_33_1_049-064.pdf.
- **Read as**: summarised via WebFetch of the PDF (not a personal close read, but the tool had
  access to the actual PDF text, so this is closer to primary-source than the abstract-only
  entries above).
- **Tasks named** (these are the closest things in this whole search to "exact patterns," so
  quoting the fetch tool's extraction in full):
  - alternating rising and falling octaves
  - ascending and descending chromatic scales
  - ascending triads on the tonic chord followed by descending triads on a dominant seventh
  - staccato and legato pitch exercises
  - pitch jumps with rapid subglottal-pressure changes
  - a descending scale repeating the syllable **"pi:us"** on each tone, described as a
    "warming-up exercise"
  No single vowel, tempo or dynamic was standardised across all of these; the fetch tool
  explicitly noted "No specific vowel, tempo, or pitch range restrictions were standardized
  across all tasks."
- **What it measures**: subglottal pressure (via oesophageal catheter), EMG of cricothyroid muscle,
  transdiaphragmatic pressure, fundamental frequency - not phonation time as such, and not
  breath-to-first-breath duration.
- **Automated**: no; invasive physiological instrumentation, not audio-only.
- **Finding**: two diaphragm strategies identified ("flaccid" vs "co-contracting"); not a
  phrase-length or MPT finding.
- **Note**: this Sundberg 1992 QPSR report is distinct from Leanderson & Sundberg 1988 (below);
  I am not certain from this search whether the "pi:us" descending-scale exercise recurs in both,
  since I could not read the 1988 paper's methods.

- **Source B**: Leanderson R, Sundberg J. "Breathing for singing." *Journal of Voice*, 2(1), 2-12,
  1988. doi:10.1016/S0892-1997(88)80051-1. **NOT READ** - ScienceDirect abstract could not be
  retrieved (fetch returned only citation metadata, no abstract text, on this attempt). Existence
  and citation confirmed; content NOT ESTABLISHED from this session.

### 2.4 Salomoni, van den Hoorn & Hodges - objective breathing patterns, classical singers, with a
named song task and reliability data
- **Full citation**: Salomoni S, van den Hoorn W, Hodges P. "Breathing and Singing: Objective
  Characterization of Breathing Patterns in Classical Singers." *PLOS ONE*, 11(5), e0155084, 2016.
  doi:10.1371/journal.pone.0155084.
- **Read as**: open-access; summarised via WebFetch of the actual PLOS ONE article page (closer to
  a full read than most sources here, since the article is open access and the fetch pulled real
  body text, but still tool-mediated, not read line by line by me).
- **Task, quoted**: "Singing the traditional Australian song *Waltzing Matilda*, which was well
  known to all participants. Classical singers sang this song in operatic style, whereas control
  participants sang in the traditional folk style," plus "Singing a piece of the participant's
  choice (1-2 minutes), which for the classical singers involved an operatic piece," plus one
  minute of quiet breathing as a baseline. No fixed vowel, tempo, pitch pattern, or dynamic marking
  was imposed - this is a real song, not a constructed vocalise, and not a legato scale drill.
- **Participants**: seven professional classical singers vs four untrained controls.
- **What it measures**: respiratory inductance plethysmography (rib cage + abdomen bands),
  pneumotachograph airflow, and a headset microphone used "to assist identification of event
  timings in the respiratory data" - i.e. audio was used to mark phrase/breath boundaries, but
  analysis of the kinematic data itself was principally manual/instrument-based, not an
  audio-only automated system.
  - **This is the closest finding in this whole search to Dann's proposed instrument**: a
    microphone-timed identification of breath events during a sung task, even though the
    kinematic measurement itself needs belts and a pneumotachograph, not just audio.
- **Reliability finding, quoted**: "Acceptable repeatability across repeated trials (ICC > 0.75)"
  and "Intra-subject consistency in respiratory kinematics confirmed across repetitions." This is
  the strongest reliability statement located in this search for any objectively measured
  singing-breath variable, though it is about the respiratory kinematic pattern, not about
  phonation-time-to-first-breath specifically.
- **Key finding**: classical singers show far greater abdominal contribution to lung volume during
  singing (~35%) than untrained singers (~14%), greater asynchrony between rib cage and abdomen,
  and a consistent pre-phonatory inward abdominal movement not seen in untrained singers.

---

## 3. Voice range profile / phonetogram protocols

- Searches turned up multiple phonetogram studies and a "Voice Range Profile - A Shortened
  Protocol" pilot study (Journal of Voice, ScienceDirect record S0892-1997(21)00146-6). **NOT
  READ** - only the title was retrieved; I did not fetch the abstract this session, so I cannot
  say whether it includes any timed sustained-singing component as part of a "shortened protocol."
  Phonetograms as a class measure the full pitch/loudness range a singer can produce (usually each
  pitch/dynamic cell sustained briefly), not continuous phrase length across register transitions,
  so on the search evidence gathered, VRP protocols answer a different question from Dann's
  (dynamic and pitch range capability, not endurance/phrase length). This is an inference from the
  general VRP literature encountered, not a confirmed reading of every VRP paper.

---

## 4. Singing Voice Handicap Index (SVHI) and related self-report instruments

- **Source**: Singing Voice Handicap Index (SVHI), various validation papers found (Cohen et al.,
  "Creation and Validation of the Singing Voice Handicap Index," and later normative/systematic-
  review papers). I read the PDF of the instrument itself
  (https://www.nyvoice.org/forms/singing%20voice%20handicap%20index.pdf) via WebFetch.
- **Finding**: SVHI is a self-report questionnaire (Likert-scored statements), not a timed
  physical task. The only breath-related item found was "I have trouble controlling the breathiness
  in my voice," which is about perceived voice quality, not phrase length or breath capacity. **No
  timed phonation or breath-duration task appears in the SVHI.** This rules out the SVHI as prior
  art for Dann's specific instrument, on the evidence read.
- The underlying validation papers (Cohen, Statham et al.) were found only as titles/links and were
  NOT READ in full this session.

---

## 5. Pedagogical exercises named in the literature for phrase length / breath management

- **Messa di voce**: repeatedly named across pedagogy sources (Wikipedia, Modern Vocalist World,
  an Ohio State ETD "The Messa di Voce and Its Effectiveness as a Training [tool]," and others) as
  a breath-management and dynamic-control exercise, but in the one primary research source that
  actually specified a pitch for it in this search (the NATS ICVT7 Collyer handout on breathing
  science), it appears as a **research probe**, not a pedagogical drill with a stated protocol:
  quoted from the handout, "Consider the lung volumes used by 10 highly trained female singers
  singing a messa di voce on B4." I could not confirm the underlying primary study this handout is
  citing (author/year not recoverable from the fetched excerpt), so the B4 messa-di-voce detail is
  attributable only to the handout, not to a verified original paper. The Ohio State DMA/ETD thesis
  on messa di voce as a training tool was found by title only and NOT READ.
- **Sustained scales / arpeggios**: found named informally in teaching-oriented pages (School of
  Rock, Musicians Institute, Cyber-Tone, Weekly Warm-Up, NumberAnalytics) as generic "breath
  support" exercises, but none of these is a peer-reviewed source, and none states an exact
  fixed pattern (notes, vowel, tempo, dynamic) as a *measurement* protocol - they are teaching
  tips, not assessment instruments. I am treating these as NOT ESTABLISHED as prior art for an
  assessment protocol, only as evidence that "sustained scale," "arpeggio," and "messa di voce" are
  the exercise types the pedagogy literature associates with phrase-length/breath work in general.
- A PubMed-listed paper, "Rethinking Breath Management in Voice Pedagogy: A Paradigm Shift from
  Inspiratory Capacity to Expiratory Control" (PMID 42463357), looked directly relevant to Dann's
  question by title, but I was **unable to retrieve its abstract** (PubMed and Europe PMC fetches
  both failed - one blocked by robots.txt, one returned only page chrome with no abstract text).
  Title and PMID confirmed; content NOT ESTABLISHED.

---

## 6. Software / automated breath-and-phrase timing from audio

This is the section closest to "has anyone built the actual instrument."

### 6.1 Research systems that detect breaths in sung audio (music information retrieval)
- **Full citation**: Nakano T, Ogata J, Goto M, Hiraga Y. "Analysis and Automatic Detection of
  Breath Sounds in Unaccompanied Singing Voice." Proceedings of the 10th International Conference
  on Music Perception and Cognition (ICMPC10), 2008. PDF:
  https://staff.aist.go.jp/m.goto/PAPER/ICMPC2008nakano.pdf.
- **Read as**: summarised via WebFetch of the actual PDF (closer to primary-source than most
  entries above, but still tool-mediated).
- **Task/data**: 128 minutes of unaccompanied singing from 18 vocalists (1,488 manually-marked
  breath events) used to characterise breath-sound acoustics; then a Hidden Markov Model detector
  (MFCC, delta-MFCC, delta-power features) tested on 27 unaccompanied song excerpts. This is a
  **fully audio-based, automated breath-detection system** - the closest piece of prior software
  found to the breath-detection component Ilya's intake test would need, although it is built for
  general singing/song material, not for a fixed pedagogical legato exercise, and it detects
  breaths within a performance rather than timing "seconds to first breath" as an outcome metric.
- **What it measures**: presence/timing of breath-noise events in sung audio; spectral
  characteristics of breath sounds (found consistent within a song, peaking near 1.6 kHz in male
  and 1.7 kHz in female singers); breath event durations ranging 50-1225 ms.
- **Automated**: yes, HMM-based detector.
- **Reliability/accuracy found**: recall/precision of 97.5% / 77.7% on held-out unaccompanied song
  samples. This is the strongest automated-detection accuracy figure found in this search, and the
  most directly reusable piece of prior art for the audio-engineering side of Dann's tool - though
  again it detects breath noises, it does not itself define or validate a fixed sung task for
  eliciting them.
- Not evaluated: whether such a detector generalises to a home/laptop microphone under Ilya's
  actual recording conditions, or to a controlled legato-scale task rather than free song material.

- **Related, not read in full**: Ruinskiy D, Lavner Y, "An Effective Algorithm for Automatic
  Detection and Exact Demarcation of Breath Sounds in Speech and Song Signals," IEEE Transactions
  on Audio, Speech, and Language Processing (IEEE Xplore document 4100696). Repeated fetch attempts
  returned 429 errors or empty content; title and existence confirmed (it explicitly covers both
  speech and song signals), content and reported accuracy NOT ESTABLISHED from this session.

- A separate unsupervised breath-segmentation paper was found and read in summary
  ("An unsupervised segmentation of vocal breath sounds," arXiv 2304.03758, via ar5iv), but on
  inspection this is a **clinical/respiratory-medicine paper** (60 subjects, hospital recordings,
  asthma-relevant breath-phase segmentation from mouth-recorded breathing, not singing or
  performance). Not singing-relevant; noted only to record that it was checked and ruled out.

### 6.2 Commercial / consumer software
- **Singing Carrots** (singingcarrots.com), a commercial online vocal-training platform, lists a
  **"Sustain & Breath training"** tool in its practice menu (mentioned on
  https://singingcarrots.com/voice-analysis). I could not load the tool's own page directly (404 on
  the URL I guessed; the exact live URL was not recoverable via search in the time available), so I
  **cannot confirm** what pattern it uses, whether it is a single sustained pitch or a scale, what
  vowel or dynamic is specified, or whether breath detection is microphone-automated or is a manual
  stopwatch/self-timed exercise. This is the one commercial product found in this search whose name
  directly suggests the same territory as Dann's proposed feature, but its actual task design is
  **NOT ESTABLISHED** from what I could access.
- **VoceVista** (vocevista.com) and **Sygyt Software** (sygyt.com) are established singing-voice
  analysis/visualisation packages (spectrogram, EGG, etc.) found in search results, but nothing in
  the search results specifically described a timed legato-phrase or breath-to-first-breath
  feature in them. Not confirmed either way; would need direct product-page investigation to rule
  in or out.
- No other commercial app (vocal-pedagogy or general fitness/spirometry) was found in this search
  that explicitly times "seconds of continuous singing to first spontaneous breath" on a fixed
  legato pattern.

---

## Summary table of exact patterns found (source -> pattern, verbatim where quoted)

| Source | Pattern (as found) | Vowel/text | Notes |
|---|---|---|---|
| Iowa Head & Neck Protocols (MPT) | sustain "ah" | /a/ | not sung, no pitch/dynamic specified in what was retrieved |
| Curtis et al. 2026 (PQ-CS) | repeat sentence to exhaustion after max inhale | "We were away a year ago" | speech, not song |
| Sundberg 1992 STL-QPSR | descending scale, syllable on each tone | "pi:us" | described as a warm-up exercise; also octave leaps, chromatic scales, triads, staccato/legato exercises, no single standardised vowel/tempo/dynamic across all |
| Sliiden, Beck & MacDonald 2017 | "unbroken notes" MPT, pre/post singing-and-dance tasks | not recovered | exact notes/vowel/tempo NOT ESTABLISHED from abstract |
| Salomoni et al. 2016 | full song, "Waltzing Matilda," plus a freely chosen piece | song lyrics, operatic style for trained singers | not a constructed vocalise; mic used to time breath/phrase events but analysis mainly from belts/airflow, not audio alone |
| NATS/Collyer handout (uncited primary source) | messa di voce | on B4 | primary study not identified/verified |
| Nakano et al. 2008 (ICMPC) | free/whole songs, unaccompanied | not fixed | this is the automated breath-detector, not a fixed elicitation task |

---

## NOT ESTABLISHED

- No source found in this search states a published, standardised **legato scale climbing through
  register transitions and back, repeated without stopping, on one vowel, at a set tempo and mezzo
  forte, timed to first spontaneous breath** - the specific instrument Dann describes. Nothing
  found matches this design closely enough to call it prior art in more than a loose, adjacent
  sense (see section 6.2's Singing Carrots caveat and section 2's exercise lists).
- Whether Singing Carrots' "Sustain & Breath training" tool uses a scale, a single sustained note,
  or something else; whether it is microphone-automated; what vowel or dynamic it specifies. Not
  established - could not load the product page.
- The exact content, methods and any reliability/validity statistics of: Leanderson & Sundberg 1988
  "Breathing for singing"; the "Revisiting Sustained Phonation Time of /s/, /z/, /a/" 2020 paper;
  the "Maximum Duration of Sustained /s/ and /z/..." 2005 paper; "Toward Improved Ecological
  Validity..." 2009 paper; "Rethinking Breath Management in Voice Pedagogy..." (PMID 42463357); the
  Ruinskiy & Lavner IEEE breath-detection paper; the PhenX MPT protocol document; the original
  Eckel & Boone s/z ratio paper; the "Voice Range Profile - A Shortened Protocol" pilot study; the
  Ohio State ETD on messa di voce as a training tool; the SVHI primary validation papers beyond the
  instrument itself. All of these exist and are real, citable works as far as titles/DOIs/PubMed
  IDs go, but their content could not be opened or was not read this session, mostly due to
  ScienceDirect/PubMed/Europe PMC returning 403/429/robots-blocked responses repeatedly.
- Whether VoceVista or Sygyt Software include any timed-phrase or breath-to-first-breath feature.
  Not established either way.
- Any test-retest reliability figure specifically for "seconds of continuous singing to first
  breath" as a construct (as distinct from spoken MPT reliability, or the Salomoni kinematic ICC).
  No such figure was found in this search.
- Whether any of the above authors (Thomasson, Watson, Hixon, Leanderson, Collyer, Sundberg,
  Salomoni) has explicitly proposed a standardised *assessment* task (as opposed to a research
  probe used once in one study) for singers' phrase-length capacity. On the evidence gathered, the
  answer looks like "no" but this is an absence-of-evidence finding, not a confirmed negative -
  several likely-relevant papers (Leanderson & Sundberg 1988 chief among them) could not be opened.
