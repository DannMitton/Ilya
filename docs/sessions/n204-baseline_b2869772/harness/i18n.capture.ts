/** FAMILY 6: the interface strings. Every key, sorted, with its English and French text, one JSON object per line. The sorted table itself is the capture. */
import { describe, it } from 'vitest';
import { createHash } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { stringKeys, t, hasString } from '$lib/i18n';

describe('family 6: interface strings', () => {
	it('writes the sorted table and its hash', () => {
		const OUT = process.env.CAPTURE_OUT;
		if (!OUT) throw new Error('CAPTURE_OUT is not set');
		const dir = join(OUT, 'family6-i18n');
		mkdirSync(dir, { recursive: true });
		const keys = [...stringKeys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
		const rows = keys.map((key) => JSON.stringify({ key, en: hasString(key, 'en') ? t(key, 'en') : null, fr: hasString(key, 'fr') ? t(key, 'fr') : null }));
		const table = rows.join('\n') + '\n';
		writeFileSync(join(dir, 'i18n-table.jsonl'), table);
		writeFileSync(join(dir, 'i18n-table.sha256'), `${createHash('sha256').update(table).digest('hex')}  i18n-table.jsonl  (${keys.length} keys)\n`);
	});
});
