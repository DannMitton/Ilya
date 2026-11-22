# Lane 77, the wording round: nine items, English for Dann and French as marked drafts

r1, 2026-11-21, by the Opus desk. Answers section 6 of `brief-code-lane77-seven-and-three_r1_2026-11-21.md`. Nothing here reaches the tree until Dann ratifies the English and rules on the French.

**The design these serve:** `docs/memory/OPEN.md`, THE FILL RULE (seven asked for, three worked out) and VOICE: TWO PROFILES, AND ONE MARK. Asked for: [i], [e], [ɛ], [a], [ɑ], [o], [u]. Worked out and marked: [ɨ] (wider uncertainty), [ɪ], [ʌ]. The profile rests on the six core, `CORE_VOWELS` at `apps/web/src/lib/voice/engine/sung.ts:19`, read 2026-11-21.

**Two desk defaults in the verb, both his to strike.**

1. **"sing" / « chanter », not "record" / « capter », in every new string.** It is his own ratified word of 2026-11-20 01:21, and it names what the singer does rather than what the machine does. The older strings keep « capter » until a consistency batch moves them.
2. **"works out" / « déduit », not "synthesizes".** The brief's step 5 asked for "synthesizes". His own ratified sentence of 2026-11-20 01:21 says "worked your {x} out", and `calib.pane.worksOut` already carries « déduit » in the tree (`i18n.ts:1447`). House style allows one term per concept, so "synthesizes" stays in the record and never reaches a singer's page.

**French agreements, each checked against its written referent.** Every sentence that needs a pronoun or an adjective writes the noun « voyelle » or « voyelles » first and agrees with it, feminine, as Dann's own ratified sentence of 2026-11-20 17:17 does (« Votre voyelle {vowels} est provisoire; réglez-la »). No sentence leaves a bare symbol to carry an agreement. OQLF typography throughout: no space before « ; », no-break space before « : ».

**No sentence below counts a singer's samples toward a target** (his rule of 2026-11-20 01:11).

---

## 1. The three worked-out vowels. ENGLISH ALREADY RATIFIED 2026-11-20 01:21; French owed

- **EN (his):** Ilya worked your {x} out from your own {y} and {z}. Sing {x} yourself if you would rather.
- **FR (draft):** Ilya a déduit votre {x} de vos propres {y} et {z}. Chantez {x} vous-même si vous préférez.

Open choice, his: the French repeats the symbol where it could take a pronoun (« Chantez-le vous-même »). The repeat matches the English and needs no agreement; the pronoun reads lighter and takes the masculine of a sound named alone.

The withdrawn one-anchor inflection for [a] is not drafted: [a] is asked for and never worked out.

## 2. The opening sentence. OWED

- **EN:** Ilya asks you to sing [i], [e], [ɛ], [a], [ɑ], [o], and [u]. Your resonance profile rests on [i], [e], [ɛ], [ɑ], [o], and [u]. Sing those vowels and Ilya reads your voice from your voice alone.
- **FR:** Ilya vous demande de chanter [i], [e], [ɛ], [a], [ɑ], [o] et [u]. Votre profil de résonances repose sur [i], [e], [ɛ], [ɑ], [o] et [u]. Chantez ces voyelles et Ilya lit votre voix à partir de votre voix seule.

The sets are listed, never numbered, so nothing on the screen teaches a count.

## 3. The vowels still wanted, in place of a count. OWED

- **EN, one or many:** Ilya has not heard your {vowels} yet.
- **FR, many:** Ilya n'a pas encore entendu vos voyelles {vowels}.
- **FR, one:** Ilya n'a pas encore entendu votre voyelle {vowels}.

One English key serves both numbers; French needs two. This replaces every {n} of {m} shape on the capture screen.

## 4. The offer of the three. OWED

- **EN:** Ilya can work your [ɨ], [ɪ], and [ʌ] out from the vowels you sing. Sing them yourself if you would rather.
- **FR:** Ilya peut déduire vos voyelles [ɨ], [ɪ] et [ʌ] des voyelles que vous chantez. Chantez-les vous-même si vous préférez.

Its second sentence is his ratified wording from item 1, so the offer and the mark speak the same way.

## 5. The step past a vowel already sung. OWED

- **EN:** You have sung {sung} already, so Ilya moves on to {next}.
- **FR:** Vous avez déjà chanté {sung}; Ilya passe à {next}.

## 6. The retake invitation. OWED

- **EN:** Ilya could not hear a steady second resonance in your {vowel}. Sing it again when you would like to. Your sample still stands, and Ilya still uses it.
- **FR:** Ilya n'a pas entendu de deuxième résonance stable dans votre voyelle {vowel}. Chantez-la de nouveau si vous le souhaitez. Votre échantillon reste valable, et Ilya s'en sert toujours.

« Chantez-la » agrees with « voyelle », written in the sentence before it. The French avoids « prêt ou prête », which would make a short invitation carry a gendered pair.

## 7. The one tap back to the published profile. OWED

- **EN, the control:** Use published values
- **FR, the control:** Utiliser les valeurs publiées
- **EN, the sentence:** Ilya would read you from the published values for a {type} voice, scaled to the {borrowed} staff. Everything you have sung is kept, and you can come back to it at any time.
- **FR, the sentence:** Ilya vous lirait à partir des valeurs publiées pour une voix de {type}, ajustées à la portée de {borrowed}. Tout ce que vous avez chanté est conservé, et vous pouvez y revenir à tout moment.

« valeurs publiées » and « portée » are the file's own words (`calib.pane.notSure`, `sheet.provenance.undeclared`). The sentence names no error and no fallback, as his ruling of 2026-11-20 00:58 requires.

## 8. The replacements for `calib.pane.fills` and `calib.pane.fillsOne`. OWED

- **EN, one or many:** Ilya works your {vowels} out from the vowels you have sung.
- **FR, many:** Ilya déduit vos voyelles {vowels} des voyelles que vous avez chantées.
- **FR, one:** Ilya déduit votre voyelle {vowels} des voyelles que vous avez chantées.

« chantées » agrees with « voyelles », written in the sentence. The {n} and {m} tokens leave both keys.

## 9. A complete profile with [a] still empty. OWED

- **EN:** Your resonance profile is complete. Ilya has not heard your [a] yet, and it stays empty until you sing it.
- **FR:** Votre profil de résonances est complet. Ilya n'a pas encore entendu votre voyelle [a]; elle reste vide jusqu'à ce que vous la chantiez.

[a] is written rather than tokenized: it is the only vowel that can be missing from a complete profile, because the threshold counts the six core alone (`OPEN.md`, THE THRESHOLD IS NOT GATED ON [a], ratified 2026-11-21 09:34).

---

## Terms

**Adopted** from the tree and from Dann's own ratified strings: sing / chanter, works out / déduit, resonance profile / profil de résonances, published values / valeurs publiées, staff / portée, sample / échantillon, second resonance / deuxième résonance, core vowels / voyelles de base.

**Coined here:** nothing.
