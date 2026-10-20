/**
 * marks-line (row 114): the voice staff's markings on the notes the scorer matched. Desk, 2026-10-19.
 * Usage: marks-line.ts <label> <truth.json> <read.json> <marks.json> <score.json> [<out.json>]
 * Uses the scorer's own alignment at the octave shift final-line chose (score.json).
 * A truth mark counts as kept when the matched reader event carries the same mark.
 * Slur starts and slur stops are counted apart. Marks on bars of rest are not scored here.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
async function main() {
	const [label, truthPath, readPath, marksPath, scorePath, outPath] = process.argv.slice(2);
	const scorer = await import(pathToFileURL(process.env.SCAN_SCORER ?? path.resolve(path.dirname(process.argv[1]), '../../../tools/e16-harness/src/scan-scorer.ts')).href);
	const tj = JSON.parse(fs.readFileSync(truthPath, 'utf8'));
	const sorted = [...tj.verses[0].notes].sort((a: any, b: any) => a.onsetAbsolute - b.onsetAbsolute);
	const tev = sorted.map((n: any) => ({ type: n.type, measureIndex: n.measureIndex, midi: n.midi, duration: n.duration }));
	const tmarks: string[][] = sorted.map((n: any) => {
		const m: string[] = [...(n.articulations ?? [])];
		if (n.fermata) m.push('fermata');
		if (n.slurStart !== undefined) m.push('slurStart');
		if (n.slurStop !== undefined) m.push('slurStop');
		return m;
	});
	const read = JSON.parse(fs.readFileSync(readPath, 'utf8'));
	const rmarks: string[][] = JSON.parse(fs.readFileSync(marksPath, 'utf8'));
	if (rmarks.length !== read.events.length) throw new Error(`marks ${rmarks.length} != events ${read.events.length}`);
	const shift = JSON.parse(fs.readFileSync(scorePath, 'utf8')).shift;
	const { steps } = scorer.align(tev, read.events, shift);
	const kinds = new Map<string, { printed: number; kept: number; onUnmatched: number; extra: number }>();
	const k = (x: string) => { if (!kinds.has(x)) kinds.set(x, { printed: 0, kept: 0, onUnmatched: 0, extra: 0 }); return kinds.get(x)!; };
	for (const s of steps) {
		if (s.kind === 'match') {
			const t = tmarks[s.t], r = rmarks[s.r];
			for (const x of t) { k(x).printed++; if (r.includes(x)) k(x).kept++; }
			for (const x of r) if (!t.includes(x)) k(x).extra++;
		} else if (s.kind === 'missing') {
			for (const x of tmarks[s.t]) { k(x).printed++; k(x).onUnmatched++; }
		} else {
			for (const x of rmarks[s.r]) k(x).extra++;
		}
	}
	const order = ['slurStart', 'slurStop', 'accent', 'strong-accent', 'tenuto', 'staccato', 'staccatissimo', 'fermata', 'breath-mark', 'caesura'];
	const parts = [...kinds.entries()].sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
		.map(([x, c]) => `${x} ${c.kept} of ${c.printed} kept${c.onUnmatched ? ` (${c.onUnmatched} on notes not matched)` : ''}, ${c.extra} extra`);
	const tot = [...kinds.values()].reduce((a, c) => ({ p: a.p + c.printed, k: a.k + c.kept, e: a.e + c.extra }), { p: 0, k: 0, e: 0 });
	if (outPath) fs.writeFileSync(outPath, JSON.stringify(Object.fromEntries(kinds)));
	console.log(`${label} markings: ${parts.join('; ')}; all ${tot.k} of ${tot.p} kept, ${tot.e} extra`);
}
main();
