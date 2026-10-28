import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/* QUEUE row 134. The three page stacks print in their screen colours only while
   `app.css` carries `print-color-adjust: exact` for them inside its print block.
   Read as source, as ratified-lines.test.ts reads GuideContent.svelte, because
   vitest does not print. The measure that the rule changes what Chromium prints
   is the report's, taken in a browser. */
const css = readFileSync(new URL('../app.css', import.meta.url), 'utf8');

function printBlock(src: string): string {
	const start = src.indexOf('@media print');
	const open = src.indexOf('{', start);
	let depth = 0;
	for (let i = open; i < src.length; i++) {
		if (src[i] === '{') depth++;
		else if (src[i] === '}' && --depth === 0) return src.slice(open + 1, i);
	}
	throw new Error('the print block does not close');
}

describe('row 134: the three page stacks keep their colours on paper', () => {
	const stacks = /\.paper-container,\s*\.markup-paper-container,\s*\.insights-container\s*\{([^}]*)\}/g;
	const bodies = [...printBlock(css).matchAll(stacks)].map((m) => m[1]);

	it('the print block names the three stacks together', () => {
		expect(bodies.length).toBeGreaterThan(0);
	});
	it('one of those rules sets both spellings of print-color-adjust to exact', () => {
		const set = bodies.some((b) => /(^|[\s;])print-color-adjust:\s*exact\b/.test(b) && /-webkit-print-color-adjust:\s*exact\b/.test(b));
		expect(set).toBe(true);
	});
	it('it is not set on body or on every element', () => {
		const block = printBlock(css);
		expect(block).not.toMatch(/(^|\n)\s*(\*|body|html)\s*\{[^}]*print-color-adjust/);
	});
});
