#!/usr/bin/env node
/**
 * THE COLOUR-LITERAL CENSUS. Written by the Opus desk 2026-11-21 for
 * `plan-code-audit-maintainability_r4_2026-11-21.md` section 4a.
 *
 * Counts every colour literal in `apps/web/src` that is not in `app.css` and
 * not in a test, and says how many are exactly a value an existing custom
 * property already holds.
 *
 * THE ENTITY STRIP IS LOAD-BEARING. `&#160;` is the no-break space the French
 * GUIDE and LEARN text puts before a colon (OQLF). Without stripping numeric
 * entities first, a regex for `#rgb` counts it as the colour `#160`, 221 times
 * in `LearnContent.svelte` alone. The desk published a figure of 688 from a
 * grep that did not strip them. The true figure is about 299.
 *
 * Usage:  node scripts/census-colour-tokens.mjs [--json]
 * Exit 1 if the count exceeds the ratchet in scripts/ratchets.mjs, when seated.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC = 'apps/web/src';
const SKIP_DIRS = new Set(['node_modules', '.svelte-kit', 'build']);
const ENTITY = /&#\d+;/g;
const HEX = /(?<![&\w])#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;

function walk(dir, out = []) {
	for (const name of readdirSync(dir)) {
		if (SKIP_DIRS.has(name)) continue;
		const p = join(dir, name);
		if (statSync(p).isDirectory()) walk(p, out);
		else if ((p.endsWith('.svelte') || p.endsWith('.ts')) && !p.includes('.test.')) out.push(p);
	}
	return out;
}

const css = readFileSync(join(SRC, 'app.css'), 'utf8');
const tokens = new Map();
for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
	const value = m[2].toLowerCase();
	if (!tokens.has(value)) tokens.set(value, m[1]);
}

const rows = [];
for (const file of walk(SRC)) {
	if (file.endsWith('app.css')) continue;
	const lines = readFileSync(file, 'utf8').split('\n');
	lines.forEach((line, i) => {
		for (const m of line.replace(ENTITY, ' ').matchAll(HEX)) {
			const value = m[0].toLowerCase();
			rows.push({ file: relative(SRC, file), line: i + 1, value, token: tokens.get(value) ?? null, text: line.trim().slice(0, 120) });
		}
	});
}

const migrate = rows.filter((r) => r.token);
const judge = rows.filter((r) => !r.token);

if (process.argv.includes('--json')) {
	console.log(JSON.stringify({ total: rows.length, migrate: migrate.length, judge: judge.length, rows }, null, '\t'));
} else {
	console.log(`literals (non-test, outside app.css): ${rows.length}`);
	console.log(`  class 1, MIGRATE (value equals an existing token): ${migrate.length}`);
	console.log(`  needing a judgement (class 2 or 3):                ${judge.length}`);
	console.log(`  files: ${new Set(rows.map((r) => r.file)).size}`);
}
