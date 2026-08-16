/**
 * types.ts — the library's record shape.
 *
 * N.67 step 0, the socket. The record is Fable's design §2.2
 * (`docs/sessions/e52-fable-save-design_r1_2026-08-16.md`), schema 1, written
 * out here as types only. Step 0 stores it in today's six localStorage keys
 * through the legacy driver; step 1 puts the same record in IndexedDB.
 *
 * WHY THE DOCUMENT'S FIELD NAMES ARE NOT THE RECORD'S. The record is the
 * stored form and uses the design's names (`poem`, `fromScore`, `glosses`).
 * `SongDocument` keeps the page's own names (`inputText`, `fromScoreFields`,
 * `glossOverrides`, `glossAnchors`) so that step 0's rename inside
 * `+page.svelte` is mechanical and checkable: every touched identifier gains
 * a `doc.` and changes in no other way. The facade converts between the two,
 * in one place, and its conversion is where the tests are.
 */
import type { SongMetadata } from '$lib/types';
import type { MetadataField } from '$lib/metadata-provenance';
import type { PairingMap } from '$lib/shane/pairings';

/**
 * One stored gloss: the word key, the gloss, and the word the gloss was
 * written for. Exactly today's serialized row (`+page.svelte:601-603`), which
 * is what keeps step 0 byte-compatible.
 */
export type GlossRow = [key: string, gloss: string, anchorWord: string];

/** Design §2.2. `null` until step 2 stores the score's bytes. */
export interface SongSource {
	fileName: string;
	byteLength: number;
	importedAt: string;
	/** SHA-256 of the bytes. A name for immutable bytes, design §2.2. */
	contentHash: string;
	/** SHA-256 of the canonical vocal line, design §2.4. */
	fingerprint: string;
}

export interface SongRecord {
	schema: 1;
	id: string;
	/**
	 * Display name. Auto-naming is design §2.3 layer 3 and ships with the
	 * library door, step 4; nothing displays this yet, so nothing fills it.
	 */
	name: string;
	createdAt: string;
	updatedAt: string;
	poem: string;
	metadata: SongMetadata;
	fromScore: MetadataField[];
	glosses: GlossRow[];
	openSyllabification: boolean;
	pairings: PairingMap;
	source: SongSource | null;
}

/**
 * Why a save or a load did not do what it was asked to.
 *
 * `quota-exceeded` and `write-failed` are `savePairings`' own two reasons
 * (`pairings.ts:397-401`), kept verbatim so the drawer's existing quota
 * branch (`+page.svelte:1190`) keeps working unchanged.
 */
export type FailureReason =
	| 'no-storage'
	| 'quota-exceeded'
	| 'write-failed'
	| 'malformed';

export type Outcome = { ok: true } | { ok: false; reason: FailureReason };

/**
 * A load always yields a usable record. A failure is REPORTED beside it, never
 * thrown and never swallowed: that is `loadPairings`' contract
 * (`pairings.ts:408-422`) applied to the whole song.
 */
export interface LoadResult {
	record: SongRecord;
	reason?: FailureReason;
}

/** The six metadata fields, all empty. Matches `+page.svelte:256-263`. */
export function emptyMetadata(): SongMetadata {
	return { title: '', composer: '', poet: '', translator: '', opus: '', transcriber: '' };
}

/**
 * A song with nothing in it. Every default here is the page's own default, so
 * that a first visit through the document is indistinguishable from a first
 * visit through today's code.
 */
export function emptySongRecord(id: string, now: string): SongRecord {
	return {
		schema: 1,
		id,
		name: '',
		createdAt: now,
		updatedAt: now,
		poem: '',
		metadata: emptyMetadata(),
		fromScore: [],
		glosses: [],
		openSyllabification: false,
		pairings: {},
		source: null,
	};
}
