# Lane 71: the five lines that are not yet ratified

Drafts by the Opus desk, 2026-11-19, for Dann to rule. Everything in sections 3, 4, and 5 of
`ratified-voice-type-stand-ins_2026-11-19.md` is already ratified and is not here.

The principle these follow is Dann's, ratified 10:08: a sentence never tells a singer the
values are their own type's when they are a neighbour's. In every case below the repair is to
stop naming the singer's type, because the page already names the staff the values came from.

Coined by the desk: nothing. Adopted: "placeholder" (Dann's ruled word, 2026-10-11 12:38),
« valeurs par défaut » (ruled 2026-10-11 19:42), and the phrasing of the ratified "Not sure"
line of 09:50.

## 1. MELODY's subtitle for "Not sure". English ratified 10:08, French owed

EN, as ratified: Resonance profile: an average of Ilya's five voice types, not yet your own
resonances.

FR, draft: « Profil de résonances : la moyenne des cinq types de voix d’Ilya, pas encore vos
propres résonances. »

Built from the ratified French of 09:52, « Ilya fait la moyenne de ses cinq types de voix »,
and the live `profile.subtitlePlaceholder` French (`i18n.ts:1487`). Desk's choice: « la
moyenne », definite, to match the ratified line, against the indefinite « une moyenne ».

## 2. INSIGHTS' lede for "Not sure". New, both languages

Live string, `insights.generic.lede` (`i18n.ts:1895`): "These findings use placeholder values
for a generic {voiceType}, not your specific voice."

EN, draft: These findings use an average of Ilya's five voice types, not your specific voice.

FR, draft: « Ces constats reposent sur la moyenne des cinq types de voix d’Ilya, et non sur
votre voix en particulier. »

Same shape as the live lede, with the ratified subtitle's phrase in place of the fill.

## 3. The Method endnote, three strings. Both languages

The repair strikes "for your voice type" from each. In `noScore.generic` it also puts
"placeholder" where the live string says "generic", which is the singer's ruled word.

`insights.method.generic.typed` (`i18n.ts:1897`)
EN draft: Method: computed from placeholder values, the voice characteristics you typed, and
the score as sung, including repeats.
FR draft: « Méthode : calculé à partir de valeurs par défaut, des caractéristiques vocales que
vous avez indiquées et de la partition telle que chantée, reprises comprises. »

`insights.method.generic.untyped` (`i18n.ts:1898`)
EN draft: Method: computed from placeholder values and the score as sung, including repeats.
FR draft: « Méthode : calculé à partir de valeurs par défaut et de la partition telle que
chantée, reprises comprises. »

`insights.method.noScore.generic` (`i18n.ts:1905`)
EN draft: Method: from placeholder values, until you record your own vowels.
FR draft: « Méthode : à partir de valeurs par défaut, jusqu’à ce que vous captiez vos propres
voyelles. »

## 4. The broad-analysis note. Both languages

`analysis.broad.body.generic` (`i18n.ts:1075`). Only the closing sentence changes.

EN draft: Broad analysis: this score is shown without {items}, because the matching voice
characteristics were left blank. The forecast uses placeholder values.

FR draft: « Analyse large : cette partition est présentée sans {items}, car les
caractéristiques vocales correspondantes ont été laissées vides. La prévision repose sur des
valeurs par défaut. »

## 5. The VOICE pane's line for "Not sure". Both languages

`calib.pane.notSure` (`i18n.ts:1434`). The live string says Ilya builds the profile from the
singer's own vowels, which stops being true the moment "Not sure" holds a starting profile.

EN draft: Without a declared voice type, Ilya averages its five voice types as a starting
point. This placeholder profile is unlikely to reflect your voice. Record your own vowels to
replace it.

FR draft: « Sans type de voix déclaré, Ilya fait la moyenne de ses cinq types de voix comme
point de départ. Ce profil par défaut a peu de chances de correspondre à votre voix. Captez
vos propres voyelles pour le remplacer. »

This is the ratified line of 09:50 with its last sentence changed, because that sentence sends
the singer to VOICE and this line is already in VOICE. Desk's choice: « Captez », the verb the
neighbouring pane lines use.

## What the desk did not draft

`calib.pane.typedGeneric` (`i18n.ts:1432`) keeps its ratified words and takes the borrowed
staff as its fill, so it needs no ruling. The three borrowed labels, the templated borrowing
line, the "Not sure" page line, the link, and the Guide passage are all ratified in the
ruling, English and French, and go in verbatim.

OQLF spacing: every « : » above carries a no-break space before it, as the live strings do.
