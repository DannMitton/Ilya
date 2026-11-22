/**
 * Lane 83: an extender is drawn from what the page draws, never from where the
 * words came (Dann, 2026-11-22 04:49). The file loop in `renderAnalyzedStaff`
 * that decides a melisma reads `cyrPreview ?? syllable.text`, the same
 * expression the underlay and the singer's own loop read.
 *
 * Fixtures: `fixtures/underlay-gap.musicxml` (new, synthetic) and the
 * Tchaikovsky voice part the measure phase pinned.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser } from './musicxml-parser';
import { parseXml } from './mini-xml.test-support';
import { analyzeScore } from './overlay-engine';
import { prepareSmuflFont } from './smufl-metadata';
import { renderSystemSlice } from './page-layout';
import type { ParsedScore } from './types';

const fonts = new URL('../../../apps/web/static/fonts/', import.meta.url);
const readJson = (p: string): unknown => JSON.parse(readFileSync(new URL(p, fonts), 'utf8'));
const maestro = prepareSmuflFont(readJson('finale-maestro/FinaleMaestro.json'), prepareSmuflFont(readJson('bravura/bravura_metadata.json')));
const OPTS = { font: maestro, fontFamily: 'Finale Maestro', lineGap: 12, staffMidY: 60 };

async function parseXmlText(xml: string): Promise<ParsedScore> {
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document } as never)).score;
}
const gap = (): Promise<ParsedScore> => parseXmlText(readFileSync(new URL('./fixtures/underlay-gap.musicxml', import.meta.url), 'utf8'));
const tchaikovsky = (): Promise<ParsedScore> =>
	parseXmlText(readFileSync(new URL('../../../docs/sessions/measure-phase1_r1_2026-10-02/tchaikovsky-op38-3-voice.musicxml', import.meta.url), 'utf8'));
const draw = (s: ParsedScore, extra: Record<string, unknown> = {}): string => {
	const a = analyzeScore(s, { fR1: {} }, () => undefined, { generatedAt: '2026-10-20T00:00:00.000Z' });
	return renderSystemSlice(s, a, { ...OPTS, ...extra }, 0, s.measures.length - 1, { finalBarline: true });
};
const extenders = (svg: string): string[] => [...svg.matchAll(/data-extender="([^"]*)"/g)].map((m) => m[1]);
const notes = (s: ParsedScore): string[] => s.vocalLine.filter((e) => e.type === 'note').map((e) => e.id);

describe('lane 83: the extender follows what the page draws', () => {
	it('draws an extender after each file gap when nothing else supplies a word (both are real sustains)', async () => {
		const s = await gap();
		const n = notes(s);
		expect(extenders(draw(s))).toEqual([n[0], n[2]]);
	});

	it('draws NO extender where the singer\'s words fill the file\'s gap: the note draws a word, so it is no sustain', async () => {
		const s = await gap();
		const n = notes(s);
		// n[3] is bare in the file; the pasted lyrics give it "ту". n[1] stays bare, so n[0]'s sustain is real.
		const svg = draw(s, { cyrPreview: { [n[3]]: 'ту' } });
		expect(extenders(svg)).toEqual([n[0]]);
	});

	it('draws no extender at all when the singer\'s words fill every gap', async () => {
		const s = await gap();
		const n = notes(s);
		expect(extenders(draw(s, { cyrPreview: { [n[1]]: 'ти', [n[3]]: 'ту' } }))).toEqual([]);
	});

	it('a note that draws nothing after a note that draws a word still opens a melisma and its extender', async () => {
		const s = await gap();
		const n = notes(s);
		// The pairing replaces the whole underlay: n[0] is drawn from it, and n[1] has no entry and no file word that outranks it.
		const svg = draw(s, { cyrPreview: { [n[0]]: 'Ночь', [n[2]]: 'над', [n[3]]: 'ту' } });
		expect(extenders(svg)).toEqual([n[0]]);
	});

	it('a word the file does not carry can open a run: the pairing\'s word on a bare note, then a bare note', async () => {
		const s = await gap();
		const n = notes(s);
		// n[1] is bare in the file. Given "ти" it draws a word, so n[0] ends its sustain and n[1] opens none (n[2] draws "над").
		expect(extenders(draw(s, { cyrPreview: { [n[1]]: 'ти' } }))).toEqual([n[2]]);
	});

	it('the Tchaikovsky voice part still draws exactly two extenders, the held finals of "читъ!" and "лю!"', async () => {
		const s = await tchaikovsky();
		const svg = draw(s);
		expect(extenders(svg)).toEqual(['m56-0-1', 'm91-0-1']);
		const text = (id: string): string | undefined => s.vocalLine.find((e) => e.id === id)?.syllable?.text;
		expect(text('m56-0-1')).toBe('читъ!');
		expect(text('m91-0-1')).toBe('лю!');
	});

	it('the Tchaikovsky voice part draws the same two when the pairing repeats the file\'s own words', async () => {
		const s = await tchaikovsky();
		const mirror: Record<string, string> = {};
		for (const e of s.vocalLine) if (e.type === 'note' && e.syllable?.text) mirror[e.id] = e.syllable.text;
		expect(extenders(draw(s, { cyrPreview: mirror }))).toEqual(['m56-0-1', 'm91-0-1']);
	});
});
