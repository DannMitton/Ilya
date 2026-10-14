/**
 * Row 93, 2026-10-13. A stored song's seats filed under the old reader's note
 * names find their notes again.
 *
 * THE FAULT. Ilya's own page reader named each note `r{measureIndex}-{x}`, or
 * `r{measureIndex}-{x}-{ordinal}` where two shared an x (`correction.ts`, the
 * N.97 re-key; `reader-ids.test.ts`), and carried that name into `<note id>`
 * (`recognized-to-musicxml.ts`). A seat made on such a reading is keyed by it.
 * homr's reading carries no `<note id>`, so the parser names every note by its
 * cursor, `m{measureIndex}-{num}-{den}` (`musicxml-parser.ts`). A song seated
 * under the old reader and restored with homr's reading keeps every seat under
 * a name no note carries, and Markup draws a blank page («Средь шумного бала»,
 * Dann's library, 170 of 170 seats).
 *
 * THE MIGRATION (invariant 10: a stored id changes only with a migration). Each
 * old seat is filed under the note it was placed on, bar by bar:
 *
 * - IN ORDER where the bar's old seats and its syllable targets
 *   (`syllableTargetIds`) agree in number. The old reader sorted a bar's events
 *   by x (`run_page2.py`), so x order is its time order; the targets are taken
 *   by onset.
 * - BY RAW PAGE POSITION where they disagree and the song shows its two readers
 *   share a scale (amendment 1, DESK DEFAULT 2026-10-14). Over every seat placed
 *   in order, the gap between the old key's x and the placed note's imgpos x
 *   (`<!-- imgpos: x, y -->`, `placeOf`) has a median of 20 px or less and a 95th
 *   percentile of 40 px or less («Средь шумного бала»: 9 and 29), over at least 20
 *   such seats (amendment 1b; below that the test fails). Each seat then
 *   takes the target nearest in absolute pixels, within 60 px; the bar is placed
 *   only where that is one-to-one and keeps the seats' order.
 * - BY BAR-RELATIVE PAGE POSITION where the raw rule did not place the bar and
 *   homr placed every note of it. Old x is normalised to the old seats' own span
 *   in the bar and imgpos x to the span of the bar's sung notes, so the two
 *   readers' scales never have to agree. Each seat takes the nearest target,
 *   under the same one-to-one and order test. A bar whose seats do not reach
 *   both ends is stretched by this rule, which is why the raw rule goes first.
 * - OTHERWISE LEFT under the old names, counted, and drawn by nothing. Nothing
 *   is dropped, so a later rule can still place them.
 *
 * Every entry kind moves, `melisma` and `empty` as well as `syllable`. Bars
 * count from 0 on both sides (`musicxml-parser.ts`, `run_page2.py`); where the
 * two readers drew a barline differently, every later bar disagrees and is
 * left, which the bar outcomes show and nothing here repairs.
 *
 * A no-op, returning the same map, where no old name is missing from the
 * reading, and where the reading itself is the old reader's (its absent names
 * are then ordinary orphans of a re-read, not a change of naming).
 *
 * THE SINGER'S CORRECTIONS ARE NOT RE-KEYED HERE, on purpose (accepted by the
 * desk, amendment 1). A correction fixes the old reader's own reading: a note it
 * invented, a pitch it misread. Moved by position onto homr's reading, which
 * read that bar differently, a deletion could land on a real note. Left under
 * their old keys they stay recoverable, and `orphanIds` already counts them.
 */
import { placeOf } from '$lib/omr/join-pages';
import { syllableTargetIds, type PairingMap } from './pairings';

/** The old reader's note name: `r{measureIndex}-{x}` or `r{measureIndex}-{x}-{ordinal}`. */
export const OLD_READER_ID = /^r(\d+)-(\d+)(?:-(\d+))?$/;

