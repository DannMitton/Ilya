<script lang="ts">
	/* ── THE LOUPE (N.92, mobile slice 2) ────────────────────────────────
	   Finale Speedy's editing frame, magnified in place. Ruled by Dann
	   2026-08-25 as the NAMED, SINGULAR exception to the Calm Authority shape
	   rule: nothing floats over the paper, except the loupe. Nothing else in
	   this slice floats, and the dock is anchored to an edge rather than
	   lifted.

	   IT IS A VIEW TRANSFORM, NOT A SECOND RENDERER. The magnified measure is
	   the page's own SVG, cloned out of the system it already stands in and
	   shown through a viewBox cropped to that measure. So the loupe's glyphs
	   are the page's glyphs: one Finale Maestro face, one set of coordinates,
	   one engraving. A second drawing of the same music could drift from the
	   page; a clone cannot.

	   IT DISPLACES NOTHING. Fixed to the viewport and out of the desk's flow,
	   so the page does not pan, reflow, or resize when the loupe rises, moves,
	   or leaves.

	   IT PRINTS NOTHING, like the selection mark it carries. ------------- */
	import { t, type Language } from '$lib/i18n';
	import {
		insertionBar,
		measureWindow,
		nearestTarget,
		parseSystemRange,
		systemIndexOf,
		type HitRect,
		type SystemRange,
	} from '$lib/shane/loupe';

	interface Props {
		/** Whether the loupe is up. The dock rises and falls with it. */
		open: boolean;
		/** The held measure's display number, from `Measure.number`. */
		measureLabel: string | null;
		/** The held measure's own index, for finding the system that holds it. */
		measureIndex: number | null;
		/** Entry ids in the held measure, in document order. */
		ownIds: readonly string[];
		/** Entry ids in the next measure that carries any, for the right edge. */
		nextIds: readonly string[];
		/** The taken entry, marked inside the loupe as it is on the page. */
		selectedEventId: string | null;
		/**
		 * Anything that changes when the page's SVG is rebuilt. `{@html page}`
		 * replaces the whole system, which would otherwise leave this holding a
		 * clone of a page that is no longer on screen.
		 */
		revision: unknown;
		language: Language;
		/**
		 * What the held measure holds against what its signature asks for, or
		 * null where the two agree. Ruled by Dann 2026-08-26: the tag carries
		 * the arithmetic ONLY on a measure that disagrees.
		 */
		fill: { actual: number; expected: number } | null;
		/**
		 * A tap on an entry inside the loupe. Dann's ruling of 2026-08-26 moved
		 * N.55b's syllable placement here: on a phone the page tap navigates and
		 * this one places.
		 */
		onpick: (eventId: string) => void;
		/** Landscape's dock takes the left edge; portrait's takes the bottom. */
		dockInset: number;
		dockHeight: number;
	}

	let {
		open,
		measureLabel,
		measureIndex,
		ownIds,
		nextIds,
		selectedEventId,
		revision,
		language,
		fill,
		onpick,
		dockInset,
		dockHeight,
	}: Props = $props();

	const T = (key: string) => t(key, language);

	/* THE SCHEMATIC'S PORTRAIT FIGURE, 2.4 times, and it is a multiple of the
	   size the page is ALREADY DRAWN AT rather than of the engraved page. The
	   phone shows the true page as an oversized thumbnail (slice 1 measured
	   0.468 at 430 px) and the loupe supplies the readable zoom, so the number
	   that means anything is the one against what the eye is failing to read.
	   At 0.468 this lands the measure at 1.12 times the engraved page, which
	   is what the schematic's own arithmetic implies: a three-entry measure
	   filling 354 px of width.

	   NOT ESTABLISHED, and the schematic says so in its own terms: no source
	   establishes a correct loupe magnification, and no surveyed product
	   implements a loupe over a true page on a phone. */
	const MAGNIFICATION = 2.4;

	/** The desk's own gutter (`--portrait-gutter`), so the loupe keeps the
	    page's margins rather than inventing a second measure. */
	const GUTTER = 24;

	/* SMuFL's three notehead codepoints, spec-stable and already the registry's
	   own (`smufl-metadata.ts:85-87`). The insertion bar needs to find the
	   notehead among the several `<text>` elements in a note's group, and its
	   character is the one thing that names it without depending on the order
	   the renderer happens to push its parts in. */
	const NOTEHEADS = new Set(['\uE0A2', '\uE0A3', '\uE0A4']);

	interface Frame {
		inner: string;
		viewBox: string;
		/** The frame's own width, stable as the singer steps between measures. */
		width: number;
		/** The magnified measure's width, centred inside the frame. */
		contentWidth: number;
		contentHeight: number;
		/** The window's height, sized by the TALLEST system on the page. */
		windowHeight: number;
		/** Landscape's vertical anchor. Portrait anchors on the dock instead. */
		top: number;
		system: number;
		systems: number;
	}

	let frame = $state<Frame | null>(null);

	function hitsFor(page: Element, ids: readonly string[]): { rects: HitRect[]; nodes: Element[] } {
		const rects: HitRect[] = [];
		const nodes: Element[] = [];
		for (const id of ids) {
			const el = page.querySelector(`[data-hit="${CSS.escape(id)}"]`);
			if (!el) continue;
			nodes.push(el);
			rects.push({ x: Number(el.getAttribute('x')), width: Number(el.getAttribute('width')) });
		}
		return { rects, nodes };
	}

	/* THE CLONE, rebuilt whenever the held measure, the taken entry, or the
	   page itself changes. Reading the DOM rather than being handed geometry
	   is deliberate: the page is injected SVG, so the DOM is the only place
	   the rendered coordinates exist, and VoiceProfilePane's own selection
	   mark already reaches the page exactly this way. */
	$effect(() => {
		void revision;
		void selectedEventId;
		void dockHeight;
		if (!open || measureIndex === null || ownIds.length === 0) {
			frame = null;
			return;
		}
		const container = document.querySelector('.fit-paper-container');
		if (!container) {
			frame = null;
			return;
		}
		const own = hitsFor(container, ownIds);
		const first = own.nodes[0];
		if (!first) {
			frame = null;
			return;
		}
		const sysEl = first.closest('[data-system]');
		if (!(sysEl instanceof Element)) {
			frame = null;
			return;
		}

		// The next measure bounds the window only when it shares this system.
		const next = hitsFor(container, nextIds);
		const nextHere =
			next.nodes.length > 0 && next.nodes.every((n) => n.closest('[data-system]') === sysEl)
				? next.rects
				: [];

		const sysWidth = Number(sysEl.getAttribute('width'));
		const sysHeight = Number(sysEl.getAttribute('height'));
		const sysMinY = Number((sysEl.getAttribute('viewBox') ?? '0 0 0 0').split(/\s+/)[1] ?? 0);
		/* The staff's own extent, recovered from a hit rectangle. The renderer
		   builds each one from `staffTop - 3.5 * lineGap` to
		   `staffBottom + 3.5 * lineGap` around a staff of `4 * lineGap`
		   (`staff-renderer.ts:1007-1011`), so the rectangle is eleven line gaps
		   tall and one gap is an eleventh of it. The sage rectangle and the
		   insertion bar both need it. */
		const hitY = Number(first.getAttribute('y'));
		const hitH = Number(first.getAttribute('height'));

		const win = measureWindow(own.rects, nextHere, sysWidth);
		if (!win || !(sysHeight > 0) || !(sysWidth > 0)) {
			frame = null;
			return;
		}

		/* The page's on-screen scale, MEASURED rather than recomputed. PageFit's
		   transform, the fitted width, and any browser pinch are all already in
		   this number, and none of them is knowable from here otherwise. */
		const box = sysEl.getBoundingClientRect();
		const unitPx = box.width / sysWidth;
		if (!(unitPx > 0)) {
			frame = null;
			return;
		}

		const width = Math.max(160, window.innerWidth - dockInset - GUTTER * 2);
		const span = win.right - win.left;
		/* A measure wider than the phone is shown WHOLE at less than 2.4 rather
		   than clipped at 2.4. Notes lost off the edge of a magnifier are the
		   worse failure, because the singer cannot tell it happened. */
		const contentWidth = Math.min(span * unitPx * MAGNIFICATION, width);
		const contentHeight = sysHeight * (contentWidth / span);

		const ranges: SystemRange[] = [];
		for (const el of container.querySelectorAll('[data-system]')) {
			const r = parseSystemRange(el.getAttribute('data-system'));
			if (r) ranges.push(r);
		}

		const clone = sysEl.cloneNode(true) as Element;
		/* The clone arrives carrying whatever the page was wearing: its own
		   held-measure rectangle, which belongs on the page and not inside the
		   loupe, and VoiceProfilePane's `data-note-selected`, which is the
		   page's mark and not this surface's. Both come off. */
		for (const el of clone.querySelectorAll('[data-held-measure]')) el.remove();
		for (const el of clone.querySelectorAll('[data-note-selected]')) {
			el.removeAttribute('data-note-selected');
		}
		/* THE HIT RECTANGLES ARE RENAMED IN THE CLONE, and that is what keeps
		   the two tap grammars apart. VoiceProfilePane's delegated listener
		   matches `[data-hit]` anywhere in the document, so a clone carrying
		   that name would put the page's meaning on a tap inside the loupe.
		   Renamed, the page keeps `data-hit` and this surface owns
		   `data-loupe-hit`, and each listener sees only its own. */
		for (const el of clone.querySelectorAll('[data-hit]')) {
			const id = el.getAttribute('data-hit') ?? '';
			el.removeAttribute('data-hit');
			el.setAttribute('data-loupe-hit', id);
		}

		/* FINALE SPEEDY'S INSERTION BAR, at the taken entry, drawn rather than
		   inherited. Dann's ruling of 2026-08-26 struck the magnified selection
		   outline: the shipped outline rides the note's whole group and the
		   group's box includes the transparent hit rectangle, so at 2.4 times it
		   read as a tall capsule around the entry instead of a bar through it.

		   THE NOTEHEAD IS FOUND BY ITS OWN CHARACTER. SMuFL fixes the three
		   notehead codepoints (`smufl-metadata.ts:85-87`), and the renderer
		   emits each as a `<text>` centred on the column
		   (`staff-renderer.ts:502-505`, `:1061`), so the notehead's inked box is
		   the one thing in the group that reliably gives both the column's x and
		   the note's own y. It is measured on the PAGE, which is live and
		   laid out, and the numbers carry into the clone unchanged because the
		   clone keeps the system's coordinate space. */
		let bar = '';
		if (selectedEventId && hitH > 0) {
			const lineGap = hitH / 11;
			const group = container
				.querySelector(`[data-hit="${CSS.escape(selectedEventId)}"]`)
				?.closest('[data-event-id]');
			const head = group
				? [...group.querySelectorAll('text')].find((t) =>
						NOTEHEADS.has(t.textContent ?? ''),
					)
				: undefined;
			if (head) {
				/* THE COLUMN'S X FROM THE BOX, THE NOTE'S Y FROM THE ATTRIBUTE.
				   `glyphAt` centres the notehead on its column by ADVANCE width
				   (`staff-renderer.ts:502-505`), and `getBBox` on an SVG `<text>`
				   returns exactly that advance box, so its horizontal centre is
				   the column to the pixel.

				   ITS VERTICAL EXTENT IS NOT THE NOTEHEAD. The same box is the
				   font's own ascent and descent, which measured 95 user units
				   here against a staff of 22, and a bar built from it ran from
				   above the staff down through the IPA line. The renderer already
				   knows where the note sits and writes it into the element's `y`,
				   which is the notehead's centre on the staff, and a notehead is
				   one stave space tall. Read, not measured. */
				const noteY = Number(head.getAttribute('y'));
				const b = (head as SVGGraphicsElement).getBBox();
				const staffTop = hitY + 3.5 * lineGap;
				const g = insertionBar(
					b.x + b.width / 2,
					staffTop,
					staffTop + 4 * lineGap,
					noteY - 0.6 * lineGap,
					noteY + 0.6 * lineGap,
					lineGap,
				);
				const half = g.thickness / 2;
				const cap = g.capWidth / 2;
				bar =
					`<g data-insertion-bar="" pointer-events="none" fill="var(--sage, #8b9a7d)">` +
					`<rect x="${g.x - half}" y="${g.top}" width="${g.thickness}" height="${g.bottom - g.top}"/>` +
					`<path d="M${g.x - cap} ${g.top} L${g.x + cap} ${g.top} L${g.x} ${g.top + g.capHeight} Z"/>` +
					`<path d="M${g.x - cap} ${g.bottom} L${g.x + cap} ${g.bottom} L${g.x} ${g.bottom - g.capHeight} Z"/>` +
					`</g>`;
			}
		}

		/* ONE SAGE RECTANGLE ON THE PAGE, marking the measure the loupe holds.
		   It is not a control and it is not decoration: it is the page saying
		   which of its own components is under the knife, and between it and
		   the measure tag the singer never loses their place.

		   IT RIDES THE PAGE'S OWN SVG, the way VoiceProfilePane's selection
		   mark does, so it sits in the system's coordinate space and the
		   thumbnail's scale never has to be undone. */
		for (const stale of container.querySelectorAll('[data-held-measure]')) stale.remove();
		if (hitH > 0) {
			const lineGap = hitH / 11;
			const mark = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			mark.setAttribute('data-held-measure', '');
			mark.setAttribute('x', String(win.left));
			mark.setAttribute('y', String(hitY + 3.5 * lineGap));
			mark.setAttribute('width', String(span));
			mark.setAttribute('height', String(4 * lineGap));
			mark.setAttribute('fill', 'none');
			mark.setAttribute('pointer-events', 'none');
			sysEl.insertBefore(mark, sysEl.firstChild);
		}

		/* THE LOUPE ANCHORS FIXED AND NEVER TRAVELS. Ruled by Dann 2026-08-26
		   on the deploy walk, and it replaces the placement r2 shipped, which
		   moved the loupe to keep the sage rectangle in view. The ruling is
		   that the page is the thing that stays still and the loupe is the
		   thing that stays put: the sage rectangle alone moves across the
		   still page, and the measure tag carries the name.

		   SO THE WINDOW IS A CONSTANT, sized by the TALLEST system on the page
		   rather than by the one in hand. Systems differ by a few units,
		   because the renderer crops each one's headroom to its own ink
		   (`staff-renderer.ts:1081`), and a window sized to the held system
		   would breathe by those few units at every step. Each measure is drawn
		   at its own height and centred in the constant window.

		   AND THE ANCHOR IS THE DOCK, not the measure. Portrait hangs the
		   loupe one gutter above the dock's top edge, so the singer's eye and
		   thumb keep one relationship for the whole session. Landscape has the
		   dock down its left side and nothing above, so the loupe centres in
		   the room to its right, which is a constant now that the height is
		   one. */
		let maxSysHeight = sysHeight;
		for (const el of container.querySelectorAll('[data-system]')) {
			const h = Number(el.getAttribute('height'));
			if (h > maxSysHeight) maxSysHeight = h;
		}
		const windowHeight = maxSysHeight * unitPx * MAGNIFICATION;
		const top = Math.max(GUTTER, (window.innerHeight - (windowHeight + 40)) / 2);

		frame = {
			inner: clone.innerHTML + bar,
			viewBox: `${win.left} ${sysMinY} ${span} ${sysHeight}`,
			width,
			contentWidth,
			contentHeight,
			windowHeight,
			top,
			system: systemIndexOf(ranges, measureIndex) + 1,
			systems: ranges.length,
		};

		return () => {
			for (const stale of container.querySelectorAll('[data-held-measure]')) stale.remove();
		};
	});

	/* A TAP INSIDE THE LOUPE TAKES THE ENTRY, and places the armed syllable.
	   Dann's ruling of 2026-08-26 moved N.55b's placement here from the page.

	   NEAREST RATHER THAN `closest`, the same rule the page tap uses, so a tap
	   that lands between two entries still resolves to one and always the same
	   one. At 2.4 times the targets are large, and this only ever helps. */
	function handleTap(e: MouseEvent): void {
		const targets = [...(windowEl?.querySelectorAll('[data-loupe-hit]') ?? [])].map((el) => {
			const r = el.getBoundingClientRect();
			return {
				id: el.getAttribute('data-loupe-hit') ?? '',
				cx: r.left + r.width / 2,
				cy: r.top + r.height / 2,
			};
		});
		const id = nearestTarget(targets, e.clientX, e.clientY);
		if (id) onpick(id);
	}

	/* THE LISTENER IS ATTACHED RATHER THAN WRITTEN INTO THE MARKUP, and the
	   reason is VoiceProfilePane's own (`VoiceProfilePane.svelte:217`): the
	   thing being tapped is injected SVG, so there is no element here to hang a
	   Svelte handler on, and putting one on the wrapper would need a role and a
	   tabindex it should not have. This surface is `aria-hidden`, and the
	   keyboard path to every entry is the stepper. */
	let windowEl = $state<HTMLElement | undefined>(undefined);
	$effect(() => {
		const el = windowEl;
		if (!el) return;
		el.addEventListener('click', handleTap);
		return () => el.removeEventListener('click', handleTap);
	});

	const tag = $derived.by(() => {
		if (measureLabel === null || !frame) return '';
		/* THE ARITHMETIC JOINS THE CLAUSE, it does not take it. Dann's amendment
		   of 2026-08-26, answering the cost this comment used to name: a tag
		   that dropped the system exactly where the bar was wrong took the
		   singer's place away at the moment they most needed it. Where the
		   arithmetic fires the tag now says both.

		   THE SHORT FORM SURVIVES for a page whose systems cannot be read,
		   which is the same relationship `measureTagShort` has to
		   `measureTag`. Four forms, and each one says everything it knows. */
		if (fill && frame.system > 0 && frame.systems > 0) {
			return T('loupe.measureTagBoth')
				.replace('%m', measureLabel)
				.replace('%s', String(frame.system))
				.replace('%t', String(frame.systems))
				.replace('%a', String(fill.actual))
				.replace('%e', String(fill.expected));
		}
		if (fill) {
			return T('loupe.measureTagFill')
				.replace('%m', measureLabel)
				.replace('%a', String(fill.actual))
				.replace('%e', String(fill.expected));
		}
		if (frame.system > 0 && frame.systems > 0) {
			return T('loupe.measureTag')
				.replace('%m', measureLabel)
				.replace('%s', String(frame.system))
				.replace('%t', String(frame.systems));
		}
		return T('loupe.measureTagShort').replace('%m', measureLabel);
	});
