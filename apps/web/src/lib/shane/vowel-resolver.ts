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
 * 1. WORD RECONSTRUCTION (score-side only). Verse-1 syllables are walked
 *    in vocal-line order; `whole` is a word, `start`…`end` joins one
 *    (melisma continuation notes carry no syllable by the canonical
 *    model). Malformed sequences (a `middle` with no open word, a `start`
 *    inside an open word) close and open words defensively rather than
 *    throwing: real engraving is imperfect.
 *
 * 2. TRANSCRIPTION. The reconstructed words are joined into one line and
 *    fed through the full `processText` pipeline — stress lookup,
 *    clitics, cross-word assimilation — not a reduced path, so the IPA
 *    is exactly what Ilya's Transcription tab would print. The
 *    architectural guardrail stands: this module imports the pipeline,
 *    never @ilya/phonology directly.
 *
 * 3. ALIGNMENT. Score words and pipeline words are walked in parallel and
 *    matched on their cleaned Cyrillic. One divergence class is handled:
 *    the pipeline's hyphenated-particle expansion ("велит-ли" becomes two
 *    tokens), matched by joining two pipeline words. Any other mismatch
 *    stops the mapping from that word onward — a partial honest overlay
 *    beats a misaligned one.
 *
 * 4. VOWEL EXTRACTION. The k-th score syllable of a word maps to the
 *    engine's syllable k; its vowel is the single vowel-typed character
 *    of that syllable in the engine's transcription log, taken verbatim
 *    (a leading stress mark is stripped from the KEY only — fR1 keys are
 *    bare glyphs). Zero or multiple vowel entries, or a glyph outside
 *    the ten sung vowels (Mitton 2020, Fig 4.2), resolve to undefined.
 *
 * Melisma: a note with no verse-1 syllable sustains the previous
 * syllable's vowel ("sustain", the overlay engine's documented
 * semantics); a rest ends the sustain. A syllable from another verse is
 * treated as a continuation of verse 1, the v1 UI's verse rule.
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
import type { WordStackData } from '$lib/types';
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

interface ScoreWord {
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
}

const CYRILLIC_VOWEL = /[аеёиоуыэюя]/iu;

function cleanForAlignment(s: string): string {
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

/** Reconstruct verse-1 words and their per-nucleus event slots. */
function collectScoreWords(parsed: ParsedScore): ScoreWord[] {
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
		const word: ScoreWord = { raw, clean: cleanForAlignment(raw), slots };
		words.push(word);
		return word;
	};

	for (const ev of parsed.vocalLine) {
		if (ev.type === 'rest') {
			// Phonation stops; a melisma cannot cross a rest.
			sustain = null;
			continue;
		}
		const syl = ev.syllable;
		if (!syl || syl.verseNumber !== 1) {
			// Melisma continuation (or another verse's text, treated as
			// continuation per the v1 verse rule): the note sustains the
			// current syllable's vowel, if any.
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
function vowelOfSyllable(w: WordStackData, sylIdx: number): string | undefined {
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
function ipaOfSyllable(w: WordStackData, sylIdx: number): string | undefined {
	return w.result.syllables[sylIdx]?.ipa;
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
}

/**
 * Build both resolvers for one parsed score. All work happens here, once;
 * both returned functions are Map lookups, safe to call per event in
 * `analyzeScore`'s hot loop and the renderer's underlay pass.
 */
export function buildUnderlayResolvers(parsed: ParsedScore): UnderlayResolvers {
	const byEventVowel = new Map<string, string>();
	const byEventIpa = new Map<string, string>();

	const scoreWords = collectScoreWords(parsed);
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

		let j = 0;
		for (const sw of scoreWords) {
			// Match this score word to one pipeline word, or to two when the
			// pipeline split a hyphenated particle.
			let matched: WordStackData[] | null = null;
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
			if (!matched) break; // alignment lost: stop mapping, never guess

			// The word's syllables, concatenated across a particle split.
			const sylOwners: Array<{ word: WordStackData; localIdx: number }> = [];
			for (const mw of matched) {
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
			if (sylOwners.length !== sw.slots.length) continue;

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
				const ipa = ipaOfSyllable(owner.word, owner.localIdx);
				if (ipa && slot.length > 0) {
					// Onset only: the display IPA does not repeat under melisma
					// continuation notes.
					byEventIpa.set(slot[0], ipa);
				}
			}
		}
	}

	return {
		vowel: (event) => byEventVowel.get(event.id),
		ipa: (event) => byEventIpa.get(event.id)
	};
}

/**
 * Build the resolver for one parsed score. All work happens here, once;
 * the returned function is a Map lookup, safe to call per event in
 * `analyzeScore`'s hot loop. A thin wrapper over `buildUnderlayResolvers`
 * for existing callers that need only the acoustic vowel.
 */
export function buildVowelResolver(parsed: ParsedScore): VowelResolver {
	return buildUnderlayResolvers(parsed).vowel;
}
