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
 * written for. Exactly today's serialized row, the object literal
 * `persistGlosses` passes to `doc.save` in `+page.svelte`, which is what keeps
 * step 0 byte-compatible.
 */
export type GlossRow = [key: string, gloss: string, anchorWord: string];

/**
 * N.59 step 7, Ruling E: ONE additive field on the source record, carrying
 * everything a photographed page needs to come back without being re-read
 * wrongly or re-asked about.
 *
 * The clef, key, and octave are the singer's own answers (Ruling A). Re-asking
 * on every reload is the tool forgetting, which is the principle N.67 step 2's
 * restore already states.
 *
 * The original's name and hash are here because the RETENTION RULING requires
 * them "whether or not its bytes are kept", and for a photograph the bytes
 * kept are the GREYSCALE INK rather than the file the singer supplied.
 * `contentHash` above keeps its own contract and names the stored bytes; this
 * names what they came from, so the two facts never fight.
 */
export interface PageProvenance {
	clef: { sign: string; line: number };
	octaveChange: number;
	fifths: number;
	/** The file the singer supplied, which is not what is stored. */
	originalName: string;
	/** SHA-256 of the original's bytes. Empty where crypto.subtle was absent. */
	originalHash: string;
	/** Staff-line spacing measured after detection, per page. The floor is 20. */
	staffSpace: number[];
}

/** Design §2.2. `null` until step 2 stores the score's bytes. */
export interface SongSource {
	fileName: string;
	byteLength: number;
	importedAt: string;
	/** SHA-256 of the bytes. A name for immutable bytes, design §2.2. */
	contentHash: string;
	/** SHA-256 of the canonical vocal line, design §2.4. */
	fingerprint: string;
	/** N.59: present only where the score was read off a picture. */
	page?: PageProvenance | null;
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
 * branch, `handleExport` in `+page.svelte`, keeps working unchanged.
 */
export type FailureReason =
	| 'no-storage'
	| 'quota-exceeded'
	| 'write-failed'
	| 'malformed'
	| 'newer-schema';

/**
 * The record's own format version, which is what `schema` counts.
 *
 * N.67 step 6. NOTHING READ `schema` BEFORE THIS STEP. `validateRecord`
 * rebuilt every field from `emptySongRecord`, whose `schema` is the literal 1,
 * so a record written by a future Ilya was silently DOWNGRADED to 1 and then
 * written back at that number: design §4's "a version from the future" was
 * designed and never built. Only the binder's manifest schema was checked
 * (`binder.ts`), and that is a different number about a different object.
 */
export const RECORD_SCHEMA = 1;

export type Outcome = { ok: true } | { ok: false; reason: FailureReason };

/**
 * A load always yields a usable record. A failure is REPORTED beside it, never
 * thrown and never swallowed: that is `loadPairings`' contract
 * (`pairings.ts:408-422`) applied to the whole song.
 */
export interface LoadResult {
	record: SongRecord;
	reason?: FailureReason;
	/**
	 * The stored value EXACTLY AS IT WAS FOUND, carried only when `reason` is
	 * `malformed` or `newer-schema`.
	 *
	 * N.67 step 6, design §4's salvage path. `record` above is what the page can
	 * run on, rebuilt field by field, and it is NOT what the singer has: a
	 * record that failed validation has already lost something by the time it
	 * reaches `record`. This is the thing that still holds it, and it is what an
	 * export writes into a binder. Absent on a clean load, so the ordinary path
	 * carries no second copy of every song.
	 */
	raw?: unknown;
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
