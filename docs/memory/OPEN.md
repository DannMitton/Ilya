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

## N.133. THE RENDERER STOPS PAINTING ITS OWN GROUND. Numbered by Dann 2026-09-13. UNPLACED.

**Ruled by Dann 2026-09-13**, on his walk of `6a24169`, from three options the
desk put to him. **His words, and they are the item:** *"I absolutely do not want
to see, in the Loupe, the measure under examination mounted on a cream
background. The background should be transparent and accept the Loupe's native
background."* His ruling: **"The renderer stops painting the rectangle at all,
and every surface provides its own ground."**

**What he saw.** The loupe crops a clone of the page's system SVG
(`Loupe.svelte:764`) and shows it over the loupe's own `--paper-light` fill
(`:935`). The system's SVG carries its own cream rectangle, so the loupe's fill
never shows.

**TWO RECTANGLES, NOT ONE.**

- `staff-renderer.ts:2828` paints `#F0EBE0` behind EVERY SYSTEM. This is the one
  in the loupe. Nothing strips it.
- `page-layout.ts:365` paints `#FFFFFF` behind the whole page, from
  `paginateScore`. `VoiceProfilePane.svelte:664-665` strips it, and `:990` is
  the call site.

**Once both go, `stripBackingRect` has nothing left to strip and goes with them.**

**ESTABLISHED 2026-09-13, and it is what makes this a deletion rather than an
option:** the only consumer of `packages/score-parser` is `apps/web`. The
"standalone artifact" case the comment at `VoiceProfilePane.svelte:661` names has
no user, so there is no default to preserve and no `background: null` parameter
to add.

**Consumers to check afterwards, all of them:** the page (`--paper-cream`), the
loupe (`--paper-light`), the `fit-font-lab` dev route
(`routes/fit-font-lab/+page.svelte:9`, which renders glyphs through the
production renderer and may have been relying on the ground), and print.

**THE RISK, NAMED BEFORE ANYONE BUILDS IT: gates 4 and 5 are both exposed.**
`correction.test.ts:507` calls `renderAnalyzedStaff`,
`performance-order-seam.test.ts:94` calls `paginateScore`, and
`staff-renderer.test.ts` asserts hex literals. If one of them pins a rectangle,
**the test is the thing to look at, not the ruling.**

**WHAT THIS CLOSES.** Two open questions resolve themselves, and whoever builds
this should strike both rather than leave them:

1. The census (`memo-neutral-audit_r1_2026-09-13.md` §6.2) recorded "Whether a
   cream rectangle prints behind each system was not observed." **Dann observed
   it on screen 2026-09-13.**
2. `STATE.md` §STILL UNSETTLED carries the print half, settled 2026-09-07 by
   Dann's print preview: the cream prints, and the page was ruled to print white.
   **It records a paste already written and NOT YET RUN, filed in `INBOX.md`.
   FIND THAT PASTE BEFORE WRITING A NEW ONE**, per tether 16. It may already do
   half of this job, or it may conflict with the ruling above.

**Done when:** the loupe shows its own ground with no rectangle over it, Dann
walks it, and the print path is checked once rather than assumed.


---

> **N.136. OPEN SYLLABIFICATION NEVER REACHES SCORE MARKUP'S DRAWN TEXT.
> Numbered by Dann 2026-09-14. UNPLACED.**
>
> **How it was found.** Dann toggled `Open syllables` on the walk of `4d79f24`
> and neither the Cyrillic underlay nor the IPA line above it changed. The
> drawer registered the change: the band read `1 of 7 changed`.
>
> **The cause, read 2026-09-14.** The toggle reaches the resolver. The resolver
> no longer supplies the text that draws.
>
> - A placed syllable's Cyrillic comes from `doc.pairings`, projected through
>   `refreshPairings` from `slotQueue`.
> - `slotQueue` is `buildSlotQueue(lines)` (`+page.svelte:379`), and that is
>   **raw** `lines`.
> - `effectiveLines`, the open-syllabified view (`+page.svelte:2182`), goes only
>   to the Transcription page (`:4766`, `:4793`, `:4796`).
> - The raw pass to the score pane is deliberate and is Dann's own ruling,
>   quoted at `+page.svelte:4835-4838`, N.10, 2026-08-07: *"`lines` is passed
>   RAW, not `effectiveLines` — the Fit resolver applies its own open
>   syllabification, so the display view would be sliced twice."* That reasoning
>   held while the resolver drew the text. It stopped being true when the queue
>   took over.
>
> **NOT A REGRESSION FROM 2026-09-14.** Any placed syllable has always drawn
> from the raw queue. Before N.134 this song had nothing placed, so every cell
> came from the file's own underlay and the toggle changed nothing there either.
> N.134 placed all 95, which turned a partial gap into a total one.
>
> **The audit of 2026-09-12 proved the wrong thing**
> (`../sessions/brief-n119-toggles-reach-score-markup_r1_2026-09-12.md` §1). It
> showed the toggle reaches `buildUnderlayResolvers` and concluded it reaches
> the page. Those are two claims and only the first was tested. **Correct that
> brief's table before N.119 is built**, or N.119 will be built against it.
>
> **Candidate fixes, unruled.** Feed the queue from `effectiveLines` rather than
> `lines`, which makes the drawn text obey the toggle and needs the double-slice
> question of N.10 re-answered, since the resolver still applies its own. Or
> teach the projection to carry the resolver's division. **Whichever is taken,
> N.10's 2026-08-07 reasoning is a source to re-check, not a wall**
> (CONTRACT §1.19, amended 2026-09-14).

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
