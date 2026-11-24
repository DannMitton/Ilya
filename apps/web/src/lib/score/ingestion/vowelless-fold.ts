/**
 * ONE TEST DECIDES EVERY NOTE, on arrival (`CONTRACT.md` §0.1, Dann 2026-10-29 01:18 and 2026-11-02 13:46; N.135 step 4,
 * writer 3; rebuilt by cloud-lane-88, item 2 of the arrival seam, from the rule Dann derived with the desk 2026-11-24
 * 03:15 to 03:19).
 *
 * A SYLLABLE IS A VOWEL WITH THE CONSONANTS ATTACHED TO IT. NOTHING ELSE IS A SYLLABLE. A token between spaces or hyphens
 * in a `<lyric>` is whatever the engraver typed; one vowel nucleus is what makes it a syllable. Count the vowel letters in
 * the text under a note, on NFC (a «й» written as two code points would count one vowel too many):
 *
 * - NONE: a fragment. It fuses to its neighbour by direction (below). Fusing gives a note back.
 * - ONE: a syllable. It takes its note.
 * - TWO OR MORE: that many adjacent syllables on one note. The division falls between the nuclei and the later syllables
 *   take the following notes, cascading. Dividing asks for a note.
 *
 * This is safe because sung Russian has no true polyvowel diphthong, only vowel plus glide, and the glide is a consonant
 * («й» is not a vowel letter: `vowel-resolver.ts`, `CYRILLIC_VOWEL`).
 *
 * THE REPAIR IS A RE-DEAL, per Cyrillic verse, on the `ParsedScore`. The notes that held text keep their places; the tokens
 * are fused and divided; the syllables are dealt back in order onto those notes; what is left at either end is COUNTED, never
 * covered. Ilya invents no syllable and no melisma to cover it. A fusion and a later division cancel by themselves. Nothing
 * here imports `$lib/pipeline`.
 *
 * DIRECTION (the cell's syllabic type is read, not only the clitic table):
 * - a fragment marked `start` or `middle` fuses FORWARD, within its own word, with no joiner;
 * - a fragment marked `end` fuses BACKWARD, with no joiner («знь» onto «жи»: the note sings «жизнь»);
 * - a vowelless `whole` that the clitic table calls a proclitic fuses FORWARD («в» onto «бью»), joined by U+00A0;
 * - any other vowelless `whole` fuses BACKWARD, as before, joined by U+00A0;
 * - THE OLD-SPELLING LETTER MAP IS ASKED FIRST (`modernisePreReform`), so «въ» is read as «в» and is not thrown backward.
 *   MEASURED 2026-11-24 in this lane: the clitic table does not know «въ», and the pipeline does not mark «въ» a clitic
 *   (`processText('въ мир тебя')`: isVowellessClitic false on «въ»).
 *
 * EVERY MOVED TEXT CARRIES ITS SYLLABIC TYPE. A close-up moves every later cell, and a cell that loses its type loses its
 * hyphen on the page. A fused unit's type is computed from the two ends it joins (it begins a word if its first part does,
 * ends one if its last part does); a divided token's pieces begin and end the word only at the token's own ends.
 *
 * THE DIVISION IS A NAMED CALL: `GraysonEngine.syllabify`. It counts ten vowel letters where this test counts thirteen, so on
 * «тѣни» it finds one nucleus where the test finds two. Its pieces must rejoin to the token character for character, in the
 * token's own case and with the token's punctuation put back on its ends, and must number exactly the vowels counted, one
 * vowel to a piece. Where they do not, NOTHING IS DIVIDED: the token keeps its one note and the place is counted
 * (`undivided`). No hand-rolled phonological predicate (`CONTRACT.md` §8).
 *
 * DESK DEFAULTS, each marked, none Dann's yet:
 * - a token that holds an elision (U+203F) is the print's own mark for two syllables on one note; it is one unit and is not
 *   divided;
 * - a token with no Cyrillic letter (a mark alone: the `#` fold's, or a bare punctuation sign; or a Latin letter in a Cyrillic
 *   verse) is neither a syllable nor a fragment: it stays on its own note, is not dealt, and is counted (`pinned`, round 2 fixes 2
 *   and 3);
 * - a token of two vowels or more that is not one run of letters (a space, a hyphen, or a no-break space inside it) is not
 *   divided and is counted (`undivided`, why `shape`: the named call is never asked); where the call is asked and its pieces do
 *   not serve, why is `engine`.
 *
 * WHERE THE TEXT GOES. The fused unit takes the host's own note (forward: the clitic's own note, so the tail closes up and the
 * page matches the print; backward: the fragment's own note, and the tail closes up onto it). A note left with no syllable at
 * the end of the run is the LEFTOVER (`vacated`). A syllable the cascade pushes past the last note that held text, and a
 * fragment with no host in the verse, leave the notes and go into the record with their event (`overflow`, `orphans`): never
 * dropped in silence, never seated somewhere to be rid of it. `ingest.ts` writes the record (item 4).
 *
 * Only a verse that holds a Cyrillic letter is dealt: an IPA verse is Latin letters, none of them a Cyrillic vowel, and
 * counting them would make every one a fragment. The `#` fold stays `foldDictionMarks`' work and is not touched here.
 * The verse is the run of entries of one verse number, in event order. The file says nothing of lines, so a clitic at a
 * verse's end finds no host and is recorded rather than reaching across.
 *
 * Pure and non-destructive: the input is never mutated, and a score with nothing to repair comes back BY REFERENCE.
 */
