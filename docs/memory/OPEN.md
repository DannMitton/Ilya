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
> Insights increment 1 already calls the layer (`apps/web/src/lib/shane/insights.ts:28`,
> `:198`). **What N.123 still owes is the FIGURES** (the tessituragram drawing, the
> half-mass band, the centre of gravity, the cycle dose on the page) and two
> sources: the centre-of-gravity formula and the cycle-dose primary, both NOT
> ESTABLISHED below. The inventory's SPEC-ONLY was wrong, and so was the desk's
> "largest unstarted piece" when it proposed LATER. **Placed IN by Dann 2026-09-16.**
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

---

## N.132. THE RATIFIED NAMES ARE NOT BUILT. Numbered by Dann 2026-09-13. UNPLACED.

**Found 2026-09-13 when Dann walked the colour deploy and saw "Transcription"
and "Score markup" on screen.** He ratified new names earlier the same day, in
both languages, and **nothing tracked building them.** A search of `STATE.md` and
`OPEN.md` for "Melody" returned the ruling and no item.

**The ruling, from `STATE.md` §THE ONE THING, ratified 2026-09-13:** tabs are
`Text` / « Texte », `Markup` / « Annotation », `Insights` / « Aperçus »; the
drawer band is `Melody` / « Mélodie ». The French mirrors the English throughout
and **nothing is coined.**

**What the tree holds today, read 2026-09-13:**

- `i18n.ts:106` `tab.transcription` = "Transcription", both languages
- `i18n.ts:117` `tab.markedScore` = "Score markup" / « Partition annotée »
- `i18n.ts:59` `group.scoreMarkup` = "Score markup", both languages
- `i18n.ts:121` `tab.insights` = "Insights" / « Aperçus » — **ALREADY CORRECT**
- No `Melody`, no `tab.text`, no `group.melody` anywhere

**The geometry rides with it, and it is ruled.** Tab padding goes 0.7 rem to
0.5 rem, that is 11.2 px to 8 px each side, returning 19.2 px across the three.
Measured on the live build in Dann's Chrome: at a 390 px viewport the head has
342 px, and afterwards English has 55.07 px spare and French 15.64.
**OWED, and it is the one thing in this item nobody has seen: 0.5 rem padding on
screen.** Render it before it ships.

**Two traps.**

1. **« Partition annotée » was ratified 2026-08-19 for the OLD name.** The short
   form « Annotation » is ruled for the TAB, and it is free only because the band
   becomes Melody rather than Markup. Do not carry the old French forward.
2. **`i18n.ts:49` records that `group.scoreMarkup` is the same English as
   `tab.markedScore`.** The rename is what resolves that collision, so both move
   together or the collision returns in a new form.

**Whether the KEYS rename alongside the strings is NOT ESTABLISHED and is a
build decision, not a ruling.** `tab.transcription` could keep its key and change
its value.

**Two members of N.131 live here:** `group.scoreMarkup` and `tab.fit` both read
English in the French column today. Fixing them inside this item is cheaper than
finding them twice.

---

## N.140. THE LOUPE GUARANTEES A STAVE SPACE, AND SCROLLS RATHER THAN SHRINKING BELOW IT. Numbered by Dann 2026-09-14. UNPLACED.

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
> Candidate fixes, unruled: remeasure the table in Source Sans 3, or make the
> face a parameter so the two cannot diverge again. **Bears on N.118 and on
> the `columnAdvance` crowding item already in OWED.** Found by Code inside
> the loupe-typeface memo; the desk read all three sites itself.
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
> **SUPERSEDED IN PART 2026-09-16: the control belongs in the Score Markup section, between Corrections and Voice (Dann), and N.94 is IN the release.** **N.94 HAS A HOME AGAIN, 2026-09-13.** Numbered 2026-08-24 as "transposition
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
  (`apps/web/src/lib/shane/first-seat.ts`); not walked, because no wordless score was
  to hand.
- **N.144.** An edited poem still takes the old note-counting path on Start placement
  over, so it can still break a melisma (Code's choice, reversible).
- **N.143.** T05's second lyric line is not IPA (the parser reads `box` on its first
  event); whether other `.musx` files carry an unused `lineOrder` slot is NOT ESTABLISHED.

---

## N.146. ILYA TELLS A POEM FROM A SCORE ITSELF, FOR A PDF OR A PICTURE. Numbered 2026-09-16. THE NUMBER IS A DESK DEFAULT.

