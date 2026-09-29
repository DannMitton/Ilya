/**
 * transposition-ruler.ts — the words and the numbers of the Transposition ruler, N.94 slices 1 and 2.
 *
 * The design is `docs/sessions/drawing-key-ruler_r4_2026-09-28.html`, accepted
 * by Dann 2026-09-28. The engine is the package's (`transpositionRulerStops`,
 * `engraveInKey`); this file names what it returns in either language and
 * decides where the ruler opens. PURE, and out of the component on purpose,
 * the note-picker.ts discipline: every rule here runs under vitest's node
 * environment with no DOM.
 *
 * EVERY STRING IS RULED. The table is the brief's §6, ratified by Dann
 * 2026-09-28 19:28; key names are `watch.key.*` and the header's interval is
 * the watch band's adopted phrase. Nothing here composes a word of its own.
 */
import {
	doubleAccidentalsDrawn,
	engraveInKey,
	transpositionRulerStops,
	scoreInPerformanceOrder,
	suggestTranspositions,
	type DoubleAccidentalCount,
	type KeyChoice,
	type KeySignature,
	type KeyStop,
	type ParsedScore,
	type TranspositionCandidate,
	type VoiceProfileSnapshot,
	type VowelResolver,
} from '@ilya/score-parser';
import { t, type Language } from '$lib/i18n';
import { keyName, keyTonic } from '$lib/analysis/watchlist';

const fill = (s: string, vars: Record<string, string>) =>
	s.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? `{${k}}`);

/** A key with a mode, which is the only kind the ruler names. */
export type NamedKey = { fifths: number; mode: 'major' | 'minor' };

/**
 * The printed key, when the ruler can offer anything for it: the first
 * signature, and only when it declares a mode.
 *
 * WHY A SOURCE WITH NO MODE GETS NO RULER IN THIS SLICE. The engine gives it
 * stops (`transpositionRulerStops`), but every ruled line names a key, "Key: {key}, as
 * printed" first among them, and naming one there would be a guess (Dann's
 * ruling 2026-07-20). Drawing the ruler for it needs copy Dann has not seen,
 * so it waits for that copy. DESK DEFAULT.
 */
export function printedKey(signature: KeySignature | undefined): NamedKey | null {
	return signature && signature.mode ? { fifths: signature.fifths, mode: signature.mode } : null;
}

/** Every stop on the ruler for this printed key, in order, lowest first. */
export function stopsFor(printed: NamedKey): KeyStop[] {
	return transpositionRulerStops(printed);
}

/** The key a stop lands on. */
export function stopKey(stop: KeyChoice, printed: NamedKey): NamedKey {
	return { fifths: stop.fifths, mode: printed.mode };
}

/**
 * True when a stored choice is a stop this printed key offers. The page
 * applies a stored key only then, so a song whose score was replaced by one
 * in another key opens as printed rather than engraved from a stranger's
 * numbers.
 */
export function isStopOf(choice: KeyChoice, printed: NamedKey): boolean {
	return stopsFor(printed).some((s) => s.semitones === choice.semitones && s.fifths === choice.fifths);
}

/** The printed key's own stop. */
export function homeStop(printed: NamedKey): KeyChoice {
	return { semitones: 0, fifths: printed.fifths };
}

/** True when the choice is the printed key (no move, printed signature). */
export function isHome(choice: KeyChoice | null, printed: NamedKey): boolean {
	return !choice || (choice.semitones === 0 && choice.fifths === printed.fifths);
}

/** "B", "C♭", « do♯ »: the tonic on the stop itself. The glyph is the drawing's. */
export function stopLabel(stop: KeyChoice, printed: NamedKey, language: Language): string {
	const { letter, shift } = keyTonic(stopKey(stop, printed));
	return `${t(`watch.key.letter.${letter}`, language)}${shift < 0 ? '♭' : shift > 0 ? '♯' : ''}`;
}

/** "Down a minor third", « Une tierce mineure plus bas ». Empty at no move. */
export function readoutInterval(semitones: number, language: Language): string {
	if (semitones === 0) return '';
	const a = t(`key.ruler.interval.${Math.abs(semitones)}`, language);
	return fill(t(semitones < 0 ? 'key.ruler.down' : 'key.ruler.up', language), { a });
}

/**
 * The line above the ruler. At the printed stop it is the key alone, which
 * composes nothing new: the grey box already says "as printed". DESK DEFAULT.
 * "Ilya's recommendation" is said on that stop only, and nothing evaluative
 * is said anywhere else (ruling 10 and its §5 reading).
 */
export function readout(stop: KeyChoice, printed: NamedKey, pick: KeyChoice | null, language: Language): string {
	const key = keyName(stopKey(stop, printed), language);
	if (stop.semitones === 0) return key;
	const isPick = !!pick && pick.semitones === stop.semitones && pick.fifths === stop.fifths;
	return fill(t(isPick ? 'key.ruler.readoutPick' : 'key.ruler.readout', language), {
		interval: readoutInterval(stop.semitones, language),
		key,
	});
}

