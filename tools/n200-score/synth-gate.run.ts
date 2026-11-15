/**
 * The synthetic gate of N.200 Step 3, to the set and bars pre-registered in `docs/sessions/report-code-n200-step3_r1_2026-11-15.md`
 * before the open picker was written. Not a gate of the repository; see `vitest.config.ts`. Writes `N200_SYNTH_OUT` (a JSON file) when set.
 *   N200_SYNTH_OUT=/path/out.json pnpm --filter @ilya/web exec vitest run --config ../../tools/n200-score/vitest.config.ts synth-gate.run.ts
 */
import { test } from 'vitest';
import { writeFileSync } from 'node:fs';
import { synthFry, SYNTH_SR, type FryCase } from '$lib/voice/engine/fry-synth';
import { runCapture, type Picker } from '$lib/voice/engine/analyze';
import type { Vowel } from '$lib/voice/engine/types';

const BW = [60, 90, 120, 180, 250];
type C = { name: string; v: Vowel; f: number[]; treble?: boolean; extra?: Partial<FryCase>; stress?: boolean; bw?: number[] };
const BASS: C[] = [
	{ name: 'i 290/2150', v: 'i', f: [290, 2150, 2750, 3300, 3900] },
	{ name: 'e 380/1900', v: 'e', f: [380, 1900, 2600, 3300, 3900] },
	{ name: 'ɛ 580/1700', v: 'ɛ', f: [580, 1700, 2500, 3300, 3900] },
	{ name: 'a 710/1200', v: 'a', f: [710, 1200, 2500, 3300, 3900] },
	{ name: 'ɑ 650/1050', v: 'ɑ', f: [650, 1050, 2500, 3300, 3900] },
	{ name: 'ɑ 750/1150', v: 'ɑ', f: [750, 1150, 2550, 3300, 3900] },
	{ name: 'o 480/830', v: 'o', f: [480, 830, 2500, 3200, 3800] },
	{ name: 'u 270/700', v: 'u', f: [270, 700, 2300, 3000, 3700] },
];
const TREBLE: C[] = [
	{ name: 'T ɑ 900/1400', v: 'ɑ', f: [900, 1400, 2800, 3600, 4200], treble: true },
	{ name: 'T u 400/900', v: 'u', f: [400, 900, 2700, 3500, 4200], treble: true },
	{ name: 'T o 600/1000', v: 'o', f: [600, 1000, 2700, 3500, 4200], treble: true },
	{ name: 'T e 500/2300', v: 'e', f: [500, 2300, 3000, 3700, 4300], treble: true },
	{ name: 'T i 400/2700', v: 'i', f: [400, 2700, 3200, 3800, 4400], treble: true },
];
const STRESS: C[] = [
	{ name: 'S u 270/700 open 4ms', v: 'u', f: [270, 700, 2300, 3000, 3700], extra: { openMs: 4 }, stress: true },
	{ name: 'S o 480/830 open 4ms', v: 'o', f: [480, 830, 2500, 3200, 3800], extra: { openMs: 4 }, stress: true },
	{ name: 'S o 480/830 room x6', v: 'o', f: [480, 830, 2500, 3200, 3800], extra: { roomRms: 0.003 }, stress: true },
	{ name: 'S i 290/2150 pair 5ms', v: 'i', f: [290, 2150, 2750, 3300, 3900], extra: { pairMs: 5, pairRatio: 0.6 }, stress: true },
	{ name: 'S ɑ 650/1050 pair 5ms', v: 'ɑ', f: [650, 1050, 2500, 3300, 3900], extra: { pairMs: 5, pairRatio: 0.6 }, stress: true },
];
/** POST HOC: added after the first run and the browser run that found the 12% fR1 match too tight (the report says so). Wider bandwidths, which put the envelope's fR1 peak further from the pole. */
const BW_WIDE = [80, 100, 200, 250, 300];
const WIDE: C[] = [
	{ name: 'W i 290/2150 wide bw', v: 'i', f: [290, 2150, 2750, 3300, 3900], bw: BW_WIDE, stress: true },
	{ name: 'W u 300/800 wide bw', v: 'u', f: [300, 800, 2500, 3500, 4200], bw: BW_WIDE, stress: true },
	{ name: 'W ɑ 650/1050 wide bw', v: 'ɑ', f: [650, 1050, 2500, 3300, 3900], bw: BW_WIDE, stress: true },
	{ name: 'W o 480/830 wide bw', v: 'o', f: [480, 830, 2500, 3200, 3800], bw: BW_WIDE, stress: true },
	{ name: 'W e 380/1900 wide bw', v: 'e', f: [380, 1900, 2600, 3300, 3900], bw: BW_WIDE, stress: true },
];
const SOURCES: { tag: string; s: Partial<FryCase> }[] = [{ tag: 'plain', s: { jitter: 0.02 } }, { tag: 'plain', s: { jitter: 0.12 } }, { tag: 'diplo', s: { jitter: 0.05, diplo: 0.3 } }, { tag: 'plain', s: { jitter: 0.1, breath: 1 } }];
const RATES = [35, 50, 70], LEVELS = [0, -15, -30];
const ALL_ASKED: Vowel[] = ['i', 'e', 'ɪ', 'ɨ', 'ɛ', 'a', 'ɑ', 'ʌ', 'o', 'u'];

