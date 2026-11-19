# Voice types with no published values: what Ilya borrows, and what it says

> **AMENDED by Dann 2026-11-19, 11:55 to 11:57.** Everything about "Not sure" in
> sections 2, 3, and 6 is WITHDRAWN. Read the last section of this file before any of it.

Ruled by Dann 2026-11-19, 09:38 to 09:43. This closes QUEUE row 167, which had been on the
after-release list; it comes forward because lane 71's blank states depend on it. His words
are transcribed as written.

## 1. The principle. RATIFIED 09:41

Dann 09:41: *"I must stres that we are not trying to hide anything, and that transparency is
paramount. We tell the user what Ilyua is doing and the functional concessions we make while
we wait for peer-reviewwed information"*

Applied, and it decided the wording twice: the concession is stated **on the page**, in the
line itself, never only behind a link. The desk's first draft put the reason one tap away
and Dann struck it.

Dann 09:38, the ruling that set the borrowings: *"I think we need to be honest with the
user. If a user chooses Contralto, use the mezzo values and say so / If a user chooses
Bass-baritone, use the bass values and say so / If a use chooses countertenor, use the
soprano values and say so. All with the acknowledgment that Ilya is in a contstant state of
evolution, and the field itself does not publish generic values for these voice types so
Ilya will not invent them, and the swaps I names as our closest defensible efforts to
include these voices."*

**One amendment to that list, offered by the desk and taken: countertenor stays on the
mezzo and tenor staff, not soprano.** Resonance follows the length and shape of the vocal
tract, not the range sung, and a countertenor's tract is an adult male's. Soprano staves
come from shorter female tracts. The code already maps him this way and calls it
"COUNTERTENOR BY THE TRACT: DESK INFERENCE" (`stand-ins.ts:55`). The caveat, recorded and
not built: a few male high voices do sit in female formant space, which is a reason to
re-sample rather than to move the staff.

Dann 09:39, on the fourth case: *"Yes a not sure should be invited to sample."*

## 2. What is already in the tree

`standInBucket` (`apps/web/src/lib/voice/engine/stand-ins.ts:58-66`) already maps every one
of the nine types: contralto and countertenor to `tenor-mezzo`, bass-baritone to `bass`,
"Not sure" and no type to `middle`, which `template` builds as the geometric middle of
Bozeman's five staves (`:91-96`).

What was missing is permission. `PLACEHOLDER_PROFILE_TYPES` (`:76`) lists five types whose
declared type alone may stand in for a voice that has sung nothing, and its comment says the
other four are "left out on purpose ... until row 167 rules their staves". **This ruling is
that ruling: all nine types join the list.**

Consequence, and the reason this blocks lane 71: with all nine holding a starting profile,
the voice test for the blank-state ask becomes what Dann said at 09:13, *"Melody/chant won't
work without the user's resonances or at least a generic profile that they select"*, with no
special case for four types.

## 3. The English. RATIFIED 09:43

**One string, two tokens, for contralto, countertenor, and bass-baritone.** Dann's own
construction, taken over the desk's three separate sentences, because it names who has not
published and because it holds when the list changes:

> The field has not yet published resonance values for a {type}, so Ilya is using its
> {borrowed} values until you sample your own vowels in VOICE.

Tokens: `{type}` is the singer's declared type; `{borrowed}` is the staff Ilya took, which is
"mezzo-soprano" for a contralto, "bass" for a bass-baritone, and "mezzo and tenor" for a
countertenor.

**"Not sure" keeps its own sentence**, since nothing is unpublished there. RATIFIED 09:50,
English and French together, after three rounds. It deliberately breaks the parallel with the
three borrowing lines: they defer quietly, this one says the profile is probably wrong about
the singer, because it is the weakest profile Ilya can build.

> Without a declared voice type, Ilya averages its five voice types as a starting point.
> This placeholder profile is unlikely to reflect your voice. Ilya will use your own vowels
> the moment you sample them in VOICE.

> « Sans type de voix déclaré, Ilya fait la moyenne de ses cinq types de voix comme point de
> départ. Ce profil par défaut a peu de chances de correspondre à votre voix. Ilya utilisera
> vos propres voyelles dès que vous les échantillonnerez dans VOIX. »

