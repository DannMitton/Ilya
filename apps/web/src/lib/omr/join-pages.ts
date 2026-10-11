/**
 * joinPages: homr-web's MusicXML for each page of a song in, one MusicXML
 * string out.
 *
 * homr reads one page at a time (homr-web's README, "A multi-page input is
 * one call per page; homr 0.7.0 does not join pages either"), and it writes
 * one part per voice it finds: on a song page, the voice first and the piano
 * after it. Ilya needs the sung line only, as one score. This function:
 *
 * - keeps homr's first part (its first `score-part` and the `part` with the
 *   same id) and drops every other part;
 * - inside that part keeps the first staff only: notes whose `<staff>` is 1
 *   or absent, `<clef>` with no number or number 1, and no `<staves>`;
 * - puts the measures of all pages in order and numbers them from 1;
 * - keeps the key, metre, and clef in force from one page to the next. A
 *   later page that states the same key, metre, or clef again has that
 *   statement removed, because it is not a change; a page that states none
 *   continues with what is in force, which is how MusicXML reads a part.
 *   A page that states a different one keeps it, because that is a change
 *   printed on the page;
 * - copies every note's own text unchanged, so ties, slurs, beams, dots,
 *   and tuplets stay as homr wrote them, except as the last item says. With model 465 that text holds
 *   homr main's `<!-- imgpos: x, y -->` comment, the note's place on the
 *   page image, and the comment arrives with the note;
 * - drops the metre that homr main's writer supplies of its own accord. With
 *   model 465 (homr-web 0.2.0-ilya.2, `src/musicxml/generate-main.ts` in
 *   `third_party/homr-web/`), the writer gives the first `<attributes>` of
 *   every page, the one holding `<divisions>`, a `<time>` when that element
 *   states none, and it does so after the page is written. A metre printed
 *   on the page comes in a later `<attributes>` of the same measure, after the
 *   clef. So that first `<time>` is the writer's, not the page's: it is
 *   dropped where the same measure states another metre, and where a metre
 *   is already in force from an earlier page. It is kept only on the first
 *   page when that page states no other metre, so the song has one.
 * - reads as triplets the notes of a bar that homr read without the bracketed
 *   3 above them, where the bar is too long by exactly what triplets
 *   account for (`triplets.ts`, which says when, and why a musician would
 *   read them so).
 *   Where that needs finer divisions, the bar states them and the next bar
 *   states the divisions in force again.
 * - keeps a page of the piano alone as bars in which the voice rests, where
 *   the song's other pages print the voice above the piano
 *   (`pianoAlonePages`);
 * - leaves out the bars at the end of the song that come after its last
 *   double bar line and hold neither note nor rest: a voice staff printed
 *   blank on to the margin after the voice has ended (`dropBarsAfterTheEnd`);
 * - with what the time-signature reader saw on the pages (`metre-model.ts`),
 *   states each signature it saw where the bars it governs add up to it
 *   (`metre-witness.ts`, "seen and summed"). A stated signature holds until
 *   the reader's next one: homr's own metres in between are left out, and
 *   the tuplet checks run under the stated one. Where the reader's next
 *   signature is not stated, homr's metre in force there takes over again.
 *   Where the reader saw nothing, the join is as it was without it.
 *
 * It works on the text of homr's output, not on a DOM, so it runs the same in
 * the browser and in vitest (which has no `DOMParser`). It reads elements,
 * attributes, self-closing tags, comments, and processing instructions, which
 * is everything homr-web's serializer (`src/musicxml/xml.ts` in homr-web)
 * writes. It does not read CDATA sections.
 */

import { completeTriplets, readMetre, type PageLook } from './triplets';
import { barFacts, barOfWindow, labelOf, timeElement, witness, type MetreSeen, type Proposal } from './metre-witness';

/** One element found in a fragment of XML, with its place in that fragment. */
interface Span {
	name: string;
	/** The whole opening tag, `<measure number="3">`. */
	open: string;
	/** Start of the opening tag. */
	start: number;
	/** One past the end of the closing tag (or of the self-closing tag). */
	end: number;
	/** Start and end of the content between the tags; equal when self-closing. */
	innerStart: number;
	innerEnd: number;
}

