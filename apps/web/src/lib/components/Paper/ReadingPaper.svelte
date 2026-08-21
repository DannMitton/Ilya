<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Language } from '$lib/i18n';

	interface Props {
		language: Language;
		content: Snippet;
	}

	let { language, content }: Props = $props();
</script>

<article class="reading-paper" lang={language === 'fr' ? 'fr' : 'en'}>
	<div class="reading-inner">
		{@render content()}
	</div>
</article>

<style>
	/* N.73 S1b §4. The reading sheet is the transcription sheet: 816px is
	   PAGE_SIZES.letter.width and 96px is MARGINS.horizontal, both from
	   `$lib/page-config.ts`, which TitlePage and SubsequentPage set on
	   `.paper-page`. The prose column lands on 624px, exactly the
	   transcription's text column, so the reading measure gets SHORTER than
	   the 656px it had at 720 minus 2rem either side, and the negative space
	   either side of the sheet is identical on all four destinations.

	   No radius. Paper takes no radius because print has no rounded corners
	   (Fable's ruled spec §3.2). The shadow is §1's one ruled value. */
	.reading-paper {
		width: 100%;
		max-width: 816px;
		margin: 0 auto;
		padding: 3rem 96px;
		background: var(--paper-cream, #F0EBE0);
		border-radius: 0;
		box-shadow: 0 3px 12px rgba(0, 0, 0, 0.35);
		min-height: 400px;
		flex-shrink: 0;
	}

	.reading-inner {
		/* Typography system for long-form reading */
	}

	/* ── Heading hierarchy ────────────────────────────────── */

	.reading-inner :global(h1) {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--ink-primary, #1a1612);
		line-height: 1.3;
		margin: 0 0 1.5rem 0;
	}

	.reading-inner :global(h2) {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 1.35rem;
		font-weight: 600;
		color: var(--ink-primary, #1a1612);
		line-height: 1.35;
		margin: 2rem 0 1rem 0;
	}

	.reading-inner :global(h3) {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 1.35rem;
		font-weight: 600;
		color: var(--ink-primary, #1a1612);
		line-height: 1.35;
		border-top: 1px solid var(--dusty-rose, #A67B7B);
		margin: 3.5rem 0 1.25rem 0;
		padding-top: 1.25rem;
	}

	/* ── Subsection headings (h4) ─────────────────────────── */

	.reading-inner :global(h4) {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--ink-primary, #1a1612);
		line-height: 1.4;
		margin: 2rem 0 0.75rem 0;
	}
	/* ── N.77 ship 1: chapter-opening bands ─────────────────

	   Ruling 6 of 2026-08-18, drawn at fidelity in
	   `docs/sessions/fable-gui-mockup_r2_2026-08-18.html` Exhibit 2. Every
	   length here is that drawing's, read from its `.room-band` rules at
	   `:92-98`. The `line-height` on the kicker and the deck is the
	   mockup's `body` rule at `:21`, which both of them inherit there.

	   TWO DEPARTURES FROM THE MOCKUP, BOTH RULED IN THE BRIEF. The colours
	   are the app's own tokens, because the mockup's `--rose` and
	   `--cobalt` are stand-ins and its closing note says so. The mockup's
	   `opacity` on the kicker and the deck is dropped, because it costs
	   contrast on a hue that already sits close to the 3:1 floor.

	   THE HORIZONTAL BLEED IS A READING OF THE DRAWING, NOT A RULING. In
	   the mockup the sheet carries no padding of its own and the band is
	   its first child at full width, so the band meets the sheet edge.
	   `.reading-paper` here carries `padding: 3rem 96px`, so the band has
	   to cancel the horizontal half of that to land in the same place. The
	   96px is `MARGINS.horizontal` from `$lib/page-config.ts`, the same
	   number `.reading-paper` sets.

	   The vertical margins are `h3`'s own, unchanged, so the gap above a
	   chapter and the gap below its title stay what the page already had. */
	.reading-inner :global(.chapter-band) {
		margin: 3.5rem -96px 1.25rem -96px;
		padding: 34px 30px 30px 30px;
		color: #fdfbf6;
	}

	.reading-inner :global(.band-learn) {
		background: var(--dusty-rose, #A67B7B);
	}

	.reading-inner :global(.band-guide) {
		background: var(--quiet-cobalt, #5C739E);
	}

	.reading-inner :global(.band-kicker) {
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 10px;
		line-height: 1.45;
		letter-spacing: 0.28em;
		text-transform: uppercase;
	}

	/* FOUR CLASSES AND ONE TYPE, AND THE COUNT IS THE WHOLE POINT.
	   `+page.svelte:3051-3061` paints every reading heading in its tab's
	   hue: `.main-content.tab-learn :global(.reading-inner h3)`, three
	   classes and one type. A band title styled at three or fewer lands
	   dusty rose on dusty rose and cobalt on cobalt, which renders a 40px
	   title that is present, sized, and completely invisible. Measured on
	   the built page 2026-08-21, before this selector was widened.
	   `.reading-paper` and the band's own colour class carry it to four,
	   which wins outright rather than on source order.

	   The heading element itself is untouched. It keeps its tag and its
	   id, because `Drawer.svelte`'s table of contents finds it by id and
	   the scroll-spy at `+page.svelte:1737` observes it by id. */
	.reading-paper .reading-inner :global(.chapter-band.band-learn h2),
	.reading-paper .reading-inner :global(.chapter-band.band-learn h3),
	.reading-paper .reading-inner :global(.chapter-band.band-guide h2),
	.reading-paper .reading-inner :global(.chapter-band.band-guide h3) {
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-weight: 700;
		font-size: 40px;
		line-height: 1.04;
		letter-spacing: -0.01em;
		color: #fdfbf6;
		border-top: none;
		margin: 10px 0 0 0;
		padding-top: 0;
	}

	.reading-inner :global(.band-deck) {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-style: italic;
		font-size: 15px;
		line-height: 1.45;
		margin-top: 12px;
		max-width: 330px;
	}


	/* ── Body text ────────────────────────────────────────── */

	.reading-inner :global(p) {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 1.05rem;
		color: var(--ink-primary, #1a1612);
		line-height: 1.75;
		margin: 0 0 1.25rem 0;
	}

	/* ── Inline elements ──────────────────────────────────── */

	.reading-inner :global(strong) {
		font-weight: 600;
	}

	.reading-inner :global(em) {
		font-style: italic;
	}

	/* IPA specimens: monospace for clarity */
	.reading-inner :global(code) {
		font-family: var(--font-mono, 'Source Code Pro', monospace);
		font-size: 0.95em;
		background: rgba(139, 154, 125, 0.1);
		padding: 0.1em 0.35em;
		border-radius: 3px;
	}

	/* ── Block quotations (Grayson citations) ─────────────── */

	.reading-inner :global(blockquote) {
		margin: 1.5rem 0;
		padding: 1rem 1.25rem;
		border-left: 3px solid var(--sage, #8B9A7D);
		background: rgba(139, 154, 125, 0.06);
		border-radius: 0 4px 4px 0;
	}

	.reading-inner :global(blockquote p) {
		font-size: 1rem;
		margin-bottom: 0.5rem;
	}

	.reading-inner :global(blockquote p:last-child) {
		margin-bottom: 0;
	}

	/* ── Lists ─────────────────────────────────────────────── */

	.reading-inner :global(ul),
	.reading-inner :global(ol) {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 1.05rem;
		color: var(--ink-primary, #1a1612);
		line-height: 1.75;
		margin: 0 0 1.25rem 0;
		padding-left: 1.5rem;
	}

	.reading-inner :global(li) {
		margin-bottom: 0.5rem;
	}

	/* ── Links ─────────────────────────────────────────────── */

	.reading-inner :global(a) {
		color: var(--dusty-rose, #A67B7B);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 2px;
		transition: color 150ms ease;
	}

	.reading-inner :global(a:hover) {
		color: var(--ink-primary, #1a1612);
	}

	/* ── Horizontal rules ──────────────────────────────────── */

	.reading-inner :global(hr) {
		border: none;
		border-top: 1px solid var(--stone-300, #d6d3d1);
		margin: 2rem 0;
	}

	/* ── Images ────────────────────────────────────────────── */

	.reading-inner :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 4px;
		margin: 1.5rem 0;
	}

	.reading-inner :global(figure) {
		margin: 1.5rem 0;
	}

	.reading-inner :global(figcaption) {
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.85rem;
		color: var(--ink-secondary, #4a4540);
		text-align: center;
		margin-top: 0.5rem;
	}

	/* ── Tables ────────────────────────────────────────────── */

	.reading-inner :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 0.95rem;
		color: var(--ink-primary, #1a1612);
		margin: 1.5rem 0;
	}

	.reading-inner :global(thead) {
		border-bottom: 2px solid var(--stone-300, #d6d3d1);
	}

	.reading-inner :global(th) {
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--ink-secondary, #4a4540);
		text-align: left;
		padding: 0.5rem 0.75rem;
		white-space: nowrap;
	}

	.reading-inner :global(td) {
		padding: 0.4rem 0.75rem;
		border-bottom: 1px solid var(--stone-200, #e7e5e4);
		line-height: 1.5;
		vertical-align: top;
	}

	.reading-inner :global(tbody tr:hover) {
		background: rgba(139, 154, 125, 0.04);
	}

	/* IPA cells: monospace for clarity */
	.reading-inner :global(td code),
	.reading-inner :global(th code) {
		font-family: var(--font-mono, 'Source Code Pro', monospace);
		font-size: 0.9em;
		background: rgba(139, 154, 125, 0.1);
		padding: 0.1em 0.3em;
		border-radius: 2px;
	}

	/* ── Responsive ────────────────────────────────────────── */

	@media (max-width: 767px) {
		/* The 96px margin is a letter page's margin, not a phone's: it would
		   leave 198px of text on a 390px screen. The phone keeps the reduced
		   padding. The shadow STAYS, as it now does on every sheet. */
		.reading-paper {
			padding: 1.5rem 1rem;
		}

		.reading-inner :global(h1) {
			font-size: 1.4rem;
		}

		.reading-inner :global(h2) {
			font-size: 1.15rem;
		}

		.reading-inner :global(table) {
			display: block;
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
		}

		.reading-inner :global(th),
		.reading-inner :global(td) {
			padding: 0.35rem 0.5rem;
			font-size: 0.85rem;
		}
	}

	/* ── Print (parity with TitlePage) ─────────────────────── */

	@media print {
		.reading-paper {
			box-shadow: none;
		}
	}
</style>
