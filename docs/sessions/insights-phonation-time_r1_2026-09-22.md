# INSIGHTS: PHONATION TIME. Rulings and French proposals

**Opened 2026-09-22 late.** Not numbered; `CONTRACT.md` §3.1 holds until Dann numbers it.

## Dann's rulings, 2026-09-22

- **23:34:** *"We need to wire up total phonation time and seat it in Insights."* And the purpose of the whole St-Pierre thread: *"this current work is at the service of enhancing Insights by way of providing more nuanced evidence for the user."*
- **23:45: the design.** The desk offered three options. He chose **option 1, a phonation-time section**: a headline sentence; one bar split into three zones by the singer's own passaggi, each with its share; then time per vowel, longest first, flagged vowels marked. And **option 2, seconds inside each finding, "only as a complement to option 1's claims."** Option 3, a fourth table row, was not chosen. Who offered what: all three options are the desk's; the choice is his.
- **23:45: the verb.** *"I think 'phonate' is an acceptable substitute for 'sing' in this construct: 'You phonate for about 2 min 40 s of this 3 min 50 s piece, at ♩ = 72.'"* The desk had drafted "sing"; the verb is his.

## Why the data exists and is not drawn

`VoiceProfilePane.svelte:751-757`: total seconds, per-vowel totals, and fold cycles are computed by `scoreMetrics` and deliberately NOT RENDERED, waiting on signed-off wording. Caveat at `:758-760`: the per-vowel split was provisional while `#` occupied a syllable slot; **whether that still holds is NOT ESTABLISHED.** Piece length INCLUDING rests is not computed today (desk reading of `phonation.ts:211-212`: rests are counted and excluded); Code adds it.

## French, PROPOSED BY THE DESK, NOT RATIFIED. Nothing reaches the tree until Dann rules

Glossary drawn from the file: « phonation » for the verb, after `pacifier.beginPhonating` (`i18n.ts:1108`, "Begin phonating now" → « Commencez la phonation maintenant »), which avoids « phoner » (colloquially, to telephone). « passaggio », « passaggi », primo and secondo stay Italian, per Dann's rulings on `:1464`, `:1471-1473` (2026-09-22). « occurrence(s) » from `:1491-1492`. « ambitus » is not needed here.

| # | English | French, proposed |
|---|---|---|
| 1 | Phonation time | Temps de phonation |
| 2 | You phonate for about {phonation} of this {length} piece, at {tempo}. | Vous êtes en phonation pendant environ {phonation} de cette pièce de {length}, à {tempo}. |
| 3 | (inferred tempo) You phonate for about {low} to {high} of this piece, at the speed {tempoWord} usually means. | Vous êtes en phonation pendant environ {low} à {high} de cette pièce, au tempo qu'indique habituellement {tempoWord}. |
| 4 | This score states no tempo, so the time cannot be given in seconds. | Cette partition n'indique aucun tempo ; la durée ne peut donc pas être donnée en secondes. |
| 5 | Above your secondo passaggio | Au-dessus de votre secondo passaggio |
| 6 | Between your passaggi | Entre vos passaggi |
| 7 | Below your primo passaggio | Sous votre primo passaggio |
| 8 | By vowel, longest first | Par voyelle, de la plus longue à la plus courte |
| 9 | (option 2, inside a finding) {n} instances, {seconds} of phonation in all. | {n} occurrences, {seconds} de phonation en tout. |

**The choices that are genuinely his:** row 2's construction (an alternative is « Votre phonation occupe environ {phonation} des {length} de la pièce, à {tempo}. »); row 8's gender (voyelle is feminine, so « la plus longue »); and whether row 4 needs to exist at all in French wording this plain.

## The probe Dann asked for, 23:43. Not started

*"Can we devote a probe session to these two ideas to really think about them and consider whether their incorporation to Ilya (Paper and Loupe) is doable?"* The two ideas: **the score's phrase markings (slur arcs)** and **dynamic markings**, both as inputs to the phrase-length estimate and beyond. Inputs for that session: `method-phrase-length_r1_2026-09-22.md` (0 breath marks, 0 caesuras, 179 rests across the six Sunless songs; text commas with no rest are already noticed) and the r2 proposal's struck dynamics refusal.

**Added 23:51, for the same probe:** an optional intake measure of the singer's comfortable phrase length, so that "long" can be relative to the singer. Dann is reluctant to use a sustained single vowel as the proxy (his reasoning: legato across a range involves acoustic events and renegotiations a single pitch does not). The desk agreed (its own suggestion was the weak one) and ranked three paths. Not ruled.

