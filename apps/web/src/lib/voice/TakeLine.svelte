<!--
	THE TAKE LINE (N.203 lane 59 Step 3). One line for a whole take, in named parts, in proportion: Breathe, Sing, Shape, Fry for a vowel (2, 4, 2, 4).
	It replaces the single bar and the spoken count (Dann 2026-11-15 18:54, 2026-11-16 00:42). It is presentational: it owns no clock and reads no
	session. The ritual drives it here; lane 60's test fry drives it from its own clock with three parts (Quiet, Breathe, Fry), and imports it
	without editing it.

	One `role="progressbar"` for the whole take; `aria-valuetext` is the current part's label. The labels stay whole at 390 px in French: each part
	is a grid column that is at least as wide as its own label, so a narrow part grows past its share rather than clipping its word (the line's
	proportions bend a little, and no label is cut or overlaps). `holding` is the wait for steady fry: the fill pulses slowly, and under reduced
	motion it takes a distinct static fill, so a hold of up to 10 s does not read as a frozen screen.
-->
<script lang="ts">
	import { partFills, overallPercent, type TakePart } from './take-line';

	let {
		parts,
		current,
		within,
		holding = false,
		label,
		reducedMotion = false
	}: {
		parts: readonly TakePart[];
		/** The id of the part the take is in, or null before it begins. */
		current: string | null;
		/** How far through that part, 0 to 1. */
		within: number;
		/** The wait for steady fry: the current part is held, not advancing. */
		holding?: boolean;
		/** The progressbar's accessible name. */
		label: string;
		reducedMotion?: boolean;
	} = $props();

	const fills = $derived(partFills(parts, current, within));
	const percent = $derived(overallPercent(parts, current, within));
	const currentLabel = $derived(parts.find((p) => p.id === current)?.label ?? '');
	const columns = $derived(parts.map((p) => `minmax(min-content, ${p.weight}fr)`).join(' '));
</script>

<div
	class="take-line"
	class:holding
	class:reduced={reducedMotion}
	role="progressbar"
	aria-label={label}
	aria-valuemin="0"
	aria-valuemax="100"
	aria-valuenow={percent}
	aria-valuetext={currentLabel}
	style="grid-template-columns: {columns}"
>
	{#each parts as p, i (p.id)}
		<div class="part" class:current={p.id === current} class:done={fills[i] === 1} data-part={p.id}>
			<div class="track"><div class="fill" style="width: {Math.round(fills[i] * 100)}%"></div></div>
			<span class="name">{p.label}</span>
		</div>
	{/each}
</div>

<style>
	.take-line {
		display: grid;
		gap: 4px;
		width: 100%;
	}
	.part {
		min-width: 0;
	}
	.track {
		height: 8px;
		border-radius: 4px;
		background: var(--lavender-desk);
		overflow: hidden;
	}
	.fill {
		height: 8px;
		background: var(--lavender-jewel);
		transition: width 0.06s linear;
	}
	.name {
		display: block;
		margin-top: 0.2rem;
		white-space: nowrap;
		font-size: 0.75rem;
		line-height: 1.3;
		color: var(--ink-tertiary);
	}
	.part.current .name {
		color: var(--ink-primary);
		font-weight: 600;
	}
	.holding .part.current .fill {
		animation: listening 1.6s ease-in-out infinite;
	}
	@keyframes listening {
		50% {
			opacity: 0.45;
		}
	}
	/* Under reduced motion the wait has no pulse: a distinct static fill instead (stripes), and the fill does not slide. */
	.reduced .fill {
		transition: none;
	}
	.reduced.holding .part.current .fill {
		animation: none;
		background: repeating-linear-gradient(135deg, var(--lavender-jewel) 0 4px, var(--lavender-wash) 4px 8px);
	}
	@media (prefers-reduced-motion: reduce) {
		.fill {
			transition: none;
		}
		.holding .part.current .fill {
			animation: none;
			background: repeating-linear-gradient(135deg, var(--lavender-jewel) 0 4px, var(--lavender-wash) 4px 8px);
		}
	}
</style>
