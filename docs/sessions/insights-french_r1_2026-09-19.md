# INSIGHTS IN FRENCH — 59 entries for ratification

**r1, 2026-09-19.** Proposals only. Nothing here is in the tree, and nothing
here is ratified. Mark each row **keep**, **edit**, or **decline**.

**THE STANDING RULE IS SUSPENDED FOR THIS DOCUMENT, NOT REPEALED.** French is
Dann's and nothing is coined without him. He asked on 2026-09-19 for
recommended translations to ratify, edit, or decline, so these are drafts made
to be overruled.

---

## WHAT THIS SET IS, AND A CORRECTION TO THE RECORD

**59 entries, `i18n.ts:1464-1522`.** Every one carries French identical to its
English, so a singer in French mode reads English across the whole of Aperçus.

**`OPEN.md` RECORDS N.130 AS "about 58 consecutive entries" AT `:1417-1475`.
THAT RANGE IS WRONG.** Inside it only **12** entries are identical. The other
**47 run from `:1476` to `:1522`**, outside the cited range, and were therefore
counted under N.131. A brief written against `:1417-1475` would have fixed
twelve strings and reported N.130 closed.

**Method, so the count can be checked.** A line-wise parse of single-line
`'key': { en: '…', fr: '…' }` entries: 626 parsed, 114 with `fr` identical to
`en`, of which 59 have keys beginning `insights.`. `OPEN.md` reports 622 and
122 from its own parse, so the two disagree slightly and neither is being
called final.

---

## THE GLOSSARY THESE DRAFTS FOLLOW

**Taken from French already in `i18n.ts`, not invented here.**

| term | French | source in the file |
|---|---|---|
| Insights | Aperçus | `tab.insights:121` |
| range | ambitus | `calib.characteristics.rangeHeading:1144`; `profile.withheld.item3:1199` |
| tessitura | tessiture | `calib.characteristics.tessituraHeading:1148` |
| passaggio, primary / secondary | passaggio, primaire / secondaire | `:1155`, `:1156` |
| calibration, to calibrate | calibration, calibrer | `calib.anchor.calibrate:993`; `calib.section.ariaLabel:999` |
| vowel | voyelle | `calib.common.vowelWord:1015` |
| resonance | résonance | `calib.welcome.title:1055` |
| crossing | croisement | `profile.withheld.item1:1197` |
| timbre turn | changement de timbre | `profile.withheld.item1:1197` |
| Fit | Fit, untranslated | `calib.welcome.lede:1056` |

**Punctuation.** U+00A0 before a colon; **no space** before `;`, `!` or `?`,
per Dann's ruling of 2026-08-21 following the OQLF. Typographic apostrophe
throughout. The drafts below are written in readable French; the insert form
uses the file's escapes (` `, `’`).

---

## EIGHT PLACES I WANT YOUR RULING, NOT YOUR RUBBER STAMP

**These are flagged in the tables as ⚑.**

1. **"typed" means "that you entered", not "by voice type".** Read from
   *"the range you typed"* and *"the voice characteristics you typed"*, where
   *you* performs the action. Drafted as « que vous avez indiqué ». **It
   changes six strings, and if it means voice type instead, all six are wrong.**
2. **"whoop"** in `finding.crossing`. Bozeman's term. Drafted « vers le cri ».
   You may have a settled French rendering; I do not.
3. **"pitch of turning"** in `finding.sustain`. Drafted « hauteur de bascule ».
   Same caveat.
4. **"compass" and "range" both land on *ambitus***, told apart by the
   possessive: the piece's ambitus against « l'ambitus que vous avez indiqué ».
   The file gives no second word, and inventing one seemed worse.
5. **"Your reference range"** drafted « Votre référence », dropping *range*,
   because that column heads both the ambitus row and the tessiture row.
6. **"The fit, in its terms"** drafted « L'adéquation, en ses termes ».
   Whether the surface's own name **Fit** belongs in that heading is yours.
7. **The Pacheco citation stays verbatim in English.** Only the method sentence
   before it is translated. A translated title would misstate what was
   published, which your attribution rule forbids.
8. **"findings" drafted « constats »** rather than « résultats », which claims
   more than Ilya does, or « observations », which is longer everywhere it
   appears.

---

## 1. IDENTITY AND PAGE, 4 entries