1. **Timed legato pattern, the desk's design.** One vowel, comfortable mezzo forte, set tempo; a scale from below the singer's primo passaggio to above the secondo and back, repeated without stopping. Instruction: "Breathe when you would naturally want to, not when you run out." The wizard times continuous phonation to the first breath; two trials. Captures traversal and renegotiation; measures comfort, not maximum. Limits: no consonants, no dynamics, one day's voice.
2. **Self-report fallback.** "In a comfortable legato phrase, about how many seconds do you usually sing before you want a breath?" Labelled as typed.
3. **Neither, for now.** Show seconds and zones, never call a phrase long. Defensible: Nix 2002 frames phrase length as the teacher's judgement of breath management (p. 218).

**Desk recommendation: 3 for the release; design 1 in the probe.** Why not a sustained single vowel (desk reasoning, not literature): wrong task (no registration, vowel, or consonant events), maximum rather than comfort, and clinical maximum phonation time is known to vary with effort, instruction, and practice.

## Rulings and statements, 2026-09-23 00:02

- **French row 2 RATIFIED by Dann in this wording:** « Votre phonation occupe environ {phonation} des {length} de la pièce, à {tempo}. » (the desk's alternative, his choice). The English stays "You phonate for about {phonation} of this {length} piece, at {tempo}." The two do not mirror word for word; the meaning matches. DESK DEFAULT: leave both.
- **Vocabulary, stated by Dann:** *"I like phonation as a word for reporting, but I like sing and singing as a word for instruction."* His example: "Begin singing now". **Open, desk's flag:** the existing instruction at `i18n.ts:1108` is "Begin phonating now. {v} in vocal fry.", and fry is not singing.
- **Breathing, stated by Dann:** *"The best singers will breathe between logical semantic units whether these feature punctuation or not. It is not excellent classical singing to breathe in the middle of a phrasal micro-unit."* Breathing between syllables is a contemporary commercial styling and *"would be inappropriate in art song literature unless specifically notated by the composer."* Also: *"what we can offer is a defensible estimate. That is sufficient for the purposes of Insights."*
- **For the probe:** Dann wants to know whether the page reader can detect a comma above the vocal line reliably; wants to harvest dynamics (symbols and text); and holds that Strauss, Wagner, and the late German Romantics use phrase marks heavily, Handel and the Baroque few and many editorial, and that editorial marks often reflect performance practice. **Desk findings, 00:02:**
  - **Page reader:** `apps/web/static/reader/*.py` has no comma, breath, dynamics, or slur detection (grep for breath, comma, dynamic, articulation, slur returned no detector; `reader.py:1099` mentions slur in a comment only). MusicXML and MNX breath marks ARE parsed (`musicxml-parser.ts:259`, `mnx-parser.ts:242`). Whether a comma could be detected reliably from pixels is NOT ESTABLISHED.
  - **Dynamics:** `types.ts` carries none. The precedent for harvesting them is `tempo-lexicon.ts:1-40`: five languages, about 90 head terms, mapped to Italian head terms, sourced. Desk recommendation: a curated dynamics lexicon in the tree on the same pattern, not a runtime dictionary lookup.
  - **Phrase marks, partly verified:** "For vocal music, slurs are usually used to mark notes which are sung to a single syllable (melisma)" (Wikipedia, "Slur (music)"); Baroque sources carry few expression marks, and editions distinguish editorial additions typographically (Wikipedia, "Urtext edition", which cites Bach's keyboard music, not vocal music). **NOT verified:** that Strauss and Wagner mark phrasing heavily; that Handel's printed phrase marks are mostly editorial. "Editorial marks reflect performance practice" is a judgement, testable only case by case. Gould is not in Dann's library folders (searched). Desk observation: **Ilya knows the syllables, so it can tell an arc over one syllable (a melisma slur) from an arc over several syllables (a phrase mark).**

## Rulings, 2026-09-23 00:11

- **Self-report is STRUCK as an intake path.** Dann: *"Self-reporting is unreliable and we won't engage in that for this purpose."* The desk's option 2 (00:02 section) is withdrawn.
- **Comma detection from scans: Dann wants it pushed.** *"Whether a comma could be read reliably from a scan is my question, and it looks like we are on the vanguard. Let's see how far we can push the technology to yield usable results."* Probe item.
- **Dynamics lexicon, Dann's clarification:** compile an onboard table from one or more online dictionaries, on the model of `tempo-lexicon.ts`, for Ilya to interpret and to represent on the Paper and in the Loupe. Not a runtime lookup.
- **Farmed 00:15:** literature on timed legato-pattern assessments (who built one, which patterns); and web verification of his phrase-mark claims (Strauss, Wagner, late German Romantics heavy; Handel and Baroque few, many editorial; editorial marks often reflecting practice).

## Statements, 2026-09-23 00:22 (dynamics)

- **Dann:** *"dynamic markings can appear in the piano without being mirrored in the vocal line. Usually they should be understood to apply to both instruments (voice and piano), so we should take this into account when analyzing a new pdf or file."* And on terms that straddle dynamics and technique: *"I am confident that we can establish functional correspondences that will work for our purposes."*
- **Dann, on interpretive dynamics:** singers vary dynamics with the drama of the text, which is good practice and personalizes an interpretation; *"I'm not sure it's something we can comment on usefully?"* Desk view: Ilya reports printed dynamics as printed and does not comment on interpretation (`PRODUCT.md`, Insights gives insight, not intervention). Not ruled.

## French, 2026-09-23 01:00

- **Row 1 RATIFIED:** « Temps de phonation ». Dann: *"I get worried that temps means the weather so I instinctively avoid using it. I accept your phrasing."* Desk note: « temps de phonation » is the French clinical family (« temps maximum de phonation »); a bare « temps » also means "beat" in Ilya's French (`i18n.ts:365-366`), so the heading always keeps the full phrase. **Split, desk default:** « temps » for totals, « durée » for one continuous phrase.
- Rows 5, 8, 9 put to him the same night; rows 3, 4, 6, 7 not yet shown in chat.
- **Row 8 RATIFIED, 01:02:** « Par voyelle, par temps de phonation décroissant ». Replaces « de la plus longue à la plus courte », which Dann declined; desk's reason for the change: « voyelle longue / courte » means vowel length in phonetics. **English mirror, DESK DEFAULT:** "By vowel, most phonation time first" (replaces "By vowel, longest first").
- **Rows 5 and 9 RATIFIED, 01:02:** « Au-dessus de votre secondo passaggio »; « {n} occurrences, {seconds} de phonation en tout. »
- **01:04, Dann on row 4:** add *"Would you like to assign one?"* His principle: *"we should propose a path forward when we can."* **Desk caution:** the singer has no way to set a tempo yet (`VoiceProfilePane.svelte:744-746`, "the singer has no way to set one yet (A9 is unbuilt)"), and the N.120 Tempo station is LATER (`sort-release_r1_2026-09-16.md:95`). **DESK DEFAULT:** the question prints only when a tempo control exists and links to it; until then row 4 prints without it. Proposed French for the question: « Voulez-vous en indiquer un ? », after « indiqué » for typed values (`i18n.ts:1468`).
- **Rows 3, 6, 7 RATIFIED, 01:05** as proposed at 01:04 (row 3 EN "Your phonation takes about {low} to {high} of this piece, at the speed {tempoWord} usually means." / FR « Votre phonation occupe environ {low} à {high} de la pièce, au tempo qu'indique habituellement {tempoWord}. »; row 6 « Entre vos passaggi »; row 7 « Au-dessous de votre primo passaggio »).
- **01:05, Dann, instead of the question on row 4:** point to the interface: *"You may assign tempi manually using the Loupe."* **Read in the tree 01:06: no tempo control exists in the Loupe or the drawer** (grep for "tempo" in `Loupe.svelte`, `CorrectionSurface.svelte`, `components/Drawer/*.svelte` returns one comment, `Loupe.svelte:1389`, unrelated). No user-facing string names the Loupe in either language. **DESK DEFAULT:** the pointer is written now and shows only once the Loupe carries a tempo control (N.120 Tempo station, LATER). Proposed French: « Vous pouvez indiquer vos tempi vous-même dans la loupe. »
- **01:07: RULED, the tempo control lives in the Loupe.** Transcribed to `OPEN.md`, N.120. The pointer string stands as Dann wrote it and shows once the control exists.

## RATIFIED 2026-09-23 01:35, after the build

Dann ratified the French of three strings Code drafted (desk-offered, Dann-ruled): `insights.phonation.findingOne` « 1 occurrence, {seconds} de phonation en tout. »; `insights.phonation.untrustedOne` « La mesure {measures} ne correspond pas à son chiffrage de mesure ; ses notes sont comptées telles qu’écrites. »; `insights.phonation.untrustedMany` « Les mesures {measures} ne correspondent pas à leur chiffrage de mesure ; leurs notes sont comptées telles qu’écrites. » The `i18n.ts` comments still read NOT RATIFIED; the next Code pass updates them.
