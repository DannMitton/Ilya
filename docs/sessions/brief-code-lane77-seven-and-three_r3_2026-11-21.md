# Brief, lane 77: the capture wizard says what it is asking for

r3, 2026-11-21 19:3x, by the Opus desk. Supersedes r1 of 06:31 (strings listed as owed) and r2 of 19:3x (which asked for "synthesizes" in step 5, against section 6.10, and carried a stale threshold of five in section 7). Branch `cloud-lane-77`, cut from `Shane` after lane 76's branch exists; `cloud-lane-76` was created at `ac4bc6d8` on 2026-11-21 19:26.

**This lane runs after lane 76 and merges with it.** Lane 76 is built and held because it makes six sentences on a singer's page untrue (`brief-code-lane76-threshold-and-no-borrowing_r2_2026-11-20.md`, section 0); this lane and the wording round are what release it.

**It supersedes a draft of 2026-11-20 titled "asks for six, and offers four", now in `_to_delete/`.** That draft was built on a desk reading Dann struck at 2026-11-21 01:27: the asked-for set is **seven** and the synthesized set is **three**. See `docs/memory/OPEN.md`, "THE FILL RULE", whose head carries the striking.

**Strings: RATIFIED 2026-11-21 19:21 to 19:23 and listed verbatim in section 6.** The wording round is closed; this lane no longer waits on anything of Dann's. Code takes every string as written, in both languages, and writes none of its own.

## 1. What this is for, from where the singer stands

A singer opens the capture wizard and is asked for ten vowels, three of them called challenging. Nothing on the screen tells her which of them a profile needs, which Ilya can work out from her own voice, or that the whole ten are open to her if she wants them. She reported this herself.

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
- `tour.ts:22-37`, `nextVowel`: it walks `TOUR_ORDER` from where she is, wrapping, taking the seven before the three, and **steps over a vowel that already has a reading with nothing said**. That is the behaviour Dann met at 01:20. It is not a fault; the repair is to make the step legible, not to change the stepping.
- `i18n.ts:1437-1438`, `calib.pane.fills` and `calib.pane.fillsOne`: "You have recorded {n} of the 10 vowels. Ilya fills the other {m} from what you have recorded so far." **This counts her samples toward ten, which his rule of 01:11 forbids, and says "fills" where the design says "synthesizes".**

## 4. The steps

### Step 1, the screen says what it is asking for

At the start, name the asked-for seven as the set the wizard walks, and name the three as ones Ilya can work out from her own vowels if she would rather not sing them. Say which vowels a profile needs (the six core) where that differs from the seven asked for, **without counting anything toward a target**.

**Change no list.** If you find yourself editing `DEFAULT_VOWELS`, `CHALLENGING_VOWELS`, `TOUR_SEVEN`, `TOUR_HARDEST`, or `TOUR_ORDER`, stop: that is the struck design.

### Step 2, the step past a vowel she has already sung is said out loud

When `nextVowel` steps over a vowel that already has a reading, the screen says so, and the row shows what is already in, so the skip is legible before it happens. **Do not change the stepping.**

### Step 3, the retake invitation

