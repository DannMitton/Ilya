/**
 * N.168, first slice: the note comments Insights prints, computed.
 *
 * Brief: `docs/sessions/brief-code-n168-first-slice_r2_2026-09-25.md`. The
 * firing tests are r1's (`draft-three-comments_r1_2026-09-25.md` §1.1, §2.1,
 * §3.1, in `~/Documents/Voice Pedagogy Library/Insights Research/_synthesis/`),
 * with the desk defaults of 13:28 for comment 3. Wording lives in
 * `comment-text.ts`; sources in `comment-sources.ts`. Pure functions, no DOM.
 *
 * THE ORACLE AND THE APP CALL THE SAME CODE. `noteFacts` is lifted out of
 * `tools/n168-frequency-run/frequency-run.run.ts` (the turning pitch, the
 * semitones to each passaggio, the highest of the phrase), and the run now
 * calls it, so its per-note CSVs and this module cannot drift apart.
 *
 * Every threshold r1 names a "build default" is in `COMMENT_DEFAULTS`, so a
 * number can move without anyone reading code. Tags: SOURCED (a ruling or a
 * row), DESK DEFAULT (reversible, Dann's to wave off), NOT ESTABLISHED.
 */

import {
	pitchToMidi,
	type IntakeAnswers,
	type IntakePoint,
	type IntakeTopic,
	type NoteCondition,
	type VoiceProfileSnapshot,
} from '@ilya/score-parser';

// ── The numbers ──────────────────────────────────────────────────────

/** An intake answer's band: points 1 to 2, point 3, points 4 to 5. */
export type IntakeBand = 'points1to2' | 'point3' | 'points4to5';

export const COMMENT_DEFAULTS = {
	/** Comments shown before "more observations". Dann accepted five, 2026-09-24 23:06 (curation rule 7). */
	budget: 5,
	/** Suggestions visible per comment before the tap. Dann, 2026-09-25 13:00. */
	visibleSuggestions: 2,
	/** Comment 1: summed seconds over the tie chain, by the answer to Q4. r1 §1.1, build defaults. */
	sustainedSeconds: { points1to2: 1.5, point3: 2.5, points4to5: 4.0 } as Record<IntakeBand, number>,
	/** Comment 1: the note lies no more than this far under the secondo. r1 §1.1. */
	sustainedFromSecondo: -1,
	/** Comment 1, non-treble: a close vowel within this many cents under its fR1. r1 §1.1, build default. */
	closeVowelCents: -200,
	/** Comment 2, non-treble: semitones from the secondo, by the answer to Q3. r1 §2.1, build defaults. */
	turningWindow: { points1to2: [-3, 5], point3: [-1, 3], points4to5: [0, 2] } as Record<IntakeBand, [number, number]>,
	/** Comment 2, treble: fo within this many cents under fR1. r1 §2.1, build default. */
	trebleOpenCents: -100,
	/** Comment 2, treble: semitones from either passaggio, by the answer to Q3. r1 §2.1, build defaults. */
	trebleEdge: { points1to2: 3, point3: 2, points4to5: 1 } as Record<IntakeBand, number>,
	/** Comment 3: fo within a minor third under fR1[u]. r1 §3.1, build default. */
	closedUCents: -300,
	/** The leap clause: an ascending leap of at least this many semitones. r1 §1.1 clause 3, build default. */
	leapSemitones: 7,
	/** Comment 1's "notice this": at least this many later notes of the phrase inside the zona. r1 §1.1 clause 4. */
	descentNotes: 2,
	/** "just past" the turning pitch under this many semitones, "past" at or above it. DESK DEFAULT. */
	justPastSemitones: 2,
	/**
	 * A voice whose secondo sits at or above B4 is read as treble. DESK DEFAULT,
	 * an INFERENCE from Miller 1986: every male secondo on p. 117 is at or under
	 * A4, every female one on pp. 134 to 135 at or above D5. Ilya asks no voice type.
	 */
	trebleSecondoMidi: 71,
	/** Rarity, r1 §4 step 4: a DESK PROPOSAL, not ruled, so OFF. */
	rarity: false,
	/** Rarity's threshold: firing patterns in more than this share of the song's phrases. */
	rarityShare: 1 / 3,
};

