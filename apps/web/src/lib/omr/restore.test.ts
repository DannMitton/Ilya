/**
 * restoreScan: a stored scan comes back through homr, kept or read again.
 * homr is not run here; `read` stands in for `readScan`.
 */
import { describe, expect, it, vi } from 'vitest';
import { isCurrent, restoreScan } from './restore';
import { READER_STAMP, type KeptReading } from './stamp';
import type { OmrReadResult } from './homr-reader';

const scan = new File([new Uint8Array([1, 2, 3])], 'tchaikovsky.pdf', { type: 'application/pdf' });

const homr = (musicXml: string) =>
	vi.fn(
		async (): Promise<OmrReadResult> => ({ ok: true, musicXml, pagesRead: 3, pages: 3, backend: 'wasm', durationMs: 9 }),
	);

describe('restoreScan', () => {
	it('reads a scan that has no kept reading with homr, and returns the reading to keep', async () => {
		const read = homr('<score-partwise>new</score-partwise>');
		const restored = await restoreScan(scan, 'pdf', null, read);
		expect(read).toHaveBeenCalledTimes(1);
		expect(read).toHaveBeenCalledWith(scan, 'pdf', undefined);
		expect(restored).toMatchObject({ ok: true, from: 'homr', musicXml: '<score-partwise>new</score-partwise>' });
		expect(restored.ok && restored.reading).toEqual({ musicXml: '<score-partwise>new</score-partwise>', stamp: READER_STAMP });
	});

	it('uses the kept reading, and does not read again, where its stamp is the reader\'s', async () => {
		const read = homr('<score-partwise>should not be read</score-partwise>');
		const kept: KeptReading = { musicXml: '<score-partwise>kept</score-partwise>', stamp: READER_STAMP };
		const restored = await restoreScan(scan, 'pdf', kept, read);
		expect(read).not.toHaveBeenCalled();
		expect(restored).toEqual({ ok: true, from: 'kept', musicXml: '<score-partwise>kept</score-partwise>' });
	});

	it('reads again, and returns the new reading to keep, where the stamp has changed', async () => {
		const read = homr('<score-partwise>newer</score-partwise>');
		const kept: KeptReading = { musicXml: '<score-partwise>older</score-partwise>', stamp: 'homr-web@0.1.0/396' };
		const restored = await restoreScan(scan, 'image', kept, read);
		expect(read).toHaveBeenCalledTimes(1);
		expect(restored).toMatchObject({ ok: true, from: 'homr', musicXml: '<score-partwise>newer</score-partwise>' });
		expect(restored.ok && restored.reading?.stamp).toBe(READER_STAMP);
	});

	it('reads again where the kept reading is empty, whatever its stamp', async () => {
		const read = homr('<score-partwise>x</score-partwise>');
		await restoreScan(scan, 'pdf', { musicXml: '', stamp: READER_STAMP }, read);
		expect(read).toHaveBeenCalledTimes(1);
	});

	it('names the reader\'s error and returns nothing to keep where homr fails', async () => {
		const read = vi.fn(async (): Promise<OmrReadResult> => ({ ok: false, error: 'engine_missing', log: 'no models' }));
		expect(await restoreScan(scan, 'pdf', null, read)).toEqual({ ok: false, error: 'engine_missing', log: 'no models' });
	});

	it('compares against the stamp it is given', () => {
		const kept: KeptReading = { musicXml: '<x/>', stamp: 'a' };
		expect(isCurrent(kept, 'a')).toBe(true);
		expect(isCurrent(kept, 'b')).toBe(false);
		expect(isCurrent(null, 'a')).toBe(false);
	});
});
