/**
 * Approval (golden-master) tests for `renderAnalyzedStaff`
 * (`staff-renderer.ts`, 3,534 lines; one function carries cyclomatic
 * complexity 244 per the audit brief). These tests make no claim about
 * correctness: they pin TODAY'S exact SVG output of the renderer's public
 * entry point against the shared demo fixture (`demo-fixture.ts`), so a
 * later refactor cannot change that output unnoticed. A diff here means
 * the renderer's output changed; it does not by itself mean the change is
 * wrong.
 *
 * Fixture source: `demo-fixture.ts`'s `demoScore()`, already used by
 * `staff-renderer.test.ts` (2,417 lines of string assertions against the
 * same fixture). Per that file's own header, it exercises rhythmic
 * spacing, barlines, accidentals (sung and turning layers, with the
 * measure-opening nudge), rests, flags, derived-by-beat beaming (primary,
 * secondary, and the timbre-change break), a bracketed triplet, turning
 * accidental carry, a melisma with an interior tie, and all four
 * analytical marks plus the `#` phonation break.
 *
 * Three fixture variants (`renderDemo`, `renderDemoDotted`,
 * `renderDemoUnmeasured`) each rendered in both supported modes
 * (primitive shapes, the sandbox default; and SMuFL glyph mode against
 * `syntheticSmuflFont()`), for six approved SVG snapshots.
 *
 * Determinism: `demoScore()` supplies no randomness, and every call in
 * `demo-fixture.ts` passes a fixed `generatedAt` ('2026-07-12T00:00:00.000Z')
 * into `analyzeScore`, which is the only place `overlay-engine.ts` would
 * otherwise default to `new Date().toISOString()`
 * (overlay-engine.ts:243). No other source of non-determinism (no
 * `Math.random`, no `crypto.randomUUID`) is reachable from
 * `renderAnalyzedStaff` itself: `syllableId()` (musicxml-parser.ts:268,
 * mnx-parser.ts:251) is a PARSER concern, not called by the renderer, and
 * `demo-fixture.ts`'s events carry hand-assigned syllable ids
 * (`s-n1`, `s-n2`, ...), never generated ones. So these snapshots need no
 * normalization.
 */

import { describe, expect, it } from 'vitest';
import {
	renderDemo,
	renderDemoDotted,
	renderDemoUnmeasured,
	syntheticSmuflFont,
} from '../demo-fixture';
import type { StaffRenderOptions } from '../staff-renderer';

const font = syntheticSmuflFont();

const variants: Array<[string, (options?: StaffRenderOptions) => string]> = [
	['renderDemo', renderDemo],
	['renderDemoDotted', renderDemoDotted],
	['renderDemoUnmeasured', renderDemoUnmeasured],
];

describe('staff-renderer approval: demo fixture (primitive mode)', () => {
	for (const [name, render] of variants) {
		it(`renders ${name} identically to the approved SVG`, async () => {
			const svg = render();
			await expect(svg).toMatchFileSnapshot(`./__approved__/${name}.primitive.svg`);
		});
	}
});

describe('staff-renderer approval: demo fixture (SMuFL mode)', () => {
	for (const [name, render] of variants) {
		it(`renders ${name} identically to the approved SVG`, async () => {
			const svg = render({ font });
			await expect(svg).toMatchFileSnapshot(`./__approved__/${name}.smufl.svg`);
		});
	}
});
