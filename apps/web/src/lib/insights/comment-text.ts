/**
 * N.168: how a note comment reads. Pure, like `comments.ts`, which decides
 * whether a note speaks at all; this file decides the words.
 *
 * The grammar is r7's (`~/Documents/Voice Pedagogy Library/Insights Research/
 * _synthesis/draft-three-comments_r7_2026-09-29.md`; English ratified by Dann
 * 2026-09-28 23:37, "try" removed 2026-09-29 22:51, built 2026-09-30):
 *
 *   1. A FRAME of one sentence: the note, how long it is sustained, and where
 *      it sits against the singer's own values (the first resonance, the turn,
 *      the secondo). Musical weight ranks a comment and never earns a line, so
 *      the leap and the phrase's top no longer print (r5 §0).
 *   2. A CONSEQUENCE, in Dann's shape (23:14): what the voice tends to do here
 *      on its own; but what resisting it tends to bring. Every half is cited.
 *   3. SUGGESTIONS: r7's lead, visible, in its ratified words; the others
 *      behind the tap, each an offer (opener + action + a closer only where
 *      the source states an outcome the singer can hear or feel).
 *   4. A COUNT of what the tap holds, and the tap label.
 *
 * Every sentence is an i18n entry with placeholders. Registers: each part is
 * looked up under the singer's register and falls back to working, the only
 * register written so far (brief item 7a).
 *
 * A comment whose note names no resonance, turn, or closed [u] has nothing
 * r7 can say: its consequence and its suggestion (MIL04-035) are gone (r4's
 * desk correction). `speaks()` keeps it off the page. DESK DEFAULT.
 */

import { hzToPitch, type Pitch } from '@ilya/score-parser';
import { hasString, t, type Language } from '$lib/i18n';
import { pitchLabel } from '$lib/voice/note-picker';
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
	 * it reads only after an invitation (openers 2 and 3); ". Notice …" and
	 * ", to see whether …" read after any opener.
	 */
	closerJoin?: 'and' | 'sentence' | 'purpose';
	/** Its firing test reads the vowel's fR1 (rule 1 of r2 §0 when that fR1 was measured). */
	readsResonance: boolean;
	/** The case the source describes, for rule 2: the voice and the pitch. Absent where the source states no case. */
	case?: { treble: boolean; midi: number };
	/** The wording is not ratified in French; a French page leaves it out rather than print English inside French. */
	frenchOwed: boolean;
	/**
	 * r7's ratified words fix the opener: `'own'` when the action carries its
	 * own opening ("You might let …"), else the one opener. A fixed suggestion
	 * always prints its closer, which is part of the ratified sentence.
	 */
	opener?: Opener | 'own';
	/** Behind the tap only, never the lead: McKinney's "position" (r5). */
	tapOnly?: true;
	/** False where the comment's consequence already cites the row (r7's [u] lead). */
	cite?: false;
}

export const SUGGESTIONS: readonly SuggestionDef[] = [
	{ id: 'jaw', challenge: 'resonance', row: 'MIL04-028', supportRows: [], kind: 'tract-shaping', alternative: false, closer: 'A', closerJoin: 'and', readsResonance: true, frenchOwed: false, opener: 'own' },
	{ id: 'closePosture', challenge: 'turn', row: 'KVP2-037', supportRows: [], kind: 'vowel-modification', alternative: false, closer: 'A', closerJoin: 'sentence', readsResonance: true, frenchOwed: false, opener: 7 },
	// Miller's baritone on /ɑ/ at E♭4 to G4 (MIL04-010); the case pitch is the middle of that span.
	{ id: 'mixed', challenge: 'turn', row: 'MIL04-010', supportRows: ['MIL04-017'], kind: 'vowel-modification', alternative: true, closer: null, readsResonance: false, case: { treble: false, midi: 65 }, frenchOwed: true },
	{ id: 'lean', challenge: 'closedU', row: 'RMR-057', supportRows: [], kind: 'vowel-modification', alternative: false, closer: 'A', closerJoin: 'and', readsResonance: true, frenchOwed: false, opener: 'own', cite: false },
	// Reid's baritone on the upper D (REID-054), D4.
	{ id: 'decrescendo', challenge: 'closedU', row: 'REID-057', supportRows: ['REID-054', 'HS-B-058'], kind: 'dynamics', alternative: true, closer: 'B', closerJoin: 'purpose', readsResonance: false, case: { treble: false, midi: 62 }, frenchOwed: false },
	{ id: 'preface', challenge: 'closedU', row: 'MIL04-008', supportRows: [], kind: 'vowel-modification', alternative: true, closer: null, readsResonance: false, frenchOwed: true },
	{ id: 'legato', challenge: 'leap', row: 'MCK-049', supportRows: [], kind: 'imagery', alternative: false, closer: null, readsResonance: false, frenchOwed: false, tapOnly: true },
];