import { GraysonEngine } from '@ilya/phonology';
import { modernisePreReform } from '@ilya/dictionary';
import type { ParsedScore, SyllableInfo, VocalLineEvent } from '@ilya/score-parser';
import { VOWEL as CYRILLIC_VOWEL } from '$lib/omr/underlay-units';
import { evidenceFor, scopeOf, type Evidence } from './melisma-evidence';

const NBSP = ' ';
const ELISION = '‿';
const LETTERS = /\p{L}/gu;
const CYRILLIC = /[Ѐ-ӿ]/u;
const VOWELS = new RegExp(CYRILLIC_VOWEL.source, 'giu');
const LETTER_RUN = /^[\p{L}\p{M}]+$/u;
const EDGES = /^([^\p{L}\p{M}]*)([\p{L}\p{M}\s \-‐‑]*[\p{L}\p{M}])([^\p{L}\p{M}]*)$/u;

type Type = SyllableInfo['type'];

/** The vowel letters in a text, counted on NFC. */
export const vowelCount = (text: string): number => (text.normalize('NFC').match(VOWELS) ?? []).length;

const hasLetter = (text: string): boolean => /\p{L}/u.test(text);

export interface Place {
	eventId: string;
	verse: number;
	text: string;
	/** Why the place is counted, where more than one reason is possible. */
	why?: 'engine' | 'shape' | 'mark' | 'foreign';
}

/** What the re-deal did and left over in one Cyrillic verse. */
export interface VerseRedeal {
	verse: number;
	/** Notes that held text in this verse before the deal. */
	held: number;
	/** Syllables after fusing and dividing. */
	syllables: number;
	/** Fragments joined to a host. */
	folded: number;
	/** Tokens divided into their syllables. */
	divided: number;
	/** Notes at the end of the run left with no syllable: the leftover, to be recorded so the resolver abstains. */
	vacated: Place[];
	/** Syllables pushed past the last note that held text: they leave the notes. */
	overflow: Place[];
	/** Fragments with no host in the verse: they leave the notes. */
	orphans: Place[];
	/** Tokens of two vowels or more that were not divided, and keep one note: `engine` where the named call could not divide them, `shape` where it was never asked (not one run of letters). */
	undivided: Place[];
	/** Tokens left on their own note, not dealt and not syllables: a mark alone, or a token with no Cyrillic letter. Counted. */
	pinned: Place[];
	/** The evidence this verse's deal read: its scope, the slur gate, and the notes the print holds. */
	evidence: Evidence;
}

export interface VowellessFold {
	score: ParsedScore;
	/** Fragments joined to a host, over the score. */
	folded: number;
	/** Text with no note to go to (`orphans` and `overflow`), over the score. */
	undrawn: number;
	/** One entry for each Cyrillic verse the deal ran on. */
	verses: VerseRedeal[];
}

