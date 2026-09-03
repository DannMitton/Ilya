<script lang="ts">
	/**
	 * THE STATION HEADER (N.65, the drawer's stations, ship one and ship B).
	 *
	 * ONE owner for the drawer's station label. Before this component the
	 * recipe was declared five times, in `RootPanel`, `MetadataFields`,
	 * `NotationFields`, `SongList`, and `Drawer`, because Svelte scopes a
	 * rule to the component that authors the markup. `SongList` admitted it
	 * in its own comment: "RootPanel's own .section-label, value for value."
	 * Consistency was kept by hand, so it drifted, and the drift is what
	 * Dann saw as uneven header padding on 2026-08-20.
	 *
	 * A COMPONENT RATHER THAN A `:global` RULE, and the reason is ship B.
	 * A `:global` rule fixes the CSS and leaves five copies of the markup,
	 * so ruling 2's gap would still be enforced by hand at each site, and
	 * ship B's retraction would have to add a button, `aria-expanded`, and
	 * a key to five files. Here it is one file. The markup is the thing that
	 * has to stay identical, not only the values.
	 *
	 * SHIP B MAKES THE HEADER A CONTROL, and the disclosure markup and its
	 * chevron came HERE from `NotationFields.svelte`, which had them right and
	 * had them alone. Dann's ruling of 2026-08-21: "I'd like a retraction
	 * chevron applied to every header. Every header begins a section that is
	 * retractable and expandable." Pass `ontoggle` and the header becomes a
	 * button; omit it and the header is the plain `<h3>` it always was. THE
	 * VOICE ANCHOR PASSES NEITHER, on Dann's explicit ruling: it has a header
	 * and no contents, and collapsing it would hide `Calibrate`, the only
	 * entry to the ritual, for no height.
	 *
	 * THE GAP IS `0.4rem`, and it is the tree's own value, not a new step.
	 * Four of the five declarations already carried it and it measures
	 * 6.39 px on the desk. The fifth, `Drawer`'s, is 1rem and is NOT a
	 * station label: it heads the table of contents in Learn and Guide, in
	 * that room's own ruled rose and cobalt. It is renamed `.toc-heading`
	 * there so the name stops claiming to be this one.
	 *
	 * N.108 INCREMENT 1: THE UPPERCASE LABEL RECIPE LEFT THIS ROW AND WENT
	 * ONTO THE GROUP BAND. It did not change and it was not deleted; it moved
	 * up one level. Under the three groups the band above a station says PIECE
	 * or TEXT or SCORE MARKUP in 0.7 rem, 600, 0.12 em, uppercase, in white on
	 * full colour, and that IS this recipe, reversed. The build brief ruled it:
	 * "Label recipe from `StationHeader.svelte`."
	 *
	 * SO THE STATION'S OWN NAME BECOMES A NAME AGAIN: 0.95 rem in
	 * `--ink-primary`, sentence case, the way the prototype draws it
	 * (`n108-drawer-prototype_r2_2026-09-02.html`, `.station-name`). Two
	 * uppercase registers stacked, the band's and the row's, would have said
	 * the same thing twice at two sizes. The strings are untouched: every one
	 * of them is already sentence case in `i18n.ts` and was being uppercased
	 * by CSS.
	 *
	 * WHAT THIS COSTS, AND IT IS RECORDED RATHER THAN HIDDEN: the `accent`
	 * prop no longer colours a station's name, because a station name is ink
	 * now. It still colours a header that draws no button, and there are none
	 * of those in the drawer today. It is kept because deleting a prop is a
	 * separate change from restyling a row, and because the caller that passes
	 * it (`NotationFields`) carries a ruling about which colour it passes.
	 *
	 * WHERE THE CLOSED-HEADER STATUS GOES, when Dann writes the copy that
	 * E.27 §3.6 asks for ("Notation: defaults", "Output: nothing to print
	 * yet"): the `status` snippet below, a second child of the header, with
	 * the label taking the flexible column so the status sits at the right.
	 * SHIP B FILLS THAT SLOT ON ONE HEADER ONLY. SHIFT LYRICS puts its
	 * placed-syllable counter there, on Dann's ratification of 2026-08-21.
	 * Whether the two can share the slot is NOT ESTABLISHED and is Dann's,
	 * once he writes the copy; nothing here decides it, and a header that
	 * wanted both would render both in this one span.
	 */
	import type { Snippet } from 'svelte';

	interface Props {
		/** The label's text. Omit when `children` draws the header itself. */
		label?: string;
		/**
		 * The label's colour. SAGE on every station but one, and SHIFT LYRICS
		 * is the exception: `--deeper-lavender`, because lavender marks the
		 * marked score. It stays a parameter because `NotationFields`
		 * already took its accent as a prop, twinned on `TitleHeader` and
		 * `PageFooter`, and this component should not be the one that stops.
		 */
		accent?: string;
		/**
		 * Nothing follows the header, so it carries no gap. A SHUT STATION IS
		 * ALWAYS THIS CASE and does not have to say so: the `tight` class is
		 * applied whenever the header is a control and the section is shut.
		 * The reason is `NotationFields`'s own and it is unchanged: the gap
		 * would otherwise read as slack against the anchor's padding.
		 */
		tight?: boolean;
		/**
		 * A header that draws its own contents rather than taking a string.
		 * Nothing uses it since ship B moved the disclosure button in here,
		 * and it is kept because it costs one line and a header with a mark
		 * in it is a thing this drawer has wanted before.
		 */
		children?: Snippet;
		/**
		 * Whether the section this header names is open. Read by the chevron's
		 * rotation and by `aria-expanded`. Ignored without `ontoggle`.
		 */
		expanded?: boolean;
		/**
		 * The singer's gesture on the header. ITS PRESENCE IS WHAT MAKES THE
		 * HEADER A CONTROL: no `ontoggle`, no button and no chevron.
		 */
		ontoggle?: () => void;
		/** The `id` of the body this header opens, for `aria-controls`. */
		controls?: string;
		/**
		 * The quiet right-hand slot. See the note above on the closed-header
		 * status line. SHIFT LYRICS's counter is its only occupant today.
		 */
		status?: Snippet;
	}

	let {
		label = '',
		accent = 'var(--sage)',
		tight = false,
		children = undefined,
		expanded = false,
		ontoggle = undefined,
		controls = undefined,
		status = undefined,
	}: Props = $props();

	/* A shut station never carries the gap, so no caller has to remember to
	   say so. `tight` stays a prop for the one case that is shut-like without
	   being shut. */
	const isTight = $derived(tight || (ontoggle !== undefined && !expanded));
