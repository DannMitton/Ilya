/**
 * N.168: how a note comment reads. Pure, like `comments.ts`, which decides
 * whether a note speaks at all; this file decides the words.
 *
 * The grammar is the templates file's (`docs/sessions/templates-n168-working-
 * register_r1_2026-09-25.md`, English ratified by Dann 13:48, French 13:52):
 *
 *   1. A FRAME of short sentences (Dann, 13:39): the note and its sustain or
 *      phrase position, then the leap and the resonance or turn clause.
 *   2. SUGGESTIONS, one per challenge, at most two visible, each an offer:
 *      opener + action + a closer only where the source states an outcome
 *      the singer can hear or feel (`PRODUCT.md`, "A SUGGESTION IS AN OFFER").
 *   3. A COUNT of what the tap holds, and the tap label.
 *
 * Every sentence is an i18n entry with placeholders. Registers: each part is
 * looked up under the singer's register and falls back to working, the only
 * register written in this slice (brief item 7a).
 */

import { hzToPitch, type Pitch } from '@ilya/score-parser';
import { hasString, t, type Language } from '$lib/i18n';
import { pitchLabel } from './note-picker';
import { COMMENT_DEFAULTS, STAKES_ORDER, type Challenge, type NoteComment, type Register } from './comments';
import { ROWS, WORKS, rowReference, shortCitation, type Run } from './comment-sources';

// ── The suggestions ──────────────────────────────────────────────────

/** Every suggestion carries its kind (Dann, 2026-09-25 14:44). Only imagery filters, for now. */
export type SuggestionKind = 'registration' | 'dynamics' | 'vowel-modification' | 'tract-shaping' | 'imagery';

export interface SuggestionDef {
	id: string;
	challenge: Challenge;
	/** The extraction row the visible citation names. */
	row: string;
	/** Rows the tap also lists. */
	supportRows: readonly string[];
	/** JUDGEMENT, the desk's: which of Dann's five kinds each suggestion is. */
	kind: SuggestionKind;
	/** An alternative for a challenge that already has one; never the first for its challenge. */
	alternative: boolean;
	/** Closer A ("notice …") or B ("to see whether …"), only where the source states an audible or felt outcome. */
	closer: 'A' | 'B' | null;
	/**
	 * How the closer joins the action: ", and notice …" continues the offer, so
	 * it reads only after an invitation (openers 1, 2, 3, 5); ". Notice …" and
	 * ", to see whether …" read after any opener.
	 */
	closerJoin?: 'and' | 'sentence' | 'purpose';
	/** Its firing test reads the vowel's fR1 (rule 1 of r2 §0 when that fR1 was measured). */
	readsResonance: boolean;
	/** The case the source describes, for rule 2: the voice and the pitch. Absent where the source states no case. */
	case?: { treble: boolean; midi: number };
	/** The wording is not ratified in French; a French page leaves it out rather than print English inside French. */
	frenchOwed: boolean;
}

export const SUGGESTIONS: readonly SuggestionDef[] = [
	{ id: 'jaw', challenge: 'resonance', row: 'MIL04-028', supportRows: [], kind: 'tract-shaping', alternative: false, closer: 'A', closerJoin: 'and', readsResonance: true, frenchOwed: false },
	{ id: 'level', challenge: 'sustain', row: 'MIL04-035', supportRows: ['MIL04-033'], kind: 'dynamics', alternative: false, closer: null, readsResonance: false, frenchOwed: false },
	{ id: 'tract', challenge: 'turn', row: 'PVA2-B-014', supportRows: [], kind: 'tract-shaping', alternative: false, closer: 'A', closerJoin: 'sentence', readsResonance: true, frenchOwed: false },
	// Miller's baritone on /ɑ/ at E♭4 to G4 (MIL04-010); the case pitch is the middle of that span.
	{ id: 'mixed', challenge: 'turn', row: 'MIL04-010', supportRows: ['MIL04-017'], kind: 'vowel-modification', alternative: true, closer: null, readsResonance: false, case: { treble: false, midi: 65 }, frenchOwed: true },
	// Reid's baritone on the upper D (REID-054), D4.
	{ id: 'decrescendo', challenge: 'closedU', row: 'REID-057', supportRows: ['REID-054', 'HS-B-058'], kind: 'dynamics', alternative: false, closer: 'B', closerJoin: 'purpose', readsResonance: false, case: { treble: false, midi: 62 }, frenchOwed: false },
	{ id: 'preface', challenge: 'closedU', row: 'MIL04-008', supportRows: [], kind: 'vowel-modification', alternative: true, closer: null, readsResonance: false, frenchOwed: true },
	{ id: 'legato', challenge: 'leap', row: 'MCK-049', supportRows: [], kind: 'imagery', alternative: false, closer: null, readsResonance: false, frenchOwed: false },
];

