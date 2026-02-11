<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		mode: 'root' | 'inspector';
		rootPanel: Snippet;
		inspectorPanel?: Snippet;
	}

	let { mode, rootPanel, inspectorPanel }: Props = $props();
</script>

<aside class="drawer" aria-label="Controls">
	<div class="drawer-panels">
		<div class="panel" class:active={mode === 'root'}>
			{@render rootPanel()}
		</div>
		{#if inspectorPanel}
			<div class="panel" class:active={mode === 'inspector'}>
				{@render inspectorPanel()}
			</div>
		{/if}
	</div>
</aside>

<style>
	.drawer {
		width: 360px;
		min-width: 360px;
		height: 100%;
		background: var(--drawer-bg);
		border-right: 1px solid var(--stone-300);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.drawer-panels {
		flex: 1;
		position: relative;
		overflow: hidden;
	}

	.panel {
		position: absolute;
		inset: 0;
		opacity: 0;
		pointer-events: none;
		transition: opacity 250ms ease;
	}

	.panel.active {
		opacity: 1;
		pointer-events: auto;
	}
</style>
