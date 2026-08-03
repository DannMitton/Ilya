/**
 * The tempo seam: one place that answers "what tempo is in force", with its
 * provenance attached.
 *
 * Specified on 2026-07-17 in `claude/fit-tempo-tier-default-design_2026-07-17.md`
 * §6, which called for "the single `activeTempoAt` seam" with a fixed precedence.
 * MEASURED 2026-07-30: the seam was never built. `activeTempoAt` exists as two
 * private copies (`sustain.ts:61`, `apps/web/src/lib/shane/watchlist.ts:229`),
 * neither exported, and `resolveTempoTerm` was built, tested, exported, and
 * called by nothing. This module is that seam.
 *
 * ── Precedence, from the 2026-07-17 design, unchanged ─────────────────
 *
 *   1. The singer's override wins over everything. A printed mark may be
 *      editorial, and the singer is in the room and the editor is not.
 *   2. An ENCODED metronome mark wins over a word.
 *   3. A verbal term resolves to Quantz's tier, labelled `inferred`, carrying
 *      the tier's honest band rather than a bare number.
 *   4. Nothing at all: abstain. Never a default bpm.
 *
 * ── Why the answer is a band and not a number ─────────────────────────
 *
 * Dann, 2026-07-17, ruling: *"The tempo inference tier is not authoritative. It
 * gives a less-intuitive singer a credible, honest place to start, always
 * overridable. 'A sensible, sourced, overridable default' is the target, not
 * 'correct.'"*
 *
 * And 2026-07-30, on the repertoire: bpm applies most rigorously to popular dance
 * music with few expressive tempo changes and no real rubato. Russian classical
 * vocal literature has contested tempi, rit., rall., a tempo, Tempo II. **A single
 * bpm is a coarse instrument here and the output must say so.**
 *
 * Even an encoded mark is not firm. SOURCED: Martín-Castro and Ucar, *PLOS ONE*
 * (2020), across 36 complete Beethoven symphony recordings, found every conductor
 * group performs systematically slower than his marks (Romantic conductors ~13
 * bpm), most likely because Beethoven misread his own metronome — a consistent
 * ~12 bpm offset. So `encoded` is FIRMER than `inferred`, not firm.
 *
 * ── The gradual cues: counted, classified, and mentioned only when material ──
 *
 * rit., rall., accel., a tempo, Tempo I/II, meno mosso, più mosso carry no tier
 * bpm (2026-07-17 design §1). They are collected on every resolution so a
 * consumer can see them, but they are NOT all the same thing and they are NOT
 * all worth a caveat.
 *
 * **A step is not a ramp.** "Meno mosso" sets a new constant rate and is exactly
 * as modellable as the first tempo. Only rit./rall./accel./stringendo vary the
 * rate across a span.
 *
 * **And a caveat below your own resolution is noise.** MEASURED 2026-07-31: a
 * ramp applied to an ENTIRE piece at ±25%, far worse than any real accelerando,
 * moves the total by 10.7%. An inferred tempo already declares a 70% band. So on
 * an inferred figure the ramp caveat apologises for an error seven times smaller
 * than the uncertainty already stated, and it undermines a figure that is fine.
 * It is therefore emitted only where there is no band to absorb it, which is an
 * encoded or user-set tempo. The arithmetic was never the obstacle: `rampSeconds`
 * below is the closed form, verified. What the page does not give is the target.
 */

import type { Fraction, NoteBase, ParsedScore, TempoMarking, TimeSignature } from './types';
import { fractionToNumber, normalizeFraction } from './phonation';
import { resolveTempoTerm, TEMPO_TIER_BANDS, type TempoTier } from './tempo-terms';
import { lookupTempoLexicon, type TempoLanguage } from './tempo-lexicon';

/** Where a tempo came from. Ordered by firmness, firmest first. */
export type TempoProvenance =
	/** The singer set it. Tops everything, including a printed mark. */
	| 'user'
	/** A metronome mark or `<sound tempo>` in the score. Firmer, not firm. */
	| 'encoded'
	/** Resolved from a printed tempo WORD via Quantz's tiers. A learned guess. */
	| 'inferred';

