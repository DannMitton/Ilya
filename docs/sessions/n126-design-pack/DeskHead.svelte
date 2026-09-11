<!--
	DeskHead — one line across the top of the desk, above the sheet, on every
	display (N.73 S1, §2.2). It replaces `Drawer/TabBar.svelte`, which was
	mounted twice: inside the drawer on desktop, where a closed drawer took
	every destination with it (audit finding F4), and as a fixed 56 px footer
	on the phone.

	Two objects, one line. The boxed pair on the left switches Studio's two
	documents, Transcription and the Marked score. Learn and Guide sit on the
	right as set-apart text links. Placement B, ruled by Dann (N.42 §1.3): the
	pair is flush with the sheet's left edge, not the desk's.

	The pair rests as state 1c (N.42 §1.4): no sliding thumb, both words at
	equal weight, the track drawn around them. The destination in the pair is
	drawn as a card, --paper-cream inside the track's full-ink border. When the
	destination is Learn or Guide, neither member is a card, because neither is
	where the singer is.

	The pair is one tab stop with arrow keys inside it, which is the roving
	focus TabBar carried. Learn and Guide are ordinary buttons, so Tab reaches
	each of them, matching how they read: links, not segments.
-->
<script lang="ts">
	import { t, type Language } from '$lib/i18n';
	import type { TabId } from '$lib/destinations';
	import { INCLUDE_SHANE } from '$lib/wall';

	interface Props {
		activeTab: TabId;
		language: Language;
		ontabchange: (tab: TabId) => void;
	}

	let { activeTab, language, ontabchange }: Props = $props();

	const T = (key: string) => t(key, language);

	/* THE WALL. A pair whose second member compiles out is not a pair (E.44
	   §CONTRADICTIONS 6), so a wall-closed build draws no track and no
	   divider: one document, named where the pair would have been, still
	   reachable from Learn and Guide. INCLUDE_SHANE is a build-time literal,
	   so Rollup takes the dead half with it. */
	const pairIds: TabId[] = INCLUDE_SHANE ? ['transcription', 'shane'] : ['transcription'];
	const linkIds: TabId[] = ['learn', 'guide'];

	function label(id: TabId): string {
		switch (id) {
			case 'transcription': return T('tab.transcription');
			// Studio's second document. The engine codename is 'shane'; the
			// singer reads "Marked score" and « Partition annotée », ratified
			// by Dann 2026-08-19. It is not called Fit here.
			case 'shane': return T('tab.markedScore');
			case 'learn': return T('tab.learn');
			case 'guide': return T('tab.guide');
		}
	}

	/* Roving focus inside the pair, carried over from TabBar:40-62. Arrows
	   move and switch; Home and End go to the ends. With the wall closed
	   there is one member and every branch is a no-op. */
	function handlePairKeydown(event: KeyboardEvent) {
		const currentIndex = pairIds.findIndex((id) => id === activeTab);
		let newIndex = currentIndex;

		if (event.key === 'ArrowRight') {
			newIndex = (currentIndex + 1) % pairIds.length;
			event.preventDefault();
		} else if (event.key === 'ArrowLeft') {
			newIndex = (currentIndex - 1 + pairIds.length) % pairIds.length;
			event.preventDefault();
		} else if (event.key === 'Home') {
			newIndex = 0;
			event.preventDefault();
		} else if (event.key === 'End') {
			newIndex = pairIds.length - 1;
			event.preventDefault();
		}

		if (newIndex !== currentIndex && newIndex >= 0) {
			ontabchange(pairIds[newIndex]);
			document.getElementById(`tab-${pairIds[newIndex]}`)?.focus();
		}
	}
</script>

