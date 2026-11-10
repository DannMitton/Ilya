<script lang="ts">
	/**
	 * THE SCORE'S OVERLAYS, one mount (QUEUE row 138, T1). `MarkupPane.svelte` is at its line ceiling and mounted `ClefControls` alone; this
	 * wrapper holds that and the time signature card, so adding the card cost the pane no line.
	 */
	import type { Language } from '$lib/i18n';
	import ClefControls from './ClefControls.svelte';
	import TimeSignatureControls from './TimeSignatureControls.svelte';

	let { language, pages }: { language: Language; pages: readonly string[] | null } = $props();
</script>

<ClefControls {language} {pages} />
<TimeSignatureControls {language} {pages} />
