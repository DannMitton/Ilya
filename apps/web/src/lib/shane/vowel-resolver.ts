/**
 * The GraysonEngine vowel resolver: the Shane↔Ilya seam (v38 §E.5).
 *
 * `buildVowelResolver(parsed)` returns the `VowelResolver` that
 * `analyzeScore` consumes: per vocal-line event, the operative sung vowel
 * (IPA), or undefined when none applies. The vowels come VERBATIM from
 * Ilya's GraysonEngine via `processText` — the standing constraint: the
 * resolver never synthesizes IPA, never guesses, and resolves to
 * undefined wherever the mapping is not certain (analyzeScore omits such
 * events, which is the engine's own semantics for unresolvable vowels).
 *
 * How the mapping works, in four honest moves:
 *
 * 1. WORD RECONSTRUCTION (score-side only). The selected verse's syllables
 *    are walked in vocal-line order; `whole` is a word, `start`…`end` joins
 *    one (a note the verse does not sing carries no syllable for it).
 *    Malformed sequences (a `middle` with no open word, a `start` inside an
 *    open word) close and open words defensively rather than throwing: real
 *    engraving is imperfect. The verse's syllable per event comes from
 *    `versesInfo` when present (authoritative and self-describing, §A.98),
 *    falling back to the primary `syllable` on single-verse notes.
 *
 * 2. TRANSCRIPTION. The reconstructed words are joined into one line and
 *    fed through the full `processText` pipeline — stress lookup,
 *    clitics, cross-word assimilation — not a reduced path. The
 *    architectural guardrail stands: this module imports the pipeline,
 *    never @ilya/phonology directly.
 *
 *    N.10 CORRECTS A CLAIM THAT USED TO SIT HERE. This comment said the IPA
 *    "is exactly what Ilya's Transcription tab would print." That was true
 *    when written, and the override feature made it false: this call passes
 *    no `ProcessTextOptions`, so it sees none of the singer's stress
 *    overrides and none of their ё toggles (E.31 §1.2). It is now the
 *    FALLBACK run. Where the singer has transcribed the same word, their
 *    result is used instead — see move 3 — and only there do the two
 *    surfaces agree by construction rather than by luck.
 *
 * 3. ALIGNMENT, in two independent passes.
 *
 *    Score words against THIS module's own pipeline words: walked in
 *    parallel and matched on their cleaned Cyrillic. One divergence class
 *    is handled, the pipeline's hyphenated-particle expansion ("велит-ли"
 *    becomes two tokens), matched by joining two pipeline words. A mismatch
 *    latches this walk off, because its index is meaningless afterwards.
 *
 *    Score words against the SINGER'S transcribed words (N.10, Dann's
 *    ruling of 7 August): a longest common subsequence over the cleaned
 *    forms, in `underlay-donor.ts`. A paired word is read from the singer's
 *    transcription, overrides included; an unpaired one falls back to the
 *    first pass; a word neither pass supplies is omitted and the walk
 *    continues. Fail-soft per word, which is Path C of E.31 §1.5.
 *
 * 4. VOWEL EXTRACTION. The k-th score syllable of a word maps to the
 *    engine's syllable k; its vowel is the single vowel-typed character
 *    of that syllable in the engine's transcription log, taken verbatim
 *    (a leading stress mark is stripped from the KEY only — fR1 keys are
 *    bare glyphs). Zero or multiple vowel entries, or a glyph outside
 *    the ten sung vowels (Mitton 2020, Fig 4.2), resolve to undefined.
 *
 * Melisma: a note on which the selected verse sings no new syllable
 * sustains the previous syllable's vowel ("sustain", the overlay engine's
 * documented semantics); a rest ends the sustain. A note whose syllable
 * belongs only to other verses is, for the selected verse, exactly such a
 * continuation.
 *
 * DISPLAY IPA (Dann, 2026-07-17): the underlay's second line is the full
 * syllable transcription (consonants and vowel, verbatim from the
 * engine's `syllables[sylIdx].ipa`), not the single extracted vowel that
 * drives the acoustic forecast. Unlike the vowel, which sustains across
 * melisma continuation notes for the turning/timbre/crossing marks, the
 * display IPA appears only at syllable onset and is blank on melisma
 * continuation notes ("the IPA will blank"), matching the Cyrillic line's
 * existing onset-only behaviour. `buildUnderlayResolvers` builds both
 * from one reconstruction pass; `buildVowelResolver` is a thin wrapper
 * kept for existing callers that need only the acoustic vowel.
 *
 * A word whose score-side note-to-syllable count and pipeline-side
 * syllable count diverge is honestly omitted entirely, never guessed.
 * That divergence has two possible causes, not one: a genuine encoding
 * problem, or a composer's deliberate elision (two syllables set on one
 * rhythmic value; rare in Russian, real in opera recitative and dialect
 * folk song). Both are legitimate inputs, not errors, and today's word
 * reconstruction cannot yet tell them apart, so both honestly omit rather
 * than guess which vowel governs the note. A future elision-aware pass
 * could recognise `SyllableInfo.segments`/`parseFlag: 'elided'` explicitly
 * and resolve both vowels onto the one note; that is not built here.
 */

