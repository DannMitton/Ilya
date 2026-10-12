# Report: "comfortable working zone" (QUEUE row 73, r1)

**QUEUE row 73, state: WRITTEN, pushed to `cloud-lane`. Voice setup and Insights now call the singer's own zone "comfortable working zone" / « zone de travail confortable »; "tessitura" names a piece only.** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-12, for `docs/sessions/brief-code-comfortable-working-zone_r1_2026-10-11.md` with its amendments of 2026-10-11 19:30, on `cloud-lane` after merging `origin/Shane` at `7bb929a4`. Clean tree before the first edit.

**The amendments** replace the brief's opening sentence: a piece has a tessitura, and the singer has a comfortable working zone. They add nothing to the work.

## What changed

Every key below is in `apps/web/src/lib/i18n.ts`. Each was found and edited by its key, never by line; the line numbers are given only to help a reader find it.

Words are as in `docs/sessions/draft-comfortable-working-zone-strings_r1_2026-10-11.md`, both languages RATIFIED (English 16:16, French 16:25).

| Key | English | French |
|---|---|---|
| `calib.characteristics.tessituraHeading` (`:1274`) | Comfortable working zone | Zone de travail confortable |
| `calib.characteristics.tessituraLowLabel` | Working zone floor | Plancher de la zone de travail |
| `calib.characteristics.tessituraHighLabel` | Working zone ceiling | Plafond de la zone de travail |
| `calib.characteristics.tessituraInvertedNote` | The working zone's floor is set above its ceiling. | Le plancher de la zone de travail est placé au-dessus de son plafond. |
| `profile.withheld.item3` (`:1325`) | Any reading of your range, your comfortable working zone, or your passaggio. | Toute lecture de votre ambitus, de votre zone de travail confortable ou de votre *passaggio*. |
| `insights.verdict.outsideTessitura` (`:1629`) | The compass fits the range you typed, but the piece's tessitura sits outside the comfortable working zone you typed. | L’ambitus de la pièce entre dans celui que vous avez indiqué, mais la tessiture de la pièce se situe hors de la zone de travail confortable que vous avez indiquée. |
| `insights.r2.cycles.under` | {n} under your comfortable working zone | {n} sous votre zone de travail confortable |
| `insights.r2.cycles.within` | {n} within your comfortable working zone, {low} to {high}, typed | {n} dans votre zone de travail confortable, {low} à {high}, telle que vous l’avez indiquée |
| `insights.r2.cycles.above` | {n} above your comfortable working zone | {n} au-dessus de votre zone de travail confortable |
| `insights.r2.sourcesLine` (`:1802`), last clause only | …set beside your comfortable working zone after Titze 2008. | …elle est placée à côté de votre zone de travail confortable d’après Titze 2008. |
| `insights.r2.yourTessitura` | your comfortable working zone, typed | votre zone de travail confortable, telle que vous l’avez indiquée |

In addition, `insights.r2.vowels.noTurn` (`:1786`) has new French: « {s}, aucune première résonance mesurée lors de votre calibration » (RATIFIED 16:11). Its English is unchanged.

Nothing else changed. The key names and the code identifiers (`tessituraLow`, `tessituraHigh`) stay, and so do the keys the draft lists as naming a piece's tessitura.

**One typographic note.** The draft types straight apostrophes (« l'avez », « L'ambitus », « d'après »). Each key keeps the apostrophe it already used: ’, or `’` in `insights.verdict.outsideTessitura`. So a grep for the draft's text with a straight apostrophe will not match those three; a grep with ’ will. The words are otherwise verbatim.

## Done-when checks

- **The forbidden phrases.** `grep -n -i "your tessitura\|votre tessiture" apps/web/src/lib/i18n.ts` returns nothing (exit 1).
- **Tests that asserted the old wording: none.** No test asserted any of these strings, and no existing test changed.
- **Seen rendered.** Pictures in `docs/sessions/working-zone-shots/`:
  - `characteristics-en.png` and `characteristics-fr.png`: voice setup's Voice characteristics phase, opened from Insights' "Add your range". The section heading and both field labels show the new words.
  - `insights-zone-en.png` and `insights-zone-fr.png`: Insights page 2 with a typed zone. The cycle legend reads "within your comfortable working zone, B2 to A3, typed" and « dans votre zone de travail confortable, si1 à la2, telle que vous l’avez indiquée ».
  - Row 68, next, turns the French pitch names into letters.

## The eight gates

All pass. Gate 4 is **2341**, unchanged by this row. The +12 since row 70 came with the Shane merge: 12 new `.musicxml` scores, which row 72's every-score test now covers.

1. `pnpm test:phonology`: 251 passed (251)
2. `pnpm test:dictionary`: 242 passed (242)
3. `pnpm --filter @ilya/web check`: 0 errors and 12 warnings in 5 files
4. `pnpm --filter @ilya/web test`: 2341 passed (2341)
5. `pnpm --filter @ilya/score-parser test`: 663 passed, 5 skipped (668)
6. `pnpm test:blurb`: 145 passed (145)
7. `pnpm test:integration`: 55 passed (55)
8. `pnpm ratchets`: OK

## Could not establish

- **The open choice in the draft**, « zone de travail confortable » or « zone de confort ». Dann's French ruling of 16:25 settles it as drafted; this row seats that. The hint at `:1275`, « Dans votre zone de confort … », still uses the other phrase, unchanged as the draft says.
