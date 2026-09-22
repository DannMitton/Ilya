# INSIGHTS IN FRENCH — the 59 as built, sorted for your ruling

**r3, 2026-09-22. Supersedes r1 (drafts, never marked up) and r2 (unsorted).**
Every row is the text a singer reads today, read out of `i18n.ts` on 2026-09-22.
**The sort is the desk's. You see every row either way.**

**Your eight rulings of 2026-09-19 are already applied** (commit `71ae880`).

---

## DANN'S RULINGS ON THIS SET. Appended as he gives them

**1 of 59 ruled.**

- **`fit.heading` (`i18n.ts:1458`): FRENCH KEEP.** « La correspondance, terme par terme »
  stands. **Ruled by Dann 2026-09-22**, his words: *"The French « terme par terme » commits
  to reading A, and reading A is what the table is."*
  - **Context that settled it:** the heading sits over a table whose first column is
    literally `Term` (`:1459`) and whose rows are Range containment, Passaggio crossings and
    Tessitura containment (`:1463` to `:1465`). It walks the fit one term at a time.
  - **The desk flagged this row the wrong way round** and said so: it presented the French
    as the suspect when the English is the ambiguous one. "The fit, in its terms" can be
    heard as "on its own terms", which is not what the table does.
  - **DESK DEFAULT, awaiting Dann and free to wave off: change the ENGLISH** to
    "The fit, term by term", so it says what the French already says. **Not done. The
    English is his voice, not the desk's.**

---

## FIVE PLACES THE DESK WOULD LOOK FIRST. Desk readings, not rulings

1. **`footnote.tessitura` keeps Pacheco's title in English and adds a French translation in
   square brackets.** Whether a citation is rendered that way is your practice, not the
   desk's, and it is the one row here where getting it wrong is an attribution error rather
   than a wording one.
2. **`fit.crossingsCount` and `fit.passaggiTyped` render primo and secondo as
   « primaire » and « secondaire ».** Voice pedagogy in French commonly keeps the Italian.
3. **`finding.passaggio` keeps « passaggio » in the first clause and renders "the turn" as
   « le passage » in the second**, so the same root appears twice meaning two things.
4. **`fit.heading`: "The fit, in its terms" became « La correspondance, terme par terme ».**
   The English reads "on its own terms"; the French reads "term by term". **Those are
   different claims.**
5. **`fit.colReference`: "Your reference range" became « Vos repères »**, which drops the
   range. Your ruling gave « Vos repères »; the English still says range.

---

## LIST B1. READ CAREFULLY. 10 rows carrying a terminology decision

| line | key | English | French as built |
|---|---|---|---|
| `1505` | `footnote.tessitura` | Tessitura by Pacheco’s method: the span from the lowest to the highest pitch sung for at least half as long as the longest-sung pitch. Alberto José Vieira Pacheco, “Angelica Catalani’s Voice According to a Method of Statistical Analysis,” <em>Journal of Singing</em> 69, no. 5 (2013), p. 559. | Tessiture selon la méthode de Pacheco : l’étendue de la hauteur la plus grave à la hauteur la plus aiguë chantée au moins la moitié du temps de la hauteur la plus longuement chantée. Alberto José Vieira Pacheco, “Angelica Catalani’s Voice According to a Method of Statistical Analysis,” <em>Journal of Singing</em> 69, no. 5 (2013), p. 559. [\u00ab La voix d’Angelica Catalani selon une méthode d’analyse statistique \u00bb, <em>Journal of Singing</em>, vol. 69, no 5, 2013, p. 559.] |
| `1471` | `fit.crossingsCount` | {primo} of the primo, {secondo} of the secondo | {primo} du primaire, {secondo} du secondaire |
| `1473` | `fit.passaggiTyped` | Primo {primo}, secondo {secondo}, typed | Primaire {primo}, secondaire {secondo}, indiqués |
| `1501` | `finding.passaggio` | This falls near your passaggio; expect the turn to want managing. | Cela tombe près de votre passaggio; attendez-vous à devoir gérer le passage. |
| `1458` | `fit.heading` | The fit, in its terms | La correspondance, terme par terme |
| `1461` | `fit.colReference` | Your reference range | Vos repères |
| `1493` | `findings.remainderOne` | 1 further finding, lighter by phonation mass, prints in full on page 2. | 1 autre observation, plus légère en masse de phonation, imprimée en entier à la page 2. |
| `1494` | `findings.remainderMany` | {n} further findings, lighter by phonation mass, print in full on page 2. | {n} autres observations, plus légères en masse de phonation, imprimées en entier à la page 2. |
| `1498` | `finding.crossing` | Your {vowel} meets your first resonance here, so the tone will want to turn full and heady, toward a whoop. | Votre {vowel} rencontre ici votre première résonance : le son voudra devenir plein et de tête, vers le youhou. |
| `1462` | `fit.colFlag` | Flag | Signalement |

