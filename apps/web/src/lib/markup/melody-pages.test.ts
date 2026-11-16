/**
 * Strophic lane A, Step 4a: MELODY draws the passes (brief r5, D5 and D6) on
 * `strophic-repeat.musicxml`. Markup strings and arithmetic only; the checks
 * that need a browser (`pageMetrics`, the Loupe) are `e2e/strophic-melody.test.ts`.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { analyzeScore, demoProfile, MusicXmlScoreParser, paginateScore, verseView, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { ENGRAVING_DEFAULTS } from '$lib/score/engraving';
import { buildUnderlayResolvers } from '$lib/score/vowel-resolver';
import { paginateMelody, type MelodyPages } from './melody-pages';

const prefs = { reducedVowel: false, geminate: false, shcha: false, palatalNasal: false, reconstitution: false };

async function load(name: string): Promise<ParsedScore> {
	const xml = readFileSync(new URL(`../../../../../packages/score-parser/src/fixtures/${name}`, import.meta.url), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document } as never)).score;
}

/** MELODY's call for a score: verse 1's live channels as the page derives them (no pairings), then `paginateMelody`. */
function melody(score: ParsedScore, language: 'en' | 'fr' = 'en'): MelodyPages {
	const analyzed = analyzeScore(score, demoProfile, (e) => buildUnderlayResolvers(score, 1, {}).vowel(e), { generatedAt: '2026-11-15T00:00:00.000Z' });
	const r = buildUnderlayResolvers(score, 1, {});
	const ipa: Record<string, string> = {};
	for (const e of score.vocalLine) {
		const v = r.ipa(e);
		if (v) ipa[e.id] = v;
	}
	return paginateMelody({
		score,
		analyzed,
		pageWidth: 624,
		pageHeight: 727,
		laterPageHeight: 727,
		engraving: ENGRAVING_DEFAULTS,
		channels: { ipaPreview: ipa },
		verses: { profile: demoProfile, notationPrefs: prefs, openSyllabification: false },
		language,
	});
}

const markup = (m: MelodyPages): string => m.pages.join('\n');
const attrValues = (svg: string, name: string): string[] => [...svg.matchAll(new RegExp(`\\s${name}="([^"]*)"`, 'g'))].map((x) => x[1]);
const cyrillicTexts = (svg: string): string[] => [...svg.matchAll(/<text [^>]*>([^<]*)<\/text>/g)].map((x) => x[1]).filter((t) => /\p{Script=Cyrillic}/u.test(t));

