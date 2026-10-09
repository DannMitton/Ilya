/**
 * scan-scorer: score a SCAN reader's events against a truth file, for the
 * baseline of plan r4, phase 0 (QUEUE row 22). It sits beside `scorer.ts`
 * and leaves it as it is.
 *
 * WHY A SECOND SCORER. `scorer.ts` matches a recognized note to a truth note
 * by nearest onset on the truth's own bar timeline, so it assumes the two
 * number their bars alike. On a scan both the bar numbers and the onsets can
 * be wrong, and a note that is missing or extra shifts everything after it.
 * Dann, 2026-10-01 23:06: "it is there to align with our need and not vice
 * versa."
 *
 * THE RULES AS BUILT
 *
 * ALIGNMENT. The reader's events and the truth's events are two sequences in
 * order (the reader's order of reading, the truth's order in its file). They
 * are aligned by dynamic programming that maximizes a total of match scores
 * and allows any event on either side to stay unmatched (a missing note, an
 * extra note), at no cost. Bar numbers and onsets are never consulted.
 *   - Only events of one type match: a note with a note, a rest with a rest.
 *   - A note/note match scores 1, plus 2 if the pitch is equal under the
 *     song's octave shift, plus 1 if the written length is the same fraction.
 *     A rest/rest match scores 1, plus 1 for the same length. So the
 *     alignment prefers a match that is right, and still pairs two notes in
 *     the same place in the sequence when neither agrees (a wrong pitch is a
 *     wrong pitch, not a missing note and an extra one).
 *   - Ties go to the diagonal (match) first.
 *
 * PITCH is right when the reader's MIDI number minus the song's octave shift
 * equals the truth's. The shift is one number for the whole song, chosen from
 * -24, -12, 0, 12, 24 as the one that gives the most equal pitches (then the
 * most matches); every shift's count is reported beside the choice. A note
 * whose pitch abstained (`midi` null) is counted apart: it is neither right
 * nor wrong, and the report says how many of them `midiAssumedNatural`
 * (the geometric value before the accidental engine abstained) would have
 * had right under the same shift.
 *
 * LENGTH is right when the written length is the same fraction. No
 * tolerance. A length that abstained (null) is counted apart.
 *
 * THE HEADLINE, in the plan's own terms: of every 100 printed notes (the
 * truth's notes), how many are present, with the right pitch and the right
 * length.
 *
 * BARS. A truth bar is "all right" when every one of its events is matched,
 * with the right pitch (a note) and the right length, and the reader put all
 * of them in one reader bar that holds no other event. So a missing note, an
 * extra note, a wrong pitch, a wrong length, and a moved barline each spoil
 * exactly the bars they touch. The reader's metre for each bar is reported
 * beside the truth's bar length for the truth bar its events correspond to.
 *
 * METRE (added QUEUE row 37, 2026-10-08). Each truth bar that holds an event is
 * paired with the reader bar that holds most of its matched events; the metre
 * is right there when the metre in force in that reader bar is as long as the
 * truth's bar (`expectedDuration`). The truth records bar lengths, not printed
 * figures, so 3/8 and 6/16 count as the same metre. A truth bar with no event
 * (a whole bar of rest) cannot be paired and is counted apart.
 *
 * NOT SCORED: syllables (the reader carries none), onsets.
 */

export interface Frac {
	numerator: number;
	denominator: number;
}

export interface ScanEvent {
	type: 'note' | 'rest';
	measureIndex: number;
	midi?: number | null;
	midiAssumedNatural?: number | null;
	duration: Frac | null;
	abstain?: { pitch?: string; duration?: string; onset?: string };
	id?: string;
}

export interface ScanBar {
	measureIndex: number;
	metre: { beats: number; beatType: number } | null;
	measureDuration: Frac | null;
	abstain?: { metre?: string; sum?: string };
}

export interface TruthEvent {
	type: 'note' | 'rest';
	measureIndex: number;
	midi?: number;
	duration: Frac;
}

export interface TruthInput {
	events: TruthEvent[];
	bars: { index: number; expectedDuration: Frac }[];
}

export interface ReaderInput {
	events: ScanEvent[];
	bars: ScanBar[];
}

export const SHIFTS = [-24, -12, 0, 12, 24];

