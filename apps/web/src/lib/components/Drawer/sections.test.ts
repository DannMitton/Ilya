/**
 * N.108 increment 1: THE RETURNING SINGER.
 *
 * `ilya:openStations` is a WIRE VALUE. A browser that has been to Ilya before
 * holds ship B's five ids, and this build understands eight different ones, so
 * every returning singer runs the migration exactly once on their next visit
 * and there is no second chance to get it right. That is what these tests pin.
 *
 * THE EXPECTATIONS ARE COPIED FROM THE BRIEF, not read back out of
 * `sections.svelte.ts`, which is this repository's standing condition on an
 * acceptance test: no expectation may take its value from the mechanism under
 * test. The mapping is `docs/sessions/brief-n108-build_r1_2026-09-02.md` §3,
 * which quotes Design's revision 2 §4.4: "map `piece` to `metadata`, `songs`
 * to `repertoire`, `analysis` to `analysis`, `shiftLyrics` to `underlay`; drop
 * `source` and anything unrecognized; on a phone keep only the first
 * survivor."
 *
 * `shiftLyrics` NOW DROPS INSTEAD OF MAPPING, and `underlay` drops with it.
 * N.114, ruled by Dann 2026-09-07 and briefed at
 * `docs/sessions/brief-n114-syllable-line_r1_2026-09-09.md` ruling 6: "The
 * Score markup band loses its Underlay station." The queue and the SABB are a
 * row inside the intake now, and the intake has no station id, so there is no
 * successor left for either word to name. The expectations below take their
 * value from that ruling and not from the mechanism, exactly as the N.108 ones
 * took theirs from the N.108 brief.
 *
 * `SectionSet` ITSELF IS NOT EXERCISED HERE. It holds `$state` and a
 * `localStorage` write, and this repository's vitest runs in the `node`
 * environment with neither; the file's own header says that is why every
 * decision it makes lives in a free function. `migrateOpenStations` is that
 * function.
 */

import { describe, it, expect } from 'vitest';
import {
	migrateOpenStations,
	parseOpenSections,
	readStoredOpenSet,
	isBandId,
	BAND_IDS,
	STATION_IDS,
	FIRST_RUN_STATIONS,
	OPEN_STATIONS_VERSION,
} from './sections.svelte';

