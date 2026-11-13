<!--
	The resonance symbol (Dann, 2026-07-10): italic f (variable), upright
	roman subscript (label, so it cannot be misread as f × R × 1), subscript
	set slightly smaller than the base. The single source of this convention
	in the code. Screen readers announce the aria-label; the styled glyphs
	are hidden from them because "f" plus a subscript reads as noise.

	N.199 Step 1: LIFTED from `CalibrationWizard.svelte`'s `frSym` snippet with the same markup.

	THE SYMBOL FOLLOWS TITZE ET AL. (2015), "Toward a consensus on symbolic notation of harmonics, resonances, and formants in vocalization", JASA 137(5):
	3005-3007, doi 10.1121/1.4919349, Table I: a resonance frequency is f with the two-character subscript R1 (R2, ... Rm), the R a full capital, seated
	by Dann's ruling of 2026-11-13 15:44. The R and the numeral are one subscript, one size, one weight. The 2026-07-10 rules stand: an italic f, an
	upright subscript set slightly smaller than the base. `FrSym` is on the live roster, so this reaches every singer.
-->
<script lang="ts">
	let { n }: { n: 1 | 2 } = $props();
</script>

<span class="fr-sym" role="img" aria-label={`f R ${n}`}><em aria-hidden="true">f</em><sub aria-hidden="true">R{n}</sub></span>

<style>
	/* The resonance symbol: italic f and an upright subscript R1 or R2 (Titze et al. 2015, Table I; Dann 2026-11-13 15:44), the subscript set slightly
	   smaller than the base (Dann, 2026-07-10). The R and the numeral are one run of text, so they share one size and one weight. */
	.fr-sym em {
		font-style: italic;
		font-weight: inherit;
	}
	.fr-sym sub {
		font-style: normal;
		font-size: 0.78em;
		line-height: 1;
	}
</style>
