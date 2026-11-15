/**
 * Grace notes (N.187). A grace note is a sung pitch that takes no time: drawn,
 * left out of every bar's sum, and kept in its own list on the score
 * (`ParsedScore.graceNotes`), never in `vocalLine`.
 *
 * WHY A LIST OF ITS OWN. About forty-five sites iterate `vocalLine`, and most of
 * them sum durations, count notes, or seat syllables. A grace note in that list
 * would have to be filtered out of each. Kept apart, every one of them is
 * unchanged by construction, every saved song's corrections, pairings, bar
 * answers, and library fingerprint still land after a re-parse (the ids of the
 * read notes do not move), and the renderer, transposition, Corrections, the
 * Loupe, and the one INSIGHTS range read name the new list explicitly.
 *
 * KEYED BY ITS PRINCIPAL NOTE ALONE. A grace note stores no measure index: its
 * bar is its principal's, so a re-bar that moves the principal moves the grace
 * note with it and nothing stored goes stale.
 *
 * THE PARSER'S PART lives here so `musicxml-parser.ts`, which is at its ceiling,
 * pays for it: `keepGrace` reads one `<note>` that carries `<grace/>`, and
 * `resolveGraces` gives each its principal once the whole line is read.
 */
import type { NoteBase, ParsedScore, ParseWarning, Pitch, SlurEnd, VocalLineEvent } from './types';
import { readSlurEnds } from './notations';

/** One grace note. */
export interface GraceNote {
	/**
	 * Its principal's id plus `~g` and its order in the group (`m17-1-2~g1`,
	 * `~g2`), so it never equals its principal's id and is stable across
	 * re-parses. An after-grace is the last note's id plus `~a` and its order
	 * (`m17-1-2~a1`). A supplied `<note id>` on a grace note is never honoured.
	 */
	id: string;
	/** The kept note the grace note sits against: the one it precedes, or, with `after`, the one it follows. */
	principalId: string;
	/** True for an after-grace: drawn after its principal, at the end of the bar. */
	after?: true;
	pitch: Pitch;
	/** From `<type>`; a grace note has no duration of its own. */
	base: NoteBase;
	/**
	 * The stroke through a lone grace note's flag, from `slash="yes"`. `false`
	 * from `slash="no"`. Undefined where the file does not say: a scan writes a
	 * bare `<grace/>`, so the renderer decides (a lone, flagged grace note in a
	 * file read by the scan reader draws slashed; in any other file, undefined
	 * draws unslashed, as MusicXML defines it).
	 */
	slash?: boolean;
	/** A slur starts on the grace note. The slur itself is carried onto the next kept note, as before. */
	slurred?: true;
}

/** What `keepGrace` reads off one `<note>`, before the line is complete and a principal can be named. */
export interface RawGrace {
	measureIndex: number;
	/** `vocalLine.length` when the grace note was met: the index of the first event read after it. */
	at: number;
	pitch: Pitch;
	base: NoteBase;
	slash?: boolean;
	slurred?: true;
}

interface XmlEl {
	readonly tagName: string;
	getAttribute(name: string): string | null;
	readonly children: ArrayLike<XmlEl>;
	readonly textContent: string | null;
}
const child = (el: XmlEl, tag: string): XmlEl | undefined => Array.from(el.children).find((c) => c.tagName === tag);
const text = (el: XmlEl, tag: string): string => child(el, tag)?.textContent?.trim() ?? '';

const BASES: ReadonlySet<string> = new Set(['128th', '64th', '32nd', '16th', 'eighth', 'quarter', 'half', 'whole', 'breve']);
const STEPS: ReadonlySet<string> = new Set(['C', 'D', 'E', 'F', 'G', 'A', 'B']);

/**
 * A `<note>` that carries `<grace/>`. Returns nothing to the cursor: it must not
 * advance, so the bar-duration warning stays right. The grace note's slur ends
 * are carried onto the kept notes either side exactly as N.188 A.2a has always
 * done (a start goes to `slurCarry` for the next kept note, a stop to the last
 * kept note before it), so `vocalLine` and `pairSlurs` see what they saw; the
 * grace note additionally records `slurred` where a slur starts on it.
 */