describe('N.108 the open set migrates once', () => {
	/* SHIP B'S IDS NO LONGER REACH THIS FUNCTION, N.115. `OPEN_STATIONS_VERSION`
	   is 3 and `restore` lands every set below 3 on the first-run default, so a
	   ship B value is reset before the map is consulted. `songs` therefore
	   drops; `analysis` survives because it is still a station under its own
	   name; `piece` survives as the BAND of that name, which is a different
	   door from the station ship B meant by the same string. The expectation
	   comes from the brief's §2, "ids `piece`, `input`, `text`,
	   `scoreMarkup`", not from the mechanism. */
	it('drops ship B’s ids, which version 3 resets before the map is reached', () => {
		expect(migrateOpenStations(['songs'], false)).toEqual([]);
		expect(migrateOpenStations(['shiftLyrics'], false)).toEqual([]);
		expect(migrateOpenStations(['metadata'], false)).toEqual([]);
		expect(migrateOpenStations(['analysis'], false)).toEqual(['analysis']);
	});

	/* N.115. The four bands are members of the same set, so each survives a
	   round trip under its own name. */
	it('keeps each of the four band ids', () => {
		expect(migrateOpenStations(['piece', 'input', 'text', 'scoreMarkup'], false)).toEqual([
			'piece',
			'input',
			'text',
			'scoreMarkup',
		]);
	});

	it('knows a band id from a station id', () => {
		for (const id of Object.values(BAND_IDS)) expect(isBandId(id)).toBe(true);
		for (const id of Object.values(STATION_IDS)) expect(isBandId(id)).toBe(false);
	});

	it('drops `source`, which has no successor because the intake never closes', () => {
		expect(migrateOpenStations(['source'], false)).toEqual([]);
	});

	/* N.114 ruling 6. The station these two named is gone, so both drop. A
	   browser that visited between N.108 and N.114 holds `underlay`; one that
	   has not been here since ship B holds `shiftLyrics`. Neither has a
	   station to open. */
	it('drops `shiftLyrics` and `underlay`, whose station N.114 removed', () => {
		expect(migrateOpenStations(['underlay'], false)).toEqual([]);
		expect(migrateOpenStations(['shiftLyrics', 'underlay'], false)).toEqual([]);
	});

	/* N.115, ruled 2026-09-10: "the METADATA label on the Piece band is struck;
	   the metadata body shows whenever Piece is open, and collapsing Piece is
	   the collapse." A station that is not a door has no open state to store. */
	it('drops `metadata`, whose label N.115 struck', () => {
		expect(migrateOpenStations(['metadata'], false)).toEqual([]);
		expect(migrateOpenStations(['piece', 'metadata'], false)).toEqual(['piece']);
	});

	it('drops anything it does not recognise', () => {
		expect(migrateOpenStations(['output', 'transcribe', ''], false)).toEqual([]);
	});

	it('keeps the order the singer had, and keeps every survivor on a desk', () => {
		expect(migrateOpenStations(['analysis', 'piece', 'repertoire'], false)).toEqual([
			'analysis',
			'piece',
			'repertoire',
		]);
	});

	/* N.115. ONE SURVIVOR PER TIER on a phone, which was one survivor
	   altogether while every id named a station. A band contains stations, so
	   keeping the band and dropping the station inside it would reopen the
	   band onto a station the singer had left open. */
	it('keeps the first band and the first station on a phone', () => {
		expect(migrateOpenStations(['analysis', 'piece', 'repertoire'], true)).toEqual([
			'analysis',
			'piece',
		]);
		expect(migrateOpenStations(['piece', 'text'], true)).toEqual(['piece']);
		expect(migrateOpenStations(['analysis', 'repertoire'], true)).toEqual(['analysis']);
	});

	/* `source` is dropped BEFORE the phone takes the first one, so a phone
	   whose stored set began with `source` does not arrive with nothing open
	   while a real station waited behind it. */
	it('takes the first SURVIVOR on a phone, not the first stored id', () => {
		expect(migrateOpenStations(['source', 'repertoire'], true)).toEqual(['repertoire']);
	});

	/* IDEMPOTENCE IS WHAT MAKES "RUNS ONCE" TRUE. `SectionSet.restore` writes
	   back only when the migration changed something, so a second visit must
	   return the same array or the key would be rewritten on every boot, which
	   is the second silent save site N.27 forbids while it is open. */
	it('returns an already-migrated set unchanged', () => {
		const migrated = ['piece', 'repertoire', 'analysis'];
		expect(migrateOpenStations(migrated, false)).toEqual(migrated);
		expect(migrateOpenStations(migrated, false)).toEqual(
			migrateOpenStations(migrateOpenStations(migrated, false), false)
		);
	});

	it('never lets one station arrive twice', () => {
		expect(migrateOpenStations(['analysis', 'analysis'], false)).toEqual(['analysis']);
	});

	/* N.115, RULED BY DANN 2026-09-10 and quoted in `PRODUCT.md` §The drawer
	   grammar and the path: "An empty drawer opens Input alone; Piece, Text,
	   and Score markup show their band and nothing under it." The expectation
	   is that sentence and not a reading of the module. */
	it('opens Input alone on a first run', () => {
		expect([...FIRST_RUN_STATIONS]).toEqual(['input']);
		expect(migrateOpenStations([...FIRST_RUN_STATIONS], false)).toEqual(['input']);
		expect(migrateOpenStations([...FIRST_RUN_STATIONS], true)).toEqual(['input']);
	});

	it('opens no band but Input, and no station at all, on a first run', () => {
		for (const id of Object.values(BAND_IDS)) {
			expect(FIRST_RUN_STATIONS.includes(id)).toBe(id === BAND_IDS.input);
		}
		for (const id of Object.values(STATION_IDS)) {
			expect(FIRST_RUN_STATIONS.includes(id)).toBe(false);
		}
	});
});

/**
 * N.108 increment 1a: THE RESET, AND THE MARK THAT MAKES IT HAPPEN ONCE.
 *
 * Ruled by Dann 2026-09-02 on his walk of `2c1cecf`: the migration "lands
 * every singer on the opening state once: drop the old set, write the empty
 * array, so nothing is open except the intake; keep the id mapping code for a
 * singer whose set is already new."
 *
 * `SectionSet.restore` is where the two branches meet, and it holds `$state`
 * and a `localStorage` write, neither of which this repository's `node`
 * environment has. What is testable is the READER: whether a stored value
 * announces itself as pre-1a or post-1a is the whole of the decision, and
 * `readStoredOpenSet` is that decision.
 */
