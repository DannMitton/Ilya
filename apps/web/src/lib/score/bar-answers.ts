/**
 * WHAT THE SINGER ANSWERED ABOUT A BAR IS KEPT WITH THE SONG. Corrections
 * slice 3, QUEUE row 51, brief r2 of 2026-11-05.
 *
 * Slice 1 (`barsToConfirm`) names the bars whose length differs from the metre
 * in force, and slice 2 (`offersForABar`) offers fixes. Whatever the singer
 * answers must still be answered tomorrow. This file is the shape of that
 * record and the two reads over it. It is PURE: it stores nothing, draws
 * nothing, carries no string, and changes no computation. Slice 6 reads and
 * writes these answers.
 *
 * THE KEY IS THE BAR, THE CHECK IS A FINGERPRINT. An answer is stored under
 * `String(measureIndex)`, as `CorrectionMap` is keyed by string
 * (`correction.ts`), one entry per bar, the last answer replacing. The index
 * alone cannot say whether the bar still holds what the singer answered about:
 * a correction changes a bar's events without changing its index, and a
 * replaced score can put other bars under the same index. So each answer
 * carries a fingerprint of the bar's events at the moment of the answer, and an
 * answer is honoured only while the bar's fingerprint is still that one.
 *
 * WHAT THE FINGERPRINT READS (amendment 4 of the brief). The CORRECTED line's
 * events in the bar (`applyCorrections`), in order: type (note or rest), base,
 * dots, the tuplet ratio if any, and the metre in force (`Measure.timeSignature`).
 * It EXCLUDES event ids (re-keyed on load by `migrateCorrectionIds`), onsets
 * (moved by `reflowOnsets`), and pitch. Pitch is left out as a DESK DEFAULT: a
 * pitch nudge does not change the arithmetic the answer was about. Dann may
 * overrule. A tie is left out too: it does not change a bar's sum.
 *
 * STALE ANSWERS ARE KEPT, NOT PRUNED (amendment 6). An answer whose bar has
 * changed stays in the record and is simply not honoured, so a replaced score
 * that changes back finds its answers again, and slice 6 may count them.
 */

import type { ParsedScore, VocalLineEvent } from '@ilya/score-parser';
import type { BarToConfirm } from './bars-to-confirm';

/** What the singer said: "Matches my score", or she applied an offer or edited the bar. */
export type BarAnswerKind = 'matches-print' | 'changed';

export const BAR_ANSWER_KINDS: readonly BarAnswerKind[] = ['matches-print', 'changed'];

export interface BarAnswer {
	kind: BarAnswerKind;
	/** `fingerprintOfBar` at the moment of the answer. Never empty. */
	fingerprint: string;
}

/**
 * The field as the song record and the page hold it.
 *
 * `putAway` is the song-level "Not now" for the line. NOT WIRED (amendment 3):
 * the shape keeps it so a record does not need a second field later, but plan
 * r2 decides where Not now lives before slice 6R, and nothing writes it yet.
 */
export interface BarAnswers {
	bars: Record<string, BarAnswer>;
	putAway?: true;
}

export type AnswerScore = Pick<ParsedScore, 'measures' | 'vocalLine'>;

export interface AnsweredBar extends BarAnswer {
	measureIndex: number;
}

export const emptyBarAnswers = (): BarAnswers => ({ bars: {} });

/** True while there is nothing to store: no answers and not put away. */
export const barAnswersEmpty = (answers: BarAnswers): boolean => Object.keys(answers.bars).length === 0 && answers.putAway !== true;

const eventPart = (e: VocalLineEvent): string => {
	const t = e.duration.tuplet;
	return `${e.type === 'rest' ? 'r' : 'n'}${e.duration.base}.${e.duration.dots}${t ? `t${t.actualNotes}:${t.normalNotes}` : ''}`;
};

/**
 * A plain, ordered string of what the bar holds and the metre it is read
 * against, or null where the bar has no measure to read a metre from.
 *
 * WHAT IT CHECKS: the bar's events in `score.vocalLine` order, and the
 * metre of the measure with that index. WHY: an answer is about those notes in
 * that metre, and nothing else. WHAT FOLLOWS WHEN IT FAILS: null means no
 * metre, so no answer can be made and none is honoured; `stillToConfirm` then
 * keeps the bar in the list and the singer is asked again.
 *
 * Pass the CORRECTED line (the page's `correctedLine`), the same line
 * `barsToConfirm` is given, or the fingerprint describes notes the singer
 * never saw.
 */