export type CommentDefaults = typeof COMMENT_DEFAULTS;

/** Open vowels for comment 2. r1 §2.1. */
export const OPEN_VOWELS: ReadonlySet<string> = new Set(['ɑ', 'a', 'ɛ', 'ʌ']);
/** Close vowels for comment 1's resonance clause. r1 §1.1. */
export const CLOSE_VOWELS: ReadonlySet<string> = new Set(['i', 'ɪ', 'ɨ', 'e', 'o', 'u']);
/**
 * The front close vowels, the only ones whose resonance suggestion is worded.
 * MIL04-028 is stated for the front vowels (r1 §1.1). The back-vowel wording
 * (RMR-057) has no ratified form, so [o] and [u] carry no comment-1 resonance
 * clause in this slice; [u] is served by comment 3. DESK DEFAULT.
 */
export const FRONT_CLOSE_VOWELS: ReadonlySet<string> = new Set(['i', 'ɪ', 'ɨ', 'e']);

/** A skip counts as point 3 and "not sure" as point 2. Dann, 2026-09-24 23:22 and 23:37. */
export function effectivePoint(p: IntakePoint | undefined): 1 | 2 | 3 | 4 | 5 {
	if (p === undefined) return 3;
	if (p === 'not-sure') return 2;
	return p;
}

export function intakeBand(p: IntakePoint | undefined): IntakeBand {
	const n = effectivePoint(p);
	return n <= 2 ? 'points1to2' : n === 3 ? 'point3' : 'points4to5';
}

/** The register of the visible line, from Q7. `PRODUCT.md`, "THE SAME POINT IN THREE REGISTERS". */
export type Register = 'plain' | 'working' | 'technical';

export function registerFor(intake: IntakeAnswers | undefined): Register {
	const n = effectivePoint(intake?.acoustics);
	return n <= 2 ? 'plain' : n === 3 ? 'working' : 'technical';
}

/** Treble by the typed secondo; `undefined` when no secondo was typed. */
export function isTreble(profile: VoiceProfileSnapshot, defaults: CommentDefaults = COMMENT_DEFAULTS): boolean | undefined {
	const s = profile.passaggio?.secondo;
	return s ? pitchToMidi(s) >= defaults.trebleSecondoMidi : undefined;
}

// ── The derivations, lifted from the frequency run ───────────────────

export type PassaggioZone = 'below primo' | 'inside' | 'above secondo';

export interface NoteFacts {
	note: NoteCondition;
	/** fo from the MIDI number, A4 = 440, as `pitchToHz` computes it. */
	foHz: number;
	/** The singer's fR1 for this note's vowel. Absent: not assessed. */
	fR1Hz?: number;
	/** The turning pitch, fR1 ÷ 2 (`frequency-run.run.ts:597`, as it was). */
	turningHz?: number;
	/** Signed semitones from the turning pitch to the note; positive above it. */
	semitonesFromTurning?: number;
	/** Signed cents from fR1 to fo; positive when fo is above fR1. */
	centsFromFR1?: number;
	toPrimo?: number;
	toSecondo?: number;
	passaggio?: PassaggioZone;
	/** Ties at the top of a phrase all count. */
	highestOfPhrase: boolean;
	/** False on a tied continuation, which belongs to the note it continues. */
	chainHead: boolean;
	/** Seconds summed over the tie chain this note belongs to. Absent with no tempo. */
	chainSeconds?: number;
	/** Index of the chain's head in the facts array. */
	headIndex: number;
}

