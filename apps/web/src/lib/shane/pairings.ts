/**
 * pairings.ts
 *
 * N.55b: the pairing layer. A sparse correction map from score EVENT ID to
 * what the singer decided that note carries.
 *
 * WHY A CORRECTION LAYER AND NOT A FIELD ON ParsedScore. `types.ts:470-479`
 * in score-parser says melismas are encoded by the ABSENCE of a syllable,
 * so the parsed score has two states and N.55b needs three. The third has
 * nowhere to live there. (Same wall LilyPond hit: its documentation forbids
 * `_` for skipping because an underscore already means melisma.)
 *
 * WHY BY VALUE AND NOT BY REFERENCE (R6, Dann, E.47). A pairing is a record
 * of a decision, not a derivation of the engine's. There is no stable
 * syllable id in this tree and inventing one would not survive the two
 * events it would exist to survive: a re-division is not a rename, and
 * `+page.svelte:275`, `:321`, `:376` rebuild the word objects from scratch
 * on every re-transcription. So a pairing COPIES the text at the moment of
 * the click, exactly as Finale's Click Assignment transfers a syllable onto
 * a note rather than pointing at the Lyrics window.
 *
 * WHY THE VOWEL IS STORED (R8, Dann, E.47). `vowelOfSyllable` reads the
 * engine's transcription log, not the syllable's IPA string, so a pairing
 * carrying only text would print a syllable and carry no acoustic marks.
 * The glyph is an INPUT to the forecast, never its output: nothing measured
 * is stored here and recalibration still recomputes everything downstream.
 * This is a deliberate, named exception to "do not store anything derived".
 *
 * WHAT THIS FILE MAY NOT DO. It never writes to `ParsedScore`, it never
 * touches `VocalLineEvent`, and it never proposes the `empty` state: for
 * Ilya to mark a note deliberately empty is a claim, and Ilya may only ever
 * leave a note undecided (Dann, E.46).
 */

import type { LineData, WordStackData } from '$lib/types';
import { CYRILLIC_VOWEL, vowelOfSyllable } from '$lib/shane/vowel-resolver';

/**
 * The engine's stress mark, declared at `engine.ts:230` as `'stress'`.
 * Written as an escape rather than the literal so this file stays ASCII.
 * U+02C8 MODIFIER LETTER VERTICAL LINE.
 */
const STRESS_MARK = '\u02C8';

/**
 * U+00A0 NO-BREAK SPACE, between a clitic and its host on the CYRILLIC line.
 *
 * The IPA line fuses a vowelless clitic to its host with NO space, because
 * that is the phonetics and because it is what the tree already does
 * (`pipeline.ts:967` for an enclitic, `:923-936` for a proclitic tucking in
 * behind the stress mark). THE CYRILLIC IS DIFFERENT: «v lesu» is two words
 * and keeps its space in the orthography. It is a hard space rather than an
 * ordinary one because the two sit inside a single underlay cell under a
 * single note, and nothing may break them apart there.
 *
 * Dann, E.47, catching that this code dropped the clitic's Cyrillic
 * altogether rather than spacing it.
 */
const NBSP = '\u00A0';

/** The localStorage key. Interim until N.67; migrated wholesale then (R5). */
export const PAIRINGS_KEY = 'ilya:pairings';

/**
 * Where a slot came from in the transcription. A BREADCRUMB, never a key:
 * the map is keyed by event id. This is read for exactly one purpose, to
 * compare the stored text against the current slot at the same position and
 * report drift (see `auditPairings`).
 */
export interface SlotOrigin {
	lineIndex: number;
	wordIndex: number;
	/** The nucleus ordinal WITHIN its word, not within the line. */
	slotIndex: number;
}

/**
 * One consumable unit of the queue: a Cyrillic-vowel nucleus with its
 * vowelless clitics already fused in.
 *
 * N.9 is why this is not a syllable. A word with no vowel can never own a
 * slot on the score side (`vowel-resolver.ts:478-496`), yet the engine still
 * returns one syllable for it (`engine.ts:1119` falls back to `[word]`), so
 * walking `WordStackData.syllables` would hand a bare consonant to a note.
 */