/** The shape the re-key reads from a parsed event; any `VocalLineEvent` satisfies it. */
export interface PlacedEvent {
	id: string;
	type: 'note' | 'rest';
	measureIndex: number;
	rhythmicPosition: { fraction: { numerator: number; denominator: number } };
	tied?: { type: 'start' | 'continue' | 'stop' | 'let-ring' };
}

/** How one bar holding old seats was settled. */
export interface BarOutcome {
	measureIndex: number;
	rule: 'order' | 'raw' | 'imgpos' | 'left';
	/** Old seats in the bar. */
	seats: number;
	/** The reading's syllable targets in the bar. */
	targets: number;
}

export interface Rekeyed {
	map: PairingMap;
	/** Old seats now filed under a note of the reading. */
	moved: number;
	/** Old seats still under their old names. */
	left: number;
	/** One per bar holding an old seat, in bar order. */
	bars: BarOutcome[];
	/** The scale test over the seats placed in order; null where none had a page position. */
	scale: Scale | null;
}

/** Old x against imgpos x over the seats placed in order, in pixels. */
export interface Scale {
	pairs: number;
	median: number;
	p95: number;
	shared: boolean;
}

/** Amendment 1's thresholds, in page pixels. */
export const SHARED_MEDIAN = 20;
export const SHARED_P95 = 40;
export const RAW_REACH = 60;
/** Amendment 1b: fewer seats placed in order than this, and the scale test fails. */
export const SHARED_MIN_PAIRS = 20;

const NOTHING = (map: PairingMap): Rekeyed => ({ map, moved: 0, left: 0, bars: [], scale: null });

/**
 * homr's page x for each event of a single-part reading, by event id. A bar is
 * included only where its notes line up one for one with the parsed events of
 * that bar (no chord, grace, backup, or forward) and every one carries an
 * imgpos; anything else gives the bar no positions, and the re-key falls back to
 * leaving it. Empty for a reading with more or fewer than one part.
 */
export function notePositions(musicXml: string, events: readonly PlacedEvent[]): Map<string, number> {
	const out = new Map<string, number>();
	const parts = musicXml.match(/<part\s[^>]*>[\s\S]*?<\/part>/g) ?? [];
	if (parts.length !== 1) return out;
	const measures = parts[0].match(/<measure\b[^>]*\/>|<measure\b[^>]*>[\s\S]*?<\/measure>/g) ?? [];
	const byBar = groupBy(events, (ev) => ev.measureIndex);
	measures.forEach((measure, mi) => {
		const evs = byBar.get(mi);
		if (!evs || /<(?:backup|forward)\b/.test(measure)) return;
		const notes = (measure.match(/<note\b[\s\S]*?<\/note>/g) ?? []).filter((n) => !/<(?:grace|chord)\b/.test(n));
		if (notes.length !== evs.length) return;
		const xs = notes.map((n) => placeOf(n)?.x);
		if (xs.some((x) => x === undefined)) return;
		evs.forEach((ev, i) => out.set(ev.id, xs[i] as number));
	});
	return out;
}