const hzOfMidi = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/** One `NoteFacts` per note, in the order given (performance order in the app and the run). */
export function noteFacts(notes: readonly NoteCondition[], profile: VoiceProfileSnapshot): NoteFacts[] {
	const phraseTop = new Map<number, number>();
	for (const n of notes) phraseTop.set(n.phrase.index, Math.max(phraseTop.get(n.phrase.index) ?? -Infinity, n.midi));
	const primo = profile.passaggio ? pitchToMidi(profile.passaggio.primo) : undefined;
	const secondo = profile.passaggio ? pitchToMidi(profile.passaggio.secondo) : undefined;

	const heads: number[] = [];
	notes.forEach((n, i) => heads.push(n.approach?.band === 'tie' && i > 0 ? heads[i - 1] : i));
	const chainSeconds = new Map<number, number>();
	notes.forEach((n, i) => {
		if (n.seconds !== undefined) chainSeconds.set(heads[i], (chainSeconds.get(heads[i]) ?? 0) + n.seconds);
	});

	return notes.map((n, i) => {
		const foHz = hzOfMidi(n.midi);
		const fR1 = n.vowel !== undefined ? profile.fR1[n.vowel] : undefined;
		const fR1Hz = typeof fR1 === 'number' && fR1 > 0 ? fR1 : undefined;
		const turningHz = fR1Hz !== undefined ? fR1Hz / 2 : undefined;
		return {
			note: n,
			foHz,
			...(fR1Hz !== undefined ? { fR1Hz, centsFromFR1: 1200 * Math.log2(foHz / fR1Hz) } : {}),
			...(turningHz !== undefined ? { turningHz, semitonesFromTurning: 12 * Math.log2(foHz / turningHz) } : {}),
			...(primo !== undefined && secondo !== undefined
				? {
						toPrimo: n.midi - primo,
						toSecondo: n.midi - secondo,
						passaggio: (n.midi < primo ? 'below primo' : n.midi > secondo ? 'above secondo' : 'inside') as PassaggioZone,
					}
				: {}),
			highestOfPhrase: n.midi === phraseTop.get(n.phrase.index),
			chainHead: heads[i] === i,
			...(chainSeconds.has(heads[i]) ? { chainSeconds: chainSeconds.get(heads[i])! } : {}),
			headIndex: heads[i],
		};
	});
}

// ── The firing tests ─────────────────────────────────────────────────

/** Comment 1, the sustained note at the top; 2, the open vowel turning; 3, the closed [u]. */
export type CommentKind = 'sustained' | 'turning' | 'closedU';

/** What the comment names, one clause each (ruling of 2026-09-25 02:44). */
export type Challenge = 'sustain' | 'leap' | 'resonance' | 'turn' | 'closedU';

/** The order the second visible suggestion follows until N.173 ranks challenges. DESK DEFAULT. */
export const STAKES_ORDER: readonly Challenge[] = ['sustain', 'leap', 'turn', 'resonance', 'closedU'];

/** Which Q6 topic hides each comment. Comment 3 answers to none (DESK DEFAULT, 13:28). */
export const TOPIC_OF: Record<CommentKind, IntakeTopic | null> = {
	sustained: 'sustained',
	turning: 'passaggi',
	closedU: null,
};

export interface FiringOptions {
	intake?: IntakeAnswers;
	treble: boolean | undefined;
	/** The singer's typed range ceiling, MIDI. Absent when no range was typed. */
	ceilingMidi?: number;
	defaults?: CommentDefaults;
}

export interface Firings {
	sustained: boolean;
	turning: boolean;
	closedU: boolean;
}

/** Comment 1, r1 §1.1: summed seconds at or over T, and no more than a semitone under the secondo. */
export function firesSustained(f: NoteFacts, o: FiringOptions): boolean {
	const d = o.defaults ?? COMMENT_DEFAULTS;
	if (f.toSecondo === undefined || f.chainSeconds === undefined) return false;
	const T = d.sustainedSeconds[intakeBand(o.intake?.sustained)];
	return f.chainSeconds >= T - 1e-9 && f.toSecondo >= d.sustainedFromSecondo;
}

