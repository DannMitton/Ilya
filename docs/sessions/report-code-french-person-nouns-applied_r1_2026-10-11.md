# Report: French person nouns, applied (QUEUE row 70, r1)

**QUEUE row 70, state: WRITTEN, pushed to `cloud-lane`. Dann's rulings of 2026-10-11 13:56 to 14:47 are seated in the French of `i18n.ts`, the Guide, Learn, and the drawer. The English is unchanged. Five sentences needed wording the rulings imply but do not give; they are marked desk-derived and listed in "For Dann".** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-12, for `docs/sessions/brief-code-french-person-nouns-applied_r1_2026-10-11.md`, on `cloud-lane` after row 72 (`9dd24fe4`), clean tree before the first edit.

**Fable's amendments (19:30)** reached the remote (`7bb929a4`) just after the replacements were applied. They were then read and are met:

- "Where a draft shows « … », change only the quoted words": done. Every replacement changes only the words the table quotes.
- "Apply the OQLF table by hand in Svelte files, and extend the test or report NOT ESTABLISHED": the test is extended. The new test is listed under "Tests".
- `i18n.ts` edits are anchored by key, never by line.

## How it was applied

One script, `rep(file, row, old, new)`. It matches the old words with any run of whitespace standing for a space, since Learn's sentences break across lines, and with either apostrophe (' or ’). Each match must occur exactly once, or the run stops; the replacement keeps the apostrophe the file used there. `i18n.ts` is edited by key: the script finds the key, checks its French is the old text exactly, and replaces only the `fr:` value. 132 replacements matched; none failed.

## Choices the rulings make

- **R2 (pairs for people):** rows 4, 8, 9, 28, 31, 33, 34, 36, 39, 41, 44, 49, 61, 64, and 70 take the pair, as listed. Row 25 takes the G:61 sentence instead.
- **R3:**
  - rows 1, 2, 6, and 29 take the pair;
  - rows 5 and 7 read « Choix de la partition » and « Réglage de la partition »;
  - row 3 takes the ruled sentence.
