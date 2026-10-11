/**
 * QUEUE row 66: what the round 2 page says, block by block. The model is built
 * from the test's own notes (as `insights.test.ts` builds it); the comments are
 * stand-ins holding only what the builder reads.
 */
import { describe, expect, it } from 'vitest';
import type { Measure, ParsedScore, Pitch, VocalLineEvent, VoiceProfileSnapshot } from '@ilya/score-parser';
import { t } from '$lib/i18n';
import { buildInsights, verdictLine } from './insights';
import { joinList, singerBlocks, type BlockInputs, type Block } from './singer-blocks';
import type { RenderedComment } from './comment-text';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });
const QUARTER = { base: 'quarter' as const, dots: 0, fraction: { numerator: 1, denominator: 4 } };

function score(pitches: Pitch[]): ParsedScore {
	const vocalLine: VocalLineEvent[] = pitches.map((p, i) => ({
		id: `n${i}`,
		type: 'note',
		measureIndex: Math.floor(i / 4),
		rhythmicPosition: { fraction: { numerator: i % 4, denominator: 4 } },
		duration: QUARTER,
		pitch: p,
	}));
	return {
		source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
		vocalPart: { partId: 'P1', partName: 'Voice' },
		measures: Array.from({ length: Math.ceil(pitches.length / 4) }, (_, i) => ({ index: i, number: String(i + 1), timeSignature: { beats: 4, beatType: 4 }, expectedDuration: { numerator: 1, denominator: 1 } })) as Measure[],
		keySignatures: [],
		timeSignatures: [],
		tempoMarkings: [],
		vocalLine,
	} as unknown as ParsedScore;
}

const profile: VoiceProfileSnapshot = {
	fR1: { a: 650, u: 300 },
	range: { lowest: P('G', 2), highest: P('F', 4) },
	tessitura: { low: P('C', 3), high: P('A', 3) },
	passaggio: { primo: P('A', 3), secondo: P('D', 4) },
};

const comment = (id: string, approach: boolean, extras = false): RenderedComment =>
	({
		comment: { eventId: id, measureIndex: 0, vowel: 'u', ...(approach ? { resonance: { side: 'under', fR1Hz: 300, cents: -50 } } : {}) },
		frame: [{ text: 'This [u] is sustained.' }],
		consequence: [],
		visible: approach ? [{ id: 's1', runs: [{ text: 'Try this.' }] }] : [],
		hidden: extras ? [{ id: 's2', runs: [{ text: 'Or this.' }] }] : [],
		count: '',
		references: extras ? [[{ text: 'Miller 1986' }]] : [],
		printedRows: [],
		namedFR1: false,
	}) as unknown as RenderedComment;

function inputs(sc: ParsedScore, over: Partial<BlockInputs> = {}): BlockInputs {
	const model = buildInsights({ analysisScore: sc, profile, watchList: null });
	return {
		language: 'en',
		model,
		profile,
		verdict: verdictLine(model, false),
		noneFlagged: true,
		held: null,
		outside: null,
		better: null,
		comments: [],
		more: [],
		hiddenBySettings: 0,
		tagOf: (r) => `m. 1 · ${r.comment.eventId}`,
		barOf: () => '1',
		phonationHeadline: null,
		untrustedLine: null,
		split: null,
		cycles: null,
		turns: null,
		...over,
	};
}

const fitting = score([P('E', 3), P('F', 3), P('G', 3), P('E', 3)]);
const kinds = (bs: { block: Block }[]) => bs.map((b) => b.block.kind);

