/**
 * N.168: the one registry of sources the note comments cite.
 *
 * `PRODUCT.md`, "A TRAIL OF BREADCRUMBS: HOW INSIGHTS CITES" (ruled by Dann
 * 2026-09-25 12:38 to 12:47): the comment carries author, short title, year,
 * and page; the tap carries the full reference, the section heading as
 * printed, and a short quotation; a printed Insights ends with "Sources
 * cited", alphabetical, only the works that print cites.
 *
 * EVERY VALUE HERE WAS READ, NEVER SUPPLIED. Rows and quotations are copied
 * from `~/Documents/Voice Pedagogy Library/Insights Research/_extraction/
 * claims_*.csv` (read 2026-09-25). Imprints come from the records named on
 * each work. A field nobody read is `null` and prints nothing: most rows
 * carry no section heading, several PVA2 rows record it as "unclear", and
 * those print none. Titles and quotations stay in English in both languages.
 */

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
	/** Where the imprint was read. */
	record: string;
}

export const WORKS: Record<string, Work> = {
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
		record: 'Insights Research/_synthesis/memo-sonnet-mckinney-1994_r1_2026-09-23.md',
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
		record: 'Insights Research/_extraction/sources_howell-HS_batch-B.md',
	},
};

export interface CitedRow {
	/** The extraction row. */
	id: string;
	work: keyof typeof WORKS;
	/** First and last page; equal for a single page. */
	pages: [number, number];
	/** As printed; `null` where the row records none or "unclear". */
	heading: string | null;
	/** Copied from the row's `quote` column; `null` where it is empty. */
	quote: string | null;
}

export const ROWS: Record<string, CitedRow> = {
	'MIL04-028': {
		id: 'MIL04-028',
		work: 'miller2004',
		pages: [163, 163],
		heading: null,
		quote: 'If the apex of the tongue remains in the lateral vowel postures while the jaw lowers, you will have the modification for which you are looking.',
	},
	'MIL04-035': {
		id: 'MIL04-035',
		work: 'miller2004',
		pages: [201, 201],
		heading: null,
		quote: 'the second half of each note must remain on the same dynamic level as the first half of the note.',
	},
	'MIL04-033': {
		id: 'MIL04-033',
		work: 'miller2004',
		pages: [166, 168],
		heading: null,
		quote: 'when I sing a sustained high G [G4], the start of the note will sound just fine. Then it makes an ugly crackling sound...',
	},
	'PVA2-B-014': { id: 'PVA2-B-014', work: 'bozeman2025', pages: [65, 65], heading: null, quote: null },
	'MCK-049': {
		id: 'MCK-049',
		work: 'mckinney1994',
		pages: [189, 189],
		heading: null,
		quote: 'think of it as a note that requires more energy, more space, and more depth, with a smooth connection from the previous note.',
	},
	'REID-057': {
		id: 'REID-057',
		work: 'reid1975',
		pages: [66, 66],
		heading: null,
		quote: 'there will be no real reason for modifying the vowel any longer',
	},
	'REID-054': {
		id: 'REID-054',
		work: 'reid1975',
		pages: [65, 65],
		heading: null,
		quote: 'vowel is incapable of being articulated in the upper tonal regions',
	},
	'HS-B-058': { id: 'HS-B-058', work: 'howell2025', pages: [182, 182], heading: null, quote: null },
	'MIL04-010': {
		id: 'MIL04-010',
		work: 'miller2004',
		pages: [78, 79],
		heading: null,
		quote: 'This fine baritone began to cover excessively. He experienced considerable throat tension',
	},
	'MIL04-017': {
		id: 'MIL04-017',
		work: 'miller2004',
		pages: [137, 137],
		heading: null,
		quote: 'no two singers handle it completely alike',
	},
	'MIL04-008': {
		id: 'MIL04-008',
		work: 'miller2004',
		pages: [76, 77],
		heading: null,
		quote: 'the most egregious culprit in upper resonance energy reduction is the final member of the back-vowel series, the vowel /u/.',
	},
};

export function pagesText(row: CitedRow, language: 'en' | 'fr'): string {
	const [a, b] = row.pages;
	if (a === b) return `p. ${a}`;
	return language === 'fr' ? `p. ${a}-${b}` : `pp. ${a} to ${b}`;
}

/** A run of text; `title` sets in italics. */
export interface Run {
	text: string;
	title?: boolean;
}

/**
 * The short citation, "(Miller, *Solutions for Singers*, 2004, p. 163)". After
 * an attributed opener ("Miller suggests"), the author drops (templates §5).
 */
export function shortCitation(rowId: string, language: 'en' | 'fr', dropAuthor = false): Run[] {
	const row = ROWS[rowId];
	const w = WORKS[row.work];
	return [
		{ text: dropAuthor ? '(' : `(${w.author}, ` },
		{ text: w.shortTitle, title: true },
		{ text: `, ${w.year}, ${pagesText(row, language)})` },
	];
}

/** The work in full, as "Sources cited" and the tap print it. Null fields print nothing. */
export function fullReference(workKey: string): Run[] {
	const w = WORKS[workKey];
	const imprint = [w.place && w.publisher ? `${w.place}: ${w.publisher}` : w.publisher, String(w.year), w.printing]
		.filter((s): s is string => !!s)
		.join(', ');
	return [
		{ text: `${w.authorFull.replace(/\.$/, '')}. ` },
		{ text: w.fullTitle, title: true },
		{ text: `${w.edition ? `, ${w.edition.replace(/\.$/, '')}` : ''}. ${imprint}.${w.isbn ? ` ISBN ${w.isbn}.` : ''}` },
	];
}

/** One cited row, as the tap prints it: the full reference, the page, the heading if read, the quotation if read. */
export function rowReference(rowId: string, language: 'en' | 'fr'): Run[] {
	const row = ROWS[rowId];
	const tail = [` ${pagesText(row, language)}.`];
	if (row.heading) tail.push(` ${row.heading}.`);
	if (row.quote) tail.push(language === 'fr' ? ` « ${row.quote} »` : ` “${row.quote}”`);
	return [...fullReference(row.work), { text: tail.join('') }];
}

/** The works a set of rows cites, alphabetical by author then year, each once. */
export function worksCited(rowIds: Iterable<string>): string[] {
	const keys = new Set<string>();
	for (const id of rowIds) if (ROWS[id]) keys.add(ROWS[id].work);
	return [...keys].sort((a, b) => WORKS[a].authorFull.localeCompare(WORKS[b].authorFull, 'en') || WORKS[a].year - WORKS[b].year);
}