**Dann, 2026-09-16, reviewing the N.131 French:** *"can we make it so that Ilya autodetects content? I want to remove this cognitive burden from the user and lay it on Ilya instead. Help!"* and *"Advise me on the simplest design from the user's perspective and we will go with that."* **So the design below is the desk's, adopted on his instruction in advance.**

**Today, read 2026-09-16:** `ScoreUploader.svelte`, `take()`, sends every PDF and every picture to a question, "Is this PDF the poem, or the score?" (`intake.pdf.*`, `intake.picture.*`), per his ruling of 2026-09-03 when the camera icon went. A scanned PDF answered "the poem" ends on `intake.pdf.noText`. Every other file is sorted by its own format sniff.

**THE DESIGN, from the singer's side.** The singer drops a PDF or a picture and it goes where it belongs, with no question.

1. **One rule for both kinds:** if the page shows staves, it is the score; if not, it is the poem. A PDF with a text layer is not enough on its own, because an engraved score PDF carries its lyrics as text.
2. **A poem page with no text layer is read as a picture** (the existing Russian OCR), so "There are no words in this PDF" never appears.
3. ~~**The receipt carries one quiet switch**~~ **STRUCK BY DANN 2026-09-16:** *"Why do we need these labels at all? Why doesn't Ilya just process whatever it can without advertising that it is changing tactics mid-process?"* **No switch and no label.** Ilya tries the likelier reading first and falls back silently: staves found, read the score; the score read yields no sung line, read the page as a poem; no staves, take the text layer, and with none, read the page as a picture. **The named risk, accepted:** a page Ilya misjudges cannot be corrected except by editing the result; the receipt's **Retirer** clears it. Revisit only if a walk shows a misjudged page. **Dann, the same night:** *"if Ilya misjudges a page, I suspect the user will try again? I don't see how the user can make Ilya process something it can't process?"* The desk agreed: the same file gives the same answer, so trying again changes nothing, and the singer's real exits already exist (paste or type the poem; drop the score in another format).
4. It arrives at once, like every other drop (N.145, and `PRODUCT.md`, "Once there is data to process, Ilya processes it").

**The cost that is NOT ESTABLISHED:** how fast staves can be found. The photo reader finds them in Python inside a worker (`page-reader.worker.ts`), which takes seconds to load. A lighter check (long, evenly spaced dark horizontal rows in the rendered page) may do; Code measures both before choosing.

**RULED BY DANN 2026-09-16: A PAGE WITH A POEM ABOVE THE MUSIC IS A SCORE.** His words: *"the house style for many International scores format it this way, with the poem under the title followed by the score. Ilya should be prepared for this and treat it as a score because the text underlay sometimes varies slightly (repetition, omission) from the poem."* So staves anywhere on the page decide it, whatever text sits above them. **The brief's walk should include such a page.**

**Strings:** the question strings and `intake.pdf.noText` retire. **No new strings.**

---

---

## FINDINGS FROM THE N.146 WALK, 2026-09-17. Moved verbatim from STATE.md at the close

