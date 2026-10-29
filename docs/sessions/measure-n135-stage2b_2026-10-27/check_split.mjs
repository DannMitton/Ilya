import { readFileSync, writeFileSync } from 'node:fs';
import { splitTokens } from '../../../apps/web/src/lib/omr/underlay-tokens.ts';
const words = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const out = words.map((w) => {
	const parts = splitTokens([{ text: w.text, x0: w.x0, x1: w.x1 }]).filter((t) => /\p{L}/u.test(t.text));
	return parts.map((t, i) => [i < parts.length - 1 ? t.text.replace(/-$/, '') : t.text, (t.x0 + t.x1) / 2]);
});
writeFileSync(process.argv[3], JSON.stringify(out));
