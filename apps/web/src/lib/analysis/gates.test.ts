/**
 * N.173, the gates (`gates.ts`) as Revision r5 leaves them: each gate on
 * hand-built entries and notes, and the folded line in both languages.
 */
import { describe, expect, it } from 'vitest';
import type { NoteCondition, Pitch, VoiceProfileSnapshot } from '@ilya/score-parser';
import { t } from '$lib/i18n';
import { applyGates, gatedLines, type GateInput } from './gates';
import type { WatchEntry, WatchKind } from './watchlist';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });

/** Mitton's range and passaggio: A2 to E4, A♭3 to D♭4 (MIDI 45 to 64, 56 to 61). */
const PROFILE: VoiceProfileSnapshot = {
	fR1: { ɑ: 617 },
	range: { lowest: P('A', 2), highest: P('E', 4) },
	passaggio: { primo: P('A', 3, -1), secondo: P('D', 4, -1) },
};

function entry(id: string, bar: string, kinds: WatchKind[], extra: Partial<WatchEntry> = {}): WatchEntry {
	return { eventId: id, tier: 3, kinds, bar, vowel: 'ɑ', density: 1, ...extra };
}

interface NoteSpec {
	id: string;
	midi: number;
	phrase: number;
	measure?: number;
	leapFrom?: number;
	held?: boolean;
}

function notes(specs: NoteSpec[]): NoteCondition[] {
	return specs.map((s, i) => ({
		eventId: s.id,
		order: i,
		measureIndex: s.measure ?? i,
		midi: s.midi,
		vowel: 'ɑ',
		held: s.held ?? false,
		heldBasis: 'is-long-sustain',
		...(s.leapFrom !== undefined
			? { approach: { semitones: s.midi - s.leapFrom, band: s.midi > s.leapFrom ? 'leap-up' : 'leap-down', afterRest: false } }
			: {}),
		phrase: { index: s.phrase, position: 'middle', quavers: 0 },
		quavers: 1,
		onsetPhonationQuavers: i,
	}));
}

const run = (entries: WatchEntry[], ns: NoteCondition[], extra: Partial<GateInput> = {}) =>
	applyGates({ watchList: { entries }, notes: ns, profile: PROFILE, ...extra });

describe('gate 1, the piece fits', () => {
	it('leads with the range entry alone when a note lies outside the range', () => {
		const r = run(
			[entry('a', '4', ['range'], { rangeDirection: 'above' }), entry('b', '2', ['passaggio'])],
			notes([{ id: 'a', midi: 66, phrase: 0 }, { id: 'b', midi: 57, phrase: 0 }]),
		);
		expect(r.fits).toBe(false);
		expect(r.shown.map((g) => g.entry.eventId)).toEqual(['a']);
		expect(r.notFit.map((e) => e.eventId)).toEqual(['b']);
	});
});

describe('gate 2, something to offer', () => {
	// A crowded phrase top: passaggio plus a leap of a fifth across the primo, stakes 2 × 2 = 4.
	const ns = notes([
		{ id: 'x', midi: 50, phrase: 0 },
		{ id: 'a', midi: 57, phrase: 0, leapFrom: 50 },
	]);
	const counts = { range: 0, crossing: 0, cover: 0, tracking: 0, turnover: 0, passaggio: 9, timbre: 0, sustain: 0 };

	it('a common passaggio note with no advice says nothing, whatever its stakes', () => {
		const r = applyGates({ watchList: { entries: [entry('a', '2', ['passaggio'])], kindCounts: counts }, notes: ns, profile: PROFILE });
		expect(r.shown).toEqual([]);
		expect(r.noOffer).toHaveLength(1);
	});

	it('the same note with a sourced thing to try passes', () => {
		const withAdvice = entry('a', '2', ['passaggio'], { advice: { action: 'iCrossing', target: 'ɪ' } });
		const r = applyGates({ watchList: { entries: [withAdvice], kindCounts: counts }, notes: ns, profile: PROFILE });
		expect(r.shown).toHaveLength(1);
	});

	it('a kind rare in this score passes without advice', () => {
		const r = applyGates({ watchList: { entries: [entry('a', '2', ['passaggio'])], kindCounts: { ...counts, passaggio: 3 } }, notes: ns, profile: PROFILE });
		expect(r.shown).toHaveLength(1);
	});

	it('weight never passes a place alone: no offer at the climax and a phrase top prints nothing', () => {
		const top = notes([{ id: 'a', midi: 58, phrase: 0 }, { id: 'b', midi: 50, phrase: 1 }, { id: 'c', midi: 52, phrase: 1 }]);
		const r = applyGates({ watchList: { entries: [entry('a', '1', ['passaggio'])], kindCounts: counts }, notes: top, profile: PROFILE });
		expect(r.shown).toEqual([]);
		expect(r.noOffer.map((e) => e.eventId)).toEqual(['a']);
		expect(gatedLines(r.shown, 'en')).toEqual([]);
	});

	it('a crossing with no advice and no rarity fails either way', () => {
		const r = applyGates({ watchList: { entries: [entry('a', '2', ['crossing'])], kindCounts: { ...counts, crossing: 9 } }, notes: ns, profile: PROFILE });
		expect(r.noOffer).toHaveLength(1);
	});
});

