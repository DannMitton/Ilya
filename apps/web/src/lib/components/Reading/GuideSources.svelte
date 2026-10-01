<script lang="ts">
	/**
	 * The Guide's Sources section (Dann, 2026-09-27 00:59: "a Sources section to
	 * follow the licensing and acknowledgments section"; brief
	 * `docs/sessions/brief-code-guide-sources_r1_2026-09-27.md`). It renders from
	 * the registry in `$lib/sources.ts`, never from typed entries, so it cannot
	 * drift from the citations the app prints elsewhere. Words ratified
	 * 2026-09-27 01:02. Each reference prints as Insights' "Sources cited" prints
	 * it (`fullReference`), in full; in French as an OQLF notice (2026-09-30).
	 */
	import { t, type Language } from '$lib/i18n';
	import { SOURCE_GROUPS, fullReference, worksIn } from '$lib/sources';

	let { language }: { language: Language } = $props();

	const T = (key: string) => t(key, language);
</script>

<div class="chapter-band band-guide">
	<h2 id="guide-sources">{T('guide.sources.heading')}</h2>
	<div class="band-deck">{T('guide.sources.deck')}</div>
</div>

{#each SOURCE_GROUPS as group (group)}
	<h4>{T(`guide.sources.group.${group}`)}</h4>
	<ul class="guide-sources">
		{#each worksIn(group) as key (key)}
			<li>{#each fullReference(key, language) as r, j (j)}{#if r.title}<em>{r.text}</em>{:else}{r.text}{/if}{/each}</li>
		{/each}
	</ul>
{/each}

<style>
	/* The Guide's lists keep `ReadingPaper.svelte`'s indent and spacing; these
	   add only a hanging indent, as Insights' "Sources cited" sets its list. */
	.guide-sources {
		list-style: none;
	}
	.guide-sources li {
		padding-left: 1.5em;
		text-indent: -1.5em;
		overflow-wrap: anywhere;
	}
</style>