export class JoinPagesError extends Error {}

/** The child elements of a fragment, at its top level, in order. */
function childElements(xml: string): Span[] {
	const out: Span[] = [];
	let i = 0;
	let depth = 0;
	let current: { name: string; open: string; start: number; innerStart: number } | null = null;
	while (i < xml.length) {
		const lt = xml.indexOf('<', i);
		if (lt < 0) break;
		if (xml.startsWith('<!--', lt)) {
			const close = xml.indexOf('-->', lt + 4);
			if (close < 0) throw new JoinPagesError('unclosed comment');
			i = close + 3;
			continue;
		}
		if (xml.startsWith('<?', lt) || xml.startsWith('<!', lt)) {
			const close = xml.indexOf('>', lt);
			if (close < 0) throw new JoinPagesError('unclosed declaration');
			i = close + 1;
			continue;
		}
		const gt = xml.indexOf('>', lt);
		if (gt < 0) throw new JoinPagesError('unclosed tag');
		const tag = xml.slice(lt, gt + 1);
		if (tag.startsWith('</')) {
			depth -= 1;
			if (depth < 0) throw new JoinPagesError(`unexpected ${tag}`);
			if (depth === 0 && current) {
				out.push({
					name: current.name,
					open: current.open,
					start: current.start,
					end: gt + 1,
					innerStart: current.innerStart,
					innerEnd: lt,
				});
				current = null;
			}
		} else {
			const name = /^<([^\s/>]+)/.exec(tag)?.[1] ?? '';
			const selfClosing = tag.endsWith('/>');
			if (depth === 0) {
				if (selfClosing) {
					out.push({ name, open: tag, start: lt, end: gt + 1, innerStart: gt + 1, innerEnd: gt + 1 });
				} else {
					current = { name, open: tag, start: lt, innerStart: gt + 1 };
				}
			}
			if (!selfClosing) depth += 1;
		}
		i = gt + 1;
	}
	if (depth !== 0) throw new JoinPagesError('unbalanced tags');
	return out;
}

const inner = (xml: string, s: Span): string => xml.slice(s.innerStart, s.innerEnd);
const whole = (xml: string, s: Span): string => xml.slice(s.start, s.end);
const attr = (open: string, name: string): string | null =>
	new RegExp(`\\s${name}="([^"]*)"`).exec(open)?.[1] ?? null;
/** The trimmed text of the first child element called `name`, or null. */
function childText(xml: string, name: string): string | null {
	const s = childElements(xml).find((c) => c.name === name);
	return s ? inner(xml, s).trim() : null;
}
/** A comparable form of an element's text: no whitespace between tags. */
const squash = (s: string): string => s.replace(/>\s+</g, '><').trim();

interface PagePart {
	scorePart: string;
	measures: string[];
	/** Everything in the root before `<part-list>` (work, identification, defaults). */
	head: string[];
}

function firstPart(xml: string, pageNumber: number): PagePart {
	const rootSpan = childElements(xml).find((c) => c.name === 'score-partwise');
	if (!rootSpan) throw new JoinPagesError(`page ${pageNumber}: no <score-partwise>`);
	const root = inner(xml, rootSpan);
	const top = childElements(root);
	const partList = top.find((c) => c.name === 'part-list');
	if (!partList) throw new JoinPagesError(`page ${pageNumber}: no <part-list>`);
	const listInner = inner(root, partList);
	const scorePartSpan = childElements(listInner).find((c) => c.name === 'score-part');
	if (!scorePartSpan) throw new JoinPagesError(`page ${pageNumber}: no <score-part>`);
	const id = attr(scorePartSpan.open, 'id');
	const partSpan = top.find((c) => c.name === 'part' && attr(c.open, 'id') === id);
	if (!partSpan) throw new JoinPagesError(`page ${pageNumber}: no <part id="${id}">`);
	const partInner = inner(root, partSpan);
	const measures = childElements(partInner)
		.filter((c) => c.name === 'measure')
		.map((c) => whole(partInner, c));
	const head = top
		.filter((c) => c.start < partList.start && ['work', 'movement-title', 'identification', 'defaults'].includes(c.name))
		.map((c) => whole(root, c));
	return { scorePart: whole(listInner, scorePartSpan), measures, head };
}