describe('gate 3, the stakes', () => {
	// A later, higher phrase keeps the climax and the final note off the note under test.
	const coda: NoteSpec[] = [{ id: 'z', midi: 62, phrase: 9 }];

	it('one demand on an unremarkable note is 1 × 1 = 1, under the threshold of 2', () => {
		const r = run([entry('a', '1', ['passaggio'])], notes([{ id: 'x', midi: 59, phrase: 0 }, { id: 'a', midi: 57, phrase: 0 }, ...coda]));
		expect(r.lowStakes).toEqual([{ entry: expect.objectContaining({ eventId: 'a' }), stakes: 1 }]);
	});

	it('a passaggio note at a phrase top is 1 × 2 = 2, at the threshold, and passes', () => {
		const r = run([entry('a', '1', ['passaggio'])], notes([{ id: 'a', midi: 57, phrase: 0 }, { id: 'b', midi: 50, phrase: 0 }, ...coda]));
		expect(r.shown.map((g) => [g.entry.eventId, g.stakes])).toEqual([['a', 2]]);
	});

	it('a leap of a fifth across the primo adds the transition demand: 2 × 2 = 4', () => {
		const r = run([entry('a', '2', ['passaggio'])], notes([{ id: 'x', midi: 50, phrase: 0 }, { id: 'a', midi: 57, phrase: 0, leapFrom: 50 }, ...coda]));
		expect(r.shown[0].demands).toEqual(['register', 'transition']);
		expect(r.shown[0].weights).toEqual(['phraseTop']);
		expect(r.shown[0].stakes).toBe(4);
	});

	it('a leap under a fifth is not a transition', () => {
		const r = run([entry('a', '2', ['passaggio'])], notes([{ id: 'x', midi: 53, phrase: 0 }, { id: 'a', midi: 57, phrase: 0, leapFrom: 53 }, ...coda]));
		expect(r.shown[0].demands).toEqual(['register']);
		expect(r.shown[0].stakes).toBe(2);
	});

	it('the climax at a phrase top weighs twice: 1 × 3 = 3', () => {
		const r = run([entry('a', '1', ['passaggio'])], notes([{ id: 'a', midi: 58, phrase: 0 }, { id: 'b', midi: 50, phrase: 1 }, { id: 'c', midi: 52, phrase: 1 }]));
		expect(r.shown[0].weights).toEqual(['climax', 'phraseTop']);
		expect(r.shown[0].stakes).toBe(3);
	});

	it('the final note, tied chain included, carries weight', () => {
		const ns = notes([{ id: 'a', midi: 50, phrase: 0 }, { id: 'b', midi: 57, phrase: 0 }, { id: 'c', midi: 57, phrase: 0 }]);
		ns[2] = { ...ns[2], approach: { semitones: 0, band: 'tie', afterRest: false } };
		const r = run([entry('b', '2', ['passaggio'])], ns);
		expect(r.shown[0].weights).toContain('final');
	});
});

