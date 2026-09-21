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
	import { onMount, type Snippet } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import { loadNotationFont, type LoadedNotationFont } from '$lib/shane/engine/notation-fonts';
	import { RING_RADIUS, RING_REACH, RING_STROKE, ringBox } from '$lib/shane/selection-ring';
	import type { Slot, PairingMap } from '$lib/shane/pairings';
	import type { Cursor } from '$lib/shane/entry';
	import LoupeSyllables from '$lib/shane/LoupeSyllables.svelte';
import { stackActions } from '$lib/components/Drawer/bandState';
	import type { RequiredGlyphName } from '@ilya/score-parser';
	import type { LoupeRenderBundle } from '$lib/shane/loupe-render-bundle';
	import { deriveMinGap, renderLoupeMeasure, systemMarkup, TAP_FLOOR_PX, type DerivedSpacing } from '$lib/shane/loupe-render';
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
		type HitRect,
		type LoupeMode,
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
		/**
		 * N.153 stage 2: the inputs the page rendered from. Stage 3a draws the held
		 * measure's system from them, in place of a clone of the page's own.
		 */
		bundle?: LoupeRenderBundle | null;
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
		/**
		 * N.149. WHICH OF THE LOUPE'S TWO MODES IS CHOSEN. Syllables draws no
		 * carets; Corrections draws them and holds the correction cells.
		 * `syllablesOpen` keeps its two other jobs (the panel's own open state,
		 * and the re-frame at the effect that reads it), and the mode is read
		 * beside it at that same effect so a swap re-frames too.
		 */
		mode: LoupeMode;
		onmode: (mode: LoupeMode) => void;
		/** The Undo and Redo the Score markup band used to carry, in the same
		    words: `null` is an empty stack and draws nothing. Nothing is drawn
		    at all while the loupe is closed, because this component is not. */
		undoLabel: string | null;
		redoLabel: string | null;
		onundo: () => void;
		onredo: () => void;
		/** The correction cells, mounted by the page in Corrections mode. */
		corrections?: Snippet;
	}

	let {
		open,
		measureLabel,
		noteLine = '',
		measureIndex,
		ownIds,
		selectedEventId,
		revision,
		bundle = null,
		language,
		fill,
		meter = null,
		onpick,
		positions,
		onpickgap,
		dockInset,
		isPhone,
		slots,
		pairings,
		onplace,
		syllablesOpen,
		ontogglesyllables,
		mode,
		onmode,
		undoLabel,
		redoLabel,
		onundo,
		onredo,
		corrections,
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
		/** N.92/clause 1.0. The carets' own markup, serialized apart from
		    `inner` so the body panel can clip `inner` to the measure's true
		    boundary without clipping a caret whose arrowhead legitimately
		    stands past it, in the room clause 6 cleared for it. Empty while
		    no caret is drawn (syllables open, or a single-entry measure). */
		caretsMarkup: string;
		/** Clause 1.0/3.1. The body panel's own clip, native x: nothing of
		    `inner` paints outside `[bodyClipLeft, bodyClipRight]`, whole or
		    half, however far `viewBox` itself reaches for a caret's room. */
		bodyClipLeft: number;
		bodyClipRight: number;
		/** The clip rect's y and height, native units: the same band `viewBox`
		    itself carries as its own second and fourth numbers, named so the
		    template does not parse them back out of that string. */
		bodyClipTop: number;
		bodyClipHeight: number;
		/** A `<clipPath>` id unique to the held measure, so two loupes (or two
		    renders of one, mid-transition) never share a clip definition. */
		bodyClipId: string;
		/** Clause 1.0.1. The stave as the page draws it, for the body panel's
		    own background layer: five lines the full width of `viewBox`,
		    UNCLIPPED, painted behind the clipped clone so the margin clause 6
		    opens for a caret reads as stave rather than as a blank seam
		    before the tail panel's own run picks the same lines up. */
		stave: StaveInk;
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
		/** The y the frame's centre would sit on. Since N.149 only `stageTop`, `stageBottom` and the height are read from this frame; `anchorTop` hangs the card from its top. */
		centreY: number;
		/**
		 * N.147. THE TWO BOUNDS `centreY` WAS CLAMPED AGAINST, carried so
		 * `anchorTop` can centre the card's fixed part (N.149) against the same
		 * stage once its true height is measured.
		 */
		stageTop: number;
		stageBottom: number;
		system: number;
		systems: number;
	}

	let frame = $state<Frame | null>(null);

	/* WHERE THE RENDER IS MEASURED. `renderAnalyzedStaff` returns a string, and
	   a string has no layout: `getBBox` on markup that is detached, in a
	   `<template>`, parsed by `DOMParser`, or under `display: none` answers all
	   zeros (MEASURED in the browser pane, 2026-09-20). So the string is mounted
	   here, in the document but out of sight, and read there. It stands outside
	   `.fit-paper-container`, so no page query can reach it, and it takes no
	   pointer, so no tap can. The markup the loupe DRAWS is parsed again from the
	   same string and never touches the document. */
	let renderHost: HTMLElement | null = null;
	function mountRender(markup: string): Element | null {
		if (!renderHost) {
			renderHost = document.createElement('div');
			renderHost.setAttribute('aria-hidden', 'true');
			renderHost.setAttribute('inert', '');
			renderHost.style.cssText =
				'position:fixed;left:-99999px;top:0;visibility:hidden;pointer-events:none;';
			document.body.appendChild(renderHost);
		}
		renderHost.innerHTML = markup;
		return renderHost.firstElementChild;
	}
	onMount(() => () => {
		renderHost?.remove();
		renderHost = null;
	});

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

	/* THE SPACING THE LOOP SETTLED ON, keyed on the measure's drawing and the page's
	   scale (see the key where it is built). Plain state and not `$state`: nothing renders from it, and reading
	   it inside the effect below must not subscribe the effect to its own cache. */
	const spacingCache = new Map<string, DerivedSpacing>();

	/** FNV-1a over a string, as a hex word: a key for a drawing, not a security matter. */
	function fingerprint(text: string): string {
		let h = 0x811c9dc5;
		for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193);
		return `${text.length}:${(h >>> 0).toString(16)}`;
	}

	/** The smallest gap between neighbouring caret centres, in native units; Infinity with fewer than two. */
	function worstSeparation(marks: readonly { x: number }[]): number {
		const xs = marks.map((m) => m.x).sort((a, b) => a - b);
		let worst = Infinity;
		for (let i = 1; i < xs.length; i++) worst = Math.min(worst, xs[i] - xs[i - 1]);
		return worst;
	}

	/** Each neighbouring pair under the floor, named by the gaps' own ids, for the console. */
	function offendingPairs(marks: readonly { after: string | null; x: number }[], scale: number): string[] {
		const sorted = [...marks].sort((a, b) => a.x - b.x);
		const out: string[] = [];
		for (let i = 1; i < sorted.length; i++) {
			const px = (sorted[i].x - sorted[i - 1].x) * scale;
			if (px < TAP_FLOOR_PX) out.push(`${sorted[i - 1].after ?? 'head'} to ${sorted[i].after ?? 'head'} ${px.toFixed(1)} px`);
		}
		return out;
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
		void mode;
		const font = notationFont;
		const drawnFrom = bundle;
		if (!open || measureIndex === null || ownIds.length === 0 || !drawnFrom) {
			frame = null;
			return;
		}
		const container = document.querySelector('.fit-paper-container');
		if (!container) {
			frame = null;
			return;
		}
		/* THE PAGE IS ASKED TWO THINGS and no more: which system the held measure
		   stands in, and how large that system is on screen. Everything else the
		   loupe draws and measures comes from the render below. */
		const pageFirst = hitsFor(container, ownIds).nodes[0];
		const pageSys = pageFirst?.closest('[data-system]');
		if (!(pageSys instanceof Element)) {
			frame = null;
			return;
		}
		/* THE PAGE'S OWN SYSTEM WIDTH, and the scale it stands at on screen. The
		   loupe's render is one measure at a width of its own, so neither the
		   render's width nor its box says how large the page's notation is; the
		   page's system does. `unitPx` is CSS pixels per user unit of the page's
		   notation, and the loupe's point size is that times the magnification,
		   which no spacing the loupe derives can change (clause 8). */
		const pageSysWidth = Number(pageSys.getAttribute('width'));
		const unitPx = pageSys.getBoundingClientRect().width / pageSysWidth;
		if (!(unitPx > 0)) {
			frame = null;
			return;
		}
		const measure = measureIndex;

		/* ONE ATTEMPT AT THE HELD MEASURE, at a `minGap` (stage 3b). The spacing
		   loop below calls it repeatedly with `derive` set, which measures the
		   carets from the ink alone: no selection, so the spacing it settles on is
		   a property of the measure and the frame does not breathe as the singer
		   steps. The last call is the one whose frame is drawn. Everything the
		   frame is made of stands in this closure, unmoved from stage 3a except
		   where a comment says stage 3b. */
		const attempt = (
			minGap: number,
			derive: boolean,
		): {
			frame: Frame;
			marks: { after: string | null; x: number }[];
			derivationSets: { after: string | null; x: number }[][];
			scale: number;
		} | null => {
		const rendered = renderLoupeMeasure(drawnFrom, measure, minGap);
		const markup = rendered ? systemMarkup(rendered, { fromMeasure: measure, toMeasure: measure }) : '';
		const sysEl = markup ? mountRender(markup) : null;
		if (!sysEl) return null;
		const own = hitsFor(sysEl, ownIds);
		const first = own.nodes[0];
		if (!first) return null;

		/* NO NEXT MEASURE SHARES THE RENDER, and none is drawn (clause 7: no mark
		   from an adjacent measure, at either end). The window's right edge is
		   therefore the render's own right edge, which is where the closing
		   barline stands, and `closingBarline` below takes it from there.
		   `measureWindow` is handed no next hits on purpose. `nextIds`, which
		   bounded the window in stage 3a while the next measure shared the
		   system's render, is no longer read. */

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

		const win = measureWindow(own.rects, [], sysWidth);
		if (!win || !(sysHeight > 0) || !(sysWidth > 0)) return null;

		/* THE LOUPE NEVER EXCEEDS THE PAGE'S OWN WIDTH ON A PHONE. Ruled by Dann
		   2026-08-27 after his desktop walk found it growing to the viewport
		   with the drawer closed: it magnifies part of that page, so a frame
		   wider than the thing it is a part of reads as a second document
		   rather than as a closer look at this one.

		   RETRACTED ON A DESK, 2026-09-18 (clause 1.0.2). His words: *"especially
		   on desktop, the measure contents should be fully represented... If we
		   don't shrink the point size of the notation, the only responsible
		   alternative is to allow wider measures to be fully expressed on a
		   device where they can be."* The notation's point size is the fixed
		   quantity; the window is the variable one. A desk's own `stageWidth` is
		   no longer held to the page's own, only to `room`, the viewport less the
		   drawer and the gutters. A phone still holds to the page: its own room
		   is already the constraint N.140 (open, unbuilt) answers with landscape
		   or a scroll, not with a wider loupe than the thumbnail it sits on.

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
		const stageWidth = isPhone && sheet && sheet.width > 0 ? Math.min(room, sheet.width) : room;
		const stageBottom = sheet ? Math.min(sheet.bottom, window.innerHeight) : window.innerHeight;

		const inset = pageInset(stageWidth, SIDE_INSET);
		/* CLAUSE 12 RENAMED THIS FROM `width`. It is now a CEILING the content
		   is clamped under (the frame's own
		   final `width` takes further down), not the frame's own width: the
		   room the stage offers, less the side inset, same as before. The
		   frame's own width is computed once `stripWidth` exists, past the
		   panel strip below, and centring (`left`/`stop`) moves with it,
		   past that same point, so both read the width they actually draw
		   rather than the room that used to stand in for it. */
		const maxWidth = Math.max(160, stageWidth - inset * 2);

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
		/* N.153 STAGE 3b: THE SCALE IS NO LONGER FITTED. It was
		   `min(totalSpan * unitPx * magnification, maxWidth - FRAME_SIDES) /
		   totalSpan`, so a measure wider than the room drew smaller. The loupe
		   now widens its own engraving to reach the tap floor, and a fixed ceiling
		   on a wider span is a SMALLER scale: the loop would widen the drawing and
		   the cap would shrink it back, and the on-screen separation would not
		   move. Clause 8: the notation's point size is the fixed quantity and the
		   window is the variable one. The strip may now be wider than the window,
		   which scrolls it (`.loupe-window` in the stylesheet). N.140 owns how
		   the singer moves what does not fit. */
		void totalSpan;
		const scale = unitPx * magnification;
		/* `viewSpan * scale` WOULD BE THIS PANEL'S OWN NATIVE WIDTH, but the
		   body panel's actual content width is `bodyContentWidth`, computed
		   with the carets further down: clause 6 widens the body's own crop
		   by AT LEAST `CARET_MARGIN` on each side, more where a caret's own
		   footprint needs it (measured on the fixture, m. 2's head gap; see
		   the widening below), so its CSS width must grow with it at the
		   same `scale` or the extra room comes out as a stretch. */
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

		/* PARSED FROM THE RENDER'S OWN STRING, detached: it is markup to draw and
		   nothing here measures it. A `<template>` parses SVG in its own
		   namespace and runs no script. */
		const cloneHost = document.createElement('template');
		cloneHost.innerHTML = markup;
		const clone = cloneHost.content.firstElementChild as Element;
		/* The render carries no `data-note-selected` and no selection ring, which
		   are VoiceProfilePane's marks on the page; the strips below remove them
		   all the same, and stay in case the renderer ever draws either.

		   THE PAGE NO LONGER WEARS A HELD-MEASURE RECTANGLE, removed 2026-09-19
		   on Dann's ruling, so there is nothing of it to take off the clone. */
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
		   rather than two reaching the page for the same element. Its
		   geometry is untouched here, still the selection ring's own, still
		   read for `stripRing` at its own place; this is only where the
		   element itself is found. */
		/* THE SQUIRCLE, IN THE LOUPE'S OWN COORDINATES (stage 3b). Stage 3a read the
		   PAGE's ring off `pageSys`, and that was right while the render was the
		   page's own drawing at the page's width. The render is now one measure at
		   a spacing of its own, so the page's ring stands where the page's note
		   stands and this drawing's note is elsewhere. The box is made here from
		   the mounted render by `ringBox`, the function the page's ring is made
		   by, so the shape is the page's and the position is the loupe's. A
		   taken note in another measure has no ring in this render, and clause 7
		   says none belongs here. A derivation attempt draws no ring: the
		   spacing is a property of the measure, not of the selection.

		   ONE DIFFERENCE, NOT ESTABLISHED AS HARMLESS: `ringBox` reads the ink of
		   the whole system it is handed for the ring's top and bottom, so on a
		   measure whose ink is shorter than its page system's the ring is
		   shorter than the page's. */
		const pageRing = (() => {
			if (derive || !selectedEventId) return null;
			const hit = sysEl.querySelector(`[data-hit="${CSS.escape(selectedEventId)}"]`);
			const group = hit?.closest('[data-event-id]');
			const box = hit && group ? ringBox(hit, group, selectedEventId) : null;
			return box ? { ...box, radius: RING_RADIUS, stroke: RING_STROKE } : null;
		})();

		/* CLAUSE 13/2.5. MORE DAYLIGHT BETWEEN THE SQUIRCLE AND THE CARET NEXT
		   TO IT, moved up from beside the boundary functions below so
		   `CARET_MARGIN` can be sized against it: Dann, on the walk, *"Maybe
		   even a little more daylight between the squircle and that caret on
		   the right side?"* Raised from the retired clause 4's own 1.2
		   line-gaps (dropped when the position rule became ink/stroke-based
		   and the boundary functions below started reading the bare stroke,
		   zero clearance) to 1.6, DESK DEFAULT, reversible, and it is spent
		   only where the squircle is the boundary: a neighbour's plain ink
		   asks for none, since it is not what Dann's own words named. THIS
		   IS THE DRAWN CLEARANCE, not the tap-safety floor, the desk's own
		   distinction, put to Dann and not waved off: the two are decided by
		   different things, a hit rectangle's CENTRE in CSS pixels for the
		   second, measured separately below the scan. */
		const SQUIRCLE_CLEARANCE = lineGap * 1.6;

		/* THE BODY'S OWN MARGIN, CLAUSE 6: *"the spacing in the Loupe is
		   temporary and situational, and bears not on the paper GUI."* Past
		   the crop `measureWindow` already chose, on both sides,
		   unconditionally, so the crop never resizes when a caret's own
		   position happens to need the room and never resizes when it does
		   not: one width per measure, not one that jumps as the singer steps
		   between notes. It is spent three ways below: it is the room a
		   nudged barline (§ below) moves into, it is why a caret drawn at
		   the crop's own true edge is never clipped (clause 6 item 5), and,
		   since clause 12 keyed the frame's own WIDTH to this same span, it
		   is why that width holds still while the singer steps too.

		   CLAUSE 12's OWN FLOOR, "moving the selection within one measure
		   does not change it at all." MEASURED, m. 7, before this margin
		   included `SQUIRCLE_CLEARANCE`: with G3 (the measure's own first
		   note) taken, the squircle's own clearance pushed the head gap's
		   boundary `3.549` native units, `0.645` line-gaps, past the fixed
		   two line-gaps `CARET_MARGIN` alone reserved, so the dynamic
		   footprint widening two paragraphs down had to make up the
		   difference every time a first- or last-note squircle came and
		   went, and `frame.width` moved with it, `642.3` against `634.55`
		   CSS px, under the singer's own hand. `CARET_MARGIN` now reserves
		   `SQUIRCLE_CLEARANCE` itself, unconditionally, on both sides, so
		   the dynamic widening's own `Math.min`/`Math.max` almost never has
		   more to add than this fixed floor already holds, and `frame.width`
		   stops moving with the selection on every measure this fixture
		   carries (the whole-fixture stability walk, in the memo, is the
		   proof). NOT ESTABLISHED past this fixture: a squircle wide enough
		   (an unusually long IPA syllable, N.141's own width driver) to
		   still exceed this floor would still touch the dynamic widening,
		   and would still move `frame.width`, since nothing here can predict
		   another note's own squircle short of building it, which is
		   N.153's own extraction and out of this brief's scope. The ring and
		   the frame's own `viewBox`, further down, are repointed from
		   `view.left`/`viewSpan` to `bodyViewLeft`/`bodyViewSpan` so the crop
		   that is drawn agrees with the crop this block reasons about. */
		const CARET_MARGIN = lineGap * 2 + SQUIRCLE_CLEARANCE;
		let bodyViewLeft = view.left - CARET_MARGIN;
		let bodyViewRight = view.right + CARET_MARGIN;
		let bodyViewSpan = viewSpan + CARET_MARGIN * 2;

		/* HOISTED OUT OF THE CARET BLOCK BELOW, clause 1.0: the body's visible
		   content is clipped to the measure's own true boundary further down
		   (`bodyClipLeft`/`bodyClipRight`), whether or not a caret is ever
		   drawn (syllables can be open, or the measure can carry a single
		   entry), and that clip has to answer for a NUDGED barline exactly
		   the way the caret math that moves it does. Declared here, at zero,
		   so the clip has an answer even when the gate below never runs; the
		   caret block still owns writing to them. */
		let openingNudge = 0;
		let closingNudge = 0;
		/* THE CARETS' OWN MARKUP, SERIALIZED SEPARATELY FROM THE CLONE. Clause
		   1.0/3.1: the body panel clips the clone's own content to the
		   measure's true boundary (`bodyClipLeft`/`bodyClipRight`, at the
		   frame's own assembly, further down) so nothing from a neighbour
		   measure or the system's head ever paints there, whole or half. A
		   caret's own arrowhead legitimately stands past that boundary, in
		   the room `CARET_MARGIN` cleared for it, so it cannot be inside the
		   same clipped element: it is drawn to its own string and placed
		   outside the clip in the template, unclipped. */
		let caretsMarkup = '';

		/* ── N.92, THE CARETS ─────────────────────────────────────────────
		   RULED BY DANN 2026-09-17 (`docs/memory/OPEN.md`, THE CARET clauses 1
		   to 6): a vertical mark past the top and bottom staff lines, an
		   arrowhead at each end pointing inward, one per gap in `positions`,
		   drawn only in Corrections mode (N.149; it was the
		   syllables row's own open state until then).

		   THE POSITION RULE, CLAUSE 6, m. 17: A CARET STANDS IN THE MIDDLE OF
		   THE SPACE IT NAMES. *"Strange choice to make the last caret overlap
		   the barline instead of planting it right in the middle of the space
		   that preceded the barline, there's plenty of room there."* The
		   space is bounded by INK, never by a hit rectangle: a note's own
		   drawn edge (`inkOf`, below, unions `data-event-id`'s children and
		   `data-of-event`'s, which is where an accidental or a dot lives),
		   the squircle's own outer stroke where the neighbour is the taken
		   note, or a barline for the head and tail gaps. MEASURED on the
		   fixture, m. 14: the OLD hit-rectangle clamp let a caret stand only
		   `hitHalf` short of a neighbour's hit-rectangle CENTRE, which on
		   that note was 7-plus units short of where its ink actually began,
		   and the caret landed on the note. The ink boundary does not make
		   that mistake: it is where the note actually is.

		   THE HEAD AND TAIL GAPS TAKE THE BARLINE, not the crop's own edge
		   (clause 6, m. 3: *"caret first, then barline"*). Where a measure
		   opens a system and carries no barline of its own, the crop's own
		   edge stands in, the same rule `measureWindow` already used.

		   WHERE EVEN THE INK-TO-BARLINE ROOM IS SHORT OF A CARET'S OWN
		   FOOTPRINT, THE BARLINE MOVES, not the caret onto something.
		   MEASURED on the fixture, m. 3: the head gap's native room was 3.01
		   units against a 3.74-unit floor, short by well under one line-gap.
		   Nothing else in the system references a barline's own position
		   (unlike a note, which a beam, a tie or a ledger line can also
		   depend on), and `CARET_MARGIN` above is exactly the room it moves
		   into.

		   A GAP WHOSE INK CANNOT BE READ ON EITHER SIDE FALLS BACK TO THE
		   OLD HIT-RECTANGLE TILING, unchanged: the renderer already tiles
		   each note's hit rectangle edge to edge with its neighbours'
		   (`staff-renderer.ts`'s `prevXById`/`nextXById`), so that boundary
		   is never wrong, only less exact than ink where ink can be read.
		   NOT ESTABLISHED how often the fallback fires on a real score; the
		   memo says so rather than guessing.

		   WHAT THIS DOES NOT ATTEMPT: an INTERIOR gap (not the head or tail)
		   whose true room, ink to ink or ink to squircle stroke, is short of
		   a caret's footprint has no floor here, unlike the head and tail
		   gaps above: it is placed at its true midpoint anyway, on the best
		   information there is, and may stand against or over that ink or
		   that stroke. MEASURED on the fixture: a beam crossing the gap is
		   one cause (nine gaps, the memo names them); a neighbour's ink and
		   the selected note's squircle stroke leaving less room between them
		   than the caret's own width is another and the more common one
		   (eighteen gaps, the memo names them too). Neither boundary can
		   move under this brief's own constraints: the squircle's geometry
		   is N.141's, and `staff-renderer.ts` draws a beam from BOTH its
		   notes' own positions at once, flushed once after every note in the
		   system is placed, with neither note carrying a handle back to the
		   gap between them, so redrawing one from outside the renderer risks
		   a beam that no longer says what duration it groups. A note's own
		   ink is not moved either, for the same reason the research this
		   brief drew on found translating one unsafe in general: a beam, a
		   tie, or a ledger line can depend on a note's position without the
		   note itself carrying a handle back to them.

		   THE WEIGHT IS CLAUSE 4's, RULED BY DANN 2026-09-17 LATE, walking the
		   first ship: *"functionally this is correct but... it's monstrous!
		   ...the squircles should remain the featured coloured element."*
		   Plate C's weight, plate D's clearance. Nothing about what a caret
		   DOES changes here, only how it reads beside the squircle it now
		   steps clear of. */
		/* N.149 r2 5c, RULED BY DANN 2026-09-20 11:54. THE CARETS AND THE
		   PILL'S FILL ARE ONE CONDITION, `mode === m && syllablesOpen`: they
		   appear together and go together, so a retracted panel restores the
		   measure to how it looked when the loupe opened. Do not split them. */
		const marks: { after: string | null; x: number }[] = [];
		const derivationSets: { after: string | null; x: number }[][] = [];
		if ((derive || (mode === 'corrections' && syllablesOpen)) && positions.length > 1) {
			const rectOf = (id: string) => sysEl.querySelector(`[data-hit="${CSS.escape(id)}"]`);
			/* THE INK ITSELF: the union of a note's own group (excluding its
			   hit rectangle, which is not ink) and everything stamped
			   `data-of-event` for it (an accidental, a dot: both stand outside
			   the group, `staff-renderer.ts`'s own placement). A REST HAS
			   NEITHER, since its hit rectangle sits in an ANONYMOUS group
			   (`staff-renderer.ts`, N.92 clause 5: never `data-event-id`, which
			   `Loupe.svelte`'s own `restOrNoteInk` tells a rest apart by), so
			   its glyph is found the one other way available: the hit
			   rectangle's own next sibling, which is where the renderer
			   paints it, immediately after. */
			const inkOf = (id: string): { left: number; right: number } | null => {
				let minX = Infinity;
				let maxX = -Infinity;
				const widen = (el: Element) => {
					try {
						const b = (el as SVGGraphicsElement).getBBox();
						if (b.width || b.height) {
							minX = Math.min(minX, b.x);
							maxX = Math.max(maxX, b.x + b.width);
						}
					} catch {
						/* not rendered */
					}
				};
				const g = sysEl.querySelector(`[data-event-id="${CSS.escape(id)}"]`);
				if (g) for (const c of g.children) if (!c.hasAttribute('data-hit')) widen(c);
				for (const c of sysEl.querySelectorAll(`[data-of-event="${CSS.escape(id)}"]`)) widen(c);
				if (!Number.isFinite(minX)) {
					const sib = rectOf(id)?.nextElementSibling;
					if (sib) widen(sib);
				}
				return Number.isFinite(minX) ? { left: minX, right: maxX } : null;
			};
			/* WHICH NOTE IS TAKEN, AS THE CARETS SEE IT: its id and the two edges of
			   its ring. Drawing uses the singer's own selection. A derivation
			   attempt runs the placement once for each entry in turn, and once for
			   none (below), because the squircle moves the caret beside the taken
			   note and the spacing has to hold whichever note is taken. */
			const ringEdgesOf = (r: { x: number; width: number; stroke: number } | null) =>
				r ? { left: r.x - r.stroke / 2, right: r.x + r.width + r.stroke / 2 } : null;
			let takenId: string | null = selectedEventId;
			let ringLeftEdge: number | null = ringEdgesOf(pageRing)?.left ?? null;
			let ringRightEdge: number | null = ringEdgesOf(pageRing)?.right ?? null;

			/* PLATE C'S OWN NUMBERS, moved up from the drawing pass below: the
			   position rule needs `armHalf` to know how much room a caret's
			   own footprint requires before it can decide whether the barline
			   must move. `hitHalf` moves up with it for the same reason clause
			   4 already gave it: the hit rectangle's own half-width, so a
			   clamped caret's rectangle and its neighbour's stay a full
			   `hitHalf` apart rather than coinciding (measured on the fixture,
			   `m.8`, `F♯3`: two rectangles' centres 0.00003 units apart, closer
			   than a real `MouseEvent.clientX` even resolves). */
			const staffBottom = staffTop + 4 * lineGap;
			const armLen = lineGap * 0.6;
			const armHalf = lineGap * 0.34;
			const hitHalf = Math.max(lineGap, 22 / scale);
			const MIN_SPACE = armHalf * 2 + lineGap * 0.3;
			/* `SQUIRCLE_CLEARANCE` IS DECLARED ABOVE, beside `CARET_MARGIN`,
			   clause 13/2.5: `CARET_MARGIN` now reserves it unconditionally,
			   so the two have to agree on one number rather than risk a
			   second, silently disagreeing copy. */

			const last = positions.length - 1;
			/* `withClearance` DEFAULTS TRUE AND THE MARKS LOOP BELOW CAN ASK
			   FOR FALSE. Clause 13/2.5's own clearance is additive daylight
			   for the ordinary case; it is not a floor, and nothing gave it
			   one. MEASURED on this session's own walk, m. 6, the gap after
			   `A♭3`: the clearance alone (`ringRightEdge + 8.8`) already
			   read past `593`, the NEXT note's own ink starting at `587.51`,
			   before the caret's own width was even counted, so the
			   position rule's midpoint landed inside that note whatever it
			   computed. The bare stroke, zero clearance, is what this gap
			   drew before clause 13, still short of the note but by less;
			   asking for a little more daylight cannot be the reason a gap
			   that used to fall short of touching now falls INSIDE the
			   neighbour it never used to reach, so the loop below asks for
			   the bare edge again wherever the clearance edge alone already
			   crosses the other side, and takes the true midpoint of that
			   instead. Never worse than clause 13 found it; DoD 5b's own
			   report names every gap this still does not reach. */
			const leftBoundary = (i: number, withClearance = true): number | null => {
				if (i === 0) return opening ? opening.x : null;
				const e = positions[i - 1];
				if (e.kind !== 'entry') return null;
				/* THIS ENTRY SITS TO THE LEFT of gap `i`, so where it is the
				   taken note, the edge THIS gap must clear is the squircle's
				   own RIGHT stroke, not its left: the boundary facing the gap,
				   never the far side of the note. */
				if (e.id === takenId && ringRightEdge !== null) {
					return ringRightEdge + (withClearance ? SQUIRCLE_CLEARANCE : 0);
				}
				return inkOf(e.id)?.right ?? null;
			};
			const rightBoundary = (i: number, withClearance = true): number | null => {
				if (i === last) return closing ? closing.right : null;
				const e = positions[i + 1];
				if (e.kind !== 'entry') return null;
				/* SYMMETRIC: this entry sits to the RIGHT of gap `i`, so its
				   squircle's LEFT stroke is the edge facing the gap. */
				if (e.id === takenId && ringLeftEdge !== null) {
					return ringLeftEdge - (withClearance ? SQUIRCLE_CLEARANCE : 0);
				}
				return inkOf(e.id)?.left ?? null;
			};

			const placeMarks = (): { after: string | null; x: number }[] => {
			const out: { after: string | null; x: number }[] = [];
			for (let i = 0; i < positions.length; i++) {
				const p = positions[i];
				if (p.kind !== 'gap') continue;
				let leftB = leftBoundary(i);
				let rightB = rightBoundary(i);
				/* THE CLEARANCE FALLBACK, against `MIN_SPACE`, the same
				   floor the head and tail gaps nudge a barline to reach: can
				   a caret stand in this room at all. If the daylight clause
				   13 adds already leaves less than that, using it only
				   trades a squircle touch for an ink one, or makes an
				   existing ink touch deeper, never the "little more
				   daylight" it was asked for. Both sides fall back to their
				   bare stroke together, so the mark stays the TRUE midpoint
				   of one consistent room rather than a mix of a clearanced
				   edge on one side and a bare one on the other, and the
				   result is never worse than clause 13 found it: the bare
				   room is always at least as wide as the clearanced one. */
				if (leftB !== null && rightB !== null && rightB - leftB < MIN_SPACE) {
					leftB = leftBoundary(i, false);
					rightB = rightBoundary(i, false);
				}
				if (i === 0 && leftB === null) leftB = bodyViewLeft;
				if (i === last && rightB === null) rightB = bodyViewRight;

				let x: number | null = null;
				if (leftB !== null && rightB !== null) {
					if (i === 0 && opening && rightB - leftB < MIN_SPACE) {
						const deficit = MIN_SPACE - (rightB - leftB);
						openingNudge = Math.max(openingNudge, deficit);
						leftB -= deficit;
					}
					if (i === last && closing && rightB - leftB < MIN_SPACE) {
						const deficit = MIN_SPACE - (rightB - leftB);
						closingNudge = Math.max(closingNudge, deficit);
						rightB += deficit;
					}
					x = (leftB + rightB) / 2;
				} else {
					/* THE FALLBACK: hit-rectangle tiling, exactly as shipped
					   before this ruling, for the gap whose ink could not be
					   read on the side that needed it. */
					const beforeEntry = i > 0 ? positions[i - 1] : undefined;
					const afterEntry = i < last ? positions[i + 1] : undefined;
					const beforeHit = beforeEntry?.kind === 'entry' ? rectOf(beforeEntry.id) : null;
					const afterHit = afterEntry?.kind === 'entry' ? rectOf(afterEntry.id) : null;
					if (i === 0) x = bodyViewLeft;
					else if (i === last) x = bodyViewRight;
					else if (beforeHit) x = Number(beforeHit.getAttribute('x')) + Number(beforeHit.getAttribute('width'));
					else if (afterHit) x = Number(afterHit.getAttribute('x'));
				}
				if (x !== null && Number.isFinite(x)) out.push({ after: p.after, x });
			}
			return out;
			};
			if (derive) {
				/* EVERY SELECTION, and none. The worst separation over all of them is
				   what the loop is handed, so the floor holds for whichever note the
				   singer takes. The sets are returned together; the loop takes the
				   minimum across them. */
				derivationSets.push(placeMarks());
				for (const p of positions) {
					if (p.kind !== 'entry') continue;
					const hit = sysEl.querySelector(`[data-hit="${CSS.escape(p.id)}"]`);
					const group = hit?.closest('[data-event-id]');
					const box = hit && group ? ringBox(hit, group, p.id) : null;
					if (!box) continue;
					const e = ringEdgesOf({ ...box, stroke: RING_STROKE });
					takenId = p.id;
					ringLeftEdge = e?.left ?? null;
					ringRightEdge = e?.right ?? null;
					derivationSets.push(placeMarks());
				}
				takenId = null;
				ringLeftEdge = null;
				ringRightEdge = null;
			}
			marks.push(...placeMarks());

			/* THE BARLINE MOVES, NOT THE CARET: applied to the CLONE, so the
			   live page's own engraving is untouched (constraint: "the page
			   and the print" do not change). `nudgeBarline` matches by x
			   within half a unit rather than by identity, because a FINAL
			   measure's closing barline is drawn as a pair and both must move
			   together to stay a pair. */
			const nudgeBarline = (nativeX: number, deltaX: number): void => {
				for (const line of clone.querySelectorAll('line')) {
					if (line.getAttribute('stroke') !== '#3a352f') continue;
					const x1 = Number(line.getAttribute('x1'));
					const x2 = Number(line.getAttribute('x2'));
					if (Math.abs(x1 - x2) > 0.01 || Math.abs(x1 - nativeX) > 0.5) continue;
					line.setAttribute('x1', String(x1 + deltaX));
					line.setAttribute('x2', String(x2 + deltaX));
				}
			};
			if (openingNudge > 0 && opening) nudgeBarline(opening.x, -openingNudge);
			if (closingNudge > 0 && closing) nudgeBarline(closing.right, closingNudge);

			/* THE MARGIN'S OWN FLOOR, MEASURED ON THE FIXTURE, m. 2's head
			   gap: the fixed two-line-gap `CARET_MARGIN` is not always
			   enough. That gap's boundary is the opening barline, not the
			   crop's own edge, and the position rule can place the mark
			   anywhere between the barline and the squircle it precedes;
			   where that midpoint lands close to `bodyViewLeft` anyway
			   (measured: 0.015 units short of it), the arrowhead's own
			   half-width (`armHalf`) crosses the crop and clause 5 item 5,
			   whole marks only, breaks. The SAME risk holds for a mark that
			   falls exactly ON the crop's edge, the fallback path takes
			   above when a measure opens a system with no barline of its
			   own (`x = bodyViewLeft` there, dead centre on the edge). So
			   the margin widens again here, past whichever mark actually
			   landed closest to an edge, and never narrower than the fixed
			   margin above: `Math.min`/`Math.max` against the existing
			   value, not a replacement of it. */
			if (marks.length > 0) {
				const footprint = armHalf + lineGap * 0.15;
				const leftMost = Math.min(...marks.map((m) => m.x));
				const rightMost = Math.max(...marks.map((m) => m.x));
				bodyViewLeft = Math.min(bodyViewLeft, leftMost - footprint);
				bodyViewRight = Math.max(bodyViewRight, rightMost + footprint);
				bodyViewSpan = bodyViewRight - bodyViewLeft;
			}

			if (marks.length > 0 && !derive) {
				/* THE ARROWHEAD'S OWN LENGTH IS THE EXTENSION PAST THE STAFF, so the
				   mark's outer end is the arrow's base and its apex just touches the
				   staff line it terminates on: nothing stands proud of the arrow. One
				   line gap is a stave space, the unit every other measurement on this
				   surface already uses. PLATE C SHRINKS BOTH: the arm from a full
				   line-gap to 0.6, the arrowhead's half-base from 0.8 to 0.34, so the
				   mark reads as a fine terminated line rather than a flag. */
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
				caretsMarkup = carets.outerHTML;
			}
		}

		/* THE HELD MEASURE HAS NO MARK ON THE PAGE. Ruled by Dann 2026-09-19,
		   closing OPEN.md clause 16.
		
		   A sage rectangle was drawn here into the PAGE's SVG from 2026-09-14.
		   It was never seen on screen: the rect carried `fill="none"` and took
		   its stroke only from a `:global` rule in this component, and Dann's
		   screenshot of 2026-09-18 showed no rectangle anywhere. Whether the rule
		   failed to reach it or the page's own re-render took the node is NOT
		   ESTABLISHED, and is now moot.
		
		   WHAT CARRIES THE CORRESPONDENCE INSTEAD: the lavender squircle, drawn on
		   both the paper and the loupe, and the measure tag that names the held
		   measure in words. THE KNOWN COST, accepted: those mark the SELECTED
		   entry, not the held measure, so with no selection, or a selection in
		   another measure, the page does not say which measure the loupe holds.
		
		   AND THE LOUPE NO LONGER WRITES INTO AN SVG IT DOES NOT OWN, which is
		   what `system-ground.ts` was reasoning about. That file stays: the
		   selection ring still needs it, from VoiceProfilePane. */

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
		const windowHeight = cropHeight * unitPx * magnification;
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
		/* THE BODY'S OWN CONTENT WIDTH GROWS WITH ITS MARGIN, clause 6: the
		   viewBox below is wider by `CARET_MARGIN` on each side, so the CSS
		   width drawing it must be wider by the same amount at the same
		   `scale`, or the extra room would come out as a stretch instead of
		   as blank space. The ring's own origin moves with it, `bodyViewLeft`
		   in place of `view.left`, so ring and content agree on what native x
		   the body panel's own left edge now names. */
		const bodyContentWidth = bodyViewSpan * scale;
		const ring = pageRing
			? stripRing(
					pageRing,
					bodyViewLeft,
					headWidth + meterWidth + carryWidth,
					cropTop,
					scale,
				)
			: null;

		/* ── CLAUSE 1.0/11. THE BODY SHOWS ONE MEASURE AND NOTHING ELSE ───────
		   Dann, m. 13: *"There should not be any information in the Loupe from
		   adjacent measures."* `bodyViewLeft`/`bodyViewRight` are wider than the
		   measure's own true content, on purpose, clause 6's room for a caret's
		   own footprint; they are a VIEWPORT, not a promise about what paints
		   inside it. Before this, whatever the clone happened to hold in that
		   extra room painted too: found on m. 13, the system's own key
		   signature (already drawn once, correctly, by the head panel) peeking
		   past its own boundary; found on m. 5 and m. 14, the previous
		   measure's closing barline; found on m. 16 (3.1), a sharp cut in half
		   by the widened edge, which is worse than showing a whole foreign
		   mark, since a half-drawn accidental claims a pitch the score never
		   wrote.

		   THE CLIP IS `view.left`/`view.right`, not `bodyViewLeft`/
		   `bodyViewRight`. `view` is the boundary N.138 and N.139 already
		   proved safe: `clipToHead` and `openAfterPageMeter` place it so it
		   never lands inside a glyph's own ink (`loupe.ts`'s own comment on
		   `clipToHead`, "the union is exactly the union the unclipped pair
		   painted"), which is exactly the property clause 3.1 asks for.
		   `bodyViewLeft`/`bodyViewRight` earn no such proof: they are `view`
		   plus a fixed or footprint-driven margin with no relationship to
		   where any glyph's ink happens to fall, which is why one could cut a
		   sharp in half and the other, by construction, cannot.

		   CLAUSE 11: NO BARLINE AT THE LEFT, EVER, whatever it belongs to.
		   *"Found another unwanted initial barline. These need to be gone."*
		   The opening barline is not adjacent content (it is this measure's
		   own), so clause 7's clip let it stand; it is excluded here on its
		   own rule instead, which is why the two clauses are read together.
		   The head panel's clef, key and meter already stand for the
		   measure's start, and a barline after a meter signature is wrong
		   notation regardless of whose measure drew it. `opening.x` is the
		   barline's own, UN-nudged position, and nudging only ever moves it
		   further left (`nudgeBarline` above), so clipping everything left of
		   `opening.x` itself, whole stroke included, excludes it whether or
		   not it moved. `leftBoundary(0)`'s own reference for the head
		   caret's position is untouched by this: the caret still centres
		   against `opening.x`, drawn or not, exactly as clause 6 already had
		   it. `CLIP_PAD` here is spent the other way from the closing side
		   below, keeping the stroke OUT rather than keeping it whole.

		   THE CLOSING BARLINE STAYS, clause 7's own continuation conceit,
		   Dann endorsed and clause 11 does not touch. `closing.right` IS
		   ALREADY THE STROKE'S OWN OUTER EDGE, not its centre: `loupe.ts`'s
		   `closingBarline` adds half the line's own width in, so no pad
		   belongs here in the ordinary, un-nudged case. FOUND ON THIS
		   SESSION'S OWN WALK, m. 8: an unconditional pad here, meant only to
		   protect the stroke, instead let `484.64` to `466.92` of m. 9's own
		   syllable, `деж`/`ˈdʲɛʒ`, the NEXT measure's, paint half-visible
		   past `closing.right` on the un-nudged case, clause 7's and 3.1's
		   own violation at once. THE PAD IS SPENT ONLY WHERE A NUDGE ACTUALLY
		   MOVED THE STROKE: `nudgeBarline` (above) redraws it past
		   `closing.right` when the position rule needed the room, and only
		   then does the clip need to reach further to avoid cutting the
		   barline it just moved. Where there is no closing barline at all (a
		   system's last measure), the plain `view` edge is already the
		   proven boundary and gets nothing added to it either. */
		const CLIP_PAD = lineGap * 0.15;
		let bodyClipLeft = opening ? opening.x + CLIP_PAD : view.left;
		let bodyClipRight = closing
			? closing.right + closingNudge + (closingNudge > 0 ? CLIP_PAD : 0)
			: view.right;

		/* THE SAFETY NET, GENERAL WHERE THE BARLINE REFERENCE ALONE IS NOT.
		   FOUND ON THIS SESSION'S WALK, m. 8: the CLOSING BARLINE is a
		   NOTATION boundary, and m. 9's own first note sits cleanly past it,
		   but that note's underlay SYLLABLE, centred on its own narrow note
		   and wider than it (a long word, ordinary on the page, Gould does
		   not pad a barline against lyric ink), reached back past the
		   barline to `444.64`, inside what `bodyClipRight` above still
		   called this measure's own room. Clause 7 names a syllable
		   explicitly ("not a syllable, not a fragment of one"), so a
		   boundary that only reasons about NOTATION cannot be the whole
		   rule. This pass reads every mark clause 7 already names foreign
		   (an adjacent event's own group, its accidental or dot, its
		   IPA/Cyrillic syllable, a stray key signature or clef) and pulls
		   the clip in from whichever side it is found on, past its own near
		   edge by `CLIP_PAD`, never past the boundary already set above
		   (`Math.max`/`Math.min` against the existing value, the same
		   discipline clause 6's own footprint widening uses): the barline
		   reference is right everywhere it is not contradicted by an
		   actual mark, and only actual marks narrow it further. */
		const ownPrefix = `m${measureIndex}-`;
		/* READ FROM `sysEl`, THE MOUNTED RENDER, NOT `clone`. `clone` is a
		   detached copy at this point in the effect (`clone.innerHTML` is not
		   read until the frame is assembled, well after), and `getBBox` on a
		   detached SVG element has no layout to report: it throws, or on some
		   engines answers all-zero, so every candidate silently failed this
		   check's own `catch` until this was caught and fixed. `sysEl` is the
		   same system, mounted, its coordinates identical to the clone that
		   was parsed from the same string, which is what every other ink read
		   in this effect already relies on (`inkOf`, above, reads `sysEl` for
		   the same reason). */
		/* A GROUP'S OWN `getBBox` IS NOT ITS INK, the same trap `inkOf` above
		   was already built to avoid: `[data-event-id]`'s own group carries
		   its `data-hit` rectangle as a child, wider than the glyph and
		   `pointer-events="none"` so it never taps, but very much part of
		   the group's own box. FOUND THE SAME SESSION, minutes after the fix
		   above: reading it whole pulled `bodyClipRight` in past `closing`
		   itself, on the strength of a transparent rectangle nobody sees,
		   and clipped the barline clause 7 requires. This reads a group's
		   CHILDREN, excluding the hit rectangle, the way every other ink
		   measurement here already does; anything else (an accidental, a
		   dot, a syllable) is read whole, since none of them carry one. */
		const markInk = (el: Element): { left: number; right: number } | null => {
			let minX = Infinity;
			let maxX = -Infinity;
			const widen = (node: Element) => {
				try {
					const b = (node as SVGGraphicsElement).getBBox();
					if (b.width || b.height) {
						minX = Math.min(minX, b.x);
						maxX = Math.max(maxX, b.x + b.width);
					}
				} catch {
					/* not rendered */
				}
			};
			if (el.tagName === 'g' && el.hasAttribute('data-event-id')) {
				for (const c of el.children) if (!c.hasAttribute('data-hit')) widen(c);
			} else {
				widen(el);
			}
			return Number.isFinite(minX) ? { left: minX, right: maxX } : null;
		};
		for (const el of sysEl.querySelectorAll(
			'[data-event-id], [data-of-event], [data-ipa-of], [data-withheld], [data-key-signature], [data-clef]',
		)) {
			const id =
				el.getAttribute('data-event-id') ??
				el.getAttribute('data-of-event') ??
				el.getAttribute('data-ipa-of') ??
				el.getAttribute('data-withheld');
			const isForeign = el.hasAttribute('data-key-signature') || el.hasAttribute('data-clef') || (id !== null && !id.startsWith(ownPrefix));
			if (!isForeign) continue;
			const b = markInk(el);
			if (!b) continue;
			if (b.right <= bodyClipLeft || b.left >= bodyClipRight) continue;
			/* NEVER PAST THE CLOSING BARLINE ITSELF: clause 7 endorsed it as
			   the continuation conceit, and clause 11 leaves it standing, so
			   a neighbour's own ink tightens the room short of it, never
			   through it. The opening side carries no such floor: clause 11
			   excludes that barline unconditionally already, so there is
			   nothing there for a neighbour's ink to be kept clear of. */
			if (b.left >= (bodyClipLeft + bodyClipRight) / 2) {
				const floor = closing ? closing.right + closingNudge : bodyClipLeft;
				bodyClipRight = Math.max(floor, Math.min(bodyClipRight, b.left - CLIP_PAD));
			} else {
				bodyClipLeft = Math.max(bodyClipLeft, b.right + CLIP_PAD);
			}
		}

		/* ── CLAUSE 12. THE LOUPE SIZES TO ITS CONTENTS ───────────────────────
		   Dann, after the width retraction made every loupe full width: *"I
		   see no reason to impose uniformity in dimension for all Loupes...
		   this Loupe can be much tighter to its contents than it is."*

		   THE STRIP'S OWN WIDTH, `stripWidth` below, IS ALREADY EVERY PANEL
		   THIS EFFECT JUST BUILT, side by side, at the `scale` `maxWidth`
		   capped. The frame's own outer width is that plus the card's own
		   padding and border (`FRAME_SIDES`, the same figure `fitWidth`
		   already spends), clamped between `MIN_WIDTH` below and `maxWidth`,
		   the room the stage offers, unchanged from what `width` used to be
		   unconditionally.

		   `MIN_WIDTH`'S OWN NUMBER, set by what has to fit ABOVE the
		   notation, not by the notation: the tag row and the readout's own
		   second line, whose text is neither fixed nor short (a fill flag
		   widens the tag, a taken rest with a beat and a pulse widens the
		   readout). MEASURED on this fixture, off the DOM's own font at
		   canvas `measureText`, not `getBoundingClientRect` (the tag's own
		   box already fills its row, so its rect reports the ROW's width,
		   not the text's): the widest tag, `m. 17 · system 6 of 6 · 14 of
		   12, over`, sets `220.7` px at the tag's own weight and tracking;
		   the widest readout, `Rest · beat 4, pulse 2 · Quarter`, sets
		   `160.6` px at the readout's own, lighter weight. `280` clears the
		   wider of the two (the tag) by `59.3` px past its own text plus
		   the card's own padding and border (`FRAME_SIDES`, `22.8` px),
		   room for a longer fill flag or a higher system count than this
		   fixture carries, not chosen by eye. DESK DEFAULT, reversible:
		   Dann's own ask was for "a minimum," not this figure. NOT
		   ESTABLISHED beyond this fixture's own longest strings. */
		const stripWidth = headWidth + meterWidth + carryWidth + bodyContentWidth + tailWidth;
		const MIN_WIDTH = 280;
		const width = Math.min(maxWidth, Math.max(MIN_WIDTH, stripWidth + FRAME_SIDES));

		/* THE LOUPE CENTRES ON THE PAGE'S OWN AXIS, ruled by Dann 2026-08-27:
		   it belongs to the page it magnifies, so it lines up with it at every
		   width, drawer open or closed, on both surfaces. MOVED HERE FROM
		   `maxWidth`'s own declaration by clause 12: centring now reads the
		   width the frame actually draws, not the room that used to stand in
		   for it, or a short measure would centre as if it were still full
		   width and sit off-axis from the page it names.

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

		return {
			marks,
			derivationSets,
			scale,
			frame: {
			inner: clone.innerHTML,
			caretsMarkup,
			bodyClipLeft,
			bodyClipRight,
			bodyClipTop: cropTop,
			bodyClipHeight: cropHeight,
			bodyClipId: `loupe-body-clip-${measureIndex}`,
			stave,
			viewBox: `${bodyViewLeft} ${cropTop} ${bodyViewSpan} ${cropHeight}`,
			width,
			left,
			contentWidth: bodyContentWidth,
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
			stripWidth,
			contentHeight,
			windowHeight,
			centreY,
			stageTop,
			stageBottom,
			system: systemIndexOf(ranges, measureIndex) + 1,
			systems: ranges.length,
			},
		};
		};

		/* ── THE LOUPE'S OWN SPACING, N.153 STAGE 3b ──────────────────────────
		   Render, measure every adjacent pair of carets in CSS pixels at the
		   loupe's own scale, and widen `minGap` until none stands nearer than the
		   tap floor. `deriveMinGap` in `loupe-render.ts` is the search and says
		   why it is a bisection and why the render passes no `targetWidth`.

		   THE ANSWER IS A PROPERTY OF THE MEASURE AND THE PAGE'S SCALE, so it is
		   kept: stepping the selection re-runs this effect and must not re-run the
		   search, or the frame would take a dozen renders under the singer's hand
		   at every step. THE KEY IS THE DRAWING, NOT THE BUNDLE. The bundle is a
		   new object whenever the page redraws, which the singer's own selection
		   causes (MEASURED 2026-09-20: the search re-ran on every raise while the
		   key was the bundle's identity), so the key is the measure's render at the
		   page's own spacing, which changes exactly when what the search reads
		   changes, and the page's scale. */
		const pageRender = renderLoupeMeasure(drawnFrom, measure, drawnFrom.spacing.minGap);
		const key = `${measure}|${isPhone ? 'p' : 'd'}|${unitPx.toFixed(3)}|${positions.length}|${pageRender ? fingerprint(pageRender.svg) : ''}`;
		let derived = spacingCache.get(key);
		if (!derived) {
			const t0 = performance.now();
			derived = deriveMinGap(drawnFrom.spacing.minGap, (g) => {
				const a = attempt(g, true);
				if (!a) return null;
				return { worst: Math.min(...a.derivationSets.map(worstSeparation)) * a.scale, scale: a.scale };
			});
			if (spacingCache.size > 400) spacingCache.clear();
			spacingCache.set(key, derived);
			console.debug(
				`[loupe] m.${measure} minGap ${derived.minGap.toFixed(2)} (page ${drawnFrom.spacing.minGap}), ${derived.iterations} renders in ${(performance.now() - t0).toFixed(0)} ms, worst ${derived.worst.toFixed(2)} px`,
			);
			if (!derived.converged || derived.worst < TAP_FLOOR_PX) {
				/* THE MEASURE CANNOT HAVE THE WIDTH IT NEEDS. Best spacing reached is
				   drawn, and the residue goes to the console: no mark on the page and
				   none in the loupe (CONTRACT.md section 6). */
				const at = attempt(derived.minGap, true);
				const pairs = at ? at.derivationSets.flatMap((set) => offendingPairs(set, at.scale)) : [];
				console.warn(
					`[loupe] m.${measure} kept minGap ${derived.minGap.toFixed(2)} short of the ${TAP_FLOOR_PX} px floor: ${pairs.join('; ')}`,
				);
			}
		}
		const result = attempt(derived.minGap, false);
		frame = result ? result.frame : null;
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
	 * N.149. THE MUSIC IS THE ANCHOR, and it does not move between modes or
	 * when the panel opens.
	 *
	 * RULED BY DANN 2026-09-20, ruling 6, option B: *"the music sits at one
	 * vertical, every time; sections grow downward; when the contents exceed
	 * the room the accordion scrolls inside itself rather than the card
	 * moving."* Until this ship the card hung off its own CENTRE
	 * (`translateY(-50%)`) and was clamped against the dock, so opening the
	 * syllables row grew it upward and moved the music by the row's height
	 * (measured 2026-09-20, m. 9 at 390 x 844: 44 px).
	 *
	 * SO THE CARD IS HUNG FROM ITS TOP, and the top is derived from the part
	 * of the card that never changes height: `.loupe-top`, the tag, the note
	 * line, the window and the bar. `centreOnPage` centres THAT part on the
	 * page's visible height, exactly as it always centred the whole card when
	 * the whole card was that part alone. The panel region hangs below it and
	 * has no vote in where anything stands.
	 *
	 * THE PANEL REGION'S ROOM IS DERIVED, never chosen: what is left between
	 * the bottom of `.loupe-top` and the bottom of the viewport, less a small
	 * foot for the shadow to land on. The panel scrolls inside that room
	 * (`.loupe-panel`), so clause 15 holds at every frame: the card is never
	 * smaller than what it contains, and it is never taller than the screen.
	 */
	let topH = $state(0);
	const PANEL_FOOT = 8;
	/* The card's own vertical furniture, from `.loupe` in this file's
	   stylesheet: 10 px above, 12 below, and the 1.4 px border twice. */
	const CARD_FURNITURE = 10 + 12 + 1.4 * 2;
	/* The bar's own height, for the one frame before `.loupe-top` is measured:
	   the hairline and its margins (19) plus the 44 px floor. */
	const BAR_ESTIMATE = 19 + 44;

	const bareHeight = $derived(frame ? (topH ? topH : frame.windowHeight + CHROME + BAR_ESTIMATE) + CARD_FURNITURE : 0);

	const anchorTop = $derived.by(() => {
		if (!frame) return 0;
		const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
		const centreY = centreOnPage(frame.stageTop, frame.stageBottom, viewportHeight, bareHeight, GUTTER);
		return centreY - bareHeight / 2;
	});

	const panelRoom = $derived.by(() => {
		if (!frame) return 0;
		const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
		return Math.max(0, viewportHeight - PANEL_FOOT - (anchorTop + bareHeight));
	});

	/* THE MODES, in the order the pill draws them, and the roving focus the
	   desk selector already carries (`DeskHead.svelte`, `handlePairKeydown`). */
	const MODES: readonly LoupeMode[] = ['syllables', 'corrections'];

	function modeLabel(m: LoupeMode): string {
		return T(m === 'syllables' ? 'loupe.syllables' : 'loupe.station.corrections');
	}

	function handleModeKeydown(event: KeyboardEvent): void {
		const current = MODES.indexOf(mode);
		let next = current;
		if (event.key === 'ArrowRight') next = (current + 1) % MODES.length;
		else if (event.key === 'ArrowLeft') next = (current - 1 + MODES.length) % MODES.length;
		else if (event.key === 'Home') next = 0;
		else if (event.key === 'End') next = MODES.length - 1;
		else return;
		event.preventDefault();
		if (next !== current) {
			onmode(MODES[next]);
			document.getElementById(`loupe-mode-${MODES[next]}`)?.focus();
		}
	}

	const actions = $derived(stackActions(undoLabel, redoLabel, language));
</script>

{#if open && frame}
	<!-- ONE ANCHOR ON ALL THREE SURFACES: the frame's own CENTRE, on the
	     page's. It hangs off that point at -50% of its own height, so the
	     centring is exact without anything here knowing what the frame's
	     chrome measures. The rise animation carries the same -50%, or the
	     frame would drop half its height as the animation ended. -->
	<div
		class="loupe"
		style="left: {frame.left}px; width: {frame.width}px; top: {anchorTop}px;"
	>
		<div class="loupe-top" bind:offsetHeight={topH}>
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
				<!-- CLAUSE 1.0/3.1: the clone's own content is clipped to the
				     measure's true boundary, so nothing of a neighbour measure or
				     the system's head paints in the room `viewBox` opens for a
				     caret's footprint, whole or half (`Loupe.svelte`'s own script,
				     "CLAUSE 1.0. THE BODY SHOWS ONE MEASURE AND NOTHING ELSE"). The
				     carets themselves are OUTSIDE this clip, drawn from their own
				     markup, since their arrowheads legitimately stand in that same
				     room. -->
				<clipPath id={frame.bodyClipId}>
					<rect
						x={frame.bodyClipLeft}
						y={frame.bodyClipTop}
						width={frame.bodyClipRight - frame.bodyClipLeft}
						height={frame.bodyClipHeight}
					/>
				</clipPath>
				<!-- CLAUSE 1.0.1: the margin clause 6 opens on both sides of the
				     clip is otherwise blank, which is what read as a gap before
				     the tail panel's own short run of stave. Painted first, so
				     the clipped clone's own five lines (same y, same stroke,
				     same width, read off the same page) simply paint over this
				     layer where the two overlap: never a doubled or a
				     conflicting line, only one continuous stave across the
				     whole strip. Unclipped and un-namespaced: `x1`/`x2` reach
				     far past this panel's own `viewBox` on both sides and the
				     viewBox itself is what crops them, the same way it already
				     crops everything else here. -->
				<g>
					{#each frame.stave.lines as y, i (i)}
						<line
							x1="-100000"
							y1={y}
							x2="100000"
							y2={y}
							stroke={frame.stave.lineStroke}
							stroke-width={frame.stave.lineWidth}
						/>
					{/each}
				</g>
				<g clip-path="url(#{frame.bodyClipId})">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- our own renderer's SVG, cloned -->
					{@html frame.inner}
				</g>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- this component's own carets, built above -->
				{@html frame.caretsMarkup}
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
		<div class="loupe-syl-hairline"></div>
		<div class="loupe-bar">
			<!-- N.149, DESIGN A, CHOSEN BY DANN 2026-09-17 AND RESTATED 2026-09-20:
			     *"Two segments in one pill on the left of the bar, the way the
			     desk selector already pairs Transcription and Fit. The chosen
			     one is filled. Undo, Redo and the chevron sit flush right."*
			     The recipe is `DeskHead.svelte`'s pair, copied: a tablist,
			     `role="tab"`, `aria-selected`, roving `tabindex`, arrows and
			     Home and End. NO `aria-controls` ON THE MEMBERS, for the reason
			     `DeskHead.svelte:100-107` records: the two share one panel
			     region and neither owns a panel of its own. -->
			<div class="loupe-pair" role="tablist" aria-label={T('a11y.tabs')}>
				{#each MODES as m (m)}
					<button
						type="button"
						class="loupe-pair-member"
						class:chosen={mode === m && syllablesOpen}
						role="tab"
						id="loupe-mode-{m}"
						aria-selected={mode === m}
						tabindex={mode === m ? 0 : -1}
						onclick={() => onmode(m)}
						onkeydown={handleModeKeydown}
					>
						{modeLabel(m)}
					</button>
				{/each}
			</div>
			<div class="loupe-bar-right">
				{#each actions as action (action.kind)}
					<button type="button" class="loupe-action" aria-label={action.sentence} onclick={() => (action.kind === 'undo' ? onundo() : onredo())}>
						<span aria-hidden="true">{action.kind === 'undo' ? '\u21B0' : '\u21B1'}</span>
						<span>{action.verb}</span>
					</button>
				{/each}
				<button
					type="button"
					class="loupe-syl-toggle"
					aria-expanded={syllablesOpen}
					aria-controls="loupe-panel"
					aria-label={modeLabel(mode)}
					onclick={ontogglesyllables}
				>
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
			</div>
		</div>
		</div>
		<!-- THE PANEL REGION. Always in the DOM so the card's own layout has one
		     shape; it holds the syllables in Syllables mode and the correction
		     cells in Corrections mode, and it scrolls inside the room derived
		     above rather than moving the card. -->
		<div class="loupe-panel" id="loupe-panel" style="max-height: {panelRoom}px;">
			{#if syllablesOpen}
				{#if mode === 'syllables'}
					{#if slots.length > 0}
						<LoupeSyllables id="loupe-syllables" {slots} {pairings} {selectedEventId} {isPhone} {onplace} />
					{/if}
				{:else}
					{@render corrections?.()}
				{/if}
			{/if}
		</div>
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
		/* Hung from its top since N.149; see `anchorTop` in the script. */
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
		justify-content: safe center;
		/* N.153 STAGE 3b. The strip is no longer scaled down to fit the window
		   (clause 8), so a measure whose derived spacing is wider than the room
		   scrolls sideways instead. `safe` keeps its left end reachable when it
		   overflows. The frame's `touch-action: none` is taken back for the
		   horizontal pan alone, so the vertical swipe that dismisses stays the
		   loupe's own; whether the scroll may keep a horizontal gesture on a
		   surface where a tap places a syllable is N.140's question. */
		overflow-x: auto;
		overflow-y: hidden;
		touch-action: pan-x;
		overscroll-behavior-x: contain;
		scrollbar-width: none;
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
	.loupe-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin: 0 0 6px;
	}

	/* N.149, THE PAIR. `DeskHead.svelte`'s `.pair` and `.pair-member`, copied:
	   a track in full ink, a divider at the track's weight, and the chosen
	   member drawn as a card in `--paper-cream`. The label is this bar's own
	   register (the tag's face, uppercase, as `.loupe-syl-label` was), so the
	   pill reads as this card's furniture and not as the desk's. */
	.loupe-pair {
		display: inline-flex;
		flex: none;
		border: 1px solid var(--ink-primary, #1a1612);
		border-radius: 4px;
		overflow: hidden;
	}

	.loupe-pair-member {
		border: none;
		background: transparent;
		color: var(--ink-primary, #1a1612);
		font-family: var(--font-sans, system-ui, sans-serif);
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.3rem 0.7rem;
		cursor: pointer;
	}

	.loupe-pair-member + .loupe-pair-member {
		border-left: 1px solid var(--ink-primary, #1a1612);
	}

	/* N.149 r2: the fill marks an OPEN panel and which one it is, so it is
	   gated on the mode AND the panel. A tint, so it reads as state beside the
	   lavender squircle. `aria-selected` stays on the mode alone. */
	.loupe-pair-member.chosen {
		background: var(--lavender-desk, #d5ceda);
		cursor: default;
	}

	.loupe-pair-member:not(.chosen):hover {
		background: rgba(26, 22, 18, 0.06);
	}

	.loupe-pair-member:focus-visible,
	.loupe-action:focus-visible,
	.loupe-syl-toggle:focus-visible {
		outline: 2px solid var(--ink-primary, #1a1612);
		outline-offset: 2px;
	}

	/* Flush right: Undo, Redo, then the chevron outermost, the rule every
	   station header keeps. */
	.loupe-bar-right {
		display: flex;
		align-items: center;
		margin-left: auto;
	}

	/* Undo and Redo, clickable text in the bar's own label style, which is what
	   the Score markup band's pair was (N.115 increment 3) and why they carry
	   its glyphs and its `underline` on hover. */
	.loupe-action {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4em;
		min-width: 32px;
		padding: 0.3rem 6px;
		border: none;
		background: none;
		cursor: pointer;
		font-family: var(--font-sans, system-ui, sans-serif);
		font-size: 0.6875rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-tertiary, #6a655f);
	}

	.loupe-action:hover {
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}

	.loupe-syl-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 32px;
		border: none;
		background: none;
		padding: 0.3rem 8px;
		margin: 0;
		cursor: pointer;
		font: inherit;
	}

	/* THE PANEL REGION scrolls inside the room `panelRoom` derives, and takes
	   both pans back from the frame's own `touch-action: none`: a scroll
	   container's own value governs what is inside it, and the syllables
	   strip pans sideways while the correction cells pan down. */
	.loupe-panel {
		overflow-y: auto;
		overscroll-behavior: contain;
		touch-action: pan-x pan-y;
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
		.loupe-pair-member,
		.loupe-action,
		.loupe-syl-toggle {
			min-height: 44px;
		}

		.loupe-action,
		.loupe-syl-toggle {
			min-width: 44px;
		}
	}

	@media print {
		.loupe-syl-hairline,
		.loupe-bar,
		.loupe-panel {
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

	@media print {
		.loupe {
			display: none !important;
		}
	}
</style>