describe('MELODY on strophic-repeat.musicxml', () => {
	it('prints the three verses\' own syllables in the order they are sung', async () => {
		const s = await load('strophic-repeat.musicxml');
		const m = melody(s);
		expect(m.render.path).toBe('repeats');
		expect(m.render.score.measures).toHaveLength(23);
		const drawn = cyrillicTexts(markup(m));
		const wanted = m.render.score.vocalLine.map((e) => e.syllable?.text).filter((t): t is string => !!t && /\p{Script=Cyrillic}/u.test(t));
		expect(drawn).toEqual(wanted);
		// the first bar of each pass differs as the file has it
		const bar = (n: number) => m.render.score.vocalLine.filter((e) => e.measureIndex === n).map((e) => e.syllable?.text);
		expect(bar(3)).toEqual(['Ночь', 'ти', 'ха', 'над']);
		expect(bar(9)).toEqual(['День', 'те', 'пел', 'за']);
		expect(bar(15)).toEqual(['Мгла', 'ни', 'зка', 'на']);
	});

	it('gives each verse\'s later pass its own vowel, not verse 1\'s', async () => {
		const s = await load('strophic-repeat.musicxml');
		const m = melody(s);
		// the first note of the second passage bar (source index 4): verse 1 «ре», verse 2 «Лес», verse 3 «Дол»
		const first = (k: number) => verseView(s, k).vocalLine.filter((e) => e.measureIndex === 4)[0];
		const idOf = (k: number) => (k === 1 ? first(1).id : `${first(1).id}~v${k}`);
		const vowels = [1, 2, 3].map((k) => buildUnderlayResolvers(verseView(s, k), 1, {}).vowel(first(k)));
		expect(new Set(vowels).size).toBeGreaterThan(1);
		for (const k of [1, 2, 3]) {
			const view = verseView(s, k);
			const alone = analyzeScore(view, demoProfile, buildUnderlayResolvers(view, 1, {}).vowel);
			expect(m.analyzed.events[idOf(k)]?.eventId).toBe(idOf(k));
			expect(m.analyzed.events[idOf(k)]?.timbre).toBe(alone.events[first(k).id]?.timbre);
			expect(m.analyzed.events[idOf(k)]?.turningPitch).toEqual(alone.events[first(k).id]?.turningPitch);
		}
	});

	it('draws no live hit rectangle, event group, or mark for a later-pass event, and renames them all', async () => {
		const m = melody(await load('strophic-repeat.musicxml'));
		const svg = markup(m);
		for (const name of ['data-hit', 'data-event-id', 'data-of-event', 'data-ipa-of']) {
			expect(attrValues(svg, name).filter((v) => v.includes('~v')), name).toEqual([]);
		}
		const later = m.render.score.vocalLine.filter((e) => e.id.includes('~v'));
		expect(later).toHaveLength(48);
		expect(attrValues(svg, 'data-verse-hit').sort()).toEqual(later.map((e) => e.id).sort());
		expect(new Set(attrValues(svg, 'data-verse'))).toEqual(new Set(['2', '3']));
		// verse 1's own hit rectangles are all still live: one per event of a non-later bar
		const own = m.render.score.vocalLine.filter((e) => !e.id.includes('~v'));
		expect(attrValues(svg, 'data-hit').sort()).toEqual(own.map((e) => e.id).sort());
	});

	it('puts later-pass-only systems under data-verse-system, and a mixed system\'s data-system in source indices', async () => {
		const m = melody(await load('strophic-repeat.musicxml'));
		const bars = m.render.bars;
		const expected = m.systems.map((sys) => {
			const held = bars.slice(sys.fromMeasure, sys.toMeasure + 1);
			const own = held.filter((b) => !b.later || b.live).map((b) => b.source);
			return own.length > 0 ? `data-system="${Math.min(...own)}-${Math.max(...own)}"` : `data-verse-system="${sys.fromMeasure}-${sys.toMeasure}"`;
		});
		expect(m.systems.map((s) => s.attr)).toEqual(expected);
		const wrappers = [...markup(m).matchAll(/<svg x="[^"]*" y="[^"]*" width="[^"]*" height="[^"]*" viewBox="[^"]*" (data-(?:verse-)?system="[^"]*")>/g)].map((x) => x[1]);
		expect(wrappers).toEqual(m.systems.map((s) => s.attr));
		// the fixture is laid out so that the three shapes all occur: a mixed system, a later-only system, and a system after the passes
		const mixed = m.systems.filter((sys) => bars.slice(sys.fromMeasure, sys.toMeasure + 1).some((b) => b.later) && bars.slice(sys.fromMeasure, sys.toMeasure + 1).some((b) => !b.later));
		expect(mixed.length).toBeGreaterThan(0);
		expect(m.systems.some((s) => s.attr?.startsWith('data-verse-system'))).toBe(true);
		for (const sys of mixed) expect(sys.attr).toMatch(/^data-system="\d+-\d+"$/);
	});

	it('covers every notated bar once with a data-system range: the Loupe finds each held bar in one system', async () => {
		const m = melody(await load('strophic-repeat.musicxml'));
		const seen: number[] = [];
		for (const a of attrValues(markup(m), 'data-system')) {
			const [from, to] = a.split('-').map(Number);
			for (let i = from; i <= to; i++) seen.push(i);
		}
		expect(seen.sort((a, b) => a - b)).toEqual([...Array(11).keys()]); // source bars 0 to 10, each in exactly one system's range
	});

	it('draws the final barline only on the song\'s last system', async () => {
		const m = melody(await load('strophic-repeat.musicxml'));
		const strokesAtRight = m.systems.map((s) => {
			const w = s.width;
			return [...s.svg.matchAll(/<line x1="([\d.]+)"[^>]*y1="[\d.]+" x2="[\d.]+" y2="[\d.]+" stroke="#3a352f"/g)].filter((x) => Number(x[1]) > w - 12).length;
		});
		expect(strokesAtRight.slice(0, -1).every((n) => n === 1)).toBe(true);
		expect(strokesAtRight.at(-1)).toBe(2);
	});

	it('re-renders the last system at its natural width without a live hit for a later-pass event', async () => {
		const m = melody(await load('strophic-repeat.musicxml'));
		const last = m.systems.at(-1)!;
		expect(attrValues(last.svg, 'data-hit').filter((v) => v.includes('~v'))).toEqual([]);
		const lastBars = m.render.bars.slice(last.fromMeasure, last.toMeasure + 1);
		expect(attrValues(last.svg, 'data-verse-hit').length).toBe(lastBars.filter((b) => b.later).length * 4);
		expect(lastBars.some((b) => b.later)).toBe(true);
	});
});

describe('one-verse scores are untouched by the module', () => {
	it('returns the notated score by reference and the same pages as paginateScore would', async () => {
		const s = await load('repeat-one-verse.musicxml');
		const m = melody(s);
		expect(m.render.path).toBe('notated');
		expect(m.render.score).toBe(s);
		expect(m.systems.every((x) => x.attr === undefined)).toBe(true);
		expect(markup(m)).not.toContain('data-verse');
	});
});