describe('N.108 increment 1a the stored shape says who wrote it', () => {
	it('reads a bare array as version 1, which is every build before 1a', () => {
		expect(readStoredOpenSet('["repertoire","analysis"]')).toEqual({
			version: 1,
			open: ['repertoire', 'analysis'],
		});
	});

	it('reads increment 1a’s own shape as version 2', () => {
		expect(readStoredOpenSet('{"v":2,"open":["metadata"]}')).toEqual({
			version: 2,
			open: ['metadata'],
		});
	});

	/* N.115. A version 2 value names no band, so reading it forward unchanged
	   would land a returning singer on four shut bands. Version 3 is the mark
	   that says "reset me once", the same device increment 1a used. */
	it('marks a version 2 set as needing the N.115 reset', () => {
		expect(readStoredOpenSet('{"v":2,"open":["repertoire"]}').version).toBeLessThan(
			OPEN_STATIONS_VERSION
		);
		expect(readStoredOpenSet('{"v":3,"open":["input"]}')).toEqual({
			version: 3,
			open: ['input'],
		});
	});

	/* A returning singer whose set is already NEW still has to be reset once,
	   which is the case a bare array could never carry on its own: Dann's own
	   drawer held `["repertoire","analysis"]` after increment 1, both new ids,
	   and both came back open. Version 1 is what says "reset me". */
	it('marks a set of new ids written before 1a as version 1', () => {
		const stored = readStoredOpenSet('["repertoire","analysis"]');
		expect(stored.version).toBeLessThan(OPEN_STATIONS_VERSION);
	});

	it('marks the current build’s own write as needing no reset', () => {
		const stored = readStoredOpenSet('{"v":3,"open":["repertoire"]}');
		expect(stored.version).toBe(OPEN_STATIONS_VERSION);
	});

	/* Absent, corrupt, and wrong-typed all read as version 0, so they are
	   reset with everything else rather than trusted. §B.4's ruling is that an
	   unreadable value does not throw. */
	it('reads absent, corrupt and wrong-typed as version 0', () => {
		expect(readStoredOpenSet(null)).toEqual({ version: 0, open: [] });
		expect(readStoredOpenSet('not json')).toEqual({ version: 0, open: [] });
		expect(readStoredOpenSet('[1,2,3]')).toEqual({ version: 0, open: [] });
		expect(readStoredOpenSet('"repertoire"')).toEqual({ version: 0, open: [] });
	});

	/* An empty array is not corrupt: it is a singer who shut everything. It
	   still reads as version 1, so it is written forward once and then left
	   alone. */
	it('reads an empty array as a version 1 value, not as corruption', () => {
		expect(readStoredOpenSet('[]')).toEqual({ version: 1, open: [] });
	});

	it('survives an object with no open list', () => {
		expect(readStoredOpenSet('{"v":2}')).toEqual({ version: 2, open: [] });
	});

	/* `parseOpenSections` is ship B's reader and §B.4's ruling lives in it.
	   It is narrowed onto the reader above and its behaviour is unchanged. */
	it('keeps §B.4’s fallback on an unreadable value and not on an empty one', () => {
		expect(parseOpenSections(null, ['metadata'])).toEqual(['metadata']);
		expect(parseOpenSections('nonsense', ['metadata'])).toEqual(['metadata']);
		expect(parseOpenSections('[]', ['metadata'])).toEqual([]);
	});

	/* The mapping is KEPT, which the ruling asks for in as many words, and it
	   is what a version 2 set still goes through. `voice` was the second id
	   here until N.114a took it out of `STATION_IDS`; `corrections` is a
	   surviving Score markup station and stands in its place. */
	it('keeps the mapping for a set that is already new', () => {
		expect(migrateOpenStations(['repertoire', 'corrections'], false)).toEqual([
			'repertoire',
			'corrections',
		]);
		expect(migrateOpenStations(['repertoire', 'corrections'], true)).toEqual(['repertoire']);
	});

	/* N.115. A band and a station together survive a phone, because they are
	   different tiers; two bands do not, and neither do two stations. */
	it('keeps a band and the station inside it on a phone', () => {
		expect(migrateOpenStations(['piece', 'repertoire'], true)).toEqual(['piece', 'repertoire']);
	});

	/* N.114a ruling 1. The Voice station is always expanded and has no chevron,
	   so `voice` has no open state to store and a stored one is dropped. */
	it('drops `voice`, whose station N.114a stopped collapsing', () => {
		expect(migrateOpenStations(['voice'], false)).toEqual([]);
		expect(migrateOpenStations(['piece', 'voice'], false)).toEqual(['piece']);
	});
});
