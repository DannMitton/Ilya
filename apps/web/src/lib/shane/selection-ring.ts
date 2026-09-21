/**
 * selection-ring.ts — the squircle that marks the taken note, as numbers both
 * surfaces read.
 *
 * `VoiceProfilePane.svelte` builds the ring on the page. Since N.141 step 2 the
 * loupe draws its own copy of that ring rather than showing a crop of the
 * page's, so the loupe needs the same stroke and the same reach to size its
 * crop. One source, so the two cannot drift.
 *
 * SINCE N.153 STAGE 1 THIS MODULE ALSO READS THE DOM. `ringBox` turns a taken
 * note's rendered ink into the ring's box, and it used to be inline in
 * `VoiceProfilePane.svelte`'s effect. It moved here whole, so that the loupe,
 * which will render its own held measure and so has no page ring to read, can
 * ask for the same box the page draws. The arithmetic was moved, not changed:
 * the box for every selectable event of Sunless 01 was measured before and
 * after, and is identical.
 *
 * THE PROPORTIONS were ruled by Dann 2026-08-28 from the walk on `776c267`,
 * chosen by eye against full pages: §24 of the slice 4 memo. `RING_ASPECT`, the
 * height floor of that ruling, was ruled out on 2026-09-15 for N.141, and the
 * height now follows the system's IPA baseline (`docs/memory/OPEN.md` §N.141).
 */

import { CYR_FONT_SIZE, IPA_FONT_FAMILY, IPA_FONT_SIZE, IPA_TO_CYR_BASELINE } from '@ilya/score-parser';

/** Horizontal air between the note's own ink and the ring's edge. */
export const RING_PAD_X = 4;
/** Air above the system's highest note ink, and below a note with no underlay. */
export const RING_PAD_Y = 9;
/** The narrowest the box may be, so a bare notehead is not shrink-wrapped. */
export const RING_MIN_W = 15;
export const RING_RADIUS = 6;
/** The stroke, which the stylesheet also sets: the clamps have to know it. */
export const RING_STROKE = 2;

/**
 * How far the ring can reach above the highest ink it encloses, stroke
 * included. The loupe's crop leaves at least this much above the page's ink, or
 * the ring's top is cut.
 */
export const RING_REACH = RING_PAD_Y + RING_STROKE / 2;

/** The ring's box, in the system's own user units. */
export interface RingBox {
	x: number;
	y: number;
	width: number;
	height: number;
}

/* THE RING IS DRAWN, AND IT USED TO BE AN OUTLINE. Dann's walk on `95f37aa`
   found it rendering as an open U, truncated across its top edge.

   THE CAUSE, MEASURED: a CSS `outline` boxes an element's LAYOUT box, and
   the layout box of an SVG `<text>` is the font's line box, not the glyph's
   ink. A notehead measured 88 user units tall where its ink is about ten,
   and the group's box was that text's box exactly — the tap rectangle,
   which looks like the likelier culprit, contributed nothing. That box
   began 27 units ABOVE the system's viewBox, which the renderer crops to
   the ink (`staff-renderer.ts`, and §14 of the slice 4 memo), so the SVG
   viewport clipped the top edge away and left three sides standing. It was
   never a shape drawn open, nor a clip-path: it was a box measured wrong.
   This is the fourth time `getBBox`-style layout boxes on `<text>` have
   caught this project, after the glyph cells, the insertion bar and §14's
   ink band.

   SO IT IS A DRAWN `<rect>` rather than an outline, because no layout box
   can express a glyph's ink.

   AND ITS HEIGHT COMES FROM THE STAFF, NOT FROM THE NOTE. Dann's walk on
   `44f2a1e`: the repair above closed the ring by SHRINKING it, and the
   proportion he wanted was the tall one it had before — a squircle
   elongated to span the stave. Only the clipping was ever the defect. So
   the vertical extent is the staff's own geometry, recovered from the tap
   rectangle the way `tapBand` recovers it (eleven spaces tall, the staff
   its middle four), and the notehead's measured ink decides only where the
   squircle sits across the page and how wide it is.

   IT STAYS INSIDE THE VIEWBOX BY CONSTRUCTION now, which is the part worth
   keeping. The renderer crops each system to its own ink less one space,
   and the staff IS ink, so a box on the staff can never begin above that
   crop — where the notehead's 88-unit font box always did.

   ONE EXTENSION BEYOND THE WORDING, and the reason. The ruling says the
   staff's geometry extended for the stem; taken literally, a notehead
   sitting ABOVE the top line would fall outside its own marker, and this
   document has such notes. The vertical extent is therefore the union of
   the stave, the stem, and the notehead's ink — which is the stave in the
   ordinary case and never less than it.

   IT IS STILL DISPLAY ONLY. `pointer-events: none`, so it cannot take a
   tap from the note beneath it; appended by this pane rather than emitted
   by the renderer, so `staff-renderer.ts` stays untouched and the mark is
   out of every exported artifact by construction; and it carries
   `data-note-selected`, which is what the loupe already strips from its
   clone, so the ring leaves the loupe with no change there at all. */
