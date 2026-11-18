/**
 * Lane 66, Step 4 (`docs/sessions/brief-code-lane66-follow-ups_r3_2026-11-17.md`): the measure that comes before Step 5. Pure code, no I/O
 * (`lane66-measure.run.ts` reads the golden or a folder and writes the tables). Not a gate.
 *
 * TWO QUESTIONS, IN NUMBERS.
 *  (a) When a reading is judged outside, is the reading or today's replacement nearer the truth, for that vowel?
 *  (b) When that reading counts, how far do Ilya's values for the other vowels move, and toward the truth or away from it?
 *
 * A PROFILE is the takes of one voice type with the same take index `k` in `__golden__/path-600.json` (the path picker's reading of the primary
 * synthetic set, `fidelity-set.ts`). It is judged as the wizard judges a reading, `checkPlausibility(f1, vowel, type, anchorF1sFor(profile))`
 * (`CalibrationWizard.svelte`, `withPlausibility`), except that the anchors are the whole profile's, where the wizard holds the anchors it had at
 * capture. The truth is the set's own cell (`cells(PRIMARY)`).
 *
 * THE TWO COUNTS, defined once, here, and used by the runner and by `lane66-core.test.ts`:
 *   JUDGED OUTSIDE  `judgedOutside`: the vowels `checkPlausibility` calls `implausible`. Step 5 does not change it.
 *   SET ASIDE       `setAside`: a sung vowel whose `fR1Source` from `resolveVowelValues` is not `'sung'`, or whose `fR2Source` is not `'sung'` where the
 *                   take read an fR2 (a positive f2 whose `f2Quality` is not `absent`).
 *
 * "COUNTS" is today's kept case: the runner sets `plausibilityOverride` on the reading, so it computes the counted case without Step 5. After
 * Step 5 the plain case equals it, and the table that compares them says so.
 */
import { anchorF1sFor, checkPlausibility } from '$lib/voice/engine/plausibility';
import { bucketFor } from '$lib/voice/engine/plausibility';
import { resolveVowelValues, type ResolvedValues } from '$lib/voice/engine/resolve-values';
import { standInBucket } from '$lib/voice/engine/stand-ins';
import type { CalibratedFormant, Vowel } from '$lib/voice/engine/types';
import { cells, PRIMARY, TYPES, VOWELS, type SetType } from './fidelity-set';

export type Profile = Partial<Record<Vowel, CalibratedFormant>>;

