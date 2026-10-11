# "Comfortable working zone" strings, r1 (dated draft)

Ruled by Dann 2026-10-11 16:16 (`docs/memory/PRODUCT.md`, "Tessitura, as Ilya uses the word"). English by the desk from his wording; French drafted by the desk from the file's existing French. Lines are `apps/web/src/lib/i18n.ts` at `4f7421e` plus the working tree, read 2026-10-11 16:17.

Glossary source: `i18n.ts` itself: « zone de confort » (`:1275`), « plancher », « plafond » (`:1276-1278`), « telle que vous l'avez indiquée » (`:1776`, `:1791`). Coined by the desk: « zone de travail confortable », a close rendering of Dann's English (possible calque; see open choice).

| line | key | English, new | French, draft |
|---|---|---|---|
| 1274 | `calib.characteristics.tessituraHeading` | Comfortable working zone | Zone de travail confortable |
| 1276 | `calib.characteristics.tessituraLowLabel` | Working zone floor | Plancher de la zone de travail |
| 1277 | `calib.characteristics.tessituraHighLabel` | Working zone ceiling | Plafond de la zone de travail |
| 1278 | `calib.characteristics.tessituraInvertedNote` | The working zone's floor is set above its ceiling. | Le plancher de la zone de travail est placé au-dessus de son plafond. |
| 1325 | `profile.withheld.item3` | Any reading of your range, your comfortable working zone, or your passaggio. | Toute lecture de votre ambitus, de votre zone de travail confortable ou de votre *passaggio*. |
| 1629 | `insights.verdict.outsideTessitura` | The compass fits the range you typed, but the piece's tessitura sits outside the comfortable working zone you typed. | L'ambitus de la pièce entre dans celui que vous avez indiqué, mais la tessiture de la pièce se situe hors de la zone de travail confortable que vous avez indiquée. |
| 1775 | `insights.r2.cycles.under` | {n} under your comfortable working zone | {n} sous votre zone de travail confortable |
| 1776 | `insights.r2.cycles.within` | {n} within your comfortable working zone, {low} to {high}, typed | {n} dans votre zone de travail confortable, {low} à {high}, telle que vous l'avez indiquée |
| 1777 | `insights.r2.cycles.above` | {n} above your comfortable working zone | {n} au-dessus de votre zone de travail confortable |
| 1788 | `insights.r2.sourcesLine`, last clause only | …set beside your comfortable working zone after Titze 2008. | …elle est placée à côté de votre zone de travail confortable d'après Titze 2008. |
| 1791 | `insights.r2.yourTessitura` | your comfortable working zone, typed | votre zone de travail confortable, telle que vous l'avez indiquée |

Unchanged, because they name a piece's tessitura: `:1605`, `:1614`, `:1615`, `:1630`, `:1655`, `:1697`, `:1722`, `:1790`. `:1275` (the hint) is unchanged in both languages.

Agreement checked: « zone » is feminine; « indiquée », « telle », « placée » (with « dose ») agree with their nouns. `:1629` also changes « la pièce se situe » to « la tessiture de la pièce se situe », in both languages, so the sentence compares a piece's tessitura with a singer's zone.

Open choice: « zone de travail confortable » (draft) or « zone de confort », which the hint already uses but which also carries the everyday "comfort zone" sense.

## Corrections

- 2026-10-11 16:15, the desk offered option 2 with the reason "singers say it that way in the studio". No source supported it; Dann: *"Singers do not say it that way in the studio... quit lying."* Struck.
- The desk's worry that "comfortable" collides with the range fields was waved off by Dann 16:22: the word "applies to both concepts just fine".
