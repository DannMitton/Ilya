/**
 * refreshPairings tests (N.55b, reduced by N.112).
 *
 * THE CONTRACT UNDER TEST is the distinction Dann drew on 2026-08-13: a
 * re-division and a re-transcription are not the same event, and this function
 * acts on only the first.
 *
 * A re-division moves consonants between slots of one word. Nuclei ARE the
 * syllables, so they never move, the slot count cannot change, and the
 * singer's pairing still refers to the same nucleus. Its text is stale, not
 * wrong, so it is refreshed.
 *
 * A re-transcription puts a different word at the same position. That is a
 * different decision, so R6 holds and this leaves it alone. **N.112 retired
 * the drift REPORT, not this rule.** A changed poem is now handled by
 * `reseat.ts` at transcribe time, so by the time this runs a seat pointing at
 * a different word is a seat nothing has re-keyed, and the safe answer is
 * still to print what the singer decided. The drift list, `PairingDrift`,
 * `Reconciliation` and `auditPairings` went with the "Text changed n" line.
 *
 * The fixtures are hand-built rather than driven through the engine: the
 * rule under test is the refresh, and routing it through processText
 * would test the syllabifier instead.
 */

import { describe, expect, it } from 'vitest';
import {
	refreshPairings,
	mergeOnUpload,
	firstPass,
	syllableTargetIds,
	toggleMelisma,
	melismaIds,
	melismaRuns,
	pairedSyllableType,
	vacatedNotes,
	placeSyllable,
	nextOpenSyllableTarget,
	stressAcutedCyrillic,
} from './pairings';
import type { LineData, WordStackData } from '$lib/types';
import type { Pairing, PairingMap, Slot, TieAwareEvent } from './pairings';

const slot = (cyrillic: string, ipa: string, vowel: string | undefined, slotIndex: number, word: string): Slot => ({
	cyrillic,
	ipa,
	vowel,
	origin: { lineIndex: 0, wordIndex: 0, slotIndex, word },
});

/** Moscow, as the engine divides it. */
const BEFORE: Slot[] = [slot('мос', 'mos', 'o', 0, 'москва'), slot('ква', 'kva', 'a', 1, 'москва')];

/** The same word after an Inspector drag moves the consonant rightward. */
const REDIVIDED: Slot[] = [slot('мо', 'mo', 'o', 0, 'москва'), slot('сква', 'skva', 'a', 1, 'москва')];

/** A different word at the same position, with the same vowel count. */
const RETRANSCRIBED: Slot[] = [slot('бо', 'bo', 'o', 0, 'болото'), slot('лото', 'loto', 'o', 1, 'болото')];

const paired = (): PairingMap => ({
	e1: { kind: 'syllable', cyrillic: 'мос', ipa: 'mos', vowel: 'o', origin: { lineIndex: 0, wordIndex: 0, slotIndex: 0, word: 'москва' } },
});

const cyrOf = (map: PairingMap, id: string): string | undefined => {
	const p = map[id];
	return p?.kind === 'syllable' ? p.cyrillic : undefined;
};

