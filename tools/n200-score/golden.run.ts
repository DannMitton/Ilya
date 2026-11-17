/**
 * The golden of `runCapture` (N.200 path-picker brief r3, Step 0 item 3): the `shipped` and `open` pickers on the 600 primary
 * synthetic takes (`fidelity-set.ts`), written to `__golden__/shipped-open-600.json`, so a later step can show that adding the path
 * picker changed neither. f1 and f2 are rounded to 0.1 Hz, because pole values differed between two machines in P0b.
 *
 * Lane 64 (switch-on brief r2, Step 0 item 2) adds a second golden, `__golden__/path-600.json`: the `path` picker on the same 600 takes, same
 * row shape and rounding. Until Step 4 rewrites it, it stays byte-equal with every new option off.
 *
 * Not one of the eight gates (DESK DEFAULT). Run from the repository root:
 *   pnpm --filter @ilya/web exec vitest run --config ../../tools/n200-score/vitest.config.ts golden.run.ts
 * `N200_GOLDEN=write` writes `shipped-open-600.json`; `N200_GOLDEN=write-path` writes `path-600.json`; otherwise both are compared to the
 * committed files and the run fails on any difference.
 */
import { test, expect } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCapture, type Picker } from '$lib/voice/engine/analyze';
import { takes, PRIMARY } from './fidelity-set';

const here = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(here, '__golden__', 'shipped-open-600.json');
const FILE_PATH = path.join(here, '__golden__', 'path-600.json');
const r1 = (v: number | undefined | null) => (v === undefined || v === null ? null : Math.round(v * 10) / 10);

export function goldenRows(pickers: Picker[] = ['shipped', 'open']) {
	const rows: Record<string, unknown>[] = [];
	for (const t of takes(PRIMARY)) {
		const row: Record<string, unknown> = { idx: t.cell.idx, k: t.k, type: t.cell.type, vowel: t.cell.vowel };
		for (const p of pickers) {
			const o = runCapture(t.y, 48000, t.cell.vowel, undefined, undefined, p);
			row[p] = o.outcome === 'reading'
				? { outcome: 'reading', f1: r1(o.formant.f1), f2: r1(o.formant.f2), confidence: o.formant.confidence, reading: o.formant.reading, f2Quality: o.formant.f2Quality, picker: o.formant.picker ?? null }
				: { outcome: o.outcome, ...(o.outcome === 'error' ? { code: o.error.code } : { failed: o.failed }) };
		}
		rows.push(row);
	}
	return rows;
}

function goldenText(pickers: Picker[]): { rows: Record<string, unknown>[]; text: string } {
	const rows = goldenRows(pickers);
	return { rows, text: JSON.stringify({ takes: rows.length, rows }, null, 0).replace(/\},\{"idx"/g, '},\n{"idx"') + '\n' };
}

test.skipIf(process.env.N200_GOLDEN === 'write-path')('the shipped and open pickers on the 600 primary takes match the committed golden', () => {
	const { rows, text } = goldenText(['shipped', 'open']);
	if (process.env.N200_GOLDEN === 'write') { mkdirSync(path.dirname(FILE), { recursive: true }); writeFileSync(FILE, text); return; }
	expect(rows).toHaveLength(600);
	expect(text === readFileSync(FILE, 'utf8')).toBe(true);
});

test.skipIf(process.env.N200_GOLDEN === 'write')('the path picker on the 600 primary takes matches the committed golden', () => {
	const { rows, text } = goldenText(['path']);
	if (process.env.N200_GOLDEN === 'write-path') { mkdirSync(path.dirname(FILE_PATH), { recursive: true }); writeFileSync(FILE_PATH, text); return; }
	expect(rows).toHaveLength(600);
	expect(text === readFileSync(FILE_PATH, 'utf8')).toBe(true);
});
