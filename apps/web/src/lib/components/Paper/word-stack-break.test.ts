/**
 * QUEUE row 163 step 2: Text draws a typed # as its own element after its host, with the gap as CSS and
 * no space character, so a browser copy of the page text carries «tkʌ#».
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import { loadRealData, wordsOf } from '$lib/syntactic-break.support';
import WordStack from './WordStack.svelte';

beforeAll(loadRealData, 60_000);

const prefs = { reconstitution: false } as never;
/** The markup with Svelte's hydration comments taken out, as the browser's text sees it. */
const html = (text: string) => render(WordStack, { props: { word: wordsOf(text)[0], notationPrefs: prefs } }).body.replace(/<!--.*?-->/gs, '');
const ipaRow = (h: string) => /<span class="ipa-row[^"]*"[^>]*>(.*?)<\/span>\s*<span class="cyrillic-row/s.exec(h)?.[1] ?? '';

describe('Text’s IPA row', () => {
	it('draws the # in its own span, adjacent to the host with nothing between', () => {
		const row = ipaRow(html('Слух #'));
		expect(row).toMatch(/^[^<#]+<span class="ipa-break">#<\/span>$/u);
	});
	it('draws no span for a word with no #', () => {
		expect(html('Слух')).not.toContain('ipa-break');
	});
	it('keeps the # out of the host’s text node', () => {
		const row = ipaRow(html('Слух #'));
		expect(row.replace(/<span class="ipa-break">#<\/span>/u, '')).not.toContain('#');
	});
});