export interface SuggestionOptions {
	language: Language;
	/** Vowels whose fR1 the singer sang, rather than derived. */
	measuredVowels: ReadonlySet<string>;
	/** "Include imagery and metaphor cues". */
	imagery?: boolean;
	/** "All of them" in "How comments appear". */
	all?: boolean;
	visibleCount?: number;
}

const stakes = (s: SuggestionDef) => STAKES_ORDER.indexOf(s.challenge);

/**
 * Which suggestion leads: r2 §0, rules 1 and 2, a DESK PROPOSAL, not ruled.
 * Rule 1: a suggestion whose firing test reads the singer's own measured value.
 * Rule 2: otherwise the source whose case is closest: the same kind of voice,
 * then the nearest pitch. Rule 3 ("notice this" never leads) holds because no
 * notice is a suggestion.
 */
export function leadSuggestion(c: NoteComment, primaries: readonly SuggestionDef[], measuredVowels: ReadonlySet<string>): SuggestionDef | undefined {
	const measured = primaries.filter((s) => s.readsResonance && measuredVowels.has(c.vowel));
	if (measured.length > 0) return [...measured].sort((a, b) => stakes(a) - stakes(b))[0];
	const distance = (s: SuggestionDef) =>
		!s.case ? [2, 0] : [s.case.treble === c.treble ? 0 : 1, Math.abs(s.case.midi - c.midi)];
	return [...primaries].sort((a, b) => {
		const [va, pa] = distance(a);
		const [vb, pb] = distance(b);
		return va - vb || pa - pb || stakes(a) - stakes(b);
	})[0];
}

/** One suggestion per challenge first, the lead by `leadSuggestion`, the rest by stakes, then the alternatives. */
export function orderSuggestions(c: NoteComment, o: SuggestionOptions): { visible: SuggestionDef[]; hidden: SuggestionDef[] } {
	const usable = SUGGESTIONS.filter(
		(s) => c.challenges.includes(s.challenge) && (o.imagery !== false || s.kind !== 'imagery') && !(o.language === 'fr' && s.frenchOwed),
	);
	const primaries: SuggestionDef[] = [];
	const alternatives: SuggestionDef[] = [];
	for (const ch of c.challenges) {
		const list = usable.filter((s) => s.challenge === ch);
		const first = list.find((s) => !s.alternative) ?? list[0];
		if (first) primaries.push(first);
		alternatives.push(...list.filter((s) => s !== first));
	}
	const lead = leadSuggestion(c, primaries, o.measuredVowels);
	const rest = primaries.filter((s) => s !== lead).sort((a, b) => stakes(a) - stakes(b));
	const ordered = [...(lead ? [lead] : []), ...rest, ...alternatives];
	const n = o.all ? ordered.length : (o.visibleCount ?? COMMENT_DEFAULTS.visibleSuggestions);
	return { visible: ordered.slice(0, n), hidden: ordered.slice(n) };
}

// ── The rotation ─────────────────────────────────────────────────────

/**
 * The ruled English set (`PRODUCT.md`, 12:19), with the brief's r2 changes:
 * 3 is "You can experiment with", 5 is "Try…", 7 is "[Author] suggests".
 * The offer-slots draft's opener 6 ("See how it feels, in this phrase, to…")
 * is not in the ruled English set, so it is left out. DESK DEFAULT.
 */
export const OPENERS = [1, 2, 3, 4, 5, 7] as const;
export type Opener = (typeof OPENERS)[number];

/** The frame's shapes: A puts the leap in the second sentence; B and C attach it to the first, C naming the note it leaps from. */
export type FrameShape = 'A' | 'B' | 'C';

/** FNV-1a over the song's own events: stable across loads, different across songs. */
export function songSeed(parts: readonly string[]): number {
	let h = 0x811c9dc5;
	for (const s of parts) {
		for (let i = 0; i < s.length; i++) {
			h ^= s.charCodeAt(i);
			h = Math.imul(h, 0x01000193);
		}
		h ^= 0x2c;
		h = Math.imul(h, 0x01000193);
	}
	return h >>> 0;
}

export interface Voicing {
	frame: FrameShape;
	/** One opener per suggestion, visible then hidden. */
	openers: Opener[];
	/** Whether each suggestion prints its closer. */
	closers: boolean[];
}

