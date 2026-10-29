/**
 * The bars whose words the reader could not read, carried with the reading
 * (N.135 stage 2b, brief r5 step 2).
 *
 * A scanned song may be read in part: a system with no Russian row takes no
 * words, and the singer is told which bars (the banner ratified by Dann
 * 2026-10-28 23:12 and 2026-10-29 00:00, `ratified-banner-words-partly-read_2026-10-28.md`).
 * The bars are the SONG's, as the join numbers them (`join-pages.ts`): homr
 * numbers every page from bar 1.
 *
 * WHERE THEY RIDE: inside the joined MusicXML, as one `<miscellaneous-field>`
 * of the file's `<identification>` (the MusicXML slot for a field a producer
 * defines for itself). A kept reading holds `musicXml` and `stamp` only
 * (`stamp.ts`), and a reopened scan is ingested again from that text
 * (`restore.ts`), so the banner returns with the song and nothing else is
 * stored. The score parser reads no `<miscellaneous>` element; the ingestion
 * reads this one field, at the one seam every MusicXML passes (`ingest.ts`,
 * `withUnreadBars`), and turns it into the `words-partly-read` warning.
 *
 * The writer (`markUnreadBars`) and the reader (`readUnreadBars`) are two
 * halves of one convention, kept together here. No import: ingestion reads it
 * without loading the reader.
 *
 * Pure.
 */

/** A run of bars, first and last, both inclusive and both the song's numbers. */
export type BarRange = readonly [number, number];

/** The `name` of the `<miscellaneous-field>` that holds the bars. */
export const UNREAD_FIELD = 'ilya-words-unread-bars';

/** Ranges sorted, with those that overlap or touch joined: 44 to 46 and 47 to 51 make 44 to 51. */
export function mergeRanges(ranges: readonly BarRange[]): BarRange[] {
	const sorted = ranges.filter(([a, b]) => Number.isInteger(a) && Number.isInteger(b) && a <= b).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
	const out: [number, number][] = [];
	for (const [a, b] of sorted) {
		const last = out[out.length - 1];
		if (last && a <= last[1] + 1) last[1] = Math.max(last[1], b);
		else out.push([a, b]);
	}
	return out;
}

/** «23-30,41-48»: no language in it. */
export function encodeBars(ranges: readonly BarRange[]): string {
	return mergeRanges(ranges)
		.map(([a, b]) => (a === b ? `${a}` : `${a}-${b}`))
		.join(',');
}

/** The ranges an `encodeBars` text holds; nothing where it is not one. */
export function decodeBars(text: string): BarRange[] {
	const out: BarRange[] = [];
	for (const part of text.split(',')) {
		const m = /^\s*(\d+)(?:\s*-\s*(\d+))?\s*$/.exec(part);
		if (!m) return [];
		out.push([Number(m[1]), Number(m[2] ?? m[1])]);
	}
	return mergeRanges(out);
}

const FIELD = `<miscellaneous-field name="${UNREAD_FIELD}">`;
const FIELD_PATTERN = new RegExp(`<miscellaneous-field\\s+name="${UNREAD_FIELD}"\\s*>([^<]*)</miscellaneous-field>`);

/** The bars a MusicXML text carries, merged; nothing where it carries none. */
export function readUnreadBars(xml: string): BarRange[] {
	if (!xml.includes(UNREAD_FIELD)) return [];
	const m = FIELD_PATTERN.exec(xml);
	return m ? decodeBars(m[1]) : [];
}

/**
 * The MusicXML with the bars written into its `<identification>`; the text as
 * it was where there are none. `<miscellaneous>` is the last child
 * `<identification>` allows, so the field goes in before its end; where the
 * file has no `<identification>` one is made before the first of `<defaults>`,
 * `<credit>`, and `<part-list>`. A field already there is replaced.
 */
export function markUnreadBars(xml: string, ranges: readonly BarRange[]): string {
	const merged = mergeRanges(ranges);
	if (merged.length === 0) return xml;
	const field = `${FIELD}${encodeBars(merged)}</miscellaneous-field>`;
	if (FIELD_PATTERN.test(xml)) return xml.replace(FIELD_PATTERN, field);
	const head = xml.search(/<part-list[\s>]/);
	const end = xml.indexOf('</identification>');
	if (end >= 0 && (head < 0 || end < head)) {
		const misc = xml.indexOf('</miscellaneous>', xml.indexOf('<identification'));
		if (misc >= 0 && misc < end) return `${xml.slice(0, misc)}${field}${xml.slice(misc)}`;
		return `${xml.slice(0, end)}<miscellaneous>${field}</miscellaneous>${xml.slice(end)}`;
	}
	const identification = `<identification><miscellaneous>${field}</miscellaneous></identification>`;
	if (/<identification\s*\/>/.test(xml)) return xml.replace(/<identification\s*\/>/, identification);
	const at = xml.search(/<(?:defaults|credit|part-list)[\s>/]/);
	return at < 0 ? xml : `${xml.slice(0, at)}${identification}${xml.slice(at)}`;
}
