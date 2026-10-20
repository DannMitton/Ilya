/**
 * QUEUE row 149: a printed slur over the voice is a melisma the first seating observes
 * when the notes and the poem's syllables then come out even (Dann 2026-10-20 03:35, 03:37).
 *
 * Two bars of 3/4 as the brief builds them: bar 1 three quarters, bar 2 E5 A4 B4 with a slur from
 * E5 to A4, the poem «Дай-те бо-ка-лы!» as five slots. The real dictionary is loaded, as
 * `typed-hyphens.test.ts` loads it, because the slots come from `processText`.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { setStressDictionary, setSingerSupplement } from '@ilya/phonology';
import { setGlossDictionary } from '@ilya/dictionary';
import { MusicXmlScoreParser, analyzeScore, prepareSmuflFont, renderAnalyzedStaff, type ParsedScore } from '@ilya/score-parser';
import { processText } from '$lib/pipeline';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { buildSlotQueue, melismaIds, syllableTargetIds, toggleMelisma, type PairingMap } from '$lib/score/pairings';
import { mergeOnUploadObserving, observedTargets, slurContinuationIds } from '$lib/score/slur-seat';

const STATIC = join(__dirname, '../../../static');
const DATA = join(STATIC, 'data');

beforeAll(() => {
	const dictionary: Record<string, any> = {};
	for (const f of ['dictionary.86d83340-a.json', 'dictionary.86d83340-b.json'])
		for (const line of readFileSync(join(DATA, f), 'utf8').split(/\r?\n/)) {
			if (!line.trim()) continue;
			try {
				const [w, e] = JSON.parse(line);
				if (e.e !== undefined || e.f !== undefined) e.g = { en: e.e || '', fr: e.f || '' };
				dictionary[w] = e;
			} catch {
				/* a malformed line is skipped, as the loader skips it */
			}
		}
	setStressDictionary(dictionary);
	setGlossDictionary(dictionary);
	setSingerSupplement(JSON.parse(readFileSync(join(DATA, 'singer-supplement.json'), 'utf8')));
}, 60_000);

type N = { step: string; oct: number; type?: 'quarter' | 'half'; slur?: string[]; tie?: 'start' | 'stop' | 'both' };
const note = (n: N) =>
	`<note><pitch><step>${n.step}</step><octave>${n.oct}</octave></pitch><duration>${n.type === 'half' ? 48 : 24}</duration>${n.tie ? [n.tie === 'start' || n.tie === 'both' ? '<tie type="start"/>' : '', n.tie === 'stop' || n.tie === 'both' ? '<tie type="stop"/>' : ''].join('') : ''}<type>${n.type ?? 'quarter'}</type><notations>${(n.slur ?? []).join('')}${n.tie ? [n.tie === 'start' || n.tie === 'both' ? '<tied type="start"/>' : '', n.tie === 'stop' || n.tie === 'both' ? '<tied type="stop"/>' : ''].join('') : ''}</notations></note>`;
const rest = '<note><rest/><duration>24</duration><type>quarter</type></note>';
const slur = (type: 'start' | 'stop', number = 1) => `<slur type="${type}" number="${number}"/>`;
const doc = (bars: string[]) =>
	`<?xml version="1.0"?><score-partwise version="4.0"><part-list><score-part id="P1"><part-name>V</part-name></score-part></part-list><part id="P1">${bars
		.map((b, i) => `<measure number="${i + 1}">${i === 0 ? '<attributes><divisions>24</divisions><key><fifths>0</fifths></key><time><beats>3</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>' : ''}${b}</measure>`)
		.join('')}</part></score-partwise>`;

async function parse(bars: string[]): Promise<ParsedScore> {
	const res = await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(doc(bars)) as unknown as Document } as never);
	return res.score;
}

const BAR1 = [note({ step: 'C', oct: 4 }), note({ step: 'D', oct: 4 }), note({ step: 'E', oct: 4 })].join('');
const slurred = (extra = '') => [note({ step: 'E', oct: 5, slur: [slur('start')] }), note({ step: 'A', oct: 4, slur: [slur('stop')] }), note({ step: 'B', oct: 4 })].join('') + extra;
const plain = [note({ step: 'E', oct: 5 }), note({ step: 'A', oct: 4 }), note({ step: 'B', oct: 4 })].join('');
const queueOf = (poem: string) => buildSlotQueue(processText(poem));
const text = (map: PairingMap, id: string): string => {
	const p = map[id];
	return !p ? '-' : p.kind === 'syllable' ? p.cyrillic : p.kind;
};
const ids = (s: ParsedScore) => s.vocalLine.map((e) => e.id);

