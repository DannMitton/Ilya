/**
 * Each vowel's zone colour, as the CSS custom property that names it (`app.css`, "The vowel-space chart's zones"). Six
 * vowels have a colour of their own, the ones Bozeman charts; the four personal vowels share the Voice family's lavender
 * (Dann 2026-11-12: the chart is coded to Voice; the review's note that ruling 3 says one colour per vowel is carried to
 * the report, not settled here).
 */
import type { Vowel } from '../engine/types';

const ZONE_VAR: Record<Vowel, string> = {
	i: '--zone-i',
	e: '--zone-e',
	ɛ: '--zone-open-e',
	ɑ: '--zone-dark-a',
	o: '--zone-o',
	u: '--zone-u',
	ɪ: '--zone-personal',
	ɨ: '--zone-personal',
	a: '--zone-personal',
	ʌ: '--zone-personal'
};

/** `var(--zone-i)` and so on. */
export const zoneColour = (v: Vowel): string => `var(${ZONE_VAR[v]})`;
/** The property's name, for a test that reads `app.css`. */
export const zoneColourName = (v: Vowel): string => ZONE_VAR[v];