| line | key | English | proposed French |
|---|---|---|---|
| 1464 | `insights.identity` | Insights for {voice} · calibrated {date} | Aperçus pour {voice} · calibration du {date} |
| 1465 | `insights.identityUncalibrated` | Insights for {voice} · not calibrated | Aperçus pour {voice} · sans calibration |
| 1466 | `insights.yourVoice` | your voice | votre voix |
| 1467 | `insights.pageAria` | Insights, page {n} of {total} | Aperçus, page {n} sur {total} |

**On 1464 and 1465:** *calibrated* is drafted as a noun phrase, « calibration
du {date} », to avoid agreeing a participle with `{voice}`, which is a profile
name of unknown gender.

---

## 2. THE FIT TABLE, HEADINGS AND ROWS, 8 entries

| line | key | English | proposed French |
|---|---|---|---|
| 1468 | `insights.fit.heading` | The fit, in its terms | L'adéquation, en ses termes ⚑ |
| 1469 | `insights.fit.colTerm` | Term | Terme |
| 1470 | `insights.fit.colMeasured` | Measured in this piece | Mesuré dans cette pièce |
| 1471 | `insights.fit.colReference` | Your reference range | Votre référence ⚑ |
| 1472 | `insights.fit.colFlag` | Flag | Signalement |
| 1473 | `insights.fit.range` | Range containment | Inclusion de l'ambitus |
| 1474 | `insights.fit.crossings` | Passaggio crossings | Croisements de passaggio |
| 1475 | `insights.fit.tessitura` | Tessitura containment | Inclusion de la tessiture |

**`Signalement`** follows `fit.broad.itemPassaggio:755`, « le signalement des
notes de passaggio », rather than « drapeau ».

---

## 3. THE FIT TABLE, VALUES, 13 entries

| line | key | English | proposed French |
|---|---|---|---|
| 1476 | `insights.fit.compass` | Compass {low} to {high} | Ambitus {low} à {high} ⚑ |
| 1477 | `insights.fit.span` | {low} to {high} | {low} à {high} |
| 1478 | `insights.fit.spanTyped` | {low} to {high}, typed | {low} à {high}, indiqué ⚑ |
| 1479 | `insights.fit.notTyped` | Not typed | Non indiqué ⚑ |
| 1480 | `insights.fit.noPitches` | No sung pitch | Aucune hauteur chantée |
| 1481 | `insights.fit.crossingsCount` | {primo} of the primo, {secondo} of the secondo | {primo} du primaire, {secondo} du secondaire |
| 1482 | `insights.fit.crossingsUncounted` | Not counted without both passaggi | Non comptés sans les deux passaggi |
| 1483 | `insights.fit.passaggiTyped` | Primo {primo}, secondo {secondo}, typed | Primaire {primo}, secondaire {secondo}, indiqués ⚑ |
| 1484 | `insights.fit.tessituraFallback` | cut at half the second-longest pitch, because the published rule gave one note | coupure à la moitié de la deuxième hauteur la plus longue, car la règle publiée n'en donnait qu'une |
| 1485 | `insights.fit.tessituraMarginal` | a pitch sits within half a quaver of the cut, so the band could move | une hauteur se situe à moins d'une demi-croche de la coupure, de sorte que la bande pourrait se déplacer |
| 1486 | `insights.fit.withheldOne` | Not printed: measure {measures} does not add up to its time signature | Non imprimé : la mesure {measures} ne correspond pas à son chiffrage de mesure |
| 1487 | `insights.fit.withheldMany` | Not printed: measures {measures} do not add up to their time signatures | Non imprimé : les mesures {measures} ne correspondent pas à leur chiffrage de mesure |
| 1488 | `insights.fit.nothingSung` | Nothing sung to measure | Rien de chanté jusqu'à la mesure |

**On 1481 and 1483:** the file already rules primary and secondary as
« primaire » and « secondaire » at `:1155-1156`, so the English *primo* and
*secondo* are translated rather than kept. The placeholder names `{primo}` and
`{secondo}` are untouched, since they carry pitches.

**On 1486 and 1487:** the colon takes U+00A0.

---

## 4. THE FLAGS, 5 entries

