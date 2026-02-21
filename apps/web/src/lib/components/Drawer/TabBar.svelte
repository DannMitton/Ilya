<script module lang="ts">
	export type TabId = 'transcription' | 'learn' | 'guide';
</script>

<script lang="ts">
	import type { Language } from '$lib/i18n';

	interface Props {
		activeTab: TabId;
		language: Language;
		ontabchange: (tab: TabId) => void;
	}

	let { activeTab, language, ontabchange }: Props = $props();

	const tabs: { id: TabId; label: string }[] = [
		{ id: 'transcription', label: 'Transcription' },
		{ id: 'learn', label: 'LEARN' },
		{ id: 'guide', label: 'Guide' },
	];

	function handleKeydown(event: KeyboardEvent) {
		const currentIndex = tabs.findIndex(t => t.id === activeTab);
		let newIndex = currentIndex;

		if (event.key === 'ArrowRight') {
			newIndex = (currentIndex + 1) % tabs.length;
			event.preventDefault();
		} else if (event.key === 'ArrowLeft') {
			newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
			event.preventDefault();
		} else if (event.key === 'Home') {
			newIndex = 0;
			event.preventDefault();
		} else if (event.key === 'End') {
			newIndex = tabs.length - 1;
			event.preventDefault();
		}

		if (newIndex !== currentIndex) {
			ontabchange(tabs[newIndex].id);
			const newTabEl = document.getElementById(`tab-${tabs[newIndex].id}`);
			newTabEl?.focus();
		}
	}
</script>

<div class="tab-bar" role="tablist" aria-label="Navigation">
	{#each tabs as tab (tab.id)}
		<button
			class="tab"
			class:active={activeTab === tab.id}
			role="tab"
			id="tab-{tab.id}"
			aria-selected={activeTab === tab.id}
			aria-controls="tabpanel-{tab.id}"
			tabindex={activeTab === tab.id ? 0 : -1}
			onclick={() => ontabchange(tab.id)}
			onkeydown={handleKeydown}
		>
			{tab.label}
		</button>
	{/each}
</div>

<style>
	.tab-bar {
		display: flex;
		height: 48px;
		min-height: 48px;
		background: var(--sage);
	}

	.tab {
		position: relative;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 0 12px;
		border: none;
		border-top: 2px solid transparent;
		background: transparent;
		color: var(--ink-primary);
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.85rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition: background-color 150ms ease, border-color 150ms ease;
	}

	/* Subtle separator between inactive tabs */
	.tab:not(:last-child)::after {
		content: '';
		position: absolute;
		right: 0;
		top: 12px;
		bottom: 12px;
		width: 1px;
		background: var(--ink-secondary, #4a4540);
		opacity: 0.2;
	}

	/* Hide separator on and adjacent to the active tab */
	.tab.active::after,
	.tab:has(+ .tab.active)::after {
		display: none;
	}

	/* Hover state for inactive tabs: 5% ink overlay on sage */
	.tab:not(.active):hover {
		background: rgba(26, 22, 18, 0.05);
	}

	/* Active tab: paper-cream background, terra cotta top border, opens upward */
	.tab.active {
		background: var(--paper-cream, #FAF8F4);
		border-top-color: var(--terracotta, #C17C60);
		cursor: default;
	}

	.tab:focus-visible {
		outline: 2px solid var(--sage);
		outline-offset: -2px;
	}
</style>