> **FINDINGS FROM THE N.146 WALK, 2026-09-17, for the week 1 per-format walk (DESK DEFAULT: recorded, not switched to).**
> 1. The Lamm scan PNG (`~/Downloads/sunless-01-v-chetyryokh-stenakh_lamm-scan.png`, 1290 x 2796, read at staff spacing 10.0 px) drew as nonsense: 4 systems, 57 notes, 0 rests, 7 measures, and **the meter signatures do not agree with the barlines in any measure** (4/4 over about fifteen quarters; 1/4 over six or seven; 4/8 over seven and nine). Dann's words: "The notation is nonsense", "The meter signature does not agree with the barlines". N.146 did not change the read path (`handleFile(file)` gets the original file). Whether this is worse than before is NOT ESTABLISHED; `Untitled, 2026-08-25` was built on the same file. The desk chose a phone-screenshot-sized file as the "photo"; Code's 400 dpi raster of the same scan measured s = 30.0.
> 2. On Ilya's has-met-this-music dialog, **Put it in this song** was followed by a new song, `Untitled, 2026-09-17 (2)`, selected at the top of Repertoire, although the dialog says the file goes in the song you are in. Seen on screen; cause NOT ESTABLISHED.
> 3. Walk 3 (a text PDF, `Repertoire_assignment_rubric.pdf`, dropped while `Untitled, 2026-09-17 (2)` held a score) passed for N.146: no question, the words filled the input field. **The words went into a new song, `Repertoire Evaluation Guide: use`,** not the song holding the score, although the input field's hint reads "Drop the other kind here". Seen on screen; whether this predates N.146 is NOT ESTABLISHED.
> 4. Walk 4 (`~/Downloads/walk-n146-poem-scan.pdf`, image only, made by the desk from `reading-aid.test.ts:89-96`) passed for N.146; Dann: "brilliant!" **The OCR read line 6's first word, То, as Го** (the page shows a stem with a bar across both sides; the reading has the bar on the right side only), and Transcription then drew it as 'go with the gloss "go". A false word shown to a singer; OCR, not N.146's routing.
> 5. Walk 5 (`~/Downloads/walk-n146-poem-photo.jpg`, the desk's synthetic photo: tilted 2.5 degrees, a lighting gradient, grain, blur) routed correctly (no question) and **filled the input field with garble: 82 lines, 302 words, from a six-line poem.** Dann: "lol garble! what is this?" Tesseract reads the file as given (`ScoreUploader.svelte:392-396`), and any non-empty OCR text is taken as the poem (`ingestion/poem-or-score.ts:47-48`), as it was before N.146. **N.146 widens the exposure:** a picture with no staves now goes to OCR with no press, so any such picture becomes a poem and a new song. Whether a real phone photo fares better is NOT ESTABLISHED. **RULED by Dann 2026-09-17 (asked for the recommendation, said yes): Ilya refuses an OCR reading that is mostly not Russian words, as N.146 step 2; cleaning the picture first goes to LATER.** Brief `../sessions/brief-n146-step2-ocr-guard_r1_2026-09-17.md`. **Step 2 BUILT by Code, not shipped** (memo `../sessions/memo-n146-step2-ocr-guard_r1_2026-09-17.md`, read in full by the desk: tokens of 3+ Cyrillic letters, refused past a strict majority unknown; scan 0%, photo 68.3%; web-test 1244). **The desk found it refuses a real poem dropped before the dictionary loads** (`engine.ts:122` starts `{}`; `loader.ts:655` injects only at the end), so step 2b makes the guard wait: `../sessions/brief-n146-step2b-wait-for-dictionary_r1_2026-09-17.md`. Ship both together.
> 6. Walk 6 (`~/Downloads/IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf`, 23 pages, JBIG2 at 600 ppi per `pdfimages -list`, the poem-above-music case) **stuck on "Reading the page…"**. That label is `upload.status.readingPage` (`i18n.ts:888`), shown only on the score path in `handleFile` (`ScoreUploader.svelte:464-468`) while `probeFile` reads page 1 before the clef-and-key check. **So N.146 chose "score" for this page, as ruled; the hang is in the pre-existing probe.** Pages render at 400 dpi (`page-pdf.ts:52`). **Not a hang: it finished,** "Read in 97.2 s": 42 systems, 124 staves, 489 notes, 2 rests, 92 measures; **eleven pages unread** (4, 8, 12, 14, 16, 18, 19, 20, 21, 22, 23); length assumed on 328 notes; the input field stayed empty. Dann: "Finally". N.146's part passed (a score, the poem not taken). The 97 s wait with one static label, and the unread pages, are the reader's; whether the wait predates N.146 is NOT ESTABLISHED.
> 7. Insights on walk 6's read, seen on Dann's screenshot 00:50: compass **A3 to F♯6**, tessitura D4 to C♯5, reference range "Not typed" on all three rows, then "Without the range you typed, this page cannot say whether this key suits you." followed by **"Nothing in this piece is flagged for your voice."** An F♯6 in a sung line is implausible for this song (the reader read the top staff in 17 systems, per its own receipt), and "nothing flagged" sits under a sentence saying nothing could be checked. Also: a tall empty region at the top of the Insights box. All three NOT ESTABLISHED as faults until the code is read; candidates for the freeze rule's false-statement test.
> 8. **Walk 5 repeated on `6e98057`** (N.146 step 2 and 2b, shipped): after **New song**, the photo dropped on the input field showed **"This file was not recognised as a score."** immediately on release, twice (`upload.err.unrecognised`, `i18n.ts:957`). The garble stayed out (Dann: "a good outcome"), but the intended message is "No text recognised in image.", which Code saw in dev. The file's bytes are a normal JPEG. Cause NOT ESTABLISHED; brief `../sessions/brief-n146-step2c-unrecognised-photo_r1_2026-09-17.md`.
> 9. **Step 2c, 2026-09-17.** Code could not reproduce finding 8 and built nothing (`../sessions/memo-n146-step2c-unrecognised-photo_r1_2026-09-17.md`, read in full by the desk). **Walk 5 then PASSED**, walked by Dann about 12:45 in a Chrome Incognito window on the branch alias (its `sw.js` stamp `ilya-1789655907810`, 2026-09-17 10:38, the build of `e3b8eb4`, no app change since `6e98057`), with a real Finder drag of the real 207,216-byte file, after **New song**: "No text recognised in image." after about three seconds, the input field unchanged, no third song. **The cause of finding 8 stays NOT ESTABLISHED.** Two leads, neither tested: (a) DESK INFERENCE, tied to the code: Dann's Finder list was drawing two lists over each other, the photo's row could not be clicked, and the row drawn under it was `wasm-artifact.yml` (1,811 bytes, text); a text file ends at exactly `upload.err.unrecognised` (`format-detection.ts:215`, `ScoreUploader.svelte:838`), fast. A reboot cleared the Finder fault. (b) Last night's walk ran in Dann's everyday profile, whose cached build this walk did not exercise.
> 10. **New song needs two clicks.** Seen twice by Dann 2026-09-17 (everyday profile and Incognito): the first click only moves focus onto **New song**; the second creates the song.
> 11. **A fresh profile opens with a song already listed**, `Untitled, 2026-09-17`, with **Rename** and no **Delete**, before any click (Incognito, 2026-09-17). Every drawer section except Input opened collapsed.
> 12. **Delete asks for confirmation.** Dann read the warning that deletion cannot be undone as an error message, and left both songs. Code's memo also records that **New song** closes the Input section.

## N.147. THE LOUPE TAP, AND THE SYLLABLES MOVE INTO THE LOUPE. Numbered 2026-09-16 (DESK DEFAULT number). IN, under the freeze rule's lost-work exception.

**The finding, Dann 2026-09-16, "unacceptable":** a tap on a note in the loupe both selects it and places the armed syllable (`handleLoupePick`, `+page.svelte:710-713`), so moving around the loupe reassigns syllables by accident. `INBOX.md:187` records only the desk's recommended design of that night; the other three designs were never written down (searched 2026-09-17: tree and project).

**RULED BY DANN 2026-09-17, as defaults:**

1. **The syllable line leaves the drawer entirely and lives in the loupe.** The drawer's Input section keeps the source text only, in the input field. His reason: two copies of the syllabified text confuse the singer, and moving between drawer and loupe to place syllables is inconvenient, worst on a phone. This reverses the placement of N.114 (ruled 2026-09-07 and 2026-09-09, `+page.svelte:4421-4423`). It would be revisited if singers lose an overview they need.
2. **In the loupe it is an accordion expansion under the notes,** and the loupe is treated as a satellite of the drawer: a control surface, which the record already called it (`LOG.md:536`). It departs from the loupe's one constant height (same block) when open.
3. **No syllable is focused or armed by default,** so nothing can be placed by accident.
4. **The syllables scroll when height is short.**
5. **IPA, ruled 2026-09-17.** The loupe's notation keeps its IPA under the notes, on the underlay's near line above the Cyrillic (`staff-renderer.ts:95`), because the interface ties pitch to vowel and IPA, not spelling, gives the vowel. The Syllables row stays Cyrillic only. A placement brings the syllable's correct, in-context IPA to the note that receives it (today's path: `pairings.ts:229`, `+page.svelte:675-676`). The text is linear, and singers are used to scrolling to find text.