| line | key | English | proposed French |
|---|---|---|---|
| 1489 | `insights.flag.contained` | Contained | Inclus |
| 1490 | `insights.flag.above` | Above | Au-dessus |
| 1491 | `insights.flag.below` | Below | En dessous |
| 1492 | `insights.flag.wider` | Wider | Plus large |
| 1493 | `insights.flag.noThreshold` | No threshold | Aucun seuil |

---

## 5. THE VERDICTS, 5 entries

**These carry "forecasts, never declares" and every draft keeps the hedge.**

| line | key | English | proposed French |
|---|---|---|---|
| 1494 | `insights.verdict.fit` | This key seems like a good fit for you. | Cette tonalité semble vous convenir. |
| 1495 | `insights.verdict.outsideRange` | This key takes the piece outside the range you typed. | Cette tonalité place la pièce hors de l'ambitus que vous avez indiqué. |
| 1496 | `insights.verdict.outsideTessitura` | The compass fits the range you typed, but the piece sits outside the tessitura you typed. | L'ambitus de la pièce entre dans celui que vous avez indiqué, mais la pièce se situe hors de la tessiture que vous avez indiquée. |
| 1497 | `insights.verdict.rangeOnly` | The compass fits the range you typed, and nothing on this page compares the tessitura. | L'ambitus de la pièce entre dans celui que vous avez indiqué, et rien sur cette page ne compare la tessiture. |
| 1498 | `insights.verdict.cannotSay` | Without the range you typed, this page cannot say whether this key suits you. | Sans l'ambitus que vous avez indiqué, cette page ne peut pas dire si cette tonalité vous convient. |

---

## 6. THE FINDINGS LIST, 7 entries

| line | key | English | proposed French |
|---|---|---|---|
| 1499 | `insights.findings.heading` | What is flagged, heaviest first | Ce qui est signalé, du plus lourd au plus léger |
| 1500 | `insights.findings.none` | Nothing in this piece is flagged for your voice. | Rien dans cette pièce n'est signalé pour votre voix. |
| 1501 | `insights.findings.furtherOne` | 1 further instance, in the score. | 1 autre occurrence, dans la partition. |
| 1502 | `insights.findings.furtherMany` | {n} further instances, in the score. | {n} autres occurrences, dans la partition. |
| 1503 | `insights.findings.remainderOne` | 1 further finding, lighter by phonation mass, prints in full on page 2. | 1 autre constat, plus léger en masse de phonation, imprimé en entier à la page 2. |
| 1504 | `insights.findings.remainderMany` | {n} further findings, lighter by phonation mass, print in full on page 2. | {n} autres constats, plus légers en masse de phonation, imprimés en entier à la page 2. |
| 1505 | `insights.findings.deferredHeading` | The findings page one deferred | Les constats reportés par la page 1 |

---

## 7. THE FINDINGS THEMSELVES, 9 entries

**The pedagogical register matters most here: these point at the next action
without blaming the singer.**

| line | key | English | proposed French |
|---|---|---|---|
| 1506 | `insights.finding.rangeAbove` | The note rises above the range you typed. | La note monte au-dessus de l'ambitus que vous avez indiqué. |
| 1507 | `insights.finding.rangeBelow` | The note drops below the range you typed. | La note descend sous l'ambitus que vous avez indiqué. |
| 1508 | `insights.finding.crossing` | Your {vowel} meets your first resonance here, so the tone will want to turn full and heady, toward a whoop. | Votre {vowel} rencontre ici votre première résonance : le son voudra devenir plein et de tête, vers le cri. ⚑ |
| 1509 | `insights.finding.tighten` | The {vowel} at the top of your range and sustained here is an exposed spot where the vowel can tighten. | Le {vowel}, au sommet de votre ambitus et tenu ici, est un endroit exposé où la voyelle peut se resserrer. |
| 1510 | `insights.finding.turnover` | The {vowel} at the top of your range and sustained here is an exposed spot where the tone can spread or press. | Le {vowel}, au sommet de votre ambitus et tenu ici, est un endroit exposé où le son peut s'étaler ou se presser. |
| 1511 | `insights.finding.passaggio` | This falls near your passaggio; expect the turn to want managing. | Cela tombe près de votre passaggio; attendez-vous à devoir gérer le passage. |
| 1512 | `insights.finding.timbreOpenToClose` | Your {vowel} turns open to close inside the word, so the colour shifts as you sing it. | Votre {vowel} passe d'ouvert à fermé à l'intérieur du mot : la couleur change pendant que vous le chantez. |
| 1513 | `insights.finding.timbreCloseToOpen` | Your {vowel} turns close to open inside the word, so the colour shifts as you sing it. | Votre {vowel} passe de fermé à ouvert à l'intérieur du mot : la couleur change pendant que vous le chantez. |
| 1514 | `insights.finding.sustain` | The longer {vowel} here sits on its pitch of turning, so the colour may feel unsteady as you sustain it. | Le {vowel} plus long, ici, se pose sur sa hauteur de bascule : la couleur peut sembler instable pendant que vous le tenez. ⚑ |

