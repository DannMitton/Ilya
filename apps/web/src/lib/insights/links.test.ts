import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { render } from 'svelte/server';
import { t } from '$lib/i18n';
import SingerBlock from './SingerBlock.svelte';
import { noScoreBlocks, notesBlock } from './singer-blocks';
import { isGenericMethodKey, methodLineKey } from './identity';
import type { InsightsLinks } from './links';

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

describe('L4, the record link, follows the three generic Method lines (N.203 lane 61, Step 4)', () => {
	it('isGenericMethodKey is true for exactly the keys methodLineKey names for a placeholder voice, in every combination', () => {
		for (const generic of [false, true]) for (const typed of [false, true]) for (const noScore of [false, true]) for (const samples of [false, true]) {
			const key = methodLineKey({ generic, typed, noScore, samples });
			expect(isGenericMethodKey(key), key + JSON.stringify({ generic, typed, noScore, samples })).toBe(generic && !(noScore && samples));
		}
	});
	const draw4 = (language: 'en' | 'fr', generic: boolean, links: InsightsLinks) =>
		render(SingerBlock, { props: { block: notesBlock('Method: the line.', null, language), language, width: 600, links, methodGeneric: generic } as never }).body;
	it('is drawn beside L1 with the pane’s own door words when the Method line is generic, in both languages', () => {
		for (const [key, lang] of [['calib.pane.door.record', 'en'], ['calib.pane.door.carryOn', 'fr'], ['calib.pane.door.again', 'en']] as const) {
			const html = draw4(lang, true, { shares: () => {}, record: () => {}, recordKey: key });
			expect(html, key).toContain(`>${t(key, lang)}</button>`);
			expect(html.indexOf(t('calib.pane.door.insights', lang))).toBeLessThan(html.indexOf(t(key, lang)));
		}
	});
	it('is not drawn when the Method line is not generic, and is drawn alone when L1 is absent', () => {
		expect(draw4('en', false, { shares: () => {}, record: () => {}, recordKey: 'calib.pane.door.record' })).not.toContain('Record your vowels');
		expect(draw4('en', true, { record: () => {}, recordKey: 'calib.pane.door.record' })).toContain('>Record your vowels</button>');
	});
});

describe('L6, INPUT in the sentence for a piece with no score', () => {
	const blk = (language: 'en' | 'fr') => ({ kind: 'silence', lines: [t('insights.silence.noScore', language)] }) as never;
	const html = (language: 'en' | 'fr', links?: InsightsLinks) => render(SingerBlock, { props: { block: blk(language), language, width: 600, links } as never }).body;
	const text = (h: string) => text0(/<p class="[^"]*prose[^"]*">(.*?)<\/p>/s.exec(h)![1]);
	const text0 = (h: string) => h.replace(/<!--.*?-->/gs, '').replace(/<[^>]*>/g, '');
	it('reads, with the markup taken away, as the one string it always was, in both languages', () => {
		for (const lang of ['en', 'fr'] as const) {
			expect(text(html(lang, { input: () => {} })), lang).toBe(t('insights.silence.noScore', lang));
			expect(text(html(lang)), lang).toBe(t('insights.silence.noScore', lang));
		}
	});
	it('makes only the word INPUT / ENTRÉE a button, and only when the page gives the link', () => {
		expect(html('en', { input: () => {} })).toMatch(/<button[^>]*>INPUT<\/button>/);
		expect(html('fr', { input: () => {} })).toMatch(/<button[^>]*>ENTRÉE<\/button>/);
		expect(html('en')).not.toContain('<button');
	});
	it('leaves every other silence line alone', () => {
		const other = { kind: 'silence', lines: [t('insights.silence.unmeasured', 'en')] } as never;
		expect(render(SingerBlock, { props: { block: other, language: 'en', width: 600, links: { input: () => {} } } as never }).body).not.toContain('<button');
	});
});