describe('row 149: the poem and the notes come out even', () => {
	it('the five-slot poem on six notes with a slur: T is 6, C is 1, so the gate passes', async () => {
		const score = await parse([BAR1, slurred()]);
		const q = queueOf('Дай-те бо-ка-лы!');
		expect(q).toHaveLength(5);
		expect(syllableTargetIds(score.vocalLine)).toHaveLength(6);
		expect([...slurContinuationIds(score.vocalLine)]).toEqual([ids(score)[4]]);
		const merged = mergeOnUploadObserving({}, score.vocalLine, q, true);
		const [a, b, c, d, e, f] = ids(score);
		expect([a, b, c, d, e, f].map((id) => text(merged.map, id))).toEqual(['Дай', 'те', 'бо', 'ка', 'melisma', 'лы!']);
		expect(melismaIds(merged.map)).toEqual(new Set([e]));
	});

	it('controls: the same bars without the slur, and a six-slot poem, seat one per note', async () => {
		const noSlur = await parse([BAR1, plain]);
		const q5 = queueOf('Дай-те бо-ка-лы!');
		const merged = mergeOnUploadObserving({}, noSlur.vocalLine, q5, true);
		expect(ids(noSlur).map((id) => text(merged.map, id))).toEqual(['Дай', 'те', 'бо', 'ка', 'лы!', '-']);
		expect(melismaIds(merged.map).size).toBe(0);
		const six = await parse([BAR1, plain]);
		const m6 = mergeOnUploadObserving({}, six.vocalLine, queueOf('Дай-те бо-ка-лы-ща'), true);
		expect(ids(six).map((id) => text(m6.map, id))).toEqual(['Дай', 'те', 'бо', 'ка', 'лы', 'ща']);
	});

	it('the phrasing-slur case: a slur and a six-slot poem seat one per note and write no melisma', async () => {
		const score = await parse([BAR1, slurred()]);
		const q6 = queueOf('Дай-те бо-ка-лы-ща');
		expect(q6).toHaveLength(6);
		expect(observedTargets(score.vocalLine, q6)).toEqual({ targetIds: syllableTargetIds(score.vocalLine), marks: {} });
		const merged = mergeOnUploadObserving({}, score.vocalLine, q6, true);
		expect(ids(score).map((id) => text(merged.map, id))).toEqual(['Дай', 'те', 'бо', 'ка', 'лы', 'ща']);
		expect(melismaIds(merged.map).size).toBe(0);
	});

	it('a phrasing slur over a syllabic passage (as many notes as syllables) leaves seating as today', async () => {
		const score = await parse([BAR1, slurred()]);
		const q = queueOf('Дай-те бо-ка-лы-ща');
		const today = mergeOnUploadObserving({}, score.vocalLine.map((e) => ({ ...e, slurs: undefined })), q, true);
		const observed = mergeOnUploadObserving({}, score.vocalLine, q, true);
		expect(observed.map).toEqual(today.map);
	});
});

describe('row 149: what is a continuation', () => {
	it('a tie inside a slur is not counted twice: the tie continuation is not a target', async () => {
		const bar2 = [note({ step: 'E', oct: 5, slur: [slur('start')], tie: 'start' }), note({ step: 'E', oct: 5, tie: 'stop', slur: [slur('stop')] }), note({ step: 'B', oct: 4 })].join('');
		const score = await parse([BAR1, bar2]);
		const targets = syllableTargetIds(score.vocalLine);
		expect(targets).toHaveLength(5); // the tie's second note is not a target
		const q = queueOf('Дай-те бо-ка-лы!');
		// T is 5; the slur's only continuation is the tie's second note, not a target, so C is 0 and today's seating stands.
		expect(observedTargets(score.vocalLine, q)).toEqual({ targetIds: targets, marks: {} });
	});

	it('a rest inside the slur does not break it, and nested slurs take the union once', async () => {
		const bar2 = [note({ step: 'E', oct: 5, slur: [slur('start', 1), slur('start', 2)] }), rest, note({ step: 'A', oct: 4, slur: [slur('stop', 2)] }), ''].join('');
		const bar3 = [note({ step: 'B', oct: 4, slur: [slur('stop', 1)] }), note({ step: 'C', oct: 5 }), note({ step: 'D', oct: 5 })].join('');
		const score = await parse([BAR1, bar2, bar3]);
		const c = slurContinuationIds(score.vocalLine);
		const notes = score.vocalLine.filter((e) => e.type === 'note');
		expect([...c].sort()).toEqual([notes[4].id, notes[5].id].sort());
	});

	it('only a start with a partner opens a span: a stop alone, or a start with no partner, makes none', () => {
		const ev = (id: string, slurs?: any[]) => ({ id, type: 'note' as const, slurs });
		expect(slurContinuationIds([ev('a', [{ type: 'start', number: 1 }]), ev('b')]).size).toBe(0);
		expect(slurContinuationIds([ev('a'), ev('b', [{ type: 'stop', number: 1, partnerEventId: 'a' }])]).size).toBe(0);
		expect([...slurContinuationIds([ev('a', [{ type: 'start', number: 1, partnerEventId: 'c' }]), ev('b'), ev('c')])]).toEqual(['b', 'c']);
	});
});

