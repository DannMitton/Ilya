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
import type { SourceBytes, StorageDriver } from './driver';
import { requestPersistence as defaultRequestPersistence } from './quota';
import {
	emptyMetadata,
	emptySongRecord,
	type FailureReason,
	type GlossRow,
	type LoadResult,
	type Outcome,
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
 * The rows are built the way `persistGlosses` builds them
 * (`+page.svelte:601-603`), including the missing-anchor fallback to the empty
 * string, so what step 0 writes is what today writes.
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
	if (!isStringRecord(value)) return { record: fallback, reason: 'malformed' };

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

	return reason ? { record, reason } : { record };
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

	/** Never throws. A driver that throws is a failed load, not a crash. */
	async load(id: string): Promise<LoadResult> {
		let raw: LoadResult;
		try {
			raw = await this.#driver.load(id);
		} catch {
			return { record: emptySongRecord(id, this.#now()), reason: 'malformed' };
		}
		const validated = validateRecord(raw.record, id, this.#now());
		// The driver's own reason wins: "no storage" is a truer account of what
		// happened than "malformed", which is what an empty record looks like.
		return { record: validated.record, reason: raw.reason ?? validated.reason };
	}

	/**
	 * Never throws. `updatedAt` is stamped here, the one place that saves.
	 *
	 * `source` undefined leaves the stored bytes alone, which is every autosave;
	 * a value replaces them and `null` deletes them, in the same transaction as
	 * the record.
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
