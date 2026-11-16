/**
 * strophic-byte-baseline.test.ts: D8 of the strophic lane A brief
 * (`docs/sessions/brief-code-strophic-lane-a_r5_2026-11-15.md`).
 *
 * One hash per tracked `.musicxml` of `paginateScore`'s pages at
 * `markup-pages.test.ts`'s geometry, taken on the lane's base commit
 * (`fb9d829e`, `Shane`, before any change of this lane). Every one-verse
 * score must stay byte-identical. Eight hashes were re-taken on 2026-11-16 (strophic lane A follow-up, fix 1): the tacet-sliver fix
 * changed those eight measure fixtures' pages on purpose (`docs/sessions/report-code-strophic-a-followup_r1_2026-11-16.md`). The committed file is
 * `strophic-byte-baseline.json`; it was written by running this test with
 * `UPDATE_STROPHIC_BASELINE=1` on the base commit and never again.
 *
 * `FIXTURES_ADDED_BY_THE_LANE` names, by path, the only files the baseline
 * does not hold: the lane's own new fixtures (Step 1). Any other file the
 * baseline lacks, or holds and cannot find, fails the test.
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeScore, MusicXmlScoreParser, renderScoreOf, type ParsedScore } from '@ilya/score-parser';
import { paginateMelody } from './melody-pages';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { ENGRAVING_DEFAULTS } from '$lib/score/engraving';

const ROOT = fileURLToPath(new URL('../../../../../', import.meta.url));
const BASELINE = fileURLToPath(new URL('./strophic-byte-baseline.json', import.meta.url));
const PAGE = { pageWidth: 624, pageHeight: 727 };

/** The lane's own new fixtures (Step 1). Not in the baseline by construction. */
export const FIXTURES_ADDED_BY_THE_LANE: readonly string[] = [
	'packages/score-parser/src/fixtures/repeat-one-verse.musicxml',
	'packages/score-parser/src/fixtures/strophic-repeat-key.musicxml',
	'packages/score-parser/src/fixtures/strophic-repeat-meter.musicxml',
	'packages/score-parser/src/fixtures/strophic-repeat.musicxml',
	'packages/score-parser/src/fixtures/strophic-stacked.musicxml',
	'packages/score-parser/src/fixtures/strophic-tacet-boundary.musicxml',
	'packages/score-parser/src/fixtures/strophic-volta-23.musicxml',
	'packages/score-parser/src/fixtures/strophic-volta-from-top.musicxml',
	'packages/score-parser/src/fixtures/strophic-volta.musicxml',
];

function trackedScores(): string[] {
	const out = execFileSync('git', ['ls-files', '-z', '--', '*.musicxml'], { cwd: ROOT, encoding: 'utf8' });
	return out
		.split('\0')
		.filter((p) => p !== '')
		.filter((p) => /^(apps|docs|tools|packages)\//.test(p))
		.sort();
}

async function parse(path: string): Promise<ParsedScore> {
	const res = await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(readFileSync(path, 'utf8')) as unknown as Document } as never);
	return res.score;
}

/** The pages as MELODY draws them: through the function the page calls (`paginateMelody`), with no later verse built. */
async function hashOf(rel: string): Promise<string> {
	const parsed = await parse(join(ROOT, rel));
	const analyzed = analyzeScore(parsed, { fR1: {} }, () => undefined, { generatedAt: '2026-10-11T00:00:00.000Z' });
	const { pages } = paginateMelody({ score: parsed, analyzed, ...PAGE, laterPageHeight: PAGE.pageHeight, engraving: ENGRAVING_DEFAULTS, channels: {}, verses: { profile: { fR1: {} }, notationPrefs: { reducedVowel: false, geminate: false, shcha: false, palatalNasal: false, reconstitution: false }, openSyllabification: false }, language: 'en' });
	return createHash('sha256').update(pages.join('\u0000')).digest('hex');
}

describe('D8: one-verse scores are byte-identical to the base commit', () => {
	const files = trackedScores();
	const baseline: Record<string, string> = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : {};

	if (process.env.UPDATE_STROPHIC_BASELINE === '1') {
		it('writes the baseline (run once, on the base commit)', async () => {
			const out: Record<string, string> = {};
			for (const f of files) out[f] = await hashOf(f);
			writeFileSync(BASELINE, JSON.stringify(out, null, '\t') + '\n');
		}, 600_000);
		return;
	}

	it('the baseline names exactly the tracked scores, bar the lane’s own fixtures', () => {
		const expected = files.filter((f) => !FIXTURES_ADDED_BY_THE_LANE.includes(f));
		expect(Object.keys(baseline).sort()).toEqual(expected);
	});

	it.each(Object.keys(baseline).sort())('%s', async (rel) => {
		expect(await hashOf(rel)).toBe(baseline[rel]);
	}, 60_000);

	/* D8: "for every tracked file other than the new fixtures, that function returns its input score by reference". The
	   hashes above go through `paginateMelody` with the later-verse build present, but only this assertion says that
	   `renderScoreOf` answered "the notated score" and not a copy that happens to draw the same. No exception is named:
	   none of the 207 baseline scores has a second Cyrillic verse. */
	it.each(Object.keys(baseline).sort())('the render score of %s is the parsed score itself', async (rel) => {
		const parsed = await parse(join(ROOT, rel));
		const r = renderScoreOf(parsed);
		expect(r.path).toBe('notated');
		expect(r.score).toBe(parsed);
	}, 60_000);
});
