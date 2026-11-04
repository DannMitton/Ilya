/**
 * The tab name on Text's pages names what the page prints (step 7, part 2; Dann 2026-11-03 20:17 to 20:19: "they must
 * correspond"; strings ratified 20:21). The state table of Fable's review (r1, amendment 9) runs through the real
 * `shownWitness`, so the label follows what `+page.svelte` transcribes and nothing else.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { t } from '$lib/i18n';
import type { InputView } from './input-views.svelte';
import { textTabKey } from './text-header';
import { shownWitness } from './witness-lines';

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');

/** The label a page carries for a state: Lyrics and Poem hold text or not, differ or not, and the TEXT pair is on `choice`. */
function label(lyricsHas: boolean, poemHas: boolean, differ: boolean, choice: InputView, language: 'en' | 'fr') {
	const shown = shownWitness(lyricsHas, poemHas, differ, choice);
	const hasLines = lyricsHas || poemHas;
	return t(textTabKey(shown, hasLines), language);
}

const NB = ' ';
const STATES: { name: string; args: [boolean, boolean, boolean, InputView]; en: string; fr: string }[] = [
	{ name: 'Lyrics only', args: [true, false, false, 'lyrics'], en: 'TEXT: LYRICS', fr: `TEXTE${NB}: PAROLES` },
	{ name: 'Poem only, INPUT on LYRICS (Text prints the poem)', args: [false, true, false, 'lyrics'], en: 'TEXT: POEM', fr: `TEXTE${NB}: POÈME` },
	{ name: 'Poem only, INPUT on POEM', args: [false, true, false, 'poem'], en: 'TEXT: POEM', fr: `TEXTE${NB}: POÈME` },
	{ name: 'both and the same (no pair offered; a kept library poem identical to her lyrics)', args: [true, true, false, 'poem'], en: 'TEXT: LYRICS', fr: `TEXTE${NB}: PAROLES` },
	{ name: 'both, different, the pair on LYRICS', args: [true, true, true, 'lyrics'], en: 'TEXT: LYRICS', fr: `TEXTE${NB}: PAROLES` },
	{ name: 'both, different, the pair on POEM', args: [true, true, true, 'poem'], en: 'TEXT: POEM', fr: `TEXTE${NB}: POÈME` },
	{ name: 'a POEM view with an empty POEM (the page prints Lyrics)', args: [true, false, false, 'poem'], en: 'TEXT: LYRICS', fr: `TEXTE${NB}: PAROLES` },
	{ name: 'nothing entered: the page prints no text, so the bare tab name', args: [false, false, false, 'lyrics'], en: 'TEXT', fr: 'TEXTE' },
	{ name: 'nothing entered, the pair remembered on POEM', args: [false, false, false, 'poem'], en: 'TEXT', fr: 'TEXTE' },
];

describe('the running head names the text the page prints', () => {
	for (const s of STATES) {
		it(`${s.name}: ${s.en} / ${s.fr}`, () => {
			expect(label(...s.args, 'en')).toBe(s.en);
			expect(label(...s.args, 'fr')).toBe(s.fr);
		});
	}

	it('the ratified strings, copied from the brief and not read back out of the table', () => {
		expect(t('paper.headerPoem', 'en')).toBe('TEXT: POEM');
		expect(t('paper.headerPoem', 'fr')).toBe(`TEXTE${NB}: POÈME`);
		expect(t('paper.headerLyrics', 'en')).toBe('TEXT: LYRICS');
		expect(t('paper.headerLyrics', 'fr')).toBe(`TEXTE${NB}: PAROLES`);
		expect(t('tab.text', 'en')).toBe('TEXT');
		expect(t('tab.text', 'fr')).toBe('TEXTE');
	});

	it('the MELODY and INSIGHTS heads are unchanged', () => {
		expect(t('tab.markedScore', 'en')).toBe('MELODY');
		expect(t('tab.insights', 'en')).toBe('INSIGHTS');
	});
});

describe('the label is driven from `shown`, through one prop, and from nothing else', () => {
	const page = read('../../routes/+page.svelte');
	const paper = read('../components/Paper/Paper.svelte');
	const title = read('../components/Paper/TitlePage.svelte');
	const next = read('../components/Paper/SubsequentPage.svelte');

	it('+page passes `shown`, the value textLines branches on, to Paper', () => {
		expect(page).toContain('const shown = $derived(shownWitness(');
		expect(page).toMatch(/const textLines = \$derived\(shown === 'poem'/);
		expect(page).toMatch(/<Paper lines=\{effectiveLines\} witness=\{shown\}/);
	});

	it('Paper hands it to both Text pages, with whether the document has any line', () => {
		expect(paper.match(/\{witness\}/g)).toHaveLength(2);
		expect(paper.match(/documentHasLines=\{lines\.length > 0\}/g)).toHaveLength(2);
	});

	it('both pages derive the name from it, and neither reads INPUT’s view or the remembered choice', () => {
		for (const src of [title, next]) {
			expect(src).toContain('const tabName = $derived(t(textTabKey(witness, documentHasLines), language));');
			expect(src).not.toContain('inputViews');
			expect(src).not.toContain('witnessChoice');
		}
	});
});
