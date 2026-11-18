/**
 * The recorder (`capture-file.ts`), N.200 Step 1. What is pinned: one ZIP holds every held take; each file name and
 * each JSON carries the asked and the sung vowel and the build; the file calls no network; and nothing of it reaches
 * a build that does not set the flag (every use is behind `__ILYA_RECORDER__`, and `vercel.json` sets the flag for
 * one branch only).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { crc32, zipBytes, takeBase, holdCapture, heldCount, heldZip, clearHeld, setSungVowel, sungVowel, captureFileEnabled, panelFace, panelPickerLine, panelLastTakeLine, panelAddressLine, lastHeldPicker, PANEL_TAB_WIDTH_PX, PANEL_TAB_BOTTOM_PX } from './capture-file';
import { measurePicker } from '../chart/measure-switch';
import { SYNTH_SR, synthFry } from './fry-synth';

const here = (f: string) => join(__dirname, f);
const read = (f: string) => readFileSync(here(f), 'utf8');
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

interface Parsed { name: string; bytes: Uint8Array; crc: number }
/** A reader of the store-method ZIP, written from the format's own layout, not from `zipBytes`. */
function parseZip(z: Uint8Array): Parsed[] {
	const v = new DataView(z.buffer, z.byteOffset, z.byteLength);
	let e = z.length - 22;
	while (e >= 0 && v.getUint32(e, true) !== 0x06054b50) e--;
	expect(e).toBeGreaterThanOrEqual(0);
	const n = v.getUint16(e + 10, true);
	let c = v.getUint32(e + 16, true);
	const out: Parsed[] = [];
	for (let i = 0; i < n; i++) {
		expect(v.getUint32(c, true)).toBe(0x02014b50);
		const crc = v.getUint32(c + 16, true), size = v.getUint32(c + 24, true), nl = v.getUint16(c + 28, true), off = v.getUint32(c + 42, true);
		const name = new TextDecoder().decode(z.subarray(c + 46, c + 46 + nl));
		expect(v.getUint32(off, true)).toBe(0x04034b50);
		const fl = v.getUint16(off + 26, true), xl = v.getUint16(off + 28, true), start = off + 30 + fl + xl;
		out.push({ name, bytes: z.slice(start, start + size), crc });
		c += 46 + nl;
	}
	return out;
}

describe('crc32 and zipBytes', () => {
	it('crc32 of "123456789" is the standard check value', () => {
		expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xcbf43926);
	});
	it('a ZIP of three entries reads back byte for byte, with names in UTF-8 and each CRC right', () => {
		const a = new Uint8Array([1, 2, 3, 250]), b = new TextEncoder().encode('{"x":1}'), c = new Uint8Array(0);
		const got = parseZip(zipBytes([{ name: 'a-ɑ.wav', bytes: a }, { name: 'b.json', bytes: b }, { name: 'empty', bytes: c }]));
		expect(got.map((g) => g.name)).toEqual(['a-ɑ.wav', 'b.json', 'empty']);
		expect([...got[0].bytes]).toEqual([...a]);
		expect(new TextDecoder().decode(got[1].bytes)).toBe('{"x":1}');
		expect(got[2].bytes.length).toBe(0);
		expect(got.map((g) => g.crc)).toEqual([crc32(a), crc32(b), crc32(c)]);
	});
});

describe('the held takes', () => {
	beforeEach(() => { clearHeld(); setSungVowel(null); });

	it('names a take by the asked and the sung vowel', () => {
		expect(takeBase('i', 'u', '2026-11-15T10-00-00-000Z')).toBe('ilya-capture-asked-i-sung-u-2026-11-15T10-00-00-000Z');
		expect(takeBase('i', null, 'T')).toBe('ilya-capture-asked-i-sung-unstated-T');
	});

	it('holds takes, and one ZIP carries a WAV and a JSON per take, each JSON stamped asked, sung, and build', () => {
		const y = synthFry({ formants: [300, 2000], bandwidths: [80, 150], rate: 70, durationS: 1 });
		setSungVowel('u');
		holdCapture(y, { vowel: 'i', sampleRate: SYNTH_SR, trimS: 0.25, outcome: { outcome: 'threw', message: 'x' }, trace: null });
		setSungVowel('ɑ');
		holdCapture(y, { vowel: 'i', sampleRate: SYNTH_SR, trimS: 0.25, outcome: { outcome: 'threw', message: 'y' }, trace: null });
		expect(heldCount()).toBe(2);
		const files = parseZip(heldZip());
		expect(files).toHaveLength(4);
		const names = files.map((f) => f.name);
		expect(names.filter((n) => n.endsWith('.wav'))).toHaveLength(2);
		expect(names.some((n) => n.includes('-asked-i-sung-u-'))).toBe(true);
		expect(names.some((n) => n.includes('-asked-i-sung-ɑ-'))).toBe(true);
		const json = files.filter((f) => f.name.endsWith('.json')).map((f) => JSON.parse(new TextDecoder().decode(f.bytes)));
		expect(json.map((j) => [j.asked, j.vowel, j.sung]).sort()).toEqual([['i', 'i', 'u'], ['i', 'i', 'ɑ']].sort());
		for (const j of json) {
			expect(typeof j.build).toBe('string');
			expect(j.build.length).toBeGreaterThan(0);
			expect(j.samples).toBe(y.length);
		}
		const wav = files.find((f) => f.name.endsWith('.wav'))!;
		expect(new TextDecoder().decode(wav.bytes.subarray(0, 4))).toBe('RIFF');
		expect(wav.bytes.length).toBe(44 + 2 * y.length);
	});

	it('the sung vowel is null until stated', () => {
		expect(sungVowel()).toBeNull();
	});

	it('is off in a test run with no address', () => {
		expect(captureFileEnabled()).toBe(false);
	});
});

