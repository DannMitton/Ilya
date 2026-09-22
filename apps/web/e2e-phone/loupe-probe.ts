/**
 * N.153 STAGE 5. WHAT THE LOUPE DREW, READ OFF THE MOUNTED DOM, in client CSS
 * pixels. Serialized into the page by `page.evaluate`, so it is one
 * self-contained function: nothing it calls may live outside its own body.
 *
 * IT MEASURES AND NEVER WRITES. No attribute, style or scroll is touched here;
 * the spec does the scrolling it needs before it calls this.
 *
 * Every coordinate goes through `getScreenCTM`, so a panel's viewBox, the
 * loupe's own scale and the window's horizontal scroll are all accounted for
 * the way the browser itself paints them.
 */

export interface Span {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

export interface ProbeCaret {
	/** The gap's own `after`: '' is the head gap of the first measure. */
	after: string;
	/** The hit rectangle's centre, which is what `nearestTarget` compares. */
	cx: number;
	cy: number;
	/** The drawn mark: stem and both arrowheads. */
	ink: Span;
}

export interface ProbeEntry {
	id: string;
	cx: number;
	cy: number;
	/** The entry's own ink, by the position rule's definition; null where none was found. */
	ink: { left: number; right: number } | null;
	isRest: boolean;
}

export interface ProbeBarline {
	panel: string;
	left: number;
	right: number;
	cx: number;
	visible: boolean;
}

export interface ProbeContact {
	after: string;
	/** 'beam' is clause 15's exception and is reported apart; everything else is a touch. */
	kind: 'beam' | 'ink' | 'squircle' | 'caret';
	what: string;
	owner: string | null;
	markup: string;
}

export interface ProbeForeign {
	panel: string;
	attr: string;
	id: string;
}

export interface Probe {
	/** Text is tested by its canvas-measured ink; this says whether that measure held. */
	textCheck: { measured: number; unmeasured: number; outsideBox: string[] };
	tag: string | null;
	heldMeasure: number | null;
	readout: string | null;
	lineGapPx: number;
	staffTopPx: number;
	staffBottomPx: number;
	body: { left: number; right: number };
	ring: { left: number; right: number; top: number; bottom: number } | null;
	carets: ProbeCaret[];
	entries: ProbeEntry[];
	barlines: ProbeBarline[];
	foreign: ProbeForeign[];
	contacts: ProbeContact[];
	window: { left: number; right: number; scrollLeft: number; scrollWidth: number };
}

export function probeLoupe(): Probe | null {
	const bodySvg = document.querySelector('.loupe .loupe-body') as SVGSVGElement | null;
	const win = document.querySelector('.loupe .loupe-window') as HTMLElement | null;
	if (!bodySvg || !win) return null;

	const pt = (el: SVGGraphicsElement, x: number, y: number) => {
		const m = el.getScreenCTM();
		if (!m) return { x: NaN, y: NaN };
		const p = new DOMPoint(x, y).matrixTransform(m);
		return { x: p.x, y: p.y };
	};
	const strokeOf = (el: Element): number => {
		const s = el.getAttribute('stroke');
		if (!s || s === 'none' || s === 'transparent') return 0;
		return Number(el.getAttribute('stroke-width') ?? '1') || 1;
	};
	/** The element's painted box in client pixels, its stroke included. */
	const boxOf = (el: SVGGraphicsElement): Span | null => {
		let b: DOMRect;
		try {
			b = el.getBBox();
		} catch {
			return null;
		}
		const half = strokeOf(el) / 2;
		const corners = [
			pt(el, b.x - half, b.y - half),
			pt(el, b.x + b.width + half, b.y - half),
			pt(el, b.x - half, b.y + b.height + half),
			pt(el, b.x + b.width + half, b.y + b.height + half),
		];
		const xs = corners.map((c) => c.x);
		const ys = corners.map((c) => c.y);
		if (xs.some((v) => !Number.isFinite(v))) return null;
		return { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) };
	};
	const overlaps = (a: Span, b: Span) => a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom;
	const intersect = (a: Span, b: Span): Span | null => {
		const s = {
			left: Math.max(a.left, b.left),
			right: Math.min(a.right, b.right),
			top: Math.max(a.top, b.top),
			bottom: Math.min(a.bottom, b.bottom),
		};
		return s.left < s.right && s.top < s.bottom ? s : null;
	};
	const rectSpan = (r: DOMRect): Span => ({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });

