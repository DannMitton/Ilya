/**
 * N.108 increment 1a: WHERE THE DESK ENDS.
 *
 * Ruled by Dann 2026-09-02: the desk keeps its drawer "at every width where
 * the 520 px drawer and the paper both fit", and below that "the layout is the
 * phone's". He estimated about 1340 px and asked for the measured figure.
 *
 * THE EXPECTATIONS ARE WRITTEN OUT, NOT COMPUTED. `layout.ts` copies three
 * numbers it cannot import, from a Svelte component's inline pixel width, a
 * stylesheet's `2rem`, and the drawer's own ruled width. If any of the three
 * moves and this file is not moved with it, these fail, which is the whole
 * reason they are literals: an expectation that took its value from the
 * mechanism under test would move silently with the defect.
 *
 * WHERE EACH NUMBER LIVES, so a later ship can find them:
 *   520  `+page.svelte`, `drawerWidth`
 *   816  `PAGE_SIZES.letter.width` in `$lib/page-config.ts`, set inline by
 *        `TitlePage.svelte`
 *   32   `.main-content { padding: 2rem }` in `+page.svelte`
 *   1399 the `@media` literal in `Drawer.svelte` and `+page.svelte`
 */

import { describe, it, expect } from 'vitest';
import {
	DRAWER_WIDTH,
	SHEET_WIDTH,
	DESK_PADDING,
	DESK_LAYOUT_MIN_WIDTH,
	isDeskLayout,
} from './layout';

describe('N.108 increment 1a the desk breakpoint', () => {
	it('carries the three widths the desk has to hold', () => {
		expect(DRAWER_WIDTH).toBe(520);
		expect(SHEET_WIDTH).toBe(816);
		expect(DESK_PADDING).toBe(32);
	});

	it('is their sum, and the sum is 1400', () => {
		expect(DESK_LAYOUT_MIN_WIDTH).toBe(1400);
		expect(DESK_LAYOUT_MIN_WIDTH).toBe(DRAWER_WIDTH + SHEET_WIDTH + DESK_PADDING * 2);
	});

	/* THE `@media` LITERAL IS ONE LESS THAN THE BREAKPOINT, and this is what
	   binds the stylesheet to this file: `max-width: 1399px` and
	   `isDeskLayout(1400)` have to name the same edge or a viewport would get
	   one layout's CSS and the other's props. */
	it('puts the CSS literal exactly one pixel below itself', () => {
		expect(DESK_LAYOUT_MIN_WIDTH - 1).toBe(1399);
	});

	it('gives the desk its layout at the width where both fit, and not below', () => {
		expect(isDeskLayout(1400)).toBe(true);
		expect(isDeskLayout(1399)).toBe(false);
	});

	it('gives the desk’s layout to a wide window', () => {
		expect(isDeskLayout(1440)).toBe(true);
		expect(isDeskLayout(1920)).toBe(true);
		expect(isDeskLayout(2560)).toBe(true);
	});

	/* The three viewports Dann walks. 1366 x 768 is a real laptop and it is
	   BELOW the breakpoint: a whole sheet does not fit beside the drawer
	   there, which is the finding this ship reports. */
	it('gives the phone’s layout to 1366, to a tablet, and to a phone', () => {
		expect(isDeskLayout(1366)).toBe(false);
		expect(isDeskLayout(1024)).toBe(false);
		expect(isDeskLayout(768)).toBe(false);
		expect(isDeskLayout(430)).toBe(false);
	});

	it('does not fall over on nothing', () => {
		expect(isDeskLayout(0)).toBe(false);
	});
});
