// N.135 stage 1: the scorer's alignment (scoreScan, unchanged) of a truth file to a reading, with the truth's syllable on every truth note.
// Usage: tsx status2.ts <truth.json> <read.json>  -> JSON { truth: [{i,type,bar,midi,syl,sylType}], match: [[readerIndex, truthIndex]], nTruthNotes }
import fs from 'node:fs';
import { scoreScan } from '../../../tools/e16-harness/src/scan-scorer.ts';
const [tp, rp] = process.argv.slice(2);
const tj = JSON.parse(fs.readFileSync(tp, 'utf8'));
const sorted = [...tj.verses[0].notes].sort((a: any, b: any) => a.onsetAbsolute - b.onsetAbsolute);
const events = sorted.map((n: any) => ({ type: n.type, measureIndex: n.measureIndex, midi: n.midi, duration: n.duration }));
const read = JSON.parse(fs.readFileSync(rp, 'utf8'));
const s: any = scoreScan({ events, bars: tj.measureDurations }, { events: read.events, bars: read.bars });
console.log(JSON.stringify({
	truth: sorted.map((n: any, i: number) => ({ i, type: n.type, bar: n.measureIndex, midi: n.midi ?? null, syl: n.syllableText ?? n.syllable ?? null, sylType: n.syllableType ?? n.syllabic ?? null })),
	match: s.matches.map((m: any) => [m.readerIndex, m.truthIndex])
}));