/** ", and notice …" continues an invitation; after "One thing to explore is …" or "[Author] suggests …" it does not parse. */
export function openerFits(o: Opener, s: SuggestionDef, withCloser: boolean): boolean {
	return !(withCloser && s.closerJoin === 'and' && (o === 4 || o === 7));
}

export function frameShapesFor(c: NoteComment): FrameShape[] {
	return c.leap && c.phraseTop ? ['A', 'B', 'C'] : ['A'];
}

/**
 * The rotation (`PRODUCT.md`, "A SUGGESTION IS AN OFFER", DESK DEFAULT of
 * 12:27): it starts from the song's seed and steps by place on the page. The
 * page rule: no two comments on one page share a lead opener, a closer, or a
 * frame shape, where the pools allow. A closer that would repeat is dropped,
 * since a closer is optional; a frame shape repeats only when no other fits.
 */
export function rotate(
	comments: readonly NoteComment[],
	suggestions: readonly { visible: readonly SuggestionDef[]; hidden: readonly SuggestionDef[] }[],
	seed: number,
): Voicing[] {
	const usedLeads = new Set<Opener>();
	const usedClosers = new Set<'A' | 'B'>();
	const usedShapes = new Set<FrameShape>();
	return comments.map((c, k) => {
		const shapes = frameShapesFor(c);
		let frame = shapes[(seed + k) % shapes.length];
		if (usedShapes.has(frame)) frame = shapes.find((s) => !usedShapes.has(s)) ?? frame;
		if (shapes.length > 1) usedShapes.add(frame);

		const list = [...suggestions[k].visible, ...suggestions[k].hidden];
		const visibleCount = suggestions[k].visible.length;
		const closers = list.map((s, j) => {
			if (!s.closer) return false;
			if (j >= visibleCount) return true;
			if (usedClosers.has(s.closer)) return false;
			usedClosers.add(s.closer);
			return true;
		});

		const openers: Opener[] = [];
		list.forEach((s, j) => {
			// The openers this suggestion can take, so a skipped opener's share spreads evenly.
			const pool = OPENERS.filter((o) => openerFits(o, s, closers[j]));
			const start = j === 0 ? seed + k : seed + k + 3 + (j - 1);
			for (let step = 0; step < pool.length * 2; step++) {
				const o = pool[(start + step) % pool.length];
				const strict = step < pool.length;
				if (strict && openers.includes(o)) continue;
				if (strict && j === 0 && usedLeads.has(o)) continue;
				openers.push(o);
				if (j === 0) usedLeads.add(o);
				return;
			}
			openers.push(pool[0]);
		});
		return { frame, openers, closers };
	});
}

// ── The words ────────────────────────────────────────────────────────

/** A part under the singer's register, or the working register's where that one is not written. */
export function partKey(register: Register, part: string, language: Language): string {
	const own = `comment.${register}.${part}`;
	return hasString(own, language) ? own : `comment.working.${part}`;
}

const fill = (s: string, vars: Record<string, string | number>) =>
	Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, String(v)), s);

/** « de » before an infinitive, elided before a vowel or a mute h. */
function de(action: string): string {
	return /^[aeiouhâàéèêîôû]/i.test(action) ? 'd’' : 'de ';
}

export interface RenderContext {
	language: Language;
	register: Register;
	/** The spelled pitch of a sung event. */
	pitchOf: (eventId: string) => Pitch | undefined;
}

export interface RenderedSuggestion {
	id: string;
	kind: SuggestionKind;
	runs: Run[];
}

export interface RenderedComment {
	comment: NoteComment;
	frame: string;
	visible: RenderedSuggestion[];
	hidden: RenderedSuggestion[];
	/** "1 more thing to try", or empty when the tap holds no suggestion. */
	count: string;
	/** The tap's references: every row the comment's suggestions cite, in full. */
	references: Run[][];
	/** Rows the printed page cites: the visible suggestions only. */
	printedRows: string[];
}

export function leapWords(semitones: number, register: Register, language: Language): string {
	const key = semitones >= 7 && semitones <= 12 ? `leap.${semitones}` : 'leap.more';
	return t(partKey(register, key, language), language);
}