import { processText } from '$lib/pipeline';
import { openSyllabify } from '$lib/syllable-utils';
import { flattenTranscribedWords, matchDonors } from './underlay-donor';

/**
 * The IPA primary-stress mark, U+02C8. The engine's own symbol, declared at
 * `packages/phonology/src/engine.ts:230` as `'stress': 'ˈ'`; repeated here
 * rather than imported because that table is private to the engine. If it is
 * ever exported, import it and delete this.
 */
const STRESS_MARK = 'ˈ';
import type { SyllableData } from '@ilya/phonology';
import type { LineData, WordStackData } from '$lib/types';
import type { ParsedScore, VocalLineEvent, VowelResolver } from '@ilya/score-parser';

/** The ten Russian sung vowels (engine/types.ts `Vowel`), as a lookup set. */
const TEN_VOWELS: ReadonlySet<string> = new Set([
	'i',
	'e',
	'ɪ',
	'ɨ',
	'ɛ',
	'a',
	'ɑ',
	'ʌ',
	'o',
	'u'
]);

/** Combining marks and stress marks tolerated on a log vowel entry; the
 * bare glyph is the fR1 key. Anything else fails the ten-vowel check. */
const STRESS_MARKS = /[ˈˌ]/g;

export interface ScoreWord {
	/** Joined syllable text, verbatim from the source. */
	raw: string;
	/** Lowercased, punctuation- and dash-stripped, for alignment. */
	clean: string;
	/**
	 * Event ids per NUCLEUS index: slots[k] holds every event sounding the
	 * word's k-th vowel-bearing syllable. A sung syllable whose Cyrillic
	 * carries no vowel («сь» in по-гру-зи-сь) cannot carry its own nucleus;
	 * its events merge into the neighbouring vowel-bearing slot (trailing
	 * ones backward, leading ones forward), which is what such a syllable
	 * does musically — it sustains its neighbour's vowel. This keeps slot
	 * counts aligned with the engine's syllabification, which counts nuclei.
	 */
	slots: string[][];
	/**
	 * Every lyric CELL this word occupies, in vocal-line order: the onset
	 * event and the text the file printed there.
	 *
	 * N.111 needs this and `slots` cannot serve. `slots` counts NUCLEI, so a
	 * syllable carrying no Cyrillic vowel has no entry of its own and a word
	 * carrying none at all («в») loses its event entirely: that is exactly
	 * right for the vowel resolver, which has nothing to say about a note with
	 * no vowel, and exactly wrong for an item whose whole subject is the note
	 * the file gave that word. This channel is ADDITIVE and nothing else reads
	 * it, so the resolver's behaviour is unchanged.
	 *
	 * The onset event only. A melisma continuation joins the syllable's event
	 * array after this is taken, and a continuation note carries no cell.
	 */
	cells: Array<{ eventId: string; text: string }>;
}

