/**
 * N.160 step 2: the dry run of the heal. `planHeal` works out how each seat
 * would find its word in the poem the singer has now, and writes nothing.
 *
 * THE SCENARIO IS DANN'S, built from the fixture's own words. The seats are
 * placed from a poem typed over several lines, with «непроглядная» and
 * «безответная» whole. The poem then becomes the engraved text of
 * `sunless-01-engraved.musicxml`, on ONE line, where the engraver split
 * those two words («не проглядная», «без ответная»). No re-seat runs between
 * the two, which is the freeze (`memo-n160b` s0). Every address above line 0
 * is dead.
 *
 * The node pipeline carries no dictionary. Stress does not decide any
 * outcome here, because the heal compares letters only.
 */

import { describe, expect, it } from 'vitest';
import { processText } from '$lib/pipeline';
import type { LineData } from '$lib/types';
import { buildSlotQueue, firstPass, type PairingMap } from './pairings';
import { dryRunLog, planHeal, HEAL_KINDS, type HealPlan } from './heal';

function transcribe(text: string): LineData[] {
	return processText(text, { language: 'en' });
}

/** Every slot of the poem on its own note, `e0`, `e1`, ..., as a fresh score. */
function seat(lines: LineData[]): { map: PairingMap; notes: string[] } {
	const queue = buildSlotQueue(lines);
	const notes = queue.map((_, i) => `e${i}`);
	return { map: firstPass(notes, queue), notes };
}

/** The first four stanza lines of the fixture, as a singer would type them. */
const TYPED = [
	'Комнатка тесная, тихая, милая;',
	'Тень непроглядная, тень безответная;',
	'Дума глубокая, песня унылая;',
	'В бьющемся сердце надежда заветная,',
].join('\n');

/** The same words as the fixture engraves them, on one line. */
const ENGRAVED =
	'Комнатка тесная, тихая, милая; тень не проглядная, тень без ответная; ' +
	'дума глубокая, песня унылая; в бьющемся сердце надежда заветная,';

function casesOf(plan: HealPlan, word: string) {
	return plan.cases.filter((c) => c.word === word);
}

/** Every seat is in exactly one outcome, and the outcomes sum to the total. */
function expectReconciles(plan: HealPlan, map: PairingMap) {
	const seated = Object.values(map).filter((p) => p.kind === 'syllable').length;
	expect(plan.seated).toBe(seated);
	expect(plan.cases.length).toBe(seated);
	expect(new Set(plan.cases.map((c) => c.eventId)).size).toBe(seated);
	expect(HEAL_KINDS.reduce((n, k) => n + plan.counts[k], 0)).toBe(seated);
	for (const k of HEAL_KINDS) {
		expect(plan.cases.filter((c) => c.kind === k).length).toBe(plan.counts[k]);
	}
}

