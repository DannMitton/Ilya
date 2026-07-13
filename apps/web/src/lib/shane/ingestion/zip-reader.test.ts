/**
 * Tests for the minimal ZIP reader (handover v34 §E.1). Archives are built
 * byte-by-byte by the helper below (real CRC-32, local headers, central
 * directory, EOCD), so the fixtures are honest ZIP files and nothing
 * copyrighted enters the tree. Deflate fixtures run through the platform's
 * `CompressionStream('deflate-raw')`, the exact mirror of what the reader
 * inflates with; the workspace has no `@types/node`, so the node:zlib
 * route was deliberately avoided.
 */

import { describe, it, expect } from 'vitest';
import { listZipEntries, readZipEntry, ZipReadError } from './zip-reader';
import { buildZip, utf8 } from './zip-fixture';

const kindOf = async (fn: () => unknown): Promise<string> => {
	try {
		await fn();
		return 'no-error';
	} catch (e) {
		return e instanceof ZipReadError ? e.kind : `unexpected: ${String(e)}`;
	}
};

// ── Tests ────────────────────────────────────────────────────────

describe('listZipEntries', () => {
	it('lists members with names, sizes, and methods', async () => {
		const zip = await buildZip([
			{ name: 'META-INF/container.xml', data: utf8('<container/>') },
			{ name: 'score.xml', data: utf8('<score-partwise/>'), method: 8 }
		]);
		const entries = listZipEntries(zip);
		expect(entries).toHaveLength(2);
		expect(entries[0].name).toBe('META-INF/container.xml');
		expect(entries[0].compressionMethod).toBe(0);
		expect(entries[1].name).toBe('score.xml');
		expect(entries[1].compressionMethod).toBe(8);
		expect(entries[1].uncompressedSize).toBe('<score-partwise/>'.length);
	});

	it('finds the EOCD behind an archive comment', async () => {
		const zip = await buildZip([{ name: 'a.txt', data: utf8('hello') }], 'a trailing comment');
		expect(listZipEntries(zip)).toHaveLength(1);
	});

	it('refuses non-ZIP bytes with kind not-a-zip', async () => {
		expect(await kindOf(() => listZipEntries(utf8('this is a plain text file, no archive here')))).toBe(
			'not-a-zip'
		);
	});

	it('refuses too-short input with kind not-a-zip', async () => {
		expect(await kindOf(() => listZipEntries(new Uint8Array([0x50, 0x4b])))).toBe('not-a-zip');
	});

	it('refuses a central directory that runs off the end', async () => {
		const zip = await buildZip([{ name: 'a.txt', data: utf8('hello') }]);
		// Point the EOCD's central-directory offset past the file's end.
		const dv = new DataView(zip.buffer, zip.byteOffset);
		dv.setUint32(zip.length - 22 + 16, zip.length + 100, true);
		expect(await kindOf(() => listZipEntries(zip))).toBe('truncated');
	});
});

describe('readZipEntry', () => {
	it('round-trips a stored member', async () => {
		const zip = await buildZip([{ name: 'container.xml', data: utf8('<container/>') }]);
		const out = await readZipEntry(zip, 'container.xml');
		expect(new TextDecoder().decode(out)).toBe('<container/>');
	});

	it('round-trips a deflated member', async () => {
		const body = '<score-partwise version="4.0">' + '<note/>'.repeat(200) + '</score-partwise>';
		const zip = await buildZip([{ name: 'score.xml', data: utf8(body), method: 8 }]);
		const out = await readZipEntry(zip, 'score.xml');
		expect(new TextDecoder().decode(out)).toBe(body);
	});

	it('reads the right member from a multi-member archive', async () => {
		const zip = await buildZip([
			{ name: 'META-INF/container.xml', data: utf8('<container/>'), method: 8 },
			{ name: 'score.xml', data: utf8('<score-partwise/>'), method: 8 },
			{ name: 'Thumbnails/thumbnail.png', data: new Uint8Array([0x89, 0x50, 0x4e, 0x47]) }
		]);
		const out = await readZipEntry(zip, 'score.xml');
		expect(new TextDecoder().decode(out)).toBe('<score-partwise/>');
	});

	it('refuses a missing member with kind entry-not-found', async () => {
		const zip = await buildZip([{ name: 'a.txt', data: utf8('hello') }]);
		expect(await kindOf(() => readZipEntry(zip, 'missing.xml'))).toBe('entry-not-found');
	});

	it('refuses an unsupported compression method', async () => {
		const zip = await buildZip([{ name: 'weird.bin', data: utf8('payload'), lieAboutMethod: 99 }]);
		expect(await kindOf(() => readZipEntry(zip, 'weird.bin'))).toBe('unsupported-compression');
	});

	it('refuses member data that runs past the end of the file', async () => {
		const zip = await buildZip([{ name: 'a.txt', data: utf8('hello world') }]);
		const entries = listZipEntries(zip);
		expect(entries[0].compressedSize).toBe('hello world'.length);
		// Corrupt entry 0's compressed-size field in the central directory
		// (offset +20 within the entry), sending reads past the file's end.
		const centralStart = 30 + 'a.txt'.length + 'hello world'.length;
		const dv = new DataView(zip.buffer, zip.byteOffset);
		dv.setUint32(centralStart + 20, 10_000, true);
		expect(await kindOf(() => readZipEntry(zip, 'a.txt'))).toBe('truncated');
	});

	it('refuses a deflated member whose size disagrees with the central directory', async () => {
		const zip = await buildZip([
			{ name: 'score.xml', data: utf8('<score-partwise/>'), method: 8, lieAboutSize: 5 }
		]);
		expect(await kindOf(() => readZipEntry(zip, 'score.xml'))).toBe('decompress-failed');
	});
});
