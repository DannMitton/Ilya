import fs from 'node:fs';
import { scoreScan } from './scan-scorer.ts';
const [truthPath, readPath, mode] = process.argv.slice(2);
const tj = JSON.parse(fs.readFileSync(truthPath, 'utf8'));
const events = [...tj.verses[0].notes].sort((a: any, b: any) => a.onsetAbsolute - b.onsetAbsolute)
  .map((n: any) => ({ type: n.type, measureIndex: n.measureIndex, midi: n.midi, duration: n.duration }));
const read = JSON.parse(fs.readFileSync(readPath, 'utf8'));
const s: any = scoreScan({ events, bars: tj.measureDurations }, { events: read.events, bars: read.bars });
const t = { shift: s.shift, bars: s.bars, notes: s.notes, rests: s.rests, headline: s.headline };
console.log(JSON.stringify(t));
if (mode === 'full') fs.writeFileSync(readPath.replace('.read.json', '.score.json'), JSON.stringify(s, null, 1));