interface Entry {
	eventIndex: number;
	text: string;
	type: Type;
}

interface Unit {
	text: string;
	type: Type;
	/** The entry this unit's text began on, for the record where it goes nowhere. */
	from: number;
}

/** One verse's entry on a syllable, or undefined where the syllable has none for it. */
function entryOf(syl: SyllableInfo, verse: number): { text: string; type: Type } | undefined {
	if (syl.versesInfo && syl.versesInfo.length > 0) {
		const found = syl.versesInfo.find((v) => v.verseNumber === verse);
		return found ? { text: found.text, type: found.type } : undefined;
	}
	return syl.verseNumber === verse ? { text: syl.text, type: syl.type } : undefined;
}

/** The syllable with the changed verses applied (`null` removes a verse's entry); null where it is left with no verse. */
function rewrite(syl: SyllableInfo, changes: Map<number, { text: string; type: Type } | null>): SyllableInfo | null {
	if (syl.versesInfo && syl.versesInfo.length > 0) {
		const infos = syl.versesInfo
			.map((v) => {
				if (!changes.has(v.verseNumber)) return v;
				const next = changes.get(v.verseNumber);
				return next === null || next === undefined ? undefined : { ...v, text: next.text, type: next.type };
			})
			.filter((v): v is NonNullable<typeof v> => v !== undefined);
		if (infos.length === 0) return null;
		// The primary text mirrors the verse `verseNumber` names; where that verse lost its entry, the lowest remaining verse takes over.
		const primary = infos.find((v) => v.verseNumber === syl.verseNumber) ?? infos[0];
		const moved = primary.verseNumber !== syl.verseNumber;
		const textChanged = primary.text !== syl.text;
		return {
			...syl,
			text: primary.text,
			type: primary.type,
			verseNumber: primary.verseNumber,
			...(moved || textChanged ? { segments: undefined, parseFlag: undefined } : {}),
			versesInfo: infos,
			...(syl.verses ? { verses: infos.map((v) => v.text) } : {}),
		};
	}
	const next = changes.get(syl.verseNumber);
	if (next === undefined) return syl;
	if (next === null) return null;
	return next.text === syl.text ? { ...syl, type: next.type } : { ...syl, text: next.text, type: next.type, segments: undefined, parseFlag: undefined };
}

/** A unit begins a word if its first part does, and ends one if its last part does. */
const typeOf = (begins: boolean, ends: boolean): Type => (begins && ends ? 'whole' : begins ? 'start' : ends ? 'end' : 'middle');
const beginsWord = (t: Type): boolean => t === 'start' || t === 'whole';
const endsWord = (t: Type): boolean => t === 'end' || t === 'whole';

/** Direction and joiner of a fragment: the cell's syllabic type first, then the old-spelling map, then the clitic table. */
function directionOf(text: string, type: Type): { forward: boolean; joiner: string } {
	if (type === 'start' || type === 'middle') return { forward: true, joiner: '' };
	if (type === 'end') return { forward: false, joiner: '' };
	const letters = (text.normalize('NFC').match(LETTERS) ?? []).join('').toLowerCase();
	// The letter map before the table: «въ» is «в».
	const modern = modernisePreReform(letters) ?? letters;
	return { forward: GraysonEngine.proclitics.has(modern), joiner: NBSP };
}

/**
 * The pieces of a token of two vowels or more, or why it cannot be divided: `shape` where the token is not one run of letters
 * (the named call is never asked), `engine` where the named call is asked and its pieces do not serve. The pieces are cut from
 * the token itself, so the case and the punctuation on its ends survive, and they must rejoin to it character for character.
 */
