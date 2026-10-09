/**
 * final-line: the line printer for the final test (QUEUE row 55).
 * Written by the desk, 2026-10-08. It measures; it reads no page and changes no reading.
 *
 * It scores one reading against one truth file with `scoreScan`
 * (`tools/e16-harness/src/scan-scorer.ts`) and prints ONE LINE of counts in
 * QUEUE row 52's format. It prints no title, no bar number, and no note.
 *
 * Three things it adds to row 52's line:
 *   1. `octave shift`: the scorer forgives one whole-song octave shift when it
 *      compares pitch. The line says which shift it used, so a song read an
 *      octave away from the print is visible.
 *   2. `metre as printed`: where the truth file carries the printed figures
 *      (`timeSignature`, `metreChanges`), each truth bar that holds a matched
 *      event is paired with the reader bar that holds most of them, and the
 *      figure in force in that reader bar is compared with the printed figure.
 *      6/8 against 3/4, and 2/2 against 4/4, count as different.
 *   3. A second score with the notes the truth-maker marked `unsure` set aside:
 *      they leave both the count of right notes and the count of printed notes.
 *      They were marked before any reader ran.
 *
 * Score: (right - extra) / printed x 100, to one decimal. PASS at 95.0 or more.
 *
 * Usage (tsx, or node with type stripping):
 *   final-line.ts song    <label> <path> <truth.json> <read.json> <keepDir>
 *   final-line.ts refused <label> <truth.json> <keepDir> <reason...>
 *   final-line.ts total   <keepDir>
 * `read.json` is conv.py's output. `keepDir` receives `<label>.line.json` (the
 * counts) and `<label>.score.json` (the scorer's whole output, kept unopened).
 * SCAN_SCORER=<path> overrides where the scorer is loaded from.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const PASS_AT = 95.0;

interface Counts {
	label: string;
	path: string;
	refused: string | null;
	shift: number | null;
	printed: number;
	right: number;
	missing: number;
	extra: number;
	pitchMisreads: number;
	lengthMisreads: number;
	barsRead: number;
	barsPrinted: number;
	metre: { right: number; paired: number; unpaired: number } | null;
	unsureNotes: number;
	unsureRight: number;
}

function fail(msg: string): never {
	console.error(`final-line: ${msg}`);
	process.exit(2);
}

function rounded(x: number): number {
	return Math.round(x * 10) / 10;
}

function scoreText(right: number, extra: number, printed: number): string {
	if (printed <= 0) return 'score NOT ESTABLISHED (no printed notes)';
	const r = rounded((100 * (right - extra)) / printed);
	return `${r.toFixed(1)} ${r >= PASS_AT ? 'PASS' : 'BELOW'}`;
}

function loadTruth(p: string) {
	const tj = JSON.parse(fs.readFileSync(p, 'utf8'));
	// the same order and the same fields as score.ts
	const sorted = [...tj.verses[0].notes].sort((a: any, b: any) => a.onsetAbsolute - b.onsetAbsolute);
	const events = sorted.map((n: any) => ({ type: n.type, measureIndex: n.measureIndex, midi: n.midi, duration: n.duration }));
	const unsure: boolean[] = sorted.map((n: any) => n.unsure === true);
	return { tj, events, unsure, bars: tj.measureDurations };
}

/** The printed figure in force at a truth bar, or null when the truth file carries none. */
function printedMetre(tj: any): ((bar: number) => string) | null {
	const first = tj.timeSignature;
	if (!first || !Number.isInteger(first.beats) || !Number.isInteger(first.beatType)) return null;
	const changes = [...(tj.metreChanges ?? [])].sort((a: any, b: any) => a.measureIndex - b.measureIndex);
	return (bar: number) => {
		let cur = first;
		for (const c of changes) if (c.measureIndex <= bar) cur = c;
		return `${cur.beats}/${cur.beatType}`;
	};
}

