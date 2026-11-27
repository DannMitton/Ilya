// Step 2: where the pair (u, ceiling) passes, on the tree's own staff finder and the tree's own voice boxes.
// level = round(anchor + u * (paper - anchor)), anchor the grey at the 1st percentile. The ceiling is fixed in the
// tree's `fives`, so a copy of the working tree's metre-windows.ts is generated beside the other modules in <gen>
// with the ceiling made a parameter, and with `lineRows` remembered by its arguments so that only `fives` runs again
// when the ceiling moves. A page PASSES at a pair when every voice box it needs is found: a box is needed when it is
// found by the shipped code, or by any pair in the grid (a box no pair finds is named, not counted).
// Writes step2-sweep.json to the work folder.
//   <gen> holds a copy of apps/web/src/lib: cp -R apps/web/src/lib <gen>
// usage: node step2-sweep.mts <workdir> <base> <gen>
import fs from 'node:fs';
import { PAGES, TREE, loadPage } from './step-lib.mts';

const [W, base, gen] = process.argv.slice(2);
let src = fs.readFileSync(TREE + '/metre-windows.ts', 'utf8');
const rep = (re: RegExp, to: string) => {
	if (!re.test(src)) throw new Error('missing ' + re);
	src = src.replace(re, to);
};
rep(/export function fives\(/, 'export const P = { ceil: 0.45, memo: new Map<string, [number, number][]>() };\nexport function fives(');
rep(/if \(th > [A-Za-z0-9_.]+ \* s\) continue;/, 'if (th > P.ceil * s) continue;');
rep(/export function lineRows\(/, 'export function lineRows(g: Grey, x0: number, x1: number, y0: number, y1: number, frac: number, ink: InkLevels): [number, number][] {\n\tconst key = [x0, x1, y0, y1, frac, ink.rule].join();\n\tlet v = P.memo.get(key);\n\tif (!v) P.memo.set(key, (v = rowsOf(g, x0, x1, y0, y1, frac, ink)));\n\treturn v;\n}\nfunction rowsOf(');
fs.writeFileSync(gen + '/omr/metre-windows-sweep.ts', src);
const swept = await import(gen + '/omr/metre-windows-sweep.ts');
const old = await import(base + '/apps/web/src/lib/omr/metre-windows.ts');
const { paperTone } = await import(TREE + '/underlay-frame.ts');
const { toneAt } = await import(TREE + '/underlay-looks.ts');

export const U = Array.from({ length: 50 }, (_, i) => (50 + i) / 100); // 0.50 to 0.99
export const C = Array.from({ length: 91 }, (_, i) => (30 + i) / 100); // 0.30 to 1.20
const out: any = { U, C, pages: {} };
for (const name of PAGES) {
	const p = await loadPage(W, name);
	const paper = paperTone(p.g.data), anchor = toneAt(p.g.data, 0.01);
	const today = p.voice.map((i) => !!old.staffIn(p.g, p.boxes[i]));
	// grid[ui][ci]: one character per voice box
	const grid: string[][] = [];
	for (const u of U) {
		const level = Math.round(anchor + u * (paper - anchor));
		swept.P.memo.clear();
		grid.push(C.map((c) => {
			swept.P.ceil = c;
			return p.voice.map((i) => (swept.staffIn(p.g, p.boxes[i], { rule: level, glyph: 140 }) ? '1' : '0')).join('');
		}));
	}
	out.pages[name] = { paper, anchor, voice: p.voice, today, grid };
	console.log(name, 'done');
}
fs.writeFileSync(W + '/step2-sweep.json', JSON.stringify(out));
