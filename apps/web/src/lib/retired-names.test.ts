import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { stringKeys, t } from './i18n';
import { CONCEPTS, type RetiredWord, type Surface } from './names';

/**
 * THE RETIRED NAMES LEAVE EVERYTHING A SINGER READS, AND THE CONTRIBUTORS' LEGEND.
 *
 * Consistency batch 2, step 4. This was `no-fit-name.test.ts` (QUEUE row 97,
 * Dann 2026-10-14 16:39: "Fit keeps cropping up and it needs to be rectified"),
 * which kept one retired name out of `i18n.ts` and the Guide. It now reads
 * every record's `retired` patterns from `names.ts` and fails on any of them
 * on these surfaces:
 *
 * 1. `i18n`: every `i18n.ts` value. A pattern applies to the values of its own
 *    language (`en` to English, `fr` to French).
 * 2. `learn`: `LearnContent.svelte`, each language branch alone, comments
 *    stripped, by the same rule.
 * 3. `legend`: `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `ARCHITECTURE.md`.
 *    These are English but quote French, so EVERY pattern applies to them.
 *
 * A pattern that sets `surfaces` is read only on those; all of them when it
 * does not.
 *
 * THE GUIDE is read for one pattern only until row 171 (`GUIDE_UNTIL_ROW_171`
 * below): `\bFit\b`, with today's two figcaption exceptions. The Guide has 36
 * hits across 16 patterns, which row 171 cleans. Row 171 deletes that
 * constant, adds the `guide` surface, and reads every pattern.
 *
 * The ratified Guide passages this file once pinned now live in
 * `insights/ratified-lines.test.ts`, with the Guide pins already there.
 *
 * METHOD for a Svelte component: read it as source (as `french-italics.test.ts`
 * and `i18n.test.ts` do; rendering is not how this tree tests prose), strip
 * `<!-- -->` comments, which carry the retired names as history, and split at
 * `{#if language === 'fr'}` and `{:else}`.
 */

/** Keys kept on purpose, exempt by name, each with its reason. Batch 4 removes the keys and these entries together. */
const EXEMPT_KEYS: Record<string, string> = {
	'input.transcribe': 'Unread: the retired button label, kept by N.145 (IntakePanel.svelte records it). Not drawn.',
	'input.transcribeLoading': 'Unread: the retired button label while loading, kept with input.transcribe. Not drawn.',
	'meta.heading': 'Unread: the retired section name « Métadonnées » / "Metadata" (audit A.3; batch 1 review amendment 17).',
};

/**
 * Lines in the legend that state history or quote another document's own word. Keyed by the file and a substring
 * the line contains, never a line number (a number goes stale on the next edit). Each must match exactly one line:
 * a substring that matches none is stale, and one that matches two has stopped being an exception for one line.
 * The list cannot grow quietly: it is this array, and the test below pins its length.
 */
const LEGEND_FILES = ['README.md', 'CONTRIBUTING.md', 'AGENTS.md', 'ARCHITECTURE.md'] as const;
const LEGEND_EXCEPTIONS: ReadonlyArray<{ file: (typeof LEGEND_FILES)[number]; contains: string; why: string }> = [
	{ file: 'AGENTS.md', contains: 'shown on screen as Fit until 2026-09', why: 'History: the codename era and the N.174 rename, with today\'s names added.' },
	{ file: 'ARCHITECTURE.md', contains: 'shown on screen as Fit until 2026-09', why: 'History: the same sentence, as the architecture records it.' },
	{ file: 'AGENTS.md', contains: 'paraphrase-then-*Fit:*', why: "The Gould extraction's own label for its interpretation line, quoted; not the document." },
];

/* Named by their words, not their line numbers (the list of numbers goes stale on every edit). */
const KNOWN_FIGCAPTIONS = ['Transcription, Fit, Leçons et Guide', 'Transcription, Fit, Learn, and Guide'];

/** Row 171 deletes this: until then the Guide is read for `Fit` alone, so it is never less guarded than before. */
const GUIDE_UNTIL_ROW_171 = /\bFit\b/;

type Lang = 'en' | 'fr';

interface Pattern {
	conceptId: string;
	re: RegExp;
	source: string;
	language: Lang;
	kind: RetiredWord['kind'];
	surfaces?: readonly Surface[];
}

const PATTERNS: Pattern[] = CONCEPTS.flatMap((c) =>
	c.retired.map((r) => ({ conceptId: c.id, re: new RegExp(r.pattern, 'u'), source: r.pattern, language: r.language, kind: r.kind, surfaces: r.surfaces })),
);

