<script lang="ts">
	import { formatForPaper, type PersonEntry } from '$lib/composers-poets';
	import { t, type Language } from '$lib/i18n';

	interface Props {
		entries: PersonEntry[];
		value: string;
		placeholder: string;
		language: Language;
		onchange: (value: string, entry: PersonEntry | null) => void;
	}

	let { entries, value, placeholder, language, onchange }: Props = $props();

	let isOpen = $state(false);
	let searchQuery = $state('');
	let highlightIndex = $state(-1);
	let triggerEl: HTMLButtonElement | undefined = $state();
	let searchEl: HTMLInputElement | undefined = $state();
	let dropdownEl: HTMLDivElement | undefined = $state();

	/** Stable unique ID prefix for ARIA references. */
	const uid = $state(`ss-${Math.random().toString(36).slice(2, 8)}`);

	const filtered = $derived(
		searchQuery.length === 0
			? entries
			: entries.filter(e =>
				e.latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
				e.cyrillic.toLowerCase().includes(searchQuery.toLowerCase())
			)
	);

	/** The currently selected entry object (if value matches a known entry). */
	const selectedEntry = $derived(
		entries.find(e => value === e.latin || value === formatForPaper(e)) ?? null
	);

	/** Display string for the trigger button: paper format (Given Surname (dates)). */
	const displayText = $derived(
		selectedEntry
			? formatForPaper(selectedEntry)
			: value || ''
	);

	/** ID of the currently highlighted option for aria-activedescendant. */
	const activeDescendantId = $derived(
		highlightIndex >= 0
			? highlightIndex < filtered.length
				? `${uid}-option-${highlightIndex}`
				: `${uid}-custom`
			: undefined
	);

	/** Screen reader announcement text for filtered result count. */
	const liveText = $derived(
		isOpen
			? filtered.length === entries.length
				? ''
				: filtered.length === 0
					? language === 'fr' ? 'Aucun résultat' : 'No results'
					: `${filtered.length} ${filtered.length === 1
						? (language === 'fr' ? 'résultat' : 'result')
						: (language === 'fr' ? 'résultats' : 'results')}`
			: ''
	);

	function open() {
		isOpen = true;
		searchQuery = '';
		highlightIndex = -1;
		// Focus the search input after DOM update
		requestAnimationFrame(() => searchEl?.focus());
	}

	function close() {
		isOpen = false;
		highlightIndex = -1;
	}

	function toggle() {
		if (isOpen) close();
		else open();
	}

	function selectEntry(entry: PersonEntry) {
		onchange(formatForPaper(entry), entry);
		close();
	}

	function selectCustom() {
		// Use current search query as custom value
		if (searchQuery.trim()) {
			onchange(searchQuery.trim(), null);
		}
		close();
	}

	function handleTriggerKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggle();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (!isOpen) open();
		} else if (e.key === 'Escape') {
			close();
		} else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
			// Printable character: open and start filtering
			e.preventDefault();
			open();
			searchQuery = e.key;
		}
	}

	function handleSearchKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			// +1 for the custom entry at the end
			highlightIndex = Math.min(highlightIndex + 1, filtered.length);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			highlightIndex = Math.max(highlightIndex - 1, -1);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (highlightIndex >= 0 && highlightIndex < filtered.length) {
				selectEntry(filtered[highlightIndex]);
			} else if (highlightIndex === filtered.length) {
				selectCustom();
			} else if (filtered.length === 1) {
				selectEntry(filtered[0]);
			}
		} else if (e.key === 'Escape') {
			close();
			triggerEl?.focus();
		} else if (e.key === 'Tab') {
			close();
		}
	}

	function handleOutsideClick(e: MouseEvent) {
		const target = e.target as Node;
		if (triggerEl && !triggerEl.contains(target) && dropdownEl && !dropdownEl.contains(target)) {
			close();
		}
	}

	// Scroll highlighted item into view
	$effect(() => {
		if (highlightIndex >= 0 && dropdownEl) {
			const highlighted = dropdownEl.querySelector('.highlighted');
			highlighted?.scrollIntoView({ block: 'nearest' });
		}
	});
</script>

<svelte:window onclick={handleOutsideClick} />

