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
