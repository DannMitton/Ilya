/**
 * Diction-mark folding: `#`, the phonation-break mark, taken out of the
 * syllable slot it should never have occupied.
 *
 * ── What the mark is ──────────────────────────────────────────────────
 *
 * `#` is Dann's Grayson-derived phonation-break mark. RULED by Dann,
 * 2026-07-30: *"# means a break in phonation, a lift or an interruption as
 * opposed to continuous phonation. Its function is to signal the stopping of
 * assimilative processes. But alone, # has no phonetic/phonemic value."* And,
 * on the repair: *"# should never take a syllable slot. You could ignore it or
 * concatenate it with the prior phoneme, whichever makes things easier."*
 *
 * So it is a BOUNDARY between two phonemes, not an event of its own.
 *
 * ── What goes wrong when it takes a slot ──────────────────────────────
 *
 * In a MusicXML underlay every `<lyric>` is attached to a note, so a mark
 * engraved as its own lyric consumes a note. MEASURED 2026-07-30 across the six
 * converted Sunless scores: the mark appears 16 times, and each occurrence puts
 * every later syllable of that verse one note late. Sunless 1 carries two, and
 * 77 of its 96 notes therefore carry the wrong transcription: Cyrillic ⟨ду⟩ sits
 * under the IPA `jɑ` while its own `ˈdu` sits on the following note.
 *
 * Read straight off Sunless 4, the clearest instance, Cyrillic against IPA:
 *
 *     note 69   я  [end]        jɑ  [end]
 *     note 70   на [whole]      #   [whole]     <- the mark takes the slot
 *     note 71   прав [start]    nɑ  [whole]     <- ⟨на⟩'s own IPA, one note late
 *     note 72   ду [end]        ˈprɑ [start]    <- ⟨прав⟩'s own IPA, one note late
 *
 * ── The repair ────────────────────────────────────────────────────────
 *
 * The mark is appended to the PRECEDING syllable's text and its note slot is
 * closed, so every later syllable moves back to the note it belongs on. The
 * concatenation is deliberate rather than a deletion: the boundary survives
 * exactly where it separates the two phonemes, so a downstream phonology pass
 * can still stop assimilation across it, and `phonationBreak` on the analysed
 * event finally has a source. Discarding the mark would repair the alignment
 * and silently lose the diction fact.
 *
 * MEASURED against Mitton's own 2019 dataset, whose expected values predate
 * every mechanism here: total absolute per-vowel error over the six songs falls
 * from 264.51 quavers (18.46 percent of sung time) to 116.77 (8.15 percent).
 * Five songs improve, NONE worsens, and Sunless 2, which carries no mark at all,
 * is bit-identical before and after, which is the no-op this must be where there
 * is nothing to repair.
 *
 * The 8.15 percent figure REQUIRES `vowelResolverAbstentions` (below). Without
 * it the same fold lands at 9.75 percent, because a resolver then carries a
 * vowel across the vacated tail as though it were a melisma. The gap between
 * those two numbers is the cost of an absence that looks like a continuation.
 *
 * ── What this does NOT claim ───────────────────────────────────────────
 *
 * A residual 8.15 percent per-vowel disagreement remains and this repair does
 * not explain it. Sunless 2, the clean control, still disagrees by 4.0 percent
 * with no mark anywhere in it, so at least some of the residue has another cause
 * entirely. Named, not fixed, and not to be attributed to this mechanism.
 *
 * Pure and non-destructive: the input `ParsedScore` is never mutated.
 */

import type { ParsedScore, SyllableInfo, VocalLineEvent } from './types';

/** The default mark. Configurable so a corpus using another glyph is not stranded. */
export const PHONATION_BREAK_MARK = '#';

export interface DictionBreak {
	/**
	 * The event AFTER which phonation breaks: the note carrying the syllable the
	 * mark was folded onto. Anchored to the preceding note rather than the
	 * following one because the mark is engraved after the phoneme it follows.
	 * `undefined` when the mark was the verse's very first entry, which leaves
	 * nothing to anchor it to.
	 */
	afterEventId?: string;
	/** The event whose slot the mark had taken, before the gap was closed. */
	vacatedEventId: string;
	verseNumber: number;
}

