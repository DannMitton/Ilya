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
	SectionSet,
	carryVersion3,
	migrateOpenStations,
	repertoireOpensOnArrival,
	parseOpenSections,
	readStoredOpenSet,
	isBandId,
	tierOf,
	BAND_IDS,
	STATION_IDS,
	FIRST_RUN_STATIONS,
	OPEN_STATIONS_VERSION,
	UNPERSISTED_STATIONS,
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
		/* N.201: `analysis` is a BAND now and still survives under its own name. */
		expect(migrateOpenStations(['analysis'], false)).toEqual(['analysis']);
	});

	/* N.115. The bands are members of the same set, so each survives a round
	   trip under its own name. N.115 increment 2: THREE, "PIECE, INPUT, SCORE
	   MARKUP" (brief §1). */
	/* N.201: FIVE BANDS, in the Drawer's order (brief r2, "The order"). */
	it('keeps each of the five band ids, in the Drawer’s order', () => {
		expect(Object.values(BAND_IDS)).toEqual([
			'repertoire',
			'piece',
			'input',
			'analysis',
			'scoreMarkup',
		]);
		expect(
			migrateOpenStations(['repertoire', 'piece', 'input', 'analysis', 'scoreMarkup'], false)
		).toEqual(['repertoire', 'piece', 'input', 'analysis', 'scoreMarkup']);
	});

	it('leaves binder, notation, and the two VOICE stations (N.203 lane 61) as the only stations', () => {
		expect(Object.values(STATION_IDS)).toEqual(['binder', 'notation', 'describeVoice', 'insightsShares']);
	});

	it('knows a band id from a station id', () => {
		for (const id of Object.values(BAND_IDS)) expect(isBandId(id)).toBe(true);
		for (const id of Object.values(STATION_IDS)) expect(isBandId(id)).toBe(false);
	});

	/* N.115 increment 3, brief §2.1, RULED BY DANN 2026-09-10 late: the Text
	   fold is deleted, and Notation and Analysis "render directly where the
	   fold's body rendered, as the two stations they already are". So a
	   stored `text` names no door and drops, and the two are ordinary
	   stations: on a phone the first of them survives beside a band. */
	it('drops the deleted Text fold; Notation is a station and Analysis a band (N.201)', () => {
		expect(Object.values(STATION_IDS)).not.toContain('text');
		expect(migrateOpenStations(['input', 'text'], false)).toEqual(['input']);
		expect(tierOf('input')).toBe('band');
		expect(tierOf('notation')).toBe('station');
		expect(tierOf('analysis')).toBe('band');
		expect(tierOf('repertoire')).toBe('band');
		expect(tierOf('binder')).toBe('station');
		/* One survivor per tier on a phone: the first band, the first station. */
		expect(migrateOpenStations(['input', 'text', 'notation', 'analysis'], true)).toEqual([
			'input',
			'notation',
		]);
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
		expect(migrateOpenStations(['binder', 'piece', 'notation'], false)).toEqual([
			'binder',
			'piece',
			'notation',
		]);
	});

	/* N.115. ONE SURVIVOR PER TIER on a phone, which was one survivor
	   altogether while every id named a station. A band contains stations, so
	   keeping the band and dropping the station inside it would reopen the
	   band onto a station the singer had left open. */
	it('keeps the first band and the first station on a phone (N.201: five bands)', () => {
		expect(migrateOpenStations(['analysis', 'piece', 'repertoire'], true)).toEqual(['analysis']);
		expect(migrateOpenStations(['piece', 'scoreMarkup'], true)).toEqual(['piece']);
		expect(migrateOpenStations(['analysis', 'repertoire'], true)).toEqual(['analysis']);
		expect(migrateOpenStations(['binder', 'piece', 'notation'], true)).toEqual(['binder', 'piece']);
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
		const migrated = ['piece', 'repertoire', 'analysis', 'binder'];
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
		/* N.201: version 3 is carried, not reset (see below). */
		expect(readStoredOpenSet('{"v":3,"open":["input"]}').version).toBeLessThan(OPEN_STATIONS_VERSION);
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
		const stored = readStoredOpenSet('{"v":4,"open":["repertoire"]}');
		expect(stored.version).toBe(OPEN_STATIONS_VERSION);
		expect(OPEN_STATIONS_VERSION).toBe(4);
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
	   here until N.114a took it out of `STATION_IDS`, and `corrections` was the
	   third until N.149; `analysis` is a surviving station and stands in its
	   place. */
	it('keeps the mapping for a set that is already new', () => {
		expect(migrateOpenStations(['repertoire', 'analysis'], false)).toEqual([
			'repertoire',
			'analysis',
		]);
		/* N.201: both are bands, so a phone keeps the first. */
		expect(migrateOpenStations(['repertoire', 'analysis'], true)).toEqual(['repertoire']);
	});

	/* N.115. A band and a station together survive a phone, because they are
	   different tiers; two bands do not, and neither do two stations. N.201:
	   the station is now `binder`, which lives inside REPERTOIRE. */
	it('keeps a band and a station on a phone', () => {
		expect(migrateOpenStations(['repertoire', 'binder'], true)).toEqual(['repertoire', 'binder']);
		expect(migrateOpenStations(['binder', 'notation'], true)).toEqual(['binder']);
	});

	/* N.114a ruling 1. The Voice station is always expanded and has no chevron,
	   so `voice` has no open state to store and a stored one is dropped. */
	it('drops `voice`, whose station N.114a stopped collapsing', () => {
		expect(migrateOpenStations(['voice'], false)).toEqual([]);
		expect(migrateOpenStations(['piece', 'voice'], false)).toEqual(['piece']);
	});
});

