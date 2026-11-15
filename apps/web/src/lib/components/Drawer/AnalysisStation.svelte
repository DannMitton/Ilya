<script lang="ts">
	/**
	 * ANALYSIS's body, the transcription's own console. N.201: ANALYSIS is its
	 * own band after INPUT (`Drawer.svelte`), so this draws no header, and the
	 * "171ms" timing that sat at its head is gone. NOTATION is the band's
	 * first row (`NotationFields`), drawn by `+page.svelte`'s `analysisGroup`.
	 * The dictionary loading bar stays here.
	 */
	import type { Snippet } from 'svelte';
	import type { LoaderState } from '$lib/loader';
	import { t, type Language } from '$lib/i18n';

	interface Props {
		loaderState: LoaderState;
		language: Language;
		/** Whether a word is selected, so the inspector has something to draw. */
		showInspector: boolean;
		/** The inspector, wired in `+page.svelte` where its state lives. */
		consoleContent?: Snippet;
	}

	let {
		loaderState,
		language,
		showInspector,
		consoleContent,
	}: Props = $props();
</script>

<!-- N.201: THE BAND HEAD REPLACES THE STATION HEADER, and "171ms" LEAVES
     (brief r2 step 4.3; the machine's term, CONTRACT section 3 tether 22). ANALYSIS is
     a band after INPUT; this is its body, drawn under NOTATION. The
     dictionary loading bar stays here. -->
<div class="station console-section">
	<div class="station-body" id="station-analysis">
		{#if showInspector && consoleContent}
			{@render consoleContent()}
		{:else}
			<div class="console-placeholder-body">
				{#if loaderState.isLoading}
					<div class="dict-progress">
						<span class="dict-progress-text">{t('dict.loading', language)}</span>
						<div class="dict-progress-track">
							{#if loaderState.progress >= 0}
								<div
									class="dict-progress-fill"
									style="width: {Math.round(loaderState.progress * 100)}%"
								></div>
							{:else}
								<div class="dict-progress-fill indeterminate"></div>
							{/if}
						</div>
					</div>
				{:else}
					<p class="placeholder-hint">
						{t('console.selectWord', language)}
					</p>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	/* Twinned on `RootPanel`'s and `SongList`'s: the body is its own flex
	   column and the header is not in it, so the header's own gap is the whole
	   gap to the first entry. Dann's ruling 2 of 2026-08-20. */
	.station-body {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	/* Analysis takes the frame's station recipe and adds only
	   `overflow: visible`, which the Inspector needs. Its border and padding
	   used to be declared in `RootPanel`; they are `Drawer.svelte`'s
	   `.group :global(.station)` now. */
	.console-section {
		overflow: visible;
	}

	.console-placeholder-body {
		min-height: 365px;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 0 0.5rem;
	}

	.placeholder-hint {
		font-family: var(--font-serif);
		font-size: 0.8rem;
		font-style: italic;
		color: var(--ink-tertiary);
	}

	/* ── Dictionary progress bar (Kimi spec) ───────────────── */
	/* Copied with the markup. `RootPanel` keeps no copy: the progress bar is
	   drawn here and nowhere else. */

	.dict-progress {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
		width: 60%;
	}

	.dict-progress-text {
		font-size: 0.75rem;
		color: var(--ink-tertiary);
		font-family: var(--font-sans);
	}

	.dict-progress-track {
		width: 100%;
		height: 4px;
		background: var(--stone-300);
		border-radius: 2px;
		overflow: hidden;
	}

	.dict-progress-fill {
		height: 100%;
		background: var(--sage);
		border-radius: 2px;
		transition: width 200ms ease;
	}

	.dict-progress-fill.indeterminate {
		width: 30%;
		animation: indeterminate 1.5s ease-in-out infinite;
	}

	@keyframes indeterminate {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(433%); }
	}
</style>
