/**
 * Builds the Step 3 tables from the rows `measure.run.ts` wrote (`N200_OUT`, `N200_SET=primary|held|third`; any other value throws), as Markdown on standard output and in
 * `<N200_OUT>/tables-<set>.md`. Not a gate. Every table is given for all takes, for takes with the second pulse, and for takes without it.
 */
import { test } from 'vitest';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { setByName } from './fidelity-set';
import { verdictTable, perTypeTable, weightTable, defaultCheck, selfCheck, choice, pairSplitTable, trackTable } from './variant-core';
import { mainTables, flagTable, moveTable, f2Section, ceilingTable, sensitivityTable, iuAbsent, onOffTable, type MRow } from './measure-core';

const SET = process.env.N200_SET ?? '', OUT = process.env.N200_OUT ?? '';

test.skipIf(!SET || !OUT)('tables', () => {
	setByName(SET);
	const rows: MRow[] = readdirSync(OUT).filter((n) => n.startsWith(`rows-${SET}-`)).sort().flatMap((n) => JSON.parse(readFileSync(path.join(OUT, n), 'utf8')) as MRow[]);
	const parts: string[] = [`# Tables, ${SET} set, ${rows.length} takes (${rows.filter((r) => r.pair).length} with the second pulse, ${rows.filter((r) => !r.pair).length} without)`];
	for (const [label, g] of [['All takes', rows], ['With the second pulse', rows.filter((r) => r.pair)], ['Without the second pulse', rows.filter((r) => !r.pair)]] as const) {
		const f2 = f2Section(g);
		parts.push(`\n## ${label} (${g.length})\n`, '### Main\n', mainTables(g), '\n### With the fR2 check on and off\n', onOffTable(g), '\n### Good takes flagged\n', flagTable(g), '\n### The fR2 check (keep-rule)\n', f2.keep, '\n### [i] and [u]: fR1 standing, fR2 absent\n', iuAbsent(g));
	}
	parts.push('\n## Status moves, shipped to path (all takes)\n', moveTable(rows), '\n## Ceilings (all takes)\n', ceilingTable(rows), '\n## Sensitivity (all takes)\n', sensitivityTable(rows));
	parts.push('\n## Every fR2 miss (path fR2 before the check outside the bar)\n', f2Section(rows).misses);
	if (rows.some((r) => r.v)) {
		const d = defaultCheck(rows), sc = selfCheck(rows);
		parts.push('\n## Lane 64 variants\n', sc.text, '\n', d.text, d.anyMiss ? '\n**A voice type misses the 80% bar with every option off: the lane stops for the desk (brief, Step 3).**' : '\nNo voice type misses the 80% bar with every option off.');
		parts.push('\n### Verdicts, pooled (the bars of section 3A)\n', verdictTable(rows), '\n### The desk\'s choice rule\n', choice(rows).text);
		parts.push('\n### Where P3 got its fR2\n', trackTable(rows), '\n### The weighting option\n', weightTable(rows));
		parts.push('\n### Every voice type, every variant\n', perTypeTable(rows), '\n### Split by the second pulse (reported, not judged)\n', pairSplitTable(rows));
		for (const [label, g] of [['with the second pulse', rows.filter((r) => r.pair)], ['without the second pulse', rows.filter((r) => !r.pair)]] as const) parts.push(`\n### Verdict table, ${label} (reported, not judged)\n`, verdictTable(g, label));
	}
	const text = parts.join('\n') + '\n';
	writeFileSync(path.join(OUT, `tables-${SET}.md`), text);
	console.log(text);
});