function divide(text: string, type: Type, vowels: number): Unit[] | 'shape' | 'engine' {
	const nfc = text.normalize('NFC');
	const edges = nfc.match(EDGES);
	if (!edges) return 'shape';
	const [, lead, body, trail] = edges;
	if (!LETTER_RUN.test(body)) return 'shape';
	const lower = body.toLowerCase();
	if (lower.length !== body.length) return 'shape';
	const pieces = GraysonEngine.syllabify(lower);
	if (pieces.join('') !== lower || pieces.length !== vowels) return 'engine';
	if (pieces.some((piece) => vowelCount(piece) !== 1)) return 'engine';
	const out: Unit[] = [];
	let at = 0;
	pieces.forEach((piece, i) => {
		const cut = body.slice(at, at + piece.length);
		at += piece.length;
		const first = i === 0;
		const last = i === pieces.length - 1;
		out.push({ text: `${first ? lead : ''}${cut}${last ? trail : ''}`, type: typeOf(first && beginsWord(type), last && endsWord(type)), from: -1 });
	});
	return out;
}

/** The re-deal of one verse. `entries` are the notes that held text in it, in event order. */
function redeal(verse: number, entries: Entry[], eventIds: readonly string[]) {
	const units: Unit[] = [];
	const orphans: Place[] = [];
	const undivided: Place[] = [];
	const pinned: Place[] = [];
	/** Entries left on their own note, not dealt. */
	const pins = new Set<number>();
	/** Entries of fragments fused backward: the note each sat on, which a tie, an extender, or a slur under the gate may claim. */
	const back: number[] = [];
	let folded = 0;
	let divided = 0;
	let pending: { text: string; joiner: string; type: Type; from: number } | null = null;
	const place = (k: number, why?: Place['why']): Place => ({ eventId: eventIds[entries[k].eventIndex], verse, text: entries[k].text, ...(why ? { why } : {}) });

	entries.forEach((e, k) => {
		const nfc = e.text.normalize('NFC');
		// A mark alone, or a token with no Cyrillic letter (a Latin letter in a Cyrillic verse), is not a syllable and not a fragment:
		// it stays on its own note, is not dealt, and is counted.
		if (!CYRILLIC.test(nfc)) {
			pins.add(k);
			pinned.push(place(k, hasLetter(nfc) ? 'foreign' : 'mark'));
			return;
		}
		const v = vowelCount(nfc);
		if (v > 0) {
			let these: Unit[] = [{ text: e.text, type: e.type, from: k }];
			if (v >= 2 && !nfc.includes(ELISION)) {
				const pieces = divide(e.text, e.type, v);
				if (typeof pieces === 'string') undivided.push(place(k, pieces));
				else {
					these = pieces.map((p) => ({ ...p, from: k }));
					divided++;
				}
			}
			if (pending) {
				const first = these[0];
				these[0] = { text: `${pending.text}${pending.joiner}${first.text}`, type: typeOf(beginsWord(pending.type), endsWord(first.type)), from: pending.from };
				pending = null;
				folded++;
			}
			units.push(...these);
			return;
		}
		const { forward, joiner } = directionOf(e.text, e.type);
		if (forward) {
			pending = pending
				? { text: `${pending.text}${pending.joiner}${e.text}`, joiner, type: typeOf(beginsWord(pending.type), endsWord(e.type)), from: pending.from }
				: { text: e.text, joiner, type: e.type, from: k };
			return;
		}
		const host = units[units.length - 1];
		if (!host) {
			orphans.push(place(k));
			return;
		}
		units[units.length - 1] = { text: `${host.text}${joiner}${e.text}`, type: typeOf(beginsWord(host.type), endsWord(e.type)), from: host.from };
		back.push(k);
		folded++;
	});
	if (pending) orphans.push(place((pending as { from: number }).from));
	return { units, pins, back, orphans, undivided, pinned, folded, divided };
}

/**
 * Re-deal every Cyrillic verse of the score: fuse the fragments, divide the polyvowel tokens, deal the syllables back, count the rest.
 *
 * `extenderIds` are the notes a printed extender sustains (`extender-notes`). AMENDMENT 10's EXCEPTION (round 2, blocker 2): a
 * backward fusion closes the tail up onto the fragment's own note UNLESS a tie, an extender, or a slur under the gate claims that
 * note. A claimed note is a continuation of the host the print holds, so it is skipped by the deal: the fragment's text goes onto
 * the host, the note is left with no syllable (the print's own melisma), and every later syllable stays where the print put it.
 */
