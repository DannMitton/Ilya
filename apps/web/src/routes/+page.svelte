<script lang="ts">
	import { transcribeWord } from '@ilya/phonology';

	// Verify workspace import works at build time
	const engineReady = typeof transcribeWord === 'function';
</script>

<main class="main-content">
	<div class="scaffold-confirmation">
		<h1>Ilya</h1>
		<p class="subtitle">Russian Lyric Diction</p>
		<p class="status">
			{#if engineReady}
				<span class="status-ok">✓ Engine connected</span>
			{:else}
				<span class="status-err">✗ Engine not found</span>
			{/if}
		</p>
		<p class="version">Phase 2 scaffold — @ilya/phonology import verified</p>
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
		margin-bottom: 1rem;
	}

	.status-ok {
		color: #2f855a;
		font-weight: 500;
	}

	.status-err {
		color: #c53030;
		font-weight: 500;
	}

	.version {
		font-size: 0.85rem;
		color: var(--color-text-muted);
	}
</style>
