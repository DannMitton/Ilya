# Brief, lane 77: the capture wizard says what it is asking for

r4, 2026-11-21 20:0x, by the Opus desk. Supersedes r1, r2, and r3. r4 applies every blocker and all thirteen amendments of `review-fable-brief-lane77_r1_2026-11-21.md` (Fable, DO NOT SEND on r3), carries Dann's two ratified published-profile sentences of 19:49, and adds section 6A, the replacements the desk DERIVED from his already-ratified wording for the eight other sentences that count. **Nothing in r4 is owed to Dann.** Branch `cloud-lane-77`, cut from the BUILT HEAD of `cloud-lane-76`, never from `Shane` (77-A1). If `cloud-lane-76` is still at `ac4bc6d8` it has no lane commit: stop and report. Step 3 hangs on a function lane 76 adds, and two of step 6's tests fail on `Shane`, where `voice/engine/sung.ts:40` is still `PERSONAL_CORE_MIN = 5` and [a] is still worked out (`voice/engine/derivations.ts:34`, `voice/engine/resolve-values.ts:130`) (77-B3).

**This lane runs after lane 76 and merges with it.** Lane 76 is built and held because it makes six sentences on a singer's page untrue (`brief-code-lane76-threshold-and-no-borrowing_r3_2026-11-21.md`, section 0, which lists every sentence it makes untrue) (77-A2); this lane and the wording round are what release it.

**It supersedes a draft of 2026-11-20 titled "asks for six, and offers four", now in `_to_delete/`.** That draft was built on a desk reading Dann struck at 2026-11-21 01:27: the asked-for set is **seven** and the synthesized set is **three**. See `docs/memory/OPEN.md`, "THE FILL RULE", whose head carries the striking.

**Strings: RATIFIED 2026-11-21 19:21 to 19:23 and listed verbatim in section 6.** The wording round is closed; this lane no longer waits on anything of Dann's. Code takes every string as written, in both languages, and writes none of its own.

## 1. What this is for, from where the singer stands

A singer opens the capture wizard and is asked for ten vowels. Nothing on the screen tells her which of them a profile needs, which Ilya can work out from her own voice, or that the whole ten are open to her if she wants them. She reported this herself.

Dann, 2026-11-20 01:20, transcribed as written: *"Good. I think we need to make it clear why this order, how Ilya's wizard is meant to curate the six needed vowels, and that users can complete the whole set if they want to. That wasn't clear to me when I used the intake wizard; i just took manual control when it skipped a button in the row"*.

**The lists are already right.** `CalibrationWizard.svelte:103-105` holds `DEFAULT_VOWELS` as the seven, [i], [e], [ɛ], [a], [ɑ], [o], [u], and `CHALLENGING_VOWELS` as the three, [ɨ], [ɪ], [ʌ], and that is the ruled grouping. **Nothing in this lane regroups a vowel.** What it builds is the saying: the screen names what it is asking for and why, names what is still missing instead of counting, says out loud when it steps past a vowel already sung, invites a retake when a second resonance will not hold, and gives one tap back to the published profile.

## 2. The rulings this carries out

- **The grouping, as it now stands:** asked for, the seven; synthesized and marked, the three, [ɨ] with a wider uncertainty and [ɪ] and [ʌ] with the plain mark (Dann 2026-11-20 02:15, amending the desk's fill rule of 01:47 at its [ɨ] row alone). **[a] is asked for and never filled** (`OPEN.md`, the fill rule's table: nothing of her own bounds it).
- **The threshold is six core vowels** (Dann 2026-11-20 00:51), which is not the same set as the seven asked for. **A singer who sings the six core and skips [a] has a complete profile with [a] empty, and the screen has to say so rather than imply she is unfinished.** Named here so the lane handles it.
- **Dann 2026-11-20 01:11, COMPLETENESS IS NEVER A COUNT.** Seven samples can be further from complete than five. **No sentence a singer reads counts her samples toward a target; sentences name the vowels still needed.**
- **Dann 2026-11-20 01:21**, ratified, for each synthesized vowel: *"Ilya worked your {x} out from your own {y} and {z}. Sing {x} yourself if you would rather."*
- **Dann 2026-11-20 01:03**: a sung vowel whose second resonance could not be measured gets an invitation to sing it again, and nothing filled.
- **Dann 2026-11-20 00:58 and 01:05**: the published profile is a standing choice, not a fallback, legitimate at any moment including after she has sampled, by one tap, naming the staff it would use.

