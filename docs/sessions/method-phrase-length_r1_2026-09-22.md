# METHOD. Phrase length in seconds, for the singer (r1, 2026-09-22)

**Written by:** an Opus subagent, from `docs/sessions/brief-phrase-length-method_r1_2026-09-22.md`.
**This is a method, not code.** No file under `apps/` or `packages/` was edited. No git write was run.
**Citation forms:** `path:line` read in this run, a named run, a source page with its read status, or NOT ESTABLISHED.

---

## Stage A. Research. What the field says a phrase is, and how long is long

### A.1 Dann's library (searched first)

Searched: every file name in `Voice Pedagogy Library/` (974 files) and `Voice Pedagogy Research/` (213 files) for Vennard, Miller, Doscher, Titze, McKinney, Hixon, breath, phrase, phonation, lung, legato, respiration. Text extracted with `pdftotext` and searched for "phrase", "second", "phonation time", "MPT", "breath renewal".

| Source | Status | What it says about a phrase boundary | Number | Page |
|---|---|---|---|---|
| St-Pierre 2016, dissertation | read in full at the passage | "Long phrases and long sustained notes (measured in seconds) add to the difficulty of a piece, as they require a high degree of breath-management technique." Levels set by dynamic and piano texture, not by a seconds threshold. | none | p. 76 (text file line 3270) |
| St-Pierre 2016 | read at the passage | "he places eighth note rests in between phrases for breathing": a quaver rest read as a breath place. | a quaver rest | p. 138 |
| Vennard 1967, *Singing: The Mechanism and the Technic* | **NOT IN THE LIBRARY.** Only `Vennard_flyer USC.jpg` and Hoch 2017 on his legacy. p. 34 known only through St-Pierre's quotation ("the lungs burn oxygen faster... long phrases are more difficult than they will be when they are more familiar"). | none | p. 34, her report |
| Nix 2002, "Criteria for Selecting Repertoire", JOS 58/3 | read in full | A singer not yet managing breath needs "phrases of various lengths and frequent rests" (p. 218). "Deh vieni": "many extended phrases throughout the middle range at a slow tempo" (p. 219). Singing "at a sufficient volume to 'make' the phrases breath-wise" (p. 220): loudness changes the breath cost. | none | pp. 218-220 |
| Miller 1986, *The Structure of Singing* | searched, passages read | Breath renewal is marked in his exercises by a comma (PDF p. 31, printed p. 10). Quiet breath cycle "about 4 seconds", inspiration "1 second, or slightly more" (PDF p. 41). A sibilant exhalation exercise "should take 40 to 50 seconds" (PDF p. 50): not phonation, not a phrase. Long phrases named as a breath demand (PDF pp. 46, 49, 129, 145), never measured. | 4 s quiet cycle; 1 s inhalation at rest | PDF pp. 31, 41, 50 |
| Sundberg 1993, "Breathing Behavior During Singing", NATS Journal | searched | Uses "breath phrase" as the unit of respiratory control; subglottal pressure must be tailored to pitch and loudness; in staccato, pressure drops to zero in silent segments. No duration threshold. | none | p. 1 of article (text line 29) |
| Morris 2013, dissertation (Accent Method) | tables and discussion read | MPT in young classical singers: /a/ 20.33 s (SD 6.01) and 17.94 s (SD 4.30); /i/ 23.34 s and 18.93 s (Table 2, printed p. 172). "MPT over 15 seconds is normal for adults" (citing Shewell 2009; PDF p. 204). **MPT was "significantly shorter at one octave above modal pitch (p < .01)"** (PDF p. 208). MPT is measured at modal pitch and depended on the recording apparatus. | 15 s adult floor; ~18-23 s singer means | printed p. 172; PDF pp. 204, 208 |
| Gould, *Behind Bars*, via project doc `claude/gould-vocal-engraving-rules_v7` rule 56 | project extraction, not the book | "A breath is a rest written into the rhythm, or an independent mark: tick or comma above the stave." Rule 57: the elision sign forbids a breath. | none | p. 436 |
| Doscher 1992 (QJMTL article), Miller 1966 "Legato", De'Ath 2013 "Phrasal Juncture", Meyer 2026 on Miller | searched | Nothing on phrase boundaries or duration. Meyer 2026 reports Miller on accessory muscles in "long, loud phrases". | none | n/a |
| Doscher, *The Functional Unity of the Singing Voice*; McKinney; Hixon; Titze, *Principles of Voice Production* | **not found in the library** (only Titze articles). | n/a | n/a | n/a |