**On 1511:** no space before the semicolon, per the OQLF ruling. If you would
rather split it into two sentences, say so and I will.

**On 1508, 1512, 1513, 1514:** the English *so* is drafted as a colon, which in
French carries consequence more naturally than « donc » and matches the file's
own habit at `:553` and `:554`.

---

## 8. METHOD, SILENCE, AND THE FOOTNOTE, 8 entries

| line | key | English | proposed French |
|---|---|---|---|
| 1516 | `insights.citationUnverified` | CITATION NOT YET VERIFIED | CITATION NON ENCORE VÉRIFIÉE |
| 1517 | `insights.method.typed` | Method: computed from your calibration of {date}, the voice characteristics you typed, and the score as sung, repeats taken. Nothing on this page is hand-written. | Méthode : calculé à partir de votre calibration du {date}, des caractéristiques vocales que vous avez indiquées et de la partition telle que chantée, reprises comprises. Rien sur cette page n'est écrit à la main. ⚑ |
| 1518 | `insights.method.untyped` | Method: computed from your calibration of {date} and the score as sung, repeats taken. Nothing on this page is hand-written. | Méthode : calculé à partir de votre calibration du {date} et de la partition telle que chantée, reprises comprises. Rien sur cette page n'est écrit à la main. |
| 1519 | `insights.method.silent` | Method: no voice has been measured, so nothing on this page is computed from one. | Méthode : aucune voix n'a été mesurée, donc rien sur cette page n'en est calculé. |
| 1520 | `insights.silence.unmeasured` | No voice has been measured, so this page does not compare this piece with your voice. Withheld until one is: | Aucune voix n'a été mesurée, donc cette page ne compare pas cette pièce avec votre voix. Retenu jusqu'à ce qu'une voix le soit : |
| 1521 | `insights.silence.findings` | Any finding about where this piece may challenge your voice. | Tout constat sur les endroits où cette pièce pourrait solliciter votre voix. |
| 1522 | `insights.silence.noScore` | No score has been added, so there is nothing of this piece to measure. | Aucune partition n'a été ajoutée, il n'y a donc rien de cette pièce à mesurer. |

### 1515, the Pacheco footnote, handled separately

**English, verbatim:**

> Tessitura by Pacheco's method: the span from the lowest to the highest pitch
> sung for at least half as long as the longest-sung pitch. Alberto José Vieira
> Pacheco, "Angelica Catalani's Voice According to a Method of Statistical
> Analysis," `<em>`Journal of Singing`</em>` 69, no. 5 (2013), p. 559.

**Proposed French, with the citation untranslated:**

> Tessiture selon la méthode de Pacheco : l'étendue de la hauteur la plus grave
> à la hauteur la plus aiguë chantée au moins la moitié du temps de la hauteur
> la plus longuement chantée. Alberto José Vieira Pacheco, "Angelica Catalani's
> Voice According to a Method of Statistical Analysis," `<em>`Journal of
> Singing`</em>` 69, no. 5 (2013), p. 559.

**The article title, the journal name, and the reference stay exactly as
published.** Translating them would cite something that does not exist. The
`<em>` markup and the typographic quotation marks are preserved as they are in
the English. **Whether the French should take guillemets around the article
title is a house-style question and it is yours**; changing them changes what
the citation looks like, not what it says.

---

## WHAT HAPPENS NEXT

**Nothing until you rule.** On your word I produce the insert form, with the
file's escapes for the non-breaking spaces and apostrophes, as a single
anchored edit to `i18n.ts:1464-1522` that changes only the `fr` side of these
59 entries and touches nothing else.

**The gate to watch is web-check.** Its baseline is `found 0 errors and 12
warnings in 5 files`, and the ship script refuses if that moves.