## 3. The tree as it stands, every line read by the desk on `47bd5c5c`, 2026-11-20

**Re-check every citation in this section against `ac4bc6d8` before relying on it.** Three commits have landed on `Shane` since `47bd5c5c`, so a line number here may have moved. The claims are the desk's reading of 2026-11-20; the tree wins.

- `voice/CalibrationWizard.svelte:103-105`: the two lists, already the seven and the three. The comment at `:95-102` records Dann's 2026-08-04 ruling that **none of the ten is optional**, and that the three are "simply the hardest for a new singer to produce on demand". That ruling stands.
- `voice/chart/tour.ts:10-12`: `TOUR_SEVEN`, `TOUR_HARDEST`, `TOUR_ORDER`, the same grouping a second time. `voice/chart/opening.ts:21`: `openChallenging` opens on the first of `TOUR_HARDEST`. `voice/chart/tour.test.ts:7-9` pins all three lists. **Leave every one of them as it is.** They are named so no step touches them by accident.
- `tour.ts:22-38`, `nextVowel`: it walks `TOUR_ORDER` from where she is, wrapping, taking the seven before the three, and **steps over a vowel that already has a reading with nothing said**. On a first walk it also passes two unsung buttons, [ɪ] and [ɨ], between [e] and [ɛ], because the row and the tour are ordered differently. **Which of the two skips Dann met at 01:20 is NOT ESTABLISHED;** 6.2 and 6.4 answer the first, and 6.5 answers the second and never draws for the first (77-A4). Neither is a fault; the repair is to make the step legible, not to change the stepping.
- **Added by 77-A3, read on `ac4bc6d8`:** `voice/VowelCapture.svelte:158` calls `nextVowel`; `:297` draws `capture.count`; `:338` draws the row in `VOWELS` order (`voice/engine/types.ts:26`), which is not `TOUR_ORDER`. `voice/chart/screen-logic.ts:52-69` composes the hint line. `git diff --stat 47bd5c5c ac4bc6d8 -- apps packages` is empty, so no cited line moved.
- `i18n.ts:1437-1438`, `calib.pane.fills` and `calib.pane.fillsOne`: "You have recorded {n} of the 10 vowels. Ilya fills the other {m} from what you have recorded so far." **This counts her samples toward ten, which his rule of 01:11 forbids.** (77-A8 struck the rest; section 6.10 bans "synthesizes".) **But these are not the live keys:** `components/Drawer/voice-pane.ts:62` reaches `calib.pane.fills` only in state `some-fills`, and lane 76 makes the kind `'work-out'` for every profile, so after lane 76 the live pair is `calib.pane.worksOut` and `calib.pane.worksOutOne` (`i18n.ts:1447-1448`); `voice-pane.ts:61` computes `m = 10 - i.usable`, counting [a] (77-B1).

## 4. The steps

### Step 1, the screen says what it is asking for

At the start, name the asked-for seven as the set the wizard walks, and name the three as ones Ilya can work out from her own vowels if she would rather not sing them. Say which vowels a profile needs (the six core) where that differs from the seven asked for, **without counting anything toward a target**.

**Change no list.** If you find yourself editing `DEFAULT_VOWELS`, `CHALLENGING_VOWELS`, `TOUR_SEVEN`, `TOUR_HARDEST`, or `TOUR_ORDER`, stop: that is the struck design.

### Step 2, the step past a vowel she has already sung is said out loud

