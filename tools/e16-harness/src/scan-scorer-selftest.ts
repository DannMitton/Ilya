/**
 * scan-scorer-selftest: proves `scan-scorer.ts` the way `self-test.ts` proves
 * the present scorer. A perfect echo scores 100; a dropped note, an extra
 * note, a wrong pitch, a wrong length, and a moved barline each score as
 * exactly that and nothing more; an octave-shifted echo is scored right under
 * its shift; an abstained pitch is counted apart.
 *
 * Synthetic and self-contained: no corpus, no truth file, no reader.
 * Run: `node tools/e16-harness/src/scan-scorer-selftest.ts`
 */
import { scoreScan } from './scan-scorer.ts';
import type { ReaderInput, ScanEvent, TruthEvent, TruthInput } from './scan-scorer.ts';

const q = { numerator: 1, denominator: 4 };
const e = { numerator: 1, denominator: 8 };
const h = { numerator: 1, denominator: 2 };
const dq = { numerator: 3, denominator: 8 };

// five bars of 3/4 or 4/4; notes and rests; pitches vary so a wrong pitch cannot hide
const SPEC: { bar: number; type: 'note' | 'rest'; midi?: number; d: typeof q }[] = [
	{ bar: 0, type: 'rest', d: q }, { bar: 0, type: 'note', midi: 57, d: q }, { bar: 0, type: 'note', midi: 59, d: h },
	{ bar: 1, type: 'note', midi: 60, d: dq }, { bar: 1, type: 'note', midi: 62, d: e }, { bar: 1, type: 'note', midi: 64, d: h },
	{ bar: 2, type: 'note', midi: 65, d: q }, { bar: 2, type: 'rest', d: q }, { bar: 2, type: 'note', midi: 67, d: h },
	{ bar: 3, type: 'note', midi: 69, d: h }, { bar: 3, type: 'note', midi: 71, d: q }, { bar: 3, type: 'note', midi: 72, d: q },
	{ bar: 4, type: 'note', midi: 74, d: { numerator: 1, denominator: 1 } }
];
const BARS = [0, 1, 2, 3, 4];

function truth(): TruthInput {
	const events: TruthEvent[] = SPEC.map((s) => ({ type: s.type, measureIndex: s.bar, midi: s.midi, duration: s.d }));
	return { events, bars: BARS.map((i) => ({ index: i, expectedDuration: { numerator: 1, denominator: 1 } })) };
}

function echo(): ReaderInput {
	const events: ScanEvent[] = SPEC.map((s) => ({ type: s.type, measureIndex: s.bar, midi: s.type === 'note' ? s.midi : undefined, duration: s.d }));
	return { events, bars: BARS.map((i) => ({ measureIndex: i, metre: { beats: 4, beatType: 4 }, measureDuration: { numerator: 1, denominator: 1 } })) };
}

