/**
 * A SHARE SAID AS A FRACTION (N.182, row 71; Dann 2026-10-11 23:19: "a human
 * being will respond better to 'about a third of your phonation time ...'",
 * and "a share too small for a fraction is not given as one").
 *
 * PURE. One table of constants, DESK DEFAULT, listed in the report: the band
 * each word covers, as a share of sung time from 0 to 1. Below `FRACTION_FLOOR`
 * no fraction is said, so the line says "some" or says nothing; a figure that
 * does not help a decision is not printed. The words themselves are strings
 * (`insights.key.fraction.<name>`).
 */

export type FractionName = 'quarter' | 'third' | 'nearHalf' | 'half' | 'most';

/** Under this share, no fraction is said. 0.2 is the smallest band's lower edge. */
export const FRACTION_FLOOR = 0.2;

/** Lower edge of each band, ascending; a band runs to the next one's edge. DESK DEFAULT, JUDGEMENT. */
export const FRACTION_BANDS: ReadonlyArray<{ from: number; name: FractionName }> = [
	{ from: 0.2, name: 'quarter' },
	{ from: 0.29, name: 'third' },
	{ from: 0.4, name: 'nearHalf' },
	{ from: 0.48, name: 'half' },
	{ from: 0.55, name: 'most' },
];

/** The fraction a share is said as, or null when it is too small to be given as one. */
export function fractionOf(share: number): FractionName | null {
	if (!Number.isFinite(share) || share < FRACTION_FLOOR) return null;
	let name: FractionName | null = null;
	for (const band of FRACTION_BANDS) if (share >= band.from) name = band.name;
	return name;
}
