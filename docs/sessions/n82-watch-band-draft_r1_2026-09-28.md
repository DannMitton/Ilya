A draft for Dann's ruling. Nothing here is in the tree.

# N.82, the watch band's sentences in both languages

Read on 2026-09-28 from `/home/claude/ilya-night`, branch `Shane`, HEAD `9ebfdc0` (confirmed with `git log --oneline -1`; working tree clean). No repository file was changed.

Typography in every French proposal below: each space before a colon and inside « » is a non-breaking space (U+00A0, written ` ` in `i18n.ts`); there is no space before a semicolon. Apostrophes are U+2019. A vowel named alone (`/o/`) is treated as masculine.

## 1. What the watch band is and where it renders

- It is the "Places to watch" list: a severity-ranked, adaptively filtered list of the places in a song most likely to challenge this singer (`apps/web/src/lib/analysis/watchlist.ts:2-9`).
- `buildWatchList` builds it from the parsed score and the analysis (`watchlist.ts:340-496`). Each entry is one note, named once by its hardest kind (`watchlist.ts:136-177`, `:535-539`).
- `watchEntryLine` turns an entry into the sentence the singer reads (`watchlist.ts:540-601`). `WATCH_HEADER` is the heading (`watchlist.ts:102`).
- It renders in Markup only: `MarkupPane.svelte:1061-1070`, on the trailing commentary page after the score (`MarkupPane.svelte:846-855`). The header is both the visible heading and the `aria-label` of the `<aside>` (`MarkupPane.svelte:1062-1063`).
- It shows only when there is at least one entry (`MarkupPane.svelte:732`); zero entries prints nothing (`watchlist.ts:180-181`).
- Two English sources feed the lines besides `watchEntryLine` itself:
  - The advice clause appended to four kinds of line comes from `resolveAdvice` in `apps/web/src/lib/analysis/advice-resolver.ts:360-383`, called at `MarkupPane.svelte:707-711` and baked onto the entry at `watchlist.ts:460`.
  - The transposition phrase on range lines comes from `packages/score-parser/src/transposition.ts` (`intervalName` at `:297-301`, `keyNameAfterTransposition` at `:326-340`), joined at `watchlist.ts:515-531` and baked on at `watchlist.ts:486-493`.
- Insights also reads `buildWatchList`'s entries (`apps/web/src/lib/insights/insights.ts:17`, `:43`) but renders them through its own `insights.finding.*` keys (`InsightsPane.svelte:404-430`) and never renders the advice clause. So the Insights findings are the nearest existing French for most watch lines.

## 2. Every sentence or fragment composed in code

The unit counted is a sentence template or a fragment family the singer reads. 24 units. None of them has French on the watch band today: in a French session every one renders in English. The last column says whether French for the same meaning exists anywhere in the tree.