/**
 * N.201 step 1: THE VERSION 3 TO 4 CARRY, AND WHAT EACH STORED SET LANDS ON.
 *
 * The expectations are the brief review's table (`review-fable-brief-n201_r1`,
 * blocker 2), written out: a version 3 build stored `repertoire` and
 * `analysis` as stations that could sit invisible inside a closed band, so
 * as bands they must not open by themselves. Each case also says where a
 * singer expects to land.
 */
describe('N.201 the version 3 set is carried, never reset', () => {
	/* Dann's own set. REPERTOIRE was stored but PIECE was not, so he never
	   saw it open: it stays shut, and VOICE stays open. */
	it('["repertoire","scoreMarkup"] lands on VOICE open alone, desk and phone', () => {
		expect(carryVersion3(['repertoire', 'scoreMarkup'])).toEqual(['scoreMarkup']);
		expect(migrateOpenStations(carryVersion3(['repertoire', 'scoreMarkup']), false)).toEqual(['scoreMarkup']);
		expect(migrateOpenStations(carryVersion3(['repertoire', 'scoreMarkup']), true)).toEqual(['scoreMarkup']);
	});

	it('["input"] lands on INPUT open alone, unchanged', () => {
		expect(carryVersion3(['input'])).toEqual(['input']);
		expect(migrateOpenStations(carryVersion3(['input']), true)).toEqual(['input']);
	});

	/* `analysis` was stored with PIECE open, not INPUT, so it was invisible. */
	it('["piece","analysis"] lands on PIECE open alone, desk and phone', () => {
		expect(carryVersion3(['piece', 'analysis'])).toEqual(['piece']);
		expect(migrateOpenStations(carryVersion3(['piece', 'analysis']), false)).toEqual(['piece']);
		expect(migrateOpenStations(carryVersion3(['piece', 'analysis']), true)).toEqual(['piece']);
	});

	it('["input","analysis"] keeps both: the singer saw ANALYSIS open under INPUT', () => {
		expect(carryVersion3(['input', 'analysis'])).toEqual(['input', 'analysis']);
	});

	it('["piece","repertoire"] keeps both: the singer saw REPERTOIRE open under PIECE', () => {
		expect(carryVersion3(['piece', 'repertoire'])).toEqual(['piece', 'repertoire']);
	});

	/* Desk: all three open, REPERTOIRE now a band and `binder` open inside
	   it. Phone: the first band (PIECE, stored first) and the station. */
	it('["piece","repertoire","binder"] lands on all three on a desk, PIECE and binder on a phone', () => {
		expect(migrateOpenStations(carryVersion3(['piece', 'repertoire', 'binder']), false)).toEqual([
			'piece',
			'repertoire',
			'binder',
		]);
		expect(migrateOpenStations(carryVersion3(['piece', 'repertoire', 'binder']), true)).toEqual([
			'piece',
			'binder',
		]);
	});

	it('keeps every other id as it is, and an empty set empty', () => {
		expect(carryVersion3(['scoreMarkup', 'binder', 'notation'])).toEqual(['scoreMarkup', 'binder', 'notation']);
		expect(carryVersion3([])).toEqual([]);
	});
});