export interface Slot {
	/** The syllable's Cyrillic, verbatim from the engine. */
	cyrillic: string;
	/** The full syllable IPA, stress mark included, clitics fused. */
	ipa: string;
	/** The single sung vowel, or undefined where the engine resolved none. */
	vowel: string | undefined;
	origin: SlotOrigin;
}

/** What one note carries. Keyed by event id in a `PairingMap`. */
export type Pairing =
	| {
			kind: 'syllable';
			cyrillic: string;
			ipa: string;
			vowel: string | undefined;
			origin: SlotOrigin;
	  }
	| { kind: 'melisma' }
	| { kind: 'empty' };

/** Event id to pairing. Sparse: an absent id is UNDECIDED, and draws bare. */
export type PairingMap = Record<string, Pairing>;

/* ── The queue ──────────────────────────────────────────────────── */

/** The syllable's IPA with the engine's stress mark restored.
 *  Stress is a FLAG on `SyllableData` (`engine.ts:52-56`), not a character
 *  in `.ipa`, and reading `.ipa` alone once printed Ilya's transcription
 *  with the stress removed (`vowel-resolver.ts:295-299`). */
/**
 * The syllable's Cyrillic WITH THE SINGER'S CASE.
 *
 * `engine.ts:1026` lowercases before syllabifying, so `SyllableData.cyrillic`
 * has lost the capital the singer typed. That never mattered while these
 * strings stayed inside Transcribe's own display, and it started mattering
 * the moment N.55b put them on the page: the score-underlay path prints the
 * capital and this path printed lowercase, on the same sheet. Observed on
 * `08a0dae`, 13 August, with a lyric-bearing negative control beside it.
 *
 * `cleanWord` keeps the case and the syllabifier only lowercases and slices,
 * so the offsets line up. Where they do not, the engine's own string stands
 * rather than a wrong slice.
 */
function cyrOfSyllable(w: WordStackData, k: number): string {
	const own = w.syllables[k]?.cyrillic ?? '';
	let at = 0;
	for (let i = 0; i < k; i++) at += w.syllables[i]?.cyrillic.length ?? 0;
	const slice = w.cleanWord.slice(at, at + own.length);
	return slice.length === own.length && slice.toLowerCase() === own.toLowerCase()
		? slice
		: own;
}

function syllableIpa(w: WordStackData, k: number): string {
	const syl = w.syllables[k];
	if (!syl) return '';
	return syl.isStressed && !syl.ipa.includes(STRESS_MARK)
		? STRESS_MARK + syl.ipa
		: syl.ipa;
}

/**
 * Build the consumable slot queue from Transcribe's own output.
 *
 * The clitic rule is N.9's and it is not re-derived here: a word carrying no
 * Cyrillic vowel owns no slot, and its IPA rides on the slot at either end,
 * a proclitic tucked in BEHIND the stress mark and an enclitic appended.
 * That rule is already implemented at three sites and this mirrors them:
 * `pipeline.ts:919-943` and `:960-976`, `syllable-utils.ts:289-332`, and
 * `vowel-resolver.ts:497-512` with `:544-554`.
 *
 * Direction follows the pipeline's own classification where it has one, and
 * falls back to `vowel-resolver.ts:503-506`'s rule otherwise: before any
 * nucleus it is proclitic, after one it is enclitic.
 */
