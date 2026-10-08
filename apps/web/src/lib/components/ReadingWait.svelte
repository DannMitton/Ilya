<!--
	ReadingWait: the wait for the reader, drawn on the Paper
	(`brief-code-wait-on-the-paper_r1_2026-10-07.md`, QUEUE row 41).

	A squircle that floats above the sheet on Text, Markup, and Insights,
	centred on the visible part of the desk's scroll region. It is a layer like
	the Loupe, and like the Loupe it never prints (CONTRACT.md section 6) and
	never changes the Paper's layout: it is `position: fixed`, placed from the
	desk's own rectangle.

	It is mounted by `DeskHead`, which every destination already draws inside
	the desk, because `+page.svelte` and `ScoreUploader.svelte` sit at their
	line ceilings (`scripts/ratchets.json`).

	The words are translated here, at render, from numbers held in
	`readingWait` (N.167), so a language switch mid-wait changes the line.
-->
<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import type { TabId } from '$lib/destinations';
	import { waitColours, waitLine } from '$lib/omr/wait';
	import { readingWait } from '$lib/score/reading-wait.svelte';

	interface Props {
		activeTab: TabId;
		language: Language;
	}
	let { activeTab, language }: Props = $props();

	const colours = $derived(waitColours(activeTab));
	const shown = $derived(readingWait.visible && colours !== null);
	const line = $derived(waitLine(readingWait.state, language));
	/** On Text a tap tucks the squircle to the bottom of the sheet; elsewhere a tap does nothing. */
	const tappable = $derived(activeTab === 'text');
	let tucked = $state(false);

	/* The desk's visible rectangle, which the squircle is centred on. */
	let host = $state<HTMLElement | null>(null);
	let rect = $state({ left: 0, top: 0, width: 0, height: 0 });
	/* The tucked card rests above the phone's Drawer bar, which paints over the desk's foot. */
	let restGap = $state(24);
	onMount(() => {
		const desk = host?.closest('.main-content') as HTMLElement | null;
		if (!desk) return;
		const measure = () => {
			const r = desk.getBoundingClientRect();
			rect = { left: r.left, top: r.top, width: r.width, height: r.height };
			restGap = window.innerWidth < 768 ? 104 : 24;
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(desk);
		window.addEventListener('resize', measure);
		return () => {
			ro.disconnect();
			window.removeEventListener('resize', measure);
		};
	});
	/* A new wait starts centred. */
	$effect(() => {
		if (!readingWait.active) untrack(() => (tucked = false));
	});

	/* One polite announcement per page number, not per stage or per language-neutral tick. */
	let announced = $state('');
	$effect(() => {
		const page = readingWait.state.page;
		const text = untrack(() => waitLine(readingWait.state, language));
		if (shown && page > 0) announced = text;
		else if (!readingWait.active) announced = '';
	});
	$effect(() => {
		// A language switch re-says the current line once.
		language;
		untrack(() => {
			if (shown && readingWait.state.page > 0) announced = waitLine(readingWait.state, language);
		});
	});

	const pos = $derived(
		tucked
			? `left:${rect.left + rect.width / 2}px; top:${rect.top + rect.height - restGap}px; transform:translate(-50%,-100%);`
			: `left:${rect.left + rect.width / 2}px; top:${rect.top + rect.height / 2}px; transform:translate(-50%,-50%);`,
	);
	const style = $derived(
		`${pos} max-width:${Math.max(0, rect.width - 32)}px; --wait-fill:${colours?.fill}; --wait-ink:${colours?.ink};`,
	);
	const clip = $derived(`inset(0 ${(1 - readingWait.state.fill) * 100}% 0 0)`);
	const STAFF_Y = [1, 4, 7, 10, 13];
</script>

<span bind:this={host} class="wait-host" aria-hidden="true"></span>
<div class="wait-live" role="status" aria-live="polite">{announced}</div>

{#if shown}
	<svelte:element
		this={tappable ? 'button' : 'div'}
		class="reading-wait"
		class:leaving={readingWait.leaving}
		class:tucked
		class:tappable
		type={tappable ? 'button' : undefined}
		aria-hidden={tappable ? undefined : 'true'}
		aria-label={tappable ? line : undefined}
		onclick={tappable ? () => (tucked = !tucked) : undefined}
		{style}
		data-tab={activeTab}
	>
		<span class="wait-line">{line}</span>
		<svg class="wait-staff" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true">
			<g class="rest">
				{#each STAFF_Y as y}<line x1="0" x2="100" y1={y} y2={y} />{/each}
			</g>
			<g class="done" style:clip-path={clip}>
				{#each STAFF_Y as y}<line x1="0" x2="100" y1={y} y2={y} />{/each}
			</g>
		</svg>
		<span class="wait-once">{t('wait.once', language)}</span>
	</svelte:element>
{/if}

<style>
	.wait-host {
		display: none;
	}
	.wait-live {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.reading-wait {
		position: fixed;
		z-index: 9000;
		box-sizing: border-box;
		width: 26rem;
		min-height: 44px;
		margin: 0;
		padding: 0.9rem 1.5rem 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
		text-align: center;
		font: inherit;
		color: var(--wait-ink);
		background: var(--wait-fill);
		border: 0;
		border-radius: var(--float-radius, 10px);
		box-shadow: var(--float-shadow);
		transition:
			top 240ms ease,
			opacity 300ms ease;
		animation: wait-in 180ms ease-out;
	}
	.reading-wait.tappable {
		cursor: pointer;
	}
	.reading-wait.leaving {
		opacity: 0;
	}
	.wait-line {
		font-size: 1.05rem;
		line-height: 1.3;
	}
	.wait-once {
		font-size: 0.85rem;
		font-style: italic;
		line-height: 1.3;
		opacity: 0.85;
	}
	.reading-wait.tucked .wait-once {
		display: none;
	}
	.wait-staff {
		width: 70%;
		height: 1.2rem;
		overflow: visible;
	}
	.wait-staff line {
		stroke: var(--wait-ink);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}
	.wait-staff .rest {
		opacity: 0.25;
	}
	.wait-staff .done {
		transition: clip-path 400ms linear;
	}
	@keyframes wait-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.reading-wait,
		.wait-staff .done {
			transition: none;
			animation: none;
		}
	}
	@media print {
		.reading-wait,
		.wait-live {
			display: none;
		}
	}
</style>