| # | file:line | English as composed | French anywhere? |
|---|---|---|---|
| S1 | `watchlist.ts:102` | `Places to watch` (heading and aria-label) | Partly: « La liste des points à surveiller », `profile.withheld.item2` (`i18n.ts:1205`) |
| S2 | `watchlist.ts:550`, `:555` | `` `Bar ${bar} drops below the range you gave.` `` | Yes, adapted: `insights.finding.rangeBelow` (`i18n.ts:1521`) |
| S3 | `watchlist.ts:551`, `:555` | `` `Bar ${bar} rises above the range you gave.` `` | Yes, adapted: `insights.finding.rangeAbove` (`:1520`) |
| S4 | `watchlist.ts:554` | `` `${base}; you may want to transpose ${entry.transpositionPhrase}.` `` where `base` is S2 or S3 without its period | No |
| F1 | `watchlist.ts:518` | `` `to ${keys.join(' or ')}` `` (at most two keys, `transposition.ts:37`) | No |
| F2 | `watchlist.ts:524-531` | Interval join: one name; or `"down a major third or a perfect fourth"` (shared direction elided); or `"down a semitone or up a whole tone"` (mixed) | No |
| F3 | `transposition.ts:298` | Direction word `down` / `up` | Yes: « vers le bas » / « vers le haut », `correct.semitoneDown` / `correct.semitoneUp` (`i18n.ts:247-248`) |
| F4 | `transposition.ts:290-294`, `:300` | Interval names. Reachable from the watch band: `a semitone`, `a whole tone`, `a minor third`, `a major third`, `a perfect fourth`, `a tritone` (the window is ±6, `transposition.ts:35`; `watchlist.ts:489` passes no options). Unreachable today: sixths through `an octave`, and `` `${n} semitones` `` | Partly: demi-ton (`:421`), quinte juste, sixtes, septièmes, octave (`:1611-1616`); none of the six reachable ones except the semitone |
| F5 | `transposition.ts:307-339` | Key name `` `${tonic} ${mode}` ``: tonics `C flat` ... `C sharp` (major) and `A flat` ... `A sharp` (minor), 18 distinct words; mode `major` / `minor` | No key names. `bémol` / `dièse` exist (`:1222`, `:1224`); `majeure` / `mineure` exist only in the feminine (`:1612-1613`) |
| S5 | `watchlist.ts:561-562` | `` `Bar ${bar}: your ${v} meets your first resonance here, so the tone will want to turn full and heady, toward a whoop.` `` then `` ` ${advice}` `` when present. `v` is `` `/${vowel}/` `` (`:542`) | Yes, adapted: `insights.finding.crossing` (`:1522`) |
| S6 | `watchlist.ts:569-570` | `` `Bar ${bar}: the ${v} at the top of your range and sustained here is an exposed spot where the vowel can tighten.` `` + advice | Yes, adapted: `insights.finding.tighten` (`:1523`) |
| S7 | `watchlist.ts:577-578` | Identical text to S6 (the tracking kind) + advice | Yes, as S6 |
| S8 | `watchlist.ts:586-587` | `` `Bar ${bar}: the ${v} at the top of your range and sustained here is an exposed spot where the tone can spread or press.` `` + advice | Yes, adapted: `insights.finding.turnover` (`:1524`) |
| S9 | `watchlist.ts:591-592` | `` `Bar ${bar}: '${entry.word}' falls near your passaggio; expect the turn to want managing.` `` | Partly: `insights.finding.passaggio` (`:1525`) has no word |
| S10 | `watchlist.ts:593` | `` `Bar ${bar}: your ${v} falls near your passaggio; expect the turn to want managing.` `` | Partly, as S9 |
| S11 | `watchlist.ts:595-597` | `` `Bar ${bar}: your ${v}${on} turns ${dir} inside the word, so the colour shifts as you sing it.` `` | Yes, adapted: `insights.finding.timbreOpenToClose` / `CloseToOpen` (`:1526-1527`) |
| F6 | `watchlist.ts:595` | `dir`: `open to close` / `close to open` | Yes, inside `:1526-1527` |
| F7 | `watchlist.ts:596` | `on`: `` ` on '${entry.word}'` `` or empty | Partly: « sur » for "on" (`comment.working.frame.sustained`, `:1592`) |
| S12 | `watchlist.ts:599` | `` `Bar ${bar}: the longer ${v} here sits on its pitch of turning, so the colour may feel unsteady as you sustain it.` `` | Yes, adapted: `insights.finding.sustain` (`:1528`) |
| S13 | `advice-resolver.ts:126-127` | `` `You may find it helpful to relax the jaw and lean it toward /${target}/, giving it a touch more space, which lifts your first resonance clear of the pitch.` `` (target is `ɪ`) | No |
| S14 | `advice-resolver.ts:168-169` | `You may find it helpful to allow the turn and let the vowel open into that fuller, headier resonance; up here it settles the tone rather than straining to stay bright.` | No |
| S15 | `advice-resolver.ts:214-215` | `` `You may find it helpful to allow the vowel to open and darken toward /${target}/; that is a more comfortable option than a close /o/ this high.` `` (target is `ɑ`; `/o/` is literal) | No |
| S16 | `advice-resolver.ts:268-269` | `` `You may find it helpful to let the jaw drop to open the vowel here, raising your first resonance to the pitch; that eases the sound rather than holding a close /${vowel}/ squeezed this high.` `` | No |
| S17 | `advice-resolver.ts:317-318` | `` `You may find it helpful to let the /${vowel}/ turn and gather here rather than spreading it open for more sound; up this high the ring comes from letting it settle, not from pushing it wider.` `` | No |

