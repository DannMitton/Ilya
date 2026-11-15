/**
 * What the chart draws for one voice, in one object (N.199 Step 4a): the zones, the placeholder dots, the sung dots, the full
 * view that holds them all, and whether all ten are sung. The sheet (`VowelSpaceSheet.svelte`) and the capture screen
 * (`VowelCapture.svelte`) both build theirs here, so the two cannot disagree about what a voice looks like.
 */
import type { CalibratedFormant, Vowel } from '../engine/types';
import { VOWELS } from '../engine/types';
import { computeZones, sungDots, type PlaceholderDot, type SungDot, type Zone } from './zones';
import { fullView, type View } from './geometry';

/** The capture chart's own frame, in its viewBox units (board D's, 484 by 280); the SVG scales to the width it is given. */
export const CHART_W = 484;
export const CHART_H = 280;

export interface ChartModel {
	zones: Zone[];
	placeholders: PlaceholderDot[];
	sung: SungDot[];
	/** Every zone, placeholder, and reading of this voice in view, with a margin. */
	full: View;
	/** All ten sung: the hull is drawn whole. */
	allTen: boolean;
}

export function buildChartModel(profile: Partial<Record<Vowel, CalibratedFormant>>, voiceType?: string): ChartModel {
	const { zones, placeholders } = computeZones(profile, voiceType);
	const sung = sungDots(profile);
	return { zones, placeholders, sung, full: fullView(zones, [...placeholders, ...sung]), allTen: sung.length === VOWELS.length };
}
