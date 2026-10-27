import { readFileSync } from 'node:fs';
import { seatTokens } from '../../../apps/web/src/lib/omr/underlay-seat.ts';
const cases = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const names = { 1: 'nearest', 2: 'order', 3: 'monotone' };
let bad = 0, checked = 0, surplus = 0;
for (const [ci, c] of cases.entries()) {
	// Note ids are positions in x order, so a seat's note is the harness's j.
	const notes = c.X.map((x, j) => ({ id: j, x, bar: c.bars[j], tiedInto: c.tie[j] }));
	const tokens = c.cx.map((x) => ({ text: 'а', x0: x - 5, x1: x + 5 }));
	for (const r of [1, 2, 3]) {
		const seats = seatTokens(tokens, notes, names[r]);
		if (r === 3 && c.want[r].surplus) {
			checked++; surplus++;
			const seated = seats.filter((s) => s.note !== null);
			const cost = seated.reduce((t, s) => t + Math.abs(s.offset), 0);
			const ordered = seated.every((s, k) => k === 0 || s.note > seated[k - 1].note);
			const flagged = seats.every((s) => s.unseated === (s.note === null));
			const ok = seated.length === c.X.length && ordered && flagged && (c.want[r].cost === null || Math.abs(cost - c.want[r].cost) < 1e-9);
			if (!ok) { bad++; if (bad <= 5) console.log('DIFF surplus case', ci, JSON.stringify({ seated: seated.length, cost, ordered, flagged, want: c.want[r] })); }
			continue;
		}
		const got = seats.map((s) => s.note);
		checked++;
		if (JSON.stringify(got) !== JSON.stringify(c.want[r])) { bad++; if (bad <= 5) console.log('DIFF case', ci, names[r], JSON.stringify(got), 'vs', JSON.stringify(c.want[r]), 'X', JSON.stringify(c.X), 'cx', JSON.stringify(c.cx)); }
	}
}
console.log(`${cases.length} rows x 3 rules = ${checked} seatings (${surplus} of them rule 3 with more tokens than notes, checked against brute force), ${bad} differ from score44.py or the brute-force minimum`);
