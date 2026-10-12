// Row 77: print every difference for one of S, T, V, X (opened songs only). Usage: tsx diff.ts <truth.json> <read.json>
import fs from 'node:fs';
import { scoreScan } from '../../../tools/e16-harness/src/scan-scorer.ts';
const [tp, rp] = process.argv.slice(2);
const tj = JSON.parse(fs.readFileSync(tp, 'utf8'));
const sorted = [...tj.verses[0].notes].sort((a: any, b: any) => a.onsetAbsolute - b.onsetAbsolute);
const events = sorted.map((n: any) => ({ type: n.type, measureIndex: n.measureIndex, midi: n.midi, duration: n.duration }));
const read = JSON.parse(fs.readFileSync(rp, 'utf8'));
const s: any = scoreScan({ events, bars: tj.measureDurations }, { events: read.events, bars: read.bars });
const N = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const nm = (m: number | undefined) => (m == null ? '-' : N[m % 12] + (Math.floor(m / 12) - 1));
const du = (d: any) => (d ? `${d.numerator}/${d.denominator}` : '?');
const ev = (e: any) => (e ? `${e.type === 'rest' ? 'rest' : nm(e.midi)} ${du(e.duration)}` : '');
console.log('shift', s.shift ?? s.octaveShift, 'pages', JSON.stringify(read.pages.map((p: any) => [p.bars, p.events])));
for (const d of s.differences) {
	const t = d.truthIndex != null ? sorted[d.truthIndex] : null;
	const r = d.readerIndex != null ? read.events[d.readerIndex] : null;
	console.log(`${d.kind.padEnd(18)} tbar ${d.truthBar ?? '-'} rbar ${d.readerBar ?? '-'} | truth ${t ? ev(t) + (t.unsure ? ' UNSURE' : '') + (t.syllable ? ' «' + t.syllable + '»' : '') : ''} | read ${ev(r)}`);
}
