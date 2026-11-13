<!--
	The resonance symbol (Dann, 2026-07-10): italic f (variable), upright
	roman subscript (label, so it cannot be misread as f × R × 1), subscript
	set slightly smaller than the base. The single source of this convention
	in the code. Screen readers announce the aria-label; the styled glyphs
	are hidden from them because "f" plus a subscript reads as noise.

	N.199 Step 1: LIFTED from `CalibrationWizard.svelte`'s `frSym` snippet with the same markup and the same two
	rules (Step 1). Ruling 14 (Dann 2026-11-12) asks for a small-capital R; Step 7 set it with `all-small-caps`, and the desk's amendment of
	2026-11-13 replaced that: the served Source Sans 3 has no `smcp` feature, so the browser synthesized a thin R. The subscript is now a plain capital R
	at 0.78 em beside the numeral, in the same weight, with no synthesis, so the two read as one mark. `FrSym` is on the live roster, so this reaches every singer.
-->
<script lang="ts">
	let { n }: { n: 1 | 2 } = $props();
</script>

<span class="fr-sym" role="img" aria-label={`f R ${n}`}><em aria-hidden="true">f</em><sub aria-hidden="true">R{n}</sub></span>

<style>
	/* The resonance symbol: italic f, a subscript capital R and numeral (Dann 2026-11-12, entry 17 and ruling 14: "f(italics)R2(smallcaps
	   subscript)"). The subscript is upright and set slightly smaller than the base (Dann, 2026-07-10). It is a plain capital at 0.78 em, not a synthesized
	   small capital: the served face has no `smcp`, and a synthesized R is thinner than its numeral. */
	.fr-sym em {
		font-style: italic;
		font-weight: inherit;
	}
	.fr-sym sub {
		font-style: normal;
		font-weight: inherit;
		font-synthesis: none;
		font-size: 0.78em;
		letter-spacing: 0.02em;
		line-height: 1;
	}
</style>
