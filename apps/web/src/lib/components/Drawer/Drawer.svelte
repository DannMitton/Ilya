<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import { SectionSet } from './sections.svelte';
	import type { Destination, TabId } from '$lib/destinations';

	interface Props {
		width: number;
		collapsed: boolean;
		isMobile: boolean;
		language: Language;
		/** Where the singer is. Every branch in this file asks this. */
		destination: Destination;
		/**
		 * The four-way surface id, and the ONLY thing it is used for here is
		 * `data-tab`. N.73 S3 ship two kept that attribute: no selector and no
		 * script in the tree reads it, but it is the one mark on the drawer
		 * that tells Studio's two documents apart, which is exactly what a
		 * harness needs to prove S2's invariant that flipping the pair changes
		 * nothing in the drawer. Ship one's walk used it for that.
		 */
		activeTab: TabId;
		activeHeadingId: string | null;
		tabTransitionClass: string;
		rootPanel: Snippet;
		shanePanel?: Snippet;
		/**
		 * NOTATION (item N.7). Rendered ONCE, outside the tab switch, anchored
		 * below the scrolling panel so it holds the same position on every tab
		 * that shows it. Dann's ruling, 2026-08-06: predictable, and within a
		 * thumb's reach on mobile, where the mobile rule on `.drawer` gives the
		 * overlay the whole viewport height. It said `calc(100dvh - 56px)` and
		 * named the line, until N.73 S1 deleted the tab bar that owned the
		 * 56 px; the rule is named here rather than numbered, because a line
		 * number in a comment rots.
		 *
		 * A snippet rather than props, matching rootPanel and shanePanel, so
		 * the state stays in +page.svelte and nothing is drilled through here.
		 */
		notationPanel?: Snippet;
		/**
		 * PIECE (N.73 S3 ship one). The metadata block and its provenance
		 * line, lifted out of `RootPanel` so they can be pinned. They sit
		 * above NOTATION in the top anchor, which is what the mockup draws
		 * (`fable-gui-mockup_r1_2026-08-18.html:309-314`) and what its caption
		 * states: "Piece and NOTATION are pinned top."
		 */
		pieceAnchor?: Snippet;
		/**
		 * THE VOICE ANCHOR (N.73 S3 ship one), pinned to the foot of the
		 * column. Gated by its own INCLUDE_SHANE at the call site, so an
		 * absent snippet here means the wall is up, not that the line broke.
		 */
		voiceAnchor?: Snippet;
		/**
		 * THE CALIBRATION TAKEOVER (N.73 S3 ship one). E.27's takeover:
		 * "replaces the entire drawer, shows a single back affordance at the
		 * top, restores the station accordion in its prior state on exit, and
		 * is never entered by a chevron"
		 * (`fable-ruling-e27-four-tab-consolidation_2026-08-05.md`).
		 *
		 * RENDERED ALWAYS AND HIDDEN, not conditionally mounted, and the
		 * reason is measured rather than aesthetic: the page's mirror of the
		 * voice (`shaneFormants`, `shaneVoiceName`) is published by an
		 * `$effect` inside the wizard, so a wizard that is not mounted leaves
		 * the marked score's page with no voice and its Print button disabled
		 * until the singer opens the takeover once. Hiding keeps every one of
		 * today's behaviours and costs one CSS rule.
		 */
		voiceTakeover?: Snippet;
		/** Whether the takeover has the drawer. */
		takeoverActive?: boolean;
		/** The back affordance's press. */
		onexittakeover?: () => void;
		ontogglecollapse: () => void;
		ontabchange: (tab: TabId) => void;
		onheadingnavigate: (id: string) => void;
	}

	let { width, collapsed, isMobile, language, destination, activeTab, activeHeadingId = null, tabTransitionClass, rootPanel, shanePanel, notationPanel, pieceAnchor, voiceAnchor, voiceTakeover, takeoverActive = false, onexittakeover, ontogglecollapse, ontabchange, onheadingnavigate }: Props = $props();

	/* ── THE SILHOUETTE (N.65). Dann's ruling, 2026-08-20, DRAWN at
	   `docs/sessions/lip-handle-silhouette_r1_2026-08-20.html`, whose SVG
	   paths are the specification and whose numbers are read out below
	   rather than paraphrased.

	   The drawer's right edge and the handle are ONE outline. It runs down
	   from the top, stops dead at the handle's top-left terminus, turns
	   ninety degrees, runs along the handle's top, rounds the two RIGHT-hand
	   corners as a squircle, returns along the handle's bottom, turns ninety
	   degrees again, and continues to the bottom. THE HANDLE HAS NO LEFT
	   WALL: its inside is the drawer's inside. Both junctions are mitred.

	   WHY AN SVG. `.drawer-clip` carries `overflow: hidden` and the pull sits
	   at `left: 100%`, outside it, which is exactly the boundary one path has
	   to cross. `clip-path` on shaped elements would still be two boxes
	   agreeing by hand, which is the defect. One `<path>` outside the clip
	   crosses nothing, and the drawing IS a path, so the specification
	   transfers literally: the mitre is `stroke-linejoin`, and the squircle
	   is the drawing's own cubic rather than an approximation of it.

	   WHY THE HEIGHT IS BOUND. A path takes user units, not percentages, so
	   the viewBox has to know the drawer's height or the stroke and the
	   squircle distort. `bind:clientHeight` makes user units equal CSS pixels
	   exactly. */
	let drawerHeight = $state(0);

	/* THE PROTRUSION IS THE TREE'S, NOT THE DRAWING'S. 20 is N.73 S1b's ruled
	   protrusion, walked on both displays; the drawing is a schematic at other
	   proportions. What comes from the drawing is the SHAPE.

	   BOTH REACH THE STYLESHEET AS CUSTOM PROPERTIES on the root `<aside>`, so
	   the tab, its touch extension, and the phone's own width all read the two
	   numbers declared here. Before this ship the protrusion was typed a
	   second time as `.drawer-lip { width: 20px }` and the height a second
	   time as `height: 76px`, which is how an outline and a tab come to
	   disagree. */
	const LIP_W = 20;
	/* DOUBLED FROM 76, RULED BY DANN 2026-08-21: "Please double the height of
	   the paper handle and re-centre the chevron within the enlarged paper
	   handle." His reason, given after: "to increase target size for users on
	   both desktop and mobile."

	   THE SHAPE DOES NOT CHANGE. R below derives from the WIDTH, so the
	   squircle's two corners stand exactly as Dann's drawing ruled them and
	   only the straight run between them lengthens. */
	const LIP_H = 152;
	/* One weight for one line. 2px is `.drawer-body`'s own edge, and it is
	   also what the drawing's 5-in-56 stroke scales to at 20px: 1.79. */
	const STROKE = 2;
	/* The squircle, as the drawing draws it. Its corner spans 18 of a 56
	   protrusion, and each cubic control handle runs 14 of that 18. A circle
	   would use 0.5523; the longer handle is what makes it square-ish. */
	const R = LIP_W * (18 / 56);
	const K = R * (14 / 18);

	const silhouette = $derived.by(() => {
		const h = drawerHeight;
		if (!h) return null;
		const xEdge = STROKE / 2;
		const xOut = STROKE + LIP_W - STROKE / 2;
		const top = h / 2 - LIP_H / 2;
		const bot = h / 2 + LIP_H / 2;
		const n = (v: number) => Math.round(v * 100) / 100;
		/* The two right corners, written once and used by both paths. */
		const rightSide =
			`L ${n(xOut - R)} ${n(top)} ` +
			`C ${n(xOut - R + K)} ${n(top)} ${n(xOut)} ${n(top + R - K)} ${n(xOut)} ${n(top + R)} ` +
			`L ${n(xOut)} ${n(bot - R)} ` +
			`C ${n(xOut)} ${n(bot - R + K)} ${n(xOut - R + K)} ${n(bot)} ${n(xOut - R)} ${n(bot)}`;
		return {
			h,
			w: STROKE + LIP_W,
			/* The interior. Closed along the edge line, where the drawer's own
			   fill is already the same colour, so the handle reads as a notch
			   in the drawer rather than a box beside it. */
			fill: `M ${n(xEdge)} ${n(top)} ${rightSide} L ${n(xEdge)} ${n(bot)} Z`,
			/* The outline. OPEN at both ends, because it is cut off by the top
			   and the bottom of the drawer, and open on the handle's left,
			   because the handle has no left wall. */
			outline: `M ${n(xEdge)} 0 L ${n(xEdge)} ${n(top)} ${rightSide} L ${n(xEdge)} ${n(bot)} L ${n(xEdge)} ${n(h)}`,
		};
	});

	/* Studio's two documents. The reading destinations, Learn and Guide, have
	   no piece, no notation and no voice, so none of the three anchors is
	   theirs. One name for one expression, which was previously written out
	   twice in this file. */
	const isStudio = $derived(destination === 'studio');

	/* N.65 ship B. THE OPEN SET AND ITS TOGGLE LEFT THIS FILE. They were
	   declared inline here and drove Learn and Guide's table of contents;
	   §B.2's instruction was to extract them so the drawer has ONE
	   retraction mechanism and no second one is written for the stations.
	   `sections.svelte.ts` is that code, moved, and this is one instance of
	   it. THIS ONE PERSISTS NOTHING: a remembered table of contents is not
	   what §B.4 asks to remember, and the stations' instance, which does
	   persist, lives in `+page.svelte`. */
	const toc = new SectionSet();
	let drawerContentEl: HTMLElement | undefined = $state();

	/* ── Parent chain lookup for auto-expand ───────────────── */

	const learnUnitChildren: Record<string, string> = {
		'learn-u1-song': 'learn-unit-1', 'learn-u1-alphabet': 'learn-unit-1',
		'learn-u1-familiar': 'learn-unit-1', 'learn-u1-signs': 'learn-unit-1', 'learn-u1-yo': 'learn-unit-1',
		'learn-u1-glyphs': 'learn-unit-1', 'learn-u1-try': 'learn-unit-1',
		'learn-u2-meaning': 'learn-unit-2', 'learn-u2-moves': 'learn-unit-2', 'learn-u2-dictionary': 'learn-unit-2',
		'learn-u2-sounds': 'learn-unit-2', 'learn-u2-try': 'learn-unit-2',
		'learn-u3-inventory': 'learn-unit-3', 'learn-u3-note-o': 'learn-unit-3', 'learn-u3-interpalatal': 'learn-unit-3', 'learn-u3-iotated': 'learn-unit-3',
		'learn-u3-yo': 'learn-unit-3', 'learn-u3-try': 'learn-unit-3',
		'learn-u4-akanye': 'learn-unit-4', 'learn-u4-ikanye': 'learn-unit-4', 'learn-u4-reconstitution': 'learn-unit-4',
		'learn-u4-try': 'learn-unit-4',
		'learn-u5-familiar': 'learn-unit-5', 'learn-u5-pairs': 'learn-unit-5', 'learn-u5-attention': 'learn-unit-5',
		'learn-u5-fixed': 'learn-unit-5', 'learn-u5-signs': 'learn-unit-5', 'learn-u5-devoicing': 'learn-unit-5',
		'learn-u5-try': 'learn-unit-5',
		'learn-u6-what': 'learn-unit-6', 'learn-u6-signals': 'learn-unit-6', 'learn-u6-stops': 'learn-unit-6',
		'learn-u6-paired': 'learn-unit-6', 'learn-u6-clusters': 'learn-unit-6', 'learn-u6-practice': 'learn-unit-6',
		'learn-u6-velari': 'learn-unit-6',
		'learn-u7-two': 'learn-unit-7', 'learn-u7-voiced': 'learn-unit-7', 'learn-u7-stops': 'learn-unit-7',
		'learn-u7-boundary': 'learn-unit-7', 'learn-u7-deletion': 'learn-unit-7', 'learn-u7-mergers': 'learn-unit-7',
		'learn-u7-unusual': 'learn-unit-7', 'learn-u7-geminates': 'learn-unit-7', 'learn-u7-tryit': 'learn-unit-7',
	};

	function getParentIds(id: string | null): string[] {
		if (!id) return [];
		if (learnUnitChildren[id]) return [learnUnitChildren[id]];
		if (['guide-what','guide-paste','guide-source','guide-ai','guide-role','guide-limits','guide-future','guide-fit-forecast','guide-fit-characteristics','guide-fit-notation'].includes(id)) return ['guide-how'];
		if (['guide-walk-interface','guide-walk-tabs','guide-walk-metadata','guide-walk-transcribe','guide-walk-analysis','guide-walk-notation','guide-walk-print'].includes(id)) return ['guide-walkthrough'];
		if (['guide-grayson','guide-mitton','guide-claude','guide-kimi'].includes(id)) return ['guide-contributors'];
		if (id === 'guide-grayson-intro') return ['guide-contributors', 'guide-grayson'];
		if (id === 'guide-mitton-note') return ['guide-contributors', 'guide-mitton'];
		return [];
	}

	const collapsibleIds = new Set([
		'learn-unit-1','learn-unit-2','learn-unit-3','learn-unit-4','learn-unit-5','learn-unit-6','learn-unit-7',
		'guide-how','guide-walkthrough','guide-contributors','guide-grayson','guide-mitton'
	]);

	/* ── Interactions ──────────────────────────────────────── */

	function handleTocClick(id: string) {
		toc.open([...getParentIds(id), ...(collapsibleIds.has(id) ? [id] : [])]);
		onheadingnavigate(id);
	}

	/* ── Auto-expand parents when active heading changes ──── */

	let autoExpandTimer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (!activeHeadingId) return;
		if (autoExpandTimer) clearTimeout(autoExpandTimer);
		autoExpandTimer = setTimeout(() => {
			const parents = getParentIds(activeHeadingId);
			if (parents.length === 0) return;
			/* `open` returns early when nothing changes, which this effect
			   depends on: reassigning an equal set would make it re-run. */
			toc.open(parents);
		}, 150);
	});

	/* ── Auto-scroll Drawer to keep active item visible ───── */

	$effect(() => {
		if (!activeHeadingId || !drawerContentEl) return;
		requestAnimationFrame(() => {
			if (!drawerContentEl) return;
			const btn = drawerContentEl.querySelector(`[data-heading-id="${activeHeadingId}"]`) as HTMLElement | null;
			if (!btn) return;
			const cRect = drawerContentEl.getBoundingClientRect();
			const bRect = btn.getBoundingClientRect();
			if (bRect.top < cRect.top + 20 || bRect.bottom > cRect.bottom - 60) {
				btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		});
	});

	/* The takeover's scroll, E.27: exit "restores the station accordion in its
	   prior state." The RETRACT states survive on their own, because nothing
	   here unmounts. The scroll does not: `display: none` drops the box, and a
	   box with no layout has no scrollTop to keep.

	   `$effect.pre`, NOT `$effect`, and this was MEASURED rather than reasoned.
	   A plain `$effect` runs AFTER the DOM update, so by the time it read
	   `scrollTop` the element was already stowed and it read 0; backing out of
	   a drawer scrolled to 300 landed at 0, which is the thing this code
	   exists to prevent. A pre-effect runs before the update, while the
	   element still has its layout. The RESTORE is the mirror case and has to
	   wait for the layout to come back, so it is deferred one frame. */
	let stowedScrollTop = 0;
	let takeoverWas = false;
	$effect.pre(() => {
		const active = takeoverActive;
		if (active === takeoverWas) return;
		takeoverWas = active;
		const el = drawerContentEl;
		if (!el) return;
		if (active) {
			stowedScrollTop = el.scrollTop;
		} else {
			requestAnimationFrame(() => {
				el.scrollTop = stowedScrollTop;
			});
		}
	});

	function isActive(id: string): boolean {
		return activeHeadingId === id;
	}

	function sectionContainsActive(id: string): boolean {
		if (!activeHeadingId) return false;
		return getParentIds(activeHeadingId).includes(id);
	}
</script>

<aside class="drawer" class:collapsed data-tab={activeTab} style="--lip-w: {LIP_W}px; --lip-h: {LIP_H}px; {isMobile ? '' : `width: ${collapsed ? 0 : width}px`}" aria-label={t('a11y.drawer', language)} bind:clientHeight={drawerHeight}>
	<div class="drawer-clip">
	<div class="drawer-body" style="{isMobile ? '' : `width: ${width}px`}">
		<!-- THE TOP ANCHOR (N.73 S3 ship one). Piece, then NOTATION, pinned
		     above the scroll. E.36 §1.4, ratified by Dann 2026-08-19
		     (`fable-ruling-s0-slate-closed_2026-08-19.md`, ruling 1). This
		     replaces the E.29 shape, where NOTATION was pinned to the FOOT of
		     the column and the metadata block scrolled away with everything
		     else. Studio only: Learn and Guide have no piece in front of the
		     reader. -->
		{#if isStudio && (pieceAnchor || notationPanel)}
			<div class="drawer-anchor drawer-anchor-top" class:stowed={takeoverActive}>
				{@render pieceAnchor?.()}
				{@render notationPanel?.()}
			</div>
		{/if}
		<!-- N.73 S3 ship two. THE DRAWER IS NOT A TABPANEL, and it stopped
		     being one at S2. This box carried `role="tabpanel"`,
		     `id="tabpanel-{activeTab}"` and `aria-labelledby="tab-{activeTab}"`
		     from the four-tab shape, where each destination had its own drawer.
		     S2 merged Studio's two, so the pair's two members now share this
		     box byte for byte, and a panel that does not change when the tab
		     changes is not that tab's panel. Only one id was ever in the DOM,
		     so the inactive pair member's `aria-controls` pointed at nothing.
		     The drawer is what its own outer element already says it is: an
		     `<aside>` named `a11y.drawer`, a complementary landmark that
		     stands beside the desk on every destination. `aria-controls` is
		     optional on a `tab` in ARIA 1.2, and an absent reference beats a
		     broken one. `DeskHead` drops its half in the same ship. -->
		<div
			class="drawer-content {tabTransitionClass}"
			class:stowed={takeoverActive}
			bind:this={drawerContentEl}
		>
				<!-- N.73 S2. ONE Studio drawer. Both panels render, always, in this
				     order, on both of Studio's documents, so nothing in the drawer
				     appears, disappears, or moves when the singer flips the pair.
				     Their own {#if} guards still suppress score-only content, and
				     shanePanel carries its own INCLUDE_SHANE gate. Learn and Guide
				     are untouched. -->
				{#if isStudio}
					{@render rootPanel()}
					{@render shanePanel?.()}
				{:else if destination === 'learn'}
					<nav class="learn-toc" aria-label={language === 'fr' ? 'Table des matières' : 'Table of contents'}>
						<h2 class="toc-heading toc-heading-learn">{language === 'fr' ? 'LEÇONS' : 'LEARN'}</h2>
						<ul class="toc-list">
							<li>
								<button class="toc-link toc-title" class:active={isActive('learn-title')} data-heading-id="learn-title" onclick={() => handleTocClick('learn-title')}>
									{language === 'fr' ? 'La diction lyrique russe pour chanteurs' : 'Russian Lyric Diction for Singers'}
								</button>
							</li>
							<li>
								<button class="toc-link" class:active={isActive('learn-about')} data-heading-id="learn-about" onclick={() => handleTocClick('learn-about')}>
									{language === 'fr' ? 'À propos de ce module' : 'About This Module'}
								</button>
							</li>
							<li>
								<button class="toc-link" class:active={isActive('learn-arc')} data-heading-id="learn-arc" onclick={() => handleTocClick('learn-arc')}>
									{language === 'fr' ? 'L\u2019arc d\u2019apprentissage' : 'The Learning Arc'}
								</button>
							</li>

							<!-- ── Unit 1 ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={toc.has('learn-unit-1')} class:contains-active={sectionContainsActive('learn-unit-1')} onclick={() => toc.toggle('learn-unit-1')} aria-label={t('a11y.tocToggle', language)}><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link" class:active={isActive('learn-unit-1')} data-heading-id="learn-unit-1" onclick={() => handleTocClick('learn-unit-1')}>
										{language === 'fr' ? '1 \u00b7 Les lettres' : '1 \u00b7 The Letters'}
									</button>
								</div>
								<div class="toc-children" class:expanded={toc.has('learn-unit-1')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u1-song')} data-heading-id="learn-u1-song" onclick={() => handleTocClick('learn-u1-song')}>{language === 'fr' ? 'La chanson de l\u2019alphabet' : 'The Alphabet Song'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u1-alphabet')} data-heading-id="learn-u1-alphabet" onclick={() => handleTocClick('learn-u1-alphabet')}>{language === 'fr' ? 'L\u2019alphabet' : 'The Alphabet'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u1-familiar')} data-heading-id="learn-u1-familiar" onclick={() => handleTocClick('learn-u1-familiar')}>{language === 'fr' ? 'Ce que vous connaissez d\u00e9j\u00e0' : 'What You Already Know'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u1-signs')} data-heading-id="learn-u1-signs" onclick={() => handleTocClick('learn-u1-signs')}>{language === 'fr' ? 'Les deux signes' : 'The Two Signs'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u1-yo')} data-heading-id="learn-u1-yo" onclick={() => handleTocClick('learn-u1-yo')}>{language === 'fr' ? 'Note sur \u27E8\u0401\u27E9' : 'A Note on \u27E8\u0401\u27E9'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u1-glyphs')} data-heading-id="learn-u1-glyphs" onclick={() => handleTocClick('learn-u1-glyphs')}>{language === 'fr' ? 'Le tableau des glyphes' : 'The Glyph Table'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u1-try')} data-heading-id="learn-u1-try" onclick={() => handleTocClick('learn-u1-try')}>{language === 'fr' ? 'Essayez' : 'Try This'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Unit 2 ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={toc.has('learn-unit-2')} class:contains-active={sectionContainsActive('learn-unit-2')} onclick={() => toc.toggle('learn-unit-2')} aria-label={t('a11y.tocToggle', language)}><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link" class:active={isActive('learn-unit-2')} data-heading-id="learn-unit-2" onclick={() => handleTocClick('learn-unit-2')}>
										{language === 'fr' ? '2 \u00b7 L\u2019accent tonique' : '2 \u00b7 Stress'}
									</button>
								</div>
								<div class="toc-children" class:expanded={toc.has('learn-unit-2')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u2-meaning')} data-heading-id="learn-u2-meaning" onclick={() => handleTocClick('learn-u2-meaning')}>{language === 'fr' ? 'L\u2019accent change le sens' : 'Stress changes meaning'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u2-moves')} data-heading-id="learn-u2-moves" onclick={() => handleTocClick('learn-u2-moves')}>{language === 'fr' ? 'L\u2019accent se d\u00e9place' : 'Stress moves'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u2-dictionary')} data-heading-id="learn-u2-dictionary" onclick={() => handleTocClick('learn-u2-dictionary')}>{language === 'fr' ? 'Probl\u00e8me de dictionnaire' : 'A dictionary problem'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u2-sounds')} data-heading-id="learn-u2-sounds" onclick={() => handleTocClick('learn-u2-sounds')}>{language === 'fr' ? 'Comment l\u2019accent sonne' : 'How stress sounds'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u2-try')} data-heading-id="learn-u2-try" onclick={() => handleTocClick('learn-u2-try')}>{language === 'fr' ? 'Essayez' : 'Try this'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Unit 3 ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={toc.has('learn-unit-3')} class:contains-active={sectionContainsActive('learn-unit-3')} onclick={() => toc.toggle('learn-unit-3')} aria-label={t('a11y.tocToggle', language)}><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link" class:active={isActive('learn-unit-3')} data-heading-id="learn-unit-3" onclick={() => handleTocClick('learn-unit-3')}>
										{language === 'fr' ? '3 \u00b7 Les voyelles accentu\u00e9es' : '3 \u00b7 Stressed Vowels'}
									</button>
								</div>
								<div class="toc-children" class:expanded={toc.has('learn-unit-3')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u3-inventory')} data-heading-id="learn-u3-inventory" onclick={() => handleTocClick('learn-u3-inventory')}>{language === 'fr' ? 'Ce sont les voyelles accentu\u00e9es qui constituent les cibles' : 'Stressed vowels are the targets'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u3-note-o')} data-heading-id="learn-u3-note-o" onclick={() => handleTocClick('learn-u3-note-o')}>{language === 'fr' ? 'Un mot sur le /o/' : 'A note on /o/'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u3-interpalatal')} data-heading-id="learn-u3-interpalatal" onclick={() => handleTocClick('learn-u3-interpalatal')}>{language === 'fr' ? 'Deux voyelles changent de couleur au voisinage des consonnes molles' : 'Two vowels change colour near soft consonants'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u3-iotated')} data-heading-id="learn-u3-iotated" onclick={() => handleTocClick('learn-u3-iotated')}>{language === 'fr' ? 'Quatre lettres vocaliques portent une consonne cach\u00e9e' : 'Four vowel letters carry a hidden consonant'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u3-yo')} data-heading-id="learn-u3-yo" onclick={() => handleTocClick('learn-u3-yo')}>{language === 'fr' ? '\u27E8\u0451\u27E9 est toujours accentu\u00e9' : '\u27E8\u0451\u27E9 is always stressed'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u3-try')} data-heading-id="learn-u3-try" onclick={() => handleTocClick('learn-u3-try')}>{language === 'fr' ? 'Essayez dans Ilya' : 'Try this in Ilya'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Unit 4 ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={toc.has('learn-unit-4')} class:contains-active={sectionContainsActive('learn-unit-4')} onclick={() => toc.toggle('learn-unit-4')} aria-label={t('a11y.tocToggle', language)}><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link" class:active={isActive('learn-unit-4')} data-heading-id="learn-unit-4" onclick={() => handleTocClick('learn-unit-4')}>
										{language === 'fr' ? '4 \u00b7 La r\u00e9duction vocalique' : '4 \u00b7 Vowel Reduction'}
									</button>
								</div>
								<div class="toc-children" class:expanded={toc.has('learn-unit-4')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u4-akanye')} data-heading-id="learn-u4-akanye" onclick={() => handleTocClick('learn-u4-akanye')}>{language === 'fr' ? '\u27E8\u043E\u27E9 et \u27E8\u0430\u27E9 sans accent' : '\u27E8\u043E\u27E9 and \u27E8\u0430\u27E9 when unstressed'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u4-ikanye')} data-heading-id="learn-u4-ikanye" onclick={() => handleTocClick('learn-u4-ikanye')}>{language === 'fr' ? '\u27E8\u0435\u27E9 et \u27E8\u044F\u27E9 vers [\u026A]' : '\u27E8\u0435\u27E9 and \u27E8\u044F\u27E9 toward [\u026A]'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u4-reconstitution')} data-heading-id="learn-u4-reconstitution" onclick={() => handleTocClick('learn-u4-reconstitution')}>{language === 'fr' ? 'La reconstitution' : 'Reconstitution'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u4-try')} data-heading-id="learn-u4-try" onclick={() => handleTocClick('learn-u4-try')}>{language === 'fr' ? 'Essayez dans Ilya' : 'Try this in Ilya'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Unit 5 ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={toc.has('learn-unit-5')} class:contains-active={sectionContainsActive('learn-unit-5')} onclick={() => toc.toggle('learn-unit-5')} aria-label={t('a11y.tocToggle', language)}><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link" class:active={isActive('learn-unit-5')} data-heading-id="learn-unit-5" onclick={() => handleTocClick('learn-unit-5')}>
										{language === 'fr' ? '5 \u00b7 Les consonnes' : '5 \u00b7 The Consonants'}
									</button>
								</div>
								<div class="toc-children" class:expanded={toc.has('learn-unit-5')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u5-familiar')} data-heading-id="learn-u5-familiar" onclick={() => handleTocClick('learn-u5-familiar')}>{language === 'fr' ? 'Le syst\u00e8me consonantique' : 'The consonant system'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u5-pairs')} data-heading-id="learn-u5-pairs" onclick={() => handleTocClick('learn-u5-pairs')}>{language === 'fr' ? 'Paires vois\u00e9es-non vois\u00e9es' : 'Voiced-voiceless pairs'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u5-attention')} data-heading-id="learn-u5-attention" onclick={() => handleTocClick('learn-u5-attention')}>{language === 'fr' ? 'Attention cibl\u00e9e' : 'Focused attention'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u5-fixed')} data-heading-id="learn-u5-fixed" onclick={() => handleTocClick('learn-u5-fixed')}>{language === 'fr' ? 'Duret\u00e9 ou mollesse fixe' : 'Fixed hardness or softness'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u5-signs')} data-heading-id="learn-u5-signs" onclick={() => handleTocClick('learn-u5-signs')}>{language === 'fr' ? 'Les deux signes' : 'The two signs'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u5-devoicing')} data-heading-id="learn-u5-devoicing" onclick={() => handleTocClick('learn-u5-devoicing')}>{language === 'fr' ? 'D\u00e9voisement final' : 'Final devoicing'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u5-try')} data-heading-id="learn-u5-try" onclick={() => handleTocClick('learn-u5-try')}>{language === 'fr' ? 'Essayez dans Ilya' : 'Try this in Ilya'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Unit 6 ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={toc.has('learn-unit-6')} class:contains-active={sectionContainsActive('learn-unit-6')} onclick={() => toc.toggle('learn-unit-6')} aria-label={t('a11y.tocToggle', language)}><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link" class:active={isActive('learn-unit-6')} data-heading-id="learn-unit-6" onclick={() => handleTocClick('learn-unit-6')}>
										{language === 'fr' ? '6 \u00b7 La palatalisation' : '6 \u00b7 Palatalization'}
									</button>
								</div>
								<div class="toc-children" class:expanded={toc.has('learn-unit-6')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u6-what')} data-heading-id="learn-u6-what" onclick={() => handleTocClick('learn-u6-what')}>{language === 'fr' ? 'Qu\u2019est-ce que la palatalisation\u00A0?' : 'What palatalization is'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u6-signals')} data-heading-id="learn-u6-signals" onclick={() => handleTocClick('learn-u6-signals')}>{language === 'fr' ? 'Rep\u00E9rer la palatalisation \u00E0 l\u2019\u00E9crit' : 'Signals on the page'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u6-stops')} data-heading-id="learn-u6-stops" onclick={() => handleTocClick('learn-u6-stops')}>{language === 'fr' ? 'Les six fronti\u00E8res' : 'What stops the spread'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u6-paired')} data-heading-id="learn-u6-paired" onclick={() => handleTocClick('learn-u6-paired')}>{language === 'fr' ? 'Appari\u00E9es et non appari\u00E9es' : 'Paired versus unpaired'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u6-clusters')} data-heading-id="learn-u6-clusters" onclick={() => handleTocClick('learn-u6-clusters')}>{language === 'fr' ? 'R\u00E9gressive dans les groupes' : 'Regressive in clusters'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u6-practice')} data-heading-id="learn-u6-practice" onclick={() => handleTocClick('learn-u6-practice')}>{language === 'fr' ? 'Mise en pratique' : 'Putting it together'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u6-velari')} data-heading-id="learn-u6-velari" onclick={() => handleTocClick('learn-u6-velari')}>{language === 'fr' ? 'Le i v\u00E9laire [\u0268]' : 'Velar-i [\u0268]'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Unit 7 ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={toc.has('learn-unit-7')} class:contains-active={sectionContainsActive('learn-unit-7')} onclick={() => toc.toggle('learn-unit-7')} aria-label={t('a11y.tocToggle', language)}><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link" class:active={isActive('learn-unit-7')} data-heading-id="learn-unit-7" onclick={() => handleTocClick('learn-unit-7')}>
										{language === 'fr' ? '7 \u00b7 Assimilation et fronti\u00e8res' : '7 \u00b7 Assimilation and Boundaries'}
									</button>
								</div>
								<div class="toc-children" class:expanded={toc.has('learn-unit-7')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-two')} data-heading-id="learn-u7-two" onclick={() => handleTocClick('learn-u7-two')}>{language === 'fr' ? 'Deux formes d\u2019assimilation' : 'Two kinds of assimilation'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-voiced')} data-heading-id="learn-u7-voiced" onclick={() => handleTocClick('learn-u7-voiced')}>{language === 'fr' ? 'Vois\u00e9e rencontre sourde' : 'Voiced meets voiceless'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-stops')} data-heading-id="learn-u7-stops" onclick={() => handleTocClick('learn-u7-stops')}>{language === 'fr' ? 'Les limites du voisement' : 'What stops the spread'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-boundary')} data-heading-id="learn-u7-boundary" onclick={() => handleTocClick('learn-u7-boundary')}>{language === 'fr' ? 'D\u2019un mot \u00e0 l\u2019autre' : 'Across word boundaries'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-deletion')} data-heading-id="learn-u7-deletion" onclick={() => handleTocClick('learn-u7-deletion')}>{language === 'fr' ? 'L\u2019effacement consonantique' : 'Consonant deletion'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-mergers')} data-heading-id="learn-u7-mergers" onclick={() => handleTocClick('learn-u7-mergers')}>{language === 'fr' ? 'Fusions et absorptions' : 'Mergers and acquisitions'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-unusual')} data-heading-id="learn-u7-unusual" onclick={() => handleTocClick('learn-u7-unusual')}>{language === 'fr' ? '\u0441\u043A\u0443\u0447\u043D\u043E et \u0447\u0442\u043E' : '\u0441\u043A\u0443\u0447\u043D\u043E and \u0447\u0442\u043E'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-geminates')} data-heading-id="learn-u7-geminates" onclick={() => handleTocClick('learn-u7-geminates')}>{language === 'fr' ? 'Les g\u00e9min\u00e9es' : 'Geminates'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-tryit')} data-heading-id="learn-u7-tryit" onclick={() => handleTocClick('learn-u7-tryit')}>{language === 'fr' ? '\u00C0 vous de jouer' : 'Try this in Ilya'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Section 8 + closing items ── -->
							<li>
								<div class="toc-parent">
									<span class="toc-chevron-spacer" aria-hidden="true"></span>
									<button class="toc-link" class:active={isActive('learn-coda')} data-heading-id="learn-coda" onclick={() => handleTocClick('learn-coda')}>
										{language === 'fr' ? '8 \u00b7 Les inclassables' : '8 \u00b7 What These Rules Do Not Teach'}
									</button>
								</div>
							</li>
							<li>
								<button class="toc-link" class:active={isActive('learn-try')} data-heading-id="learn-try" onclick={() => handleTocClick('learn-try')}>
									{language === 'fr' ? 'Essayez' : 'Try This'}
								</button>
							</li>
							<li>
								<button class="toc-link" class:active={isActive('learn-notation')} data-heading-id="learn-notation" onclick={() => handleTocClick('learn-notation')}>
									{language === 'fr' ? 'Note sur la notation' : 'A Note on Notation'}
								</button>
							</li>
						</ul>
					</nav>
				{:else if destination === 'guide'}
					<nav class="learn-toc guide-toc" aria-label={language === 'fr' ? 'Table des matières du Guide' : 'Guide table of contents'}>
						<h2 class="toc-heading toc-heading-guide">GUIDE</h2>
						<ul class="toc-list">

							<!-- ── How Ilya Works ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={toc.has('guide-how')} class:contains-active={sectionContainsActive('guide-how')} onclick={() => toc.toggle('guide-how')} aria-label={t('a11y.tocToggle', language)}><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link toc-title" class:active={isActive('guide-how')} data-heading-id="guide-how" onclick={() => handleTocClick('guide-how')}>
										{language === 'fr' ? 'Comment fonctionne Ilya' : 'How Ilya Works'}
									</button>
								</div>
								<div class="toc-children" class:expanded={toc.has('guide-how')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('guide-what')} data-heading-id="guide-what" onclick={() => handleTocClick('guide-what')}>{language === 'fr' ? 'Que fait Ilya?' : 'What does Ilya do?'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-paste')} data-heading-id="guide-paste" onclick={() => handleTocClick('guide-paste')}>{language === 'fr' ? 'Saisie d\u2019un texte russe' : 'Pasting a Russian text'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-source')} data-heading-id="guide-source" onclick={() => handleTocClick('guide-source')}>{language === 'fr' ? 'Pourquoi une seule source?' : 'Why only one source?'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-ai')} data-heading-id="guide-ai" onclick={() => handleTocClick('guide-ai')}>{language === 'fr' ? 'Ilya et l\u2019IA' : 'Is Ilya an AI tool?'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-role')} data-heading-id="guide-role" onclick={() => handleTocClick('guide-role')}>{language === 'fr' ? 'R\u00f4le de l\u2019utilisateur' : 'Your role as user'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-limits')} data-heading-id="guide-limits" onclick={() => handleTocClick('guide-limits')}>{language === 'fr' ? 'Limites d\u2019Ilya' : 'Limitations'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-future')} data-heading-id="guide-future" onclick={() => handleTocClick('guide-future')}>{language === 'fr' ? 'O\u00f9 va Ilya?' : 'Where is Ilya headed?'}</button></li>
								<li><button class="toc-link toc-sub" class:active={isActive('guide-fit-forecast')} data-heading-id="guide-fit-forecast" onclick={() => handleTocClick('guide-fit-forecast')}>{language === 'fr' ? 'Fit pr\u00e9voit, il ne d\u00e9clare pas' : 'Fit forecasts, it doesn\u2019t declare'}</button></li>
								<li><button class="toc-link toc-sub" class:active={isActive('guide-fit-characteristics')} data-heading-id="guide-fit-characteristics" onclick={() => handleTocClick('guide-fit-characteristics')}>{language === 'fr' ? 'Caract\u00e9ristiques vocales' : 'Voice characteristics'}</button></li>
								<li><button class="toc-link toc-sub" class:active={isActive('guide-fit-notation')} data-heading-id="guide-fit-notation" onclick={() => handleTocClick('guide-fit-notation')}>{language === 'fr' ? 'Conventions de notation de Fit' : 'Fit\u2019s notation conventions'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Walkthrough ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={toc.has('guide-walkthrough')} class:contains-active={sectionContainsActive('guide-walkthrough')} onclick={() => toc.toggle('guide-walkthrough')} aria-label={t('a11y.tocToggle', language)}><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link toc-title" class:active={isActive('guide-walkthrough')} data-heading-id="guide-walkthrough" onclick={() => handleTocClick('guide-walkthrough')}>
										{language === 'fr' ? 'Une visite guidée' : 'A Walkthrough'}
									</button>
								</div>
								<div class="toc-children" class:expanded={toc.has('guide-walkthrough')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('guide-walk-interface')} data-heading-id="guide-walk-interface" onclick={() => handleTocClick('guide-walk-interface')}>{language === 'fr' ? 'L’interface en un coup d’œil' : 'The interface at a glance'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-walk-tabs')} data-heading-id="guide-walk-tabs" onclick={() => handleTocClick('guide-walk-tabs')}>{language === 'fr' ? 'Naviguer entre les onglets' : 'Navigating the tabs'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-walk-metadata')} data-heading-id="guide-walk-metadata" onclick={() => handleTocClick('guide-walk-metadata')}>{language === 'fr' ? 'Renseigner les métadonnées' : 'Entering metadata'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-walk-transcribe')} data-heading-id="guide-walk-transcribe" onclick={() => handleTocClick('guide-walk-transcribe')}>{language === 'fr' ? 'Transcrire' : 'Transcribing'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-walk-analysis')} data-heading-id="guide-walk-analysis" onclick={() => handleTocClick('guide-walk-analysis')}>{language === 'fr' ? 'Analyser les mots' : 'Analysing words'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-walk-notation')} data-heading-id="guide-walk-notation" onclick={() => handleTocClick('guide-walk-notation')}>{language === 'fr' ? 'Les préférences de notation' : 'Notation preferences'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-walk-print')} data-heading-id="guide-walk-print" onclick={() => handleTocClick('guide-walk-print')}>{language === 'fr' ? 'Imprimer et réinitialiser' : 'Printing and resetting'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Contributors ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={toc.has('guide-contributors')} class:contains-active={sectionContainsActive('guide-contributors')} onclick={() => toc.toggle('guide-contributors')} aria-label={t('a11y.tocToggle', language)}><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link toc-title" class:active={isActive('guide-contributors')} data-heading-id="guide-contributors" onclick={() => handleTocClick('guide-contributors')}>
										{language === 'fr' ? 'Collaborateurs' : 'Contributors'}
									</button>
								</div>
								<div class="toc-children" class:expanded={toc.has('guide-contributors')}><div class="toc-children-inner"><ul class="toc-subsections">

									<!-- Craig Grayson -->
									<li>
										<div class="toc-parent toc-parent-nested">
											<button class="toc-chevron toc-chevron-nested" class:expanded={toc.has('guide-grayson')} class:contains-active={sectionContainsActive('guide-grayson')} onclick={() => toc.toggle('guide-grayson')} aria-label={t('a11y.tocToggle', language)}><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
											<button class="toc-link toc-sub" class:active={isActive('guide-grayson')} data-heading-id="guide-grayson" onclick={() => handleTocClick('guide-grayson')}>Craig Grayson</button>
										</div>
										<div class="toc-children" class:expanded={toc.has('guide-grayson')}><div class="toc-children-inner"><ul class="toc-subsections">
											<li><button class="toc-link toc-deep" class:active={isActive('guide-grayson-intro')} data-heading-id="guide-grayson-intro" onclick={() => handleTocClick('guide-grayson-intro')}>{language === 'fr' ? 'Introduction \u00e0 Russian Lyric Diction' : 'Introduction to Russian Lyric Diction'}</button></li>
										</ul></div></div>
									</li>

									<!-- Dann Mitton -->
									<li>
										<div class="toc-parent toc-parent-nested">
											<button class="toc-chevron toc-chevron-nested" class:expanded={toc.has('guide-mitton')} class:contains-active={sectionContainsActive('guide-mitton')} onclick={() => toc.toggle('guide-mitton')} aria-label={t('a11y.tocToggle', language)}><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
											<button class="toc-link toc-sub" class:active={isActive('guide-mitton')} data-heading-id="guide-mitton" onclick={() => handleTocClick('guide-mitton')}>Dann Mitton</button>
										</div>
										<div class="toc-children" class:expanded={toc.has('guide-mitton')}><div class="toc-children-inner"><ul class="toc-subsections">
											<li><button class="toc-link toc-deep" class:active={isActive('guide-mitton-note')} data-heading-id="guide-mitton-note" onclick={() => handleTocClick('guide-mitton-note')}>{language === 'fr' ? 'Mot du cr\u00e9ateur' : "Builder's Note"}</button></li>
										</ul></div></div>
									</li>

									<li><button class="toc-link toc-sub" class:active={isActive('guide-claude')} data-heading-id="guide-claude" onclick={() => handleTocClick('guide-claude')}>Claude</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-kimi')} data-heading-id="guide-kimi" onclick={() => handleTocClick('guide-kimi')}>Kimi</button></li>
								</ul></div></div>
							</li>

							<!-- Licences -->
							<li><button class="toc-link" class:active={isActive('guide-licences')} data-heading-id="guide-licences" onclick={() => handleTocClick('guide-licences')}>{language === 'fr' ? 'Licences et remerciements' : 'Licences and Acknowledgments'}</button></li>
						</ul>
					</nav>
				{/if}
		</div>
		<!-- THE BOTTOM ANCHOR (N.73 S3 ship one). One line, the voice.
		     NOTATION used to be pinned here; it is at the top now. -->
		{#if isStudio && voiceAnchor}
			<div class="drawer-anchor drawer-anchor-bottom" class:stowed={takeoverActive}>
				{@render voiceAnchor()}
			</div>
		{/if}
		<!-- THE CALIBRATION TAKEOVER (N.73 S3 ship one). Always in the tree on
		     Studio and hidden until it is entered; see the `voiceTakeover` prop
		     for why it is not a conditional mount. It is a SIBLING of the three
		     regions above and hides all of them, which is E.27's "replaces the
		     entire drawer": NOTATION and the voice line are not visible during
		     the ritual. Its back affordance reuses `inspector.back`, a ratified
		     string that had no call site left in the tree, so the takeover
		     writes no new French. -->
		{#if isStudio && voiceTakeover}
			<div class="drawer-takeover" class:stowed={!takeoverActive}>
				<div class="takeover-head">
					<button type="button" class="takeover-back" onclick={() => onexittakeover?.()}>
						{t('inspector.back', language)}
					</button>
				</div>
				<div class="takeover-body">
					{@render voiceTakeover()}
				</div>
			</div>
		{/if}
	</div>
	</div>
	<!-- THE PULL, one control on every display (N.73 S1 §2.7, Dann's ruling
	     of 2026-08-19). No visible word: "fewer text elements onscreen is good
	     to allow the user to focus on their own texts, not controls." The
	     ratified word is the accessible name instead, and aria-expanded says
	     the state, so the name does not change under the singer.

	     The chevron points the way the drawer will MOVE when pressed: right
	     when it is closed and about to arrive, left when it is open and about
	     to leave. The SVG is drawn pointing right and flipped by CSS. -->
	<!-- THE SILHOUETTE (N.65), ON EVERY DISPLAY. A sibling of `.drawer-clip`
	     rather than a child, for the same reason the pull is one: the clip
	     would cut it at the drawer's edge, which is the one place this shape
	     exists to cross. Decorative and inert; the pull below is the control.

	     IT NOW DRAWS ON THE PHONE. Dann sent a picture of the desktop handle
	     and ruled it on 2026-08-21: "This is the appearance I want on mobile."
	     He named the defect by what he could see: "I can see the left edge of
	     the paper handle (tab)." That edge is `.drawer-lip`'s own painted box,
	     and the silhouetted class below is what stops it painting.

	     The old exclusion argued that the phone has no drawer edge for a
	     handle to join, because `.drawer-body` sets `border-right: none`
	     there. That is an argument about a border, not about the outline: the
	     silhouette IS the edge it joins, and it carries its own. What the
	     phone still does not get is the LIFT; see `filter: none` in the phone
	     block below, whose reason is the 400ms slide and not this shape. -->
	{#if silhouette}
		<svg
			class="lip-silhouette"
			width={silhouette.w}
			height={silhouette.h}
			viewBox="0 0 {silhouette.w} {silhouette.h}"
			aria-hidden="true"
			focusable="false"
		>
			<path class="sil-fill" d={silhouette.fill} />
			<path class="sil-line" d={silhouette.outline} />
		</svg>
	{/if}
	<!-- `silhouetted` IS UNCONDITIONAL NOW, N.65, Dann's ruling of 2026-08-21.
	     It was `class:silhouetted={!isMobile}`. It is written into the class
	     attribute rather than left as a directive bound to `true`, because a
	     directive that cannot be false is a condition nobody can read. The
	     class and its rules stay so the reasoning below stays with them. -->
	<button
		class="drawer-lip silhouetted"
		onclick={ontogglecollapse}
		aria-label={t('drawer.pull', language)}
		aria-expanded={!collapsed}
		title={t('drawer.pull', language)}
	>
		<svg class="lip-chevron" aria-hidden="true" width="14" height="20" viewBox="0 0 14 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<polyline points="3,2 11,10 3,18" />
		</svg>
	</button>
</aside>

<style>
	.drawer {
		position: relative;
		display: flex;
		flex-direction: row;
		height: 100%;
		flex-shrink: 0;
		transition: width 1500ms cubic-bezier(0.22, 1, 0.36, 1);
		/* ── THE LIFT (N.65), ON THE WHOLE DRAWER ─────────────────────
		   Dann's ruling, 2026-08-20, and this is the SECOND placement. It
		   was on `.lip-silhouette` and that was wrong, in the way he named:
		   that SVG is a 22px strip, so it could not cover its own shadow,
		   the blur bloomed inward across the drawer's paper, and the handle
		   read as a pill floating beside the drawer.

		   THE DRAWING IS THE REFERENCE and it says why this element.
		   `docs/sessions/lip-handle-silhouette_r1_2026-08-20.html`, option
		   C: its filled path is `M0 0 L150 0 ... L0 300 Z`, the WHOLE
		   drawer with the handle's bump on it, not a strip. A drop-shadow
		   renders behind its own element, so wherever the shape is opaque
		   its shadow is invisible, and the only shadow that shows is the
		   one off the right edge, on the desk.

		   `.drawer` is the element that already contains both the drawer
		   body and the handle's SVG, so the filter traces the union of the
		   two. The body is an opaque full-height box and hides its own
		   shadow with no measurement needed.

		   THE VALUES ARE UNCHANGED: `0 3px 12px rgba(0, 0, 0, 0.35)` is
		   N.73 S1b's one ruled shadow, the paper's own.

		   THE HAZARD WAS CHECKED, NOT DISCOVERED. `filter` makes a stacking
		   context AND a containing block for absolute and fixed
		   descendants. The only `position: fixed` in this subtree is
		   `.drawer` itself, which its own filter cannot re-root, and the
		   three absolute descendants (`.lip-silhouette`, `.drawer-lip`, and
		   its `::before`) already resolved against `.drawer`. Measured
		   before and after on all three states; nothing moved. */
		filter: drop-shadow(0 3px 12px rgba(0, 0, 0, 0.35));
	}

	.drawer.collapsed {
		width: 0px;
	}

	.drawer-clip {
		/* Clips the pinned-width body as drawer animates — lip lives outside this */
		flex: 1;
		min-width: 0;
		overflow: hidden;
		position: relative;
	}

	.drawer-body {
		height: 100%;
		overflow: hidden;
		background: var(--drawer-bg);
		display: flex;
		flex-direction: column;
		/* THE LAST `2px double` IS GONE, ruled by Dann 2026-08-20 on his walk
		   of `f59f7d2`. The desk argued this one could stay because it is a
		   vertical spine rather than a horizontal rule. HIS ANSWER, AND HE IS
		   RIGHT: that is a distinction in the stylesheet and not in anyone's
		   eye. It is the same mark. One boundary treatment means one mark,
		   everywhere, whichever way it runs. */
		/* TRANSPARENT, NOT DELETED. The silhouette's SVG paints this edge
		   now, outside `.drawer-clip`, but the 2px still has to be reserved
		   or the content would slide under the line. N.65, Dann's ruling of
		   2026-08-20. It was `2px solid var(--sage)`. */
		border-right: 2px solid transparent;
	}


	.drawer-content {
		flex: 1;
		overflow-y: auto;
	}

	/* ── The anchors (N.7, and N.73 S3's second one) ─────── */
	/* Siblings of .drawer-content, not children, so neither scrolls away.
	   flex-shrink: 0 because .drawer-content owns the flexible height and
	   these blocks must keep their own; without it a long panel would
	   compress them rather than scroll behind them.

	   Side padding is 1rem, matching .root-panel and .shane-panel, so what
	   is pinned keeps the same left edge as what scrolls.

	   THE RULE IS SAGE, AND IT IS THE SAME RULE EVERY BOUNDARY IN THIS
	   DRAWER DRAWS. This paragraph used to argue the opposite: that a
	   shelf shared by two documents must not carry either one's identity
	   colour, so the anchors took .drawer-body's 2px double ink rather
	   than the sage of RootPanel's .console-section. That argument is
	   spent. Sage stopped being one document's colour when N.73 S3 ship
	   two made NOTATION's accent unconditionally sage and the S0 slate
	   kept lavender to the voice anchor alone, so every station label in
	   the drawer is already sage on both documents. See .drawer-anchor-top
	   for what the rule means now and who ruled it. */
	.drawer-anchor {
		flex-shrink: 0;
		background: var(--drawer-bg);
	}

	/* N.73 S3. Piece and NOTATION, pinned above the scroll.

	   WHAT THE RULE MEANS, RULED BY DANN 2026-08-20 ON HIS WALK OF N.65
	   SHIP ONE. A 2px sage horizontal is the drawer's ONE boundary
	   treatment, and it means "a region ends here." There is no second
	   treatment and no hierarchy among them. Four rules draw it: this one,
	   .drawer-anchor-bottom, .takeover-head, and .console-section's pair
	   in RootPanel.svelte, which is the one this value came from. Match
	   that rule if you ever add a fifth, and do not invent a weight, a
	   style, or a colour to say that one boundary outranks another.

	   All three rules in this file were `2px double var(--ink-primary)`
	   until that ruling. Nothing in the source ever said why the style was
	   `double`, which is the question Dann had to ask, and asking it is
	   what retired it.

	   HE GAVE UP SOMETHING KNOWINGLY, so do not restore it as a fix. The
	   old pair distinguished a FRAME boundary, the ink double around the
	   pinned shelves and the takeover, from a STATION boundary, the sage
	   between Analysis and its neighbours. One treatment cannot say which
	   is which. He ruled that a drawer with one horizontal is worth more
	   than a drawer that grades its horizontals.

	   The direction is unchanged: this rule faces DOWN, toward the scroll
	   it caps, and the bottom anchor's is its mirror. Bottom padding is
	   12px, the value the old bottom-pinned NOTATION anchor carried; there
	   is no 6px top here, because .root-panel's own metadata block opens
	   the region and brings its own. */
	.drawer-anchor-top {
		display: flex;
		flex-direction: column;
		/* NO GAP AND NO VERTICAL PADDING, N.65 ship one, Dann's walk. Piece
		   and Notation are stations, so they answer to the station recipe in
		   RootPanel.svelte like every other one: each brings its own 6px above
		   and below, and Notation brings the rule between them. A gap or a
		   padding here would land on top of that and make these two the only
		   stations spaced differently, which is the defect. */
		gap: 0;
		/* SIDE MARGIN, NOT SIDE PADDING, and that is what insets the rule.
		   Ruled by Dann 2026-08-20: the line above SOURCE ran full bleed to
		   the left margin while NOTATION's started 1rem in, and every station
		   rule must share one inset. A border draws on the border box, so
		   1rem of PADDING sits inside it and the rule spans the whole drawer;
		   1rem of MARGIN sits outside it and the rule starts where the
		   content starts. Every station rule in RootPanel.svelte is already
		   inset, because those boxes sit inside `.root-panel`'s own 1rem.
		   This is the same 1rem, moved to the other side of the border.
		   Twinned on `.drawer-anchor-bottom` and `.takeover-head`. */
		padding: 0;
		margin: 0 1rem;
		border-bottom: 2px solid var(--sage);
	}

	/* N.73 S3. The voice. VoiceAnchor.svelte draws its own 9px 1rem padding,
	   so this shelf adds none: two paddings would meet in the middle of one
	   line. */
	.drawer-anchor-bottom {
		/* The 1rem came here from `VoiceAnchor`'s own `.voice-line`, so this
		   rule is inset like every other. Same device as
		   `.drawer-anchor-top`: margin outside the border, not padding
		   inside it. The voice line keeps its 9px above and below. */
		padding: 0;
		margin: 0 1rem;
		/* LAVENDER, AND IT IS DANN'S OWN SYSTEM APPLIED RATHER THAN AN
		   EXCEPTION TO IT. Ruled 2026-08-20 on his walk. Sage marks
		   transcription work and lavender marks score and voice work, and
		   this rule belongs to the voice, which is lavender's carrier under
		   the S0 ruling of 2026-08-19
		   (`claude/ruling-lavender-marks-the-marked-score_2026-08-19.md`).
		   The rule above SHIFT LYRICS went lavender in the last pass for the
		   same reason.

		   THE SAME TOKEN AS THAT ONE, `--deeper-lavender` #8E7E9B, which is
		   also the app bar's `.header-bar.tab-shane` fill and the score
		   intake's border. NO SECOND LAVENDER ENTERS: `--surround-marked` is
		   this hue at 60 percent toward white, a desk tint, and it is not
		   this. */
		border-top: 2px solid var(--deeper-lavender);
	}

	/* ── The takeover (N.73 S3) ──────────────────────────── */
	/* Takes .drawer-content's place in the column when it has the drawer:
	   same flex:1, same min-height:0, so a long ritual scrolls inside itself
	   rather than pushing the back affordance off the top. */
	.drawer-takeover {
		flex: 1;
		min-width: 0;
		min-height: 0;
		display: flex;
		flex-direction: column;
		background: var(--drawer-bg);
	}

	.takeover-head {
		flex-shrink: 0;
		/* Its 1rem moved outside the border too, so the takeover's one rule
		   is inset like every other. See `.drawer-anchor-top`. */
		padding: 6px 0;
		margin: 0 1rem;
		/* Dann ruled 2026-08-23: the takeover's rule matches the lavender
		   `.wizard-phase` border-top in CalibrationWizard.svelte, because the
		   takeover is the calibration ritual, and lavender is kept to that and
		   the voice anchor (S0 slate, ruling 3). */
		border-bottom: 2px solid var(--deeper-lavender);
	}

	/* The ONE back affordance, E.27. Quiet by construction: this is the way
	   out of a ritual, not an invitation to leave it. The 44px floor is the
	   same device the drawer's own pull and NotationFields' disclosure use. */
	.takeover-back {
		display: inline-flex;
		align-items: center;
		padding: 0.35rem 0;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--ink-secondary);
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.takeover-back:hover {
		color: var(--ink-primary);
	}

	@media (pointer: coarse) {
		.takeover-back {
			min-height: 44px;
			min-width: 44px;
		}
	}

	.takeover-body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
	}

	/* What the takeover switch actually does. A stowed region keeps its
	   component tree and its state and gives up its box, which is the whole
	   reason the wizard can be entered, left, and re-entered without losing a
	   captured vowel. Declared last so it beats .drawer-content's own flex
	   sizing above by source order at equal specificity. */
	.stowed {
		display: none;
	}

	/* ── Tab transition animations ──────────────────────── */

	@keyframes tabSlideFromRight {
		from { opacity: 0; transform: translateX(12px); }
		to { opacity: 1; transform: translateX(0); }
	}

	@keyframes tabSlideFromLeft {
		from { opacity: 0; transform: translateX(-12px); }
		to { opacity: 1; transform: translateX(0); }
	}

	.drawer-content :global(.tab-enter-from-right) {
		animation: tabSlideFromRight 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	.drawer-content :global(.tab-enter-from-left) {
		animation: tabSlideFromLeft 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	.drawer-content.tab-enter-from-right {
		animation: tabSlideFromRight 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	.drawer-content.tab-enter-from-left {
		animation: tabSlideFromLeft 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	/* ── The silhouette (N.65) ───────────────────────────── */

	/* THE COLOUR, AND WHERE IT CAME FROM. Dann ruled the paper handle's grey
	   for the whole outline. `.paper-handle` was DELETED at N.73 S1, so there
	   is no paper handle in the tree to read it from, and the drawing's
	   `#C9C5BD` is a stand-in the coordinating desk invented and the brief
	   forbids shipping. What IS in the tree is the grey this very handle has
	   painted since 2026-08-19: `rgba(26, 22, 18, 0.18)` over the drawer's
	   fill. MEASURED off the running app rather than computed, by reading the
	   painted pixels of all three of its borders: #D2CFCC on every one.

	   SOLID, not the alpha it came from. One path crosses the drawer's fill
	   AND the desk, and a translucent stroke would composite to two greys on
	   one line, which is the thing this ruling exists to end. */
	.drawer {
		--lip-grey: #D2CFCC;
	}

	.lip-silhouette {
		position: absolute;
		top: 0;
		/* The drawer's edge, not its outside. `left: 100%` with the stroke's
		   own 2px pulled back, so the vertical run lands exactly in the 2px
		   `.drawer-body` reserves for it and the handle's outer face lands
		   where the tab's right edge always was, at `100% + 20px`. */
		left: 100%;
		margin-left: -2px;
		/* Under the pull, over the desk. */
		z-index: 1;
		pointer-events: none;
		overflow: visible;
		/* THE SHADOW IS NOT HERE. It was, and Dann ruled it out on his walk:
		   this element is a 22px strip, so it could not cover its own
		   shadow and the blur painted a seam down the drawer's paper. It
		   lives on `.drawer` now, which contains this SVG and the drawer
		   body both, so the filter traces the union and the opaque body
		   hides its own shadow. See that rule. */
	}

	.sil-fill {
		fill: var(--drawer-bg, #FAF8F5);
		transition: fill 0.12s;
	}

	.sil-line {
		fill: none;
		stroke: var(--lip-grey);
		stroke-width: 2;
		/* THE MITRE. Dann: "please do not deliver those awful pointy
		   artefacts." A miter join on a true right angle is a square corner,
		   not a spike; the spikes come from joining at an acute angle, and
		   there is no acute angle in this path. Nothing tapers or flares
		   through either terminus. */
		stroke-linejoin: miter;
		/* Both ends are cut by the top and bottom of the drawer, so they take
		   no cap. */
		stroke-linecap: butt;
	}

	/* The hover lived on the tab's own background. The tab has no background
	   now, so it moves to the fill the tab sits in.

	   GUARDED, N.65, and this guard is the point of item 5 rather than a
	   tidy-up. A tap on iOS latches `:hover` until the next touch elsewhere.
	   This rule was harmless only while the silhouette was desktop-only; the
	   same ship draws it on the phone, at which point one tap on the handle
	   would leave its fill `#fff` against a `#FAF8F5` drawer. That is the
	   mismatch Dann reported on 2026-08-21: "There seems to be a colour
	   mismatch on mobile between the Drawer surface and the paper handle.
	   They should appear the same." */
	@media (hover: hover) {
		.drawer:has(.drawer-lip:hover) .sil-fill {
			fill: #fff;
		}
	}

	/* ── The pull: a bookmark tab on the drawer's edge ──── */

	/* Option A of `docs/sessions/ilya-lip-options_r1_2026-08-18.html`, ruled
	   by Dann 2026-08-18 for the desktop and extended to every display on
	   2026-08-19. A flat tab flush with the drawer's outward edge, drawer
	   fill, hairline border, rounded on its outward corners only. It reads as
	   part of the drawer, a thumb notch on a spine, not a button floating on
	   the desk.

	   THE HUE STAYS NEUTRAL. The four per-destination handle colours that
	   lived here (sage, rose, cobalt, lavender, each with a hover shade) are
	   gone: hue names place, and this control belongs to the drawer, which is
	   the same drawer on every desk. That also settles §2.5's instruction to
	   fold `shane` in with `transcription` here; there is no colour left to
	   fold. Ink names state, and the state is the chevron's direction. */
	.drawer-lip {
		position: absolute;
		top: 50%;
		left: 100%;
		transform: translateY(-50%);
		width: var(--lip-w, 20px);
		height: var(--lip-h, 152px);
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--drawer-bg, #FAF8F5);
		border: 1px solid rgba(26, 22, 18, 0.18);
		border-left: none;
		border-radius: 0 5px 5px 0;
		box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.18);
		cursor: pointer;
		z-index: 2;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	/* THE TAB PAINTS NOTHING ON THE DESKTOP. N.65, Dann's ruling: the
	   silhouette is one outline, so a second box with its own fill, its own
	   hairline, its own radius and its own drop shadow is the two marks the
	   ruling replaces. What stays is everything that makes it a CONTROL: the
	   box, the 44px coarse target, the chevron, the focus ring, and the
	   press.

	   IT APPLIES ON EVERY DISPLAY, N.65, Dann's ruling of 2026-08-21. The
	   sentence that stood here, "the phone keeps the painted tab, because
	   there is no silhouette there to belong to", assumed its own conclusion:
	   the silhouette was absent on the phone because this class was, and this
	   class was absent because the silhouette was. Dann settled it by what he
	   could see, sending a picture of the desktop handle and writing "This is
	   the appearance I want on mobile." One outline, two displays. */
	.drawer-lip.silhouetted {
		background: none;
		border: none;
		border-radius: 0;
		box-shadow: none;
	}

	/* GUARDED, N.65 item 5. `grep -n "hover: hover"` over this file returned
	   nothing before this ship, and a tap on iOS latches `:hover` until the
	   next touch elsewhere, so this was the rule that painted the tab `#fff`
	   under a singer's thumb. Measured off Dann's own screenshots: drawer
	   surface `#FAF8F5` at every sample, tab interior `#FFFFFF` at every
	   sample, open and shut alike.

	   BOTH RULES SIT INSIDE THE GUARD, so the cancel cannot outlive the thing
	   it cancels. With `silhouetted` now unconditional the cancel already wins
	   on specificity everywhere, which makes the first rule dead on its own
	   terms; it is guarded rather than deleted because deleting the tab's
	   painted hover is a separate ruling nobody has made. */
	@media (hover: hover) {
		.drawer-lip:hover {
			background: #fff;
		}

		.drawer-lip.silhouetted:hover {
			background: none;
		}
	}

	.drawer-lip:focus-visible {
		outline: 2px solid var(--ink-primary, #1a1612);
		outline-offset: 2px;
	}

	/* MODALITY, not viewport width, sets the geometry: a coarse pointer gets
	   the 44 px floor. This is the ruled pattern and it is deliberately not a
	   third touch-geometry exemption.

	   N.73 S1b §3. This rule used to grow the VISIBLE tab to 44 by 88, which
	   is 11 percent of a 390px screen given over to a handle. The visible tab
	   is 20 by `--lip-h` on every pointer, the desktop's own size, and a
	   transparent extension carries the width. The target is 44 by `--lip-h`,
	   so the floor is met and no exemption is created.

	   THE HEIGHT FOLLOWS THE TAB, N.65 item 9, AND THE COMMENT THAT STOOD
	   HERE SAID "the target is still 44 by 88". At `LIP_H = 152` a fixed 88
	   would have covered only the middle: the top and bottom 32px of a
	   visibly tappable handle would have acquired 20px of width instead of
	   44. Reading `--lip-h` is what stops the paint and the target parting
	   company the next time the handle is resized.

	   The extension is a pseudo-element rather than padding because padding
	   would grow the tab's painted box: the background, the border and the
	   border-radius are on .drawer-lip itself, and there is no way to pad a
	   box without painting the padding. ::before is inside the button, so a
	   press anywhere in it is a press on the button.

	   It extends INTO THE DESK, not off-screen: left: 0 anchors it to the
	   tab's left edge, so it covers the 20px tab and reaches 24px further
	   right, over the desk. Closed, the tab sits at left: 100%, which on the
	   phone is the viewport's left edge, so all 44px are on-screen. */
	@media (pointer: coarse) {
		.drawer-lip::before {
			content: '';
			position: absolute;
			top: 50%;
			left: 0;
			width: 44px;
			height: var(--lip-h, 152px);
			transform: translateY(-50%);
		}
	}

	/* ── The chevron ─────────────────────────────────────── */

	.lip-chevron {
		width: 14px;
		height: 20px;
		/* DARK GREY, NOT BLACK. Dann's ruling, 2026-08-20, on his walk of
		   `1f201f2`. It was `--ink-primary` #1a1612, which measures 16.97:1 on
		   the handle's #FAF8F5 fill and reads as black.

		   `--ink-secondary` #4a4540 at 8.94:1, and the choice is about FAMILY
		   as much as value. This drawer spends the ink scale on glyphs and
		   type and the stone scale on borders and chrome, and a chevron is a
		   glyph. `--stone-700` #44403c measures almost the same, 9.69:1, and
		   is the wrong family. `--ink-tertiary` #6A655F at 5.44:1 is the
		   placeholder and caption register, which would make a live control
		   read as a disabled one. The memo carries all five candidates so
		   Dann can rule again by looking. */
		color: var(--ink-secondary, #4a4540);
		/* Drawn pointing right, which is the direction a CLOSED drawer will
		   move. Open, it flips to point the way out. */
		transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	/* ── The optical nudge (N.65), and it is measured rather than judged ──
	   Dann, 2026-08-20: "maybe it can be nudged to the left a pixel or four
	   to give it more optical centring in the paper handle."

	   TWO ERRORS, MEASURED SEPARATELY, and only one of them is constant.

	   ONE: the glyph's box is centred in the BUTTON, and the button is not
	   the handle. The button spans the whole 20px protrusion, 520 to 540 on
	   the desk, so its centre is 530. The handle's ink-bounded interior runs
	   from the drawer's face at 520 to the inner face of the outer wall at
	   538, so its centre is 529. That is a constant 1px of error and it does
	   not flip.

	   TWO: the ink is not centred in its own box. Rasterised at 40x on a
	   transparent ground and weighted BY ALPHA, the chevron's ink centroid
	   sits at x 6.666 of a 14-wide box, not at 7. Its BOUNDING box is exactly
	   centred, 1.75 to 12.25, which is why this needed a centroid and not a
	   box: the two round caps at the open end outweigh the single round join
	   at the apex. That 0.334px REVERSES when the glyph flips.

	   So each state takes its own number, and both are leftward:
	     closed, apex right, ink at 529.666 -> 529 is -0.67px
	     open,   apex left,  ink at 530.334 -> 529 is -1.33px

	   THE TRANSLATE COMES BEFORE THE SCALE so it applies in the PARENT frame.
	   Written the other way round it would mirror with the glyph and push the
	   open state to the right, which is the wrong direction.

	   BOTH NUMBERS FALL BELOW the "pixel or four" Dann guessed, and they are
	   reported rather than rounded up to meet it. */
	.drawer:not(.collapsed) .lip-chevron {
		transform: translateX(-1.33px) scaleX(-1);
	}

	.drawer.collapsed .lip-chevron {
		transform: translateX(-0.67px) scaleX(1);
	}

	/* ── Placeholder panels ─────────────────────────────── */

	.placeholder-panel {
		padding: 1.5rem;
	}

	/* N.65 ship one. RENAMED FROM `.section-label`, VALUES UNCHANGED, and
	   the rename is the point. This heads the table of contents in Learn and
	   Guide. It is NOT a station label and cannot be folded into
	   `StationHeader.svelte`: its colour is the reading room's own ruled rose
	   and cobalt, not sage, and its 1rem gap belongs to a nav list rather
	   than to a station body. It carried the station label's name anyway,
	   which is how a fifth declaration of that recipe came to exist and
	   drift. One name for one concept: a station label is `StationHeader`,
	   and this is the TOC's heading. */
	.toc-heading {
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-secondary, #4a4540);
		margin: 0 0 1rem 0;
	}

	.toc-heading-learn {
		color: var(--dusty-rose, #A67B7B);
	}

	.toc-heading-guide {
		color: var(--quiet-cobalt, #5C739E);
	}

	.placeholder-text {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 0.95rem;
		color: var(--ink-secondary, #4a4540);
		line-height: 1.6;
		margin: 0;
	}

	/* ── TOC base styles ─────────────────────────────────── */

	.learn-toc {
		padding: 1.5rem;
	}

	.toc-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.toc-list li {
		margin: 0;
		padding: 0;
	}

	.toc-link {
		display: block;
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		border-left: 3px solid transparent;
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 0.9rem;
		color: var(--ink-secondary, #4a4540);
		line-height: 1.4;
		padding: 0.4rem 0 0.4rem 0.75rem;
		cursor: pointer;
		transition: border-color 150ms ease, color 150ms ease, background-color 150ms ease;
	}

	.toc-link:hover {
		border-left-color: rgba(166, 123, 123, 0.4);
		background: rgba(166, 123, 123, 0.06);
		color: var(--ink-primary, #1a1612);
	}

	.toc-link:focus-visible {
		outline: 2px solid var(--sage, #8B9A7D);
		outline-offset: -2px;
		border-radius: 2px;
	}

	/* ── Active heading indicator ─────────────────────────── */

	.toc-link.active {
		border-left-color: var(--dusty-rose, #A67B7B);
		border-left-width: 4px;
		color: var(--ink-primary, #1a1612);
		background: rgba(166, 123, 123, 0.08);
		font-weight: 500;
		padding-left: calc(0.75rem - 1px);
	}

	.toc-link.active:hover {
		border-left-color: var(--dusty-rose, #A67B7B);
		color: var(--ink-primary, #1a1612);
	}

	.toc-link.toc-title {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--ink-primary, #1a1612);
		padding-top: 0.25rem;
		padding-bottom: 0.5rem;
	}

	.toc-subsections {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.toc-subsections li {
		margin: 0;
		padding: 0;
	}

	.toc-sub {
		padding-left: 2.5rem !important;
		font-size: 0.8rem !important;
		color: var(--ink-secondary, #4a4540);
		opacity: 0.85;
	}

	.toc-sub:hover {
		opacity: 1;
	}

	.toc-sub.active {
		opacity: 1;
	}

	.toc-deep {
		padding-left: 3.5rem !important;
		font-size: 0.75rem !important;
		color: var(--ink-secondary, #4a4540);
		opacity: 0.75;
	}

	.toc-deep:hover {
		opacity: 1;
	}

	.toc-deep.active {
		opacity: 1;
	}

	/* ── Parent row: chevron + text side by side ──────────── */

	.toc-parent {
		display: flex;
		align-items: center;
	}

	.toc-parent .toc-link {
		flex: 1;
		min-width: 3px;
	}

	/* ── Chevron button ──────────────────────────────────── */

	.toc-chevron {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		flex-shrink: 0;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		color: var(--ink-tertiary, #8a8780);
		transition: color 150ms ease;
	}

	.toc-chevron:hover {
		color: var(--ink-secondary, #4a4540);
	}

	.toc-chevron.contains-active {
		color: var(--dusty-rose, #A67B7B);
	}

	.toc-chevron-spacer {
		width: 24px;
		height: 24px;
		flex-shrink: 0;
	}


	/* -- Guide tab: quiet-cobalt colour identity ----------- */

	.guide-toc .toc-link:hover {
		border-left-color: rgba(92, 115, 158, 0.4);
		background: rgba(92, 115, 158, 0.06);
	}

	.guide-toc .toc-link.active {
		border-left-color: var(--quiet-cobalt, #5C739E);
		background: rgba(92, 115, 158, 0.08);
	}

	.guide-toc .toc-link.active:hover {
		border-left-color: var(--quiet-cobalt, #5C739E);
	}

	.guide-toc .toc-chevron.contains-active {
		color: var(--quiet-cobalt, #5C739E);
	}

	.toc-chevron:focus-visible {
		outline: 2px solid var(--sage, #8B9A7D);
		outline-offset: -2px;
		border-radius: 2px;
	}

	.chevron-icon {
		transition: transform 200ms ease-out;
	}

	.toc-chevron.expanded .chevron-icon {
		transform: rotate(90deg);
	}

	.toc-parent-nested {
		padding-left: 0;
	}

	.toc-parent-nested .toc-sub {
		padding-left: calc(2.5rem - 20px) !important;
	}

	.toc-chevron-nested {
		width: 20px;
		height: 20px;
	}

	/* ── Collapsible children: grid animation ────────────── */

	.toc-children {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 250ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.toc-children.expanded {
		grid-template-rows: 1fr;
	}

	.toc-children-inner {
		overflow: hidden;
	}

	/* ── Mobile ──────────────────────────────────────────── */

	@media (max-width: 767px) {
		/* The drawer is a full-screen overlay that arrives FROM THE LEFT.
		   Dann's ruling, 2026-08-19: the desktop's illusion is horizontal
		   motion, the phone's vertical motion was a form-factor concession,
		   and the concession is withdrawn. One motion model, every display.
		   It arrives from the left because that is where it sits on the
		   desktop, where .drawer-body's double border-right faces the paper.

		   The height was calc(100dvh - 56px), reserving the deleted tab bar's
		   footer. The bar is gone and the drawer takes the viewport. */
		.drawer {
			/* NO LIFT ON THE PHONE, AND THE EXCLUSION STANDS. N.65 item 2
			   draws the silhouette here, so the first half of the reasoning
			   that stood in this comment ("the silhouette is desktop-only,
			   so there is no edge for a shadow to belong to") is struck.
			   THE SECOND HALF IS THE ONE THAT MATTERED AND IT IS UNTOUCHED:
			   `filter` on a full-screen overlay rasterizes on every frame of
			   the 400ms slide below. Dann gets the silhouette without the
			   lift. */
			filter: none;
			position: fixed !important;
			top: 0 !important;
			left: 0 !important;
			/* THE DESK STRIP, N.65 item 3, Dann's ruling of 2026-08-21: "I
			   believe we need two regions of background on top and bottom of
			   the paper handle for the Drawer." His reason: "on mobile the
			   illusion is that there is always a right-screen paper GUI
			   waiting just offscreen."

			   THE WIDTH IS THE PULL'S PROTRUSION, READ AND NOT TYPED. This
			   was `100% !important`. `--lip-w` is `LIP_W` published by the
			   root `<aside>`, so the strip is exactly as wide as the tab that
			   fills it and the two cannot drift.

			   THIS AMENDS DANN'S FULL-SCREEN OVERLAY RULING OF 2026-08-19,
			   which the comment above records. THE MOTION MODEL IS UNTOUCHED:
			   the drawer still arrives from the left, one model on every
			   display, and closed it still translates entirely off-screen. */
			width: calc(100% - var(--lip-w, 20px)) !important;
			height: 100dvh !important;
			z-index: 60;
			/* MEASURED: this was `overflow: hidden`, and it clipped the pull
			   out of sight the moment the pull moved outside the drawer's own
			   box. The pull sits at `left: 100%` when the drawer is closed,
			   which is the only place a closed drawer can show a handle. The
			   body is still clipped, by .drawer-clip, which is what that
			   element is for. */
			overflow: visible;
			transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1) !important;
		}

		/* Collapsed, the overlay sits entirely to the left of the viewport.
		   It was `translateY(100%)` with `width: 0 !important` behind it,
		   the width there only to stop a translated full-width overlay from
		   swallowing touches on the desk. Two things now stop that instead,
		   and neither needs the width: the overlay is off-screen, and it
		   takes no pointer events. Off-screen to the LEFT also costs no
		   horizontal scroll, because no browser scrolls into negative space
		   in a left-to-right document. */
		.drawer.collapsed {
			transform: translateX(-100%);
			pointer-events: none;
		}

		.drawer:not(.collapsed) {
			transform: translateX(0);
		}

		/* The pull is the exception to that: it is how a closed drawer gets
		   opened, so it keeps its touches while the overlay behind it
		   refuses them. */
		.drawer.collapsed .drawer-lip {
			pointer-events: auto;
		}

		/* THE OPEN TAB'S POSITION OVERRIDE IS DELETED, N.65 item 3, AND THE
		   BRIEF DID NOT ASK FOR IT. It read `left: auto; right: 0`, and its
		   reason was that the open drawer was the whole screen, so a tab at
		   `left: 100%` would hang off the right edge. THE DRAWER IS NO LONGER
		   THE WHOLE SCREEN: it is the screen less this tab's own width, so
		   `left: 100%` now lands the tab exactly in the strip, its outward
		   face on the viewport's right edge, which is where it sat before.

		   TWO THINGS BREAK IF IT STAYS. The desk would show BESIDE the handle
		   for the drawer's full height rather than above and below it, which
		   is the opposite of what Dann asked for. And `.lip-silhouette` is
		   `left: 100%` on every display, so the outline would draw in the
		   strip while the tab sat 20px to its left: the outline and the tab
		   disagreeing, which is the failure item 9 exists to prevent.

		   The touch extension's own override below STAYS, and its reason is
		   unchanged: the tab's outward edge is still the viewport's right
		   edge, so a 44px extension has to reach back into the drawer. */

		/* The open tab's outward edge IS the viewport's right edge, so the
		   touch extension has to reach the other way or it would hang
		   off-screen and the target would measure 20px. It reaches back into
		   the drawer, across the 44px gutter .drawer-body reserves below,
		   where nothing else is drawn. Inert without a coarse pointer, which
		   is the only place ::before takes a `content`. */
		.drawer:not(.collapsed) .drawer-lip::before {
			left: auto;
			right: 0;
		}

		/* Body fills full height */
		.drawer-clip {
			width: 100% !important;
			height: 100%;
			overflow: visible;
		}

		/* The open drawer keeps a 44px gutter on the right, the width of the
		   pull's TOUCH TARGET, which since N.73 S1b is wider than the 20px
		   the pull paints. The gutter measures the target, not the paint, so
		   the pull can never cover a control. On .drawer-body rather than .drawer-content because the
		   NOTATION anchor is .drawer-content's SIBLING, not its child, and
		   would otherwise keep its own edge under the pull. It costs 44px of
		   a 390px phone, which is the price of one control never hiding
		   another. */
		.drawer-body {
			width: 100% !important;
			height: 100%;
			flex-direction: column;
			/* RESERVED, NOT NONE, N.65 item 2. This was `border-right: none`,
			   which was correct while the phone drew no silhouette. It draws
			   one now, and the silhouette's vertical run lands in the 2px
			   `.drawer-body` reserves for it; with no reservation the
			   drawer's content would sit under that line. This is the
			   desktop's own declaration, which the phone now needs for the
			   same reason. */
			border-right: 2px solid transparent;
			overflow: visible;
			padding-right: 44px;
			box-sizing: border-box;
		}

		/* Drawer content: allow scroll to prevent left clipping */
		.drawer-content {
			overflow-x: auto;
			overflow-y: auto;
		}

		.toc-chevron {
			width: 44px;
			height: 44px;
		}
	}

	/* ── Reduced motion ──────────────────────────────────── */

	@media (prefers-reduced-motion: reduce) {
		.drawer {
			transition: none;
		}

		.lip-chevron {
			transition-duration: 0.01ms !important;
		}

		.drawer-content.tab-enter-from-right,
		.drawer-content.tab-enter-from-left {
			animation: none;
		}

		.toc-children {
			transition: none;
		}

		.chevron-icon {
			transition: none;
		}
	}
</style>
