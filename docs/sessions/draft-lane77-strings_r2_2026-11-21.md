# Lane 77, the wording round: nine items, r2 after Dann's rewrites

r2, 2026-11-21 19:2x, by the Opus desk. Supersedes r1 (md5 `5b1dc8fa`). Answers section 6 of `brief-code-lane77-seven-and-three_r1_2026-11-21.md`.

**What changed from r1.** Dann rewrote the English of items 4, 6, 7, and 9 at 19:21, transcribed as written; those four English lines are now his. Their French is redrafted here to match. Items 1, 2, 3, 5, and 8 are unchanged from r1 and he did not object to them.

**The design these serve:** `docs/memory/OPEN.md`, THE FILL RULE (seven asked for, three worked out) and VOICE: TWO PROFILES, AND ONE MARK. Asked for: [i], [e], [ɛ], [a], [ɑ], [o], [u]. Worked out and marked: [ɨ] (wider uncertainty), [ɪ], [ʌ]. The profile rests on the six core, `CORE_VOWELS` at `apps/web/src/lib/voice/engine/sung.ts:19`, read 2026-11-21.

**Two desk defaults in the verb, both his to strike.** New strings say "sing" / « chanter », not "record" / « capter » (his own ratified word of 2026-11-20 01:21). New strings say "works out" / « déduit », not "synthesizes" (his 01:21 sentence, and `i18n.ts:1447` already carries « déduit »).

**French agreements, each checked against its written referent.** Every sentence needing a pronoun or an adjective writes « voyelle », « voyelles », or « échantillon » first and agrees with it. OQLF typography: no space before « ; », no-break space before « : ». No sentence counts samples toward a target.

---

## 1. The three worked-out vowels. ENGLISH RATIFIED 2026-11-20 01:21; French owed

- **EN (his):** Ilya worked your {x} out from your own {y} and {z}. Sing {x} yourself if you would rather.
- **FR (draft):** Ilya a déduit votre {x} de vos propres {y} et {z}. Chantez {x} vous-même si vous préférez.

DESK DEFAULT: the French repeats the symbol rather than taking « Chantez-le », so it matches the English and carries no agreement.

## 2. The opening sentence

- **EN:** Ilya asks you to sing [i], [e], [ɛ], [a], [ɑ], [o], and [u]. Your resonance profile rests on [i], [e], [ɛ], [ɑ], [o], and [u]. Sing those vowels and Ilya reads your voice from your voice alone.
- **FR:** Ilya vous demande de chanter [i], [e], [ɛ], [a], [ɑ], [o] et [u]. Votre profil de résonances repose sur [i], [e], [ɛ], [ɑ], [o] et [u]. Chantez ces voyelles et Ilya lit votre voix à partir de votre voix seule.

## 3. The vowels still wanted, in place of a count

- **EN, one or many:** Ilya has not heard your {vowels} yet.
- **FR, many:** Ilya n'a pas encore entendu vos voyelles {vowels}.
- **FR, one:** Ilya n'a pas encore entendu votre voyelle {vowels}.

## 4. The offer of the three. ENGLISH HIS, 2026-11-21 19:21

- **EN (his):** Ilya can work your [ɨ], [ɪ], and [ʌ] out from the other vowels you sing. Sing them yourself if you would rather.
- **FR (draft):** Ilya peut déduire vos voyelles [ɨ], [ɪ] et [ʌ] des autres voyelles que vous chantez. Chantez-les vous-même si vous préférez.

« autres » is invariable in gender; « Chantez-les » agrees with « voyelles ».

## 5. The step past a vowel already sung

- **EN:** You have sung {sung} already, so Ilya moves on to {next}.
- **FR:** Vous avez déjà chanté {sung}; Ilya passe à {next}.

## 6. The retake invitation. SECOND HALF HIS, 2026-11-21 19:21

- **EN:** Ilya could not hear a steady second resonance in your {vowel}. Sing it again when you would like to. Your sample still stands, and Ilya can still use it without a replacement sample.
- **FR:** Ilya n'a pas entendu de deuxième résonance stable dans votre voyelle {vowel}. Chantez-la de nouveau si vous le souhaitez. Votre échantillon reste valable, et Ilya peut encore s'en servir sans échantillon de remplacement.

« Chantez-la » agrees with « voyelle »; « valable » agrees with « échantillon », masculine singular; « s'en servir » takes « en » for « de votre échantillon ».

## 7. The one tap back to the published profile. ENGLISH HIS, 2026-11-21 19:21

- **EN, the control:** Use published values
- **FR, the control:** Utiliser les valeurs publiées
- **EN (his):** Ilya would consider your voice from the published values for a {type} voice, scaled to the {borrowed} staff. Everything you have sung is kept, and you can re-sample it at any time.
- **FR, RULED BY DANN 2026-11-21 19:23 (« aborder »):** Ilya aborderait votre voix à partir des valeurs publiées pour une voix de {type}, ajustées à la portée de {borrowed}. Tout ce que vous avez chanté est conservé, et vous pouvez l'échantillonner de nouveau à tout moment.

**RULED:** Dann chose « aborder » at 19:23 over « considérerait », which tracked his English word for word and read as a light calque. « à partir de » is kept, since `calib.pane.notSure` and `calib.pane.none` already use it. Agreement: « ajustées » agrees with « valeurs »; « l' » in « l'échantillonner » stands for « tout ce que vous avez chanté », masculine singular.

## 8. The replacements for `calib.pane.fills` and `calib.pane.fillsOne`

- **EN, one or many:** Ilya works your {vowels} out from the vowels you have sung.
- **FR, many:** Ilya déduit vos voyelles {vowels} des voyelles que vous avez chantées.
- **FR, one:** Ilya déduit votre voyelle {vowels} des voyelles que vous avez chantées.

## 9. A complete profile with [a] still empty. ENGLISH HIS, 2026-11-21 19:21

- **EN (his):** Ilya has not heard your [a] yet, and it stays empty until you sing it. Otherwise, your resonance profile is complete.
- **FR (draft):** Ilya n'a pas encore entendu votre voyelle [a]; elle reste vide jusqu'à ce que vous la chantiez. Pour le reste, votre profil de résonances est complet.

DESK DEFAULT: « Pour le reste » for his "Otherwise", because « Autrement » reads as "or else" and would turn the gap into a warning. « À cela près » is the alternative. Agreement: « elle reste vide » agrees with « voyelle »; « complet » agrees with « profil ».

His reordering puts the gap first and the completeness second, which is the opposite of r1 and reads as the singer's own order: what is missing, then what stands.

---

## Terms

**Adopted** from the tree and from Dann's own ratified strings: sing / chanter, works out / déduit, resonance profile / profil de résonances, published values / valeurs publiées, staff / portée, sample / échantillon, second resonance / deuxième résonance, core vowels / voyelles de base, consider / aborder (English his 2026-11-21 19:21, French ruled by him 19:23).

**Coined here:** nothing.