/** The staff a measure child belongs to: a note's `<staff>`, 1 when absent. */
function staffOf(xml: string): string {
	return childText(xml, 'staff') ?? '1';
}

/** What is in force at the end of a measure. */
interface InForce {
	key: string | null;
	time: string | null;
	clef: string | null;
	/** The `<divisions>` in force. */
	divisions: number | null;
	/** Set when the bar before changed the divisions for its triplets (`triplets.ts`): the divisions to put back. */
	restoreDivisions: number | null;
	/** The `<time>` homr's own reading has in force, which `time` follows except while a stated signature governs. */
	homrTime: string | null;
	/** The stated signature that governs, or null. */
	forced: string | null;
	/** Which tuplet rule changed the last bar written (`triplets.ts`), or null. */
	lastRule: 1 | 2 | 3 | 'page' | null;
}

/** What a bar does with the reader's signatures: states one, or ends one and gives homr's metre back. */
interface Plan {
	start?: string;
	resume?: boolean;
}

/**
 * Rewrites one measure: its number, the first staff only, and (on the first
 * measure of a later page) no restatement of what is already in force.
 * Updates `state` with what the measure states.
 */
function rewriteMeasure(measure: string, number: number, state: InForce, firstOfPage: boolean, dropRestatements: boolean, look?: PageLook, plan: Plan = {}): string {
	if (plan.start) {
		state.forced = squash(plan.start);
		state.time = state.forced;
	} else if (plan.resume) state.forced = null;
	const span = childElements(measure)[0];
	const body = inner(measure, span);
	const kids = childElements(body);
	const writersTime = firstOfPage ? writersTimeIndex(body, kids, state, dropRestatements) : -1;
	const multiStaff = kids.some(
		(k) => (k.name === 'note' && staffOf(inner(body, k)) !== '1') || k.name === 'attributes' && /<staves>/.test(inner(body, k))
	);
	const kept: string[] = [];
	// For a measure with more than one staff: a <backup> or <forward> is kept
	// only where the notes on both sides of it are on staff 1.
	const noteStaff = kids.map((k) => (k.name === 'note' ? staffOf(inner(body, k)) : null));
	const neighbourStaff = (from: number, step: number): string | null => {
		for (let j = from + step; j >= 0 && j < kids.length; j += step) if (noteStaff[j] !== null) return noteStaff[j];
		return null;
	};
	kids.forEach((k, idx) => {
		const text = whole(body, k);
		if (k.name === 'note') {
			if (!multiStaff || noteStaff[idx] === '1') kept.push(text);
			return;
		}
		if (multiStaff && (k.name === 'backup' || k.name === 'forward')) {
			if (neighbourStaff(idx, -1) === '1' && neighbourStaff(idx, 1) === '1') kept.push(text);
			return;
		}
		if (k.name === 'attributes') {
			const a = rewriteAttributes(inner(body, k), state, dropRestatements, idx === writersTime);
			if (a !== null) kept.push(`<attributes>${a}</attributes>`);
			return;
		}
		kept.push(text);
	});
	// An empty bar may come self-closed, `<measure number="3" />`: it is opened here,
	// because the measure is written back with a closing tag.
	const open = span.open.replace(/\snumber="[^"]*"/, ` number="${number}"`).replace(/\s*\/>$/, '>');
	const children = silent(kept) ? kept.filter((t) => !TIMED.test(t)) : kept;
	if (plan.start) children.unshift(`<attributes>${plan.start}</attributes>`);
	// A stated signature ends here: homr's metre in force takes over again, stated where it differs.
	if (plan.resume && state.homrTime !== null && labelOf(state.time) !== labelOf(state.homrTime)) {
		children.unshift(`<attributes>${state.homrTime}</attributes>`);
		state.time = squash(state.homrTime.replace(/^<time\b[^>]*>|<\/time>$/g, ''));
	}
	// The bar before ran in three times the divisions for its triplets: put them back,
	// unless this bar states its own before its first note.
	const restore = state.restoreDivisions;
	state.restoreDivisions = null;
	if (restore !== null) {
		const firstTimed = children.findIndex((t) => TIMED.test(t));
		const before = firstTimed < 0 ? children : children.slice(0, firstTimed);
		if (!before.some((t) => /^<attributes>[\s\S]*<divisions>/.test(t))) children.unshift(`<attributes><divisions>${restore}</divisions></attributes>`);
	}
	// homr read a time signature printed in this bar when an <attributes> other than the
	// writer's own holds a <time>, even one the join drops above as the metre already in
	// force: homr reads only a time signature's lower figure and works out the upper one
	// from the page's bar lengths, so the metre it states may not be the one printed.
	const printsMetre = kids.some((k, idx) => k.name === 'attributes' && idx !== writersTime && /<time[\s>]/.test(inner(body, k)));
	// Under a signature the reader saw and the bars confirmed, the metre is the printed one,
	// so the tuplet checks run under it, in its first bar too.
	const statesMetre = state.forced === null && (printsMetre || children.some((t) => /^<attributes>[\s\S]*<time[\s>]/.test(t)));
	const triplets = completeTriplets(children, readMetre(state.time), state.divisions, statesMetre, look);
	if (triplets.divisions !== null) state.restoreDivisions = state.divisions;
	state.lastRule = triplets.rule;
	return `${open}${triplets.children.join('')}</measure>`;
}

