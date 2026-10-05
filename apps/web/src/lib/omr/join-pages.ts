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
 *   and tuplets stay as homr wrote them. With model 465 that text holds
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
 *
 * It works on the text of homr's output, not on a DOM, so it runs the same in
 * the browser and in vitest (which has no `DOMParser`). It reads elements,
 * attributes, self-closing tags, comments, and processing instructions, which
 * is everything homr-web's serializer (`src/musicxml/xml.ts` in homr-web)
 * writes. It does not read CDATA sections.
 */

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
}

/**
 * Rewrites one measure: its number, the first staff only, and (on the first
 * measure of a later page) no restatement of what is already in force.
 * Updates `state` with what the measure states.
 */
function rewriteMeasure(measure: string, number: number, state: InForce, firstOfPage: boolean, dropRestatements: boolean): string {
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
	const open = span.open.replace(/\snumber="[^"]*"/, ` number="${number}"`);
	return `${open}${(silent(kept) ? kept.filter((t) => !TIMED.test(t)) : kept).join('')}</measure>`;
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
		if (k.name === 'time' && dropTime) continue;
		if (k.name === 'clef') {
			const n = attr(k.open, 'number');
			if (n !== null && n !== '1') continue;
			const value = squash(inner(body, k));
			if (dropRestatements && value === state.clef) continue;
			state.clef = value;
			out.push(text);
			continue;
		}
		if (k.name === 'key' || k.name === 'time') {
			const value = squash(inner(body, k));
			if (dropRestatements && value === state[k.name]) continue;
			state[k.name] = value;
			out.push(text);
			continue;
		}
		out.push(text);
	}
	return out.length === 0 ? null : out.join('');
}

/**
 * Joins homr-web's MusicXML for each page, in page order, into one
 * MusicXML string holding the voice part only. Throws `JoinPagesError` when
 * a page has no part to take or is not well formed.
 */
export function joinPages(pages: readonly string[]): string {
	if (pages.length === 0) throw new JoinPagesError('no pages');
	const parts = pages.map((p, i) => firstPart(p, i + 1));
	const state: InForce = { key: null, time: null, clef: null };
	const measures: string[] = [];
	parts.forEach((part, pageIndex) => {
		part.measures.forEach((m, mIndex) => {
			const dropRestatements = pageIndex > 0 && mIndex === 0;
			measures.push(rewriteMeasure(m, measures.length + 1, state, mIndex === 0, dropRestatements));
		});
	});
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