/* ── THE SQUIRCLE'S PROPORTIONS ──────────────────────────────────────
   Ruled by Dann 2026-08-28, from the walk on `776c267`, and chosen BY EYE
   against full pages rather than by arithmetic: the mark must be subtle
   and still catch the eye despite its muted sage. What each is, and what
   was looked at to settle it, is in §24 of the slice 4 memo.

   MEASURED FIRST, on this document at one unit to the pixel: a stave space
   is 5.5, a bare note's ink is 7 wide by 22 tall, note-to-note ink gaps run
   9.19 to 39.01 with a median of 20.99, and an accidental's ink is 3.63 to
   5.24 wide. */
/* The numbers live in `selection-ring.ts` since N.141 step 2, because the
   loupe now draws its own copy of this ring and has to read the same
   stroke and reach. `RING_ASPECT = 2.5`, the height floor of 2026-08-28,
   was ruled out by Dann 2026-09-15: height follows the system's IPA
   baseline now, not the box's width. */

/** A glyph's INK, not its font box. The distinction is the whole bug. */
function glyphInk(el: SVGTextElement): { top: number; bottom: number; left: number; right: number } | null {
	const ctx = (inkCanvas ??= document.createElement('canvas').getContext('2d'));
	if (!ctx) return null;
	const cs = getComputedStyle(el);
	ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
	const m = ctx.measureText(el.textContent ?? '');
	if (!(m.actualBoundingBoxAscent > 0 || m.actualBoundingBoxDescent > 0)) return null;
	const x = Number(el.getAttribute('x'));
	const y = Number(el.getAttribute('y'));
	if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
	/* THE ANCHOR PLACES THE ADVANCE, NOT THE INK. `text-anchor="middle"`
	   centres the string's advance width on x, and the ink sits inside that
	   advance by the string's own side bearings. This used to centre the INK
	   on x, which is only right for a string whose ink is symmetric in its
	   advance. An IPA syllable is not: its stress mark hangs left of the
	   first letter and its superscripts trail right. Found on N.141's IPA
	   increment, 2026-09-15, where m. 15's « ˈpʲe » crossed the ring's left
	   edge. Canvas measures from the start of the advance, so the start is
	   placed first and the ink read from it. */
	const anchor = el.getAttribute('text-anchor');
	const start = anchor === 'middle' ? x - m.width / 2 : anchor === 'end' ? x - m.width : x;
	return {
		top: y - m.actualBoundingBoxAscent,
		bottom: y + m.actualBoundingBoxDescent,
		left: start - m.actualBoundingBoxLeft,
		right: start + m.actualBoundingBoxRight,
	};
}
let inkCanvas: CanvasRenderingContext2D | null = null;

/** One element's box: a glyph's ink, or any other element's geometry. */
function markBox(el: Element): { top: number; bottom: number; left: number; right: number } | null {
	if (el.tagName === 'text') return glyphInk(el as SVGTextElement);
	try {
		const b = (el as SVGGraphicsElement).getBBox();
		if (b && (b.width || b.height)) return { top: b.y, bottom: b.y + b.height, left: b.x, right: b.x + b.width };
	} catch {
		/* not rendered */
	}
	return null;
}

/**
 * A note's OWN ink: its group's marks and everything bound to it by
 * `data-of-event` (the accidental, its brackets, the augmentation dot).
 * The width is the glyphs' alone, as ruled 2026-08-28: the stem only ever
 * reaches up or down. N.141 leaves the analysis layer out: the turning
 * notehead and its marks are not the note's notation, and Dann ruled
 * 2026-09-14 that the ring encloses the notehead, its accidental, its dot
 * and its own stem.
 */
function eventInk(
	scope: Element,
	group: Element,
	id: string,
): { top: number; bottom: number; left: number; right: number } | null {
	let top = Infinity;
	let bottom = -Infinity;
	let left = Infinity;
	let right = -Infinity;
	const parts = [
		...[...group.children].filter((c) => !c.hasAttribute('data-hit') && !c.hasAttribute('data-analysis')),
		...(id ? [...scope.querySelectorAll(`[data-of-event="${CSS.escape(id)}"]`)] : []),
	];
	for (const el of parts) {
		const box = markBox(el);
		if (!box) continue;
		top = Math.min(top, box.top);
		bottom = Math.max(bottom, box.bottom);
		if (el.tagName === 'text' || el.hasAttribute('data-of-event')) {
			left = Math.min(left, box.left);
			right = Math.max(right, box.right);
		}
	}
	return Number.isFinite(top) ? { top, bottom, left, right } : null;
}