/** Comment 2, r1 §2.1, both forms. */
export function firesTurning(f: NoteFacts, o: FiringOptions): boolean {
	const d = o.defaults ?? COMMENT_DEFAULTS;
	const v = f.note.vowel;
	if (v === undefined || !OPEN_VOWELS.has(v)) return false;
	if (!(f.note.held || f.highestOfPhrase)) return false;
	const band = intakeBand(o.intake?.passaggi);
	if (o.treble === true) {
		if (f.centsFromFR1 === undefined || f.centsFromFR1 < d.trebleOpenCents - 1e-9) return false;
		// A treble voice with no passaggi fires on the resonance alone (r1 §2.1).
		if (f.toSecondo === undefined || f.toPrimo === undefined) return true;
		const e = d.trebleEdge[band];
		// Miller's weak region (MIL04-021) needs a voice category Ilya does not ask, so only the edges apply. NOT ESTABLISHED.
		return Math.abs(f.toSecondo) <= e || Math.abs(f.toPrimo) <= e;
	}
	if (f.semitonesFromTurning === undefined || f.toSecondo === undefined) return false;
	if (f.semitonesFromTurning < -1e-9) return false;
	const [lo, hi] = d.turningWindow[band];
	return f.toSecondo >= lo && f.toSecondo <= hi;
}

/** Comment 3, r1 §3.1 with the desk default of 13:28: sustained or phrase-top only, non-treble only. */
export function firesClosedU(f: NoteFacts, o: FiringOptions): boolean {
	const d = o.defaults ?? COMMENT_DEFAULTS;
	if (o.treble !== false || f.note.vowel !== 'u' || f.centsFromFR1 === undefined) return false;
	return f.centsFromFR1 >= d.closedUCents - 1e-9 && (f.note.held || f.highestOfPhrase);
}

export function firings(f: NoteFacts, o: FiringOptions): Firings {
	return { sustained: firesSustained(f, o), turning: firesTurning(f, o), closedU: firesClosedU(f, o) };
}

// ── One note, one comment ────────────────────────────────────────────

export interface NoteComment {
	eventId: string;
	/** Place in performance order. */
	order: number;
	measureIndex: number;
	midi: number;
	vowel: string;
	phraseIndex: number;
	treble: boolean;
	/** The comments this note fired and the singer's topics let through. */
	kinds: CommentKind[];
	/** Fired, and hidden by a Q6 topic. */
	hiddenKinds: CommentKind[];
	/** Summed seconds over the tie chain; absent with no tempo. */
	seconds?: number;
	/** The frame says "is sustained". */
	sustained: boolean;
	/** The frame says "is the highest note of its phrase": comments 2 and 3 name it, comment 1 does not. */
	phraseTop: boolean;
	/** The note is the singer's typed range ceiling. Only comment 1 names it. */
	ceiling: boolean;
	/** An ascending leap of at least `leapSemitones`, and the note it leaps from. */
	leap?: { semitones: number; fromEventId: string };
	/** Where the note sits against its own fR1: comment 1's clause or comment 3's. */
	resonance?: { side: 'above' | 'under'; fR1Hz: number; cents: number };
	/** Comment 2's turn, non-treble. */
	turn?: { turningHz: number; semitones: number; justPast: boolean };
	/** Comment 1's "notice this": the phrase comes down through the zona. Computed, not yet worded. */
	descent: boolean;
	/** One clause each, in the frame's order. */
	challenges: Challenge[];
}

export interface CommentsInput extends FiringOptions {
	facts: readonly NoteFacts[];
}

function topicOn(intake: IntakeAnswers | undefined, kind: CommentKind): boolean {
	const topic = TOPIC_OF[kind];
	return topic === null || intake?.topics?.[topic] !== false;
}

