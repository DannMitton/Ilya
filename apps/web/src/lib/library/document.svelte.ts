/**
 * document.svelte.ts — the song document.
 *
 * N.67 step 0, Fable's recommended socket
 * (`docs/sessions/e52-fable-save-socket_r1_2026-08-16.md` §1, option C). The
 * page hands ownership of the per-song state to this object, reads and writes
 * it through the object, and the object alone talks to storage.
 *
 * THIS FILE IS DELIBERATELY THIN, AND HERE IS THE REASON. Runes are inert
 * under this repository's vitest suite: it runs in the `node` environment, so
 * a `.svelte.ts` module compiles in server mode, where `$state` is a plain
 * assignment and `$effect` compiles to nothing (measured 2026-08-16, which
 * corrects the socket addendum's §5). Everything with a decision in it lives
 * in `library.ts`, which is plain TypeScript and fully gate-checked. What is
 * left here is field-holding, the factory's ordering, and the teardown.
 *
 * THE RACE IS GONE, NOT GUARDED. `+page.svelte:94-99` held a flag, with an
 * honest comment, to stop the save effect firing on the unrestored `{}`
 * default one render ahead of `onMount`. There is no flag here because there
 * is no interval to guard: `open()` awaits the load and constructs from the
 * result, and the autosave effect is created after that, inside the instance.
 * An effect cannot observe unrestored state that never existed.
 */
import type { SongMetadata } from '$lib/types';
import type { MetadataField } from '$lib/metadata-provenance';
import type { PairingMap } from '$lib/shane/pairings';
import {
	createSaveScheduler,
	fieldsFromRecord,
	recordFromFields,
	type Library,
	type SaveScheduler,
	type SongFields,
} from './library';
import {
	emptyMetadata,
	type FailureReason,
	type LoadResult,
	type Outcome,
	type SongRecord,
	type SongSource,
} from './types';

export type SaveState =
	| { status: 'saved' }
	| { status: 'saving' }
	| { status: 'failed'; reason: FailureReason };

/**
 * Step 0 is single-song. The id is a constant rather than a `randomUUID`
 * because nothing persists it yet: the six legacy keys have no room for a
 * second song. Step 1's migration mints the real, permanent id (design §3).
 */
export const LEGACY_SONG_ID = 'legacy-single-song';

export class SongDocument {
	/* The per-song state. These names are `+page.svelte`'s own names, so that
	   step 0's rename is `x` to `doc.x` and nothing else. */
	inputText = $state('');
	metadata = $state<SongMetadata>(emptyMetadata());
	fromScoreFields = $state<ReadonlySet<MetadataField>>(new Set<MetadataField>());
	glossOverrides = $state<Map<string, string>>(new Map());
	glossAnchors = $state<Map<string, string>>(new Map());
	openSyllabification = $state(false);
	pairings = $state<PairingMap>({});

	/** What the drawer's storage notice renders. Replaces `pairingsSaveError`. */
	saveState = $state<SaveState>({ status: 'saved' });
	/** Why the load did not come back whole. Replaces `pairingsLoadFailed`. */
	readonly loadFailure: FailureReason | null;

	readonly id: string;
	readonly createdAt: string;
	readonly name: string;
	readonly source: SongSource | null;

	readonly #library: Library;
	readonly #base: SongRecord;
	readonly #scheduler: SaveScheduler;
	#teardown: () => void;
	#primed = false;

	private constructor(library: Library, loaded: SongRecord, loadFailure: FailureReason | null) {
		this.#library = library;
		this.#base = loaded;
		this.id = loaded.id;
		this.createdAt = loaded.createdAt;
		this.name = loaded.name;
		this.source = loaded.source;
		this.loadFailure = loadFailure;

		const fields = fieldsFromRecord(loaded);
		this.inputText = fields.inputText;
		this.metadata = fields.metadata;
		this.fromScoreFields = fields.fromScoreFields;
		this.glossOverrides = fields.glossOverrides as Map<string, string>;
		this.glossAnchors = fields.glossAnchors as Map<string, string>;
		this.openSyllabification = fields.openSyllabification;
		this.pairings = fields.pairings;

		this.#scheduler = createSaveScheduler(() => this.#write());

		const stop = $effect.root(() => {
			$effect(() => {
				// Read every field, so every field is tracked.
				this.#snapshot();
				// The first run is the echo of the load. Writing it straight back
				// would put six keys into a browser that had none, which is a
				// visible difference on a first visit and step 0 is supposed to
				// have none. This is not the old race guard: it flips inside the
				// instance's own first effect run, and there is no window in which
				// unrestored state could be written.
				if (!this.#primed) {
					this.#primed = true;
					return;
				}
				this.#scheduler.schedule();
			});
		});
		const onHide = () => void this.#scheduler.flush();
		if (typeof document !== 'undefined') {
			// Backgrounding on iOS is the realistic way a phone leaves: flush the
			// debounce tail there, not only on a clean unload.
			document.addEventListener('visibilitychange', onHide);
			window.addEventListener('pagehide', onHide);
		}
		this.#teardown = () => {
			stop();
			if (typeof document !== 'undefined') {
				document.removeEventListener('visibilitychange', onHide);
				window.removeEventListener('pagehide', onHide);
			}
		};
	}

	/**
	 * LOADS FIRST, CONSTRUCTS SECOND. There is no other way to obtain an
	 * instance, and that ordering is the whole race fix (socket §4.4).
	 */
	static async open(library: Library, id: string = LEGACY_SONG_ID): Promise<SongDocument> {
		const loaded = await library.load(id);
		return SongDocument.fromLoaded(library, loaded);
	}

	/**
	 * The same thing for a driver that is already synchronous. Step 0 uses this
	 * with `readLegacySync`, so the page holds a loaded document from its first
	 * line and never a `null` one. Both factories take a record that has already
	 * been read, which is the property that matters.
	 */
	static fromLoaded(library: Library, loaded: LoadResult): SongDocument {
		return new SongDocument(library, loaded.record, loaded.reason ?? null);
	}

	#snapshot(): SongFields {
		return {
			inputText: this.inputText,
			metadata: this.metadata,
			fromScoreFields: this.fromScoreFields,
			glossOverrides: this.glossOverrides,
			glossAnchors: this.glossAnchors,
			openSyllabification: this.openSyllabification,
			pairings: this.pairings,
		};
	}

	async #write(): Promise<void> {
		this.saveState = { status: 'saving' };
		const outcome = await this.#library.save(recordFromFields(this.#base, this.#snapshot()));
		this.saveState = outcome.ok ? { status: 'saved' } : { status: 'failed', reason: outcome.reason };
	}

	/** Write anything pending now, and wait for it. */
	async flush(): Promise<void> {
		await this.#scheduler.flush();
	}

	/**
	 * Flush, then tear the autosave down. Song switching is `close()` then
	 * `open()`, so two documents never share an effect and a switch cannot
	 * cross-write. Nothing calls this yet; the library door is step 4.
	 */
	async close(): Promise<void> {
		await this.#scheduler.flush();
		this.#scheduler.dispose();
		this.#teardown();
		this.#teardown = () => {};
	}

	/** For the page's notice, so the template holds no reason strings. */
	get saveFailure(): FailureReason | null {
		return this.saveState.status === 'failed' ? this.saveState.reason : null;
	}

	/** The record as it would be written right now. Step 5's binder reads this. */
	toRecord(): SongRecord {
		return recordFromFields(this.#base, this.#snapshot());
	}
}

/** Unused by the page; exported so the outcome type has one import site. */
export type { Outcome };
