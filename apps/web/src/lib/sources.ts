/**
 * The one registry of the works Ilya cites (brief
 * `docs/sessions/brief-code-guide-sources_r1_2026-09-27.md`; Dann 2026-09-27
 * 00:58, "I want unassailable citation"). Insights' comments
 * (`insights/comment-sources.ts`), and the Guide's Sources section
 * (`GuideSources.svelte`) read it, so no copy is typed by hand twice.
 *
 * EVERY VALUE HERE WAS READ, NEVER SUPPLIED. `record` names where. A field
 * nobody read is `null` and prints nothing. The Insights works were read from
 * the extraction records (N.168, 2026-09-25); the others from the places the
 * app already cites them. Titles stay in English in both languages.
 *
 * A work the app cites without enough to reference it (no title) is not here:
 * it is on `OWED`, so the registry test can tell a known gap from a new one.
 */

/** The Guide's three groups (ratified 2026-09-27 01:02). */
export type SourceGroup = 'diction' | 'voice' | 'texts';
export const SOURCE_GROUPS: readonly SourceGroup[] = ['diction', 'voice', 'texts'];

export interface Work {
	key: string;
	/** Surname, as the short citation prints it. */
	author: string;
	/** As the full reference prints it: surname first. */
	authorFull: string;
	/** Cut at the colon, as `draft-three-comments_r2` §0 fixes them. */
	shortTitle: string;
	fullTitle: string;
	year: number;
	edition: string | null;
	place: string | null;
	publisher: string | null;
	/** A reprint or reissue note, as the source record gives it. */
	printing: string | null;
	isbn: string | null;
	/** A thesis's degree, "D.M.A.", printed before its university (`publisher`). */
	degree: string | null;
	/** An article's journal and its volume and issue as printed; the title then sits in quotation marks. */
	container: { title: string; volume: string } | null;
	url: string | null;
	/** What the work does for Ilya: the Guide's Sources groups it by this. */
	group: SourceGroup;
	/** Where the imprint was read. */
	record: string;
}