export function keepGrace(
	note: XmlEl,
	measureIndex: number,
	ctx: { vocalLine: VocalLineEvent[]; warnings: ParseWarning[]; slurCarry: SlurEnd[]; graces: RawGrace[] },
): void {
	const ends = readSlurEnds(note);
	for (const end of ends) {
		if (end.type === 'start') ctx.slurCarry.push(end);
		else {
			const prev = [...ctx.vocalLine].reverse().find((e) => e.type === 'note');
			if (prev) (prev.slurs ??= []).push(end);
		}
	}
	const pitchEl = child(note, 'pitch');
	const step = pitchEl ? text(pitchEl, 'step') : '';
	const octave = pitchEl ? parseInt(text(pitchEl, 'octave'), 10) : NaN;
	if (!pitchEl || !STEPS.has(step) || !Number.isFinite(octave)) {
		ctx.warnings.push({ code: 'unrecognised-element', message: 'Grace note without a readable <pitch>; dropped.', location: { measureIndex } });
		return;
	}
	const alter = parseInt(text(pitchEl, 'alter'), 10);
	const typeText = text(note, 'type');
	const slash = child(note, 'grace')?.getAttribute('slash');
	ctx.graces.push({
		measureIndex,
		at: ctx.vocalLine.length,
		pitch: { step: step as Pitch['step'], octave, alter: Number.isFinite(alter) ? alter : 0 },
		base: BASES.has(typeText) ? (typeText as NoteBase) : 'eighth',
		...(slash === 'yes' ? { slash: true } : slash === 'no' ? { slash: false } : {}),
		...(ends.some((e) => e.type === 'start') ? { slurred: true as const } : {}),
	});
}

/**
 * Give each raw grace note its principal and its id. The principal is the next
 * kept note (not a rest) in the same measure. With none, the grace note is an
 * after-grace of the last kept note in the measure. With no kept note in the
 * measure, it takes the next note in the line; with none, the last note before
 * it; with no note at all, it is dropped with a warning.
 */
export function resolveGraces(raw: readonly RawGrace[], line: readonly VocalLineEvent[], warnings: ParseWarning[]): GraceNote[] {
	const out: GraceNote[] = [];
	const nextOrder = new Map<string, number>();
	for (const g of raw) {
		let principal: VocalLineEvent | undefined;
		let after = false;
		for (let i = g.at; i < line.length; i++) {
			if (line[i].measureIndex !== g.measureIndex) break;
			if (line[i].type === 'note') { principal = line[i]; break; }
		}
		if (!principal) {
			for (let i = Math.min(g.at, line.length) - 1; i >= 0; i--) {
				if (line[i].measureIndex !== g.measureIndex) break;
				if (line[i].type === 'note') { principal = line[i]; after = true; break; }
			}
		}
		if (!principal) principal = line.slice(g.at).find((e) => e.type === 'note');
		if (!principal) {
			principal = line.slice(0, g.at).reverse().find((e) => e.type === 'note');
			after = principal !== undefined;
		}
		if (!principal) {
			warnings.push({ code: 'unrecognised-element', message: 'grace note dropped (no note in the vocal line to hang it on).', location: { measureIndex: g.measureIndex } });
			continue;
		}
		const key = `${principal.id}${after ? '~a' : '~g'}`;
		const order = (nextOrder.get(key) ?? 0) + 1;
		nextOrder.set(key, order);
		out.push({
			id: `${key}${order}`,
			principalId: principal.id,
			...(after ? { after: true as const } : {}),
			pitch: g.pitch,
			base: g.base,
			...(g.slash !== undefined ? { slash: g.slash } : {}),
			...(g.slurred ? { slurred: true as const } : {}),
		});
	}
	return out;
}

/** The grace notes whose principal stands in measures `from` to `to`: a slice keeps a grace note when its principal is in it. */
export function keepGraceNotes(parsed: ParsedScore, from: number, to: number): GraceNote[] {
	const inSlice = new Set(parsed.vocalLine.filter((e) => e.measureIndex >= from && e.measureIndex <= to).map((e) => e.id));
	return (parsed.graceNotes ?? []).filter((g) => inSlice.has(g.principalId));
}

/** The `graceNotes` field of a parsed score, or nothing where the file has none (so a file with no grace note is unchanged). */
export function graceField(raw: readonly RawGrace[], line: readonly VocalLineEvent[], warnings: ParseWarning[]): { graceNotes?: GraceNote[] } {
	const notes = raw.length ? resolveGraces(raw, line, warnings) : [];
	return notes.length ? { graceNotes: notes } : {};
}