export interface DictionMarkFold {
	/**
	 * A copy of the score with each verse's underlay repaired. When no mark was
	 * found anywhere, this is the INPUT BY REFERENCE, so `result.score === parsed`
	 * identifies the untouched case exactly as `scoreInPerformanceOrder` does.
	 */
	score: ParsedScore;
	/** Every break found, in event order. Empty when the corpus carries none. */
	breaks: DictionBreak[];
	/** Verse numbers in which at least one mark was folded. */
	affectedVerses: number[];
	/**
	 * Events whose syllable text changed as a result of closing a gap. Reported
	 * so the size of the repair is visible rather than implied.
	 */
	shiftedEvents: number;
	/**
	 * Events left with NO syllable in a repaired verse, because closing a gap
	 * leaves the tail one syllable short per mark. These abstain: the verse has
	 * no text for them, and inventing one would fabricate a datum.
	 */
	vacatedTailEvents: number;
	/**
	 * WHICH events those are, per verse, and this field is load-bearing.
	 *
	 * After the fold, a vacated tail event carries no lyric for that verse and is
	 * therefore INDISTINGUISHABLE by shape from a melisma continuation, which
	 * also carries none. They mean opposite things: a melisma sustains the
	 * previous syllable's vowel, whereas a vacated event has no text at all and
	 * must abstain. A resolver that cannot tell them apart carries a vowel onto a
	 * note the verse never reached.
	 *
	 * MEASURED 2026-07-30: leaving them indistinguishable cost 1.6 percentage
	 * points of per-vowel agreement against the 2019 dataset, silently, in the
	 * abstaining direction's favour. `vowelResolverAbstentions` turns this into
	 * the guard a resolver should consult.
	 */
	vacatedTailEventIds: Array<{ eventId: string; verseNumber: number }>;
}

interface VerseEntry {
	eventIndex: number;
	text: string;
	type: SyllableInfo['type'];
}

function verseEntryOf(syl: SyllableInfo, verseNumber: number): { text: string; type: SyllableInfo['type'] } | undefined {
	if (syl.versesInfo && syl.versesInfo.length > 0) {
		const found = syl.versesInfo.find((v) => v.verseNumber === verseNumber);
		return found ? { text: found.text, type: found.type } : undefined;
	}
	return syl.verseNumber === verseNumber ? { text: syl.text, type: syl.type } : undefined;
}

/**
 * Fold every phonation-break mark out of the syllable slots it occupies, closing
 * the gap it opened in each affected verse.
 */
