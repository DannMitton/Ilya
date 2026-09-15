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

## N.139. EVERY METER ASSIGNMENT IN A SCORE DRAWS ON THE PAGE. Numbered 2026-09-14. THE NUMBER IS A DESK DEFAULT. UNPLACED.

**Ruled by Dann 2026-09-14:** *"I do want every meter assignment in a score to be
reproduced faithfully."* And, bounding it: *"I agree that inserting a meter
signature at the beginning of each in the score is undesirable."* **The number is
the desk's own. He ruled the behaviour and did not name an item, so he can
collapse this into N.138 with a word.**

**Found by Dann on the 2026-09-13 walk**, as finding 2 of four: the meter
signature is missing from the rendered score, observed on Kabalevsky T05.

**ESTABLISHED 2026-09-14: Ilya has never drawn one, on any score.** The system
head lays out exactly two symbols, computed backwards from `leftMargin`, the clef
and the key signature (`staff-renderer.ts:1654-1664`). The draw calls are the
clef at `:1684` and `:1694` and the key accidentals at `:1712-1718`. No
time-signature draw call exists anywhere in that file. The `timeSig0` to
`timeSig9` glyphs at `:564` are there for the tacet count numeral, per
`:553-558`. So this is a feature that was never built. It is not a regression and
not a parse failure.

**IT IS NOT THE CAUSE OF THE 2026-09-13 WALK'S FINDING 3, WHICH IS CLOSED AND WAS
NOT A DEFECT.** That finding read *"it feels like the measures are half the
rhythmic value they should be."* T05's own file declares 2/4 once at measure 1
and never changes it across 90 measures; its Bass measures fill 2/4 exactly
(measure 9 is quarter, eighth, eighth; measure 10 is dotted quarter, eighth;
measure 12 is a half note); and Dann checked the printed score on 2026-09-14 and
it is 2/4. Read from the `.musx` converted with the project's own denigma WASM
that session.

**SCOPE, from his two sentences.** Draw the opening signature and every change.
Do not repeat it at the start of each system, which is where a meter signature
differs from a clef and a key signature.

**The data is there:** `types.ts:228` carries it per measure, and the change list
is built at `mnx-parser.ts:411-437` and `musicxml-parser.ts:395-455`.

**NAMED COST, and it is why this is separate from N.138.** The head arithmetic at
`staff-renderer.ts:1654-1664` gains a third symbol, so `ksStart`, `clefX` and
`staveLeft` all move left. A change of meter draws inside a system, where nothing
draws today, so the measure-spacing pass has to reserve room for it. That means
fewer measures per system and different pagination, the same class of cost
already named for N.129's hyphen widening.

**Done when:** the opening signature draws at the head of the first system, every
change draws at the measure that declares it, no signature draws at a system
start that declares none, and Dann walks it on the engraved Without Sun song 1,
which changes at measure 2.

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
Without Sun song 2, both on system 10 of 11, where he says the closed box is
wrong under this ruling: **m. 84**, A#3, half, *"this is an example of a
squircle that should imply continuation like we discussed earlier tonight,
because the rhythmic value carries past the measure's barline"*; and **m. 87**,
B3, half, *"same here"*.

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

## N.142. A TIE IS PROLONGATION, NOT A NEW SYLLABLE TARGET. Numbered 2026-09-15. THE NUMBER IS A DESK DEFAULT. UNPLACED.

**Dann, 2026-09-15, and the musical statement is the item:**

> *"Ilya does not understand the rhythmic function of a tie. Ties effectively
> extend the duration of a note. The very same duration, depending on context
> (i.e. meter) can reasonably be expressed through a dotted quarter note, AND/OR
> by a quarter note tied to an eighth note or vice versa. At the moment, Ilya will
> set a syllable under any engraved note that is contiguous. This is an error.
> Ilya must understand that a tie is rhythmic prolongation."*

**The number is the desk's; he described the defect and ruled it an error without
naming an item.** Wave it off or renumber with a word.

### ESTABLISHED 2026-09-15

- **The data is there, on both ingest paths.** `types.ts:439` gives every
  `VocalLineEvent` a `tied?: TieInfo`, and `TieInfo.type` is
  `'start' | 'continue' | 'stop' | 'let-ring'` (`:572-585`).
  **`musicxml-parser.ts:633`** sets it from the sounding tie, and
  **`mnx-parser.ts:720-723`** sets it from MNX's `ties` array. So nothing has to
  be parsed that is not already parsed.
- **Nothing in the seating path reads it.** The list handed to `firstPass` is
  `parsed.vocalLine.filter((ev) => ev.type !== 'rest').map((ev) => ev.id)`
  (`+page.svelte:596`), and the same filter appears at `:1589`, `:2947`, `:3136`,
  `:1448`, `:1456`, and in `correction.ts:574` and `:583`. **Rests are excluded;
  tie continuations are not.**

