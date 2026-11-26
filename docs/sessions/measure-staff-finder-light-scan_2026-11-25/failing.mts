import fs from 'node:fs';
import { P, staffIn } from './scratch.ts';
const [prefix, ink, ceil] = process.argv.slice(2);
const { w, h } = JSON.parse(fs.readFileSync(prefix + '.dim.json', 'utf8'));
const g = { width: w, height: h, data: new Uint8Array(fs.readFileSync(prefix + '.gray')) };
const boxes = JSON.parse(fs.readFileSync(prefix + '.homr.json', 'utf8')).staves;
P.ink = +ink; P.ceil = +ceil;
boxes.forEach((b, i) => { const s = staffIn(g, b); console.log(i, 'cy', b.cy.toFixed(3), 'w', b.w.toFixed(3), 'h', b.h.toFixed(4), s ? `found space ${s.space.toFixed(1)} x ${s.x0}-${s.x1}` : 'NULL'); });