describe('refreshPairings', () => {
	it('follows a stress the singer moved: the mark, the vowel, and nothing of the text', () => {
		const MARK = '\u02C8';
		const stale: PairingMap = {
			e1: { kind: 'syllable', cyrillic: 'мос', ipa: MARK + 'mos', vowel: 'o', origin: { lineIndex: 0, wordIndex: 0, slotIndex: 0, word: 'москва' } },
			e2: { kind: 'syllable', cyrillic: 'ква', ipa: 'kva', vowel: 'a', origin: { lineIndex: 0, wordIndex: 0, slotIndex: 1, word: 'москва' } },
		};
		const moved: Slot[] = [slot('мос', 'mas', 'a', 0, 'москва'), slot('ква', MARK + 'kva', 'a', 1, 'москва')];
		const out = refreshPairings(stale, moved);
		expect((out.e1 as { ipa: string }).ipa).toBe('mas');
		expect((out.e2 as { ipa: string }).ipa).toBe(MARK + 'kva');
		expect(cyrOf(out, 'e1')).toBe('мос');
	});

	it('does not refresh the IPA of a different word', () => {
		const diffWord: Slot[] = [slot('мос', '\u02C8mos', 'o', 0, 'болото')];
		expect((refreshPairings(paired(), diffWord).e1 as { ipa: string }).ipa).toBe('mos');
	});

	it('refreshes a re-divided pairing', () => {
		const map = refreshPairings(paired(), REDIVIDED);
		expect(cyrOf(map, 'e1')).toBe('мо');
		const p = map.e1;
		expect(p.kind === 'syllable' && p.ipa).toBe('mo');
	});

	it('leaves a re-transcription exactly as the singer decided it', () => {
		expect(cyrOf(refreshPairings(paired(), RETRANSCRIBED), 'e1')).toBe('мос');
	});

	it('leaves an unchanged queue alone', () => {
		expect(refreshPairings(paired(), BEFORE)).toEqual(paired());
	});

	it('leaves a pairing standing when its origin no longer exists', () => {
		expect(cyrOf(refreshPairings(paired(), []), 'e1')).toBe('мос');
	});

	it('passes melisma and empty pairings through untouched', () => {
		const map: PairingMap = { e1: { kind: 'melisma' }, e2: { kind: 'empty' } };
		expect(refreshPairings(map, REDIVIDED)).toEqual(map);
	});

	it('leaves a pairing stored before origin.word existed exactly as stored', () => {
		const legacy = {
			e1: { kind: 'syllable', cyrillic: 'мос', ipa: 'mos', vowel: 'o', origin: { lineIndex: 0, wordIndex: 0, slotIndex: 0 } },
		} as unknown as PairingMap;
		expect(cyrOf(refreshPairings(legacy, REDIVIDED), 'e1')).toBe('мос');
	});

	it('does not mutate the map it was given', () => {
		const original = paired();
		refreshPairings(original, REDIVIDED);
		expect(cyrOf(original, 'e1')).toBe('мос');
	});
});

/* ── N.142, a tie is prolongation ────────────────────────────────── */

describe('syllableTargetIds', () => {
	const note = (id: string, tied?: TieAwareEvent['tied']): TieAwareEvent => ({ id, type: 'note', tied });
	const rest = (id: string): TieAwareEvent => ({ id, type: 'rest' });

	it('excludes rests, as it always did', () => {
		expect(syllableTargetIds([note('n1'), rest('r1'), note('n2')])).toEqual(['n1', 'n2']);
	});

	it('excludes a plain tie\'s continuation', () => {
		const events = [note('n1', { type: 'start' }), note('n2', { type: 'stop' })];
		expect(syllableTargetIds(events)).toEqual(['n1']);
	});

	it('excludes a tie\'s continuation across a barline (measure is not this file\'s concern)', () => {
		// Barlines are not represented here at all; the point is that nothing
		// about crossing one matters to this walk.
		const events = [note('m1n2', { type: 'start' }), note('m2n1', { type: 'stop' })];
		expect(syllableTargetIds(events)).toEqual(['m1n2']);
	});

	it('excludes every note in a chain of three tied notes, keeping only the first', () => {
		const events = [
			note('n1', { type: 'start' }),
			note('n2', { type: 'continue' }),
			note('n3', { type: 'stop' }),
		];
		expect(syllableTargetIds(events)).toEqual(['n1']);
	});

	it('a rest sitting between two events breaks nothing in the walk', () => {
		const events = [note('n1', { type: 'start' }), rest('r1'), note('n2', { type: 'stop' })];
		expect(syllableTargetIds(events)).toEqual(['n1']);
	});

	it('a singer-ADDED tie excludes the following note even though its own `tied` is absent', () => {
		// `correction.ts`'s `amend` writes `tied: { type: 'start' }` onto the
		// note the correction is keyed on and never touches the note after.
		const events = [note('n1', { type: 'start' }), note('n2')];
		expect(syllableTargetIds(events)).toEqual(['n1']);
	});

	it('a singer-REMOVED tie no longer excludes the following note, even though it still carries a stale `stop`', () => {
		// The correction deletes `tied` on n1 only; n2's own field is whatever
		// the reader wrote and is not consulted for n2's own eligibility.
		const events = [note('n1'), note('n2', { type: 'stop' })];
		expect(syllableTargetIds(events)).toEqual(['n1', 'n2']);
	});

	it('let-ring is not a continuation: it excludes nothing, before or after it', () => {
		const events = [note('n1', { type: 'let-ring' }), note('n2')];
		expect(syllableTargetIds(events)).toEqual(['n1', 'n2']);
	});
});