function sameFrac(a: Frac | null | undefined, b: Frac | null | undefined): boolean {
	if (!a || !b) return false;
	return a.numerator * b.denominator === b.numerator * a.denominator;
}

export type Step = { kind: 'match'; t: number; r: number } | { kind: 'missing'; t: number } | { kind: 'extra'; r: number };

/** The alignment for one octave shift: the steps in sequence order and the total score. */
export function align(truth: TruthEvent[], reader: ScanEvent[], shift: number): { steps: Step[]; score: number } {
	const m = truth.length;
	const n = reader.length;
	const w = (i: number, j: number): number => {
		const t = truth[i];
		const r = reader[j];
		if (t.type !== r.type) return -1;
		if (t.type === 'rest') return 1 + (sameFrac(t.duration, r.duration) ? 1 : 0);
		const pitchEq = typeof r.midi === 'number' && t.midi !== undefined && r.midi - shift === t.midi;
		return 1 + (pitchEq ? 2 : 0) + (sameFrac(t.duration, r.duration) ? 1 : 0);
	};
	const dp: number[][] = [];
	for (let i = 0; i <= m; i++) dp.push(new Array(n + 1).fill(0));
	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			let best = Math.max(dp[i - 1][j], dp[i][j - 1]);
			const s = w(i - 1, j - 1);
			if (s > 0 && dp[i - 1][j - 1] + s > best) best = dp[i - 1][j - 1] + s;
			dp[i][j] = best;
		}
	}
	const steps: Step[] = [];
	let i = m;
	let j = n;
	while (i > 0 || j > 0) {
		if (i > 0 && j > 0) {
			const s = w(i - 1, j - 1);
			if (s > 0 && dp[i][j] === dp[i - 1][j - 1] + s) {
				steps.push({ kind: 'match', t: i - 1, r: j - 1 });
				i--;
				j--;
				continue;
			}
		}
		if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j])) {
			steps.push({ kind: 'missing', t: i - 1 });
			i--;
		} else {
			steps.push({ kind: 'extra', r: j - 1 });
			j--;
		}
	}
	steps.reverse();
	return { steps, score: dp[m][n] };
}

export interface Difference {
	/** 'missing', 'extra', 'rest length', or the parts of a matched note that are not right, joined with ' + ': pitch wrong, pitch abstained, length wrong, length abstained. */
	kind: string;
	truthIndex: number | null;
	readerIndex: number | null;
	truthBar: number | null;
	readerBar: number | null;
}

export interface BarMetre {
	readerBar: number;
	metre: string | null;
	readerDuration: string | null;
	truthBar: number | null;
	truthDuration: string | null;
	sameLength: boolean | null;
}

export interface ScanScore {
	shift: number;
	shiftCounts: { shift: number; pitchRight: number; matched: number }[];
	bars: { truth: number; read: number; allRight: number };
	notes: {
		truth: number;
		read: number;
		matched: number;
		missing: number;
		extra: number;
		pitchRight: number;
		pitchWrong: number;
		pitchAbstained: number;
		assumedNaturalRight: number;
		lengthRight: number;
		lengthWrong: number;
		lengthAbstained: number;
		bothRight: number;
	};
	rests: { truth: number; read: number; matched: number; lengthRight: number };
	abstentions: { pitch: number; duration: number; onset: number; metre: number; sum: number };
	headline: number | null; // of every 100 printed notes, present with the right pitch and the right length
	barMetres: BarMetre[];
	/** Truth bars whose paired reader bar has a metre in force as long as the truth's bar, of the truth bars that could be paired. */
	metre: { right: number; paired: number; unpaired: number };
	differences: Difference[];
	/** Every aligned pair, in sequence order: indices into the truth's events and the reader's events. Added row 23. */
	matches: { truthIndex: number; readerIndex: number }[];
}

function fracText(f: Frac | null | undefined): string | null {
	return f ? `${f.numerator}/${f.denominator}` : null;
}

