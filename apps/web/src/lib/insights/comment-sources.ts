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
		// NOT ESTABLISHED: no record read names the ISBN.
		isbn: null,
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
		// NOT ESTABLISHED: the records read give only the year and the page count.
		place: null,
		publisher: null,
		printing: null,
		isbn: null,
		record: 'Insights Research/long-works-toc-screen_r1_2026-09-23.md, §6',
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
	// The r7 consequence sentences and the [ɛ] lead (`draft-three-comments_r7_2026-09-29.md`), read 2026-09-30.
	'PVA2-A-046': { id: 'PVA2-A-046', work: 'bozeman2025', pages: [45, 45], heading: null, quote: null },
	'PVA2-C-025': { id: 'PVA2-C-025', work: 'bozeman2025', pages: [94, 94], heading: null, quote: null },
	// The row's quote column holds only the section heading, so no quotation prints.
	'KVP2-022': { id: 'KVP2-022', work: 'bozeman2021', pages: [97, 97], heading: 'Typical Pitfalls: Timbral Thinness', quote: null },
	'KVP2-026': {
		id: 'KVP2-026',
		work: 'bozeman2021',
		pages: [115, 115],
		heading: 'Acoustic Registration Summarized',
		quote: 'If two or more harmonics are below the first resonance, the singer is in open timbre',
	},
	'KVP2-037': {
		id: 'KVP2-037',
		work: 'bozeman2021',
		pages: [18, 19],
		heading: 'Maintaining an Open Throat Across Range',
		quote: 'in fairly close vowel posture until the second harmonic being sung turns over',
	},
	'RMR-057': {
		id: 'RMR-057',
		work: 'miller1986',
		pages: [157, 158],
		heading: null,
		quote: 'it is not suggested that all vowels modify to the schwa ... or to some other designated phoneme at a specified pitch below the secondo passaggio, nor even in those pitches that lie above it',
	},
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

/**
 * A run of text; `title` sets in italics (a title, or a term of art such as
 * *whoop*); `sub` sets as a subscript, for the R1 of *f*<sub>R1</sub>.
 */
export interface Run {
	text: string;
	title?: boolean;
	sub?: boolean;
}

/**
 * The pages of several rows of one work, as one citation prints them: "p. 94",
 * "pp. 97 and 115", "pp. 18 to 19"; French « p. 97 et 115 », « p. 18-19 ».
 */
export function pagesOf(rows: readonly CitedRow[], language: 'en' | 'fr'): string {
	if (rows.length === 1) return pagesText(rows[0], language);
	const span = ([a, b]: [number, number]) => (a === b ? `${a}` : language === 'fr' ? `${a}-${b}` : `${a} to ${b}`);
	const parts = [...rows].sort((x, y) => x.pages[0] - y.pages[0]).map((r) => span(r.pages));
	return language === 'fr' ? `p. ${parts.join(' et ')}` : `pp. ${parts.join(' and ')}`;
}

/**
 * The short citation, "(Miller, *Solutions for Singers*, 2004, p. 163)". After
 * an attributed opener ("Miller suggests"), the author drops (templates §5).
 * Several rows of one work share one citation, their pages joined (r7:
 * "(Bozeman, *Kinesthetic Voice Pedagogy 2*, 2021, pp. 97 and 115)").
 */
export function shortCitation(rowIds: string | readonly string[], language: 'en' | 'fr', dropAuthor = false): Run[] {
	const rows = (typeof rowIds === 'string' ? [rowIds] : rowIds).map((id) => ROWS[id]);
	const w = WORKS[rows[0].work];
	return [
		{ text: dropAuthor ? '(' : `(${w.author}, ` },
		{ text: w.shortTitle, title: true },
		{ text: `, ${w.year}, ${pagesOf(rows, language)})` },
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
