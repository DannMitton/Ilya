<script lang="ts">
	import { t, type Language } from '$lib/i18n';
	import type { InputView } from '$lib/text/input-views.svelte';
	import ViewPair from './ViewPair.svelte';
	/*
	 * TextWitnessPair.svelte: THE PAIR IN TEXT. ROW 110 (N.186, Dann 2026-10-16
	 * 21:06: "With both textual witnesses, the user can choose but Lyrics is the
	 * default. Poem must be manually selected for display and print").
	 *
	 * Input's pair, Poem | Lyrics, same order and the same ratified labels
	 * (`intake.view.poem`, `intake.view.lyrics`), standing above the sheet at its
	 * right edge, as `DeskHead.svelte`'s row does. Offered only while the two
	 * texts differ (`witnessesDiffer`); the page decides. It is a control on the
	 * desk, not on the page, so it does not print (`CONTRACT.md` §8).
	 */
	interface Props {
		language: Language;
		/** The witness Text is showing now. */
		witness: InputView;
		onchoose: (witness: InputView) => void;
	}

	let { language, witness, onchoose }: Props = $props();
</script>

<div class="witness-bar">
	<ViewPair
		items={[
			{ id: 'poem', label: t('intake.view.poem', language) },
			{ id: 'lyrics', label: t('intake.view.lyrics', language) },
		]}
		active={witness}
		idPrefix="text-tab"
		name={t('a11y.paper', language)}
		onchoose={(id) => onchoose(id as InputView)}
	/>
</div>

<style>
	/* Flush with the sheet's right edge, `--sheet-width` set per destination as
	   `DeskHead.svelte` reads it; the 44px touch strip is `ViewPair`'s. */
	.witness-bar {
		align-self: center;
		box-sizing: border-box;
		width: 100%;
		max-width: var(--sheet-width, 816px);
		display: flex;
		justify-content: flex-end;
		padding: 0 0 0.6rem;
	}

	@media print {
		.witness-bar {
			display: none;
		}
	}
</style>
