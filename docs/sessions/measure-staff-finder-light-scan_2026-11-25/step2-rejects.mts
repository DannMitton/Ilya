// Step 2: what the shipped ceiling (th > 0.45 s) rejects. The shipped `staffIn` (from git, level 140) runs on every
// homr box of the control pages, with its `fives` instrumented to keep each group of five evenly spaced rows that only
// the ceiling turned away. For each box: how many such groups, their thickness in spaces, the line (a, b, c) they came
// from, and whether they sit on the staff the box ends up with or elsewhere. Writes crops' coordinates to
// step2-rejects.json in the work folder.
// usage: node step2-rejects.mts <workdir> <base> <gen>
import fs from 'node:fs';
import { loadPage } from './step-lib.mts';

const [W, base, gen] = process.argv.slice(2);
let src = fs.readFileSync(base + '/apps/web/src/lib/omr/metre-windows.ts', 'utf8');
const rep = (a: string, b: string) => {
	if (!src.includes(a)) throw new Error('missing ' + a);
	src = src.replace(a, b);
};
// the strip a rejected group came from, taken at `lineRows`, for the crops
rep('export function fives(', 'export const OUT: { c: number[]; s: number; th: number; x0: number; x1: number }[] = [];\nlet AT = [0, 0];\nexport function fives(');
rep('if (th > 0.45 * s) continue;', 'if (th > 0.45 * s) { OUT.push({ c, s, th, x0: AT[0], x1: AT[1] }); continue; }');
rep('const rows: [number, number][] = [];', 'const rows: [number, number][] = [];\n\tAT = [x0, x1];');
fs.writeFileSync(gen + '/omr/metre-windows-rejects.ts', src);
const m = await import(gen + '/omr/metre-windows-rejects.ts');

const names = ['song1-p1', 'song2-p1', 'song3-p1', 'song4-p1', 'withoutsun-p4', 'withoutsun-p5', 'withoutsun-p6', 'song1-p2', 'song2-p4', 'song3-p6', 'song4-p5', 'withoutsun-p23'];
const out: any = {};
for (const name of names) {
	const p = await loadPage(W, name);
	out[name] = [];
	let total = 0;
	const lines: string[] = [];
	p.boxes.forEach((b, i) => {
		m.OUT.length = 0;
		const st = m.staffIn(p.g, b);
		const got = [...m.OUT];
		if (!got.length) return;
		total += got.length;
		const mid = st ? st.ls.map((l: number[]) => l[2]).sort((x: number, y: number) => x - y)[st.ls.length >> 1] : null;
		const th = got.map((r) => r.th / r.s).sort((x, y) => x - y);
		const on = got.filter((r) => mid !== null && Math.abs(r.c[2] - mid) < 2 * st.space).length;
		const ys = got.map((r) => r.c[2]);
		lines.push(`  box ${i} (${p.voice.includes(i) ? 'voice' : 'not voice'}, ${st ? 'found' : 'not found'}): ${got.length} rejected, thickness ${th[0].toFixed(2)} to ${th[th.length - 1].toFixed(2)} spaces (median ${th[th.length >> 1].toFixed(2)}); within 2 spaces of the found staff's middle ${on}, elsewhere ${got.length - on}; middle rows y ${Math.round(Math.min(...ys))} to ${Math.round(Math.max(...ys))}`);
		out[name].push({ box: i, space: st?.space ?? null, mid, got });
	});
	console.log(`${name}: ${total} groups rejected by the ceiling alone`);
	lines.forEach((l) => console.log(l));
}
fs.writeFileSync(W + '/step2-rejects.json', JSON.stringify(out));
