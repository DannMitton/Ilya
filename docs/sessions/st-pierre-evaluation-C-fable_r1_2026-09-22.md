# C. What Ilya should take from St-Pierre, and from the sources she set aside

Written 2026-09-22 by Fable against `brief-C-fable-evaluation.md`. Every page below is a printed page, confirmed by grep in `stpierre-paged.txt` (PDF page = printed + 11) unless marked otherwise. Every recommendation is mine; Dann rules.

What I read: the two extractions (`out/A-chapters-3-4.md`, `out/B-sources.md`), the r2 proposal, the r1 memo, the Insights strings, and, in the dissertation itself, the passages the extractions pointed to plus seven Appendix E grids (pp. 243 ff.). Not read: her Chapters 1 and 2, and none of the sources she cites.

---

## The one finding that organizes the rest

**Her grid and her prose disagree, and her prose is the better instrument.**

- *"Ô Canada, mon pays, mes amours"* (Labelle). Grid score 6, Elementary, with no mark against range, tessitura, or long sustained notes (Appendix E, 4.4.1, PDF 254 ff., confirmed). Her prose on the same song: *"The strong ending of the song with its two ascending lines in the passaggio area of the voice might represent a challenge for beginning singers. A degree of vowel modification may be necessary to keep a full resonance on the u vowel of amours on F5"* (p. 109, confirmed).
- *"L'âme d'un ange"* (Contant). Grid: no mark against tessitura (Appendix E, 4.5.14, confirmed). Prose: *"requires the singer to possess a full and resonant low-middle range, given the tessitura of the vocal line"* (p. 168, confirmed).

Her tessitura element is defined against McKinney's per-voice-type "ideal" ranges (pp. 74-75, confirmed). Applied, it missed the two events her own ear reported. That is the case against importing her thresholds, made by her own appendix, and it is the case for what Ilya already does: measure the singer, not the fach. It also says where to look for what transfers. **Not in the grid. In the sentences.**

---

## Q1. What genuinely makes Ilya better for the singer

Three recommendations, ranked. Each passes all three refusals: none is about the pianist or the reader, none pronounces on the singer, and none has a shape Dann has ruled against. Each is checked against the rulings in the brief.

### R1. Share of singing time on each side of the singer's passaggi, for the piece and for each phrase

**What the singer would see** (register of the current strings):

> Of your singing time in this piece, 62% sits above your secondo passaggio, 30% between your passaggi, and 8% below your primo.

and, on a phrase:

> This phrase sits high for you: 9 of its 12 seconds are above your secondo passaggio.

**The metric.** Sounding duration per sung note, at the singer's tempo, repeats taken, bucketed against the two typed passaggi. **Ilya computes every input now** (durations, tempo, repeats, the typed passaggi). The bucketing and the shares are arithmetic. The per-phrase form needs R2.

**Her source.** Her definition of tessitura is a majority-of-pitches definition anchored to the passaggi: *"Tessitura describes the range in which the majority of the pitches of a vocal part lie... A high tessitura is associated with a vocal part that lies mostly around the secondo passaggio and higher for women voices, and above the primo passaggio for male voices"* (p. 74, confirmed). Her rationale for why the high zone is demanding is Nix (low first-formant vowels need *"significant modification in the upper octave of the female voice"*, her p. 74, citing Nix, *Journal of Singing* 58/3, p. 218; **her report, I have not read Nix**) and Miller (bridging registers *"by means of vowel modification... and by adjustment in breath-management levels"*, her p. 74, citing Miller 2008, p. 8; her report). Her rationale for the low zone: *"A low tessitura is challenging for all voice types since it sits lower than the comfortable tessitura of the given voice, making it challenging to maintain weight and rich resonance, especially for young voices"* (pp. 74-75, confirmed).