	const tag = document.querySelector('.loupe .loupe-tag')?.textContent?.trim() ?? null;
	const tagMatch = tag ? /m\.\s*(\d+)/.exec(tag) : null;
	const heldMeasure = tagMatch ? Number(tagMatch[1]) - 1 : null;
	const readout = document.querySelector('.readout')?.textContent?.trim() ?? null;

	/* THE STAVE: the body's own unclipped backdrop, five lines at the stave's y. */
	const clipped = bodySvg.querySelector(':scope > g[clip-path]') as SVGGElement | null;
	const backdrop = [...bodySvg.querySelectorAll(':scope > g')].find((g) => !g.hasAttribute('clip-path') && !g.hasAttribute('data-loupe-carets'));
	const staveYs = backdrop
		? [...backdrop.querySelectorAll('line')].map((l) => Number(l.getAttribute('y1'))).sort((a, b) => a - b)
		: [];
	const lineGapUnits = staveYs.length >= 2 ? (staveYs[staveYs.length - 1] - staveYs[0]) / (staveYs.length - 1) : NaN;
	const staffTopUnits = staveYs[0];
	const staffBottomUnits = staveYs[staveYs.length - 1];
	const topPx = pt(bodySvg, 0, staffTopUnits).y;
	const bottomPx = pt(bodySvg, 0, staffBottomUnits).y;
	const lineGapPx = (bottomPx - topPx) / 4;

	const bodyRect = rectSpan(bodySvg.getBoundingClientRect());
	/* THE CLIP, in the body's user space (clipPathUnits default). */
	const clipRect = bodySvg.querySelector('clipPath rect');
	let clipSpan: Span | null = null;
	if (clipRect) {
		const x = Number(clipRect.getAttribute('x'));
		const y = Number(clipRect.getAttribute('y'));
		const w = Number(clipRect.getAttribute('width'));
		const h = Number(clipRect.getAttribute('height'));
		const a = pt(bodySvg, x, y);
		const b = pt(bodySvg, x + w, y + h);
		clipSpan = { left: Math.min(a.x, b.x), right: Math.max(a.x, b.x), top: Math.min(a.y, b.y), bottom: Math.max(a.y, b.y) };
	}
	const bodyVisible = clipSpan ? intersect(clipSpan, bodyRect) : bodyRect;

	/* THE SQUIRCLE, its outer stroke edges. */
	const ringEl = document.querySelector('.loupe .loupe-ring rect') as SVGRectElement | null;
	let ring: Probe['ring'] = null;
	if (ringEl) {
		const x = Number(ringEl.getAttribute('x'));
		const y = Number(ringEl.getAttribute('y'));
		const w = Number(ringEl.getAttribute('width'));
		const h = Number(ringEl.getAttribute('height'));
		const s = Number(ringEl.getAttribute('stroke-width') ?? '0') / 2;
		const a = pt(ringEl, x - s, y - s);
		const b = pt(ringEl, x + w + s, y + h + s);
		ring = { left: Math.min(a.x, b.x), right: Math.max(a.x, b.x), top: Math.min(a.y, b.y), bottom: Math.max(a.y, b.y) };
	}

	/* THE ENTRIES, and each one's ink by the position rule's own definition. */
	const entries: ProbeEntry[] = [];
	for (const hit of bodySvg.querySelectorAll('[data-loupe-hit]')) {
		const id = hit.getAttribute('data-loupe-hit') ?? '';
		const r = hit.getBoundingClientRect();
		let left = Infinity;
		let right = -Infinity;
		const widen = (el: Element) => {
			const b = boxOf(el as SVGGraphicsElement);
			if (b && b.right - b.left + (b.bottom - b.top) > 0) {
				left = Math.min(left, b.left);
				right = Math.max(right, b.right);
			}
		};
		const group = bodySvg.querySelector(`[data-event-id="${CSS.escape(id)}"]`);
		if (group) for (const c of group.children) if (!c.hasAttribute('data-loupe-hit')) widen(c);
		for (const c of bodySvg.querySelectorAll(`[data-of-event="${CSS.escape(id)}"]`)) widen(c);
		const isRest = !group;
		if (!Number.isFinite(left) && hit.nextElementSibling) widen(hit.nextElementSibling);
		entries.push({
			id,
			cx: r.left + r.width / 2,
			cy: r.top + r.height / 2,
			ink: Number.isFinite(left) ? { left, right } : null,
			isRest,
		});
	}
	entries.sort((a, b) => a.cx - b.cx);

