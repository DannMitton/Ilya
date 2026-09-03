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
 * `SectionSet` ITSELF IS NOT EXERCISED HERE. It holds `$state` and a
 * `localStorage` write, and this repository's vitest runs in the `node`
 * environment with neither; the file's own header says that is why every
 * decision it makes lives in a free function. `migrateOpenStations` is that
 * function.
 */

import { describe, it, expect } from 'vitest';
import { migrateOpenStations, FIRST_RUN_STATIONS } from './sections.svelte';

describe('N.108 the open set migrates once', () => {
	it('maps each of ship B’s four survivors to its successor', () => {
		expect(migrateOpenStations(['piece'], false)).toEqual(['metadata']);
		expect(migrateOpenStations(['songs'], false)).toEqual(['repertoire']);
		expect(migrateOpenStations(['analysis'], false)).toEqual(['analysis']);
		expect(migrateOpenStations(['shiftLyrics'], false)).toEqual(['underlay']);
	});

	it('drops `source`, which has no successor because the intake never closes', () => {
		expect(migrateOpenStations(['source'], false)).toEqual([]);
	});

	it('drops anything it does not recognise', () => {
		expect(migrateOpenStations(['output', 'transcribe', ''], false)).toEqual([]);
	});

	/* The brief's own acceptance gate, in the value it names: "a browser
	   holding the old `ilya:openStations` value `["piece","source"]` lands on
	   the new drawer with Metadata open and nothing else." */
	it('lands the shipped first-run default on Metadata alone', () => {
		expect(migrateOpenStations(['piece', 'source'], false)).toEqual(['metadata']);
	});

	it('keeps the order the singer had, and keeps every survivor on a desk', () => {
		expect(migrateOpenStations(['shiftLyrics', 'piece', 'songs'], false)).toEqual([
			'underlay',
			'metadata',
			'repertoire',
		]);
	});

	it('keeps only the first survivor on a phone', () => {
		expect(migrateOpenStations(['shiftLyrics', 'piece', 'songs'], true)).toEqual(['underlay']);
	});

	/* `source` is dropped BEFORE the phone takes the first one, so a phone
	   whose stored set began with `source` does not arrive with nothing open
	   while a real station waited behind it. */
	it('takes the first SURVIVOR on a phone, not the first stored id', () => {
		expect(migrateOpenStations(['source', 'songs'], true)).toEqual(['repertoire']);
	});

	/* IDEMPOTENCE IS WHAT MAKES "RUNS ONCE" TRUE. `SectionSet.restore` writes
	   back only when the migration changed something, so a second visit must
	   return the same array or the key would be rewritten on every boot, which
	   is the second silent save site N.27 forbids while it is open. */
	it('returns an already-migrated set unchanged', () => {
		const migrated = ['metadata', 'repertoire', 'underlay'];
		expect(migrateOpenStations(migrated, false)).toEqual(migrated);
		expect(migrateOpenStations(migrated, false)).toEqual(
			migrateOpenStations(migrateOpenStations(migrated, false), false)
		);
	});

	it('never lets one station arrive twice', () => {
		expect(migrateOpenStations(['analysis', 'analysis'], false)).toEqual(['analysis']);
	});

	/* The first-run default is the empty array, ruled by the brief: every
	   station is visible without a toggle, so nothing needs to be open. */
	it('opens nothing on a first run', () => {
		expect([...FIRST_RUN_STATIONS]).toEqual([]);
		expect(migrateOpenStations([...FIRST_RUN_STATIONS], false)).toEqual([]);
	});
});