export const WORKS: Record<string, Work> = {
	grayson2012: {
		key: 'grayson2012',
		author: 'Grayson',
		authorFull: 'Grayson, Craig M.',
		shortTitle: 'Russian Lyric Diction',
		fullTitle: 'Russian Lyric Diction: A Practical Guide with Introduction and Annotations and a Bibliography with Annotations on Selected Sources',
		year: 2012,
		edition: null,
		place: null,
		publisher: 'University of Washington',
		printing: null,
		isbn: null,
		degree: 'D.M.A.',
		container: null,
		url: null,
		group: 'diction',
		record: '`NOTICES.md:7-9` and `README.md:105`, which agree',
	},
	yanushevskaya2015: {
		key: 'yanushevskaya2015',
		author: 'Yanushevskaya and Bunčić',
		authorFull: 'Yanushevskaya, Irena, and Daniel Bunčić',
		shortTitle: 'Russian',
		fullTitle: 'Russian',
		year: 2015,
		edition: null,
		place: null,
		publisher: null,
		printing: null,
		isbn: null,
		degree: null,
		container: { title: 'Journal of the International Phonetic Association', volume: '45/2' },
		url: null,
		group: 'diction',
		record: '`LearnContent.svelte`, Unit 1 sources (English `:2727`, French `:678`)',
	},
	montgomery2021: {
		key: 'montgomery2021',
		author: 'Montgomery',
		authorFull: 'Montgomery, Cheri',
		shortTitle: 'Russian Lyric Diction Workbook',
		fullTitle: 'Russian Lyric Diction Workbook',
		year: 2021,
		edition: null,
		place: null,
		publisher: 'STM',
		printing: null,
		isbn: null,
		degree: null,
		container: null,
		url: null,
		group: 'diction',
		record: '`LearnContent.svelte:3476-3477` (French `:1447-1448`)',
	},
	challis2006: {
		key: 'challis2006',
		author: 'Challis',
		authorFull: 'Challis, Natalia',
		shortTitle: 'The Singer’s Rachmaninoff',
		fullTitle: 'The Singer’s Rachmaninoff',
		year: 2006,
		edition: null,
		place: null,
		publisher: null,
		printing: null,
		isbn: null,
		degree: null,
		container: null,
		url: null,
		group: 'diction',
		record: '`LearnContent.svelte:3443-3444` (French `:1414`)',
	},
	mitton2020: {
		key: 'mitton2020',
		author: 'Mitton',
		authorFull: 'Mitton, Daniel A.',
		shortTitle: 'Sung Russian for the Low Male Voice Classical Singer',
		fullTitle: 'Sung Russian for the Low Male Voice Classical Singer: The Latent Pedagogical Value of Sung Russian',
		year: 2020,
		edition: null,
		place: null,
		publisher: 'University of Toronto',
		printing: null,
		isbn: null,
		degree: 'D.M.A.',
		container: null,
		url: 'https://hdl.handle.net/1807/100864',
		group: 'voice',
		record: '`README.md:107`',
	},
	pacheco2013: {
		key: 'pacheco2013',
		author: 'Pacheco',
		authorFull: 'Pacheco, Alberto José Vieira',
		shortTitle: 'Angelica Catalani’s Voice According to a Method of Statistical Analysis',
		fullTitle: 'Angelica Catalani’s Voice According to a Method of Statistical Analysis',
		year: 2013,
		edition: null,
		place: null,
		publisher: null,
		printing: null,
		isbn: null,
		degree: null,
		container: { title: 'Journal of Singing', volume: '69, no. 5' },
		url: null,
		group: 'voice',
		// Insights prints this reference beside "CITATION NOT YET VERIFIED" (`insights.footnote.tessitura`).
		record: '`i18n.ts`, `insights.footnote.tessitura`; NOT VERIFIED against the article',
	},
	richter2002: {
		key: 'richter2002',
		author: 'Richter',
		authorFull: 'Richter, Laurence R.',
		shortTitle: 'Mussorgsky’s Complete Song Texts',
		fullTitle: 'Mussorgsky’s Complete Song Texts',
		year: 2002,
		edition: null,
		place: 'Geneseo, NY',
		publisher: 'Leyerle Publications',
		printing: null,
		isbn: '1-878617-31-1',
		degree: null,
		container: null,
		url: null,
		group: 'texts',
		record: '`NOTICES.md:21-22`',
	},
	miller2004: {
		key: 'miller2004',
		author: 'Miller',
		authorFull: 'Miller, Richard',
		shortTitle: 'Solutions for Singers',
		fullTitle: 'Solutions for Singers: Tools for Performers and Teachers',
		year: 2004,
		edition: null,
		place: null,
		publisher: 'Oxford University Press',
		printing: null,
		isbn: '978-0-19-516005-5',
		group: 'voice',
		degree: null,
		container: null,
		url: null,
		record: 'Insights Research/long-works-toc-screen_miller-2004_r1_2026-09-24.md, copyright page',
	},
	bozeman2025: {
		key: 'bozeman2025',
		author: 'Bozeman',
		authorFull: 'Bozeman, Kenneth',
		shortTitle: 'Practical Vocal Acoustics',
		fullTitle: 'Practical Vocal Acoustics',
		year: 2025,
		edition: '2nd ed.',
		// NOT ESTABLISHED: no record read this session names the publisher or ISBN.
		place: null,
		publisher: null,
		printing: null,
		isbn: null,
		group: 'voice',
		degree: null,
		container: null,
		url: null,
		record: 'Insights Research/_extraction/sources_bozeman-PVA2_batch-A.md',
	},
	reid1975: {
		key: 'reid1975',
		author: 'Reid',
		authorFull: 'Reid, Cornelius L.',
		shortTitle: 'Voice: Psyche and Soma',
		fullTitle: 'Voice: Psyche and Soma',
		year: 1975,
		edition: null,
		place: 'New York',
		publisher: 'Joseph Patelson Music House',
		printing: 'third printing 1999',
		isbn: '0-915282-00-3',
		group: 'voice',
		degree: null,
		container: null,
		url: null,
		record: 'Insights Research/_synthesis/memo-fable-reid-1975-front_r1_2026-09-24.md',
	},
	mckinney1994: {
		key: 'mckinney1994',
		author: 'McKinney',
		authorFull: 'McKinney, James C.',
		shortTitle: 'The Diagnosis and Correction of Vocal Faults',
		fullTitle: 'The Diagnosis and Correction of Vocal Faults',
		year: 1994,
		edition: null,
		place: null,
		publisher: 'Waveland',
		printing: 'reissued 2005',
		isbn: null,
		group: 'voice',
		degree: null,
		container: null,
		url: null,
		record: 'Insights Research/_synthesis/memo-sonnet-mckinney-1994_r1_2026-09-23.md',
	},
	bozeman2021: {
		key: 'bozeman2021',
		author: 'Bozeman',
		authorFull: 'Bozeman, Kenneth W.',
		shortTitle: 'Kinesthetic Voice Pedagogy 2',
		fullTitle: 'Kinesthetic Voice Pedagogy 2: Motivating Acoustic Efficiency',
		year: 2021,
		edition: null,
		place: null,
		publisher: 'Inside View Press',
		printing: null,
		// Supplied by Dann 2026-09-30 12:15; the copyright page is not among the photos.
		isbn: '978-1-7335060-3-8',
		group: 'voice',
		degree: null,
		container: null,
		url: null,
		record: 'Insights Research/_synthesis/memo-sonnet-kvp2_r1_2026-09-25.md, line 3',
	},
	miller1986: {
		key: 'miller1986',
		author: 'Miller',
		authorFull: 'Miller, Richard',
		shortTitle: 'The Structure of Singing',
		fullTitle: 'The Structure of Singing',
		year: 1986,
		edition: null,
		// Title and copyright pages, PDF pp. 1 to 8 (read by the desk, 2026-09-30).
		place: 'New York',
		publisher: 'Schirmer Books',
		printing: null,
		isbn: null,
		group: 'voice',
		degree: null,
		container: null,
		url: null,
		record: 'Insights Research/long-works-toc-screen_r1_2026-09-23.md, §6; the imprint from the title and copyright pages, PDF pp. 1 to 8 (desk, 2026-09-30)',
	},
	howell2025: {
		key: 'howell2025',
		author: 'Howell',
		authorFull: 'Howell, Ian',
		// The two batch records print different subtitles, so none is printed. NOT ESTABLISHED.
		shortTitle: 'Hearing Singing',
		fullTitle: 'Hearing Singing',
		year: 2025,
		edition: null,
		place: 'Lanham, MD',
		publisher: 'Rowman & Littlefield',
		printing: null,
		isbn: null,
		group: 'voice',
		degree: null,
		container: null,
		url: null,
		record: 'Insights Research/_extraction/sources_howell-HS_batch-B.md',
	},
};

