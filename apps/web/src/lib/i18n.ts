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
	'inspector.cliticArrow.encliticBlurb':  { en: 'This word is an enclitic: it has no stress of its own and attaches phonologically to the preceding word. Its vowels reduce relative to the host word\u2019s stress position. On the page, an arrow (\u2190) shows in place of IPA, and the clitic\u2019s phonetic material appears fused into the host word\u2019s IPA.', fr: 'Ce mot est un enclitique\u00a0: il n\u2019a pas d\u2019accent propre et s\u2019attache phonologiquement au mot précédent. Ses voyelles se réduisent en fonction de la position de l\u2019accent du mot hôte. Sur la page, une flèche (\u2190) remplace l\u2019API, et le matériel phonétique du clitique apparaît fusionné dans l\u2019API du mot hôte.' },
	'inspector.cliticArrow.procliticBlurb': { en: 'This word is a proclitic: it has no stress of its own and attaches phonologically to the following word. Its vowels reduce relative to the host word\u2019s stress position. On the page, an arrow (\u2192) shows in place of IPA, and the clitic\u2019s phonetic material appears fused into the host word\u2019s IPA.', fr: 'Ce mot est un proclitique\u00a0: il n\u2019a pas d\u2019accent propre et s\u2019attache phonologiquement au mot suivant. Ses voyelles se réduisent en fonction de la position de l\u2019accent du mot hôte. Sur la page, une flèche (\u2192) remplace l\u2019API, et le matériel phonétique du clitique apparaît fusionné dans l\u2019API du mot hôte.' },
	'inspector.unknownStress':     { en: 'Unknown stress \u00b7 verify manually', fr: 'Accent inconnu \u00b7 vérifier manuellement' },
	'inspector.provenance':         { en: 'Provenance',                   fr: 'Provenance' },
	'inspector.ribbon':            { en: 'Character breakdown',          fr: 'Décomposition par caractère' },
	'inspector.blurbs':            { en: 'Phonological notes',           fr: 'Notes phonologiques' },
	'inspector.noBlurb':           { en: 'No phonological note for this character.', fr: 'Aucune note phonologique pour ce caractère.' },
	'inspector.notationDefault':   { en: 'Notation: default (Grayson)',  fr: 'Notation\u00a0: par défaut (Grayson)' },
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
	'upload.drop.acceptedNow':     { en: 'Accepted now: MNX, MusicXML, .mxl, Finale (.musx), MuseScore (.mscz)', fr: 'Acceptés maintenant\u00a0: MNX, MusicXML, .mxl, Finale (.musx), MuseScore (.mscz)' },
	'upload.drop.comingSoon':      { en: 'Coming soon: PDF, image, MIDI', fr: 'Bientôt\u00a0: PDF, image, MIDI' },
	'upload.drop.release':         { en: 'Release to add your score',    fr: 'Relâchez pour ajouter votre partition' },
	'upload.scanTooltip':          { en: 'Scan a score from an image (coming soon)', fr: 'Numériser une partition à partir d’une image (bientôt)' },

	'upload.status.reading':       { en: 'Reading file…',           fr: 'Lecture du fichier…' },
	'upload.status.converting':    { en: 'Converting Finale file…',  fr: 'Conversion du fichier Finale…' },
	'upload.status.convertingMscz':{ en: 'Converting MuseScore file…', fr: 'Conversion du fichier MuseScore…' },

	'upload.format.mnxDirect':     { en: 'Format: MNX (direct)',         fr: 'Format\u00a0: MNX (direct)' },
	'upload.format.musicxmlDirect':{ en: 'Format: MusicXML (direct)',    fr: 'Format\u00a0: MusicXML (direct)' },
	'upload.format.mxl':           { en: 'Format: MusicXML (.mxl)',      fr: 'Format\u00a0: MusicXML (.mxl)' },
	'upload.format.musxDenigma':   { en: 'Format: Finale .musx → MNX', fr: 'Format\u00a0: Finale .musx → MNX' },
	'upload.format.msczWebmscore': { en: 'Format: MuseScore → MusicXML', fr: 'Format\u00a0: MuseScore → MusicXML' },

	'upload.banner.denigma':       { en: 'Converted from Finale format by denigma. Lyric alignment and measure structure are preserved. Verify custom expressions or complex layouts if the score appears unusual.', fr: 'Converti depuis le format Finale par denigma. L’alignement des paroles et la structure des mesures sont préservés. Vérifiez les expressions personnalisées ou les mises en page complexes si la partition semble inhabituelle.' },
	'upload.banner.dismiss':       { en: 'Dismiss',                      fr: 'Ignorer' },

	'upload.continue':             { en: 'Continue to analysis',         fr: 'Continuer vers l’analyse' },
	'upload.tryAnother':           { en: 'Try another file',             fr: 'Essayer un autre fichier' },

	'upload.mus.trigger':          { en: 'Have an older Finale file (.mus, pre-2014)?', fr: 'Vous avez un ancien fichier Finale (.mus, avant 2014)\u00a0?' },
	'upload.mus.intro':            { en: 'Finale files from 2014 onward (.musx) are supported. For older .mus files, there are three options:', fr: 'Les fichiers Finale à partir de 2014 (.musx) sont pris en charge. Pour les anciens fichiers .mus, trois options s’offrent à vous\u00a0:' },
	'upload.mus.opt1':             { en: '1. Open the file in any Finale version from 2014 or later and resave it as .musx, then upload.', fr: '1. Ouvrez le fichier dans une version de Finale de 2014 ou ultérieure et réenregistrez-le en .musx, puis téléversez-le.' },
	'upload.mus.opt2':             { en: '2. Print to PDF and upload the PDF. (PDF import is coming soon.)', fr: '2. Imprimez en PDF et téléversez le PDF. (L’import PDF arrive bientôt.)' },
	'upload.mus.opt3':             { en: '3. Export to MusicXML from Finale and upload that file.', fr: '3. Exportez en MusicXML depuis Finale et téléversez ce fichier.' },
	'upload.mus.trial':            { en: 'If Finale is no longer available, a trial version can be downloaded for this purpose.', fr: 'Si Finale n’est plus disponible, une version d’essai peut être téléchargée à cette fin.' },

	'upload.soon.mscz':            { en: 'MuseScore (.mscz) import is coming soon.', fr: 'L’import MuseScore (.mscz) arrive bientôt.' },
	'upload.soon.pdf':             { en: 'PDF import is coming soon.',    fr: 'L’import PDF arrive bientôt.' },
	'upload.soon.image':           { en: 'Image import is coming soon.',  fr: 'L’import d’image arrive bientôt.' },
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
	'calib.defaultVoiceName': { en: 'Voice', fr: 'Voice' },
	'calib.section.ariaLabel': { en: 'Your Resonances: voice calibration', fr: 'Your Resonances: voice calibration' },
	'calib.common.continue': { en: 'Continue', fr: 'Continue' },
	'calib.common.retake': { en: 'Re-take', fr: 'Re-take' },
	'calib.common.of': { en: 'of', fr: 'of' },
	'calib.common.vowels': { en: 'vowels', fr: 'vowels' },
	'calib.common.vowelWord': { en: 'Vowel', fr: 'Vowel' },
	'calib.common.hz': { en: 'Hz', fr: 'Hz' },
	'calib.compact.vowelsSampled': { en: 'vowels sampled', fr: 'vowels sampled' },
	'calib.log.addedPrefix': { en: 'Added to progress:', fr: 'Added to progress:' },
	'calib.log.hertz': { en: 'hertz', fr: 'hertz' },
	'calib.roster.reading.captured': { en: 'Captured', fr: 'Captured' },
	'calib.roster.reading.provisional': { en: 'Provisional', fr: 'Provisional' },
	'calib.roster.reading.estimated': { en: 'Estimated', fr: 'Estimated' },
	'calib.roster.actionsHeader': { en: 'Actions', fr: 'Actions' },
	'calib.roster.oNoteAria': { en: 'About the sung o vowel (opens the Learn note)', fr: 'About the sung o vowel (opens the Learn note)' },
	'calib.roster.noiseFloorTitle': { en: 'The room\'s noise floor could not be measured for this sample.', fr: 'The room\'s noise floor could not be measured for this sample.' },
	'calib.roster.noiseFloorLabel': { en: 'Noise floor: Unmeasured', fr: 'Noise floor: Unmeasured' },
	'calib.roster.tryAgain': { en: 'Try again', fr: 'Try again' },
	'calib.challengingInvite.button': { en: 'Sing the three Ilya derived for you', fr: 'Sing the three Ilya derived for you' },
	'calib.challengingInvite.caption': { en: 'None of the ten vowels is optional. These three are the hardest to produce on demand, so Ilya derives them from your own anchors until you choose to sing them.', fr: 'None of the ten vowels is optional. These three are the hardest to produce on demand, so Ilya derives them from your own anchors until you choose to sing them.' },
	'calib.characteristics.editButton': { en: 'Edit voice characteristics', fr: 'Edit voice characteristics' },
	'calib.characteristics.addButton': { en: 'Add voice characteristics', fr: 'Add voice characteristics' },
	'calib.welcome.title': { en: 'Finding Your Resonances', fr: 'Finding Your Resonances' },
	'calib.welcome.lede': { en: 'Fit will measure your voice to build a formant profile, which is a map of your voice\'s resonances that will be applied to the repertoire to determine fit. Follow the prompts. This wizard assumes you read IPA. Your device needs a working mic and you should be in a quiet space for the best capture of your resonances.', fr: 'Fit will measure your voice to build a formant profile, which is a map of your voice\'s resonances that will be applied to the repertoire to determine fit. Follow the prompts. This wizard assumes you read IPA. Your device needs a working mic and you should be in a quiet space for the best capture of your resonances.' },
	'calib.welcome.fryQuestion': { en: 'What is vocal fry?', fr: 'What is vocal fry?' },
	'calib.welcome.fryAnswer': { en: 'A low, creaky voice register, easy to sustain and gentle on the voice. Fit reads its resonances rather than your sung pitch, so comfort matters more than pitch here.', fr: 'A low, creaky voice register, easy to sustain and gentle on the voice. Fit reads its resonances rather than your sung pitch, so comfort matters more than pitch here.' },
	'calib.welcome.beginButton': { en: 'Begin', fr: 'Begin' },
	'calib.readiness.title': { en: 'Getting ready', fr: 'Getting ready' },
	'calib.readiness.quiet': { en: 'Listening for quiet. Stay silent for a moment.', fr: 'Listening for quiet. Stay silent for a moment.' },
	'calib.readiness.prepareLede': { en: 'Now a throwaway fry, just to check the mic hears you.', fr: 'Now a throwaway fry, just to check the mic hears you.' },
	'calib.readiness.countThree': { en: 'Three.', fr: 'Three.' },
	'calib.readiness.countTwo': { en: 'Two.', fr: 'Two.' },
	'calib.readiness.countOne': { en: 'One.', fr: 'One.' },
	'calib.readiness.captureLede': { en: 'Fry now, and keep going until the bar fills.', fr: 'Fry now, and keep going until the bar fills.' },
	'calib.readiness.captureAria': { en: 'Recording your throwaway fry', fr: 'Recording your throwaway fry' },
	'calib.readiness.noMic': { en: 'We could not reach your microphone, so nothing was measured.', fr: 'We could not reach your microphone, so nothing was measured.' },
	'calib.readiness.noFry': { en: 'We did not hear a fry, so nothing was measured.', fr: 'We did not hear a fry, so nothing was measured.' },
	'calib.readiness.guidance': { en: 'You can carry on; each vowel asks for the microphone again.', fr: 'You can carry on; each vowel asks for the microphone again.' },
	'calib.readiness.complete': { en: 'Readiness check complete.', fr: 'Readiness check complete.' },
	'calib.readiness.marginal': { en: 'Your fry is reading near the edge of our range; a little lower or higher may read cleaner.', fr: 'Your fry is reading near the edge of our range; a little lower or higher may read cleaner.' },
	'calib.capture.allSet': { en: 'All set.', fr: 'All set.' },
	'calib.capture.cuePrefix': { en: 'Tap the', fr: 'Tap the' },
	'calib.capture.cueSuffix': { en: 'vowel to arm it, tap again to begin.', fr: 'vowel to arm it, tap again to begin.' },
	'calib.capture.paused': { en: 'Paused. Resume when you\'re ready.', fr: 'Paused. Resume when you\'re ready.' },
	'calib.capture.resumeButton': { en: 'Resume', fr: 'Resume' },
	'calib.capture.hold.captured': { en: ', captured.', fr: ', captured.' },
	'calib.capture.hold.rolledBack': { en: 'New sample was less certain, so the previous one was kept.', fr: 'New sample was less certain, so the previous one was kept.' },
	'calib.capture.hold.implausiblePrefix': { en: 'That reading looks unlikely for', fr: 'That reading looks unlikely for' },
	'calib.capture.hold.tryAgain': { en: 'Try again?', fr: 'Try again?' },
	'calib.capture.hold.noted': { en: 'Noted, moving on. You can re-take it from the summary.', fr: 'Noted, moving on. You can re-take it from the summary.' },
	'calib.capture.pauseButton': { en: 'Pause', fr: 'Pause' },
	'calib.capture.returnToSummary': { en: 'Return to summary', fr: 'Return to summary' },
	'calib.capture.toast': { en: 'The room sounds a little lively. Your sample is still good, but a quieter space would help.', fr: 'The room sounds a little lively. Your sample is still good, but a quieter space would help.' },
	'calib.capture.toastDismissAria': { en: 'Dismiss', fr: 'Dismiss' },
	'calib.summary.title': { en: 'Profile summary', fr: 'Profile summary' },
	'calib.summary.savedLede': { en: 'Your profile is saved on this device. You can keep refining any reading below.', fr: 'Your profile is saved on this device. You can keep refining any reading below.' },
	'calib.summary.progressLedeSuffix': { en: 'vowels sampled. Review each reading and re-take anything uncertain before you finish.', fr: 'vowels sampled. Review each reading and re-take anything uncertain before you finish.' },
	'calib.summary.finishButton': { en: 'Finish', fr: 'Finish' },
	'calib.summary.resetConfirm': { en: 'This clears every reading saved for this voice. Start fresh?', fr: 'This clears every reading saved for this voice. Start fresh?' },
	'calib.summary.startFreshButton': { en: 'Start fresh', fr: 'Start fresh' },
	'calib.summary.keepProfileButton': { en: 'Keep my profile', fr: 'Keep my profile' },
	'calib.summary.startOverButton': { en: 'Start over', fr: 'Start over' },
	'calib.characteristics.title': { en: 'Voice characteristics', fr: 'Voice characteristics' },
	'calib.characteristics.lede': { en: 'These optional values sharpen the fit analysis. Any field can stay blank; where a value is missing, the analysis simply stays broad for that dimension.', fr: 'These optional values sharpen the fit analysis. Any field can stay blank; where a value is missing, the analysis simply stays broad for that dimension.' },
	'calib.characteristics.rangeHeading': { en: 'Range', fr: 'Range' },
	'calib.characteristics.rangeLowLabel': { en: 'Lowest comfortable note', fr: 'Lowest comfortable note' },
	'calib.characteristics.rangeHighLabel': { en: 'Highest comfortable note', fr: 'Highest comfortable note' },
	'calib.characteristics.rangeInvertedNote': { en: 'The lowest note is set above the highest.', fr: 'The lowest note is set above the highest.' },
	'calib.characteristics.tessituraHeading': { en: 'Tessitura', fr: 'Tessitura' },
	'calib.characteristics.tessituraHint': { en: 'Where you live, not your edges.', fr: 'Where you live, not your edges.' },
	'calib.characteristics.tessituraLowLabel': { en: 'Tessitura floor', fr: 'Tessitura floor' },
	'calib.characteristics.tessituraHighLabel': { en: 'Tessitura ceiling', fr: 'Tessitura ceiling' },
	'calib.characteristics.tessituraInvertedNote': { en: 'The tessitura floor is set above its ceiling.', fr: 'The tessitura floor is set above its ceiling.' },
	'calib.characteristics.passaggioHeading': { en: 'Passaggio', fr: 'Passaggio' },
	'calib.characteristics.passaggioHint': { en: 'The zona lies between two turns, a lower and an upper. Enter both to flag it; with either blank it stays unmarked, which does not mean it is absent.', fr: 'The zona lies between two turns, a lower and an upper. Enter both to flag it; with either blank it stays unmarked, which does not mean it is absent.' },
	'calib.characteristics.passaggioPrimaryLabel': { en: 'Primary passaggio', fr: 'Primary passaggio' },
	'calib.characteristics.passaggioSecondaryLabel': { en: 'Secondary passaggio', fr: 'Secondary passaggio' },
	'calib.characteristics.doneButton': { en: 'Done', fr: 'Done' },

	// ── Voice profile pane (N.22 extraction; French placeholder = English
	//    verbatim except profile.withheld.*, which carries Dann's own French,
	//    migrated verbatim from the old inline WITHHELD_COPY object) ──────
	'profile.subtitle': { en: 'Formant profile: a map of {voice} resonances', fr: 'Formant profile: a map of {voice} resonances' },
	'profile.yourVoice': { en: 'your voice’s', fr: 'your voice’s' },
	'profile.count.0': { en: 'No', fr: 'No' },
	'profile.count.1': { en: 'One', fr: 'One' },
	'profile.count.2': { en: 'Two', fr: 'Two' },
	'profile.count.3': { en: 'Three', fr: 'Three' },
	'profile.count.4': { en: 'Four', fr: 'Four' },
	'profile.count.5': { en: 'Five', fr: 'Five' },
	'profile.count.6': { en: 'Six', fr: 'Six' },
	'profile.count.7': { en: 'Seven', fr: 'Seven' },
	'profile.count.8': { en: 'Eight', fr: 'Eight' },
	'profile.count.9': { en: 'Nine', fr: 'Nine' },
	'profile.count.10': { en: 'Ten', fr: 'Ten' },
	'profile.lede': { en: 'Your repertoire-fit results will appear here after Ilya processes the score you upload.', fr: 'Your repertoire-fit results will appear here after Ilya processes the score you upload.' },
	'profile.provisional.noneMessage': { en: 'You can update these values anytime through the drawer on the left.', fr: 'You can update these values anytime through the drawer on the left.' },
	'profile.statusSetPlain': { en: 'Your profile is now set.', fr: 'Votre profil est maintenant établi.' },
	'profile.statusSetMeasuredSingular': { en: 'Your profile is now set with {count} vowel measured.', fr: 'Votre profil est maintenant établi, avec {count} voyelle mesurée.' },
	'profile.statusSetMeasuredPlural': { en: 'Your profile is now set with {count} vowels measured.', fr: 'Votre profil est maintenant établi, avec {count} voyelles mesurées.' },
	'profile.provisional.sentenceSingular': { en: 'Your {vowels} is provisional, and you can update this value anytime through the drawer on the left.', fr: 'Votre voyelle {vowels} est provisoire, et vous pouvez modifier cette valeur à tout moment depuis le tiroir de gauche.' },
	'profile.provisional.sentencePlural': { en: 'Your {vowels} are provisional, and you can update these values anytime through the drawer on the left.', fr: 'Vos voyelles {vowels} sont provisoires, et vous pouvez modifier ces valeurs à tout moment depuis le tiroir de gauche.' },
	'profile.emptyState': { en: 'Calibrate your voice to begin.', fr: 'Calibrate your voice to begin.' },
	'profile.octaveNotice': { en: 'This voice line is notated in treble clef but sits an octave above the range you gave, so it\'s being read an octave lower to match your voice, as lower voices often sing treble parts. Check the score\'s clef if that\'s not right.', fr: 'This voice line is notated in treble clef but sits an octave above the range you gave, so it\'s being read an octave lower to match your voice, as lower voices often sing treble parts. Check the score\'s clef if that\'s not right.' },
	'profile.scoreRegionAria': { en: 'Repertoire fit score', fr: 'Repertoire fit score' },
	'profile.scorePageAria': { en: 'Score page {n} of {total}', fr: 'Score page {n} of {total}' },
	'profile.notesPageAria': { en: 'Analysis notes', fr: 'Analysis notes' },
	'profile.emptyStateAria': { en: 'Voice profile', fr: 'Voice profile' },
	'profile.withheld.heading': { en: 'Nothing is claimed about your voice', fr: 'Rien n’est affirmé sur votre voix' },
	'profile.withheld.lede': { en: 'Ilya has read your score, but no voice has been measured, so there is nothing to compare this line against.', fr: 'Ilya a lu votre partition, mais aucune voix n’a été mesurée, donc il n’y a rien à quoi comparer cette ligne.' },
	'profile.withheld.item1': { en: 'Every acoustic mark: no crossings, no timbre turns.', fr: 'Toute marque acoustique : aucun croisement, aucun changement de timbre.' },
	'profile.withheld.item2': { en: 'The watch list, entirely. An empty list is the truthful output here.', fr: 'La liste des points à surveiller, entièrement. Une liste vide est ici la réponse honnête.' },
	'profile.withheld.item3': { en: 'Any reading of your range, your tessitura, or your passaggio.', fr: 'Toute lecture de votre ambitus, de votre tessiture ou de votre passaggio.' },
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
