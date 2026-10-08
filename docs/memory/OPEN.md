# OPEN — the numbered items that are open and not started

**Split out of `STATE.md` on 2026-09-13, at the close of the prune session.**
`STATE.md` was 937 lines against a 600 tripwire. Ninety-five lines of it were
closed and moved to `../sessions/LOG.md` block 11. The rest of the excess was
not closed at all: it was this catalogue, sitting inside `§THE ONE THING`, where
no session could ever move it out because every line of it is live.

**This file is a lookup, not a read-through, and it is NOT part of the opening
read order.** Open it when the one thing closes and you need the next item's
spec, or when Dann names an item by its number.

**Nothing here was reworded.** Every block is verbatim as `STATE.md` carried it,
in the order it carried it, including its blockquote marks and its dates. Where a
block says "ruled" it was ruled on the date it names; per `CONTRACT.md` tether
17, find what has amended it before you quote it.

**The tracker marks stay in `STATE.md` §THE TRACKER.** This file holds the specs
those marks point at.

---

## The item specs that sat apart from the catalogue

> **N.125, SLURS AS TAPERED OBJECTS, numbered 2026-09-11 00:30 at Dann's
> word, UNPLACED, its own Code thread (`staff-renderer.ts` only, off the
> drawer path).** Finding (Sonnet memo `memo-anchors-ties-slurs_r1_2026-09-11.md`,
> read in full): ties already taper (Dann's eye, `TIE_CENTRE_SP` 0.4 sp,
> 2026-08-27); the uniform-width arcs are SLURS, a 1.3 px stroke
> (`:2636-2670`); long arcs go flat because the slur lift is capped at
> 24 px (`:2658`) and tie depth is fixed at 0.9 lineGap (`:2602`). Gould
> 151: one design for both. Gould's slur pages 109-112 never photographed,
> so the arch height is Dann's eye: the brief asks Code for three renders
> per number. Brief WRITTEN, UNTRACKED:
> `docs/sessions/brief-n125-slurs-as-objects_r1_2026-09-11.md`.
>

### RAISED AGAIN BY DANN 2026-09-15, WITH A CHALLENGE TO THE RECORD

**His words, on two screenshots of the walk of `76b24a3`:** *"This also troubles
me. We already discussed this in a prior work session. These arcs should be
tapered at either end, like most of the others are. You claimed that these were
melisma phrase marks, not ties, and that this somehow affected their rendering?
But the second one is clearly a tie. Please review that conversation and make it
right. These constant-width arcs are noticeable and wrong. They need to be
tapered."*

**THE RE-VERIFICATION, done 2026-09-15 against the tree at `76b24a3`** (the line
numbers in the block above are from 2026-09-11 and have moved; N.126 pushed them
down by about 150):

| | today's line | what it emits |
|---|---|---|
| tie | `staff-renderer.ts:2783` | two quadratics, closed `Z`, `fill="#1a1612"`, **no stroke: a filled tapered lens**, centre `TIE_CENTRE_SP` 0.4 sp |
| slur | `staff-renderer.ts:2822` | one quadratic, `fill="none" stroke-width="1.3"`: **a constant-width ribbon** |

**So the finding as recorded holds in the tree, and the desk owns how it was put
to him.** What was on record was never *"these are melisma marks, so tapering
does not apply"*. It was that ties are ALREADY tapered in the source and the
constant-width arcs are slurs. **If it reached him as an excuse for the slur
rather than as a location for the fix, that is the desk's fault and not his
misreading.** The brief has ruled since 2026-09-11 that slurs become filled
tapered objects with pointed ends (§2.1), for exactly his reason, and Gould 151
is the authority: **tie and slur share one design.**

**DANN IS RIGHT THAT THE DISTINCTION CHANGES NOTHING ABOUT THE OUTCOME.** Both
arcs taper. The distinction changes only WHICH code block is edited, and §2.1
already edits the one that does not.

**BUT IT CHANGES ONE THING, AND THE BRIEF DOES NOT COVER IT.** If an arc he is
pointing at is a TIE and it reads as constant width to his eye, then the tie's
taper is invisible at the drawn stave size, which the source says should not
happen. **That is a second defect, not this one.** The memo's own NOT
ESTABLISHED of 2026-09-11 named it and it is still open: *"whether the tie's
filled-tapered code is actually what rendered on the page the user viewed."*
**Add a §2.4 to the brief: measure the rendered tie's centre thickness in px at
the shipping `lineGap` of 5.5, against the slur's 1.3 px, and say whether 0.4 sp
survives the size it is drawn at.**

### THE TIE / SLUR PREDICATE IS NOW LOAD-BEARING FOR THREE ITEMS

Named 2026-09-15 because three separate questions of the same evening all turned
on it, and none of them can be answered from a picture.

- **N.125**, this item: which block draws the arc Dann flagged.
- **N.141** case 2: a squircle opens on a TIE across a barline and stays closed
  on a MELISMA. See §N.141 §EVIDENCE.
- **N.142**, the tie predicate itself, which is not built.

**The cheap instrument settles all three at once: read `data-tie` and
`data-slur` off the rendered page rather than off a screenshot** (they are on
the paths already). Whoever takes N.142 should be told this.


> **N.118, NUMBERED BY DANN 2026-09-09: punctuation travels in the slot.**
> A placed syllable never carries the poem's punctuation because
> `cyrOfSyllable` reads `cleanWord` (`pairings.ts:152-159`); the punctuated
> cells on the page are wherever the map has no entry (`pairedCyrillic`,
> `:702-712`, overrides only mapped ids; consistent with Dann's screens, not
> yet proven on a taken note). Ruled design, desk's recommendation taken
> over Dann's first idea of a Transcribe-and-fit restore pass: give the
> word's LAST syllable its trailing punctuation inside `buildSlotQueue`
> (`:192-226`), so every placement, shift, and re-seat carries it. NOT
> ESTABLISHED for Code: whether `WordStackData` holds the raw word beside
> `cleanWord`; whether `estimateCyrillicWidthPx` prices a trailing comma.
> Gould rule 10 (project extraction, snippet only): the Cyrillic line keeps
> the author's punctuation. Dann said N.115; N.115 was taken, N.118 is the
> DESK DEFAULT. After N.114 unless he places it.
>

## The catalogue, verbatim, as `STATE.md` §THE ONE THING carried it

