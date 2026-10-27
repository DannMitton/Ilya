/**
 * N.194 r5, step 4: the Loupe's break button, on the pipeline's own output and the real undo wiring.
 *
 * There is no page here. The harness is a plain document, the real `CorrectionCursor`, the real
 * `createUndoHistory`, and a `handleInput` that does what the page's does to the things these tests read
 * (sets the text, re-runs the pipeline, advances the seated text). It does NOT run `transcribeText`'s re-seat,
 * so "the seats follow" is proved by re-seating from scratch on the new lines and comparing keys and origins.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MusicXmlScoreParser, type ParsedScore, type ScoreParser } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { ingestScoreFile, type IngestDeps } from '$lib/score/ingestion/ingest';
import type { ScoreReader } from '$lib/reader/score-reader';
import { collectScoreWords, scoreWordsText } from '$lib/score/vowel-resolver';
import { buildSlotQueue, drawPairings, refreshPairings, type PairingMap, type Slot, type SlotOrigin } from '$lib/score/pairings';
import { CorrectionCursor } from '$lib/score/correction-cursor.svelte';
import { createUndoHistory } from '$lib/score/undo-wiring.svelte';
import { stackLabel } from '$lib/score/undo-history.svelte';
import type { SongDocument } from '$lib/library/document.svelte';
import { t } from '$lib/i18n';
import { processText } from '$lib/pipeline';
import type { LineData } from '$lib/types';
import { loadRealData } from '$lib/syntactic-break.support';
import { sameWords } from './same-words';
import { breakControl, breakState, noteOfOrigin, planBreak, type BreakInput } from './break-here';

let song1 = '';
let sunless04: ParsedScore;

const note = (step: string, text?: string, syllabic = 'single') =>
	`<note><pitch><step>${step}</step><octave>3</octave></pitch><duration>1</duration><voice>1</voice><type>quarter</type>${
		text === undefined ? '' : `<lyric number="1"><syllabic>${syllabic}</syllabic><text>${text}</text></lyric>`
	}</note>`;
/** Sunless no. 4, «я на правду», with the mark in the SUNG verse (`diction-fold-live.test.ts`): the fold writes «я\u00A0#» into it. */
const sunless04Shape = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0"><part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list>
<part id="P1"><measure number="1"><attributes><divisions>1</divisions><time><beats>5</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>
${note('C', 'я')}${note('D', '#')}${note('E', 'на')}${note('F', 'прав', 'begin')}${note('G', 'ду', 'end')}
</measure></part></score-partwise>`;
const musicxmlParser: ScoreParser = {
	canParse: () => true,
	parse: (input) => new MusicXmlScoreParser().parse({ ...input, data: parseXml(input.data as string) as unknown as Document }),
};
const inertReader: ScoreReader = { convert: async () => { throw new Error('not reached'); }, dispose: () => {} };
const deps: IngestDeps = { scoreReader: inertReader, musicxmlParser };

beforeAll(async () => {
	loadRealData();
	const xml = readFileSync(fileURLToPath(new URL('../score/ingestion/fixtures/sunless-01-engraved.musicxml', import.meta.url)), 'utf8');
	const { score } = await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: 'sunless-01-engraved.musicxml' });
	song1 = scoreWordsText(collectScoreWords(score, 1));
	const out = await ingestScoreFile(new File([sunless04Shape], 'sunless-04-shape.musicxml'), deps);
	if (!out.ok) throw new Error(`ingest failed: ${JSON.stringify(out.error)}`);
	sunless04 = out.ingested.result.score;
}, 60_000);

/** One note per slot, `n0`, `n1`, ..., each carrying its slot: what a fully seated song looks like. */
function seatAll(slots: readonly Slot[]): PairingMap {
	return Object.fromEntries(
		slots.map((s, k) => [`n${k}`, { kind: 'syllable' as const, cyrillic: s.cyrillic, ipa: s.ipa, vowel: s.vowel, origin: s.origin }]),
	);
}
const same = (a: SlotOrigin, b: SlotOrigin) => a.lineIndex === b.lineIndex && a.wordIndex === b.wordIndex && a.slotIndex === b.slotIndex;
/** The note under the syllable at (line, word, slot). */
const noteUnder = (pairings: PairingMap, line: number, word: number, slot: number): string => {
	const id = Object.entries(pairings).find(([, p]) => p.kind === 'syllable' && same(p.origin, { lineIndex: line, wordIndex: word, slotIndex: slot, word: '' }))?.[0];
	if (!id) throw new Error(`no note under ${line}-${word}-${slot}`);
	return id;
};
const originsOf = (map: PairingMap) => Object.entries(map).map(([id, p]) => [id, p.kind === 'syllable' ? [p.origin.lineIndex, p.origin.wordIndex, p.origin.slotIndex, p.origin.word] : p.kind]);

/** The page, as far as the button touches it. */
function page(text: string, opts: { phraseEnds?: ReadonlyMap<string, boolean> } = {}) {
	const process = (s: string): LineData[] => processText(s, opts.phraseEnds ? { phraseEnds: opts.phraseEnds } : {});
	let lines = process(text);
	const doc = { inputText: text, seatedText: text, pairings: seatAll(buildSlotQueue(lines)), corrections: {} } as unknown as SongDocument;
	const cursor = new CorrectionCursor(() => [], () => true);
	const handleInput = (next: string) => {
		doc.inputText = next;
		lines = process(next);
		doc.seatedText = next;
	};
	const history = createUndoHistory(() => doc, cursor, handleInput);
	const read = (): BreakInput => ({
		text: doc.inputText, lines, slots: buildSlotQueue(lines), pairings: doc.pairings,
		selectedEventId: cursor.selectedEventId, targetIds: Object.keys(doc.pairings),
	});
	const control = () => breakControl(read(), { push: history.push, write: handleInput, pairings: () => doc.pairings, select: (id) => (cursor.selectedEventId = id) });
	return { doc, cursor, history, read, control, get lines() { return lines; }, handleInput };
}
const select = (p: ReturnType<typeof page>, line: number, word: number, slot: number) => (p.cursor.selectedEventId = noteUnder(p.doc.pairings, line, word, slot));
const ipaOfSlot = (lines: LineData[], line: number, word: number, slot: number) =>
	buildSlotQueue(lines).find((s) => same(s.origin, { lineIndex: line, wordIndex: word, slotIndex: slot, word: '' }))!.ipa;

describe('done-when 1: song 1, «Комнатка»', () => {
	it('the pill reads "Break after this word"; a press writes \\u00A0# after «Комнатка» and nothing else; the IPA of «ка» carries a bare #; the selection is under «ка»', () => {
		const p = page(song1);
		select(p, 0, 0, 1); // «нат»
		const c = p.control();
		expect(c.state).toBe('insert');
		expect(t('loupe.place.breakAfter', 'en')).toBe('Break after this word');
		c.onbreak();
		expect(p.doc.inputText).toBe(song1.replace('Комнатка ', 'Комнатка\u00A0# '));
		expect(p.doc.inputText.length).toBe(song1.length + 2);
		const ka = ipaOfSlot(p.lines, 0, 0, 2);
		expect(ka.endsWith('#')).toBe(true);
		expect(ka.endsWith('\u00A0#')).toBe(false); // no space added in the IPA graft
		expect(ipaOfSlot(p.lines, 0, 0, 1)).not.toContain('#');
		expect(p.cursor.selectedEventId).toBe(noteUnder(p.doc.pairings, 0, 0, 2));
		expect(buildSlotQueue(p.lines).filter((s) => s.ipa.includes('#'))).toHaveLength(1);
	});
	it('a press on the note under «ка» alone writes the same text and lands on the same note (the jump is idempotent)', () => {
		const a = page(song1);
		select(a, 0, 0, 1);
		a.control().onbreak();
		const b = page(song1);
		select(b, 0, 0, 2);
		b.control().onbreak();
		expect(b.doc.inputText).toBe(a.doc.inputText);
		expect(b.cursor.selectedEventId).toBe(a.cursor.selectedEventId);
		const first = page(song1);
		select(first, 0, 0, 0); // «Ком»
		first.control().onbreak();
		expect(first.doc.inputText).toBe(a.doc.inputText);
	});
	it('the # takes no note: every key and every origin is what a fresh seat of the new lines gives, and only the shown IPA changes', () => {
		const p = page(song1);
		const before = JSON.parse(JSON.stringify(p.doc.pairings)) as PairingMap;
		select(p, 0, 0, 1);
		p.control().onbreak();
		const fresh = seatAll(buildSlotQueue(p.lines));
		expect(originsOf(fresh)).toEqual(originsOf(before));
		expect(Object.keys(p.doc.pairings)).toEqual(Object.keys(before));
		const shown = refreshPairings(p.doc.pairings, buildSlotQueue(p.lines));
		expect(originsOf(shown)).toEqual(originsOf(before));
		const kaId = noteUnder(p.doc.pairings, 0, 0, 2);
		expect((shown[kaId] as { ipa: string }).ipa.endsWith('#')).toBe(true);
	});
	it('sameWords(doc.inputText, scoreText) stays true across the press, and across a Remove', () => {
		const p = page(song1);
		select(p, 0, 0, 1);
		p.control().onbreak();
		expect(p.doc.inputText).toContain('\u00A0#');
		expect(sameWords(p.doc.inputText, song1)).toBe(true);
		p.control().onbreak(); // the pill now reads Remove
		expect(p.doc.inputText).toBe(song1);
		expect(sameWords(p.doc.inputText, song1)).toBe(true);
	});
});

describe('done-when 3: Remove, and the named Undo', () => {
	it('after a press the pill reads "Remove break"; a press restores the text byte for byte', () => {
		const p = page(song1);
		select(p, 0, 0, 1);
		p.control().onbreak();
		expect(p.control().state).toBe('remove');
		expect(t('loupe.place.breakRemove', 'en')).toBe('Remove break');
		p.control().onbreak();
		expect(p.doc.inputText).toBe(song1);
		expect(p.control().state).toBe('insert');
	});
	it('the Undo pill reads the sentence, and pressed restores the text byte for byte, with lines and pairings equal to the pre-press ones', () => {
		const p = page(song1);
		select(p, 0, 0, 1);
		const linesBefore = JSON.stringify(p.lines);
		const pairingsBefore = JSON.stringify(p.doc.pairings);
		const selectedBefore = p.cursor.selectedEventId;
		p.control().onbreak();
		expect(stackLabel(p.history.undoStack, (key) => t(key, 'en'))).toBe('break placed');
		expect(stackLabel(p.history.undoStack, (key) => t(key, 'fr'))).toBe('frontière placée');
		p.history.undo();
		expect(p.doc.inputText).toBe(song1);
		expect(JSON.stringify(p.lines)).toBe(linesBefore);
		expect(JSON.stringify(p.doc.pairings)).toBe(pairingsBefore);
		expect(p.cursor.selectedEventId).toBe(selectedBefore);
		expect(p.doc.seatedText).toBe(p.doc.inputText);
	});
	it('undo then redo returns the text with \\u00A0# and its IPA', () => {
		const p = page(song1);
		select(p, 0, 0, 1);
		p.control().onbreak();
		const marked = p.doc.inputText;
		const ipa = ipaOfSlot(p.lines, 0, 0, 2);
		p.history.undo();
		expect(p.doc.inputText).toBe(song1);
		p.history.redo();
		expect(p.doc.inputText).toBe(marked);
		expect(ipaOfSlot(p.lines, 0, 0, 2)).toBe(ipa);
		expect(p.doc.seatedText).toBe(p.doc.inputText);
	});
	it('a Remove is undone and redone the same way, and reads "break removed"', () => {
		const p = page(song1);
		select(p, 0, 0, 1);
		p.control().onbreak();
		p.control().onbreak();
		expect(stackLabel(p.history.undoStack, (key) => t(key, 'en'))).toBe('break removed');
		expect(stackLabel(p.history.undoStack, (key) => t(key, 'fr'))).toBe('frontière retirée');
		p.history.undo();
		expect(p.doc.inputText).toContain('Комнатка\u00A0# ');
		p.history.undo();
		expect(p.doc.inputText).toBe(song1);
	});
	it('an Undo of a different verb after typing leaves the text as typed (the entry carries no text)', () => {
		const p = page(song1);
		select(p, 0, 0, 1);
		p.history.push({ kind: 'text', key: 'loupe.undo.cleared' }); // a placement verb: no text
		p.handleInput(song1 + ' слово');
		p.history.undo();
		expect(p.doc.inputText).toBe(song1 + ' слово');
	});
	it('text typed after the press is lost by that Undo and comes back with Redo', () => {
		const p = page(song1);
		select(p, 0, 0, 1);
		p.control().onbreak();
		const marked = p.doc.inputText;
		p.handleInput(marked + ' слово');
		p.history.undo();
		expect(p.doc.inputText).toBe(song1);
		p.history.redo();
		expect(p.doc.inputText).toBe(marked + ' слово');
	});
	it('a song switch empties the stacks', () => {
		const p = page(song1);
		select(p, 0, 0, 1);
		p.control().onbreak();
		p.history.clear();
		expect([p.history.undoStack, p.history.redoStack]).toEqual([[], []]);
	});
});

describe('done-when 4: the pill is off, and says why only for an implied break', () => {
	const off = (p: ReturnType<typeof page>) => breakState(p.read());
	it('no note is selected: off, no reason', () => {
		const p = page(song1);
		expect(off(p)).toEqual({ state: 'off', implied: false });
	});
	it('lines is empty: off, no reason', () => {
		const p = page(song1);
		select(p, 0, 0, 1);
		expect(breakState({ ...p.read(), lines: [] })).toEqual({ state: 'off', implied: false });
	});
	it('a melisma or an empty mark: off, no reason', () => {
		const p = page(song1);
		for (const kind of ['melisma', 'empty'] as const) {
			p.doc.pairings = { ...p.doc.pairings, m1: { kind } };
			p.cursor.selectedEventId = 'm1';
			expect(off(p), kind).toEqual({ state: 'off', implied: false });
		}
	});
	it('a note with no pairing: off, no reason', () => {
		const p = page(song1);
		p.cursor.selectedEventId = 'nowhere';
		expect(off(p)).toEqual({ state: 'off', implied: false });
	});
	it('a tie’s continuation is a note and not a target: off, no reason', () => {
		const p = page(song1);
		select(p, 0, 0, 1);
		expect(breakState({ ...p.read(), targetIds: [] })).toEqual({ state: 'off', implied: false });
	});
	it('the unit ends in a comma, from the note under «ляд» (Dann’s 01:38 example, «тень непроглядная,»): off, and the reason shows', () => {
		// The brief's example is the hand-typed poem of `one-action.test.ts:134`. The fixture's own sung verse spells it «не проглядная,».
		const p = page('Комнатка тесная, тихая, милая;\nтень непроглядная, тень безответная;');
		select(p, 1, 1, 2); // неп-рог-ляд-на-я: «ляд» is the third syllable
		expect(p.read().slots.find((s) => same(s.origin, { lineIndex: 1, wordIndex: 1, slotIndex: 2, word: '' }))!.cyrillic).toBe('ляд');
		expect(off(p)).toEqual({ state: 'off', implied: true });
		expect(planBreak(p.read())).toBeNull();
	});
	it('the same on song 1’s own sung verse: «не проглядная,» is a unit that ends in the comma', () => {
		const p = page(song1);
		const words = song1.split(' ');
		const word = words.indexOf('проглядная,');
		expect(word).toBeGreaterThan(0);
		expect(words[word - 1]).toBe('не');
		select(p, 0, word, 1); // the second syllable of «проглядная,»
		expect(off(p)).toEqual({ state: 'off', implied: true });
		select(p, 0, word - 1, 0); // the note under «не», the unit's first word
		expect(off(p)).toEqual({ state: 'off', implied: true });
	});
	it('the unit is the last word of its line: off, and the reason shows', () => {
		const p = page('вас благодать\nдом мой');
		select(p, 0, 1, 0);
		expect(off(p)).toEqual({ state: 'off', implied: true });
		select(p, 1, 1, 0);
		expect(off(p)).toEqual({ state: 'off', implied: true });
	});
	it('the unit ends before a rest the score places: off, and the reason shows', () => {
		// `phraseEnds` is what the page derives from the score's rests (`phrase-ends.ts`, "0-1" = line 0, word 1). Built here by hand: the page-level derivation from a real fixture is NOT RUN.
		const p = page('вас благодать дом', { phraseEnds: new Map([['0-1', true]]) });
		select(p, 0, 1, 0);
		expect(p.lines[0].words[1].boundarySource).toBe('score');
		expect(off(p)).toEqual({ state: 'off', implied: true });
		select(p, 0, 0, 0);
		expect(off(p).state).toBe('insert');
	});
	it('a pressed disabled pill writes nothing', () => {
		const p = page(song1);
		const c = p.control();
		c.onbreak();
		expect(p.doc.inputText).toBe(song1);
		expect(p.history.undoStack).toEqual([]);
	});
});

describe('done-when 5: «велит-ли»', () => {
	it('from the host’s syllable the mark lands after the whole token, and the selection jumps to the particle’s note', () => {
		const p = page('велит-ли дом');
		const slots = buildSlotQueue(p.lines);
		const hostSlot = slots.find((s) => s.origin.wordIndex === 0)!;
		select(p, 0, 0, hostSlot.origin.slotIndex);
		p.control().onbreak();
		expect(p.doc.inputText).toBe('велит-ли\u00A0# дом');
		const particle = buildSlotQueue(p.lines).find((s) => s.origin.wordIndex === 1)!;
		expect(p.cursor.selectedEventId).toBe(noteUnder(p.doc.pairings, 0, 1, particle.origin.slotIndex));
	});
});

describe('where the selection goes', () => {
	it('if the unit’s last syllable is not placed on a note, the selection stays and the # is still written', () => {
		const p = page('вас благодать дом');
		select(p, 0, 1, 0); // «бла»: the unit's last syllable is «дать»
		const selected = p.cursor.selectedEventId;
		const lastNote = noteUnder(p.doc.pairings, 0, 1, 2);
		const { [lastNote]: _gone, ...rest } = p.doc.pairings;
		p.doc.pairings = rest;
		p.control().onbreak();
		expect(p.doc.inputText).toBe('вас благодать\u00A0# дом');
		expect(p.cursor.selectedEventId).toBe(selected);
	});
	it('noteOfOrigin finds a pairing by its origin, and null where none carries it', () => {
		const p = page('вас благодать');
		const o = buildSlotQueue(p.lines)[1].origin;
		expect(noteOfOrigin(p.doc.pairings, o)).toBe('n1');
		expect(noteOfOrigin({}, o)).toBeNull();
	});
});

describe('done-when 7: a score’s own # reads as placed (Dann 2026-10-25 23:52 (a))', () => {
	// Song 1's two marks sit in VERSE 2, the engraver's IPA verse (`diction-fold-live.test.ts:7-8`), not the sung verse that fills
	// Lyrics. The sung-verse case is the Sunless no. 4 shape, whose fold writes «я\u00A0#» into verse 1.
	it('Lyrics holding the score’s words: the pill reads "Remove break" on «я»; a press removes the # with its \\u00A0 and sameWords stays true', () => {
		const scoreText = scoreWordsText(collectScoreWords(sunless04, 1));
		expect(scoreText).toBe('я\u00A0# на правду');
		const p = page(scoreText);
		select(p, 0, 0, 0);
		expect(p.control().state).toBe('remove');
		expect(sameWords(p.doc.inputText, scoreText)).toBe(true);
		p.control().onbreak();
		expect(p.doc.inputText).toBe('я на правду');
		expect(sameWords(p.doc.inputText, scoreText)).toBe(true);
		expect(p.control().state).toBe('insert');
	});
	it('Song 1’s sung verse carries no mark, so the pill reads Break after this word everywhere it is on', () => {
		expect(song1).not.toContain('#');
	});
});

describe('done-when 8: a spaced dash is not a boundary (Dann 23:53)', () => {
	for (const text of ['слово – слово', 'слово - слово', 'слово — слово']) {
		it(`«${text}»: the pill is on before it, and a press writes the mark`, () => {
			const p = page(text);
			select(p, 0, 0, 1);
			expect(p.control().state).toBe('insert');
			p.control().onbreak();
			expect(p.doc.inputText).toBe(text.replace('слово ', 'слово\u00A0# '));
		});
	}
});

describe('done-when 6: the button’s output prints in no Cyrillic, no Poem, and not as [#] (the glued form)', () => {
	it('after a press, no slot’s Cyrillic and no word field holds a #; the IPA holds exactly one, bare', () => {
		const p = page('Слух был, а я не в силах петь');
		select(p, 0, 4, 0); // «не»
		p.control().onbreak();
		expect(p.doc.inputText).toBe('Слух был, а я не в силах\u00A0# петь');
		const slots = buildSlotQueue(p.lines);
		for (const s of slots) expect(s.cyrillic).not.toContain('#');
		for (const w of p.lines.flatMap((l) => l.words)) for (const f of [w.cyrillic, w.cleanWord, w.punctuation, w.stressedCyrillic]) expect(f ?? '').not.toContain('#');
		const withMark = slots.filter((s) => s.ipa.includes('#'));
		expect(withMark).toHaveLength(1);
		expect(withMark[0].ipa.endsWith('#')).toBe(true);
		for (const d of Object.values(drawPairings(p.doc.pairings, p.lines, { openSyllabification: false, reconstitution: false }))) expect(d.cyrillic).not.toContain('#');
	});
	it('the glued Lyrics reads the same on the page as the bare form', () => {
		const glued = processText('Я\u00A0# на правду').flatMap((l) => l.words.map((w) => [w.ipaDisplay, w.cyrillic]));
		const bare = processText('Я# на правду').flatMap((l) => l.words.map((w) => [w.ipaDisplay, w.cyrillic]));
		expect(glued).toEqual(bare);
	});
});

describe('the pill row, read as source', () => {
	const row = readFileSync(fileURLToPath(new URL('../score/LoupePlacementRow.svelte', import.meta.url)), 'utf8');
	it('draws the break pill with the ratified keys, disabled when off', () => {
		expect(row).toContain("'loupe.place.breakRemove' : 'loupe.place.breakAfter'");
		expect(row).toContain("disabled={placement.break.state === 'off'}");
	});
	it('shows the reason only for an off pill whose break is implied, and inside the row that print hides', () => {
		expect(row).toContain("{#if placement.break.state === 'off' && placement.break.implied}");
		expect(row).toContain("t('loupe.place.breakImplied', language)");
		expect(row.indexOf('loupe-place-reason')).toBeLessThan(row.indexOf('</div>'));
		expect(row).toMatch(/@media print \{\s*\.loupe-place-row \{\s*display: none !important;/);
	});
});
