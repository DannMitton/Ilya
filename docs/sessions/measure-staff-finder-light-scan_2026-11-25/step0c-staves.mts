// Step 0c needs staves on page 4, and the shipped finder returns none, so they come from scratch.ts at the
// provisional pair (level 206, ceiling 0.65), strokes and meanInk left at 140 and extent at the new level
// (amendment r1, decisions 2 and 3). Writes <out>.staves.json.
// usage: node step0c-staves.mts <workdir>
import fs from 'node:fs';
import { P, staffIn, windowsOf } from './scratch.ts';
const D = process.argv[2] + '/';
const { w, h } = JSON.parse(fs.readFileSync(D + 'nightingale-p4.dim.json', 'utf8'));
const g = { width: w, height: h, data: new Uint8Array(fs.readFileSync(D + 'nightingale-p4.gray')) };
const boxes = JSON.parse(fs.readFileSync(D + 'step0c-p4.homrfull.json', 'utf8')).staves;
P.ink = 140; P.ceil = 0.45; P.inkG = null;
console.log('shipped constants (140, 0.45): staves found', boxes.filter((b) => staffIn(g, b)).length, '/', boxes.length);
P.ink = 206; P.ceil = 0.65; P.inkG = 140;
const out = boxes.map((b, i) => {
	const st = staffIn(g, b);
	if (!st) return { box: i, st: null, windows: [] };
	const windows = windowsOf(g, st, i).map(({ staff, ...rest }) => rest);
	console.log(`box ${i}: space ${st.space.toFixed(1)} x ${st.x0}-${st.x1} lines@mid ${st.ls[Math.floor(st.ls.length / 2)].map((v) => v.toFixed(0))} windows ${windows.length}`);
	return { box: i, st, windows };
});
console.log('candidate pair (206, 0.65): staves found', out.filter((o) => o.st).length, '/', boxes.length);
fs.writeFileSync(D + 'step0c-p4.staves.json', JSON.stringify(out));
