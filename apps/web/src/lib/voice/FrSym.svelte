<!--
	The resonance symbol (Dann, 2026-07-10): italic f (variable), upright
	roman subscript (label, so it cannot be misread as f × R × 1), subscript
	set slightly smaller than the base. The single source of this convention
	in the code. Screen readers announce the aria-label; the styled glyphs
	are hidden from them because "f" plus a subscript reads as noise.

	N.199 Step 1: LIFTED from `CalibrationWizard.svelte`'s `frSym` snippet with the same markup and the same two
	rules (Step 1). THE CHANGE TO SMALL CAPITALS (ruling 14, Dann 2026-11-12) is Step 7's own commit, because it changes the
	roster, and the roster is live for every singer at the ship.
-->
<script lang="ts">
	let { n }: { n: 1 | 2 } = $props();
</script>

<span class="fr-sym" aria-label={`f R ${n}`}><em aria-hidden="true">f</em><sub aria-hidden="true">R{n}</sub></span>

<style>
	/* The resonance symbol: italic f, small-capital R, subscript numeral (Dann 2026-11-12, entry 17 and ruling 14: "f(italics)R2(smallcaps
	   subscript)"). The subscript is upright, set slightly smaller than the base (Dann, 2026-07-10), and now in small capitals. */
	.fr-sym em {
		font-style: italic;
		font-weight: inherit;
	}
	.fr-sym sub {
		font-style: normal;
		font-variant-caps: all-small-caps;
		font-size: 0.78em;
		letter-spacing: 0.02em;
		line-height: 1;
	}
</style>
