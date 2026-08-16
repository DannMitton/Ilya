/* ═══════════════════════════════════════════════════════════
   ILYA — Internationalisation
   English / French bilingual translation system.
   Missing keys show [MISSING: key] to enforce 100% parity.
   ═══════════════════════════════════════════════════════════ */

export type Language = 'en' | 'fr';

const strings: Record<string, Record<Language, string>> = {

	// ── App header ───────────────────────────────────────────
	'app.subtitle':                { en: 'Russian Lyric Diction',        fr: 'Diction lyrique russe' },

	// ── Dictionary status ────────────────────────────────────
	'dict.loading':                { en: 'Loading dictionary\u2026',     fr: 'Chargement du dictionnaire\u2026' },
	'dict.words':                  { en: 'words',                        fr: 'mots' },
	'dict.inflections':            { en: 'inflections',                  fr: 'flexions' },

	// ── Drawer ───────────────────────────────────────────────
	'drawer.collapse':             { en: 'Collapse drawer',              fr: 'Réduire le tiroir' },
	'drawer.expand':               { en: 'Expand drawer',                fr: 'Ouvrir le tiroir' },

	// ── Tab bar (N.36) ───────────────────────────────────────
	//    The labels lived in the component, so French lived in two
	//    places. Three of the four are invariant by ruling; they are
	//    keyed anyway, so the invariance is recorded here as identical
	//    en/fr values rather than as an absence from the dictionary.
	//    'Fit' is invariant by Dann's ruling of 13 July 2026; the
	//    internal tab id stays 'shane', the dictionary key does not.
	'tab.transcription':           { en: 'Transcription',                fr: 'Transcription' },
	'tab.learn':                   { en: 'Learn',                        fr: 'Leçons' },
	'tab.guide':                   { en: 'Guide',                        fr: 'Guide' },
	'tab.fit':                     { en: 'Fit',                          fr: 'Fit' },

	// ── Input area ───────────────────────────────────────────
	'input.placeholder':           { en: 'Paste Russian text here\u2026',       fr: 'Collez le texte russe ici\u2026' },
	'input.warning':               { en: 'characters. Large texts may be slow to process.', fr: 'caractères. Les textes longs peuvent être lents à traiter.' },
	'input.transcribe':            { en: 'Transcribe',                   fr: 'Transcrire' },
	'input.transcribeLoading':     { en: 'Loading dictionary\u2026',     fr: 'Chargement du dictionnaire\u2026' },
	'input.clear':                 { en: 'Clear text',                   fr: 'Effacer le texte' },
	'input.print':                 { en: 'Print',                        fr: 'Imprimer' },

	// ── Result meta ──────────────────────────────────────────
	'result.words':                { en: 'words in',                     fr: 'mots en' },

	// ── Metadata fields ─────────────────────────────────────
	'meta.heading':                { en: 'Metadata',                     fr: 'Métadonnées' },
	'meta.title':                  { en: 'Aria or song title',            fr: 'Aria ou titre du chant' },
	'meta.composer':               { en: 'Composer',                     fr: 'Compositeur' },
	'meta.poet':                   { en: 'Poet or librettist',            fr: 'Poète ou librettiste' },
	'meta.opus':                   { en: 'Opera, song cycle, opus number', fr: 'Opéra, cycle de mélodies, numéro d\u2019opus' },
	'meta.transcriber':            { en: 'Transcriber name',             fr: 'Nom du transcripteur' },
	'meta.translator':             { en: 'Translator',                   fr: 'Traducteur' },
	'meta.transl':                 { en: 'TRANSL.',                      fr: 'TRAD.' },
	'meta.reset':                  { en: 'Reset',                        fr: 'Réinitialiser' },
	'meta.textBy':                 { en: 'Text by',                      fr: 'Texte de' },
	'meta.placeholderLine':        { en: 'Composer, opus, and poet information', fr: 'Informations sur le compositeur, l\u2019opus et le poète' },

	// ── Notation options (IPA display toggles) ──────────────
	'cosmetic.heading':            { en: 'Notation',                     fr: 'Notation' },
	'cosmetic.stressAcutes.left':  { en: 'No stress marks',             fr: 'Sans accents toniques' },
	'cosmetic.stressAcutes.right': { en: 'Apply stress acutes',         fr: 'Appliquer les accents toniques' },
	'cosmetic.reducedVowel.left':  { en: 'Default [ʌ]',                 fr: 'Par défaut [ʌ]' },
	'cosmetic.reducedVowel.right': { en: 'Display [ə] instead',         fr: 'Afficher [ə]' },
	'cosmetic.palatalNasal.left':  { en: 'Palatal nasal [ɲ]',           fr: 'Nasale palatale [ɲ]' },
	'cosmetic.palatalNasal.right': { en: 'Palatalized nasal [nʲ]',      fr: 'Nasale palatalisée [nʲ]' },
	'cosmetic.geminates.left':     { en: 'Separate geminates [tt]',     fr: 'Géminées séparées [tt]' },
	'cosmetic.geminates.right':    { en: 'Length markers [tː]',         fr: 'Marqueurs de durée [tː]' },
	'cosmetic.shcha.left':         { en: 'Shcha notation [ʃʲʃʲ]',      fr: 'Notation chtcha [ʃʲʃʲ]' },
	'cosmetic.shcha.right':        { en: 'Length marker [ʃʲː]',          fr: 'Marqueur de durée [ʃʲː]' },
	'cosmetic.reconstitution.left':  { en: 'Default reduction',            fr: 'Réduction par défaut' },
	'cosmetic.reconstitution.right': { en: 'Reconstitution',             fr: 'Reconstitution' },
	'cosmetic.openSyllabification.left':  { en: 'Default syllabification', fr: 'Syllabification par défaut' },
	'cosmetic.openSyllabification.right': { en: 'Open syllables',           fr: 'Syllabes ouvertes' },

	// ── Legacy display keys (backward compatibility) ─────────
	'display.heading':             { en: 'Display',                      fr: 'Affichage' },
	'display.stressDiacritics.left':  { en: 'No stress marks',          fr: 'Sans accents toniques' },
	'display.stressDiacritics.right': { en: 'Apply stress acutes',      fr: 'Appliquer les accents toniques' },

	// ── Legacy notation keys (kept for backward compatibility) ──
	'notation.heading':            { en: 'Notation',                     fr: 'Notation' },
	'notation.reducedVowel':       { en: 'Reduced vowel',               fr: 'Voyelle réduite' },
	'notation.reducedVowel.desc':  { en: 'ʌ → ə',                       fr: 'ʌ → ə' },
	'notation.palatalNasal':       { en: 'Palatal nasal',               fr: 'Nasale palatale' },
	'notation.palatalNasal.desc':  { en: 'ɲ → nʲ',                      fr: 'ɲ → nʲ' },
	'notation.geminates':          { en: 'Geminates',                   fr: 'Géminées' },
	'notation.geminates.desc':     { en: 'Show length markers',         fr: 'Afficher les marqueurs de durée' },
	'notation.shcha':              { en: 'Shcha notation',              fr: 'Notation chtcha' },
	'notation.shcha.desc':         { en: 'ʃʲʃʲ → ʃʲː',                 fr: 'ʃʲʃʲ → ʃʲː' },
	'notation.reconstitution':     { en: 'Reconstitution',              fr: 'Reconstitution' },
	'notation.reconstitution.desc': { en: 'Show reconstitution',        fr: 'Afficher la reconstitution' },
	'display.stressDiacritics':    { en: 'Stress diacritics',            fr: 'Diacritiques d\u2019accent' },
	'display.stressDiacritics.desc': { en: 'Show acute accent on Cyrillic', fr: 'Afficher l\u2019accent aigu sur le cyrillique' },

	// ── Inspector panel ──────────────────────────────────────
	'inspector.back':              { en: '\u2190 Back',                  fr: '\u2190 Retour' },
	'inspector.stress':            { en: 'Stress',                       fr: 'Accent tonique' },
	'inspector.syllable':          { en: 'Syllable',                     fr: 'Syllabe' },
	'inspector.clitic':            { en: 'Clitic (unstressed)',          fr: 'Clitique (atone)' },
	'inspector.cliticArrow.enclitic':       { en: 'Enclitic arrow',               fr: 'Flèche enclitique' },
	'inspector.cliticArrow.proclitic':      { en: 'Proclitic arrow',              fr: 'Flèche proclitique' },
	'inspector.cliticArrow.encliticLabel':  { en: 'Enclitic',                     fr: 'Enclitique' },
	'inspector.cliticArrow.procliticLabel': { en: 'Proclitic',                    fr: 'Proclitique' },
	'inspector.cliticArrow.encliticBlurb': { en: 'This word is an enclitic: it has no stress of its own and attaches phonologically to the preceding word. Its vowels reduce relative to the host word\u2019s stress position. On the page, an arrow (←) shows in place of IPA, and the clitic\u2019s phonetic material appears fused into the host word\u2019s IPA.', fr: 'Ce mot est un enclitique\u00a0: il n\u2019a pas d\u2019accent propre et s\u2019attache phonologiquement au mot précédent. Ses voyelles se réduisent en fonction de la position de l\u2019accent du mot hôte. Sur la page, une flèche (←) remplace l\u2019API, et le matériel phonétique du clitique apparaît fusionné dans l\u2019API du mot hôte.' },
	'inspector.cliticArrow.procliticBlurb': { en: 'This word is a proclitic: it has no stress of its own and attaches phonologically to the following word. Its vowels reduce relative to the host word\u2019s stress position. On the page, an arrow (→) shows in place of IPA, and the clitic\u2019s phonetic material appears fused into the host word\u2019s IPA.', fr: 'Ce mot est un proclitique\u00a0: il n\u2019a pas d\u2019accent propre et s\u2019attache phonologiquement au mot suivant. Ses voyelles se réduisent en fonction de la position de l\u2019accent du mot hôte. Sur la page, une flèche (→) remplace l\u2019API, et le matériel phonétique du clitique apparaît fusionné dans l\u2019API du mot hôte.' },
	'inspector.unknownStress':     { en: 'Unknown stress \u00b7 verify manually', fr: 'Accent inconnu \u00b7 vérifier manuellement' },
	'inspector.provenance':         { en: 'Provenance',                   fr: 'Provenance' },
	'inspector.ribbon':            { en: 'Character breakdown',          fr: 'Décomposition par caractère' },
	'inspector.blurbs':            { en: 'Phonological notes',           fr: 'Notes phonologiques' },
	'inspector.noBlurb':           { en: 'No phonological note for this character.', fr: 'Aucune note phonologique pour ce caractère.' },
	'inspector.notationDefault': { en: 'Notation: default (Grayson)', fr: 'Notation\u00a0: par défaut (Grayson)' },
	'inspector.glossMissing':      { en: 'No translation available for this form.',                              fr: 'Aucune traduction française disponible pour cette forme.' },

	// ── Dictionary panel (Inspector expansion) ───────────────
	'inspector.dictionary':         { en: 'Dictionary',                   fr: 'Dictionnaire' },
	'inspector.dictEntryMissing':   { en: 'Full entry unavailable',       fr: 'Entrée complète indisponible' },
	'inspector.glossFallbackEN':    { en: 'Gloss available in English only', fr: 'Glose disponible en anglais seulement' },
	'inspector.glossFallbackFR':    { en: 'Gloss available in French only',  fr: 'Glose disponible en français seulement' },
	'inspector.dictCapacity':       { en: 'Maximum 20 characters',         fr: 'Maximum de 20 caractères' },
	'inspector.dictChoose':        { en: 'Use this reading:',           fr: 'Utiliser cette lecture :' },

	// ── Grayson positional labels (Ribbon syllable group headers) ──
	'ribbon.stressed':             { en: 'stressed',                     fr: 'tonique' },
	'ribbon.unstressed':           { en: 'unstressed',                   fr: 'atone' },
	'ribbon.immediatePre':         { en: 'immediate pre-stress',         fr: 'prétonique immédiate' },
	'ribbon.remotePre':            { en: 'remote pre-stress',            fr: 'prétonique éloignée' },
	'ribbon.immediatePost':        { en: 'immediate post-stress',        fr: 'posttonique immédiate' },
	'ribbon.remotePost':           { en: 'remote post-stress',           fr: 'posttonique éloignée' },

	// ── Spot reconstitution (per-word toggle in Inspector) ────
	'inspector.spotRecon.heading':   { en: 'Reconstitution',              fr: 'Reconstitution' },
	'inspector.spotRecon.left':      { en: 'Default reduction',           fr: 'Réduction par défaut' },
	'inspector.spotRecon.right':     { en: 'Spot reconstitution',         fr: 'Reconstitution ponctuelle' },
	'inspector.spotRecon.globalOn':  { en: 'Global reconstitution is active. Disable it in Cosmetic Options to use per-word reconstitution.', fr: 'La reconstitution globale est active. Désactivez-la dans les Options cosmétiques pour utiliser la reconstitution par mot.' },

	// ── Stress source labels ─────────────────────────────────
	'stress.dictionary':           { en: 'Verified from dictionary',     fr: 'Vérifié dans le dictionnaire' },
	'stress.supplement':           { en: 'Singer supplement',            fr: 'Supplément pour chanteurs' },
	'stress.yoRule':               { en: 'Derived from ё',              fr: 'Dérivé de ё' },
	'stress.yoRestored':           { en: 'ё restored from dictionary',  fr: 'ё restauré du dictionnaire' },
	'stress.inferred':             { en: 'Algorithmically inferred',    fr: 'Inféré algorithmiquement' },
	'stress.unknown':              { en: 'Unknown \u2014 verify manually', fr: 'Inconnu \u2014 vérifier manuellement' },
	'stress.userDictionary':       { en: 'User verified',               fr: 'Vérifié par l\u2019utilisateur' },
	'stress.userComposer':         { en: 'Composer setting',            fr: 'Choix du compositeur' },
	'stress.userOverride':         { en: 'User assignment',             fr: 'Choix de l\u2019utilisateur' },

	// ── Stress assignment (Inspector) ─────────────────────────
	'inspector.stressAssign.dictionary':    { en: 'Dictionary',          fr: 'Dictionnaire' },
	'inspector.stressAssign.composer':      { en: 'Composer',            fr: 'Compositeur' },
	'inspector.stressAssign.myAssignment':  { en: 'My assignment',       fr: 'Mon choix' },
	'inspector.stressAssign.default':       { en: 'Default',             fr: 'Par défaut' },
	'inspector.yoToggle':                   { en: 'ё \u2194 е',         fr: 'ё \u2194 е' },

	// ── Word Console placeholder ─────────────────────────────
	'console.placeholder':         { en: 'Analysis',                     fr: 'Analyse' },

	// ── Paper empty state ────────────────────────────────────
	'paper.empty':                 { en: 'Enter your Cyrillic text in the drawer on the left.', fr: 'Saisissez votre texte cyrillique dans le tiroir à gauche.' },
	'paper.empty.mobile':          { en: 'Tap the chevron at the bottom to open the drawer.', fr: 'Appuyez sur le chevron en bas pour ouvrir le tiroir.' },

	// ── Provenance: VERIFY label ─────────────────────────────
	'verify.label':                { en: 'verify',                       fr: 'à vérifier' },

	// ── Per-page provenance legend ───────────────────────────
	'legend.user-dictionary':      { en: 'Verified in dictionary',       fr: 'Vérifié dans le dictionnaire' },
	'legend.user-composer':        { en: 'Composer setting',             fr: 'Réglage du compositeur' },
	'legend.user-override':        { en: 'User override',                fr: 'Correction manuelle' },
	'legend.yo':                   { en: 'ё stress',                     fr: 'Accent de ё' },
	'legend.inferred':             { en: 'Verify stress',                fr: 'Vérifier l\u2019accent' },
	'legend.spot-reconstitution':  { en: 'Spot reconstitution',          fr: 'Reconstitution ponctuelle' },

	// ── Paper footer ─────────────────────────────────────────
	// These strings contain <em> tags for italic rendering.
	// PageFooter.svelte uses {@html} to render them.
	'footer.attribution':          {
		en: 'Free and open source, <em>Ilya</em>\u00a02026a operationalizes Craig Grayson\u2019s <em>Russian Lyric Diction</em> (University of Washington, 2012). Stress data and translation glosses via <a href="https://kaikki.org" target="_blank" rel="noopener">kaikki.org</a> (<a href="https://creativecommons.org/licenses/by-sa/4.0/deed.en" target="_blank" rel="noopener">CC\u00a0BY-SA\u00a04.0</a>), test text via <a href="https://www.lieder.net" target="_blank" rel="noopener">www.lieder.net</a>. Made with love in Canada\u00a0<svg viewBox="0 0 9600 4800" aria-label="Canada" role="img" style="display:inline-block;width:14px;height:7px;vertical-align:baseline;position:relative;top:0.5px"><path fill="#f00" d="m0 0h2400l99 99h4602l99-99h2400v4800h-2400l-99-99h-4602l-99 99H0z"/><path fill="#fff" d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"/></svg>',
		fr: 'Gratuit et à code ouvert, <em>Ilya</em>\u00a02026a met en \u0153uvre <em>Russian Lyric Diction</em> de Craig Grayson (University of Washington, 2012). Données d\u2019accentuation et glossaires de traduction via <a href="https://kaikki.org" target="_blank" rel="noopener">kaikki.org</a> (<a href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr" target="_blank" rel="noopener">CC\u00a0BY-SA\u00a04.0</a>), textes d\u2019essai via <a href="https://www.lieder.net" target="_blank" rel="noopener">www.lieder.net</a>. Fait avec amour au Canada\u00a0<svg viewBox="0 0 9600 4800" aria-label="Canada" role="img" style="display:inline-block;width:14px;height:7px;vertical-align:baseline;position:relative;top:0.5px"><path fill="#f00" d="m0 0h2400l99 99h4602l99-99h2400v4800h-2400l-99-99h-4602l-99 99H0z"/><path fill="#fff" d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"/></svg>'
	},
	'footer.page':                 { en: 'Page',                         fr: 'Page' },

	// ── Update notice ─────────────────────────────────────────
	'update.notice':               { en: 'A new version of Ilya is ready.', fr: 'Une nouvelle version d\u2019Ilya est pr\u00eate.' },
	'update.action':               { en: 'Refresh',                      fr: 'Actualiser' },
	'update.dismiss':              { en: 'Dismiss',                      fr: 'Ignorer' },
	'footer.of':                   { en: 'of',                           fr: 'sur' },

	// ── Fit broad-analysis legend (§B.5) ─────────────────
	// Composed from parts so EN and FR share one structure; the two-item
	// join is language-specific (EN "a and b", FR "a ni b": "sans X ni Y").
	'fit.broad.body':              { en: 'Broad analysis: this score is shown without {items}, because the matching voice characteristics were left blank. The forecast still reflects your measured resonances.', fr: 'Analyse large : cette partition est présentée sans {items}, car les caractéristiques vocales correspondantes ont été laissées vides. La prévision reflète tout de même vos résonances mesurées.' },
	'fit.broad.itemRange':         { en: 'range guidance',               fr: 'les repères d\u2019ambitus' },
	'fit.broad.itemPassaggio':     { en: 'positional passaggio flags',   fr: 'le signalement des notes de passaggio' },
	'fit.broad.join':              { en: 'and',                          fr: 'ni' },

	// ── Fit textual witnesses (reconciliation shell, piece 3; Kimi Q1/Q2;
	//    English ruled by Dann 2026-07-16; French pending Dann's validation) ──
	'fit.witness.heading':         { en: 'Textual witnesses',            fr: 'Témoins textuels' },
	'fit.witness.agree':           { en: 'Score and poem agree',         fr: 'La partition et le poème concordent' },
	'fit.witness.divergePrefix':   { en: 'Score and poem diverge in',    fr: 'La partition et le poème divergent à' },
	'fit.witness.placeOne':        { en: 'place',                        fr: 'endroit' },
	'fit.witness.placeMany':       { en: 'places',                       fr: 'endroits' },
	'fit.witness.scoreLabel':      { en: 'Score',                        fr: 'Partition' },
	'fit.witness.poemLabel':       { en: 'Poem',                         fr: 'Poème' },
	'fit.witness.measureAbbr':     { en: 'm.',                           fr: 'm.' },

	// ── Provenance labels (for Inspector inline display) ─────
	'provenance.dictionary':       { en: 'Stress verified from dictionary',      fr: 'Accent vérifié dans le dictionnaire' },
	'provenance.supplement':       { en: 'Stress from singer supplement',        fr: 'Accent du supplément pour chanteurs' },
	'provenance.yo':               { en: 'Stress derived from ё',               fr: 'Accent dérivé de ё' },
	'provenance.inferred':         { en: 'Stress algorithmically inferred',      fr: 'Accent inféré algorithmiquement' },
	'provenance.unknown':          { en: 'Unknown stress \u2014 verify manually', fr: 'Accent inconnu \u2014 vérifier manuellement' },

	// ── Searchable select ────────────────────────────────────
	'select.filter':               { en: 'Type to filter\u2026',         fr: 'Filtrer\u2026' },
	'select.notInList':            { en: 'Not in list (enter custom)',   fr: 'Absent de la liste (saisir manuellement)' },

	// ── Mobile awareness ─────────────────────────────────────
	'mobile.heading':              { en: 'Ilya is designed for desktop',       fr: 'Ilya est conçu pour ordinateur' },
	'mobile.body':                 { en: 'Ilya produces paginated transcription documents best experienced on a larger screen with a keyboard.', fr: 'Ilya produit des documents de transcription paginés, mieux adaptés à un écran plus grand avec un clavier.' },
	'mobile.continue':             { en: 'Continue anyway',                    fr: 'Continuer quand même' },

	// ── Fit metadata auto-populate (§A.6; Kimi's rulings, 2026-07-13;
	//    agentless; copy flagged for Dann's review) ──
	'meta.fromScore':              { en: 'from score',                   fr: 'de la partition' },
	'meta.revertToScore':          { en: 'Revert to score header',       fr: 'Rétablir l’en-tête de la partition' },
	// The Q4 provenance line composes as "Arr. {name} · {detectedFrom} {format}"
	// (Kimi's §A.28 example); the format label (MusicXML, MNX) is a proper
	// name, never translated.
	'meta.arrAbbr':                { en: 'Arr.',                         fr: 'Arr.' },
	'meta.detectedFrom':           { en: 'Detected from',                fr: 'Détecté dans le fichier' },

	// ── Fit engraving controls (drawer panel beside the drop surface;
	//    agentless; copy flagged for Dann's review with the §A.13 strings) ──
	'engraving.heading':           { en: 'Engraving',                    fr: 'Gravure' },
	'engraving.staveSize':         { en: 'Stave size',                   fr: 'Taille de la portée' },
	'engraving.noteSpacing':       { en: 'Note spacing',                 fr: 'Espacement des notes' },
	'engraving.systemSpacing':     { en: 'Between systems',              fr: 'Entre les systèmes' },
	'engraving.reset':             { en: 'Reset',                        fr: 'Réinitialiser' },

	// ── Score uploader (Fit ingest widget; Round 9 §2 Items 1, 2, 6; agentless) ──
	'upload.drop.title':           { en: 'Drop a score here',            fr: 'Déposez une partition ici' },
	'upload.drop.browse':          { en: 'or click to browse',           fr: 'ou cliquez pour parcourir' },
	'upload.drop.acceptedNow': { en: 'Accepted now: MNX, MusicXML, .mxl, Finale (.musx), MuseScore (.mscz), a photograph', fr: 'Acceptés maintenant\u00a0: MNX, MusicXML, .mxl, Finale (.musx), MuseScore (.mscz), une photographie' },
	'upload.drop.comingSoon': { en: 'Coming soon: PDF, MIDI', fr: 'Bientôt\u00a0: PDF, MIDI' },
	'upload.drop.release':         { en: 'Release to add your score',    fr: 'Relâchez pour ajouter votre partition' },
	'upload.scanTooltip':          { en: 'Read a score from a photograph', fr: 'Lire une partition à partir d’une photographie' },

	'upload.status.reading':       { en: 'Reading file…',           fr: 'Lecture du fichier…' },
	'upload.status.converting':    { en: 'Converting Finale file…',  fr: 'Conversion du fichier Finale…' },
	'upload.status.convertingMscz':{ en: 'Converting MuseScore file…', fr: 'Conversion du fichier MuseScore…' },

	'upload.format.mnxDirect': { en: 'Format: MNX (direct)', fr: 'Format\u00a0: MNX (direct)' },
	'upload.format.musicxmlDirect': { en: 'Format: MusicXML (direct)', fr: 'Format\u00a0: MusicXML (direct)' },
	'upload.format.mxl': { en: 'Format: MusicXML (.mxl)', fr: 'Format\u00a0: MusicXML (.mxl)' },
	'upload.format.musxDenigma': { en: 'Format: Finale .musx → MNX', fr: 'Format\u00a0: Finale .musx → MNX' },
	'upload.format.msczWebmscore': { en: 'Format: MuseScore → MusicXML', fr: 'Format\u00a0: MuseScore → MusicXML' },

	'upload.banner.denigma':       { en: 'Converted from Finale format by denigma. Lyric alignment and measure structure are preserved. Verify custom expressions or complex layouts if the score appears unusual.', fr: 'Converti depuis le format Finale par denigma. L’alignement des paroles et la structure des mesures sont préservés. Vérifiez les expressions personnalisées ou les mises en page complexes si la partition semble inhabituelle.' },
	'upload.banner.dismiss':       { en: 'Dismiss',                      fr: 'Ignorer' },

	'upload.continue':             { en: 'Continue to analysis',         fr: 'Continuer vers l’analyse' },
	'upload.tryAnother':           { en: 'Try another file',             fr: 'Essayer un autre fichier' },

	'upload.mus.trigger': { en: 'Have an older Finale file (.mus, pre-2014)?', fr: 'Vous avez un ancien fichier Finale (.mus, avant 2014)\u00a0?' },
	'upload.mus.intro': { en: 'Finale files from 2014 onward (.musx) are supported. For older .mus files, there are three options:', fr: 'Les fichiers Finale à partir de 2014 (.musx) sont pris en charge. Pour les anciens fichiers .mus, trois options s\u2019offrent à vous\u00a0:' },
	'upload.mus.opt1':             { en: '1. Open the file in any Finale version from 2014 or later and resave it as .musx, then upload.', fr: '1. Ouvrez le fichier dans une version de Finale de 2014 ou ultérieure et réenregistrez-le en .musx, puis téléversez-le.' },
	'upload.mus.opt2':             { en: '2. Print to PDF and upload the PDF. (PDF import is coming soon.)', fr: '2. Imprimez en PDF et téléversez le PDF. (L’import PDF arrive bientôt.)' },
	'upload.mus.opt3':             { en: '3. Export to MusicXML from Finale and upload that file.', fr: '3. Exportez en MusicXML depuis Finale et téléversez ce fichier.' },
	'upload.mus.trial':            { en: 'If Finale is no longer available, a trial version can be downloaded for this purpose.', fr: 'Si Finale n’est plus disponible, une version d’essai peut être téléchargée à cette fin.' },

	'upload.soon.mscz':            { en: 'MuseScore (.mscz) import is coming soon.', fr: 'L’import MuseScore (.mscz) arrive bientôt.' },
	'upload.soon.pdf':             { en: 'PDF import is coming soon.',    fr: 'L’import PDF arrive bientôt.' },
	// ── N.59: the page reader ────────────────────────────────────────
	// The two questions the reader cannot answer for itself (Ruling A), the
	// read report the drawer declares (Ruling D), and the reader's fidelity
	// tier. Every French term here is adopted, ordinary musical French:
	// clé, armure, dièse, bémol, portée, interligne, silence. Nothing coined.
	'upload.status.readingPage':   { en: 'Reading the page…', fr: 'Lecture de la page…' },
	'upload.status.preparingReader': { en: 'Preparing the page reader. This will only happen once.', fr: 'Préparation du lecteur de page. Cela n’arrivera qu’une fois.' },
	'upload.format.imageReader':   { en: 'Format: photograph → MusicXML', fr: 'Format\u00a0: photographie → MusicXML' },
	'upload.banner.reader':        { en: 'Read from a picture. Ilya worked the notes out from the ink, so check them against your own paper before you trust them. The words are not in a picture; type them in Transcription.', fr: 'Lu à partir d’une image. Ilya a déduit les notes de l’encre, alors vérifiez-les sur votre propre partition avant de vous y fier. Les paroles ne sont pas dans une image\u00a0; saisissez-les dans Transcription.' },

	'upload.ask.title':            { en: 'Two things Ilya cannot see', fr: 'Deux choses qu’Ilya ne peut pas voir' },
	'upload.ask.why':              { en: 'Ilya reads the notes off the picture, but not the clef or the key signature. Read those off your own paper.', fr: 'Ilya lit les notes sur l’image, mais ni la clé ni l’armure. Lisez-les sur votre propre partition.' },
	'upload.ask.clef':             { en: 'Clef', fr: 'Clé' },
	'upload.ask.clefTreble':       { en: 'Treble', fr: 'Clé de sol' },
	'upload.ask.clefTrebleOttava': { en: 'Treble, sounding an octave lower', fr: 'Clé de sol, à l’octave inférieure' },
	'upload.ask.clefBass':         { en: 'Bass', fr: 'Clé de fa' },
	'upload.ask.key':              { en: 'Key signature', fr: 'Armure' },
	'upload.ask.keyNone':          { en: 'No sharps or flats', fr: 'Aucune altération' },
	'upload.ask.keySharp':         { en: '1 sharp', fr: '1 dièse' },
	'upload.ask.keySharps':        { en: '%s sharps', fr: '%s dièses' },
	'upload.ask.keyFlat':          { en: '1 flat', fr: '1 bémol' },
	'upload.ask.keyFlats':         { en: '%s flats', fr: '%s bémols' },
	'upload.ask.read':             { en: 'Read this page', fr: 'Lire cette page' },
	'upload.ask.cancel':           { en: 'Cancel', fr: 'Annuler' },

	'upload.report.title':         { en: 'What Ilya read', fr: 'Ce qu’Ilya a lu' },
	'upload.report.systems':       { en: '%s systems, %s staves', fr: '%s systèmes, %s portées' },
	'upload.report.spacing':       { en: 'Staff spacing: %s px', fr: 'Interligne\u00a0: %s px' },
	'upload.report.events':        { en: '%s notes, %s rests, %s measures', fr: '%s notes, %s silences, %s mesures' },
	'upload.report.seconds':       { en: 'Read in %s s', fr: 'Lu en %s s' },
	'upload.report.pitchSubs':     { en: 'Pitch assumed on %s notes (measures %s).', fr: 'Hauteur supposée sur %s notes (mesures %s).' },
	'upload.report.durationSubs':  { en: 'Length assumed on %s notes (measures %s).', fr: 'Durée supposée sur %s notes (mesures %s).' },
	'upload.report.staffFallback': { en: 'Ilya could not tell which staff carries the voice in %s systems, and read the top one.', fr: 'Ilya n’a pas pu déterminer quelle portée porte la voix dans %s systèmes, et a lu celle du haut.' },

	'upload.err.readerLoadFailed': { en: 'The page reader could not be loaded. Check your connection and try again.', fr: 'Le lecteur de page n’a pas pu être chargé. Vérifiez votre connexion et réessayez.' },
	'upload.err.pageReadFailed':   { en: 'Ilya could not read this page. A flat, straight photograph of the whole page reads best.', fr: 'Ilya n’a pas pu lire cette page. Une photographie bien à plat et droite de la page entière se lit le mieux.' },
	'upload.err.imageUndecodable': { en: 'This browser cannot open that picture. A JPEG or a PNG will work.', fr: 'Ce navigateur ne peut pas ouvrir cette image. Un JPEG ou un PNG fonctionnera.' },

	'upload.soon.midi':            { en: 'MIDI import is coming soon.',   fr: 'L’import MIDI arrive bientôt.' },

	'upload.err.mus':              { en: 'This is a pre-2014 Finale file (.mus). This closed format cannot be read directly. Resave it as .musx in Finale 2014 or later, or export it to MusicXML, then upload again.', fr: 'Ceci est un fichier Finale antérieur à 2014 (.mus). Ce format fermé ne peut pas être lu directement. Réenregistrez-le en .musx dans Finale 2014 ou ultérieur, ou exportez-le en MusicXML, puis téléversez-le à nouveau.' },
	'upload.err.invalidMnxJson':   { en: 'This .mnx file is not valid MNX JSON.', fr: 'Ce fichier .mnx n’est pas un MNX JSON valide.' },
	'upload.err.jsonNotMnx':       { en: 'This JSON file is not an MNX score.', fr: 'Ce fichier JSON n’est pas une partition MNX.' },
	'upload.err.xmlNotMusicxml':   { en: 'This XML file is not MusicXML.', fr: 'Ce fichier XML n’est pas du MusicXML.' },
	'upload.err.xmlRootIs':        { en: 'The root element is %s.',      fr: 'L’élément racine est %s.' },
	'upload.err.zipUnrecognised':  { en: 'This ZIP file is not a recognised score container.', fr: 'Ce fichier ZIP n’est pas un conteneur de partition reconnu.' },
	'upload.err.mxlUnreadable':    { en: 'This .mxl file could not be opened. It may be corrupt.', fr: 'Ce fichier .mxl n’a pas pu être ouvert. Il est peut-être corrompu.' },
	'upload.err.mxlNoRootfile':    { en: 'No score was found inside this .mxl archive.', fr: 'Aucune partition n’a été trouvée dans cette archive .mxl.' },
	'upload.err.msczUnreadable':   { en: 'This .mscz file could not be opened. It may be corrupt.', fr: 'Ce fichier .mscz n’a pas pu être ouvert. Il est peut-être corrompu.' },
	'upload.err.conversionFailed': { en: 'This Finale file could not be converted.', fr: 'Ce fichier Finale n’a pas pu être converti.' },
	'upload.err.wasmLoadFailed':   { en: 'The Finale converter could not load. Reload the page and try again.', fr: 'Le convertisseur Finale n’a pas pu se charger. Rechargez la page et réessayez.' },
	'upload.err.msczConversionFailed': { en: 'This MuseScore file could not be converted.', fr: 'Ce fichier MuseScore n’a pas pu être converti.' },
	'upload.err.msczWasmLoadFailed':   { en: 'The MuseScore converter could not load. Reload the page and try again.', fr: 'Le convertisseur MuseScore n’a pas pu se charger. Rechargez la page et réessayez.' },
	'upload.err.tooLarge':         { en: 'This score is too large to process on this device.', fr: 'Cette partition est trop volumineuse pour être traitée sur cet appareil.' },
	'upload.err.parseFailed':      { en: 'This score could not be read. It may be incomplete or use unsupported features.', fr: 'Cette partition n’a pas pu être lue. Elle est peut-être incomplète ou utilise des fonctions non prises en charge.' },
	'upload.err.unrecognised':     { en: 'This file was not recognised as a score.', fr: 'Ce fichier n’a pas été reconnu comme une partition.' },

	// ── Calibration wizard (N.22 extraction; French placeholder = English
	//    verbatim, pending Dann's copy pass) ────────────────────────────────
	'calib.defaultVoiceName': { en: 'Voice', fr: 'Voix' },
	'calib.section.ariaLabel': { en: 'Your Resonances: voice calibration', fr: 'Vos résonances\u00a0: calibration de la voix' },
	'calib.common.continue': { en: 'Continue', fr: 'Continuer' },
	'calib.common.retake': { en: 'Re-take', fr: 'Refaire' },
	'calib.common.of': { en: 'of', fr: 'sur' },
	'calib.common.vowels': { en: 'vowels', fr: 'voyelles' },
	'calib.common.vowelWord': { en: 'Vowel', fr: 'Voyelle' },
	'calib.common.hz': { en: 'Hz', fr: 'Hz' },
	'calib.compact.vowelsSampled': { en: 'vowels sampled', fr: 'voyelles échantillonnées' },
	'calib.log.addedPrefix': { en: 'Added to progress:', fr: 'Ajouté à la progression\u00a0:' },
	'calib.log.hertz': { en: 'hertz', fr: 'hertz' },

	// N.22 (E.40): the voice switcher's own strings. This component held
	// them as English literals and did not import the dictionary at all, so
	// a French singer read English in the drawer header. Dann's ruling,
	// 2026-08-11: N.22 absorbs them. The switcher's `{name}, options` aria-
	// label is deliberately NOT keyed: 'options' is already French, so the
	// literal is correct in both languages. Do not 'fix' it.
	'calib.switcher.firstLaunchLede': { en: 'Please name your profile so we can map your voice across the ten sung Russian vowels.', fr: 'Veuillez nommer votre profil afin que nous puissions cartographier votre voix sur l\u2019ensemble des dix voyelles chantées du russe.' },
	'calib.switcher.startButton': { en: 'Start', fr: 'Démarrer' },
	'calib.switcher.deleteConfirm': { en: 'This deletes {name} and its readings from this device. Delete?', fr: 'Ceci supprime {name} et ses lectures de cet appareil. Supprimer\u00a0?' },
	'calib.switcher.deleteButton': { en: 'Delete', fr: 'Supprimer' },
	'calib.switcher.keepButton': { en: 'Keep it', fr: 'Conserver' },
	'calib.switcher.newButton': { en: 'New', fr: 'Créer' },
	'calib.switcher.duplicateButton': { en: 'Duplicate', fr: 'Dupliquer' },
	'calib.switcher.renameButton': { en: 'Rename', fr: 'Renommer' },
	'calib.switcher.renameLabel': { en: 'Rename this voice', fr: 'Renommer cette voix' },
	'calib.switcher.nameLabel': { en: 'What shall we call this voice?', fr: 'Comment appellerons-nous cette voix\u00a0?' },
	'calib.switcher.saveButton': { en: 'Save', fr: 'Enregistrer' },
	'calib.switcher.cancelButton': { en: 'Cancel', fr: 'Annuler' },
	'calib.roster.reading.captured': { en: 'Captured', fr: 'Captée' },
	'calib.roster.reading.provisional': { en: 'Provisional', fr: 'Provisoire' },
	'calib.roster.reading.estimated': { en: 'Estimated', fr: 'Estimée' },
	'calib.roster.actionsHeader': { en: 'Actions', fr: 'Actions' },
	'calib.roster.oNoteAria': { en: 'About the sung [o] vowel (opens the Learn note)', fr: 'À propos de la voyelle [o] chantée (ouvre la note dans Leçons)' },
	'calib.roster.noiseFloorTitle': { en: 'The room\'s noise floor could not be measured for this sample.', fr: 'Le niveau de bruit de fond de la pièce n\u2019a pas pu être mesuré pour cet échantillon.' },
	'calib.roster.noiseFloorLabel': { en: 'Noise floor: Unmeasured', fr: 'Bruit de fond\u00a0: non mesuré' },
	'calib.roster.tryAgain': { en: 'Try again', fr: 'Réessayer' },
	'calib.challengingInvite.button': { en: 'Sing the three Ilya derived for you', fr: 'Chanter les trois qu\u2019Ilya a déduites pour vous' },
	'calib.challengingInvite.caption': { en: 'None of the ten vowels is optional. These three are the hardest to produce on demand, so Ilya derives them from your own anchors until you choose to sing them.', fr: 'Aucune des dix voyelles n\u2019est facultative. Ces trois-là sont les plus difficiles à produire sur demande, donc Ilya les déduit de vos propres points d\u2019ancrage jusqu\u2019à ce que vous choisissiez de les chanter.' },
	'calib.characteristics.editButton': { en: 'Edit voice characteristics', fr: 'Modifier les caractéristiques vocales' },
	'calib.characteristics.addButton': { en: 'Add voice characteristics', fr: 'Ajouter des caractéristiques vocales' },
	'calib.welcome.title': { en: 'Finding Your Resonances', fr: 'Trouver vos résonances' },
	'calib.welcome.lede': { en: 'Fit will measure your voice to build a formant profile, which is a map of your voice\'s resonances that will be applied to your repertoire to determine how well it suits your voice. Follow the prompts. This wizard assumes you read IPA. Your device needs a working mic and you should be in a quiet space for the best capture of your resonances.', fr: 'Fit mesurera votre voix afin de constituer un profil de formants, c\u2019est-à-dire une carte des résonances de votre voix, qui sera ensuite appliquée à votre répertoire pour en évaluer la correspondance. Suivez les indications. Cet assistant présume que vous lisez l\u2019API. Votre appareil doit disposer d\u2019un microphone fonctionnel, et vous devriez vous trouver dans un endroit calme pour bien capter vos résonances.' },
	'calib.welcome.fryQuestion': { en: 'What is vocal fry?', fr: 'Qu\u2019est-ce que la friture vocale (\u00ab\u00a0vocal fry\u00a0\u00bb)\u00a0?' },
	'calib.welcome.fryAnswer': { en: 'A low, creaky voice register, easy to sustain and gentle on the voice. Fit reads its resonances rather than your sung pitch, so comfort matters more than pitch here.', fr: 'Un registre vocal grave et grésillant, facile à tenir et doux pour la voix. Fit en lit les résonances plutôt que la hauteur de votre chant, donc le confort importe ici davantage que la hauteur.' },
	'calib.welcome.beginButton': { en: 'Begin', fr: 'Commencer' },
	'calib.readiness.title': { en: 'Getting ready', fr: 'Préparation' },
	'calib.readiness.quiet': { en: 'Listening for quiet. Stay silent for a moment.', fr: 'À l\u2019écoute du silence. Restez silencieux un moment.' },
	'calib.readiness.prepareLede': { en: 'Now a throwaway fry, just to check the mic hears you.', fr: 'Maintenant une friture d\u2019essai, simplement pour vérifier que le micro vous entend.' },
	'calib.readiness.countThree': { en: 'Three.', fr: 'Trois.' },
	'calib.readiness.countTwo': { en: 'Two.', fr: 'Deux.' },
	'calib.readiness.countOne': { en: 'One.', fr: 'Un.' },
	'calib.readiness.captureLede': { en: 'Fry now, and keep going until the bar fills.', fr: 'Faites la friture maintenant, et continuez jusqu\u2019à ce que la barre soit pleine.' },
	'calib.readiness.captureAria': { en: 'Recording your throwaway fry', fr: 'Enregistrement de votre friture d\u2019essai' },
	'calib.readiness.noMic': { en: 'We could not reach your microphone, so nothing was measured.', fr: 'Nous n\u2019avons pas pu accéder à votre microphone, donc rien n\u2019a été mesuré.' },
	'calib.readiness.noFry': { en: 'We did not hear a fry, so nothing was measured.', fr: 'Nous n\u2019avons pas entendu de friture, donc rien n\u2019a été mesuré.' },
	'calib.readiness.guidance': { en: 'You can carry on; each vowel asks for the microphone again.', fr: 'Vous pouvez poursuivre\u00a0: chaque voyelle redemande le microphone.' },
	'calib.readiness.complete': { en: 'Readiness check complete.', fr: 'Vérification préalable terminée.' },
	'calib.readiness.marginal': { en: 'Your fry is reading near the edge of our range; a little lower or higher may read cleaner.', fr: 'Votre friture se lit près de la limite de notre plage. Un peu plus grave ou plus aigu se lirait plus nettement.' },
	'calib.capture.allSet': { en: 'All set.', fr: 'Tout est prêt.' },
	'calib.capture.cuePrefix': { en: 'Tap the', fr: 'Touchez la voyelle' },
	'calib.capture.cueSuffix': { en: 'vowel to arm it, tap again to begin.', fr: 'pour l\u2019activer, puis touchez-la de nouveau pour commencer.' },
	'calib.capture.paused': { en: 'Paused. Resume when you\'re ready.', fr: 'En pause. Reprenez quand vous serez prêt.' },
	'calib.capture.resumeButton': { en: 'Resume', fr: 'Reprendre' },
	'calib.capture.hold.captured': { en: ', captured.', fr: ', captée.' },
	'calib.capture.hold.rolledBack': { en: 'New sample was less certain, so the previous one was kept.', fr: 'Le nouvel échantillon était moins certain, donc le précédent a été conservé.' },
	'calib.capture.hold.implausiblePrefix': { en: 'That reading looks unlikely for', fr: 'Cette lecture semble peu probable pour' },
	'calib.capture.hold.tryAgain': { en: 'Try again?', fr: 'Réessayer\u00a0?' },
	'calib.capture.hold.noted': { en: 'Noted, moving on. You can re-take it from the summary.', fr: 'C\u2019est noté, on poursuit. Vous pourrez la refaire depuis le sommaire.' },
	'calib.capture.pauseButton': { en: 'Pause', fr: 'Pause' },
	'calib.capture.returnToSummary': { en: 'Return to summary', fr: 'Retour au sommaire' },
	'calib.capture.toast': { en: 'The room sounds a little lively. Your sample is still good, but a quieter space would help.', fr: 'La pièce sonne un peu réverbérante. Votre échantillon reste bon, mais un endroit plus silencieux aiderait.' },
	'calib.capture.toastDismissAria': { en: 'Dismiss', fr: 'Fermer' },

	// ── Vowel names (N.35) ────────────────────────
	//    Mitton (2020) §4.6's speakable nicknames, moved out of
	//    Pacifier.svelte, where they were English-only. Keyed by IPA
	//    glyph, as the old SPOKEN_NAME Record<Vowel, string> was.
	//    [o] and [u] were bare letters until Dann named them on
	//    2026-08-12: Russian-o after Grayson (2012) Appendix K, 'The
	//    Story of /o/', already cited at LearnContent.svelte:2819;
	//    cardinal-u to parallel cardinal-i and stand off horseshoe-u.
	//    FIVE of the French forms are the tree's own, not coinages:
	//    i vélaire (LearnContent.svelte:787), e fermé (:807), e ouvert,
	//    a clair and a sombre (GuideContent.svelte:70). The other five
	//    are proposals Dann ratified on 2026-08-12.
	'vowel.name.i': { en: 'cardinal-i', fr: 'i cardinal' },
	'vowel.name.e': { en: 'close-e', fr: 'e fermé' },
	'vowel.name.ɪ': { en: 'smallcaps-i', fr: 'i petite capitale' },
	'vowel.name.ɨ': { en: 'velar-i', fr: 'i vélaire' },
	'vowel.name.ɛ': { en: 'open-e', fr: 'e ouvert' },
	'vowel.name.a': { en: 'bright-a', fr: 'a clair' },
	'vowel.name.ɑ': { en: 'dark-a', fr: 'a sombre' },
	'vowel.name.ʌ': { en: 'turned-v', fr: 'v culbuté' },
	'vowel.name.o': { en: 'Russian-o', fr: 'o russe' },
	'vowel.name.u': { en: 'cardinal-u', fr: 'u cardinal' },
	'vowel.spoken': { en: 'the {name} vowel', fr: 'la voyelle {name}' },

	// ── Pacifier captions (N.35) ──────────────────
	//    {v} is the whole phrase from 'vowel.spoken'. Dann ruled on
	//    2026-08-12 that {v} never opens a French sentence, so the
	//    French shapes differ from the English deliberately.
	'pacifier.tapToCapture': { en: 'Tap a vowel to capture it.', fr: 'Touchez une voyelle pour la capter.' },
	'pacifier.preparing': { en: 'Preparing {v}. Three.', fr: 'Préparation de {v}. Trois.' },
	'pacifier.beginPhonating': { en: 'Begin phonating now. {v} in vocal fry.', fr: 'Commencez la phonation maintenant\u00a0: {v} en friture vocale.' },
	'pacifier.nowSustain': { en: 'Now sustain. Sample recording.', fr: 'Soutenez maintenant. Échantillon en cours d\u2019enregistrement.' },
	'pacifier.captured': { en: '{v} captured.', fr: 'Capture de {v} effectuée.' },
	'pacifier.rolledBack': { en: '{v}: new sample was less certain, so the previous one was kept.', fr: 'Pour {v}, le nouvel échantillon était moins certain, donc le précédent a été conservé.' },
	'pacifier.sampleUncertain': { en: '{v} sample uncertain. Tap to retry.', fr: 'Échantillon incertain pour {v}. Touchez pour réessayer.' },
	'pacifier.cancelled': { en: 'Capture cancelled.', fr: 'Capture annulée.' },
	'pacifier.selected': { en: '{v} selected.', fr: 'Sélection de {v}.' },
	'pacifier.armed': { en: '{v} armed. Tap again to begin.', fr: 'Activation de {v}. Touchez de nouveau pour commencer.' },
	'pacifier.armedRetake': { en: '{v} armed for re-take. Tap again to begin.', fr: 'Activation de {v} pour une nouvelle capture. Touchez de nouveau pour commencer.' },
	'pacifier.skipped': { en: '{v} skipped.', fr: 'Capture ignorée pour {v}.' },
	'pacifier.error.micPermission': { en: 'Microphone access is needed to hear your fry. Can you allow it and try again?', fr: 'L\u2019accès au microphone est nécessaire pour entendre votre friture. Pouvez-vous l\u2019autoriser et réessayer\u00a0?' },
	'pacifier.error.micNotFound': { en: 'No microphone was found. Can you connect one and try again?', fr: 'Aucun microphone n\u2019a été trouvé. Pouvez-vous en brancher un et réessayer\u00a0?' },
	'pacifier.error.noAudio': { en: 'No sound came through. Can you check the microphone and try again?', fr: 'Aucun son n\u2019est parvenu. Pouvez-vous vérifier le microphone et réessayer\u00a0?' },
	'pacifier.error.tooShort': { en: 'That sample was a little short. Can you sustain the fry a moment longer?', fr: 'Cet échantillon était un peu court. Pouvez-vous soutenir la friture un instant de plus\u00a0?' },
	'pacifier.error.default': { en: 'That sample could not be read. Can you try that again?', fr: 'Cet échantillon n\u2019a pas pu être lu. Pouvez-vous réessayer\u00a0?' },
	'pacifier.wheelAria': { en: 'Vowel calibration. Tap a vowel to select it, tap again to begin capture, long-press to skip.', fr: 'Calibration des voyelles. Touchez une voyelle pour la sélectionner, touchez-la de nouveau pour lancer la capture, appuyez longuement pour l\u2019ignorer.' },
	'calib.summary.title': { en: 'Profile summary', fr: 'Sommaire du profil' },
	'calib.summary.savedLede': { en: 'Your profile is saved on this device. You can keep refining any reading below.', fr: 'Votre profil est enregistré sur cet appareil. Vous pouvez continuer à affiner n\u2019importe quelle lecture ci-dessous.' },
	'calib.summary.progressLedeSuffix': { en: 'vowels sampled. Review each reading and re-take anything uncertain before you finish.', fr: 'voyelles échantillonnées. Passez en revue chaque lecture et refaites tout ce qui est incertain avant de terminer.' },
	'calib.summary.finishButton': { en: 'Finish', fr: 'Terminer' },
	'calib.summary.resetConfirm': { en: 'This clears every reading saved for this voice. Start fresh?', fr: 'Ceci efface toutes les lectures enregistrées pour cette voix. Recommencer\u00a0?' },
	'calib.summary.startFreshButton': { en: 'Start fresh', fr: 'Recommencer' },
	'calib.summary.keepProfileButton': { en: 'Keep my profile', fr: 'Conserver mon profil' },
	'calib.summary.startOverButton': { en: 'Start over', fr: 'Tout recommencer' },
	'calib.characteristics.title': { en: 'Voice characteristics', fr: 'Caractéristiques vocales' },
	'calib.characteristics.lede': { en: 'These optional values sharpen the fit analysis. Any field can stay blank; where a value is missing, the analysis simply stays broad for that dimension.', fr: 'Ces valeurs facultatives précisent l\u2019analyse de correspondance. Tout champ peut rester vide. Là où une valeur manque, l\u2019analyse demeure simplement générale pour cette dimension.' },
	'calib.characteristics.rangeHeading': { en: 'Range', fr: 'Ambitus' },
	'calib.characteristics.rangeLowLabel': { en: 'Lowest comfortable note', fr: 'Note la plus grave confortable' },
	'calib.characteristics.rangeHighLabel': { en: 'Highest comfortable note', fr: 'Note la plus aiguë confortable' },
	'calib.characteristics.rangeInvertedNote': { en: 'The lowest note is set above the highest.', fr: 'La note la plus grave est placée au-dessus de la plus aiguë.' },
	'calib.characteristics.tessituraHeading': { en: 'Tessitura', fr: 'Tessiture' },
	'calib.characteristics.tessituraHint': { en: 'Where you live, not your edges.', fr: 'Dans votre zone de confort, et non aux extrémités de votre ambitus.' },
	'calib.characteristics.tessituraLowLabel': { en: 'Tessitura floor', fr: 'Plancher de la tessiture' },
	'calib.characteristics.tessituraHighLabel': { en: 'Tessitura ceiling', fr: 'Plafond de la tessiture' },
	'calib.characteristics.tessituraInvertedNote': { en: 'The tessitura floor is set above its ceiling.', fr: 'Le plancher de la tessiture est placé au-dessus de son plafond.' },
	'calib.characteristics.passaggioHeading': { en: 'Passaggio', fr: 'Passaggio' },
	'calib.characteristics.passaggioHint': { en: 'The zona lies between two turns, a lower and an upper. Enter both to flag it; with either blank it stays unmarked, which does not mean it is absent.', fr: 'La zona se situe entre deux événements vocaux acoustiques, l\u2019un inférieur et l\u2019autre supérieur. Saisissez les deux pour la signaler. Si l\u2019un des deux reste vide, elle demeure non marquée, ce qui ne veut pas dire qu\u2019elle est absente.' },
	'calib.characteristics.passaggioPrimaryLabel': { en: 'Primary passaggio', fr: 'Passaggio primaire' },
	'calib.characteristics.passaggioSecondaryLabel': { en: 'Secondary passaggio', fr: 'Passaggio secondaire' },
	'calib.characteristics.doneButton': { en: 'Done', fr: 'Terminé' },

	// ── Voice profile pane (N.22 extraction; French placeholder = English
	//    verbatim except profile.withheld.*, which carries Dann's own French,
	//    migrated verbatim from the old inline WITHHELD_COPY object) ──────
	'profile.subtitleNamed': { en: 'Formant profile: a map of {voice}\u2019s resonances', fr: 'Profil de formants\u00a0: une carte des résonances de la voix \u00ab\u00a0{voice}\u00a0\u00bb' },
	'profile.subtitleYours': { en: 'Formant profile: a map of your voice\u2019s resonances', fr: 'Profil de formants\u00a0: une carte des résonances de votre voix' },
	'profile.count.1': { en: 'One', fr: 'Une' },
	'profile.count.2': { en: 'Two', fr: 'Deux' },
	'profile.count.3': { en: 'Three', fr: 'Trois' },
	'profile.count.4': { en: 'Four', fr: 'Quatre' },
	'profile.count.5': { en: 'Five', fr: 'Cinq' },
	'profile.count.6': { en: 'Six', fr: 'Six' },
	'profile.count.7': { en: 'Seven', fr: 'Sept' },
	'profile.count.8': { en: 'Eight', fr: 'Huit' },
	'profile.count.9': { en: 'Nine', fr: 'Neuf' },
	'profile.count.10': { en: 'Ten', fr: 'Dix' },
	'profile.lede': { en: 'Your repertoire-fit results will appear here after Ilya processes the score you upload.', fr: 'Vos résultats de correspondance au répertoire apparaîtront ici une fois qu\u2019Ilya aura traité la partition que vous téléversez.' },
	'profile.provisional.noneMessage': { en: 'You can update these values anytime through the drawer on the left.', fr: 'Vous pouvez modifier ces valeurs à tout moment depuis le tiroir de gauche.' },
	'profile.statusSetPlain': { en: 'Your profile is now set.', fr: 'Votre profil est maintenant établi.' },
	'profile.statusSetMeasuredSingular': { en: 'Your profile is now set with {count} vowel measured.', fr: 'Votre profil est maintenant établi, avec {count} voyelle mesurée.' },
	'profile.statusSetMeasuredPlural': { en: 'Your profile is now set with {count} vowels measured.', fr: 'Votre profil est maintenant établi, avec {count} voyelles mesurées.' },
	'profile.provisional.sentenceSingular': { en: 'Your {vowels} is provisional, and you can update this value anytime through the drawer on the left.', fr: 'Votre voyelle {vowels} est provisoire, et vous pouvez modifier cette valeur à tout moment depuis le tiroir à gauche.' },
	'profile.provisional.sentencePlural': { en: 'Your {vowels} are provisional, and you can update these values anytime through the drawer on the left.', fr: 'Vos voyelles {vowels} sont provisoires, et vous pouvez modifier ces valeurs à tout moment depuis le tiroir à gauche.' },

	// ── List separators (N.34) ───────────────────
	//    listSep hardcoded English joins. French takes no serial comma,
	//    so its pair and final joins are the same word. The medial is
	//    keyed although it is invariant, on the tab bar's precedent above.
	'profile.provisional.listSepPair': { en: ' and ', fr: ' et ' },
	'profile.provisional.listSepFinal': { en: ', and ', fr: ' et ' },
	'profile.provisional.listSepMedial': { en: ', ', fr: ', ' },
	'profile.emptyState': { en: 'Calibrate your voice to begin.', fr: 'Calibrez votre voix pour commencer.' },
	'profile.octaveNotice': { en: 'This voice line is notated in treble clef but sits an octave above the range you gave, so it\'s being read an octave lower to match your voice, as lower voices often sing treble parts. Check the score\'s clef if that\'s not right.', fr: 'Cette ligne vocale est notée en clé de sol, mais se situe une octave au-dessus de l\u2019ambitus que vous avez indiqué. Elle est donc lue une octave plus bas pour correspondre à votre voix, comme les voix graves chantent souvent des parties en clé de sol. Vérifiez la clé de la partition si ce n\u2019est pas le cas.' },
	// N.46 / E.44: portrait defers the notation to landscape. `appareil` is
	// adopted (:290, :316, :418) and matches the ratified line's own wording.
	'profile.rotateForScore': { en: 'Turn your device sideways to read the score.', fr: 'Tournez votre appareil à l\u2019horizontale pour lire la partition.' },
	// The twin, chosen by showWithheld: « annotée » is claimed only when acoustic
	// marks exist. Dann's wording, 13 August 2026.
	'profile.rotateForScoreMarked': { en: 'Turn your device sideways to read the marked-up score.', fr: 'Tournez votre appareil à l\u2019horizontale pour lire la partition annotée.' },
	'profile.scoreRegionAria': { en: 'Repertoire fit score', fr: 'Partition annotée du répertoire' },
	'profile.scorePageAria': { en: 'Score page {n} of {total}', fr: 'Page {n} sur {total} de la partition' },
	'profile.notesPageAria': { en: 'Analysis notes', fr: 'Notes d\u2019analyse' },
	'profile.emptyStateAria': { en: 'Voice profile', fr: 'Profil vocal' },
	'profile.withheld.heading': { en: 'Nothing is claimed about your voice', fr: 'Rien n’est affirmé sur votre voix' },
	'profile.withheld.lede': { en: 'Ilya has read your score, but no voice has been measured, so there is nothing to compare this line against.', fr: 'Ilya a lu votre partition, mais aucune voix n’a été mesurée, donc il n’y a rien à quoi comparer cette ligne.' },
	'profile.withheld.item1': { en: 'Every acoustic mark: no crossings, no timbre turns.', fr: 'Toute marque acoustique : aucun croisement, aucun changement de timbre.' },
	'profile.withheld.item2': { en: 'The watch list, entirely. An empty list is the truthful output here.', fr: 'La liste des points à surveiller, entièrement. Une liste vide est ici la réponse honnête.' },
	'profile.withheld.item3': { en: 'Any reading of your range, your tessitura, or your passaggio.', fr: 'Toute lecture de votre ambitus, de votre tessiture ou de votre passaggio.' },
	// ── NotePicker (N.50) ─────────────────
	//    Scope B, ruled by Dann E.43: the three aria-labels, Clear, the
	//    empty readout, and the five accidental options. The accidental
	//    OPTIONS carry no glyph: a native iOS picker wheel ignores CSS, so
	//    the glyph could be neither kerned nor set in the notation font,
	//    and a word reads better on a wheel than a mis-set symbol.
	//    French adopted from GuideContent.svelte:64, which names this exact
	//    control: "choisissez la lettre, l'altération et l'octave".
	//    dièse, bécarre and double dièse are COINED, E.43.
	'notePicker.letterAria':      { en: 'Note letter', fr: 'Lettre de la note' },
	'notePicker.accidentalAria':  { en: 'Accidental',  fr: 'Altération' },
	'notePicker.octaveAria':      { en: 'Octave',      fr: 'Octave' },
	'notePicker.clear':           { en: 'Clear',       fr: 'Effacer' },
	'notePicker.empty':           { en: 'No note set', fr: 'Aucune note définie' },
	'notePicker.acc.doubleFlat':  { en: 'double flat',  fr: 'double bémol' },
	'notePicker.acc.flat':        { en: 'flat',         fr: 'bémol' },
	'notePicker.acc.natural':     { en: 'natural',      fr: 'bécarre' },
	'notePicker.acc.sharp':       { en: 'sharp',        fr: 'dièse' },
	'notePicker.acc.doubleSharp': { en: 'double sharp', fr: 'double dièse' },
	// N.55a/N.55b (Dann's ruling, E.47; French ratified by Dann, E.47).
	// %s is the file name, substituted with .replace('%s', ...) at the
	// call site, the convention 'upload.err.xmlRootIs' already uses.
	'upload.banner.noLyrics': { en: 'This score has no words in it. Your text is under the notes, one syllable per note. Click a note to move a syllable.', fr: 'Cette partition ne porte aucune parole. Votre texte se trouve sous les notes, une syllabe par note. Cliquez sur une note pour déplacer une syllabe.' },
	'station.syllables': { en: 'Syllables', fr: 'Syllabes' },
	'station.textChanged': { en: 'Text changed', fr: 'Texte modifié' },
	// N.55b Shift Lyrics. English ADOPTED verbatim from Finale's own manual
	// (`e46-n55b-click-assignment-design_2026-08-13.md` §8; cross-verified,
	// `ILYA-REGISTER_2026-08-11.md`). French COINED and ratified by Dann,
	// 2026-08-14: Finale's French localization could not be confirmed (its
	// Lyrics-tool chapter at finalemusic.fr refuses WebFetch, robots.txt).
	// Reuses the register already ratified at 'station.textChanged' (texte).
	// Rotate syllables was ratified in the same pass but is PARKED, dropped
	// from N.55b's active scope (no selection UI exists to drive it), so it
	// has no key here; add one only if it is ever un-parked.
	'shiftLyrics.title': { en: 'Shift Lyrics', fr: 'Décaler les paroles' },
	'shiftLyrics.toEndOfLyric': { en: 'to the End of the Lyric', fr: 'jusqu’à la fin du texte' },
	'shiftLyrics.toNextOpenNote': { en: 'to the Next Open Note', fr: 'jusqu’à la prochaine note libre' },
	// Direction is icon-only in the UI (arrows), never visible text, per
	// Dann's ruling, 2026-08-14. These two strings exist ONLY as aria-label
	// text for screen readers; nothing renders them.
	'shiftLyrics.forwardAria': { en: 'Forward', fr: "Vers l'avant" },
	'shiftLyrics.backAria': { en: 'Back', fr: "Vers l'arrière" },
	// N.27 / N.55b storage (R5). COINED, ratified by Dann, 2026-08-14, one
	// correction along the way: "lorsque", not "si" — leaving the page WILL
	// lose the work, it is not conditional, and the English already said
	// "when". Reuses 'enregistré' (calib.summary.savedLede, :418) and
	// 'syllabe' (upload.banner.noLyrics, :511). THE SAVE DOES NOT SWALLOW ITS
	// EXCEPTION (pairings.ts:385-389): 'no-storage' and 'write-failed' share
	// storage.saveFailed.generic, Dann's own collapse; quota gets its own
	// line because the design doc named it by name. Load's three reasons
	// ('no-storage', 'malformed', 'unparseable', pairings.ts:405-422) share
	// one message, same collapse, unopposed.
	'storage.saveFailed.quota': { en: 'Your device’s storage is full. Your syllable placements could not be saved and will be lost when you leave this page.', fr: 'Le stockage de cet appareil est plein. Vos syllabes n’ont pas pu être enregistrées et seront perdues lorsque vous quittez cette page.' },
	'storage.saveFailed.generic': { en: 'Your syllable placements could not be saved on this device. They will be lost when you leave this page.', fr: 'Vos syllabes n’ont pas pu être enregistrées sur cet appareil. Elles seront perdues lorsque vous quittez cette page.' },
	'storage.loadFailed': { en: 'Your saved syllable placements could not be read back.', fr: 'Vos syllabes enregistrées n’ont pas pu être relues.' },
	// N.67 step 1, socket §4.1. Two tabs, one song: the tab that has unsaved
	// work KEEPS it and says this. The second sentence is the whole point of
	// the notice, because the failure it replaces was silence.
	// French written 2026-08-16 and shown to Dann before this shipped.
	// 'onglet' and 'chant' are both adopted, ordinary words; nothing is coined.
	'storage.otherTab': { en: 'This song was changed in another Ilya tab. Your work here has been kept.', fr: 'Ce chant a été modifié dans un autre onglet d’Ilya. Votre travail ici a été conservé.' },
	// N.67 step 3, design §2.6. The singer's own destructive act, and the only
	// one: an upload never rebuilds. 'Recommencer' and not 'Reprendre', which
	// also means to RESUME and would read as the opposite of what this does.
	// 'partition' is the register already ratified across upload.* and meta.*.
	// French written 2026-08-16 and shown to Dann before this shipped.
	// N.67 step 5, the binder. Dann's labels, 2026-08-16: the buttons say what
	// they do rather than carrying a metaphor. 'binder' stays the file
	// extension and the internal word; 'classeur' was rejected because it reads
	// as spreadsheet in French. §8's backup framing lives in the Guide instead,
	// in prose a singer can read, which is Dann's ruling and a DIVERGENCE from
	// §8's own line that "the UI copy says backup" (recorded in STATE.md).
	'binder.export': { en: 'Export this song', fr: 'Exporter ce chant' },
	'binder.import': { en: 'Import a song', fr: 'Importer un chant' },
	// The third choice, added once export existed: before it, the warning below
	// truthfully said Ilya could not keep the old song. It still cannot. The
	// singer now can.
	'binder.exportFirst': { en: 'Export this song first', fr: 'Exporter ce chant d’abord' },
	// Five conditions, three sentences: to a singer, "not an archive" and "an
	// archive that is not Ilya's" are one situation, and "no songs" and
	// "damaged" are another. All three end the same way, so that none of them
	// invites the reader to infer their file was harmed by the others.
	'binder.err.notIlya': { en: 'This file was not made by Ilya. Nothing has changed.', fr: 'Ce fichier n’a pas été créé par Ilya. Rien n’a été modifié.' },
	// NOT "reload to update": measured 2026-08-16 that a reload cannot deliver
	// a newer Ilya here. `sw.js` ships byte-identical every deploy so no new
	// worker is ever installed, it has no skipWaiting or clients.claim, its
	// catch-all serves stale, and every deployment is its own frozen origin.
	// That finding is N.72. An instruction that might not work must not ship.
	'binder.err.newer': { en: 'This file was made by a newer version of Ilya than this one, which cannot read it. Open it in the newest Ilya. Nothing has changed.', fr: 'Ce fichier a été créé par une version d’Ilya plus récente que celle-ci, qui ne peut pas le lire. Ouvrez-le dans la version la plus récente. Rien n’a été modifié.' },
	'binder.err.damaged': { en: 'This file is damaged and could not be read. Nothing has changed.', fr: 'Ce fichier est endommagé et n’a pas pu être lu. Rien n’a été modifié.' },
	// Importing onto an open song is the same act as replacing its score, so it
	// wears the same shape: name what is lost, say there is no undo, and offer
	// the export that makes the loss avoidable.
	'import.title': { en: 'You already have a song open.', fr: 'Vous avez déjà un chant ouvert.' },
	'import.body': { en: 'Importing replaces the song you have, its title, its score file, and every placement, with the one in this file. Ilya cannot undo that. Export this song first if you want to keep it.', fr: 'Importer remplace le chant que vous avez, son titre, son fichier de partition et tous ses placements, par celui de ce fichier. Ilya ne peut pas annuler cette action. Exportez ce chant d’abord si vous voulez le conserver.' },
	'station.startOver': { en: 'Start placement over', fr: 'Recommencer le placement' },
	// The count of placements whose note the new score does not contain. They
	// are KEPT; this only says how many no longer have a note to sit on. %s is
	// the number. Twins 'station.textChanged' in restraint: a count, not alarm.
	// N.67 step 4a (Dann's ruling, 2026-08-16). THE CHIMERA WARNING. Before
	// this, a second score overwrote the song's title and file in place while
	// its placements survived onto music they were never made for. Shown only
	// when the fingerprint differs AND at least one placement would be orphaned:
	// a corrected note keeps every position, so it never asks, which is what
	// design §2.4 promised. French shown to Dann and approved 2026-08-16; no
	// colon, question mark, or exclamation, so it adds no ninth hard-space site.
	// Nothing coined: 'chant', 'partition', and 'placement' are all already
	// ratified elsewhere in this file.
	'replace.title': { en: 'This is not the same music.', fr: 'Ce n’est pas la même musique.' },
	'replace.body': { en: 'This score is not the one this song was built on. %s of your %s syllable placements have no note in it. Continuing replaces the whole song, its title, its score file, and every placement. Ilya cannot undo that. Export this song first if you want to keep it.', fr: 'Cette partition n’est pas celle sur laquelle ce chant a été construit. %s de vos %s placements de syllabes n’y ont aucune note. Continuer remplace le chant entier, son titre, son fichier de partition et tous ses placements. Ilya ne peut pas annuler cette action. Exportez ce chant d’abord si vous voulez le conserver.' },
	'replace.keep': { en: 'Keep this song', fr: 'Conserver ce chant' },
	'replace.replace': { en: 'Replace this song', fr: 'Remplacer ce chant' },
	'station.orphaned': { en: '%s placements have no note in this score. They have been kept.', fr: '%s placements n’ont plus de note dans cette partition. Ils ont été conservés.' },
	'profile.withheld.close': { en: 'The stave carries no marks because none can be earned.', fr: 'La portée ne porte aucune marque, car aucune ne peut être fondée.' },
};

/**
 * Look up a translated string by key and language.
 * Returns [MISSING: key] if the key or language variant is absent,
 * enforcing 100% French parity.
 */
export function t(key: string, lang: Language): string {
	const entry = strings[key];
	if (!entry || !entry[lang]) return `[MISSING: ${key}]`;
	return entry[lang];
}

/**
 * Map a stressSource value to its translated label.
 */
export function stressSourceLabel(source: string, lang: Language): string {
	switch (source) {
		case 'dictionary':       return t('stress.dictionary', lang);
		case 'supplement':       return t('stress.supplement', lang);
		case 'yo-rule':          return t('stress.yoRule', lang);
		case 'yo-restored':      return t('stress.yoRestored', lang);
		case 'inferred':         return t('stress.inferred', lang);
		case 'unknown':          return t('stress.unknown', lang);
		case 'user-dictionary':  return t('stress.userDictionary', lang);
		case 'user-composer':    return t('stress.userComposer', lang);
		case 'user-override':    return t('stress.userOverride', lang);
		default:                 return source;
	}
}
