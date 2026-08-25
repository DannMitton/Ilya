<script lang="ts">
	/* ── CORRECT THE READ (N.92, first and second slices) ────────────────
	   Touch parity for the keyboard operations, ruled by Dann 2026-08-24.
	   Finale's BEHAVIOUR, not its chrome, skinned to Calm Authority and seated
	   in the NOTATION anchor. The durations are Speedy Entry's digits, from the
	   first slice; the accidental cluster is Simple Entry's palette, from the
	   second, which amends the Speedy-only template on Dann's ruling of
	   2026-08-24.

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
		/** N.97: how many corrections no longer find a note in the current read. */
		orphanCount: number;
		onstep: (direction: 1 | -1) => void;
		onoctave: (direction: 1 | -1) => void;
		onsemitone: (direction: 1 | -1) => void;
		/** N.92 slice 2: the cumulative accidental verbs. */
		onaccidental: (kind: 'flat' | 'natural' | 'sharp') => void;
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
		orphanCount,
		onstep,
		onoctave,
		onsemitone,
		onaccidental,
		onmove,
		onbase,
		ondot,
		ondelete,
		onrestore,
		ondeselect,
		accent = '#8B9A7D'
	}: Props = $props();

	const T = (key: string) => t(key, language);

	/* THE ACCIDENTAL PALETTE (N.92 slice 2, ruled by Dann 2026-08-24). The
	   interface model here is Finale's SIMPLE Entry palette, which amends the
	   first slice's Speedy-only template: the durations keep Speedy's digits
	   and the accidentals arrive as a cluster of tools.

	   THE VERBS ARE CUMULATIVE, so these are actions and not states: two
	   clicks of flat reach a double flat, a third does nothing, and natural
	   resets. Nothing here carries `aria-pressed`, because none of the three is
	   ever "on". What the note currently shows is already on the line above,
	   spelled out.

	   The glyph is decorative and the word is the name. A singer using a screen
	   reader hears "Flat", not "music flat sign", which is why the glyph is
	   `aria-hidden`. */
	const ACCIDENTALS: { kind: 'flat' | 'natural' | 'sharp'; glyph: string; key: string }[] = [
		{ kind: 'flat', glyph: '\u266D', key: 'notation.tool.flat' },
		{ kind: 'natural', glyph: '\u266E', key: 'notation.tool.natural' },
		{ kind: 'sharp', glyph: '\u266F', key: 'notation.tool.sharp' }
	];

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

		<div class="correct-row correct-row-accidentals">
			{#each ACCIDENTALS as acc (acc.kind)}
				<button
					type="button"
					class="correct-btn correct-btn-accidental"
					onclick={() => onaccidental(acc.kind)}
				>
					<span class="accidental-glyph" aria-hidden="true">{acc.glyph}</span>
					{T(acc.key)}
				</button>
			{/each}
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

	<!-- N.97. A correction whose event id no longer resolves after a re-read
	     did not land, and a correction that fails to land must never fail
	     silently. The DRAWER says so and the paper carries no mark, which is
	     E.47's strike applied here: a mark on everything says nothing. -->
	{#if orphanCount > 0}
		<p class="correct-orphans">
			{T('notation.orphans').replace('%s', String(orphanCount))}
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
	.correct-orphans,
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

	/* The palette cluster. The glyph sits above the word on a narrow drawer and
	   beside it when there is room, which the flex wrap does on its own. */
	.correct-btn-accidental {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
	}

	.accidental-glyph {
		font-size: 1.125rem;
		line-height: 1;
		color: var(--accent);
	}

	/* MODALITY, per the Studio ruling (E.44 §AUDIT A.2). The 44 px floor is
	   already unconditional on `.correct-btn` and no exemption is taken here;
	   what a coarse pointer changes is the SHARE of the row each tool takes.
	   With a mouse the three tools stay the width of their words; with a
	   thumb they divide the row evenly, so no tool is the small one. */
	@media (pointer: coarse) {
		.correct-row-accidentals .correct-btn-accidental {
			flex: 1 1 0;
		}
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
