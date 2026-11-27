/**
 * transposition-ruler.ts — the words and the numbers of the Transposition ruler, N.94 slices 1 and 2.
 *
 * The ruler is a detented slider of semitones, thirteen nodes from -6 to +6
 * (`docs/memory/OPEN.md`, "N.94 THE RIBBON IS A DETENTED SLIDER OF
 * SEMITONES", ruled by Dann 2026-11-26), which supersedes the stop faces, the
 * buttons, and the bracketed twins of drawing r4
 * (`docs/sessions/drawing-key-ruler_r4_2026-09-28.html`). What stays from r4
 * is the readout, the Piece band, the page header, and the twins' ruling. The
 * engine is the package's (`transpositionRulerStops`, `engraveInKey`); this
 * file names what it returns in either language, decides where the ruler
 * opens, and holds the ribbon's rules: nodes, what a tap lands on, the drag's
 * snap, and the phone's window. PURE, and out of the component on purpose, the
 * note-picker.ts discipline: every rule here runs under vitest's node
 * environment with no DOM.
 *
 * THE STRINGS. The readout, band, and header are ratified (Dann 2026-09-28
 * 19:28); key names are `watch.key.*` and the header's interval is the watch
 * band's adopted phrase. The ribbon's own strings carry their status in
 * `i18n.ts`: some French is a draft Dann has not ruled.
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
 * The line above the ruler. At no move it is the key alone, which composes
 * nothing new: node zero's `ORIG.` already says it. DESK DEFAULT.
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
 * Ilya's pick and the runner-up: the first and second candidates
 * `suggestTranspositions` returns. The candidate carries its target signature, so the stop is
 * found by both numbers, which is what keeps B major from opening on C flat.
 * With no candidates there is no pick and no runner-up.
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
 * the song in its chosen key, so its suggestion is a move from there;
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
 * What an opening knows, computed against the PRINTED key's sung order, so
 * the pick is the same whatever the page was showing. The search is
 * `suggestTranspositions`, the watch band's own; with no resolver there is
 * nothing to search with and there is no pick. `selected` here is the asked-for
 * key, else the pick, else the print; the ruler's state keeps it only for an
 * asked-for key, and otherwise opens on the song's own (`prepare`).
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

// ── The ribbon (Dann 2026-11-26) ──

/** True when both are the same stop, by both numbers. */
export const sameKey = (a: KeyChoice | null, b: KeyChoice | null): boolean =>
	!!a && !!b && a.semitones === b.semitones && a.fifths === b.fifths;

/**
 * One node of the ribbon: every stop at one move, so a pair of twins is one
 * node. THE FLAT SPELLING COMES FIRST (ruled 14:01), which is the reverse of
 * the engine's own sharp-first order; do not "correct" it.
 */
export type RibbonNode = { semitones: number; stops: KeyStop[] };

/** The thirteen nodes, -6 to +6, lowest first. */
export function ribbonNodes(printed: NamedKey): RibbonNode[] {
	return stopGroups(stopsFor(printed)).map((group) => ({
		semitones: group[0].semitones,
		stops: [...group].sort((a, b) => a.fifths - b.fifths),
	}));
}

/**
 * The stop a tap, an arrow key, or a drag lands on when it names a node and no
 * spelling: the bold half. The live spelling if the node is already selected.
 * Else, on the node that holds the printed key, the print, because a tap on
 * node zero restores it (`OPEN.md`, ruling 10). Else the twin that is not
 * dimmed, and on a tie the flat spelling (DESK DEFAULT).
 */
export function commitStop(
	node: RibbonNode,
	selected: KeyChoice,
	dimmed: ReadonlySet<string>,
	printed: NamedKey,
): KeyChoice {
	const clean = node.stops.filter((s) => !dimmed.has(stopId(s)));
	const stop =
		node.stops.find((s) => sameKey(s, selected)) ??
		node.stops.find((s) => isHome(s, printed)) ??
		(clean.length === 1 ? clean[0] : node.stops[0]);
	return { semitones: stop.semitones, fifths: stop.fifths };
}

/** The integer above the track: "-2" with a true minus sign, "0", "+3". */
export function semitoneLabel(semitones: number): string {
	return semitones < 0 ? `\u2212${-semitones}` : semitones > 0 ? `+${semitones}` : '0';
}

/** The label below the track: the interval's abbreviation, or `ORIG.` at no move. */
export function shortInterval(semitones: number, language: Language): string {
	return t(semitones === 0 ? 'key.ruler.orig' : `key.ruler.short.${Math.abs(semitones)}`, language);
}

/**
 * The tonic as the spelling row prints it: "D\u266d" in English, as `stopLabel`
 * does, and in words in French, « r\u00e9 b\u00e9mol » (ruled by Dann 2026-11-26; the
 * faces and chips keep the glyph, so the two forms are not unified).
 */
export function wordedTonic(stop: KeyChoice, printed: NamedKey, language: Language): string {
	if (language !== 'fr') return stopLabel(stop, printed, language);
	const { letter: step, shift } = keyTonic(stopKey(stop, printed));
	const letter = t(`watch.key.letter.${step}`, language);
	return shift === 0
		? letter
		: fill(t('watch.key.tonic', language), {
				letter,
				accidental: t(shift < 0 ? 'notePicker.acc.flat' : 'notePicker.acc.sharp', language),
			});
}

/** The ribbon's reach either side of the printed key. */
const REACH = 6;

/**
 * The node a drag is on, from its position along the track in semitones
 * (ruled 13:33 and 13:35): the nearest; on an exact midpoint the one nearer
 * zero; past either end, that end.
 */
export function snapSemitone(position: number): number {
	const n = Math.sign(position) * Math.ceil(Math.abs(position) - 0.5);
	return Math.min(REACH, Math.max(-REACH, n)) || 0;
}

/** The slots in a phone's window: seven nodes, or six and a blank at an end. */
export const WINDOW_SLOTS = 7;

/**
 * The phone's window rule (ruled 13:52 and 13:55): the node index at the
 * window's first slot, moved from `first` by the least that keeps node `index`
 * in slots two to six. DESK DEFAULT that the trigger is late.
 *
 * THE WINDOW TRAVELS ONE SLOT PAST EACH END (ruled by Dann 2026-11-26 19:13),
 * so that -6 rests in slot two and +6 in slot six and their spelling pairs
 * centre on the screen. The index is then -1, or one past the last full window,
 * and the extra slot is empty track. DESK DEFAULT: only while that end node is
 * the selected one, so the blank leaves as soon as the singer steps off it.
 */
export function slideWindow(first: number, index: number, count = 2 * REACH + 1): number {
	const kept = Math.min(index - 1, Math.max(index - (WINDOW_SLOTS - 2), first));
	const low = index === 0 ? -1 : 0;
	const high = count - WINDOW_SLOTS + (index === count - 1 ? 1 : 0);
	return Math.min(high, Math.max(low, kept));
}