**Why this and not her thresholds.** Her thresholds (E5 / F#5-G5 / A5 for a soprano, p. 75) are fach norms and are out under the 2026-09-16 ruling. But her *definition* needs no fach: it needs the singer's own passaggi, which Ilya already holds. Ilya replaces "mostly" with a measured share. This is the exact shape of Dann's model sentence in the brief ("70% of it is above your secondo passaggio"). It is a forecast, and it names its metric in the sentence.

**What it replaces or repairs.** `insights.fit.crossingsCount` counts crossings of each passaggio. A count says how often the line crosses; it does not say which side it lives on. Her definition says the side is the thing. The share should sit beside the count, or replace it. It also makes the existing `insights.fit.tessitura` row (Pacheco) legible: Pacheco gives the band; this says where the band sits relative to the singer's registers.

**Refusals.** (a) About the singer's own passaggi and time. (b) States a share, not a verdict. (c) Nothing ruled against; it is Dann's own model sentence.

### R2. Phrase length in seconds at the singer's tempo, longest first

**What the singer would see:**

> The longest unbroken phrase here runs 14 seconds at your tempo, from bar 22 to bar 26.

With R1 attached, the phrase sentence gets its second clause.

**The metric.** A phrase is the run of sung notes between rests, breath marks, and caesuras. Duration is the sum of sounding durations at the singer's tempo. Ilya computes the durations and parses breath marks and caesuras; the r2 proposal reports that nothing uses them yet. **New work:** segmentation, and rests as boundaries. (The r2 proposal worried that breath marks are rare in real scores. Rests are not rare, and her own prose reads rests as breath: *"Lavallée's vocal line is accessible, as he places eighth note rests in between phrases for breathing"*, p. 138, confirmed. Segment on rests first; marks refine.)

**Her source.** *"Long phrases and long sustained notes (measured in seconds) add to the difficulty of a piece, as they require a high degree of breath-management technique from the singer"* (p. 76, confirmed), citing Vennard 1967, p. 34 (her report). This is the only element in her grid she measures in time rather than by count, and time is Ilya's native unit.

**What it does not include.** She weights the phrase by dynamic and by piano texture (*"a sustained note at a mezzo forte dynamic level was judged minimal, whereas a piece containing long and lyrical phrases at a ff dynamic level with a thick piano texture was judged extensive"*, p. 76, confirmed). Ilya parses neither. The sentence therefore names seconds and position only, and should not imply more. Dynamics are a later weight (see Q3).

**Refusals.** (a) Breath is the singer's. (b) A length is a measurement. (c) Not ruled against; Dann's model sentence is phrase-shaped.

### R3. Degree, not only direction, on the range row

**What the singer would see** (where `insights.flag.above` now prints `Above`):

> Above, by 2 semitones, for 3 seconds of singing.

**The metric.** Distance in semitones between the piece's extreme and the typed range limit; the sounding time spent outside. **Ilya computes both inputs now.** Subtraction.

**Her source.** Her reason for three degrees rather than a tick: *"a score that contains only one unprepared modulation will not receive the same number of points than a score that contains multiple"* (p. 72, confirmed, alongside *"a wide range... may be judged minimal if it is just above one octave and a half, moderate if it is approximately two octaves, and extensive if it is more than two octaves"*). Ilya does not need her three words; it has the two numbers.

**Refusals.** (a) The singer's range. (b) A distance and a duration, not a grade. (c) Not ruled against; it is the same instinct as the phonation-time ordering Dann already chose.

### Not a fourth recommendation, but a note on the denominator

Total singing time at the singer's tempo (the r2 proposal's "ninety seconds of that is you singing") is the denominator of every share in R1 and R3. It should print once, as the reference number, and not as a lead. See Q3 on performance length.

---

## Q2. Where she justifies a qualitative statement with an identifiable measure

**The pattern, named.** Her sentence shape is: *qualitative word* + *"as" / "given" / "since"* + *a feature the reader can locate in the score*. The located feature is always one of five kinds: a pitch, a bar, a vowel or syllable, a count, or a duration. Examples, all confirmed:

- *"better suited to lower voices, **as** several phrases begin on middle C or lower"* (p. 107): claim, then a pitch and a unit (phrase openings).
- *"A degree of vowel modification may be necessary to keep a full resonance on the **u vowel of amours on F5**"* (p. 109): claim, then vowel, word, pitch.
- *"Care should be taken to avoid emphasizing the **mute e of langage set on A5 (bar 33)**"* (p. 114): claim, then syllable, pitch, bar.
- *"Lavallée's vocal line is accessible, **as** he places eighth note rests in between phrases for breathing"* (p. 138): claim, then a note value and its function.
- *"requires the singer to possess a full and resonant low-middle range, **given** the tessitura of the vocal line"* (p. 168): claim, then the measure.