### RESTS ARE ALREADY RIGHT, AND HIS PARALLEL ALREADY HOLDS

He put the rest case as an analogy to the clitic rule: a rest has no pitch, so it
cannot carry a syllable, as a vowelless clitic cannot. **That rule is already
built.** `firstPass`'s own doc comment states it as a contract: *"@param eventIds
sung note events in document order, rests already excluded."* **Nothing is owed on
the rest half.**

### THE HANDLE IS `tied`, NOT THE ONSET. Recorded because Dann asked the question

He asked: *"Is there a way to associate the assignment of a syllable with the
onset of the note? Tied notes have no onset, they are a continuation."*

**The instinct is right and the handle would not work.** Every event carries a
`rhythmicPosition`, a tie's continuation included, because in the data a
continuation does begin somewhere. **What he means by "no onset" is musical: no
new articulation.** The field that expresses that is `tied`. Onset is a position;
articulation is what a tie suppresses.

### THE CONCEPTUAL FRAME. Dann, 2026-09-15, and it governs the predicate

> *"One way to think about a melisma with my earlier onset idea is to read a
> melisma as a collection of contiguous notes with one single onset: the first
> note is the onset with the syllable assignment, and the subsequent contiguous
> notes lack this onset since it is expected that the same vowel will be sung on
> these notes as is assigned to the primary note."*

**THIS IS THE RIGHT MODEL FOR SYLLABLE ASSIGNMENT, and it unifies the tie and the
melisma under one predicate:** a note either begins a syllable or continues one.

**AND ONE DISTINCTION MUST SURVIVE UNDERNEATH IT, or the analysis is wrong.**

| | a TIE's continuation | a MELISMA's continuation |
|---|---|---|
| new syllable | no | no |
| **new sounded event** | **no.** One note written twice | **yes.** New pitch, new attack, same vowel |
| duration | belongs to the first note's sounded length | its own, at its own pitch |

**Where that bites, and it is not cosmetic.** N.123's cycle dose sums f0 against
seconds over sung notes: a melisma's notes are several pitches each accruing time
under one vowel, a tie is one pitch accruing the sum. **The same is true of every
per-vowel figure Shane produces**, which is the whole point of the product.
**So: one onset rule for syllables, two behaviours for duration and pitch.**

**A SECOND DIFFERENCE, AND IT GOVERNS WHAT THE SINGER MAY DO.** A tie is a fact of
the score and Ilya reads it. A melisma is sometimes read, where a score carries its
own words and encodes it by the absence of a syllable on later notes
(`types.ts:464-479`), and sometimes chosen, where the text comes from the poem box
and the singer sets it with `toggleMelisma` (`pairings.ts:455`).

**So a singer may re-decide a melisma and should not be able to re-decide a tie.**
**Recorded as a strong default and NOT as a wall**, per CONTRACT §1.19: editions do
sometimes tie where a slur is meant, and a singer who meets one needs a way
through rather than a refusal.

**THE PHRASE MARK, raised by Dann in the same breath.** *"Very often melismas will
feature a phrase mark that applies to all its notes. But not always."* A slur over
a melisma is the engraver's own statement that those notes carry one syllable, so
it is a signal Ilya could READ rather than infer. **His "not always" is what stops
it being the only signal: it is a prior, not a rule.** Nothing is built on it and
it is recorded here so the idea is not lost. It touches N.125, which draws slurs
but does not read them.

### THE SHAPE OF THE FIX

**One predicate, applied where the sung-note list is built.** A note is a syllable
target when it is not a rest AND its `tied.type` is not `continue` and not `stop`.
**It deserves a named helper rather than a filter repeated in eight places**,
because "a note that can take a syllable" is a concept in this product and not an
incidental condition. The eight sites are listed above.

**`let-ring` is NOT the same case and is left alone** unless Dann rules
otherwise: it is l.v. notation, rare in vocal music, preserved for fidelity, and
it does not describe a continuation of a sounded note.

### NAMED COSTS, and the second one needs a ruling before anything ships

1. **The count of available notes falls on any score with ties.** `95 / 95 placed`
   becomes a smaller denominator. That is correct, and it will look like a change
   to a number the singer has seen.