/**
 * A run of text; `title` sets in italics (a title, or a term of art such as
 * *whoop*); `sub` sets as a subscript, for the R1 of *f*<sub>R1</sub>.
 */
export interface Run {
	text: string;
	title?: boolean;
	sub?: boolean;
}

/** The works of one group, alphabetical by author then year, as the Guide lists them. */
export function worksIn(group: SourceGroup): string[] {
	return Object.keys(WORKS)
		.filter((k) => WORKS[k].group === group)
		.sort((a, b) => WORKS[a].authorFull.localeCompare(WORKS[b].authorFull, 'en') || WORKS[a].year - WORKS[b].year);
}

/**
 * Works the app cites by author and year but gives no title for, so no full
 * reference can be printed without supplying one. Each is owed a record.
 * Key: the surname as the text prints it, and the year.
 */
export const OWED: Record<string, string> = {
	'Challis 1989': 'Learn, the survey of earlier guides (`LearnContent.svelte:2081`, French `:32`): "pioneering Rachmaninoff volume", no title',
	'Piatak 1991': 'Learn `:2081`; the title *Russian Songs and Arias* is in Grayson\'s introduction as the Guide quotes it (`GuideContent.svelte:488`), with no year',
	'Richter 1999': 'Learn `:2081`: "six-volume series (1999-2008)", no titles',
	'Belov 2004': 'Learn `:2081`: "libretti", no title',
	'Olin 2012': 'Learn `:2081`, no title',
	'McMaster 2012': 'Learn `:2081`: "in Sheil, 2012", no title',
	'Thomas 2010': 'Learn `:2081`: "in Karna, 2010", no title',
	'Lindblom 1983': 'Learn `:3571-3572`: "economy of speech gestures", no title',
	'Derwing 1980': 'Learn `:3639`: "Derwing and Priestly (1980, 76–87)", no title',
	'Bolla 1980': 'Learn `:3384`: "Bolla 1980, 8", no title',
};

/**
 * The work in full, as "Sources cited" and the tap print it. Null fields
 * print nothing. French follows the OQLF's « Notices bibliographiques par
 * types de documents » (`frenchReference`); English keeps its own style.
 */
export function fullReference(workKey: string, language: 'en' | 'fr' = 'en'): Run[] {
	if (language === 'fr') return frenchReference(workKey);
	const w = WORKS[workKey];
	const author = { text: `${w.authorFull.replace(/\.$/, '')}. ` };
	const tail = `${w.isbn ? ` ISBN ${w.isbn}.` : ''}${w.url ? ` ${w.url}.` : ''}`;
	// An article: the title in quotation marks, then the journal in italics (Pacheco's form in `i18n.ts`).
	if (w.container)
		return [author, { text: `“${w.fullTitle}.” ` }, { text: w.container.title, title: true }, { text: ` ${w.container.volume} (${w.year}).${tail}` }];
	const imprint = [w.degree, w.place && w.publisher ? `${w.place}: ${w.publisher}` : w.publisher, String(w.year), w.printing]
		.filter((s): s is string => !!s)
		.join(', ');
	return [
		author,
		{ text: w.fullTitle, title: true },
		{ text: `${w.edition ? `, ${w.edition.replace(/\.$/, '')}` : ''}. ${imprint}.${tail}` },
	];
}

