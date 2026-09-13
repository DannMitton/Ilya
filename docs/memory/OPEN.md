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
