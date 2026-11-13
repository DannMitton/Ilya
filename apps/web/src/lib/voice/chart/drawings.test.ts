/**
 * N.199 Step 6b: the ten finished drawings. They are `drawings-r4/`'s files byte for byte; the first three of `drawings-r4/check.py`'s four checks are
 * ported here so the gate keeps them (the fourth, a pixel test, needs `rsvg-convert` and OpenCV and is run by hand: see the Step 6b report).
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { VOWELS } from '../engine/types';
import { DRAWING_FILE, PLATES, buildSagittal, creditLine } from './drawings';

const SHIPPED = join(__dirname, 'sagittal');
const SOURCE = join(__dirname, '../../../../../../docs/sessions/n199-calibrate/drawings-r4');
const read = (dir: string, name: string) => readFileSync(join(dir, name), 'utf8');
const files = Object.fromEntries(VOWELS.map((v) => [DRAWING_FILE[v], read(SHIPPED, DRAWING_FILE[v])]));
const names = Object.values(DRAWING_FILE);

describe('the shipped files are the finished drawings', () => {
	it('is exactly ten files in chart/sagittal, one for each vowel, none shared', () => {
		expect(new Set(names).size).toBe(10);
		expect(readdirSync(SHIPPED).sort()).toEqual([...names].sort());
	});
	it('are byte-identical to drawings-r4/ (the check reads the desk’s copy where it is in the repository)', () => {
		expect(existsSync(SOURCE), 'drawings-r4 is not where the test expects it').toBe(true);
		for (const n of names) expect(files[n] === read(SOURCE, n), n).toBe(true);
	});
	it('the static PNGs of Step 4d are gone', () => {
		expect(existsSync(join(__dirname, '../../../../static/sagittal'))).toBe(false);
	});
});

describe('check.py, ported: the first three checks', () => {
	const fixed = (t: string) => /<g id="fixed">.*?<\/g>/s.exec(t)![0];
	const root = (t: string) => /<svg[^>]*>/.exec(t)![0];
	const paths = (t: string) => [...t.matchAll(/<path id="([^"]+)"[^>]*? d="([^"]+)"/g)].map((m) => [m[1], (m[2].match(/[MCLQZ]/g) ?? []).length] as const);
	const REQUIRED = ['fixed', 'moving', 'tongue', 'jaw', 'lips', 'velum', 'pharynx'];

	it('1. the fixed group is byte-identical in all ten, and the root tag is the same', () => {
		const f0 = fixed(files[names[0]]);
		for (const n of names) {
			expect(fixed(files[n]) === f0, n).toBe(true);
			expect(root(files[n]), n).toBe(root(files[names[0]]));
			expect(root(files[n]), n).toContain('viewBox="-24 -12 544 544"');
			expect(root(files[n]), n).toContain('stroke="currentColor"');
		}
		expect(f0.length).toBe(1400); // check.py prints "(1400 bytes)"
	});
	it('2. every file has the required ids, none twice', () => {
		for (const n of names) {
			for (const id of REQUIRED) expect(files[n], `${n} ${id}`).toContain(`<g id="${id}">`);
			const ids = [...files[n].matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
			expect(new Set(ids).size, n).toBe(ids.length);
		}
	});
	it('3. the path ids and command counts match across the ten (morph-compatible)', () => {
		const p0 = paths(files[names[0]]);
		expect(p0).toHaveLength(15);
		for (const n of names) expect(paths(files[n]), n).toEqual(p0);
	});
});

describe('the one drawing built from them', () => {
	const d = buildSagittal(files);
	it('has the fixed group once and a moving group for each of the ten vowels', () => {
		expect(d.viewBox).toBe('-24 -12 544 544');
		expect(Object.keys(d.moving).sort()).toEqual([...VOWELS].sort());
		expect(d.fixed).toContain('<path d=');
		expect(d.fixed.match(/<path/g)).toHaveLength(5);
		for (const v of VOWELS) expect(d.moving[v].match(/<path/g), v).toHaveLength(10);
	});
	it('leaves out every id and the provenance manifest, so no id repeats on the page', () => {
		for (const s of [d.fixed, ...Object.values(d.moving)]) {
			expect(s).not.toMatch(/\sid="/);
			expect(s).not.toContain('metadata');
			expect(s).not.toContain('c2pa');
			expect(s).not.toContain('<g id');
			// balanced groups
			expect((s.match(/<g[ >]/g) ?? []).length).toBe((s.match(/<\/g>/g) ?? []).length);
		}
	});
	it('a file that lacks the marker it is read to throws, never a slice at -1', () => {
		const broken = { ...files, [DRAWING_FILE.i]: files[DRAWING_FILE.i].replace('</svg>', '') };
		expect(() => buildSagittal(broken)).toThrow(/no <\/svg> after <g id="moving">/);
		const noMoving = { ...files, [DRAWING_FILE.e]: files[DRAWING_FILE.e].replace('<g id="moving">', '<g id="mov">') };
		expect(() => buildSagittal(noMoving)).toThrow(/no <g id="moving">/);
	});
	it('carries no fill and no colour of its own: the line is currentColor (set to --lavender-ink by the component)', () => {
		for (const s of [d.fixed, ...Object.values(d.moving)]) {
			expect(s).not.toMatch(/fill="(?!none)/);
			expect(s).not.toMatch(/stroke="#|stroke="rgb/);
		}
	});
	it('the moving groups differ from vowel to vowel, [ɪ] from [i] in the tongue only', () => {
		expect(d.moving.i).not.toBe(d.moving.e);
		const strip = (s: string) => s.replace(/<g>.*?<\/g>/s, '');
		expect(new Set(VOWELS.map((v) => d.moving[v])).size).toBe(10);
		expect(strip(d.moving.i)).toBe(strip(d.moving.ɪ)); // the first group is the tongue
	});
});

describe('the credit line (Dann 2026-11-13 11:35)', () => {
	it('has the ratified words in both languages, with the plate where there is one', () => {
		expect(creditLine('i', 'en')).toBe('Drawing: Dann Mitton, after Bolla (1981), plate 17.');
		expect(creditLine('i', 'fr')).toBe('Dessin : Dann Mitton, d’après Bolla (1981), planche 17.');
		expect(creditLine('ɪ', 'en')).toBe('Drawing: Dann Mitton. Bolla has no plate for this vowel.');
		expect(creditLine('ɪ', 'fr')).toBe('Dessin : Dann Mitton. Bolla ne donne pas de planche pour cette voyelle.');
	});
	it('the plates are the drawing agent’s and the handoff’s: i 17, e 13, ɛ 10, a 3, ɑ 2, o 6, u 19, ɨ 15, ʌ 23, ɪ none', () => {
		expect(PLATES).toEqual({ i: 17, e: 13, ɪ: 0, ɨ: 15, ɛ: 10, a: 3, ɑ: 2, ʌ: 23, o: 6, u: 19 });
	});
	it('says nothing of an interim drawing any more', () => {
		for (const v of VOWELS) for (const l of ['en', 'fr'] as const) expect(creditLine(v, l)).not.toMatch(/nterim|provisoire/);
	});
});
