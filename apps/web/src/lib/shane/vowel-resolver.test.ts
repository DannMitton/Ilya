/**
 * buildVowelResolver tests (v38 §E.5, the Shane↔Ilya seam).
 *
 * The contract under test is the MAPPING, not the IPA: the vowels
 * themselves come verbatim from GraysonEngine via processText, so the
 * expected values here are extracted from the same pipeline output the
 * resolver reads (independent extraction path in the test, same ground
 * truth). What the tests pin down is the plumbing that could silently
 * lie: word reconstruction from syllabic roles, the vowelless-syllable
 * merge («сь»), melisma sustain across syllable-less notes, the rest
 * boundary, the ten-vowel membership guard, and the honest-bail rules
 * (alignment loss, syllable-count mismatch, no lyrics at all).
 */

import { describe, expect, it } from 'vitest';
import { demoScore } from '@ilya/score-parser';
import type { ParsedScore, Pitch, VocalLineEvent } from '@ilya/score-parser';
import { processText } from '$lib/pipeline';
import { buildVowelResolver, buildUnderlayResolvers } from './vowel-resolver';
import type { LineData, UserStressOverride, WordStackData } from '$lib/types';

const TEN_VOWELS = new Set(['i', 'e', 'ɪ', 'ɨ', 'ɛ', 'a', 'ɑ', 'ʌ', 'o', 'u']);

// ── Synthetic-score helpers (shape mirrors demo-fixture.ts) ─────────

const P = (step: Pitch['step'], octave: number): Pitch => ({ step, octave, alter: 0 });

function note(
	id: string,
	syllable?: { text: string; type: 'whole' | 'start' | 'middle' | 'end'; verse?: number }
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
						// wordContext is required by SyllableInfo; the resolver
						// never reads it, so the syllable text suffices here.
						wordContext: syllable.text
					}
				}
			: {})
	};
}

function rest(id: string): VocalLineEvent {
	return {
		id,
		type: 'rest',
		measureIndex: 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } }
	};
}

type SylType = 'whole' | 'start' | 'middle' | 'end';

/**
 * A multi-verse note: the primary `syllable` (whichever verse sings it as
 * this event's primary) plus the self-describing `versesInfo` record when
 * more than one verse sings here. Mirrors the parser's Option-B model
 * (§A.98): `versesInfo` is present only on multi-verse events and includes
 * the primary verse's own entry.
 */
