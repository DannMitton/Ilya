import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { render } from 'svelte/server';
import { t } from '$lib/i18n';
import SingerBlock from './SingerBlock.svelte';
import { noScoreBlocks, notesBlock } from './singer-blocks';

/* N.203 lane 61, Step 3: L1 on the notes block. Built words (`calib.pane.door.insights`), no new key. */
const draw = (language: 'en' | 'fr', links?: { shares?: () => void }) =>
	render(SingerBlock, { props: { block: notesBlock('Method: the line.', null, language), language, width: 600, links } as never }).body;

describe('L1, "What INSIGHTS shares, and how", on the notes block', () => {
	it('is drawn after the Method line when the page gives the link, in both languages, with the built words', () => {
		for (const lang of ['en', 'fr'] as const) {
			const html = draw(lang, { shares: () => {} });
			expect(html, lang).toContain(`>${t('calib.pane.door.insights', lang)}</button>`);
			expect(html.indexOf('Method: the line.'), lang).toBeLessThan(html.indexOf('notes-links'));
		}
	});
	it('is not drawn when the page gives no link (no voice saved)', () => {
		for (const lang of ['en', 'fr'] as const) {
			expect(draw(lang)).not.toContain('notes-links');
			expect(draw(lang, {})).not.toContain('notes-links');
		}
	});
	it('says "What INSIGHTS shares, and how" and « Ce que partagent les APERÇUS, et comment »', () => {
		expect(t('calib.pane.door.insights', 'en')).toBe('What INSIGHTS shares, and how');
		expect(t('calib.pane.door.insights', 'fr')).toBe('Ce que partagent les APERÇUS, et comment');
	});
	it('is hidden in print, as the page’s other controls are', () => {
		const src = readFileSync('src/lib/insights/SingerBlock.svelte', 'utf8');
		const printBlock = src.slice(src.lastIndexOf('@media print'));
		expect(printBlock).toMatch(/\.notes-links,[\s\S]*display:\s*none/);
	});
});

describe('the page with no score', () => {
	it('is the same two blocks as before: the sentence, then the notes with the method line', () => {
		expect(noScoreBlocks('Method.', 'en')).toEqual([
			{ group: 'free', block: { kind: 'silence', lines: [t('insights.silence.noScore', 'en')] } },
			{ group: 'free', block: notesBlock('Method.', null, 'en') },
		]);
	});
});