Totals: 24 units, 0 with French on the watch band, 9 with no French anywhere in the tree (S4, S13 to S17, F1, F2, F5).

Interpolation and plurals, as the code does them:
- `bar` is a string from the measure's own number, never `measureIndex + 1` (`watchlist.ts:498-505`). No line counts anything, so no line needs a plural form. The only "plural" is the list of one or two keys or intervals (F1, F2), joined with `or`.
- `vowel` is IPA from the resolver, wrapped in slashes by the watch band (`watchlist.ts:542`) and in square brackets by Insights (`InsightsPane.svelte:405`).
- `word` is the raw score cell, punctuation included (`watchlist.ts:361`); Insights strips the punctuation first (`InsightsPane.svelte:399-402`), the watch band does not.
- Advice is appended with one space (`watchlist.ts:562`, `:570`, `:578`, `:587`). Which advice lands on which line: S13 and S14 on S5, S15 on S6, S16 on S7, S17 on S8 (`advice-resolver.ts:122`, `:167`, `:213`, `:266-267`, `:315-316`; `watchlist.ts:434-436`).

## 3. Proposed keys, English, and French

Every French line is a proposal for Dann to ratify, edit, or decline. Sources are named per term; COINED means no `i18n.ts` entry carries it. Where the English changes, the reason is given.

### S1, the heading

- Key: `watch.header`
- English: Places to watch
- French: Points à surveiller
- Sources: « points à surveiller », `profile.withheld.item2` (`i18n.ts:1205`). Agreement: none to check; the noun is written.

### S2 and S3, range lines without a transposition

- Keys: `watch.line.rangeBelow`, `watch.line.rangeAbove`
- English: kept. `Bar {bar} drops below the range you gave.` / `Bar {bar} rises above the range you gave.`
- French: Mesure {bar} : la note descend sous l’ambitus que vous avez indiqué. / Mesure {bar} : la note monte au-dessus de l’ambitus que vous avez indiqué.
- Sources: « mesure », `insights.fit.withheldOne` (`:1493`), written out in prose per Roberge (`docs/memory/INBOX.md:161`); the rest verbatim from `insights.finding.rangeBelow` / `rangeAbove` (`:1520-1521`); « ambitus que vous avez indiqué » is also how `profile.octaveNotice` renders "the range you gave" (`:1197`).
- Agreement: « indiqué » agrees with « ambitus » (masculine), the preceding direct object.
- Dann's choice: the French takes the colon shape of every other watch line, because « la mesure 12 monte » reads oddly. The alternative keeps the English shape: « À la mesure {bar}, la ligne monte au-dessus... » (« ligne », `profile.octaveNotice`).

### S4, range lines with a transposition

Two keys each, because the English base loses its period:

- Keys: `watch.line.rangeBelowTranspose`, `watch.line.rangeAboveTranspose`
- English: kept. `Bar {bar} drops below the range you gave; you may want to transpose {phrase}.` (and "rises above").
- French: Mesure {bar} : la note descend sous l’ambitus que vous avez indiqué; vous pouvez songer à transposer {phrase}. (and « monte au-dessus de »)
- Sources: « vous pouvez songer à », `comment.opener.2` (`:1620`); « transposer » COINED.
- `{phrase}` comes from F1 or F2.

### F1, the key phrase

- Keys: `watch.transpose.key.one`, `watch.transpose.key.two`
- English: `to {a}` / `to {a} or {b}` (kept; one "to" for two keys, as now)
- French: en {a} / en {a} ou en {b}
- Sources: « transposer en » plus a key, COINED construction (counted with « transposer »). French repeats the preposition, which is why this is two keys rather than a join word.

### F2 and F3, the interval phrase

- Keys: `watch.transpose.interval.one` (`{direction} {a}`), `watch.transpose.interval.shared` (`{direction} {a} or {b}`), `watch.transpose.interval.mixed` (`{dirA} {a} or {dirB} {b}`)
- French: {a} {direction} / {a} ou {b} {direction} / {a} {dirA} ou {b} {dirB}
- Direction keys `watch.transpose.down`, `watch.transpose.up`: English `down` / `up`; French « vers le bas » / « vers le haut », from `correct.semitoneDown` / `correct.semitoneUp` (`:247-248`).
- Rendered example: "down a major third or a perfect fourth" becomes « d’une tierce majeure ou d’une quarte juste vers le bas ».

