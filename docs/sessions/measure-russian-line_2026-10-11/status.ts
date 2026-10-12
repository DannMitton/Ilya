// Row 80: for each note event of a reading (conv.py's read.json), whether the scorer matches it to the truth ('song') or
// counts it extra, with the truth note's syllable. Uses scoreScan unchanged. Usage: tsx status.ts <truth.json> <read.json>
import fs from 'node:fs';
import { scoreScan } from '../../../tools/e16-harness/src/scan-scorer.ts';
const [tp, rp] = process.argv.slice(2);
const tj = JSON.parse(fs.readFileSync(tp, 'utf8'));
const sorted = [...tj.verses[0].notes].sort((a: any, b: any) => a.onsetAbsolute - b.onsetAbsolute);
const events = sorted.map((n: any) => ({ type: n.type, measureIndex: n.measureIndex, midi: n.midi, duration: n.duration }));
const read = JSON.parse(fs.readFileSync(rp, 'utf8'));
const s: any = scoreScan({ events, bars: tj.measureDurations }, { events: read.events, bars: read.bars });
const byReader = new Map<number, number>(s.matches.map((m: any) => [m.readerIndex, m.truthIndex]));
const out: any[] = [];
read.events.forEach((e: any, i: number) => {
	if (e.type !== 'note') return;
	const t = byReader.get(i);
	out.push({ bar: e.measureIndex, midi: e.midi, status: t === undefined ? 'extra' : 'song', syllable: t === undefined ? null : sorted[t].syllable ?? null, unsure: t === undefined ? null : !!sorted[t].unsure });
});
console.log(JSON.stringify(out));
