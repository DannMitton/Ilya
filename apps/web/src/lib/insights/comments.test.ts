/**
 * N.168 first slice: the firing tests, the merge, the budget, and the words.
 *
 * The notes below are copied row for row from the oracle,
 * `tools/n168-frequency-run/out/notes-mitton.csv` (pitch, vowel, seconds,
 * held, approach, phrase), so the known-answer cases of the brief ("Done
 * when", item 2) run here without the Finale files. The harness runs the
 * same cases on the real scores.
 */
import { describe, expect, it } from 'vitest';
import type { IntakeAnswers, IntakePoint, NoteCondition, Pitch, VoiceProfileSnapshot } from '@ilya/score-parser';
import {
	COMMENT_DEFAULTS,
	effectivePoint,
	isTreble,
	noteComments,
	noteFacts,
	registerFor,
	selectComments,
	applyRarity,
	type NoteComment,
} from './comments';
import {
	OPENERS,
	leadSuggestion,
	partKey,
	openerFits,
	orderSuggestions,
	renderComment,
	renderComments,
	rotate,
	runsText,
	songSeed,
	speaks,
	SUGGESTIONS,
} from './comment-text';
import { WORKS, fullReference, worksCited } from './comment-sources';

const P = (step: Pitch['step'], octave: number, alter = 0): Pitch => ({ step, octave, alter });

/** Mitton's profile as the frequency run carries it (`frequency-run.run.ts:87`). */
const MITTON: VoiceProfileSnapshot = {
	fR1: { i: 296, e: 381, ɪ: 393, ɨ: 404, u: 346, o: 489, ɛ: 577, ʌ: 616, ɑ: 617, a: 711 },
	range: { lowest: P('A', 2), highest: P('E', 4) },
	passaggio: { primo: P('A', 3, -1), secondo: P('D', 4, -1) },
};

type Row = [Pitch, string | undefined, number, 'held' | 'short', NoteCondition['approach'] extends infer A ? (A extends { band: infer B } ? B | 'first' : never) : never, number, number];

