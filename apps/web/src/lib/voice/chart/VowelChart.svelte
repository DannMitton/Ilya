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
	import { labelSizeFor, type View } from './geometry';
	import { chartPoint, vowelForTap } from './tap';
	import { CHART_W, CHART_H, type ChartModel } from './model';
	import ChartLayers from './ChartLayers.svelte';
	import { tv, type Language } from '$lib/i18n';

	let {
		model,
		view,
		language,
		active = null,
		onFocus
	}: {
		model: ChartModel;
		view: View;
		language: Language;
		/** The vowel being measured: its zone takes a deeper saturation. */
		active?: Vowel | null;
		/** A tap inside one or more zones focuses the vowel whose dot is nearest (`tap.ts`). Absent: the chart takes no taps. */
		onFocus?: (vowel: Vowel) => void;
	} = $props();

	// The chart scales to the width it is given, so a symbol sized in its own units shrinks on a phone. The grid's numbers and the axis words are sized
	// to hold 11 CSS px at any width (Step 6b amendment): the unit size is 11 times the ratio of the frame to the rendered width.
	let width = $state(0);
	const labelSize = $derived(labelSizeFor(CHART_W, width));

	/** A tap (a `click`, never `pointerdown` or `touchstart`: the chart sits where a thumb scrolls, and a scroll that starts on it must not change the focus). */
	function tapped(ev: MouseEvent) {
		if (!onFocus) return;
		const p = chartPoint(ev.clientX, ev.clientY, (ev.currentTarget as SVGRectElement).ownerSVGElement!.getBoundingClientRect(), CHART_W, CHART_H);
		if (!p) return;
		// Read against the view as it stands at this instant: it may be mid-glide.
		const v = vowelForTap(p.x, p.y, view, CHART_W, CHART_H, model.zones, model.sung, model.placeholders);
		if (v) onFocus(v);
	}
</script>

<svg class="vowel-chart" bind:clientWidth={width} viewBox="0 0 {CHART_W} {CHART_H}" role="img" aria-label={tv('capture.chartAlt', language)} preserveAspectRatio="xMidYMid meet">
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
		{labelSize}
	/>
	<rect x="0.6" y="0.6" width={CHART_W - 1.2} height={CHART_H - 1.2} class="frame" />
	<!-- The tap layer: hidden from assistive technology and out of the tab order. The ten buttons are the keyboard and screen-reader path to the same act. -->
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<rect x="0" y="0" width={CHART_W} height={CHART_H} class="tap-layer" aria-hidden="true" onclick={tapped} />
</svg>

<style>
	.vowel-chart {
		display: block;
		width: 100%;
		height: auto;
		/* A tap on the chart focuses a vowel (`tap.ts`); it must not select text. */
		user-select: none;
	}
	.ground {
		fill: var(--paper-light, #f5f1e8);
	}
	.tap-layer {
		fill: transparent;
		cursor: pointer;
	}
	.frame {
		fill: none;
		stroke: var(--ink-stave);
		stroke-width: 1.25;
	}
</style>
