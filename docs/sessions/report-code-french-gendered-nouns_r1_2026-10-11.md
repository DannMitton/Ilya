# Report: French gendered nouns, feminine first (r1, 2026-10-11)

**QUEUE row 63, state: DRAFTED, pushed to `cloud-lane`. Nothing in `apps/` changed. Every draft below is `[FR: desk draft for Dann]` and waits for his ruling.** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-11, for `docs/sessions/brief-code-french-gendered-nouns_r1_2026-10-11.md`. Read on `cloud-lane` at the row 65 commit, clean tree. Line numbers are that commit's. One commit on `cloud-lane` (this report only), under Dann's instruction for this session; nothing pushed to `Shane` or `main`, no pull request.

## How the list was made

A script searched every non-test `.ts` and `.svelte` file under `apps/web/src`, the four packages' `src`, and `data/blurb-composer.json` for the brief's nouns and their relatives: chanteur, professeur, enseignant, élève, accompagnateur, auteur, lecteur, utilisateur, interprète, compositeur, poète, traducteur, étudiant, débutant, musicien, locuteur, coach, chef, linguiste, phonéticien, collègue, ami, chercheur, créateur, répétiteur, and the -phone adjectives used as nouns. In `i18n.ts` only the `fr:` value was searched. Each hit was read in its whole sentence, across line breaks. 212 raw hits came back (a hit is one noun on one line). Read in their sentences and with the "Left alone" list set aside, they make **130 table rows**: 127 with a draft and 3 kept with no draft.

`data/blurb-composer.json` had no person nouns: its 14 hits are the verb « s’élève ». `data/homographs.json` holds dictionary glosses (kaikki.org), a source's words.

## The drafting rule, as applied

- **Pair, feminine first**, as Dann ruled: « la chanteuse ou le chanteur », « les chanteuses et chanteurs ». A shared plural article is written once.
- **Agreement with a pair goes to the masculine,** the OQLF's rule for a doublet. With the feminine first, the masculine noun stands nearest the adjective or participle, so the agreement also reads naturally: « la chanteuse ou le chanteur formé en diction allemande ». A pronoun that takes up a pair is « il ou elle » only where the sentence needs it; most drafts avoid the pronoun.
- **Neutral wording** where a pair would make the line heavy, or where Learn repeats « le chanteur » several times in one paragraph. Learn already speaks to the reader as « vous », so most neutral drafts in Learn use « vous », which names no person. A few use an impersonal turn (« on », a passive, or « le chant »).
- **Labels and short UI strings** get a full pair where it fits; a neutral form is offered beside it. The OQLF's short form, « compositeur(-trice) », is allowed in forms but puts the masculine first, so it is not drafted.

## The table

`L` is `apps/web/src/lib/components/Reading/LearnContent.svelte`; `G` is `apps/web/src/lib/components/Reading/GuideContent.svelte`; `I` is `apps/web/src/lib/i18n.ts`; `D` is `apps/web/src/lib/components/Drawer/Drawer.svelte`. "Agr." says what was checked: determiners (det.), adjectives and participles (adj.), and pronouns (pron.). "—" means the sentence has none that refer to the noun.

### i18n and the drawer

