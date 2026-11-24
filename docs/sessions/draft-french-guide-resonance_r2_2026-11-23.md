# French drafts: the two GUIDE resonance paragraphs (r2)

r2, 2026-11-23 22:2x, by the desk (Opus 5). Supersedes r1 of 2026-11-22, which is kept.

**Paragraph 2 is RATIFIED by Dann 2026-11-23 22:16**, transcribed as written: *"I ratify parargraoh 2"*. It reaches the tree as r1 drafted it.

**Paragraph 1 was REWRITTEN BY DANN 2026-11-23 22:16, in both languages**, after he read r1's English and French together. His opening word was *"Oh Jesus no."* The defect he was reading: r1's paragraph 1 described the method's internals, the fitting and the assumed tract length, instead of what a singer does and what a singer gets back. That English had been ratified on 2026-11-22 at 21:44 and the desk put it in front of him again without reading it against his own standard first. The desk's failure, not his reversal (`CONTRACT.md` section 1 item 11a, ratification is approval at a moment).

**Then CUT BY DANN 2026-11-23 22:26**, transcribed as written: *"Delete: \"That is how Ilya tells your first and second resonances apart on [o] and [u], where in a low voice the two sit close together and a single fixed reading can merge them into one.\" and its French coutnerpart"*. Applied in both languages below.

**STATE: BOTH PARAGRAPHS RATIFIED. Paragraph 1 RATIFIED by Dann 2026-11-23 22:28**, transcribed as written: *"Rartified"*. Paragraph 2 at 22:16. **The French sitting of 2026-11-23 is closed.** **OWED and it is the desk's: the seating brief**, which establishes the insertion points in `GuideContent.svelte` for both languages and pins both paragraphs as ratified Guide lines are pinned.

## Paragraph 1, as it now stands

**EN:**

> **How Ilya reads your vowel.** You sing each vowel in vocal fry, holding the shape of your vocal tract steady, and Ilya reads the resonances that shape makes. From your takes it builds your resonance profile. Ilya reads each take fifteen times over, each one made for a different length of vocal tract, and keeps the reading whose resonances hold most steadily from the beginning of the note to the end.

**FR:**

> **Comment *Ilya* lit votre voyelle.** Vous chantez chaque voyelle en friture vocale, en gardant la forme de votre conduit vocal, et *Ilya* lit les résonances que cette forme produit. À partir de vos prises, *Ilya* établit votre profil de résonances. *Ilya* lit chaque prise quinze fois, chaque lecture étant faite pour une longueur de conduit vocal différente, et retient celle dont les résonances restent les plus stables du début à la fin de la note.

## Paragraph 2, RATIFIED, for Licences et remerciements (`GuideContent.svelte:290`)

**EN, ratified 2026-11-22 21:44:**

> **The method is published work.** Ilya's reading of your resonances follows the method David Weenink described in 2015 and 2023, built from his papers rather than from any implementation of them.

**FR, ratified 2026-11-23 22:16:**

> **La méthode provient de travaux publiés.** Pour lire vos résonances, *Ilya* suit la méthode décrite par David Weenink en 2015 et en 2023, à partir de ses articles seuls et sans recourir à aucune mise en œuvre existante.

His two flagged choices inside paragraph 2 are settled by that ratification: « mise en œuvre » stands over « implémentation », and « à partir de ses articles seuls » stands.

## What the desk changed in his paragraph 1, and why

1. **"formant profile" to "resonance profile".** Ilya's own name for the thing, live in eleven strings (`i18n.ts:1274`, `:1415`, `:1424` to `:1427`, `:1433`, `:1470`, `:1471`, `:1473`, `:1893`). *Formant* appears in one user-facing string only, `voiceIntake.acoustics.stem`, where it is set AGAINST resonance. His own French already said « profil de résonances », so his two languages disagreed and the French was right.
2. **The tract-length clause argued back in.** He had cut it as machine talk. The desk argued that tract length is a singer's and a teacher's idea, and he left it standing when he cut only the final sentence.
3. **Sentence 1 rebuilt.** His version opened with a twelve-word subject, put "vocal tract" in it twice, and had a singer sustaining a tract rather than a vowel.
4. **"from this data" to "from your takes".** *Data* is the machine's word for what it heard him sing.
5. **French repairs:** « profile » to « profil », « resonances » to « résonances », « personalisé » to « personnalisé » (then absorbed into the adopted term), and « situera » to « établit », which is the app's own verb in five live strings. His French had also kept r1's fitting language that his English dropped, so the two languages no longer matched; they match now.
6. ***Ilya* restored to italics** in the French, the house form in GUIDE prose.

## Provenance of every term in paragraph 1

**Adopted from French already in the tree or already ratified:** « friture vocale », « conduit vocal » (ruled; `OPEN.md`, « CONDUIT VOCAL », NEVER « TRACTUS VOCAL »), « prise », « profil de résonances » (`i18n.ts:1470` to `:1473`), « établit » (`i18n.ts:1415`, `:1424` to `:1427`).

**Coined by the desk, and named as such:** « restent les plus stables » for *hold most steadily*, which keeps « lisse » out because smooth means something else to a singer; « lecture » for *a reading* in this sense, which the tree has no French for; « étant faite pour une longueur de conduit vocal différente ».

## Agreements checked, and against what

- « les résonances que cette forme produit »: the verb agrees with « forme », feminine singular, not with « résonances ».
- « chaque lecture étant faite »: « faite » agrees with « lecture », feminine singular.
- « une longueur de conduit vocal différente »: « différente » agrees with « longueur », feminine singular, NOT with « conduit ». **This is the agreement most likely to be misread, so it is named here.** It is the length that differs.
- « retient celle dont »: « celle » refers to « lecture », feminine singular, whose antecedent is in the same sentence.
- OQLF typography: no colon appears in either paragraph, so no no-break space is needed. Every apostrophe is U+2019.

## What the cut costs, carried by the desk, NOT a question for Dann

The deleted sentence was the only place in the GUIDE that said why [o] and [u] need care in a low voice, which is also the reason the fifteen readings exist. Paragraph 1 now says what Ilya does and not why. The desk carries that content for the fry essay or for LEARN rather than putting the sentence back.

## What is NOT established

- Whether paragraph 1 lands under Reference or under About Ilya beside the fry essay. The English record names both and does not choose. The French follows wherever the English goes.
- The exact insertion points in `GuideContent.svelte`, English and French. Those are the brief's to establish when the lane is written, not this draft's.
