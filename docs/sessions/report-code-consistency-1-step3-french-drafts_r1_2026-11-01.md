# Report: French drafts for Dann, consistency batch 1 step 3, r1, 2026-11-02

Branch `cloud-lane-24`, the commit "French drafts for Dann". These French changes were NOT ruled by Dann. Each follows from a ruled term (« CHANT », the capitals) but changes an article, a contraction, or the line around it, so CONTRACT §7 makes it a draft. They sit in this one commit so Dann can take or revert it whole. The main step 3 commit holds only ruled French.

Agreement checked: « Annotation » was feminine and « CHANT » is masculine, so « l’Annotation » becomes « le CHANT » (subject) and « de l’Annotation » would become « du CHANT ». « Aperçus » and « Texte » keep their gender and number; only the capitals change.

| # | where | English (now) | old French | new French | reason |
|---|---|---|---|---|---|
| 1 | `i18n.ts`, `calib.characteristics.lede` | "These optional values sharpen MELODY and INSIGHTS." | « Ces valeurs facultatives précisent l’Annotation et les Aperçus. » | « Ces valeurs facultatives précisent le CHANT et les APERÇUS. » | article changes with the masculine noun; capitals |
| 2 | `i18n.ts`, `profile.lede` | "MELODY will appear here after Ilya processes the score you upload." | « L’Annotation apparaîtra ici une fois qu’Ilya aura traité la partition que vous téléversez. » | « Le CHANT apparaîtra ici une fois qu’Ilya aura traité la partition que vous téléversez. » | article changes; no later pronoun refers back to the subject |
| 3 | `GuideContent.svelte:82` | "MELODY draws its notation conventions from Mitton (2020, Appendices B and C). … INSIGHTS describes each one. The text underlay offers the same IPA values imported from TEXT …" | « L’Annotation tire ses conventions de notation de Mitton (2020, annexes B et C). … Les Aperçus décrivent chacune de ces exigences. Sous la portée, le texte reprend les mêmes valeurs API, importées du Texte, … » | « Le CHANT tire ses conventions de notation de Mitton (2020, annexes B et C). … Les APERÇUS décrivent chacune de ces exigences. Sous la portée, le texte reprend les mêmes valeurs API, importées du TEXTE, … » | article changes on the subject; two capitals on the same line, kept with it so the line is not half done |
| 4 | `GuideContent.svelte:285` | "MELODY and INSIGHTS implement an open and close timbre markup, …" | « L’Annotation et les Aperçus mettent en œuvre un balisage … » | « Le CHANT et les APERÇUS mettent en œuvre un balisage … » | article changes; the plural verb « mettent » already agrees with two subjects |

Pins changed with the drafts (CONTRACT §1 item 11a): `no-fit-name.test.ts`, passages B and C in French (three pins: « Le CHANT tire … », « importées du TEXTE, … », « Le CHANT et les APERÇUS mettent en œuvre »).

NOT ESTABLISHED: a pronoun referring back to the subject in lines 3 and 4 beyond the sentence read. In line 3, « Il attire votre attention » refers to the red box, not the document; I read to the end of the paragraph. For line 4, the paragraph is one sentence.
Not changed, owed to row 171: the French Guide mentions that are not among the six lines (for example « l’onglet Texte » at `GuideContent.svelte:38`, « les Aperçus prévoient » at `:65`).