describe('row 149: no silent override, and the singer can undo', () => {
	it('a note the singer already decided keeps its decision', async () => {
		const score = await parse([BAR1, slurred()]);
		const q = queueOf('Дай-те бо-ка-лы!');
		const e = ids(score)[4];
		const merged = mergeOnUploadObserving({}, score.vocalLine, q, true);
		const decided: PairingMap = { ...merged.map, [e]: { kind: 'empty' } as never };
		// A second seating with placements already on the page is not a first seating: nothing is written.
		const again = mergeOnUploadObserving(decided, score.vocalLine, q, true);
		expect(again.proposed).toBe(false);
		expect(again.map[e]).toEqual({ kind: 'empty' });
	});

	it('the marks are written only where firstPass ran: a score that carries its own words is untouched', async () => {
		const score = await parse([BAR1, slurred()]);
		const merged = mergeOnUploadObserving({}, score.vocalLine, queueOf('Дай-те бо-ка-лы!'), false);
		expect(merged).toMatchObject({ map: {}, proposed: false });
	});

	it('undoing one observed melisma works as undoing the singer’s: the note is undecided and nothing else moves', async () => {
		const score = await parse([BAR1, slurred()]);
		const merged = mergeOnUploadObserving({}, score.vocalLine, queueOf('Дай-те бо-ка-лы!'), true);
		const e = ids(score)[4];
		const eventIds = score.vocalLine.filter((x) => x.type !== 'rest').map((x) => x.id);
		const undone = toggleMelisma(merged.map, eventIds, e);
		expect(undone.set).toBe(false);
		expect(undone.map[e]).toBeUndefined();
		// The next syllable stays where the gate put it: no re-seat ran.
		expect(text(undone.map, ids(score)[5])).toBe('лы!');
		expect(text(undone.map, ids(score)[3])).toBe('ка');
	});
});

describe('row 149: the drawing', () => {
	it('the rendered system carries the printed slur and no derived melisma arc, and the observed note draws no syllable of its own', async () => {
		const score = await parse([BAR1, slurred()]);
		const merged = mergeOnUploadObserving({}, score.vocalLine, queueOf('Дай-те бо-ка-лы!'), true);
		const read = (p: string): unknown => JSON.parse(readFileSync(join(STATIC, 'fonts', p), 'utf8'));
		const font = prepareSmuflFont(read('finale-maestro/FinaleMaestro.json'), prepareSmuflFont(read('bravura/bravura_metadata.json')));
		const analyzed = analyzeScore(score, { fR1: {} } as never, () => undefined, { generatedAt: '2026-10-20T00:00:00.000Z' });
		const cyrPreview: Record<string, string> = {};
		const ipaPreview: Record<string, string> = {};
		for (const [id, p] of Object.entries(merged.map)) if (p.kind === 'syllable') { cyrPreview[id] = p.cyrillic; ipaPreview[id] = p.ipa; }
		const svg = renderAnalyzedStaff(score, analyzed, { font, fontFamily: 'Finale Maestro', lineGap: 5.5, staffMidY: 60, melismaPreview: melismaIds(merged.map), cyrPreview, ipaPreview });
		expect(svg).toContain('data-slur-printed');
		// The observed note draws no syllable of its own and no arc beyond the file's own slur: «ка» once, «лы!» once.
		expect(svg).not.toMatch(/data-slur="/);
		expect(svg.match(/>ка</g)).toHaveLength(1);
		expect(svg.match(/>лы!</g)).toHaveLength(1);
		expect(svg.match(/data-slur-printed/g)).toHaveLength(1);
	});
});