</script>

<h3 class="station-label" class:tight={isTight} style="--station-accent: {accent}">
	{#if ontoggle}
		<button
			class="station-disclosure"
			aria-expanded={expanded}
			aria-controls={expanded ? controls : undefined}
			onclick={ontoggle}
		>
			<span class="station-name">{#if children}{@render children()}{:else}{label}{/if}</span>
			{#if status}<span class="station-status">{@render status()}</span>{/if}
			<svg class="chevron-icon" class:expanded width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg>
		</button>
	{:else}
		{#if children}{@render children()}{:else}{label}{/if}
	{/if}
</h3>

<style>
	/* N.108 increment 1. The uppercase recipe moved onto the group band; see
	   the header of this file. What is left here is a row that names a station
	   in ink, at the size a name is read at.

	   THE `--station-accent` FALLBACK STAYS on the no-button branch, which is
	   the only branch it ever reached in the new dress: a header with no
	   `ontoggle` still draws whatever colour its caller asks for. */
	.station-label {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.95rem;
		font-weight: 400;
		letter-spacing: normal;
		text-transform: none;
		color: var(--ink-primary);
	}

	/* `tight` no longer moves anything: the row carries no bottom margin under
	   the three groups, because `.station-body`'s own padding is the gap and
	   `.station`'s hairline is the boundary. The class is kept, and so is the
	   `isTight` derivation that sets it, because a shut station being tight is
	   a fact this component knows and a future dress may want. It costs one
	   empty rule and no measurement. */
	.station-label.tight {
		margin-bottom: 0;
	}

	/* N.43, and ship B extends it from one station to every station: the whole
	   header row is the control, so the tap target is the control's own
	   visible box. The E.36 touch ruling of 2026-08-10 prefers that over an
	   invisible centred region, and says two exemptions exist and a third must
	   not be created silently. This creates none. The 44px floor is twinned on
	   .toc-chevron (Drawer.svelte), the only other control in the app that
	   meets it. The chevron is the TOC's own 10x10 glyph, so no new affordance
	   enters the vocabulary. */
	/* Top-aligned, not centred. Centring a 0.7rem label inside a 44px box
	   put NOTATION's label 25px below its rule while ANALYSIS sat 6px
	   below its own. Dann caught the 19px. The target stays 44 by 44 and
	   simply extends downward from the label rather than being centred on it,
	   so no exemption is created.

	   `align-items: baseline` rather than `flex-start`, which is ship B's one
	   change to this rule and it is what the status slot needs: the counter is
	   0.75rem against the label's 0.7rem, and two boxes aligned at their tops
	   set two different baselines. A baseline group with free space below it
	   still sits at the top of the cross axis, so the label does not move; the
	   chevron takes `align-self: flex-start` because a replaced element
	   baselines on its bottom edge and would otherwise drop. MEASURED against
	   the same header before the change rather than reasoned. */
	/* N.108 increment 1. The row grows to the prototype's `.station-header`:
	   40 px on a fine pointer, 44 on a coarse one, with 8 px of its own above
	   and below. It was a bare `padding: 0` row whose height was the label's,
	   and the group frame it now sits in has no 2 px sage rule to sit against,
	   so the row's own box is what separates one station from the next.

	   `align-items: center` REPLACES `align-items: baseline`, and the reason
	   the baseline was there is spent. Ship B chose it because a 0.7 rem label
	   and a 0.75 rem status set two different tops; the name is 0.95 rem now
	   and the row has a fixed minimum height, so what has to agree is the two
	   boxes' centres, not their baselines. The chevron loses its
	   `align-self: flex-start` for the same reason: it was there to stop a
	   replaced element baselining on its bottom edge, and there is no baseline
	   group left to fall out of. MEASURED against the same header before the
	   change rather than reasoned. */
	.station-disclosure {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		width: 100%;
		min-height: 40px;
		padding: 8px 0;
		background: none;
		border: none;
		font: inherit;
		color: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
		text-align: left;
		cursor: pointer;
	}

	/* Takes the flexible column so the status and the chevron sit at the
	   right, in that order, whether or not a status is drawn. */
	.station-name {
		flex: 1;
		min-width: 0;
	}

	/* THE CHEVRON STAYS OUTERMOST RIGHT, on every header, with or without a
	   status beside it. A chevron that sits in a different place on one header
	   than on every other breaks the pattern Dann ruled. */
	.station-status {
		flex-shrink: 0;
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0;
		text-transform: none;
		color: var(--ink-tertiary);
		font-variant-numeric: tabular-nums;
	}

	/* An accordion, not a tree. Dann's correction of 2026-08-11 is the
	   durable rule and it is unchanged: the first pass borrowed
	   .toc-chevron's right-to-down rotation, which is a TREE convention and
	   belongs to a hierarchy, not to a panel. The glyph is still the TOC's;
	   only the rotation differs. .toc-chevron is a different control and
	   keeps its own rotation.

	   THE CHEVRON POINTS THE WAY THE PANEL WILL GROW. That is the rule the
	   two values express, and the two values were traded on 2026-08-20
	   because N.73 S3 moved the panel and the rule then demanded the
	   opposite pair.

	   Bottom-anchored, the panel grew UPWARD: closed pointed up ("more is up
	   there") and open pointed down ("push it back"). S3 pinned NOTATION to
	   the TOP of the drawer, where it grows DOWNWARD, so closed points down
	   and open points up. Found by Dann walking ship one; the two rotations
	   had been left saying the old geometry. EVERY STATION GROWS DOWNWARD, so
	   ship B gives all of them this same pair rather than deriving a second. */
	.chevron-icon {
		flex-shrink: 0;
		transform: rotate(90deg);
		transition: transform 150ms ease;
		color: var(--ink-tertiary);
	}

	.chevron-icon.expanded {
		transform: rotate(-90deg);
	}

	@media (pointer: coarse) {
		.station-disclosure {
			min-height: 44px;
		}
	}
</style>
