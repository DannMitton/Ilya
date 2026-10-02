/**
 * N.168: the rows the note comments cite, and their citations. The works they
 * cite are in `$lib/sources.ts`.
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

import { WORKS, fullReference, type Run } from '$lib/sources';

/** The works themselves are in `$lib/sources.ts`, which the Guide's Sources reads too (2026-09-30). */
export { WORKS, fullReference, type Work, type Run } from '$lib/sources';

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
		// Row 8c, 2026-10-02: the earlier quotation (pp. 157 to 158) argued against modification to the schwa and did not support the comment. This one was read by the desk, PDF p. 179.
		pages: [158, 158],
		heading: null,
		quote: 'natural modification of the vowel will inevitably result in the mounting scale',
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

/** One cited row, as the tap prints it: the full reference, the page, the heading if read, the quotation if read. */
export function rowReference(rowId: string, language: 'en' | 'fr'): Run[] {
	const row = ROWS[rowId];
	const tail = [` ${pagesText(row, language)}.`];
	if (row.heading) tail.push(` ${row.heading}.`);
	if (row.quote) tail.push(language === 'fr' ? ` « ${row.quote} »` : ` “${row.quote}”`);
	return [...fullReference(row.work, language), { text: tail.join('') }];
}

/** The works a set of rows cites, alphabetical by author then year, each once. */
export function worksCited(rowIds: Iterable<string>): string[] {
	const keys = new Set<string>();
	for (const id of rowIds) if (ROWS[id]) keys.add(ROWS[id].work);
	return [...keys].sort((a, b) => WORKS[a].authorFull.localeCompare(WORKS[b].authorFull, 'en') || WORKS[a].year - WORKS[b].year);
}