In the grid the same shape is formalized: each element is *a named countable unit + a stated threshold + a level word*, and she is honest that the threshold is *"judged"*, not derived (*"a vocal part with two or three large intervals... was judged minimal"*, pp. 75-76; *"approximately 52 or 120 BPM was judged minimal"*, p. 77; *"approximately 100 words was judged minimal"*, p. 80; all confirmed).

**What Ilya should imitate.** The sentence shape, with Ilya's unit. Her prose locates by pitch and bar; her grid counts occurrences; her one time-based element (phrases, in seconds) is the one that matches Ilya. So the Ilya form of her pattern is: *qualitative word* + *because* + *a share of singing time, or a duration, or a pitch and a bar*. R1 and R2 are that form.

**What the pattern shows by its absence.** Where the clause is missing, her sentence becomes a verdict: *"'Andalouse' is most appropriate for the advanced singer"* (p. 150, confirmed); *"'L'âme d'un ange' displays a musical language and poetry that are most suitable for advanced musicians"* (p. 168, confirmed). Those are the sentences Insights refuses. The rule for Ilya's page falls out of her own text: **a qualitative word may stand only when its "as" clause is printed beside it.**

---

## Q3. What looks useful and is not

**From the r2 proposal's adoptions:**

- **Interval leaps, scored by where they land.** Refuse. Her only rationale is one unsourced sentence (*"vocal fold coordination with ideal breath pressure may become more difficult"*, p. 75, confirmed; agent A found no citation, and I found none). Under the clarity ruling, a finding Ilya cannot justify from the literature does not go on the page. And the landing-note version duplicates findings Ilya already prints: a leap landing above the range is already `finding.rangeAbove`; a leap landing at the passaggio is already `finding.passaggio`. Her own prose treats leaps as a legato matter (*"the interval leaps require some attention in order to maintain a legato phrasing"*, p. 109), which is intervention, not insight.
- **Melisma as a named demand.** Refuse for the same reason: a melisma matters to fit only where it sits, and where it sits is already flagged. Her ornamentation element is a count for everyone (p. 76).
- **Performance length as the lead** (r2 addendum). Demote, do not refuse. She did adopt it herself, for all 22 songs (*"Length: ca. 4'20"*, p. 92; confirmed for every entry by agent A; her stated practice at p. 85, confirmed). But her stated use for it is programming: *"The performance length of a piece can facilitate programming of recitals, voice competitions, and voice examinations"* (p. 66, confirmed; again at p. 87). That is not Insights' question. Singing time earns its place as the denominator of R1 and R3, printed once.
- **Degree not direction.** Keep (R3).
- **The phrase.** Keep (R2), with rests as the primary boundary rather than breath marks.

**From the r2 proposal's refusals, which I uphold, with one adjustment:**