### F4, the interval names (reachable six only)

Key `watch.transpose.interval.{n}`, n = 1 to 6. The French carries « d’ » because it follows « transposer »; every name starts with un or une, so the elision is always « d’ ».

| n | English (kept) | French | Sources |
|---|---|---|---|
| 1 | a semitone | d’un demi-ton | `correct.semitoneDown` (`:248`), `loupe.pitch.semitone` (`:421`) |
| 2 | a whole tone | d’un ton | « ton » COINED. `loupe.pitch.semitone`'s comment (`:413-420`) avoided "tone" because that cell does not always move a tone; here two semitones is always a tone, so the objection does not apply |
| 3 | a minor third | d’une tierce mineure | « tierce » COINED; « mineure », `comment.working.leap.8` (`:1612`) |
| 4 | a major third | d’une tierce majeure | « majeure », `comment.working.leap.9` (`:1613`) |
| 5 | a perfect fourth | d’une quarte juste | « quarte » COINED; « juste », `comment.working.leap.7` (`:1611`) |
| 6 | a tritone | d’un triton | « triton » COINED |

Agreement: « mineure », « majeure », « juste » agree with « tierce », « quarte » (feminine).

### F5, the key names

- Keys: `watch.key.name` (`{tonic} {mode}`), `watch.key.tonic` (`{letter} {accidental}`), `watch.key.letter.{C..B}`, `watch.key.mode.major`, `watch.key.mode.minor`; the accidental reuses `notePicker.acc.flat` / `notePicker.acc.sharp` (`:1222`, `:1224`: en `flat` / `sharp`, fr « bémol » / « dièse »).
- English: kept (`E flat major`).
- French, proposed: do, ré, mi, fa, sol, la, si (all seven COINED), lowercase; « majeur » / « mineur ». Example: « en mi bémol majeur ou en ré bémol majeur ».
- Agreement: « majeur » / « mineur » agree with the implied « ton » (masculine), so they take the masculine of `comment.working.leap.8-9`'s « mineure » / « majeure ».
- Dann's choice, and a real one: the app names pitches with letters in both languages (`pitchLabel`, `apps/web/src/lib/voice/note-picker.ts:94-96`), so solfège here would be its first appearance. The alternative is « E bémol majeur », consistent with the pitch labels and less idiomatic.

### S5, the crossing line

- Key: `watch.line.crossing`
- English: kept. `Bar {bar}: your {vowel} meets your first resonance here, so the tone will want to turn full and heady, toward a whoop.` The caller passes `{vowel}` with its slashes.
- French: Mesure {bar} : votre {vowel} rencontre ici votre première résonance, de sorte que le son voudra devenir plein et de tête, vers le youhou.
- Sources: `insights.finding.crossing` (`:1522`) verbatim except its colon, replaced by « , de sorte que » from `insights.fit.tessituraMarginal` (`:1492`), because « Mesure {bar} : » already spends the sentence's colon.
- Agreement: « plein » agrees with « le son » (masculine).

### S6 and S7, the tighten line (cover and tracking share it)

- Key: `watch.line.tighten` (one key, both kinds, as Insights does at `InsightsPane.svelte:411-413`)
- English: kept.
- French: Mesure {bar} : le {vowel}, au sommet de votre ambitus et prolongé ici, est un endroit exposé où la voyelle peut se resserrer.
- Sources: `insights.finding.tighten` (`:1523`), with « tenu » replaced by « prolongé » per the ruling of 2026-09-25 13:04 (`docs/memory/PRODUCT.md:968`; « prolongées », `voiceIntake.topic.sustained`, `:1703`).
- Agreement: « prolongé » agrees with « le {vowel} », a sound named alone (masculine); « exposé » agrees with « endroit ».

### S8, the turnover line

- Key: `watch.line.turnover`
- English: kept.
- French: Mesure {bar} : le {vowel}, au sommet de votre ambitus et prolongé ici, est un endroit exposé où le son peut s’étaler ou se presser.
- Sources: `insights.finding.turnover` (`:1524`), « tenu » replaced as in S6. Agreement as S6.