/* `SectionSet` itself. Its header says vitest's `node` environment has no
   `$state` and no `localStorage`; the module compiles in server mode, where
   `$state` is a plain assignment and `#write` swallows the missing storage,
   so the class runs here. The localStorage double below lets the writes be
   read back. */
describe('N.201 SectionSet: reveal, fold, restore', () => {
	function stub() {
		const store = new Map<string, string>();
		(globalThis as { localStorage?: unknown }).localStorage = {
			getItem: (k: string) => store.get(k) ?? null,
			setItem: (k: string, v: string) => void store.set(k, v),
		};
		return store;
	}
	const KEY = 'ilya:openStations';
	const make = (open: string[], exclusive: boolean) => {
		const set = new SectionSet({ open, storageKey: KEY, unpersisted: UNPERSISTED_STATIONS });
		set.exclusive = exclusive;
		return set;
	};

	it('reveal opens a closed id and does nothing to an open one', () => {
		const store = stub();
		const set = make(['input'], false);
		set.reveal('analysis');
		expect(set.has('analysis')).toBe(true);
		expect(set.has('input')).toBe(true);
		set.reveal('analysis');
		expect(set.has('analysis')).toBe(true);
		expect(JSON.parse(store.get(KEY)!)).toEqual({ v: 4, open: ['input', 'analysis'] });
	});

	it('reveal on a phone shuts the other open band and leaves ANALYSIS open on a second tap', () => {
		stub();
		const set = make(['input', 'repertoire'], true);
		set.reveal('analysis');
		expect(set.has('analysis')).toBe(true);
		expect(set.has('input')).toBe(false);
		expect(set.has('repertoire')).toBe(false);
		set.reveal('analysis');
		expect(set.has('analysis')).toBe(true);
	});

	it('reveal on a phone leaves an open station alone (a different tier)', () => {
		stub();
		const set = make(['input', 'binder'], true);
		set.reveal('analysis');
		expect(set.has('binder')).toBe(true);
	});

	it('reveal writes nothing when the id is already open', () => {
		const store = stub();
		const set = make(['analysis'], false);
		set.reveal('analysis');
		expect(store.has(KEY)).toBe(false);
	});

	it('fold closes an open id, writes through the one site, and ignores a closed id', () => {
		const store = stub();
		const set = make(['repertoire', 'input'], false);
		set.fold('repertoire');
		expect(set.has('repertoire')).toBe(false);
		expect(JSON.parse(store.get(KEY)!)).toEqual({ v: 4, open: ['input'] });
		store.delete(KEY);
		set.fold('repertoire');
		expect(store.has(KEY)).toBe(false);
	});

	it('restore carries a version 3 set and writes version 4 back', () => {
		const store = stub();
		const set = make(['input'], false);
		set.restore('{"v":3,"open":["repertoire","scoreMarkup"]}', true);
		expect(set.has('repertoire')).toBe(false);
		expect(set.has('scoreMarkup')).toBe(true);
		expect(JSON.parse(store.get(KEY)!)).toEqual({ v: 4, open: ['scoreMarkup'] });
	});

	it('restore keeps REPERTOIRE when PIECE was stored with it, on a desk', () => {
		stub();
		const set = make(['input'], false);
		set.restore('{"v":3,"open":["piece","repertoire","analysis"]}', false);
		expect(['piece', 'repertoire'].every((id) => set.has(id))).toBe(true);
		expect(set.has('analysis')).toBe(false);
	});

	it('restore lands a version 2 or older set on the first-run default, as before', () => {
		stub();
		const set = make(['input'], false);
		set.restore('{"v":2,"open":["repertoire","analysis"]}', false);
		expect(set.has('input')).toBe(true);
		expect(set.has('repertoire')).toBe(false);
	});

	it('restore of a version 4 set writes nothing', () => {
		const store = stub();
		const set = make(['input'], false);
		set.restore('{"v":4,"open":["repertoire"]}', false);
		expect(set.has('repertoire')).toBe(true);
		expect(store.has(KEY)).toBe(false);
	});
});