- **The summed grade.** Refuse. Her own caveat is the reason (*"a piece with a score of 16 may not be as challenging to perform as a piece with a score of 24; however, both pieces are categorized as intermediate level"*, p. 82, confirmed).
- **Her per-voice-type tessitura thresholds.** Refuse, and now with evidence from her own application (the two songs above). Her *definition* transfers; her *numbers* do not.
- **Harmony, text difficulty, piano texture and virtuosity, extended technique, through-composed length, tempo thresholds, articulation counts.** Refuse. About the musician learning the piece, or the pianist, or the reader; not the voice. Slow tempo matters to the voice only as longer phrases, which R2 measures directly in seconds.
- **Dynamics** (re-opened by the standing instruction). Not on its own. Her only use of dynamics that bears on the voice is as a weight on the phrase element (p. 76). Worth parsing only after R2 exists and only as its modifier. Her separate "extended dynamics" count (p. 77) is an expressive-demand count and does not bear on fit.
- **The piano does not play the entrance note** (r2's borderline). Not for Insights. It is about the singer, and it is computable, but it is a pitch-finding demand, which is musicianship, not voice fit. If Dann wants it, it belongs on a different surface.

**From the r1 memo:**

- **Nix as a second citation for `finding.crossing`.** Not as reported. What she quotes from Nix is about the *zone above* the crossing in the female upper octave, where the low-fR1 vowels need modification (p. 74). The crossing string describes the meeting point. Citing Nix there would attach him to a claim he is not reported as making. He belongs to R1 and to Q5 below. (Her report; Nix unread.)

**Her diction method.** Her annotation method is: underline the words where a rule applies, footnote the exceptions (pp. 89-90, confirmed by agent A). Ilya's timbre-shift findings already do the equivalent for Russian. Nothing to add.

**Score errors as a "scholarly annotation"** (r2). True and inert. It changes nothing the singer sees.

---

## Q4. Which of her sources Dann should open next

Ranked. Each expectation is mine, not hers; I have read none of these.

1. **Nix, "Criteria for Selecting Repertoire," *Journal of Singing* 58, no. 3 (2002): 217-221.** Pointed to at her pp. 61 (fn 133), 74 (fn 143), 178 (fn 248); all confirmed. She took three sentences from five pages. *I expect* a teacher's checklist of what to look for in a score before assigning it, including the vowel-on-pitch and consonant-on-pitch criteria she quotes and probably tessitura and phrase criteria, several of which Ilya could compute per singer. It is the source most likely to hold justification language for R1 and for the Q5 correction to the crossing string. Five pages; the cheapest open on this list.
2. **Hopkin, *Songs for Young Singers* (2002).** Her p. 70, confirmed. She reports seven scored values including *phrasing* and reports his melodic-contour scoring in full, but not his phrasing criterion. *I expect* a stated, possibly numeric, phrasing criterion, which would be a second source for R2 beside Vennard. Her list of what Hopkin omits (p. 70) also tells you what he includes.
3. **Arneson, *Literature for Teaching* (2014).** Her pp. 70-71, 80; confirmed. Four rubrics, 1-4 or 1-5, *"lowest number... beginning skills, and the highest number to advanced skills"*. *I expect* rubric rows for range, tessitura and phrase that state the measure at each level, which is the Q2 pattern in a second author's hand. Caution: his scale grades skills, which is the singer, so take the measures and not the levels.
4. **McKinney, *The Diagnosis and Correction of Vocal Faults* (2005), pp. 110-111.** Her pp. 74-75, confirmed. *I expect* the argument for why a sustained wrong tessitura produces faults, which is the justification Ilya would need to say anything about time below the primo passaggio (Q5, item 3). The per-fach ranges around it are out; the mechanism may not be.
5. **Schiller, "A Performer's Guide to Works for Soprano Voice by Canadian Women Composers" (DMA, Florida State, 2001).** Her pp. 69-70 and 82; confirmed. A soprano's guide with an explained grading system, and her quoted position is Dann's: *"the number of years of study and the general range, although possible indicators, can in no way provide comprehensive methods of evaluating technical proficiency and vocal development"* (p. 69, confirmed). *I expect* a treble-voice account of what range and tessitura do not capture, which is the perspective the brief asks me to weigh up. Lower confidence than the four above.

Not ranked: Vennard (Dann will own it) and Miller 2008 (low-voice, Dann's own field). Manifold's MA thesis on French-Canadian song pedagogy (agent B flagged that she never engaged it) is about her question, not Ilya's.

---

## Q5. Where her treble-voice perspective corrects a low-voice assumption in the current strings

Each item names the string, the assumption, her page, and the correction. Corrections are mine.

1. **`insights.finding.crossing`**: *"Your {vowel} meets your first resonance here, so the tone will want to turn full and heady, toward a whoop."* The assumption: the crossing is a spot, and the consequence is a timbre event at that spot. That is a low-voice picture, where the closed vowels meet fR1 near the top of the range. For a treble voice the closed vowels /i/, /u/, /e/ meet fR1 in the middle of the voice, and everything above the meeting is the demand: *"require significant modification in the upper octave of the female voice"* (her p. 74, citing Nix, her report). For a soprano the zone above the crossing can be most of the piece, and singing there is her ordinary upper voice, not a thing the tone "wants" to do. Correction: keep the spot finding, and add a share: *"Your /u/ sits above its first resonance for 40% of its singing time in this piece; up there the vowel will want to open."* This is R1's method applied to the measured resonances instead of the typed passaggi. The word "whoop" is a low-voice teacher's word for that timbre (the r1 memo says the string is framed from Bozeman; I have not checked Bozeman); it should not describe a soprano's normal register as a drift.
2. **`insights.finding.passaggio`**: *"This falls near your passaggio; expect the turn to want managing."* "The turn" is the language of the male register event at a note. Her framing for women is positional: the secondo passaggio is the floor of the high tessitura (p. 74). For a treble voice the question at a passaggio note is which side the phrase lives on, not whether one note turns. Correction: report the side and the share (R1) beside the note-level finding, and drop "the turn" as the finding's noun.
3. **`insights.finding.tighten` and `insights.finding.turnover`**: both fire only *"at the top of your range"*. There is no low-end finding anywhere in the strings except the containment flag `insights.flag.below`. Her treble reading of the low zone: *"challenging to maintain weight and rich resonance, especially for young voices"* (pp. 74-75), applied in prose at p. 107 (*"several phrases begin on middle C or lower"*) and p. 168 (*"a full and resonant low-middle range"*). Correction: R1's third bucket, *"8% below your primo passaggio"*, is the metric-backed form. A qualitative clause would need a source Ilya has read; McKinney (Q4, item 4) is the candidate. Until then, print the share alone.
4. **`insights.fit.crossingsCount`**: *"{primo} of the primo, {secondo} of the secondo."* Equal weight to both counts. Her definition makes the two passaggi mean different things for different voices (p. 74), and Ilya cannot say which applies without fach. Correction: R1. Shares on each side let the singer or teacher read it without Ilya choosing.
5. **`insights.verdict.fit`**: *"This key seems like a good fit for you."* Reached from range and tessitura containment. Her Labelle example is the warning: range contained, grid 6, and still a low-fR1 vowel on F5 needing modification (p. 109). For a soprano, containment says little about where the closed vowels sit against their resonances. Correction: the verdict should not print when R1's above-resonance share for any vowel is large, or it should carry its "as" clause. This is the charter question more than a treble one; noted because it is the one summarizing sentence on the page.

**A term to check, outside her text.** `insights.findings.remainderOne` and `remainderMany` say *"lighter by phonation mass"*. "Phonation mass" is not a term current in the field; "phonation time" is (maximum phonation time is a standard clinical measure). The brief forbids invented terminology on the singer's page. Recommend *"lighter by singing time"*.

---

## NOT ESTABLISHED

1. **Nix's actual criteria.** Everything attributed to Nix here is her report of pp. 217-218. Whether his list is computable, and whether he says anything about time above the modification point, is unknown until the article is opened.
2. **Vennard, Miller 2008, McKinney, Hopkin, Arneson, Schiller.** All her reports. Pages confirmed in her footnotes only.
3. **Whether Ilya's "crossing" is fo meeting fR1 or a harmonic meeting fR1.** The brief describes it as the vowel meeting its first resonance and I have read it as the fundamental. Q5 item 1 depends on that; if the crossing is defined on a harmonic, the correction changes shape but not direction.
4. **Whether rests survive Ilya's parse as phrase boundaries** and whether the sung-note runs between them match what a singer calls a phrase. R2 assumes so. The r2 proposal's check (count breath marks across Dann's library) still stands, and should add rests.
5. **The "whoop" attribution.** The r1 memo says the crossing string is framed from Bozeman; I have not opened Bozeman and have not verified the term's use there.
6. **Her Chapter 1 and 2**, and the fifteen Appendix E grids I did not open. The two grid-versus-prose divergences above are the two I checked because her prose named a pitch; I did not check whether the pattern holds for the other twenty.
7. **How Dann wants the low-end share justified in words.** R1 prints a number without a claim; any clause about "weight" or "resonance" below the primo passaggio waits on a source Ilya has read.