/* ── French: the OQLF notice ─────────────────────────────────────────
   Brief `brief-code-french-references-oqlf_r1_2026-09-30.md`, under Dann's
   ruling of 2026-09-30 21:39. Models read from the OQLF's « Notices
   bibliographiques par types de documents » (vitrinelinguistique.oqlf.gouv.qc.ca/23252,
   read by Code 2026-09-30):

   - livre: « NOM, Prénom. *Titre : sous-titre*, numéro de l'édition, lieu de
     publication, maison d'édition, date de publication, … »
   - thèse: « BALLARIN, Sophie. *Titre*, Thèse (Ph. D.), Université de
     Montréal, 2009, … »
   - article: « NOM, Prénom. « Titre », *Nom de la revue*, volume, numéro,
     date de publication, … », as « vol. 8, no 4 ».

   For a work in another language the OQLF keeps the author's name, the title
   (its capitals and its punctuation), and the publisher as published; the
   edition, the place, and the date follow French usage. So nothing here
   touches a title, a name, or a publisher: the surname is set in capitals,
   as the model sets it, and the frame around them is French. */

/** A surname in capitals; a Mc prefix keeps its case, « McKINNEY » (DESK DEFAULT). */
const capitals = (surname: string) =>
	/^Mc/.test(surname) ? `Mc${surname.slice(2).toLocaleUpperCase('fr-CA')}` : surname.toLocaleUpperCase('fr-CA');

/** "Grayson, Craig M." to « GRAYSON, Craig M. »; a second author « et Prénom NOM ». */
function frenchAuthor(full: string): string {
	// The trailing period is the notice's own, added after, as in English.
	const [first, second] = full.replace(/\.$/, '').split(', and ');
	const comma = first.indexOf(', ');
	const lead = comma === -1 ? capitals(first) : `${capitals(first.slice(0, comma))}${first.slice(comma)}`;
	if (!second) return lead;
	const space = second.lastIndexOf(' ');
	return `${lead}, et ${second.slice(0, space)} ${capitals(second.slice(space + 1))}`;
}

/** "2nd ed." to « 2e éd. », as the OQLF's « 3e éd. ». */
function frenchEdition(edition: string): string {
	const m = /^(\d+)(?:st|nd|rd|th) ed\.?$/.exec(edition);
	if (!m) return edition;
	return `${m[1]}${m[1] === '1' ? 're' : 'e'} éd.`;
}

/** "Lanham, MD" to « Lanham (MD) », so the place holds no comma of its own in a comma-separated notice. */
function frenchPlace(place: string): string {
	const m = /^(.+), ([A-Z]{2})$/.exec(place);
	return m ? `${m[1]} (${m[2]})` : place;
}

/** The registry's printing notes, in French. DESK DEFAULT; an unknown note prints as written. */
const FRENCH_PRINTING: Record<string, string> = {
	'third printing 1999': '3e tirage, 1999',
	'reissued 2005': 'réédition, 2005',
};

/** "69, no. 5" to « vol. 69, no 5 »; "45/2" to « vol. 45, no 2 ». */
function frenchVolume(volume: string): string {
	const m = /^(\d+)(?:, no\. |\/)(\d+)$/.exec(volume);
	return m ? `vol. ${m[1]}, no ${m[2]}` : volume;
}

function frenchReference(workKey: string): Run[] {
	const w = WORKS[workKey];
	const author = { text: `${frenchAuthor(w.authorFull)}. ` };
	const tail = `${w.isbn ? ` ISBN ${w.isbn}.` : ''}${w.url ? ` ${w.url}.` : ''}`;
	if (w.container)
		return [
			author,
			{ text: `«\u00a0${w.fullTitle}\u00a0», ` },
			{ text: w.container.title, title: true },
			{ text: `, ${frenchVolume(w.container.volume)}, ${w.year}.${tail}` },
		];
	const parts = [
		w.edition ? frenchEdition(w.edition) : null,
		w.degree ? `Thèse (${w.degree})` : null,
		w.place ? frenchPlace(w.place) : null,
		w.publisher,
		String(w.year),
		w.printing ? (FRENCH_PRINTING[w.printing] ?? w.printing) : null,
	].filter((x): x is string => !!x);
	return [author, { text: w.fullTitle, title: true }, { text: `, ${parts.join(', ')}.${tail}` }];
}