export function buildSlotQueue(lines: readonly LineData[]): Slot[] {
	const queue: Slot[] = [];
	for (const line of lines) {
		// Proclitic IPA waiting for the next nucleus in THIS line. A clitic
		// never reaches across a line break.
		let pendingIpa = '';
		let pendingCyr = '';
		let lastInLine: Slot | null = null;
		for (let wordIndex = 0; wordIndex < line.words.length; wordIndex++) {
			const w = line.words[wordIndex];
			if (!CYRILLIC_VOWEL.test(w.cleanWord)) {
				const cliticIpa = w.ipaContent || '';
				const cliticCyr = w.cleanWord;
				if (!cliticIpa && !cliticCyr) continue;
				const enclitic = w.isEnclitic || (!w.isProclitic && lastInLine !== null);
				if (enclitic && lastInLine) {
					lastInLine.ipa = lastInLine.ipa + cliticIpa;
					lastInLine.cyrillic = lastInLine.cyrillic + NBSP + cliticCyr;
				} else {
					pendingIpa += cliticIpa;
					pendingCyr = pendingCyr ? pendingCyr + NBSP + cliticCyr : cliticCyr;
				}
				continue;
			}
			for (let k = 0; k < w.syllables.length; k++) {
				let ipa = syllableIpa(w, k);
				if (k === 0 && pendingIpa) {
					// The stress mark stays leftmost and the clitic tucks in behind
					// it, following `vowel-resolver.ts:547-551`.
					ipa = ipa.startsWith(STRESS_MARK)
						? STRESS_MARK + pendingIpa + ipa.slice(STRESS_MARK.length)
						: pendingIpa + ipa;
				}
				const cyr = cyrOfSyllable(w, k);
				const slot: Slot = {
					cyrillic: k === 0 && pendingCyr ? pendingCyr + NBSP + cyr : cyr,
					ipa,
					vowel: vowelOfSyllable(w, k),
					origin: { lineIndex: w.lineIndex, wordIndex, slotIndex: k },
				};
				queue.push(slot);
				lastInLine = slot;
			}
			pendingIpa = '';
			pendingCyr = '';
		}
	}
	return queue;
}

/* ── The first pass (R3) ────────────────────────────────────────── */

/**
 * One slot per note, in document order, until one side runs out.
 *
 * IT NEVER CREATES A MELISMA (Dann, E.46). The ordinary outcome on a
 * melismatic setting is trailing notes with an empty queue.
 *
 * NOTHING IS CONSUMED AND NOTHING IS DISCARDED. The queue is rebuilt from
 * the transcription on every accept, so slots this pass did not reach are
 * still there to be assigned by hand, which is Finale's behaviour too: the
 * Lyrics window keeps what you have not clicked yet.
 *
 * NO PROVENANCE IS RECORDED, and that is Dann's ruling of E.47, against my
 * design. A mark on every syllable carries no information, and unlike
 * inferred stress or a withheld syllable, a misplaced syllable is something
 * the singer can simply SEE. The drawer says in one sentence that these are
 * proposals; the page says it with the syllables themselves.
 *
 * @param eventIds sung note events in document order, rests already excluded
 */
export function firstPass(eventIds: readonly string[], queue: readonly Slot[]): PairingMap {
	const map: PairingMap = {};
	const n = Math.min(eventIds.length, queue.length);
	for (let i = 0; i < n; i++) {
		const slot = queue[i];
		map[eventIds[i]] = {
			kind: 'syllable',
			cyrillic: slot.cyrillic,
			ipa: slot.ipa,
			vowel: slot.vowel,
			origin: slot.origin,
		};
	}
	return map;
}

/* ── The witness ────────────────────────────────────────────────── */

/** One pairing whose stored text no longer matches the slot it came from. */
export interface PairingDrift {
	eventId: string;
	stored: string;
	current: string | undefined;
}

/**
 * Compare every stored pairing against the current queue at its origin.
 *
 * A mismatch NEITHER DELETES NOR SILENTLY USES. The page prints what the
 * singer decided, because that is what they decided; the drawer reports the
 * count. Drawer manipulates, page displays and prints.
 */
export function auditPairings(map: PairingMap, queue: readonly Slot[]): PairingDrift[] {
	const byOrigin = new Map<string, Slot>();
	for (const s of queue) {
		byOrigin.set(`${s.origin.lineIndex}-${s.origin.wordIndex}-${s.origin.slotIndex}`, s);
	}
	const drift: PairingDrift[] = [];
	for (const [eventId, p] of Object.entries(map)) {
		if (p.kind !== 'syllable') continue;
		const key = `${p.origin.lineIndex}-${p.origin.wordIndex}-${p.origin.slotIndex}`;
		const current = byOrigin.get(key);
		if (current?.cyrillic !== p.cyrillic) {
			drift.push({ eventId, stored: p.cyrillic, current: current?.cyrillic });
		}
	}
	return drift;
}

