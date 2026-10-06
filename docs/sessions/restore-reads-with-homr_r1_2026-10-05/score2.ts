import fs from 'node:fs';
import { scoreScan } from '/Users/dannmitton/Desktop/ilya-rewrite/tools/e16-harness/src/scan-scorer.ts';
const R = '/Users/dannmitton/Desktop/ilya-rewrite/';
const tj = JSON.parse(fs.readFileSync(R + 'docs/sessions/truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json', 'utf8'));
const events = [...tj.verses[0].notes].sort((a: any, b: any) => a.onsetAbsolute - b.onsetAbsolute)
  .map((n: any) => ({ type: n.type, measureIndex: n.measureIndex, midi: n.midi, duration: n.duration }));
const truth = { events, bars: tj.measureDurations };
const STEP: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
function parse(xml: string, label: string) {
  const divisions = Number(/<divisions>(\d+)/.exec(xml)![1]);
  const measures = xml.split(/<measure /).slice(1);
  const evs: any[] = []; const bars: any[] = [];
  let metre = '3/8';
  const barSums: number[] = []; const durSums: number[] = [];
  measures.forEach((m, i) => {
    const t = /<time>\s*<beats>(\d+)<\/beats>\s*<beat-type>(\d+)/.exec(m); if (t) metre = `${t[1]}/${t[2]}`;
    let sum = 0; let durSum = 0;
    for (const nm of m.matchAll(/<note[ >][\s\S]*?<\/note>/g)) {
      const n = nm[0];
      if (/<chord\/>/.test(n)) continue;
      const TY: Record<string, number> = { whole: 32, half: 16, quarter: 8, eighth: 4, '16th': 2, '32nd': 1 };
      const ty = /<type>(\w+)/.exec(n)![1]; const dots = (n.match(/<dot/g) || []).length;
      const d = TY[ty] * (dots ? 1.5 : 1); durSum += Number(/<duration>(\d+)/.exec(n)![1]);
      const num = d, den = 32, g = gcd(num, den);
      const duration = { numerator: num / g, denominator: den / g };
      sum += d;
      if (/<rest/.test(n)) evs.push({ type: 'rest', measureIndex: i, duration });
      else {
        const p0 = /<step>(\w)<\/step>\s*(?:<alter>(-?\d+)<\/alter>\s*)?<octave>(\d+)<\/octave>\s*(?:<alter>(-?\d+)<\/alter>)?/.exec(n)!; const p = [0, p0[1], p0[2] ?? p0[4] ?? '0', p0[3]];
        evs.push({ type: 'note', measureIndex: i, midi: 12 * (Number(p[3]) + 1) + STEP[p[1]] + Number(p[2] || 0), duration });
      }
    }
    const g = gcd(sum, 32);
    bars.push({ measureIndex: i, metre: (() => { const [b, bt] = metre.split('/').map(Number); return { beats: b, beatType: bt }; })(),
      measureDuration: sum ? { numerator: sum / g, denominator: 32 / g } : { numerator: 0, denominator: 1 } });
    barSums.push(sum / 32); durSums.push(durSum / (divisions * 4));
  });
  const s = scoreScan(truth as any, { events: evs, bars } as any);
  const metreVal = 3 / 8;
  const add = barSums.filter(x => Math.abs(x - metreVal) < 1e-9).length;
  const addDur = durSums.filter(x => Math.abs(x - metreVal) < 1e-9).length; const empty = barSums.filter(x => x === 0).length;
  const sumDist: Record<string, number> = {};
  barSums.forEach(x => { const k = String(x); sumDist[k] = (sumDist[k] || 0) + 1; });
  const diffs = s.differences.map((d: any) => `${d.kind} (truth bar ${d.truthBar}, read bar ${d.readerBar})`);
  const out = { label, divisions, readBars: measures.length, barsAddTo3_8: add, barsAddTo3_8ByDurationElement: addDur, emptyBars: empty, sumDist, truthBars: tj.measureDurations.length,
    shift: s.shift, bars: s.bars, notes: s.notes, rests: s.rests, headline: s.headline, differences: diffs };
  fs.writeFileSync(`m/${label}.score.json`, JSON.stringify(out, null, 1));
  console.log(JSON.stringify({ label, readBars: measures.length, barsAddTo3_8: add, barsAddTo3_8ByDurationElement: addDur, emptyBars: empty, bars: s.bars, notes: s.notes, rests: s.rests, headline: s.headline, sumDist }));
  console.log(diffs.join('\n'));
}
for (const f of process.argv.slice(2)) parse(fs.readFileSync(f, 'utf8'), f.replace(/.*\//, '').replace(/\.musicxml$/, ''));
if (process.env.DBG) { const x = fs.readFileSync('out/webgpu.joined.musicxml','utf8'); console.log(events.filter((e:any)=>e.type==='note').slice(0,12).map((e:any)=>e.midi).join(','), (x.match(/<pitch>[\s\S]*?<\/pitch>/g)||[]).slice(0,12).map(p=>p.replace(/\s+/g,'')).join(' ')); console.log(JSON.parse(fs.readFileSync('out/webgpu.score.json','utf8')).shift) }
