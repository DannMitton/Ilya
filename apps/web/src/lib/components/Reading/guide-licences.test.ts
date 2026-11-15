/**
 * GUIDE's Licences paragraphs (closing polish lane). Step 6: the Fonts sentence names the four families Ilya now serves from its own
 * site (RATIFIED by Dann 2026-11-11 23:38). Each sentence is read from the rendered GUIDE, so what a singer reads is what is pinned.
 */
import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import GuideContent from './GuideContent.svelte';

const text = (language: 'en' | 'fr') =>
	render(GuideContent, { props: { language } }).body.replace(/<!--.*?-->/gs, '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

describe('GUIDE, Licences: the Fonts sentence', () => {
	it('English names the four families after Lato', () => {
		expect(text('en')).toContain('; Lato, © 2010–2014 tyPoland Łukasz Dziedzic; Source Sans 3, © 2010–2020 Adobe; Source Serif 4, © 2014 The Source Serif 4 Project Authors; Noto Sans, © 2022 The Noto Project Authors; and Noto Serif, © 2022 The Noto Project Authors.');
	});
	it('French names the four families after Lato, with « et » before the last', () => {
		expect(text('fr')).toContain('; Lato, © 2010–2014 tyPoland Łukasz Dziedzic; Source Sans 3, © 2010–2020 Adobe; Source Serif 4, © 2014 The Source Serif 4 Project Authors; Noto Sans, © 2022 The Noto Project Authors; et Noto Serif, © 2022 The Noto Project Authors.');
	});
	it('keeps the rest of each sentence, the French no-break space before its colon included', () => {
		expect(text('en')).toContain('each licence text is distributed with the font files: Bravura, © 2015 Steinberg Media Technologies GmbH; Leland, © 2025 MuseScore BVBA; Finale Maestro, © 2021 MakeMusic, Inc.');
		expect(text('fr')).toContain('distribué avec les fichiers de police : Bravura, © 2015 Steinberg Media Technologies GmbH; Leland, © 2025 MuseScore BVBA; Finale Maestro, © 2021 MakeMusic, Inc.');
	});
});

/* Step 9b (RATIFIED by Dann 2026-11-11 23:02 EN, 23:03 FR): the Licences paragraph names the poem sources, before the LiederNet sentence. English takes ’ and “ ” as the
   section does; French takes a literal U+00A0 before the colon and inside the guillemets (Amendment 15). */
describe('GUIDE, Licences: the Texts paragraph names the poem sources', () => {
	const EN = 'The poems and arias in Ilya’s library are in the public domain. Each library card names the site its text was taken from and links to that text: Russian Wikisource, operalib.eu, Maxim Moshkov’s Library (az.lib.ru), the Fundamental Electronic Library “Russian Literature and Folklore” (feb-web.ru), the Russian Virtual Library (rvb.ru), and ilibrary.ru. Ilya thanks the volunteers and editors who keep these texts free to read.';
	const FR = 'Les poèmes et les airs de la bibliothèque d’Ilya appartiennent au domaine public. Chaque fiche de la bibliothèque nomme le site d’où provient son texte et renvoie à ce texte : Wikisource en russe, operalib.eu, la Bibliothèque de Maxime Mochkov (az.lib.ru), la Bibliothèque électronique fondamentale « Littérature et folklore russes » (feb-web.ru), la Bibliothèque virtuelle russe (rvb.ru) et ilibrary.ru. Ilya remercie les bénévoles et les éditeurs qui gardent ces textes en libre lecture.';
	it('English, at the start of the paragraph, before the LiederNet sentence', () => {
		expect(text('en')).toContain(`Texts. ${EN} Test texts were drawn from The LiederNet Archive`);
	});
	it('French, at the start of the paragraph, before the LiederNet sentence', () => {
		expect(text('fr')).toContain(`Textes. ${FR} Les textes d’essai proviennent du LiederNet Archive`);
	});
	it('puts Ilya in italics, and keeps the apostrophe of « d’Ilya » outside them', async () => {
		const raw = (await import('node:fs')).readFileSync(new URL('./GuideContent.svelte', import.meta.url), 'utf8');
		expect(raw).toContain('la bibliothèque d’<em>Ilya</em> appartiennent');
		expect(raw).toContain('in <em>Ilya</em>’s library');
		const frParagraph = raw.slice(raw.indexOf('<strong>Textes.</strong>'), raw.indexOf('Les textes d’essai proviennent du'));
		expect(frParagraph).not.toContain('&nbsp;'); // a literal U+00A0, not an entity
		expect(frParagraph).toContain('texte\u00a0: Wikisource');
	});
});
