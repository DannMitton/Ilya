/**
 * Score-file format detection for the Fit upload path.
 *
 * Pure and synchronous: file name + leading bytes in, a verdict out. No DOM,
 * no Worker, no I/O, so the sandbox shim can test it directly. The dispatch
 * layer (`ingest.ts`) owns what happens after a verdict; this module only
 * names what the user handed us.
 *
 * Provenance:
 * - Round 9 spec §2 Item 2 (hybrid ingest widget, auto-detection with
 *   contextual tips) and Item 1 (fidelity tiers; the tier vocabulary starts
 *   from the detected format).
 * - Handover v34 §E.1: dispatch scope for this batch is MNX / MusicXML /
 *   `.mxl` / `.mscz` / `.musx`. PDF, image, and MIDI ingestion are not yet
 *   built (homr refactor and MIDI parsing are later work), so those inputs
 *   are RECOGNISED here and refused honestly, with a failure kind the UI
 *   can key specific copy from. Advertising them as accepted would be a lie.
 * - Pre-2014 Finale `.mus` is a closed format (Round 9 §1, architecture
 *   carry-in): recognised by extension, refused with the three-option
 *   guidance (Round 9 §2 Item 6). Never sniffed: we make no claim about its
 *   internal structure.
 *
 * Detection policy: content wins over extension wherever content is
 * sniffable (a MusicXML file misnamed `.txt` still routes; a JSON file
 * misnamed `.xml` is judged by its bytes). ZIP subtypes are the exception:
 * `.mxl`, `.mscz`, and `.musx` are all ZIP containers, so the extension
 * disambiguates them; a ZIP with none of those extensions is refused rather
 * than guessed at.
 */

/** Formats the dispatch layer can route today. */
export type ScoreFormat = 'mnx' | 'musicxml' | 'mxl' | 'mscz' | 'musx';

/**
 * Recognised-but-unroutable inputs. Each kind maps to distinct user-facing
 * copy in the uploader; none of these is a generic shrug.
 */
export type DetectionFailure =
	| { kind: 'pre-2014-finale' }
	| { kind: 'midi' }
	| { kind: 'pdf' }
	| { kind: 'image' }
	| { kind: 'json-not-mnx' }
	| { kind: 'xml-not-musicxml'; rootElement?: string }
	| { kind: 'zip-unrecognised' }
	| { kind: 'unrecognised' };

export type DetectionResult =
	| { ok: true; format: ScoreFormat }
	| { ok: false; failure: DetectionFailure };

/**
 * The `accept` attribute for the uploader's file input: exactly the formats
 * dispatch can route, nothing aspirational.
 */
export const ACCEPTED_EXTENSIONS = '.mnx,.json,.xml,.musicxml,.mxl,.mscz,.musx';

/** How many leading bytes detection needs at most. */
export const SNIFF_LENGTH = 2048;

// ── Magic numbers ────────────────────────────────────────────────

const startsWithBytes = (bytes: Uint8Array, sig: number[]): boolean =>
	sig.every((b, i) => bytes[i] === b);

const isZip = (b: Uint8Array) =>
	startsWithBytes(b, [0x50, 0x4b, 0x03, 0x04]) || // local file header
	startsWithBytes(b, [0x50, 0x4b, 0x05, 0x06]); // empty archive (EOCD only)

const isMidi = (b: Uint8Array) => startsWithBytes(b, [0x4d, 0x54, 0x68, 0x64]); // "MThd"

const isPdf = (b: Uint8Array) => startsWithBytes(b, [0x25, 0x50, 0x44, 0x46]); // "%PDF"

const isImage = (b: Uint8Array) =>
	startsWithBytes(b, [0x89, 0x50, 0x4e, 0x47]) || // PNG
	startsWithBytes(b, [0xff, 0xd8, 0xff]) || // JPEG
	startsWithBytes(b, [0x47, 0x49, 0x46, 0x38]) || // GIF
	startsWithBytes(b, [0x42, 0x4d]) || // BMP
	(startsWithBytes(b, [0x52, 0x49, 0x46, 0x46]) && // RIFF …
		b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50); // … WEBP

