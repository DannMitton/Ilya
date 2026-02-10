<script lang="ts">
	import { onMount } from 'svelte';
	import { transcribeWord } from '@ilya/phonology';
	import { loadDictionary, type LoaderState } from '$lib/loader';

	// Engine connectivity check
	const engineReady = typeof transcribeWord === 'function';

	// Dictionary loading state
	let loaderState = $state<LoaderState>({
		isLoading: false,
		error: null,
		entryCount: 0,
		durationMs: 0,
		tier2Loaded: false,
		tier2Count: 0
	});

	// Quick verification: transcribe test words once loaded
	let testYolka = $state('');
	let testMoloko = $state('');

	onMount(() => {
		loadDictionary({
			onStateChange(state) {
				loaderState = state;

				// Once tier 1 is loaded, verify the engine works end-to-end
				if (!state.isLoading && !state.error && state.entryCount > 0 && !testYolka) {
					try {
						// ёлка uses ё-rule (ё is always stressed) -- guaranteed stress
						const r1 = transcribeWord('ёлка');
						testYolka = r1.ipa || '(no IPA returned)';

						// молоко tests dictionary lookup (known data gap: no stress mark)
						const r2 = transcribeWord('молоко');
						testMoloko = r2.ipa || '(no IPA returned)';
					} catch (e: unknown) {
						testYolka = `Error: ${e instanceof Error ? e.message : String(e)}`;
					}
				}
			}
		});
	});
</script>

<main class="main-content">
	<div class="scaffold-confirmation">
		<h1>Ilya</h1>
		<p class="subtitle">Russian Lyric Diction</p>

		<!-- Engine status -->
		<p class="status">
			{#if engineReady}
				<span class="status-ok">✓ Engine connected</span>
			{:else}
				<span class="status-err">✗ Engine not found</span>
			{/if}
		</p>

		<!-- Dictionary loading status -->
		<div class="loader-status">
			{#if loaderState.isLoading}
				<p class="loading">Loading dictionary…</p>
			{:else if loaderState.error}
				<p class="status-err">
					✗ Dictionary failed: {loaderState.error}
				</p>
				<p class="inference-note">
					Engine will use inference mode (stress assignment may be limited)
				</p>
			{:else if loaderState.entryCount > 0}
				<p class="status-ok">
					✓ {loaderState.entryCount.toLocaleString()} words loaded in {loaderState.durationMs}ms
				</p>
				{#if loaderState.tier2Loaded}
					<p class="tier2">
						+ {loaderState.tier2Count.toLocaleString()} inflections merged
					</p>
				{/if}
			{/if}
		</div>

		<!-- Quick engine verification -->
		{#if testYolka}
			<div class="test-result">
				<p class="test-label">ёлка → (ё-rule: stress guaranteed)</p>
				<p class="test-ipa">{testYolka}</p>
			</div>
		{/if}
		{#if testMoloko}
			<div class="test-result">
				<p class="test-label">молоко → (no stress in dictionary data)</p>
				<p class="test-ipa">{testMoloko}</p>
			</div>
		{/if}

		<p class="version">Phase 2 — Task 2: Dictionary loading pipeline</p>
	</div>
</main>

<style>
	.main-content {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.scaffold-confirmation {
		text-align: center;
		max-width: 480px;
	}

	h1 {
		font-family: var(--font-body);
		font-size: 3rem;
		font-weight: 400;
		letter-spacing: 0.05em;
		margin-bottom: 0.25rem;
	}

	.subtitle {
		font-family: var(--font-body);
		font-style: italic;
		color: var(--color-text-muted);
		margin-bottom: 2rem;
	}

	.status {
		margin-bottom: 0.5rem;
	}

	.status-ok {
		color: #2f855a;
		font-weight: 500;
	}

	.status-err {
		color: #c53030;
		font-weight: 500;
	}

	.loader-status {
		margin-bottom: 1rem;
	}

	.loading {
		color: var(--color-text-muted);
		font-style: italic;
	}

	.inference-note {
		color: var(--color-text-muted);
		font-size: 0.85rem;
		margin-top: 0.25rem;
	}

	.tier2 {
		color: var(--color-text-muted);
		font-size: 0.85rem;
	}

	.test-result {
		margin: 1rem 0;
		padding: 1rem;
		background: var(--color-paper);
		border-radius: 6px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.test-label {
		font-size: 0.85rem;
		color: var(--color-text-muted);
		margin-bottom: 0.25rem;
	}

	.test-ipa {
		font-family: var(--font-body);
		font-size: 1.5rem;
		letter-spacing: 0.05em;
	}

	.version {
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}
</style>
