<script lang="ts">
	/**
	 * THE STATION HEADER (N.65, the drawer's stations, ship one).
	 *
	 * ONE owner for the drawer's station label. Before this component the
	 * recipe was declared five times, in `RootPanel`, `MetadataFields`,
	 * `NotationFields`, `SongList`, and `Drawer`, because Svelte scopes a
	 * rule to the component that authors the markup. `SongList` admitted it
	 * in its own comment: "RootPanel's own .section-label, value for value."
	 * Consistency was kept by hand, so it drifted, and the drift is what
	 * Dann saw as uneven header padding on 2026-08-20.
	 *
	 * A COMPONENT RATHER THAN A `:global` RULE, and the reason is ship two.
	 * A `:global` rule fixes the CSS and leaves five copies of the markup,
	 * so ruling 2's gap would still be enforced by hand at each site, and
	 * ship two's retraction would have to add a button, `aria-expanded`, and
	 * a key to five files. Here it is one file. The markup is the thing that
	 * has to stay identical, not only the values.
	 *
	 * THE GAP IS `0.4rem`, and it is the tree's own value, not a new step.
	 * Four of the five declarations already carried it and it measures
	 * 6.39 px on the desk. The fifth, `Drawer`'s, is 1rem and is NOT a
	 * station label: it heads the table of contents in Learn and Guide, in
	 * that room's own ruled rose and cobalt. It is renamed `.toc-heading`
	 * there so the name stops claiming to be this one.
	 *
	 * WHERE THE CLOSED-HEADER STATUS GOES, when Dann writes the copy that
	 * E.27 §3.6 asks for ("Notation: defaults", "Output: nothing to print
	 * yet"): a second child of the `<h3>`, with `.station-label` taking
	 * `display: flex; justify-content: space-between; align-items: baseline`.
	 * That is one rule and one optional prop here, and no markup rework
	 * anywhere else, because every station label is now this element.
	 */
	import type { Snippet } from 'svelte';

	interface Props {
		/** The label's text. Omit when `children` draws the header itself. */
		label?: string;
		/**
		 * The label's colour. SAGE on every station, and the default is the
		 * whole answer today. It stays a parameter because `NotationFields`
		 * already took its accent as a prop, twinned on `TitleHeader` and
		 * `PageFooter`, and this component should not be the one that stops.
		 * N.73 S3 ship two settled that the accent is unconditionally sage:
		 * do not reintroduce a per-document colour.
		 */
		accent?: string;
		/**
		 * Nothing follows the header, so it carries no gap. `NotationFields`
		 * collapsed is the only case today. Its own comment states the
		 * reason and it is kept: the gap would otherwise read as slack
		 * against the anchor's padding.
		 */
		tight?: boolean;
		/**
		 * A header that is itself a control. `NotationFields` puts its
		 * disclosure button here, which is the pattern ship two extends to
		 * every station rather than the exception it looks like today.
		 */
		children?: Snippet;
	}

	let { label = '', accent = 'var(--sage)', tight = false, children = undefined }: Props = $props();
</script>

<h3 class="station-label" class:tight style="--station-accent: {accent}">
	{#if children}{@render children()}{:else}{label}{/if}
</h3>

<style>
	.station-label {
		margin: 0 0 0.4rem;
		font-family: var(--font-sans);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--station-accent, var(--sage));
	}

	.station-label.tight {
		margin-bottom: 0;
	}
</style>
