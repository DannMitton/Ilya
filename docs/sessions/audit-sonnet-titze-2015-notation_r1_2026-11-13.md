# Audit: Titze et al. (2015) notation in reader-visible text, r1, 2026-11-13

Read-only. Scope: apps/web/src, reader-visible strings, markup, SVG, and notation-convention comments. Tests and docs excluded.

## 1. Summary

- Nonconforming reader-visible uses: 8 (rows 1 to 8 below). Two are symbol-rendering faults, five are the word "formant" applied to Ilya's own measurements (four i18n keys, counted as four EN/FR pairs, plus the wizard lede), one is a mixed case.
- Conforming reader-visible uses: about 30 sites. FrSym renders at 8 sites; Learn prints fR1 and fR2 four times (2 EN, 2 FR); comments and Insights print fR1 through one code path; the intake stem prints fo, nfo, fR1, and F1 correctly as terms.
- No reader-visible f0, F0, fₒ with a zero, H1, H2, h1, or h2 was found. No "L1-L2" or "A2/A1" was needed because the app never prints harmonic amplitude differences.
- Out of scope, counted only: about 1,020 internal identifier occurrences (CalibratedFormant, formants, f1, f2, fR1 and fR2 variable names) across 43 files.

## 2. Nonconforming

1. lib/voice/FrSym.svelte:27 (and header, lines 10 to 12 and 22 to 23). Current: subscript set with `font-variant-caps: all-small-caps; font-size: 0.78em`, so R is a small capital. Proposed: delete the `font-variant-caps` line and the header text that calls for small capitals; keep upright, keep `font-size: 0.78em` or match the numeral. Rule: Table I, subscript R is a full capital the same size as the numeral. This one change fixes all 8 FrSym sites (wizard table 1174 and 1175, capture readout 305 and 307, sheet axes 64 and 68, sheet columns 117 and 118). The header cites "ruling 14, Dann 2026-11-12" for small capitals, which conflicts with today's ruling; the owner should confirm that ruling 14 is superseded.
2. lib/voice/chart/ChartLayers.svelte:205 to 208 (CSS) and 144, 145 (SVG). Current: axis labels `<tspan font-style="italic">f</tspan><tspan class="sub">R2</tspan>` with `.sub { font-size: 0.78em; font-variant-caps: all-small-caps }`. Proposed: remove `font-variant-caps: all-small-caps`. Rule: same as row 1.
3. lib/insights/text-parts.ts:61. Current: `fR1` in a round 2 line becomes `{text:'f'}` and `{text:'R1', sub:true}`; the f carries `em` only when the whole line sits inside `*…*`. So "(fR1)" in 'insights.r2.fr1.one' and '.many' (i18n.ts:2018, 2019) prints an upright f. Proposed: push the f run with `em: true` always. Rule: Table I, italic f. (The comments path in comment-text.ts:306 already sets the f italic.)
4. lib/i18n.ts:1366, 'calib.welcome.lede'. EN current: "to build a formant profile, which is a map of your voice's resonances". Proposed: "to build a resonance profile, which is a map of your voice's resonances". FR current: « un profil de formants, c’est-à-dire une carte des résonances de votre voix ». FRENCH DRAFT: « un profil de résonances, c’est-à-dire une carte des résonances de votre voix ». Rule: Ilya estimates resonances (fR), not formants (F). The sentence now repeats "résonances"; the owner may prefer "un profil de résonances, c’est-à-dire une carte de votre voix".
5. lib/i18n.ts:1489, 'profile.subtitleNamed'. EN current: "Formant profile: a map of {voice}’s resonances". Proposed: "Resonance profile: a map of {voice}’s resonances". FR current: « Profil de formants : une carte des résonances de la voix « {voice} » ». FRENCH DRAFT: « Profil de résonances : une carte des résonances de la voix « {voice} » ». Rule: as row 4. This is the printed score subtitle.
6. lib/i18n.ts:1490, 'profile.subtitleYours'. EN current: "Formant profile: a map of your voice’s resonances". Proposed: "Resonance profile: a map of your voice’s resonances". FR current: « Profil de formants : une carte des résonances de votre voix ». FRENCH DRAFT: « Profil de résonances : une carte des résonances de votre voix ». Rule: as row 4.
7. lib/i18n.ts:1492, 'profile.subtitlePlaceholder' (QUEUE row 166, ratified by Dann 2026-11-10, so a new ruling overrides it). EN current: "Formant profile: placeholder values for a generic {voiceType}, not yet your own resonances." Proposed: "Resonance profile: placeholder values for …". FR current: « Profil de formants : valeurs par défaut pour le type générique {voiceType}, pas encore vos propres résonances. » FRENCH DRAFT: « Profil de résonances : valeurs par défaut pour … ». Rule: as row 4.
8. lib/i18n.ts:2018, 2019 and 2099, 2100 print "fR1" as plain letters inside i18n strings; rows 2018 and 2019 are fixed by row 3, 2099 and 2100 by the {fR1} marker. Listed for completeness, no string change needed once row 3 lands.

Code comments that state the convention and will go stale after row 1: lib/voice/FrSym.svelte header; lib/voice/CalibrationWizard.svelte:636; lib/sources.ts:316 (reads correctly, no change); lib/insights/singing-measures.ts:105 and 109 write "f0" in a comment (proposed: "fo"; Table I, never f0).

## 3. Judgement calls

- lib/i18n.ts:2220 'voiceIntake.acoustics.stem': prints "fundamental (fo), harmonic (nfo), resonance (fR1), and formant (F1)" in plain text with no italic or subscript. Formant is a legitimate term here (teaching the vocabulary), and the letters are correct; the missing italics and subscript are a rendering limit of a plain string. Recommend routing it through richParts to set the f in italics and R1 as a subscript.
- lib/analysis/advice-resolver.ts:146, 147, 233, 236 to 239, 286 to 289 (and 110): verbatim quotations of Godin & Howell (F1/H1, "first formant"), Bozeman ("Formant tracking", fR1:1fo, "H2 has passed through F1"), and Mitton ("fR1 of [i]"). Citing literature that used those symbols; kept. Note these citation constants are internal provenance records ("never printed", line 101); confirm where, if anywhere, they surface.
- lib/insights/SingerBlock.svelte:56: the subscript takes class `em` (italic) when inside `*…*`. A subscript R1 should stay upright. Low risk because the fR1 lines rarely sit inside asterisks.
- lib/i18n.ts:2067 "first resonance": plain words, no symbol, conforming.
- lib/analysis/watchlist.ts, advice-resolver comments: "H1", "H2" there are hazard labels, not harmonics; internal, left alone.

## 4. Already conforming

- Learn (LearnContent.svelte:1354, 1355, 3383, 3384): `<em>f</em><sub>R2</sub>`, `<sub>R1</sub>`, with the word "resonances" in both languages.
- Guide (GuideContent.svelte): no acoustic symbols; "résonances" and "resonances" throughout.
- Comments path (comment-text.ts toRuns): italic f plus upright subscript R1, checked against Titze Table I.
- Calibration wizard, pacifier, capture, readiness, and fry copy: "resonances", "fry"; no formant wording.
- Insights and markup strings (i18n 1879, 2018 to 2100, 2296 to 2315): "first resonance", "fR1" only.
- Chart and sheet column labels ('sheet.col.fr1', 'sheet.col.fr2' read "Hz and note"); the symbols come from FrSym.
- Printed sheets: reuse the same FrSym component and strings.
- Sources and Learn bibliography text (sources.ts): no formant claims about Ilya's measurements.
- Fundamental: no f0, F0, or fₒ with a zero anywhere reader-visible.
