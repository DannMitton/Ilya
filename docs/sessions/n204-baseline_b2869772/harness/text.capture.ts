/**
 * FAMILY 2, TEXT: the IPA `processText` gives, with the real dictionary loaded exactly as `ipa-corpus.approval.test.ts` loads it.
 * Two corpora: (a) the approval corpus, rendered by the same function and compared, read only, with the committed `ipa-corpus.txt`;
 * (b) every line of every poem in the poem library `data/dictionary.poems.*.json` (`textModern`).
 */
import { describe, it, beforeAll } from 'vitest';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setStressDictionary, setSingerSupplement } from '@ilya/phonology';
import { setGlossDictionary } from '@ilya/dictionary';
import { processText } from '$lib/pipeline';

const ROOT = process.env.ILYA_REPO_ROOT ?? fileURLToPath(new URL('../../../../', import.meta.url));
const OUT = process.env.CAPTURE_OUT;
const DATA_DIR = join(ROOT, 'apps/web/static/data');
let entryCount = 0;

beforeAll(() => {
	const dictionary: Record<string, any> = {};
	for (const file of ['dictionary.86d83340-a.json', 'dictionary.86d83340-b.json']) {
		for (const line of readFileSync(join(DATA_DIR, file), 'utf8').split(/\r?\n/)) {
			if (!line.trim()) continue;
			try {
				const [word, entry] = JSON.parse(line);
				if (entry.e !== undefined || entry.f !== undefined) entry.g = { en: entry.e || '', fr: entry.f || '' };
				dictionary[word] = entry;
			} catch { /* skipped, as loader.ts does */ }
		}
	}
	entryCount = Object.keys(dictionary).length;
	setStressDictionary(dictionary);
	setGlossDictionary(dictionary);
	setSingerSupplement(JSON.parse(readFileSync(join(DATA_DIR, 'singer-supplement.json'), 'utf8')));
}, 60_000);

const ipaOf = (line: string): string => (processText(line)[0]?.words ?? []).map((w) => w.ipaDisplay).join(' ');

describe('family 2: TEXT', () => {
	it('renders the approval corpus and the whole poem library', () => {
		if (!OUT) throw new Error('CAPTURE_OUT is not set');
		const dir = join(OUT, 'family2-text');
		mkdirSync(dir, { recursive: true });
		// (a) the approval corpus: the source lines are read back from the committed approved file (every non-indented, non-heading, non-count line).
		const approved = readFileSync(join(ROOT, 'apps/web/src/lib/approval/__approved__/ipa-corpus.txt'), 'utf8');
		const out: string[] = [`Dictionary entries loaded: ${entryCount}`, ''];
		let block: string[] = [];
		for (const l of approved.split('\n').slice(2)) {
			if (l.startsWith('── ')) { out.push(l); continue; }
			if (l === '' || l.startsWith('  ')) { if (l === '') out.push(''); continue; }
			out.push(l, `  ${ipaOf(l)}`);
		}
		void block;
		const rendered = out.join('\n').replace(/\n+$/, '') + '\n\n';
		writeFileSync(join(dir, 'approval-corpus.ipa.txt'), rendered);
		writeFileSync(join(dir, 'approval-corpus.vs-committed.txt'), rendered === approved ? 'identical to apps/web/src/lib/approval/__approved__/ipa-corpus.txt\n' : 'DIFFERS from apps/web/src/lib/approval/__approved__/ipa-corpus.txt (this file renders the lines read back from it; a trailing-newline difference is possible, see the report)\n');
		// (b) the poem library.
		const poemsFile = readdirSync(join(ROOT, 'data')).filter((f) => /^dictionary\.poems\..*\.json$/.test(f)).sort()[0];
		const lib = JSON.parse(readFileSync(join(ROOT, 'data', poemsFile), 'utf8')) as { entries: { id: string; title: string; author: string; textModern: string }[] };
		const lines: string[] = [`Dictionary entries loaded: ${entryCount}`, `Poem library: data/${poemsFile}, ${lib.entries.length} entries`, ''];
		let n = 0;
		for (const e of lib.entries) {
			lines.push(`── ${e.id} | ${e.title} | ${e.author} ──`);
			for (const l of (e.textModern ?? '').split('\n')) {
				if (!l.trim()) { lines.push(''); continue; }
				n++;
				let ipa: string;
				try { ipa = ipaOf(l); } catch (err) { ipa = `ERROR: ${String((err as Error).message).slice(0, 120)}`; }
				lines.push(l, `  ${ipa}`);
			}
			lines.push('');
		}
		writeFileSync(join(dir, 'poem-library.ipa.txt'), lines.join('\n'));
		writeFileSync(join(dir, 'summary.json'), JSON.stringify({ entryCount, poemsFile, poems: lib.entries.length, nonBlankLines: n }, null, '\t') + '\n');
	});
});