export const CYRILLIC_VOWEL = /[аеёиоуыэюя]/iu;

export function cleanForAlignment(s: string): string {
	// Letters and combining marks only (a score syllable can carry a
	// combining acute); dashes and punctuation go. Lowercased for the
	// case-insensitive match against the pipeline's cleanWord.
	return s
		.normalize('NFC')
		.replace(/[^\p{L}\p{M}]/gu, '')
		.toLowerCase();
}

/** One in-progress word: sung syllables in order, each with its events. */
interface OpenWord {
	syls: Array<{ text: string; events: string[] }>;
}

/**
 * The syllable text and syllabic role sung by verse `verseNumber` on this
 * event, or undefined when that verse sings no new syllable here (a rest, a
 * melisma continuation, or a note this verse does not reach).
 *
 * `versesInfo`, when present, is authoritative and self-describing: it carries
 * every verse that sings on the event, including the primary verse's own entry
 * (§A.98), so every verse, verse 1 included, is read from it losslessly, even
 * on a sparse note whose primary `syllable` belongs to a different verse. When
 * `versesInfo` is absent the note is single-verse, so the primary `syllable`
 * is that verse's only syllable and is used directly.
 */
function verseSyllableOf(
	ev: VocalLineEvent,
	verseNumber: number
): { text: string; type: 'whole' | 'start' | 'middle' | 'end' } | undefined {
	const syl = ev.syllable;
	if (!syl) return undefined;
	if (syl.versesInfo && syl.versesInfo.length > 0) {
		const entry = syl.versesInfo.find((v) => v.verseNumber === verseNumber);
		return entry ? { text: entry.text, type: entry.type } : undefined;
	}
	return syl.verseNumber === verseNumber ? { text: syl.text, type: syl.type } : undefined;
}

/** Reconstruct the selected verse's words and their per-nucleus event slots. */
export function collectScoreWords(parsed: ParsedScore, verseNumber: number): ScoreWord[] {
	const words: ScoreWord[] = [];
	let cur: OpenWord | null = null;
	// The sustain pointer: the slot melisma continuation notes join. Always
	// aimed at an array that survives into the closed word (see close()).
	let sustain: string[] | null = null;

	/** Close the open word: merge vowelless syllables into their
	 * neighbouring nucleus slot, push the word, and return it (or null
	 * when nothing was open, or no syllable carried a vowel). */
	const close = (): ScoreWord | null => {
		if (!cur) return null;
		const raw = cur.syls.map((s) => s.text).join('');
		// TAKEN BEFORE THE MERGE BELOW, which unshifts a vowelless syllable's
		// events onto a neighbour's array and would otherwise put a borrowed
		// event id at the head of the wrong cell.
		const cells = cur.syls.map((s) => ({ eventId: s.events[0], text: s.text }));
		const slots: string[][] = [];
		let leading: string[] = []; // events from vowelless syllables awaiting a nucleus
		for (const s of cur.syls) {
			if (CYRILLIC_VOWEL.test(s.text)) {
				if (leading.length > 0) {
					s.events.unshift(...leading);
					leading = [];
				}
				slots.push(s.events);
			} else if (slots.length > 0) {
				slots[slots.length - 1].push(...s.events);
			} else {
				leading.push(...s.events);
			}
		}
		// A word with no vowel-bearing syllable at all keeps zero slots and
		// resolves nothing (its syllable count can never match the engine's).
		cur = null;
		const word: ScoreWord = { raw, clean: cleanForAlignment(raw), slots, cells };
		words.push(word);
		return word;
	};

	for (const ev of parsed.vocalLine) {
		if (ev.type === 'rest') {
			// Phonation stops; a melisma cannot cross a rest.
			sustain = null;
			continue;
		}
		const syl = verseSyllableOf(ev, verseNumber);
		if (!syl) {
			// The selected verse sings no new syllable here (a melisma
			// continuation, or a note carrying only other verses' text): the
			// note sustains the current syllable's vowel, if any.
			if (sustain) sustain.push(ev.id);
			continue;
		}
		switch (syl.type) {
			case 'whole': {
				close(); // defensive: an unterminated word ends here
				cur = { syls: [{ text: syl.text, events: [ev.id] }] };
				const w = close();
				sustain = w && w.slots.length > 0 ? w.slots[w.slots.length - 1] : null;
				break;
			}
			case 'start':
				close(); // defensive: two starts in a row
				cur = { syls: [{ text: syl.text, events: [ev.id] }] };
				sustain = cur.syls[0].events;
				break;
			case 'middle':
			case 'end': {
				if (!cur) {
					// Defensive: a continuation with no open word starts one.
					cur = { syls: [{ text: syl.text, events: [ev.id] }] };
				} else {
					cur.syls.push({ text: syl.text, events: [ev.id] });
				}
				sustain = cur.syls[cur.syls.length - 1].events;
				if (syl.type === 'end') {
					const w = close();
					// Point the sustain at the word's LAST surviving slot: a
					// vowelless final syllable merged backward, so its events
					// array is the one melisma notes must join.
					sustain = w && w.slots.length > 0 ? w.slots[w.slots.length - 1] : null;
				}
				break;
			}
		}
	}
	close(); // an unterminated final word still counts
	return words;
}

