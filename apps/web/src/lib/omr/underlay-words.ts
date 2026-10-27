/**
 * The seated tokens as words, and the words as lyrics (N.135, stage 2a).
 *
 * `seatTokens` (`underlay-seat.ts`) says which token sits under which note.
 * `sewWords` joins those tokens into the words the print divides them into,
 * and `writeLyrics` writes them into homr's MusicXML as `<lyric>`, one syllable
 * to a note. A score file whose notes carry `<lyric>` is seated from its own
 * words with no new seating code: the parser finds the lyric part
 * (`packages/score-parser/src/musicxml-parser.ts`, "Vocal-part identification"),
 * and `collectScoreWords` (`score/vowel-resolver.ts`) rebuilds the words from
 * the syllabic roles.
 *
 * The print's own words, as printed. `writeLyrics` does not modernize
 * (review amendment 5): «читъ!» is written «читъ!» and «гѣ» is written «гѣ».
 * Modernizing is the pipeline's job, where the dictionary disposes
 * (`pipeline.ts`, `modernisePreReform` adopted only when the modern form is a
 * word Ilya knows), and `CYRILLIC_VOWEL` already counts ѣ, і, and ѵ.
 *
 * Pure. No DOM; the XML is edited as text so that every byte that is not an
 * inserted `<lyric>` stays as it was.
 */
import type { Seat } from './underlay-seat';

export type Syllabic = 'single' | 'begin' | 'middle' | 'end';

/** One syllable of a word, on one note. */
export interface Syllable {
	/** The note the syllable is sung on: see `writeLyrics`. */
	note: number;
	/** The syllable as read, with the print's own punctuation, and without the hyphen that joined it to its neighbour. */
	text: string;
	syllabic: Syllabic;
	/** An extender follows the syllable: the print sustains it. Not written to the lyric. */
	sustained: boolean;
}

export interface Word {
	syllables: Syllable[];
}

const HYPHEN_AT_START = /^[-–—‐‑]/u;
const HYPHEN_AT_END = /[-–—‐‑]$/u;
const HYPHENS_AT_ENDS = /^[-–—‐‑]+|[-–—‐‑]+$/gu;

/**
 * Of the seats that share a note, the one whose token centre is nearest the
 * note's head stays; the first on a tie. A note sings one syllable.
 */
function oneToANote(seats: Seat[]): Seat[] {
	const kept = new Map<number, Seat>();
	for (const s of seats) {
		if (s.kind !== 'syllable' || s.note === null) continue;
		const held = kept.get(s.note);
		if (!held || Math.abs(s.offset ?? 0) < Math.abs(held.offset ?? 0)) kept.set(s.note, s);
	}
	return seats.filter((s) => s.kind !== 'syllable' || s.note === null || kept.get(s.note) === s);
}

/**
 * The words of seated tokens, in the order given (reading order: a caller
 * with several rows hands them in one after the other, so a hyphen at the end
 * of a row carries the word onto the next).
 *
 * A token ending in a hyphen continues into the next syllable; a token
 * beginning with one continues the last; a lone hyphen joins its neighbours
 * (row 81's `sew`). An extender after a syllable marks it `sustained`. A mark
 * with no letter is dropped. A syllable token with no note is dropped. Two
 * tokens on one note: the nearer one stays.
 */
export function sewWords(seats: Seat[]): Word[] {
	const words: Word[] = [];
	let open: Syllable[] | null = null;
	let glue = false;
	for (const seat of oneToANote(seats)) {
		if (seat.kind === 'mark') continue;
		if (seat.kind === 'joint') {
			if (open) glue = true;
			continue;
		}
		if (seat.kind === 'extender') {
			if (open) open[open.length - 1].sustained = true;
			continue;
		}
		if (seat.note === null) continue;
		const raw = seat.text.trim();
		const syllable: Syllable = {
			note: seat.note,
			text: raw.replace(HYPHENS_AT_ENDS, ''),
			syllabic: 'single',
			sustained: false,
		};
		if (open && (glue || HYPHEN_AT_START.test(raw))) open.push(syllable);
		else {
			open = [syllable];
			words.push({ syllables: open });
		}
		glue = HYPHEN_AT_END.test(raw);
	}
	for (const word of words) {
		const n = word.syllables.length;
		word.syllables.forEach((s, i) => {
			s.syllabic = n === 1 ? 'single' : i === 0 ? 'begin' : i === n - 1 ? 'end' : 'middle';
		});
	}
	return words;
}

const PART = /<part(?=[\s>])[^>]*>/;
const NOTE = /<note(?=[\s>])[^>]*>/g;
const REST = /<rest[\s/>]/;
const HAS_LYRIC = /<lyric[\s>]/;

function escapeText(text: string): string {
	return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** The `<lyric>` for one syllable, laid out as the note it goes into is, or compact where the note is. */
function lyricFor(body: string, s: Syllable): { at: number; text: string } {
	const syllabic = `<syllabic>${s.syllabic}</syllabic>`;
	const text = `<text>${escapeText(s.text)}</text>`;
	const tail = /(\r?\n)([ \t]*)$/.exec(body);
	if (!tail) return { at: body.length, text: `<lyric number="1">${syllabic}${text}</lyric>` };
	const [, eol, closeIndent] = tail;
	const first = /^<note[^>]*>\r?\n([ \t]*)</.exec(body);
	const child = first ? first[1] : closeIndent + '  ';
	const step = child.startsWith(closeIndent) && child.length > closeIndent.length ? child.slice(closeIndent.length) : '  ';
	const lines = [`<lyric number="1">`, `${step}${syllabic}`, `${step}${text}`, `</lyric>`];
	return { at: body.length - closeIndent.length, text: lines.map((l) => child + l + eol).join('') };
}

/**
 * Adds `<lyric number="1">` with `<syllabic>` and `<text>` to the notes the
 * words are seated on, and changes nothing else: the result with those
 * `<lyric>` blocks taken out is the input, byte for byte.
 *
 * A syllable's `note` is the ordinal, from 0, of a `<note>` element among the
 * notes of the first `<part>` in document order, rests counted. The first part
 * is the voice: homr writes it first, and the parser takes it as the vocal line
 * where no part carries lyrics. A syllable whose note is a rest, already holds
 * a lyric, or is not in the part is left unwritten; so is a second syllable for
 * a note that already has one from this call.
 */
export function writeLyrics(musicXml: string, words: Word[]): string {
	const byNote = new Map<number, Syllable>();
	for (const word of words) for (const s of word.syllables) if (!byNote.has(s.note)) byNote.set(s.note, s);
	const part = PART.exec(musicXml);
	if (byNote.size === 0 || !part) return musicXml;

	const partEnd = musicXml.indexOf('</part>', part.index);
	const stop = partEnd < 0 ? musicXml.length : partEnd;
	let out = '';
	let copied = 0;
	let ordinal = 0;
	NOTE.lastIndex = part.index + part[0].length;
	for (let m = NOTE.exec(musicXml); m && m.index < stop; m = NOTE.exec(musicXml)) {
		const sung = byNote.get(ordinal++);
		if (m[0].endsWith('/>')) continue;
		const close = musicXml.indexOf('</note>', m.index);
		if (close < 0 || close > stop) break;
		NOTE.lastIndex = close;
		const body = musicXml.slice(m.index, close);
		if (!sung || REST.test(body) || HAS_LYRIC.test(body)) continue;
		const lyric = lyricFor(body, sung);
		out += musicXml.slice(copied, m.index + lyric.at) + lyric.text;
		copied = m.index + lyric.at;
	}
	return out + musicXml.slice(copied);
}
