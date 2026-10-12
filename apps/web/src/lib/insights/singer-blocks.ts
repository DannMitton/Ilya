/**
 * THE INSIGHTS PAGE AS BLOCKS (QUEUE row 66, Design round 2). Every sentence the
 * page prints is decided here, in order, as a list of blocks; the pane measures
 * the blocks and breaks them into pages (`paginate.ts`), and `SingerBlock.svelte`
 * draws one. Pure, so the rules a reader would argue with (which verdict, which
 * reasons, where the teacher line sits) have tests.
 *
 * The order is the ratified structure (`PRODUCT.md`, "How an Insights page is
 * organized", 2026-10-11 03:53): the opening frame; the conclusion, unboxed;
 * squircle 1, the moments; squircle 2, the totals; squircle 3, the sources.
 */
import { pitchToMidi, type KeyChoice, type ParsedScore, type Pitch, type VoiceProfileSnapshot } from '@ilya/score-parser';
import { t, type Language } from '$lib/i18n';
import { pitchName } from '$lib/voice/note-picker';
import { placeholderCommentSentence, placeholderTurnsSentence } from '$lib/analysis/placeholder-line';
import type { Run } from './comment-sources';
import type { RenderedComment } from './comment-text';
import type { KeyWords } from './key-lines';
import type { InsightsModel, TessituragramModel, VerdictLine } from './insights';
import { formatCycles, doseValue, type CycleDose, type CycleDoseSplit } from './singing-measures';
import {
	articleFor,
	countWord,
	isUnlikely,
	percent,
	shareAboveSecondo,
	shareAtOrAbovePrimo,
	suggestsApproach,
	type NamedNote,
	type VowelTurns,
} from './singer-page';

/** Where a block sits: unboxed, or in one of the three squircles. */
export type Group = 'free' | 'moments' | 'totals' | 'sources';

export interface Reason {
	label: string;
	lines: string[];
}

export type Block =
	| { kind: 'frame'; text: string }
	| { kind: 'silence'; heading?: string; lines: string[]; withheld?: string[] }
	| {
			kind: 'conclusion';
			heading: string;
			/** The verdict paragraph, or null when the range offer stands in its place. */
			paragraph: string | null;
			offer: boolean;
			/** The way forward (N.182, QUEUE row 71): up to three key lines, a one-line answer, and the reveal. */
			keys: KeyWords | null;
			reasons: Reason[];
	  }
	| { kind: 'comment'; heading?: string; tag: string; comment: RenderedComment; teacher?: string; placeholder?: string }
	| { kind: 'more'; label: string; comments: Array<{ tag: string; comment: RenderedComment; teacher?: string; placeholder?: string }> }
	| { kind: 'note'; heading?: string; text: string }
	| { kind: 'cycles'; heading?: string; sentence: string; bar: { under: number; within: number; above: number } | null; legend: string[] }
	| { kind: 'pitches'; heading?: string; caption: string; figure: TessituragramModel; typedTessitura: { low: Pitch; high: Pitch } | null }
	| { kind: 'vowels'; heading?: string; caption: string; sub: string; turns: VowelTurns; ring: string | null; rows: Array<{ vowel: string; before: number; past: number; text: string; turn: string; placeholder?: true }>; placeholder?: string }
	| { kind: 'prose'; heading?: string; text: string; small?: boolean }
	| { kind: 'endnote'; heading?: string; teacher?: string; tag: string; suggestions: Run[][]; references: Run[][] };

export interface PlacedBlock {
	group: Group;
	block: Block;
	/** Drawn on screen only; never printed (the range offer's decline, the comments behind "more"). */
	screenOnly?: boolean;
}

export interface BlockInputs {
	language: Language;
	model: InsightsModel;
	profile: VoiceProfileSnapshot;
	verdict: VerdictLine | null;
	/** "Nothing in this piece is flagged" joins the verdict. */
	noneFlagged: boolean;
	held: (NamedNote & { seconds: number }) | null;
	outside: (NamedNote & { direction: 'above' | 'below' }) | null;
	/** N.182's keys, worded (`key-lines.ts`); null without a typed range. */
	keys: KeyWords | null;
	comments: RenderedComment[];
	more: RenderedComment[];
	hiddenBySettings: number;
	tagOf: (r: RenderedComment) => string;
	/** The printed bar a comment sits in. */
	barOf: (r: RenderedComment) => string;
	phonationHeadline: string | null;
	untrustedLine: string | null;
	split: CycleDoseSplit | null;
	cycles: CycleDose | null;
	turns: VowelTurns | null;
	/** The vowels the page uses whose fR1 is a placeholder (QUEUE row 69). */
	placeholders?: readonly string[];
}

