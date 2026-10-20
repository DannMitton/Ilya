/**
 * What a MusicXML `<note>` prints in its `<notations>` (N.188): fermatas, the
 * articulation marks, and the slur ends, plus the pass that pairs the slur ends
 * over the whole vocal line.
 *
 * MOVED OUT OF `musicxml-parser.ts` (the articulation map and the notations
 * block) to make room under that file's ratchet ceiling without raising it.
 *
 * The reader (`XmlEl`) is the parser's own structural interface, restated here
 * because the parser keeps it module-private. Anything a W3C DOM Element or the
 * test mini-DOM satisfies satisfies this.
 */
import type { Articulation, FermataInfo, ParseWarning, SlurEnd, VocalLineEvent } from './types';

interface XmlEl {
	readonly tagName: string;
	getAttribute(name: string): string | null;
	readonly children: ArrayLike<XmlEl>;
	readonly textContent: string | null;
}

const kids = (el: XmlEl): XmlEl[] => Array.from(el.children);
const directChildren = (el: XmlEl, tag: string): XmlEl[] => kids(el).filter((c) => c.tagName === tag);

// ── Articulations (MusicXML uses the same hyphenated names) ─────────

const MARKING_TO_ARTICULATION: Record<string, Articulation> = {
	accent: 'accent',
	'strong-accent': 'strong-accent',
	staccato: 'staccato',
	tenuto: 'tenuto',
	'detached-legato': 'detached-legato',
	staccatissimo: 'staccatissimo',
	'breath-mark': 'breath-mark',
	caesura: 'caesura',
	stress: 'stress',
	unstress: 'unstress',
};

const FERMATA_SHAPES: ReadonlySet<string> = new Set(['normal', 'angled', 'square', 'double-angled', 'double-square']);

/** What one note's `<notations>` blocks carry. */
export interface NoteNotations {
	fermata?: FermataInfo;
	articulations?: Articulation[];
	/** Slur ends in document order; `partnerEventId` is filled later by `pairSlurs`. */
	slurs?: SlurEnd[];
	/** Articulation tags the parser does not map, for the caller's one-time warning. */
	unsupported: string[];
}

/**
 * The slur ends of one `<note>`, in document order. A `continue` is not an end
 * and is skipped; a missing `number` is slur 1, as MusicXML defines it.
 */
export function readSlurEnds(note: XmlEl): SlurEnd[] {
	const out: SlurEnd[] = [];
	for (const notations of directChildren(note, 'notations')) {
		for (const slur of directChildren(notations, 'slur')) {
			const type = slur.getAttribute('type');
			if (type !== 'start' && type !== 'stop') continue;
			const rawNumber = parseInt(slur.getAttribute('number') ?? '', 10);
			const placement = slur.getAttribute('placement');
			out.push({
				type,
				number: Number.isFinite(rawNumber) ? rawNumber : 1,
				...(placement === 'above' || placement === 'below' ? { placement } : {}),
			});
		}
	}
	return out;
}

/**
 * Fermata, articulations, and slur ends from a note's `<notations>` blocks.
 *
 * A FERMATA ON A REST IS KEPT (N.188): it used to be read on notes only. An
 * inverted fermata (`type="inverted"`) fills `FermataInfo.placement` with
 * `'below'`; an upright one is the default and leaves it unset, so a fermata
 * without a shape or an inversion is still the bare `{}` it has always been.
 *
 * SLUR ENDS ARE NEVER KEPT ON A REST: the caller drops them with a warning.
 */
export function readNoteNotations(note: XmlEl): NoteNotations {
	const out: NoteNotations = { unsupported: [] };
	for (const notations of directChildren(note, 'notations')) {
		const fermata = directChildren(notations, 'fermata')[0];
		if (fermata && !out.fermata) {
			const shape = (fermata.textContent ?? '').trim();
			out.fermata = {
				...(FERMATA_SHAPES.has(shape) ? { shape: shape as NonNullable<FermataInfo['shape']> } : {}),
				...(fermata.getAttribute('type') === 'inverted' ? { placement: 'below' as const } : {}),
			};
		}
		const artBlock = directChildren(notations, 'articulations')[0];
		if (artBlock) {
			for (const art of kids(artBlock)) {
				const mapped = MARKING_TO_ARTICULATION[art.tagName];
				if (mapped) (out.articulations ??= []).push(mapped);
				else out.unsupported.push(art.tagName);
			}
		}
	}
	const slurs = readSlurEnds(note);
	if (slurs.length > 0) out.slurs = slurs;
	return out;
}

/**
 * Pair the slur ends over the WHOLE vocal line, after the tie pass, and store
 * each end's partner on it (`SlurEnd.partnerEventId`). Returns whether any slur
 * found its partner, which is `ParsedScore.carriesPrintedSlurs`.
 *
 * WHY THE PARSER AND NOT THE RENDERER. Every system is rendered from a slice
 * holding its own measures only, so a slur that crosses a system break has one
 * end in each of two renders. Only a pass over the whole line can say whether
 * the other end exists.
 *
 * THE POLICY, for reader output that is not tidy (homr writes the staff as the
 * slur `number`, so every voice slur arrives as number 1):
 *  - a start of a number already open ABANDONS the open one (one warning) and
 *    opens the new; the abandoned end stays on its event, unpaired;
 *  - a stop with nothing open is dropped from pairing (one warning);
 *  - a slur whose two ends land on one note is left unpaired and draws nothing,
 *    with no warning: it is what a grace-note slur becomes once the parser has
 *    moved its ends onto the one kept note (A.2a);
 *  - a start never closed is left unpaired (one warning).
 * The ends stay on the events either way, so the data says what was printed
 * and the renderer draws only the paired ones.
 */
export function pairSlurs(vocalLine: readonly VocalLineEvent[], warnings: ParseWarning[]): boolean {
	const open = new Map<number, { end: SlurEnd; ev: VocalLineEvent }>();
	let paired = false;
	const warn = (message: string, ev: VocalLineEvent): void => {
		warnings.push({ code: 'slur-ends-unpaired', message, location: { measureIndex: ev.measureIndex, eventId: ev.id } });
	};
	for (const ev of vocalLine) {
		if (!ev.slurs) continue;
		for (const end of ev.slurs) {
			const was = open.get(end.number);
			if (end.type === 'start') {
				if (was) warn(`Slur ${end.number} starts again before it stopped; the earlier start is abandoned.`, ev);
				open.set(end.number, { end, ev });
				continue;
			}
			if (!was) {
				warn(`Slur ${end.number} stops with no start open; the stop is dropped.`, ev);
				continue;
			}
			open.delete(end.number);
			if (was.ev === ev) continue; // both ends on one note: nothing to draw
			was.end.partnerEventId = ev.id;
			end.partnerEventId = was.ev.id;
			paired = true;
		}
	}
	for (const { end, ev } of open.values()) warn(`Slur ${end.number} starts and never stops; the start is left unpaired.`, ev);
	return paired;
}
