<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t, type Language } from '$lib/i18n';

	interface Props {
		mode: 'root' | 'inspector';
		collapsed: boolean;
		language: Language;
		rootPanel: Snippet;
		inspectorPanel?: Snippet;
		ontogglecollapse: () => void;
	}

	let { mode, collapsed, language, rootPanel, inspectorPanel, ontogglecollapse }: Props = $props();
</script>

<aside class="drawer" class:collapsed aria-label="Controls">
	<div class="drawer-body">
		{#if !collapsed}
			<div class="drawer-panels">
				<div class="panel" class:active={mode === 'root'}>
					{@render rootPanel()}
				</div>
				{#if inspectorPanel}
					<div class="panel panel-inspector" class:active={mode === 'inspector'}>
						{@render inspectorPanel()}
					</div>
				{/if}
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
		transition: width 0.25s ease;
	}

	.drawer:not(.collapsed) {
		width: 520px;
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

	.drawer-panels {
		position: relative;
		height: 100%;
	}

	.panel {
		position: absolute;
		inset: 0;
		opacity: 0;
		pointer-events: none;
		transition: opacity 250ms ease;
		overflow-y: auto;
	}

	.panel.active {
		opacity: 1;
		pointer-events: auto;
	}

	/* ── Inspector breath: settles into place when a word is clicked ── */

	@keyframes breathIn {
		from { opacity: 0; transform: translateY(-2px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	.panel-inspector.active {
		animation: breathIn 250ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	@media (prefers-reduced-motion: reduce) {
		.panel-inspector.active {
			animation: none;
		}
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
</style>
