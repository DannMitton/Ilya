# Report: « plis vocaux » in Ilya's French (r1, 2026-10-11)

**QUEUE row 65, state: WRITTEN, pushed to `cloud-lane`. The French is for Dann's look; one placement is his to rule (the entry term, item 1).** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-11, for `docs/sessions/brief-code-plis-vocaux_r1_2026-10-11.md`. Built on `cloud-lane` at `eec57e07` (row 64), with a clean tree before the first edit. One commit on `cloud-lane`, under Dann's instruction for this session; nothing pushed to `Shane` or `main`, no pull request.

## What the grep found

The brief counted five lines in Learn. There are five lines, but they carry **six** « cordes vocales » (`:1806` has two), and **two bare « cordes »** that refer to the same thing: `:1806` « la vibration des cordes » and `:1820` « les cordes cessent de vibrer ». A bare « cordes » left beside « plis vocaux » would name the organ two ways in one paragraph, so both changed to « plis » (DESK DEFAULT, under the brief's "fix every agreement"; revert the two if Dann reads them as outside the ruling). `:1820` was not in the brief's count.

The first occurrence in Learn is `:1038` (the consonant pairs), not `:1806`. The entry term went there, as the brief says ("at the first occurrence in Learn").

## Every changed French sentence, before and after

All in `apps/web/src/lib/components/Reading/LearnContent.svelte` unless named.

1. `:1038`
   - Before: « … sauf que l’une fait vibrer les cordes vocales (voisée) et l’autre non (non voisée). »
   - After: « … sauf que l’une fait vibrer les plis vocaux (souvent appelés « cordes vocales ») (voisée) et l’autre non (non voisée). »
   - **French for Dann.** The brief's pointer lands beside the sentence's own « (voisée) », so two parentheses stand side by side. A form that avoids it, offered and not built: « … sauf que l’une fait vibrer les plis vocaux, souvent appelés « cordes vocales » (voisée), et l’autre non (non voisée). »
2. `:1806`
   - Before: « Les cordes vocales vibrent-elles, ou non? »
   - After: « Les plis vocaux vibrent-ils, ou non? »
3. `:1806`
   - Before: « … vous sentirez la vibration des cordes. »
   - After: « … vous sentirez la vibration des plis. »
4. `:1806`
   - Before: « Ce qui change, c’est l’état des cordes vocales : ouvertes ou fermées. »
   - After: « Ce qui change, c’est l’état des plis vocaux : ouverts ou fermés. »
5. `:1811` (the comparison table)
   - Before: « Larynx (cordes vocales) »
   - After: « Larynx (plis vocaux) »
6. `:1818`
   - Before: « … et du voisement (l’opposition binaire des cordes vocales) ne le sont pas. »
   - After: « … et du voisement (l’opposition binaire des plis vocaux) ne le sont pas. »
7. `:1820`
   - Before: « … simultanément dévoisée (les cordes cessent de vibrer) et palatalisée … »
   - After: « … simultanément dévoisée (les plis cessent de vibrer) et palatalisée … »
8. `:1873`
   - Before: « Les voyelles sont voisées : les cordes vocales vibrent tout au long de leur production. »
   - After: « Les voyelles sont voisées : les plis vocaux vibrent tout au long de leur production. »
9. `apps/web/src/lib/i18n.ts:1717`, `insights.figure.cycleDose`, French
   - Before: « Dose de cycles : environ {cycles} (nombre de collisions des cordes vocales dans cette pièce) »
   - After: « Dose de cycles : environ {cycles} (nombre de collisions des plis vocaux dans cette pièce) »
   - Comment added at `i18n.ts:1713-1714`: the term changed by Dann's ruling of 2026-10-11 04:12.

No other French changed. Every pronoun and adjective in the five paragraphs was read after the change; none still agrees with « cordes ».

## Left alone

- `data/dictionary.*-gloss-a.json`: kaikki.org's « voix, son produit par les cordes vocales », a source's words.
- English: no "vocal cords" in `apps/web/src`.

## The eight gates

| # | Gate | Before (row 64) | After row 65 |
|---|---|---|---|
| 1 | `pnpm test:phonology` | 251 passed (251) | 251 passed (251) |
| 2 | `pnpm test:dictionary` | 235 passed (235) | 235 passed (235) |
| 3 | `pnpm --filter @ilya/web check` | 0 errors and 12 warnings in 5 files | same |
| 4 | `pnpm --filter @ilya/web test` | 2094 passed (2094) | 2094 passed (2094) |
| 5 | `pnpm --filter @ilya/score-parser test` | 650 passed, 5 skipped (655) | same |
| 6 | `pnpm test:blurb` | 145 passed (145) | 145 passed (145) |
| 7 | `pnpm test:integration` | 55 passed (55) | 55 passed (55) |
| 8 | `pnpm ratchets` | OK | OK |

Gate 4 reads 2094, not the brief's 2088: row 64 added six tests before this row. This row moves no count.

## Could not establish

- **The French reads well to a native ear.** The agreements are grammatical; the register is Dann's to judge, item 1 most of all.
- **The Guide.** The brief says the French Guide's conventions section will list the entry term as a separate item. Not done here; no Guide text changed.