### S9 and S10, the passaggio lines

- Keys: `watch.line.passaggioWord`, `watch.line.passaggio`
- English: kept. `Bar {bar}: '{word}' falls near your passaggio; expect the turn to want managing.` / `Bar {bar}: your {vowel} falls near your passaggio; expect the turn to want managing.`
- French: Mesure {bar} : « {word} » tombe près de votre passaggio; attendez-vous à devoir gérer le changement de timbre. / Mesure {bar} : votre {vowel} tombe près de votre passaggio; attendez-vous à devoir gérer le changement de timbre.
- Sources: `insights.finding.passaggio` (`:1525`); « le changement de timbre » for "the turn", `voiceIntake.acoustics.3` (`:1696`).
- Agreement: the English object is "the turn". Insights' French, « attendez-vous à devoir le gérer », has « le » whose only masculine antecedent is « passaggio », so it names a different referent from the English. The draft names the turn outright.

### S11, the timbre lines

Four full sentences rather than a sentence with two slots, so each language owns its order:

- Keys: `watch.line.timbreOpenToClose`, `watch.line.timbreCloseToOpen`, `watch.line.timbreOpenToCloseWord`, `watch.line.timbreCloseToOpenWord`
- English: kept. `Bar {bar}: your {vowel} turns open to close inside the word, so the colour shifts as you sing it.`; the word forms insert ` on '{word}'` after `{vowel}`.
- French: Mesure {bar} : votre {vowel} passe d’ouvert à fermé à l’intérieur du mot, de sorte que la couleur change pendant que vous le chantez. The word forms: « votre {vowel} sur « {word} » passe... ». The close-to-open forms: « passe de fermé à ouvert ».
- Sources: `insights.finding.timbreOpenToClose` / `CloseToOpen` (`:1526-1527`), colon replaced as in S5; « sur » for "on", `comment.working.frame.sustained` (`:1592`).
- Agreement: « ouvert », « fermé » agree with « votre {vowel} » (masculine); « le » in « vous le chantez » refers to the vowel (masculine).

### S12, the sustain line

- Key: `watch.line.sustain`
- English: kept.
- French: Mesure {bar} : le {vowel} plus long, ici, se pose sur sa hauteur de changement de timbre, de sorte que la couleur peut sembler instable pendant qu’il se prolonge.
- Sources: `insights.finding.sustain` (`:1528`); colon replaced as in S5; « pendant que vous le tenez » replaced by « pendant qu’il se prolonge », the note's reflexive form the ruling names (`PRODUCT.md:968`; `comment.working.frame.sustained`, `:1592`).
- Agreement: « plus long » and « il » refer to « le {vowel} » (masculine); « instable » agrees with « couleur ».
- Dann's choice: the transitive « pendant que vous le prolongez » keeps "you", but the ruling chose the reflexive so a note does not read as lengthened past what is written.

### S13 to S17, the advice clauses

The opener "You may find it helpful to" becomes « Il peut être intéressant de » (« d’ » before a vowel), from `comment.opener.3` (`:1621`). Dann's choice: « Il peut vous être utile de » (« utile » COINED) is closer to "helpful".

Four English changes are proposed, for one reason each: `PRODUCT.md:978-981` rules that an outcome is phrased as a possibility ("which can help"), never a promise, and `PRODUCT.md:244` that Insights says "what tends to help". These strings were approved 2026-07-21 and 2026-07-22, before that ruling. Whether the ruling binds Markup's watch band as well as Insights is NOT ESTABLISHED; the changes are offered, not assumed.

**S13**, key `watch.advice.iCrossing`
- English, changed: `You may find it helpful to relax the jaw and lean the vowel toward /{target}/, giving it a touch more space, which can lift your first resonance clear of the pitch.` Reasons: "lean it" grammatically leans the jaw toward a vowel, which is not the sense; "lifts" becomes "can lift".
- French: Il peut être intéressant de relâcher la mâchoire et d’orienter la voyelle vers /{target}/, en lui donnant un peu plus d’espace, ce qui peut dégager votre première résonance de la hauteur chantée.
- Sources: « mâchoire », `comment.working.try.jaw.action` (`:1626`); « voyelle », `:1523`; « espace », `:1633`; « première résonance », `:1522`; « hauteur chantée », `insights.fit.noPitches` (`:1487`). COINED: « relâcher », « orienter », « dégager ».
- Agreement: « lui » refers to « la voyelle »; « chantée » agrees with « hauteur ».