<div class="desk-head">
	<!-- aria-label carried over verbatim from TabBar's tablist rather than
	     written fresh: the ratified table has no string for this, and an
	     invented one would be untranslated French. -->
	<!-- N.73 S3 ship two. NO `aria-controls` ON THE PAIR MEMBERS. It read
	     `tabpanel-{id}`, and only one such id was ever in the DOM, so the
	     inactive member always pointed at nothing. S2 is why: it merged
	     Studio's two drawers, so the two members share one drawer and one desk
	     region, and neither owns a panel of its own. `aria-controls` is
	     optional on a `tab` in ARIA 1.2, and an absent reference beats a broken
	     one. `aria-selected` still carries the state, which is what a screen
	     reader announces. `Drawer.svelte` drops its half in the same ship. -->
	<div class="pair" class:single={pairIds.length === 1} role="tablist" aria-label={T('a11y.tabs')}>
		{#each pairIds as id (id)}
			<button
				class="pair-member"
				class:active={activeTab === id}
				role="tab"
				id="tab-{id}"
				aria-selected={activeTab === id}
				tabindex={activeTab === id ? 0 : -1}
				onclick={() => ontabchange(id)}
				onkeydown={handlePairKeydown}
			>
				{label(id)}
			</button>
		{/each}
	</div>
	<div class="links">
		{#each linkIds as id (id)}
			<button class="link" id="tab-{id}" onclick={() => ontabchange(id)}>
				{label(id)}
			</button>
		{/each}
	</div>
</div>

<style>
	/* Flush left with the SHEET's left edge, not the desk's: --sheet-width is
	   set per destination in +page.svelte, because the transcription sheet and
	   the reading sheet are different widths. Sticky, so a scrolled desk keeps
	   its destinations: that is the whole of finding F4's cure. The background
	   is inherited so it takes whichever desk tint is under it. */
	.desk-head {
		position: sticky;
		/* MEASURED, not assumed: a sticky child of a padded scroll container
		   sticks at the container's CONTENT edge, so `top: 0` leaves a strip
		   the height of the desk's top padding where the sheet slides past in
		   the open. Pulling the stuck position up by that padding closes the
		   strip. --desk-pad-top is set beside every rule in +page.svelte that
		   changes .main-content's top padding. */
		top: calc(-1 * var(--desk-pad-top, 2rem));
		z-index: 3;
		align-self: center;
		box-sizing: border-box;
		width: 100%;
		max-width: var(--sheet-width, 816px);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.35rem 0 0.6rem;
		background-color: inherit;
	}

	/* N.73 C2, ruled by Dann 2026-08-19: the desk above the page is the same
	   negative space as the desk beside it, so it takes the same token. This
	   head already owns the space beneath itself, so the gutter is its bottom
	   padding rather than a margin on the page, and nothing needs to know
	   this head's own measurements to sit the ruled distance below it. */
	@media (max-width: 767px) {
		.desk-head {
			padding-bottom: var(--portrait-gutter, 24px);
		}
	}

	/* ── The pair ────────────────────────────────────────── */

	.pair {
		display: inline-flex;
		border: 1px solid var(--ink-primary, #1a1612);
		border-radius: 4px;
		overflow: hidden;
	}

	/* Wall closed: no track, no divider, no pair. */
	.pair.single {
		border: none;
		border-radius: 0;
		overflow: visible;
	}

	.pair-member {
		border: none;
		background: transparent;
		color: var(--ink-primary, #1a1612);
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.3rem 0.7rem;
		cursor: pointer;
	}

	/* The divider, at the track's weight and full ink. */
	.pair-member + .pair-member {
		border-left: 1px solid var(--ink-primary, #1a1612);
	}

	/* Treatment C: the card. */
	.pair-member.active {
		background: var(--paper-cream, #F0EBE0);
		cursor: default;
	}

	.pair.single .pair-member.active {
		border: 1px solid var(--ink-primary, #1a1612);
		border-radius: 4px;
	}

	.pair-member:not(.active):hover {
		background: rgba(26, 22, 18, 0.06);
	}

	/* ── Learn and Guide ─────────────────────────────────── */

	.links {
		display: flex;
		align-items: center;
		gap: 0.9rem;
	}

	.link {
		border: none;
		border-bottom: 1px solid var(--ink-primary, #1a1612);
		background: transparent;
		color: var(--ink-primary, #1a1612);
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0 0 1px;
		cursor: pointer;
	}

	.link:hover {
		border-bottom-width: 2px;
		padding-bottom: 0;
	}

	.pair-member:focus-visible,
	.link:focus-visible {
		outline: 2px solid var(--ink-primary, #1a1612);
		outline-offset: 2px;
	}

	/* The desk head is chrome. The page prints; the desk does not. */
	@media print {
		.desk-head {
			display: none;
		}
	}
</style>
