/**
 * THE NAMES OF ILYA'S PARTS, ONE RECORD EACH.
 *
 * What this module is for. A singer meets each part of Ilya under one name in
 * English and one in French, and a contributor meets the same part under a
 * name in code, a folder, and sometimes a stored value. This module is the
 * single list of those names: for each concept, the i18n key of the name on
 * screen (English and French are read through `t()`, never copied here), the
 * identifiers and folder today and after consistency batch 3, the stored
 * values that carry a name, and the retired words a singer must never read
 * again.
 *
 * What reads it. NOTHING YET. `names.test.ts` checks that the record is
 * well-formed. Row 171 widens `no-fit-name.test.ts` into a guard that reads
 * `retired` across the surfaces a singer reads, and batch 2's legend test
 * reads it for the contributors' legend. Until then this is a record, not a
 * rule.
 *
 * Written by consistency batch 1, step 2 (2026-11-01), from the consistency
 * audit (`docs/sessions/report-desk-consistency-audit_r1_2026-11-01.md`,
 * A.2, A.3, A2.3) and Fable's review of the batch brief (amendment 13). The
 * shape is the review's, verbatim. A name in `retired` is a SCREEN word;
 * `retiredIdentifiers` is for the machine and is empty until batch 3.
 *
 * Collisions are the reason every retired pattern says whether it is a bare
 * word or a phrase. A bare word is safe only where no ordinary word spells it
 * the same: lowercase "markup" and "metadata" as nouns pass a case-sensitive
 * pattern, « poignée » meaning a handful does not pass a bare « poignée »,
 * and « Transcrire » as a heading is a verb a phrase must name in context.
 */

export type Surface = 'i18n' | 'guide' | 'learn' | 'legend';
export type Store = 'localStorage' | 'indexedDB' | 'bandId' | 'tabId' | 'anchor' | 'i18nKey';

/** A retired word or phrase a singer must never read again. */
export interface RetiredWord {
	/** RegExp source, Unicode (`u`), case-sensitive. A bare word is `\\bMarkup\\b`; a phrase is `click Transcribe`. */
	pattern: string;
	kind: 'bare' | 'phrase';
	language: 'en' | 'fr';
	/** One sentence: the ordinary-word collision a phrase avoids, or why the bare word is safe. */
	why: string;
	/** Surfaces the guard reads it on; all four when omitted. */
	surfaces?: readonly Surface[];
}

/** A name the machine uses. Checked as an exact token in source and in `git ls-files` paths. */
export interface Identifier {
	today: string;
	/** After batch 3; equal to `today` when it does not change. */
	after: string;
}

export interface Persisted {
	store: Store;
	today: string;
	after: string;
	/** Where the old value is still read, and why; 'none' when nothing reads it. */
	migration: string;
}

export interface Concept {
	/** Stable lowercase id; after batch 3 it is also the code identifier (`melody`). */
	id: string;
	/** The i18n key of the on-screen name. English and French are read through `t()`, never copied here. */
	nameKey: string;
	/** French gender of the on-screen name, for agreement checks: m, f, m.pl, f.pl. */
	gender: 'm' | 'f' | 'm.pl' | 'f.pl';
	identifiers: readonly Identifier[];
	folder?: Identifier;
	persisted?: readonly Persisted[];
	retired: readonly RetiredWord[];
	/** Retired identifiers (`MarkupPane`, `scoreMarkup`): exact tokens, not prose. Empty until batch 3. */
	retiredIdentifiers: readonly string[];
}

