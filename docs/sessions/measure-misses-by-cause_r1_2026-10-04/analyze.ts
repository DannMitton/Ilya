// usage: node analyze.ts <readsDir> <outJson>
// readsDir holds songN.read.json = { events, bars } for N in 1,4,5,6,7 (the scorer's read format).
// Step A (misses by cause) and Step B (ceilings by replacing one decision with the truth) for each song.
// The scorer is scan-scorer.ts, UNCHANGED, copied beside this file.
import fs from 'node:fs';
import { scoreScan } from './scan-scorer.ts';

const IN = '/tmp/claude-0/-home-claude/cde67b8f-675a-5d24-aafe-021536ff667e/scratchpad/part22/in/truth/';
const SONGS = [
	{ n: 1, label: 'Sunless 1', truth: 'mussorgsky_sunless-01_within-four-walls.truth.json', key: 2 },
	{ n: 4, label: 'Sunless 4', truth: 'mussorgsky_sunless-04_be-bored.truth.json', key: 2 },
	{ n: 5, label: 'Sunless 5', truth: 'mussorgsky_sunless-05_elegy.truth.json', key: 0 },
	{ n: 6, label: 'Sunless 6', truth: 'mussorgsky_sunless-06_on-the-river.truth.json', key: 7 },
	{ n: 7, label: 'Tchaikovsky', truth: 'tchaikovsky-op38-3.truth-draft.json', key: 2 }
];
const [readsDir, outJson] = process.argv.slice(2);

type Frac = { numerator: number; denominator: number };
const frac = (n: number, d: number): Frac => ({ numerator: n, denominator: d });
const same = (a: Frac | null | undefined, b: Frac | null | undefined) => !!a && !!b && a.numerator * b.denominator === b.numerator * a.denominator;
const val = (f: Frac) => f.numerator / f.denominator;

// ---- spelling by midi (the truth files carry midi only) ----
const NAT = [0, 2, 4, 5, 7, 9, 11]; // C D E F G A B
const WHITE_PC: Record<number, number> = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };
type Sp = { l: number; o: number; a: number };
function spell(m: number, flat: boolean): Sp {
	const pc = ((m % 12) + 12) % 12;
	const o = Math.floor(m / 12) - 1;
	if (pc in WHITE_PC) return { l: WHITE_PC[pc], o, a: 0 };
	if (!flat) return { l: WHITE_PC[pc - 1], o, a: 1 };
	return { l: WHITE_PC[pc + 1], o, a: -1 };
}
const natMidi = (l: number, o: number) => 12 * (o + 1) + NAT[l];
const SHARP_ORDER = [3, 0, 4, 1, 5, 2, 6]; // F C G D A E B
const keyDef = (fifths: number, l: number) => (SHARP_ORDER.slice(0, fifths).includes(l) ? 1 : 0);
const sameLO = (a: Sp, b: Sp) => a.l === b.l && a.o === b.o;
function LOset(m: number): Sp[] {
	const s = spell(m, false);
	const f = spell(m, true);
	return s.a === 0 ? [s] : [s, f];
}
const lenient = (m1: number, m2: number) => LOset(m1).some((a) => LOset(m2).some((b) => sameLO(a, b)));

type PitchCause = 'a' | 'b' | 'c';
function pitchCause(T: number, R: number, flat: boolean): PitchCause {
	const st = spell(T, flat);
	const sr = spell(R, flat);
	if (sameLO(st, sr)) return 'a';
	if (st.l === sr.l) return 'c';
	return 'b';
}

function lengthCause(t: Frac, r: Frac): 'dot' | 'flags' | 'other' {
	const q = val(r) / val(t);
	const near = (x: number, y: number) => Math.abs(x - y) < 1e-9;
	if (near(q, 1.5) || near(q, 2 / 3)) return 'dot';
	if (near(q, 2) || near(q, 0.5) || near(q, 4) || near(q, 0.25)) return 'flags';
	return 'other';
}