	/* THE CARETS: each hit rectangle, then its three drawn marks in order. */
	const caretsG = bodySvg.querySelector('[data-loupe-carets]');
	const carets: ProbeCaret[] = [];
	const caretMarks: SVGGraphicsElement[][] = [];
	if (caretsG) {
		const rects = [...caretsG.querySelectorAll('[data-loupe-gap]')];
		const marks = [...caretsG.querySelectorAll(':scope > g > *')] as SVGGraphicsElement[];
		rects.forEach((rect, i) => {
			const r = rect.getBoundingClientRect();
			const own = marks.slice(i * 3, i * 3 + 3);
			caretMarks.push(own);
			const spans = own.map(boxOf).filter((s): s is Span => !!s);
			carets.push({
				after: rect.getAttribute('data-loupe-gap') ?? '',
				cx: r.left + r.width / 2,
				cy: r.top + r.height / 2,
				ink: {
					left: Math.min(...spans.map((s) => s.left)),
					right: Math.max(...spans.map((s) => s.right)),
					top: Math.min(...spans.map((s) => s.top)),
					bottom: Math.max(...spans.map((s) => s.bottom)),
				},
			});
		});
	}

	/* THE PANELS, and what each one lets be seen. */
	const panels = [...document.querySelectorAll('.loupe .loupe-strip > svg')].filter(
		(s) => !s.classList.contains('loupe-ring'),
	) as SVGSVGElement[];
	const panelName = (s: SVGSVGElement) =>
		[...s.classList].find((c) => c.startsWith('loupe-') && c !== 'loupe-svg')?.slice('loupe-'.length) ?? 'svg';
	const visibleArea = (s: SVGSVGElement, el: Element): Span | null => {
		const r = rectSpan(s.getBoundingClientRect());
		if (s === bodySvg) {
			/* Inside the body, only the clipped clone is cut by the clip. */
			return clipped && clipped.contains(el) ? bodyVisible : r;
		}
		return r;
	};

	/* BARLINES: `staffVerticals`' own test, on every panel. */
	const barlines: ProbeBarline[] = [];
	const tol = lineGapUnits * 0.3;
	for (const s of panels) {
		for (const l of s.querySelectorAll('line')) {
			if (l.closest('[data-event-id]') || l.closest('[data-analysis]') || l.closest('[data-loupe-carets]')) continue;
			const x1 = Number(l.getAttribute('x1'));
			if (Math.abs(x1 - Number(l.getAttribute('x2'))) > 0.01) continue;
			const y1 = Number(l.getAttribute('y1'));
			const y2 = Number(l.getAttribute('y2'));
			if (Math.abs(Math.min(y1, y2) - staffTopUnits) > tol) continue;
			if (Math.abs(Math.max(y1, y2) - staffBottomUnits) > tol) continue;
			const b = boxOf(l);
			if (!b) continue;
			const area = visibleArea(s, l);
			barlines.push({
				panel: panelName(s),
				left: b.left,
				right: b.right,
				cx: (b.left + b.right) / 2,
				visible: !!area && !!intersect(b, area),
			});
		}
	}

	/* MARKS OF ANOTHER MEASURE, visible anywhere on the strip. */
	const foreign: ProbeForeign[] = [];
	if (heldMeasure !== null) {
		for (const s of panels) {
			for (const attr of ['data-event-id', 'data-of-event', 'data-loupe-hit']) {
				for (const el of s.querySelectorAll(`[${attr}]`)) {
					const id = el.getAttribute(attr) ?? '';
					const m = /^m(\d+)-/.exec(id);
					if (!m || Number(m[1]) === heldMeasure) continue;
					const b = boxOf(el as SVGGraphicsElement);
					const area = visibleArea(s, el);
					if (b && area && intersect(b, area)) foreign.push({ panel: panelName(s), attr, id });
				}
			}
		}
	}