// ── Text decoding ────────────────────────────────────────────────

/**
 * Decode the sniff window as text, honouring a UTF-16 BOM if present
 * (MusicXML exporters vary). Falls back to UTF-8. Returns the decoded
 * head with leading whitespace stripped.
 */
function decodeHead(bytes: Uint8Array): string {
	let text: string;
	if (bytes[0] === 0xff && bytes[1] === 0xfe) {
		text = new TextDecoder('utf-16le').decode(bytes.subarray(2));
	} else if (bytes[0] === 0xfe && bytes[1] === 0xff) {
		text = new TextDecoder('utf-16be').decode(bytes.subarray(2));
	} else {
		// TextDecoder('utf-8') strips a UTF-8 BOM itself.
		text = new TextDecoder('utf-8').decode(bytes);
	}
	return text.replace(/^\s+/, '');
}

/**
 * First element name in an XML head, skipping the prolog, comments, and any
 * DOCTYPE. Undefined when no element opens inside the sniff window.
 */
function xmlRootElement(head: string): string | undefined {
	const match = head.match(/<(?!\?|!)([A-Za-z_][\w.:-]*)/);
	return match?.[1];
}

const extensionOf = (fileName: string): string => {
	const dot = fileName.lastIndexOf('.');
	return dot === -1 ? '' : fileName.slice(dot + 1).toLowerCase();
};

// ── Detection ────────────────────────────────────────────────────

/**
 * Detect the score format of an uploaded file.
 *
 * @param fileName The file's name as uploaded (extension disambiguates
 *   ZIP containers and names the closed `.mus` case).
 * @param bytes Leading bytes of the file; `SNIFF_LENGTH` is enough. Passing
 *   the whole file is also fine — only the head is examined.
 */
export function detectScoreFormat(fileName: string, bytes: Uint8Array): DetectionResult {
	const ext = extensionOf(fileName);

	// The closed format first: never sniffed, refused by name alone.
	if (ext === 'mus') return { ok: false, failure: { kind: 'pre-2014-finale' } };

	// Binary magics.
	if (isZip(bytes)) {
		if (ext === 'mxl') return { ok: true, format: 'mxl' };
		if (ext === 'mscz') return { ok: true, format: 'mscz' };
		if (ext === 'musx') return { ok: true, format: 'musx' };
		return { ok: false, failure: { kind: 'zip-unrecognised' } };
	}
	if (isMidi(bytes)) return { ok: false, failure: { kind: 'midi' } };
	if (isPdf(bytes)) return { ok: false, failure: { kind: 'pdf' } };
	if (isImage(bytes)) return { ok: false, failure: { kind: 'image' } };

	// Text-based formats: judge by content, not extension.
	const head = decodeHead(bytes.subarray(0, SNIFF_LENGTH));

	if (head.startsWith('{')) {
		// MNX is a JSON document whose top level carries an "mnx" metadata
		// object (the parser re-validates in full; this is only a sniff).
		// The head may be a truncated window, so look for the key rather
		// than parsing.
		if (/"mnx"\s*:/.test(head)) return { ok: true, format: 'mnx' };
		return { ok: false, failure: { kind: 'json-not-mnx' } };
	}

	if (head.startsWith('<')) {
		const root = xmlRootElement(head);
		if (root === 'score-partwise' || root === 'score-timewise') {
			return { ok: true, format: 'musicxml' };
		}
		return { ok: false, failure: { kind: 'xml-not-musicxml', rootElement: root } };
	}

	// Content told us nothing; fall back to the extension for the two
	// text formats whose head we could not read (empty file, exotic
	// encoding). A bare `.musx`/`.mscz`/`.mxl` that is NOT a ZIP is
	// corrupt or misnamed, so it lands in `unrecognised` here.
	if (ext === 'mnx') return { ok: true, format: 'mnx' };
	if (ext === 'xml' || ext === 'musicxml') return { ok: true, format: 'musicxml' };

	return { ok: false, failure: { kind: 'unrecognised' } };
}
