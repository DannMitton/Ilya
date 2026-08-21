/**
 * library.ts — the facade.
 *
 * N.67 step 0. Plain TypeScript: no runes, no Svelte import, no browser API.
 * Everything that can lose a singer's work lives here, which is the whole
 * reason the seam is cut at this line. Vitest runs in node, so all of it is
 * gate-checked; `document.svelte.ts` above it is kept thin enough that what
 * it holds alone is the factory's ordering and the teardown.
 *
 * (Measured 2026-08-16: runes are INERT under this suite. Vitest runs in the
 * `node` environment, so a `.svelte.ts` module is compiled in server mode,
 * where `$state` is a plain assignment and `$effect` compiles to nothing. The
 * addendum's §5 expected `flushSync` to drive effects in a test; it does not,
 * here. Hence: no logic above this file.)
 *
 * NOTHING HERE THROWS TO A CALLER AND NOTHING HERE SWALLOWS. Every path
 * returns an outcome carrying a reason, which is `savePairings`' contract
 * (`pairings.ts:390-403`) generalized to the song, and is what keeps N.27's
 * prohibition satisfied by construction rather than by discipline.
 */
import type { SongMetadata } from '$lib/types';
import type { MetadataField } from '$lib/metadata-provenance';
import type { PairingMap } from '$lib/shane/pairings';
import type { PluralStore, SourceBytes, StorageDriver } from './driver';
import { requestPersistence as defaultRequestPersistence } from './quota';
import {
	emptyMetadata,
	emptySongRecord,
	RECORD_SCHEMA,
	type FailureReason,
	type GlossRow,
	type LoadResult,
	type Outcome,
	type PageProvenance,
	type SongRecord,
} from './types';

/**
 * The per-song state as the PAGE holds it, not as the record stores it. The
 * names are `+page.svelte`'s own, deliberately: see the note in `types.ts`.
 */
export interface SongFields {
	inputText: string;
	metadata: SongMetadata;
	fromScoreFields: ReadonlySet<MetadataField>;
	glossOverrides: ReadonlyMap<string, string>;
	glossAnchors: ReadonlyMap<string, string>;
	openSyllabification: boolean;
	pairings: PairingMap;
}

/* ── Record and page state, converted in one place ──────────────── */

export function fieldsFromRecord(record: SongRecord): SongFields {
	const glossOverrides = new Map<string, string>();
	const glossAnchors = new Map<string, string>();
	for (const [key, gloss, anchor] of record.glosses) {
		glossOverrides.set(key, gloss);
		glossAnchors.set(key, anchor);
	}
	return {
		inputText: record.poem,
		metadata: { ...record.metadata },
		fromScoreFields: new Set(record.fromScore),
		glossOverrides,
		glossAnchors,
		openSyllabification: record.openSyllabification,
		pairings: record.pairings,
	};
}

/**
 * The rows are built the way `persistGlosses` builds them in `+page.svelte`,
 * including the missing-anchor fallback to the empty string, so what step 0
 * writes is what today writes.
 */
export function recordFromFields(base: SongRecord, fields: SongFields): SongRecord {
	const glosses: GlossRow[] = [...fields.glossOverrides].map(([key, gloss]) => [
		key,
		gloss,
		fields.glossAnchors.get(key) ?? '',
	]);
	return {
		...base,
		poem: fields.inputText,
		metadata: { ...fields.metadata },
		fromScore: [...fields.fromScoreFields],
		glosses,
		openSyllabification: fields.openSyllabification,
		pairings: fields.pairings,
	};
}

/* ── Validation ─────────────────────────────────────────────────── */

