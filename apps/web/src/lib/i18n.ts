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
	'input.clear':                 { en: 'Clear',                        fr: 'Effacer' },
	'input.print':                 { en: 'Print',                        fr: 'Imprimer' },

	// ── Result meta ──────────────────────────────────────────
	'result.words':                { en: 'words in',                     fr: 'mots en' },

	// ── Song setup (metadata fields) ─────────────────────────
	'meta.heading':                { en: 'Song Setup',                   fr: 'Configuration du chant' },
	'meta.title':                  { en: 'Title',                        fr: 'Titre' },
	'meta.composer':               { en: 'Composer',                     fr: 'Compositeur' },
	'meta.poet':                   { en: 'Poet / Librettist',            fr: 'Poète / Librettiste' },
	'meta.opus':                   { en: 'Opus / Source',                fr: 'Opus / Source' },
	'meta.transcriber':            { en: 'Transcriber name',             fr: 'Nom du transcripteur' },
	'meta.textBy':                 { en: 'Text by',                      fr: 'Texte de' },

	// ── Cosmetic options (IPA display toggles) ───────────────
	'cosmetic.heading':            { en: 'Cosmetic Options',             fr: 'Options cosmétiques' },
	'cosmetic.reducedVowel.left':  { en: 'Default [ʌ]',                 fr: 'Par défaut [ʌ]' },
	'cosmetic.reducedVowel.right': { en: 'Display [ə] instead',         fr: 'Afficher [ə]' },
	'cosmetic.palatalNasal.left':  { en: 'Palatal nasal [ɲ]',           fr: 'Nasale palatale [ɲ]' },
	'cosmetic.palatalNasal.right': { en: 'Palatalized nasal [nʲ]',      fr: 'Nasale palatalisée [nʲ]' },
	'cosmetic.geminates.left':     { en: 'Separate geminates [tt]',     fr: 'Géminées séparées [tt]' },
	'cosmetic.geminates.right':    { en: 'Length markers [tː]',         fr: 'Marqueurs de durée [tː]' },
	'cosmetic.shcha.left':         { en: 'Shcha notation [ʃʲʃʲ]',      fr: 'Notation chtcha [ʃʲʃʲ]' },
	'cosmetic.shcha.right':        { en: '[ʃʲː]',                       fr: '[ʃʲː]' },
	'cosmetic.reconstitution.left':  { en: 'Reduction',                  fr: 'Réduction' },
	'cosmetic.reconstitution.right': { en: 'Reconstitution',             fr: 'Reconstitution' },

	// ── Display section ──────────────────────────────────────
	'display.heading':             { en: 'Display',                      fr: 'Affichage' },
	'display.stressDiacritics.left':  { en: 'Stress diacritics',         fr: 'Diacritiques d\u2019accent' },
	'display.stressDiacritics.right': { en: 'Show acute accent',         fr: 'Afficher l\u2019accent aigu' },

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
	'inspector.unknownStress':     { en: 'Unknown stress \u00b7 verify manually', fr: 'Accent inconnu \u00b7 vérifier manuellement' },
	'inspector.ribbon':            { en: 'Character breakdown',          fr: 'Décomposition par caractère' },
	'inspector.blurbs':            { en: 'Phonological notes',           fr: 'Notes phonologiques' },
	'inspector.notationDefault':   { en: 'Notation: default (Grayson)',  fr: 'Notation\u00a0: par défaut (Grayson)' },

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

	// ── Paper empty state ────────────────────────────────────
	'paper.empty':                 { en: 'To begin, enter your text in the drawer to the left.', fr: 'Pour commencer, saisissez votre texte dans le tiroir à gauche.' },

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
	'footer.attribution1':         {
		en: 'This transcription was created by {name} using <em>Ilya</em>, which operationalizes Dr.\u00a0Craig Grayson\u2019s <em>Russian Lyric Diction</em> (University of Washington, 2012). 1.3M-word stress data and translation glosses from English and French Wiktionary via kaikki.org (CC\u00a0BY-SA\u00a04.0).',
		fr: 'Cette transcription a été créée par {name} à l\u2019aide d\u2019<em>Ilya</em>, qui met en \u0153uvre <em>Russian Lyric Diction</em> du Dr\u00a0Craig Grayson (University of Washington, 2012). Données d\u2019accentuation de 1,3\u00a0M de mots et glossaires de traduction du Wiktionnaire anglais et français via kaikki.org (CC\u00a0BY-SA\u00a04.0).'
	},
	'footer.attribution2':         {
		en: '<em>Ilya</em> is a free, open-source scholarly tool for teachers and performing artists. Neither <em>Ilya</em> nor the transcriptions you make with <em>Ilya</em> may be repackaged or sold. Made with love in Canada',
		fr: '<em>Ilya</em> est un outil savant gratuit et à code ouvert pour les enseignants et les artistes interprètes. Ni <em>Ilya</em> ni les transcriptions que vous créez avec <em>Ilya</em> ne peuvent être reconditionnés ou vendus. Fait avec amour au Canada'
	},
	'footer.page':                 { en: 'Page',                         fr: 'Page' },
	'footer.of':                   { en: 'of',                           fr: 'sur' },

	// ── Page size ────────────────────────────────────────────
	'pageSize.label':              { en: 'Page size',                    fr: 'Format de page' },
	'pageSize.letter':             { en: 'Letter',                       fr: 'Lettre' },
	'pageSize.a4':                 { en: 'A4',                           fr: 'A4' },

	// ── Provenance labels (for Inspector inline display) ─────
	'provenance.dictionary':       { en: 'Stress verified from dictionary',      fr: 'Accent vérifié dans le dictionnaire' },
	'provenance.supplement':       { en: 'Stress from singer supplement',        fr: 'Accent du supplément pour chanteurs' },
	'provenance.yo':               { en: 'Stress derived from ё',               fr: 'Accent dérivé de ё' },
	'provenance.inferred':         { en: 'Stress algorithmically inferred',      fr: 'Accent inféré algorithmiquement' },
	'provenance.unknown':          { en: 'Unknown stress \u2014 verify manually', fr: 'Accent inconnu \u2014 vérifier manuellement' },
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
		case 'dictionary':  return t('stress.dictionary', lang);
		case 'supplement':  return t('stress.supplement', lang);
		case 'yo-rule':     return t('stress.yoRule', lang);
		case 'yo-restored': return t('stress.yoRestored', lang);
		case 'inferred':    return t('stress.inferred', lang);
		case 'unknown':     return t('stress.unknown', lang);
		default:            return source;
	}
}