/* ── The merge rule, N.67 step 3, design §2.6 ────────────────────── */

describe('mergeOnUpload', () => {
	// N.68 in one line: an upload never destroys placements; only the singer
	// does, on purpose. Every test below is a way of saying that.

	it('proposes a first pass into an EMPTY map when the score has no lyrics', () => {
		// N.55a's fresh path, preserved exactly: Ilya proposes where the score
		// is silent.
		const result = mergeOnUpload({}, ['e1', 'e2'], ['e1', 'e2'], BEFORE, true);

		expect(result.proposed).toBe(true);
		expect(Object.keys(result.map)).toEqual(['e1', 'e2']);
		expect(result.map.e1).toEqual(firstPass(['e1', 'e2'], BEFORE).e1);
	});

	it('proposes NOTHING when the score carries its own underlay', () => {
		// Where the score speaks, Ilya reads it rather than talking over it.
		const result = mergeOnUpload({}, ['e1', 'e2'], ['e1', 'e2'], BEFORE, false);

		expect(result.proposed).toBe(false);
		expect(result.map).toEqual({});
	});

	it('KEEPS an existing map rather than rebuilding it. This is N.68', () => {
		// The old code ran the first pass again here, silently replacing the
		// singer's own decisions with the default layout.
		const mine = paired();

		const result = mergeOnUpload(mine, ['e1', 'e2'], ['e1', 'e2'], BEFORE, true);

		expect(result.map).toBe(mine);
		expect(result.proposed).toBe(false);
	});

	it('keeps an existing map even when the score carries lyrics', () => {
		// The other half of N.68, and the louder one: this branch used to set
		// the map to {} outright, erasing every placement on any lyric-bearing
		// upload.
		const mine = paired();

		expect(mergeOnUpload(mine, ['e1', 'e2'], ['e1', 'e2'], BEFORE, false).map).toBe(mine);
	});

	it('carries a placement across by its positional key', () => {
		// The keys are the parsers' own positional event ids, so a note that
		// stayed where it was keeps its pairing with no matching by text.
		const mine = paired();

		const result = mergeOnUpload(mine, ['e1', 'e2', 'e3'], ['e1', 'e2', 'e3'], BEFORE, true);

		expect(result.map.e1.kind).toBe('syllable');
		expect(result.orphaned).toEqual([]);
	});

	it('reports a placement whose note the new score does not contain, and KEEPS it', () => {
		const mine = paired();

		const result = mergeOnUpload(mine, ['e2', 'e3'], ['e2', 'e3'], BEFORE, true);

		expect(result.orphaned).toEqual(['e1']);
		// Reported, not dropped. A singer who re-exported a shortened score has
		// not asked Ilya to throw their work away.
		expect(result.map.e1).toBeDefined();
	});

	it('reports nothing on a fresh proposal', () => {
		expect(mergeOnUpload({}, ['e1'], ['e1'], BEFORE, true).orphaned).toEqual([]);
	});

	it('N.142: a tie continuation counts as PRESENT (not orphaned) but is never a firstPass target', () => {
		// e2 is a tie's continuation: still a real, present note (eventIds
		// carries it), but firstPass may not write into it (targetIds does not).
		const result = mergeOnUpload({}, ['e1', 'e2', 'e3'], ['e1', 'e3'], BEFORE, true);

		expect(Object.keys(result.map)).toEqual(['e1', 'e3']);
		expect(result.map.e2).toBeUndefined();
	});

	it('N.142: a placement on a tie continuation is PRESENT, not orphaned, once the score still carries that note', () => {
		// A legacy placement seated (before N.142) on what is now recognised as
		// a tie's continuation. The note itself did not disappear from the
		// score, so it must not be reported as orphaned; N.142's own migration
		// of a misplaced syllable is a separate concern from existence.
		const mine = { e2: { kind: 'syllable', cyrillic: 'x', ipa: 'x', vowel: 'x', origin: { lineIndex: 0, wordIndex: 0, slotIndex: 0, word: 'x' } } } as PairingMap;

		const result = mergeOnUpload(mine, ['e1', 'e2', 'e3'], ['e1', 'e3'], BEFORE, true);

		expect(result.orphaned).toEqual([]);
	});
});

