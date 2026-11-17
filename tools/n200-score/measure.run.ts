/**
 * The Step 3 runner (N.200 path picker brief r3): runs the synthetic set through the shipped and path pickers (and the sensitivity variants)
 * and writes one JSON file of rows per voice type, for `measure-core.ts`. Not a gate. Synthetic takes only; nothing from a real voice.
 *
 *   N200_SET=primary|held|third   which set (`fidelity-set.ts`: `PRIMARY`, `HELD_OUT`, `THIRD`); any other value throws
 *   N200_TYPE=0..4          one voice type (the five run in separate processes), or `all`
 *   N200_STEP5=1            primary set only: also read at a 5 ms step
 *   N200_OUT=<dir>          where the rows go (never into the repository)
 *   pnpm --filter @ilya/web exec vitest run --config ../../tools/n200-score/vitest.config.ts measure.run.ts
 */
import { test } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { runCapture, type CaptureOutcome } from '$lib/voice/engine/analyze';
import type { ExtractTrace } from '$lib/voice/engine/extract';
import { pathTracks, pathFromTracks, extractPath, choosePath, L9, L15 } from '$lib/voice/engine/path-extract';
import { SYNTH_SR } from '$lib/voice/engine/fry-synth';
import { takes, setByName, TYPES } from './fidelity-set';
import { runVariants } from './variants';
import type { MRow, PickerCell, PathCell, Variant } from './measure-core';

const SET = process.env.N200_SET ?? '', TYPE = process.env.N200_TYPE ?? 'all', OUT = process.env.N200_OUT ?? '', STEP5 = process.env.N200_STEP5 === '1';
const r1 = (v: number | null | undefined) => (v === null || v === undefined ? null : Math.round(v * 10) / 10);

const cell = (o: CaptureOutcome): PickerCell => o.outcome === 'reading'
	? { outcome: 'reading', f1: r1(o.formant.f1), f2: r1(o.formant.f2), reading: o.formant.reading, confidence: o.formant.confidence }
	: { outcome: o.outcome, f1: null, f2: null, reading: null, confidence: null };

test.skipIf(!SET || !OUT)('measure the path picker on the synthetic set', () => {
	const opts = setByName(SET);
	const rows: MRow[] = [];
	const want = TYPE === 'all' ? null : TYPES[Number(TYPE)];
	for (const t of takes(opts)) {
		if (want && t.cell.type !== want) continue;
		const y = t.y, sr = SYNTH_SR, vowel = t.cell.vowel;
		const shipped = runCapture(y, sr, vowel, undefined, undefined, 'shipped');
		const trace: Partial<ExtractTrace> = {};
		const po = runCapture(y, sr, vowel, undefined, trace, 'path');
		const ev = trace.chosen?.path ?? null;
		const idx = ev && ev.ceiling !== null ? ev.ceilings.indexOf(ev.ceiling) : null;
		// The guard's stretch, as `runCapture` chose it, for the variants.
		const seg = po.outcome === 'error' ? undefined : po.guard?.segmentS;
		const yw = seg ? y.subarray(Math.round(seg[0] * sr), Math.round(seg[1] * sr)) : y;
		const variants: Record<string, Variant> = {};
		// Lane 64: every ladder and option combination from one set of tracks. A re-prompt is a miss in every variant.
		const v = po.outcome === 'reprompt' ? null : runVariants(yw, sr, true);
		if (SET !== 'third' && (po.outcome === 'reading' || po.outcome === 'reprompt')) {
			const tr = pathTracks(yw, sr);
			const pick = (name: string, tracks: ReturnType<typeof pathTracks>, o: Parameters<typeof choosePath>[1]) => {
				const c = choosePath(tracks, o);
				variants[name] = { ceiling: c.best >= 0 ? tracks[c.best].ceiling : null, f1: r1(c.f1), f2: r1(c.f2) };
			};
			pick('t1.0', tr, { t: 1.0 }); pick('t1.5', tr, { t: 1.5 }); pick('m4', tr, { terms: 4 });
			const e9 = extractPath(yw, sr, { ladder: L9 }).path!;
			variants.L9 = { ceiling: e9.ceiling, f1: r1(e9.pathF1), f2: r1(e9.pathF2) };
			if (STEP5) { const e5 = extractPath(yw, sr, { stepS: 0.005 }).path!; variants.step5ms = { ceiling: e5.ceiling, f1: r1(e5.pathF1), f2: r1(e5.pathF2) }; }
			// Cross-check on the stored tracks, without the check, to confirm `f2Check` off equals the path's own fR2 (the report reads pathF2 for it).
			void pathFromTracks;
		}
		const path: PathCell = {
			...cell(po), f2Quality: po.outcome === 'reading' ? po.formant.f2Quality ?? null : null,
			case: ev?.case ?? null, reason: ev?.reason ?? null, kept: ev ? ev.fR2Kept : null,
			pathF1: r1(ev?.pathF1), pathF2: r1(ev?.pathF2), pathF3: r1(ev?.pathF3),
			ceiling: ev?.ceiling ?? null, ceilingIdx: idx, ladderLen: L15.length, setAside: ev?.setAside ?? null, w: ev ? ev.w.map((v) => (v === null ? null : Math.round(v * 1e4) / 1e4)) : null, frames: ev?.frames ?? null,
		};
		rows.push({ idx: t.cell.idx, k: t.k, type: t.cell.type, vowel, pair: t.pair, truth: t.truth.map((v) => Math.round(v * 10) / 10), shipped: cell(shipped), path, variants, v });
	}
	mkdirSync(OUT, { recursive: true });
	writeFileSync(path.join(OUT, `rows-${SET}-${TYPE}.json`), JSON.stringify(rows));
	console.log(`${rows.length} rows -> ${OUT}`);
}, 6 * 60 * 60 * 1000);
