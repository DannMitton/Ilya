# Draft: the Guide on the poem and the lyrics (r1, 2026-10-16, desk, Opus)

For Dann's ruling. Place: a new h4 in "How Ilya Works", after "What happens when I paste a Russian text?" (`GuideContent.svelte`, EN `guide-paste` :321, FR :32), DESK DEFAULT. Serves rows 109 and 110 (N.186) and Dann 2026-10-16 20:37: *"We also need to describe this fiunctionality in GUIDE"*.

## English

**Why does Ilya keep both the poem and the lyrics?**

The Input field holds two texts of one song. Poem is the poem as its author published it. Lyrics is the text as the composer set it, with every change: repeats, omissions, additions, and altered words. Until a score with words arrives, Text transcribes whatever you paste, type, or drop, in either view. When a score's sung words fill Lyrics, Ilya places each syllable under its note. Lyrics colours the words that differ from the poem; Poem greys any words the composer left out. Text transcribes Lyrics by default, because the sound of a sung word depends on the words beside it. To review the authoritative poem itself anytime, choose Poem in Text: Ilya transcribes the whole poem as published, including the words the composer left out.

## French

**Pourquoi Ilya conserve-t-il le poème et les paroles?**

Le champ Entrée contient deux textes d’un même chant. Poème est le poème tel que son auteur l’a publié. Paroles est le texte tel que le compositeur l’a mis en musique, avec tous ses changements : reprises, omissions, ajouts et mots modifiés. Tant qu’aucune partition avec paroles n’est arrivée, Texte transcrit ce que vous collez, saisissez ou déposez, dans l’un ou l’autre champ. Lorsque les paroles chantées d’une partition remplissent le champ Paroles, Ilya place chaque syllabe sous sa note. Le champ Paroles met en couleur les mots qui diffèrent du poème; le champ Poème grise tout mot que le compositeur a laissé de côté. Par défaut, Texte transcrit le champ Paroles, car le son d’un mot chanté dépend des mots qui l’entourent. Pour consulter à tout moment le poème lui-même, qui fait autorité, choisissez Poème dans l’onglet Texte : Ilya transcrit alors le poème entier, tel que publié, y compris les mots que le compositeur a laissés de côté.

Adopted: « le champ Entrée » (`i18n.ts:1021`), « le champ » before a view (Dann 19:58), « collez, saisissez ou déposez » (`intake.placeholder`), « une reprise, un changement ou un ajout » (`intake.view.lyricsLine`), « grisés », « laissés de côté » (`intake.view.omittedLine`), « onglets » (Guide, `guide-walk-tabs`), « qu’Ilya » (`upload.ask.title`). Coined: the heading, « mis en musique » (flagged: the app renders the score's "sets" as « les place »), « met en couleur », « le son d’un mot chanté dépend des mots qui l’entourent ». Agreements checked: « l’a publié » and « l’a mis » (le poème, le texte), « l’avez modifié » (le champ Paroles).

2026-10-16 20:50, Dann added "omission" to the English; the French follows (« chaque omission », coined; « omission » is feminine, « chaque » does not agree).
2026-10-16 20:51, Dann: start the list with "change", then name its kinds. The kind once called "change" becomes "altered words" (« mots modifiés », coined).
2026-10-16 20:54, Dann: "Poem greys any words the composer left out." FR « tout mot … laissé » (masculine singular, agreeing with « mot »), coined.
2026-10-16 20:55, Dann: "To review the authoritative poem itself anytime,". FR « consulter à tout moment », « qui fait autorité », coined.
2026-10-16 21:0x, desk: the clause "unless you have edited it" removed after Dann's 20:58 widening of default 8; the sentence now states only what is true of the build at ship time.