/** The Piece band line, split around the key so the key can be set in bold. */
export function bandLine(
	choice: KeyChoice | null,
	printed: NamedKey,
	language: Language,
): { before: string; key: string; after: string; transposed: boolean } {
	const transposed = !isHome(choice, printed);
	const template = t(transposed ? 'key.band.transposed' : 'key.band.asPrinted', language);
	const [before, after = ''] = template.split('{key}');
	return { before, key: keyName(transposed ? stopKey(choice!, printed) : printed, language), after, transposed };
}

/**
 * The page's header line (drawing r4, plate 3; ruling 13): the source key, and
 * that the key was the singer's choice. The interval is the watch band's
 * adopted phrase, « d’une tierce mineure vers le bas ». Null as printed.
 */
export function pageHeader(choice: KeyChoice | null, printed: NamedKey, language: Language): string | null {
	if (isHome(choice, printed) || !choice) return null;
	const n = Math.abs(choice.semitones);
	const interval =
		n === 0
			? ''
			: fill(t('watch.intervalPhrase.one', language), {
					direction: t(choice.semitones < 0 ? 'watch.direction.down' : 'watch.direction.up', language),
					a: t(`watch.interval.${n}`, language),
				});
	return fill(t('key.page.header', language), { interval, key: keyName(printed, language) }).replace(/ {2,}/g, ' ');
}

/**
 * Where the ruler opens (brief §3.3, DESK DEFAULT from ruling 10): on the
 * first candidate `suggestTranspositions` returns, with the second marked as
 * the runner-up. The candidate carries its target signature, so the stop is
 * found by both numbers, which is what keeps B major from opening on C flat.
 * With no candidates it opens on the printed key and marks no pick.
 */
export function openingStops(
	printed: NamedKey,
	suggestions: readonly TranspositionCandidate[],
): { pick: KeyChoice | null; runnerUp: KeyChoice | null } {
	const stops = stopsFor(printed);
	const find = (c: TranspositionCandidate | undefined): KeyChoice | null => {
		if (!c?.targetKeySignature) return null;
		const hit = stops.find((s) => s.semitones === c.semitones && s.fifths === c.targetKeySignature!.fifths);
		return hit ? { semitones: hit.semitones, fifths: hit.fifths } : null;
	};
	return { pick: find(suggestions[0]), runnerUp: find(suggestions[1]) };
}

/**
 * The stored choice as the page applies it: only a stop this printed key
 * offers, else null (as printed). A song whose score was replaced by one in
 * another key therefore opens as printed rather than engraved from numbers
 * that belonged to the old score.
 */
export function appliedChoice(choice: KeyChoice | null | undefined, printed: NamedKey | null): KeyChoice | null {
	return printed && choice && isStopOf(choice, printed) ? choice : null;
}

/**
 * The score the page draws: the printed reading, or it engraved in the chosen
 * key (`engraveInKey`). The same seam as the octave shift: derived, never a
 * replacement, so the printed score is never altered (CONTRACT §6).
 */
export function drawInKey(score: ParsedScore, printed: NamedKey | null, choice: KeyChoice | null): ParsedScore {
	return printed && choice && !isHome(choice, printed) ? engraveInKey(score, choice) : score;
}

// ── The twins (slice 2; Dann's ruling 2026-09-28 21:41, `OPEN.md` §N.94) ──

/** A stop's identity, both numbers, for sets and maps. */
export const stopId = (c: KeyChoice): string => `${c.semitones}:${c.fifths}`;

/** Runs of stops with the same move, in order: a run of two is a pair of twins. */
export function stopGroups(stops: readonly KeyStop[]): KeyStop[][] {
	const out: KeyStop[][] = [];
	for (const s of stops) {
		const last = out[out.length - 1];
		if (last && last[0].semitones === s.semitones) last.push(s);
		else out.push([s]);
	}
	return out;
}

/** What a stop's twin comparison found: the drawn double accidentals, by stop id. */
export type TwinCounts = Record<string, DoubleAccidentalCount>;

/**
 * The double accidentals each twin would draw, from the printed reading
 * engraved in that stop (`engraveInKey`, the page's own preview), counted as
 * the renderer draws them (`doubleAccidentalsDrawn`). Only stops in a pair are
 * counted: a key without a twin is never dimmed, so nothing is asked of it.
 */
export function twinCounts(printedReading: ParsedScore, printed: NamedKey): TwinCounts {
	const out: TwinCounts = {};
	for (const group of stopGroups(stopsFor(printed))) {
		if (group.length < 2) continue;
		for (const stop of group) out[stopId(stop)] = doubleAccidentalsDrawn(drawInKey(printedReading, printed, stop));
	}
	return out;
}

