/**
 * Tests for score-file format detection (Round 9 §2 Item 2; handover v34
 * §E.1). Pure module, so these run both under vitest and under the sandbox
 * shim. Fixtures are synthesized byte-by-byte; no real score files are
 * committed (the Kabalevsky-derived MNX fixture rule extends to ingestion:
 * nothing copyrighted enters the tree).
 */

import { describe, it, expect } from 'vitest';
import { detectScoreFormat, ACCEPTED_EXTENSIONS, SNIFF_LENGTH } from './format-detection';

const utf8 = (s: string) => new TextEncoder().encode(s);

/** Minimal ZIP local-file-header magic followed by junk. */
const zipBytes = () => new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00]);

const MNX_HEAD = '{ "mnx": { "version": 1 }, "global": {}, "parts": [] }';
const PARTWISE = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">\n<!-- exported -->\n<score-partwise version="4.0"></score-partwise>';

describe('detectScoreFormat: routable formats', () => {
	it('detects MNX by JSON content regardless of extension', () => {
		expect(detectScoreFormat('song.mnx', utf8(MNX_HEAD))).toEqual({ ok: true, format: 'mnx' });
		// Content wins over a misleading extension.
		expect(detectScoreFormat('song.xml', utf8(MNX_HEAD))).toEqual({ ok: true, format: 'mnx' });
	});

	it('detects partwise MusicXML through prolog, DOCTYPE, and comments', () => {
		expect(detectScoreFormat('song.musicxml', utf8(PARTWISE))).toEqual({
			ok: true,
			format: 'musicxml'
		});
	});

	it('detects timewise MusicXML', () => {
		const doc = '<?xml version="1.0"?><score-timewise version="4.0"></score-timewise>';
		expect(detectScoreFormat('song.xml', utf8(doc))).toEqual({ ok: true, format: 'musicxml' });
	});

	it('detects MusicXML even with a lying extension', () => {
		expect(detectScoreFormat('song.txt', utf8(PARTWISE))).toEqual({
			ok: true,
			format: 'musicxml'
		});
	});

	it('decodes a UTF-16LE BOM before sniffing XML', () => {
		const doc = '<?xml version="1.0"?><score-partwise></score-partwise>';
		const body = new Uint8Array(2 + doc.length * 2);
		body[0] = 0xff;
		body[1] = 0xfe;
		for (let i = 0; i < doc.length; i++) {
			body[2 + i * 2] = doc.charCodeAt(i);
			body[3 + i * 2] = 0;
		}
		expect(detectScoreFormat('song.xml', body)).toEqual({ ok: true, format: 'musicxml' });
	});

	it('disambiguates ZIP containers by extension', () => {
		expect(detectScoreFormat('song.mxl', zipBytes())).toEqual({ ok: true, format: 'mxl' });
		expect(detectScoreFormat('song.mscz', zipBytes())).toEqual({ ok: true, format: 'mscz' });
		expect(detectScoreFormat('song.musx', zipBytes())).toEqual({ ok: true, format: 'musx' });
		expect(detectScoreFormat('SONG.MXL', zipBytes())).toEqual({ ok: true, format: 'mxl' });
	});
});

describe('detectScoreFormat: recognised refusals', () => {
	it('refuses pre-2014 Finale .mus by extension alone, without sniffing', () => {
		expect(detectScoreFormat('song.mus', utf8('anything at all'))).toEqual({
			ok: false,
			failure: { kind: 'pre-2014-finale' }
		});
	});

	it('refuses MIDI by MThd magic', () => {
		const midi = new Uint8Array([0x4d, 0x54, 0x68, 0x64, 0x00, 0x00, 0x00, 0x06]);
		expect(detectScoreFormat('song.mid', midi)).toEqual({
			ok: false,
			failure: { kind: 'midi' }
		});
	});

	it('refuses PDF by %PDF magic', () => {
		expect(detectScoreFormat('song.pdf', utf8('%PDF-1.7\n'))).toEqual({
			ok: false,
			failure: { kind: 'pdf' }
		});
	});

	it('refuses images by magic (PNG, JPEG, WEBP)', () => {
		const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
		const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
		const webp = new Uint8Array([
			0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50
		]);
		for (const bytes of [png, jpeg, webp]) {
			expect(detectScoreFormat('scan.bin', bytes)).toEqual({
				ok: false,
				failure: { kind: 'image' }
			});
		}
	});

	it('refuses JSON that is not MNX', () => {
		expect(detectScoreFormat('data.json', utf8('{ "notMnx": true }'))).toEqual({
			ok: false,
			failure: { kind: 'json-not-mnx' }
		});
	});

	it('refuses XML that is not MusicXML, naming the root element', () => {
		expect(detectScoreFormat('song.xml', utf8('<?xml version="1.0"?><museScore/>'))).toEqual({
			ok: false,
			failure: { kind: 'xml-not-musicxml', rootElement: 'museScore' }
		});
	});

	it('refuses a ZIP with no recognised container extension', () => {
		expect(detectScoreFormat('archive.zip', zipBytes())).toEqual({
			ok: false,
			failure: { kind: 'zip-unrecognised' }
		});
	});

	it('refuses empty and unreadable input', () => {
		expect(detectScoreFormat('mystery.bin', new Uint8Array(0))).toEqual({
			ok: false,
			failure: { kind: 'unrecognised' }
		});
	});
});

describe('detectScoreFormat: extension fallbacks', () => {
	it('falls back to the extension when content is uninformative', () => {
		// Content that opens with neither { nor < carries no signal; the
		// declared extension is the only evidence left. A wrong declaration
		// surfaces downstream as a clear parse error, which is the honest
		// place for it.
		expect(detectScoreFormat('song.mnx', utf8(' '))).toEqual({ ok: true, format: 'mnx' });
		expect(detectScoreFormat('song.xml', utf8(' '))).toEqual({ ok: true, format: 'musicxml' });
	});

	it('refuses an uninformative head with an unknown extension', () => {
		expect(detectScoreFormat('song.xyz', utf8(' '))).toEqual({
			ok: false,
			failure: { kind: 'unrecognised' }
		});
	});
});

describe('accepted-extensions contract', () => {
	it('lists exactly the formats dispatch can route (no aspirational entries)', () => {
		expect(ACCEPTED_EXTENSIONS.split(',').sort()).toEqual(
			['.json', '.mnx', '.mscz', '.musicxml', '.musx', '.mxl', '.xml'].sort()
		);
	});

	it('needs no more than SNIFF_LENGTH bytes', () => {
		// A MusicXML head padded past the sniff window still detects,
		// because only the head is examined.
		const padded = utf8(PARTWISE + ' '.repeat(SNIFF_LENGTH * 2));
		expect(detectScoreFormat('song.xml', padded)).toEqual({ ok: true, format: 'musicxml' });
	});
});
