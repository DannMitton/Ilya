/**
 * LANE 78: THE BLANK STATES OF TEXT, MELODY, AND INSIGHTS (brief `docs/sessions/brief-code-lane78-blank-states_r3_2026-11-21.md`, step 6).
 *
 * The words are `docs/sessions/ratified-blank-state-blurbs_2026-11-19.md`, with its correction block of 2026-11-20. The pages themselves are drawn in the
 * browser (`e2e/core-loop.test.ts`, `e2e/singer-paths.test.ts`, `e2e/insights-no-score.test.ts`, `e2e/insights-links.test.ts`); what this file pins is what a
 * vitest can reach: the strings, the one component every page draws, what no longer exists, and the rules that live in source.
 *
 * LANE 79 (QUEUE row 201): the window the three squircles are centred in is ONE frame, `blankFrame` in `page-config.ts`, computed once in each pane and
 * handed to the component whole. The pins below fail if any one of the three goes back to computing its own.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { stringKeys, t } from '$lib/i18n';
import { GAP, HEADER_GAP, MARGINS, blankFrame } from '$lib/page-config';

const read = (p: string) => readFileSync(p, 'utf8');
const SRC = 'src';
/** The `<BlankState ... >` opening tag of a source file: scanned to the first `>` outside braces, since INSIGHTS' tag carries `>` in an attribute. */
const tagOf = (src: string): string => {
	const start = src.indexOf('<BlankState');
	let depth = 0;
	for (let i = start; i < src.length; i++) {
		if (src[i] === '{') depth++;
		else if (src[i] === '}') depth--;
		else if (src[i] === '>' && depth === 0) return src.slice(start, i + 1);
	}
	throw new Error('no BlankState tag');
};

describe('the ratified words, verbatim, in both languages', () => {
	// The apostrophes are the file's typographic ones (\u2019), as every other string in `i18n.ts` writes them.
	const WORDS: Record<string, [string, string]> = {
		'paper.blank': [
			'TEXT transcribes the words you give it, syllable by syllable, into IPA. Add your score\u2019s words as LYRICS, or its source poem as POEM, in INPUT to begin.',
			'Le TEXTE transcrit en API, syllabe par syllabe, les mots que vous lui donnez. Ajoutez le texte chanté de votre partition comme PAROLES, ou son poème source comme POÈME, dans ENTRÉE pour commencer.',
		],
		'profile.blank': ['MELODY marks your own resonances as it draws your score.', 'Le CHANT trace votre partition en y marquant vos propres résonances.'],
		'insights.blank': [
			'INSIGHTS looks at how your voice meets your score, and comments on what it finds.',
			'Les APERÇUS observent la rencontre de votre voix et de votre partition, et commentent ce qu\u2019ils y trouvent.',
		],
		'insights.silence.noScore': ['Add a score in INPUT to begin.', 'Ajoutez une partition dans ENTRÉE pour commencer.'],
		'insights.silence.noVoice': ['Set up your voice in VOICE to begin.', 'Établissez votre voix dans VOIX pour commencer.'],
		'insights.silence.noBoth': ['Set up your voice in VOICE, and add a score in INPUT, to begin.', 'Établissez votre voix dans VOIX et ajoutez une partition dans ENTRÉE pour commencer.'],
		// Section 2 of the companion's 2026-11-20 corrections (Dann 17:17) and section 3 / 4 (09:25).
		'profile.provisional.sentenceSingular': ['Your {vowels} is provisional; set it in VOICE.', 'Votre voyelle {vowels} est provisoire; réglez-la dans VOIX.'],
		'profile.provisional.sentencePlural': ['Your {vowels} are provisional; set them in VOICE.', 'Vos voyelles {vowels} sont provisoires; réglez-les dans VOIX.'],
		// The tree wins for these (the companion's correction 3 and the brief's preamble): they were already Dann's.
		'insights.method.noScore.samples': ['Method: from your resonance profile, measured in VOICE.', 'Méthode\u00a0: à partir de votre profil de résonances, mesuré dans VOIX.'],
	};
	for (const [key, [en, fr]] of Object.entries(WORDS)) {
		it(key, () => {
			expect(t(key, 'en')).toBe(en);
			expect(t(key, 'fr')).toBe(fr);
		});
	}
});

describe('what the lane retires is gone, and nothing reads it', () => {
	const RETIRED = ['paper.empty', 'paper.empty.mobile', 'profile.emptyState', 'profile.lede', 'profile.provisional.noneMessage', 'insights.method.noScore.none'];
	it('is absent from the string table', () => {
		const keys = new Set(stringKeys());
		for (const k of RETIRED) expect(keys.has(k), k).toBe(false);
		expect(keys.has('profile.emptyStateAria')).toBe(true); // the article's label stays
	});
	it('is read by no source file in the app, in code or in a comment that cites the key', () => {
		const files: string[] = [];
		const walk = (d: string) => {
			for (const n of readdirSync(d)) {
				const p = join(d, n);
				if (statSync(p).isDirectory()) walk(p);
				else if (/\.(ts|svelte)$/.test(n) && !/\.test\.ts$/.test(n) && n !== 'i18n.ts') files.push(p);
			}
		};
		walk(SRC);
		const hits = files.flatMap((f) => RETIRED.filter((k) => new RegExp(`['"\`]${k.replace(/\./g, '\\.')}['"\`]`).test(read(f))).map((k) => `${f}: ${k}`));
		expect(hits).toEqual([]);
	});
	it('leaves no device split in TEXT\u2019s blank state', () => {
		expect(read('src/lib/components/Paper/TitlePage.svelte')).not.toMatch(/isMobile|empty-directive/);
	});
});