export const CONCEPTS: readonly Concept[] = [
	{
		id: 'text',
		nameKey: 'tab.text',
		gender: 'm',
		identifiers: [{ today: 'text', after: 'text' }],
		folder: { today: 'apps/web/src/lib/text/', after: 'apps/web/src/lib/text/' },
		persisted: [
			{
				store: 'tabId',
				today: 'text',
				after: 'text',
				migration: "`restoreSurface` (`destinations.ts`) still reads the pre-N.174 value 'transcription' and writes 'text' on the next save.",
			},
		],
		retired: [
			{ pattern: 'Transcribe and fit', kind: 'phrase', language: 'en', why: "The label of the retired button (`input.transcribe`); no ordinary sentence contains the whole phrase." },
			{ pattern: 'click Transcribe', kind: 'phrase', language: 'en', why: 'The Guide\'s old instruction (`GuideContent.svelte`, the walkthrough); the verb "transcribe" alone is ordinary and stays legal in prose.' },
			{ pattern: 'cliquez sur Transcrire', kind: 'phrase', language: 'fr', why: "The Guide's old instruction in French; « Transcrire » alone is an ordinary verb and is also a heading, so only the instruction is retired." },
			{ pattern: 'Transcription tab', kind: 'phrase', language: 'en', why: 'The old name of the TEXT tab as the Guide writes it; "transcription" alone is the ordinary word for the act and passes.' },
			{ pattern: "l'onglet Transcription", kind: 'phrase', language: 'fr', why: "The old name of the TEXTE tab as the Guide writes it; « transcription » alone is the ordinary word and passes." },
		],
		retiredIdentifiers: [],
	},
	{
		id: 'melody',
		nameKey: 'tab.markedScore',
		gender: 'm',
		identifiers: [
			{ today: 'markup', after: 'melody' },
			{ today: 'MarkupPane', after: 'MelodyPane' },
		],
		folder: { today: 'apps/web/src/lib/markup/', after: 'apps/web/src/lib/melody/' },
		persisted: [
			{
				store: 'tabId',
				today: 'markup',
				after: 'melody',
				migration: "`restoreSurface` (`destinations.ts`) reads 'markup' (and the older 'shane'); batch 3 must keep reading 'markup' and write 'melody'.",
			},
			{
				store: 'anchor',
				today: 'guide-markup-*',
				after: 'guide-melody-*',
				migration: '`guide-anchors.ts` (`RENAMED`, three entries) migrates `guide-fit-*` to `guide-markup-*`; batch 3 adds the second step to `guide-melody-*`.',
			},
			{
				store: 'i18nKey',
				today: 'tab.markedScore',
				after: 'tab.melody',
				migration: 'none: a key is read by code, not stored; batch 3 renames it and updates `nameKey`.',
			},
		],
		retired: [
			{ pattern: '\\bMarkup\\b', kind: 'bare', language: 'en', why: 'The only ordinary use is the noun "markup", lowercase, which the case-sensitive pattern passes.' },
			{ pattern: '\\bAnnotation\\b', kind: 'bare', language: 'fr', why: "« annotations » lowercase in `LearnContent.svelte` passes; Grayson's title carries « Annotations » in English only." },
			{ pattern: 'Partition annotée', kind: 'phrase', language: 'fr', why: 'The ratified 2026-08-19 name for the old document, superseded by « Annotation » and now by « CHANT »; « partition » alone is ordinary.' },
		],
		retiredIdentifiers: [],
	},
	{
		id: 'insights',
		nameKey: 'tab.insights',
		gender: 'm.pl',
		identifiers: [{ today: 'insights', after: 'insights' }],
		folder: { today: 'apps/web/src/lib/insights/', after: 'apps/web/src/lib/insights/' },
		persisted: [
			{ store: 'tabId', today: 'insights', after: 'insights', migration: 'none: the wire id has not changed.' },
		],
		retired: [
			{
				pattern: '\\bFit\\b',
				kind: 'bare',
				language: 'en',
				why: 'The codename-era screen name; lowercase "fit" (compatibility, `insights.verdict.fit`, "a good fit for you") passes the case-sensitive pattern. NOT ESTABLISHED: a sentence-initial verb "Fit" would trip it and would then need a phrase pattern.',
			},
		],
		retiredIdentifiers: [],
	},
	{
		id: 'learn',
		nameKey: 'tab.learn',
		gender: 'f.pl',
		identifiers: [{ today: 'learn', after: 'learn' }],
		persisted: [
			{ store: 'tabId', today: 'learn', after: 'learn', migration: 'none: the wire id has not changed.' },
		],
		retired: [],
		retiredIdentifiers: [],
	},
	{
		id: 'guide',
		nameKey: 'tab.guide',
		gender: 'm',
		identifiers: [{ today: 'guide', after: 'guide' }],
		persisted: [
			{ store: 'tabId', today: 'guide', after: 'guide', migration: 'none: the wire id has not changed.' },
		],
		retired: [],
		retiredIdentifiers: [],
	},
	{
		id: 'piece',
		nameKey: 'group.piece',
		gender: 'f',
		identifiers: [{ today: 'piece', after: 'piece' }],
		persisted: [
			{ store: 'bandId', today: 'piece', after: 'piece', migration: 'none: `BAND_IDS.piece` has not changed.' },
		],
		retired: [
			{ pattern: '\\bMetadata\\b', kind: 'bare', language: 'en', why: 'The retired section name; lowercase "metadata" as a noun passes the case-sensitive pattern.' },
			{ pattern: '\\bMétadonnées\\b', kind: 'bare', language: 'fr', why: 'The retired section name; lowercase « métadonnées » as a noun passes the case-sensitive pattern. NOT ESTABLISHED: a sentence-initial noun « Métadonnées » would trip it.' },
		],
		retiredIdentifiers: [],
	},
	{
		id: 'input',
		nameKey: 'group.input',
		gender: 'f',
		identifiers: [{ today: 'input', after: 'input' }],
		persisted: [
			{ store: 'bandId', today: 'input', after: 'input', migration: 'none: `BAND_IDS.input` has not changed.' },
		],
		retired: [],
		retiredIdentifiers: [],
	},
	{
		id: 'voice',
		nameKey: 'group.scoreMarkup',
		gender: 'f',
		identifiers: [{ today: 'scoreMarkup', after: 'voice' }],
		persisted: [
			{
				store: 'bandId',
				today: 'scoreMarkup',
				after: 'voice',
				migration: '`BAND_IDS.scoreMarkup` (`sections.svelte.ts`) is a stored band id; invariant 10 requires a migration that reads both when batch 3 renames it.',
			},
			{ store: 'i18nKey', today: 'group.scoreMarkup', after: 'group.voice', migration: 'none: a key is read by code, not stored.' },
		],
		retired: [],
		retiredIdentifiers: [],
	},
	{
		id: 'poem',
		nameKey: 'intake.view.poem',
		gender: 'm',
		identifiers: [],
		retired: [],
		retiredIdentifiers: [],
	},
	{
		id: 'lyrics',
		nameKey: 'intake.view.lyrics',
		gender: 'f.pl',
		identifiers: [],
		retired: [],
		retiredIdentifiers: [],
	},
	{
		id: 'corrections',
		nameKey: 'loupe.station.corrections',
		gender: 'f.pl',
		identifiers: [],
		retired: [],
		retiredIdentifiers: [],
	},
	{
		id: 'underlay',
		nameKey: 'underlay.heading',
		gender: 'm',
		identifiers: [],
		retired: [],
		retiredIdentifiers: [],
	},
	{
		id: 'analysis',
		nameKey: 'console.placeholder',
		gender: 'f',
		identifiers: [{ today: 'AnalysisStation', after: 'AnalysisStation' }],
		retired: [
			{ pattern: '\\bInspector\\b', kind: 'bare', language: 'en', why: 'The retired name of the analysis panel; it is not drawn, and no ordinary English use is capitalised.' },
			{ pattern: '\\bRibbon\\b', kind: 'bare', language: 'en', why: 'The retired name of the syllable breakdown; lowercase "ribbon" passes the case-sensitive pattern.' },
			{ pattern: '\\bInspecteur\\b', kind: 'bare', language: 'fr', why: 'The retired name of the analysis panel in French; no ordinary French use of the capitalised word is known.' },
			{ pattern: 'Ruban syllabique', kind: 'phrase', language: 'fr', why: "The retired name of the syllable breakdown; « ruban » alone is an ordinary noun." },
		],
		retiredIdentifiers: [],
	},
	{
		id: 'drawer',
		nameKey: 'drawer.pull',
		gender: 'm',
		identifiers: [{ today: 'Drawer', after: 'Drawer' }],
		retired: [
			{ pattern: "The Handle", kind: 'phrase', language: 'en', why: 'The Guide called the pull the drawer\'s "Handle"; the ordinary verb and noun "handle" in lowercase pass.' },
			{ pattern: 'poignée du Tiroir', kind: 'phrase', language: 'fr', why: "The Guide's old name for the pull; « poignée » alone also means a handful (`GuideContent.svelte`, « une poignée d'échantillons ») and must pass." },
		],
		retiredIdentifiers: [],
	},
	{
		id: 'page',
		nameKey: 'drawer.paper',
		gender: 'f',
		identifiers: [],
		retired: [
			{ pattern: 'the Paper', kind: 'phrase', language: 'en', why: 'Ruled by Dann 2026-11-01 (brief r2, ruling 3): the page is "the page"; "paper" alone is ordinary (a paper document) and passes.' },
			{ pattern: 'le Papier', kind: 'phrase', language: 'fr', why: "Ruled by Dann 2026-11-01 (brief r2, ruling 3): « la page »; « papier » alone is ordinary and passes." },
		],
		retiredIdentifiers: [],
	},
	{
		id: 'spotReduction',
		nameKey: 'inspector.spot.reduction',
		gender: 'f',
		identifiers: [],
		retired: [
			{ pattern: 'Réduction ciblée', kind: 'phrase', language: 'fr', why: "Ruled « Réduction ponctuelle »; « ciblée » alone is an ordinary adjective (« une attention ciblée », « annotations ciblées » in `LearnContent.svelte`)." },
		],
		retiredIdentifiers: [],
	},
	{
		id: 'spotReconstitution',
		nameKey: 'inspector.spot.reconstitution',
		gender: 'f',
		identifiers: [],
		retired: [
			{ pattern: 'Reconstitution ciblée', kind: 'phrase', language: 'fr', why: "Ruled « Reconstitution ponctuelle »; « ciblée » alone is an ordinary adjective." },
		],
		retiredIdentifiers: [],
	},
];
