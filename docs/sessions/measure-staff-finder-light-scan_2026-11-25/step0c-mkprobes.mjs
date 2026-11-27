// Probe copies of three tree modules for step 0c: private functions exported, and (diagnostic only) the ink
// constant made settable, default unchanged. The tree is untouched.
// usage: node step0c-mkprobes.mjs <gendir>
import fs from 'node:fs';
const OMR = '/Users/dannmitton/Desktop/ilya-rewrite/apps/web/src/lib/omr';
const dir = process.argv[2];
fs.mkdirSync(dir, { recursive: true });
function make(name, out, reps) {
	let s = fs.readFileSync(`${OMR}/${name}`, 'utf8');
	for (const [a, b, n = 1] of reps) {
		const got = s.split(a).length - 1;
		if (got !== n) throw new Error(`${name}: expected ${n} of ${a}, found ${got}`);
		s = s.split(a).join(b);
	}
	s = s.replace(/from '\.\//g, `from '${OMR}/`);
	fs.writeFileSync(`${dir}/${out}`, s);
}
make('underlay-rows.ts', 'rows.ts', [
	['function paperOf(', 'export function paperOf('],
	['function inkProfile(', 'export function inkProfile('],
]);
make('metre-reader.ts', 'reader.ts', [
	['function profiles(', 'export const T = { v: 128 };\nexport function profiles('],
	['< 128) n++', '< T.v) n++', 2],
]);
make('tuplet-number.ts', 'tuplet.ts', [
	['const INK = 140;', 'export const P = { ink: 140 };\nexport const LAST: Record<string, unknown> = {};'],
	['< INK', '< P.ink', 2],
	['ink[y * w + x] = page.data[(by0 + y) * page.width + bx0 + x] < P.ink ? 1 : 0;', 'ink[y * w + x] = page.data[(by0 + y) * page.width + bx0 + x] < P.ink ? 1 : 0;\n\tconst inkCount = ink.reduce((a, b) => a + b, 0);'],
	['// Connected marks, eight neighbours.', 'Object.assign(LAST, { w, h, ink: inkCount, cut: cut.length, lines: lines.slice(), staff });\n\t// Connected marks, eight neighbours.'],
]);
console.log('probes written to', dir);