function mvNote(
	id: string,
	primary: { text: string; type: SylType; verse: number },
	versesInfo?: Array<{ text: string; type: SylType; verse: number }>
): VocalLineEvent {
	return {
		id,
		type: 'note',
		measureIndex: 0,
		rhythmicPosition: { fraction: { numerator: 0, denominator: 1 } },
		duration: { base: 'quarter', dots: 0, fraction: { numerator: 1, denominator: 4 } },
		pitch: P('C', 4),
		syllable: {
			id: `s-${id}`,
			text: primary.text,
			type: primary.type,
			verseNumber: primary.verse,
			wordContext: primary.text,
			...(versesInfo
				? { versesInfo: versesInfo.map((v) => ({ verseNumber: v.verse, text: v.text, type: v.type })) }
				: {})
		}
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

/** Independent extraction: the single vowel of word `w`, syllable `k`,
 * straight from a fresh processText run (the resolver's ground truth). */
function expectedVowel(text: string, wordIdx: number, sylIdx: number): string | undefined {
	const words = processText(text)[0]?.words ?? [];
	const w = words[wordIdx];
	if (!w) return undefined;
	const entries = w.result.transcriptionLog.filter(
		(e) => e.features?.type === 'vowel' && e.syllableIndex === sylIdx
	);
	if (entries.length !== 1) return undefined;
	return entries[0].ipa.replace(/[ˈˌ]/g, '');
}

/** Independent extraction: the full syllable IPA of word `w`, syllable
 * `k`, straight from a fresh processText run (the display-IPA resolver's
 * ground truth, distinct from `expectedVowel`'s single extracted vowel). */
function expectedSyllableIpa(text: string, wordIdx: number, sylIdx: number): string | undefined {
	const words = processText(text)[0]?.words ?? [];
	const w = words[wordIdx];
	if (!w) return undefined;
	const syl = w.result.syllables[sylIdx];
	if (!syl) return undefined;
	// The display contract includes the primary-stress mark, which the engine
	// carries as a FLAG on the syllable rather than a character in its `.ipa`
	// (`engine.ts:52-56`). Derived from that flag here, so this stays an
	// independent extraction: the IPA content still comes from a fresh pipeline
	// run and never from a string written by hand.
	return syl.isStressed ? 'ˈ' + syl.ipa : syl.ipa;
}

// ── The demo fixture: the package's own Russian vocal line ──────────

describe('buildVowelResolver on the demo score', () => {
	const parsed = demoScore();
	const resolve = buildVowelResolver(parsed);
	const byId = new Map(parsed.vocalLine.map((e) => [e.id, e]));
	const at = (id: string) => resolve(byId.get(id)!);

	it('resolves every sung note to one of the ten sung vowels', () => {
		for (const ev of parsed.vocalLine) {
			if (ev.type !== 'note') continue;
			const v = at(ev.id);
			expect(v, `event ${ev.id}`).toBeDefined();
			expect(TEN_VOWELS.has(v!), `event ${ev.id} resolved to ${v}`).toBe(true);
		}
	});

	it('resolves rests to undefined', () => {
		for (const ev of parsed.vocalLine) {
			if (ev.type === 'rest') expect(at(ev.id)).toBeUndefined();
		}
	});

	it('sustains the melisma: n19 and n20 carry n18’s vowel', () => {
		expect(at('n18')).toBeDefined();
		expect(at('n19')).toBe(at('n18'));
		expect(at('n20')).toBe(at('n18'));
	});

	it('merges the vowelless «сь» into «зи»: n6 carries n5’s vowel', () => {
		expect(at('n5')).toBeDefined();
		expect(at('n6')).toBe(at('n5'));
	});

	it('matches an independent pipeline extraction for «пять» and «тьма»', () => {
		// The reconstructed line, exactly as buildVowelResolver feeds it.
		const line = 'Ты погрузись но чу по го ди тьма на ста пять по';
		expect(at('n13')).toBe(expectedVowel(line, 7, 0)); // тьма
		expect(at('n16')).toBe(expectedVowel(line, 10, 0)); // пять
	});
});

// ── The display IPA resolver (underlay line 2, Dann's 2026-07-17 ruling) ──

describe('buildUnderlayResolvers: the display-IPA line', () => {
	const parsed = demoScore();
	const { ipa, vowel } = buildUnderlayResolvers(parsed);
	const byId = new Map(parsed.vocalLine.map((e) => [e.id, e]));
	const ipaAt = (id: string) => ipa(byId.get(id)!);
	const vowelAt = (id: string) => vowel(byId.get(id)!);

	it('matches an independent pipeline extraction of the full syllable, not just the vowel', () => {
		const line = 'Ты погрузись но чу по го ди тьма на ста пять по';
		expect(ipaAt('n13')).toBe(expectedSyllableIpa(line, 7, 0)); // тьма
		expect(ipaAt('n16')).toBe(expectedSyllableIpa(line, 10, 0)); // пять
		// The display IPA is the whole syllable (consonants included), so it
		// is not simply equal to the single acoustic vowel at the same event.
		expect(ipaAt('n16')).not.toBe(vowelAt('n16'));
	});

	it('carries the stress mark exactly where the engine marks stress', () => {
		// Fails in BOTH directions: a mark where the engine reports no stress
		// fails as loudly as a missing one. Both sides come from the engine, so
		// no claim about Russian stress is made here.
		const line = 'Ты погрузись но чу по го ди тьма на ста пять по';
		const words = processText(line)[0]?.words ?? [];
		const marked = (id: string): boolean => (ipaAt(id) ?? '').startsWith('ˈ');
		expect(marked('n13')).toBe(words[7]?.result.syllables[0]?.isStressed === true);
		expect(marked('n16')).toBe(words[10]?.result.syllables[0]?.isStressed === true);
	});

	it('is blank on melisma continuation notes, unlike the vowel, which sustains', () => {
		expect(ipaAt('n18')).toBeDefined();
		expect(ipaAt('n19')).toBeUndefined();
		expect(ipaAt('n20')).toBeUndefined();
		// The acoustic vowel still sustains through the same notes (Dann:
		// the turning-pitch marks keep appearing on every melisma note).
		expect(vowelAt('n19')).toBe(vowelAt('n18'));
		expect(vowelAt('n20')).toBe(vowelAt('n18'));
	});

	it('is blank on rests', () => {
		for (const ev of parsed.vocalLine) {
			if (ev.type === 'rest') expect(ipa(ev)).toBeUndefined();
		}
	});
});

// ── Honest-bail behaviours ───────────────────────────────────────────

describe('buildVowelResolver bail rules', () => {
	it('resolves nothing for a score with no lyrics', () => {
		const parsed = scoreOf([note('a1'), note('a2'), rest('r1'), note('a3')]);
		const resolve = buildVowelResolver(parsed);
		for (const ev of parsed.vocalLine) expect(resolve(ev)).toBeUndefined();
	});

	it('does not sustain across a rest', () => {
		const parsed = scoreOf([
			note('b1', { text: 'вас', type: 'whole' }),
			rest('r1'),
			note('b2') // melisma-shaped, but phonation stopped at the rest
		]);
		const resolve = buildVowelResolver(parsed);
		const byId = new Map(parsed.vocalLine.map((e) => [e.id, e]));
		expect(resolve(byId.get('b1')!)).toBeDefined();
		expect(resolve(byId.get('b2')!)).toBeUndefined();
	});

	it('re-joins a hyphenated-particle split («велит-ли»)', () => {
		// The pipeline expands «велит-ли» into two tokens; the score
		// carries it as one three-syllable word. The two-word join must
		// keep the alignment and resolve all three syllables.
		const parsed = scoreOf([
			note('c1', { text: 'ве', type: 'start' }),
			note('c2', { text: 'лит-', type: 'middle' }),
			note('c3', { text: 'ли', type: 'end' }),
			note('c4', { text: 'вас', type: 'whole' })
		]);
		const resolve = buildVowelResolver(parsed);
		const byId = new Map(parsed.vocalLine.map((e) => [e.id, e]));
		for (const id of ['c1', 'c2', 'c3', 'c4']) {
			const v = resolve(byId.get(id)!);
			expect(v, `event ${id}`).toBeDefined();
			expect(TEN_VOWELS.has(v!)).toBe(true);
		}
	});

	it('ignores syllables from other verses (verse-1 rule)', () => {
		const parsed = scoreOf([
			note('d1', { text: 'вас', type: 'whole' }),
			note('d2', { text: 'нет', type: 'whole', verse: 2 })
		]);
		const resolve = buildVowelResolver(parsed);
		const byId = new Map(parsed.vocalLine.map((e) => [e.id, e]));
		const v1 = resolve(byId.get('d1')!);
		expect(v1).toBeDefined();
		// The verse-2 note reads as a continuation of verse 1: it sustains.
		expect(resolve(byId.get('d2')!)).toBe(v1);
	});
});

// ── N.9: the vowelless clitic owns no slot ───────────────────────────

describe('buildUnderlayResolvers: a host behind a vowelless proclitic', () => {
	// Found by Dann at the browser, 2026-08-06, twice on one Kabalevsky page:
	// «в по – след – ний» and «в раз – до – ре» printed their Cyrillic with no
	// IPA at all, while «по – след – ней» with no clitic in front of it printed
	// correctly on the same page. The engraver sets «в по» on one note, so the
	// score offers three vowel-bearing slots; the pipeline tokenises «в»
	// separately and the engine returns one syllable for it, which owns no slot
	// because `close()` gives slots only to vowel-bearing syllables. The two
	// sides counted by different rules, four against three, and the resolver's
	// mismatch guard omitted a word that had aligned correctly.
	const parsed = scoreOf([
		note('e1', { text: 'в по', type: 'start' }),
		note('e2', { text: 'след', type: 'middle' }),
		note('e3', { text: 'ний', type: 'end' })
	]);
	const { ipa } = buildUnderlayResolvers(parsed);
	const byId = new Map(parsed.vocalLine.map((e) => [e.id, e]));
	const ipaAt = (id: string) => ipa(byId.get(id)!);

	it('resolves every syllable of the host, rather than omitting the word', () => {
		for (const id of ['e1', 'e2', 'e3']) {
			expect(ipaAt(id), `event ${id}`).toBeDefined();
		}
	});

	it('tucks the proclitic’s IPA into the first syllable, behind any stress mark', () => {
		// Both halves come from a fresh pipeline run, never from the resolver:
		// `ipaContent` is the field `pipeline.ts:752-758` itself reads when it
		// merges a vowelless proclitic, and the host syllable comes from the
		// same independent extraction the tests above use.
		const words = processText('в последний')[0]?.words ?? [];
		const cliticIpa = words[0]?.ipaContent ?? '';
		expect(cliticIpa, 'the pipeline gives «в» no IPA content').not.toBe('');
		const hostSyl0 = expectedSyllableIpa('в последний', 1, 0)!;
		expect(ipaAt('e1')).toBe(
			hostSyl0.startsWith('ˈ') ? 'ˈ' + cliticIpa + hostSyl0.slice(1) : cliticIpa + hostSyl0
		);
	});

	it('does the same for «в раздоре», the second instance on that page', () => {
		const second = scoreOf([
			note('f1', { text: 'в раз', type: 'start' }),
			note('f2', { text: 'до', type: 'middle' }),
			note('f3', { text: 'ре', type: 'end' })
		]);
		const r = buildUnderlayResolvers(second).ipa;
		const ids = new Map(second.vocalLine.map((e) => [e.id, e]));
		for (const id of ['f1', 'f2', 'f3']) {
			expect(r(ids.get(id)!), `event ${id}`).toBeDefined();
		}
	});

	it('still abstains on a genuine count divergence, which N.9 must not switch off', () => {
		// Two engine syllables set on one note, both of them vowel-bearing.
		// This is the elision case `vowel-resolver.ts` documents and cannot yet
		// tell apart from an encoding fault, so it must stay silent.
		const elided = scoreOf([note('g1', { text: 'горе', type: 'whole' })]);
		const r = buildUnderlayResolvers(elided).ipa;
		const ids = new Map(elided.vocalLine.map((e) => [e.id, e]));
		expect(r(ids.get('g1')!)).toBeUndefined();
	});
});

// ── Verse 2+ reconstruction (§A.98; Option 1, Dann 2026-07-17) ────────

describe('buildVowelResolver reconstructs any verse from versesInfo', () => {
	// A sparse two-verse line on three shared notes. Verse 1 sings «вас» then
	// «нет» (melisma-ing across m2); verse 2 sings «го»+«ре» = «горе»
	// (melisma-ing across m3). m1 carries both verses, so versesInfo is present
	// and includes verse 1's own entry; m2 and m3 each carry a single verse, so
	// versesInfo is absent and the primary syllable stands in. This is the
	// sparse case the self-describing record exists to recover (§A.98).
	const parsed = scoreOf([
		mvNote('m1', { text: 'вас', type: 'whole', verse: 1 }, [
			{ text: 'вас', type: 'whole', verse: 1 },
			{ text: 'го', type: 'start', verse: 2 }
		]),
		mvNote('m2', { text: 'ре', type: 'end', verse: 2 }),
		mvNote('m3', { text: 'нет', type: 'whole', verse: 1 })
	]);
	const byId = new Map(parsed.vocalLine.map((e) => [e.id, e]));

	const resolve1 = buildVowelResolver(parsed, 1);
	const resolve2 = buildVowelResolver(parsed, 2);
	const at1 = (id: string) => resolve1(byId.get(id)!);
	const at2 = (id: string) => resolve2(byId.get(id)!);

	it('resolves verse 2 to its own words, matching an independent extraction of «горе»', () => {
		expect(at2('m1')).toBe(expectedVowel('горе', 0, 0)); // го
		expect(at2('m2')).toBe(expectedVowel('горе', 0, 1)); // ре
		for (const id of ['m1', 'm2']) {
			const v = at2(id);
			expect(v, `event ${id}`).toBeDefined();
			expect(TEN_VOWELS.has(v!), `event ${id} resolved to ${v}`).toBe(true);
		}
	});

	it('sustains the verse-2 melisma across m3 (verse 2 sings no new syllable there)', () => {
		expect(at2('m3')).toBe(at2('m2'));
	});

	it('reads verse 1 independently on the same score, and the two verses differ on m1', () => {
		expect(at1('m1')).toBe(expectedVowel('вас нет', 0, 0)); // вас
		expect(at1('m2')).toBe(at1('m1')); // verse 1 melisma-sustains across m2
		expect(at1('m3')).toBe(expectedVowel('вас нет', 1, 0)); // нет
		// The whole point: the same note m1 reads a different vowel per verse
		// (вас vs the first syllable of горе), proving the selector switches.
		expect(at1('m1')).not.toBe(at2('m1'));
	});

	it('defaults to verse 1 when no verse is given (the primary lens, unchanged)', () => {
		expect(buildVowelResolver(parsed)(byId.get('m1')!)).toBe(at1('m1'));
	});
});

// ── N.10: Fit consumes Transcription's output ────────────────────────
//
// Dann's ruling, 7 August 2026: "Fit consumes Transcription's output
// including the singer's stress overrides, and an unratified word says so on
// the page rather than printing bare." This block covers the first clause;
// the second is N.10b's, with the marks and the legend.
//
// Every expected value here comes from a fresh `processText` run, never from
// the resolver and never from a string written by hand. What is asserted is
// only WHICH run the resolver read a word from.

/** The display contract's syllable string, from a pipeline word. */
function sylIpaOf(word: WordStackData, sylIdx: number): string | undefined {
	const syl = word.result.syllables[sylIdx];
	if (!syl) return undefined;
	return syl.isStressed ? 'ˈ' + syl.ipa : syl.ipa;
}

const overrideAt = (key: string, stressIndex: number): Map<string, UserStressOverride> =>
	new Map<string, UserStressOverride>([
		[key, { stressIndex, stressSource: 'user-override' }]
	]);

describe('buildUnderlayResolvers: the singer’s overrides reach the score page', () => {
	// по–след–ний, the word E.30 walked at the browser, set one syllable per
	// note so the score offers exactly three vowel-bearing slots.
	const wordEvents = (prefix: string) => [
		note(`${prefix}1`, { text: 'по', type: 'start' }),
		note(`${prefix}2`, { text: 'след', type: 'middle' }),
		note(`${prefix}3`, { text: 'ний', type: 'end' })
	];

	const plainLines: LineData[] = processText('последний');
	const overriddenLines: LineData[] = processText('последний', {
		userStressOverrides: overrideAt('0-0', 0)
	});

	it('the override changes the engine’s own output, or nothing below means anything', () => {
		// The precondition, stated as a test rather than assumed. If the
		// pipeline ever stopped honouring an override before transcription
		// (`pipeline.ts:270-277`, applied ahead of Step 3 at `:288`), every
		// assertion in this block would pass vacuously.
		const plainFlags = plainLines[0].words[0].result.syllables.map((sy) => sy.isStressed);
		const overFlags = overriddenLines[0].words[0].result.syllables.map((sy) => sy.isStressed);
		expect(overFlags).not.toEqual(plainFlags);
	});

	it('prints the singer’s corrected syllable, not the dictionary’s', () => {
		const parsed = scoreOf(wordEvents('h'));
		const byId = new Map(parsed.vocalLine.map((e) => [e.id, e]));
		const withDonor = buildUnderlayResolvers(parsed, 1, {
			transcribedLines: overriddenLines
		}).ipa;
		const without = buildUnderlayResolvers(parsed).ipa;

		for (let k = 0; k < 3; k++) {
			const id = `h${k + 1}`;
			expect(withDonor(byId.get(id)!), `event ${id}`).toBe(
				sylIpaOf(overriddenLines[0].words[0], k)
			);
		}
		// And it is a real difference, not two names for the same string.
		expect(withDonor(byId.get('h1')!)).not.toBe(without(byId.get('h1')!));
	});

	it('gives a repeated word the donor at its OWN position', () => {
		// The case that decides whether this is an alignment or the
		// spelling-keyed map E.31 §1.5 rejected. The singer corrects the
		// SECOND последний only; the first must be untouched.
		const parsed = scoreOf([...wordEvents('p'), ...wordEvents('q')]);
		const byId = new Map(parsed.vocalLine.map((e) => [e.id, e]));
		const donor = processText('последний последний', {
			userStressOverrides: overrideAt('0-1', 0)
		});
		expect(donor[0].words).toHaveLength(2);
		const ipa = buildUnderlayResolvers(parsed, 1, { transcribedLines: donor }).ipa;

		expect(ipa(byId.get('p1')!)).toBe(sylIpaOf(donor[0].words[0], 0));
		expect(ipa(byId.get('q1')!)).toBe(sylIpaOf(donor[0].words[1], 0));
		// The two occurrences must NOT print alike: the correction landed on
		// one of them. A rule that keyed by spelling would fail here.
		expect(ipa(byId.get('p1')!)).not.toBe(ipa(byId.get('q1')!));
	});

	it('falls back per word where the singer never typed that word', () => {
		// The score sings two words; the poem holds only the second. Path C's
		// per-word fallback, not Path A's blank remainder.
		const parsed = scoreOf([
			note('k1', { text: 'тьма', type: 'whole' }),
			...wordEvents('m')
		]);
		const byId = new Map(parsed.vocalLine.map((e) => [e.id, e]));
		const ipa = buildUnderlayResolvers(parsed, 1, {
			transcribedLines: processText('последний')
		}).ipa;
		// The unpaired word still prints, from Fit's own run of the pipeline.
		expect(ipa(byId.get('k1')!)).toBe(expectedSyllableIpa('тьма последний', 0, 0));
		// The paired one prints from the poem's run.
		expect(ipa(byId.get('m1')!)).toBe(sylIpaOf(plainLines[0].words[0], 0));
	});

	it('is unchanged from the pre-N.10 page when nothing has been transcribed', () => {
		const parsed = scoreOf(wordEvents('u'));
		const before = buildUnderlayResolvers(parsed).ipa;
		for (const opts of [{ transcribedLines: [] }, {}]) {
			const after = buildUnderlayResolvers(parsed, 1, opts).ipa;
			for (const ev of parsed.vocalLine) {
				expect(after(ev), `event ${ev.id}`).toBe(before(ev));
			}
		}
	});
});
