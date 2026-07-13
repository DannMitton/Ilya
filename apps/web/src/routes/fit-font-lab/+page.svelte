<!--
  Fit font lab — the in-browser three-font taste test (Kimi step 5,
  2026-07-12). DEV ROUTE: judges Bravura, Leland, and Finale Maestro on
  the shared demo fixture before the winner becomes the NotationPreferences
  default at live wiring. Not linked from the app shell.

  Each candidate is FontFace-loaded lazily, its SMuFL metadata prepared
  with Bravura as the fallback font (Kimi guardrail 1), and the demo
  rendered through the production `renderAnalyzedStaff` glyph mode.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { renderDemo, type PreparedSmuflFont } from '@ilya/score-parser';
	import { NOTATION_FONTS, loadNotationFont } from '$lib/shane/engine/notation-fonts';

	// The lab now loads through the shared notation-font loader (extracted
	// at font wiring, 2026-07-13), so the lab and the live pane cannot
	// drift: same files, same metadata, same Bravura-fallback guardrail.
	const CANDIDATES = NOTATION_FONTS;

	interface LoadedFont {
		prepared: PreparedSmuflFont;
		svg: string;
	}

	let fonts = $state<Record<string, LoadedFont>>({});
	// Finale Maestro is the product default (Dann's ruling, 2026-07-12);
	// Bravura and Leland remain as user customization options.
	let selected = $state('finale-maestro');
	let compare = $state(false);
	let status = $state('Loading fonts…');
	let error = $state('');

	onMount(async () => {
		try {
			for (const c of CANDIDATES) {
				status = `Loading ${c.label}…`;
				const { prepared, family } = await loadNotationFont(c.id);
				fonts[c.id] = { prepared, svg: renderDemo({ font: prepared, fontFamily: family }) };
			}
			status = '';
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
			status = '';
		}
	});
</script>

<svelte:head>
	<title>Fit font lab</title>
</svelte:head>

<main class="lab">
	<h1>Fit font lab</h1>
	<p class="lab-note">
		The shared demo phrase rendered by the production staff renderer in each SMuFL candidate.
		Same layout engine, same analytical marks; only the font and its engraving metadata change.
		Judge the clef, noteheads, accidentals (including the sage turning layer), flags, rests, and beams.
	</p>

	{#if status}<p class="lab-status">{status}</p>{/if}
	{#if error}<p class="lab-error">Could not load fonts: {error}</p>{/if}

	<div class="lab-controls">
		{#each CANDIDATES as c (c.id)}
			<button
				class="lab-chip"
				class:active={selected === c.id && !compare}
				disabled={!fonts[c.id]}
				onclick={() => { selected = c.id; compare = false; }}
			>{c.label}</button>
		{/each}
		<button class="lab-chip" class:active={compare} onclick={() => (compare = !compare)}>Compare all</button>
	</div>

	{#if compare}
		{#each CANDIDATES as c (c.id)}
			{#if fonts[c.id]}
				<section class="lab-card">
					<h2>{c.label}</h2>
					{#if fonts[c.id].prepared.warnings.length > 0}
						<p class="lab-warnings">Loader fallbacks: {fonts[c.id].prepared.warnings.join('; ')}</p>
					{/if}
					<div class="lab-score">{@html fonts[c.id].svg}</div>
				</section>
			{/if}
		{/each}
	{:else if fonts[selected]}
		<section class="lab-card">
			<h2>{CANDIDATES.find((c) => c.id === selected)?.label}</h2>
			{#if fonts[selected].prepared.warnings.length > 0}
				<p class="lab-warnings">Loader fallbacks: {fonts[selected].prepared.warnings.join('; ')}</p>
			{/if}
			<div class="lab-score">{@html fonts[selected].svg}</div>
		</section>
	{/if}
</main>

<style>
	.lab {
		max-width: 1100px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
		font-family: 'Source Serif 4', Georgia, serif;
		color: #1a1612;
	}

	.lab h1 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.lab-note {
		max-width: 62ch;
		line-height: 1.55;
		color: #4a4540;
		margin-bottom: 1.5rem;
	}

	.lab-status,
	.lab-error {
		font-style: italic;
		color: #4a4540;
	}

	.lab-error {
		color: #b23b3b;
	}

	.lab-controls {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
	}

	.lab-chip {
		border: 1px solid #ddd9d4;
		background: #f9f7f5;
		border-radius: 999px;
		padding: 0.35rem 1rem;
		font: inherit;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.lab-chip.active {
		background: #1a1612;
		color: #f9f7f5;
		border-color: #1a1612;
	}

	.lab-chip:disabled {
		opacity: 0.45;
		cursor: default;
	}

	.lab-card {
		margin-bottom: 2rem;
	}

	.lab-card h2 {
		font-size: 1.1rem;
		margin-bottom: 0.5rem;
	}

	.lab-warnings {
		font-size: 0.85rem;
		color: #8a6d3b;
		margin-bottom: 0.5rem;
	}

	.lab-score {
		border: 1px solid #ddd9d4;
		border-radius: 6px;
		overflow-x: auto;
	}

	.lab-score :global(svg) {
		display: block;
		min-width: 1038px;
	}
</style>
