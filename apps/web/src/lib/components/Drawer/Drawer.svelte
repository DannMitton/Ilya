<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t, type Language } from '$lib/i18n';

	interface Props {
		width: number;
		collapsed: boolean;
		language: Language;
		rootPanel: Snippet;
		ontogglecollapse: () => void;
	}

	let { width, collapsed, language, rootPanel, ontogglecollapse }: Props = $props();
</script>

<aside class="drawer" class:collapsed style="width: {collapsed ? 24 : width}px" aria-label="Controls">
	<div class="drawer-body">
		{#if !collapsed}
			<div class="drawer-content">
				{@render rootPanel()}
			</div>
		{/if}
	</div>
	<button
		class="drawer-lip"
		onclick={ontogglecollapse}
		aria-label={collapsed ? t('drawer.expand', language) : t('drawer.collapse', language)}
		title={collapsed ? t('drawer.expand', language) : t('drawer.collapse', language)}
	>
		<svg width="10" height="16" viewBox="0 0 10 16" fill="none" aria-hidden="true">
			{#if collapsed}
				<path d="M2 2 L8 8 L2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			{:else}
				<path d="M8 2 L2 8 L8 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			{/if}
		</svg>
	</button>
</aside>

<style>
	.drawer {
		display: flex;
		flex-direction: row;
		height: 100%;
		flex-shrink: 0;
		transition: width 600ms cubic-bezier(0.25, 0.1, 0.25, 1.0);
	}

	.drawer.collapsed {
		width: 24px;
	}

	.drawer-body {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		background: var(--drawer-bg);
		border-right: 1px solid var(--stone-300);
	}

	.collapsed .drawer-body {
		display: none;
	}

	.drawer-content {
		height: 100%;
		overflow-y: auto;
	}

	/* ── Lip: vertical strip on right edge ────────────────── */

	.drawer-lip {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		min-width: 24px;
		height: 100%;
		background: var(--drawer-bg);
		border: none;
		border-right: 1px solid var(--stone-300);
		cursor: pointer;
		color: var(--ink-tertiary);
		transition: color 0.12s, background 0.12s;
		padding: 0;
	}

	.drawer-lip:hover {
		color: var(--ink-primary);
		background: var(--stone-300);
	}

	/* ── Reduced motion ──────────────────────────────────── */

	@media (prefers-reduced-motion: reduce) {
		.drawer {
			transition: none;
		}
	}
</style>