/**
 * The system's IPA baseline, as drawn. Read off the IPA row where the
 * system prints one, or off the Cyrillic row `IPA_TO_CYR_BASELINE` below
 * it where every note on the system is a melisma or unplaced. Null where
 * the system has no underlay at all.
 */
function ipaBaselineOf(sys: Element): number | null {
	let ipa = -Infinity;
	let cyr = -Infinity;
	for (const t of sys.querySelectorAll('text')) {
		/* A measure number (N.126) shares the Cyrillic row's size by ruling,
		   so it has to be named out or it reads as that row. */
		if (t.hasAttribute('data-analysis') || t.hasAttribute('data-bar-number')) continue;
		const y = Number(t.getAttribute('y'));
		if (!Number.isFinite(y)) continue;
		if ((t.getAttribute('font-family') ?? '').includes('Lato IPA')) ipa = Math.max(ipa, y);
		else if (Number(t.getAttribute('font-size')) === CYR_FONT_SIZE) cyr = Math.max(cyr, y);
	}
	if (Number.isFinite(ipa)) return ipa;
	return Number.isFinite(cyr) ? cyr - IPA_TO_CYR_BASELINE : null;
}

/**
 * The IPA FACE's descent at the row's size: how far below its baseline the
 * face declares its ink may go. A property of the font, known before any
 * syllable is drawn, so it is the same for every note on every system,
 * ruled by Dann 2026-09-15. Chrome returns it as a whole number, so it
 * carries about half a unit of rounding. Zero where the canvas cannot say.
 */
function ipaFaceDescent(): number {
	const ctx = (inkCanvas ??= document.createElement('canvas').getContext('2d'));
	if (!ctx) return 0;
	ctx.font = `${IPA_FONT_SIZE}px ${IPA_FONT_FAMILY}`;
	const d = ctx.measureText('a').fontBoundingBoxDescent;
	return Number.isFinite(d) && d > 0 ? d : 0;
}

/**
 * The box of the ring for the taken note `id`, or null wherever the page has
 * drawn none: a tap rectangle with no stave height, a group outside any
 * `[data-system]`, or a note with no ink to measure.
 *
 * `hit` is the note's `[data-hit]` rectangle and `group` the `[data-event-id]`
 * group that holds it. The system is found from the group, so the caller
 * passes only the elements it already has.
 */