function isStringRecord(value: unknown): value is Record<string, unknown> {
	return !!value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Force an unknown value into a usable record, field by field.
 *
 * A record that fails here is NOT overwritten and NOT deleted; this returns
 * something the page can run on and reports `malformed`, and step 6 builds the
 * salvage path the design's §4 describes. Per-field rather than all-or-nothing
 * because losing a song's poem to a bad pairing map would be the tool doing the
 * damage it exists to prevent.
 */
export function validateRecord(value: unknown, id: string, now: string): LoadResult {
	const fallback = emptySongRecord(id, now);
	if (!isStringRecord(value)) return { record: fallback, reason: 'malformed', raw: value };

	// A VERSION FROM THE FUTURE, design §4. Read-never: a newer Ilya may carry
	// fields this code has no name for, and reading the ones it recognizes would
	// produce a record that looks whole and is not. The raw value goes back
	// untouched so nothing is lost, and the read-only guard downstream is what
	// keeps it from being written at this version's number.
	if (typeof value.schema === 'number' && value.schema > RECORD_SCHEMA) {
		return { record: fallback, reason: 'newer-schema', raw: value };
	}

	let reason: FailureReason | undefined;
	const malformed = () => {
		reason ??= 'malformed';
	};
	const record = fallback;

	if (typeof value.id === 'string' && value.id !== '') record.id = value.id;
	if (typeof value.name === 'string') record.name = value.name;
	if (typeof value.createdAt === 'string') record.createdAt = value.createdAt;
	if (typeof value.updatedAt === 'string') record.updatedAt = value.updatedAt;
	if (typeof value.poem === 'string') record.poem = value.poem;
	else if (value.poem !== undefined) malformed();

	if (isStringRecord(value.metadata)) {
		const meta = emptyMetadata();
		for (const key of Object.keys(meta) as (keyof SongMetadata)[]) {
			const field = (value.metadata as Record<string, unknown>)[key];
			if (typeof field === 'string') meta[key] = field;
			else if (field !== undefined) malformed();
		}
		record.metadata = meta;
	} else if (value.metadata !== undefined) malformed();

	if (Array.isArray(value.fromScore)) {
		record.fromScore = value.fromScore.filter((f): f is MetadataField => typeof f === 'string' && f in record.metadata);
	} else if (value.fromScore !== undefined) malformed();

	if (Array.isArray(value.glosses)) {
		record.glosses = value.glosses.filter(
			(row): row is GlossRow =>
				Array.isArray(row) &&
				typeof row[0] === 'string' &&
				typeof row[1] === 'string' &&
				typeof row[2] === 'string' &&
				row[2] !== '',
		);
	} else if (value.glosses !== undefined) malformed();

	if (typeof value.openSyllabification === 'boolean') record.openSyllabification = value.openSyllabification;
	else if (value.openSyllabification !== undefined) malformed();

	if (isStringRecord(value.pairings)) record.pairings = value.pairings as PairingMap;
	else if (value.pairings !== undefined) malformed();

	// THE SOURCE WAS NEVER CARRIED THROUGH, and had not been since N.67 step 1.
	// This function rebuilds the record field by field from `emptySongRecord`,
	// whose `source` is null, and `source` was simply not among the fields it
	// copied. So every load returned a record with no source provenance at all.
	//
	// Two things depended on it and neither could work across a reload:
	//   - N.67 step 4a's chimera warning reads `doc.source?.fingerprint`, which
	//     was therefore always undefined on a fresh load, so `arrivalDecision`
	//     fell through to `attach` and the FIRST upload after any reload could
	//     never warn. It works within one session because the fingerprint is
	//     set in memory by the upload that just happened, which is why the walk
	//     did not catch it.
	//   - N.59 step 7's stored clef and key, which is how this was found.
	//
	// The bytes were never at risk: they live in their own store and are read
	// by `openLibrary`, not by this function.
	if (isStringRecord(value.source)) {
		const src = value.source as Record<string, unknown>;
		if (typeof src.fileName === 'string' && typeof src.contentHash === 'string') {
			record.source = {
				fileName: src.fileName,
				byteLength: typeof src.byteLength === 'number' ? src.byteLength : 0,
				importedAt: typeof src.importedAt === 'string' ? src.importedAt : '',
				contentHash: src.contentHash,
				fingerprint: typeof src.fingerprint === 'string' ? src.fingerprint : '',
				page: validatePage(src.page),
			};
		} else malformed();
	} else if (value.source !== undefined && value.source !== null) malformed();

	return reason ? { record, reason, raw: value } : { record };
}

/**
 * N.59 step 7. A stored page's provenance, or null. Anything malformed is
 * dropped to null rather than half-kept: a half-read clef would be read back as
 * a confident answer the singer never gave, and re-asking is the honest
 * failure. The picture itself is unaffected either way.
 */
function validatePage(value: unknown): PageProvenance | null {
	if (!isStringRecord(value)) return null;
	const v = value as Record<string, unknown>;
	const clef = v.clef as Record<string, unknown> | undefined;
	if (!isStringRecord(clef) || typeof clef.sign !== 'string' || typeof clef.line !== 'number') {
		return null;
	}
	if (typeof v.octaveChange !== 'number' || typeof v.fifths !== 'number') return null;
	return {
		clef: { sign: clef.sign, line: clef.line },
		octaveChange: v.octaveChange,
		fifths: v.fifths,
		originalName: typeof v.originalName === 'string' ? v.originalName : '',
		originalHash: typeof v.originalHash === 'string' ? v.originalHash : '',
		staffSpace: Array.isArray(v.staffSpace)
			? v.staffSpace.filter((n): n is number => typeof n === 'number')
			: [],
	};
}

/* ── The facade ─────────────────────────────────────────────────── */

export class Library {
	readonly #driver: StorageDriver;
	readonly #now: () => string;
	readonly #requestPersistence: () => Promise<unknown>;
	#persistenceAsked = false;
	#lastSavedAt: string | null = null;

	constructor(
		driver: StorageDriver,
		now: () => string = () => new Date().toISOString(),
		requestPersistence: () => Promise<unknown> = defaultRequestPersistence,
	) {
		this.#driver = driver;
		this.#now = now;
		this.#requestPersistence = requestPersistence;
	}

	get driverKind(): string {
		return this.#driver.kind;
	}

	/**
	 * The plural half of the driver, or undefined where there is none.
	 *
	 * N.67 step 4b. The facade holds the driver privately, so this is how the
	 * door reaches list, remove, and find without any caller learning which
	 * driver it is running on. Undefined means "this browser has one song", and
	 * the door renders accordingly rather than offering a control that cannot work.
	 */
	get plural(): PluralStore | undefined {
		return this.#driver.plural;
	}

	/** Never throws. A driver that throws is a failed load, not a crash. */
	async load(id: string): Promise<LoadResult> {
		let found: LoadResult;
		try {
			found = await this.#driver.load(id);
		} catch {
			return { record: emptySongRecord(id, this.#now()), reason: 'malformed' };
		}
		const validated = validateRecord(found.record, id, this.#now());
		// The driver's own reason wins: "no storage" is a truer account of what
		// happened than "malformed", which is what an empty record looks like.
		const reason = found.reason ?? validated.reason;
		// N.67 step 6. The stored value is carried ONLY where validation failed,
		// which is the one case anything downstream needs it: the export writes
		// it into a binder rather than the rebuilt record, so salvage carries
		// what the singer actually has and not what this code could make of it.
		return reason && validated.raw !== undefined
			? { record: validated.record, reason, raw: validated.raw }
			: { record: validated.record, reason };
	}

	/**
	 * Never throws. `updatedAt` is stamped here, the one place that saves.
	 *
	 * `source` undefined leaves the stored bytes alone, which is every autosave;
	 * a value replaces them and `null` deletes them, in the same transaction as
	 * the record.
	 *
	 * ── THE REPORTING SEAM, AND A STANDING RECOMMENDATION FOR N.27 ──────────
	 *
	 * This method and `load` above are the seam: every write in the library
	 * returns an `Outcome` carrying a `FailureReason`, the page renders that
	 * reason through `notices.ts`, and nothing between the two is allowed to
	 * catch and say nothing. That is what satisfies N.27's prohibition, "do not
	 * add a second silent save site while N.27 is open" (CONTRACT §6), by
	 * construction rather than by discipline.
	 *
	 * **THE RECOMMENDATION, RECORDED HERE AND NOT BUILT (N.67 step 6):** when
	 * N.27 is built, `profileStore.saveStore` (`profileStore.ts:217-225`, which
	 * the brief cited as `:216-224`; read off the tree at this commit) routes
	 * through this seam. It is the last catch-and-drop of its kind in the tree:
	 * it writes the singer's voice profile to `localStorage`, and on quota or a
	 * serialization failure it swallows the exception and returns `void`, so a
	 * caller cannot know the write refused and the singer is never told. Giving
	 * it an outcome type and a reason is the whole change; the sentence it needs
	 * already exists as `storage.quotaFull` and `storage.saveFailed.generic`.
	 *
	 * **N.27 IS NOT BUILT HERE.** The voice profile is not a song, it does not
	 * live in this vault (design §2.2 leaves `shane.profiles.v2` where it is),
	 * and moving it would be its own step with its own walk.
	 */
	async save(record: SongRecord, source?: SourceBytes | null): Promise<Outcome> {
		const stamped = { ...record, updatedAt: this.#now() };
		let outcome: Outcome;
		try {
			outcome = await this.#driver.save(stamped, source);
		} catch {
			return { ok: false, reason: 'write-failed' };
		}
		// Design §4: ask to be kept at the FIRST REAL SAVE, not at boot, so the
		// request is attached to the singer having actually made something. Never
		// awaited into the save path: a slow or refused request must not delay
		// or fail a write that already succeeded.
		if (outcome.ok && !this.#persistenceAsked) {
			this.#persistenceAsked = true;
			void this.#requestPersistence();
		}
		if (outcome.ok) this.#lastSavedAt = stamped.updatedAt;
		return outcome;
	}

	/** The bytes of the song's score file, or null where there are none. */
	async loadSource(songId: string): Promise<SourceBytes | null> {
		try {
			return await this.#driver.loadSource(songId);
		} catch {
			return null;
		}
	}

	/**
	 * Write a record back EXACTLY AS IT CAME, with no stamp and no rebuild.
	 *
	 * N.67 step 6, and the ONE write in this class that does not go through
	 * `save`. It exists for a single caller: an import carrying a song that
	 * failed validation in the origin it was exported from. Stamping `updatedAt`
	 * on a damaged record would edit the very thing being preserved, and
	 * rebuilding it through `recordFromFields` would launder the damage into a
	 * record that looks whole and is not.
	 *
	 * IT IS NOT SILENT. The outcome carries a reason like every other write, so
	 * N.27's prohibition holds here too.
	 *
	 * A value that cannot be a record at all is REFUSED rather than coerced: the
	 * songs store keys on `id`, so a value that is not an object, or whose `id`
	 * is not the string the caller asked for, would either fail the put or land
	 * under a key nothing can find again.
	 */
	async salvage(value: unknown, id: string, source?: SourceBytes | null): Promise<Outcome> {
		if (!isStringRecord(value) || value.id !== id) return { ok: false, reason: 'malformed' };
		try {
			return await this.#driver.save(value as unknown as SongRecord, source);
		} catch {
			return { ok: false, reason: 'write-failed' };
		}
	}

	/** The `updatedAt` of the last write this tab made. For the two-tab notice. */
	get lastSavedAt(): string | null {
		return this.#lastSavedAt;
	}
}

/* ── The save cadence ───────────────────────────────────────────── */

/**
 * Design §4.3: a trailing debounce, with a maximum wait so that continuous
 * activity still checkpoints, and an explicit flush for `pagehide`.
 *
 * Plain TypeScript with injected timers so the coalescing rule is tested
 * rather than asserted. The rule: a burst of changes writes ONCE, and a change
 * arriving during a write is never dropped, it schedules the next one.
 */
export const SAVE_DEBOUNCE_MS = 800;
export const SAVE_MAX_WAIT_MS = 5000;

export interface SaveScheduler {
	/** Something changed. */
	schedule(): void;
	/** Write now if anything is pending, and wait for it. */
	flush(): Promise<void>;
	/** Is there unwritten work? The two-tab rule turns on this answer. */
	isPending(): boolean;
	/** Drop pending timers without writing. */
	dispose(): void;
}

export function createSaveScheduler(
	run: () => Promise<void>,
	options: {
		delayMs?: number;
		maxWaitMs?: number;
		setTimer?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
		clearTimer?: (handle: ReturnType<typeof setTimeout>) => void;
	} = {},
): SaveScheduler {
	const delayMs = options.delayMs ?? SAVE_DEBOUNCE_MS;
	const maxWaitMs = options.maxWaitMs ?? SAVE_MAX_WAIT_MS;
	const setTimer = options.setTimer ?? ((fn, ms) => setTimeout(fn, ms));
	const clearTimer = options.clearTimer ?? ((handle) => clearTimeout(handle));

	let trailing: ReturnType<typeof setTimeout> | null = null;
	let ceiling: ReturnType<typeof setTimeout> | null = null;
	let dirty = false;
	let running: Promise<void> | null = null;

	function clearTimers(): void {
		if (trailing !== null) clearTimer(trailing);
		if (ceiling !== null) clearTimer(ceiling);
		trailing = null;
		ceiling = null;
	}

	async function fire(): Promise<void> {
		clearTimers();
		if (!dirty) return;
		if (running) {
			// A write is in flight. Stay dirty; the tail below re-fires.
			await running;
			return;
		}
		dirty = false;
		running = run();
		try {
			await running;
		} finally {
			running = null;
		}
		// Changed while that write was in flight: write again, or the last
		// edit of a burst would be the one edit that never landed.
		if (dirty) await fire();
	}

	return {
		schedule(): void {
			dirty = true;
			if (trailing !== null) clearTimer(trailing);
			trailing = setTimer(() => void fire(), delayMs);
			ceiling ??= setTimer(() => void fire(), maxWaitMs);
		},
		async flush(): Promise<void> {
			await fire();
		},
		isPending(): boolean {
			return dirty || running !== null;
		},
		dispose(): void {
			clearTimers();
			dirty = false;
		},
	};
}

/* ── The chimera warning (N.67 step 4a, Dann's ruling 2026-08-16) ── */

/**
 * Should an arriving score replace this song, or attach to it?
 *
 * BEFORE THIS EXISTED, a second score overwrote the song's title and its stored
 * file in place while the first song's placements survived onto music they were
 * never made for. Measured at `5c9c7f3`: two of five silently landed on notes
 * of the new piece, because event ids are positional. The record became a
 * chimera, and nothing said so.
 *
 * TWO CONDITIONS, BOTH REQUIRED.
 *
 * The fingerprint must differ, which means it is not the same music (§2.4).
 * And at least one stored placement must be orphaned, which is what separates a
 * different piece from a corrected note: correcting a pitch keeps every event's
 * measure and position, so its id survives and nothing is orphaned. That is
 * design §2.4's own promise, that "a singer correcting one wrong note ... is
 * fine", kept exactly.
 *
 * WHY NOT ALSO TEST PITCHES. A transposed edition changes every pitch while
 * keeping every position, and in vocal repertoire that is a common and entirely
 * legitimate re-upload where the placements must survive. A proportion-of-
 * pitches-changed rule fires on it at nearly 100%, indistinguishable from a
 * different piece. The hole this leaves, a different piece whose rhythm matches
 * the old one note for note across a whole score, is an artefact of small test
 * fixtures rather than of real music, and it is named in `STATE.md` rather than
 * closed by a musical rule invented inside a warning dialog.
 */
export function arrivalDecision(input: {
	storedFingerprint: string | null | undefined;
	incomingFingerprint: string;
	orphanCount: number;
}): 'attach' | 'ask' {
	// No stored fingerprint means this song has never had a score, so there is
	// nothing to be different from and nothing to lose.
	if (!input.storedFingerprint) return 'attach';
	if (input.storedFingerprint === input.incomingFingerprint) return 'attach';
	return input.orphanCount >= 1 ? 'ask' : 'attach';
}
