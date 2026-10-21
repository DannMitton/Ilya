# Guide paragraph on the # break, English draft r1, 2026-10-21 (QUEUE row 139)

DRAFT. Nothing here is ratified. English only; the French is Dann's.

Dann's definition (INBOX 2026-10-21 01:45, transcribed as written): the # is "an artificial construct adopted from linguistics to help non-native singers incorporate idiomatic syntactic breaks that limit regressive voicing idiomatically. Punctuation needs no reinterpretation in this context." The paragraph says nothing that reinterprets punctuation.

1. A syntactic break is a place where a coach hears one unit of the text end before the next one begins. (Desk draft 01:45; "syntactic" added by the desk at 01:48 so the term matches sentence 3, a DESK DEFAULT; Dann has not ruled.)
2. The # comes from linguistics, and you place it after the IPA for the last syllable of a word. (Desk draft; the clause after "and" is Dann's, 01:46.)
3. A syntactic break stops the regressive assimilation of voicing. (Dann's own wording, 01:47, transcribed as written.)

Terms: "syntactic break", "unit", "coach", "regressive assimilation of voicing" are Dann's. Nothing coined by the desk.

## Grayson's passage, located 2026-10-21 01:5x (read from the text layer of `~/Downloads/Grayson_washington_0250E_10459.pdf`; printed page = PDF page minus 16; the page images were NOT viewed)

- p. 248, "Defining the Word Boundary": punctuation and the implied phrase are boundaries "not crossed by any phenomena of assimilation, including voicing and palatalization." Grayson's term is "implied phrase break"; Dann's is "syntactic break".
- p. 250, "Regressive Assimilation of Voicing": voicing assimilation occurs across all boundaries except punctuation or the implied phrase.
- p. 252, Rule #1 examples: «Анна может петь. Дмитрий не может.» (a period) and «…да будет на вас благодать,…» (an implied break).
- p. 253, "Determining the Implied Phrase": a prepositional phrase can be one of the first points of an implied break.
- p. 255: in «на вас благодать» (Khomyakov/Rakhmaninov, "To the Children"), the prepositional phrase «на вас» implies a break before «благодать», so the voiced б does not regressively influence the final unvoiced с of «вас».
- The Russian was decoded from the PDF's keyboard-mapped text (QWERTY keys to the Russian layout) and agrees with Grayson's own English glosses and letter names on pp. 252 and 255.

4. (Desk draft, not ruled.) Take «на вас благодать»: without a break, the voiced б of «благодать» voices the final с of «вас», and a break after «вас» keeps it voiceless (Grayson 2012, p. 255).

## FINDING 2026-10-21 02:0x (desk, before the French): the # already exists in Ilya as Dann's phonation-break mark

Read this session: `packages/score-parser/src/diction-marks.ts:1-60` (Dann 2026-07-30: *"# means a break in phonation, a lift or an interruption as opposed to continuous phonation. Its function is to signal the stopping of assimilative processes. But alone, # has no phonetic/phonemic value."*; a # engraved as a lyric is folded onto the preceding syllable and sets `phonationBreak`, `analysis-types.ts:227`); `staff-renderer.test.ts:944` (the mark renders as `[#]` on the IPA line); the Guide already carries a paragraph on it at `GuideContent.svelte:84` (French, « rupture de phonation ») and `:380` (English, "phonation break"), where QUEUE row 139 places the new paragraph. NOT ESTABLISHED: whether the engine reads `phonationBreak` today. The ratified paragraph above names the mark a "syntactic break". One mark, two names, until Dann rules.

## French draft r1 (DRAFT; every word is Dann's to rule; nothing reaches the tree until he does)

Une frontière syntaxique est un endroit où l’on entend une unité du texte se terminer avant que la suivante commence. Le # vient de la linguistique, et vous le placez après la transcription API de la dernière syllabe d’un mot. Une frontière syntaxique arrête l’assimilation régressive de voisement. Prenez l’exemple de <em>на вас благодать</em>&#160;: sans frontière, le <em>с</em> final de <em>вас</em> [s] devient voisé [z] devant le <em>б</em> de <em>благодать</em>, et une frontière après <em>вас</em> le laisse non voisé (Grayson 2012, p. 255).

From the file's French: « frontière » (Dann 2026-10-21 00:32, and the Guide's « frontières » beside Grayson); « voisement », « voisé », « non voisé », « assimilation de voisement » (`LearnContent.svelte`, the voicing-assimilation passage); « assimilation régressive » (`LearnContent.svelte:1383`); « API » (`GuideContent.svelte`, « ligne API »). The desk's own, no source in the file: « syntaxique », « unité », « Prenez l’exemple de ». Agreements checked: « le # » masculine (a symbol named alone); « le с », « le б » masculine, so « voisé » and « non voisé » agree; « la suivante » agrees with « unité ». Flags: (1) "a coach hears" is dropped for « où l’on entend », a wording that names no person (`CONTRACT.md` §7); to restore a person the ruled form is « votre professeure ou professeur » (the role noun for "coach" is NOT ESTABLISHED in the file); (2) Russian words are in `<em>` italics, as « <em>так</em> » is in the Guide, not in « » as the ratified English draft has them: DESK DEFAULT, applied to both languages in the tree; (3) NBSP before the colon, as `LearnContent.svelte` writes it.

## 02:08 Dann edited French sentence 4 (his words, transcribed as written; the first letters were cut off in his message): "e с final de вас [s] devient voisé [z] devant le б de благодать,". Applied above. IPA is in plain brackets in running text, as the Guide's phrase-ends sentence sets [k], [ɡ], [z]. Not yet ruled for the English: the ratified English sentence 4 carries no IPA; desk proposal, a mirror: "Take «на вас благодать»: without a break, the final с of вас [s] becomes voiced [z] before the б of благодать, and a break after вас keeps it voiceless (Grayson 2012, p. 255)."