When `nextVowel` steps over a vowel that already has a reading, the screen says so, and the row shows what is already in, so the skip is legible before it happens. **Do not change the stepping.** **{sung} is the vowels of `TOUR_ORDER` with a reading that lie between the vowel she finished and the one `nextVowel` returns, through `vowelList` (`voice/chart/finish-early.ts:45-52`). With none, the sentence does not draw. Compute it beside `nextVowel`; change nothing inside it.** (77-A5)

### Step 3, the retake invitation

For a sung vowel whose second resonance will not hold, invite her to sing it again. **Hang this on the function lane 76 adds** (that brief's step 3). Build no second test of your own. Nothing is filled for that resonance; the take still stands and is still used for its own vowel; the invitation does not block her and does not demote the reading.

### Step 4, one tap back to the published profile

On the page where she meets the gap, one tap returns her to the published profile for her voice type, naming the staff it would use. It is a standing choice, **not a fallback and not an error path**: her own samples are kept, not discarded, and she can leave again.

**This needs an engine switch, because `generic` requires nothing sung** (`voice/engine/resolve-values.ts:155`, verified: `const generic = !anySung && hasPlaceholderProfile(voiceType);`). Add it here, not in lane 76 (lane 76 r3 line 130: "do not add an engine switch for it").

**THE CONTRACT LINE, owed and here (77-A12, `CONTRACT.md` section 4).** This lane DOES change how a number is computed: the switch changes which first and second resonance every page computes from for a singer who has sung. **These sites each decide "her own or published" from the formants alone, and nothing but their agreement keeps one page showing her values beside another showing the staff's. Every one of them reads the switch:** `voice/engine/resolve-values.ts:154-157`; `voice/engine/sung.ts:41`; `components/Drawer/voice-pane.ts:38-40`; `analysis/placeholder-line.ts:74` and `:113`; `markup/profile-status.ts:39`; `voice/VowelCapture.svelte:282`; `voice/chart/finish-early.ts:36-38`.

**Three things r3 left unsaid, settled as DESK DEFAULTS.** (1) **The choice is not written to the stored profile** (lane 76 r3 line 129); it lives in session state, because a stored field is hard to take back. (2) **The control draws only when `hasPlaceholderProfile(voiceType)` is true**, so a singer who answered "Not sure" or named no type never meets it (`voice/engine/stand-ins.ts:92-94`; `resolve-values.ts:151-152`). (3) **It is one two-state button**, so no second label is needed for leaving it (77-B5).

### Step 5, the sentences that count

Replace **`calib.pane.worksOut` and `calib.pane.worksOutOne`** (`i18n.ts:1447-1448`), the keys `voice-pane.ts:62` reaches after lane 76, with the two strings of section 6.8. **Mark `calib.pane.fills` and `calib.pane.fillsOne` UNUSED in place**, with their ratified French, as this file's other retired strings are. `voice-pane.ts:61-63` stops computing {n} and {m}. (77-A7, 77-B1) **The verb is "works out" and « déduit », never "fills" and never "synthesizes"** (section 6.10). An earlier revision of this brief asked for "synthesizes" here; that is struck, because the word never reaches a singer. **Check the whole of `i18n.ts` for any other sentence that counts a singer's samples toward a target, and list every one you find, in both languages, whether or not you change it.**

### Step 6, the tests

- A vowel already sung is stepped past with the step said.
- A sung vowel with no steady second resonance draws the invitation and is still used for its own vowel.
- The one tap returns to the published profile and keeps her samples.
- No string a singer reads counts her samples toward ten.
- A singer with the six core sung and [a] not sung reads that her profile is complete, with [a] named as empty.
- **A test that the five vowel lists are unchanged.** `DEFAULT_VOWELS` and `CHALLENGING_VOWELS` are unexported constants in a component (`voice/CalibrationWizard.svelte:103-104`), so pin them by reading the file's text; `voice/chart/tour.test.ts:7-9` already pins the other three. **Do not export or move them.** (77-A10)
- **A test for each of section 6A's replacements**, that no key a singer can reach carries {n} of a fixed total.
- **A test that 6.1 draws for each of [ɨ], [ɪ], and [ʌ] wherever a worked-out value appears** (77-B8).

## 5. What must not change

- **None of the ten vowels is optional** (Dann 2026-08-04). No identifier or string may say otherwise.
- The seven and the three stay as they are.
- A sung reading is never displaced, demoted, or discarded.
- The Text view's transcription and its directional arrows are untouched (Dann 2026-10-29 01:23).
- `ONE VOWEL PER NOTE` (`CONTRACT.md` §0.1) is untouched and nothing may weaken it.

## 6. The strings, RATIFIED. Take them verbatim

**The wording round closed 2026-11-21 19:21 to 19:23.** Dann ratified the English and ruled the French. Record: `draft-lane77-strings_r2_2026-11-21.md` (md5 `f4069863`). **Code writes none of these and changes none of them, in either language.** Key names are DESK DEFAULTS; use them unless one collides, and report any collision rather than renaming silently.

Place a no-break space before « : » in any French string that takes a colon (OQLF). **The French in this brief is typed with ASCII apostrophes; write U+2019 in `i18n.ts`, as every other French string there does** (77-A11).

### 6.1 `calib.vowel.workedOut` (the mark on each of the three)

ENGLISH RATIFIED BY DANN 2026-11-20 01:21.

- en: Ilya worked your {x} out from your own {y} and {z}. Sing {x} yourself if you would rather.
- fr: Ilya a déduit votre {x} de vos propres {y} et {z}. Chantez {x} vous-même si vous préférez.

The French repeats the symbol rather than taking a pronoun, so it needs no agreement. The withdrawn one-anchor inflection for [a] is not built: [a] is asked for and never worked out.

### 6.2 `calib.wizard.opening`

- en: Ilya asks you to sing [i], [e], [ɛ], [a], [ɑ], [o], and [u]. Your resonance profile rests on [i], [e], [ɛ], [ɑ], [o], and [u]. Sing those vowels and every value on your pages starts from your own measurements.
- fr: Ilya vous demande de chanter [i], [e], [ɛ], [a], [ɑ], [o] et [u]. Votre profil de résonances repose sur [i], [e], [ɛ], [ɑ], [o] et [u]. Chantez ces voyelles et chaque valeur de vos pages part de vos propres mesures.

**The closing clause changed in r4, DESK DEFAULT.** r3 ended "Ilya reads your voice from your voice alone", which `OPEN.md` forbids: a vowel Ilya works out reaches its value by a published proportion applied to her measurements, "never compressed back into 'hers'". The clause above is true both for a singer who sings the seven and for one who sings all ten.

The two sets are listed and never numbered. Do not add a count to this string for any reason.

### 6.3 `calib.wizard.stillWanted` and `calib.wizard.stillWantedOne`

- en (both keys): Ilya has not heard your {vowels} yet.
- fr, `stillWanted`: Ilya n'a pas encore entendu vos voyelles {vowels}.
- fr, `stillWantedOne`: Ilya n'a pas encore entendu votre voyelle {vowels}.

English is identical in both keys; French differs in number. **{vowels} is the members of `TOUR_SEVEN` for which `isSung` is false, in tour order, through `vowelList` (`voice/chart/finish-early.ts:45-52`); a vowel she sang is never listed, whatever its stability.** This replaces `capture.count` at `voice/VowelCapture.svelte:297`. (77-A6)

### 6.4 `calib.wizard.offerThree`

ENGLISH DANN'S OWN WORDS, 2026-11-21 19:21.

- en: Ilya can work your [ɨ], [ɪ], and [ʌ] out from the other vowels you sing. Sing them yourself if you would rather.
- fr: Ilya peut déduire vos voyelles [ɨ], [ɪ] et [ʌ] des autres voyelles que vous chantez. Chantez-les vous-même si vous préférez.

### 6.5 `calib.wizard.steppedPast`

- en: You have sung {sung} already, so Ilya moves on to {next}.
- fr: Vous avez déjà chanté {sung}; Ilya passe à {next}.

### 6.6 `calib.wizard.retake`

SECOND SENTENCE PAIR DANN'S OWN WORDS, 2026-11-21 19:21.

- en: Ilya could not hear a steady second resonance in your {vowel}. Sing it again when you would like to. Your sample still stands, and Ilya can still use it without a replacement sample.
- fr: Ilya n'a pas entendu de deuxième résonance stable dans votre voyelle {vowel}. Chantez-la de nouveau si vous le souhaitez. Votre échantillon reste valable, et Ilya peut encore s'en servir sans échantillon de remplacement.

The invitation never blocks her, never demotes the reading, and never discards it (section 5).

### 6.7 `calib.published.control` and `calib.published.sentence`

ENGLISH DANN'S OWN WORDS, 2026-11-21 19:21. FRENCH VERB RULED BY HIM 19:23 (« aborder », over « considérer »).

**TWO SENTENCES, RULED BY DANN 19:49** (*"Yes this ia a fine price: That costs one extra string and leaves no singer reading something untrue"*). r3's single sentence contradicted the ratified `voiceType.borrowing` (`i18n.ts:2265`) for the three borrowing types, which tells a contralto the field has published nothing for her (77-B6). **"Scaled" is gone from both:** the declared type's values are unscaled (`voice/engine/resolve-values.ts:145-146`, `stand-ins.ts:24-26`); only the second-resonance template is scaled (`stand-ins.ts:14-17`).

- en, control: Use published values
- fr, control: Utiliser les valeurs publiées

**`calib.published.sentence`, for the five types the field publishes** (`borrowedStaffLabel` returns the type's own name, `voice/voiceTypes.ts:129`):

- en: Ilya would consider your voice from the published values for a {type} voice. Everything you have sung is kept, and you can re-sample it at any time.
- fr: Ilya aborderait votre voix à partir des valeurs publiées pour une voix de {type}. Tout ce que vous avez chanté est conservé, et vous pouvez l'échantillonner de nouveau à tout moment.

**`calib.published.sentence.borrowed`, for contralto, countertenor, and bass-baritone** (`voice/voiceTypes.ts:104-108`, `:126-130`). Its first sentence is Dann's own ratified wording from `voiceType.borrowing`, word for word, so Ilya says it the same way everywhere:

- en: The field has not yet published resonance values for a {type}. Ilya would consider your voice from its {borrowed} values instead. Everything you have sung is kept, and you can re-sample it at any time.
- fr: La recherche n'a pas encore publié de valeurs de résonance pour un {type}. Ilya aborderait donc votre voix à partir de ses valeurs de {borrowed}. Tout ce que vous avez chanté est conservé, et vous pouvez l'échantillonner de nouveau à tout moment.

{type} and {borrowed} are the two tokens of `placeholder.borrowing` (`i18n.ts:2052`): {type} the Tier 1 name through `voiceTypePrint` (`voiceTypes.ts:82`), {borrowed} the staff through `borrowedStaffLabel` (`:126`), both filled by `fillVoiceType` (`:157`). No string on this path names an error or a fallback.

### 6.8 The replacements for `calib.pane.fills` and `calib.pane.fillsOne`

Keep the two key names. Remove the {n} and {m} tokens from both.

- en (both keys): Ilya works your {vowels} out from the vowels you have sung.
- fr, `fills`: Ilya déduit vos voyelles {vowels} des voyelles que vous avez chantées.
- fr, `fillsOne`: Ilya déduit votre voyelle {vowels} des voyelles que vous avez chantées.

### 6.9 `calib.pane.completeAEmpty`

ENGLISH DANN'S OWN WORDS, 2026-11-21 19:21, including the order: the gap first, the completeness second.

- en: Ilya has not heard your [a] yet, and it stays empty until you sing it. Otherwise, your resonance profile is complete.
- fr: Ilya n'a pas encore entendu votre voyelle [a]; elle reste vide jusqu'à ce que vous la chantiez. Pour le reste, votre profil de résonances est complet.

[a] is written into the string rather than tokenized: it is the only vowel that can be missing from a complete profile, because the threshold counts the six of `CORE_VOWELS` alone (`OPEN.md`, THE THRESHOLD IS NOT GATED ON [a], ratified 2026-11-21 09:34).

### 6.10 The two verbs, desk defaults, Dann's to strike

1. **Every new string says "sing" / « chanter », never "record" / « capter ».** His own ratified word of 2026-11-20 01:21. The older strings keep « capter » until a consistency batch moves them; do not move them here.
2. **Every new string says "works out" / « déduit », never "synthesizes".** `calib.pane.worksOut` (`i18n.ts:1447`) already carries « déduit ». "Synthesizes" stays in the record and never reaches a singer's page.


## 6A. The eight other sentences that count, with replacements DERIVED BY THE DESK. No ratification owed

**Fable found (77-B2) that done-when 2 could not be met: eight further sentences count a singer's samples toward a total, or rest on the struck six-and-four design, and r3 gave Code no replacement while forbidding it to write one.** Every replacement below is derived by the desk from wording Dann has already ratified, and the source item is named for each. **He is not asked to rule any of them.** Code takes them verbatim, as in section 6.

### 6A.1 `capture.count` (`i18n.ts:2588`, drawn at `voice/VowelCapture.svelte:297`)
"{n} of 10" is DELETED; the screen draws 6.3 in its place. Source: 6.3.

### 6A.2 `capture.hint.toGo` (`i18n.ts:2639`, from `voice/chart/screen-logic.ts:67`)
Its placeholder clause is false once lane 76 stops borrowing into her set. Source: 6.3, plus this string's own ratified "in any order".
- en: Ilya has not heard your {vowels} yet. Sing them in any order.
- fr: Ilya n'a pas encore entendu vos voyelles {vowels}. Chantez-les dans l'ordre de votre choix.
- en, one: Ilya has not heard your {vowels} yet.
- fr, one: Ilya n'a pas encore entendu votre voyelle {vowels}.

### 6A.3 `capture.finish.workOut.many` (`i18n.ts:2610`, the button, from `voice/chart/finish-early.ts:60-63`)
Source: 6.4 and 6.8's verb. The count leaves.
- en: Let Ilya work out your {vowels}
- fr: Laisser Ilya déduire vos voyelles {vowels}

### 6A.4 `capture.finish.workOut.caption` (`i18n.ts:2611`)
Source: 6.4. « chantées » agrees with « voyelles », written in the sentence.
- en: You have sung the vowels Ilya needs. Ilya can work your {vowels} out from the other vowels you sang, or you can sing them yourself.
- fr: Vous avez chanté les voyelles dont Ilya a besoin. Ilya peut déduire vos voyelles {vowels} des autres voyelles que vous avez chantées, ou vous pouvez les chanter vous-même.

### 6A.5 `capture.hint.placed.typed` and `.untyped` (`i18n.ts:2637-2638`), `capture.button.placed` (`i18n.ts:2645`), `sheet.legend.placeholder` (`i18n.ts:2578`)
**These four stay as written and become conditional, which is a code change and not a wording change.** They are true only while she has sung nothing; once she has sung anything, lane 76 puts no stand-in in her set, so draw them only when `isSung` is false for every vowel. In the sung state `capture.button.placed` takes, derived from 6.1 (« déduite » agrees with « voyelle »):
- en: worked out
- fr: déduite

### 6A.6 `sheet.legend.zones` (`i18n.ts:2579`)
**It names [ɪ], [ɨ], [a], and [ʌ] as four Ilya works out. That is the STRUCK six-and-four design** (`OPEN.md`, THE FILL RULE, striking block of 2026-11-21 01:3x). [a] leaves the list. Source: 6.4, with this string's own ratified opening and closing sentences kept word for word. The character before the colon in the French is a no-break space (U+00A0), OQLF.
- en: Each coloured area reflects the neighbourhood where Ilya expects a vowel to resonate in a voice like yours. The lavender areas mark [ɨ], [ɪ], and [ʌ]: Ilya can work these out from the other vowels you sing, or you can sing them yourself. Overlap between areas (where the colours blend) is normal.
- fr: Chaque zone colorée reflète le voisinage où Ilya s'attend à ce qu'une voyelle résonne dans une voix comme la vôtre. Les zones lavande marquent [ɨ], [ɪ] et [ʌ] : Ilya peut les déduire des autres voyelles que vous chantez, ou vous pouvez les chanter vous-même. Le chevauchement des zones (là où les couleurs se mêlent) est normal.

### 6A.7 `calib.pane.belowCore` and `calib.pane.belowCoreOne` (`i18n.ts:1445-1446`, reached at `components/Drawer/voice-pane.ts:58` and `markup/profile-status.ts:39`)
They count "{n} of the 6 core vowels", promise "at least 5", and end in placeholder values; all three are wrong after lane 76. Source: 6.3 and 6.2's second sentence, both ratified. `lane68-strings.test.ts:20-21` pins the old text; update that pin in the same commit.
- en: Ilya has not heard your {vowels} yet. Your resonance profile rests on [i], [e], [ɛ], [ɑ], [o], and [u].
- fr: Ilya n'a pas encore entendu vos voyelles {vowels}. Votre profil de résonances repose sur [i], [e], [ɛ], [ɑ], [o] et [u].
- en, one: Ilya has not heard your {vowels} yet. Your resonance profile rests on [i], [e], [ɛ], [ɑ], [o], and [u].
- fr, one: Ilya n'a pas encore entendu votre voyelle {vowels}. Votre profil de résonances repose sur [i], [e], [ɛ], [ɑ], [o] et [u].

### 6A.8 `placeholder.line.belowCore`, `placeholder.line.belowCoreOne`, and their two `markup` twins (`i18n.ts:2065-2066`, `:2072-2073`, reached at `analysis/placeholder-line.ts:75`)
Same faults, plus "Findings that rest on a placeholder are drawn dashed" when lane 76 leaves no placeholder. Take 6A.7's text and drop the dashed clause. Where a finding rests on a worked-out value, the mark of 6.1 carries it instead.

### 6A.9 A core vowel she sang that does not count (77-B7)
After lane 76 step 3 a core vowel with no steady second resonance does not count toward the six (today an unstable one does not, `voice/engine/sung.ts:26-30`). **6.3 must never say "Ilya has not heard your [o] yet" about a vowel she sang.** Source: 6.6, whose second half is Dann's own. A vowel in this state is never listed by 6.3's {vowels}.
- en: Ilya heard your {vowels}, but not steadily enough to build on. Sing again when you would like to. Your sample still stands, and Ilya can still use it without a replacement sample.
- fr: Ilya a entendu vos voyelles {vowels}, mais pas assez nettement pour s'appuyer dessus. Chantez de nouveau si vous le souhaitez. Votre échantillon reste valable, et Ilya peut encore s'en servir sans échantillon de remplacement.

## 7. Done when

1. All eight gates at baseline, gate 4 reported for both the with-scipy and the without-scipy figures, and said which was measured. (`scipy` is not installed in the cloud environment, so the figure there is the without one.)
2. `grep` finds no reader of `capture.count`, `capture.hint.toGo`, or any key carrying {n} of a fixed total on a page a singer with a reading can reach; the report lists what remains. (77-A13)
3. With [i] and [e] sung, the capture screen names [ɛ], [a], [ɑ], [o], and [u] and prints no numeral. (77-A13)
4. The five vowel lists are byte-identical to `cloud-lane-76`'s head.
5. Merges only with lane 76, after every sentence of lane 76 r3 section 0 has its replacement from section 6A. (77-A13)
6. Step 2: a walk that steps past a sung vowel draws 6.5 naming it; one that steps past none draws nothing.
7. Step 3: a sung vowel with no steady second resonance draws 6.6 and is still used for its own vowel.
8. Step 4: the eight sites named under step 4 all report the same path, with the switch on and with it off.
9. No screen calls a vowel optional.

## 8. What you could not establish

NOT ESTABLISHED beats a complete invented answer.

Report under this heading whatever you could not settle from the tree, with the instrument you used for each.