describe('gate 4, patterns fold', () => {
	const ns = notes([
		{ id: 'x', midi: 50, phrase: 0 },
		{ id: 'a', midi: 57, phrase: 0, leapFrom: 50 },
		{ id: 'y', midi: 50, phrase: 1 },
		{ id: 'b', midi: 57, phrase: 1, leapFrom: 50 },
	]);
	const r = run([entry('b', '7', ['passaggio'], { word: 'два' }), entry('a', '3', ['passaggio'], { word: 'раз' })], ns);

	it('the same vowel on the same pitch is one entry naming every bar, in order', () => {
		expect(r.shown).toHaveLength(1);
		expect(r.shown[0].bars).toEqual(['3', '7']);
		expect(r.folded).toHaveLength(1);
	});

	it('the folded line leads with the plural and drops the word, in both languages', () => {
		expect(gatedLines(r.shown, 'en')).toEqual(['Bars 3 and 7: your [ɑ] falls near your passaggio; expect the turn to want managing.']);
		expect(gatedLines(r.shown, 'fr')[0]).toMatch(/^Mesures 3 et 7 : votre \[ɑ\] tombe/);
	});

	it('three bars take the Oxford comma in English', () => {
		const g = { ...r.shown[0], bars: ['3', '7', '9'] };
		expect(gatedLines([g], 'en')[0]).toMatch(/^Bars 3, 7, and 9: /);
		expect(gatedLines([g], 'fr')[0]).toMatch(/^Mesures 3, 7 et 9 : /);
	});

	it('every watch line opens with the singular lead the fold replaces', () => {
		const keys = ['rangeBelow', 'rangeAbove', 'rangeBelowTranspose', 'rangeAboveTranspose', 'crossing', 'tighten', 'turnover', 'passaggioWord', 'passaggio', 'timbreOpenToClose', 'timbreCloseToOpen', 'timbreOpenToCloseWord', 'timbreCloseToOpenWord', 'sustain'];
		for (const key of keys) {
			for (const lang of ['en', 'fr'] as const) {
				expect(t(`watch.line.${key}`, lang).startsWith(t('watch.lead.one', lang)), `${key} ${lang}`).toBe(true);
			}
		}
	});
});

describe('order', () => {
	const ns = notes([
		{ id: 'x', midi: 50, phrase: 0 },
		{ id: 'a', midi: 57, phrase: 0, leapFrom: 50 },
		{ id: 'y', midi: 50, phrase: 1 },
		{ id: 'b', midi: 58, phrase: 1, leapFrom: 50 },
		{ id: 'z', midi: 50, phrase: 2 },
		{ id: 'c', midi: 59, phrase: 2, leapFrom: 50 },
		{ id: 'w', midi: 50, phrase: 3 },
		{ id: 'd', midi: 60, phrase: 3, leapFrom: 50, held: true },
	]);
	const advice = { advice: { action: 'iCrossing' as const, target: 'ɪ' } };
	const entries = ['a', 'b', 'c', 'd'].map((id, i) => entry(id, String(i + 1), ['passaggio'], advice));

	it('no page limit: three places on one page all print (r5)', () => {
		expect(run(entries, ns).shown).toHaveLength(4);
	});

	it('shows the survivors in performance order, not by stakes', () => {
		const r = run([...entries].reverse(), ns);
		expect(r.shown.map((g) => g.entry.eventId)).toEqual(['a', 'b', 'c', 'd']);
	});
});

describe('gate 5 and the line list', () => {
	it('nothing passes, nothing prints', () => {
		const r = run([entry('a', '1', ['passaggio'])], notes([{ id: 'a', midi: 57, phrase: 0 }, { id: 'b', midi: 60, phrase: 0 }]));
		expect(r.shown).toEqual([]);
		expect(gatedLines(r.shown, 'en')).toEqual([]);
	});

	it('two places that would print the same sentence at the same bar print once', () => {
		const ns = notes([
			{ id: 'x', midi: 50, phrase: 0 },
			{ id: 'a', midi: 57, phrase: 0, leapFrom: 50 },
			{ id: 'y', midi: 49, phrase: 1 },
			{ id: 'b', midi: 56, phrase: 1, leapFrom: 49 },
		]);
		const r = run([entry('a', '5', ['passaggio']), entry('b', '5', ['passaggio'])], ns);
		expect(r.shown).toHaveLength(2);
		expect(gatedLines(r.shown, 'en')).toHaveLength(1);
	});
});
