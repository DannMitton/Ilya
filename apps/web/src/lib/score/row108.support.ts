/**
 * Shared set-up for the row 108 tests (not itself a test): the real
 * dictionary, the two fixtures, their texts, and a score built in code for
 * the marks no fixture carries (`text/poem-first-seat.test.ts`'s pattern).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { setStressDictionary, setSingerSupplement } from '@ilya/phonology';
import { setGlossDictionary } from '@ilya/dictionary';
import { MusicXmlScoreParser, type ParsedScore } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { collectScoreWords, scoreWordsText } from './vowel-resolver';
import type { PairingMap } from './pairings';

const DATA = join(__dirname, '../../../static/data');
const FIXTURES = join(__dirname, 'ingestion/fixtures');

/** Loads the shipped dictionary the way `old-spelling.test.ts` does. Call from `beforeAll`. */
export function loadRealDictionary(): void {
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
}

export async function loadFixture(file: string): Promise<ParsedScore> {
	const xml = readFileSync(join(FIXTURES, file), 'utf8');
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: file })).score;
}

/**
 * Sunless 1 as repaired from the desk's extract, every bar (brief r5 steps 8 and 10): one vowel per note, 96 voice notes,
 * «в бью» on one note. `SUNLESS_LONE_V` is the same song AS FINALE PRINTED IT (`sunless-01-finale-lone-v.musicxml`, kept byte
 * for byte): the lone «в» on its own note and every syllable after it one note late. A test that exists for the lone «в» (the
 * clitic fold) reads that one, and is allow-listed in `score/ingestion/fixture-rule.test.ts`.
 */
export const SUNLESS = 'sunless-01-engraved.musicxml';
export const SUNLESS_LONE_V = 'sunless-01-finale-lone-v.musicxml';
export const TCHAIKOVSKY = 'tchaikovsky-op38-3-voice.musicxml';

/** The fill a drop leaves in Lyrics: the score's words on one line. */
export const oneLine = (score: ParsedScore): string => scoreWordsText(collectScoreWords(score, 1));

/** The same words in lines of `n` (the stand-in poem of `lay-out-seat.test.ts` is n = 7). */
export function inLines(text: string, n = 7): string {
	const t = text.split(' ');
	return Array.from({ length: Math.ceil(t.length / n) }, (_, i) => t.slice(i * n, i * n + n).join(' ')).join('\n');
}

/**
 * One-line coordinates to the coordinates of the same words in lines of `n`.
 * Part A builds the real thing; this is the ad hoc version the Part C tests
 * need before it exists.
 */
export function rekeyToLines(map: PairingMap, n = 7): PairingMap {
	const out: PairingMap = {};
	for (const [id, p] of Object.entries(map)) {
		out[id] =
			p.kind === 'syllable' && p.origin.lineIndex === 0
				? { ...p, origin: { ...p.origin, lineIndex: Math.floor(p.origin.wordIndex / n), wordIndex: p.origin.wordIndex % n } }
				: p;
	}
	return out;
}

export interface NoteSpec {
	step?: string;
	/** The syllable sung on the note; absent for a rest or a melisma continuation. */
	text?: string;
	rest?: boolean;
	breath?: boolean;
	caesura?: boolean;
	fermata?: boolean;
	/** A continuation of the previous note's tie. */
	tieStop?: boolean;
}

/** A one-part score of quarter notes in 4/4, one measure per four events. */
export async function buildScore(notes: NoteSpec[]): Promise<ParsedScore> {
	const body = notes
		.map((n) => {
			if (n.rest) return `<note><rest/><duration>1</duration><type>quarter</type>${n.fermata ? '<notations><fermata/></notations>' : ''}</note>`;
			const marks = [
				n.tieStop ? '<tied type="stop"/>' : '',
				n.fermata ? '<fermata/>' : '',
				n.breath || n.caesura ? `<articulations>${n.breath ? '<breath-mark/>' : ''}${n.caesura ? '<caesura/>' : ''}</articulations>` : '',
			].join('');
			return `<note><pitch><step>${n.step ?? 'C'}</step><octave>4</octave></pitch><duration>1</duration>${n.tieStop ? '<tie type="stop"/>' : ''}<type>quarter</type>${marks ? `<notations>${marks}</notations>` : ''}${
				n.text ? `<lyric number="1"><syllabic>single</syllabic><text>${n.text}</text></lyric>` : ''
			}</note>`;
		})
		.reduce<string[]>((acc, x, i) => ((i % 4 === 0 ? acc.push(x) : (acc[acc.length - 1] += x)), acc), [])
		.map((m, i) =>
			i === 0
				? `<measure number="1"><attributes><divisions>1</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>${m}</measure>`
				: `<measure number="${i + 1}">${m}</measure>`,
		)
		.join('');
	const xml = `<?xml version="1.0" encoding="UTF-8"?><score-partwise version="3.1"><part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list><part id="P1">${body}</part></score-partwise>`;
	return (await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: 'built.musicxml' })).score;
}