</script>

{#if open && frame}
	<!-- PORTRAIT ANCHORS ON THE DOCK, landscape centres in the room beside it.
	     `bottom` rather than `top` in portrait, so the loupe's own edge is what
	     is pinned and a measure of a different height grows upward instead of
	     shifting the whole frame. -->
	<div
		class="loupe"
		style="left: {dockInset + 24}px; width: {frame.width}px; {dockInset > 0
			? `top: ${frame.top}px;`
			: `bottom: ${dockHeight + 24}px;`}"
	>
		<p class="loupe-tag">{tag}</p>
		<div class="loupe-window" bind:this={windowEl} style="height: {frame.windowHeight}px;">
			<!-- ARIA-HIDDEN for the reason the accidental glyphs already carry:
			     this is the page said louder, not a second thing to hear. The
			     score region has its own label and the dock's readout names the
			     taken entry in words. -->
			<svg
				class="loupe-svg"
				viewBox={frame.viewBox}
				width={frame.contentWidth}
				height={frame.contentHeight}
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				font-family="'Source Serif 4', Georgia, serif"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- our own renderer's SVG, cloned -->
				{@html frame.inner}
			</svg>
		</div>
	</div>
{/if}

<style>
	/* TWO SHADOW STEPS, so the lift reads as distance rather than as a border.
	   The loupe is nearest the user; the dock takes the same z-index, because
	   the two are one object.

	   THE Z-INDEX CLEARS THE INSTALL PROMPT, and that is measured rather than
	   chosen. `InstallPrompt.svelte:114` sits at 9000 and raises itself six
	   seconds into every iOS Safari session, and at any lower value it lands
	   on top of the LYRIC station and the singer cannot reach it. The mobile
	   drawer takes 60 (`Drawer.svelte:1526`) and the update toast 200. The
	   loupe is ruled nearest the user, the dock is its other half, and a
	   working surface a thumb cannot reach is not a surface. The prompt is
	   untouched and returns the moment the loupe goes away. */
	.loupe {
		position: fixed;
		z-index: 9100;
		/* THE SWIPE IS OURS. Without this a downward drag starting here is a
		   scroll gesture as far as the browser is concerned, it claims the
		   pointer, and the `pointerup` the dismissal listens for never arrives:
		   a `pointercancel` does. The ruled grammar gives pinch on the loupe no
		   meaning either, so nothing is lost by taking the whole surface. */
		touch-action: none;
		box-sizing: border-box;
		padding: 10px 10px 12px;
		border: 1.4px solid var(--stone-700, #44403c);
		border-radius: 10px;
		background: var(--paper-light, #f5f1e8);
		box-shadow:
			0 4px 10px rgba(46, 42, 38, 0.17),
			0 10px 26px rgba(46, 42, 38, 0.09);
		/* OPACITY AND TRANSFORM ONLY, 180 ms, the slate's one duration. The
		   loupe and the dock arrive as one motion and leave as one. */
		animation: loupe-rise 180ms ease-out;
	}

	@keyframes loupe-rise {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.loupe {
			animation: none;
		}
	}

	/* The measure tag, top left, naming what the loupe holds in words. The
	   sage rectangle on the page says the same thing in its place. */
	.loupe-tag {
		margin: 0 0 6px;
		font-family: var(--font-sans, system-ui, sans-serif);
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: var(--ink-tertiary, #6a655f);
	}

	/* The window is a constant height and the drawing is centred in it, so a
	   short system sits in air rather than moving the frame. */
	.loupe-window {
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.loupe-svg {
		display: block;
	}

	/* The taken entry, marked exactly as the page marks it: an outline, which
	   adds no geometry to the SVG and cannot shift a coordinate the renderer
	   computed. */
	.loupe :global([data-loupe-selected]) {
		outline: 2px solid var(--sage, #8b9a7d);
		outline-offset: 2px;
		border-radius: 2px;
	}

	/* THE HELD MEASURE'S MARK, on the page rather than on this surface. Sage,
	   Studio's accent for the score document, and hairline so it reads as a
	   bracket around the measure rather than as a box drawn on the music. */
	:global([data-held-measure]) {
		stroke: var(--sage, #8b9a7d);
		stroke-width: 1.2;
	}

	@media print {
		.loupe {
			display: none !important;
		}

		/* THE PAGE PRINTS AS IT PRINTED. The mark says what the singer is doing
		   now, which is the same reason the selection outline drops. */
		:global([data-held-measure]) {
			display: none !important;
		}
	}
</style>