/** Files a map's old-reader seats under the reading's notes. Pure; see the file comment. */
export function rekeyOldReaderSeats(
	map: PairingMap,
	events: readonly PlacedEvent[],
	positions: ReadonlyMap<string, number> = new Map(),
): Rekeyed {
	const present = new Set(events.map((ev) => ev.id));
	if (events.some((ev) => OLD_READER_ID.test(ev.id))) return NOTHING(map);
	const stray = Object.keys(map).filter((k) => OLD_READER_ID.test(k) && !present.has(k));
	if (stray.length === 0) return NOTHING(map);

	const seatsByBar = groupBy(
		stray.map((key) => {
			const [, bar, x, ordinal] = OLD_READER_ID.exec(key) as RegExpExecArray;
			return { key, bar: Number(bar), x: Number(x), ordinal: Number(ordinal ?? 0) };
		}),
		(s) => s.bar,
	);
	const targetSet = new Set(syllableTargetIds(events));
	const eventsByBar = groupBy(events, (ev) => ev.measureIndex);
	const barNumbers = [...seatsByBar.keys()].sort((a, b) => a - b);
	const dest = new Map<string, string>();
	const outcomes = new Map<number, BarOutcome>();
	const pending: { bar: number; seats: Seat[]; sung: PlacedEvent[]; targets: PlacedEvent[] }[] = [];
	const settle = (bar: number, seats: Seat[], targets: number, rule: BarOutcome['rule'], pairs: string[] | null) => {
		// A note that already holds an entry under its own name keeps it: the bar is left rather than overwritten.
		if (pairs && pairs.some((id) => id in map)) pairs = null;
		if (pairs) seats.forEach((s, i) => dest.set(s.key, (pairs as string[])[i]));
		outcomes.set(bar, { measureIndex: bar, rule: pairs ? rule : 'left', seats: seats.length, targets });
		return pairs !== null;
	};

	// Pass 1, in order, where the counts agree.
	const gaps: number[] = [];
	for (const bar of barNumbers) {
		const seats = (seatsByBar.get(bar) ?? []).sort((a, b) => a.x - b.x || a.ordinal - b.ordinal);
		const sung = (eventsByBar.get(bar) ?? []).filter((ev) => ev.type !== 'rest');
		const targets = sung.filter((ev) => targetSet.has(ev.id)).sort((a, b) => onset(a) - onset(b));
		if (targets.length === 0 || targets.length !== seats.length) {
			pending.push({ bar, seats, sung, targets });
			continue;
		}
		if (!settle(bar, seats, targets.length, 'order', targets.map((t) => t.id))) continue;
		seats.forEach((s, i) => {
			const x = positions.get(targets[i].id);
			if (x !== undefined) gaps.push(Math.abs(s.x - x));
		});
	}

	// Pass 2, where they disagree: raw position on a shared scale, then bar-relative, then left.
	const scale = scaleOf(gaps);
	for (const { bar, seats, sung, targets } of pending) {
		const placed = targets.length > 0 && targets.every((t) => positions.has(t.id));
		const targetXs = targets.map((t) => positions.get(t.id) as number);
		if (placed && scale?.shared) {
			const raw = byRawPosition(seats.map((s) => s.x), targetXs);
			if (raw && settle(bar, seats, targets.length, 'raw', raw.map((i) => targets[i].id))) continue;
		}
		const relative =
			placed && sung.every((ev) => positions.has(ev.id))
				? byPosition(seats.map((s) => s.x), targetXs, sung.map((ev) => positions.get(ev.id) as number))
				: null;
		settle(bar, seats, targets.length, 'imgpos', relative?.map((i) => targets[i].id) ?? null);
	}

	const bars = barNumbers.map((bar) => outcomes.get(bar) as BarOutcome);
	if (dest.size === 0) return { map, moved: 0, left: stray.length, bars, scale };
	const out: PairingMap = {};
	for (const [key, pairing] of Object.entries(map)) out[dest.get(key) ?? key] = pairing;
	return { map: out, moved: dest.size, left: stray.length - dest.size, bars, scale };
}

interface Seat {
	key: string;
	bar: number;
	x: number;
	ordinal: number;
}

/**
 * The scale test (amendment 1): the median and the 95th percentile (nearest
 * rank) of the gaps between old x and imgpos x, shared only over at least
 * `SHARED_MIN_PAIRS` gaps (amendment 1b). Null where there are no gaps.
 */
export function scaleOf(gaps: readonly number[]): Scale | null {
	if (gaps.length === 0) return null;
	const sorted = [...gaps].sort((a, b) => a - b);
	const n = sorted.length;
	const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
	const p95 = sorted[Math.ceil(0.95 * n) - 1];
	return { pairs: n, median, p95, shared: n >= SHARED_MIN_PAIRS && median <= SHARED_MEDIAN && p95 <= SHARED_P95 };
}