/** The challenges r7 can speak to: each has a consequence sentence and a lead. */
const SPOKEN: readonly Challenge[] = ['resonance', 'turn', 'closedU'];

/**
 * Whether a comment prints. A comment every Q6 topic hid still counts as
 * hidden by settings, so it passes here and `selectComments` counts it.
 */
export function speaks(c: NoteComment): boolean {
	return c.kinds.length === 0 || c.challenges.some((ch) => SPOKEN.includes(ch));
}

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

/**
 * One suggestion per challenge is visible, the lead by `leadSuggestion`, the
 * rest by stakes; the alternatives and the tap-only suggestions follow behind
 * the tap. "All of them" shows every one.
 */
export function orderSuggestions(c: NoteComment, o: SuggestionOptions): { visible: SuggestionDef[]; hidden: SuggestionDef[] } {
	const usable = SUGGESTIONS.filter(
		(s) => c.challenges.includes(s.challenge) && (o.imagery !== false || s.kind !== 'imagery') && !(o.language === 'fr' && s.frenchOwed),
	);
	const primaries: SuggestionDef[] = [];
	const alternatives: SuggestionDef[] = [];
	for (const ch of c.challenges) {
		const list = usable.filter((s) => s.challenge === ch && !s.tapOnly);
		const first = list.find((s) => !s.alternative) ?? list[0];
		if (first) primaries.push(first);
		alternatives.push(...list.filter((s) => s !== first));
	}
	const tapOnly = usable.filter((s) => s.tapOnly);
	const lead = leadSuggestion(c, primaries, o.measuredVowels);
	const rest = primaries.filter((s) => s !== lead).sort((a, b) => stakes(a) - stakes(b));
	const ordered = [...(lead ? [lead] : []), ...rest, ...alternatives, ...tapOnly];
	const n = o.all ? ordered.length : Math.min(o.visibleCount ?? COMMENT_DEFAULTS.visibleSuggestions, primaries.length);
	return { visible: ordered.slice(0, n), hidden: ordered.slice(n) };
}

// ── The rotation ─────────────────────────────────────────────────────

/**
 * The ruled English set (`PRODUCT.md`, 12:19), with the brief's r2 changes:
 * 3 is "You can experiment with", 7 is "[Author] suggests".
 * The offer-slots draft's opener 6 ("See how it feels, in this phrase, to…")
 * is not in the ruled English set, so it is left out. DESK DEFAULT.
 * Openers 1 ("You might try") and 5 ("Try") left the rotation 2026-09-30 under
 * "No 'try' in what Insights says to the singer" (Dann, 2026-09-29 22:51; Dayme, pp. 21 to 22; `docs/memory/OPEN.md` §N.168).
 * Their strings stay in `i18n.ts`, unused, so the change is one line to undo.
 * r7's leads fix their own openers (`SuggestionDef.opener`); the rotation
 * voices the suggestions behind the tap.
 */
export const OPENERS = [2, 3, 4, 7] as const;
export type Opener = (typeof OPENERS)[number];

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
	/** One opener per suggestion, visible then hidden. */
	openers: (Opener | 'own')[];
	/** Whether each suggestion prints its closer. */
	closers: boolean[];
}

/** ", and notice …" continues an invitation; after "One thing to explore is …" or "[Author] suggests …" it does not parse. */
export function openerFits(o: Opener | 'own', s: SuggestionDef, withCloser: boolean): boolean {
	if (s.opener !== undefined) return o === s.opener;
	return !(withCloser && s.closerJoin === 'and' && (o === 4 || o === 7));
}

/**
 * The rotation (`PRODUCT.md`, "A SUGGESTION IS AN OFFER", DESK DEFAULT of
 * 12:27): it starts from the song's seed and steps by place on the page. The
 * page rule: no two comments on one page share a rotated lead opener or a
 * closer, where the pools allow. A closer that would repeat is dropped, since
 * a closer is optional. r7's fixed suggestions keep their ratified words, so
 * they take no part in the page rule: two [i] comments on one page read the
 * same lead. DESK DEFAULT.
 */
