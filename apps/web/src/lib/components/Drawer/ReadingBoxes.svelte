<script lang="ts" module>
	/** One checkbox of the slot: `id` names the control for tests (`.spot-checkbox`, `.rhyme-checkbox`). */
	export interface ReadingBox {
		id: 'spot' | 'rhyme';
		label: string;
		checked: boolean;
		onchange: () => void;
	}
</script>

<script lang="ts">
	/**
	 * The slot beside the word stack, tethered to its right edge: one checkbox for each way the singer may set the word's
	 * reading aside, in the order given (spot reconstitution first, then the Stage reading of an -кий rhyme). Moved out of
	 * `InspectorPanel.svelte`, which is at its ceiling, when the second box arrived (rhyme lane 49). The slot keeps its
	 * height when empty, so the stack does not jump as the singer taps from word to word.
	 */
	let { boxes }: { boxes: ReadingBox[] } = $props();
</script>

<div class="reading-boxes">
	{#each boxes as box (box.id)}
		<label class="reading-box-label">
			<span class="reading-box-text">{box.label}</span>
			<input type="checkbox" class="reading-checkbox {box.id}-checkbox" checked={box.checked} onchange={box.onchange} />
		</label>
	{/each}
</div>

<style>
	.reading-boxes {
		min-height: 24px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: center;
		gap: 0.3rem;
		margin-top: 0.35rem;
	}

	.reading-box-label {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		cursor: pointer;
	}

	.reading-checkbox {
		width: 14px;
		height: 14px;
		accent-color: var(--sage);
		cursor: pointer;
		margin: 0;
		flex-shrink: 0;
	}

	.reading-box-text {
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--ink-secondary);
		line-height: 1;
		user-select: none;
	}
</style>