### A.2 The project

`project_search` "phrase length breath seconds" and "maximum phonation time" returned: Gould rules 56-57 (above); `claude/e19-photograph-path-and-pacheco` §5 (seconds = whole-note units / beat unit x 60 / bpm; "Rests are excluded, which is what makes it a phonation figure rather than a duration figure"); `claude/e20-phonation-aggregation-built-and-validated`. **No prior phrase work exists in project knowledge.** In `docs/sessions/`: the St-Pierre extraction, Nix harvest, Fable evaluation and r2 proposal (all read at the relevant lines this run).

### A.3 The web

| Source | Status | Finding |
|---|---|---|
| Pearce, Müllensiefen, Wiggins, "A comparison of statistical and rule-based models of melodic segmentation", ISMIR 2008 | snippet (a model summary of the full text; not read by me line by line) | On the Essen folksong collection (1,705 melodies, annotated phrase boundaries): Grouper F1 0.66, LBDM 0.63, GTTM GPR2a (rest rule) 0.58. "All of the high-performing rule-based models... make use of a rest or temporal gap rule." Grouper also prefers phrases of "about 10 notes". **Rests are the strongest single boundary cue in the field's own benchmark.** |
| Cambouropoulos 2001, LBDM | snippet only | Boundary strength from changes in interval, inter-onset interval and rest. |
| Salomoni, van den Hoorn, Hodges 2016, PLOS One | snippet (a model summary of the full text) | 7 classical singers, 4 untrained. Inspiration during singing is shorter than in quiet breathing. **No phrase durations in seconds reported.** |
| Frontiers in Psychology 2026, singer and pianist breathing in Lied duos | snippet (a model summary of the full text) | 282 inhalations; singers' breaths split 130 phrase-initial, 152 **phrase-medial**. Singers breathe inside phrases, not only at their edges. No score-position analysis. |
| Thomasson and Sundberg 1997, "Lung volume levels in professional classical singing", LPV 22/2 | **not read** (403, 429) | Title only. |
| Collyer, NATS ICVT7 handout | snippet (a model summary of the full text) | Singers start phrases at about 70-80% vital capacity. No seconds. |
| Speyer et al. 2010, "Maximum phonation time: variability and reliability", J Voice | **not read** (abstract elided, 403) | Title only. |
| Baker, Miles, Allen 2026, "Task instructions significantly affect maximum phonation time", J Voice | snippet (abstract introduction and methods only) | MPT changes significantly with the task instruction given. |

### A.4 What the field gives, in one paragraph

