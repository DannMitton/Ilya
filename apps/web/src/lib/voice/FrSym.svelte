<!--
	The resonance symbol (Dann, 2026-07-10): italic f (variable), upright
	roman subscript (label, so it cannot be misread as f × R × 1), subscript
	set slightly smaller than the base. The single source of this convention
	in the code. Screen readers announce the aria-label; the styled glyphs
	are hidden from them because "f" plus a subscript reads as noise.

	N.199 Step 1: LIFTED from `CalibrationWizard.svelte`'s `frSym` snippet with the same markup and the same two
	rules, so the roster is unchanged. The change to small capitals (ruling 14, Dann 2026-11-12) is Step 7's own
	commit, because it changes the roster.
-->
<script lang="ts">
	let { n }: { n: 1 | 2 } = $props();
</script>

<span class="fr-sym" aria-label={`f R ${n}`}><em aria-hidden="true">f</em><sub aria-hidden="true">R{n}</sub></span>

<style>
	/* The resonance symbol: italic variable, upright subscript, subscript
	   slightly smaller than the base (Dann, 2026-07-10). */
	.fr-sym em {
		font-style: italic;
		font-weight: inherit;
	}
	.fr-sym sub {
		font-style: normal;
		font-size: 0.72em;
		line-height: 1;
	}
</style>
