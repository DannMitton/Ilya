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
	import { onMount } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import { loadNotationFont, type LoadedNotationFont } from '$lib/shane/engine/notation-fonts';
	import { afterGround } from '$lib/shane/system-ground';
	import { RING_REACH, RING_STROKE } from '$lib/shane/selection-ring';
	import type { Slot, PairingMap } from '$lib/shane/pairings';
	import type { Cursor } from '$lib/shane/entry';
	import LoupeSyllables from '$lib/shane/LoupeSyllables.svelte';
	import type { RequiredGlyphName } from '@ilya/score-parser';
	import {
		headBound,
		MUSIC_MARK,
		clipToHead,
		firstInkIn,
		isRestGlyph,
		openingBarline,
		inkCrop,
		carryBand,
		centreOnPage,
		closingBarline,
		EXCERPT_TAIL_SP,
		pageInset,
		ringRoom,
		stripRing,
		measureWindow,
		meterLayout,
		METER_LEAD_SP,
		openAfterPageMeter,
		nearestTarget,
		parseSystemRange,
		systemIndexOf,
		windowScale,
		type HitRect,
		type InkSpan,
		type PageInk,
		type Vertical,
		type SystemRange,
	} from '$lib/shane/loupe';

	interface Props {
		/** Whether the loupe is up. The dock rises and falls with it. */
		open: boolean;
		/** The held measure's display number, from `Measure.number`. */
		measureLabel: string | null;
		/**
		 * The locator's SECOND LINE (N.113b item 2, ruled by Dann 2026-09-08):
		 * the taken note, its beat in the measure, and its duration, composed
		 * from `+page.svelte`'s own readout parts. Empty where there is nothing
		 * to name, which is a gap or no selection, and the line then does not
		 * draw at all.
		 */
		noteLine?: string;
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
		 * The meter in effect in the held measure (N.138), or null where the
		 * score carries none. Every measure carries its own snapshot from the
		 * parsers, so this is the right meter whether or not the measure's
		 * system declares one.
		 */
		meter?: { beats: number; beatType: number } | null;
		/**
		 * A tap on an entry inside the loupe. N.147, RULED BY DANN 2026-09-17:
		 * this only takes the entry now (`+page.svelte`'s `handleLoupePick` is
		 * `setCursor` and nothing else). Placement moved to a tap on a
		 * SYLLABLE, in the row this component now draws itself (`onplace`,
		 * below); a note tap reassigning whatever syllable happened to be
		 * armed was Dann's own "unacceptable," 2026-09-16.
		 */
		onpick: (eventId: string) => void;
		/**
		 * N.92, THE CARETS. The held measure's own run of places, head gap to
		 * tail gap, `+page.svelte`'s `positionsInMeasure` (`entry.ts`). One
		 * caret is drawn per `gap` this carries; every `entry` it carries
		 * already has its own hit rectangle and needs nothing from this list.
		 */
		positions: readonly Cursor[];
		/**
		 * A tap on a CARET: the gap's own `after`, `null` for the head gap.
		 * `+page.svelte`'s `handleLoupePickGap` is `setCursor({ kind: 'gap',
		 * after })`, the same write the stepper makes, so nothing downstream of
		 * the cursor needs to know a tap made it there instead of a key.
		 */
		onpickgap: (after: string | null) => void;
		/** What the loupe must stand clear of on the left: the landscape dock, or
		    the open drawer on a desk. */
		dockInset: number;
		/** What it must stand clear of below: the portrait dock, or nothing. */
		dockHeight: number;
		/** A phone keeps the ruled 2.4; a desk aims at a readable stave. */
		isPhone: boolean;
		/** N.147. The whole poem's queue, `+page.svelte`'s `slotQueue`, drawn by
		    `LoupeSyllables` on the loupe's own paper. */
		slots: readonly Slot[];
		/** The live pairing map, for which slots are placed and which one sits
		    on the taken note. */
		pairings: PairingMap;
		/** A tap on a syllable: places it on the selected note and advances the
		    selection (`+page.svelte`'s `placeSyllableOnSelected`). */
		onplace: (slot: Slot) => void;
		/** The disclosure's own open state. N.147, RULED BY DANN 2026-09-17:
		    session-only, no `localStorage`, starts closed; lives in
		    `+page.svelte` because THIS component is destroyed and recreated on
		    every raise and dismiss (`{#if loupeAvailable && loupeOpen && cursor}`),
		    so a local `$state` here would reset every time instead of once per
		    session. */
		syllablesOpen: boolean;
		ontogglesyllables: () => void;
	}

	let {
		open,
		measureLabel,
		noteLine = '',
		measureIndex,
		ownIds,
		nextIds,
		selectedEventId,
		revision,
		language,
		fill,
		meter = null,
		onpick,
		positions,
		onpickgap,
		dockInset,
		dockHeight,
		isPhone,
		slots,
		pairings,
		onplace,
		syllablesOpen,
		ontogglesyllables,
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

	/* THE DESKTOP FIGURE IS DERIVED, not chosen, because no source sets one.
	   2.4 is a portrait figure: it multiplies a page already shrunk to a
	   thumbnail, and on a desk the page is drawn at full size, so the same
	   multiplier would put one measure across a monitor.

	   WHAT THE LOUPE IS FOR IS A READABLE STAVE, so that is what the desktop
	   asks for: a target stave space in CSS pixels, divided by the one the page
	   is already drawing. 12 px is the target. Gould sets a vocal score's
	   rastral around 7 mm, which at 96 dpi is about 26 px of staff height and
	   so about 6.5 px of stave space; twelve is a little under twice that,
	   which is the register a notation editor works at and roughly what Finale
	   shows at 100 percent on a modern display. The shipped print engraving
	   draws 5.5 px, so on today's pages this lands near 2.2 and it will follow
	   the engraving rather than fight it if that number ever moves.

	   CLAMPED at both ends. Below 1.2 the loupe is not a magnifier and the
	   singer would wonder what it was for; above 2.4 it would outrun the
	   phone's own ruled figure, and one grammar means the desk never magnifies
	   harder than the phone does. */
	const DESKTOP_TARGET_LINE_GAP = 12;
	const DESKTOP_MIN = 1.2;
	const DESKTOP_MAX = 2.4;

	/** The desk's own gutter (`--portrait-gutter`), so the loupe keeps the
	    page's margins rather than inventing a second measure. */
	const GUTTER = 24;

	/* ── AN APPLIANCE RESTING ABOVE THE PAGE ─────────────────────────────
	   Ruled by Dann 2026-08-28, from the walk on `9fabbf1`: the loupe matched
	   the page's width and sat on its bottom edge, so it read as a footer —
	   part of the document rather than a thing set down on it. Paper must show
	   past it on both sides and continue visibly underneath.

	   The inset, and why it is this fraction, is with `pageInset` in
	   `loupe.ts`. There is no matching constant for the vertical: the loupe is
	   CENTRED on the page's visible height, so its foot is whatever centring
	   leaves rather than a gap of its own. See `centredFoot`. */
	const SIDE_INSET = 1 / 16;

	/* The frame's own furniture above and below the window: the measure tag's
	   row, 10 px of padding over 12, and two 1.4 px borders. MEASURED at 46.5
	   on all three surfaces, since none of it varies with the music.

	   IT IS AN ESTIMATE AND ONLY THE CLAMPS READ IT. The centring itself is
	   exact whatever this is, because CSS hangs the frame off its centre; this
	   number only decides when a frame is too tall for the room to centre it
	   in, and it would have to be wrong by tens of pixels to change that
	   answer. It is written down rather than inlined so that a change to the
	   tag's type is a change to something named. */
	const CHROME = 46.5;

	/* THE FRAME'S OWN FURNITURE ACROSS: 10 px of padding and a 1.4 px border on
	   each side, from `.loupe` in this file's stylesheet. The drawing lives in
	   the window inside it, so that is the width it is fitted to.

	   N.138 FOUND THE FIT TAKING THE FRAME'S OUTER WIDTH. MEASURED at 390 px on
	   the engraved Without Sun song 1: the frame is 299.25 px and its window
	   277, so every measure wide enough to meet the cap drew 299.3 px into 277
	   and lost about 11 px at each edge, the stave's left end on one side and the
	   closing rest of m. 3 on the other. That predates N.138, on ten of the
	   document's seventeen sung measures; the meter panel added m. 5. The fit's comment
	   already said a measure is shown whole rather than clipped, so this makes
	   the arithmetic agree with it. A change to the frame's padding or border
	   is a change to this number. */
	const FRAME_SIDES = 2 * (10 + 1.4);

	/* ── THE FRAME IS CUT TO THE PAGE'S INK ──────────────────────────────
	   Ruled by Dann 2026-08-27: the loupe was too loose around its content,
	   and empty loupe is page the singer cannot see. The crop used to take the
	   held system's declared box and the window the tallest system's — 103 and
	   106 units on this document — where the ink actually occupies 82.49.

	   The reasoning, and the constraint that the frame must not breathe as the
	   singer steps, live with `inkCrop` and `windowScale` in `loupe.ts`, which
	   is where they can be tested. What lives here is the measuring: the page
	   is surveyed once, and the survey is what those two are handed.

	   HALF A STAFF SPACE OF AIR, top and bottom. The band already contains
	   every ledger line, stem, tuplet bracket and tie the page carries, so the
	   pad is only to keep the tallest of them off the frame's own edge. */
	const INK_PAD_SP = 0.5;

	/* ONE CANVAS, MEASURED THE WAY THE GLYPH CELLS ARE. `getBBox` on an SVG
	   `<text>` returns the font's LAYOUT box, not its ink, and a survey built
	   on it reported systems whose "ink" stood taller than the viewBox that
	   contained them. Canvas answers with the inked bounds. */
	let inkCanvas: CanvasRenderingContext2D | null = null;

	function textInk(el: Element): { top: number; bottom: number } | null {
		const ctx = (inkCanvas ??= document.createElement('canvas').getContext('2d'));
		if (!ctx) return null;
		const cs = getComputedStyle(el);
		ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
		const m = ctx.measureText(el.textContent ?? '');
		if (!(m.actualBoundingBoxAscent > 0 || m.actualBoundingBoxDescent > 0)) return null;
		const y = Number(el.getAttribute('y'));
		if (!Number.isFinite(y)) return null;
		return { top: y - m.actualBoundingBoxAscent, bottom: y + m.actualBoundingBoxDescent };
	}

	/* ── THREE READINGS OF A SYSTEM AS DRAWN, shared by the frame and the survey ──
	   The frame effect and `pageMetrics` used to walk these each in their own
	   copy. N.138 increments 2 and 3 need all three in both places, so they
	   live once. */

	/** The system's paint order, the `MUSIC_MARK` gate in it, and the music's
	    ink from the gate on. The frame effect's ink-walk comment says what is
	    skipped and why; this is that walk, moved and unchanged. */
	function musicInk(sys: Element): { nodes: Element[]; gate: number; xs: number[] } {
		const nodes = [...sys.querySelectorAll('*')];
		const gate = nodes.findIndex((el) => el.matches(MUSIC_MARK));
		const xs: number[] = [];
		for (let i = gate; i >= 0 && i < nodes.length; i++) {
			const el = nodes[i];
			if (el.hasAttribute('data-hit') || el.hasAttribute('data-event-id')) continue;
			if (el.hasAttribute('data-selection-ring') || el.hasAttribute('data-bar-number')) continue;
			if (el.closest('[data-analysis]') || el.closest('[data-held-measure]')) continue;
			/* N.139: the page's meter is stripped from the clone, so it is not the
			   music the loupe's own meter panel stands clear of. */
			if (el.closest('[data-meter]')) continue;
			const tacet = el.closest('[data-tacet]');
			if (tacet && tacet !== el) continue;
			let b: DOMRect;
			try {
				b = (el as SVGGraphicsElement).getBBox();
			} catch {
				continue;
			}
			if (b && (b.width || b.height)) xs.push(b.x);
		}
		return { nodes, gate, xs };
	}

	/** The x of every RESTS-OR-NOTES mark on the system, and of nothing else.
	    A note is its event group's own marks (notehead, stem, flag) and what is
	    tagged `data-of-event` (accidentals, courtesy parentheses, dots); a rest
	    is a bare SMuFL rest glyph, or a multibar rest's group. Underlay, ties,
	    slurs and ledger lines carry neither handle and are left out, which is
	    the point: the meter panel's run-in is measured to the music, as the
	    page measures it (desk ruling, 2026-09-16). */
	function restOrNoteInk(sys: Element): number[] {
		const xs: number[] = [];
		for (const el of sys.querySelectorAll('*')) {
			if (el.closest('[data-analysis]') || el.closest('[data-held-measure]') || el.closest('[data-meter]')) continue;
			if (el.hasAttribute('data-hit') || el.hasAttribute('data-selection-ring') || el.hasAttribute('data-bar-number')) continue;
			const tacet = el.closest('[data-tacet]');
			const isNote = !!el.parentElement?.hasAttribute('data-event-id') || el.hasAttribute('data-of-event');
			const isRest = tacet ? tacet === el : el.tagName === 'text' && !el.closest('[data-event-id]') && isRestGlyph(el.textContent);
			if (!isNote && !isRest) continue;
			try {
				const b = (el as SVGGraphicsElement).getBBox();
				if (b && (b.width || b.height)) xs.push(b.x);
			} catch {
				/* not rendered */
			}
		}
		return xs;
	}

	/** The barlines, found as drawn: every vertical that spans exactly the
	    staff, the staff's extent taken from the hit rectangle. Slice 3 §11's
	    test, with the stroke width kept so a crop can end on a line's edge. */
	function staffVerticals(sys: Element, staffTop: number, gap: number): Vertical[] {
		const staffBottom = staffTop + 4 * gap;
		const tol = gap * 0.3;
		const out: Vertical[] = [];
		for (const el of sys.querySelectorAll('line')) {
			/* A STEM IS NOT A BARLINE, and a stem can span the staff to within
			   the tolerance. MEASURED 2026-09-15 on Kabalevsky T05, m. 15: a stem
			   at x = 151.85 runs 85.88 to 106.95 against a staff of 85 to 107,
			   so the closing search took it and the loupe showed 12.25 units of
			   an 80-unit measure. A barline is never inside a note's group, a
			   stem always is, so the group is the test. Since `8bb406c`. */
			if (el.closest('[data-event-id]') || el.closest('[data-analysis]')) continue;
			const x1 = Number(el.getAttribute('x1'));
			if (Math.abs(x1 - Number(el.getAttribute('x2'))) > 0.01) continue;
			const y1 = Number(el.getAttribute('y1'));
			const y2 = Number(el.getAttribute('y2'));
			if (Math.abs(Math.min(y1, y2) - staffTop) > tol) continue;
			if (Math.abs(Math.max(y1, y2) - staffBottom) > tol) continue;
			out.push({ x: x1, width: Number(el.getAttribute('stroke-width')) || 0 });
		}
		return out;
	}

	/** Where the header ends: the right edge of the clef and of the key
	    signature's last accidental, as drawn. `-Infinity` where neither is
	    marked. The key signature's handle is `data-key-signature`, N.138
	    increment 2. */
	function headerRightOf(sys: Element): number {
		let right = -Infinity;
		for (const el of sys.querySelectorAll('[data-clef], [data-key-signature]')) {
			let b: DOMRect;
			try {
				b = (el as SVGGraphicsElement).getBBox();
			} catch {
				continue;
			}
			if (b && (b.width || b.height)) right = Math.max(right, b.x + b.width);
		}
		return right;
	}

	/** Remembered per page, so a step does not re-survey the whole score. */
	const surveys = new WeakMap<Element, { signature: string; metrics: PageInk }>();

	function pageMetrics(container: Element): PageInk | null {
		const systems = [...container.querySelectorAll('[data-system]')];
		const signature = systems.map((el) => el.getAttribute('viewBox') ?? '').join('|');
		const held = surveys.get(container);
		if (held && held.signature === signature) return held.metrics;

		let above = -Infinity;
		let below = -Infinity;
		let minTotalSpan = Infinity;
		for (const sys of systems) {
			const hit = sys.querySelector('[data-hit]');
			if (!hit) continue;
			const hitH = Number(hit.getAttribute('height'));
			const gap = hitH / 11;
			const staffTop = Number(hit.getAttribute('y')) + 3.5 * gap;
			const sysWidth = Number(sys.getAttribute('width'));
			if (!(gap > 0) || !Number.isFinite(staffTop)) continue;
			for (const el of sys.querySelectorAll('*')) {
				if (el.tagName === 'g') continue;
				/* WHAT THE LOUPE DOES NOT DRAW CANNOT SET ITS FRAME. The hit
				   rectangles, the page's own held rectangle and the analysis
				   layer are all stripped from the clone, so a phonation break
				   standing above the staff must not push the frame open for ink
				   the loupe then removes. The paper behind the system was skipped
				   here by its width until N.133 took it out of the renderer. */
				if (el.closest('[data-analysis]') || el.closest('[data-held-measure]')) continue;
				/* The page's selection ring is the pane's mark, not engraving, and
				   the clone drops it — so it must not size the frame either. */
				if (el.hasAttribute('data-selection-ring')) continue;
				/* N.126's measure numbers are stripped from the clone too. */
				if (el.hasAttribute('data-bar-number')) continue;
				if (el.tagName === 'rect' && el.hasAttribute('data-hit')) continue;
				let top: number;
				let bottom: number;
				if (el.tagName === 'text') {
					const ink = textInk(el);
					if (!ink) continue;
					({ top, bottom } = ink);
				} else {
					let b: DOMRect;
					try {
						b = (el as SVGGraphicsElement).getBBox();
					} catch {
						continue;
					}
					if (!b || (!b.width && !b.height)) continue;
					top = b.y;
					bottom = b.y + b.height;
				}
				above = Math.max(above, staffTop - top);
				below = Math.max(below, bottom - staffTop);
			}

			/* The system's measures, off its barlines. The same vertical test
			   the held measure's own boundary search uses: a barline is the
			   vertical that spans the staff exactly. */
			const bars = staffVerticals(sys, staffTop, gap).map((v) => v.x);
			const heads = [...sys.querySelectorAll('[data-hit]')].map((el) => Number(el.getAttribute('x')));
			const head = heads.length > 0 ? Math.max(0, Math.min(...heads)) : 0;
			const edges = [head, ...bars.sort((a, b) => a - b), sysWidth];
			/* N.138 INCREMENT 2 SHORTENS THE HEAD, so this has to stay a LOWER
			   bound on what the frame draws or a narrow measure would draw taller
			   than the window cut for it. The frame draws the header up to its last
			   glyph, then a meter, then any carried band, then the body from the
			   head's bound or the barline, then the tail: at least the header plus
			   the body. The first measure's body opens where `clipToHead` opens it,
			   at the later of its hit rectangle and the head's bound. */
			const headerRight = headerRightOf(sys);
			const bound = headBound(musicInk(sys).xs);
			const headTerm = Number.isFinite(headerRight) ? Math.min(headerRight, head) : head;
			for (let i = 0; i < edges.length - 1; i++) {
				/* The window's left edge sits half a gap inside the barline it
				   opens on, as the crop does; the first measure of a system
				   opens on the head and moves nothing. */
				const left = i === 0 ? Math.max(edges[0], bound) : edges[i] + gap * 0.5;
				const span = edges[i + 1] - left;
				if (span < gap) continue;
				minTotalSpan = Math.min(minTotalSpan, headTerm + span);
			}
		}
		if (!Number.isFinite(above) || !Number.isFinite(below)) return null;
		const metrics = { above, below, minTotalSpan };
		surveys.set(container, { signature, metrics });
		return metrics;
	}

	/* THE PAGE CAN MOVE UNDER THE LOUPE, and the loupe has to hear about it.
	   Closing the drawer widens the desk and slides the sheet sideways over the
	   drawer's own 180 ms, and `dockInset` changes at the START of that. An
	   effect that re-ran on `dockInset` alone measured the sheet where it had
	   been, not where it was going: MEASURED, the loupe landed 255.8 px right of
	   the sheet's centre, having centred itself on a stale rectangle.

	   A `ResizeObserver` ON THE PAGE'S CONTAINER answers it. The container's
	   width really does change when the drawer moves, so the observer fires
	   when the layout has settled rather than when the intention was formed, and
	   it covers every other way the page can move too: a window resize, a
	   rotation, a re-pagination. It cannot loop, because it watches the page and
	   the loupe is not inside the page. */
	let layoutTick = $state(0);
	$effect(() => {
		const el = document.querySelector('.fit-paper-container');
		if (!el || typeof ResizeObserver === 'undefined') return;
		const ro = new ResizeObserver(() => (layoutTick += 1));
		ro.observe(el);
		return () => ro.disconnect();
	});

	/* THE NOTATION FACE'S METRICS, for the meter panel (N.138). The page draws
	   its glyphs through the same shared loader, which memoizes the promise, so
	   this costs no second fetch: it hands back the face the page already has.
	   Until it arrives the panel does not draw, which is also what the page
	   does with its own glyphs. */
	let notationFont = $state<LoadedNotationFont | null>(null);
	onMount(() => {
		let alive = true;
		loadNotationFont()
			.then((f) => {
				if (alive) notationFont = f;
			})
			.catch(() => {
				/* no metrics, so no panel; the loupe is otherwise whole */
			});
		return () => {
			alive = false;
		};
	});

	const DIGIT_GLYPHS: readonly RequiredGlyphName[] = [
		'timeSig0', 'timeSig1', 'timeSig2', 'timeSig3', 'timeSig4',
		'timeSig5', 'timeSig6', 'timeSig7', 'timeSig8', 'timeSig9',
	];

	/** The stave as the page draws it, for a panel the loupe draws itself. */
	interface StaveInk {
		/** The five stave lines' y values, read off the page as drawn. */
		lines: number[];
		lineStroke: string;
		lineWidth: number;
	}

	/** A panel of bare stave: its width in page units, then in CSS pixels. */
	interface StavePanel extends StaveInk {
		span: number;
		width: number;
		viewBox: string;
	}

	/** The meter panel's drawing, in page units from the panel's own left edge. */
	interface MeterPanel extends StavePanel {
		glyphs: { char: string; x: number; y: number }[];
		fontFamily: string;
		fontSize: string;
		fill: string;
	}

	interface Frame {
		inner: string;
		viewBox: string;
		/** The frame's own width, stable as the singer steps between measures. */
		width: number;
		/** Its left edge: centred on the sheet, held clear of the dock. */
		left: number;
		/** The magnified measure's width, centred inside the frame. */
		contentWidth: number;
		/** The head's width: the clef and the key signature, at the left edge. */
		headWidth: number;
		/** The head's own crop of the same system, in the same coordinates. */
		headViewBox: string;
		/** N.138. The meter, between the head and the body; null draws none. */
		meter: MeterPanel | null;
		/** N.138 increment 2. The head's pre-music ink that stands right of its
		    last glyph, as its own crop of the clone, between the meter and the
		    body; null where there is none to carry. */
		carry: { width: number; viewBox: string } | null;
		/** N.138 increment 3. The stave past the closing barline; null on the
		    final bar, which ends flush. */
		tail: StavePanel | null;
		/** N.141 step 2. The taken note's squircle on the strip, in CSS pixels;
		    null where the page has none. */
		ring: { x: number; y: number; width: number; height: number; radius: number; stroke: number } | null;
		/** The strip's width: every panel side by side. */
		stripWidth: number;
		contentHeight: number;
		/** The window's height, sized by the TALLEST system on the page. */
		windowHeight: number;
		/** The y its CENTRE sits on; the frame hangs off it at -50%. */
		centreY: number;
		/**
		 * N.147. THE TWO BOUNDS `centreY` WAS CLAMPED AGAINST, carried so the
		 * syllable row's own height (unknown until it opens, and until its
		 * content is measured, since the desk paragraph's height depends on how
		 * many lines the queue wraps to) can be clamped the same way once it is
		 * known, rather than only at the moment this frame was built. See
		 * `shownCentreY` below.
		 */
		stageTop: number;
		stageBottom: number;
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
		void layoutTick;
		void positions;
		void syllablesOpen;
		const font = notationFont;
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
		   tall and one gap is an eleventh of it. The sage rectangle needs it. */
		const hitY = Number(first.getAttribute('y'));
		const hitH = Number(first.getAttribute('height'));
		/** One line gap, an eleventh of that rectangle. Three things need it. */
		const lineGap = hitH / 11;

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

		/* THE LOUPE NEVER EXCEEDS THE PAGE'S OWN WIDTH, ruled by Dann 2026-08-27
		   after his desktop walk found it growing to the viewport with the
		   drawer closed. It magnifies part of that page, so a frame wider than
		   the thing it is a part of reads as a second document rather than as a
		   closer look at this one.

		   THE PAGE'S WIDTH IS MEASURED, not computed from `PAGE_SIZES`: the
		   sheet on screen is what the loupe is a crop of, and on a phone that
		   sheet is already scaled by PageFit. */
		const sheet = container.querySelector('.score-page')?.getBoundingClientRect();
		const room = Math.max(160, window.innerWidth - dockInset - GUTTER * 2);

		/* THE STAGE is as much of the page as the singer can actually see: the
		   sheet, clipped to the room left over beside the dock and above it.
		   Every inset below is taken off the stage rather than off the
		   viewport, which is what makes the loupe read as resting on the PAGE
		   and not as floating in the window.

		   WHERE THE PAGE FITS THE ROOM the stage IS the page, so a fraction of
		   the stage is a fraction of the page's own width, as ruled. Landscape
		   is the one place they part: the sheet is wider than the room beside
		   the dock, so the stage is the visible part of it. That disparity is
		   the one carried since slice 2 and named again in the memo. */
		const stageWidth = sheet && sheet.width > 0 ? Math.min(room, sheet.width) : room;
		const stageBottom = Math.min(
			sheet ? sheet.bottom : window.innerHeight,
			window.innerHeight - dockHeight,
		);

		const inset = pageInset(stageWidth, SIDE_INSET);
		const width = Math.max(160, stageWidth - inset * 2);

		/* THE LOUPE CENTRES ON THE PAGE'S OWN AXIS, ruled by Dann 2026-08-27:
		   it belongs to the page it magnifies, so it lines up with it at every
		   width, drawer open or closed, on both surfaces.

		   IT WAS FLUSH LEFT BEFORE, and the width cap of §11 is what exposed
		   that: while the loupe filled the room it was given, its left edge and
		   the sheet's nearly agreed; once it was capped at the sheet's width it
		   kept the old left edge and the two came apart. MEASURED at 1400 with
		   the drawer closed, the loupe's centre was 272.2 px left of the
		   sheet's.

		   CENTRED, THEN CLAMPED CLEAR. The older ruling still binds: the loupe
		   never overlaps the dock or the open drawer. Where the sheet's centre
		   would put it under one, the clamp wins and the loupe sits as close to
		   the page's axis as it can get. That is not a compromise the code
		   makes quietly: §13 of the memo names the one case where it bites. */
		const stop = Math.max(dockInset + GUTTER, window.innerWidth - GUTTER - width);
		const left = sheet
			? Math.min(Math.max(sheet.x + sheet.width / 2 - width / 2, dockInset + GUTTER), stop)
			: dockInset + GUTTER;

		/* AN ENGRAVED EXCERPT OPENS WITH NO BARLINE BEFORE ITS FIRST NOTE, and
		   Dann walked the deploy and found one: on a mid-system measure the
		   window began at the midpoint before the first column, which is left of
		   the boundary barline, so the loupe read clef, key, barline, note. An
		   orphan barline after a key signature is not something an engraver
		   would ever set.

		   THE BARLINE IS FOUND AS DRAWN, not computed from the renderer's own
		   offset. It is the vertical line spanning exactly the staff, in the
		   left half of the window: a measure has one boundary and its internal
		   columns have none, so there is at most one to find. The staff's own
		   extent comes from the hit rectangle, as the sage mark's does.

		   THE FIRST MEASURE OF A SYSTEM NEEDS NOTHING, and gets nothing. The
		   renderer draws no barline for the first column of a slice
		   (`staff-renderer.ts:541`), so the search finds none and the window
		   keeps the edge it had. That case was already right and this does not
		   touch it. */
		const staffTop = hitY + 3.5 * lineGap;
		const verticals = staffVerticals(sysEl, staffTop, lineGap);
		/* AN OPENING BARLINE STANDS LEFT OF THE MEASURE'S FIRST NOTE. The window's
		   right edge is the next measure that carries entries, and where a tacet
		   run stands between, the window spans the run and its left half can
		   hold the run's own opening barline. MEASURED 2026-09-15 on Kabalevsky
		   T05, m. 23: notes at 344 to 358, the run's barline at 408.83 inside the
		   left half, so the crop opened past every note of the measure. Found by
		   N.141's measurement; the search is slice 3 §11's and N.104's tacet runs
		   exposed it. The first note's leftmost ink, accidental included, bounds
		   the search. */
		let firstOwnInk = Infinity;
		const firstGroup = first.closest('[data-event-id]');
		const firstId = firstGroup?.getAttribute('data-event-id') ?? '';
		for (const el of [
			...(firstGroup ? [...firstGroup.children].filter((c) => !c.hasAttribute('data-hit')) : []),
			...(firstId ? [...sysEl.querySelectorAll(`[data-of-event="${CSS.escape(firstId)}"]`)] : []),
		]) {
			try {
				const b = (el as SVGGraphicsElement).getBBox();
				if (b && (b.width || b.height)) firstOwnInk = Math.min(firstOwnInk, b.x);
			} catch {
				/* not rendered */
			}
		}
		/* THE MEASURE'S OWN OPENING BARLINE, the rightmost left of its first
		   note, and NOT only one inside the hit window. Found on the walk of
		   `eb7d220`: a measure that opens on a rest lost the rest, because the
		   window opened between the rest and the note and the barline stood
		   left of it. `openingBarline` in `loupe.ts` carries the rule and the
		   measurements. A system's first measure has none and keeps its window. */
		const opening = openingBarline(verticals, firstOwnInk);
		if (opening) win.left = opening.x + lineGap * 0.5;

		/* ── N.138 INCREMENT 3. THE EXCERPT ENDS PAST ITS BARLINE ─────────────
		   Ruled by Dann 2026-09-14 on the walk of `78f3db8`: the stave lines run
		   uniformly a little past the closing barline, so the singer reads the
		   measure as lifted from the middle of a piece, and only the final bar
		   ends flush on its barline.

		   THE MIRROR OF THE OPENING SEARCH ABOVE, and `closingBarline` in
		   `loupe.ts` carries the rule. The crop now ends on the closing stroke's
		   outer edge instead of at the next measure's first hit rectangle, so
		   nothing of the next measure can stand in the protrusion: the stave past
		   the barline is the loupe's own panel, not a wider crop.

		   WHAT THE OLD EDGE WAS, established by slice 3 §11's measurement at the
		   other end: a hit rectangle begins at the midpoint before its note,
		   which is usually LEFT of that measure's barline. So the new edge more
		   often moves the crop right, onto the barline, than left.

		   The page's sage rectangle follows, as it followed the opening edge. */
		const closing = closingBarline(verticals, win.left, lineGap);
		if (closing && closing.right > win.left + 1) win.right = closing.right;
		const tailSpanUnits = closing && !closing.final ? EXCERPT_TAIL_SP * lineGap : 0;

		const span = win.right - win.left;

		/* THE CLEF AND THE KEY SIGNATURE, at the loupe's left edge. Ruled by
		   Dann 2026-08-27 from the deploy walk: a musician cannot read a stave
		   without them, and an engraved excerpt carries them however short it
		   is.

		   THEY ARE A SECOND CROP OF THE SAME CLONE, not a second drawing. The
		   renderer puts the clef and the key at the head of every system
		   (`staff-renderer.ts:739` and `:908`), so the head is already in the
		   system this loupe is showing; it is simply outside the x window of
		   every measure but the first. One clone, two viewports, and the glyphs
		   in the head are the page's glyphs for the same reason the measure's
		   are: they ARE the page's.

		   THE HEAD ENDS WHERE THE MUSIC'S FIRST INK BEGINS. `MUSIC_MARK` in
		   `loupe.ts` carries the whole of that decision and why it is paint order
		   rather than a list. Everything from the first marked element onward is
		   the music's, and this walk takes the leftmost ink of it, measured off
		   the DOM as drawn rather than recomputed from `leftMargin` or
		   `TACET_REST`, in the same register as the boundary-barline search above.

		   IT WAS BOUNDED ON HIT RECTANGLES UNTIL 2026-08-29, and that rule failed
		   twice on one walk. A hit rectangle begins at the midpoint BEFORE its
		   note, so it is neither the music's ink nor reliably right of the head's:

		   - A TACET MARK CARRIES NO HIT RECTANGLE. N.104's pass emits
		     `<g data-tacet>` and no `data-hit` at all
		     (`staff-renderer.ts:1382-1512`), so on a system that OPENS with a run
		     the smallest hit belonged to the first note AFTER the run, and the
		     head reached past the consolidated rest and painted it. Dann walked
		     `e347311` and found it: clef, key, a whole rest, then the held
		     measure, on a rest belonging to neither measure.

		   - THE HIT RECTANGLE CUT THE KEY SIGNATURE. On the engraved Without Sun
		     song 1 the first hit begins at x = 56 and the key signature's second
		     sharp is drawn at 56.01, so six of that document's seven systems
		     showed one sharp where the page has two. MEASURED on all seven and
		     looked at at nine times. Dann ruled the one rule in on 2026-08-29.

		   N.104 EXPOSED THE FIRST RATHER THAN CAUSING IT: before it, that
		   document's first measure drew nothing, so the head caught empty space
		   and the assumption held silently. Same shape as the augmentation dot.
		   The second was there the whole time.

		   FOUR THINGS ARE SKIPPED, and the last three are `pageMetrics`' own list
		   at `:222-236` for its own reason: what the loupe does not draw cannot
		   set its frame. A hit rectangle is a touch target and not ink. An
		   `[data-event-id]` group's box contains one, so the group is skipped and
		   its children carry it. A descendant of `[data-tacet]` is skipped because
		   the composed H-bar's body sits inside a `scale()` and `getBBox()` on it
		   returns local coordinates; the group's own box is the drawn one. The
		   analysis layer and the page's held rectangle are stripped from the
		   clone below, so they must not size a crop that will not paint them.
		   The selection ring is NOT stripped since N.113a and is skipped for
		   the opposite reason: it is a mark on the music rather than music, and
		   its box is two and a half times as tall as it is wide, so letting it
		   size the crop would open the frame around the taken note alone. */
		const { nodes, gate, xs: inkXs } = musicInk(sysEl);
		const headWidthUnits = headBound(inkXs);

		/* THE WINDOW BEGINS WHERE THE HEAD ENDS. `clipToHead` in `loupe.ts`
		   carries the whole of that rule, why the two were one number until
		   2026-08-29, and the proof that clipping loses nothing.

		   WHAT DANN WALKED on `510a280`, 2026-09-01: the loupe on m. 4 painted
		   three sharps in a two-sharp key signature. On a measure that opens a
		   system the window's left edge is the leftmost hit rectangle, at
		   x = 56, and the head now runs past it, so both crops contained the
		   second sharp's ink at 56.01 to 61.25 and both drew it.

		   THE PAGE'S SAGE RECTANGLE KEEPS THE UNCLIPPED WINDOW, at `:908` and
		   after. It marks which measure the page is working on, which is a
		   question about the measure and not about the loupe's two crops; the
		   clip is the loupe's business alone. */
		/* N.139 ROUND 3. A MEASURE THAT CHANGES METER MID-SYSTEM OPENS ON THE
		   PAGE METER'S EDGE. The page's meter is stripped from the clone below
		   and the panel draws it instead, so the body must not also carry the
		   room the page left for it. `openAfterPageMeter` in `loupe.ts` carries
		   the rule. The ink edge is the font's, `bBoxNE` of each digit as drawn;
		   with no metrics, the digit's drawn box stands in. */
		const pageMeterRights: number[] = [];
		for (const g of sysEl.querySelectorAll('[data-meter]')) {
			let right = -Infinity;
			for (const t of g.querySelectorAll('text')) {
				const digit = font
					? DIGIT_GLYPHS.map((n) => font.prepared.glyph(n)).find((d) => d.char === t.textContent)
					: undefined;
				if (digit) {
					right = Math.max(right, Number(t.getAttribute('x')) + digit.bBoxNE[0] * lineGap);
					continue;
				}
				try {
					const b = (t as SVGGraphicsElement).getBBox();
					if (b && b.width) right = Math.max(right, b.x + b.width);
				} catch {
					/* not rendered */
				}
			}
			if (Number.isFinite(right)) pageMeterRights.push(right);
		}
		/* The music the meter stands off: rests and notes only. N.139 round 3
		   measured why: on Without Sun song 1, m. 2 the IPA syllable starts at
		   150.27, left of the notehead at 159.47, and a panel measuring to the
		   first ink held the meter two spaces off the syllable. The page measures
		   its run-in to the first column, which is a rest or a note. */
		const restNoteXs = restOrNoteInk(sysEl);
		const firstMusic = firstInkIn(restNoteXs, win.left, win.right);
		const view = openAfterPageMeter(
			clipToHead(win, headWidthUnits),
			pageMeterRights,
			Number.isFinite(firstMusic) ? firstMusic : firstOwnInk,
			inkXs,
			lineGap,
		);
		const viewSpan = view.right - view.left;

		/* THE HEAD SHARES THE FIT rather than being added to it. A measure
		   wider than the phone is shown WHOLE at less than 2.4 rather than
		   clipped at 2.4, because notes lost off the edge of a magnifier are the
		   worse failure: the singer cannot tell it happened. The head is part of
		   what must fit, so it is part of what sets the scale, and the applied
		   magnification is reported in the memo rather than assumed. */
		/* The magnification this modality asks for. On a phone it is the ruled
		   2.4 against the thumbnail; on a desk it is whatever brings the stave
		   to the target, measured against what the page is drawing right now. */
		const drawnLineGap = lineGap * unitPx;
		const magnification = isPhone
			? MAGNIFICATION
			: Math.min(
					DESKTOP_MAX,
					Math.max(DESKTOP_MIN, drawnLineGap > 0 ? DESKTOP_TARGET_LINE_GAP / drawnLineGap : DESKTOP_MIN),
				);

		/* ── N.138. THE METER, A THIRD PANEL BETWEEN THE HEAD AND THE BODY ──
		   Ruled by Dann 2026-09-14: a measure lifted out of its system must carry
		   the meter that counts it, whether or not its system declares one. The
		   layout and why it sits where it does are with `meterLayout` in
		   `loupe.ts`. What lives here is reading the page as drawn.

		   THE FACE IS THE PAGE'S OWN. The clef's `<text>` names the family and
		   the size the renderer set, so the meter is drawn in exactly the glyphs
		   beside it. A page still in primitive shapes has no clef `<text>`, and a
		   page drawn in a face this loader did not hand back has no metrics
		   here, and both draw no panel rather than a meter in the wrong face.

		   THE STAVE LINES ARE THE PAGE'S, found as drawn: the horizontal lines
		   that cross most of the system inside the staff's band. The panel draws
		   them at the same y, the same weight and the same ink, so the stave runs
		   through all three panels. If five cannot be found, the renderer's own
		   construction stands in. */
		/* THE STAVE AS DRAWN, for the two panels the loupe draws itself: the
		   meter and the tail. The widest horizontal on each line of the staff,
		   so a beam that happens to lie along a line cannot stand in for it; if
		   five cannot be found, the renderer's own construction stands in. */
		const staffLines = new Map<number, { el: Element; length: number }>();
		for (const el of sysEl.querySelectorAll('line')) {
			const y = Number(el.getAttribute('y1'));
			if (Math.abs(y - Number(el.getAttribute('y2'))) > 0.01) continue;
			const length = Math.abs(Number(el.getAttribute('x2')) - Number(el.getAttribute('x1')));
			if (!(length >= sysWidth / 2)) continue;
			const step = (y - staffTop) / lineGap;
			if (step < -0.3 || step > 4.3 || Math.abs(step - Math.round(step)) > 0.3) continue;
			const held = staffLines.get(Math.round(step));
			if (!held || length > held.length) staffLines.set(Math.round(step), { el, length });
		}
		const foundLines = staffLines.size === 5 ? [...staffLines.values()].map((l) => l.el) : [];
		const sampleLine = foundLines[0];
		/* NO GROUND IS COPIED, N.133. Until Dann's ruling of 2026-09-13 the
		   renderer painted a cream rectangle behind every system, and these
		   panels repeated it or they read as pale strips between two tinted
		   crops. The renderer paints none now, so every crop and every panel
		   is transparent and the loupe's own `--paper-light` shows through all
		   of them alike. */
		const stave: StaveInk = {
			lines:
				foundLines.length === 5
					? foundLines.map((el) => Number(el.getAttribute('y1'))).sort((a, b) => a - b)
					: [0, 1, 2, 3, 4].map((i) => staffTop + i * lineGap),
			lineStroke: sampleLine?.getAttribute('stroke') ?? '#3a352f',
			lineWidth: sampleLine
				? Number(sampleLine.getAttribute('stroke-width'))
				: font
					? font.prepared.engravingDefaults.staffLineThickness * lineGap
					: 1,
		};

		let meterPanel: Omit<MeterPanel, 'width' | 'viewBox'> | null = null;
		let carry: InkSpan | null = null;
		let headCropUnits = headWidthUnits;
		const clefText = sysEl.querySelector('[data-clef] text');
		const family = clefText?.getAttribute('font-family') ?? '';
		const headerRight = headerRightOf(sysEl);
		if (meter && font && clefText && family.replace(/['"]/g, '') === font.family) {
			/* ── N.138 INCREMENT 2. THE PANEL REPLACES THE HEAD'S AIR ────────────
			   Found by Dann on the walk of `78f3db8`: *"an inexplicable gap between
			   the key signature and the meter signature."* The head ran to
			   `headBound`, the system's first MUSIC ink, so it carried the run-in
			   that belongs before the first note, about eight spaces on a
			   mid-system measure, and the panel stood after all of it.

			   So while a meter draws, the head's crop ends on the header's last
			   glyph, and the panel supplies its whole lead. `headBound`,
			   `clipToHead` and `measureWindow` are unchanged; only what the head's
			   viewBox SHOWS changes, and the body still opens where it did.

			   WHAT THAT WOULD DROP, and it is carried rather than dropped:
			   `carryBand` in `loupe.ts` says what the renderer can paint between
			   the header and `headBound`, which is an opening rest, a first note's
			   ledger line, or a barline between opening rests. The band is walked
			   here over the same paint order as the ink walk, before the gate,
			   with the header, the stave lines, the ground, and the marks the
			   clone strips all left out. */
			const band: InkSpan[] = [];
			for (let i = 0; i < gate; i++) {
				const el = nodes[i];
				if (el.tagName === 'g' || el.hasAttribute('data-key-signature') || el.closest('[data-clef]')) continue;
				/* A HIT RECTANGLE IS NOT INK, and it sorts before the gate: it is its
				   note group's first child, and `MUSIC_MARK` excludes it by name.
				   MEASURED on Kabalevsky T05, system 2: `data-hit="m13-0-1"` at
				   x = 56, left of the header's edge at 61.25, so without this the
				   band opened on the header and carried the whole gap back in. */
				if (el.hasAttribute('data-hit') || el.hasAttribute('data-selection-ring') || el.hasAttribute('data-bar-number')) continue;
				if (el.closest('[data-analysis]') || el.closest('[data-held-measure]')) continue;
				/* N.139: a page head meter stands in this band and is stripped from
				   the clone, so it must not open a carried band of empty stave. */
				if (el.closest('[data-meter]')) continue;
				let b: DOMRect;
				try {
					b = (el as SVGGraphicsElement).getBBox();
				} catch {
					continue;
				}
				if (!b || !(b.width || b.height) || b.width >= sysWidth / 2) continue;
				band.push({ left: b.x, right: b.x + b.width });
			}
			const headEnds = Number.isFinite(headerRight) && headerRight < headWidthUnits;
			carry = headEnds ? carryBand(headerRight, headWidthUnits, view.left, band) : null;
			/* THE RUN-IN IS MEASURED TO THE FIRST REST OR NOTE, never to underlay or
			   a ledger line (desk ruling, 2026-09-16). Where a band is carried, the
			   panel abuts the band, so the air is the band's own up to its music. */
			const airFrom = carry ? carry.left : view.left;
			const music = firstInkIn(restNoteXs, airFrom, view.right);
			const firstInk = Math.min(...inkXs.filter((x) => x >= view.left && x < view.right));
			const bodyAir = Number.isFinite(music)
				? music - airFrom
				: carry
					? 0
					: Number.isFinite(firstInk)
						? firstInk - view.left
						: 0;
			const layout = meterLayout(
				meter.beats,
				meter.beatType,
				(d) => font.prepared.glyph(DIGIT_GLYPHS[d]),
				lineGap,
				staffTop,
				headEnds ? 0 : METER_LEAD_SP * lineGap,
				bodyAir,
			);
			if (layout) {
				if (headEnds) headCropUnits = headerRight;
				meterPanel = {
					...stave,
					span: layout.span,
					glyphs: layout.glyphs,
					fontFamily: family,
					fontSize: clefText.getAttribute('font-size') ?? `${4 * lineGap}px`,
					fill: clefText.getAttribute('fill') ?? '#3a352f',
				};
			} else {
				carry = null;
			}
		}
		const meterSpanUnits = meterPanel?.span ?? 0;
		const carrySpanUnits = carry ? carry.right - carry.left : 0;

		const totalSpan = headCropUnits + meterSpanUnits + carrySpanUnits + viewSpan + tailSpanUnits;
		const fitWidth = Math.max(0, width - FRAME_SIDES);
		const drawn = Math.min(totalSpan * unitPx * magnification, fitWidth);
		const scale = drawn / totalSpan;
		const contentWidth = viewSpan * scale;
		const headWidth = headCropUnits * scale;
		const meterWidth = meterSpanUnits * scale;
		/* THE CROP'S VERTICAL EXTENT is the page's ink band, laid around this
		   system's own staff and padded by half a space so the tallest marks
		   the measure carries — a ledger line, a stem, a tuplet bracket, a
		   tie — are not shaved by their own outline. Constant for the page, so
		   the frame holds still as the singer steps. If nothing can be
		   measured the system's declared box stands in, which is what the
		   frame always used. */
		const page = pageMetrics(container);
		/* N.141 step 2: the band leaves room above for the selection ring's
		   reach, which half a space did not. `ringRoom` in `loupe.ts`. */
		const crop = inkCrop(ringRoom(page, lineGap, INK_PAD_SP, RING_REACH), staffTop, lineGap, INK_PAD_SP, {
			top: sysMinY,
			height: sysHeight,
		});
		const cropTop = crop.top;
		const cropHeight = crop.height;
		const contentHeight = cropHeight * scale;

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
		/* THE LOUPE IS A CONTROL SURFACE FOR ENGRAVING CONCERNS ONLY, ruled by
		   Dann 2026-08-27. The Score Markup's sage formant noteheads, the red
		   crossing squircles and the phonation breaks are analysis, and the
		   singer reads those on the page, in print, or through the browser's own
		   zoom. Inside a magnifier whose whole job is to let one measure be
		   corrected, they are marks that cannot be acted on.

		   FILTERED BY HANDLE, NOT BY COLOUR. `staff-renderer.ts` stamps every
		   analysis mark with `data-analysis` for exactly this, and the package's
		   own test asserts all four kinds carry it. Two of them could have been
		   found by their ink and the phonation break could not, so a colour
		   filter would have suppressed three quarters of a layer and left the
		   fourth mark standing with nothing to explain it.

		   ONE FILTER SERVES BOTH SURFACES, because both render this component,
		   and it serves both viewports because the head and the body are two
		   crops of this one clone. */
		for (const el of clone.querySelectorAll('[data-analysis]')) el.remove();
		/* N.126: THE PAGE'S MEASURE NUMBERS STAY ON THE PAGE. The head crops the
		   system's own left edge, so a system-start number above the clef would
		   stand in the loupe over every measure of that system, naming the wrong
		   bar on all but the first, and the tag already names the held one. A
		   courtesy number after a rest is the page orienting a reader across the
		   piece, which an excerpt does not need. DESK DEFAULT. */
		for (const el of clone.querySelectorAll('[data-bar-number]')) el.remove();
		/* N.139: THE METER DRAWS ONCE. The page now draws its own meter at the
		   head and at every change, and the loupe already supplies the held
		   measure's meter as its own panel (N.138), so the page's copy comes off
		   the clone. Found on the walk of N.139 r1: Sunless 01 m. 2 showed the
		   panel's 12/8 and then a clipped copy of the page's. DESK DEFAULT. */
		for (const el of clone.querySelectorAll('[data-meter]')) el.remove();
		/* THE LOUPE MARKS THE TAKEN NOTE THE WAY THE PAGE DOES, N.113a, ruled by
		   Dann 2026-09-07 from his walk of `e1bcb67`: "a box on the notehead".
		   His words on what it replaced: the bar drawn after the notehead is
		   *"misleading because the insertion point was in the space after тес"*.

		   SINCE N.141 STEP 2 THE LOUPE DRAWS THAT BOX ITSELF and the page's ring
		   comes out of the clone. The clone's copy could only be seen through
		   the body's crop, so a ring reaching left of the crop was either cut
		   or clamped, and the clamp pushed its edge across the note's own
		   accidental: MEASURED 2026-09-15, four notes that open a system, three
		   on the engraved Without Sun song 1 and one on Kabalevsky T05. The
		   loupe's ring is drawn across the whole strip, beneath the panels, with
		   the page ring's own geometry, so the shape stays identical on both
		   surfaces, as ruled 2026-09-14. See `ringStrip` below.

		   THE GROUP'S ATTRIBUTE STILL COMES OFF, and it must. Dann struck the
		   magnified outline on 2026-08-26 because it rode the note's whole
		   group, whose box includes the transparent hit rectangle, and read as
		   a tall capsule at 2.4 times. That mark is not this one: the ring is
		   sized to the notehead's ink, not to the group's box. */
		for (const el of clone.querySelectorAll('[data-selection-ring]')) el.remove();
		for (const el of clone.querySelectorAll('[data-note-selected]')) el.removeAttribute('data-note-selected');
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

		/* THE SQUIRCLE, READ HERE SO THE CARETS CAN CLEAR IT (below) AND N.141
		   STEP 2 CAN PLACE IT (further down, unmoved): one query, shared,
		   rather than two reaching the live page for the same element. Its
		   geometry is untouched here, still the selection ring's own, still
		   read for `stripRing` at its own place; this is only where the
		   element itself is found. */
		const pageRing = sysEl.querySelector('[data-selection-ring][data-note-selected]');

		/* ── N.92, THE CARETS ─────────────────────────────────────────────
		   RULED BY DANN 2026-09-17 (`docs/memory/OPEN.md`, THE CARET clauses 1
		   to 3): a vertical mark past the top and bottom staff lines, an
		   arrowhead at each end pointing inward, one per gap in `positions`,
		   drawn only while the syllables row is closed.

		   EVERY GAP'S X COMES FROM A HIT RECTANGLE, NEVER A NEW MEASUREMENT.
		   The renderer tiles each note's hit rectangle edge to edge with its
		   neighbours' (`staff-renderer.ts`'s `prevXById`/`nextXById`), so the
		   shared edge between two adjacent rectangles already IS the gap
		   between them, rest or no rest in between: a rest earns no
		   rectangle of its own, but the notes on either side of it still meet
		   at its true boundary. The head and tail gaps take the crop's own
		   edges, `view.left` and `view.right`, which is where the opening and
		   closing barline already stand (the ruling above them).

		   A GAP BOTH OF WHOSE NEIGHBOURS ARE RESTS HAS NO RECTANGLE ON
		   EITHER SIDE, and nothing here invents one: that gap is left out.
		   NOT ESTABLISHED how often that costs a real score; the memo says
		   so plainly rather than guessing.

		   THE WEIGHT IS CLAUSE 4's, RULED BY DANN 2026-09-17 LATE, walking the
		   first ship: *"functionally this is correct but... it's monstrous!
		   ...the squircles should remain the featured coloured element."*
		   Plate C's weight, plate D's clearance. Nothing about what a caret
		   DOES changes here, only how it reads beside the squircle it now
		   steps clear of. */
		if (!syllablesOpen && positions.length > 1) {
			const rectOf = (id: string) => container.querySelector(`[data-hit="${CSS.escape(id)}"]`);
			const marks: {
				after: string | null;
				x: number;
				beforeHit: Element | null;
				afterHit: Element | null;
			}[] = [];
			const last = positions.length - 1;
			for (let i = 0; i < positions.length; i++) {
				const p = positions[i];
				if (p.kind !== 'gap') continue;
				const beforeEntry = i > 0 ? positions[i - 1] : undefined;
				const afterEntry = i < last ? positions[i + 1] : undefined;
				const beforeHit = beforeEntry?.kind === 'entry' ? rectOf(beforeEntry.id) : null;
				const afterHit = afterEntry?.kind === 'entry' ? rectOf(afterEntry.id) : null;
				let x: number | null = null;
				if (i === 0) {
					x = view.left;
				} else if (i === last) {
					x = view.right;
				} else if (beforeHit) {
					x = Number(beforeHit.getAttribute('x')) + Number(beforeHit.getAttribute('width'));
				} else if (afterHit) {
					x = Number(afterHit.getAttribute('x'));
				}
				if (x !== null && Number.isFinite(x)) marks.push({ after: p.after, x, beforeHit, afterHit });
			}

			/* THE CLEARANCE, CLAUSE 4's SECOND HALF, AMENDED BY CLAUSE 5's FIRST
			   HALF. *"ensure that the carets do not align with the sides of the
			   squircle: let them be fully expressed without that collision."*
			   The collision is structural: a caret's own x, above, is a note's
			   hit-rectangle edge, and the squircle drawn on that same note can
			   reach the same edge, or past it: N.141 widens the squircle with an
			   accidental and the IPA row, so it is routinely wider than the
			   note's own hit rectangle.

			   THE RULE IS THE SPAN, NOT JUST THE STROKES' OWN MARGINS (clause 5):
			   `bandLeft`/`bandRight` already reach 1.2 line-gaps PAST each stroke,
			   so they bound the squircle's whole span between them; a caret
			   anywhere from one band edge to the other, including dead centre, is
			   caught by the same `continue` guard below and pushed.

			   OUTWARD, NEVER INTO THE TAKEN NOTE. A caret nearer the squircle's
			   left than its centre moves further left; nearer or past centre, it
			   moves right. Either way it moves away from the squircle, never
			   toward it. */
			/* THE CARET'S OWN HIT-RECTANGLE HALF-WIDTH, needed here too: the clamp
			   below stops a caret's rectangle short of the neighbouring note's
			   rectangle's own CENTRE, not merely short of its edge, or the two
			   centres can land close enough that a real tap cannot tell them
			   apart. MEASURED live on the fixture (`m.8`, `F♯3`): clamping to the
			   bare centre put a caret's rectangle and its neighbour's within
			   0.00003 units of each other, closer than a browser's own
			   `MouseEvent.clientX` even reports (it rounds to a whole CSS pixel),
			   so no tap could reliably choose between them. `hitHalf` is the same
			   half-width the hit rectangle itself is drawn at, below, so the
			   clamp and the rectangle it bounds agree by construction. */
			const hitHalf = Math.max(lineGap, 22 / scale);
			if (pageRing) {
				const ringX = Number(pageRing.getAttribute('x'));
				const ringW = Number(pageRing.getAttribute('width'));
				const ringStroke = parseFloat(getComputedStyle(pageRing).strokeWidth) || RING_STROKE;
				const CLEARANCE = lineGap * 1.2;
				const bandLeft = ringX - ringStroke / 2 - CLEARANCE;
				const bandRight = ringX + ringW + ringStroke / 2 + CLEARANCE;
				const centreSquircle = ringX + ringW / 2;
				/* THE STROKE ITSELF IS THE FLOOR, CLAUSE 5's OWN BUG: `7e28272`
				   let the neighbour clamp win outright, and on m. 6 of the
				   fixture a squircle sat close enough to its own next note that
				   `hitHalf` short of that note's centre was STILL inside the
				   squircle's own stroke. MEASURED there: the clamp capped a
				   push at 580.495, short of the stroke's own outer edge at
				   583.33. Clause 4's clamp guards against a caret colliding
				   with the WRONG note; it was never meant to permit one
				   standing inside the RIGHT one, which clause 5, DoD 1, rules
				   absolute. So the stroke edge is applied AFTER the neighbour
				   clamp, as a floor (left) or ceiling (right): the neighbour
				   clamp still wins whenever the two agree, and only gives way,
				   by as little as the conflict demands, where they cannot both
				   be satisfied. */
				for (const mark of marks) {
					if (mark.x <= bandLeft || mark.x >= bandRight) continue;
					if (mark.x <= centreSquircle) {
						let pushed = bandLeft;
						if (mark.beforeHit) {
							const bx = Number(mark.beforeHit.getAttribute('x'));
							const bw = Number(mark.beforeHit.getAttribute('width'));
							pushed = Math.max(pushed, bx + bw / 2 + hitHalf);
						}
						mark.x = Math.min(pushed, ringX - ringStroke / 2);
					} else {
						let pushed = bandRight;
						if (mark.afterHit) {
							const ax = Number(mark.afterHit.getAttribute('x'));
							const aw = Number(mark.afterHit.getAttribute('width'));
							pushed = Math.min(pushed, ax + aw / 2 - hitHalf);
						}
						mark.x = Math.max(pushed, ringX + ringW + ringStroke / 2);
					}
				}
			}

			if (marks.length > 0) {
				/* THE ARROWHEAD'S OWN LENGTH IS THE EXTENSION PAST THE STAFF, so the
				   mark's outer end is the arrow's base and its apex just touches the
				   staff line it terminates on: nothing stands proud of the arrow. One
				   line gap is a stave space, the unit every other measurement on this
				   surface already uses. PLATE C SHRINKS BOTH: the arm from a full
				   line-gap to 0.6, the arrowhead's half-base from 0.8 to 0.34, so the
				   mark reads as a fine terminated line rather than a flag. */
				const staffBottom = staffTop + 4 * lineGap;
				const armLen = lineGap * 0.6;
				const armHalf = lineGap * 0.34;
				const topOuter = staffTop - armLen;
				const bottomOuter = staffBottom + armLen;
				/* THE SQUIRCLE IS THE FEATURED COLOURED ELEMENT; THE CARET IS NOT
				   (clause 4). `--ink-tertiary`'s own literal, the app's warm grey,
				   at 0.32 opacity on the whole mark, and a hairline rather than a
				   flat `1`: the stave's OWN sampled line width, `stave.lineWidth`,
				   so the caret reads as fine as the staff at every magnification
				   instead of as a bar drawn one unit thick regardless of it. */
				const ink = '#6A655F';
				const strokeWidth = stave.lineWidth > 0 ? stave.lineWidth : 1;
				/* THE HIT RECTANGLE IS WIDER THAN THE DRAWN MARK, on the shipped
				   note's own precedent (`staff-renderer.ts`'s "a transparent hit
				   target... SVG hit-tests painted geometry only"). `nearestTarget`
				   resolves by CENTRE alone (`loupe.ts`), so this width sets no
				   boundary between one gap and its neighbour; it only guarantees the
				   rectangle itself is never smaller than the 44 px floor this surface
				   draws every control at, converted from CSS pixels through `scale`,
				   the same px-per-unit every panel here is sized by. IT MOVES WITH
				   THE DRAWN MARK, clause 4's own words, off the same (possibly
				   clamped) `mark.x` the line and arrowheads use; the gap it names
				   is `mark.after`, untouched by the clearance above. `hitHalf` ITSELF
				   IS DECLARED ABOVE, with the clamp: the same half-width bounds the
				   rectangle here and keeps a clamped caret's rectangle off its
				   neighbour's there, and it would be a second, silently agreeing
				   copy of the same number to declare it twice. */
				const hitTop = staffTop - 3.5 * lineGap;
				const hitBottom = staffBottom + 3.5 * lineGap;
				const SVG_NS = 'http://www.w3.org/2000/svg';
				const carets = document.createElementNS(SVG_NS, 'g');
				carets.setAttribute('data-loupe-carets', '');
				const inkGroup = document.createElementNS(SVG_NS, 'g');
				inkGroup.setAttribute('opacity', '0.32');
				carets.appendChild(inkGroup);
				for (const mark of marks) {
					const x = mark.x;
					const hit = document.createElementNS(SVG_NS, 'rect');
					hit.setAttribute('data-loupe-gap', mark.after ?? '');
					hit.setAttribute('x', String(x - hitHalf));
					hit.setAttribute('y', String(hitTop));
					hit.setAttribute('width', String(hitHalf * 2));
					hit.setAttribute('height', String(hitBottom - hitTop));
					hit.setAttribute('fill', 'transparent');
					hit.setAttribute('pointer-events', 'all');
					hit.setAttribute('cursor', 'pointer');
					carets.appendChild(hit);

					const stem = document.createElementNS(SVG_NS, 'line');
					stem.setAttribute('x1', String(x));
					stem.setAttribute('y1', String(topOuter));
					stem.setAttribute('x2', String(x));
					stem.setAttribute('y2', String(bottomOuter));
					stem.setAttribute('stroke', ink);
					stem.setAttribute('stroke-width', String(strokeWidth));
					stem.setAttribute('pointer-events', 'none');
					inkGroup.appendChild(stem);

					const top = document.createElementNS(SVG_NS, 'path');
					top.setAttribute(
						'd',
						`M ${x - armHalf},${topOuter} L ${x + armHalf},${topOuter} L ${x},${staffTop} Z`,
					);
					top.setAttribute('fill', ink);
					top.setAttribute('pointer-events', 'none');
					inkGroup.appendChild(top);

					const bottom = document.createElementNS(SVG_NS, 'path');
					bottom.setAttribute(
						'd',
						`M ${x - armHalf},${bottomOuter} L ${x + armHalf},${bottomOuter} L ${x},${staffBottom} Z`,
					);
					bottom.setAttribute('fill', ink);
					bottom.setAttribute('pointer-events', 'none');
					inkGroup.appendChild(bottom);
				}
				clone.appendChild(carets);
			}
		}

		/* ONE SAGE RECTANGLE ON THE PAGE, marking the measure the loupe holds.
		   It is not a control and it is not decoration: it is the page saying
		   which of its own components is under the knife, and between it and
		   the measure tag the singer never loses their place.

		   IT RIDES THE PAGE'S OWN SVG, the way VoiceProfilePane's selection
		   mark does, so it sits in the system's coordinate space and the
		   thumbnail's scale never has to be undone.

		   AND IT GOES AFTER THE PAPER. It went in at `firstChild`, which is
		   before the system's full-width ground, so it was painted under the
		   paper, and standing first it also stopped the pane's skip over that
		   ground and sent the selection ring under the paper too. Established
		   2026-09-14 with the pane visible; `system-ground.ts` has the account. */
		for (const stale of container.querySelectorAll('[data-held-measure]')) stale.remove();
		if (hitH > 0) {
			const mark = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			mark.setAttribute('data-held-measure', '');
			mark.setAttribute('x', String(win.left));
			mark.setAttribute('y', String(hitY + 3.5 * lineGap));
			mark.setAttribute('width', String(span));
			mark.setAttribute('height', String(4 * lineGap));
			mark.setAttribute('fill', 'none');
			mark.setAttribute('pointer-events', 'none');
			sysEl.insertBefore(mark, afterGround(sysEl));
		}

		/* THE LOUPE ANCHORS FIXED AND NEVER TRAVELS. Ruled by Dann 2026-08-26
		   on the deploy walk, and it replaces the placement r2 shipped, which
		   moved the loupe to keep the sage rectangle in view. The ruling is
		   that the page is the thing that stays still and the loupe is the
		   thing that stays put: the sage rectangle alone moves across the
		   still page, and the measure tag carries the name.

		   SO THE WINDOW IS A CONSTANT, and now it is the ink band's constant.
		   It used to be sized by the TALLEST system's declared box, which held
		   every system still but carried the renderer's reserved headroom with
		   it; the band is cut to what is actually drawn, and is one number for
		   the page in the same way. Every measure is now cropped to the same
		   height, so the window and the drawing agree except where a wide
		   measure meets the width cap and is scaled down whole.

		   AND THE ANCHOR IS THE PAGE, not the measure and no longer the dock.
		   Every surface now pins the loupe's bottom edge a fixed lift above
		   the stage's floor, so the singer's eye and thumb keep one
		   relationship for the whole session on all three. */
		/* The tallest drawing the page can produce, which is the narrowest
		   measure's, capped by the magnification this modality asks for. */
		const windowHeight = cropHeight * windowScale(page, unitPx * magnification, fitWidth);
		/* THE LOUPE IS CENTRED ON THE PAGE'S VISIBLE HEIGHT. It sat in the
		   page's lower third before, which put it below the eyeline; that was
		   this desk's own narrowing of Dann's words rather than his ruling,
		   and he corrected it 2026-08-28.

		   Pinning the BOTTOM rather than the top keeps the anchor on the edge
		   nearest the singer's thumb. The frame's height is a page-wide
		   constant since §14, so the two are equivalent here, and the bottom
		   is the one that cannot drift when the room above it changes. */
		const stageTop = Math.max(sheet ? sheet.top : 0, 0);
		const centreY = centreOnPage(stageTop, stageBottom, window.innerHeight, windowHeight + CHROME, GUTTER);

		/* ── N.141 STEP 2. THE LOUPE'S OWN SQUIRCLE ──────────────────────────────
		   The page's ring, read as drawn and placed on the strip by `stripRing`
		   in `loupe.ts`: same box, same corner, same stroke, scaled. It is drawn
		   in its own layer BENEATH the panels, which are transparent since N.133,
		   so it still sits under the music as ruled 2026-08-28, and it reaches
		   across the seams the body's crop used to cut it at. `pageRing` itself
		   is found above, with the carets, which read it too. */
		const carryWidth = carry ? carrySpanUnits * scale : 0;
		const tailWidth = tailSpanUnits * scale;
		const ring = pageRing
			? stripRing(
					{
						x: Number(pageRing.getAttribute('x')),
						y: Number(pageRing.getAttribute('y')),
						width: Number(pageRing.getAttribute('width')),
						height: Number(pageRing.getAttribute('height')),
						radius: Number(pageRing.getAttribute('rx')) || 0,
						stroke: parseFloat(getComputedStyle(pageRing).strokeWidth) || RING_STROKE,
					},
					view.left,
					headWidth + meterWidth + carryWidth,
					cropTop,
					scale,
				)
			: null;

		frame = {
			inner: clone.innerHTML,
			viewBox: `${view.left} ${cropTop} ${viewSpan} ${cropHeight}`,
			width,
			left,
			contentWidth,
			headWidth,
			headViewBox: `0 ${cropTop} ${headCropUnits} ${cropHeight}`,
			meter: meterPanel
				? { ...meterPanel, width: meterWidth, viewBox: `0 ${cropTop} ${meterSpanUnits} ${cropHeight}` }
				: null,
			carry: carry
				? {
						width: carrySpanUnits * scale,
						viewBox: `${carry.left} ${cropTop} ${carrySpanUnits} ${cropHeight}`,
					}
				: null,
			tail:
				tailSpanUnits > 0
					? {
							...stave,
							span: tailSpanUnits,
							width: tailSpanUnits * scale,
							viewBox: `0 ${cropTop} ${tailSpanUnits} ${cropHeight}`,
						}
					: null,
			ring,
			stripWidth: headWidth + meterWidth + carryWidth + contentWidth + tailWidth,
			contentHeight,
			windowHeight,
			centreY,
			stageTop,
			stageBottom,
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
	   one. At 2.4 times the targets are large, and this only ever helps.

	   ONLY THE BODY'S TARGETS, N.138 increment 2. The head, and now the carried
	   band, each hold a whole copy of the system's clone, hit rectangles and
	   all, and a rectangle's client box is not cut by the crop that hides it,
	   so those copies stand where nothing is drawn. The body is the one crop
	   that shows the measure's own entries.

	   N.92, THE CARETS: ONE POOL, NOT TWO. An entry and the gap beside it
	   compete for the same tap, so resolving them in the same call to
	   `nearestTarget` is what makes "one tap has one winner" true by
	   construction rather than by a second comparison this function would
	   otherwise have to write itself. `data-loupe-hit` and `data-loupe-gap`
	   share nothing else, so their two kinds of id are told apart with a
	   prefix, `note:` or `gap:`, that never reaches `onpick` or `onpickgap`:
	   each still hears exactly the id or the `after` it always heard.

	   N.92 CLAUSE 4's CLAMP KEEPS A FULL `hitHalf` BETWEEN A CLAMPED CARET
	   AND THE NOTE IT CLAMPED AGAINST (the caret-weight block, above), so
	   the two never come close enough for this pool to need a tie-break
	   between them. Found live on the fixture (`m.8`, `F♯3`) BEFORE that
	   margin existed: a caret clamped to a neighbour's bare hit-rectangle
	   centre put the two within 0.00003 units of each other, closer than a
	   real `MouseEvent.clientX` even resolves, so no tap could choose
	   between them reliably. The margin is the fix; this pool needed none
	   of its own. */
	function handleTap(e: MouseEvent): void {
		const notes = [...(windowEl?.querySelectorAll('.loupe-body [data-loupe-hit]') ?? [])].map((el) => {
			const r = el.getBoundingClientRect();
			return {
				id: `note:${el.getAttribute('data-loupe-hit') ?? ''}`,
				cx: r.left + r.width / 2,
				cy: r.top + r.height / 2,
			};
		});
		const gaps = [...(windowEl?.querySelectorAll('.loupe-body [data-loupe-gap]') ?? [])].map((el) => {
			const r = el.getBoundingClientRect();
			return {
				id: `gap:${el.getAttribute('data-loupe-gap') ?? ''}`,
				cx: r.left + r.width / 2,
				cy: r.top + r.height / 2,
			};
		});
		const winner = nearestTarget([...notes, ...gaps], e.clientX, e.clientY);
		if (!winner) return;
		if (winner.startsWith('note:')) onpick(winner.slice('note:'.length));
		else onpickgap(winner.slice('gap:'.length) || null);
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
		   `measureTag`. Four forms, and each one says everything it knows.

		   THE WORD, RULED BY DANN 2026-09-17. `fill` is null where the measure
		   agrees, so its presence alone means `actual` and `expected` differ;
		   which way decides `short` or `over`. Over carries no alarm: a
		   sextuplet under construction reads over the meter until it binds. */
		if (fill && frame.system > 0 && frame.systems > 0) {
			return `${T('loupe.measureTagBoth')
				.replace('%m', measureLabel)
				.replace('%s', String(frame.system))
				.replace('%t', String(frame.systems))
				.replace('%a', String(fill.actual))
				.replace('%e', String(fill.expected))}, ${T(fill.actual < fill.expected ? 'loupe.fill.short' : 'loupe.fill.over')}`;
		}
		if (fill) {
			return `${T('loupe.measureTagFill')
				.replace('%m', measureLabel)
				.replace('%a', String(fill.actual))
				.replace('%e', String(fill.expected))}, ${T(fill.actual < fill.expected ? 'loupe.fill.short' : 'loupe.fill.over')}`;
		}
		if (frame.system > 0 && frame.systems > 0) {
			return T('loupe.measureTag')
				.replace('%m', measureLabel)
				.replace('%s', String(frame.system))
				.replace('%t', String(frame.systems));
		}
		return T('loupe.measureTagShort').replace('%m', measureLabel);
	});

	/**
	 * N.147. "THE LOUPE MUST STAY INSIDE THE VIEWPORT WHEN THE ROW OPENS."
	 *
	 * `frame.centreY` alone still keeps the box's own vertical CENTRE exactly
	 * where `centreOnPage` put it, whatever the box's true height turns out to
	 * be: `top: {centreY}px` plus `transform: translateY(-50%)` centres on the
	 * ELEMENT'S OWN RENDERED HEIGHT, which the browser computes after layout,
	 * so the maths does not need to know that height in advance. What
	 * `centreOnPage`'s CLAMP does need in advance is the height, because the
	 * clamp is what keeps the box's TOP and BOTTOM edges inside the stage; a
	 * clamp computed for a shorter box (before the row existed) does not
	 * protect the taller box the open row produces.
	 *
	 * SO THE BOX MEASURES ITSELF. A `ResizeObserver` on `.loupe` (the same
	 * instrument `layoutTick` already uses on the page's own container, just
	 * turned on this element instead) reports the TRUE rendered height, and
	 * `shownCentreY` reruns the exact clamp `centreY` used, with that true
	 * height instead of the `windowHeight + CHROME` estimate. `measuredHeight`
	 * starts at 0 so the fallback keeps drawing the loupe in the frame before
	 * this component's first paint, exactly as it always has when the row is
	 * absent or closed, which is when the estimate is already exact.
	 *
	 * REACTS TO THE ROW OPENING OR CLOSING, because that changes the box's
	 * layout height and the observer fires. It reacts to the row's OWN CONTENT
	 * changing height too (a longer desk paragraph wrapping to more lines,
	 * up to the `max-height: 104px` cap), for the same reason. A window
	 * resize is covered exactly as well as it already was before this brief:
	 * `layoutTick` reruns the whole `frame` effect on a page-container resize,
	 * which recomputes `centreY` and, on the next frame, this too.
	 */
	let loupeEl = $state<HTMLElement | undefined>(undefined);
	let measuredHeight = $state(0);
	$effect(() => {
		const el = loupeEl;
		if (!el || typeof ResizeObserver === 'undefined') {
			measuredHeight = 0;
			return;
		}
		const ro = new ResizeObserver(([entry]) => (measuredHeight = entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight));
		ro.observe(el);
		return () => ro.disconnect();
	});

	const shownCentreY = $derived.by(() => {
		if (!frame) return 0;
		const height = measuredHeight || frame.windowHeight + CHROME;
		const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
		const centreY = centreOnPage(frame.stageTop, frame.stageBottom, viewportHeight, height, GUTTER);
		/* MEASURED ON AN IPHONE SE'S OWN 375 x 667, WITH THE ROW OPEN: the open
		   row can make the box taller than the room between the top gutter and
		   the dock's own top edge has to give (`stageBottom - GUTTER`, the two
		   bounds `centreOnPage` clamps against). `centreOnPage` resolves that
		   conflict in the TOP gutter's favour (its own `Math.max(..., highest)`
		   runs last), which is the right call for the frame it has always sized
		   — a taken measure, never this tall. It is the wrong call for the row:
		   the result pushed the box 70px INTO the dock, over the singer's own
		   duration and pitch cells, on the exact measurement above.

		   SO THIS CLAMPS AGAIN, the other way, ONLY when the two bounds
		   themselves conflict (`highest > lowest`; `centreOnPage` never
		   reaches this shape on its own). The dock's controls are a singer's
		   hands mid-task; a tight top gutter is a few pixels near a header
		   nothing is pressing. NOT ESTABLISHED how often a real phone reaches
		   this at all: the memo names the one measurement that did, and asks
		   Dann's own walk to look for it deliberately rather than treat this
		   clamp as the last word. */
		const lowest = frame.stageBottom - height / 2;
		const highest = GUTTER + height / 2;
		return highest > lowest ? Math.min(centreY, lowest) : centreY;
	});
</script>

{#if open && frame}
	<!-- ONE ANCHOR ON ALL THREE SURFACES: the frame's own CENTRE, on the
	     page's. It hangs off that point at -50% of its own height, so the
	     centring is exact without anything here knowing what the frame's
	     chrome measures. The rise animation carries the same -50%, or the
	     frame would drop half its height as the animation ended. -->
	<div
		class="loupe"
		bind:this={loupeEl}
		style="left: {frame.left}px; width: {frame.width}px; top: {shownCentreY}px;"
	>
		<p class="loupe-tag" class:paired={!!noteLine}>{tag}</p>
		{#if noteLine}
			<p class="loupe-note">{noteLine}</p>
		{/if}
		<div class="loupe-window" bind:this={windowEl} style="height: {frame.windowHeight}px;">
			<!-- ARIA-HIDDEN for the reason the accidental glyphs already carry:
			     this is the page said louder, not a second thing to hear. The
			     score region has its own label and the dock's readout names the
			     taken entry in words.

			     TWO VIEWPORTS, ONE CLONE. The head crops the system's own left
			     edge, which is where the renderer put the clef and the key; the
			     body crops the held measure. They sit flush, at one scale, in
			     one coordinate space, so the staff lines run through both and
			     the pair reads as one stave rather than as two pictures. -->
			<!-- THE STRIP, N.141 step 2: every panel side by side, and beneath
			     them the loupe's own squircle, so the mark can reach across a
			     seam and still sit under the music. -->
			<div class="loupe-strip" style="width: {frame.stripWidth}px; height: {frame.contentHeight}px;">
			{#if frame.ring}
				<svg
					class="loupe-ring"
					width={frame.stripWidth}
					height={frame.contentHeight}
					viewBox="0 0 {frame.stripWidth} {frame.contentHeight}"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect
						x={frame.ring.x}
						y={frame.ring.y}
						width={frame.ring.width}
						height={frame.ring.height}
						rx={frame.ring.radius}
						stroke-width={frame.ring.stroke}
					/>
				</svg>
			{/if}
			{#if frame.headWidth > 0}
				<svg
					class="loupe-svg loupe-head"
					viewBox={frame.headViewBox}
					width={frame.headWidth}
					height={frame.contentHeight}
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					style="font-family: var(--font-sans)"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- our own renderer's SVG, cloned -->
					{@html frame.inner}
				</svg>
			{/if}
			<!-- N.138. THE METER, drawn by the loupe itself between the two crops,
			     in the page's coordinates and the page's face, so it reads as the
			     meter an engraver would have set after the key signature. -->
			{#if frame.meter}
				<svg
					class="loupe-svg loupe-meter"
					viewBox={frame.meter.viewBox}
					width={frame.meter.width}
					height={frame.contentHeight}
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
				>
					{#each frame.meter.lines as y, i (i)}
						<line
							x1="0"
							y1={y}
							x2={frame.meter.span}
							y2={y}
							stroke={frame.meter.lineStroke}
							stroke-width={frame.meter.lineWidth}
						/>
					{/each}
					{#each frame.meter.glyphs as g, i (i)}
						<text
							x={g.x}
							y={g.y}
							font-size={frame.meter.fontSize}
							font-family={frame.meter.fontFamily}
							fill={frame.meter.fill}>{g.char}</text
						>
					{/each}
				</svg>
			{/if}
			<!-- N.138 INCREMENT 2. What the shortened head would have dropped, a
			     third crop of the same clone, flush against the body, so an opening
			     rest or a ledger line crossing the seam reads as one mark. -->
			{#if frame.carry}
				<svg
					class="loupe-svg loupe-carry"
					viewBox={frame.carry.viewBox}
					width={frame.carry.width}
					height={frame.contentHeight}
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					style="font-family: var(--font-sans)"
				>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- our own renderer's SVG, cloned -->
					{@html frame.inner}
				</svg>
			{/if}
			<svg
				class="loupe-svg loupe-body"
				viewBox={frame.viewBox}
				width={frame.contentWidth}
				height={frame.contentHeight}
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				style="font-family: var(--font-sans)"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- our own renderer's SVG, cloned -->
				{@html frame.inner}
			</svg>
			<!-- N.138 INCREMENT 3. The stave past the closing barline, the loupe's
			     own drawing like the meter, so nothing of the next measure stands
			     in it. Absent on the final bar, which ends flush. -->
			{#if frame.tail}
				<svg
					class="loupe-svg loupe-tail"
					viewBox={frame.tail.viewBox}
					width={frame.tail.width}
					height={frame.contentHeight}
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
				>
					{#each frame.tail.lines as y, i (i)}
						<line
							x1="0"
							y1={y}
							x2={frame.tail.span}
							y2={y}
							stroke={frame.tail.lineStroke}
							stroke-width={frame.tail.lineWidth}
						/>
					{/each}
				</svg>
			{/if}
			</div>
		</div>
		<!-- N.147, RULED BY DANN 2026-09-17: THE SYLLABLES ROW, drawing 1 of the
		     three the desk put to him ("Hairline"). A 1 px rule under the
		     notes, then a full-width disclosure in the loupe's own tag style
		     (`.loupe-syl-label` below copies `.loupe-tag`'s five declarations
		     and adds the uppercase `.loupe-tag` itself does not carry, so the
		     measure tag above is untouched), then the syllables themselves on
		     the loupe's own paper (`LoupeSyllables.svelte`).

		     HIDDEN WHERE THERE IS NOTHING TO SHOW, the same gate the drawer's
		     retired row kept (`showSyllables`, `IntakePanel.svelte`): an empty
		     `slots` means no transcription and no score words either, and a
		     disclosure over nothing is not a disclosure. -->
		{#if slots.length > 0}
			<div class="loupe-syl-hairline"></div>
			<button
				type="button"
				class="loupe-syl-toggle"
				aria-expanded={syllablesOpen}
				aria-controls="loupe-syllables"
				aria-label={T('loupe.syllables')}
				onclick={ontogglesyllables}
			>
				<span class="loupe-syl-label">{T('loupe.syllables')}</span>
				<svg
					class="loupe-syl-chevron"
					class:expanded={syllablesOpen}
					width="10"
					height="10"
					viewBox="0 0 10 10"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				><polyline points="3,1.5 7,5 3,8.5" /></svg>
			</button>
			{#if syllablesOpen}
				<LoupeSyllables id="loupe-syllables" {slots} {pairings} {selectedEventId} {isPhone} {onplace} />
			{/if}
		{/if}
	</div>
{/if}

<style>
	/* TWO SHADOW STEPS, so the lift reads as distance rather than as a border.
	   The loupe is nearest the user; the dock takes the same z-index, because
	   the two are one object.

	   THE Z-INDEX CLEARS THE INSTALL PROMPT, and that is measured rather than
	   chosen. `InstallPrompt.svelte:157` sits at 9000 and raises itself six
	   seconds into an iOS Safari session that carries no fresh decline
	   (N.105), and at any lower value it lands on top of the LYRIC station
	   and the singer cannot reach it. The mobile
	   drawer takes 60 (`Drawer.svelte:1531`) and the update toast 200. The
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
		border: 1.4px solid var(--ink-secondary, #4a4540);
		border-radius: 10px;
		/* Hung off its own centre; see the anchor note on the element. */
		transform: translateY(-50%);
		background: var(--paper-light, #f5f1e8);
		/* ── THREE LAYERS, TO SELL THE LIFT ──────────────────────────────
		   Ruled by Dann 2026-08-28, out of §15's proposal. The geometry of
		   that same round is the precondition: while the frame matched the
		   page's width its side shadows were cut off at the page's edge and
		   read as the page's own edge treatment. There are now 51 px of paper
		   beside it and 71 px below for a shadow to land on.

		   CONTACT SPLIT FROM MID. A lift is read from the GAP between the line
		   that anchors an object to its surface and the diffuse mass beneath
		   it. The old first layer was doing both jobs at `0 4px`, where there
		   is no gap to read, so the loupe sat on the page like a card rather
		   than standing above it.

		   AMBIENT DROPPED AND SPREAD, because perceived height comes from how
		   far the shadow's centre falls below the object.

		   AND OPACITY FALLS AS BLUR RISES. On cream paper a warm black much
		   past 8% at this blur stops reading as shadow and starts reading as
		   dirt on the page. */
		box-shadow:
			0 1px 2px rgba(46, 42, 38, 0.2),
			0 8px 16px rgba(46, 42, 38, 0.13),
			0 20px 44px rgba(46, 42, 38, 0.07);
		/* OPACITY AND TRANSFORM ONLY, 180 ms, the slate's one duration. The
		   loupe and the dock arrive as one motion and leave as one. */
		animation: loupe-rise 180ms ease-out;
	}

	@keyframes loupe-rise {
		from {
			opacity: 0;
			transform: translateY(calc(-50% + 6px));
		}
		to {
			opacity: 1;
			transform: translateY(-50%);
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

	/* THE LOCATOR IS TWO LINES WHEN THERE IS A NOTE TO NAME, and the pair keeps
	   the gap the single line had: the tag gives up its own bottom margin and
	   the second line carries it, so the window below does not move when a note
	   is taken or released. */
	.loupe-tag.paired {
		margin-bottom: 1px;
	}

	/* The second line, N.113b item 2. The measure tag says WHERE the loupe is
	   and this says WHAT is taken inside it, so it is the same face at the same
	   size, one step lighter in weight and without the tracking, which is what
	   makes the pair read as a heading and its subtitle rather than as two
	   labels. */
	.loupe-note {
		margin: 0 0 6px;
		font-family: var(--font-sans, system-ui, sans-serif);
		font-size: 0.6875rem;
		font-weight: 400;
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

	/* N.147, RULED BY DANN 2026-09-17: THE HAIRLINE under the notes, drawing 1
	   ("Hairline") of the three the desk put to him. */
	.loupe-syl-hairline {
		margin: 10px 0 8px;
		height: 1px;
		background: rgba(74, 69, 64, 0.25);
	}

	/* THE DISCLOSURE ROW, full width, in the loupe's own tag style
	   (`.loupe-syl-label` copies `.loupe-tag`'s five declarations, below).
	   Ruled 2026-09-17: sentence case in the string, capitals by this CSS,
	   which is why `.loupe-tag` itself is untouched (its own strings, the
	   measure tag among them, are not meant to shout). */
	.loupe-syl-toggle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		border: none;
		background: none;
		padding: 0;
		margin: 0 0 6px;
		cursor: pointer;
		font: inherit;
	}

	.loupe-syl-label {
		font-family: var(--font-sans, system-ui, sans-serif);
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		color: var(--ink-tertiary, #6a655f);
		text-transform: uppercase;
	}

	/* Copied value for value from `IntakePanel.svelte`'s own disclosure
	   chevron, the tree's one recipe for this glyph (`StationHeader.svelte`'s,
	   per that file's own comment): closed points down, open points up. */
	.loupe-syl-chevron {
		flex-shrink: 0;
		transform: rotate(90deg);
		transition: transform 150ms ease;
		color: var(--ink-tertiary, #6a655f);
	}

	.loupe-syl-chevron.expanded {
		transform: rotate(-90deg);
	}

	@media (pointer: coarse) {
		.loupe-syl-toggle {
			min-height: 44px;
		}
	}

	@media print {
		.loupe-syl-hairline,
		.loupe-syl-toggle {
			display: none !important;
		}
	}

	.loupe-svg {
		display: block;
		flex: 0 0 auto;
	}

	/* N.141 step 2. The panels stand side by side in the strip, and the ring's
	   layer sits under all of them: the panels are later in the document and
	   positioned, so they paint over it, and they are transparent. */
	.loupe-strip {
		position: relative;
		display: flex;
		flex: 0 0 auto;
	}

	.loupe-strip > .loupe-svg {
		position: relative;
	}

	.loupe-ring {
		position: absolute;
		left: 0;
		top: 0;
		overflow: visible;
		pointer-events: none;
	}

	.loupe-ring rect {
		fill: none;
		stroke: var(--lavender, #9585a2);
	}

	/* The head carries the clef and the key and nothing else, and it must not
	   take a tap: the entries live in the body, and a hit rectangle that
	   happened to reach into the head belongs to a note the loupe is not
	   showing. */
	.loupe-head,
	.loupe-meter,
	.loupe-carry,
	.loupe-tail {
		pointer-events: none;
	}

	/* The taken entry, marked exactly as the page marks it: an outline, which
	   adds no geometry to the SVG and cannot shift a coordinate the renderer
	   computed. */
	.loupe :global([data-loupe-selected]) {
		outline: 2px solid var(--sage, #839275);
		outline-offset: 2px;
		border-radius: 2px;
	}

	/* THE HELD MEASURE'S MARK, on the page rather than on this surface. Sage,
	   Studio's accent for the score document, and hairline so it reads as a
	   bracket around the measure rather than as a box drawn on the music. */
	:global([data-held-measure]) {
		stroke: var(--sage, #839275);
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