- **R1 (the Guide says « vous » for « l'utilisateur »):**
  - rows 11, 12, 13, 18 to 22, and G:46 are seated in the ruled words or as drafted;
  - rows 15, 23, and 24 needed new words, marked desk-derived and listed in "For Dann".
- **Rows given in full:** 11, 12, 13, 22, G:46, G:61 (rows 25 and 26), 38, 78, `calib.capture.paused`, and G:42 are seated verbatim. In row 78 the ruling rewrites both sentences, so « Ceux qui viennent … constateront » became « Si vous venez … vous constaterez ».
- **Every other row** is the table's draft. Every row that offered "pair or neutral" is decided by a ruling above.
- **Unchanged:** rows 72, 106, and 108, and everything under "Left alone".

## The changes

Line numbers are where each change began, in the order applied. Later lines in the same file may have moved by a line or two.

| Row | Where | Now reads |
|---|---|---|
| 1 | `i18n.ts:272` | Compositrice ou compositeur |
| 2 | `i18n.ts:276` | Traductrice ou traducteur |
| 3 | `i18n.ts:280` | Informations sur la compositrice ou le compositeur, l’opus et la ou le poète |
| 4 | `i18n.ts:671` | Supplément pour chanteuses et chanteurs |
| 5 | `i18n.ts:677` | Choix de la partition |
| 6 | `i18n.ts:682` | Compositrice ou compositeur |
| 7 | `i18n.ts:821` | Réglage de la partition |
| 8 | `i18n.ts:872` | Accent du supplément pour chanteuses et chanteurs |
| paused | `i18n.ts:1191` | En pause. Reprenez au moment qui vous convient. |
| 9 | `Drawer.svelte:564` | La diction lyrique russe pour chanteuses et chanteurs |
| 10 | `GuideContent.svelte:28` | équipe les chanteuses et chanteurs de transcriptions |
| 11 | `GuideContent.svelte:30` | Vous pouvez progresser à travers |
| 12 | `GuideContent.svelte:30` | Le module LEÇONS s'adresse à vous si vous appréciez la commodité d'<em>Ilya</em> tout en recherchant un degré |
| 13 | `GuideContent.svelte:34` | Vous pouvez exporter des PDF |
| 14 | `GuideContent.svelte:38` | donne à l'étudiante ou à l'étudiant la capacité |
| 15 (R1, desk-derived) | `GuideContent.svelte:38` | prioriser votre autonomie croissante, plutôt que de préconiser un modèle où vous restez tributaire de la disponibilité |
| 16 | `GuideContent.svelte:38` | que les étudiantes et étudiants en chant d'aujourd'hui |
| 17 | `GuideContent.svelte:44` | Quel est mon rôle? |
| 18 and G:46 | `GuideContent.svelte:46` | Vous êtes la créatrice ou le créateur de la transcription. <em>Ilya</em> est l'outil avec lequel vous la réalisez. |
| 19 | `GuideContent.svelte:46` | Vous êtes responsable de la vérification |
| 19 | `GuideContent.svelte:46` | de la sélection de vos préférences de notation |
| 20 | `GuideContent.svelte:46` | Vous apporterez les transcriptions réalisées avec <em>Ilya</em> à vos séances de coaching et à vos répétitions |
| 21 | `GuideContent.svelte:46` | Vous êtes l'artiste qui les incarne. |
| 22 | `GuideContent.svelte:50` | Vous résolvez cela en consultant |
| 23 (R1, desk-derived) | `GuideContent.svelte:54` | vous permettant de repérer |
| 24 (R1, desk-derived) | `GuideContent.svelte:54` | votre intérêt et votre capacité à enrichir |
| 25 (G:61) | `GuideContent.svelte:61` | Votre voix s'accordera peut-être avec la prévision, peut-être pas, et cette différence est elle aussi une information, non une erreur. |
| 26 (G:61) | `GuideContent.svelte:61` | L'outil vous offre une connaissance de votre voix et de la manière dont la musique impose ses exigences, puis remet les décisions entre vos mains et celles de votre professeure ou professeur. |
| 27 | `GuideContent.svelte:70` | et une chanteuse ou un chanteur formé connaît généralement |
| 28 | `GuideContent.svelte:111` | diction lyrique russe pour chanteuses et chanteurs, réparti |
| 29 | `GuideContent.svelte:128` | Le champ Compositrice ou compositeur propose |
| 30 | `GuideContent.svelte:179` | ce que certaines personnes trouvent plus lisible |
| 31 | `GuideContent.svelte:202` | destiné aux chanteuses et chanteurs de langue anglaise |
| 32 | `GuideContent.svelte:202` | Grayson y convoque locutrices et locuteurs natifs, linguistes, phonéticiennes et phonéticiens. |
| 33 | `GuideContent.svelte:226` | offertes gratuitement aux chanteuses et chanteurs qui |
| 34 | `GuideContent.svelte:238` | pour chanteuses et chanteurs alors disponible |
| 35 | `GuideContent.svelte:244` | à la communauté du chant, j’essaie |
| 36 | `GuideContent.svelte:254` | à la disposition des chanteuses et chanteurs. |
| 37 | `GuideContent.svelte:268` | l’attention de qui chante. |
| 38 (G:275) | `GuideContent.svelte:275` | Il repose sur la générosité des contributrices et contributeurs qui font la recherche, créent les polices, entretiennent les données et maintiennent les logiciels libres. |
| G:42 | `GuideContent.svelte:42` | La base de règles d'<em>Ilya</em> fonctionne avec ou sans connexion Internet. |
| 39 | `LearnContent.svelte:16` | La diction lyrique russe pour chanteuses et chanteurs</h1> |
| 40 | `LearnContent.svelte:30` | conçue pour le chant plutôt que pour la linguistique |
| 41 | `LearnContent.svelte:32` | les chanteuses et chanteurs ont disposé |
| 42 | `LearnContent.svelte:32` | pour vous permettre de produire |
| 43 | `LearnContent.svelte:69` | Vous la connaissez du français. |
| 44 | `LearnContent.svelte:97` | nouveau pour la plupart des chanteuses et chanteurs. |
| 45 | `LearnContent.svelte:113` | pour qui lit l'alphabet latin |
| 46 | `LearnContent.svelte:120` | Ce que vous connaissez déjà</th> |
| 47 | `LearnContent.svelte:123` | Si vous lisez <code>[ɛ]</code> du français ou de l'italien, vous êtes déjà presque à destination. |
| 48 | `LearnContent.svelte:127` | Si vous avez chanté les dentales italiennes ou françaises, vous effectuez déjà cet ajustement. |
| 49 | `LearnContent.svelte:133` | auxquels les chanteuses et chanteurs non natifs sont habitués |
| 50 | `LearnContent.svelte:147` | Qui déchiffre le cyrillique pour la première fois commettra |
| 51 | `LearnContent.svelte:193` | la chanteuse ou le chanteur non natif doit savoir |
| 52 | `LearnContent.svelte:193` | mais sans l'aide d'<em>Ilya</em>, une partition imprimée pose un véritable défi. |
| 53 | `LearnContent.svelte:668` | On rencontre le cyrillique dans |
| 54 | `LearnContent.svelte:686` | de la prononciation russe chantée. |
| 55 | `LearnContent.svelte:717` | Le répertoire courant contient des homographes, et |
| 56 | `LearnContent.svelte:717` | si l’on déplore un tourment ou si l’on parle de pâtisserie |
| 57 | `LearnContent.svelte:732` | Vous n'avez pas besoin de maîtriser |
| 58 | `LearnContent.svelte:736` | Votre responsabilité est de vérifier |
| 59 | `LearnContent.svelte:738` | Vous devez choisir le bon homographe |
| 60 | `LearnContent.svelte:742` | La partition fixe un rythme; on ne peut prolonger |
| 61 | `LearnContent.svelte:750` | la plus fréquente chez les chanteuses et chanteurs non natifs |
| 62 | `LearnContent.svelte:750` | mais vous gagnez à savoir |
| 63 | `LearnContent.svelte:772` | ceux sur lesquels vous pouvez compter |
| 64 | `LearnContent.svelte:791` | nouveau pour de nombreuses chanteuses et de nombreux chanteurs. |
| 65 | `LearnContent.svelte:803` | Sachez que le /o/ russe |
| 66 | `LearnContent.svelte:807` | invite à élargir les lèvres |
| 67 | `LearnContent.svelte:807` | vous pouvez le nuancer |
| 68 | `LearnContent.svelte:870` | que vous connaissez déjà</td> |
| 69 | `LearnContent.svelte:899` | En russe chanté, la partition prescrit |
| 70 | `LearnContent.svelte:909` | que les chanteuses et chanteurs formés en diction française |
| 71 | `LearnContent.svelte:958` | La reconstitution vous offre une option |
| 73 | `LearnContent.svelte:980` | on peut reconstituer vers |
| 74 | `LearnContent.svelte:980` | les locutrices et locuteurs natifs russes et les coachs préconisent |
| 75 | `LearnContent.svelte:985` | La meilleure confirmation vient d’une ou d’un coach de langue maternelle russe; |
| 76 | `LearnContent.svelte:985` | afin que vous puissiez comparer |
| 77 | `LearnContent.svelte:1001` | des sons que vous connaissez déjà de l’anglais |
| 78 (L:1003) | `LearnContent.svelte:1003` | Les chanteuses et chanteurs formés en diction italienne ou française ont déjà intériorisé cet ajustement. Si vous venez de l'anglais ou de l'allemand, vous constaterez qu'avancer consciemment |
| 79 | `LearnContent.svelte:1007` | des consonnes que vous connaissez de l’italien |
| 80 | `LearnContent.svelte:1007` | (les francophones l’ont déjà) |
| 81 | `LearnContent.svelte:1038` | La chanteuse ou le chanteur formé en diction allemande comprend |
| 82 | `LearnContent.svelte:1058` | Quels sons exigent une attention ciblée? |
| 83 | `LearnContent.svelte:1081` | Les chanteuses et chanteurs formés en diction allemande savent produire |
| 84 | `LearnContent.svelte:1089` | Les francophones reconnaîtront |
| 85 | `LearnContent.svelte:1091` | parce que les russophones tendent |
| 86 | `LearnContent.svelte:1095` | Les germanophones connaissent |
| 87 | `LearnContent.svelte:1097` | Les italophones le connaissent |
| 88 | `LearnContent.svelte:1097` | ou partout où cette affriquée se prononce en préparation de la voyelle |
| 89 | `LearnContent.svelte:1149` | il indique que la consonne |
| 90 | `LearnContent.svelte:1167` | Les chanteuses et chanteurs formés en diction allemande connaissent déjà cette règle |
| 91 | `LearnContent.svelte:1216` | pour les chanteuses et chanteurs habitués à la diction |
| 92 | `LearnContent.svelte:1217` | Une débutante ou un débutant risque moins |
| 93 | `LearnContent.svelte:1350` | Bien palataliser optimise |
| 94 | `LearnContent.svelte:1405` | Dans la sortie d’Ilya, [ʲ] apparait partout où |
| 95 | `LearnContent.svelte:1408` | car vous les rencontrerez dans |
| 96 | `LearnContent.svelte:1450` | la distinction même qu’il faut voir. |
| 97 | `LearnContent.svelte:1451` | Dans d’autres ressources, les symboles peuvent différer&#160;: il faut s’y adapter. |
| 98 | `LearnContent.svelte:1454` | Si vous connaissez les agents palatalisants (6.2) et les six frontières ci-dessous, vous pouvez prédire |
| 99 | `LearnContent.svelte:1525` | La frontière la plus fréquente à l’intérieur |
| 100 | `LearnContent.svelte:1530` | Si vous avez intériorisé les trois consonnes toujours dures de la section 5, vous connaissez déjà |
| 101 | `LearnContent.svelte:1554` | Vous savez désormais ce qu’est |
| 102 | `LearnContent.svelte:1561` | Vous les avez toutes rencontrées |
| 103 | `LearnContent.svelte:1602` | Ce tableau intériorisé, vous pouvez examiner |
| 103 (agreement, desk-derived) | `LearnContent.svelte:1604` | Si elle est appariée, cherchez un agent |
| 104 | `LearnContent.svelte:1723` | Si vous pouvez expliquer pourquoi |
| 104 | `LearnContent.svelte:1725` | laisse passer, vous avez intériorisé le système. |
| 105 | `LearnContent.svelte:1752` | Il n’y a pas à choisir entre les deux. |
| 107 | `LearnContent.svelte:1836` | Vous reconnaitrez les six premières paires |
| 107 | `LearnContent.svelte:1836` | Rares au sein d’un mot, elles existent pourtant, car |
| 109 | `LearnContent.svelte:1843` | pas intuitif quand on aborde |
| 110 | `LearnContent.svelte:1844` | Chaque fois que la lettre ⟨в⟩ précède une autre consonne |
| 111 | `LearnContent.svelte:1862` | Dans un groupe de la forme |
| 112 | `LearnContent.svelte:1864` | Vous avez déjà intégré le contraste |
| 113 | `LearnContent.svelte:1898` | C’est ici que l’assimilation transfrontalière devient visible dans Ilya. |
| 114 | `LearnContent.svelte:1900` | Peu fréquents mais non rares, ils existent, car |
| 115 | `LearnContent.svelte:1910` | mais l’interprète ou la partition choisit quand la rompre |
| 116 | `LearnContent.svelte:1912` | Votre oreille, votre répétitrice ou répétiteur et votre instinct interprétatif |
| 117 | `LearnContent.svelte:1916` | Vous connaissez déjà ce phénomène |
| 118 | `LearnContent.svelte:1937` | Quiconque chante en russe connait cette salutation. |
| 119 | `LearnContent.svelte:1977` | la prononce-t-on une fois ou deux? |
| 120 | `LearnContent.svelte:1981` | Si vous arrivez de la diction italienne, recalibrez vos attentes. |
| 121 and 123 | `LearnContent.svelte:1997` | l’oreille d’une répétitrice ou d’un répétiteur natif |
| 122 | `LearnContent.svelte:2015` | Chaque règle dont vous avez besoin |
| 124 | `LearnContent.svelte:2027` | Qui en maîtrise les principes peut aborder |
| 125 | `LearnContent.svelte:2027` | et où vous pouvez les appliquer |
| 126 | `LearnContent.svelte:2031` | ne permet de prédire |
| 127 | `LearnContent.svelte:2031` | qu’une formation uniquement à l’oreille risque |
| 128 | `LearnContent.svelte:2031` | un savoir qu’il faut simplement posséder |
| 129 | `LearnContent.svelte:2035` | des règles que vous auriez manquées |
| 130 | `LearnContent.svelte:2037` | Ilya vous prépare à ces conversations |

## The grep check

Read after seating over Learn's French branch (`LearnContent.svelte:15-2051`), the Guide's (`GuideContent.svelte:16-294`), and every `fr:` value in `i18n.ts`, for « chanteur(s) », « utilisateur(s) », « compositeur », « étudiant(s) », « locuteur(s) », « lecteur(s) », « répétiteur », « débutant », and « professeur ». Every remaining hit is either half of a pair or on the "Left alone" list:

- **Grayson's translated introduction:** `G:212`, `:214`, `:216`, and `:246`.
- **Alexei Kochetov in his own gender:** `L:980`.
- **« expérience utilisateur »:** `G:266`.
- **The score reader:** « lecteur de partitions », `G:275`.

In `i18n.ts` none of the old French remains: « Compositeur », « Traducteur », « pour chanteurs », « du compositeur », and « serez prêt ».

## Tests

- **New, in `apps/web/src/lib/i18n.test.ts`:** "the French branch of Learn and the Guide follows the table".
  - It runs the drift test's own `faults` over the French branch of both files, decoding `&#160;` first.
  - It exempts the colon inside two English titles ("Russian Lyric Diction: A …", "… Classical Singer: The …"), which keep their source's punctuation.
  - It asserts there are more than five French colons in each, so it is not vacuous.
  - The drawer's one changed string holds no punctuation the table governs; it was checked by hand.
- **No existing test changed.**

## The eight gates

All pass.

1. `pnpm test:phonology`: 251 passed (251)
2. `pnpm test:dictionary`: 242 passed (242)
3. `pnpm --filter @ilya/web check`: 0 errors and 12 warnings in 5 files
4. `pnpm --filter @ilya/web test`: 2328 → **2329** passed (+1, the new spacing test)
5. `pnpm --filter @ilya/score-parser test`: 663 passed, 5 skipped (668)
6. `pnpm test:blurb`: 145 passed (145)
7. `pnpm test:integration`: 55 passed (55)
8. `pnpm ratchets`: OK

## For Dann: French, desk-derived

Each one follows a ruling, but its words are not given anywhere.

1. **Row 15 (R1).** « … prioriser votre autonomie croissante, plutôt que de préconiser un modèle où vous restez tributaire de la disponibilité de ressources imprimées … ». « tributaire » is épicène, so the sentence needs no « limité(e) ».
2. **Row 23 (R1).** « … vous permettant de repérer les enjeux phonologiques les plus significatifs. »
3. **Row 24 (R1).** « … ne sont limitées que par votre intérêt et votre capacité à enrichir Ilya … »
4. **Row 103, the sentence after the drafted one.** « Si elle est appariée, il cherche un agent à sa droite. » now reads « Si elle est appariée, cherchez un agent à sa droite. » Its « il » meant the singer, whom the draft removed.
5. **Row 104, the end of the sentence.** « … laisse passer, a intériorisé le système. » now reads « … laisse passer, vous avez intériorisé le système. », completing the draft's « Si vous pouvez expliquer ».

## Could not establish

- **Whether the « vous » paragraphs read evenly.** Learn mixes « vous », pairs, and impersonal turns paragraph by paragraph, as row 63 warned. That is French and taste.
- **The page as rendered.** No picture was taken of the French Guide or Learn. The test reads the source.
