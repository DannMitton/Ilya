/**
 * The print's extender line, carried with the reading (row 181, step 1; Fable's review amendment 1).
 *
 * A scan's reader can see the line a printed syllable is sustained on (`underlay-extender.ts`). A kept reading holds only
 * homr's joined MusicXML (`stamp.ts`), and a reopened scan is ingested again from that text (`restore.ts`), so the fact has
 * to be in the text or it is lost on the second opening of the song. Then every note under the line would be an open, blank,
 * non-continuation note on the typed path, which the join would fill (CONTRACT.md §0.1: that is a wrong syllable on a
 * melisma note).
 *
 * THE CONVENTION. `writeLyrics` (`underlay-words.ts`) writes `<extend type="start"/>` inside the `<lyric>` of a syllable
 * the print sustains (standard MusicXML). `markExtenders` adds one `<miscellaneous-field name="ilya-extenders">` to the
 * file's `<identification>`, beside the unread bars (`unread-bars.ts`, the same slot), so that an authored score's own
 * `<extend>` elements are not read by this convention: only a file Ilya made carries the field. `extenderMelismaIds` then
 * names the sung notes the line sustains, for the ingestion to turn into `{ kind: 'melisma' }` pairings
 * (`ingestion/ingest.ts`, `withExtenders`). The writer and the reader are two halves of one convention, kept together.
 *
 * The score parser reads no `<extend>` and no `<miscellaneous>` (grep of `packages/score-parser/src/musicxml-parser.ts`:
 * no hit). The cleaner path, reading `<extend>` in the parser, is a package change and is not taken here; this one is a
 * type-only addition (`ParseWarning.eventIds`, the `extender-notes` code), and the desk may ask for the parser path.
 *
 * Notes are matched to the parsed events bar by bar, as `notePositions` does (`score/old-reader-seats.ts`): a bar is read
 * only where its `<note>` elements (grace and chord notes left out) line up one for one with the parsed events of that bar,
 * and holds no `<backup>` or `<forward>`. A bar that does not line up marks nothing and is counted, so the loss is reported
 * and never silent.
 *
 * Pure.
 */
import { setMiscField } from './unread-bars';

/** The `name` of the `<miscellaneous-field>` that says this file's `<extend>` elements are Ilya's. */
export const EXTEND_FIELD = 'ilya-extenders';

const LYRIC_EXTEND = /<lyric[\s>][\s\S]*?<extend\b[^>]*\btype="(?:start|continue)"[^>]*\/?>[\s\S]*?<\/lyric>/;
const FIELD_PRESENT = new RegExp(`<miscellaneous-field\\s+name="${EXTEND_FIELD}"\\s*>`);

/** True where the file says its `<extend>` elements are Ilya's (`markExtenders` wrote the field). */
export function hasExtenders(xml: string): boolean {
	return xml.includes(EXTEND_FIELD) && FIELD_PRESENT.test(xml);
}

/** The MusicXML with the field added when it holds an `<extend>` inside a `<lyric>`; the text as it was otherwise. */
export function markExtenders(xml: string): string {
	return LYRIC_EXTEND.test(xml) ? setMiscField(xml, EXTEND_FIELD, '1') : xml;
}

/** The parsed event, as far as this reads it; any `VocalLineEvent` satisfies it. */
export interface ExtenderEvent {
	id: string;
	type: 'note' | 'rest';
	measureIndex: number;
	tied?: { type: 'start' | 'continue' | 'stop' | 'let-ring' };
}

export interface ExtenderMelismas {
	/** The sung notes a printed extender sustains, in song order. */
	ids: string[];
	/** Bars that hold an `<extend>` and could not be lined up with the parsed events: their notes are not marked. */
	unaligned: number;
}

const NONE: ExtenderMelismas = { ids: [], unaligned: 0 };

/**
 * The sung notes the file's extenders sustain: every note after a note whose `<lyric>` carries `<extend>`, up to the next
 * note that carries a lyric, and not across a rest (a melisma cannot cross one: `vowel-resolver.ts`, `sustain = null` at a
 * rest). A note tied into the one before it is a continuation already (`syllableTargetIds`) and is left out. Empty where the
 * file does not carry the field, so that an authored score is not read.
 */
export function extenderMelismaIds(xml: string, events: readonly ExtenderEvent[]): ExtenderMelismas {
	if (!hasExtenders(xml)) return NONE;
	const part = (xml.match(/<part\s[^>]*>[\s\S]*?<\/part>/g) ?? [])[0];
	if (part === undefined) return NONE;
	const measures = part.match(/<measure\b[^>]*\/>|<measure\b[^>]*>[\s\S]*?<\/measure>/g) ?? [];
	const byBar = new Map<number, ExtenderEvent[]>();
	for (const ev of events) {
		const list = byBar.get(ev.measureIndex);
		if (list) list.push(ev);
		else byBar.set(ev.measureIndex, [ev]);
	}
	const ids: string[] = [];
	let unaligned = 0;
	let sustaining = false;
	measures.forEach((measure, bar) => {
		const evs = byBar.get(bar) ?? [];
		const notes = (measure.match(/<note\b[\s\S]*?<\/note>|<note\b[^>]*\/>/g) ?? []).filter((n) => !/<(?:grace|chord)\b/.test(n));
		const lined = !/<(?:backup|forward)\b/.test(measure) && notes.length === evs.length;
		if (!lined) {
			if (/<extend\b/.test(measure) || sustaining) unaligned++;
			sustaining = false;
			return;
		}
		notes.forEach((note, i) => {
			const ev = evs[i];
			if (!ev || /<rest[\s/>]/.test(note) || ev.type === 'rest') {
				sustaining = false;
				return;
			}
			if (/<lyric[\s>]/.test(note)) {
				sustaining = /<extend\b[^>]*\btype="(?:start|continue)"/.test(note);
				return;
			}
			const tiedInto = ev.tied?.type === 'stop' || ev.tied?.type === 'continue';
			if (sustaining && !tiedInto) ids.push(ev.id);
		});
	});
	return { ids, unaligned };
}