describe('Step 4b: the label, the tag, and the multibar rest', () => {
	const labels = (svg: string) => [...svg.matchAll(/<text data-verse-label="(\d+)" x="([-\d.]+)" y="([-\d.]+)"[^>]*>([^<]*)<\/text>/g)].map((x) => ({ k: Number(x[1]), x: Number(x[2]), y: Number(x[3]), text: x[4] }));
	const numbers = (svg: string) => [...svg.matchAll(/<text data-bar-number="([^"]*)" x="([-\d.]+)"[^>]*text-anchor="(\w+)"[^>]*>([^<]*)<\/text>/g)].map((x) => ({ bar: x[1], x: Number(x[2]), anchor: x[3], shown: x[4] }));

	it('stands the label above the first bar of passes 2 and 3 only, in both languages', async () => {
		const s = await load('strophic-repeat.musicxml');
		for (const [lang, word] of [['en', 'Verse'], ['fr', 'Couplet']] as const) {
			const m = melody(s, lang);
			const found = m.systems.flatMap((sys) => labels(sys.svg));
			expect(found.map((l) => [l.k, l.text])).toEqual([[2, `${word} 2`], [3, `${word} 3`]]);
			// it stands at the bar's first note: the left of that note's own group
			for (const l of found) {
				const id = `${s.vocalLine.filter((e) => e.measureIndex === 3)[0].id}~v${l.k}`;
				const sys = m.systems.find((x) => x.svg.includes(`data-verse-event-id="${id}"`))!;
				const g = sys.svg.slice(sys.svg.indexOf(`data-verse-event-id="${id}"`));
				const cx = Number(/<ellipse cx="([-\d.]+)" cy="[-\d.]+" rx="([-\d.]+)"/.exec(g)![1]);
				const rx = Number(/<ellipse cx="[-\d.]+" cy="[-\d.]+" rx="([-\d.]+)"/.exec(g)![1]);
				expect(l.x).toBeCloseTo(cx - rx, 1);
			}
		}
	});

	it('grows the system to hold the label, so it cannot part from its bar at a page foot', async () => {
		const s = await load('strophic-repeat.musicxml');
		const m = melody(s);
		const withLabel = m.systems.filter((sys) => labels(sys.svg).length > 0);
		expect(withLabel).toHaveLength(2);
		for (const sys of withLabel) {
			const vb = /viewBox="0 ([-\d.]+) ([\d.]+) ([\d.]+)"/.exec(sys.svg)!;
			expect(sys.minY).toBe(Number(vb[1]));
			expect(sys.height).toBe(Number(vb[3]));
			expect(labels(sys.svg)[0].y).toBeGreaterThan(sys.minY);
		}
		// the systems are packed with their grown height: none is taller than the window it is placed in
		for (const sys of m.systems) expect(sys.height).toBeLessThanOrEqual(727);
	});

	it('tags the bar number only at a later-pass system start that does not open on the label', async () => {
		const s = await load('strophic-repeat.musicxml');
		const m = melody(s);
		const bars = m.render.bars;
		let tagged = 0;
		for (const sys of m.systems) {
			const first = bars[sys.fromMeasure];
			const n = numbers(sys.svg);
			if (sys.fromMeasure === 0) {
				expect(n).toEqual([]);
				continue;
			}
			expect(n.length).toBeGreaterThan(0);
			const printed = m.render.score.measures[sys.fromMeasure].number;
			if (first.later && first.label === undefined) {
				tagged++;
				expect(n[0].shown).toBe(`${printed} \u00b7 verse ${first.place}`);
				expect(n[0].bar).toBe(printed); // the handle still carries the bare number
			} else {
				expect(n[0].shown).toBe(printed);
			}
		}
		expect(tagged).toBeGreaterThan(0);
		const fr = melody(s, 'fr').systems.flatMap((sys) => numbers(sys.svg)).filter((x) => x.shown !== x.bar).map((x) => x.shown);
		expect(fr.every((t) => /^\d+ \u00b7 couplet \d$/.test(t))).toBe(true);
	});

	it('keeps a long tag off the left edge by anchoring it at x = 0', async () => {
		const m = melody(await load('strophic-repeat.musicxml'), 'fr');
		const tags = m.systems.flatMap((sys) => numbers(sys.svg)).filter((x) => x.shown !== x.bar);
		expect(tags.length).toBeGreaterThan(0);
		for (const t of tags) {
			expect(t.anchor === 'start' ? t.x : t.x - (t.shown.length * 0.62 * 12.5) / 2).toBeGreaterThanOrEqual(0);
		}
	});

	it('a multibar rest stops at a pass boundary', async () => {
		const s = await load('strophic-tacet-boundary.musicxml');
		const m = melody(s);
		expect(m.render.boundaries.has(4)).toBe(true);
		const counts = (svg: string) => [...svg.matchAll(/data-tacet-count="(\d+)"/g)].map((x) => Number(x[1]));
		expect(m.systems.flatMap((sys) => counts(sys.svg)).every((n) => n === 1)).toBe(true);
		// without the boundary the interlude of one pass and the introduction of the next are one rest
		const joined = paginateScore(m.render.score, m.analyzed, { pageWidth: 624, pageHeight: 727, laterPageHeight: 727, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, ...ENGRAVING_DEFAULTS });
		expect(joined.systems.flatMap((sys) => counts(sys.svg))).toContain(2);
	});
});