export function foldVowelessSyllables(parsed: ParsedScore, extenderIds: ReadonlySet<string> = new Set()): VowellessFold {
	const verses = new Set<number>();
	for (const ev of parsed.vocalLine) {
		const syl = ev.syllable;
		if (!syl) continue;
		if (syl.versesInfo && syl.versesInfo.length > 0) for (const v of syl.versesInfo) verses.add(v.verseNumber);
		else verses.add(syl.verseNumber);
	}
	const eventIds = parsed.vocalLine.map((ev) => ev.id);
	const results: VerseRedeal[] = [];
	/** event index, then verse number, to the dealt entry or null (no syllable). */
	const changes = new Map<number, Map<number, { text: string; type: Type } | null>>();
	let folded = 0;
	let undrawn = 0;
	for (const verse of [...verses].sort((a, b) => a - b)) {
		const entries: Entry[] = [];
		parsed.vocalLine.forEach((ev, eventIndex) => {
			const entry = ev.syllable ? entryOf(ev.syllable, verse) : undefined;
			if (entry) entries.push({ eventIndex, text: entry.text, type: entry.type });
		});
		// Only a Cyrillic verse: an IPA verse is Latin letters, none of them a Cyrillic vowel, and is not under this rule's reading.
		if (!entries.some((o) => CYRILLIC.test(o.text))) continue;
		const dealt = redeal(verse, entries, eventIds);
		const { units, pins } = dealt;
		const evidence = evidenceFor(parsed.vocalLine, scopeOf(parsed, verse), units.length, extenderIds);
		const claimed = (k: number): boolean => {
			const ev = parsed.vocalLine[entries[k].eventIndex];
			return ev.tied?.type === 'stop' || ev.tied?.type === 'continue' || evidence.held.has(ev.id);
		};
		const released = new Set(dealt.back.filter(claimed));
		// The notes the units are dealt onto: those that held text, less the notes left on their own and the claimed fragments' notes.
		const seats = entries.map((_, k) => k).filter((k) => !pins.has(k) && !released.has(k));
		const vacated: Place[] = [];
		const overflow: Place[] = [];
		const next = new Map<number, { text: string; type: Type } | null>();
		released.forEach((k) => next.set(k, null));
		seats.forEach((k, i) => {
			const unit = units[i];
			next.set(k, unit ? { text: unit.text, type: unit.type } : null);
			if (!unit) vacated.push({ eventId: eventIds[entries[k].eventIndex], verse, text: entries[k].text });
		});
		for (const [k, value] of next) {
			const e = entries[k];
			if (value === null || value.text !== e.text || value.type !== e.type) {
				const perEvent = changes.get(e.eventIndex) ?? new Map<number, { text: string; type: Type } | null>();
				perEvent.set(verse, value);
				changes.set(e.eventIndex, perEvent);
			}
		}
		const lastSeat = seats.length > 0 ? seats[seats.length - 1] : entries.length - 1;
		for (let i = seats.length; i < units.length; i++) overflow.push({ eventId: eventIds[entries[lastSeat].eventIndex], verse, text: units[i].text });
		results.push({ verse, held: entries.length, syllables: units.length, folded: dealt.folded, divided: dealt.divided, vacated, overflow, orphans: dealt.orphans, undivided: dealt.undivided, pinned: dealt.pinned, evidence });
		folded += dealt.folded;
		undrawn += dealt.orphans.length + overflow.length;
	}
	if (changes.size === 0) return { score: parsed, folded, undrawn, verses: results };
	const vocalLine: VocalLineEvent[] = parsed.vocalLine.map((ev, eventIndex) => {
		const perEvent = changes.get(eventIndex);
		if (!perEvent || !ev.syllable) return ev;
		const next = rewrite(ev.syllable, perEvent);
		if (next === null) {
			const { syllable: _dropped, ...rest } = ev;
			return rest as VocalLineEvent;
		}
		return { ...ev, syllable: next };
	});
	return { score: { ...parsed, vocalLine }, folded, undrawn, verses: results };
}