**S14**, key `watch.advice.openOCrossing`
- English, changed: `...; up here it can settle the tone rather than straining to stay bright.` Reason: "settles" becomes "can settle".
- French: Il peut être intéressant d’accepter le changement de timbre et de laisser la voyelle s’ouvrir vers cette résonance plus pleine, plus tournée vers la tête; dans cet aigu, cela peut poser le son plutôt que de le forcer à rester clair.
- Sources: « changement de timbre », `:1696`; « laisser », `:1626`; « s’ouvrir », `comment.working.try.jaw.closer` (`:1627`); « pleine », « de tête », `:1522`; « dans l’aigu », `voiceIntake.softHigh.stem` (`:1687`); « se pose », `:1528`. COINED: « accepter », « plus tournée vers la tête », « forcer », « clair ».
- Agreement: « pleine », « tournée » agree with « résonance »; « le » and « clair » refer to « le son » (masculine).

**S15**, key `watch.advice.oCover`
- English, changed: `...; that can be a more comfortable option than a close /o/ this high.` Reason: "is" becomes "can be".
- French: Il peut être intéressant de laisser la voyelle s’ouvrir et s’assombrir vers /{target}/; cela peut être une option plus confortable qu’un /o/ fermé dans cet aigu.
- Sources: « confortable », `comment.working.frame.ceiling` (`:1595`); « un [...] fermé », `comment.working.where.closedU` (`:1606`); « dans l’aigu », `:1687`. COINED: « s’assombrir », « option ».
- Agreement: « fermé » agrees with « /o/ » (masculine); « confortable » agrees with « option ». The `/o/` stays the IPA symbol; the vowel is not renamed.

**S16**, key `watch.advice.openTracking`
- English, changed: `...; that can ease the sound rather than holding a close /{vowel}/ squeezed this high.` Reason: "eases" becomes "can ease". "Holding" here is a vowel shape, not a note, and `comment.working.where.closedU` already says "hold its shape" in ratified English, so the "sustained, never held" ruling (`PRODUCT.md:964-968`) is read as not applying; Dann's to confirm.
- French: Il peut être intéressant de laisser la mâchoire descendre pour ouvrir la voyelle ici, en élevant votre première résonance jusqu’à la hauteur chantée; cela peut libérer le son, plutôt que de garder un /{vowel}/ fermé et serré dans cet aigu.
- Sources: « laisser la mâchoire descendre », `:1626` verbatim; « ouvrir », `:1627`; « garder », `comment.working.try.decrescendo.closer` (`:1632`); « fermé », `:1606`. COINED: « élever », « libérer », « serré ».
- Agreement: « fermé », « serré » agree with « /{vowel}/ » (masculine).

**S17**, key `watch.advice.maleTurnover`
- English, changed: `...; up this high the ring tends to come from letting it settle, not from pushing it wider.` Reason: "comes" states a mechanism as certain; "tends to" is `PRODUCT.md:244`'s own hedge. This one is the least certain proposal, because the sentence explains Bozeman's reason rather than promising an outcome.
- French: Il peut être intéressant de laisser le /{vowel}/ changer de timbre et se rassembler ici, plutôt que de l’ouvrir davantage pour obtenir plus de son; dans cet aigu, le mordant tend à venir de ce que vous le laissez se poser, et non de ce que vous l’élargissez.
- Sources: « changer de timbre », `comment.working.where.turnJustPast` (`:1607`); « ouvrir », `:1627`; « se poser », `:1528`. COINED: « se rassembler », « obtenir », « mordant », « élargir ».
- Agreement: « le », « l’ » refer to « le /{vowel}/ » (masculine).
- Dann's choice: "the ring" as « le mordant ». « l’éclat » is the other candidate.