/**
 * A tempo directive that is not a steady term.
 *
 * TWO SHAPES, and conflating them was a defect. A **ramp** varies the rate over
 * a span (rit., rall., accel., stringendo). A **step** sets a new constant rate
 * (meno mosso, più mosso, Tempo II, doppio movimento) and is no harder to model
 * than any other steady tempo. An earlier version of this module filed
 * "Meno mosso" under the slower RAMP family and then reported it as unmodellable,
 * which was wrong twice over.
 */
export interface GradualCue {
	measureIndex: number;
	/** The text as printed. */
	text: string;
	/** Which family of directive it is, for copy. */
	kind: 'slower' | 'faster' | 'restore' | 'relative';
	/** `ramp` varies the rate across a span; `step` sets a new constant rate. */
	shape: 'ramp' | 'step';
}

export interface TempoResolution {
	/** Quarter-note beats per minute. */
	bpm: number;
	provenance: TempoProvenance;
	/**
	 * The honest spread around `bpm`. For `inferred`, Quantz's tier band. For
	 * `encoded` and `user`, `undefined`: there is no band, though see the
	 * Martín-Castro caveat above before calling either exact.
	 */
	range?: [number, number];
	/** The tier, when the tempo was inferred from a word. */
	tier?: TempoTier;
	/** The canonical term matched, for display. */
	term?: string;
	/** The text as printed on the page, when there was any. */
	printedText?: string;
	/** The beat the bpm counts, taken from the metre in force, not assumed. */
	beatUnit: string;
	beatUnitDots: number;
	/** Display glyph for that beat, so a UI never has to re-derive it. */
	beatGlyph?: string;
	/**
	 * The bpm as an EXACT fraction. `bpm` is its decimal, for display only.
	 * Downstream arithmetic should prefer this: converting 72 quarter-beats into
	 * a dotted-quarter metre gives exactly 48, and the band's 112 gives exactly
	 * 224/3 rather than 74.7.
	 */
	bpmExact?: Fraction;
	/** The band as exact fractions, alongside `range`. */
	rangeExact?: [Fraction, Fraction];
	/** The other defensible beat for an ambiguous metre such as 3/8. */
	beatAlternative?: { unit: NoteBase; dots: number; glyph: string };
	/** Modifiers recognised in the printed marking, which moved the start point. */
	modifiers?: string[];
	/** Set when the marking was read through the non-Italian lexicon. */
	language?: TempoLanguage;
	/**
	 * Every distinct steady tempo the score states. More than one means a single
	 * bpm describes the piece only approximately, and a consumer should say so.
	 */
	steadyMarkingCount: number;
	/** Relative directives this resolution does not model. Reported, not hidden. */
	gradualCues: GradualCue[];
}

