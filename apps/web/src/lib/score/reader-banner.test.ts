/**
 * Integration step 10: the banner "This score is Ilya's synthesis from an image…" (`upload.banner.reader`, ratified, step 8b).
 *
 * It checks three things. (1) The notice is earned by a score whose own origin is a homr reading (`readerNoticeKey`), run on a real
 * MusicXML fixture read as such and on the same fixture marked as homr's. (2) The page draws it before the wordless and partly-read
 * banners in the same slot, so it is the first thing above them when both apply (read from the page source, as `poem-join-gate.test.ts`
 * does, because a rule inside a `.svelte` file cannot run under vitest). (3) The banner component prints the ratified sentence.
 * WHEN IT FAILS: a singer reads that a MusicXML file is a synthesis from an image, or does not read it of a scan, or reads it below
 * the other banners. It relates to `scan-notice.test.ts` (the other banners) and `ratified-lines.test.ts` (the sentence).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { render } from 'svelte/server';
import { MusicXmlScoreParser, type ScoreParser } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { ingestScoreFile, readerNoticeKey, scanNotice, type IngestDeps } from '$lib/score/ingestion/ingest';
import type { ScoreReader } from '$lib/reader/score-reader';
import ScanBanner from '$lib/components/Drawer/ScanBanner.svelte';
import { t } from '$lib/i18n';

const xml = readFileSync(fileURLToPath(new URL('./ingestion/fixtures/sunless-01-engraved.musicxml', import.meta.url)), 'utf8');
const musicxmlParser: ScoreParser = { format: 'musicxml', parse: (input) => new MusicXmlScoreParser().parse({ ...input, data: parseXml(input.data as string) as unknown as Document }) } as unknown as ScoreParser;
const inert: ScoreReader = { convert: async () => { throw new Error('not reached'); }, dispose: () => {} };
const deps: IngestDeps = { scoreReader: inert, musicxmlParser };
const originOf = async (text: string) => {
	const out = await ingestScoreFile(new File([text], 'a.musicxml'), deps);
	if (!out.ok) throw new Error(JSON.stringify(out.error));
	return out.ingested.result.score.source.origin;
};

describe('the reader banner is earned by a scan and by nothing else', () => {
	it('is shown for a score read as a homr image reading', async () => {
		const origin = await originOf(xml.replace('<software>musx2mxl 0.2.9</software>', '<software>homr</software>'));
		expect(origin).toBe('homr-musicxml-from-image');
		expect(readerNoticeKey(origin)).toBe('upload.banner.reader');
	});
	it('is absent for a MusicXML fixture, and for every other origin', async () => {
		expect(readerNoticeKey(await originOf(xml))).toBeNull();
		for (const o of ['musicxml-direct', 'mnx-direct', 'denigma-mnx-from-musx', 'musescore-cli-musicxml-from-mscz', 'pdftomusic-pro-musicxml-from-vector-pdf', 'midi-converted-musicxml', undefined] as const) expect(readerNoticeKey(o)).toBeNull();
	});
});

describe('the page draws it first', () => {
	const page = readFileSync(fileURLToPath(new URL('../../routes/+page.svelte', import.meta.url)), 'utf8');
	it('before the wordless and partly-read banner, in the same slot', () => {
		const reader = page.indexOf('readerNoticeKey(ingestedScore?.result.score.source.origin)');
		const other = page.indexOf('{#if noLyricsFile}');
		expect(reader).toBeGreaterThan(0);
		expect(other).toBeGreaterThan(reader);
		expect(page.slice(reader, other)).toContain('upload.banner.reader');
		expect(page.slice(reader, other)).not.toContain('\n');
	});
	it('with the other scan banner still earned alongside it (no words read)', () => {
		const warn = [{ code: 'no-lyrics-found', message: 'm' }] as never;
		expect(scanNotice(warn, { format: 'musicxml', via: 'direct' }, 'homr-musicxml-from-image', 'a.png')?.key).toBe('upload.banner.noLyricsScan');
		expect(readerNoticeKey('homr-musicxml-from-image')).not.toBeNull();
	});
});

describe('the banner prints the ratified sentence', () => {
	it.each(['en', 'fr'] as const)('in %s', (language) => {
		const html = render(ScanBanner, { props: { noticeKey: 'upload.banner.reader', arg: '', language, onbar: () => {} } }).body.replace(/<!--.*?-->/g, '');
		expect(html).toContain(t('upload.banner.reader', language).replace(/’/g, '’').slice(0, 40));
		expect(html).toMatch(/^<p>/);
	});
});
