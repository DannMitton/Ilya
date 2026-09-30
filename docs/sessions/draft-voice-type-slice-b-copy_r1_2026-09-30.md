# Voice type slice B: the courtesy check. Copy and limits, PROPOSED

Revision 1, 2026-09-30 about 12:25, by the desk, for Dann's ruling. Design: `draft-voice-labels_r2_2026-09-30.md` §Slices; rulings in `../memory/OPEN.md` §N.168 (courtesy verification, 23:23; "most users most of the time", 23:35; the consistency check ruled in, 23:35).

## What it checks, and against what (desk proposal)

- **Declared range only, in this slice.** The resonances already have their courtesy check: the implausible hold with Keep my reading (built in slice A's session, uncommitted). Passaggi have no published table in the tree yet; they wait.
- **The limit is Boldrey's extended general range for the declared Tier 1 type** (Boldrey 1994, p. 11, read from Dann's photos), widened by the plausibility guard's margins (3 semitones below, 2 above, `plausibility.ts:124-125`):

| Tier 1 | Boldrey p. 11 general range (extended) | Scientific pitch |
|---|---|---|
| Soprano | b♭ to c''' (g to f''') | G3 to F6 |
| Mezzo-soprano | g to b♭'' | G3 to B♭5 |
| Contralto | f to f'' | F3 to F5 |
| Countertenor | "comparable to either soprano, mezzo-soprano, or contralto" | the union: F3 to F6 |
| Tenor | c to c'' (b♭' to e♭'') | C3 to E♭5 |
| Baritone | c to f' (G to a') | G2 to A4 |
| Bass-baritone | A♭ to f' (E to g') | E2 to G4 |
| Bass | F to e' (E♭ to f') | E♭2 to F4 |

Helmholtz to scientific: c = C3, c' = C4 (middle C). "Not sure" and no type: no check.

- **What catches the common error:** a tenor who types treble-clef pitches an octave high (a top of C6 instead of C5) falls far outside E♭5 plus 2.

## How it behaves

An inline note under the Range field, never a dialog, never a block. It appears once per value; it goes away when the value changes or when the singer dismisses it. Nothing is stored about it.

## The copy, PROPOSED (English and French)

« Ambitus » is adopted from `calib.characteristics.rangeHeading`; the Tier 1 labels are the ratified ones, printed lower case mid-line. Everything else is the desk's. French agreement checked: « exact » agrees with an implied « ce », masculine singular.

| key | English | French |
|---|---|---|
| voiceType.check.range | A quick check: {pitch} is outside the usual range for {type} voices ({low} to {high}; Boldrey 1994, p. 11). If it's right, there's nothing to change. | Petite vérification : {pitch} se situe hors de l'ambitus habituel des voix de {type} ({low} à {high} ; Boldrey 1994, p. 11). Si c'est exact, il n'y a rien à changer. |
| voiceType.check.dismiss | That's right | C'est exact |

Colon on a no-break space and semicolon on U+202F, per the French rulings.

## Revision in conversation, 2026-09-30 12:29 (supersedes the table above). RATIFIED by Dann 12:32, English and French, with « Certaines voix »

Dann's wording, 12:29: *"Your range reaches past what Boldrey gives for bass voices. Some singers with that range feature a high extension, while others may find a neighbouring category suits them."* It follows his point of 12:25 that an edge case may be evidence for a recategorization. The desk splits "past" by direction, so "high extension" never prints for a low note, and keeps the value and citation visible. PROPOSED:

| key | English | French |
|---|---|---|
| voiceType.check.rangeHigh | Your range reaches above what Boldrey gives for {type} voices (up to {high}; Boldrey 1994, p. 11). Some singers with that range feature a high extension, while others may find a neighbouring category suits them. | Votre ambitus dépasse vers l'aigu ce que Boldrey donne pour les voix de {type} (jusqu'à {high} ; Boldrey 1994, p. 11). Certaines voix ayant cet ambitus possèdent une extension aiguë ; pour d'autres, une catégorie voisine peut mieux convenir. |
| voiceType.check.rangeLow | Your range reaches below what Boldrey gives for {type} voices (down to {low}; Boldrey 1994, p. 11). Some singers with that range feature a low extension, while others may find a neighbouring category suits them. | Votre ambitus dépasse vers le grave ce que Boldrey donne pour les voix de {type} (jusqu'à {low} ; Boldrey 1994, p. 11). Certaines voix ayant cet ambitus possèdent une extension grave ; pour d'autres, une catégorie voisine peut mieux convenir. |
| voiceType.check.dismiss | That's right | C'est exact |

French: « Certaines voix » (the desk's) avoids a gendered « certains chanteurs »; the tree's only precedent is the masculine generic « pour chanteurs » (`stress.supplement`). « aiguë » and « grave » agree with « extension », feminine. The limits stay the extended range with the guard's margins; with the pooled norms table (r2), "Boldrey gives" may become "the sources give".