describe('privacy: nothing leaves the browser', () => {
	it('capture-file.ts holds no fetch, XMLHttpRequest, sendBeacon, WebSocket, EventSource, or form post', () => {
		const code = stripComments(read('capture-file.ts'));
		for (const word of ['fetch', 'XMLHttpRequest', 'sendBeacon', 'WebSocket', 'EventSource', 'importScripts', 'postMessage', 'FormData']) {
			expect(code, word).not.toMatch(new RegExp(`\\b${word}\\b`));
		}
		expect(code).not.toMatch(/https?:\/\//);
		expect(code).not.toMatch(/\bimport\s+[^;]*from\s+['"](?!\.\/(analyze|extract)['"])/);
	});
});

describe('the recorder is out of every build that does not set the flag', () => {
	it('each use in live.ts and stub-switch.ts sits behind `__ILYA_RECORDER__ &&` on its own line', () => {
		for (const f of ['live.ts', '../chart/stub-switch.ts']) {
			const lines = read(f).split('\n');
			lines.forEach((l, i) => {
				if (/^\s*(\/\/|\*|\/\*)/.test(l) || /^import\b/.test(l)) return;
				if (/\b(holdCapture|mountRecorderPanel|captureFileEnabled)\(/.test(l)) {
					expect(l, `${f}:${i + 1}`).toMatch(/__ILYA_RECORDER__\s*&&/);
				}
			});
		}
	});

	it('no other file in the app imports the recorder', () => {
		const importers: string[] = [];
		const walk = (dir: string) => {
			for (const e of readdirSync(dir, { withFileTypes: true })) {
				const p = join(dir, e.name);
				if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p); continue; }
				if (!/\.(ts|svelte)$/.test(e.name) || /\.test\.ts$/.test(e.name)) continue;
				if (/from\s+['"][^'"]*capture-file['"]/.test(readFileSync(p, 'utf8'))) importers.push(p.replace(/^.*\/src\//, 'src/'));
			}
		};
		walk(join(__dirname, '../../..'));
		expect(importers.sort()).toEqual(['src/lib/voice/chart/stub-switch.ts', 'src/lib/voice/engine/live.ts']);
	});

	it('vercel.json sets PUBLIC_RECORDER only inside a branch test, and no other build setting does', () => {
		const v = JSON.parse(readFileSync(join(__dirname, '../../../../../../vercel.json'), 'utf8')) as { buildCommand: string };
		const cmd = v.buildCommand;
		expect(cmd.match(/PUBLIC_RECORDER/g)).toHaveLength(1);
		expect(cmd).toMatch(/^if \[ "\$VERCEL_GIT_COMMIT_REF" = "cloud-lane-\d+" \]( \|\| \[ "\$VERCEL_GIT_COMMIT_REF" = "cloud-lane-\d+" \])*; then export PUBLIC_RECORDER=1; fi; pnpm --filter @ilya\/web build$/);
	});

	it('vite.config.ts turns the flag off in a Vercel production build', () => {
		const cfg = readFileSync(join(__dirname, '../../../../vite.config.ts'), 'utf8');
		expect(cfg).toMatch(/PUBLIC_RECORDER === '1' && process\.env\.VERCEL_ENV !== 'production'/);
	});
});

/* LANE 65, Step 3. The panel rests as a folded tab in the right-hand gutter and names the picker in use. The tree has no DOM test environment, so the
   placement is pinned from the face's words, the exported measures, and the source; the six screens were measured in a browser (the lane's report). */
describe('the recorder panel on a phone (lane 65, Step 3)', () => {
	it('the folded tab names the picker in use, the take count, and a star while takes are unsaved', () => {
		expect(panelFace('open', 0, 0)).toBe('rec \u00b7 open \u00b7 0');
		expect(panelFace('shipped', 3, 0)).toBe('rec \u00b7 shipped \u00b7 3');
		expect(panelFace('shipped', 3, 2)).toBe('rec \u00b7 shipped \u00b7 3*');
		expect(panelFace('path', 1, 1)).toContain('path');
	});

	it('what the address selects reaches the face: ?measure=open and ?measure=shipped', () => {
		expect(panelFace(measurePicker('?harness=1&measure=open'), 0, 0)).toContain('open');
		expect(panelFace(measurePicker('?harness=1&measure=shipped'), 0, 0)).toContain('shipped');
	});

	it('the tab stands in a gutter narrower than the 16 px every control on the six screens leaves, and above the DRAWER bar (44 px)', () => {
		expect(PANEL_TAB_WIDTH_PX).toBeLessThanOrEqual(16);
		expect(PANEL_TAB_BOTTOM_PX).toBeGreaterThanOrEqual(44 + 16);
	});

	it('the wrapper is flush to the right edge and takes no touches; it no longer stands at right 12 px, bottom 12 px; the session hands it the picker', () => {
		const code = stripComments(read('capture-file.ts'));
		expect(code).toMatch(/position:fixed;right:0;bottom:\$\{PANEL_TAB_BOTTOM_PX\}px/);
		expect(code).toMatch(/pointer-events:none/);
		expect(code).not.toMatch(/right:12px;bottom:12px/);
		expect(code).toMatch(/mountRecorderPanel\(picker: Picker = 'path'\)/);
		expect(code).toMatch(/let panelPicker: Picker = 'path'/);
		const line = read('../chart/stub-switch.ts').split('\n').find((l) => /mountRecorderPanel\(/.test(l) && !/^\s*(\/\/|\*|import)/.test(l))!;
		expect(line).toMatch(/__ILYA_RECORDER__\s*&&\s*captureFileEnabled\(\)\)\s*mountRecorderPanel\(measurePicker\(search\)\)/);
	});
});

/* LANE 66, Step 2. The panel follows the session: every call sets the picker and rewrites the words, and the card names the last take's stamp and what
   the address gave. The words are pure functions, pinned as `panelFace` is; the order of the code is pinned from the source. */
describe('the recorder panel follows the session (lane 66, Step 2)', () => {
	it('the card names the picker in use, the picker stamped on the last take, and what the address gave', () => {
		expect(panelPickerLine('path')).toBe('Picker in use: path');
		expect(panelLastTakeLine(null)).toBe('Last take: no take yet');
		expect(panelLastTakeLine('shipped')).toBe('Last take stamped: shipped');
		expect(panelAddressLine('open')).toBe('Address: measure=open');
		expect(panelAddressLine(null)).toBe('Address: no measure in the address');
	});

	it('an empty measure is not the same as none: the two together tell "the address lost its query" from "the picker ignored it"', () => {
		expect(panelAddressLine('')).not.toBe(panelAddressLine(null));
		expect(panelAddressLine('')).toBe('Address: measure=');
	});

	it('the picker stamped on a held take reaches the card, and a take with none is stamped as the sidecar stamps it', () => {
		clearHeld();
		const y = synthFry({ formants: [300, 1700, 2600, 3300, 3900], bandwidths: [60, 90, 120, 180, 250], rate: 50, jitter: 0.05, levelDb: 0, durationS: 1, seed: 1 });
		const rec = { vowel: 'i', sampleRate: SYNTH_SR, trimS: 0, outcome: { outcome: 'threw' as const, message: 'x' }, trace: null };
		expect(lastHeldPicker()).toBeNull();
		holdCapture(y, { ...rec, picker: 'path' });
		expect(lastHeldPicker()).toBe('path');
		expect(JSON.parse(new TextDecoder().decode(parseZip(heldZip())[1].bytes)).picker).toBe('path');
		holdCapture(y, rec);
		expect(lastHeldPicker()).toBe('shipped');
		expect(JSON.parse(new TextDecoder().decode(parseZip(heldZip())[3].bytes)).picker).toBe('shipped');
		clearHeld();
		expect(lastHeldPicker()).toBeNull();
	});

	it('every call sets the picker and the address before it looks for a panel, and an existing panel is rewritten', () => {
		const code = stripComments(read('capture-file.ts'));
		const body = code.slice(code.indexOf('export function mountRecorderPanel'));
		const set = body.indexOf('panelPicker = picker');
		const addr = body.indexOf("get('measure')");
		const exists = body.indexOf('getElementById(PANEL_ID)');
		expect(set).toBeGreaterThan(-1);
		expect(addr).toBeGreaterThan(set);
		expect(exists).toBeGreaterThan(addr);
		expect(body.slice(exists, exists + 80)).toMatch(/refreshPanel\(\); return;/);
	});

	it('the sidecar still falls back to shipped for a record with no picker; the file still imports only analyze and extract', () => {
		expect(read('capture-file.ts')).toMatch(/picker: rec\.picker \?\? 'shipped'/);
		const imports = [...read('capture-file.ts').matchAll(/^import .* from '([^']+)'/gm)].map((m) => m[1]).sort();
		expect(imports).toEqual(['./analyze', './extract']);
	});
});
