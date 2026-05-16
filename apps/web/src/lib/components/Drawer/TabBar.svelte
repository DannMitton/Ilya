<script module lang="ts">
	export type TabId = 'transcription' | 'learn' | 'guide' | 'shane';
</script>

<script lang="ts">
	import type { Language } from '$lib/i18n';
	import { INCLUDE_SHANE } from '$lib/wall';

	interface Props {
		activeTab: TabId;
		language: Language;
		ontabchange: (tab: TabId) => void;
	}

	let { activeTab, language, ontabchange }: Props = $props();

	function getLabel(id: TabId): string {
		switch (id) {
			case 'transcription': return 'Transcription';
			case 'learn': return language === 'fr' ? 'Leçons' : 'Learn';
			case 'guide': return 'Guide';
			case 'shane': return 'Shane';
		}
	}

	const tabIds: TabId[] = INCLUDE_SHANE
		? ['transcription', 'learn', 'guide', 'shane']
		: ['transcription', 'learn', 'guide'];

	function handleKeydown(event: KeyboardEvent) {
		const currentIndex = tabIds.findIndex(t => t === activeTab);
		let newIndex = currentIndex;

		if (event.key === 'ArrowRight') {
			newIndex = (currentIndex + 1) % tabIds.length;
			event.preventDefault();
		} else if (event.key === 'ArrowLeft') {
			newIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
			event.preventDefault();
		} else if (event.key === 'Home') {
			newIndex = 0;
			event.preventDefault();
		} else if (event.key === 'End') {
			newIndex = tabIds.length - 1;
			event.preventDefault();
		}

		if (newIndex !== currentIndex) {
			ontabchange(tabIds[newIndex]);
			const newTabEl = document.getElementById(`tab-${tabIds[newIndex]}`);
			newTabEl?.focus();
		}
	}
</script>

<div class="tab-bar" role="tablist" aria-label="Navigation">
	{#each tabIds as id (id)}
		<button
			class="tab tab-{id}"
			class:active={activeTab === id}
			role="tab"
			id="tab-{id}"
			aria-selected={activeTab === id}
			aria-controls="tabpanel-{id}"
			tabindex={activeTab === id ? 0 : -1}
			onclick={() => ontabchange(id)}
			onkeydown={handleKeydown}
		>
			{getLabel(id)}
		</button>
	{/each}
</div>

<style>
	.tab-bar {
		display: flex;
		height: 48px;
		min-height: 48px;
		background: var(--drawer-bg, #FAF8F5);
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
		color: var(--ink-secondary, #4a4540);
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 1rem;
		font-weight: 600;
		font-variant-caps: all-small-caps;
		letter-spacing: 0.06em;
		cursor: pointer;
		transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
	}

	/* Per-tab identity stripe (always visible) */
	.tab-transcription { border-top-color: var(--sage, #8B9A7D); }
	.tab-learn { border-top-color: var(--dusty-rose, #A67B7B); }
	.tab-guide { border-top-color: var(--quiet-cobalt, #5C739E); }
	.tab-shane { border-top-color: var(--muted-lavender, #A89BB5); }

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

	/* Hover state for inactive tabs */
	.tab:not(.active):hover {
		background: rgba(26, 22, 18, 0.05);
	}

	/* ── Per-tab active colours ──────────────────────────── */

	.tab.active {
		color: white;
		cursor: default;
	}

	.tab-transcription.active {
		background: var(--sage, #8B9A7D);
		border-top-color: var(--sage, #8B9A7D);
	}

	.tab-learn.active {
		background: var(--dusty-rose, #A67B7B);
		border-top-color: var(--dusty-rose, #A67B7B);
	}

	.tab-guide.active {
		background: var(--quiet-cobalt, #5C739E);
		border-top-color: var(--quiet-cobalt, #5C739E);
	}

	.tab-shane.active {
		background: var(--muted-lavender, #A89BB5);
		border-top-color: var(--muted-lavender, #A89BB5);
	}

	.tab:focus-visible {
		outline: 2px solid var(--sage);
		outline-offset: -2px;
	}
</style>
