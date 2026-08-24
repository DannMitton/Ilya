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
import type { CorrectionMap } from '$lib/shane/correction';
import {
	createSaveScheduler,
	fieldsFromRecord,
	recordFromFields,
	type Library,
	type SaveScheduler,
	type SongFields,
} from './library';
import { createLibraryChannel, type LibraryAnnouncement, type LibraryChannel } from './channel';
import type { SourceBytes } from './driver';
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

	/**
	 * N.92, the singer's hand corrections to a page read, keyed by event id.
	 * Saved and restored through the SAME path `pairings` takes: no new save
	 * site, silent or otherwise.
	 */
	corrections = $state<CorrectionMap>({});

	/** What the drawer's storage notice renders. Replaces `pairingsSaveError`. */
	saveState = $state<SaveState>({ status: 'saved' });
	/** Why the load did not come back whole. Replaces `pairingsLoadFailed`. */
	readonly loadFailure: FailureReason | null;
	/**
	 * THIS SONG IS NEVER WRITTEN TO. N.67 step 6, design §4.
	 *
	 * A record that failed validation, or one saved by a newer Ilya, is never
	 * overwritten and never deleted. The page still renders it, the singer can
	 * still export it, and every autosave stops at this flag.
	 *
	 * IT HAS TO BE HERE RATHER THAN AT THE DRIVER. The document rebuilds the
	 * record from its own fields on every write (`recordFromFields`), so by the
	 * time a write reached storage the damage would already be gone: the singer
	 * would see a song that looked repaired and had in fact been emptied.
	 */
	readonly readOnly: boolean;

	/**
	 * The score's provenance, or null for a song with no score yet. The BYTES
	 * live in the `sources` store and never in this object: the record is
	 * kilobytes and the source is hundreds of them (design §2.1).
	 */
	source = $state<SongSource | null>(null);

	/**
	 * Another tab wrote this song while this tab held unsaved work. One
	 * sentence, and the singer's work is kept (socket §4.1).
	 */
	remoteChange = $state<{ updatedAt: string } | null>(null);

	readonly id: string;
	readonly createdAt: string;
	/**
	 * The display name. LIVE, not readonly, because N.67 step 4b lets the singer
	 * rename the open song, and a rename must reach the next write. Held here
	 * rather than in `SongFields` because it is not one of the page's seven
	 * per-song pieces: the page never edits it, the drawer's song list does.
	 */
	name = $state('');

	readonly #library: Library;
	#base: SongRecord;
	readonly #scheduler: SaveScheduler;
	readonly #channel: LibraryChannel;
	#teardown: () => void;
	#primed = false;
	/**
	 * The bytes to write with the next save. `undefined` leaves the stored
	 * source untouched, which is every autosave; a value replaces it.
	 */
	#pendingSource: SourceBytes | null | undefined = undefined;
	/** True while a remote record is being applied, so the apply does not echo. */
	#applying = false;

	private constructor(library: Library, loaded: SongRecord, loadFailure: FailureReason | null) {
		this.#library = library;
		this.#base = loaded;
		this.id = loaded.id;
		this.createdAt = loaded.createdAt;
		this.name = loaded.name;
		this.source = loaded.source;
		this.loadFailure = loadFailure;
		this.readOnly = loadFailure === 'malformed' || loadFailure === 'newer-schema';

		this.#apply(loaded);

		this.#scheduler = createSaveScheduler(() => this.#write());
		this.#channel = createLibraryChannel((message) => void this.#onRemoteWrite(message));

		const stop = $effect.root(() => {
			$effect(() => {
				// Read every field, so every field is tracked. `source` is read
				// separately because it is not one of the page's seven: without it
				// a score attached to an otherwise unchanged song would never be
				// written, and the bytes would sit in memory until the tab closed.
				this.#snapshot();
				void this.source;
				// Read separately for the same reason `source` is: a rename changes
				// none of the page's seven fields, so without this the new name
				// would sit in memory until something else happened to save.
				void this.name;
				// ORDER MATTERS HERE, AND GETTING IT WRONG COST A BUILD. The
				// priming check must come FIRST. With the `#applying` check
				// ahead of it, the constructor's own apply returned early
				// without ever setting `#primed`, so the next run consumed the
				// singer's FIRST REAL EDIT as though it were the load echo, and
				// nothing was saved until the second change. Every gate passed.
				//
				// The first run is the echo of the load. Writing it straight back
				// would put keys into a browser that had none, which is a visible
				// difference on a first visit. This is not the old race guard: it
				// flips inside the instance's own first effect run, and there is
				// no window in which unrestored state could be written.
				if (!this.#primed) {
					this.#primed = true;
					return;
				}
				// A record arriving from another tab is not a change this tab
				// made, and writing it back would bounce it between tabs.
				if (this.#applying) return;
				// N.67 step 6. The one place the read-only rule is enforced: nothing
				// is scheduled, so nothing is debounced, so `pagehide` has nothing
				// to flush either.
				if (this.readOnly) return;
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
			corrections: this.corrections,
		};
	}

	async #write(): Promise<void> {
		// Belt beside braces. Nothing schedules a read-only document, and a direct
		// `flush()` must not get round that either.
		if (this.readOnly) return;
		this.saveState = { status: 'saving' };
		// $state.snapshot IS REQUIRED, NOT TIDINESS. `$state` deeply proxies
		// plain objects and arrays, IndexedDB writes through the structured
		// clone algorithm, and structured clone THROWS on a Proxy. Step 0 never
		// met this because localStorage goes through `JSON.stringify`, which
		// reads a proxy happily. Without this line every song save fails with
		// `write-failed` and the singer's work never lands.
		const record = $state.snapshot(
			recordFromFields({ ...this.#base, name: this.name, source: this.source }, this.#snapshot()),
		) as SongRecord;
		const source = this.#pendingSource;
		const outcome = await this.#library.save(record, source);
		if (outcome.ok) {
			// Cleared only on success, so a failed write keeps the bytes queued
			// for the retry rather than dropping the singer's score silently.
			if (this.#pendingSource === source) this.#pendingSource = undefined;
			this.#base = record;
			this.saveState = { status: 'saved' };
			// Announced AFTER the write committed, never before.
			this.#channel.announce({ songId: this.id, updatedAt: this.#library.lastSavedAt ?? record.updatedAt });
		} else {
			this.saveState = { status: 'failed', reason: outcome.reason };
		}
	}

	/** Replace every field from a record, without echoing the change back out. */
	#apply(record: SongRecord): void {
		this.#applying = true;
		this.#base = record;
		this.name = record.name;
		this.source = record.source;
		const fields = fieldsFromRecord(record);
		this.inputText = fields.inputText;
		this.metadata = fields.metadata;
		this.fromScoreFields = fields.fromScoreFields;
		this.glossOverrides = fields.glossOverrides as Map<string, string>;
		this.glossAnchors = fields.glossAnchors as Map<string, string>;
		this.openSyllabification = fields.openSyllabification;
		this.pairings = fields.pairings;
		this.corrections = fields.corrections;
		// Cleared on the next microtask, after the effect this apply triggered
		// has run and returned early.
		queueMicrotask(() => {
			this.#applying = false;
		});
	}

	/**
	 * Another tab committed a write to this song.
	 *
	 * A CLEAN tab reloads and the two stay current. A tab with unsaved work
	 * KEEPS IT and shows one sentence. No merge, no lock, and above all no
	 * silence (socket §4.1).
	 */
	async #onRemoteWrite(message: LibraryAnnouncement): Promise<void> {
		if (message.songId !== this.id) return;
		if (message.updatedAt === this.#library.lastSavedAt) return; // our own write
		if (this.#scheduler.isPending()) {
			this.remoteChange = { updatedAt: message.updatedAt };
			return;
		}
		const loaded = await this.#library.load(this.id);
		if (loaded.reason) {
			this.remoteChange = { updatedAt: message.updatedAt };
			return;
		}
		this.#apply(loaded.record);
	}

	/**
	 * A score has been accepted. Its bytes go down with the next save, in the
	 * same transaction as the record, so the old source is gone only once the
	 * new one is durable (design §2.6).
	 */
	attachSource(source: SourceBytes, provenance: SongSource): void {
		this.#pendingSource = source;
		this.source = provenance;
	}

	/** Write anything pending now, and wait for it. */
	async flush(): Promise<void> {
		await this.#scheduler.flush();
	}

	/**
	 * Flush, then tear the autosave down. Song switching is `close()` then
	 * `open()`, so two documents never share an effect and a switch cannot
	 * cross-write. N.67 step 4b calls it: the page's `switchSong` awaits this
	 * before it constructs the next document, so the outgoing song's tail is
	 * written before the incoming song's first effect can run.
	 */
	async close(): Promise<void> {
		await this.#scheduler.flush();
		this.#scheduler.dispose();
		this.#channel.close();
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
