/**
 * Lane 66, Step 4: a folder of the recorder's files, read for the same two questions as `lane66-core.ts` (`apps/web/src/lib/voice/engine/capture-file.ts`
 * writes them). A folder has no truth, so the run reports each reading, its verdict, and what moves when it counts; it cannot say which is nearer.
 *
 * THE PROFILE. A sidecar carries no voice type (`capture-file.ts`, `CaptureRecord`), so the type comes from a second variable. For each vowel the profile is
 * the last take whose `sung` is empty or equals `asked`, with the reading its sidecar stored (`outcome.formant`). Takes whose `sung` differs from `asked`
 * are reported apart and never enter the profile. The last is the latest by the stamp in the file name.
 *
 * ONE DIFFERENCE FROM THE WIZARD, stated in the output: the verdict is judged with the whole profile's anchors (`anchorF1sFor(profile)`), where the wizard judges
 * a reading with the anchors it held at capture. It matters only for the four vowels whose window is centred on the singer's own anchors.
 */
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { anchorF1sFor, checkPlausibility } from '$lib/voice/engine/plausibility';
import type { CalibratedFormant, Vowel } from '$lib/voice/engine/types';
import { VOWELS } from './fidelity-set';
import { counted, f, judge, judgedOutside, resolve, st, type Profile } from './lane66-core';

export interface FolderTake { file: string; stamp: string; asked: string; sung: string | null; outcome: string; formant: CalibratedFormant | null }

/** The stamp the recorder puts in a file name (`takeBase`): `ilya-capture-asked-<v>-sung-<s>-<stamp>`. Falls back to the whole name, which still sorts. */
export function stampOf(file: string): string {
	const m = /-sung-.*?-(\d{4}-\d\d-\d\dT[^.]*)\.(?:json|wav)$/.exec(file);
	return m ? m[1] : file;
}

/** One sidecar, as `holdCapture` writes it. Anything that is not a sidecar of a take gives null. */
export function takeOf(file: string, text: string): FolderTake | null {
	let j: { asked?: unknown; sung?: unknown; outcome?: { outcome?: string; formant?: CalibratedFormant } };
	try { j = JSON.parse(text); } catch { return null; }
	if (typeof j.asked !== 'string') return null;
	const o = j.outcome?.outcome ?? 'unknown';
	return {
		file, stamp: stampOf(file), asked: j.asked, sung: typeof j.sung === 'string' && j.sung.trim() ? j.sung.trim() : null, outcome: o,
		formant: o === 'reading' && j.outcome?.formant && typeof j.outcome.formant.f1 === 'number' ? j.outcome.formant : null,
	};
}

export function readFolder(dir: string): FolderTake[] {
	return readdirSync(dir).filter((n) => n.endsWith('.json')).sort().flatMap((n) => { const t = takeOf(n, readFileSync(path.join(dir, n), 'utf8')); return t ? [t] : []; });
}

export interface FolderProfile { profile: Profile; used: FolderTake[]; apart: FolderTake[]; noReading: FolderTake[]; earlier: FolderTake[] }
/** For each vowel, the last take sung as asked; the rest apart (see the header). */
export function folderProfile(takes: FolderTake[]): FolderProfile {
	const asSung = (t: FolderTake) => t.sung === null || t.sung === t.asked;
	const apart = takes.filter((t) => !asSung(t));
	const noReading = takes.filter((t) => asSung(t) && !t.formant);
	const profile: Profile = {}, used: FolderTake[] = [], earlier: FolderTake[] = [];
	for (const v of VOWELS) {
		const mine = takes.filter((t) => t.asked === v && asSung(t) && t.formant).sort((a, b) => (a.stamp < b.stamp ? -1 : a.stamp > b.stamp ? 1 : 0));
		if (!mine.length) continue;
		const last = mine[mine.length - 1];
		profile[v] = last.formant!; used.push(last); earlier.push(...mine.slice(0, -1));
	}
	return { profile, used, apart, noReading, earlier };
}