COINED terms, 28 in all: transposer; ton, tierce, quarte, triton; do, ré, mi, fa, sol, la, si; relâcher, orienter, dégager; accepter, plus tournée vers la tête, forcer, clair; s’assombrir, option; élever, libérer, serré; se rassembler, obtenir, mordant, élargir.

## 4. How a build step would move them

Observations only:

- `t(key, lang)` takes a language and returns `[MISSING: key]` for an absent variant (`i18n.ts:1718-1722`). `hasString` exists for fallbacks (`i18n.ts:1725-1727`).
- `MarkupPane` has the language as a prop (`MarkupPane.svelte:108`) and a bound helper, `const T = (key: string) => t(key, language)` (`MarkupPane.svelte:372`). The band's markup, where `WATCH_HEADER` and `watchEntryLine(entry)` are called, is inside that component (`MarkupPane.svelte:1062-1066`).
- `watchlist.ts` imports nothing from `i18n` (`watchlist.ts:47-61`), and `watchEntryLine` takes only the entry (`watchlist.ts:540`).
- Two English strings are baked onto the entry before render: `advice` (`watchlist.ts:460`, from `advice-resolver.ts:379`, whose `copy` takes no language, `:88`) and `transpositionPhrase` (`watchlist.ts:491`). The entry already carries the parts the French lines need: `bar`, `vowel`, `word`, `rangeDirection`, `timbreDirection`, `kinds` (`watchlist.ts:136-177`).
- `packages/score-parser` imports nothing from the app's `i18n` (a grep of `packages/score-parser/src/*.ts` for `$lib` or `i18n` returns nothing). The structured values exist there before they become English: `semitones` on each candidate (`transposition.ts:372`) and the source `fifths` and `mode` (`transposition.ts:333-338`); `targetKey` and `intervalName` are the English strings built from them.
- Precedent in the tree for the same move: `InsightsPane.svelte:404-430` maps each watch kind to an `insights.finding.*` key and fills `{vowel}` with its local `fill` (`InsightsPane.svelte:122`).
- The English is pinned by tests: `watchlist.test.ts:260-332` asserts the header and five line shapes verbatim, including one advice string.

## 5. What could not be established

- **What N.82 contains beyond its one line.** Its only entries are `SCHEDULE.md:137`, `OPEN.md:332`, `:552`, `:597`, `SEQUENCE.md:32`, and `OWED.md:504`. No spec was found. Whether it includes the advice clauses and the transposition vocabulary, or only `watchEntryLine`'s own sentences, is NOT ESTABLISHED; this draft includes them because a French singer reads them on the band.
- **Whether N.82, N.130, and N.131 are one item.** `OPEN.md:597-599` says they "may be the same item three times". `OPEN.md:598` cites the header at `watchlist.ts:92`; it is now at `:102`.
- **Which French punctuation rule governs.** The brief and `ENVIRONMENT.md:2249-2254` (ruled 2026-08-21) say no space before `;` and `?`. Several later ratified strings use a narrow no-break space before them (`i18n.ts:1525`, `:1597`, `:1663` to `:1707`), and three use a plain space before `;` (`:1542`, `:1558`, `:1559`). This draft follows the brief. Whether the later strings are errors or a changed ruling is NOT ESTABLISHED.
- **Whether « tenu » in the Insights findings is owed a correction.** `insights.finding.tighten`, `turnover`, and `sustain` (`:1523`, `:1524`, `:1528`) say « tenu » / « tenez »; the « prolonger » ruling came a day after Insights' French was walked (`SCHEDULE.md:131`, `PRODUCT.md:968`). This draft uses « prolongé »; the Insights keys are outside N.82.
- **Whether PRODUCT.md's rules on how Insights speaks bind Markup.** The sections cited are written about Insights. The watch band is in Markup.
- **Bar versus measure, and slashes versus brackets.** The watch band says "Bar" and `/i/`; Insights says "measure" (`:1493`) and `[i]` (`InsightsPane.svelte:405`). No ruling on either was found. The English is kept as is.
- **The word's punctuation.** The watch band quotes the raw cell, so a word may render as « край, » with its comma. Insights strips it. Not a French question, but it shows in both languages.
- **Rendered length.** Whether the longer French lines fit the commentary page was not measured.
