/**
 * Row 48 (2026-10-15): every song gets a tempo, estimated when none is printed,
 * and the singer can change it. These read the two fixtures in the tree:
 * Tchaikovsky op. 38 no. 3 (3/8, 99 measures, no `<words>` and no
 * `<per-minute>`: the case a scan produces, since homr's MusicXML carries no
 * tempo) and the engraved Sunless no. 1, which prints *Andante tranquillo*.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, resolveTempo, type ParsedScore, type VoiceProfileSnapshot } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { t } from '$lib/i18n';
import { buildInsights, formatSeconds, formatTempo, secondsPerQuaver } from '$lib/insights/insights';
import { cycleDose } from '$lib/insights/singing-measures';
import { phonationHeadline, type HeadlineDeps } from '$lib/insights/phonation-headline';
import { richParts } from '$lib/insights/text-parts';
import { buildProvenanceLegend, TEMPO_ESTIMATED } from '$lib/provenance';
import { beatGlyph, beatName, DOT } from './beat-glyph';
import { beatChips, clampBpm, convertBpm, tempoSource, withSingerTempo } from './singer-tempo';
import { TempoUi } from './tempo-ui.svelte';

async function load(name: string): Promise<ParsedScore> {
	const xml = readFileSync(fileURLToPath(new URL(`../score/ingestion/fixtures/${name}`, import.meta.url)), 'utf8');
	const { score } = await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: name });
	return score;
}

const profile: VoiceProfileSnapshot = {
	fR1: { a: 650, u: 300 },
	range: { lowest: { step: 'G', octave: 2, alter: 0 }, highest: { step: 'F', octave: 5, alter: 0 } },
	tessitura: { low: { step: 'C', octave: 3, alter: 0 }, high: { step: 'A', octave: 4, alter: 0 } },
	passaggio: { primo: { step: 'A', octave: 3, alter: 0 }, secondo: { step: 'D', octave: 4, alter: 0 } },
};

const deps = (language: 'en' | 'fr' = 'en'): HeadlineDeps => ({
	language,
	T: (k) => t(k, language),
	fill: (s, vars) => Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, String(v)), s),
	formatSeconds,
	formatTempo,
});

describe('a song with no printed tempo (Tchaikovsky, 3/8)', async () => {
	const score = await load('tchaikovsky-op38-3-voice.musicxml');

	it('is estimated: the dotted quarter at 60 to 72, from the 3/8 metre', () => {
		const r = resolveTempo(score)!;
		expect(r.provenance).toBe('estimated');
		expect([r.beatUnit, r.beatUnitDots]).toEqual(['quarter', 1]);
		expect(r.range).toEqual([60, 72]);
		expect(r.estimateMetre).toEqual({ beats: 3, beatType: 8 });
		expect([r.beatAlternative?.unit, r.beatAlternative?.dots]).toEqual(['eighth', 0]);
	});

	it('prices a RANGE of seconds, and the section reads timing "range"', () => {
		const pricing = secondsPerQuaver(score)!;
		const fig = pricing.price(8);
		expect(fig.kind).toBe('range');
		const model = buildInsights({ analysisScore: score, profile, watchList: null });
		expect(model.phonation.timing).toBe('range');
		expect(model.phonation.tempo!.provenance).toBe('estimated');
	});

	it('the contact count prints as a span (the cycles line, restored with no new string)', () => {
		const model = buildInsights({ analysisScore: score, profile, watchList: null });
		const dose = cycleDose(model.figure!.rows, secondsPerQuaver(score)!.price)!;
		expect(dose.kind).toBe('range');
		if (dose.kind === 'range') expect(dose.low).toBeLessThan(dose.high);
		expect(model.figure!.cycles?.kind).toBe('range');
	});

	it('the sentence is the ratified estimate, with the dotted quarter in the notation face', () => {
		const model = buildInsights({ analysisScore: score, profile, watchList: null });
		const en = phonationHeadline(model.phonation, deps('en'));
		expect(en).toMatch(/^Ilya estimates /);
		expect(en).toContain(`${beatGlyph('quarter', 1)} = 60 to 72 from this score's 3/8 metre, so you phonate for about `);
		expect(en).not.toMatch(/states no tempo/);
		const fr = phonationHeadline(model.phonation, deps('fr'));
		expect(fr).toContain('Ilya estime le tempo à ');
		expect(fr).toContain('d’après la mesure à 3/8 de cette partition; votre phonation occupe donc environ ');
	});

	it('the singer\'s tempo makes it a point, and the sentence says it is theirs', () => {
		const mine = withSingerTempo(score, { bpm: 60, beatUnit: 'quarter', beatUnitDots: 1 });
		const model = buildInsights({ analysisScore: mine, profile, watchList: null });
		expect(model.phonation.timing).toBe('point');
		expect(model.phonation.tempo!.provenance).toBe('user');
		const en = phonationHeadline(model.phonation, deps('en'));
		expect(en).toMatch(/, your tempo\.$/);
		expect(en).toContain(`${beatGlyph('quarter', 1)} = 60`);
	});

	it('the figures follow the singer: doubling the beat speed halves the price', () => {
		const slow = secondsPerQuaver(withSingerTempo(score, { bpm: 40, beatUnit: 'quarter', beatUnitDots: 1 }))!.price(8);
		const fast = secondsPerQuaver(withSingerTempo(score, { bpm: 80, beatUnit: 'quarter', beatUnitDots: 1 }))!.price(8);
		expect(slow.kind === 'point' && fast.kind === 'point' && slow.seconds / fast.seconds).toBeCloseTo(2, 9);
	});

	it('reset to the estimate: no choice is the estimate again', () => {
		expect(resolveTempo(withSingerTempo(score, null))!.provenance).toBe('estimated');
	});

	it('the TEMPO receipt reads the source in three words, and the control reads from the same place', () => {
		let tempo: { bpm: number; beatUnit: 'quarter' | 'eighth'; beatUnitDots: number } | null = null;
		const ui = new TempoUi();
		ui.bind(() => ({ get tempo() { return tempo; }, set tempo(v) { tempo = v; } }) as never, () => score);
		expect(tempoSource(ui.current!)).toBe('estimated');
		ui.choose({ bpm: 60, beatUnit: 'quarter', beatUnitDots: 1 });
		expect(tempoSource(ui.current!)).toBe('yours');
		expect(ui.withoutChoice!.provenance).toBe('estimated');
		ui.choose(null);
		expect(tempoSource(ui.current!)).toBe('estimated');
	});

	it('the chips for 3/8 are the dotted quarter and the eighth, and a tap keeps the speed', () => {
		const chips = beatChips(score, { unit: 'quarter', dots: 1 });
		expect(chips).toEqual([{ unit: 'quarter', dots: 1 }, { unit: 'eighth', dots: 0 }]);
		// The order does not change when the other chip is active: a tap marks, it does not move.
		expect(beatChips(score, { unit: 'eighth', dots: 0 })).toEqual(chips);
		// A printed mark in a beat of its own is shown first.
		expect(beatChips(score, { unit: 'half', dots: 0 })[0]).toEqual({ unit: 'half', dots: 0 });
		expect(convertBpm(60, { unit: 'quarter', dots: 1 }, { unit: 'eighth', dots: 0 })).toBe(180);
		expect(convertBpm(180, { unit: 'eighth', dots: 0 }, { unit: 'quarter', dots: 1 })).toBe(60);
	});
});

describe('a song with a printed tempo word keeps its own sentence (Sunless no. 1)', async () => {
	const score = await load('sunless-01-engraved.musicxml');

	it('is inferred from the word, and the sentence is headlineInferred', () => {
		expect(resolveTempo(score)!.provenance).toBe('inferred');
		const model = buildInsights({ analysisScore: score, profile, watchList: null });
		const en = phonationHeadline(model.phonation, deps('en'));
		expect(en).toMatch(/^Your phonation takes about /);
		expect(en).toMatch(/Andante tranquillo/);
	});

	it('a tempo of the singer\'s own overrides the printed word', () => {
		const mine = withSingerTempo(score, { bpm: 50, beatUnit: 'quarter', beatUnitDots: 1 });
		expect(resolveTempo(mine)!.provenance).toBe('user');
	});
});

describe('the phonation sentence, branch by branch', () => {
	const base = { vowels: null, zones: null, untrustedMeasures: null, nothingSung: false };
	const tempoOf = (over: object) => ({ bpm: 66, beatUnit: 'quarter', beatUnitDots: 0, steadyMarkingCount: 0, gradualCues: [], ...over }) as never;

	it('encoded: headline, one figure', () => {
		const ph = { ...base, timing: 'point', phonation: { kind: 'point', seconds: 90 }, length: 120, tempo: tempoOf({ provenance: 'encoded' }) } as never;
		expect(phonationHeadline(ph, deps())).toMatch(/^You phonate for about 1\u00a0min\u00a030\u00a0s of this 2\u00a0min piece, at /);
	});

	it('inferred: headlineInferred, a range, with the word', () => {
		const ph = { ...base, timing: 'range', phonation: { kind: 'range', low: 60, high: 90 }, length: null, tempo: tempoOf({ provenance: 'inferred', printedText: 'Allegro' }) } as never;
		expect(phonationHeadline(ph, deps())).toContain('at the speed Allegro usually means');
	});

	it('estimated with a metre says the metre; without one it says a walking pace', () => {
		const range = { kind: 'range', low: 60, high: 72 };
		const withMetre = { ...base, timing: 'range', phonation: range, length: null, tempo: tempoOf({ provenance: 'estimated', range: [60, 72], estimateMetre: { beats: 6, beatType: 8 } }) } as never;
		expect(phonationHeadline(withMetre, deps())).toContain("from this score's 6/8 metre");
		const without = { ...base, timing: 'range', phonation: range, length: null, tempo: tempoOf({ provenance: 'estimated', range: [60, 72] }) } as never;
		const s = phonationHeadline(without, deps());
		expect(s).toContain(', a walking pace, so you phonate for about ');
		expect(s).not.toContain('metre');
		expect(phonationHeadline(without, deps('fr'))).toContain('l’allure de la marche; votre phonation');
	});

	it('user: headlineYours', () => {
		const ph = { ...base, timing: 'point', phonation: { kind: 'point', seconds: 30 }, length: 45, tempo: tempoOf({ provenance: 'user' }) } as never;
		expect(phonationHeadline(ph, deps())).toMatch(/of this 45\u00a0s piece, at .*, your tempo\.$/);
	});

	it('says nothing where there is no price, and never the old "states no tempo" line', () => {
		expect(phonationHeadline({ ...base, timing: 'none', phonation: null, length: null, tempo: null } as never, deps())).toBe('');
	});
});

describe('the pieces the sentence and the receipt are made of', () => {
	it('beat glyphs are the metronome notes of the notation face, dots after, and names are the note-value words', () => {
		expect(beatGlyph('quarter', 0)).toBe('');
		expect(beatGlyph('quarter', 1)).toBe(`${DOT}`);
		expect(beatGlyph('breve', 0)).toBe('');
		expect(beatName('eighth', 0, 'en')).toBe(t('correct.len8th', 'en'));
		expect(beatName('half', 1, 'en')).toBe('Dotted half');
		expect(beatName('quarter', 0, 'fr')).toBe(t('correct.lenQuarter', 'fr'));
	});

	it('richParts sets private-use characters apart, so the page draws them in Finale Maestro', () => {
		const parts = richParts(`Ilya estimates ${beatGlyph('quarter', 1)} = 60`);
		expect(parts.filter((p) => p.mus).map((p) => p.text)).toEqual([beatGlyph('quarter', 1)]);
		expect(parts.map((p) => p.text).join('')).toBe(`Ilya estimates ${beatGlyph('quarter', 1)} = 60`);
	});

	it('bounds a typed or stepped tempo, to a whole number', () => {
		expect(clampBpm(0)).toBe(10);
		expect(clampBpm(9999)).toBe(500);
		expect(clampBpm(66.6)).toBe(67);
	});

	it('the ≈ sigil joins the legend as a text character, decoded in the ratified words, only where a page prints it', () => {
		expect(buildProvenanceLegend([], 'en')).toEqual([]);
		const [item] = buildProvenanceLegend([], 'en', undefined, true);
		expect(item).toEqual({ type: TEMPO_ESTIMATED, icon: '≈', label: 'tempo estimated by Ilya' });
		expect(buildProvenanceLegend([], 'fr', undefined, true)[0].label).toBe('tempo estimé par Ilya');
	});

	it('the ratified words are exactly as Dann gave them (2026-10-08 01:40; the two estimates 2026-10-15 09:09)', () => {
		expect(t('insights.phonation.estimatedMetre', 'en')).toBe("Ilya estimates {beat} = {low} to {high} from this score's {metre} metre, so you phonate for about {t1} to {t2}.");
		expect(t('insights.phonation.estimatedWalking', 'en')).toBe('Ilya estimates {beat} = {low} to {high}, a walking pace, so you phonate for about {t1} to {t2}.');
		expect(t('insights.phonation.estimatedMetre', 'fr')).toBe('Ilya estime le tempo à {beat} = {low} à {high} d’après la mesure à {metre} de cette partition; votre phonation occupe donc environ {t1} à {t2}.');
		expect(t('insights.phonation.estimatedWalking', 'fr')).toBe('Ilya estime le tempo à {beat} = {low} à {high}, l’allure de la marche; votre phonation occupe donc environ {t1} à {t2}.');
		expect(t('insights.phonation.headlineYours', 'en')).toBe('You phonate for about {phonation} of this {length} piece, at {tempo}, your tempo.');
		expect(t('tempo.hint', 'en')).toBe('Your tempo. Every figure follows.');
		expect(t('tempo.useEstimate', 'en')).toBe("Use Ilya's estimate");
		expect(['intake.tempo.label', 'intake.tempo.estimated', 'intake.tempo.printed', 'intake.tempo.yours'].map((k) => t(k, 'en'))).toEqual(['TEMPO', 'estimated', 'printed', 'your tempo']);
		expect(['intake.tempo.estimated', 'intake.tempo.printed', 'intake.tempo.yours'].map((k) => t(k, 'fr'))).toEqual(['estimé', 'imprimé', 'votre tempo']);
	});
});
