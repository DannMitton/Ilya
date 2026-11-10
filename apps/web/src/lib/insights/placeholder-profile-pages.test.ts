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