---

## LIST B2. READ ONCE. 30 rows of prose, rendered straightforwardly

| line | key | English | French as built |
|---|---|---|---|
| `1463` | `fit.range` | Range containment | Inclusion de l’ambitus |
| `1464` | `fit.crossings` | Passaggio crossings | Croisements de passaggio |
| `1465` | `fit.tessitura` | Tessitura containment | Inclusion de la tessiture |
| `1472` | `fit.crossingsUncounted` | Not counted without both passaggi | Non comptés sans les deux passaggi |
| `1474` | `fit.tessituraFallback` | cut at half the second-longest pitch, because the published rule gave one note | coupure à la moitié de la deuxième hauteur la plus longue, car la règle publiée n’en donnait qu’une |
| `1475` | `fit.tessituraMarginal` | a pitch sits within half a quaver of the cut, so the band could move | une hauteur se situe à moins d’une demi-croche de la coupure, de sorte que la bande pourrait se déplacer |
| `1476` | `fit.withheldOne` | Not printed: measure {measures} does not add up to its time signature | Non imprimé : la mesure {measures} ne correspond pas à son chiffrage de mesure |
| `1477` | `fit.withheldMany` | Not printed: measures {measures} do not add up to their time signatures | Non imprimé : les mesures {measures} ne correspondent pas à leur chiffrage de mesure |
| `1478` | `fit.nothingSung` | Nothing sung to measure | Rien de chanté jusqu’à la mesure |
| `1484` | `verdict.fit` | This key seems like a good fit for you. | Cette tonalité semble vous convenir. |
| `1485` | `verdict.outsideRange` | This key takes the piece outside the range you typed. | Cette tonalité place la pièce hors de l’ambitus que vous avez indiqué. |
| `1486` | `verdict.outsideTessitura` | The compass fits the range you typed, but the piece sits outside the tessitura you typed. | L’ambitus de la pièce entre dans celui que vous avez indiqué, mais la pièce se situe hors de la tessiture que vous avez indiquée. |
| `1487` | `verdict.rangeOnly` | The compass fits the range you typed, and nothing on this page compares the tessitura. | L’ambitus de la pièce entre dans celui que vous avez indiqué, et rien sur cette page ne compare la tessiture. |
| `1488` | `verdict.cannotSay` | Without the range you typed, this page cannot say whether this key suits you. | Sans l’ambitus que vous avez indiqué, cette page ne peut pas dire si cette tonalité vous convient. |
| `1489` | `findings.heading` | What is flagged, heaviest first | Ce qui est signalé, du plus lourd au plus léger |
| `1490` | `findings.none` | Nothing in this piece is flagged for your voice. | Rien dans cette pièce n’est signalé pour votre voix. |
| `1495` | `findings.deferredHeading` | The findings page one deferred | Les observations reportées par la page 1 |
| `1496` | `finding.rangeAbove` | The note rises above the range you typed. | La note monte au-dessus de l’ambitus que vous avez indiqué. |
| `1497` | `finding.rangeBelow` | The note drops below the range you typed. | La note descend sous l’ambitus que vous avez indiqué. |
| `1499` | `finding.tighten` | The {vowel} at the top of your range and sustained here is an exposed spot where the vowel can tighten. | Le {vowel}, au sommet de votre ambitus et tenu ici, est un endroit exposé où la voyelle peut se resserrer. |
| `1500` | `finding.turnover` | The {vowel} at the top of your range and sustained here is an exposed spot where the tone can spread or press. | Le {vowel}, au sommet de votre ambitus et tenu ici, est un endroit exposé où le son peut s’étaler ou se presser. |
| `1502` | `finding.timbreOpenToClose` | Your {vowel} turns open to close inside the word, so the colour shifts as you sing it. | Votre {vowel} passe d’ouvert à fermé à l’intérieur du mot : la couleur change pendant que vous le chantez. |
| `1503` | `finding.timbreCloseToOpen` | Your {vowel} turns close to open inside the word, so the colour shifts as you sing it. | Votre {vowel} passe de fermé à ouvert à l’intérieur du mot : la couleur change pendant que vous le chantez. |
| `1504` | `finding.sustain` | The longer {vowel} here sits on its pitch of turning, so the colour may feel unsteady as you sustain it. | Le {vowel} plus long, ici, se pose sur sa hauteur de changement de timbre : la couleur peut sembler instable pendant que vous le tenez. |
| `1507` | `method.typed` | Method: computed from your calibration of {date}, the voice characteristics you typed, and the score as sung, repeats taken. Nothing on this page is hand-written. | Méthode : calculé à partir de votre calibration du {date}, des caractéristiques vocales que vous avez indiquées et de la partition telle que chantée, reprises comprises. Rien sur cette page n’est écrit à la main. |
| `1508` | `method.untyped` | Method: computed from your calibration of {date} and the score as sung, repeats taken. Nothing on this page is hand-written. | Méthode : calculé à partir de votre calibration du {date} et de la partition telle que chantée, reprises comprises. Rien sur cette page n’est écrit à la main. |
| `1509` | `method.silent` | Method: no voice has been measured, so nothing on this page is computed from one. | Méthode : aucune voix n’a été mesurée, donc rien sur cette page n’en est calculé. |
| `1510` | `silence.unmeasured` | No voice has been measured, so this page does not compare this piece with your voice. Withheld until one is: | Aucune voix n’a été mesurée, donc cette page ne compare pas cette pièce avec votre voix. Retenu jusqu’à ce qu’une voix le soit : |
| `1511` | `silence.findings` | Any finding about where this piece may challenge your voice. | Toute observation sur les endroits où cette pièce pourrait solliciter votre voix. |
| `1512` | `silence.noScore` | No score has been added, so there is nothing of this piece to measure. | Aucune partition n’a été ajoutée, il n’y a donc rien de cette pièce à mesurer. |