**The desk's design within those rulings, 2026-09-17, put to Dann:**

- A note tap only selects (N.147's own fix). A tap on a syllable places it on the selected note, and the selection moves to the next note. Nothing is armed in between.
- **Phone:** one row, 44 px tall, scrolling sideways, because a downward drag anywhere on the loupe already dismisses it (`+page.svelte:1864-1888`; `touch-action: none` at `Loupe.svelte:1513`). The strip needs its own `touch-action: pan-x` to scroll inside the loupe; that this works under the loupe's `none` is DESK INFERENCE, for Code to verify. After each placement the strip glides so the syllables after the one placed sit under the thumb, without arming any.
- **Desk:** the same strip wraps at the poem's own line breaks and scrolls downward when the loupe is short of room. There is no swipe on a desk (`+page.svelte:1882-1883`). The split follows E.36's clause "control geometry answers to input modality" (quoted from `claude/ILYA_PROJECT_MAP_2026-08-10.svg`, snippet only).
- Placed syllables are black and unplaced are tertiary grey, as N.114 ruling 4 has it (Dann 2026-09-07, "Committed is black", `SyllableStation.svelte` head comment); the desk's first draft said the reverse and was corrected the same day. The selected note's own syllable is outlined in lavender.
- **Drawn 2026-09-17** in three attachments (hairline, tray, pull tab) for Dann's pick by eye: `n147-syllables-in-the-loupe.html`, sent in the session, generated by the desk (not in the tree).
- **PICKED BY DANN 2026-09-17: drawing 1, Hairline.** A hairline under the notes, then a SYLLABLES disclosure row in the loupe's tag style with a chevron, then the syllables on the loupe's paper.
- DESK DEFAULTS: the row's open state lives for the session only, with no `localStorage` write (precedent `IntakePanel.svelte:166`; this replaces the desk's earlier "remembers" line); it starts closed. "Syllables" is the desk's coined label; **French « Syllabes », ruled by Dann 2026-09-17.**
- **Brief:** `../sessions/brief-n147-syllables-in-the-loupe_r1_2026-09-17.md`.
- **Cost:** the pairing cursor (`+page.svelte:662`, drawn at `:4441`) loses its job in the loupe; what else reads it is NOT ESTABLISHED until Code checks. Size NOT ESTABLISHED; the release estimate's 1 to 2 evenings covered the tap alone.