describe('no directional word in any string the three blank pages draw', () => {
	const KEYS = [
		'paper.blank', 'profile.blank', 'insights.blank', 'insights.silence.noScore', 'insights.silence.noVoice', 'insights.silence.noBoth',
		'profile.provisional.sentenceSingular', 'profile.provisional.sentencePlural', 'profile.statusSetPlain', 'profile.statusSetMeasuredSingular', 'profile.statusSetMeasuredPlural',
		'calib.pane.belowCore', 'insights.method.noScore.samples', 'insights.method.noScore.generic', 'insights.r2.notes', 'dict.loading',
	];
	for (const lang of ['en', 'fr'] as const) {
		it(lang, () => {
			for (const k of KEYS) expect(t(k, lang), k).not.toMatch(/\b(left|right|above|below|bottom|top)\b|\bà gauche\b|\bde gauche\b|\bà droite\b|\bau bas\b|\bci-dessus\b|\bci-dessous\b|\bTIROIR\b|\bDRAWER\b|\bvolet\b|\bpane\b/i);
		});
	}
});

describe('one component, drawn once by each of the three pages', () => {
	const pages = { TEXT: 'src/lib/components/Paper/TitlePage.svelte', MELODY: 'src/lib/markup/MarkupPane.svelte', INSIGHTS: 'src/lib/insights/InsightsPane.svelte' };
	for (const [name, file] of Object.entries(pages)) {
		it(`${name} draws one BlankState`, () => {
			expect(read(file).match(/<BlankState\b/g)).toHaveLength(1);
		});
	}
	it('each has its own accent, lavender for MELODY and rose for INSIGHTS and sage for TEXT, and the squircle is INSIGHTS\u2019s', () => {
		expect(read(pages.TEXT)).toContain('accent="var(--sage)"');
		expect(read(pages.MELODY)).toContain('accent="var(--lavender)"');
		expect(read(pages.INSIGHTS)).toContain('accent="var(--rose)"');
		const b = read('src/lib/components/Paper/BlankState.svelte');
		expect(b).toMatch(/border: 1px solid var\(--accent\);\s*border-radius: 12px;\s*padding: 16px 26px;/);
		expect(b).toMatch(/font-style: normal/); // roman, not italic
		expect(b).toMatch(/text-align: left/);
		expect(b).toMatch(/grid-template-rows: 1fr auto 1fr/); // the squircle is the middle row: centred whatever sits under it
	});
	it('does not move the score\u2019s first-page window: TITLE_HEADER_GAP is still 18 and is not read by the blank state', () => {
		const m = read('src/lib/markup/MarkupPane.svelte');
		expect(m).toContain('const TITLE_HEADER_GAP = 18;');
		expect(m).toContain('const page1WindowHeight = $derived(dims.height - contentTop - contentBottom);');
		expect(tagOf(m)).not.toMatch(/contentTop|contentBottom/); // lane 79: the blank state reads neither of the score's window edges
	});
	it('the squircle\u2019s window is one frame: each page passes it whole and computes no window of its own (lane 79)', () => {
		for (const [name, file] of Object.entries(pages)) {
			const tag = tagOf(read(file));
			expect(tag, name).toMatch(/\{frame\}|frame=\{/);
			for (const banned of ['top=', 'bottom=', 'left=', 'right=', 'MARGINS', 'HEADER_GAP', 'GAP', 'TEXT_CONTENT', 'contentTop', 'contentBottom']) expect(tag, name + ' ' + banned).not.toContain(banned);
		}
	});
	it('the frame function is called once in each pane that builds a frame, and TEXT builds it from the measured footer, not the reserve', () => {
		for (const file of ['src/lib/components/Paper/Paper.svelte', pages.MELODY, pages.INSIGHTS]) expect(read(file).match(/blankFrame\(/g), file).toHaveLength(1);
		expect(read(pages.TEXT)).not.toMatch(/blankFrame\(/); // TitlePage is handed the frame by Paper
		const paper = read('src/lib/components/Paper/Paper.svelte');
		expect(paper).toContain('blankFrame(titleHeader, footerMeasured)');
		expect(paper).not.toMatch(/blankFrame\([^)]*footerReserve/);
	});
	it('TEXT\u2019s paginated bottom is unchanged: the 80 px floor and GAP stay in `Paper.svelte` (lane 79 held it)', () => {
		expect(read('src/lib/components/Paper/Paper.svelte')).toContain('const contentBottom = $derived(MARGINS.vertical + footerReserve + GAP);');
	});
});

describe('no blank state prints, and the withheld list still does', () => {
	it('the blank window is display none in print', () => {
		const b = read('src/lib/components/Paper/BlankState.svelte');
		expect(b.slice(b.lastIndexOf('@media print'))).toMatch(/\.blank-window\s*\{\s*display:\s*none/);
	});
	it('nothing hides the withheld statement or its list in print: it is the page\u2019s content when a score is present', () => {
		const notes = read('src/lib/markup/NotesColumn.svelte');
		const printBlocks = [...notes.matchAll(/@media print\s*\{([\s\S]*?)\n\t\}/g)].map((m) => m[1]).join('\n');
		expect(printBlocks).not.toMatch(/withheld/);
		const block = read('src/lib/insights/SingerBlock.svelte');
		const printCss = block.slice(block.lastIndexOf('@media print'));
		expect(printCss).not.toMatch(/withheld|silence/);
		// And the pane still hands it to the score pages: lane 78 did not touch what a score-present page shows.
		expect(read('src/lib/insights/InsightsPane.svelte')).toContain("withheld: [T('profile.withheld.item3'), T('insights.silence.findings')]");
		expect(read('src/lib/markup/MarkupPane.svelte')).toContain('withheld={showWithheld ? withheld : null}');
	});
});

describe('the VOICE link reveals the band; it does not enter the takeover', () => {
	const page = read('src/routes/+page.svelte');
	it('openVoiceBand takes openInput\u2019s path (`openBand`: leaveThen, the phone step, the reveal, the scroll to the head), and is not openVoice', () => {
		expect(page).toMatch(/const openInput = \(\) => openBand\(BAND_IDS\.input\), openVoiceBand = \(\) => openBand\(BAND_IDS\.scoreMarkup\);/);
		const fn = page.slice(page.indexOf('function openBand(id: string) {'), page.indexOf('const openInput = () =>'));
		expect(fn).toContain('leaveThen(() => {');
		expect(fn).toContain('if (isMobile) drawerRaised = true;');
		expect(fn).toContain('sections.reveal(id);');
		expect(fn).toContain('revealTarget = `[data-band-head="${id}"]`;');
		expect(fn).toContain('revealRequest += 1;');
		expect(fn).not.toMatch(/enterCalibration|calibrationRequest = \{ phase: kind/);
	});
	it('the three pages are handed the links, and the INSIGHTS and MELODY panes pass both on', () => {
		expect(page).toContain('onopeninput={openInput}');
		expect(page).toContain('links={{ input: openInput, voice: openVoiceBand }}');
		expect(page).toContain('input: openInput, voice: openVoiceBand }}');
	});
	it('the id it reveals is the band head\u2019s data-band-head value', () => {
		expect(read('src/lib/components/Drawer/sections.svelte.ts')).toContain("scoreMarkup: 'scoreMarkup',");
		expect(read('src/lib/components/Drawer/Drawer.svelte')).toContain('data-band-head={id}');
	});
});

describe('TEXT: loading is the dictionary\u2019s word alone, and quiet draws nothing', () => {
	it('TitlePage draws the blank state for `enter` and `loading`, never for `quiet`, and links INPUT only for `enter`', () => {
		const s = read('src/lib/components/Paper/TitlePage.svelte');
		expect(s).toContain("{#if !hasContent && emptyNotice !== 'quiet' && frame}"); // lane 79: and only once the frame exists (both heights measured)
		expect(s).toContain("paragraphs={[emptyNotice === 'loading' ? t('dict.loading', language) : t('paper.blank', language)]}");
		expect(s).toContain("links={emptyNotice === 'enter' ? { input: onopeninput } : {}}");
	});
});

describe('blankFrame, the window of a blank page (lane 79)', () => {
	it('puts the same gap above and below, measured at both ends, and the page margin at both sides', () => {
		expect(blankFrame(70, 66)).toEqual({ top: MARGINS.vertical + 70 + HEADER_GAP, bottom: MARGINS.vertical + 66 + HEADER_GAP, left: MARGINS.horizontal, right: MARGINS.horizontal });
		expect(blankFrame(70, 66)).toEqual({ top: 134, bottom: 130, left: 96, right: 96 });
	});
	it('has no floor: a footer smaller than the paginated footer\u2019s 80 is taken as measured', () => {
		expect(blankFrame(70, 10).bottom).toBe(MARGINS.vertical + 10 + HEADER_GAP);
		expect(GAP).toBe(8); // the paginated window keeps its own, different, gap
	});
	it('one measured header and footer give one window, whichever page asks', () => {
		expect(blankFrame(56, 66)).toEqual(blankFrame(56, 66));
		expect(blankFrame(56, 66).top).not.toBe(blankFrame(60, 66).top);
	});
});
