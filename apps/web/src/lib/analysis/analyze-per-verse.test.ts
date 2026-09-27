/**
 * analyzePerVerse tests (§A.73, §A.98; Option 1).
 *
 * The contract under test is the ORCHESTRATION: one overlay per sung verse,
 * each produced by the unchanged verse-agnostic `analyzeScore` fed that
 * verse's resolver. The vowels themselves come from the same GraysonEngine
 * pipeline the resolver reads, so what these tests pin is that the right
 * verses are enumerated, that each carries its own acoustic events, and that
 * the shared notes read a different operative vowel per verse.
 */

import { describe, expect, it } from 'vitest';
import type {
	ParsedScore,
	Pitch,
	SyllableInfo,
	VerseSyllable,
	VocalLineEvent,
	VoiceProfileSnapshot
} from '@ilya/score-parser';
import { analyzePerVerse } from './analyze-per-verse';

const P = (step: Pitch['step'], octave: number): Pitch => ({ step, octave, alter: 0 });
type SylType = SyllableInfo['type'];

function note(
	id: string,
	syllable?: { text: string; type: SylType; verse?: number; versesInfo?: VerseSyllable[] }
): VocalLineEvent {
	return {
		id,
		type: 'note',
		measureIndex: 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } },
		pitch: P('C', 4),
		...(syllable
			? {
					syllable: {
						id: `s-${id}`,
						text: syllable.text,
						type: syllable.type,
						verseNumber: syllable.verse ?? 1,
						wordContext: syllable.text,
						...(syllable.versesInfo ? { versesInfo: syllable.versesInfo } : {})
					}
				}
			: {})
	};
}

function scoreOf(events: VocalLineEvent[]): ParsedScore {
	return {
		source: { format: 'mnx', fidelity: 'native', origin: 'mnx-direct', sourceWarnings: [] },
		vocalPart: { partId: 'P1', partName: 'Voice' },
		measures: [],
		keySignatures: [],
		timeSignatures: [],
		tempoMarkings: [],
		vocalLine: events
	};
}

// A snapshot with an fR1 for all ten sung vowels, so whichever vowel a verse
// resolves has a forecast and the overlay carries acoustic events. Values are
// plausible-but-arbitrary Hz; the test asserts structure, not their magnitude.
const snapshot: VoiceProfileSnapshot = {
	fR1: { i: 280, e: 400, ɪ: 380, ɨ: 390, ɛ: 550, a: 700, ɑ: 750, ʌ: 650, o: 500, u: 320 }
};

// Pin generatedAt so the overlays are deterministic across the run.
const FIXED = { generatedAt: '2026-07-17T00:00:00.000Z' };

describe('analyzePerVerse', () => {
	// A sparse two-verse line on three shared notes: verse 1 sings «вас» then
	// «нет» (melisma across m2); verse 2 sings «го»+«ре» = «горе» (melisma
	// across m3). Same notes, different text per verse.
	const parsed = scoreOf([
		note('m1', {
			text: 'вас',
			type: 'whole',
			verse: 1,
			versesInfo: [
				{ verseNumber: 1, text: 'вас', type: 'whole' },
				{ verseNumber: 2, text: 'го', type: 'start' }
			]
		}),
		note('m2', { text: 'ре', type: 'end', verse: 2 }),
		note('m3', { text: 'нет', type: 'whole', verse: 1 })
	]);

	it('produces one overlay per sung verse, keyed ascending', () => {
		const overlays = analyzePerVerse(parsed, snapshot, FIXED);
		expect([...overlays.keys()]).toEqual([1, 2]);
	});

	it('each verse carries acoustic events, and the shared note reads a different vowel per verse', () => {
		const overlays = analyzePerVerse(parsed, snapshot, FIXED);
		const v1 = overlays.get(1)!;
		const v2 = overlays.get(2)!;
		expect(Object.keys(v1.events).length).toBeGreaterThan(0);
		expect(Object.keys(v2.events).length).toBeGreaterThan(0);
		// m1 is «вас» in verse 1 but the first syllable of «горе» in verse 2:
		// the same note, a different operative vowel, proving per-verse analysis.
		expect(v1.events['m1']?.vowel).toBeDefined();
		expect(v2.events['m1']?.vowel).toBeDefined();
		expect(v1.events['m1'].vowel).not.toBe(v2.events['m1'].vowel);
	});

	it('shares one melody-derived sourceScoreId across verses (cache by verse, not by id)', () => {
		const overlays = analyzePerVerse(parsed, snapshot, FIXED);
		expect(overlays.get(1)!.sourceScoreId).toBe(overlays.get(2)!.sourceScoreId);
	});

	it('returns an empty map for a score with no lyrics', () => {
		const bare = scoreOf([note('x1'), note('x2')]);
		expect(analyzePerVerse(bare, snapshot, FIXED).size).toBe(0);
	});
});
