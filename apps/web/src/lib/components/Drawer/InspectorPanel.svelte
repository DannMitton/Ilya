<script lang="ts">
	import type { WordStackData } from '$lib/types';
	import type { DisplayLogEntry } from '@ilya/blurb';

	interface Props {
		word: WordStackData;
		onback: () => void;
	}

	let { word, onback }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			onback();
		}
	}

	function stressSourceLabel(source: string): string {
		switch (source) {
			case 'dictionary': return 'Verified from dictionary';
			case 'supplement': return 'Singer supplement';
			case 'yo-rule': return 'Derived from ё';
			case 'yo-restored': return 'ё restored from dictionary';
			case 'inferred': return 'Algorithmically inferred';
			case 'unknown': return 'Unknown — verify manually';
			default: return source;
		}
	}

	const provenanceIcon = $derived((() => {
		const src = word.stressSource;
		switch (src) {
			case 'dictionary':
				return { type: 'dictionary', colour: '#059669' };
			case 'supplement':
				return { type: 'supplement', colour: '#2563eb' };
			case 'yo-rule':
			case 'yo-restored':
				return { type: 'yo', colour: '#7c3aed' };
			case 'inferred':
				return { type: 'inferred', colour: '#d97706' };
			case 'unknown':
				return { type: 'unknown', colour: '#d97706' };
			default:
				return null;
		}
	})());

	function ribbonLabel(entry: DisplayLogEntry): string {
		if (entry.ipa === '' || entry.ipa === null) return '';
		return entry.ipa;
	}

	function hasBlurb(entry: DisplayLogEntry): boolean {
		return !!(entry.blurbData && (
			(entry.blurbData as Record<string, unknown>).en ||
			(entry.blurbData as Record<string, unknown>).text
		));
	}

	function getBlurbText(entry: DisplayLogEntry): string {
		if (!entry.blurbData) return '';
		const data = entry.blurbData as Record<string, unknown>;
		if (typeof data.en === 'string') return data.en;
		if (typeof data.text === 'string') return data.text;
		return '';
	}
</script>

