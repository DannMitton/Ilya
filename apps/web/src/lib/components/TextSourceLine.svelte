<script lang="ts">
	import { t, type Language } from '$lib/i18n';
	import type { InputView } from '$lib/text/input-views.svelte';
	/*
	 * TextSourceLine.svelte: THE QUIET LINE IN TEXT (row 172, Dann 2026-11-01
	 * 13:04, design 1; the words in capitals 13:26). Text shows the witness the
	 * singer last tapped in INPUT's Poem | Lyrics pill, and this line names it:
	 * "From LYRICS" or "From POEM". It is text, not a control: the pill in INPUT
	 * is the one place that chooses. The page offers it only while the two texts
	 * differ (`witnessDiffer`), as the pair it replaces was offered.
	 *
	 * On the desk, not on the page, so it does not print (`CONTRACT.md` §8).
	 */
	interface Props {
		language: Language;
		/** The witness Text is showing now. */
		witness: InputView;
	}

	let { language, witness }: Props = $props();
</script>

<p class="text-source" id="text-source">{t(witness === 'poem' ? 'text.source.poem' : 'text.source.lyrics', language)}</p>

<style>
	/* Flush with the sheet's right edge, `--sheet-width` set per destination as
	   `DeskHead.svelte` reads it. Small type: it names the source, it does not
	   compete with the sheet. */
	.text-source {
		align-self: center;
		box-sizing: border-box;
		width: 100%;
		max-width: var(--sheet-width, 816px);
		margin: 0;
		padding: 0 0 0.6rem;
		text-align: right;
		font-size: 0.7rem;
		letter-spacing: 0.04em;
		color: var(--ink-secondary, #5a5249);
	}

	@media print {
		.text-source {
			display: none;
		}
	}
</style>