export function rotate(
	comments: readonly NoteComment[],
	suggestions: readonly { visible: readonly SuggestionDef[]; hidden: readonly SuggestionDef[] }[],
	seed: number,
): Voicing[] {
	const usedLeads = new Set<Opener>();
	const usedClosers = new Set<'A' | 'B'>();
	return comments.map((_, k) => {
		const list = [...suggestions[k].visible, ...suggestions[k].hidden];
		const visibleCount = suggestions[k].visible.length;
		const closers = list.map((s, j) => {
			if (!s.closer) return false;
			if (s.opener !== undefined || j >= visibleCount) return true;
			if (usedClosers.has(s.closer)) return false;
			usedClosers.add(s.closer);
			return true;
		});

		const openers: (Opener | 'own')[] = [];
		list.forEach((s, j) => {
			if (s.opener !== undefined) {
				openers.push(s.opener);
				return;
			}
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
		return { openers, closers };
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

/** Stands in for "(fR1)" until the text becomes runs. */
const FR1 = '\u0001';

/**
 * Text to runs: `*…*` sets in italics, FR1 becomes " (*f*<sub>R1</sub>)" (the
 * form checked against Titze et al. 2015, Table I, p. 3006), and
 * `{cite:ROW+ROW}` becomes the short citation of those rows.
 */
function toRuns(text: string, language: Language, cited: string[] = []): Run[] {
	const out: Run[] = [];
	for (const part of text.split(/(\{cite:[^}]+\}|\*[^*]+\*|\u0001)/)) {
		if (!part) continue;
		if (part === FR1) out.push({ text: ' (' }, { text: 'f', title: true }, { text: 'R1', sub: true }, { text: ')' });
		else if (part.startsWith('{cite:')) {
			const rows = part.slice(6, -1).split('+');
			cited.push(...rows);
			out.push(...shortCitation(rows, language));
		} else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) out.push({ text: part.slice(1, -1), title: true });
		else out.push({ text: part });
	}
	return out;
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
	frame: Run[];
	/** The consequence sentence, with its citations. */
	consequence: Run[];
	visible: RenderedSuggestion[];
	hidden: RenderedSuggestion[];
	/** "1 more thing to explore", or empty when the tap holds no suggestion. */
	count: string;
	/** The tap's references: every row the comment cites, in full. */
	references: Run[][];
	/** Rows the printed page cites: the consequence and the visible suggestions. */
	printedRows: string[];
	/** Whether the frame printed "(fR1)", so the page prints it once. */
	namedFR1: boolean;
}

/** Where the note sits against the secondo, for the closed [u] (r7: "just above your secondo passaggio"). COMPOSED past "just above". */
function secondoPart(toSecondo: number | undefined): string | null {
	if (toSecondo === undefined) return null;
	if (toSecondo === 0) return 'where.secondoAt';
	if (toSecondo >= 1 && toSecondo <= 2) return 'where.secondoJustAbove';
	if (toSecondo > 2) return 'where.secondoAbove';
	if (toSecondo >= -2) return 'where.secondoJustUnder';
	return null;
}

/** The frame, and whether it named "(fR1)". `nameFR1`: no comment before it on the page has. */
export function frameRuns(c: NoteComment, ctx: RenderContext, nameFR1: boolean): { runs: Run[]; namedFR1: boolean } {
	const { language, register } = ctx;
	const T = (part: string) => t(partKey(register, part, language), language);
	const pitch = ctx.pitchOf(c.eventId);
	const vars: Record<string, string | number> = { vowel: c.vowel, pitch: pitch ? pitchLabel(pitch) : '' };
	let namedFR1 = false;
	const resonance = () => {
		if (!c.resonance) return null;
		const s = fill(T(c.resonance.side === 'above' ? 'where.above' : 'where.under'), { ...vars, fR1: nameFR1 ? FR1 : '' });
		namedFR1 = nameFR1;
		return s;
	};

	const parts: string[] = [];
	if (c.turn) {
		parts.push(fill(T(c.turn.justPast ? 'where.turnJustPast' : 'where.turnPast'), { ...vars, turn: pitchLabel(hzToPitch(c.turn.turningHz)) }));
	} else if (c.kinds.includes('closedU')) {
		const secondo = secondoPart(c.toSecondo);
		if (secondo) parts.push(fill(T(secondo), vars));
		const r = resonance();
		if (r) parts.push(r);
	} else {
		const r = resonance();
		if (r) parts.push(r);
	}
	const where = parts.join(T('where.and'));

	let text: string;
	if (c.sustained) {
		const tail = where ? `, ${where}` : '';
		if (c.seconds === undefined) text = fill(T('frame.sustainedUntimed'), { ...vars, where: tail });
		else {
			const seconds = Math.round(c.seconds);
			text = fill(T(seconds === 1 ? 'frame.sustainedOne' : 'frame.sustained'), { ...vars, seconds, where: tail });
		}
	} else text = fill(T('frame.sits'), { ...vars, where });
	return { runs: toRuns(text, language), namedFR1 };
}

/** The consequence sentence for the comment's spoken challenge, and the rows it cites. */
export function consequenceRuns(c: NoteComment, ctx: RenderContext): { runs: Run[]; rows: string[] } {
	const part = c.challenges.includes('turn')
		? 'consequence.turn'
		: c.challenges.includes('closedU')
			? 'consequence.closedU'
			: c.challenges.includes('resonance')
				? 'consequence.resonance'
				: null;
	if (!part) return { runs: [], rows: [] };
	const rows: string[] = [];
	const text = fill(t(partKey(ctx.register, part, ctx.language), ctx.language), { vowel: c.vowel });
	return { runs: toRuns(text, ctx.language, rows), rows };
}

export function suggestionRuns(
	c: NoteComment,
	s: SuggestionDef,
	opener: Opener | 'own',
	withCloser: boolean,
	ctx: RenderContext,
): Run[] {
	const { language, register } = ctx;
	const pitch = ctx.pitchOf(c.eventId);
	const vars = { vowel: c.vowel, pitch: pitch ? pitchLabel(pitch) : '' };
	const action = fill(t(partKey(register, `try.${s.id}.action`, language), language), vars);
	const author = WORKS[ROWS[s.row].work].author;
	const lead = opener === 'own' ? action : fill(t(`comment.opener.${opener}`, language), { action, author, de: de(action) });
	const closer = withCloser && s.closer ? fill(t(partKey(register, `try.${s.id}.closer`, language), language), vars) : '';
	if (s.cite === false) return toRuns(`${lead}${closer}.`, language);
	return [...toRuns(`${lead}${closer} `, language), ...shortCitation(s.row, language, opener === 7), { text: '.' }];
}

export function renderComment(
	c: NoteComment,
	order: { visible: readonly SuggestionDef[]; hidden: readonly SuggestionDef[] },
	voicing: Voicing,
	ctx: RenderContext,
	nameFR1 = true,
): RenderedComment {
	const list = [...order.visible, ...order.hidden];
	const rendered = list.map((s, j) => ({
		id: s.id,
		kind: s.kind,
		runs: suggestionRuns(c, s, voicing.openers[j], voicing.closers[j], ctx),
	}));
	const n = order.hidden.length;
	const count = n === 0 ? '' : fill(t(n === 1 ? 'comment.count.one' : 'comment.count.many', ctx.language), { n });
	const frame = frameRuns(c, ctx, nameFR1);
	const consequence = consequenceRuns(c, ctx);
	const rows: string[] = [];
	const add = (r: string) => void (rows.includes(r) || rows.push(r));
	consequence.rows.forEach(add);
	for (const s of list) [s.row, ...s.supportRows].forEach(add);
	const printed: string[] = [];
	for (const r of [...consequence.rows, ...order.visible.filter((s) => s.cite !== false).map((s) => s.row)]) if (!printed.includes(r)) printed.push(r);
	return {
		comment: c,
		frame: frame.runs,
		consequence: consequence.runs,
		visible: rendered.slice(0, order.visible.length),
		hidden: rendered.slice(order.visible.length),
		count,
		references: rows.map((r) => rowReference(r, ctx.language)),
		printedRows: printed,
		namedFR1: frame.namedFR1,
	};
}

/** The whole page's comments, rotated together so the page rule holds; "(fR1)" prints on its first appearance only. */
export function renderComments(
	comments: readonly NoteComment[],
	seed: number,
	o: SuggestionOptions & { register: Register; pitchOf: RenderContext['pitchOf'] },
): RenderedComment[] {
	const orders = comments.map((c) => orderSuggestions(c, o));
	const voicings = rotate(comments, orders, seed);
	const ctx: RenderContext = { language: o.language, register: o.register, pitchOf: o.pitchOf };
	let named = false;
	return comments.map((c, k) => {
		const r = renderComment(c, orders[k], voicings[k], ctx, !named);
		named ||= r.namedFR1;
		return r;
	});
}

/** Plain text of runs, for tests and the corpus check. */
export function runsText(runs: readonly Run[]): string {
	return runs.map((r) => r.text).join('');
}