/**
 * Every note that fires, merged: one comment per note however many rules fire
 * on it (Dann, 2026-09-25 02:44), in performance order. Treble comments are
 * computed here; the pane does not show them yet (the treble wording is not ruled).
 */
export function noteComments(input: CommentsInput): NoteComment[] {
	const d = input.defaults ?? COMMENT_DEFAULTS;
	const facts = input.facts;
	const out: NoteComment[] = [];
	facts.forEach((f, i) => {
		if (!f.chainHead || f.note.vowel === undefined) return;
		const fired = firings(f, input);
		const firedKinds = (['sustained', 'turning', 'closedU'] as const).filter((k) => fired[k]);
		if (firedKinds.length === 0) return;
		const kinds = firedKinds.filter((k) => topicOn(input.intake, k));
		const hiddenKinds = firedKinds.filter((k) => !topicOn(input.intake, k));
		const vowel = f.note.vowel;
		const treble = input.treble === true;

		const a = f.note.approach;
		const prev = facts[i - 1];
		const leap =
			a && a.band === 'leap-up' && a.semitones >= d.leapSemitones && prev
				? { semitones: a.semitones, fromEventId: prev.note.eventId }
				: undefined;

		let resonance: NoteComment['resonance'];
		if (kinds.includes('closedU') && f.fR1Hz !== undefined && f.centsFromFR1 !== undefined) {
			resonance = { side: f.centsFromFR1 >= 0 ? 'above' : 'under', fR1Hz: f.fR1Hz, cents: f.centsFromFR1 };
		} else if (
			kinds.includes('sustained') &&
			!treble &&
			FRONT_CLOSE_VOWELS.has(vowel) &&
			f.fR1Hz !== undefined &&
			f.centsFromFR1 !== undefined &&
			f.centsFromFR1 >= d.closeVowelCents - 1e-9
		) {
			resonance = { side: f.centsFromFR1 >= 0 ? 'above' : 'under', fR1Hz: f.fR1Hz, cents: f.centsFromFR1 };
		}

		const turn =
			kinds.includes('turning') && !treble && f.turningHz !== undefined && f.semitonesFromTurning !== undefined
				? { turningHz: f.turningHz, semitones: f.semitonesFromTurning, justPast: f.semitonesFromTurning < d.justPastSemitones }
				: undefined;

		let descent = false;
		if (kinds.includes('sustained') && topicOn(input.intake, 'sustained') && input.intake?.topics?.other !== false) {
			let inside = 0;
			for (let j = i + 1; j < facts.length && facts[j].note.phrase.index === f.note.phrase.index; j++) {
				if (!facts[j].chainHead || facts[j].headIndex === i) continue;
				if (facts[j].passaggio === 'inside') inside++;
			}
			descent = inside >= d.descentNotes;
		}

		const sustained = kinds.includes('sustained') || ((kinds.includes('turning') || kinds.includes('closedU')) && f.note.held);
		const phraseTop = (kinds.includes('turning') || kinds.includes('closedU')) && f.highestOfPhrase;
		const ceiling = kinds.includes('sustained') && input.ceilingMidi !== undefined && f.note.midi === input.ceilingMidi;

		const challenges: Challenge[] = [];
		if (kinds.includes('sustained')) challenges.push('sustain');
		if (kinds.length > 0 && leap) challenges.push('leap');
		if (turn) challenges.push('turn');
		if (kinds.includes('closedU')) challenges.push('closedU');
		else if (resonance) challenges.push('resonance');

		out.push({
			eventId: f.note.eventId,
			order: f.note.order,
			measureIndex: f.note.measureIndex,
			midi: f.note.midi,
			vowel,
			phraseIndex: f.note.phrase.index,
			treble,
			kinds,
			hiddenKinds,
			...(f.chainSeconds !== undefined ? { seconds: f.chainSeconds } : {}),
			sustained,
			phraseTop,
			ceiling,
			...(leap ? { leap } : {}),
			...(resonance ? { resonance } : {}),
			...(turn ? { turn } : {}),
			descent,
			challenges,
		});
	});
	return out;
}