export function fingerprintOfBar(score: AnswerScore, measureIndex: number): string | null {
	const measure = score.measures.find((m) => m.index === measureIndex);
	const sig = measure?.timeSignature;
	if (!sig || !(sig.beats > 0) || !(sig.beatType > 0)) return null;
	const events = score.vocalLine.filter((e) => e.measureIndex === measureIndex);
	return `${sig.beats}/${sig.beatType}|${events.map(eventPart).join(',')}`;
}

/**
 * The answers with one bar's answer set, last answer replacing. Pure: returns a
 * new object and leaves the input alone.
 *
 * WHAT IT CHECKS: that the bar has a fingerprint now. WHY: an answer without
 * one could never be honoured or refuted. WHAT FOLLOWS WHEN IT FAILS: the
 * input is returned unchanged and nothing is recorded, so the bar is asked
 * again rather than answered about notes nobody could describe.
 */
export function withBarAnswer(answers: BarAnswers, score: AnswerScore, measureIndex: number, kind: BarAnswerKind): BarAnswers {
	const fingerprint = fingerprintOfBar(score, measureIndex);
	if (fingerprint === null) return answers;
	// The bar's other spellings ("007" for 7) go with the old answer, so the last answer is the only one (step 7g).
	const bars = Object.fromEntries(Object.entries(answers.bars).filter(([key]) => !/^\d+$/.test(key) || Number(key) !== measureIndex));
	return { ...answers, bars: { ...bars, [String(measureIndex)]: { kind, fingerprint } } };
}

/**
 * Every answer in the field, by bar index, ascending. Takes the field and not
 * the record, since page state lives on `doc` (amendment 7).
 *
 * WHAT IT CHECKS: that each key is a whole number and each entry has a known
 * kind and a non-empty fingerprint. WHY: `validateRecord` drops such entries at
 * load, but a field built in memory has not been through it. WHAT FOLLOWS WHEN
 * IT FAILS: the entry is left out of the result, which costs one bar asked
 * again and nothing else. It never throws.
 */
export function answeredBars(answers: BarAnswers | undefined): AnsweredBar[] {
	if (!answers || !answers.bars) return [];
	/* ONE ANSWER PER BAR INDEX (integration step 7g): "007" and "7" name one bar, so the entry that comes later in the field's
	   own order replaces the earlier one, as a bar's last answer replaces its earlier answers. Without it a bar could be listed
	   twice, once for each spelling. */
	const byBar = new Map<number, AnsweredBar>();
	for (const [key, a] of Object.entries(answers.bars)) {
		if (!/^\d+$/.test(key)) continue;
		if (!a || !BAR_ANSWER_KINDS.includes(a.kind) || typeof a.fingerprint !== 'string' || a.fingerprint === '') continue;
		byBar.set(Number(key), { measureIndex: Number(key), kind: a.kind, fingerprint: a.fingerprint });
	}
	return [...byBar.values()].sort((a, b) => a.measureIndex - b.measureIndex);
}

/**
 * Slice 1's bars minus those answered whose fingerprint still matches.
 *
 * WHAT IT CHECKS: for each bar, the stored answer's fingerprint against the
 * bar's fingerprint now. WHY: the singer answered about particular notes in a
 * particular metre, so an answer about different notes is not hers to be held
 * to. WHAT FOLLOWS WHEN IT FAILS: when the bar's events have changed (she
 * undid an offer, edited a note, replaced the score), or the bar has no
 * fingerprint, the answer is NOT honoured and the bar stays in the list, asked
 * again. The stale answer is kept in the record (amendment 6).
 *
 * `score` is the corrected score `bars` was computed from. This ignores
 * `putAway`: see `barsToAsk`.
 */
export function stillToConfirm(bars: readonly BarToConfirm[], answers: BarAnswers | undefined, score: AnswerScore): BarToConfirm[] {
	const honoured = new Map(answeredBars(answers).map((a) => [a.measureIndex, a.fingerprint]));
	return bars.filter((bar) => {
		const stored = honoured.get(bar.measureIndex);
		if (stored === undefined) return true;
		return stored !== fingerprintOfBar(score, bar.measureIndex);
	});
}

/**
 * The bars the line should ask about: none where the singer put the line away
 * for this song, else `stillToConfirm`.
 *
 * WHAT IT CHECKS: `putAway` on the field. WHY: "Not now" hides the line, not the
 * singer's answers, so `answeredBars` and `stillToConfirm` still see every
 * answer. WHAT FOLLOWS WHEN IT FAILS: a field without `putAway` falls through
 * to `stillToConfirm`. NOT WIRED (amendment 3): nothing writes `putAway` yet.
 */
export function barsToAsk(bars: readonly BarToConfirm[], answers: BarAnswers | undefined, score: AnswerScore): BarToConfirm[] {
	if (answers?.putAway === true) return [];
	return stillToConfirm(bars, answers, score);
}
