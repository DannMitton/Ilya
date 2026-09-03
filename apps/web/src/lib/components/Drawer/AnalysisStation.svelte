<script lang="ts">
	/**
	 * ANALYSIS — the transcription's own console, as a station in the Text
	 * group (N.108 increment 1).
	 *
	 * EXTRACTED, NOT WRITTEN FRESH. Every line below was `.console-section` in
	 * `RootPanel.svelte`, and it is here because the three groups cut across
	 * the panels: Analysis belongs with Notation in Text, and `RootPanel` is
	 * the Piece group's contents now. Svelte scopes a rule to the file that
	 * writes the markup, so the five rules came with it, value for value.
	 *
	 * THE 2026-08-27 RULING IS WHAT PUT IT WITH THE TEXT, and it is not
	 * reversed by the move. Dann: the score work grew, so "the bottom is the
	 * MUSIC half and the top is the TEXT half", and Analysis is the
	 * transcription's own console. The groups make that structural instead of
	 * positional: it is in Text because it is text work, and it stays there
	 * however the drawer is scrolled.
	 *
	 * THE RESULT SUMMARY IS STILL INSIDE IT, N.65 ship one's decision on the
	 * ratified r1 mockup (`fable-gui-mockup_r1_2026-08-18.html:322-324`): what
	 * it reports is a READING of the text rather than an act on it, so it sits
	 * with the reading. N.108 increment 2 moves the word count to the intake's
	 * receipt line, and this ship deliberately does not begin that.
	 */
	import type { Snippet } from 'svelte';
	import type { LoaderState } from '$lib/loader';
	import { t, type Language } from '$lib/i18n';
	import StationHeader from './StationHeader.svelte';

	interface Props {
		loaderState: LoaderState;
		hasResults: boolean;
		wordCount: number;
		transcribeMs: number;
		language: Language;
		/** Whether a word is selected, so the inspector has something to draw. */
		showInspector: boolean;
		/** The inspector, wired in `+page.svelte` where its state lives. */
		consoleContent?: Snippet;
		expanded: boolean;
		ontoggle: () => void;
	}

	let {
		loaderState,
		hasResults,
		wordCount,
		transcribeMs,
		language,
		showInspector,
		consoleContent,
		expanded,
		ontoggle,
	}: Props = $props();
</script>

<div class="station console-section">
	<StationHeader
		label={t('console.placeholder', language)}
		{expanded}
		{ontoggle}
		controls="station-analysis"
	/>
	{#if expanded}
		<div class="station-body" id="station-analysis">
			<p class="result-summary" class:result-hidden={!hasResults}>
				{#if hasResults}
					{wordCount} {t('result.words', language)} {transcribeMs}ms
				{:else}
					&nbsp;
				{/if}
			</p>
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
							{language === 'en' ? 'Select a word on the page to analyse it here.' : 'Sélectionnez un mot sur la page pour l’analyser ici.'}
						</p>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
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

	/* N.65 ship one. `margin-top: -4px` is gone. It pulled this line up
	   against the uploader that used to sit above it; it is the first entry
	   under ANALYSIS's header now, where a negative margin would eat the gap. */
	.result-summary {
		font-size: 0.75rem;
		color: var(--sage);
		font-family: var(--font-sans);
		margin: 0;
		min-height: 1.2em;
		text-align: right;
	}

	.result-hidden {
		visibility: hidden;
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
