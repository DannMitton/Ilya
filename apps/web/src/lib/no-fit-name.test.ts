import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { stringKeys, t } from './i18n';

/**
 * QUEUE row 97. The old name "Fit" leaves everything a singer reads.
 *
 * The documents are Text, Markup, and Insights (N.174; French Texte,
 * Annotation, Aperçus). Dann, 2026-10-14 16:39: "Fit keeps cropping up and it
 * needs to be rectified." This guard fails if the old name returns, as a word
 * (case-sensitive, word-bounded, so also inside <em>Fit</em>), in any i18n.ts
 * value or in the Guide in either language.
 *
 * Method for the Guide: read the component as source, as french-italics.test.ts
 * and i18n.test.ts do (rendering a Svelte component is not how this tree's
 * Guide tests work), strip <!-- --> comments (the file's comments carry "Fit"
 * as history), split at `{#if language === 'fr'}` and `{:else}`, and strip
 * <figcaption>.
 *
 * KNOWN EXCEPTIONS, listed so they cannot grow quietly: the two <figcaption>
 * elements that describe the old screenshots (guide-step-01.webp) and still
 * say "Transcription, Fit, Learn, and Guide". Row 97 section 2 measures them;
 * the desk drafts new captions for Dann's ruling in a later row.
 */
const FIT = /\bFit\b/;
const KNOWN_FIGCAPTION_LINES = [94, 381];

/** Keys kept on purpose, exempt by name (N.145; IntakePanel.svelte records it). Neither is drawn. */
const EXEMPT_KEYS = ['input.transcribe', 'input.transcribeLoading'];

const guide = readFileSync(new URL('./components/Reading/GuideContent.svelte', import.meta.url), 'utf8');
const stripComments = (s: string) => s.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ''));
const stripFigcaptions = (s: string) => s.replace(/<figcaption>[\s\S]*?<\/figcaption>/g, (m) => m.replace(/[^\n]/g, ''));

const frStart = guide.indexOf("{#if language === 'fr'}");
const frEnd = guide.indexOf('{:else}', frStart);
const branches = {
	fr: guide.slice(frStart, frEnd),
	en: guide.slice(0, frStart) + guide.slice(frEnd),
};

describe('row 97: the old name "Fit" is not in anything a singer reads', () => {
	it('the check finds what it is looking for', () => {
		expect(FIT.test('<em>Fit</em> forecasts')).toBe(true);
		expect(FIT.test('Fit’s analysed score')).toBe(true);
		expect(FIT.test('Transcription, Fit, Learn')).toBe(true);
		expect(FIT.test('a good fit for you')).toBe(false);
		expect(FIT.test('Fitzgerald, Profit')).toBe(false);
	});

	it.each(['en', 'fr'] as const)('no i18n.ts value says Fit in %s', (lang) => {
		const hits = stringKeys()
			.filter((k) => !EXEMPT_KEYS.includes(k))
			.filter((k) => FIT.test(t(k, lang)));
		expect(hits).toEqual([]);
	});

	it('the exempt keys still exist, so the exemption is not vacuous', () => {
		const keys = stringKeys();
		for (const k of EXEMPT_KEYS) expect(keys).toContain(k);
	});

	it.each(['en', 'fr'] as const)('the %s Guide, comments and figcaptions aside, never says Fit', (lang) => {
		const text = stripFigcaptions(stripComments(branches[lang]));
		const lines = text.split('\n');
		const hits = lines.map((l, i) => ({ l, i })).filter(({ l }) => FIT.test(l)).map(({ l, i }) => `${i + 1}: ${l.trim().slice(0, 80)}`);
		expect(hits).toEqual([]);
	});

	it('the only figcaptions that still say Fit are the two the row measures for a later ruling', () => {
		const lines = guide.split('\n');
		const found: number[] = [];
		let open = false;
		lines.forEach((l, i) => {
			if (l.includes('<figcaption')) open = true;
			if (open && FIT.test(l)) found.push(i + 1);
			if (l.includes('</figcaption>')) open = false;
		});
		for (const n of found) expect(KNOWN_FIGCAPTION_LINES, `figcaption at line ${n}`).toContain(n);
	});

	it('the Guide heading for the forecast reads as ruled, in both languages, and keeps its id', () => {
		expect(branches.en).toContain('<h4 id="guide-markup-forecast">What Insights forecasts</h4>');
		expect(branches.fr).toContain('<h4 id="guide-markup-forecast">Ce que prévoient les Aperçus</h4>');
		expect(guide).not.toContain('it does not declare');
		expect(guide).not.toContain('ils ne déclarent pas');
	});

	it('is not vacuous: each branch is long and names the documents', () => {
		expect(branches.en.length).toBeGreaterThan(5000);
		expect(branches.fr.length).toBeGreaterThan(5000);
		expect(branches.en).toContain('Insights');
		expect(branches.fr).toContain('Aperçus');
	});
});

