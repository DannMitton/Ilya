/**
 * Row 164, where the card stands: the desk's drag and the phone's top and
 * bottom. A desk drag moves the card by pressing its header and moving the
 * pointer; a phone's tap on the header flips it between the top of the screen
 * and the bottom (`loupe-edge.ts` says how). The place holds while the loupe
 * is open and goes when it closes, because `Loupe` is destroyed on close
 * (`+page.svelte`, the `{#if loupeAvailable && loupeOpen && cursor}` around
 * it) and this object with it.
 *
 * The drag's offset is added to where the loupe seats the card (`frame.left`
 * and `anchorTop` in `Loupe.svelte`), never written over them, so the seat
 * can still follow a measure's width. It is held by `clampDrag` (`loupe.ts`)
 * on every move and again on every read of `shift`, which is what pulls the
 * card back when the window shrinks or the drawer opens. The header (the
 * handle) reports the window's size, its own height, and whether it drags.
 *
 * Pointer capture on the header carries the drag outside it. A press that
 * starts on one of the header's buttons never begins a drag, and nothing here
 * answers a key: the buttons stay the keyboard's way in.
 */
import { clampDrag, type DragOffset } from '$lib/score/loupe';
import { cardTop, isTap, nextEdge, panelRoom, type LoupeEdge } from '$lib/score/loupe-edge';

/** Where the loupe seats the card, which the drag's offset is added to; `height` is the fixed part's. */
export interface Seat {
	left: number;
	top: number;
	width: number;
	height: number;
}

export class LoupePlace {
	x = $state(0);
	y = $state(0);
	active = $state(false);
	edge = $state<LoupeEdge>('seat');
	/** The desk drags; a phone's header is a button. Set by the header. */
	draggable = $state(false);
	viewWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 0);
	viewHeight = $state(typeof window !== 'undefined' ? window.innerHeight : 0);
	headerHeight = $state(40);
	private from: { px: number; py: number; x: number; y: number } | null = null;
	private down = { px: 0, py: 0 };
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
		const { height: _height, ...home } = this.seat();
		return clampDrag(offset, { ...home, headerHeight: this.headerHeight }, view, this.inset(), this.gutter);
	}

	/** The offset as it stands now, held against the present window and drawer. */
	get shift(): DragOffset {
		return this.clamp({ x: this.x, y: this.y });
	}

	/** Where a tap on the header would send the card. */
	get moveTo(): 'top' | 'bottom' {
		const s = this.seat();
		return nextEdge(this.edge, s.top + s.height / 2, this.viewHeight);
	}

	/** The card's vertical pin as CSS: its bottom edge `foot` above the foot at the bottom, else its top. */
	pin(seatTop: number, foot: number): string {
		if (this.edge === 'bottom') return `bottom: ${foot}px;`;
		return `top: ${cardTop(this.edge, seatTop, this.shift.y, this.gutter)}px;`;
	}

	/** What is left of the screen for Syllables or Corrections after the fixed part. */
	room(foot: number): number {
		const s = this.seat();
		return panelRoom(this.edge, this.viewHeight, foot, this.gutter, s.height, s.top, this.shift.y);
	}

	start(e: PointerEvent): void {
		this.down = { px: e.clientX, py: e.clientY };
		if (!this.draggable || e.button !== 0 || (e.target as Element | null)?.closest?.('button')) return;
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

	/** A tap on a phone's header. A finger that moved was a swipe and flips nothing; a key (`detail` 0) has no finger. */
	flip(e: MouseEvent): void {
		if (e.detail === 0 || isTap(e.clientX - this.down.px, e.clientY - this.down.py)) this.edge = this.moveTo;
	}
}