const readsOn = (p: Pattern, surface: Surface) => !p.surfaces || p.surfaces.includes(surface);

/** The patterns among `patterns` that match `text`, as `conceptId: pattern`. */
function retiredIn(text: string, patterns: readonly Pattern[]): string[] {
	return patterns.filter((p) => p.re.test(text)).map((p) => `${p.conceptId}: ${p.source}`);
}

const root = (rel: string) => new URL(`../../../../${rel}`, import.meta.url);
const stripComments = (s: string) => s.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ''));
const stripFigcaptions = (s: string) => s.replace(/<figcaption>[\s\S]*?<\/figcaption>/g, (m) => m.replace(/[^\n]/g, ''));

/** A component with one `{#if language === 'fr'} ... {:else} ... {/if}`: the French branch and the rest. */
function branchesOf(source: string): Record<Lang, string> {
	const frStart = source.indexOf("{#if language === 'fr'}");
	const frEnd = source.indexOf('{:else}', frStart);
	return { fr: source.slice(frStart, frEnd), en: source.slice(0, frStart) + source.slice(frEnd) };
}

const learn = branchesOf(readFileSync(new URL('./components/Reading/LearnContent.svelte', import.meta.url), 'utf8'));
const guide = branchesOf(readFileSync(new URL('./components/Reading/GuideContent.svelte', import.meta.url), 'utf8'));
const guideSource = readFileSync(new URL('./components/Reading/GuideContent.svelte', import.meta.url), 'utf8');

/** A legend file's lines, with the Names table's `retired` cell blanked: that cell quotes the retired words on purpose, and `names-table.test.ts` keeps it equal to `names.ts`. */
function legendLines(file: string): string[] {
	const lines = readFileSync(root(file), 'utf8').split('\n');
	if (file !== 'ARCHITECTURE.md') return lines;
	let inNames = false;
	return lines.map((line) => {
		if (line.startsWith('## ')) inNames = line === '## Names';
		return inNames && line.startsWith('|') ? line.replace(/\|[^|]*\|\s*$/, '|') : line;
	});
}

/** Legend lines that hold a retired name and are not an excepted line, as `file:line text`. */
function legendHits(file: string, lines: readonly string[], exceptions: typeof LEGEND_EXCEPTIONS = LEGEND_EXCEPTIONS): string[] {
	const patterns = PATTERNS.filter((p) => readsOn(p, 'legend'));
	const excepted = exceptions.filter((e) => e.file === file).map((e) => e.contains);
	return lines
		.map((l, i) => ({ l, i }))
		.filter(({ l }) => !excepted.some((e) => l.includes(e)))
		.flatMap(({ l, i }) => retiredIn(l, patterns).map((hit) => `${file}:${i + 1} [${hit}] ${l.trim().slice(0, 80)}`));
}

describe('the retired-name check itself', () => {
	const bare: Pattern = { conceptId: 'x', re: /\bFit\b/u, source: '\\bFit\\b', language: 'en', kind: 'bare' };
	const phrase: Pattern = { conceptId: 'y', re: /the Paper/u, source: 'the Paper', language: 'en', kind: 'phrase' };

	it('finds what it is looking for, and passes what it should', () => {
		expect(retiredIn('<em>Fit</em> forecasts', [bare])).toHaveLength(1);
		expect(retiredIn('Transcription, Fit, Learn', [bare])).toHaveLength(1);
		expect(retiredIn('a good fit for you', [bare])).toEqual([]);
		expect(retiredIn('Fitzgerald, Profit', [bare])).toEqual([]);
		expect(retiredIn('the Paper GUI', [phrase])).toHaveLength(1);
		expect(retiredIn('a paper document, the page', [phrase])).toEqual([]);
	});

	it('reads a pattern on the surfaces it names, and on all when it names none', () => {
		const onlyGuide: Pattern = { ...bare, surfaces: ['guide'] };
		expect(readsOn(bare, 'legend')).toBe(true);
		expect(readsOn(onlyGuide, 'legend')).toBe(false);
		expect(readsOn(onlyGuide, 'guide')).toBe(true);
	});

	it('the Names table loses its retired cell and nothing else', () => {
		expect('| text | `tab.text` | TEXT | TEXTE | `text` | `x/` | `the Paper`, `Markup` |'.replace(/\|[^|]*\|\s*$/, '|')).toBe(
			'| text | `tab.text` | TEXT | TEXTE | `text` | `x/` |',
		);
	});
});

