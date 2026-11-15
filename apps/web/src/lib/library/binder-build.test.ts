/**
 * N.202 (D4): a binder names the Ilya that made it. The manifest's `appVersion` is the version ("2026b"), and the
 * optional `build` is the commit the bundle was built from. The schema number stays 1: the reader tests `format`,
 * `schema`, and `songs` only, so a field it does not know is ignored.
 */
import { describe, it, expect } from 'vitest';
import { buildBinder, readBinder, BINDER_FORMAT, MANIFEST_NAME } from './binder';
import { readZipEntry } from '$lib/reader/zip-reader';
import { buildZip, utf8 } from './zip-writer';
import { emptySongRecord } from './types';

const NOW = '2026-11-15T00:00:00.000Z';
const manifestOf = async (zip: Uint8Array) => JSON.parse(new TextDecoder().decode(await readZipEntry(zip, MANIFEST_NAME)));

describe('the manifest names its version and its build', () => {
	it('writes build beside appVersion, and keeps the schema at 1', async () => {
		const built = await buildBinder({ songs: [{ record: emptySongRecord('s1', NOW), source: null, name: 'x' }], appVersion: '2026b', build: 'abcd1234', exportedAt: NOW });
		const manifest = await manifestOf(built);
		expect(manifest.appVersion).toBe('2026b');
		expect(manifest.build).toBe('abcd1234');
		expect(manifest.schema).toBe(1);
	});

	it('writes no build field where none is given, so an older caller still gets the older bytes', async () => {
		const built = await buildBinder({ songs: [{ record: emptySongRecord('s1', NOW), source: null, name: 'x' }], appVersion: '2026b', exportedAt: NOW });
		expect('build' in (await manifestOf(built))).toBe(false);
	});

	it('reads whole a manifest that carries build and one field it does not know', async () => {
		const record = emptySongRecord('s1', NOW);
		const made = await buildBinder({ songs: [{ record, source: null, name: 'x' }], appVersion: '2026b', build: 'abcd1234', exportedAt: NOW });
		const manifest = { ...(await manifestOf(made)), aFieldFromTheFuture: { anything: 1 } };
		const song = new TextDecoder().decode(await readZipEntry(made, 'songs/s1/song.json'));
		const zip = await buildZip([
			{ name: MANIFEST_NAME, data: utf8(JSON.stringify(manifest)), method: 8 },
			{ name: 'songs/s1/song.json', data: utf8(song), method: 8 },
		]);
		expect(manifest.format).toBe(BINDER_FORMAT);
		const read = await readBinder(zip, NOW);
		expect(read.ok).toBe(true);
		if (read.ok) expect(read.songs).toHaveLength(1);
	});
});