/* The three ratified passages (docs/sessions/ratified-guide-abc_2026-10-14.md,
   ratified by Dann 2026-10-14 21:40), pinned by their opening and closing words
   as the Guide writes them: U+2019 apostrophes, U+00A0 before French colons. */
describe('row 97: the three ratified Guide passages are seated', () => {
	const pins: Array<[string, 'en' | 'fr', string]> = [
		['A', 'en', 'From a handful of fry samples on a consumer mic, <em>Ilya</em> measures your resonances, and Insights forecasts how a piece of repertoire is likely to meet your voice'],
		['A', 'en', 'equipping you with specific challenges to bring to your teacher.</p>'],
		['A', 'fr', 'À partir d’une poignée d’échantillons en friture vocale sur un micro grand public, <em>Ilya</em> mesure vos résonances, et les Aperçus prévoient comment'],
		['A', 'fr', 'le rapport de la pièce à votre <em>zona di passaggio</em>'],
		['A', 'fr', 'des défis précis à aborder avec votre professeure ou professeur.</p>'],
		['B', 'en', 'Markup draws its notation conventions from Mitton (2020, Appendices B and C).'],
		['B', 'en', 'The text underlay offers the same IPA values imported from Text that correspond with the Cyrillic lyrics.</p>'],
		['B', 'fr', 'L’Annotation tire ses conventions de notation de Mitton (2020, annexes B et C).'],
		['B', 'fr', 'Sous la portée, le texte reprend les mêmes valeurs API, importées du Texte, en regard des paroles cyrilliques.</p>'],
		['C', 'en', '<em>Ilya</em>’s main phonological authority, used with Grayson’s generous consent. Markup and Insights implement an open and close timbre markup'],
		['C', 'en', 'an <em>f</em><sub>R1</sub>/<em>f</em><sub>o</sub> crossing analysis, and sung-vowel modification advice.</p>'],
		['C', 'fr', 'principale autorité phonologique d’<em>Ilya</em>, utilisée avec le généreux consentement de Grayson. L’Annotation et les Aperçus mettent en œuvre'],
		['C', 'fr', 'des croisements <em>f</em><sub>R1</sub>/<em>f</em><sub>o</sub> et des conseils de modification vocalique.</p>']
	];
	it.each(pins)('passage %s (%s) carries %#', (_p, lang, text) => {
		expect(branches[lang]).toContain(text);
	});
	it('the French colons in A and B take U+00A0 before them', () => {
		expect(branches.fr).toContain('susceptible de solliciter votre voix : où le timbre');
		expect(branches.fr).toContain('est sémantique : hampe vers le bas');
		expect(branches.fr).toContain('chaque voyelle chantée : pleines lorsque');
	});
	it('the struck attribution is gone from C', () => {
		for (const lang of ['en', 'fr'] as const) {
			const para = branches[lang].match(/<p><strong>(?:Scholarship|Recherche savante)\.<\/strong>[^\n]*<\/p>/)?.[0] ?? '';
			expect(para.length, lang).toBeGreaterThan(200);
			expect(para, lang).not.toContain('Sung Russian');
		}
	});
});
