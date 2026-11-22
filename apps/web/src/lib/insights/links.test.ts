import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { render } from 'svelte/server';
import { t } from '$lib/i18n';
import { blankFrame } from '$lib/page-config';
import SingerBlock from './SingerBlock.svelte';
import BlankState from '$lib/components/Paper/BlankState.svelte';
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
	it('is the notes block alone, with the method line, or nothing for a voice with no method line: the squircle is BlankState\u2019s (lane 78)', () => {
		expect(noScoreBlocks('Method.', 'en')).toEqual([{ group: 'free', block: notesBlock('Method.', null, 'en') }]);
		expect(noScoreBlocks('', 'en')).toEqual([]);
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

describe('L6, INPUT and VOICE in the blank page\u2019s squircle (lane 78)', () => {
	/* The equality test that stood here (`line === T('insights.silence.noScore')` in `SingerBlock.svelte`) found one link in one string. `BlankState` finds every
	   section name in a sentence by position (`components/Paper/blank-state.ts`), so the sentence may carry INPUT and VOICE, and it is replaced, not added to. */
	const html = (language: 'en' | 'fr', key: string, links?: InsightsLinks) =>
		render(BlankState, { props: { language, accent: 'var(--rose)', ink: 'var(--rose-ink)', frame: blankFrame(0, 0), paragraphs: [t(key, language)], links } as never }).body;
	const text = (h: string) => h.replace(/<!--.*?-->/gs, '').replace(/<[^>]*>/g, '').trim();
	it('reads, with the markup taken away, as the one string, in both languages, with or without links', () => {
		for (const lang of ['en', 'fr'] as const) for (const key of ['insights.silence.noScore', 'insights.silence.noBoth', 'insights.silence.noVoice']) {
			expect(text(html(lang, key, { input: () => {}, voice: () => {} })), lang + key).toBe(t(key, lang));
			expect(text(html(lang, key)), lang + key).toBe(t(key, lang));
		}
	});
	it('makes INPUT / ENTRÉE and VOICE / VOIX buttons, and only when the page gives the link', () => {
		expect(html('en', 'insights.silence.noScore', { input: () => {} })).toMatch(/<button[^>]*>INPUT<\/button>/);
		expect(html('fr', 'insights.silence.noScore', { input: () => {} })).toMatch(/<button[^>]*>ENTRÉE<\/button>/);
		expect(html('en', 'insights.silence.noBoth', { input: () => {}, voice: () => {} }).match(/<button/g)).toHaveLength(2);
		expect(html('fr', 'insights.silence.noBoth', { input: () => {}, voice: () => {} })).toMatch(/<button[^>]*>VOIX<\/button>/);
		expect(html('en', 'insights.silence.noBoth', { input: () => {} }).match(/<button/g)).toHaveLength(1);
		expect(html('en', 'insights.silence.noScore')).not.toContain('<button');
	});
	it('SingerBlock no longer reaches for the link: a silence line is plain text', () => {
		const other = { kind: 'silence', lines: [t('insights.silence.unmeasured', 'en')] } as never;
		expect(render(SingerBlock, { props: { block: other, language: 'en', width: 600, links: { input: () => {} } } as never }).body).not.toContain('<button');
		expect(readFileSync('src/lib/insights/SingerBlock.svelte', 'utf8')).not.toContain('withInput');
	});
});
