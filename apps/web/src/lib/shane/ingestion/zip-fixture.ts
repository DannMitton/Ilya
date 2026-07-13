/**
 * Byte-level ZIP fixture builder, shared by the ingestion test suites
 * (handover v35 §E.3). Lifted verbatim from `zip-reader.test.ts` so the ZIP
 * reader tests and the dispatch tests build archives one way. Real CRC-32,
 * real local headers, real central directory, real EOCD, so the fixtures are
 * honest ZIP files and nothing copyrighted enters the tree. Deflate fixtures
 * run through the platform's `CompressionStream('deflate-raw')`, the exact
 * mirror of what the reader inflates with; the workspace has no `@types/node`,
 * so the `node:zlib` route was deliberately avoided.
 *
 * This is a test helper, not app code: only the `*.test.ts` suites import it,
 * so it never enters the application bundle.
 */

export const utf8 = (s: string): Uint8Array => new TextEncoder().encode(s);

async function deflateRaw(data: Uint8Array): Promise<Uint8Array> {
	const stream = new Blob([data as BlobPart])
		.stream()
		.pipeThrough(new CompressionStream('deflate-raw'));
	return new Uint8Array(await new Response(stream).arrayBuffer());
}

const CRC_TABLE = (() => {
	const table = new Uint32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		table[n] = c >>> 0;
	}
	return table;
})();

function crc32(data: Uint8Array): number {
	let crc = 0xffffffff;
	for (let i = 0; i < data.length; i++) {
		crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
	}
	return (crc ^ 0xffffffff) >>> 0;
}

export interface FixtureMember {
	name: string;
	data: Uint8Array;
	/** 0 = stored (default), 8 = deflate. */
	method?: 0 | 8;
	/** Override the recorded uncompressed size, to fake corruption. */
	lieAboutSize?: number;
	/** Override the recorded compression method, to fake exotic writers. */
	lieAboutMethod?: number;
}

export async function buildZip(members: FixtureMember[], comment = ''): Promise<Uint8Array> {
	const chunks: Uint8Array[] = [];
	const central: Uint8Array[] = [];
	let offset = 0;

	for (const m of members) {
		const method = m.lieAboutMethod ?? m.method ?? 0;
		const stored = (m.method ?? 0) === 0 ? m.data : await deflateRaw(m.data);
		const nameBytes = utf8(m.name);
		const crc = crc32(m.data);
		const uncompressed = m.lieAboutSize ?? m.data.length;

		const local = new Uint8Array(30 + nameBytes.length);
		const lv = new DataView(local.buffer);
		lv.setUint32(0, 0x04034b50, true);
		lv.setUint16(4, 20, true); // version needed
		lv.setUint16(8, method, true);
		lv.setUint32(14, crc, true);
		lv.setUint32(18, stored.length, true);
		lv.setUint32(22, uncompressed, true);
		lv.setUint16(26, nameBytes.length, true);
		local.set(nameBytes, 30);

		const cen = new Uint8Array(46 + nameBytes.length);
		const cv = new DataView(cen.buffer);
		cv.setUint32(0, 0x02014b50, true);
		cv.setUint16(4, 20, true); // version made by
		cv.setUint16(6, 20, true); // version needed
		cv.setUint16(10, method, true);
		cv.setUint32(16, crc, true);
		cv.setUint32(20, stored.length, true);
		cv.setUint32(24, uncompressed, true);
		cv.setUint16(28, nameBytes.length, true);
		cv.setUint32(42, offset, true);
		cen.set(nameBytes, 46);
		central.push(cen);

		chunks.push(local, stored);
		offset += local.length + stored.length;
	}

	const centralStart = offset;
	let centralSize = 0;
	for (const c of central) centralSize += c.length;

	const commentBytes = utf8(comment);
	const eocd = new Uint8Array(22 + commentBytes.length);
	const ev = new DataView(eocd.buffer);
	ev.setUint32(0, 0x06054b50, true);
	ev.setUint16(8, members.length, true);
	ev.setUint16(10, members.length, true);
	ev.setUint32(12, centralSize, true);
	ev.setUint32(16, centralStart, true);
	ev.setUint16(20, commentBytes.length, true);
	eocd.set(commentBytes, 22);

	const total = offset + centralSize + eocd.length;
	const out = new Uint8Array(total);
	let at = 0;
	for (const chunk of [...chunks, ...central, eocd]) {
		out.set(chunk, at);
		at += chunk.length;
	}
	return out;
}
