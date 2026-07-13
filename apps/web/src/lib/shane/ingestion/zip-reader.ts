/**
 * Minimal ZIP reader for the Fit ingestion path.
 *
 * Serves two containers: `.mxl` (compressed MusicXML) and `.mscz`
 * (MuseScore). Written against the ZIP APPNOTE structure directly, on the
 * platform's `DecompressionStream('deflate-raw')`, so it adds NO dependency:
 * the lockfile cannot be regenerated from the sandbox, and CI installs with
 * `--frozen-lockfile` (handover v34 §C), so a JS unzip library was not an
 * option this batch. Score containers are small and simple; the general ZIP
 * zoo (ZIP64, encryption, spanned archives, exotic compression methods) is
 * out of scope and refused with a typed error rather than guessed at.
 *
 * Reading strategy, per the APPNOTE and long-standing practice: the central
 * directory is authoritative. The End of Central Directory record is located
 * by scanning back from the tail (it floats behind an optional comment of up
 * to 65,535 bytes); entries are enumerated from the central directory; a
 * member's data offset comes from its own local header, whose name/extra
 * lengths may differ from the central copy. Sizes are taken from the central
 * directory, never from the local header, which may carry zeros when the
 * writer used a data descriptor (general-purpose bit 3).
 *
 * Provenance: handover v34 §E.1 (`.mxl` unzip and the `.mscz` webmscore
 * spike are this batch); Round 9 §2 Item 2 (single ingest widget routes all
 * accepted containers).
 */

export type ZipFailureKind =
	| 'not-a-zip'
	| 'truncated'
	| 'entry-not-found'
	| 'unsupported-compression'
	| 'zip64-unsupported'
	| 'decompress-failed';

/** Typed failure for the dispatch layer to map onto user-facing copy. */
export class ZipReadError extends Error {
	readonly kind: ZipFailureKind;

	constructor(kind: ZipFailureKind, message: string) {
		super(message);
		this.name = 'ZipReadError';
		this.kind = kind;
	}
}

export interface ZipEntry {
	/** Member path as stored (forward slashes, no leading slash). */
	name: string;
	compressedSize: number;
	uncompressedSize: number;
	/** 0 = stored, 8 = deflate. Anything else is refused at read time. */
	compressionMethod: number;
	/** Offset of the member's LOCAL header, from the central directory. */
	localHeaderOffset: number;
}

const EOCD_SIGNATURE = 0x06054b50;
const CENTRAL_SIGNATURE = 0x02014b50;
const LOCAL_SIGNATURE = 0x04034b50;
const EOCD_MIN_LENGTH = 22;
const MAX_COMMENT = 0xffff;
const ZIP64_MARKER = 0xffffffff;

const view = (bytes: Uint8Array): DataView =>
	new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

/**
 * Locate the End of Central Directory record by scanning backwards from the
 * tail. Returns its offset, or throws.
 */
function findEocd(bytes: Uint8Array): number {
	if (bytes.length < EOCD_MIN_LENGTH) {
		throw new ZipReadError('not-a-zip', 'file is too short to be a ZIP archive');
	}
	const dv = view(bytes);
	const floor = Math.max(0, bytes.length - EOCD_MIN_LENGTH - MAX_COMMENT);
	for (let offset = bytes.length - EOCD_MIN_LENGTH; offset >= floor; offset--) {
		if (dv.getUint32(offset, true) === EOCD_SIGNATURE) return offset;
	}
	throw new ZipReadError('not-a-zip', 'no End of Central Directory record found');
}

/**
 * Enumerate the archive's members from the central directory.
 *
 * Member names are decoded as UTF-8 unconditionally: the general-purpose
 * UTF-8 flag (bit 11) is ignored because every name this reader cares about
 * (`META-INF/container.xml`, `*.xml`, `*.mscx`) is ASCII, where the legacy
 * CP437 encoding and UTF-8 agree.
 */