/* N.201 step 3.1 and 3.2, the brief's own words: a desk opens REPERTOIRE at two
   or more songs, with fewer the stored set stands, and a phone never does. */
describe('N.201 REPERTOIRE on arrival', () => {
	it('opens on a desk at two or more songs, including sixteen', () => {
		expect(repertoireOpensOnArrival(false, 2)).toBe(true);
		expect(repertoireOpensOnArrival(false, 16)).toBe(true);
	});
	it('does not open on a desk with one song or none', () => {
		expect(repertoireOpensOnArrival(false, 1)).toBe(false);
		expect(repertoireOpensOnArrival(false, 0)).toBe(false);
	});
	it('never opens on a phone, whatever the count', () => {
		expect(repertoireOpensOnArrival(true, 16)).toBe(false);
		expect(repertoireOpensOnArrival(true, 2)).toBe(false);
	});
});

/* N.203 lane 61, Step 1: the VOICE pane's two stations open in place, closed on arrival, never stored open, and on a phone one at a time across
   the whole station tier (so opening one shuts the other, and NOTATION). The ruled behaviour (brief r3, Step 1). */
describe('N.203 lane 61: the two VOICE stations', () => {
	const KEY = 'ilya:openStations';
	const stub = () => {
		const store = new Map<string, string>();
		(globalThis as { localStorage?: unknown }).localStorage = {
			getItem: (k: string) => store.get(k) ?? null,
			setItem: (k: string, v: string) => void store.set(k, v),
		};
		return store;
	};
	const make = (open: string[], exclusive: boolean) => {
		const set = new SectionSet({ open, storageKey: KEY, unpersisted: UNPERSISTED_STATIONS });
		set.exclusive = exclusive;
		return set;
	};
	it('are stations, not bands, and are never on first run', () => {
		for (const id of [STATION_IDS.describeVoice, STATION_IDS.insightsShares]) {
			expect(tierOf(id)).toBe('station');
			expect(FIRST_RUN_STATIONS.includes(id)).toBe(false);
			expect(UNPERSISTED_STATIONS).toContain(id);
		}
	});
	it('are held but never written: opening one leaves the stored set as it was', () => {
		const store = stub();
		const set = make(['input'], false);
		set.reveal('scoreMarkup');
		set.reveal(STATION_IDS.describeVoice);
		set.reveal(STATION_IDS.insightsShares);
		expect(set.has(STATION_IDS.describeVoice)).toBe(true);
		expect(JSON.parse(store.get(KEY)!).open).toEqual(['input', 'scoreMarkup']);
	});
	it('on a phone, opening one shuts the other and shuts NOTATION; the bands stay', () => {
		stub();
		const set = make(['input', 'scoreMarkup', 'notation'], true);
		set.toggle(STATION_IDS.describeVoice);
		expect(set.has('notation')).toBe(false);
		expect(set.has(STATION_IDS.describeVoice)).toBe(true);
		expect(set.has('scoreMarkup')).toBe(true);
		set.toggle(STATION_IDS.insightsShares);
		expect(set.has(STATION_IDS.describeVoice)).toBe(false);
		expect(set.has(STATION_IDS.insightsShares)).toBe(true);
		set.toggle('notation');
		expect(set.has(STATION_IDS.insightsShares)).toBe(false);
	});
	it('on a desk, both stay open together', () => {
		stub();
		const set = make(['scoreMarkup'], false);
		set.toggle(STATION_IDS.describeVoice);
		set.toggle(STATION_IDS.insightsShares);
		expect(set.has(STATION_IDS.describeVoice) && set.has(STATION_IDS.insightsShares)).toBe(true);
	});
	it('a stored set that somehow names one drops back closed on a reload (restore keeps only what it was handed; the write never wrote it)', () => {
		const store = stub();
		const set = make(['input'], false);
		set.reveal(STATION_IDS.describeVoice);
		const fresh = make(['input'], false);
		fresh.restore(store.get(KEY) ?? null, false);
		expect(fresh.has(STATION_IDS.describeVoice)).toBe(false);
	});
});
