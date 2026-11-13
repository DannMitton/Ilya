<!--
	THE SIDE VIEW, ONE <svg> (N.199 Step 6b). The fixed group is drawn once; the ten moving groups are stacked and cross-faded, so the picture changes in
	place as the selection moves (Dann 2026-11-12, entry 41). The line is `currentColor`, set here to the Voice family's ink (`--lavender-ink`) and widened for
	the squircle it sits in: the files carry a stroke of 4 (3 for the dotted line) in a 544-unit box, which renders at 0.68 px (0.51 px dotted) on a
	phone, so the stroke is 7 and 6 here: 1.19 px and 1.02 px on a phone, 1.45 px and 1.24 px in the Drawer on desktop (measured, Step 6b report). The drawings
	are read at build time (`import.meta.glob`, `?raw`) and drawn as markup, never fetched, so they are there offline.
-->
<script lang="ts">
	import type { Vowel } from '../engine/types';
	import { VOWELS } from '../engine/types';
	import { buildSagittal } from './drawings';

	let { selected }: { selected: Vowel } = $props();

	const files = import.meta.glob('./sagittal/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
	const byName: Record<string, string> = {};
	for (const [path, svg] of Object.entries(files)) byName[path.split('/').pop()!] = svg;
	const drawing = buildSagittal(byName);
</script>

<svg class="sagittal" viewBox={drawing.viewBox} fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
	<g class="fixed">{@html drawing.fixed}</g>
	{#each VOWELS as v (v)}
		<g class="moving" data-drawing={v} style="opacity: {v === selected ? 1 : 0}">{@html drawing.moving[v]}</g>
	{/each}
</svg>

<style>
	.sagittal {
		display: block;
		width: 100%;
		height: 100%;
		color: var(--lavender-ink);
		overflow: visible;
	}
	.sagittal :global(path) {
		stroke-width: 7;
	}
	.sagittal :global(path[stroke-dasharray]) {
		stroke-width: 6;
	}
	.moving {
		transition: opacity 0.35s;
	}
	@media (prefers-reduced-motion: reduce) {
		.moving {
			transition: none;
		}
	}
</style>
