<script lang="ts" module>
	/** Re-exported so a pane that also needs the runs imports once (`InsightsPane` is at its size ceiling). */
	export { italicRuns } from '$lib/italics';
</script>

<script lang="ts">
	import { italicRuns } from '$lib/italics';

	/** A string with `*…*` runs (`$lib/italics`). Drawn as text and `<em>`, never as markup. */
	let { text }: { text: string } = $props();
</script>

{#each italicRuns(text) as run, i (i)}{#if run.title}<em>{run.text}</em>{:else}{run.text}{/if}{/each}
