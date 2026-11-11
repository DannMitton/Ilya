/**
 * QUEUE row 166, steps 2.4 and 2.5: what the INSIGHTS chain does with a voice that has only placeholders.
 * The chain is `InsightsPane.svelte`'s, run on song 1 of the Sunless cycle (the tracked engraved fixture)
 * with no sampled vowel and no typed edge, for each of the five declared types.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, analyzeScore, noteConditions, scoreInPerformanceOrder, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { buildUnderlayResolvers } from '$lib/score/vowel-resolver';
import { resolveAdvice } from '$lib/analysis/advice-resolver';
import { buildVoiceProfileSnapshot } from '$lib/analysis/analyze-score-adapter';
import { placeholderLine, placeholderVowels } from '$lib/analysis/placeholder-line';
import { isTreble, noteComments, noteFacts } from './comments';
import { speaks } from './comment-text';
import { buildInsights, verdictLine } from './insights';
import { singerBlocks } from './singer-blocks';
import { vowelTurns } from './singer-page';
import type { CalibratedFormant, Vowel } from '$lib/voice/engine/types';

const xml = readFileSync(fileURLToPath(new URL('../score/ingestion/fixtures/sunless-01-engraved.musicxml', import.meta.url)), 'utf8');
const parse = async (): Promise<ParsedScore> =>
	(await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: 'sunless-01-engraved.musicxml' })).score;

async function chain(voiceType: string) {
	const adapted = buildVoiceProfileSnapshot({}, undefined, undefined, undefined, voiceType);
	const score = scoreInPerformanceOrder(await parse()).score;
	const resolvers = buildUnderlayResolvers(score, 1, {});
	const analyzed = resolveAdvice(analyzeScore(score, adapted.snapshot, resolvers.vowel));
	const notes = noteConditions(score, adapted.snapshot, analyzed.events, { vowelForEvent: resolvers.vowel }).notes;
	const treble = isTreble(adapted.snapshot);
	const all = noteComments({ facts: noteFacts(notes, adapted.snapshot), treble });
	return { adapted, analyzed, notes, treble, all };
}

describe.each(['soprano', 'mezzo-soprano', 'tenor', 'baritone', 'bass'])('row 166: %s on song 1, nothing sung', (id) => {
	it('every event rests on a placeholder, the page names them, and no surrogate is a measured vowel', async () => {
		const { adapted, analyzed } = await chain(id);
		const events = Object.values(analyzed.events);
		expect(events.length).toBeGreaterThan(0);
		expect(events.every((e) => e.placeholder === true)).toBe(true);
		const named = placeholderVowels(analyzed);
		expect(named.length).toBeGreaterThan(0);
		expect(new Set(named)).toEqual(new Set(events.map((e) => e.vowel)));
		expect(placeholderLine(named, 'en', 'markup')).toContain('placeholder value');
		// `measuredVowels` (`InsightsPane.svelte:238-244`) reads the SAMPLED map handed to the pane, never `adapted`, so a surrogate is outside it by construction.
		expect(Object.values(adapted.snapshot.fR1Source ?? {}).every((s) => s === 'surrogate')).toBe(true);
	});
});

describe('row 166: a generic soprano with no typed passaggio', () => {
	it('isTreble is undefined, so no comment is flagged treble and none is hidden by it', async () => {
		const { treble, all } = await chain('soprano');
		expect(treble).toBeUndefined();
		// With no typed secondo `isTreble` is undefined, and no comment can fire, on any score: `firesSustained` and the non-treble `firesTurning`
		// need `toSecondo` (`comments.ts:222`, `:242`), `firesClosedU` needs `treble === false` (`:251`), and the treble form needs `treble === true` (`:234`).
		expect(all.filter((c) => c.treble).length).toBe(0);
		// The count the page shows is what `InsightsPane.svelte` keeps: not treble, and spoken.
		const shown = all.filter((c) => !c.treble && speaks(c));
		expect(shown.length).toBe(all.length - all.filter((c) => !speaks(c)).length);
		expect(all.length).toBe(0);
	});
});

/* Step 5 (Fable's as-built review): the ring's share sums every row, so it is dashed wherever a row with a turn is a placeholder. */
describe('step 5: the vowels block\'s ring on song 1', () => {
	const FORMANTS: Record<string, [number, number]> = { i: [280, 2250], e: [400, 2100], 'ɪ': [330, 1900], 'ɨ': [350, 1500], 'ɛ': [520, 1800], a: [700, 1300], 'ɑ': [650, 1000], 'ʌ': [600, 1200], o: [450, 900], u: [320, 800] };
	const sungTen = Object.fromEntries(
		Object.entries(FORMANTS).map(([v, [f1, f2]]) => [v, { f1, f2, f2Quality: 'clear', confidence: 'high', reading: 'captured', plausibility: 'plausible', source: 'measured-user' }]),
	) as unknown as Partial<Record<Vowel, CalibratedFormant>>;

	async function vowelsBlock(sampled: Partial<Record<Vowel, CalibratedFormant>>, type: string) {
		const adapted = buildVoiceProfileSnapshot(sampled, undefined, undefined, undefined, type);
		const score = scoreInPerformanceOrder(await parse()).score;
		const resolvers = buildUnderlayResolvers(score, 1, {});
		const analyzed = resolveAdvice(analyzeScore(score, adapted.snapshot, resolvers.vowel));
		const model = buildInsights({ analysisScore: score, profile: adapted.snapshot, watchList: null, vowelForEvent: resolvers.vowel, analyzed });
		const blocks = singerBlocks(
			{
				language: 'en', model, profile: adapted.snapshot, verdict: verdictLine(model, false), noneFlagged: true, held: null, outside: null, keys: null,
				comments: [], more: [], hiddenBySettings: 0, tagOf: () => '', barOf: () => '1', pitchOf: () => '', phonationHeadline: null, untrustedLine: null,
				split: null, cycles: null, turns: vowelTurns(score, adapted.snapshot, resolvers.vowel), placeholders: placeholderVowels(analyzed),
			},
			String,
		);
		return blocks.map((b) => b.block).find((b) => b.kind === 'vowels');
	}

	it('a generic baritone: the ring prints, and the block carries ringPlaceholder', async () => {
		const b = await vowelsBlock({}, 'baritone');
		expect(b?.kind).toBe('vowels');
		if (b?.kind !== 'vowels') return;
		expect(b.ring).not.toBeNull();
		expect(b.ringPlaceholder).toBe(true);
		expect(b.rows.some((r) => r.turn && r.placeholder)).toBe(true);
	});

	it('a voice with ten sung vowels: the ring carries no flag', async () => {
		const b = await vowelsBlock(sungTen, 'bass');
		expect(b?.kind).toBe('vowels');
		if (b?.kind !== 'vowels') return;
		expect(b.ring).not.toBeNull();
		expect(b.ringPlaceholder).toBeUndefined();
	});
});
