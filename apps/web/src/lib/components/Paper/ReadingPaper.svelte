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
		/* THE SHEET'S SIDE PADDING AND THE BAND'S BLEED ARE ONE NUMBER.
		   N.77 ship 3. `.chapter-band` cancels this padding with a negative
		   margin so it meets the sheet edge, and for two days it cancelled a
		   hard-coded 96px while the phone's rule quietly moved the real
		   padding to 1rem. The band then hung 80px off each side and Dann
		   read `ow Ilya Works` on his phone.

		   CHANGE THIS PROPERTY, NEVER THE HORIZONTAL PADDING. Every rule that
		   wants a different side padding redeclares `--sheet-pad-x` and lets
		   the padding and the bleed follow. No rule anywhere should set
		   either one to a literal again. */
		--sheet-pad-x: 96px;
		padding: 3rem var(--sheet-pad-x);
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
	   `.reading-paper` here carries side padding, so the band cancels it to
	   land in the same place.

	   N.77 ship 3 replaced the literal that used to stand here. It read
	   `-96px`, which was true of the desk and wrong everywhere the sheet
	   padded itself differently. It is `--sheet-pad-x` now, declared once on
	   `.reading-paper` beside the padding it feeds.

	   The vertical margins are `h3`'s own, unchanged, so the gap above a
	   chapter and the gap below its title stay what the page already had. */
	.reading-inner :global(.chapter-band) {
		margin: 3.5rem calc(-1 * var(--sheet-pad-x)) 1.25rem calc(-1 * var(--sheet-pad-x));
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
		/* THE TITLE SCALES WITH THE SHEET, AND 40px SURVIVES AT THE DESK.
		   N.77 ship 6. Dann ruled 40px by eye on a desk mockup and this
		   declaration does not revise it: the clamp's upper bound is 40px and
		   the fluid term passes it at 920px of viewport, so every width from
		   the desk up renders exactly 40px. What it adds is the phone, which
		   the mockup never showed.

		   WHY A SIZE AND NOT A WRAPPING RULE. Ship 3 measured
		   `Acknowledgments` at 311.83px against a 252px band measure at 360px.
		   A single word cannot break, so no `overflow-wrap` short of
		   `break-word` saves it, and breaking a chapter title mid-word is
		   worse than the overflow. Shrinking the type is the only remedy that
		   also covers the eleven chapters nobody measured.

		   THE THREE TERMS, EACH DERIVED. The band's measure is the viewport
		   less the desk gutter and the band's own padding: at phone widths
		   `--sheet-pad-x` is 1rem, `.main-content` pads 24px a side, and the
		   band pads 30px a side, so the measure is `vw - 108`. The widest
		   unbreakable word in the twenty-four bands is `Acknowledgments`, and
		   at 40px it is 311.83px, so the largest safe size at any width is
		   `40 * (vw - 108) / 311.83`. That line is the ceiling this clamp
		   stays under, not the line it follows: `2.5vw + 17px` sits 19% below
		   it at 360px, which is the room a fallback face needs when Source
		   Sans 3 has not arrived.

		   The floor is 26px because that is what `2.5vw + 17px` returns at
		   exactly 360px, the narrowest width the brief names. Below 360px the
		   title stops shrinking, and 26px stays inside the measure down to a
		   311px viewport, which is narrower than any phone this app has seen.

		   ONE DECLARATION, NO BREAKPOINT. `.chapter-band`'s other values are
		   all unconditional and this one is too. */
		font-size: clamp(26px, calc(2.5vw + 17px), 40px);
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
	/* ── N.77 ship 2: an anchored target clears the sticky chrome ──

	   THE DEFECT. `scrollToAnchor` (`+page.svelte:1676`) uses
	   `scrollIntoView({ block: 'start' })`, which puts the target's top edge
	   on the scroll port's top edge. `.desk-head` is sticky inside that same
	   port and sits exactly there, so the target landed behind it. Found by
	   Dann on `2b85d13`: he clicked `Why only one source?`, the hash became
	   `#guide-source`, and the heading was invisible with its paragraph
	   first on screen. Measured before the fix: the heading's top at the
	   port's top edge, the chrome's bottom 41px lower, and the heading only
	   30px tall, so the whole of it was covered.

	   `scroll-margin-top` is the CSS answer, and it leaves `scrollToAnchor`
	   and its two-shot settle alone.

	   THE CHROME IS MEASURED, NOT ASSUMED. On the built page 2026-08-21,
	   1600x1000, `.desk-head` renders 41.78px on Learn and on Guide, in both
	   languages, and `top: calc(-1 * var(--desk-pad-top))` sticks it flush
	   to `.main-content`'s top edge. 42px is that height taken up to the
	   whole pixel so the chrome is cleared rather than met. The window's
	   `.header-bar` is NOT part of this: it is 48px tall and sits outside
	   the scroll port, above it, so it covers nothing.

	   The gap is a choice, not a measurement, and it is one line to change. */
	.reading-paper {
		--sticky-chrome: 42px;
		--anchor-gap: 1rem;
	}

	/* EVERY id, not a list of tags. The brief proposed `h1, h2, h3, h4,
	   p[id]`. Checked against the tree first, and it misses two kinds:
	   seven `h5` deep-link targets in Learn's consonant chapter
	   (`learn-u5-hard` and its six siblings), and `learn-u3-inventory`,
	   which ship 1 moved off a `<p>` and onto the band's deck `<div>`. No
	   `<p id>` survives in either content file, so `p[id]` would have
	   reached nothing at all. `[id]` reaches all 93 anchors and cannot
	   drift when a new one lands on a tag nobody listed. */
	.reading-inner :global([id]) {
		scroll-margin-top: calc(var(--sticky-chrome) + var(--anchor-gap));
	}

	/* A CHAPTER'S ARRIVAL IS ITS BAND, NOT ITS HEADING. The heading sits
	   inside the band, so stopping at the heading scrolls the band's top off
	   the screen. Measured before this rule: clicking `A Walkthrough` put
	   its heading on the port's top edge and left 85px of a 116px band
	   either above the port or behind the chrome.

	   The extra distance is the band's own declared values, term by term,
	   not a number read off a screenshot. 34px is `.chapter-band`'s
	   `padding-top`. 14.5px is `.band-kicker`'s line box, its `font-size:
	   10px` times its `line-height: 1.45`. 10px is the band title's
	   `margin-top`. Guide has no kicker, so it omits that term. Both totals
	   were then confirmed against the render: 58.5px on all sixteen Learn
	   bands and 44px on all eight Guide bands, identical in both languages.

	   These beat the rule above on specificity, a class and a type against
	   an attribute, so source order does not decide it. */
	.reading-inner :global(.band-guide > h2) {
		scroll-margin-top: calc(var(--sticky-chrome) + var(--anchor-gap) + 34px + 10px);
	}

	.reading-inner :global(.band-learn > h2),
	.reading-inner :global(.band-learn > h3) {
		scroll-margin-top: calc(var(--sticky-chrome) + var(--anchor-gap) + 34px + 14.5px + 10px);
	}

	/* THE DECK IS THE SAME ARRIVAL, AND THIS ONE IS BEYOND THE LETTER OF THE
	   BRIEF. `learn-u3-inventory` is a table-of-contents entry whose label is
	   the deck sentence itself (`Drawer.svelte:407`), and ship 1 put that id
	   on the deck inside the band. On the rule above alone it lands correctly
	   but decapitates its own band: the sentence sits below the chrome on a
	   rose block whose kicker and title are scrolled away. The brief's
	   condition 4 names a chapter's own entry, so this is Code's reading of
	   the reason it gives, "the band is the arrival moment, so it must be
	   what arrives". Landing the band costs the deck nothing, because the
	   deck is inside the band and stays on screen either way.

	   Two more terms than the heading rule, both declared values: 41.6px is
	   the title's line box, its `font-size: 40px` times its `line-height:
	   1.04`, and 12px is the deck's `margin-top`. Confirmed against the
	   render at 112.09px in both languages.

	   FRAGILE IN ONE DIRECTION, AND SAID PLAINLY: a band title that wrapped
	   to two lines would push the deck lower and this fixed offset would
	   clip the band's top again. Neither `Stressed Vowels` nor `Les voyelles
	   accentuées` wraps at the 756px band measure. One selector to delete if
	   Dann would rather it landed on the sentence alone. */
	.reading-inner :global(.band-learn > .band-deck) {
		scroll-margin-top: calc(var(--sticky-chrome) + var(--anchor-gap) + 34px + 14.5px + 10px + 41.6px + 12px);
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
		   padding. The shadow STAYS, as it now does on every sheet.

		   N.77 ship 3: this redeclares `--sheet-pad-x` rather than the
		   horizontal padding, so the chapter band's bleed narrows with the
		   sheet instead of overhanging it by the difference. The two vertical
		   longhands carry the 1.5rem that the shorthand used to carry; both
		   values are the ones this block already had. */
		.reading-paper {
			--sheet-pad-x: 1rem;
			padding-top: 1.5rem;
			padding-bottom: 1.5rem;
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