/**
 * The single vowel (bare glyph) of the word's syllable `sylIdx`, verbatim
 * from the engine's transcription log, or undefined when the syllable
 * does not carry exactly one vowel from the ten-vowel roster.
 */
export function vowelOfSyllable(w: WordStackData, sylIdx: number): string | undefined {
	const entries = w.result.transcriptionLog.filter(
		(e) => e.features?.type === 'vowel' && e.syllableIndex === sylIdx
	);
	if (entries.length !== 1) return undefined;
	const bare = entries[0].ipa.replace(STRESS_MARKS, '');
	return TEN_VOWELS.has(bare) ? bare : undefined;
}

/**
 * The full syllable's IPA (consonants and vowel), verbatim from the
 * engine's `syllables` array at the given index: the underlay's "line 2"
 * display value (Dann, 2026-07-17), distinct from `vowelOfSyllable`'s
 * single extracted vowel, which drives only the acoustic forecast.
 * Undefined only when the engine produced no syllable at that index,
 * which should not occur wherever `vowelOfSyllable` also succeeded, since
 * both read the same `sylIdx` from the same `w.result`.
 */
function ipaOfSyllable(syllables: readonly SyllableData[], sylIdx: number): string | undefined {
	const syl = syllables[sylIdx];
	if (!syl) return undefined;
	// Stress is a FLAG on the syllable (`engine.ts:52-56`), not a character in
	// its `.ipa`, so reading `.ipa` alone silently dropped it and the printed
	// page carried Ilya's transcription with the stress removed (Dann at the
	// browser, 2026-08-06). The mark precedes its syllable, which is how the
	// engine's own word-level output reads: ɑtʲ + ˈtʲɛ + nʌk.
	//
	// The character is the engine's, declared at `engine.ts:230` as
	// `'stress': 'ˈ'` (U+02C8), not one chosen here.
	//
	// No monosyllable special case, per Dann's ruling 2026-08-06: a stressed
	// monosyllable takes a mark, and clitics and negation particles do not
	// because the engine does not mark them stressed. The stress model is the
	// engine's business, not this resolver's.
	//
	// Guarded against a double mark in case a future engine change embeds it.
	return syl.isStressed && !syl.ipa.includes(STRESS_MARK) ? STRESS_MARK + syl.ipa : syl.ipa;
}

/**
 * Both per-event resolvers built from one parsed score: the acoustic
 * vowel (sustained across a melisma, feeding the turning/timbre/crossing
 * marks) and the full-syllable display IPA (onset only; undefined on
 * melisma continuation notes, matching the Cyrillic line's own onset-only
 * behaviour).
 */
