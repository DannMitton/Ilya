# Brief for Code: N.82, the watch band in both languages

**Desk brief r1, 2026-09-28, at `7d2fcd6`. Shape: `BRIEF-TEMPLATE.md`.** The rulings are the section "Rulings" at the end of `docs/sessions/n82-watch-band-draft_r1_2026-09-28.md` (Dann, 2026-09-28 15:04 to 15:10). The draft's §1 and §4 map the code, read at `9ebfdc0`: they are leads; re-read before you change anything.

## 1. What was observed

Every sentence on Markup's "Places to watch" band is composed in English in code (`watchlist.ts` `watchEntryLine`, `advice-resolver.ts`, `transposition.ts`), so a French session reads all of them in English (the draft §2, 24 units).

## 2. What to build

1. **Move every band sentence into `i18n.ts`**, with the keys the draft §3 proposes (or better names you report), English and French as ratified. The band renders through `t(key, language)`; the entry carries structured values (bar, vowel, word, directions, kinds, semitones, key fifths and mode), not baked English. `packages/score-parser` stays free of the app's i18n: pass numbers out, compose words in the app.
2. **IPA in square brackets** on the band, both languages (ruled 15:06). Update `watchlist.test.ts` expectations to the new English; that is an intended change, not an approval-file edit.
3. **Key names:** English as now (`E flat major`); French in solfège, lowercase (`en mi bémol majeur`), from letters do ré mi fa sol la si, `bémol`/`dièse` from `notePicker.acc.*`, `majeur`/`mineur`. French repeats the preposition: « en {a} ou en {b} ».
4. **Intervals:** « d'un demi-ton », « d'un ton », « d'une tierce mineure », « d'une tierce majeure », « d'une quarte juste », « d'un triton »; directions « vers le bas » / « vers le haut ». Example: « d'une tierce majeure ou d'une quarte juste vers le bas ».
5. **The lines** S2 to S12: the draft §3 French, in the « Mesure {bar} : … , de sorte que … » shape, with « prolongé » / « pendant qu'il se prolonge », and S9/S10 ending « attendez-vous à devoir gérer le changement de timbre ».
6. **The advice: opener + action, rotated.** Build it like `suggestionRuns` in `insights/comment-text.ts` (`:311-324`): `comment.opener.{1..5}` filled with `{action}` and `{de}`, then a period. No two advice sentences on one page share an opener (the page rule, `comment-text.ts:170`). The ratified actions:

| advice | English action | French action |
|---|---|---|
| iCrossing | relaxing the jaw and leaning the vowel toward [{target}], giving it a touch more space, which can lift your first resonance clear of the pitch | relâcher la mâchoire et orienter la voyelle vers [{target}], en lui donnant un peu plus d'espace, ce qui peut dégager votre première résonance de la hauteur chantée |
| openOCrossing | allowing the turn and letting the vowel open into that fuller, headier resonance; up here it can settle the tone rather than straining to stay bright | accepter le changement de timbre et laisser la voyelle s'ouvrir vers cette résonance plus pleine, plus tournée vers la tête; dans cet aigu, cela peut poser le son plutôt que de le forcer à rester clair |
| oCover | allowing the vowel to open and darken toward [{target}]; that can be a more comfortable option than a close [o] this high | laisser la voyelle s'ouvrir et s'assombrir vers [{target}]; cela peut être une option plus confortable qu'un [o] fermé dans cet aigu |
| openTracking | letting the jaw drop to open the vowel here, raising your first resonance to the pitch; that can ease the sound rather than keeping a close [{vowel}] squeezed this high | laisser la mâchoire descendre pour ouvrir la voyelle ici, en élevant votre première résonance jusqu'à la hauteur chantée; cela peut libérer le son, plutôt que de garder un [{vowel}] fermé et serré dans cet aigu |
| maleTurnover | letting the [{vowel}] turn and gather here rather than spreading it open for more sound; up this high the ring tends to come from letting it settle, not from pushing it wider | laisser le [{vowel}] changer de timbre et se rassembler ici, plutôt que de l'ouvrir davantage pour obtenir plus de son; dans cet aigu, la brillance tend à venir de ce que vous le laissez se poser, et non de ce que vous l'élargissez |

Check each English opener reads with each action ("One thing to explore is relaxing…"); if one does not, report it rather than rewording.

7. **Also seat, while in `i18n.ts`:** `insights.finding.tighten`, `.turnover`, `.sustain` still say « tenu » / « tenez » against Dann's « prolonger » ruling of 2026-09-25 13:04 (`docs/memory/PRODUCT.md`, "SUSTAINED", NEVER "HELD"). Make them « prolongé » and « pendant qu'il se prolonge », as on the band.

## 3. Constraints

- Typography: « » with ` ` inside, ` ` before a colon, no space before `;` or `?` (the 2026-08-21 rule), `’` apostrophes, the file's own escapes, no raw no-break spaces.
- No `vitest -u`; an approval file that changes is reported, not rewritten.
- `+page.svelte` and `MarkupPane.svelte` must not grow past their ratchet ceilings.
- **Displaces:** nothing; it runs after calm-loupe slice 7 and N.154's seating.

## 4. Done when

- A grep shows every ratified French string in the tree and no English band sentence composed in code. The desk checks it against the rulings.
- The gates pass. `DONE` is Dann's look at the band in French on a song with at least one range line and two advice lines.