/* ── N.113, the melisma ─────────────────────────────────────────────
   Numbered by Dann 2026-09-06, step 3 of the text-to-score sequence. The
   `melisma` kind has existed since N.55b and nothing wrote it until now.
   Ilya still never creates one (E.46); only the singer's press does. */

const IDS = ['n0', 'n1', 'n2', 'n3', 'n4', 'n5'];

const syl = (c: string, wi: number): Pairing => ({
	kind: 'syllable',
	cyrillic: c,
	ipa: c,
	vowel: undefined,
	origin: { lineIndex: 0, wordIndex: wi, slotIndex: 0, word: c },
});

const shown = (m: PairingMap): string =>
	IDS.map((id) => {
		const p = m[id];
		return p === undefined ? '_' : p.kind === 'melisma' ? '~' : p.kind === 'empty' ? 'e' : p.cyrillic;
	}).join(' ');

describe('toggleMelisma', () => {
	it('marks an undecided note and moves nothing', () => {
		const map: PairingMap = { n0: syl('ой', 0) };
		const r = toggleMelisma(map, IDS, 'n1');
		expect(r.set).toBe(true);
		expect(shown(r.map)).toBe('ой ~ _ _ _ _');
		expect(r.displaced).toEqual([]);
	});

	it('shifts a seated note forward, then marks it', () => {
		const map: PairingMap = { n0: syl('ой', 0), n1: syl('да', 1), n2: syl('нет', 2) };
		const r = toggleMelisma(map, IDS, 'n1');
		expect(r.set).toBe(true);
		// `да` and `нет` each move one note forward and n1 takes the mark.
		expect(shown(r.map)).toBe('ой ~ да нет _ _');
		expect(r.displaced).toEqual([]);
	});

	it('reports a seat the shift pushed off the end rather than losing it', () => {
		const short = ['n0', 'n1'];
		const map: PairingMap = { n0: syl('ой', 0), n1: syl('да', 1) };
		const r = toggleMelisma(map, short, 'n1');
		expect(r.displaced).toEqual([syl('да', 1)]);
	});

	it('clears a marked note back to UNDECIDED, never to empty', () => {
		const map: PairingMap = { n0: syl('ой', 0), n1: { kind: 'melisma' } };
		const r = toggleMelisma(map, IDS, 'n1');
		expect(r.set).toBe(false);
		expect(Object.hasOwn(r.map, 'n1')).toBe(false);
		expect(shown(r.map)).toBe('ой _ _ _ _ _');
	});

	it('round-trips: mark an undecided note and clear it, and the map returns', () => {
		const map: PairingMap = { n0: syl('ой', 0), n2: syl('да', 1) };
		const there = toggleMelisma(map, IDS, 'n1');
		const back = toggleMelisma(there.map, IDS, 'n1');
		expect(back.map).toEqual(map);
	});

	it('does not round-trip a SEATED note, and that is the shift being honest', () => {
		// Marking a seated note moves its syllable forward; clearing the mark
		// does not move it back, because a clear is not an undo. The Undo pill
		// is what restores the whole map (N.111-3b's snapshot stack).
		const map: PairingMap = { n0: syl('ой', 0), n1: syl('да', 1) };
		const back = toggleMelisma(toggleMelisma(map, IDS, 'n1').map, IDS, 'n1');
		expect(shown(back.map)).toBe('ой _ да _ _ _');
	});

	it('does not mutate the map it was given', () => {
		const map: PairingMap = { n0: syl('ой', 0), n1: syl('да', 1) };
		toggleMelisma(map, IDS, 'n1');
		expect(shown(map)).toBe('ой да _ _ _ _');
	});

	it('N.142: refuses to mark a note that is not in eventIds (a tie continuation)', () => {
		// n1 excluded, as syllableTargetIds would exclude a tie's continuation.
		const withoutN1 = IDS.filter((id) => id !== 'n1');
		const map: PairingMap = { n0: syl('ой', 0) };
		const r = toggleMelisma(map, withoutN1, 'n1');
		expect(r.set).toBe(false);
		expect(Object.hasOwn(r.map, 'n1')).toBe(false);
		expect(r.map).toEqual(map);
	});

	it('N.142: still clears a mark predating the rule, even though the note is no longer in eventIds', () => {
		const withoutN1 = IDS.filter((id) => id !== 'n1');
		const map: PairingMap = { n1: { kind: 'melisma' } };
		const r = toggleMelisma(map, withoutN1, 'n1');
		expect(r.set).toBe(false);
		expect(Object.hasOwn(r.map, 'n1')).toBe(false);
	});
});

