// Builds scratch.ts from the tree's metre-windows.ts with the ink level and thickness ceiling as mutable parameters. Measure only; the tree is untouched.
import fs from 'node:fs';
let s = fs.readFileSync('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/src/lib/omr/metre-windows.ts', 'utf8');
const rep = (a, b) => { if (!s.includes(a)) throw new Error('missing ' + a); s = s.replace(a, b); };
rep("import type { Band } from './metre-reader';\nimport { SP } from './metre-reader';", "type Band = { width: number; height: number; data: Uint8Array };\nconst SP = 10;");
rep('const INK = 140;', 'export const P: { ink: number; ceil: number; inkG: number | null } = { ink: 140, ceil: 0.45, inkG: null };');
rep('function inkAt(g: Grey, x: number, y: number): boolean {', 'function inkAt(g: Grey, x: number, y: number, lv: number = P.ink): boolean {');
rep('return g.data[y * g.width + x] < INK;', 'return g.data[y * g.width + x] < lv;');
rep('if (inkAt(g, x, y)) n++;', 'if (inkAt(g, x, y, P.inkG ?? P.ink)) n++;');
rep('inkAt(g, xx + d, y)', 'inkAt(g, xx + d, y, P.inkG ?? P.ink)');
rep('for (let x = x0; x < x1; x++) if (inkAt(g, x, y0 + y)) c++;', 'for (let x = x0; x < x1; x++) if (g.data[(y0 + y) * g.width + x] < P.ink) c++;');
rep('if (th > 0.45 * s) continue;', 'if (th > P.ceil * s) continue;');
fs.writeFileSync('scratch.ts', s);

let b = fs.readFileSync('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/src/lib/omr/underlay-below.ts', 'utf8');
const rb = (a, c) => { if (!b.includes(a)) throw new Error('missing ' + a); b = b.replace(a, c); };
rb("import { fives, lineRows, type Grey } from './metre-windows';", "import { fives, lineRows, type Grey, type Staff, type StaffBoxLike } from './scratch';");
rb("import { MARGIN, type PlacedStaff } from './underlay-band';", "const MARGIN = " + fs.readFileSync('/Users/dannmitton/Desktop/ilya-rewrite/apps/web/src/lib/omr/underlay-band.ts','utf8').match(/export const MARGIN = ([^;]+);/)[1] + ";\ninterface PlacedStaff { box: StaffBoxLike; staff: Staff }");
fs.writeFileSync('scratch-below.ts', b);