<div class="inspector-panel" onkeydown={handleKeydown}>
	<!-- Back button -->
	<button class="back-btn" onclick={onback}>
		← Back
	</button>

	<!-- Word header -->
	<div class="word-header">
		<h2 class="word-cyrillic">{word.stressedCyrillic}</h2>
		<p class="word-ipa">{word.ipaDisplay}</p>
		{#if word.gloss}
			<p class="word-gloss">{word.gloss}</p>
		{/if}
	</div>

	<!-- Stress provenance -->
	<div class="section">
		<h3 class="section-label">Stress</h3>
		<div class="stress-info">
			{#if word.stressIndex >= 0}
				<p class="stress-text">
					{#if provenanceIcon}
						<span class="provenance-inline" aria-hidden="true">
							{#if provenanceIcon.type === 'dictionary'}
								<svg width="12" height="12" viewBox="0 0 10 10">
									<path d="M1.5 5.5 L4 8 L8.5 2.5" fill="none" stroke={provenanceIcon.colour} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
							{:else if provenanceIcon.type === 'supplement'}
								<svg width="12" height="12" viewBox="0 0 10 10">
									<path d="M5 0.8 L6.1 3.5 L9 3.7 L6.8 5.8 L7.4 8.8 L5 7.3 L2.6 8.8 L3.2 5.8 L1 3.7 L3.9 3.5 Z" fill={provenanceIcon.colour}/>
								</svg>
							{:else if provenanceIcon.type === 'yo'}
								<svg width="12" height="12" viewBox="0 0 10 10">
									<text x="5" y="9" text-anchor="middle" font-size="9" font-weight="600" fill={provenanceIcon.colour}>ё</text>
								</svg>
							{:else if provenanceIcon.type === 'inferred'}
								<svg width="12" height="12" viewBox="0 0 10 10">
									<path d="M1 6 Q3 3.5, 5 6 Q7 8.5, 9 6" fill="none" stroke={provenanceIcon.colour} stroke-width="1.5" stroke-linecap="round"/>
								</svg>
							{:else if provenanceIcon.type === 'unknown'}
								<svg width="12" height="12" viewBox="0 0 10 10">
									<text x="5" y="8.5" text-anchor="middle" font-size="9" font-weight="600" fill={provenanceIcon.colour}>?</text>
								</svg>
							{/if}
						</span>
					{/if}
					Syllable {word.stressIndex + 1} · {stressSourceLabel(word.stressSource)}
				</p>
			{:else if word.stressIndex === -1}
				<p class="stress-text">Clitic (unstressed)</p>
			{:else}
				<p class="stress-text">
					{#if provenanceIcon}
						<span class="provenance-inline" aria-hidden="true">
							<svg width="12" height="12" viewBox="0 0 10 10">
								<text x="5" y="8.5" text-anchor="middle" font-size="9" font-weight="600" fill={provenanceIcon.colour}>?</text>
							</svg>
						</span>
					{/if}
					Unknown stress · verify manually
				</p>
			{/if}
		</div>
	</div>

	<!-- Ribbon: per-character breakdown -->
	{#if word.displayLog.length > 0}
		<div class="section">
			<h3 class="section-label">Character breakdown</h3>
			<div class="ribbon">
				{#each word.displayLog as entry, i}
					<div class="ribbon-cell" class:stressed={entry.features?.stressed}>
						<span class="ribbon-char">{entry.char}</span>
						<span class="ribbon-arrow">↓</span>
						<span class="ribbon-ipa">{ribbonLabel(entry) || '∅'}</span>
						{#if entry.features?.rule}
							<span class="ribbon-rule">{entry.features.rule}</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Blurb details -->
	{#if word.displayLog.some(hasBlurb)}
		<div class="section">
			<h3 class="section-label">Phonological notes</h3>
			<div class="blurb-list">
				{#each word.displayLog.filter(hasBlurb) as entry}
					<div class="blurb-entry">
						<span class="blurb-char">{entry.char} → {ribbonLabel(entry) || '∅'}</span>
						<p class="blurb-text">{getBlurbText(entry)}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Notation indicator (read-only) -->
	<div class="section notation-indicator">
		<p class="notation-note">Notation: default (Grayson)</p>
	</div>
</div>

<style>
	.inspector-panel {
		display: flex;
		flex-direction: column;
		gap: 0;
		padding: 1.5rem;
		height: 100%;
		overflow-y: auto;
	}

	/* ── Back button ──────────────────────────────────────────── */

	.back-btn {
		background: none;
		border: none;
		color: var(--color-accent);
		cursor: pointer;
		font-size: 0.85rem;
		padding: 0.25rem 0;
		margin-bottom: 1rem;
		text-align: left;
		width: fit-content;
	}

	.back-btn:hover {
		text-decoration: underline;
	}

	/* ── Word header ──────────────────────────────────────────── */

	.word-header {
		margin-bottom: 1.5rem;
	}

	.word-cyrillic {
		font-family: var(--font-body);
		font-size: 1.6rem;
		font-weight: 400;
		margin-bottom: 0.25rem;
	}

	.word-ipa {
		font-size: 1.15rem;
		margin-bottom: 0.35rem;
	}

	.word-gloss {
		font-size: 0.85rem;
		color: var(--color-text-muted);
		font-style: italic;
	}

	/* ── Sections ─────────────────────────────────────────────── */

	.section {
		margin-bottom: 1.25rem;
	}

	.section-label {
		font-family: var(--font-ui);
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
		margin-bottom: 0.5rem;
	}

	/* ── Stress info ──────────────────────────────────────────── */

	.stress-info {
		font-size: 0.85rem;
		color: var(--color-text);
	}

	.stress-text {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}

	.provenance-inline {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}

	/* ── Ribbon ───────────────────────────────────────────────── */

	.ribbon {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem;
	}

	.ribbon-cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
		padding: 0.35rem 0.4rem;
		background: #f9fafb;
		border: 1px solid var(--color-border);
		border-radius: 4px;
		min-width: 2rem;
	}

	.ribbon-cell.stressed {
		background: #fffbeb;
		border-color: #f59e0b;
	}

	.ribbon-char {
		font-size: 1rem;
		font-weight: 500;
	}

	.ribbon-arrow {
		font-size: 0.6rem;
		color: #9ca3af;
		line-height: 1;
	}

	.ribbon-ipa {
		font-size: 0.95rem;
	}

	.ribbon-rule {
		font-size: 0.65rem;
		color: var(--color-text-muted);
		text-align: center;
		max-width: 4rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* ── Blurb notes ──────────────────────────────────────────── */

	.blurb-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.blurb-entry {
		font-size: 0.85rem;
	}

	.blurb-char {
		font-weight: 500;
		display: block;
		margin-bottom: 0.2rem;
	}

	.blurb-text {
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	/* ── Notation indicator ───────────────────────────────────── */

	.notation-indicator {
		margin-top: auto;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
	}

	.notation-note {
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}
</style>
