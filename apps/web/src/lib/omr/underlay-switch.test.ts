/**
 * The stamp the scan reader keeps its readings with, and the desk's measure switches (`?extender=`, `?looks=off`).
 *
 * Integration step 8a (2026-11-09; Dann 2026-11-09 11:56): the singer's `?words=read` switch is gone, the underlay reader is
 * always on, and `UNDERLAY_READER` is part of `READER_STAMP`. These check that a reading kept with the homr stamp alone (every
 * scan stored before this change) is read again once, on its next opening, and kept with the joined stamp; that a reading kept
 * under an older underlay version is read again; and that the measure switches change no stamp. WHEN THEY FAIL: a stored scan is
 * either never read again (it keeps showing no words) or read at every opening. It relates to `stamp.test.ts` and `restore.ts`.
 */
import { describe, expect, it } from 'vitest';
import { extenderArm, looksOn, scanStamp } from './underlay-switch';
import { READER_STAMP, UNDERLAY_READER } from './stamp';
import { isCurrent, restoreScan } from './restore';
import type { OmrReadResult } from './homr-reader';

/** The stamp every scan stored before step 8a carries: the homr reader alone. */
const HOMR_ONLY = READER_STAMP.replace(`+${UNDERLAY_READER}`, '');

describe('extenderArm (row 181 step 8a)', () => {
	it('is off unless the address says ?extender=a or ?extender=b', () => {
		expect(extenderArm('')).toBe('off');
		expect(extenderArm('?extender=a')).toBe('a');
		expect(extenderArm('?extender=b')).toBe('b');
		expect(extenderArm('?extender=off')).toBe('off');
		expect(extenderArm('?extender=x')).toBe('off');
	});
});

describe('looksOn (row 181: the measure switch for the second look)', () => {
	it('is on unless the address says ?looks=off, and the stamp does not change with it', () => {
		expect(looksOn('')).toBe(true);
		expect(looksOn('?looks=off')).toBe(false);
		expect(looksOn('?looks=on')).toBe(true);
	});
});

describe('scanStamp', () => {
	it('is the one stamp, naming both readers, whatever the address says', () => {
		expect(scanStamp()).toBe(READER_STAMP);
		expect(scanStamp()).toBe(`${HOMR_ONLY}+${UNDERLAY_READER}`);
		expect(HOMR_ONLY).not.toBe(READER_STAMP);
	});
});

describe('a stored reading, met by the reader that always reads the words', () => {
	const kept = (stamp: string) => ({ musicXml: '<score-partwise/>', stamp });
	const ok = { ok: true, musicXml: '<score-partwise>new</score-partwise>', pagesRead: 1, pages: 1, backend: 'wasm', durationMs: 1 } as OmrReadResult;
	const read = async () => ok;

	it('is used as it is where its stamp is the current one', async () => {
		const r = await restoreScan(new File([], 'a.pdf'), 'pdf', kept(READER_STAMP), read);
		expect(r).toMatchObject({ ok: true, from: 'kept' });
	});

	it('is read again once when it was kept with the homr stamp alone (every scan stored before step 8a), and kept with the joined stamp', async () => {
		expect(isCurrent(kept(HOMR_ONLY))).toBe(false);
		const r = await restoreScan(new File([], 'a.pdf'), 'pdf', kept(HOMR_ONLY), read);
		expect(r).toMatchObject({ ok: true, from: 'homr' });
		expect(r.ok && r.reading?.stamp).toBe(READER_STAMP);
	});

	it.each(['underlay@0', 'underlay@1', 'underlay@2', 'underlay@3', 'underlay@4'])('is read again when it was kept under %s', async (old) => {
		expect(UNDERLAY_READER).toBe('underlay@5');
		const before = kept(`${HOMR_ONLY}+${old}`);
		expect(isCurrent(before)).toBe(false);
		const r = await restoreScan(new File([], 'a.pdf'), 'pdf', before, read);
		expect(r).toMatchObject({ ok: true, from: 'homr' });
		expect(r.ok && r.reading?.stamp).toBe(READER_STAMP);
	});

	it('keeps the bands the reader gave with the reading, and a reading kept without them reads as before', async () => {
		const bands = [{ page: 1, system: 1, bars: [1, 4] as const, why: null, band: { x0: 0, x1: 1, y0: 0.2, y1: 0.3, space: 0.01 } }];
		const withBands = await restoreScan(new File([], 'a.pdf'), 'pdf', null, async () => ({ ...ok, bands }));
		expect(withBands.ok && withBands.reading?.bands).toEqual(bands);
		const without = await restoreScan(new File([], 'a.pdf'), 'pdf', null, read);
		expect(without.ok && without.reading).not.toHaveProperty('bands');
		expect(isCurrent({ musicXml: '<x/>', stamp: READER_STAMP })).toBe(true);
	});
});
