/**
 * Item 1 of the arrival seam (cloud-lane-88): the parser reads the print's own mark for a held note, `<extend>`, in any
 * MusicXML file, and names the notes it sustains in an `extender-notes` warning. The span is the one
 * `apps/web/src/lib/omr/extend-convention.ts` already defines (`extenderMelismaIds`), adopted rather than redrawn.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { MusicXmlScoreParser } from './musicxml-parser';
import { parseXml } from './mini-xml.test-support';

const read = async (name: string) => {
	const xml = readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');
	return new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document } as never);
};

describe('the parser reads <extend>', () => {
	it('names the notes a printed extender sustains: not the carrier, not past the next syllable, not a tied continuation, not across a rest', async () => {
		const { score, warnings } = await read('extend-held-note.xml');
		const w = warnings.find((x) => x.code === 'extender-notes');
		const notes = score.vocalLine.filter((e) => e.type === 'note');
		// Bar 1: the second note is held by the extender under «Ночь»; the fourth, after «над», carries no mark and is not.
		// Bar 2: the tied note after «Спи» is already a tie continuation and is left out; the note after it is held; the rest ends the line.
		expect(w?.eventIds).toEqual([notes[1].id, notes[6].id]);
		expect(score.vocalLine.map((e) => e.syllable?.text ?? null)).toEqual(['Ночь', null, 'над', null, 'Спи', null, null, null]);
	});

	it('says nothing where the file prints no extender', async () => {
		const { warnings } = await read('underlay-gap.musicxml');
		expect(warnings.some((x) => x.code === 'extender-notes')).toBe(false);
	});
});