	/* CONTACTS. Sample the caret's own painted points, then ask each nearby
	   painted element whether it paints the same point. */
	const contacts: ProbeContact[] = [];
	const PAINTERS = 'line, path, rect, circle, ellipse, polygon, polyline, text, use';
	const inkEls = clipped
		? ([...clipped.querySelectorAll(PAINTERS)] as SVGGraphicsElement[]).filter((el) => {
				if (el.hasAttribute('data-loupe-hit')) return false;
				const fill = el.getAttribute('fill');
				const painted = strokeOf(el) > 0 || el.tagName === 'text' || (fill !== 'none' && fill !== 'transparent');
				if (!painted) return false;
				/* THE STAVE ITSELF: a horizontal line on a stave line's own y. */
				if (el.tagName === 'line') {
					const ly1 = Number(el.getAttribute('y1'));
					const ly2 = Number(el.getAttribute('y2'));
					const lx1 = Number(el.getAttribute('x1'));
					const lx2 = Number(el.getAttribute('x2'));
					if (Math.abs(ly1 - ly2) < 0.01 && Math.abs(lx2 - lx1) > lineGapUnits * 5 && staveYs.some((y) => Math.abs(y - ly1) < 0.05))
						return false;
				}
				return true;
			})
		: [];
	const inkBoxes = inkEls.map(boxOf);
	const describe = (el: SVGGraphicsElement): string => {
		if (el.hasAttribute('data-beam-level')) return 'beam';
		const owner = el.closest('[data-event-id]');
		if (el.tagName === 'line') {
			const vertical = Math.abs(Number(el.getAttribute('x1')) - Number(el.getAttribute('x2'))) < 0.01;
			if (vertical) return owner ? 'stem' : 'vertical line';
			return 'horizontal line (ledger or bracket)';
		}
		if (el.tagName === 'text') return el.hasAttribute('data-of-event') ? 'glyph (accidental or dot)' : 'glyph';
		if (el.tagName === 'path') return el.getAttribute('fill') === 'none' ? 'curve (tie or slur)' : 'filled path';
		return el.tagName;
	};
	/* A TEXT ELEMENT'S INK, NOT ITS EM BOX. `getBBox` answers the advance and
	   the font's whole ascent and descent, which reaches well past a digit's
	   own strokes: MEASURED 2026-09-21, m. 16's tuplet "2" has its ink end at
	   its baseline, 1.2 px above the caret's arrowhead, while its em box
	   reached 2.8 px into it. The glyph's own bounds come from the canvas, in
	   the element's own face, at 100 px and scaled back to its font size, in
	   its local units. A glyph's box is still a box: a caret between a glyph's
	   strokes but inside its bounds is counted as touching. */
	const inkCache = new Map<Element, Span | null>();
	const measureCtx = document.createElement('canvas').getContext('2d');
	const textInk = (t: SVGTextElement): Span | null => {
		if (inkCache.has(t)) return inkCache.get(t)!;
		let ink: Span | null = null;
		const text = t.textContent ?? '';
		const size = parseFloat(t.getAttribute('font-size') ?? getComputedStyle(t).fontSize);
		if (measureCtx && text && size > 0) {
			const cs = getComputedStyle(t);
			const REF = 100;
			measureCtx.font = `${cs.fontStyle} ${cs.fontWeight} ${REF}px ${cs.fontFamily}`;
			const anchor = t.getAttribute('text-anchor') ?? cs.textAnchor;
			measureCtx.textAlign = anchor === 'middle' ? 'center' : anchor === 'end' ? 'right' : 'left';
			measureCtx.textBaseline = 'alphabetic';
			const m = measureCtx.measureText(text);
			const k = size / REF;
			const x = Number(t.getAttribute('x') ?? '0');
			const y = Number(t.getAttribute('y') ?? '0');
			ink = {
				left: x - m.actualBoundingBoxLeft * k,
				right: x + m.actualBoundingBoxRight * k,
				top: y - m.actualBoundingBoxAscent * k,
				bottom: y + m.actualBoundingBoxDescent * k,
			};
		}
		inkCache.set(t, ink);
		return ink;
	};
	const paintsAt = (el: SVGGraphicsElement, x: number, y: number): boolean => {
		const m = el.getScreenCTM();
		if (!m) return false;
		const p = new DOMPoint(x, y).matrixTransform(m.inverse());
		if (el instanceof SVGGeometryElement) {
			const fill = el.getAttribute('fill');
			const fillPainted = fill !== 'none' && fill !== 'transparent' && el.tagName !== 'line';
			if (fillPainted && el.isPointInFill(p)) return true;
			if (strokeOf(el) > 0 && el.isPointInStroke(p)) return true;
			return false;
		}
		if (el.tagName === 'text') {
			const ink = textInk(el as SVGTextElement);
			return !!ink && p.x >= ink.left && p.x <= ink.right && p.y >= ink.top && p.y <= ink.bottom;
		}
		let b: DOMRect;
		try {
			b = el.getBBox();
		} catch {
			return false;
		}
		return p.x >= b.x && p.x <= b.x + b.width && p.y >= b.y && p.y <= b.y + b.height;
	};
	const STEP = 0.25;
	carets.forEach((c, i) => {
		const own = caretMarks[i];
		const samples: { x: number; y: number }[] = [];
		for (let y = c.ink.top; y <= c.ink.bottom; y += STEP) {
			for (let x = c.ink.left; x <= c.ink.right; x += STEP) {
				if (own.some((el) => paintsAt(el, x, y))) samples.push({ x, y });
			}
		}
		const seen = new Set<Element>();
		inkEls.forEach((el, k) => {
			const b = inkBoxes[k];
			if (!b || !overlaps(b, c.ink) || seen.has(el)) return;
			const hitPoint = samples.find(
				(s) => (!bodyVisible || (s.x >= bodyVisible.left && s.x <= bodyVisible.right && s.y >= bodyVisible.top && s.y <= bodyVisible.bottom)) && paintsAt(el, s.x, s.y),
			);
			if (!hitPoint) return;
			seen.add(el);
			const what = describe(el);
			const ownerEl = el.closest('[data-event-id]') ?? (el.hasAttribute('data-of-event') ? el : null);
			contacts.push({
				after: c.after,
				kind: what === 'beam' ? 'beam' : 'ink',
				what,
				owner: ownerEl?.getAttribute('data-event-id') ?? ownerEl?.getAttribute('data-of-event') ?? null,
				markup: el.outerHTML.slice(0, 140),
			});
		});
		if (ringEl && ring && overlaps(ring, c.ink) && samples.some((s) => paintsAt(ringEl, s.x, s.y))) {
			contacts.push({ after: c.after, kind: 'squircle', what: 'squircle stroke', owner: null, markup: '' });
		}
		carets.forEach((o, j) => {
			if (j > i && overlaps(o.ink, c.ink)) {
				contacts.push({ after: c.after, kind: 'caret', what: `caret after ${o.after || 'head'}`, owner: null, markup: '' });
			}
		});
	});