/** A kept child that takes up time in the measure: a note, a rest, or a move of the cursor. */
const TIMED = /^<(note|backup|forward)[\s>]/;

/**
 * True where the voice has rests and no pitched note in the measure.
 *
 * homr writes a bar in which the voice is silent as a bar holding a rest (a
 * whole rest, whatever the metre). Ilya counts a bar as silent, and draws a
 * run of silent bars as one rest with the count above it, when the vocal line
 * has NO event in the bar (`tacetRuns`, `packages/score-parser/src/staff-renderer.ts:823`;
 * N.104, after Gould). So a silent bar's rests are left out here, and the bar
 * arrives empty, which is how Dann's own engraving of a piano-only bar arrives.
 */
function silent(kept: readonly string[]): boolean {
	const notes = kept.filter((t) => /^<note[\s>]/.test(t));
	return notes.length > 0 && notes.every((t) => /<rest[\s/>]/.test(t) && !/<pitch[\s>]/.test(t));
}

/**
 * In the first measure of a page, the index among `kids` of the
 * `<attributes>` whose `<time>` is the writer's own and is to be dropped, or
 * -1. See the header: the writer's `<time>` stands beside `<divisions>`; it
 * is dropped where a later `<attributes>` of the same measure states a
 * metre, or where a metre is in force from an earlier page.
 */
function writersTimeIndex(body: string, kids: readonly Span[], state: InForce, laterPage: boolean): number {
	const has = (k: Span, name: string) => k.name === 'attributes' && childElements(inner(body, k)).some((c) => c.name === name);
	const at = kids.findIndex((k) => has(k, 'divisions') && has(k, 'time'));
	if (at < 0) return -1;
	const printedAfter = kids.some((k, j) => j > at && has(k, 'time'));
	return printedAfter || (laterPage && state.time !== null) ? at : -1;
}

