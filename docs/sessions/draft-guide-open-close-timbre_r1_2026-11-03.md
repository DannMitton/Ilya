# Draft: open and close timbre, for MELODY's Guide section (r1, 2026-11-03)

Desk draft in Dann's voice, from the thread of 2026-11-03 23:15 to 23:22. Not ratified. English only; French follows as a marked draft once the English settles. Sources read this session: Mitton 2020 (`~/Downloads/Mitton_Daniel_A_202006_DMA_thesis.docx`), §§ 1.7, 3.2.5, 5.3.3, Conclusions, Appendix B; `packages/score-parser/src/overlay-engine.ts:169-170`; `staff-renderer.ts:2142`. Bozeman 2013 is cited through the thesis (p. 23, per its footnote), not opened.

## What is fR1?

fR1 is the first resonance of the vocal tract for the vowel being sung: the lowest frequency a given vowel shape amplifies. Each vowel has its own fR1, and it belongs to the vowel's shape rather than to the note. Retaining tube length, vowel shape, and relative vowel closeness maintains the fR1 frequency location while the pitch moves (Bozeman 2013, 23, quoted in Mitton 2020, § 1.7). In my own low male voice, dark-a [ɑ] resonates at about E♭5 (Mitton 2020, Conclusions), and [i] at about D4 (§ 3.2.5). fR1 is a frequency; expressing it as a pitch on the staff is a convenience (§ 5.3.3, Fig. 5.2).

## What is the pitch of turning?

The pitch of turning is a sung pitch: the note an octave below a vowel's fR1. "The sung pitch an octave below my fR1 values is the acoustic pitch of turning between open and close timbre" (Mitton 2020, § 5.3.3). For [ɑ], with its fR1 at E♭5, the pitch of turning is E♭4. The two terms are easy to conflate. One names a property of the vowel; the other names the place on the staff where that property becomes audible, an octave lower.

## Why an octave below?

Every sung pitch (fo) carries a harmonic series: fo, 2fo, 3fo, and so on. The second harmonic, 2fo, sounds an octave above the sung pitch. When the sung pitch reaches the octave below fR1, its second harmonic arrives at fR1. Bozeman calls this crossing of the second harmonic above the first formant "the primary acoustic registration event of male voices" (2013, 23, quoted in Mitton 2020, § 1.7).

## What are open and close timbre?

Below the pitch of turning, 2fo still sits under fR1, and the tone is heard as open. "The further below fR1 that the sung pitch sounds, the more open and complex the sung tone is perceived to be" (Mitton 2020, § 1.7). At and above the pitch of turning, within the octave below fR1, the timbre is heard to close or turn over: close [kloʊs] timbre, *voce chiusa*, which Bozeman describes as smoother, domed, and somewhat covered (2013, 23, quoted in Mitton 2020, § 1.7). For [ɑ] in my voice, then, pitches below E♭4 sound in open timbre and pitches from E♭4 toward E♭5 in close timbre.

Close timbre is an acoustic matter and is not to be confused with a closed vowel, which is a matter of diction: the tongue's height in [e] as against [ɛ] (§ 1.7). The boundary between open and close also moves with the vowel, so no single pitch divides them for every vowel (§ 3.2.5). Low male voices spend most of their phonation in open timbre, which coincides with the prevalence of [ɑ] in sung Russian and its high fR1 (Conclusions).

## What happens at fR1 itself?

When the sung pitch itself reaches fR1, fo and fR1 cross. Above that point the singer may let fR1 track the rising pitch, an arrangement called whoop coupling (§ 3.2.5). In the low male voice this is rare: in the repertoire I studied, only [i] at or above about D4 reaches it (Conclusions). Smaller turnings also occur below the pitch of turning, at an octave and a fifth, two octaves, and two octaves and a major third below fR1, where 3fo, 4fo, and 5fo meet fR1 (§ 3.2.5).

## How does MELODY show this?

MELODY follows the conventions of Appendices B and C (Mitton 2020). Each sung note carries a stemless lavender notehead: the pitch of turning for that note's vowel, taken from your voice profile. fR1 itself is not drawn. The stem compares the note with its own lavender head. A note at or above its lavender head sounds in close timbre and takes a stem up; a note below its lavender head, by any distance, sounds in open timbre and takes a stem down. A semitone below the turning pitch is still open. A place where the sung pitch meets fR1 is one of the moments MELODY boxes in red.
