/**
 * Scores a folder of the recorder's files. Not a gate; see `vitest.config.ts` for the command.
 * The folder is `N200_DIR`, or the first path on the command line. The reference file is `N200_REF` (a name in the folder, or an absolute path), default `reference.csv`. Output goes into `<folder>/n200-score-out/`:
 * `table.csv` (one row per take), `summary.txt` (pass rates against the bars), `candidates.json` (every candidate).
 */
import { test } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { scoreFolder, tableCsv, summaryText, isDir } from './score-core';

const dir = process.env.N200_DIR ?? process.argv.slice(2).find((a) => !a.startsWith('-') && isDir(a));

test.skipIf(!dir)('score a folder of recorder files', () => {
	const rows = scoreFolder(dir!, { burg: process.env.N200_NO_BURG !== '1', ref: process.env.N200_REF });
	const out = path.join(dir!, 'n200-score-out');
	mkdirSync(out, { recursive: true });
	writeFileSync(path.join(out, 'table.csv'), tableCsv(rows));
	writeFileSync(path.join(out, 'summary.txt'), summaryText(rows));
	writeFileSync(path.join(out, 'candidates.json'), JSON.stringify(rows.map((r) => ({ file: r.file, asked: r.asked, sung: r.sung, candidates: r.candidates })), null, 1));
	console.log(summaryText(rows));
	console.log(`${rows.length} takes; tables in ${out}`);
});
