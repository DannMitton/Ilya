import { readFileSync } from 'node:fs';
import { seatTokens } from '../../../apps/web/src/lib/omr/underlay-seat.ts';
const cases = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const names = { 1: 'nearest', 2: 'order', 3: 'monotone' };
let bad = 0, checked = 0;
for (const [ci, c] of cases.entries()) {
	// Note ids are positions in x order, so a seat's note is the harness's j.
	const notes = c.X.map((x, j) => ({ id: j, x, bar: c.bars[j], tiedInto: c.tie[j] }));
	const tokens = c.cx.map((x) => ({ text: 'а', x0: x - 5, x1: x + 5 }));
	for (const r of [1, 2, 3]) {
		const got = seatTokens(tokens, notes, names[r]).map((s) => s.note);
		checked++;
		if (JSON.stringify(got) !== JSON.stringify(c.want[r])) { bad++; if (bad <= 5) console.log('DIFF case', ci, names[r], JSON.stringify(got), 'vs', JSON.stringify(c.want[r]), 'X', JSON.stringify(c.X), 'cx', JSON.stringify(c.cx)); }
	}
}
console.log(`${cases.length} rows x 3 rules = ${checked} seatings, ${bad} differ from score44.py`);