const midiOf = (p: Pitch) => (p.octave + 1) * 12 + { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[p.step] + p.alter;

/** Rows of [pitch, vowel, seconds, held, approach, approach semitones, phrase]. */
function song(rows: Row[]) {
	const pitches = new Map<string, Pitch>();
	const notes: NoteCondition[] = rows.map(([pitch, vowel, seconds, held, band, semis, phrase], i) => {
		const id = `e${i}`;
		pitches.set(id, pitch);
		return {
			eventId: id,
			order: i,
			measureIndex: i,
			midi: midiOf(pitch),
			...(vowel ? { vowel } : {}),
			held: held === 'held',
			heldBasis: 'is-long-sustain',
			...(band === 'first' ? {} : { approach: { semitones: semis, band, afterRest: false } }),
			phrase: { index: phrase, position: 'middle', quavers: 0 },
			quavers: 1,
			seconds,
			onsetPhonationQuavers: i,
		};
	});
	return { notes, pitchOf: (id: string) => pitches.get(id) };
}

const E4 = P('E', 4);
const Eb4 = P('E', 4, -1);

/** Kabalevsky T01, bars 36 to 38 (CSV rows 1000 to 1006) and bars 52 to 53 (1039 to 1044). */
const T01 = song([
	[P('B', 3), 'ɨ', 1.429, 'short', 'first', 0, 4],
	[P('G', 3), 'ɑ', 0.476, 'short', 'leap-down', -4, 4],
	[P('A', 3), 'ɑ', 0.476, 'short', 'step', 2, 4],
	[P('G', 3), 'ɑ', 0.476, 'short', 'step', -2, 4],
	[E4, 'i', 2.857, 'held', 'leap-up', 9, 4],
	[E4, 'i', 1.429, 'held', 'tie', 0, 4],
	[P('C', 4), 'ɑ', 0.476, 'short', 'leap-down', -4, 4],
	[P('D', 3), 'i', 1.429, 'short', 'step', -2, 7],
	[P('D', 3), 'ɑ', 0.476, 'short', 'repeated', 0, 7],
	[P('D', 3), 'ɑ', 0.476, 'short', 'repeated', 0, 7],
	[P('D', 3), 'u', 0.476, 'short', 'repeated', 0, 7],
	[P('D', 4), 'u', 1.905, 'short', 'leap-up', 12, 7],
	[P('A', 3), 'ɛ', 0.952, 'short', 'leap-down', -5, 7],
]);

/** Kabalevsky T04, bars 10 to 11 (rows 1418 to 1428). */
const T04 = song([
	[P('F', 3, 1), 'u', 0.6, 'short', 'first', 0, 1],
	[P('G', 3), 'i', 0.6, 'short', 'step', 1, 1],
	[P('C', 4), 'ɑ', 0.6, 'short', 'leap-up', 5, 1],
	[P('D', 4), 'ʌ', 0.6, 'short', 'step', 2, 1],
	[Eb4, 'o', 2.4, 'held', 'step', 1, 1],
	[Eb4, 'o', 0.6, 'held', 'tie', 0, 1],
	[P('D', 4), 'u', 0.6, 'short', 'step', -1, 1],
	[P('C', 4), 'ɑ', 0.6, 'short', 'step', -2, 1],
	[P('B', 3), 'ɑ', 0.6, 'short', 'step', -1, 1],
	[P('C', 4), 'e', 1.8, 'short', 'step', 1, 1],
	[P('A', 3, -1), 'u', 0.6, 'short', 'leap-down', -4, 1],
]);

/** Kabalevsky T02, bars 49 to 51 (rows 1187 to 1193). */
const T02 = song([
	[P('F', 3), undefined, 0.417, 'short', 'first', 0, 6],
	[P('E', 3, -1), 'i', 0.417, 'short', 'step', -2, 6],
	[P('F', 3), 'i', 0.417, 'short', 'step', 2, 6],
	[P('G', 3), 'ɑ', 0.417, 'short', 'step', 2, 6],
	[Eb4, 'ɛ', 1.667, 'held', 'leap-up', 8, 6],
	[Eb4, 'ɛ', 1.25, 'held', 'tie', 0, 6],
	[P('A', 3, -1), 'ʌ', 0.417, 'short', 'leap-down', -7, 6],
]);

/** Sunless 05, bars 38 to 39 (rows 687 to 692). */
const S05 = song([
	[P('G', 3), 'ɨ', 0.556, 'short', 'first', 0, 18],
	[P('G', 3), 'ɪ', 0.556, 'short', 'repeated', 0, 18],
	[P('C', 4), 'u', 0.833, 'short', 'leap-up', 5, 18],
	[P('B', 3), 'ʌ', 0.278, 'short', 'step', -1, 18],
	[E4, 'ɛ', 0.556, 'short', 'leap-up', 5, 18],
	[P('C', 4), 'ɑ', 1.111, 'short', 'leap-down', -4, 19],
]);

const MEASURED = new Set(Object.keys(MITTON.fR1));
const ceilingMidi = midiOf(E4);

function commentsOf(s: ReturnType<typeof song>, intake?: IntakeAnswers): NoteComment[] {
	return noteComments({ facts: noteFacts(s.notes, MITTON), intake, treble: false, ceilingMidi });
}
const at = (cs: NoteComment[], id: string) => cs.find((c) => c.eventId === id);
/**
 * r7 in French: RATIFIED by Dann 2026-09-30 12:08 (table A) and 12:25 (section C), as `norm` compares it.
 * The words are the ratified ones. The spacing before « ; » follows Dann's OQLF ruling of 2026-09-30
 * 21:39 (no space before « ; », « ? », « ! »), which postdates the ratification.
 */
const FR_E4 =
	"Ce [i] sur E4 se prolonge environ 4 secondes, au-dessus de la première résonance (fR1) de votre [i] chanté. Ici, le [i] tend de lui-même vers un timbre youhou; mais le resserrer au lieu d'ouvrir la bouche tend à l'amincir (Bozeman, Kinesthetic Voice Pedagogy 2, 2021, p. 97 et 115). Vous pourriez laisser la mâchoire descendre avec la hauteur, la pointe de la langue vers l'avant, et observer si le [i] garde sa couleur (Miller, Solutions for Singers, 2004, p. 163).";
const FR_EB4 =
	"Ce [ɛ] sur E♭4 se prolonge environ 3 secondes, juste après la hauteur où votre [ɛ] change de timbre (autour de D4). La couleur tend ici à se fermer d'elle-même; mais la garder ouverte peut la pousser vers un cri (Bozeman, Practical Vocal Acoustics, 2025, p. 45 et 65). Bozeman propose de garder une posture vocalique assez fermée tout au long du changement de timbre, et un peu au-delà. Observez si la couleur se ferme plus facilement (Kinesthetic Voice Pedagogy 2, 2021, p. 18-19).";
const FR_D4 =
	"Ce [u] sur D4 se situe juste au-dessus de votre secondo passaggio et un peu en dessous de la première résonance de votre [u] chanté. Ici, le [u] tend à s'ouvrir un peu de lui-même (Miller, The Structure of Singing, 1986, p. 158); mais le garder fermé tend vers un timbre youhou (Bozeman, Practical Vocal Acoustics, 2025, p. 94). Si cela convient à votre voix, laissez-le pencher vers [ʊ], et observez si le [u] garde sa couleur.";
const POINTS: (IntakePoint | undefined)[] = [1, 2, 3, 4, 5, 'not-sure', undefined];

describe('the intake answers', () => {
	it('a skip counts as point 3 and "not sure" as point 2', () => {
		expect(effectivePoint(undefined)).toBe(3);
		expect(effectivePoint('not-sure')).toBe(2);
		expect(effectivePoint(5)).toBe(5);
	});
	it('question 7 sets the register: 1 to 2 plain, 3 working, 4 to 5 technical', () => {
		expect(registerFor({ acoustics: 1 })).toBe('plain');
		expect(registerFor({ acoustics: 'not-sure' })).toBe('plain');
		expect(registerFor(undefined)).toBe('working');
		expect(registerFor({ acoustics: 4 })).toBe('technical');
	});
	it('a missing register falls back to working', () => {
		expect(partKey('plain', 'frame.sustained', 'en')).toBe('comment.working.frame.sustained');
		expect(partKey('technical', 'frame.sustained', 'fr')).toBe('comment.working.frame.sustained');
	});
	it('treble is read from the typed secondo, and unknown without one', () => {
		expect(isTreble(MITTON)).toBe(false);
		expect(isTreble({ fR1: {}, passaggio: { primo: P('E', 4, -1), secondo: P('F', 5, 1) } })).toBe(true);
		expect(isTreble({ fR1: {} })).toBeUndefined();
	});
});

describe('the derivations match the oracle rows', () => {
	it('turning pitch, semitones to the secondo, highest of phrase, and the tie chain', () => {
		const f = noteFacts(T02.notes, MITTON);
		expect(f[4].semitonesFromTurning).toBeCloseTo(1.31, 2);
		expect(f[4].toSecondo).toBe(2);
		expect(f[4].highestOfPhrase).toBe(true);
		expect(f[4].chainSeconds).toBeCloseTo(2.917, 3);
		expect(f[5].chainHead).toBe(false);
		expect(noteFacts(T01.notes, MITTON)[4].semitonesFromTurning).toBeCloseTo(13.86, 2);
		expect(noteFacts(S05.notes, MITTON)[4].semitonesFromTurning).toBeCloseTo(2.31, 2);
	});
});

describe('the known-answer cases (brief, "Done when" item 2)', () => {
	it("Dann's E4 [i], T01 bar 37, fires at every answer to question 4", () => {
		for (const p of POINTS) {
			const c = at(commentsOf(T01, { sustained: p }), 'e4');
			expect(c?.kinds).toContain('sustained');
		}
	});
	it("Dann's E♭4 [o], T04 bar 10, fires at points 1 to 3 and not at 4 and 5", () => {
		for (const p of [1, 2, 3, 'not-sure', undefined] as const) expect(at(commentsOf(T04, { sustained: p }), 'e4')).toBeDefined();
		for (const p of [4, 5] as const) expect(at(commentsOf(T04, { sustained: p }), 'e4')).toBeUndefined();
	});
	it("Dann's E♭4 [ɛ], T02 bar 50, is one merged comment", () => {
		const cs = commentsOf(T02);
		expect(cs).toHaveLength(1);
		expect(cs[0].kinds).toEqual(['sustained', 'turning']);
		expect(cs[0].challenges).toEqual(['sustain', 'leap', 'turn']);
	});
	it("Dann's E4 [ɛ], Sunless 05 bar 39, fires at points 1 to 3 of question 3 and not at 4 and 5", () => {
		for (const p of [1, 2, 3, 'not-sure', undefined] as const) expect(at(commentsOf(S05, { passaggi: p }), 'e4')?.kinds).toEqual(['turning']);
		for (const p of [4, 5] as const) expect(at(commentsOf(S05, { passaggi: p }), 'e4')).toBeUndefined();
	});
	it("Dann's D4 [u], T01 bar 53, fires comment 3 with the octave leap", () => {
		const c = at(commentsOf(T01), 'e11');
		expect(c?.kinds).toEqual(['closedU']);
		expect(c?.challenges).toEqual(['leap', 'closedU']);
		expect(c?.resonance?.side).toBe('under');
	});
	it('a passing [u] under the sustained threshold that is not a phrase top stays silent', () => {
		expect(at(commentsOf(T04), 'e6')).toBeUndefined();
	});
});

describe("N.172's own test: one comment for a novice and not for an expert on the same note", () => {
	it('the stage moves the threshold (DESK PROPOSAL mechanism)', () => {
		expect(at(commentsOf(T04, { sustained: 1 }), 'e4')).toBeDefined();
		expect(at(commentsOf(T04, { sustained: 5 }), 'e4')).toBeUndefined();
	});
});

describe('the topic switches hide and count, never lose', () => {
	it('sustained notes off hides T04 and counts it', () => {
		const cs = commentsOf(T04, { topics: { sustained: false } });
		expect(cs).toHaveLength(1);
		expect(cs[0].kinds).toEqual([]);
		const sel = selectComments(cs, { phraseCount: 2 });
		expect(sel.shown).toHaveLength(0);
		expect(sel.hiddenBySettings).toBe(1);
	});
	it('a merged comment keeps the part whose topic is on', () => {
		const cs = commentsOf(T02, { topics: { passaggi: false } });
		expect(cs[0].kinds).toEqual(['sustained']);
		expect(cs[0].hiddenKinds).toEqual(['turning']);
		expect(cs[0].challenges).toEqual(['sustain', 'leap']);
	});
});

function fake(order: number, challenges: NoteComment['challenges'], seconds: number): NoteComment {
	return {
		eventId: `x${order}`, order, measureIndex: order, midi: 60, vowel: 'ɑ', phraseIndex: order, treble: false,
		kinds: ['turning'], hiddenKinds: [], seconds, sustained: false, phraseTop: true, ceiling: false, descent: false, challenges,
	};
}

describe('ranking, the budget, and performance order', () => {
	it('five at most, chosen by the stakes fallback, shown in performance order', () => {
		const cs = [
			fake(0, ['turn'], 1),
			fake(1, ['sustain', 'leap', 'turn'], 1),
			fake(2, ['turn'], 5),
			fake(3, ['sustain', 'turn'], 1),
			fake(4, ['turn'], 3),
			fake(5, ['turn'], 2),
			fake(6, ['leap', 'turn'], 1),
		];
		const sel = selectComments(cs, { phraseCount: 7 });
		expect(sel.shown.map((c) => c.order)).toEqual([1, 2, 3, 4, 6]);
		expect(sel.more.map((c) => c.order)).toEqual([0, 5]);
	});
	it('rarity is off by default and moves a heavy song to the piece level when on', () => {
		expect(COMMENT_DEFAULTS.rarity).toBe(false);
		const cs = [fake(0, ['turn'], 1), { ...fake(1, ['turn'], 1), midi: 62 }];
		const r = applyRarity(cs, 3);
		expect(r.heavy).toEqual(['turning']);
		expect(r.deferred).toHaveLength(2);
	});
});

describe('which suggestion leads (r2 §0, DESK PROPOSAL)', () => {
	const cs = [...commentsOf(T01), ...commentsOf(T02)];
	it("r7's lead is the one visible suggestion; McKinney's legato is behind the tap only", () => {
		const i = at(cs, 'e4')!;
		const o = orderSuggestions(i, { language: 'en', measuredVowels: MEASURED });
		expect(o.visible.map((s) => s.id)).toEqual(['jaw']);
		expect(o.hidden.map((s) => s.id)).toEqual(['legato']);
		const u = orderSuggestions(at(cs, 'e11')!, { language: 'en', measuredVowels: MEASURED });
		expect(u.visible.map((s) => s.id)).toEqual(['lean']);
		expect(u.hidden.map((s) => s.id)).toEqual(['decrescendo', 'preface', 'legato']);
	});
	it('rule 1: the suggestion that reads a measured value leads', () => {
		const u = at(cs, 'e11')!;
		const primaries = SUGGESTIONS.filter((s) => ['lean', 'decrescendo'].includes(s.id));
		expect(leadSuggestion(u, primaries, MEASURED)?.id).toBe('lean');
	});
	it('rule 2: with no measured value, the closest case leads (Reid’s baritone upper D)', () => {
		const u = at(cs, 'e11')!;
		const primaries = SUGGESTIONS.filter((s) => ['lean', 'decrescendo'].includes(s.id));
		expect(leadSuggestion(u, primaries, new Set())?.id).toBe('decrescendo');
	});
	it('"All of them" shows every suggestion; imagery off drops the imagery cue', () => {
		const e = commentsOf(T02)[0];
		expect(orderSuggestions(e, { language: 'en', measuredVowels: MEASURED, all: true }).hidden).toHaveLength(0);
		const noImagery = orderSuggestions(e, { language: 'en', measuredVowels: MEASURED, imagery: false });
		expect([...noImagery.visible, ...noImagery.hidden].map((s) => s.id)).not.toContain('legato');
	});
	it('a French page leaves out the suggestions whose French is owed', () => {
		const e = commentsOf(T02)[0];
		const fr = orderSuggestions(e, { language: 'fr', measuredVowels: MEASURED });
		expect([...fr.visible, ...fr.hidden].map((s) => s.id)).toEqual(['closePosture', 'legato']);
	});
});

describe('which comments print (r7, DESK DEFAULT)', () => {
	it('a sustained note with no resonance, turn, or closed [u] has nothing to say', () => {
		const o = at(commentsOf(T04), 'e4')!;
		expect(o.challenges).toEqual(['sustain']);
		expect(speaks(o)).toBe(false);
	});
	it('the three r7 notes speak, and a note every topic hid still counts', () => {
		for (const c of [...commentsOf(T01), ...commentsOf(T02)]) expect(speaks(c)).toBe(true);
		const hidden = commentsOf(T04, { topics: { sustained: false } } as IntakeAnswers).find((c) => c.eventId === 'e4')!;
		expect(hidden.kinds).toEqual([]);
		expect(speaks(hidden)).toBe(true);
	});
});

/** The ratified text is compared with ordinary spaces and a straight apostrophe. */
const norm = (s: string) => s.replace(/[\u00a0\u202f]/g, ' ').replace(/\u2019/g, "'");

function forced(c: NoteComment, s: ReturnType<typeof song>, language: 'en' | 'fr', nameFR1 = true) {
	const order = orderSuggestions(c, { language, measuredVowels: MEASURED });
	const [voicing] = rotate([c], [order], 0);
	const r = renderComment(c, order, voicing, { language, register: 'working', pitchOf: s.pitchOf }, nameFR1);
	return { text: norm([r.frame, r.consequence, ...r.visible.map((v) => v.runs)].map(runsText).join(' ')), count: r.count, r };
}

// r7, English RATIFIED by Dann 2026-09-28 23:37 and 2026-09-29 22:51 (`draft-three-comments_r7_2026-09-29.md`),
// compared without its italics. The French is RATIFIED by Dann 2026-09-30 12:08 and 12:25
// (`french-comments_r1_2026-09-30.md`, table A and section C): these lines pin it
// so a change to it is deliberate. "(fR1)" prints on its first appearance on the page, the E4 here.
describe("the three rendered comments reproduce Dann's ratified r7 text", () => {
	const t01 = commentsOf(T01);
	const t02 = commentsOf(T02);
	it('E4 [i], English and French', () => {
		const en = forced(at(t01, 'e4')!, T01, 'en');
		expect(en.text).toBe(
			'This [i] on E4 is sustained for about 4 seconds, above the first resonance (fR1) of your sung [i]. Here the [i] tends toward whoop timbre on its own; but narrowing it instead of opening the mouth tends to thin it (Bozeman, Kinesthetic Voice Pedagogy 2, 2021, pp. 97 and 115). You might let the jaw drop with the pitch, tongue tip forward, and notice whether the [i] keeps its colour (Miller, Solutions for Singers, 2004, p. 163).',
		);
		expect(en.count).toBe('1 more thing to explore');
		expect(forced(at(t01, 'e4')!, T01, 'fr').text).toBe(FR_E4);
	});
	it('E♭4 [ɛ], English and French', () => {
		const en = forced(t02[0], T02, 'en', false);
		expect(en.text).toBe(
			'This [ɛ] on E♭4 is sustained for about 3 seconds, just past where your [ɛ] turns (about D4). The colour tends to close here on its own; but keeping it open can nudge it toward a yell (Bozeman, Practical Vocal Acoustics, 2025, pp. 45 and 65). Bozeman suggests keeping a fairly close vowel posture through the turn and a little beyond it. Notice whether the colour closes more easily (Kinesthetic Voice Pedagogy 2, 2021, pp. 18 to 19).',
		);
		expect(en.count).toBe('2 more things to explore');
		expect(forced(t02[0], T02, 'fr', false).text).toBe(FR_EB4);
	});
	it('D4 [u], English and French', () => {
		const en = forced(at(t01, 'e11')!, T01, 'en', false);
		expect(en.text).toBe(
			'This [u] on D4 sits just above your secondo passaggio and a little under the first resonance of your sung [u]. Here the [u] tends to open a little on its own (Miller, The Structure of Singing, 1986, p. 158); but keeping it closed tends toward whoop timbre (Bozeman, Practical Vocal Acoustics, 2025, p. 94). If it suits your voice, let it lean toward [ʊ], and notice whether the [u] keeps its colour.',
		);
		expect(en.count).toBe('3 more things to explore');
		expect(forced(at(t01, 'e11')!, T01, 'fr', false).text).toBe(FR_D4);
	});
	it('sets fR1 as Titze prints it, and the terms of art and titles in italics', () => {
		const { r } = forced(at(t01, 'e4')!, T01, 'en');
		const i = r.frame.findIndex((x) => x.text === 'f' && x.title);
		expect(r.frame[i + 1]).toEqual({ text: 'R1', sub: true });
		expect(r.consequence.filter((x) => x.title).map((x) => x.text)).toEqual(['whoop', 'Kinesthetic Voice Pedagogy 2']);
	});
	it('cites the consequence rows on the printed page, and every row in the tap', () => {
		const { r } = forced(at(t01, 'e11')!, T01, 'en', false);
		expect(r.printedRows).toEqual(['RMR-057', 'PVA2-C-025']);
		expect(r.references).toHaveLength(7);
	});
});

describe('the rotation', () => {
	const page = [...commentsOf(T01), ...commentsOf(T02)].filter(speaks);
	const orders = page.map((c) => orderSuggestions(c, { language: 'en', measuredVowels: MEASURED }));
	it('is stable for a song and differs across songs', () => {
		expect(songSeed(['a', 'b'])).toBe(songSeed(['a', 'b']));
		expect(songSeed(['a', 'b'])).not.toBe(songSeed(['a', 'c']));
	});
	for (let seed = 0; seed < OPENERS.length * 3; seed++) {
		it(`seed ${seed}: r7's leads keep their words; behind the tap, no opener repeats within a comment`, () => {
			const v = rotate(page, orders, seed);
			v.forEach((x, k) => {
				const list = [...orders[k].visible, ...orders[k].hidden];
				expect(x.openers[0]).toBe(list[0].opener);
				expect(x.closers[0]).toBe(true);
				const rotated = x.openers.filter((_, j) => list[j].opener === undefined);
				expect(new Set(rotated).size).toBe(rotated.length);
				x.openers.forEach((o, j) => expect(openerFits(o, list[j], x.closers[j])).toBe(true));
			});
		});
	}
	it('renders a whole page with no missing string, and "(fR1)" once, in either language', () => {
		const pitchOf = (id: string) => T01.pitchOf(id) ?? T02.pitchOf(id);
		for (const language of ['en', 'fr'] as const) {
			const r = renderComments(page, 7, { language, register: 'working', measuredVowels: MEASURED, pitchOf });
			const all = r.flatMap((x) => [runsText(x.frame), runsText(x.consequence), x.count, ...[...x.visible, ...x.hidden].map((s) => runsText(s.runs)), ...x.references.map(runsText)]).join(' ');
			expect(all).not.toContain('MISSING');
			expect(all).not.toMatch(/\{[a-zA-Z0-9:+-]+\}|\*/);
			expect(all.match(/\(fR1\)/g)).toHaveLength(1);
			expect(all).not.toMatch(/\btry\b|\bhold/i);
		}
	});
});

describe('citations', () => {
	it('"Sources cited" lists each work once, alphabetically', () => {
		expect(worksCited(['PVA2-B-014', 'MIL04-035', 'MCK-049', 'MIL04-028', 'REID-057'])).toEqual([
			'bozeman2025',
			'mckinney1994',
			'miller2004',
			'reid1975',
		]);
	});
	it('prints only what was read: no ISBN or publisher where none was recorded', () => {
		expect(runsText(fullReference('bozeman2025'))).toBe('Bozeman, Kenneth. Practical Vocal Acoustics, 2nd ed. 2025.');
		expect(runsText(fullReference('miller2004'))).toBe(
			'Miller, Richard. Solutions for Singers: Tools for Performers and Teachers. Oxford University Press, 2004. ISBN 978-0-19-516005-5.',
		);
		expect(runsText(fullReference('reid1975'))).toBe(
			'Reid, Cornelius L. Voice: Psyche and Soma. New York: Joseph Patelson Music House, 1975, third printing 1999. ISBN 0-915282-00-3.',
		);
	});
});
