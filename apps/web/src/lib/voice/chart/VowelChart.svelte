<!--
	THE CHART (N.199 Step 4a). The vowel space for one voice: fR2 across, high to low; fR1 down; a flat translucent zone for each of
	the ten vowels with no outline, the grid over them, a hollow placeholder with its symbol for every vowel not yet sung, a filled
	dot for every one that is, and the hull of what is sung (dashed until all ten are). It draws what it is handed: the `model`
	(`model.ts`) and the `view` (`geometry.ts`), so the screen can move the view in on a vowel and back out (Step 4c) and this stays
	the same drawing. A zone is a neighbourhood, never a goal; the chart says nothing about a reading beyond where it falls.

	It takes the width it is given: the SVG scales to its container, which is 484 px in the Drawer on desktop and the phone's width
	on a phone. Every unsung vowel carries its symbol (its placeholder's), so no zone is told apart by colour alone.
-->
<script lang="ts">
	import type { Vowel } from '../engine/types';
	import type { View } from './geometry';
	import { CHART_W, CHART_H, type ChartModel } from './model';
	import ChartLayers from './ChartLayers.svelte';
	import { tv, type Language } from '$lib/i18n';

	let {
		model,
		view,
		language,
		active = null
	}: {
		model: ChartModel;
		view: View;
		language: Language;
		/** The vowel being measured: its zone takes a deeper saturation. */
		active?: Vowel | null;
	} = $props();
</script>

<svg class="vowel-chart" viewBox="0 0 {CHART_W} {CHART_H}" role="img" aria-label={tv('capture.chartAlt', language)} preserveAspectRatio="xMidYMid meet">
	<rect x="0" y="0" width={CHART_W} height={CHART_H} class="ground" />
	<ChartLayers
		{view}
		width={CHART_W}
		height={CHART_H}
		zones={model.zones}
		placeholders={model.placeholders}
		sung={model.sung}
		{active}
		hullDashed={!model.allTen}
		axisWords={{ front: tv('sheet.axis.front', language), back: tv('sheet.axis.back', language), open: tv('sheet.axis.open', language) }}
		symbolSize={18}
		labelSize={11}
	/>
	<rect x="0.6" y="0.6" width={CHART_W - 1.2} height={CHART_H - 1.2} class="frame" />
</svg>

<style>
	.vowel-chart {
		display: block;
		width: 100%;
		height: auto;
		/* The chart is a drawing, not a control: a tap on it does nothing and must not select text. */
		user-select: none;
	}
	.ground {
		fill: var(--paper-light, #f5f1e8);
	}
	.frame {
		fill: none;
		stroke: var(--ink-stave);
		stroke-width: 1.25;
	}
</style>
