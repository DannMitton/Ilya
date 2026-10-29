/**
 * The hidden switch and the stamp it chooses. The switch is read from the
 * address, so every branch is a string.
 */
import { describe, expect, it } from 'vitest';
import { scanStamp, underlayOn } from './underlay-switch';
import { READER_STAMP, UNDERLAY_READER } from './stamp';
import { isCurrent, restoreScan } from './restore';
import type { OmrReadResult } from './homr-reader';

describe('underlayOn', () => {
	it('is on for ?words=read, with other parameters beside it', () => {
		expect(underlayOn('?words=read')).toBe(true);
		expect(underlayOn('?a=1&words=read&b=2')).toBe(true);
	});

	it.each(['', '?', '?words', '?words=', '?words=Read', '?words=true', '?word=read', '?reader=ilya', '?words=read2'])('is off for «%s»', (search) => {
		expect(underlayOn(search)).toBe(false);
	});

	it('is off where there is no address at all, as in a test or a worker', () => {
		expect(underlayOn()).toBe(false);
	});
});

describe('scanStamp', () => {
	it('is the reader\'s stamp with the switch off, so a reading kept before this stage is current', () => {
		expect(scanStamp('')).toBe(READER_STAMP);
		expect(scanStamp()).toBe(READER_STAMP);
	});

	it('names both readers with the switch on', () => {
		expect(scanStamp('?words=read')).toBe(`${READER_STAMP}+${UNDERLAY_READER}`);
	});
});

describe('a reading kept on one side of the switch, met on the other', () => {
	const kept = (stamp: string) => ({ musicXml: '<score-partwise/>', stamp });
	const ok = { ok: true, musicXml: '<score-partwise>new</score-partwise>', pagesRead: 1, pages: 1, backend: 'wasm', durationMs: 1 } as OmrReadResult;
	const read = async () => ok;

	it('is used as it is where the stamp is the one asked for', async () => {
		const off = await restoreScan(new File([], 'a.pdf'), 'pdf', kept(READER_STAMP), read, undefined, scanStamp(''));
		expect(off).toMatchObject({ ok: true, from: 'kept' });
		const on = await restoreScan(new File([], 'a.pdf'), 'pdf', kept(scanStamp('?words=read')), read, undefined, scanStamp('?words=read'));
		expect(on).toMatchObject({ ok: true, from: 'kept' });
	});

	it('is read again once when it was kept with the switch off and is met with it on, and kept with the new stamp', async () => {
		const r = await restoreScan(new File([], 'a.pdf'), 'pdf', kept(READER_STAMP), read, undefined, scanStamp('?words=read'));
		expect(r).toMatchObject({ ok: true, from: 'homr' });
		expect(r.ok && r.reading?.stamp).toBe(`${READER_STAMP}+${UNDERLAY_READER}`);
	});

	it('is read again once when it was kept with the switch on and is met with it off, and its words are gone', async () => {
		const r = await restoreScan(new File([], 'a.pdf'), 'pdf', kept(scanStamp('?words=read')), read, undefined, scanStamp(''));
		expect(r).toMatchObject({ ok: true, from: 'homr' });
		expect(r.ok && r.reading?.stamp).toBe(READER_STAMP);
	});

	it('is read again when it was kept with the switch on under stage 2b as first built, underlay@0', async () => {
		const asBuilt = kept(`${READER_STAMP}+underlay@0`);
		expect(UNDERLAY_READER).not.toBe('underlay@0');
		expect(isCurrent(asBuilt, scanStamp('?words=read'))).toBe(false);
		const r = await restoreScan(new File([], 'a.pdf'), 'pdf', asBuilt, read, undefined, scanStamp('?words=read'));
		expect(r).toMatchObject({ ok: true, from: 'homr' });
	});

	it('is judged by isCurrent against the stamp it is given', () => {
		expect(isCurrent(kept(scanStamp('?words=read')), scanStamp(''))).toBe(false);
		expect(isCurrent(kept(READER_STAMP), scanStamp('?words=read'))).toBe(false);
		expect(isCurrent(kept(READER_STAMP), scanStamp(''))).toBe(true);
	});
});