<div class="searchable-select">
	<button
		type="button"
		class="select-trigger"
		class:active={isOpen}
		class:has-value={!!displayText}
		bind:this={triggerEl}
		onclick={toggle}
		onkeydown={handleTriggerKeydown}
		role="combobox"
		aria-expanded={isOpen}
		aria-haspopup="listbox"
		aria-controls={isOpen ? `${uid}-listbox` : undefined}
		aria-label={placeholder}
	>
		{#if displayText}
			<span class="trigger-text">{displayText}</span>
		{:else}
			<span class="trigger-placeholder">{placeholder}</span>
		{/if}
		<svg class="chevron" class:flipped={isOpen} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<polyline points="6 9 12 15 18 9"></polyline>
		</svg>
	</button>

	{#if isOpen}
		<div class="select-dropdown" bind:this={dropdownEl}>
			<input
				type="text"
				class="select-search"
				placeholder={t('select.filter', language)}
				bind:this={searchEl}
				bind:value={searchQuery}
				onkeydown={handleSearchKeydown}
				role="searchbox"
				aria-autocomplete="list"
				aria-controls={`${uid}-listbox`}
				aria-activedescendant={activeDescendantId}
			/>
			<div
				class="select-options"
				role="listbox"
				id={`${uid}-listbox`}
			>
				{#each filtered as entry, idx}
					<button
						type="button"
						class="select-option"
						class:highlighted={idx === highlightIndex}
						id={`${uid}-option-${idx}`}
						role="option"
						aria-selected={selectedEntry === entry}
						onclick={() => selectEntry(entry)}
					>
						<span class="option-primary">{entry.latin}</span>
						<span class="option-secondary">{entry.cyrillic} · {entry.dates}</span>
					</button>
				{/each}
				<button
					type="button"
					class="select-option custom-option"
					class:highlighted={highlightIndex === filtered.length}
					id={`${uid}-custom`}
					role="option"
					aria-selected={false}
					onclick={selectCustom}
				>
					+ {t('select.notInList', language)}
				</button>
			</div>
			<div class="sr-only" aria-live="polite" aria-atomic="true">
				{liveText}
			</div>
		</div>
	{/if}
</div>

<style>
	.searchable-select {
		position: relative;
		width: 100%;
	}

	.select-trigger {
		width: 100%;
		padding: 0.25rem 0.4rem;
		background: white;
		border: 1px solid var(--stone-300);
		border-radius: 3px;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--ink-primary);
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
		text-align: left;
		gap: 0.25rem;
		transition: border-color 0.12s;
	}

	.select-trigger:hover {
		border-color: var(--stone-500);
	}

	.select-trigger.active {
		border-color: var(--sage);
		box-shadow: 0 0 0 2px rgba(139, 154, 125, 0.15);
	}

	.trigger-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex: 1;
		min-width: 0;
	}

	.trigger-placeholder {
		color: var(--ink-tertiary);
		flex: 1;
		min-width: 0;
	}

	.chevron {
		width: 14px;
		height: 14px;
		stroke: var(--ink-tertiary);
		flex-shrink: 0;
		transition: transform 0.15s ease;
	}

	.chevron.flipped {
		transform: rotate(180deg);
	}

	/* ── Dropdown panel ──────────────────────────────────── */

	.select-dropdown {
		position: absolute;
		top: calc(100% + 3px);
		left: 0;
		right: 0;
		max-height: 220px;
		display: flex;
		flex-direction: column;
		background: white;
		border: 1px solid var(--stone-300);
		border-radius: 4px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		z-index: 200;
	}

	/* 0.8rem, not the 0.78rem this declared until 2026-08-20. Measured, that
	   rendered its placeholder at 12.48px beside every other placeholder in
	   the drawer at 12.8px: a third size, for no reason anyone recorded.
	   `.custom-option` below keeps its own 0.78rem; it is a dropdown row, not
	   a placeholder-bearing field. */
	.select-search {
		width: 100%;
		padding: 0.5rem;
		border: none;
		border-bottom: 1px solid var(--stone-300);
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--ink-primary);
		background: transparent;
	}

	.select-search:focus {
		outline: none;
	}

	.select-search::placeholder {
		color: var(--ink-tertiary);
	}

	.select-options {
		overflow-y: auto;
		flex: 1;
	}

	/* ── Option rows ─────────────────────────────────────── */

	.select-option {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 0.5rem;
		min-height: 2.75rem;
		border: none;
		background: transparent;
		cursor: pointer;
		text-align: left;
		font-family: var(--font-sans);
		transition: background 0.08s;
	}

	.select-option:hover,
	.select-option.highlighted {
		background: rgba(139, 154, 125, 0.1);
	}

	.option-primary {
		font-size: 0.8rem;
		color: var(--ink-primary);
		line-height: 1.3;
	}

	.option-secondary {
		font-size: 0.68rem;
		color: var(--ink-tertiary);
		line-height: 1.3;
	}

	.custom-option {
		font-size: 0.78rem;
		color: var(--sage);
		font-style: italic;
		border-top: 1px solid var(--stone-300);
		min-height: 2.75rem;
		display: flex;
		align-items: center;
	}

	/* ── Screen reader only ──────────────────────────────── */

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