describe('melismaIds', () => {
	it('names the marked notes and nothing else', () => {
		const map: PairingMap = { n0: syl('ой', 0), n1: { kind: 'melisma' }, n2: { kind: 'empty' } };
		expect([...melismaIds(map)]).toEqual(['n1']);
	});
});

describe('melismaRuns', () => {
	it('finds one run of consecutive marks after a seated note', () => {
		const map: PairingMap = { n0: syl('ой', 0), n1: { kind: 'melisma' }, n2: { kind: 'melisma' } };
		expect(melismaRuns(map, IDS)).toEqual([{ startId: 'n0', continuationIds: ['n1', 'n2'] }]);
	});

	it('finds two runs when a seated note separates them', () => {
		const map: PairingMap = {
			n0: syl('ой', 0),
			n1: { kind: 'melisma' },
			n2: syl('да', 1),
			n3: { kind: 'melisma' },
		};
		expect(melismaRuns(map, IDS)).toEqual([
			{ startId: 'n0', continuationIds: ['n1'] },
			{ startId: 'n2', continuationIds: ['n3'] },
		]);
	});

	it('opens NO run for a mark with no seated note before it', () => {
		// A state the hand can produce: press Melisma on the first note, or on
		// one whose predecessor is undecided. It draws nothing and the mark
		// stays in the map.
		expect(melismaRuns({ n0: { kind: 'melisma' } }, IDS)).toEqual([]);
		expect(melismaRuns({ n2: { kind: 'melisma' } }, IDS)).toEqual([]);
	});

	it('breaks a run at an undecided note, so the mark after it opens nothing', () => {
		const map: PairingMap = {
			n0: syl('ой', 0),
			n1: { kind: 'melisma' },
			// n2 undecided
			n3: { kind: 'melisma' },
		};
		expect(melismaRuns(map, IDS)).toEqual([{ startId: 'n0', continuationIds: ['n1'] }]);
	});

	it('is empty when nothing is marked', () => {
		expect(melismaRuns({ n0: syl('ой', 0) }, IDS)).toEqual([]);
	});
});

