import fs from 'node:fs';
const names = ['nightingale-p4','nightingale-p2','nightingale-p3','nightingale-p5','song1-p1','song2-p1','song3-p1','song4-p1','withoutsun-p4','withoutsun-p5','withoutsun-p6'];
const D = process.env.HOME + '/Downloads/_desk-staffin-2026-11-25/work/code-lane/';
const pages = names.map((n) => {
  const d = JSON.parse(fs.readFileSync(D + n + '.dim.json')); const b = JSON.parse(fs.readFileSync(D + n + '.homr.json')).staves;
  const single = b.map((x) => x.h * d.h < 300);
  return { n, single, s: JSON.parse(fs.readFileSync(D + n + '.sweep2.json')) };
});
const ceils = []; for (let c = 35; c <= 100; c += 5) ceils.push(c / 100);
for (const an of ['p01', 'p1', 'p5']) {
  console.log('\n== anchor', an);
  // per page: for each ceil, u-range(s) where all single-staff boxes found
  for (const c of [0.45, 0.6, 0.8]) {
    const ci = ceils.indexOf(c);
    console.log(' ceil', c);
    for (const p of pages) {
      const ok = p.s.grid[an].map((r) => [...r.row[ci]].every((ch, i) => !p.single[i] || ch === '1'));
      const us = p.s.grid[an].map((r) => r.u);
      const runs = []; let st = null;
      ok.forEach((v, i) => { if (v && st === null) st = us[i]; if ((!v || i === ok.length - 1) && st !== null) { runs.push(st + '-' + (v ? us[i] : us[i - 1])); st = null; } });
      console.log('  ' + p.n.padEnd(15) + `single=${p.single.filter(Boolean).length}/${p.single.length} paper=${p.s.stats.paper} anchor=${p.s.stats[an]}  u: ${runs.join(', ') || 'none'}`);
    }
  }
  // all-pages intersection, every ceil
  const best = [];
  ceils.forEach((c, ci) => {
    const us = pages[0].s.grid[an].map((r) => r.u);
    const good = us.filter((u, i) => pages.every((p) => [...p.s.grid[an][i].row[ci]].every((ch, k) => !p.single[k] || ch === '1')));
    if (good.length) best.push(`ceil ${c}: u ${good[0]}-${good[good.length - 1]} (${good.length} steps)`);
  });
  console.log(' ALL pages (single-staff boxes):', best.join(' | ') || 'no (u,ceil) passes every page');
}
