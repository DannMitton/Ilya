/**
 * Row 165, the colour story (ratified by Dann 2026-10-30 16:22): the guard.
 *
 * Half one: no retired colour comes back. Every *.svelte, *.ts, *.css, *.html, *.js, and *.webmanifest under
 * apps/web/src, apps/web/static, and each package src folder is read (excluding __approved__/ and this file), and any
 * case-insensitive, word-bounded match of a retired hex, or of a retired decimal triplet inside rgb( / rgba(, fails.
 * `--surround-voice` (#D8D0E0) is not retired and is not on the list.
 *
 * Half two: the token pairs that carry words clear WCAG 2.2 AA, computed from app.css and never from literals.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '../../../..');
const SELF = fileURLToPath(import.meta.url);
const EXT = /\.(svelte|ts|css|html|js|webmanifest)$/;

const RETIRED_HEX = [
	// bands, sage deep and gloss
	'839275', '7A8A6C', 'AB7F7F', '748CB9', '9585A2', 'A38669', '8A5C5C',
	// chips
	'637156', '885F60', '556C96', '746580', '82664A',
	// inks
	'455238', '554660', '674141', '61472C', '374D75',
	// desks
	'CDD3C8', 'D5CEDA', 'DDCCCC', 'C7D1E3', 'DACFC3',
	// washes
	'E6E9E3', 'EAE7EC', 'EEE5E5',
	// family literals the census found
	'B48A8A', 'D9C4C4', 'E2D2D2', 'F0D8D8', 'C28888', '8BA48B', '8A9B7E', '6B7B5E', '7C6BB0', '6B5B7A', '8E7E9B', '9B8AA6'
];
const RETIRED_TRIPLETS = ['131,146,117', '171,127,127', '116,140,185', '149,133,162', '163,134,105', '124,107,176'];

function sourceFiles(): string[] {
	const dirs = [join(ROOT, 'apps/web/src'), join(ROOT, 'apps/web/static')];
	for (const p of readdirSync(join(ROOT, 'packages'))) dirs.push(join(ROOT, 'packages', p, 'src'));
	const out: string[] = [];
	const walk = (d: string) => {
		let names: string[];
		try { names = readdirSync(d); } catch { return; }
		for (const n of names) {
			if (n === 'node_modules' || n === '__approved__' || n === '.svelte-kit') continue;
			const p = join(d, n);
			if (statSync(p).isDirectory()) walk(p);
			else if (EXT.test(n) && p !== SELF) out.push(p);
		}
	};
	dirs.forEach(walk);
	return out;
}

const hexRe = new RegExp(`#(?:${RETIRED_HEX.join('|')})\\b`, 'i');
const rgbRe = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/gi;

/** Every retired colour in `text`, as "line N: match". */
export function retiredIn(text: string): string[] {
	const hits: string[] = [];
	text.split('\n').forEach((line, i) => {
		const h = hexRe.exec(line);
		if (h) hits.push(`line ${i + 1}: ${h[0]}`);
		for (const m of line.matchAll(rgbRe)) {
			if (RETIRED_TRIPLETS.includes(`${m[1]},${m[2]},${m[3]}`)) hits.push(`line ${i + 1}: ${m[0]})`);
		}
	});
	return hits;
}

describe('row 165: no retired colour comes back', () => {
	const files = sourceFiles();
	it('reads a plausible number of source files', () => {
		expect(files.length).toBeGreaterThan(300);
	});
	it('finds none of the retired hex values or rgb triplets', () => {
		const bad: string[] = [];
		for (const f of files) for (const h of retiredIn(readFileSync(f, 'utf8'))) bad.push(`${f.replace(ROOT + '/', '')} ${h}`);
		expect(bad).toEqual([]);
	});
	it('negative control: a retired value inserted into a copy of the source is caught', () => {
		const sample = readFileSync(join(ROOT, 'apps/web/src/app.css'), 'utf8');
		expect(retiredIn(sample)).toEqual([]);
		expect(retiredIn(sample + '\n.x { color: #9585a2; }')).toHaveLength(1);
		expect(retiredIn(sample + '\n.x { background: rgba(131, 146, 117, 0.1); }')).toHaveLength(1);
		expect(retiredIn(sample + '\n.x { fill: #839275; }')).toHaveLength(1);
	});
});

// ── contrast ──────────────────────────────────────────────────────────────
const css = readFileSync(join(ROOT, 'apps/web/src/app.css'), 'utf8');
const token = (name: string): string => {
	const m = css.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`));
	if (!m) throw new Error(`token --${name} not found as a hex in app.css`);
	return m[1].toUpperCase();
};
const lin = (c: number) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h: string) => { const [r, g, b] = rgb(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const over = (fg: string, bg: string, a: number) =>
	'#' + rgb(fg).map((c, i) => Math.round(a * c + (1 - a) * rgb(bg)[i]).toString(16).padStart(2, '0')).join('').toUpperCase();

const FAMILIES = ['sage', 'lavender', 'rose', 'cobalt', 'slate'] as const;
const PAPER = token('paper-cream');
const WHITE = '#FFFFFF';

describe('row 165: contrast of the token pairs that carry words (WCAG 2.2 AA)', () => {
	for (const f of FAMILIES) {
		describe(f, () => {
			const ink = token(`${f}-ink`);
			it('ink on paper, on white (print), on desk, on head, and on wash is at least 4.5:1', () => {
				for (const bg of [PAPER, WHITE, token(`${f}-desk`), token(`${f}-head`), token(`${f}-wash`)]) {
					expect(ratio(ink, bg), `${f}-ink on ${bg}`).toBeGreaterThanOrEqual(4.5);
				}
			});
			it('white on the jewel is at least 4.5:1', () => {
				expect(ratio(WHITE, token(`${f}-jewel`))).toBeGreaterThanOrEqual(4.5);
			});
			it('the jewel on the desk (a button on its page) is at least 3:1', () => {
				expect(ratio(token(`${f}-jewel`), token(`${f}-desk`))).toBeGreaterThanOrEqual(3);
			});
			it('white on the band is at least 3:1, which is for LARGE text only (the chapter title and .band-deck)', () => {
				expect(ratio(WHITE, token(f))).toBeGreaterThanOrEqual(3);
			});
		});
	}
	it('the 2026A badge: white on the jewel veil over each band is at least 4.5:1, at the percentage HeaderBar ships', () => {
		const src = readFileSync(join(ROOT, 'apps/web/src/lib/components/HeaderBar.svelte'), 'utf8');
		const m = src.match(/color-mix\(in srgb, var\(--tab-jewel\) (\d+)%, transparent\)/);
		expect(m, 'the badge veil rule').not.toBeNull();
		const a = Number(m![1]) / 100;
		for (const f of FAMILIES) {
			expect(ratio(WHITE, over(token(`${f}-jewel`), token(f), a)), `badge on ${f}`).toBeGreaterThanOrEqual(4.5);
		}
	});
});

describe('row 165: the browser chrome matches the TEXT band', () => {
	it('theme-color, the manifest background and theme colours, and --sage are one value', () => {
		const html = readFileSync(join(ROOT, 'apps/web/src/app.html'), 'utf8');
		const man = JSON.parse(readFileSync(join(ROOT, 'apps/web/static/manifest.webmanifest'), 'utf8'));
		const meta = html.match(/<meta name="theme-color" content="(#[0-9A-Fa-f]{6})"/)![1].toUpperCase();
		expect(meta).toBe(token('sage'));
		expect(String(man.theme_color).toUpperCase()).toBe(token('sage'));
		expect(String(man.background_color).toUpperCase()).toBe(token('sage'));
	});
});
