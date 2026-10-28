import { readFileSync } from 'node:fs';
import { seatTokens } from '../../../apps/web/src/lib/omr/underlay-seat.ts';
const cases = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const names = { 1: 'nearest', 2: 'order', 3: 'monotone' };
// "plain": no tiedInto flag is passed, so every note sings, and the answer is the harness's own (score44.py) unchanged.
// "free": the flags are passed, and the answer is the harness's rules on the notes that sing a syllable only.
const out = {};
for (const mode of ['plain', 'free']) {
	let bad = 0, checked = 0, surplus = 0, unseated = 0;
	for (const [ci, c] of cases.entries()) {
		// Note ids are positions in x order, so a seat's note is the harness's j.
		const notes = c.X.map((x, j) => (mode === 'free' ? { id: j, x, bar: c.bars[j], tiedInto: c.tie[j] } : { id: j, x, bar: c.bars[j] }));
		const tokens = c.cx.map((x) => ({ text: 'а', x0: x - 5, x1: x + 5 }));
		for (const r of [1, 2, 3]) {
			const want = c[mode][r];
			const seats = seatTokens(tokens, notes, names[r]);
			checked++;
			if (want && want.surplus) {
				surplus++;
				const seated = seats.filter((s) => s.note !== null);
				const cost = seated.reduce((t, s) => t + Math.abs(s.offset), 0);
				const ordered = seated.every((s, k) => k === 0 || s.note > seated[k - 1].note);
				const flagged = seats.every((s) => s.unseated === (s.note === null));
				const ok = seated.length === want.seated && ordered && flagged && (want.cost === null || Math.abs(cost - want.cost) < 1e-9);
				if (!ok) { bad++; if (bad <= 5) console.log('DIFF', mode, 'surplus case', ci, JSON.stringify({ seated: seated.length, cost, ordered, flagged, want })); }
				continue;
			}
			const got = seats.map((s) => s.note);
			unseated += got.filter((n) => n === null).length;
			if (JSON.stringify(got) !== JSON.stringify(want)) { bad++; if (bad <= 5) console.log('DIFF', mode, 'case', ci, names[r], JSON.stringify(got), 'vs', JSON.stringify(want), 'X', JSON.stringify(c.X), 'tie', JSON.stringify(c.tie), 'cx', JSON.stringify(c.cx)); }
		}
	}
	console.log(`${mode}: ${cases.length} rows x 3 rules = ${checked} seatings (${surplus} of them rule 3 with more tokens than free notes, checked against brute force; ${unseated} tokens left unseated in the rest), ${bad} differ from ${mode === 'plain' ? 'score44.py unchanged' : 'the harness rules on the free notes'}`);
}
