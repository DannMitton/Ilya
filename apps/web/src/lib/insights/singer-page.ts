/**
 * INSIGHTS FOR THE SINGER, Design round 2 (QUEUE row 66; accepted by Dann
 * 2026-10-11 03:50; brief `docs/sessions/brief-code-insights-for-the-singer_r1_2026-10-11.md`).
 *
 * The pure half of the page: when Ilya calls a key unlikely and why, whether
 * another key fits better, how the cycle dose splits by the typed tessitura,
 * and where each vowel turns in this voice. `InsightsPane.svelte` only words
 * and draws what these functions return, so every gate here has a test.
 */
import {
	aggregatePhonation,
	fractionToNumber,
	pitchToMidi,
	spellPitch,
	type ParsedScore,
	type Pitch,
	type VoiceProfileSnapshot,
} from '@ilya/score-parser';
import { secondsPerQuaver, type InsightsModel, type SecondsFigure } from './insights';
import type { NoteFacts } from './comments';
import { VOWELS } from '$lib/voice/engine/types';
import type { VowelForEvent } from '@ilya/score-parser';

// ── The thresholds, each in one place ────────────────────────────────

/**
 * "Unlikely" for an `outside-tessitura` verdict: the piece's tessitura band
 * passes the typed tessitura by MORE than this many semitones at either end.
 * A whole tone. DESK DEFAULT in the brief (§1 item 2), tethered to the verdict
 * that exists.
 */
export const UNLIKELY_TESSITURA_MARGIN = 2;

/**
 * A key qualifies as fitting better only when it lowers the share of
 * phonation at or above the primo passaggio by at least this much (a share,
 * 0 to 1). JUDGEMENT, the brief's 10 percentage points (§1 item 3).
 */
export const BETTER_KEY_MIN_DROP = 0.1;

/** The search window, in semitones each way: the watch list's own (`transposition.ts`, `DEFAULT_MAX_SEMITONES`). */
export const KEY_SEARCH_WINDOW = 6;

// ── Shares ───────────────────────────────────────────────────────────

/** Share of phonation at or above the primo (the zones' "between" and "above"), or null without both passaggi. */
export function shareAtOrAbovePrimo(model: Pick<InsightsModel, 'phonation'>): number | null {
	const z = model.phonation.zones;
	return z ? z.between + z.above : null;
}

/** Share of phonation above the secondo, or null without both passaggi. */
export function shareAboveSecondo(model: Pick<InsightsModel, 'phonation'>): number | null {
	return model.phonation.zones?.above ?? null;
}

/** A share as a whole percent. */
export const percent = (share: number): number => Math.round(share * 100);

// ── "Unlikely" ───────────────────────────────────────────────────────

/**
 * WHEN ILYA SAYS "UNLIKELY". DESK DEFAULT (brief §1 item 2): an
 * `outside-range` verdict, or `outside-tessitura` with the piece's tessitura
 * band past the typed tessitura by more than a whole tone at either end. A
 * milder `outside-tessitura` keeps today's line.
 */
export function isUnlikely(model: Pick<InsightsModel, 'verdict' | 'tessitura'>): boolean {
	if (model.verdict === 'outside-range') return true;
	if (model.verdict !== 'outside-tessitura') return false;
	const m = model.tessitura.measured;
	const r = model.tessitura.reference;
	if (!m || !r) return false;
	const over = pitchToMidi(m.high) - pitchToMidi(r.high);
	const under = pitchToMidi(r.low) - pitchToMidi(m.low);
	return over > UNLIKELY_TESSITURA_MARGIN || under > UNLIKELY_TESSITURA_MARGIN;
}

/** One note the page names: its printed bar, its pitch as spelled, its vowel. */
export interface NamedNote {
	eventId: string;
	measure: string;
	pitch: Pitch;
	vowel: string;
}

function measureNumber(score: ParsedScore, index: number): string {
	return score.measures[index]?.number || String(index + 1);
}

/**
 * The longest note held above the typed secondo, over its whole tie chain,
 * with its seconds. Held is `NoteCondition.held`, the sustain test the
 * comments use (DESK DEFAULT: "holds" in the sentence means that). Null without passaggi, without a tempo, or when nothing is
 * held above the secondo. The first of equal holds wins, so the pick is stable.
 */
export function longestAboveSecondo(
	facts: readonly NoteFacts[] | null,
	score: ParsedScore,
): (NamedNote & { seconds: number }) | null {
	if (!facts) return null;
	let best: NoteFacts | null = null;
	for (const f of facts) {
		// Held: the conditions' own sustain test over the tie chain (`NoteCondition.held`), so a passing note is never "held".
		if (!f.chainHead || !f.note.held || f.toSecondo === undefined || f.toSecondo <= 0 || f.chainSeconds === undefined) continue;
		if (!best || f.chainSeconds > (best.chainSeconds ?? 0)) best = f;
	}
	if (!best || best.chainSeconds === undefined) return null;
	const ev = score.vocalLine.find((e) => e.id === best!.note.eventId);
	if (!ev?.pitch) return null;
	return {
		eventId: ev.id,
		measure: measureNumber(score, best.note.measureIndex),
		pitch: ev.pitch,
		vowel: best.note.vowel ?? '',
		seconds: best.chainSeconds,
	};
}