describe('vacatedNotes', () => {
	it('names the bare notes after the last seat once the queue is exhausted', () => {
		const map: PairingMap = { n0: syl('ой', 0), n1: syl('да', 1) };
		expect([...vacatedNotes(map, IDS, true)]).toEqual(['n2', 'n3', 'n4', 'n5']);
	});

	it('names nothing outside the run while the queue still has slots to place', () => {
		const map: PairingMap = { n0: syl('ой', 0), n1: syl('да', 1) };
		expect(vacatedNotes(map, IDS, false).size).toBe(0);
	});

	it('names nothing when no note is seated at all', () => {
		expect(vacatedNotes({}, IDS, true).size).toBe(0);
	});

	it('leaves a marked note alone, because a melisma is a decision', () => {
		const map: PairingMap = { n0: syl('ой', 0), n1: { kind: 'melisma' } };
		// n1 is decided, so it is not vacated; n2 onward are.
		expect([...vacatedNotes(map, IDS, true)]).toEqual(['n2', 'n3', 'n4', 'n5']);
	});

	it('measures the run from the last SEATED note, not the last entry', () => {
		const map: PairingMap = { n0: syl('ой', 0), n4: { kind: 'melisma' } };
		expect([...vacatedNotes(map, IDS, true)]).toEqual(['n1', 'n2', 'n3', 'n5']);
	});

	/* ── N.113a, the defect Dann walked on `e1bcb67` ──────────────────────
	   *"after a Melisma press had pushed one syllable off the end, deleting
	   много left the last note reading ка ка on both lines."* The melisma
	   displaced a slot, so `queueExhausted` was false for ever after, and the
	   gate that guards the hand's affordance shut the blanking off everywhere.
	   Inside the run there is no gate any more. */

	it('vacates a hole INSIDE the run even while the queue is not exhausted', () => {
		// `много`'s note, vacated in place by the deletion, with a displaced
		// syllable still unplaced so the gate reads false.
		const map: PairingMap = { n0: syl('ой', 0), n2: syl('да', 1), n3: syl('нет', 2) };
		expect([...vacatedNotes(map, IDS, false)]).toEqual(['n1']);
	});

	it('vacates two adjacent holes inside the run with the gate shut', () => {
		const map: PairingMap = { n0: syl('ой', 0), n3: syl('да', 1) };
		expect([...vacatedNotes(map, IDS, false)]).toEqual(['n1', 'n2']);
	});

	it('still keeps the file\'s words past the last seat while slots wait', () => {
		// The hand's affordance, unchanged: only the hole inside the run goes.
		const map: PairingMap = { n0: syl('ой', 0), n2: syl('да', 1) };
		const out = vacatedNotes(map, IDS, false);
		expect([...out]).toEqual(['n1']);
		expect(out.has('n3')).toBe(false);
	});
});

/* ── N.113b item 3: where inside its word each seated syllable stands ── */

describe('pairedSyllableType', () => {
	const seat = (
		cyrillic: string,
		lineIndex: number,
		wordIndex: number,
		slotIndex: number,
		word: string,
	): Pairing => ({
		kind: 'syllable',
		cyrillic,
		ipa: '',
		vowel: undefined,
		origin: { lineIndex, wordIndex, slotIndex, word },
	});

	it('opens, carries and closes a polysyllable', () => {
		const map: PairingMap = {
			a: seat('\u043f\u043e', 0, 0, 0, '\u043f\u043e\u0433\u0440\u0443\u0437\u0438\u0441\u044c'),
			b: seat('\u0433\u0440\u0443', 0, 0, 1, '\u043f\u043e\u0433\u0440\u0443\u0437\u0438\u0441\u044c'),
			c: seat('\u0437\u0438', 0, 0, 2, '\u043f\u043e\u0433\u0440\u0443\u0437\u0438\u0441\u044c'),
			d: seat('\u0441\u044c', 0, 0, 3, '\u043f\u043e\u0433\u0440\u0443\u0437\u0438\u0441\u044c'),
		};
		expect(pairedSyllableType(map)).toEqual({ a: 'start', b: 'middle', c: 'middle', d: 'end' });
	});

	it('calls a one-syllable word WHOLE, which takes an extender of its own', () => {
		const map: PairingMap = { a: seat('\u0442\u044b', 0, 0, 0, '\u0442\u044b') };
		expect(pairedSyllableType(map)).toEqual({ a: 'whole' });
	});

	it('keeps two words apart, so the second opens rather than continues', () => {
		const map: PairingMap = {
			a: seat('\u043f\u0435\u0441', 0, 3, 0, '\u043f\u0435\u0441\u043d\u044f'),
			b: seat('\u043d\u044f', 0, 3, 1, '\u043f\u0435\u0441\u043d\u044f'),
			c: seat('\u0443', 0, 4, 0, '\u0443\u043d\u044b\u043b\u0430\u044f'),
			d: seat('\u043d\u044b', 0, 4, 1, '\u0443\u043d\u044b\u043b\u0430\u044f'),
			e: seat('\u043b\u0430', 0, 4, 2, '\u0443\u043d\u044b\u043b\u0430\u044f'),
			f: seat('\u044f', 0, 4, 3, '\u0443\u043d\u044b\u043b\u0430\u044f'),
		};
		// This is Dann's own measure 7: «пе-сня у-ны-ла-я». «ня» closes its
		// word, which is what earns the sustain after it a baseline extender.
		expect(pairedSyllableType(map)).toEqual({
			a: 'start',
			b: 'end',
			c: 'start',
			d: 'middle',
			e: 'middle',
			f: 'end',
		});
	});

	it('separates two seats that share a coordinate but not a word', () => {
		// Score-origin seats carry `lineIndex 0` with their own running
		// `wordIndex` (`memo-n113a-walk_r1_2026-09-07.md` §9.2), so they share
		// a coordinate space with the poem's line 0. The word text is what
		// keeps them apart, and without it these four would read as one word.
		const map: PairingMap = {
			a: seat('\u043c\u043e\u0441', 0, 0, 0, '\u043c\u043e\u0441\u043a\u0432\u0430'),
			b: seat('\u043a\u0432\u0430', 0, 0, 1, '\u043c\u043e\u0441\u043a\u0432\u0430'),
			c: seat('\u0434\u0430', 0, 0, 0, '\u0434\u0430'),
		};
		expect(pairedSyllableType(map)).toEqual({ a: 'start', b: 'end', c: 'whole' });
	});

	it('says nothing for a melisma, an empty note, or an empty map', () => {
		const map: PairingMap = {
			a: { kind: 'melisma' },
			b: { kind: 'empty' },
		};
		expect(pairedSyllableType(map)).toBeUndefined();
		expect(pairedSyllableType({})).toBeUndefined();
		expect(pairedSyllableType(undefined)).toBeUndefined();
	});
});

