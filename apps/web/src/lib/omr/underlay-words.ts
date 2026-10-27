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
const HYPHEN_AT_END_RUN = /[-–—‐‑]+$/u;
const HYPHEN_AT_START_RUN = /^[-–—‐‑]+/u;

/** The text of a token without the hyphens that join it to its neighbours. */
function core(text: string): string {
	return text.trim().replace(HYPHENS_AT_ENDS, '');
}

/**
 * Of the seats that share a note, ONE syllable: the note they share, and the
 * texts of all of them joined in the order given (x order), with the hyphens
 * between them taken out. A note sings one syllable, and a letter the reader read inside a word is not dropped: the
 * measured scorer joined the texts of every token on a note. A lone hyphen
 * between two seats on one note is inside the syllable and goes.
 */
function oneToANote(seats: Seat[]): Seat[] {
	const onNote = new Map<number, number[]>();
	seats.forEach((s, i) => {
		if (s.kind !== 'syllable' || s.note === null) return;
		const list = onNote.get(s.note);
		if (list) list.push(i);
		else onNote.set(s.note, [i]);
	});
	const drop = new Set<number>();
	const merged = new Map<number, Seat>();
	for (const at of onNote.values()) {
		if (at.length < 2) continue;
		const first = seats[at[0]].text.trim();
		const last = seats[at[at.length - 1]].text.trim();
		const middle = at.slice(1, -1).map((i) => core(seats[i].text));
		const text = [first.replace(HYPHEN_AT_END_RUN, ''), ...middle, last.replace(HYPHEN_AT_START_RUN, '')].join('');
		merged.set(at[0], { ...seats[at[0]], text });
		for (const i of at.slice(1)) drop.add(i);
		for (let i = at[0] + 1; i < at[at.length - 1]; i++) if (seats[i].kind === 'joint') drop.add(i);
	}
	return seats.flatMap((s, i) => (drop.has(i) ? [] : [merged.get(i) ?? s]));
}

/**
 * The words of seated tokens, in the order given (reading order: a caller
 * with several rows hands them in one after the other, so a hyphen at the end
 * of a row carries the word onto the next).
 *
 * A token ending in a hyphen continues into the next syllable; a token
 * beginning with one continues the last; a lone hyphen joins its neighbours
 * (row 81's `sew`). An extender after a syllable marks it `sustained`. A mark
 * with no letter is dropped. Two tokens on one note become one syllable
 * (`oneToANote`).
 *
 * A syllable token with no note (`unseated`) never loses its letters inside a
 * word. Where the word is open, its text joins the NEXT syllable of the word
 * when the token's hyphen says the word goes on («ны-» then «е» gives «ные»),
 * and the LAST syllable when the word ends at it. Where no word is open and the
 * token ends in a hyphen, it is held and prepended to the next syllable, which
 * then opens the word. Any other unseated token is a whole unseated word and is
 * left out: stage 2b counts those. It is never merged into a neighbouring word.
 */
export function sewWords(seats: Seat[]): Word[] {
	const words: Word[] = [];
	let open: Syllable[] | null = null;
	let glue = false;
	// Unseated text inside the open word, waiting for the next syllable of it.
	let pending = '';
	// An unseated token that began a word of its own: its text, and whether a hyphen carries it on.
	let held: { text: string; goes: boolean } | null = null;
	const flush = () => {
		if (open && pending) open[open.length - 1].text += pending;
		pending = '';
	};
	for (const seat of oneToANote(seats)) {
		if (seat.kind === 'mark') continue;
		if (seat.kind === 'joint') {
			if (held) held.goes = true;
			else if (open) glue = true;
			continue;
		}
		if (seat.kind === 'extender') {
			if (open) open[open.length - 1].sustained = true;
			continue;
		}
		const raw = seat.text.trim();
		const text = core(raw);
		const endsHyphen = HYPHEN_AT_END.test(raw);
		const continues = open !== null && (glue || HYPHEN_AT_START.test(raw));
		if (seat.note === null) {
			if (held) {
				held.text += text;
				held.goes = endsHyphen;
				if (!endsHyphen) held = null;
			} else if (continues && open) {
				if (endsHyphen) pending += text;
				else {
					open[open.length - 1].text += pending + text;
					pending = '';
					glue = false;
				}
			} else if (endsHyphen) {
				flush();
				held = { text, goes: true };
				glue = false;
			}
			continue;
		}
		const syllable: Syllable = { note: seat.note, text: pending + text, syllabic: 'single', sustained: false };
		if (held) {
			// The held token carried the word on; this syllable opens it, with the held text before its own.
			syllable.text = held.text + syllable.text;
			held = null;
			open = [syllable];
			words.push({ syllables: open });
		} else if (continues && open) open.push(syllable);
		else {
			flush();
			open = [syllable];
			words.push({ syllables: open });
		}
		pending = '';
		glue = endsHyphen;
	}
	flush();
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
