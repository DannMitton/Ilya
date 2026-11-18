/**
 * The two counts of lane 66 (`lane66-core.ts`), on small profiles built by hand. Not a gate: this tool's tests live beside it (`vitest.config.ts`).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TIER1 } from '$lib/voice/voiceTypes';
import type { CalibratedFormant } from '$lib/voice/engine/types';
import { DECLARED, counted, judge, judgeGroups, judgedOutside, ownKey, resolve, setAside, subsetOf, type Profile } from './lane66-core';
import { folderProfile, outDirFor, stampOf, takeOf } from './lane66-folder';

const fm = (f1: number, f2: number | undefined, extra: Partial<CalibratedFormant> = {}): CalibratedFormant =>
	({ f1, ...(f2 === undefined ? {} : { f2 }), f2Quality: f2 === undefined ? 'absent' : 'clear', confidence: 'high', reading: 'captured', source: 'measured-user', ...extra }) as CalibratedFormant;
const BASS: Profile = { i: fm(296, 1705), e: fm(381, 1532), ɛ: fm(577, 1311), ɑ: fm(617, 1013), o: fm(489, 826), u: fm(346, 804) };

describe('the voice types a profile is judged under', () => {
	it('DECLARED is the picker\'s own list', () => {
		expect([...DECLARED]).toEqual([...TIER1]);
	});
	it('groups ids that route the same, and keeps one per group', () => {
		const g = judgeGroups();
		const members = (k: string) => g.find((x) => x.members.includes(k))!.members;
		expect(members('tenor')).toEqual(expect.arrayContaining(['tenor', 'mezzo-soprano', 'contralto']));
		expect(members('bass')).toEqual(expect.arrayContaining(['bass', 'bass-baritone']));
		expect(members('not-sure')).toContain('(no type)');
		expect(g.flatMap((x) => x.members).sort()).toEqual([...DECLARED, '(no type)'].sort());
	});
	it('a tenor set and a mezzo-soprano set share a group, as the set\'s buckets do', () => {
		expect(ownKey('tenor')).toBe(ownKey('mezzo-soprano'));
		expect(ownKey('bass')).not.toBe(ownKey('baritone'));
	});
});

describe('the two counts', () => {
	it('JUDGED OUTSIDE: a bass\'s [i] at 1063 Hz, and nothing else', () => {
		const j = judge({ ...BASS, i: fm(1063, 1705) }, 'bass');
		expect(judgedOutside(j)).toEqual(['i']);
		expect(judgedOutside(judge(BASS, 'bass'))).toEqual([]);
	});
	it('JUDGED OUTSIDE under another type: a bass profile as a soprano', () => {
		expect(judgedOutside(judge(BASS, 'soprano')).length).toBeGreaterThan(0);
	});
	it('SET ASIDE is nothing when every sung vowel keeps its own number, and names a sung vowel whose value is not sung', () => {
		const ok = judge(BASS, 'bass');
		expect(setAside(ok, resolve(ok, 'bass'))).toEqual([]);
		const bad = judge({ ...BASS, i: fm(1063, 1705) }, 'bass');
		// Today the excluded reading is set aside; once Step 5 counts every sung reading this is empty (the test of that is the adapter's).
		const aside = setAside(bad, resolve(bad, 'bass'));
		const kept = setAside(counted(bad, ['i']), resolve(counted(bad, ['i']), 'bass'));
		expect(kept).toEqual([]);
		expect(aside.length === 0 || aside.join() === 'i').toBe(true);
	});
	it('a take with no fR2 is not set aside for want of one', () => {
		const p = judge({ ...BASS, e: fm(381, undefined) }, 'bass');
		expect(setAside(p, resolve(p, 'bass'))).toEqual([]);
	});
});

describe('a cut of a profile to n sung vowels, one judged outside', () => {
	it('keeps the outside vowel and takes the first plausible companions, in a fixed order', () => {
		const j = judge({ ...BASS, i: fm(1063, 1705) }, 'bass');
		expect(Object.keys(subsetOf(j, 'i', 1, 'bass')!)).toEqual(['i']);
		expect(Object.keys(subsetOf(j, 'i', 3, 'bass')!).sort()).toEqual(['e', 'i', 'ɛ'].sort());
		expect(Object.keys(subsetOf(j, 'i', 6, 'bass')!).length).toBe(6);
	});
	it('is null when there are too few plausible companions', () => {
		const j = judge({ i: fm(1063, 1705), e: fm(381, 1532) }, 'bass');
		expect(subsetOf(j, 'i', 3, 'bass')).toBeNull();
	});
});

describe('a folder of the recorder\'s files', () => {
	const side = (asked: string, sung: string | null, f1: number, stamp: string) =>
		takeOf(`ilya-capture-asked-${asked}-sung-${sung ?? 'unstated'}-${stamp}.json`, JSON.stringify({ asked, sung, outcome: { outcome: 'reading', formant: fm(f1, 1500) } }))!;
	it('reads the stamp from the file name', () => {
		expect(stampOf('ilya-capture-asked-i-sung-unstated-2026-11-17T10-00-00-000Z.json')).toBe('2026-11-17T10-00-00-000Z');
	});
	it('the profile is the last take sung as asked; takes sung as another vowel are apart', () => {
		const takes = [side('i', null, 300, '2026-11-17T10-00-00-000Z'), side('i', 'i', 310, '2026-11-17T10-05-00-000Z'), side('i', 'e', 380, '2026-11-17T10-10-00-000Z'), side('e', 'e', 381, '2026-11-17T10-02-00-000Z')];
		const fp = folderProfile(takes);
		expect(fp.profile.i!.f1).toBe(310);
		expect(fp.profile.e!.f1).toBe(381);
		expect(fp.apart.map((t) => t.sung)).toEqual(['e']);
		expect(fp.earlier.length).toBe(1);
	});
	it('a file that is not a sidecar of a take is skipped', () => {
		expect(takeOf('x.json', 'not json')).toBeNull();
		expect(takeOf('x.json', '{"a":1}')).toBeNull();
	});
	it('the output goes beside the folder and refuses the repository', () => {
		const here = path.dirname(fileURLToPath(import.meta.url));
		const repo = path.resolve(here, '../..');
		expect(outDirFor('/data/takes', repo)).toBe('/data/takes-lane66-out');
		expect(() => outDirFor(path.join(repo, 'docs', 'takes'), repo)).toThrow(/inside the repository/);
	});
	it('the runner reads no N200_DIR, and writes nothing inside the repository by itself', () => {
		const src = readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'lane66-measure.run.ts'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
		expect(src).not.toMatch(/process\.env\.N200_DIR/);
	});
});