function lineOf(c: Counts): string {
	if (c.refused !== null) {
		return `${c.label}: refused (${c.refused}); 0 of ${c.printed} right; score ${scoreText(0, 0, c.printed)}`;
	}
	const parts = [
		`${c.label}: ${c.path}`,
		`${c.right} of ${c.printed} right`,
		`missing ${c.missing}`,
		`extra ${c.extra}`,
		`pitch misreads ${c.pitchMisreads}`,
		`length misreads ${c.lengthMisreads}`,
		`bars read ${c.barsRead} of ${c.barsPrinted}`
	];
	if (c.shift !== null) parts.push(`octave shift ${c.shift}`);
	if (c.metre) parts.push(`metre as printed ${c.metre.right} of ${c.metre.paired} bars (${c.metre.unpaired} bars with no matched note or rest not judged)`);
	else parts.push('metre as printed NOT SCORED (the truth carries no figures)');
	parts.push(`score ${scoreText(c.right, c.extra, c.printed)}`);
	if (c.unsureNotes > 0) {
		parts.push(`with ${c.unsureNotes} ${c.unsureNotes === 1 ? 'note' : 'notes'} marked UNSURE set aside ${scoreText(c.right - c.unsureRight, c.extra, c.printed - c.unsureNotes)}`);
	} else parts.push('no note marked UNSURE');
	return parts.join('; ');
}

function keep(keepDir: string, name: string, value: unknown): void {
	fs.mkdirSync(keepDir, { recursive: true });
	fs.writeFileSync(path.join(keepDir, name), JSON.stringify(value, null, 1));
}