/** One `<attributes>` body rewritten, or null where nothing is left in it. */
function rewriteAttributes(body: string, state: InForce, dropRestatements: boolean, dropTime: boolean): string | null {
	const out: string[] = [];
	for (const k of childElements(body)) {
		const text = whole(body, k);
		if (k.name === 'staves') continue;
		if (k.name === 'divisions') {
			const d = Number(inner(body, k).trim());
			if (d > 0) state.divisions = d;
		}
		if (k.name === 'time' && dropTime) continue;
		if (k.name === 'time') {
			const value = squash(inner(body, k));
			state.homrTime = squash(text);
			// while a stated signature governs, homr's own metre is not written
			if (state.forced !== null) continue;
			if (dropRestatements && value === state.time) continue;
			state.time = value;
			out.push(text);
			continue;
		}
		if (k.name === 'clef') {
			const n = attr(k.open, 'number');
			if (n !== null && n !== '1') continue;
			const value = squash(inner(body, k));
			if (dropRestatements && value === state.clef) continue;
			state.clef = value;
			out.push(text);
			continue;
		}
		if (k.name === 'key') {
			const value = squash(inner(body, k));
			if (dropRestatements && value === state.key) continue;
			state.key = value;
			out.push(text);
			continue;
		}
		out.push(text);
	}
	return out.length === 0 ? null : out.join('');
}

/**
 * Removes, from the end of the song, the bars that come after its last double
 * bar line and hold no note and no rest in homr's own output (`raw`, the
 * measures as homr wrote them, one for one with `measures`).
 *
 * Where the voice ends before the piano, an engraver may run the voice's
 * staff on to the margin with no notes, no rests, and no bar lines (Varlamov,
 * «Скажи, зачем?», page 3). homr writes that blank stretch as one more bar.
 * A bar holds time, and that one holds none, so it is not a bar of the song.
 * homr writes a bar in which the voice is silent as a bar holding a rest, so
 * such a bar is kept (`silent` empties it later, and it stays a bar).
 */
function dropBarsAfterTheEnd(measures: string[], raw: readonly string[]): void {
	const holdsTime = (m: string) => /<(note|forward)[\s>]/.test(m);
	let end = measures.length;
	while (end > 0 && !holdsTime(raw[end - 1] ?? '')) end -= 1;
	if (end === measures.length || end === 0) return;
	if (!/<bar-style>(heavy-heavy|light-heavy)<\/bar-style>/.test(raw[end - 1] ?? '')) return;
	measures.length = end;
}

/**
 * For each part of a page, in order, the staves it is printed on: its first
 * `<staves>`, else 1. A part that states two staves counts as on two only
 * where every bar holding a note has a note on its second staff or below, so
 * that a part in which homr ran a single staff on after a grand staff counts
 * as on one.
 */
function stavesOfParts(xml: string): number[] {
	const rootSpan = childElements(xml).find((c) => c.name === 'score-partwise');
	if (!rootSpan) return [];
	const root = inner(xml, rootSpan);
	return childElements(root)
		.filter((c) => c.name === 'part')
		.map((c) => {
			const part = inner(root, c);
			const staves = Number(/<staves>\s*(\d+)\s*<\/staves>/.exec(part)?.[1] ?? 1);
			if (staves < 2) return staves;
			const everyBarLow = childElements(part)
				.filter((m) => m.name === 'measure')
				.map((m) => inner(part, m))
				.every((m) => !/<note[\s>]/.test(m) || /<staff>\s*[2-9]\s*<\/staff>/.test(m));
			return everyBarLow ? staves : 1;
		});
}

/**
 * For each page, true where homr read the piano alone on it: every part of
 * the page is on two staves or more (a grand staff), in a song where another
 * page gives the voice a part of its own on one staff above a part on two.
 *
 * In a song the voice's staff is printed above the piano's, and where the
 * voice has ended, or has not yet begun, an engraver may print a page of the
 * piano alone (Ippolitov-Ivanov, op. 28 no. 4, Jurgenson 1899, page 6: the
 * postlude, five systems of the piano's grand staff). homr makes the voice its
 * first part, and with no voice on the page its first part is the piano. A
 * musician reads the page as the voice resting while the piano plays, so its
 * bars stay bars of the song and hold nothing for the voice
 * (homr-web 0.2.0-ilya.4 does the same for a system of the piano alone on a
 * page that also prints the voice, `systemOffsets`).
 */
function pianoAlonePages(pages: readonly string[]): boolean[] {
	const staves = pages.map(stavesOfParts);
	const voiceOverPiano = staves.some((s) => s.length >= 2 && s[0] === 1 && s.slice(1).some((n) => n >= 2));
	return staves.map((s) => voiceOverPiano && s.length > 0 && s.every((n) => n >= 2));
}