/* ── Storage (R5) ───────────────────────────────────────────────── */

export type SaveOutcome = { ok: true } | { ok: false; reason: string };

function storage(): Storage | null {
	try {
		return typeof localStorage === 'undefined' ? null : localStorage;
	} catch {
		return null;
	}
}

/**
 * Write the map.
 *
 * THIS SAVE DOES NOT SWALLOW ITS EXCEPTION. N.27 is open precisely because
 * `profileStore.ts:220-224` loses a calibration in silence, and a second
 * silent save site would be the same defect written twice. The caller gets
 * the failure and is responsible for showing it.
 */
export function savePairings(map: PairingMap): SaveOutcome {
	const s = storage();
	if (!s) return { ok: false, reason: 'no-storage' };
	try {
		s.setItem(PAIRINGS_KEY, JSON.stringify(map));
		return { ok: true };
	} catch (err) {
		const reason =
			err instanceof DOMException && (err.name === 'QuotaExceededError' || err.code === 22)
				? 'quota-exceeded'
				: 'write-failed';
		return { ok: false, reason };
	}
}

/** Read the map. An unreadable or malformed value yields an empty map, and
 *  that case is reported rather than assumed: `loadPairings` returns the
 *  reason alongside so the drawer can say the pairings did not come back. */
export function loadPairings(): { map: PairingMap; reason?: string } {
	const s = storage();
	if (!s) return { map: {}, reason: 'no-storage' };
	const raw = s.getItem(PAIRINGS_KEY);
	if (raw === null) return { map: {} };
	try {
		const parsed: unknown = JSON.parse(raw);
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			return { map: {}, reason: 'malformed' };
		}
		return { map: parsed as PairingMap };
	} catch {
		return { map: {}, reason: 'unparseable' };
	}
}

/* -- The override layer (R7) ------------------------------------- */

/**
 * Wrap a vowel resolver so a hand pairing outranks it, INCLUDING the
 * resolver's whole-word withhold (`vowel-resolver.ts:523-529`). A withhold
 * is Ilya declining to guess; a pairing is the singer not guessing.
 *
 * A `syllable` pairing wins even when its own `vowel` is undefined, because
 * "the singer paired this and no vowel resolved" is a different fact from
 * "no pairing exists here", and falling through would print an acoustic
 * mark the singer never asked for.
 *
 * GENERIC over the event type rather than importing `VocalLineEvent`, so
 * this module stays free of a score-parser dependency.
 *
 * It must be generic and NOT a plain `{ id: string }` parameter, and the
 * reason is the trap I fell into: parameter positions are contravariant, so
 * a `VowelResolver` is assignable to `(ev: { id: string }) => ...` only if
 * `{ id: string }` satisfies `VocalLineEvent`, which it does not. Having an
 * `id` makes the assignment work in the RETURN position and fail in the
 * ARGUMENT position. Inferring `E` from the caller sidesteps both.
 */
export function withPairedVowel<E extends { id: string }>(
	base: (ev: E) => string | undefined,
	map: PairingMap | undefined,
): (ev: E) => string | undefined {
	if (!map) return base;
	return (ev) => {
		const p = map[ev.id];
		if (p?.kind === 'syllable') return p.vowel;
		return base(ev);
	};
}

/**
 * The Cyrillic a pairing puts under each note. Undefined when there is
 * none, so the renderer takes its existing no-op path and an unpaired score
 * renders byte-for-byte as it did before N.55b.
 */
export function pairedCyrillic(map: PairingMap | undefined): Record<string, string> | undefined {
	if (!map) return undefined;
	const out: Record<string, string> = {};
	for (const [id, p] of Object.entries(map)) {
		if (p.kind === 'syllable' && p.cyrillic) out[id] = p.cyrillic;
	}
	return Object.keys(out).length > 0 ? out : undefined;
}