2. **EXISTING PLACEMENTS ON TIED CONTINUATIONS. NARROWED 2026-09-15, and it is
   probably not a ruling Dann owes.** A song seated under the old rule may hold a
   syllable on a note that stops being a target. Every remedy has a cost: back
   onto the tie's first note gives that note two syllables; forward shifts every
   later syllable by one and the last falls off the end; dropping it destroys a
   placement the singer made.

   **THE DESK FIRST PUT THIS TO DANN AS A RULING HE OWED. That was wrong, and two
   things narrow it almost to nothing.**

   - **It cannot arise on the score-words path.** Where a score carries its own
     lyrics, the file already does the right thing. **MEASURED on Kabalevsky T05,
     2026-09-15:** the tie from `ev453` in m. 12 to `ev454` in m. 13 gives the
     first note the syllable « ной, » and the tied note **no lyric key at all**.
     Engravers do not set a syllable on a tie's continuation. **So the defect is
     confined to the POEM path**, where `firstPass` seats typed text by counting
     notes.
   - **It only bites if it has actually happened.** Whether any song in Dann's
     library holds a syllable on a tied continuation is **countable, not
     hypothetical**. Count it before designing a migration.

   **RULED BY DANN 2026-09-15: PUSH FORWARD. Every later syllable shifts by one
   and the last falls off the end.** His words, and the reason is the ruling:
   *"Because lyrics are linearly sequenced (following the existence of language in
   time), the only reasonable option is push it forward. Lyrics are not
   mathematical constructs. They exist inside a linear implication of first x then
   y then z, and that order cannot change while still representing the lyric with
   fidelity."*

   **The other two answers each break the sequence**: putting it back gives one
   note two syllables, dropping it removes a word from the line. **Only pushing
   forward preserves the order, which is the thing a lyric IS.**

   **AND THE RULE SIGNALS ITSELF, which is why it needs no mark.** A syllable that
   falls off the end leaves the placed count short, and that count is already on
   the singer's screen. CONTRACT §6 forbids a mark that says Ilya is unsure; none
   is needed here.

   **So the build's first act is a count, not a policy.** If the count is zero,
   no migration is needed and nothing is put to Dann. If it is not zero, the
   merge rule's own principle governs the design: *"an upload never destroys
   placements; only the singer does, on purpose"* (`pairings.ts`, §The merge
   rule), and only then is there a question worth his time.

### NOT ESTABLISHED

- **Whether the renderer draws a tie's continuation as a note the singer can tap**
  and therefore place on by hand, independently of `firstPass`. The loupe's own
  `ownIds` filter at `+page.svelte:1448` excludes rests only.
- **What a melisma spanning a tie should do.** N.113's melisma machinery and this
  rule meet on the same notes and nobody has looked.

---

## N.143. N.134 DOES NOT FIRE ON A `.musx` SCORE. Numbered 2026-09-15. THE NUMBER IS A DESK DEFAULT. UNPLACED.

**Observed by Dann on the deploy `76b24a3`, 2026-09-15**, with screenshots, after
three prior sightings by Code that were each written off to the load. His words:
*"I just pulled T05 in and there is no instantaneous transcription. Why doesn't an
instantaneous transcription appear? We based a whole evening of work on making
that happen."*

**THE TERM IS "THE INPUT FIELD". Dann, 2026-09-15:** *"the input field (not the
poem box grrr)"*. The band is labelled `Input` and the field is where a poem is
pasted, typed or dropped. **Older records, N.134's included, say "poem box"; they
are history and are not rewritten. Nothing written from 2026-09-15 uses it.**

**THE FOURTH SIGHTING, AND THE FIRST BY DANN ON A DEPLOY.** The `INBOX.md` entry
of 2026-09-15 recorded the pattern across Code's three runs. This supersedes it:
it is a defect, not a fixture quirk.

### WHAT HIS SCREENSHOTS SHOW

| | state |
|---|---|
| Score markup | **Draws T05's own words.** « Бог Ку-пи-дон дре-мал в ти-ши лес-ной » |
| Measure numbers | Drawing, including the bracketed courtesy numbers `[9]` and `[28]` |
| **The input field** | **EMPTY.** Placeholder showing |
| **Transcription** | **EMPTY.** "Enter your Cyrillic text in the drawer on the left." |
| The poem receipt | **No `from score` tag** |
| The song's name | **`Untitled, 2026-09-15`**, not named from the score |
| The Piece fields | All empty |

**So BOTH halves of N.134 are absent for this file.** N.134 was walked on
2026-09-14 with 39 words, the `from score` receipt, Transcription drawing, and the
song named from the score header. **That walk was on Sunless 01, which is
MusicXML. T05 is `.musx` through denigma into MNX.**

### HALF A: THE POEM FILL. THE GATE IS FOUND, THE FAILING CONDITION IS NOT

`+page.svelte:3120-3123`:

```
const fillText =
    origin === 'upload' && !noLyrics && doc.inputText.trim() === ''
        ? scoreWordsText(collectScoreWords(ingested.result.score, 1))
        : '';
```