interface Rec { case: string; tag: string; level: number; picker: string; asked: string; f1: number | null; f2: number | null; status: string | null; f2q: string | null; ok1: boolean | null; ok2: boolean | null; comb?: number }
const ok = (v: number | null | undefined, ref: number, bar: number) => (v === null || v === undefined ? false : Math.abs(v - ref) / ref <= bar);

function run(c: C, picker: Picker, asked: Vowel, y: Float64Array) {
	const o = runCapture(y, SYNTH_SR, asked, undefined, undefined, picker);
	if (o.outcome !== 'reading') return { f1: null, f2: null, status: o.outcome, f2q: null, comb: undefined as number | undefined };
	const ev = (o as { formant: { picker?: string } }).formant;
	void ev;
	return { f1: o.formant.f1, f2: o.formant.f2 ?? null, status: o.formant.reading, f2q: o.formant.f2Quality ?? null, comb: undefined };
}

test('synthetic gate', () => {
	const recs: Rec[] = [];
	let agnosticTotal = 0, agnosticSame = 0;
	for (const c of [...BASS, ...TREBLE, ...STRESS, ...WIDE]) {
		let k = 0;
		for (const src of SOURCES) for (const rate of RATES) for (const level of LEVELS) {
			const y = synthFry({ formants: c.f, bandwidths: c.bw ?? BW, rate, levelDb: level, seed: 1000 + k++, ...src.s, ...c.extra });
			const push = (picker: string, asked: Vowel, r: ReturnType<typeof run>) =>
				recs.push({ case: c.name, tag: c.stress ? 'stress-' + src.tag : src.tag, level, picker, asked, f1: r.f1, f2: r.f2, status: r.status, f2q: r.f2q, ok1: ok(r.f1, c.f[0], 0.10), ok2: ok(r.f2, c.f[1], 0.12) });
			const open = run(c, 'open', c.v, y);
			push('open', c.v, open);
			push('shipped-right', c.v, run(c, 'shipped', c.v, y));
			if (c.v === 'ɑ' || c.v === 'u' || c.v === 'o') push('shipped-i-asked', 'i', run(c, 'shipped', 'i', y));
			// agnostic: the same take, every other asked vowel, on the first take of each case at each source only (cost)
			if (!c.bw && rate === 50 && level === 0) for (const a of ALL_ASKED) { agnosticTotal++; const r = run(c, 'open', a, y); if (r.f1 === open.f1 && r.f2 === open.f2 && r.status === open.status && r.f2q === open.f2q) agnosticSame++; }
		}
	}
	const rate = (rs: Rec[], sel: (r: Rec) => boolean | null) => `${rs.filter((r) => sel(r)).length}/${rs.length}`;
	const lines: string[] = [];
	const cases = [...BASS, ...TREBLE, ...STRESS, ...WIDE].map((c) => c.name);
	for (const name of cases) {
		for (const tag of name.startsWith('S ') ? ['stress-plain', 'stress-diplo'] : ['plain', 'diplo']) {
			for (const pk of ['open', 'shipped-right', 'shipped-i-asked']) {
				const rs = recs.filter((r) => r.case === name && r.tag === tag && r.picker === pk);
				if (!rs.length) continue;
				lines.push(`${name.padEnd(24)} ${tag.padEnd(13)} ${pk.padEnd(16)} n=${String(rs.length).padStart(2)}  fR1 ${rate(rs, (r) => r.ok1).padStart(5)}  fR2 ${rate(rs, (r) => r.ok2).padStart(5)}  captured ${rate(rs, (r) => r.status === 'captured').padStart(5)}  noReading ${rs.filter((r) => r.f1 === null).length}`);
			}
		}
	}
	const opn = recs.filter((r) => r.picker === 'open');
	const missCaptured = opn.filter((r) => r.f1 !== null && !r.ok1 && r.status === 'captured').length;
	const goodLevels = opn.filter((r) => r.tag === 'plain' && r.level >= -15);
	lines.push('', `agnostic (open, ten asked vowels): ${agnosticSame}/${agnosticTotal} identical`);
	lines.push(`bar 6: open fR1 outside 10% yet captured: ${missCaptured}/${opn.length} = ${(100 * missCaptured / opn.length).toFixed(1)}% (bar: at most 10%)`);
	lines.push(`bar 7: plain takes at 0 and -15 dB provisional: ${goodLevels.filter((r) => r.status === 'provisional').length}/${goodLevels.length} (bar: at most 20%)`);
	console.log(lines.join('\n'));
	if (process.env.N200_SYNTH_OUT) writeFileSync(process.env.N200_SYNTH_OUT, JSON.stringify({ recs, lines }, null, 1));
});
