/**
 * ONE VOWEL PER NOTE for a file's own lyrics, on arrival (`CONTRACT.md` §0.1,
 * Dann 2026-10-29 01:18 and 2026-11-02 13:46, no exceptions; N.135 step 4,
 * writer 3). A MusicXML or MNX file can carry a syllable with no vowel letter on
 * a note of its own («в» alone, a lone «т»). Every surface that draws or reads
 * the score (the staff renderer, the seat, the resolvers) then shows a vowelless
 * syllable under a note. This is the reading that repairs it, at the one seam
 * every arrival passes through (`ingest.ts`, beside `foldDictionMarks`). The
 * file's bytes are not changed.
 *
 * THE ACTION (a desk default, brief r3): a vowelless syllable joins its host in
 * the fused form Ilya already builds (`score/pairings.ts`, joiner U+00A0).
 * - a known proclitic (`GraysonEngine.proclitics`) joins the NEXT syllable that
 *   holds a vowel: «в» + «мир» is «в мир» on the host's note;
 * - an enclitic (`GraysonEngine.enclitics`) and any other vowelless syllable
 *   join the syllable BEFORE it that holds a vowel: the leftward fold of
 *   `buildSlotQueue`;
 * - its own note is left with no syllable; no later syllable moves (unlike the
 *   `#` fold, which closes the gap it opened);
 * - with no host in the verse, the syllable is not drawn (its note is left with
 *   no syllable) and `undrawn` counts it.
 * A `#` alone has no letter: `foldDictionMarks` repairs it, and this leaves it.
 *
 * Only a verse that holds a Cyrillic letter is repaired: an IPA verse (Sunless 1's second) is Latin letters and has no Cyrillic vowel.
 * The verse is the run of entries of one verse number, in event order. The file
 * says nothing of lines, so a clitic at a verse's end finds no host and is not
 * drawn rather than reaching across.
 *
 * Pure and non-destructive: the input is never mutated, and a score with no
 * vowelless syllable comes back BY REFERENCE.
 */
import { GraysonEngine } from '@ilya/phonology';
import type { ParsedScore, SyllableInfo, VocalLineEvent } from '@ilya/score-parser';
import { hasVowelLetter, isVowelless } from '$lib/omr/assert-vowel-per-note';

const NBSP = '\u00A0';
const LETTERS = /\p{L}/gu;
const CYRILLIC = /[Ѐ-ӿ]/u;

export interface VowellessFold {
	score: ParsedScore;
	/** Syllables joined to a host. */
	folded: number;
	/** Syllables with no host in their verse, not drawn. */
	undrawn: number;
}

/** One verse's entry on a syllable, or undefined where the syllable has none for it. */
function entryOf(syl: SyllableInfo, verse: number): { text: string; type: SyllableInfo['type'] } | undefined {
	if (syl.versesInfo && syl.versesInfo.length > 0) {
		const found = syl.versesInfo.find((v) => v.verseNumber === verse);
		return found ? { text: found.text, type: found.type } : undefined;
	}
	return syl.verseNumber === verse ? { text: syl.text, type: syl.type } : undefined;
}

/** The syllable with the changed verses applied (`null` removes a verse's entry); null where it is left with no verse. */
function rewrite(syl: SyllableInfo, changes: Map<number, string | null>): SyllableInfo | null {
	if (syl.versesInfo && syl.versesInfo.length > 0) {
		const infos = syl.versesInfo
			.map((v) => (changes.has(v.verseNumber) ? (changes.get(v.verseNumber) === null ? undefined : { ...v, text: changes.get(v.verseNumber) as string }) : v))
			.filter((v): v is NonNullable<typeof v> => v !== undefined);
		if (infos.length === 0) return null;
		// The primary text mirrors the verse `verseNumber` names; where that verse lost its entry, the lowest remaining verse takes over.
		const primary = infos.find((v) => v.verseNumber === syl.verseNumber) ?? infos[0];
		const moved = primary.verseNumber !== syl.verseNumber;
		return {
			...syl,
			text: primary.text,
			type: primary.type,
			verseNumber: primary.verseNumber,
			...(moved ? { segments: undefined, parseFlag: undefined } : {}),
			versesInfo: infos,
			...(syl.verses ? { verses: infos.map((v) => v.text) } : {}),
		};
	}
	const next = changes.get(syl.verseNumber);
	if (next === undefined) return syl;
	return next === null ? null : { ...syl, text: next };
}

/** Join every vowelless syllable of the score to its host, or leave it undrawn. */
export function foldVowelessSyllables(parsed: ParsedScore): VowellessFold {
	const verses = new Set<number>();
	for (const ev of parsed.vocalLine) {
		const syl = ev.syllable;
		if (!syl) continue;
		if (syl.versesInfo && syl.versesInfo.length > 0) for (const v of syl.versesInfo) verses.add(v.verseNumber);
		else verses.add(syl.verseNumber);
	}
	let folded = 0;
	let undrawn = 0;
	/** event index, then verse number, to the repaired text or null (not drawn). */
	const changes = new Map<number, Map<number, string | null>>();
	for (const verse of [...verses].sort((a, b) => a - b)) {
		const occupied: { eventIndex: number; text: string | null }[] = [];
		parsed.vocalLine.forEach((ev, eventIndex) => {
			const entry = ev.syllable ? entryOf(ev.syllable, verse) : undefined;
			if (entry) occupied.push({ eventIndex, text: entry.text });
		});
		// Only a Cyrillic verse: an IPA verse is Latin letters, none of them a Cyrillic vowel, and is not under this rule's reading.
		if (!occupied.some((o) => o.text !== null && CYRILLIC.test(o.text))) continue;
		const touched = new Set<number>();
		for (let i = 0; i < occupied.length; i++) {
			const own = occupied[i].text;
			if (own === null || !isVowelless(own)) continue;
			const letters = (own.match(LETTERS) ?? []).join('').toLowerCase();
			const holds = (k: number) => occupied[k].text !== null && hasVowelLetter(occupied[k].text as string);
			let host = -1;
			if (GraysonEngine.proclitics.has(letters)) {
				for (let k = i + 1; k < occupied.length && host < 0; k++) if (holds(k)) host = k;
			} else {
				for (let k = i - 1; k >= 0 && host < 0; k--) if (holds(k)) host = k;
			}
			if (host >= 0) {
				const hostText = occupied[host].text as string;
				occupied[host].text = host > i ? `${own}${NBSP}${hostText}` : `${hostText}${NBSP}${own}`;
				touched.add(host);
				folded++;
			} else undrawn++;
			occupied[i].text = null;
			touched.add(i);
		}
		for (const k of touched) {
			const perEvent = changes.get(occupied[k].eventIndex) ?? new Map<number, string | null>();
			perEvent.set(verse, occupied[k].text);
			changes.set(occupied[k].eventIndex, perEvent);
		}
	}
	if (folded + undrawn === 0) return { score: parsed, folded: 0, undrawn: 0 };
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
	return { score: { ...parsed, vocalLine }, folded, undrawn };
}
