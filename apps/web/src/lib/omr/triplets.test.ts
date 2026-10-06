/**
 * completeTriplets, the check for triplets homr read without their bracket
 * (`triplets.ts`), on hand-built bars, and on homr's own reading of the
 * second page of *Sunless* 3 (Mussorgsky, IMSLP 113877, PDF page 6), as
 * homr-web 0.2.0-ilya.3 (model 465, OCR off) wrote it in headless Chromium
 * on 2026-10-06 from a 400 dpi greyscale PNG of the page.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MusicXmlScoreParser } from '@ilya/score-parser';
import { parseXml } from '$lib/score/ingestion/mini-dom';
import { completeTriplets, readMetre } from './triplets';
import { joinPages } from './join-pages';

const C44 = { beats: 4, beatType: 4 };
const n = (type: string, duration: number, extra = '') =>
	`<note><pitch><step>C</step><octave>5</octave></pitch><duration>${duration}</duration><type>${type}</type>${extra}<voice>1</voice><staff>1</staff></note>`;
const r = (type: string, duration: number) => `<note><rest /><duration>${duration}</duration><type>${type}</type><voice>1</voice><staff>1</staff></note>`;
const T = '<time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification>';
const durations = (bar: readonly string[]) => bar.map((t) => /<duration>(\d+)/.exec(t)?.[1]).filter(Boolean).map(Number);

describe('completeTriplets', () => {
	it('rule 1: a bar of half, quarter, half, quarter in 4/4 is read as triplets throughout', () => {
		// divisions 6: a quarter is 6, a half 12; as triplets 4 and 8.
		const bar = [n('half', 12), n('quarter', 6), r('half', 12), n('quarter', 6)];
		const out = completeTriplets(bar, C44, 6, false);
		expect(out.rule).toBe(1);
		expect(out.divisions).toBeNull();
		expect(out.children.every((t) => t.includes(T))).toBe(true);
		expect(durations(out.children)).toEqual([8, 4, 8, 4]);
		// The time-modification follows the type, as homr writes it.
		expect(out.children[0]).toContain(`<type>half</type>${T}<voice>`);
	});

	it('rule 2: a run of triplets homr marked runs on to the end of the bar when only that fills it', () => {
		// Nine triplet eighths (3/4), then a quarter and an eighth: 9/8 in 4/4.
		const marked = Array.from({ length: 9 }, () => n('eighth', 2, T));
		const bar = [...marked, n('quarter', 6), n('eighth', 3)];
		const out = completeTriplets(bar, C44, 6, false);
		expect(out.rule).toBe(2);
		expect(out.children.every((t) => t.includes(T))).toBe(true);
		expect(durations(out.children)).toEqual([...Array(9).fill(2), 4, 2]);
	});

	it('multiplies the divisions by 3 for the bar where two thirds of a duration is not whole', () => {
		// divisions 2: a quarter is 2, an eighth 1.
		const bar = [n('quarter', 2), n('eighth', 1), n('eighth', 1), n('quarter', 2), n('quarter', 2), n('quarter', 2), n('quarter', 2)];
		const out = completeTriplets(bar, C44, 2, false);
		expect(out.rule).toBe(1);
		expect(out.divisions).toBe(6);
		expect(out.children[0]).toBe('<attributes><divisions>6</divisions></attributes>');
		expect(durations(out.children)).toEqual([4, 2, 2, 4, 4, 4, 4]);
	});

	it('leaves alone a bar that adds up, a bar that states its own metre, and a bar too long by anything but a half', () => {
		const full = [n('half', 12), n('half', 12)];
		expect(completeTriplets(full, C44, 6, false).rule).toBeNull();
		const long = [n('half', 12), n('quarter', 6), n('half', 12), n('quarter', 6)];
		expect(completeTriplets(long, C44, 6, true).rule).toBeNull();
		const odd = [n('half', 12), n('half', 12), n('eighth', 3)];
		expect(completeTriplets(odd, C44, 6, false).rule).toBeNull();
		expect(completeTriplets(long, null, 6, false).rule).toBeNull();
	});

	it('leaves alone a dotted note, a chord, a second voice, and a tuplet other than 3 in 2', () => {
		const dotted = [n('half', 18, '<dot />'), n('half', 12), n('quarter', 6)];
		expect(completeTriplets(dotted, C44, 6, false).rule).toBeNull();
		const chord = [n('half', 12), `<note><chord />${n('half', 12).slice(6)}`, n('quarter', 6), n('half', 12), n('quarter', 6)];
		expect(completeTriplets(chord, C44, 6, false).rule).toBeNull();
		const backup = [n('half', 12), n('quarter', 6), '<backup><duration>18</duration></backup>', n('half', 12), n('quarter', 6)];
		expect(completeTriplets(backup, C44, 6, false).rule).toBeNull();
		const five = '<time-modification><actual-notes>5</actual-notes><normal-notes>4</normal-notes></time-modification>';
		const quintuplet = [...Array.from({ length: 5 }, () => n('eighth', 2, five)), n('half', 12), n('quarter', 6)];
		expect(completeTriplets(quintuplet, C44, 6, false).rule).toBeNull();
	});

	it('reads a metre in the form the join keeps it', () => {
		expect(readMetre('<beats>3</beats><beat-type>8</beat-type>')).toEqual({ beats: 3, beatType: 8 });
		expect(readMetre(null)).toBeNull();
	});
});

describe('the triplet check inside joinPages', () => {
	const page = (body: string) =>
		`<?xml version="1.0"?><score-partwise version="4.0"><part-list><score-part id="P1"><part-name>Voice</part-name></score-part></part-list><part id="P1">${body}</part></score-partwise>`;
	const head = '<attributes><divisions>2</divisions><key><fifths>0</fifths></key><time><beats>4</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef></attributes>';

	it('changes a long bar, restores the divisions at the next bar, and leaves a full bar alone', () => {
		const out = joinPages([
			page(
				`<measure number="1">${head}${n('whole', 8)}</measure>` +
					`<measure number="2">${n('half', 4)}${n('quarter', 2)}${n('half', 4)}${n('quarter', 2)}</measure>` +
					`<measure number="3">${n('whole', 8)}</measure>`,
			),
		]);
		const bars = out.split('<measure ').slice(1);
		expect(bars[0]).not.toContain('time-modification');
		expect(bars[1].match(/<time-modification>/g)).toHaveLength(4);
		expect(bars[1]).toContain('<attributes><divisions>6</divisions></attributes>');
		expect(durations([bars[1]])).toEqual([8]);
		expect(bars[2]).toContain('<attributes><divisions>2</divisions></attributes>');
		expect(bars[2]).not.toContain('time-modification');
	});

	it('gives Ilya\'s score parser triplets that fill the bar, and the next bar its own divisions', async () => {
		const out = joinPages([
			page(
				`<measure number="1">${head}${n('half', 4)}${n('quarter', 2)}${n('half', 4)}${n('quarter', 2)}</measure>` +
					`<measure number="2">${n('half', 4)}${n('half', 4)}</measure>`,
			),
		]);
		// The first bar states the metre, so it is left alone: the second page's bars are the ones changed.
		expect(out).not.toContain('time-modification');
		const two = joinPages([page(`<measure number="1">${head}${n('whole', 8)}</measure>`), page(`<measure number="1">${n('half', 4)}${n('quarter', 2)}${n('half', 4)}${n('quarter', 2)}</measure><measure number="2">${n('half', 4)}${n('half', 4)}</measure>`)]);
		const result = await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(two) as unknown as Document, sourcePath: 'triplets.musicxml' });
		const score = result.score!;
		const inBar = (i: number) => score.vocalLine.filter((ev) => ev.measureIndex === score.measures[i].index).map((ev) => ev.duration.fraction);
		expect(inBar(1)).toEqual([
			{ numerator: 1, denominator: 3 },
			{ numerator: 1, denominator: 6 },
			{ numerator: 1, denominator: 3 },
			{ numerator: 1, denominator: 6 },
		]);
		expect(inBar(1).every((f, i) => score.vocalLine.filter((ev) => ev.measureIndex === score.measures[1].index)[i].duration.tuplet?.actualNotes === 3)).toBe(true);
		expect(inBar(2)).toEqual([
			{ numerator: 1, denominator: 2 },
			{ numerator: 1, denominator: 2 },
		]);
	});

	it('on homr\'s second page of Sunless 3, adds triplets to the five bars that are exactly half again too long, and to no other bar', () => {
		const first = page(`<measure number="1">${head}${n('whole', 8)}</measure>`);
		const real = readFileSync(new URL('./fixtures/sun3-2.musicxml', import.meta.url), 'utf8');
		const count = (bar: string) => (bar.match(/<time-modification>/g) ?? []).length;
		const raw = real.split('<measure ').slice(1);
		const joined = joinPages([first, real]).split('<measure ').slice(2);
		expect(joined).toHaveLength(12);
		// Bars 5, 6, 7, 10, and 11 of the page. Bars 8 and 9 hold the printed 3 read as a whole note, and bar 12 does not add up to half again.
		expect(joined.map((bar, i) => count(bar) - count(raw[i]))).toEqual([0, 0, 0, 0, 4, 5, 4, 0, 0, 4, 7, 0]);
	});
});
