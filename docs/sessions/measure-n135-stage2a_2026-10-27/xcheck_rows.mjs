import { readFileSync } from 'node:fs';
import { cutRows } from '../../../apps/web/src/lib/omr/underlay-rows.ts';
const bands = JSON.parse(readFileSync(process.argv[2], 'utf8'));
let bad = 0, rows = 0;
for (const [i, b] of bands.entries()) {
	const got = cutRows({ width: b.W, height: b.H, data: Uint8Array.from(b.data), paper: b.paper }, b.sp);
	rows += got.length;
	if (JSON.stringify(got) !== JSON.stringify(b.want)) { bad++; if (bad <= 5) console.log('DIFF band', i, 'sp', b.sp, JSON.stringify(got), 'vs harness', JSON.stringify(b.want)); }
}
console.log(`${bands.length} bands, ${rows} rows from cutRows, ${bad} bands differ from the harness`);