// ── Rarity, ranking, and the budget ──────────────────────────────────

/**
 * Rarity, r1 §4 step 4, a DESK PROPOSAL: for comments 2 and 3, a song whose
 * firing patterns (one per vowel and pitch) exceed one phrase in three moves
 * that comment to the piece level. Comment 1 is exempt. Returns the comments
 * with those kinds removed, and the notes left with nothing.
 */
export function applyRarity(
	comments: readonly NoteComment[],
	phraseCount: number,
	defaults: CommentDefaults = COMMENT_DEFAULTS,
): { comments: NoteComment[]; deferred: NoteComment[]; heavy: CommentKind[] } {
	const heavy: CommentKind[] = [];
	for (const kind of ['turning', 'closedU'] as const) {
		const patterns = new Set(comments.filter((c) => c.kinds.includes(kind)).map((c) => `${c.vowel}|${c.midi}`));
		if (patterns.size > phraseCount * defaults.rarityShare) heavy.push(kind);
	}
	if (heavy.length === 0) return { comments: [...comments], deferred: [], heavy };
	const kept: NoteComment[] = [];
	const deferred: NoteComment[] = [];
	for (const c of comments) {
		const kinds = c.kinds.filter((k) => !heavy.includes(k));
		if (kinds.length === 0 && c.kinds.length > 0) deferred.push(c);
		else if (kinds.length === c.kinds.length) kept.push(c);
		else kept.push({ ...c, kinds, challenges: c.challenges.filter((ch) => (ch === 'turn' ? kinds.includes('turning') : ch === 'closedU' ? kinds.includes('closedU') : true)) });
	}
	return { comments: kept, deferred, heavy };
}

/**
 * The stakes fallback. Stakes as a number is NOT ESTABLISHED (brief item 5),
 * so this ranks by the number of challenges the comment names, then the
 * note's summed seconds, then its place in the piece.
 */
export function byStakes(a: NoteComment, b: NoteComment): number {
	return b.challenges.length - a.challenges.length || (b.seconds ?? 0) - (a.seconds ?? 0) || a.order - b.order;
}

export interface CommentsSelection {
	/** Up to the budget, in performance order (`PRODUCT.md`, "COMMENTS APPEAR IN THE ORDER THE SINGER MEETS THEM"). */
	shown: NoteComment[];
	/** The rest, behind "more observations", in performance order. */
	more: NoteComment[];
	/** Notes whose every comment a Q6 topic hid. Counted, never lost. */
	hiddenBySettings: number;
	/** Notes rarity moved to the piece level. Always zero while rarity is off. */
	rarityDeferred: NoteComment[];
	/** The comment kinds rarity found heavy in this song. */
	heavy: CommentKind[];
}

export function selectComments(
	all: readonly NoteComment[],
	options: { phraseCount: number; defaults?: CommentDefaults } = { phraseCount: 0 },
): CommentsSelection {
	const d = options.defaults ?? COMMENT_DEFAULTS;
	const hiddenBySettings = all.filter((c) => c.kinds.length === 0).length;
	let live = all.filter((c) => c.kinds.length > 0);
	let rarityDeferred: NoteComment[] = [];
	let heavy: CommentKind[] = [];
	if (d.rarity) {
		const r = applyRarity(live, options.phraseCount, d);
		live = r.comments;
		rarityDeferred = r.deferred;
		heavy = r.heavy;
	}
	const ranked = [...live].sort(byStakes);
	const performance = (a: NoteComment, b: NoteComment) => a.order - b.order;
	return {
		shown: ranked.slice(0, d.budget).sort(performance),
		more: ranked.slice(d.budget).sort(performance),
		hiddenBySettings,
		rarityDeferred,
		heavy,
	};
}
