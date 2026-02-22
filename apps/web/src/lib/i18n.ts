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
	'inspector.dictCapacity':       { en: 'Maximum 20 characters',         fr: 'Maximum de 20 caractères' },

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
		en: 'Free and open source, <em>Ilya</em>\u00a02026a operationalizes Grayson\u2019s <em>Russian Lyric Diction</em> (University of Washington, 2012). Stress data and translation glosses via <a href="https://kaikki.org" target="_blank" rel="noopener">kaikki.org</a> (<a href="https://creativecommons.org/licenses/by-sa/4.0/deed.en" target="_blank" rel="noopener">CC\u00a0BY-SA\u00a04.0</a>). Made with love in Canada by Dann Mitton',
		fr: 'Gratuit et à code ouvert, <em>Ilya</em>\u00a02026a met en \u0153uvre <em>Russian Lyric Diction</em> de Grayson (University of Washington, 2012). Données d\u2019accentuation et glossaires de traduction via <a href="https://kaikki.org" target="_blank" rel="noopener">kaikki.org</a> (<a href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr" target="_blank" rel="noopener">CC\u00a0BY-SA\u00a04.0</a>). Fait avec amour au Canada par Dann Mitton'
	},
	'footer.page':                 { en: 'Page',                         fr: 'Page' },
	'footer.of':                   { en: 'of',                           fr: 'sur' },

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