/**
 * The re-key as `applyArrival` runs it, before the merge counts orphans: by
 * order first, and only where that leaves a seat, with homr's page positions
 * read from the arrived reading. Prints the console line.
 *
 * SYNCHRONOUS UNLESS IT MUST READ. A plain restore, and every song with no old
 * name, returns at once, so the caller reaches the merge in the same tick and
 * no effect runs on the map in between. Only a bar the order rule left makes it
 * a promise. That never rejects: a reading that cannot be read gives no
 * positions, and its bars are left.
 */
export function rekeyOnArrival(
	map: PairingMap,
	events: readonly PlacedEvent[],
	reading: () => Promise<string>,
): Rekeyed | Promise<Rekeyed> {
	const plain = rekeyOldReaderSeats(map, events);
	if (plain.left === 0) return said(plain);
	return reading()
		.catch(() => '')
		.then((xml) => said(rekeyOldReaderSeats(map, events, notePositions(xml, events))));
}

function said(r: Rekeyed): Rekeyed {
	const line = rekeyLine(r);
	if (line) console.info(line);
	return r;
}

/** The console line, or null where the map held no stray old name. */
export function rekeyLine(r: Rekeyed): string | null {
	if (r.moved + r.left === 0) return null;
	const barsLeft = r.bars.filter((b) => b.rule === 'left').length;
	return `[Ilya] N.185 re-key: ${r.moved} ${r.moved === 1 ? 'seat' : 'seats'} moved, ${r.left} left under old names, ${barsLeft} ${barsLeft === 1 ? 'bar' : 'bars'} left`;
}

/**
 * Seat i to target index, by nearest bar-relative x, or null where any seat's
 * nearest is a tie, two seats share one, or the order would cross.
 */
function byPosition(seatXs: number[], targetXs: number[], barXs: number[]): number[] | null {
	const seatN = normaliser(seatXs);
	const barN = normaliser(barXs);
	const ts = targetXs.map(barN);
	const picks: number[] = [];
	for (const x of seatXs.map(seatN)) {
		const d = ts.map((t) => Math.abs(t - x));
		const best = Math.min(...d);
		if (d.filter((v) => v === best).length !== 1) return null;
		picks.push(d.indexOf(best));
	}
	for (let i = 1; i < picks.length; i++) if (picks[i] <= picks[i - 1]) return null;
	return picks;
}

/**
 * Seat i to target index, by nearest absolute x, or null where any seat's
 * nearest is a tie or beyond `RAW_REACH`, two seats share one, or the order
 * would cross.
 */
function byRawPosition(seatXs: number[], targetXs: number[]): number[] | null {
	const picks: number[] = [];
	for (const x of seatXs) {
		const d = targetXs.map((t) => Math.abs(t - x));
		const best = Math.min(...d);
		if (best > RAW_REACH || d.filter((v) => v === best).length !== 1) return null;
		picks.push(d.indexOf(best));
	}
	for (let i = 1; i < picks.length; i++) if (picks[i] <= picks[i - 1]) return null;
	return picks;
}

/** Maps x into 0..1 across the span of `xs`; a span of nought maps everything to the middle. */
function normaliser(xs: number[]): (x: number) => number {
	const lo = Math.min(...xs);
	const span = Math.max(...xs) - lo;
	return (x) => (span > 0 ? (x - lo) / span : 0.5);
}

function onset(ev: PlacedEvent): number {
	const f = ev.rhythmicPosition.fraction;
	return f.numerator / f.denominator;
}

function groupBy<T>(xs: readonly T[], key: (x: T) => number): Map<number, T[]> {
	const out = new Map<number, T[]>();
	for (const x of xs) {
		const k = key(x);
		const list = out.get(k);
		if (list) list.push(x);
		else out.set(k, [x]);
	}
	return out;
}