export function ringBox(hit: Element, group: Element, id: string): RingBox | null {
	/* THE STAVE, off the tap rectangle. The renderer builds each one from
	   `staffTop - 3.5 * lineGap` to `staffBottom + 3.5 * lineGap` around a
	   staff of four gaps, so the rectangle is eleven gaps tall and one gap
	   is an eleventh of it — the same recovery `loupe.ts` makes. */
	const hitY = Number(hit.getAttribute('y'));
	const hitH = Number(hit.getAttribute('height'));
	if (!(hitH > 0) || !Number.isFinite(hitY)) return null;
	const gap = hitH / 11;
	const staffTop = hitY + 3.5 * gap;
	const staffBottom = staffTop + 4 * gap;

	const sysEl = group.closest('[data-system]');
	if (!sysEl) return null;

	/* ── THE SQUIRCLE'S GRAMMAR, N.141 STEP 1 ───────────────────────────
	   Ruled by Dann 2026-09-14 and 2026-09-15, in `docs/memory/OPEN.md`
	   §N.141. The WIDTH still follows the taken note's own ink, notehead,
	   accidental and dot. The HEIGHT does not follow the width: the bottom
	   is the IPA baseline, shared by every ring on a system, and the top is
	   a floor of one stave space above the stave, higher for a note whose
	   own ink reaches higher (Dann, 2026-09-20; the top is set below).
	   `RING_ASPECT` is gone, by his ruling of 2026-09-15: "the new grammar
	   wins and `RING_ASPECT` stops being a height floor". The portrait feel
	   survives as `RING_MIN_W`. */
	const own = eventInk(sysEl, group, id);
	if (!own || !Number.isFinite(own.left) || !Number.isFinite(own.right)) return null;

	/* THE WIDTH HOLDS THE NOTE AND ITS IPA SYLLABLE. Found by Dann on the walk
	   of `debdf02`, 2026-09-15, three times on Without Sun song 1: « ɲɪ » on
	   m. 4's right edge, « ʃʲːɪm » through m. 8's, and the stress mark of
	   « ˈpʲe » across m. 15's LEFT edge. His words: *"We need to ask Ilya to
	   consider the IPA when it builds squircles, not just the musical
	   notation."* His grammar of 2026-09-14 captures the note AND its vowel,
	   and the height was built to it while the width was not.

	   So the box spans both extents, each with the same clearance: the
	   notation's ink, and the syllable's RENDERED ink, stress mark and
	   superscripts included, found by the renderer's `data-ipa-of` handle.
	   A withheld syllable's sigla stands in the same slot and is held the
	   same way (DESK DEFAULT). A note with no syllable, a melisma's
	   continuation or an unplaced note, keeps the notation's width alone.

	   THE CYRILLIC IS NOT READ HERE. It is outside the box, ruled twice.

	   ON THE PAGE a wider box may reach its neighbours, accepted by Dann
	   2026-09-14. A minimum keeps a bare notehead from being shrink-wrapped. */
	let left = own.left;
	let right = own.right;
	for (const el of sysEl.querySelectorAll(
		`[data-ipa-of="${CSS.escape(id)}"], [data-withheld="${CSS.escape(id)}"]`,
	)) {
		const box = markBox(el);
		if (!box) continue;
		left = Math.min(left, box.left);
		right = Math.max(right, box.right);
	}
	const width = Math.max(RING_MIN_W, right - left + RING_PAD_X * 2);
	const centreX = (left + right) / 2;

	/* THE TOP: ONE STAVE SPACE ABOVE THE STAVE, AND HIGHER FOR A NOTE THAT
	   REACHES HIGHER. Ruled by Dann 2026-09-20, amending his rulings of
	   2026-09-14 and 2026-09-15 (`docs/memory/OPEN.md` §N.141): *"the minumum
	   default should capture the distance between the IPA baseline and maybe
	   one space above the stave? And notes that require more height (such as
	   those above the staff on ledger lines) will get that extra height but
	   the bottom of the squircle will always line up with its siblings."*

	   The floor IS the top, with no `RING_PAD_Y` on the vertical: the edge sits
	   one space above the stave, and a note whose own ink stands higher (notehead,
	   accidental, dot or its own stem, from `eventInk`) gets the same space above
	   that ink. It grows upward only. y grows downward, so `Math.min` takes
	   whichever is higher on the page.

	   EVERY INPUT BELONGS TO THE TAKEN NOTE OR TO THE STAVE. The system's other
	   notes are not read, which is why the page, whose `sysEl` is a system, and
	   the loupe, whose `sysEl` is one measure, give the same box for the same
	   note with nothing passed between them. A beam is not a note's own ink in
	   this sense and may be bisected, ruled 2026-09-14, so beams are not read
	   (`eventInk` reads a group's marks and what is tagged `data-of-event`). */
	const highest = Math.min(staffTop, own.top);
	let top = highest - gap;

	/* THE BOTTOM ENCLOSES THE IPA ROW'S FULL INK, descenders included, and
	   stops short of the Cyrillic row. RULED BY DANN 2026-09-15, overruling
	   the desk's midpoint: *"The musical notation is effectively the pitch,
	   and the IPA is the vowel. I want both captured to the exclusion of the
	   original Cyrillic."* So the stroke's INNER edge sits on the IPA face's
	   descent below the IPA baseline: the face's metric, not the glyphs on
	   the system, so a syllable without a descender, and a melisma with no
	   syllable at all, get the same box as one carrying ɲ (his ruling of
	   2026-09-14: "as if there were a verbatim vowel printed there"). Every
	   box on a system shares this edge, and Dann's amendment of 2026-09-20
	   keeps it: the bottom always lines up with its siblings.

	   THE CYRILLIC IS OUTSIDE BY CONSTRUCTION, not by a clamp here: the
	   renderer sets the Cyrillic baseline `IPA_TO_CYR_BASELINE` below the
	   IPA baseline, and that constant was widened for exactly this box.

	   A system with no underlay at all keeps the note's own bottom, padded. */
	const ipaBaseline = ipaBaselineOf(sysEl);
	let bottom =
		ipaBaseline !== null
			? ipaBaseline + ipaFaceDescent() + RING_STROKE / 2
			: Math.max(own.bottom, staffBottom) + RING_PAD_Y;

	/* NEVER TRUNCATED. Kept, and it must not silently change a height: the
	   renderer leaves one stave-space of headroom above a system's highest ink,
	   and the top is held inside the viewBox with its stroke, moving down
	   rather than the box being cut. It cannot pass the note's own highest
	   ink, which is inside the viewBox to begin with. */
	const vb = (sysEl.getAttribute('viewBox') ?? '').split(/\s+/).map(Number);
	if (vb.length === 4 && Number.isFinite(vb[1]) && Number.isFinite(vb[3])) {
		const bleed = RING_STROKE / 2;
		top = Math.min(Math.max(top, vb[1] + bleed), highest);
		bottom = Math.min(bottom, vb[1] + vb[3] - bleed);
	}
	const y = top;
	const height = bottom - top;
	return { x: centreX - width / 2, y, width, height };
}