## N.148, N.149, N.150. THE LOUPE TAKES THE WORK, AND THE DRAWER'S SCORE MARKUP BAND BECOMES VOICE. Numbered 2026-09-17, DESK DEFAULT numbers.

**Dann's direction, 2026-09-17, after walking N.147:** *"I think we need an in-section Undo/Redo. Can we fit one flush right next to the chevron? The bar should open/close the Syllables accordion except for the Undo/Redo section of the bar."* Then: *"My plan is to get it off that header entirely and populate dedicated Undo/Redo controls into the Loupe's syllables and next, into the Corrections, which will also now be relocated to the Loupe to economize focus."* Then: *"Score Markup as a section of the Drawer is finished, and Voice becomes the new header title of that section."*

- **N.148. Undo and Redo in the loupe's Syllables bar.** The bar becomes one row of three: the SYLLABLES label, which is the disclosure and takes the whole left side; Undo and Redo; the chevron at the right edge. A bar that is itself a button cannot hold buttons (the limit N.114 ruling 2 met), so the label is the disclosure rather than the whole row. Reuses the Score Markup header's own pair (`Drawer.svelte:189`, `:562`, `stackActions`) and its labels (`i18n.ts:378`, `:391`), so no new strings and no new French. **RULED by Dann: one Undo stack, the app's existing one**, whose label says what it takes back. 44 px targets on a phone; both grey out when there is nothing to take back (DESK DEFAULT).
- **N.149. Corrections moves into the loupe**, and the Score Markup header's Undo and Redo retire in the same item, never before. The correction verbs already ride the loupe's dock on a phone, so this consolidates a half-move. **OPEN, for Dann:** what offers Undo while the loupe is closed. The loupe exists only while a note is selected (`+page.svelte:4956`); `Cmd + Z` and `Cmd + Shift + Z` still work on a computer (`+page.svelte:1343-1346`), and a phone would have nothing.
- **N.150. The drawer's SCORE MARKUP band becomes Voice**, riding with N.149 (DESK DEFAULT). The band holds Corrections and Voice today (`Drawer.svelte:623-624`); once Corrections leaves, Voice is all that is in it. Its lavender is already the voice family's. It also ends the collision between the band's name and the Markup tab that N.132 renames. **French owed**; the desk proposes « Voix », adopted, not coined.
- **Cost:** all three are new work inside the release window. N.148 is small; N.149 is not. The checkpoint of 2026-10-09 is where they are cut (`SCHEDULE.md`).

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