/** A measure with its notes and its moves of the cursor taken out: the voice silent through the bar. */
function withoutNotes(measure: string): string {
	const span = childElements(measure)[0];
	if (!span) return measure;
	const body = inner(measure, span);
	const kept = childElements(body)
		.filter((k) => !['note', 'backup', 'forward'].includes(k.name))
		.map((k) => whole(body, k));
	return `${span.open.replace(/\s*\/>$/, '>')}${kept.join('')}</measure>`;
}

/** Where homr placed a note on its page: its `<!-- imgpos: x, y -->` comment. */
export function placeOf(note: string): { x: number; y: number } | null {
	const m = /imgpos:\s*(\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)/.exec(note);
	return m ? { x: Number(m[1]), y: Number(m[2]) } : null;
}

/**
 * What the page shows over a bar's notes at these places on page `page`
 * (0-based, in the order of `pages`): each number read, where it stands
 * across the page (`x`), and the centres of every numeral-sized mark there.
 * Null where it cannot be looked at.
 */
export type LookAtPage = (
	page: number,
	notes: readonly { x: number; y: number }[],
) => { numbers: { n: number; m: number | null; x: number }[]; centres: number[] } | null;

/**
 * Every note's place, a note homr gave no place taking one between its placed
 * neighbours (or beside the nearest, at either end). Null where no note has a place.
 */
export function fillPlaces(places: readonly ({ x: number; y: number } | null)[]): { x: number; y: number }[] | null {
	const known = places.flatMap((p, i) => (p ? [i] : []));
	if (known.length === 0) return null;
	return places.map((p, i) => {
		if (p) return p;
		const before = known.filter((k) => k < i).pop();
		const after = known.find((k) => k > i);
		if (before === undefined) return places[after as number] as { x: number; y: number };
		if (after === undefined) return places[before] as { x: number; y: number };
		const a = places[before] as { x: number; y: number };
		const b = places[after] as { x: number; y: number };
		const t = (i - before) / (after - before);
		return { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) };
	});
}

/**
 * Where a point across the page stands among the notes, counted in notes:
 * 2 over the third note, 2.5 halfway from it to the fourth, and beyond the
 * first or last note by the gap to its neighbour.
 */
export function notesAt(xs: readonly number[], x: number): number {
	if (xs.length === 1) return 0;
	for (let i = 0; i + 1 < xs.length; i++) {
		const [a, b] = [xs[i], xs[i + 1]];
		if (x >= Math.min(a, b) && x <= Math.max(a, b)) return b === a ? i : i + (x - a) / (b - a);
	}
	const n = xs.length;
	if (x < xs[0]) return (x - xs[0]) / Math.max(1, Math.abs(xs[1] - xs[0]));
	return n - 1 + (x - xs[n - 1]) / Math.max(1, Math.abs(xs[n - 1] - xs[n - 2]));
}

/** What the time-signature reader saw on each page, in the order of `pages` (null where it read nothing), and where the join says what it did. */
export interface SeenMetres {
	pages: readonly (readonly MetreSeen[] | null)[];
	log?: string[];
}

/** The reader's signatures as proposals on the join's bars, in bar order, one a bar; courtesies and unplaced ones go to the log. */
function proposalsOf(pageMeasures: readonly (readonly string[])[], metres: SeenMetres): Proposal[] {
	const out = new Map<number, Proposal>();
	let offset = 0;
	pageMeasures.forEach((measures, page) => {
		for (const w of metres.pages[page] ?? []) {
			if (!w.lab) continue;
			if (w.courtesy) {
				metres.log?.push(`page ${page + 1}: ${w.lab} after the staff's last bar line set aside as a courtesy signature`);
				continue;
			}
			const bar = barOfWindow(measures, w);
			if (bar === null) {
				metres.log?.push(`page ${page + 1}: ${w.lab} seen where no bar of the voice begins, set aside`);
				continue;
			}
			if (!out.has(offset + bar)) out.set(offset + bar, { bar: offset + bar, lab: w.lab, page });
		}
		offset += measures.length;
	});
	return [...out.values()].sort((a, b) => a.bar - b.bar);
}