Three of Dann's own words were struck in the drafting, each for a reason he took: "all voice
types", because the code averages five staves and there are nine types (`stand-ins.ts:91-96`);
"synthetic profile", because the singer's ruled word for these values is "placeholder"
(`stand-ins.ts:71-72`); and "You are urged to sample", because a bare imperative implies the
singer erred by answering "Not sure", which he had just ruled a valid answer. The last
sentence puts the obligation on Ilya rather than on the singer (Dann 09:50: *"Howe can we
soften this so the user retains their agency?"*).

Both lines end with the link **"Why these values"**, which adds depth and does not hold the
disclosure.

## 4. The Guide passage. RATIFIED 09:42 as redrafted

Dann struck the desk's first sentence at 09:42 (*"This sentence parses poorly"*): it
garden-pathed on "a voice it has not heard from", and the passage drifted between "the
singer" and "you".

> When Ilya has not yet heard your voice, it starts from published resonance values for your
> voice type. For contralto, countertenor, and bass-baritone there are none. Nineteen
> sources were read in full, and none gives them. Ilya will not invent them. It borrows
> instead from the nearest voice it can defend, and says so on the page every time:
> mezzo-soprano for a contralto, bass for a bass-baritone, and the mezzo and tenor staff for
> a countertenor, because resonance follows the length of the tract rather than the range
> sung. If you have not named a type, Ilya starts from the middle of its five staves. These
> are working concessions, not findings. Every borrowed value is marked as a stand-in, every
> one is replaced the moment you sample that vowel yourself, and each will give way to
> measured values when peer-reviewed ones are published.

The countertenor's tract reason lives here and not in the line, so the line can stay one
templated string. The disclosure is still on the page; only the acoustics are one tap away.

**"Nineteen sources were read in full"** is the two rounds of 2026-11-16 (`STATE.md`,
2026-11-16 evening close). Kept deliberately, with its cost named to Dann: it dates the
passage and someone changes the number when the twentieth is read. A count is what makes the
claim checkable.

## 5. The rest of the French. RATIFIED 09:52

The "Not sure" line is ratified above, in both languages. Three items were put to him as a sheet
at 09:47 and ratified at 09:52 ("yes"), with the desk's own choices named to him before he
ruled:

- The templated line: « La recherche n’a pas encore publié de valeurs de résonance pour un
  {type}. Ilya utilise donc ses valeurs de {borrowed} jusqu’à ce que vous échantillonniez vos
  propres voyelles dans VOIX. » Two sentences where the English has one. Desk’s choice:
  « La recherche » for "the field", against the calque « le domaine ».
- The link: « Pourquoi ces valeurs »
- The three fills for `{borrowed}`: « mezzo-soprano », « basse », « mezzo et ténor ».
- The Guide passage, in full:

> « Tant qu’Ilya n’a pas entendu votre voix, il part des valeurs de résonance publiées pour
> votre type de voix. Pour le contralto, le contre-ténor et le baryton-basse, il n’en existe
> aucune. Dix-neuf sources ont été lues intégralement, et aucune ne les donne. Ilya ne les
> inventera pas. Il emprunte plutôt à la voix la plus proche qu’il puisse défendre, et le dit
> sur la page chaque fois : mezzo-soprano pour un contralto, basse pour un baryton-basse, et
> la portée mezzo et ténor pour un contre-ténor, car la résonance suit la longueur du tractus
> vocal plutôt que l’étendue chantée. Si vous n’avez indiqué aucun type, Ilya part du milieu
> de ses cinq portées. Ce sont des concessions de travail, et non des constats. Chaque valeur
> empruntée est signalée comme valeur par défaut, chacune est remplacée dès que vous
> échantillonnez vous-même la voyelle, et toutes céderont la place à des valeurs mesurées
> lorsque des valeurs évaluées par les pairs seront publiées. »

  Desk’s choices, named to him before he ruled: « portée » for Bozeman’s staff,
  « évaluées par les pairs » for peer-reviewed, and « tractus vocal » adopted from the
  Guide’s existing French.

The template holds in French, because contralto, contre-ténor, and baryton-basse are all
masculine and the borrowed name sits behind « de » (« ses valeurs de mezzo-soprano »).

## 6. What the six sentences say once the gate opens. RATIFIED 10:08

Found by Fable's delta review of the lane 71 brief r2, and confirmed by the desk's own read:
widening the list makes six already-ratified sentences claim the borrowed values belong to
the singer's own type. `markup/subtitle.ts:11-12` fills `profile.subtitlePlaceholder`
(`i18n.ts:1487`, "placeholder values for a generic {voiceType}") with the declared type
whenever the values are placeholders, and `insights/identity.ts:50-52` does the same for
`insights.generic.lede` (`i18n.ts:1895`). So a contralto with a score would read
**"placeholder values for a generic contralto"**, which is the sentence section 1's ruling
exists to prevent. For "Not sure" it is worse: `voiceTypePrint` returns nothing
(`insights/identity.ts:55`), so the subtitle falls through to "a map of your voice's
resonances" over the averaged profile that section 3's own line calls unlikely to reflect the
singer's voice.

**The principle, ratified 10:08: a sentence never tells a singer the values are their own
type's when they are a neighbour's.** Applied:

- For a borrowing type, the fill is **the staff the values came from**, not the declared
  type: "Resonance profile: placeholder values for a generic mezzo-soprano, not yet your own
  resonances." The method line on the same page carries the why, so the two agree and neither
  pretends.
- **"Not sure" takes its own sentence**, since the fill would read "a generic average of
  Ilya's five voice types": "Resonance profile: an average of Ilya's five voice types, not
  yet your own resonances."

The same principle governs the other sites Fable listed (`insights/singer-blocks.ts:337`,
`insights/identity.ts:68-69`, `analysis/analyze-score-adapter.ts:195`, and the VOICE pane's
`components/Drawer/voice-pane.ts:43`). The lane applies it to each and brings back any that
resist it. French owed for the two sentences above.

## 7. The lane order this forced

Row 167 came out of the blank-states brief and goes first, as its own lane, because it
reaches six ratified sentences across three surfaces and because the blank states' voice test
depends on it. Blank states follow. DESK DEFAULT, 2026-11-19 10:08.

**Also ruled 10:08, DESK DEFAULT:** MELODY with a score and no voice keeps drawing the score
and gains the voice ask beside its withheld statement (`markup/MarkupPane.svelte:831`,
`:1015`). Taking a drawn score away to show a squircle would be a worse page than the one
there now.

---

## 8. AMENDMENT: "Not sure" takes no profile. Ruled by Dann 2026-11-19, 11:55 to 11:57

His words, transcribed as written:

> *"If a user is not sure, we should be offering them the generic voice types but also telling
> tham its okaty that they are not sure, and that the sampels they provide may cgive them more
> information in their search process"*

> *"I reject this now: \"Ilya averages its five voice types as a starting point.\": this is a
> bad idea"*

> *"No average. / I don't know is a valiud response / But encouraging personal samples is the
> best / next after that is using a proven generic voice type / I think math csorcery is the
> wrong answer. Human voices don't align that way"*

**What it changes.**

1. `PLACEHOLDER_PROFILE_TYPES` widens to **eight**, not nine: the five published types plus
   contralto, countertenor, and bass-baritone. `not-sure` stays out. A singer who is not sure
   gets no starting profile, as before this ruling.
2. The "Not sure" line ratified at 09:50, and section 6's "an average of Ilya's five voice
   types" subtitle sentence ratified at 10:08, are WITHDRAWN and go nowhere near the tree.
3. Section 6's "Not sure" case disappears with them: with no profile, `generic` is false
   (`voice/engine/resolve-values.ts:154`), so MELODY's subtitle falls through and INSIGHTS'
   lede returns null (`markup/subtitle.ts:11`, `insights/identity.ts:52`). Nothing to repair.
4. The order Ilya encourages, in his words: **personal samples first, a proven generic voice
   type next, and "I don't know" remains a valid answer that costs the singer nothing.**
5. A singer who is not sure is told that their own samples are information they can use in
   their own search for their type. Ilya does not claim to name the type.

**Why the average was rejected, his reason, which outranks the desk's arithmetic:** human
voices do not align that way. A geometric mean of five band centres corresponds to no vocal
tract, whatever its distance in hertz from any one staff.

**What the desk had measured, recorded because it was put to him and did not decide it:** the
middle sits 0.7 to 2.1 semitones from each staff on average and beats a wrong forced pick for
all four, while each published band is about 5 semitones wide (`voice/engine/plausibility.ts:50`,
centres as `stand-ins.ts:91` takes them). Dann ruled against the average notwithstanding, on
the ground above.

**What this does NOT change:** sections 1, 4, 5, and 7 stand as ratified, and so does every
part of sections 2, 3, and 6 that governs contralto, countertenor, and bass-baritone.

### The "Not sure" line. RATIFIED by Dann 2026-11-19 11:59 ("Ratified"), English and French

Replaces `calib.pane.notSure` (`i18n.ts:1434`), whose live text says Ilya builds the profile
from the singer's own vowels and offers no type.

> Not knowing is a fine answer. Record your vowels in vocal fry and Ilya works from your own
> voice, which also gives you evidence in your own search. Or choose a voice type, and Ilya
> starts from published values for it.

> « Ne pas savoir est une réponse valable. Captez vos voyelles en friture vocale et Ilya
> travaille à partir de votre propre voix, ce qui vous donne aussi des indices dans votre
> propre recherche. Ou choisissez un type de voix, et Ilya part de valeurs publiées pour
> celui-ci. »

Desk's choices, named to him before he ruled: « des indices » for "evidence", against the
forensic « preuves » and the empty « éléments »; « réponse valable » for "a fine answer"; and
"evidence in your own search" in place of naming the voice type, so Ilya never implies it can
tell a singer what they are.

The control the last sentence points at is already on the screen: the VOICE pane draws
`VoiceTypeIntake` in its own station (`components/Drawer/VoicePane.svelte:85`). No new control.