export function foldDictionMarks(
	parsed: ParsedScore,
	options: { mark?: string } = {},
): DictionMarkFold {
	const mark = options.mark ?? PHONATION_BREAK_MARK;
	if (typeof mark !== 'string' || mark.length === 0) {
		throw new TypeError(`foldDictionMarks needs a non-empty mark, got ${JSON.stringify(mark)}`);
	}
	if (!parsed || !Array.isArray(parsed.vocalLine)) {
		throw new TypeError('foldDictionMarks needs a ParsedScore with a vocalLine array');
	}

	// Which verses exist at all, and which of them carry a mark.
	const verseNumbers = new Set<number>();
	for (const ev of parsed.vocalLine) {
		const syl = ev.syllable;
		if (!syl) continue;
		if (syl.versesInfo && syl.versesInfo.length > 0) for (const v of syl.versesInfo) verseNumbers.add(v.verseNumber);
		else verseNumbers.add(syl.verseNumber);
	}

	const breaks: DictionBreak[] = [];
	const affectedVerses: number[] = [];
	// eventIndex → verseNumber → the repaired entry, or null to REMOVE the entry.
	const rewrites = new Map<number, Map<number, { text: string; type: SyllableInfo['type'] } | null>>();
	let shiftedEvents = 0;
	let vacatedTailEvents = 0;
	const vacatedTailEventIds: Array<{ eventId: string; verseNumber: number }> = [];

	for (const verseNumber of [...verseNumbers].sort((a, b) => a - b)) {
		// The positions this verse occupies, in event order.
		const occupied: VerseEntry[] = [];
		parsed.vocalLine.forEach((ev, eventIndex) => {
			const syl = ev.syllable;
			if (!syl) return;
			const entry = verseEntryOf(syl, verseNumber);
			if (!entry) return;
			occupied.push({ eventIndex, text: entry.text, type: entry.type });
		});

		if (!occupied.some((o) => o.text === mark)) continue; // no mark in this verse: no repair
		affectedVerses.push(verseNumber);

		// Build the repaired syllable sequence, folding each mark onto its predecessor.
		const repaired: Array<{ text: string; type: SyllableInfo['type'] }> = [];
		for (const o of occupied) {
			if (o.text === mark) {
				const priorEventId = repaired.length > 0 ? parsed.vocalLine[occupied[repaired.length - 1].eventIndex]?.id : undefined;
				breaks.push({
					...(repaired.length > 0 ? { afterEventId: priorEventId } : {}),
					vacatedEventId: parsed.vocalLine[o.eventIndex].id,
					verseNumber,
				});
				if (repaired.length > 0) {
					// Concatenate, per Dann's ruling: the boundary survives in place.
					const last = repaired[repaired.length - 1];
					repaired[repaired.length - 1] = { text: `${last.text}${mark}`, type: last.type };
				}
				continue;
			}
			repaired.push({ text: o.text, type: o.type });
		}

		// Re-attach the repaired sequence to the positions this verse occupies.
		occupied.forEach((o, k) => {
			const next = k < repaired.length ? repaired[k] : null;
			if (next === null) {
				vacatedTailEvents += 1;
				vacatedTailEventIds.push({ eventId: parsed.vocalLine[o.eventIndex].id, verseNumber });
			}
			else if (next.text !== o.text || next.type !== o.type) shiftedEvents += 1;
			const perEvent = rewrites.get(o.eventIndex) ?? new Map();
			perEvent.set(verseNumber, next);
			rewrites.set(o.eventIndex, perEvent);
		});
	}

	if (breaks.length === 0) {
		return { score: parsed, breaks: [], affectedVerses: [], shiftedEvents: 0, vacatedTailEvents: 0, vacatedTailEventIds: [] };
	}

	const vocalLine: VocalLineEvent[] = parsed.vocalLine.map((ev, eventIndex) => {
		const perEvent = rewrites.get(eventIndex);
		const syl = ev.syllable;
		if (!perEvent || !syl) return ev;

		let versesInfo = syl.versesInfo;
		if (versesInfo && versesInfo.length > 0) {
			versesInfo = versesInfo
				.map((v) => {
					if (!perEvent.has(v.verseNumber)) return v;
					const next = perEvent.get(v.verseNumber);
					return next === null || next === undefined ? undefined : { ...v, text: next.text, type: next.type };
				})
				.filter((v): v is NonNullable<typeof v> => v !== undefined);
		}

		// The primary text mirrors whichever verse `verseNumber` names.
		let { text, type } = syl;
		if (perEvent.has(syl.verseNumber)) {
			const next = perEvent.get(syl.verseNumber);
			if (next) {
				text = next.text;
				type = next.type;
			}
		}

		const nextSyllable: SyllableInfo = {
			...syl,
			text,
			type,
			...(versesInfo ? { versesInfo } : {}),
			...(syl.verses ? { verses: (versesInfo ?? []).map((v) => v.text) } : {}),
		};

		// A verse that lost its only entry leaves the event with no syllable at all.
		if (versesInfo && versesInfo.length === 0) {
			const { syllable: _dropped, ...rest } = ev;
			return rest as VocalLineEvent;
		}
		return { ...ev, syllable: nextSyllable };
	});

	return { score: { ...parsed, vocalLine }, breaks, affectedVerses, shiftedEvents, vacatedTailEvents, vacatedTailEventIds };
}

/**
 * The event ids a vowel resolver must ABSTAIN on for a given verse, rather than
 * carrying the previous syllable's vowel across them as if they were a melisma.
 *
 * Wrap a resolver with this and the distinction the fold erases is restored:
 *
 *     const skip = vowelResolverAbstentions(fold, 2);
 *     const resolve = (ev) => (skip.has(ev.id) ? undefined : myResolver(ev));
 */
export function vowelResolverAbstentions(fold: DictionMarkFold, verseNumber: number): Set<string> {
	const out = new Set<string>();
	for (const v of fold.vacatedTailEventIds) if (v.verseNumber === verseNumber) out.add(v.eventId);
	return out;
}

/**
 * The set of event ids after which phonation breaks, ready for the analysed
 * event's `phonationBreak` flag. Nothing populated that flag before this.
 */
export function phonationBreakEventIds(fold: DictionMarkFold): Set<string> {
	const out = new Set<string>();
	for (const b of fold.breaks) if (b.afterEventId !== undefined) out.add(b.afterEventId);
	return out;
}
