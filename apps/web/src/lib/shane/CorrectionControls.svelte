<script lang="ts">
	/* ── CORRECT THE READ (N.92 first slice) ─────────────────────────────
	   Touch parity for the keyboard operations, ruled by Dann 2026-08-24.
	   Finale's Speedy Entry BEHAVIOUR, not its chrome, skinned to Calm
	   Authority and seated in the NOTATION anchor.

	   IT APPEARS ONLY WHILE A NOTE IS SELECTED. That is what makes the seat
	   honest: the NOTATION anchor already carries seven display toggles, and a
	   permanent second cluster beneath them would crowd a pinned region that
	   never scrolls. Idle, this is one line of prose.

	   NO THIRD TOUCH-GEOMETRY EXEMPTION. Every button here meets the 44 px
	   floor. The ruled exemption covers the cursor and nothing else, and this
	   ship does not widen it.

	   THE DRAWER MANIPULATES. Nothing here draws on the paper; the selection
	   state on the page is display, applied by VoiceProfilePane, and it prints
	   nothing. -------------------------------------------------------------- */
	import { t, type Language } from '$lib/i18n';
	import type { NoteBase } from '@ilya/score-parser';

	interface Props {
		language: Language;
		/** The selected note's name, already spelled, or null when none is. */
		selectedLabel: string | null;
		/** The selected note's current base, so the length row can show which. */
		selectedBase: NoteBase | null;
		/** Whether the selected note currently carries a dot. */
		selectedDotted: boolean;
		/** Whether this note carries any correction, so restore can be offered. */
		corrected: boolean;
		/** How many notes in the whole score carry a correction. */
		correctedCount: number;
		onstep: (direction: 1 | -1) => void;
		onoctave: (direction: 1 | -1) => void;
		onsemitone: (direction: 1 | -1) => void;
		onmove: (direction: 1 | -1) => void;
		onbase: (base: NoteBase) => void;
		ondot: () => void;
		ondelete: () => void;
		onrestore: () => void;
		ondeselect: () => void;
		/** Sage on both of Studio's documents, taken the way NotationFields takes it. */
		accent?: string;
	}

	let {
		language,
		selectedLabel,
		selectedBase,
		selectedDotted,
		corrected,
		correctedCount,
		onstep,
		onoctave,
		onsemitone,
		onmove,
		onbase,
		ondot,
		ondelete,
		onrestore,
		ondeselect,
		accent = '#8B9A7D'
	}: Props = $props();

	const T = (key: string) => t(key, language);

	/* The five Finale digits, in Finale's own order. The labels are words
	   rather than digits: a singer on a phone has no number row, and the digit
	   is the keyboard's shortcut for the same operation, not its name. */
	const LENGTHS: { base: NoteBase; key: string }[] = [
		{ base: '16th', key: 'correct.len16th' },
		{ base: 'eighth', key: 'correct.len8th' },
		{ base: 'quarter', key: 'correct.lenQuarter' },
		{ base: 'half', key: 'correct.lenHalf' },
		{ base: 'whole', key: 'correct.lenWhole' }
	];
</script>

<section class="correct" style="--accent: {accent}">
	<h3 class="correct-heading">{T('correct.heading')}</h3>

	{#if !selectedLabel}
		<p class="correct-idle">{T('correct.none')}</p>
	{:else}
		<p class="correct-selected">
			{T('correct.selected').replace('%s', selectedLabel)}
		</p>

		<div class="correct-row">
			<button type="button" class="correct-btn" onclick={() => onstep(1)}>
				{T('correct.stepUp')}
			</button>
			<button type="button" class="correct-btn" onclick={() => onstep(-1)}>
				{T('correct.stepDown')}
			</button>
		</div>
		<div class="correct-row">
			<button type="button" class="correct-btn" onclick={() => onoctave(1)}>
				{T('correct.octaveUp')}
			</button>
			<button type="button" class="correct-btn" onclick={() => onoctave(-1)}>
				{T('correct.octaveDown')}
			</button>
		</div>
		<div class="correct-row">
			<button type="button" class="correct-btn" onclick={() => onsemitone(1)}>
				{T('correct.semitoneUp')}
			</button>
			<button type="button" class="correct-btn" onclick={() => onsemitone(-1)}>
				{T('correct.semitoneDown')}
			</button>
		</div>

		<p class="correct-label">{T('correct.length')}</p>
		<div class="correct-row correct-row-wrap">
			{#each LENGTHS as len (len.base)}
				<button
					type="button"
					class="correct-btn correct-btn-len"
					class:engaged={selectedBase === len.base}
					aria-pressed={selectedBase === len.base}
					onclick={() => onbase(len.base)}
				>
					{T(len.key)}
				</button>
			{/each}
			<button
				type="button"
				class="correct-btn correct-btn-len"
				class:engaged={selectedDotted}
				aria-pressed={selectedDotted}
				onclick={ondot}
			>
				{T('correct.dot')}
			</button>
		</div>

		<div class="correct-row">
			<button type="button" class="correct-btn" onclick={() => onmove(-1)}>
				{T('correct.prev')}
			</button>
			<button type="button" class="correct-btn" onclick={() => onmove(1)}>
				{T('correct.next')}
			</button>
		</div>

		<div class="correct-row">
			<button type="button" class="correct-btn correct-btn-remove" onclick={ondelete}>
				{T('correct.delete')}
			</button>
		</div>

		{#if corrected}
			<div class="correct-row">
				<button type="button" class="correct-btn" onclick={onrestore}>
					{T('correct.restore')}
				</button>
			</div>
		{/if}

		<div class="correct-row">
			<button type="button" class="correct-btn" onclick={ondeselect}>
				{T('correct.deselect')}
			</button>
		</div>
	{/if}

	{#if correctedCount > 0}
		<p class="correct-count">
			{correctedCount === 1
				? T('correct.countOne')
				: T('correct.count').replace('%s', String(correctedCount))}
		</p>
	{/if}
</section>

<style>
	.correct {
		padding: 12px 0 4px;
	}

	.correct-heading {
		margin: 0 0 6px;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
	}

	.correct-idle,
	.correct-selected,
	.correct-count {
		margin: 0 0 8px;
		font-size: 0.8125rem;
		line-height: 1.4;
		color: var(--ink-muted, #5a5a55);
	}

	.correct-selected {
		font-weight: 600;
		color: var(--ink, #2e2e2b);
	}

	.correct-label {
		margin: 10px 0 4px;
		font-size: 0.6875rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-muted, #5a5a55);
	}

	.correct-row {
		display: flex;
		gap: 6px;
		margin-bottom: 6px;
	}

	.correct-row-wrap {
		flex-wrap: wrap;
	}

	/* 44 px is the floor, and it is a floor rather than a target: the buttons
	   grow with their text and never shrink below it. No exemption is taken
	   here; the ruled one covers the cursor alone. */
	.correct-btn {
		flex: 1 1 auto;
		min-height: 44px;
		min-width: 44px;
		padding: 8px 10px;
		border: 1px solid var(--rule, #d6d3cc);
		border-radius: 4px;
		background: var(--paper, #fffdf8);
		color: var(--ink, #2e2e2b);
		font: inherit;
		font-size: 0.8125rem;
		line-height: 1.2;
		cursor: pointer;
	}

	.correct-btn:hover {
		border-color: var(--accent);
	}

	.correct-btn:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.correct-btn-len {
		flex: 0 1 auto;
	}

	.correct-btn.engaged {
		border-color: var(--accent);
		color: var(--accent);
		font-weight: 600;
	}

	.correct-btn-remove {
		flex: 1 1 100%;
	}
</style>