	/* THE TEXT INK'S OWN CHECK: a glyph's ink must lie inside its em box, or
	   the canvas measured a different face from the one painted. */
	const textCheck = { measured: 0, unmeasured: 0, outsideBox: [] as string[] };
	for (const el of inkEls) {
		if (el.tagName !== 'text') continue;
		const ink = textInk(el as SVGTextElement);
		let b: DOMRect | null = null;
		try {
			b = el.getBBox();
		} catch {
			/* not rendered */
		}
		if (!ink || !b || !(ink.right > ink.left)) {
			textCheck.unmeasured++;
			continue;
		}
		textCheck.measured++;
		const slack = 0.5;
		if (ink.left < b.x - slack || ink.right > b.x + b.width + slack || ink.top < b.y - slack || ink.bottom > b.y + b.height + slack)
			textCheck.outsideBox.push(el.outerHTML.slice(0, 100));
	}

	const w = win.getBoundingClientRect();
	return {
		textCheck,
		tag,
		heldMeasure,
		readout,
		lineGapPx,
		staffTopPx: topPx,
		staffBottomPx: bottomPx,
		body: { left: bodyRect.left, right: bodyRect.right },
		ring,
		carets,
		entries,
		barlines,
		foreign,
		contacts,
		window: { left: w.left, right: w.right, scrollLeft: win.scrollLeft, scrollWidth: win.scrollWidth },
	};
}
