/**
 * THE -КИЙ RHYME READING (Grayson 2012, p. 302). "Rhymes were made between
 * unstressed, adjectival endings written as -ой and those written as -ий, when
 * following letters for velar consonants ... if the rhyme scheme of the poetry
 * includes such a pairing, then the singer must read the -ий suffix as [ʌj]."
 *
 * Pure: it takes the lines of a text as words, and an injected probe (one
 * engine call), and returns which line-final words take the reading and the
 * word each one rhymes with. It stores nothing; `processText` runs it on every
 * call, so the answer is always the text's own (ruling 2026-11-09 21:09).
 *
 * THE RULE.
 *  1. A trigger is a line-final word ending in unstressed -кий, -гий, or -хий. A
 *     partner is a line-final word ending in unstressed -кой, -гой, or -хой, an
 *     adjective or a noun (ruling 2026-11-09 21:11). The dictionary's `name`
 *     part of speech («Волгой») is not one. DESK DEFAULT.
 *  2. Two line ends rhyme when the trigger, transcribed under 'literary', has the
 *     same sounds from its stressed vowel to the end as the partner. Stressed
 *     [i] and [ɨ] count as one vowel (Grayson p. 301 calls [ɨ] an allophone of
 *     /i/). The probe's output is compared as the engine gives it, before any
 *     notation preference (ʌ or ə) and before Reconstitution.
 *  3. Within a stanza, line ends that rhyme form a group, chained while each
 *     member is within three lines of another. If a group holds a partner, every
 *     trigger in it is matched. A trigger names the nearest partner in its group
 *     (the earlier line on a tie).
 *  4. No match when either word's stress is unknown (`stress < 0`, or
 *     `stressSource` 'inferred') or it is a homograph the singer has not resolved
 *     (`isHomograph`, unless `stressSource` begins 'user-').
 *  5. Only the line-final word is read. The same word earlier in the line keeps
 *     the stage reading (Fable r1, finding 7, DESK DEFAULT).
 *
 * A word that is not a trigger or a partner (a stressed -кой, «русский», a
 * non-velar ending) never joins a group, so it can neither match nor link.
 */

/** What this reads of a pipeline word. */
export interface RhymeWord {
	cleanWord: string;
	stress: number;
	stressSource: string;
	isHomograph: boolean;
	pos: string;
}

/** One line of the text, and whether the singer's next raw line is blank. */
export interface RhymeLine {
	words: RhymeWord[];
	endsStanza: boolean;
}

/** One engine call: the word's IPA under the given velar-adjectival value, before notation and Reconstitution. */
export type RhymeProbe = (word: RhymeWord, adjectival: 'stage' | 'literary') => string;

/** Lines within which two members of a group stay linked (Fable r1, finding 7). */
export const RHYME_LINK_LINES = 3;

const TRIGGER = /[кгх]ий$/;
const PARTNER = /[кгх]ой$/;
const CYRILLIC_VOWELS = /[аеёиоуыэюя]/g;
const PARTNER_POS = new Set(['adj', 'noun']);
/** The engine's vowel letters (Grayson's restricted inventory): the tail starts at the first one after the stress mark. */
const IPA_VOWEL = /[aɑeɛiɪɨouʌ]/;

/** Is the stress known, and the singer's where the dictionary has two readings? */
function stressUsable(w: RhymeWord): boolean {
	if (w.stress < 0 || w.stressSource === 'inferred') return false;
	return !w.isHomograph || w.stressSource.startsWith('user-');
}

/** Is the ending (the last vowel of the word) unstressed? `stress` counts syllables from 0. */
function endingUnstressed(w: RhymeWord): boolean {
	const syllables = (w.cleanWord.toLowerCase().match(CYRILLIC_VOWELS) ?? []).length;
	return w.stress < syllables - 1;
}

/** Sounds from the stressed vowel to the end, with stressed [i] and [ɨ] as one; null where the probe printed no stress mark. */
export function rhymeTail(ipa: string): string | null {
	const at = ipa.indexOf('ˈ');
	if (at < 0) return null;
	const after = ipa.slice(at + 1).replace(/\s+/g, '');
	const v = after.search(IPA_VOWEL);
	if (v < 0) return null;
	const tail = after.slice(v);
	return tail.replace(/^ɨ/, 'i');
}

interface Member {
	line: number;
	word: number;
	partner: boolean;
	tail: string;
	text: string;
}

/**
 * Line-final words that take the rhyme reading, keyed "lineIndex-wordIndex", each mapped to the partner's
 * `cleanWord` as the page holds it (without punctuation).
 */
export function rhymeReading(lines: readonly RhymeLine[], probe: RhymeProbe): Map<string, string> {
	const matches = new Map<string, string>();
	let stanza: Member[] = [];
	const settle = () => {
		link(stanza, matches);
		stanza = [];
	};
	lines.forEach((line, lineIdx) => {
		const wordIdx = line.words.length - 1;
		const w = line.words[wordIdx];
		if (w && stressUsable(w) && endingUnstressed(w)) {
			const lower = w.cleanWord.toLowerCase();
			const trigger = TRIGGER.test(lower);
			const partner = PARTNER.test(lower) && PARTNER_POS.has(w.pos.replace(/\.$/, ''));
			if (trigger || partner) {
				const tail = rhymeTail(probe(w, 'literary'));
				if (tail !== null) stanza.push({ line: lineIdx, word: wordIdx, partner, tail, text: w.cleanWord });
			}
		}
		if (line.endsStanza) settle();
	});
	settle();
	return matches;
}

/** Groups one stanza's members by equal tails, chained within `RHYME_LINK_LINES`, and writes each trigger's partner. */
function link(members: Member[], matches: Map<string, string>): void {
	const parent = members.map((_, i) => i);
	const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
	for (let a = 0; a < members.length; a++)
		for (let b = a + 1; b < members.length; b++)
			if (members[a].tail === members[b].tail && Math.abs(members[a].line - members[b].line) <= RHYME_LINK_LINES) parent[find(a)] = find(b);
	members.forEach((m, i) => {
		if (m.partner) return;
		let best: Member | null = null;
		members.forEach((p, j) => {
			if (!p.partner || find(j) !== find(i)) return;
			const d = Math.abs(p.line - m.line);
			if (best === null || d < Math.abs(best.line - m.line) || (d === Math.abs(best.line - m.line) && p.line < best.line)) best = p;
		});
		if (best !== null) matches.set(`${m.line}-${m.word}`, (best as Member).text);
	});
}
