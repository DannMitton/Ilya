import fs from 'node:fs';
const names = process.argv.slice(2);
for (const c of [0.45, 0.6, 0.8]) {
  console.log('\nceil', c, ' (found/present by absolute ink level: pixel < level)');
  const lv = []; for (let i = 90; i <= 240; i += 5) lv.push(i);
  console.log('page'.padEnd(15) + lv.join(' ').replace(/\b(\d+)\b/g, (m) => m.padStart(3)));
  for (const n of names) {
    const j = JSON.parse(fs.readFileSync(n + '.sweep.json', 'utf8'));
    const row = lv.map((l) => { const r = j.grid.find((g) => g.ink === l && g.ceil === c); return String(r.found === j.stats.boxes ? '*' : r.found).padStart(3); });
    console.log(n.padEnd(15) + row.join(' ') + `   present=${j.stats.boxes} paper=${j.stats.paper} p1=${j.stats.p1}`);
  }
}