/** The tables for one folder and one voice type. Markdown, and a CSV with one row per reading. */
export function folderReport(takes: FolderTake[], type: string | undefined): { md: string; csv: string } {
	const fp = folderProfile(takes);
	const judged = judge(fp.profile, type);
	const outside = judgedOutside(judged);
	const plain = resolve(judged, type);
	const lines: string[] = [];
	lines.push(`Voice type for judging: ${type ?? '(no type)'}. ${takes.length} sidecars read; ${fp.used.length} readings in the profile (the last take sung as asked, per vowel); ${fp.earlier.length} earlier takes of those vowels not used; ${fp.apart.length} takes sung as another vowel, reported apart; ${fp.noReading.length} takes with no reading (a re-prompt or an error).`);
	lines.push('The verdict is judged with the whole profile\'s anchors; the wizard judges with the anchors held at capture. It matters only for [ɪ], [ɨ], [a], and [ʌ].');
	const csv = ['vowel,file,picker,f1,f2,f2Quality,confidence,reading,verdict,windowLow,windowHigh,today_fR1,today_fR1_source'];
	const rows = VOWELS.filter((v) => judged[v]).map((v) => {
		const x = judged[v]!, r = checkPlausibility(x.f1, v, type, anchorF1sFor(fp.profile));
		const take = fp.used.find((t) => t.asked === v)!;
		csv.push([v, take.file, x.picker ?? '', x.f1, x.f2 ?? '', x.f2Quality ?? '', x.confidence, x.reading, x.plausibility, r.windowLow ?? '', r.windowHigh ?? '', plain.fR1[v], plain.fR1Source[v]].join(','));
		return `| [${v}] | ${x.f1} | ${x.f2 ?? 'none'} | ${x.f2Quality ?? ''} | ${x.reading} | ${x.plausibility}${r.windowLow !== undefined ? ` (window ${r.windowLow} to ${r.windowHigh})` : ''} | ${plain.fR1[v]} (${plain.fR1Source[v]}) |`;
	});
	lines.push('\n## Each reading\n', '| vowel | fR1 | fR2 | fR2 quality | status | verdict | the value used today for fR1 |', '|---|---|---|---|---|---|---|', ...rows);
	if (fp.apart.length) lines.push('\n## Takes sung as another vowel (not in the profile)\n', ...fp.apart.map((t) => `- ${t.file}: asked [${t.asked}], sung [${t.sung}], ${t.outcome}`));
	lines.push(`\n## What moves when a reading counts\n`);
	if (!outside.length) lines.push('No reading is judged outside: nothing to count.');
	const moveRows = (label: string, keep: Vowel[]) => {
		const kept = resolve(counted(judged, keep), type);
		const body = VOWELS.filter((w) => !judged[w]).map((w) => {
			const m1 = st(kept.fR1[w], plain.fR1[w]), m2 = plain.fR2[w] && kept.fR2[w] ? st(kept.fR2[w], plain.fR2[w]) : NaN;
			return `| [${w}] | ${plain.fR1[w]} | ${kept.fR1[w]} | ${f(m1)} | ${plain.fR2[w] ?? ''} | ${kept.fR2[w] ?? ''} | ${f(m2)} |`;
		});
		const own = keep.map((v) => `[${v}] fR1: today ${plain.fR1[v]} (${plain.fR1Source[v]}), counted ${kept.fR1[v]} (${kept.fR1Source[v]}); reading ${judged[v]!.f1}`);
		lines.push(`\n### ${label}\n`, ...own.map((s) => `- ${s}`), '\n| vowel not sung | fR1 today | fR1 counted | moves (st) | fR2 today | fR2 counted | moves (st) |', '|---|---|---|---|---|---|---|', ...body);
	};
	for (const v of outside) moveRows(`[${v}] counted, alone`, [v]);
	if (outside.length > 1) moveRows(`${outside.map((v) => `[${v}]`).join(', ')} counted together`, outside);
	return { md: lines.join('\n') + '\n', csv: csv.join('\n') + '\n' };
}

/** The output goes beside the folder, never into the repository (recordings and what is derived from them are never public). */
export function outDirFor(dir: string, repoRoot: string): string {
	const abs = path.resolve(dir);
	const out = path.join(path.dirname(abs), `${path.basename(abs)}-lane66-out`);
	const rel = path.relative(repoRoot, out);
	if (!rel.startsWith('..') && !path.isAbsolute(rel)) throw new Error(`the output would land inside the repository (${out}); give a folder outside it`);
	return out;
}

export function writeFolderReport(dir: string, type: string | undefined, repoRoot: string): { out: string; md: string } {
	const { md, csv } = folderReport(readFolder(dir), type);
	const out = outDirFor(dir, repoRoot);
	mkdirSync(out, { recursive: true });
	writeFileSync(path.join(out, 'summary.md'), md);
	writeFileSync(path.join(out, 'readings.csv'), csv);
	return { out, md };
}