export function frameText(c: NoteComment, shape: FrameShape, ctx: RenderContext): string {
	const { language, register } = ctx;
	const T = (part: string) => t(partKey(register, part, language), language);
	const pitch = ctx.pitchOf(c.eventId);
	const vars: Record<string, string | number> = {
		vowel: c.vowel,
		pitch: pitch ? pitchLabel(pitch) : '',
	};
	if (c.leap) {
		vars.leap = leapWords(c.leap.semitones, register, language);
		const from = ctx.pitchOf(c.leap.fromEventId);
		vars.from = from ? pitchLabel(from) : '';
	}
	const attach = !!c.leap && c.phraseTop && shape !== 'A';
	const reached = attach ? fill(T(shape === 'C' ? 'frame.reachedFrom' : 'frame.reached'), vars) : '';

	let first: string;
	if (c.sustained && c.phraseTop) first = fill(T('frame.sustainedTop'), { ...vars, reached });
	else if (c.sustained) {
		const seconds = Math.round(c.seconds ?? 0);
		const ceiling = c.ceiling ? T('frame.ceiling') : '';
		first = fill(T(seconds === 1 ? 'frame.sustainedOne' : 'frame.sustained'), { ...vars, seconds, ceiling });
	} else first = fill(T('frame.top'), { ...vars, reached });

	let where = '';
	if (c.turn) {
		where = fill(T(c.turn.justPast ? 'where.turnJustPast' : 'where.turnPast'), {
			...vars,
			turn: pitchLabel(hzToPitch(c.turn.turningHz)),
		});
	} else if (c.resonance) {
		where = fill(T(c.resonance.side === 'above' ? 'where.above' : 'where.under'), {
			...vars,
			resonance: pitchLabel(hzToPitch(c.resonance.fR1Hz)),
		});
		if (c.kinds.includes('closedU')) where += fill(T('where.closedU'), vars);
	}
	const leapInSecond = !!c.leap && !attach;
	let second = '';
	if (leapInSecond && where) second = fill(T('frame.arrivesSits'), { ...vars, where });
	else if (leapInSecond) second = fill(T('frame.arrives'), vars);
	else if (where) second = fill(T('frame.sits'), { ...vars, where });
	return second ? `${first} ${second}` : first;
}

export function suggestionRuns(
	c: NoteComment,
	s: SuggestionDef,
	opener: Opener,
	withCloser: boolean,
	ctx: RenderContext,
): Run[] {
	const { language, register } = ctx;
	const pitch = ctx.pitchOf(c.eventId);
	const vars = { vowel: c.vowel, pitch: pitch ? pitchLabel(pitch) : '' };
	const action = fill(t(partKey(register, `try.${s.id}.action`, language), language), vars);
	const author = WORKS[ROWS[s.row].work].author;
	const lead = fill(t(`comment.opener.${opener}`, language), { action, author, de: de(action) });
	const closer = withCloser && s.closer ? fill(t(partKey(register, `try.${s.id}.closer`, language), language), vars) : '';
	return [{ text: `${lead}${closer} ` }, ...shortCitation(s.row, language, opener === 7), { text: '.' }];
}

export function renderComment(
	c: NoteComment,
	order: { visible: readonly SuggestionDef[]; hidden: readonly SuggestionDef[] },
	voicing: Voicing,
	ctx: RenderContext,
): RenderedComment {
	const list = [...order.visible, ...order.hidden];
	const rendered = list.map((s, j) => ({
		id: s.id,
		kind: s.kind,
		runs: suggestionRuns(c, s, voicing.openers[j], voicing.closers[j], ctx),
	}));
	const n = order.hidden.length;
	const count = n === 0 ? '' : fill(t(n === 1 ? 'comment.count.one' : 'comment.count.many', ctx.language), { n });
	const rows: string[] = [];
	for (const s of list) for (const r of [s.row, ...s.supportRows]) if (!rows.includes(r)) rows.push(r);
	return {
		comment: c,
		frame: frameText(c, voicing.frame, ctx),
		visible: rendered.slice(0, order.visible.length),
		hidden: rendered.slice(order.visible.length),
		count,
		references: rows.map((r) => rowReference(r, ctx.language)),
		printedRows: order.visible.map((s) => s.row),
	};
}

/** The whole page's comments, rotated together so the page rule holds. */
export function renderComments(
	comments: readonly NoteComment[],
	seed: number,
	o: SuggestionOptions & { register: Register; pitchOf: RenderContext['pitchOf'] },
): RenderedComment[] {
	const orders = comments.map((c) => orderSuggestions(c, o));
	const voicings = rotate(comments, orders, seed);
	const ctx: RenderContext = { language: o.language, register: o.register, pitchOf: o.pitchOf };
	return comments.map((c, k) => renderComment(c, orders[k], voicings[k], ctx));
}

/** Plain text of runs, for tests and the corpus check. */
export function runsText(runs: readonly Run[]): string {
	return runs.map((r) => r.text).join('');
}
