/**
 * FAMILY 1, MELODY: the drawn score. Every tracked `.musicxml` (the same set `strophic-byte-baseline.test.ts` walks), paginated through
 * `paginateMelody` exactly as that test calls it, and every page's SVG written out unaltered. Nothing is normalised.
 * Voice input: none (`{ fR1: {} }`, as the strophic baseline). Language: 'en'. Page: 624 x 727 (that test's geometry).
 * Reads the committed `strophic-byte-baseline.json` and reports agreement; it never writes it.
 */
import { describe, it } from 'vitest';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeScore, MusicXmlScoreParser } from '@ilya/score-parser';
import { paginateMelody } from '$lib/melody/melody-pages';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { ENGRAVING_DEFAULTS } from '$lib/score/engraving';

const ROOT = process.env.ILYA_REPO_ROOT ?? fileURLToPath(new URL('../../../../', import.meta.url));
const OUT = process.env.CAPTURE_OUT;
const PAGE = { pageWidth: 624, pageHeight: 727 };
const sha = (s: string) => createHash('sha256').update(s).digest('hex');

describe('family 1: MELODY', () => {
	it('captures every page of every tracked MusicXML fixture', async () => {
		if (!OUT) throw new Error('CAPTURE_OUT is not set');
		const dir = join(OUT, 'family1-melody');
		mkdirSync(dir, { recursive: true });
		const files = execFileSync('git', ['ls-files', '-z', '--', '*.musicxml'], { cwd: ROOT, encoding: 'utf8' })
			.split('\0').filter((p) => p !== '').filter((p) => /^(apps|docs|tools|packages)\//.test(p)).sort();
		const committed = JSON.parse(readFileSync(join(ROOT, 'apps/web/src/lib/melody/strophic-byte-baseline.json'), 'utf8')) as Record<string, string>;
		const rows: unknown[] = [];
		for (const rel of files) {
			const text = readFileSync(join(ROOT, rel), 'utf8');
			const software = /<software>([^<]*)<\/software>/.exec(text)?.[1] ?? null;
			const source = software === 'homr' ? 'scanned-source (software tag: homr)' : software ? `file-source (software tag: ${software})` : 'file-source (no software tag; provenance not established)';
			const row: Record<string, unknown> = { path: rel, source, bytesIn: Buffer.byteLength(text) };
			try {
				const parsed = (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(text) as unknown as Document } as never)).score;
				const analyzed = analyzeScore(parsed, { fR1: {} }, () => undefined, { generatedAt: '2026-10-11T00:00:00.000Z' });
				const { pages } = paginateMelody({ score: parsed, analyzed, ...PAGE, laterPageHeight: PAGE.pageHeight, engraving: ENGRAVING_DEFAULTS, channels: {}, verses: { profile: { fR1: {} }, notationPrefs: { reducedVowel: false, geminate: false, shcha: false, palatalNasal: false, reconstitution: false }, openSyllabification: false }, language: 'en' });
				const body = pages.join('\n<!-- ilya-baseline: page break -->\n');
				writeFileSync(join(dir, rel.replaceAll('/', '__') + '.pages.svg'), body);
				row.pages = pages.length;
				row.bytesOut = Buffer.byteLength(body);
				row.pageSha256 = pages.map(sha);
				const strophic = sha(pages.join('\u0000'));
				row.strophicBaseline = committed[rel] === undefined ? 'not in the committed baseline' : committed[rel] === strophic ? 'agrees with strophic-byte-baseline.json' : 'DIFFERS from strophic-byte-baseline.json';
			} catch (e) {
				row.error = String((e as Error)?.message ?? e).slice(0, 300);
			}
			rows.push(row);
		}
		writeFileSync(join(dir, 'fixtures.json'), JSON.stringify(rows, null, '\t') + '\n');
		if (!existsSync(join(dir, 'fixtures.json'))) throw new Error('no fixtures written');
	});
});