> **NUMBERED BY DANN 2026-09-10 ("create cardinal numbers for what deserves
> it"), all UNPLACED, all after N.114b's items 6 to 9:**
>
> **N.119, the Notation toggles reach Score markup live.** Dann: "I want
> them to." Tree facts: the open-syllabification toggle clears syllable
> overrides (`+page.svelte:2391`); the IPA line under the notes comes from
> `underlayResolvers` (`VoiceProfilePane.svelte:748-755`), which takes
> `openSyllabification` only. Code reads which toggles reach it. Own brief.
>
> **N.120, the Corrections station redesigned: context before choice.**
> Dann: "a tangled junk drawer." About twenty controls drawn at once, one
> of four stations named. Desk's recommendation, unruled: each station is a
> sentence that opens ("Duration · dotted quarter", "Pitch · B♭3",
> "Accidental · flat", "Lyric · тес, 37 / 94"), one open at a time, and
> only what applies to the taken thing is shown (nothing taken: "Take a note
> to correct it"; a rest: no Pitch, Accidental, Lyric). DRAWING FIRST,
> citing the station shape ruled 2026-08-13 and Fable's E.44 amendment
> (tether 17), then a Fable pass if Dann wants one, then Code.
>
> **N.121, RULED IN PART 2026-09-10 late, the two sets of words:** the
> singer is never surprised by which words end up under the notes. A score
> arriving with words into an EMPTY box fills the box and tags the poem
> receipt "from score" (the Piece fields' own pattern); no question; never
> overwrite a singer's words. No difference reporting, ever. No narration on
> score arrival. Dann's earlier sketch of an in-place question is
> WITHDRAWN. Also under N.121: the PDF question asks only when neither tell
> fires (Cyrillic text layer = poem; staves = score), Code to wire.
>
> **N.121, the Input band's words and the way in.** (a) RULED 2026-09-10
> 04:50: placeholder "Paste, type, or drop your poem here." and, under the
> field while empty, "A score or a photograph can go here too, or you can
> choose a file." with the last three words as the link; the pill goes;
> "poem" kept over "text" because Text is the band. French shown and
> standing (table in the path-pass brief §6). In Code with the path pass.
> (b) RULED 2026-09-10: "37 / 94 placed", « 37 / 94 placées ». In Code. (c)
> "Transcribe and fit": since N.112 text transcribes live, so what the
> button still does is NOT ESTABLISHED; Code states it before any rename;
> if it only fits, "Fit to score" / « Ajuster à la partition », coined.
> (d) the undo clause for Start placement over, "placements rebuilt" or
> Dann's better word, both languages, then the push is one line.
>
> **CORRECTED 2026-09-16, READ IN THE TREE: THE LAYER IS BUILT.** `aggregatePhonation`
> (`packages/score-parser/src/phonation.ts:298`) sums sounding time per pitch, per
> vowel, and per pitch-and-vowel, in quavers and seconds; `pachecoTessitura` is
> `packages/score-parser/src/tessitura.ts`; `totalFoldCycles` is `phonation.ts:540`;
> Insights increment 1 already calls the layer (`apps/web/src/lib/insights/insights.ts`
> imports `aggregatePhonation` and `pachecoTessitura`). **What N.123 still owes is the FIGURES** (the tessituragram drawing, the
> half-mass band, the centre of gravity, the cycle dose on the page) and two
> sources: the centre-of-gravity formula and the cycle-dose primary, both NOT
> ESTABLISHED below. The inventory's SPEC-ONLY was wrong, and so was the desk's
> "largest unstarted piece" when it proposed LATER. **Placed IN by Dann 2026-09-16.**
>
> **RULED BY DANN 2026-09-23 01:40: THE PHONATION-TIME SECTION AND THE TESSITURAGRAM ARE ONE UNIT.** Shipped as `1dfee32` on page two. Dann, on reading it: the section *"certainly pairs beautifully with the planned tessituragram. Let's plan to concatenate the new section with the tessituragram so this information can be taken in simultaneously."* **Who offered what:** the desk found that its own three-zone bar (option 1, offered 2026-09-22 23:45) repeats the tessituragram at lower resolution, and that the headline, the per-vowel list, and the seconds inside findings do not. Dann ruled the pairing. **DESK DEFAULT, not ruled:** when the tessituragram is built, the bar is struck and its three shares become labels on the drawing's shaded regions; the headline and the per-vowel list sit directly with the drawing; the section stays on page two until then.
>
> **APPROVED BY DANN 2026-09-23 01:44 to 03:18: THE TESSITURAGRAM'S DESIGN. Who offered what: the desk drew every option; Dann chose, and two ideas are his.** Built in `ccb790c` from `../sessions/brief-code-tessituragram_r2_2026-09-23.md`. Defaults, each with the case that would justify departing from it:
> - **Pitch runs up, on the singer's own stave** (Dann chose it over two other layouts at 01:44; the earlier prototype was Design's R3 drawing 1a, 2026-09-11). One stave carries clef, compass, and bars, with no gap.
> - **Faint stave lines continue under the bars (Dann's idea, 02:40), with pitch names on them at the bars' edge, never beside the clef** (Dann, 03:04: names by the clef are redundant with it).
> - **Only the sharps and flats the piece sings get a row and a name (Dann's idea, 03:15).** Each sits at its sounding pitch, half a step off its letter. The names vary from song to song, which Dann called great. Enharmonics share a row; a very chromatic song makes the figure taller.
> - **Findings are words, not numbers** (Dann, 03:01: *"the numbers alone mean nothing to the user"*). A pitch with a finding draws dark and carries the finding's tag, measure and vowel.
> - **The tessitura is shaded on the stave; the passaggio lines protrude from it across the bars** (Dann, 02:49). Zone shares sit at the right edge.
> - **Vowels are bars, not a pie** (the desk critiqued his proposed pie against Cleveland and McGill 1984 and his own Figure 6.10; he accepted).
> Departing from any of these is justified when a real score shows a singer misreading it.
>
> **RULED BY DANN 2026-09-23 03:07 to 03:13: THE VOWEL CHART'S ORDER.** Seconds per vowel prints in a fixed order, not by descending time, with the interior vowels interleaved, never grouped (he rejected the desk's offer to keep [ɨ] [ɪ] [ʌ] apart). **The order is his dissertation's (Figures 6.8 and 6.10, printed p. 91), which is also `engine/types.ts:26`: [i] [e] [ɪ] [ɨ] [ɛ] [a] [ɑ] [ʌ] [o] [u].** His rationale, 03:12: the vowels are arranged *"so that the fR1 collectively render an arch while the fR2 values render a descending curve."* Checked against his Table 5.3 (printed pp. 81 to 82): fR1 296, 381, 393, 404, 577, 711, 617, 616, 489, 346 is a strict arch; fR2 descends with three small upticks ([ɪ], [ɛ], [ʌ]). **Superseded within the same exchange:** the desk had proposed a strict IPA trace, [i] [ɪ] [e], and he accepted it at 03:11; the desk then found it breaks the fR1 arch (393 then 381) and he restored his order at 03:13. Default, with the condition for departing from it: a vowel Ilya adds later goes where it keeps the fR1 arch. `VOWELS` is unchanged. **The heading follows, RATIFIED by Dann 2026-09-23 03:14 (desk-offered):** "Seconds of phonation per vowel" / « Secondes de phonation par voyelle », replacing `insights.phonation.byVowel`'s "By vowel, most phonation time first".
>
> **SOURCES FOUND 2026-09-30, by the desk.** (1) **Centre of gravity:** Barcan 2013, p. 37 note vii (read in full, open access, `https://ro.ecu.edu.au/cgi/viewcontent.cgi?article=1342&context=ecuworks2013`), giving Rastall's PCG: number each semitone in sequence; p = (1·d1 + 2·d2 + ... + n·dn) / (d1 + d2 + ... + dn), where dn is the sounding duration of pitch n. Rastall's primary (Music Analysis 3(2), 1984, pp. 181-199) NOT fetched. (2) **Cycle dose:** Gaskill et al. 2013, JOS 70(1) (read, `~/Documents/Voice Pedagogy Library/Insights Research/_primary-text/jos-2026-09-23/`): "an estimate of the total number of cycles of vocal fold tissue oscillation, calculated from both the elapsed phonation time data and the average fundamental frequency" (300 s at 200 Hz = 60,000 cycles), citing Titze, Švec, and Popolo, JSLHR 46(4), 2003, pp. 922-935. Dann's per-note sum of f0 × seconds is the same measure at note resolution. **The 2003 primary, READ IN FULL by the desk 2026-09-30 21:55** (NIH author manuscript, `https://pmc.ncbi.nlm.nih.gov/articles/PMC3158591/`): Titze, Švec, and Popolo, "Vocal Dose Measures: Quantifying Accumulated Vibration Exposure in Vocal Fold Tissues", *JSLHR* 46(4), 2003, **pp. 919-932** (doi 10.1044/1092-4388(2003/072)). **Gaskill's footnote and this file's earlier "pp. 922-935" are wrong; use 919-932.** What it says: the cycle count is the **vocal loading index (VLI)**, Eq. 21, "the total number of vocal-fold oscillatory periods (in thousands of cycles)", defined by **Rantala and Vilkman (1999, *Journal of Voice* 13, 484-495)**, "sensitive only to F0"; normalized per second of voicing it equals mean F0. **Dann's "fold-collision count" is in the paper:** "Rantala and Vilkman (1999) hypothesized that the total VLI dose could be seen as an indicator of total number of vocal fold collisions causing damage to vocal fold tissues." Its conclusion: "the repetitive collisions of the vocal folds, would appear to pose the greater threat of injury." The paper studies speech, not singing. The equations are images on the page, so their notation was not copied. **Naming, DESK DEFAULT for Dann's eye at the wording step:** "cycle dose" is the later literature's name (Gaskill 2013); Titze, Švec, and Popolo call it the VLI and cite Rantala and Vilkman. **N.123 part 2 is unblocked on sources.**
>
> **N.123 PART 2 DESIGN, APPROVED BY DANN 2026-09-30 21:52 to 22:04.** Offered by the desk as three placements; Dann chose A (a bracket beside the bars for the half-mass band, a centre tick for the centre of gravity) and changed the passaggio lines to DASHED (21:56, his idea). **No caption on the figure** (22:00, his: *"Can't we relegate this commentary to Insights itself?"*): the half-mass and centre sentences become candidate comments under N.168 and N.173. **The cycle dose always prints** (22:03: *"It's meaningless but still interesting and repeatable"*), one line under the figure: "Cycle dose: about {cycles} (number of fold collisions in this piece)" (parenthetical his) / « Dose de cycles : environ {cycles} (nombre de collisions des cordes vocales dans cette pièce) » (desk French). **The falsetto caveat of 2026-09-10 is STRUCK** (22:04: *"Strike the caveat"*). Brief `../sessions/brief-code-n123-part2_r1_2026-09-30.md`, QUEUE row 2h.
>
> **N.123, THE AGGREGATION LAYER, numbered by Dann 2026-09-10 late,
> UNPLACED, displaces nothing until he places it.** One layer under four
> figures (E.19, 2026-07-30, found them sharing it): per-pitch and per-vowel
> phonation time in seconds; the TESSITURAGRAM (adopted from Titze and
> Maxfield, J Singing 77(5), 2021, pp. 653-661, read in full by Sonnet): the
> accumulated-duration histogram per pitch with the singer's turning points
> shaded; beneath it the half-mass band ("half the singing sits between D3
> and A3", the narrowest interval holding half the summed sung duration,
> DESK DEFAULT fraction one half, coined wording), the duration-weighted
> centre of gravity (Rastall, via Barcan 2013, formula NOT ESTABLISHED),
> Pacheco's half-maximum band drawn on the same histogram as a labelled
> second reading (Chapter 6 continuity), and CYCLE DOSE (Titze, Švec, and
> Popolo, JSLHR 46(4), 2003; primary NOT fetched, formulas from a citing
> review), which is Dann's fold-collision count: sum over sung notes of
> f0 × seconds, rests out. **RULED by Dann:** full-voiced classical singing,
> one collision per cycle in principle; the falsetto/breathy caveat is one
> line on the screen and never stops the figure. Amends E.20 ruling 9
> (2026-07-31, "a cute add-on, a learned guess"): it is a named, cited
> figure, carried with the tempo's band. Survey:
> `docs/sessions/memo-tessitura-literature_r1_2026-09-10.md` (218 lines;
> 10 sources full, 4 snippet only; Thurmer 1988 "tessiturogram" and Tessa
> 2020 not fetched). Guide paragraph, English only, r2 with dates:
> `docs/sessions/guide-tessituragram-paragraph_r2_2026-09-10.md` (N.84).
> Ruled out again: any ranking or difficulty score.
>
> **KEPT LATER BY DANN 2026-09-23 00:59**, after he asked whether the desk could build the several-voices reading autonomously and was told it cannot (`CONTRACT.md` §5) and that it sits outside the release. His words: *"keep N.124 as LATER"*. The desk's offer to write its design now was not ruled on.
>
> **RULED BY DANN 2026-09-23 00:56: THERE IS NO TEACHER MODE.** *"It wasn't written for a teacher. It was written for a user. There is no defined teacher mode versus student mode in Ilya. All users are users, all users can enjoy the same insights."* He foresees teachers using it across a studio AND individual singers using it for themselves: *"Both are valid, both are taken seriously, and both are predicted."* **So N.124 serves one voice as fully as several.** The single-voice case needs no multi-voice library. His framing of the goal, same night: one right transposition with favourable acoustic events and range fit is *"the golden egg Ilya is primed to offer users"*, and a transposition redistributes pitch, vowel, and dynamic partnerings, so it can create new challenges or show that no key works (`../sessions/method-leaps_r1_2026-09-22.md`, addendum 7).
>
> **N.124, REPERTOIRE FOR A STUDIO, numbered by Dann 2026-09-10 late,
> UNPLACED, after N.123.** A teacher holding several students' voices,
> one song. Ilya gives a curation, not a table: the original key's
> challenges in sentences (range first, on held or exposed notes, ceiling
> AND floor; then how the song sits against the passaggi, counting which
> vowels land there per Shane's per-vowel sums), then up to THREE candidate
> keys inside the voice's window, each with its sentence and what it trades
> away, or the honest finding that no key fits and another song is the
> answer ("and that's ok"). Amends the 2026-08-07 ruling against suitability
> judgements in scope: Ilya may suggest keys with reasons on their face;
> never a score, never a rank. **Pianist's key, Dann's rule:** a proposed
> transposition landing in a key pianists resist is disfavoured (six sharps
> his example; five flats acceptable); DESK DEFAULT table until he names
> one: up to four sharps or five flats count as pianistic, beyond that
> shown with a one-clause note and never chosen over an equal pianistic
> key; enharmonics respelled (C♭ as B, C♯ as D♭). **The rule never touches
> the original key** ("some pieces are written in six or seven sharps"), nor
> a candidate that lands back in it. Needs: N.123; the singer's floor and
> ceiling from calibration (what the wizard captures today NOT ESTABLISHED);
> a multi-voice library, NOT ESTABLISHED as existing; sentence copy in both
> languages, Dann's, before Code.
>
> **AMENDED BY DANN 2026-09-23 01:07: THE TEMPO CONTROL LIVES IN THE LOUPE**, not in a drawer station. Asked whether to record it, he answered: *"I accept that I said things earlier that no longer apply to the way Ilya has necessarily evolved. Join me in the present, the water is fine!"* It follows his 2026-09-17 ruling that the syllables live in the Loupe. Insights may then point to it: *"You may assign tempi manually using the Loupe."* (`../sessions/insights-phonation-time_r1_2026-09-22.md`).
>
> **N.120 gains a `Tempo` station, RULED by Dann 2026-09-10 late:** Ilya
> presets tempo from what it reads (encoded mark, or an editorial marking on
> an image or PDF), applies changes at the score's own tempo words, shows
> every one on the Score markup page (nothing hidden), and the singer
> overrides any of them without being made to articulate a tempo they did
> not choose ("death by a thousand cuts"). Shape, desk's: a sentence station
> `Tempo · ♩ = 72 · from score`, and on a taken note `from here`. The seam
> is built (E.20, 2026-07-31: override → mark → Quantz tier with band →
> abstain); per-region override NOT ESTABLISHED in the tree. Finale's
> handling of gradual cues (rit., rall., schnell) is an INBOX item, recorded
> at Dann's word, for the same station.
> **GRADUAL CUES RULED BY DANN 2026-10-01 02:37: option 2, "with qualifications".** Ilya adopts the convention MuseScore, Dorico, and Sibelius share (rit., rall., allarg. to 75 % of the starting tempo; accel., stringendo to about 133 %; linear; held until a tempo) as a labelled default, and shows phonation time as a range. Research and the desk's two options: `../sessions/memo-overnight-A10-A15_r1_2026-10-01.md` §A10. Who offered: the desk. His qualifications (capture tempo and dynamics from scans, graft from the piano, singer edits) were critiqued the same night; see the chat of 02:40 and whatever he rules next.
>
> **N.122, the capture surface as a landmark.** Dann, 2026-09-10: the
> lavender vowel-intake surface (the capture phase with the fry guide,
> `CalibrationWizard.svelte`, phase `capture`) is a surface "people will
> respond well to" and he wants it as a VISUAL LANDMARK that stays
> available to view. Ruled shape: the summary stays on screen; the capture
> surface lives inside it as a section that opens when Re-take or "Sing the
> three Ilya derived for you" is pressed, and folds when that vowel is done,
> so the table is never lost while singing. Still a phase in the wizard's
> logic; what changes is that phases no longer replace each other on the
> summary. DRAWING FIRST, citing wizard spec v1 and pacifier spec v11
> (project knowledge, tether 17) so nothing ruled there is re-decided.
> Unplaced; belongs with N.120 as "the drawer's surfaces".
> **DRAWN r1, 2026-09-10 late: `docs/sessions/drawing-calibration-surface_r1_2026-09-10.html`**,
> rendered and checked. Plate 1 is THE DRAWER GRAMMAR, every measure with
> its file and line, to go into `PRODUCT.md` once Dann ratifies it; Plates
> 2 and 3 redraw the summary to it (verbs by state, two station rows, one
> caption, Finish last) and show N.122's capture surface opening under the
> pressed row. Plate 5 asks four things, unanswered. Wizard spec v1 and
> pacifier spec v11 NOT OPENED; open them before Code is briefed.
>
> **For N.84 (Guide):** explain Revert to score header; a music file carries
> its own header text. Filed in INBOX with the mechanism.
>
> **N.115, the singer moves a measure between systems** (numbered
> 2026-09-06, UNPLACED): Finale's arrow-up on a selected measure. Research
> Finale first (his ask), then find the tree's orphaned-measure rule.
>
> **EXTENDED 2026-09-14, Dann raising it a second time.** His words: *"I want
> to offer the user the possibility of controlling the page layout themselves
> like Finale made possible through its page layout tool. You could select a
> measure and arrow down to force the measure into the next system, or arrow
> up to force the measure into the previous system. You could achieve some
> unholy collisions that way, but that was part of offering the user control.
> I think this will solve single orphaned measures, for example, and it can
> provide a little more breathing space to densely-populated measures."*
>
> Three things this adds to the 2026-09-06 note:
>
> 1. **Both directions.** Arrow down pushes a measure into the next system,
>    arrow up pulls it into the previous one. The first note carried arrow-up
>    only.
> 2. **Collisions are accepted, not prevented.** His words: *"you could achieve
>    some unholy collisions that way, but that was part of offering the user
>    control."* So the control does not refuse a bad result, and Ilya does not
>    mark one. This bears on CONTRACT §6, which forbids a mark that says Ilya
>    is unsure.
> 3. **Two motivations, not one.** The orphaned measure, and breathing space
>    for a densely populated one. The second is the same need N.129's hyphen
>    clearance serves from the other end: N.129 widens automatically, N.115
>    lets the singer widen by hand.
> 4. **The reflow is part of the feature.** His words, 2026-09-14: *"the page
>    layout would adjust beautifully after the manual intervention."* So the
>    respacing that follows a forced break is not an afterthought and not
>    merely correct: the standard is his eye. The 2026-09-06 note already said
>    "with the other measures respacing accordingly"; this sets the bar for how.
>
> **Now unblocked by his ruling of 2026-09-14** (`PRODUCT.md`): layout, measure
> distribution and horizontal spacing are editorial, and the standard is
> justification rather than prohibition. Before that ruling, "THE NOTES NEVER
> MOVE" of 2026-08-13 read as a bar on this whole item.
>
> **N.116, Learn as the book** (numbered 2026-09-07, UNPLACED). Step 1 DONE:
> `docs/sessions/inventory-n116-learn-grayson_r1_2026-09-07.md` and
> `n116-dann-lit-review-sung-russian_2026-09-07.md`. Step 2, the desk's
> proposed sequence for a singer, needs the inventory read in full and
> Grayson chapters 1, 8, 9. Rule: every chapter from Grayson cited as his;
> Dann's additions marked as his.
>
> **N.117, a progress bar on load** (numbered by Dann 2026-09-07 late,
> UNPLACED, ruled in from INBOX on the N.113a alias walk). The page takes a
> few seconds to load on reload with nothing to say so; Dann wants a progress
> bar, not a message. What the bar measures is NOT ESTABLISHED (dictionary
> load is the likeliest candidate: `input.transcribeLoading` already exists).
> Displaces nothing until he places it.
>
> **N.110, the [i] extractor harness**: set aside by Dann, briefed
> (`brief-n110-i-extractor-harness_r1_2026-09-02.md`), not built.
>
> **The print fix**: the page prints white; cause found
> (`staff-renderer.ts:2740` cream rect, `stripBackingRect` strips only the
> white page rect). Paste written 2026-09-07 (INBOX), never run; its own
> Code thread whenever, different files from the sequence.
>
> **French owed, one table after N.114:** every N.108, N.111, N.112 to
> N.114 string (`group.input`, `input.transcribe`, `input.watermark` as
> « poème », `intake.*`, `loupe.redo`, `loupe.undo.placed`,
> `loupe.undo.melisma*`, `loupe.melisma`, `paper.empty.mobile`).
>
> **Open and unplaced, small:** N.102 increment 1c (turning-layer
> courtesies), N.94, N.82 (the watch band's French), N.89 (document
> furniture, ratified from drawings), and the `#` marker in Dann's engraved
> IPA verse (his file, not Ilya).
>
> **Waiting, all Dann's to order:** N.83's walkthrough call, N.84 the Guide
> and Learn redo (after N.114), and the release order N.85 through N.88.

---


15. **THE PERIMETER IS NEVER SMALLER THAN WHAT IT CONTAINS. A STANDING RULE FOR THE
    LOUPE, promoted out of clause 14's tween timing 2026-09-18 with Dann's
    agreement** (*"Absolutely correct... the perimeter is never smaller than what it
    contains, at any frame"*).
    - **It holds standing still, during a resize, and at every frame of a tween.**
    - **Every clipping defect of 2026-09-17 and 2026-09-18 is this rule broken while
      standing still:** the half-drawn sharp that read as a microtonal accidental
      (clause 9), the caret arrowheads cut at the crop's edge (clause 6), and the
      sliver of the next measure's syllable on m. 8. Each was a perimeter smaller
      than its contents.
    - **So the whole-fixture scan tests one sentence rather than four.** A glyph, a
      caret, or any part of either that falls outside the loupe's own bounds is this
      rule failing, whatever drew it.


16. **THE HELD MEASURE'S SAGE MARK IS IN THE CODE AND NOT ON THE SCREEN. CLOSED 2026-09-19,
    2026-09-18; closed by removal, not by repair.** Dann sent a full-page screenshot showing two lavender squircles,
    one on the paper and one in the loupe, **and no sage rectangle anywhere**. His
    words: *"There is no sage rectangle... Dig deeper and convince me if I am missing
    something, otherwise actually read the code to review why you are misrepresenting
    the interfaces."*
    - **THE DESK WAS WRONG TO STATE IT AS PRESENT.** It cited comments and a token
      rather than the rendered result, which is CONTRACT tether 5. **The screenshot is
      the evidence; the source is not.**
    - **What the code says, read 2026-09-18.** `Loupe.svelte:1677-1686` creates an SVG
      `rect`, marks it `data-held-measure`, sets `fill` to `none`, sets **no stroke of
      its own**, and inserts it into the PAGE's SVG. The colour comes only from
      `:2664-2670`, `:global([data-held-measure]) { stroke: var(--sage, #839275);
      stroke-width: 1.2 }`. **So if that rule does not reach the element, the rect is
      in the DOM and wholly invisible.**
    - **Three candidates, none established.** It is never created, since the block is
      gated on `hitH > 0` and the desk has not read where `hitH` comes from; or it is
      created and the `:global` rule does not reach it; or the page's SVG re-renders
      after the insert and takes the node with it, the loupe injecting into a
      component it does not own.
    - **The one-line check, read-only, not yet run:**
      `document.querySelectorAll('[data-held-measure]').length` plus the computed
      `stroke` of the first. **`0` means never made; `1` with `none` means made and
      unstyled.**
    - **AND THE DESIGN QUESTION BEHIND IT IS DANN'S:** whether the held measure wants
      a mark on the page at all, now that the lavender squircle appears on both
      surfaces and carries the correspondence by itself.
    - **ANSWERED 2026-09-19: THE MARK GOES.** Dann ruled it over chasing the bug.
      **The reasoning, and the cost he accepted:** the squircle is mirrored on paper
      and loupe and the measure tag names the held measure in words, but those mark
      the SELECTED entry, **so with no selection, or a selection in another measure,
      the page no longer says which measure the loupe holds.** Shipped `074f230`.
      Six sites removed; four ink-survey filters naming the attribute are left, as
      compound conditions that now never match. `system-ground.ts` stays whole: the
      selection ring still calls `afterGround` from `VoiceProfilePane.svelte:629`.
      **UNWALKED.**
    - **ONE RESIDUE, AND IT IS DANN RULING TEXT SO THE DESK LEFT IT.** The comment
      below the removal, **THE LOUPE ANCHORS FIXED AND NEVER TRAVELS** (his ruling of
      2026-08-26), still reads *"the sage rectangle alone moves across the still
      page"*. True as a record of what he ruled, false as a description of the code.
      **His to amend or leave.**

## N.174. THE GUIDE EXPLAINS WHY ILYA ASKS FOR FRY. English ratified by Dann 2026-09-30 19:28

**What:** a three-paragraph Guide essay for a new user, "Why Ilya listens to your fry": what the samples are for, what fry is and why it serves (Miller 2008; Howell 2025; Herbst 2020; Titze, Maxfield & Walker 2017), and the singer's choice at a crossing (Bozeman 2021, 2010). Canonical text: `../sessions/draft-guide-fry-essay_r1_2026-09-30.md`. **RATIFIED, Dann 19:28: "Ratified, please put this somewhere where it will be triggered for inclusion in the GUIDE rewrite."**

**Rulings made while drafting, all Dann 2026-09-30:** answer "so what" before "why"; the register is Dann's own authorial voice, third person and "we", not second-person selling; no absolute declarations; in-text citations name author, title, and page so a newcomer can find them; no sung-tone capture, because fry's dense spectrum shows the resonances more clearly (Titze, Maxfield & Walker 2017, p. 382.e10); the Russian choral aside is dropped, since the Guide serves every voice type; "Insights forecasts; it does not declare" is not user-facing language.

**French RATIFIED, Dann 19:45:** "Let's use la personne qui chante, otherwise it's great!" (generic « le chanteur » replaced in paragraph 3; quotations translated and marked « nous traduisons »; « do♯2 (C♯2) »). **Next:** Code seats both under N.84 (`QUEUE.md`).

## N.173. HOW INSIGHTS CHOOSES WHAT TO SAY: THE CURATION RULES. Numbered by Dann 2026-09-24 23:45. A LIVING DRAFT

**Dann's words, 23:45:** *"I think this is a great starting place but we need to keep working this. Please make sure it has a cardinal assigned and that we don't lose this work while it gestates."* And on method: *"It is your nature to ratify and entrench my first expressed gesture; I invite you to join me in a more flexible approach, one of drafting and refinement over time while we allow relationships and nuance to emerge through working non-adjacent issues."*

**The draft lives in** `../sessions/draft-curation-rules_r1_2026-09-24.md`: the ten rules, Dann's reaction to each, the desk's revisions, and the open questions. **Not ruled.** Nothing in it is quoted back as law; each revision is dated there.

**PARTLY RULED 2026-09-28 16:28 (r4, THE GATES, in the draft):** Dann: *"yes"*. **One set of gates serves both** Markup's « Points à surveiller » box and Insights. **About two entries per printed page, as a trial** (Dann 16:30: *"I'm a little spotty on the two entries per printed page ... We will try it and see how it goes."*). Both are defaults, open to refinement (his words 16:26: *"let's stay flexible about refining them in future in case they are not just right"*). **The stakes threshold stays open:** a starting value is tried on «Скучай» and Sunless 1 and judged by what reads. Gate order and sources: the draft, r4.

**What it governs:** every Insights comment, including N.168's connections and N.172's intake answers.

**Done when:** Dann says the rules are ready to record in `PRODUCT.md`. Until then, work proceeds against the latest draft and feeds what it learns back into it.

**Dann's rulings on the draft, 2026-09-25, listed here so they do not live only in `../sessions/`.** Each was offered by the desk or by Fable and ruled in by him.
- **02:43:** no practice strategies in "something to try" (*"I think no? That feels like a general voice pedagogy instruction that should be delivered by a teacher."*).
- **02:44:** a crowded note names all its challenges (*"All of them."*).
- **02:44 and 02:45:** the treble middle voice counts as a register demand, as Miller's weak region (MIL04-021) plus the passaggio edges.
- **03:06:** the two-layer citation (author, short title, page on the comment; the full reference, section heading, page, and quotation one tap away), and the `section_heading` column, back-filled later.
- **03:35:** ~~one "something to try" shows on each comment, and the rest sit behind a tap (*"Yes."*).~~ The desk offered it; he approved it. **AMENDED 2026-09-25 13:00, Dann: "yes" to the desk's proposal**, after he said he was uneasy with one suggestion per comment (*"Multiple suggestions per comment may be justified... We do not want to inundate the user... We want Ilya to be helpful and as precise as the user wants."*): one suggestion for each challenge the comment names, alternatives for the same challenge behind the tap; at most two visible by default, highest stakes first, with a count ("1 more thing to try"); and an intake switch, "Show every suggestion", which the singer can change at any time. Which suggestion shows first is a DESK PROPOSAL in `~/Documents/Voice Pedagogy Library/Insights Research/_synthesis/draft-three-comments_r2_2026-09-25.md` §0, not ruled.

## N.172. THE SINGER SAYS HOW EXPERIENCED THEY ARE, AND INSIGHTS ADJUSTS. Numbered by Dann 2026-09-24 23:14

**Dann's words, 23:14:** *"Yes, we can adopt Dreyfus categories in our new intake section as part of the sung formant collection. Users can edit their self-identification anytime, so as undergrads progress they can enjoy a different slant of advice from Ilya. Can we build this?"* Prompted by his devil's advocate case at 23:12: the same held high [ɑ] is easy for a singer with a well-coordinated top and hard for a novice, and a quick [u] the reverse (`../sessions/draft-curation-rules_r1_2026-09-24.md`).

**The categories:** Dreyfus's five stages, as Berliner (1988, 2004) names them: novice, advanced beginner, competent, proficient, expert (Dann's outline, `~/Documents/Informed Ear Article/Outline_Informed_Ear_v7_JOS.docx` §2.3.2 and §6.2). Dann's added lay-listener stage (§6.2.1) is left out, DESK DEFAULT, because his outline defines it for listening; he can add it.

**What it does (DESK PROPOSAL, from the curation draft's rule 7):** the stage changes how hard a moment is judged to be for this singer, never how much it matters musically. It moves the threshold for "something to try" comments; it never hides the piece-level judgement or a "notice this" line. Optional; with no answer, Ilya assumes the middle stage (DESK DEFAULT).

**Where it lives:** the intake, beside the sung formant collection (`apps/web/src/lib/voice/CalibrationWizard.svelte`), editable at any time. In the profile it is one more optional field of the same kind as `range`, `tessitura`, and `passaggio` (`packages/score-parser/src/analysis-types.ts:63-77`: absent when not provided). It is the singer's own statement, not derived, so storing it keeps `CONTRACT.md` §6.

**THE QUESTIONS, DESK PROPOSAL 2026-09-24 23:20, on Dann's request of 23:15** (*"A question like 'how secure is your top?' might serve better than 'what is your level?' Can you devise a meaningful but brief array of questions whose responses will help tailor the way Ilya curates its commentary?"*). Kept inside N.172, DESK DEFAULT, because it is the same intake feature. Each question feeds one thing Ilya detects; each matches a section title in Miller 2004 (contents page, read 2026-09-24).

0. "Where are you in your singing?" Novice, advanced beginner, competent, proficient, expert. Sets the starting point.
1. "How secure are the notes around and above your upper passaggio?" High-note comments. (Miller 2004, "Developing Upper Range", p. 137.)
2. "How secure is the bottom of your range?" Low-note comments. ("Extending the Low Range in Young Male Voices", p. 163.)
3. "How even does your sound feel as you move through your passaggio?" Timbral-seam comments. ("Register Separation", p. 152.)
4. "How comfortable are long held notes?" Sustained-note comments. ("Tanking up for Long Phrases", p. 21.)
5. "How comfortable is singing softly up high?" Dynamics comments, once markings are parsed. ("*Mezza Voce*", p. 151.)
6. "What would you like from Insights?" Things to try, things to notice, or both.

Questions 1 to 5 are optional and answered "secure", "mostly", or "still developing" (rule 9: equip, never alarm). **SUPERSEDED 2026-09-24 23:30** by five labelled, behaviourally anchored points per question and per-topic switches: `../sessions/draft-n172-intake-survey_r1_2026-09-24.md`. All editable at any time; with no answers, Ilya assumes the middle.

**RULED BY DANN 2026-09-24 23:21: one panel.** *"Fold the switches into the same panel as the intake questions, one list with an answer and a switch per topic, it is a convenience that we can capture the self-reported details from the user while we intake their sung formant data."*

**RULED BY DANN 2026-09-24 23:22: "Not sure" is an answer.** *"Skipping is allowed, but not sure is valid if the respondent is not sure. We need to allow Not Sure to correspond to a default value and inform our curation. This is information, it's not nothing."* The desk had cited Krosnick and Presser (2010, pp. 281-283) against a "not sure" option; that evidence concerns attitude surveys, where the aim is a valid opinion, not a tool that tailors itself to the respondent. So each question offers "Not sure" as well as a skip, and the two are recorded differently. **"Not sure" counts as point 2, a working default** (the desk's proposal; Dann 23:37: *"Let's go with this as a working principle and adjust it if the results suck"*). Skipped counts as point 3. Revisit when the known-answer tests or N.170's singers show how it reads. **And the principle behind the intake, Dann 23:35:** *"a singer rushing through the intake might tap 'Not sure' to get it over with, and that singer will have to accept a less tailored commentary as a result. We cannot control the user, only honour their time and focus with few(er), better questions."*

**Research report:** `../sessions/report-n172-survey-research_r1_2026-09-24.md` (Sonnet, 2026-09-24).

**Depends on:** the curation rules being ruled, and on Insights connections that use the ranking. **Built alone, the question would change nothing a singer sees.** DESK INFERENCE about size: the field and the question are small; the effect is only as large as the connections that read it.

**French:** owed, drafted by the desk for Dann to rule. Agreement matters: a stage label that describes the singer agrees with the singer's gender; a label that names the stage (« stade ») does not.

**Done when:** a singer can choose and change a stage in the intake, both languages ruled, and a known-answer test shows one comment appearing for a novice and not for an expert on the same note.

## N.170. OUTSIDE EYES: REFINE ILYA WITH SINGERS AND OUTSIDE REVIEWERS. Numbered by Dann 2026-09-24 15:54

**The need, Dann's words:** *"We have developed Ilya in a silo and I want to call on outside eyes to see what we have built and make useful suggestions that we may not have thought of: elegant ways to offer controls to the neophyte user, commentary on our colour story, ideas about consolidating or streamlining functionality... more than a visual critique, I want a design critique, including how the code itself is segmented and modal-ized."* And, numbering it: *"build a sequential plan that we can carry out to refine Ilya"*, with the review packet *"part of our plan"*.

**Who offered what.** The need and the numbering are Dann's. The routes (singers watched, ADPList, a code-structure review, AI audit tools last), the review packet, and this sequence are the desk's proposal of 2026-09-24 15:51; he accepted the packet explicitly.

**The plan, in order. Each step names who does it.**

1. **Freeze a review build (desk).** When the French in flight has shipped, name the commit reviewers see, and walk it once in both languages. Reviewers get the alias and nothing else.
2. **The review packet (desk drafts; Dann rules the questions).** One page on what Ilya is and who it serves; screenshots of Texte, Annotation and Aperçus on one song in both languages, and printed; **three or four questions Dann most wants answered** (candidates: controls for the neophyte; the colour story, including INBOX 2026-09-24 on printed colour; what could be consolidated; how the modes and panels are divided); a task script for user tests; an observation sheet.
3. **Singers, watched (Dann runs; the desk supplies the script).** Three to five singers from his students or NFPVT, each with a song they know and three or four tasks, the observer silent. Findings recorded in their words. **Ranked first by the desk:** only users show what confuses.
4. **Expert design critique (Dann books).** One ADPList session with a UX or UI mentor, the packet sent ahead.
5. **Code-structure critique (desk prepares).** A fresh AI session with no project memory, given the repository and the packet's structure questions; optionally a specific question to a Svelte community. **DESK NOTE:** a model is an outside view, not an independent one.
6. **Synthesis (desk sorts; Dann rules).** Every finding goes to one of: fix before release (only under the freeze rule's exception), a release candidate, or LATER. Dann rules by cluster, not by row.
7. **Build (Code), walked (Dann).** Each ruled cluster is numbered and built the usual way.

**Placement, DESK INFERENCE, his to rule:** steps 1 and 2 in week 3 (from 2026-09-28), step 3 in week 4, step 6 before the checkpoint of 2026-10-09. Under the freeze rule, most builds from step 7 land after 2026-10-30.

**Done when:** step 6 is ruled and every cluster is numbered or recorded as LATER.

## N.168. INSIGHTS INTAKE: FILLING THE THREE STORES. Numbered by Dann 2026-09-23 17:29. "ASAP"

**2026-09-28 23:37: THE THREE COMMENTS' ENGLISH RATIFIED** (`~/Documents/Voice Pedagogy Library/Insights Research/_synthesis/draft-three-comments_r6_2026-09-28.md`). The consequence sentence (Dann 23:14): what the voice tends to do on its own; but what resisting it tends to bring. Tone, Dann 23:17: "Calm Authority: Helpful, useful, and unassailably tethered to the literature it is drawn from." Next: the French (desk drafts), the tap contents vetted, then the first-slice Code brief (`../sessions/brief-code-n168-first-slice_r1_2026-09-25.md`) updated to these templates.

**2026-09-29 22:20 to 22:51: THE DISTILLATION, AND TWO RULINGS.** Fable distilled the nine harvest memos into `~/Documents/Voice Pedagogy Library/Insights Research/_synthesis/distillation-n168_r1_2026-09-29.md` (a dated draft: 38 principles, 23 components, 11 questions for Dann; brief `../sessions/brief-fable-n168-distillation_r1_2026-09-29.md`). Rulings so far, each offered by the desk or Fable and ruled in by Dann:
- **Long phrase: 10 seconds** as the build default, credited to Miller (*Securing Baritone, Bass-Baritone, and Bass Voices*, 2008, p. 17, uncited there). Offered by Fable (question 1); Dann 22:49: *"We accept Miller's 10 seconds."* Departs if a measured source gives a different figure.
- **No "try" in what Insights says to the singer**, honouring Dayme pp. 21 to 22 as stance. E4 [i]: "You might let the jaw drop…"; D4 [u]: "If it suits your voice, let it lean toward [ʊ]…"; count "1 more thing to explore"; tap label "More to explore, and why". Offered by the desk; Dann 22:51: *"Accept them all."* "but" in the consequence sentence and "if" in "If it suits your voice" stay (desk recommendation, not separately ruled). Wording: `_synthesis/draft-three-comments_r7_2026-09-29.md`.
- **Miller bass p. 61 is not a contradiction** of the D4 [u] lean toward [ʊ] (Dann 22:49 questioned it; the desk agreed, reading the memo only). Fable's tap note for C23 is not used.
- **Breath (question 2):** Insights states phrase length and where breaths fall, and gives no rib, belly, or out-breath instruction. Default; departs only if Dann rules a breath source in by name. Offered by Fable; Dann 22:51: *"Let's go with your recommendation; breathing is fraught."*
- **Pulse (question 9), DESK DEFAULT under the breath ruling:** C19 held; no comment mentions accents or the body's pulse.
- **Marking and the octave-down run-through (questions 3 and 4):** nothing in the first slice. Offered by Fable; Dann 22:54 chose it. Revisit when a later slice has a place for it.
- **Pulse (question 9) REVISED 22:55: C19 is CUT, not held.** Dann: Insights responds "to the musico-textual object and its intersection with the singer's vocal assets", not to "profile our great breadth of pedagogy knowledge" (restating `PRODUCT.md` "What Insights is for", 2026-09-23). The test: a component with no trigger in the score or the singer's intake does not belong.
- **Naming the vowel move (question 5):** the visible line uses neither "modification" nor "migration"; behind the tap, search terms "vowel migration" and "active vowel modification" (Bozeman, KVP2, 2021, p. 95: migration is passive, active modification changes the shape). Smith's objection is left out under the test above. Offered by the desk; Dann 22:58 accepted. Bozeman's term raised by Dann 22:56.
Questions 7, 8, 10, and 11 of the distillation are still open; question 6 ("try") was settled with the rephrasings.
- **Revision 2 of the distillation, 2026-09-30 11:52 to 11:56.** DESK DEFAULTS: Grayson's short title is *Russian Lyric Diction* (title page per `claude/sonnet-memo-grayson-boa-cover-sourcing_2026-07-21.md`); C1's 15 s melisma tier stays as a marked build default; C11's tap note is cut (one measured case at constant pitch, applied to a leap). **C24, [o] sustained high, RULED by Dann 11:56** (*"I accept this reading and the C24 wording"*): the desk's reading that Bozeman KVP2 p. 49 is passive migration (the vowel on its own) and pp. 96 and 117 active modification (close vowels carried high are opened; [o] "occasionally" for non-treble), so Bozeman and Grayson agree. Wording, the consequence sentence offered by the desk, the suggestion by Fable: "This [o] on {pitch} is sustained for about {duration} seconds above the secondo passaggio you gave. Here the [o] tends to close toward [u] on its own (Bozeman, KVP2, 2021, p. 49). If it suits your voice, let it open toward [ɑ] while it stays a little rounded, and notice whether the word still reads as Russian (Grayson, *Russian Lyric Diction*, 2012, Appendix K, p. 397)." Mitton 2020 §6.2.5 behind the tap. **CHECKED against Dann's photos 2026-09-30 12:10** (`~/Downloads/IMG_4792`, `_4805`, `_4820`, `_4828`, read by the desk): p. 49 confirms "an /o/ migrates toward /u/" as "a passive modification that ideally occurs by changing the pitch with no change or compromise of the vocal tract shape". **Correction to the reading:** p. 117 names only the close vowels "(such as /i/ and /u/)"; the mid-close [o] is on **p. 26**: non-treble voices use active modification "primarily for the close vowels /i y u/, and occasi[onally] mid-close vowels such as /ɪ e ʊ o/" (the right edge of the photo cuts the word), "More often, however," they "allow the passive vowel migrations". p. 79: treble voices "must use active vowel modification (opening) on all vowels above their first formant locations". The C24 wording is unchanged (it cites p. 49 and Grayson); the record behind it now cites pp. 26 and 79, not 96 and 117. **Single-type sources, RULED by Dann 12:01 (option 1, offered by the desk):** practice methods fire for every declared type with an honest citation ("Miller describes this for tenors"): C12, C13's suggestion, C14; claims about how a voice behaves at a pitch fire only for the types the source covers: C8, C13's notice line; with no type, anything that needs one stays silent. "from the voice type you gave" appears only when the singer's type is one the source covers. **Norms pool, Dann 12:22 to 12:25:** the aim is "reasonable pools of shared qualities" per voice type, not anomalies; Kloiber included thoughtfully as role ranges (Boldrey pp. 15 to 16 correlates his labels); new experts' values must join the pool "on its own terms" (the desk's design: observation records, the table generated from them). Dann 12:25, his words: *"those edge cases may well be evidence of a desirable recategorization for the singer who features them."* Draft `../sessions/draft-voice-type-norms_r1_2026-09-30.md`; r2 takes the record shape. **Intake for any human, 2026-09-30 13:06 to 13:15.** The desk's five-step plan, critiqued by Fable (`../sessions/critique-intake-plan-fable_r1_2026-09-30.md`), revised by the desk, DESK PROPOSAL until Dann rules: (1) two questions kept apart, "could a human tract produce this" and "where among the pools", with **repeat-take agreement** (two takes of a vowel within about two semitones) as the primary acceptance signal; (2) the outer envelope from tract-length physics with a wide margin, not speech-formant tables (a trained bass [i] would fall below them); (3) per-type pools route citations and the one summary note, and never change a value Insights computes (`PRODUCT.md`, "Universal relations, individual values"); (4) a device matrix in the synthetic suite (resampled, high-passed, compressed, narrowband); the tree already turns off echo cancellation, noise suppression, and gain control (`voice/engine/live.ts:339-346`); (5) real voices from N=3 (Dann and two colleagues), growing; synthetic fixtures public, real takes private, only expected values in the repo, bilingual consent, adults only; (6) Müller 2022 and Johnson and Kempster 2010 enter only as the kinds they measure, once read; (7) personas, including singers who cannot fry, very tall and very small singers, and quiet recording in shared housing; a non-fry path later, Provisional.
- **Retire "hold" (Dann 23:23):** *"quietly retire the word 'hold' and use sustain or prolong or extend instead."* Where it means duration, use sustain, prolong, or extend; where it means keeping a shape, the desk uses "keep" (applied in r7). Default for all Insights copy; a sweep of the tree's strings is owed.
- **[ɔ] is not a Grayson symbol (Dann 23:15):** C6 and C15 must not name it. C15 fires on [ɑ] only (DESK DEFAULT). Grayson App. K p. 397: Russian /o/ is mono-phonemic; shape may vary for tone "as long as the vowel is somewhat rounded and doesn't sound like /ɑ/"; extremes open up; the highest notes are often "essentially /ɑ/". This runs opposite to Bozeman KVP2 p. 49 (/o/ migrates toward /u/). r2 of the distillation carries a separate [o] component (Grayson p. 397, Mitton 2020 §6.2.5) for Dann's ruling.
- **Courtesy verification, Dann 23:23, his words:** *"we should verify with the user without blocking their progress. Sometimes its a simple keying error, other times it's delusion and we cannot arbitrate which. Evidence should be the decider, not policing the trustworthiness of the user."* Self-reported values are valid input; Ilya asks when they look inconsistent with what is known, never blocks.
- **Voice type, OPEN, "let's give this more thought" (Dann 23:23):** the stored self-declared type (`profileStore.ts:81-88`) may serve verification and classification "if it enhances Ilya and the UX"; whether the singer sees it is undecided. Supersedes nothing yet; research-plan ruling 10 (2026-09-16) stands until he rules. **Refined 23:33, Dann's words:** *"Printing a 'likelihood' would be a number we can't defend, but accepting a self-declared label from the user is defensible and can be compared to known limits for verification."* Direction (desk's framing, his refinement): no classifier and no printed likelihood; the declared type is taken as given, and the declared range, declared passaggi, and measured resonances are compared with that type's limits in the literature (Bozeman fR1 bands, `plausibility.ts`; Miller's passaggi by category). An outlier gets a courtesy question, never a block. **The consistency check is RULED IN, Dann 23:35:** *"Yes to the consistency check, I love it."* Offered by the desk. **The standard, Dann 23:35, his words:** *"There will always be a mezzo with a high extension and a tenor with a low extension. The goal of Ilya is not universal accuracy in the detection of these outliers. If Ilya serves most of its users most of the time, this is acceptable and reasonable for a free app."* DESK DEFAULTS pending his wave-off: the courtesy question fires at the plausibility guard's margins (3 semitones below, 2 above); the singer sees the voice type as a citation ("Drawn from sources on soprano voices, from the voice type you gave"), never as a verdict, and can change it in the profile (RULED IN by Dann 23:36, "Terrific", on the desk's recommendation); question 11's five closers kept and C18 recast as a consequence sentence.
- **Voice-type labels with dignity, OPEN (Dann 23:42):** singers may declare a fine label (Heldenbariton, basso cantante, seriöser Bass, soubrette, male alto, sopranista), in English, French, German, Italian, or Russian; Ilya honours it and shows it. Desk proposal, not ruled: a lookup table maps each label to a routing parent (and to a Bozeman band bucket); the fine label is displayed, the parent routes sources; Kloiber's ranges are role ranges for casting and are not used as limits for the consistency check. Kloiber list gathered from de.wikipedia "Stimmfach" (secondary; cites Kloiber, Konold, Maschka, 16th ed., 2024); Boldrey found only partially (mezzo categories via a secondary source). **2026-09-30 00:03:** the balance rule and a 29-label shortlist RULED IN as a start (Dann: "fine as a start"; offered by the desk); draft `../sessions/draft-voice-labels_r1_2026-09-30.md`. Dann expects most singers to prefer choral categories (soprano I, soprano II, alto, tenor, baritone, bass). **2026-09-30 00:16 to 00:19, RULED:** two tiers. Tier 1 is Boldrey's p. 11 basic list (soprano, mezzo-soprano, contralto, countertenor, tenor, baritone, bass-baritone, bass) plus "Not sure"; Tier 2 is the shortlist, optional (Dann 00:16 proposed Boldrey's eight as Tier 1; the desk offered the p. 11 list; Dann 00:19: "Yes to the p. 11 list, very nice"). The chosen label prints after the singer's name on the Insights printout (Dann's idea, 00:16; the desk added: exactly as chosen, nothing for "Not sure"). Draft `../sessions/draft-voice-labels_r2_2026-09-30.md`. **French RATIFIED 00:27 (Tier 1 and intake; « baryton-basse »; lower case mid-line) and 00:32 (Tier 2; « soprano colorature », « ténor bouffe », « basse profonde »).** Slice A brief: `../sessions/brief-code-voice-type-slice-a_r1_2026-09-30.md`. **Slice A BUILT by Code 2026-09-30, uncommitted** (report `../sessions/report-code-voice-type-slice-a_r1_2026-09-30.md`). **Keep my reading French RATIFIED 10:48:** « Garder ma lecture », « Hors de la plage habituelle » (proposed by the desk and by Code independently; « plage » follows `calib.readiness.marginal`). **Revision 2 of the distillation** is at `_synthesis/distillation-n168_r2_2026-09-29.md` (Fable, 23:42; 21 principles, 23 components incl. C24 [o] for Dann's ruling, 5 questions open).

**The plan, in full:** `~/Documents/Voice Pedagogy Library/Insights Research/plan-intake_r1_2026-09-23.md`. It supersedes the pass 02 plan of 2026-09-16.

**In short.** "Comprehensive" is defined by what Ilya can observe: a finite map of conditions in the score (vowel, dynamic, held or short, approach, position) and in the voice (fo and harmonics against fR1 and fR2, passaggi, range edges). Real repertoire is run through the map for a low male and a treble voice to rank regions by how often singers meet them; collection follows that ranking. A fact enters the store only if it is detectable, consequential, and supported. A region stops when covered or when its sources run out (then Insights stays silent there).

**Who offered what.** The need, the number, and the urgency are Dann's; the map, the frequency run, the three tests, and the stopping rule are the desk's proposal of 17:28, which he accepted at 17:29.

**Done when:** every frequent region on the map, for both test voices, is covered by a vetted, tested connection or marked nothing known.

**Depends on:** the dynamics lexicon (`OWED.md`) for the dynamic dimension; score files for the dissertation's songs (only Sunless 1 is in the tree, NOT ESTABLISHED where the rest are).

## N.130. INSIGHTS HAS NO FRENCH. Numbered by Dann 2026-09-13. UNPLACED.

**The item.** Every string on Insights is English in both languages. A singer
working in French meets Ilya's third document speaking English from its identity
line to its silence lines.

**Measured 2026-09-13, and the measurement is the evidence.** `i18n.ts` holds 622
single-line entries; all 622 parsed, none unparsed. **122 carry French identical
to their English, and `:1417` to `:1475` is the largest single block, about 58
consecutive entries, all of them Insights:** the identity line and its
uncalibrated twin, the page aria, the fit heading, all four fit column heads,
every fit row label, the compass and span lines, the crossings lines, the two
tessitura qualifiers, the two withheld lines, the five flags, the five verdicts,
the findings heading and its none/further/remainder lines, the deferred heading,
the nine findings, the tessitura footnote, the unverified-citation mark, the
three method lines and the three silence lines.

**Why IN and not FLAGGED.** Dann's release sentence of 2026-09-13 names Insights
as one of three supports. **A document in the wrong language is not half-built,
it is wrong**, so this cannot ship behind a switch.

**What it needs, and it is Dann's.** The French. **Nothing is coined.** Per
CONTRACT §6, show him the whole table and say which words are adopted and which
would be coined; do not write French he has not seen.

**Four things to get right, named so they are not discovered late.**

1. **The placeholders must survive**: `{voice}`, `{date}`, `{n}`, `{total}`,
   `{low}`, `{high}`, `{primo}`, `{secondo}`, `{vowel}`, `{measures}`.
2. **Canadian French typography is already ruled**, 2026-08-21: a hard space
   before `:`, no space before `?`. **The 63 `!` and `;` sites are still not
   done** and some of them may be here.
3. **French runs longer than English**, and the fit table puts four column heads
   across one printed page. Measure before assuming they fit.
4. **N.82 is "the watch band's French" and may overlap.** Read it before
   starting, per tether 17.

**NOT THIS ITEM: the other 64 or so untranslated entries outside Insights.**
They are recorded in `INBOX.md`, 2026-09-13, with the note that some of the 122
are identical on purpose because the word IS the French word (`Notation`,
`Reconstitution`, `Provenance`, `Source`, `Transcription`, `Guide`, `Passaggio`,
`Actions`, `Pause`, `Hz`, `m.`, `Arr.`, and the IPA and glyph strings). **The
triage that separates those two groups has not been run.**

---

## N.131. FRENCH PARITY EVERYWHERE ELSE. Numbered by Dann 2026-09-13. UNPLACED.

**DESK DEFAULT on the split, and Dann can merge this into N.130 with a word.**
He asked for "the whole thing" numbered. The desk kept Insights as its own
number because the two have different urgency: **N.130 is release-blocking and
this is not.** One number would bury the blocking part inside a large triage.

**The item.** The 64 or so entries outside Insights whose French is identical to
their English and should not be. Measured 2026-09-13: 122 of `i18n.ts`'s 622
entries match, 58 of them Insights (N.130), the rest scattered from `:33` to
`:1164`.

**Step one is a TRIAGE, and it is not a translation.** An unknown share of the
64 are identical **on purpose**, because the word IS the French word:
`Notation`, `Reconstitution`, `Provenance`, `Source`, `Transcription`, `Guide`,
`Passaggio`, `Actions`, `Pause`, `Hz`, `m.`, `Arr.`, and the IPA and glyph
strings such as `ʌ → ə` and `ё ↔ е`. **Until the triage runs, the real size of
this item is NOT ESTABLISHED**, and 64 is an upper bound rather than a count.

**The triage is a farm-out candidate, costed and not run:** Sonnet, roughly 40k
to 80k tokens, mechanical classification against a file already parsed,
verifiable line by line, no French written. Dann was offered it 2026-09-13 and
chose to number and defer instead.

**Known members worth naming, because they were found by hand:**
`i18n.ts:388` `loupe.undo.placed` (fr "syllable placed"), `:391`
`loupe.undo.melisma` (fr "melisma set"), `:392` `loupe.undo.melismaOff` (fr
"melisma cleared"). **A singer in French mode reads English in the loupe's undo
line.**

**Also unresolved and probably in scope:** the 63 `!` and `;` sites left over
from the French punctuation ruling of 2026-08-21.

**Related, read before starting:** N.82, the watch band's French, and the
unnumbered watch band English header at `watchlist.ts:92` in this file's visible
list. **They may be the same item three times.**

**THE VISIBLE LABEL AND THE SPOKEN LABEL MUST AGREE. Reported by Code 2026-09-21,
ruled into this item by Dann the same evening.** His words: *"Yes please add
harmoizing the labels to N.131."*

- **The case that produced it:** N.132 renamed the tab to `Text` / « Texte » and left
  `a11y.paper` reading "Transcription" in both languages (the key, not a line number:
  Code's own edits moved it from `:142` to `:145` in the same ship). It names the
  page area that tab shows (`Paper.svelte:63`, read by Code 2026-09-21), and only that
  tab has one. **So a screen reader says "Transcription" where the tab says "Text".**
- **The scope Dann ruled is the general one, not just this key:** wherever a surface
  carries both a visible label and an accessible name, the two say the same thing.
  `a11y.tabs` sits beside `a11y.paper` at `i18n.ts:135` and is in the same family.
- **`i18n.ts:135` records that `a11y.tabs` and `a11y.paper` are the same word in both
  languages**, which is a statement about the OLD name and needs re-checking against
  whatever the harmonized value turns out to be.
- **NOT ESTABLISHED: how many other accessible names disagree with their visible
  label.** The triage in step one now has to look for this as well as for French
  parity, and one grep for `a11y.` is where it starts.


---

## N.140. THE LOUPE GUARANTEES A STAVE SPACE, AND SCROLLS RATHER THAN SHRINKING BELOW IT. Numbered by Dann 2026-09-14. UNPLACED.

> **MOSTLY BUILT, found by the code audit 2026-09-24 and checked by the desk the same night.** N.153 stage 3b shipped the core: the notation's point size is fixed and no longer shrinks to fit (`apps/web/src/lib/score/Loupe.svelte:1215-1223`), and a measure wider than the window scrolls sideways (`Loupe.svelte`, the `.loupe-window` rule). **What remains open, per the code's own comment:** whether the sideways scroll may keep a horizontal gesture on a surface where a tap places a syllable. Audit memo: `../sessions/memo-audit-code-catalogue-a_r1_2026-09-24.md`.

**Dann's design, 2026-09-14, and the words are his:** *"a contextual horizontal
scroll with notation remaining at a pre-set point size seems preferable to
shrinking the contents?"*

**The shape, as ruled: option A of the four the desk put to him.** The loupe fits
the measure to its window as it does today. **When fitting would take the stave
space below a ruled floor, it stops shrinking and scrolls horizontally instead.**
The common case is untouched.

**What the singer gets.** Today the loupe guarantees fit and nothing else. Across
one song it hands back a stave space anywhere from 5.53 px to 3.96 px, a 40%
range, set by whatever else is in the bar. After this, the notation is the fixed
quantity and the window is the variable one.

**ESTABLISHED 2026-09-14, all read in the tree.**

- The cap: `Loupe.svelte:621` takes `drawn = min(totalSpan * unitPx * magnification, width)` and `:622` derives `scale = drawn / totalSpan`. Widening `totalSpan` lowers `scale`.
- **10 of Sunless 01's 17 sung measures exceed the window at 390 px** (`memo-n138-loupe-meter_r1_2026-09-14.md` §2). The cap is the normal case, not an exotic one.
- **Width is not density.** m. 17 holds 3 notes and 6 syllables and is the WIDEST measure; the six-note measures mostly fit. A column takes `Math.max(minGap, prevDurWhole * pxPerWhole, textNeed, inkNeed)` (`staff-renderer.ts:1209`), and with `pxPerWhole` at 110 (`engraving.ts:32`) a long note claims a lot of room.
- **Landscape already relieves some of this, and it is the first thing to measure.** `+page.svelte:2080` sets the loupe's dock inset to `0` in phone portrait and `380` in phone landscape, which leaves roughly 440 px of room on an 844-wide landscape phone against a 277 px portrait window. `Loupe.svelte:510-515` names landscape as the one case where the stage and the page part company. **And rotating does not change the magnification rule:** `+page.svelte:3956` derives `isPhone` from `Math.min(innerWidth, innerHeight) < 768`, so a phone stays a phone and keeps the ruled 2.4.

**THIS IS A PHONE-PORTRAIT ITEM. Dann, 2026-09-14:** *"I spend a lot of time with
Ilya on desktop, so the extra screen real estate is a luxury and the Loupe reads
well on my desktop device."*

**And the desktop branch already implements his design intent, which is the
precedent to build the phone's floor against.** `Loupe.svelte:686-691` does not
give the desktop a fixed magnification at all. It DERIVES one to hit a target
stave space: `DESKTOP_TARGET_LINE_GAP = 12` at `:152`, divided by what the page is
already drawing, clamped between `DESKTOP_MIN = 1.2` and `DESKTOP_MAX = 2.4`. So
on a desk the notation is already held at a pre-set size and the magnification is
the variable. The phone takes the ruled flat 2.4 instead (`MAGNIFICATION`).

**Two cautions against simply copying the 12.** The desktop figure is a TARGET,
not a floor: `:621` still caps `drawn` at the window's width, so a wide enough
measure shrinks below 12 px on a desk too. And 12 px on a desk is not comparable
to 3.96 px on a phone, because the pixel densities differ. **Dann has already said
3.96 px reads well on a phone, so the phone's floor is its own number and still
his.**

Code's single desktop observation, 1024 px, T05 m. 15: head 155.7 px, panel
23.4 px, body 188.6 px in a 692 px window. Nowhere near the cap.

**TWO THINGS DANN OWES, AND NEITHER IS THE DESK'S.**

1. **The floor, in CSS pixels.** The only datum anyone has: he looked at all five scales drawn at true size on 2026-09-14 (`drawing-loupe-stave-scales_r1_2026-09-14.html`) and said they all read well, including 3.96 px. **So the floor is at or below 3.96, and on Sunless 01 at 390 px the scroll would never trigger.**
2. **Whether the scroll may take the gesture.** The loupe holds `touch-action: none` across its whole surface so the downward swipe can dismiss it (`isDismissSwipe`, `SWIPE_DISMISS_PX = 56`), and a tap inside it PLACES A SYLLABLE, on his ruling of 2026-08-26. A horizontal pan has to be separated from both without making dismissal unreliable or placing a syllable at the end of a scroll.

**THE DESK'S CASE FOR DOING NOTHING, RECORDED BECAUSE HE OVERRODE IT AND THE NEXT
SESSION SHOULD SEE BOTH SIDES.** The floor sits at or below the smallest scale he
has already approved, so on this score the scroll never fires; landscape answers
the mobile case with a gesture the singer already knows; and CONTRACT tether 13
says do nothing where doing nothing is defensible. **Dann numbered it anyway, on
2026-09-14, after reading that case.** The value he is buying is that a future
score cannot quietly drop below what he has approved.

**NOT ESTABLISHED, and cheapest to settle on a walk rather than by a build:** how
many of Sunless 01's 17 measures still hit the cap in landscape, and whether the
loupe's height still fits a 390 px tall landscape viewport once it is 40 to 50%
wider. Code measured portrait only.

**Done when:** a measure that would fall below the ruled floor draws at the floor
and scrolls instead, the dismiss swipe and the placement tap both still work on a
phone, and Dann walks it.

---

## N.141. THE SQUIRCLE HAS NO GRAMMAR. Numbered 2026-09-14. THE NUMBER IS A DESK DEFAULT. UNPLACED.

**ADDED 2026-10-05. MARKUP'S SQUIRCLE TAKES THE LOUPE'S TREATMENT. Asked by Dann at 06:55, on a picture of Markup that shows a red squircle round one notehead over «слу»** (`../sessions/picture-dann-markup-squircle_2026-10-05.png`): *"I have to be honest, I hate the appearance of the red squircles. We went to a lot of trouble when programming the Loupe to define an appropriate squircle with minimum dimensions that captures the first line of IPA. The squircle is supposed to highlight a formant/harmonic interaction. Right now it highlights an isolated notehead. Please adopt the Loupe's squircle treatment for Markup."* **Not built, and no brief is written** (`QUEUE.md` row 34). The desk that received it opened neither the rest of this spec nor the Loupe's ring code, so how the two treatments differ in the tree is NOT ESTABLISHED.

**Found by Dann on the walk of `d6580af`, 2026-09-14, across four measures of
Without Sun song 1. His words are the finding and are not a claim to be tested:**

> *"The lavender squircles need a consistent grammar. Sometimes they capture the
> IPA syllable with their note, sometimes they don't. Sometimes the squircle is
> trimmed inside the measure region, sometimes it isn't. Accidentals belonging to
> the note under examination must never collide with the squircle. Re-engrave the
> measure for the Loupe with the spacing to allow this, if necessary."*

**The number is the desk's. He described the defect and asked whether it was
captured; he did not name an item.** Wave it off or renumber it with a word.

### What the four screenshots show. READ FROM PICTURES, not from the DOM

Recorded as observation rather than as measurement, per tether 14. **Whoever
builds this measures it in the DOM first.**

| measure | what the ring encloses |
|---|---|
| m. 3 | the notehead, its cautionary natural in brackets, **and the IPA « ˈtʲi » below**. The Cyrillic « ти » is outside |
| m. 13 | the notehead, its flat, and its dot. **It stops above the IPA « ˈlʲo »** |
| m. 14 | the eighth notehead and its flag only. **The IPA « ɲi » is outside** |
| m. 6 | a beamed eighth and its flat, **and the flat's ink appears to meet the ring's left edge** |

So the ring takes the IPA on one measure and not on three, which is the
inconsistency he names first.

### THE GRAMMAR, RULED BY DANN 2026-09-14. His words, then what follows from them

> *"The squircle should always capture the IPA syllable beneath. Score markup
> knits the elements of the pitch and the vowel, so we will underscore that
> conceptually by always capturing the IPA syllable that corresponds to the note
> when there is one (this won't be possible with melismas, but we should still
> have the squircle descend into the IPA baseline as if there were a verbatim
> vowel printed there).*
>
> *A squircle must never be truncated. User should always see a fully-realized
> closed lavender squircle.*
>
> *Essential musical notation (Accidentals, dots) must never collide with the
> squircle. If the reproduction of a measure in the Loupe would demand such a
> collision, Ilya must modify the note spacing or measure spacing in the Loupe to
> accommodate the squircle without colliding with essential musical notation."*

**RULE 1. The bottom is the IPA baseline, always.** Whether or not a syllable is
printed under that note. **The Cyrillic row is OUTSIDE it. CONFIRMED BY DANN
2026-09-14 when the desk raised it:** *"We do not need the squircle to bind the
Cyrillic text."* So this is ruled, not read off his phrasing.

**RULE 2. Never truncated. The squircle is always a closed shape on screen.**

**RULE 3. No essential notation of the TAKEN note may collide with it**, and the
loupe may change note spacing or measure spacing to make room. See the permission
note below for what that costs.

**WHAT FOLLOWS, AND IT MAKES 2 AND 3 CHEAPER: every squircle on a system has the
SAME HEIGHT.** Rule 1 fixes the bottom at a constant baseline and the stave fixes
the top's range, so the shape is uniform rather than per-note. A uniform object is
far easier to guarantee closed than a shape that changes with its contents.

**THE TOP, RULED BY DANN 2026-09-14 on the desk's default.** The squircle
encloses the notehead, its accidental, its dot, and its own stem. **A BEAM MAY BE
BISECTED.** His words: *"a beam is acceptable for the circle to bisect. Of
course."* The desk's default had said the squircle never encloses a beam; he
corrected it to the simpler rule, that the squircle may simply cross one.

**SO RULE 3'S COLLISION CLAUSE IS NARROWER THAN "ESSENTIAL NOTATION", AND THIS IS
THE DISTINCTION TO BUILD TO.** What must never collide is the marks that sit
BESIDE the note horizontally and belong to it: accidentals and dots. What the
squircle may freely cross is what runs THROUGH it vertically or horizontally
without being displaced by it: stave lines, beams, and ties. The first kind
competes with the squircle for space; the second does not.

**RULED BY DANN 2026-09-14: THE GRAMMAR IS THE LOUPE'S. THE PAGE KEEPS ITS OWN
RULE, AND THEY ARE NOW TWO MARKS.** His words: *"my grammar was meant to apply to
the Loupe. I forgot that there is also a squircle as a selection on the page. The
squircle on the page should not displace the music layout, so some collisions will
necessarily occur and this is acceptable. The priority is the preservation and
focus on the selected note, so its adjacent siblings effectively conceptually
recede to the background during the selection on the page. This is acceptable."*

| | the loupe's squircle | the page's squircle |
|---|---|---|
| may re-space the music to avoid a collision | **yes**, rule 3 | **NO. Never.** |
| a collision with an adjacent note's accidental | must not happen | **accepted** |
| what it is for | examining one measure closely | focus: the taken note is primary, and its neighbours accept subordinate treatment as adjacent to it (his wording, 2026-09-14) |

**THIS SPLITS ONE ELEMENT INTO TWO, AND THAT IS THE STRUCTURAL CONSEQUENCE
WHOEVER BUILDS IT MUST START FROM.** Today there is ONE ring:
`VoiceProfilePane.svelte:501` creates it on the page and the loupe renders a clone
of that patch (`Loupe.svelte:887`, `:900`, both `{@html frame.inner}`). **The
loupe must draw its own mark rather than inherit the page's**, or the two rules
cannot both be obeyed. `system-ground.ts`'s `afterGround`, added 2026-09-14 in
`d6580af`, already places both the page's ring and the loupe's held-measure mark,
so it is the natural seam for a second mark.

**RULED BY DANN 2026-09-14: THE PAGE'S SQUIRCLE DESCENDS TO THE IPA BASELINE
TOO.** *"Yes, exactly."* So the SHAPE is the same on both surfaces and only the
re-spacing permission differs. Descending displaces nothing, so it does not
conflict with his page rule, and his reason was about meaning rather than about
the surface: *"Score markup knits the elements of the pitch and the vowel."* A
singer learns one shape and meets it twice.

**HIS PREFERRED WORDING FOR THE PAGE'S RULE, given 2026-09-14 as a rephrasing of
his own earlier sentence:** the neighbours *"accept subordinate treatment as
adjacent to the primary note under examination/focus"*, rather than "recede to the
background".

**THE DESK READS THAT AS DESCRIPTIVE, NOT AS A NEW INSTRUCTION, and says so here
so that no later session reads it as one.** It names the relationship the existing
drawing already expresses: the squircle marks the taken note, and its neighbours
are simply what surrounds it. **It is NOT read as authorizing a visual treatment
of the neighbours**, such as dimming, greying, or shrinking them. If Dann does
want an active treatment, that is a different and larger item, it would put a mark
on every note that is not selected, and CONTRACT §6's rule about a mark that
appears on everything would have to be argued through first. **He can say the word
and it becomes its own number.**

### IF THE BOX WILL NOT FIT BETWEEN THE ROWS, WIDEN THE ROWS. Ruled 2026-09-15

**The desk raised the case before it was met:** the box's bottom now encloses the
IPA row's descenders and must stop short of the Cyrillic row, and nobody has
measured whether the edge and its stroke fit in the gap between them. **Dann ruled
the answer in advance rather than waiting to be asked.**

His words: *"My vote would be to increase the space between the Cyrillic parent
and its IPA child to accommodate the squircle's bottom edge cleanly."*

**THIS IS A CONTINGENCY AND IT MAY NEVER FIRE. Dann, 2026-09-15, when the desk's
prompt read as though the widening were a step rather than a fallback:** *"I'm not
sure we need to mess with the baseline of the Cyrillic line just yet? It is a
contingency."* **Measure the gap first. If the box fits, change nothing about the
rows and say so.**

**Where it does not fit, the underlay's vertical spacing yields to the squircle
and not the other way round.** Clipping the descender by any route is ruled out,
and so is thinning the box to squeeze it in.

**HIS PHRASING IS WORTH KEEPING: the Cyrillic is the PARENT and the IPA is its
CHILD.** That is the relationship between the two rows, and it is a reason the
gap between them is Ilya's to set rather than a fixed property of the page.

**NAMED COST, and it is measurable before anything ships.** Widening that gap
makes every system taller. Fewer systems then fit a page, so the page count can
grow on a long song. **This is the same class of cost as N.129's hyphen
clearance**, and like that one it is accepted for a legibility reason rather than
paid by accident. **Measure the page count before and after on both scores.**

### HEIGHT AND WIDTH ARE INDEPENDENT. Clarified by Dann 2026-09-15

**His words:** *"I ruled every box on a system to be one height, as a means of
communicating consistency. Not every squircle will be the same width, because not
every note requires the same width to effectively capture (accidentals, dots)."*

| | rule | why |
|---|---|---|
| **height** | **constant across a system** | it communicates consistency |
| **width** | **whatever the note needs** | a note with a flat and a dot needs more room than a bare notehead |

**THIS IS WHY `RING_ASPECT` HAD TO GO, and it is the cleanest statement of it.**
That constant made height a FUNCTION of width, so a wide note became a tall one
and the consistency the height is meant to communicate was destroyed by the very
thing width is meant to accommodate. **The two are independent, and each has its
own job.**

**Do not make the widths uniform in pursuit of consistency.** The consistency is
carried by the height. A uniform width would either crowd the notes that need room
or waste it on the notes that do not.

### OVERRULED 2026-09-15: THE BOX ENCLOSES THE WHOLE IPA ROW, DESCENDERS AND ALL

**Code's build put the box's bottom BETWEEN the IPA and Cyrillic rows**, on the
grounds that a baseline edge would slice through IPA letters that hang below it,
`ɲ` and `j` among them. **Dann overruled it the same day, and the reasoning as
well as the outcome:**

> *"Nonsense. These dimensions are calculable and predictable. There is no reason
> we can't include them in planning the dimensions of the squircle. The concept at
> work here in Score Markup is the intersection of the vowel plus the pitch. The
> musical notation is effectively the pitch, and the IPA is the vowel. I want both
> captured to the exclusion of the original Cyrillic. Make it so."*

**THE RULE, stated so it is buildable.** The box's bottom encloses the IPA row's
FULL INK, descenders included, and stops short of the Cyrillic row. A descender is
a font metric and is known before anything is drawn.

**AND THE DEPTH COMES FROM THE FONT, NOT FROM THE GLYPHS PRESENT.** Dann also
ruled that every box on a system is one height. So the bottom is the IPA row's
baseline plus the FACE'S descender depth, which is constant, rather than the
lowest ink among the syllables that happen to be on that system. Three things
follow, and all three are what he asked for:

- a syllable with no descender gets the same box as one carrying `ɲ`;
- a melisma, which has no IPA at all, still gets it, which is his ruling of
  2026-09-14 that the box descends *"as if there were a verbatim vowel printed
  there"*;
- the box cannot change height when a singer edits a syllable.

**WHY IT MATTERS, in his words, and this is the reason to get it right rather than
close:** Score markup exists to hold the pitch and the vowel together. **The
notation is the pitch and the IPA is the vowel.** A box that holds the notation and
clips the vowel is not expressing the thing the document is for.

**The Cyrillic stays outside**, ruled twice now.

**The desk relayed Code's reasoning without challenging it and owns that.** The
problem it named was real; the conclusion it drew from it was not the only one
available.

### AMENDED BY DANN 2026-09-20, 23:32 AND 23:35. A FLOOR, AND GROWTH FOR HIGH NOTES

**This amends his own rulings of 2026-09-14 and 2026-09-15 that every box on a system is one
height.** Everything above stands except that clause. **CLOSED AND WALKED 2026-09-21**, shipped
in `6101e01`.

His words, 23:32:

> *"Each measure in the loupe should share a default predetermined common height based on the
> spatial relationship between the musical line and the corresponding row of IPA syllables
> immediately beneath it. The bottom of the squircle is anchored to that IPA is its baseline
> and this should always be the case. But the height of the squircle may vary for notes drawen
> above the staff. There is a minumum default height with the possiblity of accommodating
> higher notes inside the squircle for the notes that require the extra height."*

Refining it at 23:35:

> *"the minumum default should capture the distance between the IPA baseline and maybe one
> space above the stave? And notes that require more height (such as those above the staff on
> ledger lines) will get that extra height but the bottom of the squircle will always line up
> with its siblings."*

**The rule as built.** `selection-ring.ts`, `ringBox`: the bottom is the IPA baseline plus the
face's descent, identical for every box, so all siblings line up. The top is
`Math.min(staffTop, own.top) - gap`, a floor of one stave space above the stave, with a note's
own ink taking it higher. **`RING_PAD_Y`'s fixed `9` no longer governs the vertical**, replaced
by one stave space so the clearance scales with the notation. That substitution was a DESK
DEFAULT, ruled in by Dann on the walk.

**This also closed the divergence N.153 introduced.** The system-wide highest-ink loop is gone,
so nothing depends on what else is on the system and the loupe and the page agree by
construction, with no data passed between them.

**MEASURED at 390 px on all 97 notes, both surfaces:** every bottom is 54. The floor box is
59.5 units and the tallest is 73.38 (`m10-0-1`). **64 of 97 boxes exceed the floor**, because
`eventInk` includes the stem and a conventional up-stem reaches above the stave. **Dann ruled
that correct**, 2026-09-21: *"This will look the best when sopranos use Ilya."* The desk had
briefed an expectation of "only notes above the stave" and that expectation was the desk's, not
his rule.

**Open, and small:** the viewBox clamp binds on two notes of the page's first system,
`m1-3-4` losing 1.776 units and `m2-0-1` losing 0.632, so those two differ between page and
loupe. The other 95 match exactly. Brief `../sessions/brief-n141-loupe-ring-height_r2_2026-09-20.md`,
memo `../sessions/memo-n141-loupe-ring-height_r2_2026-09-20.md`, drawing
`../sessions/drawing-n141-floor-height_r1_2026-09-21.html`.

### INCREMENT: THE WIDTH IGNORES THE IPA. Found by Dann on the walk of `debdf02`, 2026-09-15

**His words:** *"Please solve the collision shown, the IPA should not be tangent
to the squircle. It is clear that Ilya's construction of squircles is insensitive
to the IPA beneath them. We need to ask Ilya to consider the IPA when it builds
squircles, not just the musical notation."*

**Observed on Without Sun song 1, three times, 2026-09-15:** m. 4 where « ɲɪ »
meets the right edge, m. 8 where « ʃʲːɪm » runs through it, and **m. 15 where the
LEFT edge is the one crossed, by the STRESS MARK of « ˈpʲe »**.

**The m. 15 case carries a detail worth building to.** The syllable's ink is not
its letters alone. **The stress mark `ˈ` sits to the LEFT of the first letter**,
and the superscript modifiers (`ʲ`, `ː`) extend it on the right. A width taken
from the letters and not from the syllable's full drawn ink will still collide,
just less often. **Measure the rendered ink of the whole IPA string**, the way
`glyphInk` already does for the notation, rather than estimating from characters.

**THE CAUSE IS THAT HIS GRAMMAR WAS BUILT VERTICALLY AND NOT HORIZONTALLY.** The
ruling of 2026-09-14 is that the squircle captures the note AND its IPA syllable.
The build took the bottom down to the IPA row, which is the vertical half. **The
WIDTH is still computed from the notation alone**, the notehead with its
accidental and dot, exactly as it was before the grammar existed. So a syllable
wider than its notehead overflows.

**THE RULE, which is not new and only needs applying to the other axis: the box's
width holds the WIDER of the notation and the IPA syllable it captures**, each
with its clearance. Where a note carries no IPA, a melisma or an unplaced note,
the width is the notation's alone, which is today's behaviour.

**THE CONSEQUENCE IS ALREADY RULED and needs no new decision.** A box widened to
hold a long syllable may reach its neighbours.

- **On the page: accepted.** Dann, 2026-09-14: the page's squircle never displaces
  the music, and *"its adjacent siblings accept subordinate treatment as adjacent
  to the primary note under examination"*.
- **In the loupe: re-space if it is needed.** Dann, 2026-09-15, `PRODUCT.md` §The
  page and the loupe answer to different things. **Cheapest route first**: the
  loupe's own mark already draws over the whole strip, so a wider box may cost
  nothing.

**WATCH FOR ONE THING THAT IS NOT A COLLISION.** The Cyrillic row below carries
its own syllable, usually wider than the IPA. **The box must not grow to hold
that**: the Cyrillic is outside the box, ruled twice.

**Done when:** no IPA glyph touches or crosses its own squircle on either surface,
on both scores, and Dann walks it.

### A LATER INCREMENT: THE SQUIRCLE SPANS A TIE. Raised by Dann 2026-09-15

**NOT part of the current build. It depends on N.142**, which gives the tie
predicate, and N.142 is not built.

**His words:** *"the tied note is one entity, so the squircle could capture the
primary note and its subsequent tied value(s). This will complicate things for the
Loupe when we have a melisma that carries over several measures, but I think we can
tackle that and create a grammar for it as well?"*

**THE MELISMA HALF IS ALREADY ANSWERED BY HIS OWN DISTINCTION, drawn the same
day** and recorded in `OPEN.md` §N.142: a tie's continuation is not a new sounded
event, a melisma's is.

- **A tie is ONE entity, so ONE squircle spans it.**
- **A melisma is SEVERAL entities under one vowel, so each note keeps its own
  squircle.** A singer can still examine any single note of a melisma, which is
  what the squircle is for.

**THREE GEOMETRIES, and only the third is hard.**

1. **Within a measure.** One wider box over both noteheads and the tie.
2. **Across a barline, inside one system. RULED BY DANN 2026-09-15: the same
   treatment.** His words: *"the Loupe only magnifies one measure at a time. A
   truncated squircle in the Loupe will trigger the user to investigate the
   following measure to see the continuation of the rhythmic value and I think
   this is a good thing."* **The opening is not a cost to be tolerated; it is the
   mark doing a second job**, telling the singer the note continues where they
   cannot currently see it.

**EVIDENCE, Dann on the walk of `76b24a3`, 2026-09-15.** Two loupe shots of
**T05** (`Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and fell.musx`;
**CORRECTED 2026-09-16**, this line first named Without Sun song 2, which has 12
measures and no ties or slurs, per Code in
`../sessions/memo-n125-slurs_r1_2026-09-11.md`), both on system 10 of 11, where he says the closed box is
wrong under this ruling: **m. 84**, A#3, half, *"this is an example of a
squircle that should imply continuation like we discussed earlier tonight,
because the rhythmic value carries past the measure's barline"*; and **m. 87**,
B3, half, *"same here"*.

**SETTLED 2026-09-16 FROM THE RENDERED PAGE: m. 84 is a tie (`data-tie="m83-0-1"`) and
m. 87 is a melisma slur (`data-slur="m86-0-1"`), so m. 84 alone is the case 2 defect**
(`../sessions/memo-n125-slurs_r1_2026-09-11.md`). The paragraph that follows is the
reasoning from before that reading.

**THE SECOND ONE IS NOT YET ESTABLISHED, AND THE DESK SAYS SO RATHER THAN
AGREEING.** Case 2 fires on a TIE. A melisma keeps one box per note, ruled
above. Both measures carry a lyric extender in the underlay (« чей, ____ » at
m. 84, « яд— ____ » at m. 87), which is the melisma's own mark, and the arc
leaving m. 87 starts ABOVE the stave, which is where the SLUR block puts it
(`staff-renderer.ts:2817`, `sy = top - 6`); a tie starts at the notehead's own
level (`:2757`, `ey = y1 ± 4`). **So m. 87 reads as a melisma slur from the
geometry, in which case its closed box is already correct and only m. 84 is the
defect.** Settle it by reading `data-tie` / `data-slur` off the rendered page,
never from the picture (tether 14).
3. **Across a system break.** One box is geometrically impossible; the notes are
   on different lines.

**CASE 3 IS ANSWERED BY DANN'S OWN PRIOR ART, shown 2026-09-15 from his
dissertation.** He met this problem engraving his doctoral edition and solved it
there.

**What his solution draws.** One shape in two pieces. The fragment ending the
upper system is **rounded on its left edge and runs square off the right of the
page**. The fragment opening the lower system **begins square at the left and is
rounded on its right edge**. So each piece is closed at the passage's true
boundary and deliberately OPEN where the music continues.

**THE SQUARE END IS A STATEMENT, NOT A TRUNCATION.** A reader sees one thing
interrupted rather than two things. It is the grammar a tie or a slur already uses
across a system break, which is the justification the desk was reaching for.

**THE DESK'S OWN RECOMMENDATION WAS WEAKER AND IS WITHDRAWN.** It proposed two
COMPLETE squircles, each closed on all sides. A reader would count two marks. His
is better and it is his own solved problem rather than a proposal.

**THE NO-TRUNCATION RULE IS AMENDED, RULED BY DANN 2026-09-15, and his wording is
the rule:** *"A squircle is never truncated WHEN THE TRUNCATION OCCURS
ACCIDENTALLY. We can use truncated squircles like the one I showed you from my
dissertation for its semiotic value."*

**So the test is not whether the shape is closed. It is whether the opening was
MEANT.**

- **Accidental truncation is forbidden**, and that is what the original rule was
  guarding: a shape cut off by a crop tells the reader nothing and looks like a
  defect.
- **Deliberate truncation is permitted where it carries meaning**, and the open
  edge then reads as a statement rather than as damage.

**THE PRINCIPLE UNDER BOTH CASES, and it is one statement rather than two
exceptions: AN OPEN EDGE MEANS THE ENTITY CONTINUES BEYOND THE REGION BEING
SHOWN.**

| the region shown | where the fragment opens |
|---|---|
| a system, on the page | at the system's margin |
| one measure, in the loupe | at the crop's edge |

**Same statement, different boundary.** Both were ruled by Dann on 2026-09-15, the
first from his doctoral edition and the second on the loupe's own terms.

**THE GUARD, in its sharper form. A deliberate opening is legitimate ONLY AT THE
BOUNDARY OF WHAT IS DISPLAYED.** Anywhere else an open edge is accidental, and the
original rule forbids it. Per CONTRACT §1.19 this is a stated rule with its
condition, and the condition is the boundary: an opening that is not at one is a
defect, not a statement.

**TWO DIFFERENCES BETWEEN HIS DISSERTATION MARK AND ILYA'S, recorded as
observation rather than as objection.**

1. **CORRECTED 2026-09-15 on Dann's word: his mark is a RED STROKE WITH A LIGHT
   RED FILL**, not a fill alone as the desk first described it. **Ilya's ring has
   no fill:** `rect[data-selection-ring]` is `fill: none` with a 2-unit
   `--lavender` stroke, hidden under `@media print`
   (`VoiceProfilePane.svelte`, the ring's own rule).

   **THIS IS NOT A DETAIL. HIS SOLUTION LEANS ON THE FILL.** At the system break
   the FILL is what runs to the page edge while the STROKE stops at the rounded
   end, and that is what makes the fragment read as a region continuing. **With
   `fill: none`, three stroked sides and an invisible fourth read as a box with a
   missing side, not as a continuation.**

   **RULED 2026-09-15: NO FILL. The squircle stays an outline**, and the reasoning
   is in `PRODUCT.md` §The squircle. So the system-break fragment needs a
   different answer from his dissertation's.

   **THE ANSWER, RULED BY DANN 2026-09-15: THE FRAGMENT RUNS TO THE MARGIN.** His
   words: *"in the tie-across-a-system case, the fragment's two long strokes must
   reach the margin rather than ending in space."*

   **Why it is needed.** A three-sided outline reads as BROKEN if it stops short of
   anything, and as CONTINUING if its two long strokes reach the boundary. His
   dissertation gets that free, because the fill runs off the page edge. **An
   outline has to be given it deliberately.** Applies at both boundaries: the
   system's margin on the page, the crop's edge in the loupe.
2. **His region encloses the stave and BOTH text rows, Cyrillic included**, where
   he ruled the Cyrillic outside Ilya's selection squircle the same day. **Two
   different marks doing two different jobs**: his marks a passage, Ilya's marks
   the note under examination. Recorded so a later session does not read it as a
   contradiction.

**Source: his own doctoral edition, shown as two page images 2026-09-15**, the
passage at measures 32 to 38 of a Mussorgsky setting, « а твой приют », with the
rose region spanning the system break.

### TWO RULINGS FROM THE WALK OF `eb918ed`, 2026-09-15

**1. `RING_ASPECT` STOPS BEING A HEIGHT FLOOR. The new grammar wins.** Dann's
words: *"the new grammar wins and `RING_ASPECT` stops being a height floor."*

**Why it had to be ruled.** Two of his own rulings had come into conflict, and the
desk brought him the case rather than picking one, per CONTRACT §1.17 and §1.19.

- **2026-08-28**: the portrait proportion is a FLOOR, so height follows WIDTH.
  `RING_ASPECT = 2.5` at `VoiceProfilePane.svelte:340`, applied at `:472` as
  `height = max(inkHeight + padding, width * RING_ASPECT)`. The comment there
  states the intent: *"Where an accidental widens the box, the HEIGHT grows to
  keep it, the box never approaches square."*
- **2026-09-14**: the bottom is the IPA baseline and the top is the note's own
  extent, so height follows POSITION and every squircle on a system is the same
  height.

**What this explains, and it was the walk's actual finding.** On Without Sun song
1 m. 7 the note carries a flat on its left and an augmentation dot on its right,
both bound into the ring's union (`staff-renderer.ts:2298` for the dot). Both
widen the box; the height then follows at two and a half times the width. **The
empty space Dann saw above the stave was the proportion being honoured, not
content being enclosed.**

**What replaces it:** nothing for the height, which is now determined by the
baseline and the note. The portrait feel survives as a MINIMUM WIDTH, which
`RING_MIN_W` at `:338` already provides, so a bare notehead is still not
shrink-wrapped.

**2. THE TURNING LAYER'S ABSENCE FROM THE LOUPE IS ACCEPTED, NOT A DEFECT.**
Dann's words, 2026-09-15: *"It's fine for now, I think including it will introduce
visual clutter when the squircle is serving adequately to raise the user's
attention. The score is always present with those noteheads so I am not
worried."*

**Recorded so that no later session reads the absence as a bug and restores it.**
The turning notehead is emitted at `staff-renderer.ts:2454` as
`<ellipse data-analysis="turning-notehead" …>`, and it carries `data-analysis`
rather than `data-of-event`, so it was never in the ring's union either.

**WHY it is absent from the loupe is NOT ESTABLISHED.** `Loupe.svelte` contains no
code that strips it. Dann offered a hypothesis, that it lives in a layer the loupe
does not capture; **that is his guess and the desk has not tested it.** It is
recorded as a guess, not as a finding, and nothing depends on it.

### THE THREE QUESTIONS AS THEY WERE PUT TO HIM. Answered above, kept for the record

1. **What does the squircle enclose?** The note alone; the note and its
   accidental and dot; or the whole vertical column including the IPA and the
   Cyrillic. **One answer, applied everywhere.** It is a reading question: the
   ring says "this is the thing you are working on", and what that thing IS is
   his to rule.
2. **May it extend past the measure's own region?** He reports it trimmed
   sometimes and not others. Whichever way he rules, it is one rule.
3. **How does an accidental stay clear of it?** This one is the desk's to solve
   once 1 and 2 are answered, because it is geometry rather than meaning.

### THE PERMISSION HE GAVE, RECORDED WITH ITS CONDITION AND NOT AS AN ABSOLUTE

*"Re-engrave the measure for the Loupe with the spacing to allow this, **if
necessary**."* Per CONTRACT §1.19 this is a stated default plus its condition,
not an edict.

**It is a large permission and whoever builds this should know its size.** The
loupe today is a CROP of the page's own SVG: `Loupe.svelte:887` and `:900` render
the same `frame.inner` through two viewBoxes. Re-engraving means calling the
renderer for the held measure alone, at its own spacing. **That buys the room, and
it costs the property that the loupe is a guaranteed picture of the page**, which
matters for an editorial instrument: what you examine would no longer be exactly
what prints. **Take the cheaper route first** and re-engrave only if the geometry
genuinely cannot be solved by moving the ring.

### RELATED, AND NOT THE SAME THING

- **N.133** removes the cream ground the ring sits on. It is a different defect
  and it does not answer any of the three questions above.
- The ring's paint order was fixed on 2026-09-14 in `d6580af` via
  `system-ground.ts`. **That was about whether the ring is visible at all, not
  about what it encloses.**
- The ring is created at `VoiceProfilePane.svelte:501` and styled at `:1326`,
  `:1335` and `:1339`.

**Done when:** one rule governs what the squircle encloses, it is the same on
every measure, no accidental of the taken note touches it, and Dann walks it.

---

## LIVE CARRY-OVER FROM STATE.md. Moved verbatim at the close of 2026-09-17

This was the tail of `STATE.md` §THE ONE THING. It is open material, so it lives here, not in `LOG.md`. Each paragraph keeps its own date.

>
> **DANN'S OWN ENGRAVING IS DAMAGED, AND IT IS NOT ILYA'S DOING. Measured
> 2026-09-14** on `~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`:
>
> - Verse 1 gives the vowelless `в` a note of its own at index 36; verse 2 folds
>   it into `ˈvʲbʲu` at 37. **The two underlays are one note out of phase**, which
>   Dorico's own render of the file shows.
> - **Words are broken across rests in both verses**, 8 in the Cyrillic and 11 in
>   the IPA, counted from the file's own `begin`…`end` marks.
> - The last word is `одинока`, one syllable short of `одинокая`, **which is why
>   the last note draws bare.** Code proved it by appending the `я`.
>
> **He engraved the IPA verse himself in Finale during his doctorate**, so this is
> a file to repair and not a defect in Ilya. **Consequence for the project: this
> score is not a usable ruler for judging seating accuracy.** A clean fixture is
> wanted before anyone judges whether words land on the right notes.
>
> **INSIGHTS, WHAT IS OPEN.** Code made five decisions of its own on N.127
> increment 1, all listed in `../sessions/memo-n127-insights-inc1_r1_2026-09-13.md`,
> all reversible, none reviewed by Dann. One row prints nothing on his Sunless
> score because measure 17 does not add up to its time signature. At 390 px the
> head does not fit three documents: 237.97 px for labels needing 265.19.
> Increment 2 is the compass.
>
> **INSIGHTS, THE EVIDENCE BASE, set up 2026-09-15 (a research thread, no code).**
> The plan and Dann's rulings are in
> `~/Documents/Voice Pedagogy Library/Insights Research/Insights-Research-Plan.md`,
> with a copy in project knowledge at
> `claude/spec-insights-research-pipeline_2026-09-15.md`. The source list (153
> sources) sits beside it, in `Insights-Research-Sources.csv`, md5
> `049b1b0635e706f057ae4b8a5b603613`. **Status 2026-09-16:** 36 articles and
> Bozeman PVA 2nd ed. (Ch. 4 to 9, 13, Definitions, App. 2 and 3) extracted by
> Sonnet into `_extraction/`. Step B briefs written, NOT RUN: core
> `brief-insights-step-b-core_r5_2026-09-16.md` plus addendum
> `brief-insights-step-b-pass01_r5_2026-09-16.md`, in two stages (01a, Dann
> reviews, 01b). The plan's section "Purpose and design rulings (2026-09-16, late
> session)" holds twelve rulings from that night (tiers, blind spots, tethered
> abstraction, the ten-vowel set, Bozeman surrogates on a continuum between
> charts, no pronouncements on identity) and the rulings still owed. The build
> consequence is one line in INBOX.md. **Stage 01a is running in Fable** (started
> 2026-09-16 late); see THE ONE THING for what follows. Waiting: Elsevier's reply
> on Journal of Voice access.
>
> **BRIEFS WRITTEN AND NOT RUN, corrected 2026-09-14:**
> `brief-n117-dictionary-fill_r1_2026-09-12`,
> `brief-n119-toggles-reach-score-markup_r1_2026-09-12`,
> `brief-colour-stage4_r1_2026-09-14`,
> `brief-n135-ocr-measurement_r1_2026-09-14` (its measurement RUN, memo landed).
> **N.118's brief ran on 2026-09-14 and the colour token rename is done.**
> **N.119's brief row on `Open syllables` is already corrected** (brief line 89,
> "NO. CORRECTED 2026-09-14"; checked by the desk 2026-09-16). See N.136.
>
> **THE COLOUR STORY, RULED AND PLANNED.** The principle, the five-hue map and
> the six-stage plan are in `../sessions/plan-colour-story_r1_2026-09-13.md`, with
> the full ruling in `INBOX.md`. Learn moves rose to umber; nothing else moves.
> **Stages 1, 2, 3a and 3b are done and walked. Stage 4 is the one thing above.**
>
> **N.129, THE UNDERLAY IS SPACED IN THE WRONG FONT'S METRICS. Numbered by
> Dann 2026-09-13. UNPLACED.** `underlay-widths.ts:690` declares its table as
> "Per-1000-em advance widths for **Source Serif 4** Cyrillic", and the
> renderer uses it for the syllable column advance
> (`staff-renderer.ts:754-762`) and for hyphen and extender endpoints
> (`:2742-2750`). The page has drawn those glyphs in **Source Sans 3** ever
> since the paginator began stripping the renderer's serif root
> (`page-layout.ts:376`). So every syllable's spacing and every hyphen and
> extender end on Score markup is computed from metrics the glyphs never had.
> Code measured about 5% on one word, « ночь » 27.72 serif against 26.34 sans.
>
> **THE 27.72 FIGURE IS WRONG AND THE GAP IS TWICE WHAT THIS PARAGRAPH SAYS.
> MEASURED 2026-09-20 ON `e75d6f3`, in Dann's own Chrome, after the walk.** Summing
> the table's own entries for « ночь » (`н` 670, `о` 586, `ч` 605, `ь` 537 per 1000
> em) gives 2398, which at 12.5 px is **29.98 px**. The browser draws the serif at
> **29.80 px** by two instruments that agree, SVG `getComputedTextLength` and canvas
> `measureText`. The sans draws at **26.34 px**, which matches the recorded sans
> figure exactly and is what validates the instrument.
>
> **So the error this item corrects was 29.98 against 26.34, about 12.2% and roughly
> 3.6 px on one four-letter word, not "about 5%".** The 27.72 came from Code's
> loupe-typeface memo of 2026-09-12 and was never checked against the table.
> **`INBOX.md:144` still carries it and is left alone, because it is a dated record
> of what was read that night.** Every "5% out" elsewhere in this file, including
> item 7 of the block below, reads 12.2%.
> Candidate fixes, unruled: remeasure the table in Source Sans 3, or make the
> face a parameter so the two cannot diverge again. **Bears on N.118 and on
> the `columnAdvance` crowding item already in OWED.** Found by Code inside
> the loupe-typeface memo; the desk read all three sites itself.
>
> **RULED BY DANN 2026-09-20, 13:02 and 13:09. THE CANDIDATE FIXES ABOVE ARE NO
> LONGER UNRULED, AND THE DIRECTION IS THE OPPOSITE OF THE ONE BRIEF r1 ASSUMED.**
>
> **The desk proposed serif and Dann ruled it in.** The desk put two options to him:
> remeasure the table in Source Sans 3, or draw the underlay in Source Serif 4, which
> the table already measures. He answered `A`. **The option was the desk's; the ruling
> is his.**
>
> **THE RULE, ratified 13:09.** Cyrillic the singer reads is serif, wherever it
> appears. Cyrillic that instructs is sans. Any surface that draws Cyrillic at a size
> other than 12.5 px re-instances the width table at its own optical size rather than
> rescaling it.
>
> **`Reading voice` and `Instrument voice` are ADOPTED, not coined.** They are the
> tree's own terms at `IntakePanel.svelte:762-764` and `:833-836`, which cite a brief
> section 3.6 as having ruled the principle. **Which brief that is, is NOT
> ESTABLISHED.**
>
> **AN EARLIER WORDING WAS RATIFIED AT 13:07 AND CORRECTED AT 13:09. DO NOT QUOTE IT.**
> It read "Cyrillic on paper is serif, Cyrillic in the interface is sans". It was the
> desk's drafting and it was wrong: it would have turned the drawer's poem field
> (`IntakePanel.svelte:767`) and the loupe's syllable row (`LoupeSyllables.svelte:232`,
> `:295`) sans, reversing decisions that are built and commented with their reasons.
>
> **READ IN THE TREE 2026-09-20, and this is what the ruling rests on:**
>
> - `staff-renderer.ts:3327` is the ONLY emission of Cyrillic underlay text, and it
>   carries no `font-family`, so it inherits the SVG root.
> - `staff-renderer.ts:3462` sets that root to `'Source Sans 3'`. **The root also feeds
>   measure numbers (`:2238`), tuplet numerals (`:2301`) and time-signature digits
>   (`:2579`), which are not Cyrillic and which this ruling does not touch.**
> - `underlay-widths.ts:690` still declares Source Serif 4, **so the table is already
>   correct for the ruled face and step 1 is no longer a remeasurement.**
> - `app.css:23` sets `--font-serif: 'Source Serif 4', Georgia, 'Times New Roman',
>   serif`; `:24` sets `--font-sans`; `:209-210` set `--font-body: var(--font-serif)`
>   and `--font-ui: var(--font-sans)`.
> - `app.html:16` already loads both faces, so the ruled face costs no new font load.
> - `WordStack.svelte:263-264` and `TitleHeader.svelte:153-155` are already serif, so
>   the score's underlay is the LAST Cyrillic in Ilya drawn against the rule.
> - `Loupe.svelte:990-992` and `:1041` read the face off the page's own clef `<text>`,
>   so the loupe follows the page and needs no separate change.
> - `Loupe.svelte:9`: the loupe is a VIEW TRANSFORM, not a second renderer, so the
>   optical-size clause cannot bite today. **It bites when N.153 re-engraves the measure
>   at its own spacing**, which `SEQUENCE.md:43` puts directly behind N.129.
> - `underlay-widths.ts:65-71` is where the optical-size clause comes from, in the
>   file's own words: the table is pinned to `opsz=12.5`, a larger size resolves a
>   narrower instance, and you re-instance rather than rescale.
>
> **BRIEF r1 IS SUPERSEDED BY**
> `../sessions/brief-n129-underlay-ruler_r2_2026-09-20.md`.
>
> **FOLDED IN 2026-09-14 ON DANN'S WORD, found by him on the N.118 walk.**
> He read `не прог ляд – на я,` on the page and counted three hyphens missing
> from one word.
>
> 1. **Ilya omits a hyphen silently whenever two syllables' ink comes within
>    4 px.** `staff-renderer.ts:2761-2763`: `from = rightEdgeOf(a) + 2`,
>    `to = leftEdgeOf(b) - 2`, then `if (to <= from) continue`. The 4 is two
>    paddings, not a chosen engraving value.
> 2. **The file contradicts itself.** `clampHyphenX` handles a gap narrower
>    than the hyphen by centring it and letting it overhang, and says so in
>    its own comment: *"Omitting the hyphen instead is a Gould question (rules
>    26 to 40, unread), so it is not taken here."* The loop omits before
>    `clampHyphenX` is ever reached.
> 3. **Gould rules 26 to 40 are still unread**, recorded at
>    `../sessions/memo-n113-melisma_r1_2026-09-07.md:223`, and the book is not
>    on this machine.
> 4. **RULED BY DANN 2026-09-14:** *"I don't want Ilya dropping hyphens.
>    Instead, I want the note spacing to shift to permit the appearance of
>    hyphens properly."* So the omission goes, and the spacer widens instead.
> 5. **The fix's shape, DESK INFERENCE and his to wave off:** a gap between
>    two syllables of ONE WORD takes a larger floor than a gap between two
>    words, sized to the hyphen plus its clearance. Today there is one floor,
>    `INK_CLEAR_SP = 0.5` stave spaces (N.103), and it knows nothing about
>    hyphens.
> 6. **Named cost:** widening word-internal gaps means fewer measures per
>    system and different pagination on every page, not only on tight words.
> 7. **This work sits on top of the wrong-metrics fix, not beside it.** A
>    hyphen clearance tuned against a table that is 5% out is tuned against a
>    bad ruler.
>
> **SCOPE RULED 2026-09-14, and item 5 is unblocked.** The desk asked whether
> his ruling of 2026-08-13, "THE NOTES NEVER MOVE", barred widening a column to
> fit a hyphen. His answer, recorded in full in `PRODUCT.md`: *"Sometimes I want
> the notes to move to accommodate legibility in the text underlay. The
> engraving is not the composer's; it is a highly edited aspect of the
> musico-textual object that is subject to our scholarly intervention. We can
> freely rearrange the page layout and measure distribution to accommodate
> legibility and logic. We don't want to interfere with these elements without
> justification."* **So layout, measure distribution and horizontal spacing are
> editorial, and the standard is justification rather than prohibition.**
>
> **N.94 SLICE 2 BRIEFED 2026-09-28 22:30:** `../sessions/brief-code-n94-slice2_r1_2026-09-28.md`. **French RULED 22:27** (*"Ratified"*; desk's draft): « Comporte 1 double bémol / {n} doubles bémols / 1 double dièse / {n} doubles dièses », « Tonalité imprimée · {tonic} », « Choix d'Ilya · {tonic} », « Essayer cette tonalité ». English readout changed from "Reads with" to "Carries" to match. Insights follows the chosen key under curation rule 3. Not in the tree until a grep shows it.
>
> **N.94 SLICE 2, RULED 2026-09-28 21:41** (Dann: *"I like your logic and your recommendations. Proceed"*). Dann proposed greying out a key past a threshold of double accidentals (about 20%); the desk recommended comparing enharmonic twins instead, and he agreed. **For each twin pair (C♭/B, G♭/F♯, D♭/C♯), Ilya counts the double accidentals each would draw; the twin with more is dimmed but stays tappable, its readout adding the count ("Reads with 12 double flats"); Ilya's pick always lands on the cleaner twin; keys without a twin never dim.** Slice 2 also carries the phone dock and Insights' "Try this key". The readout string's French is owed, drafted by the desk when slice 2 is briefed. Rests on `PRODUCT.md`, "Transposition moves every note by the same interval" (21:35).
>
> **N.94 FRENCH RULED 2026-09-28 19:28** (Dann: *"Ratified"*; drafted by the desk). The table is
> `../sessions/brief-code-n94-key-ruler_r1_2026-09-28.md` §6: « Tonalité : {key}, telle qu’imprimée »,
> « Essayer une autre tonalité », « Tonalité : {key}, après transposition », « Tonalité imprimée »,
> « Annuler », « Utiliser cette tonalité », readout « Une tierce mineure plus bas · si majeur · recommandation d’Ilya »
> (« plus haut » derived by the desk), header « Transposition d’une tierce mineure vers le bas à partir de ré majeur,
> au choix de l’interprète. » **Not in the tree until a grep shows it.**
>
> **SUPERSEDED 2026-09-28: the home is the Piece band and a floating Transposition ruler (Dann accepted drawing r4). See `STATE.md`, "N.94, THE TRANSPOSITION RULER".** **SUPERSEDED IN PART 2026-09-16: the control belongs in the Score Markup section, between Corrections and Voice (Dann), and N.94 is IN the release.** **N.94 HAS A HOME AGAIN, 2026-09-13.** Numbered 2026-08-24 as "transposition
> interface, modelled on Newzik" and never built. It is now a **station inside
> the `Melody` band, sibling to Corrections**. Established: the ENGINE already
> exists and ships. `packages/score-parser/src/transposition.ts` exports
> `transposeScore`, `suggestTranspositions`, `spellPitch`,
> `keyNameAfterTransposition` and more, built so the watch list names computed
> keys rather than guesses (Dann's ruling 2026-07-20), wired at
> `watchlist.ts:476`. Only the control is missing. **Re-read
> `claude/e31-late-rulings-and-the-transposition-control_2026-08-07.md` first**
> (rulings 9 to 14, the detented-ruler spec); it is 37 days old and its
> amendments are unchecked, per tether 17.
>
> **THE NAMES, RATIFIED 2026-09-13, BOTH LANGUAGES.** Tabs: `Text` / « Texte »,
> `Markup` / « Annotation », `Insights` / « Aperçus ». Drawer band:
> `Melody` / « Mélodie ». The French mirrors the English throughout and
> nothing is coined. **Tab padding goes 0.7 rem to 0.5 rem** to fit the French
> row, returning 19.2 px; afterwards English has 55.07 px spare and French
> 15.64 at a 390 px viewport. **OWED: nobody has seen 0.5 rem on screen.**
> This supersedes the `MARKUP` band rename of 2026-09-12.
>
> **THE TEXT-TO-SCORE SEQUENCE, RULED BY DANN 2026-09-06**, one path through
> the pairing layer: 1 N.108-5 cleanup DONE; 2 N.112 the text is
> authoritative DONE; 3 N.113 the melisma DONE; 4 N.114 the syllable line
> under the poem DONE 2026-09-09 (narrowed from Type Into Score), N.114a
> and N.114b 1 to 5 DONE 2026-09-10. **Then, inserted by Dann 2026-09-10:
> the drawer as a path (Design consulted), carrying N.119 to N.122 and
> N.118.** Then N.110 (set aside, briefed), N.115, N.116, the release
> order N.85 to N.88, N.84 (Guide and Learn), N.83.
>
> **N.127, INSIGHTS, numbered by Dann 2026-09-11 evening (first ruled as
> N.126 in-session; renumbered after the desk missed `STATE.md:497`, the
> collision is the desk's error, owned in-thread). UNPLACED. Ilya's third
> document, sibling to Transcription and Score markup, third member of the
> `DeskHead` pair.** Rulings, all Dann's 2026-09-11: read-only, never an
> input surface; every line computed from the singer's inputs or a sourced
> advice string a predicate fired; appears the instant voice information
> exists, thin to deep, broad-analysis pattern inherited; content in a
> squircle inheriting the watch band (`VoiceProfilePane.svelte:1532-1533`),
> which migrates off Score markup wholly, leaving it pure notation;
> governing colour dusty rose `--dusty-rose #A67B7B`, inks luminance-keyed;
> page one fixed at one page, a second page only when earned, fired advice
> printed there in full; citations as footnotes, attribution in Guide and
> footer; page one ordered for the choosing moment; identity head carries
> voice name, composer, title (DESK DEFAULT: calibration date joins it,
> which would close N.19); section headers take `TitleHeader.svelte`
> `.metadata-line` recipe in rose ink; the compass stave's clef follows the
> SINGER via `chooseClef` on the declared range's median (tenor
> treble-8vb-by-range refinement recorded here, not yet designed); the foot
> is one apparatus block, Insights' copy of `footer.attribution` drops the
> lieder.net clause, siblings untouched; the labelled teacher's blank is
> DEAD, unlabelled negative space stays. Six curation criteria ruled as a
> LIVING list (see the brief), headline: helpful not comprehensive; one
> entry per hazard anchored by its weightiest instance in the Loupe's
> measure-tag grammar; Score markup answers where, Insights answers what,
> how much, and what to do; silence is a finding. Record:
> `docs/sessions/n127-design-pack/` (commits `e0c34c1`, `52517e6`). Design
> returned R1 to R3 the same evening; R3 carries the three clef passes and
> the French-proved foot; a six-item refinement message is with Design
> (stave to 8 px line gap, no note-name captions, mini-squircle collision
> law, G clef curl on the G line, binding-squircle footprint with two
> treatments for Dann to rule, foot daylight and right-indented hairline).
> **Design's returned HTML lives only in Dann's Downloads; commit the
> latest into the pack at the next touch.**
>

---

## RESIDUES OF ITEMS CLOSED 2026-09-16. Specs in `../sessions/LOG.md` block 20

- **N.142 step 2.** Placements already on a tie's continuation: push forward (ruled by
  Dann 2026-09-15). Blocked on a count of such placements in Dann's library, which Code
  cannot read (`../sessions/memo-n142-tie-prolongation_r1_2026-09-16.md` §5). The desk
  reads it through Chrome on the branch alias. Build only if the count is not zero.
- **N.145.** A poem pasted after a score with no words is placed at once
  (`apps/web/src/lib/score/first-seat.ts`); not walked, because no wordless score was
  to hand.
- **N.144.** An edited poem still takes the old note-counting path on Start placement
  over, so it can still break a melisma (Code's choice, reversible).
- **N.143.** T05's second lyric line is not IPA (the parser reads `box` on its first
  event); whether other `.musx` files carry an unused `lineOrder` slot is NOT ESTABLISHED.

---

## N.148, N.149 and N.150 are CLOSED. Their account moved to `../sessions/LOG.md` block 25 on 2026-09-20.

Shipped over `6ca97db`, `be792b6`, `38dac87` and `c582892`, each walked by Dann.
**The loupe's Syllables-mode spacing rulings that used to sit here have moved into
N.153's section below, where they belong: they are loupe-local spacing, not the mode
split.** Nothing was reworded in either move.

## N.151. THE MEASURE EDIT SURFACE, WITH INSERT. Numbered 2026-09-17, DESK DEFAULT number. Report: `../sessions/report-n151-note-entry_r1_2026-09-17.md`.

**CORRECTED 2026-09-17, the same night, by the desk:** insertion is BUILT, as N.92 slice 3. `correction.ts` carries `entered: { after }` (`:48-100`), `applyCorrections` emits hand-entered events (`:305-345`), `synthesize` seats them (`:496`), `reflowOnsets` re-times the measure (`:382-433`), and the singer reaches it today by walking the prev and next arrows into a GAP, where a duration cell enters a note (`CorrectionSurface.svelte:539-541`). The desk's earlier sentence, "nothing in Ilya inserts a note", was written without opening the file and is struck. **The real finding is Dann's own tether 22: the capability exists and is hard to find.**

**The design, drawn 2026-09-17** (`n151-measure-edit-surface.html`, sent in the session, not in the tree): the loupe says whether the measure adds up, then shows the measure as note chips with a caret between them. A caret inserts, a chip selects, and the length, pitch and accidental cells act on the selected chip. Insert is a PLACE, not a mode, which is where the design departs from Finale, MuseScore and Flat.io alike.

**RULED BY DANN 2026-09-17: the measure must tolerate more beats than the meter allows.** His words: *"in cases of redrawing tuplets, the Ilya measure must tolerate having more beats than the measure allows, this is because a tuplet until it is grouped as such, will 'overstuff' the measure."* So:

- Ilya never refuses an edit because the measure is over, never deletes to make it fit, and never re-bars on its own. Finale's "There Are Too Many Beats In This Measure" dialog and its four remedies are NOT adopted.
- The fill line reports three states in the same neutral voice: short, adds up, over. Over is a normal state on the way to a tuplet, not an error, and it carries no red and no blocking.
- **AMENDED by Dann the same night: an unattended over-full measure IS flagged.** His words: *"I agree to flagging the user that an unattended measure is overstuffed! We just need wiggle room to allow say a sextuplet of sixteenths in the space of a quarter note until the sixteenths can be bounded as a sextuplet."* So the tolerance is for the work in progress, not for the result.
- **While the singer is in the measure:** the fill line states the count and nothing happens. Six sixteenths in the space of a quarter are over until they are bounded as a sextuplet, and Ilya waits.
- **Once the singer leaves it over:** the measure is flagged, and the flag persists until the count resolves. DESK DEFAULT, reversible: the loupe's fill line carries it whenever that measure is raised, and the page marks the measure itself, quietly. A page mark is justified here because it is rare and specific, which is what `CONTRACT.md` §6 asks of any mark: a mark that appears on everything says nothing.
- Still open, and Dann's: whether a measure left over may print, and what the analysis says about a song that holds one.

### N.151, RULED BY DANN 2026-09-17: THE EDITED SCORE COMES BACK OUT, AS AN EDITED COPY, AND THE SINGER'S OWN TEMPO COUNTS

His words: *"Ideally a corrected score comes back out of Ilya, but we conceded that it is an edited copy. The user may decide to impose tempo markings that reflect their personal performance practice but are not strictly attributable to the composer. This is permissible, and it will affect their (the user's) phonation time computation so we allow it, as a nod to the actual performance as opposed to the Platonic ideal high-fidelity composition."*

- **Ilya exports what the singer corrected, and the export says it is an edited copy.** It is never presented as the composer's text.
- **A tempo the singer imposes is legitimate input**, even where no composer wrote it, because Ilya is describing the performance the singer intends.
- **Consequences, DESK DEFAULT, reversible:** every phonation-time figure that rests on a singer's own tempo says so where the figure is read, and the export carries the same statement in its file. An uncited number is the thing Ilya exists to refuse (`PRODUCT.md`, "Why Ilya exists").
- **Still open:** the export's format and where it sits in the drawer, and whether corrections survive replacing the source file.

### N.151 AND N.152, RULED BY DANN 2026-09-17 (a long design exchange; his words quoted)

1. **Tempo anywhere, the singer's or the composer's.** *"I think the user needs to be able to go in and apply tempo markings anywhere in the score, whether the composer placed them or not. This is for the user, to facilitate their choices in performing the piece."* Tempo is therefore a first-class, singer-editable fact, not an import-only one.
2. **N.152. PLAYBACK OF THE MARKUP. LATER, its own cardinal, asked for by Dann 2026-09-17.** His reasoning: a singer choosing repertoire can listen on a phone or a desk instead of going to a piano or hunting a recording. Scope as he gave it: a prominent Play control with its siblings (play, pause, rewind, fast forward), navigation by measure number, and a choice of timbre (choir, flute, saxophone, piano, synthesizer). **The desk owes two pieces of research before this is specified:** the current sound sets worth offering, and what transport controls actually serve this use, which is study rather than production. Tempo, articulation and the four singer's marks all feed it, which is why N.151 comes first.
3. **WYSIWYG, stated plainly by Dann:** *"Ilya's WYSIWYG GUI is exactly that: if it appears on Ilya's page, it can be printed."*
4. **There is no stopping rule, and that is deliberate.** *"I don't see a stopping rule or boundary for the user. They should be able to intentionally break a score or even recompose one... they maybe able to enter a melody from scratch using Ilya only as the composition device! Why not?"* So the edit set is not fenced by "repair only". **The desk's note, for the record:** N.151 as specified still delivers the repair case first; composing from scratch needs measures and a meter to exist before a note can be placed, and nothing in the tree creates an empty song's first measure. That gap is named, not solved, here.
5. **Files: deliberate destruction only.** Dann: *"if the singer wants to overwrite the file, they should be able to. Or even delete it and start again. What we don't want is the unwitting deletion or overwriting of files the user still wants."* Replace and Delete stay, each behind a clear act.
6. **The composer's notation binds the edit set too.** Dann: the set is *"beholden to what the composer has written and the specifics of their notation... especially if that notation impacts aspects that will meaningfully affect the performance."* So Ilya must be able to hold what the page holds where it changes the singing, not only what Ilya's own arithmetic consumes.

### THE CALM LOUPE, 2026-09-27 AND 2026-09-28. Seated here at the close of 2026-09-28 so they do not live only in LOG

Built and shipped (`7d2fcd6`, `8127e01`); walked by Dann 2026-09-28 14:47 and 16:01.
- **RATIFIED by Dann 2026-09-27 21:26** (*"Sure"*): pitch steps stop at **C1 and C7**; at a bound the key and the hold do nothing and nothing goes to Undo. A bound moves if a real score is found that writes past it. In the tree: `lib/score/correction.ts:198-214`.
- **RATIFIED by Dann 2026-09-27 20:07** (*"I agree, ratified"*): while the singer stays on one measure, the frame may grow but never shrinks, and the magnification may drop but never climbs back; eased about 150 ms, none under reduced motion; both reset on a new measure or on closing. The frame opens tight, as clause 12 rules.
- **Proposed by Dann 2026-09-27 20:05, recommended by the desk:** a second click on the filled mode pill closes the panel.
- **Dann's proposal 2026-09-27 21:22**, extending ruling 6 of 2026-09-20: the music window scrolls inside itself; the card and its buttons never move while a pitch is held.
- **DESK DEFAULTS under Dann's delegation of 2026-09-28 01:36** (*"Take best practices and apply them to this interface and make the Loupe work elegantly for us"*), walked by him: in Syllables mode the music keys (Up, Down, `+`, `-`, digits, `.`, Delete) do nothing; one squircle marks every stop, note, rest and caret alike (`stop-ring.ts`).
- **Seen, not a defect yet (14:47):** with a note at E1 the window follows it down and the IPA and lyric rows scroll out of view. Whether slice 7 settled it is NOT ESTABLISHED.

### THE CARET, RULED BY DANN 2026-09-17 (the N.92 insert-reach slice, drawn in `n92-carets-on-the-measure.html`)

1. **The caret is terminated, not a bare line.** His words: *"it terminates the lines you've drawn with arrowheads pointing inward. This symbol, exceeding the stave limits as you have drawn it, with these termini, are much less likely to look like erratic barlines and more likely to look to the user like insertion opportunities."* So: a vertical mark that runs past the top and bottom staff lines, with an arrowhead at each end pointing inward toward the staff. The desk's drawing had one arrowhead and is superseded. **Whether Finale's own insertion bar carries arrowheads is NOT ESTABLISHED**; the research memo records only "a thin vertical cursor" and a pitch crossbar. The ruling stands on its own reasoning, not on Finale's.

3. **THE CHIP ROW RETIRES. Ruled by Dann 2026-09-17 late, on the desk's
   recommendation.** His words, when the desk put the two places to him: *"I think
   we decided aghainst the chips?"* **The desk searched before answering and found
   no earlier decision:** `../sessions/spec-n92-edit-surface_r1_2026-09-17.md:57-59`
   still carried the chip row, `../sessions/report-n151-note-entry_r1_2026-09-17.md:226`
   still recommended building it, and nothing in `docs/memory/` or `docs/sessions/`
   recorded a ruling against it. **So this clause is the ruling, not a record of one.**
   - The caret is drawn on the engraved measure in the loupe, across the stave, per
     clause 1. The measure is never drawn a second time as a row of chips.
   - A note is selected on the notation, which is what the tree already does
     (`../sessions/memo-n92-edit-audit_r1_2026-09-17.md:23`, citing
     `Loupe.svelte:1310-1321`, not re-read this session).
   - **The condition that would justify departing from it:** if a gap's caret cannot
     be made a reliable tap target on the engraved measure at phone width, the chip
     row returns as the fallback, and Dann hears about it before it is built.

4. **THE CARET'S WEIGHT, AND ITS CLEARANCE FROM THE SQUIRCLE. Ruled by Dann
   2026-09-17 late, from the drawing `caret-weight_r1_2026-09-17.html` (five
   plates, sent in session, not in the tree). He chose plate C's weight with
   plate D's clearance.** His words on
   the shipped build: *"functionally this is correct but look at this: it's
   monstrous! Those carets are creating visual noise that is unhelpful... I think
   the squircles should remain the featured coloured element in the Loupe... they
   should be evident and ready to be used, but not command the user's attention
   as primary objects of interest."*
   - **The squircle is the featured coloured element in the loupe. The caret is
     not.** Lavender belongs to the squircle.
   - **Plate C's values, ruled after he saw D at A's weight:** the app's own warm
     grey, `--ink-tertiary` `#6A655F`, at **0.32 opacity**; the vertical stroke is
     a **hairline, the stave's own line width** rather than a flat literal; the
     **arm is 0.6 line-gaps** past each staff line, and the **arrowhead's base is
     0.68 line-gaps** (half-base 0.34). The shipped values were lavender at full
     strength, stroke `1`, arm 1.0, base 1.6 (`Loupe.svelte:1241-1245`, `:1283`,
     read 2026-09-17).
   - **THE CLEARANCE. His words: *"ensure that the carets do not align with the
     sides of the squircle: let them be fully expressed without that
     collision."*** The collision is structural: a caret stands at the boundary
     between two notes, which is where the squircle's edge lands. **No caret
     stands closer than 1.2 line-gaps to the squircle's stroke, and it moves
     OUTWARD, away from the squircle, never into the taken note.** The 1.2 is a
     DESK DEFAULT, reversible.
   - **The condition that would justify departing from the clearance:** if moving
     a caret outward would carry it onto a neighbouring note, the caret holds
     short of that note rather than taking the full 1.2, and Dann is told which
     scores do it.
   - **CORRECTED 2026-09-17 by Code, and the desk's brief was the fault.** The
     brief said only "holds short of that note", and the first build read that as
     the neighbouring note's own hit-rectangle CENTRE. **That breaks tapping:**
     measured on the fixture, the clamped caret's hit centre and the note's hit
     centre sat 0.00003 system units apart, closer than a `MouseEvent.clientX`
     reports, so a tap dead centre on the caret resolved to the note.
     **The rule is: the clamp stops `hitHalf` short of the neighbour's centre**,
     where `hitHalf` is the caret's own hit-rectangle half-width, so the caret's
     near edge meets the neighbour's centre instead of its own centre landing
     there. Re-measured after the fix: 22 CSS pixels apart, and the tap resolves
     to the gap. Account: `../sessions/memo-n92-caret-weight_r1_2026-09-17.md` §2.
   - **Which measures clamp, on the one fixture walked:** m. 8 and m. 9 of
     Without Sun song 1, both after a sharp, because the accidental widens the
     squircle toward a close neighbour. **NOT ESTABLISHED** whether that
     generalizes to flats, naturals, or other scores; no second fixture was
     built.

5. **TWO CORRECTIONS FROM THE WALK OF `7e28272`. Ruled by Dann 2026-09-17,
   late.** He walked m. 6 of Without Sun song 1 and found both.
   - **NO CARET IS DRAWN INSIDE THE SQUIRCLE.** His words: *"The left side shows
     the caret inside the squircle (big no-no)."* Clause 4's clearance catches
     only a gap within 1.2 line-gaps of a stroke, so a gap whose x falls deep
     inside the squircle's span is caught by neither band and stays where it is.
     The squircle is wider than the note's own hit rectangle, because an
     accidental and the IPA row widen it (N.141), so this is ordinary, not rare.
     **The rule is now the span, not the edges: a caret whose x falls anywhere
     between the squircle's two strokes moves outward to 1.2 line-gaps beyond
     the nearer stroke**, under the same clamp as clause 4.
   - **THE DIAGNOSIS IN THE BULLET ABOVE IS WRONG, and it was the desk's, written
     without opening the file. Struck 2026-09-17 by Code, which measured the real
     cause.** The check was never two bands: `bandLeft` and `bandRight` already
     sit 1.2 line-gaps past each stroke, so together they already bound the whole
     span, centre included. **What put the caret inside the squircle was clause
     4's own neighbour clamp**, which can be stricter than clearing the stroke,
     and which was winning outright. Measured on m. 6, the note `A♭3 · Eighth ·
     ка`: the squircle spans 558.15 to 583.33 system units, the full push wanted
     589.93, and the clamp capped it at 580.495, inside the squircle.
     **The rule, corrected: clearing the squircle's stroke is a FLOOR the
     neighbour clamp cannot override. The clamp governs everything short of that
     conflict.** Account: `../sessions/memo-n92-caret-span-and-rests_r1_2026-09-17.md` §2.
     The ruled behaviour, no caret inside the squircle, is unchanged; only the
     desk's account of the cause was wrong.
   - **A REST TAKES A CARET ON EACH SIDE, LIKE EVERY OTHER DURATION GLYPH.** His
     words: *"Rests are rhythmic placeholders. there should be a caret on either
     side of the rest glyph just like every other duration glyph in this measure.
     No two contiguous carets make sense. They are devices like parentheses,
     meant to contain something."*
   - **The cause, read 2026-09-17:** `staff-renderer.ts:2626-2633` draws a rest's
     glyph and then `continue`s, so a rest never reaches the hit rectangle at
     `:2892-2898`. With no rectangle on either side of it, the caret geometry has
     no edge to read, so the two gaps flanking a rest collapse together and draw
     as a contiguous pair. **The same `continue` is why a singer cannot tap a
     rest at all**, though `entry.ts:46-58` already records that a rest IS a place
     the cursor can stand, because slice 3 converts one back to a note.
   - **So the fix is one change, not two: a rest is emitted with the same hit
     rectangle every other event gets.** Its consequence, DESK DEFAULT and
     reversible, stated so Dann can wave it off: **a tap on a rest then selects
     that rest**, on the page as well as in the loupe, where today it resolves to
     the nearest note. That follows from his own ruling that a rest is a duration
     glyph like the others.
   - **No two carets ever stand contiguous with no glyph between them.** After
     the rest's rectangle exists, that should hold by construction. If it does
     not, it is a defect to report, never a pair to suppress.

6. **THE CARET AND THE NOTE AFTER THE SQUIRCLE COLLIDE. Found by Dann on the walk
   of `8cb9b51`, 2026-09-17 late, m. 14 of Without Sun song 1.** His words:
   *"Collision between the note to the right of the squircle and the caret that
   should precede it. PLease fix these spacing problems?"*
   - **The squircle floor and the neighbour clamp cannot both be satisfied in a
     tight measure.** Clause 5 made clearing the squircle's stroke a floor the
     clamp cannot override, so where there is not room for both, the caret now
     lands on the note instead of inside the squircle. One collision was traded
     for the other. **The desk's reading of the cause is NOT ESTABLISHED and is
     not to be built on: it is measured first.**
   - **THE ANSWER IS TO MAKE ROOM, on Dann's own standing rulings**, and the
     order is his too: *"Take the cheaper route first"* (the re-engraving
     permission, recorded above), and measure before anything moves (the
     2026-09-15 widening ruling, whose principle is that the layout yields to the
     squircle and never the reverse).
   - **Doing nothing is not defensible here.** A caret touching a notehead reads
     as a defect, and it is the one mark whose whole job is to say "a note can go
     here, and not on top of that one."
   - **What is still Dann's, and only if the measurement forces it:** re-engraving
     the held measure at its own spacing costs the property that the loupe is a
     guaranteed picture of the page. His permission for that is conditional and
     already given. **If it fires, he is told in the same breath.**
   - **AND THE TAIL CARET MUST NOT OVERLAP THE BARLINE. Found by Dann the same
     night, m. 3.** His words: *"The last caret in this measure must not overlap
     the barliine: caret first, then barline."* The measure's last gap is drawn at
     the crop's own right edge, which is where the closing barline stands. **The
     caret stands clear of the barline and to its LEFT: the order along the stave
     is caret, then barline.**
   - **The head gap takes the same rule mirrored, DESK DEFAULT and reversible:**
     the first caret stands clear of the opening barline and to its RIGHT, so the
     order is barline, then caret. A caret belongs inside the measure it inserts
     into.
   - **EVERY CARET IS DRAWN WHOLE. Found by Dann the same night, m. 4.** His
     words: *"There is not reason the first and last carets in the measure cannot
     be full symbols instead of the truncated halves Ilya draws. Please make all
     carets fully complete, and not half of themselves."* **No caret is ever a
     half of itself:** both arrowheads and the full stroke are drawn, on every
     caret in the measure, the first and the last included.
   - **This is the same fix as the barline rule.** The head and tail carets are
     drawn at the crop's own left and right edges, so half of each mark falls
     outside the crop and is clipped. Standing them inside the measure, clear of
     the barlines, satisfies both rules at once. **The desk's reading of the
     clipping is NOT ESTABLISHED and is measured before it is built on.**
   - **BOTH STROKES OF THE SQUIRCLE OVERLAP THEIR CARETS. Found by Dann the same
     night, m. 6.** His words: *"Double whammy... Both sides of the squircle
     overlap the carets on either side."* Not one side, both.
   - **THE FOUR FINDINGS ARE ONE FINDING.** m. 14, m. 3, m. 4 and m. 6 are the
     same thing seen four ways: **the carets are being fitted into spacing that
     was engraved before they existed.** Every remedy so far has relocated the
     collision rather than removed it, which is what a shuffle inside fixed room
     can do. **DESK INFERENCE, and it is the measurement's to confirm or refute:
     the cheap route is exhausted, and the answer is Dann's own second remedy,
     make room.** Nothing is built on this sentence until the measurement says
     so.
   - **A CARET STANDS IN THE MIDDLE OF THE SPACE IT NAMES. Ruled by Dann
     2026-09-17 late, m. 17, and it SUPERSEDES the desk's own "clear of the
     barline" wording above.** His words: *"Strange choice to make the last caret
     overlap the barline instead of planting it right in the middle of the space
     that preceded the barline, there's plenty of room there."*
     - The tail caret stands midway between the last note's ink and the closing
       barline.
     - The head caret stands midway between whatever opens the measure and the
       first note's ink.
     - An interior caret stands midway between its two neighbours' ink.
     **The desk's rule was a clearance, which says only where a caret may not be.
     Dann's is a position, which says where it belongs, and it answers the
     clipping and the barline overlap at once.** The clearance from the squircle
     and from a neighbour's ink remain as floors where the middle is not free.
   - **THE LOUPE'S SPACING IS ITS OWN, AND IT MAY EXPAND. Ruled by Dann
     2026-09-17 late.** His words: *"the spacing in the Loupe is temporary and
     situational, and bears not on the paper GUI? Loupe demands expanded spacing
     to accommodate all the elements without overlap."*
     - **The loupe's spacing is temporary and situational. It does not bind the
       page, and nothing about the printed result follows from it.**
     - **The loupe expands its spacing as far as it needs to hold every element
       without overlap.** That is the loupe's job, not a concession.
     - **THIS SUPERSEDES THE COST RECORDED WITH THE RE-ENGRAVING PERMISSION**
       (`OPEN.md`, THE PERMISSION HE GAVE, 2026-09-15), which read that
       re-engraving costs the property that the loupe is a guaranteed picture of
       the page, and that the cheaper route comes first. **Dann has now priced
       that property: for spacing, it is not one he is keeping.** The loupe
       remains a true picture of WHAT the measure holds; it is no longer a
       promise about the spacing between those things.
     - **So expanded spacing is the route, not the fallback.** A remedy that
       squeezes the carets into the page's spacing is the one that now needs
       justifying.
   - **WHAT SHIPPED AGAINST THAT RULING, AND WHAT DID NOT. Recorded 2026-09-17
     late from `../sessions/memo-n92-caret-collision_r1_2026-09-17.md`, read in
     full.** The four measures Dann photographed are fixed and measured. **The
     loupe's spacing was NOT expanded.** What was built instead: the position
     rule now reads a neighbour's own INK rather than its hit rectangle, the
     head and tail gaps nudge the barline, and the crop's margin widens past
     whichever caret lands closest to it. All three move marks inside the CLONE
     of the page's SVG.
   - **The residue, measured across the whole fixture: 27 gaps on 12 of its 18
     measures still collide.** Eighteen where a neighbour's ink and the squircle
     leave less room than a caret's own width (as little as 0.153 units against a
     caret width of 3.74), and nine where a caret meets a beam. **So the collisions
     Dann photographed recur on measures he has not opened.**
   - **THE CAUSE IS THE MECHANISM, AND IT IS THE DESK'S BRIEF THAT CHOSE IT.** The
     brief said "expand the loupe's spacing" and never said how, so Code kept
     working inside the clone, where a beam, a tie, a ledger line, or an
     accidental can depend on a note's position without carrying a handle back to
     it, which makes moving any note unsafe. **Re-engraving does not have that
     problem:** the renderer lays out beams, ties and accidentals itself at the
     new spacing. Dann's own permission named that mechanism in 2026-09-15's
     words, "calling the renderer for the held measure alone, at its own
     spacing", and the brief did not carry it. **The next pass says it outright.**
   - **A BARLINE STANDS AFTER THE METER SIGNATURE. Found by Dann on the walk of
     `fda5b9c`, 2026-09-18, m. 14.** His words: *"this measure has an
     inappropriate barline after the meter signature."* **A meter signature is
     followed by music, never by a barline.**
   - **THE CAUSE, read 2026-09-18 and better than the desk's first guess.**
     `Loupe.svelte:1215-1218` widens the body crop by `CARET_MARGIN`, two
     line-gaps, on each side, to give the head and tail carets room, and `:1637`
     feeds that widened left edge into the viewBox. **The crop therefore takes in
     two line-gaps of whatever precedes the measure**, which on a mid-system
     measure is the previous measure's closing barline. The loupe's own head panel
     has already drawn the clef, key and meter, so that barline lands between the
     meter and the first note. **The last step, that the mark in view is
     specifically that barline, is NOT ESTABLISHED and is measured before it is
     fixed.**
   - **Dann on the second sighting, m. 5, 2026-09-18:** *"The carets look great
     but so many of these measures now have that inappropriate barline at the
     beginning."* **It is every mid-system measure, not a few.**
   - ~~**DESK RECOMMENDATION:** the body clone strips the barline that precedes the
     held measure.~~ **SUPERSEDED the same night by Dann's general rule below,
     which covers it and everything like it.**

7. **THE LOUPE SHOWS ONE MEASURE AND NOTHING ELSE. Ruled by Dann 2026-09-18, on
   m. 13, and it is the governing rule for the loupe's picture.** His words:
   *"The Loupe is an artificial instance of a single measure. The conceit that we
   implemented of the barline suggesting continuation is conceptual only. There
   should not be any information in the Loupe from adjacent measures."*
   - **No mark from an adjacent measure is drawn in the loupe, at either end.**
     Not a barline, not an accidental, not a notehead, not a syllable, not a
     fragment of one. What he photographed on m. 13: a stray sharp at the left
     after the meter, and a flat plus two syllable fragments past the closing
     barline at the right.
   - **The barline that suggests continuation is a CONCEIT.** It stands for the
     measure's boundary. It is not a window onto what is on the other side of it.
   - **This supersedes the desk's piecemeal recommendation** to strip the
     preceding barline, which fixed one symptom of this rule being broken.
   - **It is also the strongest argument for re-engraving.** A crop of the page
     can always pull in a neighbour, and every widening of it pulls in more. **A
     re-engraved single measure has no neighbours to pull in**, so this rule holds
     by construction rather than by stripping marks one kind at a time.
   - **THE TAIL PANEL IS NOW DETACHED. Found by Dann on m. 12, 2026-09-18.** His
     words: *"Why is the measure followed by the weird disconnected artefact of a
     stave line?"* **Read this session:** `Loupe.svelte:807` draws a short run of
     bare stave after the measure whenever the closing barline is not the final
     one, which is the continuation conceit; `:1984-2000` draws it as its own SVG
     butted against the body. `fda5b9c` widened the body by `CARET_MARGIN` on each
     side and `:1610-1617` renders that extra width as blank space, so a gap opens
     between the barline and the tail. **The tail did not move. The body grew past
     it.**
   - **The conceit stays; the seam must not show.** Dann endorsed the continuation
     barline as a conceit in the same breath as clause 7. What is wrong is the
     detachment, not the tail. **Every panel of the strip meets its neighbour with
     no gap, whatever margin the body takes for its carets.**

8. **THE LOUPE MAY EXCEED THE PAGE'S WIDTH. Ruled by Dann 2026-09-18, and it
   RETRACTS HIS OWN RULING OF 2026-08-27.** His words: *"I retract 'THE LOUPE
   NEVER EXCEEDS THE PAGE'S OWN WIDTH, ruled by Dann 2026-08-27 after his desktop
   walk found it growing to the viewport with the drawer closed.' Instead,
   especially on desktop, the measure contents should be fully represented. I
   realize that Loupe contents are now padded with non-collision constraints and
   carets inserted between notation elements. This extra width is going to cause
   wider measures. If we don't shrink the point size of the notation, the only
   responsible alternative is to allow wider measures to be fully expressed on a
   device where they can be."*
   - **The retracted rule and its reason**, for the record: the loupe never
     exceeded the page's width because *"a frame wider than the thing it is a part
     of reads as a second document rather than as a closer look at this one"*
     (`Loupe.svelte:682-687`, which carries it as a comment naming Dann).
   - **Why it no longer holds:** the loupe is no longer a crop of the page. Its
     spacing is its own (clause 6), it shows one measure and nothing else
     (clause 7), and the carets and their clearances make a measure wider than the
     page draws it.
   - **The notation's point size is the fixed quantity. The window is the variable
     one.** That is the same principle as N.140, now applied to the desk and not
     only to the phone.
   - **On a device that cannot give the width**, the singer turns to landscape or
     scrolls. N.140 is that item, ruled 2026-09-14 and still open, and it waits on
     two things of Dann's: the floor in CSS pixels, and whether the scroll may
     take a gesture.
   - **WHEN CODE TOUCHES `Loupe.svelte:682-687`, IT RECORDS THE RETRACTION THERE.**
     That comment cites Dann by name for the opposite rule. It is amended, with
     the date and the reason, not deleted.

9. **A CLIPPED ACCIDENTAL READS AS A MICROTONAL ONE, AND THAT IS FALSE
   INFORMATION. Found by Dann on m. 16, 2026-09-18.** His words: *"Why is there a
   strange half-sharp following the meter signature?... I did not program any
   microtonal notation."*
   - **What is drawn:** one vertical stroke with two slanted crossbars, which is
     half of the sharp glyph. **The desk describes the marks rather than naming a
     character, per CONTRACT tether 18.**
   - **Same cause as the barline:** the body crop starts two line-gaps before the
     measure (`Loupe.svelte:1215-1218`), so a glyph straddling that edge is drawn
     as a fragment. **Which sharp it is, the previous measure's or this measure's
     own, is NOT ESTABLISHED.**
   - **THIS ONE MISINFORMS, and it is a different class from the rest.** A
     half-drawn sharp is Ilya making a claim about the pitch that the score does
     not make. Under the freeze rule of 2026-09-16, a finding joins the release
     when **"Ilya would otherwise tell a singer something false"**, so this
     qualifies on its own, independently of the caret work.
   - **NO NOTATION GLYPH IS EVER DRAWN CLIPPED IN THE LOUPE.** Whole or absent.
     The rule for carets (clause 6) now holds for every glyph the loupe draws.

10. **THE RE-ENGRAVING STOPPED AT ITS OWN STOP CONDITION, 2026-09-18, and the
    stop is correct.** Account and the five-stage plan:
    `../sessions/memo-n92-loupe-reengraves_r1_2026-09-18.md` §1, read in full by
    the desk.
    - **The mechanism is confirmed real.** `page-layout.ts` already renders one
      measure alone at its own spacing through
      `renderAnalyzedStaff(sliceScore(parsed, m, m), ...)`, and `sliceScore`
      rebases `measureIndex` without touching `ev.id`, so every caret, tap and
      hit rectangle built over the last three briefs keys off the same ids.
    - **What made it more than one pass, all four measured:** the score, the
      analysis, the font and the five underlay preview maps are private
      `$derived` state inside `VoiceProfilePane.svelte`, and a re-engraved measure
      without them would draw the file's own default syllable under a note the
      singer has hand-paired elsewhere, which is a singer-visible lie, not a
      cosmetic gap; the squircle's box arithmetic is inline in that same component
      and not callable; `loupe.ts`'s dozen crop helpers and their 781-line test
      file exist to slice one shared coordinate space and mostly retire with the
      crop; and **the addendum's derived spacing is a control loop nobody has
      costed**, since `staff-renderer.ts` has no caller today that measures its own
      output and asks for more room.
    - **Built anyway, as the brief required:** the body panel clips the clone to
      the measure's true boundary, which closes clauses 7 and 9 with one mechanism;
      the body paints its own stave behind the clip, closing the tail seam; and the
      width cap is retracted with the comment at `Loupe.svelte:682-687` amended in
      place rather than deleted.
    - **The 27 collisions are unchanged and expected to be**, because they are
      what the re-engraving would have addressed.
    - **NOT ESTABLISHED, and it is the first thing stage 3 must measure:** how many
      of the 27 the derived-spacing search actually closes, and whether it
      converges or needs a cap and a "this measure cannot have the width it needs"
      report of its own.

11. **THE LOUPE DRAWS NO OPENING BARLINE, EVER. Ruled by Dann 2026-09-18 on the
    walk of `a86e985`, m. 5.** His words: *"found another unwanted initial
    barline. These need to be gone."*
    - **Clause 7 was not enough, and this says why.** Code's clip removed content
      belonging to ADJACENT measures, and it works. **A measure's own opening
      barline is not adjacent content**, so it survived the clip and is still
      drawn after the clef, key and meter.
    - **The rule: no barline is drawn at the loupe's left, whatever it belongs
      to.** The head panel's clef, key and meter stand for the measure's start,
      and a barline after a meter signature is wrong notation.
    - **The closing barline stays.** It is the continuation conceit Dann endorsed
      in clause 7, and it sits at the right with the tail panel behind it.

12. **THE LOUPE IS SIZED TO ITS CONTENTS, NOT TO THE VIEWPORT. Ruled by Dann
    2026-09-18, after the width retraction made every loupe full width.** His
    words: *"Can we have some sort of responsive dimension? I think imposing a
    minimum is smart? But this Loupe can be much tighter to its contents than it
    is. I see no reason to impose uniformity in dimension for all Loupes."*
    - **Width equals the contents plus padding**, clamped between a minimum and
      the viewport less the drawer and the gutters. `Loupe.svelte:1662` already
      computes `stripWidth` from the panels it has just built; `:692` currently
      discards it in favour of the room the viewport offers.
    - **THE SIZE IS KEYED TO THE HELD MEASURE, NEVER TO THE SELECTION.** Within one
      measure the card holds still while the singer steps from note to gap to note.
      It resizes only when the loupe is raised on a different measure. **This is
      the one virtue of a uniform width, stability under the hand, and it is kept
      without the cost.** DESK REASONING, put to Dann and not waved off.
    - **The minimum is set by what the header and the syllables bar need to read**,
      not by the notation. DESK DEFAULT, reversible, and the number is stated when
      it is built.
    - **What the desk argued and Dann agreed with:** an oversized card makes the
      eye travel to find the music, hides more of the page the loupe is supposed to
      rest on, and throws away a free signal, that a wide loupe means a dense bar.

13. **MORE DAYLIGHT, AND A TAP SEPARATION FLOOR. Asked for by Dann 2026-09-18 on
    the walk of the barline fix.** His words: *"Maybe even a little more daylight
    between the squircle and that caret on the right side? I'm thinking about fat
    fingers on mobile and selection hotspots."*
    - **THE DESK'S DISTINCTION, put to him and not waved off: daylight and tap
      safety are two different numbers.** The clearance is the DRAWN gap and scales
      with the notation. Mis-taps are decided by `nearestTarget`, which compares
      hit-rectangle CENTRES, so what governs a thumb is the distance between two
      centres in CSS pixels at phone width. **Code measured that at 22 px** on the
      case it fixed on 2026-09-17. A 44 px target whose centre sits 22 px from its
      neighbour's is ambiguous under a thumb.
    - **Drawn clearance: 1.2 line-gaps becomes 1.6.** DESK DEFAULT, reversible.
    - **Tap separation floor: 44 CSS pixels between a caret's hit centre and its
      neighbour's, measured at phone width.** DESK DEFAULT, reversible, and it is
      the number his reasoning actually names.
    - **Where the floor cannot be reached, it is reported, never quietly shrunk.**
      On the tight measures it will not be reachable inside the current spacing,
      for the same reason the carets collide there. **That list is evidence for
      N.153.**
    - **MEASURED 2026-09-18, and it is the night's most important number: the floor
      is reached on NONE of the 17 measures. The separation runs 1.13 px to 7.89 px
      against a 44 px floor** (`../sessions/memo-n92-no-opening-barline-and-fit_r1_2026-09-18.md`).
      **So a caret is not reliably tappable on a phone anywhere in this score.** A
      thumb aimed at one is within 8 px of its neighbour's centre everywhere, and
      `nearestTarget` resolves by centre.
    - **This reframes N.153.** It is not a tidiness item about collisions. **The
      insert reach does not work on a phone at all**, and N.153 is what makes it
      work. The desktop path works today, by stepper and by caret.

14. **THE LOUPE'S THREE STATES, AND THE TWEEN INTO CORRECTIONS. Ruled by Dann
    2026-09-18.**
    - **UNNUMBERED ON PURPOSE. Ruled by Dann 2026-09-18:** *"leave the number until
      N.149 is closer."* **Do not mint a number for this, and do not treat its
      absence as an oversight.** The design is ruled and recorded here; the item
      gets its number when N.149 approaches, because N.149 is what makes the
      Corrections gate real. His words: *"eventually when the Loupe is working properly, we are
    not going to see carets when the Loupe opens. Carets are a device for musical
    notation navigation and placement. The only time carets should be visible in the
    Loupe is when the user has clicked Corrections."*
    - **READING, the opening state.** The loupe is an enlarged version of the paper
      measure, carrying the page's own layout and spacing. *"So we are looking at a
      detail of the page engraving."* **No carets.**
    - **SYLLABLES.** The accordion opens downward and syllables can be reassigned.
      The measure looks essentially as it did, *"with necessary spacing adjustments
      if the syllables entered are especially long or short."*
    - **CORRECTIONS.** The spacing changes to make room for the carets, and the
      loupe may widen to hold it.
    - **THERE ARE THEREFORE THREE SPACINGS, not two**, and the desk names it because
      "essentially the same" will otherwise be built as "unchanged" and a long
      syllable will collide. The syllable-adjusted spacing needs its own rule.
    - **THE TWEEN. Ruled by Dann 2026-09-18.** Entering Corrections is animated: the
      established elements, notes and rests, move continuously from their reading
      positions to their corrections positions, while the carets fade in. His words:
      *"the purpose of the animation is to teach the user nonverbally that the
      carets are conceptual insertions meant to allow them to insert values"*, and
      the goal is *"Calm Authority"*.
    - **THE TECHNIQUE IS FLIP** (First, Last, Invert, Play), which is Flash's motion
      tween applied to a layout change: measure, apply the new layout, measure again,
      transform each element back to where it started, then release. **A cross-fade
      or a fade-out-and-in is NOT acceptable: nothing appears to move, and the
      teaching is the movement.** Elements are addressable by `data-event-id`
      (`staff-renderer.ts:2879`). **NOT ESTABLISHED** whether Svelte's `animate:flip`
      can be used, since it works on keyed each blocks and the loupe's notation is
      injected markup.
    - **THE CARD AND THE NOTATION MOVE AS ONE GESTURE. Ruled by Dann 2026-09-18**,
      over the desk's recommendation to sequence them. His words: *"I don't have a
      problem with not directing the user's focus during this process... I don't see
      why we need to curate the user's focus."* The desk's objection is withdrawn:
      the card grows because its contents did, and splitting them invents a seam the
      physics does not have.
    - **THE CARETS BEGIN AT ZERO OPACITY. Ruled by Dann 2026-09-18:** *"we want them
      to appear from the ether, meaning their first frame will be zero opacity."* So
      they read as arriving into the room rather than sliding with it, inside the one
      gesture, with no second beat.
    - **THEY FADE FROM 0 TO 0.32, WHICH IS A CARET'S OWN FULL VALUE**, ruled from
      plate C (clause 4). **Written down because "fades in to full opacity" gets built
      as 1.0 and blows out the weight Dann chose.** The same holds in reverse: the
      return tween fades 0.32 to 0.
    - **The animation fires only on a deliberate move into Corrections.** Not on
      opening the loupe, which N.147 has opening with the Syllables row closed, and
      not on arrowing to an adjacent measure.
    - **`prefers-reduced-motion` turns it off outright. Duration around 200 to
      250 ms.** DESK DEFAULT.
    - **THE PERIMETER IS TIMED TO THE CONTENTS. Ruled by Dann 2026-09-18:** *"we can
      time the expansion of the Loupe's perimeter to the expansion of the note
      tweening inside it? This should give the illusion of containing growth."*
      - **Same duration AND the same easing curve.** Two different curves over the
        same duration desynchronize mid-flight and the edge arrives before or after
        its contents, which breaks the containment.
      - **THE PERIMETER IS NEVER SMALLER THAN WHAT IT CONTAINS, AT ANY FRAME.** The
        loupe clips to its own bounds, so a card narrower than its contents cuts them
        off, and a caret would be sliced for the length of the tween. **This is the
        same clipping class Dann found five times on 2026-09-17 and 2026-09-18.**
      - **So expanding, the card matches or leads by a hair; contracting, the card
        FOLLOWS the notes in.** The intuition that contents push the perimeter would
        put the notes first in both directions, which is the unsafe order. At these
        durations a few milliseconds of lead is invisible; the clipping would not be.
        DESK REASONING, put to Dann.
    - **THE RETURN TWEEN. Ruled by Dann 2026-09-18.** His words: *"switching from
      Corrections mode back to Syllables is going to require a fast transition where
      the carets fade out and the musical notation follows paths back."* Same FLIP
      machinery, run the other way.
      - **The carets leave FIRST**, then the room closes behind them. Arriving last
        and leaving first is the same meaning read backwards; fading them out mid
        travel makes them look carried away by the reflow rather than withdrawn.
        DESK DEFAULT.
      - **Faster than the entry, about two thirds of it**, because the entry teaches
        and the exit only confirms a decision already made. Entry about 220 ms, exit
        about 150 ms. DESK DEFAULT.
      - **The destination is the state being returned TO, not the page.** With the
        Syllables row open and a long syllable, the target is the syllable-adjusted
        spacing, the third spacing named above, and not the paper's. **Written down
        because "back to the paper engraving" will otherwise be built as the page's
        spacing and will be wrong whenever a syllable has widened something.**
      - **THE TWEEN IS INTERRUPTIBLE AND REVERSIBLE FROM MID-FLIGHT.** Toggling
        Corrections twice quickly turns the motion around from wherever it stands.
        **It never queues a second animation behind the first.** Queued tweens are
        how an instrument starts to feel laggy, and this is hard to retrofit.
        **DESK RECOMMENDATION, ratified by Dann 2026-09-18** (*"I defer to your
        advice... If you intuit this is necessary then I agree with you"*), **and the
        desk told him the basis and the cost before he did.** The basis is a known
        failure mode, not a reading of this tree: a transition that assumes it starts
        at rest will, when re-triggered mid-flight, either snap back and replay or
        queue and play twice. The cost is that every tween must capture where things
        actually are at that instant rather than where they began; FLIP makes that
        tractable because measuring current positions is what it already does.
      - **RULED BY DANN 2026-09-18: BUILD THE LOCK.** His words: *"I think 'lock the
        toggle for the duration of the tween' is reasonable. It saves a bunch of
        hassle and they can still hit the escape button if they need to interrupt."*
        A second press inside the tween's duration does nothing. Simpler than the
        interruptible version, never desynchronizes. **The interruptible version
        stays on the record above as the better end state if the lock ever reads as
        heavy.**
      - **THE LOCK COVERS THE CORRECTIONS AND SYLLABLES TOGGLE ONLY. DISMISSAL STAYS
        LIVE BY EVERY ROUTE.** Escape is confirmed at `+page.svelte:1408-1410`,
        `case 'Escape': dismissLoupe()`, read 2026-09-18. **But a phone has no Escape
        key**, and its dismissal is the downward swipe, so a lock written as "ignore
        input during the tween" would leave a phone singer with no way out for a
        fifth of a second, which is the one case where being ignored matters.
        **Escape, the swipe and the chevron all stay live throughout.**
      - **A dismissal landing mid-tween cleans up after itself:** no transforms left
        on the cloned nodes, no mark left on the page.
    - **DEPENDENCY: N.149**, which moves Corrections into the loupe and is recorded
      as not small, and which carries a question of Dann's, what offers Undo while
      the loupe is closed. **Until N.149 lands, the gate is the desk default from
      clause 6: carets whenever the Syllables row is closed. That is a stopgap
      standing in for this rule, and it is why carets appear on opening today.**

    - **NUMBERED N.153 BY DANN, 2026-09-18.** His words: *"Yes, confirmed N.153."*
      The desk proposed reviving N.151 and then withdrew it: that number's spec is
      still in this file and still carries live rulings, so recycling it would make
      a future search return the measure edit surface instead. **N.152 was the
      highest in use, checked across `OPEN.md`, `STATE.md` and `SEQUENCE.md`.**
   - **It is carried into the re-engraving brief, and it is also named there as a
     defect that must not survive a stop.** A re-engraved measure draws its own
     barlines and needs no nudge at all, so the mechanism that is suspected here
     goes away with it. If the re-engraving stops, this is fixed on its own.

2. **Carets are drawn only while Corrections is the active panel.** With the loupe alone, or with Syllables showing, no insertion points are drawn. His reasoning, and the desk agrees: a mark that appears when it cannot be used is noise, and the loupe's default state is reading, not editing.


15. **THE BEAM IS THE ONE EXCEPTION TO "TOUCHES NOTHING". RULED BY DANN
    2026-09-21, on the desk's recommendation.** His words: *"The beam is the one
    exception I can think of. Carets must intersect it, there's no other
    option."*
    - **The desk proposed it and Dann ruled it in.** The record carries both
      halves, per CONTRACT section 3.
    - A caret runs past the top and bottom staff lines with an arrowhead at each
      end (clause 1). On beamed notes the beam sits in the band those arms reach
      into, so the overlap is structural and no spacing removes it. Measured at
      stage 3b: 11 gaps whose caret a beam spans at any spacing (Code's count,
      2026-09-21, not verified by the desk; `OPEN.md` section N.153 carries 9
      from a different measurement on 2026-09-17).
    - **So a beam is not "something" for the purpose of the caret's position
      rule.** Noteheads, stems, accidentals, and the squircle still are.
    - **The scan reports beam contacts as their own named row**, counted and
      visible, never folded into the violations.
    - **The condition that would justify departing from it:** if a caret crossing
      a beam ever reads as a collision rather than as a mark passing behind the
      music, the exception is withdrawn for that case and Dann is shown the
      drawing before anything is changed.

16. **THE LOUPE'S OWN SPACING. RULED BY DANN 2026-09-20. LIFTED HERE FROM
    N.153's SPEC AT N.153's CLOSE, 2026-09-21, UNREWORDED.**

    **It is lifted because it would otherwise have gone to the archive with
    N.153's account, which is the exact failure `README.md` records from
    2026-09-20.** Two of its three parts are not built, so it is live work, not a
    closed item's residue.

    Both quantities are loupe-local, under his ruling that *"the engraved measure
    on Paper is not the same as the Loupe."*

    | quantity | today | ruled | build state, read 2026-09-21 |
    |---|---|---|---|
    | meter run-in | 2 sp, Gould rule 240 p. 42 | **1 sp in the loupe; the page keeps 2** | **NOT BUILT** |
    | stave run-on past the closing barline | 4.6 sp | **1 sp** | **BUILT** |

    - **The run-on is built.** `EXCERPT_TAIL_SP = 1` (`loupe.ts:598`), spent at
      `Loupe.svelte:935`, and zero on a final barline.
    - **The meter run-in is NOT BUILT.** `METER_RUN_IN_SP = 2`
      (`staff-renderer.ts:169`) is the only value in the tree, and the loupe's
      render passes no override: `bundleRenderOptions`
      (`loupe-render.ts:58-69`) carries spacing, clef, the five previews and the
      font, and `renderLoupeMeasure` (`:79-89`) adds `minGap` and deletes
      `targetWidth`. So the loupe draws its meter at the page's 2 sp.
    - **THE TIE RUNS INTO THE RUN-ON, tapered**, as if reaching a note that is not
      shown. **NOT BUILT.** No `taper` appears in `Loupe.svelte`, `loupe.ts` or
      `loupe-render.ts`, and the tail panel draws only `<line>` elements
      (`Loupe.svelte:2590-2597`).
    - **His instruction on how much to think about the run-on:** *"Do not overthink
      the width of the stave that exceeds the barline, just make it shorter than
      what it is now, visually."*
    - **A desk caveat he heard and waved past:** 1 sp is about 33 px at the zoom he
      walked, and the desk's reading is that it is the tightest a taper can be and
      still read. He chose to build it and look rather than argue it. **Walk a tied
      measure when the taper lands.**

### THE LOUPE'S TWO MODES, RULED BY DANN ON THE WALK OF 2026-09-19 INTO 2026-09-20

**MOVED HERE 2026-09-20 from `STATE.md`, verbatim and unreworded, because six of these
twelve lived in `STATE.md` and nowhere else.** N.148, N.149 and N.150 are closed and
their account is in `../sessions/LOG.md` block 25, **but the archive is not
authoritative and rulings outlive the code they came from.** They belong here, beside
THE CARET's other clauses.

1. **THE LOUPE'S TWO MODES, AND OPTION A IS CHOSEN.** Corrections is a sibling STATE
   reached by a pill it shares with Syllables, not a second section under Syllables.
   **The design is `../sessions/design-n149-loupe-two-panels_r1_2026-09-17.html`**,
   drawn by the desk 2026-09-17, chosen by Dann the same night, LOST for three days
   because it was never written to disk, and recovered by Dann 2026-09-20. Its own
   words for option A: *"Two segments in one pill on the left of the bar, the way the
   desk selector already pairs Transcription and Fit. The chosen one is filled. Undo,
   Redo and the chevron sit flush right."*
2. **THE LOUPE OPENS ON SYLLABLES**, the dominant mode. Whether it should instead open
   on the mode last used is **still Dann's to consider**; he said so and did not rule.
3. **THE TWEEN RUNS SYLLABLES TO CORRECTIONS**, both directions. This refines clause 14,
   which had it running from Reading. His reason, and it is the point of the whole
   thing: *"having those carets fade in should intuitively tell the user that they are
   controls interleaved with the notes on the page."*
4. **IN SYLLABLES MODE THERE ARE NO CARETS.** The carets belong to Corrections, and
   **Corrections necessarily carries more generous spacing** to hold them without
   collisions.
5. **THE PAPER AND THE LOUPE MAY ENGRAVE THE SAME MEASURE DIFFERENTLY.** His words:
   *"We already accept that the engraved measure on Paper is not the same as the Loupe."*
   The Paper is engraved as if to be played from; the Loupe is for navigation and closer
   inspection.
6. **THE LOUPE'S ANCHOR: OPTION B. Anchor the music, and give the accordion its own
   scroll.** The music sits at one vertical, every time; sections grow downward; when
   the contents exceed the room the accordion scrolls inside itself rather than the card
   moving. **He has now ruled this twice**: the 2026-09-17 mockup already says *"the
   panel below swaps without the loupe moving"*, and it was never transcribed.
7. **THE METER RUN-IN IN THE LOUPE IS 1 STAVE SPACE.** The page keeps Gould's 2
   (rule 240, p. 42, `staff-renderer.ts:150-169`). Loupe-local, by ruling 5.
8. **THE STAVE RUN-ON PAST THE CLOSING BARLINE IS 1 STAVE SPACE.** Measured before the
   ruling: today it is 4.6 sp, being `CARET_MARGIN` 3.6 (`Loupe.svelte:1277`, which is
   `lineGap * 2 + SQUIRCLE_CLEARANCE`, itself `lineGap * 1.6` at `:1266`) plus
   `EXCERPT_TAIL_SP` 1 (`loupe.ts:598`). Confirmed independently by measuring his own
   screenshots: 100 px of run-on at 21.75 px to the stave space, on both m. 9 and m. 12.
   **1 sp lands on Gould rule 242, p. 42**, her barline-adjacent clearance. His
   instruction: *"Do not overthink the width... just make it shorter than what it is
   now, visually."*
9. **THE TIE RUNS INTO THE RUN-ON, FULLY REALIZED, WITH A TAPERED END**, as if it
   reached a note that is not shown. Today it stops square at the barline (m. 12).
   **The tail panel draws only `<line>` elements today** (`Loupe.svelte:2367-2375`), so
   this is new drawing rather than a tweak.
10. **NO UNDO WHILE THE LOUPE IS CLOSED**, which answers N.149's only open question
   (`OPEN.md:1340`), outstanding since 2026-09-17. Reopening any measure brings the
   controls back; the stack is the app's own, as he ruled 2026-09-17.
11. **THE CARETS OCCUPY A DIFFERENT CONCEPTUAL PLANE FROM THE NOTATION.** His words.
   This is what frees both quantities to go to 1 sp: if the carets are their own layer,
   `CARET_MARGIN`'s 3.6 sp carved out of the notation was never theirs to need.
12. **ELAINE GOULD IS SHE/HER.** The desk wrote "he" twice and was corrected.

## N.157. REPLACING A SCORE DOES NOT RE-DERIVE THE SEATS

**Numbered 2026-09-20. DESK DEFAULT number.** Found underneath the period, after Dann
spent an afternoon on what looked like a one-character fix.

**What happens today, established by Code and by the desk reading his library:**

- `mergeOnUpload` returns the existing pairing map untouched on a replacement, so every
  stored seat survives with the text it was made with.
- `seatScoreWords` runs only into an EMPTY map, so the new note the corrected file adds
  is never seated. The fold names it blank and it draws nothing. **That is why the
  underlay stayed at 96 elements against the file's 97.**
- `refreshPairings` (`+page.svelte:417`) rewrites a stored seat's text only on an exact
  origin match, so a corrected word never reaches a placement made under the old text.

**What it looked like to Dann:** Transcription showed « одинокая. » and Score Markup
showed « я » with no period, on the same screen, on the current build. **He asked four
times for a period and each answer was about a different artefact.**

**THE SHAPE OF THE FIX, DESK INFERENCE and Dann's to wave off.** On a score
replacement, re-derive the seats against the new score and poem: keep a seat that still
matches, refresh the text where word and slot match, and seat a note the new file adds.
**Add no punctuation rule; the period is already in the slot text.**

**NOT ESTABLISHED:** whether a re-derive can keep hand placements in every case, and
what should happen to a placement whose word no longer exists in the new text.

---

## N.160. THE WORK, AND ITS TWO VIEWS. Numbered 2026-09-21. DESK DEFAULT NUMBER

**The model is Dann's and is transcribed in `PRODUCT.md` §THE WORK, AND ITS TWO VIEWS.** This
item is what acts on it.

### The defect, as Code established it 2026-09-21

**A seat's link to its word survives only as long as the session remembers the PREVIOUS
text.** The diff compares against `transcribedGrid`, which is never stored
(`+page.svelte:2926`). **Corrected by Code the same night, narrower than its own first
answer:** a reload or a song switch does not freeze seats by itself. Three paths do:

1. a Clear, then a new poem;
2. a reload inside the 600 ms typing pause;
3. an edit made while the dictionary is still loading (`+page.svelte:2974`, `one-action.ts:41`).

**Measured on Dann's own library through the branch alias, 2026-09-21:** his Sunless song
holds 96 pairings. **25 carry an `origin.lineIndex` that does not exist** in the current
one-line poem, and 8 of those carry a stress mark, so eight acutes were withheld invisibly.
**Of the 25, 15 carry a word still present in the poem** (13 appearing once, 2 being «тень»
which appears twice). Only 10 are genuinely gone: «непроглядная» and «безответная», the two
words the engraver split.

### The shape, converged

`../sessions/memo-n160b-the-approach_r1_2026-09-21.md`.

- **A seat's anchor is its word's letters plus the syllable's ordinal.** `SlotOrigin.word`
  already is that anchor, ruled by Dann 2026-08-13 (`pairings.ts:81-93`). **The line-and-word
  address becomes a cache.**
- **THE JOINED-RUN RULE.** An old word may match a run of adjacent current words whose letters
  join to the same thing, so «непроглядная» finds «не» + «проглядная». **This replaces a text
  curation subsystem the desk was drifting toward and should not build.** An engraver's split
  becomes a match to recognize rather than a corruption to repair.
- **The previous text is stored with the song**, one optional string, a few hundred bytes,
  **no schema change**, because `validateRecord` copies only the fields it knows
  (`library.ts:136-212`). Every future edit then goes through the re-seat rules Dann ruled on
  2026-09-07 with no guessing.
- **Re-finding by anchor shrinks to a one-time repair at load**, for seats already frozen.
  N.160's original every-redraw re-finding is withdrawn. The two are not redundant: stored
  text covers the future, the repair covers what is already broken.
- **Retired:** `refreshPairings`, `ownedByPoem`, and re-seat rules 1 and 2.

### THE SAFETY RULE, and it governs every step

**A seat Ilya cannot find keeps what it shows now, and it is counted. It is never erased.**

### The sequence

1. ~~**The score obeys every switch** (N.159).~~ **CLOSED 2026-09-21**, `1d18514`, walked.
   It also counts frozen seats, and its first reading on Dann's library was 67 drawn live,
   29 kept as stored, of 96.
2. ~~**A dry run.**~~ **CLOSED 2026-09-21**, `2fb7516`, read by the desk on Dann's library:
   `96 seated = 77 address + 9 anchor + 5 joined + 1 rejected + 4 unfound`. He exported a
   binder backup first.
3. ~~**The stored text plus the repair.**~~ **CLOSED 2026-09-21**, `46ac52f`, walked by Dann:
   *"yes :)"*. The heal wrote 14 of 96, 9 by anchor and 5 by the joined-run rule, and the dry
   run afterwards reads 91 address, 1 rejected, 4 unfound. **The prediction was 14 and 91, and
   both landed.**
4. After 2026-10-30: stop storing the IPA and the vowel for new placements.
5. After 2026-10-30: the clitic seat writes poem positions, then verses.

**DESK DEFAULT: steps 2 and 3 move N.132 to week 3 and spend the week-5 buffer.** That buffer
is the only slack, and week 1 already spilled five items into week 2. `SCHEDULE.md`'s own rule
is that once the buffer is gone, the lowest line in a week moves to LATER and the date stands.

### THE ONE RULING DANN OWES, and it is deliberately deferred

**When a word has truly left the poem, does its note keep showing the old syllable, which is
today's behaviour and the default until he rules, or clear to blank?**

**THE COUNT IS NOW REAL, 2026-09-21, and the prediction of zero was wrong: five notes, and
they are all one word.** Notes 92 to 95 of Dann's Sunless song carry «о ди но ка» from address
`0-38`, and note 96 «я.» is rejected only because the guard found it with no matched
neighbour.

**BUT THE QUESTION'S PREMISE IS NOT ESTABLISHED, WHICH IS WHY IT IS STILL NOT ASKED.** Code
observed 2026-09-21 that the heal cannot place a frozen seat onto a word another seat already
holds, and «одинокая» in the poem is held. **So those five may be blocked rather than
orphaned, which is a different defect and not a ruling at all.** Settle that before asking him.
Putting a ruling to him about a word that left the poem, when the word did not leave, is the
manufactured decision `CONTRACT.md` §3 forbids.

**The desk removed this from Code's desk defaults:** blanking a note removes something a
singer can see, and its frequency was NOT ESTABLISHED.

---

## N.163. ILYA SHOWS A SINGER A WORD THAT IS NOT ON THE PAGE. Ruled in by Dann 2026-09-22

**Source: N.146's walk finding 4, 2026-09-17.** It sat inside a closed spec for five days,
moved to `OWED.md` on 2026-09-22, and Dann ruled it into the tracker the same day on the
desk's recommendation that **it meets the freeze rule's own false-statement test.**

**What happened.** On walk 4 the OCR read line 6's «То» as «Го». The page shows a stem with
a bar across both sides; the reading has the bar on the right only. **Transcription then
drew it as `'go` with the gloss "go".**

**Why it is worse than a bad OCR reading.** Ilya did not merely mis-read. **It passed the
mis-reading into the dictionary and presented the result with a gloss**, which is the voice
Ilya uses for things it knows. A singer has no way to tell that word from a correct one.

**NOT ESTABLISHED, and the desk is not choosing between these:**

- Whether the fix belongs at the OCR layer, at the dictionary seam, or in **how a word Ilya
  cannot vouch for is presented.**
- Whether the existing OCR guard helps. **N.146 step 2 already refuses a reading that is
  mostly not Russian words** (shipped `fe4d2c7`, `6e98057`), and it did not catch this,
  because «Го» IS a Russian-shaped token. **A majority test cannot catch a single wrong
  word.**
- Whether any signal exists at the seam to distinguish a confident reading from a doubtful
  one. **If none exists, this is a bigger item than it looks.**

**DANN'S, AND NOT YET ASKED:** whether a word Ilya is unsure of should be marked on screen.
**`CONTRACT.md` §6 forbids a mark that appears on everything**, and his N.146 ruling forbids
Ilya advertising that it is changing tactics. **A mark here would have to be rare and
specific, which is the test his N.151 page-mark ruling already sets.**

---

## N.164. INSIGHTS STATES TWO THINGS AT ONCE THAT CANNOT BOTH HOLD. Ruled in by Dann 2026-09-22

**Source: N.146's walk finding 7, seen on Dann's screenshot 2026-09-17 at 00:50.** Same
history as N.163: buried in a closed spec, surfaced 2026-09-22.

**What the page said, in this order:**

1. Compass **A3 to F♯6**, tessitura D4 to C♯5.
2. Reference range **"Not typed"** on all three rows.
3. *"Without the range you typed, this page cannot say whether this key suits you."*
4. **"Nothing in this piece is flagged for your voice."**

**Lines 3 and 4 cannot both be true.** If nothing could be checked, nothing could be
cleared either.

**A second thing on the same screen:** the compass reads to **F♯6**, which is implausible
for a sung line in that song. **The reader read the top staff in 17 systems by its own
receipt**, so the compass may be describing the piano rather than the voice.

**A third:** a tall empty region at the top of the Insights box.

**ALL THREE ARE NOT ESTABLISHED AS FAULTS until the code is read**, and they may be three
faults or one. **The desk has not opened `InsightsPane.svelte` for any of them.**

**Why it is release-relevant:** `PRODUCT.md` says Insights forecasts and never declares, and
**"Why Ilya exists" makes an uncited number the thing Ilya refuses.** A cleared verdict
resting on data that was never available is that fault in its plainest form.

**RULED 2026-09-25, 13:14 to 13:18. Lines 3 and 4 are fixed together.** Code read by the desk
(`../sessions/memo-desk-code-reading_r1_2026-09-25.md` §1, and `i18n.ts:1498`, `:1500`,
`CalibrationWizard.svelte:315`, `:1111-1114`, `:1423-1449` read 2026-09-25).

- **Dann's principle, his words, 13:14:** *"We want Ilya to frame processes positively where
  possible, and point to solutions after naming a challenge."* Stated as a default, not an
  edict (tether 19).
- **With no range typed, the two lines become one.** Offered by the desk, ruled by Dann 13:16
  ("Great!"): *"This page doesn't know your range yet. **Add your range**, and it can tell
  you whether this key suits you."* ("doesn't know" replaced "doesn't have" at 13:22, to
  match the French.) The findings line does not print in this state. The
  desk's reason, agreed by Dann: it counts checks that never ran.
- **"Add your range" is a link that opens calibration on the Range fields; Done returns to
  Insights.** Dann asked for it (13:16, *"a clickable hyperlink to the section so they don't
  have to hunt"*); the desk gave it its shape; ruled 13:18. Today Range is reachable only
  from a secondary button on the wizard's summary page, which a voice with no readings never
  shows first.
- **Name things by what the singer sees, never by a tree heading.** Dann 13:17, correcting
  the desk's "Add it under Voice characteristics". Tether 18 already says this.
- **An obvious way to decline or ignore the offer.** Dann's own addition, 13:18: *"and an
  obvious means for the user to decline or simply ignore our help."* **Shape RULED 13:20:**
  a quiet **"No thanks"** after the link (offered by the desk). It hides the line on every
  song. Dann's words: *"Those who simply ignore will continue to see the message and those
  who click no thanks will not be harassed by it."* **DESK DEFAULT, 13:21: the decline is
  remembered across reloads**, following the install prompt's decline
  (`InstallPrompt.svelte:62-67`, one `localStorage` key), because a line that returns on
  every reload is the harassment he ruled out. The desk had first said it would store
  nothing and cited N.27; that was an overreach, since N.27 is about library and profile
  saves (`STATE.md`, the N.27 paragraph), not a UI preference. Adding a range makes the
  line moot either way.
- **French, RATIFIED by Dann 13:22** (drafted by the desk; « connaît » replaced « n'a pas »
  on his question about the verb; his words: *"I love connait, it's perfect"*):
  « Cette page ne connaît pas encore votre ambitus. **Indiquez votre ambitus**, et elle
  pourra vous dire si cette tonalité vous convient. » and « **Non merci** » for "No thanks".
- The compass (A3 to F♯6) and the tall empty region stay NOT ESTABLISHED; this ruling
  does not touch them.

---

## N.165. THE LOUPE DRAWS NO NOTES. DESK DEFAULT number, found by Dann 2026-09-22

**Full account and the brief:**
`../sessions/brief-n165-n166-blank-loupe-and-the-reloaded-scan_r1_2026-09-22.md`.

**Observed on his screen**, French, Annotation tab, song
`sunless-01-v-chetyryokh-stenakh_lamm-scan`: he clicked a printed note and the loupe opened
holding **clef, two sharps, 6/4 and barlines, and no noteheads**. Twice, on measures 5 and
6. **The header knew what it held both times** (« A4 · temps 4, division 2 · Noire », then
« C#4 · temps 2, division 2 · Noire »), and **the page above drew the same measures
correctly.**

**Both failing measures report « trop pleine »: 6.5 of 6, then 7.5 of 6.**

**TWO HYPOTHESES ARE LIVE AND THE DESK HAS NOT SEPARATED THEM.**

- **Dann's:** the score carries no lyrics. His words: *"I assumed this was because there was
  no text, but that shouldn't matter."*
- **The desk's:** the measure is over-full.

**`~/Downloads/no-lyrics-control.musicxml` separates them in one run**: no lyrics, and its
measures add up.

**It bears on N.151's ruling of 2026-09-17** that Ilya must tolerate a measure with more
beats than the meter allows. **If an over-full measure draws no notes, that ruling is not
met.**

**A lead the desk read but is NOT calling a cause:** `renderLoupeMeasure`
(`loupe-render.ts:79`) returns `LoupeSystemRender | null`, and `loupe-render.test.ts:87`
already asserts a null return for one range.

**Riding with it: the squircle loses its bottom edge in the loupe** and is closed on the
page. **No number of its own; N.141 already carries a viewBox clamp as open** and the brief
asks Code to say whether this is that item.

---

## N.166. A STORED SCAN MAY NEED THE PAGE READER TO REDISPLAY. DESK DEFAULT number, 2026-09-22

**Found by the desk while investigating N.165**, and it is the more serious of the two if it
holds.

**What happened.** The desk opened the same song, from the same library, on the same origin,
in its own Chrome tab. **The score never drew.** The drawer sat on
`upload.status.preparingReader` (`i18n.ts:899`, shown at `ScoreUploader.svelte:530` and
`:556`) for over twenty seconds, with no PARTITION receipt and 12 SVGs on the page, all of
them chevrons.

**The instrument was sound.** `Kabalevsky - Shakespeare - T05` rendered in the same tab
moments later: 28 SVGs, 834 elements, page reader idle.

**Why it matters.** **A stored score should not need the OCR reader to redisplay.** If it
does, every scan-derived song re-runs the reader on every load. **Dann's 23-page PDF read
took 97.2 s on 2026-09-17.**

**NOT ESTABLISHED.** The brief asks Code to report it and **not to fix it in that ship**:
its fix is a different path from N.165's, and it may touch the load path that N.161 has just
been through.

---

## N.167. A FRENCH SINGER CAN SIT THROUGH THE WHOLE READER WAIT READING ENGLISH. Ruled in by Dann 2026-09-22

**Found by Code 2026-09-22** while verifying its own replacement of
`upload.status.preparingReader`. **It predates that change and is not caused by it.**

### What was seen, and this part is solid

In the browser pane the drawer was in French, its language toggle offering « English »,
**and the page reader's waiting line came up in English and stayed English for the whole
wait.** That wait is about a minute on a one-page PDF and longer on a real score.

### Code's reading of the mechanism. NOT established by the desk

The line's text is fixed once from the `language` value in play at that moment
(`ScoreUploader.svelte:134`), and is never re-translated afterwards, **so a restore that
begins before the stored language has loaded stays in English for the entire wait.**

**The desk has not read `ScoreUploader.svelte:530` or `:556` in context** to confirm how the
value is held. **Code's own words on the limit of what it saw:** *"That could show up on his
walk."*

### Why this is not a French-parity tidy-up

**`PRODUCT.md` §"Both languages, start to finish", stated by Dann 2026-09-22:** *"French
users aren't jsut capricious humans who insist on imposing French when they can really speak
English. Some can, some can't."*

**So a singer who cannot read English receives nothing at all for that minute**, on the one
screen whose entire purpose is to explain why nothing is happening. **The desk first
recommended this ride with N.131 and withdrew that the same day** once Dann stated the
principle; both halves are in `OWED.md`.

### NOT ESTABLISHED

- **Whether Dann ever sees the English on the alias.** His screenshot of 2026-09-22 showed
  the French. **The timing differs between the pane and his Chrome and nobody knows why.**
- **How wide this is.** If the cause is a value captured once at mount, **other status and
  error strings set the same way would share it**, and no one has looked.
- **Whether it can be fixed without re-rendering the waiting line mid-wait**, which is a
  different question from translating it.

### What this is NOT

**It is not N.166.** N.166 is that a stored scan re-reads at all. **This is what the singer
reads while it does.** Fixing N.166 shortens the exposure and does not remove it: a first
read still waits, and still waits in whatever language was set at that instant.

---

## RULINGS HOMED FROM SESSION FILES, 2026-09-30 20:30

**Why this section exists.** A read-only Sonnet sweep (2026-09-30 20:23) looked for Dann's rulings recorded only inside `../sessions/` files. The desk re-read every source line below before copying it here. Each entry: the ruling, quoted from its source; the source `file:line`; who offered it. **Built or not is NOT checked here**; several are likely in `i18n.ts` already. Coverage limits are at the end of the section.

### Photos and HEIC (no item number)
- **2026-09-24 19:43, ruled by Dann:** honest messages now; curved-photo reading and a HEIC decoder after the release. `../sessions/brief-code-photo-messages_r1_2026-09-24.md:7`. Evidence: `../sessions/memo-code-phone-photo_r1_2026-09-24.md`. Also in `SCHEDULE.md` (UNSETTLED-6 and LATER).

- **2026-09-30 20:32, Dann:** restore a camera glyph in the Input field's top-right corner that opens the phone camera; amends N.108 increment 4 (2026-09-03). **20:34, ratified:** `intake.camera` "Take a photograph" / « Prendre une photographie », desk-drafted. `../sessions/brief-code-camera-in-the-field_r1_2026-09-30.md`; `QUEUE.md` row 2e.

- **2026-09-30 20:56 to 21:00, Dann, calibration:** the singer sings the vowel first, as usual, to set the vocal tract; a moment's pause; then fry with that shape, which alone is recorded and processed. *"Most singers will not feel comfortable going from modal singing into fry."* Flow (one tap begins, desk-offered) and four strings RATIFIED 21:00. `../sessions/draft-sing-first-cue_r1_2026-09-30.md` §REVISION 21:05; brief `../sessions/brief-code-sing-first-then-fry_r1_2026-09-30.md`.
- **2026-09-30 22:16, ratified by Dann:** `pacifier.wheelAria` and `pacifier.ready` ("Tap {v} to begin." / « Touchez {v} pour commencer. »), drafted by Code. Seated by `../sessions/brief-code-seat-missing-rulings_r1_2026-09-30.md` §3.
- **2026-09-30 23:21, ratified by Dann:** the tessituragram bracket's French « la moitié du temps chanté » (desk-drafted, replacing Code's « la moitié du chant », which can read as "the song") and « centre ». Seated by `../sessions/brief-code-text-page-empty-with-poem_r1_2026-09-30.md`, last section.
- **2026-09-30 23:42, ratified by Dann:** ten singer-facing strings that the code marked PLACEHOLDER with no ruling (calibration readiness, roster, challenging-vowel invite, Markup's withheld-syllable legend); five redrafted by the desk so Ilya, not "we", speaks, and "test fry" for "throwaway fry". `../sessions/brief-code-calibration-copy-ratified_r1_2026-09-30.md`, QUEUE row 2l.
- **Held, not raised:** the Guide says « tractus vocal » once (`GuideContent.svelte:46`); Learn and the ratified calibration cue say « conduit vocal ». One term per concept; for N.84.

### N.131, drawer French (2026-09-24 18:47 to 18:53)
- « Pièce » stands (18:47); « Entrée » stands (18:50); « Exportation et importation » stands (18:51); « %s lignes » / « %s ligne » stand (18:52); his 2026-09-16 alternatives withdrawn. « Retirer » restored for `intake.clear` (18:52). 18:53, Dann: *"I trust your recommendations for the remaining items. Proceed."* So: `intake.dropHint` "Drop your file here." / « Déposez votre fichier ici. »; « Lecture des mots du PDF… » and « Lecture des mots de l’image… » restored; `paper.empty.mobile` « Touchez » stands. `../sessions/memo-audit-rulings-vs-tree_r1_2026-09-24.md:67-77`. Offered by the desk where it says so; ruled by Dann.

### Insights vowel chart
- **2026-09-24 09:53, ruled by Dann:** *"print the whole ten-vowel lyric diction inventory in its decided sequence, and assign a value of 0 when a vowwel doesn't appear."* `../sessions/brief-code-vowel-chart-all-ten_r1_2026-09-24.md:9`.
- **2026-09-24 09:57 and 09:59, ruled by Dann:** *"if there's text, it should appear in Text as a transcription too"*; *"Text in the system must yield a transcription if that text populates Markup."* Same file `:36`.
- **2026-09-23 03:39, ratified by Dann, desk-offered:** with tempo state `none`, the chart heading is "Share of phonation per vowel" / « Part de la phonation par voyelle ». `../sessions/brief-code-tessituragram-fix_r1_2026-09-23.md:26`.

### Voice intake
- **2026-09-28 15:40, Dann:** *"reorder the Range, Tessitura, and Passaggio intakes to list the higher limits first, followed by the lower limits."* `../sessions/brief-code-voice-intake-order-and-keep-reading_r1_2026-09-28.md:7`.
- **2026-09-30 10:48, ratified by Dann:** « Garder ma lecture », « Hors de la plage habituelle ». `../sessions/brief-code-small-fixes-before-ship_r1_2026-09-30.md:27`.
- **2026-09-30 12:32, ratified by Dann:** voice type slice B copy, English and French, with « Certaines voix ». `../sessions/draft-voice-type-slice-b-copy_r1_2026-09-30.md:40`.

### N.82, the watch band (2026-09-28)
- **15:04, ratified:** group 1 French, solfège key names lowercase in prose. **15:06, ruled:** IPA on the watch band takes square brackets in both languages; default, with the exception that an explicitly phonemic context may use slashes. Dann: *"music students look for those square brackets in general text to set IPA glyphs apart."* Offered by the desk. **15:06, ratified:** group 2. **15:10, ratified:** group 3, redrafted as actions on Insights' rotated openers. `../sessions/n82-watch-band-draft_r1_2026-09-28.md:242-245`.
- **16:21, ruled by Dann** (*"YEs!!!!!! :) :)"*), desk-offered: the box says less, advice for the hard spots only. His 16:20: the grouped one-sentence-per-kind form is *"a last resort."* `../sessions/brief-code-watch-band-says-less_r1_2026-09-28.md:11`.

### N.173, curation
- **2026-09-28 20:32, ruled by Dann** (*"yes"*, desk recommendation): threshold 2, a TRIAL value. `../sessions/draft-curation-rules_r1_2026-09-24.md:115`.

### Markup legend
- **2026-09-28 22:17 and 22:18, Dann:** *"Justify them if possible, if not, let's get rid of them."* Then *"Remove the four."* (the Captured and Provisional footer lines). `../sessions/brief-code-markup-legend-four-out_r1_2026-09-28.md:7-13`.

### Latin and credits
- **2026-09-27 00:58, ruled by Dann:** *"Perfectly comfortable. We have these attributed, right? I want unassailable citation to preserve our claims of scholarly fair use."* `../sessions/table-seminarian-latin_r1_2026-09-27.md:66-68`.
- **2026-09-27 07:03, ratified by Dann:** the Richter credit wording, both languages; English and French drafted by the desk. `../sessions/brief-code-richter-credit-wording_r1_2026-09-27.md:6-8`.
- **2026-09-26 21:39, Dann:** reconstituted я between two soft consonants becomes [a]: *"yes ... Please reexamine the current code to make sure we're not duplicating."* Desk-offered analogy. `../sessions/brief-code-reconstitute-interpalatal-ya_r1_2026-09-26.md:32`.

### Insights method
- **2026-09-23 00:27, ruled by Dann:** a large or wide leap is a minor sixth or greater; outside the range, the approach is moot; the six rules of addendum 2 are struck (*"AI slop that lacks understanding"*). `../sessions/method-leaps_r1_2026-09-22.md:252-258`.
- **Dann:** *"Self-reporting is unreliable and we won't engage in that for this purpose."* Self-report struck as an intake path. `../sessions/insights-phonation-time_r1_2026-09-22.md:57`.

### N.154, strings
- **2026-09-25 12:44, Dann:** remove "Nothing on this page is hand-written": *"Get rid of it."* `../sessions/brief-code-n154-strings_r1_2026-09-25.md:20`.
- **2026-09-28 14:54, 14:55, 14:58, ratified:** rows 1 to 12, including « l'Annotation » and *"Paste your Russian text into the Input field."* `../sessions/n154-strings-draft_r1_2026-09-28.md:99-101`.

### What this sweep did NOT cover. Start the next audit here
1. **Rulings before about 2026-09-20 were not checked one by one** (n104, n113b, n114a/b, n117, n121, n126, n129 r1, path-pass-inc2, colour-token-rename, loupe-typeface, n149, n150, n155, n156, n159, n119b). Rulings that live only in `../sessions/LOG.md` count as stranded under this section's rule.
2. **658 ruling lines with no time stamp** were not read one by one.
3. **Open schedule, tracker, owed and queue lines were NOT checked against the memos that may answer them.** That sweep was written and not run (2026-09-30 20:23). UNSETTLED-6 was the case found by hand.
4. **Whether each ruling here is built in the tree was not checked.**
5. **Conversations never written to any file cannot be found by any sweep of the tree.**

---

## RULINGS HOMED FROM SESSION FILES, PART 2: BEFORE 2026-09-20. Audit of 2026-09-30, 22:30 to 22:50

Two read-only Sonnet sweeps found these rulings recorded only in `../sessions/` files or in `../sessions/LOG.md`. **The desk located each source line itself before copying it here** (grep, 22:44). Built-or-not is NOT checked for most; several are built, and the loss was the record, not the behaviour. A status of SUBJECT GONE means the thing the ruling governs no longer exists in the interface; the ruling is kept as history and governs nothing.

### Colour (2026-09-13)
- Token roles: *"the division is the paper versus everything on the screen, not the paper versus the pointer."* `--sage-gloss` takes the one paper use, `--sage-deep` the other eight. `../sessions/memo-colour-token-roles_r1_2026-09-13.md:13`.
- Four colour rulings, RATIFIED 2026-09-13: (1) the ramp is even; (2) twelve neutrals become ten; (3) three strays go, one splits; (4) the fourth value is a rule, not an exception. `../sessions/spec-colour_r1_2026-09-13.md:63`, `:101`, `:142`, `:164`.
- Band colours take the language-chip tokens with white text (Piece `#5C739E` 4.77:1, and the others in the table). `LOG.md` about line 1431, 2026-09-02. Status in the tree NOT ESTABLISHED.
- *"sage names the text intake, lavender names the score intake, which is hue naming place."* `LOG.md:1761`, 2026-08-20. Likely SUBJECT GONE with the three-band drawer (`PRODUCT.md`); NOT ESTABLISHED.

### Drawer (2026-09-02 to 2026-09-03)
- A fourth radius, 20 px, for surfaces (*"20 looks terrific"*), amending "three radii, no fourth". `LOG.md:3351`. **Conflicts with `PRODUCT.md` "Radii | three"; the 2026-09-02 ruling is later.**
- The first group is PIECE, not File: *"not every piece will be a song: some will be arias."* `LOG.md:3361`.
- No fold: an open station grows in its group; the drawer must not rearrange under the singer's hand. `LOG.md:3341`.
- The opening state is the map of everything and fits without scrolling. `../sessions/brief-to-design-n108-drawer-three-groups_r1_2026-09-02.md:31`.
- The intake watermark is retired, amending N.65 (2026-08-20). `../sessions/memo-n108-intake_r1_2026-09-03.md` (watermark section).
- Clear on the score takes the header fields with it. `../sessions/memo-n108-takeover_r1_2026-09-03.md:114`.
- The tab slide leaves the drawer. `../sessions/memo-n108-takeover_r1_2026-09-03.md:88`.
- Every button that draws a box takes 999 px ends; fields, frames, receipts and bands keep their radii. `../sessions/memo-n108-finishings_r1_2026-09-03.md:48`.
- n114b item 6: the same air above the open syllable box as below it. `../sessions/brief-n114b*` (item 6).

### The loupe
- **Compound metre** (2026-09-08 walk, *"not optional"*): 6/8 is two beats of a dotted quarter, not six; numerator a multiple of 3 with denominator 8 or 16 counts in dotted beats. `../sessions/brief-n113b-walk-findings_r1*.md:27`.
- The locator's second line names note, beat, and duration. Same brief, `:23`.
- The taken note's box goes lavender (`:15`). Likely SUBJECT GONE under the squircle rule; NOT ESTABLISHED.
- The loupe stays open after a placing click; Undo and Redo cover placements as well as shifts; the receipt tag reads POEM. `../sessions/memo-n111-3b-loupe*.md:1`, `:20-27`.
- A change made from the loupe's dock is reflected in the loupe at once, with no forced reopen. `../sessions/memo-n111-hand*.md:414`.
- The loupe inserts the correct meter signature for every measure it displays (N.138, 2026-09-14). `LOG.md:4617`.
- Every meter assignment in a score draws on the page (N.139). `LOG.md:5124`.
- The loupe's background is transparent and takes the loupe's native background (N.133). `LOG.md:4859`.
- The tap band is bounded in stave-spaces (2.5 fine, 7 coarse). `LOG.md:575`, August.
- Bound the head at the leftmost drawn ink of the music; §4.3 "later systems should move" waived (2026-08-29). `../sessions/brief-n104-loupe-head*.md:142`.
- The tacet bar: `measureSp` 8 (down from 12), numeral scale 1, clearance 0.9 (2026-08-29). `../sessions/brief-n104-ship*.md:34`.
- Undo and Redo marks are `↰` and `↱`. `../sessions/brief-loupe-typeface_r1*.md:97`; whether Dann ruled it is NOT ESTABLISHED in the brief itself.

### Score and files
- Marks in the edit surface: staccato, tenuto, fermata, breath, *"on the test that each changes how long the voice sounds"*; accent and marcato out (2026-09-17). `../sessions/spec-n92-edit-surface_r1*.md:81`.
- No keyboard-only mode and no new chrome. Same spec, `:121`.
- If there is text, it is fed through the transcription pipeline and kept *"as a formatting Transcription"* (2026-09-12). `../sessions/brief-n121-score-fills-the-poem_r1*.md:10`.
- An import ADDS songs and never touches the song you are in (2026-08-18). `LOG.md:27`.
- A default naming convention when there is no header to name the song from (N.143b, 2026-09-15). `LOG.md:5684-5688`.
- Option 2: *"Instant for everything, with the photo report shown after the score arrives"* (N.145, 2026-09-16). `LOG.md:5791`.
- Not adopted from Finale: Adjust Baselines and other engraving controls, Type Into Score on the paper, verses, Clone (2026-09-06). `LOG.md:3187`.
- Bar numbers: the post-rest number is *"a useful courtesy"*. `../sessions/brief-n126-measure-numbers_r1_2026-09-15.md:89-92`.

### Header
- The language toggle is ONE pill naming the language the singer is not in (2026-08-20). `LOG.md:1401`. Built (the « Français » pill seen on Dann's phone 2026-09-30).

### Superseded, recorded so nobody revives them
- **"Dann writes copy"** (`LOG.md:1289`, 2026-08-20, about a printed excerpt's header and footer): superseded by `CONTRACT.md` §4 as amended 2026-09-19 and by his ruling of 2026-09-19 that the desk drafts and he ratifies.
- **The dictionary fill** on the "Transcribe and fit" pill (`../sessions/brief-n117-dictionary-fill_r1_2026-09-12.md:9`): SUBJECT GONE, the button was removed (`PRODUCT.md`, N.145). N.117's load bar remains open.
- **Undo and Redo in the top bar** (`PRODUCT.md`, 2026-09-09 and 2026-09-10): superseded 2026-09-17; marked in place.

### What this audit still did not cover
1. `LOG.md` blocks 1 to 7 were sampled through keyword lines only (lines 1 to 3038 at about one in three), not read in full.
2. About 560 session files were not opened beyond keyword lines; named unread: memo-n112 beyond two lines, memo-n127 and brief-n127, the inventory, estimate and sequence bodies, brief-n135.
3. The August rulings kept only in the claude.ai project knowledge (`claude/*.md`, 374 documents) were not searched.
4. Anything said in conversation and never written down.

---

## RULINGS HOMED FROM THE CLAUDE.AI PROJECT KNOWLEDGE, PART 3. Audit of 2026-09-30, 23:35 to 23:55

A read-only Sonnet sweep read about 43 of the project's 374 documents (`claude/*.md`). **Verified by the desk against the document itself (23:50):**

- **E.36, ruling 4's sixth clause, 2026-08-10:** *"I want the sixth clause."* The clause, worded by Opus and adopted: **"Control geometry answers to input modality, not to form factor or brand."** Hook: `@media (pointer: coarse)`, not a width query; the desktop keeps its sizes. Also ruled: touch geometry E, a 44 px floor with the exemption rule *"Every exemption is named in the record with its justification. An exemption that is not named does not exist."* `claude/e36-RULED-touch-geometry_2026-08-10.md` §0 and §1. **Bites now:** row 2e's camera glyph was keyed to width; QUEUE row 2k.
- **E.38, Path A, 2026-08-10:** *"Path A as you recommend"*: `.musx` stays on MNX; the product's ingest path unchanged; MusicXML from denigma goes into the harness only. `claude/e38-ruled-path-a-musx-stays-on-mnx_2026-08-10.md` §1.
- **E.37, six numbers, 2026-08-10:** N.17 viewport repair; N.18 the anchors; N.19 calibration date; N.20 D3 Job A (per-verse reprint), Job B declined (*"unvaried text prints once"*); N.21 the desk selector (later N.42); N.22 the English-only drawer. `claude/e37-numbering-ruled_2026-08-10.md`. `OWED.md`'s register gap table lists N.18, N.20, N.21 as NOT ESTABLISHED; this is their identity.

**Found by the sweep, NOT verified by the desk. HISTORY, NOT IN FORCE (desk default 2026-09-30 23:40, on Dann's comment that many will no longer apply to the app as it stands):** none of these is cited as a constraint. If a current decision touches one, read it against later rulings (tether 17) and bring Dann the case, never the prohibition (tether 19). E.19 (2026-07-30) Sunless 1 m. 17 closed, *"do not fix the code to emit an [o] at E3"*, bare G is G3 and bare A is A2; the 16 July soft-sign ruling (`claude/e33-a-rule-dann-never-made`); E.34 (2026-08-08) *"75 percent is our limit for no justification, 76 percent justifies"*, homographs must be resolved, regressive voicing assimilation *"is essential"*; E.36 anchors and *"swipe to close, chevron to open, keep both"* (likely overtaken by the September drawer); E.41 attribution hierarchy; Fable's eleven-principle GUI slate of 2026-08-18 (only some homed; Dann's ratification of each not established); E.45 storage, *"store the source and the corrections; derive the melody"*; the July [o] to [ɑ] cover rulings; the page-walk procedure; the E.38 goal ledger's date-affirmed rule; E.31 late rulings. Full table: the sweep's memo, reproduced in `../sessions/ledger-rulings-vs-tree_r1_2026-09-30.md` §G.

**Not covered:** about 330 project documents, including the later E.40 to E.48 handovers and most specs.

## N.84, THE GUIDE REWRITE. Spec opened 2026-10-01

**Homed here 2026-10-02 from the `STATE.md` close blocks of 2026-10-01, before those blocks moved to `LOG.md`.** (1) **The Guide's example song is Tchaikovsky, Op. 38 No. 3, Jurgenson 1878** (IMSLP #1052590, pages 11 to 13 of the set), chosen 2026-10-01 between 14:28 and 15:20; the copy is `~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf`. (2) **Its French title, « Au milieu du bruit d'un bal », was ratified by Dann 2026-10-01 14:41.** (3) **Dann's own « (sinon Ilya la nommera) » was added to the walkthrough** the same afternoon. Both stand in `../sessions/draft-guide-walkthrough_r1_2026-10-01.md`. (4) **The Insights and Markup Guide French was RATIFIED** on 2026-10-01 after 03:00; it stands in the last section of `../sessions/draft-guide-insights-and-markup_r1_2026-10-01.md`. (5) **The walkthrough's French is PAUSED at Dann's word (2026-10-01 15:00), not abandoned.**


**Done when:** the Guide describes the interface as it now is, in English and French, with new screenshots, and Dann has reviewed the prose (`SCHEDULE.md`, N.84 line).

**The walkthrough's shape. RULED BY DANN 2026-10-01 00:35**, choosing the first of three shapes the desk offered: *"I think we eventually need all three, but for now let's do item 1"*. Who offered the three: the desk. Who ruled: Dann.

1. **Now:** one session on one real score from Dann's library, from intake to print, through Text, Insights, and Markup, with a short side note for a singer who has only the poem.
2. **Later, not scheduled:** a second walkthrough for the poem alone, and short sections by situation (a PDF, a photograph, only the poem). A default, not a wall: either may fold into the first if the first proves to cover it.
3. **AMENDED BY DANN 2026-10-01 01:02:** *"Make the other two now."* All three are drafted in this session: `../sessions/draft-guide-walkthrough_r1_2026-10-01.md` (the score session), `../sessions/draft-guide-walkthrough-poem_r1_2026-10-01.md`, and `../sessions/draft-guide-by-situation_r1_2026-10-01.md`.

**Carries:** the fry essay (N.174, `../sessions/draft-guide-fry-essay_r1_2026-09-30.md`); the stale names in `QUEUE.md` under N.84; the tessituragram paragraph (`../sessions/guide-tessituragram-paragraph_r2_2026-09-10.md`); Revert to score header (this file, "For N.84 (Guide)"); « tractus vocal » to « conduit vocal » (`GuideContent.svelte:46`). Renamed anchors go through `$lib/guide-anchors.ts`.

## N.175, VIDEO WALKTHROUGHS. Numbered by Dann 2026-10-01 01:15

**His words:** *"I want us to take the finished build and create these videos which you will help me post to a YouTube channel that we build to support Ilya. That way we can host hyperlinks to this video content without glutting the app. I am open to a different solution if you devise one."*

**What it is:** short clips in English and French, made from the finished build, posted to a YouTube channel built for Ilya; the Guide links to them rather than carrying the files.

**Desk proposals, offered 2026-10-01 01:12 to 01:20, NOT RULED:** short clips (30 to 90 s), one per task, each beside its Guide section, with captions and a written transcript; the text Guide stays primary; clips recorded from the real app with Playwright (already in `apps/web/package.json`) so they can be regenerated when the interface changes; HyperFrames or Remotion only for animated explanations; narration in Dann's voice preferred over a synthetic one (Kokoro has one French voice, graded B− by its makers). Hosting alternatives and their costs are in the 2026-10-01 01:20 reply.

**Depends on:** the interface being finished (Dann: "the finished build"), and N.84's written walkthroughs, which are the scripts.

**Added by Dann 2026-10-01 01:17:** *"we may also be able to take captures from the videos for inclusion as images in GUIDE"*; *"develop a sequence of tasks to perform, and flesh out scripts for these tasks in English and in French. There are precedents from other software packages we can use as best practices"*; and lean on the architecture document *"to capture how Ilya works and what users are most likely to want to see modeled in video."*

**RULED BY DANN 2026-10-01 01:21:** *"I will happily narrate both the English and the French videos as long as I can depend on your help for the logistical stuff (accurate translation and register, coordinating with YouTube and that excellent links to a short address on Ilya's own domain, such as `ilya.dannmitton.com/video/calibrate`, which forwards to whichever video is current."* So: **Dann narrates both languages. The desk owns** the French translation and register of every script (drafted for his ruling, per `CONTRACT.md` §4), the YouTube logistics (titles, descriptions, caption files EN and FR, playlists), and the forwarding links. Who offered the forwarding links: the desk (01:16). Who ruled them in: Dann. The links are built by Code, as redirects on Ilya's own domain.

**Desk proposal, 01:20, NOT RULED:** one Playwright script per task produces the clip AND the Guide's full-resolution stills at named steps, in both languages, rather than stills cut from compressed video. `ARCHITECTURE.md` (222 lines, a codemap and invariants) supplies how Ilya works; what singers want to see comes from `PRODUCT.md` and N.170's outside eyes, not from the codemap.

## N.120, N.177, N.178: TEMPO AND DYNAMICS ON THE PAGE. Ruled by Dann 2026-10-01 02:37 to 02:39

**His proposal, 02:37:** *"expand Ilya's OCR/OMR capabilities to capture tempo markings and dynamics in a score, whether they appear attached to the vocal line, or when they aren't, carrying them up and grafting them from the piano staves to the vocal score. It is unlikely that Ilya will be able to do this with 100% fidelity, so the user needs to be able to go in and correct or edit or simply attach their own dynamics and tempo markings to their taste and ability. By attaching these marks to the vocal line, Ilya will have a way to gauge playback speed and commensurately adjust estimates of phonation time."*

**The desk's critique, ruled in by Dann 02:39** (*"Your feedback seems reasonable so I think this is ready for a brief when the time comes. Yes, number this accordingly."*). Who offered the refinements: the desk. Who ruled: Dann.
1. Three steps, in dependency order: **N.120** (the Tempo station, already numbered) with the shared gradual-tempo convention shown as a range, fed from MusicXML and the singer; **N.177**, a dynamics layer the singer can add and edit, plus dynamics read from MusicXML (`musicxml-parser.ts:1002-1004` skips them today); **N.178**, reading tempo words and dynamics from scans, as research measured on real pages. The page reader reads neither today (`apps/web/static/reader/`: clef, key, time signature, metre, beams, rests only).
2. **Tempo grafts from any staff automatically**; it belongs to the whole system. **A piano dynamic arrives only as a suggestion, marked "from the piano"**, for the singer to accept or dismiss, because piano and voice dynamics often differ on purpose. A default with its condition, per tether 19: a piano dynamic may graft silently only if Dann rules a case in.
3. **The marks live in their own layer, positioned by measure and beat, and are drawn over the vocal line.** Tempo changes happen in piano interludes too, and `VocalLineEvent` does not change (`CONTRACT.md` §6).
4. Tempo feeds phonation time and the cycle dose; dynamics feed Insights' forecasts and advice (the frame of 2026-09-23 16:24). Each is tested on its own.

## THE STAND-IN VOWEL VALUES. Ruled by Dann 2026-10-01 02:56

**His words:** *"ok I rule in this design, with the voice-type mapping, as the method for the stand-in values."* Who offered the design: the desk, building on Dann's idea (02:51) that a singer's vowels ordered close to open trace an fR1 arc and a descending fR2 diagonal, with velar-i the exception (his dissertation; NOT READ by the desk). Who ruled: Dann. **Amends** his ruling of 2026-09-16 that a declared voice type plays no part in choosing values: the voice type now chooses the starting staff.

**The method:**
1. **Template:** the Bozeman staff for the singer's voice type, from *Practical Vocal Acoustics* (2013), "Approximate First Formant Locations", five staves (kenbozeman.com/formant-location.php; image read by the desk 2026-10-01, copy in `~/Downloads/bozeman-1st-formant-locations.jpg`). Mapping: Soprano → Soprano; Mezzo-soprano and Contralto → Mezzo Soprano; Tenor and Countertenor → Tenor (countertenor by the tract: DESK INFERENCE, flagged); Baritone → Baritone; Bass → Bass; Not sure → the middle of all five.
2. **One or two sung vowels:** slide the whole template by the singer's mean log offset (uniform scaling; Anikin, Barreda & Reby 2024, *Behavior Research Methods* 56(6): 5588-5604, read by the desk 2026-10-01).
3. **Three or more vowels spread across the arc:** also fit the arc's height and the diagonal's slope. The desk's extension, labelled as one that shows its steps.
4. A sung value is never changed. Every stand-in is flagged with the step that made it.
5. A sung vowel far off the shape prompts a retake rather than bending the template.
6. Velar-i, [ɪ], and [ʌ] keep the existing derivations (`derivations.ts`), pending the desk's reading of the dissertation on velar-i.

**Corrections the desk owes before the brief:** Ilya merges tenor and mezzo (`plausibility.ts:61`) and cites its baritone to a website PDF (`:89`); the 2013 page has separate Mezzo and Tenor staves and a printed baritone. Read both staves note by note against the 2021 figure before splitting. Henrich, Smith & Wolfe 2011 figures were seen through a fetch summary only, NOT READ in the article.

## N.135, ADDENDUM 2026-10-01 (was N.180, struck 14:20 as a duplicate; the desk numbered it without searching the tracker)

**What is true today, read by the desk 2026-10-01:** a score file that carries words fills the poem box and seats them (`+page.svelte:3259`); a scanned or photographed SCORE yields notes only, and Ilya says so (`upload.banner.reader`, `i18n.ts:917`; `upload.banner.noLyrics`, `+page.svelte:4464`); a page with no staves is read as a poem by OCR (`ScoreUploader.svelte:290`, `:405`; the guard in `ingestion/ocr-guard.ts`).

**The item:** read the underlay text from a score page and seat it, as a research item measured on real pages before any accuracy is promised, beside N.178 (tempo and dynamics from scans). Known risk on record: N.163, an OCR misread («То» as «Го») reached a singer as a false word with a confident gloss. The singer's poem owns the text today (the code's own words, "THE POEM STILL OWNS THE TEXT", `+page.svelte:637-638`; `PRODUCT.md`, THE TEXT AND THE NOTES, NOT re-read by the desk tonight); how a read underlay and a typed poem reconcile is a design question for Dann.


## N.178 AND THE SCAN READER. Dann's rulings of 2026-10-01 and 2026-10-02, homed at the close of 2026-10-02

**The plan is `../sessions/plan-scan-reader_r4_2026-10-01.md`. This section holds the rulings; the plan holds the design built on them.** Each quotation is transcribed as written. Homed from the chat and from the briefs named in `QUEUE.md` rows 18 to 20.

1. **The goal, 2026-10-01 15:11:** *"By the end of day I want Ilya processing a scan, extracting a melody with respectable accuracy, and seating Russian lyrics underneath their corresponding notes predictably."* The melody includes *"the metre, the barlines, the pitches, the rhythms, the rests, the dynamics, the tempo indications, and the pickup."* **15:22:** *"Guessing is not a modality for well-constructed software."*
   **Amended by Dann, 2026-10-02 02:31:** *"a scan in, a melody out, IPA seated under it and Russian seated under that."* The short form "a scan in, a melody out, Russian seated under it" was the desk's compression of his 15:11 words, and it left out the IPA. Markup draws the IPA line under the notes and the Cyrillic line 20 px under the IPA (`packages/score-parser/src/staff-renderer.ts:3377-3378`, `:1171`). The IPA arrives with the words (plan r4, section 4, "Seat").
2. **The measure, 22:22:** 95 of 100 notes and 9 of 10 syllables, and no confident non-word (plan r4, section 2).
3. **A system may have no voice, 16:08:** *"we must teach Ilya that a vocal line will not always be present. It may serve us to point out that voice lines are usually monodic while piano lines feature chords, generally. Not always, but this is a useful starting place."* Built in row 18 as tacet systems.
4. **Words are read from the scan first; the poem is an optional second witness** (22:47, and 23:06: *"I truly feel like dropping a complete score in should be enough?"*).
5. **Read once, keep both, 23:18:** *"Yes! Let's enact: 'read once and keep both the scan and the reading.'"* Recorded in `CONTRACT.md` section 6 as the second exception to "do not store anything derived".
6. **Tempo text, dynamics, and hairpins, 23:06:** *"Correct, this is new essential functionality that we need to build and install."*
7. **The scorer may change, 23:06:** *"it is there to align with our need and not vice versa."*
8. **Hyphens and correction, 23:18:** syllables split by hyphens are sewn back into words the dictionary recognizes. *"Legitimate misreads and errors should be able to be manually edited painlessly and easily by the user."*
9. **Lines restored, 23:18:** *"in many cases punctuation will signal a line break. Enjambement happens, but it is comparatively rare."* Punctuation proposes; metre and rhyme decide (the second clause is the desk's design, plan r4).
10. **Underlay languages, 23:31:** the Cyrillic line only for this release. *"I think for right now if Ilya can handle English, French, and Russian we are in very good shape."* The rest is deferred (`INBOX.md`, 23:33).
11. **The metre is auditioned, 2026-10-02 01:06:** *"there should be a combination of likely Araabic numbers (1 through 9) to audition, plus the simple arithmetic of the contents of a confirmed bar to weigh against that audition as a sanity check."* **01:12:** numerators are most often 2, 3, 4, 6, 8, 9, 12, 16 and denominators 2, 4, 8, 16; used as a weight, never a gate (the weight is the desk's design). **01:16, compound metre:** *"3/8 is really 1/8 where the main beat is a triplet"*; 6/8 answers to 2/4, 9/8 to 3/4, 12/8 to 4/4. **01:18:** *"Classical and Romantic music often beams 3/4 as if it were 6/8, and can also beam passages of 6/8 as if it is 3/4 to highlight hemiola."* So beaming never changes the metre read.
12. **The ossia, 01:53 to 01:57:** two heads on one stem do not halt the read. The larger head is the note: *"it would be wisest to choose the larger notehead of the ossia by default"*. Two heads of one size: *"this construct should be flagged for user intervention: the user should have control over selecting which possiblity they prefer, or deleting the other option."*
13. **A head and a flag's hook, 02:11 and 02:15:** a head's white core is a closed shape, as Loupe was taught of the natural sign, and the head and the hook each have a shape of their own. Both are measures in row 20's brief.
14. **A hollow head on a line shows two closed shapes, 2026-10-02 02:37:** *"When the notehead appears centred on a stave space, it will appear as a closed shape. But when that hollow notehead intersects a stave line, it will read as two closed shapes because the horizontal stave line will bisect the hollow nnotehead."* (Transcribed as written.) Row 20's brief r3, section 3.1, already has Code measure each core with the staff lines in and with them removed, for this reason. The desk's check on Code's report, a DESK DEFAULT: a hollow head on a line is not refused for showing two cores.
15. **The foundations use Dann's own engravings, 2026-10-02 08:52:** *"all six Sunless songs are in my Finale Files, so is Kabalevsky's op 52 which are ten Shakespeare sonnets, an excellent opportuniity to practice line breaks that corresond with known poetic structure. Please use these for our benefit! Yes!!"* (Transcribed as written.) So the six *Sunless* files are truth for the scan reader's test set, and the ten sonnets are the measuring set for lines restored (plan r4, track B2): a sonnet's fourteen lines are known. At 08:50 he also said of the skipped foundations: *"You are the Project Manager... It is up to you to manage and initiate these things since they are part of the plan."*
16. **The test set, ruled in by Dann 2026-10-02 09:00** (*"Yes, I rule this set in, looks good."*). Who offered it: the desk, after his question at 08:56 (*"Why hold back Sunless 4 5 and 6 when we need 6 songs?"*). Eight songs. **Built on:** Tchaikovsky Op. 38 No. 3, and *Sunless* 1, 4, 5, and 6. **Test only, never looked at while building:** *Sunless* 2, *Sunless* 3, and Tchaikovsky Op. 38 No. 2. Truth for the six *Sunless* songs is his own engravings (`../sessions/memo-desk-truth-from-finale_r1_2026-10-02.md`); for the two Tchaikovsky songs it is by eye. At 08:56 he added: *"whether each of your engravings matches its scan in key and in edition, I can't say. HUman error in data entry is possible :)"* So where a file and the scan differ, the scan is looked at and the scan decides.
    - **AMENDED by Dann 2026-10-06 00:33, on the desk's recommendation:** *"yes"* to opening *Sunless* 3 for diagnosis after the frozen run of 00:32 scored it 64.41 (143 of 222) and *Sunless* 2 86.76 (59 of 68) (`../sessions/report-code-test-only-songs_r1_2026-10-06.md`). *Sunless* 3 is a build song from that minute; *Sunless* 2 stays held back. Replacement test songs are owed (truth exists for ten Kabalevsky songs; their scans NOT ESTABLISHED). Who offered it: the desk.
    - **The replacement test songs, found 2026-10-06 00:40 on Dann's word** (*"I do have scans of the Kabalevsky... generational photocopies... excellent as tests for real-world PDFs"*, 00:34): `~/Documents/Repertoire & Scores/Scores - vocal/Kabalevsky op52 - 01.pdf` to `- 10.pdf`, image-only (no fonts; 2,480 by 3,507 pixels a page), 2 to 5 pages each. Truth for all ten: `tools/e16-harness/output/truth/kabalevsky_shakespeare_t01...t10.truth.json`, from Dann's Finale engravings (where a file and the scan differ, the scan decides). The desk has not opened their pages. No. 5 may already have been looked at (`~/Downloads/kabalevsky-op52-5-p1-300dpi.png` exists); treat it as seen.
    - **More test songs, Dann 2026-10-06 00:36:** IMSLP holds many Russian songs for voice and piano that he does not know, which makes them fair tests. Each needs a truth file before it can be scored (the desk drafts one by eye, as for the Tchaikovsky); without one, a song can still test that the reader runs, that the metre and bars hold, and that the bar check fires.
    - **AMENDED by Dann 2026-10-06 19:26, on the desk's recommendation:** *"yes"* to opening Kabalevsky op. 52 nos. 2, 4, 7, 9 and *Sunless* 2 for diagnosis, after the held-out run of the night (`../sessions/report-night-2_r1_2026-10-06.md`). They are build songs from that minute. The new held-out set is IMSLP songs Dann does not know, with truth files the desk drafts. Who offered it: the desk.
17. **Kabalevsky's sonnets are planned as cleared for scholarly use, 2026-10-02 09:00:** *"I live in Canada where fair use for scholarly tools permits me to use these works since I generate no profit from them... We will plan as if the pieces are cleared for our scholarly use. Both cycles are featured in m,y dissertation with the same melodic extraction that we are building here (I performed it manually in 2020)."* (Transcribed as written.) The desk follows this for all testing and building. **What the desk checked the same hour, and it is not legal advice:** Canada's term went to life plus 70 years on 2022-12-30 and is not retroactive; an author who died in 1971 or earlier keeps life plus 50 (Canadian Association of Research Libraries, FAQ on term extension, read 2026-10-02). Marshak died in 1964, so his translations have been public domain in Canada since 2015. Kabalevsky died in 1987, so his music is protected in Canada to the end of 2057, not 2027. The 2027 in these records is the Lamm edition of *Sunless* in the United States (`STATE.md`, the 03:00 block of 2026-10-01). **DESK DEFAULT, his to overrule:** the sonnets are used freely for testing and stay out of the public repository, because publishing is the one step that is hard to undo. In the same message: *"I doubt that our release will happen before January 2027"*; recorded as said, and `SCHEDULE.md`'s date is not changed on it.
18. **Two DESK DEFAULTS, made in the briefs of rows 20 and 21 on 2026-10-02 and homed here. Dann has not ruled on either; they are his to overrule.** *A head sits at the end of its stem:* a stem leaves a head in one direction, and ink that runs on past a candidate in both directions is a stroke through it (a sharp, a barline, the letter of a dynamic). *A note is known by its company:* on the voice staff of a braced system, a filled candidate that the first tests refuse is a head when a stem stands at its flank, leaves it one way, and runs as far as the measured heads' stems do. Every head admitted this way is marked in `G['byCompany']`; the page-model brief decides how it is shown. Built in row 21, SHIPPED `887931f` (`../sessions/brief-code-a-note-is-known-by-its-company_r2_2026-10-02.md`, section 4).

19. **The design direction of 2026-10-02, 15:04 to 15:59. Dann's words, each transcribed as written. A living draft: he asked questions and invited critique, and none of these is an edict.** The desk's shape of each, the measurements, and the cautions are in `OWED.md`, the items under "A design to measure next".
    - **Analysis by synthesis, 15:05:** *"I think I'm asking for an application of the analysis through synthesis paradigm?"*
    - **The pristine stave, 15:16:** *"we know what a pristine stave looks like: five identical parallel horizontal lines... Leftovers become a nonissue when we understand and know to look for those five parallel equal width lines; they are literally the foundation of Western music notation."*
    - **Layers, 15:16:** *"isn't this motivation to install a layer paradigm into the reader? If it can process an image once virtually, it can do it twice or any number of times subtractively and then additively."*
    - **Vector objects, 15:18:** *"Instead of a notehead being an ovoid collection of pixels, my take would be to have the notehead *be* a mathematical ovid whos centroid would sit at a fixed coordinate on the stave that would tell us what pitch it is and whether its notehead is open or solid."* **15:26:** *"I think it's more workablre to step away from a scripted paradigm to an Object-oriented one."* **15:40:** *"a discrete object overlapping another discreet object is superior to an array of pixels of uncertain provenance"*.
    - **Gould as the reference, 15:16 and 15:29:** *"We should lean into Gould' swork as the reference it is."* *"I really think Gould will help us correctly locate augmentation dots as well. She tells us where they should be placed for elegant engraving. Then Ilya can apply a sanity check of the virtual notes to see if they add up to the meter signature's prescriptive rhythmic sum."* His ruling of 2026-08-18 still governs: a Gould prior bounds a dimension and never decides a meaning.
    - **Slurs, 15:40:** *"Every slur is going to have a set of coordinates: two termini that can be located on the page, an apex or a nadir depending on whether the slur arc upward or downward, and the parabolar that defines its arc through these points."*
    - **Spacing, 15:55:** *"we should develop a system based on elements in such a way that spacing does not determine duration, but can usually confirm it."*
    - **The page's own house style, 15:55:** *"Ilya may be able to distil the house stylue of a page to help us improve accurary. Once the scan informs the key variables Ilya watched for, Ilya should be able to reconstruct a page and use our comparison between its virtual synthetic rendering against the pixellated scan to choose."*
    - **Scans vary, 15:40:** *"the scans Ilya will porocess will represent a spectrum of high-contast to greyscale elelements and we need to prepare fo that."*
    - **Where to begin, 15:26:** *"we could begin by using a variety of Final files (predictable Maestro fonts for reliable measurement) and widely-0available IMSLP scans"*.
    - **Photocopying, 15:59, a question:** whether photocopy technology offers workable paradigms. The desk's answer is in `OWED.md`.
20. **DESK DEFAULTS of 2026-10-02, 09:32 to 16:05, homed here. Dann has not ruled on any; each is his to overrule.** *The order is lengths, then rests, then the metre,* a departure from plan r4's "Phase 4 before 5", because his metre audition (item 11) leans on the arithmetic of a confirmed bar. *A note inside the margin of a bound abstains,* and what a reader brief must lower is the count of lengths Ilya misreads with confidence (`../sessions/brief-code-length-is-read-from-shape_r2_2026-10-02.md`). *Row 23 shipped with one gate missed* (*Sunless* 2), recorded in `QUEUE.md` row 23. *`INK_WEIGHT_GUARD` stays at 0.1428* until the render pages are scored with the shape rule on. *The trial of item 19's direction comes next,* before hollow heads, rests, and the metre, and it must clear the check row 23 missed.

21. **The job and its bar, restated by Dann 2026-10-04, 13:28 and 13:38. Each transcribed as written.** They frame the appraisal commissioned the same day (`../sessions/commission-appraisal-of-the-approach_r1_2026-10-04.md`).
    - **The job:** *"We are essentially replicating input page data but enhancing it with semantic relationshjips past the flattened, printed page."* And: *"SO yes: notes correct, and text underlay for those notes correct."*
    - **The words come from the page:** *"At the moment it is myuinderstandnig that we rely on a text poem as our second witness. This will always be so, it is not the problem. OUr problem is our dependency on the second witness for the production of our \*correct\* extraction."* This agrees with item 4 (words are read from the scan first; the poem is an optional second witness).
    - **The number:** *"Ideally the number I want is perfection.l You originally suggested 95% and since you suggested it I assume it is workable?"* The desk's answer the same hour: whether 95 is reachable by a cold read is NOT ESTABLISHED, and the appraisal is to say what is reachable and by what route. Item 2's measure stands until he rules otherwise.
    - **Old rulings and Ilya's growth:** Ilya began as the Text apparatus alone, then took in the music, then the pedagogy. *"Sometimes we see legacy edicts that cause friction with Ilya's evolutionary growth. This is expected and we resolvethese points of friction as we become aware of them."* The app's instruction to type the words of a scanned score is one such remnant (`upload.banner.reader` in `apps/web/src/lib/i18n.ts`).

22. **Dann's rulings and directions of the evening of 2026-10-04 and the night of 2026-10-05, homed at the close of 2026-10-05. Each transcribed as written. Where one answers something the desk offered, it says so.**
    - **RULED, 21:47, on the desk's recommendation of 21:45** (homr makes the first reading; Ilya's own reader checks it and gives each note its exact place): *"Sure, we can go with your recommendation."* This returns to his first ruling of July, "adopt homr behind an AGPL boundary" (2026-07-23, `claude/e16-decisions-log_2026-07-22.md`), which a measurement of faulty test pages had replaced within a day (`../sessions/memo-desk-july-and-october-on-homr_r1_2026-10-04.md`).
    - **The need, and how the desk serves it, 22:27:** *"We need a working OMR module."* and *"Why can't I jsut tell you what I want (Ilya) and you mnake it happen?"* The five rules that follow from that message are in `CONTRACT.md`, the paragraph dated 22:27. Under its fourth rule the charter's tripwire T3, "no machine learning anywhere" (`tools/e16-harness/reader/README.md:7`), is dropped.
    - **The licence, told to Dann at 22:35 and explained at his request at 22:34 and 23:27. Standing unless he objects; he has not objected:** with homr's reader inside it, Ilya as a whole is distributed under the AGPL-3.0; his own code stays MIT; the source stays public; homr and its browser port are credited. On the credits, 23:27: *"Yes, there is a section on licenses and acknowledgments in LEARN, I believe?"* Built in `NOTICES.md` and `apps/web/src/lib/components/Reading/GuideContent.svelte`; the French there is a proposal he has not reacted to. Told to him at about 02:00 on 2026-10-05, standing unless he objects: the source of the desk's changed copy of the port sits in his repository beside Ilya, and nothing is published anywhere else.
    - **No question of clef or key, 23:27:** *"I'm glad there was "no clef or key question," I've been eager to reach the point where a question wasn't necessary to answer manually, from the user POV."*
    - **Silent bars collapse, 23:27:** *"I believe we have programmed commands to consolidate multimeasure rests to sabe spacve? This was cone in consultation with gould's text. Can we adopt that for our current reader please? Collapsing multimeasure rests saves page real estate ergo printing."* Built in `apps/web/src/lib/omr/join-pages.ts` (`silent`); watched by the desk; not yet seen by Dann.
    - **Checks over homr's output, 23:35:** *"What efficient code can we build to filter homr's output and watch for known errors and fix them so that Ilya shouw superior accuracy?"* and *"We can at least take a first crackj at its out put and alter that for our needs, right? Critique."* The desk agreed, with two conditions it stated: each check is measured before it is trusted; a check changes a note only where its rule is certain, and marks the spot otherwise. **01:03:** *"Have we salvaged other alterations we made to our reader that can be ported over to our homr filter?"* Parts of Ilya's own reader are to be used in the checks. Not built.
    - **The bar rule, corrected by Dann at 00:52:** *"'Every bar must add up to the metre.' This is not always true: anacrusis (opening bars), and ending bars often make up the difference from the short opening bar"*. The rule as the desk builds it: the first bar may be short; the last bar passes if it is full, or if it and the first bar make one full bar; the same at a repeat sign or a double bar inside a song; a change of metre changes what "full" means; a bar marked free is exempt; any other bar that does not add up is marked, never changed. Not built. The desk's count of 23:38 (21 bars flagged on four songs) was made under the uncorrected rule and is not to be quoted until it is run again.
    - **A glyph on the line of words always yields a value, 20:06:** *"Can we shape a rule that when glyphs are detected within the termini established for lyrics, then there must be a value delivered?"* Built at the bench (`../sessions/assembly-a-scan-to-a-seated-song_r1_2026-10-04/assemble5.py`); not in Ilya. The desk's refinement, put to him and not answered: a value or a visible doubt, never a forced guess.
    - **Reading by context, 20:03, on the desk's offer:** *"A big yes to 'Reading by context, written down as rules.'"* **How common a word is, 20:22:** *"We will build thid if it will help."* A helper's prototype moved whole words read as printed from 148 to 152 of the one build song at the bench; it is not in Ilya (`../sessions/memo-sonnet-russian-word-frequency-resources_r1_2026-10-04.md`).
    - **Training, 20:15 and 22:27:** *"Please plan to get involved in that trinaing as it beceoms necessary."* and *"Ca we train analogously? IMSLP contains multiple scores we can use. I have a membership with IMSLP."* **22:34:** *"I'm sure my mac can tackle anything processor-heavy."* The desk withdrew its claim that training needs a rented machine. Nothing about training on his iMac is measured.
    - **homr's newest build, 00:54:** *"Please check to see if homr's new version is available in a format we can assimilate?"* It was not; the desk had it ported (`../sessions/report-opus-bring-the-port-up-to-homr-main_r1_2026-10-05.md`). Not in Ilya.
    - **Phones, 23:31:** *"Does this mean that our mobile users will experience a confidence-undermining lag wqwhile processing?"* Not measured on a phone. The wait message must be true for the device before this reaches singers.
    - **From the afternoon, 15:14:** Dann has no access to Soundslice, PhotoScore, or SmartScore, and offered any permission the work needs.
23. **Dann's directions and words of 2026-10-05, the second thread (02:25 to 14:41), homed at its close. Each transcribed as written.**
    - **What the night was for, 02:40:** *"What I really want to know is what you will be doing while I sleep? PLease connect your activities to our development plan and tell me what you will be working non to advance us."* What the desk did with the night is in `QUEUE.md`, rows 29 to 33.
    - **THE GEAR-DOWN, 06:48:** *"Ok so I can't afford to keep up using Fable Extra. I need to gear down or I'll brun through my subscription by Wednesday. Create a plan that moves us forward with a lower model and we will work through it."* and *"I am overwhelmed with complexity and you won't help the way I need you to."* The desk's plan of 06:55 is in `STATE.md` (the close of 2026-10-05, 14:50). **He has not answered the plan.** At 06:58, of a lower model: *"IN the model I can afford to use there are funcamental judgment and integrity problems. It's nice to use Extra because that model thinks with more speed and complexity, but I can't afford to run Extra despite needing that level of integrity."* So which model sits at the desk is not settled, and it is his to settle.
    - **He is weighing whether to go on with Ilya,** said at 06:48 and again at 07:02. The desk does not argue for it and makes no forecast.
    - **Reliability, 07:04:** *"It is worth exactyl nothing if it doen'st work reliably. Does it work reliably right now? You know that it doesn't."* The desk answered no, with what it could stand behind: 786 of 805 notes read as printed on five songs, by a helper's count; a footnote read as eight bars of a song; not tried on a phone; not shipped.
    - **The seat the desk writes from, 07:01:** *"It's very hard for an AuDHD person to fully articulate plans and motiovations and logic and have that care be disrespected with your lies and confident red herrings."* and *"You could have the user centred as your POV but you keep choosing your most comfortable default instead of the challenging solutions that works."* The rules that follow are in `CONTRACT.md`, THE POSTURE, the paragraph dated 2026-10-05.
    - **The windows, 06:52:** *"I have a mess of open windows and I have doubled up the dev server. I do not know which windows are integral for you and I need help sorting them out. I will be happy not to have to face this when we are done."* No window holds anything a desk needs.
    - **Markup's squircle, 06:55:** homed under N.141 in this file, and in `QUEUE.md` row 34.
    - **The reader's accuracy work:** the desk's plan sets it aside until he reopens it. What the night counted is in `QUEUE.md` rows 31 and 33: 34 of the 56 differences on the five build songs are one footnote printed small; 14 of the 15 pitch misreads are the accidental only; the trial at reading the sign from the page did not pass.

24. **A saved scan reopens through homr and keeps its reading. RULED by Dann 2026-10-05 22:54** on the desk's three options: *"I choose your option 3"* (read once with homr, keep the reading stamped with the reader's version; a newer reader re-reads on purpose). Who offered it: the desk. Found by the desk at 16:26: a restore went through the old reader (`apps/web/src/lib/score/ScoreUploader.svelte:780-785`). Built as runbook step 2 (`../sessions/runbook-reader-95_r1_2026-10-05.md`).

**What these do not cover:** how the unsure mark, the ossia, and the stored reading look to the singer (plan r4, phase 1, not drawn); French for any new string; the six-song test set.

## THE CORRECTIONS REDESIGN. Dann's rulings of 2026-10-08, homed the same afternoon

Briefs `../sessions/brief-design-corrections_r1_2026-10-08.md` to `_r3_`; Design's returns `../sessions/design-corrections_r1_2026-10-08.md` and `_r2_`; survey memos `../sessions/memo-sonnet-*_r1_2026-10-08.md`. Each ruling is a default with its reason (tether 19).

1. **Consistency, 12:50:** *"I think users rely on consistency."* The row of stations never moves; a station that cannot act is greyed and a tap says why. Departs only if a singer cannot find a control because of it.
2. **Helpful curation, never onerous, 12:59:** *"I think helpful curation is helpful. Onerous curation is not helpful, ultimately."* After a read, a review of the flagged bars is offered, never imposed.
3. **"x of y", 13:01:** the review shows where the singer is, *"to establish navigation and set expectations."*
4. **Less mental energy, 13:06:** Soundslice's phrase, taken as a principle. Cognitive load is a cost for every singer.
5. **The page is the authority, not the arithmetic, 15:50:** *"what we are looking for is not simple alignment in arithmetic... we are looking to replicate the rhythmic values assigned by the composer."* An offer names what Ilya may have missed and sends the singer to the printed page. Wording, Dann 15:53 to 15:55: **"Does A or B match a triplet in your score?"** (indefinite article, Dann 16:01: *"the definite article takes the presence of a triplet for granted while the indefinite article give the user agency to respond yes or no"*) (his *"Does A or B reflect a triplet in the score?"*, with the desk's "match" for "reflect", which he accepted at 15:55) (replacing the desk's "Does your score print a 3 over A or over B?", which *"sounds odd to an evolved musician"*) Dann 15:54 offered "tuplet" as the umbrella term. DESK DEFAULT: the sentence names the kind when every candidate is the same kind ("a triplet") and says "a tuplet" when the candidates differ (a triplet at A, a quintuplet at B); each button names its own kind.; it never argues that a bar should add up. The desk's proposal, not yet ruled: a strip of the scanned bar beside the reading in the review.
6. **Seven stations, 15:51:** *"Seven stations without the octave buttons on the phone."* Accidentals join Pitch. **This amends the PITCH grid of six of 2026-09-17 on the phone only** (`i18n.ts:510-512`); the desk keeps the octave pair where the width allows, and the reason of 2026-09-17 (distance, then direction) holds in the order of the cells. Who offered it: Design (round 2, "Would seven serve"). Who ruled it: Dann.