---

## LIST A. GLANCE. 19 rows with no judgement in them

Cognates, single settled words, and strings that are mostly placeholders.

| line | key | English | French as built |
|---|---|---|---|
| `1454` | `identity` | Insights for {voice} · calibrated {date} | Aperçus pour {voice} · calibration du {date} |
| `1455` | `identityUncalibrated` | Insights for {voice} · not calibrated | Aperçus pour {voice} · sans calibration |
| `1456` | `yourVoice` | your voice | votre voix |
| `1457` | `pageAria` | Insights, page {n} of {total} | Aperçus, page {n} sur {total} |
| `1459` | `fit.colTerm` | Term | Terme |
| `1460` | `fit.colMeasured` | Measured in this piece | Mesuré dans cette pièce |
| `1466` | `fit.compass` | Compass {low} to {high} | Ambitus {low} à {high} |
| `1467` | `fit.span` | {low} to {high} | {low} à {high} |
| `1468` | `fit.spanTyped` | {low} to {high}, typed | {low} à {high}, indiqué |
| `1469` | `fit.notTyped` | Not typed | Non indiqué |
| `1470` | `fit.noPitches` | No sung pitch | Aucune hauteur chantée |
| `1479` | `flag.contained` | Contained | Inclus |
| `1480` | `flag.above` | Above | Au-dessus |
| `1481` | `flag.below` | Below | En dessous |
| `1482` | `flag.wider` | Wider | Plus large |
| `1483` | `flag.noThreshold` | No threshold | Aucun seuil |
| `1491` | `findings.furtherOne` | 1 further instance, in the score. | 1 autre occurrence, dans la partition. |
| `1492` | `findings.furtherMany` | {n} further instances, in the score. | {n} autres occurrences, dans la partition. |
| `1506` | `citationUnverified` | CITATION NOT YET VERIFIED | CITATION NON ENCORE VÉRIFIÉE |

---

**Mark any row keep, edit or decline. Nothing changes in the tree until you do.**