export interface UnderlayResolvers {
	/** The operative sung vowel per event; sustains across melisma. */
	vowel: VowelResolver;
	/** The full syllable IPA for display; present only at syllable onset. */
	ipa: (event: VocalLineEvent) => string | undefined;
	/**
	 * N.10b: true at a syllable ONSET this builder declined to transcribe.
	 *
	 * Dann's ruling of 7 August, E.29 §5.1 ruled A. Every abstention in this
	 * module is deliberate and every one of them was invisible: the syllable
	 * keeps its Cyrillic and simply has nothing above it. This reports them
	 * so the renderer can say so.
	 *
	 * FALSE on a melisma continuation note, which is correctly silent rather
	 * than withheld, and false wherever `ipa` returned a string. The two are
	 * mutually exclusive by construction.
	 */
	withheld: (event: VocalLineEvent) => boolean;
}

/**
 * Build both resolvers for one parsed score and one verse (`verseNumber`,
 * default 1). All work happens here, once; both returned functions are Map
 * lookups, safe to call per event in `analyzeScore`'s hot loop and the
 * renderer's underlay pass. Each verse sings the same notes with different
 * text, so a per-verse overlay is this builder run once per verse, feeding the
 * unchanged verse-agnostic `analyzeScore` (Option 1, Dann 2026-07-17).
 */