**A phrase boundary is a rest, a breath mark, or a caesura** (Gould p. 436; St-Pierre p. 138; the ISMIR 2008 benchmark). **Nobody found gives a threshold in seconds for a "long" phrase.** St-Pierre says phrases are "measured in seconds" and then grades by dynamic and texture, not by a number (p. 76). The only seconds figures are MPT norms (a sustained vowel at modal pitch, to exhaustion: 15 s adult floor, 18-23 s in Morris's singers), and MPT is **shorter an octave up** (Morris PDF p. 208) and **instruction-sensitive** (Baker 2026). MPT is a clinical maximum, not a phrase norm, and a fixed MPT line would be a population threshold, which Dann ruled out on 2026-09-16. **Loudness raises the breath cost** (Nix p. 220; St-Pierre p. 76; Sundberg 1993); Ilya carries no dynamics on a vocal event: `types.ts` has no dynamic field (grep for "dynamic", run).

**Leap sources met in passing:** St-Pierre p. 75 (interval counts), Nix p. 220 ("several wide leaps"). Out of scope.

---

## Stage B. Analysis. What Ilya's scores actually carry

### B.0 How it was measured (the run)

Ilya's own parser and seams, run read-only from a scratch folder outside the repository (`$HOME/scr/phr/analyze.ts`, not committed): `MusicXmlScoreParser` with the ingestion `mini-dom` (`apps/web/src/lib/shane/ingestion/mini-dom.ts:100`), then `scoreInPerformanceOrder`, `soundingFromNotation`, `secondsFor` and `resolveTempo`. Run under `node --experimental-strip-types` with a resolve hook, **because the repository's `node_modules` carry macOS-native rollup and vitest cannot start in the Linux VM** (run, 2026-09-22; worth a line in `ENVIRONMENT.md`). Raw MusicXML and `.mscx` counts (slurs, marks on rests, `<forward>`, `<backup>`) by a separate python pass over the same files.

**What "Dann's library" could mean here.** His page renders songs from IndexedDB (`ENVIRONMENT.md:3393`), which this run cannot reach. The scores on disk are: the Sunless cycle (01 as he imported it from `~/Downloads`; 02 to 06 as the `.mxl` conversions in `tools/e16-harness/output/*/mxl_extract/score.musicxml`, which are musx-to-MusicXML and OMR products), Gretchen am Spinnrade (`.mscz`, counted raw, since Ilya's MusicXML parser does not read it), and the test fixtures. Not counted: the three `.musx` and one `.mnx` in Downloads.

### B.1 The counts

| Score | Bars | Notes | Rests | Rests of a quaver or less | Breath marks | Caesuras | Fermatas | Slurs in the file (not parsed) | Tempo as the seam resolves it |
|---|---|---|---|---|---|---|---|---|---|
| Sunless 01 (Dann's import) | 18 | 97 | 19 | 16 | 0 | 0 | 0 | 0 | inferred, dotted crotchet 44, band 44 to 74.7 ("Andante tranquillo") |
| Sunless 02 | 12 | 68 | 13 | 9 | 0 | 0 | 0 | 0 | **encoded crotchet 120** on "Andante con moto" |
| Sunless 03 | 41 | 222 | 40 | 30 | 0 | 0 | 0 | 14 | inferred 103.5, band 66 to 112 |
| Sunless 04 | 29 | 116 | 30 | 17 | 0 | 0 | 0 | 7 | inferred 80, band 66 to 112 |
| Sunless 05 | 61 | 258 | 51 | 28 | 0 | 0 | 0 | 1 | inferred 132, band 116 to 208 |
| Sunless 06 | 55 | 161 | 26 | 9 | 0 | 0 | 0 | 12 | **none: the seam abstains** |
| **Sunless total** | 216 | 922 | **179** | 109 | **0** | **0** | **0** | 34 | |
| Gretchen (`.mscz`, raw) | | 310 chords | 100 | | 0 | | 2 | 1 | 1.8 beats per second in the file |
| 12 fixtures (Downloads controls, e16 harness, the app's `sunless-01-engraved`) | | | 12 (+19 in the app fixture) | | 0 | 0 | 0 | 0 | none, except the app fixture (same as Sunless 01) |

**Breath marks and caesuras: zero in every score on disk.** Rests: 179 across the six songs, about one per five notes. **A method resting on breath marks would find nothing; a method resting on rests has material in every song.** The r2 worry is confirmed and answered: segment on rests.

**Trust, from `aggregatePhonation` on the same files:** Sunless 01 has one untrusted bar (index 16, bar "17"); 03 has one (index 22); 02, 03 and 05 have arbitrated bars (5, 15, 2).

### B.2 What the parse does with each edge case (code read this run)

| Case | What the tree does | Where |
|---|---|---|
| Rest | An event of `type: 'rest'`, with duration and position. Counted, not used, by phonation. | `types.ts:450`; `phonation.ts:360-361` |
| Breath mark, caesura | Parsed onto the NOTE's `articulations`. | `musicxml-parser.ts:259-260`, `:780-790`; `types.ts:603-611` |
| **Fermata or breath mark on a REST** | **Dropped.** Notations are read only `if (notations && !isRest)`. | `musicxml-parser.ts:780` |
| Fermata on a note | `fermata: {}` on the event. No length is added. | `musicxml-parser.ts:781`, `:849` |
| Tie across a barline | Two note events, each with its own duration; `tied` carries the role. Nothing marks a boundary. | `types.ts:572-578` |
| A rest "inside" a tied figure | Cannot be encoded as one tie chain: a tie joins notes, and the rest is its own event between them. | `types.ts:450`, `:572` |
| Very short rest at speed | An ordinary rest event. Measured: 109 of 179 Sunless rests are a quaver or less, and the shortest lasts **0.09 s** at the fast end of Sunless 03's band. | run |
| Repeat | `scoreInPerformanceOrder` concatenates each sung bar's events, **re-using the same event object on each pass.** No pass number reaches the event. | `performance-order.ts:1-40`, `:43-64` |
| Melisma | Later notes carry no syllable. No boundary effect. | `types.ts:470-478` comment |
| Grace note | Skipped, with a warning. | `musicxml-parser.ts:703-705` |
| Chord tone in the vocal line | Skipped, first tone kept. | `musicxml-parser.ts:707-712` |
| `<forward>` | Advances the cursor and creates **no event**, so a silence exists with no rest to show it. Zero in the corpus. | `musicxml-parser.ts:521-524` |
| Second voice after `<backup>` | Not filtered by voice, so its notes would interleave. Zero in the corpus. | `musicxml-parser.ts:513-519` |
| Underfilled bar (OMR drops a rest) | No event for the missing time; the bar may be arbitrated or untrusted. Seen once: Sunless 02, bars 8 to 9. | run; `phonation.ts:316-342` |
| Slurs | **Not parsed** (no slur handling in the MusicXML parser; the MNX parser says so). 34 in the Sunless files. | `mnx-parser.ts:23`; grep of `musicxml-parser.ts`, run |
| Pickup rest | A rest before the first note opens no phrase, so it changes nothing. | by construction |
| Tempo | `secondsFor` takes ONE tempo, the first the seam resolves, and **ignores later changes.** Sunless 01 has "poco accelerando" at bar 14 and "Meno mosso" at bar 16 (`gradualCues`, run). | `phonation.ts:433-443`, `:452` |

### B.3 Where a singer would breathe but the score shows nothing

**The text shows it.** In **5 of the 6 songs, the longest run between rests contains a comma or semicolon at a syllable** with no rest after it (run; the one exception is Sunless 03). Sunless 01, bars 4 to 5: *тень непроглядная, тень безответная;* sung as 23 quavers with no rest at the comma. Sunless 06, bars 2 to 5: *Месяц задумчивый, звёзды далёкие* as 30 quavers. A singer commonly takes a catch breath at such a comma, stealing time from the note before it. And the Lied-duo breathing study found singers' breaths more often inside a phrase than at its start (152 of 282 phrase-medial; Frontiers in Psychology 2026; snippet). **Ilya cannot see those breaths, and the method does not invent them.** How the method treats them: see C.1 and C.6.

---

## Stage C. Synthesis. The method

**Input:** the performance-order score (`scoreInPerformanceOrder(parsed).score`), the bar readings `aggregatePhonation` already chose (`phonation.ts:316-342`), and the same `ResolveTempoOptions` object every other seconds figure receives (`score-metrics.ts:116-123`). **Output:** an ordered list of phrases, each with first and last event, first and last bar (display number and pass), quavers, seconds or a seconds range or nothing, a fermata flag, a trust flag, the commas inside it, and its time per zone.

### C.1 What ends a phrase

| Rule | Source |
|---|---|
| **P1. A notated rest of any length ends the phrase.** | Gould p. 436 ("a breath is a rest written into the rhythm"); St-Pierre p. 138 (quaver rests "for breathing"); Pearce et al. 2008 (every strong model uses a rest rule). **No minimum length is a DESK DEFAULT**: no source read gives one, and the run shows why a minimum is dangerous. Bridging rests of a quaver or less turns Sunless 01 into **one phrase from bar 2 to bar 17, 49 to 84 seconds** (run, `BRIDGE=1`). |
| **P2. A breath mark or a caesura on a note ends the phrase after that note.** | Gould p. 436; the tree's own intent (`types.ts:599-601`). Zero in the corpus, so it costs nothing and waits for scores that carry them. |
| **P3. A silence with no rest event ends the phrase**: the next onset starts after the last release (a `<forward>`, an underfilled bar). | DESK DEFAULT: silence is silence whether or not the file drew a rest. Computed from `rhythmicPosition` and the bar's metre. |
| **P4. These do NOT end a phrase:** a tie, a barline, a slur (not parsed anyway), a melisma, a repeat jump, a fermata on a note, a comma in the text. | DESK DEFAULT. A fermata lengthens a note; it does not stop the sound. The comma is reported, not split on (C.4, C.6). |
| **P5. The end of the vocal line closes the last phrase.** | By construction. |

### C.2 What a phrase's length is

**Elapsed time from the first onset to the last release.** Under P1 no rest can sit inside a phrase, so **elapsed time and summed sounding time are the same number**, and the method can sum note durations in quavers under each bar's chosen reading, exactly as `aggregatePhonation` does (`phonation.ts:370`). **The distinction only bites if Dann later rules a minimum rest length.** Then elapsed time is the one to keep, because a rest too short to breathe in is still time without new air, and the singer feels the whole span.

### C.3 The seconds, at whose tempo

`secondsFor(phraseQuavers, parsed, tempoOptions)` (`phonation.ts:444`), so the singer's own tempo wins (`tempo-seam.ts:411-424`; N.151 ruling, `OPEN.md:1380-1386`).

| Provenance | What prints |
|---|---|
| `user` | One figure, "at your tempo". |
| `encoded` | One figure, "at the tempo printed in the score". |
| `inferred` | **A range, never a point** (`secondsRange`, `phonation.ts:419-424`), "at the speed *{term}* usually means". |
| none (`secondsFor` returns `undefined`, `phonation.ts:432`) | **The length in quavers and bars, and an invitation to set a tempo.** No seconds, no default bpm. |

Ranking is by quavers. Under one tempo that is the same order as seconds.

### C.4 What is shown. Draft strings for Insights (English; the French is Dann's)

**No word for "long" appears.** The field gives no singer-relative threshold (A.4), and a fixed line would be a population norm, which the 2026-09-16 ruling excludes (`INBOX.md:188`). So the sentence gives the number and its place, and the singer judges.

- **Tempo known, one figure:** *"The longest phrase between rests lasts 15 seconds at your tempo, from bar 2 to bar 5."*
- **Tempo inferred:** *"The longest phrase between rests lasts 6 to 10 seconds, from bar 4 to bar 5, at the speed Andante usually means."*
- **Equal lengths:** append *"It comes three times: bars 4 to 5, 10 to 11 and 14 to 15."*
- **No tempo:** *"The longest phrase between rests is 30 quavers long, from bar 2 to bar 5. The score prints no tempo; set yours to see it in seconds."*
- **A comma with no rest (recommended, DESK DEFAULT):** append *"There is no rest at the comma in bar 3."* A fact from the page, and it lets the singer see where a breath could go without Ilya claiming one.
- **A fermata inside:** *"at least 15 seconds"*.
- **Untrusted bar inside:** the seconds are withheld and the bar is named, the pattern `insights.fit.withheldOne` already uses (`i18n.ts:1476`).

**Where:** one sentence on the singer's page; the full phrase list (bars, quavers, seconds, zone) on the measurements page. DESK DEFAULT, from the page order in `claude/brief-to-design-e25-fit-result-surface` §6.

**"Phrase" and "rest" are the field's words** (Nix pp. 218-220; St-Pierre p. 76). "Unbroken", in Fable's draft, is not wrong, but "between rests" names the rule the singer can check on the page.

### C.5 How it meets the singer's own measurements

Each phrase's time is split by the typed passaggi into below primo, between, and above secondo, exactly Fable's R1 bucketing, per phrase. **Printed only when both passaggi are typed** (the precedent is `insights.fit.crossingsUncounted`, `i18n.ts:1472`). DESK DEFAULT clause: the zone holding most of the phrase's time, with its seconds: *"; 9 of those seconds sit above your secondo passaggio."* Notes above the typed range are already `finding.rangeAbove` (`i18n.ts:1496`) and are not repeated here.

### C.6 Edge cases and their rules

| Case | Rule |
|---|---|
| Short rest at speed | Ends the phrase (P1). The caveat says a singer may sing through it. |
| Rest between tied notes | Ends the phrase (P1); the rest is its own event. |
| Fermata on a note | Counts its written length; the phrase prints "at least". |
| Fermata on a rest | Dropped by the parser (`musicxml-parser.ts:780`), but the rest already ends the phrase, so no loss. |
| Tie across a barline | No boundary. |
| Repeat | Walk the performance order. A phrase sung twice is two phrases; the bar label needs the pass ("bars 4 to 5, second time"), which **the event does not carry** (`performance-order.ts:27-35`): Code must take it from the unfold order. |
| Melisma, grace note, chord tone | No boundary; grace and chord tones are already skipped (`musicxml-parser.ts:703-712`). |
| Pickup rest | Opens nothing. |
| Underfilled or untrusted bar | P3 applies to the gap; a phrase touching an untrusted bar has its seconds withheld. |
| Second voice in the vocal part | Out of scope until the parser filters by voice; the phrase finder should refuse a line whose onsets go backwards within a bar. |
| Long line with no rest | Reported whole, with its commas named (C.4). Not split. |
| Tempo change after bar 1 | The figure uses the opening tempo (`phonation.ts:438`); if `gradualCues` or more than one steady marking exists and the phrase lies after the first change, append the caveat naming the bar. |

### C.7 The caveats the singer reads (plain language)

1. *"Timed from the score, not from a performance. Rubato, a held fermata, and the breaths you take change it."*
2. *"It uses the opening tempo. The score changes speed at bar {n}, and this figure does not follow it."* (Only when true.)
3. *"A rest is where the score gives you time to breathe. You may breathe elsewhere, and you may sing through a short rest."*
4. *"Loudness is not counted. A loud phrase costs more breath than a quiet one of the same length."* (Nix p. 220; St-Pierre p. 76.)
5. When the tempo is the singer's: *"at your tempo"* is itself the statement the N.151 ruling asks for.

(`secondsFor`'s other two caveats, A4 = 440 and "rests are excluded", do not apply to a duration measured between rests.)

### C.8 Where it belongs

**Recommend: its own item, beside N.123, not inside it.** It reuses N.123's inputs (bar readings, performance order, trust) and `secondsFor`, but it needs the one thing N.123 does not keep, **order**, plus a boundary rule, and it feeds Insights rather than N.123's figures. Build shape for Code: a pure `phrasesOf(parsed, options)` in `packages/score-parser`, tested like `phonation.ts`; `buildInsights` then needs the tempo options threaded in, since `InsightsInputs` carries none today (`insights.ts:112-119`). **Dann rules the placement.**

---

## Stage D. Defence and test

The method was run with Ilya's own parser and `secondsFor` (B.0). One phrase per score was then checked by hand from the event list.

### D.1 Three real scores

**Slow: Sunless 01, "Within Four Walls", as Dann imported it.** 12/8, tempo inferred from "Andante tranquillo": dotted crotchet 44, band 44 to 74.7. 17 phrases.

| Bars | Quavers | Seconds | Notes | Span | Commas inside |
|---|---|---|---|---|---|
| 2 | 11 | 2.9 to 5.0 | 6 | F3 to B♭3 | |
| 3 | 5 | 1.3 to 2.3 | 3 | G3 to B3 | |
| 3 | 5 | 1.3 to 2.3 | 3 | A3 to C♯4 | |
| **4 to 5** | **23** | **6.2 to 10.5** | 12 | C♯3 to B♭3 | 1 |
| 6 | 3 | 0.8 to 1.4 | 2 | | |
| 6 | 7 | 1.9 to 3.2 | 4 | | |
| 7 | 11 | 2.9 to 5.0 | 6 | | |
| 8 | 9 | 2.4 to 4.1 | 5 | | |
| 8 to 9 | 12 | 3.2 to 5.5 | 7 | | |
| **10 to 11** | **23** | **6.2 to 10.5** | 12 | E3 to C4 | 1 |
| 12 | 9 | 2.4 to 4.1 | 5 | | |
| 12 to 13 | 13 | 3.5 to 5.9 | 7 | | |
| **14 to 15** | **23** | **6.2 to 10.5** | 12 | G3 to C♯4 | 2 |
| 16 | 5 | 1.3 to 2.3 | 3 | | |
| 16 | 5 | 1.3 to 2.3 | 3 | | |
| 17 | 4 | 1.1 to 1.8 | 1 | | |
| 17 to 18 | 18 | **withheld**: bar 17 does not add up to its time signature | 6 | | |

**Hand check, bars 4 to 5:** crotchet, crotchet, crotchet, dotted crotchet, quaver, crotchet = 12 quavers; crotchet, crotchet, crotchet, dotted crotchet, quaver, quaver = 11; total **23 quavers** = 7.67 dotted-crotchet beats; x 60 / 74.67 = **6.16 s**, x 60 / 44 = **10.45 s**. Matches the run. Bars 14 to 15 lie inside "poco accelerando" (bar 14), so caveat 2 attaches.

*The singer would read:* "The longest phrase between rests lasts 6 to 10 seconds, from bar 4 to bar 5, at the speed Andante usually means. It comes three times: bars 4 to 5, 10 to 11 and 14 to 15. There is no rest at the comma in bar 4."

**Fast: Sunless 05, "Elegy".** Tempo inferred from "Allegro agitato": crotchet 132, band 116 to 208. 29 phrases; the six longest:

| Bars | Quavers | Seconds | Notes | Commas inside |
|---|---|---|---|---|
| **12 to 17** | **35** | **5.0 to 9.1** | 26 | 3 |
| 3 to 7 | 31 | 4.5 to 8.0 | 19 | 1 |
| 56 to 59 | 24 | 3.5 to 6.2 | 7 | 1 |
| 31 to 34 | 22 | 3.2 to 5.7 | 19 | |
| 51 to 54 | 22 | 3.2 to 5.7 | 13 | |
| 19 to 21 | 16 | 2.3 to 4.1 | 13 | |

Hand arithmetic: 35 quavers = 17.5 crotchets; x 60 / 208 = 5.05 s; x 60 / 116 = 9.05 s. **The band is wide (a factor of 1.8) because "Allegro" is a wide tier;** the printed range is honest and not very useful until the singer sets a tempo. This file is a conversion (`mxl_extract`), not Dann's import.

**Few rests: Sunless 06, "On the River".** 4/4, 26 rests for 161 notes. **No tempo: the seam abstains.** 23 phrases. The singer would read: "The longest phrase between rests is 30 quavers long, from bar 2 to bar 5. The score prints no tempo; set yours to see it in seconds." With an illustrative singer's tempo of crotchet 60 (not the composer's; chosen only to show the arithmetic):

| Bars | Quavers | Seconds at crotchet 60 | Commas inside |
|---|---|---|---|
| **2 to 5** | **30** | **15.0** | 1 |
| **14 to 17** | **30** | **15.0** | 1 |
| **22 to 25** | **30** | **15.0** | 1 |
| 43 to 45 | 18 | 9.0 | 3 |
| 47 to 49 | 18 | 9.0 | 1 |
| 7 to 9 | 16 | 8.0 | |

### D.2 The likeliest way the method misleads a singer

**It reports two lines of text as one breath.** In 5 of 6 songs the longest phrase between rests holds a comma with no rest after it (B.3). Sunless 06, bars 2 to 5: *Ме-сяц за-дум-чи-вый, звёз-ды да-лё-ки-е* is 16 quavers, comma, 14 quavers. At crotchet 60 the method says **15 seconds**; a singer who takes a quick breath at the comma (stealing it from «вый») sings **8 seconds and 7 seconds**. The figure is true of the page and overstates what many singers actually sustain. **Mitigation built into C.4:** the sentence names the comma ("There is no rest at the comma in bar 3"), and caveat 3 says breaths can go elsewhere. It does not split at commas, because no source read says a comma is a breath, and splitting would invent one.

**Runner-up: a firm-looking tempo that may not be the composer's.** Sunless 02 carries an encoded crotchet 120 over "Andante con moto", in a file written by `musx2mxl 0.2.9` (file line 6). It prints as one figure with no band. **Whether 120 is a notation program's default: NOT ESTABLISHED.** The singer's own tempo overrides it (C.3).

**The inverse error is smaller but real:** every quaver rest ends a phrase, so a singer who sings through one carries a longer phrase than Ilya reports. 109 of 179 Sunless rests are a quaver or less.

### D.3 Tests for Claude Code

Synthetic inputs (build as MusicXML strings, as `phonation.test.ts` does), then real-file regressions.

| # | Input | Expected phrases | Expected seconds |
|---|---|---|---|
| 1 | 4/4, crotchet = 60 encoded; bar 1: four crotchets; bar 2: minim, crotchet rest, crotchet | [bars 1 to 2, 12 quavers], [bar 2, 2 quavers] | 6.0; 1.0 |
| 2 | As 1, breath mark on the second crotchet of bar 1 | [4 quavers], [8 quavers], [2 quavers] | 2.0; 4.0; 1.0 |
| 3 | As 1, caesura on the same note | Same as 2 | Same as 2 |
| 4 | Minim tied across a barline to a minim, no rest | One phrase, 8 quavers | 4.0 |
| 5 | 2/4 at crotchet 160: semiquavers with one semiquaver rest in the middle | Two phrases (P1, no minimum) | each side at 160 |
| 6 | Test 1 with no tempo of any kind | Same phrases | `undefined`; quavers 12 and 2 reported |
| 7 | Test 1 with the word "Allegro" and no metronome | Same phrases | a `secondsRange`; never a point |
| 8 | Test 1 encoded at 120, singer override 60 | Same phrases | 6.0 (override wins), provenance `user` |
| 9 | 6/8, dotted crotchet = 44: 23 quavers, no rest | One phrase | 10.45 |
| 10 | Fermata on a note inside a phrase | Phrase flagged `atLeast` | written length only |
| 11 | Fermata on a rest | Rest still ends the phrase; parser drops the fermata (`musicxml-parser.ts:780`) | |
| 12 | Two bars inside a repeat, no rest at the repeat barline, rest at the end | Performance order: the run continues across the jump; each phrase carries its pass | |
| 13 | A bar whose notes underfill the metre by a quaver, no rest drawn | P3 splits at the gap; the bar is `untrusted`; seconds withheld for the phrase touching it | |
| 14 | Grace note inside a phrase | Ignored; no split | |
| 15 | Rest before the first note, and a pickup bar | No empty phrase | |
| 16 | Melisma: three notes, one syllable | No split | |
| 17 | Lyric "one, two" with no rest at the comma | One phrase; `commasInside = 1`, at the right bar | |
| R1 | `~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml` | 17 phrases; longest 23 quavers at bars 4-5, 10-11, 14-15; bars 17-18 withheld | 6.16 to 10.45 |
| R2 | Sunless 06 `mxl_extract`, override crotchet 60 | 23 phrases; longest 30 quavers at bars 2-5, 14-17, 22-25 | 15.0 |
| R3 | Sunless 05 `mxl_extract` | 29 phrases; longest 35 quavers, bars 12-17 | 5.05 to 9.05 |
| R4 | Sunless 01 with rests of a quaver or less bridged (a negative control on P1) | 2 phrases, one of 184 quavers | 49.3 to 83.6; **the test asserts P1 is NOT this** |

**Found in passing, not in scope:** `sustain.ts:61-80` resolves the tempo from `tempoMarkings` directly, bypassing the seam and so the singer's override, while `watchlist.ts:74` and `:259` keep their own copy of the 2.5 s threshold that `sustain.ts:2-11` says it de-duplicates. Leap sources met: St-Pierre p. 75; Nix p. 220.

---

## NOT ESTABLISHED

- **A threshold in seconds for a "long" phrase.** None in any source read. St-Pierre measures phrases "in seconds" and grades them by dynamic and texture instead (p. 76).
- **The shortest rest a singer can breathe in.** No source read gives one; P1's "any rest" is a DESK DEFAULT.
- **Vennard 1967, pp. 34 and 78-79.** Not in the library. Known only through St-Pierre and Nix's reference list.
- **Thomasson and Sundberg 1997; Speyer et al. 2010; Baker et al. 2026 results.** Not read (403, 429, elided abstracts).
- **Whether a comma with no rest is a breath place in the pedagogy.** Not found; that is why the method names the comma and does not split on it.
- **Whether Sunless 02's crotchet 120 is the composer's, an editor's, or software's.**
- **Counts for the scores in Dann's IndexedDB**, the `.musx` and `.mnx` files, and Gretchen through Ilya's own parser.
- **Pass numbers for repeated bars** reach no event; the source for them in the unfold order was not read this run.