For a sung vowel whose second resonance will not hold, invite her to sing it again. **Hang this on the function lane 76 adds** (that brief's step 3). Build no second test of your own. Nothing is filled for that resonance; the take still stands and is still used for its own vowel; the invitation does not block her and does not demote the reading.

### Step 4, one tap back to the published profile

On the page where she meets the gap, one tap returns her to the published profile for her voice type, naming the staff it would use. It is a standing choice, **not a fallback and not an error path**: her own samples are kept, not discarded, and she can leave again.

**This needs an engine switch, because `generic` requires nothing sung** (`voice/engine/resolve-values.ts:155`, read by the desk). Add it here, not in lane 76. Report what you added and name every reader of it.

### Step 5, the sentences that count

Replace `calib.pane.fills` and `calib.pane.fillsOne` with the two strings of section 6.8, which name the vowels Ilya worked out instead of counting samples toward ten. **The verb is "works out" and « déduit », never "fills" and never "synthesizes"** (section 6.10). An earlier revision of this brief asked for "synthesizes" here; that is struck, because the word never reaches a singer. **Check the whole of `i18n.ts` for any other sentence that counts a singer's samples toward a target, and list every one you find, in both languages, whether or not you change it.**

### Step 6, the tests

- A vowel already sung is stepped past with the step said.
- A sung vowel with no steady second resonance draws the invitation and is still used for its own vowel.
- The one tap returns to the published profile and keeps her samples.
- No string a singer reads counts her samples toward ten.
- A singer with the six core sung and [a] not sung reads that her profile is complete, with [a] named as empty.
- **A test that the five vowel lists are unchanged from `Shane`**, so a later lane cannot regroup them by accident.

## 5. What must not change

- **None of the ten vowels is optional** (Dann 2026-08-04). No identifier or string may say otherwise.
- The seven and the three stay as they are.
- A sung reading is never displaced, demoted, or discarded.
- The Text view's transcription and its directional arrows are untouched (Dann 2026-10-29 01:23).
- `ONE VOWEL PER NOTE` (`CONTRACT.md` §0.1) is untouched and nothing may weaken it.

## 6. The strings, RATIFIED. Take them verbatim

**The wording round closed 2026-11-21 19:21 to 19:23.** Dann ratified the English and ruled the French. Record: `draft-lane77-strings_r2_2026-11-21.md` (md5 `f4069863`). **Code writes none of these and changes none of them, in either language.** Key names are DESK DEFAULTS; use them unless one collides, and report any collision rather than renaming silently.

Place a no-break space before « : » in any French string that takes a colon (OQLF). The apostrophe is U+2019 in every French string, as everywhere in `i18n.ts`.

### 6.1 `calib.vowel.workedOut` (the mark on each of the three)

ENGLISH RATIFIED BY DANN 2026-11-20 01:21.

- en: Ilya worked your {x} out from your own {y} and {z}. Sing {x} yourself if you would rather.
- fr: Ilya a déduit votre {x} de vos propres {y} et {z}. Chantez {x} vous-même si vous préférez.

The French repeats the symbol rather than taking a pronoun, so it needs no agreement. The withdrawn one-anchor inflection for [a] is not built: [a] is asked for and never worked out.

### 6.2 `calib.wizard.opening`

- en: Ilya asks you to sing [i], [e], [ɛ], [a], [ɑ], [o], and [u]. Your resonance profile rests on [i], [e], [ɛ], [ɑ], [o], and [u]. Sing those vowels and Ilya reads your voice from your voice alone.
- fr: Ilya vous demande de chanter [i], [e], [ɛ], [a], [ɑ], [o] et [u]. Votre profil de résonances repose sur [i], [e], [ɛ], [ɑ], [o] et [u]. Chantez ces voyelles et Ilya lit votre voix à partir de votre voix seule.

The two sets are listed and never numbered. Do not add a count to this string for any reason.

### 6.3 `calib.wizard.stillWanted` and `calib.wizard.stillWantedOne`

- en (both keys): Ilya has not heard your {vowels} yet.
- fr, `stillWanted`: Ilya n'a pas encore entendu vos voyelles {vowels}.
- fr, `stillWantedOne`: Ilya n'a pas encore entendu votre voyelle {vowels}.

English is identical in both keys; French differs in number. This replaces every "{n} of {m}" shape on the capture screen.

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

- en, control: Use published values
- fr, control: Utiliser les valeurs publiées
- en, sentence: Ilya would consider your voice from the published values for a {type} voice, scaled to the {borrowed} staff. Everything you have sung is kept, and you can re-sample it at any time.
- fr, sentence: Ilya aborderait votre voix à partir des valeurs publiées pour une voix de {type}, ajustées à la portée de {borrowed}. Tout ce que vous avez chanté est conservé, et vous pouvez l'échantillonner de nouveau à tout moment.

{type} and {borrowed} are the two tokens of `placeholder.borrowing` (`i18n.ts:2052`): {type} the Tier 1 name, {borrowed} the staff. No string on this path names an error or a fallback.

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

## 7. Done when

1. All eight gates at baseline, gate 4 reported for both the with-scipy and the without-scipy figures, and said which was measured.
2. No screen counts toward ten, and no screen calls a vowel optional.
3. A singer short of the six core vowels is told which ones are missing, by name, with no count anywhere in the sentence. (An earlier revision said five; the threshold is the six of `CORE_VOWELS`, and lane 76 moves `PERSONAL_CORE_MIN` to 6.)
4. The five vowel lists are byte-identical to `Shane`.
5. The branch merges with lane 76 and the wording round, never ahead of them.

## 8. What you could not establish

NOT ESTABLISHED beats a complete invented answer.

Report under this heading whatever you could not settle from the tree, with the instrument you used for each.
