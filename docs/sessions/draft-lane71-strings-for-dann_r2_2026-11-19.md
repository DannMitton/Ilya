# Lane 71: the seven lines that are not yet ratified

Drafts by the Opus desk, 2026-11-19, r2, for Dann to rule. r1 held five; Fable's review of
brief r1 (blocker 4) added items 6 and 7, both ratified strings that reach the voice type
without passing through `AdaptedProfile.generic`.

Everything in sections 3, 4, and 5 of `ratified-voice-type-stand-ins_2026-11-19.md` is already
ratified and is not here.

The principle, Dann's, ratified 10:08: a sentence never tells a singer the values are their
own type's when they are a neighbour's. Items 1 to 5 strike "for your voice type", because the
page already names the staff the values came from. Items 6 and 7 put the ratified `{borrowed}`
token where the false claim was.

Coined by the desk: nothing. Adopted: "placeholder" (Dann 2026-10-11 12:38), « valeurs par
défaut » (2026-10-11 19:42), « portée » for Bozeman's staff and « ses valeurs de {borrowed} »
(both ratified 2026-11-19 09:52).

## 1. MELODY's subtitle for "Not sure". English ratified 10:08, French owed

EN, ratified: Resonance profile: an average of Ilya's five voice types, not yet your own
resonances.

FR, draft: « Profil de résonances : la moyenne des cinq types de voix d’Ilya, pas encore vos
propres résonances. »

Desk's choice: « la moyenne », definite, matching the ratified « Ilya fait la moyenne de ses
cinq types de voix ».

## 2. INSIGHTS' lede for "Not sure". New, both languages

Live (`i18n.ts:1895`): "These findings use placeholder values for a generic {voiceType}, not
your specific voice."

EN draft: These findings use an average of Ilya's five voice types, not your specific voice.

FR draft: « Ces constats reposent sur la moyenne des cinq types de voix d’Ilya, et non sur
votre voix en particulier. »

## 3. The Method endnote, three strings. Both languages

Strikes "for your voice type". In `noScore.generic` it also puts "placeholder" where the live
string says "generic", which is the singer's ruled word.

`insights.method.generic.typed` (`i18n.ts:1897`)
EN: Method: computed from placeholder values, the voice characteristics you typed, and the
score as sung, including repeats.
FR: « Méthode : calculé à partir de valeurs par défaut, des caractéristiques vocales que vous
avez indiquées et de la partition telle que chantée, reprises comprises. »

`insights.method.generic.untyped` (`i18n.ts:1898`)
EN: Method: computed from placeholder values and the score as sung, including repeats.
FR: « Méthode : calculé à partir de valeurs par défaut et de la partition telle que chantée,
reprises comprises. »

`insights.method.noScore.generic` (`i18n.ts:1905`)
EN: Method: from placeholder values, until you record your own vowels.
FR: « Méthode : à partir de valeurs par défaut, jusqu’à ce que vous captiez vos propres
voyelles. »

## 4. The broad-analysis note. Both languages

`analysis.broad.body.generic` (`i18n.ts:1075`). Only the closing sentence changes.

EN: Broad analysis: this score is shown without {items}, because the matching voice
characteristics were left blank. The forecast uses placeholder values.

FR: « Analyse large : cette partition est présentée sans {items}, car les caractéristiques
vocales correspondantes ont été laissées vides. La prévision repose sur des valeurs par
défaut. »

## 5. The VOICE pane's line for "Not sure". Both languages

`calib.pane.notSure` (`i18n.ts:1434`). The live string says Ilya builds the profile from the
singer's own vowels, which stops being true the moment "Not sure" holds a starting profile.

EN: Without a declared voice type, Ilya averages its five voice types as a starting point.
This placeholder profile is unlikely to reflect your voice. Record your own vowels to replace
it.

FR: « Sans type de voix déclaré, Ilya fait la moyenne de ses cinq types de voix comme point de
départ. Ce profil par défaut a peu de chances de correspondre à votre voix. Captez vos propres
voyelles pour le remplacer. »

The ratified line of 09:50 with its last sentence changed, because that sentence sends the
singer to VOICE and this line is already in VOICE.

## 6. The vowel space sheet's sources note. Both languages

`sheet.provenance` (`i18n.ts:2569`), drawn at `voice/chart/VowelSpaceSheet.svelte:163`. Today
the sheet's door is closed to the four types; lane 71 opens it
(`components/Drawer/voice-pane.ts:81-83`). One clause changes.

EN, live: ... and Mitton (2020), Table 5.3, scaled to your voice type, for the second.
EN draft: ... and Mitton (2020), Table 5.3, scaled to the {borrowed} staff, for the second.

FR, live: « ... et Mitton (2020), tableau 5.3, ajusté à votre type de voix, pour la
deuxième. »
FR draft: « ... et Mitton (2020), tableau 5.3, ajusté à la portée de {borrowed}, pour la
deuxième. »

Desk's choice, named: « la portée de {borrowed} », with « de », against the ratified Guide
passage's « la portée mezzo et ténor », which has none. « la portée basse » without it reads
as "the low staff".

## 7. The capture screen's placement hint. Both languages. LIVE TODAY

`capture.hint.placed.typed` (`i18n.ts:2619`), chosen at `voice/chart/screen-logic.ts:63` when
`hasDeclaredType` is true (`:30`: any type but "Not sure"), drawn at
`voice/VowelCapture.svelte:220`.

This one is false on Ilya now, before any part of this lane runs. A contralto, countertenor, or
bass-baritone who has not reached five stable core vowels has every missing resonance filled
from the borrowed staff: `stand-ins.ts:147` takes `standInBucket(voiceType)` whenever the voice
is not personal, `:58` sends contralto and countertenor to the mezzo and tenor staff and
bass-baritone to bass, and `:153` and `:158` fill from that shape.

EN, live: Ilya has placed {v} from your voice type for now. Its placeholder moves as you
record.
EN draft: Ilya has placed {v} from its {borrowed} values for now. Its placeholder moves as you
record.

FR, live: « Ilya a placé {v} d’après votre type de voix, pour l’instant. Sa valeur par défaut
évolue à mesure que vous captez vos voyelles. »
FR draft: « Ilya a placé {v} d’après ses valeurs de {borrowed}, pour l’instant. Sa valeur par
défaut évolue à mesure que vous captez vos voyelles. »

Both reuse the construction ratified at 09:43 and 09:52, so a singer reads one phrase for the
borrowing everywhere.

## One reading to judge, not a line to ratify

Your ratified `{borrowed}` fill for a countertenor is "mezzo and tenor". Dropped into the four
live strings it reads: "placeholder values for a generic mezzo and tenor"; "from generic values
for a mezzo and tenor voice"; "turns in a generic mezzo and tenor"; « une voix type de mezzo et
ténor ». The ruling ratified the phrase inside "its {borrowed} values", where it reads cleanly.
Flagged by Fable (amendment 15); it is taste, so it is yours.

## What needs no ruling

`calib.pane.typedGeneric` (`i18n.ts:1432`) keeps its ratified words and takes the borrowed
staff as its fill. The three borrowed labels, the templated borrowing line, the "Not sure" page
line, the link, and the Guide passage are ratified, English and French, and go in verbatim.

OQLF spacing: every « : » carries a no-break space before it, as the live strings do.
