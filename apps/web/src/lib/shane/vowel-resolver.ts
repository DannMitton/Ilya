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
 */

import { processText } from '$lib/pipeline';
import type { WordStackData } from '$lib/types';
import type { ParsedScore, VowelResolver } from '@ilya/score-parser';

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
 * Build the resolver for one parsed score. All work happens here, once;
 * the returned function is a Map lookup, safe to call per event in
 * `analyzeScore`'s hot loop.
 */
export function buildVowelResolver(parsed: ParsedScore): VowelResolver {
	const byEvent = new Map<string, string>();

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
			// The score's syllabification must agree with the engine's; a
			// mismatch resolves this word to nothing (honest omission).
			if (sylOwners.length !== sw.slots.length) continue;

			for (let k = 0; k < sw.slots.length; k++) {
				const owner = sylOwners[k];
				const vowel = vowelOfSyllable(owner.word, owner.localIdx);
				if (!vowel) continue;
				for (const eventId of sw.slots[k]) {
					byEvent.set(eventId, vowel);
				}
			}
		}
	}

	return (event) => byEvent.get(event.id);
}
