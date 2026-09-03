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
 * FIRST RUN: NOTHING OPEN. N.108 increment 1.
 *
 * IT WAS `['piece', 'source']` (§B.5), and the reason it was is the reason it
 * is empty now. Those two were open on arrival because they were the first two
 * things a singer needed and a wall of closed headers is what §B.5 exists to
 * stop. Under the three groups BOTH ARE VISIBLE WITHOUT A TOGGLE: Metadata is
 * an affordance on the Piece band, and the intake is a station with no header
 * that is never closed. So the ruling is satisfied by construction and the
 * default is the empty array, which is what Design's revision 2 §4.4 asked for
 * and what the build brief ruled.
 *
 * The opening state is now the MAP: every station name visible, every station
 * shut, and it fits without scrolling at all three ruled viewports.
 */
export const FIRST_RUN_STATIONS: readonly string[] = [];

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
	repertoire: 'repertoire',
	metadata: 'metadata',
	binder: 'binder',
	notation: 'notation',
	analysis: 'analysis',
	underlay: 'underlay',
	corrections: 'corrections',
	voice: 'voice',
} as const;

/**
 * THE MIGRATION, exactly as Design's revision 2 §4.4 wrote it and the build
 * brief ruled it: `piece` to `metadata`, `songs` to `repertoire`, `analysis`
 * to `analysis`, `shiftLyrics` to `underlay`.
 *
 * THE FIVE IDS SHIP B COULD WRITE were `piece`, `source`, `songs`, `analysis`
 * and `shiftLyrics`; `notation` was a station under both maps and was never
 * written. Four of the five are mapped above. `source` IS DROPPED AND HAS NO
 * SUCCESSOR: the intake is always open and has no id to store, so a stored
 * `source` has nothing to become.
 *
 * A NEW ID MAPS TO ITSELF, which is what makes this idempotent. Run it on an
 * already-migrated array and it returns that array, so a browser that has been
 * here once is not rewritten a second time; `restore` below is what decides
 * whether anything is written at all.
 */
const SUCCESSOR: Readonly<Record<string, string>> = {
	piece: STATION_IDS.metadata,
	songs: STATION_IDS.repertoire,
	analysis: STATION_IDS.analysis,
	shiftLyrics: STATION_IDS.underlay,
	...Object.fromEntries(Object.values(STATION_IDS).map((id) => [id, id])),
};

/**
 * Map a stored open set onto the three-group drawer.
 *
 * Anything unrecognised is dropped rather than kept, because an id this build
 * does not know cannot name a station a singer can see, and a set carrying one
 * would write it back out again on the next toggle.
 *
 * ON A PHONE, ONLY THE FIRST SURVIVOR. The phone holds one open station, so a
 * stored set of three would otherwise arrive in a state the singer cannot
 * reach by hand. First rather than last, because the stored array is in the
 * order the ids were added and the first is the one that has been open
 * longest.
 */
export function migrateOpenStations(stored: readonly string[], onPhone: boolean): string[] {
	const out: string[] = [];
	for (const id of stored) {
		const successor = SUCCESSOR[id];
		if (successor === undefined) continue;
		if (out.includes(successor)) continue;
		out.push(successor);
	}
	return onPhone ? out.slice(0, 1) : out;
}

/** Whether two open sets, in order, are the same array. */
function sameOrder(a: readonly string[], b: readonly string[]): boolean {
	return a.length === b.length && a.every((id, i) => id === b[i]);
}

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

	/**
	 * ONE OPEN STATION AT A TIME. N.108 increment 1, ruled 2026-09-02: on a
	 * phone "one at a time; opening a second closes the first."
	 *
	 * A FIELD RATHER THAN A CONSTRUCTOR OPTION, because the answer changes
	 * under the singer: a desk rotated, a window narrowed, and `+page.svelte`'s
	 * `checkMobile` is the one owner of the 767 px rule. It sets this on the
	 * same line it sets `isMobile`. The table of contents' instance never
	 * touches it and stays at `false`, which is what it has always done.
	 *
	 * NARROWING DOES NOT CLOSE ANYTHING. A desktop singer with three stations
	 * open who drags the window under 768 keeps all three until the next
	 * toggle, which then leaves one. Closing two of them on a resize would be
	 * the drawer rearranging itself under the hand, which is the thing the
	 * whole item forbids.
	 */
	exclusive = $state(false);

	constructor(options: SectionSetOptions = {}) {
		this.#open = new Set(options.open ?? []);
		this.#storageKey = options.storageKey ?? null;
		this.#unpersisted = new Set(options.unpersisted ?? []);
	}

	/** Whether the section is open. This is what a chevron and a body read. */
	has(id: string): boolean {
		return this.#open.has(id);
	}

	/**
	 * The singer's own gesture on a header.
	 *
	 * N.108 increment 1 adds ONE branch and nothing else: on a phone, opening
	 * a station closes whatever was open. Ruled 2026-09-02, and it is the
	 * existing 767 px rule, read from `exclusive` rather than measured here so
	 * this file keeps no second opinion about what a phone is.
	 *
	 * THE INTAKE IS NOT COUNTED, because it has no id and is never closed.
	 * Design's revision 2 §4 recorded that reading as its own; the build brief
	 * ruled it by giving the intake no station row.
	 */
	toggle(id: string): void {
		const opening = !this.#open.has(id);
		const next = opening && this.exclusive ? new Set<string>() : new Set(this.#open);
		if (opening) next.add(id);
		else next.delete(id);
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
	 *
	 * N.108 increment 1: THE RESTORE IS ALSO THE MIGRATION, and it writes back.
	 *
	 * IT WRITES ONLY WHEN THE MIGRATION CHANGED SOMETHING, and that is what
	 * makes "the migration runs once" true rather than merely intended. A
	 * browser that has already been here holds new ids, `migrateOpenStations`
	 * returns them unchanged, and nothing is written. Constraint: N.27 is open,
	 * so no second silent save site may enter; this routes through `#write`,
	 * the one site that has always owned this key, and adds none.
	 *
	 * A FIRST-RUN BROWSER (`raw === null`) IS NOT WRITTEN EITHER. There is
	 * nothing stored to migrate, and writing the empty array would put a key on
	 * a device that has not asked for one.
	 */
	restore(raw: string | null, onPhone = false): void {
		const stored = parseOpenSections(raw, [...this.#open]);
		const migrated = migrateOpenStations(stored, onPhone);
		this.#open = new Set(migrated);
		if (raw !== null && !sameOrder(stored, migrated)) this.#write();
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