/** The first sung note outside the typed range, and on which side. Null with no typed range or none outside. */
export function firstOutsideRange(
	score: ParsedScore,
	profile: VoiceProfileSnapshot,
	vowelOf?: (eventId: string) => string | undefined,
): (NamedNote & { direction: 'above' | 'below' }) | null {
	if (!profile.range) return null;
	const low = pitchToMidi(profile.range.lowest);
	const high = pitchToMidi(profile.range.highest);
	for (const ev of score.vocalLine) {
		if (!ev.pitch) continue;
		const m = pitchToMidi(ev.pitch);
		if (m >= low && m <= high) continue;
		return {
			eventId: ev.id,
			measure: measureNumber(score, ev.measureIndex),
			pitch: ev.pitch,
			vowel: vowelOf?.(ev.id) ?? '',
			direction: m > high ? 'above' : 'below',
		};
	}
	return null;
}

// The key search that stood here (`searchBetterKey`, `shareAfter`) is replaced by N.182's
// (`key-suggest.ts`, QUEUE row 71), the one source of keys on Insights.

// ── Where each vowel turns ───────────────────────────────────────────

export interface VowelTurn {
	vowel: string;
	/** Seconds sung on this vowel, and those past its turn; null without a tempo. */
	seconds: SecondsFigure | null;
	past: SecondsFigure | null;
	/** Shares of all vowel time, for drawing without a tempo too. */
	share: number;
	pastShare: number;
	/** The turning pitch, fR1 ÷ 2, spelled; null when the voice has no fR1 for this vowel. */
	turn: Pitch | null;
	/** Sung at all. */
	sung: boolean;
}

export interface VowelTurns {
	rows: VowelTurn[];
	/** Share of all vowel time past each vowel's own turn. Null when no vowel has a turn. */
	pastShare: number | null;
	/** Longest row, 0 to 1 widths are taken against it. */
	maxShare: number;
}

/**
 * TIME PER VOWEL AGAINST WHERE IT TURNS (brief §1 item 5). A note is past its
 * vowel's turn when its fo is at or above fR1 ÷ 2, the turning pitch
 * `comments.ts` computes from the same snapshot. Rows follow `VOWELS`, Mitton
 * (2020) Figure 4.2, every vowel printed and an unsung one at zero (Dann
 * 2026-09-24 09:53); a vowel outside `VOWELS` follows, most time first.
 */
export function vowelTurns(score: ParsedScore, profile: VoiceProfileSnapshot, vowelForEvent: VowelForEvent): VowelTurns | null {
	const totals = aggregatePhonation(score, { vowelForEvent });
	if (!totals.byPitchByVowel) return null;
	const pricing = secondsPerQuaver(score);
	const time = new Map<string, number>();
	const past = new Map<string, number>();
	for (const [midi, byVowel] of totals.byPitchByVowel) {
		const hz = 440 * 2 ** ((midi - 69) / 12);
		for (const [vowel, q] of byVowel) {
			const n = fractionToNumber(q);
			time.set(vowel, (time.get(vowel) ?? 0) + n);
			const fR1 = profile.fR1[vowel];
			if (typeof fR1 === 'number' && fR1 > 0 && hz >= fR1 / 2) past.set(vowel, (past.get(vowel) ?? 0) + n);
		}
	}
	const total = [...time.values()].reduce((a, b) => a + b, 0);
	if (total <= 0) return null;
	const order = VOWELS as readonly string[];
	const extra = [...time.keys()].filter((v) => !order.includes(v)).sort((a, b) => (time.get(b) ?? 0) - (time.get(a) ?? 0));
	let pastAll = 0;
	let anyTurn = false;
	const rows = [...order, ...extra].map((vowel): VowelTurn => {
		const q = time.get(vowel) ?? 0;
		const p = past.get(vowel) ?? 0;
		const fR1 = profile.fR1[vowel];
		const turn = typeof fR1 === 'number' && fR1 > 0 ? spellPitch(Math.round(69 + 12 * Math.log2(fR1 / 2 / 440))) : null;
		if (turn) {
			anyTurn = true;
			pastAll += p;
		}
		return {
			vowel,
			seconds: pricing ? pricing.price(q) : null,
			past: pricing && turn ? pricing.price(p) : null,
			share: q / total,
			pastShare: p / total,
			turn,
			sung: q > 0,
		};
	});
	return { rows, pastShare: anyTurn ? pastAll / total : null, maxShare: Math.max(...rows.map((r) => r.share)) };
}

// ── Words a sentence needs ───────────────────────────────────────────

const WORDS_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const WORDS_FR = ['zéro', 'une', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt'];

/**
 * A count in words up to twenty, as the ratified "Notes in eleven bars" and
 * « Dans onze mesures » spell it; digits above (DESK DEFAULT). French takes
 * the feminine « une » because the counted noun, « mesure », is feminine.
 */
export function countWord(n: number, language: 'en' | 'fr'): string {
	const words = language === 'fr' ? WORDS_FR : WORDS_EN;
	return Number.isInteger(n) && n >= 0 && n < words.length ? words[n] : String(n);
}

/** "a" or "an" before a pitch name read aloud: "an A", "an E", "an F", "a B". */
export function articleFor(p: Pitch): 'a' | 'an' {
	return p.step === 'A' || p.step === 'E' || p.step === 'F' ? 'an' : 'a';
}

/** A comment suggests an approach when it shows at least one suggestion; one that only describes shows none. */
export function suggestsApproach(r: { visible: readonly unknown[] }): boolean {
	return r.visible.length > 0;
}