const GRADUAL_PATTERNS: Array<{ re: RegExp; kind: GradualCue['kind']; shape: GradualCue['shape'] }> = [
	// Steps first: "meno mosso" must not be swallowed by the ramp pattern.
	{ re: /\b(meno\s+mosso)\b/i, kind: 'slower', shape: 'step' },
	{ re: /\b(pi[uù]\s+mosso)\b/i, kind: 'faster', shape: 'step' },
	{ re: /\b(tempo\s+(ii|2|secondo)|doppio\s+movimento|alla\s+breve)\b/i, kind: 'relative', shape: 'step' },
	{ re: /\b(a\s+tempo|tempo\s+(i|1|primo)\b|l['’]istesso\s+tempo)\b/i, kind: 'restore', shape: 'step' },
	// Ramps.
	{ re: /\b(rit(ard(ando|o)?)?|rall(ent(ando|o)?)?|allargando|slentando)\b/i, kind: 'slower', shape: 'ramp' },
	{ re: /\b(accel(erando)?|stringendo|affrettando|stretto)\b/i, kind: 'faster', shape: 'ramp' },
];

/** Classify a printed direction, or `undefined` if it is not a tempo directive. */
export function classifyGradualCue(text: string): GradualCue['kind'] | undefined {
	return classifyCue(text)?.kind;
}

/** Classify with the shape attached. */
export function classifyCue(text: string): { kind: GradualCue['kind']; shape: GradualCue['shape'] } | undefined {
	if (typeof text !== 'string') return undefined;
	for (const { re, kind, shape } of GRADUAL_PATTERNS) if (re.test(text)) return { kind, shape };
	return undefined;
}

/**
 * Seconds for a span of `beats` under a LINEAR bpm ramp from `t0` to `t1`.
 *
 *   seconds = 60 · beats · ln(t1/t0) / (t1 − t0),  and 60·beats/t0 when t1 = t0.
 *
 * Exported because the arithmetic is the easy part and was never the reason
 * ramps went unmodelled; the missing piece is the target tempo, which the page
 * does not state. VERIFIED: reduces exactly to the constant case, is continuous
 * at the limit, and a 60→120 ramp over 100 beats gives 69.3s, between the 50s
 * and 100s constants.
 */
export function rampSeconds(beats: number, t0: number, t1: number): number {
	if (!Number.isFinite(beats) || !Number.isFinite(t0) || !Number.isFinite(t1) || t0 <= 0 || t1 <= 0) {
		throw new RangeError('rampSeconds needs finite beats and positive tempi');
	}
	if (Math.abs(t1 - t0) < 1e-9) return (60 * beats) / t0;
	return (60 * beats * Math.log(t1 / t0)) / (t1 - t0);
}

/** The beat a metre is actually counted in. */
export interface FeltBeat {
	unit: NoteBase;
	dots: number;
	/** For display: "♩", "♩.", "𝅗𝅥". */
	glyph: string;
	/**
	 * A second defensible reading of the same metre, where one exists.
	 *
	 * 3/8 is the case: it can be counted in three eighths OR **in one**, as a
	 * single dotted quarter per bar, and composers write MM markings both ways.
	 * Dann, 2026-07-31: *"Be flexible... I want us to be prepared."* So an
	 * ambiguous metre offers both rather than silently choosing, and the choice
	 * below is a default, not a claim.
	 */
	alternative?: { unit: NoteBase; dots: number; glyph: string };
	/** True when the metre genuinely admits both readings. */
	ambiguous?: boolean;
}

const BEAT_IN_WHOLES: Record<string, Fraction> = {
	breve: { numerator: 2, denominator: 1 },
	whole: { numerator: 1, denominator: 1 },
	half: { numerator: 1, denominator: 2 },
	quarter: { numerator: 1, denominator: 4 },
	eighth: { numerator: 1, denominator: 8 },
	'16th': { numerator: 1, denominator: 16 },
	'32nd': { numerator: 1, denominator: 32 },
};

/**
 * Duration of a felt beat in whole-note units, EXACT, dots included.
 *
 * Rational rather than decimal on Dann's suggestion, 2026-07-31: work in
 * proportions and convert once at the end. It removes the conversion drift
 * entirely — a dotted quarter is 3/8 of a whole, so a quarter-anchored 72
 * becomes exactly 48 rather than 48 within rounding.
 */
export function feltBeatInWholes(b: { unit: NoteBase; dots: number }): Fraction {
	const base = BEAT_IN_WHOLES[b.unit];
	if (!base) throw new RangeError(`Unknown beat unit ${JSON.stringify(b.unit)}`);
	return b.dots
		? normalizeFraction({ numerator: base.numerator * 3, denominator: base.denominator * 2 })
		: base;
}

/**
 * The beat a metre is felt in.
 *
 * Dann, 2026-07-31: *"A piece in 3/2 makes less sense to offer a metronome
 * marking based on a quarter note."* Right, and the same fault in reverse for
 * compound metre. A number a singer cannot dial straight into a metronome fails
 * at the one job it has.
 *
 *   2/2, 3/2, 4/2, ¢        → the half note
 *   6/8, 9/8, 12/8          → the DOTTED quarter (three eighths group as one beat)
 *   3/8, 5/8, 7/8           → the eighth (too few to group in threes)
 *   everything else         → the denominator's own value
 *
 * MEASURED 2026-07-31: *Sunless 1* is in 12/8, and the seam was reporting ♩=72
 * for it where a singer needs ♩.=48. Same speed, unusable unit.
 */
export function feltBeat(ts: TimeSignature | undefined, tier?: TempoTier): FeltBeat {
	const beats = ts?.beats ?? 4;
	const beatType = ts?.beatType ?? 4;
	const DOTTED_Q = { unit: 'quarter' as NoteBase, dots: 1, glyph: '\u2669.' };
	const EIGHTH = { unit: 'eighth' as NoteBase, dots: 0, glyph: '\u266A' };

	if (beatType === 2) return { unit: 'half', dots: 0, glyph: '\u{1D15D}' };
	if (beatType === 1) return { unit: 'whole', dots: 0, glyph: '\u{1D15D}\u{1D15D}' };
	if (beatType === 8) {
		// 6/8, 9/8, 12/8: the eighths group in threes, unambiguously.
		if (beats % 3 === 0 && beats > 3) return { ...DOTTED_Q };
		// 3/8 is genuinely two-way: three eighths, or ONE dotted quarter per bar.
		// A fast 3/8 is felt in one; a slow one in three. The tier decides the
		// DEFAULT and the other reading travels with it.
		if (beats === 3) {
			return tier === 'fast'
				? { ...DOTTED_Q, alternative: EIGHTH, ambiguous: true }
				: { ...EIGHTH, alternative: DOTTED_Q, ambiguous: true };
		}
		return { ...EIGHTH };
	}
	if (beatType === 16) return { unit: '16th', dots: 0, glyph: '\u{1D161}' };
	return { unit: 'quarter', dots: 0, glyph: '\u2669' };
}

/** The metre in force at a measure, walking back to the last one stated. */
export function timeSignatureAt(parsed: ParsedScore, measureIndex: number): TimeSignature | undefined {
	const ms = Array.isArray(parsed.measures) ? parsed.measures : [];
	let found: TimeSignature | undefined;
	for (const m of ms) {
		if ((m.index ?? 0) > measureIndex) break;
		if (m.timeSignature) found = m.timeSignature;
	}
	return found ?? ms[0]?.timeSignature;
}

/**
 * Tempo modifiers, as a POSITION within the tier band.
 *
 * The 2026-07-17 design deferred these: *"v1 matches the head term to its tier
 * and ignores modifier nudges."* MEASURED 2026-07-31, that leaves "Allegro assai"
 * and "Allegro non troppo" resolving identically, at ♩=132 with band 116–208,
 * although *assai* means very and *non troppo* means not too — they point in
 * OPPOSITE directions and the app could not tell them apart.
 *
 * The fix invents no numbers. A modifier moves the representative point WITHIN
 * the tier band, which is the sourced structure (Quantz via Schilling), instead
 * of nudging a bpm by an amount nobody can cite. The band itself never moves and
 * never narrows: the modifier says where in the practice range to start, not that
 * the range is smaller than it is.
 *
 * The magnitudes below are JUDGEMENT, exactly as the per-term representative bpm
 * is JUDGEMENT. They are overridable by the singer like everything else here.
 */
// `\b` is ASCII-only in JavaScript, so it never matches beside Cyrillic or
// accented Latin: /\bочень\b/ and /\btrès\b/ both silently fail. These use
// Unicode letter lookarounds instead, which is required the moment the term
// table carries five languages.
const B0 = '(?<!\\p{L})';
const B1 = '(?!\\p{L})';
const uw = (body: string) => new RegExp(`${B0}(?:${body})${B1}`, 'iu');

// Deltas are FRACTIONS, not decimals. Dann, 2026-07-31: work in proportions and
// convert once at the end. A decimal here forces a quantisation later, which is
// the rounding this module already removed once and must not reintroduce.
const MODIFIERS: Array<{ re: RegExp; delta: Fraction; label: string }> = [
	// Intensifiers, toward the fast end of the term's own tier.
	{ re: uw('molto|assai|ben|sehr|tr[eè]s|очень'), delta: { numerator: 1, denominator: 4 }, label: 'molto/assai' },
	{ re: uw('pi[uù]|mehr|plus|более'), delta: { numerator: 3, denominator: 20 }, label: 'più' },
	// Diminishers, toward the slow end.
	{ re: uw('non\\s+troppo|non\\s+tanto|nicht\\s+zu|pas\\s+trop|не\\s+слишком'), delta: { numerator: -1, denominator: 4 }, label: 'non troppo' },
	{ re: uw('comodo|commodo|tranquillo|sostenuto|gem[äa]chlich'), delta: { numerator: -3, denominator: 20 }, label: 'comodo/tranquillo' },
	{ re: uw('meno|weniger|moins|менее'), delta: { numerator: -3, denominator: 20 }, label: 'meno' },
	{ re: uw('poco|un\\s+poco|etwas|un\\s+peu|немного'), delta: { numerator: -1, denominator: 10 }, label: 'poco' },
];

const addFr = (a: Fraction, b: Fraction): Fraction =>
	normalizeFraction({
		numerator: a.numerator * b.denominator + b.numerator * a.denominator,
		denominator: a.denominator * b.denominator,
	});
const mulFr = (a: Fraction, b: Fraction): Fraction =>
	normalizeFraction({ numerator: a.numerator * b.numerator, denominator: a.denominator * b.denominator });
/** Sign of a - b, exact. */
const cmpFr = (a: Fraction, b: Fraction): number => a.numerator * b.denominator - b.numerator * a.denominator;

export interface ModifierEffect {
	/** Which modifiers were recognised, for display and for attestation. */
	found: string[];
	/** Net movement across the band, as a decimal. Display only. */
	delta: number;
	/** The same movement, exact. Use this for arithmetic. */
	deltaExact: Fraction;
}

/** Recognise every modifier in a printed marking and sum their movement, exactly. */
export function readModifiers(text: string): ModifierEffect {
	const found: string[] = [];
	let delta: Fraction = { numerator: 0, denominator: 1 };
	if (typeof text !== 'string') return { found, delta: 0, deltaExact: delta };
	for (const m of MODIFIERS) {
		if (m.re.test(text)) {
			found.push(m.label);
			delta = addFr(delta, m.delta);
		}
	}
	return { found, delta: fractionToNumber(delta), deltaExact: delta };
}

/**
 * Where a term sits in its band once its modifiers are applied, as a fraction
 * from 0 (band floor) to 1 (band ceiling).
 */
export function bandPosition(repBpm: number, band: [number, number], delta: number): number {
	const [lo, hi] = band;
	if (hi <= lo) return 0;
	const natural = (repBpm - lo) / (hi - lo);
	return Math.max(0, Math.min(1, natural + delta));
}

export interface ResolveTempoOptions {
	/**
	 * The singer's own bpm for this piece. Wins over everything. Omit it and the
	 * score decides.
	 */
	overrideBpm?: number;
	/** Beat unit for the override. Defaults to a quarter, as bpm conventionally is. */
	overrideBeatUnit?: string;
	overrideBeatUnitDots?: number;
}

function firstEncoded(markings: TempoMarking[] | undefined): TempoMarking | undefined {
	if (!Array.isArray(markings)) return undefined;
	return markings.find((m) => typeof m.bpm === 'number' && Number.isFinite(m.bpm) && m.bpm > 0);
}

/**
 * The tempo in force for the piece, with provenance.
 *
 * Returns `undefined` only when the score states no tempo of any kind and the
 * singer set none. That is an abstention, and it is correct: a fabricated bpm
 * would make every duration and every oscillation count downstream a guess
 * wearing a number's confidence.
 */
export function resolveTempo(parsed: ParsedScore, options: ResolveTempoOptions = {}): TempoResolution | undefined {
	if (!parsed || typeof parsed !== 'object') {
		throw new TypeError('resolveTempo needs a ParsedScore');
	}
	const words = Array.isArray(parsed.tempoWords) ? parsed.tempoWords : [];
	const markings = Array.isArray(parsed.tempoMarkings) ? parsed.tempoMarkings : [];

	// Gradual cues, gathered from every printed direction regardless of which
	// layer supplies the number. Counted even when we abstain on the bpm.
	const gradualCues: GradualCue[] = [];
	const seen = new Set<string>();
	for (const w of words) {
		const c = classifyCue(w.text);
		if (!c) continue;
		const key = `${w.measureIndex}|${w.text}`;
		if (seen.has(key)) continue;
		seen.add(key);
		gradualCues.push({ measureIndex: w.measureIndex, text: w.text, kind: c.kind, shape: c.shape });
	}

	const steadyMarkingCount = new Set(
		markings.filter((m) => m.bpm > 0).map((m) => `${m.bpm}|${m.beatUnit}|${m.beatUnitDots}`),
	).size;

	// ── 1. The singer's override tops everything ──
	const ov = options.overrideBpm;
	if (typeof ov === 'number' && Number.isFinite(ov) && ov > 0) {
		return {
			bpm: ov,
			provenance: 'user',
			beatUnit: options.overrideBeatUnit ?? feltBeat(timeSignatureAt(parsed, 0)).unit,
			beatUnitDots: options.overrideBeatUnitDots ?? feltBeat(timeSignatureAt(parsed, 0)).dots,
			beatGlyph: feltBeat(timeSignatureAt(parsed, 0)).glyph,
			steadyMarkingCount,
			gradualCues,
			...(words[0]?.text ? { printedText: words[0].text } : {}),
		};
	}

	// ── 2. An encoded metronome mark ──
	const encoded = firstEncoded(markings);
	if (encoded) {
		return {
			bpm: encoded.bpm,
			provenance: 'encoded',
			// An ENCODED mark states its own beat; the editor already chose it.
			beatUnit: encoded.beatUnit ?? 'quarter',
			beatUnitDots: encoded.beatUnitDots ?? 0,
			steadyMarkingCount,
			gradualCues,
			...(encoded.text ? { printedText: encoded.text } : {}),
		};
	}

	// ── 3. A printed WORD, resolved to Quantz's tier ──
	// Walk in document order and take the first STEADY term. A gradual cue is
	// skipped rather than fed to the resolver, which would be a category error.
	for (const w of words) {
		if (classifyGradualCue(w.text)) continue;
		// The LEXICON is consulted first, then the native resolver.
		//
		// Order matters and it is not the obvious one. `resolveTempoTerm` carries
		// a bounded fuzzy match (Levenshtein <= 2) and a few of its own foreign
		// aliases, so it will happily resolve "Sehr langsam" via "langsam" alone
		// and return *lento* — losing the "sehr" that makes it *adagio*. The
		// lexicon matches longest-form-first, so it sees the whole marking. An
		// Italian term carries no lexicon entry and falls through to the native
		// resolver untouched.
		let language: TempoLanguage | undefined;
		let r: ReturnType<typeof resolveTempoTerm> = null;
		const hit = lookupTempoLexicon(w.text);
		if (hit) {
			r = resolveTempoTerm(hit.head);
			if (r) language = hit.language;
		}
		if (!r) r = resolveTempoTerm(w.text);
		if (!r) continue;
		// Quantz/music21 tier values are QUARTER-anchored by construction, so the
		// number must be converted into the metre's felt beat rather than relabelled.
		// The speed is unchanged; only the unit the singer dials in changes.
		const beat = feltBeat(timeSignatureAt(parsed, w.measureIndex), r.tier);
		// Exact: quarter (1/4) divided by the felt beat's own length in wholes.
		const bw = feltBeatInWholes(beat);
		// Convert a quarter-anchored bpm (as a FRACTION) into the felt beat.
		// No quantisation anywhere: the whole path stays rational.
		const scale = (n: Fraction): Fraction =>
			normalizeFraction({
				numerator: n.numerator * bw.denominator,
				denominator: n.denominator * 4 * bw.numerator,
			});
		const whole = (n: number): Fraction => ({ numerator: n, denominator: 1 });
		const band = r.range ?? TEMPO_TIER_BANDS[r.tier];
		// Modifiers move the START POINT inside the sourced band. The band itself
		// is untouched: "non troppo" says begin at the slow end of fast, not that
		// fast is a narrower range than Quantz's tier.
		const mods = readModifiers(w.text);
		// Exact, and simpler than it looks. Unclamped,
		//   lo + (natural + delta)*(hi-lo)  where natural = (rep-lo)/(hi-lo)
		//   = rep + delta*(hi-lo)
		// so no division is ever needed except inside the clamp comparison.
		const width = band[1] - band[0];
		let positioned: Fraction;
		if (mods.deltaExact.numerator === 0 || width <= 0) {
			positioned = whole(r.bpm);
		} else {
			const natural: Fraction = normalizeFraction({ numerator: r.bpm - band[0], denominator: width });
			const p = addFr(natural, mods.deltaExact);
			if (cmpFr(p, { numerator: 0, denominator: 1 }) <= 0) positioned = whole(band[0]);
			else if (cmpFr(p, { numerator: 1, denominator: 1 }) >= 0) positioned = whole(band[1]);
			else positioned = addFr(whole(r.bpm), mulFr(mods.deltaExact, whole(width)));
		}
		const exact = scale(positioned);
		return {
			bpm: fractionToNumber(exact),
			bpmExact: exact,
			provenance: 'inferred',
			range: [fractionToNumber(scale(whole(band[0]))), fractionToNumber(scale(whole(band[1])))],
			rangeExact: [scale(whole(band[0])), scale(whole(band[1]))],
			tier: r.tier,
			term: r.term,
			printedText: w.text,
			beatUnit: beat.unit,
			beatUnitDots: beat.dots,
			beatGlyph: beat.glyph,
			...(beat.alternative ? { beatAlternative: beat.alternative } : {}),
			steadyMarkingCount,
			gradualCues,
			...(mods.found.length ? { modifiers: mods.found } : {}),
			...(language ? { language } : {}),
		};
	}

	// ── 4. Nothing. Abstain. ──
	return undefined;
}

/**
 * The honest caveat set for a resolved tempo, as machine-readable reasons a
 * consumer can render. Never empty: even a user-set bpm on a piece with no
 * gradual cues carries the nominal-performance caveat.
 */
export function tempoCaveats(r: TempoResolution): string[] {
	const out: string[] = [];
	if (r.provenance === 'inferred') {
		out.push(
			`Tempo inferred from the printed marking${r.printedText ? ` "${r.printedText}"` : ''}: ` +
				`${r.term ?? 'a tempo word'} is a ${r.tier} marking, and practice ranges ` +
				`${r.range ? `${r.range[0]}–${r.range[1]}` : 'widely'} bpm. Adjust to taste.`,
		);
	}
	if (r.provenance === 'encoded') {
		// Not exact. Sourced caveat, 2026-07-17 research pass 1.
		out.push('Tempo taken from the score’s own metronome mark. Even a composer’s own marks are contested in practice.');
	}
	if (r.steadyMarkingCount > 1) {
		out.push(`This piece states ${r.steadyMarkingCount} different steady tempi; a single figure averages across them.`);
	}
	// Ramps are mentioned ONLY where the figure has no band to absorb them.
	//
	// MEASURED 2026-07-31: a ramp applied to an entire piece at ±25% — far worse
	// than any real accelerando, which covers a few bars — moves the total by
	// 10.7%. An inferred tempo already declares a 70% band. So on an inferred
	// figure this caveat apologises for an error seven times smaller than the
	// uncertainty already stated, which is noise, and noise that undermines a
	// figure that is fine. On an ENCODED or USER tempo there is no band, so the
	// same 4.7–10.7% is the whole error and it earns its sentence.
	//
	// Steps are never mentioned: a new constant tempo is as modellable as the
	// first one, and calling it unmodelled was simply wrong.
	const ramps = r.gradualCues.filter((c) => c.shape === 'ramp');
	if (ramps.length > 0 && !r.range) {
		out.push(
			`This piece carries ${ramps.length} gradual tempo change${ramps.length === 1 ? '' : 's'} ` +
				`(${[...new Set(ramps.map((c) => c.text))].slice(0, 3).join(', ')}` +
				`${ramps.length > 3 ? ', …' : ''}); the figure holds one tempo throughout, worth a few percent.`,
		);
	}
	out.push('A nominal figure from the notated page, not a measurement of a performance.');
	return out;
}