**All three conditions must hold. Two of them plainly do:** the box is empty in his
screenshot, and the score carries lyrics, since they draw on Score markup. **So the
failure is one of:**

1. **`origin !== 'upload'`.** The comment above that line says the fill is
   deliberately confined to an upload so that a saved song with an empty box is
   not written on boot. **Establish what `origin` was for his drop.**
2. **`collectScoreWords(score, 1)` returns nothing on this file.** It takes VERSE
   1. **T05's MNX carries TWO lyric lines**, `v1` Cyrillic and `v2` IPA
   (read from the converted file 2026-09-15). If the MNX path numbers or orders
   them differently from MusicXML, verse 1 may not be what the caller assumes.
   Its `close()` also returns null for a word where **no syllable carried a
   vowel**, so a structural difference could empty the list silently.
3. **`noLyrics` is computed true** despite the lyrics drawing.

**Instrument each of the three rather than guessing. They are cheap to
distinguish and only one of them is a design decision working correctly.**

### HALF B: THE NAME FROM THE HEADER. CAUSE ALREADY ESTABLISHED

**The converted MNX carries no header at all.** Read 2026-09-15 from T05 converted
with the project's own denigma WASM: the document's top-level keys are `global`,
`layouts`, `mnx`, `parts` and `scores`, and the `scores` block holds only
`"name":"Score"` with layout ids. **There is no title and no composer for Ilya to
read.**

**So this half is a LIMIT OF THE CONVERSION, not a defect in Ilya**, and it
explains the empty Piece fields and `Untitled, 2026-09-15`.

**It still wants a decision from Dann, and it is not the same decision as half A.**
A `.musx` singer will never get a song named from its score while denigma emits no
header. **Whether Ilya says anything about that, or silently leaves the fields to
the singer, is his.** CONTRACT §6 forbids a mark that says Ilya is unsure, which
bears on any notice.

### HALF B's ANSWER, RULED BY DANN 2026-09-15: A DEFAULT NAMING CONVENTION

**His words:** *"If there is no header for Ilya to name the song from, and this
somehow affects its ability to work properly, then we should develop a default
assigned naming convention."*

**FIRST, THE CONDITIONAL IN HIS SENTENCE IS ANSWERED: IT DOES NOT AFFECT
FUNCTION.** Half A's gate at `+page.svelte:3120-3123` reads the origin, the
lyrics, and whether the input field is empty. **It never reads the name or the
header.** The two halves are independent, and fixing the name will not fill the
input field.

**SECOND, A DEFAULT ALREADY EXISTS.** Dann's own library shows
`Untitled, 2026-09-15`, `Untitled, 2026-08-25` and `Untitled, 2026-08-25 (2)`, so
Ilya already falls back to a dated name with a disambiguator. **What is missing is
a BETTER fallback, not a first one.**

**THE CANDIDATE IS THE FILE'S OWN NAME, and it is usually richer than a score
header.** The file Dann dropped is
`Kabalevsky - Shakespeare - T05 Cupid laid by his brand, and fell.musx`: composer,
poet, catalogue position and title, all present.

**DESK DEFAULT on the shape, and Dann can overrule it:**

1. **Where the score carries a header, that wins.** Unchanged, and it is N.134's
   ruled behaviour.
2. **Where it does not, the song takes the FILE'S BASE NAME**, extension stripped.
3. **Where there is no usable file name either**, the existing `Untitled, <date>`
   fallback stands.

**DO NOT PARSE THE FILE NAME INTO THE PIECE FIELDS.** Splitting
`Kabalevsky - Shakespeare - T05 …` into composer, poet and title is inference, it
will be wrong on other people's filenames, and CONTRACT §1.21 forbids inferring
without being asked. **The whole base name becomes the song's NAME; the Piece
fields stay empty for the singer.**

**IT OBEYS THE EXISTING NAMING RULE WITHOUT AMENDING IT.** N.67 step 4b, 2026-08-18:
the name is written the first time there is material to build one from, and is the
singer's from then on. **A file name is material.** The same memo records that a
song named from its poem never picks up a better name later, which is deliberate
and is not changed here.

### WHY IT MATTERS MORE THAN ITS SIZE

**`.musx` is one of the four formats Ilya accepts and it is the one Dann's own
Finale work arrives in.** A feature that works on MusicXML and not on Finale files
fails for the singer who has just paid for Finale.

### NOT ESTABLISHED

- Which of the three conditions fails.
- Whether the same failure affects `.mnx` arriving directly, which shares the
  parser but not the conversion.
- Whether `collectScoreWords` is verse-aware in the way the MNX parser numbers
  lines.
