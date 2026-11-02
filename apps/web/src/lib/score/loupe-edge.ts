/**
 * Row 164, the phone's top and bottom. A tap on the Loupe's header flips the
 * card between the top of the screen and the bottom; the downward swipe still
 * closes it. Pure, so the arithmetic is tested with no DOM (`loupe-edge.test.ts`).
 *
 * THREE PLACES, not two. `seat` is where the loupe has always put the card,
 * centred on the page's visible stage (`centreOnPage`, `loupe.ts`), and it is
 * where a phone's Loupe opens: the centring is what keeps the bar the singer
 * is looking at clear. `top` pins the card at the gutter; `bottom` pins its
 * bottom edge `foot` above the screen's foot. The first tap goes to the edge
 * farther from the seat; after that a tap flips between the two edges.
 *
 * AT THE BOTTOM THE PANEL RISES. Dann 2026-11-01 13:05: the header and the
 * music stay at the foot, where the thumb is, and Syllables or Corrections
 * open ABOVE them. The room is what lies between the fixed part and the top
 * gutter. At the top and at the seat the panel hangs below, as it always did.
 */

export type LoupeEdge = 'seat' | 'top' | 'bottom';

/** Where a tap on the header sends the card. */
export function nextEdge(edge: LoupeEdge, seatCentreY: number, viewportHeight: number): 'top' | 'bottom' {
	if (edge === 'top') return 'bottom';
	if (edge === 'bottom') return 'top';
	return seatCentreY < viewportHeight / 2 ? 'bottom' : 'top';
}

/**
 * How far a finger may wander and still be a tap. A swipe that closes the
 * Loupe (`isDismissSwipe`, 56 px) is far past this, so one gesture is never
 * both; a browser that sends the click after a swipe is answered here.
 */
export const TAP_SLOP_PX = 10;

export function isTap(dx: number, dy: number): boolean {
	return Math.hypot(dx, dy) <= TAP_SLOP_PX;
}

/** The card's top in CSS pixels, for the places that hang from the top. */
export function cardTop(edge: LoupeEdge, seatTop: number, shiftY: number, gutter: number): number {
	return edge === 'top' ? gutter : seatTop + shiftY;
}

/**
 * The panel's room: what is left of the screen after the fixed part. From the
 * top or the seat that is below the card's bottom edge, less `foot`; from the
 * bottom it is above the fixed part, less the gutter and `foot`.
 */
export function panelRoom(
	edge: LoupeEdge,
	viewportHeight: number,
	foot: number,
	gutter: number,
	fixedHeight: number,
	seatTop: number,
	shiftY: number,
): number {
	if (edge === 'bottom') return Math.max(0, viewportHeight - foot - gutter - fixedHeight);
	return Math.max(0, viewportHeight - foot - (cardTop(edge, seatTop, shiftY, gutter) + fixedHeight));
}