| # | Where | Current | Draft `[FR: desk draft for Dann]` | Form | Agr. |
|---|---|---|---|---|---|
| 1 | `I:272` `meta.composer` | Compositeur | Compositrice ou compositeur | pair | — |
| 2 | `I:276` `meta.translator` | Traducteur | Traductrice ou traducteur | pair | — |
| 3 | `I:280` `meta.placeholderLine` | Informations sur le compositeur, l’opus et le poète | Informations sur la compositrice ou le compositeur, l’opus et la ou le poète. *Neutral, lighter:* Composition, opus et texte | pair or neutral | det. « la ou le poète » (épicène noun, pair of determiners) |
| 4 | `I:671` `stress.supplement` | Supplément pour chanteurs | Supplément pour chanteuses et chanteurs. *Neutral:* Supplément pour le chant | pair or neutral | — |
| 5 | `I:677` `stress.userComposer` | Choix du compositeur | Choix de la compositrice ou du compositeur. *Neutral:* Choix de la partition | pair or neutral | det. « de la », « du » |
| 6 | `I:682` `inspector.stressAssign.composer` | Compositeur | Compositrice ou compositeur | pair | — |
| 7 | `I:821` `legend.user-composer` | Réglage du compositeur | Réglage de la compositrice ou du compositeur. *Neutral:* Réglage de la partition | pair or neutral | det. |
| 8 | `I:872` `provenance.supplement` | Accent du supplément pour chanteurs | Accent du supplément pour chanteuses et chanteurs. *Neutral:* Accent du supplément pour le chant | pair or neutral | — |
| 9 | `D:564` (table of contents) | La diction lyrique russe pour chanteurs | La diction lyrique russe pour chanteuses et chanteurs | pair | — (must match #20) |

`I:273` « Poète ou librettiste » needs no draft: both nouns are épicène.

### The Guide (Ilya's own voice)

| # | Where | Current | Draft `[FR: desk draft for Dann]` | Form | Agr. |
|---|---|---|---|---|---|
| 10 | `G:28` | Ilya équipe les chanteurs de transcriptions vérifiables et précises … | Ilya équipe les chanteuses et chanteurs de transcriptions vérifiables et précises … | pair | — |
| 11 | `G:30` | Les utilisateurs peuvent progresser à travers une série de leçons séquencées qui expliquent … qu'ils soient familiers ou inattendus. | On peut progresser à travers une série de leçons séquencées qui expliquent … qu'ils soient familiers ou inattendus. | neutral | pron. « ils » refers to « résultats », unchanged |
| 12 | `G:30` | Le module LEÇONS s'adresse aux utilisateurs qui apprécient la commodité d'Ilya, mais qui recherchent aussi … | Le module LEÇONS s'adresse aux personnes qui apprécient la commodité d'Ilya, mais qui recherchent aussi … | neutral | — |
| 13 | `G:34` | Les utilisateurs peuvent exporter des PDF comme copies papier ou les conserver pour une étude ultérieure. | Les PDF s’exportent comme copies papier ou se conservent pour une étude ultérieure. | neutral | — |
| 14 | `G:38` | C'est un pont qui donne à l'étudiant la capacité d'aborder n'importe quel texte cyrillique russe. | C'est un pont qui donne à l'étudiante ou à l'étudiant la capacité d'aborder n'importe quel texte cyrillique russe. | pair | det. |
| 15 | `G:38` | … prioriser l'autonomie croissante de l'utilisateur, plutôt que de préconiser un modèle où l'utilisateur reste limité par … | … prioriser l'autonomie croissante de la personne qui l’utilise, plutôt que de préconiser un modèle où cette personne reste limitée par … | neutral | adj. « limitée » agrees with « personne » |
| 16 | `G:38` | … dans un format que les étudiants en chant d'aujourd'hui sont formés à utiliser et à comprendre. | … dans un format que les étudiantes et étudiants en chant d'aujourd'hui sont formés à utiliser et à comprendre. | pair | adj. « formés » masculine plural, the doublet's agreement |
| 17 | `G:44` (heading) | Quel est mon rôle en tant qu’utilisateur? | Quel est mon rôle? | neutral | — |
| 18 | `G:46` | L'utilisateur est le créateur de la transcription. | Vous êtes la créatrice ou le créateur de la transcription. | pair, addressed | det. |
| 19 | `G:46` | Les utilisateurs sont responsables de la vérification des accents toniques inconnus, … de la sélection de leurs préférences de notation … | Vous êtes responsable de la vérification des accents toniques inconnus, … de la sélection de vos préférences de notation … | neutral | « leurs » becomes « vos »; « elles » (préférences) unchanged |
| 20 | `G:46` | Les utilisateurs apporteront les transcriptions réalisées avec Ilya à leurs séances de coaching et à leurs répétitions, d'où la version mobile, … | Vous apporterez les transcriptions réalisées avec Ilya à vos séances de coaching et à vos répétitions, d'où la version mobile, … | neutral | « leurs » becomes « vos » |
| 21 | `G:46` | L'utilisateur est l'artiste qui les incarne. | Vous êtes l'artiste qui les incarne. | neutral | « artiste » épicène |
| 22 | `G:50` | L'utilisateur résout cela en consultant la définition complète … | On résout cela en consultant la définition complète … | neutral | — |
| 23 | `G:54` | … permettant aux utilisateurs de repérer les enjeux phonologiques les plus significatifs. | … pour permettre de repérer les enjeux phonologiques les plus significatifs. | neutral | — |
| 24 | `G:54` | … ne sont limitées que par l'intérêt de ses utilisateurs et leur capacité à enrichir Ilya … | … ne sont limitées que par l'intérêt de sa communauté et sa capacité à enrichir Ilya … | neutral | « leur » becomes « sa » |
| 25 | `G:61` | Certains chanteurs s'accorderont avec la prévision, d'autres non, … | Certaines chanteuses et certains chanteurs s'accorderont avec la prévision, d'autres non, … *Neutral:* Certaines voix s’accorderont avec la prévision, d’autres non, … | pair or neutral | det. « certaines … certains » |
| 26 | `G:61` | L'outil offre au chanteur une connaissance de lui-même et de la manière dont la musique impose ses exigences, puis remet les décisions entre ses mains et celles de son professeur. | L'outil vous offre une connaissance de votre voix et de la manière dont la musique impose ses exigences, puis remet les décisions entre vos mains et celles de votre professeure ou professeur. | neutral + pair | « lui-même » removed; « ses » becomes « vos »; « votre » serves both nouns. The brief's own example. |
| 27 | `G:70` | … et un chanteur formé connaît généralement son passaggio mieux que ne le montrerait un échantillon rapide. | … et une chanteuse ou un chanteur formé connaît généralement son passaggio mieux que ne le montrerait un échantillon rapide. | pair | adj. « formé » masculine, nearest noun |
| 28 | `G:111` | … un cours complet de diction lyrique russe pour chanteurs, réparti en huit sections. | … un cours complet de diction lyrique russe pour chanteuses et chanteurs, réparti en huit sections. | pair | — |
| 29 | `G:128` | Le champ Compositeur propose une liste de recherche. | Le champ Compositrice ou compositeur propose une liste de recherche. | pair | follows #1 |
| 30 | `G:179` | … ce que certains chanteurs trouvent plus lisible à tempo. | … ce que certaines personnes trouvent plus lisible à tempo. | neutral | det. « certaines » |
| 31 | `G:202` | … le traitement le plus approfondi … destiné aux chanteurs de langue anglaise. | … destiné aux chanteuses et chanteurs de langue anglaise. | pair | — |
| 32 | `G:202` | Grayson y convoque locuteurs natifs, linguistes et phonéticiens. | Grayson y convoque locutrices et locuteurs natifs, linguistes, phonéticiennes et phonéticiens. | pair | adj. « natifs » masculine plural |
| 33 | `G:226` | … offertes gratuitement aux chanteurs qui en ont besoin. | … offertes gratuitement aux chanteuses et chanteurs qui en ont besoin. | pair | — |
| 34 | `G:238` (Dann's note) | … chaque guide de diction lyrique russe pour chanteurs alors disponible. | … chaque guide de diction lyrique russe pour chanteuses et chanteurs alors disponible. | pair | — |
| 35 | `G:244` (Dann's note) | En créant Ilya et en l’offrant gratuitement à la communauté des chanteurs, j’essaie d’aider. | … à la communauté du chant, j’essaie d’aider. | neutral | — |
| 36 | `G:254` (Claude's profile) | … la mettre gratuitement à la disposition des chanteurs. | … la mettre gratuitement à la disposition des chanteuses et chanteurs. | pair | — |
| 37 | `G:268` (Kimi's profile) | … et son respect de l’attention du chanteur. | … et son respect de l’attention de qui chante. | neutral | — |
| 38 | `G:275` (Licences) | Il repose sur la générosité de chercheurs, de créateurs de polices, de curateurs de données et de mainteneurs de logiciels libres. | Il repose sur la générosité de chercheuses et chercheurs, de créatrices et créateurs de polices, de curatrices et curateurs de données, et de mainteneuses et mainteneurs de logiciels libres. *Neutral, lighter:* Il repose sur la générosité de la recherche, de la création de polices, de la curation de données et de la maintenance de logiciels libres. | pair or neutral | — |

### Learn

| # | Where | Current | Draft `[FR: desk draft for Dann]` | Form | Agr. |
|---|---|---|---|---|---|
| 39 | `L:16` (title) | La diction lyrique russe pour chanteurs | La diction lyrique russe pour chanteuses et chanteurs | pair | matches #9 |
| 40 | `L:30` | … conçue pour les chanteurs plutôt que pour les linguistes, … | … conçue pour le chant plutôt que pour la linguistique, … | neutral | — |
| 41 | `L:32` | … les chanteurs ont disposé de ressources … | … les chanteuses et chanteurs ont disposé de ressources … | pair | — |
| 42 | `L:32` | … pour permettre au lecteur de produire des transcriptions originales … | … pour vous permettre de produire des transcriptions originales … | neutral | — |
| 43 | `L:69` | Le chanteur la connaît du français. | Vous la connaissez du français. | neutral | — |
| 44 | `L:97` | Le son véritablement nouveau pour la plupart des chanteurs. | Le son véritablement nouveau pour la plupart des chanteuses et chanteurs. | pair | — |
| 45 | `L:113` | … selon leur degré de familiarité pour les lecteurs de l'alphabet latin. | … selon leur degré de familiarité pour qui lit l'alphabet latin. | neutral | — |
| 46 | `L:120` (table head) | Ce que le chanteur connaît déjà | Ce que vous connaissez déjà | neutral | — |
| 47 | `L:123` | Le chanteur qui lit [ɛ] du français ou de l'italien est déjà presque à destination. | Si vous lisez [ɛ] du français ou de l'italien, vous êtes déjà presque à destination. | neutral | — |
| 48 | `L:127` | Le chanteur qui a chanté les dentales italiennes ou françaises effectue déjà cet ajustement. | Si vous avez chanté les dentales italiennes ou françaises, vous effectuez déjà cet ajustement. | neutral | — |
| 49 | `L:133` | … différents de ceux auxquels les chanteurs non natifs sont habitués. | … différents de ceux auxquels les chanteuses et chanteurs non natifs sont habitués. | pair | adj. « natifs », « habitués » masculine plural |
| 50 | `L:147` | Un chanteur déchiffrant le cyrillique pour la première fois commettra presque certainement une erreur de lecture … | Qui déchiffre le cyrillique pour la première fois commettra presque certainement une erreur de lecture … | neutral | — |
| 51 | `L:193` | … le chanteur non natif doit savoir, soit par le contexte, soit par un dictionnaire, … | … la chanteuse ou le chanteur non natif doit savoir, soit par le contexte, soit par un dictionnaire, … | pair | adj. « natif » masculine |
| 52 | `L:193` | … mais le chanteur travaillant à partir d'une partition imprimée sans l'aide d'Ilya fait face à un véritable défi. | … mais sans l'aide d'Ilya, une partition imprimée pose un véritable défi. | neutral | — |
| 53 | `L:668` | Les chanteurs rencontrent le cyrillique dans les partitions imprimées … | On rencontre le cyrillique dans les partitions imprimées … | neutral | — |
| 54 | `L:686` | C'est le fait le plus déterminant de la prononciation russe pour les chanteurs. | C'est le fait le plus déterminant de la prononciation russe chantée. | neutral | — |
| 55 | `L:717` | Les chanteurs rencontrent des homographes dans le répertoire courant, … | Le répertoire courant contient des homographes, … | neutral | — |
| 56 | `L:717` | … l'accent détermine à lui seul si le chanteur déplore un tourment ou parle de pâtisserie. | … l'accent détermine à lui seul si l’on déplore un tourment ou si l’on parle de pâtisserie. | neutral | — |
| 57 | `L:732` | Le chanteur n'a pas besoin de maîtriser cette grammaire. | Vous n'avez pas besoin de maîtriser cette grammaire. | neutral | — |
| 58 | `L:736` | La responsabilité du chanteur est de vérifier l'accent … | Votre responsabilité est de vérifier l'accent … | neutral | — |
| 59 | `L:738` | L'utilisateur doit choisir le bon homographe … | Vous devez choisir le bon homographe … | neutral | — |
| 60 | `L:742` | Le compositeur écrit un rythme; le chanteur ne peut prolonger une syllabe accentuée … | La partition fixe un rythme; on ne peut prolonger une syllabe accentuée … | neutral | — |
| 61 | `L:750` | … la plus fréquente chez les chanteurs non natifs. | … la plus fréquente chez les chanteuses et chanteurs non natifs. | pair | adj. masculine plural |
| 62 | `L:750` | … mais le chanteur gagne à savoir reconnaitre les suffixes courants … | … mais vous gagnez à savoir reconnaitre les suffixes courants … | neutral | — |
| 63 | `L:772` | … ceux sur lesquels le chanteur peut compter avant que … | … ceux sur lesquels vous pouvez compter avant que … | neutral | — |
| 64 | `L:791` | Le seul son véritablement nouveau pour de nombreux chanteurs. | Le seul son véritablement nouveau pour de nombreuses chanteuses et de nombreux chanteurs. | pair | det. « nombreuses … nombreux » |
| 65 | `L:803` | Le chanteur doit savoir que le /o/ russe est beaucoup plus détendu … | Sachez que le /o/ russe est beaucoup plus détendu … | neutral | — |
| 66 | `L:807` | … la vue du /ɔ/ invite le chanteur à élargir les lèvres, … | … la vue du /ɔ/ invite à élargir les lèvres, … | neutral | — |
| 67 | `L:807` | … le chanteur peut le nuancer pour la beauté du timbre, … | … vous pouvez le nuancer pour la beauté du timbre, … | neutral | — |
| 68 | `L:870` to `:873` (table, four cells) | le /ɑ/ (/ɛ/, /o/, /u/) que le chanteur connaît déjà | le /ɑ/ (/ɛ/, /o/, /u/) que vous connaissez déjà | neutral | — |
| 69 | `L:899` | En russe chanté, le compositeur prescrit les durées rythmiques, … | En russe chanté, la partition prescrit les durées rythmiques, … | neutral | — |
| 70 | `L:909` | … pour éviter que les chanteurs formés en diction française n’arrondissent les lèvres. | … pour éviter que les chanteuses et chanteurs formés en diction française n’arrondissent les lèvres. | pair | adj. « formés » |
| 71 | `L:958` | La reconstitution offre au chanteur une option raisonnée … | La reconstitution vous offre une option raisonnée … | neutral | — |
| 72 | `L:979` | Les russophones savent et comprennent que … | No draft: « russophones » is épicène and the article « les » is common. | none | — |
| 73 | `L:980` (Dann's voice) | J’affirme que sur des notes tenues ou dans des tempi plus lents, le chanteur peut reconstituer vers [ɛ]. | J’affirme que sur des notes tenues ou dans des tempi plus lents, on peut reconstituer vers [ɛ]. | neutral | — |
| 74 | `L:980` (Dann's voice) | D’après mon expérience, les locuteurs natifs russes et les coaches préconisent systématiquement ce choix. | D’après mon expérience, les locutrices et locuteurs natifs russes et les coachs préconisent systématiquement ce choix. | pair | adj. « natifs »; « coach » is épicène (OQLF plural « coachs »; the current « coaches » is the English plural) |
| 75 | `L:985` | La meilleure confirmation vient d’un coach russe natif; | La meilleure confirmation vient d’une ou d’un coach de langue maternelle russe; | pair of determiners | det.; « natif » removed with the rewording |
| 76 | `L:985` | … afin que le chanteur puisse comparer les deux lectures et faire un choix éclairé. | … afin que vous puissiez comparer les deux lectures et faire un choix éclairé. | neutral | — |
| 77 | `L:1001` | … des sons que le chanteur connaît déjà de l’anglais, … | … des sons que vous connaissez déjà de l’anglais, … | neutral | — |
| 78 | `L:1003` | Les chanteurs formés en diction italienne ou française ont déjà intériorisé cet ajustement. | Si vous êtes formé en diction italienne ou française, vous avez déjà intériorisé cet ajustement. *Pair:* Les chanteuses et chanteurs formés en diction italienne ou française … | neutral or pair | the neutral needs « formé » or « formée »; the pair avoids that, so **the pair is the stronger draft here** |
| 79 | `L:1007` | … des consonnes que le chanteur connaît de l’italien … | … des consonnes que vous connaissez de l’italien … | neutral | — |
| 80 | `L:1007` | … (les chanteurs francophones l’ont déjà). | … (les francophones l’ont déjà). | neutral | « francophones » épicène |
| 81 | `L:1038` | Le chanteur formé en diction allemande comprend déjà ce principe : … | La chanteuse ou le chanteur formé en diction allemande comprend déjà ce principe : … | pair | adj. « formé » masculine, nearest noun |
| 82 | `L:1058` | Quels sons exigent l’attention ciblée du chanteur? | Quels sons exigent une attention ciblée? | neutral | — |
| 83 | `L:1081` | Les chanteurs formés en diction allemande savent produire /χ/ … | Les chanteuses et chanteurs formés en diction allemande savent produire /χ/ … | pair | adj. |
| 84 | `L:1089` | Les chanteurs francophones reconnaîtront ⟨ж⟩ de je, jour, rouge. | Les francophones reconnaîtront ⟨ж⟩ de je, jour, rouge. | neutral | épicène |
| 85 | `L:1091` | … parce que les locuteurs russes tendent à réarticuler ce son … | … parce que les russophones tendent à réarticuler ce son … | neutral | épicène |
| 86 | `L:1095` | Les chanteurs germanophones connaissent ce son … | Les germanophones connaissent ce son … | neutral | épicène |
| 87 | `L:1097` | Les chanteurs italophones le connaissent … | Les italophones le connaissent … | neutral | épicène |
| 88 | `L:1097` | … ou partout où le locuteur prononce cette affriquée en se préparant à la suivre de la voyelle [i]. | … ou partout où cette affriquée se prononce en préparation de la voyelle [i]. | neutral | — |
| 89 | `L:1149` | … d’habitude il indique au chanteur que la consonne précédente est molle. | … d’habitude il indique que la consonne précédente est molle. | neutral | « il » is the soft sign, unchanged |
| 90 | `L:1167` | Les chanteurs formés en diction allemande connaissent déjà cette règle : … | Les chanteuses et chanteurs formés en diction allemande connaissent déjà cette règle : … | pair | adj. |
| 91 | `L:1214` | … en raison de sa familiarité pour les chanteurs habitués à la diction lyrique française et italienne. | … en raison de sa familiarité pour les chanteuses et chanteurs habitués à la diction lyrique française et italienne. | pair | adj. « habitués » |
| 92 | `L:1217` | Un débutant risque moins de confondre [ɲ] avec [nj], … | Une débutante ou un débutant risque moins de confondre [ɲ] avec [nj], … | pair | det. |
| 93 | `L:1350` | Le chanteur qui palatalise bien optimise simultanément le conduit vocal … | Bien palataliser optimise simultanément le conduit vocal … | neutral | — |
| 94 | `L:1406` | Le chanteur qui consulte la sortie d’Ilya voit [ʲ] partout où … | Dans la sortie d’Ilya, [ʲ] apparait partout où … | neutral | — |
| 95 | `L:1409` | … car le chanteur les rencontrera dans d’autres ressources. | … car vous les rencontrerez dans d’autres ressources. | neutral | — |
| 96 | `L:1451` | … la distinction même que le chanteur a besoin de voir. | … la distinction même qu’il faut voir. | neutral | — |
| 97 | `L:1455` | Le chanteur qui consulte d’autres ressources doit savoir que les symboles peuvent différer, et s’y adapter. | Dans d’autres ressources, les symboles peuvent différer : il faut s’y adapter. | neutral | — |
| 98 | `L:1460` | Le chanteur qui connait les agents palatalisants (6.2) et les six frontières ci-dessous peut prédire la palatalisation pour à peu près n’importe quel mot. | Si vous connaissez les agents palatalisants (6.2) et les six frontières ci-dessous, vous pouvez prédire la palatalisation pour à peu près n’importe quel mot. | neutral | — |
| 99 | `L:1532` | La frontière que le chanteur rencontre le plus fréquemment à l’intérieur d’un mot est la première : … | La frontière la plus fréquente à l’intérieur d’un mot est la première : … | neutral | — |
| 100 | `L:1538` | Le chanteur qui a intériorisé les trois consonnes toujours dures de la section 5 connait déjà … | Si vous avez intériorisé les trois consonnes toujours dures de la section 5, vous connaissez déjà … | neutral | — |
| 101 | `L:1561` | Le chanteur sait désormais ce qu’est la palatalisation (6.1), … | Vous savez désormais ce qu’est la palatalisation (6.1), … | neutral | — |
| 102 | `L:1570` | Le chanteur les a toutes rencontrées en section 5. | Vous les avez toutes rencontrées en section 5. | neutral | « toutes » refers to the consonants, unchanged |
| 103 | `L:1612` | Le chanteur qui a intériorisé ce tableau peut examiner n’importe quelle consonne … | Ce tableau intériorisé, vous pouvez examiner n’importe quelle consonne … | neutral | — |
| 104 | `L:1734` | Le chanteur qui peut expliquer pourquoi мять … a intériorisé le système. | Si vous pouvez expliquer pourquoi мять … , vous avez intériorisé le système. | neutral | — |
| 105 | `L:1764` | Le chanteur ne choisit pas entre les deux. | Il n’y a pas à choisir entre les deux. | neutral | — |
| 106 | `L:1832` | Les linguistes identifient la classe de consonnes … | No draft: « linguistes » is épicène and « les » is common. | none | — |
| 107 | `L:1849` | Le chanteur reconnaitra les six premières paires … / Rares au sein d’un mot, le chanteur doit savoir qu’elles existent, … | Vous reconnaitrez les six premières paires … / Rares au sein d’un mot, elles existent pourtant, car Ilya les produira lorsque les conditions les exigeront. | neutral | « elles » (the pairs) unchanged. The current second sentence also has a dangling modifier (« Rares », which describes the pairs, attaches to « le chanteur »); the draft removes it |
| 108 | `L:1851` | … bien que nos collègues linguistes puissent attester … | No draft: « collègues » and « linguistes » are épicène, and « nos » is common. | none | — |
| 109 | `L:1855` | Ce comportement n’est pas intuitif pour le chanteur qui aborde la diction lyrique russe. | Ce comportement n’est pas intuitif quand on aborde la diction lyrique russe. | neutral | — |
| 110 | `L:1857` | Chaque fois que le chanteur rencontre la lettre ⟨в⟩ devant une autre consonne, … | Chaque fois que la lettre ⟨в⟩ précède une autre consonne, … | neutral | — |
| 111 | `L:1875` | Si le chanteur rencontre un groupe de la forme obstruante + sonante + obstruante, … | Dans un groupe de la forme obstruante + sonante + obstruante, … | neutral | — |
| 112 | `L:1877` | Le chanteur a déjà intégré le contraste : … | Vous avez déjà intégré le contraste : … | neutral | — |
| 113 | `L:1911` | C’est ici que le chanteur voit l’assimilation transfrontalière rendue visible dans Ilya. | C’est ici que l’assimilation transfrontalière devient visible dans Ilya. | neutral | — |
| 114 | `L:1913` | Peu fréquents mais non rares, le chanteur doit savoir qu’ils existent, … | Peu fréquents mais non rares, ils existent, car Ilya les produira lorsque les conditions les exigeront. | neutral | same dangling modifier as #107, removed |
| 115 | `L:1923` | La continuité est l’état par défaut, mais le chanteur ou le compositeur choisit quand la rompre. | La continuité est l’état par défaut, mais l’interprète ou la partition choisit quand la rompre. | neutral | « interprète » épicène with « l’ » |
| 116 | `L:1925` | L’oreille du chanteur, son répétiteur et son instinct interprétatif demeurent indispensables … | Votre oreille, votre répétitrice ou répétiteur et votre instinct interprétatif demeurent indispensables … | neutral + pair | « votre » serves both nouns |
| 117 | `L:1929` | Le chanteur connait déjà ce phénomène par le français : … | Vous connaissez déjà ce phénomène par le français : … | neutral | — |
| 118 | `L:1950` | Chaque chanteur de russe connait cette salutation. | Quiconque chante en russe connait cette salutation. | neutral | — |
| 119 | `L:1990` | … le chanteur la prononce-t-il une fois ou deux? | … la prononce-t-on une fois ou deux? | neutral | — |
| 120 | `L:1994` | Le chanteur qui arrive de la diction italienne doit recalibrer ses attentes. | Si vous arrivez de la diction italienne, recalibrez vos attentes. | neutral | « ses » becomes « vos » |
| 121 | `L:2010` | Là encore, rien ne remplace l’oreille d’un répétiteur natif. | Là encore, rien ne remplace l’oreille d’une répétitrice ou d’un répétiteur natif. | pair | adj. « natif » masculine, nearest noun |
| 122 | `L:2028` | Chaque règle dont le chanteur a besoin pour lire un texte russe à l’aide d’Ilya a été présentée, … | Chaque règle dont vous avez besoin pour lire un texte russe à l’aide d’Ilya a été présentée, … | neutral | — |
| 123 | `L:2028` | Et pour ce qu’aucune règle ni aucun outil ne saurait entièrement saisir, il y a l’oreille d’un répétiteur natif. | … il y a l’oreille d’une répétitrice ou d’un répétiteur natif. | pair | as #121 |
| 124 | `L:2040` | Un chanteur qui en maîtrise les principes peut aborder un texte russe inconnu … | Qui en maîtrise les principes peut aborder un texte russe inconnu … | neutral | — |
| 125 | `L:2040` | … celui où les règles prédisent les résultats et où le chanteur peut les appliquer à des mots jamais rencontrés. | … et où vous pouvez les appliquer à des mots jamais rencontrés. | neutral | — |
| 126 | `L:2044` | … mais aucun principe phonologique ne permet au chanteur de prédire que ce /s/ précis se palatalise. | … mais aucun principe phonologique ne permet de prédire que ce /s/ précis se palatalise. | neutral | — |
| 127 | `L:2044` | … que le chanteur formé uniquement à l’oreille risque d’importer des habitudes de parole … | … qu’une formation uniquement à l’oreille risque d’importer des habitudes de parole … | neutral | — |
| 128 | `L:2044` | … est un savoir que le chanteur doit simplement posséder. | … est un savoir qu’il faut simplement posséder. | neutral | — |
| 129 | `L:2048` | Ilya ne présente pas ces cas comme des règles que le chanteur aurait manquées, … | Ilya ne présente pas ces cas comme des règles que vous auriez manquées, … | neutral | « manquées » agrees with « règles », unchanged |
| 130 | `L:2050` | Ilya prépare le chanteur à ces conversations, mais ne saurait s’y substituer. | Ilya vous prépare à ces conversations, mais ne saurait s’y substituer. | neutral | — |

Rows 72, 106, and 108 carry no draft; they stay in the table so every hit read is visible. By the Form column: 84 neutral, 32 pair (one of them addressed to « vous »), 1 pair of determiners, 11 offering both a pair and a neutral form, and 3 with none.

## Left alone, with the reason

- **Grayson's Introduction, translated** (`G:212` to `:216`, and his words quoted again at `G:246`): « m'est venue en écoutant plusieurs chanteurs », « chacun lisait », « la majorité des étudiants en chant », « Je souhaite offrir au chanteur », « des chanteurs bien formés », « Le chanteur qui consultera mes descriptions … il y trouvera », « donnera aux chanteurs ». A quoted author's words.
- **Named people, in their own gender:** Grayson (`G:200` « un chercheur », `G:202` « l'auteur de la thèse », `G:204` « Professeur de chant »); Dann (`G:222` « l'auteur d'une thèse », `G:234` « Mot du créateur »); Derek Boemler and Ian Howell (`G:242` « mon collègue », « un autre ami », « Ces collègues »); Claude (`G:252` « chef de projet »); Kimi (`G:262` « directrice UX »); Alexei Kochetov (`L:980` « locuteur natif russe et phonéticien »).
- **Titles and names:** *Sung Russian for the Low Male Voice Classical Singer* (`G:222`), the *Handbook of the International Phonetic Association*, Wall's *International Phonetic Alphabet for Singers*.
- **Not persons:** « Faux amis » (`L:131`, a linguistics term); « un ami » and « ami » as glosses of друг (`L:1174`, `:1192`, the Russian word's meaning); « lecteur » as the score reader (`I:1010`, `I:1057`, `G:275`); « expérience utilisateur » (`G:266`, a fixed term); « chacun » and « chacune » for letters, toggles, fields, and punctuation (`L:44`, `:47`, `:58`, `:1229`, `:1590`, `:1879`; `G:68`, `:177`); « chief (« chef ») » as a gloss of an English word (`L:1097`); « personne » as a pronoun (`L:805`) and in « toute personne qui chante » (`G:281`, already neutral); « personne » as a grammatical person (`packages/dictionary/src/gloss.ts:212`, code); « rigueur scientifique » (`G:206`, adjective); « l'interprète » (`G:262`, épicène, inside Kimi's quoted question).
- **The verb « s’élever »** (`L:185`, `:1071`, `:1204`, `:1346`; `data/blurb-composer.json`, 14 templates).
- **English Learn** (`L:3034`, `:3930`, `:4015`, `:4033`, « coach »).
- **Dictionary glosses** (`data/homographs.json`, `data/dictionary.*`), kaikki.org text.

## Gates

This row changes no code. The eight gates were run on the tree with this report: 251 passed (251); 235 passed (235); 0 errors and 12 warnings in 5 files; 2094 passed (2094); 650 passed and 5 skipped (655); 145 passed (145); 55 passed (55); ratchets OK. No count moved from row 65.

## Could not establish

- **That the list is complete.** The search is by noun. A sentence that names a person by a noun not on the list, or that agrees in the masculine with no person noun present (for example « vous êtes prêt »), is not found by it. A second pass for masculine-only adjectives after « vous » is the next step if Dann wants it. NOT ESTABLISHED.
- **Strings outside the searched files.** French in `apps/web/static` (the service worker, the manifest) and in `tools/` was not searched.
- **The register.** Learn's « vous » drafts change who the prose addresses, sentence by sentence. Learn already speaks to « vous » in many places, but a paragraph that mixes « vous » and a pair may read unevenly. That is French and taste, and it is Dann's.
- **The OQLF citation** is the brief's, not re-read by this session.