const total = (c: DoubleAccidentalCount | undefined) => (c ? c.flats + c.sharps : 0);

/**
 * The stops that dim (ruling 21:41): in each pair, the twin that draws more
 * double accidentals. A tie dims neither. There is no threshold: one more is
 * enough.
 */
export function dimmedStops(printed: NamedKey, counts: TwinCounts): Set<string> {
	const out = new Set<string>();
	for (const group of stopGroups(stopsFor(printed))) {
		if (group.length !== 2) continue;
		const [a, b] = group.map((s) => total(counts[stopId(s)]));
		if (a !== b) out.add(stopId(group[a > b ? 0 : 1]));
	}
	return out;
}

/** A dimmed stop's cleaner twin; any other stop is returned as it is. */
export function cleanerTwin(choice: KeyChoice, printed: NamedKey, dimmed: ReadonlySet<string>): KeyChoice {
	if (!dimmed.has(stopId(choice))) return choice;
	const twin = stopsFor(printed).find((s) => s.semitones === choice.semitones && s.fifths !== choice.fifths);
	return twin ? { semitones: twin.semitones, fifths: twin.fifths } : choice;
}

/**
 * The count line a dimmed stop's readout gains: "Carries 2 double flats".
 * One line per kind it draws, flats first. Empty for a stop that is not dimmed.
 */
export function countLines(count: DoubleAccidentalCount | undefined, language: Language): string[] {
	if (!count) return [];
	const line = (n: number, kind: 'Flat' | 'Sharp') =>
		n === 1 ? t(`key.ruler.double${kind}One`, language) : fill(t(`key.ruler.double${kind}Many`, language), { n: String(n) });
	return [...(count.flats ? [line(count.flats, 'Flat')] : []), ...(count.sharps ? [line(count.sharps, 'Sharp')] : [])];
}

/**
 * The ruler's stop for a transposition the watch list suggested against the
 * page as drawn (`base`, the song's choice, or null as printed). Insights reads
 * the drawn key after "Use this key", so its suggestion is a move from there;
 * the ruler's stops are moves from the printed key. The target signature is
 * the suggestion's own, which is what keeps B major from landing on C flat.
 * Null when the printed key offers no such stop.
 */
export function stopForSuggestion(
	printed: NamedKey,
	base: KeyChoice | null,
	semitones: number,
	fifths: number,
): KeyChoice | null {
	const move = (base?.semitones ?? 0) + semitones;
	const folded = ((((move + 6) % 12) + 12) % 12) - 6;
	const hits = stopsFor(printed).filter((s) => s.fifths === fifths && (s.semitones - folded) % 12 === 0);
	// The tritone sits at both ends; take the one on the side the move went.
	const hit = hits.find((s) => Math.sign(s.semitones) === Math.sign(move)) ?? hits[0];
	return hit ? { semitones: hit.semitones, fifths: hit.fifths } : null;
}

/** Where the ruler opened, and what is selected now. */
export type RulerOpening = {
	selected: KeyChoice;
	pick: KeyChoice | null;
	runnerUp: KeyChoice | null;
	/** The twins' drawn double accidentals, by stop id (`twinCounts`). */
	counts: TwinCounts;
	/** The ids of the twins that dim (`dimmedStops`). */
	dimmed: ReadonlySet<string>;
};

/**
 * Where the ruler opens, computed against the PRINTED key's sung order, so
 * the pick is the same whatever the page was showing. The search is
 * `suggestTranspositions`, the watch band's own; with no resolver there is
 * nothing to search with and the ruler opens on the printed key.
 *
 * ILYA'S PICK ALWAYS LANDS ON THE CLEANER TWIN (ruling 21:41): a candidate
 * that falls on a dimmed stop moves to its twin. So does the runner-up, and
 * so does a key asked for by "Try this key" (`requested`), because both are
 * Ilya's recommendation too. DESK DEFAULT for those two.
 */
export function rulerOpening(
	printedReading: ParsedScore,
	printed: NamedKey,
	profile: VoiceProfileSnapshot,
	resolver: VowelResolver | null,
	requested: KeyChoice | null = null,
): RulerOpening {
	const found = resolver
		? suggestTranspositions(scoreInPerformanceOrder(printedReading).score, profile, resolver).suggestions
		: [];
	const counts = twinCounts(printedReading, printed);
	const dimmed = dimmedStops(printed, counts);
	const clean = (c: KeyChoice | null) => c && cleanerTwin(c, printed, dimmed);
	const { pick, runnerUp } = openingStops(printed, found);
	const selected = clean(requested) ?? clean(pick) ?? homeStop(printed);
	return { selected, pick: clean(pick), runnerUp: clean(runnerUp), counts, dimmed };
}