/** Semitones from `b` up to `a`. */
export const st = (a: number, b: number): number => 12 * Math.log2(a / b);
const mean = (xs: number[]): number => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : NaN);
const median = (xs: number[]): number => {
	if (!xs.length) return NaN;
	const s = [...xs].sort((a, b) => a - b);
	const m = s.length >> 1;
	return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
export const f = (x: number, d = 2): string => (Number.isFinite(x) ? x.toFixed(d) : 'n/a');
const pct = (n: number, d: number): string => (d ? `${((100 * n) / d).toFixed(1)}%` : 'n/a');
const frac = (n: number, d: number): string => `${n}/${d} (${pct(n, d)})`;
const table = (head: string[], rows: (string | number)[][]): string =>
	['| ' + head.join(' | ') + ' |', '|' + head.map(() => '---').join('|') + '|', ...rows.map((r) => '| ' + r.join(' | ') + ' |')].join('\n');

// ── The voice types a profile is judged under ──────────────────────────────────────────────────────────────────────────────────────────

/** The declared ids a singer can choose (`voiceTypes.ts`, `TIER1`), and no type. Listed, not imported, so this file needs no i18n; `lane66-core.test.ts` pins them to `TIER1`. */
export const DECLARED = ['soprano', 'mezzo-soprano', 'contralto', 'countertenor', 'tenor', 'baritone', 'bass-baritone', 'bass', 'not-sure'] as const;

export interface JudgeGroup {
	/** The type id the runner passes (undefined: no type). */
	id: string | undefined;
	/** Every declared id (and "no type") that routes the same way, by the guard's bucket and the stand-ins' bucket. */
	members: string[];
	key: string;
}
const NONE = '(no type)';
/** The ids and no type, grouped by what they do: the guard's bucket (`bucketFor`) and the stand-ins' bucket (`standInBucket`). Ids in one group give the same verdicts and the same replacements. */
export function judgeGroups(): JudgeGroup[] {
	const out: JudgeGroup[] = [];
	for (const id of [...DECLARED, undefined] as (string | undefined)[]) {
		const key = `${bucketFor(id)}|${standInBucket(id)}`;
		const label = id ?? NONE;
		const g = out.find((x) => x.key === key);
		if (g) g.members.push(label);
		else out.push({ id, members: [label], key });
	}
	return out;
}
/** The group a set type belongs to (its own type). */
export const ownKey = (t: SetType): string => `${bucketFor(t)}|${standInBucket(t)}`;

// ── Profiles ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

export interface GoldenRow {
	idx: number; k: number; type: SetType; vowel: Vowel;
	path: { outcome: string; f1?: number | null; f2?: number | null; confidence?: string; reading?: string; f2Quality?: string };
}

/** A stored reading, as the path picker's golden row gives it. No verdict yet: the judge adds it. */
export function formantOf(r: GoldenRow): CalibratedFormant | undefined {
	const p = r.path;
	if (p.outcome !== 'reading' || typeof p.f1 !== 'number') return undefined;
	return {
		f1: p.f1,
		...(typeof p.f2 === 'number' ? { f2: p.f2 } : {}),
		confidence: p.confidence as CalibratedFormant['confidence'],
		reading: p.reading as CalibratedFormant['reading'],
		f2Quality: (p.f2Quality ?? 'absent') as CalibratedFormant['f2Quality'],
		source: 'measured-user', picker: 'path',
	} as CalibratedFormant;
}

export interface SetProfile { type: SetType; k: number; formants: Profile }
/** One profile for each voice type and take index: 5 types by 12. A vowel whose take gave no reading is missing. */
export function profilesFromGolden(rows: GoldenRow[]): SetProfile[] {
	const out: SetProfile[] = [];
	for (const type of TYPES) for (let k = 0; k < 12; k++) {
		const formants: Profile = {};
		for (const r of rows) if (r.type === type && r.k === k) { const x = formantOf(r); if (x) formants[r.vowel] = x; }
		out.push({ type, k, formants });
	}
	return out;
}

const TRUTH = new Map<string, number[]>(cells(PRIMARY).map((c) => [`${c.type}|${c.vowel}`, c.truth]));
/** The set's truth for a type and vowel: [fR1, fR2, ...] in Hz. */
export const truthOf = (type: SetType, vowel: Vowel): number[] => TRUTH.get(`${type}|${vowel}`)!;

// ── Judging, the two counts, and the resolution ────────────────────────────────────────────────────────────────────────────────────────

/** The profile with the verdict stored on each reading, as the wizard stores it at capture. */
export function judge(profile: Profile, type: string | undefined): Profile {
	const anchors = anchorF1sFor(profile);
	const out: Profile = {};
	for (const v of VOWELS) {
		const x = profile[v];
		if (x) out[v] = { ...x, plausibility: checkPlausibility(x.f1, v, type, anchors).plausibility };
	}
	return out;
}
/** JUDGED OUTSIDE (see the header). */
export const judgedOutside = (judged: Profile): Vowel[] => VOWELS.filter((v) => judged[v]?.plausibility === 'implausible');
/** The profile with these vowels counted, as the singer's Keep leaves them (`plausibilityOverride`). */
export function counted(judged: Profile, vowels: readonly Vowel[]): Profile {
	const out: Profile = { ...judged };
	for (const v of vowels) if (out[v]) out[v] = { ...out[v]!, plausibilityOverride: true };
	return out;
}
/** The values for a voice type with the chart's stand-ins (`'always'`), so a value exists for every vowel in both cases. */
export const resolve = (profile: Profile, type: string | undefined): ResolvedValues => resolveVowelValues(profile, type, { placeholders: 'always' });

/** SET ASIDE (see the header): the sung vowels whose number does not come from the singer. Since lane 67 every sung vowel of a profile with fewer than five core vowels is set aside by the threshold (`voice/engine/sung.ts`, `isPersonal`), whatever its verdict. */
export function setAside(profile: Profile, resolved: ResolvedValues): Vowel[] {
	return VOWELS.filter((v) => {
		const x = profile[v];
		if (!x || x.reading === 'estimated' || !(x.f1 > 0)) return false;
		if (resolved.fR1Source[v] !== 'sung') return true;
		const readF2 = typeof x.f2 === 'number' && x.f2 > 0 && x.f2Quality !== 'absent';
		return readF2 && resolved.fR2Source[v] !== 'sung';
	});
}

// ── The cases ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** A reading judged outside under a type that is not the profile's own. */
export interface OutsideCase {
	type: SetType; k: number; judge: JudgeGroup; vowel: Vowel; judged: Profile;
	readF1: number; readF2: number | null;
	/** The value the documents use today for this vowel, and where it comes from. */
	replF1: number; replF1Source: string; replF2: number | undefined; replF2Source: string | undefined;
	truthF1: number; truthF2: number;
}

/** Every reading judged outside, for every profile, under every group but its own. Own-type counts are returned apart. */
export function outsideCases(profiles: SetProfile[]): { cases: OutsideCase[]; own: { type: SetType; readings: number; outside: number; items: string[] }[]; cross: { group: JudgeGroup; readings: number; outside: number; alsoOwn: number }[] } {
	const groups = judgeGroups();
	const cases: OutsideCase[] = [];
	const own = TYPES.map((type) => ({ type, readings: 0, outside: 0, items: [] as string[] }));
	const cross = groups.map((group) => ({ group, readings: 0, outside: 0, alsoOwn: 0 }));
	for (const p of profiles) {
		for (const group of groups) {
			const judged = judge(p.formants, group.id);
			const out = judgedOutside(judged);
			const isOwn = group.key === ownKey(p.type);
			// A reading that is outside under the profile's own type too is the picker's error, whatever type is declared (the four anchor-centred vowels are judged the same under every type): it is counted there, and it is not a cross-type case.
			const ownOut = judgedOutside(judge(p.formants, p.type));
			const readings = Object.keys(judged).length;
			if (isOwn) { const o = own.find((x) => x.type === p.type)!; o.readings += readings; o.outside += out.length; for (const v of out) o.items.push(`[${v}] k${p.k}: fR1 ${judged[v]!.f1} Hz, truth ${truthOf(p.type, v)[0].toFixed(1)} Hz (${st(judged[v]!.f1, truthOf(p.type, v)[0]).toFixed(1)} st)`); continue; }
			const c = cross.find((x) => x.group === group)!; c.readings += readings; c.outside += out.length; c.alsoOwn += out.filter((v) => ownOut.includes(v)).length;
			const fresh = out.filter((v) => !ownOut.includes(v));
			if (!fresh.length) continue;
			const r = resolve(judged, group.id);
			for (const v of fresh) {
				const x = judged[v]!, t = truthOf(p.type, v);
				cases.push({
					type: p.type, k: p.k, judge: group, vowel: v, judged,
					readF1: x.f1, readF2: typeof x.f2 === 'number' && x.f2 > 0 && x.f2Quality !== 'absent' ? x.f2 : null,
					replF1: r.fR1[v], replF1Source: r.fR1Source[v], replF2: r.fR2[v], replF2Source: r.fR2Source[v],
					truthF1: t[0], truthF2: t[1],
				});
			}
		}
	}
	return { cases, own, cross };
}

/** Question (a), as tables: the reading against today's replacement, for the vowel that is outside. */
export function questionA(cases: OutsideCase[]): string {
	const EPS = 0.005;
	const one = (label: string, xs: OutsideCase[]): (string | number)[] => {
		const e1r = xs.map((c) => Math.abs(st(c.readF1, c.truthF1))), e1p = xs.map((c) => Math.abs(st(c.replF1, c.truthF1)));
		const near1 = xs.filter((_, i) => e1r[i] < e1p[i] - EPS).length, far1 = xs.filter((_, i) => e1r[i] > e1p[i] + EPS).length;
		const x2 = xs.filter((c) => c.readF2 !== null && c.replF2 !== undefined);
		const e2r = x2.map((c) => Math.abs(st(c.readF2!, c.truthF2))), e2p = x2.map((c) => Math.abs(st(c.replF2!, c.truthF2)));
		const near2 = x2.filter((_, i) => e2r[i] < e2p[i] - EPS).length, far2 = x2.filter((_, i) => e2r[i] > e2p[i] + EPS).length;
		return [label, xs.length, f(mean(e1r)), f(mean(e1p)), `${near1} / ${far1} / ${xs.length - near1 - far1}`, x2.length, f(mean(e2r)), f(mean(e2p)), `${near2} / ${far2} / ${x2.length - near2 - far2}`];
	};
	const head = ['', 'cases', 'fR1: reading, mean st from truth', 'fR1: replacement, mean st from truth', 'fR1: reading nearer / farther / equal', 'with an fR2', 'fR2: reading, mean st', 'fR2: replacement, mean st', 'fR2: reading nearer / farther / equal'];
	const groups = [...new Set(cases.map((c) => c.judge.key))].map((key) => {
		const xs = cases.filter((c) => c.judge.key === key);
		return one(`judged as ${xs[0].judge.members.join(', ')}`, xs);
	});
	const byVowel = [...new Set(cases.map((c) => c.vowel))].map((v) => one(`[${v}]`, cases.filter((c) => c.vowel === v)));
	const sources = ['surrogate', 'derived', 'sung'].map((s) => `${s}: ${cases.filter((c) => c.replF1Source === s).length}`).join(', ');
	const farther = cases.filter((c) => Math.abs(st(c.readF1, c.truthF1)) > Math.abs(st(c.replF1, c.truthF1)) + EPS)
		.map((c) => `- ${c.type} k${c.k}, [${c.vowel}] judged as ${c.judge.members[0]}: reading ${c.readF1} Hz, today's value ${c.replF1} Hz (${c.replF1Source}), truth ${c.truthF1.toFixed(1)} Hz`);
	return [table(head, [one('all cross-type cases', cases), ...groups]), '\nBy vowel:\n', table(head, byVowel), `\nWhere today's value for the vowel comes from (fR1): ${sources}.`, `\nThe cases where today's value is nearer the truth for fR1 (${farther.length}):\n`, ...farther].join('\n');
}

// ── Question (b): what moves when the reading counts ───────────────────────────────────────────────────────────────────────────────────

export const SUBSET_SIZES = [1, 2, 3, 6] as const;
const COMPANION_ORDER: Vowel[] = ['i', 'e', 'ɛ', 'ɑ', 'o', 'u'];

/** One vowel's two values (plain, and with the reading counting) and the truth for it. */
export interface MoveRow { vowel: Vowel; a1: number; b1: number; a2: number | undefined; b2: number | undefined; t1: number; t2: number }
export interface MoveCase { label: string; n: number; outside: Vowel; rows: MoveRow[]; plainEqualsCounted: boolean; setAsidePlain: Vowel[]; setAsideCounted: Vowel[]; }

/**
 * The profile cut to `n` sung vowels, of which `v` (judged outside under `type`) is one. The others are the first plausible vowels of the six
 * Bozeman vowels, in a fixed order. Null when the profile has too few, or when the cut changes a verdict.
 */
export function subsetOf(judged: Profile, v: Vowel, n: number, type: string | undefined): Profile | null {
	const comps = COMPANION_ORDER.filter((w) => w !== v && judged[w] && judged[w]!.plausibility === 'plausible').slice(0, n - 1);
	if (comps.length < n - 1) return null;
	const cut: Profile = { [v]: judged[v], ...Object.fromEntries(comps.map((w) => [w, judged[w]])) };
	const again = judge(Object.fromEntries(Object.entries(cut).map(([w, x]) => [w, { ...x!, plausibility: undefined }])) as Profile, type);
	return judgedOutside(again).length === 1 && judgedOutside(again)[0] === v ? again : null;
}

/** The values with the reading excluded (plain) and counted, for every vowel not sung in the cut. */
export function moveCase(label: string, setType: SetType, type: string | undefined, cut: Profile, v: Vowel): MoveCase {
	const plain = resolve(cut, type), kept = resolve(counted(cut, [v]), type);
	const rows: MoveRow[] = [];
	for (const w of VOWELS) {
		if (cut[w]) continue;
		const t = truthOf(setType, w);
		rows.push({ vowel: w, a1: plain.fR1[w], b1: kept.fR1[w], a2: plain.fR2[w], b2: kept.fR2[w], t1: t[0], t2: t[1] });
	}
	const plainEqualsCounted = VOWELS.every((w) => plain.fR1[w] === kept.fR1[w] && plain.fR2[w] === kept.fR2[w] && plain.fR1Source[w] === kept.fR1Source[w] && plain.fR2Source[w] === kept.fR2Source[w]);
	return { label, n: Object.keys(cut).length, outside: v, rows, plainEqualsCounted, setAsidePlain: setAside(cut, plain), setAsideCounted: setAside(counted(cut, [v]), kept) };
}

/** The cases of (b): each cross-type case at each size, and (apart) a bass with [i] at 1063 Hz. */
export function moveCases(profiles: SetProfile[], cross: OutsideCase[]): { cross: MoveCase[]; bass1063: MoveCase[] } {
	const crossOut: MoveCase[] = [];
	for (const c of cross) for (const n of SUBSET_SIZES) {
		const cut = subsetOf(c.judged, c.vowel, n, c.judge.id);
		if (cut) crossOut.push(moveCase(`${c.type} k${c.k} as ${c.judge.members[0]}, [${c.vowel}]`, c.type, c.judge.id, cut, c.vowel));
	}
	const bass1063: MoveCase[] = [];
	for (const p of profiles.filter((x) => x.type === 'bass')) {
		if (!p.formants.i) continue;
		const withBad: Profile = { ...p.formants, i: { ...p.formants.i, f1: 1063 } };
		const judged = judge(withBad, 'bass');
		if (judged.i?.plausibility !== 'implausible') continue;
		for (const n of SUBSET_SIZES) {
			const cut = subsetOf(judged, 'i', n, 'bass');
			if (cut) bass1063.push(moveCase(`bass k${p.k}, [i] at 1063 Hz`, 'bass', 'bass', cut, 'i'));
		}
	}
	return { cross: crossOut, bass1063 };
}

/** A table of what moves, by number of sung vowels. fR1 and fR2: how far the value moves, and whether it lands nearer the truth or farther. */
export function questionB(cases: MoveCase[]): string {
	const EPS = 0.005;
	const rows = SUBSET_SIZES.map((n) => {
		const xs = cases.filter((c) => c.n === n);
		const vals = xs.flatMap((c) => c.rows);
		const mv1 = vals.map((r) => Math.abs(st(r.b1, r.a1)));
		const d1 = vals.map((r) => Math.abs(st(r.b1, r.t1)) - Math.abs(st(r.a1, r.t1)));
		const v2 = vals.filter((r) => r.a2 !== undefined && r.b2 !== undefined);
		const mv2 = v2.map((r) => Math.abs(st(r.b2!, r.a2!)));
		const d2 = v2.map((r) => Math.abs(st(r.b2!, r.t2)) - Math.abs(st(r.a2!, r.t2)));
		const cnt = (d: number[]) => `${d.filter((x) => x < -EPS).length} / ${d.filter((x) => x > EPS).length} / ${d.filter((x) => Math.abs(x) <= EPS).length}`;
		return [n, xs.length, vals.length, f(mean(mv1)), f(median(mv1)), f(Math.max(...mv1, 0)), cnt(d1), f(mean(d1)), f(mean(mv2)), f(Math.max(...mv2, 0)), cnt(d2), f(mean(d2))];
	});
	return table(['sung vowels', 'cases', 'other-vowel values', 'fR1 moves: mean st', 'median', 'max', 'fR1 nearer / farther / equal', 'fR1 mean change in distance to truth (st; negative: nearer)', 'fR2 moves: mean st', 'max', 'fR2 nearer / farther / equal', 'fR2 mean change (st)'], rows);
}

/** The line Step 5 reads: set aside, for the plain case and for the counted case, over every case. */
export function setAsideLine(cases: MoveCase[]): string {
	const plain = cases.filter((c) => c.setAsidePlain.length > 0).length, kept = cases.filter((c) => c.setAsideCounted.length > 0).length;
	const same = cases.filter((c) => c.plainEqualsCounted).length;
	return `Of ${cases.length} cases: a sung vowel is set aside in ${plain} when the reading is not kept, and in ${kept} when it is kept; every value equals its kept twin in ${same}.`;
}

/** The two counts for every profile under every group, own type included: judged outside, and set aside when nothing is kept. Step 5 rereads this: set aside goes to zero, judged outside does not move. */
export function countsTable(profiles: SetProfile[]): { text: string; outside: number; aside: number } {
	let outside = 0, aside = 0;
	const rows = judgeGroups().map((g) => {
		let o = 0, a = 0, n = 0, np = 0;
		for (const p of profiles) {
			const j = judge(p.formants, g.id);
			n += Object.keys(j).length;
			o += judgedOutside(j).length;
			const sa = setAside(j, resolve(j, g.id));
			a += sa.length; if (sa.length) np++;
		}
		outside += o; aside += a;
		return [g.members.join(', '), profiles.length, n, o, a, np];
	});
	return { text: table(['judged as', 'profiles', 'readings', 'judged outside', 'set aside', 'profiles with a vowel set aside'], rows), outside, aside };
}

/** Which vowels' values move by more than one semitone (fR1) when the reading counts, by number of sung vowels: where the movement sits. */
export function bigMoves(cases: MoveCase[]): string {
	const rows = SUBSET_SIZES.map((n) => {
		const xs = cases.filter((c) => c.n === n);
		const big = xs.flatMap((c) => c.rows.filter((r) => Math.abs(st(r.b1, r.a1)) > 1));
		const by = VOWELS.map((v) => [v, big.filter((r) => r.vowel === v).length] as const).filter(([, k]) => k > 0).map(([v, k]) => `[${v}] ${k}`).join(', ');
		return [n, xs.length, big.length, by || 'none'];
	});
	return table(['sung vowels', 'cases', 'values that move by more than 1 st (fR1)', 'by vowel'], rows);
}