describe('N.160 step 2, the dry run of the heal', () => {
	it('an unchanged poem: every address holds, and nothing else happens', () => {
		const lines = transcribe(ENGRAVED);
		const { map, notes } = seat(lines);
		const plan = planHeal(map, lines, notes);
		expectReconciles(plan, map);
		expect(plan.counts.address).toBe(plan.seated);
		expect(plan.cases.every((c) => c.to && c.to.line === c.from.line)).toBe(true);
	});

	it("Dann's case: the address, the anchor, and the joined-run rule, and every seat lands", () => {
		const { map, notes } = seat(transcribe(TYPED));
		const now = transcribe(ENGRAVED);
		const plan = planHeal(map, now, notes);
		expectReconciles(plan, map);

		// Line 0 is the same four words in the same place.
		for (const w of ['Комнатка', 'тесная', 'тихая', 'милая']) {
			expect(casesOf(plan, w).every((c) => c.kind === 'address')).toBe(true);
		}
		// A whole word still in the poem, found by its letters, with case folded.
		const duma = casesOf(plan, 'Дума');
		expect(duma.map((c) => c.kind)).toEqual(['anchor', 'anchor']);
		expect(duma.map((c) => now[0].words[c.to!.word].cleanWord)).toEqual(['дума', 'дума']);
		// The engraver's split: one old word, two words now, syllable by syllable.
		const nepro = casesOf(plan, 'непроглядная');
		expect(nepro.every((c) => c.kind === 'joined')).toBe(true);
		expect(nepro.map((c) => `${now[0].words[c.to!.word].cleanWord}.${c.to!.slot}`)).toEqual([
			'не.0',
			'проглядная.0',
			'проглядная.1',
			'проглядная.2',
			'проглядная.3',
		]);
		expect(casesOf(plan, 'безответная').every((c) => c.kind === 'joined')).toBe(true);

		// Nothing rejected and nothing unfound: every seat is accounted for.
		expect(plan.counts.rejected + plan.counts.unfound).toBe(0);
		expect(plan.counts.address + plan.counts.anchor + plan.counts.joined).toBe(plan.seated);
	});

	it('«тень» twice: each seat resolves to its own occurrence, in the order the music sings them', () => {
		const { map, notes } = seat(transcribe(TYPED));
		const now = transcribe(ENGRAVED);
		const plan = planHeal(map, now, notes);

		const first = casesOf(plan, 'Тень');
		const second = casesOf(plan, 'тень');
		expect(first).toHaveLength(1);
		expect(second).toHaveLength(1);
		// Both were stored on line 1, which no longer exists.
		expect([first[0].from.line, second[0].from.line]).toEqual([1, 1]);

		const tens = now[0].words
			.map((w, i) => (w.cleanWord === 'тень' ? i : -1))
			.filter((i) => i >= 0);
		expect(tens).toHaveLength(2);
		expect(first[0].kind).toBe('anchor');
		expect(second[0].kind).toBe('anchor');
		// The first «тень» the music sings goes to the first in the poem.
		expect(first[0].to!.word).toBe(tens[0]);
		expect(second[0].to!.word).toBe(tens[1]);
		expect(first[0].note!).toBeLessThan(second[0].note!);

		// Control: the same seats, with the two notes' order swapped, swap too.
		// A lookup by first occurrence would send both to the first «тень».
		const swapped = notes.slice();
		const a = swapped.indexOf(first[0].eventId);
		const b = swapped.indexOf(second[0].eventId);
		[swapped[a], swapped[b]] = [swapped[b], swapped[a]];
		const re = planHeal(map, now, swapped);
		const reFirst = re.cases.find((c) => c.eventId === first[0].eventId)!;
		const reSecond = re.cases.find((c) => c.eventId === second[0].eventId)!;
		expect([reSecond.to!.word, reFirst.to!.word]).toEqual([tens[0], tens[1]]);
	});

	it('a whole-poem replacement: a lone common word is refused by the guard, and the rest is unfound', () => {
		const { map, notes } = seat(transcribe('Комнатка тесная,\nночь и мгла'));
		const now = transcribe('Комнатка тесная, день и свет');
		const plan = planHeal(map, now, notes);
		expectReconciles(plan, map);

		expect(casesOf(plan, 'Комнатка').every((c) => c.kind === 'address')).toBe(true);
		const i = casesOf(plan, 'и');
		expect(i).toHaveLength(1);
		expect(i[0].kind).toBe('rejected');
		expect(i[0].via).toBe('anchor');
		// It keeps what it shows: the guard's refusal names where it would have gone.
		expect(now[0].words[i[0].to!.word].cleanWord).toBe('и');
		expect(i[0].reason).toContain('guard');

		for (const w of ['ночь', 'мгла']) {
			const cs = casesOf(plan, w);
			expect(cs.length).toBeGreaterThan(0);
			expect(cs.every((c) => c.kind === 'unfound' && c.to === undefined)).toBe(true);
		}
	});

	it('the guard accepts a lone match that is the only seated word between two fixed seats', () => {
		const { map, notes } = seat(transcribe('Комнатка тесная\nночь\nмилая'));
		// «ночь» moves into line 0, away from both fixed neighbours; «милая» keeps 2-0.
		const now = transcribe('Комнатка тесная, дом, ночь, сад\nлес\nмилая');
		const plan = planHeal(map, now, notes);
		expectReconciles(plan, map);
		expect(casesOf(plan, 'милая').every((c) => c.kind === 'address')).toBe(true);
		const noch = casesOf(plan, 'ночь');
		expect(noch.map((c) => c.kind)).toEqual(['anchor']);
		expect(noch[0].to).toEqual({ line: 0, word: 3, slot: 0 });

		// Control: with no fixed seat after it, the same lone match is refused.
		const open = planHeal(map, transcribe('Комнатка тесная, дом, ночь, сад'), notes);
		expect(casesOf(open, 'ночь').map((c) => c.kind)).toEqual(['rejected']);
	});

	it('a seat stored before seats kept their word, and a seat on no note of this score, are unfound and counted', () => {
		const lines = transcribe('Комнатка тесная');
		const { map, notes } = seat(lines);
		const legacy: PairingMap = {
			...map,
			old: {
				kind: 'syllable',
				cyrillic: 'ком',
				ipa: 'kom',
				vowel: 'o',
				origin: { lineIndex: 4, wordIndex: 0, slotIndex: 0, word: undefined as unknown as string },
			},
			stray: {
				kind: 'syllable',
				cyrillic: 'тес',
				ipa: 'tʲes',
				vowel: 'e',
				origin: { lineIndex: 3, wordIndex: 1, slotIndex: 0, word: 'тесная' },
			},
		};
		const plan = planHeal(legacy, lines, [...notes, 'old']);
		expectReconciles(plan, legacy);
		const byId = Object.fromEntries(plan.cases.map((c) => [c.eventId, c]));
		expect(byId.old.kind).toBe('unfound');
		expect(byId.old.reason).toContain('before');
		expect(byId.stray.kind).toBe('unfound');
		expect(byId.stray.note).toBeNull();
		expect(byId.stray.reason).toContain('not a note');
	});

	it('writes nothing: the map and the lines come back byte-identical', () => {
		const { map, notes } = seat(transcribe(TYPED));
		const now = transcribe(ENGRAVED);
		const mapBefore = JSON.stringify(map);
		const linesBefore = JSON.stringify(now);
		const deepFreeze = <T>(o: T): T => {
			if (o && typeof o === 'object' && !Object.isFrozen(o)) {
				Object.freeze(o);
				for (const v of Object.values(o)) deepFreeze(v);
			}
			return o;
		};
		deepFreeze(map);
		deepFreeze(now);
		const plan = planHeal(map, now, notes);
		dryRunLog(plan);
		expect(JSON.stringify(map)).toBe(mapBefore);
		expect(JSON.stringify(now)).toBe(linesBefore);
	});

	it('the log: one totals line, then every seat, each under exactly one outcome', () => {
		const { map, notes } = seat(transcribe('Комнатка тесная,\nночь и мгла'));
		const plan = planHeal(map, transcribe('Комнатка тесная, день и свет'), notes);
		const log = dryRunLog(plan);
		expect(log[0]).toBe(
			`[Ilya] N.160 dry run: ${plan.seated} seated = ${plan.counts.address} address + 0 anchor + 0 joined + 1 rejected + ${plan.counts.unfound} unfound. Nothing written.`,
		);
		const listed = log.slice(1).flatMap((l) => l.split(': ').slice(1).join(': ').split(' | '));
		expect(listed).toHaveLength(plan.seated);
		expect(log.find((l) => l.includes(', rejected (1): '))).toMatch(
			/note \d+ e\d+ «и» of «и» 1-1\.0 -> 0-3\.0 by anchor \(the guard/,
		);
	});
});
