# French draft, r1: the three comments' visible text (N.168)

Written by the desk 2026-09-25, about 04:15, while Dann was away. **A PROPOSAL for Dann to rule on. None of it goes into the code until he rules.**

The English is `~/Documents/Voice Pedagogy Library/Insights Research/_synthesis/draft-three-comments_r2_2026-09-25.md`, which is itself a draft. If Dann changes the English, this French follows it.

**Drafted from the French already in `apps/web/src/lib/i18n.ts`** (the tree at `b2fde8f`), so Insights says the same thing the same way everywhere. Only the text that shows is drafted here. The tap's contents wait until Dann has seen the English.


**RULED BY DANN 2026-09-25 13:04: « prolonger » for "sustained"** (*"the image feels transitive to me"*), in the pronominal form « se prolonge » for a note (desk's form, so it does not read as lengthened beyond what is written) and « prolongée(s) » as an adjective. The paragraph that follows is the question as it stood.

**WAS OPEN FOR DANN, 2026-09-25 12:15: the French for "sustained".** He ruled that the English says "sustained", never "held", for its sense of organic movement. This draft still says « tenu », adopted from `insights.finding.tighten`. The choices: « tenu » (the usual word, and already in the file); « soutenu » (closer to the English, but singers may read it as "supported"); « prolongé » (neutral, about length only). The desk leans to keeping « tenu » and does not know whether it carries the static sense Dann wants to avoid.
## The glossary: adopted or coined

| English | French | Source |
|---|---|---|
| the range you typed / declared | que vous avez indiqué(e) | ADOPTED, `insights.verdict.*`, `insights.finding.rangeAbove` |
| held | tenu | ADOPTED, `insights.finding.tighten` (« tenu ici ») |
| secondo passaggio | passaggio secondaire | ADOPTED, `calib.characteristics.passaggioSecondaryLabel`. **Your call:** Insights' own figure says « secondo » alone (`insights.figure.secondo`). |
| where the vowel turns | la hauteur où votre [ɛ] change de timbre | ADOPTED, `insights.finding.sustain` (« sa hauteur de changement de timbre ») |
| the colour closes | la couleur se ferme | ADOPTED in part: « la couleur change » and « passe d'ouvert à fermé » (`insights.finding.timbreOpenToClose`) |
| resonance | résonance | ADOPTED, `insights.finding.crossing` (« votre première résonance ») |
| bar 41 | la mesure 41 | ADOPTED, `insights.phonation.untrustedOne` |
| tops its phrase | culmine dans sa phrase | COINED |
| vocal tract | conduit vocal | COINED here. It is the usual French term, but nothing in the file uses it yet. |
| decrescendo | decrescendo | COINED. It is the Italian term, kept as written. **Your call:** some French editions write « décrescendo ». |
| about D4 | autour de D4 | COINED. The desk avoided « vers », which the file already uses for a direction (« vers le youhou »). |
| More to try, and why (the tap) | Autres pistes, et pourquoi | COINED. **Your call.** A plainer alternative: « D'autres choses à essayer, et pourquoi ». |

**Book titles stay in their original language.** « p. » is the same in both.

**Pitch names are the same in both languages.** Insights fills every `{pitch}` through `pitchLabel` (`InsightsPane.svelte:281`), which returns the step letter, the accidental glyph, and the octave, whatever the language (`note-picker.ts:94-96`). So the French says E4, as the rest of French Insights already does. Whether French singers would prefer « mi4 » is a separate question, and this draft does not raise it.

**Spacing follows the file:** a non-breaking space before « : » (` `), and a narrow non-breaking space before « ; » (` `, as in `insights.finding.passaggio`). The file is not consistent about « ; » (`insights.phonation.noTempo` uses a plain space). The desk followed `insights.finding.passaggio` because it is the nearest Insights string.

## The drafts

### 1. The held note at the top

**Dann's E4 [i]:**

> Ce [i] sur E4 se prolonge environ 4 secondes, sur la note la plus aiguë que vous avez indiquée, et il se situe au-dessus de votre propre résonance du [i]. Laissez la mâchoire descendre avec la hauteur et gardez la pointe de la langue vers l'avant : le [i] reste un [i] tout en s'ouvrant (Miller, *Solutions for Singers*, p. 163).

**The soprano test voice, A5 [i]:**

> Ce [i] sur A5 se prolonge environ 4 secondes, 3 demi-tons au-dessus de votre passaggio secondaire, et il se situe probablement au-dessus de la résonance de votre [i]. Laissez la voyelle s'ouvrir vers [ɑ] à mesure que vous montez ; elle se distinguera moins bien à cette hauteur, et c'est normal (Bozeman, *Practical Vocal Acoustics*, p. 55 ; McKinney, *The Diagnosis and Correction of Vocal Faults*, p. 160).

**Dann's E♭4 [o]:**

> Ce [o] sur E♭4 se prolonge environ 3 secondes, 2 demi-tons au-dessus de votre passaggio secondaire. Gardez la seconde moitié de la note au niveau de la première (Miller, *Solutions for Singers*, p. 201).

### 2. The open vowel turning at the secondo

**Dann's E♭4 [ɛ], merged with the held note:**

> Ce [ɛ] sur E♭4 se prolonge, culmine dans sa phrase et se situe juste après la hauteur où votre [ɛ] change de timbre (autour de D4) : la couleur se ferme ici. Laissez faire : gardez stables la longueur et la forme du conduit vocal, et la fermeture se fait d'elle-même (Bozeman, *Practical Vocal Acoustics*, p. 65).

**Dann's E4 [ɛ]:**

> Ce [ɛ] sur E4 culmine et termine sa phrase, après la hauteur où votre [ɛ] change de timbre (autour de D4), et il revient à la mesure 41. Laissez faire : gardez stables la longueur et la forme du conduit vocal, et la fermeture se fait d'elle-même (Bozeman, *Practical Vocal Acoustics*, p. 65).

**The soprano test voice, F♯5 [ɛ]:**

> Ce [ɛ] sur F♯5 culmine dans sa phrase, sur votre passaggio secondaire, et il se situe probablement au-dessus de la résonance de votre [ɛ]. Laissez la voyelle s'ouvrir vers [ɑ] pour que la résonance monte avec la note (Bozeman, *Practical Vocal Acoustics*, p. 55).

### 3. The [u] that cannot stay closed

**Dann's D4 [u]:**

> Ce [u] sur D4 culmine dans sa phrase, un peu sous votre propre résonance du [u] (autour de F4), là où un [u] fermé ne garde pas sa forme. Entrez dans la note avec un léger decrescendo (Reid, *Voice: Psyche and Soma*, p. 66).

## Agreements, checked against their referents (CONTRACT §6)

- « Ce [i] », « Ce [o] », « Ce [ɛ] », « Ce [u] », « un [u] fermé »: a sound named alone is masculine. So are « tenu », « il se situe », and « il revient », which refer back to it.
- « la note la plus aiguë que vous avez indiquée »: « indiquée » agrees with « la note », the direct object that comes before « avez ».
- « au niveau de la première »: agrees with « moitié ».
- « gardez stables la longueur et la forme »: plural feminine, two nouns.
- « la fermeture se fait d'elle-même »: agrees with « la fermeture ».
- « elle se distinguera »: « elle » is « la voyelle ».
- « la résonance de votre [ɛ] »: « résonance » is feminine; the possessive « votre » does not change.

## What the desk is least sure of

1. **« culmine dans sa phrase »** for "tops its phrase". It is idiomatic, but a musician may prefer « est le sommet de sa phrase ».
2. **« Laissez faire »** for "Let it". It is natural French, but it can read as "leave it alone", which is close to the meaning here and may be exactly right.
3. **« se distinguera moins bien »** for "will read less distinctly". « sera moins intelligible » is the alternative, and it is closer to diction language.
