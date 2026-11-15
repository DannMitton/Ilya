import type { DictionMarksRecord, ParsedScore, SyllableInfo, VocalLineEvent } from './types';

/**
 * The verse numbers that actually sing in this score, ascending.
 *
 * A verse "sings" on a note when that note carries a syllable for it: either
 * an entry in the authoritative per-verse record `syllable.versesInfo`
 * (§A.98), or, on a single-verse note where `versesInfo` is absent, the
 * primary `syllable.verseNumber`. This mirrors the resolver's own selection
 * rule (`verseSyllableOf`): `versesInfo` is authoritative when present, and
 * includes the primary verse's own entry, so it is not re-added separately.
 *
 * Rests, note-less events, and lyric-less notes contribute nothing, so a
 * score with no lyrics returns []. Derived from the populated events, never
 * assumed: a single-verse score returns [1] only because its notes carry
 * verse 1, not by default (§A.56).
 *
 * This is the enumerator a per-verse consumer walks to build one overlay per
 * verse. Each verse sings the same notes with different text, so the overlays
 * differ only by the resolved vowel (§A.73, independent passes).
 */
export function sungVerseNumbers(parsed: ParsedScore): number[] {
	// Strophic lane A, D1: a lyric line whose syllables carry no Cyrillic letter
	// (the sunless fixtures carry the IPA as `<lyric number="2">`) is not a verse.
	// When no line carries one, every line counts, as before.
	const seen = new Map<number, boolean>();
	const add = (verseNumber: number, text: string): void => {
		seen.set(verseNumber, (seen.get(verseNumber) ?? false) || CYRILLIC.test(text));
	};
	for (const ev of parsed.vocalLine) {
		const syl = ev.syllable;
		if (!syl) continue;
		if (syl.versesInfo && syl.versesInfo.length > 0) {
			for (const v of syl.versesInfo) add(v.verseNumber, v.text);
		} else {
			add(syl.verseNumber, syl.text);
		}
	}
	const all = [...seen.keys()].sort((a, b) => a - b);
	const written = all.filter((n) => seen.get(n));
	return written.length > 0 ? written : all;
}

const CYRILLIC = /\p{Script=Cyrillic}/u;

/** One verse's syllable on one note: its `versesInfo` entry for the verse, or the note's own syllable when that is the verse. */
function entryOf(syl: SyllableInfo | undefined, verse: number): { text: string; type: SyllableInfo['type'] } | undefined {
	if (!syl) return undefined;
	if (syl.versesInfo && syl.versesInfo.length > 0) {
		const e = syl.versesInfo.find((v) => v.verseNumber === verse);
		return e ? { text: e.text, type: e.type } : undefined;
	}
	return syl.verseNumber === verse ? { text: syl.text, type: syl.type } : undefined;
}

/** The verse numbers a note carries words for, whatever their language. */
function versesOn(syl: SyllableInfo | undefined): number[] {
	if (!syl) return [];
	return syl.versesInfo && syl.versesInfo.length > 0 ? syl.versesInfo.map((v) => v.verseNumber) : [syl.verseNumber];
}

/** Per bar: the sung verses that carry words in it. Bars with no words are absent. */
export function sungVersesByBar(parsed: ParsedScore, sung: ReadonlySet<number>): Map<number, Set<number>> {
	const out = new Map<number, Set<number>>();
	for (const ev of parsed.vocalLine) {
		for (const v of versesOn(ev.syllable)) {
			if (!sung.has(v)) continue;
			const set = out.get(ev.measureIndex) ?? new Set<number>();
			set.add(v);
			out.set(ev.measureIndex, set);
		}
	}
	return out;
}

/**
 * Strophic lane A, D2. The score as sung verse `verse` sings it, `verse` being a
 * lyric number from `sungVerseNumbers`; the first sung verse is the base verse.
 *
 * On each sung note `syllable` is the verse's entry, renumbered to verse 1 with no
 * `versesInfo`. In a one-line bar (no note carries any sung verse's words but the
 * base verse's) the base verse's syllable stands for every verse. Anywhere else
 * that the verse has no entry the note has no syllable, a continuation. The score
 * is otherwise returned as it is: ids, durations, pitches, and bars are unchanged.
 * `dictionMarks` keeps the verse's own records renumbered to verse 1, and the base
 * verse's records where the event stands in a one-line bar.
 *
 * A syllable taken from `versesInfo` carries its text and type only: `versesInfo`
 * stores no per-verse elision segments (types.ts, `versesInfo`), so an elided
 * syllable of a non-primary verse reaches the view as its joined text.
 */
export function verseView(parsed: ParsedScore, verse: number): ParsedScore {
	const sung = sungVerseNumbers(parsed);
	const base = sung[0] ?? 1;
	const byBar = sungVersesByBar(parsed, new Set(sung));
	const oneLine = (bar: number): boolean => {
		const set = byBar.get(bar);
		return !set || [...set].every((v) => v === base);
	};
	const vocalLine: VocalLineEvent[] = parsed.vocalLine.map((ev) => {
		if (!ev.syllable) return ev;
		const { syllable: syl, ...rest } = ev;
		// The verse whose words this note shows: its own, else the base verse's in a one-line bar.
		const shown = entryOf(syl, verse) ? verse : oneLine(ev.measureIndex) && entryOf(syl, base) ? base : undefined;
		const entry = shown === undefined ? undefined : entryOf(syl, shown);
		if (shown === undefined || !entry) return rest as VocalLineEvent;
		let out: SyllableInfo;
		if (syl.verseNumber === shown) {
			// The note's primary syllable: keep everything it carries (elision segments, flags).
			const { versesInfo: _vi, verses: _v, ...primary } = syl;
			void _vi;
			void _v;
			out = { ...primary, verseNumber: 1 };
		} else {
			out = { id: `${syl.id}:verse${shown}`, text: entry.text, type: entry.type, verseNumber: 1, wordContext: entry.text };
		}
		return { ...rest, syllable: out } as VocalLineEvent;
	});
	const view: ParsedScore = { ...parsed, vocalLine };
	if (parsed.dictionMarks) view.dictionMarks = marksOf(parsed.dictionMarks, parsed, verse, base, oneLine);
	return view;
}

function marksOf(rec: DictionMarksRecord, parsed: ParsedScore, verse: number, base: number, oneLine: (bar: number) => boolean): DictionMarksRecord {
	const barOf = new Map(parsed.vocalLine.map((e) => [e.id, e.measureIndex]));
	const keep = (eventId: string, v: number): boolean => v === verse || (verse !== base && v === base && oneLine(barOf.get(eventId) ?? -1));
	return {
		breaks: rec.breaks.filter((b) => keep(b.vacatedEventId, b.verseNumber)).map((b) => ({ ...b, verseNumber: 1 })),
		vacatedTailEventIds: rec.vacatedTailEventIds.filter((t) => keep(t.eventId, t.verseNumber)).map((t) => ({ ...t, verseNumber: 1 })),
	};
}

/**
 * The bars (printed-order indices of `parsed.measures`) in which some sung verse
 * other than `verse` has words and `verse` has none, so `verseView(parsed, verse)`
 * leaves `verse` a continuation there. The step report lists them.
 */
export function verseGapBars(parsed: ParsedScore, verse: number): number[] {
	const sung = sungVerseNumbers(parsed);
	const byBar = sungVersesByBar(parsed, new Set(sung));
	return [...byBar.entries()]
		.filter(([, set]) => !set.has(verse) && ![...set].every((v) => v === (sung[0] ?? 1)))
		.map(([bar]) => bar)
		.sort((a, b) => a - b);
}
