/**
 * sections.svelte.ts — THE DRAWER'S ONE RETRACTION MECHANISM.
 *
 * N.65, the drawer's stations, ship B. Dann's ruling of 2026-08-21: "I'd like
 * a retraction chevron applied to every header. Every header begins a section
 * that is retractable and expandable."
 *
 * EXTRACTED, NOT WRITTEN FRESH. `Drawer.svelte` already held this exact shape
 * inline as `expandedSections`, a `Set<string>`, with a `toggleSection(id)`
 * that rebuilt the set rather than mutating it, and it drove Learn and Guide's
 * table of contents. The brief's instruction was "extract it so the drawer has
 * one mechanism, do not write a second," so this file is that code moved out,
 * with the reassign-rather-than-mutate discipline kept: Svelte does not proxy
 * a `Set`, so a fresh set assigned to the field is what makes a reader run.
 *
 * TWO INSTANCES OF ONE MECHANISM, NOT TWO MECHANISMS. The table of contents
 * keeps its own instance, which persists nothing and holds heading ids. The
 * stations take a second, which persists and holds station ids. They are
 * separate state because they are separate things: a remembered table of
 * contents is not what §B.4 asks to remember, and one shared set would have
 * written Learn's open units into the stations' key.
 *
 * THE PERSISTENCE IS IMPERATIVE, NOT AN EFFECT. Every mutation runs through
 * `toggle` and `open`, so the write sits at the two mutation sites and needs
 * no effect context. `SongDocument` reaches the same conclusion for the same
 * reason and its header says so: this repository's vitest runs in the `node`
 * environment, where a `.svelte.ts` module compiles in server mode, `$state`
 * is a plain assignment and `$effect` compiles to nothing. Anything with a
 * decision in it belongs in plain TypeScript, which is why `parseOpenSections`
 * below is a free function and this class holds fields and writes.
 */

/**
 * The one new key of ship B, `ilya:` namespaced like every other key this app
 * writes. It stores a JSON array of station ids.
 */
export const OPEN_STATIONS_KEY = 'ilya:openStations';

/**
 * FIRST RUN: PIECE AND SOURCE OPEN, EVERYTHING ELSE SHUT (§B.5). That is what
 * stops a new singer meeting a wall of closed headers.
 */
export const FIRST_RUN_STATIONS: readonly string[] = ['piece', 'source'];

/**
 * NOTATION DOES NOT JOIN THE PERSISTED SET, AND THIS IS DELIBERATE (§B.4).
 * `+page.svelte`'s own comment carries the reason and it is unchanged: "a
 * remembered collapse hides the toggles from a singer who forgot they exist."
 * NOTATION keeps its ruled collapsed-on-arrival default, so it is filtered out
 * on the way to storage and is never read back in. Do not tidy this away.
 */
export const UNPERSISTED_STATIONS: readonly string[] = ['notation'];

/**
 * The station ids, which are WIRE VALUES: they are written to `localStorage`
 * and read back on the next visit, so renaming one drops that singer's stored
 * open set back to the first-run default. `destinations.ts` carries the same
 * warning about `ilya:activeTab` for the same reason.
 */
export const STATION_IDS = {
	piece: 'piece',
	notation: 'notation',
	source: 'source',
	songs: 'songs',
	analysis: 'analysis',
	shiftLyrics: 'shiftLyrics',
} as const;

/**
 * Read a stored open set. AN UNRECOGNISED OR CORRUPT VALUE FALLS BACK TO THE
 * FIRST-RUN DEFAULT AND DOES NOT THROW (§B.4), which is the pattern N.73 S3
 * ship two established for `ilya:activeTab` in `restoreSurface`.
 *
 * An empty array is NOT corrupt. It is a singer who shut everything, and it
 * round-trips as everything shut rather than falling back to Piece and Source.
 */
export function parseOpenSections(raw: string | null, fallback: readonly string[]): string[] {
	if (raw === null) return [...fallback];
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return [...fallback];
	}
	if (!Array.isArray(parsed)) return [...fallback];
	if (!parsed.every((id) => typeof id === 'string')) return [...fallback];
	return parsed as string[];
}

/** What the class needs to know to be either instance. */
interface SectionSetOptions {
	/** Open on construction. The fallback a corrupt stored value lands on. */
	open?: readonly string[];
	/** Where to write. Omit for an instance that remembers nothing. */
	storageKey?: string;
	/** Ids that are held but never written. See `UNPERSISTED_STATIONS`. */
	unpersisted?: readonly string[];
}

/**
 * A set of open section ids. `Drawer.svelte`'s `expandedSections` and
 * `toggleSection`, moved out, with `open` added for the table of contents'
 * two bulk cases and the storage write added for the stations.
 */
export class SectionSet {
	#open = $state(new Set<string>());
	readonly #storageKey: string | null;
	readonly #unpersisted: ReadonlySet<string>;

	constructor(options: SectionSetOptions = {}) {
		this.#open = new Set(options.open ?? []);
		this.#storageKey = options.storageKey ?? null;
		this.#unpersisted = new Set(options.unpersisted ?? []);
	}

	/** Whether the section is open. This is what a chevron and a body read. */
	has(id: string): boolean {
		return this.#open.has(id);
	}

	/** The singer's own gesture on a header. `toggleSection`, unchanged. */
	toggle(id: string): void {
		const next = new Set(this.#open);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		this.#open = next;
		this.#write();
	}

	/**
	 * Open sections without shutting any. The table of contents' two bulk
	 * cases: a click that opens a heading's parents, and the auto-expand that
	 * follows the active heading. IT RETURNS EARLY WHEN NOTHING CHANGES, which
	 * the auto-expand effect depends on: reassigning an equal set would make
	 * that effect re-run itself.
	 */
	open(ids: readonly string[]): void {
		const next = new Set(this.#open);
		let changed = false;
		for (const id of ids) {
			if (!next.has(id)) {
				next.add(id);
				changed = true;
			}
		}
		if (!changed) return;
		this.#open = next;
		this.#write();
	}

	/**
	 * Take a stored value. The caller reads `localStorage` and hands the raw
	 * string in, so this class is testable without a browser and the boot
	 * sequence stays in `+page.svelte` beside the other restores.
	 */
	restore(raw: string | null): void {
		this.#open = new Set(parseOpenSections(raw, [...this.#open]));
	}

	#write(): void {
		if (this.#storageKey === null) return;
		const ids = [...this.#open].filter((id) => !this.#unpersisted.has(id));
		try {
			localStorage.setItem(this.#storageKey, JSON.stringify(ids));
		} catch {
			// localStorage unavailable. The open set still works for this visit.
		}
	}
}