export function scoreScan(truth: TruthInput, reader: ReaderInput): ScanScore {
	// choose the octave shift: the most equal pitches, then the most matches
	let best: { shift: number; pitchRight: number; matched: number; steps: Step[] } | null = null;
	const shiftCounts: ScanScore['shiftCounts'] = [];
	for (const shift of SHIFTS) {
		const { steps } = align(truth.events, reader.events, shift);
		let pitchRight = 0;
		let matched = 0;
		for (const s of steps) {
			if (s.kind !== 'match') continue;
			const t = truth.events[s.t];
			const r = reader.events[s.r];
			if (t.type !== 'note') continue;
			matched++;
			if (typeof r.midi === 'number' && t.midi !== undefined && r.midi - shift === t.midi) pitchRight++;
		}
		shiftCounts.push({ shift, pitchRight, matched });
		if (!best || pitchRight > best.pitchRight || (pitchRight === best.pitchRight && matched > best.matched)) {
			best = { shift, pitchRight, matched, steps };
		}
	}
	const shift = best!.shift;
	const steps = best!.steps;

	const tNotes = truth.events.filter((e) => e.type === 'note').length;
	const tRests = truth.events.length - tNotes;
	const rNotes = reader.events.filter((e) => e.type === 'note').length;
	const rRests = reader.events.length - rNotes;

	const n = {
		matched: 0, pitchRight: 0, pitchWrong: 0, pitchAbstained: 0, assumedNaturalRight: 0,
		lengthRight: 0, lengthWrong: 0, lengthAbstained: 0, bothRight: 0
	};
	let restMatched = 0;
	let restLengthRight = 0;
	const differences: Difference[] = [];
	const truthEventOk: boolean[] = new Array(truth.events.length).fill(false);
	const matchOfTruth: (number | null)[] = new Array(truth.events.length).fill(null);
	const matchedReader = new Set<number>();

	for (const s of steps) {
		if (s.kind === 'missing') {
			differences.push({ kind: 'missing', truthIndex: s.t, readerIndex: null, truthBar: truth.events[s.t].measureIndex, readerBar: null });
			continue;
		}
		if (s.kind === 'extra') {
			differences.push({ kind: 'extra', truthIndex: null, readerIndex: s.r, truthBar: null, readerBar: reader.events[s.r].measureIndex });
			continue;
		}
		const t = truth.events[s.t];
		const r = reader.events[s.r];
		matchOfTruth[s.t] = s.r;
		matchedReader.add(s.r);
		const lenOk = sameFrac(t.duration, r.duration);
		if (t.type === 'rest') {
			restMatched++;
			if (lenOk) {
				restLengthRight++;
				truthEventOk[s.t] = true;
			} else {
				differences.push({ kind: 'rest length', truthIndex: s.t, readerIndex: s.r, truthBar: t.measureIndex, readerBar: r.measureIndex });
			}
			continue;
		}
		n.matched++;
		let pitchOk = false;
		const abstP = typeof r.midi !== 'number';
		if (abstP) {
			n.pitchAbstained++;
			if (typeof r.midiAssumedNatural === 'number' && t.midi !== undefined && r.midiAssumedNatural - shift === t.midi) n.assumedNaturalRight++;
		} else if (t.midi !== undefined && (r.midi as number) - shift === t.midi) {
			pitchOk = true;
			n.pitchRight++;
		} else n.pitchWrong++;
		const abstL = r.duration === null || r.duration === undefined;
		if (abstL) n.lengthAbstained++;
		else if (lenOk) n.lengthRight++;
		else n.lengthWrong++;
		if (pitchOk && lenOk) {
			n.bothRight++;
			truthEventOk[s.t] = true;
		} else {
			const parts: string[] = [];
			if (abstP) parts.push('pitch abstained');
			else if (!pitchOk) parts.push('pitch wrong');
			if (abstL) parts.push('length abstained');
			else if (!lenOk) parts.push('length wrong');
			const kind = parts.join(' + ');
			differences.push({ kind, truthIndex: s.t, readerIndex: s.r, truthBar: t.measureIndex, readerBar: r.measureIndex });
		}
	}

	// bars: a truth bar is all right when each of its events is right and they all sit alone in one reader bar
	const readerBarCount = new Map<number, number>();
	for (const e of reader.events) readerBarCount.set(e.measureIndex, (readerBarCount.get(e.measureIndex) ?? 0) + 1);
	const truthByBar = new Map<number, number[]>();
	truth.events.forEach((e, i) => {
		const l = truthByBar.get(e.measureIndex) ?? [];
		l.push(i);
		truthByBar.set(e.measureIndex, l);
	});
	let allRight = 0;
	const voteReaderBar = new Map<number, Map<number, number>>(); // reader bar -> truth bar -> votes
	for (const [b, idxs] of truthByBar) {
		for (const i of idxs) {
			const mr = matchOfTruth[i];
			if (mr === null) continue;
			const rb = reader.events[mr].measureIndex;
			const v = voteReaderBar.get(rb) ?? new Map<number, number>();
			v.set(b, (v.get(b) ?? 0) + 1);
			voteReaderBar.set(rb, v);
		}
		if (!idxs.every((i) => truthEventOk[i])) continue;
		const rbs = new Set(idxs.map((i) => reader.events[matchOfTruth[i] as number].measureIndex));
		if (rbs.size !== 1) continue;
		const rb = [...rbs][0];
		if ((readerBarCount.get(rb) ?? 0) !== idxs.length) continue;
		allRight++;
	}

	const truthBarDuration = new Map(truth.bars.map((b) => [b.index, b.expectedDuration]));
	const barMetres: BarMetre[] = reader.bars.map((rb) => {
		const votes = voteReaderBar.get(rb.measureIndex);
		let tb: number | null = null;
		if (votes) {
			let bv = -1;
			for (const [k, v] of votes) if (v > bv) { bv = v; tb = k; }
		}
		const td = tb === null ? null : truthBarDuration.get(tb) ?? null;
		return {
			readerBar: rb.measureIndex,
			metre: rb.metre ? `${rb.metre.beats}/${rb.metre.beatType}` : null,
			readerDuration: fracText(rb.measureDuration),
			truthBar: tb,
			truthDuration: fracText(td),
			sameLength: td && rb.measureDuration ? sameFrac(td, rb.measureDuration) : null
		};
	});

	const metreOf = new Map(reader.bars.map((b) => [b.measureIndex, b.metre]));
	const metre = { right: 0, paired: 0, unpaired: 0 };
	for (const tb of truth.bars) {
		const idxs = truthByBar.get(tb.index) ?? [];
		const votes = new Map<number, number>();
		for (const i of idxs) {
			const mr = matchOfTruth[i];
			if (mr === null) continue;
			const rb = reader.events[mr].measureIndex;
			votes.set(rb, (votes.get(rb) ?? 0) + 1);
		}
		if (votes.size === 0) {
			metre.unpaired++;
			continue;
		}
		let best = -1;
		let rb = -1;
		for (const [k, v] of votes) if (v > best) { best = v; rb = k; }
		metre.paired++;
		const m = metreOf.get(rb);
		if (m && tb.expectedDuration && sameFrac({ numerator: m.beats, denominator: m.beatType }, tb.expectedDuration)) metre.right++;
	}

	const ab = { pitch: 0, duration: 0, onset: 0, metre: 0, sum: 0 };
	for (const e of reader.events) {
		if (e.abstain?.pitch) ab.pitch++;
		if (e.abstain?.duration) ab.duration++;
		if (e.abstain?.onset) ab.onset++;
	}
	for (const b of reader.bars) {
		if (b.abstain?.metre) ab.metre++;
		if (b.abstain?.sum) ab.sum++;
	}

	return {
		shift,
		shiftCounts,
		bars: { truth: truth.bars.length, read: reader.bars.length, allRight },
		notes: {
			truth: tNotes,
			read: rNotes,
			matched: n.matched,
			missing: tNotes - n.matched,
			extra: rNotes - (reader.events.filter((e, j) => e.type === 'note' && matchedReader.has(j)).length),
			pitchRight: n.pitchRight,
			pitchWrong: n.pitchWrong,
			pitchAbstained: n.pitchAbstained,
			assumedNaturalRight: n.assumedNaturalRight,
			lengthRight: n.lengthRight,
			lengthWrong: n.lengthWrong,
			lengthAbstained: n.lengthAbstained,
			bothRight: n.bothRight
		},
		rests: { truth: tRests, read: rRests, matched: restMatched, lengthRight: restLengthRight },
		abstentions: ab,
		headline: tNotes === 0 ? null : (100 * n.bothRight) / tNotes,
		barMetres,
		metre,
		differences,
		matches: steps.flatMap((st) => (st.kind === 'match' ? [{ truthIndex: st.t, readerIndex: st.r }] : []))
	};
}
