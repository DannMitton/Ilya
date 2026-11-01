/**
 * QUEUE row 163 step 8 (Dann 2026-10-30 14:55): Learn opens as Guide does: the tab's name as `<h1>`, then a band holding
 * the existing title as `<h2 id="learn-title">` and a one-sentence deck (ratified 14:59 EN, 15:00 FR).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from 'svelte/server';
import LearnContent from './LearnContent.svelte';
import GuideContent from './GuideContent.svelte';

const html = (C: typeof LearnContent | typeof GuideContent, language: 'en' | 'fr') => render(C, { props: { language } }).body.replace(/<!--.*?-->/gs, '');
const opening = (h: string) => /^\s*(<h1[^>]*>.*?<\/h1>)\s*(<div class="chapter-band[^"]*">.*?<\/div>\s*<\/div>)/s.exec(h);

describe('Learn opens as Guide does', () => {
	it.each([
		['en', 'Learn', 'Russian Lyric Diction for Singers', "Grayson's rules for Russian lyric diction, taught so you can access Russian vocal literature on your own."],
		['fr', 'Leçons', 'La diction lyrique russe pour chanteuses et chanteurs', 'Les règles de Grayson pour la diction lyrique russe, enseignées pour que vous puissiez aborder par vous-même le répertoire vocal russe.'],
	] as const)('%s: <h1>, then a band-learn holding the title as h2#learn-title and the ratified deck', (language, h1, title, deck) => {
		const m = opening(html(LearnContent, language));
		expect(m, 'the opening').not.toBeNull();
		expect(m![1]).toBe(`<h1>${h1}</h1>`);
		expect(m![2]).toContain('class="chapter-band band-learn"');
		expect(m![2]).toContain(`<h2 id="learn-title">${title}</h2>`);
		expect(m![2]).toContain(`<div class="band-deck">${deck}</div>`);
	});

	it('has the same shape as Guide’s opening, with band-guide in place of band-learn', () => {
		const shape = (h: string) => opening(h)![2].replace(/<h2[^>]*>.*?<\/h2>/s, '<h2/>').replace(/<div class="band-deck">.*?<\/div>/s, '<deck/>');
		expect(shape(html(LearnContent, 'en')).replace('band-learn', 'band-guide')).toBe(shape(html(GuideContent, 'en')));
	});

	it('keeps exactly one learn-title, on the h2', () => {
		for (const language of ['en', 'fr'] as const) expect(html(LearnContent, language).match(/id="learn-title"/g)).toHaveLength(1);
	});

	it('is still read by the table of contents and the scroll-spy through that id', () => {
		const drawer = readFileSync(join(__dirname, '../Drawer/Drawer.svelte'), 'utf8');
		expect(drawer).toContain("data-heading-id=\"learn-title\"");
		expect(readFileSync(join(__dirname, '../../../routes/+page.svelte'), 'utf8')).toMatch(/learn-|startsWith\('learn/);
	});
});
