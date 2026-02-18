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

<aside class="drawer" class:collapsed style="width: {collapsed ? 12 : width}px" aria-label="Controls">
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
		<svg width="6" height="12" viewBox="0 0 6 12" fill="none" aria-hidden="true">
			{#if collapsed}
				<path d="M1 1 L5 6 L1 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			{:else}
				<path d="M5 1 L1 6 L5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			{/if}
		</svg>
	</button>
</aside>

<style>
	.drawer {
		position: relative;
		display: flex;
		flex-direction: row;
		height: 100%;
		flex-shrink: 0;
		transition: width 600ms cubic-bezier(0.25, 0.1, 0.25, 1.0);
	}

	/* Sage band at bottom of drawer: full bleed left, kisses lip on right */
	.drawer::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: -20px;
		right: 12px;
		height: 34px;
		background: var(--sage);
		border-radius: 0;
		pointer-events: none;
	}

	.drawer.collapsed::after {
		display: none;
	}

	.drawer.collapsed {
		width: 12px;
	}

	.drawer-body {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		background: var(--drawer-bg);
	}

	.collapsed .drawer-body {
		display: none;
	}

	.drawer-content {
		height: 100%;
		overflow-y: auto;
	}

	/* ── Lip: thin sage rule with centred pull tab ────────── */

	.drawer-lip {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 12px;
		min-width: 12px;
		height: 100%;
		background: transparent;
		border: none;
		border-right: 2px solid var(--ink-tertiary);
		cursor: pointer;
		color: white;
		padding: 0;
	}

	/* Sage pull tab at vertical centre */
	.drawer-lip::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		width: 100%;
		height: 48px;
		background: var(--sage);
		border-radius: 0;
		transition: height 0.15s ease, opacity 0.15s ease;
	}

	.drawer-lip svg {
		position: relative;
		z-index: 1;
	}

	.drawer-lip:hover::before {
		height: 64px;
		opacity: 0.85;
	}

	/* ── Reduced motion ──────────────────────────────────── */

	@media (prefers-reduced-motion: reduce) {
		.drawer {
			transition: none;
		}
	}
</style>