/* ── N.147: the loupe's syllable tap places on the SELECTED note, and a note
   tap no longer places at all. `placeSyllable` and `nextOpenSyllableTarget`
   are the whole of that gesture's logic, pulled into this file because
   `+page.svelte` has no test harness of its own (no `.svelte.test.ts` file
   exists anywhere in this tree; confirmed by search, N.147 step 0). ── */

describe('placeSyllable', () => {
	it('writes the slot onto the note, the IPA included', () => {
		const s = slot('мос', 'mós', 'o', 0, 'москва');
		const out = placeSyllable({}, IDS, 'n0', s);
		expect(out).toEqual({
			n0: { kind: 'syllable', cyrillic: 'мос', ipa: 'mós', vowel: 'o', origin: s.origin },
		});
	});

	it('overwrites a note that already carries a pairing', () => {
		const map: PairingMap = { n0: syl('ой', 0) };
		const s = slot('да', 'da', 'a', 1, 'слово');
		const out = placeSyllable(map, IDS, 'n0', s);
		expect(out).toEqual({ n0: { kind: 'syllable', cyrillic: 'да', ipa: 'da', vowel: 'a', origin: s.origin } });
	});

	it('refuses a note not in eventIds, the N.142 guard carried over from a rest or a tie continuation', () => {
		const withoutN1 = IDS.filter((id) => id !== 'n1');
		const out = placeSyllable({}, withoutN1, 'n1', slot('да', 'da', 'a', 0, 'да'));
		expect(out).toBeNull();
	});

	it('does not mutate the map it was given', () => {
		const map: PairingMap = { n0: syl('ой', 0) };
		placeSyllable(map, IDS, 'n1', slot('да', 'da', 'a', 1, 'слово'));
		expect(map).toEqual({ n0: syl('ой', 0) });
	});
});

describe('nextOpenSyllableTarget', () => {
	it('finds the next undecided note past fromId', () => {
		const map: PairingMap = { n0: syl('ой', 0), n1: syl('да', 1) };
		expect(nextOpenSyllableTarget(map, IDS, 'n1')).toBe('n2');
	});

	it('skips a melisma or an empty mark: both are decisions, not open notes', () => {
		const map: PairingMap = { n1: { kind: 'melisma' }, n2: { kind: 'empty' } };
		expect(nextOpenSyllableTarget(map, IDS, 'n0')).toBe('n3');
	});

	it('stops at the end rather than wrapping', () => {
		const map: PairingMap = {
			n0: syl('a', 0),
			n1: syl('b', 0),
			n2: syl('c', 0),
			n3: syl('d', 0),
			n4: syl('e', 0),
			n5: syl('f', 0),
		};
		expect(nextOpenSyllableTarget(map, IDS, 'n4')).toBeNull();
	});

	it('searches from the start when fromId is not itself in eventIds', () => {
		const map: PairingMap = { n0: syl('ой', 0) };
		expect(nextOpenSyllableTarget(map, IDS, 'not-an-id')).toBe('n1');
	});
});

