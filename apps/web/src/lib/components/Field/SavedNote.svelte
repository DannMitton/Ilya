<!--
	The quiet "Saved" beside a settled field (QUEUE row 62; `settle-field.ts`).
	The live region is always in the page and only its words change, so a
	screen reader hears "Saved" when it appears (`aria-live="polite"`). Quiet
	type in the field's own label colour (it inherits it); no colour that means
	error or success elsewhere in Ilya. Never printed: no control prints.
-->
<script lang="ts">
	import { t, type Language } from '$lib/i18n';

	let { shown, language }: { shown: boolean; language: Language } = $props();
</script>

<span class="saved-note" aria-live="polite">{shown ? t('field.saved', language) : ''}</span>

<style>
	.saved-note {
		font-size: 0.8em;
		color: inherit;
		opacity: 0.75;
		margin-left: 0.5em;
		white-space: nowrap;
	}

	@media print {
		.saved-note {
			display: none;
		}
	}
</style>