async function song(label: string, how: string, truthPath: string, readPath: string, keepDir: string): Promise<void> {
	const scorerPath = process.env.SCAN_SCORER ?? path.resolve(path.dirname(process.argv[1]), '../../../tools/e16-harness/src/scan-scorer.ts');
	const { scoreScan } = await import(pathToFileURL(scorerPath).href);
	const { tj, events, unsure, bars } = loadTruth(truthPath);
	const read = JSON.parse(fs.readFileSync(readPath, 'utf8'));
	const s: any = scoreScan({ events, bars }, { events: read.events, bars: read.bars });

	// which truth notes are right in pitch and in length: matched, and with no difference recorded
	const flawed = new Set<number>();
	for (const d of s.differences) if (d.truthIndex !== null) flawed.add(d.truthIndex);
	const matchOfTruth = new Map<number, number>(s.matches.map((m: any) => [m.truthIndex, m.readerIndex]));
	let right = 0;
	let unsureNotes = 0;
	let unsureRight = 0;
	events.forEach((e: any, i: number) => {
		if (e.type !== 'note') return;
		const ok = matchOfTruth.has(i) && !flawed.has(i);
		if (ok) right++;
		if (unsure[i]) {
			unsureNotes++;
			if (ok) unsureRight++;
		}
	});
	if (right !== s.notes.bothRight) fail(`${label}: this script counts ${right} right notes and the scorer counts ${s.notes.bothRight}; nothing printed`);

	// the metre as printed, by figure
	let metre: Counts['metre'] = null;
	const printed = printedMetre(tj);
	if (printed) {
		const figureOf = new Map<number, string | null>(read.bars.map((b: any) => [b.measureIndex, b.metre ? `${b.metre.beats}/${b.metre.beatType}` : null]));
		const byBar = new Map<number, number[]>();
		events.forEach((e: any, i: number) => {
			const l = byBar.get(e.measureIndex) ?? [];
			l.push(i);
			byBar.set(e.measureIndex, l);
		});
		metre = { right: 0, paired: 0, unpaired: 0 };
		for (const tb of bars) {
			const votes = new Map<number, number>();
			for (const i of byBar.get(tb.index) ?? []) {
				const r = matchOfTruth.get(i);
				if (r === undefined) continue;
				const rb = read.events[r].measureIndex;
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
			if (figureOf.get(rb) === printed(tb.index)) metre.right++;
		}
	}

	const c: Counts = {
		label,
		path: how,
		refused: null,
		shift: s.shift,
		printed: s.notes.truth,
		right,
		missing: s.notes.missing,
		extra: s.notes.extra,
		pitchMisreads: s.notes.pitchWrong + s.notes.pitchAbstained,
		lengthMisreads: s.notes.lengthWrong + s.notes.lengthAbstained,
		barsRead: s.bars.read,
		barsPrinted: s.bars.truth,
		metre,
		unsureNotes,
		unsureRight
	};
	keep(keepDir, `${label}.score.json`, s);
	keep(keepDir, `${label}.line.json`, c);
	console.log(lineOf(c));
}

function refused(label: string, truthPath: string, keepDir: string, reason: string): void {
	const { events, unsure, bars } = loadTruth(truthPath);
	const printed = events.filter((e: any) => e.type === 'note').length;
	const c: Counts = {
		label, path: 'refused', refused: reason || 'no reason given', shift: null, printed, right: 0, missing: printed, extra: 0,
		pitchMisreads: 0, lengthMisreads: 0, barsRead: 0, barsPrinted: bars.length, metre: null,
		unsureNotes: events.filter((e: any, i: number) => e.type === 'note' && unsure[i]).length, unsureRight: 0
	};
	keep(keepDir, `${label}.line.json`, c);
	console.log(lineOf(c));
}

function total(keepDir: string): void {
	const files = fs.readdirSync(keepDir).filter((f) => f.endsWith('.line.json')).sort();
	if (files.length === 0) fail(`no line files in ${keepDir}`);
	const all: Counts[] = files.map((f) => JSON.parse(fs.readFileSync(path.join(keepDir, f), 'utf8')));
	const sum = (k: keyof Counts) => all.reduce((a, c) => a + (c[k] as number), 0);
	const withMetre = all.filter((c) => c.metre);
	const paths = [...new Set(all.map((c) => c.path))].join(' and ');
	const below = all.filter((c) => {
		const p = c.printed - c.unsureNotes;
		return p <= 0 || rounded((100 * (c.right - c.unsureRight - c.extra)) / p) < PASS_AT;
	}).length;
	const parts = [
		`Total of ${all.length} songs: ${paths}`,
		`${sum('right')} of ${sum('printed')} right`,
		`missing ${sum('missing')}`,
		`extra ${sum('extra')}`,
		`pitch misreads ${sum('pitchMisreads')}`,
		`length misreads ${sum('lengthMisreads')}`,
		`bars read ${sum('barsRead')} of ${sum('barsPrinted')}`
	];
	if (withMetre.length > 0) {
		const r = withMetre.reduce((a, c) => a + c.metre!.right, 0);
		const p = withMetre.reduce((a, c) => a + c.metre!.paired, 0);
		parts.push(`metre as printed ${r} of ${p} bars in ${withMetre.length} songs`);
	}
	parts.push(`score ${scoreText(sum('right'), sum('extra'), sum('printed'))}`);
	parts.push(`with ${sum('unsureNotes')} notes marked UNSURE set aside ${scoreText(sum('right') - sum('unsureRight'), sum('extra'), sum('printed') - sum('unsureNotes'))}`);
	parts.push(`songs below 95.0 with UNSURE set aside: ${below} of ${all.length}`);
	console.log(parts.join('; '));
}

async function main(): Promise<void> {
	const [mode, ...rest] = process.argv.slice(2);
	if (mode === 'song' && rest.length === 5) await song(rest[0], rest[1], rest[2], rest[3], rest[4]);
	else if (mode === 'refused' && rest.length >= 3) refused(rest[0], rest[1], rest[2], rest.slice(3).join(' '));
	else if (mode === 'total' && rest.length === 1) total(rest[0]);
	else fail('usage: final-line.ts song <label> <path> <truth.json> <read.json> <keepDir> | refused <label> <truth.json> <keepDir> <reason...> | total <keepDir>');
}

main().catch((e) => fail(String(e?.stack ?? e)));