/**
 * Joins homr-web's MusicXML for each page, in page order, into one
 * MusicXML string holding the voice part only. Throws `JoinPagesError` when
 * a page has no part to take or is not well formed. With `look`, a bar that
 * reads longer than its metre is checked against the page for a printed tuplet number
 * (`triplets.ts`); without it the join reads homr's output alone.
 */
export function joinPages(pages: readonly string[], look?: LookAtPage, metres?: SeenMetres): string {
	if (pages.length === 0) throw new JoinPagesError('no pages');
	const parts = pages.map((p, i) => firstPart(p, i + 1));
	const tacet = pianoAlonePages(pages);
	const build = (stated: ReadonlyMap<number, string>, ends: ReadonlySet<number>) => {
		const state: InForce = { key: null, time: null, clef: null, divisions: null, restoreDivisions: null, homrTime: null, forced: null, lastRule: null };
		const measures: string[] = [];
		const timeBefore: (string | null)[] = [];
		/** Bars the tuplet checks changed from homr's notes alone (rules 1 to 3), with no printed number read. */
		const guessed = new Set<number>();
		parts.forEach((part, pageIndex) => {
			part.measures.forEach((raw, mIndex) => {
				const m = tacet[pageIndex] ? withoutNotes(raw) : raw;
				const dropRestatements = pageIndex > 0 && mIndex === 0;
				const onPage: PageLook | undefined = look
					? (notes) => {
							const at = fillPlaces(notes.map(placeOf));
							if (!at) return null;
							const seen = look(pageIndex, at);
							if (!seen) return null;
							const xs = at.map((p) => p.x);
							return {
								numbers: seen.numbers.map((n) => ({ n: n.n, m: n.m, at: notesAt(xs, n.x) })),
								marksAt: seen.centres.map((c) => notesAt(xs, c)),
							};
						}
					: undefined;
				const n = measures.length;
				const lab = stated.get(n);
				const plan: Plan = lab ? { start: timeElement(lab) } : ends.has(n) && state.forced !== null ? { resume: true } : {};
				timeBefore.push(state.time);
				measures.push(rewriteMeasure(m, n + 1, state, mIndex === 0, dropRestatements, onPage, plan));
				if (state.lastRule !== null && state.lastRule !== 'page') guessed.add(n);
			});
		});
		return { measures, timeBefore, guessed };
	};
	const proposals = metres ? proposalsOf(parts.map((p) => p.measures), metres) : [];
	const ends = new Set(proposals.map((p) => p.bar));
	const stated = new Map<number, string>();
	proposals.forEach((p, i) => {
		const trial = build(new Map([...stated, [p.bar, p.lab]]), ends);
		const bars = barFacts(trial.measures);
		const end = proposals[i + 1]?.bar ?? bars.length;
		const span = Array.from({ length: Math.max(0, end - p.bar) }, (_, k) => p.bar + k);
		const next = proposals[i + 1]?.bar === p.bar + 1 ? proposals[i + 1].lab : null;
		const v = witness(bars, span, p.lab, labelOf(trial.timeBefore[p.bar] ?? null), next, trial.guessed);
		if (v.stated) stated.set(p.bar, p.lab);
		metres?.log?.push(`bar ${p.bar + 1} (page ${p.page + 1}): ${p.lab} ${v.stated ? 'stated' : 'not stated'}: ${v.why}`);
	});
	const { measures } = build(stated, ends);
	dropBarsAfterTheEnd(measures, parts.flatMap((part) => part.measures));
	const scorePart = parts[0].scorePart;
	const id = attr(scorePart, 'id') ?? 'P1';
	return [
		'<?xml version="1.0" encoding="UTF-8" standalone="no"?>',
		'<score-partwise version="4.0">',
		...parts[0].head,
		`<part-list>${scorePart}</part-list>`,
		`<part id="${id}">`,
		...measures,
		'</part>',
		'</score-partwise>',
		'',
	].join('\n');
}
