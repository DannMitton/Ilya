<!--
	THE CHART'S DRAWING (N.199 Step 2; the sheet draws with it now, `VowelChart.svelte` will in Step 4a). One SVG group of layers
	for a view: the vowels' zones (flat, translucent, one colour each, no outline), the grid over them, the hull of what is sung,
	the placeholders (hollow, with their symbol), and the sung dots (filled, with their symbol). Nothing here animates and nothing
	here judges: the view is handed in (`geometry.ts`), and a zone is a neighbourhood, never a goal (brief section 1).

	Ruled by Dann 2026-11-12, entries 19 to 22: the zones are flat fills with no outline, the grid shows over them, the chart is
	coded to Voice (lavender) and the symbols are Lato IPA. The overlap is wanted, so zones blend by multiplication.
-->
<script lang="ts">
	import type { Vowel } from '../engine/types';
	import { project, hull, gridTicks, type View } from './geometry';
	import type { PlaceholderDot, SungDot, Zone } from './zones';
	import { zoneColour } from './colours';
	import { placeLabels, type LabelAnchor } from './labels';

	let {
		view,
		width,
		height,
		zones,
		placeholders,
		sung,
		active = null,
		hullDashed,
		symbolSize = 18,
		labelSize = 11,
		axisWords = null
	}: {
		view: View;
		width: number;
		height: number;
		zones: Zone[];
		placeholders: PlaceholderDot[];
		sung: SungDot[];
		/** The vowel being measured: its zone takes a deeper saturation. */
		active?: Vowel | null;
		/** The hull is dashed until all ten are sung. */
		hullDashed: boolean;
		/** Pixel size of the IPA symbols, in the SVG's own units. */
		symbolSize?: number;
		/** Pixel size of the grid's numbers. */
		labelSize?: number;
		/** The words for the axes, drawn small inside the frame's edges (the capture chart; the sheet draws its own outside). Absent: none. */
		axisWords?: { front: string; back: string; open: string } | null;
	} = $props();

	const r1 = (n: number) => Math.round(n * 10) / 10;
	const SEMITONE = Math.log(2) / 12;
	const PERSONAL: readonly Vowel[] = ['ɪ', 'ɨ', 'a', 'ʌ'];

	const ellipses = $derived(
		zones.map((z) => {
			const c = project(view, width, height, Math.sqrt(z.f1Low * z.f1High), z.f2Centre);
			const spanU = view.u0 - view.u1;
			const spanV = view.v1 - view.v0;
			const rx = (width * z.f2HalfSpanSemitones * SEMITONE) / spanU;
			const ry = (height * (Math.log(z.f1High) - Math.log(z.f1Low))) / 2 / spanV;
			// Board D's opacities: 0.24 for a Bozeman zone, 0.30 for a personal one on the guard's window, 0.15 on a placeholder; 0.5 when active.
			const op = z.vowel === active ? 0.5 : PERSONAL.includes(z.vowel) ? (z.basis === 'guard' ? 0.3 : 0.15) : 0.24;
			return { vowel: z.vowel, cx: r1(c.x), cy: r1(c.y), rx: r1(rx), ry: r1(ry), fill: zoneColour(z.vowel), op };
		})
	);
	const grid = $derived(gridTicks(view, width, height));
	const cols = $derived(grid.f2.map((f) => ({ f, x: r1(project(view, width, height, 1, f).x) })).filter((c) => c.x > 0 && c.x < width));
	const rows = $derived(grid.f1.map((f) => ({ f, y: r1(project(view, width, height, f, 1).y) })).filter((r) => r.y > 0 && r.y < height));
	const dots = $derived(
		sung.map((s) => {
			const hasF2 = typeof s.f2 === 'number' && s.f2 > 0;
			const p = project(view, width, height, s.f1, hasF2 ? s.f2! : 1);
			return { vowel: s.vowel, hasF2, x: r1(p.x), y: r1(p.y) };
		})
	);
	const ghosts = $derived(
		placeholders.map((p) => {
			const q = project(view, width, height, p.f1, p.f2);
			return { vowel: p.vowel, x: r1(q.x), y: r1(q.y) };
		})
	);
	// Where each symbol goes: four places round its dot, the first clear of every dot and every symbol already set (`labels.ts`).
	const labelAt = $derived.by(() => {
		const anchors: LabelAnchor[] = [];
		for (const d of dots) {
			const e = ellipses.find((q) => q.vowel === d.vowel);
			anchors.push(d.hasF2 ? { id: d.vowel, x: d.x, y: d.y, r: 6 } : { id: d.vowel, x: e ? e.cx : d.x, y: d.y, r: 0 });
		}
		for (const g of ghosts) anchors.push({ id: g.vowel, x: g.x, y: g.y, r: 5.5 });
		return new Map(placeLabels(anchors, symbolSize, { w: width, h: height }).map((l) => [l.id, l]));
	});
	const outline = $derived(
		hull(dots.filter((d) => d.hasF2).map((d) => [d.x, d.y] as [number, number])).map((p) => `${r1(p[0])},${r1(p[1])}`).join(' ')
	);
	// The bar for a reading with no fR2: across its own zone at its fR1.
	const bars = $derived(
		dots
			.filter((d) => !d.hasF2)
			.map((d) => {
				const e = ellipses.find((q) => q.vowel === d.vowel);
				return e ? { vowel: d.vowel, x1: r1(e.cx - e.rx), x2: r1(e.cx + e.rx), y: d.y } : null;
			})
			.filter((b): b is { vowel: Vowel; x1: number; x2: number; y: number } => b !== null)
	);