function assert(c: boolean, msg: string): void {
	if (!c) throw new Error(`SCAN SELF-TEST FAILED: ${msg}`);
}
function eq(actual: unknown, expected: unknown, label: string): void {
	assert(JSON.stringify(actual) === JSON.stringify(expected), `${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

const T = truth();
const NOTES = T.events.filter((x) => x.type === 'note').length; // 10
const RESTS = T.events.length - NOTES; // 3

// 1. a perfect echo scores 100
{
	const s = scoreScan(T, echo());
	eq(s.headline, 100, 'perfect headline');
	eq(s.shift, 0, 'perfect shift');
	eq([s.notes.matched, s.notes.missing, s.notes.extra, s.notes.pitchRight, s.notes.lengthRight, s.notes.bothRight], [NOTES, 0, 0, NOTES, NOTES, NOTES], 'perfect note counts');
	eq([s.rests.truth, s.rests.read, s.rests.matched, s.rests.lengthRight], [RESTS, RESTS, RESTS, RESTS], 'perfect rests');
	eq(s.bars, { truth: 5, read: 5, allRight: 5 }, 'perfect bars');
	eq(s.differences.length, 0, 'perfect differences');
	console.log('PASS: a perfect echo scores 100, every bar right, no difference.');
}

// 2. a dropped note
{
	const r = echo();
	r.events.splice(4, 1); // bar 1, midi 62
	const s = scoreScan(T, r);
	eq([s.notes.matched, s.notes.missing, s.notes.extra, s.notes.pitchRight, s.notes.lengthRight, s.notes.bothRight], [NOTES - 1, 1, 0, NOTES - 1, NOTES - 1, NOTES - 1], 'dropped note counts');
	eq(s.headline, (100 * (NOTES - 1)) / NOTES, 'dropped note headline');
	eq(s.bars.allRight, 4, 'dropped note spoils exactly its bar');
	eq(s.differences.map((d) => d.kind), ['missing'], 'dropped note is one missing');
	eq(s.rests, { truth: RESTS, read: RESTS, matched: RESTS, lengthRight: RESTS }, 'dropped note leaves the rests alone');
	console.log('PASS: a dropped note scores as one missing note and spoils one bar.');
}

// 3. an extra note
{
	const r = echo();
	r.events.splice(7, 0, { type: 'note', measureIndex: 2, midi: 68, duration: e });
	const s = scoreScan(T, r);
	eq([s.notes.matched, s.notes.missing, s.notes.extra, s.notes.bothRight], [NOTES, 0, 1, NOTES], 'extra note counts');
	eq(s.headline, 100, 'an extra note does not lower the notes present');
	eq(s.bars.allRight, 4, 'extra note spoils exactly its bar');
	eq(s.differences.map((d) => d.kind), ['extra'], 'extra note is one extra');
	console.log('PASS: an extra note scores as one extra note and spoils one bar.');
}

// 4. a wrong pitch
{
	const r = echo();
	r.events[4].midi = 63;
	const s = scoreScan(T, r);
	eq([s.notes.matched, s.notes.missing, s.notes.extra, s.notes.pitchRight, s.notes.pitchWrong, s.notes.lengthRight, s.notes.bothRight], [NOTES, 0, 0, NOTES - 1, 1, NOTES, NOTES - 1], 'wrong pitch counts');
	eq(s.bars.allRight, 4, 'wrong pitch spoils exactly its bar');
	eq(s.differences.map((d) => d.kind), ['pitch wrong'], 'wrong pitch is one pitch');
	console.log('PASS: a wrong pitch scores as one wrong pitch and nothing else.');
}

// 5. a wrong length
{
	const r = echo();
	r.events[4].duration = q;
	const s = scoreScan(T, r);
	eq([s.notes.matched, s.notes.pitchRight, s.notes.lengthRight, s.notes.lengthWrong, s.notes.bothRight], [NOTES, NOTES, NOTES - 1, 1, NOTES - 1], 'wrong length counts');
	eq(s.differences.map((d) => d.kind), ['length wrong'], 'wrong length is one length');
	eq(s.bars.allRight, 4, 'wrong length spoils exactly its bar');
	console.log('PASS: a wrong length scores as one wrong length and nothing else.');
}

// 6. a moved barline: the last note of bar 1 is read in bar 2
{
	const r = echo();
	r.events[5].measureIndex = 2;
	const s = scoreScan(T, r);
	eq([s.notes.matched, s.notes.missing, s.notes.extra, s.notes.pitchRight, s.notes.lengthRight, s.notes.bothRight], [NOTES, 0, 0, NOTES, NOTES, NOTES], 'moved barline leaves every note right');
	eq(s.headline, 100, 'moved barline headline');
	eq(s.bars.allRight, 3, 'moved barline spoils exactly the two bars it touches');
	eq(s.differences.length, 0, 'moved barline is no note difference');
	console.log('PASS: a moved barline leaves every note right and spoils exactly two bars.');
}

// 7. a wrong rest length
{
	const r = echo();
	r.events[0].duration = h;
	const s = scoreScan(T, r);
	eq([s.notes.bothRight, s.rests.matched, s.rests.lengthRight], [NOTES, RESTS, RESTS - 1], 'wrong rest length');
	eq(s.differences.map((d) => d.kind), ['rest length'], 'wrong rest length is one rest length');
	console.log('PASS: a wrong rest length scores as one wrong rest and no note.');
}

// 8. an octave shift for the whole song is chosen and reported, and scores 100
{
	for (const shift of [12, -12, 24, -24]) {
		const r = echo();
		for (const ev of r.events) if (typeof ev.midi === 'number') ev.midi += shift;
		const s = scoreScan(T, r);
		eq([s.shift, s.headline], [shift, 100], `an echo shifted by ${shift}`);
	}
	console.log('PASS: an echo an octave or two off scores 100 under the shift it reports.');
}

// 9. an abstained pitch is counted apart, and midiAssumedNatural is checked
{
	const r = echo();
	r.events[1].midiAssumedNatural = r.events[1].midi;
	r.events[1].midi = null;
	r.events[1].abstain = { pitch: 'accidental_unresolved' };
	r.events[2].midiAssumedNatural = 58;
	r.events[2].midi = null;
	r.events[2].abstain = { pitch: 'accidental_unresolved' };
	const s = scoreScan(T, r);
	eq([s.notes.pitchAbstained, s.notes.assumedNaturalRight, s.notes.pitchRight, s.notes.pitchWrong, s.notes.bothRight], [2, 1, NOTES - 2, 0, NOTES - 2], 'abstained pitches');
	eq(s.abstentions.pitch, 2, 'abstentions by kind');
	console.log('PASS: an abstained pitch is counted apart, and midiAssumedNatural is checked against the truth.');
}

// 10. the metre: every paired bar right in the echo; a bar stated in a metre of another length is counted wrong;
// a truth bar with no event is counted apart (row 37)
{
	eq(scoreScan(T, echo()).metre, { right: 5, paired: 5, unpaired: 0 }, 'perfect metre');
	const r = echo();
	r.bars[2].metre = { beats: 3, beatType: 4 };
	eq(scoreScan(T, r).metre, { right: 4, paired: 5, unpaired: 0 }, 'one bar in 3/4 where the truth bar is a whole');
	const r2 = echo();
	r2.bars[3].metre = { beats: 8, beatType: 8 };
	eq(scoreScan(T, r2).metre.right, 5, '8/8 is as long as 4/4: the truth records lengths, not figures');
	const T2 = truth();
	T2.events = T2.events.filter((ev) => ev.measureIndex !== 4);
	const r3 = echo();
	r3.events = r3.events.filter((ev) => ev.measureIndex !== 4);
	eq(scoreScan(T2, r3).metre, { right: 4, paired: 4, unpaired: 1 }, 'a bar with no event is counted apart');
	console.log('PASS: the metre in force is scored against the truth bar length, bar by bar.');
}

console.log('\nscan-scorer self-test: all checks passed.');