const fill = (s: string, vars: Record<string, string | number>) =>
	Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, String(v)), s);

/** "11, 18, and 64"; « 11, 18 et 64 ». */
export function joinList(items: readonly string[], language: Language): string {
	if (items.length <= 1) return items.join('');
	if (items.length === 2) return items.join(language === 'fr' ? ' et ' : ' and ');
	return `${items.slice(0, -1).join(', ')}${language === 'fr' ? ' et ' : ', and '}${items[items.length - 1]}`;
}

function doseText(d: CycleDose, language: Language): string {
	return d.kind === 'point' || Math.round(d.low) === Math.round(d.high)
		? formatCycles(d.kind === 'point' ? d.cycles : d.low, language)
		: fill(t('insights.fit.span', language), { low: formatCycles(d.low, language), high: formatCycles(d.high, language) });
}

function secondsText(s: { kind: 'point'; seconds: number } | { kind: 'range'; low: number; high: number } | null, language: Language, fine: (n: number) => string): string {
	if (!s) return '';
	return s.kind === 'point' ? fine(s.seconds) : fill(t('insights.fit.span', language), { low: fine(s.low), high: fine(s.high) });
}

/** The blocks, in reading order, each with its squircle. */
export function singerBlocks(i: BlockInputs, formatFine: (seconds: number) => string): PlacedBlock[] {
	const { language, model, profile } = i;
	const placeholders = new Set(i.placeholders ?? []);
	const T = (key: string) => t(key, language);
	const N = (p: Pitch) => pitchName(p, language);
	const out: PlacedBlock[] = [];

	out.push({ group: 'free', block: { kind: 'frame', text: T('insights.r2.frame') } });

	// ── The conclusion ────────────────────────────────────────────────
	const share = shareAtOrAbovePrimo(model);
	const above = shareAboveSecondo(model);
	const primo = profile.passaggio?.primo;
	const secondo = profile.passaggio?.secondo;
	const unlikely = isUnlikely(model);

	let paragraph: string | null = null;

	if (unlikely) {
		const shareOk = share !== null && share > 0 && !!primo;
		const heldOk = !!i.held && !!secondo;
		const parts: string[] = [];
		const heldVars = i.held
			? { bar: i.held.measure, a: articleFor(i.held.pitch), pitch: N(i.held.pitch), vowel: `[${i.held.vowel}]`, s: Math.round(i.held.seconds), secondo: secondo ? N(secondo) : '' }
			: null;
		if (shareOk && heldOk) parts.push(fill(T('insights.r2.unlikely.shareHeld'), { n: percent(share!), primo: N(primo!), ...heldVars! }));
		else if (heldOk) parts.push(fill(T('insights.r2.unlikely.held'), heldVars!));
		else if (shareOk) parts.push(fill(T('insights.r2.unlikely.share'), { n: percent(share!), primo: N(primo!) }));
		if (i.outside && profile.range) {
			parts.push(
				fill(T('insights.r2.unlikely.range'), {
					bar: i.outside.measure,
					a: articleFor(i.outside.pitch),
					pitch: N(i.outside.pitch),
					low: N(profile.range.lowest),
					high: N(profile.range.highest),
				}),
			);
		}
		const reasons = (shareOk ? 1 : 0) + (heldOk ? 1 : 0) + (i.outside ? 1 : 0);
		if (reasons >= 2) parts.push(T('insights.r2.unlikely.together'));
		else if (reasons === 1) parts.push(T('insights.r2.unlikely.alone'));
		else if (i.verdict?.kind === 'verdict') parts.push(T(i.verdict.key));
		paragraph = parts.join(' ');
	} else if (i.verdict?.kind === 'verdict') {
		// N.182: no paragraph names one key as the better one; the keys follow as lines.
		paragraph = T(i.verdict.key) + (i.noneFlagged ? ` ${T('insights.findings.none')}` : '');
	} else if (i.noneFlagged && i.verdict?.kind !== 'offer') {
		paragraph = T('insights.findings.none');
	}

	// ── The reasons ───────────────────────────────────────────────────
	const reasons: Reason[] = [];
	const r = model.range;
	if (r.measured && r.reference) {
		reasons.push({
			label: T('insights.r2.reason.range'),
			lines: [
				fill(T(r.flag === 'contained' ? 'insights.r2.range.inside' : 'insights.r2.range.outside'), {
					low: N(r.measured.low),
					high: N(r.measured.high),
					lo: N(r.reference.low),
					hi: N(r.reference.high),
				}),
			],
		});
	}
	const keyLines: string[] = [];
	if (share !== null && primo && secondo) {
		const m = above !== null ? percent(above) : 0;
		keyLines.push(
			m === 0
				? fill(T('insights.r2.primo.none'), { n: percent(share), p: N(primo), s: N(secondo) })
				: fill(T('insights.r2.primo.some'), { n: percent(share), m, p: N(primo), s: N(secondo) }),
		);
	}
	const meetings = i.comments.filter((c) => !!c.comment.resonance);
	if (meetings.length === 1) {
		const c = meetings[0];
		keyLines.push(fill(T('insights.r2.fr1.one'), { vowel: `[${c.comment.vowel}]`, bar: i.barOf(c), heading: T('insights.r2.moments') }));
	} else if (meetings.length > 1) {
		keyLines.push(fill(T('insights.r2.fr1.many'), { count: capital(countWord(meetings.length, language)), heading: T('insights.r2.moments') }));
	}
	const bars = model.passaggioBars;
	if (bars.length === 1) keyLines.push(fill(T('insights.r2.nearPassaggioOne'), { bars: bars[0] }));
	else if (bars.length > 1) keyLines.push(fill(T('insights.r2.nearPassaggio'), { count: countWord(bars.length, language), bars: joinList(bars, language) }));
	if (keyLines.length > 0) reasons.push({ label: T('insights.r2.reason.key'), lines: keyLines });

	out.push({
		group: 'free',
		block: { kind: 'conclusion', heading: T('insights.verdict.heading'), paragraph, offer: i.verdict?.kind === 'offer', keys: i.keys, reasons },
	});

	// ── Squircle 1, the moments ───────────────────────────────────────
	// QUEUE row 69: a comment whose firing reads a placeholder fR1 says so in its own sentence.
	const onPlaceholder = (c: RenderedComment) =>
		placeholders.has(c.comment.vowel) && (!!c.comment.resonance || !!c.comment.turn || (c.comment.challenges ?? []).some((ch) => ch === 'resonance' || ch === 'turn' || ch === 'closedU'));
	const moment = (c: RenderedComment) => ({
		tag: i.tagOf(c),
		comment: c,
		...(suggestsApproach(c) ? { teacher: T('insights.r2.teacherA') } : {}),
		...(onPlaceholder(c) ? { placeholder: placeholderCommentSentence(c.comment.vowel, language) } : {}),
	});
	const moments: Block[] = i.comments.map((c) => ({ kind: 'comment', ...moment(c) }));
	if (i.hiddenBySettings > 0) {
		moments.push({
			kind: 'note',
			text: i.hiddenBySettings === 1 ? T('comment.hidden.one') : fill(T('comment.hidden.many'), { n: i.hiddenBySettings }),
		});
	}
	if (moments.length > 0) {
		withHeading(moments[0], T('insights.r2.moments'));
		for (const b of moments) out.push({ group: 'moments', block: b });
	}
	if (i.more.length > 0) {
		out.push({
			group: 'moments',
			screenOnly: true,
			block: {
				kind: 'more',
				label: i.more.length === 1 ? T('comment.more.one') : fill(T('comment.more.many'), { n: i.more.length }),
				comments: i.more.map(moment),
			},
		});
	}

	// ── Squircle 2, the totals ────────────────────────────────────────
	const totals: Block[] = [];
	if (model.phonation.nothingSung) {
		totals.push({ kind: 'prose', text: T('insights.fit.nothingSung') });
	} else {
		if (i.cycles) {
			const legend: string[] = [];
			let bar: { under: number; within: number; above: number } | null = null;
			if (i.split && profile.tessitura) {
				const u = doseValue(i.split.under);
				const w = doseValue(i.split.within);
				const a = doseValue(i.split.above);
				const sum = u + w + a;
				if (sum > 0) bar = { under: u / sum, within: w / sum, above: a / sum };
				legend.push(
					fill(T('insights.r2.cycles.under'), { n: doseText(i.split.under, language) }),
					fill(T('insights.r2.cycles.within'), { n: doseText(i.split.within, language), low: N(profile.tessitura.low), high: N(profile.tessitura.high) }),
					fill(T('insights.r2.cycles.above'), { n: doseText(i.split.above, language) }),
				);
			}
			totals.push({ kind: 'cycles', sentence: fill(T('insights.r2.cycles'), { n: doseText(i.cycles, language) }), bar, legend });
		}
		if (i.untrustedLine) totals.push({ kind: 'prose', text: i.untrustedLine });
		if (model.figure) {
			totals.push({
				kind: 'pitches',
				caption: T(model.figure.scale === 'seconds' ? 'insights.figure.caption' : 'insights.figure.captionQuavers'),
				figure: model.figure,
				typedTessitura: profile.tessitura ?? null,
			});
		}
		if (i.turns) {
			const rows = i.turns.rows.map((row) => {
				const s = secondsText(row.seconds, language, formatFine);
				const p = secondsText(row.past, language, formatFine);
				const pct = (x: number) => fill(T('insights.phonation.share'), { n: percent(x) });
				const amount = row.seconds ? s : pct(row.share);
				const pastAmount = row.past ? p : pct(row.pastShare);
				// An unsung vowel prints a whole zero, as the vowel chart did; one with nothing past its turn prints its time alone.
				let text: string;
				if (!row.sung) text = row.seconds ? '0\u00a0s' : pct(0);
				else if (!row.turn) text = fill(T('insights.r2.vowels.noTurn'), { s: amount });
				else if (row.pastShare <= 0) text = amount;
				else if (row.pastShare >= row.share - 1e-12) text = fill(T('insights.r2.vowels.allPast'), { s: amount });
				else text = fill(T('insights.r2.vowels.somePast'), { s: amount, p: pastAmount });
				return {
					vowel: row.vowel,
					before: (row.share - row.pastShare) / (i.turns!.maxShare || 1),
					past: row.pastShare / (i.turns!.maxShare || 1),
					text,
					turn: row.turn ? fill(T('insights.r2.vowels.turns'), { pitch: N(row.turn) }) : '',
					...(row.turn && placeholders.has(row.vowel) ? { placeholder: true as const } : {}),
				};
			});
			const dashed = placeholderTurnsSentence(rows.filter((r) => r.placeholder).map((r) => r.vowel), language);
			totals.push({
				kind: 'vowels',
				caption: T(model.phonation.timing === 'none' ? 'insights.phonation.byVowelShare' : 'insights.phonation.byVowel'),
				sub: T('insights.r2.vowels.against'),
				turns: i.turns,
				ring: i.turns.pastShare !== null ? fill(T('insights.r2.vowels.ring'), { n: percent(i.turns.pastShare) }) : null,
				rows,
				...(dashed ? { placeholder: dashed } : {}),
			});
		}
		if (i.phonationHeadline) totals.push({ kind: 'prose', text: i.phonationHeadline });
		totals.push({ kind: 'prose', text: T('insights.r2.sourcesLine'), small: true });
	}
	withHeading(totals[0], T('insights.r2.totals'));
	for (const b of totals) out.push({ group: 'totals', block: b });

	// ── Squircle 3, the sources, as endnotes ──────────────────────────
	const notes: Block[] = i.comments
		.filter((c) => c.hidden.length > 0 || c.references.length > 0)
		.map((c) => ({ kind: 'endnote', tag: `${i.tagOf(c)} \u00b7 [${c.comment.vowel}]`, suggestions: c.hidden.map((s) => s.runs), references: c.references }));
	if (notes.length > 0) {
		const first = notes[0] as Extract<Block, { kind: 'endnote' }>;
		first.heading = T('comment.tap');
		first.teacher = T('insights.r2.teacherC');
		for (const b of notes) out.push({ group: 'sources', block: b });
	}
	return out;
}

/** A squircle's heading rides on its first block, so a page never ends on a heading alone. */
function withHeading(b: Block | undefined, heading: string): void {
	if (b) (b as { heading?: string }).heading = heading;
}

function capital(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1);
}