</script>

<g class="layers">
	<g class="zones">
		{#each ellipses as e (e.vowel)}
			<ellipse cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} style="fill: {e.fill}; fill-opacity: {e.op}; mix-blend-mode: multiply" data-zone={e.vowel} />
		{/each}
	</g>
	<g class="grid" aria-hidden="true">
		{#each cols as c (c.f)}
			<line x1={c.x} y1="0" x2={c.x} y2={height} />
		{/each}
		{#each rows as r (r.f)}
			<line x1="0" y1={r.y} x2={width} y2={r.y} />
		{/each}
	</g>
	{#if outline}
		<polygon class="hull" class:dashed={hullDashed} points={outline} />
	{/if}
	{#each bars as b (b.vowel)}
		<line class="bar" x1={b.x1} y1={b.y} x2={b.x2} y2={b.y} />
	{/each}
	<g class="placeholders">
		{#each ghosts as g (g.vowel)}
			<circle class="ghost" cx={g.x} cy={g.y} r="5.5" data-placeholder={g.vowel} />
			<text class="sym ghost-sym" x={labelAt.get(g.vowel)?.x ?? g.x} y={labelAt.get(g.vowel)?.y ?? g.y} font-size={symbolSize} text-anchor="middle" dominant-baseline="central">{g.vowel}</text>
		{/each}
	</g>
	<g class="dots">
		{#each dots as d (d.vowel)}
			{#if d.hasF2}
				<circle class="dot" cx={d.x} cy={d.y} r="6" data-sung={d.vowel} />
			{/if}
			<text class="sym dot-sym" x={labelAt.get(d.vowel)?.x ?? d.x} y={labelAt.get(d.vowel)?.y ?? d.y} font-size={symbolSize} text-anchor="middle" dominant-baseline="central">{d.vowel}</text>
		{/each}
	</g>
	{#if axisWords}
		<!-- The axis words, small, in the grid's grey, inside the frame so the chart's height does not change (Step 6b). fR2 runs across, fR1 down. -->
		<g class="axis-words" aria-hidden="true" font-size={labelSize + 1}>
			<text x="5" y={height - 5} text-anchor="start">{axisWords.front}</text>
			<text x={width - 5} y={height - 5} text-anchor="end">{axisWords.back}</text>
			<text x={width / 2} y={height - 5} text-anchor="middle"><tspan font-style="italic">f</tspan><tspan class="sub" dy="2">R2</tspan></text>
			<text transform="translate({width - 5} {height / 2}) rotate(90)" text-anchor="middle"><tspan font-style="italic">f</tspan><tspan class="sub" dy="2">R1</tspan><tspan dy="-2"> {axisWords.open}</tspan></text>
		</g>
	{/if}
	<g class="numbers" aria-hidden="true" font-size={labelSize}>
		{#each cols as c (c.f)}
			<text x={c.x} y={labelSize + 1} text-anchor="middle">{c.f}</text>
		{/each}
		{#each rows as r (r.f)}
			<text x="3" y={r.y - 3} text-anchor="start">{r.f}</text>
		{/each}
	</g>
</g>

<style>
	.grid line {
		stroke: var(--stone-300, #d6d3d1);
		stroke-width: 1;
	}
	.hull {
		fill: color-mix(in srgb, var(--lavender-jewel) 6%, transparent);
		stroke: var(--lavender-jewel);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.hull.dashed {
		stroke-dasharray: 5 4;
	}
	.bar {
		stroke: var(--lavender-jewel);
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.ghost {
		fill: var(--paper-light, #f5f1e8);
		stroke: var(--lavender-jewel);
		stroke-width: 1.5;
		stroke-dasharray: 2.5 2;
	}
	.dot {
		fill: var(--lavender-jewel);
		stroke: var(--paper-light, #f5f1e8);
		stroke-width: 1.5;
	}
	.sym {
		font-family: 'Lato IPA', 'Source Sans 3', sans-serif;
		line-height: 1;
	}
	.ghost-sym {
		fill: var(--ink-tertiary);
	}
	.dot-sym {
		fill: var(--ink-primary);
	}
	.axis-words text {
		fill: var(--ink-tertiary);
		font-family: var(--font-sans);
		paint-order: stroke;
		stroke: color-mix(in srgb, var(--paper-light, #f5f1e8) 85%, transparent);
		stroke-width: 3px;
	}
	.axis-words .sub {
		font-size: 0.78em;
		font-variant-caps: all-small-caps;
		letter-spacing: 0.02em;
	}
	.numbers text {
		fill: var(--ink-tertiary);
		font-family: var(--font-sans);
		paint-order: stroke;
		stroke: color-mix(in srgb, var(--paper-light, #f5f1e8) 75%, transparent);
		stroke-width: 3px;
	}
</style>