export function buildUnderlayResolvers(
	parsed: ParsedScore,
	verseNumber = 1,
	options: {
		openSyllabification?: boolean;
		/**
		 * N.10: the singer's own transcription, `lines` from `+page.svelte`.
		 *
		 * Passed RAW, never `effectiveLines`: that view has already had open
		 * syllabification and the per-word boundary overrides applied for
		 * Transcribe's display, and this builder applies its own open
		 * syllabification below (`syllablesOf`), so it would be sliced twice.
		 * Absent means no donor pass runs at all, which is the pre-N.10
		 * behaviour exactly.
		 */
		transcribedLines?: readonly LineData[];
	} = {},
): UnderlayResolvers {
	const byEventVowel = new Map<string, string>();
	const byEventIpa = new Map<string, string>();
	// N.10b: the onsets this builder declined to transcribe.
	const withheldOnsets = new Set<string>();
	/** Withhold every nucleus of a word, at its onset event. */
	const withholdWord = (sw: ScoreWord): void => {
		for (const slot of sw.slots) {
			if (slot.length > 0) withheldOnsets.add(slot[0]);
		}
	};

	// N.8: the singer's open-syllable preference, applied to the IPA line only.
	//
	// `openSyllabify` (`syllable-utils.ts:48`) re-slices the engine's syllables
	// so inter-vocalic consonants migrate rightward into the following onset,
	// which is the consonant-forward division Gould sanctions at r22 to r24
	// and which her Fit note calls the right priority for a tool whose whole
	// subject is sung sound. It PRESERVES the syllable count, so the score's
	// syllable-to-note mapping and its start/middle/end types are untouched:
	// only IPA characters move between adjacent notes.
	//
	// Dann's ruling, 2026-08-06: the IPA line follows this preference, the
	// Cyrillic line stays the engraver's as printed in the score the singer
	// performs from. The two can therefore differ wherever an engraver's
	// hyphenation differs from Ilya's open division, which is accepted.
	//
	// Memoised per word: a word spanning several notes is re-sliced once.
	const slicedByWord = new Map<WordStackData, readonly SyllableData[]>();
	const syllablesOf = (w: WordStackData): readonly SyllableData[] => {
		let s = slicedByWord.get(w);
		if (!s) {
			s = options.openSyllabification ? openSyllabify(w.result.syllables) : w.result.syllables;
			slicedByWord.set(w, s);
		}
		return s;
	};

	const scoreWords = collectScoreWords(parsed, verseNumber);
	if (scoreWords.length > 0) {
		let pipelineWords: WordStackData[] = [];
		try {
			const lines = processText(scoreWords.map((w) => w.raw).join(' '));
			pipelineWords = lines[0]?.words ?? [];
		} catch {
			// A pipeline failure resolves nothing; the overlay stays honest
			// (notation renders, no acoustic claims).
			pipelineWords = [];
		}

		// N.10: one donor slot per score word, null where the singer has not
		// transcribed that word. Empty when no transcription was passed, so
		// every word takes the fallback and the page is what it was before.
		const donorWords = options.transcribedLines
			? flattenTranscribedWords(options.transcribedLines)
			: [];
		const donorFor =
			donorWords.length > 0
				? matchDonors(
						scoreWords.map((w) => w.clean),
						donorWords.map((w) => cleanForAlignment(w.cleanWord)),
					)
				: [];

		let j = 0;
		// Once the fallback walk loses sync its `j` means nothing, so it is
		// latched off rather than allowed to re-sync at a wrong offset and
		// print a confident wrong syllable.
		let localLost = false;
		for (let swIdx = 0; swIdx < scoreWords.length; swIdx++) {
			const sw = scoreWords[swIdx];
			// Match this score word to one pipeline word, or to two when the
			// pipeline split a hyphenated particle.
			let matched: WordStackData[] | null = null;
			if (!localLost) {
				const one = pipelineWords[j];
				if (one && cleanForAlignment(one.cleanWord) === sw.clean) {
					matched = [one];
					j += 1;
				} else {
					const two = pipelineWords[j + 1];
					if (
						one &&
						two &&
						cleanForAlignment(one.cleanWord + two.cleanWord) === sw.clean
					) {
						matched = [one, two];
						j += 2;
					}
				}
				if (!matched) localLost = true;
			}
			// N.10, Path C (E.31 §1.5). Where the singer has transcribed this
			// word, THEIR transcription wins: `pipeline.ts:270-277` writes the
			// override onto the pre-transcribe word BEFORE the engine runs at
			// `:288`, so the donor carries the correction in its stress flag and
			// in its reduced vowels, not merely as a mark. Where they have not,
			// the fallback run stands for that word alone.
			const donorIdx = donorFor[swIdx];
			if (donorIdx !== undefined && donorIdx !== null) {
				matched = [donorWords[donorIdx]];
			}
			// Fail-soft per word: nothing honest to print HERE, but a later word
			// the singer did transcribe still resolves. Path A blanked the rest
			// of the page from this point and was rejected for it. N.10b: and it
			// now says so at the syllable rather than leaving a blank.
			if (!matched) {
				withholdWord(sw);
				continue;
			}

			// The word's syllables, concatenated across a particle split.
			//
			// N.9. A word with no vowel can never own a slot on the score side:
			// `close()` gives a slot only to a syllable matching CYRILLIC_VOWEL
			// (`:181`) and merges the rest into a neighbour (`:183`, `:188`).
			// The engine nevertheless returns one syllable for it
			// (`engine.ts:1119` falls back to `[word]`, and `:1879` pushes one
			// entry per element), so counting it here made the two sides count
			// by different rules and the guard below omitted words that had
			// aligned correctly. Found by Dann at the browser, 2026-08-06, on
			// "в последний" and "в раздоре"; the same host resolves without the
			// clitic in front of it, on the same page.
			//
			// The clitic's IPA is not dropped, and where it goes is not decided
			// here: `pipeline.ts:752-758` and `syllable-utils.ts:300-315` both
			// already tuck a vowelless proclitic into the front of its host,
			// after the stress mark when the host's IPA carries one, and append
			// a vowelless enclitic. This mirrors that rule at syllable
			// granularity, which is the granularity the underlay prints at.
			// `ipaContent` is the field those two sites read for exactly this
			// purpose (`types.ts:80`).
			const sylOwners: Array<{ word: WordStackData; localIdx: number }> = [];
			let procliticIpa = '';
			let encliticIpa = '';
			for (const mw of matched) {
				if (!CYRILLIC_VOWEL.test(mw.cleanWord)) {
					const cliticIpa = mw.ipaContent || ipaOfSyllable(syllablesOf(mw), 0) || '';
					// Before any nucleus it is proclitic, after one enclitic:
					// the same ordering `matched` was built in.
					if (sylOwners.length === 0) procliticIpa += cliticIpa;
					else encliticIpa += cliticIpa;
					continue;
				}
				for (let k = 0; k < mw.syllables.length; k++) {
					sylOwners.push({ word: mw, localIdx: k });
				}
			}
			// The score's per-note syllable count and the engine's per-word
			// syllable count must agree for this word to resolve; when they
			// diverge, the whole word is honestly omitted rather than guessed.
			// The divergence has two possible causes, not one: a genuine
			// encoding problem, or a composer's deliberate elision (two
			// syllables set on one rhythmic value; rare in Russian, real in
			// opera recitative and dialect folk song). Both are legitimate
			// inputs, and today's reconstruction cannot yet tell them apart,
			// so both honestly omit rather than guess which vowel governs the
			// note (see the module doc comment).
			if (sylOwners.length !== sw.slots.length) {
				// N.10b: this is the abstention E.29 §5.1 asked about by name, and
				// the one Dann found on the Kabalevsky page with a checklist. It
				// stays an abstention; it stops being a silent one.
				withholdWord(sw);
				continue;
			}

			for (let k = 0; k < sw.slots.length; k++) {
				const owner = sylOwners[k];
				const slot = sw.slots[k];
				const vowel = vowelOfSyllable(owner.word, owner.localIdx);
				if (vowel) {
					// Sustained across the whole slot (onset + any melisma
					// continuation events): the acoustic marks persist through
					// the sustain.
					for (const eventId of slot) {
						byEventVowel.set(eventId, vowel);
					}
				}
				let ipa = ipaOfSyllable(syllablesOf(owner.word), owner.localIdx);
				// N.9: the vowelless clitics that own no slot ride on the
				// syllables at either end, following `pipeline.ts:752-758`.
				// A stress mark stays leftmost; the clitic tucks in behind it.
				if (ipa !== undefined && procliticIpa && k === 0) {
					ipa = ipa.startsWith(STRESS_MARK)
						? STRESS_MARK + procliticIpa + ipa.slice(STRESS_MARK.length)
						: procliticIpa + ipa;
				}
				if (ipa !== undefined && encliticIpa && k === sw.slots.length - 1) {
					ipa = ipa + encliticIpa;
				}
				if (slot.length > 0) {
					if (ipa) {
						// Onset only: the display IPA does not repeat under melisma
						// continuation notes.
						byEventIpa.set(slot[0], ipa);
					} else {
						// N.10b: the word aligned, and THIS syllable still produced
						// nothing. `ipaOfSyllable` returns undefined only where the
						// engine holds no syllable at that index, which should not
						// happen after the count guard above; it is withheld rather
						// than dropped so that if it ever does, the page says so
						// instead of printing a gap nobody can account for.
						withheldOnsets.add(slot[0]);
					}
				}
			}
		}
	}

	return {
		vowel: (event) => byEventVowel.get(event.id),
		ipa: (event) => byEventIpa.get(event.id),
		withheld: (event) => withheldOnsets.has(event.id)
	};
}

/**
 * Build the acoustic-vowel resolver for one parsed score and one verse
 * (`verseNumber`, default 1). All work happens here, once; the returned
 * function is a Map lookup, safe to call per event in `analyzeScore`'s hot
 * loop. A thin wrapper over `buildUnderlayResolvers` for callers that need
 * only the acoustic vowel.
 */
export function buildVowelResolver(parsed: ParsedScore, verseNumber = 1): VowelResolver {
	return buildUnderlayResolvers(parsed, verseNumber).vowel;
}
