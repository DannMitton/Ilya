/**
 * N.179, clear placements by scope, and place from here (QUEUE row 14, brief
 * `brief-code-place-by-scope_r1_2026-10-01.md`). Dann, 2026-10-01 02:42: "My
 * instinct is to replicate Finale's functionality inasmuch as this is possible
 * in a scaled-down form for Ilya." Ruled ready for a brief at 02:43.
 *
 * Pure, so a test can reach it without mounting the page. `+page.svelte` owns
 * the presses: it finds the selected note, pushes the undo entry, and writes.
 * The snapshot undo (`undo-history.svelte.ts`) saves the whole pairing map
 * before the write, so one press is one undo entry and nothing here has an
 * inverse to get wrong.
 *
 * WHAT CLEARING TOUCHES: `doc.pairings` and nothing else. The poem, its
 * glosses, and the word edits are not this file's business. A cleared note's
 * syllable returns to the tray because the tray is derived from the queue and
 * the map (`LoupeSyllables`: a slot is placed when some note carries a pairing
 * from it), so there is nothing to hand back.
 */

import { firstPass, type PairingMap, type Slot } from './pairings';

/** The scopes Clear offers, in the order the pill opens them. */
export type ClearScope = 'measure' | 'toEnd' | 'all';
export const CLEAR_SCOPES: readonly ClearScope[] = ['measure', 'toEnd', 'all'];

/** One sung note in document order: every note but a rest. */
export interface PlacementNote {
	id: string;
	measureIndex: number;
	/** May a syllable begin here? False for a tie's continuation (`syllableTargetIds`). */
	target: boolean;
}

/** What the loupe's placement row needs from the page. */
export interface PlacementControls {
	onclear: (scope: ClearScope) => void;
	onfromhere: () => void;
	/** A note is selected, which the two narrow scopes need. */
	hasSelection: boolean;
	/** Something is placed, so there is something to clear. */
	canClear: boolean;
	/** A note is selected and the tray still holds a syllable. */
	canFromHere: boolean;
}

/** The notes a scope covers, from the selected note. Empty where it needs a selection and there is none. */
export function noteIdsInScope(notes: readonly PlacementNote[], selectedId: string | null, scope: ClearScope): string[] {
	if (scope === 'all') return notes.map((n) => n.id);
	const at = selectedId === null ? -1 : notes.findIndex((n) => n.id === selectedId);
	if (at === -1) return [];
	if (scope === 'toEnd') return notes.slice(at).map((n) => n.id);
	const measure = notes[at].measureIndex;
	return notes.filter((n) => n.measureIndex === measure).map((n) => n.id);
}

/**
 * The map with those notes' entries removed, or `null` when nothing was there
 * to remove (so the caller pushes no undo entry for a press that did nothing).
 *
 * Every kind of entry goes: a syllable, a melisma mark, an `empty` mark. A
 * placement is whatever the map holds for the note. THE WHOLE PIECE returns an
 * empty map, which also drops entries whose note no longer exists (an orphan
 * from a re-upload), as the retired Start placement over did.
 */
export function clearPlacements(
	map: PairingMap,
	notes: readonly PlacementNote[],
	selectedId: string | null,
	scope: ClearScope,
): PairingMap | null {
	if (scope === 'all') return Object.keys(map).length > 0 ? {} : null;
	const next: PairingMap = { ...map };
	let removed = 0;
	for (const id of noteIdsInScope(notes, selectedId, scope)) {
		if (id in next) {
			delete next[id];
			removed++;
		}
	}
	return removed > 0 ? next : null;
}

/** The tray's remaining syllables: the slots no note's pairing came from, in the queue's order. */
export function unplacedSlots(slots: readonly Slot[], map: PairingMap): Slot[] {
	const key = (o: Slot['origin']) => `${o.lineIndex}-${o.wordIndex}-${o.slotIndex}`;
	const placed = new Set<string>();
	for (const p of Object.values(map)) if (p.kind === 'syllable') placed.add(key(p.origin));
	return slots.filter((s) => !placed.has(key(s.origin)));
}

/**
 * Seat the tray's remaining syllables one per open note, in order, from the
 * selected note to the end. An open note is one that carries no decision at
 * all (`map[id] === undefined`, the test `nextOpenSyllableTarget` applies), so a
 * note that already holds a syllable is skipped, and so is a melisma or an
 * `empty` mark: melismas are left to the singer. It stops at the end rather
 * than wrapping. `null` when nothing would be placed.
 *
 * The pairing is `firstPass`, the same one the retired handler used; the page
 * runs `seatCliticFolds` over the result.
 */
export function placeFromHere(
	map: PairingMap,
	notes: readonly PlacementNote[],
	selectedId: string | null,
	slots: readonly Slot[],
): PairingMap | null {
	const at = selectedId === null ? -1 : notes.findIndex((n) => n.id === selectedId);
	if (at === -1) return null;
	const open = notes
		.slice(at)
		.filter((n) => n.target && map[n.id] === undefined)
		.map((n) => n.id);
	const remaining = unplacedSlots(slots, map);
	if (open.length === 0 || remaining.length === 0) return null;
	return { ...map, ...firstPass(open, remaining) };
}