export function listZipEntries(bytes: Uint8Array): ZipEntry[] {
	const dv = view(bytes);
	const eocd = findEocd(bytes);

	const entryCount = dv.getUint16(eocd + 10, true);
	const centralOffset = dv.getUint32(eocd + 16, true);
	if (entryCount === 0xffff || centralOffset === ZIP64_MARKER) {
		throw new ZipReadError('zip64-unsupported', 'ZIP64 archives are not supported');
	}

	const entries: ZipEntry[] = [];
	let offset = centralOffset;
	const decoder = new TextDecoder('utf-8');

	for (let i = 0; i < entryCount; i++) {
		if (offset + 46 > bytes.length) {
			throw new ZipReadError('truncated', 'central directory runs past the end of the file');
		}
		if (dv.getUint32(offset, true) !== CENTRAL_SIGNATURE) {
			throw new ZipReadError('truncated', 'central directory entry signature mismatch');
		}

		const compressionMethod = dv.getUint16(offset + 10, true);
		const compressedSize = dv.getUint32(offset + 20, true);
		const uncompressedSize = dv.getUint32(offset + 24, true);
		const nameLength = dv.getUint16(offset + 28, true);
		const extraLength = dv.getUint16(offset + 30, true);
		const commentLength = dv.getUint16(offset + 32, true);
		const localHeaderOffset = dv.getUint32(offset + 42, true);

		if (compressedSize === ZIP64_MARKER || uncompressedSize === ZIP64_MARKER) {
			throw new ZipReadError('zip64-unsupported', 'ZIP64 member sizes are not supported');
		}

		const name = decoder.decode(bytes.subarray(offset + 46, offset + 46 + nameLength));
		entries.push({ name, compressedSize, uncompressedSize, compressionMethod, localHeaderOffset });

		offset += 46 + nameLength + extraLength + commentLength;
	}

	return entries;
}

/** Inflate a raw-deflate member through the platform stream. */
async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
	try {
		const stream = new Blob([data as BlobPart])
			.stream()
			.pipeThrough(new DecompressionStream('deflate-raw'));
		return new Uint8Array(await new Response(stream).arrayBuffer());
	} catch {
		throw new ZipReadError('decompress-failed', 'member data failed to decompress');
	}
}

/**
 * Read one member's bytes by exact name.
 *
 * Async because deflate runs through `DecompressionStream`. The returned
 * array is freshly allocated for deflated members and a subarray view for
 * stored members; callers treat it as read-only either way.
 */
export async function readZipEntry(bytes: Uint8Array, name: string): Promise<Uint8Array> {
	const entry = listZipEntries(bytes).find((e) => e.name === name);
	if (!entry) {
		throw new ZipReadError('entry-not-found', `no archive member named ${JSON.stringify(name)}`);
	}
	return readEntryData(bytes, entry);
}

/** Read a member already located via `listZipEntries`. */
export async function readEntryData(bytes: Uint8Array, entry: ZipEntry): Promise<Uint8Array> {
	const dv = view(bytes);
	const at = entry.localHeaderOffset;

	if (at + 30 > bytes.length || dv.getUint32(at, true) !== LOCAL_SIGNATURE) {
		throw new ZipReadError('truncated', 'local header missing or out of range');
	}

	// The LOCAL header's own name/extra lengths position the data; they can
	// legitimately differ from the central directory's copies.
	const nameLength = dv.getUint16(at + 26, true);
	const extraLength = dv.getUint16(at + 28, true);
	const dataStart = at + 30 + nameLength + extraLength;
	const dataEnd = dataStart + entry.compressedSize;
	if (dataEnd > bytes.length) {
		throw new ZipReadError('truncated', 'member data runs past the end of the file');
	}
	const data = bytes.subarray(dataStart, dataEnd);

	if (entry.compressionMethod === 0) {
		return data;
	}
	if (entry.compressionMethod === 8) {
		const inflated = await inflateRaw(data);
		if (inflated.length !== entry.uncompressedSize) {
			throw new ZipReadError(
				'decompress-failed',
				`member inflated to ${inflated.length} bytes; central directory says ${entry.uncompressedSize}`
			);
		}
		return inflated;
	}
	throw new ZipReadError(
		'unsupported-compression',
		`compression method ${entry.compressionMethod} is not supported`
	);
}