function inc(o: Record<string, number>, k: string, by = 1) {
	o[k] = (o[k] ?? 0) + by;
}

function loadTruth(file: string) {
	const tj = JSON.parse(fs.readFileSync(IN + file, 'utf8'));
	const events = [...tj.verses[0].notes]
		.sort((a: any, b: any) => a.onsetAbsolute - b.onsetAbsolute)
		.map((n: any) => ({ type: n.type, measureIndex: n.measureIndex, midi: n.midi, duration: n.duration }));
	return { events, bars: tj.measureDurations };
}

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

function headline(truth: any, events: any[], bars: any[]) {
	const s = scoreScan(truth, { events, bars });
	return s;
}

const results: any = {};
const totalsAcc: any = {};

for (const song of SONGS) {
	const rp = `${readsDir}/song${song.n}.read.json`;
	if (!fs.existsSync(rp)) continue;
	const truth = loadTruth(song.truth);
	const read = JSON.parse(fs.readFileSync(rp, 'utf8'));
	const rEvents: any[] = read.events;
	const rBars: any[] = read.bars;
	const s = scoreScan(truth as any, { events: rEvents, bars: rBars });
	const shift = s.shift;
	const matchOfT = new Map<number, number>();
	const matchedR = new Set<number>();
	for (const m of s.matches) {
		matchOfT.set(m.truthIndex, m.readerIndex);
		matchedR.add(m.readerIndex);
	}
	const R: any = {
		headline: s.headline,
		shift,
		counts: { truthNotes: s.notes.truth, readNotes: s.notes.read, matched: s.notes.matched, missing: s.notes.missing, extra: s.notes.extra },
		bars: { truth: s.bars.truth, read: s.bars.read, allRight: s.bars.allRight },
		rests: s.rests
	};

	// per-note classification
	const cls: Record<string, number> = { right: 0, notFound: 0, pitchOnly: 0, lengthOnly: 0, both: 0 };
	const pitchCauseAll: Record<string, number> = {}; // over every matched note with a pitch fault (classes 3 and 5)
	const pitchCauseC3: Record<string, number> = {}; // class 3 only
	const pitchCauseLenient: Record<string, number> = {};
	const pitchCauseFlat: Record<string, number> = {};
	const abstPitchReasonsAll: Record<string, number> = {};
	const abstPitchGeometry: Record<string, number> = {}; // for abstained notes: how the assumed natural compares
	const lenCauseAll: Record<string, number> = {};
	const lenCauseC4: Record<string, number> = {};
	const abstLenReasonsAll: Record<string, number> = {};
	const abstLenReasonsC4: Record<string, number> = {};
	let c4OnsetLost = 0; // class 4, own length read (not abstained) but onset lost: converter draws a quarter
	let c4OnsetLostAndQuarterWrong = 0;
	let rightButDrawnWrong = 0; // own length right, onset lost, truth length is not a quarter
	let rightButOnsetLost = 0;
	const notFoundByDur: Record<string, number> = {};
	let notFoundFirstInBar = 0;
	let notFoundAfterRest = 0;
	const extraInfo = { abstainedPitch: 0, abstainedLength: 0, byDur: {} as Record<string, number> };

	// bar-boundary co-occurrence for accidental misses
	const rBarOfT = (ti: number) => rEvents[matchOfT.get(ti)!].measureIndex;
	const truthBarEvents = new Map<number, number[]>();
	truth.events.forEach((e: any, i: number) => {
		if (e.type !== 'note') return;
		const l = truthBarEvents.get(e.measureIndex) ?? [];
		l.push(i);
		truthBarEvents.set(e.measureIndex, l);
	});
	const readerBarEvents = new Map<number, number[]>();
	rEvents.forEach((e: any, j: number) => {
		if (e.type !== 'note') return;
		const l = readerBarEvents.get(e.measureIndex) ?? [];
		l.push(j);
		readerBarEvents.set(e.measureIndex, l);
	});
	const barInconsistent = (ti: number): boolean => {
		const rj = matchOfT.get(ti)!;
		const tb = truth.events[ti].measureIndex;
		const rb = rEvents[rj].measureIndex;
		// the truth bar's matched events sit in more than one reader bar, or the reader bar holds matched events of more than one truth bar, or the counts differ
		const tbar = truthBarEvents.get(tb)!;
		const rbs = new Set(tbar.filter((i) => matchOfT.has(i)).map((i) => rBarOfT(i)));
		const rbar = readerBarEvents.get(rb)!;
		const tOfR = new Set<number>();
		for (const [ti2, rj2] of matchOfT) if (truth.events[ti2].type === 'note' && rEvents[rj2].measureIndex === rb) tOfR.add(truth.events[ti2].measureIndex);
		return rbs.size > 1 || tOfR.size > 1 || tbar.length !== rbar.length;
	};
	let accMissTotal = 0;
	let accMissBarInconsistent = 0;
	let accMissBarOk = 0;

	const truthNoteIdx: number[] = [];
	truth.events.forEach((e: any, i: number) => {
		if (e.type === 'note') truthNoteIdx.push(i);
	});
	const ctxPrevRest = (i: number) => i > 0 && truth.events[i - 1].type === 'rest';
	const ctxFirstInBar = (i: number) => i === 0 || truth.events[i - 1].measureIndex !== truth.events[i].measureIndex;

	for (const ti of truthNoteIdx) {
		const t = truth.events[ti];
		if (!matchOfT.has(ti)) {
			cls.notFound++;
			inc(notFoundByDur, `${t.duration.numerator}/${t.duration.denominator}`);
			if (ctxFirstInBar(ti)) notFoundFirstInBar++;
			if (ctxPrevRest(ti)) notFoundAfterRest++;
			continue;
		}
		const r = rEvents[matchOfT.get(ti)!];
		const abstP = typeof r.midi !== 'number';
		const pitchOk = !abstP && r.midi - shift === t.midi;
		const abstL = r.duration === null || r.duration === undefined;
		const lenOk = !abstL && same(r.duration, t.duration);
		const lostOnset = !!r.abstain?.onset || r.onset === null;
		// converter's drawn length: a quarter when the onset is lost or the length abstained
		if (!abstL && lostOnset) {
			if (lenOk) {
				rightButOnsetLost++;
				if (!same(t.duration, frac(1, 4))) rightButDrawnWrong++;
			}
		}
		const c = pitchOk && lenOk ? 'right' : !pitchOk && lenOk ? 'pitchOnly' : pitchOk && !lenOk ? 'lengthOnly' : 'both';
		cls[c]++;
		if (!pitchOk) {
			let cause: string;
			if (abstP) {
				cause = 'a-abstained';
				inc(abstPitchReasonsAll, r.abstain?.pitch ?? 'none');
				const A = typeof r.midiAssumedNatural === 'number' ? r.midiAssumedNatural - shift : null;
				if (A === null) inc(abstPitchGeometry, 'no assumed value');
				else {
					const st = spell(t.midi, false);
					const sa = spell(A, false);
					const stf = spell(t.midi, true);
					const saf = spell(A, true);
					if ((sameLO(st, sa) || sameLO(stf, saf)) && A === t.midi) inc(abstPitchGeometry, 'assumed natural equals the truth pitch (sign unneeded or wrongly abstained)');
					else if (sameLO(st, sa) || sameLO(stf, saf)) inc(abstPitchGeometry, 'letter and octave right, sign missing');
					else if (st.l === sa.l || stf.l === saf.l) inc(abstPitchGeometry, 'octave wrong');
					else inc(abstPitchGeometry, 'letter wrong');
				}
			} else {
				const pc = pitchCause(t.midi, r.midi - shift, false);
				cause = pc;
				inc(pitchCauseFlat, pitchCause(t.midi, r.midi - shift, true));
				inc(pitchCauseLenient, lenient(t.midi, r.midi - shift) ? 'a' : pitchCause(t.midi, r.midi - shift, false) === 'c' ? 'c' : 'b');
			}
			inc(pitchCauseAll, cause);
			if (c === 'pitchOnly') inc(pitchCauseC3, cause);
			if (cause === 'a' || cause === 'a-abstained') {
				accMissTotal++;
				if (barInconsistent(ti)) accMissBarInconsistent++;
				else accMissBarOk++;
			}
		}
		if (!lenOk) {
			let cause: string;
			if (abstL) {
				cause = 'a-abstained';
				inc(abstLenReasonsAll, r.abstain?.duration ?? 'none');
				if (c === 'lengthOnly') inc(abstLenReasonsC4, r.abstain?.duration ?? 'none');
			} else {
				cause = lengthCause(t.duration, r.duration);
				if (lostOnset) {
					if (c === 'lengthOnly') {
						c4OnsetLost++;
						if (!same(t.duration, frac(1, 4))) c4OnsetLostAndQuarterWrong++;
					}
				}
			}
			inc(lenCauseAll, cause);
			if (c === 'lengthOnly') inc(lenCauseC4, cause);
		}
	}
	R.classes = cls;
	R.pitchCauseClass3 = pitchCauseC3;
	R.pitchCauseAllFaults = pitchCauseAll;
	R.pitchCauseSensitivity = { sharpSpelling: pitchCauseAll, flatSpellingNonAbstained: pitchCauseFlat, lenientEitherSpellingNonAbstained: pitchCauseLenient };
	R.abstainedPitchReasons = abstPitchReasonsAll;
	R.abstainedPitchGeometry = abstPitchGeometry;
	R.lengthCauseClass4 = lenCauseC4;
	R.lengthCauseAllFaults = lenCauseAll;
	R.abstainedLengthReasonsClass4 = abstLenReasonsC4;
	R.abstainedLengthReasonsAll = abstLenReasonsAll;
	R.converterQuarter = { class4OwnLengthReadButOnsetLost: c4OnsetLost, ofThoseTruthNotAQuarter: c4OnsetLostAndQuarterWrong, rightInOwnLengthButOnsetLost: rightButOnsetLost, ofThoseTruthNotAQuarter2: rightButDrawnWrong };
	R.accidentalMissesBarBoundary = { total: accMissTotal, barsDisagree: accMissBarInconsistent, barsAgree: accMissBarOk };
	R.notFound = { byTruthDuration: notFoundByDur, firstNoteInTruthBar: notFoundFirstInBar, followsARest: notFoundAfterRest };

	// extras
	const extraByDur: Record<string, number> = {};
	let extraNotes = 0;
	let extraAbstP = 0;
	let extraAbstL = 0;
	let extraRestsRead = 0;
	rEvents.forEach((e: any, j: number) => {
		if (matchedR.has(j)) return;
		if (e.type === 'rest') {
			extraRestsRead++;
			return;
		}
		extraNotes++;
		if (typeof e.midi !== 'number') extraAbstP++;
		if (e.duration === null || e.duration === undefined) extraAbstL++;
		inc(extraByDur, e.duration ? `${e.duration.numerator}/${e.duration.denominator}` : 'abstained');
	});
	R.extras = { notes: extraNotes, withPitchAbstained: extraAbstP, withLengthAbstained: extraAbstL, byReadDuration: extraByDur, unmatchedReadRests: extraRestsRead };

	// ---- Step B: ceilings ----
	const ceil: Record<string, number | null> = {};
	const baseEvents = rEvents;
	const matchedPairs = s.matches.filter((m) => truth.events[m.truthIndex].type === 'note');
	function build(opts: { acc?: boolean; accLenient?: boolean; pos?: boolean; len?: boolean; ins?: boolean; del?: boolean }) {
		const ev: any[] = clone(baseEvents);
		// per matched note
		for (const m of matchedPairs) {
			const t = truth.events[m.truthIndex];
			const r = ev[m.readerIndex];
			const src = typeof r.midi === 'number' ? r.midi - shift : typeof r.midiAssumedNatural === 'number' ? r.midiAssumedNatural - shift : null;
			if (opts.len) r.duration = clone(t.duration);
			if (opts.acc && src !== null) {
				if (opts.accLenient && lenient(t.midi, src)) r.midi = t.midi + shift;
				else {
					const sr = spell(src, false);
					const st = spell(t.midi, false);
					r.midi = natMidi(sr.l, sr.o) + st.a + shift;
				}
			}
			if (opts.pos && typeof r.midi === 'number') {
				const sr = spell(r.midi - shift, false);
				const st = spell(t.midi, false);
				const offset = sr.a - keyDef(song.key, sr.l);
				r.midi = natMidi(st.l, st.o) + keyDef(song.key, st.l) + offset + shift;
			}
		}
		let out: any[] = ev;
		if (opts.del) out = out.filter((e, j) => !(e.type === 'note' && !matchedR.has(j)));
		if (opts.ins) {
			// insert each not-found truth note after the reader event matched to the nearest earlier matched truth event
			const inserts = new Map<number, any[]>(); // key: reader index after which to insert (-1 = start)
			let lastR = -1;
			truth.events.forEach((e: any, ti: number) => {
				if (matchOfT.has(ti)) {
					lastR = matchOfT.get(ti)!;
					return;
				}
				if (e.type !== 'note') return;
				const l = inserts.get(lastR) ?? [];
				l.push({ type: 'note', measureIndex: lastR >= 0 ? ev[lastR].measureIndex : 0, midi: e.midi + shift, duration: clone(e.duration) });
				inserts.set(lastR, l);
			});
			const merged: any[] = [];
			const place = (key: number) => {
				for (const x of inserts.get(key) ?? []) merged.push(x);
			};
			place(-1);
			ev.forEach((e, j) => {
				if (!(opts.del && e.type === 'note' && !matchedR.has(j))) merged.push(e);
				place(j);
			});
			out = merged;
		}
		return out;
	}
	const run = (name: string, opts: any) => {
		const ev = build(opts);
		const sc = scoreScan(truth as any, { events: ev, bars: rBars });
		ceil[name] = sc.headline;
	};
	run('B1', { acc: true });
	run('B1lenient', { acc: true, accLenient: true });
	run('B2', { pos: true });
	run('B3', { len: true });
	run('B4', { ins: true });
	run('B5', { del: true });
	run('B6', { acc: true, len: true });
	run('B7', { ins: true, del: true });
	run('B8spelled', { acc: true, accLenient: true, pos: true, len: true, ins: true, del: true });
	{
		// B1+B2: every matched note's pitch is the truth's, lengths as read
		const ev: any[] = clone(baseEvents);
		for (const m of matchedPairs) ev[m.readerIndex].midi = truth.events[m.truthIndex].midi + shift;
		ceil['B1+B2'] = scoreScan(truth as any, { events: ev, bars: rBars }).headline;
	}
	// a control that does not depend on the spelling convention: truth pitch and length put in outright
	{
		const ev: any[] = clone(baseEvents);
		for (const m of matchedPairs) {
			const t = truth.events[m.truthIndex];
			ev[m.readerIndex].midi = t.midi + shift;
			ev[m.readerIndex].duration = clone(t.duration);
		}
		ceil['B8'] = null;
		const base = ev;
		const saveBuild = build;
		void saveBuild;
		// insert and delete as in B7 on top of the fixed pairs
		const inserts = new Map<number, any[]>();
		let lastR = -1;
		truth.events.forEach((e: any, ti: number) => {
			if (matchOfT.has(ti)) {
				lastR = matchOfT.get(ti)!;
				return;
			}
			if (e.type !== 'note') return;
			const l = inserts.get(lastR) ?? [];
			l.push({ type: 'note', measureIndex: 0, midi: e.midi + shift, duration: clone(e.duration) });
			inserts.set(lastR, l);
		});
		const merged: any[] = [];
		for (const x of inserts.get(-1) ?? []) merged.push(x);
		base.forEach((e, j) => {
			if (!(e.type === 'note' && !matchedR.has(j))) merged.push(e);
			for (const x of inserts.get(j) ?? []) merged.push(x);
		});
		ceil['B8'] = scoreScan(truth as any, { events: merged, bars: rBars }).headline;
	}
	// the headline as the converter would draw it: a quarter wherever the length abstained or the onset is lost
	{
		const ev: any[] = clone(baseEvents);
		for (const e of ev) {
			if (e.type !== 'note') continue;
			const lost = !!e.abstain?.onset || e.onset === null;
			if (e.duration === null || e.duration === undefined || lost) e.duration = frac(1, 4);
		}
		ceil['asDrawnByConverter'] = scoreScan(truth as any, { events: ev, bars: rBars }).headline;
	}
	R.ceilings = ceil;

	results[song.n] = { label: song.label, ...R };
	// accumulate totals
	const acc = (path: string, v: number) => (totalsAcc[path] = (totalsAcc[path] ?? 0) + v);
	acc('truthNotes', s.notes.truth);
	for (const k of Object.keys(cls)) acc('class.' + k, cls[k]);
	for (const [k, v] of Object.entries(pitchCauseC3)) acc('pitchC3.' + k, v as number);
	for (const [k, v] of Object.entries(pitchCauseAll)) acc('pitchAll.' + k, v as number);
	for (const [k, v] of Object.entries(lenCauseC4)) acc('lenC4.' + k, v as number);
	for (const [k, v] of Object.entries(lenCauseAll)) acc('lenAll.' + k, v as number);
	for (const [k, v] of Object.entries(abstPitchReasonsAll)) acc('abstPitch.' + k, v as number);
	for (const [k, v] of Object.entries(abstLenReasonsAll)) acc('abstLen.' + k, v as number);
	for (const [k, v] of Object.entries(abstLenReasonsC4)) acc('abstLenC4.' + k, v as number);
	for (const [k, v] of Object.entries(abstPitchGeometry)) acc('abstGeom.' + k, v as number);
	for (const [k, v] of Object.entries(pitchCauseFlat)) acc('pitchFlat.' + k, v as number);
	for (const [k, v] of Object.entries(pitchCauseLenient)) acc('pitchLenient.' + k, v as number);
	acc('extras', extraNotes);
	acc('c4OnsetLost', c4OnsetLost);
	acc('c4OnsetLostQW', c4OnsetLostAndQuarterWrong);
	acc('rightOnsetLost', rightButOnsetLost);
	acc('rightOnsetLostWrong', rightButDrawnWrong);
	acc('accMiss', accMissTotal);
	acc('accMissBarDisagree', accMissBarInconsistent);
	acc('missing', s.notes.missing);
	acc('restsTruth', s.rests.truth);
	acc('restsMatched', s.rests.matched);
	acc('restsRight', s.rests.lengthRight);
	acc('restsRead', s.rests.read);
	acc('barsTruth', s.bars.truth);
	acc('barsRead', s.bars.read);
	for (const k of Object.keys(ceil)) if (typeof ceil[k] === 'number') acc('ceil.' + k, ((ceil[k] as number) / 100) * s.notes.truth);
	acc('headlineNotes', (s.headline! / 100) * s.notes.truth);
}
const TT = totalsAcc.truthNotes;
const totalHead: any = { baseline: (100 * totalsAcc.headlineNotes) / TT };
for (const k of Object.keys(totalsAcc)) if (k.startsWith('ceil.')) totalHead[k.slice(5)] = (100 * totalsAcc[k]) / TT;
results.total = { totals: totalsAcc, headlines: totalHead };
fs.writeFileSync(outJson, JSON.stringify(results, null, 1));
console.log(JSON.stringify({ headlines: Object.fromEntries(Object.entries(results).filter(([k]) => k !== 'total').map(([k, v]: any) => [k, v.headline])), total: totalHead }));