describe('the round 2 page, block by block', () => {
	it('runs the frame, the conclusion, the moments, the totals, then the sources', () => {
		const out = singerBlocks(inputs(fitting, { comments: [comment('a', true, true)] }), String);
		const runs = out.map((b) => b.group).filter((g, k, all) => k === 0 || g !== all[k - 1] || g === 'free');
		expect(runs).toEqual(['free', 'free', 'moments', 'totals', 'sources']);
		expect(kinds(out).slice(0, 3)).toEqual(['frame', 'conclusion', 'comment']);
		expect((out[0].block as Extract<Block, { kind: 'frame' }>).text).toBe(t('insights.r2.frame', 'en'));
	});

	it('puts teacher line A on a comment that suggests an approach, and on no comment that only describes', () => {
		const out = singerBlocks(inputs(fitting, { comments: [comment('a', true), comment('b', false)] }), String);
		const cs = out.map((b) => b.block).filter((b): b is Extract<Block, { kind: 'comment' }> => b.kind === 'comment');
		expect(cs.map((c) => c.teacher)).toEqual([t('insights.r2.teacherA', 'en'), undefined]);
	});

	it('opens the sources with teacher line C, and lists only comments with more to explore', () => {
		const out = singerBlocks(inputs(fitting, { comments: [comment('a', true, true), comment('b', false)] }), String);
		const notes = out.map((b) => b.block).filter((b): b is Extract<Block, { kind: 'endnote' }> => b.kind === 'endnote');
		expect(notes).toHaveLength(1);
		expect(notes[0].teacher).toBe(t('insights.r2.teacherC', 'en'));
		expect(notes[0].heading).toBe(t('comment.tap', 'en'));
	});

	it('prints the verdict and "nothing flagged" as one paragraph for a key that fits', () => {
		const out = singerBlocks(inputs(fitting), String);
		const c = out[1].block as Extract<Block, { kind: 'conclusion' }>;
		expect(c.paragraph).toBe(`${t('insights.verdict.fit', 'en')} ${t('insights.findings.none', 'en')}`);
		expect(c.forward).toBeNull();
	});

	it('words the unlikely case with the ratified sentence when both reasons exist, and offers no key when none fits', () => {
		// Inside the typed range, but the band (C4 to E4) passes the typed tessitura (C3 to A3) by far more than a whole tone.
		const high = score([P('C', 4), P('D', 4), P('E', 4), P('E', 4), P('E', 4), P('D', 4)]);
		const held = { eventId: 'n2', measure: '1', pitch: P('E', 4), vowel: 'i', seconds: 4.2 };
		const out = singerBlocks(inputs(high, { held }), String);
		const c = out[1].block as Extract<Block, { kind: 'conclusion' }>;
		expect(c.paragraph).toContain('In this key, 100 percent of the singing lies above your primo passaggio, A3, and bar 1 holds an E4 [i] for about 4 seconds, above your secondo, D4.');
		expect(c.paragraph).toContain(t('insights.r2.unlikely.together', 'en'));
		expect(c.forward).toEqual({ sentence: t('insights.r2.noBetterKey', 'en'), teacher: t('insights.r2.teacherA', 'en') });
	});

	it('lists the bars near the passaggio in words and with an Oxford comma', () => {
		const sc = fitting;
		const i = inputs(sc);
		i.model = { ...i.model, passaggioBars: ['11', '18', '64'] };
		const c = singerBlocks(i, String)[1].block as Extract<Block, { kind: 'conclusion' }>;
		expect(c.reasons.flatMap((r) => r.lines)).toContain('Notes in three bars sit near your passaggio: 11, 18, and 64.');
		expect(joinList(['11', '18', '64'], 'fr')).toBe('11, 18 et 64');
	});
});

describe('placeholders (QUEUE row 69)', () => {
	const sc = score([P('C', 3), P('D', 3), P('E', 3), P('F', 3)]);
	const commentsOf = (blocks: ReturnType<typeof singerBlocks>) =>
		blocks.map((b) => b.block).filter((b): b is Extract<Block, { kind: 'comment' }> => b.kind === 'comment');

	it('a comment that reads a placeholder fR1 says so in its own sentence', () => {
		const [c] = commentsOf(singerBlocks(inputs(sc, { comments: [comment('n1', true)], placeholders: ['u'] }), String));
		expect(c.placeholder).toBe('This finding rests on a placeholder value for [u].');
	});

	it('in French too, on the desk draft', () => {
		const [c] = commentsOf(singerBlocks(inputs(sc, { language: 'fr', comments: [comment('n1', true)], placeholders: ['u'] }), String));
		expect(c.placeholder).toBe('Ce constat repose sur une valeur par défaut pour la voyelle [u].');
	});

	it('says nothing when the vowel was sampled, or when the comment reads no resonance', () => {
		expect(commentsOf(singerBlocks(inputs(sc, { comments: [comment('n1', true)], placeholders: ['a'] }), String))[0].placeholder).toBeUndefined();
		expect(commentsOf(singerBlocks(inputs(sc, { comments: [comment('n1', false)], placeholders: ['u'] }), String))[0].placeholder).toBeUndefined();
	});

	it('the vowel figure dashes a row whose turn rests on a placeholder, and says so', () => {
		const turns = {
			maxShare: 0.6,
			pastShare: 0.2,
			rows: [
				{ vowel: 'a', sung: true, share: 0.6, pastShare: 0.1, seconds: null, past: null, turn: P('E', 4) },
				{ vowel: 'u', sung: true, share: 0.4, pastShare: 0.1, seconds: null, past: null, turn: P('E', 3) },
			],
		} as unknown as BlockInputs['turns'];
		const v = singerBlocks(inputs(sc, { turns, placeholders: ['u'] }), String)
			.map((b) => b.block)
			.find((b): b is Extract<Block, { kind: 'vowels' }> => b.kind === 'vowels')!;
		expect(v.rows.map((r) => !!r.placeholder)).toEqual([false, true]);
		expect(v.placeholder).toBe('The turn of [u] rests on a placeholder value, so its bar is drawn dashed.');
	});
});
