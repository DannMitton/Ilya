/**
 * The bars a scan's reader could not read, written into the joined MusicXML and
 * read back (brief r5 step 2): ranges joined where they touch, a text with no
 * language in it, and a file that stays well formed.
 */
import { describe, expect, it } from 'vitest';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { decodeBars, encodeBars, markUnreadBars, mergeRanges, readUnreadBars, UNREAD_FIELD } from './unread-bars';

describe('mergeRanges', () => {
	it('joins ranges that touch or overlap, and sorts them', () => {
		expect(mergeRanges([[47, 51], [44, 46]])).toEqual([[44, 51]]);
		expect(mergeRanges([[10, 12], [3, 5], [11, 15]])).toEqual([[3, 5], [10, 15]]);
	});
	it('keeps ranges with a bar between them apart', () => {
		expect(mergeRanges([[44, 46], [48, 51]])).toEqual([[44, 46], [48, 51]]);
	});
	it('drops what is not a range', () => {
		expect(mergeRanges([[5, 3], [1.5, 2]])).toEqual([]);
	});
});

describe('encodeBars and decodeBars', () => {
	it('write a bar alone and a range by its ends, with no language in the text', () => {
		expect(encodeBars([[39, 39], [4, 4], [9, 12]])).toBe('4,9-12,39');
		expect(decodeBars('4,9-12,39')).toEqual([[4, 4], [9, 12], [39, 39]]);
	});
	it('read nothing from a text that is not one', () => {
		expect(decodeBars('')).toEqual([]);
		expect(decodeBars('4,x')).toEqual([]);
		expect(decodeBars('-3')).toEqual([]);
	});
});

const HEAD = '<?xml version="1.0"?>\n<score-partwise version="4.0">\n';
const TAIL = '<part-list><score-part id="P1"/></part-list><part id="P1"><measure number="1"/></part></score-partwise>\n';

describe('markUnreadBars', () => {
	it('is the file as it was where there are no bars', () => {
		const xml = `${HEAD}${TAIL}`;
		expect(markUnreadBars(xml, [])).toBe(xml);
	});

	it('puts the field last in an identification the file has', () => {
		const xml = `${HEAD}<identification><encoding><software>homr</software></encoding></identification>${TAIL}`;
		const out = markUnreadBars(xml, [[23, 30], [41, 48]]);
		expect(out).toContain(`</encoding><miscellaneous><miscellaneous-field name="${UNREAD_FIELD}">23-30,41-48</miscellaneous-field></miscellaneous></identification>`);
		expect(readUnreadBars(out)).toEqual([[23, 30], [41, 48]]);
	});

	it('makes an identification before the part list where the file has none, and before a credit or defaults', () => {
		const bare = markUnreadBars(`${HEAD}${TAIL}`, [[4, 4]]);
		expect(bare.indexOf('<identification>')).toBeLessThan(bare.indexOf('<part-list>'));
		expect(readUnreadBars(bare)).toEqual([[4, 4]]);
		const withDefaults = markUnreadBars(`${HEAD}<work/><defaults/>${TAIL}`, [[4, 4]]);
		expect(withDefaults.indexOf('<work/>')).toBeLessThan(withDefaults.indexOf('<identification>'));
		expect(withDefaults.indexOf('<identification>')).toBeLessThan(withDefaults.indexOf('<defaults/>'));
	});

	it('fills an empty identification, and joins a miscellaneous the file already has', () => {
		expect(readUnreadBars(markUnreadBars(`${HEAD}<identification/>${TAIL}`, [[2, 3]]))).toEqual([[2, 3]]);
		const has = markUnreadBars(`${HEAD}<identification><miscellaneous><miscellaneous-field name="other">x</miscellaneous-field></miscellaneous></identification>${TAIL}`, [[2, 3]]);
		expect(has.match(/<miscellaneous>/g)).toHaveLength(1);
		expect(has).toContain('name="other">x</miscellaneous-field>');
		expect(readUnreadBars(has)).toEqual([[2, 3]]);
	});

	it('replaces the bars it wrote before, not adding a second field', () => {
		const once = markUnreadBars(`${HEAD}${TAIL}`, [[2, 3]]);
		const twice = markUnreadBars(once, [[7, 9]]);
		expect(twice.match(new RegExp(UNREAD_FIELD, 'g'))).toHaveLength(1);
		expect(readUnreadBars(twice)).toEqual([[7, 9]]);
	});

	it('leaves a well-formed file well formed', () => {
		const out = markUnreadBars(`${HEAD}<identification><encoding><software>homr</software></encoding></identification>${TAIL}`, [[1, 2]]);
		expect(() => parseXml(out)).not.toThrow();
	});
});

describe('readUnreadBars', () => {
	it('finds nothing in a file without the field', () => {
		expect(readUnreadBars(`${HEAD}${TAIL}`)).toEqual([]);
	});
});
