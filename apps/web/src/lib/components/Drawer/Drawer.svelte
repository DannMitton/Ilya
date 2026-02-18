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

<aside class="drawer" class:collapsed style="width: {collapsed ? 6 : width}px" aria-label="Controls">
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
	></button>
</aside>

<style>
	.drawer {
		position: relative;
		display: flex;
		flex-direction: row;
		height: 100%;
		flex-shrink: 0;
		transition: width 1000ms cubic-bezier(0.25, 0, 0.15, 1);
	}

	/* Sage band at bottom of drawer: full bleed left, kisses lip on right */
	.drawer::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: -20px;
		right: 6px;
		height: 34px;
		background: var(--sage);
		border-radius: 0;
		pointer-events: none;
	}

	.drawer.collapsed::after {
		display: none;
	}

	.drawer.collapsed {
		width: 6px;
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

	/* ── Lip: 6px sage edge with invisible 44px touch target ── */

	.drawer-lip {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 6px;
		min-width: 6px;
		height: 100%;
		background: var(--sage);
		opacity: 0.6;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: opacity 0.2s ease, width 0.2s ease;
	}

	/* Invisible touch target: 44px wide, extends into page area */
	.drawer-lip::after {
		content: '';
		position: absolute;
		top: 0;
		left: -19px;
		right: -19px;
		bottom: 0;
		z-index: 1;
	}

	.drawer-lip:hover {
		opacity: 0.9;
		width: 8px;
		min-width: 8px;
	}

	.drawer-lip:focus-visible {
		outline: 2px solid var(--sage);
		outline-offset: 2px;
	}

	/* ── Mobile: drawer stays open below 768px ──────────── */

	@media (max-width: 767px) {
		.drawer.collapsed {
			width: auto;
		}

		.drawer.collapsed .drawer-body {
			display: block;
		}

		.drawer.collapsed::after {
			display: block;
		}

		.drawer-lip {
			display: none;
		}
	}

	/* ── Reduced motion ──────────────────────────────────── */

	@media (prefers-reduced-motion: reduce) {
		.drawer {
			transition: none;
		}
	}
</style>
