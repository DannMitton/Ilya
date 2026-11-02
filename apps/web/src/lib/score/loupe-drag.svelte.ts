/**
 * Row 164, the desk's drag. Pressing the Loupe's header and moving the
 * pointer moves the card; the position holds while the loupe is open and goes
 * when it closes, because `Loupe` is destroyed on close (`+page.svelte`, the
 * `{#if loupeAvailable && loupeOpen && cursor}` around it) and this object
 * with it.
 *
 * The offset is added to where the loupe seats the card (`frame.left` and
 * `anchorTop` in `Loupe.svelte`), never written over them, so the seat
 * can still follow a measure's width. It is held by `clampDrag` (`loupe.ts`)
 * on every move and again on every read of `shift`, which is what pulls the
 * card back when the window shrinks or the drawer opens. The header (the
 * handle) reports the window's size and its own height here.
 *
 * Pointer capture on the header carries the drag outside it. A press that
 * starts on one of the header's buttons never begins a drag, and nothing here
 * answers a key: the buttons stay the keyboard's way in.
 */
import { clampDrag, type DragOffset } from '$lib/score/loupe';

/** Where the loupe seats the card, which the drag's offset is added to. */
export interface Seat {
	left: number;
	top: number;
	width: number;
}

export class LoupeDrag {
	x = $state(0);
	y = $state(0);
	active = $state(false);
	viewWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 0);
	viewHeight = $state(typeof window !== 'undefined' ? window.innerHeight : 0);
	headerHeight = $state(40);
	private from: { px: number; py: number; x: number; y: number } | null = null;
	private readonly seat: () => Seat;
	private readonly inset: () => number;
	private readonly gutter: number;

	constructor(seat: () => Seat, inset: () => number, gutter: number) {
		this.seat = seat;
		this.inset = inset;
		this.gutter = gutter;
	}

	private clamp(offset: DragOffset): DragOffset {
		const view = { width: this.viewWidth, height: this.viewHeight };
		return clampDrag(offset, { ...this.seat(), headerHeight: this.headerHeight }, view, this.inset(), this.gutter);
	}

	/** The offset as it stands now, held against the present window and drawer. */
	get shift(): DragOffset {
		return this.clamp({ x: this.x, y: this.y });
	}

	start(e: PointerEvent): void {
		if (e.button !== 0 || (e.target as Element | null)?.closest?.('button')) return;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		const at = this.shift;
		this.from = { px: e.clientX, py: e.clientY, x: at.x, y: at.y };
		this.active = true;
		e.preventDefault();
	}

	move(e: PointerEvent): void {
		const f = this.from;
		if (!f) return;
		const next = this.clamp({ x: f.x + e.clientX - f.px, y: f.y + e.clientY - f.py });
		this.x = next.x;
		this.y = next.y;
	}

	end(): void {
		this.from = null;
		this.active = false;
	}
}