describe('no retired name is in anything a singer reads', () => {
	it.each(['en', 'fr'] as const)('no i18n.ts value says a retired %s name', (lang) => {
		const patterns = PATTERNS.filter((p) => p.language === lang && readsOn(p, 'i18n'));
		const hits = stringKeys()
			.filter((k) => !(k in EXEMPT_KEYS))
			.flatMap((k) => retiredIn(t(k, lang), patterns).map((h) => `${k} [${h}]`));
		expect(hits).toEqual([]);
	});

	it('the exempt keys still exist, so the exemption is not vacuous', () => {
		const keys = stringKeys();
		for (const k of Object.keys(EXEMPT_KEYS)) expect(keys).toContain(k);
	});

	it.each(['en', 'fr'] as const)('LEARN, %s branch, comments aside, says no retired name', (lang) => {
		const patterns = PATTERNS.filter((p) => p.language === lang && readsOn(p, 'learn'));
		const lines = stripComments(learn[lang]).split('\n');
		const hits = lines.flatMap((l, i) => retiredIn(l, patterns).map((h) => `${i + 1} [${h}] ${l.trim().slice(0, 80)}`));
		expect(hits).toEqual([]);
	});

	it.each(LEGEND_FILES)('%s says no retired name outside its excepted history lines', (file) => {
		expect(legendHits(file, legendLines(file))).toEqual([]);
	});

	it('every legend exception matches exactly one line, so none is stale or loose', () => {
		for (const e of LEGEND_EXCEPTIONS) {
			const matching = legendLines(e.file).filter((l) => l.includes(e.contains));
			expect(matching.length, `${e.file}: "${e.contains}"`).toBe(1);
		}
	});

	it('the legend exception list holds the three it held when written', () => {
		expect(LEGEND_EXCEPTIONS).toHaveLength(3);
		for (const e of LEGEND_EXCEPTIONS) expect(e.why.length).toBeGreaterThan(20);
	});

	it.each(['en', 'fr'] as const)('the %s Guide, comments and figcaptions aside, never says Fit (until row 171 reads every pattern)', (lang) => {
		const text = stripFigcaptions(stripComments(guide[lang]));
		const hits = text
			.split('\n')
			.map((l, i) => ({ l, i }))
			.filter(({ l }) => GUIDE_UNTIL_ROW_171.test(l))
			.map(({ l, i }) => `${i + 1}: ${l.trim().slice(0, 80)}`);
		expect(hits).toEqual([]);
	});

	it('the only Guide figcaptions that still say Fit are the two a later ruling replaces', () => {
		const found = [...stripComments(guideSource).matchAll(/<figcaption>[\s\S]*?<\/figcaption>/g)].map((m) => m[0]).filter((c) => GUIDE_UNTIL_ROW_171.test(c));
		expect(found.length).toBeLessThanOrEqual(KNOWN_FIGCAPTIONS.length);
		for (const c of found) expect(KNOWN_FIGCAPTIONS.some((k) => c.includes(k)), c.slice(0, 80)).toBe(true);
	});

	it('is not vacuous: each surface is long and names what it should', () => {
		const i18nText = (lang: Lang) => stringKeys().map((k) => t(k, lang)).join('\n');
		expect(i18nText('en').length).toBeGreaterThan(5000);
		expect(i18nText('en')).toContain('INSIGHTS');
		expect(i18nText('fr')).toContain('APERÇUS');
		for (const lang of ['en', 'fr'] as const) {
			expect(learn[lang].length, `LEARN ${lang}`).toBeGreaterThan(5000);
			expect(learn[lang], `LEARN ${lang}`).toContain('Grayson');
			expect(guide[lang].length, `GUIDE ${lang}`).toBeGreaterThan(5000);
		}
		expect(guide.en).toContain('Insights');
		expect(guide.fr).toContain('Aperçus');
		for (const file of LEGEND_FILES) {
			const text = legendLines(file).join('\n');
			expect(text.length, file).toBeGreaterThan(5000);
			expect(/INSIGHTS|APERÇUS/.test(text), file).toBe(true);
		}
	});

	it('the patterns it reads are the whole record: every retired word of every concept', () => {
		expect(PATTERNS).toHaveLength(CONCEPTS.reduce((n, c) => n + c.retired.length, 0));
		expect(PATTERNS.length).toBeGreaterThan(10);
	});

	it('a retired word planted in a legend line is caught (the control the plants rely on)', () => {
		const lines = legendLines('README.md');
		expect(legendHits('README.md', [...lines, 'Markup lays a score beside it.'])).toHaveLength(1);
		expect(legendHits('README.md', [...lines, 'the Paper GUI prints.'])).toHaveLength(1);
		expect(legendHits('README.md', [...lines, 'a markup language, the page'])).toEqual([]);
	});
});
