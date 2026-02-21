<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import TabBar, { type TabId } from './TabBar.svelte';

	interface Props {
		width: number;
		collapsed: boolean;
		language: Language;
		activeTab: TabId;
		tabTransitionClass: string;
		rootPanel: Snippet;
		ontogglecollapse: () => void;
		ontabchange: (tab: TabId) => void;
	}

	let { width, collapsed, language, activeTab, tabTransitionClass, rootPanel, ontogglecollapse, ontabchange }: Props = $props();
</script>

<aside class="drawer" class:collapsed style="width: {collapsed ? 6 : width}px" aria-label="Controls">
	<div class="drawer-body">
		{#if !collapsed}
			<div
				class="drawer-content {tabTransitionClass}"
				role="tabpanel"
				id="tabpanel-{activeTab}"
				aria-labelledby="tab-{activeTab}"
			>
				{#if activeTab === 'transcription'}
					{@render rootPanel()}
				{:else if activeTab === 'learn'}
					<div class="placeholder-panel">
						<h2 class="section-label">LEARN</h2>
						<p class="placeholder-text">
							{language === 'fr'
								? 'En préparation. Le module LEARN présentera les principes de diction lyrique russe de Grayson dans un format pédagogique en ligne.'
								: 'In preparation. The LEARN module will present Grayson\u2019s Russian lyric diction principles in a web-based pedagogical format.'}
						</p>
					</div>
				{:else if activeTab === 'guide'}
					<div class="placeholder-panel">
						<h2 class="section-label">GUIDE</h2>
						<p class="placeholder-text">
							{language === 'fr'
								? 'En préparation. Le Guide offrira un guide d\u2019utilisation, la méthodologie derrière Ilya et un contexte biographique.'
								: 'In preparation. The Guide will offer a user guide, the methodology behind Ilya, and biographical context.'}
						</p>
					</div>
				{/if}
			</div>
			<TabBar {activeTab} {language} {ontabchange} />
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

	.drawer.collapsed {
		width: 6px;
	}

	.drawer-body {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		background: var(--drawer-bg);
		display: flex;
		flex-direction: column;
	}

	.collapsed .drawer-body {
		display: none;
	}

	.drawer-content {
		flex: 1;
		overflow-y: auto;
	}

	/* ── Tab transition animations ──────────────────────── */

	@keyframes tabSlideFromRight {
		from {
			opacity: 0;
			transform: translateX(12px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes tabSlideFromLeft {
		from {
			opacity: 0;
			transform: translateX(-12px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.drawer-content :global(.tab-enter-from-right) {
		animation: tabSlideFromRight 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	.drawer-content :global(.tab-enter-from-left) {
		animation: tabSlideFromLeft 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	/* Apply animation to the drawer-content itself when class is set */
	.drawer-content.tab-enter-from-right {
		animation: tabSlideFromRight 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	.drawer-content.tab-enter-from-left {
		animation: tabSlideFromLeft 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
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

	/* ── Placeholder panels for LEARN and Guide tabs ─────── */

	.placeholder-panel {
		padding: 1.5rem;
	}

	.section-label {
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-secondary, #4a4540);
		margin: 0 0 1rem 0;
	}

	.placeholder-text {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 0.95rem;
		color: var(--ink-secondary, #4a4540);
		line-height: 1.6;
		margin: 0;
	}

	/* ── Mobile: drawer stays open below 768px ──────────── */

	@media (max-width: 767px) {
		.drawer.collapsed {
			width: auto;
		}

		.drawer.collapsed .drawer-body {
			display: flex;
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

		.drawer-content.tab-enter-from-right,
		.drawer-content.tab-enter-from-left {
			animation: none;
		}
	}
</style>