/* N.119: the stress acute on the score's Cyrillic. Hand-built fixtures: the rule
   under test is the derivation and its four suppressions, not the engine. */
describe('stressAcutedCyrillic', () => {
	const ACUTE = '\u0301';
	const MARK = '\u02C8';
	const word = (over: Partial<WordStackData>): WordStackData =>
		({
			cleanWord: 'вода',
			stressIndex: 1,
			stressSource: 'dictionary',
			isProclitic: false,
			isEnclitic: false,
			...over,
		}) as WordStackData;
	const linesOf = (w: WordStackData): LineData[] => [{ words: [w] } as unknown as LineData];
	const pair = (cyrillic: string, ipa: string, w: string): PairingMap => ({
		e1: { kind: 'syllable', cyrillic, ipa, vowel: undefined, origin: { lineIndex: 0, wordIndex: 0, slotIndex: 0, word: w } },
	});
	const run = (map: PairingMap, lines: LineData[]) => stressAcutedCyrillic({ e1: (map.e1 as { cyrillic: string }).cyrillic }, map, lines).e1;

	it('marks the vowel of the syllable whose own IPA holds the stress mark', () => {
		expect(run(pair('да', MARK + 'da', 'вода'), linesOf(word({})))).toBe('д' + '\u0430' + ACUTE);
	});
	it('leaves an unstressed syllable bare', () => {
		expect(run(pair('во', 'va', 'вода'), linesOf(word({})))).toBe('во');
	});
	it('marks under a fused vowelless clitic and keeps the clitic', () => {
		expect(run(pair('в\u00A0лес', MARK + 'vlʲes', 'лес'), linesOf(word({ cleanWord: 'лес' })))).toBe('в\u00A0л' + '\u0435' + ACUTE + 'с');
	});
	it('never marks ё', () => {
		expect(run(pair('нёс', MARK + 'nʲos', 'нёс'), linesOf(word({ cleanWord: 'нёс' })))).toBe('нёс');
	});
	it('suppresses a negative or absent stress index', () => {
		expect(run(pair('да', MARK + 'da', 'вода'), linesOf(word({ stressIndex: -1 })))).toBe('да');
		expect(run(pair('да', MARK + 'da', 'вода'), linesOf(word({ stressIndex: undefined as unknown as number })))).toBe('да');
	});
	it('suppresses a clitic, by source or by flag', () => {
		expect(run(pair('да', MARK + 'da', 'вода'), linesOf(word({ stressSource: 'clitic' })))).toBe('да');
		expect(run(pair('да', MARK + 'da', 'вода'), linesOf(word({ isProclitic: true })))).toBe('да');
		expect(run(pair('да', MARK + 'da', 'вода'), linesOf(word({ isEnclitic: true })))).toBe('да');
	});
	it('suppresses inferred stress', () => {
		expect(run(pair('да', MARK + 'da', 'вода'), linesOf(word({ stressSource: 'inferred' })))).toBe('да');
	});
	it('leaves a syllable bare when its word cannot be confirmed', () => {
		expect(run(pair('да', MARK + 'da', 'вода'), linesOf(word({ cleanWord: 'другое' })))).toBe('да');
		expect(run(pair('да', MARK + 'da', 'вода'), [])).toBe('да');
	});
	it('leaves a syllable with more than one vowel bare', () => {
		expect(run(pair('вода', MARK + 'vada', 'вода'), linesOf(word({})))).toBe('вода');
	});
	it('returns its input when there is no map or no lines', () => {
		const cyr = { e1: 'да' };
		expect(stressAcutedCyrillic(cyr, undefined, [])).toBe(cyr);
		expect(stressAcutedCyrillic(cyr, pair('да', MARK + 'da', 'вода'), undefined)).toBe(cyr);
	});
});
